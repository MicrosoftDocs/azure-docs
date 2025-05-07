---
title: Managed identities for Azure resources with Service Bus
description: This article describes how to use managed identities to access with Azure Service Bus entities (queues, topics, and subscriptions).
ms.topic: article
ms.date: 02/11/2025
---

# Authenticate a managed identity with Microsoft Entra ID to access Azure Service Bus resources
Managed identities for Azure resources provide Azure services with an automatically managed identity in Microsoft Entra ID. You can use this identity to authenticate to any service such as Azure Service Bus that supports Microsoft Entra authentication, without having credentials in your code. If you aren't familiar with managed identities, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) before proceeding to read through this article.

Here are the high-level steps to use a managed identity to access a Service Bus entity: 

1. Enable managed identity for your client app or environment. For example, enable managed identity for your Azure App Service app, Azure Functions app, or a virtual machine in which your app is running. Here are the articles that help you with this step:
    - [Configure managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md)
    - [Configure managed identities for Azure resources on a virtual machine (VM)](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)    
1. Assign Azure Service Bus Data Owner, Azure Service Bus Data Sender, or Azure Service Bus Data Receiver role to the managed identity at the appropriate scope (Azure subscription, resource group, Service Bus namespace, or Service Bus queue or topic). For instructions to assign a role to a managed identity, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).
1. In your application, use the managed identity and the endpoint to Service Bus namespace to connect to the namespace. 

    For example, in .NET, you use the [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient.-ctor#azure-messaging-servicebus-servicebusclient-ctor(system-string-azure-core-tokencredential)) constructor that takes `TokenCredential` and `fullyQualifiedNamespace` (a string, for example: `cotosons.servicebus.windows.net`) parameters to connect to Service Bus using the managed identity. You pass in [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), which derives from `TokenCredential` and uses the managed identity. In `DefaultAzureCredentialOptions`, set the `ManagedIdentityClientId` to the ID of client's managed identity.

    ```csharp
    string fullyQualifiedNamespace = "<your namespace>.servicebus.windows.net>";
    string userAssignedClientId = "<your managed identity client ID>";

    var credential = new DefaultAzureCredential(
        new DefaultAzureCredentialOptions
        {
            ManagedIdentityClientId = userAssignedClientId
        });

    var sbusClient = new ServiceBusClient(fullyQualifiedNamespace, credential);
    ```    

    > [!IMPORTANT]
    > You can disable local or SAS key authentication for a Service Bus namespace and allow only Microsoft Entra authentication. For step-by-step instructions, see [Disable local authentication](disable-local-authentication.md).
    
## Azure built-in roles for Azure Service Bus
Microsoft Entra authorizes access to secured resources through [Azure role-based access control (RBAC)](../role-based-access-control/overview.md). Azure Service Bus defines a set of Azure built-in roles that encompass common sets of permissions used to access Service Bus entities. You can also define custom roles for accessing the data. 

Azure provides the following Azure built-in roles for authorizing access to a Service Bus namespace:

- [Azure Service Bus Data Owner](../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner): Use this role to allow full access to Service Bus namespace and its entities (queues, topics, subscriptions, and filters)
- [Azure Service Bus Data Sender](../role-based-access-control/built-in-roles.md#azure-service-bus-data-sender): Use this role to allow sending messages to Service Bus queues and topics.
- [Azure Service Bus Data Receiver](../role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver): Use this role to allow receiving messages from Service Bus queues and subscriptions. 

To assign a role to a managed identity in the Azure portal, use the **Access control (IAM)** page. Navigate to this page by selecting **Access control (IAM)** on the **Service Bus Namespace** page or **Service Bus queue** page, or **Service Bus topic** page. For step-by-step instructions for assigning a role, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml). 

## Resource scope 
Before you assign an Azure role to a managed identity, determine the scope of access that the managed identity should have. Best practices dictate that it's always best to grant only the narrowest possible scope.

The following list describes the levels at which you can scope access to Service Bus resources, starting with the narrowest scope:

- **Queue**, **topic**, or **subscription**: Role assignment applies to the specific Service Bus entity. 
- **Service Bus namespace**: Role assignment spans the entire topology of Service Bus under the namespace.
- **Resource group**: Role assignment applies to all the Service Bus resources under the resource group.
- **Subscription**: Role assignment applies to all the Service Bus resources in all of the resource groups in the subscription.

    > [!NOTE]
    > Keep in mind that Azure role assignments may take up to five minutes to propagate. 

Currently, the Azure portal doesn't support assigning users, groups, or managed identities to Service Bus Azure roles at the topic's subscription level. Here's an example of using the Azure CLI command: [az-role-assignment-create](/cli/azure/role/assignment?#az-role-assignment-create) to assign an identity to a Service Bus Azure role: 

```azurecli
az role assignment create \
    --role $service_bus_role \
    --assignee $assignee_id \
    --scope /subscriptions/$subscription_id/resourceGroups/$resource_group/providers/Microsoft.ServiceBus/namespaces/$service_bus_namespace/topics/$service_bus_topic/subscriptions/$service_bus_subscription
```

For more information about how built-in roles are defined, see [Understand role definitions](../role-based-access-control/role-definitions.md#control-and-data-actions). For information about creating Azure custom roles, see [Azure custom roles](../role-based-access-control/custom-roles.md).

> [!NOTE]
> If the source service or app doesn't restart after the access to a Service Bus entity is disabled by removing the source's managed identity from the Service Bus RBAC role, the source app may continue to send/receive messages to/from the Service Bus entity until the token expires (default token validity is 24 hours). This behavior is by design. 
>
> Therefore, after you remove the source's managed identity from the RBAC role, restart the source app or service to immediately expire the token and prevent it from sending messages to or receiving messages from the Service Bus entity. 

## Using SDKs

In .NET, the [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object is initialized by using a constructor that takes a fully qualified namespace and a `TokenCredential`. The `DefaultAzureCredential` derives from `TokenCredential`, which automatically uses the managed identity configured for the app. The flow of the managed identity context to Service Bus and the authorization handshake are automatically handled by the token credential. It's a simpler model than using SAS.

```csharp
var client = new ServiceBusClient('cotosons.servicebus.windows.net', new DefaultAzureCredential());
```

You send and receive messages as usual using [ServiceBusSender](/dotnet/api/azure.messaging.servicebus.servicebussender) and [ServiceBusReceiver](/dotnet/api/azure.messaging.servicebus.servicebusreceiver) or [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor). 

For complete step-by-step instructions to send and receive messages using a managed identity, see the following quickstarts. These quickstarts have the code to use a service principal to send and receive messages, but the code is the same for using a managed identity.  

- [.NET](service-bus-dotnet-get-started-with-queues.md).
- [Java](service-bus-java-how-to-use-queues.md).
- [JavaScript](service-bus-nodejs-how-to-use-queues.md)
- [Python](service-bus-python-how-to-use-queues.md)

> [!NOTE]
> The managed identity works only inside the Azure environment, on App services, Azure VMs, and scale sets. For .NET applications, the Microsoft.Azure.Services.AppAuthentication library, which is used by the Service Bus NuGet package, provides an abstraction over this protocol and supports a local development experience. This library also allows you to test your code locally on your development machine, using your user account from Visual Studio, Azure CLI 2.0, or Active Directory Integrated Authentication. For more on local development options with this library, see [Service-to-service authentication to Azure Key Vault using .NET](/dotnet/api/overview/azure/service-to-service-authentication).  


## Next steps
See [this .NET web application sample on GitHub](https://github.com/Azure-Samples/app-service-msi-servicebus-dotnet/tree/master), which uses a managed identity to connect to Service Bus to send and receive messages. Add the identity of the app service to the **Azure Service Bus Data Owner** role. 
