---
title: Quickstart - Throw an exception when email sending tier limit is reached using Azure Communication Service
titleSuffix: An Azure Communication Services Quickstart
description: Learn how to throw an exception when sending tier limit is reached using Azure Communication Services.
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
---

# Quickstart: Throw an exception when email sending tier limit is reached

In this quick start, you'll learn about how to throw an exception when the email sending tier limit is reached using our Email SDKs.

::: zone pivot="programming-language-csharp"
[!INCLUDE [prepend-net](./includes/prepend-net.md)]
[!INCLUDE [tier-limit-net](./includes/tier-limit-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [prepend-js](./includes/prepend-js.md)]
[!INCLUDE [tier-limit-js](./includes/tier-limit-js.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [prepend-java](./includes/prepend-java.md)]
[!INCLUDE [tier-limit-java](./includes/tier-limit-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prepend-python](./includes/prepend-python.md)]
[!INCLUDE [tier-limit-python](./includes/tier-limit-python.md)]
::: zone-end

## Troubleshooting

To troubleshoot issues related to email delivery, you can [get status of the email delivery](../handle-email-events.md) to capture delivery details.

## Clean up Azure Communication Service resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../create-communication-resource.md#clean-up-resources).

## Next steps

In this quick start, you learned how to manually poll for status when sending email using Azure Communication Services.

You may also want to:

 - Learn how to [send email to multiple recipients](./send-email-to-multiple-recipients.md)
 - Learn more about [sending email with attachments](./send-email-with-attachments.md)
 - Familiarize yourself with [email client library](../../../concepts/email/sdk-features.md)
