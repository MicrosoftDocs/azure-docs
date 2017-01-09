---
  title: Azure Event Hubs Management Libraries | Microsoft Docs
  description: Manage Event Hubs namespaces and entities from .NET
  services: event-hubs
  cloud: na
  documentationcenter: na
  author: jtaubensee
  manager: sethm

  ms.assetid:
  ms.service: event-hubs
  ms.workload: na
  ms.tgt_pltfrm: na
  ms.devlang: dotnet
  ms.topic: article
  ms.date: 1/6/2016
  ms.author: jotaub

---

# Event Hubs management libraries

The Event Hubs management libraries provide functionality to dynamically provision Event Hubs namespaces and entities. This allows for complex deployments and messaging scenarios, allowing users to programmatically determine what entities to provision. These libraries are currently available for .NET.

## Supported functionality

* Namespace creation, update, deletion
* Event Hub creation, update, deletion
* Consumer Group creation, update, deletion

## Prerequisites

In order to get started using the Event Hubs management libraries, you must authenticate with Azure Active Directory (AAD). AAD requires that you authenticate as a Service Principal which provides access to your Azure resources. For information on creating a Service Principal follow one of these articles:  

* [Use the Azure Portal to create Active Directory application and service principal that can access resources](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal)
* [Use Azure PowerShell to create a service principal to access resources](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal)
* [Use Azure CLI to create a service principal to access resources](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authenticate-service-principal-cli)

The previous tutorials will provide you with an `AppId` (Client ID), `TenantId`, and `ClientSecret` (Authentication Key), all of which will be used to authenticate by the management libraries. You must have 'Owner' permissions for the resource group that you wish to run on.

## Programming pattern

The pattern to manipulate any Event Hubs resource is similar and follows a common protocol:

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

1. Set the CreateOrUpdate parameters to your specified values.
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
* [Microsoft.Azure.Management.ServiceBus Reference](/dotnet/api/Microsoft.Azure.Management.EventHub) 
