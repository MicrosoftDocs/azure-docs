---
title: Enable Azure Active Directory only authentication with Azure SQL
description: This article guides you through enabling the Azure Active Directory (Azure AD) only authentication feature with Azure SQL Database and Azure SQL Managed Instance.
ms.service: sql-db-mi
ms.subservice: security
ms.topic: tutorial
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 06/30/2021
---

# Tutorial: Enable Azure Active Directory only authentication with Azure SQL

[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

> [!NOTE]
> The **Azure AD-only authentication** feature discussed in this article is in **public preview**. 

This article guides you through enabling the [Azure AD-only authentication](authentication-azure-ad-only-authentication.md) feature within Azure SQL Database and Azure SQL Managed Instance. If you are looking to provision a SQL Database or Managed Instance with Azure AD-only authentication enabled, see [Create server with Azure AD-only authentication enabled in Azure SQL](authentication-azure-ad-only-authentication-create-server.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Assign role to enable Azure AD-only authentication
> - Enable Azure AD-only authentication using the Azure portal, Azure CLI, or PowerShell
> - Check whether Azure AD-only authentication is enabled
> - Test connecting to Azure SQL
> - Disable Azure AD-only authentication using the Azure portal, Azure CLI, or PowerShell


## Prerequisites

- An Azure AD instance. For more information, see [Configure and manage Azure AD authentication with Azure SQL](authentication-aad-configure.md).
- A SQL Database or SQL Managed Instance with a database, and logins or users. See [Quickstart: Create an Azure SQL Database single database](single-database-create-quickstart.md) if you haven't already created an Azure SQL Database, or [Quickstart: Create an Azure SQL Managed Instance](../managed-instance/instance-create-quickstart.md).

## Assign role to enable Azure AD-only authentication

In order to enable or disable Azure AD-only authentication, selected built-in roles are required for the Azure AD users executing these operations in this tutorial. We're going to assign the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role to the user in this tutorial.

For more information on how to assign a role to an Azure AD account, see [Assign administrator and non-administrator roles to users with Azure Active Directory](../../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md)

For more information on the required permission to enable or disable Azure AD-only authentication, see the [Permissions section of Azure AD-only authentication](authentication-azure-ad-only-authentication.md#permissions) article.

1. In our example, we'll assign the **SQL Security Manager** role to the user `UserSqlSecurityManager@contoso.onmicrosoft.com`. Using privileged user that can assign Azure AD roles, sign into the [Azure portal](https://portal.azure.com/).
1. Go to your SQL server resource, and select **Access control (IAM)** in the menu. Select the **Add** button and then **Add role assignment** in the drop-down menu.

   :::image type="content" source="media/authentication-azure-ad-only-authentication/azure-ad-only-authentication-access-control.png" alt-text="Access control pane in the Azure portal":::

1. In the **Add role assignment** pane, select the Role **SQL Security Manager**, and select the user that you want to have the ability to enable or disable Azure AD-only authentication.

   :::image type="content" source="media/authentication-azure-ad-only-authentication/azure-ad-only-authentication-access-control-add-role.png" alt-text="Add role assignment pane in the Azure portal":::

1. Click **Save**.

## Enable Azure AD-only authentication

# [Portal](#tab/azure-portal)

## Enable in SQL Database using Azure portal

To enable Azure AD-only authentication auth in the Azure portal, see the steps below.

1. Using the user with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role, go to the [Azure portal](https://portal.azure.com/).
1. Go to your SQL server resource, and select **Azure Active Directory** under the **Settings** menu.

   :::image type="content" source="media/authentication-azure-ad-only-authentication/azure-ad-only-authentication-portal.png" alt-text="Enable Azure AD only auth menu":::

1. If you haven't added an **Azure Active Directory admin**, you'll need to set this before you can enable Azure AD-only authentication.
1. Select the **Support only Azure Active Directory authentication for this server** checkbox.
1. The **Enable Azure AD authentication only** popup will show. Click **Yes** to enable the feature and **Save** the setting.

## Azure SQL Managed Instance

Managing Azure AD-only authentication for SQL Managed Instance in the portal is currently not supported.

# [The Azure CLI](#tab/azure-cli)

## Enable in SQL Database using Azure CLI

To enable Azure AD-only authentication in Azure SQL Database using Azure CLI, see the commands below. [Install the latest version of Azure CLI](/cli/azure/install-azure-cli-windows). You must have Azure CLI version **2.14.2** or higher. For more information on these commands, see [az sql server ad-only-auth](/cli/azure/sql/server/ad-only-auth).

For more information on managing Azure AD-only authentication using APIs, see [Managing Azure AD-only authentication using APIs](authentication-azure-ad-only-authentication.md#managing-azure-ad-only-authentication-using-apis).

> [!NOTE]
> The Azure AD admin must be set for the server before enabling Azure AD-only authentication. Otherwise, the Azure CLI command will fail.
>
> For permissions and actions required of the user performing these commands to enable Azure AD-only authentication, see the [Azure AD-only authentication](authentication-azure-ad-only-authentication.md#permissions) article.

1. [Sign into Azure](/cli/azure/authenticate-azure-cli) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role.

   ```azurecli
   az login
   ```

1. Run the following command, replacing `<myserver>` with your SQL server name, and `<myresource>` with your Azure Resource that holds the SQL server.

   ```azurecli
   az sql server ad-only-auth enable --resource-group <myresource> --name <myserver>
   ```

## Enable in SQL Managed Instance using Azure CLI

To enable Azure AD-only authentication in Azure SQL Managed Instance using Azure CLI, see the commands below. [Install the latest version of Azure CLI](/cli/azure/install-azure-cli-windows). 

1. [Sign into Azure](/cli/azure/authenticate-azure-cli) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role.

   ```azurecli
   az login
   ```

1. Run the following command, replacing `<myserver>` with your SQL server name, and `<myresource>` with your Azure Resource that holds the SQL server.

   ```azurecli
   az sql mi ad-only-auth enable --resource-group <myresource> --name <myserver>
   ```

# [PowerShell](#tab/azure-powershell)

## Enable in SQL Database using PowerShell

To enable Azure AD-only authentication in Azure SQL Database using PowerShell, see the commands below. [Az.Sql 2.10.0](https://www.powershellgallery.com/packages/Az.Sql/2.10.0) module or higher is required to execute these commands. For more information on these commands, see [Enable-AzSqlInstanceActiveDirectoryOnlyAuthentication](/powershell/module/az.sql/enable-azsqlinstanceactivedirectoryonlyauthentication).

For more information on managing Azure AD-only authentication using APIs, see [Managing Azure AD-only authentication using APIs](authentication-azure-ad-only-authentication.md#managing-azure-ad-only-authentication-using-apis)

> [!NOTE]
> The Azure AD admin must be set for the server before enabling Azure AD-only authentication. Otherwise, the PowerShell command will fail.
>
> For permissions and actions required of the user performing these commands to enable Azure AD-only authentication, see the [Azure AD-only authentication](authentication-azure-ad-only-authentication.md#permissions) article. If the user has insufficient permissions, you will get the following error:
>
> ```output
> Enable-AzSqlServerActiveDirectoryOnlyAuthentication : The client
> 'UserSqlServerContributor@contoso.onmicrosoft.com' with object id
> '<guid>' does not have authorization to perform
> action 'Microsoft.Sql/servers/azureADOnlyAuthentications/write' over scope
> '/subscriptions/<guid>...'
> ```

1. [Sign into Azure](/powershell/azure/authenticate-azureps) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role.

   ```powershell
   Connect-AzAccount
   ```

1. Run the following command, replacing `<myserver>` with your SQL server name, and `<myresource>` with your Azure Resource that holds the SQL server.

   ```powershell
   Enable-AzSqlServerActiveDirectoryOnlyAuthentication -ServerName <myserver>  -ResourceGroupName <myresource>
   ```

## Enable in SQL Managed Instance using PowerShell

To enable Azure AD-only authentication in Azure SQL Managed Instance using PowerShell, see the commands below. [Az.Sql 2.10.0](https://www.powershellgallery.com/packages/Az.Sql/2.10.0) module or higher is required to execute these commands. 

For more information on managing Azure AD-only authentication using APIs, see [Managing Azure AD-only authentication using APIs](authentication-azure-ad-only-authentication.md#managing-azure-ad-only-authentication-using-apis).


1. [Sign into Azure](/powershell/azure/authenticate-azureps) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role.

   ```powershell
   Connect-AzAccount
   ```

1. Run the following command, replacing `<myinstance>` with your SQL Managed Instance name, and `<myresource>` with your Azure Resource that holds the SQL managed instance.

   ```powershell
   Enable-AzSqlInstanceActiveDirectoryOnlyAuthentication -InstanceName <myinstance> -ResourceGroupName <myresource>
   ```

---

## Check the Azure AD-only authentication status

Check whether Azure AD-only authentication is enabled for your server or instance.

# [Portal](#tab/azure-portal)

Go to your **SQL server** resource in the [Azure portal](https://portal.azure.com/). Select **Azure Active Directory** under the **Settings** menu. Portal support for Azure AD-only authentication is only available for Azure SQL Database.

# [The Azure CLI](#tab/azure-cli)

These commands can be used to check whether Azure AD-only authentication is enabled for your SQL Database logical server or SQL managed instance. Members of the [SQL Server Contributor](../../role-based-access-control/built-in-roles.md#sql-server-contributor) and [SQL Managed Instance Contributor](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) roles can use these commands to check the status of Azure AD-only authentication, but can't enable or disable the feature.

## Check status in SQL Database

1. [Sign into Azure](/cli/azure/authenticate-azure-cli) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role. For more information on managing Azure AD-only authentication using APIs, see [Managing Azure AD-only authentication using APIs](authentication-azure-ad-only-authentication.md#managing-azure-ad-only-authentication-using-apis)

   ```azurecli
   az login
   ```

1. Run the following command, replacing `<myserver>` with your SQL server name, and `<myresource>` with your Azure Resource that holds the SQL server.

   ```azurecli
   az sql server ad-only-auth get --resource-group <myresource> --name <myserver>
   ```

1. You should see the following output:

   ```json
   {
    "azureAdOnlyAuthentication": true,
    "/subscriptions/<guid>/resourceGroups/mygroup/providers/Microsoft.Sql/servers/myserver/azureADOnlyAuthentications/Default",
    "name": "Default",
    "resourceGroup": "myresource",
    "type": "Microsoft.Sql/servers"
   }
   ```

## Check status in SQL Managed Instance

1. [Sign into Azure](/cli/azure/authenticate-azure-cli) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role.

   ```azurecli
   az login
   ```

1. Run the following command, replacing `<myserver>` with your SQL server name, and `<myresource>` with your Azure Resource that holds the SQL server.

   ```azurecli
   az sql mi ad-only-auth get --resource-group <myresource> --name <myserver>
   ```

1. You should see the following output:

   ```json
   {
    "azureAdOnlyAuthentication": true,
    "id": "/subscriptions/<guid>/resourceGroups/myresource/providers/Microsoft.Sql/managedInstances/myinstance/azureADOnlyAuthentications/Default",
    "name": "Default",
    "resourceGroup": "myresource",
    "type": "Microsoft.Sql/managedInstances"
   }
   ```

# [PowerShell](#tab/azure-powershell)

These commands can be used to check whether Azure AD-only authentication is enabled for your SQL Database logical server or SQL managed instance. Members of the [SQL Server Contributor](../../role-based-access-control/built-in-roles.md#sql-server-contributor) and [SQL Managed Instance Contributor](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) roles can use these commands to check the status of Azure AD-only authentication, but can't enable or disable the feature.

The status will return **True** if the feature is enabled, and **False** if disabled.

## Check status in SQL Database

1. [Sign into Azure](/powershell/azure/authenticate-azureps) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role. For more information on managing Azure AD-only authentication using APIs, see [Managing Azure AD-only authentication using APIs](authentication-azure-ad-only-authentication.md#managing-azure-ad-only-authentication-using-apis)

   ```powershell
   Connect-AzAccount
   ```

1. Run the following command, replacing `<myserver>` with your SQL server name, and `<myresource>` with your Azure Resource that holds the SQL server.

   ```powershell
   Get-AzSqlServerActiveDirectoryOnlyAuthentication  -ServerName <myserver> -ResourceGroupName <myresource>
   ```

## Check status in SQL Managed Instance

1. [Sign into Azure](/powershell/azure/authenticate-azureps) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role.

   ```powershell
   Connect-AzAccount
   ```

1. Run the following command, replacing `<myinstance>` with your SQL Managed Instance name, and `<myresource>` with your Azure Resource that holds the SQL managed instance.

   ```powershell
   Get-AzSqlInstanceActiveDirectoryOnlyAuthentication -InstanceName <myinstance> -ResourceGroupName <myresource>
   ```

---

## Test SQL authentication with connection failure

After enabling Azure AD-only authentication, test with [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) to [connect to your SQL Database or Managed Instance](connect-query-ssms.md). Use SQL authentication for the connection.

You should see a login failed message similar to the following output:

```output
Cannot connect to <myserver>.database.windows.net.
Additional information:
  Login failed for user 'username'. Reason: Azure Active Directory only authentication is enabled.
  Please contact your system administrator. (Microsoft SQL Server, Error: 18456)
```

## Disable Azure AD-only authentication

By disabling the Azure AD-only authentication feature, you allow both SQL authentication and Azure AD authentication for Azure SQL.

# [Portal](#tab/azure-portal)

1. Using the user with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role, go to the [Azure portal](https://portal.azure.com/).
1. Go to your SQL server resource, and select **Azure Active Directory** under the **Settings** menu.
1. To disable the Azure AD-only authentication feature, uncheck the **Support only Azure Active Directory authentication for this server** checkbox and **Save** the setting.

Managing Azure AD-only authentication for SQL Managed Instance in the portal is currently not supported.

# [The Azure CLI](#tab/azure-cli)

## Disable in SQL Database using Azure CLI

To disable Azure AD-only authentication in Azure SQL Database using Azure CLI, see the commands below. 

1. [Sign into Azure](/cli/azure/authenticate-azure-cli) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role.

   ```azurecli
   az login
   ```

1. Run the following command, replacing `<myserver>` with your SQL server name, and `<myresource>` with your Azure Resource that holds the SQL server.

   ```azurecli
   az sql server ad-only-auth disable --resource-group <myresource> --name <myserver>
   ```

1. After disabling Azure AD-only authentication, you should see the following output when you check the status:

   ```json
   {
    "azureAdOnlyAuthentication": false,
    "/subscriptions/<guid>/resourceGroups/mygroup/providers/Microsoft.Sql/servers/myserver/azureADOnlyAuthentications/Default",
    "name": "Default",
    "resourceGroup": "myresource",
    "type": "Microsoft.Sql/servers"
   }
   ```

## Disable in SQL Managed Instance using Azure CLI

To disable Azure AD-only authentication in Azure SQL Managed Instance using Azure CLI, see the commands below. 

1. [Sign into Azure](/cli/azure/authenticate-azure-cli) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role.

   ```azurecli
   az login
   ```

1. Run the following command, replacing `<myserver>` with your SQL server name, and `<myresource>` with your Azure Resource that holds the SQL server.

   ```azurecli
   az sql mi ad-only-auth disable --resource-group <myresource> --name <myserver>
   ```

1. After disabling Azure AD-only authentication, you should see the following output when you check the status:

   ```json
   {
    "azureAdOnlyAuthentication": false,
    "id": "/subscriptions/<guid>/resourceGroups/myresource/providers/Microsoft.Sql/managedInstances/myinstance/azureADOnlyAuthentications/Default",
    "name": "Default",
    "resourceGroup": "myresource",
    "type": "Microsoft.Sql/managedInstances"
   }
   ```

# [PowerShell](#tab/azure-powershell)

## Disable in SQL Database using PowerShell

To disable Azure AD-only authentication in Azure SQL Database using PowerShell, see the commands below.

1. [Sign into Azure](/powershell/azure/authenticate-azureps) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role.

   ```powershell
   Connect-AzAccount
   ```

1. Run the following command, replacing `<myserver>` with your SQL server name, and `<myresource>` with your Azure Resource that holds the SQL server.

   ```powershell
   Disable-AzSqlServerActiveDirectoryOnlyAuthentication -ServerName <myserver>  -ResourceGroupName <myresource>
   ```

## Disable in SQL Managed Instance using PowerShell

To disable Azure AD-only authentication in Azure SQL Managed Instance using PowerShell, see the commands below.

1. [Sign into Azure](/powershell/azure/authenticate-azureps) using the account with the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role.

   ```powershell
   Connect-AzAccount
   ```

1. Run the following command, replacing `<myinstance>` with your SQL Managed Instance name, and `<myresource>` with your Azure Resource that holds the SQL managed instance.

   ```powershell
   Disable-AzSqlInstanceActiveDirectoryOnlyAuthentication -InstanceName <myinstance> -ResourceGroupName <myresource>
   ```

---

## Test connecting to Azure SQL again

After disabling Azure AD-only authentication, test connecting using a SQL authentication login. You should now be able to connect to your server or instance.

## Next steps

- [Azure AD-only authentication with Azure SQL](authentication-azure-ad-only-authentication.md)
- [Create server with Azure AD-only authentication enabled in Azure SQL](authentication-azure-ad-only-authentication-create-server.md)
