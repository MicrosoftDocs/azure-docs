---
title: Authorize access with Microsoft Entra ID
description: This article provides information on authorizing access to Event Hubs resources using Microsoft Entra ID. 
ms.topic: conceptual
ms.date: 10/25/2022
---

# Authorize access to Event Hubs resources using Microsoft Entra ID
Azure Event Hubs supports using Microsoft Entra ID to authorize requests to Event Hubs resources. With Microsoft Entra ID, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, or an application service principal. To learn more about roles and role assignments, see [Understanding the different roles](../role-based-access-control/overview.md).

## Overview
When a security principal (a user, or an application) attempts to access an Event Hubs resource, the request must be authorized. With Microsoft Entra ID, access to a resource is a two-step process. 

 1. First, the security principal’s identity is authenticated, and an OAuth 2.0 token is returned. The resource name to request a token is `https://eventhubs.azure.net/`, and it's the same for all clouds/tenants. For Kafka clients, the resource to request a token is `https://<namespace>.servicebus.windows.net`.
 1. Next, the token is passed as part of a request to the Event Hubs service to authorize access to the specified resource.

The authentication step requires that an application request contains an OAuth 2.0 access token at runtime. If an application is running within an Azure entity such as an Azure VM,  a virtual machine scale set, or an Azure Function app, it can use a managed identity to access the resources. To learn how to authenticate requests made by a managed identity to Event Hubs service, see [Authenticate access to Azure Event Hubs resources with Microsoft Entra ID and managed identities for Azure Resources](authenticate-managed-identity.md). 

The authorization step requires that one or more Azure roles be assigned to the security principal. Azure Event Hubs provides Azure roles that encompass sets of permissions for Event Hubs resources. The roles that are assigned to a security principal determine the permissions that the principal will have. For more information about Azure roles, see [Azure built-in roles for Azure Event Hubs](#azure-built-in-roles-for-azure-event-hubs). 

Native applications and web applications that make requests to Event Hubs can also authorize with Microsoft Entra ID. To learn how to request an access token and use it to authorize requests for Event Hubs resources, see [Authenticate access to Azure Event Hubs with Microsoft Entra ID from an application](authenticate-application.md). 

## Assign Azure roles for access rights
Microsoft Entra authorizes access rights to secured resources through [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md). Azure Event Hubs defines a set of Azure built-in roles that encompass common sets of permissions used to access event hub data and you can also define custom roles for accessing the data.

When an Azure role is assigned to a Microsoft Entra security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of subscription, the resource group, the Event Hubs namespace, or any resource under it. A Microsoft Entra security principal may be a user, or an application service principal, or a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

## Azure built-in roles for Azure Event Hubs
Azure provides the following Azure built-in roles for authorizing access to Event Hubs data using Microsoft Entra ID and OAuth:

| Role | Description | 
| ---- | ----------- | 
| [Azure Event Hubs Data owner](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner) | Use this role to give complete access to Event Hubs resources. |
| [Azure Event Hubs Data sender](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-sender) | Use this role to give the send access to Event Hubs resources. |
| [Azure Event Hubs Data receiver](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-receiver) | Use this role to give the consuming/receiving access to Event Hubs resources. |

For Schema Registry built-in roles, see [Schema Registry roles](schema-registry-concepts.md#azure-role-based-access-control).

## Resource scope 
Before you assign an Azure role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's always best to grant only the narrowest possible scope.

The following list describes the levels at which you can scope access to Event Hubs resources, starting with the narrowest scope:

- **Consumer group**: At this scope, role assignment applies only to this entity. Currently, the Azure portal doesn't support assigning an Azure role to a security principal at this level. 
- **Event hub**: Role assignment applies to the Event Hub entity and the consumer group under it.
- **Namespace**: Role assignment spans the entire topology of Event Hubs under the namespace and to the consumer group associated with it.
- **Resource group**: Role assignment applies to all the Event Hubs resources under the resource group.
- **Subscription**: Role assignment applies to all the Event Hubs resources in all of the resource groups in the subscription.

> [!NOTE]
> - Keep in mind that Azure role assignments may take up to five minutes to propagate. 
> - This content applies to both Event Hubs and Event Hubs for Apache Kafka. For more information on Event Hubs for Kafka support, see [Event Hubs for Kafka - security and authentication](azure-event-hubs-kafka-overview.md#security-and-authentication).


For more information about how built-in roles are defined, see [Understand role definitions](../role-based-access-control/role-definitions.md#control-and-data-actions). For information about creating Azure custom roles, see [Azure custom roles](../role-based-access-control/custom-roles.md).



## Samples
- [Microsoft.Azure.EventHubs samples](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac). 
    
    These samples use the old **Microsoft.Azure.EventHubs** library, but you can easily update it to using the latest **Azure.Messaging.EventHubs** library. To move the sample from using the old library to new one, see the [Guide to migrate from Microsoft.Azure.EventHubs to Azure.Messaging.EventHubs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/MigrationGuide.md).
- [Azure.Messaging.EventHubs samples](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Azure.Messaging.EventHubs/ManagedIdentityWebApp)

    This sample has been updated to use the latest **Azure.Messaging.EventHubs** library.
- [Event Hubs for Kafka - OAuth samples](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth). 


## Next steps
- Learn how to assign an Azure built-in role to a security principal, see [Authenticate access to Event Hubs resources using Microsoft Entra ID](authenticate-application.md).
- Learn [how to create custom roles with Azure RBAC](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac/CustomRole).
- Learn [how to use Microsoft Entra ID with EH](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac/AzureEventHubsSDK)

See the following related articles:

- [Authenticate requests to Azure Event Hubs from an application using Microsoft Entra ID](authenticate-application.md)
- [Authenticate a managed identity with Microsoft Entra ID to access Event Hubs Resources](authenticate-managed-identity.md)
- [Authenticate requests to Azure Event Hubs using Shared Access Signatures](authenticate-shared-access-signature.md)
- [Authorize access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md)
