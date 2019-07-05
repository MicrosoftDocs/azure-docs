---
title: Translate behind firewalls - Translator Text API
titlesuffix: Azure Cognitive Services
description: Translate behind IP firewalls with the Translator Text API.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 06/04/2019
ms.author: swmachan
---

# How to translate behind IP firewalls with the Translator Text API

Translator Text API can translate behind firewalls using either domain-name or IP filtering. Domain-name filtering is the preferred method. We **do not recommend** running Microsoft Translator from behind an IP filtered firewall. The setup is likely to break in the future without notice.

## Translator IP Addresses
The IP addresses for api.cognitive.microsofttranslator.com - Microsoft Translator Text API as of November 20, 2018:

* **Asia Pacific:** 40.90.139.163, 104.44.89.44
* **Europe:** 40.90.138.4, 40.90.141.99
* **North America:** 40.90.139.36, 40.90.139.2


## Next steps
> [!div class="nextstepaction"]
> [Translate behind IP firewalls in your Translator API call](reference/v3-0-translate.md)
