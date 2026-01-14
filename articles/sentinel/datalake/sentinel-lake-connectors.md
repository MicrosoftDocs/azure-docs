---  
title: Set up connectors for the Microsoft Sentinel data lake
titleSuffix: Microsoft Security  
description: Set up and configuring connectors for Microsoft Sentinel data lake.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.subservice: sentinel-graph
ms.date: 11/05/2025
ms.author: edbaynash  

ms.collection: ms-security  

# Customer intent: As a security admin, I want to set up connectors for Microsoft Sentinel data lake so that I can mirror and retain security data for long-term analysis.

---  

# Set up connectors for the Microsoft Sentinel data lake

The Microsoft Sentinel data lake mirrors data from Microsoft Sentinel workspaces. When you onboard to Microsoft Sentinel data lake, your existing Microsoft Sentinel data connectors are configured to send data to both the analytics tier - your Microsoft Sentinel workspaces, and mirror the data to the data lake tier for longer term storage. After onboarding, configure your connectors to retain data in each tier according to your requirements.   

This article explains how to set up connectors for the Microsoft Sentinel data lake and configure retention. For more information on onboarding, see [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md).

## Configure retention and data tiering

After onboarding, you can enable new connectors and configure retention for existing connectors. You can choose to send the data to the analytics tier and mirror the data to the data lake tier or send the data only to the data lake tier. You manage retention and tiering from the connector setup pages, or by using the **Table management** page in the Defender portal. For more information on table management and retention, see [Manage data tiers and retention in Microsoft Defender portal](../manage-data-overview.md).

:::image type="content" source="media/setting-up-sentinel-data-lake/data-tiers.png" lightbox="media/setting-up-sentinel-data-lake/data-tiers.png" alt-text="A diagram showing the analytics and data lake tiers.":::

When you enable a connector, by default the data is sent to the analytics tier and mirrored in the data lake tier. When you enable Microsoft Sentinel data lake, the mirroring is automatically enabled for all the tables from onboarding forward. Mirrored data in the data lake with the same retention as the analytics tier doesn't incur extra billing charges.
Preexisting data in the tables isn't mirrored. The retention of the data lake tier is set to the same value as the analytics tier. You can switch to ingest data to data lake tier only. When you configure to ingest only to the data lake tier, ingestion to the analytics tier stops and the existing data in the analytics tier is retained according to the retention settings.

The data retained in Archive is still available and can be restored by using Search and Restore functionality. 

To configure retention and tiering for the data connector see [Configure data connector](../configure-data-connector.md).

 ## Microsoft Sentinel XDR data

By default, Microsoft Defender XDR retains threat hunting data in the Analytics tier for 30 days. This data is always available. Some XDR tables can be ingested into the analytics and data lake tiers by increasing the retention time to more than 30 days. You can also ingest XDR data directly into the data lake tier without the analytics tier. For more information, see [Manage XDR data in Microsoft Sentinel](../manage-data-overview.md#manage-xdr-data-in-microsoft-sentinel). 


## Custom log tables

Microsoft Monitoring Agent(MMA) and Log analytics Agent (CLV1) custom tables aren't mirrored to the data lake.
  
Tables created by using the Logs Ingestion API or Azure Monitor Agent (AMA) and DCR-based custom tables are mirrored. For more information, see [Logs Ingestion API in Azure Monitor](/azure/azure-monitor/logs/logs-ingestion-api-overview).

## Auxiliary log tables 

When you onboard to both Microsoft Defender and Microsoft Sentinel and then onboard to the data lake, you no longer see auxiliary log tables in Microsoft Defender’s Advanced hunting or in the Microsoft Sentinel Azure portal. The auxiliary table data is available in the data lake and you can query it by using KQL queries or Jupyter notebooks. Find KQL queries under **Microsoft Sentinel** > **Data lake exploration** in the Defender portal.
 

## Related articles

- [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Manage data tiers and retention in Microsoft Defender Portal](../manage-data-overview.md)
- [KQL and the Microsoft Sentinel data lake](kql-overview.md)
- [Jupyter notebooks and the Microsoft Sentinel data lake](notebooks-overview.md)
