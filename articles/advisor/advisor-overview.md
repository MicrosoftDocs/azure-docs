---
title: Introduction to Azure Advisor
description: Learn how to use Azure Advisor to optimize your Azure deployments and get answers to frequently asked questions.
ms.topic: overview
ms.date: 07/08/2024
---

# Introduction to Azure Advisor

Learn about the key capabilities of Azure Advisor and get answers to frequently asked questions.

## What is Advisor?
Advisor is a digital cloud assistant that helps you follow best practices to optimize your Azure deployments. It analyzes your resource configuration and usage telemetry and then recommends solutions that can help you improve the cost effectiveness, performance, reliability, and security of your Azure resources.

With Advisor, you can:

* Get proactive, actionable, and personalized best practices recommendations. 
* Improve the performance, security, and reliability of your resources, as you identify opportunities to reduce your overall Azure spend.
* Get recommendations with proposed actions inline.

You can access Advisor through the [Azure portal](https://aka.ms/azureadvisordashboard). Sign in to the [portal](https://portal.azure.com), locate **Advisor** on the navigation pane, or search for it on the **All services** menu.

The Advisor dashboard displays personalized recommendations for all your subscriptions. The recommendations are divided into five categories: 

* **Reliability**: To ensure and improve the continuity of your business-critical applications. For more information, see [Advisor reliability recommendations](advisor-reference-reliability-recommendations.md).
* **Security**: To detect threats and vulnerabilities that might lead to security breaches. For more information, see [Advisor security recommendations](advisor-security-recommendations.md).
* **Performance**: To improve the speed of your applications. For more information, see [Advisor performance recommendations](advisor-reference-performance-recommendations.md).
* **Cost**: To optimize and reduce your overall Azure spending. For more information, see [Advisor cost recommendations](advisor-reference-cost-recommendations.md).
* **Operational excellence**: To help you achieve process and workflow efficiency, resource manageability, and deployment best practices. For more information, see [Advisor operational excellence recommendations](advisor-reference-operational-excellence-recommendations.md).

You can apply filters to display recommendations for specific subscriptions and resource types.

:::image type="content" source="./media/advisor-overview/advisor-dashboard-overview-m.png" alt-text="Screenshot of the Advisor opening score page." lightbox="./media/advisor-overview/advisor-dashboard-overview-m.png":::

Select a category to display the list of recommendations for that category. Select a recommendation to learn more about it. You can also learn about actions that you can perform to take advantage of an opportunity or resolve an issue.

:::image type="content" source="./media/advisor-overview/advisor-reliability-recommendations-main-m.png" alt-text="Screenshot of the Advisor Reliability recommendations page." lightbox="./media/advisor-overview/advisor-reliability-recommendations-main-m.png":::

Select the recommended action for a recommendation to implement the recommendation. A simple interface opens that enables you to implement the recommendation. It also might refer you to documentation that assists you with implementation. After you implement a recommendation, it can take up to a day for Advisor to recognize the action.

If you don't intend to take immediate action on a recommendation, you can postpone it for a specified time period. You can also dismiss it. If you don't want to receive recommendations for a specific subscription or resource group, you can configure Advisor to only generate recommendations for specified subscriptions and resource groups.

## Frequently asked questions

Here are answers to common questions about Advisor.

### How do I access Advisor?
You can access Advisor through the [Azure portal](https://aka.ms/azureadvisordashboard). Sign in to the [portal](https://portal.azure.com), locate **Advisor** on the navigation pane, or search for it on the **All services** menu.

### What permissions do I need to access Advisor?

You can access Advisor recommendations as the Owner, Contributor, or Reader of a subscription, resource group, or resource.

### What resources does Advisor provide recommendations for?

Advisor provides recommendations for the following services:

- Azure API Management
- Azure Application Gateway
- Azure App Service
- Availability sets
- Azure Cache
- Azure Database for MySQL
- Azure Database for PostgreSQL
- Azure Farmbeats
- Azure Stack ACI
- Azure public IP addresses
- Azure Synapse Analytics
- Central server
- Azure Cognitive Services
- Azure Cosmos DB
- Azure Data Explorer
- Azure Data Factory
- Databricks Workspace
- Azure ExpressRoute
- Azure Front Door
- Azure HDInsight cluster
- Azure IoT Hub
- Azure Key Vault
- Azure Kubernetes Service
- Log Analytics
- Azure Cache for Redis server
- SQL Server
- Azure Storage account
- Azure Traffic Manager profile
- Azure Virtual Machines
- Azure Virtual Machine Scale Sets
- Azure Virtual Network gateway

Advisor also includes your recommendations from [Microsoft Defender for Cloud](../defender-for-cloud/defender-for-cloud-introduction.md), which might include recommendations for other resource types.

### Can I postpone or dismiss a recommendation?

To postpone or dismiss a recommendation, select **Postpone** or **Dismiss**. The recommendation is moved to the **Postponed/Dismissed** tab on the recommendation list page.

## Related content

To learn more about Advisor recommendations, see:

* [Get started with Advisor](advisor-get-started.md)
* [Advisor score](azure-advisor-score.md)
* [Advisor reliability recommendations](advisor-reference-reliability-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor performance recommendations](advisor-reference-performance-recommendations.md)
* [Advisor cost recommendations](advisor-reference-cost-recommendations.md)
* [Advisor operational excellence recommendations](advisor-reference-operational-excellence-recommendations.md)
