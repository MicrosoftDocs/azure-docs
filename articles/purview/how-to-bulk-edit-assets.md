---
title: How to bulk edit assets to tag classifications, glossary terms and modify contacts
description: Learn bulk edit assets in Microsoft Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 01/25/2022
---

# How to bulk edit assets to annotate classifications, glossary terms and modify contacts

This article describes how to tag glossary terms, classifications, owners and experts to multiple assets in bulk. 

## Select assets to bulk edit

1. Use Microsoft Purview search or browse to discover assets you wish to edit.

1. In the search results, if you focus on an asset a checkbox appears.

   :::image type="content" source="media/how-to-bulk-edit-assets/asset-checkbox.png" alt-text="Screenshot of the bulk edit checkbox.":::

1. You can add an asset to the bulk edit list from the asset detail page. Select **Select for bulk edit** to add the asset to the bulk edit list.

   :::image type="content" source="media/how-to-bulk-edit-assets/asset-list.png" alt-text="Screenshot of the asset.":::

1. Select the checkbox to add it to the bulk edit list. You can see the selected assets by clicking **View selected**.

   :::image type="content" source="media/how-to-bulk-edit-assets/selected-list.png" alt-text="Screenshot of the list.":::\

## How to bulk edit assets

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
   
    :::image type="content" source="media/how-to-bulk-edit-assets/add-list.png" alt-text="Screenshot of the add.":::

1. Once complete, close the bulk edit blade by selecting **Close** or **Remove all and close**. Close won't remove the selected assets whereas remove all and close will remove all the selected assets.
    :::image type="content" source="media/how-to-bulk-edit-assets/close-list.png" alt-text="Screenshot of the close.":::

> [!Important]
> The recommended number of assets for bulk edit are 25. Selecting more than 25 might cause performance issues.
> The **View Selected** box will be visible only if there is at least one asset selected.

## Next steps

Follow the [Tutorial: Create and import glossary terms](how-to-create-import-export-glossary.md) to learn more.
