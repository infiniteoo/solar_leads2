"use client";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";

const StateMap = () => {
  const [us, setUs] = useState(null);
  const [counties, setCounties] = useState(null);

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
        console.log(countiesData);
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
        .select("body")
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
        .attr("id", "land");

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
              d3.select("#popup")
                .style("display", "flex")
                .style("left", "calc(25% + 150px)")
                .style("top", "150%");

              document.getElementById("county").value = countyName;
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

  const submitForm = () => {
    const successMessage = document.getElementById("successMessage");
    successMessage.style.display = "block";

    const popup = document.getElementById("popup");
    popup.style.display = "none";

    // Implement your email sending logic here
    const county = document.getElementById("county").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const provider = document.getElementById("provider").value;
    const averagebill = document.getElementById("averagebill").value;

    // You can use an API endpoint or a server-side script to handle the email sending
    // For example, using fetch to send the data to a server-side script
    // Update the fetch request in the submitForm function
    fetch("/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        county: county,
        name: name,
        email: email,
        phone: phone,
        provider: provider,
        averagebill: averagebill,
        address: address,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Email sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <div id="popup" className="popup">
      <h2 className="mb-10">Contact Form</h2>
      <form id="contactForm">
        <label htmlFor="name">Your Name:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="phone">Phone:</label>
        <input type="tel" id="phone" name="phone" required />

        <label htmlFor="address">Address:</label>
        <input type="text" id="address" name="address" required />

        <label htmlFor="provider">Current Utility Provider:</label>
        <input type="text" id="provider" name="provider" required />

        <label htmlFor="averagebill">Average Monthly Bill:</label>
        <input type="text" id="averagebill" name="averagebill" required />

        <label htmlFor="county">County:</label>
        <input type="text" id="county" name="county" readOnly />
        <button type="button" onClick={submitForm}>
          Submit
        </button>
      </form>

      <div id="successMessage" style={{ display: "none" }}>
        We will contact you shortly.
      </div>
    </div>
  );
};

export default StateMap;
