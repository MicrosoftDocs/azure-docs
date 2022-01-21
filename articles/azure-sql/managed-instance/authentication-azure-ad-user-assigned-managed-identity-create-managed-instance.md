---
title: Create an Azure SQL Managed Instance using a user-assigned managed identity
description: This article guides you through creating an Azure SQL Managed Instance using a user-assigned managed identity
titleSuffix: Azure SQL Managed Instance
ms.service: sql-managed-instance
ms.subservice: security
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 12/15/2021
---

# Create an Azure SQL Managed Instance with a user-assigned managed identity

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

> [!NOTE]
> User-assigned managed identity for Azure SQL is in **public preview**. If you are looking for a guide on Azure SQL Database, see [Create an Azure SQL logical server using a user-assigned managed identity](../database/authentication-azure-ad-user-assigned-managed-identity-create-server.md)

This how-to guide outlines the steps to create an [Azure SQL Managed Instance](sql-managed-instance-paas-overview.md) with a [user-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). For more information on the benefits of using a user-assigned managed identity for the server identity in Azure SQL Database, see [User-assigned managed identity in Azure AD for Azure SQL](../database/authentication-azure-ad-user-assigned-managed-identity.md).

## Prerequisites

-  To provision a Managed Instance with a user-assigned managed identity, the [SQL Managed Instance Contributor](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) role (or a role with greater permissions), along with an Azure RBAC role containing the following action is required:
   - Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action - For example, the [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) has this action.
