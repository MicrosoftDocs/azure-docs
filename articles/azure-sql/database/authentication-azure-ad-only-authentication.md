---
title: Azure Active Directory-only authentication
description: This article provides information on the Azure AD-only authentication feature with Azure SQL 
titleSuffix: Azure SQL Database & Azure SQL Managed Instance
ms.service: sql-db-mi
ms.subservice: security
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: kendralittle, vanto, mathoma, wiassaf
ms.date: 03/08/2022
ms.custom: ignite-fall-2021, devx-track-azurecli
---

# Azure AD-only authentication with Azure SQL

[!INCLUDE[appliesto-sqldb-sqlmi-asa-dedicated-only](../includes/appliesto-sqldb-sqlmi-asa-dedicated-only.md)]

Azure AD-only authentication is a feature within [Azure SQL](../azure-sql-iaas-vs-paas-what-is-overview.md) that allows the service to only support Azure AD authentication, and is supported for [Azure SQL Database](sql-database-paas-overview.md) and [Azure SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md). 

Azure AD-only authentication is also available for dedicated SQL pools (formerly SQL DW) in standalone servers. Azure AD-only authentication can be enabled for the Azure Synapse workspace. For more information, see [Azure AD-only authentication with Azure Synapse workspaces](../../synapse-analytics/sql/active-directory-authentication.md).

SQL authentication is disabled when enabling Azure AD-only authentication in the Azure SQL environment, including connections from SQL server administrators, logins, and users. Only users using [Azure AD authentication](authentication-aad-overview.md) are authorized to connect to the server or database.

Azure AD-only authentication can be enabled or disabled using the Azure portal, Azure CLI, PowerShell, or REST API. Azure AD-only authentication can also be configured during server creation with an Azure Resource Manager (ARM) template.

