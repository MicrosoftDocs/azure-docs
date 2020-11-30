---
title: Data Catalog lineage user guide
description: This article provides an overview of the catalog lineage feature of Azure Purview.
author: chanuengg
ms.author: csugunan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 11/29/2020
---
# Azure Purview Data Catalog lineage user guide

This article provides an overview of the data lineage features in Azure Purview Data Catalog.

## Background

One of the platform features of Azure Purview is the ability to show the lineage between datasets created by data processes. Systems like Data Factory, Data Share, and Power BI capture the lineage of data as it moves between data systems. In addition to the native integration, custom lineage reporting is also supported via Atlas hooks and a REST API.

## Common scenarios

Lineage in Azure Purview can be used to support root cause analysis and impact analysis scenarios for data producers and data consumers.

### Root cause analysis

Azure Purview can help data owners when a dataset or report has incorrect data because of upstream issues. Data owners can use Azure Purview lineage as a central platform to understand upstream process failures and be informed about the reasons for discrepancies in their data sources.

   :::image type="content" source="./media/catalog-lineage-user-guide/root-cause-analysis.png" alt-text="Screenshot showing root cause analysis." lightbox="./media/catalog-lineage-user-guide/root-cause-analysis.png":::

### Impact analysis

Data producers can use Azure Purview lineage to evaluate the downstream impact of any changes made to their data sets. Lineage can be used as a central platform to know all the consumers of their datasets and also understand the impact of these changes to dependent datasets and reports.

   :::image type="content" source="./media/catalog-lineage-user-guide/what-if-analysis.png" alt-text="Screenshot showing impact analysis." lightbox="./media/catalog-lineage-user-guide/what-if-analysis.png":::

## Get started with lineage

Lineage in Purview comprises of datasets and processes. Datasets are also referred to as nodes while processes can be also called edges:

* **Dataset (Node)**: A dataset (structured or unstructured) provided as an input to a process. For example, a SQL Table, Azure blob, and files (such as .csv and .xml), are all considered datasets. In the lineage section of Purview, datasets are represented by rectangular boxes.

* **Process (Edge)**: An activity or transformation performed on a dataset is called a process. For example, ADF Copy activity, Data Share snapshot and so on. In the lineage section of Purview, processes are represented by round-edged boxes.

To access lineage information for an asset in Purview, do the following:

1. In the Azure portal, go to the [Azure Purview accounts page](https://aka.ms/purviewportal).

1. Select your Azure Purview account from the list, and then select **Launch purview account** from the **Overview** page.

1. On the Azure Purview **Home** page, search for a dataset name or the process name such as ADF Copy or Data Flow activity. And then press Enter.

1. From the search results, select the asset and select its **Lineage** tab.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-lineage-from-asset.png" alt-text="Screenshot showing how to select the Lineage tab." lightbox="./media/catalog-lineage-user-guide/select-lineage-from-asset.png":::

## Asset-level lineage

Azure Purview supports asset level lineage for the datasets and processes. To see the asset level lineage go to the **Lineage** tab of the current asset in the catalog. Select the current dataset asset node. By default the list of columns belonging to the data appears in the left pane.

   :::image type="content" source="./media/catalog-lineage-user-guide/view-columns-from-lineage.png" alt-text="Screenshot showing how to select View columns in the lineage page" lightbox="./media/catalog-lineage-user-guide/view-columns-from-lineage.png":::

## Column-level lineage

Azure Purview supports column-level lineage for the datasets. To see column-level lineage, go to the **Lineage** tab of the current asset in the catalog and follow below steps:

1. Once you are in the lineage tab, in the left pane, select the check box next to each column you want to display in the data lineage.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-columns-to-show-in-lineage.png" alt-text="Screenshot showing how to select columns to display in the lineage page." lightbox="./media/catalog-lineage-user-guide/select-columns-to-show-in-lineage.png":::

1. Hover over a selected column on the left pane or in the dataset of the lineage canvas to see the column mapping. All the column instances are highlighted.

   :::image type="content" source="./media/catalog-lineage-user-guide/show-column-flow-in-lineage.png" alt-text="Screenshot showing how to hover over a column name to highlight the column flow in a data lineage path." lightbox="./media/catalog-lineage-user-guide/show-column-flow-in-lineage.png":::

1. If the number of columns is larger than what can be displayed in the left pane, use the filter option to select a specific column by name. Alternatively, you can use your mouse to scroll through the list.

   :::image type="content" source="./media/catalog-lineage-user-guide/filter-columns-by-name.png" alt-text="Screenshot showing how to filter columns by column name on the lineage page." lightbox="./media/catalog-lineage-user-guide/filter-columns-by-name.png":::

1. If the lineage canvas contains more nodes and edges, use the filter to select data asset or process nodes by name. Alternatively, you can use your mouse to pan around the lineage window.

   :::image type="content" source="./media/catalog-lineage-user-guide/filter-assets-by-name.png" alt-text="Screenshot showing how to filter data asset nodes by name on the lineage page." lightbox="./media/catalog-lineage-user-guide/filter-assets-by-name.png":::

1. Use the toggle in the left pane to highlight the list of datasets in the lineage canvas. If you turn off the toggle, any asset that contains at least one of the selected columns is displayed. If you turn on the toggle, only datasets that contain all of the columns are displayed.

   :::image type="content" source="./media/catalog-lineage-user-guide/use-toggle-to-filter-nodes.png" alt-text="Screenshot showing how to use the toggle to filter the list of nodes on the lineage page." lightbox="./media/catalog-lineage-user-guide/use-toggle-to-filter-nodes.png":::

1. Select **Switch to asset** on any asset to view its corresponding metadata from the lineage view. Doing so is an effective way to browse to another asset in the catalog from the lineage view.

   :::image type="content" source="./media/catalog-lineage-user-guide/select-switch-to-asset.png" alt-text="Screenshot how to select Switch to asset in a lineage data asset." lightbox="./media/catalog-lineage-user-guide/select-switch-to-asset.png":::

1. The lineage canvas could become very complex for popular datasets. To avoid clutter, the default view will only show 5 levels of lineage for the asset in focus. The rest of the lineage can be expanded by clicking the bubbles in the lineage canvas. Data consumers can also hide the assets in the canvas that are of no interest. To further reduce the clutter, turn off the toggle **More Lineage** at the top of lineage canvas. This action will hide all the bubbles in lineage canvas.

   :::image type="content" source="./media/catalog-lineage-user-guide/use-toggle-to-hide-bubbles.png" alt-text="Screenshot showing how to toggle More lineage." lightbox="./media/catalog-lineage-user-guide/use-toggle-to-hide-bubbles.png":::

1. Use the smart buttons in the lineage canvas to get an optimal view of the lineage. Auto layout, Zoom to fit, Zoom in/out, Full screen, and navigation map are available for an immersive lineage experience in the catalog.

   :::image type="content" source="./media/catalog-lineage-user-guide/use-lineage-smart-buttons.png" alt-text="Screenshot showing how to select the lineage smart buttons." lightbox="./media/catalog-lineage-user-guide/use-lineage-smart-buttons.png":::

## Next steps

* [Link to Azure Data Factory for lineage](how-to-link-azure-data-factory.md)
* [Link to Azure Data Share for lineage](how-to-link-azure-data-share.md)