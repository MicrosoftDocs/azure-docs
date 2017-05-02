---
title: Encryption in Azure Data Lake Store | Microsoft Docs
description: Understand how encryption and key rotation works in Azure Data Lake Store
services: data-lake-store
documentationcenter: ''
author: yagupta
manager:
editor:

ms.assetid: 
ms.service: data-lake-store
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 4/14/2017
ms.author: yagupta
---

# Encryption of Data in Azure Data Lake Store

## Overview of Encryption in Azure Data Lake Store

Encryption in Azure Data Lake Store (ADLS) provides you the ability to protect your data, implement enterprise security policies and meet regulatory compliance requirements. This article provides you an overview of the design and discusses technical aspects of how the data lake store implements data encryption.

ADLS supports on by default, transparent, encryption of data at rest. Here is what these terms mean in a bit more detail:

* On by Default: When creating a new Azure Data Lake Store account, the default setting enables encryption. Thereafter, data that is stored in the data lake store is always encrypted prior to storing on persistent media. This is the behavior for all data and it cannot be changed after an account is created.
* Transparent: ADLS automatically encrypts data prior to persisting and decrypts data prior to retrieval. The encryption is configured and managed at the data lake store level by an administrator. No changes are made to the data access APIs and thus no changes are required in applications and services that interact with the data lake store because of encryption.

Data in transit (aka data in motion) is also always encrypted in the data lake store. In addition to encrypting data prior to storing to persistent media, the data is also always secured in transit or in motion by using HTTPS (HTTP over Secure Sockets Layer). HTTPS is the only protocol that is supported for the data lake store REST interfaces.

![Figure 1](./media/data-lake-store-encryption/fig1.png)


## Setting up Encryption with Azure Data Lake Store

Encryption for Azure Data Lake store is set up during account creation, it is always enabled by default. Customers have the choice to either manage keys or allow Azure Data Lake Store (default) to manage the keys for them.

To learn how to set up Encryption with Azure Data Lake Store, see – [Getting Started](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-get-started-portal)

## Under the Hood – How Encryption works in Azure Data Lake Store

### Master Encryption Keys

Azure Data Lake Store provides two modes for management of master encryption keys (MEKs). The usage of master encryption keys is explained in greater detail further below. For now, assume that the master encryption key is the top-level key. Access to the master encryption key is required to decrypt any data that is stored in the data lake store.

The two modes for managing the master encryption key are as follows:

1.	Service Managed Keys
2.	customer-managed Keys

