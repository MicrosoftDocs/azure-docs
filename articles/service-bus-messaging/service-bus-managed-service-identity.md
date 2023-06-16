---
title: Managed identities for Azure resources with Service Bus
description: This article describes how to use managed identities to access with Azure Service Bus entities (queues, topics, and subscriptions).
ms.topic: article
ms.date: 06/15/2023
ms.custom: subject-rbac-steps, devx-track-azurecli
---

# Authenticate a managed identity with Azure Active Directory to access Azure Service Bus resources
[Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) is a cross-Azure feature that enables you to create a secure identity associated with the deployment under which your application code runs. You can then associate that identity with access-control roles that grant custom permissions for accessing specific Azure resources that your application needs. 

Here are the high-level steps to use a managed identity to access a Service Bus entity: 

1. Enable managed identity for your client app or environment. For example, enable managed identity for your Azure App Service app, Azure Functions app, or a virtual machine in which your app is running. 
1. Add the managed identity to Azure Service Bus Data Owner, Azure Service Bus Data Sender, or Azure Service Bus Data Receiver role at the appropriate scope (Azure subscription, resource group, Service Bus namespace, or Service Bus queue or topic).
1. Use the managed identity and the endpoint to Service Bus entity to connect to Service Bus namespace from your app's code. 

    > [!NOTE]
    > - When you use managed identities, you don't need to store and protect access keys in your application code or configuration. The client app doesn't need to handle SAS rules and keys, or any other access tokens. The client app only needs the **endpoint address** of the Service Bus namespace. When the app connects, Service Bus binds the managed entity's context to the client in an operation that is shown in an example later in this article. Once it is associated with a managed identity, your Service Bus client can do all authorized operations. Authorization is granted by associating a managed entity with Service Bus roles. 
    > - For a list of services that support managed identities, see [Services that support managed identities for Azure resources](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md).

    > [!IMPORTANT]
    > You can disable local or SAS key authentication for a Service Bus namespace and allow only Azure Active Directory authentication. For step-by-step instructions, see [Disable local authentication](disable-local-authentication.md).
    
## Azure built-in roles for Azure Service Bus
Azure Active Directory (Azure AD) authorizes access to secured resources through [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md). Azure Service Bus defines a set of Azure built-in roles that encompass common sets of permissions used to access Service Bus entities. You can also define custom roles for accessing the data. 

Azure provides the following Azure built-in roles for authorizing access to a Service Bus namespace:

- [Azure Service Bus Data Owner](../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner): Use this role to allow full access to Service Bus namespace and its entities (queues, topics, subscriptions, and filters)
- [Azure Service Bus Data Sender](../role-based-access-control/built-in-roles.md#azure-service-bus-data-sender): Use this role to allow sending messages to Service Bus queues and topics.
- [Azure Service Bus Data Receiver](../role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver): Use this role to allow receiving messages from Service Bus queues and subscriptions. 

To assign a role to a managed identity, use the **Access control (IAM)** page. Navigate to this page by selecting **Access control (IAM)** on the **Service Bus Namespace** page for your namespace. For step-by-step instructions for assigning a role, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md). 

## Resource scope 
Before you assign an Azure role to a managed identity, determine the scope of access that the managed identity should have. Best practices dictate that it's always best to grant only the narrowest possible scope.

The following list describes the levels at which you can scope access to Service Bus resources, starting with the narrowest scope:

- **Queue**, **topic**, or **subscription**: Role assignment applies to the specific Service Bus entity. 
- **Service Bus namespace**: Role assignment spans the entire topology of Service Bus under the namespace and to the consumer group associated with it.
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

### Sample
See the following sample on GitHub: [Use Service Bus from App Service with Managed Service Identity](https://github.com/Azure-Samples/app-service-msi-servicebus-dotnet/tree/master).

The Default.aspx page is your landing page. The code can be found in the Default.aspx.cs file. The result is a minimal web application with a few entry fields, and with **send** and **receive** buttons that connect to Service Bus to either send or receive messages.

The [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object is initialized by using a constructor that takes a fully qualified namespace and a `TokenCredential`. The `DefaultAzureCredential` derives from `TokenCredential`, which automatically uses the managed identity configured for the app. The flow of the managed identity context to Service Bus and the authorization handshake are automatically handled by the token credential. It's a simpler model than using SAS.

After you make these changes, publish and run the application. You can obtain the correct publishing data easily by downloading and then importing a publishing profile in Visual Studio:

![Get publish profile](./media/service-bus-managed-service-identity/msi3.png)
 
To send or receive messages, enter the name of the namespace and the name of the entity you created. Then, select either **send** or **receive**.

> [!NOTE]
> The managed identity works only inside the Azure environment, on App services, Azure VMs, and scale sets. For .NET applications, the Microsoft.Azure.Services.AppAuthentication library, which is used by the Service Bus NuGet package, provides an abstraction over this protocol and supports a local development experience. This library also allows you to test your code locally on your development machine, using your user account from Visual Studio, Azure CLI 2.0 or Active Directory Integrated Authentication. For more on local development options with this library, see [Service-to-service authentication to Azure Key Vault using .NET](/dotnet/api/overview/azure/service-to-service-authentication).  

## Next steps

To learn more about Service Bus messaging, see the following topics:

* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)
