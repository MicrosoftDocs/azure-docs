---
title: Quickstart - How to send an email using Azure Communication Service
titleSuffix: An Azure Communication Services Quickstart
description: Learn how to send an email message using Azure Communication Services.
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 04/15/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: private_preview, event-tier1-build-2022
zone_pivot_groups: acs-azcli-js-csharp-java-python-power-platform
---

# Quickstart: How to send an email using Azure Communication Service

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

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
[!INCLUDE [Power Platform](./includes/send-email-logic-app.md)]
::: zone-end

## Troubleshooting

To troubleshoot issues related to email delivery, you can get status of the email delivery to capture delivery details.

## Clean up Azure Communication Service resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

In this quick start, you learned how to send emails using Azure Communication Services.

You may also want to:

 - Learn about [Email concepts](../../concepts/email/email-overview.md)
 - Familiarize yourself with [email client library](../../concepts/email/sdk-features.md)
 - Learn more about [how to send a chat message](../chat/logic-app.md) from Power Automate using Azure Communication Services.
 - Learn more about access tokens check [Create and Manage Azure Communication Services users and access tokens](../chat/logic-app.md).