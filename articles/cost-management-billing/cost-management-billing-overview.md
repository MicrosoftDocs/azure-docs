---
title: Overview of Cost Management + Billing
titleSuffix: Microsoft Cost Management
description: You use Cost Management + Billing features to conduct billing administrative tasks and manage billing access to costs. You also use the features to monitor and control Azure spending and to optimize Azure resource use.
author: bandersmsft
ms.author: banders
ms.reviewer: micfaln
ms.date: 02/28/2024
ms.topic: overview
ms.service: cost-management-billing
ms.subservice: common
ms.custom: engagement-fy2
---

# What is Microsoft Cost Management and Billing?

Microsoft Cost Management is a suite of tools that help organizations monitor, allocate, and optimize the cost of their Microsoft Cloud workloads. Cost Management is available to anyone with access to a billing or resource management scope. The availability includes anyone from the cloud finance team with access to the billing account. And, to DevOps teams managing resources in subscriptions and resource groups.

Billing is where you can manage your accounts, invoices, and payments. Billing is available to anyone with access to a billing account or other billing scope, like billing profiles and invoice sections. The cloud finance team and organizational leaders are typically included.

Together, Cost Management and Billing are your gateway to the Microsoft Commerce system that's available to everyone throughout the journey. From initial sign-up and billing account management, to the purchase and management of Microsoft and third-party Marketplace offers, to financial operations (FinOps) tools.

A few examples of what you can do in Cost Management and Billing include:

- Report on and analyze costs in the Azure portal, Microsoft 365 admin center, or externally by exporting data.
- Monitor costs proactively with budget, anomaly, and scheduled alerts.
- Split shared costs with cost allocation rules.
- Create and organize subscriptions to customize invoices.
- Configure payment options and pay invoices.
- Manage your billing information, such as legal entity, tax information, and agreements.

## How charges are processed

To understand how Cost Management and Billing works, you should first understand the Commerce system. At its core, Microsoft Commerce is a data pipeline that underpins all Microsoft commercial transactions, whether consumer or commercial. There are many inputs and connections to the pipeline. It includes the sign-up and Marketplace purchase experiences. However, we'll focus on the pieces that make up your cloud billing account and how charges are processed within the system.

:::image type="content" source="./media/commerce-pipeline.svg" alt-text="Diagram showing the Commerce data pipeline." border="false" lightbox="./media/commerce-pipeline.svg":::

In the left side of the diagram, your Azure, Microsoft 365, Dynamics 365, and Power Platform services are all pushing data into the Commerce data pipeline. Each service publishes data on a different cadence. In general, if data for one service is slower than another, it's due to how frequently those services are publishing their usage and charges.

As the data makes its way through the pipeline, the rating system applies discounts based on your specific price sheet and generates *rated usage*, which includes price and quantity for each cost record. It's the basis for what you see in Cost Management, but we'll cover that later. At the end of the month, credits are applied and the invoice is published. The process starts 72 hours after your billing period ends, which is usually the last day of the calendar month for most accounts. For example, if your billing period ends on March 31, charges will be finalized on April 4 at midnight.

> [!IMPORTANT]
> Credits are applied like a gift card or other payment instrument before the invoice is generated. While credit status is tracked as new charges flow into the data pipeline, credits aren't explicitly applied to these charges until the end of the month.

Everything up to this point makes up the billing process. It's where charges are finalized, discounts are applied, and invoices are published. Billing account and billing profile owners may be familiar with this process as part of the Billing experience within the Azure portal or Microsoft 365 admin center. The Billing experience allows you to review credits, manage your billing address and payment methods, pay invoices, and more – everything related to managing your billing relationship with Microsoft.

After discounts are applied, cost details then flow into Cost Management, where:

- The [anomaly detection](./understand/analyze-unexpected-charges.md) model identifies anomalies daily based on normalized usage (not rated usage).
- The cost allocation engine applies tag inheritance and [splits shared costs](./costs/allocate-costs.md).
- AWS cost and usage reports are pulled based on any [connectors for AWS](./costs/aws-integration-manage.md) you may have configured.  
    > [!NOTE]
    > The Connector for AWS in the Cost Management service retires on March 31, 2025. Users should consider alternative solutions for AWS cost management reporting. On March 31, 2024, Azure will disable the ability to add new Connectors for AWS for all customers. For more information, see [Retire your Amazon Web Services (AWS) connector](./costs/retire-aws-connector.md).
