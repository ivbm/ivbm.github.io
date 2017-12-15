d3.select(window).on('load', init);

function init() {
    //var hand_data =

    var vis1 = d3.select('#hand');
    var width = parseFloat(vis1.node().style.width);
    var height = parseFloat(vis1.node().style.height);
    var padding = 15;

        //function (error, hand_data) {
            //if (error) throw error;   Do we need error check? where?

    //Starting with plotting a single hand (row) from hands.csv . As there is no header is has to be read with csvParse
    d3.text('hands.csv', function(text) {
        var hand_data = d3.csvParse(text, function(d) {
            return d[0];
        });

        /* hand_data is now an array of 112 items, the 56 first ones are x-coordinates and the following are y-coordinates
        I've been trying to slice it into 2 new arrays below, but they don't contain items and I dunno why
         */
        console.log(hand_data);
        var xs = hand_data.slice(0,56);
        var ys = hand_data.slice(57);


        console.log(xs);

        /*Need adjusting for xs and ys

            var xScale = d3.scaleLinear()
                .domain([0,
                    d3.max(hand_data,
                        function (d) {
                            return d[0];
                        })])
                .range([padding, width - padding]);

            var yScale = d3.scaleLinear()
                .domain([d3.min(hand_data,
                    function (d) {
                        return d[1];
                    }),
                    d3.max(hand_data,
                        function (d) {
                            return d[1];
                        })])
                .range([height - padding, padding]);

            d3.select('#hand')
                .selectAll('circle')
                .data(hand_data)
                .enter()
                .append('circle')
                .attr('r', '3px')
                .attr('cx', function (d) {
                    return '' + xScale(d[0]) + 'px';
                })
                .attr('cy', function (d) {
                    return '' + yScale(d[1]) + 'px';
                })

                */

           /*
             We probably don't need axis

            d3.select('#hand')
                .append('g')
                .call(d3.axisBottom(xScale));
            d3.select('#hand')
                .append('g')
                .call(d3.axisRight(yScale));*/
        });
}