---
title: 'Tutorial: Create and import glossary terms'
description: This tutorial describes how to create glossary terms, add glossary terms to an asset, and import glossary terms. 
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 10/01/2020
---

# Tutorial: Create and import glossary terms

A glossary is an important tool for maintaining and organizing your catalog. You build your glossary by defining new terms or importing a term list and then applying those terms to your assets.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create glossary terms.
> * Add glossary terms to an asset.
> * Import glossary terms.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

* Complete [Tutorial: Run the starter kit and scan data](starter-kit-tutorial-1.md).
* Complete [Tutorial: Navigate the home page and search for an asset](starter-kit-tutorial-2.md ).
* Complete [Tutorial: Browse assets and view their lineage](starter-kit-tutorial-3.md ).
* Complete [Tutorial: Resource sets, asset details, schemas, and classifications](starter-kit-tutorial-4.md ).

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

1. Go to your Azure Purview portal at `https://web.babylon.azure.com/resource/<your Azure Purview account name>`.

1. Select **Glossary** from the left pane to open the **Glossary terms** page.

   :::image type="content" source="./media/starter-kit-tutorial-5/glossary-terms-page.png" alt-text="Screenshot showing the Glossary terms page.":::

1. Select **New term** > **System default** > **Continue**.

1. On the **Overview** tab of the **New term** page, enter the **Name** for the new term: *Financial*.

1. Enter the **Definition**: *This term represents financial information for Contoso Inc.*

1. In the **Status** drop-down list, select **Approved**.

1. When you're finished, select **Create**.

    :::image type="content" source="./media/starter-kit-tutorial-5/enter-new-glossary-term.png" alt-text="Screenshot showing how to create a new glossary term.":::

## Add glossary terms to an asset

To add a glossary term to an asset, follow this procedure:

1. Use the steps you learned in [Tutorial: Run the starter kit and scan data](starter-kit-tutorial-1.md) to find an asset (for example, **Contoso_CashFlow_(N).tsv**).

1. On the asset details page, select **Edit**.

1. In the **Glossary terms** drop-down list in the **Overview** tab, select **Financial**, and then select **Save**.

   :::image type="content" source="./media/starter-kit-tutorial-5/add-glossary-term-to-asset.png" alt-text="Screenshot showing how to add a glossary term to an asset.":::

1. Go to the **Glossary terms** section on the **Overview** tab and note that the term *Finance* was applied to the asset.

## Import glossary terms

To import terms or update existing terms in bulk, upload a pre-populated template to your glossary.

In this procedure, you import glossary terms via a .csv file:

1. Note where you stored the file named *StarterKitTerms.csv*, which is part of the starter kit that you downloaded in [Tutorial: Run the starter kit and scan data](starter-kit-tutorial-1.md).

   This file contains a list of pre-populated terms that are relevant to your data estate.

1. To begin importing, select **Glossary**, and then select **Import terms**.

    :::image type="content" source="./media/starter-kit-tutorial-5/import-glossary-terms-select.png" alt-text="Screenshot showing how to import glossary terms.":::

1. On the **Import terms** page, select **System default**, and then select **Continue**.

1. Select **Browse**, go to the location where you downloaded *StarterKitTerms.csv*, and then select **Open**.

1. Select **OK** to begin importing the terms.

   After the import is finished, the new glossary terms are displayed on the **Glossary terms** page.

   :::image type="content" source="./media/starter-kit-tutorial-5/imported-glossary-terms.png" alt-text="Screenshot showing newly imported glossary terms.":::

1. View each of the newly imported terms to see how they're defined.

1. In the search box at the top of the page, search for **Contoso_dev**.

1. Use the procedure that you followed in [Add glossary terms to an asset](#add-glossary-terms-to-an-asset) to apply the glossary term *Devtest* to one or more of the assets you found.

## Create custom term templates and import glossary terms

In this step, you will learn how to create a custom term template with custom attributes and import data using a template csv file.

There are several existing System term templates, which you can view by selecting **Glossary** > **Manage term templates** > **System**.

:::image type="content" source="./media/starter-kit-tutorial-5/system-term-templates.png" alt-text="system term templates.":::

To create a new custom term template, do the following steps:

1. Select **Glossary** from the left side menu.
1. Select **Manage term templates** > **Custom** > **New term template**

:::image type="content" source="./media/starter-kit-tutorial-5/create-new-custom-term-template.png" alt-text="screate a new custom term template.":::

On the **New term template** screen, do the following steps:

1. Enter **Template name**: `Sensitivity level`.
1. Enter your desired description, such as `Indicates the level of sensitivity for this data.`.
1. Select **+ New attribute** to open a dialog for adding attributes.

:::image type="content" source="./media/starter-kit-tutorial-5/new-term-template-screen-start.png" alt-text="new term template screen start.":::

On the **New attribute** screen, do the following steps:

1. Enter **Attribute name**: `is sensitive information`.
1. Check **Mark as required**.
1. In the **Field type** dropdown, select **Single choice**.
1. Select **+Add a choice** and enter **Yes** in the textbox.
1. Select **+Add a choice** again and enter **No** in the textbox.
1. Select **Apply**.

:::image type="content" source="./media/starter-kit-tutorial-5/add-new-attribute.png" alt-text="add a new attribute.":::

Repeat the same steps to add another attribute with the name `can be shared externally`. After both attributes are added, finally select **Create**.

:::image type="content" source="./media/starter-kit-tutorial-5/new-term-template-screen-finish.png" alt-text="finish creating new term template.":::

Next, you will import a new term using the **Sensitivity level** template that you have created. From the **Glossary terms** screen, select **Import terms**.

:::image type="content" source="./media/starter-kit-tutorial-5/select-import-terms.png" alt-text="Select import terms.":::

Select **Sensitivity level** from the **Import terms** screen. Select **Continue**.

:::image type="content" source="./media/starter-kit-tutorial-5/select-sensitivity-level.png" alt-text="Select sensitivity level.":::

The term template for **Sensitivity level** contains default system attributes, as well as the new attributes you have added: `Sensitivity level` and `is sensitive information`. Select **Download a sample .CSV** file.

:::image type="content" source="./media/starter-kit-tutorial-5/download-sample-csv-file.png" alt-text="Download sample csv file.":::

This step will download a template file that you can edit to upload your new glossary term with customer attributes. Open the CSV file that you have downloaded. Add new terms and their appropriate values as new rows in the CSV file.

:::image type="content" source="./media/starter-kit-tutorial-5/create-term-in-csv.png" alt-text="Create term in csv file.":::

Any terms listed in the **Related Terms** or **Synonyms** column that don't already exist will be created when the file is uploaded. They will be created using the **System default** template.

To upload the file, return to the **Import terms** screen, and select **Browse** next to the **Select the complete .CSV file to upload** box. Select your file in the dialog box that opens, and then select **OK**.

:::image type="content" source="./media/starter-kit-tutorial-5/upload-term-csv-file.png" alt-text="Upload term csv file.":::

The new terms are now listed on the **Glossary terms** screen.

:::image type="content" source="./media/starter-kit-tutorial-5/new-glossary-terms-created.png" alt-text="New glossary terms created.":::

You can view details about the new terms by clicking the term name in the list.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Create glossary terms.
> * Add glossary terms to an asset.
> * Import glossary terms.

Advance to the next tutorial to learn how to navigate the home page and search for an asset.

> [!div class="nextstepaction"]
> [Use Catalog insights](starter-kit-tutorial-6.md)
