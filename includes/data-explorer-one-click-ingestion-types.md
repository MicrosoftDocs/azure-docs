---
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 30/03/2020
ms.author: orspodek
---

## Select an ingestion type

For **Ingestion type**, select one of the following options:
   * **from storage** - in the **Link to storage** field, add the URL of the storage account. Use [Blob SAS URL](/azurevs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container) for private storage accounts.
   
      ![One-click ingestion from storage](media/data-explorer-one-click-ingestion-types/from-storage-blob.png)

    * **from file** - select **Browse** to locate the file, or drag the file into the field.
  
      ![One-click ingestion from file](media/data-explorer-one-click-ingestion-types/from-file.png)

    * **from container** - in the **Link to storage** field, add the [SAS URL](/azure/vs-azure-tools-storage-explorer-blobs#get-the-sas-for-a-blob-container) of the container, and optionally enter the sample size.

      ![One-click ingestion from container](media/data-explorer-one-click-ingestion-types/from-container.png)

  A sample of the data appears. If you want to, you can filter it to show only files that begin end with specific characters. When you adjust the filters, the preview automatically updates.
  
  For example, you can filter for all files that begin with the word *data* and end with a *.csv.gz* extension.

  ![One-click ingestion filter](media/data-explorer-one-click-ingestion-types/from-container-with-filter.png)
