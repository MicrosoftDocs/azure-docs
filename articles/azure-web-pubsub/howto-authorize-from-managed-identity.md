---
title: Authorize a managed identity request
description: This article provides information about authorizing requests to Azure Web PubSub resources with Managed identities for Azure resources.
author: terencefan
ms.author: lianwei
ms.date: 08/28/2026
ms.service: azure-web-pubsub
ms.topic: how-to
---

# Authorize requests to Azure Web PubSub resources with Managed identities for Azure resources

Azure Web PubSub Service supports Microsoft Entra ID for authorizing requests from [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).

This article explains how to set up your resource and code to authorize requests to the resource using a managed identity.

## Configure managed identities

The first step is to configure managed identities on your app or virtual machine.

- [Configure managed identities for App Service and Azure Functions](/azure/app-service/overview-managed-identity)
- [Configure managed identities on Azure virtual machines (VMs)](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities)
- [Configure managed identities for Azure resources on a virtual machine scale set](/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities-scale-sets)

## Add a role assignment in the Azure portal

[!INCLUDE [add role assignments](includes/web-pubsub-add-role-assignments.md)]

## Code samples with Microsoft Entra authorization

To create a `WebPubSubServiceClient` that uses Microsoft Entra authorization in .NET, Java, JavaScript, or Python, see [Use Azure Identity with `WebPubSubServiceClient`](howto-use-azure-identity.md).

## Related content

- [Overview of Microsoft Entra ID for Web PubSub](concept-azure-ad-authorization.md)
- [Authorize request to Web PubSub resources with Microsoft Entra ID from Azure applications](howto-authorize-from-application.md)
- [Disable local authentication](./howto-disable-local-auth.md)
