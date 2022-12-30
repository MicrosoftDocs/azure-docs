---
title: Manually apply classifications on assets
description: This document describes how to manually apply classifications on assets.
author: ankitscribbles
ms.author: ankitgup
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 12/29/2022
---
# Manually apply classifications on assets in Microsoft Purview

This article discusses how to manually apply classifications on assets. Microsoft Purview [automatically applies classifications to some assets during the scanning process](apply-classifications.md), but there are some scenarios when you may want to manually apply more classifications. For example, Microsoft Purview doesn't automatically apply classifications to table assets (only their columns), or you might want to apply custom classifications, or add classifications to assets grouped a [resource set](concept-resource-sets.md).

We've provided steps to manually apply classifications to file, table, and column assets.

## Manually apply classification to a file asset

1. [Search](how-to-search-catalog.md) or [browse](how-to-browse-catalog.md) the Microsoft Purview Data Catalog for the file you're interested in and navigate to the asset detail page.

    :::image type="content" source="./media/apply-classifications/asset-detail-page.png" alt-text="Screenshot showing the asset detail page.":::

1. On the **Overview** tab, view the **Classifications** section to see if there are any existing classifications. Select **Edit**.

1. From the **Classifications** drop-down list, select the specific classifications you're interested in. In our example, we're adding **Credit Card Number**, which is a system classification and **CustomerAccountID**, which is a custom classification.

    :::image type="content" source="./media/apply-classifications/select-classifications.png" alt-text="Screenshot showing how to select classifications to add to an asset.":::

1. Select **Save**.

1. On the **Overview** tab, confirm that the classifications you selected appear under the **Classifications** section.

    :::image type="content" source="./media/apply-classifications/confirm-classifications.png" alt-text="Screenshot showing how to confirm classifications were added to an asset.":::

## Manually apply classification to a table asset

When Microsoft Purview scans your data sources, it doesn't automatically assign classifications to table assets (only on columns). For a table asset to have classifications, you must add them manually:

To add a classification to a table asset:

1. [Search](how-to-search-catalog.md) or [browse](how-to-browse-catalog.md) the data catalog for the table asset that you're interested in. For example, **Customer** table.

1. Confirm that no classifications are assigned to the table. Select **Edit**.

    :::image type="content" source="./media/apply-classifications/select-edit-from-table-asset.png" alt-text="Screenshot showing how to view and edit the classifications of a table asset.":::

1. From the **Classifications** drop-down list, select one or more classifications. This example uses a custom classification named **CustomerInfo**, but you can select any classifications for this step.

    :::image type="content" source="./media/apply-classifications/select-classifications-in-table.png" alt-text="Screenshot showing how to select classifications to add to a table asset.":::

1. Select **Save** to save the classifications.

1. On the **Overview** page, verify that Microsoft Purview added your new classifications.

    :::image type="content" source="./media/apply-classifications/verify-classifications-added-to-table.png" alt-text="Screenshot showing how to verify that classifications were added to a table asset.":::

## Manually add classification to a column asset

Microsoft Purview automatically scans and adds classifications to all column assets. However, if you want to change the classification, you can do so at the column level:

1. [Search](how-to-search-catalog.md) or [browse](how-to-browse-catalog.md) the data catalog for the table asset that contains the column you want to update.

1. Select **Edit** from the **Overview** tab.

1. Select the **Schema** tab.

    :::image type="content" source="./media/apply-classifications/edit-column-schema.png" alt-text="Screenshot showing how to edit the schema of a column.":::

1. Identify the columns you're interested in and select **Add a classification**. This example adds a **Common Passwords** classification to the **PasswordHash** column.

    :::image type="content" source="./media/apply-classifications/add-classification-to-column.png" alt-text="Screenshot showing how to add a classification to a column.":::

1. Select **Save**.

1. Select the **Schema** tab and confirm that the classification has been added to the column.

    :::image type="content" source="./media/apply-classifications/confirm-classification-added.png" alt-text="Screenshot showing how to confirm that a classification was added to a column schema.":::

## View classification details

Microsoft Purview captures important details like who applied a classification and when it was applied. To view the details, hover over the classification to revel the Classification details card. The classification details card shows the following information:

- Classification name - Name of the classification applied on the asset or column.
- Applied by - Who applied the classification. Possible values are scan and user name.
- Applied time - Local timestamp when the classification was applied via scan or manually.
- Classification type - System or custom.

Users with *Data Curator* role will see more details for classifications that were applied automatically via scan. These details will include sample count that the scanner read to classify the data and distinct data count in the sample that the scanner found.

:::image type="content" source="./media/apply-classifications/view-classification-detail.png" alt-text="Screenshot showing how to view classification detail.":::

## Impact of rescanning on existing classifications

Classifications are applied the first time, based on sample set check on your data and matching it against the set regex pattern. At the time of rescan, if new classifications apply, the column gets more classifications on it. Existing classifications stay on the column, and must be removed manually.

## Next steps

- To learn how to create a custom classification, see [create a custom classification](create-a-custom-classification-and-classification-rule.md).
- To learn about how to automatically apply classifications, see [automatically apply classifications](automatically-apply-classifications.md).