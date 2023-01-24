import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2'

export function LineChart({ name, data }) {

    if (!data) return (<div className='chart'/>)

    const options = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: name ?? 'Status'
          },
        },
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
          },
          y: {
            display: true,
            suggestedMin: 0,
            suggestedMax: 500,
            stacked: true
          },
          
        },
        elements: {
          point: {
              radius: 0
          }
        },
        maintainAspectRatio: false,
        animation: {
            duration: 700
        }
    };

    const x = data[0]?.map((item) => item) ?? [];
    const y = data[1]?.map((item) => item) ?? [];

    const series = {
        labels: x.map((item) => {
            const date = new Date(item);
            let hours = date.getHours(); hours = hours % 12; hours = hours ? hours : 12;

            return `${hours}:${date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
        }),
        datasets: [{
                label: 'Ping (ms)',
                data: y.map((item) => +((item).toFixed(4) * 1000).toFixed(2)),
                tension: 0.1
            }
        ]
    }

    return <Line options={options} data={series}></Line>


}

export default LineChart;