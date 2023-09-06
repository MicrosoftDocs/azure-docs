---
title: Export cost data with an Azure Storage account SAS key
description: This article helps partners create a SAS key and configure Cost Management exports.
author: bandersmsft
ms.author: banders
ms.date: 06/07/2023
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Export cost data with an Azure Storage account SAS key

The following information applies to Microsoft partners only.

Often, partners don't have their own Azure subscriptions in the tenant that's associated with their own Microsoft Partner Agreement. Partners with a Microsoft Partner Agreement plan who are global admins of their billing account can export and copy cost data into a storage account in a different tenant using a shared access service (SAS) key. In other words, a storage account with a SAS key allows the partner to use a storage account that's outside of their partner agreement to receive exported information. This article helps partners create a SAS key and configure Cost Management exports.

## Requirements

- You must be a partner with a Microsoft Partner Agreement and have customers on the Azure Plan.
- You must be global admin for your partner organization's billing account.
- You must have access to configure a storage account that's in a different tenant of your partner organization. You're responsible for maintaining permissions and data access when your export data to your storage account.
- The storage account must not have a firewall configured.
- The storage account configuration must have the **Permitted scope for copy operations (preview)** option set to **From any storage account**.

## Configure Azure Storage with a SAS key

Get a storage account SAS token or create one using the Azure portal. To create on in the Azure portal, use the following steps. To learn more about SAS keys, see [Grant limited access to data with shared access signatures (SAS).](../../storage/common/storage-sas-overview.md)

1. Navigate to the storage account in the Azure portal.
    - If your account has access to multiple tenants, switch directories to access the storage account. Select your account in the upper right corner of the Azure portal and then select **Switch directories**.
    - You might need to sign in to the Azure portal with the corresponding tenant account to access the storage account.
1. In the left menu, select **Shared access signature**.  
    :::image type="content" source="./media/export-cost-data-storage-account-sas-key/storage-shared-access-signature.png" alt-text="Screenshot showing a configured Azure storage shared access signature." lightbox="./media/export-cost-data-storage-account-sas-key/storage-shared-access-signature.png" :::
1. Configure the token with the same settings as identified in the preceding image.
    1. Select **Blob** for _Allowed services_.
    1. Select **Service**, **Container**, and **Object** for _Allowed resource types_.
    1. Select **Read**, **Write**, **Delete**, **List**, **Add**, and **Create** for _Allowed permissions_.
    1. Choose expiration and dates. Make sure to update your export SAS token before it expires. The longer the time period you configure before expiration, the longer your export runs before needing a new SAS token.
1. Select **HTTPS only** for _Allowed protocols_.
1. Select **Basic** for _Preferred routing tier_.
1. Select **key1** for _Signing key_. If you rotate or update the key that's used to sign the SAS token, you'll need to regenerate a new SAS token for your export.
1. Select **Generate SAS and connection string**.
    The **SAS token** value shown is the token that you need when you configure exports.

## Create a new export with a SAS token

Navigate to **Exports** at the billing account scope and create a new export using the following steps.

1. Select **Create**.
1. Configure the Export details as you would for a normal export. You can configure the export to use an existing directory or container or you can specify a new directory or container and exports will create them for you.
1. When configuring Storage, select **Use a SAS token**.  
    :::image type="content" source="./media/export-cost-data-storage-account-sas-key/new-export.png" alt-text="Screenshot showing the New export where you select SAS token." lightbox="./media/export-cost-data-storage-account-sas-key/new-export.png" :::
1. Enter the name of the storage account and paste in your SAS token.
1. Specify an existing container or Directory or identify new ones to be created.
1. Select **Create**.

The SAS token-based export only works while the token remains valid. Reset the token before the current one expires, or your export will stop working. Because the token provides access to your storage account, protect the token as carefully as you would any other sensitive information. You're responsible to maintain permissions and data access when your export data to your storage account.

## Troubleshoot exports using SAS tokens

The following are common issues that might happen when you configure or use SAS token-based exports.

- You don't see the SAS key option in the Azure portal.
  - Verify that you're a partner that has a Microsoft Partner Agreement and that you have global admin permission to the billing account. They're the only people who can export with a SAS key.

- You get the following error message when trying to configure your export:

    **Please ensure the SAS token is valid for blob service, is valid for container and object resource types, and has permissions: add create read write delete. (Storage service error code: AuthorizationResourceTypeMismatch)**

    - Make sure that you're configuring and generating the SAS key correctly in Azure Storage.

- You can't see the full SAS key after you create an export.
  - Not seeing the key is expected behavior. After the SAS Export is configured, the key is hidden for security reasons.

- You can't access the storage account from the tenant where the export is configured.
  - It's expected behavior. If the storage account is in another tenant, you need to navigate to that tenant first in the Azure portal to find the storage account.

- Your export fails because of a SAS token-related error.
  - Your export works only while the SAS token remains valid. Create a new key and run the export.

## Next steps

- For more information about exporting Cost Management data, see [Create and export data](tutorial-export-acm-data.md).
- For information about exporting large amounts of usage data, see [Retrieve large datasets with exports](ingest-azure-usage-at-scale.md).
