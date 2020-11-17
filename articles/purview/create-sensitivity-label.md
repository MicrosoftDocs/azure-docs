---
title: Automatically apply sensitivity labels to your content
description: Learn how to create sensitivity labels and automatically apply them to your content during a scan.
author: batamig
ms.author: bagol
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 11/17/2020
---

# Automatically label your content in Azure Purview

This article describes how to create Microsoft Information Protection (MIP) sensitivity labels, and automatically apply them to your Azure assets in Azure Purview.

## What are sensitivity labels? 

To get work done, people in your organization collaborate with others both inside and outside the organization. Data doesn't always stay in your cloud, and often roams everywhere, across devices, apps, and services. 

When your data roams, you want it to do so in a secure, protected way that meets your organization's business and compliance policies. Applying sensitivity labels can help you keep your data secured and protected.

MIP sensitivity labels are created in the Microsoft 365 Security and Compliance Center (SCC). Sensitivity labels enable you to classify and protect your organization's data, while ensuring that user productivity and collaboration can continue to flow. 

Sensitivity labels in Azure Purview can be used to:

- **Automatically apply labels** to files and database columns

- **Control** who can and cannot access your content

- **Enforce protection settings**, such as encryption, on labeled content

For more information, see:

- [Learn about sensitivity labels](/microsoft-365/compliance/sensitivity-labels) in the Microsoft 365 documentation
- [What are autolabeling rules?](#what-are-autolabeling-rules)
- [Supported data types for sensitivity labels in Babylon](#supported-data-types-for-sensitivity-labels-in-babylon)

#### What are autolabeling rules?

Your content is constantly growing and changing. Tracking the data that is currently unlabeled, and taking action to manually apply labels is not only cumbersome, but is also an unnecessary headache. 

Autolabeling rules are conditions that you specify, stating when a particular label should be applied. When these conditions are met, the label is automatically assigned to the content.

When you create your labels, make sure to define autolabeling rules for both files and database columns to apply your labels automatically with each content scan. 

After scanning your content, you can dive into your data to view the labels automatically applied, as well as view Insight reports on the classifications and labels in your content over time. 

#### Supported data types for sensitivity labels in Azure Purview

Sensitivity labels are supported in Azure Purview for the following data types:

|Data type  |Sources  |
|---------|---------|
|Automatic labeling for files     |     - Azure Blob Storage </br>- Azure Files  </br>- Azure Data Lake Storage Gen 1 and Gen 2 <br> Amazon S3 bucket |
|Automatic labeling for database columns     |  - SQL server </br>- Azure SQL database </br>- Azure SQL Database Managed Instance   <br> - Azure Synapse    |

## How to create sensitivity labels in Microsoft 365

If you don't already have sensitivity labels, you'll need to create them and make them available for Azure Purview. Existing sensitivity labels can also be modified to make them available for Azure Purview.

For more information, see:

- [Licensing requirements](#licensing-requirements)
- [Extending sensitivity labels to Azure Purview](#extending-sensitivity-labels-to-azure-purview)
- [Creating new sensitivity labels or modifying existing labels](#creating-new-sensitivity-labels-or-modifying-existing-labels)
### Licensing requirements

MIP sensitivity labels are created and managed in the Microsoft 365 Security and Compliance Center. To create sensitivity labels for use in Azure Purview, you must have an active Microsoft 365 E5 license.

If you do not already have the required license, you can get one from the [Microsoft 365 E5 sales page](https://www.microsoft.com/microsoft-365/enterprise/e5).

### Extending sensitivity labels to Azure Purview

By default, MIP sensitivity labels are only available for assets in Microsoft 365, where you can apply them to files and emails.

To apply MIP sensitivity labels to Azure assets in Azure Purview, you must explicitly consent to extending the labels, and select the specific labels that you want to be available in Purview.

> [!NOTE]
> Since Microsoft 365 and Azure Purview are separate services, there is a possibility that they will be deployed in different regions. Label names and custom sensitive information type names are considered to be customer content, and are kept within the same GEO location by default to protect the sensitivity of your content and to avoid GDPR laws.
>
> For this reason, labels and custom sensitive information types are not shared to Azure Purview by default, and require your consent to use them in Azure Purview.

> [!IMPORTANT]
> Your consent enables Microsoft to share the label name and custom sensitive information type name to *both* Azure Purview and Azure Security Center (ASC). Microsoft uses the label information from Azure Purview to enrich your recommendations and alerts in ASC. 
>
> Consenting here applies to sharing this data with both services. There is currently no choice to share labeling information with Azure Purview only.

**To extend sensitivity labels to Purview:**

In Microsoft 365, navigate to the **Information Protection** page. In the **Extend labeling to assets in Azure Purview**, select the **Turn on** button, and then select **Yes** in the confirmation dialog that appears.

For example:

:::image type="content" source="media/create-sensitivity-label/extend-sensitivty-labels-to-purview-m365.png" alt-text="Click **Turn on** to extend sensitivity labels to Purview":::
 
Once you extend labeling to assets in Azure Purview, you can select the labels that you want to make available in Purview. For more information, see [Creating new sensitivity labels or modifying existing labels](#creating-new-sensitivity-labels-or-modifying-existing-labels).
### Creating new sensitivity labels or modifying existing labels

1. Open the [Microsoft 365 Security and Compliance Center](https://protection.office.com/homepage). 

1. Under **Solutions**, select **Information protection**, then select **Create a label**. 

    :::image type="content" source="media/create-sensitivity-label/create-sensitivity-label-full.png" alt-text="Create sensitivity labels in the Microsoft 365 Security and Compliance Center":::

1. Name the label. Then, under **Define the scope for this label**, select **Files and emails** and **Azure Purview assets**.
    
    :::image type="content" source="media/create-sensitivity-label/m365-create-label-scope.png" alt-text="Create your label in the Microsoft 365 Security and Compliance Center":::

1. Follow the rest of the prompts in the wizard for your label settings. 

    Specifically, define autolabeling rules for files and database columns:

    - [Define autolabeling rules for files](#define-autolabeling-rules-for-files)
    - [Define autolabeling rules for database columns](#define-autolabeling-rules-for-database-columns)

    For more information about wizard options, see [What sensitivity labels can do](/microsoft-365/compliance/sensitivity-labels#what-sensitivity-labels-can-do) in the Microsoft 365 documentation.

1. Repeat the steps listed above to create additional labels. 

    To create a sublabel, select the parent label > **...** > **More actions** > **Add sub label**.

1. To modify existing labels, browse to **Information Protection** > **Labels**, and select your label. 

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

#### Define autolabeling rules for database columns

Define autolabeling rules for database columns in the wizard when you create or edit your label. 

Under the **Azure Purview assets (preview)** option:

1. Select the **Auto-labeling for database columns** slider.

1. Select **Check sensitive info types** to choose the sensitive info types you want to apply to your label.

For example:
        
:::image type="content" source="media/create-sensitivity-label/m365-create-auto-labeling-rules-sql.png" alt-text="Define autolabeling rules for SQL columns  in the Microsoft 365 Security and Compliance Center":::

## Scan your content to apply labels automatically

Scan your content in Azure Purview to automatically apply the labels you've created, based on the autolabeling rules you've defined. 

For more information on how to set up scans on various assets in Azure Purview, see:

|Source  |Reference  |
|---------|---------|
|**Azure Blob Storage**     |[Register and Scan Azure Blob Storage](register-scan-azure-blob-storage-source.md)         |
|**Azure Data Lake Storage**     |[Register and scan Azure Data Lake Storage Gen1](register-scan-adls-gen1.md) </br>[Register and scan Azure Data Lake Storage Gen2](register-scan-adls-gen2.md)         |
|**Azure Files**   |[Register and scan Azure Files](register-scan-azure-files-storage-source.md)         |
|**Azure SQL Databases**|[Register and scan an Azure SQL Database](register-scan-azure-sql-database.md) </br>[Register and scan an Azure SQL Database Managed Instance](register-scan-azure-sql-database-managed-instance.md)|
|**Storage accounts behind firewalls**     |[Scan Storage Accounts behind a Firewall in Azure Purview](scan-sqlresource-firewall.md)         |
|**Teradata**   |[Register and scan Teradata source (Preview)](register-scan-teradata-source.md)         |
| | |

## View labels on assets

Once you've defined autolabeling rules for your labels in Microsoft 365 and scanned your content in Azure Purview, labels are automatically applied to your assets. 

**To view the labels applied to your assets in the Azure Purview Catalog:**

In the Azure Purview Catalog, use the **Label** filtering options to show files with specific labels only. For example: 

:::image type="content" source="media/create-sensitivity-label/filter-search-results.png" alt-text="Search for assets by label":::

#### Labeled file in Azure Blob Storage

:::image type="content" source="media/create-sensitivity-label/view-labeled-files-blob-storage.png" alt-text="View a sensitivity label on a file in your Azure Blob Storage":::

#### Labeled file in Azure files

:::image type="content" source="media/create-sensitivity-label/view-labeled-files-azure.png" alt-text="View a sensitivity label on a file in your Azure file storage":::

#### Labeled database column in an Azure SQL database

:::image type="content" source="media/create-sensitivity-label/view-labeled-files-sql.png" alt-text="View a sensitivity label on an SQL table":::


## View Insight reports for the classifications and sensitivity labels

Find insights on your classified and labeled data in Azure Purview using the **Sensitivity labeling** and **Classification** reports.

For more information see:

- [Classification insights about your data from Azure Purview](classification-insights.md)
- [Sensitivity label insights about your data from Azure Purview](sensitivity-insights.md)
