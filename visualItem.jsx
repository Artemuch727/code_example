import React, { Component, PropTypes } from 'react';
import { CHART_OPTIONS,CHART_CLASS_NAME } from 'constants/experiment/configConstant'

class VisualItem extends Component {

    static propTypes = {
        visualParams : React.PropTypes.shape({
            backcolor: React.PropTypes.string,
            maincolor: React.PropTypes.string
        }),
        text : React.PropTypes.shape({
            title: React.PropTypes.string,
            valueText: React.PropTypes.string,
        }),
        value : React.PropTypes.number,
        sign : React.PropTypes.string,
        typeName : React.PropTypes.string,
        rootClassName : React.PropTypes.string
    };

    componentDidMount() {
        this.drawCharts();
    }


    drawAnimatedRingChart = (config) => {

        let maxWidth = 100;
        let maxHeight = 100;

        var pie = d3.layout.pie().value(function (d) {
            return d.count;
        }).padAngle(.05).sort(null);

        var color = d3.scale.category10();
        var arc = d3.svg.arc();

         function tweenPie(finish) {
            var start = {
                startAngle: 0,
                endAngle: 0
            };
            var i = d3.interpolate(start, finish);
            return function(d) { return arc(i(d)); };
        }

        arc.outerRadius(config.outerRadius || outerRadius)
            .innerRadius(config.innerRadius || innerRadius)
            .startAngle(function(d) { return d.startAngle - Math.PI/2; })
            .endAngle(function(d) { return d.endAngle - Math.PI/2; });

        d3.select(config.el).selectAll('g').remove();

        var svg = d3.select(config.el)
            .attr({
                width : maxWidth,
                height: maxHeight
            });

        var groups = svg.selectAll('g.arc')
            .data(pie(config.data))
            .enter()
            .append('g')
            .attr({
                'class': 'arc',
                'transform': 'translate(' + config.outerRadius + ', ' + config.outerRadius + ')'
            });

        groups.append('path')
            .attr({
                'fill': function (d, i) {
                    return d.data.color
                }
            })
            .transition()
            .duration(config.duration || 1000)
            .attrTween('d', tweenPie)
    }



    drawCharts(){

        let chartData = [];

        chartData.push({
            count: this.props.value,
            color: this.props.visualParams.maincolor
        });
        chartData.push({
            count: 100 - this.props.value,
            color: this.props.visualParams.backcolor
        });

        let outerRadius = 50;
        let ringWidth = 7;

        this.drawAnimatedRingChart({
            el: '.'+CHART_CLASS_NAME+this.props.typeName,
            outerRadius: outerRadius,
            innerRadius: outerRadius - ringWidth,
            data: chartData
        });

        /*
        new Chart(document.getElementsByClassName(CHART_CLASS_NAME+this.props.typeName)[0].getContext("2d")).Doughnut(chartData,CHART_OPTIONS);
        */

    }

    renderFloat(){
        if (this.props.text.floatText && this.props.text.valueText != '100'){
            return <span className="experiment-maindata-chartinfo__complement experiment-maindata-chartinfo__complement_float">,{this.props.text.floatText}</span>
        }
    }

    render() {
        return (
            <div className={this.props.rootClassName}>
                <div>
                    <div className="experiment-maindata-content__title experiment-maindata-visualpresent__chart-header" style={ {color:this.props.visualParams.maincolor} }><span>{this.props.text.title.toUpperCase()}</span></div>
                </div>
                <div className="experiment-maindata-visualpresent__chart">
                    <svg className={"experiment-maindata-visualpresent__chart_svg "+CHART_CLASS_NAME+this.props.typeName} ></svg>
                    <div className="experiment-maindata-chartinfo">
                        <div className="experiment-maindata-chartinfo__inner-block" style={ {color:this.props.visualParams.maincolor} }>
                            <span className="experiment-maindata-chartinfo__complement experiment-maindata-chartinfo__complement_sign">{this.props.sign}</span>
                            <span className="experiment-maindata-chartinfo__value">{this.props.text.valueText}</span>
                            <div className="experiment-maindata-chartinfo__subvalue">
                                <span className="experiment-maindata-chartinfo__complement experiment-maindata-chartinfo__complement_percent">%</span>
                                {this.renderFloat()}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VisualItem;

