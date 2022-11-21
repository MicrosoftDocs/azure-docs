---
title: Create Blob inventory report analytics
titleSuffix: Azure Storage
description: Learn how to create blob inventory report analytics
author: normesta
ms.service: storage
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: normesta
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Tutorial: Create Blob inventory analytics

Introduction goes here.

## Prerequisites

- An Azure storage account. See [create a storage account](../common/storage-account-create.md).

- An Azure storage account with Data Lake Storage Gen2 capabilities. See [Create a storage account to use with Azure Data Lake Storage Gen2](create-data-lake-storage-account.md).

- For both accounts, ensure that your user account has the [Storage Blob Data Contributor role](assign-azure-role-data-access.md) assigned to it.

## Enable inventory reports

The first step in this method is to [enable inventory reports](blob-inventory.md#enabling-inventory-reports) on your storage account. You may have to wait up to 24 hours after enabling inventory reports for your first report to be generated.

> [!NOTE]
> This is the account that does not have a hierarchical namespace. This tutorial uses a sample that refers to that account.

## Create an Azure Synapse workspace

1. Create an Azure Synapse workspace where you will execute a PySpark notebook to analyze the inventory report files. See [Create an Azure Synapse workspace](../../synapse-analytics/get-started-create-workspace.md) 

2. Open your Synapse workspace in Synapse Studio. See [Open Synapse Studio](../../synapse-analytics/get-started-create-workspace#open-synapse-studio).

3. In Synapse Studio, create an Apache Spark pool that will be used to execute the PySpark notebook that will process blob inventory reports. See [Create a serverless Apache Spark pool](../../synapse-analytics/get-started-analyze-spark.md#create-a-serverless-apache-spark-pool).

## Configure permissions

Configure permission for two storage accounts and the workspace. Do a better job explaining here.

### Grant access to your inventory reports

You need to give your Synapse workspace permission to access the inventory reports in your storage account.

In the account that contains your inventory reports, assign the system managed identity of the synapse workspace to the Storage blob Data Contributor role. This will permit the workspace access to reach in and grab inventory reports. For guidance, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md)

### Grant your user identity access in Synapse

1. In the Synapse workspace, assign your user id the role of Contributor. See [Azure RBAC: Owner role for the workspace](../../synapse-analytics/get-started-add-admin#azure-rbac-owner-role-for-the-workspace).

2. Open your Synapse workspace in Synapse Studio. See [Open Synapse Studio](../../synapse-analytics/get-started-create-workspace#open-synapse-studio).

3. In Synapse Studio, Make sure that your identity is assigned the role of Synapse Administrator. See [Synapse RBAC: Synapse Administrator role for the workspace](../../synapse-analytics/get-started-add-admin#synapse-rbac-synapse-administrator-role-for-the-workspace).

## Provide the configuration file to read the blob inventory report files

1. Download the [BlobInventoryStorageAccountConfiguration.json](https://github.com/microsoft/Blob-Inventory-Report-Analytics/blob/main/src/BlobInventoryStorageAccountConfiguration.json) file.

2. Update the following placeholders of that file:

   | Field | Description
   |---|---|
   | storageAccountName | Name of the storage account for which inventory has been run |
   | destinationContainer | Name of the container where inventory reports are stored |
   | blobInventoryRuleName | Name of the inventory rule whose results should be analyzed |
   | accessKey | The access key in which inventory reports are stored. |

3. Upload the **BlobInventoryStorageAccountConfiguration.json** file to the container in your Data Lake Storage Gen2 enabled storage account that you specified when you created the Synapse workspace. 

## Import the PySpark Notebook that has analytics queries

1. Download the [ReportAnalysis.ipynb](https://github.com/microsoft/Blob-Inventory-Report-Analytics/blob/main/src/ReportAnalysis.ipynb) sample file.

2. Open your Synapse workspace in Synapse Studio. See [Open Synapse Studio](../../synapse-analytics/get-started-create-workspace#open-synapse-studio).

3. In Synapse Studio, select the **Develop** tab on the left edge.

4. Select the large plus sign **(+)** to add an item.

5. Select **Import**, browse to the sample file that you downloaded, select that file, and select **Open**.

   The **Properties** dialog box appears.

6. In the **Properties** dialog box, click the **Configure session** link.

   > [!div class="mx-imgBorder"]
   > ![Import properties dialog box](./media/storage-blob-inventory-report-analytics/import-properties-dialog-box.png) 

   The **Configure session** dialog box opens.

7. In the **Attach to** drop-down list of the **Configure session** dialog box, select the spark pool that you created earlier in this article. Then, click the **Apply** button.


## Modify the Python notebook

1. In the first cell of the python notebook, update the value of the `storage_account` variable to the name of the primary account of the workspace. 

2. Update the value of the `container_name` variable to the name of the container in that account that you specified when you created the Synapse workspace.

3. Click the **Publish** button.

## Run the PySpark notebook

In the PySpark notebook, click **Run all**.

It will take a few minutes to start the Spark session and another few minutes to process the inventory reports. The first run could take a while if there are a lot of inventory reports to process. Subsequent runs will only process the new inventory reports created since the last run.

> [!NOTE]
> If you make any changes to the notebook will the notebook is running, make sure to publish those changes by using the **Publish** button.
   
## Visualizing the data


## Common errors

## Next steps

In this tutorial, you learned how to use .NET client libraries to perform client-side encryption for blob upload and download operations.

For a broad overview of client-side encryption for blobs, including instructions for migrating encrypted data to version 2, see [Client-side encryption for blobs](client-side-encryption.md).

For more information about Azure Key Vault, see the [Azure Key Vault overview page](../../key-vault/general/overview.md)