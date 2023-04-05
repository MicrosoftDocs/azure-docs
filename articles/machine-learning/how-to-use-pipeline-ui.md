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
ms.date: 12/22/2022
ms.custom: designer, event-tier1-build-2022
---

# How to use studio UI to build and debug Azure Machine Learning pipelines

Azure Machine Learning studio provides UI to build and debug your pipeline. You can use components to author a pipeline in the designer, and you can debug your pipeline in the job detail page.

This article introduces how to use the studio UI to build and debug machine learning pipelines.

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Build machine learning pipeline

### Drag and drop components to build pipeline

>[!Note]
> Designer supports two type of components, classic prebuilt components and custom components. These two types of components are not compatible.  
>
>Classic prebuilt components provides prebuilt components majorly for data processing and traditional machine learning tasks like regression and classification. This type of component continues to be supported but will not have any new components added.
>
>
>Custom components allow you to provide your own code as a component. It supports sharing across workspaces and seamless authoring across Studio, CLI, and SDK interfaces.
>
>In this article, we will create pipeline using custom components. 

In the designer homepage, you can select **New pipeline -> Custom** to open a blank pipeline draft.

In the asset library left of the canvas, there are **Data**,**Model** and **Component** tabs, which contain data, model and components registered to the workspace. For what is component and how to create custom component, you can refer to the [component concept article](concept-component.md). 


:::image type="content" source="./media/how-to-use-pipeline-ui/asset-library.png" alt-text="Screenshot showing the asset library with filter by selected." lightbox= "./media/how-to-use-pipeline-ui/asset-library.png":::

Then you can drag and drop components, data and model to build a pipeline. You can construct your pipeline or configure your components in any order. Just hide the right pane to construct your pipeline first, and open the right pane to configure your component.


:::image type="content" source="./media/how-to-use-pipeline-ui/hide-right-pane.png" alt-text="Screenshot showing the close and open button." lightbox= "./media/how-to-use-pipeline-ui/hide-right-pane.png":::

### Submit pipeline

Now you've built your pipeline. Select **Submit** button above the canvas, and configure your pipeline job.

:::image type="content" source="./media/how-to-use-pipeline-ui/submit-pipeline.png" alt-text="Screenshot showing setup pipeline job with the submit button highlighted." lightbox= "./media/how-to-use-pipeline-ui/submit-pipeline.png":::

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

#### Try the optimized submission wizard(preview)

There is an optimized pipeline submission wizard to streamline your pipeline submission experience. It provides spacious space to edit pipeline inputs and outputs, and the ability to modify runtime settings, such as the default compute, at the time of submission.

To enable this feature:
1. Navigate to Azure Machine Learning studio UI.
2. Select Manage preview features (megaphone icon) among the icons on the top right side of the screen.
3. In Managed preview feature panel, toggle on **Submit pipeline jobs using the optimized submission wizard**


:::image type="content" source="./media/how-to-use-pipeline-ui/enable-submission-wizard.png" alt-text="Screenshot showing how to enable submission wizard." lightbox= "./media/how-to-use-pipeline-ui/enable-submission-wizard.png":::

After enabling the pipeline submission wizard, select **Configure & Submit** button on the top right to submit the pipeline job.

Then you will see a step-by-step wizard, which allows you to edit pipeline inputs & outputs, and change runtime settings before submitting the pipeline job. Follow the wizard to submit the pipeline job.

:::image type="content" source="./media/how-to-use-pipeline-ui/submission-wizard.png" alt-text="Screenshot showing the inputs & outputs tab of the submission wizard." lightbox= "./media/how-to-use-pipeline-ui/submission-wizard.png":::








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

## Compare different pipelines to debug failure or other unexpected issues (preview)

Pipeline comparison identifies the differences (including topology, component properties, and job properties) between multiple jobs. For example you can compare a successful pipeline and a failed pipeline, which helps you find what modifications make your pipeline fail.

Two major scenarios where you can use pipeline comparison to help with debugging:

- Debug your failed pipeline job by comparing it to a completed one.
- Debug your failed node in a pipeline by comparing it to a similar completed one.

To enable this feature:

1. Navigate to Azure Machine Learning studio UI.
2. Select **Manage preview features** (megaphone icon) among the icons on the top right side of the screen.
3. In **Managed preview feature** panel, toggle on **Compare pipeline jobs to debug failures or unexpected issues** feature.

:::image type="content" source="./media/how-to-use-pipeline-ui/enable-preview.png" alt-text="Screenshot of manage preview features toggled on." lightbox= "./media/how-to-use-pipeline-ui/enable-preview.png":::

### How to debug your failed pipeline job by comparing it to a completed one

During iterative model development, you may have a baseline pipeline, and then do some modifications such as changing a parameter, dataset or compute resource, etc. If your new pipeline failed, you can use pipeline comparison to identify what has changed by comparing it to the baseline pipeline, which could help with figuring out why it failed.

