---
title: Use the email object model to send the email payload using Azure Communication Service
titleSuffix: An Azure Communication Services Quickstart
description: Learn how to use the email object model to send the email payload using Azure Communication Services.
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: devx-track-dotnet
---

# Use the email object model to send the email payload

This article describes how to use the email object model to send the email payload using our Email SDKs.

[!INCLUDE [prepend-net](./includes/prepend-net.md)]
[!INCLUDE [email-object-model-net](./includes/email-object-model-net.md)]

## Troubleshooting

### Email Delivery

To troubleshoot issues related to email delivery, you can [get status of the email delivery](../handle-email-events.md) to capture delivery details.

> [!IMPORTANT]
> The success result returned by polling for the status of the send operation only validates that the email is sent out for delivery. For more information about the status of the delivery on the recipient end, see [how to handle email events](../handle-email-events.md).

### Email Throttling

If your application is hanging, it could be due to email sending being throttled. You can [handle email throttling by logging or by implementing a custom policy](../send-email-advanced/throw-exception-when-tier-limit-reached.md).

> [!NOTE]
> This sandbox is intended to help developers start building the application. You can gradually request to increase the sending volume once the application is ready to go live. Submit a support request to raise your desired sending limit if you need to send more messages than the rate limits.

## Clean up Azure Communication Service resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../create-communication-resource.md#clean-up-resources).

## Next steps

 - Learn how to [send email to multiple recipients](./send-email-to-multiple-recipients.md)
 - Learn more about [sending email with attachments](./send-email-with-attachments.md)
 - Familiarize yourself with [email client library](../../../concepts/email/sdk-features.md)
