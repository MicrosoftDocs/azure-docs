---
title: Catalog lineage user guide
description: This article provides an overview of the catalog lineage feature of Azure Babylon.
author: chanuengg
ms.author: csugunan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 10/06/2020
---

# Catalog lineage user guide

One of the primary features of Azure Babylon is the ability to show the lineage between datasets, based on its integration with Azure Data Factory (ADF). Azure Babylon supports capturing data lineage from the ADF activities Copy data, Data Flow, and Execute SSIS Package. In addition to the native integration, custom lineage reporting is also supported via Atlas hooks and REST API.

## Common scenarios

Lineage in Azure Babylon is aimed to support root cause analysis and impact analysis scenarios for data producers and data consumers.

### Root cause analysis

Data engineers own data sources within a data estate. In situations when a data source has incorrect data because of upstream issues, data engineers can use Azure Babylon lineage as a centralized platform to understand upstream process failures and be informed about the reasons for their data sources discrepancy.

### Impact analysis

If data producers want to change the attributes of a data source they own, such as deprecating columns, they'll want to know who's affected. They can use Azure Babylon lineage as a centralized place to know all the downstream consumers of their data sources and understand the impact of these changes on downstream assets.

## Configure the catalog to collect lineage from Azure Data Factory

This section explains the configuration steps required to report lineage in Azure Babylon at the execution time of ADF pipelines. For instructions about how to connect Azure Data Factory and Azure Babylon see [Connection to Azure Data Factory](catalog-client-overview.md#connection-to-azure-data-factory-adf). Follow these instructions to configure lineage reporting. This configuration is a one-time step to start ingesting lineage from ADF into Azure Babylon.

Lineage for the ADF Copy activity is available for on-prem SQL databases. If you're running self-hosted integration runtime for the data movement with Azure Data Factory and want to capture lineage in Azure Babylon, ensure the version is 4.8.7418.1 or later. For more information about self-hosted integration runtime, see [Create and configure a self-hosted integration runtime](https://docs.microsoft.com/azure/data-factory/create-self-hosted-integration-runtime).

To collect lineage from an [Execute SSIS Package activity](https://docs.microsoft.com/azure/data-factory/how-to-invoke-ssis-package-ssis-activity), enable **Logging level** as **Verbose** on the **Settings** tab for the Execute SSIS Package activity.

## Supported Azure Data Factory activities

Azure Babylon captures runtime lineage from the following Azure Data Factory activities:

* Copy Data

* Data Flow

* Execute SSIS Package

> [!IMPORTANT]
> Azure Babylon drops lineage if the source or destination uses an unsupported data storage system.

### ADF Copy Data support

Although Azure Data Factory supports several Azure, on-prem, and multi cloud data systems as sources and sinks, the Azure Babylon/ADF native integration supports only a subset, as follows:

<table>
<thead>
<tr class="header">
<th>Data storage system</th>
<th>Supported as source</th>
<th>Supported as sink</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>Azure Blob</p>
<p>(no JSON support)</p></td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr class="even">
<td><p>ADLS Gen1</p>
<p>(no JSON support)</p></td>
<td>Yes</td>
<td>Yes (Non-binary copy only)</td>
</tr>
<tr class="odd">
<td><p>ADLS Gen2</p>
<p>(no JSON support)</p></td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr class="even">
<td>Azure SQL DB/DW</td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr class="odd">
<td>On-prem SQL (SHIR required)</td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr class="even">
<td>ADX</td>
<td>Yes</td>
<td>Yes</td>
</tr>
</tbody>
</table>

### ADF Data Flow support

<table>
<thead>
<tr class="header">
<th>Data storage system</th>
<th>Supported</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Azure Blob</td>
<td>Yes</td>
</tr>
<tr class="even">
<td>ADLS Gen1</td>
<td>Yes</td>
</tr>
<tr class="odd">
<td>ADLS Gen2</td>
<td>Yes</td>
</tr>
<tr class="even">
<td>Azure SQL DB/DW</td>
<td>Yes</td>
</tr>
<tr class="odd">
<td>On-prem SQL(SHIR required)</td>
<td>Yes</td>
</tr>
<tr class="even">
<td>ADX</td>
<td>Yes</td>
</tr>
</tbody>
</table>

### ADF Execute SSIS Package support

<table>
<thead>
<tr class="header">
<th>Data storage system</th>
<th>Supported</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Azure Blob</td>
<td>Yes</td>
</tr>
<tr class="even">
<td>ADLS Gen1</td>
<td>Yes</td>
</tr>
<tr class="odd">
<td>ADLS Gen2</td>
<td>Yes</td>
</tr>
<tr class="even">
<td>Azure SQL DB/Managed Instance/DW</td>
<td>Yes</td>
</tr>
<tr class="odd">
<td>On-prem SQL</td>
<td>Yes</td>
</tr>
<tr class="even">
<td>Azure Files</td>
<td>Yes</td>
</tr>
</tbody>
</table>

\*For SQL (Azure/On-prem) scenarios, Azure Babylon doesn't support stored procedures or scripts for lineage or scanning. Lineage is limited to table and view sources only.

## Get started with lineage

Lineage uses the following terminology:

* Source/Input (Node):
   A dataset (structured or unstructured) provided as an input to a process. For example, SQL Table, Azure blob, and files (such as .csv and .xml). In the following lineage screenshots, these datasets are represented by rectangle boxes to the left of the round-edged boxes representing processes.

* Process (Edge): A unit of activity or transformation where an action is performed on the source/input. For example, ADF Copy activity. In the following lineage screenshots, these processes are represented by round-edged boxes.

* Sink/Output (Node): A dataset, structured or unstructured, produced as an output from the process. For example, SQL Table, Azure blob, and files (such as .csv and .xml). In the following lineage screenshots, these nodes are represented by rectangle boxes to the right of the round-edged boxes representing processes.

Follow these steps to access the lineage information of an asset:

1. In the Azure portal, go to the [Azure Babylon accounts page](https://aka.ms/babylonportal).

1. Select your Azure Babylon account from the list, and then select **Launch babylon account** from the **Overview** page.

1. On the Azure Babylon **Home** page, search for a data asset. In the **Search catalog** box, enter the name of the input used in the ADF Copy or Data Flow activity and press Enter.

1. From the Search result page, open the asset details and select the **Lineage** tab.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-lineage-from-asset.png" alt-text="Screenshot showing how to select the Lineage tab.":::

## Supported lineage patterns for ADF Copy and Data Flow activities

The lineage data generated is based on the type of source and sink used in the ADF activities. Although there are about 80 source/sinks in ADF, Azure Babylon supports only a subset, as listed in [Supported Azure Data Factory activities](#supported-azure-data-factory-activities).
For information on how to configure ADF to send lineage, see [Get started with lineage](#get-started-with-lineage)
.

There are several patterns of lineage captured in Azure Babylon, described as follows:

* In the **Lineage** tab, hover over the node or edge to get information about the asset's taxonomy, like asset type.

* Select the node or edge to show additional metadata like the business glossary annotations, column count, etc.

* Select **View Columns** in the data asset to see the list of columns in the data asset. For more information about column-level lineage, see [Column-level lineage](#column-level-lineage).

### Data movement with 1:1 lineage

This pattern applies to all ADF Copy activities that capture lineage for the data movement from one input dataset to one output dataset, with a process in between. The ADF operation ingests three assets in the catalog.

Lineage of SQL table -\> SQL table; SQL table -\> Azure blob/ADLS Gen1/ADLS Gen2:

* 1 source/input: *Customer* (SQL Table)

* 1 sink/output: *Customer1.csv* (Azure Blob)

* 1 process: *CopyCustomerInfo1\#Customer1.csv* (ADF Copy activity)

:::image type="content" source="./media/catalog-lineage-user-guide/image5.png" alt-text="Screenshot showing the one to one lineage of an A D F Copy operation.":::

### Data movement with 1:1 lineage and wildcard support

In this scenario, the data is moved from Azure blob to Azure Data Lake storage using an ADF Copy activity with wildcard support. When a wildcard is used in the ADF Copy activity to copy multiple files together, Azure Babylon captures file-level lineage for each individual file that's copied by the ADF copy activity.

Lineage of Azure Blob/ADLS Gen1/Gen2 -\> Azure Blob/ADLS Gen1/Gen2 file(s):

* Source/input: *CustomerCall\*.csv* (ADLS Gen2 path)

* Sink/output: *CustomerCall\*.csv* (Azure blob file)

* 1 process: *CopyGen2ToBlob\#CustomerCall.csv* (ADF Copy activity)  

:::image type="content" source="./media/catalog-lineage-user-guide/image6.png" alt-text="Screenshot showing the one to one lineage of an A D F Copy operation with wildcard support.":::

### Data movement with n:1 lineage

Data Factory Data Flow activities can be used to merge or join more than one source dataset to produce a target dataset. In this example, Azure Babylon captures file-level lineage for individual input files that are part of an ADF Data Flow activity flowing into a SQL table.

Lineage of Azure Blob/ADLS Gen1/Gen2 -\> SQL table:

* 2 sources/inputs: *Customer.csv*, *Sales.parquet* (ADLS Gen2 Path)

* 1 sink/output: *Companydata* (Azure SQL table)

* 1 process: *DataFlowBlobsToSQL* (ADF Data Flow activity)

:::image type="content" source="./media/catalog-lineage-user-guide/image7.png" alt-text="Screenshot showing the n to one lineage of an A D F Data Flow operation.":::

### Lineage for resource sets

A resource set is a logical object in the catalog that represents many partition files in the underlying storage. More information is available in [Resource sets in Azure Data Catalog](concept-resource-sets.md). When Azure Babylon captures lineage from the Azure Data Factory, it applies the rules to normalize the individual partition files and creates a single logical object.

In the following example, an Azure Data Lake Gen2 resource set is produced from an Azure Blob:

* 1 source/input: "Employee\_management.csv" (Azure Blob)

* 1 sink/output: "Employee\_management.csv" (Azure Data Lake Gen 2)

* 1 process: "CopyBlobToAdlsGen2\_RS" (ADF Copy activity)

:::image type="content" source="./media/catalog-lineage-user-guide/image8.png" alt-text="Screenshot showing the lineage for a resource set.":::

## Column-level lineage

Column-level lineage is supported in Azure Babylon for the ADF Copy activity and the ADF Data Flow activity. To see column-level lineage, go to the **Lineage** tab of the current asset in the catalog and follow these steps:

1. Select the current data asset node to expand it, and then select **View columns**. The list of columns belonging to the data node appears in a list in the left navigation bar.

   :::image type="content" source="./media/catalog-lineage-user-guide/image9.png" alt-text="Screenshot showing how to select View columns in the lineage page.":::

1. To display the column-level data lineage, select the checkbox in the left navigation bar to see one or more columns.

   :::image type="content" source="./media/catalog-lineage-user-guide/image10.png" alt-text="Screenshot showing how to select columns to display in the lineage page.":::

1. Hover over any column name on the left navigation bar or a data asset node to highlight all the instances and see the flow of a column in the data lineage path.

   :::image type="content" source="./media/catalog-lineage-user-guide/image11.png" alt-text="Screenshot showing how to hover over a column name to highlight the flow of a column in a data lineage path.":::

1. If the number of columns is larger than can be displayed in the left navigation bar, use the filter option to find a specific column by name. Alternatively, scroll with the mouse.

   :::image type="content" source="./media/catalog-lineage-user-guide/image12.png" alt-text="Screenshot showing how to filter columns by column name on the lineage page.":::

1. If the lineage canvas contains more nodes and edges, use the filter to find data asset nodes by name. Alternatively, you can use the mouse to scroll around the lineage window.

   :::image type="content" source="./media/catalog-lineage-user-guide/image13.png" alt-text="Screenshot showing how to filter data asset nodes by name on the lineage page.":::

1. Use the **Union**/**Intersection** toggle to filter the list of nodes in the lineage canvas. If you select **Union**, then any asset that contains at least one of the selected columns is displayed. If you select **Intersection**, then only assets that contain all of the assets are displayed.

   :::image type="content" source="./media/catalog-lineage-user-guide/image14.png" alt-text="Screenshot showing how to use the Union-Intersection toggle to filter the list of nodes on the lineage page.":::

1. Select **Switch to asset** in the data node to view another data asset from the lineage view. Doing so is an effective way to browse to another asset in the catalog from the lineage view.

   :::image type="content" source="./media/catalog-lineage-user-guide/image15.png" alt-text="Screenshot how to select Switch to asset in a lineage data asset.":::

1. Use the smart buttons in the lineage canvas to get an optimal view of the lineage. Auto layout, zoom to fit, zoom in/out, full screen, and navigation map are available for an immersive lineage experience in the catalog.

   :::image type="content" source="./media/catalog-lineage-user-guide/image16.png" alt-text="Screenshot showing how to select the lineage smart buttons.":::
