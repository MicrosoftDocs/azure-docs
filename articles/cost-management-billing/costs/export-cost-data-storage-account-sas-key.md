---
title: Export cost data with an Azure Storage account SAS key
description: This article helps partners create a SAS key and configure Cost Management exports.
author: bandersmsft
ms.author: banders
ms.date: 11/29/2023
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Export cost data with an Azure Storage account SAS key

The following information applies to Microsoft partners only.

Often, partners don't have their own Azure subscriptions in the tenant associated with their own Microsoft Partner Agreement. Partners with a Microsoft Partner Agreement plan who are global admins of their billing account can export and copy cost data into a storage account in a different tenant using a shared access service (SAS) key. In other words, a storage account with a SAS key allows the partner to use a storage account that's outside of their partner agreement to receive exported information. This article helps partners create a SAS key and configure Cost Management exports.

## Requirements

- You need must be a partner with a Microsoft Partner Agreement. Your customers on the Azure plan must have Microsoft Customer Agreement that is signed.
    - SAS key-based export isn't supported for indirect enterprise agreements.
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
1. Select **key1** for _Signing key_. If you rotate or update the key used to sign the SAS token, you must regenerate a new SAS token.
1. Select **Generate SAS and connection string**.
    The **SAS token** value shown is the token that you need when you configure exports.

## Create a new export with a SAS token

Navigate to **Exports** at the billing account scope and create a new export using the following steps.

1. Select **Create**.
1. Configure the Export details as you would for a normal export. You can configure the export to use an existing directory or container or you can specify a new directory or container. The export process creates them for you.
1. When configuring Storage, select **Use a SAS token**.  
    :::image type="content" source="./media/export-cost-data-storage-account-sas-key/new-export.png" alt-text="Screenshot showing the New export where you select SAS token." lightbox="./media/export-cost-data-storage-account-sas-key/new-export.png" :::
1. Enter the name of the storage account and paste in your SAS token.
1. Specify an existing container or Directory or identify new ones to be created.
1. Select **Create**.

The SAS token-based export only works while the token remains valid. Reset the token before the current one expires, or your export stops working. Because the token provides access to your storage account, protect the token as carefully as you would any other sensitive information. You're responsible to maintain permissions and data access when your export data to your storage account.

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
  - The behavior is expected. If the storage account is in another tenant, you need to navigate to that tenant first in the Azure portal to find the storage account.

- Your export fails because of a SAS token-related error.
  - Your export works only while the SAS token remains valid. Create a new key and run the export.

## SAS token-based exports FAQ

Here are some frequently asked questions and answers about SAS token-based exports.

### Why do I see garbled characters when I open exported cost files with Microsoft Excel?

If you see garbled characters in Excel and you use an Asian-based language, such as Japanese or Chinese, you can resolve this issue with the following steps:

For new versions of Excel:

1. Open Excel.
1. Select the **Data** tab at the top.
1. Select the **From Text/CSV** option.  
    :::image type="content" source="./media/export-cost-data-storage-account-sas-key/new-excel-from-text.png" alt-text="Screenshot showing the Excel From Text/CSV option." lightbox="./media/export-cost-data-storage-account-sas-key/new-excel-from-text.png" :::
1. Select the CSV file that you want to import.
1. In the next box, set **File origin** to **65001: Unicode (UTF-8)**.  
    :::image type="content" source="./media/export-cost-data-storage-account-sas-key/new-excel-file-origin.png" alt-text="Screenshot showing the Excel File origin option." lightbox="./media/export-cost-data-storage-account-sas-key/new-excel-file-origin.png" :::
1. Select **Load**.

For older versions of MS Excel:

1.	Open Excel.
1.	Select the **Data** tab at the top.
1.	Select the **From Text** option and then select the CSV file that you want to import.
1.	Excel shows the Text Import Wizard.
1.	In the wizard, select the **Delimited** option.
1.	In the **File origin** field, select **65001 : Unicode (UTF-8)**.
1.	Select **Next**.
1.	Next, select the **Comma** option and then select **Finish**.
1.	In the dialog window that appears, select **OK**.

### Why does the aggregated cost from the exported file differ from the cost displayed in Cost Analysis?

You might have discrepancies between the aggregated cost from the exported file and the cost displayed in Cost Analysis. Determine if the tool you use to read and aggregate the total cost is truncating decimal values. This issue can happen in tools like Power BI and Microsoft Excel. Determine if decimal places are getting dropped when cost values are converted into integers. Losing decimal values can result in a loss of precision and misrepresentation of the aggregated cost.

To manually transform a column to a decimal number in Power BI, follow these steps:

1. Go to the Table view.
1. Select **Transform data**.
1. Right-click the required column.
1. Change the type to a decimal number.

## Next steps

- For more information about exporting Cost Management data, see [Create and export data](tutorial-export-acm-data.md).
- For information about exporting large amounts of usage data, see [Retrieve large datasets with exports](ingest-azure-usage-at-scale.md).
