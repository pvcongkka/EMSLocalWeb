window.onload = function () {
    // Initial data with two series
    let data = [
        // Example initial data
        { time: "00:00", value: 10, category: "Battery rack Charge Power(kW)" },
        { time: "00:00", value: 20, category: "Battery rack DisCharge Power(kW)" }
    ];

    // G2Plot Line Chart Configuration
    const lineChart = new G2Plot.Line("lineChart", {
        data,
        xField: "time",
        yField: "value",
        seriesField: "category", // Use seriesField to distinguish lines
        smooth: true, // Smooth curve
        tooltip: {
            showMarkers: true,
        },
        legend: {
            position: "top", // Position of the legend
            itemName: {
                style: {
                    fontSize: 14, // Font size for legend
                    fill: "#000", // Font color for legend
                },
            },
        },
        yAxis: {
            title: {
                text: "kW",
                style: {
                    fontSize: 14, // Font size for y-axis title
                    fill: "#000", // Font color for y-axis title
                },
            },
            grid: {
                line: {
                    style: {
                        stroke: "#d9d9d9",
                        lineWidth: 1,
                        lineDash: [4, 4],
                    },
                },
            },
            label: {
                style: {
                    fontSize: 12, // Font size for y-axis labels
                    fill: "#000", // Font color for y-axis labels
                },
            },
        },
        xAxis: {
            label: {
                style: {
                    fontSize: 12, // Font size for x-axis labels
                    fill: "#000", // Font color for x-axis labels
                },
            },
        },
        interactions: [
            {
                type: "brush",
                cfg: {
                    type: "x",
                    style: {
                        fill: "rgba(0, 0, 255, 0.3)",
                        stroke: "#0000FF",
                        lineWidth: 2,
                    },
                },
            },
        ],
    });

    // Render the chart
    lineChart.render();

    // Function to simulate receiving new data
    function getNewData() {
        const currentTime = new Date();
        const minutes = String(currentTime.getMinutes()).padStart(2, "0");
        const seconds = String(currentTime.getSeconds()).padStart(2, "0");
        const formattedTime = `${currentTime.getHours()}:${minutes}:${seconds}`;

        // Randomly generate new values for both series
        const newValue1 = Math.floor(Math.random() * 20) + 10;
        const newValue2 = Math.floor(Math.random() * 30) + 20;

        // Add new data points for both series
        data.push({ time: formattedTime, value: newValue1, category: "Battery rack Charge Power(kW)" });
        data.push({ time: formattedTime, value: newValue2, category: "Battery rack DisCharge Power(kW)" });

        // Update the chart with new data
        lineChart.changeData(data);
    }

    // Update the chart every 2 seconds
    setInterval(getNewData, 100);

    // Add double-click event listener to reset the chart
    document
        .getElementById("lineChart")
        .addEventListener("dblclick", function () {
            lineChart.update({
                data: data.slice(0, 10), // Reset to initial data
            });
            lineChart.render();
        });
};
