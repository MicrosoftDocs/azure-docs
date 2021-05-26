---
title: Azure Active Directory only authentication with Azure SQL
description: This article provides information on the Azure Active Directory (Azure AD) only authentication feature with Azure SQL Database and Azure SQL Managed Instance.
ms.service: sql-db-mi
ms.subservice: security
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 06/01/2021
---

# Azure AD-only authentication with Azure SQL

[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

> [!NOTE]
> The **Azure AD-only authentication** feature discussed in this article is in **public preview**. 

Azure AD-only authentication is a feature within [Azure SQL](../azure-sql-iaas-vs-paas-what-is-overview.md) that allows the service to only support Azure AD authentication, and is supported for [Azure SQL Database](sql-database-paas-overview.md) and [Azure SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md). SQL authentication is disabled when enabling Azure AD-only authentication in the Azure SQL environment, including connections from SQL server administrators, logins, and users. Only users using [Azure AD authentication](authentication-aad-overview.md) is authorized to connect to the server or database.

Azure AD-only authentication can be enabled or disabled using the Azure portal, Azure CLI, PowerShell, or REST API. Azure AD-only authentication can also be configured during server creation with an ARM template.

For more information on Azure SQL authentication, see [Authentication and authorization](logins-create-manage.md#authentication-and-authorization).

> [!IMPORTANT]
> Currently, you cannot manage Azure AD-only authentication in the Azure portal for Azure SQL Managed Instance. For a tutorial on different methods to enable Azure AD-only authentication, see [Tutorial: Enable Azure Active Directory only authentication with Azure SQL](authentication-aad-only-auth-tutorial.md).

## Feature description

When enabling Azure AD-only authentication, [SQL authentication]((logins-create-manage.md#authentication-and-authorization)) is disabled at the server level and prevents any authentication based on any SQL authentication credentials. SQL authentication users won't be able to connect to the Azure SQL logical server, including all of its databases. Although SQL authentication is disabled, new SQL authentication logins and users can still be created by Azure AD accounts with proper permissions. Newly created SQL authentication accounts won't be allowed to connect to the server. Enabling Azure AD-only authentication doesn't remove existing SQL authentication login and user accounts. The feature only prevents these accounts from connecting to the server, and any database created for this server.

:::image type="content" source="media/authentication-aad-only-auth/aad-only-auth-portal.png" alt-text="Enable Azure AD only auth menu":::

## Permissions

Azure AD-only authentication can be enabled or disabled by Azure AD users who are members of high privileged [Azure AD built-in roles](../../role-based-access-control/built-in-roles.md), such as Azure subscription [Owners](../../role-based-access-control/built-in-roles.md#owner), [Contributors](../../role-based-access-control/built-in-roles.md#contributor), and [Global Administrators](../../active-directory/roles/permissions-reference.md#global-administrator). Additionally, the role [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) can also enable or disable the Azure AD-only authentication feature.

The [SQL Server Contributor](../../role-based-access-control/built-in-roles.md#sql-server-contributor) and [SQL Managed Instance Contributor](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) roles won't have permissions to enable or disable the Azure AD-only authentication feature. This is consistent with the [Separation of Duties](security-best-practice.md#implement-separation-of-duties) approach, where users who can create an Azure SQL server or create an Azure AD admin, can't enable or disable security features.

### Actions required

The following actions are added to the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role to allow management of the Azure AD-only authentication feature.

- Microsoft.Sql/servers/azureADOnlyAuthentications/*
- Microsoft.Sql/servers/administrators/read - required only for users accessing the Azure portal **Azure Active Directory** menu
- Microsoft.Sql/managedInstances/azureADOnlyAuthentications/*
- Microsoft.Sql/managedInstances/read

## Managing Azure AD-only authentication using APIs

# [Azure CLI](#tab/azure-cli)

`name` corresponds to the prefix of the server or instance name (for example, `myserver`) and `resource-group` corresponds to the resource the server belongs to (for example, `myresource`).

## Azure SQL Database

### Enable or disable in SQL Database

**Enable**

```azurecli
az sql server ad-only-auth enable --resource-group myresource --name myserver
```

**Disable**

```azurecli
az sql server ad-only-auth disable --resource-group myresource --name myserver
```

### Check the status in SQL Database

```azurecli
az sql server ad-only-auth get --resource-group myresource --name myserver
```

## Azure SQL Managed Instance

**Enable**

```azurecli
az sql mi ad-only-auth enable --resource-group myresource --name myserver
```

**Disable**

```azurecli
az sql mi ad-only-auth disable --resource-group myresource --name myserver
```

### Check the status in SQL Database

```azurecli
az sql mi ad-only-auth get --resource-group myresource --name myserver
```

# [PowerShell](#tab/azure-powershell)

`ServerName` or `InstanceName` correspond to the prefix of the server name (for example, `myserver` or `myinstance`) and `ResourceGroupName` corresponds to the resource the server belongs to (for example, `myresource`).

## Azure SQL Database

### Enable or disable in SQL Database

**Enable**

```powershell
Enable-AzSqlServerActiveDirectoryOnlyAuthentication -ServerName myserver -ResourceGroupName myresource
```

You can also use the following command:

```powershell
Get-AzSqlServer -ServerName myserver | Enable-AzSqlServerActiveDirectoryOnlyAuthentication
```

For more information on these PowerShell commands, run `get-help  Enable-AzSqlServerActiveDirectoryOnlyAuthentication -full`.

**Disable**

```powershell
Disable-AzSqlServerActiveDirectoryOnlyAuthentication -ServerName myserver -ResourceGroupName myresource
```

### Check the status in SQL Database

```powershell
Get-AzSqlServerActiveDirectoryOnlyAuthentication  -ServerName myserver -ResourceGroupName myresource
```

You can also use the following command:

```powershell
Get-AzSqlServer -ServerName myserver | Get-AzSqlServerActiveDirectoryOnlyAuthentication
```

## Azure SQL Managed Instance

### Enable or disable in SQL Managed Instance

**Enable**

```powershell
Enable-AzSqlInstanceActiveDirectoryOnlyAuthentication -InstanceName myinstance -ResourceGroupName myresource
```

You can also use the following command:

```powershell
Get- AzSqlInstance -InstanceName myinstance | Enable-AzSqlInstanceActiveDirectoryOnlyAuthentication
```

For more information on these PowerShell commands, run `get-help  Enable-AzSqlInstanceActiveDirectoryOnlyAuthentication -full`.

**Disable**

```powershell
Disable-AzSqlInstanceActiveDirectoryOnlyAuthentication -InstanceName myinstance -ResourceGroupName myresource
```

### Check the status in SQL Managed Instance

```powershell
Get-AzSqlInstanceActiveDirectoryOnlyAuthentication -InstanceName myinstance -ResourceGroupName myresource
```

You can also use the following command:

```powershell
Get-AzSqlInstance -InstanceName myinstance | Get-AzSqlInstanceActiveDirectoryOnlyAuthentication
```

# [REST API](#tab/rest-api)

The following parameters will need to be defined:

- `<tenantId>` can be found by going to the [Azure portal](https://portal.azure.com), and selecting your **Azure Active Directory** resource. In the **Overview** pane, you should see your **Tenant ID**.
- `<clientId>` is the **Object ID** of the Azure AD account. You can find this by going to the user's **Profile** page in the Azure portal.
- `<subscriptionId>` can be found by navigating to **Subscriptions** in the Azure portal.
- `<myserver>` correspond to the prefix of the server or instance name (for example, `myserver`).
- `<myresource>` corresponds to the resource the server belongs to (for example, `myresource`)

To use latest MSAL, download it from https://www.powershellgallery.com/packages/MSAL.PS.

```rest
$tenantId = '<tenandId>'
$clientId = '<clientId>'
$subscriptionId = '<subscriptionId>'
$uri = "urn:ietf:wg:oauth:2.0:oob" 
$authUrl = “https://login.windows.net/$tenantId”
$serverName = "<myserver>"
$resourceGroupName = "<myresource>"
```

## Azure SQL Database

### Enable or disable in SQL Database

**Enable**

```rest
$body = @{ properties = @{ azureADOnlyAuthentication = 1 } } | ConvertTo-Json
Invoke-RestMethod -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/servers/$serverName/azureADOnlyAuthentications/default?api-version=2020-02-02-preview" -Method PUT -Headers $authHeader -Body $body -ContentType "application/json"
```

**Disable**

```rest
$body = @{ properties = @{ azureADOnlyAuthentication = 0 } } | ConvertTo-Json
Invoke-RestMethod -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/servers/$serverName/azureADOnlyAuthentications/default?api-version=2020-02-02-preview" -Method PUT -Headers $authHeader -Body $body -ContentType "application/json"
```

### Check the status in SQL Database

```rest
Invoke-RestMethod -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/servers/$serverName/azureADOnlyAuthentications/default?api-version=2020-02-02-preview" -Method GET -Headers $authHeader  | Format-List
```

## Azure SQL Managed Instance

### Enable or disable in SQL Managed Instance

**Enable**

```rest
$body = @{   properties = @{  azureADOnlyAuthentication = 1 }  } | ConvertTo-Json 
Invoke-RestMethod -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/managedInstances/$serverName/azureADOnlyAuthentications/default?api-version=2020-02-02-preview" -Method PUT -Headers $authHeader -Body $body -ContentType "application/json"
```

**Disable**

```rest
$body = @{   properties = @{  azureADOnlyAuthentication = 0 }  } | ConvertTo-Json 
Invoke-RestMethod -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/managedInstances/$serverName/azureADOnlyAuthentications/default?api-version=2020-02-02-preview" -Method PUT -Headers $authHeader -Body $body -ContentType "application/json"
```

### Check the status in SQL Managed Instance

```rest
Invoke-RestMethod -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/managedInstances/$serverName/azureADOnlyAuthentications/default?api-version=2020-02-02-preview" -Method GET -Headers $authHeader  | Format-List
```

---

## Remarks

- A [SQL Server Contributor](../../role-based-access-control/built-in-roles.md#sql-server-contributor) can set or remove an Azure AD admin, but can't set the **Azure Active Directory authentication only** setting in the Azure portal. The [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) can't set or remove an Azure AD admin, but can set the **Azure Active Directory authentication only** setting in the Azure portal. Only accounts with higher Azure RBAC roles or custom roles that contain both permissions can set or remove an Azure AD admin and set the **Azure Active Directory authentication only** setting. One such role is the [Global Administrators](../../active-directory/roles/permissions-reference.md#global-administrator).
- The **Azure Active Directory authentication only** setting can only be enabled or disabled by users with the right permissions if the **Azure Active Directory admin** is specified. If the Azure AD admin isn't set, the **Azure Active Directory authentication only** setting remains inactive and cannot be enabled or disabled. 
- Changing an Azure AD admin when Azure AD-only authentication is enabled is supported for users with the appropriate permissions.
- Changing an Azure AD admin and enabling or disabling Azure AD-only authentication is allowed in the Azure portal for users with the appropriate permissions. Both operations can be completed with one **Save** in the Azure portal.
- Removing an Azure AD admin when the Azure AD-only authentication feature is enabled isn't supported. If the **Azure Active Directory authentication only** setting is enabled, the **Remove admin** button is inactive in the Azure portal.
- Removing an Azure AD admin and disabling the **Azure Active Directory authentication only** setting is allowed, but requires the right user permission to complete the operations. Both operations can be completed with one **Save** in the Azure portal.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Enable Azure Active Directory only authentication with Azure SQL](authentication-aad-only-auth-tutorial.md)