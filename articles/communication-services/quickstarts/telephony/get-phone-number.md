---
title: Quickstart - Get and manage phone numbers using Azure Communication Services
description: Learn how to manage phone numbers using Azure Communication Services
author: prakulka
manager: nmurav
services: azure-communication-services
ms.author: prakulka
ms.date: 06/30/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: pstn
ms.custom: references_regions, mode-other, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-azcli-azp-azpnew-java-net-python-csharp-js
---

# Quickstart: Get and manage phone numbers

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

[!INCLUDE [Bulk Acquisition Instructions](../../includes/phone-number-special-order.md)]

::: zone pivot="platform-azcli"
[!INCLUDE [Azure CLI](./includes/phone-numbers-az-cli.md)]
::: zone-end

::: zone pivot="platform-azp"
[!INCLUDE [Azure portal](./includes/phone-numbers-portal.md)]
::: zone-end

::: zone pivot="platform-azp-new"
[!INCLUDE [Azure portal (new)](./includes/phone-numbers-portal-new.md)]
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

- When a phone number is released, the phone number will not be released or able to be repurchased until the end of the billing cycle.

- When a Communication Services resource is deleted, the phone numbers associated with that resource will be automatically released at the same time.

## Next steps

In this quickstart you learned how to:

> [!div class="checklist"]
> * Purchase a phone number
> * Manage your phone number
> * Release a phone number
> * Submit toll-free verification application [(see if required)](../../concepts/sms/sms-faq.md#toll-free-verification)

> [!div class="nextstepaction"]
> [Send an SMS](../sms/send.md)
> 
> [!div class="nextstepaction"]
> [Toll-free verification](../../concepts/sms/sms-faq.md#toll-free-verification)
>
> [!div class="nextstepaction"]
> [Build workflow for outbound calls using the purchased phone numbers](../call-automation/quickstart-make-an-outbound-call.md)
>
> [!div class="nextstepaction"]
> [Get started with calling in applications](../voice-video-calling/getting-started-with-calling.md)
