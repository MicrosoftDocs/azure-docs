---
title: Overview of Cost Management
titleSuffix: Microsoft Cost Management
description: You use Cost Management features to monitor and control Azure spending and to optimize Azure resource use.
keywords:
author: bandersmsft
ms.author: banders
ms.reviewer: micfaln
ms.date: 08/07/2023
ms.topic: overview
ms.service: cost-management-billing
ms.subservice: cost-management
---

# What is Microsoft Cost Management

Microsoft Cost Management is a suite of FinOps tools that help organizations analyze, monitor, and optimize their Microsoft Cloud costs. Cost Management is available to anyone with access to a billing account, subscription, resource group, or management group. You can access Cost Management within the billing and resource management experiences or separately as a standalone tool optimized for FinOps teams who manage cost across multiple scopes. You can also automate and extend native capabilities or enrich your own tools and processes with cost to maximize organizational visibility and accountability with all stakeholders and realize your optimization and efficiency goals faster. 

A few examples of what you can do in Cost Management include:

- Report on and analyze costs in the Azure portal, Microsoft 365 admin center, or Power BI.
- Monitor costs proactively with budget, anomaly, reservation utilization, and scheduled alerts.
- Enable tag inheritance and split shared costs with cost allocation rules.
- Automate business processes or integrate cost into external tools by exporting data.

## How charges are processed

To understand how Cost Management works, you should first understand the Commerce system. At its core, Microsoft Commerce is a data pipeline that underpins all Microsoft commercial transactions, whether consumer or commercial. While there are many inputs and connections to this pipeline, like the sign-up and Marketplace purchase experiences, this article focuses on the components that help you monitor, allocate, and optimize your costs.

:::image type="content" source="./media/overview-cost-management/commerce-pipeline.svg" alt-text="Diagram showing the Commerce data pipeline." border="false" lightbox="./media/overview-cost-management/commerce-pipeline.svg":::

From the left, your Azure, Microsoft 365, Dynamics 365, and Power Platform services are measuring the products and services you use and purchase at the most granular level. Each service pushes the measured usage and purchase quantities into the Commerce data pipeline on a different cadence. In general, if data for one service is slower than another, it's due to how frequently those services are publishing their usage and charges.

As data makes its way through the pipeline, the rating system applies discounts based on your specific price sheet and generates “rated usage,” which includes a price and quantity for each cost record. It's important to note that measured usage and purchase quantities and pricing quantities may differ due to different pricing models, like block pricing which rates usage in "blocks" of units (e.g., "100 hours"). Usage and purchase quantities are often provided in the lower-level measurement unit while pricing quantities can be in a higher-level pricing unit. Cost Management shows quantity in the measurement unit while the price sheet and invoices show quantity in the pricing unit. At the end of the month, credits are applied and the invoice is published. This process starts 72 hours after your billing period ends, which is usually the last day of the calendar month for most accounts. For example, if your billing period ends on March 31, charges will be finalized on April 4 at midnight.

>[!IMPORTANT]
>Credits are applied like a gift card or other payment instrument before the invoice is generated. While credit status is tracked as new charges flow into the data pipeline, credits aren’t explicitly applied to these charges until the end of the month.

Everything up to this point makes up the billing process where charges are finalized, discounts are applied, and invoices are published. Billing account and billing profile owners may be familiar with this process as part of the Billing experience within the Azure portal or Microsoft 365 admin center. The Billing experience allows you to review credits, manage your billing address and payment methods, pay invoices, and more – everything related to managing your billing relationship with Microsoft.

