---
title: Data encryption - Azure CLI - Azure Database for MySQL
description: Learn how to set up and manage data encryption for your Azure Database for MySQL by using the Azure CLI.
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: conceptual
ms.date: 03/30/2020
---

# Data encryption for Azure Database for MySQL by using the Azure CLI

Learn how to use the Azure CLI to set up and manage data encryption for your Azure Database for MySQL.

## Prerequisites for Azure CLI

* You must have an Azure subscription and be an administrator on that subscription.
* Create a key vault and a key to use for a customer-managed key. Also enable purge protection and soft delete on the key vault.

    ```azurecli-interactive
    az keyvault create -g <resource_group> -n <vault_name> --enable-soft-delete true --enable-purge-protection true
    ```

* In the created Azure Key Vault, create the key that will be used for the data encryption of the Azure Database for MySQL.

    ```azurecli-interactive
    az keyvault key create --name <key_name> -p software --vault-name <vault_name>
    ```

* In order to use an existing key vault, it must have the following properties to use as a customer-managed key:
  * [Soft delete](../key-vault/general/overview-soft-delete.md)

    ```azurecli-interactive
    az resource update --id $(az keyvault show --name \ <key_vault_name> -o tsv | awk '{print $1}') --set \ properties.enableSoftDelete=true
    ```

  * [Purge protected](../key-vault/general/overview-soft-delete.md#purge-protection)

    ```azurecli-interactive
    az keyvault update --name <key_vault_name> --resource-group <resource_group_name>  --enable-purge-protection true
    ```

* The key must have the following attributes to use as a customer-managed key:
  * No expiration date
  * Not disabled
  * Perform **get**, **wrap**, **unwrap** operations

## Set the right permissions for key operations

1. There are two ways of getting the managed identity for your Azure Database for MySQL.

    ### Create an new Azure Database for MySQL server with a managed identity.

    ```azurecli-interactive
    az mysql server create --name -g <resource_group> --location <locations> --storage-size <size>  -u <user>-p <pwd> --backup-retention <7> --sku-name <sku name> --geo-redundant-backup <Enabled/Disabled>  --assign-identity
    ```

    ### Update an existing the Azure Database for MySQL server to get a managed identity.

    ```azurecli-interactive
    az mysql server update --name  <server name>  -g <resource_group> --assign-identity
    ```

2. Set the **Key permissions** (**Get**, **Wrap**, **Unwrap**) for the **Principal**, which is the name of the MySQL server.

    ```azurecli-interactive
    az keyvault set-policy --name -g <resource_group> --key-permissions get unwrapKey wrapKey --object-id <principal id of the server>
    ```

## Set data encryption for Azure Database for MySQL

1. Enable Data encryption for the Azure Database for MySQL using the key created in the Azure Key Vault.

    ```azurecli-interactive
    az mysql server key create –name  <server name>  -g <resource_group> --kid <key url>
    ```

    Key url:  `https://YourVaultName.vault.azure.net/keys/YourKeyName/01234567890123456789012345678901>`

## Using Data encryption for restore or replica servers

After Azure Database for MySQL is encrypted with a customer's managed key stored in Key Vault, any newly created copy of the server is also encrypted. You can make this new copy either through a local or geo-restore operation, or through a replica (local/cross-region) operation. So for an encrypted MySQL server, you can use the following steps to create an encrypted restored server.

### Creating a restored/replica server

  *  [Create a restore server](howto-restore-server-cli.md) 
  *  [Create a read replica server](howto-read-replicas-cli.md) 

### Once the server is restored, revalidate data encryption the restored server

    ```azurecli-interactive
    az mysql server key create –name  <server name> -g <resource_group> --kid <key url>
    ```

## Additional capability for the key being used for the Azure Database for MySQL

### Get the Key used

    ```azurecli-interactive
    az mysql server key show --name  <server name>  -g <resource_group> --kid <key url>
    ```

    Key url:  `https://YourVaultName.vault.azure.net/keys/YourKeyName/01234567890123456789012345678901>`

### List the Key used

    ```azurecli-interactive
    az mysql server key list --name  <server name>  -g <resource_group>
    ```

### Drop the key being used

    ```azurecli-interactive
    az mysql server key delete -g <resource_group> --kid <key url> 
    ```

## Using an Azure Resource Manager template to enable data encryption

Apart from the Azure portal, you can also enable data encryption on your Azure Database for MySQL server using Azure Resource Manager templates for new and existing servers.

### For a new server

Use one of the pre-created Azure Resource Manager templates to provision the server with data encryption enabled:
[Example with Data encryption](https://github.com/Azure/azure-mysql/tree/master/arm-templates/ExampleWithDataEncryption)

This Azure Resource Manager template creates an Azure Database for MySQL server and uses the **KeyVault** and **Key** passed as parameters to enable data encryption on the server.

### For an existing server
Additionally, you can use Azure Resource Manager templates to enable data encryption on your existing Azure Database for MySQL servers.

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
      "type": "Microsoft.DBforMySQL/servers",
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
        "[resourceId('Microsoft.DBforMySQL/servers', parameters('serverName'))]"
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
                    "objectId": "[reference(resourceId('Microsoft.DBforMySQL/servers/', parameters('serverName')), '2017-12-01', 'Full').identity.principalId]",
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
      "type": "Microsoft.DBforMySQL/servers/keys",
      "apiVersion": "2020-01-01-preview",
      "dependsOn": [
        "addAccessPolicy",
        "[resourceId('Microsoft.DBforMySQL/servers', parameters('serverName'))]"
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

 To learn more about data encryption, see [Azure Database for MySQL data encryption with customer-managed key](concepts-data-encryption-mysql.md).
