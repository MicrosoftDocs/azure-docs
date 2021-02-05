---
title: Directory Readers role in Azure Active Directory for Azure SQL
description: Learn about the directory reader's role in Azure AD for Azure SQL.
ms.service: sql-db-mi
ms.subservice: security
ms.custom: azure-synapse
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 08/14/2020
---

# Directory Readers role in Azure Active Directory for Azure SQL

[!INCLUDE[appliesto-sqldb-sqlmi-asa](../includes/appliesto-sqldb-sqlmi-asa.md)]

> [!NOTE]
> This feature in this article is in **public preview**.

Azure Active Directory (Azure AD) has introduced [using cloud groups to manage role assignments in Azure Active Directory (preview)](../../active-directory/roles/groups-concept.md). This allows for Azure AD roles to be assigned to groups.

When enabling a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) for Azure SQL Database, Azure SQL Managed Instance, or Azure Synapse Analytics, the Azure AD [**Directory Readers**](../../active-directory/roles/permissions-reference.md#directory-readers) role must be assigned to the identity to allow read access to the [Azure AD Graph API](../../active-directory/develop/active-directory-graph-api.md). The managed identity of SQL Database and Azure Synapse is referred to as the server identity. The managed identity of SQL Managed Instance is referred to as the managed instance identity, and is automatically assigned when the instance is created. For more information on assigning a server identity to SQL Database or Azure Synapse, see [Enable service principals to create Azure AD users](authentication-aad-service-principal.md#enable-service-principals-to-create-azure-ad-users).

The **Directory Readers** role is necessary to:

- Create Azure AD logins for SQL Managed Instance
- Impersonate Azure AD users in Azure SQL
- Migrate SQL Server users that use Windows authentication to SQL Managed Instance with Azure AD authentication (using the [ALTER USER (Transact-SQL)](/sql/t-sql/statements/alter-user-transact-sql?view=azuresqldb-mi-current#d-map-the-user-in-the-database-to-an-azure-ad-login-after-migration) command)
- Change the Azure AD admin for SQL Managed Instance
- Allow [service principals (Applications)](authentication-aad-service-principal.md) to create Azure AD users in Azure SQL

## Assigning the Directory Readers role

In order to assign the [**Directory Readers**](../../active-directory/roles/permissions-reference.md#directory-readers) role to an identity, a user with [Global Administrator](../../active-directory/roles/permissions-reference.md#global-administrator) or [Privileged Role Administrator](../../active-directory/roles/permissions-reference.md#privileged-role-administrator) permissions is needed. Users who often manage or deploy SQL Database, SQL Managed Instance, or Azure Synapse may not have access to these highly privileged roles. This can often cause complications for users that create unplanned Azure SQL resources, or need help from highly privileged role members that are often inaccessible in large organizations.

For SQL Managed Instance, the **Directory Readers** role must be assigned to managed instance identity before you can [set up an Azure AD admin for the managed instance](authentication-aad-configure.md#provision-azure-ad-admin-sql-managed-instance). 

Assigning the **Directory Readers** role to the server identity isn't required for SQL Database or Azure Synapse when setting up an Azure AD admin for the logical server. However, to enable an Azure AD object creation in SQL Database or Azure Synapse on behalf of an Azure AD application, the **Directory Readers** role is required. If the role isn't assigned to the SQL logical server identity, creating Azure AD users in Azure SQL will fail. For more information, see [Azure Active Directory service principal with Azure SQL](authentication-aad-service-principal.md).

## Granting the Directory Readers role to an Azure AD group

Currently in **public preview**, you can now have a [Global Administrator](../../active-directory/roles/permissions-reference.md#global-administrator) or [Privileged Role Administrator](../../active-directory/roles/permissions-reference.md#privileged-role-administrator) create an Azure AD group and assign the [**Directory Readers**](../../active-directory/roles/permissions-reference.md#directory-readers) permission to the group. This will allow access to the Azure AD Graph API for members of this group. In addition, Azure AD users who are owners of this group are allowed to assign new members for this group, including identities of the Azure SQL logical servers.

This solution still requires a high privilege user (Global Administrator or Privileged Role Administrator) to create a group and assign users as a one time activity, but the Azure AD group owners will be able to assign additional members going forward. This eliminates the need to involve a high privilege user in the future to configure all SQL Databases, SQL Managed Instances, or Azure Synapse servers in their Azure AD tenant.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Assign Directory Readers role to an Azure AD group and manage role assignments](authentication-aad-directory-readers-role-tutorial.md)