d3.select(window).on('load', init);

function create_map(svg, path) {

    //d3.json("sfpd_districts.json", function(json) {
    d3.json("SanFrancisco.Neighborhoods.json", function(json) {

        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", "steelblue");

    });

}

function create_points(svg,projection, weekday) {

    d3.json("sf_crime.geojson", function(crimes) {

        /*var categToNumber = new Map();

        var all_categories = new Set();

        for(var i =0; i<crimes.features.length;i++)
        {
            var elem = crimes.features[i].properties.Category;

            /!*console.log("###############");
            console.log(elem);
            console.log("###############");*!/

            all_categories.add(elem);

            if(!categToNumber.has(elem))
            {
                categToNumber.set(elem, categToNumber.size)
            }
        }

        console.log(categToNumber);
        console.log(all_categories);*/


        var violent_cats = new Set(["ASSAULT",
            "ROBBERY",
            "SEX OFFENSES FORCIBLE",
            "KIDNAPPING",
            "ARSON",
            "EXTORTION",
            "SUICIDE"]);

        console.log(violent_cats);


        var circles = svg.selectAll("circle")
            .data(crimes.features
                .filter(function (d) {

                    if (d.properties.DayOfWeek === weekday) {
                        return d;
                    }}));

        circles.enter()
            .append("circle")
            .attr("r",2)
            .merge(circles)
            .attr("cx", function(d){
                return projection(d.geometry.coordinates)[0]
            })
            .attr("cy", function(d){
                return projection(d.geometry.coordinates)[1]
            })
            .attr("fill", function(d){

                if (violent_cats.has(d.properties.Category)) {
                    return "red";
                } else if (d.properties.Category === "PROSTITUTION") {
                    return "orange";
                } else {
                    return "black";
                }
            })



    });

}

function init() {

    svg = d3.select('#map');

    var weekday = "Monday";
    //var weekday = "Wednesday";

    //Width and height
    var w = 500;
    var h = 500;

    //projection
    projection = d3.geoMercator()
        .center([-122.433701, 37.767683])
        .scale(170000)
        //.translate([width / 1.95, height / 1.65]);
        .translate([w/2, h/2]);
    //.scale([w * 0.16]);

    //path
    path = d3.geoPath()
        .projection(projection);

    create_map(svg, path);

    create_points(svg, projection, weekday);

    var numberToWeekday = {
                            1: "Monday",
                            2: "Tuesday",
                            3: "Wednesday",
                            4: "Thursday",
                            5: "Friday",
                            6: "Saturday",
                            7: "Sunday"};

    var slider = document.getElementById("myRange");

    slider.oninput = function() {
        //output.innerHTML = numberToWeekday[this.value];

        new_weekday = numberToWeekday[this.value];

        console.log(this.value);
        console.log(new_weekday);

        d3.select("#slider_value").text(new_weekday);

        create_points(svg, projection, new_weekday);

    }



}


