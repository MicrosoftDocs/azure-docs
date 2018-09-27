---
title: Explore data using the Azure Time Series Insights explorer | Microsoft Docs
description: This article describes how to use the Azure Time Series Insights explorer in your web browser to quickly see a global view of your big data and validate your IoT environment.
ms.service: time-series-insights
services: time-series-insights
author: ashannon7
ms.author: anshan
manager: cshankar
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 09/18/2018
---

# Time Series Insights JavaScript Client Overview

## chartOptions

## Parameters

The TSI API exposes a method for aggregating data pushed into Time Series Insights.  An example aggregates call that simply logs the result to the console is

```js
var tsiClient = new TsiClient();      
tsiClient.server.getAggregates(authToken, environmentFqdn, aggregateExpressionArray,options).then(function(result){console.log(result)});
```

chartOptions is used to specify specific attributes about the array of aggregates to be rendered.  It is an array of objects…
•	chartOptions Object (optional): an object specifying view specific attributes for the chart with properties…
o	legend Boolean (optional): display a legend, or not, default value is true
o	yAxis Boolean (optional): display the y axis or not, default value is true
o	aggregateOptions Array<Object> (optional): an array of objects corresponding to the elements in transformedResult that specifies the specific view properties of each result.  Each object has the following optional fields…
	color <string> (optional): the hex color of the group of aggregates for a given aggregate expression


## Next steps
> [!div class="nextstepaction"]
>[Diagnose and solve problems in your Time Series Insights environment](time-series-insights-diagnose-and-solve-problems.md)
