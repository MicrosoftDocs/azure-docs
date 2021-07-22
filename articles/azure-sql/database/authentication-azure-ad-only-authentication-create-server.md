---
title: Create server with Azure Active Directory only authentication enabled in Azure SQL
description: This article guides you through creating an Azure SQL logical server or managed instance with Azure Active Directory (Azure AD) only authentication enabled, which disables connectivity using SQL Authentication
ms.service: sql-db-mi
ms.subservice: security
ms.topic: how-to
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 07/19/2021
---

# Create server with Azure AD-only authentication enabled in Azure SQL

[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

> [!NOTE]
> The **Azure AD-only authentication** feature discussed in this article is in **public preview**. For detailed information about this feature, see [Azure AD-only authentication with Azure SQL](authentication-azure-ad-only-authentication.md). Azure AD-only authentication is currently not available for Azure Synapse Analytics.

This how-to guide outlines the steps to create an [Azure SQL logical server](logical-servers.md) or [Azure SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md) with [Azure AD-only authentication](authentication-azure-ad-only-authentication.md) enabled during provisioning. The Azure AD-only authentication feature prevents users from connecting to the server or managed instance using SQL authentication, and only allows connection using Azure AD authentication.

## Prerequisites

- Version 2.26.1 or later is needed when using The Azure CLI. For more information on the installation and the latest version, see [Install the Azure CLI](/cli/azure/install-azure-cli).
- [Az 6.1.0](https://www.powershellgallery.com/packages/Az/6.1.0) module or higher is needed when using PowerShell.
- If you're provisioning a managed instance using the Azure CLI, PowerShell, or Rest API, a virtual network and subnet needs to be created before you begin. For more information, see [Create a virtual network for Azure SQL Managed Instance](../managed-instance/virtual-network-subnet-create-arm-template.md).

## Permissions

To provision an Azure SQL logical server or managed instance, you'll need to have the appropriate permissions to create these resources. Azure users with higher permissions, such as subscription [Owners](../../role-based-access-control/built-in-roles.md#owner), [Contributors](../../role-based-access-control/built-in-roles.md#contributor), [Service Administrators](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles), and [Co-Administrators](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles) have the privilege to create a SQL server or managed instance. To create these resources with the least privileged Azure RBAC role, use the [SQL Server Contributor](../../role-based-access-control/built-in-roles.md#sql-server-contributor) role for SQL Database and [SQL Managed Instance Contributor](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) role for Managed Instance.

The [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) Azure RBAC role doesn't have enough permissions to create a server or instance with Azure AD-only authentication enabled. The [SQL Security Manager](../../role-based-access-control/built-in-roles.md#sql-security-manager) role will be required to manage the Azure AD-only authentication feature after server or instance creation.

## Provision with Azure AD-only authentication enabled

The following section provides you with examples and scripts on how to create a SQL logical server or managed instance with an Azure AD admin set for the server or instance, and have Azure AD-only authentication enabled during server creation. For more information on the feature, see [Azure AD-only authentication](authentication-azure-ad-only-authentication.md).

In our examples, we're enabling Azure AD-only authentication during server or managed instance creation, with a system assigned server admin and password. This will prevent server admin access when Azure AD-only authentication is enabled, and only allows the Azure AD admin to access the resource. It's optional to add parameters to the APIs to include your own server admin and password during server creation. However, the password cannot be reset until you disable Azure AD-only authentication.

To change the existing properties after server or managed instance creation, other existing APIs should be used. See [Managing Azure AD-only authentication using APIs](authentication-azure-ad-only-authentication.md#managing-azure-ad-only-authentication-using-apis) and [Configure and manage Azure AD authentication with Azure SQL](authentication-aad-configure.md) for more information.

> [!NOTE]
> If Azure AD-only authentication is set to false, which it is by default, a server admin and password will need to be included in all APIs during server or managed instance creation.

## Azure SQL Database

# [The Azure CLI](#tab/azure-cli)

The Azure CLI command `az sql server create` is used to provision a new Azure SQL logical server. The below command will provision a new server with Azure AD-only authentication enabled.

The server SQL Administrator login will be automatically created and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this server creation, the SQL Administrator login won't be used.

The server Azure AD admin will be the account you set for `<AzureADAccount>`, and can be used to manage the server.

Replace the following values in the example:

- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`
- `<AzureADAccountSID>`: The Azure AD Object ID for the user
- `<ResourceGroupName>`: Name of the resource group for your Azure SQL logical server
- `<ServerName>`: Use a unique Azure SQL logical server name

```azurecli
az sql server create --enable-ad-only-auth --external-admin-principal-type User --external-admin-name <AzureADAccount> --external-admin-sid <AzureADAccountSID> -g <ResourceGroupName> -n <ServerName>
```

For more information, see [az sql server create](/cli/azure/sql/server#az_sql_server_create).

To check the server status after creation, see the following command:

```azurecli
az sql server show --name <ServerName> --resource-group <ResourceGroupName> --expand-ad-admin
```

# [PowerShell](#tab/azure-powershell)

The PowerShell command `New-AzSqlServer` is used to provision a new Azure SQL logical server. The below command will provision a new server with Azure AD-only authentication enabled. 

The server SQL Administrator login will be automatically created and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this server creation, the SQL Administrator login won't be used.

The server Azure AD admin will be the account you set for `<AzureADAccount>`, and can be used to manage the server.

Replace the following values in the example:

- `<ResourceGroupName>`: Name of the resource group for your Azure SQL logical server
- `<Location>`: Location of the server, such as `West US`, or `Central US`
- `<ServerName>`: Use a unique Azure SQL logical server name
- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`

```powershell
New-AzSqlServer -ResourceGroupName "<ResourceGroupName>" -Location "<Location>" -ServerName "<ServerName>" -ServerVersion "12.0" -ExternalAdminName "<AzureADAccount>" -EnableActiveDirectoryOnlyAuthentication
```

For more information, see [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver).

# [Rest API](#tab/rest-api)

The [Servers - Create Or Update](/rest/api/sql/2020-11-01-preview/servers/create-or-update) Rest API can be used to create an Azure SQL logical server with Azure AD-only authentication enabled during provisioning. 

The script below will provision a Azure SQL logical server, set the Azure AD admin as `<AzureADAccount>`, and enable Azure AD-only authentication. The server SQL Administrator login will also be created automatically and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this provisioning, the SQL Administrator login won't be used.

The Azure AD admin, `<AzureADAccount>` can be used to manage the server when the provisioning is complete.

Replace the following values in the example:

- `<tenantId>`: Can be found by going to the [Azure portal](https://portal.azure.com), and going to your **Azure Active Directory** resource. In the **Overview** pane, you should see your **Tenant ID**
- `<subscriptionId>`: Your subscription ID can be found in the Azure portal
- `<ServerName>`: Use a unique Azure SQL logical server name
- `<ResourceGroupName>`: Name of the resource group for your Azure SQL logical server
- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`
- `<Location>`: Location of the server, such as `westus2`, or `centralus`
- `<objectId>`: Can be found by going to the [Azure portal](https://portal.azure.com), and going to your **Azure Active Directory** resource. In the **User** pane, search for the Azure AD user and find their **Object ID**

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

# Enable Azure AD-only auth 
# No server admin is specified, and only Azure AD admin and Azure AD-only authentication is set to true
# Server admin (login and password) is generated by the system

# Authentication body
# The sid is the Azure AD Object ID for the user 

$body = '{ 
"location": "<Location>",
"properties": { "administrators":{ "login":"<AzureADAccount>", "sid":"<objectId>", "tenantId":"<tenantId>", "principalType":"User", "azureADOnlyAuthentication":true }
  }
}'

# Provision the server

Invoke-RestMethod -Uri https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/servers/$serverName/?api-version=2020-11-01-preview -Method PUT -Headers $authHeader -Body $body -ContentType "application/json"
```

To check the server status, you can use the following script:

```rest
$uri = 'https://management.azure.com/subscriptions/'+$subscriptionId+'/resourceGroups/'+$resourceGroupName+'/providers/Microsoft.Sql/servers/'+$serverName+'?api-version=2020-11-01-preview&$expand=administrators/activedirectory'

$responce=Invoke-WebRequest -Uri $uri -Method PUT -Headers $authHeader -Body $body -ContentType "application/json"

$responce.statuscode

$responce.content
```

# [ARM Template](#tab/arm-template)

For more information and ARM templates, see [Azure Resource Manager templates for Azure SQL Database & SQL Managed Instance](arm-templates-content-guide.md).

To provision a SQL logical server with an Azure AD admin set for the server and Azure AD-only authentication enabled using an ARM Template, see our [Azure SQL logical server with Azure AD-only authentication](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.sql/sql-logical-server-aad-only-auth) quickstart template.

You can also use the following template. Use a [Custom deployment in the Azure portal](https://portal.azure.com/#create/Microsoft.Template), and **Build your own template in the editor**. Next, **Save** the configuration once you pasted in the example.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.1",
    "parameters": {
        "server": {
            "type": "string",
            "defaultValue": "[uniqueString('sql', resourceGroup().id)]",
            "metadata": {
                "description": "The name of the SQL logical server."
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
        }
    },
    "resources": [
        {
            "type": "Microsoft.Sql/servers",
            "apiVersion": "2020-11-01-preview",
            "name": "[parameters('server')]",
            "location": "[parameters('location')]",
            "properties": {
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

## Azure SQL Managed Instance

# [The Azure CLI](#tab/azure-cli)

The Azure CLI command `az sql mi create` is used to provision a new Azure SQL Managed Instance. The below command will provision a new managed instance with Azure AD-only authentication enabled.

> [!NOTE]
> The script requires a virtual network and subnet be created as a prerequisite.

The managed instance SQL Administrator login will be automatically created and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this provision, the SQL Administrator login won't be used.

The Azure AD admin will be the account you set for `<AzureADAccount>`, and can be used to manage the instance when the provisioning is complete.

Replace the following values in the example:

- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`
- `<AzureADAccountSID>`: The Azure AD Object ID for the user
- `<managedinstancename>`: Name the managed instance you want to create
- `<ResourceGroupName>`: Name of the resource group for your managed instance. The resource group should also include the virtual network and subnet created
- The `subnet` parameter needs to be updated with the `<Subscription ID>`, `<ResourceGroupName>`, `<VNetName>`, and `<SubnetName>`. Your subscription ID can be found in the Azure portal

```azurecli
az sql mi create --enable-ad-only-auth --external-admin-principal-type User --external-admin-name <AzureADAccount> --external-admin-sid <AzureADAccountSID> -g <ResourceGroupName> -n <managedinstancename> --subnet /subscriptions/<Subscription ID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/<VNetName>/subnets/<SubnetName>
```

For more information, see [az sql mi create](/cli/azure/sql/mi#az_sql_mi_create).

# [PowerShell](#tab/azure-powershell)

The PowerShell command `New-AzSqlInstance` is used to provision a new Azure SQL Managed Instance. The below command will provision a new managed instance with Azure AD-only authentication enabled.

> [!NOTE]
> The script requires a virtual network and subnet be created as a prerequisite.

The managed instance SQL Administrator login will be automatically created and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this provision, the SQL Administrator login won't be used.

The Azure AD admin will be the account you set for `<AzureADAccount>`, and can be used to manage the instance when the provisioning is complete.

Replace the following values in the example:

- `<managedinstancename>`: Name the managed instance you want to create
- `<ResourceGroupName>`: Name of the resource group for your managed instance. The resource group should also include the virtual network and subnet created
- `<Location>`: Location of the server, such as `West US`, or `Central US`
- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`
- The `SubnetId` parameter needs to be updated with the `<Subscription ID>`, `<ResourceGroupName>`, `<VNetName>`, and `<SubnetName>`. Your subscription ID can be found in the Azure portal


```powershell
New-AzSqlInstance -Name "<managedinstancename>" -ResourceGroupName "<ResourceGroupName>" -ExternalAdminName "<AzureADAccount>" -EnableActiveDirectoryOnlyAuthentication -Location "<Location>" -SubnetId "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/<VNetName>/subnets/<SubnetName>" -LicenseType LicenseIncluded -StorageSizeInGB 1024 -VCore 16 -Edition "GeneralPurpose" -ComputeGeneration Gen4
```

For more information, see [New-AzSqlInstance](/powershell/module/az.sql/new-azsqlinstance).

# [Rest API](#tab/rest-api)

The [Managed Instances - Create Or Update](/rest/api/sql/2020-11-01-preview/managed-instances/create-or-update) Rest API can be used to create a managed instance with Azure AD-only authentication enabled during provisioning.

> [!NOTE]
> The script requires a virtual network and subnet be created as a prerequisite.

The script below will provision a managed instance, set the Azure AD admin as `<AzureADAccount>`, and enable Azure AD-only authentication. The instance SQL Administrator login will also be created automatically and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this provisioning, the SQL Administrator login won't be used.

The Azure AD admin, `<AzureADAccount>` can be used to manage the instance when the provisioning is complete.

Replace the following values in the example:

- `<tenantId>`: Can be found by going to the [Azure portal](https://portal.azure.com), and going to your **Azure Active Directory** resource. In the **Overview** pane, you should see your **Tenant ID**
- `<subscriptionId>`: Your subscription ID can be found in the Azure portal
- `<instanceName>`: Use a unique managed instance name
- `<ResourceGroupName>`: Name of the resource group for your Azure SQL logical server
- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`
- `<Location>`: Location of the server, such as `westus2`, or `centralus`
- `<objectId>`: Can be found by going to the [Azure portal](https://portal.azure.com), and going to your **Azure Active Directory** resource. In the **User** pane, search for the Azure AD user and find their **Object ID**
- The `subnetId` parameter needs to be updated with the `<ResourceGroupName>`, the `Subscription ID`, `<VNetName>`, and `<SubnetName>`


```rest
Import-Module Azure
Import-Module MSAL.PS

$tenantId = '<tenantId>'
$clientId = '1950a258-227b-4e31-a9cf-717495945fc2' # Static Microsoft client ID used for getting a token
$subscriptionId = '<subscriptionId>'
$uri = "urn:ietf:wg:oauth:2.0:oob" 
$instanceName = "<instanceName>"
$resourceGroupName = "<ResourceGroupName>"
$scopes ="https://management.core.windows.net/.default"

Login-AzAccount -tenantId $tenantId

# Login as an Azure AD user with permission to provision a managed instance

$result = Get-MsalToken -RedirectUri $uri -ClientId $clientId -TenantId $tenantId -Scopes $scopes

$authHeader = @{
'Content-Type'='application\json; '
'Authorization'=$result.CreateAuthorizationHeader()
}

$body = '{
"name": "<instanceName>", "type": "Microsoft.Sql/managedInstances", "identity": { "type": "SystemAssigned"},"location": "<Location>", "sku": {"name": "GP_Gen5", "tier": "GeneralPurpose", "family":"Gen5","capacity": 8},
"properties": {"administrators":{ "login":"<AzureADAccount>", "sid":"<objectId>", "tenantId":"<tenantId>", "principalType":"User", "azureADOnlyAuthentication":true },
"subnetId": "/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/<VNetName>/subnets/<SubnetName>",
"licenseType": "LicenseIncluded", "vCores": 8, "storageSizeInGB": 2048, "collation": "SQL_Latin1_General_CP1_CI_AS", "proxyOverride": "Proxy", "timezoneId": "UTC", "privateEndpointConnections": [], "storageAccountType": "GRS", "zoneRedundant": false 
  }
}'

# To provision the instance, execute the `PUT` command

Invoke-RestMethod -Uri https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/managedInstances/$instanceName/?api-version=2020-11-01-preview -Method PUT -Headers $authHeader -Body $body -ContentType "application/json"

```

To check the results, execute the `GET` command:

```rest
Invoke-RestMethod -Uri https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/managedInstances/$instanceName/?api-version=2020-11-01-preview -Method GET -Headers $authHeader  | Format-List
```

# [ARM Template](#tab/arm-template)

To provision a new managed instance, virtual network and subnet, with an Azure AD admin set for the instance and Azure AD-only authentication enabled, use the following template.

Use a [Custom deployment in the Azure portal](https://portal.azure.com/#create/Microsoft.Template), and **Build your own template in the editor**. Next, **Save** the configuration once you pasted in the example.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.1",
    "parameters": {
        "managedInstanceName": {
            "type": "String",
            "metadata": {
                "description": "Enter managed instance name."
            }
        },
        "aad_admin_name": {
            "type": "String",
            "metadata": {
                "description": "The name of the Azure AD admin for the SQL managed instance."
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
        "location": {
            "defaultValue": "[resourceGroup().location]",
            "type": "String",
            "metadata": {
                "description": "Enter location. If you leave this field blank resource group location would be used."
            }
        },
        "virtualNetworkName": {
            "type": "String",
            "defaultValue": "SQLMI-VNET",
            "metadata": {
                "description": "Enter virtual network name. If you leave this field blank name will be created by the template."
            }
        },
        "addressPrefix": {
            "defaultValue": "10.0.0.0/16",
            "type": "String",
            "metadata": {
                "description": "Enter virtual network address prefix."
            }
        },
        "subnetName": {
            "type": "String",
            "defaultValue": "ManagedInstances",
            "metadata": {
                "description": "Enter subnet name. If you leave this field blank name will be created by the template."
            }
        },
        "subnetPrefix": {
            "defaultValue": "10.0.0.0/24",
            "type": "String",
            "metadata": {
                "description": "Enter subnet address prefix."
            }
        },
        "skuName": {
            "defaultValue": "GP_Gen5",
            "allowedValues": [
                "GP_Gen5",
                "BC_Gen5"
            ],
            "type": "String",
            "metadata": {
                "description": "Enter sku name."
            }
        },
        "vCores": {
            "defaultValue": 16,
            "allowedValues": [
                8,
                16,
                24,
                32,
                40,
                64,
                80
            ],
            "type": "Int",
            "metadata": {
                "description": "Enter number of vCores."
            }
        },
        "storageSizeInGB": {
            "defaultValue": 256,
            "minValue": 32,
            "maxValue": 8192,
            "type": "Int",
            "metadata": {
                "description": "Enter storage size."
            }
        },
        "licenseType": {
            "defaultValue": "LicenseIncluded",
            "allowedValues": [
                "BasePrice",
                "LicenseIncluded"
            ],
            "type": "String",
            "metadata": {
                "description": "Enter license type."
            }
        }
    },
    "variables": {
        "networkSecurityGroupName": "[concat('SQLMI-', parameters('managedInstanceName'), '-NSG')]",
        "routeTableName": "[concat('SQLMI-', parameters('managedInstanceName'), '-Route-Table')]"
    },
    "resources": [
        {
            "type": "Microsoft.Network/networkSecurityGroups",
            "apiVersion": "2020-06-01",
            "name": "[variables('networkSecurityGroupName')]",
            "location": "[parameters('location')]",
            "properties": {
                "securityRules": [
                    {
                        "name": "allow_tds_inbound",
                        "properties": {
                            "description": "Allow access to data",
                            "protocol": "Tcp",
                            "sourcePortRange": "*",
                            "destinationPortRange": "1433",
                            "sourceAddressPrefix": "VirtualNetwork",
                            "destinationAddressPrefix": "*",
                            "access": "Allow",
                            "priority": 1000,
                            "direction": "Inbound"
                        }
                    },
                    {
                        "name": "allow_redirect_inbound",
                        "properties": {
                            "description": "Allow inbound redirect traffic to Managed Instance inside the virtual network",
                            "protocol": "Tcp",
                            "sourcePortRange": "*",
                            "destinationPortRange": "11000-11999",
                            "sourceAddressPrefix": "VirtualNetwork",
                            "destinationAddressPrefix": "*",
                            "access": "Allow",
                            "priority": 1100,
                            "direction": "Inbound"
                        }
                    },
                    {
                        "name": "deny_all_inbound",
                        "properties": {
                            "description": "Deny all other inbound traffic",
                            "protocol": "*",
                            "sourcePortRange": "*",
                            "destinationPortRange": "*",
                            "sourceAddressPrefix": "*",
                            "destinationAddressPrefix": "*",
                            "access": "Deny",
                            "priority": 4096,
                            "direction": "Inbound"
                        }
                    },
                    {
                        "name": "deny_all_outbound",
                        "properties": {
                            "description": "Deny all other outbound traffic",
                            "protocol": "*",
                            "sourcePortRange": "*",
                            "destinationPortRange": "*",
                            "sourceAddressPrefix": "*",
                            "destinationAddressPrefix": "*",
                            "access": "Deny",
                            "priority": 4096,
                            "direction": "Outbound"
                        }
                    }
                ]
            }
        },
        {
            "type": "Microsoft.Network/routeTables",
            "apiVersion": "2020-06-01",
            "name": "[variables('routeTableName')]",
            "location": "[parameters('location')]",
            "properties": {
                "disableBgpRoutePropagation": false
            }
        },
        {
            "type": "Microsoft.Network/virtualNetworks",
            "apiVersion": "2020-06-01",
            "name": "[parameters('virtualNetworkName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[variables('routeTableName')]",
                "[variables('networkSecurityGroupName')]"
            ],
            "properties": {
                "addressSpace": {
                    "addressPrefixes": [
                        "[parameters('addressPrefix')]"
                    ]
                },
                "subnets": [
                    {
                        "name": "[parameters('subnetName')]",
                        "properties": {
                            "addressPrefix": "[parameters('subnetPrefix')]",
                            "routeTable": {
                                "id": "[resourceId('Microsoft.Network/routeTables', variables('routeTableName'))]"
                            },
                            "networkSecurityGroup": {
                                "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
                            },
                            "delegations": [
                                {
                                    "name": "miDelegation",
                                    "properties": {
                                        "serviceName": "Microsoft.Sql/managedInstances"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            "type": "Microsoft.Sql/managedInstances",
            "apiVersion": "2020-11-01-preview",
            "name": "[parameters('managedInstanceName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[parameters('virtualNetworkName')]"
            ],
            "sku": {
                "name": "[parameters('skuName')]"
            },
            "identity": {
                "type": "SystemAssigned"
            },
            "properties": {
                "subnetId": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('virtualNetworkName'), parameters('subnetName'))]",
                "storageSizeInGB": "[parameters('storageSizeInGB')]",
                "vCores": "[parameters('vCores')]",
                "licenseType": "[parameters('licenseType')]",
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

### Grant Directory Readers permissions

Once the deployment is complete for your managed instance, you may notice that the Managed Instance needs **Read** permissions to access Azure Active Directory. Read permissions can be granted by clicking on the displayed message in the Azure portal by a person with enough privileges. For more information, see [Directory Readers role in Azure Active Directory for Azure SQL](authentication-aad-directory-readers-role.md).

:::image type="content" source="media/authentication-azure-ad-only-authentication/azure-ad-portal-read-permissions.png" alt-text="screenshot of the Active Directory admin menu in Azure portal showing Read permissions needed":::

## Limitations

- Creating a server or instance using the Azure portal with Azure AD-only authentication enabled during provisioning is currently not supported.
- To reset the server administrator password, Azure AD-only authentication must be disabled.
- If Azure AD-only authentication is disabled, you must create a server with a server admin and password when using all APIs.

## Next steps

- If you already have a SQL server or managed instance, and just want to enable Azure AD-only authentication, see [Tutorial: Enable Azure Active Directory only authentication with Azure SQL](authentication-azure-ad-only-authentication-tutorial.md).
- For more information on the Azure AD-only authentication feature, see [Azure AD-only authentication with Azure SQL](authentication-azure-ad-only-authentication.md).