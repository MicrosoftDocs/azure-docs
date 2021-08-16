---
title: Metadata and Lineage from Power BI
description: This article describes the data lineage extraction from Power BI source.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 03/30/2021
---
# How to get lineage from Power BI into Azure Purview

This article elaborates on the data lineage aspects of Power BI source in Azure Purview. The prerequisite to see data lineage in Purview for Power BI is to [scan your Power BI.](../purview/register-scan-power-bi-tenant.md) 

## Common scenarios

1. After the Power BI source is scanned, data consumers can perform root cause analysis of a report or dashboard from Purview. For any data discrepancy in a report, users can easily identify the upstream datasets and contact their owners if necessary.

2. Data producers can see the downstream reports or dashboards consuming their dataset. Before making any changes to their datasets, the data owners can make informed decisions.

2. Users can search by name, endorsement status, sensitivity label, owner, description, and other business facets to return the relevant Power BI artifacts.

## Power BI artifacts in Azure Purview

Once the [scan of your Power BI](../purview/register-scan-power-bi-tenant.md) is complete, following Power BI artifacts will be inventoried in Purview

* Capacity
* Workspaces
* Dataflow
* Dataset 
* Report
* Dashboard

The workspace artifacts will show lineage of Dataflow -> Dataset -> Report -> Dashboard

:::image type="content" source="./media/how-to-lineage-powerbi/powerbi-overview.png" alt-text="Screenshot showing how Overview tab is rendered for Power BI assets." lightbox="./media/how-to-lineage-powerbi/powerbi-overview.png":::

>[!Note]
> * Column lineage and transformations inside of PowerBI Datasets is currently not supported
> * Limited information is currently shown for the Data sources from which the PowerBI Dataflow or PowerBI Dataset is created. E.g.: For SQL server source of a PowerBI datasets only server name is captured. 

## Lineage of Power BI artifacts in Azure Purview

Users can search for the Power BI artifact by name, description, or other details to see relevant results. Under the asset overview & properties tab the basic details such as description, classification and other information are shown. Under the lineage tab, asset relationships are shown with the upstream and downstream dependencies.

:::image type="content" source="./media/how-to-lineage-powerbi/powerbi-lineage.png" alt-text="Screenshot showing how lineage is rendered for Power BI." lightbox="./media/how-to-lineage-powerbi/powerbi-lineage.png":::

## Next steps

- [Learn about Data lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)
