---
title: How to bulk edit assets
description: Learn bulk edit assets in Microsoft Purview to add classifications, glossary terms, and modify contacts on multiple assets at once.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 03/23/2023
---

# How to bulk edit assets

This article describes how you can update assets in bulk to add glossary terms, classifications, owners, and experts on multiple assets at once.

>[!NOTE]
>Bulk editing as described here is for data assets. Other assets like classifications and glossary terms cannot be added to the bulk edit list.

## Select assets to bulk edit

1. Use Microsoft Purview search or browse to discover assets you wish to edit.

1. In the search results, each data asset has a checkbox you can select to add the asset to the selection list.

   :::image type="content" source="media/how-to-bulk-edit-assets/asset-checkbox.png" alt-text="Screenshot of the bulk edit checkbox.":::

1. You can also add an asset to the bulk edit list from the asset detail page. Select **Select for bulk edit** to add the asset to the bulk edit list.

   :::image type="content" source="media/how-to-bulk-edit-assets/asset-list.png" alt-text="Screenshot of the asset page with the bulk edit box highlighted.":::

1. Select the checkbox to add it to the bulk edit list. You can see the selected assets by selecting the **View selected** button.

   :::image type="content" source="media/how-to-bulk-edit-assets/selected-list.png" alt-text="Screenshot of the asset list with the View Selected button highlighted.":::

## Bulk edit assets

1. When all assets have been chosen, select **View selected** to pull up the selected assets.

    :::image type="content" source="media/how-to-bulk-edit-assets/view-list.png" alt-text="Screenshot of the view.":::

1. Review the list and select **Deselect** if you want to remove any assets from the list.

    :::image type="content" source="media/how-to-bulk-edit-assets/remove-list.png" alt-text="Screenshot with the Deselect button highlighted.":::

1. Select **Bulk edit** to add, remove or replace an annotation for all the selected assets. You can edit the glossary terms, classifications, owners or experts of an asset.

    :::image type="content" source="media/how-to-bulk-edit-assets/bulk-edit.png" alt-text="Screenshot with the bulk edit button highlighted.":::

1. For each attribute selected, you can choose which edit operation to apply
    1. **Add** will append a new annotation to the selected data assets.
    1. **Replace with** will replace all of the annotations for the selected data assets with the annotation selected.
    1. **Remove** will remove all annotations for selected data assets.

    You can edit multiple assets at once by selecting **Select a new attribute**.

    :::image type="content" source="media/how-to-bulk-edit-assets/add-list.png" alt-text="Screenshot of the add.":::

1. When you have made all your updates, select **Apply**.

1. Once complete, close the bulk edit blade by selecting **Close** or **Remove all and close**. Close won't remove the selected assets whereas remove all and close will remove all the selected assets.
    :::image type="content" source="media/how-to-bulk-edit-assets/close-list.png" alt-text="Screenshot of the close.":::

> [!IMPORTANT]
> The recommended number of assets for bulk edit are 25. Selecting more than 25 might cause performance issues.
> The **View Selected** box will be visible only if there is at least one asset selected.

## Next steps

- [How to create and manage glossary terms](how-to-create-manage-glossary-term.md)
- [How to import and export glossary terms](how-to-import-export-glossary.md)
