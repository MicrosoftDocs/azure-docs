---
title: Azure Quickstart - Create an Azure key vault and a key by using Azure Resource Manager template | Microsoft Docs
description: Quickstart showing how to create Azure key vaults, and add key to the vaults by using Azure Resource Manager template (ARM template).
services: key-vault
author: msmbaldwin
tags: azure-resource-manager
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.custom: mvc, subject-armqs, mode-arm, devx-track-arm-template
ms.date: 06/28/2022
ms.author: mbaldwin
#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure.
---

# Quickstart: Create an Azure key vault and a key by using ARM template

[Azure Key Vault](../general/overview.md) is a cloud service that provides a secure store for secrets, such as keys, passwords, and certificate. This quickstart focuses on the process of deploying an Azure Resource Manager template (ARM template) to create a key vault and a key.

## Prerequisites

To complete this article:

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- User would need to have an Azure built-in role assigned, recommended role **contributor**. [Learn more here](../../role-based-access-control/role-assignments-portal.md)

## Review the template

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vaultName": {
      "type": "string",
      "metadata": {
        "description": "The name of the key vault to be created."
      }
    },
    "keyName": {
      "type": "string",
      "metadata": {
        "description": "The name of the key to be created."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The location of the resources"
      }
    },
    "skuName": {
      "type": "string",
      "defaultValue": "standard",
      "allowedValues": [
        "standard",
        "premium"
      ],
      "metadata": {
        "description": "The SKU of the vault to be created."
      }
    },
    "keyType": {
      "type": "string",
      "defaultValue": "RSA",
      "allowedValues": [
        "EC",
        "EC-HSM",
        "RSA",
        "RSA-HSM"
      ],
      "metadata": {
        "description": "The JsonWebKeyType of the key to be created."
      }
    },
    "keyOps": {
      "type": "array",
      "defaultValue": [],
      "metadata": {
        "description": "The permitted JSON web key operations of the key to be created."
      }
    },
    "keySize": {
      "type": "int",
      "defaultValue": 2048,
      "metadata": {
        "description": "The size in bits of the key to be created."
      }
    },
    "curveName": {
      "type": "string",
      "defaultValue": "",
      "allowedValues": [
        "",
        "P-256",
        "P-256K",
        "P-384",
        "P-521"
      ],
      "metadata": {
        "description": "The JsonWebKeyCurveName of the key to be created."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.KeyVault/vaults",
      "apiVersion": "2021-11-01-preview",
      "name": "[parameters('vaultName')]",
      "location": "[parameters('location')]",
      "properties": {
        "accessPolicies": [],
        "enableRbacAuthorization": true,
        "enableSoftDelete": true,
        "softDeleteRetentionInDays": "90",
        "enabledForDeployment": false,
        "enabledForDiskEncryption": false,
        "enabledForTemplateDeployment": false,
        "tenantId": "[subscription().tenantId]",
        "sku": {
          "name": "[parameters('skuName')]",
          "family": "A"
        },
        "networkAcls": {
          "defaultAction": "Allow",
          "bypass": "AzureServices"
        }
      }
    },
    {
      "type": "Microsoft.KeyVault/vaults/keys",
      "apiVersion": "2021-11-01-preview",
      "name": "[format('{0}/{1}', parameters('vaultName'), parameters('keyName'))]",
      "properties": {
        "kty": "[parameters('keyType')]",
        "keyOps": "[parameters('keyOps')]",
        "keySize": "[parameters('keySize')]",
        "curveName": "[parameters('curveName')]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.KeyVault/vaults', parameters('vaultName'))]"
      ]
    }
  ],
  "outputs": {
    "proxyKey": {
      "type": "object",
      "value": "[reference(resourceId('Microsoft.KeyVault/vaults/keys', parameters('vaultName'), parameters('keyName')))]"
    }
  }
}
```

Two resources are defined in the template:

- [Microsoft.KeyVault/vaults](/azure/templates/microsoft.keyvault/vaults?tabs=json)
- [Microsoft.KeyVault/vaults/keys](/azure/templates/microsoft.keyvault/vaults/keys?tabs=json)

More Azure Key Vault template samples can be found in [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Keyvault&pageNumber=1&sort=Popular).

## Parameters and definitions

|Parameter  |Definition  |
|---------|---------|
|**keyOps**  | Specifies operations that can be performed by using the key. If you don't specify this parameter, all operations can be performed. The acceptable values for this parameter are a comma-separated list of key operations as defined by the [JSON Web Key (JWK) specification](https://tools.ietf.org/html/draft-ietf-jose-json-web-key-41): <br> `["sign", "verify", "encrypt", "decrypt", " wrapKey", "unwrapKey"]` |
|**CurveName**  |  Elliptic curve (EC) name for EC key type. See [JsonWebKeyCurveName](/rest/api/keyvault/keys/create-key/create-key#jsonwebkeycurvename) |
|**Kty**  |  The type of key to create. For valid values, see [JsonWebKeyType](/rest/api/keyvault/keys/create-key/create-key#jsonwebkeytype) |
|**Tags** | Application-specific metadata in the form of key-value pairs.  |
|**nbf**  |  Specifies the time, as a DateTime object, before which the key can't be used. The format would be Unix time stamp (the number of seconds after Unix Epoch on January 1st, 1970 at UTC).  |
|**exp**  |  Specifies the expiration time, as a DateTime object. The format would be Unix time stamp (the number of seconds after Unix Epoch on January 1st, 1970 at UTC). |

## Deploy the template

You can use [Azure portal](../../azure-resource-manager/templates/deploy-portal.md), Azure PowerShell, Azure CLI, or REST API. To learn about deployment methods, see [Deploy templates](../../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

You can use the Azure portal to check the key vault and the key. Alternatively, use the following Azure CLI or Azure PowerShell script to list the key created.

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter your key vault name:" &&
read keyVaultName &&
az keyvault key list --vault-name $keyVaultName &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$keyVaultName = Read-Host -Prompt "Enter your key vault name"
Get-AzKeyVaultKey -vaultName $keyVaultName
Write-Host "Press [ENTER] to continue..."
```

