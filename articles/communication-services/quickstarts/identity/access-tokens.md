---
title: Quickstart - Create and manage access tokens
titleSuffix: An Azure Communication Services quickstart
description: Learn how to manage identities and access tokens by using the Azure Communication Services Identity SDK.
author: tomaschladek
manager: nmurav
services: azure-communication-services
ms.author: tchladek
ms.date: 11/17/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: identity
zone_pivot_groups: acs-azcli-js-csharp-java-python-portal-nocode
ms.custom: mode-other, devx-track-azurecli, devx-track-extended-java, devx-track-js, devx-track-python
---

# Quickstart: Create and manage access tokens

Access tokens let Azure Communication Services SDKs [authenticate](../../concepts/authentication.md) directly against Azure Communication Services as a particular identity. You'll need to create access tokens if you want your users to join a call or chat thread within your application. 

In this quickstart, you'll learn how to use the Azure Communication Services SDKs to create identities and manage your access tokens. For production use cases, we recommend that you generate access tokens on a [server-side service](../../concepts/client-and-server-architecture.md).

::: zone pivot="platform-azcli"
[!INCLUDE [Azure CLI](./includes/access-tokens/access-token-az-cli.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [.NET](./includes/access-tokens/access-token-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript](./includes/access-tokens/access-token-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python](./includes/access-tokens/access-token-python.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java](./includes/access-tokens/access-token-java.md)]
::: zone-end

::: zone pivot="platform-azportal"
[!INCLUDE [AzPortal](./includes/access-tokens/access-token-az-portal.md)]
::: zone-end

::: zone pivot="platform-nocode"
[!INCLUDE [No Code](./includes/access-tokens/access-token-no-code.md)]
::: zone-end

## Use identity for monitoring and metrics

The user ID is intended to act as a primary key for logs and metrics that are collected through Azure Monitor. To view all of a user's calls, for example, you can set up your authentication in a way that maps a specific Azure Communication Services identity (or identities) to a single user. 

Learn more about [authentication concepts](../../concepts/authentication.md), call diagnostics through [log analytics](../../concepts/analytics/log-analytics.md), and [metrics](../../concepts/metrics.md) that are available to you.

## Clean up resources

To clean up and remove a Communication Services subscription, delete the resource or resource group. Deleting a resource group also deletes any other resources that are associated with it. For more information, see the "Clean up resources" section of [Create and manage Communication Services resources](../create-communication-resource.md#clean-up-resources).

::: zone pivot="platform-nocode"
To clean up your logic app workflow and related resources, review [how to clean up Azure Logic Apps resources](../../../logic-apps/quickstart-create-example-consumption-workflow.md#clean-up-resources).
::: zone-end

::: zone pivot="platform-azportal,programming-language-java,programming-language-python,programming-language-javascript,programming-language-csharp,platform-azcli"

## Next steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> * Issue access tokens
> * Manage identities

> [!div class="nextstepaction"]
> [Add voice calling to your app](../voice-video-calling/getting-started-with-calling.md)

You might also want to:

 - [Learn about authentication](../../concepts/authentication.md)
 - [Add chat to your app](../chat/get-started.md)
 - [Learn about client and server architecture](../../concepts/client-and-server-architecture.md)
 - [Deploy trusted authentication service hero sample](../../samples/trusted-auth-sample.md)

::: zone-end

::: zone pivot="platform-nocode"
## Next steps

In this quickstart, you learned how to create a user, delete a user, issue a user an access token and remove user access token using the Azure Communication Services Identity connector. To learn more check the [Azure Communication Services Identity Connector](/connectors/acsidentity/) documentation.

To see how tokens are use by other connectors, check out [how to send a chat message](../chat/logic-app.md) from Power Automate using Azure Communication Services.

To learn more about how to send an email using the Azure Communication Services Email connector check [Send email message in Power Automate with Azure Communication Services](../email/logic-app.md).
::: zone-end
