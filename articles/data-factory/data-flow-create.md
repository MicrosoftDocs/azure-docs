---
title: Create a Mapping Data Flow
description: Learn how to create a mapping data flow in Azure Data Factory and Azure Synapse Analytics.
author: whhender
ms.author: whhender
ms.reviewer: makromer
ms.subservice: data-flows
ms.topic: quickstart
ms.date: 02/13/2025
---

# Quickstart: Create a mapping data flow in Azure Data Factory and Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

A mapping data flow provides a way to transform data at scale without any coding required. You can design a data transformation job in the data flow designer by constructing a series of transformations. Start with any number of source transformations, followed by data transformation steps. Then, complete your data flow with a sink to land your results in a destination.

## Steps to create a new data flow

# [Azure Data Factory](#tab/data-factory)

1. [Create a new V2 data factory by using the Azure portal](quickstart-create-data-factory-portal.md).

1. In the portal, go to your data factory. Select **Overview**, and then select the **Open Azure Data Factory Studio** tile.

   :::image type="content" source="media/data-flow-create/open-data-factory-studio-from-portal.png" alt-text="Screenshot that shows the tile for opening Azure Data Factory Studio in the Azure portal.":::

1. In Azure Data Factory Studio, you can add sample data flows from the template gallery. To browse the gallery, go to the **Author** tab. Select the plus sign, and then choose **Pipeline** > **Template gallery**.

   :::image type="content" source="media/data-flow-create/open-template-gallery-from-data-factory.png" alt-text="Screenshot that shows selections for opening the template gallery in Azure Data Factory Studio.":::

1. Filter by the **Data flow** category to choose from the available templates.

   :::image type="content" source="media/data-flow-create/template-gallery-filtered-for-data-flow.png" alt-text="Screenshot that shows the template gallery filtered for data flows.":::

You can also add data flows directly to your data factory without using a template. On the **Author** tab in Azure Data Factory Studio, select the plus sign, and then choose **Data flow** > **Data flow**.  

:::image type="content" source="media/data-flow-create/create-data-flow-directly.png" alt-text="Screenshot that shows selections for creating an empty data flow directly.":::

# [Azure Synapse Analytics](#tab/synapse-analytics)

1. [Create a new Azure Synapse Analytics workspace by using the Azure portal](../synapse-analytics/quickstart-create-workspace.md).

1. In the portal, go to your workspace. Select **Overview**, and then select the **Open Synapse Studio** tile.

   :::image type="content" source="media/data-flow-create/open-synapse-studio-from-portal.png" alt-text="Screenshot that shows the tile for opening Azure Synapse Analytics Studio in the Azure portal.":::

1. In Azure Synapse Analytics Studio, you can add sample data flows from the template gallery. To browse the gallery, go to the **Integrate** tab. Select the plus sign, and then choose **Browse gallery**.

   :::image type="content" source="media/data-flow-create/open-template-gallery-from-synapse.png" alt-text="Screenshot that shows selections for opening the template gallery in Azure Synapse Analytics Studio.":::

1. Filter by the **Data flow** category to choose from the available templates.

   :::image type="content" source="media/data-flow-create/synapse-template-gallery-filtered-for-data-flow.png" alt-text="Screenshot that shows the template gallery filtered for data flows.":::

You can also add data flows directly to your workspace without using a template. On the **Integrate** tab in Azure Synapse Analytics Studio, select the plus sign, and then choose **Pipeline**.

:::image type="content" source="media/data-flow-create/create-pipeline-in-synapse.png" alt-text="Screenshot that shows selections for creating an empty pipeline directly.":::

Then, in your pipeline, expand the **Move & transform** > **Activities** section and drag **Data flow** onto the canvas for the pipeline.

:::image type="content" source="media/data-flow-create/add-data-flow-to-pipeline-synapse.png" alt-text="Screenshot that shows selections for adding an empty data flow to a pipeline directly.":::

---

## Related content

* [Tutorial: Transform data using mapping data flows](tutorial-data-flow.md)
* [Source transformation in mapping data flows](data-flow-source.md)
