d3.select(window).on('load', init);

function init() {


    //Load in GeoJSON data
    //d3.json("sfpd_districts.json", function(json) {
    d3.json("oceans.json", function(json) {


        var svg = d3.select('#map');

        //Width and height
        var w = 500;
        var h = 500;

        //Define map projection
        var projection = d3.geoMercator()
            .translate([w/2, h/2])
            .scale([w * 0.16]);

        //Define path generator
        var path = d3.geoPath()
            .projection(projection);



        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", "steelblue");

    });






}