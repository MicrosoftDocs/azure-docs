---
# Mandatory fields.
title: Secure Azure Digital Twins solutions
titleSuffix: Azure Digital Twins
description: Understand security best practices with Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/18/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Secure Azure Digital Twins with role-based access control

Applications gain access to Azure Digital Twins resources using Shared Access Signature (SAS) token authentication. With SAS, applications present a token to ADT that has been signed with a symmetric key known both to the token issuer and ADT (hence "shared") and that key is directly associated with a rule granting specific access rights, like the permission to receive/listen or send messages. SAS rules are either configured on the namespace, or directly on entities such as a queue or topic, allowing for fine grained access control.

## Azure Active Directory

**Azure Active Directory (Azure AD)** integration for ADT provides role-based access control (RBAC) for control over access to resources. You can use role-based access control (RBAC) to grant permissions to a security principal, which may be a user, a group, or an application service principal. The security principal is authenticated by Azure AD to return an OAuth 2.0 token. The token can be used to authorize a request to access an ADT instance.

To learn more about roles and role assignments supported in Azure, see [Understand the different roles](../role-based-access-control/rbac-and-directory-admin-roles.md) in the Azure RBAC documentation.
When a security principal (a user, group, or application) attempts to access Azure Digital Twins, the request must be authorized. With Azure AD, access is a two-step process.

1. First, the security principal's identity is authenticated, and an OAuth 2.0 token is returned. The resource name to request a token is https://servicebus.azure.net.
2. Next, the token is passed as part of a request to the Azure Digital Twins service to authorize access to the specified resource.

## Authentication and Authorization

The authentication step requires that an application request contains an OAuth 2.0 access token at runtime. If an application is running within an Azure entity such as an Azure Function app, it can use a managed identity to access the resources. 
The authorization step requires that an RBAC role be assigned to the security principal. Azure Digital Twins provides RBAC roles that encompass sets of permissions for Azure Digital Twins resources. The roles that are assigned to a security principal determine the permissions that the principal will have. 

## Built-in RBAC roles for Azure Digital Twins

Azure provides the below built-in RBAC roles for authorizing access to an Azure Digital Twins resource:
* Azure Digital Twins Owner (Preview) – Use this role to give admin controls over Azure Digital Twins resources.
* Azure Digital Twins Reader (Preview) – Use this role to give read only access to Azure Digital Twins resources.

For more information about how built-in roles are defined, see [Understand role definitions](../role-based-access-control/role-definitions.md) in the Azure RBAC documentation. For information about creating custom RBAC roles, see [Custom roles for Azure resources](../role-based-access-control/custom-roles.md).

## Resource scope

Before you assign an RBAC role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's always best to grant only the narrowest possible scope.
The following list describes the levels at which you can scope access to Azure Digital Twins resources:
* Models: Role assignment dictates control over models uploaded in Azure Digital Twins to generate a graph.
* Query: Role assignment determines ability to run SQL query operations on twins within the Azure Digital Twins graph.
* Digital Twin: Role assignment provides control over CRUD operations on digital twin entities in the graph.
* Twin relationships: Role assignment defines control over do CRUD operations on relationship edges between twins within a graph
* Event routes: Role assignment determines access to route events from Azure Digital Twins to an endpoint service like Event Grid, Event Hub or Service Bus.

You can assign roles using a variety of mechanism:
* IAM pane for Azure Digital Twins in Azure Portal (link to tutorial/getting started guide)
* CLI commands to add or remove a role (link to tutorial/getting started guidel)

For more detailed steps on how to do this, visit the tutorial [here](https://github.com/Azure/azure-digital-twins/tree/private-preview/Tutorials).

## Next steps

* Read more about [RBAC for Azure](../role-based-access-control/overview.md).

