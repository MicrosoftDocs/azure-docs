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
ms.date: 12/06/2021
ms.author: lajanuar
---

# How to translate behind IP firewalls with Translator

Translator can translate behind firewalls using either domain-name or IP filtering. Domain-name filtering is the preferred method. If you still require IP filtering, we suggest you to get the [IP addresses details using service tag](../../virtual-network/service-tags-overview.md#service-tags-on-premises). Translator is under the **CognitiveServicesManagement** service tag.

We **do not recommend** running Microsoft Translator from behind a specific IP filtered firewall. The setup is likely to break in the future without notice.

The IP addresses for Translator geographical endpoints as of September 21, 2021 are:

|Geography|Base URL (geographical endpoint)|IP Addresses|
|:--|:--|:--|
|United States|api-nam.cognitive.microsofttranslator.com|20.42.6.144, 20.49.96.128, 40.80.190.224, 40.64.128.192|
|Europe|api-eur.cognitive.microsofttranslator.com|20.50.1.16, 20.38.87.129|
|Asia Pacific|api-apc.cognitive.microsofttranslator.com|40.80.170.160, 20.43.132.96, 20.37.196.160, 20.43.66.16|
