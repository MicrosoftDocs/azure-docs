---
title: Connect to Azure Data Factory 
description: This article describes how to connect Azure Data Factory and Azure Purview to track data lineage.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 03/24/2021
---
# How to connect Azure Data Factory and Azure Purview

This document explains the steps required for connecting an Azure Data Factory account with an Azure Purview account to track data lineage. The document also gets into the details of the coverage scope and supported lineage patterns.

## View existing Data Factory connections

Multiple Azure Data Factories can connect to a single Azure Purview Data Catalog to push lineage information. The current limit allows you to connect up ten Data Factory accounts at a time from the Purview management center. To show the list of Data Factory accounts connected to your Purview Data Catalog, do the following:

1. Select **Management Center** on the left navigation pane.
2. Under **External connections**, select **Data Factory connection**.
3. The Data Factory connection list appears.

    :::image type="content" source="./media/how-to-link-azure-data-factory/data-factory-connection.png" alt-text="Screen shot showing a data factory connection list." lightbox="./media/how-to-link-azure-data-factory/data-factory-connection.png":::

4. Notice the various values for connection **Status**:

    - **Connected**: The data factory is connected to the data catalog.
    - **Disconnected**: The data factory has access to the catalog, but it's connected to another catalog. As a result, data lineage won't be reported to the catalog automatically.
    - **CannotAccess**: The current user doesn't have access to the data factory, so the connection status is unknown.
 >[!Note]
 >To view the Data Factory connections, you need to be assigned any one of Purview roles. Role inheritance from Management group is **not supported**:
 >- Contributor
 >- Owner
 >- Reader
 >- User Access Administrator

## Create new Data Factory connection

>[!Note]
>To add or remove the Data Factory connections, you need to be assigned any one of Purview roles. Role inheritance from Management group is **not supported**:
>- Owner
>- User Access Administrator
>
> Besides, it requires the users to be the data factory’s “Owner”, or “Contributor”. 

Follow the steps below to connect an existing Data Factory accounts to your Purview Data Catalog.

1. Select **Management Center** on the left navigation pane.
2. Under **External connections**, select **Data Factory connection**.
3. On the **Data Factory connection** page, select **New**.

4. Select your Data Factory account from the list and select **OK**. You can also filter by subscription name to limit your list.

    :::image type="content" source="./media/how-to-link-azure-data-factory/connect-data-factory.png" alt-text="Screenshot showing how to connect Azure Data Factory." lightbox="./media/how-to-link-azure-data-factory/connect-data-factory.png":::

    Some Data Factory instances might be disabled if the data factory is already connected to the current Purview account, or the data factory doesn't have a managed identity.

    A warning message will be displayed if any of the selected Data Factories are already connected to other Purview account. By selecting OK, the Data Factory connection with the other Purview account will be disconnected. No additional confirmations are required.


    :::image type="content" source="./media/how-to-link-azure-data-factory/warning-for-disconnect-factory.png" alt-text="Screenshot showing warning to disconnect Azure Data Factory." lightbox="./media/how-to-link-azure-data-factory/warning-for-disconnect-factory.png":::

>[!Note]
>We now support adding no more than 10 Data Factories at once. If you want to add more than 10 Data Factories at once, please file a support ticket.

### How does the authentication work?

When a Purview user registers an Data Factory to which they have access to, the following happens in the backend:

1. The **Data Factory managed identity** gets added to Purview RBAC role: **Purview Data Curator**.

    :::image type="content" source="./media/how-to-link-azure-data-factory/adf-msi.png" alt-text="Screenshot showing Azure Data Factory MSI." lightbox="./media/how-to-link-azure-data-factory/adf-msi.png":::
     
2. The Data Factory pipeline needs to be executed again so that the lineage metadata can be pushed back into Purview.
3. Post execution the Data Factory metadata is pushed into Purview.

### Remove data factory connections
To remove a data factory connection, do the following:

1. On the **Data Factory connection** page, select the **Remove** button next to one or more data factory connections.
2. Select **Confirm** in the popup to delete the selected data factory connections.

    :::image type="content" source="./media/how-to-link-azure-data-factory/remove-data-factory-connection.png" alt-text="Screenshot showing how to select data factories to remove connection." lightbox="./media/how-to-link-azure-data-factory/remove-data-factory-connection.png":::

## Configure a Self-hosted Integration Runtime to collect lineage

