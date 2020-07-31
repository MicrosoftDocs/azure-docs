---
title: Get Started With SMS
description: TODO
author: mikben    
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services
ms.custom: tracking-python, devx-track-javascript
zone_pivot_groups: programming-languages-set-diberry-3core
---

# Quickstart: Get Started With SMS

> [!IMPORTANT]
> Azure Communication Services is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Communication Services lets you easily send and receive SMS messages. In this quickstart, learn how to use Communication Services to send SMS messages using the ACS SDKs.

You can receive SMS messages and Delivery Reports by using ACS' EventGrid integration to subscribe to webhooks, and have ACS call your service when an SMS message is received. See the [EventGrid concept for more information.](../../concepts/event-handling.md)

::: zone pivot="programming-language-csharp"
[!INCLUDE [Send SMS with .Net SDK](./includes/send-sms-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Send SMS with JavaScript SDK](./includes/send-sms-js.md)]
::: zone-end
