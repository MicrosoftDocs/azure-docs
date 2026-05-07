---
title: Use Managed Identities to access Azure Service Bus
description: Learn how to authenticate and access Azure Service Bus queues, topics, and subscriptions by using managed identities for Azure resources.
ms.topic: how-to
ms.date: 05/02/2026
ms.custom: subject-msia
#customer intent: As a developer, I want to use managed identities to authenticate my application to Azure Service Bus so that I can avoid storing credentials in my code.

---

# Use managed identities to access Azure Service Bus resources

Managed identities for Azure resources let your application authenticate to Azure Service Bus without storing credentials in your code. Azure automatically handles the identity and its credentials for you.

Storing credentials in code creates security risks and maintenance overhead. Managed identities eliminate these concerns by providing automatic credential management through Microsoft Entra ID.

This article shows you how to configure managed identity authentication for Service Bus so your application can securely send and receive messages without hardcoded credentials.

## Prerequisites

To use managed identities with Azure Service Bus, you need:

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/) before you begin.

- An Azure Service Bus namespace. To create one, see [Create a Service Bus namespace](service-bus-create-namespace-portal.md).

- A managed identity enabled on your Azure compute resource. See:
  - [Configure managed identities for App Service and Azure Functions](../app-service/overview-managed-identity.md)
  - [Configure managed identities for Azure resources on virtual machines](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)

You can disable local or shared access signature (SAS) key authentication for a Service Bus namespace and allow only Microsoft Entra authentication. For step-by-step instructions, see [Disable local authentication](disable-local-authentication.md).

## Assign a Service Bus role to the managed identity

Microsoft Entra authorizes access to secured resources through [Azure role-based access control (RBAC)](../role-based-access-control/overview.md). Azure Service Bus provides Azure built-in roles that encompass common sets of permissions for accessing Service Bus entities. You can also define custom roles.

The following table lists the Azure built-in roles for authorizing access to a Service Bus namespace:

| Role | Description |
| ---- | ----------- |
| [Azure Service Bus Data Owner](../role-based-access-control/built-in-roles.md#azure-service-bus-data-owner) | Full access to Service Bus namespace and its entities (queues, topics, subscriptions, and filters) |
| [Azure Service Bus Data Sender](../role-based-access-control/built-in-roles.md#azure-service-bus-data-sender) | Ability to send messages to Service Bus queues and topics |
| [Azure Service Bus Data Receiver](../role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver) | Ability to receive messages from Service Bus queues and subscriptions |

### Understand Service Bus RBAC scope levels

Before you assign an Azure role, determine the scope of access that the managed identity needs. Grant only the narrowest possible scope.

The following list describes the levels at which you can scope access to Service Bus resources, starting with the narrowest scope:

- **Queue, topic, or topic subscription**: Role assignment applies to that specific messaging entity only.
- **Service Bus namespace**: Role assignment spans the entire topology of Service Bus under the namespace.
- **Resource group**: Role assignment applies to all the Service Bus resources under the resource group.
- **Azure subscription**: Role assignment applies to all the Service Bus resources across all resource groups in the Azure subscription.

Azure role assignments might take up to five minutes to propagate.

### Assign a role to a managed identity in the Azure portal

1. Go to your Service Bus namespace, queue, or topic.

1. On the left menu, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. On the **Role** tab, select the appropriate Service Bus data role.

1. On the **Members** tab, select **Managed identity** > **Select members**.

1. Select the managed identity for your Azure resource.

1. Select **Review + assign**.

For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

### Assign a role by using the Azure CLI

The Azure portal doesn't support assigning managed identities to Service Bus roles at the topic subscription level. Use the Azure CLI [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to assign a role at any scope:

```azurecli
az role assignment create \
    --role $service_bus_role \
    --assignee $assignee_id \
    --scope /subscriptions/$subscription_id/resourceGroups/$resource_group/providers/Microsoft.ServiceBus/namespaces/$service_bus_namespace/topics/$service_bus_topic/subscriptions/$service_bus_subscription
```

For more information about how built-in roles are defined, see [Understand Azure role definitions](../role-based-access-control/role-definitions.md#control-and-data-actions). For information about creating Azure custom roles, see [Azure custom roles](../role-based-access-control/custom-roles.md).

> [!NOTE]
> If the source service or app doesn't restart after you remove its managed identity from the Service Bus RBAC role, the source app might continue to send or receive messages to or from the Service Bus entity until the token expires. (The default token validity is 24 hours.) This behavior is by design.
>
> After you remove the source's managed identity from the RBAC role, restart the source app or service to immediately expire the token and prevent it from sending or receiving messages from the Service Bus entity.

## Connect to Service Bus by using a managed identity in Azure SDKs

Azure SDKs for .NET, Java, JavaScript, and Python support managed identity authentication with Service Bus. The following example shows how to connect by using the .NET SDK.

In .NET, the [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object is initialized by using a constructor that takes a fully qualified namespace and token credential (`TokenCredential`). `DefaultAzureCredential` derives from `TokenCredential`, which automatically uses the managed identity configured for the app. The token credential automatically handles the flow of the managed identity context to Service Bus and the authorization handshake. It's a simpler model than using a SAS.

```csharp
var client = new ServiceBusClient("contoso.servicebus.windows.net", new DefaultAzureCredential());
```

Send and receive messages as usual by using [ServiceBusSender](/dotnet/api/azure.messaging.servicebus.servicebussender) and [ServiceBusReceiver](/dotnet/api/azure.messaging.servicebus.servicebusreceiver) or [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor).

For step-by-step instructions to send and receive messages by using a managed identity, see the following quickstarts. These quickstarts have code to use a service principal to send and receive messages, but the code is the same for using a managed identity.  

- [.NET](service-bus-dotnet-get-started-with-queues.md)
- [Java](service-bus-java-how-to-use-queues.md)
- [JavaScript](service-bus-nodejs-how-to-use-queues.md)
- [Python](service-bus-python-how-to-use-queues.md)

> [!NOTE]
> Managed identities work only inside the Azure environment, on Azure App Service, Azure virtual machines, and scale sets. For .NET applications, the `Microsoft.Azure.Services.AppAuthentication` library (used by the Service Bus NuGet package) provides an abstraction over this protocol and supports local development. You can test your code locally using your user account from Visual Studio, the Azure CLI, or Microsoft Entra integrated authentication. For more information, see [App Authentication client library for .NET](/dotnet/api/overview/azure/service-to-service-authentication).  

## Related content

- [Sample: .NET web application that uses a managed identity with Service Bus](https://github.com/Azure-Samples/app-service-msi-servicebus-dotnet/tree/master)
- [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)
- [Disable local authentication for Service Bus](disable-local-authentication.md)
