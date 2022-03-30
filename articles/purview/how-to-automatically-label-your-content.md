---
title: How to automatically apply sensitivity labels to your data in Azure Purview
description: Learn how to create sensitivity labels and automatically apply them to your data during a scan.
author: ajaykar
ms.author: ajaykar
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 09/27/2021
---
# How to automatically apply sensitivity labels to your data in Azure Purview

## Create or extend existing sensitivity labels to Azure Purview

> [!IMPORTANT]
> Azure Purview Sensitivity Labels are currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

If you don't already have sensitivity labels, you'll need to create them and make them available for Azure Purview. Existing sensitivity labels can also be modified to make them available for Azure Purview.

### Step 1: Licensing requirements

Sensitivity labels are created and managed in the Microsoft 365 compliance center. To create sensitivity labels for use in Azure Purview, you must have an active Microsoft 365 license which offers the benefit of automatically applying sensitivity labels.

For the full list of licenses, see the [Sensitivity labels in Azure Purview FAQ](sensitivity-labels-frequently-asked-questions.yml). If you do not already have the required license, you can sign up for a trial of [Microsoft 365 E5](https://www.microsoft.com/microsoft-365/business/compliance-solutions#midpagectaregion).

### Step 2: Consent to use sensitivity labels in Azure Purview

The following steps extend your sensitivity labels and enable them to be available for use in Azure Purview, where you can apply sensitivity labels to files and database columns.

1. In Microsoft 365, navigate to the **Information Protection** page.</br>
   If you've recently provisioned your subscription for Information Protection, it may take a few hours for the **Information Protection** page to display.
1. In the **Extend labeling to assets in Azure Purview** area, select the **Turn on** button, and then select **Yes** in the confirmation dialog that appears.

For example:

:::image type="content" source="media/how-to-automatically-label-your-content/extend-sensitivity-labels-to-purview-small.png" alt-text="Select the 'Turn on' button to extend sensitivity labels to Azure Purview" lightbox="media/how-to-automatically-label-your-content/extend-sensitivity-labels-to-purview.png":::

:::image type="content" source="media/how-to-automatically-label-your-content/extend-sensitivity-labels-to-purview-confirmation-small.png" alt-text="Confirm the choice to extend sensitivity labels to Azure Purview" lightbox="media/how-to-automatically-label-your-content/extend-sensitivity-labels-to-purview-confirmation.png":::

> [!TIP]
>If you don't see the button, and you're not sure if consent has been granted to extend labeling to assets in Azure Purview, see [this FAQ](sensitivity-labels-frequently-asked-questions.yml#how-can-i-determine-if-consent-has-been-granted-to-extend-labeling-to-azure-purview) item on how to determine the status.
>

After you've extended labeling to assets in Azure Purview, all published sensitivity labels are available for use in Azure Purview.

### Step 3: Create or modify existing label to automatically label content

**To create new sensitivity labels or modify existing labels**:

1. Open the [Microsoft 365 compliance center](https://compliance.microsoft.com/).

1. Under **Solutions**, select **Information protection**, then select **Create a label**.

    :::image type="content" source="media/how-to-automatically-label-your-content/create-sensitivity-label-full-small.png" alt-text="Create sensitivity labels in the Microsoft 365 compliance center" lightbox="media/how-to-automatically-label-your-content/create-sensitivity-label-full.png":::

1. Name the label. Then, under **Define the scope for this label**:

    - In all cases, select **Schematized data assets**.
    - To label files, also select **Files & emails**. This option is not required to label schematized data assets only

    :::image type="content" source="media/how-to-automatically-label-your-content/create-label-scope-small.png" alt-text="Automatically label in the Microsoft 365 compliance center" lightbox="media/how-to-automatically-label-your-content/create-label-scope.png":::

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

    For more information, see [Label priority (order matters)](/microsoft-365/compliance/sensitivity-labels#label-priority-order-matters) in the Microsoft 365 documentation.

#### Autolabeling for files

Define autolabeling rules for files when you create or edit your label.

On the **Auto-labeling for Office apps** page, enable **Auto-labeling for Office apps,** and then define the conditions where you want your label to be automatically applied to your data.

For example:

:::image type="content" source="media/how-to-automatically-label-your-content/create-auto-labeling-rules-files-small.png" alt-text="Define auto-labeling rules for files in the Microsoft 365 compliance center" lightbox="media/how-to-automatically-label-your-content/create-auto-labeling-rules-files.png":::

For more information, see [Apply a sensitivity label to data automatically](/microsoft-365/compliance/apply-sensitivity-label-automatically#how-to-configure-auto-labeling-for-office-apps) in the Microsoft 365 documentation.

#### Autolabeling for schematized data assets

Define autolabeling rules for schematized data assets when you create or edit your label.

At the **Schematized data assets** option:

1. Select the **Auto-labeling for schematized data assets** slider.

1. Select **Check sensitive info types** to choose the sensitive info types you want to apply to your label.

For example:

:::image type="content" source="media/how-to-automatically-label-your-content/create-auto-labeling-rules-db-columns-small.png" alt-text="Define auto-labeling rules for schematized data assets in the Microsoft 365 compliance center" lightbox="media/how-to-automatically-label-your-content/create-auto-labeling-rules-db-columns.png":::

### Step 4: Publish labels

Once you create a label, you will need to Scan your data in Azure Purview to automatically apply the labels you've created, based on the autolabeling rules you've defined.

## Scan your data to apply sensitivity labels automatically

Scan your data in Azure Purview to automatically apply the labels you've created, based on the autolabeling rules you've defined. Allow up to 24 hours for sensitivity label changes to reflect in Azure Purview.

For more information on how to set up scans on various assets in Azure Purview, see:

|Source  |Reference  |
|---------|---------|
|**Files within Storage** | [Register and Scan Azure Blob Storage](register-scan-azure-blob-storage-source.md) </br> [Register and scan Azure Files](register-scan-azure-files-storage-source.md) [Register and scan Azure Data Lake Storage Gen1](register-scan-adls-gen1.md) </br>[Register and scan Azure Data Lake Storage Gen2](register-scan-adls-gen2.md)</br>[Register and scan Amazon S3](register-scan-amazon-s3.md) |
|**database columns** | [Register and scan an Azure SQL Database](register-scan-azure-sql-database.md) </br>[Register and scan an Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md) </br> [Register and scan Dedicated SQL pools](register-scan-azure-synapse-analytics.md)</br> [Register and scan Azure Synapse Analytics workspaces](register-scan-azure-synapse-analytics.md) </br> [Register and scan Azure Cosmos Database (SQL API)](register-scan-azure-cosmos-database.md) </br> [Register and scan an Azure MySQL database](register-scan-azure-mysql-database.md) </br> [Register and scan an Azure database for PostgreSQL](register-scan-azure-postgresql.md) |
| | |

## View labels on assets in the catalog

Once you've defined autolabeling rules for your labels in Microsoft 365 and scanned your data in Azure Purview, labels are automatically applied to your assets.

**To view the labels applied to your assets in the Azure Purview Catalog:**

In the Azure Purview Catalog, use the **Label** filtering options to show assets with specific labels only. For example:

:::image type="content" source="media/how-to-automatically-label-your-content/filter-search-results-small.png" alt-text="Search for assets by label" lightbox="media/how-to-automatically-label-your-content/filter-search-results.png":::

To view details of an asset including classifications found and label applied, click on the asset in the results.

For example:

:::image type="content" source="media/how-to-automatically-label-your-content/view-labeled-files-blob-storage-small.png" alt-text="View a sensitivity label on a file in your Azure Blob Storage" lightbox="media/how-to-automatically-label-your-content/view-labeled-files-blob-storage.png":::

## View Insight reports for the classifications and sensitivity labels

Find insights on your classified and labeled data in Azure Purview use the **Classification** and **Sensitivity labeling** reports.

> [!div class="nextstepaction"]
> [Classification insights](./classification-insights.md)

> [!div class="nextstepaction"]
> [Sensitivity label insights](sensitivity-insights.md)

> [!div class="nextstepaction"]
> [Overview of Labeling in Azure Purview](create-sensitivity-label.md)

> [!div class="nextstepaction"]
> [Labeling Frequently Asked Questions](sensitivity-labels-frequently-asked-questions.yml)