---
title: Quickstart - Send email to multiple recipients using Azure Communication Service
titleSuffix: An Azure Communication Services Quickstart
description: Learn how to send email to multiple recipients using Azure Communication Services.
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
---

# Quickstart: Send email to multiple recipients

In this quick start, you'll learn about how to send email to multiple recipients using our Email SDKs.

::: zone pivot="programming-language-csharp"
[!INCLUDE [prepend-net](./includes/prepend-net.md)]
[!INCLUDE [multiple-recipients-net](./includes/multiple-recipients-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [prepend-js](./includes/prepend-js.md)]
[!INCLUDE [multiple-recipients-js](./includes/multiple-recipients-js.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [prepend-java](./includes/prepend-java.md)]
[!INCLUDE [multiple-recipients-java](./includes/multiple-recipients-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prepend-python](./includes/prepend-python.md)]
[!INCLUDE [multiple-recipients-python](./includes/multiple-recipients-python.md)]
::: zone-end

## Troubleshooting

To troubleshoot issues related to email delivery, you can [get status of the email delivery](../handle-email-events.md) to capture delivery details.

## Clean up Azure Communication Service resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../create-communication-resource.md#clean-up-resources).

## Next steps

In this quick start, you learned how to manually poll for status when sending email using Azure Communication Services.

You may also want to:

 - Learn how to [manually poll for email status](./manually-poll-for-email-status.md)
 - Learn more about [sending email with attachments](./send-email-with-attachments.md)
 - Familiarize yourself with [email client library](../../../concepts/email/sdk-features.md)
