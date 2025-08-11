---  
title:  Manage XDR Data in Microsoft Sentinel
titleSuffix: Microsoft Security  
description: Manage XDR Data in Microsoft Sentinel
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 08/11/2025
ms.author: edbaynash  

ms.collection: ms-security  


# Customer intent: As a security administrator, I want to manage XDR data in Microsoft Sentinel, so that I can ensure relevant data is available for investigation and analysis.
---  
 


# Manage XDR data in Microsoft Sentinel

Extended Detection and Response (XDR) data isn't ingested by default into the analytics tier or the data lake tier in Microsoft Sentinel. XDR data is only available for query through Advanced hunting for a maximum of 30 days. To enable ingestion into the analytics and the data lake tiers and manage XDR data in Microsoft Sentinel, configure the retention settings in the Microsoft Defender portal. Retention settings are found in  **Microsoft Sentinel** > **Configuration** > **Tables** in the Microsoft Defender portal.

## Supported tables

Not all XDR tables are supported for ingestion into the analytics tier or the data lake tier. To see which tables are supported, navigate to the **Tables** page in the Defender portal. Select the **Tier** filter and choose **XDR default**.

The list shows all tables produced by XDR. There are two values in the **Table type** column:
+ **Sentinel**: Tables that can be ingested into the analytics tier and mirrored to the data lake tier.
+ **XDR**: Tables that can't be ingested into the analytics or data lake tiers. These tables are available for query through Advanced hunting with a retention period of 30 days.

:::image type="content" source="./media/manage-xdr-data/tables-page.png" lightbox="./media/manage-xdr-data/tables-page.png" alt-text="A screenshot showing the Tables management page in the Defender portal.":::

## Manage ingestion using retention settings

To manage ingestion of XDR data into the analytics tier and the data lake tier, configure the retention settings for the Sentinel type tables in the **Tables** page in the Defender portal. 

If the Microsoft Sentinel XDR connector is enabled, the XDR events tables are automatically ingested into analytics tier and mirrored the data lake tier. The default retention is 30 days, which can be extended for up to 12 years. For a list of tables see [Microsoft Defender XDR integration with Microsoft Sentinel](connect-microsoft-365-defender.md?tabs=MDE#connect-events). Other XDR tables can be ingested into the analytics tier and mirrored to the data lake tier by configuring the retention settings to more than 30 days.

If the Microsoft Sentinel XDR connector isn't enabled, XDR tables aren't automatically ingested. To ingest XDR data into the analytics tier, configure the retention settings for a period greater than 30 days for either analytics or total retention. The data is automatically mirrored to the data lake tier.  For more information on retention settings, see [Configure table settings in Microsoft Sentinel (preview)](manage-table-tiers-retention.md).

To see which tables are currently being ingested, navigate to the **Tables** page and filter for the **XDR default** tier. Tables with more than 30 days of retention in either tier are currently binging ingested into the analytics tier and mirrored to the data lake tier. When the Microsoft Sentinel XDR connector is enabled, XDR events tables are ingested even if the retention is 30 days.

To stop ingesting data into the analytics tier, reset the analytics tier retention and total retention to the default 30 days.

## Retention and cost overview

The following table summarizes the retention and cost implications for the different tiers in Microsoft Sentinel:

|Tier|	Retention| Notes|
|---|---|---|
|Advanced Hunting (Default)|	30 days	| Default,  included in XDR license|
|Analytics tier | 90 days | Free storage for Sentinel-enabled workspaces. Ingestion charges apply.|
|Data lake	| Configurable. By default, the same as the analytics tier. | Free storage when total retention is the same as analytics tier retention. Retaining data in the data lake beyond the analytics tier retention period incurs additional storage costs.|




## Retention configuration examples

The following table summarizes the retention settings and their implications for ingestion and costs in Microsoft Sentinel.

In all examples, XDR data is available through Advanced hunting for a minimum of 30 days, regardless of the retention settings in the analytics or data lake tiers.

 Analytics tier retention | Total retention |  Analytics tier ingestion costs| Analytics tier storage costs | Data lake tier costs |
|---|---|---|---|---|
| 30 days, if Microsoft Sentinel XDR connector is enabled | N/A | No additional costs | No additional costs. | N/A |
| 90 days | 90 days | Costs apply for analytics tier ingestion. | No additional costs. 90 days included free. | No additional costs. Total retention matches analytics tier retention.|
| 90 days | 180 days | Costs apply for analytics tier ingestion. | No additional costs. 90 days included free. | Costs apply for 90 days of additional data lake retention (180 - 90 days). |
| 30 days | 180 days | Costs apply for analytics tier ingestion. | No additional costs 90 days included free. | Costs apply for 150 days of additional data lake retention (180 - 30 days).|
| 180 days | 1 year | Costs apply for analytics tier ingestion. | Costs apply for 90 days of additional analytics tier retention | Costs apply for 185 days of additional data lake retention (365 - 180 days). |

## Related content    

- [Manage data tiers and retention in Microsoft Sentinel (preview)](manage-data-overview.md)
- [Configure table settings in Microsoft Sentinel (preview)](manage-table-tiers-retention.md)
- [Billing for Microsoft Sentinel](billing.md)
- [Microsoft Defender XDR integration with Microsoft Sentinel](connect-microsoft-365-defender.md?tabs=MDE#connect-events)
