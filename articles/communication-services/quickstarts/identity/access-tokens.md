---
title: Create and manage access tokens
titleSuffix: An Azure Communication Services guide
description: Manage identities and access tokens using the Azure Communication Services Identity SDK.
author: soricos85
manager: dariagrigoriu
services: azure-communication-services
ms.author: dariac
ms.date: 11/17/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: identity
zone_pivot_groups: acs-azcli-js-csharp-java-python-portal-nocode
ms.custom: mode-other, devx-track-azurecli, devx-track-extended-java, devx-track-js, devx-track-python
---

# Create and manage access tokens

Access tokens enable Azure Communication Services SDKs to [authenticate](../../concepts/authentication.md) directly against Azure Communication Services as a particular identity. You need to create access tokens if you want your users to join a call or chat thread within your application. 

This article describes how to use the Azure Communication Services SDKs to create identities and manage your access tokens. For production use cases, we recommend that you generate access tokens on a server-side service as described in [Mobile architecture design](../../concepts/client-and-server-architecture.md).

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
[!INCLUDE [Azure Portal](./includes/access-tokens/access-token-az-portal.md)]
::: zone-end

::: zone pivot="platform-nocode"
[!INCLUDE [Power Platform](./includes/access-tokens/access-token-no-code.md)]
::: zone-end

## Use identity for monitoring and metrics

The user ID acts as a primary key for logs and metrics collected through Azure Monitor. To view all of a user's calls, for example, you can set up your authentication to map a specific Azure Communication Services identity (or identities) to a single user.

For more information, see:
- [Authentication concepts](../../concepts/authentication.md)
- [Call diagnostics through log analytics](../../concepts/analytics/log-analytics.md)
- [Metrics](../../concepts/metrics.md).

## Clean up resources

To clean up and remove a Communication Services subscription, delete the resource or resource group. Deleting a resource group also deletes any other resources associated with it. For more information, see [Create and manage Communication Services resources > Clean up resources](../create-communication-resource.md#clean-up-resources).

To clean up your logic app workflow and related resources, see [Create an example Consumption logic app workflow using the Azure portal > Clean up resources](../../../logic-apps/quickstart-create-example-consumption-workflow.md#clean-up-resources).

## Next steps

This article described how to create a user and delete a user. It also describes how to issue an access token to a user and remove a user access token using the Azure Communication Services Identity connector. For more information, see [Azure Communication Services Identity Connector](/connectors/acsidentity/).

To see how tokens are use by other connectors, check out [how to send a chat message](../chat/logic-app.md) from Power Automate using Azure Communication Services.

To learn more about how to send an email using the Azure Communication Services Email connector check [Send email message in Power Automate with Azure Communication Services](../email/logic-app.md).

## Related articles

 - [Learn about authentication](../../concepts/authentication.md)
 - [Add chat to your app](../chat/get-started.md)
 - [Learn about client and server architecture](../../concepts/client-and-server-architecture.md)
 - [Deploy trusted authentication service hero sample](../../samples/trusted-auth-sample.md)
