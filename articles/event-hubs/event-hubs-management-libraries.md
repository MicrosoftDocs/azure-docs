---
title: Azure Event Hubs management libraries | Microsoft Docs
description: Manage Event Hubs namespaces and entities from .NET
services: event-hubs
cloud: na
documentationcenter: na
author: sethmanheim
manager: timlt

ms.assetid:
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 4/10/2017
ms.author: sethm

---

# Event Hubs management libraries

The Event Hubs management libraries can dynamically provision Event Hubs namespaces and entities. This enables complex deployments and messaging scenarios, so that you can programmatically determine what entities to provision. These libraries are currently available for .NET.

## Supported functionality

* Namespace creation, update, deletion
* Event Hubs creation, update, deletion
* Consumer Group creation, update, deletion

## Prerequisites

To get started using the Event Hubs management libraries, you must authenticate with Azure Active Directory (AAD). AAD requires that you authenticate as a service principal, which provides access to your Azure resources. For information about creating a service principal, see one of these articles:  

* [Use the Azure portal to create Active Directory application and service principal that can access resources](../azure-resource-manager/resource-group-create-service-principal-portal.md)
* [Use Azure PowerShell to create a service principal to access resources](../azure-resource-manager/resource-group-authenticate-service-principal.md)
* [Use Azure CLI to create a service principal to access resources](../azure-resource-manager/resource-group-authenticate-service-principal-cli.md)

These tutorials will provide you with an `AppId` (Client ID), `TenantId`, and `ClientSecret` (Authentication Key), all of which are used for authentication by the management libraries. You must have 'Owner' permissions for the resource group on which you wish to run.

## Programming pattern

The pattern to manipulate any Event Hubs resource follows a common protocol:

1. Obtain a token from Azure Active Directory using the `Microsoft.IdentityModel.Clients.ActiveDirectory` library.
    ```csharp
    var context = new AuthenticationContext($"https://login.windows.net/{tenantId}");

    var result = await context.AcquireTokenAsync(
        "https://management.core.windows.net/",
        new ClientCredential(clientId, clientSecret)
    );
    ```

1. Create the `EventHubManagementClient` object.
    ```csharp
    var creds = new TokenCredentials(token);
    var ehClient = new EventHubManagementClient(creds)
    {
        SubscriptionId = SettingsCache["SubscriptionId"]
    };
    ```

1. Set the `CreateOrUpdate` parameters to your specified values.
    ```csharp
    var ehParams = new EventHubCreateOrUpdateParameters()
    {
        Location = SettingsCache["DataCenterLocation"]
    };
    ```

1. Execute the call.
    ```csharp
    await ehClient.EventHubs.CreateOrUpdateAsync(resourceGroupName, namespaceName, EventHubName, ehParams);
    ```

## Next steps
* [.NET Management sample](https://github.com/Azure-Samples/event-hubs-dotnet-management/)
* [Microsoft.Azure.Management.EventHub Reference](/dotnet/api/Microsoft.Azure.Management.EventHub) 
