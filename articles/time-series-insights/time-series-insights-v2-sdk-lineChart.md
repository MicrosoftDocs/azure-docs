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

## lineChart

The TSI API exposes a method for aggregating data pushed into Time Series Insights.  An example aggregates call that simply logs the result to the console is

```js
var tsiClient = new TsiClient();      
tsiClient.server.getAggregates(authToken, environmentFqdn, aggregateExpressionArray,options).then(function(result){console.log(result)});
```

Where the parameters for getAggregates are as follows:

* authToken is a user token for Time Series Insights obtained from, for example, adal.js
* environmentFqdn is the FQDN for the environment that is being queried, which can be obtained in the azure portal for the environment
* aggregateExpressionArray is an array of aggregateExpressions, which will be described below
* options is a set of options for the aggregates call, which will be described below

## Next steps
> [!div class="nextstepaction"]
>[Diagnose and solve problems in your Time Series Insights environment](time-series-insights-diagnose-and-solve-problems.md)
