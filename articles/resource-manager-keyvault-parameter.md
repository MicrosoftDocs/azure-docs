<properties
   pageTitle="Use Key Vault secret with Resource Manager template | Microsoft Azure"
   description="Shows how to pass a secret from a key vault as a parameter during deployment."
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
   ms.date="12/14/2015"
   ms.author="tomfitz"/>

# Pass secure values during deployment

When you need to pass a secure value (like a password) as a parameter during deployment, you can store that value as a secret in a Key Vault and reference the value in other Resource Manager templates. You include only a reference to the secret 
in your template so the secret is never exposed, and you do not need to manually enter the value for the secret each time you deploy the resources. You can specify which users or 
service principals can access the secret.  


## Deploy a Key Vault and secret

To create Key Vault that can be used with other Resource Manager templates, you must set the **enabledForTemplateDeployment** property to **true**, and you must grant access to the user or 
service principal that will execute the deployment which references the secret. For information and an example of deploying a Key Vault and secret that is configured to work with other deployments, see 
[Key vault template schema](resource-manager-template-keyvault.md) and [Key vault secret template schema](resource-manager-template-keyvault-secret.md).

## Reference a secret

In the template that deploys the resource which needs a secure value, you specify a parameter for the secret as shown below.

    "parameters": {
        "adminPassword": {
            "type": "securestring"
        }
    }

Then, in a parameters file, you reference the secret that contains the password. You reference the secret by passing the resource identifier of the Key Vault and the name of the secret.

    "parameters": {
        "adminPassword": {
            "reference": {
                "keyVault": {
                    "id": "/subscriptions/[guid}/resourceGroups/{group-name}/providers/Microsoft.KeyVault/vaults/{vault-name}"
                }, 
                "secretName": "sqlAdminPassword" 
            } 
        }
    }

## Example template and parameters

The following template deploys a SQL server that requires an administrator password.

    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "sqlsvrAdminLogin": {
                "type": "string",
                "minLength": 4
            },
            "sqlsvrAdminLoginPassword": {
                "type": "securestring"
            },
            "startIpAddress": {
                "type": "string",
                "defaultValue": "0.0.0.0",
                "metadata": {
                    "description": "starting IP address for range of firewall rules"
                }
            },
            "endIpAddress": {
                "type": "string",
                "defaultValue": "0.0.0.0",
                "metadata": {
                    "description": "ending IP address for range of firewall rules"
                }
            }
        },
        "resources": [
        {
            "name": "[variables('sqlsvrName')]",
            "type": "Microsoft.Sql/servers",
            "location": "[resourceGroup().location]",
            "apiVersion": "2014-04-01-preview",
            "dependsOn": [ ],
            "tags": {
                "displayName": "sqlsvr"
            },
            "properties": {
                "administratorLogin": "[parameters('sqlsvrAdminLogin')]",
                "administratorLoginPassword": "[parameters('sqlsvrAdminLoginPassword')]"
            },
            "resources": [
            {
                "name": "AllowIpRange",
                "type": "firewallrules",
                "location": "[resourceGroup().location]",
                "apiVersion": "2014-04-01-preview",
                "dependsOn": [
                    "[concat('Microsoft.Sql/servers/', variables('sqlsvrName'))]"
                ],
               "properties": {
                   "startIpAddress": "[parameters('startIpAddress')]",
                   "endIpAddress": "[parameters('endIpAddress')]"
               }
            }]
        }],
        "variables": {
            "sqlsvrName": "[concat('sqlsvr', uniqueString(resourceGroup().id))]"
        },
        "outputs": { }
    }

The parameter file includes the reference the key vault secret for the password.

    {
        "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "sqlsvrAdminLogin": {
                "value": ""
            },
            "sqlsvrAdminLoginPassword": {
                "reference": {
                    "keyVault": {
                        "id": "/subscriptions/{guid}/resourceGroups/{group-name}/providers/Microsoft.KeyVault/vaults/{vault-name}"
                    },
                    "secretName": "adminPassword"
                }
            }
        }
    }


## Next steps

- For general information about key vaults, see [Get started with Azure Key Vault](./key-vault/key-vault-get-started.md).
- For more information about deploying templates, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md).

