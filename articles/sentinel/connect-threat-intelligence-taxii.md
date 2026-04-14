---
title: Connect to STIX/TAXII threat intelligence feeds
titleSuffix: Microsoft Sentinel
description: Learn how to connect Microsoft Sentinel to industry-standard threat intelligence feeds to import threat indicators.
author: poliveria  
ms.topic: how-to
ms.date: 1/20/2025
ms.author: pauloliveria 
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security
ms.custom: sfi-image-nochange


#Customer intent: As a security admin, I want to integrate STIX/TAXII feeds into Microsoft Sentinel to ingest threat intelligence, generating alerts and incidents to enhance threat detection and response capabilities.

---

# Use STIX/TAXII to import and export threat intelligence in Microsoft Sentinel

[The STIX data format and the TAXII protocol](https://oasis-open.github.io/cti-documentation/) are the most widely adopted industry standards for transmitting threat intelligence. Microsoft Sentinel supports integration with threat intelligence platforms using the standards, and provides built-in connectors for importing and exporting threat intelligence.

Use the Threat Intelligence – TAXII data connector to import threat indicators from TAXII 2.0 or 2.1 servers into your Sentinel workspace. To share threat intelligence externally, configure the Threat Intelligence – TAXII Export connector, which enables secure, standards-based export to supported TAXII 2.1 platforms.

This article walks you through both processes - connecting to STIX/TAXII feeds for import and configuring export to TAXII servers.

Learn more about [threat intelligence](understand-threat-intelligence.md) in Microsoft Sentinel, and specifically about the [TAXII threat intelligence feeds](threat-intelligence-integration.md#taxii-threat-intelligence-feeds) that you can integrate with Microsoft Sentinel.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

For more information, see [Connect your threat intelligence platform (TIP) to Microsoft Sentinel](connect-threat-intelligence-tip.md).

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

- To install, update, and delete standalone content or solutions in the **Content hub**, you need the Microsoft Sentinel Contributor role at the resource group level.
- You must have a TAXII 2.0 or TAXII 2.1 API root URI and collection ID.

## Get the TAXII server API root and collection ID

TAXII 2.x servers advertise API roots, which are URLs that host collections of threat intelligence. You can usually find the API root and the collection ID in the documentation pages of the threat intelligence provider that hosts the TAXII server.

> [!NOTE]
> In some cases, the provider only advertises a URL called a discovery endpoint. You can use the [cURL](https://en.wikipedia.org/wiki/CURL) utility to browse the discovery endpoint and request the API root.

## Install the Threat Intelligence solution in Microsoft Sentinel

To import threat indicators into Microsoft Sentinel from a TAXII server or export threat indicators from Microsoft Sentinel, install the Threat Intelligence solution:

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Content management**, select **Content hub**.

   For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Content management** > **Content hub**.

1. Find and select the **Threat Intelligence** solution.

1. Select the :::image type="icon" source="media/connect-mdti-data-connector/install-update-button.png"::: **Install/Update** button.

For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](sentinel-solutions-deploy.md).

## Enable the Threat Intelligence - TAXII data connector

To configure the TAXII data connector:

1. Select the **Data connectors** menu.

1. Find and select the **Threat Intelligence - TAXII** data connector, and then select **Open connector page**.

    :::image type="content" source="media/connect-threat-intelligence-taxii/taxii-data-connector.png" alt-text="Screenshot that shows the Data connectors page with the TAXII data connector listed." lightbox="media/connect-threat-intelligence-taxii/taxii-data-connector.png":::

1. Enter a name for this TAXII server collection in the **Friendly name** text box. Fill in the text boxes for **API root URL**, **Collection ID**, **Username** (if necessary), and **Password** (if necessary). Choose the group of indicators and the polling frequency you want. Select **Add**.

    :::image type="content" source="media/connect-threat-intelligence-taxii/threat-intel-configure-taxii-servers.png" alt-text="Screenshot that shows configuring TAXII servers.":::
 
You should receive confirmation that a connection to the TAXII server was established successfully. Repeat the last step as many times as you want to connect to multiple collections from one or more TAXII servers.

Within a few minutes, threat indicators should begin flowing into this Microsoft Sentinel workspace. Find the new indicators on the **Threat intelligence** pane. You can access it from the Microsoft Sentinel menu.

### IP allowlisting for the Microsoft Sentinel TAXII client

Some TAXII servers, like FS-ISAC, have a requirement to keep the IP addresses of the Microsoft Sentinel TAXII client on the allowlist. Most TAXII servers don't have this requirement.

When relevant, the following IP addresses are the addresses to include in your allowlist:

:::row:::
   :::column span="":::
      - 20.193.17.32
      - 20.197.219.106
      - 20.48.128.36
      - 20.199.186.58
      - 40.80.86.109
      - 52.158.170.36
   :::column-end:::
   :::column span="":::
      - 20.52.212.85
      - 52.251.70.29
      - 20.74.12.78
      - 20.194.150.139
      - 20.194.17.254
      - 51.13.75.153
   :::column-end:::
   :::column span="":::
      - 102.133.139.160
      - 20.197.113.87
      - 40.123.207.43
      - 51.11.168.197
      - 20.71.8.176
      - 40.64.106.65
   :::column-end:::
:::row-end:::

## Enable the Threat intelligence - TAXII Export data connector 

To configure the TAXII data connector:

1. Make sure you have the latest version of the Threat Intelligence solution in Microsoft Sentinel. For more information, see [Install the Threat Intelligence solution in Microsoft Sentinel](#install-the-threat-intelligence-solution-in-microsoft-sentinel).

1. Select the **Data connectors** menu.

1. Select the **Threat intelligence - TAXII Export** data connector and then select **Open connector page** in the side pane.

    :::image type="content" source="media/connect-threat-intelligence-taxii/taxii-export-data-connector.png" alt-text="Screenshot that shows the Data connectors page with the TAXII Export data connector listed." lightbox="media/connect-threat-intelligence-taxii/taxii-export-data-connector.png":::

1. In the **Configuration** area on the **Threat intelligence - TAXII Export** page: 

   - Enter a name for this TAXII server collection in the **Friendly name (for server)** text box. 
   - Fill in the textboxes for **API root URL**, **Collection ID**. For more information, see [Get the TAXII server API root and collection ID](#get-the-taxii-server-api-root-and-collection-id). 
   - Select an **Basic authentication** or **API key** from the **Authentication type** dropdown and provide the relevant authentication details.
   - Select **Enable rules** to apply the rules described on the connector page to all exported threat intelligence.

   For example:

      ### [Defender portal](#tab/defender-portal)

      :::image type="content" source="media/connect-threat-intelligence-taxii/add-taxii-export.png" alt-text="Screenshot that shows configuring the TAXII Export server for export in the Defender portal."  lightbox="media/connect-threat-intelligence-taxii/add-taxii-export.png":::

      ### [Azure portal](#tab/azure-portal)

      :::image type="content" source="media/connect-threat-intelligence-taxii/add-taxii-export-azure.png" alt-text="Screenshot that shows configuring the TAXII Export server for export in the Azure portal."  lightbox="media/connect-threat-intelligence-taxii/add-taxii-export-azure.png":::

      ---

   > [!NOTE]
   > Editing existing connectors is currently not supported. To change the configuration of a TAXII server or its rules, reinstall the connector.        

1. Select **Add** to add your server.

### IP allowlisting for the Threat Intelligence - TAXII Export connector

Add these IP addresses to your allowlist to ensure that your export operations don't get blocked:

:::row:::
    :::column span="":::
        - 68.218.134.151
        - 4.237.173.121
        - 68.218.191.192
        - 68.218.191.208
        - 74.163.73.85
        - 74.163.73.84
        - 108.140.47.197
        - 108.140.47.196
        - 130.107.0.17
        - 130.107.0.16
        - 52.242.47.153
        - 52.242.47.152
        - 4.186.93.129
        - 4.186.93.128
        - 57.158.18.39
        - 57.158.18.38
        - 128.203.32.17
        - 20.232.93.192
        - 128.24.7.173
        - 128.24.7.172
        - 4.251.60.81
        - 4.251.60.80
        - 20.111.81.65
        - 20.111.81.64
        - 20.218.50.5
        - 20.218.50.4
    :::column-end:::
    :::column span="":::
        - 72.144.227.117
        - 72.144.227.116
        - 51.4.37.231
        - 20.217.163.215
        - 72.146.91.160
        - 4.232.40.176
        - 74.176.2.247
        - 74.176.2.246
        - 74.226.38.228
        - 4.190.136.176
        - 4.181.55.53
        - 4.181.55.52
        - 20.200.167.49
        - 20.200.167.48
        - 4.207.244.69
        - 132.164.237.192
        - 4.235.51.87
        - 4.235.51.86
        - 51.120.182.208
        - 4.220.173.230
        - 4.171.25.225
        - 4.171.25.224
        - 4.253.54.45
        - 4.253.54.44
        - 172.209.40.109
        - 172.209.40.108
    :::column-end:::
    :::column span="":::
        - 172.188.182.119
        - 172.188.182.118
        - 20.207.217.212
        - 74.224.83.8
        - 135.225.179.229
        - 135.225.179.228
        - 20.91.127.183
        - 20.91.127.182
        - 4.226.56.22
        - 74.242.228.97
        - 74.242.60.137
        - 74.242.4.65
        - 74.243.66.228
        - 74.243.66.227
        - 74.243.225.230
        - 74.243.225.229
        - 74.177.108.204
        - 172.187.102.73
        - 51.142.135.18
        - 51.142.135.17
        - 50.85.238.240
        - 132.220.84.130
        - 172.184.49.127
        - 172.184.49.126
        - 4.149.254.64
        - 172.179.34.64
    :::column-end:::
:::row-end:::


## Related content

In this article, you learned how to connect Microsoft Sentinel to threat intelligence feeds by using the TAXII protocol. To learn more about working with threat intelligence in Microsoft Sentinel, see the following articles:

- [Work with Microsoft Sentinel threat intelligence](work-with-threat-indicators.md)
