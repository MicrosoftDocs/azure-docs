---
title: Microsoft Entra-Only Authentication
titleSuffix: Azure Synapse Analytics
description: Learn about Microsoft Entra-only authentication for Azure Synapse Analytics.
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf, mathoma
ms.date: 10/07/2026
ai-usage: ai-assisted
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
---

# Microsoft Entra-only authentication with Azure Synapse Analytics

By using Microsoft Entra-only authentication, you can configure Azure Synapse Analytics to support only Microsoft Entra authentication.

> [!NOTE]
> Microsoft Entra server principals are currently in preview for Azure Synapse Analytics.

Microsoft Entra-only authentication is available for standalone dedicated SQL pools and Azure Synapse workspaces. For workspace configuration, see [Disable local authentication](active-directory-authentication.md#disable-local-authentication). Dedicated SQL pools in Azure Synapse Analytics workspaces don't use logical SQL servers.

When you enable Microsoft Entra-only authentication, you disable SQL authentication, including connections from SQL administrators, logins, and users. Only users who use [Microsoft Entra authentication](authentication-aad-overview.md) can connect.

For a standalone dedicated SQL pool, you can enable or disable Microsoft Entra-only authentication by using the Azure portal, Azure CLI, PowerShell, or REST API. You can also configure it during logical server creation with an Azure Resource Manager (ARM) template.

For more information, see [Authentication and authorization](logins-create-manage.md#authentication-and-authorization).

## Feature description

When you enable Microsoft Entra-only authentication, you disable [SQL authentication](logins-create-manage.md#authentication-and-authorization) for the workspace or [logical server](logical-servers.md). Although SQL authentication is disabled, Microsoft Entra accounts with proper permissions can still create new SQL authentication logins and users. Newly created SQL authentication accounts can't connect. Enabling Microsoft Entra-only authentication doesn't remove existing SQL authentication login and user accounts. The feature only prevents these accounts from connecting to the server and any database created for this server.

## Permissions

Microsoft Entra users who are members of high privileged [Microsoft Entra built-in roles](/azure/role-based-access-control/built-in-roles), such as Azure subscription [Owners](/azure/role-based-access-control/built-in-roles#owner) and [Contributors](/azure/role-based-access-control/built-in-roles#contributor), can enable or disable Microsoft Entra-only authentication. Also, the role [SQL Security Manager](/azure/role-based-access-control/built-in-roles#sql-security-manager) can enable or disable the Microsoft Entra-only authentication feature.

The [SQL Server Contributor](/azure/role-based-access-control/built-in-roles#sql-server-contributor) role doesn't have permission to enable or disable Microsoft Entra-only authentication. This restriction is consistent with separation of duties: users who can create a logical server or Microsoft Entra administrator can't necessarily enable or disable security features.

### Actions required

The following actions are added to the [SQL Security Manager](/azure/role-based-access-control/built-in-roles#sql-security-manager) role to allow management of the Microsoft Entra-only authentication feature.

- `Microsoft.Sql/servers/azureADOnlyAuthentications/*`
- `Microsoft.Sql/servers/administrators/read` - required only for users accessing the Azure portal **Microsoft Entra ID** menu

You can also add these actions to a custom role to manage Microsoft Entra-only authentication. For more information, see [Create and assign a custom role in Microsoft Entra ID](/azure/active-directory/roles/custom-create).

## Manage Microsoft Entra-only authentication using APIs

> [!IMPORTANT]
> You must set the Microsoft Entra admin before enabling Microsoft Entra-only authentication.

# [Azure CLI](#tab/azure-cli)

You must have Azure CLI version **2.14.2** or higher.

`name` corresponds to the prefix of the logical server name (for example, `myserver`) and `resource-group` corresponds to the resource group (for example, `myresource`).

## Standalone dedicated SQL pool

For more information, see [az sql server ad-only-auth](/cli/azure/sql/server/ad-only-auth).

### Enable or disable

**Enable**

```azurecli
az sql server ad-only-auth enable --resource-group myresource --name myserver
```

**Disable**

```azurecli
az sql server ad-only-auth disable --resource-group myresource --name myserver
```

### Check the status

```azurecli
az sql server ad-only-auth get --resource-group myresource --name myserver
```

# [PowerShell](#tab/azure-powershell)

You need [Az.Sql 2.10.0](https://www.powershellgallery.com/packages/Az.Sql/2.10.0) module or higher.

`ServerName` corresponds to the prefix of the logical server name (for example, `myserver`) and `ResourceGroupName` corresponds to the resource group (for example, `myresource`).

## Standalone dedicated SQL pool

### Enable or disable

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

### Check the status

```powershell
Get-AzSqlServerActiveDirectoryOnlyAuthentication  -ServerName myserver -ResourceGroupName myresource
```

You can also use the following command:

```powershell
Get-AzSqlServer -ServerName myserver | Get-AzSqlServerActiveDirectoryOnlyAuthentication
```

# [REST API](#tab/rest-api)

Define the following parameters:

- Find `<subscriptionId>` by going to **Subscriptions** in the Azure portal.
- `<myserver>` is the prefix of the logical server name.
- `<myresource>` is the resource.

To use the latest MSAL, download it from [MSAL.PS on PowerShell Gallery](https://www.powershellgallery.com/packages/MSAL.PS).

```rest
$subscriptionId = '<subscriptionId>'
$serverName = "<myserver>"
$resourceGroupName = "<myresource>"
```

## Standalone dedicated SQL pool

For more information, see the [Server Azure AD Only Authentications](/rest/api/sql/server-azure-ad-only-authentications) REST API documentation.

### Enable or disable

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

### Check the status

```rest
Invoke-RestMethod -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/servers/$serverName/azureADOnlyAuthentications/default?api-version=2020-02-02-preview" -Method GET -Headers $authHeader  | Format-List
```

# [ARM Template](#tab/arm)

- Enter the Microsoft Entra administrator for the deployment. Find the user Object ID by going to the [Azure portal](https://portal.azure.com) and navigating to your **Microsoft Entra ID** resource. Under **Manage**, select **Users**. Search for the user you want to set as the administrator for your logical server. Select the user, and on the **Profile** page, note the **Object ID**.
- Find the Tenant ID in the **Overview** page of your **Microsoft Entra ID** resource.

## Standalone dedicated SQL pool

### Enable

The following ARM template enables Microsoft Entra-only authentication on the logical server for a standalone dedicated SQL pool. To disable Microsoft Entra-only authentication, set the `azureADOnlyAuthentication` property to `false`.

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

---

<a id="checking-azure-ad-only-authentication-using-t-sql"></a>

<a id="checking-microsoft-entra-only-authentication-using-t-sql"></a>

### Check Microsoft Entra-only authentication using T-SQL

Use the [SERVERPROPERTY](/sql/t-sql/functions/serverproperty-transact-sql) function with `IsExternalAuthenticationOnly` to check whether Microsoft Entra-only authentication is enabled for your logical server. `1` indicates that the feature is enabled, and `0` indicates that it's disabled.

```sql
SELECT SERVERPROPERTY('IsExternalAuthenticationOnly')
```

## System-generated server administrator account

When you create a logical server with Microsoft Entra-only authentication enabled, the service generates a server administrator name and a random password. The generated name starts with `CloudSA` followed by a random string, and appears in the Azure portal as the **Server admin login**.

The account exists to satisfy provisioning, not to provide a way to connect. Provisioning either resource type still requires SQL authentication administrator values. Microsoft Entra-only authentication changes which authentication methods can establish a connection after provisioning, but it doesn't remove that provisioning requirement, so the service generates the values needed to meet it.

Seeing a generated name doesn't mean that SQL authentication is enabled. While Microsoft Entra-only authentication is enabled:

- No SQL authentication account can connect, including the system-generated administrator.
- The generated account isn't a shared account, a fallback, or a break-glass path.
- Applications and administrators must use Microsoft Entra authentication to connect.
- The Microsoft Entra admin and other authorized Microsoft Entra principals remain the supported administration paths.
- The service permanently removes the password from the control plane after provisioning.

## Remarks

- A [SQL Server Contributor](/azure/role-based-access-control/built-in-roles#sql-server-contributor) can set or remove a Microsoft Entra admin, but can't set the **Microsoft Entra authentication only** setting. The [SQL Security Manager](/azure/role-based-access-control/built-in-roles#sql-security-manager) can't set or remove a Microsoft Entra admin, but can set the **Microsoft Entra authentication only** setting. Only accounts with higher Azure RBAC roles or custom roles that contain both permissions can set or remove a Microsoft Entra admin and set the **Microsoft Entra authentication only** setting. One such role is the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role.
- After enabling or disabling **Microsoft Entra authentication only** in the Azure portal, an **Activity log** entry appears.
- The **Microsoft Entra authentication only** setting can only be enabled or disabled by users with the right permissions if the **Microsoft Entra admin** is specified. If the Microsoft Entra admin isn't set, the **Microsoft Entra authentication only** setting remains inactive and can't be enabled or disabled. Using APIs to enable Microsoft Entra-only authentication will also fail if the Microsoft Entra admin hasn't been set.
- Changing a Microsoft Entra admin when Microsoft Entra-only authentication is enabled is supported for users with the appropriate permissions.
- Changing a Microsoft Entra admin and enabling or disabling Microsoft Entra-only authentication is allowed in the Azure portal for users with the appropriate permissions. Both operations can be completed with one **Save** in the Azure portal. The Microsoft Entra admin must be set in order to enable Microsoft Entra-only authentication.
- Removing a Microsoft Entra admin when the Microsoft Entra-only authentication feature is enabled isn't supported. Using an API to remove a Microsoft Entra admin will fail if Microsoft Entra-only authentication is enabled.
  - If the **Microsoft Entra authentication only** setting is enabled, the **Remove admin** button is inactive in the Azure portal.
- Removing a Microsoft Entra admin and disabling the **Microsoft Entra authentication only** setting is allowed, but requires the right user permission to complete the operations. Both operations can be completed with one **Save** in the Azure portal.
- Microsoft Entra users with proper permissions can impersonate existing SQL users.
  - Impersonation continues working between SQL authentication users even when Microsoft Entra-only authentication is enabled.

## Related content

- [Use Microsoft Entra authentication with Synapse SQL](active-directory-authentication.md)
- [Microsoft Entra authentication for Azure Synapse Analytics](authentication-aad-overview.md)
