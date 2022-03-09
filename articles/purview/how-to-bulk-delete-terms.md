---
title: How to bulk delete business terms
description: Learn bulk edit delete business terms in Azure Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 3/8/2022
---

# How to bulk delete business terms.

This article describes how to bulk delete terms. 


1. Select **Data catalog** in the left navigation on the home page, and then select the **Manage glossary** button in the center of the page.

    :::image type="content" source="media/how-to-bulk-delete-terms/find-glossary.png" alt-text="Screenshot of the data catalog with the glossary highlighted." border="true":::

1. Using checkboxes select the terms you want to delete.

    :::image type="content" source="media/how-to-bulk-delete-terms/select-terms.png" alt-text="Screenshot of the glossary, with a few terms selected." border="true":::

1. Select **Delete** button on the top.

    :::image type="content" source="media/how-to-bulk-delete-terms/select-delete.png" alt-text="Screenshot of the glossary, with the Delete button highlighted in the top menu." border="true":::


1. You'll be presented with a window that shows all the terms selected for deletion.

    > [!NOTE]
    > If a parent is selected for deletion all the children for that parent are automatically selected for deletion.

    :::image type="content" source="media/how-to-bulk-delete-terms/delete-window.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted. The Revenue term is a parent to two other terms, and because it was selected to be deleted, its child terms are also in the list to be deleted." border="true":::

1. Review the list. You can remove the terms you don't want to delete after review by selecting **Remove**.

    :::image type="content" source="media/how-to-bulk-delete-terms/select-remove.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Remove' column highlighted on the right." border="true":::

1. You can also understand which deletion terms will go via approval process in the column **Approval Needed**. If Approval needed is **Yes** it implies that the term will go via approval workflow before deletion. If the value is **No** then the term will be deleted without any approvals.

    > [!NOTE]
    > The parent delete term workflow will be triggered in this case even if the child has a different delete workflow association. The reason for this being the selection is done on the parent and you are acknowledging to delete child terms along with parent.

    :::image type="content" source="media/how-to-bulk-delete-terms/approval-needed.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Approval needed' column highlighted." border="true":::

1. If there's a least one term that needs to be approved you'll be presented with **Submit for approval** and **Cancel** buttons. Selecting **Submit for approval** will delete all the terms where approval isn't needed and will trigger approval workflows for terms that are configured to go via approval process before deletion.

    :::image type="content" source="media/how-to-bulk-delete-terms/yes-approval-needed.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Approval needed' column highlighted. An item is listed as approval needed, so at the bottom, buttons available are 'Submit for approval' and 'Cancel'." border="true":::

1. If there are no terms that need to be approved you'll be presented with **Delete** and **Cancel** buttons. Selecting **Delete** will delete all the selected terms.

    :::image type="content" source="media/how-to-bulk-delete-terms/no-approval-needed.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Approval needed' column highlighted. All items are listed as no approval needed, so at the bottom, buttons available are 'Delete' and 'Cancel'." border="true":::

## Next steps

Follow the [Tutorial: Create and import glossary terms](how-to-create-import-export-glossary.md) to learn more.
