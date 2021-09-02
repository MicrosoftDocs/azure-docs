---
title: How to automatically apply sensitivity labels to your data
description: Learn how to create sensitivity labels and automatically apply them to your data during a scan.
author: ajaykar
ms.author: ajaykar
ms.service: purview
ms.subservice: purview-label
ms.topic: how-to
ms.date: 03/09/2021
---

## Create or extend existing sensitivity labels to Azure Purview

If you don't already have sensitivity labels, you'll need to create them and make them available for Azure Purview. Existing sensitivity labels can also be modified to make them available for Azure Purview.


### Step 1: Licensing requirements

MIP sensitivity labels are created and managed in the Microsoft 365 Security and Compliance Center. To create sensitivity labels for use in Azure Purview, you must have an active Microsoft 365 E5 license.

If you do not already have the required license, you can sign up for a trial of [Microsoft 365 E5](https://www.microsoft.com/microsoft-365/business/compliance-solutions#midpagectaregion).

### Step 2: Consent to use sensitivity labels in Azure Purview

The following steps allow your sensitivity labels to be available for use in Azure Purview, where you can apply sensitivity labels to files and schematized data assets.

1. In Microsoft 365, navigate to the **Information Protection** page. 
1. In the **Extend labeling to assets in Azure Purview**, select the **Turn on** button, and then select **Yes** in the confirmation dialog that appears.

For example:

:::image type="content" source="media/create-sensitivity-label/extend-sensitivity-labels-to-purview-small.png" alt-text="Select **Turn on** to extend sensitivity labels to Purview" lightbox="media/create-sensitivity-label/extend-sensitivity-labels-to-purview.png":::
 
Once you extend labeling to assets in Azure Purview, you can select the labels that you want to make available in Purview. 

### Step 3: Create or modify existing label to automatically label content

When you use sensitivity labels for Office apps on Windows, macOS, iOS, and Android, users see new labels within four hours, and within one hour for Office on the web. However, allow up to 24 hours for changes to replicate to all apps and services.

> [!IMPORTANT]
> Do not delete a label unless you understand the impact for your users. For more information, see [Removing and deleting labels](/microsoft-365/compliance/create-sensitivity-labels#removing-and-deleting-labels) in the Microsoft 365 documentation.
>

**To create new sensitivity labels or modify existing labels**:

1. Open the [Microsoft 365 Security and Compliance Center](https://protection.office.com/homepage). 

1. Under **Solutions**, select **Information protection**, then select **Create a label**. 

    :::image type="content" source="media/create-sensitivity-label/create-sensitivity-label-full-small.png" alt-text="Create sensitivity labels in the Microsoft 365 Security and Compliance Center" lightbox="media/create-sensitivity-label/create-sensitivity-label-full.png":::

1. Name the label. Then, under **Define the scope for this label**:

    - To label files, also select **Files & emails**.
    - To label schematized data like database columns, select **Schematized data assets**.
    
    :::image type="content" source="media/create-sensitivity-label/create-label-scope-small.png" alt-text="Create your label in the Microsoft 365 Security and Compliance Center" lightbox="media/create-sensitivity-label/create-label-scope.png":::

1. Follow the rest of the prompts in the wizard for your label settings. 

    Specifically, define auto-labeling rules for files and schematized data assets:

    - [Define auto-labeling rules for files](#define-auto-labeling-rules-for-files)
    - [Define auto-labeling rules for schematized data assets](#define-auto-labeling-rules-for-database-columns)

    For more information about wizard options, see [What sensitivity labels can do](/microsoft-365/compliance/sensitivity-labels#what-sensitivity-labels-can-do) in the Microsoft 365 documentation.

1. Repeat the steps listed above to create more labels. 

    To create a sublabel, select the parent label > **...** > **More actions** > **Add sub label**.

1. To modify existing labels, browse to **Information Protection** > **Labels**, and select your label. 

    Then select **Edit label** to open the **Edit sensitivity label** wizard again, with all of the settings you'd defined when you created the label.

    :::image type="content" source="media/create-sensitivity-label/edit-sensitivity-label-full-small.png" alt-text="Edit an existing sensitivity label" lightbox="media/create-sensitivity-label/edit-sensitivity-label-full.png":::

1. When you're done creating all of your labels, make sure to view your label order, and reorder them as needed. 

    To change the order of a label, select **...** **> More actions** > **Move up** or **Move down.** 

    For more information, see [Label priority (order matters)](/microsoft-365/compliance/sensitivity-labels#label-priority-order-matters) in the Microsoft 365 documentation.


Continue by [scanning your data to apply labels automatically](#scan-your-data-to-apply-labels-automatically), and then:

- [View labels on assets](#view-labels-on-assets)
- [View Insight reports for the classifications and sensitivity labels](#view-insight-reports-for-the-classifications-and-sensitivity-labels)

#### Auto-labeling for files

Define auto-labeling rules for files in the wizard when you create or edit your label. 

On the **Auto-labeling for Office apps** page, enable **Auto-labeling for Office apps,** and then define the conditions where you want your label to be automatically applied to your data.

For example:

:::image type="content" source="media/create-sensitivity-label/create-auto-labeling-rules-files-small.png" alt-text="Define auto-labeling rules for files in the Microsoft 365 Security and Compliance Center" lightbox="media/create-sensitivity-label/create-auto-labeling-rules-files.png":::
 
For more information, see [Apply a sensitivity label to data automatically](/microsoft-365/compliance/apply-sensitivity-label-automatically#how-to-configure-auto-labeling-for-office-apps) in the Microsoft 365 documentation. 

#### Auto-labeling for schematized data

Define auto-labeling rules for schematized data assets in the wizard when you create or edit your label. 

Under the **schematized data assets** option:

1. Select the **Auto-labeling for schematized data assets** slider.

1. Select **Check sensitive info types** to choose the sensitive info types you want to apply to your label.

For example:
        
:::image type="content" source="media/create-sensitivity-label/create-auto-labeling-rules-db-columns-small.png" alt-text="Define auto-labeling rules for SQL columns in the Microsoft 365 Security and Compliance Center" lightbox="media/create-sensitivity-label/create-auto-labeling-rules-db-columns.png":::

### Step 4: Publish labels

Once you create a label, you will need to Scan your data in Azure Purview to automatically apply the labels you've created, based on the auto-labeling rules you've defined. 

### Scan your data to apply sensitivity labels automatically
Scan your data in Azure Purview to automatically apply the labels you've created, based on the auto-labeling rules you've defined.

For more information on how to set up scans on various assets in Azure Purview, see:

|Source  |Reference  |
|---------|---------|
|**Files within Storage** | [Register and Scan Azure Blob Storage](register-scan-azure-blob-storage-source.md) </br> [Register and scan Azure Files](register-scan-azure-files-storage-source.md) [Register and scan Azure Data Lake Storage Gen1](register-scan-adls-gen1.md) </br>[Register and scan Azure Data Lake Storage Gen2](register-scan-adls-gen2.md) |
|**Schematized data assets** | [Register and scan an Azure SQL Database](register-scan-azure-sql-database.md) </br>[Register and scan an Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md) </br> [Register and scan Dedicated SQL pools]() </br> [Register and scan Azure Synapse Analytics workspaces](register-scan-azure-synapse-analytics.md) </br> [Register and scan Azure Cosmos Database (SQL API)](register-scan-azure-cosmos-database.md) </br> [Register and scan an Azure MySQL database](register-scan-azure-mysql-database.md) </br> [Register and scan an Azure database for PostgreSQL](register-scan-azure-postgresql.md) |
| | |

## View labels on assets in the catalog

Once you've defined auto-labeling rules for your labels in Microsoft 365 and scanned your data in Azure Purview, labels are automatically applied to your assets. 

**To view the labels applied to your assets in the Azure Purview Catalog:**

In the Azure Purview Catalog, use the **Label** filtering options to show files with specific labels only. For example: 

:::image type="content" source="media/create-sensitivity-label/filter-search-results-small.png" alt-text="Search for assets by label" lightbox="media/create-sensitivity-label/filter-search-results.png":::

For example:

:::image type="content" source="media/create-sensitivity-label/view-labeled-files-blob-storage-small.png" alt-text="View a sensitivity label on a file in your Azure Blob Storage" lightbox="media/create-sensitivity-label/view-labeled-files-blob-storage.png":::

## View Insight reports for the classifications and sensitivity labels

Find insights on your classified and labeled data in Azure Purview using the **Classification** and **Sensitivity labeling** reports.

> [!div class="nextstepaction"]
> [Classification insights](./classification-insights.md)

> [!div class="nextstepaction"]
> [Sensitivity label insights](sensitivity-insights.md)
