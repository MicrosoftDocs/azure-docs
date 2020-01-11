---
title: Data Encryption for Azure Database for PostgreSQL Single server using Portal
description: Data Encryption for Azure Database for PostgreSQL Single server using Portal
author: kummanish
ms.author: manishku
ms.service: postgresql
ms.topic: conceptual
ms.date: 01/10/2020
---

# Data Encryption for Azure Database for PostgreSQL Single server using Portal

In this article, you will learn how to setup and manage use the Azure portal to setup Data encryption for your Azure Database for PostgreSQL Single server.

## Prerequisites for PowerShell

* You must have an Azure subscription and be an administrator on that subscription.
* You must have Azure PowerShell installed and running.
* Create an Azure Key Vault and Key to use for customer managed key.
    * Instruction for using a hardware security model (HSM) and Key Vault 
* The Key vault must have the following property to used as a customers managed key
    * [Soft Delete](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-ovw-soft-delete)

        ```azurecli-interactive
            az resource update --id $(az keyvault show --name \ <key_valut_name> -test -o tsv | awk '{print $1}') --set \ properties.enableSoftDelete=true
        ```
    
    * [Purge protected](https://docs.microsoft.com/en-us/azure/key-vault/key-vault-ovw-soft-delete#purge-protection)

        ```azurecli-interactive
        az keyvault update --name <key_valut_name> --resource-group <resource_group_name>  --enable-purge-protection true
        ```
* The key must have the following attributes to be used for customer managed key.
    * No expiration date
    * Not disabled
    * Able to perform get, wrap key, unwrap key operations

## Setting the right permissions for key operations

1. On the Azure Key Vault, select the **Access Policies** and, **Add Access Policy** 

![Access policy overview](media/concepts-data-access-and-security-data-encryption/show-access-policy-overview.png)

2. Under the **Key Permissions** select **Get**, **Wrap**, **Unwrap** and the **Pincipal** which is the name of the PostgreSQL server.

![Access policy overview](media/concepts-data-access-and-security-data-encryption/access-policy-warp-unwrap.png)

3. **Save** the settings.

## Setting Data encryption for Azure Database for PostgreSQL Single server

1. On the **Azure Database for PostgreSQL**, select the **Data Encryption** to set the customer managed key setup.

![Setting Data encryption](media/concepts-data-access-and-security-data-encryption/data-encryption-overview.png)

2. You can either select a **Key Vault** and **Key** pair or pass a **Key identifier**.

![Setting Key Vault](media/concepts-data-access-and-security-data-encryption/setting-data-encryption.png)

3. **Save** the settings.


## Restoring the server from a local or geo redundant backup

Once a Azure Database for PostgreSQL Single server is encrypted with customers managed key stored in the Key Vault, any newly created copy of the server either though local or geo-restore operation. So for a encrypted PostgreSQL server, you can follow the steps below to create a encrypted restored server.

1. On the Azure portal select the **Restore** button to trigger the restore operation.

![Setting Key Vault](media/concepts-data-access-and-security-data-encryption/show-restore.png)