---
title: 'Tutorial: Analyze blob inventory reports - Azure Storage'
description: Learn how to analyze and visualize blob inventory reports by using Azure Synapse and Power BI.  
author: normesta
ms.service: storage
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: normesta
ms.subservice: blobs
---

# Tutorial: Analyze blob inventory reports

The Azure Storage blob inventory feature provides you with an overview of the containers, blobs, snapshots, and blob versions within a storage account. You can aggregate and analyze the output of a report by running queries in Azure Synapse. Then, you can visualize the output of these queries by using Power BI. 

This tutorial is based on a published sample. You can use the sample and the process described in this tutorial to analyze and visualize data from blob inventory reports. This data includes characteristics such as data usage storage patterns. You can use these insights to optimize costs versus performance in your accounts.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Generate a blob inventory report
> * Set up a Synapse workspace
> * Set up Synapse Studio
> * Generate analytic data in Synapse Studio
> * Visualize results in Power BI

This report presents these analytics in visual form:

- Overall growth in data over time
- Amount of data added to the storage account over time
- Number of files modified
- Blob snapshot size
- Data access patterns in different tiers of storage
- The current distribution of data across tiers and across blob types
- Distribution of blob across blob types over time
- Distribution of data in containers over time
- Distribution of blobs across access tiers over time
- Distribution of data by file types over time

## Prerequisites

