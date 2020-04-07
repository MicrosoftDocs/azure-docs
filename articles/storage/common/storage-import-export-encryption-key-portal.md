---
title: Use the Azure portal to configure customer-managed keys for Import/Export service
description: Learn how to use the Azure portal to configure customer-managed keys with Azure Key Vault for Azure Import/Export service. Customer-managed keys enable you to create, rotate, disable, and revoke access controls.
services: storage
author: alkohli
ms.service: storage
ms.topic: how-to
ms.date: 03/12/2020
ms.author: alkohli
ms.subservice: common
---

# Use customer-managed keys in Azure Key Vault for Import/Export service

Azure Import/Export protects the BitLocker keys used to lock the drives via an encryption key. By default, BitLocker keys are encrypted with Microsoft-managed keys. For additional control over encryption keys, you can also provide customer-managed keys.

Customer-managed keys must be created and stored in an Azure Key Vault. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/key-vault-overview.md)

This article shows how to use customer-managed keys with Import/Export service in the [Azure portal](https://portal.azure.com/).

## Prerequisites

Before you begin, make sure:

1. You have created an import or an export job as per the instructions in:

    - [Create an import job for blobs](storage-import-export-data-to-blobs.md).
    - [Create an import job for files](storage-import-export-data-to-files.md).
    - [Create an export job for blobs](storage-import-export-data-from-blobs.md)

2. You have an existing Azure Key Vault with a key in it that you can use to protect your BitLocker key. To learn how to create a key vault using the Azure portal, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](../../key-vault/quick-create-portal.md).

    - **Soft delete** and **Do not purge** are set on your existing Key Vault. These properties are not enabled by default. To enable these properties, see the sections titled **Enabling soft-delete** and **Enabling Purge Protection** in one of the following articles:

        - [How to use soft-delete with PowerShell](../../key-vault/key-vault-soft-delete-powershell.md).
        - [How to use soft-delete with CLI](../../key-vault/key-vault-soft-delete-cli.md).
    - The existing key vault should have an RSA key of 2048 size or more. For more information about keys, see **Key Vault keys** in [About Azure Key Vault keys, secrets, and certificates](../../key-vault/about-keys-secrets-and-certificates.md#key-vault-keys).
    - Key vault must be in the same region as the storage account for your data.  
    - If you don't have an existing Azure Key Vault, you can also create it inline as described in the following section.

## Enable keys

Configuring customer-managed key for your Import/Export service is optional. By default, the Import/Export service uses a Microsoft managed key to protect your BitLocker key. To enable customer-managed keys in the Azure portal, follow these steps:

1. Go to the **Overview** blade for your Import job.
2. In the right-pane, select **Choose how your BitLocker keys are encrypted**.

    ![Choose encryption option](./media/storage-import-export-encryption-key-portal/encryption-key-1.png)

3. In the **Encryption** blade, you can view and copy the device BitLocker key. Under **Encryption type**, you can choose how you want to protect your BitLocker key. By default, a Microsoft managed key is used.

    ![View BitLocker key](./media/storage-import-export-encryption-key-portal/encryption-key-2.png)

4. You have the option to specify a customer managed key. After you have selected the customer managed key, **Select key vault and a key**.

    ![Select customer managed key](./media/storage-import-export-encryption-key-portal/encryption-key-3.png)

5. In the **Select key from Azure Key Vault** blade, the subscription is automatically populated. For **Key vault**, you can select an existing key vault from the dropdown list.

    ![Select or create Azure Key Vault](./media/storage-import-export-encryption-key-portal/encryption-key-4.png)

6. You can also select **Create new** to create a new key vault. In the **Create key vault blade**, enter the resource group and the key vault name. Accept all other defaults. Select **Review + Create**.

    ![Create new Azure Key Vault](./media/storage-import-export-encryption-key-portal/encryption-key-5.png)

7. Review the information associated with your key vault and select **Create**. Wait for a couple minutes for the key vault creation to complete.

    ![Create Azure Key Vault](./media/storage-import-export-encryption-key-portal/encryption-key-6.png)

8. In the **Select key from Azure Key Vault**, you can select a key in the existing key vault.

9. If you created a new key vault, select **Create new** to create a key. RSA key size can be 2048 or greater.

    ![Create new key in Azure Key Vault](./media/storage-import-export-encryption-key-portal/encryption-key-7.png)

    If the soft delete and purge protection are not enabled when you create the key vault, key vault will be updated to have soft delete and purge protection enabled.

10. Provide the name for your key, accept the other defaults, and select **Create**.

    ![Create new key](./media/storage-import-export-encryption-key-portal/encryption-key-8.png)

11. Select the **Version** and then choose **Select**. You are notified that a key is created in your key vault.

    ![New key created in key vault](./media/storage-import-export-encryption-key-portal/encryption-key-9.png)

In the **Encryption** blade, you can see the key vault and the key selected for your customer managed key.

## Disable keys

You can only disable Microsoft managed keys and move to customer managed keys at any stage of the import/export job. However, you cannot disable the customer managed key once you have created it.

## Troubleshoot customer managed key errors

If you receive any errors related to your customer managed key, use the following table to troubleshoot:

| Error code     |Details     | Recoverable?    |
|----------------|------------|-----------------|
| CmkErrorAccessRevoked | Applied a customer managed key but the key access is currently revoked. For more information, see how to [Enable the key access](https://docs.microsoft.com/rest/api/keyvault/vaults/updateaccesspolicy).                                                      | Yes, check if: <ol><li>Key vault still has the MSI in the access policy.</li><li>Access policy provides permissions to Get, Wrap, Unwrap.</li><li>If key vault is in a vNet behind the firewall, check if **Allow Microsoft Trusted Services** is enabled.</li></ol>                                                                                            |
| CmkErrorDisabled      | Applied a customer managed key but the key is disabled. For more information, see how to [Enable the key](https://docs.microsoft.com/rest/api/keyvault/vaults/createorupdate).                                                                             | Yes, by enabling the key version     |
| CmkErrorNotFound      | Applied a customer managed key but can't find the key. <br>If the key is deleted and purged after the retention period, you can't recover the key. If you backed up the key, you can restore the key to resolve this issue. | No, the key has been deleted and also got purged after the retention period. <br>Yes, only if the customer has the key backed-up and restores it.  |
| CmkErrorVaultNotFound | Applied a customer managed key but can't find the key vault associated with the key.<br>If you deleted the key vault, you can't recover the customer managed key.  If you migrated the key vault to a different tenant, see [Change a key vault tenant ID after a subscription move](https://docs.microsoft.com/azure/key-vault/key-vault-subscription-move-fix). |   No, if the customer has deleted the key vault.<br> Yes, if key vault underwent a tenant migration, then do one of: <ol><li>move back the key vault to the old tenant.</li><li>set Identity = None and then back to Identity = SystemAssigned, this deletes and recreates the identity</li></ol><br>Note: Tenant migration case is based on limited understanding, need to test and confirm actual behavior, could be revised later. |

## Next steps

- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?
