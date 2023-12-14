---
title: Azure Monitor billing meter names
description: Reference of Azure Monitor billing meter names.
services: azure-monitor
ms.topic: reference
ms.reviewer: Dale.Koetke
ms.date: 09/20/2023
---
# Azure Monitor billing meter names

This article contains a reference of the billing meter names used by Azure Monitor in [Azure Cost Management + Billing](cost-usage.md#azure-cost-management--billing). Use this information to interpret your monthly charges for Azure Monitor.

## Log data ingestion
The following table lists the meters used to bill for data ingestion in your Log Analytics workspaces, and whether the meter is regional. There's a different billing meter, `MeterId` in the export usage report for each region. Note that Basic Logs ingestion can be used when the workspace's pricing tier is Pay-as-you-go or any commitment tier. 


| Pricing tier |ServiceName | MeterName  | Regional Meter? |
| -------- | -------- | -------- | -------- |
| (any)        | Azure Monitor  | Basic Logs Data Ingestion | yes |
| Pay-as-you-go | Log Analytics | Pay-as-you-go Data Ingestion | yes |
| 100 GB/day Commitment Tier | Azure Monitor  | 100 GB Commitment Tier Capacity Reservation | yes |
| 200 GB/day Commitment Tier | Azure Monitor  | 200 GB Commitment Tier Capacity Reservation | yes |
| 300 GB/day Commitment Tier | Azure Monitor  | 300 GB Commitment Tier Capacity Reservation | yes |
| 400 GB/day Commitment Tier | Azure Monitor  | 400 GB Commitment Tier Capacity Reservation | yes |
| 500 GB/day Commitment Tier | Azure Monitor  | 500 GB Commitment Tier Capacity Reservation | yes |
| 1000 GB/day Commitment Tier | Azure Monitor  | 1000 GB Commitment Tier Capacity Reservation | yes |
| 2000 GB/day Commitment Tier | Azure Monitor  | 2000 GB Commitment Tier Capacity Reservation | yes |
| 5000 GB/day Commitment Ties | Azure Monitor  | 5000 GB Commitment Tier Capacity Reservation | yes |
| Per Node (legacy tier) | Insight and Analytics | Standard Node | no |
| Per Node (legacy tier)  | Insight and Analytics | Standard Data Overage per Node | no |
| Per Node (legacy tier)  | Insight and Analytics | Standard Data Included per Node | no |
| Standalone (legacy tier)  | Log Analytics | Pay-as-you-go Data Analyzed | no | 
| Standard (legacy tier)  | Log Analytics | Standard Data Analyzed | no |
| Premium (legacy tier)  | Log Analytics | Premium Data Analyzed | no |


The *Standard Data Included per Node* meter is used both for the Log Analytics [Per Node tier](logs/cost-logs.md#per-node-pricing-tier) data allowance, and also the [Defender for Servers data allowance](logs/cost-logs.md#workspaces-with-microsoft-defender-for-cloud), for workspaces in any pricing tier. 


## Other Azure Monitor logs meters

| ServiceName | MeterName | Regional Meter? | 
| ----------- | --------- | --------------- |
| Log Analytics | Pay-as-you-go Data Retention | yes |
| Insight and Analytics | Standard Data Retention | no |
| Azure Monitor | Data Archive | yes |
| Azure Monitor | Search Queries Scanned | yes |
| Azure Monitor | Search Jobs Scanned | yes |
| Azure Monitor | Data Restore | yes |
| Azure Monitor | Log Analytics data export Data Exported | yes |
| Azure Monitor | Platform Logs Data Processed | yes |

*Pay-as-you-go Data Retention* is used for workspaces in all modern pricing tiers (Pay-as-you-go and Commitment Tiers).  "Standard Data Retention" is used for workspaces in the legacy Per Node and Standalone pricing tiers. 

## Azure Monitor metrics meters:

| ServiceName | MeterName | Regional Meter? | 
| ----------- | --------- | --------------- |
| Azure Monitor | Metrics ingestion Metric samples | yes |
| Azure Monitor | Prometheus Metrics Queries Metric samples | yes |
| Azure Monitor | Native Metric Queries API Calls | yes |

## Azure Monitor alerts meters

| ServiceName | MeterName | Regional Meter? | 
| ----------- | --------- | --------------- |
| Azure Monitor | Alerts Metric Monitored | no |
| Azure Monitor | Alerts Dynamic Threshold | no |
| Azure Monitor | Alerts System Log Monitored at 1 Minute Frequency | no |
| Azure Monitor | Alerts System Log Monitored at 10 Minute Frequency | no |
| Azure Monitor | Alerts System Log Monitored at 15 Minute Frequency | no |
| Azure Monitor | Alerts System Log Monitored at 5 Minute Frequency | no |
| Azure Monitor | Alerts Resource Monitored at 1 Minute Frequency | no |
| Azure Monitor | Alerts Resource Monitored at 10 Minute Frequency | no |
| Azure Monitor | Alerts Resource Monitored at 15 Minute Frequency | no |
| Azure Monitor | Alerts Resource Monitored at 5 Minute Frequency | no |

## Azure Monitor web test meters

| ServiceName | MeterName | Regional Meter? | 
| ----------- | --------- | --------------- |
| Azure Monitor | Standard Web Test Execution | yes |
| Application Insights | Multi-step Web Test | no |

## Legacy classic Application Insights meters

| ServiceName | MeterName | Regional Meter? | 
| ----------- | --------- | --------------- |
| Application Insights | Enterprise Node | no |
| Application Insights | Enterprise Overage Data | no |


### Legacy Application Insights meters

Most Application Insights usage for both classic and workspace-based resources is reported on meters with **Log Analytics** for **Meter Category** because there's a single log back-end for all Azure Monitor components. Only Application Insights resources on legacy pricing tiers and multiple-step web tests are reported with **Application Insights** for **Meter Category**. The usage is shown in the **Consumed Quantity** column. The unit for each entry is shown in the **Unit of Measure** column. For more information, see [Understand your Microsoft Azure bill](../cost-management-billing/understand/review-individual-bill.md).

To separate costs from your Log Analytics and classic Application Insights usage, [create a filter](../cost-management-billing/costs/group-filter.md) on **Resource type**. To see all Application Insights costs, filter **Resource type** to **microsoft.insights/components**. For Log Analytics costs, filter **Resource type** to **microsoft.operationalinsights/workspaces**. (Workspace-based Application Insights is all billed to the Log Analytics workspace resourced.)