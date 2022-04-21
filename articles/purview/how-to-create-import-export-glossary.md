---
title: How to create, import, export, and manage glossary terms
description: Learn how to create, import, export, and manage business glossary terms in Microsoft Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 03/09/2022
---

# How to create, import, and export glossary terms

This article describes how to work with the business glossary in Microsoft Purview. Steps are provided to create a business glossary term in Microsoft Purview data catalog, and import and export glossary terms using .csv files.

## Create a new term

To create a new glossary term, follow these steps:

1. Select **Data catalog** in the left navigation on the home page, and then select the **Manage glossary** button in the center of the page.

    :::image type="content" source="media/how-to-create-import-export-glossary/find-glossary.png" alt-text="Screenshot of the data catalog with the glossary highlighted." border="true":::

2. On the **Glossary terms** page, select **+ New term**. A page opens with **System Default** template selected. Choose the template you want to create glossary term with and select **Continue**.

   :::image type="content" source="media/how-to-create-import-export-glossary/new-term-with-default-template.png" alt-text="Screenshot of the New term creation." border="true":::

3. Give your new term a name, which must be unique in the catalog. The term name is case-sensitive, meaning you could have a term called **Sample** and **sample** in the catalog.

4. Add a **Definition**.

5. Set the **Status** for the term. New terms default to **Draft** status.

   :::image type="content" source="media/how-to-create-import-export-glossary/overview-tab.png" alt-text="Screenshot of the status choices.":::

   These status markers are metadata associated with the term. Currently you can set the following status on each term:

   - **Draft**: This term isn't yet officially implemented.
   - **Approved**: This term is official/standard/approved.
   - **Expired**: This term should no longer be used.
   - **Alert**: This term needs attention.

6. Add **Resources** and **Acronym**. If the term is part of hierarchy, you can add parent terms at **Parent** in the overview tab.

7. Add **Synonyms** and **Related terms** in the related tab.

   :::image type="content" source="media/how-to-create-import-export-glossary/related-tab.png" alt-text="Screenshot of New term > Related tab." border="true":::

8. Optionally, select the **Contacts** tab to add Experts and Stewards to your term.

9. Select **Create** to create your term.

## Import terms into the glossary

The Microsoft Purview Data Catalog provides a template .csv file for you to import your terms into your Glossary.

You can import terms in the catalog. The duplicate terms in file will be overwritten.

Notice that term names are case-sensitive. For example, `Sample` and `saMple` could both exist in the same glossary.

### To import terms, follow these steps

1. When you are in the **Glossary terms** page, select **Import terms**.

2. The term template page opens. Match the term template to the kind of .CSV you want to import.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-term-template-for-import.png" alt-text="Screenshot of the Glossary terms page, Import terms button.":::

3. Download the csv template and use it to enter your terms you would like to add. Give your template csv file a name that starts with a letter and only includes letters, numbers, spaces, '_', or other non-ascii unicode characters. Special characters in the file name will create an error.

   > [!Important]
   > The system only supports importing columns that are available in the template. The "System Default" template will have all the default attributes.
   > However, custom term templates will have out of the box attributes and additional custom attributes defined in the template. Therefore, the .CSV file differs both from total number of columns and column names depending on the term template selected. You can also review the file for issues after upload.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-file-for-import.png" alt-text="Screenshot of the Glossary terms page, select file for Import.":::

4. Once you've finished filling out your .csv file, select your file to import and then select **OK**.

5. The system will upload the file and add all the terms to your catalog.
 
   > [!Important]
   > The email address for Stewards and Experts should be the primary address of the user from AAD group. Alternate email, user principal name and non-AAD emails are not yet supported. 

## Export terms from glossary with custom attributes

You should be able to export terms from glossary as long as the selected terms belong to same term template.

1. When you are in the Glossary, by default the **Export** button is disabled. Once you select the terms you want to export, the **Export** button is enabled if the selected terms belong to same template.

2. Select **Export** to download the selected terms.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-term-template-for-export.png" lightbox="media/how-to-create-import-export-glossary/select-term-template-for-export.png" alt-text="Screenshot of the Glossary terms page, select file for Export.":::

   > [!Important]
   > If the terms in a hierarchy belong to different term templates then you need to split them into different .CSV files for import. Also, updating a parent of a term is currently not supported using import process.

