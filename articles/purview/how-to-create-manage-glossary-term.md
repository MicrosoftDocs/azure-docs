---
title: Create and manage glossary terms
description: Learn how to create and manage business glossary terms in Microsoft Purview.
author: evangelinew
ms.author: evwhite
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 11/14/2022
---

# Create and manage glossary terms

This article describes how to work with the business glossary in Microsoft Purview. It provides steps to create a business glossary term in the Microsoft Purview Data Catalog. It also shows you how to import and export glossary terms by using .CSV files, and how to delete terms that you no longer need.

## Create a term

To create a glossary term, follow these steps:

1. On the home page, select **Data catalog** on the left pane, and then select the **Manage glossary** button in the center of the page.

    :::image type="content" source="media/how-to-create-import-export-glossary/find-glossary.png" alt-text="Screenshot of the data catalog with the button for managing a glossary highlighted." border="true":::

1. On the **Business glossary** page, select the glossary you would like to create the new term for, then select **+ New term**. A term can only be added to one glossary at a time.

   > [!NOTE]
   > For more information about creating and managing glossaries see the [manage glossaries page.](how-to-create-manage-glossary.md)

   A pane opens with the **System default** template selected. Choose the template, or templates, that you want to use to create a glossary term, and then select **Continue**.
   Selecting multiple templates will allow you to use the custom attributes from those templates.

   :::image type="content" source="media/how-to-create-import-export-glossary/new-term-with-default-template.png" alt-text="Screenshot of the button and pane for creating a new term." border="true":::

1. If you selected multiple templates, you can select and deselect templates from the **Term template** dropdown at the top of the page.

1. Give your new term a name, which must be unique in the catalog. 

   > [!NOTE]
   > Term names are case-sensitive. For example, **Sample** and **sample** could both exist in the same glossary.

1. For **Definition**, add a definition for the term.

   Microsoft Purview enables you to add rich formatting to term definitions. For example, you can add bold, underline, or italic formatting to text. You can also create tables, bulleted lists, or hyperlinks to external resources.

   :::image type="content" source="media/how-to-create-import-export-glossary/rich-text-editor.png" alt-text="Screenshot that shows the rich text editor.":::

   Here are the options for rich text formatting:

   | Name | Description | Keyboard shortcut |
   | ---- | ----------- | ------------ |
   | Bold | Make your text bold. Adding the asterisk (*) character around text will also make it bold.  | Ctrl+B |
   | Italic | Make your text italic. Adding the underscore (_) character around text will also make it italic. | Ctrl+I |
   | Underline | Underline your text. | Ctrl+U |
   | Bullets | Create a bulleted list. Adding the hyphen (-) character before text will also create a bulleted list. | |
   | Numbering | Create a numbered list. Adding the 1 character before text will also create a numbered list. | | 
   | Heading | Add a formatted heading. | |
   | Font size | Change the size of your text. The default size is 12. | |
   | Decrease indent | Move your paragraph closer to the margin. | |
   | Increase indent | Move your paragraph farther away from the margin. | |
   | Add hyperlink | Create a link for quick access to webpages and files. | | 
   | Remove hyperlink | Change a link to plain text. | |
   | Quote | Add quote text. | |
   | Add table | Add a table to your content. | |
   | Edit table | Insert or delete a column or row from a table. | |
   | Clear formatting | Remove all formatting from a selection of text. | |
   | Undo | Undo changes that you made to the content. | Ctrl+Z | 
   | Redo | Redo changes that you made to the content. | Ctrl+Y | 

   > [!NOTE]
   > Updating a definition with the rich text editor adds the attribute `"microsoft_isDescriptionRichText": "true"` in the term payload. This attribute is not visible on the user experience and is automatically populated when you take any rich text action. The right text definition is populated in the following snippet of a term's JSON message:
   >
   >```json
   >   {
   >        "additionalAttributes": {
   >        "microsoft_isDescriptionRichText": "true"
   >        }
   >    }
   >```
                             
1. For **Status**, select the status for the term. New terms default to **Draft**.

   :::image type="content" source="media/how-to-create-import-export-glossary/overview-tab.png" alt-text="Screenshot of the status choices.":::

   Status markers are metadata associated with the term. Currently, you can set the following status on each term:

   - **Draft**: This term isn't yet officially implemented.
   - **Approved**: This term is officially approved.
   - **Expired**: This term should no longer be used.
   - **Alert**: This term needs attention.   

    > [!Important]
    > If an approval workflow is enabled on the term hierarchy, a new term will go through the approval process when it's created. The term is stored in the catalog only when it's approved. To learn about how to manage approval workflows for a business glossary, see [Approval workflow for business terms](how-to-workflow-business-terms-approval.md).
                                                                          
1. Add **Resources** and **Acronym** information. If the term is part of a hierarchy, you can add parent terms at **Parent** on the **Overview** tab.

