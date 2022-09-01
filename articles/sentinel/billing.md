---
title: Plan costs, understand Microsoft Sentinel pricing and billing
description: Learn how to plan your Microsoft Sentinel costs, and understand pricing and billing using the pricing calculator and other methods.
author: cwatson-cat
ms.author: cwatson
ms.custom: subject-cost-optimization
ms.topic: how-to
ms.date: 07/14/2022
#Customer intent: As a SOC manager, plan Microsoft Sentinel costs so I can understand and optimize the costs of my SIEM.
---

# Plan costs and understand Microsoft Sentinel pricing and billing

As you plan your Microsoft Sentinel deployment, you typically want to understand the Microsoft Sentinel pricing and billing models, so you can optimize your costs. Microsoft Sentinel security analytics data is stored in an Azure Monitor Log Analytics workspace. Billing is based on the volume of that data in Microsoft Sentinel and the Azure Monitor Log Analytics workspace storage. Learn more about [Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/microsoft-sentinel/).

Before you add any resources for Microsoft Sentinel, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to help estimate your costs.

Costs for Microsoft Sentinel are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan costs and understand the billing for Microsoft Sentinel, you're billed for all Azure services and resources your Azure subscription uses, including Partner services.

## Free trial

Try Microsoft Sentinel free for the first 31 days. Microsoft Sentinel can be enabled at no extra cost on an Azure Monitor Log Analytics workspace, subject to the limits stated below:

- **New Log Analytics workspaces** can ingest up to 10 GB/day of log data for the first 31-days at no cost. New workspaces include workspaces that are less than three days old.

   Both Log Analytics data ingestion and Microsoft Sentinel charges are waived during the 31-day trial period. This free trial is subject to a 20 workspace limit per Azure tenant.

- **Existing Log Analytics workspaces** can enable Microsoft Sentinel at no extra cost. Existing workspaces include any workspaces created more than three days ago.

   Only the Microsoft Sentinel charges are waived during the 31-day trial period.

Usage beyond these limits will be charged per the pricing listed on the [Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/azure-sentinel) page. Charges related to extra capabilities for [automation](automation.md) and [bring your own machine learning](bring-your-own-ml.md) are still applicable during the free trial.

During your free trial, find resources for cost management, training, and more on the **News & guides > Free trial** tab in Microsoft Sentinel. This tab also displays details about the dates of your free trial, and how many days you have left until it expires.

## Identify data sources and plan costs accordingly

Identify the data sources you're ingesting or plan to ingest to your workspace in Microsoft Sentinel. Microsoft Sentinel allows you to bring in data from one or more data sources. Some of these data sources are free, and others incur charges. For more information, see [Free data sources](#free-data-sources).

## Estimate costs and billing before using Microsoft Sentinel

If you're not yet using Microsoft Sentinel, you can use the [Microsoft Sentinel pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=azure-sentinel) to estimate potential costs. Enter *Microsoft Sentinel* in the Search box and select the resulting Microsoft Sentinel tile. The pricing calculator helps you estimate your likely costs based on your expected data ingestion and retention.

For example, you can enter the GB of daily data you expect to ingest in Microsoft Sentinel, and the region for your workspace. The calculator provides the aggregate monthly cost across these components:

- Azure Monitor data ingestion: Analytics logs and basic logs
- Microsoft Sentinel data analytics: Analytics logs and basic logs
- Data retention
- Data archive (archived logs)
- Basic logs queries

## Understand the full billing model for Microsoft Sentinel

