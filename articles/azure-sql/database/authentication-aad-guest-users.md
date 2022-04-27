---
title: Create Azure AD guest users
description: How to create Azure AD guest users and set them as Azure AD admin without using Azure AD groups in Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics
ms.service: sql-db-mi
ms.subservice: security
ms.custom: azure-synapse
ms.topic: how-to
author: GithubMirek
ms.author: mireks
ms.reviewer: kendralittle, vanto, mathoma
ms.date: 05/10/2021
---

# Create Azure AD guest users and set as an Azure AD admin

[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

Guest users in Azure Active Directory (Azure AD) are users that have been imported into the current Azure AD from other Azure Active Directories, or outside of it. For example, guest users can include users from other Azure Active Directories, or from accounts like *\@outlook.com*, *\@hotmail.com*, 
*\@live.com*, or *\@gmail.com*. 

This article demonstrates how to create an Azure AD guest user and set that user as an Azure AD admin for Azure SQL Managed Instance or the [logical server in Azure](logical-servers.md) used by Azure SQL Database and Azure Synapse Analytics, without having to add the guest user to a group inside Azure AD.

## Feature description

This feature lifts the current limitation that only allows guest users to connect to Azure SQL Database, SQL Managed Instance, or Azure Synapse Analytics when they're members of a group created in Azure AD. The group needed to be mapped to a user manually using the [CREATE USER (Transact-SQL)](/sql/t-sql/statements/create-user-transact-sql) statement in a given database. Once a database user has been created for the Azure AD group containing the guest user, the guest user can sign into the database using Azure Active Directory with MFA authentication. Guest users can be created and connect directly to SQL Database, SQL Managed Instance, or Azure Synapse without the requirement of adding them to an Azure AD group first, and then creating a database user for that Azure AD group.

As part of this feature, you also have the ability to set the Azure AD guest user directly as an AD admin for the logical server or for a managed instance. The existing functionality (which allows the guest user to be part of an Azure AD group that can then be set as the Azure AD admin for the logical server or managed instance) is *not* impacted. Guest users in the database that are a part of an Azure AD group are also not impacted by this change.

For more information about existing support for guest users using Azure AD groups, see [Using multi-factor Azure Active Directory authentication](authentication-mfa-ssms-overview.md).

## Prerequisite

- [Az.Sql 2.9.0](https://www.powershellgallery.com/packages/Az.Sql/2.9.0) module or higher is needed when using PowerShell to set a guest user as an Azure AD admin for the logical server or managed instance.

## Create database user for Azure AD guest user 

Follow these steps to create a database user using an Azure AD guest user.

### Create guest user in SQL Database and Azure Synapse

1. Ensure that the guest user (for example, `user1@gmail.com`) is already added into your Azure AD and an Azure AD admin has been set for the database server. Having an Azure AD admin is required for Azure Active Directory authentication.

1. Connect to the SQL database as the Azure AD admin or an Azure AD user with sufficient SQL permissions to create users, and run the below command on the database where the guest user needs to be added:

    ```sql
    CREATE USER [user1@gmail.com] FROM EXTERNAL PROVIDER
    ```

1. There should now be a database user created for the guest user `user1@gmail.com`.

1. Run the below command to verify the database user got created successfully:

    ```sql
    SELECT * FROM sys.database_principals
    ```

1. Disconnect and sign into the database as the guest user `user1@gmail.com` using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) using the authentication method **Azure Active Directory - Universal with MFA**. For more information, see [Using multi-factor Azure Active Directory authentication](authentication-mfa-ssms-overview.md).

### Create guest user in SQL Managed Instance

> [!NOTE]
> SQL Managed Instance supports logins for Azure AD users, as well as Azure AD contained database users. The below steps show how to create a login and user for an Azure AD guest user in SQL Managed Instance. You can also choose to create a [contained database user](/sql/relational-databases/security/contained-database-users-making-your-database-portable) in SQL Managed Instance by using the method in the [Create guest user in SQL Database and Azure Synapse](#create-guest-user-in-sql-database-and-azure-synapse) section.

1. Ensure that the guest user (for example, `user1@gmail.com`) is already added into your Azure AD and an Azure AD admin has been set for the SQL Managed Instance server. Having an Azure AD admin is required for Azure Active Directory authentication.

1. Connect to the SQL Managed Instance server as the Azure AD admin or an Azure AD user with sufficient SQL permissions to create users, and run the following command on the `master` database to create a login for the guest user:

    ```sql
    CREATE LOGIN [user1@gmail.com] FROM EXTERNAL PROVIDER
    ```

1. There should now be a login created for the guest user `user1@gmail.com` in the `master` database.

1. Run the below command to verify the login got created successfully:

    ```sql
    SELECT * FROM sys.server_principals
    ```

1. Run the below command on the database where the guest user needs to be added: 

    ```sql
    CREATE USER [user1@gmail.com] FROM LOGIN [user1@gmail.com]
    ```

1. There should now be a database user created for the guest user `user1@gmail.com`.

1. Disconnect and sign into the database as the guest user `user1@gmail.com` using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) using the authentication method **Azure Active Directory - Universal with MFA**. For more information, see [Using multi-factor Azure Active Directory authentication](authentication-mfa-ssms-overview.md).

## Setting a guest user as an Azure AD admin

Set the Azure AD admin using either the Azure portal, Azure PowerShell, or the Azure CLI. 

### Azure portal 

To setup an Azure AD admin for a logical server or a managed instance using the Azure portal, follow these steps: 

1. Open the [Azure portal](https://portal.azure.com). 
1. Navigate to your SQL server or managed instance **Azure Active Directory** settings. 
1. Select **Set Admin**. 
1. In the Azure AD pop-up prompt, type the guest user, such as `guestuser@gmail.com`. 
1. Select this new user, and then save the operation. 

For more information, see [Setting Azure AD admin](authentication-aad-configure.md#azure-ad-admin-with-a-server-in-sql-database). 


### Azure PowerShell (SQL Database and Azure Synapse)

To setup an Azure AD guest user for a logical server, follow these steps:  

1. Ensure that the guest user (for example, `user1@gmail.com`) is already added into your Azure AD.

1. Run the following PowerShell command to add the guest user as the Azure AD admin for your logical server:

    - Replace `<ResourceGroupName>` with your Azure Resource Group name that contains the logical server.
    - Replace `<ServerName>` with your logical server name. If your server name is `myserver.database.windows.net`, replace `<Server Name>` with `myserver`.
    - Replace `<DisplayNameOfGuestUser>` with your guest user name.

    ```powershell
    Set-AzSqlServerActiveDirectoryAdministrator -ResourceGroupName <ResourceGroupName> -ServerName <ServerName> -DisplayName <DisplayNameOfGuestUser>
    ```

You can also use the Azure CLI command [az sql server ad-admin](/cli/azure/sql/server/ad-admin) to set the guest user as an Azure AD admin for your logical server.

### Azure PowerShell (SQL Managed Instance)

To setup an Azure AD guest user for a managed instance, follow these steps:  

1. Ensure that the guest user (for example, `user1@gmail.com`) is already added into your Azure AD.

1. Go to the [Azure portal](https://portal.azure.com), and go to your **Azure Active Directory** resource. Under **Manage**, go to the **Users** pane. Select your guest user, and record the `Object ID`. 

1. Run the following PowerShell command to add the guest user as the Azure AD admin for your SQL Managed Instance:

    - Replace `<ResourceGroupName>` with your Azure Resource Group name that contains the SQL Managed Instance.
    - Replace `<ManagedInstanceName>` with your SQL Managed Instance name.
    - Replace `<DisplayNameOfGuestUser>` with your guest user name.
    - Replace `<AADObjectIDOfGuestUser>` with the `Object ID` gathered earlier.

    ```powershell
    Set-AzSqlInstanceActiveDirectoryAdministrator -ResourceGroupName <ResourceGroupName> -InstanceName "<ManagedInstanceName>" -DisplayName <DisplayNameOfGuestUser> -ObjectId <AADObjectIDOfGuestUser>
    ```

You can also use the Azure CLI command [az sql mi ad-admin](/cli/azure/sql/mi/ad-admin) to set the guest user as an Azure AD admin for your managed instance.


## Next steps

- [Configure and manage Azure AD authentication with Azure SQL](authentication-aad-configure.md)
- [Using multi-factor Azure Active Directory authentication](authentication-mfa-ssms-overview.md)
- [CREATE USER (Transact-SQL)](/sql/t-sql/statements/create-user-transact-sql)