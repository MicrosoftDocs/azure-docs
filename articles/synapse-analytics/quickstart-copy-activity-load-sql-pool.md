---
title: A quickstart to ingest data into SQL pool using Copy activity
description: Use Azure Data Factory to ingest data into SQL pool
services: data-factory
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 10/29/2020
---

# Quickstart: Ingest data into SQL pool using Copy activity


Azure Synapse Analytics offers various analytics engines to help you ingest, transform, model, and analyze your data. A SQL pool offers T-SQL based compute and storage capabilities. After creating a SQL pool in your Synapse workspace, data can be loaded, modeled, processed, and delivered for faster analytic insight.

In this quickstart, you learn how to _load data from Azure SQL Database into Azure Synapse Analytics_. You can follow similar steps to copy data from other types of data stores.

## Prerequisites

* Azure subscription: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* Azure Synapse workspace: Create a Synapse workspace using the Azure portal following the instructions in [Quickstart: Create a Synapse workspace](quickstart-create-workspace.md).
* Azure SQL Database: This tutorial copies data from the Adventure Works LT sample dataset in Azure SQL Database . You can create this sample database in SQL Database by following the instructions in [Create a sample database in Azure SQL Database](../azure-sql/database/single-database-create-quickstart.md).
* Azure storage account: Azure Storage is used as the _staging_ blob in the bulk copy operation. If you don't have an Azure storage account, see the instructions in [Create a storage account](../storage/common/storage-account-create.md).
* Azure Synapse Analytics: You use a SQL pool as a sink data store. If you don't have an Azure Synapse Analytics instance, see [Create a SQL pool](quickstart-create-sql-pool-portal.md) for steps to create one.


### Navigate to the Synapse workspace

