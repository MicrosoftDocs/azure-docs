---
title: Authorize access to tables using Active Directory (preview)
titleSuffix: Azure Storage
description: Authorize access to Azure tables using Azure Active Directory (Azure AD) (preview). Assign Azure roles for access rights. Access data with an Azure AD account.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 07/12/2021
ms.author: tamram
ms.subservice: common
---

# Authorize access to tables using Azure Active Directory (preview)

Azure Storage supports using Azure Active Directory (Azure AD) to authorize requests to table data (preview). With Azure AD, you can use Azure role-based access control (Azure RBAC) to grant permissions to a security principal, which may be a user, group, or application service principal. The security principal is authenticated by Azure AD to return an OAuth 2.0 token. The token can then be used to authorize a request against the Table service.

Authorizing requests against Azure Storage with Azure AD provides superior security and ease of use over Shared Key authorization. Microsoft recommends using Azure AD authorization with your table applications when possible to minimize potential security vulnerabilities inherent in Shared Key.

Authorization with Azure AD is available for all general-purpose in all public regions and national clouds. Only storage accounts created with the Azure Resource Manager deployment model support Azure AD authorization.

> [!IMPORTANT]
> Authorization with Azure AD for tables is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Overview of Azure AD for tables

When a security principal (a user, group, or application) attempts to access a table resource, the request must be authorized. With Azure AD, access to a resource is a two-step process. First, the security principal's identity is authenticated and an OAuth 2.0 token is returned. Next, the token is passed as part of a request to the Table service and used by the service to authorize access to the specified resource.

The authentication step requires that an application request an OAuth 2.0 access token at runtime. If an application is running from within an Azure entity such as an Azure VM, a virtual machine scale set, or an Azure Functions app, it can use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to access tables. To learn how to authorize requests made by a managed identity to the Azure Table service, see [Authorize access to tables with Azure Active Directory and managed identities for Azure Resources](../common/storage-auth-aad-msi.md).

The authorization step requires that one or more Azure roles be assigned to the security principal. Azure Storage provides Azure roles that encompass common sets of permissions for table data. The roles that are assigned to a security principal determine the permissions that the principal will have. To learn more about assigning Azure roles for table access, see [Assign an Azure role for access to table data](assign-azure-role-data-access.md).

Native applications and web applications that make requests to the Azure Table service can also authorize access with Azure AD. To learn how to request an access token and use it to authorize requests for table data, see [Authorize access to Azure Storage with Azure AD from an Azure Storage application](../common/storage-auth-aad-app.md).

## Assign Azure roles for access rights

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of Azure built-in roles that encompass common sets of permissions used to access table data. You can also define custom roles for access to table data.

When an Azure role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of the subscription, the resource group, the storage account, or an individual table. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

### Azure built-in roles for tables

[!INCLUDE [storage-auth-rbac-roles-table-include](../../../includes/storage-auth-rbac-roles-table-include.md)]

To learn how to assign an Azure built-in role to a security principal, see [Assign an Azure role for access to table data](assign-azure-role-data-access.md).

For more information about how built-in roles are defined for Azure Storage, see [Understand role definitions](../../role-based-access-control/role-definitions.md#management-and-data-operations). For information about creating Azure custom roles, see [Azure custom roles](../../role-based-access-control/custom-roles.md).

### Access permissions for data operations

For details on the permissions required to call specific Table service operations, see [Permissions for calling data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

## Resource scope

[!INCLUDE [storage-auth-resource-scope-include](../../../includes/storage-auth-resource-scope-include.md)]

## Next steps

- [Authorize access to data in Azure Storage](../common/authorize-data-access.md)
- [Assign an Azure role for access to table data](assign-azure-role-data-access.md)