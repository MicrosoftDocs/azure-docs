---
title: Create, import, export, and manage glossary terms
description: Learn how to create, import, export, and manage business glossary terms in Microsoft Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 03/09/2022
---

# Create, import, and export glossary terms

This article describes how to work with the business glossary in Microsoft Purview. It provides steps to create a business glossary term in the Microsoft Purview data catalog. It also shows you how to import and export glossary terms by using .csv files.

## Create a term

To create a glossary term, follow these steps:

1. On the home page, select **Data catalog** on the left pane, and then select the **Manage glossary** button in the center of the page.

    :::image type="content" source="media/how-to-create-import-export-glossary/find-glossary.png" alt-text="Screenshot of the data catalog with the glossary highlighted." border="true":::

2. On the **Glossary terms** page, select **+ New term**. 

   A page opens with the **System Default** template selected. Choose the template that you want to use to create a glossary term, and then select **Continue**.

   :::image type="content" source="media/how-to-create-import-export-glossary/new-term-with-default-template.png" alt-text="Screenshot of the New term creation." border="true":::

3. Give your new term a name, which must be unique in the catalog. 

   > [!NOTE]
   > Term names are case-sensitive. For example, **Sample** and **sample** could both exist in the same glossary..

4. For **Definition**, add a definition for the term.

   Microsoft Purview enables you to add rich formatting to term definitions. For example, you can add bold, underline, or italic formatting to text. You can also create tables, bulleted lists, or hyperlinks to external resources.

   :::image type="content" source="media/how-to-create-import-export-glossary/rich-text-editor.png" alt-text="Screenshot that shows the rich text editor.":::

   Here are the options for rich text formatting:

   | Name | Description | Keyboard shortcut |
   | ---- | ----------- | ------------ |
   | Bold | Make your text bold. Adding the '*' character around text will also make it bold.  | Ctrl+B |
   | Italic | Make your text italic. Adding the '_' character around text will also make it italic. | Ctrl+I |
   | Underline | Underline your text. | Ctrl+U |
   | Bullets | Create a bulleted list. Adding the '-' character before text will also create a bulleted list. | |
   | Numbering | Create a numbered list. Adding the '1' character before text will also create a numbered list. | | 
   | Heading | Add a formatted heading. | |
   | Font size | Change the size of your text. The default size is 12. | |
   | Decrease indent | Move your paragraph closer to the margin. | |
   | Increase indent | Move your paragraph farther away from the margin. | |
   | Add hyperlink | Create a link ifor quick access to webpages and files. | | 
   | Remove hyperlink | Change a link to plain text. | |
   | Quote | Add quote text. | |
   | Add table | Add a table to your content. | |
   | Edit table | Insert or delete a column or row from a table. | |
   | Clear formatting | Remove all formatting from a selection of text. | |
   | Undo | Undo changes you made to the content. | Ctrl+Z | 
   | Redo | Redo changes you made to the content. | Ctrl+Y | 

   > [!NOTE]
   > Updating a definition with the rich text editor adds the attribute `microsoft_isDescriptionRichText": "true"` in the term payload. This attribute is not visible on the user experience and is automatically populated when the user takes any rich text action. The right text definition if populated in the following snippet of a term's JSON message:
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

   These status markers are metadata associated with the term. Currently, you can set the following status on each term:

   - **Draft**: This term isn't yet officially implemented.
   - **Approved**: This term is officially approved.
   - **Expired**: This term should no longer be used.
   - **Alert**: This term needs attention.   

    > [!Important]
    > If an approval workflow is enabled on the term hierarchy, a new term will go through the approval process when it's created. The term is stored in the catalog only when it's approved. To learn about how to manage approval workflows for a business glossary, see [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
                                                                          
6. Add **Resources** and **Acronym** information. If the term is part of a hierarchy, you can add parent terms at **Parent** on the **Overview** tab.

7. Add **Synonyms** and **Related terms** information on the **Related** tab.

   :::image type="content" source="media/how-to-create-import-export-glossary/related-tab.png" alt-text="Screenshot of New term > Related tab." border="true":::

8. Optionally, select the **Contacts** tab to add experts and stewards to your term.

9. Select **Create** to create your term.

    > [!Important]
    > If an approval workflow is enabled on the term's hierarchy path, you'll see **Submit for approval** instead of the **Create** button. Selecting **Submit for approval** will trigger the approval workflow for this term.

    :::image type="content" source="media/how-to-create-import-export-glossary/submit-for-approval.png" alt-text="Screenshot of submit for approval." border="true":::

## Import terms into the glossary

The Microsoft Purview data catalog provides a template .csv file for you to import your terms into your glossary.

You can import terms from the catalog. Duplicate terms in the file will be overwritten. Duplicate terms include both spelling and capitalization, because term names are case-sensitive. 

1. On the **Glossary terms** page, select **Import terms**.

2. The term template page opens. Match the term template to the kind of .csv file that you want to import.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-term-template-for-import.png" alt-text="Screenshot of the Glossary terms page, Import terms button.":::

3. Download the .csv template and use it to enter the terms that you want to add. Give your template .csv file a name that starts with a letter and only includes letters, numbers, spaces, '_', or other non-ascii unicode characters. Special characters in the file name will create an error.

   > [!Important]
   > The system only supports importing columns that are available in the template. The "System Default" template will have all the default attributes.
   >
   > However, custom term templates will have out of the box attributes and additional custom attributes defined in the template. Therefore, the .CSV file differs both from total number of columns and column names depending on the term template selected. You can also review the file for issues after upload.
   >
   > If you want to upload a file with rich text definition, make sure to enter the definition with markup tags and populate the column **IsDefinitionRichText** to true in the .csv file.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-file-for-import.png" alt-text="Screenshot of the Glossary terms page, select file for Import.":::

4. After you've finished filling out your .csv file, select your file to import and then select **OK**.

5. The system will upload the file and add all the terms to your catalog.
 
   > [!Important]
   > The email address for Stewards and Experts should be the primary address of the user from the Azure Active Directory (Azure AD) group. Alternate email, user principal name and non-Azure AD emails are not yet supported. 

## Export terms from the glossary with custom attributes

You should be able to export terms from the glossary as long as the selected terms belong to same term template.

1. When you are in the glossary, by default the **Export** button is disabled. Once you select the terms you want to export, the **Export** button is enabled if the selected terms belong to same template.

2. Select **Export** to download the selected terms.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-term-template-for-export.png" lightbox="media/how-to-create-import-export-glossary/select-term-template-for-export.png" alt-text="Screenshot of the Glossary terms page, select file for Export.":::

   > [!Important]
   > If the terms in a hierarchy belong to different term templates then you need to split them into different .csv files for import. Also, updating a parent of a term is currently not supported using import process.

## Delete terms

1. On the home page, select **Data catalog** on the left pane, and then select the **Manage glossary** button in the center of the page.

   :::image type="content" source="media/how-to-create-import-export-glossary/find-glossary.png" alt-text="Screenshot of the data catalog with the glossary highlighted." border="true":::

1. By using checkboxes, select the terms that you want to delete. You can select a single term or multiple terms for deletion.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-terms.png" alt-text="Screenshot of the glossary, with a few terms selected." border="true":::

1. Select the **Delete** button on the top menu.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-delete.png" alt-text="Screenshot of the glossary, with the Delete button highlighted in the top menu." border="true":::


1. You're presented with a window that shows all the terms selected for deletion.

   > [!NOTE]
   > If a parent is selected for deletion all the children for that parent are automatically selected for deletion.

   :::image type="content" source="media/how-to-create-import-export-glossary/delete-window.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted. The Revenue term is a parent to two other terms, and because it was selected to be deleted, its child terms are also in the list to be deleted." border="true":::

   Review the list. You can remove the terms you don't want to delete after review by selecting **Remove**.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-remove.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Remove' column highlighted on the right." border="true":::

1. You can also see which terms will require an approval process in the column **Approval Needed**. If approval needed is **Yes**, the term will go through an approval workflow before deletion. If the value is **No**, the term will be deleted without any approvals.

   > [!NOTE]
   > If a parent has an associated approval process, but the child does not, the parent delete term workflow will be triggered. This is because the selection is done on the parent and you are acknowledging to delete child terms along with parent.

   :::image type="content" source="media/how-to-create-import-export-glossary/approval-needed.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Approval needed' column highlighted." border="true":::

1. If there's a least one term that needs to be approved you'll be presented with **Submit for approval** and **Cancel** buttons. Selecting **Submit for approval** will delete all the terms where approval isn't needed and will trigger approval workflows for terms that require it.

   :::image type="content" source="media/how-to-create-import-export-glossary/yes-approval-needed.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Approval needed' column highlighted. An item is listed as approval needed, so at the bottom, buttons available are 'Submit for approval' and 'Cancel'." border="true":::

1. If there are no terms that need to be approved you'll be presented with **Delete** and **Cancel** buttons. Selecting **Delete** will delete all the selected terms.

   :::image type="content" source="media/how-to-create-import-export-glossary/no-approval-needed.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Approval needed' column highlighted. All items are listed as no approval needed, so at the bottom, buttons available are 'Delete' and 'Cancel'." border="true":::

## Business terms with approval workflow enabled

If [workflows](concept-workflow.md) are enabled on a term, then any creates, updates, or deletes to the term will go through an approval before they're saved in the data catalog. 

- **New terms** - when a create approval workflow is enabled on the parent term, during the creation process you'll see **Submit for approval** instead of **Create** after you've entered all the details. Selecting **Submit for approval** will trigger the workflow. You'll receive notification when your request is approved or rejected.

- **Updates to existing terms** - when an update approval workflow is enabled on parent, you'll see **Submit for approval** instead of **Save** when updating the term. Selecting **Submit for approval** will trigger the workflow. The changes won't be saved in catalog until all the approvals are met.

- **Deletion** - when a delete approval workflow is enabled on the parent term, you'll see **Submit for approval** instead of **Delete** when deleting the term. Selecting **Submit for approval** will trigger the workflow. However, the term won't be deleted from catalog until all the approvals are met.

- **Importing terms** - when an import approval workflow enabled for Microsoft Purview's glossary, you'll see **Submit for approval** instead of **OK** in the Import window when importing terms via csv. Selecting **Submit for approval** will trigger the workflow. However, the terms in the file won't be updated in catalog until all the approvals are met.

:::image type="content" source="media/how-to-create-import-export-glossary/create-submit-for-approval.png" alt-text="Screenshot of the create new term window. The parent term requires approval, so the available buttons at the bottom of the page are 'Submit for approval' and 'Cancel'." border="true":::

## Next steps

* For more information about glossary terms, see the [glossary reference](reference-azure-purview-glossary.md)
* For more information about approval workflows of business glossary, see the [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
