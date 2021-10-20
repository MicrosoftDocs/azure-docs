---
title: 'Register and scan Azure Blob Storage'
description: This article outlines the process to register an Azure Blob Storage data source in Azure Purview including instructions to authenticate and interact with the Azure Blob Storage Gen2 source
author: athenads
ms.author: athenadsouza
ms.service: purview
ms.topic: how-to 
ms.date: 10/03/2021
ms.custom: template-how-to
---


# Connect to Azure Blob storage in Azure Purview

This article outlines the process to register an Azure Blob Storage account in Azure Purview including instructions to authenticate and interact with the Azure Blob Storage source

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)|[Yes](#scan) | [Yes](#scan)|[Yes](#scan)| Yes | Yes | No|

For file types such as csv, tsv, psv, ssv, the schema is extracted when the following logics are in place:

* First row values are non-empty
* First row values are unique
* First row values are neither a date and nor a number

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

## Register

This section will enable you to register the Azure Blob storage account and set up an appropriate authentication mechanism to ensure successful scanning of the data source.

### Steps to register

It is important to register the data source in Azure Purview prior to setting up a scan for the data source.

1. Go to the [Azure portal](https://portal.azure.com), and navigate to the **Purview accounts** page and click on your _Purview account_

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-purview-acct.png" alt-text="Screenshot that shows the Purview account used to register the data source":::

1. **Open Purview Studio** and navigate to the **Data Map --> Sources**

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-open-purview-studio.png" alt-text="Screenshot that shows the link to open Purview Studio":::

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-sources.png" alt-text="Screenshot that navigates to the Sources link in the Data Map":::

1. Create the [Collection hierarchy](./quickstart-create-collection.md) using the **Collections** menu and assign permissions to individual sub-collections, as required

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-collections.png" alt-text="Screenshot that shows the collection menu to create collection hierarchy":::

1. Navigate to the appropriate collection under the **Sources** menu and click on the **Register** icon to register a new Azure Blob data source

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-register-source.png" alt-text="Screenshot that shows the collection used to register the data source":::

1. Select the **Azure Blob Storage** data source and click **Continue**

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-select-data-source.png" alt-text="Screenshot that allows selection of the data source":::

1. Provide a suitable **Name** for the data source, select the relevant **Azure subscription**, existing **Azure Blob Storage account name** and the **collection** and click on **Apply**

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-data-source-details.png" alt-text="Screenshot that shows the details to be entered in order to register the data source":::

1. The Azure Blob storage account will be shown under the selected Collection

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-data-source-collection.png" alt-text="Screenshot that shows the data source mapped to the collection to initiate scanning":::

## Scan

### Creating the scan

1. Open your **Purview account** and click on the **Open Purview Studio**
1. Navigate to the **Data map** --> **Sources** to view the collection hierarchy
1. Click on the **New Scan** icon under the **Azure Blob data source** registered earlier

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-new-scan.png" alt-text="Screenshot that shows the screen to create a new scan":::

#### If using Managed Identity

Provide a **Name** for the scan, select the **Purview MSI** under **Credential**, choose the appropriate collection for the scan and click on **Test connection**. On a successful connection, click **Continue**

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-managed-identity.png" alt-text="Screenshot that shows the Managed Identity option to run the scan":::

#### If using Account Key

Provide a **Name** for the scan, choose the appropriate collection for the scan and select **Authentication method** as _Account Key_ and click **Create**

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-acct-key.png" alt-text="Screenshot that shows the Account Key option for scanning":::

#### If using Service Principal

1. Provide a **Name** for the scan, choose the appropriate collection for the scan and click on the **+ New** under **Credential**

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-sp-option.png" alt-text="Screenshot that shows the option for service principal to enable scanning":::

1. Select the appropriate **Key vault connection** and the **Secret name** that was used while creating the _Service Principal_. The **Service Principal ID** is the **Application (client) ID** copied earlier

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-service-principal-option.png" alt-text="Screenshot that shows the service principal option":::

1. Click on **Test connection**. On a successful connection, click **Continue**

### Scoping and running the scan

1. You can scope your scan to specific folders and sub-folders by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-scope-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-scan-rule-set.png" alt-text="Scan rule set":::

1. If creating a new _scan rule set_, select the **file types** to be included in the scan rule.

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-file-types.png" alt-text="Scan rule set file types":::

1. You can select the **classification rules** to be included in the scan rule

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-classification rules.png" alt-text="Scan rule set classification rules":::

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-select-scan-rule-set.png" alt-text="Scan rule set selection":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-scan-trigger.png" alt-text="scan trigger":::

1. Review your scan and select **Save and run**.

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-review-scan.png" alt-text="review scan":::

### Viewing Scan

1. Navigate to the _data source_ in the _Collection_ and click on **View Details** to check the status of the scan

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-view-scan.png" alt-text="view scan":::

1. The scan details indicate the progress of the scan in the **Last run status** and the number of assets _scanned_ and _classified_

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-scan-details.png" alt-text="view scan details":::

1. The **Last run status** will be updated to **In progress** and subsequently **Completed** once the entire scan has run successfully

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-scan-in-progress.png" alt-text="view scan in progress":::

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-scan-completed.png" alt-text="view scan completed":::

### Managing Scan

Scans can be managed or run again on completion

1. Click on the **Scan name** to manage the scan

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-manage-scan.png" alt-text="manage scan":::

1. You can _run the scan_ again, _edit the scan_, _delete the scan_  

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-manage-scan-options.png" alt-text="manage scan options":::

1. You can _run an incremental scan_ or a _full scan_ again 

   :::image type="content" source="media/register-scan-azure-blob-storage-source/register-blob-full-inc-scan.png" alt-text="full or incremental scan":::

## Next steps

Now that you have registered your source, follow the below guides to learn more about Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
