---
title: How to automatically apply sensitivity labels to your data in Microsoft Purview Data Map
description: Learn how to create sensitivity labels and automatically apply them to your data during a scan.
author: ankitscribbles
ms.author: ankitgup
ms.service: purview
ms.subservice: purview-data-map
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 07/07/2022
---
# How to automatically apply sensitivity labels to your data in the Microsoft Purview Data Map

## Create new or apply existing sensitivity labels in the data map

> [!IMPORTANT]
> Labeling in the Microsoft Purview Data Map is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

If you don't already have sensitivity labels, you'll need to create them and make them available for the Microsoft Purview Data Map. Existing sensitivity labels from Microsoft Purview Information Protection can also be modified to make them available to the data map.

### Step 1: Licensing requirements

Sensitivity labels are created and managed in the Microsoft Purview compliance portal. To create sensitivity labels for use through Microsoft Purview, you must have an active Microsoft 365 license that offers the benefit of automatically applying sensitivity labels.

For the full list of licenses, see the [Sensitivity labels in Microsoft Purview FAQ](sensitivity-labels-frequently-asked-questions.yml). If you don't already have the required license, you can sign up for a trial of [Microsoft 365 E5](https://www.microsoft.com/microsoft-365/business/compliance-solutions#midpagectaregion).

### Step 2: Consent to use sensitivity labels in the Microsoft Purview Data Map

The following steps extend your existing sensitivity labels and enable them to be available for use in the data map, where you can apply sensitivity labels to files and database columns.

1. In the Microsoft Purview compliance portal, navigate to the **Information Protection** page.</br>
   If you've recently provisioned your subscription for Information Protection, it may take a few hours for the **Information Protection** page to display.
1. In the **Extend labeling to assets in the Microsoft Purview Data Map** area, select the **Turn on** button, and then select **Yes** in the confirmation dialog that appears.

For example:

:::image type="content" source="media/how-to-automatically-label-your-content/extend-sensitivity-labels-to-purview-small.png" alt-text="Select the 'Turn on' button to extend sensitivity labels to Microsoft Purview" lightbox="media/how-to-automatically-label-your-content/extend-sensitivity-labels-to-purview.png":::

:::image type="content" source="media/how-to-automatically-label-your-content/extend-sensitivity-labels-to-purview-confirmation-small.png" alt-text="Confirm the choice to extend sensitivity labels to Microsoft Purview" lightbox="media/how-to-automatically-label-your-content/extend-sensitivity-labels-to-purview-confirmation.png":::

