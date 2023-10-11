---
title: Use the Azure portal to configure customer-managed keys
titleSuffix: Azure AI services
description: Learn how to use the Azure portal to configure customer-managed keys with Azure Key Vault. Customer-managed keys enable you to create, rotate, disable, and revoke access controls.
services: cognitive-services
author: erindormier

ms.service: azure-ai-services
ms.topic: include
ms.date: 05/28/2020
ms.author: egeaney
---

## Customer-managed keys with Azure Key Vault

When you use customer-managed keys, you must use Azure Key Vault to store them. You can either create your own keys and store them in a key vault, or you can use the Key Vault APIs to generate keys. The Azure AI services resource and the key vault must be in the same region and in the same Azure Active Directory (Azure AD) tenant, but they can be in different subscriptions. For more information about Key Vault, see [What is Azure Key Vault?](../../key-vault/general/overview.md).

When you create a new Azure AI services resource, it's always encrypted by using Microsoft-managed keys. It's not possible to enable customer-managed keys when you create the resource. Customer-managed keys are stored in Key Vault. The key vault needs to be provisioned with access policies that grant key permissions to the managed identity that's associated with the Azure AI services resource. The managed identity is available only after the resource is created by using the pricing tier that's required for customer-managed keys.

Enabling customer-managed keys also enables a system-assigned [managed identity](../../active-directory/managed-identities-azure-resources/overview.md), a feature of Azure AD. After the system-assigned managed identity is enabled, this resource is registered with Azure AD. After being registered, the managed identity is given access to the key vault that's selected during customer-managed key setup. 

> [!IMPORTANT]
> If you disable system-assigned managed identities, access to the key vault is removed and any data that's encrypted with the customer keys is no longer accessible. Any features that depend on this data stop working.

> [!IMPORTANT]
> Managed identities don't currently support cross-directory scenarios. When you configure customer-managed keys in the Azure portal, a managed identity is automatically assigned behind the scenes. If you subsequently move the subscription, resource group, or resource from one Azure AD directory to another, the managed identity that's associated with the resource isn't transferred to the new tenant, so customer-managed keys might no longer work. For more information, see **Transferring a subscription between Azure AD directories** in [FAQs and known issues with managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/known-issues.md#transferring-a-subscription-between-azure-ad-directories).  

## Configure Key Vault

When you use customer-managed keys, you need to set two properties in the key vault, **Soft Delete** and **Do Not Purge**. These properties aren't enabled by default, but you can enable them on a new or existing key vault by using the Azure portal, PowerShell, or Azure CLI.

> [!IMPORTANT]
> If the **Soft Delete** and **Do Not Purge** properties aren't enabled and you delete your key, you can't recover the data in your Azure AI services resource.

To learn how to enable these properties on an existing key vault, see [Azure Key Vault recovery management with soft delete and purge protection](../../key-vault/general/key-vault-recovery.md).

## Enable customer-managed keys for your resource

To enable customer-managed keys in the Azure portal, follow these steps:

1. Go to your Azure AI services resource.
1. On the left, select **Encryption**.
1. Under **Encryption type**, select **Customer Managed Keys**, as shown in the following screenshot.

   :::image type="content" source="../media/cognitive-services-encryption/selectcmk.png" alt-text="Screenshot of the Encryption settings page for an Azure AI services resource. Under Encryption type, the Customer Managed Keys option is selected.":::

## Specify a key

After you enable customer-managed keys, you can specify a key to associate with the Azure AI services resource.

### Specify a key as a URI

To specify a key as a URI, follow these steps:

1. In the Azure portal, go to your key vault.
1. Under **Settings**, select **Keys**.
1. Select the desired key, and then select the key to view its versions. Select a key version to view the settings for that version.
1. Copy the **Key Identifier** value, which provides the URI.

   :::image type="content" source="../media/cognitive-services-encryption/key-uri-portal.png" alt-text="Screenshot of the Azure portal page for a key version. The Key Identifier box contains a placeholder for a key URI.":::

1. Go back to your Azure AI services resource, and then select **Encryption**.
1. Under **Encryption key**, select **Enter key URI**.
1. Paste the URI that you copied into the **Key URI** box.

   :::image type="content" source="../media/cognitive-services-encryption/ssecmk2.png" alt-text="Screenshot of the Encryption page for an Azure AI services resource. The Enter key URI option is selected, and the Key URI box contains a value.":::

1. Under **Subscription**, select the subscription that contains the key vault.
1. Save your changes.

### Specify a key from a key vault

To specify a key from a key vault, first make sure that you have a key vault that contains a key. Then follow these steps:

1. Go to your Azure AI services resource, and then select **Encryption**.
1. Under **Encryption key**, select **Select from Key Vault**.
1. Select the key vault that contains the key that you want to use.
1. Select the key that you want to use.

   :::image type="content" source="../media/cognitive-services-encryption/ssecmk3.png" alt-text="Screenshot of the Select key from Azure Key Vault page in the Azure portal. The Subscription, Key vault, Key, and Version boxes contain values.":::

1. Save your changes.

## Update the key version

When you create a new version of a key, update the Azure AI services resource to use the new version. Follow these steps:

1. Go to your Azure AI services resource, and then select **Encryption**.
1. Enter the URI for the new key version. Alternately, you can select the key vault and then select the key again to update the version.
1. Save your changes.

## Use a different key

To change the key that you use for encryption, follow these steps:

1. Go to your Azure AI services resource, and then select **Encryption**.
1. Enter the URI for the new key. Alternately, you can select the key vault and then select a new key.
1. Save your changes.

## Rotate customer-managed keys

You can rotate a customer-managed key in Key Vault according to your compliance policies. When the key is rotated, you must update the Azure AI services resource to use the new key URI. To learn how to update the resource to use a new version of the key in the Azure portal, see [Update the key version](#update-the-key-version).

Rotating the key doesn't trigger re-encryption of data in the resource. No further action is required from the user.

## Revoke access to customer-managed keys

To revoke access to customer-managed keys, use PowerShell or Azure CLI. For more information, see [Azure Key Vault PowerShell](/powershell/module/az.keyvault//) or [Azure Key Vault CLI](/cli/azure/keyvault). Revoking access effectively blocks access to all data in the Azure AI services resource, because the encryption key is inaccessible by Azure AI services.

## Disable customer-managed keys

When you disable customer-managed keys, your Azure AI services resource is then encrypted with Microsoft-managed keys. To disable customer-managed keys, follow these steps:

1. Go to your Azure AI services resource, and then select **Encryption**.
1. Clear the checkbox that's next to **Use your own key**.