- The [anomaly detection](../understand/analyze-unexpected-charges.md) model identifies anomalies daily based on normalized usage (not rated usage).
- The cost allocation engine applies tag inheritance and [splits shared costs](allocate-costs.md).
- AWS cost and usage reports are pulled based on any [connectors for AWS](aws-integration-manage.md) you may have configured.
- Azure Advisor cost recommendations are pulled in to enable cost savings insights for subscriptions and resource groups.
- Cost alerts are sent out for [budgets](tutorial-acm-create-budgets.md), [anomalies](../understand/analyze-unexpected-charges.md#create-an-anomaly-alert), [scheduled alerts](save-share-views.md#subscribe-to-scheduled-alerts), and more based on the configured settings.

Lastly, cost details are made available from [cost analysis](quick-acm-cost-analysis.md) in the Azure portal and published to your storage account via [scheduled exports](tutorial-export-acm-data.md).

## How Cost Management and Billing relate

[Cost Management](https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu) is a set of FinOps tools that enable you to analyze, manage, and optimize your costs.

[Billing](https://portal.azure.com/#view/Microsoft_Azure_GTM/ModernBillingMenuBlade) provides all the tools you need to manage your billing account and pay invoices.

While Cost Management is available from within the Billing experience, Cost Management is also available from every subscription, resource group, and management group in the Azure portal to ensure everyone has full visibility into the costs they’re responsible for and can optimize their workloads to maximize efficiency. Cost Management is also available independently to streamline the process for managing cost across multiple billing accounts, subscriptions, resource groups, and/or management groups. 

:::image type="content" source="./media/overview-cost-management/cost-management-availability.svg" alt-text="Diagram showing how billing organization relates to Cost Management." border="false" lightbox="./media/overview-cost-management/cost-management-availability.svg":::

## What data is included in Cost Management and Billing?

Within the Billing experience, you can manage all the products, subscriptions, and recurring purchases you use; review your credits and commitments; and view and pay your invoices. Invoices are available online or as PDFs and include all billed charges and any applicable taxes. Credits are applied to the total invoice amount when invoices are generated. This invoicing process happens in parallel to Cost Management data processing, which means Cost Management doesn't include credits, taxes, and some purchases, like support charges in non-MCA accounts.

Classic Cloud Solution Provider (CSP) and sponsorship subscriptions aren't supported in Cost Management. These subscriptions will be supported after they transition to Microsoft Customer Agreement.

For more information about supported offers, what data is included, or how data is refreshed and retained in Cost Management, see [Understand Cost Management data](understand-cost-mgt-data.md).

## Estimate your cloud costs

During your cloud journey, there are many tools available to help you understand pricing:

- The [Total Cost of Ownership (TCO) calculator](https://azure.microsoft.com/pricing/tco/calculator/) should be your first stop if you’re curious about how much it would cost to move your existing on-premises infrastructure to the cloud.
- [Azure Migrate](https://azure.microsoft.com/products/azure-migrate/) is a free tool that helps you analyze your on-premises workloads and plan your cloud migration.
- The [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/)  helps you estimate the cost of creating new or expanding existing deployments. In this tool, you're able to explore various configurations of many different Azure services as you identify which SKUs and how much usage keeps you within your desired price range. For more information, see the pricing details for each of the services you use.
- The [Virtual Machine Selector Tool](https://azure.microsoft.com/pricing/vm-selector/) is your one-stop-shop for finding the best VMs for your intended solution.
- The [Azure Hybrid Benefit savings calculator](https://azure.microsoft.com/pricing/hybrid-benefit/#calculator) helps you estimate the savings of using your existing Windows Server and SQL Server licenses on Azure.

## Report on and analyze costs

Cost Management and Billing include several tools to help you understand, report on, and analyze your invoiced Microsoft Cloud and AWS costs.

- [**Cost analysis**](quick-acm-cost-analysis.md) is a tool for ad-hoc cost exploration. Get quick answers with lightweight insights and analytics.
**Power BI** is an advanced solution to build more extensive dashboards and complex reports or combine costs with other data. Power BI is available for billing accounts and billing profiles.
- [**Exports and the Cost Details API**](../automate/usage-details-best-practices.md) enable you to integrate cost details into external systems or business processes.
- **Connectors for AWS** enable you to ingest your AWS cost details into Azure to facilitate managing Azure and AWS costs together. After configured, the connector also enables other capabilities, like budget and scheduled alerts.

For more information, see [Get started with reporting](reporting-get-started.md).

## Organize and allocate costs

Organizing and allocating costs are critical to ensuring invoices are routed to the correct business units and can be further split for internal billing, also known as *chargeback*. The first step to allocating cloud costs is organizing subscriptions and resources in a way that facilitates natural reporting and chargeback. Microsoft offers the following options to organize resources and subscriptions:

- MCA **billing profiles** and **invoice sections** are used to [group subscriptions into invoices](../manage/mca-section-invoice.md). Each billing profile represents a separate invoice that can be billed to a different business unit and each invoice section is segmented separately within those invoices. You can also view costs by billing profile or invoice section in costs analysis.
- EA **departments** and **enrollment accounts** are conceptually similar to invoice sections, as groups of subscriptions, but they aren't represented within the invoice PDF. They're included within the cost details backing each invoice, however. You can also view costs by department or enrollment account in costs analysis.
- **Management groups** also allow grouping subscriptions together, but offer a few key differences:
  - Management group access is inherited down to the subscriptions and resources.
  - Management groups can be layered into multiple levels and subscriptions can be placed at any level.
  - Management groups aren't included in cost details.
  - All historical costs are returned for management groups based on the subscriptions currently within that hierarchy. When a subscription moves, all historical cost moves.
  - Azure Policy supports management groups and they can have rules assigned to automate compliance reporting for your cost governance strategy.
- **Subscriptions** and **resource groups** are the lowest level at which you can organize your cloud solutions. At Microsoft, every product – sometimes even limited to a single region – is managed within its own subscription. It simplifies cost governance but requires more overhead for subscription management. Most organizations use subscriptions for business units and separating dev/test from production or other environments, then use resource groups for the products. It complicates cost management because resource group owners don't have a way to manage cost across resource groups. On the other hand, it's a straightforward way to understand who's responsible for most resource-based charges. Keep in mind that not all charges come from resources and some don't have resource groups or subscriptions associated with them. It also changes as you move to MCA billing accounts.
- **Resource tags** are the only way to add your own business context to cost details and are perhaps the most flexible way to map resources to applications, business units, environments, owners, etc. For more information, see [How tags are used in cost and usage data](understand-cost-mgt-data.md#how-tags-are-used-in-cost-and-usage-data) for limitations and important considerations.

Once your resources and subscriptions are organized using the subscription hierarchy and have the necessary metadata (tags) to facilitate further allocation, use the following tools in Cost Management to streamline cost reporting:

- [Tag inheritance](enable-tag-inheritance.md) simplifies the application of tags by copying subscription and resource group tags down to the resources in cost data. These tags aren't saved on the resources themselves. The change only happens within Cost Management and isn't available to other services, like Azure Policy.
- [Cost allocation](allocate-costs.md) offers the ability to “move” or split shared costs from one subscription, resource group, or tag to another subscription, resource group, or tag. Cost allocation doesn't change the invoice. The goal of cost allocation is to reduce overhead and more accurately report on where charges are ultimately coming from (albeit indirectly), which should drive more complete accountability.

How you organize and allocate costs plays a huge role in how people within your organization can manage and optimize costs. Be sure to plan ahead and revisit your allocation strategy yearly.

## Monitor costs with alerts

Cost Management and Billing offer many different types of emails and alerts to keep you informed and help you proactively manage your account and incurred costs.

- [**Budget alerts**](tutorial-acm-create-budgets.md) notify recipients when cost exceeds a predefined cost or forecast amount. Budgets can be visualized in cost analysis and are available on every scope supported by Cost Management. Subscription and resource group budgets can also be configured to notify an action group to take automated actions to reduce or even stop further charges.
- [**Anomaly alerts**](../understand/analyze-unexpected-charges.md) notify recipients when an unexpected change in daily usage has been detected. It can be a spike or a dip. Anomaly detection is only available for subscriptions and can be viewed within Cost analysis smart views. Anomaly alerts can be configured from the cost alerts page.
- [**Scheduled alerts**](save-share-views.md#subscribe-to-scheduled-alerts) notify recipients about the latest costs on a daily, weekly, or monthly schedule based on a saved cost view. Alert emails include a visual chart representation of the view and can optionally include a CSV file. Views are configured in cost analysis, but recipients don't require access to cost in order to view the email, chart, or linked CSV.
- **EA commitment balance alerts** are automatically sent to any notification contacts configured on the EA billing account when the balance is 90% or 100% used.
- **Invoice alerts** can be configured for MCA billing profiles and Microsoft Online Services Program (MOSP) subscriptions. For details, see [View and download your Azure invoice](../understand/download-azure-invoice.md).

For more information, see [Monitor usage and spending with cost alerts](cost-mgt-alerts-monitor-usage-spending.md).

## Optimize costs

Microsoft offers a wide range of tools for optimizing your costs. Some of these tools are available outside the Cost Management and Billing experience, but are included for completeness.

- There are many [**free services**](https://azure.microsoft.com/pricing/free-services/) available in Azure. Be sure to pay close attention to the constraints. Different services are free indefinitely, for 12 months, or 30 days. Some are free up to a specific amount of usage and some may have dependencies on other services that aren't free.
- [**Azure Advisor cost recommendations**](tutorial-acm-opt-recommendations.md) should be your first stop when interested in optimizing existing resources. Advisor recommendations are updated daily and are based on your usage patterns. Advisor is available for subscriptions and resource groups. Management group users can also see recommendations but they need to select the desired subscriptions. Billing users can only see recommendations for subscriptions they have resource access to.
- [**Azure savings plans**](../savings-plan/index.yml) save you money when you have consistent usage of Azure compute resources. A savings plan can significantly reduce your resource costs by up to 65% from pay-as-you-go prices.
- **[Azure reservations](https://azure.microsoft.com/reservations/)** help you save up to 72% compared to pay-as-you-go rates by pre-committing to specific usage amounts for a set time duration.
- [**Azure Hybrid Benefit**](https://azure.microsoft.com/pricing/hybrid-benefit/) helps you significantly reduce costs by using on-premises Windows Server and SQL Server licenses or RedHat and SUSE Linux subscriptions on Azure.

For other options, see [Azure benefits and incentives](https://azure.microsoft.com/pricing/offers/#cloud).

## Next steps

For other options, see [Azure benefits and incentives](https://azure.microsoft.com/pricing/offers/#cloud).