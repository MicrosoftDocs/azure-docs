---
title: Hydrating messageId using EmailClient
titleSuffix: An Azure Communication Services Quickstart
description: This article describes how to hydrate messageId using EmailClient with Azure Communication Services.
author: fanruisun
manager: koagbakp
services: azure-communication-services
ms.author: fanruisun
ms.date: 08/04/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: devx-track-dotnet, devx-track-extended-java
zone_pivot_groups: acs-csharp-java
---

# Hydrating messageId using EmailClient

This article describes how to hydrate messageId using EmailClient with our Email SDKs.

::: zone pivot="programming-language-csharp"
[!INCLUDE [prepend-net](./includes/prepend-net.md)]
[!INCLUDE [hydrate-message-id-net](./includes/hydrate-email-client-with-message-id-dotnet.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [prepend-java](./includes/prepend-java.md)]
[!INCLUDE [hydrate-message-id-java](./includes/hydrate-email-client-with-message-id-java.md)]
::: zone-end

### Email delivery

To troubleshoot issues related to email delivery, you can [get status of the email delivery](../handle-email-events.md) to capture delivery details.

> [!IMPORTANT]
> The success result returned by polling for the status of the send operation only validates that the email is sent out for delivery. For more information about the status of the delivery on the recipient end, see [how to handle email events](../handle-email-events.md).

### Email throttling

If your application is hanging, it could be due to email sending being throttled. You can [handle email throttling by logging or by implementing a custom policy](../send-email-advanced/throw-exception-when-tier-limit-reached.md).

> [!NOTE]
> This sandbox is intended to help developers start building the application. You can gradually request to increase the sending volume once the application is ready to go live. Submit a support request to raise your desired sending limit if you require sending a volume of messages exceeding the rate limits.

## Clean up Azure Communication Service resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../create-communication-resource.md#clean-up-resources).

## Next steps

 - Learn how to [send email to multiple recipients](./send-email-to-multiple-recipients.md)
 - Learn more about [sending email with attachments](./send-email-with-attachments.md)
 - Familiarize yourself with [email client library](../../../concepts/email/sdk-features.md)
