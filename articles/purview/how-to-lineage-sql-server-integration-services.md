---
title: Lineage from SQL Server Integration Services
description: This article describes the data lineage extraction from SQL Server Integration Services.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 05/31/2021
---
# How to get lineage from SQL Server Integration Services (SSIS) into Azure Purview

This article elaborates on the data lineage aspects of SQL Server Integration Services (SSIS) in Azure Purview.

## Prerequisites

- [Lift and shift SQL Server Integration Services workloads to the cloud](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-lift-shift-ssis-packages-overview)

## Supported scenarios

[Data Factory Execute SSIS Package support](how-to-link-azure-data-factory.md#data-factory-execute-ssis-package-support)

## How to bring SSIS lineage into Purview

### Step 1. [Connect a Data Factory to Azure Purview](how-to-link-azure-data-factory.md)

### Step 2. Trigger SSIS activity execution in Azure Data Factory

You can [run SSIS package with Execute SSIS Package activity](https://docs.microsoft.com/azure/data-factory/how-to-invoke-ssis-package-ssis-activity) or [run SSIS package with Transact-SQL in ADF SSIS Integration Runtime](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-run-packages#sproc_activity).  

Once Execute SSIS Package activity finishes the execution, you can check lineage report status from the activity output in [Data Factory activity monitor](https://docs.microsoft.com/azure/data-factory/monitor-visually#monitor-activity-runs).
:::image type="content" source="media/how-to-lineage-sql-server-integration-services/ssis-activity-report-lineage-status.png" alt-text="ssis-status":::

### Step 3. Browse lineage Information in your Azure Purview account

- You can browse the Data Catalog by choosing asset type “SQL Server Integration Services”.
:::image type="content" source="media/how-to-lineage-sql-server-integration-services/browse-assets-ssis-1.png" alt-text="browse-ssis":::
:::image type="content" source="media/how-to-lineage-sql-server-integration-services/browse-assets-ssis-2.png" alt-text="browser-ssis-2":::
:::image type="content" source="media/how-to-lineage-sql-server-integration-services/browse-assets-ssis-3.png" alt-text="browse-ssis-3":::

- You can also search the Data Catalog using keywords.
:::image type="content" source="media/how-to-lineage-sql-server-integration-services/search-assets-ssis.png" alt-text="search-ssis":::
- You can view lineage information for an SSIS Execute Package activity and open in Data Factory to view/edit the activity settings.
:::image type="content" source="media/how-to-lineage-sql-server-integration-services/ssis-lineage.png" alt-text="ssis-lineage":::
- You can choose one data source to drill into how the columns in the source are mapped to the columns in the destination.
:::image type="content" source="media/how-to-lineage-sql-server-integration-services/ssis-lineage-drill-in.png" alt-text="ssis-lineage-drill-in":::

## Next steps

- [Lift and shift SQL Server Integration Services workloads to the cloud](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-lift-shift-ssis-packages-overview)
- [Learn about Data lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)