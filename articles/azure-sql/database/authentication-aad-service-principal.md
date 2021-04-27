---
title: Azure Active Directory service principal with Azure SQL
description: Azure AD Applications (service principals) support Azure AD user creation in Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics
ms.service: sql-db-mi
ms.subservice: security
ms.custom: azure-synapse
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 02/11/2021
---

# Azure Active Directory service principal with Azure SQL

[!INCLUDE[appliesto-sqldb-sqlmi-asa](../includes/appliesto-sqldb-sqlmi-asa.md)]

Support for Azure Active Directory (Azure AD) user creation in Azure SQL Database (SQL DB) and [Azure Synapse Analytics](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) on behalf of Azure AD applications (service principals) are currently in **public preview**.

> [!NOTE]
> This functionality is already supported for SQL Managed Instance.

## Service principal (Azure AD applications) support

This article applies to applications that are integrated with Azure AD, and are part of Azure AD registration. These applications often need authentication and authorization access to Azure SQL to perform various tasks. This feature in **public preview** now allows service principals to create Azure AD users in SQL Database and Azure Synapse. There was a limitation preventing Azure AD object creation on behalf of Azure AD applications that was removed.

When an Azure AD application is registered using the Azure portal or a PowerShell command, two objects are created in the Azure AD tenant:

- An application object
- A service principal object

For more information on Azure AD applications, see [Application and service principal objects in Azure Active Directory](../../active-directory/develop/app-objects-and-service-principals.md) and [Create an Azure service principal with Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps).

SQL Database, Azure Synapse, and SQL Managed Instance support the following Azure AD objects:

- Azure AD users (managed, federated, and guest)
- Azure AD groups (managed and federated)
- Azure AD applications 

The T-SQL command `CREATE USER [Azure_AD_Object] FROM EXTERNAL PROVIDER` on behalf of an Azure AD application is now supported for SQL Database and Azure Synapse.

## Functionality of Azure AD user creation using service principals

Supporting this functionality is useful in Azure AD application automation processes where Azure AD objects are created and maintained in SQL Database and Azure Synapse without human interaction. Service principals can be an Azure AD admin for the SQL logical server, as part of a group or an individual user. The application can automate Azure AD object creation in SQL Database and Azure Synapse when executed as a system administrator, and does not require any additional SQL privileges. This allows for a full automation of a database user creation. This feature is also supported for system-assigned managed identity and user-assigned managed identity. For more information, see [What are managed identities for Azure resources?](../../active-directory/managed-identities-azure-resources/overview.md)

## Enable service principals to create Azure AD users

To enable an Azure AD object creation in SQL Database and Azure Synapse on behalf of an Azure AD application, the following settings are required:

