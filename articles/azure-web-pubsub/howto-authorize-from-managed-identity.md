---
title: Authorize a managed identity request
description: This article provides information about authorizing requests to Azure Web PubSub resources with Managed identities for Azure resources.
author: terencefan
ms.author: tefa
ms.date: 03/11/2025
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

Check out our samples that show how to use Microsoft Entra authorization in programming languages we officially support.

- [C#](./howto-create-serviceclient-with-net-and-azure-identity.md)
- [Python](./howto-create-serviceclient-with-python-and-azure-identity.md)
- [Java](./howto-create-serviceclient-with-java-and-azure-identity.md)
- [JavaScript](./howto-create-serviceclient-with-javascript-and-azure-identity.md)

## Related content

- [Overview of Microsoft Entra ID for Web PubSub](concept-azure-ad-authorization.md)
- [Authorize request to Web PubSub resources with Microsoft Entra ID from Azure applications](howto-authorize-from-application.md)
- [Disable local authentication](./howto-disable-local-auth.md)
