d3.select(window).on('load', init);

global_weekday = "Monday";
global_hour = ["00", "01", "02"];

function create_map(svg, path) {
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

function create_points(svg,projection, weekday, hour) {

    d3.json("sf_crime.geojson", function(crimes) {

        var violent_cats = new Set(["ASSAULT",
            "ROBBERY",
            "SEX OFFENSES FORCIBLE",
            "KIDNAPPING",
            "ARSON",
            "EXTORTION",
            "SUICIDE"]);

        var thieving_cats = new Set(['BURGLARY',
            'LARCENY/THEFT',
            'STOLEN PROPERTY',
            'VEHICLE THEFT']);

        var circles = svg.selectAll("circle")
            .data(crimes.features
                .filter(function (d) {

                    if (weekday === "Whole week" && hour === "Whole day") {
                        return d;
                    }
                    else {
                        if (weekday === "Whole week") {
                            // only look at hours:
                            if (hour.includes(d.properties.Dates.slice(11,13))) {
                                return d;
                            }
                        }
                        else if (hour === "Whole day") {
                            // only look at day:
                            if (d.properties.DayOfWeek === weekday) {
                                return d;
                            }
                        }
                        else {
                            // look at both day and hours:
                            if (hour.includes(d.properties.Dates.slice(11,13)) && d.properties.DayOfWeek === weekday) {
                                return d;
                            }

                        }
                    }

                })
            );

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
            .style('fill', 'none')
            .attr("stroke", function(d){

                if (violent_cats.has(d.properties.Category)) {
                    return "red";
                } else if (d.properties.Category === "PROSTITUTION") {
                    return "orange";
                } else if (thieving_cats.has(d.properties.Category)) {
                    return "magenta";
                } else {
                    return "black";
                }
            });
        circles.exit().remove();
    });
}

function init() {
    
    var weekday = global_weekday;
    var hour = global_hour;

    //Getting width and height from html element, + zooming, yay
    var svg = d3.select("svg")
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.event.transform)
            }))
            .append("g"),
        w = +svg.attr("width"),
        h = +svg.attr("height");

    //projection
    projection = d3.geoMercator()
        .center([-122.410217, 37.780755 ])
        .scale(250000);
        //.translate([width/1.95, height / 1.65]);
        //.translate([w/2, h/2]);
    //.scale([w * 0.16]);

    //path
    path = d3.geoPath()
        .projection(projection);

    create_map(svg, path);

    create_points(svg, projection, weekday, hour);


    var numberToWeekday = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday",
        8: "Whole week"};

    var slider = document.getElementById("weekRange");

    slider.oninput = function() {
        //output.innerHTML = numberToWeekday[this.value];

        new_weekday = numberToWeekday[this.value];

        global_weekday = new_weekday;


        d3.select("#week_slider_value").text(new_weekday);

        create_points(svg, projection, new_weekday, global_hour);

    };

    var numberToHour = {
        1: ["00", "01", "02"],
        2: ["03", "04", "05"],
        3: ["06", "07", "08"],
        4: ["09", "10", "11"],
        5: ["12", "13", "14"],
        6: ["15", "16", "17"],
        7: ["18", "19", "20"],
        8: ["21", "22", "23"],
        9: "Whole day"};

    var slider2 = document.getElementById("hourRange");

    slider2.oninput = function() {

        var hours = numberToHour[this.value];

        global_hour = hours;

        if (typeof(hours) === 'string'){d3.select("#hour_slider_value").text(hours);}
        else d3.select("#hour_slider_value").text(hours[0].toString() + '-' + (hours[2][0]+ (+hours[2][1]+1)).toString());

        create_points(svg, projection, global_weekday, hours);
    };
}
