// Fetch the dataset
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(function (data) {
    // Data parsing and transformation
    const parseTime = d3.timeParse('%M:%S');
    data.forEach(function (d) {
      d.Place = +d.Place;
      d.Seconds = parseTime(d.Time);
    });

    // Chart dimensions
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
      .range([0, width]);

    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Seconds))
      .range([0, height]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

    // Add axes to the chart
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .call(yAxis);

    // Add dots to represent the data points
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(d.Seconds))
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => d.Seconds.toISOString())
      .on('mouseover', showTooltip)
      .on('mouseout', hideTooltip);

    // Add legend
    const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', 'translate(' + (width - 100) + ',' + (height - 20) + ')');

    legend.append('circle')
      .attr('class', 'dot')
      .attr('r', 6);

    legend.append('text')
      .attr('x', 10)
      .attr('y', 5)
      .text('Riders doping');
  });

// Tooltip functions
function showTooltip(d) {
  const tooltip = d3.select('#tooltip');
  tooltip.style('display', 'block');
  tooltip.attr('data-year', d.Year);

  const formatTime = d3.timeFormat('%M:%S');
  const timeString = formatTime(d.Seconds);

  tooltip.html(
    'Year: ' + d.Year + '<br>' +
    'Time: ' + timeString + (d.Doping ? '<br>' + d.Doping : '')
  );

  tooltip.style('left', d3.event.pageX + 10 + 'px');
  tooltip.style('top', d3.event.pageY + 'px');
}

function hideTooltip() {
  d3.select('#tooltip').style('display', 'none');
}