- Create a user-assigned managed identity and assign it the necessary permission to be a server or managed instance identity. For more information, see [Manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) and [user-assigned managed identity permissions for Azure SQL](../database/authentication-azure-ad-user-assigned-managed-identity.md#permissions).
- [Az.Sql module 3.4](https://www.powershellgallery.com/packages/Az.Sql/3.4.0) or higher is required when using PowerShell for user-assigned managed identities.
- [The Azure CLI 2.26.0](/cli/azure/install-azure-cli) or higher is required to use the Azure CLI with user-assigned managed identities.
- For a list of limitations and known issues with using user-assigned managed identity, see [User-assigned managed identity in Azure AD for Azure SQL](../database/authentication-azure-ad-user-assigned-managed-identity.md#limitations-and-known-issues)

# [Portal](#tab/azure-portal)

1. Browse to the [Select SQL deployment](https://portal.azure.com/#create/Microsoft.AzureSQL) option page in the Azure portal.

1. If you aren't already signed in to Azure portal, sign in when prompted.

1. Under **SQL managed instances**, leave **Resource type** set to **Single instance**, and select **Create**.

1. Fill out the mandatory information required on the **Basics** tab for **Project details** and **Managed Instance details**. This is a minimum set of information required to provision a SQL Managed Instance.

   :::image type="content" source="media/authentication-azure-ad-user-assigned-managed-identity-create-managed-instance/managed-instance-create-basic.png" alt-text="Azure portal screenshot of the create Managed Instance basic tab":::

   For more information on the configuration options, see [Quickstart: Create an Azure SQL Managed Instance](../managed-instance/instance-create-quickstart.md).

1. Under **Authentication**, select a preferred authentication model. If you're looking to only configure [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md), see our guide [here](../database/authentication-azure-ad-only-authentication-create-server.md?tabs=azure-portal).

1. Next, go through the **Networking** tab configuration, or leave the default settings.

1. On the Security tab, under **Identity (preview)**, select **Configure Identities**.

    :::image type="content" source="media/authentication-azure-ad-user-assigned-managed-identity-create-managed-instance/create-instance-configure-identities.png" alt-text="Screenshot of Azure portal security settings of the create managed instance process":::

1. On the **Identity (preview)** blade, under **User assigned managed identity**, select **Add**. Select the desired **Subscription** and then under **User assigned managed identities** select the desired user assigned managed identity from the selected subscription. Then select the **Select** button. 

    :::image type="content" source="media/authentication-azure-ad-user-assigned-managed-identity-create-managed-instance/managed-instance-user-assigned-managed-identity-configuration.png" alt-text="Azure portal screenshot of adding user assigned managed identity when configuring managed instance identity":::

    :::image type="content" source="../database/media/authentication-azure-ad-user-assigned-managed-identity/select-a-user-assigned-managed-identity.png" alt-text="Azure portal screenshot of user assigned managed identity when configuring managed instance identity":::

1. Under **Primary identity**, select the same user-assigned managed identity selected in the previous step.

    :::image type="content" source="../database/media/authentication-azure-ad-user-assigned-managed-identity/select-a-primary-identity.png" alt-text="Azure portal screenshot of selecting primary identity for the managed instance":::

    > [!NOTE]
    > If the system-assigned managed identity is the primary identity, the **Primary identity** field must be empty.

1. Select **Apply**

1. You can leave the rest of the settings default. For more information on other tabs and settings, follow the guide in the article [Quickstart: Create an Azure SQL Managed Instance](../managed-instance/instance-create-quickstart.md).

1. Once you are done with configuring your settings, select **Review + create** to proceed. Select **Create** to start provisioning the managed instance.

# [The Azure CLI](#tab/azure-cli)

The Azure CLI command `az sql mi create` is used to provision a new Azure SQL Managed Instance. The below command will provision a managed instance with a user-assigned managed identity, and also enable [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md).

> [!NOTE]
> The script requires a virtual network and subnet be created as a prerequisite.

The managed instance SQL Administrator login will be automatically created and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this provision, the SQL Administrator login won't be used.

The Azure AD admin will be the account you set for `<AzureADAccount>`, and can be used to manage the instance when the provisioning is complete.

Replace the following values in the example:

- `<subscriptionId>`: Your subscription ID can be found in the Azure portal
- `<ResourceGroupName>`: Name of the resource group for your managed instance. The resource group should also include the virtual network and subnet created
- `<managedIdentity>`: The user-assigned managed identity. Can also be used as the primary identity.
- `<primaryIdentity>`: The primary identity you want to use as the instance identity
- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`
- `<AzureADAccountSID>`: The Azure AD Object ID for the user
- `<managedinstancename>`: Name the managed instance you want to create
- The `subnet` parameter needs to be updated with the `<subscriptionId>`, `<ResourceGroupName>`, `<VNetName>`, and `<SubnetName>`.

```azurecli
az sql mi create --assign-identity --identity-type UserAssigned --user-assigned-identity-id /subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<managedIdentity> --primary-user-assigned-identity-id /subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<primaryIdentity> --enable-ad-only-auth --external-admin-principal-type User --external-admin-name <AzureADAccount> --external-admin-sid <AzureADAccountSID> -g <ResourceGroupName> -n <managedinstancename> --subnet /subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/<VNetName>/subnets/<SubnetName>
```

For more information, see [az sql mi create](/cli/azure/sql/mi#az_sql_mi_create).

> [!NOTE]
> The above example provisions a managed instance with only a user-assigned managed identity. You could set the `--identity-type` to be `UserAssigned,SystemAssigned` if you wanted both types of managed identities to be created with the instance.

# [PowerShell](#tab/azure-powershell)

The PowerShell command `New-AzSqlInstance` is used to provision a new Azure SQL Managed Instance. The below command will provision a managed instance with a user-assigned managed identity, and also enable [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md).

> [!NOTE]
> The script requires a virtual network and subnet be created as a prerequisite.

The managed instance SQL Administrator login will be automatically created and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this provision, the SQL Administrator login won't be used.

The Azure AD admin will be the account you set for `<AzureADAccount>`, and can be used to manage the instance when the provisioning is complete.

Replace the following values in the example:

- `<managedinstancename>`: Name the managed instance you want to create
- `<ResourceGroupName>`: Name of the resource group for your managed instance. The resource group should also include the virtual network and subnet created
- `<subscriptionId>`: Your subscription ID can be found in the Azure portal
- `<managedIdentity>`: The user-assigned managed identity. Can also be used as the primary identity.
- `<primaryIdentity>`: The primary identity you want to use as the instance identity
- `<Location>`: Location of the managed instance, such as `West US`, or `Central US`
- `<AzureADAccount>`: Can be an Azure AD user or group. For example, `DummyLogin`
- The `SubnetId` parameter needs to be updated with the `<subscriptionId>`, `<ResourceGroupName>`, `<VNetName>`, and `<SubnetName>`.


```powershell
New-AzSqlInstance -Name "<managedinstancename>" -ResourceGroupName "<ResourceGroupName>" -AssignIdentity -IdentityType "UserAssigned" -UserAssignedIdentityId "/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<managedIdentity>" -PrimaryUserAssignedIdentityId "/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<primaryIdentity>" -ExternalAdminName "<AzureADAccount>" -EnableActiveDirectoryOnlyAuthentication -Location "<Location>" -SubnetId "/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Network/virtualNetworks/<VNetName>/subnets/<SubnetName>" -LicenseType LicenseIncluded -StorageSizeInGB 1024 -VCore 16 -Edition "GeneralPurpose" -ComputeGeneration Gen5
```

For more information, see [New-AzSqlInstance](/powershell/module/az.sql/new-azsqlinstance).

> [!NOTE]
> The above example provisions a managed instance with only a user-assigned managed identity. You could set the You could set the `-IdentityType` to be `"UserAssigned,SystemAssigned"` if you wanted both types of managed identities to be created with the instance.

# [Rest API](#tab/rest-api)

The [Managed Instances - Create Or Update](/rest/api/sql/2020-11-01-preview/managed-instances/create-or-update) Rest API can be used to create a managed instance with a user-assigned managed identity.

> [!NOTE]
> The script requires a virtual network and subnet be created as a prerequisite.

The script below will provision a managed instance with a user-assigned managed identity, set the Azure AD admin as `<AzureADAccount>`, and enable [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md). The instance SQL Administrator login will also be created automatically and the password will be set to a random password. Since SQL Authentication connectivity is disabled with this provisioning, the SQL Administrator login won't be used.

The Azure AD admin, `<AzureADAccount>` can be used to manage the instance when the provisioning is complete.

Replace the following values in the example:

- `<tenantId>`: Can be found by going to the [Azure portal](https://portal.azure.com), and going to your **Azure Active Directory** resource. In the **Overview** pane, you should see your **Tenant ID**
- `<subscriptionId>`: Your subscription ID can be found in the Azure portal
- `<instanceName>`: Use a unique managed instance name
- `<ResourceGroupName>`: Name of the resource group for your logical server
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
"name": "<instanceName>", "type": "Microsoft.Sql/managedInstances", "identity": {"type" : "UserAssigned", "UserAssignedIdentities" : {"/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<managedIdentity>" : {}}},"location": "<Location>", "sku": {"name": "GP_Gen5", "tier": "GeneralPurpose", "family":"Gen5","capacity": 8},
"properties": { "PrimaryUserAssignedIdentityId":"/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<primaryIdentity>","administrators":{ "login":"<AzureADAccount>", "sid":"<objectId>", "tenantId":"<tenantId>", "principalType":"User", "azureADOnlyAuthentication":true },
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

To provision a new managed instance with a user-assigned managed identity, virtual network and subnet, with an Azure AD admin set for the instance and Azure AD-only authentication enabled, use the following template.

Use a [Custom deployment in the Azure portal](https://portal.azure.com/#create/Microsoft.Template), and **Build your own template in the editor**. Next, **Save** the configuration once you pasted in the example.

To get your user-assigned managed identity **Resource ID**, search for **Managed Identities** in the [Azure portal](https://portal.azure.com). Find your managed identity, and go to **Properties**. An example of your UMI **Resource ID** will look like `/subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<managedIdentity>`.

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
        "user_identity_resource_id": {
            "defaultValue": "",
            "type": "String",
            "metadata": {
                "description": "The Resource ID of the user-assigned managed identity, in the form of /subscriptions/<subscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<managedIdentity>."
            }
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
                "type": "UserAssigned",
                "UserAssignedIdentities": {
                    "[parameters('user_identity_resource_id')]": {}
                }
            },
            "properties": {
                "subnetId": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('virtualNetworkName'), parameters('subnetName'))]",
                "storageSizeInGB": "[parameters('storageSizeInGB')]",
                "vCores": "[parameters('vCores')]",
                "licenseType": "[parameters('licenseType')]",
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

- [User-assigned managed identity in Azure AD for Azure SQL](../database/authentication-azure-ad-user-assigned-managed-identity.md)
- [Create an Azure SQL logical server using a user-assigned managed identity](../database/authentication-azure-ad-user-assigned-managed-identity-create-server.md)