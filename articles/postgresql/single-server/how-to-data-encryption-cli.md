---
title: Data encryption - Azure CLI - for Azure Database for PostgreSQL - Single server
description: Learn how to set up and manage data encryption for your Azure Database for PostgreSQL Single server by using the Azure CLI.
ms.service: postgresql
ms.subservice: single-server
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.topic: how-to
ms.date: 06/24/2022
ms.custom: devx-track-azurecli, devx-track-arm-template
---

# Data encryption for Azure Database for PostgreSQL Single server by using the Azure CLI

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Learn how to use the Azure CLI to set up and manage data encryption for your Azure Database for PostgreSQL Single server.

## Prerequisites for Azure CLI

* You must have an Azure subscription and be an administrator on that subscription.
* Create a key vault and a key to use for a customer-managed key. Also enable purge protection and soft delete on the key vault.

   ```azurecli-interactive
   az keyvault create -g <resource_group> -n <vault_name> --enable-soft-delete true --enable-purge-protection true
   ```

* In the created Azure Key Vault, create the key that will be used for the data encryption of the Azure Database for PostgreSQL Single server.

   ```azurecli-interactive
   az keyvault key create --name <key_name> -p software --vault-name <vault_name>
   ```

* In order to use an existing key vault, it must have the following properties to use as a customer-managed key:
  * [Soft delete](../../key-vault/general/soft-delete-overview.md)

      ```azurecli-interactive
      az resource update --id $(az keyvault show --name \ <key_vault_name> -o tsv | awk '{print $1}') --set \ properties.enableSoftDelete=true
      ```

  * [Purge protected](../../key-vault/general/soft-delete-overview.md#purge-protection)

      ```azurecli-interactive
      az keyvault update --name <key_vault_name> --resource-group <resource_group_name>  --enable-purge-protection true
      ```

* The key must have the following attributes to use as a customer-managed key:
  * No expiration date
  * Not disabled
  * Perform **get**, **wrap** and **unwrap** operations

## Set the right permissions for key operations

1. There are two ways of getting the managed identity for your Azure Database for PostgreSQL Single server.

    ### Create an new Azure Database for PostgreSQL server with a managed identity.

    ```azurecli-interactive
    az postgres server create --name <server_name> -g <resource_group> --location <location> --storage-size <size>  -u <user> -p <pwd> --backup-retention <7> --sku-name <sku name> --geo-redundant-backup <Enabled/Disabled> --assign-identity
    ```

    ### Update an existing the Azure Database for PostgreSQL server to get a managed identity.

    ```azurecli-interactive
    az postgres server update --resource-group <resource_group> --name <server_name> --assign-identity
    ```

2. Set the **Key permissions** (**Get**, **Wrap**, **Unwrap**) for the **Principal**, which is the name of the PostgreSQL Single server server.

    ```azurecli-interactive
    az keyvault set-policy --name -g <resource_group> --key-permissions get unwrapKey wrapKey --object-id <principal id of the server>
    ```

## Set data encryption for Azure Database for PostgreSQL Single server

1. Enable Data encryption for the Azure Database for PostgreSQL Single server using the key created in the Azure Key Vault.

    ```azurecli-interactive
    az postgres server key create --name <server_name> -g <resource_group> --kid <key_url>
    ```

    Key url:  `https://YourVaultName.vault.azure.net/keys/YourKeyName/01234567890123456789012345678901>`

## Using Data encryption for restore or replica servers

After Azure Database for PostgreSQL Single server is encrypted with a customer's managed key stored in Key Vault, any newly created copy of the server is also encrypted. You can make this new copy either through a local or geo-restore operation, or through a replica (local/cross-region) operation. So for an encrypted PostgreSQL Single server server, you can use the following steps to create an encrypted restored server.

### Creating a restored/replica server

* [Create a restore server](how-to-restore-server-cli.md)
* [Create a read replica server](how-to-read-replicas-cli.md)

### Once the server is restored, revalidate data encryption the restored server

*    Assign identity for the replica server
```azurecli-interactive
az postgres server update --name  <server name>  -g <resource_group> --assign-identity
```

*    Get the existing key that has to be used for the restored/replica server

```azurecli-interactive
az postgres server key list --name  '<server_name>'  -g '<resource_group_name>'
```

*    Set the policy for the new identity for the restored/replica server

```azurecli-interactive
az keyvault set-policy --name <keyvault> -g <resource_group> --key-permissions get unwrapKey wrapKey --object-id <principl id of the server returned by the step 1>
```

* Re-validate the restored/replica server with the encryption key

```azurecli-interactive
az postgres server key create –name  <server name> -g <resource_group> --kid <key url>
```

## Additional capability for the key being used for the Azure Database for PostgreSQL Single server

### Get the Key used

```azurecli-interactive
az postgres server key show --name <server name>  -g <resource_group> --kid <key url>
```

Key url: `https://YourVaultName.vault.azure.net/keys/YourKeyName/01234567890123456789012345678901>`

### List the Key used

```azurecli-interactive
az postgres server key list --name  <server name>  -g <resource_group>
```

### Drop the key being used

```azurecli-interactive
az postgres server key delete -g <resource_group> --kid <key url> 
```

## Using an Azure Resource Manager template to enable data encryption

Apart from Azure portal, you can also enable data encryption on your Azure Database for PostgreSQL single server using Azure Resource Manager templates for new and existing server.

### For an existing server

Additionally, you can use Azure Resource Manager templates to enable data encryption on your existing Azure Database for PostgreSQL Single servers.

* Pass the Resource ID of the Azure Key Vault key that you copied earlier under the `Uri` property in the properties object.

* Use *2020-01-01-preview* as the API version.

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string"
    },
    "serverName": {
      "type": "string"
    },
    "keyVaultName": {
      "type": "string",
      "metadata": {
        "description": "Key vault name where the key to use is stored"
      }
    },
    "keyVaultResourceGroupName": {
      "type": "string",
      "metadata": {
        "description": "Key vault resource group name where it is stored"
      }
    },
    "keyName": {
      "type": "string",
      "metadata": {
        "description": "Key name in the key vault to use as encryption protector"
      }
    },
    "keyVersion": {
      "type": "string",
      "metadata": {
        "description": "Version of the key in the key vault to use as encryption protector"
      }
    }
  },
  "variables": {
    "serverKeyName": "[concat(parameters('keyVaultName'), '_', parameters('keyName'), '_', parameters('keyVersion'))]"
  },
  "resources": [
    {
      "type": "Microsoft.DBforPostgreSQL/servers",
      "apiVersion": "2017-12-01",
      "kind": "",
      "location": "[parameters('location')]",
      "identity": {
        "type": "SystemAssigned"
      },
      "name": "[parameters('serverName')]",
      "properties": {
      }
    },
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2019-05-01",
      "name": "addAccessPolicy",
      "resourceGroup": "[parameters('keyVaultResourceGroupName')]",
      "dependsOn": [
        "[resourceId('Microsoft.DBforPostgreSQL/servers', parameters('serverName'))]"
      ],
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.KeyVault/vaults/accessPolicies",
              "name": "[concat(parameters('keyVaultName'), '/add')]",
              "apiVersion": "2018-02-14-preview",
              "properties": {
                "accessPolicies": [
                  {
                    "tenantId": "[subscription().tenantId]",
                    "objectId": "[reference(resourceId('Microsoft.DBforPostgreSQL/servers/', parameters('serverName')), '2017-12-01', 'Full').identity.principalId]",
                    "permissions": {
                      "keys": [
                        "get",
                        "wrapKey",
                        "unwrapKey"
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    },
    {
      "name": "[concat(parameters('serverName'), '/', variables('serverKeyName'))]",
      "type": "Microsoft.DBforPostgreSQL/servers/keys",
      "apiVersion": "2020-01-01-preview",
      "dependsOn": [
        "addAccessPolicy",
        "[resourceId('Microsoft.DBforPostgreSQL/servers', parameters('serverName'))]"
      ],
      "properties": {
        "serverKeyType": "AzureKeyVault",
        "uri": "[concat(reference(resourceId(parameters('keyVaultResourceGroupName'), 'Microsoft.KeyVault/vaults/', parameters('keyVaultName')), '2018-02-14-preview', 'Full').properties.vaultUri, 'keys/', parameters('keyName'), '/', parameters('keyVersion'))]"
      }
    }
  ]
}
```

## Next steps

 To learn more about data encryption, see [Azure Database for PostgreSQL Single server data encryption with customer-managed key](concepts-data-encryption-postgresql.md).