## Delete terms

1. Select **Data catalog** in the left navigation on the home page, and then select the **Manage glossary** button in the center of the page.

   :::image type="content" source="media/how-to-create-import-export-glossary/find-glossary.png" alt-text="Screenshot of the data catalog with the glossary highlighted." border="true":::

1. Using checkboxes, select the terms you want to delete. You can select a single term, or multiple terms for deletion.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-terms.png" alt-text="Screenshot of the glossary, with a few terms selected." border="true":::

1. Select  the **Delete** button in the top menu.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-delete.png" alt-text="Screenshot of the glossary, with the Delete button highlighted in the top menu." border="true":::


1. You'll be presented with a window that shows all the terms selected for deletion.

   > [!NOTE]
   > If a parent is selected for deletion all the children for that parent are automatically selected for deletion.

   :::image type="content" source="media/how-to-create-import-export-glossary/delete-window.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted. The Revenue term is a parent to two other terms, and because it was selected to be deleted, its child terms are also in the list to be deleted." border="true":::

1. Review the list. You can remove the terms you don't want to delete after review by selecting **Remove**.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-remove.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Remove' column highlighted on the right." border="true":::

1. You can also see which terms will require an approval process in the column **Approval Needed**. If Approval needed is **Yes**, the term will go through an approval workflow before deletion. If the value is **No** then the term will be deleted without any approvals.

   > [!NOTE]
   > If a parent has an associated approval process, but the child does not, the parent delete term workflow will be triggered. This is because the selection is done on the parent and you are acknowledging to delete child terms along with parent.

   :::image type="content" source="media/how-to-create-import-export-glossary/approval-needed.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Approval needed' column highlighted." border="true":::

1. If there's a least one term that needs to be approved you'll be presented with **Submit for approval** and **Cancel** buttons. Selecting **Submit for approval** will delete all the terms where approval isn't needed and will trigger approval workflows for terms that require it.

   :::image type="content" source="media/how-to-create-import-export-glossary/yes-approval-needed.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Approval needed' column highlighted. An item is listed as approval needed, so at the bottom, buttons available are 'Submit for approval' and 'Cancel'." border="true":::

1. If there are no terms that need to be approved you'll be presented with **Delete** and **Cancel** buttons. Selecting **Delete** will delete all the selected terms.

   :::image type="content" source="media/how-to-create-import-export-glossary/no-approval-needed.png" alt-text="Screenshot of the glossary delete window, with a list of all terms to be deleted, and the 'Approval needed' column highlighted. All items are listed as no approval needed, so at the bottom, buttons available are 'Delete' and 'Cancel'." border="true":::


## Business terms with approval workflow enabled

If [workflows](concept-workflow.md) are enabled on a term, then any creates, updates, or deletes to the term will go through an approval before they're saved in data catalog. 

- **New terms** - when a create approval workflow is enabled on the parent term, during the creation process you'll see **Submit for approval** instead of **Create** after you've entered all the details. Selecting **Submit for approval** will trigger the workflow. You'll receive notification when your request is approved or rejected.

- **Updates to existing terms** - when an update approval workflow is enabled on parent, you'll see **Submit for approval** instead of **Save** when updating the term. Selecting **Submit for approval** will trigger the workflow. The changes won't be saved in catalog until all the approvals are met.

- **Deletion** - when a delete approval workflow is enabled on the parent term, you'll see **Submit for approval** instead of **Delete** when deleting the term. Selecting **Submit for approval** will trigger the workflow. However, the term won't be deleted from catalog until all the approvals are met.

- **Importing terms** - when an import approval workflow enabled for Microsoft Purview's glossary, you'll see **Submit for approval** instead of **OK** in the Import window when importing terms via csv. Selecting **Submit for approval** will trigger the workflow. However, the terms in the file won't be updated in catalog until all the approvals are met.

:::image type="content" source="media/how-to-create-import-export-glossary/create-submit-for-approval.png" alt-text="Screenshot of the create new term window. The parent term requires approval, so the available buttons at the bottom of the page are 'Submit for approval' and 'Cancel'." border="true":::

## Next steps

* For more information about glossary terms, see the [glossary reference](reference-azure-purview-glossary.md)
* For more information about approval workflows of business glossary, see the [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
