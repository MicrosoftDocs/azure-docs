---
title: Create an Azure SQL logical server using a user-assigned managed identity
description: This article guides you through creating an Azure SQL logical server using a user-assigned managed identity
titleSuffix: Azure SQL Database
ms.service: sql-database
ms.subservice: security
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 12/15/2021
---

# Create an Azure SQL Database server with a user-assigned managed identity

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> User-assigned managed identity for Azure SQL is in **public preview**. If you're looking for a guide on Azure SQL Managed Instance, see [Create an Azure SQL Managed Instance with a user-assigned managed identity](../managed-instance/authentication-azure-ad-user-assigned-managed-identity-create-managed-instance.md).

This how-to guide outlines the steps to create a [logical server](logical-servers.md) for Azure SQL Database with a [user-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). For more information on the benefits of using a user-assigned managed identity for the server identity in Azure SQL Database, see [User-assigned managed identity in Azure AD for Azure SQL](authentication-azure-ad-user-assigned-managed-identity.md).

## Prerequisites

-  To provision a SQL Database server with a user-assigned managed identity, the [SQL Server Contributor](../../role-based-access-control/built-in-roles.md#sql-server-contributor) role (or a role with greater permissions), along with an Azure RBAC role containing the following action is required:
   - Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action - For example, the [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) has this action.
- Create a user-assigned managed identity and assign it the necessary permission to be a server or managed instance identity. For more information, see [Manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) and [user-assigned managed identity permissions for Azure SQL](authentication-azure-ad-user-assigned-managed-identity.md#permissions).
- [Az.Sql module 3.4](https://www.powershellgallery.com/packages/Az.Sql/3.4.0) or higher is required when using PowerShell for user-assigned managed identities.
- [The Azure CLI 2.26.0](/cli/azure/install-azure-cli) or higher is required to use the Azure CLI with user-assigned managed identities.
- For a list of limitations and known issues with using user-assigned managed identity, see [User-assigned managed identity in Azure AD for Azure SQL](authentication-azure-ad-user-assigned-managed-identity.md#limitations-and-known-issues)

## Create server configured with a user-assigned managed identity

The following steps outline the process of creating a new Azure SQL Database logical server and a new database with a user-assigned managed identity assigned.

> [!NOTE]
> Multiple user-assigned managed identities can be added to the server, but only one identity can be the primary identity at any given time. In this example, the system-assigned managed identity is disabled, but it can be enabled as well.

# [Portal](#tab/azure-portal)

1. Browse to the [Select SQL deployment](https://portal.azure.com/#create/Microsoft.AzureSQL) option page in the Azure portal.

2. If you aren't already signed in to Azure portal, sign in when prompted.

3. Under **SQL databases**, leave **Resource type** set to **Single database**, and select **Create**.

4. On the **Basics** tab of the **Create SQL Database** form, under **Project details**, select the desired Azure **Subscription**.

5. For **Resource group**, select **Create new**, enter a name for your resource group, and select **OK**.

6. For **Database name** enter your desired database name.

7. For **Server**, select **Create new**, and fill out the **New server** form with the following values:

    - **Server name**: Enter a unique server name. Server names must be globally unique for all servers in Azure, not just unique within a subscription.
    - **Server admin login**: Enter an admin login name, for example: `azureuser`.
    - **Password**: Enter a password that meets the password requirements, and enter it again in the **Confirm password** field.
    - **Location**: Select a location from the dropdown list
    
8. Select **Next: Networking** at the bottom of the page.

9. On the **Networking** tab, for **Connectivity method**, select **Public endpoint**.

10. For **Firewall rules**, set **Add current client IP address** to **Yes**. Leave **Allow Azure services and resources to access this server** set to **No**.

11. Select **Next: Security** at the bottom of the page.

12. On the Security tab, under **Identity (preview)**, select **Configure Identities**.

    :::image type="content" source="media/authentication-azure-ad-user-assigned-managed-identity/create-server-configure-identities.png" alt-text="Screenshot of Azure portal security settings of the create database process":::

13. On the **Identity (preview)** blade, under **User assigned managed identity**, select **Add**. Select the desired **Subscription** and then under **User assigned managed identities** select the desired user assigned managed identity from the selected subscription. Then select the **Select** button. 

    :::image type="content" source="media/authentication-azure-ad-user-assigned-managed-identity/user-assigned-managed-identity-configuration.png" alt-text="Azure portal screenshot of adding user assigned managed identity when configuring server identity":::

    :::image type="content" source="media/authentication-azure-ad-user-assigned-managed-identity/select-a-user-assigned-managed-identity.png" alt-text="Azure portal screenshot of user assigned managed identity when configuring server identity":::

14. Under **Primary identity**, select the same user-assigned managed identity selected in the previous step.

    :::image type="content" source="media/authentication-azure-ad-user-assigned-managed-identity/select-a-primary-identity.png" alt-text="Azure portal screenshot of selecting primary identity for server":::

    > [!NOTE]
    > If the system-assigned managed identity is the primary identity, the **Primary identity** field must be empty.

15. Select **Apply**

16. Select **Review + create** at the bottom of the page

17. On the **Review + create** page, after reviewing, select **Create**.

# [The Azure CLI](#tab/azure-cli)

The Azure CLI command `az sql server create` is used to provision a new logical server. The below command will provision a new server with a user-assigned managed identity. The example will also enable [Azure AD-only authentication](authentication-azure-ad-only-authentication.md), and set an Azure AD admin for the server.

The server SQL Administrator login will be automatically created and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this server creation, the SQL Administrator login won't be used.

The server Azure AD admin will be the account you set for `<AzureADAccount>`, and can be used to manage the server.

Replace the following values in the example:

- `<subscriptionId>`: Your subscription ID can be found in the Azure portal
- `<ResourceGroupName>`: Name of the resource group for your logical server
- `<managedIdentity>`: The user-assigned managed identity. Can also be used as the primary identity.
- `<primaryIdentity>`: The primary identity you want to use as the server identity
- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`
- `<AzureADAccountSID>`: The Azure AD Object ID for the user
- `<ServerName>`: Use a unique logical server name
- `<Location>`: Location of the server, such as `westus`, or `centralus`

```azurecli
az sql server create --assign-identity --identity-type UserAssigned --user-assigned-identity-id /subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<managedIdentity> --primary-user-assigned-identity-id /subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<primaryIdentity> --enable-ad-only-auth --external-admin-principal-type User --external-admin-name <AzureADAccount> --external-admin-sid <AzureADAccountSID> -g <ResourceGroupName> -n <ServerName> -l <Location>
```

For more information, see [az sql server create](/cli/azure/sql/server#az_sql_server_create).

> [!NOTE]
> The above example provisions a server with only a user-assigned managed identity. You could set the `--identity-type` to be `UserAssigned,SystemAssigned` if you wanted both types of managed identities to be created with the server. 

To check the server status after creation, see the following command:

```azurecli
az sql server show --name <ServerName> --resource-group <ResourceGroupName> --expand-ad-admin
```

# [PowerShell](#tab/azure-powershell)

The PowerShell command `New-AzSqlServer` is used to provision a new Azure SQL logical server. The below command will provision a new server with a user-assigned managed identity. The example will also enable [Azure AD-only authentication](authentication-azure-ad-only-authentication.md), and set an Azure AD admin for the server.

The server SQL Administrator login will be automatically created and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this server creation, the SQL Administrator login won't be used.

The server Azure AD admin will be the account you set for `<AzureADAccount>`, and can be used to manage the server.

Replace the following values in the example:

- `<ResourceGroupName>`: Name of the resource group for your logical server
- `<Location>`: Location of the server, such as `West US`, or `Central US`
- `<ServerName>`: Use a unique logical server name
- `<subscriptionId>`: Your subscription ID can be found in the Azure portal
- `<managedIdentity>`: The user-assigned managed identity. Can also be used as the primary identity
- `<primaryIdentity>`: The primary identity you want to use as the server identity
- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`

```powershell
New-AzSqlServer -ResourceGroupName "<ResourceGroupName>" -Location "<Location>" -ServerName "<ServerName>" -ServerVersion "12.0" -AssignIdentity -IdentityType "UserAssigned" -UserAssignedIdentityId "/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<managedIdentity>" -PrimaryUserAssignedIdentityId "/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<primaryIdentity>" -ExternalAdminName "<AzureADAccount>" -EnableActiveDirectoryOnlyAuthentication
```

For more information, see [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver).

> [!NOTE]
> The above example provisions a server with only a user-assigned managed identity. You could set the `-IdentityType` to be `"UserAssigned,SystemAssigned"` if you wanted both types of managed identities to be created with the server. 

To check the server status after creation, see the following command:

```powershell
Get-AzSqlServer -ResourceGroupName "<ResourceGroupName>" -ServerName "<ServerName>" -ExpandActiveDirectoryAdministrator
```

# [Rest API](#tab/rest-api)

The [Servers - Create Or Update](/rest/api/sql/2020-11-01-preview/servers/create-or-update) Rest API can be used to create a logical server with a user-assigned managed identity.

The script below will provision a logical server, set the Azure AD admin as `<AzureADAccount>`, and enable [Azure AD-only authentication](authentication-azure-ad-only-authentication.md). The server SQL Administrator login will also be created automatically and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this provisioning, the SQL Administrator login won't be used.

The Azure AD admin, `<AzureADAccount>` can be used to manage the server when the provisioning is complete.

Replace the following values in the example:

- `<tenantId>`: Can be found by going to the [Azure portal](https://portal.azure.com), and going to your **Azure Active Directory** resource. In the **Overview** pane, you should see your **Tenant ID**
- `<subscriptionId>`: Your subscription ID can be found in the Azure portal
- `<ServerName>`: Use a unique logical server name
- `<ResourceGroupName>`: Name of the resource group for your logical server
- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`
- `<Location>`: Location of the server, such as `westus2`, or `centralus`
- `<objectId>`: Can be found by going to the [Azure portal](https://portal.azure.com), and going to your **Azure Active Directory** resource. In the **User** pane, search for the Azure AD user and find their **Object ID**
- `<managedIdentity>`: The user-assigned managed identity. Can also be used as the primary identity
- `<primaryIdentity>`: The primary identity you want to use as the server identity

```rest
Import-Module Azure
Import-Module MSAL.PS

$tenantId = '<tenantId>'
$clientId = '1950a258-227b-4e31-a9cf-717495945fc2' # Static Microsoft client ID used for getting a token
$subscriptionId = '<subscriptionId>'
$uri = "urn:ietf:wg:oauth:2.0:oob" 
$authUrl = "https://login.windows.net/$tenantId"
$serverName = "<ServerName>"
$resourceGroupName = "<ResourceGroupName>"

Login-AzAccount -tenantId $tenantId

# login as a user with SQL Server Contributor role or higher 

# Get a token

$result = Get-MsalToken -RedirectUri $uri -ClientId $clientId -TenantId $tenantId -Scopes "https://management.core.windows.net/.default"

#Authetication header
$authHeader = @{
'Content-Type'='application\json; '
'Authorization'=$result.CreateAuthorizationHeader()
}

# Enable Azure AD-only auth and sets a user-managed identity as the server identity
# No server admin is specified, and only Azure AD admin and Azure AD-only authentication is set to true
# Server admin (login and password) is generated by the system
# The sid is the Azure AD Object ID for the user 
# Replace all values in a <>

$body = '{ 
"location": "<Location>",
"identity": {"type" : "UserAssigned", "UserAssignedIdentities" : {"/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<managedIdentity>" : {}}},
"properties": { "PrimaryUserAssignedIdentityId":"/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<primaryIdentity>","administrators":{ "login":"<AzureADAccount>", "sid":"<objectId>", "tenantId":"<tenantId>", "principalType":"User", "azureADOnlyAuthentication":true }
  }
}'

# Provision the server

Invoke-RestMethod -Uri https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/servers/$serverName/?api-version=2020-11-01-preview -Method PUT -Headers $authHeader -Body $body -ContentType "application/json"
```

> [!NOTE]
> The above example provisions a server with only a user-assigned managed identity. You could set the `"type"` to be `"UserAssigned,SystemAssigned"` if you wanted both types of managed identities to be created with the server. 

To check the server status, you can use the following script:

```rest
$uri = 'https://management.azure.com/subscriptions/'+$subscriptionId+'/resourceGroups/'+$resourceGroupName+'/providers/Microsoft.Sql/servers/'+$serverName+'?api-version=2020-11-01-preview&$expand=administrators/activedirectory'

$responce=Invoke-WebRequest -Uri $uri -Method PUT -Headers $authHeader -Body $body -ContentType "application/json"

$responce.statuscode

$responce.content
```

# [ARM Template](#tab/arm-template)

Here's an example of an ARM template that creates an Azure SQL logical server with a user-assigned managed identity. The template also adds an Azure AD admin set for the server and enables [Azure AD-only authentication](authentication-azure-ad-only-authentication.md), but this can be removed from the template example.

For more information and ARM templates, see [Azure Resource Manager templates for Azure SQL Database & SQL Managed Instance](arm-templates-content-guide.md).

Use a [Custom deployment in the Azure portal](https://portal.azure.com/#create/Microsoft.Template), and **Build your own template in the editor**. Next, **Save** the configuration once you pasted in the example.

To get your user-assigned managed identity **Resource ID**, search for **Managed Identities** in the [Azure portal](https://portal.azure.com). Find your managed identity, and go to **Properties**. An example of your UMI **Resource ID** will look like `/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<managedIdentity>`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.1",
    "parameters": {
        "server": {
            "type": "string",
            "defaultValue": "[uniqueString('sql', resourceGroup().id)]",
            "metadata": {
                "description": "The name of the logical server."
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Location for all resources."
            }
        },
        "aad_admin_name": {
            "type": "String",
            "metadata": {
                "description": "The name of the Azure AD admin for the SQL server."
            }
        },
        "aad_admin_objectid": {
            "type": "String",
            "metadata": {
                "description": "The Object ID of the Azure AD admin."
            }
        },
        "aad_admin_tenantid": {
            "type": "String",
            "defaultValue": "[subscription().tenantId]",
            "metadata": {
                "description": "The Tenant ID of the Azure Active Directory"
            }
        },
        "aad_admin_type": {
            "defaultValue": "User",
            "allowedValues": [
                "User",
                "Group",
                "Application"
            ],
            "type": "String"
        },
        "aad_only_auth": {
            "defaultValue": true,
            "type": "Bool"
        },
        "user_identity_resource_id": {
            "defaultValue": "",
            "type": "String",
            "metadata": {
                "description": "The Resource ID of the user-assigned managed identity, in the form of /subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<managedIdentity>."
            }
        },
        "AdminLogin": {
            "minLength": 1,
            "type": "String"
        },
        "AdminLoginPassword": {
            "type": "SecureString"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Sql/servers",
            "apiVersion": "2020-11-01-preview",
            "name": "[parameters('server')]",
            "location": "[parameters('location')]",
            "identity": {
                "type": "UserAssigned",
                "UserAssignedIdentities": {
                    "[parameters('user_identity_resource_id')]": {}
                }
            },
            "properties": {
                "administratorLogin": "[parameters('AdminLogin')]",
                "administratorLoginPassword": "[parameters('AdminLoginPassword')]",
                "PrimaryUserAssignedIdentityId": "[parameters('user_identity_resource_id')]",
                "administrators": {
                    "login": "[parameters('aad_admin_name')]",
                    "sid": "[parameters('aad_admin_objectid')]",
                    "tenantId": "[parameters('aad_admin_tenantid')]",
                    "principalType": "[parameters('aad_admin_type')]",
                    "azureADOnlyAuthentication": "[parameters('aad_only_auth')]"
                }
            }
        }
    ]
}

```

---

## See also

- [User-assigned managed identity in Azure AD for Azure SQL](authentication-azure-ad-user-assigned-managed-identity.md)
- [Create an Azure SQL Managed Instance with a user-assigned managed identity](../managed-instance/authentication-azure-ad-user-assigned-managed-identity-create-managed-instance.md).