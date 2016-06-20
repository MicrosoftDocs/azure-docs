<properties
   pageTitle="Key Vault secret with Resource Manager template | Microsoft Azure"
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
   ms.date="05/16/2016"
   ms.author="tomfitz"/>

# Pass secure values during deployment

When you need to pass a secure value (like a password) as a parameter during deployment, you can store that value as a secret in an [Azure Key Vault](./key-vault/key-vault-whatis.md) and reference the value in other Resource Manager templates. You include only a reference to the secret 
in your template so the secret is never exposed, and you do not need to manually enter the value for the secret each time you deploy the resources. You specify which users or 
service principals can access the secret.  

## Deploy a key vault and secret

To create key vault that can be referenced from other Resource Manager templates, you must set the **enabledForTemplateDeployment** property to **true**, and you must grant access to the user or 
service principal that will execute the deployment which references the secret.

To learn about deploying a key vault and secret, see 
[Key vault schema](resource-manager-template-keyvault.md) and [Key vault secret schema](resource-manager-template-keyvault-secret.md).

## Reference a secret

You reference the secret from within a parameters file which passes values to your template. You reference the secret by passing the resource identifier of the key vault and the name of the secret.

    "parameters": {
      "adminPassword": {
        "reference": {
          "keyVault": {
            "id": "/subscriptions/{guid}/resourceGroups/{group-name}/providers/Microsoft.KeyVault/vaults/{vault-name}"
          }, 
          "secretName": "sqlAdminPassword" 
        } 
      }
    }

An entire parameter file might look like:

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

The parameter that accepts the secret should be a **securestring**. The following example shows the relevant sections of a template that deploys a SQL server that requires an administrator password.

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
            ...
        },
        "resources": [
        {
            "name": "[variables('sqlsvrName')]",
            "type": "Microsoft.Sql/servers",
            "location": "[resourceGroup().location]",
            "apiVersion": "2014-04-01-preview",
            "properties": {
                "administratorLogin": "[parameters('sqlsvrAdminLogin')]",
                "administratorLoginPassword": "[parameters('sqlsvrAdminLoginPassword')]"
            },
            ...
        }],
        "variables": {
            "sqlsvrName": "[concat('sqlsvr', uniqueString(resourceGroup().id))]"
        },
        "outputs": { }
    }




## Next steps

- For general information about key vaults, see [Get started with Azure Key Vault](./key-vault/key-vault-get-started.md).
- For information about using a key vault with a Virtual Machine, see [Security considerations for Azure Resource Manager](best-practices-resource-manager-security.md).
- For complete examples of referencing key secrets, see [Key Vault examples](https://github.com/rjmax/ArmExamples/tree/master/keyvaultexamples).

