---
title: Catalog lineage user guide
description: This article provides an overview of the catalog lineage feature of Azure Purview.
author: chanuengg
ms.author: csugunan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/07/2020
---

# Catalog lineage user guide

One of the primary features of Azure Purview is the ability to show the lineage between datasets, based on its integration with Azure Data Factory (ADF). Azure Purview supports capturing data lineage from the ADF activities Copy Data, Data Flow, and Execute SSIS Package. In addition to the native integration, custom lineage reporting is also supported via Atlas hooks and REST API.

## Common scenarios

Lineage in Azure Purview is aimed to support root cause analysis and impact analysis scenarios for data producers and data consumers.

### Root cause analysis

Data engineers own data sources within a data estate. In situations when a data source has incorrect data because of upstream issues, data engineers can use Azure Purview lineage as a centralized platform to understand upstream process failures and be informed about the reasons for their data sources discrepancy.

### Impact analysis

If data producers want to change the attributes of a data source they own, such as deprecating columns, they'll want to know who's affected. They can use Azure Purview lineage as a centralized place to know all the downstream consumers of their data sources and understand the impact of these changes on downstream assets.

## Configure catalog to collect ADF lineage

This section explains the configuration steps required to report lineage in Azure Purview for ADF pipelines at execution time. For instructions about how to connect Azure Data Factory with Azure Purview and configure lineage reporting, see [Connect to Azure Data Factory](catalog-client-overview.md#connect-to-azure-data-factory). This configuration is a one-time step to start ingesting lineage from ADF into Azure Purview.

Lineage for the ADF Copy activity is available for on-premises SQL databases. If you're running self-hosted integration runtime for the data movement with Azure Data Factory and want to capture lineage in Azure Purview, ensure the version is 4.8.7418.1 or later. For more information about self-hosted integration runtime, see [Create and configure a self-hosted integration runtime](https://docs.microsoft.com/azure/data-factory/create-self-hosted-integration-runtime).

## Supported Azure Data Factory activities

Azure Purview captures runtime lineage from the following Azure Data Factory activities:

* Copy Data

* Data Flow

* Execute SSIS Package

> [!IMPORTANT]
> Azure Purview drops lineage if the source or destination uses an unsupported data storage system.

Azure Purview/ADF native integration supports only a subset of the data systems that ADF supports, as described in the following sections.

### ADF Copy Data support

| Data storage system | Supported as source | Supported as sink |
| ------------------- | ------------------- | ----------------- |
| Azure Blob (no JSON support) | Yes | Yes |
| ADLS Gen1 (no JSON support) | Yes | Yes (non-binary copy only) |
| ADLS Gen2 (no JSON support) | Yes | Yes |
| Azure SQL DB/DW \* | Yes | Yes |
| On-premises SQL (SHIR required) \* | Yes | Yes |
| ADX | Yes | Yes |

### ADF Data Flow support

| Data storage system | Supported |
| ------------------- | ------------------- | ----------------- |
| Azure Blob | Yes |
| ADLS Gen1 | Yes |
| ADLS Gen2 | Yes |
| Azure SQL DB/DW \* | Yes |
| On-premises SQL (SHIR required) \* | Yes |
| ADX | Yes |

### ADF Execute SSIS Package support

| Data storage system | Supported |
| ------------------- | ------------------- | ----------------- |
| Azure Blob | Yes |
| ADLS Gen1 | Yes |
| ADLS Gen2 | Yes |
| Azure SQL DB/Managed Instance/DW \* | Yes |
| On-premises SQL \* | Yes |
| Azure Files | Yes |

\* For SQL (Azure and on-premises) scenarios, Azure Purview doesn't support stored procedures or scripts for lineage or scanning. Lineage is limited to table and view sources only.

## Get started with lineage

Lineage uses the following terminology:

* Source/Input (Node):
   A dataset (structured or unstructured) provided as an input to a process. For example, SQL Table, Azure blob, and files (such as .csv and .xml). In the lineage screenshots that follow, these datasets are represented by rectangular boxes to the left of the round-edged boxes representing processes.

* Process (Edge): A unit of activity or transformation where an action is performed on the source/input. For example, ADF Copy activity. In the lineage screenshots that follow, these processes are represented by round-edged boxes.

* Sink/Output (Node): A dataset, structured or unstructured, produced as an output from the process. For example, SQL Table, Azure blob, and files (such as .csv and .xml). In the lineage screenshots that follow, these nodes are represented by rectangular boxes to the right of the round-edged boxes representing processes.

Follow these steps to access the lineage information of an asset:

1. In the Azure portal, go to the [Azure Purview accounts page](https://aka.ms/babylonportal).

1. Select your Azure Purview account from the list, and then select **Launch purview account** from the **Overview** page.

1. On the Azure Purview **Home** page, search for a data asset. In the **Search catalog** box, enter the name of the input used in the ADF Copy or Data Flow activity and press Enter.

1. From the search results, select the data asset and select its **Lineage** tab.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-lineage-from-asset.png" alt-text="Screenshot showing how to select the Lineage tab." lightbox="./media/catalog-lineage-user-guide/select-lineage-from-asset.png":::

## Supported lineage patterns for ADF activities

The generated lineage data is based on the type of source and sink used in the ADF activities. Although ADF supports over 80 source/sinks, Azure Purview supports only a subset, as listed in [Supported Azure Data Factory activities](#supported-azure-data-factory-activities).
To configure ADF to send lineage, see [Get started with lineage](#get-started-with-lineage).

There are several patterns of lineage that Azure Purview captures, described as follows:

* In the **Lineage** tab, hover over the node or edge to get information about the asset's taxonomy, like asset type.

* Select the node or edge to show additional metadata like business glossary annotations, column count, and so on.

* Select **View Columns** in the data asset to see its list of columns. For more information about column-level lineage, see [Column-level lineage](#column-level-lineage).

### Data movement with 1:1 lineage

This pattern applies to all ADF Copy activities that capture lineage for the data movement from one input dataset to one output dataset, with a process in between. The ADF operation ingests three assets in the catalog.

Lineage of SQL table -\> SQL table; SQL table -\> Azure blob/ADLS Gen1/ADLS Gen2:

* 1 source/input: *Customer* (SQL Table)

* 1 sink/output: *Customer1.csv* (Azure Blob)

* 1 process: *CopyCustomerInfo1\#Customer1.csv* (ADF Copy activity)

:::image type="content" source="./media/catalog-lineage-user-guide/lineage-adf-copy.png" alt-text="Screenshot showing the lineage for a one to one A D F Copy operation.":::

### Data movement with 1:1 lineage and wildcard support

In this scenario, data is moved from Azure Blob storage to Azure Data Lake storage using an ADF Copy activity with wildcard support. When you use a wildcard in the ADF Copy activity to copy multiple files together, Azure Purview captures file-level lineage for each individual file that's copied by the ADF copy activity.

Lineage of Azure Blob/ADLS Gen1/Gen2 -\> Azure Blob/ADLS Gen1/Gen2 file(s):

* Source/input: *CustomerCall\*.csv* (ADLS Gen2 path)

* Sink/output: *CustomerCall\*.csv* (Azure blob file)

* 1 process: *CopyGen2ToBlob\#CustomerCall.csv* (ADF Copy activity)  

:::image type="content" source="./media/catalog-lineage-user-guide/lineage-adf-copy-wildcard.png" alt-text="Screenshot showing the lineage for a one to one A D F Copy operation with wildcard support." lightbox="./media/catalog-lineage-user-guide/lineage-adf-copy-wildcard.png":::

### Data movement with n:1 lineage

You can use ADF Data Flow activities to merge or join more than one source dataset to produce a target dataset. In this example, Azure Purview captures file-level lineage for individual input files that are part of an ADF Data Flow activity flowing into a SQL table.

Lineage of Azure Blob/ADLS Gen1/Gen2 -\> SQL table:

* 2 sources/inputs: *Customer.csv*, *Sales.parquet* (ADLS Gen2 Path)

* 1 sink/output: *Companydata* (Azure SQL table)

* 1 process: *DataFlowBlobsToSQL* (ADF Data Flow activity)

:::image type="content" source="./media/catalog-lineage-user-guide/lineage-adf-data-flow.png" alt-text="Screenshot showing the lineage for an n to one A D F Data Flow operation.":::

### Lineage for resource sets

A resource set is a logical object in the catalog that represents many partition files in the underlying storage. For more information, see [Resource sets in Azure Data Catalog](concept-resource-sets.md). When Azure Purview captures lineage from the Azure Data Factory, it applies the rules to normalize the individual partition files and create a single logical object.

In the following example, an Azure Data Lake Gen2 resource set is produced from an Azure Blob:

* 1 source/input: *Employee\_management.csv* (Azure Blob)

* 1 sink/output: *Employee\_management.csv* (Azure Data Lake Gen 2)

* 1 process: *CopyBlobToAdlsGen2\_RS* (ADF Copy activity)

:::image type="content" source="./media/catalog-lineage-user-guide/lineage-adf-resource-set.png" alt-text="Screenshot showing the lineage for a resource set." lightbox="./media/catalog-lineage-user-guide/lineage-adf-resource-set.png":::

## Column-level lineage

Azure Purview supports column-level lineage for the ADF Copy and ADF Data Flow activities. To see column-level lineage, go to the **Lineage** tab of the current asset in the catalog and follow these steps:

1. Select the current data asset node to expand it, and then select **View columns**.

   The list of columns belonging to the data node appears in a list in the left pane.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-view-columns-from-lineage.png" alt-text="Screenshot showing how to select View columns in the lineage page." lightbox="./media/catalog-lineage-user-guide/select-view-columns-from-lineage.png":::

1. In the left pane, select the check box next to each column you want to display in the data lineage.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-columns-to-show-in-lineage.png" alt-text="Screenshot showing how to select columns to display in the lineage page." lightbox="./media/catalog-lineage-user-guide/select-columns-to-show-in-lineage.png":::

1. Hover over a selected column on the left pane or in a data asset node in the lineage canvas to see the column flow in the data lineage path. All the column instances are highlighted.

   :::image type="content" source="./media/catalog-lineage-user-guide/show-column-flow-in-lineage.png" alt-text="Screenshot showing how to hover over a column name to highlight the column flow in a data lineage path." lightbox="./media/catalog-lineage-user-guide/show-column-flow-in-lineage.png":::

1. If the number of columns is larger than can be displayed in the left pane, use the filter option to select a specific column by name. Alternatively, you can use your mouse to scroll through the list.

   :::image type="content" source="./media/catalog-lineage-user-guide/filter-columns-by-name.png" alt-text="Screenshot showing how to filter columns by column name on the lineage page.":::

1. If the lineage canvas contains more nodes and edges, use the filter to select data asset or process nodes by name. Alternatively, you can use your mouse to pan around the lineage window.

   :::image type="content" source="./media/catalog-lineage-user-guide/filter-assets-by-name.png" alt-text="Screenshot showing how to filter data asset nodes by name on the lineage page.":::

1. Use the toggle in the left pane to filter the list of nodes in the lineage canvas. If you turn off the toggle, any asset that contains at least one of the selected columns is displayed. If you turn on the toggle, only assets that contain all of the assets are displayed.

   :::image type="content" source="./media/catalog-lineage-user-guide/use-toggle-to-filter-nodes.png" alt-text="Screenshot showing how to use the toggle to filter the list of nodes on the lineage page.":::

1. Select **Switch to asset** in the data node to view another data asset from the lineage view. Doing so is an effective way to browse to another asset in the catalog from the lineage view.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-switch-to-asset.png" alt-text="Screenshot how to select Switch to asset in a lineage data asset." lightbox="./media/catalog-lineage-user-guide/select-switch-to-asset.png":::

1. Use the smart buttons in the lineage canvas to get an optimal view of the lineage. Auto layout, zoom to fit, zoom in/out, full screen, and navigation map are available for an immersive lineage experience in the catalog.

   :::image type="content" source="./media/catalog-lineage-user-guide/use-lineage-smart-buttons.png" alt-text="Screenshot showing how to select the lineage smart buttons." lightbox="./media/catalog-lineage-user-guide/use-lineage-smart-buttons.png":::
