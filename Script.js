Qva.LoadScript('/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/Evolcon/DoubleBarChart/d3.min.js', function (){

    Qva.AddExtension('Evolcon/DoubleBarChart', function(){
	
        Qva.LoadCSS("/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/Evolcon/DoubleBarChart/style.css");
        
        //Create reference to the qlikview sheet extension object
        var _this = this;
        var unico = true;
		
        //Get width and height of the qlikview sheet extension object
        var vw = _this.GetWidth();
        var vh = _this.GetHeight();
        
        //Get all data from the qlikview result
        _this.Data.SetPagesize(_this.Data.TotalSize);

        //Set values for presentation
        var margin = {top: 20, right: 20, bottom: 100, left: 40};

		//Set divID
        var divID = "DoubleBarChart" + new Date().getTime().toString();
               
        //Get Data
        var names = [];
		var values = [];
		var values2 = [];
		var valuesStaging = [];
        for(var i = 0; i < _this.Data.Rows.length; i++){
			names.push(_this.Data.Rows[i][0].text);
			values.push(parseFloat(_this.Data.Rows[i][1].data));
			values2.push(parseFloat(_this.Data.Rows[i][2].data));
        }
		
		var maxValue = d3.max([d3.max(values),d3.max(values2)]);
		
		if(d3.max(values) <= d3.max(values2)){
			valuesStaging = values;
			values = values2;
			values2 = valuesStaging;
		}
		
		var maxValueLength = maxValue.toString().length;
		margin.left = margin.left + (maxValueLength * 4);
		
		var maxNameLength = 0;
		for(var i = 0; i < _this.Data.Rows.length; i++){
			if (names[i].length > maxNameLength)
				maxNameLength = names[i].length;
		}
		margin.bottom = margin.bottom + (maxNameLength * 2.0);
		var miniBarWidthPercent = 0.55;
		var miniBarWidth = barWidth * miniBarWidthPercent;
		
		var w = vw - margin.right - margin.left;
		var h = vh - margin.top - margin.bottom;
		        
		var barWidth = (w - values.length*10 - margin.right)/values.length;
		
		//scales		
		var valuesScale = d3.scale.linear()
							.domain([0, maxValue])
							.range([0, h - 20])
							.nice();
		
		var valuesScaleAxis = d3.scale.linear()
							.domain([0, maxValue])
							.range([h - 20, 0])
							.nice();
							
		var valuesAxis = d3.svg.axis()
							.scale(valuesScaleAxis)
							.tickFormat(d3.format("s"))
							.orient("left");
							
		var namesScale = d3.scale.ordinal()
							.domain(names)
							.rangeBands([10, w - margin.right + values.length]);
							
		var namesAxis = d3.svg.axis()
							.scale(namesScale)
							.orient("bottom");
							
        _this.Element.innerHTML= '<div id=' + divID
                + ' style="width:' + w + 'px;'
                + 'left: 0; position: absolute;'
                + 'top: 0;z-index:999;"></div>';
        
        var chart = d3.select("#" + divID)
                .append("svg")
                .attr("width", w )
                .attr("height", h )
				.attr("transform", "translate( " + margin.left +" ," + margin.top + ")")

		var chart2 = chart.append("g")
                .attr("width", w )
                .attr("height", h )
				
		var bars = chart.selectAll("rect")
					.data(values)
					.enter()
						.append("rect")
						.attr("width", barWidth)
						.attr("x", function(d, i){return i * (barWidth + 10) + margin.left+ 10;})
						.attr("fill", this.Layout.Text0.text)
						.attr("fill-opacity", 0.5)
						.attr("y", function(d){return h - valuesScale(d);})
						.attr("height", function(d){return valuesScale(d);});
		

		var bars2 = chart2.selectAll("rect")
					.data(values2)
					.enter()
						.append("rect")
						.attr("width", barWidth * miniBarWidthPercent)
						.attr("x", function(d, i){return i * (barWidth + 10) + margin.left+ 10 + (barWidth * ((1 - miniBarWidthPercent)/2));})
						.attr("fill", this.Layout.Text1.text)
						.attr("y", function(d){return h - valuesScale(d);})
						.attr("height", function(d){return valuesScale(d);});
						
						
		var valuesAxisD = chart.append("g")
					.attr("transform", "translate( " + margin.left +" ," + margin.top + ")")
					.attr("class", "axis")
					.call(valuesAxis);
					
		var namesAxisD = chart.append("g")
					.attr("transform", "translate( " + margin.left +" ," + (h + 10) + ")")
					.attr("class", "axis")
					.call(namesAxis)
					.selectAll("text")
					.attr("transform", function(d, i){return "translate(" + (names[i].length * -2.5) + "," + (names[i].length * 2.0) +")rotate(320)"});
					//.attr("transform","translate(-25," + (maxNameLength * 1.5) +")rotate(300)");

		
    },true); //End AddExtension

}); //End LoadScript



	
