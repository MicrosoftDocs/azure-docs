---
title: How to link Azure Data Factory account with Purview
description: This article provides an overview  to link Data Factory with Azure Purview for lineage.
author: chanuengg
ms.author: csugunan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 11/22/2020
---

# How to link Azure Data Factory account with Purview
This document explains the steps required for connecting a Data Factory account with a Purview account to collect lineage. The document also gets into the details of the coverage scope and supported lineage patterns.

## Connect to Azure Data Factory from management center

 Follow below instructions to connect Azure Data Factory with Azure Purview for lineage reporting. This configuration is a one-time step to start ingesting lineage from Data Factory into Azure Purview. 

### View Data Factory connections

More than one Data Factory at a time can connect to a catalog and push lineage information.

To show the list of Data Factory accounts connected to your catalog:

1. Select **Management Center** on the left navigation pane

1. From the left pane, select **Data factory connection** under "External connections" section

    The Data Factory connection list appears.

    :::image type="content" source="./media/how-to-link-azure-data-factory/data-factory-connection.png" alt-text="Screen shot showing a data factory connection list." lightbox="./media/how-to-link-azure-data-factory/data-factory-connection.png":::

    The **Status** values are:

    - **Connected**: The data factory is connected to the data catalog.
    - **Disconnected**: The data factory has access to the catalog, but it's connected to another catalog. As a result, data lineage won't be reported to the catalog automatically.
    - **CannotAccess**: The current user doesn't have access to the data factory, so the connection status is unknown.

### New Data Factory connection

Follow below steps to connect existing Data Factory accounts to Purview

1. From the **Data Factory connection** page, select **New**.

1. Select Data Factory account from the list and select OK. You can also filter by subscription name to limit your list.

   :::image type="content" source="./media/how-to-link-azure-data-factory/connect-data-factory.png" alt-text="Screenshot showing how to connect Azure Data Factory." lightbox="./media/how-to-link-azure-data-factory/connect-data-factory.png":::

 >[!Note]
 >   Some Data Factory might be disabled if:
 >   - The data factory is already connected to the current Purview account.
 >   - The data factory doesn't have managed identity.
> 
>    By default, the current limit is to connect up 10 Data Factory accounts at a time from the Purview management center. 

 >[!Note]
 >   A warning message will be displayed if any of the selected Data Factories are already connected to other Purview account.
>
> By selecting OK, the Data Factory connection with the other Purview account will be disconnected. No additional confirmations are requied.


   :::image type="content" source="./media/how-to-link-azure-data-factory/warning-for-disconnect-factory.png" alt-text="Screenshot showing warning to disconnect Azure Data Factory." lightbox="./media/how-to-link-azure-data-factory/warning-for-disconnect-factory.png":::

### Remove data factory connections

To remove a data factory connection:

1. Select the **remove** button next to one or more data factory connections.
1. Select **confirm** in the popup to delete the selected data factory connections.

    :::image type="content" source="./media/how-to-link-azure-data-factory/remove-data-factory-connection.png" alt-text="Screenshot showing how to select data factories to remove connection." lightbox="./media/how-to-link-azure-data-factory/remove-data-factory-connection.png":::


## Configure self-hosted IR to collect lineage from on-prem SQL

Lineage for the Data Factory Copy activity is available for on-premises SQL databases. If you're running self-hosted integration runtime for the data movement with Azure Data Factory and want to capture lineage in Azure Purview, ensure the version is 4.8.7418.1 or later. For more information about self-hosted integration runtime, see [Create and configure a self-hosted integration runtime](https://docs.microsoft.com/azure/data-factory/create-self-hosted-integration-runtime).

## Supported Azure Data Factory activities

Azure Purview captures runtime lineage from the following Azure Data Factory activities:

* Copy Data

* Data Flow

* Execute SSIS Package

> [!IMPORTANT]
> Azure Purview drops lineage if the source or destination uses an unsupported data storage system.

Azure Purview/Data Factory native integration supports only a subset of the data systems that Data Factory supports, as described in the following sections.

### Data Factory Copy Data support

| Data storage system | Supported as source | Supported as sink |
| ------------------- | ------------------- | ----------------- |
| ADLS Gen1 (no JSON support) | Yes | Yes (non-binary copy only) |
| ADLS Gen2 (no JSON support) | Yes | Yes |
| Azure Blob (no JSON support) | Yes | Yes |
| Azure Cosmos DB (SQL API) | Yes | Yes |
| Azure Cosmos DB (Mongo API) | Yes | Yes |
| Azure Cognitive Search | Yes | Yes |
| Azure Data Explorer | Yes | Yes |
| Azure Database for Maria DB \* | Yes | Yes |
| Azure Database for MYSQL \* | Yes | Yes |
| Azure Database for PostgreSQL \* | Yes | Yes |
| Azure File Storage | Yes | Yes |
| Azure Table Storage | Yes | Yes |
| Azure SQL Database \* | Yes | Yes |
| Azure SQL MI \* | Yes | Yes |
| Azure Synapse Analytics(formerly SQL DW) \* | Yes | Yes |
| SQL Server On-prem (SHIR required) \* | Yes | Yes |
| Amazon S3 | Yes | Yes |
| Teradata | Yes | Yes |
| SAP s4 Hana | Yes | Yes |
| SAP ECC | Yes | Yes |
| Hive | Yes | Yes |

> [!Note]
>Lineage feature has certain perf overhead in Data Factory copy activity. For those who setup data factory connections in Purview, you may observe certain copy jobs taking longer time to complete. Mostly the impact is none to negligible. Please contact support with time comparison if the copy jobs taking significantly long time to finish than usual.

