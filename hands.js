d3.select(window).on('load', init);

function init() {
    var vis1 = d3.select('#hand');
    var width = parseFloat(vis1.node().style.width);
    var height = parseFloat(vis1.node().style.height);
    var padding = 15;


    // The index of the pca-coordinates.
    var pca_index = 13;

    function updateHand(pca_index) {

        d3.text("hands.csv", function(text) {
            var data = d3.csvParseRows(text, function(d) {
                return d.map(Number);
            });
            // Now do something with data

            this_hand = data[pca_index];
            x_array = this_hand.slice(0, this_hand.length/2);
            y_array = this_hand.slice(this_hand.length/2, this_hand.length);
            zipped_xy = d3.zip(x_array, y_array);


            /*console.log("see here mate:");
            console.log(this_hand);
            console.log(this_hand.length);
            console.log(x_array.length);
            console.log(x_array);
            console.log(y_array.length);
            console.log(y_array);*/



            var xScale = d3.scaleLinear()
                .domain([0,
                    d3.max(zipped_xy,  //may need to check another max, not sure, but it depends on input below
                        function (d) {
                            return (d)[0];
                        })])
                .range([padding, width - padding]);

            var yScale = d3.scaleLinear()
                .domain([d3.min(zipped_xy,
                    function (d) {
                        return d[1];
                    }),
                    d3.max(zipped_xy,
                        function (d) {
                            return d[1];
                        })])
                .range([height - padding, padding]);

            var circles = d3.select('#hand')
                .selectAll('circle')
                .data(zipped_xy)

            circles.enter()
                .append('circle')
                .attr('r', '3px')
                .merge(circles)
                .attr('cx', function (d) {

                    return '' + xScale(d[0]) + 'px';

                })
                .attr('cy', function (d) {
                    return '' + yScale(d[1]) + 'px';
                })



            /*d3.select('#hand')
                .selectAll('circle')
                .data(zipped_xy)
                .enter()
                .append('circle')
                .attr('r', '3px')
                .attr('cx', function (d) {

                    return '' + xScale(d[0]) + 'px';

                })
                .attr('cy', function (d) {
                    return '' + yScale(d[1]) + 'px';
                })*/




        });
    }


    // Generates the first hand:
    updateHand(pca_index);

    d3.select("body")
        .select("#p10")
        .on("click", function() {

            //d3.select("body").select("#p10").text("hej");
            console.log("pressed!");
            updateHand(10);
        });
    d3.select("body")
        .select("#p20")
        .on("click", function() {

            //d3.select("body").select("#p10").text("hej");
            console.log("pressed!");
            updateHand(20);
        });




}
