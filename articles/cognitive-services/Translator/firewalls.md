---
title: Translate behind firewalls - Translator
titleSuffix: Azure Cognitive Services
description: Azure Cognitive Services Translator can translate behind firewalls using either domain-name or IP filtering.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 04/19/2023
ms.author: lajanuar
---

# How to translate behind IP firewalls with Translator

Translator can translate behind firewalls using either [Domain-name](../../firewall/dns-settings.md#configure-dns-proxy---azure-portal) or IP filtering. Domain-name filtering is the preferred method.

## Virtual network endpoints

To find the virtual network endpoint for your Translator resource complete the following steps:

1. Navigate to your Translator resource in the Azure portal.
1. Select **Networking** from the **Resource Management** section.
1. Under the **Firewalls and virtual networks** tab, choose **Selected Networks and Private Endpoints**.

   :::image type="content" source="media/firewall-setting-azure-portal.png" alt-text="Screenshot of the firewall setting in the Azure portal.":::

1. Select **Save** to apply your changes.
1. Select **Keys and Endpoint** from the **Resource Management** section.
1. Select the **Virtual Network** tab.
1. Listed there are the endpoints for Text Translation and Document Translation.

   :::image type="content" source="media/virtual-network-endpoint.png" alt-text="Screenshot of the virtual network endpoint.":::

## IP addresses

If you still require IP filtering, you can get the [IP addresses details using service tag](../../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files). Translator is under the **CognitiveServicesManagement** service tag.

Running Microsoft Translator from behind a specific IP filtered firewall is **not recommended**. The setup is likely to break in the future without notice.

The IP addresses for Translator geographical endpoints as of September 21, 2021 are:

|Geography|Base URL (geographical endpoint)|IP Addresses|
|:--|:--|:--|
|United States|api-nam.cognitive.microsofttranslator.com|20.42.6.144, 20.49.96.128, 40.80.190.224, 40.64.128.192|
|Europe|api-eur.cognitive.microsofttranslator.com|20.50.1.16, 20.38.87.129|
|Asia Pacific|api-apc.cognitive.microsofttranslator.com|40.80.170.160, 20.43.132.96, 20.37.196.160, 20.43.66.16|

## Next steps

[**Translator virtual network support**](reference/v3-0-reference.md#virtual-network-support)

[**Configure virtual networks**](../cognitive-services-virtual-networks.md#grant-access-from-an-internet-ip-range)