---
title: Managed identity authentication for Azure Event Hubs
description: Learn how Azure Event Hubs uses managed identities with Microsoft Entra ID so that applications running in Azure can authenticate without storing credentials.
ms.topic: concept-article
ms.date: 08/25/2026
ms.custom: subject-rbac-steps
ai-usage: ai-assisted
#customer intent: As a developer, I want to understand how managed identity authentication works with Azure Event Hubs so that I can connect to an event hub without managing credentials.
---

# Managed identity authentication for Azure Event Hubs

A managed identity is an identity in Microsoft Entra ID that Azure manages for you, so an application can authenticate to services that support Microsoft Entra authentication without storing any credentials. Azure Event Hubs supports Microsoft Entra authentication with [managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview), which lets applications running in Azure connect to Event Hubs without embedding connection strings or access keys in code or configuration.

When you use a managed identity together with Microsoft Entra authentication, applications running in services such as Azure Virtual Machines, Azure Functions, Azure App Service, and Virtual Machine Scale Sets can access Event Hubs data with credentials that Azure provisions and rotates automatically. This approach removes the risk of leaked keys and reduces the operational overhead of credential management.

For a step-by-step example, see [Access Azure Event Hubs from a VM using a managed identity](authenticate-managed-identity-virtual-machine.md).

## How managed identity authentication works

Access to an Event Hubs resource through a managed identity is a two-step process:

- **Authentication**: The managed identity requests an OAuth 2.0 token from Microsoft Entra ID. Azure supplies the identity automatically based on the compute environment where the code runs, so no secret is stored or passed in the application.
- **Authorization**: The token is presented to the Event Hubs service, which grants access based on the Azure role-based access control (RBAC) roles assigned to the identity.

For a full description of the authentication and authorization flow, see [Authorize access to Azure Event Hubs resources using Microsoft Entra ID](authorize-access-azure-active-directory.md).

## Managed identity types

Event Hubs works with both types of managed identities:

- **System-assigned managed identity**: Enabled directly on an Azure resource, such as a virtual machine or an App Service app. Its lifecycle is tied to that resource, and only that resource can use it to request tokens.
- **User-assigned managed identity**: Created as a standalone Azure resource and assigned to one or more Azure resources, so multiple workloads can share the same identity.

To learn more about the two types and when to choose each one, see [Managed identity types](/entra/identity/managed-identities-azure-resources/overview#managed-identity-types). For the list of services that support managed identities, see [Services that support managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/managed-identities-status).

## Azure built-in roles for Event Hubs

After you enable a managed identity, assign it an Azure built-in role that defines its permissions on Event Hubs data. Azure provides the following built-in roles for authorizing access to Event Hubs data with Microsoft Entra ID:

| Role | Description |
| ---- | ----------- |
| [Azure Event Hubs Data Owner](/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-owner) | Grants complete access to Event Hubs resources. |
| [Azure Event Hubs Data Sender](/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-sender) | Grants permission to send events to Event Hubs resources. |
| [Azure Event Hubs Data Receiver](/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-receiver) | Grants permission to receive events from Event Hubs resources. |

You can assign a role at the level of a consumer group, event hub, namespace, resource group, or subscription. Grant the narrowest scope that meets the application's needs. For the full list of scopes and role details, see [Azure built-in roles for Azure Event Hubs](authorize-access-azure-active-directory.md#azure-built-in-roles-for-azure-event-hubs). To assign a role in the Azure portal, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Token expiration behavior

When you remove a managed identity from an Event Hubs RBAC role, the change doesn't take effect immediately for a running application. If the source service or app doesn't restart, it can continue to send events to or receive events from the event hub until the token expires. The default token validity is 24 hours. This behavior is by design.

To immediately revoke access after you remove the identity from the role, restart the source app or service so that the existing token expires.

## Client SDK support

The Azure SDK client libraries acquire the managed identity token for you through [`DefaultAzureCredential`](/dotnet/api/azure.identity.defaultazurecredential), which automatically detects the managed identity available in the hosting environment. You pass the credential to `EventHubProducerClient` to send events and to `EventHubConsumerClient` to receive events, without providing a connection string or key.

```csharp
var credential = new DefaultAzureCredential();

// Send events with a managed identity.
var producerClient = new EventHubProducerClient(
    "<namespace>.servicebus.windows.net",
    "<event-hub-name>",
    credential);

// Receive events with a managed identity.
var consumerClient = new EventHubConsumerClient(
    EventHubConsumerClient.DefaultConsumerGroupName,
    "<namespace>.servicebus.windows.net",
    "<event-hub-name>",
    credential);
```

Install the latest [Azure.Messaging.EventHubs](https://www.nuget.org/packages/Azure.Messaging.EventHubs/) package from NuGet to use these clients. For runnable samples, see:

- [Publish events with a managed identity (.NET)](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Azure.Messaging.EventHubs/ManagedIdentityWebApp), which uses the current **Azure.Messaging.EventHubs** package.
- [Managed identity sample (.NET, legacy)](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac/ManagedIdentityWebApp), which uses the legacy **Microsoft.Azure.EventHubs** package.
- [Publish events with Azure identity (Java)](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/eventhubs/azure-messaging-eventhubs/src/samples/java/com/azure/messaging/eventhubs).

## Event Hubs for Apache Kafka

Apache Kafka applications can send events to and receive events from Azure Event Hubs by using managed identity with OAuth. For a Java sample, see [Event Hubs for Kafka: send and receive messages using managed identity OAuth](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth/java/managedidentity).

## Related content

- [Access Azure Event Hubs from a VM using a managed identity](authenticate-managed-identity-virtual-machine.md)
- [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
- [Authorize access to Event Hubs resources using Microsoft Entra ID](authorize-access-azure-active-directory.md)
- [Authenticate requests to Azure Event Hubs from an application using Microsoft Entra ID](authenticate-application.md)
- [Authenticate requests to Azure Event Hubs using Shared Access Signatures](authenticate-shared-access-signature.md)
- [Authorize access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md)
