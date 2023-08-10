---
title: Create a mapping data flow
description: How to create an Azure Data Factory mapping data flow
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.topic: quickstart
ms.custom: seo-lt-2019
ms.date: 07/13/2023
---

# Create Azure Data Factory data flows

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

Mapping Data Flows provide a way to transform data at scale without any coding required. You can design a data transformation job in the data flow designer by constructing a series of transformations. Start with any number of source transformations followed by data transformation steps. Then, complete your data flow with sink to land your results in a destination.

## Steps to create a new data flow

# [Azure Data Factory](#tab/data-factory)

Get started by first [creating a new V2 Data Factory](quickstart-create-data-factory-portal.md) from the Azure portal. After creating your new factory, select the **Open Azure Data Factory Studio** tile in the portal to launch the Data Factory Studio.

:::image type="content" source="media/data-flow-create/open-data-factory-studio-from-portal.png" alt-text="Shows a screenshot of how to open the Data Factory Studio from the Azure portal.":::

You can add sample Data Flows from the template gallery. To browse the gallery, select the **Author** tab in Data Factory Studio and click the plus sign to choose **Pipeline** | **Template Gallery**.

:::image type="content" source="media/data-flow-create/open-template-gallery-from-data-factory.png" alt-text="Shows how to open the template gallery in Data Factory.":::

Select the Data Flow category there to choose from the available templates.

:::image type="content" source="media/data-flow-create/template-gallery-filtered-for-data-flow.png" alt-text="Shows the template gallery filtered for data flows.":::

You can also add data flows directly to your data factory without using a template. Select the **Author** tab in Data Factory Studio and click the plus sign to choose **Data Flow** | **Data Flow**.  

:::image type="content" source="media/data-flow-create/create-data-flow-directly.png" alt-text="Shows a screenshot of how to create an empty data flow directly.":::

# [Azure Synapse](#tab/synapse-analytics)

Get started by first [creating a new Synapse Workspace](../synapse-analytics/quickstart-create-workspace.md) from the Azure portal. After creating your new workspace, select the **Open Azure  Studio** tile to launch the Data Factory UI.
    
:::image type="content" source="media/data-flow-create/open-synapse-studio-from-portal.png" alt-text="Shows a screenshot of how to open the Synapse Studio from the Azure portal.":::

You can add sample Data Flows from the template gallery.  To browse the gallery, select the **Integrate** tab in Synapse Studio and click the plus sign to choose **Browse Gallery**.

:::image type="content" source="media/data-flow-create/open-template-gallery-from-synapse.png" alt-text="Shows how to open the template gallery in Data Factory.":::

Filter on Category:Data Flow there to choose from the available templates.

:::image type="content" source="media/data-flow-create/synapse-template-gallery-filtered-for-data-flow.png" alt-text="Shows the template gallery filtered for data flows.":::

You can also add data flows directly to your workspace without using a template. Select the **Integrate** tab in Synapse Studio and click the plus sign to choose **Pipeline**.  Then in your pipeline, expand the **Move & transform** Activities section and drag a **Data flow** onto the canvas for the pipeline.

:::image type="content" source="media/data-flow-create/create-pipeline-in-synapse.png" alt-text="Shows a screenshot of how to create an empty pipeline directly.":::

:::image type="content" source="media/data-flow-create/add-data-flow-to-pipeline-synapse.png" alt-text="Shows a screenshot of how to add an empty data flow to a pipeline directly.":::

---

## Next steps

* [Tutorial: Transform data using mapping data flows](tutorial-data-flow.md)
* Begin building your data transformation with a [source transformation](data-flow-source.md).