#### Compare a pipeline with its parent

The first thing you should check when debugging is to locate the failed node and check the logs.

For example, you may get an error message showing that your pipeline failed due to out-of-memory. If your pipeline is cloned from a completed parent pipeline, you can use pipeline comparison to see what has changed.

1. Select **Show lineage**.
1. Select the link under "Cloned From". This will open a new browser tab with the parent pipeline.

      :::image type="content" source="./media/how-to-use-pipeline-ui/cloned-from.png" alt-text="Screenshot showing the cloned from link, with the previous step, the lineage button highlighted." lightbox= "./media/how-to-use-pipeline-ui/cloned-from.png":::

1. Select **Add to compare** on the failed pipeline and the parent pipeline. This will add them in the comparison candidate list.

      :::image type="content" source="./media/how-to-use-pipeline-ui/comparison-list.png" alt-text="Screenshot showing the comparison list with a parent and child pipeline added." lightbox= "./media/how-to-use-pipeline-ui/comparison-list.png":::

### Compare topology

Once the two pipelines are added to the comparison list, you'll have two options: **Compare detail** and **Compare graph**. **Compare graph** allows you to compare pipeline topology.

**Compare graph** shows you the graph topology changes between pipeline A and B. The special nodes in pipeline A are highlighted in red and marked with "A only". The special nodes in pipeline B are in green and marked with "B only". The shared nodes are in gray. If there are differences on the shared nodes, what has been changed is shown on the top of node.

There are three categories of changes with summaries viewable in the detail page, parameter change, input source, pipeline component. When the pipeline component is changed this means that there's a topology change inside or an inner node parameter change, you can select the folder icon on the pipeline component node to dig down into the details. Other changes can be detected by viewing the colored nodes in the compare graph.

   :::image type="content" source="./media/how-to-use-pipeline-ui/parameter-changed.png" alt-text="Screenshot showing the parameter changed and the component information tab." lightbox= "./media/how-to-use-pipeline-ui/parameter-changed.png":::

### Compare pipeline meta info and properties

If you investigate the dataset difference and find that data or topology doesn't seem to be the root cause of failure, you can also check the pipeline details like pipeline parameter, output or run settings.

**Compare graph** is used to compare pipeline topology, **Compare detail** is used to compare pipeline properties link meta info or settings.

To access the detail comparison, go to the comparison list, select **Compare details** or select **Show compare details** on the pipeline comparison page.

You'll see *Pipeline properties* and *Run properties*.

- Pipeline properties include pipeline parameters, run and output setting, etc.
- Run properties include job status, submit time and duration, etc.

The following screenshot shows an example of using the detail comparison, where the default compute setting might have been the reason for failure.

:::image type="content" source="./media/how-to-use-pipeline-ui/compute.png" alt-text="Screenshot showing the comparison overview of the default compute." lightbox= "./media/how-to-use-pipeline-ui/compute.png":::

To quickly check the topology comparison, select the pipeline name and select **Compare graph**.

:::image type="content" source="./media/how-to-use-pipeline-ui/compare-graph.png" alt-text="Screenshot of detail comparison with compare graph highlighted." lightbox= "./media/how-to-use-pipeline-ui/compare-graph.png":::

### How to debug your failed node in a pipeline by comparing to similar completed node

If you only updated node properties and changed nothing in the pipeline, then you can debug the node by comparing it with the jobs that are submitted from the same component.

#### Find the job to compare with

1. Find a successful job to compare with by viewing all runs submitted from the same component.
    1. Right select the failed node and select *View Jobs*. This will give you a list of all the jobs.
  
        :::image type="content" source="./media/how-to-use-pipeline-ui/view-jobs.png" alt-text="Screenshot that shows a failed node with view jobs highlighted." lightbox= "./media/how-to-use-pipeline-ui/view-jobs.png":::

    1. Choose a completed job as a comparison target.
1. After you found a failed and completed job to compare with, add the two jobs to the comparison candidate list.
    1. For the failed node, right select and select *Add to compare*.
    1. For the completed job, go to its parent pipeline and located the completed job. Then select *Add to compare*.
1. Once the two jobs are in the comparison list, select **Compare detail** to show the differences.

### Share the comparison results

To share your comparison results select **Share** and copying the link. For example, you might find out that the dataset difference might of lead to the failure but you aren't a dataset specialist, you can share the comparison result with a data engineer on your team.

:::image type="content" source="./media/how-to-use-pipeline-ui/share.png" alt-text="Screenshot showing the share button and the link you should copy." lightbox= "./media/how-to-use-pipeline-ui/share.png":::

## View profiling to debug pipeline performance issues (preview)

Profiling (preview) can help you debug pipeline performance issues such as hang, long pole etc. Profiling will list the duration information of each step in a pipeline and provide a Gantt chart for visualization.

Profiling enables you to:

