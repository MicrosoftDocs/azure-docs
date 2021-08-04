---
title: How to bulk edit assets to tag classifications, glossary terms and modify contacts
description: Learn bulk edit assets in Azure Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 11/24/2020
---

# How to bulk edit assets to annotate classifications, glossary terms and modify contacts

This article describes how to tag multiple glossary terms, classifications, owners and experts to a list of selected assets in a single action.

### Add Assets to View selected list using search

1. Search on the data asset you want to add to the list for bulk editing.

2. In the search result page, hover on the asset you want to add to the bulk edit **View selected** list to see a checkbox.

   :::image type="content" source="media/how-to-bulk-edit-assets/asset-checkbox.png" alt-text="Screenshot of the checkbox.":::

3. Select the checkbox to add it to the bulk edit **View selected** list. Once added, you will see the selected items icon at the bottom of the page.

   :::image type="content" source="media/how-to-bulk-edit-assets/selected-list.png" alt-text="Screenshot of the list.":::

4. Repeat the above steps to add all the data assets to the list.

### Add Assets to View selected list from asset detail page

1. In the asset detail page, select the checkbox at the top right corner to add the asset to the bulk edit **View selected** list.

   :::image type="content" source="media/how-to-bulk-edit-assets/asset-list.png" alt-text="Screenshot of the asset.":::

### Bulk edit assets in the View selected list to add, replace, or remove glossary terms.

1. One you are done with the identification of all the data assets which needs to be bulk-edited, Select **View selected** list from search results page or asset details page.

:::image type="content" source="media/how-to-bulk-edit-assets/view-list.png" alt-text="Screenshot of the view.":::

2. Review the list and select **Remove** if you want to remove any terms.

:::image type="content" source="media/how-to-bulk-edit-assets/remove-list.png" alt-text="Screenshot of the remove.":::

3. Select bulk edit to add, remove or replace glossary terms for all the selected assets.

4. To add glossary terms, select Operation as **Add**. Select all the glossary terms you want to add in the New value. Select Apply when complete.
    - Add operation will append New value to the list of glossary terms already tagged to data assets.  
   
    :::image type="content" source="media/how-to-bulk-edit-assets/add-list.png" alt-text="Screenshot of the add.":::

5. To replace glossary terms select Operation as **Replace with**. Select all the glossary terms you want to replace in the New value. Select Apply when complete.
    - Replace operation will replace all the glossary terms for selected data assets with the terms selected in New value.
   
6. To remove glossary terms select Operation as **Remove**. Select Apply when complete.
    - Remove operation will remove all the glossary terms for selected data assets.
   
    :::image type="content" source="media/how-to-bulk-edit-assets/replace-list.png" alt-text="Screenshot of the remove terms.":::

7. Repeat the above for classifications, owners and experts.

    :::image type="content" source="media/how-to-bulk-edit-assets/all-list.png" alt-text="Screenshot of the classifications and contacts.":::

8. Once complete close the bulk edit blade by selecting **Close** or **Remove all and close**. Close will not remove the selected assets whereas remove all and close will remove all the selected assets.
    :::image type="content" source="media/how-to-bulk-edit-assets/close-list.png" alt-text="Screenshot of the close.":::

   > [!Important]
   > The recommended number of assets for bulk edit are 25. Selecting more than 25 might cause performance issues.
   > The **View Selected** box will be visible only if there is at least one asset selected.


Follow the [Tutorial: Create and import glossary terms](how-to-create-import-export-glossary.md) to learn more.
