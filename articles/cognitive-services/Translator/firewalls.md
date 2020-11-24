---
title: Translate behind firewalls - Translator
titleSuffix: Azure Cognitive Services
description: Azure Cognitive Services Translator can translate behind firewalls using either domain-name or IP filtering.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 05/26/2020
ms.author: swmachan
---

# How to translate behind IP firewalls with Translator

Translator can translate behind firewalls using either domain-name or IP filtering. Domain-name filtering is the preferred method. We **do not recommend** running Microsoft Translator from behind an IP filtered firewall. The setup is likely to break in the future without notice.

## Translator IP Addresses
The IP addresses for api.cognitive.microsofttranslator.com - Translator as of August 21, 2019:

* **Asia Pacific:** 20.40.125.208, 20.43.88.240, 20.184.58.62, 40.90.139.163, 104.44.89.44
* **Europe:** 40.90.138.4, 40.90.141.99, 51.105.170.64, 52.155.218.251
* **North America:** 40.90.139.36, 40.90.139.2, 40.119.2.134, 52.224.200.129, 52.249.207.163

## Next steps
> [!div class="nextstepaction"]
> [Translate behind IP firewalls in Translator](reference/v3-0-translate.md)
