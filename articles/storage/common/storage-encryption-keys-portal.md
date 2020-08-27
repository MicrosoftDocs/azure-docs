---
title: Use the Azure portal to configure customer-managed keys
titleSuffix: Azure Storage
description: Learn how to use the Azure portal to configure customer-managed keys with Azure Key Vault for Azure Storage encryption.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/31/2020
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common
---

# Configure customer-managed keys with Azure Key Vault by using the Azure portal

[!INCLUDE [storage-encryption-configure-keys-include](../../../includes/storage-encryption-configure-keys-include.md)]

This article shows how to configure an Azure Key Vault with customer-managed keys using the [Azure portal](https://portal.azure.com/). To learn how to create a key vault using the Azure portal, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](../../key-vault/secrets/quick-create-portal.md).

## Configure Azure Key Vault

Using customer-managed keys with Azure Storage encryption requires that two properties be set on the key vault, **Soft Delete** and **Do Not Purge**. These properties are not enabled by default, but can be enabled using either PowerShell or Azure CLI on a new or existing key vault.

To learn how to enable these properties on an existing key vault, see the sections titled **Enabling soft-delete** and **Enabling Purge Protection** in one of the following articles:

- [How to use soft-delete with PowerShell](../../key-vault/general/soft-delete-powershell.md).
- [How to use soft-delete with CLI](../../key-vault/general/soft-delete-cli.md).

Azure storage encryption supports RSA and RSA-HSM keys of sizes 2048, 3072 and 4096. For more information about keys, see **Key Vault keys** in [About Azure Key Vault keys, secrets and certificates](../../key-vault/about-keys-secrets-and-certificates.md#key-vault-keys).

## Enable customer-managed keys

To enable customer-managed keys in the Azure portal, follow these steps:

1. Navigate to your storage account.
1. On the **Settings** blade for the storage account, click **Encryption**. Select the **Customer Managed Keys** option, as shown in the following image.

    ![Portal screenshot showing encryption option](./media/storage-encryption-keys-portal/portal-configure-encryption-keys.png)

## Specify a key

After you enable customer-managed keys, you'll have the opportunity to specify a key to associate with the storage account. You can also indicate whether Azure Storage should automatically update the customer-managed key to the latest version, or whether you will update the key version manually.

### Specify a key from a key vault

When you select a customer-managed key from a key vault, automatic updating of the key version is enabled. To manually manage the key version, specify the key URI instead, and include the key version. For more information, see [Specify a key as a URI](#specify-a-key-as-a-uri).

To specify a key from a key vault, follow these steps:

1. Choose the **Select from Key Vault** option.
1. Select **Select a key vault and key**.
1. Select the key vault containing the key you want to use.
1. Select the key from the key vault.

   ![Screenshot showing how to select key vault and key](./media/storage-encryption-keys-portal/portal-select-key-from-key-vault.png)

1. Save your changes.

### Specify a key as a URI

Azure Storage can automatically update the customer-managed key that is used for encryption to use the latest key version. When the customer-managed key is rotated in Azure Key Vault, Azure Storage will automatically begin using the latest version of the key for encryption.

> [!NOTE]
> To rotate a key, create a new version of the key in Azure Key Vault. Azure Storage does not handle the rotation of the key in Azure Key Vault, so you will need to rotate your key manually or create a function to rotate it on a schedule.

When you specify the key URI, omit the key version from the URI to enable automatic updating to the latest key version. If you include the key version in the key URI, then automatic updating is not enabled, and you must manage the key version yourself. For more information about updating the key version, see [Manually update the key version](#manually-update-the-key-version).

To specify a key as a URI, follow these steps:

1. To locate the key URI in the Azure portal, navigate to your key vault, and select the **Keys** setting. Select the desired key, then click the key to view its versions. Select a key version to view the settings for that version.
1. Copy the value of the **Key Identifier** field, which provides the URI.

    ![Screenshot showing key vault key URI](media/storage-encryption-keys-portal/portal-copy-key-identifier.png)

1. In the **Encryption key** settings for your storage account, choose the **Enter key URI** option.
1. Paste the URI that you copied into the **Key URI** field. Omit the key version from the URI to enable automatic updating of the key version.

   ![Screenshot showing how to enter key URI](./media/storage-encryption-keys-portal/portal-specify-key-uri.png)

1. Specify the subscription that contains the key vault.
1. Save your changes.

After you've specified the key, the Azure portal indicates whether automatic updating of the key version is enabled and displays the key version currently in use for encryption.

:::image type="content" source="media/storage-encryption-keys-portal/portal-auto-rotation-enabled.png" alt-text="Screenshot showing automatic updating of the key version enabled":::

## Manually update the key version

By default, when you create a new version of a customer-managed key in Key Vault, Azure Storage automatically uses the new version for encryption with customer-managed keys, as described in the previous sections. If you choose to manage the key version yourself, then you must update the key version that is associated with the storage account each time you create a new version of the key.

To update the storage account to use the new key version, follow these steps:

1. Navigate to your storage account and display the **Encryption** settings.
1. Enter the URI for the new version of the key. Alternately, you can select the key vault and the key again to update the version.
1. Save your changes.

## Switch to a different key

To change the key used for Azure Storage encryption, follow these steps:

1. Navigate to your storage account and display the **Encryption** settings.
1. Enter the URI for the new key. Alternately, you can select the key vault and choose a new key.
1. Save your changes.

## Disable customer-managed keys

When you disable customer-managed keys, your storage account is once again encrypted with Microsoft-managed keys. To disable customer-managed keys, follow these steps:

1. Navigate to your storage account and display the **Encryption** settings.
1. Deselect the checkbox next to the **Use your own key** setting.

## Next steps

- [Azure Storage encryption for data at rest](storage-service-encryption.md)
- [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview)?
