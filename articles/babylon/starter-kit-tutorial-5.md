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

1. Go to your Azure Babylon portal at `https://web.babylon.azure.com/resource/<your Azure Babylon account name>`.

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

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Create glossary terms.
> * Add glossary terms to an asset.
> * Import glossary terms.
