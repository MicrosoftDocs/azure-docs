---
author: madewithsmiles
ms.author: ngdiarra
title: Improve the performance of highly used VMs using Azure Advisor
description: Use Azure Advisor to improve the performance of your Azure virtual machines with consistent high utilization.
ms.topic: article
ms.date: 10/27/2022
---

# Improve the performance of highly used VMs using Azure Advisor

Azure Advisor helps you improve the speed and responsiveness of your business-critical applications. You can get performance recommendations from the **Performance** tab on the Advisor dashboard.

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Performance** tab.

## Optimize virtual machine (VM) performance by right-sizing highly utilized instances 

You can improve the quality of your workload and prevent many performance-related issues (i.e., throttling, high latency) by regularly assessing your [performance efficiency](/azure/architecture/framework/scalability/overview). Performance efficiency is defined by the [Azure Well-Architected Framework](/azure/architecture/framework/) as the ability of your workload to adapt to changes in load. Performance efficiency is one of the five pillars of architectural excellence on Azure.  

Unless by design, we recommend keeping your application's usage well below your virtual machine's size limits, so it can better operate and easily accommodate changes.

Advisor aggregates various metrics over a minimum of 7 days, identifies virtual machines with consistent high utilization across those metrics, and finds better sizes (SKUs) for improved performance. Finally, Advisor examines capacity signals in Azure to frequently refresh the recommended SKUs, ensuring that they are available for deployment in the region.

### Resize SKU recommendations

Advisor recommends resizing virtual machines when use is consistently high (above predefined thresholds) given the running virtual machine's size limits.

-	The recommendation algorithm evaluates **CPU**, **Memory**, **VM Cached IOPS Consumed Percentage**, and **VM Uncached Bandwidth Consumed Percentage** usage metrics
- The observation period is the past 7 days from the day of the recommendation
- Metrics are sampled every 30 seconds, aggregated to 1 minute and then further aggregated to 30 minutes (taking the average of 1-minute average values while aggregating to 30 minutes)
- A SKU upgrade for virtual machines is decided given the following criteria: 
  - For each metric, we create a new feature from the P50 (median) of its 30-mins averages aggregated over the observation period. Therefore, a virtual machine is identified as a candidate for a resize if:
    * _Both_ `CPU` and `Memory` features are >= *90%* of the current SKU's limits
    * Otherwise, _either_ 
        * The `VM Cached IOPS` feature is >= to *95%* of the current SKU's limits, and the current SKU's max local disk IOPS is >= to its network disk IOPS. _or_
        * the `VM Uncached Bandwidth` feature is >= *95%* of the current SKU's limits, and the current SKU's max network disk throttle limits are >= to its local disk throttle units  
- We ensure the following:
  - The current workload utilization will be better on the new SKU's given that it has higher limits and better performance guarantees
  - The new SKU has the same Accelerated Networking and Premium Storage capabilities 
  - The new SKU is supported and ready for deployment in the same region as the running virtual machine


In some cases, recommendations can't be adopted or might not be applicable, such as some of these common scenarios (there may be other cases):
- The virtual machine is short-lived
- The current virtual machine has already been provisioned to accommodate upcoming traffic
- Specific testing being done using the current SKU, even if not utilized efficiently
- There's a need to keep the virtual machine as-is

In such cases, simply use the Dismiss/Postpone options associated with the recommendation. 

We're constantly working on improving these recommendations. Feel free to share feedback on [Advisor Forum](https://aka.ms/advisorfeedback).

## Next steps

To learn more about Advisor recommendations and best practices, see:
* [Get started with Advisor](advisor-get-started.md)
* [Introduction to Advisor](advisor-overview.md)
* [Advisor score](azure-advisor-score.md)
* [Advisor performance recommendations](advisor-reference-performance-recommendations.md)
* [Advisor cost recommendations (full list)](advisor-reference-cost-recommendations.md)
* [Advisor reliability recommendations](advisor-reference-reliability-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor operational excellence recommendations](advisor-reference-operational-excellence-recommendations.md)
* [The Microsoft Azure Well-Architected Framework](/azure/architecture/framework/)