d3.select(window).on('load', init);

function init() {
    var vis1 = d3.select('#hand');
    var width_vis1 = parseFloat(vis1.node().style.width);
    var height_vis1 = parseFloat(vis1.node().style.height);
    var pad_vis1 = 20;

    var vis2 = d3.select('#pca');
    var width_vis2 = parseFloat(vis2.node().style.width);
    var height_vis2 = parseFloat(vis2.node().style.height);
    var pad_vis2 = 150;


    // The index of the pca-coordinates.
    var pca_index = 0;

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

            var xScale = d3.scaleLinear()
                .domain([0,
                    d3.max(zipped_xy,
                        function (d) {
                            return (d)[0];
                        })])
                .range([pad_vis1, width_vis1 - pad_vis1]);

            var yScale = d3.scaleLinear()
                .domain([d3.min(zipped_xy,
                    function (d) {
                        return d[1];
                    }),
                    d3.max(zipped_xy,
                        function (d) {
                            return d[1];
                        })])
                .range([height_vis1 - pad_vis1, pad_vis1]);

            var circles = d3.select('#hand')
                .selectAll('circle')
                .data(zipped_xy);

            circles.enter()
                .append('circle')
                .attr('r', '3px')
                .merge(circles)
                .transition()
                .attr('cx', function (d) {

                    return '' + xScale(d[0]) + 'px';

                })
                .attr('cy', function (d) {
                    return '' + yScale(d[1]) + 'px';
                });


            // Make lines between dots, when hovered over.
            vis1.on("mouseover", function() {

                var line = d3.line()
                    .x(function x (d) {
                        return xScale(d[0]);
                    })
                    .y(function y (d) {
                        return yScale(d[1]);
                    })
                    .defined(function defined (d, i) {
                        return true;
                    });


                var long_line = vis1.append("path")
                    .attr("class", "line")
                    .attr("fill", "none")
                    .style("stroke", "#000")
                    .attr("d", line(zipped_xy));



            });
            vis1.on("mouseout", function() {

                d3.selectAll("path.line").remove();

            });
        });
    }


    // Generates the first hand:
    updateHand(pca_index);


    function updatePCA(new_pca_index1, new_pca_index2) {
        // Plot the pca:

        d3.text("hands_pca.csv", function(text) {
            var pca_data = d3.csvParseRows(text, function(d) {
                return d.map(Number);
            });

            console.log("Pca is right here maaaaaaaaaaaaaaaaaaaaaaaaaaayn:");
            console.log(pca_data);

            // Which Principal Components to take? We start with PC 0 and PC 1:
            index_x = new_pca_index1;
            index_y = new_pca_index2;
            // in each row, takes these two indeces.

            var pca_xScale = d3.scaleLinear()
                .domain([0,
                    d3.max(pca_data,
                        function (d) {
                            return d[index_x];
                        })])
                .range([pad_vis2, width_vis2 - pad_vis2]);

            var pca_yScale = d3.scaleLinear()
                .domain([d3.min(pca_data,
                    function (d) {
                        return d[index_y];
                    }),
                    d3.max(pca_data,
                        function (d) {
                            return d[index_y];
                        })])
                .range([height_vis2 - pad_vis2, pad_vis2]);

            var pca_circles = d3.select('#pca')
                .selectAll('circle')
                .data(pca_data);

            pca_circles.enter()
                .append('circle')
                .attr('r', '4px')
                .merge(pca_circles)
                .attr('cx', function (d) {

                    return '' + pca_xScale(d[index_x]) + 'px';

                })
                .attr('cy', function (d) {
                    return '' + pca_yScale(d[index_y]) + 'px';
                })
                .on("click", function(d, i) {

                    updateHand(i);
                    d3.select("body")
                        .select("#handInfo")
                        .text("" + i);
                    d3.select('#pca').selectAll('circle').attr('fill','black');
                    d3.select(this).attr('fill','red');


                })
                /*.append('title')
                .text(function(d,i) {
                    return "Index " + i;
                })*/
                .on("mouseover", function(d,i){
                    d3.select(".tooltip")
                        .style('visibility', 'visible')
                        .text("Index " + i)
                        .style('left', '' + pca_xScale(d[index_x]) + 'px')
                        .style('top', '' + (pca_yScale(d[index_y])-3) + 'px');


                })
                .on("mouseout", function(){
                    d3.select(".tooltip")
                        .style('visibility', 'hidden');
                });

        });
    }

    // First pca-plot:
    updatePCA(pca_index, pca_index + 1);


    some_data1 = d3.range(-1, 19);
    console.log("here is the range:");
    console.log(some_data1);


    d3.select("#p1").select("ul")
        .selectAll("li")
        .data(some_data1)
        .enter()
        .append("li")
        .text(function (d) {
            return "" + d + " , " + (d + 1);
        })
        .on("click", function(d, i) {

            d3.select("#p1").select("ul")
                .selectAll("li").style("color", "black");
            d3.select("#p2").select("ul")
                .selectAll("li").style("color", "black");

            d3.select(this)
                .style("color", "red");

            updatePCA(d, d+1);


        });

    some_data2 = d3.range(19, 38);
    console.log("here is the range:");
    console.log(some_data2);


    d3.select("#p2").select("ul")
        .selectAll("li")
        .data(some_data2)
        .enter()
        .append("li")
        .text(function (d) {
            return "" + d + " , " + (d + 1);
        })
        .on("click", function(d, i) {

            d3.select("#p1").select("ul")
                .selectAll("li").style("color", "black");
            d3.select("#p2").select("ul")
                .selectAll("li").style("color", "black");

            d3.select(this)
                .style("color", "red");

            updatePCA(d, d+1);


        });






    d3.select("#p1").select("ul")
        .selectAll("li")
        .style("color", function (d, i) {
            if (i === 1) {
                return "red";
            }
            else {
                return "black";
            }
        });
}
