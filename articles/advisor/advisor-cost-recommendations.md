---
title: Reduce service costs using Azure Advisor
description: Use Azure Advisor to optimize the cost of your Azure deployments.
ms.topic: article
ms.date: 10/29/2021

---

# Reduce service costs by using Azure Advisor

Azure Advisor helps you optimize and reduce your overall Azure spend by identifying idle and underutilized resources. You can get cost recommendations from the **Cost** tab on the Advisor dashboard.

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Cost** tab.

## Optimize virtual machine spend by resizing or shutting down underutilized instances 

Although certain application scenarios can result in low utilization by design, you can often save money by managing the size and number of your virtual machines. 

Advisor uses machine-learning algorithms to identify low utilization and to identify the ideal recommendation to ensure optimal usage of virtual machines. The recommended actions are shut down or resize, specific to the resource being evaluated.

### Shutdown recommendations

Advisor identifies resources that have not been used at all over the last 7 days and makes a recommendation to shut them down. 

-	Recommendation criteria include **CPU** and **Outbound Network utilization** metrics. **Memory** is not considered since we’ve found that **CPU** and **Outbound Network utilization** are sufficient.
- The last 7 days of utilization data are analyzed
- Metrics are sampled every 30 seconds, aggregated to 1 min and then further aggregated to 30 mins (we take the max of average values while aggregating to 30 mins)
- A shutdown recommendation is created if: 
  - P95th of the maximum value of CPU utilization summed across all cores is less than 3%.
  - P100 of average CPU in last 3 days (sum over all cores) <= 2%   
  - Outbound Network utilization is less than 2% over a seven-day period.

### Resize SKU recommendations

Advisor recommends resizing virtual machines when it's possible to fit the current load on a more appropriate SKU, which is less expensive (based on retail rates). 

-	Recommendation criteria include **CPU**, **Memory** and **Outbound Network utilization**. 
- The last 7 days of utilization data are analyzed
- Metrics are sampled every 30 seconds, aggregated to 1 min and then further aggregated to 30 mins (we take the max of average values while aggregating to 30 mins)
- An appropriate SKU is determined based on the following criteria:
  - Performance of the workloads on the new SKU should not be impacted. 
    - Target for user-facing workloads: 
      - P95 of CPU and Outbound Network utilization at 40% or lower on the recommended SKU 
      - P100 of Memory utilization at 60% or lower on the recommended SKU
    - Target for non user-facing workloads: 
      - P95 of the CPU and Outbound Network utilization at 80% or lower on the new SKU
      - P100 of Memory utilization at 80% or lower on the new SKU 
  - The new SKU has the same Accelerated Networking and Premium Storage capabilities 
  - The new SKU is supported in the current region of the Virtual Machine with the recommendation
  - The new SKU is less expensive 
- Advisor determines if a workload is user-facing by analyzing its CPU utilization characteristics. The approach is based on findings by Microsoft Research. You can find more details here: [Prediction-Based Power Oversubscription in Cloud Platforms - Microsoft Research](https://www.microsoft.com/research/publication/prediction-based-power-oversubscription-in-cloud-platforms/).
- Advisor recommends not just smaller SKUs in the same family (for example D3v2 to D2v2) but also SKUs in a newer version (for example D3v2 to D2v3) or a different family (for example D3v2 to E3v2) based on the best fit and the cheapest costs with no performance impacts. 

### Burstable recommendations

We evaluate if workloads are eligible to run on specialized SKUs called **Burstable SKUs** that support variable workload performance requirements and are less expensive than general purpose SKUs. Learn more about burstable SKUs here: [B-series burstable - Azure Virtual Machines](../virtual-machines/sizes-b-series-burstable.md).

- A burstable SKU recommendation is made if:
- The average **CPU utilization** is less than a burstable SKUs' baseline performance
  - If the P95 of CPU is less than two times the burstable SKUs' baseline performance
  - If the current SKU does not have accelerated networking enabled (burstable SKUs don’t support accelerated networking yet)
  - If we determine that the Burstable SKU credits are sufficient to support the average CPU utilization over 7 days
- The result is a recommendation suggesting that the user resize their current VM to a burstable SKU (with the same number of cores) to take advantage of the low costs and the fact that the workload has low average utilization but high spikes in cases, which can be best served by the B-series SKU. 
 
Advisor shows the estimated cost savings for either recommended action: resize or shut down. For resize, Advisor provides current and target SKU information.
To be more selective about the actioning on underutilized virtual machines, you can adjust the CPU utilization rule on a per-subscription basis.

There are cases where the recommendations cannot be adopted or might not be applicable, such as some of these common scenarios (there may be other cases):
- Virtual machine has been provisioned to accommodate upcoming traffic
- Virtual machine uses other resources not considered by the resize algo, i.e. metrics other than CPU, Memory and Network
- Specific testing being done on the current SKU, even if not utilized efficiently
- Need to keep VM SKUs homogeneous 
- VM being utilized for disaster recovery purposes

In such cases simply use the Dismiss/Postpone options associated with the recommendation. 

We are constantly working on improving these recommendations. Feel free to share feedback on [Advisor Forum](https://aka.ms/advisorfeedback).

## Next steps

To learn more about Advisor recommendations, see:
* [Advisor cost recommendations (full list)](advisor-reference-cost-recommendations.md)
* [Introduction to Advisor](advisor-overview.md)
* [Advisor score](azure-advisor-score.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor performance recommendations](advisor-reference-performance-recommendations.md)
* [Advisor reliability recommendations](advisor-reference-reliability-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor operational excellence recommendations](advisor-reference-operational-excellence-recommendations.md)
