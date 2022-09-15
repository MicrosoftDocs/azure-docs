---
title: Connect Microsoft Sentinel to STIX/TAXII threat intelligence feeds | Microsoft Docs
description: Learn about how to connect Microsoft Sentinel to industry-standard threat intelligence feeds to import threat indicators.
author: yelevin
ms.topic: how-to
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Connect Microsoft Sentinel to STIX/TAXII threat intelligence feeds

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

**See also**: [Connect your threat intelligence platform (TIP) to Microsoft Sentinel](connect-threat-intelligence-tip.md)

The most widely adopted industry standard for the transmission of threat intelligence is a [combination of the STIX data format and the TAXII protocol](https://oasis-open.github.io/cti-documentation/). If your organization receives threat indicators from solutions that support the current STIX/TAXII version (2.0 or 2.1), you can use the **Threat Intelligence - TAXII data connector** to bring your threat indicators into Microsoft Sentinel. This connector enables a built-in TAXII client in Microsoft Sentinel to import threat intelligence from TAXII 2.x servers.

:::image type="content" source="media/connect-threat-intelligence-taxii/threat-intel-taxii-import-path.png" alt-text="TAXII import path":::

To import STIX formatted threat indicators to Microsoft Sentinel from a TAXII server, you must get the TAXII server API Root and Collection ID, and then enable the Threat Intelligence - TAXII data connector in Microsoft Sentinel.

Learn more about [Threat Intelligence](understand-threat-intelligence.md) in Microsoft Sentinel, and specifically about the [TAXII threat intelligence feeds](threat-intelligence-integration.md#taxii-threat-intelligence-feeds) that can be integrated with Microsoft Sentinel.

## Prerequisites  

- You must have read and write permissions to the Microsoft Sentinel workspace to store your threat indicators.
- You must have a TAXII 2.0 or TAXII 2.1 **API Root URI** and **Collection ID**.

## Get the TAXII server API Root and Collection ID

TAXII 2.x servers advertise API Roots, which are URLs that host Collections of threat intelligence. You can usually find the API Root and the Collection ID in the documentation pages of the threat intelligence provider hosting the TAXII server. 

> [!NOTE]
> In some cases, the provider will only advertise a URL called a Discovery Endpoint. You can use the [cURL](https://en.wikipedia.org/wiki/CURL) utility to browse the discovery endpoint and request the API Root.

## Enable the Threat Intelligence - TAXII data connector in Microsoft Sentinel

To import threat indicators into Microsoft Sentinel from a TAXII server, follow these steps:

1. From the [Azure portal](https://portal.azure.com/), navigate to the **Microsoft Sentinel** service.

1. Choose the **workspace** to which you want to import threat indicators from the TAXII server.

1. Select **Data connectors** from the menu, select **Threat Intelligence - TAXII** from the connectors gallery, and select the **Open connector page** button.

1. Enter a **friendly name** for this TAXII server Collection, the **API Root URL**, the **Collection ID**, a **Username** (if required), and a **Password** (if required), and choose the group of indicators and the polling frequency you want. Select the **Add** button.

    :::image type="content" source="media/connect-threat-intelligence-taxii/threat-intel-configure-taxii-servers.png" alt-text="Configure TAXII servers":::
 
You should receive confirmation that a connection to the TAXII server was established successfully, and you may repeat the last step above as many times as you want, to connect to multiple Collections from one or more TAXII servers.

Within a few minutes, threat indicators should begin flowing into this Microsoft Sentinel workspace. You can find the new indicators in the **Threat intelligence** blade, accessible from the Microsoft Sentinel navigation menu.



## IP allow listing for the Microsoft Sentinel TAXII client

Some TAXII servers, like FS-ISAC, have a requirement to keep the IP addresses of the Microsoft Sentinel TAXII client on the allowlist. Most TAXII servers don't have this requirement.

When relevant, the following IP addresses are those to include in your allowlist:


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


## Next steps

In this document, you learned how to connect Microsoft Sentinel to threat intelligence feeds using the TAXII protocol. To learn more about Microsoft Sentinel, see the following articles.

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