1. Add **Synonyms** and **Related terms** information on the **Related** tab, and then select **Apply**.

   :::image type="content" source="media/how-to-create-import-export-glossary/related-tab.png" alt-text="Screenshot of tab for related terms and the box for adding synonyms." border="true":::

1. Optionally, select the **Contacts** tab to add experts and stewards to your term.

1. Select **Create** to create your term.

    > [!Important]
    > If an approval workflow is enabled on the term's hierarchy path, you'll see **Submit for approval** instead of the **Create** button. Selecting **Submit for approval** will trigger the approval workflow for this term.

    :::image type="content" source="media/how-to-create-import-export-glossary/submit-for-approval.png" alt-text="Screenshot of the button to submit a term for approval." border="true":::

## Delete terms

1. On the home page, select **Data catalog** on the left pane, and then select the **Manage glossary** button in the center of the page.

   :::image type="content" source="media/how-to-create-import-export-glossary/find-glossary.png" alt-text="Screenshot of the data catalog and the button for managing a glossary." border="true":::

1. Select the glossary that has the terms you want to delete, and select the **Terms** tab.

1. Select checkboxes for the terms that you want to delete. You can select a single term or multiple terms for deletion.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-terms.png" alt-text="Screenshot of the glossary with a few terms selected." border="true":::

1. Select the **Delete** button on the top menu.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-delete.png" alt-text="Screenshot of the glossary with the Delete button highlighted on the top menu." border="true":::

1. A new window shows all the terms selected for deletion. In the following example, the list of terms to be deleted are the parent term **Revenue** and its two child terms.

   > [!NOTE]
   > If a parent is selected for deletion, all the children for that parent are automatically selected for deletion. 

   :::image type="content" source="media/how-to-create-import-export-glossary/delete-window.png" alt-text="Screenshot of the window for deleting glossary terms, with a list of all terms to be deleted." border="true":::

   Review the list. You can remove the terms that you don't want to delete by selecting **Remove**.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-remove.png" alt-text="Screenshot of the window for deleting glossary terms, with the column for removing items from the list of terms to be deleted." border="true":::

1. The **Approval needed** column shows which terms require an approval process. If the value is **Yes**, the term will go through an approval workflow before deletion. If the value is **No**, the term will be deleted without any approvals.

   > [!NOTE]
   > If a parent has an associated approval process but its child doesn't, the workflow for deleting the parent term will be triggered. This is because the selection is done on the parent, and you're acknowledging the deletion of child terms along with parent.

   If at least one term needs to be approved, **Submit for approval** and **Cancel** buttons appear. Selecting **Submit for approval** will delete all the terms where approval isn't needed and will trigger approval workflows for terms that require it.

   :::image type="content" source="media/how-to-create-import-export-glossary/yes-approval-needed.png" alt-text="Screenshot of the window for deleting glossary terms, which shows terms that need approval and includes the button for submitting them for approval." border="true":::

   If no terms need to be approved, **Delete** and **Cancel** buttons appear. Selecting **Delete** will delete all the selected terms.

   :::image type="content" source="media/how-to-create-import-export-glossary/no-approval-needed.png" alt-text="Screenshot of the window for deleting glossary terms, which shows terms that don't need approval and the button for deleting them." border="true":::

## Business terms with approval workflow enabled

If [workflows](concept-workflow.md) are enabled on a term, then any create, update, or delete actions for the term will go through an approval before they're saved in the data catalog. 

- **New terms**: When a create approval workflow is enabled on a parent term, you see **Submit for approval** instead of **Create** after you enter all the details in the creation process. Selecting **Submit for approval** triggers the workflow. You'll get a notification when your request is approved or rejected.

- **Updates to existing terms**: When an update approval workflow is enabled on a parent term, you see **Submit for approval** instead of **Save** when you're updating the term. Selecting **Submit for approval** triggers the workflow. The changes won't be saved in catalog until all the approvals are met.

- **Deletion**: When a delete approval workflow is enabled on the parent term, you see **Submit for approval** instead of **Delete** when you're deleting the term. Selecting **Submit for approval** triggers the workflow. However, the term won't be deleted from the catalog until all the approvals are met.

- **Importing terms**: When an import approval workflow is enabled for the Microsoft Purview glossary, you see **Submit for approval** instead of **OK** in the **Import** window when you're importing terms via .CSV file. Selecting **Submit for approval** triggers the workflow. However, the terms in the file won't be updated in the catalog until all the approvals are met.

:::image type="content" source="media/how-to-create-import-export-glossary/create-submit-for-approval.png" alt-text="Screenshot of the window for creating a new term and the button for submitting the term for approval." border="true":::

## Next steps

* For more information about glossary terms, see the [glossary reference](reference-azure-purview-glossary.md).
* For more information about approval workflows of the business glossary, see [Approval workflow for business terms](how-to-workflow-business-terms-approval.md).
