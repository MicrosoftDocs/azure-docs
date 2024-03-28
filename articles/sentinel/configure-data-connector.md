---
title: Connect your data sources to Microsoft Sentinel by using data connectors
description: Learn how to install and configure a data connector in Microsoft Sentinel.
author: cwatson-cat
ms.topic: how-to
ms.date: 03/28/2024
ms.author: cwatson
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customer intent: As a security architect or SOC analyst, I want to connect my data source so that I can ingest data into Microsoft Sentinel for security monitoring and threat protection.
---

# Connect your data sources to Microsoft Sentinel by using data connectors

Install and configure data connectors to ingest your data into Microsoft Sentinel. Data connectors are available as part of solutions from the content hub in Microsoft Sentinel. After you install a solution from the content hub, the related data connectors are available to enable and configure. To find and install solutions that include data connectors, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md). 

This article provides general information about how to enable a data connector and how to find more detailed installation instructions for other data connectors. For more information about data connectors in Microsoft Sentinel, see the following articles:

- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)


[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

Before you begin, make sure you have the appropriate access and you or someone in your organization installs the related solution.
- You must have read and write permissions on the Microsoft Sentinel workspace.
- Install the solution that includes the data connector from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).


## Enable a data connector

After you or someone in your organization installs the solution that includes the data connector you need, configure the data connector to start ingesting data.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Configuration**, select **Data connectors**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configurations** > **Data connectors**.
1. Search for and select the connector. If you don't see the data connector you want, install the solution associated with it from the **Content Hub**.
1. Select **Open connector page**.  

   #### [Azure portal](#tab/azure-portal)

   :::image type="content" source="media/configure-data-connector/open-connector-page-option.png" alt-text="Screenshot of data connector details page with open connector page button.":::

   #### [Defender portal](#tab/defender-portal)

   :::image type="content" source="media/configure-data-connector/open-connector-page-option-defender-portal.png" alt-text="Screenshot of data connector details page in the Defender portal.":::

1. Review the **Prerequisites**. To configure the data connector, fulfill all the prerequisites.
1. Follow the steps outlined in the **Configurations** section.
  
   For some connectors, find more specific configuration information in the **Collect data** section in the Microsoft Sentinel documentation. For example, see the following articles:
   - [Connect Microsoft Sentinel to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md)
   - [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
  
   After you configure the data connector, it might take some time for the data to be ingested into Microsoft Sentinel. When the data connector is connected, you see a summary of the data in the **Data received** graph, and the connectivity status of the data types.  

   :::image type="content" source="media/configure-data-connector/connected-data-connector.png" alt-text="Screenshot of a data connector page with status connected and graph that shows the data received.":::

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
-  [Connect Microsoft Sentinel to Azure, Windows, Microsoft, and Amazon services](connect-azure-windows-microsoft-services.md)
- [About Microsoft Sentinel content and solutions](sentinel-solutions.md)
- [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md)