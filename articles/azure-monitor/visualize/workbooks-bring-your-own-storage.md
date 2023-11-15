---
title: Azure Monitor workbooks bring your own storage
description: Learn how to secure your workbook by saving the workbook content to your storage.
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/21/2023
---

# Bring your own storage to save workbooks

There are times when you might have a query or some business logic that you want to secure. You can help secure workbooks by saving their content to your storage. The storage account can then be encrypted with Microsoft-managed keys, or you can manage the encryption by supplying your own keys. For more information, see Azure documentation on [storage service encryption](../../storage/common/storage-service-encryption.md).

## Save a workbook with managed identities

1. Before you can save the workbook to your storage, you'll need to create a managed identity by selecting **All Services** > **Managed Identities**. Then give it **Storage Blob Data Contributor** access to your storage account. For more information, see [Azure documentation on managed identities](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md).
    <!-- convertborder later -->
    :::image type="content" source="./media/workbooks-bring-your-own-storage/add-identity-role-assignment.png" lightbox="./media/workbooks-bring-your-own-storage/add-identity-role-assignment.png" alt-text="Screenshot that shows adding a role assignment." border="false":::

1. Create a new workbook.
1. Select **Save** to save the workbook.
1. Select the **Save content to an Azure Storage Account** checkbox to save to an Azure Storage account.
    <!-- convertborder later -->
    :::image type="content" source="./media/workbooks-bring-your-own-storage/saved-dialog-default.png" lightbox="./media/workbooks-bring-your-own-storage/saved-dialog-default.png" alt-text="Screenshot that shows the Save dialog." border="false":::

1. Select the storage account and container you want. The **Storage account** list is from the subscription selected previously.
    <!-- convertborder later -->
    :::image type="content" source="./media/workbooks-bring-your-own-storage/save-dialog-with-storage.png" lightbox="./media/workbooks-bring-your-own-storage/save-dialog-with-storage.png" alt-text="Screenshot that shows the Save dialog with a storage option." border="false":::

1. Select **(change)** to select a managed identity previously created.
    <!-- convertborder later -->
    :::image type="content" source="./media/workbooks-bring-your-own-storage/change-managed-identity.png" lightbox="./media/workbooks-bring-your-own-storage/change-managed-identity.png" alt-text="Screenshot that shows the Change identity dialog." border="false":::

1. After you've selected your storage options, select **Save** to save your workbook.

## Limitations

- When you save to custom storage, you can't pin individual parts of the workbook to a dashboard because the individual pins would contain protected information in the dashboard itself. When you use custom storage, you can only pin links to the workbook itself to dashboards.
- After a workbook has been saved to custom storage, it will always be saved to custom storage, and this feature can't be turned off. To save elsewhere, you can use **Save As** and elect to not save the copy to custom storage.
- Workbooks in an Application Insights resource are "legacy" workbooks and don't support custom storage. The latest feature for workbooks in an Application Insights resource is the **More** selection. Legacy workbooks don't have **Subscription** options when you save them.

   <!-- convertborder later -->
   :::image type="content" source="./media/workbooks-bring-your-own-storage/legacy-workbooks.png" lightbox="./media/workbooks-bring-your-own-storage/legacy-workbooks.png" alt-text="Screenshot that shows a legacy workbook." border="false":::

## Next steps

- Learn how to create a [Map](workbooks-map-visualizations.md) visualization in workbooks.
- Learn how to use [groups in workbooks](../visualize/workbooks-groups.md).
