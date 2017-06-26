---
  title: Azure Service Bus management libraries| Microsoft Docs
  description: Manage Service Bus namespaces and messaging entities from .NET
  services: service-bus-messaging
  cloud: na
  documentationcenter: na
  author: jtaubensee
  manager: timlt

  ms.assetid:
  ms.service: service-bus-messaging
  ms.workload: na
  ms.tgt_pltfrm: na
  ms.devlang: dotnet
  ms.topic: article
  ms.date: 04/03/2017
  ms.author: jotaub;sethm

---

# Service Bus management libraries

The Service Bus management libraries can dynamically provision Service Bus namespaces and entities. This allows for complex deployments and messaging scenarios, enabling you to programmatically determine what entities to provision. These libraries are currently available for .NET.

## Supported functionality

* Namespace creation, update, deletion
* Queue creation, update, deletion
* Topic creation, update, deletion
* Subscription creation, update, deletion

## Prerequisites

To get started using the Service Bus management libraries, you must authenticate with Azure Active Directory (AAD). AAD requires that you authenticate as a service principal which provides access to your Azure resources. For information about creating a service principal, see one of these articles:  

* [Use the Azure portal to create Active Directory application and service principal that can access resources](/azure/azure-resource-manager/resource-group-create-service-principal-portal)
* [Use Azure PowerShell to create a service principal to access resources](/azure/azure-resource-manager/resource-group-authenticate-service-principal)
* [Use Azure CLI to create a service principal to access resources](/azure/azure-resource-manager/resource-group-authenticate-service-principal-cli)

These tutorials provide you with an `AppId` (Client ID), `TenantId`, and `ClientSecret` (authentication key), all of which are used for authentication by the management libraries. You must have 'Owner' permissions for the resource group on which you wish to run.

## Programming pattern

The pattern to manipulate any Service Bus resource follows a common protocol:

1. Obtain a token from Azure Active Directory using the **Microsoft.IdentityModel.Clients.ActiveDirectory** library.
    ```csharp
    var context = new AuthenticationContext($"https://login.windows.net/{tenantId}");

    var result = await context.AcquireTokenAsync(
        "https://management.core.windows.net/",
        new ClientCredential(clientId, clientSecret)
    );
    ```

1. Create the `ServiceBusManagementClient` object.
    ```csharp
    var creds = new TokenCredentials(token);
    var sbClient = new ServiceBusManagementClient(creds)
    {
        SubscriptionId = SettingsCache["SubscriptionId"]
    };
    ```

1. Set the `CreateOrUpdate` parameters to your specified values.
    ```csharp
    var queueParams = new QueueCreateOrUpdateParameters()
    {
        Location = SettingsCache["DataCenterLocation"],
        EnablePartitioning = true
    };
    ```

1. Execute the call.
    ```csharp
    await sbClient.Queues.CreateOrUpdateAsync(resourceGroupName, namespaceName, QueueName, queueParams);
    ```

## Next steps
* [.NET Management sample](https://github.com/Azure-Samples/service-bus-dotnet-management/)
* [Microsoft.Azure.Management.ServiceBus Reference](/dotnet/api/Microsoft.Azure.Management.ServiceBus)
