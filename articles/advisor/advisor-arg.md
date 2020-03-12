---
title: Advisor data in Azure Resource Graph
description: Make queries for Advisor data in Azure Resource Graph
ms.topic: article
ms.date: 03/12/2020
ms.author: sagupt

---

# Query for Advisor data in Resource Graph Explorer (Azure Resource Graph)

Advisor RP is now onboarded to [Azure Resource Graph](https://azure.microsoft.com/en-us/features/resource-graph/). This lays foundation to many at-scale customer scenarios for Advisor recommendations.  Our top explorations now is deeper integration of Advisor in Azure Portal, powered by ARG. Few scenarios that were not possible before to do at scale and now can be light up using Resource Graph.
* Gives capability to perform complex query for all your subscriptions in Azure Portal
* Recommendations summarized by category (e.g., high availability, performance)  and impact (high, medium, low)
* All recommendations for a particular recommendation type
* Impacted resource count by recommendation category

Available Advisor Resource Types in [Resource Graph](https://docs.microsoft.com/en-us/azure/governance/resource-graph/):
There  are 3 resource types available for querying under this RP. Here is the list of the resources that are now available for querying in Resource Graph.
* Microsoft.Advisor/configurations
* Microsoft.Advisor/recommendations
* Microsoft.Advisor/suppressions

These resource types are listed under a new table named as AdvisorResources, which you can also query in the Resource Graph Explorer in the Portal.


## Next steps

For more information about Advisor recommendations, see:
* [Introduction to Azure Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor Cost recommendations](advisor-cost-recommendations.md)
* [Advisor Performance recommendations](advisor-performance-recommendations.md)
* [Advisor Security recommendations](advisor-security-recommendations.md)
* [Advisor Operational Excellence recommendations](advisor-operational-excellence-recommendations.md)
