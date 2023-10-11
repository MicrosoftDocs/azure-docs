---
title: Plan costs, understand Microsoft Sentinel pricing and billing
description: Learn how to plan your Microsoft Sentinel costs, and understand pricing and billing using the pricing calculator and other methods.
author: cwatson-cat
ms.author: cwatson
ms.custom: subject-cost-optimization
ms.topic: how-to
ms.date: 07/05/2023
#Customer intent: As a SOC manager, plan Microsoft Sentinel costs so I can understand and optimize the costs of my SIEM.
---

# Plan costs and understand Microsoft Sentinel pricing and billing

As you plan your Microsoft Sentinel deployment, you typically want to understand its pricing and billing models to optimize your costs. Microsoft Sentinel's security analytics data is stored in an Azure Monitor Log Analytics workspace. Billing is based on the volume of data *analyzed* in Microsoft Sentinel and *stored* in the Log Analytics workspace. The cost of both is combined in a simplified pricing tier. Learn more about the [simplified pricing tiers](#simplified-pricing-tiers) or learn more about [Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/microsoft-sentinel/) in general.

Before you add any resources for Microsoft Sentinel, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to help estimate your costs.

Costs for Microsoft Sentinel are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan costs and understand the billing for Microsoft Sentinel, you're billed for all Azure services and resources your Azure subscription uses, including Partner services.

This article is part of the [Deployment guide for Microsoft Sentinel](deploy-overview.md).

## Free trial

Enable Microsoft Sentinel on an Azure Monitor Log Analytics workspace and the first 10 GB/day is free for 31 days. The cost for both Log Analytics data ingestion and Microsoft Sentinel analysis charges up to the 10 GB/day limit are waived during the 31-day trial period. This free trial is subject to a 20 workspace limit per Azure tenant.

Usage beyond these limits will be charged per the pricing listed on the [Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/azure-sentinel) page. Charges related to extra capabilities for [automation](automation.md) and [bring your own machine learning](bring-your-own-ml.md) are still applicable during the free trial.

During your free trial, find resources for cost management, training, and more on the **News & guides > Free trial** tab in Microsoft Sentinel. This tab also displays details about the dates of your free trial, and how many days you have left until it expires.

## Identify data sources and plan costs accordingly

Identify the data sources you're ingesting or plan to ingest to your workspace in Microsoft Sentinel. Microsoft Sentinel allows you to bring in data from one or more data sources. Some of these data sources are free, and others incur charges. For more information, see [Free data sources](#free-data-sources).

## Estimate costs and billing before using Microsoft Sentinel

Use the [Microsoft Sentinel pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=azure-sentinel) to estimate new or changing costs. Enter *Microsoft Sentinel* in the Search box and select the resulting Microsoft Sentinel tile. The pricing calculator helps you estimate your likely costs based on your expected data ingestion and retention.

For example, enter the GB of daily data you expect to ingest in Microsoft Sentinel, and the region for your workspace. The calculator provides the aggregate monthly cost across these components:

- Microsoft Sentinel: Analytics logs and basic logs
- Azure Monitor: Retention
- Azure Monitor: Data Restore
- Azure Monitor: Search Queries and Search Jobs

## Understand the full billing model for Microsoft Sentinel

