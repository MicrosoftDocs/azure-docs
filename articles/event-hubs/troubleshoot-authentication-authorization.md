---
title: Troubleshoot authentication and authorization issues - Azure Event Hubs
description: This article provides information on troubleshooting authentication and authorization issues with Azure Event Hubs. 
services: event-hubs
documentationcenter: na
author: spelluru

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.date: 05/18/2020
ms.author: spelluru

---

# Troubleshoot authentication and authorization issues - Azure Event Hubs
The [Troubleshoot connectivity issues](troubleshooting-guide.md) article provides tips for troubleshooting connectivity issues with Azure Event Hubs. This article provides tips and recommendations for troubleshooting authentication and authorization issues with Azure Event Hubs. 

## If you are using Azure Active Directory
If you are using Azure Active Directory (Azure AD) to authenticate and authorize with Azure Event Hubs, confirm that the identity accessing the event hub is a member of the right **role-based access control (RBAC) role** at the right **resource scope** (consumer group, event hub, namespace, resource group, or subscription).

### RBAC roles
- [Azure Event Hubs Data owner](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner) for complete access to Event Hubs resources.
- [Azure Event Hubs Data sender](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-receiver) for the send access.
- [Azure Event Hubs Data receiver](../role-based-access-control/built-in-roles.md#azure-event-hubs-data-sender) for the receive access.

### Resource scopes
- **Consumer group**: At this scope, role assignment applies only to this entity. Currently, the Azure portal doesn't support assigning an RBAC role to a security principal at this level. 
- **Event hub**: Role assignment applies to the Event Hub entity and the consumer group under it.
- **Namespace**: Role assignment spans the entire topology of Event Hubs under the namespace and to the consumer group associated with it.
- **Resource group**: Role assignment applies to all the Event Hubs resources under the resource group.
- **Subscription**: Role assignment applies to all the Event Hubs resources in all of the resource groups in the subscription.

For more information, see the following articles:

- [Authenticate an application with Azure Active Directory to access Event Hubs resources](authenticate-application.md)
- [Authorize access to Event Hubs resources using Azure Active Directory](authorize-access-azure-active-directory.md)

## If you are using Shared access signatures (SAS)
If you are using [SAS](authenticate-shared-access-signature.md), follow these steps: 

- Ensure that the SAS key you are using is correct. If not, use the right SAS key.
- Verify that the key has the right permissions (send, receive, or manage). If not, use a key that has the permission you need. 
- Check if the key has expired. We recommend that you renew the SAS well before expiration. If there is clock skew between client and the Event Hubs service nodes, the authentication token might expire before client realizes it. Current implementation accounts clock skew up to 5 minutes, that is, client renews the token 5 minutes before it expires. Therefore, if the clock skew is bigger than 5 minutes the client can observe intermittent authentication failures.
- If **SAS start time** is set to **now**, you may see intermittent failures for the first few minutes due to clock skew (differences in current time on different machines). Set the start time to be at least 15 minutes in the past or don't set it at all. The same generally applies to the expiry time as well. 

For more information, see the following articles: 

- [Authenticate using shared access signatures (SAS)](authenticate-shared-access-signature.md). 
- [Authorizing access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md)

## Next steps

See the following articles:

* [Troubleshoot connectivity issues](troubleshooting-guide.md)