- Quickly find which node takes longer time than expected.
- Identify the time spent of job on each status

To enable this feature:

1. Navigate to Azure Machine Learning studio UI.
2. Select **Manage preview features** (megaphone icon) among the icons on the top right side of the screen.
3. In **Managed preview feature** panel, toggle on **View profiling to debug pipeline performance issues** feature.

### How to find the node that runs totally the longest

1. On the Jobs page, select the job name and enter the job detail page.
1. In the action bar, select **View profiling**. Profiling only works for root level pipeline. It will take a few minutes to load the next page.

    :::image type="content" source="./media/how-to-use-pipeline-ui/view-profiling.png" alt-text="Screenshot showing the pipeline at root level with the view profiling button highlighted." lightbox= "./media/how-to-use-pipeline-ui/view-profiling.png":::

1. After the profiler loads, you'll see a Gantt chart. By Default the critical path of a pipeline is shown. A critical path is a subsequence of steps that determine a pipeline job's total duration.

    :::image type="content" source="./media/how-to-use-pipeline-ui/critical-path.png" alt-text="Screenshot showing the Gantt chart and the critical path." lightbox= "./media/how-to-use-pipeline-ui/critical-path.png":::

1. To find the step that takes the longest, you can either view the Gantt chart or the table below it.

    In the Gantt chart, the length of each bar shows how long the step takes, steps with a longer bar length take more time. You can also filter the table below by "total duration". When you select a row in the table, it will show you the node in the Gantt chart too. When you select a bar on the Gantt chart it will also highlight it in the table.

    In the table, reuse is denoted with the recycling icon.

    If you select the log icon next the node name it will open the detail page, which shows parameter, code, outputs, logs etc.

    :::image type="content" source="./media/how-to-use-pipeline-ui/detail-page-from-log-icon.png" alt-text="Screenshot highlighting the log icon and showing the detail page." lightbox= "./media/how-to-use-pipeline-ui/detail-page-from-log-icon.png":::

    If you're trying to make the queue time shorter for a node, you can change the compute node number and modify job priority to get more compute resources on this one.

### How to find the node that runs the longest in each status

Besides the total duration, you can also sort by durations for each status. For example, you can sort by *Preparing* duration to see which step spends the most time on image building. Then you can open the detail page to find that image building fails because of timeout issue.

#### What do I do if a duration issue identified

Status and definitions:

| Status | What does it mean? | Time estimation | Next step |
|------|--------------|-------------|----------|
| Not started | Job is submitted from client side and accepted in Azure Machine Learning services. Time spent in this stage is mainly in Azure Machine Learning service scheduling and preprocessing. | If there's no backend service issue, this time should be very short.| Open support case via Azure portal. |
|Preparing | In this status, job is pending for some preparation on job dependencies, for example, environment image building.| If you're using curated or registered custom environment, this time should be very short. | Check image building log. |
|Inqueue | Job is pending for compute resource allocation. Time spent in this stage is mainly depending on the status of your compute cluster.| If you're using a cluster with enough compute resource, this time should be short. | Check with workspace admin whether to increase the max nodes of the target compute or change the job to another less busy compute. |
|Running | Job is executing on remote compute. Time spent in this stage is mainly in two parts: <br> Runtime preparation: image pulling, docker starting and data preparation (mount or download). <br> User script execution. | This status is expected to be most time consuming one.	| 1. Go to the source code check if there's any user error. <br>  2. View the monitoring tab of compute metrics (CPU, memory, networking etc.) to identify the bottleneck. <br> 3. Try online debug with [interactive endpoints](how-to-interactive-jobs.md) if the job is running or locally debug of your code. |
| Finalizing | Job is in post processing after execution complete. Time spent in this stage is mainly for some post processes like: output uploading, metric/logs uploading and resources clean up.| It will be short for command job. However, might be very long for PRS/MPI job because for a distributed job, the finalizing status is from the first node starting finalizing to the last node done finalizing. | Change your step job output mode from upload to mount if you find unexpected long finalizing time, or open support case via Azure portal. |

### Different view of Gantt chart

- Critical path
  - You'll see only the step jobs in the pipeline's critical path (jobs that have a dependency).
  - By default the critical path of the pipeline job is shown.
- Flatten view
  - You'll see all step jobs.
  - In this view, you'll see more nodes than in critical path.
- Compact view
  - You'll only see step jobs that are longer than 30 seconds.
- Hierarchical view.
  - You'll see all jobs including pipeline component jobs and step jobs.

### Download the duration table

To export the table, select **Export CSV**.

## Next steps

In this article, you learned the key features in how to create, explore, and debug a pipeline in UI. To learn more about how you can use the pipeline, see the following articles:

+ [How to train a model in the designer](tutorial-designer-automobile-price-train-score.md)
+ [How to deploy model to real-time endpoint in the designer](tutorial-designer-automobile-price-deploy.md)
+ [What is machine learning component](concept-component.md)
