---
title: Apply classifications on assets
description: This document describes how to apply classifications on assets.
author: SunetraVirdi
ms.author: suvirdi
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 09/27/2021
---
# Apply classifications on assets in Microsoft Purview

This article discusses how to apply classifications on assets.

## Introduction

Classifications can be system or custom types. System classifications are present in Microsoft Purview by default. Custom classifications can be created based on a regular expression pattern and keyword lists. Classifications can be applied to assets either automatically via scanning or manually.

This document explains how to apply classifications to your data.

## Prerequisites

- Create custom classifications based on your need.
- Set up scan on your data sources.

## Apply classifications
In Microsoft Purview, you can apply system or custom classifications on a file, table, or column asset. This article describes the steps to manually apply classifications on your assets.

### Apply classification to a file asset
Microsoft Purview can scan and automatically classify documents. For example, if you have a file named *multiple.docx* and it has a National ID number in its content, Microsoft Purview adds the classification **EU National Identification Number** to the file asset's detail page.

In some scenarios, you might want to manually add classifications to your file asset or if you have multiple files that are grouped into a resource set, add classifications at the resource set level.

Follow these steps to add a custom or system classification to a partition resource set:

1. Search or browse the partition and navigate to the asset detail page.

    :::image type="content" source="./media/apply-classifications/asset-detail-page.png" alt-text="Screenshot showing the asset detail page.":::

1. On the **Overview** tab, view the **Classifications** section to see if there are any existing classifications. Select **Edit**.

1. From the **Classifications** drop-down list, select the specific classifications you're interested in. For example, **Credit Card Number**, which is a system classification and **CustomerAccountID**, which is a custom classification.

    :::image type="content" source="./media/apply-classifications/select-classifications.png" alt-text="Screenshot showing how to select classifications to add to an asset.":::

1. Select **Save**

1. On the **Overview** tab, confirm that the classifications you selected appear under the **Classifications** section.

    :::image type="content" source="./media/apply-classifications/confirm-classifications.png" alt-text="Screenshot showing how to confirm classifications were added to an asset.":::

### Apply classification to a table asset

When Microsoft Purview scans your data sources, it doesn't automatically assign classifications to table assets. If you want your table asset to have a classification, you must add it manually.

To add a classification to a table asset:

1. Find a table asset that you're interested in. For example, **Customer** table.

1. Confirm that no classifications are assigned to the table. Select **Edit**

    :::image type="content" source="./media/apply-classifications/select-edit-from-table-asset.png" alt-text="Screenshot showing how to view and edit the classifications of a table asset.":::

1. From the **Classifications** drop-down list, select one or more classifications. This example uses a custom classification named **CustomerInfo**, but you can select any classifications for this step.

    :::image type="content" source="./media/apply-classifications/select-classifications-in-table.png" alt-text="Screenshot showing how to select classifications to add to a table asset.":::

1. Select **Save** to save the classifications.

1. On the **Overview** page, verify that Microsoft Purview added your new classifications.

    :::image type="content" source="./media/apply-classifications/verify-classifications-added-to-table.png" alt-text="Screenshot showing how to verify that classifications were added to a table asset.":::

### Add classification to a column asset

Microsoft Purview automatically scans and adds classifications to all column assets. However, if you want to change the classification, you can do so at the column level.

To add a classification to a column:

1. Find and select the column asset, and then select **Edit** from the **Overview** tab.

1. Select the **Schema** tab

    :::image type="content" source="./media/apply-classifications/edit-column-schema.png" alt-text="Screenshot showing how to edit the schema of a column.":::

1. Identify the columns you're interested in and select **Add a classification**. This example adds a **Common Passwords** classification to the **PasswordHash** column.

    :::image type="content" source="./media/apply-classifications/add-classification-to-column.png" alt-text="Screenshot showing how to add a classification to a column.":::

1. Select **Save**

1. Select the **Schema** tab and confirm that the classification has been added to the column.

    :::image type="content" source="./media/apply-classifications/confirm-classification-added.png" alt-text="Screenshot showing how to confirm that a classification was added to a column schema.":::

## View classification details
Microsoft Purview captures important details like who applied a classification and when it was applied. To view the details, hover over the classification to revel the Classification details card. The classification details card shows the following information:
- Classification name - Name of the classification applied on the asset or column.
- Applied by - Who applied the classification. Possible values are scan and user name.
- Applied time - Local timestamp when the classification was applied via scan or manually.
- Classification type - System or custom.

Users with *Data Curator* role will see additional details for classifications that were applied automatically via scan. These details will include sample count that the scanner read to classify the data and distinct data count in the sample that the scanner found.

:::image type="content" source="./media/apply-classifications/view-classification-detail.png" alt-text="Screenshot showing how to view classification detail.":::

## Impact of rescanning on existing classifications

Classifications are applied the first time, based on sample set check on your data and matching it against the set regex pattern. At the time of rescan, if new classifications apply, the column gets additional classifications on it. Existing classifications stay on the column, and must be removed manually.

## Next steps
To learn how to create a custom classification, see [Create a custom classification](create-a-custom-classification-and-classification-rule.md).