> [!TIP]
>If you don't see the button, and you're not sure if consent has been granted to extend labeling to assets in the Microsoft Purview Data Map, see [this FAQ](sensitivity-labels-frequently-asked-questions.yml#how-can-i-determine-if-consent-has-been-granted-to-extend-labeling-to-the-microsoft-purview-data-map) item on how to determine the status.
>

After you've extended labeling to assets in the Microsoft Purview Data Map, all published sensitivity labels are available for use in the data map.

### Step 3: Create or modify existing label to automatically label content

**To create new sensitivity labels or modify existing labels**:

1. Open the [Microsoft Purview compliance portal](https://compliance.microsoft.com/).

1. Under **Solutions**, select **Information protection**, then select **Create a label**.

    :::image type="content" source="media/how-to-automatically-label-your-content/create-sensitivity-label-full-small.png" alt-text="Create sensitivity labels in the Microsoft Purview compliance center" lightbox="media/how-to-automatically-label-your-content/create-sensitivity-label-full.png":::

1. Name the label. Then, under **Define the scope for this label**:

    - In all cases, select **Schematized data assets**.
    - To label files, also select **Items**. This option isn't required to label schematized data assets only.

    :::image type="content" source="media/how-to-automatically-label-your-content/create-label-scope-small.png" alt-text="Automatically label in the Microsoft Purview compliance center" lightbox="media/how-to-automatically-label-your-content/create-label-scope.png":::

1. Follow the rest of the prompts to configure the label settings.

    Specifically, define autolabeling rules for files and schematized data assets:

    - [Define autolabeling rules for files](#autolabeling-for-files)
    - [Define autolabeling rules for schematized data assets](#autolabeling-for-schematized-data-assets)

    For more information about configuration options, see [What sensitivity labels can do](/microsoft-365/compliance/sensitivity-labels#what-sensitivity-labels-can-do) in the Microsoft 365 documentation.

1. Repeat the steps listed above to create more labels.

    To create a sublabel, select the parent label > **...** > **More actions** > **Add sub label**.

1. To modify existing labels, browse to **Information Protection** > **Labels**, and select your label.

    Then select **Edit label** to open the **Edit sensitivity label** configuration again, with all of the settings you'd defined when you created the label.

    :::image type="content" source="media/how-to-automatically-label-your-content/edit-sensitivity-label-full-small.png" alt-text="Edit an existing sensitivity label" lightbox="media/how-to-automatically-label-your-content/edit-sensitivity-label-full.png":::

1. When you're done creating all of your labels, make sure to view your label order, and reorder them as needed.

    To change the order of a label, select **...** **> More actions** > **Move up** or **Move down.**

    For more information, see the documentation for [label priority (order matters)](/microsoft-365/compliance/sensitivity-labels#label-priority-order-matters).

#### Autolabeling for files

Define autolabeling rules for files when you create or edit your label.

On the **Auto-labeling for Office apps** page, enable **Auto-labeling for Office apps,** and then define the conditions where you want your label to be automatically applied to your data.

For example:

:::image type="content" source="media/how-to-automatically-label-your-content/create-auto-labeling-rules-files-small.png" alt-text="Define auto-labeling rules for files in the Microsoft Purview compliance center" lightbox="media/how-to-automatically-label-your-content/create-auto-labeling-rules-files.png":::

For more information, see the documentation to [apply a sensitivity label to data automatically](/microsoft-365/compliance/apply-sensitivity-label-automatically#how-to-configure-auto-labeling-for-office-apps).

#### Autolabeling for schematized data assets

Define autolabeling rules for schematized data assets when you create or edit your label.

At the **Schematized data assets** option:

1. Select the **Auto-labeling for schematized data assets** slider.

1. Select **Check sensitive info types** to choose the sensitive info types you want to apply to your label.

For example:

:::image type="content" source="media/how-to-automatically-label-your-content/create-auto-labeling-rules-db-columns-small.png" alt-text="Define auto-labeling rules for schematized data assets in the Microsoft Purview compliance center" lightbox="media/how-to-automatically-label-your-content/create-auto-labeling-rules-db-columns.png":::

### Step 4: Publish labels

If the Sensitivity label has been published previously, then no further action is needed. 

If this is a new sensitivity label that has not been published before, then the label must be published for the changes to take effect. Follow [these steps to publish the label](/microsoft-365/compliance/create-sensitivity-labels#publish-sensitivity-labels-by-creating-a-label-policy).

Once you create a label, you'll need to Scan your data in the Microsoft Purview Data Map to automatically apply the labels you've created, based on the autolabeling rules you've defined.

## Scan your data to apply sensitivity labels automatically

Scan your data in the data map to automatically apply the labels you've created, based on the autolabeling rules you've defined. Allow up to 24 hours for sensitivity label changes to reflect in the data map.

For more information on how to set up scans on various assets in the Microsoft Purview Data Map, see:

|Source  |Reference  |
|---------|---------|
|**Files within Storage** | [Register and Scan Azure Blob Storage](register-scan-azure-blob-storage-source.md) </br> [Register and scan Azure Files](register-scan-azure-files-storage-source.md) [Register and scan Azure Data Lake Storage Gen1](register-scan-adls-gen1.md) </br>[Register and scan Azure Data Lake Storage Gen2](register-scan-adls-gen2.md)</br>[Register and scan Amazon S3](register-scan-amazon-s3.md) |
|**database columns** | [Register and scan an Azure SQL Database](register-scan-azure-sql-database.md) </br>[Register and scan an Azure SQL Managed Instance](register-scan-azure-sql-managed-instance.md) </br> [Register and scan Dedicated SQL pools](register-scan-azure-synapse-analytics.md)</br> [Register and scan Azure Synapse Analytics workspaces](register-scan-azure-synapse-analytics.md) </br> [Register and scan Azure Cosmos DB for NoSQL database](register-scan-azure-cosmos-database.md) </br> [Register and scan an Azure MySQL database](register-scan-azure-mysql-database.md) </br> [Register and scan an Azure database for PostgreSQL](register-scan-azure-postgresql.md) |
| | |

## View labels on assets in the catalog

Once you've defined autolabeling rules for your labels in the Microsoft Purview compliance portal and scanned your data in the data map, labels are automatically applied to your assets in the data map.

**To view the labels applied to your assets in the Microsoft Purview catalog:**

In the Microsoft Purview catalog, use the **Label** filtering options to show assets with specific labels only. For example:

:::image type="content" source="media/how-to-automatically-label-your-content/filter-search-results-small.png" alt-text="Search for assets by label" lightbox="media/how-to-automatically-label-your-content/filter-search-results.png":::

To view details of an asset including classifications found and label applied, select the asset in the results.

For example:

:::image type="content" source="media/how-to-automatically-label-your-content/view-labeled-files-blob-storage-small.png" alt-text="View a sensitivity label on a file in your Azure Blob Storage" lightbox="media/how-to-automatically-label-your-content/view-labeled-files-blob-storage.png":::

## View Insight reports for the classifications and sensitivity labels

Find insights on your classified and labeled data in the Microsoft Purview Data Map use the **Classification** and **Sensitivity labeling** reports.

> [!div class="nextstepaction"]
> [Classification insights](./classification-insights.md)

> [!div class="nextstepaction"]
> [Sensitivity label insights](sensitivity-insights.md)

> [!div class="nextstepaction"]
> [Overview of Labeling in Microsoft Purview](create-sensitivity-label.md)

> [!div class="nextstepaction"]
> [Labeling Frequently Asked Questions](sensitivity-labels-frequently-asked-questions.yml)
