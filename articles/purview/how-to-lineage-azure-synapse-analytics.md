---
title: Metadata and lineage from Azure Synapse Analytics 
description: This article describes how to connect Azure Synapse Analytics and Azure Purview to track data lineage.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/10/2021
---
# How to get lineage from Azure Synapse Analytics into Azure Purview

This document explains the steps required for connecting an Azure Synapse workspace with an Azure Purview account to track data lineage. The document also gets into the details of the coverage scope and supported lineage capabilities.

## Supported Azure Synapse capabilities

Currently, Azure Purview captures runtime lineage from the following Azure Synapse pipeline activities:

- [Copy Data](../data-factory/copy-activity-overview.md)

> [!IMPORTANT]
> Azure Purview drops lineage if the source or destination uses an unsupported data storage system.

[!INCLUDE[azure-synapse-supported-activity-lineage-capabilities](includes/data-factory-common-supported-capabilities.md)]

## Bring Azure Synapse lineage into Purview

### Step 1: Connect Azure Synapse workspace to your Purview account

You can connect an Azure Sysnpase workspace to Purview, and the connection enables Azure Synapse to push lineage information to Purview. Follow the steps in [Connect an Azure Purview Account into Synapse](../synapse-analytics/catalog-and-governance/quickstart-connect-azure-purview.md). Multiple Azure Synapse workspaces can connect to a single Azure Purview account for holistic lineage tracking.

### Step 2: Run pipeline in Azure Synapse workspace

You can create pipelines with Copy activity in Azure Synapse workspace. You don't need any additional configuration for lineage data capture. The lineage data will automatically be captured during the activities execution.

### Step 3: Monitor lineage reporting status

After you run the Azure Synapse pipeline, in the Synapse pipeline monitoring view, you can check the lineage reporting status by clicking the following **Lineage status** button. The same information is also available in the activity output JSON -> `reportLineageToPurvew` section.

:::image type="content" source="../data-factory/media/data-factory-purview/monitor-lineage-reporting-status.png" alt-text="Monitor the lineage reporting status in pipeline monitoring view.":::

### Step 4: View lineage information in your Purview account

In your Purview account, you can browse assets and choose type "Azure Synapse Analytics". You can also search the Data Catalog using keywords.

:::image type="content" source="./media/how-to-lineage-azure-synapse-analytics/browse-azure-synapse-assets.png" alt-text="Browse the Azure Synapse assets in Purview."

Select the Synapse account -> pipeline -> activity, you can view the lineage information.

:::image type="content" source="./media/how-to-lineage-azure-synapse-analytics/browse-azure-synapse-pipeline-lineage.png" alt-text="Browse the Azure Synapse pipeline lineage in Purview." lightbox="./media/how-to-lineage-azure-synapse-analytics/browse-azure-synapse-pipeline-lineage.png":::

## Next steps

[Catalog lineage user guide](catalog-lineage-user-guide.md)

[Link to Azure Data Share for lineage](how-to-link-azure-data-share.md)