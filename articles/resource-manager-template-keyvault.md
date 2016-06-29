<properties
   pageTitle="Resource Manager template for key vault | Microsoft Azure"
   description="Shows the Resource Manager schema for deploying key vaults through a template."
   services="azure-resource-manager,key-vault"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/23/2016"
   ms.author="tomfitz"/>

# Key vault template schema

Creates a key vault.

## Schema format

To create a key vault, add the following schema to the resources section of your template.

    {
        "type": "Microsoft.KeyVault/vaults",
        "apiVersion": "2015-06-01",
        "name": string,
        "location": string,
        "properties": {
            "enabledForDeployment": bool,
            "enabledForTemplateDeployment": bool,
            "enabledForVolumeEncryption": bool,
            "tenantId": string,
            "accessPolicies": [
                {
                    "tenantId": string,
                    "objectId": string,
                    "permissions": {
                        "keys": [ keys permissions ],
                        "secrets": [ secrets permissions ]
                    }
                }
            ],
            "sku": {
                "name": enum,
                "family": "A"
            }
        },
        "resources": [
             child resources
        ]
    }

## Values

The following tables describe the values you need to set in the schema.

| Name | Value |
| ---- | ---- | 
| type | Enum<br />Required<br />**Microsoft.KeyVault/vaults**<br /><br />The resource type to create. |
| apiVersion | Enum<br />Required<br />**2015-06-01** or **2014-12-19-preview**<br /><br />The API version to use for creating the resource. | 
| name | String<br />Required<br />A name that is unique across Azure.<br /><br />The name of the key vault to create. Consider using the [uniqueString](resource-group-template-functions.md#uniquestring) function with your naming convention to create a unique name, as shown in the example below. |
| location | String<br />Required<br />A valid region for key vaults. To determine valid regions, see [supported regions](resource-manager-supported-services.md#supported-regions).<br /><br />The region to host the key vault. |
| properties | Object<br />Required<br />[properties object](#properties)<br /><br />An object that specifies the type of key vault to create. |
| resources | Array<br />Optional<br />Permitted values: [Key vault secret resources](resource-manager-template-keyvault-secret.md)<br /><br />Child resources for the key vault. |

<a id="properties" />
### properties object

| Name | Value |
| ---- | ---- | 
| enabledForDeployment | Boolean<br />Optional<br />**true** or **false**<br /><br />Specifies if the vault is enabled for Virtual Machine or Service Fabric deployment. |
| enabledForTemplateDeployment | Boolean<br />Optional<br />**true** or **false**<br /><br />Specifies if the vault is enabled for use in Resource Manager template deployments. For more information, see [Pass secure values during deployment](resource-manager-keyvault-parameter.md) |
| enabledForVolumeEncryption | Boolean<br />Optional<br />**true** or **false**<br /><br />Specifies if the vault is enabled for volume encryption. |
| tenantId | String<br />Required<br />**Globally-unique identifier**<br /><br />The tenant identifier for the subscription. You can retrieve it with the [Get-AzureRmSubscription](https://msdn.microsoft.com/library/azure/mt619284.aspx) PowerShell cmdlet or the **azure account show** Azure CLI command. |
| accessPolicies | Array<br />Required<br />[accessPolicies object](#accesspolicies)<br /><br />An array of up to 16 objects that specify the permissions for the user or service principal. |
| sku | Object<br />Required<br />[sku object](#sku)<br /><br />The SKU for the key vault. |

<a id="accesspolicies" />
### properties.accessPolicies object

| Name | Value |
| ---- | ---- | 
| tenantId | String<br />Required<br />**Globally-unique identifier**<br /><br />The tenant identifier of the Azure Active Directory tenant containing the **objectId** in this access policy |
| objectId | String<br />Required<br />**Globally-unique identifier**<br /><br />The object identifier of the Azure Active Directory user or service principal that will have access to the vault. You can retrieve the value from either the [Get-AzureRmADUser](https://msdn.microsoft.com/library/azure/mt679001.aspx) or the [Get-AzureRmADServicePrincipal](https://msdn.microsoft.com/library/azure/mt678992.aspx) PowerShell cmdlets, or the **azure ad user** or **azure ad sp** Azure CLI commands. |
| permissions | Object<br />Required<br />[permissions object](#permissions)<br /><br />The permissions granted on this vault to the Active Directory object. |

<a id="permissions" />
### properties.accessPolicies.permissions object

| Name | Value |
| ---- | ---- | 
| keys | Array<br />Required<br />**all**, **backup**, **create**, **decrypt**, **delete**, **encrypt**, **get**, **import**, **list**, **restore**, **sign**, **unwrapkey**, **update**, **verify**, **wrapkey**<br /><br />The permissions granted on keys in this vault to this Active Directory object. This value must be specified as an array of one or more permitted values. |
| secrets | Array<br />Required<br />**all**, **delete**, **get**, **list**, **set**<br /><br />The permissions granted on secrets in this vault to this Active Directory object. This value must be specified as an array of one or more permitted values. |

<a id="sku" />
### properties.sku object

| Name | Value |
| ---- | ---- | 
| name | Enum<br />Required<br />**standard**, or **premium** <br /><br />The service tier of KeyVault to use.  Standard supports secrets and software-protected keys.  Premium adds support for HSM-protected keys. |
| family | Enum<br />Required<br />**A** <br /><br />The sku family to use. |
 
	
## Examples

The following example deploys a key vault and secret.

    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "keyVaultName": {
                "type": "string",
                "metadata": {
                    "description": "Name of the vault"
                }
            },
            "tenantId": {
                "type": "string",
                "metadata": {
                   "description": "Tenant ID for the subscription and use assigned access to the vault. Available from the Get-AzureRmSubscription PowerShell cmdlet"
                }
            },
            "objectId": {
                "type": "string",
                "metadata": {
                    "description": "Object ID of the AAD user or service principal that will have access to the vault. Available from the Get-AzureRmADUser or the Get-AzureRmADServicePrincipal cmdlets"
                }
            },
            "keysPermissions": {
                "type": "array",
                "defaultValue": [ "all" ],
                "metadata": {
                    "description": "Permissions to grant user to keys in the vault. Valid values are: all, create, import, update, get, list, delete, backup, restore, encrypt, decrypt, wrapkey, unwrapkey, sign, and verify."
                }
            },
            "secretsPermissions": {
                "type": "array",
                "defaultValue": [ "all" ],
                "metadata": {
                    "description": "Permissions to grant user to secrets in the vault. Valid values are: all, get, set, list, and delete."
                }
            },
            "vaultSku": {
                "type": "string",
                "defaultValue": "Standard",
                "allowedValues": [
                    "Standard",
                    "Premium"
                ],
                "metadata": {
                    "description": "SKU for the vault"
                }
            },
            "enabledForDeployment": {
                "type": "bool",
                "defaultValue": false,
                "metadata": {
                    "description": "Specifies if the vault is enabled for VM or Service Fabric deployment"
                }
            },
            "enabledForTemplateDeployment": {
                "type": "bool",
                "defaultValue": false,
                "metadata": {
                    "description": "Specifies if the vault is enabled for ARM template deployment"
                }
            },
            "enableVaultForVolumeEncryption": {
                "type": "bool",
                "defaultValue": false,
                "metadata": {
                    "description": "Specifies if the vault is enabled for volume encryption"
                }
            },
            "secretName": {
                "type": "string",
                "metadata": {
                    "description": "Name of the secret to store in the vault"
                }
            },
            "secretValue": {
                "type": "securestring",
                "metadata": {
                    "description": "Value of the secret to store in the vault"
                }
            }
        },
        "resources": [
        {
            "type": "Microsoft.KeyVault/vaults",
            "name": "[parameters('keyVaultName')]",
            "apiVersion": "2015-06-01",
            "location": "[resourceGroup().location]",
            "tags": {
                "displayName": "KeyVault"
            },
            "properties": {
                "enabledForDeployment": "[parameters('enabledForDeployment')]",
                "enabledForTemplateDeployment": "[parameters('enabledForTemplateDeployment')]",
                "enabledForVolumeEncryption": "[parameters('enableVaultForVolumeEncryption')]",
                "tenantId": "[parameters('tenantId')]",
                "accessPolicies": [
                {
                    "tenantId": "[parameters('tenantId')]",
                    "objectId": "[parameters('objectId')]",
                    "permissions": {
                        "keys": "[parameters('keysPermissions')]",
                        "secrets": "[parameters('secretsPermissions')]"
                    }
                }],
                "sku": {
                    "name": "[parameters('vaultSku')]",
                    "family": "A"
                }
            },
            "resources": [
            {
                "type": "secrets",
                "name": "[parameters('secretName')]",
                "apiVersion": "2015-06-01",
                "properties": {
                    "value": "[parameters('secretValue')]"
                },
                "dependsOn": [
                    "[concat('Microsoft.KeyVault/vaults/', parameters('keyVaultName'))]"
                ]
            }]
        }]
    }

## Quickstart templates

The following quickstart template deploys a key vault.

- [Create Key Vault](https://azure.microsoft.com/documentation/templates/101-key-vault-create/)


## Next steps

- For general information about key vaults, see [Get started with Azure Key Vault](./key-vault/key-vault-get-started.md).
- For an example of referencing a key vault secret when deploying templates, see [Pass secure values during deployment](resource-manager-keyvault-parameter.md).

