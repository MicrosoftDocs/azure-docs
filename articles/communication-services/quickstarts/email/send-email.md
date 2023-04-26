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
zone_pivot_groups: acs-azcli-js-csharp-java-python-logic-apps
---

# Quickstart: How to send an email using Azure Communication Service

In this quick start, you'll learn about how to send email using our Email SDKs.

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

::: zone pivot="programming-language-power-platform"
[!INCLUDE [Azure Logic Apps](./includes/send-email-logic-app.md)]
::: zone-end

## Troubleshooting

To troubleshoot issues related to email delivery, you can get the status of the email delivery to capture delivery details.

## Clean up Azure Communication Service resources

To clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other associated resources. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

In this quickstart, you learned how to send emails using Azure Communication Services. You might also want to:

 - Learn about [Email concepts](../../concepts/email/email-overview.md).
 - Familiarize yourself with [email client library](../../concepts/email/sdk-features.md).
 - Learn more about [how to send a chat message](../chat/logic-app.md) from Power Automate using Azure Communication Services.
 - Learn more about access tokens check in [Create and Manage Azure Communication Services users and access tokens](../chat/logic-app.md).
