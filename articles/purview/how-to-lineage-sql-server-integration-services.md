---
title: Lineage from SQL Server Integration Services
description: This article describes the data lineage extraction from SQL Server Integration Services.
author: chugugrace
ms.author: chugu
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/11/2022
---
# How to get lineage from SQL Server Integration Services (SSIS) into Microsoft Purview

This article elaborates on the data lineage aspects of SQL Server Integration Services (SSIS) in Microsoft Purview.

## Prerequisites

- [Lift and shift SQL Server Integration Services workloads to the cloud](/sql/integration-services/lift-shift/ssis-azure-lift-shift-ssis-packages-overview)

## Supported scenarios

The current scope of support includes the lineage extraction from SSIS packages executed by Azure Data Factory SSIS integration runtime.

On premises SSIS lineage extraction is not supported yet.

Only source and destination are supported for Microsoft Purview SSIS lineage running from Data Factory’s SSIS Execute Package activity. Transformations under SSIS are not yet supported.

### Supported data stores

| Data store | Supported |
| ------------------- | ------------------- |
| Azure Blob Storage | Yes |
| Azure Data Lake Storage Gen1 | Yes |
| Azure Data Lake Storage Gen2 | Yes |
| Azure Files | Yes |
| Azure SQL Database \* | Yes |
| Azure SQL Managed Instance \*| Yes |
| Azure Synapse Analytics \* | Yes |
| SQL Server \* | Yes |

*\* Microsoft Purview currently doesn't support query or stored procedure for lineage or scanning. Lineage is limited to table and view sources only.*


## How to bring SSIS lineage into Microsoft Purview

### Step 1. [Connect a Data Factory to Microsoft Purview](how-to-link-azure-data-factory.md)

### Step 2. Trigger SSIS activity execution in Azure Data Factory

You can [run SSIS package with Execute SSIS Package activity](../data-factory/how-to-invoke-ssis-package-ssis-activity.md) or [run SSIS package with Transact-SQL in ADF SSIS Integration Runtime](../data-factory/how-to-invoke-ssis-package-stored-procedure-activity.md).  

Once Execute SSIS Package activity finishes the execution, you can check lineage report status from the activity output in [Data Factory activity monitor](../data-factory/monitor-visually.md#monitor-activity-runs).
:::image type="content" source="media/how-to-lineage-sql-server-integration-services/activity-report-lineage-status.png" alt-text="ssis-status":::

### Step 3. Browse lineage Information in your Microsoft Purview account

- You can browse the Data Catalog by choosing asset type “SQL Server Integration Services”.

:::image type="content" source="media/how-to-lineage-sql-server-integration-services/browse-assets-1.png" alt-text="Browser assets" lightbox="media/how-to-lineage-sql-server-integration-services/browse-assets-1.png":::
:::image type="content" source="media/how-to-lineage-sql-server-integration-services/browse-assets-2.png" alt-text="browser-assets-ssis":::
:::image type="content" source="media/how-to-lineage-sql-server-integration-services/browse-assets-3.png" alt-text="browse-assets-ssis-package":::

- You can also search the Data Catalog using keywords.

:::image type="content" source="media/how-to-lineage-sql-server-integration-services/search-assets.png" alt-text="search-ssis" lightbox="media/how-to-lineage-sql-server-integration-services/search-assets.png":::

- You can view lineage information for an SSIS Execute Package activity and open in Data Factory to view/edit the activity settings.

:::image type="content" source="media/how-to-lineage-sql-server-integration-services/lineage.png" alt-text="show-ssis-lineage" lightbox="media/how-to-lineage-sql-server-integration-services/lineage.png":::

- You can choose one data source to drill into how the columns in the source are mapped to the columns in the destination.

:::image type="content" source="media/how-to-lineage-sql-server-integration-services/lineage-drill-in.png" alt-text="show-ssis-lineage-drill-in" lightbox="media/how-to-lineage-sql-server-integration-services/lineage-drill-in.png":::

## Next steps

- [Lift and shift SQL Server Integration Services workloads to the cloud](/sql/integration-services/lift-shift/ssis-azure-lift-shift-ssis-packages-overview)
- [Learn about Data lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)
