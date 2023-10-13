---
title: Authorize access to Azure Event Hubs
description: This article provides information about different options for authorizing access to Azure Event Hubs resources. 
ms.topic: conceptual
ms.date: 03/13/2023
ms.author: spelluru
---

# Authorize access to Azure Event Hubs
Every time you publish or consume events from an event hub, your client is trying to access Event Hubs resources. Every request to a secure resource must be authorized so that the service can ensure that the client has the required permissions to publish or consume the data. 

Azure Event Hubs offers the following options for authorizing access to secure resources:

- Microsoft Entra ID
- Shared access signature

> [!NOTE]
> This article applies to both Event Hubs and [Apache Kafka](azure-event-hubs-kafka-overview.md) scenarios. 

<a name='azure-active-directory'></a>

## Microsoft Entra ID
Microsoft Entra integration with Event Hubs resources provides Azure role-based access control (Azure RBAC) for fine-grained control over a client's access to resources. You can use Azure RBAC to grant permissions to security principal, which may be a user, a group, or an application service principal. Microsoft Entra authenticates the security principal and returns an OAuth 2.0 token. The token can be used to authorize a request to access an Event Hubs resource.

For more information about authenticating with Microsoft Entra ID, see the following articles:

- [Authenticate requests to Azure Event Hubs using Microsoft Entra ID](authenticate-application.md)
- [Authorize access to Event Hubs resources using Microsoft Entra ID](authorize-access-azure-active-directory.md).

## Shared access signatures 
Shared access signatures (SAS) for Event Hubs resources provide limited delegated access to Event Hubs resources. Adding constraints on time interval for which the signature is valid or on permissions it grants provides flexibility in managing resources. For more information, see [Authenticate using shared access signatures (SAS)](authenticate-shared-access-signature.md). 

Authorizing users or applications using an OAuth 2.0 token returned by Microsoft Entra ID provides superior security and ease of use over shared access signatures (SAS). With Microsoft Entra ID, there's no need to store the access tokens with your code and risk potential security vulnerabilities. While you can continue to use shared access signatures (SAS) to grant fine-grained access to Event Hubs resources, Microsoft Entra ID offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS. 

By default, all Event Hubs resources are secured, and are available only to the account owner. Although you can use any of the authorization strategies outlined above to grant clients access to Event Hubs resources. Microsoft recommends using Microsoft Entra ID when possible for maximum security and ease of use.

For more information about authorization using SAS, see [Authorizing access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md).

## Next steps
- Review [Azure RBAC samples](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac) published in our GitHub repository. 
- See the following articles:
    - [Authenticate requests to Azure Event Hubs from an application using Microsoft Entra ID](authenticate-application.md)
    - [Authenticate a managed identity with Microsoft Entra ID to access Event Hubs Resources](authenticate-managed-identity.md)
    - [Authenticate requests to Azure Event Hubs using Shared Access Signatures](authenticate-shared-access-signature.md)
    - [Authorize access to Event Hubs resources using Microsoft Entra ID](authorize-access-azure-active-directory.md)
    - [Authorize access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md)
