---
title: Create an Azure key vault and a vault access policy by using ARM template
description: This article shows how to create Azure key vaults and vault access policies by using an Azure Resource Manager template.
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager
ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 10/5/2020
ms.author: mbaldwin

#Customer intent: As a security admin who's new to Azure, I want to use Key Vault to securely store keys and passwords in Azure.

---

# How to create an Azure key vault and vault access policy by using a Resource Manager template

[Azure Key Vault](../general/overview.md) is a cloud service that provides a secure store for secrets like keys, passwords, and certificates. This article describes the process for deploying an Azure Resource Manager template (ARM template) to create a key vault.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

To complete the steps in this article:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you start.


## Create a Key Vault Resource Manager template

The following template shows a basic way to create a key vault. Some values are specified in the template.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "keyVaultName": {
      "type": "string",
      "metadata": {
        "description": "Specifies the name of the key vault."
      }
    },
    "skuName": {
      "type": "string",
      "defaultValue": "Standard",
      "allowedValues": [
        "Standard",
        "Premium"
      ],
      "metadata": {
        "description": "Specifies whether the key vault is a standard vault or a premium vault."
      }
    }
   },
  "resources": [
    {
      "type": "Microsoft.KeyVault/vaults",
      "apiVersion": "2019-09-01",
      "name": "[parameters('keyVaultName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "enabledForDeployment": "false",
        "enabledForDiskEncryption": "false",
        "enabledForTemplateDeployment": "false",
        "tenantId": "[subscription().tenantId]",
        "accessPolicies": [],
        "sku": {
          "name": "[parameters('skuName')]",
          "family": "A"
        },
        "networkAcls": {
          "defaultAction": "Allow",
          "bypass": "AzureServices"
        }
      }
    }
  ]
}

```

For more about Key Vault template settings, see [Key Vault ARM template reference](https://docs.microsoft.com/azure/templates/microsoft.keyvault/vaults).

> [!IMPORTANT]
> If a template is redeployed, any existing access policies in the key vault will be overridden. We recommend that you populate the `accessPolicies` property with existing access policies to avoid losing access to the key vault. 

## Add an access policy to a Key Vault Resource Manager template

You can deploy access policies to an existing key vault without redeploying the entire key vault template. The following template shows a basic way to create access policies:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "keyVaultName": {
      "type": "string",
      "metadata": {
        "description": "Specifies the name of the key vault."
      }
    },
    "objectId": {
      "type": "string",
      "metadata": {
        "description": "Specifies the object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies. Get it by using Get-AzADUser or Get-AzADServicePrincipal cmdlets."
      }
    },
    "keysPermissions": {
      "type": "array",
      "defaultValue": [
        "list"
      ],
      "metadata": {
        "description": "Specifies the permissions to keys in the vault. Valid values are: all, encrypt, decrypt, wrapKey, unwrapKey, sign, verify, get, list, create, update, import, delete, backup, restore, recover, and purge."
      }
    },
    "secretsPermissions": {
      "type": "array",
      "defaultValue": [
        "list"
      ],
      "metadata": {
        "description": "Specifies the permissions to secrets in the vault. Valid values are: all, get, list, set, delete, backup, restore, recover, and purge."
      }
    },
    "certificatePermissions": {
      "type": "array",
      "defaultValue": [
        "list"
      ],
      "metadata": {
        "description": "Specifies the permissions to certificates in the vault. Valid values are: all,  create, delete, update, deleteissuers, get, getissuers, import, list, listissuers, managecontacts, manageissuers,  recover, backup, restore, setissuers, and purge."
      }
    },
  "resources": [
     {
      "type": "Microsoft.KeyVault/vaults/accessPolicies",
      "name": "[concat(parameters('keyVaultName'), '/add')]",
      "apiVersion": "2019-09-01",
      "properties": {
        "accessPolicies": [
          {
            "tenantId": "[subscription().tenantId]",
            "objectId": "[parameters('objectId')]",
            "permissions": {
              "keys": "[parameters('keysPermissions')]",
              "secrets": "[parameters('secretsPermissions')]",
              "certificates": [parameters('certificatesPermissions')]
            }
          }
        ]
      }
    }
  ]
}

```
For more information about Key Vault template settings, see [Key Vault ARM template reference](https://docs.microsoft.com/azure/templates/microsoft.keyvault/vaults/accesspolicies).

## More Key Vault Resource Manager templates

There are other Resource Manager templates available for Key Vault objects:

| Secrets | Keys | Certificates |
|--|--|--|
|<ul><li>[Quickstart](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-template)<li>[Reference](https://docs.microsoft.com/azure/templates/microsoft.keyvault/vaults/secrets)|N/A|N/A|

More Key Vault templates you can find here: [Key Vault Resource Manager reference](https://docs.microsoft.com/azure/templates/microsoft.keyvault/allversions)

## Deploy the templates

You can use the Azure portal to deploy above templates by using 'Build your own template in editor' option in guide below:
[Deploy resources from custom template](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-portal#deploy-resources-from-custom-template)

You can also save above templates to files and use following commands:  [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) and [az group deployment create](/cli/azure/group/deployment#az-group-deployment-create):

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName ExampleGroup -TemplateFile key-vault-template.json
```

```azurecli
az group deployment create --resource-group ExampleGroup --template-file key-vault-template.json
```

## Clean up resources

If you plan to continue and work on subsequent quickstarts and tutorials, you can leave these resources in place. When the resources are no longer needed, delete the resource group, which deletes the key vault and related resources. To delete the resource group by using the Azure CLI or Azure PowerShell, use the following steps.

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

---

## Resources

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Learn more about [Azure Resource Manager](../../azure-resource-manager/management/overview.md)
- Review [Azure Key Vault best practices](../general/best-practices.md)

## Next steps

- [Secure access to a key vault](secure-your-key-vault.md)
- [Authenticate to a key vault](authentication.md)
- [Azure Key Vault Developer's guide](developers-guide.md)