Lineage for the Data Factory Copy activity is available for on-premises data stores like SQL databases. If you're running self-hosted integration runtime for the data movement with Azure Data Factory and want to capture lineage in Azure Purview, ensure the version is 5.0 or later. For more information about self-hosted integration runtime, see [Create and configure a self-hosted integration runtime](../data-factory/create-self-hosted-integration-runtime.md).

## Supported Azure Data Factory activities

Azure Purview captures runtime lineage from the following Azure Data Factory activities:

- [Copy Data](../data-factory/copy-activity-overview.md)
- [Data Flow](../data-factory/concepts-data-flow-overview.md)
- [Execute SSIS Package](../data-factory/how-to-invoke-ssis-package-ssis-activity.md)

> [!IMPORTANT]
> Azure Purview drops lineage if the source or destination uses an unsupported data storage system.

The integration between Data Factory and Purview supports only a subset of the data systems that Data Factory supports, as described in the following sections.

### Data Factory Copy activity support

| Data store | Supported | 
| ------------------- | ------------------- | 
| Azure Blob Storage | Yes |
| Azure Cognitive Search | Yes | 
| Azure Cosmos DB (SQL API) \* | Yes | 
| Azure Cosmos DB's API for MongoDB \* | Yes |
| Azure Data Explorer \* | Yes | 
| Azure Data Lake Storage Gen1 | Yes | 
| Azure Data Lake Storage Gen2 | Yes | 
| Azure Database for Maria DB \* | Yes | 
| Azure Database for MySQL \* | Yes | 
| Azure Database for PostgreSQL \* | Yes |
| Azure File Storage | Yes | 
| Azure SQL Database \* | Yes | 
| Azure SQL Managed Instance \* | Yes | 
| Azure Synapse Analytics \* | Yes | 
| Azure Table Storage | Yes |
| Amazon S3 | Yes | 
| Hive \* | Yes | 
| SAP ECC \* | Yes |
| SAP Table | Yes |
| SQL Server \* | Yes | 
| Teradata \* | Yes |

*\* Azure Purview currently doesn't support query or stored procedure for lineage or scanning. Lineage is limited to table and view sources only.*

> [!Note]
> The lineage feature has certain performance overhead in Data Factory copy activity. For those who setup data factory connections in Purview, you may observe certain copy jobs taking longer to complete. Mostly the impact is none to negligible. Please contact support with time comparison if the copy jobs take significantly longer to finish than usual.

#### Known limitations on copy activity lineage

Currently, if you use the following copy activity features, the lineage is not yet supported:

- Copy data into Azure Data Lake Storage Gen1 using Binary format.
- Copy data into Azure Synapse Analytics using PolyBase or COPY statement.
- Compression setting for Binary, delimited text, Excel, JSON, and XML files.
- Source partition options for Azure SQL Database, Azure SQL Managed Instance, Azure Synapse Analytics, SQL Server, and SAP Table.
- Source partition discovery option for file-based stores.
- Copy data to file-based sink with setting of max rows per file.
- Add additional columns during copy.

In additional to lineage, the data asset schema (shown in Asset -> Schema tab) is reported for the following connectors:

- CSV and Parquet files on Azure Blob, Azure File Storage, ADLS Gen1, ADLS Gen2, and Amazon S3
- Azure Data Explorer, Azure SQL Database, Azure SQL Managed Instance, Azure Synapse Analytics, SQL Server, Teradata

### Data Factory Data Flow support

| Data store | Supported |
| ------------------- | ------------------- | 
| Azure Blob Storage | Yes |
| Azure Data Lake Storage Gen1 | Yes |
| Azure Data Lake Storage Gen2 | Yes |
| Azure SQL Database \* | Yes |
| Azure Synapse Analytics \* | Yes |

*\* Azure Purview currently doesn't support query or stored procedure for lineage or scanning. Lineage is limited to table and view sources only.*

### Data Factory Execute SSIS Package support

| Data store | Supported |
| ------------------- | ------------------- |
| Azure Blob Storage | Yes |
| Azure Data Lake Storage Gen1 | Yes |
| Azure Data Lake Storage Gen2 | Yes |
| Azure File Storage | Yes |
| Azure SQL Database \* | Yes |
| Azure SQL Managed Instance \*| Yes |
| Azure Synapse Analytics \* | Yes |
| SQL Server \* | Yes |