### Data Factory Data Flow support

| Data storage system | Supported |
| ------------------- | ------------------- | ----------------- |
| ADLS Gen1 | Yes |
| ADLS Gen2 | Yes |
| Azure Blob | Yes |
| Azure SQL Database \* | Yes |
| Azure Synapse Analytics(formerly SQL DW) \* | Yes |

### Data Factory Execute SSIS Package support

| Data storage system | Supported |
| ------------------- | ------------------- | ----------------- |
| Azure Blob | Yes |
| ADLS Gen1 | Yes |
| ADLS Gen2 | Yes |
| Azure SQL DB/Managed Instance/DW \* | Yes |
| On-premises SQL \* | Yes |
| Azure Files | Yes |

*\* For SQL (Azure and on-premises) scenarios, Azure Purview doesn't support stored procedures or scripts for lineage or scanning. Lineage is limited to table and view sources only.*

> [!Note]
> Azure Data Lake Storage Gen2 is now generally available. We recommend that you start using it today. For more information, see the [product page](https://azure.microsoft.com/en-us/services/storage/data-lake-storage/).

## Supported lineage patterns

There are several patterns of lineage that Azure Purview supports. The generated lineage data is based on the type of source and sink used in the Data Factory activities. Although Data Factory supports over 80 source/sinks, Azure Purview supports only a subset, as listed in [Supported Azure Data Factory activities](#supported-azure-data-factory-activities).
To configure Data Factory to send lineage, see [Get started with lineage](catalog-lineage-user-guide.md#get-started-with-lineage).

> [!Note]
> 1.  In the **Lineage** tab, hover on shapes to preview additional information  about the asset in the tooltip .
> 1.  Select the node or edge to see the asset type it belongs or to switch assets.
> 1.  Columns of a Dataset is displayed in the left side of lineage tab. For more information about column-level lineage, see [Column-level lineage](catalog-lineage-user-guide.md#column-level-lineage).

### Data lineage for one input <\-\> one output

The most common pattern that capture lineage for the data movement is from one input dataset to one output dataset, with a process in between.

The following screenshot shows the representation of this pattern. Examples: Lineage of SQL table -\> SQL table

* 1 source/input: *Customer* (SQL Table)

* 1 sink/output: *Customer1.csv* (Azure Blob)

* 1 process: *CopyCustomerInfo1\#Customer1.csv* (Data Factory Copy activity)

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-copy-lineage.png" alt-text="Screenshot showing the lineage for a one to one Data Factory Copy operation." lightbox="./media/how-to-link-azure-data-factory/adf-copy-lineage.png":::

### Data movement with 1:1 lineage and wildcard support

The scenario is about the data movement from Blob storage to Data Lake storage using Data Factory Copy activity with wildcard support. Wildcard configuration can be used in Copy activity to copy multiple files at once. Azure Purview captures file-level lineage for each individual file copied by the corresponding copy activity.

Lineage of Azure Blob/ADLS Gen1/Gen2 -\> Azure Blob/ADLS Gen1/Gen2 file(s):

* Source/input: *CustomerCall\*.csv* (ADLS Gen2 path)

* Sink/output: *CustomerCall\*.csv* (Azure blob file)

* 1 process: *CopyGen2ToBlob\#CustomerCall.csv* (Data Factory Copy activity)  

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-copy-lineage-wildcard.png" alt-text="Screenshot showing lineage for a one to one Copy operation with wildcard support." lightbox="./media/how-to-link-azure-data-factory/adf-copy-lineage-wildcard.png":::

### Data movement with n:1 lineage

You can use Data Flow activities to perform data operations like merge, join, and so on. More than one source dataset can be used to produce a target dataset. In this example, Azure Purview captures file-level lineage for individual input files to a SQL table that is part of a Data Flow activity.

Lineage of Azure Blob/ADLS Gen1/Gen2 -\> SQL table:

* 2 sources/inputs: *Customer.csv*, *Sales.parquet* (ADLS Gen2 Path)

* 1 sink/output: *Company data* (Azure SQL table)

* 1 process: *DataFlowBlobsToSQL* (Data Factory Data Flow activity)

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-data-flow-lineage.png" alt-text="Screenshot showing the lineage for an n to one A D F Data Flow operation." lightbox="./media/how-to-link-azure-data-factory/adf-data-flow-lineage.png":::

> [!Note]
> Azure Data Lake Storage Gen2 is now generally available. We recommend that you start using it today. For more information, see the [product page](https://azure.microsoft.com/en-us/services/storage/data-lake-storage/).
### Lineage for resource sets

A resource set is a logical object in the catalog that represents many partition files in the underlying storage. For more information, see [Understanding Resource sets](concept-resource-sets.md). When Azure Purview captures lineage from the Azure Data Factory, it applies the rules to normalize the individual partition files and create a single logical object.

In the following example, an Azure Data Lake Gen2 resource set is produced from an Azure Blob:

* 1 source/input: *Employee\_management.csv* (Azure Blob)

* 1 sink/output: *Employee\_management.csv* (Azure Data Lake Gen 2)

* 1 process: *CopyBlobToAdlsGen2\_RS* (Data Factory Copy activity)

:::image type="content" source="./media/how-to-link-azure-data-factory/adf-resource-set-lineage.png" alt-text="Screenshot showing the lineage for a resource set." lightbox="./media/how-to-link-azure-data-factory/adf-resource-set-lineage.png":::



## Next steps

> [!div class="nextstepaction"]
> [Link to Azure Data Share for lineage](how-to-link-azure-data-share.md)