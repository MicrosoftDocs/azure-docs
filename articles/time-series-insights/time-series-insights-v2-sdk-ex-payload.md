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

## Example payload

```json
var aggregateExpressions = [
            {
                predicate: {prediateString: "Factory = 'Factory1'"},
                measure: 'Temperature',
                measureTypes: ['avg', 'min', 'count'],
                splitBy: 'MachineId',
                timespan: { from: new Date('2017-12-17T03:00:00'), 
                            to: new Date('2017-12-17T04:00:00'), 
                            bucketSize: '1m' 
                          }
            },
            {
                predicate: {predicateString: "Factory = 'Factory2'"}, 
                measure: 'Events Count',
            }
        ]
```

## Next steps
> [!div class="nextstepaction"]
>[Diagnose and solve problems in your Time Series Insights environment](time-series-insights-diagnose-and-solve-problems.md)


