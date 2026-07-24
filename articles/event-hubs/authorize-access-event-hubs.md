---
title: Authorize access to Azure Event Hubs
description: This article provides information about different options for authorizing access to Azure Event Hubs resources. 
ms.topic: concept-article
ms.date: 07/25/2025
ms.author: spelluru
#customer intent: As an Azure Event Hubs user, I want to know how to authorize requests to event hubs. 
---

# Authorize access to Azure Event Hubs
Every time you publish or consume events from an event hub, your client accesses Event Hubs resources. Each request to a secure resource must be authorized to ensure the client has the required permissions to publish or consume data. 

Azure Event Hubs provides these options for authorizing access to secure resources:

- Microsoft Entra ID
- Shared access signature

> [!NOTE]
> This article applies to Event Hubs and [Apache Kafka](azure-event-hubs-apache-kafka-overview.md) scenarios. 


## Microsoft Entra ID
Microsoft Entra integration with Event Hubs resources lets you use Azure role-based access control (RBAC) for fine-grained control over a client's access to resources. Use Azure RBAC to grant permissions to a security principal, which might be a user, a group, or an application service principal. Microsoft Entra authenticates the security principal, then returns an OAuth 2.0 token. The token can be used to authorize a request to access an Event Hubs resource.

For more information about authenticating with Microsoft Entra ID, see the following articles:

- [Authenticate requests to Azure Event Hubs using Microsoft Entra ID](authenticate-application.md)
- [Authorize access to Event Hubs resources using Microsoft Entra ID](authorize-access-azure-active-directory.md)

## Shared access signatures 
Shared access signatures (SAS) for Event Hubs resources let you delegate limited access to Event Hubs resources. Adding constraints on the time interval when the signature is valid or on the permissions it grants gives flexibility in managing resources. For more information, see [Authenticate using shared access signatures (SAS)](authenticate-shared-access-signature.md). 

Authorizing users or applications with an OAuth 2.0 token from Microsoft Entra ID offers better security and ease of use than shared access signatures (SAS). With Microsoft Entra ID, you don't need to store access tokens with your code, reducing potential security risks. While you can continue to use shared access signatures (SAS) to grant fine-grained access to Event Hubs resources, Microsoft Entra ID offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS. 

By default, all Event Hubs resources are secured and available only to the account owner. Although you can use any of the authorization strategies outlined above to grant clients access to Event Hubs resources, Microsoft recommends using Microsoft Entra ID when possible for maximum security and ease of use.

For more information about authorization using SAS, see [Authorizing access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md).

## Next steps
- Review [Azure RBAC samples](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/Rbac) in our GitHub repository.
- See these articles:
    - [Authenticate requests to Azure Event Hubs from an application using Microsoft Entra ID](authenticate-application.md).
    - [Authenticate a managed identity with Microsoft Entra ID to access Event Hubs resources](authenticate-managed-identity.md).
    - [Authenticate requests to Azure Event Hubs using shared access signatures](authenticate-shared-access-signature.md).
    - [Authorize access to Event Hubs resources using Microsoft Entra ID](authorize-access-azure-active-directory.md).
    - [Authorize access to Event Hubs resources using shared access signatures](authorize-access-shared-access-signature.md).
