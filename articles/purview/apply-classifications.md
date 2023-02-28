---
title: Automatically apply classifications on assets
description: This document describes how to automatically apply classifications on assets.
author: ankitscribbles
ms.author: ankitgup
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 12/30/2022
---
# Automatically apply classifications on assets in Microsoft Purview

After data sources are [registered](manage-data-sources.md#register-a-new-source) in the Microsoft Purview Data Map, the next step is to [scan](concept-scans-and-ingestion.md) the data sources. The scanning process establishes a connection to the data source, captures technical metadata, and can automatically classify data using either the [supported system classifications](supported-classifications.md) or [rules for your custom classifications](create-a-custom-classification-and-classification-rule.md#custom-classification-rules). For example, if you have a file named *multiple.docx* and it has a National ID number in its content, during the scanning process Microsoft Purview adds the classification **EU National Identification Number** to the file asset's detail page.

These [classifications](concept-classification.md) help you and your team identify the kinds of data you have across your data estate. For example: if files or tables contain credit card numbers, or addresses. Then you can more easily search for certain kinds of information, like customer IDs, or prioritize security for sensitive data types.

Classifications can be automatically applied on file and column assets during scanning.

In this article we'll discuss:

- [How Microsoft Purview classifies data](#how-microsoft-purview-classifies-assets)
- [The steps to automatically apply classifications](#automatically-apply-classifications)

## How Microsoft Purview classifies assets

When a data source is scanned, Microsoft Purview compares data in the asset to a list of possible classifications called a [scan rule set](create-a-scan-rule-set.md).

There are [system scan rule sets](create-a-scan-rule-set.md#system-scan-rule-sets) already available for each data source that contains every currently available system classification for that data source. Or, you can [create a custom scan rule set](create-a-scan-rule-set.md) to make a list of classifications tailored to your data set.

Making a custom rule sets for your data can be a good idea if your data is limited to specific kinds of information, or regions, as comparing your data to fewer classification types will speed up the scanning process. For example, if your dataset only contains European data, you could create a custom scan rule set that excludes identification for other regions.

You might also make a custom rule set if you've created [custom classifications](create-a-custom-classification-and-classification-rule.md#steps-to-create-a-custom-classification) and [classification rules](create-a-custom-classification-and-classification-rule.md#custom-classification-rules), so that your custom classifications can be automatically applied during scanning.

For more information about the available system classifications and how your data is classified, see the [system classifications page.](supported-classifications.md)

## Automatically apply classifications

>[!NOTE]
>Table assets are not automatically assigned classifications, because the classifications are assigned to their columns, but you can [manually apply classifications to table assets](manually-apply-classifications.md#manually-apply-classification-to-a-table-asset).

After data sources are [registered](manage-data-sources.md#register-a-new-source), you can automatically classify data in that source's data assets by running a [scan](concept-scans-and-ingestion.md).

1. Check the **Scan** section of the [source article](microsoft-purview-connector-overview.md) for your data source to confirm any prerequisites or authentication are set up and ready for a scan.

1. Search the Microsoft Purview Data Map the registered source that has the data assets (files and columns), you want to classify.

1. Select the **New Scan** icon under the resource.

    :::image type="content" source="./media/apply-classifications/new-scan.png" alt-text="Screenshot of the Microsoft Purview Data Map, with the new scan button selected under a registered source.":::

    >[!TIP]
    >If you don't see the New Scan button, you may not have correct permissions. To run a scan, you'll need at least [data source administrator permissions](catalog-permissions.md) on the collection where the source is registered.

1. Select your credential and authenticate with your source. (For more information about authenticating with your source, see the **prerequisite** and **scan** sections of your specific source [source article](microsoft-purview-connector-overview.md).) Select **Continue**.

1. If necessary, select the assets in the source you want to scan. You can scan all assets, or a subset of folders, files, or tables depending on the source.

1. Select your scan rule set. You'll see a list of available scan rule sets and can select one, or you can choose to create a new scan rule set using the **New scan rule set** button at the top. The scan rule set will determine which classifications will be compared and applied to your data. For more information, see [how Microsoft Purview classifies assets](#how-microsoft-purview-classifies-assets).

    :::image type="content" source="./media/apply-classifications/select-scan-rule-set.png" alt-text="Screenshot of the scan rule set page of the scan menu, with the new scan rule set and existing scan rule set buttons highlighted.":::

    >[!TIP]
    >For more information about the options available when creating a scan rule set, start at step 4 of these [steps to create a scan rule set](create-a-scan-rule-set.md#steps-to-create-a-scan-rule-set).

1. Schedule your scan.

1. Save and run your scan. Applicable classifications in your scan rule set will be automatically applied to the assets you scan. You'll be able to view and manage them once the scan is complete.

[!INCLUDE [classification-details](includes/classification-details.md)]

## Next steps

- To learn how to create a custom classification, see [create a custom classification](create-a-custom-classification-and-classification-rule.md).
- To learn about how to manually apply classifications, see [manually apply classifications](manually-apply-classifications.md).
