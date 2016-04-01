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
   ms.date="02/23/2016"
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

| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| type | enum | Yes | **Microsoft.KeyVault/vaults** | The resource type to create. |
| apiVersion | enum | Yes | **2015-06-01** <br /> **2014-12-19-preview** | The API version to use for creating the resource. | 
| name | string | Yes |   | The name of the key vault to create. The name must be unique across all of Azure. Consider using the [uniqueString](resource-group-template-functions.md#uniquestring) function with your naming convention as shown in the example below. |
| location | string | Yes | To determine valid regions, see [supported regions](resource-manager-supported-services.md#supported-regions).  | The region to host the key vault. |
| properties | object | Yes | ([shown below](#properties)) | An object that specifies the type of key vault to create. |
| resources | array | No | [Key vault secrets](resource-manager-template-keyvault-secret.md)  | Child resources for the key vault. |

<a id="properties" />
### properties object

| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| enabledForDeployment | boolean | No | **true** or **false** | Specifies if the vault is enabled for Virtual Machine or Service Fabric deployment. |
| enabledForTemplateDeployment | boolean | No | **true** or **false** | Specifies if the vault is enabled for use in Resource Manager template deployments. For more information, see [Pass secure values during deployment](resource-manager-keyvault-parameter.md) |
| enabledForVolumeEncryption | boolean | No | **true** or **false** | Specifies if the vault is enabled for volume encryption. |
| tenantId | string | Yes | Globally-unique identifier | The tenant identifier for the subscription. You can retrieve it with the **Get-AzureRMSubscription** PowerShell cmdlet. |
| accessPolicies | array | Yes | ([shown below](#accesspolicies)) | An array of up to 16 objects that specify the permissions for the user or service principal. |
| sku | object | Yes | ([shown below](#sku)) | The SKU for the key vault. |

<a id="accesspolicies" />
### properties.accessPolicies object

| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| tenantId | string | Yes | Globally-unique identifier | The tenant identifier of the Azure Active Directory tenant containing the **objectId** in this access policy |
| objectId | string | Yes | Globally-unique identifier | The object identifier of the AAD user or service principal that will have access to the vault. You can retrieve the value from either the **Get-AzureRMADUser** or the **Get-AzureRMADServicePrincipal** cmdlets. |
| permissions | object | Yes | ([shown below](#permissions)) | The permissions granted on this vault to the Active Directory object. |

<a id="permissions" />
### properties.accessPolicies.permissions object

| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| keys | array | Yes | A comma-separated list of the following values:<br />**all**<br />**backup**<br />**create**<br />**decrypt**<br />**delete**<br />**encrypt**<br />**get**<br />**import**<br />**list**<br />**restore**<br />**sign**<br />**unwrapkey**<br/>**update**<br />**verify**<br />**wrapkey** | The permissions granted on keys in this vault to this Active Directory object. This value must be specified as an array of permitted values. |
| secrets | array | Yes | A comma-separated list of the following values:<br />**all**<br />**delete**<br />**get**<br />**list**<br />**set** | The permissions granted on secrets in this vault to this Active Directory object. This value must be specified as an array of permitted values. |

<a id="sku" />
### properties.sku object

| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| name | enum | Yes | **standard**<br />**premium** | The service tier of KeyVault to use.  Standard supports secrets and software-protected keys.  Premium adds support for HSM-protected keys. |
| family | enum | Yes | **A** | The sku family to use. 
 
	
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
                   "description": "Tenant Id for the subscription and use assigned access to the vault. Available from the Get-AzureRMSubscription PowerShell cmdlet"
                }
            },
            "objectId": {
                "type": "string",
                "metadata": {
                    "description": "Object Id of the AAD user or service principal that will have access to the vault. Available from the Get-AzureRMADUser or the Get-AzureRMADServicePrincipal cmdlets"
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

- [Create Key Vault](https://github.com/Azure/azure-quickstart-templates/tree/master/101-key-vault-create)


## Next steps

- For general information about key vaults, see [Get started with Azure Key Vault](./key-vault/key-vault-get-started.md).
- For an example of referencing a key vault secret when deploying templates, see [Pass secure values during deployment](resource-manager-keyvault-parameter.md).

