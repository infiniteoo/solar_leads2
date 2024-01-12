// Import necessary libraries
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import LeadForm from "./LeadForm"; // Import your LeadForm component

// Component for the StateMap
const StateMap = () => {
  const [us, setUs] = useState(null);
  const [counties, setCounties] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load JSON files directly from your project folder
        const usData = await import("../data/us.json").then(
          (res) => res.default
        );
        const countiesData = await import("../data/counties.json").then(
          (res) => res.default
        );

        setUs(usData);
        setCounties(countiesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (us && counties) {
      const width = 600;
      const height = 800;
      const projection = d3.geoAlbers();
      const path = d3.geoPath().projection(projection);
      const countyNameMap = new Map();

      const svg = d3
        .select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const countiesGroup = svg.append("g").attr("class", "counties-group");
      const labelsGroup = svg.append("g").attr("class", "labels-group");

      const states = topojson.feature(us, us.objects.states);
      const state = states.features.filter((d) => d.id === 6)[0];

      projection.scale(1).translate([0, 0]);

      const b = path.bounds(state);
      const s =
        0.95 /
        Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
      const t = [
        (width - s * (b[1][0] + b[0][0])) / 2,
        (height - s * (b[1][1] + b[0][1])) / 2,
      ];

      projection.scale(s).translate(t);

      svg
        .append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("class", "mesh")
        .attr("d", path);

      svg
        .append("path")
        .datum(state)
        .attr("class", "outline")
        .attr("d", path)
        .attr("id", "land")
        .style("stroke-width", 0); // Set stroke width to zero

      svg
        .append("clipPath")
        .attr("id", "clip-land")
        .append("use")
        .attr("xlink:href", "#land");

      counties.forEach((county) => {
        countyNameMap.set(county.id, county.properties.name);
      });

      labelsGroup
        .selectAll(".county-label")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter()
        .append("text")
        .attr("class", "county-label")
        .style("display", "none");

      countiesGroup
        .selectAll(".county")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("county-id", (d) => d.id)
        .attr("clip-path", "url(#clip-land)")
        .attr("class", "county")
        .on("mouseover", function (event, d) {
          const countyId = d.id;

          if (countyId !== undefined) {
            const countyName = countyNameMap.get("0" + countyId);

            if (countyName) {
              d3.select(".county-label")
                .text(countyName)
                .attr(
                  "transform",
                  "translate(" + projection(d3.geoCentroid(d)) + ")"
                )
                .style("display", "flex");
            } else {
              console.warn("No name property found for county ID:", countyId);
            }
          } else {
            console.warn("County ID is undefined:", d);
          }
        })
        .on("mouseout", function () {
          d3.select(".county-label").style("display", "none");
        })
        .on("click", function (event, d) {
          const countyId = d.id;

          if (countyId !== undefined) {
            const countyName = countyNameMap.get("0" + countyId);

            if (countyName) {
              setSelectedCounty(countyName);
            } else {
              console.warn("No name property found for county ID:", countyId);
            }
          } else {
            console.warn("County ID is undefined:", d);
          }
        })
        .style(
          "fill",
          () => "#" + Math.floor(Math.random() * 16777215).toString(16)
        );
    }
  }, [us, counties]);

  const resetForm = () => {
    setSelectedCounty(null);
  };

  return (
    <div className="container">
      <div id="map-container" className="map"></div>
      {/* Render the LeadForm component only when a county is selected */}
      {selectedCounty && (
        <LeadForm county={selectedCounty} resetForm={resetForm} />
      )}
    </div>
  );
};

export default StateMap;
