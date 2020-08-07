---
title: Authorize access with Azure Active Directory
description: This article provides information on authorizing access to Event Hubs resources using Azure Active Directory. 
ms.topic: conceptual
ms.date: 06/23/2020
---

# Authorize access to Event Hubs resources using Azure Active Directory
Azure Event Hubs supports using Azure Active Directory (Azure AD) to authorize requests to Event Hubs resources. With Azure AD, you can use role-based access control (RBAC) to grant permissions to a security principal, which may be a user, or an application service principal. To learn more about roles and role assignments, see [Understanding the different roles](../role-based-access-control/overview.md).

## Overview
When a security principal (a user, or an application) attempts to access an Event Hubs resource, the request must be authorized. With Azure AD, access to a resource is a two-step process. 

 1. First, the security principal’s identity is authenticated, and an OAuth 2.0 token is returned. The resource name to request a token is `https://eventhubs.azure.net/`. For Kafka clients, the resource to request a token is `https://<namespace>.servicebus.windows.net`.
 1. Next, the token is passed as part of a request to the Event Hubs service to authorize access to the specified resource.

The authentication step requires that an application request contains an OAuth 2.0 access token at runtime. If an application is running within an Azure entity such as an Azure VM,  a virtual machine scale set, or an Azure Function app, it can use a managed identity to access the resources. To learn how to authenticate requests made by a managed identity to Event Hubs service, see [Authenticate access to Azure Event Hubs resources with Azure Active Directory and managed identities for Azure Resources](authenticate-managed-identity.md). 

The authorization step requires that one or more RBAC roles be assigned to the security principal. Azure Event Hubs provides RBAC roles that encompass sets of permissions for Event Hubs resources. The roles that are assigned to a security principal determine the permissions that the principal will have. For more information about RBAC roles, see [Built-in RBAC roles for Azure Event Hubs](#built-in-rbac-roles-for-azure-event-hubs). 

Native applications and web applications that make requests to Event Hubs can also authorize with Azure AD. To learn how to request an access token and use it to authorize requests for Event Hubs resources, see [Authenticate access to Azure Event Hubs with Azure AD from an application](authenticate-application.md). 

## Assign RBAC roles for access rights
Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](../role-based-access-control/overview.md). Azure Event Hubs defines a set of built-in RBAC roles that encompass common sets of permissions used to access event hub data and you can also define custom roles for accessing the data.

When an RBAC role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of subscription, the resource group, the Event Hubs namespace, or any resource under it. An Azure AD security principal may be a user, or an application service principal, or a [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

## Built-in RBAC roles for Azure Event Hubs
Azure provides the following built-in RBAC roles for authorizing access to Event Hubs data using Azure AD and OAuth:

- [Azure Event Hubs Data owner](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner): Use this role to give complete access to Event Hubs resources.
- [Azure Event Hubs Data sender](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-receiver): Use this role to give the send access to Event Hubs resources.
- [Azure Event Hubs Data receiver](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-sender): Use this role to give the consuming/receiving access to Event Hubs resources.

## Resource scope 
Before you assign an RBAC role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's always best to grant only the narrowest possible scope.

The following list describes the levels at which you can scope access to Event Hubs resources, starting with the narrowest scope:

- **Consumer group**: At this scope, role assignment applies only to this entity. Currently, the Azure portal doesn't support assigning an RBAC role to a security principal at this level. 
- **Event hub**: Role assignment applies to the Event Hub entity and the consumer group under it.
- **Namespace**: Role assignment spans the entire topology of Event Hubs under the namespace and to the consumer group associated with it.
- **Resource group**: Role assignment applies to all the Event Hubs resources under the resource group.
- **Subscription**: Role assignment applies to all the Event Hubs resources in all of the resource groups in the subscription.

> [!NOTE]
> - Keep in mind that RBAC role assignments may take up to five minutes to propagate. 
> - This content applies to both Event Hubs and Event Hubs for Apache Kafka. For more information on Event Hubs for Kafka support, see [Event Hubs for Kafka - security and authentication](event-hubs-for-kafka-ecosystem-overview.md#security-and-authentication).


For more information about how built-in roles are defined, see [Understand role definitions](../role-based-access-control/role-definitions.md#management-and-data-operations). For information about creating custom RBAC roles, see [Create custom roles for Azure Role-Based Access Control](../role-based-access-control/custom-roles.md).



## Samples
- [Microsoft.Azure.EventHubs samples](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac). 
    
    These samples use the old **Microsoft.Azure.EventHubs** library, but you can easily update it to using the latest **Azure.Messaging.EventHubs** library. To move the sample from using the old library to new one, see the [Guide to migrate from Microsoft.Azure.EventHubs to Azure.Messaging.EventHubs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/eventhub/Azure.Messaging.EventHubs/MigrationGuide.md).
- [Azure.Messaging.EventHubs samples](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Azure.Messaging.EventHubs/ManagedIdentityWebApp)

    This sample has been updated to use the latest **Azure.Messaging.EventHubs** library.
- [Event Hubs for Kafka - OAuth samples](https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/oauth). 


## Next steps
- Learn how to assign a built-in-RBAC role to a security principal, see [Authenticate access to Event Hubs resources using Azure Active Directory](authenticate-application.md).
- Learn [how to create custom roles with RBAC](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac/CustomRole).
- Learn [how to use Azure Active Directory with EH](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac/AzureEventHubsSDK)

See the following related articles:

- [Authenticate requests to Azure Event Hubs from an application using Azure Active Directory](authenticate-application.md)
- [Authenticate a managed identity with Azure Active Directory to access Event Hubs Resources](authenticate-managed-identity.md)
- [Authenticate requests to Azure Event Hubs using Shared Access Signatures](authenticate-shared-access-signature.md)
- [Authorize access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md)
