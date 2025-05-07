---
title: Send short URL
titleSuffix: An Azure Communication Services article
description: This article describes how to use the Azure URL Shortener sample to send short links through SMS.
author: tophpalmer
manager: shahen
services: azure-communication-services
ms.author: chpalm
ms.date: 03/8/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: devx-track-extended-java, devx-track-js
zone_pivot_groups: acs-js-csharp
---

# Send short URL

SMS messages are limited to 160 characters, which can impair your ability to send URLs to customers. URLs can exceed the 160 character limit as they contain query parameters, encrypted information, and so on. You can use the Azure URL shortener to generate short URLs that are appropriate to send through SMS as they stay well below the 160 character limit. 

This document outlines the process of integrating Azure Communication Services with the Azure URL Shortener. The URL Shortener is an open source service that enables you to easily create, manage, and monitor shortened links.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Send SMS with short url in C#](./includes/url-shortener-csharp.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Send SMS with short url in JavaScript](./includes/url-shortener-js.md)]
::: zone-end

## Next steps

- Add a [custom domain](https://github.com/microsoft/AzUrlShortener/wiki/How-to-Add-a-Custom-Domain) for your shortened URLs.
