---
title: Apply classifications
description: This article explains how to apply a system or custom classification in any asset.
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/08/2020
---

# Apply classifications

In Azure Purview, you can apply system or custom classifications on a file, table, or column asset. This article describes the steps to manually apply classifications on your assets.

## Add a classification to a file asset

Azure Purview can scan and automatically classify documentation files. For example, if you have a file named *multiple.docx* and it has a National ID number in its content, Azure Purview adds the classification **EU National Identification Number** to the file asset's detail page.

In some scenarios, you might want to manually add classifications to your file asset. If you have multiple files that are grouped into a resource set, add classifications at the resource set level.

Follow these steps to add a custom or system classification to a partition resource set:

1. Search or browse the partition and navigate to the asset detail page.

    :::image type="content" source="./media/use-classifications/asset-detail-page.png" alt-text="Screenshot showing the asset detail page.":::

1. On the **Overview** tab, view the **Classifications** section to see if there are any existing classifications. Select **Edit**.

1. From the **Classifications** drop-down list, select the specific classifications you're interested in. For example, **Credit Card Number**, which is a system classification and **CustomerAccountID**, which is a custom classification.

    :::image type="content" source="./media/use-classifications/select-classifications.png" alt-text="Screenshot showing how to select classifications to add to an asset.":::

1. Select **Save**

1. On the **Overview** tab, confirm that the classifications you selected appear under the **Classifications** section.

    :::image type="content" source="./media/use-classifications/confirm-classifications.png" alt-text="Screenshot showing how to confirm classifications were added to an asset.":::

## Add a classification to a table asset

When Azure Purview scans your data sources, it doesn't automatically assign classifications to table assets. If you want your table asset to have a classification, you must add it manually.

To add a classification to a table asset:

1. Find a table asset that you're interested in. For example, **Customer** table.

1. Confirm that no classifications are assigned to the table. Select **Edit**

    :::image type="content" source="./media/use-classifications/select-edit-from-table-asset.png" alt-text="Screenshot showing how to view and edit the classifications of a table asset.":::

1. From the **Classifications** drop-down list, select one or more classifications. This example uses a custom classification named **CustomerInfo**, but you can select any classifications for this step.

    :::image type="content" source="./media/use-classifications/select-classifications-in-table.png" alt-text="Screenshot showing how to select classifications to add to a table asset.":::

1. Select **Save** to save the classifications.

1. On the **Overview** page, verify that Azure Purview added your new classifications.

    :::image type="content" source="./media/use-classifications/verify-classifications-added-to-table.png" alt-text="Screenshot showing how to verify that classifications were added to a table asset.":::

## Add a classification to a column asset

Azure Purview automatically scans and adds classifications to all column assets. However, if you want to change the classification, you can do so at the column level.

To add a classification to a column:

1. Find and select the column asset, and then select **Edit** from the **Overview** tab.

1. Select the **Schema** tab

    :::image type="content" source="./media/use-classifications/edit-column-schema.png" alt-text="Screenshot showing how to edit the schema of a column.":::

1. Identify the columns you're interested in and select **Add a classification**. This example adds a **Common Passwords** classification to the **PasswordHash** column.

    :::image type="content" source="./media/use-classifications/add-classification-to-column.png" alt-text="Screenshot showing how to add a classification to a column.":::

1. Select **Save**

1. Select the **Schema** tab and confirm that the classification has been added to the column.

    :::image type="content" source="./media/use-classifications/confirm-classification-added.png" alt-text="Screenshot showing how to confirm that a classification was added to a column schema.":::

## Next steps

To learn how to create a custom classification, see [Create a custom classification](create-a-custom-classification.md).