In both modes, the master encryption key is secured by storing it Azure Key Vault. Azure Key Vault is a fully managed, highly secure service on Azure that can be used to safeguard cryptographic keys. You can read more about Azure Key Vault [here](https://azure.microsoft.com/services/key-vault)

Here is a brief comparison of capabilities provided by the two modes of managing the MEKs.

|  | Service Managed Keys | Customer Managed Keys |
| --- | --- | --- |
|How is data stored?|Always encrypted prior to being stored|Always encrypted prior to being stored|
|Where is the Master Encryption Key Stored?|Azure Key Vault|Azure Key Vault|
|Are any encryption keys stored in the clear outside of Azure Key Vault|No|No|
|Can the MEK be retrieved the Azure Key Vault?|No. Once stored in the key vault it can only be used for encryption and decryption.|No. Once stored in the key vault it can only be used for encryption and decryption.|
|Who owns the Azure Key Vault and the MEK?|Azure Data Lake Store service.|The customer owns the Azure Key Vault, which belongs in their own Azure subscription. The MEK in the key vault can be software or hardware (HSM) managed.|
|Can the customer revoke access to the MEK for the Azure Data Lake Store service?|No|Yes. They can manage access control lists on the Azure Key Vault and remove access control entries to the service identity for the Azure Data Lake Store service.|
|Can the customer permanently delete the MEK?|No|Yes. If the customer deletes the MEK from the Azure Key Vault, the data in the ADLS account cannot be decrypted by anybody including the Azure Data Lake Store service. <br><br> If the MEK explicitly backed up by the customer prior to deleting from Azure Key Vault, then it can be restored and the data can then be recovered. However, if the MEK is not backed up by the customer prior to deleting from Azure Key Vault then the data in the ADLS account can never be decrypted thereafter.|


Aside from the top-level difference, of who manages the MEK and the Key Vault in which it resides, the rest of the design is the same for both modes.

There are a few important aspects to remember related to choosing the mode for the master encryption keys.

1.	You can choose whether to use customer-managed keys or ADLS- managed keys when you provision an ADLS account
2.	Once an ADLS account is provisioned, the mode cannot be changed

### Encryption and Decryption of Data

There are three types of keys that are used in the design of data encryption for the Azure Data Lake. The following table summarizes how they play their part:

| Key                   | Abbreviation | Associated-with | Storage Location                             | Type       | Notes                                                                                                   |
|-----------------------|--------------|-----------------|----------------------------------------------|------------|---------------------------------------------------------------------------------------------------------|
| Master Encryption Key | MEK          | An ADLS Account | Azure Key Vault                              | Asymmetric | It can be ADLS-managed or Customer-managed                                                              |
| Data Encryption Key   | DEK          | An ADLS Account | Persistent storage – Managed by ADLS service | Symmetric  | The DEK is encrypted by the MEK and the encrypted DEK is what is stored on persistent media the service |
| Block Encryption Key  | BEK          | A block of data | None                                         | Symmetric  | The BEK is derived from the DEK and the data block                                                      |

The following diagram illustrates these concepts:

![Figure2](./media/data-lake-store-encryption/fig2.png)

#### Pseudo algorithm when a file is to be decrypted:
1.	Check if the DEK for the ADLS account is cached and ready for use.
    * If not, then read the encrypted DEK from persistent storage and send it to Azure Key Vault to be decrypted. Cache the decrypted DEK in memory and it is now ready to use.
2.	For every block of data in the file
    * Read the encrypted block of data from persistent storage
    * Generate the BEK from the DEK and the encrypted block of data
    * Use the BEK to decrypt data
#### Pseudo algorithm when a block of data is to be encrypted:
1.	Check if the DEK for the ADLS account is cached and ready for use.
    * If not, then read the encrypted DEK from persistent storage and send it to Azure Key Vault to be decrypted. Cache the decrypted DEK in memory and it is now ready to use.
2.	Generate a unique BEK for the block of data from the DEK.
3.	Encrypt the data block with the BEK using AES-256 encryption.
4.	Store the encrypted data block of data on persistent storage

> [!NOTE] 
> For performance reasons, the Data Encryption Key (DEK) in the clear is ephemerally cached in memory for a short duration of time and immediately erased after the duration is elapsed. On persistent media, it is always stored encrypted by the Master Encryption Key (MEK).

## Key Rotation

Azure Data Lake store allows for rotation of the Master Encryption Key (MEK) when using customer-managed keys. To learn how to set up an ADLS account with customer-managed keys, see the [Getting Started](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-get-started-portal) page.

### Pre-requisites

When setting up the Azure Data Lake account, the customers have chosen to use their own keys. This option cannot be changed after the account has been created. If you use the default options for encryption, your data will always be encrypted using keys managed by Azure Data Lake, in this option the customer does not have the ability to rotate keys as they are managed by Azure Data Lake. The steps below assume that you are using customer-managed keys (chosen your own keys from your key vault).

### How to rotate the key (MEK) in Azure Data Lake Store

1. Sign on to the new [Azure Portal](https://portal.azure.com/)
2. Navigate to the Key Vault that stores your keys associated with your Azure Data Lake Store Account & select Keys.

    ![Keys](./media/data-lake-store-encryption/keyvault.png)

3.	Select the key associated with your Azure Data Lake Store Account and create a new version of this key.
  
   At this point, Azure Data Lake only supports key rotation to a new version of a key, we don’t support rotating to a different key

   ![newversion](./media/data-lake-store-encryption/keynewversion.png)

4.	Navigate to the Azure Data Lake Storage account and select Encryption

    ![newversion](./media/data-lake-store-encryption/select-encryption.png)

5.	You will see a note informing you that a new key version of the key is available and a button to rotate the key to this new version. Click rotate key to update the key to the new version.

    ![done](./media/data-lake-store-encryption/rotatekey.png)

6. This operation should take less than 2 minutes and there is no expected downtime due to key rotation. Once the operation is complete, the new version of the key is in use.
