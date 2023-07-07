---
title: 'How to debug pipeline performance issues'
titleSuffix: Azure Machine Learning
description: How to debug pipeline performance issues by using profile feature
ms.reviewer: lagayhar
author: zhanxia
ms.author: zhanxia
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 05/27/2023
ms.custom: designer, pipeline UI
---
# View profiling to debug pipeline performance issues (preview)

Profiling (preview) feature can help you debug pipeline performance issues such as hang, long pole etc. Profiling will list the duration information of each step in a pipeline and provide a Gantt chart for visualization.

Profiling enables you to:

- Quickly find which node takes longer time than expected.
- Identify the time spent of job on each status

To enable this feature:

1. Navigate to Azure Machine Learning studio UI.
2. Select **Manage preview features** (megaphone icon) among the icons on the top right side of the screen.
3. In **Managed preview feature** panel, toggle on **View profiling to debug pipeline performance issues** feature.

## How to find the node that runs totally the longest

1. On the Jobs page, select the job name and enter the job detail page.
1. In the action bar, select **View profiling**. Profiling only works for root level pipeline. It will take a few minutes to load the next page.

    :::image type="content" source="./media/how-to-debug-pipeline-performance/view-profiling.png" alt-text="Screenshot showing the pipeline at root level with the view profiling button highlighted." lightbox= "./media/how-to-debug-pipeline-performance/view-profiling.png":::

1. After the profiler loads, you'll see a Gantt chart. By Default the critical path of a pipeline is shown. A critical path is a subsequence of steps that determine a pipeline job's total duration.

    :::image type="content" source="./media/how-to-debug-pipeline-performance/critical-path.png" alt-text="Screenshot showing the Gantt chart and the critical path." lightbox= "./media/how-to-debug-pipeline-performance/critical-path.png":::

1. To find the step that takes the longest, you can either view the Gantt chart or the table below it.

    In the Gantt chart, the length of each bar shows how long the step takes, steps with a longer bar length take more time. You can also filter the table below by "total duration". When you select a row in the table, it shows you the node in the Gantt chart too. When you select a bar on the Gantt chart it will also highlight it in the table.

    In the table, reuse is denoted with the recycling icon.

    If you select the log icon next the node name it opens the detail page, which shows parameter, code, outputs, logs etc.

    :::image type="content" source="./media/how-to-debug-pipeline-performance/detail-page-from-log-icon.png" alt-text="Screenshot highlighting the log icon and showing the detail page." lightbox= "./media/how-to-debug-pipeline-performance/detail-page-from-log-icon.png":::

    If you're trying to make the queue time shorter for a node, you can change the compute node number and modify job priority to get more compute resources on this one.

## How to find the node that runs the longest in each status

Besides the total duration, you can also sort by durations for each status. For example, you can sort by *Preparing* duration to see which step spends the most time on image building. Then you can open the detail page to find that image building fails because of timeout issue.

### What do I do if a duration issue identified

Status and definitions:

| Status | What does it mean? | Time estimation | Next step |
|------|--------------|-------------|----------|
| Not started | Job is submitted from client side and accepted in Azure Machine Learning services. Time spent in this stage is mainly in Azure Machine Learning service scheduling and preprocessing. | If there's no backend service issue, this time should be short.| Open support case via Azure portal. |
|Preparing | In this status, job is pending for some preparation on job dependencies, for example, environment image building.| If you're using curated or registered custom environment, this time should be short. | Check image building log. |
|Inqueue | Job is pending for compute resource allocation. Time spent in this stage is mainly depending on the status of your compute cluster.| If you're using a cluster with enough compute resource, this time should be short. | Check with workspace admin whether to increase the max nodes of the target compute or change the job to another less busy compute. |
|Running | Job is executing on remote compute. Time spent in this stage is mainly in two parts: <br> Runtime preparation: image pulling, docker starting and data preparation (mount or download). <br> User script execution. | This status is expected to be most time consuming one.	| 1. Go to the source code check if there's any user error. <br>  2. View the monitoring tab of compute metrics (CPU, memory, networking etc.) to identify the bottleneck. <br> 3. Try online debug with [interactive endpoints](how-to-interactive-jobs.md) if the job is running or locally debug of your code. |
| Finalizing | Job is in post processing after execution complete. Time spent in this stage is mainly for some post processes like: output uploading, metric/logs uploading and resources clean up.| It will be short for command job. However, might be very long for PRS/MPI job because for a distributed job, the finalizing status is from the first node starting finalizing to the last node done finalizing. | Change your step job output mode from upload to mount if you find unexpected long finalizing time, or open support case via Azure portal. |

## Different view of Gantt chart

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

## Download the duration table

To export the table, select **Export CSV**.

:::image type="content" source="./media/how-to-debug-pipeline-performance/export-csv.png" alt-text="Screenshot show export csv in profiling." lightbox= "./media/how-to-debug-pipeline-performance/export-csv.png":::

## Next steps

In this article, you learned how to debug pipeline failures. To learn more about how you can use the pipeline, see the following articles:

- [How to build pipeline using python sdk v2](./how-to-create-component-pipeline-python.md)
- [How to build pipeline using python CLI v2](./how-to-create-component-pipelines-cli.md)
- [What is machine learning component](./concept-component.md)
