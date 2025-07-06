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

This article explains how to set up connectors for the Microsoft Sentinel data lake and configure retention. For more information On onboarding, see [Onboarding to Microsoft Sentinel data lake](senitnel-lake-onboarding.md)


## Setting up connectors for the lake

After onboarding, you can enable new connectors and configure retention for existing connectors. You can and choose to send the data to the analytics tier and mirror the data to the data lake tier, or send the data only to the data lake tier. Retention and tiering are managed from the connector setup pages, or using the **Table management** page in the Defender portal. For more information on table management and retention, see [Manage data tiers and retention in Microsoft Defender Portal (Preview)](https://aka.ms/manage-data-defender-portal-overview).

:::image type="content" source="media/setting-up-sentinel-data-lake/data-tiers.png" lightbox="media/setting-up-sentinel-data-lake/data-tiers.png" alt-text="A diagram showing the analytics and data lake tiers.":::

When you enable a connector, by default the data to be sent to the analytics tier and mirrored in the data lake tier. When you enable Microsoft Sentinel data lake, the mirroring is automatically enabled for all the tables from onboarding forward. Mirrored data in the lake with the same retention as the analytics tier doesn't incur additional billing charges.
Preexisting data in the tables isn't mirrored. The retention of in the data lake tier set to the same value as the analytics tier. You can switch to ingest data to lake tier only. When you configure to ingest only to the data lake tier, ingestion to the analytics tier stops and the existing data in the analytics tier is retained according to the retention settings.

The data retained in Archive will still be available and can be restored using Search and Restore functionality. 

### Set up retention from the connector page

To set up retention from the connector page in the Defender portal, under **Microsoft Sentinel** select **Configuration**, then select **Data connectors** 

1. Search for and select the connector you want to configure.
1. Select the **Open connector page** button.
1. The **Connector details** page is displayed, including a **Table management** section.
1. Select the table you want to manage.

    :::image type="content" source="media/setting-up-sentinel-data-lake/connector-setup.png"  lightbox="media/setting-up-sentinel-data-lake/connector-setup.png" alt-text="A screenshot showing a connector details page.":::

1. The table panel is displayed showing the current retention settings. 
1. To configure retention, select **Manage table**.
    :::image type="content" source="media/setting-up-sentinel-data-lake/manage-table.png" lightbox="media/setting-up-sentinel-data-lake/manage-table.png" alt-text="A screenshot showing the manage table panel.":::

1. The **Manage table** panel is displayed, showing the current retention settings. You can change the retention settings for the analytics tier and the data lake tier. The default is to mirror the data to the data lake tier with the same retention as the analytics tier. 
1. Under **Analytics retention** select the retention period for the analytics tier. 
1. To configure the data lake tier, select a retention period from the **Total retention** drop-down list. 
    :::image type="content" source="media/setting-up-sentinel-data-lake/analytics-and-data-lake-tier.png" lightbox="media/setting-up-sentinel-data-lake/analytics-and-data-lake-tier.png" alt-text="A screenshot showing the analytics and data lake tier options.":::

1. To change the tier to data lake only, select the **Data lake tier** and select a retention period from the **Retention** drop-down list. Selecting this option stops further ingestion to the analytics tier.

1. Select **Save** to save the changes.

:::image type="content" source="media/setting-up-sentinel-data-lake/data-lake-tier-only.png" lightbox="media/setting-up-sentinel-data-lake/data-lake-tier-only.png" alt-text="A screenshot showing the data lake tier retention only option.":::

 ## Additional data sources

In addition to the tables already enabled by the connectors, data lake onboarding enables additional asset data in your lake from the follwowing sources. This data is stored only in the data lake tier in the *default* workspace.  
- Entra ID
- Microsoft 365
- Azure Resources Graph (ARG) 

All tables in your XDR connector are enabled in your lake with 30-day retention without charge if you have only one Microsoft Sentinel workspace in your tenant. Navigate to **Table management** under **Datamangement** in the **System** menu items to extend retention of the XDR tables without having to extend the default retention of your analytics tier table.
 
## Auxiliary log tables 

When a Defender and Sentinel customer onboards to the data lake, auxiliary log tables are no longer be visible in Microsoft Defender’s Advanced hunting or in the Microsoft Sentinel Azure portal. The auxiliary table data is available in the data lake, and can be queried using KQL queries under the **Data lake exploration** menu item in the Defender portal, or using Jupyter notebooks.    



## Related articles
- [Onboarding to Microsoft Sentinel data lake](senitnel-lake-onboarding.md)
- [Manage data tiers and retention in Microsoft Defender Portal (preview)](https://aka.ms/manage-data-defender-portal-overview)
- [KQL and the Microsoft Sentinel data lake (preview)](https://aka.ms/kql-overview)
- [Jupyter notebooks and the Microsoft Sentinel data lake (preview)](https://aka.ms/notebooks-overview)
