---  
title: Setting up Microsoft Sentinel data lake (Preview)
titleSuffix: Microsoft Security  
description: Setting up and configuring connectors for Microsoft Sentinel data lake.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.custom: sentinel-graph
ms.date: 07/02/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  

# Setting up Microsoft Sentinel data lake (Preview)

The Microsoft Sentinel data lake mirrors data from Microsoft Sentinel workspaces. When you onboard to Microsoft Sentinel data lake, your existing Microsoft Sentinel data connectors are configured to send data to both the analytics tier - your Microsoft Sentinel workspaces, and mirror the data to the data lake tier for longer term storage. After onboarding, configure your connectors to retain data in each tier according to your requirements.   

This article explains how to set up connectors for the Microsoft Sentinel data lake and configure retention. For more information On onboarding, see [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)


## Setting up connectors for the lake

After onboarding, you can enable new connectors and configure retention for existing connectors. You can and choose to send the data to the analytics tier and mirror the data to the data lake tier, or send the data only to the data lake tier. Retention and tiering are managed from the connector setup pages, or using the **Table management** page in the Defender portal. For more information on table management and retention, see [Manage data tiers and retention in Microsoft Defender Portal (Preview)](https://aka.ms/manage-data-defender-portal-overview).

:::image type="content" source="media/setting-up-sentinel-data-lake/data-tiers.png" lightbox="media/setting-up-sentinel-data-lake/data-tiers.png" alt-text="A diagram showing the analytics and data lake tiers.":::

When you enable a connector, by default the data is sent to the analytics tier and mirrored in the data lake tier. When you enable Microsoft Sentinel data lake, the mirroring is automatically enabled for all the tables from onboarding forward. Mirrored data in the lake with the same retention as the analytics tier doesn't incur additional billing charges.
Preexisting data in the tables isn't mirrored. The retention of in the data lake tier set to the same value as the analytics tier. You can switch to ingest data to lake tier only. When you configure to ingest only to the data lake tier, ingestion to the analytics tier stops and the existing data in the analytics tier is retained according to the retention settings.

The data retained in Archive will still be available and can be restored using Search and Restore functionality. 

To configure retention and tiering for the data connector see [Configure data connector](configure-data-connector.md).

 ## Additional data sources

In addition to the tables already enabled by the connectors, data lake onboarding enables additional asset data in your lake from the following sources. This data is stored only in the data lake tier in the *default* workspace.  
- Entra ID
- Microsoft 365
- Azure Resources Graph (ARG) 

All tables in your XDR connector are enabled in your lake with 30-day retention without charge if you have only one Microsoft Sentinel workspace in your tenant. Navigate to **Table management** under **Datamangement** in the **System** menu items to extend retention of the XDR tables without having to extend the default retention of your analytics tier table.
 
## Auxiliary log tables 

When a Defender and Microsoft Sentinel customer onboards to the data lake, auxiliary log tables are no longer be visible in Microsoft Defender’s Advanced hunting or in the Microsoft Sentinel Azure portal. The auxiliary table data is available in the data lake, and can be queried using KQL queries under the **Data lake exploration** menu item in the Defender portal, or using Jupyter notebooks.    



## Related articles
- [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Manage data tiers and retention in Microsoft Defender Portal (preview)](https://aka.ms/manage-data-defender-portal-overview)
- [KQL and the Microsoft Sentinel data lake (preview)](https://aka.ms/kql-overview)
- [Jupyter notebooks and the Microsoft Sentinel data lake (preview)](https://aka.ms/notebooks-overview)