For more information on Azure SQL authentication, see [Authentication and authorization](logins-create-manage.md#authentication-and-authorization).

## Feature description

When enabling Azure AD-only authentication, [SQL authentication](logins-create-manage.md#authentication-and-authorization) is disabled at the server or managed instance level and prevents any authentication based on any SQL authentication credentials. SQL authentication users won't be able to connect to the [logical server](logical-servers.md) for Azure SQL Database or managed instance, including all of its databases. Although SQL authentication is disabled, new SQL authentication logins and users can still be created by Azure AD accounts with proper permissions. Newly created SQL authentication accounts won't be allowed to connect to the server. Enabling Azure AD-only authentication doesn't remove existing SQL authentication login and user accounts. The feature only prevents these accounts from connecting to the server, and any database created for this server.

You can also force servers to be created with Azure AD-only authentication enabled using Azure Policy. For more information, see [Azure Policy for Azure AD-only authentication](authentication-azure-ad-only-authentication-policy.md).

## Permissions

Azure AD-only authentication can be enabled or disabled by Azure AD users who are members of high privileged [Azure AD built-in roles](../../role-based-access-control/built-in-roles.md), such as Azure subscription [Owners](../../role-based-access-control/built-in-roles.md#owner), [Contributors](../../role-based-access-control/built-in-roles.md#contributor), and [Global Administrators](../../active-directory/roles/permissions-reference.md#global-administrator). Additionally, the role [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) can also enable or disable the Azure AD-only authentication feature.

The [SQL Server Contributor](../../role-based-access-control/built-in-roles.md#sql-server-contributor) and [SQL Managed Instance Contributor](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) roles won't have permissions to enable or disable the Azure AD-only authentication feature. This is consistent with the [Separation of Duties](security-best-practice.md#implement-separation-of-duties) approach, where users who can create an Azure SQL server or create an Azure AD admin, can't enable or disable security features.

### Actions required

The following actions are added to the [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role to allow management of the Azure AD-only authentication feature.

- Microsoft.Sql/servers/azureADOnlyAuthentications/*
- Microsoft.Sql/servers/administrators/read - required only for users accessing the Azure portal **Azure Active Directory** menu
- Microsoft.Sql/managedInstances/azureADOnlyAuthentications/*
- Microsoft.Sql/managedInstances/read

The above actions can also be added to a custom role to manage Azure AD-only authentication. For more information, see [Create and assign a custom role in Azure Active Directory](../../active-directory/roles/custom-create.md).

## Managing Azure AD-only authentication using APIs

> [!IMPORTANT]
> The Azure AD admin must be set before enabling Azure AD-only authentication.

# [Azure CLI](#tab/azure-cli)

You must have Azure CLI version **2.14.2** or higher.

`name` corresponds to the prefix of the server or instance name (for example, `myserver`) and `resource-group` corresponds to the resource the server belongs to (for example, `myresource`).

## Azure SQL Database

For more information, see [az sql server ad-only-auth](/cli/azure/sql/server/ad-only-auth).

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

For more information, see [az sql mi ad-only-auth](/cli/azure/sql/mi/ad-only-auth).

**Enable**

```azurecli
az sql mi ad-only-auth enable --resource-group myresource --name myserver
```

**Disable**

```azurecli
az sql mi ad-only-auth disable --resource-group myresource --name myserver
```

### Check the status in SQL Managed Instance

```azurecli
az sql mi ad-only-auth get --resource-group myresource --name myserver
```

# [PowerShell](#tab/azure-powershell)

[Az.Sql 2.10.0](https://www.powershellgallery.com/packages/Az.Sql/2.10.0) module or higher is required.

`ServerName` or `InstanceName` correspond to the prefix of the server name (for example, `myserver` or `myinstance`) and `ResourceGroupName` corresponds to the resource the server belongs to (for example, `myresource`).

## Azure SQL Database

### Enable or disable in SQL Database

**Enable**

For more information, see [Enable-AzSqlServerActiveDirectoryOnlyAuthentication](/powershell/module/az.sql/enable-azsqlserveractivedirectoryonlyauthentication). You can also run `get-help Enable-AzSqlServerActiveDirectoryOnlyAuthentication -full`.

```powershell
Enable-AzSqlServerActiveDirectoryOnlyAuthentication -ServerName myserver -ResourceGroupName myresource
```

You can also use the following command:

```powershell
Get-AzSqlServer -ServerName myserver | Enable-AzSqlServerActiveDirectoryOnlyAuthentication
```

**Disable**

For more information, see [Disable-AzSqlServerActiveDirectoryOnlyAuthentication](/powershell/module/az.sql/disable-azsqlserveractivedirectoryonlyauthentication).

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

For more information, see [Enable-AzSqlInstanceActiveDirectoryOnlyAuthentication](/powershell/module/az.sql/enable-azsqlinstanceactivedirectoryonlyauthentication).

```powershell
Enable-AzSqlInstanceActiveDirectoryOnlyAuthentication -InstanceName myinstance -ResourceGroupName myresource
```

You can also use the following command:

```powershell
Get-AzSqlInstance -InstanceName myinstance | Enable-AzSqlInstanceActiveDirectoryOnlyAuthentication
```

For more information on these PowerShell commands, run `get-help  Enable-AzSqlInstanceActiveDirectoryOnlyAuthentication -full`.

**Disable**

For more information, see [Disable-AzSqlInstanceActiveDirectoryOnlyAuthentication](/powershell/module/az.sql/disable-azsqlinstanceactivedirectoryonlyauthentication).

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

- `<subscriptionId>` can be found by navigating to **Subscriptions** in the Azure portal.
- `<myserver>` correspond to the prefix of the server or instance name (for example, `myserver`).
- `<myresource>` corresponds to the resource the server belongs to (for example, `myresource`)

To use latest MSAL, download it from https://www.powershellgallery.com/packages/MSAL.PS.

```rest
$subscriptionId = '<subscriptionId>'
$serverName = "<myserver>"
$resourceGroupName = "<myresource>"
```

## Azure SQL Database

For more information, see the [Server Azure AD Only Authentications](/rest/api/sql/2021-02-01-preview/serverazureadonlyauthentications) REST API documentation.

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

For more information, see the [Managed Instance Azure AD Only Authentications](/rest/api/sql/2021-02-01-preview/managedinstanceazureadonlyauthentications) REST API documentation.

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

# [ARM Template](#tab/arm)

- Input the Azure AD admin for the deployment. You will find the user Object ID by going to the [Azure portal](https://portal.azure.com) and navigating to your **Azure Active Directory** resource. Under **Manage**, select **Users**. Search for the user you want to set as the Azure AD admin for your Azure SQL server. Select the user, and under their **Profile** page, you will see the **Object ID**.
- The Tenant ID can be found in the **Overview** page of your **Azure Active Directory** resource.

## Azure SQL Database

### Enable

The below ARM Template enables Azure AD-only authentication in your Azure SQL Database. To disable Azure AD-only authentication, set the `azureADOnlyAuthentication` property to `false`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.1",
    "parameters": {
        "sqlServer_name": {
            "type": "String"
        },
        "aad_admin_name": {
            "type": "String"
        },
        "aad_admin_objectid": {
            "type": "String"
        },
        "aad_admin_tenantid": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Sql/servers/administrators",
            "apiVersion": "2020-02-02-preview",
            "name": "[concat(parameters('sqlServer_name'), '/ActiveDirectory')]",
            "properties": {
                "administratorType": "ActiveDirectory",
                "login": "[parameters('aad_admin_name')]",
                "sid": "[parameters('aad_admin_objectid')]",
                "tenantId": "[parameters('aad_admin_tenantId')]"
            }
        },        
        {
            "type": "Microsoft.Sql/servers/azureADOnlyAuthentications",
            "apiVersion": "2020-02-02-preview",
            "name": "[concat(parameters('sqlServer_name'), '/Default')]",
            "dependsOn": [
                "[resourceId('Microsoft.Sql/servers/administrators', parameters('sqlServer_name'), 'ActiveDirectory')]"
            ],
            "properties": {
                "azureADOnlyAuthentication": true
            }
        }
    ]
}
```

For more information, see [Microsoft.Sql servers/azureADOnlyAuthentications](/azure/templates/microsoft.sql/servers/azureadonlyauthentications).

## Azure SQL Managed Instance

### Enable

The below ARM Template enables Azure AD-only authentication in your Azure SQL Managed Instance. To disable Azure AD-only authentication, set the `azureADOnlyAuthentication` property to `false`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.1",
    "parameters": {
        "instance": {
            "type": "String"
        },
        "aad_admin_name": {
            "type": "String"
        },
        "aad_admin_objectid": {
            "type": "String"
        },
        "aad_admin_tenantid": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Sql/managedInstances/administrators",
            "apiVersion": "2020-02-02-preview",
            "name": "[concat(parameters('instance'), '/ActiveDirectory')]",
            "properties": {
                "administratorType": "ActiveDirectory",
                "login": "[parameters('aad_admin_name')]",
                "sid": "[parameters('aad_admin_objectid')]",
                "tenantId": "[parameters('aad_admin_tenantId')]"
            }
        },
        {
            "type": "Microsoft.Sql/managedInstances/azureADOnlyAuthentications",
            "apiVersion": "2020-02-02-preview",
            "name": "[concat(parameters('instance'), '/Default')]",
            "dependsOn": [
                "[resourceId('Microsoft.Sql/managedInstances/administrators', parameters('instance'), 'ActiveDirectory')]"
            ],
            "properties": {
                "azureADOnlyAuthentication": true
            }
        }
    ]
}

```

For more information, see [Microsoft.Sql managedInstances/azureADOnlyAuthentications](/azure/templates/microsoft.sql/managedinstances/azureadonlyauthentications).

---

### Checking Azure AD-only authentication using T-SQL

The [SEVERPROPERTY](/sql/t-sql/functions/serverproperty-transact-sql) `IsExternalAuthenticationOnly` has been added to check if Azure AD-only authentication is enabled for your server or managed instance. `1` indicates that the feature is enabled, and `0` represents the feature is disabled.

```sql
SELECT SERVERPROPERTY('IsExternalAuthenticationOnly') 
```

## Remarks

- A [SQL Server Contributor](../../role-based-access-control/built-in-roles.md#sql-server-contributor) can set or remove an Azure AD admin, but can't set the **Azure Active Directory authentication only** setting. The [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) can't set or remove an Azure AD admin, but can set the **Azure Active Directory authentication only** setting. Only accounts with higher Azure RBAC roles or custom roles that contain both permissions can set or remove an Azure AD admin and set the **Azure Active Directory authentication only** setting. One such role is the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role.
- After enabling or disabling **Azure Active Directory authentication only** in the Azure portal, an **Activity log** entry can be seen in the **SQL server** menu.
    :::image type="content" source="media/authentication-azure-ad-only-authentication/azure-ad-only-authentication-portal-sql-server-activity-log.png" alt-text="Activity log entry in the Azure portal":::
- The **Azure Active Directory authentication only** setting can only be enabled or disabled by users with the right permissions if the **Azure Active Directory admin** is specified. If the Azure AD admin isn't set, the **Azure Active Directory authentication only** setting remains inactive and cannot be enabled or disabled. Using APIs to enable Azure AD-only authentication will also fail if the Azure AD admin hasn't been set.
- Changing an Azure AD admin when Azure AD-only authentication is enabled is supported for users with the appropriate permissions.
- Changing an Azure AD admin and enabling or disabling Azure AD-only authentication is allowed in the Azure portal for users with the appropriate permissions. Both operations can be completed with one **Save** in the Azure portal. The Azure AD admin must be set in order to enable Azure AD-only authentication.
- Removing an Azure AD admin when the Azure AD-only authentication feature is enabled isn't supported. Using an API to remove an Azure AD admin will fail if Azure AD-only authentication is enabled.
    - If the **Azure Active Directory authentication only** setting is enabled, the **Remove admin** button is inactive in the Azure portal.
- Removing an Azure AD admin and disabling the **Azure Active Directory authentication only** setting is allowed, but requires the right user permission to complete the operations. Both operations can be completed with one **Save** in the Azure portal.
- Azure AD users with proper permissions can impersonate existing SQL users.
    - Impersonation continues working between SQL authentication users even when the Azure AD-only authentication feature is enabled.

### Limitations for Azure AD-only authentication in SQL Database

When Azure AD-only authentication is enabled for SQL Database, the following features aren't supported:

- [Azure SQL Database server roles](security-server-roles.md)
- [Elastic jobs](job-automation-overview.md)
- [SQL Data Sync](sql-data-sync-data-sql-server-sql-database.md)
- [Change data capture (CDC)](/sql/relational-databases/track-changes/about-change-data-capture-sql-server) - If you create a database in Azure SQL Database as an Azure AD user and enable change data capture on it, a SQL user will not be able to disable or make changes to CDC artifacts. However, another Azure AD user will be able to enable or disable CDC on the same database. Similarly, if you create an Azure SQL Database as a SQL user, enabling or disabling CDC as an Azure AD user won't work
- [Transactional replication](../managed-instance/replication-transactional-overview.md) - Since SQL authentication is required for connectivity between replication participants, when Azure AD-only authentication is enabled, transactional replication is not supported for SQL Database for scenarios where transactional replication is used to push changes made in an Azure SQL Managed Instance, on-premises SQL Server, or an Azure VM SQL Server instance to a database in Azure SQL Database
- [SQL insights](../../azure-monitor/insights/sql-insights-overview.md)
- EXEC AS statement for Azure AD group member accounts

### Limitations for Azure AD-only authentication in Managed Instance

When Azure AD-only authentication is enabled for Managed Instance, the following features aren't supported:

- [Transactional replication](../managed-instance/replication-transactional-overview.md) 
- [SQL Agent Jobs in Managed Instance](../managed-instance/job-automation-managed-instance.md) supports Azure AD-only authentication. However, the Azure AD user who is a member of an Azure AD group that has access to the managed instance cannot own SQL Agent Jobs
- [SQL insights](../../azure-monitor/insights/sql-insights-overview.md)
- EXEC AS statement for Azure AD group member accounts

For more limitations, see [T-SQL differences between SQL Server & Azure SQL Managed Instance](../managed-instance/transact-sql-tsql-differences-sql-server.md#logins-and-users).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Enable Azure Active Directory only authentication with Azure SQL](authentication-azure-ad-only-authentication-tutorial.md)

> [!div class="nextstepaction"]
> [Create server with Azure AD-only authentication enabled in Azure SQL](authentication-azure-ad-only-authentication-create-server.md)
