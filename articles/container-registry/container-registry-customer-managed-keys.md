---
title: Encrypt with customer-managed key
description: Learn about encryption of data stored in your Azure container registry, and how to encrypt the data with a customer-managed key
ms.topic: article
ms.date: 01/13/2020
ms.custom: 
---

# Encrypt registry data with a customer-managed key 

When you use an Azure container registry to store image data and other artifacts, the Azure Container Registry service automatically encrypts this data at rest. By default, data is encrypted with Microsoft-managed keys. Data in a registry is encrypted and decrypted using 256-bit AES encryption.

For additional control over encryption keys, you can supply a customer-managed key to encrypt the data in a registry. The key must be stored in an Azure key vault. This article shows you how to create and store a key in an Azure key vault, and then create a registry enabled to encrypt data using this key.

This feature is only available in a **Premium** container registry. For information about registry service tiers and limits, see [Azure Container Registry SKUs](container-registry-skus.md).

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations](#preview-limitations) apply. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).
   
## Preview limitations 

* This feature is currently enabled only on a newly created registry.

## Encryption key management

You can rely on Microsoft-managed keys for the encryption of your registry data, or you can manage the encryption with your own keys. The following table compares these options: 

|    |    Microsoft-managed keys     |     Customer-managed keys     |
|----|----|----|
|    Encryption/decryption operations    |    Azure    |    Azure    |
|    Key storage    |    Microsoft key store    |    Azure Key Vault    |
|    Key rotation responsibility    |    Microsoft    |    Customer    |
|    Key access    |    Microsoft only    |    Microsoft, Customer    |

The rest of this article  covers the steps required to encrypt your registry data with a key created and stored in an Azure key vault ß(customer-managed key). 

## Customer-managed key - portal

### Create a key vault and key

For steps, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](../key-vault/quick-create-portal.md).

### Enable soft delete and purge protection

This key vault should have two key protection settings enabled: **Soft delete** and **Purge protection**.

To enable the settings in the portal:

1. Navigate to your key vault.
1. Select **Settings** > **Properties**.
1. In **Soft delete**, select **Enable**. Enter a retention period in days, or accept the default value.
1. In **Purge protection**, select **Enable**. Click **Save**.

### Create key and get key ID

1. Navigate to your key vault.
1. Select **Settings** > **Keys**
1. Select **+Generate/Import** and enter a unique name for the key.
1. Accept the remaining default values and select **Create**.
1. After creation, select the key and select the current key version.
1. On the **Key Version** screen, copy the **Key Identifier**.

## Customer-managed key - CLI

### Create a resource group

If needed, run the [az group create][az-group-create] command to create a resource group for creating the key vault and encryption keys.

```azurecli
az group create --name <resource-group-name> --location <location>
```

### Create a key vault

Create a key vault with [az keyvault create][az-keyvault-create] to store customer-managed keys for registry encryption. This key vault should have two key protection settings enabled: **Soft delete** and **Purge protection**. This following example includes parameters for these settings: 

```azurecli
az keyvault create \
  –-name <key-vault-name> \
  --group <resource-group-name> \
  --enable-soft-delete 
  --enable-purge-protection
```

### Create key and get key ID

Run the [az keyvault key create][az-keyvault-key-create] command to create a key in the key vault key and the corresponding key ID. In this example, the key is stored in the `KEK` variable.

> [!NOTE]
> If you skip this step because you have an existing key, make sure you use a full key ID including version.

```bash
 KEK=$(az keyvault key create --name <key-name> --vault-name <key-vault-name> --query key.kid --output tsv)
 ```

## Create a registry with customer-managed key

Create a registry with a customer-managed encryption key enabled by using the following Resource Manager template. A new container registry and a user-assigned managed identity are created by the template.

Save the following template using a filename such as `CMKtemplate.json`.

