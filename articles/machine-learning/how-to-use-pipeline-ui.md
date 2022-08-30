---
title: 'How to use studio UI to build and debug Machine Learning pipelines'
titleSuffix: Azure Machine Learning
description: Learn how to build, debug, clone, and compare V2 pipeline with the studio UI. 
ms.reviewer: lagayhar
author: likebupt
ms.author: keli19
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 05/10/2022
ms.custom: designer, event-tier1-build-2022
---

# How to use studio UI to build and debug Azure Machine Learning pipelines

Azure Machine Learning studio provides UI to build and debug your pipeline. You can use components to author a pipeline in the designer, and you can debug your pipeline in the job detail page.

This article will introduce how to use the studio UI to build and debug machine learning pipelines.

## Build machine learning pipeline

### Drag and drop components to build pipeline

In the designer homepage, you can select **New pipeline** to open a blank pipeline draft.

In the asset library left of the canvas, there are **Data assets** and **Components** tabs, which contain components and data registered to the workspace. For what is component and how to create custom component, you can refer to the [component concept article](concept-component.md).

You can quickly filter **My assets** or **Designer built-in assets**.

:::image type="content" source="./media/how-to-use-pipeline-ui/asset-library.png" alt-text="Screenshot showing the asset library with filter by selected." lightbox= "./media/how-to-use-pipeline-ui/asset-library.png":::

Then you can drag and drop either built-in components or custom components to the canvas. You can construct your pipeline or configure your components in any order. Just hide the right pane to construct your pipeline first, and open the right pane to configure your component.

> [!NOTE]
> Currently built-in components and custom components cannot be used together.

:::image type="content" source="./media/how-to-use-pipeline-ui/hide-right-pane.png" alt-text="Screenshot showing the close and open button." lightbox= "./media/how-to-use-pipeline-ui/hide-right-pane.png":::

### Submit pipeline

Now you've built your pipeline. Select **Submit** button above the canvas, and configure your pipeline job.

:::image type="content" source="./media/how-to-use-pipeline-ui/submit-pipeline.png" alt-text="Screenshot showing set up pipeline job with the submit button highlighted." lightbox= "./media/how-to-use-pipeline-ui/submit-pipeline.png":::

After you submit your pipeline job, you'll see a submitted job list in the left pane, which shows all the pipeline job you create from the current pipeline draft in the same session. There's also notification popping up from the notification center. You can select through the pipeline job link in the submission list or the notification to check pipeline job status or debugging.

> [!NOTE]
> Pipeline job status and results will not be filled back to the authoring page.

If you want to try a few different parameter values for the same pipeline, you can change values and submit for multiple times, without having to waiting for the running status.

:::image type="content" source="./media/how-to-use-pipeline-ui/submission-list.png" alt-text="Screenshot showing submitted job list and notification." lightbox= "./media/how-to-use-pipeline-ui/submission-list.png":::

> [!NOTE]
> The submission list only contains jobs submitted in the same session.
> If you refresh current page, it will not preserve the previous submitted job list.

On the pipeline job detail page, you can check the status of the overall job and each node inside, and logs of each node.

:::image type="content" source="./media/how-to-use-pipeline-ui/pipeline-job-detail-page.png" alt-text="Screenshot showing pipeline job detail page." lightbox= "./media/how-to-use-pipeline-ui/pipeline-job-detail-page.png":::

## Debug your pipeline in job detail page

### Using outline to quickly find node

In pipeline job detail page, there's an outline left to the canvas, which shows the overall structure of your pipeline job. Hovering on any row, you can select the "Locate" button to locate that node in the canvas.

:::image type="content" source="./media/how-to-use-pipeline-ui/outline.png" alt-text="Screenshot showing outline and locate in the canvas." lightbox= "./media/how-to-use-pipeline-ui/outline.png":::

You can filter failed or completed nodes, and filter by only components or dataset for further search. The left pane will show the matched nodes with more information including status, duration, and created time.

:::image type="content" source="./media/how-to-use-pipeline-ui/quick-filter.png" alt-text="Screenshot showing the quick filter by in outline > search." lightbox= "./media/how-to-use-pipeline-ui/quick-filter.png":::

You can also sort the filtered nodes.

:::image type="content" source="./media/how-to-use-pipeline-ui/sort.png" alt-text="Screenshot of sorting search result in outline > search." lightbox= "./media/how-to-use-pipeline-ui/sort.png":::

### Check logs and outputs of component

If your pipeline fails or gets stuck on a node, first view the logs.

1. You can select the specific node and open the right pane.

1. Select **Outputs+logs** tab and you can explore all the outputs and logs of this node.

    The **user_logs folder** contains information about user code generated logs. This folder is open by default, and the **std_log.txt** log is selected. The **std_log.txt** is where your code's logs (for example, print statements) show up.

    The **system_logs folder** contains logs generated by Azure Machine Learning. Learn more about [View and download diagnostic logs](how-to-log-view-metrics.md#view-and-download-diagnostic-logs).

    ![How to check node logs](media/how-to-use-pipeline-ui/node-logs.gif)

    If you don't see those folders, this is due to the compute run time update isn't released to the compute cluster yet, and you can look at **70_driver_log.txt** under **azureml-logs** folder first.


## Clone a pipeline job to continue editing

If you would like to work based on an existing pipeline job in the workspace, you can easily clone it into a new pipeline draft to continue editing.

:::image type="content" source="./media/how-to-use-pipeline-ui/job-detail-clone.png" alt-text="Screenshot of a pipeline job in the workspace with the clone button highlighted." lightbox= "./media/how-to-use-pipeline-ui/job-detail-clone.png":::

After cloning, you can also know which pipeline job it's cloned from by selecting **Show lineage**.

:::image type="content" source="./media/how-to-use-pipeline-ui/draft-show-lineage.png" alt-text="Screenshot showing the draft lineage after selecting show lineage button." lightbox= "./media/how-to-use-pipeline-ui/draft-show-lineage.png":::

You can edit your pipeline and then submit again. After submitting, you can see the lineage between the job you submit and the original job by selecting **Show lineage** in the job detail page.

## Next steps

In this article, you learned the key features in how to create, explore, and debug a pipeline in UI. To learn more about how you can use the pipeline, see the following articles:

+ [How to train a model in the designer](tutorial-designer-automobile-price-train-score.md)
+ [How to deploy model to real-time endpoint in the designer](tutorial-designer-automobile-price-deploy.md)
+ [What is machine learning component](concept-component.md)
