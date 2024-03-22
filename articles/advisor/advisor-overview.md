---
title: Introduction to Azure Advisor
description: Use Azure Advisor to optimize your Azure deployments.
ms.topic: overview
ms.date: 04/07/2022
---

# Introduction to Azure Advisor

Learn about the key capabilities of Azure Advisor and get answers to frequently asked questions.

## What is Advisor?
Advisor is a digital cloud assistant that helps you follow best practices to optimize your Azure deployments. It analyzes your resource configuration and usage telemetry and then recommends solutions that can help you improve the cost effectiveness, performance, reliability, and security of your Azure resources.

With Advisor, you can:

* Get proactive, actionable, and personalized best practices recommendations. 
* Improve the performance, security, and reliability of your resources, as you identify opportunities to reduce your overall Azure spend.
* Get recommendations with proposed actions inline.

You can access Advisor through the [Azure portal](https://aka.ms/azureadvisordashboard). Sign in to the [portal](https://portal.azure.com), locate **Advisor** in the navigation menu, or search for it in the **All services** menu.

The Advisor dashboard displays personalized recommendations for all your subscriptions. The recommendations are divided into five categories: 

* **Reliability**: To ensure and improve the continuity of your business-critical applications. For more information, see [Advisor Reliability recommendations](advisor-high-availability-recommendations.md).
* **Security**: To detect threats and vulnerabilities that might lead to security breaches. For more information, see [Advisor Security recommendations](advisor-security-recommendations.md).
* **Performance**: To improve the speed of your applications. For more information, see [Advisor Performance recommendations](advisor-performance-recommendations.md).
* **Cost**: To optimize and reduce your overall Azure spending. For more information, see [Advisor Cost recommendations](advisor-cost-recommendations.md).
* **Operational Excellence**: To help you achieve process and workflow efficiency, resource manageability and deployment best practices. For more information, see [Advisor Operational Excellence recommendations](advisor-operational-excellence-recommendations.md).

You can apply filters to display recommendations for specific subscriptions and resource types.

:::image type="content" source="./media/advisor-overview/advisor-dashboard-overview-m.png" alt-text="Screenshot of the Azure Advisor opening score page." lightbox="./media/advisor-overview/advisor-dashboard-overview-m.png":::

Select a category to display the list of recommendations for that category, and select a recommendation to learn more about it. You can also learn about actions that you can perform to take advantage of an opportunity or resolve an issue.

:::image type="content" source="./media/advisor-overview/advisor-reliability-recommendations-main-m.png" alt-text="Screenshot of the Azure Advisor Reliability recommendations page, example." lightbox="./media/advisor-overview/advisor-reliability-recommendations-main-m.png":::

Select the recommended action for a recommendation to implement the recommendation. A simple interface opens that enables you to implement the recommendation or refer you to documentation that assists you with implementation. Once you implement a recommendation, it can take up to a day for Advisor to recognize that.

If you don't intend to take immediate action on a recommendation, you can postpone it for a specified time period, or dismiss it. If you don't want to receive recommendations for a specific subscription or resource group, you can configure Advisor to only generate recommendations for specified subscriptions and resource groups.
 
## Frequently asked questions

### How do I access Advisor?
You can access Advisor through the [Azure portal](https://aka.ms/azureadvisordashboard). Sign in to the [portal](https://portal.azure.com), locate **Advisor** in the navigation menu, or search for it in the **All services** menu.

### What permissions do I need to access Advisor?
 
You can access Advisor recommendations as *Owner*, *Contributor*, or *Reader* of a subscription, Resource Group, or Resource.

### What resources does Advisor provide recommendations for?

Advisor provides recommendations for the following services: API Management, Application Gateway, App Services, Availability Sets, Azure Cache, Azure Database for MySQL, Azure Database for PostgreSQL, Azure Farmbeats, Azure Stack ACI, Azure Public IP Addresses, Azure Synapse Analytics, Central Server, Cognitive Service, Cosmos DB, Data Explorer, Data Factory, Databricks Workspace, ExpressRoute, Front Door, HDInsight Cluster, IoT Hub, KeyV Vault, Kubernetes, Log Analytics, Redis Cache Server, SQL Server, Storage Account, Traffic Manager Profile, Virtual Machine, Virtual Machine Scale Set, and Virtual Network Gateway.

Azure Advisor also includes your recommendations from [Microsoft Defender for Cloud](../defender-for-cloud/defender-for-cloud-introduction.md), which might include recommendations for other resource types.

### Can I postpone or dismiss a recommendation?

To postpone or dismiss a recommendation, select the **Postpone**  or **Dismiss** link, and the recommendation is moved to the Postponed/Dismissed tab on the recommendation list page.

## Next steps

To learn more about Advisor recommendations, see:

* [Get started with Advisor](advisor-get-started.md)
* [Advisor score](azure-advisor-score.md)
* [Advisor Reliability recommendations](advisor-high-availability-recommendations.md)
* [Advisor Security recommendations](advisor-security-recommendations.md)
* [Advisor Performance recommendations](advisor-performance-recommendations.md)
* [Advisor Cost recommendations](advisor-cost-recommendations.md)
* [Advisor operational excellence recommendations](advisor-operational-excellence-recommendations.md)
