---
title: Apply classifications on assets
description: This article explains how to apply a system or custom classification in any asset.
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/08/2020
---

# Use classifications

In Azure Babylon, you can apply system or custom classifications on a file, table, or column asset. This article describes the steps to manually apply classifications on your assets.

## Add a classification to a file asset

Azure Babylon can scan and automatically classify documentation files. For example, if you have a file named *multiple.docx* and it has a National ID number in its content, Azure Babylon adds the classification **EU National Identification Number** to the file asset's detail page.

In some scenarios, you might want to manually add classifications to your file asset. If you have multiple files that are grouped into a resource set, add classifications at the resource set level.

Follow these steps to add a custom or system classification to a partition resource set:

1. Search or browse the partition and navigate to the asset detail page.

    :::image type="content" source="./media/use-classifications/asset-detail-page.png" alt-text="Asset detail page.":::

1. On the **Overview** tab, view the **Classifications** section to see if there are any existing classifications. Select **Edit**.

1. From the **Classifications** drop-down list, select the specific classifications you're interested in. For example, **Credit Card Number**, which is a system classification and **CustomerAccountID**, which is a custom classification.

    :::image type="content" source="./media/use-classifications/select-classifications.png" alt-text="Select classifications to add to asset.":::

1. Select **Save**

1. On the **Overview** tab, confirm that the classifications you selected appear under the **Classifications** section.

    :::image type="content" source="./media/use-classifications/confirm-classifications.png" alt-text="Confirm classifications were added to asset.":::

## Add a classification to a table asset

When Azure Babylon scans your data sources, it doesn't automatically assign classifications to table assets. If you want your table asset to have a classification, you must add it manually.

To add a classification to a table asset:

1. Find a table asset that you're interested in. For example, **Customer** table.

1. Confirm that no classifications are assigned to the table. Select **Edit**

    :::image type="content" source="./media/use-classifications/select-edit-from-table-asset.png" alt-text="View and edit classifications of table asset.":::

1. From the **Classifications** drop-down list, select one or more classifications. This example uses a custom classification named **CustomerInfo**, but you can select any classifications for this step.

    :::image type="content" source="./media/use-classifications/select-classifications-in-table.png" alt-text="Add classifications to table asset.":::

1. Select **Save** to save the classifications.

1. On the **Overview** page, verify that Azure Babylon added your new classifications.

    :::image type="content" source="./media/use-classifications/verify-classifications-added-to-table.png" alt-text="Verify classifications added to table asset.":::

## Add a classification to a column asset

Azure Babylon automatically scans and adds classifications to all column assets. However, if you want to change the classification, you can do so at the column level.

To add a classification to a column:

1. Find and select the column asset, and then select **Edit** from the **Overview** tab.

1. Select the **Schema** tab

    :::image type="content" source="./media/use-classifications/edit-column-schema.png" alt-text="Edit column schema.":::

1. Identify the columns you're interested in and select **Add a classification**. This example adds a **Common Passwords** classification to the **PasswordHash** column.

    :::image type="content" source="./media/use-classifications/add-classification-to-column.png" alt-text="Add classification to column.":::

1. Select **Save**

1. Select the **Schema** tab and confirm that the classification has been added to the column.

    :::image type="content" source="./media/use-classifications/confirm-classification-added.png" alt-text="Confirm classification added to column schema.":::

