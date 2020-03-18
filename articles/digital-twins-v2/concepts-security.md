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

Azure Digital Twins enables precise access control over specific data, resources, and actions in your deployment. It does this through a granular role and permission management strategy called **role-based access control (RBAC)**. You can read about the general principles of RBAC for Azure [here](../role-based-access-control/overview.md).

RBAC is provided to Azure Digital Twins via integration with [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md). 

## RBAC through Azure AD

You can use RBAC to grant permissions to a *security principal*, which may be a user, a group, or an application service principal. The security principal is authenticated by **Azure AD**, and receives an OAuth 2.0 token in return. This token can be used to authorize an access request to an Azure Digital Twins instance.

### Authentication and authorization

With Azure AD, access is a two-step process. When a security principal (a user, group, or application) attempts to access Azure Digital Twins, the request must be *authenticated* and *authorized*. 

1. First, the security principal's identity is *authenticated*, and an OAuth 2.0 token is returned.
2. Next, the token is passed as part of a request to the Azure Digital Twins service, to *authorize* access to the specified resource.

The authentication step requires any application request to contain an OAuth 2.0 access token at runtime. If an application is running within an Azure entity such as an [Azure Function](../azure-functions/functions-overview.md) app, it can use a managed identity to access the resources. 

The authorization step requires that an RBAC role be assigned to the security principal. Azure Digital Twins provides RBAC roles that encompass sets of permissions for Azure Digital Twins resources. The roles that are assigned to a security principal determine the permissions that the principal will have. 

To learn more about roles and role assignments supported in Azure, see [Understand the different roles](../role-based-access-control/rbac-and-directory-admin-roles.md) in the Azure RBAC documentation.

### RBAC roles for Azure Digital Twins

Azure provides the below built-in RBAC roles for authorizing access to an Azure Digital Twins resource:
* Azure Digital Twins Owner (Preview) – Use this role to give admin controls over Azure Digital Twins resources.
* Azure Digital Twins Reader (Preview) – Use this role to give read only access to Azure Digital Twins resources.

For more information about how built-in roles are defined, see [Understand role definitions](../role-based-access-control/role-definitions.md) in the Azure RBAC documentation. 

For information about creating custom RBAC roles, see [Custom roles for Azure resources](../role-based-access-control/custom-roles.md).

You can assign roles in either of two ways:
* via the access control (IAM) pane for Azure Digital Twins in Azure Portal (see [Add or remove role assignments using Azure RBAC and the Azure portal](../role-based-access-control/role-assignments-portal.md)).
* via CLI commands to add or remove a role

For more detailed steps on how to do this, you can also visit the Azure Digital Twins tutorial [here](https://github.com/Azure/azure-digital-twins/tree/private-preview/Tutorials).

## Permission scopes

Before you assign an RBAC role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's always best to grant only the narrowest possible scope.

The following list describes the levels at which you can scope access to Azure Digital Twins resources:
* Models: Role assignment dictates control over models uploaded in Azure Digital Twins to generate a graph.
* Query: Role assignment determines ability to run SQL query operations on twins within the Azure Digital Twins graph.
* Digital Twin: Role assignment provides control over CRUD operations on digital twin entities in the graph.
* Twin relationships: Role assignment defines control over do CRUD operations on relationship edges between twins within a graph
* Event routes: Role assignment determines access to route events from Azure Digital Twins to an endpoint service like Event Grid, Event Hub or Service Bus.

## Next steps

* Read more about [RBAC for Azure](../role-based-access-control/overview.md).

