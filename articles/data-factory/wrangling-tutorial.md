---
title: Getting started with wrangling data flow in Azure Data Factory 
description: A tutorial on how to prepare data in Azure Data Factory using wrangling data flow 
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.date: 08/10/2023
---

# Prepare data with data wrangling

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Data wrangling in data factory allows you to build interactive Power Query mash-ups natively in ADF and then execute those at scale inside of an ADF pipeline.

## Create a Power Query activity

There are two ways to create a Power Query in Azure Data Factory. One way is to click the plus icon and select **Power Query** in the factory resources pane.

:::image type="content" source="media/data-flow/power-query-wrangling.png" alt-text="Screenshot that shows Power Query in the factory resources pane.":::

The other method is in the activities pane of the pipeline canvas. Open the **Power Query** accordion and drag the **Power Query** activity onto the canvas.

:::image type="content" source="media/data-flow/power-query-activity.png" alt-text="Screenshot that highlights the data wrangling option.":::

## Author a Power Query data wrangling activity

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RWJd3T]
> 
Add a **Source dataset** for your Power Query mash-up. You can either choose an existing dataset or create a new one. After you have saved your mash-up, you can then create a pipeline, add the Power Query data wrangling activity to your pipeline and select a sink dataset to tell ADF where to land your data. While you can choose one or more source datasets, only one sink is allowed at this time. Choosing a sink dataset is optional, but at least one source dataset is required.

:::image type="content" source="media/wrangling-data-flow/tutorial4.png" alt-text="Wrangling":::

Click **Create** to open the Power Query Online mashup editor.

First, you will choose a dataset source for the mashup editor.

:::image type="content" source="media/wrangling-data-flow/power-query-new-source.png" alt-text="Power Query source.":::

Once you have completed building your Power Query, you can save it and then create a pipeline. You need to add the mashup as an activity to your pipeline. That is when you will create/select the sink dataset to land your data. You can also set the sink dataset properties by clicking on the second button on the right side of the sinked dataset. Remember to change the "partition option" under "Optimize" to "Single partition" if you only want to get a single output file.

:::image type="content" source="media/wrangling-data-flow/power-query-new-sink.png" alt-text="Power Query sink.":::

Author your wrangling Power Query using code-free data preparation. For the list of available functions, see [transformation functions](wrangling-functions.md). ADF translates the M script into a data flow script so that you can execute your Power Query at scale using the Azure Data Factory data flow Spark environment.

:::image type="content" source="media/wrangling-data-flow/tutorial6.png" alt-text="Screenshot that shows the process for authoring your data wrangling Power Query.":::

## Running and monitoring a Power Query data wrangling activity

To execute a pipeline debug run of a Power Query activity, click **Debug** in the pipeline canvas. Once you publish your pipeline, **Trigger now** executes an on-demand run of the last published pipeline. Power Query pipelines can be schedule with all existing Azure Data Factory triggers.

:::image type="content" source="media/data-flow/power-query-activity.png" alt-text="Screenshot that shows how to add a Power Query data wrangling activity.":::

Go to the **Monitor** tab to visualize the output of a triggered Power Query activity run.

:::image type="content" source="media/wrangling-data-flow/tutorial2.png" alt-text="Screenshot that shows the output of a triggered wrangling Power Query activity run.":::

## Next steps

Learn how to [create a mapping data flow](tutorial-data-flow.md).
