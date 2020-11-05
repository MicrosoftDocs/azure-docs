---
title: Automatically apply sensitivity labels to your content
titleSuffix: Azure Purview
description: Learn how to create sensitivity labels and automatically apply them to your content during a scan.
author: batamig
ms.author: bagol
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/29/2020
---

# Automatically label your content

This article describes how to create Microsoft Information Protection (MIP) sensitivity labels, and automatically apply them to your data in Babylon.

Babylon sensitivity labels are created in Microsoft 365. Sensitivity labels enable you to classify and protect your organization's data, while ensuring that user productivity and collaboration can continue to flow.

## What are sensitivity labels? 

To get work done, people in your organization collaborate with others both inside and outside the organization. Data doesn't always stay in your cloud, and often roams everywhere, across devices, apps, and services. 

When your cloud data roams, you want it to do so in a secure, protected way that meets your organization's business and compliance policies.

Sensitivity labels in Babylon enable you to:

- **Label data stored in various formats**, such as files in Azure Blob storage, Azure files, and SQL columns.

- **Control** who can and cannot access your content.

- **Enforce protection settings**, such as encryption or watermarks on labeled content.

With sensitivity labels, you can classify data across your data estate and then enforce protection settings based on that classification. 

For more information, see:

- [Learn about sensitivity labels](/microsoft-365/compliance/sensitivity-labels) in the Microsoft 365 documentation
- [What are autolabeling rules?](#what-are-autolabeling-rules)
- [Supported data types for sensitivity labels in Babylon](#supported-data-types-for-sensitivity-labels-in-babylon)

#### What are autolabeling rules?

Your content is constantly growing and changing. 

When you create your labels, make sure to define autolabeling rules for both files and SQL columns to apply your labels automatically with each content scan. 

After scanning your content, you can dive into your data to view the labels automatically applied, as well as view Insight reports on the classifications and labels in your content over time. 

#### Supported data types for sensitivity labels in Babylon

Sensitivity labels are supported in Babylon for the following data types:

|Data type  |Sources  |
|---------|---------|
|Automatic labeling for files     |     - Azure Blob Storage </br>- Azure files  </br>- Azure Data Lake Storage Gen 1 and Gen 2 |
|Automatic labeling for SQL columns     |  - SQL server </br>- Azure SQL database </br>- Azure SQL Database Managed Instance       |

## How to create sensitivity labels in Microsoft 365

If you don't already have sensitivity labels, you'll need to create them. 

Existing sensitivity labels will also need to be modified to include the new data asset types within Babylon.

**Prerequisites**

During public preview, sensitivity labels for Babylon are created and managed using Microsoft 365, and you must have an active Microsoft 365 E5 license.

For more information, see the [Microsoft 365 E5 sales page](https://www.microsoft.com/microsoft-365/enterprise/e5).

**To create a new sensitivity label or modify an existing label**

1. Open the [Microsoft 365 Security and Compliance Center](https://protection.office.com/homepage). 

1. Under **Solutions**, select **Information protection**, then select **Create a label**. 

    :::image type="content" source="media/create-sensitivity-label/create-sensitivity-label-full.png" alt-text="Create sensitivity labels in the Microsoft 365 Security and Compliance Center":::

1. Name the label. Then, under **Define the scope for this label**, select **files and emails** and **SQL Columns**.
    
    :::image type="content" source="media/create-sensitivity-label/m365-create-label-scope.png" alt-text="Create your label in the Microsoft 365 Security and Compliance Center":::

1. Follow the rest of the prompts in the wizard for your label settings. 

    Specifically, define autolabeling rules for files and SQL columns:

    - [Define autolabeling rules for files](#define-autolabeling-rules-for-files)
    - [Define autolabeling rules for SQL columns](#define-autolabeling-rules-for-sql-columns)

    For more information about wizard options, see [What sensitivity labels can do](/microsoft-365/compliance/sensitivity-labels#what-sensitivity-labels-can-do) in the Microsoft 365 documentation.

1. Repeat the steps listed above to create additional labels. 

    To create a sublabel, select the parent label > **...** > **More actions** > **Add sub label**.

1. To modify existing labels, browse to **Information Protection** > **Labels.**, and select your label. 

    Then select **Edit label** to open the **Edit sensitivity label** wizard again, with all of the settings you'd defined when you created the label.

    :::image type="content" source="media/create-sensitivity-label/edit-sensitivity-label-full.png" alt-text="Edit an existing sensitivity label":::

1. When you're done creating all of your labels, make sure to view your label order, and reorder them as needed. 

    To change the order of a label, select **...** **> More actions** > **Move up** or **Move down.** 

    For more information, see [Label priority (order matters)](/microsoft-365/compliance/sensitivity-labels#label-priority-order-matters) in the Microsoft 365 documentation.

> [!IMPORTANT]
> Do not delete a label unless you understand the impact for your users. 
>
> For more information, see [Removing and deleting labels](/microsoft-365/compliance/create-sensitivity-labels#removing-and-deleting-labels) in the Microsoft 365 documentation.

Continue by [scanning your content to apply labels automatically](#scan-your-content-to-apply-labels-automatically), and then:

- [Search for files based on labels](#search-for-files-based-on-labels)
- [View Insight reports for the classifications and sensitivity labels](#view-insight-reports-for-the-classifications-and-sensitivity-labels)

#### Define autolabeling rules for files

Define autolabeling rules for files in the wizard when you create or edit your label. 

On the **Auto-labeling for Office apps** page, enable **Auto-labeling for Office apps,** and then define the conditions where you want your label to be automatically applied to your content.

For example:

:::image type="content" source="media/create-sensitivity-label/m365-create-auto-labeling-rules-files.png" alt-text="Define autolabeling rules for files in the Microsoft 365 Security and Compliance Center":::

When the sensitivity label is applied, the user will see a notification in their Office app. For example:

:::image type="content" source="media/create-sensitivity-label/sensitivity-labels-msg-doc-was-auto-labeled.png" alt-text="Sample file that was automatically labeled":::
 
For more information, see [Apply a sensitivity label to content automatically](/microsoft-365/compliance/apply-sensitivity-label-automatically#how-to-configure-auto-labeling-for-office-apps) in the Microsoft 365 documentation. 

#### Define autolabeling rules for SQL columns

Define autolabeling rules for SQL columns in the wizard when you create or edit your label. 

Under the **Azure asset** option, select the **Auto Labeling for Azure SQL Column** checkbox and add the relevant sensitive information types for the label. 

For example:
        
:::image type="content" source="media/create-sensitivity-label/m365-create-auto-labeling-rules-sql.png" alt-text="Define autolabeling rules for SQL columns  in the Microsoft 365 Security and Compliance Center":::

## Scan your content to apply labels automatically

Scan your Babylon content to apply the labels you've created, based on the autolabeling rules you've defined. 

For more information, see:

|Source  |Reference  |
|---------|---------|
|**Azure Blob Storage**     |[Register and Scan Azure Blob Storage](register-scan-azure-blob-storage-source.md)         |
|**Azure Data Lake Storage**     |[Register and scan Azure Data Lake Storage Gen1](register-scan-adls-gen1.md) </br>[Register and scan Azure Data Lake Storage Gen2](register-scan-adls-gen2.md)         |
|**Azure Files**   |[Register and scan Azure Files](register-scan-azure-files-storage-source.md)         |
|**Azure SQL Databases**|[Register and scan an Azure SQL Database](register-scan-azure-sql-database.md) </br>[Register and scan an Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md)|
|**Storage accounts behind firewalls**     |[Scan Storage Accounts behind a Firewall in Azure Purview](scan-sqlresource-firewall.md)         |
|**Teradata**   |[Register and scan Teradata source (Preview)](register-scan-teradata-source.md)         |
| | |

## Search for files based on labels

Once you've defined autolabeling settings for your labels in Microsoft 365 and scanned your Babylon content, view the labels that were applied automatically.

In the Babylon Catalog, use the **Label** filtering options to show files with specific labels only. For example: 

:::image type="content" source="media/create-sensitivity-label/filter-search-results.png" alt-text="Search for assets by label":::

In Babylon, files with sensitivity labeling are marked as **Microsoft extended**. For example:

- [Labeled files in Azure Blob Storage](#labeled-files-in-azure-blob-storage)
- [Labeled files in Azure files](#labeled-files-in-azure-files)
- [Labeled files in SQL tables](#labeled-files-in-sql-tables)

#### Labeled files in Azure Blob Storage

:::image type="content" source="media/create-sensitivity-label/view-labeled-files-blob-storage.png" alt-text="View a sensitivity label on a file in your Azure Blob Storage":::

#### Labeled files in Azure files

:::image type="content" source="media/create-sensitivity-label/view-labeled-files-azure.png" alt-text="View a sensitivity label on a file in your Azure file storage":::

#### Labeled files in SQL tables

:::image type="content" source="media/create-sensitivity-label/view-labeled-files-sql.png" alt-text="View a sensitivity label on an SQL table":::

> [!NOTE]
> Sensitivity labels that are applied to specific SQL columns are displayed at the SQL table level.

## View Insight reports for the classifications and sensitivity labels

Find insights on your classified and labeled data in Babylon using the **Sensitivity labeling** and **Classification** reports.

For more information see:

- [Classification insights about your data from Project Babylon](classification-insights.md)
- [Sensitivity label insights about your data from Project Babylon](sensitivity-insights.md)
