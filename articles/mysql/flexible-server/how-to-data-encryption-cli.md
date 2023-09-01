---
title: Set data encryption for Azure Database for MySQL - Flexible Server by using the Azure CLI
description: Learn how to set up and manage data encryption for your Azure Database for MySQL - Flexible Server using Azure CLI.
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 11/21/2022
ms.service: mysql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli, devx-track-arm-template
ms.topic: how-to
---

# Data encryption for Azure Database for MySQL - Flexible Server with Azure CLI

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This tutorial shows you how to set up and manage data encryption for your Azure Database for MySQL - Flexible Server using Azure CLI.

In this tutorial, you learn how to:

- Create a MySQL flexible server with data encryption
- Update an existing MySQL flexible server with data encryption
- Using an Azure Resource Manager template to enable data encryption

## Prerequisites

- An Azure account with an active subscription.

- If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free) before you begin.

    > [!NOTE]  
    > With an Azure free account, you can now try Azure Database for MySQL - Flexible Server for free for 12 months. For more information, see [Try Flexible Server for free](how-to-deploy-on-azure-free-account.md).

- Install or upgrade Azure CLI to the latest version. See [Install Azure CLI](/cli/azure/install-azure-cli).

- Sign in to Azure account using the [az login](/cli/azure/reference-index#az-login) command. Note the ID property, which refers to the Subscription ID for your Azure account:

```azurecli-interactive
az login
```

- If you have multiple subscriptions, choose the appropriate subscription in which you want to create the server using the az account set command:

```azurecli-interactive
az account set --subscription \<subscription id\>
```

- In Azure Key Vault, create a key vault and a key. The key vault must have the following properties to use as a customer-managed key:

[Soft delete](../../key-vault/general/soft-delete-overview.md):

```azurecli-interactive
az resource update --id $(az keyvault show --name \ \<key\_vault\_name\> -o tsv | awk '{print $1}') --set \ properties.enableSoftDelete=true
```

[Purge protected](../../key-vault/general/soft-delete-overview.md#purge-protection):

```azurecli-interactive
az keyvault update --name \<key\_vault\_name\> --resource-group \<resource\_group\_name\> --enable-purge-protection true
```

Retention days set to 90 days:

```azurecli-interactive
az keyvault update --name \<key\_vault\_name\> --resource-group \<resource\_group\_name\> --retention-days 90
```

The key must have the following attributes to use as a customer-managed key:

  - No expiration dates
  - Not disabled
  - Perform **List** , **Get** , **Wrap** , **Unwrap** operations
  - **recoverylevel** attribute set to Recoverable (this requires soft-delete enabled with retention period set to 90 days)
  - **Purge protection** enabled

You can verify the above attributes of the key by using the following command:

```azurecli-interactive
az keyvault key show --vault-name \<key\_vault\_name\> -n \<key\_name\>
```

## Update an existing MySQL flexible server with data encryption

Set or change key and identity for data encryption:

```azurecli-interactive
az mysql flexible-server update --resource-group testGroup --name testserver \\ --key \<key identifier of newKey\> --identity newIdentity
```

Disable data encryption for flexible server:

```azurecli-interactive
az mysql flexible-server update --resource-group testGroup --name testserver --disable-data-encryption
```

## Create flexible server with geo redundant backup and data encryption enabled

```azurecli-interactive
az mysql flexible-server create -g testGroup -n testServer --location testLocation \\
--geo-redundant-backup Enabled \\
--key <key identifier of testKey> --identity testIdentity \\
--backup-key <key identifier of testBackupKey> --backup-identity testBackupIdentity
```

Set or change key, identity, backup key and backup identity for data encryption with geo redundant backup:

```azurecli-interactive
az mysql flexible-server update --resource-group testGroup --name testserver \\ --key \<key identifier of newKey\> --identity newIdentity \\  --backup-key \<key identifier of newBackupKey\> --backup-identity newBackupIdentity
```

## Use an Azure Resource Manager template to enable data encryption

The params **identityUri** and **primaryKeyUri** are the resource ID of the user managed identity and the user managed key, respectively.

```json
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "administratorLogin": {
            "type": "string"
        },
        "administratorLoginPassword": {
            "type": "securestring"
        },
        "location": {
            "type": "string"
        },
        "serverName": {
            "type": "string"
        },
        "serverEdition": {
            "type": "string"
        },
        "vCores": {
            "type": "int",
            "defaultValue": 4
        },
        "storageSizeGB": {
            "type": "int"
        },
        "haEnabled": {
            "type": "string",
            "defaultValue": "Disabled"
        },
        "availabilityZone": {
            "type": "string"
        },
        "standbyAvailabilityZone": {
            "type": "string"
        },
        "version": {
            "type": "string"
        },
        "tags": {
            "type": "object",
            "defaultValue": {}
        },
        "backupRetentionDays": {
            "type": "int"
        },
        "geoRedundantBackup": {
            "type": "string"
        },
        "vmName": {
            "type": "string",
            "defaultValue": "Standard_B1ms"
        },
        "storageIops": {
            "type": "int"
        },
        "storageAutogrow": {
            "type": "string",
            "defaultValue": "Enabled"
        },
        "autoIoScaling": {
            "type": "string",
            "defaultValue": "Disabled"
        },
        "vnetData": {
            "type": "object",
            "metadata": {
                "description": "Vnet data is an object which contains all parameters pertaining to vnet and subnet"
            },
            "defaultValue": {
                "virtualNetworkName": "testVnet",
                "subnetName": "testSubnet",
                "virtualNetworkAddressPrefix": "10.0.0.0/16",
                "virtualNetworkResourceGroupName": "[resourceGroup().name]",
                "location": "eastus2",
                "subscriptionId": "[subscription().subscriptionId]",
                "subnetProperties": {},
                "isNewVnet": false,
                "subnetNeedsUpdate": false,
                "Network": {}
            }
        },
        "identityUri": {
            "type": "string",
            "metadata": {
                "description": "The resource ID of the identity used for data encryption"
            }
        },
        "primaryKeyUri": {
            "type": "string",
            "metadata": {
                "description": "The resource ID of the key used for data encryption"
            }
        }
    },
    "variables": {
        "api": "2021-05-01",
        "identityData": "[if(empty(parameters('identityUri')), json('null'), createObject('type', 'UserAssigned', 'UserAssignedIdentities', createObject(parameters('identityUri'), createObject())))]",
        "dataEncryptionData": "[if(or(empty(parameters('identityUri')), empty(parameters('primaryKeyUri'))), json('null'), createObject('type', 'AzureKeyVault', 'primaryUserAssignedIdentityId', parameters('identityUri'), 'primaryKeyUri', parameters('primaryKeyUri')))]"
    },
    "resources": [
        {
            "apiVersion": "[variables('api')]",
            "location": "[parameters('location')]",
            "name": "[parameters('serverName')]",
            "identity": "[variables('identityData')]",
            "properties": {
                "version": "[parameters('version')]",
                "administratorLogin": "[parameters('administratorLogin')]",
                "administratorLoginPassword": "[parameters('administratorLoginPassword')]",
                "Network": "[if(empty(parameters('vnetData').Network), json('null'), parameters('vnetData').Network)]",
                "Storage": {
                    "StorageSizeGB": "[parameters('storageSizeGB')]",
                    "Iops": "[parameters('storageIops')]",
                    "Autogrow": "[parameters('storageAutogrow')]",
                    "AutoIoScaling": "[parameters('autoIoScaling')]"
                },
                "Backup": {
                    "backupRetentionDays": "[parameters('backupRetentionDays')]",
                    "geoRedundantBackup": "[parameters('geoRedundantBackup')]"
                },
                "availabilityZone": "[parameters('availabilityZone')]",
                "highAvailability": {
                    "mode": "[parameters('haEnabled')]",
                    "standbyAvailabilityZone": "[parameters('standbyAvailabilityZone')]"
                },
                "dataEncryption": "[variables('dataEncryptionData')]"
            },
            "sku": {
                "name": "[parameters('vmName')]",
                "tier": "[parameters('serverEdition')]",
                "capacity": "[parameters('vCores')]"
            },
            "tags": "[parameters('tags')]",
            "type": "Microsoft.DBforMySQL/flexibleServers"
        }
    ]
}
```

## Next steps

- [Customer managed keys data encryption](concepts-customer-managed-key.md)
- [Data encryption with Azure portal](how-to-data-encryption-portal.md)
