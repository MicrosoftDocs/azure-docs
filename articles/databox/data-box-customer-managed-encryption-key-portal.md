---
title: Use the Azure portal to manage customer-managed keys for Azure Data Box
description: Learn how to use Azure portal to create and manage customer-managed keys with Azure Key Vault for an Azure Data Box. Customer-managed keys let you create, rotate, disable, and revoke access controls.
services: databox
author: stevenmatthew
ms.service: azure-databox
ms.topic: how-to
ms.date: 03/06/2025
ms.author: shaas
# Customer intent: As a cloud administrator, I want to manage customer-managed keys in Azure Key Vault for Azure Data Box, so that I can enhance security and maintain control over access to encryption keys used for my data storage.
---

# Use customer-managed keys in Azure Key Vault for Azure Data Box

Azure Data Box devices are secured with a password to prevent unwanted intrusion. This password is formally known as the *device unlock key* and is protected by using an encryption key. By default, the encryption key is a Microsoft managed key. For more direct control, you can provide your own managed key.

Using your own customer-managed key only affects how the device unlock key is encrypted. It doesn't affect how data stored on the device is encrypted.

To keep this level of control throughout the order process, use a customer-managed key when you create your order. For more information, see [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md).

This article describes how you can use customer-managed keys with an existing Azure Data Box order via the [Azure portal](https://portal.azure.com/). This article applies to Azure Data Box, Data Box Next-gen, and Data Box Heavy devices.

## Requirements

The customer-managed key for a Data Box order must meet the following requirements:

- The key must be an RSA key of 2,048 bits or larger.
- The key must be created and stored in an Azure Key Vault that has **Soft delete** and **Do not purge** behaviors enabled. You can create a key vault and key while creating or updating your order. For more information, see [What is Azure Key Vault?](/azure/key-vault/general/overview). 
- The `Get`, `UnwrapKey`, and `WrapKey` permissions for the key must be enabled in the associated Azure Key Vault. These permissions must remain in place for the lifetime of the order. Modifying these permissions prevents the customer-managed key from being accessible during the Data Copy process.

## Enable key

To enable a customer-managed key for an existing Data Box order in the Azure portal, follow these steps:

1. Navigate to the **Overview** page for a Data Box order.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-1-sml.png" alt-text="A screen capture showing a Data Box order's Overview page." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-1-lrg.png":::

2. Within the **Settings** group, select **Encryption**. Within the **Encryption type** pane, select the **Customer managed key** option. Next, select **Select a key and key vault** to open the **Select key from Azure Key Vault** page.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-3-sml.png" alt-text="A screen capture showing the selected Customer-managed Key option selected." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-3-lrg.png":::

 3. The **Select key from Azure Key Vault** page opens, and your subscription is automatically populated in the drop-down list. Select an existing key vault in the **Key vault** drop-down list, or select **Create new** to create a new key vault.

     :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-3-a-sml.png" alt-text="A screen capture highlighting key vault options when selecting a customer-managed key." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-3-a-lrg.png":::

     To create a new key vault, select your subscription and resource group form the corresponding **Subscription** and **Resource group** drop-down lists. Alternatively, you can create a new resource group by selecting **Create new** instead of populating the **Resource group** option. 

     Select the desired values for the **Key vault name**, **Region**, and **Pricing tier** drop-down lists. In the **Recovery options** group, ensure that **Soft delete** and **Purge protection** are enabled. Provide a value for the **Days to retain deleted vaults** field, and then select **Review + Create**.

      :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-4-sml.png" alt-text="A screen capture showing the Review and create Azure Key Vault page." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-4.png":::

      Review the information for your key vault, then select **Create**. You're notified that the key vault creation is completed.

      :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-5-sml.png" alt-text="A screen capture showing the creation of an Azure Key Vault with custom settings." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-5.png":::

4. On the **Select key from Azure Key Vault** screen, you can select an existing key from the key vault or create a new one.

    
    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-6-sml.png" alt-text="A screen capture showing the selection of a key from Azure Key Vault." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-6.png":::

   If you want to create a new key, select **Create new**. You must use an RSA key of 2,048 bits or greater.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-6-a.png" alt-text="A screen capture showing the creation of a new key in Azure Key Vault.":::

    Enter a name for your key, accept the other defaults, and select **Create**. You're notified that a key is created within your key vault.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-7.png" alt-text="A screen capture showing the naming of a new key in Azure Key Vault.":::

5. For **Version**, you can select an existing key version from the drop-down list.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-8.png" alt-text="A screen capture showing the selection of a key version in Azure Key Vault.":::

    If you want to generate a new key version, select **Create new**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-8-a.png" alt-text="A screen capture showing the location of the Create New link.":::

    Choose settings for the new key version, and select **Create**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-8-b.png" alt-text="A screen capture showing the Create a new key version screen.":::

6. After selecting a key vault, key, and key version, choose **Select**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-8-c.png" alt-text="A screen capture showing the location of the Select button.":::

    The **Encryption type** settings show the key vault and key that you chose.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-9-sml.png" alt-text="A screen capture showing the Key and Key Vault details." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-9-lrg.png":::

7. Select the type of identity to use to manage the customer-managed key for this resource. You can use the **system assigned** identity that was generated during order creation or choose a user-assigned identity.

    A user-assigned identity is an independent resource that you can use to manage access to resources. For more information, see [Managed identity types](../active-directory/managed-identities-azure-resources/overview.md).

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-13-sml.png" alt-text="A screen capture showing the identity types." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-13.png":::

    To assign a user identity, select **User assigned**. Then select **Select a user identity**, and select the managed identity that you want to use.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-14-sml.png" alt-text="A screen capture showing the options for key selection." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-14.png":::

    You can't create a new user identity here. To find out how to create one, see [Create, list, delete, or assign a role to a user-assigned managed identity using the Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).

    The selected user identity is shown in the **Encryption type** settings.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-15-sml.png" alt-text="A screen capture showing A selected user identity shown within the Encryption type settings pane." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-15.png":::

 8. Select **Save** to save the updated **Encryption type** settings.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-10-sml.png" alt-text="A screen capture showing the location of the Save button for a customer-managed key." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-10.png":::

    The key URL is displayed under **Encryption type**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-11-sml.png" alt-text="A screen capture showing the Customer-managed key URL." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-11.png":::

> [!IMPORTANT]
> You must enable the `Get`, `UnwrapKey`, and `WrapKey` permissions on the key. To set the permissions in Azure CLI, see [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy).

## Change key

To change the key vault, key, and key version for the customer-managed key you're currently using, follow these steps:

1. On the **Overview** screen for your Data Box order, go to **Settings** > **Encryption**, and select **Change key**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-16.png" alt-text="A screen capture of a Data Box order's Overview page showing customer-managed key details.":::

2. Choose **Select a different key vault and key**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-16-a-sml.png" alt-text="A screen capture of a Data Box order's Overview page highlighting the process to select different key vault and key options." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-16-a-lrg.png":::

3. The **Select key from key vault** screen shows the subscription but no key vault, key, or key version. You can make any of the following changes:

   - Select a different key from the same key vault. Select the key vault before selecting the key and version.

   - Select a different key vault and assign a new key.

   - Change the version for the current key.
   
    When you finish your changes, choose **Select**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-17.png" alt-text="A screen capture showing encryption option settings and the location of the Select button.":::

4. Select **Save**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-17-a-sml.png" alt-text="A screen capture showing updated encryption settings and the location of the Save button." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-17-a-lrg.png":::

> [!IMPORTANT]
> You must enable the `Get`, `UnwrapKey`, and `WrapKey` permissions on the key. To set the permissions in Azure CLI, see [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy).

## Change identity

Use the following steps to update the identity that manages access to the customer-managed key for this order:

1. On the **Overview** screen for your completed Data Box order, go to **Settings** > **Encryption**.

2. Make either of the following changes:

     - To change to a different user identity, select **Select a different user identity**. Then select a different identity in the panel on the right side of the screen, and choose **Select**.

       :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-18-sml.png" alt-text="Screenshot showing options for changing the user-assigned identity for a customer-managed key." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-18-lrg.png":::

   - To switch to the system-assigned identity generated during order creation, select **System assigned** by **Select identity type**.

     :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-19-sml.png" alt-text="Screenshot showing options for changing to a system-assigned key from for a customer-managed key." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-19-lrg.png":::

3. Select **Save**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-17-a-sml.png" alt-text="Screenshot showing the location of the button used to save your updated encryption settings." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-17-a-lrg.png":::

## Use Microsoft managed key

To change from using a customer-managed key to the Microsoft managed key for your order, follow these steps:

1. On the **Overview** screen for your completed Data Box order, go to **Settings** > **Encryption**.

2. By **Select type**, select **Microsoft managed key**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-20-sml.png" alt-text="Screenshot showing a Data Box order's Overview pane." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-20-lrg.png":::

3. Select **Save**.

    :::image type="content" source="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-21-sml.png" alt-text="Screenshot showing the location of the button used to save the updated encryption settings for a Microsoft managed key." lightbox="media/data-box-customer-managed-encryption-key-portal/customer-managed-key-21-lrg.png":::

## Troubleshoot errors

If you receive any errors related to your customer-managed key, use the following table to troubleshoot.

| Error   code| Error details| Resolution|
|-------------|--------------|-------------|
| SsemUserErrorEncryptionKeyDisabled| Couldn't fetch the passkey: the customer-managed key is disabled. | Enable the key version.|
| SsemUserErrorEncryptionKeyExpired| Couldn't fetch the passkey: the customer-managed key is expired. | Enabling the key version.|
| SsemUserErrorKeyDetailsNotFound| Couldn't fetch the passkey: the customer-managed key can't be found. | If the key vault is deleted:<ol><li>If the deletion occurred within the purge-protection duration period, use the steps at [Recover a key vault](/azure/key-vault/general/key-vault-recovery?tabs=azure-powershell#key-vault-powershell).</li><li>If purge protection is disabled or the deletion occurred beyond the purge-protection duration, the customer-managed key can't be recovered.</li></ol><br>If the key vault underwent a tenant migration, it can be recovered using one of the following methods: <ol><li>Revert the key vault back to the old tenant.</li><li>Set `Identity = None`, and then revert the value to `Identity = SystemAssigned`. This action deletes and recreates the identity. Enable `Get`, `WrapKey`, and `UnwrapKey` permissions for the new identity within the key vault's Access policy.</li></ol> |
| SsemUserErrorKeyVaultBadRequestException | Applied a customer-managed key but the key access hasn't been granted or has been revoked, or unable to access key vault due to firewall being enabled. | To enable access to the customer-managed key, add the selected identity to your key vault. If key vault has firewall enabled, switch to a system assigned identity and then add a customer-managed key. For more information, see how to [Enable the key](#enable-key). |
| SsemUserErrorKeyVaultDetailsNotFound| Couldn't fetch the passkey as the associated key vault for the customer-managed key couldn't be found. | If you deleted the key vault, you can't recover the customer-managed key. If you migrated the key vault to a different tenant, see [Change a key vault tenant ID after a subscription move](/azure/key-vault/general/move-subscription). If you deleted the key vault:<ol><li>Yes, if it is in the purge-protection duration, using the steps at [Recover a key vault](/azure/key-vault/general/key-vault-recovery?tabs=azure-powershell#key-vault-powershell).</li><li>No, if it is beyond the purge-protection duration.</li></ol><br>Else if the key vault underwent a tenant migration, yes, it can be recovered using one of the below steps: <ol><li>Revert the key vault back to the old tenant.</li><li>Set `Identity = None` and then set the value back to `Identity = SystemAssigned`. Changing the identity value deletes and recreates the identity after the new identity has been created. Enable `Get`, `WrapKey`, and `UnwrapKey` permissions to the new identity in the key vault's Access policy.</li></ol> |
| SsemUserErrorSystemAssignedIdentityAbsent  | Couldn't fetch the passkey as the customer-managed key couldn't be found.| Yes, check if: <ol><li>Key vault still has the MSI in the access policy.</li><li>Identity is of type System assigned.</li><li>Enable `Get`, `WrapKey`, and `UnwrapKey` permissions to the identity in the key vault’s access policy. These permissions must remain for the lifetime of the order. They're used during order creation and at the beginning of the Data Copy phase.</li></ol>|
| SsemUserErrorUserAssignedLimitReached | Adding new User Assigned Identity failed as you have reached the limit on the total number of user assigned identities that can be added. | Retry the operation with fewer user identities, or remove some user-assigned identities from the resource before retrying. |
| SsemUserErrorCrossTenantIdentityAccessForbidden | Managed identity access operation failed. <br> Note: This error can occur when a subscription is moved to different tenant. The customer has to manually move the identity to the new tenant. | Try adding a different user-assigned identity to your key vault to enable access to the customer-managed key. Or move the identity to the new tenant under which the subscription is present. For more information, see how to [Enable the key](#enable-key). |
| SsemUserErrorKekUserIdentityNotFound | Applied a customer-managed key but the user assigned identity that has access to the key wasn't found in the active directory. <br> Note: This error can occur when a user identity is deleted from Azure.| Try adding a different user-assigned identity to your key vault to enable access to the customer-managed key. For more information, see how to [Enable the key](#enable-key). |
| SsemUserErrorUserAssignedIdentityAbsent | Couldn't fetch the passkey as the customer-managed key couldn't be found. | Couldn't access the customer-managed key. Either the User Assigned Identity (UAI) associated with the key is deleted or the UAI type has changed. |
| SsemUserErrorKeyVaultBadRequestException | Applied a customer-managed key, but key access hasn't been granted or has been revoked, or the key vault couldn't be accessed because a firewall is enabled. | To enable access to the customer-managed key, add the selected identity to your key vault. If the key vault has a firewall enabled, switch to a system-assigned identity and then add a customer-managed key. For more information, see how to [Enable the key](#enable-key). |
| SsemUserErrorEncryptionKeyTypeNotSupported | The encryption key type isn't supported for the operation. | Enable a supported encryption type on the key - for example, RSA or RSA-HSM. For more information, see [Key types, algorithms, and operations](/azure/key-vault/keys/about-keys-details). |
| SsemUserErrorSoftDeleteAndPurgeProtectionNotEnabled | Key vault doesn't have soft delete or purge protection enabled. | Ensure that both soft delete and purge protection are enabled on the key vault. |
| SsemUserErrorInvalidKeyVaultUrl<br>(Command-line only) | An invalid key vault URI was used. | Get the correct key vault URI. To get the key vault URI, use [Get-AzKeyVault](/powershell/module/az.keyvault/get-azkeyvault) in PowerShell.  |
| SsemUserErrorKeyVaultUrlWithInvalidScheme | Only HTTPS is supported for passing the key vault URI. | Pass the key vault URI over HTTPS. |
| SsemUserErrorKeyVaultUrlInvalidHost | The key vault URI host isn't an allowed host in the geographical region. | In the public cloud, the key vault URI should end with `vault.azure.net`. In the Azure Government cloud, the key vault URI should end with `vault.usgovcloudapi.net`. |  
| Generic error  | Couldn't fetch the passkey. | This error is a generic error. Contact Microsoft Support to troubleshoot the error and determine the next steps.|

## Next steps

- [What is Azure Key Vault?](/azure/key-vault/general/overview)
- [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](/azure/key-vault/secrets/quick-create-portal)
