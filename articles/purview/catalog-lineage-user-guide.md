---
title: Data Catalog lineage user guide (preview)
description: This article provides an overview of the catalog lineage feature of Azure Purview.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 08/10/2021
---
# Azure Purview Data Catalog lineage user guide

This article provides an overview of the data lineage features in Azure Purview Data Catalog.

## Background

One of the platform features of Azure Purview is the ability to show the lineage between datasets created by data processes. Systems like Data Factory, Data Share, and Power BI capture the lineage of data as it moves. Custom lineage reporting is also supported via Atlas hooks and REST API.

## Lineage collection 
 Metadata collected in Azure Purview from enterprise data systems are stitched across to show an end to end data lineage. Data systems that collect lineage into Purview are broadly categorized into following three types.

### Data processing system
Data integration and ETL tools can push lineage in to Azure Purview at execution time. Tools such as Data Factory, Data Share, Synapse, Azure Databricks, and so on, belong to this category of data systems. The data processing systems reference datasets as source from different databases and storage solutions to create target datasets. The list of data processing systems currently integrated with Purview for lineage are listed in below table.

| Data processing system | Supported scope |
| ---------------------- | ------------|
| Azure Data Factory | [Copy activity](how-to-link-azure-data-factory.md#data-factory-copy-activity-support) <br> [Data flow activity](how-to-link-azure-data-factory.md#data-factory-data-flow-support) <br> [Execute SSIS package activity](how-to-link-azure-data-factory.md#data-factory-execute-ssis-package-support) |
| Azure Synapse Analytics | [Copy activity](how-to-link-azure-data-factory.md#data-factory-copy-activity-support) |
| Azure Data Share | [Share snapshot](how-to-link-azure-data-share.md) |
 
### Data storage systems
Databases & storage solutions such as SQL Server, Teradata, and SAP have query engines to transform data using scripting language. Data lineage from stored procedures is collected in to Purview and stitched with lineage from other systems.

| Data storage system | Supported scope |
| ---------------------- | ------------|
| Teradata | Stored procedures

### Data analytics & reporting systems
Data systems like Azure ML and Power BI report lineage into Azure Purview. These systems will use the datasets from storage systems and process through their meta model to create BI Dashboard, ML experiments and so on.

| Data analytics & reporting system | Supported scope |
| ---------------------- | ------------|
| Power BI | [Datasets, Dataflows, Reports & Dashboards](register-scan-power-bi-tenant.md)

## Get started with lineage

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RWxTAK]

Lineage in Purview includes datasets and processes. Datasets are also referred to as nodes while processes can be also called edges:

* **Dataset (Node)**: A dataset (structured or unstructured) provided as an input to a process. For example, a SQL Table, Azure blob, and files (such as .csv and .xml), are all considered datasets. In the lineage section of Purview, datasets are represented by rectangular boxes.

* **Process (Edge)**: An activity or transformation performed on a dataset is called a process. For example, ADF Copy activity, Data Share snapshot and so on. In the lineage section of Purview, processes are represented by round-edged boxes.

To access lineage information for an asset in Purview, follow the steps:

1. In the Azure portal, go to the [Azure Purview accounts page](https://aka.ms/purviewportal).

1. Select your Azure Purview account from the list, and then select **Launch purview account** from the **Overview** page.

1. On the Azure Purview **Home** page, search for a dataset name or the process name such as ADF Copy or Data Flow activity. And then press Enter.

1. From the search results, select the asset and select its **Lineage** tab.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-lineage-from-asset.png" alt-text="Screenshot showing how to select the Lineage tab." border="true":::

## Asset-level lineage

Azure Purview supports asset level lineage for the datasets and processes. To see the asset level lineage go to the **Lineage** tab of the current asset in the catalog. Select the current dataset asset node. By default the list of columns belonging to the data appears in the left pane.

   :::image type="content" source="./media/catalog-lineage-user-guide/view-columns-from-lineage.png" alt-text="Screenshot showing how to select View columns in the lineage page" border="true":::

## Dataset column lineage

To see column-level lineage of a dataset, go to the **Lineage** tab of the current asset in the catalog and follow below steps:

1. Once you are in the lineage tab, in the left pane, select the check box next to each column you want to display in the data lineage.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-columns-to-show-in-lineage.png" alt-text="Screenshot showing how to select columns to display in the lineage page." lightbox="./media/catalog-lineage-user-guide/select-columns-to-show-in-lineage.png":::

2. Hover over a selected column on the left pane or in the dataset of the lineage canvas to see the column mapping. All the column instances are highlighted.

   :::image type="content" source="./media/catalog-lineage-user-guide/show-column-flow-in-lineage.png" alt-text="Screenshot showing how to hover over a column name to highlight the column flow in a data lineage path." lightbox="./media/catalog-lineage-user-guide/show-column-flow-in-lineage.png":::

3. If the number of columns is larger than what can be displayed in the left pane, use the filter option to select a specific column by name. Alternatively, you can use your mouse to scroll through the list.

   :::image type="content" source="./media/catalog-lineage-user-guide/filter-columns-by-name.png" alt-text="Screenshot showing how to filter columns by column name on the lineage page." lightbox="./media/catalog-lineage-user-guide/filter-columns-by-name.png":::

4. If the lineage canvas contains more nodes and edges, use the filter to select data asset or process nodes by name. Alternatively, you can use your mouse to pan around the lineage window.

   :::image type="content" source="./media/catalog-lineage-user-guide/filter-assets-by-name.png" alt-text="Screenshot showing data asset nodes by name on the lineage page." lightbox="./media/catalog-lineage-user-guide/filter-assets-by-name.png":::

5. Use the toggle in the left pane to highlight the list of datasets in the lineage canvas. If you turn off the toggle, any asset that contains at least one of the selected columns is displayed. If you turn on the toggle, only datasets that contain all of the columns are displayed.

   :::image type="content" source="./media/catalog-lineage-user-guide/use-toggle-to-filter-nodes.png" alt-text="Screenshot showing how to use the toggle to filter the list of nodes on the lineage page." lightbox="./media/catalog-lineage-user-guide/use-toggle-to-filter-nodes.png":::

## Process column lineage
Data process can take one or more input datasets to produce one or more outputs. In Purview, column level lineage is available for process nodes. 
1. Switch between input and output datasets from a drop down in the columns panel.
2. Select columns from one or more tables to see the lineage flowing from input dataset to corresponding output dataset.

   :::image type="content" source="./media/catalog-lineage-user-guide/process-column-lineage.png" alt-text="Screenshot showing columns lineage of a process node." lightbox="./media/catalog-lineage-user-guide/process-column-lineage.png":::

## Browse assets in lineage
1. Select **Switch to asset** on any asset to view its corresponding metadata from the lineage view. Doing so is an effective way to browse to another asset in the catalog from the lineage view.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-switch-to-asset.png" alt-text="Screenshot how to select Switch to asset in a lineage data asset." lightbox="./media/catalog-lineage-user-guide/select-switch-to-asset.png":::

2. The lineage canvas could become complex for popular datasets. To avoid clutter, the default view will only show five levels of lineage for the asset in focus. The rest of the lineage can be expanded by clicking the bubbles in the lineage canvas. Data consumers can also hide the assets in the canvas that are of no interest. To further reduce the clutter, turn off the toggle **More Lineage** at the top of lineage canvas. This action will hide all the bubbles in lineage canvas.

   :::image type="content" source="./media/catalog-lineage-user-guide/use-toggle-to-hide-bubbles.png" alt-text="Screenshot showing how to toggle More lineage." lightbox="./media/catalog-lineage-user-guide/use-toggle-to-hide-bubbles.png":::

3. Use the smart buttons in the lineage canvas to get an optimal view of the lineage. Auto layout, Zoom to fit, Zoom in/out, Full screen, and navigation map are available for an immersive lineage experience in the catalog.

   :::image type="content" source="./media/catalog-lineage-user-guide/use-lineage-smart-buttons.png" alt-text="Screenshot showing how to select the lineage smart buttons." lightbox="./media/catalog-lineage-user-guide/use-lineage-smart-buttons.png":::

## Next steps

* [Link to Azure Data Factory for lineage](how-to-link-azure-data-factory.md)
* [Link to Azure Data Share for lineage](how-to-link-azure-data-share.md)