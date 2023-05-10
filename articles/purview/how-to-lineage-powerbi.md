---
title: Metadata and Lineage from Power BI
description: This article describes the data lineage extraction from Power BI source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 03/23/2023
---
# How to get lineage from Power BI into Microsoft Purview

This article elaborates on the data lineage for Power BI sources in Microsoft Purview.

## Prerequisites

To see data lineage in Microsoft Purview for Power BI, you must first [register and scan your Power BI source.](../purview/register-scan-power-bi-tenant.md)

## Common scenarios

After a Power BI source has been scanned, lineage information for your current data assets, and data assets referenced by Power BI, will automatically be added in the Microsoft Purview Data Catalog.

1. Data consumers can perform root cause analysis of a report or dashboard from Microsoft Purview. For any data discrepancy in a report, users can easily identify the upstream datasets and contact their owners if necessary.

1. Data producers can see the downstream reports or dashboards consuming their dataset. Before making any changes to their datasets, the data owners can make informed decisions.

1. Users can search by name, endorsement status, sensitivity label, owner, description, and other business facets to return the relevant Power BI artifacts.

## Power BI artifacts in Microsoft Purview

Once the [scan of your Power BI](../purview/register-scan-power-bi-tenant.md) is complete, following Power BI artifacts will be inventoried in Microsoft Purview:

* Workspaces
* Dashboards
* Reports
* Datasets
* Dataflows
* Datamarts

:::image type="content" source="./media/how-to-lineage-powerbi/powerbi-overview.png" alt-text="Screenshot showing how Overview tab is rendered for Power BI assets." lightbox="./media/how-to-lineage-powerbi/powerbi-overview.png":::

## Lineage of Power BI artifacts in Microsoft Purview

Users can search for a Power BI artifact by name, description, or other details to see relevant results. Under the asset overview and properties tabs, the basic details such as description, classification are shown. Under the lineage tab, asset relationships are shown with the upstream and downstream dependencies.

Microsoft Purview captures lineage among Power BI artifacts (for example: Dataflow -> Dataset -> Report -> Dashboard) and external data assets.

>[!NOTE]
> For lineage between Power BI artifacts and external data assets, currently the supported source types are:
>* Azure SQL Database
>* Azure Blob Storage
>* Azure Data Lake Store Gen1
>* Azure Data Lake Store Gen2

:::image type="content" source="./media/how-to-lineage-powerbi/powerbi-lineage.png" alt-text="Screenshot showing how lineage is rendered for Power BI." lightbox="./media/how-to-lineage-powerbi/powerbi-lineage.png":::

In addition, column level lineage (Power BI subartifact lineage) and transformation inside of Power BI datasets are captured when using Azure SQL Database as source. For measures, you can further select column -> Properties -> expression to see the transformation details.

>[!NOTE]
> Column level lineage and transformations is supported when using Azure SQL Database as source. Other sources are currently not supported.

:::image type="content" source="./media/how-to-lineage-powerbi/power-bi-lineage-subartifacts.png" alt-text="Screenshot showing how Power BI subartifacts lineage is rendered." lightbox="./media/how-to-lineage-powerbi/power-bi-lineage-subartifacts.png":::

## Known limitations

* Limited information is currently shown for data sources where the Power BI Dataflow or Power BI Dataset is created. For example, for a SQL server source of Power BI dataset, only server/database name is captured.
* Some measures aren't shown in the subartifact lineage, for example, `COUNTROWS`.
* In the lineage graph, when selecting a measure that is derived by columns using the COUNT function, the underlying column isn't selected automatically. Check the measure expression in the column properties tab to identify the underlying column.
* If you scanned your Power BI source before subartifact lineage was supported, you may see a database asset along with the new table assets in the lineage graph, which isn't removed.
* In case you have the dataset table connected to another dataset table, when the middle dataset disables the "Enable load" option inside the Power BI desktop, and the lineage can't be extracted.

## Next steps

- [Learn about Data lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)
