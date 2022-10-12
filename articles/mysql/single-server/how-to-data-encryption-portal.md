---
title: Data encryption - Azure portal - Azure Database for MySQL
description: Learn how to set up and manage data encryption for your Azure Database for MySQL by using the Azure portal.
ms.service: mysql
ms.subservice: single-server
author: mksuni
ms.author: sumuth
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 06/20/2022
---

# Data encryption for Azure Database for MySQL by using the Azure portal

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Learn how to use the Azure portal to set up and manage data encryption for your Azure Database for MySQL.

## Prerequisites for Azure CLI

* You must have an Azure subscription and be an administrator on that subscription.
* In Azure Key Vault, create a key vault and a key to use for a customer-managed key.
* The key vault must have the following properties to use as a customer-managed key:
  * [Soft delete](../../key-vault/general/soft-delete-overview.md)

    ```azurecli-interactive
    az resource update --id $(az keyvault show --name \ <key_vault_name> -o tsv | awk '{print $1}') --set \ properties.enableSoftDelete=true
    ```

  * [Purge protected](../../key-vault/general/soft-delete-overview.md#purge-protection)

    ```azurecli-interactive
    az keyvault update --name <key_vault_name> --resource-group <resource_group_name>  --enable-purge-protection true
    ```
  * Retention days set to 90 days
  
    ```azurecli-interactive
    az keyvault update --name <key_vault_name> --resource-group <resource_group_name>  --retention-days 90
    ```

* The key must have the following attributes to use as a customer-managed key:
  * No expiration date
  * Not disabled
  * Perform **get**, **wrap**, **unwrap** operations
  * recoverylevel attribute set to **Recoverable** (this requires soft-delete enabled with retention period set to 90 days)
  * Purge protection enabled

  You can verify the above attributes of the key by using the following command:

  ```azurecli-interactive
  az keyvault key show --vault-name <key_vault_name> -n <key_name>
  ```

* The Azure Database for MySQL - Single Server should be on General Purpose or Memory Optimized pricing tier and on general purpose storage v2. Before you proceed further, refer limitations for [data encryption with customer managed keys](concepts-data-encryption-mysql.md#limitations).
## Set the right permissions for key operations

1. In Key Vault, select **Access policies** > **Add Access Policy**.

   :::image type="content" source="media/concepts-data-access-and-security-data-encryption/show-access-policy-overview.png" alt-text="Screenshot of Key Vault, with Access policies and Add Access Policy highlighted":::

2. Select **Key permissions**, and select **Get**, **Wrap**, **Unwrap**, and the **Principal**, which is the name of the MySQL server. If your server principal can't be found in the list of existing principals, you need to register it. You're prompted to register your server principal when you attempt to set up data encryption for the first time, and it fails.

   :::image type="content" source="media/concepts-data-access-and-security-data-encryption/access-policy-wrap-unwrap.png" alt-text="Access policy overview":::

3. Select **Save**.

## Set data encryption for Azure Database for MySQL

1. In Azure Database for MySQL, select **Data encryption** to set up the customer-managed key.

   :::image type="content" source="media/concepts-data-access-and-security-data-encryption/data-encryption-overview.png" alt-text="Screenshot of Azure Database for MySQL, with Data encryption highlighted":::

2. You can either select a key vault and key pair, or enter a key identifier.

   :::image type="content" source="media/concepts-data-access-and-security-data-encryption/setting-data-encryption.png" alt-text="Screenshot of Azure Database for MySQL, with data encryption options highlighted":::

3. Select **Save**.

4. To ensure all files (including temp files) are fully encrypted, restart the server.

## Using Data encryption for restore or replica servers

After Azure Database for MySQL is encrypted with a customer's managed key stored in Key Vault, any newly created copy of the server is also encrypted. You can make this new copy either through a local or geo-restore operation, or through a replica (local/cross-region) operation. So for an encrypted MySQL server, you can use the following steps to create an encrypted restored server.

1. On your server, select **Overview** > **Restore**.

   :::image type="content" source="media/concepts-data-access-and-security-data-encryption/show-restore.png" alt-text="Screenshot of Azure Database for MySQL, with Overview and Restore highlighted":::

   Or for a replication-enabled server, under the **Settings** heading, select **Replication**.

   :::image type="content" source="media/concepts-data-access-and-security-data-encryption/mysql-replica.png" alt-text="Screenshot of Azure Database for MySQL, with Replication highlighted":::

2. After the restore operation is complete, the new server created is encrypted with the primary server's key. However, the features and options on the server are disabled, and the server is inaccessible. This prevents any data manipulation, because the new server's identity hasn't yet been given permission to access the key vault.

   :::image type="content" source="media/concepts-data-access-and-security-data-encryption/show-restore-data-encryption.png" alt-text="Screenshot of Azure Database for MySQL, with Inaccessible status highlighted":::

3. To make the server accessible, revalidate the key on the restored server. Select **Data encryption** > **Revalidate key**.

   > [!NOTE]
   > The first attempt to revalidate will fail, because the new server's service principal needs to be given access to the key vault. To generate the service principal, select **Revalidate key**, which will show an error but generates the service principal. Thereafter, refer to [these steps](#set-the-right-permissions-for-key-operations) earlier in this article.

   :::image type="content" source="media/concepts-data-access-and-security-data-encryption/show-revalidate-data-encryption.png" alt-text="Screenshot of Azure Database for MySQL, with revalidation step highlighted":::

   You will have to give the key vault access to the new server. For more information, see [Assign a Key Vault access policy](../../key-vault/general/assign-access-policy.md?tabs=azure-portal).

4. After registering the service principal, revalidate the key again, and the server resumes its normal functionality.

   :::image type="content" source="media/concepts-data-access-and-security-data-encryption/restore-successful.png" alt-text="Screenshot of Azure Database for MySQL, showing restored functionality":::

## Next steps

* [Validating data encryption for Azure Database for MySQL](how-to-data-encryption-validation.md)
* [Troubleshoot data encryption in Azure Database for MySQL](how-to-data-encryption-troubleshoot.md)
* [Data encryption with customer-managed key concepts](concepts-data-encryption-mysql.md).
