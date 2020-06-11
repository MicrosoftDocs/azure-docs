---
title: Use customer-manged keys to encrypt data in Azure HPC Cache
description: How to use Azure Key Vault with Azure HPC Cache to control encryption key access instead of using the default Microsoft-managed encryption keys
author: ekpgh
ms.service: hpc-cache
ms.topic: conceptual
ms.date: 04/29/2020
ms.author: v-erkel
---

# Use customer-managed encryption keys for Azure HPC Cache

You can use Azure Key Vault to control ownership of the keys used to encrypt your data in Azure HPC Cache. This article explains how to use customer-managed keys for cache data encryption.

> [!NOTE]
> All data stored in Azure, including on the cache disks, is encrypted at rest using Microsoft-managed keys by default. You only need to follow the steps in this article if you want to manage the keys used to encrypt your data.

This feature is available only in some of the Azure regions where Azure HPC Cache is available. Refer to the [Region availability](hpc-cache-overview.md#region-availability) list for details.

There are three steps to enable customer-managed key encryption for Azure HPC Cache:

1. Set up an Azure Key Vault to store the keys.
1. When creating the Azure HPC Cache, choose customer-managed key encryption and specify the key vault and key to use.
1. After the cache is created, authorize it to access the key vault.

Encryption is not completely set up until after you authorize it from the newly created cache (step 3). This is because you must pass the cache's identity to the key vault to make it an authorized user. You can't do this before creating the cache, because the identity does not exist until the cache is created.

After you create the cache, you can't change between customer-managed keys and Microsoft-managed keys. However, if your cache uses customer-managed keys you can [change](#update-key-settings) the encryption key, the key version, and the key vault as needed.

## Understand key vault and key requirements

The key vault and key must meet these requirements to work with Azure HPC Cache.

Key vault properties:

* **Subscription** - Use the same subscription that is used for the cache.
* **Region** - The key vault must be in the same region as the Azure HPC Cache.
* **Pricing tier** - Standard tier is sufficient for use with Azure HPC Cache.
* **Soft delete** - Azure HPC Cache will enable soft delete if it is not already configured on the key vault.
* **Purge protection** - Purge protection must be enabled.
* **Access policy** - Default settings are sufficient.
* **Network connectivity** - Azure HPC Cache must be able to access the key vault, regardless of the endpoint settings you choose.

Key properties:

* **Key type** - RSA
* **RSA key size** - 2048
* **Enabled** - Yes

Key vault access permissions:

* The user that creates the Azure HPC Cache must have permissions equivalent to the [Key Vault contributor role](../role-based-access-control/built-in-roles.md#key-vault-contributor). The same permissions are needed to set up and manage Azure Key Vault.

  Read [Secure access to a key vault](../key-vault/key-vault-secure-your-key-vault.md) for more information.

## 1. Set up Azure Key Vault

You can set up a key vault and key before you create the cache, or do it as part of cache creation. Make sure these resources meet the requirements outlined [above](#understand-key-vault-and-key-requirements).

At cache creation time you must specify a vault, key, and key version to use for the cache's encryption.

Read the [Azure Key Vault documentation](../key-vault/key-vault-overview.md) for details.

> [!NOTE]
> The Azure Key Vault must use the same subscription and be in the same region as the Azure HPC Cache. Make sure that the region you choose [supports the customer-managed keys feature](hpc-cache-overview.md#region-availability).

## 2. Create the cache with customer-managed keys enabled

You must specify the encryption key source when you create your Azure HPC Cache. Follow the instructions in [Create an Azure HPC Cache](hpc-cache-create.md), and specify the key vault and key in the **Disk encryption keys** page. You can create a new key vault and key during cache creation.

> [!TIP]
> If the **Disk encryption keys** page does not appear, make sure that your cache is in one of the supported regions.

The user who creates the cache must have privileges equal to the [Key Vault contributor role](../role-based-access-control/built-in-roles.md#key-vault-contributor) or higher.

1. Click the button to enable privately managed keys. After you change this setting, the key vault settings appear.

1. Click **Select a key vault** to open the key selection page. Choose or create the key vault and key for encrypting data on this cache's disks.

   If your Azure Key Vault does not appear in the list, check these requirements:

   * Is the cache in the same subscription as the key vault?
   * Is the cache in the same region as the key vault?
   * Is there network connectivity between the Azure portal and the key vault?

1. After selecting a vault, select the individual key from the available options, or create a new key. The key must be a 2048-bit RSA key.

1. Specify the version for the selected key. Learn more about versioning in the [Azure Key Vault documentation](../key-vault/about-keys-secrets-and-certificates.md#objects-identifiers-and-versioning).

Continue with the rest of the specifications and create the cache as described in [Create an Azure HPC Cache](hpc-cache-create.md).

## 3. Authorize Azure Key Vault encryption from the cache
<!-- header is linked from create article, update if changed -->

After a few minutes, the new Azure HPC Cache appears in your Azure portal. Go to the **Overview** page to authorize it to access your Azure Key Vault and enable customer-managed key encryption.

> [!TIP]
> The cache might appear in the resources list before the "deployment underway" messages clear. Check your resources list after a minute or two instead of waiting for a success notification.

This two-step process is necessary because the Azure HPC Cache instance needs an identity to pass to the Azure Key Vault for authorization. The cache identity doesn't exist until after its initial creation steps are complete.

> [!NOTE]
> You must authorize encryption within 90 minutes after creating the cache. If you don't complete this step, the cache will time out and fail. A failed cache has to be re-created, it can't be fixed.

The cache shows the status **Waiting for key**. Click the **Enable encryption** button at the top of the page to authorize the cache to access the specified key vault.

![screenshot of cache overview page in portal, with highlighting on the Enable encryption button (top row) and Status: Waiting for key](media/waiting-for-key.png)

Click **Enable encryption** and then click the **Yes** button to authorize the cache to use the encryption key. This action also enables soft-delete and purge protection (if not already enabled) on the key vault.

![screenshot of cache overview page in portal, with a banner message at the top that asks the user to enable encryption by clicking yes](media/enable-keyvault.png)

After the cache requests access to the key vault, it can create and encrypt the disks that store cached data.

After you authorize encryption, Azure HPC Cache goes through several more minutes of setup to create the encrypted disks and related infrastructure.

## Update key settings

You can change the key vault, key, or key version for your cache from the Azure portal. Click the cache's **Encryption** settings link to open the **Customer key settings** page.

You cannot change a cache between customer-managed keys and system-managed keys.

![screenshot of "Customer keys settings" page, reached by clicking Settings > Encryption from the cache page in the Azure portal](media/change-key-click.png)

Click the **Change key** link, then click **Change the key vault, key, or version** to open the key selector.

![screenshot of "select key from Azure Key Vault" page with three drop-down selectors to choose key vault, key, and version](media/select-new-key.png)

Key vaults in the same subscription and same region as this cache are shown in the list.

After you choose the new encryption key values, click **Select**. A confirmation page appears with the new values. Click **Save** to finalize the selection.

![screenshot of confirmation page with Save button at top left](media/save-key-settings.png)

## Read more about customer-managed keys in Azure

These articles explain more about using Azure Key Vault and customer-managed keys to encrypt data in Azure:

* [Azure storage encryption overview](../storage/common/storage-service-encryption.md)
* [Disk encryption with customer-managed keys](../virtual-machines/linux/disk-encryption.md#customer-managed-keys) - Documentation for using Azure Key Vault with managed disks, which is a similar scenario to Azure HPC Cache

## Next steps

After you have created the Azure HPC Cache and authorized Key Vault-based encryption, continue to set up your cache by giving it access to your data sources.

* [Add storage targets](hpc-cache-add-storage.md)
