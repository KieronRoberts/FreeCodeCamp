// Fetch the GDP data
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(data => {
    const dataset = data.data;

    // Set up chart dimensions and margins
    const margin = {
      top: 60,
      right: 40,
      bottom: 60,
      left: 60
    };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select('#chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(dataset.map(d => new Date(d[0])))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .call(yAxis);

    // Create bars
    svg.selectAll('.bar')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .attr('x', d => xScale(new Date(d[0])))
      .attr('y', d => yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d[1]))
      .on('mouseover', (event, d) => {
        const tooltip = d3.select('#tooltip');
        tooltip.style('display', 'block')
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY + 10 + 'px')
          .attr('data-date', d[0])
          .html(`${d[0]}<br>${d[1]} Billion USD`);
      })
      .on('mouseout', () => {
        d3.select('#tooltip').style('display', 'none');
      });

  })
  .catch(error => console.log(error));
