---
title: Quickstart - How to send an email using Azure Communication Service
titleSuffix: An Azure Communication Services Quickstart
description: Learn how to send an email message using Azure Communication Services.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 04/10/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-azcli-js-csharp-java-python-portal-nocode
---

# Quickstart: How to send an email using Azure Communication Service

In this quick start, you'll learn about how to send email using our Email SDKs.

::: zone pivot="platform-azportal"
[!INCLUDE [Send email using Try Email in Azure Portal ](./includes/try-send-email.md)]
::: zone-end

::: zone pivot="platform-azcli"
[!INCLUDE [Send email with Azure CLI](./includes/send-email-az-cli.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Send email with .NET SDK](./includes/send-email-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Send Email with JavaScript SDK](./includes/send-email-js.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Send email with Java SDK](./includes/send-email-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Send Email with Python SDK](./includes/send-email-python.md)]
::: zone-end

::: zone pivot="platform-nocode"
[!INCLUDE [Azure Logic Apps](./includes/send-email-logic-app.md)]
::: zone-end

## Troubleshooting

### Email Delivery

To troubleshoot issues related to email delivery, you can [get status of the email delivery](./handle-email-events.md) to capture delivery details.

> [!IMPORTANT]
> The success result returned by polling for the status of the send operation only validates the fact that the email has successfully been sent out for delivery. To get additional information about the status of the delivery on the recipient end, you will need to reference [how to handle email events](./handle-email-events.md).

### Email Throttling

If you see that your application is hanging it could be due to email sending being throttled. You can [handle this through logging or by implementing a custom policy](./send-email-advanced/throw-exception-when-tier-limit-reached.md).

> [!NOTE]
> This sandbox setup is to help developers start building the application. You can gradually request to increase the sending volume once the application is ready to go live. Submit a support request to raise your desired sending limit if you require sending a volume of messages exceeding the rate limits.

## Clean up Azure Communication Service resources

To clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other associated resources. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

In this quickstart, you learned how to send emails using Azure Communication Services. You might also want to:

 - Learn about [Email concepts](../../concepts/email/email-overview.md).
 - Familiarize yourself with [email client library](../../concepts/email/sdk-features.md).
 - Learn more about [how to send a chat message](../chat/logic-app.md) from Power Automate using Azure Communication Services.
 - Learn more about access tokens check in [Create and Manage Azure Communication Services users and access tokens](../chat/logic-app.md).
