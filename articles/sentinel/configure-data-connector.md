---
title: Connect Data Sources to Microsoft Sentinel Using Data Connectors
description: Learn how to connect data sources to Microsoft Sentinel using data connectors for improved threat detection.
author: batamig
ms.topic: how-to
ms.date: 05/27/2025
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
  
   After you configure the data connector, it might take some time for the data to be ingested into Microsoft Sentinel. When the data connector is connected, you see a summary of the data in the **Data received** graph, and the connectivity status of the data types.  

   :::image type="content" source="media/configure-data-connector/connected-data-connector.png" alt-text="Screenshot of a data connector page with status connected and graph that shows the data received.":::

## Find your data

After you enable the connector successfully, the connector begins to stream data to the table schemas related to the data types you configured.

In the Defender portal, query data in the **Advanced hunting** page, or in the Azure portal, query data in the **Logs** page.

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
