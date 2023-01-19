---
title: Data Catalog lineage user guide
description: This article provides an overview of the catalog lineage feature of Microsoft Purview.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.topic: conceptual
ms.date: 09/20/2022
---
# Microsoft Purview Data Catalog lineage user guide

This article provides an overview of the data lineage features in Microsoft Purview Data Catalog.

## Background

One of the platform features of Microsoft Purview is the ability to show the lineage between datasets created by data processes. Systems like Data Factory, Data Share, and Power BI capture the lineage of data as it moves. Custom lineage reporting is also supported via Atlas hooks and REST API.

## Lineage collection

 Metadata collected in Microsoft Purview from enterprise data systems are stitched across to show an end to end data lineage. Data systems that collect lineage into Microsoft Purview are broadly categorized into following three types:
 
 - [Data processing systems](#data-processing-systems)
 - [Data storage systems](#data-storage-systems)
 - [Data analytics and reporting systems](#data-analytics-and-reporting-systems)

Each system supports a different level of lineage scope. Check the sections below, or your system's individual lineage article, to confirm the scope of lineage currently available.

### Known limitations

* Database Views used as source of process activity(Azure Data Factory, Synapse Pipelines, Azure SQL Database, Azure Data Share) are currently captured as Database Table objects in Microsoft Purview. If the Database is also scanned, the View assets are discovered separately in Microsoft Purview. In this scenario, two assets with same name captured in Microsoft Purview, one as a Table with data lineage and another as a View.

### Data processing systems
Data integration and ETL tools can push lineage into Microsoft Purview at execution time. Tools such as Data Factory, Data Share, Synapse, Azure Databricks, and so on, belong to this category of data processing systems. The data processing systems reference datasets as source from different databases and storage solutions to create target datasets. The list of data processing systems currently integrated with Microsoft Purview for lineage are listed in below table.

| Data processing system | Supported scope |
| ---------------------- | ------------|
| Azure Data Factory | [Copy activity](how-to-link-azure-data-factory.md#copy-activity-support) <br> [Data flow activity](how-to-link-azure-data-factory.md#data-flow-support) <br> [Execute SSIS package activity](how-to-link-azure-data-factory.md#execute-ssis-package-support) |
| Azure Synapse Analytics | [Copy activity](how-to-lineage-azure-synapse-analytics.md#copy-activity-support) <br> [Data flow activity](how-to-lineage-azure-synapse-analytics.md#data-flow-support) |
| Azure SQL Database (Preview) | [Lineage extraction](register-scan-azure-sql-database.md?tabs=sql-authentication#lineagepreview) |
| Azure Data Share | [Share snapshot](how-to-link-azure-data-share.md) |
 
### Data storage systems
Databases & storage solutions such as Oracle, Teradata, and SAP have query engines to transform data using scripting language. Data lineage information from views/stored procedures/etc is collected into Microsoft Purview and stitched with lineage from other systems. Lineage is supported for the following data sources via Microsoft Purview data scan. Learn more about the supported lineage scenarios from the respective article.

|**Category**|  **Data source**  |
|---|---|
|Database|    [Cassandra](register-scan-cassandra-source.md)|
|| [Db2](register-scan-db2.md) |
|| [Google BigQuery](register-scan-google-bigquery-source.md)|
|| [Hive Metastore Database](register-scan-hive-metastore-source.md) |
|| [MySQL](register-scan-mysql.md) |
|| [Oracle](register-scan-oracle-source.md) |
|| [PostgreSQL](register-scan-postgresql.md) |
|| [Snowflake](register-scan-snowflake.md) |
|| [Teradata](register-scan-teradata-source.md)|
|Services and apps|    [Erwin](register-scan-erwin-source.md)|
|| [Looker](register-scan-looker-source.md)|
|| [SAP ECC](register-scan-sapecc-source.md)|
|| [SAP S/4HANA](register-scan-saps4hana-source.md) |

### Data analytics and reporting systems
Data analytics and reporting systems like Azure ML and Power BI report lineage into Microsoft Purview. These systems will use the datasets from storage systems and process through their meta model to create BI Dashboards, ML experiments and so on.

| Data analytics & reporting system | Supported scope |
| ---------------------- | ------------|
| Power BI | [Datasets, Dataflows, Reports & Dashboards](register-scan-power-bi-tenant.md)

## Get started with lineage

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RWxTAK]

Lineage in Microsoft Purview includes datasets and processes. Datasets are also referred to as nodes while processes can be also called edges:

* **Dataset (Node)**: A dataset (structured or unstructured) provided as an input to a process. For example, a SQL Table, Azure blob, and files (such as .csv and .xml), are all considered datasets. In the lineage section of Microsoft Purview, datasets are represented by rectangular boxes.

* **Process (Edge)**: An activity or transformation performed on a dataset is called a process. For example, ADF Copy activity, Data Share snapshot and so on. In the lineage section of Microsoft Purview, processes are represented by round-edged boxes.

To access lineage information for an asset in Microsoft Purview, follow the steps:

1. In the Azure portal, go to the [Microsoft Purview accounts page](https://aka.ms/purviewportal).

1. Select your Microsoft Purview account from the list, and then select **Open Microsoft Purview governance portal** from the **Overview** page.

1. On the Microsoft Purview governance portal **Home** page, search for a dataset name or the process name such as ADF Copy or Data Flow activity. And then press Enter.

1. From the search results, select the asset and select its **Lineage** tab.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-lineage-from-asset.png" alt-text="Screenshot showing how to select the Lineage tab." border="true":::

## Asset-level lineage

Microsoft Purview supports asset level lineage for the datasets and processes. To see the asset level lineage go to the **Lineage** tab of the current asset in the catalog. Select the current dataset asset node. By default the list of columns belonging to the data appears in the left pane.

   :::image type="content" source="./media/catalog-lineage-user-guide/view-columns-from-lineage-inline.png" alt-text="Screenshot showing how to select View columns in the lineage page." lightbox="./media/catalog-lineage-user-guide/view-columns-from-lineage.png"border="true":::

## Manual lineage (preview)

Data lineage in Microsoft Purview is [automated](#lineage-collection) for many assets in on-premises, multicloud, and SaaS environments. While we continue to add more automated sources, manual lineage allows you to document lineage metadata for sources where automation isn't yet supported, without using any code.

To add manual lineage for any of your assets, follow these steps:

1. [Search for your asset in the data catalog](how-to-search-catalog.md) and select it to view details.
1. Select **Edit** and navigate to the **Lineage** tab.
   :::image type="content" source="./media/catalog-lineage-user-guide/select-edit.png" alt-text="Screenshot of a data asset in Microsoft Purview, with the edit option highlighted.":::
   :::image type="content" source="./media/catalog-lineage-user-guide/select-lineage.png" alt-text="Screenshot of a data asset edit page, with the Lineage tab highlighted.":::
1. Select **Add Lineage** in the list panel to add an asset as part of the manual lineage.
   :::image type="content" source="./media/catalog-lineage-user-guide/add-lineage.png" alt-text="Screenshot of a data asset lineage page, with the add lineage button highlighted.":::
1. Select the relationship type:
    1. For upstream lineage - select the relationship as **Consumes**
    1. For downstream lineage - select the relationship as **Produces**
1. Select the asset dropdown to find the asset from the suggested list or **View more** to search the full catalog. Select your asset.
   :::image type="content" source="./media/catalog-lineage-user-guide/select-asset-dropdown.png" alt-text="Screenshot of a data asset lineage page, with the asset dropdown highlighted.":::
1. Now you can see the lineage relationship. You can add another by selecting the **Add Lineage** button again, or delete the newly added lineage by selecting the trash can icon. When you're finished, select the **Save** button to save your lineage and exit edit mode.
   :::image type="content" source="./media/catalog-lineage-user-guide/delete-or-save.png" alt-text="Screenshot of a data asset lineage page, the delete and save buttons highlighted.":::

### Known limitations of manual lineage

* Current asset picker experience allows selecting only one asset at a time.
* Column level manual lineage is currently not supported.
* Data curation access required for both source and target assets.
* These asset types don't currently allow manual lineage because they support automated lineage:
    * Azure Data Factory
    * Synapse pipelines
    * Power BI datasets
    * Teradata stored procedure
    * Azure SQL stored procedure

## Dataset column lineage

To see column-level lineage of a dataset, go to the **Lineage** tab of the current asset in the catalog and follow below steps:

1. Once you are in the lineage tab, in the left pane, select the check box next to each column you want to display in the data lineage.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-columns-to-show-in-lineage-inline.png" alt-text="Screenshot showing how to select columns to display in the lineage page." lightbox="./media/catalog-lineage-user-guide/select-columns-to-show-in-lineage.png":::

1. Hover over a selected column on the left pane or in the dataset of the lineage canvas to see the column mapping. All the column instances are highlighted.

   :::image type="content" source="./media/catalog-lineage-user-guide/show-column-flow-in-lineage-inline.png" alt-text="Screenshot showing how to hover over a column name to highlight the column flow in a data lineage path." lightbox="./media/catalog-lineage-user-guide/show-column-flow-in-lineage.png":::

1. If the number of columns is larger than what can be displayed in the left pane, use the filter option to select a specific column by name. Alternatively, you can use your mouse to scroll through the list.

   :::image type="content" source="./media/catalog-lineage-user-guide/filter-columns-by-name.png" alt-text="Screenshot showing how to filter columns by column name on the lineage page." lightbox="./media/catalog-lineage-user-guide/filter-columns-by-name.png":::

1. If the lineage canvas contains more nodes and edges, use the filter to select data asset or process nodes by name. Alternatively, you can use your mouse to pan around the lineage window.

   :::image type="content" source="./media/catalog-lineage-user-guide/filter-assets-by-name.png" alt-text="Screenshot showing data asset nodes by name on the lineage page." lightbox="./media/catalog-lineage-user-guide/filter-assets-by-name.png":::

1. Use the toggle in the left pane to highlight the list of datasets in the lineage canvas. If you turn off the toggle, any asset that contains at least one of the selected columns is displayed. If you turn on the toggle, only datasets that contain all of the columns are displayed.

   :::image type="content" source="./media/catalog-lineage-user-guide/use-toggle-to-filter-nodes.png" alt-text="Screenshot showing how to use the toggle to filter the list of nodes on the lineage page." lightbox="./media/catalog-lineage-user-guide/use-toggle-to-filter-nodes.png":::

## Process column lineage

You can also view data processes, like copy activities, in the data catalog. For example, in this lineage flow, select the copy activity:

:::image type="content" source="./media/catalog-lineage-user-guide/select-copy-activity-inline.png" alt-text="Screenshot of a data lineage flow with one of the copy activity nodes highlighted." lightbox="./media/catalog-lineage-user-guide/select-copy-activity.png":::

The copy activity will expand, and then you can select the **Switch to asset** button, which will give you more details about the process itself.

:::image type="content" source="./media/catalog-lineage-user-guide/switch-to-asset-inline.png" alt-text="Screenshot of the copy activity node expanded, and the new switch to asset button selected." lightbox="./media/catalog-lineage-user-guide/switch-to-asset.png":::

Data process can take one or more input datasets to produce one or more outputs. In Microsoft Purview, column level lineage is available for process nodes.

1. Switch between input and output datasets from a drop-down in the columns panel.
1. Select columns from one or more tables to see the lineage flowing from input dataset to corresponding output dataset.

   :::image type="content" source="./media/catalog-lineage-user-guide/process-column-lineage-inline.png" alt-text="Screenshot showing columns lineage of a process node." lightbox="./media/catalog-lineage-user-guide/process-column-lineage.png":::

## Browse assets in lineage

1. Select **Switch to asset** on any asset to view its corresponding metadata from the lineage view. Doing so is an effective way to browse to another asset in the catalog from the lineage view.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-switch-to-asset-inline.png" alt-text="Screenshot how to select Switch to asset in a lineage data asset." lightbox="./media/catalog-lineage-user-guide/select-switch-to-asset.png":::

1. The lineage canvas could become complex for popular datasets. To avoid clutter, the default view will only show five levels of lineage for the asset in focus. The rest of the lineage can be expanded by selecting the bubbles in the lineage canvas. Data consumers can also hide the assets in the canvas that are of no interest. To further reduce the clutter, turn off the toggle **More Lineage** at the top of lineage canvas. This action will hide all the bubbles in lineage canvas.

   :::image type="content" source="./media/catalog-lineage-user-guide/use-toggle-to-hide-bubbles-inline.png" alt-text="Screenshot showing how to toggle More lineage." lightbox="./media/catalog-lineage-user-guide/use-toggle-to-hide-bubbles.png":::

1. Use the smart buttons in the lineage canvas to get an optimal view of the lineage:
    1. Full screen
    1. Zoom to fit
    1. Zoom in/out
    1. Auto align
    1. Zoom preview
    1. And more options:
        1. Center the current asset
        1. Reset to default view

   :::image type="content" source="./media/catalog-lineage-user-guide/use-lineage-smart-buttons-inline.png" alt-text="Screenshot showing how to select the lineage smart buttons." lightbox="./media/catalog-lineage-user-guide/use-lineage-smart-buttons.png":::

## Next steps

* [Link to Azure Data Factory for lineage](how-to-link-azure-data-factory.md)
* [Link to Azure Data Share for lineage](how-to-link-azure-data-share.md)