1. Assign the server identity. The assigned server identity represents the Managed Service Identity (MSI). Currently, the server identity for Azure SQL does not support User Managed Identity (UMI).
    - For a new Azure SQL logical server, execute the following PowerShell command:
    
    ```powershell
    New-AzSqlServer -ResourceGroupName <resource group> -Location <Location name> -ServerName <Server name> -ServerVersion "12.0" -SqlAdministratorCredentials (Get-Credential) -AssignIdentity
    ```

    For more information, see the [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) command.

    - For existing Azure SQL Logical servers, execute the following command:
    
    ```powershell
    Set-AzSqlServer -ResourceGroupName <resource group> -ServerName <Server name> -AssignIdentity
    ```

    For more information, see the [Set-AzSqlServer](/powershell/module/az.sql/set-azsqlserver) command.

    - To check if the server identity is assigned to the server, execute the Get-AzSqlServer command.

    > [!NOTE]
    > Server identity can be assigned using CLI commands as well. For more information, see [az sql server create](/cli/azure/sql/server#az_sql_server_create) and [az sql server update](/cli/azure/sql/server#az_sql_server_update).

2. Grant the Azure AD [**Directory Readers**](../../active-directory/roles/permissions-reference.md#directory-readers) permission to the server identity created or assigned to the server.
    - To grant this permission, follow the description used for SQL Managed Instance that is available in the following article: [Provision Azure AD admin (SQL Managed Instance)](authentication-aad-configure.md?tabs=azure-powershell#provision-azure-ad-admin-sql-managed-instance)
    - The Azure AD user who is granting this permission must be part of the Azure AD **Global Administrator** or **Privileged Roles Administrator** role.

> [!IMPORTANT]
> Steps 1 and 2 must be executed in the above order. First, create or assign the server identity, followed by granting the [**Directory Readers**](../../active-directory/roles/permissions-reference.md#directory-readers) permission. Omitting one of these steps, or both will cause an execution error during an Azure AD object creation in Azure SQL on behalf of an Azure AD application.
>
> If you are using the service principal to set or unset the Azure AD admin, the application must also have the [Directory.Read.All](/graph/permissions-reference#application-permissions-18) Application API permission in Azure AD. For more information on [permissions required to set an Azure AD admin](authentication-aad-service-principal-tutorial.md#permissions-required-to-set-or-unset-the-azure-ad-admin), and step by step instructions to create an Azure AD user on behalf of an Azure AD application, see [Tutorial: Create Azure AD users using Azure AD applications](authentication-aad-service-principal-tutorial.md).
>
> In **public preview**, you can assign the **Directory Readers** role to a group in Azure AD. The group owners can then add the managed identity as a member of this group, which would bypass the need for a **Global Administrator** or **Privileged Roles Administrator** to grant the **Directory Readers** role. For more information on this feature, see [Directory Readers role in Azure Active Directory for Azure SQL](authentication-aad-directory-readers-role.md).

## Troubleshooting and limitations for public preview

- When creating Azure AD objects in Azure SQL on behalf of an Azure AD application without enabling server identity and granting **Directory Readers** permission, the operation will fail with the following possible errors. The example error below is for a PowerShell command execution to create a SQL Database user `myapp` in the article [Tutorial: Create Azure AD users using Azure AD applications](authentication-aad-service-principal-tutorial.md).
    - `Exception calling "ExecuteNonQuery" with "0" argument(s): "'myapp' is not a valid login or you do not have permission. Cannot find the user 'myapp', because it does not exist, or you do not have permission."`
    - `Exception calling "ExecuteNonQuery" with "0" argument(s): "Principal 'myapp' could not be resolved.`
    - `User or server identity does not have permission to read from Azure Active Directory.`
      - For the above error, follow the steps to [Assign an identity to the Azure SQL logical server](authentication-aad-service-principal-tutorial.md#assign-an-identity-to-the-azure-sql-logical-server) and [Assign Directory Readers permission to the SQL logical server identity](authentication-aad-service-principal-tutorial.md#assign-directory-readers-permission-to-the-sql-logical-server-identity).
    > [!NOTE]
    > The error messages indicated above will be changed before the feature GA to clearly identify the missing setup requirement for Azure AD application support.
- Setting the Azure AD application as an Azure AD admin for SQL Managed Instance is only supported using the CLI command, and PowerShell command with [Az.Sql 2.9.0](https://www.powershellgallery.com/packages/Az.Sql/2.9.0) or higher. For more information, see the [az sql mi ad-admin create](/cli/azure/sql/mi/ad-admin#az_sql_mi_ad_admin_create) and [Set-AzSqlInstanceActiveDirectoryAdministrator](/powershell/module/az.sql/set-azsqlinstanceactivedirectoryadministrator) commands. 
    - If you want to use the Azure portal for SQL Managed Instance to set the Azure AD admin, a possible workaround is to create an Azure AD group. Then add the service principal (Azure AD application) to this group, and set this group as an Azure AD admin for the SQL Managed Instance.
    - Setting the service principal (Azure AD application) as an Azure AD admin for SQL Database and Azure Synapse is supported using the Azure portal, [PowerShell](authentication-aad-configure.md?tabs=azure-powershell#powershell-for-sql-database-and-azure-synapse), and [CLI](authentication-aad-configure.md?tabs=azure-cli#powershell-for-sql-database-and-azure-synapse) commands.
- Using an Azure AD application with service principal from another Azure AD tenant will fail when accessing SQL Database or SQL Managed Instance created in a different tenant. A service principal assigned to this application must be from the same tenant as the SQL logical server or Managed Instance.
- [Az.Sql 2.9.0](https://www.powershellgallery.com/packages/Az.Sql/2.9.0) module or higher is needed when using PowerShell to set up an individual Azure AD application as Azure AD admin for Azure SQL. Ensure you are upgraded to the latest module.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Create Azure AD users using Azure AD applications](authentication-aad-service-principal-tutorial.md)
