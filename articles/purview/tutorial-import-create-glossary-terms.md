---
title: 'Tutorial: Create and import glossary terms in Azure Purview (preview)'
description: This tutorial describes how to create glossary terms, add glossary terms to an asset, and import glossary terms. 
author: shsandeep123
ms.author: sandeepshah
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 12/01/2020
---
# Tutorial: Create and import glossary terms in Azure Purview (preview)

> [!IMPORTANT]
> Azure Purview is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

A glossary is an important tool for maintaining and organizing your catalog. You build your glossary by defining new terms or importing a term list and then applying those terms to your assets.

This tutorial is *part 5 of a five-part tutorial series* in which you learn the fundamentals of how to manage data governance across a data estate using Azure Purview. This tutorial builds on the work you completed in [Part 4: Explore resource sets, details, schemas, and classifications in Azure Purview (preview)](tutorial-schemas-and-classifications.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create glossary terms.
> * Add glossary terms to an asset.
> * Import glossary terms.

## Prerequisites

* Complete [Tutorial: Explore resource sets, details, schemas, and classifications in Azure Purview (preview)](tutorial-schemas-and-classifications.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create glossary terms

You can create business or technical terms in the glossary. You can also annotate your assets by applying terms to them.

Here's a summary of some of the most-common fields on the **Glossary term** page:

* **Status**: Assign a status to the term (**Draft**, **Approved**, **Expired**, or **Alert**).

* **Definition**: Enter a definition of the term.

* **Acronym**: Enter an abbreviated version of the term by using the initial letters of each word.

* **Synonyms**: Select other terms with the same or similar definitions.

* **Related Terms**: Select other terms in the glossary that are related to this one but have different definitions. Examples are technical terms that are related to a business term, a code name, or other terms that should be associated with the term.

Create a glossary term by following these steps:

1. Navigate to your Azure Purview resource in the Azure portal and select **Open Purview Studio**. You're automatically taken to your Purview Studio's home page.

1. Select **Glossary** from the left pane to open the **Glossary terms** page.

   :::image type="content" source="./media/tutorial-import-create-glossary-terms/glossary-terms-page.png" alt-text="Screenshot showing the Glossary terms page.":::

1. Select **New term** > **System default** > **Continue**.

1. On the **Overview** tab of the **New term** page, enter the **Name** for the new term: *Financial*.

1. Enter the **Definition**: *This term represents financial information for Contoso Inc.*

1. In the **Status** drop-down list, select **Approved**.

1. When you're finished, select **Create**.

    :::image type="content" source="./media/tutorial-import-create-glossary-terms/enter-new-glossary-term.png" alt-text="Screenshot showing how to create a new glossary term.":::

## Add glossary terms to an asset

1. Use the steps you learned in [part 1 of this tutorial series](tutorial-scan-data.md) to find an asset. For example, **Contoso_CashFlow_{N}.csv**.

1. On the asset details page, select **Edit**.

1. In the **Glossary terms** drop-down list in the **Overview** tab, select **Financial**, and then select **Save**.

   :::image type="content" source="./media/tutorial-import-create-glossary-terms/add-glossary-term-to-asset.png" alt-text="Screenshot showing how to add a glossary term to an asset.":::

1. Go to the **Glossary terms** section on the **Overview** tab and note that the term *Financial* was applied to the asset.

## Import glossary terms

To import terms or update existing terms in bulk, upload a pre-populated template to your glossary.

In this procedure, you import glossary terms via a .csv file:

1. Note where you stored the file named *StarterKitTerms.csv*, which is part of the starter kit that you downloaded in [part 1 of this tutorial series](tutorial-scan-data.md).

   This file contains a list of pre-populated terms that are relevant to your data estate.

 > [!Important]
   > The email address for Stewards and Experts in the .CSV file should be the primary address of the user from AAD group. Alternate email, user principal name and non-AAD emails are not yet supported. You need to replace the email addresses with the AAD primary address from your organization.

1. To begin importing, select **Glossary**, and then select **Import terms**.

    :::image type="content" source="./media/tutorial-import-create-glossary-terms/import-glossary-terms-select.png" alt-text="Screenshot showing how to import glossary terms.":::

1. On the **Import terms** page, select **System default**, and then select **Continue**.

1. Select **Browse**, go to the location where you downloaded *StarterKitTerms.csv*, and then select **Open**.

1. Select **OK** to begin importing the terms.

   After the import is finished, the new glossary terms are displayed on the **Glossary terms** page.

1. View each of the newly imported terms to see how they're defined.

## Create custom term templates

In this section, you learn how to create a custom term template with custom attributes and import data using a template csv file.

There are several existing System term templates, which you can view by selecting **Glossary** > **Manage term templates** > **System**.

:::image type="content" source="./media/tutorial-import-create-glossary-terms/system-term-templates.png" alt-text="system term templates.":::

To create a new custom term template, do the following steps:

1. Select **Glossary** from the left side menu.
1. Select **Manage term templates** > **Custom** > **New term template**

   :::image type="content" source="./media/tutorial-import-create-glossary-terms/create-new-custom-term-template.png" alt-text="screate a new custom term template.":::

On the **New term template** screen, do the following steps:

1. Enter **Template name**: `Sensitivity level`.
1. Enter your desired description, such as `Indicates the level of sensitivity for this data.`
1. Select **+ New attribute** to open a dialog for adding attributes.

   :::image type="content" source="./media/tutorial-import-create-glossary-terms/new-term-template-screen-start.png" alt-text="new term template screen start.":::

1. On the **New attribute** screen, enter the following parameters:

   |Setting|Suggested value|
   |---------|-----------|
   |Attribute name |is sensitive information|
   |Field type | Single choice|
   |Mark as required | Check this box.|
   |+ Add a choice | Add two choices. "Yes" and "No".|

   :::image type="content" source="./media/tutorial-import-create-glossary-terms/add-new-attribute.png" alt-text="add a new attribute.":::

1. Repeat the previous steps to add another attribute with the name `can be shared externally`. After both attributes are added, finally select **Create**.

## Import terms from a template

Next, you import a new term using the **Sensitivity level** template that you have created. 

1. From the **Glossary terms** screen, select **Import terms**.

1. Select **Sensitivity level** from the **Import terms** screen. Select **Continue**.

   :::image type="content" source="./media/tutorial-import-create-glossary-terms/select-sensitivity-level.png" alt-text="Select sensitivity level.":::

1. The term template for **Sensitivity level** contains default system attributes, as well as the new attributes you have added: `can be shared externally` and `is sensitive information`. Select **Download a sample .CSV** file.

   :::image type="content" source="./media/tutorial-import-create-glossary-terms/download-sample-csv-file.png" alt-text="Download sample csv file.":::

1. A template file is downloaded for you to edit and upload new glossary term with customer attributes. Open the CSV file you've downloaded. Add new terms and their appropriate values as new rows in the CSV file.

   :::image type="content" source="./media/tutorial-import-create-glossary-terms/create-term-in-csv.png" alt-text="Create term in csv file.":::

   Any terms listed in the **Related Terms** or **Synonyms** column that don't already exist will be created when the file is uploaded. They will be created using the **System default** template.

1. To upload the file, return to the **Import terms** screen, and select **Browse** next to the **Select the complete .CSV file to upload** box. Select your file in the dialog box that opens, and then select **OK**.

1. The new terms are now listed on the **Glossary terms** screen. You can view details about the new terms by clicking the term name in the list.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Create glossary terms.
> * Add glossary terms to an asset.
> * Import glossary terms.

Advance to the next article to learn about different catalog insights.

> [!div class="nextstepaction"]
> [Understand Insights in Azure Purview](concept-insights.md)