1. Open [Azure Synapse Analytics](https://web.azuresynapse.net/).

1. Specify your Azure Active Directory and Subscription, under Workspace name, select your Azure Synapse workspace from the dropdown list. 

1. On the Synapse Studio home page, navigate to the Management Hub in the left navigation by selecting the Manage icon. 

    ![Synapse Studio home page](media/doc-common-process/synapse-studio-home.png)

## Load data into Azure Synapse Analytics

1. In the **Get started** page, select the **Copy Data** tile to launch the Copy Data tool.

2. In the **Properties** page, specify **CopyFromSQLToSQLDW** for the **Task name** field, and select **Next**.

    ![Properties page](./media/load-azure-sql-data-warehouse/copy-data-tool-properties-page.png)

3. In the **Source data store** page, complete the following steps:
    >[!TIP]
    >In this tutorial, you use *SQL authentication* as the authentication type for your source data store, but you can choose other supported authentication methods:*Service Principal* and *Managed Identity* if needed. Refer to corresponding sections in [this article](./connector-azure-sql-database.md#linked-service-properties) for details.
    >To store secrets for data stores securely, it's also recommended to use an Azure Key Vault. Refer to [this article](./store-credentials-in-key-vault.md) for detailed illustrations.

    a. click **+ Create new connection**.

    b. Select **Azure SQL Database** from the gallery, and select **Continue**. You can type "SQL" in the search box to filter the connectors.

    ![Select Azure SQL DB](./media/load-azure-sql-data-warehouse/select-azure-sql-db-source.png)

    c. In the **New Linked Service** page, select your server name and DB name from the dropdown list, and specify the username and password. Click **Test connection** to validate the settings, then select **Create**.

    ![Configure Azure SQL DB](./media/load-azure-sql-data-warehouse/configure-azure-sql-db.png)

    d. Select the newly created linked service as source, then click **Next**.

4. In the **Select tables from which to copy the data or use a custom query** page, enter **SalesLT** to filter the tables. Choose the **(Select all)** box to use all of the tables for the copy, and then select **Next**.

    ![Select source tables](./media/load-azure-sql-data-warehouse/select-source-tables.png)

5. In the **Apply filter** page, specify your settings or select **Next**.

6. In the **Destination data store** page, complete the following steps:
    >[!TIP]
    >In this tutorial, you use *SQL authentication* as the authentication type for your destination data store, but you can choose other supported authentication methods:*Service Principal* and *Managed Identity* if needed. Refer to corresponding sections in [this article](./connector-azure-sql-data-warehouse.md#linked-service-properties) for details.
    >To store secrets for data stores securely, it's also recommended to use an Azure Key Vault. Refer to [this article](./store-credentials-in-key-vault.md) for detailed illustrations.

    a. Click **+ Create new connection** to add a connection

    b. Select **Azure Synapse Analytics (formerly SQL Data Warehouse)** from the gallery, and select **Continue**. You can type "SQL" in the search box to filter the connectors.

    ![Select Azure Synapse Analytics](./media/load-azure-sql-data-warehouse/select-azure-sql-dw-sink.png)

    c. In the **New Linked Service** page, select your server name and DB name from the dropdown list, and specify the username and password. Click **Test connection** to validate the settings, then select **Create**.

    ![Configure Azure Synapse Analytics](./media/load-azure-sql-data-warehouse/configure-azure-sql-dw.png)

    d. Select the newly created linked service as sink, then click **Next**.

7. In the **Table mapping** page, review the content, and select **Next**. An intelligent table mapping displays. The source tables are mapped to the destination tables based on the table names. If a source table doesn't exist in the destination, Azure Data Factory creates a destination table with the same name by default. You can also map a source table to an existing destination table.

   > [!NOTE]
   > Automatic table creation for the Azure Synapse Analytics sink applies when SQL Server or Azure SQL Database is the source. If you copy data from another source data store, you need to pre-create the schema in the sink Azure Synapse Analytics before executing the data copy.

   ![Table mapping page](./media/load-azure-sql-data-warehouse/table-mapping.png)

8. In the **Column mapping** page, review the content, and select **Next**. The intelligent table mapping is based on the column name. If you let Data Factory automatically create the tables, data type conversion can occur when there are incompatibilities between the source and destination stores. If there's an unsupported data type conversion between the source and destination column, you see an error message next to the corresponding table.

    ![Column mapping page](./media/load-azure-sql-data-warehouse/schema-mapping.png)

9. In the **Settings** page, complete the following steps:

    a. In **Staging settings** section, click **+ New** to new a staging storage. The storage is used for staging the data before it loads into Azure Synapse Analytics by using PolyBase. After the copy is complete, the interim data in Azure Blob Storage is automatically cleaned up.

    b. In the **New Linked Service** page, select your storage account, and select **Create** to deploy the linked service.

    c. In the **Advanced settings** section, deselect the **Use type default** option, then select **Next**.

    ![Configure PolyBase](./media/load-azure-sql-data-warehouse/configure-polybase.png)

10. In the **Summary** page, review the settings, and select **Next**.

    ![Summary page](./media/load-azure-sql-data-warehouse/summary-page.png)

11. On the **Deployment page**, select **Monitor** to monitor the pipeline (task). 
 
12. Notice that the **Monitor** tab on the left is automatically selected. When the pipeline run completes successfully, select the **CopyFromSQLToSQLDW** link under the **PIPELINE NAME** column to view activity run details or to rerun the pipeline.

    [![Monitor pipeline runs](./media/load-azure-sql-data-warehouse/pipeline-monitoring.png)](./media/load-azure-sql-data-warehouse/pipeline-monitoring.png#lightbox)

13. To switch back to the pipeline runs view, select the **All pipeline runs** link at the top. Select **Refresh** to refresh the list.

    ![Monitor activity runs](./media/load-azure-sql-data-warehouse/activity-monitoring.png)

14. To monitor the execution details for each copy activity, select the **Details** link (eyeglasses icon) under **ACTIVITY NAME** in the activity runs view. You can monitor details like the volume of data copied from the source to the sink, data throughput, execution steps with corresponding duration, and used configurations.
    ![Monitor activity run details first](./media/load-azure-sql-data-warehouse/monitor-activity-run-details-1.png)

    ![Monitor activity run details second](./media/load-azure-sql-data-warehouse/monitor-activity-run-details-2.png)

## Next steps

Advance to the following article to learn about Azure Synapse Analytics support:

> [!div class="nextstepaction"]
>[Azure Synapse Analytics connector](connector-azure-sql-data-warehouse.md)