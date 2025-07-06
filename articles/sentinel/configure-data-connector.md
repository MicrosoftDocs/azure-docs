---
title: Connect Data Sources to Microsoft Sentinel Using Data Connectors
description: Learn how to connect data sources to Microsoft Sentinel using data connectors for improved threat detection.
author: batamig
ms.topic: how-to
ms.date: 07/06/2025
ms.author: bagol
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security


#Customer intent: As a security analyst, I want to install and configure data connectors in my SIEM platform so that I can ingest and analyze data from various sources for threat detection and response.

---

# Connect data sources to Microsoft Sentinel by using data connectors

Connect data sources to Microsoft Sentinel by installing and configuring data connectors. This article generally explains how to install data connectors available in the Microsoft Sentinel **Content hub** to ingest and analyze data for improved threat detection.

- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md)

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

Before you begin, make sure you have the appropriate access and you or someone in your organization installs the related solution.

- You must have read and write permissions on the Microsoft Sentinel workspace.
- Install the solution that includes the data connector from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).


## Enable a data connector

After you or someone in your organization installs the solution that includes the data connector you need, configure the data connector to start ingesting data.

1. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configurations** > **Data connectors**. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Configuration**, select **Data connectors**.

1. Search for and select the connector. If you don't see the data connector you want, check again that the relevant solution is installed in the **Content hub**.

1. Select **Open connector page**.  

   #### [Defender portal](#tab/defender-portal)
   :::image type="content" source="media/configure-data-connector/open-connector-page-option-defender-portal.png" alt-text="Screenshot of data connector details page in the Defender portal.":::
   #### [Azure portal](#tab/azure-portal)
   :::image type="content" source="media/configure-data-connector/open-connector-page-option.png" alt-text="Screenshot of data connector details page with open connector page button.":::
   ---

1. Review the **Prerequisites** for your data connector and ensure that they're fulfilled.

1. Follow the steps outlined in the **Configurations** section for your data connector.
  
   For some connectors, find more specific configuration information in the **Collect data** section in the Microsoft Sentinel documentation.

   - [Connect Microsoft Sentinel to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md)
   - [Data connector prerequisites](data-connectors-reference.md#windows-security-events-via-ama)
  
### Configure data retention and tiering.
   
If you have onboarded to the Microsoft Sentinel data lake, you can configure data retention and tiering for the data connector. The data lake consists of an analytics tier - your current Microsoft Sentinel workspaces, and a data lake tier where you can store data for up to 12 years. For more information on onboarding, see [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md). 

When you enable a connector, by default the data is sent to the analytics tier and mirrored in the data lake tier. Configure the data retention in each tier, or send the data only to the data lake tier. Retention and tiering are managed from the connector setup pages, or using the **Table management** page in the Defender portal. For more information on table management and retention, see [Manage data tiers and retention in Microsoft Defender Portal (Preview)](https://aka.ms/manage-data-defender-portal-overview). 

Once you have set up your connector, configure data retention and tiering using the following steps:

1. On the **Connector details** page, in the **Table management** section, select the table you want to manage.

    :::image type="content" source="media/configure-data-connector/connector-details.png"  lightbox="media/configure-data-connector/connector-details.png" alt-text="A screenshot showing a connector details page.":::

1. The table panel is displayed showing the current retention settings. 
1. To configure retention, select **Manage table**.
    :::image type="content" source="media/configure-data-connector/manage-table.png" lightbox="media/configure-data-connector/manage-table.png" alt-text="A screenshot showing the manage table panel.":::

1. The **Manage table** panel is displayed, showing the current retention settings. You can change the retention settings for the analytics tier and the data lake tier. The default is to mirror the data to the data lake tier with the same retention as the analytics tier. 
1. Under **Analytics retention** select the retention period for the analytics tier. 
1. To configure the data lake tier, select a retention period from the **Total retention** drop-down list. 
    :::image type="content" source="media/configure-data-connector/analytics-and-data-lake-tier.png" lightbox="media/configure-data-connector/analytics-and-data-lake-tier.png" alt-text="A screenshot showing the analytics and data lake tier options.":::

1. To change the tier to data lake only, select the **Data lake tier** and select a retention period from the **Retention** drop-down list. Selecting this option stops further ingestion to the analytics tier.

1. Select **Save** to save the changes.

:::image type="content" source="media/configure-data-connector/data-lake-tier-only.png" lightbox="media/configure-data-connector/data-lake-tier-only.png" alt-text="A screenshot showing the data lake tier retention only option.":::


After you configure the data connector, it might take some time for the data to be ingested into Microsoft Sentinel. It take 90 - 120 minutes for data to be ingested into the data lake. When the data connector is connected, you see a summary of the data in the **Data received** graph, and the connectivity status of the data types.  

   :::image type="content" source="media/configure-data-connector/connected-data-connector.png" alt-text="Screenshot of a data connector page with status connected and graph that shows the data received.":::

## Find your data

After you enable the connector successfully, the connector begins to stream data to the table schemas related to the data types you configured.

In the Defender portal, query data in the **Advanced hunting** page, or in the Azure portal, query data in the **Logs** page.  
Navigate to **Data lake explorer** , **KQL queries** to query data in the data lake. For more information, see [KQL and the Microsoft Sentinel data lake (preview)](https://aka.ms/kql-overview).

## Find support for a data connector

Both Microsoft and other organizations author Microsoft Sentinel data connectors. Find the support contact from data connector page in Microsoft Sentinel.

1. In the Microsoft Sentinel **Data connectors** page, select the relevant connector.
1. To access support and maintenance for the connector, use the support contact link in the **Supported by** field on the side panel for the connecter. 

   :::image type="content" source="media/configure-data-connector/support.png" alt-text="Screenshot showing the Supported by field for a data connector in Microsoft Sentinel." lightbox="media/configure-data-connector/support.png":::  

For more information, see [Data connector support](connect-data-sources.md#data-connector-support).

## Related content

For more information about solutions and data connectors in Microsoft Sentinel, see the following articles.

- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
- [Connect Microsoft Sentinel to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md)
- [What is Microsoft Sentinel data lake?](sentinel-lake-overview.md)
- [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Manage data tiers and retention in Microsoft Defender Portal (Preview)](https://aka.ms/manage-data-defender-portal-overview). 
- [KQL and the Microsoft Sentinel data lake (preview)](https://aka.ms/kql-overview)
- [Jupyter notebooks and the Microsoft Sentinel data lake (preview)](https://aka.ms/notebooks-overview)