- Azure subscription - [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

- Azure storage account - [create a storage account](../common/storage-account-create.md) 
  
  Make sure that your user identity has the [Storage Blob Data Contributor role](assign-azure-role-data-access.md) assigned to it.

## Generate an inventory report

First, enable blob inventory reports for your storage account. See [Enable Azure Storage blob inventory reports](blob-inventory-how-to.md). You might have to wait up to 24 hours after enabling inventory reports for your first report to be generated.

## Set up a Synapse workspace

1. Create an Azure Synapse workspace. 

   See [Create an Azure Synapse workspace](../../synapse-analytics//get-started-create-workspace.md). 

   > [!NOTE]
   > As part of creating the workspace, you'll create a storage account that has a hierarchical namespace. This is the account that Azure Synapse uses to efficiently store Spark tables and application logs. Azure Synapse refers to this account as the _primary storage account_. To avoid confusion, this article will use the term _inventory report account_ to refer to the account which contains inventory reports.

2. In the Synapse workspace, assign your user identity the role of **Contributor**. See [Azure RBAC: Owner role for the workspace](../../synapse-analytics/get-started-add-admin.md#azure-rbac-owner-role-for-the-workspace).

3. Give the Synapse workspace permission to access the inventory reports in your storage account by navigating to your **inventory report account**, and then assigning the system managed identity of the workspace the **Storage Blob Data Contributor** role. 

   See [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

4. Navigate to **primary storage account** and assign your user identity the role of **Blob Storage Contributor**.

## Set up Synapse Studio

1. Open your Synapse workspace in Synapse Studio. 

   See [Open Synapse Studio](../../synapse-analytics/get-started-create-workspace.md#open-synapse-studio).

2. In Synapse Studio, Make sure that your identity is assigned the role of **Synapse Administrator**. 

   See [Synapse RBAC: Synapse Administrator role for the workspace](../../synapse-analytics/get-started-add-admin.md#synapse-rbac-synapse-administrator-role-for-the-workspace).

3. Create an Apache Spark pool.

   See [Create a serverless Apache Spark pool](../../synapse-analytics/get-started-analyze-spark.md#create-a-serverless-apache-spark-pool).

## Set up and run the sample notebook

In this section, you'll use Synapse Studio to generate the output that you'll visualize in a report. 

#### Modify and upload a configuration file

1. Download the [BlobInventoryStorageAccountConfiguration.json](https://github.com/microsoft/Blob-Inventory-Report-Analytics/blob/main/src/BlobInventoryStorageAccountConfiguration.json) file.

2. Update the following placeholders of that file:

   - Set `storageAccountName` to the name of your inventory report account.
   
   - Set `destinationContainer` to the name of the container that holds the inventory reports.
   
   - Set `blobInventoryRuleName` to the name of the inventory report rule that has generated the results that you'd like to analyze.
   
   - Set `accessKey` to the account key of the inventory report account.

3. Upload the **BlobInventoryStorageAccountConfiguration.json** file to the container in your primary storage account that you specified when you created the Synapse workspace. 

#### Import a PySpark Notebook

1. Download the [ReportAnalysis.ipynb](https://github.com/microsoft/Blob-Inventory-Report-Analytics/blob/main/src/ReportAnalysis.ipynb) sample notebook.

   This notebook contains analytics queries. 

2. Open your Synapse workspace in Synapse Studio. 

   See [Open Synapse Studio](../../synapse-analytics/get-started-create-workspace.md#open-synapse-studio).

3. In Synapse Studio, select the **Develop** tab.

4. Select the plus sign **(+)** to add an item.

5. Select **Import**, browse to the sample file that you downloaded, select that file, and select **Open**.

   The **Properties** dialog box appears.

6. In the **Properties** dialog box, select the **Configure session** link.

   > [!div class="mx-imgBorder"]
   > ![Import properties dialog box](./media/storage-blob-inventory-report-analytics/import-properties-dialog-box.png) 

   The **Configure session** dialog box opens.

7. In the **Attach to** drop-down list of the **Configure session** dialog box, select the Spark pool that you created earlier in this article. Then, select the **Apply** button.

#### Modify the Python notebook

1. In the first cell of the python notebook, set the value of the `storage_account` variable to the name of the primary storage account. 

2. Update the value of the `container_name` variable to the name of the container in that account that you specified when you created the Synapse workspace.

3. Select the **Publish** button.

#### Run the PySpark notebook

In the PySpark notebook, select **Run all**.

It will take a few minutes to start the Spark session and another few minutes to process the inventory reports. The first run could take a while if there are numerous inventory reports to process. Subsequent runs will only process the new inventory reports created since the last run.

> [!NOTE]
> If you make any changes to the notebook will the notebook is running, make sure to publish those changes by using the **Publish** button.
   
## Visualize the data

1. Download the [ReportAnalysis.pbit](https://github.com/microsoft/Blob-Inventory-Report-Analytics/blob/main/src/ReportAnalysis.pbit) sample file.

2. Open Power BI Desktop. 

   For installation guidance, see [Get Power BI Desktop](/power-bi/fundamentals/desktop-get-the-desktop).

2. In Power BI, select **File**, **Open report**, and then **Browse reports**. 

3. In the **Open** dialog box, change the file type to **Power BI template files (*.pbit). 

   > [!div class="mx-imgBorder"]
   > ![The Power BI template files type in the Open dialog box](./media/storage-blob-inventory-report-analytics/file-type-setting.png) 

4. Browse to the location of the **ReportAnalysis.ipynb** file that you downloaded, and then select **Open**.

   A dialog box appears which asks you to provide the name of the Synapse workspace and the data base name. 

5. In the dialog box, set the **synapse_workspace_name** field to the workspace name and set the **database_name** field to `reportdata`. Then, select the **Load** button.

   > [!div class="mx-imgBorder"]
   > ![Report configuration dialog box](./media/storage-blob-inventory-report-analytics/report-configuration-dialog-box.png) 

   A report appears which provides visualizations of the data retrieved by the notebook.


## Common errors

## Next steps

In this tutorial, you learned how to use .NET client libraries to perform client-side encryption for blob upload and download operations.

For a broad overview of client-side encryption for blobs, including instructions for migrating encrypted data to version 2, see [Client-side encryption for blobs](client-side-encryption.md).

For more information about Azure Key Vault, see the [Azure Key Vault overview page](../../key-vault/general/overview.md)