d3.select(window).on('load', init);

function init() {
    var vis1 = d3.select('#hand');
    var width = parseFloat(vis1.node().style.width);
    var height = parseFloat(vis1.node().style.height);
    var padding = 15;

    var pca_index = 13;

    function transpose(a) {
        // http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
        return Object.keys(a[0]).map(function(c) {
            return a.map(function(r) { return r[c]; });
        });
    }

    function zip(arrays) {
        return arrays[0].map(function(_,i){
            return arrays.map(function(array){return array[i]})
        });
    }


    d3.text("hands.csv", function(text) {
        var data = d3.csvParseRows(text, function(d) {
            return d.map(Number);
        });
        // Now do something with data

        this_hand = data[pca_index];
        x_array = this_hand.slice(0, this_hand.length/2);
        y_array = this_hand.slice(this_hand.length/2, this_hand.length);
        zipped_xy = zip([x_array, y_array]);


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



        d3.select('#hand')
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
            })




    });

}
