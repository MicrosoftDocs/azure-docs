---
title: Quickstart - Send email with inline attachments using Azure Communication Service
titleSuffix: An Azure Communication Services Quickstart
description: Learn how to send an email message with inline attachments using Azure Communication Services.
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python-azcli-ps
---

# Quickstart: Send email with inline attachments

In this quickstart, you'll learn about how to send email with inline attachments using our Email SDKs.

::: zone pivot="programming-language-azcli"
[!INCLUDE [inline-attachments-azcli](./includes/inline-attachments-azcli.md)]
::: zone-end

::: zone pivot="programming-language-powershell"
[!INCLUDE [inline-attachments-powershell](./includes/inline-attachments-powershell.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [prepend-net](./includes/prepend-net.md)]
[!INCLUDE [inline-attachments-net](./includes/inline-attachments-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [prepend-js](./includes/prepend-js.md)]
[!INCLUDE [inline-attachments-js](./includes/inline-attachments-js.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [prepend-java](./includes/prepend-java.md)]
[!INCLUDE [inline-attachments-java](./includes/inline-attachments-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [prepend-python](./includes/prepend-python.md)]
[!INCLUDE [inline-attachments-python](./includes/inline-attachments-python.md)]
::: zone-end

## Troubleshooting

### Email Delivery

To troubleshoot issues related to email delivery, you can [get status of the email delivery](../handle-email-events.md) to capture delivery details.

> [!IMPORTANT]
> The success result returned by polling for the status of the send operation only validates the fact that the email has successfully been sent out for delivery. To get additional information about the status of the delivery on the recipient end, you'll need to reference [how to handle email events](../handle-email-events.md).

### Email Throttling

If you see that your application is hanging it could be due to email sending being throttled. You can [handle this through logging or by implementing a custom policy](../send-email-advanced/throw-exception-when-tier-limit-reached.md).

> [!NOTE]
> This sandbox setup is to help developers start building the application. You can gradually request to increase the sending volume once the application is ready to go live. Submit a support request to raise your desired sending limit if you require sending a volume of messages exceeding the rate limits.

## Clean up Azure Communication Service resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../create-communication-resource.md#clean-up-resources).

## Next steps

In this quick start, you learned how to manually poll for status when sending email using Azure Communication Services.

You may also want to:

 - Learn how to [manually poll for email status](./manually-poll-for-email-status.md)
 - Learn more about [sending email to multiple recipients](./send-email-to-multiple-recipients.md)
 - Familiarize yourself with [email client library](../../../concepts/email/sdk-features.md)
