---
title: Create, import, export, and delete glossary terms
description: Learn how to create, import, export, and manage business glossary terms in Microsoft Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 03/09/2022
---

# Create, import, export, and delete glossary terms

This article describes how to work with the business glossary in Microsoft Purview. It provides steps to create a business glossary term in the Microsoft Purview data catalog. It also shows you how to import and export glossary terms by using .CSV files, and how to delete terms that you no longer need.

## Create a term

To create a glossary term, follow these steps:

1. On the home page, select **Data catalog** on the left pane, and then select the **Manage glossary** button in the center of the page.

    :::image type="content" source="media/how-to-create-import-export-glossary/find-glossary.png" alt-text="Screenshot of the data catalog with the button for managing a glossary highlighted." border="true":::

2. On the **Glossary terms** page, select **+ New term**. 

   A pane opens with the **System default** template selected. Choose the template that you want to use to create a glossary term, and then select **Continue**.

   :::image type="content" source="media/how-to-create-import-export-glossary/new-term-with-default-template.png" alt-text="Screenshot of the button and pane for creating a new term." border="true":::

3. Give your new term a name, which must be unique in the catalog. 

   > [!NOTE]
   > Term names are case-sensitive. For example, **Sample** and **sample** could both exist in the same glossary.

4. For **Definition**, add a definition for the term.

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
                             
5. For **Status**, select the status for the term. New terms default to **Draft**.

   :::image type="content" source="media/how-to-create-import-export-glossary/overview-tab.png" alt-text="Screenshot of the status choices.":::

   Status markers are metadata associated with the term. Currently, you can set the following status on each term:

   - **Draft**: This term isn't yet officially implemented.
   - **Approved**: This term is officially approved.
   - **Expired**: This term should no longer be used.
   - **Alert**: This term needs attention.   

    > [!Important]
    > If an approval workflow is enabled on the term hierarchy, a new term will go through the approval process when it's created. The term is stored in the catalog only when it's approved. To learn about how to manage approval workflows for a business glossary, see [Approval workflow for business terms](how-to-workflow-business-terms-approval.md).
                                                                          
6. Add **Resources** and **Acronym** information. If the term is part of a hierarchy, you can add parent terms at **Parent** on the **Overview** tab.

7. Add **Synonyms** and **Related terms** information on the **Related** tab, and then select **Apply**.

   :::image type="content" source="media/how-to-create-import-export-glossary/related-tab.png" alt-text="Screenshot of tab for related terms and the box for adding synonyms." border="true":::

8. Optionally, select the **Contacts** tab to add experts and stewards to your term.

9. Select **Create** to create your term.

    > [!Important]
    > If an approval workflow is enabled on the term's hierarchy path, you'll see **Submit for approval** instead of the **Create** button. Selecting **Submit for approval** will trigger the approval workflow for this term.

    :::image type="content" source="media/how-to-create-import-export-glossary/submit-for-approval.png" alt-text="Screenshot of the button to submit a term for approval." border="true":::

## Import terms into the glossary

The Microsoft Purview data catalog provides a template .CSV file for you to import terms from the catalog into your glossary. Duplicate terms include both spelling and capitalization, because term names are case-sensitive. 

1. On the **Glossary terms** page, select **Import terms**.

   The term template page opens. 

2. Match the term template to the kind of .CSV file that you want to import, and then select **Continue**.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-term-template-for-import.png" alt-text="Screenshot of the template list for importing a term, with the system default template highlighted.":::

3. Download the .csv template and use it to enter the terms that you want to add. 

   Give your template file a name that starts with a letter and includes only letters, numbers, spaces, an underscore (_), or other non-ASCII Unicode characters. Special characters in the file name will create an error.

   > [!Important]
   > The system supports only importing columns that are available in the template. The **System default** template will have all the default attributes.
   >
   > Custom term templates define out-of-the box attributes and additional custom attributes. Therefore, the .CSV file differs in the total number of columns and the column names, depending on the term template that you select. You can also review the file for problems after upload.
   >
   > If you want to upload a file with a rich text definition, be sure to enter the definition with markup tags and populate the column `IsDefinitionRichText` to `true` in the .CSV file.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-file-for-import.png" alt-text="Screenshot of the button for downloading a sample template file.":::

4. After you finish filling out your .CSV file, select your file to import, and then select **OK**.

The system will upload the file and add all the terms to your glossary.
 
> [!Important]
> The email address for an expert or steward should be the primary address of the user from the Azure Active Directory (Azure AD) group. Alternate emails, user principal names, and non-Azure AD emails are not yet supported. 

## Export terms from the glossary with custom attributes

You can export terms from the glossary as long as the selected terms belong to same term template.

When you're in the glossary, the **Export terms** button is disabled by default. After you select the terms that you want to export, the **Export terms** button is enabled if the selected terms belong to same template.

Select **Export terms** to download the selected terms.

:::image type="content" source="media/how-to-create-import-export-glossary/select-term-template-for-export.png" lightbox="media/how-to-create-import-export-glossary/select-term-template-for-export.png" alt-text="Screenshot of the button to export terms on the glossary terms page.":::

> [!Important]
> If the terms in a hierarchy belong to different term templates, you need to split them into different .CSV files for import. Also, the import process currently doesn't support updating the parent of a term.

## Delete terms

1. On the home page, select **Data catalog** on the left pane, and then select the **Manage glossary** button in the center of the page.

   :::image type="content" source="media/how-to-create-import-export-glossary/find-glossary.png" alt-text="Screenshot of the data catalog and the button for managing a glossary." border="true":::

1. Select the checkboxes for the terms that you want to delete. You can select a single term or multiple terms for deletion.

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
