---
title: Authorize access to Azure Event Hubs
description: This article provides information about different options for authorizing access to Azure Event Hubs resources. 
services: event-hubs
ms.service: event-hubs
documentationcenter: ''
author: spelluru

ms.topic: conceptual
ms.date: 08/13/2019
ms.author: spelluru

---
# Authorize access to Azure Event Hubs
Every time you publish or consume events/data from an Event Hubs, your client is trying to access Event Hubs resources. Every request to a secure resource must be authorized so that the service can ensure that the client has permissions required to publish/consume the data. 

Azure Event Hubs offers the following options for authorizing access to secure resources:

## Azure Active Directory
Azure Active Directory (Azure AD) integration for Event Hubs resources provides role-based access control (RBAC) for fine-grained control over a client’s access to resources. You can use role-based access control (RBAC) to grant permissions to security principal, which may be a user, a group, or an application service principal. The security principal is authenticated by Azure AD to return an OAuth 2.0 token. The token can be used to authorize a request to access an Event Hubs resource.

For more information about authenticating with Azure AD, see [Authenticating requests to Azure Event Hubs using Azure Active Directory](authenticate-application.md). For more information about authorizing with Azure AD, see [Authorize access to Event Hubs resources using Azure Active Directory](authorize-access-azure-active-directory.md).

## Share access signatures 
Shared access signatures (SAS) for Event Hubs resources provide limited delegated access to Event Hubs resources. Adding constraints on time interval for which the signature is valid or on permissions it grants provides flexibility in managing resources. For more information, see [Using shared access signatures (SAS)](authenticate-shared-access-signature.md). 

Authorizing users or applications using an OAuth 2.0 token returned by Azure AD provides superior security and ease of use over shared access signatures (SAS). With Azure AD, there's no need to store the access tokens with your code and risk potential security vulnerabilities. While you can continue to use shared access signatures (SAS) to grant fine-grained access to Event Hubs resources, Azure AD offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS. 

By default, all Event Hubs resources are secured, and are available only to the account owner. Although you can use any of the authorization strategies outlined above to grant clients access to Event Hub resources. Only Event Hubs resources created with Azure Resource Manager deployment model support Azure AD authorization. Microsoft recommends using Azure AD when possible for maximum security and ease of use.

For more information about authorization using SAS, see [Authorizing access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md).

> [!NOTE]
> Microsoft recommends that you use Azure AD credentials when possible as a security best practice, rather than using the shared access signatures, which can be more easily compromised. While you can continue to use shared access signatures (SAS) to grant fine-grained access to your Event Hubs resources, Azure AD offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS.
> 
> For more information about Azure AD integration in Azure Event Hubs, see [Authorize access to Event Hubs using Azure AD](authorize-access-azure-active-directory.md). 

## Next steps
See the following articles:

- [Authenticating requests to Azure Event Hubs using Azure Active Directory](authenticate-application.md)
- [Authorize access to Event Hubs resources using Azure Active Directory](authorize-access-azure-active-directory.md)
- [Authenticating requests to Azure Event Hubs using Shared Access Signatures](authenticate-shared-access-signature.md)
- [Authorizing access to Event Hubs resources using Shared Access Signatures](authorize-access-shared-access-signature.md)

