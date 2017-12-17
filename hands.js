d3.select(window).on('load', init);

function init() {
    var vis1 = d3.select('#hand');
    var width = parseFloat(vis1.node().style.width);
    var height = parseFloat(vis1.node().style.height);
    var padding = 15;

        //function (error, hand_data) {
            //if (error) throw error;   Do we need error check? where?

    //Starting with plotting a single hand (row) from hands.csv . As there is no header is has to be read with tsvParseRows
    d3.text('hands_xy_flipped.txt', function(text) {
        var hand_data = d3.tsvParseRows(text, function(d) {
            return d[0];
        });

        /* hand_data is now an array of 56 "x,y" hand coordinate pairs.
        It is the first COLUMN of hands_xy_flipped.txt, I was thinking it would be nice to plot 1 hand
        The combined coordinates of each COLUMN in the file show a hand.
        The coordinates are seperated by a comma and can be split with the following:
         */
        var coords = d3.csvParseRows(hand_data.join())[0];
        //BUT we need to select each PAIR before we split them like this, I think

        //Just to view data in console
        console.log(hand_data);
        console.log(coords);
        //var xs = hand_data.slice(0,56);  old shit, ignore these 2 lines
        //var ys = hand_data.slice(57);
        console.log(d3.max(hand_data));
        console.log(d3.max(coords)); //this is the only list I think it makes sense to check max on

            var xScale = d3.scaleLinear()
                .domain([0,
                    d3.max(coords,  //may need to check another max, not sure, but it depends on input below
                        function (d) {
                        console.log(d[0]);
                            return (d)[0];
                        })])
                .range([padding, width - padding]);
/*
        var xScale = d3.scaleLinear()          backup copy paste cause I forget
            .domain([0,
                d3.max(hand_data,
                    function (d) {
                        return d[0];
                    })])
            .range([padding, width - padding]);
*/

        var yScale = d3.scaleLinear()
                .domain([d3.min(coords,
                    function (d) {
                        return d[1];
                    }),
                    d3.max(coords,
                        function (d) {
                            return d[1];
                        })])
                .range([height - padding, padding]);

        function xyRead(pair) {
            return d3.csvParseRows(pair)[0]; //parses string 'x,y' and returns list [x,y]
        }

            d3.select('#hand')
                .selectAll('circle')
                .data(hand_data)
                .enter()
                .append('circle')
                .attr('r', '3px')
                .attr('cx', function (d) {
                    console.log(xyRead(d)[0]);
                    return '' + xScale(xyRead(d)[0]) + 'px'; //passes x coordinate to xScale
                })
                .attr('cy', function (d) {
                    return '' + yScale(xyRead(d)[1]) + 'px'; //passes y coordinate to yScale
                });




             //We probably don't need axis, but just to see if it changes anything

            d3.select('#hand')
                .append('g')
                .call(d3.axisBottom(xScale));
            d3.select('#hand')
                .append('g')
                .call(d3.axisRight(yScale));
        });
}
