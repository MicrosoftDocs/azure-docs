---  
title:  Manage XDR Data in Microsoft Sentinel
titleSuffix: Microsoft Security  
description: Manage XDR Data in Microsoft Sentinel
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 08/12/2025
ms.author: edbaynash  

ms.collection: ms-security  


# Customer intent: As a security administrator, I want to manage XDR data in Microsoft Sentinel, so that I can ensure relevant data is available for investigation and analysis.
---  
 


# Manage XDR data in Microsoft Sentinel

Extended Detection and Response (XDR) data isn't ingested by default into the analytics or data lake tiers in Microsoft Sentinel. By default, XDR data is only available for query through Advanced hunting for a maximum of 30 days. To enable ingestion into the analytics and data lake tiers and manage XDR data in Microsoft Sentinel, configure retention settings in the Microsoft Defender portal. Retention settings are in **Microsoft Sentinel** > **Configuration** > **Tables** in the Microsoft Defender portal.

## Supported tables

Not all XDR tables are supported for ingestion into the analytics or data lake tiers. Tables with the table type **XDR** aren't supported for ingestion.

## Manage ingestion using retention settings

Manage XDR data ingestion into the analytics and data lake tiers by setting retention for the Sentinel-type tables on the **Tables** page in the Defender portal. To enable ingestion, set the retention to more than 30 days. 

If the Microsoft Sentinel XDR connector is enabled, the tables you selected when setting up the connector are automatically ingested into the analytics tier and mirrored to the data lake tier. The default retention is 30 days, and it can be extended up to 12 years. For a list of tables see [Microsoft Defender XDR integration with Microsoft Sentinel](connect-microsoft-365-defender.md?tabs=MDE#connect-events). XDR tables that weren't specified in the collector can be ingested into the analytics tier and mirrored to the data lake tier by setting the retention to more than 30 days.
    
If the Microsoft Sentinel XDR connector isn't enabled, XDR tables aren't automatically ingested but can still be ingested by setting retention for more than 30 days. The data is automatically mirrored to the data lake tier.  For more information on retention settings, see [Configure table settings in Microsoft Sentinel (preview)](manage-table-tiers-retention.md).

Stop ingesting data into the analytics tier by resetting the analytics tier retention and total retention to the default 30 days.

## Retention and costs

The following table summarizes the retention and cost implications for the different tiers in Microsoft Sentinel:

|Tier|	Retention| Notes|
|---|---|---|
|Advanced Hunting (Default)|	30 days	| Default,  included in XDR license|
|Analytics tier | 90 days | Free storage for Sentinel-enabled workspaces. Ingestion charges apply.|
|Data lake	| Configurable. By default, the same as the analytics tier. | Free storage when total retention is the same as analytics tier retention. Retaining data in the data lake beyond the analytics tier retention period incurs additional storage costs.|

For more information on billing and costs, see [Understand the full billing model for Microsoft Sentinel](billing.md#understand-the-full-billing-model-for-microsoft-sentinel)


## Retention configuration examples

The following table summarizes the retention settings and their implications for ingestion and costs in Microsoft Sentinel.

In all examples, XDR data is available through advanced hunting for at least 30 days, regardless of the retention settings in the analytics or data lake tiers.

 Analytics tier retention | Total retention |  Analytics tier ingestion costs| Analytics tier storage costs | Data lake tier costs |
|---|---|---|---|---|
| 30 days, if Microsoft Sentinel XDR connector is enabled | N/A | No additional costs | No additional costs | N/A |
| 90 days | 90 days | Costs apply for analytics tier ingestion. | No additional costs. 90 days included free. | No additional costs. Total retention matches analytics tier retention.|
| 90 days | 180 days | Costs apply for analytics tier ingestion. | No additional costs; 90 days included free. | Costs apply for 90 days of additional data lake retention (180 - 90 days). |
| 30 days | 180 days | Costs apply for analytics tier ingestion. | No additional costs; 90 days included free. | Costs apply for 150 days of additional data lake retention (180 - 30 days). |
| 180 days | 1 year | Costs apply for analytics tier ingestion. | Costs apply for 90 days of additional analytics tier retention. | Costs apply for 185 days of additional data lake retention (365 - 180 days). |

## Related content    

- [Manage data tiers and retention in Microsoft Sentinel (preview)](manage-data-overview.md)
- [Configure table settings in Microsoft Sentinel (preview)](manage-table-tiers-retention.md)
- [Billing for Microsoft Sentinel](billing.md)
- [Microsoft Defender XDR integration with Microsoft Sentinel](connect-microsoft-365-defender.md?tabs=MDE#connect-events)
