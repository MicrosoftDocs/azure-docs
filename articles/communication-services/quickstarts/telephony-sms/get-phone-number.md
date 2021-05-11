---
title: Quickstart - Manage Phone Numbers using Azure Communication Services
description: Learn how to manage phone numbers using Azure Communication Services
author: prakulka
manager: nmurav
services: azure-communication-services

ms.author: prakulka
ms.date: 03/10/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: references_regions
zone_pivot_groups: acs-azp-java-net-python-csharp-js
---
# Quickstart: Manage Phone Numbers

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

[!INCLUDE [Bulk Acquisition Instructions](../../includes/phone-number-special-order.md)]

::: zone pivot="platform-azp"
[!INCLUDE [Azure portal](./includes/phone-numbers-portal.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Azure portal](./includes/phone-numbers-net.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java](./includes/phone-numbers-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python](./includes/phone-numbers-python.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript](./includes/phone-numbers-js.md)]
::: zone-end

## Troubleshooting

Common Questions and Issues:

- Purchasing phone is supported in the US only. To purchase phone numbers, ensure that:
  - The associated Azure subscription billing address is located in the United States. You cannot move a resource to another subscription at this time.
  - Your Communication Services resource is provisioned in the United States data location. You cannot move a resource to another data location at this time.

- When a phone number is released, the phone number will not be released or able to be repurchased until the end of the billing cycle.

- When a Communication Services resource is deleted, the phone numbers associated with that resource will be automatically released at the same time.

## Next steps

In this quickstart you learned how to:

> [!div class="checklist"]
> * Purchase a phone number
> * Manage your phone number
> * Release a phone number

> [!div class="nextstepaction"]
> [Send an SMS](../telephony-sms/send.md)
> [Get started with calling](../voice-video-calling/getting-started-with-calling.md)
