---
title: How to create, import, and export glossary terms
description: Learn how to create, import, and export glossary terms in Azure Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 09/27/2021
---

# How to create, import, and export glossary terms

This article describes how to work with the business glossary in Azure Purview. Steps are provided to create a business glossary term in Azure Purview data catalog, and import and export glossary terms using .csv files.

## Create a new term

To create a new glossary term, do the following steps:

1. Select **Data catalog** in the left navigation on the home page, and then select the **Manage glossary** button in the center of the page.

    :::image type="content" source="media/how-to-create-import-export-glossary/find-glossary.png" alt-text="Screenshot of the data catalog with the glossary highlighted." border="true":::

2. On the **Glossary terms** page, select **+ New term**. A page opens with **System Default** template selected. Choose the template you want to create glossary term with and select **Continue**.

   :::image type="content" source="media/how-to-create-import-export-glossary/new-term-with-default-template.png" alt-text="Screenshot of the New term creation." border="true":::

3. Give your new term a name, which must be unique in the catalog. The term name is case-sensitive, meaning you could have a term called **Sample** and **sample** in the catalog.

4. Add a **Definition**.

5. Set the **Status** for the term. New terms default to **Draft** status.

   :::image type="content" source="media/how-to-create-import-export-glossary/overview-tab.png" alt-text="Screenshot of the status choices.":::

   These status markers are metadata associated with the term. Currently you can set the following status on each term:

   - **Draft**: This term is not yet officially implemented.
   - **Approved**: This term is official/standard/approved.
   - **Expired**: This term should no longer be used.
   - **Alert**: This term needs attention.

6. Add **Resources** and **Acronym**. If the term is part of hierarchy, you can add parent terms at **Parent** in the overview tab.

7. Add **Synonyms** and **Related terms** in the related tab.

   :::image type="content" source="media/how-to-create-import-export-glossary/related-tab.png" alt-text="Screenshot of New term > Related tab." border="true":::

8. Optionally, select the **Contacts** tab to add Experts and Stewards to your term.

9. Select **Create** to create your term.

## Import terms into the glossary

The Azure Purview Data Catalog provides a template .csv file for you to import your terms into your Glossary.

You can import terms in the catalog. The duplicate terms in file will be overwritten.

Notice that term names are case-sensitive. For example, `Sample` and `saMple` could both exist in the same glossary.

### To import terms, follow these steps

1. When you are in the **Glossary terms** page, select **Import terms**.

2. The term template page opens. Match the term template to the kind of .CSV you want to import.

   :::image type="content" source="media/how-to-create-import-export-glossary/select-term-template-for-import.png" alt-text="Screenshot of the Glossary terms page, Import terms button.":::

3. Download the csv template and use it to enter your terms you would like to add. When naming your template csv file, the name needs to start with a letter and can only include letters, numbers, spaces, '_', or other non-ascii unicode characters. Special characters in the file name will create an error.

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

## Business terms with approval workflow enabled

If workflows are enabled on a term, then any creates, updates or deletes to the term will go through approval before they are saved in data catalog. 

1. For new terms with create approval workflow enabled on parent, you will see **Submit for approval** instead of **Create** after you have entered all the details. Clicking on submit for approval will trigger the workflow.
1. For updates to the existing terms with update approval workflow enabled on parent, you will see **Submit for approval** instead of **Save**. Click on submit for approval will trigger the workflow. The changes will not be saved in catalog until all the approvals are met.
1.  For deletion to the terms with delete approval workflow enabled on parent, you will see **Submit for approval** instead of **Delete**. Click on submit for approval will trigger the workflow. However, the term will not be deleted from catalog until all the approvals are met.
1.   For importing terms via .CSV with Import approval workflow enabled for Azure Purview's glossary, you will see **Submit for approval** instead of **OK** after the file is uploaded in Import blade. Click on submit for approval will trigger the workflow. However, the terms in the file will not be updated in catalog until all the approvals are met.

## Next steps

* For more information about glossary terms, see the [glossary reference](reference-azure-purview-glossary.md)
* For more information about approval workflows of business glossary, see the [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)