d3.select(window).on('load', init);

function init() {


    //d3.json("sfpd_districts.json", function(json) {
    d3.json("SanFrancisco.Neighborhoods.json", function(json) {
        d3.json("sf_crime.geojson", function(crimes) {
            var svg = d3.select('#map');

            //Width and height
            var w = 500;
            var h = 500;

            //projection
            var projection = d3.geoMercator()
                .center([-122.433701, 37.767683])
                .scale(170000)
                //.translate([width / 1.95, height / 1.65]);
                .translate([w/2, h/2]);
            //.scale([w * 0.16]);

            //path
            var path = d3.geoPath()
                .projection(projection);

            //Bind data and create one path per GeoJSON feature
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", "steelblue");

            //var elem = crimes.features[0]

            var categToNumber = new Map();

            var all_categories = new Set();

            var violent_cats = new Set(["ASSAULT",
                                "ROBBERY",
                                "SEX OFFENSES FORCIBLE",
                                "KIDNAPPING",
                                "ARSON",
                                "EXTORTION",
                                "SUICIDE"]);

            for(var i =0; i<crimes.features.length;i++)
            {
                var elem = crimes.features[i].properties.Category;

                /*console.log("###############");
                console.log(elem);
                console.log("###############");*/

                all_categories.add(elem);

                if(!categToNumber.has(elem))
                {
                    categToNumber.set(elem, categToNumber.size)
                }
            }

            console.log(categToNumber);
            console.log(all_categories);
            console.log(violent_cats);

            svg.selectAll("circle")
                .data(crimes.features)
                .enter()
                .append("circle")
                .attr("cx", function(d){
                    return projection(d.geometry.coordinates)[0]
                })
                .attr("cy", function(d){
                    return projection(d.geometry.coordinates)[1]
                })
                .attr("r",2)
                .attr("fill", function(d){

                    if (violent_cats.has(d.properties.Category)) {
                        return "red";
                    } else if (d.properties.Category === "PROSTITUTION") {
                        return "orange";
                    } else {
                        return "black";
                    }

                })

            //console.log(projection(elem.geometry.coordinates));

        });

    });
}