Microsoft Sentinel offers a flexible and predictable pricing model. For more information, see the [Microsoft Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/). For the related Log Analytics charges, see [Azure Monitor Log Analytics pricing](https://azure.microsoft.com/pricing/details/log-analytics/).

Microsoft Sentinel runs on Azure infrastructure that accrues costs when you deploy new resources. It's important to understand that there could be other, extra infrastructure costs that might accrue.

### How you're charged for Microsoft Sentinel

Microsoft Sentinel offers flexible pricing based on the types of logs ingested into a workspace. Analytics logs typically make up most of your high security value logs. Basic logs tend to be verbose with low security value.

#### Analytics logs

There are two ways to pay for the analytics logs: **Pay-As-You-Go** and **Commitment Tiers**.

- **Pay-As-You-Go** is the default model, based on the actual data volume stored and optionally for data retention beyond 90 days. Data volume is measured in GB (10^9 bytes).

- Log Analytics and Microsoft Sentinel also have **Commitment Tier** pricing, formerly called Capacity Reservations, which is more predictable and saves as much as 65% compared to Pay-As-You-Go pricing.

    With Commitment Tier pricing, you can buy a commitment starting at 100 GB/day. Any usage above the commitment level is billed at the Commitment Tier rate you selected. For example, a Commitment Tier of 100 GB bills you for the committed 100 GB data volume, plus any extra GB/day at the discounted rate for that tier.

    You can increase your commitment tier anytime, and decrease it every 31 days, to optimize costs as your data volume increases or decreases. To see your current Microsoft Sentinel pricing tier, select **Settings** in the Microsoft Sentinel left navigation, and then select the **Pricing** tab. Your current pricing tier is marked as **Current tier**.

    To set and change your Commitment Tier, see [Set or change pricing tier](billing-reduce-costs.md#set-or-change-pricing-tier).

#### Basic logs (preview)

Basic logs have a reduced price and are charged at a flat rate per GB. They have the following limitations:

- Reduced querying capabilities
- Eight-day retention
- No support for scheduled alerts

Basic logs are best suited for use in playbook automation, ad-hoc querying, investigations, and search. For more information, see [Configure Basic Logs in Azure Monitor](../azure-monitor/logs/basic-logs-configure.md).

### Understand your Microsoft Sentinel bill

Billable meters are the individual components of your service that appear on your bill and are also shown in cost analysis under your service. At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all Microsoft Sentinel costs. There's a separate line item for each meter.

To see your Azure bill, select **Cost Analysis** in the left navigation of **Cost Management + Billing**. On the **Cost analysis** screen, select the drop-down caret in the **View** field, and select **Invoice details**.

The costs shown in the following image are for example purposes only. They're not intended to reflect actual costs.

:::image type="content" source="media/billing/sample-bill.png" alt-text="Screenshot showing the Microsoft Sentinel section of a sample Azure bill, to help you estimate costs." lightbox="media/billing/data-types.png":::

Microsoft Sentinel and Log Analytics charges appear on your Azure bill as separate line items based on your selected pricing plan. If you exceed your workspace's Commitment Tier usage in a given month, the Azure bill shows one line item for the Commitment Tier with its associated fixed cost, and a separate line item for the ingestion beyond the Commitment Tier, billed at your same Commitment Tier rate.

The following tabs show how Microsoft Sentinel and Log Analytics costs appear in the **Service name** and **Meter** columns of your Azure bill depending on your pricing tier.

#### [Commitment tier](#tab/commitment-tier)

If you're billed at the commitment tier rate, this table shows how Microsoft Sentinel and Log Analytics costs appear in the **Service name** and **Meter** columns of your Azure bill.

| Cost description | Service name | Meter |
|--|--|--|
| Microsoft Sentinel Commitment Tier | `sentinel` | **`n` gb commitment tier** |
| Log Analytics Commitment Tier | `azure monitor` | **`n` gb commitment tier** |
| Microsoft Sentinel overage over the Commitment Tier| `sentinel` |**analysis**|
| Log Analytics overage over the Commitment Tier| `log analytics` |**data ingestion**|
| Basic logs data ingestion| `azure monitor` |**data ingestion - Basic Logs**|
| Basic logs data analysis| `sentinel` |**Analysis - Basic Logs**|

#### [Pay-As-You-Go](#tab/pay-as-you-go)

If you're billed at Pay-As-You-Go rate, this table shows how Microsoft Sentinel and Log Analytics costs appear in the **Service name** and **Meter** columns of your Azure bill.

 Cost description | Service name | Meter |
|--|--|--|
| Pay-As-You-Go| `sentinel` |**analysis**|
| Pay-As-You-Go| `log analytics` |**data ingestion**|
| Basic logs data ingestion| `azure monitor` |**data ingestion - Basic Logs**|
| Basic logs data analysis| `sentinel` |**Analysis - Basic Logs**|

#### [Free data meters](#tab/free-data-meters)

This table shows how Microsoft Sentinel and Log Analytics costs appear in the **Service name** and **Meter** columns of your Azure bill for free data services. For more information, see [View Data Allocation Benefits](../azure-monitor/usage-estimated-costs.md#view-data-allocation-benefits).

 Cost description | Service name | Meter |
|--|--|--|
| Microsoft Sentinel Free Trial – Log Analytics data ingestion| `azure monitor` |**Data Ingestion – Free Benefit – Sentinel Trial**|
| Microsoft Sentinel Free Trial – Sentinel Analysis| `sentinel` |**Free trial**|
| M365 Defender Benefit – Data Ingestion| `azure monitor` |**Free Benefit - M365 Defender Data Ingestion**|
| M365 Defender Benefit – Data Analysis| `sentinel` |**Free Benefit - M365 Defender Analysis**|

---

Learn how to [view and download your Azure bill](../cost-management-billing/understand/download-azure-daily-usage.md).

## Costs and pricing for other services

Microsoft Sentinel integrates with many other Azure services, including Azure Logic Apps, Azure Notebooks, and bring your own machine learning (BYOML) models. Some of these services may have extra charges. Some of Microsoft Sentinel's data connectors and solutions use Azure Functions for data ingestion, which also has a separate associated cost.

Learn about pricing for these services:

- [Automation-Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/)
- [Notebooks pricing](https://azure.microsoft.com/pricing/details/machine-learning/)
- [BYOML pricing](https://azure.microsoft.com/pricing/details/machine-learning-studio/)
- [Azure Functions pricing](https://azure.microsoft.com/pricing/details/functions/)

Any other services you use could have associated costs.

## Data retention and archived logs costs

After you enable Microsoft Sentinel on a Log Analytics workspace: 

- You can retain all data ingested into the workspace at no charge for the first 90 days. Retention beyond 90 days is charged per the standard [Log Analytics retention prices](https://azure.microsoft.com/pricing/details/monitor/).
- You can specify different retention settings for individual data types. Learn about [retention by data type](../azure-monitor/logs/data-retention-archive.md#set-retention-and-archive-policy-by-table). 
- You can also enable long-term retention for your data and have access to historical logs by enabling archived logs. Data archive is a low-cost retention layer for archival storage. It's charged based on the volume of data stored and scanned. Learn how to [configure data retention and archive policies in Azure Monitor Logs](../azure-monitor/logs/data-retention-archive.md). Archived logs are in public preview.

The 90 day retention doesn't apply to basic logs. If you want to extend data retention for basic logs beyond eight days, you can store that data in archived logs for up to seven years.

## Other CEF ingestion costs

CEF is a supported Syslog events format in Microsoft Sentinel. You can use CEF to bring in valuable security information from various sources to your Microsoft Sentinel workspace. CEF logs land in the CommonSecurityLog table in Microsoft Sentinel, which includes all the standard up-to-date CEF fields.

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

The following table lists the free data sources you can enable in Microsoft Sentinel. 

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


For data connectors that include both free and paid data types, you can select which data types you want to enable.

:::image type="content" source="media/billing/data-types.png" alt-text="Screenshot of the Data connector page for Defender for Cloud Apps, with the free security alerts selected and the paid MCAS Shadow IT Reporting not selected." lightbox="media/billing/data-types.png":::

Learn more about how to [connect data sources](connect-data-sources.md), including free and paid data sources.

Data connectors listed as public preview don't generate cost. Data connectors generate cost only once becoming Generally Available (GA).

## Next steps

- [Monitor costs for Microsoft Sentinel](billing-monitor-costs.md)
- [Reduce costs for Microsoft Sentinel](billing-reduce-costs.md)
- Learn [how to optimize your cloud investment with Azure Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/learn/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
- For more tips on reducing Log Analytics data volume, see [Azure Monitor best practices - Cost management](../azure-monitor/best-practices-cost.md).
