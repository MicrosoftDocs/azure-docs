---
title: Metadata and lineage from Azure Synapse Analytics 
description: This article describes how to connect Azure Synapse Analytics and Microsoft Purview to track data lineage.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 09/27/2021
---
# How to get lineage from Azure Synapse Analytics into Microsoft Purview

This document explains the steps required for connecting an Azure Synapse workspace with a Microsoft Purview account to track data lineage. The document also gets into the details of the coverage scope and supported lineage capabilities.

## Supported Azure Synapse capabilities

Currently, Microsoft Purview captures runtime lineage from the following Azure Synapse pipeline activities:

- [Copy Data](../data-factory/copy-activity-overview.md?context=/azure/synapse-analytics/context/context)
- [Data Flow](../data-factory/concepts-data-flow-overview.md?context=/azure/synapse-analytics/context/context)

> [!IMPORTANT]
> Microsoft Purview drops lineage if the source or destination uses an unsupported data storage system.

[!INCLUDE[azure-synapse-supported-activity-lineage-capabilities](includes/data-factory-common-supported-capabilities.md)]

## Access secured Microsoft Purview account
      
If your Microsoft Purview account is protected by firewall, learn how to let Azure Synapse [access a secured Microsoft Purview account](../synapse-analytics/catalog-and-governance/how-to-access-secured-purview-account.md) through Microsoft Purview private endpoints.

## Bring Azure Synapse lineage into Microsoft Purview

### Step 1: Connect Azure Synapse workspace to your Microsoft Purview account

You can connect an Azure Synapse workspace to Microsoft Purview, and the connection enables Azure Synapse to push lineage information to Microsoft Purview. Follow the steps in [Connect Synapse workspace to Microsoft Purview](../synapse-analytics/catalog-and-governance/quickstart-connect-azure-purview.md). Multiple Azure Synapse workspaces can connect to a single Microsoft Purview account for holistic lineage tracking.

### Step 2: Run pipeline in Azure Synapse workspace

You can create pipelines with Copy activity in Azure Synapse workspace. You don't need any additional configuration for lineage data capture. The lineage data will automatically be captured during the activities execution.

### Step 3: Monitor lineage reporting status

After you run the Azure Synapse pipeline, in the Synapse pipeline monitoring view, you can check the lineage reporting status by selecting the following **Lineage status** button. The same information is also available in the activity output JSON -> `reportLineageToPurvew` section.

:::image type="content" source="../data-factory/media/data-factory-purview/monitor-lineage-reporting-status.png" alt-text="Monitor the lineage reporting status in pipeline monitoring view.":::

### Step 4: View lineage information in your Microsoft Purview account

In your Microsoft Purview account, you can browse assets and choose type "Azure Synapse Analytics". You can also search the Data Catalog using keywords.

:::image type="content" source="./media/how-to-lineage-azure-synapse-analytics/browse-azure-synapse-assets.png" alt-text="Browse the Azure Synapse assets in Microsoft Purview."

Select the Synapse account -> pipeline -> activity, you can view the lineage information.

:::image type="content" source="./media/how-to-lineage-azure-synapse-analytics/browse-azure-synapse-pipeline-lineage.png" alt-text="Browse the Azure Synapse pipeline lineage in Microsoft Purview." lightbox="./media/how-to-lineage-azure-synapse-analytics/browse-azure-synapse-pipeline-lineage.png":::

## Next steps

[Catalog lineage user guide](catalog-lineage-user-guide.md)

[Link to Azure Data Share for lineage](how-to-link-azure-data-share.md)
