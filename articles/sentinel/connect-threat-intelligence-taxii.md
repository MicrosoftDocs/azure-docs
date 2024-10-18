---
title: Connect to STIX/TAXII threat intelligence feeds
titleSuffix: Microsoft Sentinel
description: Learn how to connect Microsoft Sentinel to industry-standard threat intelligence feeds to import threat indicators.
author: austinmccollum
ms.topic: how-to
ms.date: 3/14/2024
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security admin, I want to integrate STIX/TAXII feeds into Microsoft Sentinel to ingest threat intelligence, generating alerts and incidents to enhance threat detection and response capabilities.

---

# Connect Microsoft Sentinel to STIX/TAXII threat intelligence feeds

The most widely adopted industry standard for the transmission of threat intelligence is a [combination of the STIX data format and the TAXII protocol](https://oasis-open.github.io/cti-documentation/). If your organization receives threat indicators from solutions that support the current STIX/TAXII version (2.0 or 2.1), you can use the Threat Intelligence - TAXII data connector to bring your threat indicators into Microsoft Sentinel. This connector enables a built-in TAXII client in Microsoft Sentinel to import threat intelligence from TAXII 2.x servers.

:::image type="content" source="media/connect-threat-intelligence-taxii/threat-intel-taxii-import-path.png" alt-text="Screenshot that shows a TAXII import path.":::

To import STIX-formatted threat indicators to Microsoft Sentinel from a TAXII server, you must get the TAXII server API root and collection ID. Then you enable the Threat Intelligence - TAXII data connector in Microsoft Sentinel.

Learn more about [threat intelligence](understand-threat-intelligence.md) in Microsoft Sentinel, and specifically about the [TAXII threat intelligence feeds](threat-intelligence-integration.md#taxii-threat-intelligence-feeds) that you can integrate with Microsoft Sentinel.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

For more information, see [Connect your threat intelligence platform (TIP) to Microsoft Sentinel](connect-threat-intelligence-tip.md).

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

- To install, update, and delete standalone content or solutions in the **Content hub**, you need the Microsoft Sentinel Contributor role at the resource group level.
- You must have read and write permissions to the Microsoft Sentinel workspace to store your threat indicators.
- You must have a TAXII 2.0 or TAXII 2.1 API root URI and collection ID.

## Get the TAXII server API root and collection ID

TAXII 2.x servers advertise API roots, which are URLs that host collections of threat intelligence. You can usually find the API root and the collection ID in the documentation pages of the threat intelligence provider that hosts the TAXII server.

> [!NOTE]
> In some cases, the provider only advertises a URL called a discovery endpoint. You can use the [cURL](https://en.wikipedia.org/wiki/CURL) utility to browse the discovery endpoint and request the API root.

## Install the Threat Intelligence solution in Microsoft Sentinel

To import threat indicators into Microsoft Sentinel from a TAXII server, follow these steps:

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Content management**, select **Content hub**.

   For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Content management** > **Content hub**.

1. Find and select the **Threat Intelligence** solution.

1. Select the :::image type="icon" source="media/connect-mdti-data-connector/install-update-button.png"::: **Install/Update** button.

For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](sentinel-solutions-deploy.md).

## Enable the Threat Intelligence - TAXII data connector

1. To configure the TAXII data connector, select the **Data connectors** menu.

1. Find and select the **Threat Intelligence - TAXII** data connector, and then select **Open connector page**.

    :::image type="content" source="media/connect-threat-intelligence-taxii/taxii-data-connector-config.png" alt-text="Screenshot that shows the Data connectors page with the TAXII data connector listed." lightbox="media/connect-threat-intelligence-taxii/taxii-data-connector-config.png":::

1. Enter a name for this TAXII server collection in the **Friendly name** text box. Fill in the text boxes for **API root URL**, **Collection ID**, **Username** (if necessary), and **Password** (if necessary). Choose the group of indicators and the polling frequency you want. Select **Add**.

    :::image type="content" source="media/connect-threat-intelligence-taxii/threat-intel-configure-taxii-servers.png" alt-text="Screenshot that shows configuring TAXII servers.":::
 
You should receive confirmation that a connection to the TAXII server was established successfully. Repeat the last step as many times as you want to connect to multiple collections from one or more TAXII servers.

Within a few minutes, threat indicators should begin flowing into this Microsoft Sentinel workspace. Find the new indicators on the **Threat intelligence** pane. You can access it from the Microsoft Sentinel menu.

## IP allowlisting for the Microsoft Sentinel TAXII client

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

## Related content

In this article, you learned how to connect Microsoft Sentinel to threat intelligence feeds by using the TAXII protocol. To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
