---
title: Encrypt data into a Media Services account using a key in Key Vault
description: Learn how to use the Azure Media Services CLI to encrypt data into a Media Services account using a key in Key Vault
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 05/12/2021
ms.author: inhenkel
---

# Encrypt data into a Media Services account using a key in Key Vault

If you would like Media Services to encrypt data using a key from your Key Vault, the Media Services account must be granted *access* to the Key Vault. Follow the steps below to create a Managed Identity for the Media Services account and grant this identity access to their Key Vault using the Media Services CLI.

## Sign in to Azure

 [!INCLUDE [Sign in to Azure with the CLI](./includes/task-sign-in-azure-cli.md)]

## Resource names

Before you get started, decide on the names of the resources you will create.  They should be easily identifiable as a set, especially if you are not planning to use them after you are done testing. For example, "myMediaTestRG" for your resource group and "myMediaTestStorageAccount".  The names of resources you'll need are:

- your-resource-group-name
- your-storage-account-name
- your-media-services-account-name
- your-keyvault-name
- your-key-name
- your-region

You'll see these names referenced in the commands below. Use the same names for each step.

## Create a resource group

[!INCLUDE [Create a resource group with the CLI](./includes/task-create-resource-group-cli.md)]

## Create a Storage account

[!INCLUDE [Create a Storage account with the CLI](./includes/task-create-storage-account-cli.md)]

## Create a Media Services account

[!INCLUDE [Create a Media Services account with the CLI](./includes/task-create-media-services-account-cli.md)]

## Create a Key Vault

Key Vault is used to encrypt media data.

[!INCLUDE [Create a Media Services account with the CLI](./includes/task-create-key-vault-cli.md)]

## Grant the Media Services System Assigned Managed Identity access to the Key Vault

Grant the Media Services Managed Identity access to the Key Vault. There are two commands:

### Get (show) the Managed Identity of the Media Services account

The first command below shows the Managed Identity of the Media Services account which is the `mediaServiceId`.

```azurecli-interactive
az ams account show --name your-media-services-account-name --resource-group your-resource-group
```

The command returns:

```json
{
  "id": "/subscriptions/the-subscription-id/resourceGroups/your-resource-group-name/providers/Microsoft.Media/mediaservices/your-media-services-account-name",
  "location": "West US 2",
  "mediaServiceId": "00000000-000-0000-0000-000000000000",
  "name": "your-media-services-account-name",
  "resourceGroup": "your-resource-group-name",
  "storageAccounts": [
    {
      "id": "/subscriptions/the-subscription-id/resourceGroups/your-resource-group-name/providers/Microsoft.Storage/storageAccounts/your-storage-account-name",
      "resourceGroup": "your-resource-group-name",
      "type": "Primary"
    }
  ],
  "tags": null,
  "type": "Microsoft.Media/mediaservices"
}
```

### Set the Key Vault policy

The second command grants the Principal ID access to the Key Vault. Set `object-id` to the value of `principalId`.

```azurecli-interactive
az keyvault set-policy \
  --name your-keyvault-name \
  --object-id mediaServiceId-from-show \
  --key-permissions decrypt encrypt get list unwrapKey wrapKey
```

The command returns:

```json
{
  "id": "/subscriptions/the-subscription-id/resourceGroups/your-resource-group-name/providers/Microsoft.KeyVault/vaults/your-keyvault-name",
  "location": "your-region",
  "name": "your-keyvault-name",
  "properties": {
    "accessPolicies": [
      {
        "applicationId": null,
        "objectId": "the-media-services-account-id",
        "permissions": {
          "certificates": [
            "get",
            "list",
            "delete",
            "create",
            "import",
            "update",
            "managecontacts",
            "getissuers",
            "listissuers",
            "setissuers",
            "deleteissuers",
            "manageissuers",
            "recover"
          ],
          "keys": [
            "get",
            "create",
            "delete",
            "list",
            "update",
            "import",
            "backup",
            "restore",
            "recover"
          ],
          "secrets": [
            "get",
            "list",
            "set",
            "delete",
            "backup",
            "restore",
            "recover"
          ],
          "storage": [
            "get",
            "list",
            "delete",
            "set",
            "update",
            "regeneratekey",
            "setsas",
            "listsas",
            "getsas",
            "deletesas"
          ]
        },
        "tenantId": "the-tenant-id"
      },
      {
        "applicationId": null,
        "objectId": "the-media-services-account-id",
        "permissions": {
          "certificates": null,
          "keys": [
            "encrypt",
            "get",
            "list",
            "wrapKey",
            "decrypt",
            "unwrapKey"
          ],
          "secrets": null,
          "storage": null
        },
        "tenantId": "the-tenant-id"
      }
    ],
    "createMode": null,
    "enablePurgeProtection": true,
    "enableRbacAuthorization": null,
    "enableSoftDelete": true,
    "enabledForDeployment": false,
    "enabledForDiskEncryption": null,
    "enabledForTemplateDeployment": null,
    "networkAcls": null,
    "privateEndpointConnections": null,
    "provisioningState": "Succeeded",
    "sku": {
      "name": "standard"
    },
    "softDeleteRetentionInDays": 90,
    "tenantId": "the-tenant-id",
    "vaultUri": "https://your-keyvault-name.vault.azure.net/"
  },
  "resourceGroup": "your-resource-group-name",
  "tags": {},
  "type": "Microsoft.KeyVault/vaults"
}
```

### Set Media Services to use the key from Key Vault

Set Media Services to use the key you've created. The value of the `key-identifier` property comes from the output when the key was created. This command may fail due to the time it takes to propagate access control changes. If this happens, retry after a few minutes.

```azurecli
az ams account encryption set \
  --account-name your-media-services-account-name \
  --resource-group your-resource-group \
  --key-type CustomerKey \
  --key-identifier https://your-keyvault-name.vault.azure.net/keys/mediakey/abc
```

## Test

**MISSING: STEPS FOR TESTING GO HERE.**

## Clean up resources

If you aren't planning to use the resources you created, delete the resource group.

[!INCLUDE [Create a Media Services account with the CLI](./includes/clean-up-resources-cli.md)]
