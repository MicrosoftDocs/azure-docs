---
title: Authorize access to tables using Active Directory
titleSuffix: Azure Storage
description: Authorize access to Azure tables using Microsoft Entra ID. Assign Azure roles for access rights. Access data with a Microsoft Entra account.
services: storage
author: akashdubey-ms

ms.service: azure-table-storage
ms.topic: conceptual
ms.date: 02/09/2023
ms.author: akashdubey
---

# Authorize access to tables using Microsoft Entra ID

Azure Storage supports using Microsoft Entra ID to authorize requests to table data. With Microsoft Entra ID, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, group, or application service principal. The security principal is authenticated by Microsoft Entra ID to return an OAuth 2.0 token. The token can then be used to authorize a request against the Table service.

Authorizing requests against Azure Storage with Microsoft Entra ID provides superior security and ease of use over Shared Key authorization. Microsoft recommends using Microsoft Entra authorization with your table applications when possible to assure access with minimum required privileges.

Authorization with Microsoft Entra ID is available for all general-purpose in all public regions and national clouds. Only storage accounts created with the Azure Resource Manager deployment model support Microsoft Entra authorization.

<a name='overview-of-azure-ad-for-tables'></a>

## Overview of Microsoft Entra ID for tables

When a security principal (a user, group, or application) attempts to access a table resource, the request must be authorized. With Microsoft Entra ID, access to a resource is a two-step process. First, the security principal's identity is authenticated and an OAuth 2.0 token is returned. Next, the token is passed as part of a request to the Table service and used by the service to authorize access to the specified resource.

The authentication step requires that an application request an OAuth 2.0 access token at runtime. If an application is running from within an Azure entity such as an Azure VM, a virtual machine scale set, or an Azure Functions app, it can use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to access tables.

The authorization step requires that one or more Azure roles be assigned to the security principal. Azure Storage provides Azure roles that encompass common sets of permissions for table data. The roles that are assigned to a security principal determine the permissions that that principal will have. To learn more about assigning Azure roles for table access, see [Assign an Azure role for access to table data](assign-azure-role-data-access.md).

[!INCLUDE [storage-auth-language-table](../../../includes/storage-auth-language-table.md)]

## Assign Azure roles for access rights

Microsoft Entra authorizes access rights to secured resources through [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of Azure built-in roles that encompass common sets of permissions used to access table data. You can also define custom roles for access to table data.

When an Azure role is assigned to a Microsoft Entra security principal, Azure grants access to those resources for that security principal. A Microsoft Entra security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

### Resource scope

Before you assign an Azure RBAC role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's always best to grant only the narrowest possible scope. Azure RBAC roles defined at a broader scope are inherited by the resources beneath them.

You can scope access to Azure table resources at the following levels, beginning with the narrowest scope:

- **An individual table.** At this scope, a role assignment applies to the specified table.
- **The storage account.** At this scope, a role assignment applies to all tables in the account.
- **The resource group.** At this scope, a role assignment applies to all of the tables in all of the storage accounts in the resource group.
- **The subscription.** At this scope, a role assignment applies to all of the tables in all of the storage accounts in all of the resource groups in the subscription.
- **A management group.** At this scope, a role assignment applies to all of the tables in all of the storage accounts in all of the resource groups in all of the subscriptions in the management group.

For more information about scope for Azure RBAC role assignments, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

### Azure built-in roles for tables

Azure RBAC provides built-in roles for authorizing access to table data using Microsoft Entra ID and OAuth. Built-in roles that provide permissions to tables in Azure Storage include:

- [Storage Table Data Contributor](../../role-based-access-control/built-in-roles.md#storage-table-data-contributor): Use to grant read/write/delete permissions to Table storage resources.
- [Storage Table Data Reader](../../role-based-access-control/built-in-roles.md#storage-table-data-reader): Use to grant read-only permissions to Table storage resources.

To learn how to assign an Azure built-in role to a security principal, see [Assign an Azure role for access to table data](assign-azure-role-data-access.md). To learn how to list Azure RBAC roles and their permissions, see [List Azure role definitions](../../role-based-access-control/role-definitions-list.md).

For more information about how built-in roles are defined for Azure Storage, see [Understand role definitions](../../role-based-access-control/role-definitions.md#control-and-data-actions). For information about creating Azure custom roles, see [Azure custom roles](../../role-based-access-control/custom-roles.md).

Only roles explicitly defined for data access permit a security principal to access table data. Built-in roles such as **Owner**, **Contributor**, and **Storage Account Contributor** permit a security principal to manage a storage account, but do not provide access to the table data within that account via Microsoft Entra ID. However, if a role includes **Microsoft.Storage/storageAccounts/listKeys/action**, then a user to whom that role is assigned can access data in the storage account via Shared Key authorization with the account access keys.

For detailed information about Azure built-in roles for Azure Storage for both the data services and the management service, see the **Storage** section in [Azure built-in roles for Azure RBAC](../../role-based-access-control/built-in-roles.md#storage). Additionally, for information about the different types of roles that provide permissions in Azure, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).

> [!IMPORTANT]
> Azure role assignments may take up to 30 minutes to propagate.

### Access permissions for data operations

For details on the permissions required to call specific Table service operations, see [Permissions for calling data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

## Next steps

- [Authorize access to data in Azure Storage](../common/authorize-data-access.md)
- [Assign an Azure role for access to table data](assign-azure-role-data-access.md)
