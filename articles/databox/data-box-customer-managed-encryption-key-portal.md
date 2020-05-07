---
title: Use the Azure portal to configure customer-managed keys for Azure Data Box
description: Learn how to use the Azure portal to configure customer-managed keys with Azure Key Vault for Azure Data Box. Customer-managed keys enable you to create, rotate, disable, and revoke access controls.
services: databox
author: alkohli
ms.service: databox
ms.topic: how-to
ms.date: 05/06/2020
ms.author: alkohli
ms.subservice: databox
---

# Use customer-managed keys in Azure Key Vault for Azure Data Box

Azure Data Box protects the device unlock keys (also known as device password) used to lock the device via an encryption key. By default, device unlock keys are encrypted with Microsoft managed keys. For additional control over device unlock keys, you can also provide customer-managed keys. 

Customer managed keys must be created and stored in an Azure Key Vault. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/general/overview.md).

This article shows how to use customer-managed keys with Azure Data Box in the [Azure portal](https://portal.azure.com/).

## Prerequisites

Before you begin, make sure:

1. You have created an Azure Data Box order as per the instructions in [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md).

2. You have an existing Azure Key Vault with a key in it that you can use to protect your device unlock key. To learn how to create a key vault using the Azure portal, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](../../key-vault/secrets/quick-create-portal.md).

    - **Soft delete** and **Do not purge** are set on your existing key vault. These properties are not enabled by default. To enable these properties, see the sections titled **Enabling soft-delete** and **Enabling Purge Protection** in one of the following articles:

        - [How to use soft-delete with PowerShell](../../key-vault/general/soft-delete-powershell.md).
        - [How to use soft-delete with CLI](../../key-vault/general/soft-delete-cli.md).
    - The existing key vault should have an RSA key of 2048 size or more. For more information about keys, see the **Key Vault keys** in [About Azure Key Vault keys, secrets, and certificates](../../key-vault/about-keys-secrets-and-certificates.md#key-vault-keys).
    - Key vault must be in the same region as the storage account for your data.  
    - If you don't have an existing key vault, you can also create it inline as described in the following section.

## Enable keys

Configuring customer managed key for your Azure Data Box is optional. By default, Data Box uses a Microsoft managed key to protect your BitLocker key. To enable customer managed keys in the Azure portal, follow these steps:

1. Go to the **Overview** blade for your Data Box order.

    ![Overview blade of Data Box order](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-1.png)

2. Go to **Settings > Encryption**. Under **Encryption type**, you can choose how you want to protect your device unlock key. By default, a Microsoft managed key is used to protect your device unlock password. 

    ![Choose encryption option](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-2.png)

3. Select encryption type as **Customer managed key**. After you have selected the customer managed key, **Select key vault and a key**.

    ![Select customer managed key](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-3.png)

5. In the **Select key from Azure Key Vault** blade, the subscription is automatically populated. For **Key vault**, you can select an existing key vault from the dropdown list.

    ![Create new Azure Key Vault](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-31.png)


    You can also select **Create new** to create a new key vault. In the **Create key vault blade**, enter the resource group and the key vault name. Accept all other defaults. Select **Review + Create**.

    ![Create new Azure Key Vault](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-4.png)

7. Review the information associated with your key vault and select **Create**. Wait for a couple minutes for the key vault creation to complete.

    ![Create Azure Key Vault](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-5.png)

8. In the **Select key from Azure Key Vault**, you can select a key in the existing key vault.

    ![Create new key in Azure Key Vault](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-6.png)

9. If you want to create a new key vault, select **Create new** to create a key. RSA key size can be 2048 or greater.

    ![Create new key in Azure Key Vault](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-61.png)

10. Provide the name for your key, accept the other defaults, and select **Create**. You are notified that a key is created in your key vault.

    ![Create new key](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-7.png)


11. Select the **Version** and then choose **Select**.

    ![New key created in key vault](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-8.png)

12. In the **Encryption type** pane, you can see the key vault and the key selected for your customer managed key.

    ![Key and key vault for customer managed key](./media/data-box-customer-managed-encryption-key-portal/customer-managed-key-9.png)

> [!IMPORTANT]
> You can disable Microsoft managed key and move to customer managed key at any stage of the Data Box order. However, once you have created the customer managed key, you cannot disable the key.

<!--## Troubleshoot errors

If you receive any errors related to your customer managed key, use the following table to troubleshoot.

| Error code     |Details     | Recoverable?    |
|----------------|------------|-----------------|
| CmkErrorAccessRevoked | Applied a customer managed key but the key access is currently revoked. For more information, see how to [Enable the key access](https://docs.microsoft.com/rest/api/keyvault/vaults/updateaccesspolicy).                                                      | Yes, check if: <ol><li>Key vault still has the MSI in the access policy.</li><li>Access policy provides permissions to Get, Wrap, Unwrap.</li><li>If key vault is in a vNet behind the firewall, check if **Allow Microsoft Trusted Services** is enabled.</li></ol>                                                                                            |
| CmkErrorKeyDisabled      | Applied a customer managed key but the key is disabled. For more information, see how to [Enable the key](https://docs.microsoft.com/rest/api/keyvault/vaults/createorupdate).                                                                             | Yes, by enabling the key version     |
| CmkErrorKeyNotFound      | Applied a customer managed key but can't find the key vault associated with the key.<br>If you deleted the key vault, you can't recover the customer managed key.  If you migrated the key vault to a different tenant, see [Change a key vault tenant ID after a subscription move](https://docs.microsoft.com/azure/key-vault/key-vault-subscription-move-fix). |   If you deleted the key vault:<ol><li>Yes, if it is in the purge-protection duration, using the steps at [Recover a key vault](https://docs.microsoft.com/azure/key-vault/general/soft-delete-powershell#recovering-a-key-vault).</li><li>No, if it is beyond the purge-protection duration.</li></ol><br>Else if the key vault underwent a tenant migration, yes, it can be recovered using one of the below steps: <ol><li>Revert the key vault back to the old tenant.</li><li>Set `Identity = None` and then set the value back to `Identity = SystemAssigned`. This deletes and recreates the identity once the new identity has been created. Enable `Get`, `Wrap`, and `Unwrap` permissions to the new identity in the key vault's Access policy.</li></ol>|-->

## Next steps

- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?