import { useEffect, useState } from "react";
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Chart = () => {
    const [topCountries, setTopCountries] = useState([]);

    const getTotalUsers = async (currentPage) => {
		await fetch(
			`https://randomuser.me/api/?results=500`,
			{
				dataType: "json",
			}
		)
			.then((response) => response.json())
			.then((data) => {
				let userD = [];
				data.results.map((result) =>{
                    let findData = userD.find(a=>a.country === result.location.country);
                    let indexD = userD.findIndex(a=>a.country === result.location.country);
                    if(findData){
                        userD[indexD]['value'] += 1;
                    }else{
                        userD.push({'country':result.location.country,value:1})
                    }
                    return userD;
                });
                userD.sort((a,b)=>{
                    return b.value - a.value
                })
                const topData = userD.splice(0,5);
				
                const total = userD.reduce((c,item)=>{
                    return c += item.value
                },0);
                topData.push({'country':'Other','value':total})
                const totalUsers = topData.reduce((c,item)=>{
                    return c += item.value
                },0);
                topData.map((u,index)=>{
                    return topData[index]['percentage'] = (u.value / totalUsers * 100).toFixed(2); 
                });
                let pieData = [];
                topData.map((item)=>{
                   return pieData.push({'y':item.percentage,'label':item.country})
                });
                setTopCountries(pieData);
			});
	};
    useEffect(() => {
		getTotalUsers();
	}, []);

    const options = {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: "Top Countries"
        },
        data: [{
            type: "pie",
            startAngle: 75,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}%",
            dataPoints: topCountries
        }]
    }

  
    return (
        <div className="row">
            <div className="col-md-12 text-center">
                <CanvasJSChart options = {options} />
            </div>
        </div>
    );
}
export default Chart;