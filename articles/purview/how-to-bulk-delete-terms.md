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

    :::image type="content" source="media/how-to-create-import-export-glossary/find-glossary.png" alt-text="Screenshot of the data catalog with the glossary highlighted." border="true":::

1. Using checkboxes select the terms you want to delete

1. Select **Delete** button on the top.

1. You will be presented with a blade which shows all the terms selected for deletion.

 [!NOTE]
If a parent is selected for deletion all the children for that parent are automatically selected for deletion.  

1. Review the list. You can remove the terms you don't want to delete after review by clicking on **Remove**
1. You can also understand which deletion terms will go via approval process in the column **Approval Needed**. If Approval needed is **Yes** it implies that the term will go via approval workflow before deletion. If the value is **No** then the term will be deleted without any approvals.

 [!NOTE]
The parent delete term workflow will be triggered in this case even if the child has a different delete workflow association. The reason for this being the selection is done on the parent and you are acknowledging to delete child terms along with parent.

1. If there is a least one term which needs to be go via approval process you will be presented with **Submit for approval** and **Cancel** buttons. Clicking on **Submit for approval** will delete all the terms where approval is not needed and will trigger approval workflows for terms which are configured to go via approval process before deletion.

1. If there is a no terms which need to be go via approval process you will be presented with **Delete** and **Cancel** buttons. Clicking on **Delete** will delete all the selected terms.

## Next steps

Follow the [Tutorial: Create and import glossary terms](how-to-create-import-export-glossary.md) to learn more.