Microsoft Sentinel offers a flexible and predictable pricing model. For more information, see the [Microsoft Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/). Workspaces older than July 2023 might have Log Analytics workspace charges separate from Microsoft Sentinel in a classic pricing tier. For the related Log Analytics charges, see [Azure Monitor Log Analytics pricing](https://azure.microsoft.com/pricing/details/log-analytics/).

Microsoft Sentinel runs on Azure infrastructure that accrues costs when you deploy new resources. It's important to understand that there could be other, extra infrastructure costs that might accrue.

### How you're charged for Microsoft Sentinel

Pricing is based on the types of logs ingested into a workspace. Analytics logs typically make up most of your high value security logs. Basic logs tend to be verbose with low security value. It's important to note that billing is done per workspace on a daily basis for all log types and tiers.

#### Analytics logs

There are two ways to pay for the analytics logs: **Pay-As-You-Go** and **Commitment Tiers**.

- **Pay-As-You-Go** is the default model, based on the actual data volume stored and optionally for data retention beyond 90 days. Data volume is measured in GB (10<sup>9</sup> bytes).

- Log Analytics and Microsoft Sentinel have **Commitment Tier** pricing, formerly called Capacity Reservations. These pricing tiers are combined into simplified pricing tiers which are more predictable and offer substantial savings compared to **Pay-As-You-Go** pricing.

    **Commitment Tier** pricing starts at 100 GB/day. Any usage above the commitment level is billed at the Commitment Tier rate you selected. For example, a Commitment Tier of 100-GB bills you for the committed 100-GB data volume, plus any extra GB/day at the discounted rate for that tier.

    Increase your commitment tier anytime to optimize costs as your data volume increases. Lowering the commitment tier is only allowed every 31 days. To see your current Microsoft Sentinel pricing tier, select **Settings** in Microsoft Sentinel, and then select the **Pricing** tab. Your current pricing tier is marked as **Current tier**.

    To set and change your Commitment Tier, see [Set or change pricing tier](billing-reduce-costs.md#set-or-change-pricing-tier). Workspaces older than July 2023 will have the option to switch to the simplified pricing tiers experience to unify billing meters, or continue to use the classic pricing tiers which separate out the Log Analytics pricing from the classic Microsoft Sentinel classic pricing. For more information, see [simplified pricing tiers](#simplified-pricing-tiers).

#### Basic logs

Basic logs have a reduced price and are charged at a flat rate per GB. They have the following limitations:

- Reduced querying capabilities
- Eight-day retention
- No support for scheduled alerts

Basic logs are best suited for use in playbook automation, ad-hoc querying, investigations, and search. For more information, see [Configure Basic Logs in Azure Monitor](../azure-monitor/logs/basic-logs-configure.md).

### Simplified pricing tiers

Simplified pricing tiers combine the data analysis costs for Microsoft Sentinel and ingestion storage costs of Log Analytics into a single pricing tier. Here's a screenshot showing the simplified pricing tier that all new workspaces will use.

:::image type="content" source="media/billing/simplified-pricing-tier.png" alt-text="Screenshot shows simplified pricing tier." lightbox="media/billing/simplified-pricing-tier.png":::

Workspaces configured with classic pricing tiers have the option to switch to the simplified pricing tiers. For more information on how to **Switch to new pricing**, see [Enroll in a simplified pricing tier](enroll-simplified-pricing-tier.md).

Combining the pricing tiers offers a simplification to the overall billing and cost management experience, including visualization in the pricing page, and fewer steps estimating costs in the Azure calculator. To add further value to the new simplified tiers, the current [Microsoft Defender for Servers P2 benefit granting 500 MB/VM/day](../defender-for-cloud/faq-defender-for-servers.yml#is-the-500-mb-of-free-data-ingestion-allowance-applied-per-workspace-or-per-machine-) security data ingestion into Log Analytics has been extended to the simplified pricing tiers. This greatly increases the financial benefit of bringing eligible data ingested into Microsoft Sentinel for each VM protected in this manner.

### Understand your Microsoft Sentinel bill

Billable meters are the individual components of your service that appear on your bill and are shown in Microsoft Cost Management. At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all Microsoft Sentinel costs. There's a separate line item for each meter.

To see your Azure bill, select **Cost Analysis** in the left navigation of **Cost Management**. On the **Cost analysis** screen, select the drop-down caret in the **View** field, and select **Invoice details**.

The costs shown in the following image are for example purposes only. They're not intended to reflect actual costs. Starting July 1, 2023, legacy pricing tiers are prefixed with **Classic**. 

:::image type="content" source="media/billing/sample-bill-classic.png" alt-text="Screenshot showing the Microsoft Sentinel section of a sample Azure bill, to help you estimate costs." lightbox="media/billing/sample-bill-classic.png":::

Microsoft Sentinel and Log Analytics charges might appear on your Azure bill as separate line items based on your selected pricing plan. Simplified pricing tiers are represented as a single `sentinel` line item for the pricing tier. Since ingestion and analysis are billed on a daily basis, if your workspace exceeds its Commitment Tier usage allocation in any given day, the Azure bill shows one line item for the Commitment Tier with its associated fixed cost, and a separate line item for the cost beyond the Commitment Tier, billed at the same effective Commitment Tier rate. 

# [Simplified](#tab/simplified)
The following tabs show how Microsoft Sentinel costs appear in the **Service name** and **Meter** columns of your Azure bill depending on your simplified pricing tier. 

# [Classic](#tab/classic)
The following tabs show how Microsoft Sentinel and Log Analytics costs appear in the **Service name** and **Meter** columns of your Azure bill depending on your classic pricing tier. 

---

# [Commitment tiers](#tab/commitment-tiers/simplified)

If you're billed at the simplified commitment tier rate, this table shows how Microsoft Sentinel costs appear in the **Service name** and **Meter** columns of your Azure bill.

 Cost description | Service name | Meter |
|--|--|--|
| Microsoft Sentinel Commitment Tier | `Sentinel` | **`n` GB Commitment Tier** |
| Microsoft Sentinel Commitment Tier overage | `Sentinel` |**Analysis**|

# [Commitment tiers](#tab/commitment-tiers/classic)

If you're billed at the classic commitment tier rate, this table shows how Microsoft Sentinel and Log Analytics costs appear in the **Service name** and **Meter** columns of your Azure bill.

| Cost description | Service name | Meter |
|--|--|--|
| Microsoft Sentinel Commitment Tier | `Sentinel` | **Classic `n` GB commitment tier** |
| Log Analytics Commitment Tier | `Azure Monitor` | **`n` GB commitment tier** |
| Microsoft Sentinel Commitment Tier overage | `Sentinel` |**Classic Analysis**|
| Log Analytics over the Commitment Tier| `Log Analytics` |**Data Ingestion**|

# [Pay-As-You-Go](#tab/pay-as-you-go/simplified)

If you're billed at the simplified Pay-As-You-Go rate, this table shows how Microsoft Sentinel costs appear in the **Service name** and **Meter** columns of your Azure bill.

 Cost description | Service name | Meter |
|--|--|--|
| Pay-As-You-Go| `Sentinel` |**Pay-as-You-Go Analysis**|
| Basic logs data analysis| `Sentinel` |**Basic Logs Analysis**|


# [Pay-As-You-Go](#tab/pay-as-you-go/classic)

If you're billed at classic Pay-As-You-Go rate, this table shows how Microsoft Sentinel and Log Analytics costs appear in the **Service name** and **Meter** columns of your Azure bill.

 Cost description | Service name | Meter |
|--|--|--|
| Pay-As-You-Go| `Sentinel` |**Classic Pay-as-You-Go Analysis**|
| Pay-As-You-Go| `Log Analytics` |**Pay-as-You-Go Data Ingestion**|
| Basic logs data analysis| `Sentinel` |**Classic Basic Logs Analysis**|
| Basic logs data ingestion| `Azure Monitor` |**Basic Logs Data Ingestion**|


# [Free data meters](#tab/free-data-meters/simplified)

This table shows how Microsoft Sentinel and Log Analytics no charge costs appear in the **Service name** and **Meter** columns of your Azure bill for free data services when billing is at a simplified pricing tier. For more information, see [View Data Allocation Benefits](../azure-monitor/usage-estimated-costs.md#view-data-allocation-benefits).

 Cost description | Service name | Meter |
|--|--|--|
| Microsoft Sentinel Free Trial – Sentinel Analysis| `Sentinel` |**Free trial Analysis**|
| Microsoft 365 Defender Benefit – Data Ingestion| `Azure Monitor` |**Free Benefit - M365 Defender Data Ingestion**|
| Microsoft 365 Defender Benefit – Data Analysis| `Sentinel` |**Free Benefit - M365 Defender Analysis**|


# [Free data meters](#tab/free-data-meters/classic)

This table shows how Microsoft Sentinel and Log Analytics no charge costs appear in the **Service name** and **Meter** columns of your Azure bill for free data services when billing is at a classic pricing tier. For more information, see [View Data Allocation Benefits](../azure-monitor/usage-estimated-costs.md#view-data-allocation-benefits).

 Cost description | Service name | Meter |
|--|--|--|
| Microsoft Sentinel Free Trial – Log Analytics data ingestion| `Azure Monitor` |**Free Benefit - Az Sentinel Trial Data Ingestion**|
| Microsoft Sentinel Free Trial – Sentinel Analysis| `Sentinel` |**Free trial Analysis**|
| Microsoft 365 Defender Benefit – Data Ingestion| `Azure Monitor` |**Free Benefit - M365 Defender Data Ingestion**|
| Microsoft 365 Defender Benefit – Data Analysis| `Sentinel` |**Free Benefit - M365 Defender Analysis**|

---

Learn how to [view and download your Azure bill](../cost-management-billing/understand/download-azure-daily-usage.md).

## Costs and pricing for other services

Microsoft Sentinel integrates with many other Azure services, including Azure Logic Apps, Azure Notebooks, and bring your own machine learning (BYOML) models. Some of these services might have extra charges. Some of Microsoft Sentinel's data connectors and solutions use Azure Functions for data ingestion, which also has a separate associated cost.

Learn about pricing for these services:

- [Automation-Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/)
- [Notebooks pricing](https://azure.microsoft.com/pricing/details/machine-learning/)
- [BYOML pricing](https://azure.microsoft.com/pricing/details/machine-learning-studio/)
- [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/)

Any other services you use could have associated costs.

## Data retention and archived logs costs

After you enable Microsoft Sentinel on a Log Analytics workspace consider these configuration options: 

- Retain all data ingested into the workspace at no charge for the first 90 days. Retention beyond 90 days is charged per the standard [Log Analytics retention prices](https://azure.microsoft.com/pricing/details/monitor/).
- Specify different retention settings for individual data types. Learn about [retention by data type](../azure-monitor/logs/data-retention-archive.md#configure-retention-and-archive-at-the-table-level). 
- Enable long-term retention for your data and have access to historical logs by enabling archived logs. Data archive is a low-cost retention layer for archival storage. It's charged based on the volume of data stored and scanned. Learn how to [configure data retention and archive policies in Azure Monitor Logs](../azure-monitor/logs/data-retention-archive.md). Archived logs are in public preview.

The 90 day retention doesn't apply to basic logs. If you want to extend data retention for basic logs beyond eight days, store that data in archived logs for up to seven years.

## Other CEF ingestion costs

CEF is a supported Syslog events format in Microsoft Sentinel. Use CEF to bring in valuable security information from various sources to your Microsoft Sentinel workspace. CEF logs land in the CommonSecurityLog table in Microsoft Sentinel, which includes all the standard up-to-date CEF fields.

Many devices and data sources support logging fields beyond the standard CEF schema. These extra fields land in the AdditionalExtensions table. These fields could have higher ingestion volumes than the standard CEF fields, because the event content within these fields can be variable.

## Costs that might accrue after resource deletion

Removing Microsoft Sentinel doesn't remove the Log Analytics workspace Microsoft Sentinel was deployed on, or any separate charges that workspace might be incurring.

## Free data sources

The following data sources are free with Microsoft Sentinel:

- Azure Activity Logs.
- Office 365 Audit Logs, including all SharePoint activity, Exchange admin activity, and Teams.
- Security alerts, including alerts from Microsoft Defender for Cloud, Microsoft 365 Defender, Microsoft Defender for Office 365, Microsoft Defender for Identity, and Microsoft Defender for Endpoint.
- Microsoft Defender for Cloud and Microsoft Defender for Cloud Apps alerts. 

Although alerts are free, the raw logs for some Microsoft 365 Defender, Defender for Cloud Apps, Azure Active Directory (Azure AD), and Azure Information Protection (AIP) data types are paid.

The following table lists the data sources in Microsoft Sentinel that aren't charged. This is the same list as Log Analytics. For more information, see [excluded tables](../azure-monitor/logs/cost-logs.md#excluded-tables).

| Microsoft Sentinel data connector   | Free data type | 
|-------------------------------------|--------------------------------|
| **Azure Activity Logs**         | AzureActivity                  |           
| **Azure AD Identity Protection**         | SecurityAlert (IPC)                  | 
| **Office 365**                     | OfficeActivity (SharePoint)    | 
|| OfficeActivity (Exchange)|
|| OfficeActivity (Teams)          | 
| **Microsoft Defender for Cloud**                  | SecurityAlert (Defender for Cloud)             | 
| **Microsoft Defender for IoT**          | SecurityAlert (Defender for IoT)     | 
| **Microsoft 365 Defender**          | SecurityIncident | 
||SecurityAlert|
| **Microsoft Defender for Endpoint** | SecurityAlert (MDATP)          | 
| **Microsoft Defender for Identity** | SecurityAlert (AATP)           | 
| **Microsoft Defender for Cloud Apps**   | SecurityAlert (Defender for Cloud Apps)           | 


For data connectors that include both free and paid data types, select which data types you want to enable.

:::image type="content" source="media/billing/data-types.png" alt-text="Screenshot of the Data connector page for Defender for Cloud Apps, with the free security alerts selected and the paid MCAS Shadow IT Reporting data connection not enabled." lightbox="media/billing/data-types.png":::

Learn more about how to [connect data sources](connect-data-sources.md), including free and paid data sources.

## Learn more

- [Monitor costs for Microsoft Sentinel](billing-monitor-costs.md)
- [Reduce costs for Microsoft Sentinel](billing-reduce-costs.md)
- Learn [how to optimize your cloud investment with Microsoft Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
- For more tips on reducing Log Analytics data volume, see [Azure Monitor best practices - Cost management](../azure-monitor/best-practices-cost.md).

## Next steps

In this article, you learned how to plan costs and understand the billing for Microsoft Sentinel.

> [!div class="nextstepaction"]
> >[Deploy Microsoft Sentinel](deploy-overview.md)