```JSON
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vault_name": {
      "defaultValue": "",
      "type": "String"
    },
    "registry_name": {
      "defaultValue": "",
      "type": "String"
    },
    "identity_name": {
      "defaultValue": "",
      "type": "String"
    },
    "kek_id": {
      "type": "String"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.ContainerRegistry/registries",
      "apiVersion": "2019-12-01-preview",
      "name": "[parameters('registry_name')]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Premium",
        "tier": "Premium"
      },
      "identity": {
        "type": "SystemAssigned,UserAssigned",
        "userAssignedIdentities": {
          "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identity_name'))]": {}
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identity_name'))]"
      ],
      "properties": {
        "adminUserEnabled": false,
        "encryption": {
          "status": "enabled",
          "keyVaultProperties": {
            "identity": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identity_name')), '2018-11-30').clientId]",
            "KeyIdentifier": "[parameters('kek_id')]"
          }
        },
        "networkRuleSet": {
          "defaultAction": "Allow",
          "virtualNetworkRules": [],
          "ipRules": []
        },
        "policies": {
          "quarantinePolicy": {
            "status": "disabled"
          },
          "trustPolicy": {
            "type": "Notary",
            "status": "disabled"
          },
          "retentionPolicy": {
            "days": 7,
            "status": "disabled"
          }
        }
      }
    },
    {
      "type": "Microsoft.KeyVault/vaults/accessPolicies",
      "apiVersion": "2018-02-14",
      "name": "[concat(parameters('vault_name'), '/add')]",
      "dependsOn": [
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identity_name'))]"
      ],
      "properties": {
        "accessPolicies": [
          {
            "tenantId": "[subscription().tenantId]",
            "objectId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identity_name')), '2018-11-30').principalId]",
            "permissions": {
              "keys": [
                "get",
                "unwrapKey",
                "wrapKey"
              ]
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "apiVersion": "2018-11-30",
      "name": "[parameters('identity_name')]",
      "location": "[resourceGroup().location]"
    }
  ]
}

```

Run the following [az group deployment create][az-group-deployment-create] command to create the registry using the preceding template file. Where indicated, provide a new registry name and managed identity name, as well as the key vault name and key ID you created in the previous section. 

```bash
az group deployment create \
  --resource-group <resource-group-name> \
  --template-file CMKtemplate.json\
  --parameters \
  registry_name=<registry-name> \
  identity_name=<managed-identity> \
  vault_name=<key-vault-name> \
  kek_id=$KEK
```
### Verify registry encryption settings

Verify the encryption settings on the registry by running the following commands.

Run [az acr show][az-acr-show] to get the resource ID of the registry you created, and store it in the ACR_ID variable:

```azurecli
ACR_ID=$(az acr show --name <registry-name> --query id --output tsv)
```
Then run the [az resource show][az-resource-show] command:

```azurecli
az resource show --id $ACR_ID \
  --query properties.encryption \
  --api-version 2019-12-01-preview
```

The encryption properties indicate that the status is `enabled`.

```console
{
  "keyVaultProperties": {
    "identity": "xxxxxx-...",
    "keyIdentifier": "https://mycontainerregistry.vault.azure.net/keys/..."
  },
  "status": "enabled"
}
```

## Use the registry

After you enable a registry to encrypt data using a customer-managed key, you can perform regular registry operations. For example, you can authenticate with the registry and push Docker images. See example commands in [Push and pull an image](container-registry-get-started-docker-cli.md).

## Key rotation

You can rotate the customer-managed key used in a registry. In your existing key vault or a new one, create a new key and get the key ID, as shown in [Create a key vault and key](#create-a-key-vault-and-key). Then, redeploy the registry using the existing registry name and new key by following the steps in [Create a registry with customer-managed key](#create-a-registry-with-customer-managed-key).

## Next steps

To provide feedback on customer-managed keys for Azure Container Registry, visit the [ACR GitHub site](https://aka.ms/acr/issues).

<!-- LINKS - internal -->

[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-group-create]: /cli/azure/group#az-group-create
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-group-deployment-create]: /cli/azure/group/deployment#az-group-deployment-create
[az-keyvault-create]: /cli/azure/keyvault#az-keyvault-create
[az-keyvault-key-create]: /cli/azure/keyvault/keyt#az-keyvault-key-create
[az-resource-show]: /cli/azure/resource#az-resource-show
[az-acr-create]: /cli/azure/acr#az-acr-create
[az-acr-show]: /cli/azure/acr#az-acr-show