---

## Creating key using ARM template is different from creating key via data plane

### Creating a key via ARM

- It's only possible to create *new* keys. It isn't possible to update existing keys, nor create new versions of existing keys. If the key already exists, then the existing key is retrieved from storage and used (no write operations will occur).
- To be authorized to use this API, the caller needs to have the **"Microsoft.KeyVault/vaults/keys/write"** role-based access control (RBAC) Action. The built-in "Key Vault Contributor" role is sufficient, since it authorizes all RBAC Actions that match the pattern "Microsoft.KeyVault/*".

  :::image type="content" source="../media/keys-quick-template-1.png" alt-text="Create a key via ARM 1":::
  :::image type="content" source="../media/keys-quick-template-2.png" alt-text="Create a key via ARM 2":::

### Existing API (creating key via data plane)

- It's possible to create new keys, update existing keys, and create new versions of existing keys.
- The caller must be authorized to use this API. If the vault uses access policies, the caller must have "create" key permission; if the vault is enabled for RBAC, the caller must have "Microsoft.KeyVault/vaults/keys/create/action" RBAC DataAction.

## Clean up resources

Other Key Vault quickstarts and tutorials build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.
When no longer needed, delete the resource group, which deletes the Key Vault and related resources. To delete the resource group by using Azure CLI or Azure PowerShell:

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

## Next steps

In this quickstart, you created a key vault and a key using an ARM template, and validated the deployment. To learn more about Key Vault and Azure Resource Manager, see these articles.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Learn more about [Azure Resource Manager](../../azure-resource-manager/management/overview.md)
- Review the [Key Vault security overview](../general/security-features.md)
