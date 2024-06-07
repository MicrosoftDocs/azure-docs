---
title: Monitor with correlated metrics in Azure portal
description: Learn about correlated metrics between RAN and packet core metrics  
author: delnas
ms.author: delnas
ms.service: private-5g-core
ms.topic: concept-article 
ms.date: 5/28/2024
---


# Monitoring with Azure Monitor correlated metrics 
Correlated metrics compares the values of two metrics, one from the RAN and one from the packet core. You can use these metrics to help draw conclusions about the cause of issues and set alerts if the difference between two metrics exceeds a certain threshold for a prolonged period.

These metrics are available at your Site Resource under the **Metrics** page. Once you have [set up](ran-insights-create-resource.md) your radio access network (RAN) insights resource, these metrics will automatically be populated with information. No other configuration is needed. 

## Visualize correlated metrics using the Azure portal 
Correlated metrics display a graphical view of correlated RAN and core metrics to help troubleshoot issues. In normal operation the two values should be in the same range. You can use alerts to notify you if the correlation value drops below or above a certain range. For example, you might want an alert if it falls below the lower threshold of 80% and above the higher threshold of 120%. 

  :::image type="content" source="media/ran-insights/ran-insights-correlated-metric.png" alt-text="Screenshot of the Azure portal showing site resource correlated metrics.":::

Correlated metrics are available for monitoring and retrieval for up to 30 days. Note that the EMS might provide metrics at intervals up to 15 minutes apart. For an optimal experience, adjust the plotting rate to match the value recommended by the EMS provider. For instance, if your RAN provider emits metrics every 5 minutes, it's advisable to set the **Time granularity** to 5 minutes.



## Correlated metrics descriptions and interpretations 
Correlated metrics are collected per site resource and aggregated across all connected access points. See [Supported metrics with Azure Monitor](https://learn.microsoft.com/azure/azure-monitor/reference/supported-metrics/metrics-index) for the corelated metrics available for retrieval included under *microsoft.mobilenetwork/sites*. 

| Metric Name | Definition | Interpretation |
|-------------|----------------|---------| 
| Correlated Uplink Volume 	| Correlates successful RAN transmitted Volume and packet core received volume on N3 interface	| •	If the correlation value of uplink volume is less than the chosen lower threshold value, then there may be an issue coming in the packet core | 
| Correlated Successful Established Radio Connections	| Correlates successful RAN radio connections established and packet core initial UE message | 	•	If the correlation value of successful established radio connections is less than the lower threshold value then there may be an issue coming from the packet core | 
| Correlated Successful Handovers | 	Correlates successful RAN connection handovers and packet core handovers	| •	If the correlation value of successful handovers is less than the lower threshold value then there may be coverage gaps coming from the packet core <br>•	If the correlation value of successful handovers is greater than the higher threshold value then there may be coverage gaps and RF optimization may be required | 
| Correlated Downlink Volume | 	Correlates successful RAN Received Volume and packet core transmitted volume on N3 interface| 	•	If the correlation value of downlink volume is greater than the higher threshold value then there may be an issue coming from the RAN |

## Related content
- [Monitor with RAN metrics](ran-insights-monitor-with-ran-metrics-concepts.md)
- [Monitor with geo maps](ran-insights-monitor-with-geo-maps-concepts.md)