*\* Azure Purview currently doesn't support query or stored procedure for lineage or scanning. Lineage is limited to table and view sources only.*

> [!Note]
> Azure Data Lake Storage Gen2 is now generally available. We recommend that you start using it today. For more information, see the [product page](https://azure.microsoft.com/en-us/services/storage/data-lake-storage/).

## Supported lineage patterns

There are several patterns of lineage that Azure Purview supports. The generated lineage data is based on the type of source and sink used in the Data Factory activities. Although Data Factory supports over 80 source and sinks, Azure Purview supports only a subset, as listed in [Supported Azure Data Factory activities](#supported-azure-data-factory-activities).

To configure Data Factory to send lineage information, see [Get started with lineage](catalog-lineage-user-guide.md#get-started-with-lineage).

Some additional ways of finding information in the lineage view, include the following:

- In the **Lineage** tab, hover on shapes to preview additional information about the asset in the tooltip .
- Select the node or edge to see the asset type it belongs or to switch assets.
- Columns of a dataset are displayed in the left side of the **Lineage** tab. For more information about column-level lineage, see [Dataset column lineage](catalog-lineage-user-guide.md#dataset-column-lineage).

### Data lineage for 1:1 operations

The most common pattern for capturing data lineage, is moving data from a single input dataset to a single output dataset, with a process in between.

An example of this pattern would be the following:

- 1 source/input: *Customer* (SQL Table)
- 1 sink/output: *Customer1.csv* (Azure Blob)
- 1 process: *CopyCustomerInfo1\#Customer1.csv* (Data Factory Copy activity)

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-copy-lineage.png" alt-text="Screenshot showing the lineage for a one to one Data Factory Copy operation." lightbox="./media/how-to-link-azure-data-factory/adf-copy-lineage.png":::

### Data movement with 1:1 lineage and wildcard support

Another common scenario for capturing lineage, is using a wildcard to copy files from a single input dataset to a single output dataset. The wildcard allows the copy activity to match multiple files for copying using a common portion of the file name. Azure Purview captures file-level lineage for each individual file copied by the corresponding copy activity.

An example of this pattern would be the following:

* Source/input: *CustomerCall\*.csv* (ADLS Gen2 path)
* Sink/output: *CustomerCall\*.csv* (Azure blob file)
* 1 process: *CopyGen2ToBlob\#CustomerCall.csv* (Data Factory Copy activity)  

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-copy-lineage-wildcard.png" alt-text="Screenshot showing lineage for a one to one Copy operation with wildcard support." lightbox="./media/how-to-link-azure-data-factory/adf-copy-lineage-wildcard.png":::

### Data movement with n:1 lineage

You can use Data Flow activities to perform data operations like merge, join, and so on. More than one source dataset can be used to produce a target dataset. In this example, Azure Purview captures file-level lineage for individual input files to a SQL table that is part of a Data Flow activity.

An example of this pattern would be the following:

* 2 sources/inputs: *Customer.csv*, *Sales.parquet* (ADLS Gen2 Path)
* 1 sink/output: *Company data* (Azure SQL table)
* 1 process: *DataFlowBlobsToSQL* (Data Factory Data Flow activity)

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-data-flow-lineage.png" alt-text="Screenshot showing the lineage for an n to one A D F Data Flow operation." lightbox="./media/how-to-link-azure-data-factory/adf-data-flow-lineage.png":::

### Lineage for resource sets

A resource set is a logical object in the catalog that represents many partition files in the underlying storage. For more information, see [Understanding Resource sets](concept-resource-sets.md). When Azure Purview captures lineage from the Azure Data Factory, it applies the rules to normalize the individual partition files and create a single logical object.

In the following example, an Azure Data Lake Gen2 resource set is produced from an Azure Blob:

* 1 source/input: *Employee\_management.csv* (Azure Blob)
* 1 sink/output: *Employee\_management.csv* (Azure Data Lake Gen 2)
* 1 process: *CopyBlobToAdlsGen2\_RS* (Data Factory Copy activity)

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-resource-set-lineage.png" alt-text="Screenshot showing the lineage for a resource set." lightbox="./media/how-to-link-azure-data-factory/adf-resource-set-lineage.png":::

## Next steps

- [Catalog lineage user guide](catalog-lineage-user-guide.md)
- [Link to Azure Data Share for lineage](how-to-link-azure-data-share.md)
