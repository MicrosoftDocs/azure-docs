---
title: Tutorial - Send shortener links through SMS with Azure Communication Services
titleSuffix: An Azure Communication Services tutorial
description: Learn how to use the Azure URL Shortener sample to send short links through SMS.
author: ddematheu2
manager: shahen
services: azure-communication-services
ms.author: dademath
ms.date: 03/8/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: sms
zone_pivot_groups: acs-js-csharp
---

# Send shortener links through SMS with Azure Communication Services


SMS messages are limited to 160 characters. This can pose limitations when sending links to customers and truncate the message for many reasons; the link can exceed 160 characters and/or contain query parameters for the user profile and cookie information, etc. Leverage the Azure URL shortener to help stay within the 160 character limit. 

In this document we will outline the process of integrating Azure Communication Services with the Azure URL Shortener, an open source service that enables you to easily create, manage and monitor shortened links.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Sign an HTTP request with C#](./includes/url-shortener-csharp.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Sign an HTTP request with Python](./includes/url-shortener-js.md)]
::: zone-end

## Next steps

- Add a [custom domain](https://github.com/microsoft/AzUrlShortener/wiki/How-to-Add-a-Custom-Domain) for your shortened URLs.
