// script.js
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

fetch(url)
  .then(response => response.json())
  .then(data => {
    const dataset = data.monthlyVariance;

    const width = 1200;
    const height = 500;
    const padding = 60;

    const svg = d3.select('#heatmap')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const baseTemperature = data.baseTemperature;
    const years = dataset.map(d => d.year);
    const months = dataset.map(d => d.month);

    const xScale = d3.scaleBand()
      .domain(years)
      .range([padding, width - padding]);

    const yScale = d3.scaleBand()
      .domain(months)
      .range([padding, height - padding]);

    const colorScale = d3.scaleQuantize()
      .domain([baseTemperature + d3.min(dataset, d => d.variance), baseTemperature + d3.max(dataset, d => d.variance)])
      .range(['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']);

    svg.selectAll('.cell')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(d.year))
      .attr('y', d => yScale(d.month))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(baseTemperature + d.variance))
      .attr('data-month', d => d.month - 1)
      .attr('data-year', d => d.year)
      .attr('data-temp', d => baseTemperature + d.variance)
      .on('mouseover', (event, d) => {
        const tooltip = d3.select('#tooltip');
        tooltip
          .attr('data-year', d.year)
          .style('opacity', 0.9)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 40 + 'px')
          .html(`
            ${d.year} - ${getMonthName(d.month - 1)}<br/>
            Variance: ${d.variance.toFixed(2)}℃<br/>
            Temperature: ${(baseTemperature + d.variance).toFixed(2)}℃
          `);
      })
      .on('mouseout', () => {
        d3.select('#tooltip')
          .style('opacity', 0);
      });

    const xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain().filter(year => year % 10 === 0))
      .tickFormat(d3.format('d'));

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height - padding})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(month => getMonthName(month - 1));

    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding}, 0)`)
      .call(yAxis);

    const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width - padding * 3}, ${padding})`);

    const legendColors = colorScale.range();
    const legendWidth = 25;
    const legendHeight = 20;

    legend.selectAll('.legend-item')
      .data(legendColors)
      .enter()
      .append('rect')
      .attr('class', 'legend-item')
      .attr('x', (_, i) => i * legendWidth)
      .attr('y', 0)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('fill', d => d);

    legend.append('text')
      .attr('x', -legendHeight)
      .attr('y', legendHeight * 1.5)
      .attr('text-anchor', 'end')
      .text((baseTemperature + d3.min(dataset, d => d.variance)).toFixed(2));

    legend.append('text')
      .attr('x', legendColors.length * legendWidth + legendHeight)
      .attr('y', legendHeight * 1.5)
      .attr('text-anchor', 'start')
      .text((baseTemperature + d3.max(dataset, d => d.variance)).toFixed(2));

    function getMonthName(month) {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[month];
    }
  });