- Azure Advisor cost recommendations are pulled in to enable cost savings insights for subscriptions and resource groups.
- Cost alerts are sent out for [budgets](./costs/tutorial-acm-create-budgets.md), [anomalies](./understand/analyze-unexpected-charges.md#create-an-anomaly-alert), [scheduled alerts](./costs/save-share-views.md#subscribe-to-scheduled-alerts), and more based on the configured settings.

Lastly, cost details are made available from [cost analysis](./costs/quick-acm-cost-analysis.md) in the Azure portal and published to your storage account via [scheduled exports](./costs/tutorial-export-acm-data.md).

## How Cost Management and Billing relate

[Cost Management](https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu) is a set of FinOps tools that enable you to analyze, manage, and optimize your costs.

[Billing](https://portal.azure.com/#view/Microsoft_Azure_GTM/ModernBillingMenuBlade) provides all the tools you need to manage your billing account and pay invoices.

Cost Management is available from within the Billing experience. It's also available from every subscription, resource group, and management group in the Azure portal. The availability is to ensure everyone has full visibility into the costs they're responsible for. And, so they can optimize their workloads to maximize efficiency. Cost Management is also available independently to streamline the process for managing cost across multiple billing accounts, subscriptions, resource groups, and management groups.

:::image type="content" source="./media/cost-management-availability.svg" alt-text="Diagram showing how billing organization relates to Cost Management." border="false" lightbox="./media/cost-management-availability.svg":::


## What data is included in Cost Management and Billing?

Within the Billing experience, you can manage all the products, subscriptions, and recurring purchases you use; review your credits and commitments; and view and pay your invoices. Invoices are available online or as PDFs and include all billed charges and any applicable taxes. Credits are applied to the total invoice amount when invoices are generated. This invoicing process happens in parallel to Cost Management data processing, which means Cost Management doesn't include credits, taxes, and some purchases, like support charges in non-Microsoft Customer Agreement (MCA) accounts.

The classic Cloud Solution Provider (CSP) and sponsorship subscriptions aren't supported in Cost Management. These subscriptions will be supported after they transition to MCA.

For more information about supported offers, what data is included, or how data is refreshed and retained in Cost Management, see [Understand Cost Management data](./costs/understand-cost-mgt-data.md).

## Manage your billing account and invoices

Microsoft has several types of billing accounts. Each type has a slightly different experience to support the unique aspects of the billing account. To learn more, see [Billing accounts and scopes](./manage/view-all-accounts.md).

You use billing account management tasks to:

- View invoices and make payments.
- Configure your billing address and PO numbers.
- Create and organize subscriptions into departments or billing profiles.
- Renew or cancel products you've purchased.
- Enable access to Cost Management, Reservations, and Marketplace offers.
- View agreements, credits, and commitments.

Management for classic Cloud Solution Provider (CSP) and classic sponsorship subscriptions isn't available in Billing or Cost Management experiences because they're billed differently.

## Report on and analyze costs

Cost Management and Billing include several tools to help you understand, report on, and analyze your invoiced Microsoft Cloud and AWS costs.

- [**Cost analysis**](./costs/quick-acm-cost-analysis.md) is a tool for ad-hoc cost exploration. Get quick answers with lightweight insights and analytics.
**Power BI** is an advanced solution to build more extensive dashboards and complex reports or combine costs with other data. Power BI is available for billing accounts and billing profiles.
- [**Exports and the Cost Details API**](./automate/usage-details-best-practices.md) enable you to integrate cost details into external systems or business processes.
- The **Credits** page shows your available credit or prepaid commitment balance. They aren't included in cost analysis.
- The **Invoices** page provides a list of all previously invoiced charges and their payment status for your billing account.
- **Connectors for AWS** enable you to ingest your AWS cost details into Azure to facilitate managing Azure and AWS costs together. After configured, the connector also enables other capabilities, like budget and scheduled alerts.

For more information, see [Get started with Cost Management and Billing reporting](./costs/reporting-get-started.md).

## Organize and allocate costs

Organizing and allocating costs are critical to ensuring invoices are routed to the correct business units and can be further split for internal billing, also known as *chargeback*. Cost Management and Billing offer the following options to organize resources and subscriptions:

- MCA **billing profiles** and **invoice sections** are used to [group subscriptions into invoices](./manage/mca-section-invoice.md). Each billing profile represents a separate invoice that can be billed to a different business unit and each invoice section is segmented separately within those invoices. You can also view costs by billing profile or invoice section in costs analysis.
- EA **departments** and **enrollment accounts** are conceptually similar to invoice sections, as groups of subscriptions, but they aren't represented within the invoice PDF. They're included within the cost details backing each invoice, however. You can also view costs by department or enrollment account in costs analysis.
- **Management groups** also allow grouping subscriptions together, but offer a few key differences:
  - Management group access is inherited down to the subscriptions and resources.
  - Management groups can be layered into multiple levels and subscriptions can be placed at any level.
  - Management groups aren't included in cost details.
  - All historical costs are returned for management groups based on the subscriptions currently within that hierarchy. When a subscription moves, all historical cost moves.
  - Management groups are supported by Azure Policy and can have rules assigned to automate compliance reporting for your cost governance strategy.
- **Subscriptions** and **resource groups** are the lowest level at which you can organize your cloud solutions. At Microsoft, every product – sometimes even limited to a single region – is managed within its own subscription. It simplifies cost governance but requires more overhead for subscription management. Most organizations use subscriptions for business units and separating dev/test from production or other environments, then use resource groups for the products. It complicates cost management because resource group owners don't have a way to manage cost across resource groups. On the other hand, it's a straightforward way to understand who's responsible for most resource-based charges. Keep in mind that not all charges come from resources and some don't have resource groups or subscriptions associated with them. It also changes as you move to MCA billing accounts.
- **Resource tags** are the only way to add your own business context to cost details and are perhaps the most flexible way to map resources to applications, business units, environments, owners, etc. For more information, see [How tags are used in cost and usage data](./costs/understand-cost-mgt-data.md#how-tags-are-used-in-cost-and-usage-data) for limitations and important considerations.

Cost allocation is the set of practices to divide up a consolidated invoice. Or, to bill the people responsible for its various component parts. It's the process of assigning costs to different groups within an organization based on their consumption of resources and application of benefits. By providing visibility into costs to groups who are responsible for it, cost allocation helps organizations track and optimize their spending, improve budgeting and forecasting, and increase accountability and transparency. For more information, see [Cost allocation](./costs/cost-allocation-introduction.md).

How you organize and allocate costs plays a huge role in how people within your organization can manage and optimize costs. Be sure to plan ahead and revisit your allocation strategy yearly.

## Monitor costs with alerts

Cost Management and Billing offer many different types of emails and alerts to keep you informed and help you proactively manage your account and incurred costs.

- [**Budget alerts**](./costs/tutorial-acm-create-budgets.md) notify recipients when cost exceeds a predefined cost or forecast amount. Budgets can be visualized in cost analysis and are available on every scope supported by Cost Management. Subscription and resource group budgets can also be configured to notify an action group to take automated actions to reduce or even stop further charges.
- [**Anomaly alerts**](./understand/analyze-unexpected-charges.md) notify recipients when an unexpected change in daily usage has been detected. It can be a spike or a dip. Anomaly detection is only available for subscriptions and can be viewed within the cost analysis smart view. Anomaly alerts can be configured from the cost alerts page.
- [**Scheduled alerts**](./costs/save-share-views.md#subscribe-to-scheduled-alerts) notify recipients about the latest costs on a daily, weekly, or monthly schedule based on a saved cost view. Alert emails include a visual chart representation of the view and can optionally include a CSV file. Views are configured in cost analysis, but recipients don't require access to cost in order to view the email, chart, or linked CSV.
- **EA commitment balance alerts** are automatically sent to any notification contacts configured on the EA billing account when the balance is 90% or 100% used.
- **Invoice alerts** can be configured for MCA billing profiles and Microsoft Online Services Program (MOSP) subscriptions. For details, see [View and download your Azure invoice](./understand/download-azure-invoice.md).

For for information, see [Monitor usage and spending with cost alerts](./costs/cost-mgt-alerts-monitor-usage-spending.md).

## Optimize costs

Microsoft offers a wide range of tools for optimizing your costs. Some of these tools are available outside the Cost Management and Billing experience, but are included for completeness.

- There are many [**free services**](https://azure.microsoft.com/pricing/free-services/) available in Azure. Be sure to pay close attention to the constraints. Different services are free indefinitely, for 12 months, or 30 days. Some are free up to a specific amount of usage and some may have dependencies on other services that aren't free.
- The [**Azure pricing calculator**](https://azure.microsoft.com/pricing/calculator/) is the best place to start when planning a new deployment. You can tweak many aspects of the deployment to understand how you'll be charged for that service and identify which SKUs/options will keep you within your desired price range. For more information about pricing for each of the services you use, see [pricing details](https://azure.microsoft.com/pricing/).
- [**Azure Advisor cost recommendations**](./costs/tutorial-acm-opt-recommendations.md) should be your first stop when interested in optimizing existing resources. Advisor recommendations are updated daily and are based on your usage patterns. Advisor is available for subscriptions and resource groups. Management group users can also see recommendations but will need to select the desired subscriptions. Billing users can only see recommendations for subscriptions they have resource access to.
- [**Azure savings plans**](./savings-plan/index.yml) save you money when you have consistent usage of Azure compute resources. A savings plan can significantly reduce your resource costs by up to 65% from pay-as-you-go prices.
- [**Azure reservations**](https://azure.microsoft.com/reservations/) help you save up to 72% compared to pay-as-you-go rates by pre-committing to specific usage amounts for a set time duration.
- [**Azure Hybrid Benefit**](https://azure.microsoft.com/pricing/hybrid-benefit/) helps you significantly reduce costs by using on-premises Windows Server and SQL Server licenses or RedHat and SUSE Linux subscriptions on Azure.

For other options, see [Azure benefits and incentives](https://azure.microsoft.com/pricing/offers/#cloud).

## Next steps

Now that you're familiar with Cost Management + Billing, the next step is to start using the service.

- Start using Cost Management to [analyze costs](./costs/quick-acm-cost-analysis.md).
- You can also read more about [Cost Management best practices](./costs/cost-mgt-best-practices.md).
