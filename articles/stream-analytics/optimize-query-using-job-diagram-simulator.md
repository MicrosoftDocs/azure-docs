---
title: Optimize query performance using job diagram simulator (preview)
description: This article provides guidance for evaluating query parallelism and optimizing query execution using a job diagram simulator in Visual Studio Code. 
author: alexlzx
ms.author: zhenxilin
ms.service: stream-analytics
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 10/12/2022
---

# Optimize query using job diagram simulator

One way to improve the performance of an Azure Stream Analytics job is to apply parallelism in query. This article demonstrates how to use the Job Diagram Simulator in Visual Studio Code (VSCode) and evaluate the query parallelism for a Stream Analytics job. You learn to visualize a query execution with different number of streaming units and improve query parallelism based on the edit suggestions. 

## What is parallel query?

Query parallelism divides the workload of a query by creating multiple processes (or streaming nodes) and executes it in parallel. It greatly reduces overall execution time of the query and hence less streaming hours are needed.  

For a job to be parallel, all inputs, outputs and query steps must be aligned and use the same partition keys. The query logic partitioning is determined by the keys used for aggregations (GROUP BY). 

If you want to learn more about query parallelization, see [Leverage query parallelization in Azure Stream Analytics](stream-analytics-parallelization.md).

## How to use job diagram simulator?

You can find the job diagram simulator in the Azure Stream Analytics tools extension for VSCode. If you haven't installed it yet, follow [this guide](quick-create-visual-studio-code.md) to install. 

In this tutorial, you learn to improve query performance based on edit suggestions and make it executed in parallel. As an example, we're using a non-parallel job that takes the input data from an event hub and sends the results to another event hub.


1. Open the Azure Stream Analytics project in VSCode after you finish your query authoring, go to the query file **\*.asaql** and select **Simulate job** to start the job diagram simulation.

    :::image type="content" source="./media/job-diagram-simulator/query-file-simulate-job.png" alt-text="Screenshot of the VSCode opening job diagram simulator in query file." lightbox= "./media/job-diagram-simulator/query-file-simulate-job.png" :::

1. Under the **Diagram** tab, you can see the topology of the Azure Stream Analytics job. It shows the number of streaming nodes allocated to the job and the number of partitions in each streaming node. The below job diagram shows this job isn't in parallel since there's data interaction between the two nodes.

    :::image type="content" source="./media/job-diagram-simulator/diagram-tab.png" alt-text="Screenshot of the VSCode using job diagram simulator and showing job topology." lightbox= "./media/job-diagram-simulator/diagram-tab.png" :::

1. Since this query is **NOT** in parallel, you can select **Enhancements** tab and view suggestions about optimizing query parallelism.
    
    :::image type="content" source="./media/job-diagram-simulator/edit-suggestions.png" alt-text="Screenshot of the VSCode using job diagram simulator and showing the query edit suggestions." lightbox= "./media/job-diagram-simulator/edit-suggestions.png" :::

1. Select query step in the enhancements list, you see the corresponding lines are highlighted and you can edit the query based on the suggestions.

    :::image type="content" source="./media/job-diagram-simulator/query-highlight.png" alt-text="Screenshot of the VSCode using job diagram simulator and highlighting the query step." lightbox= "./media/job-diagram-simulator/query-highlight.png" :::

    > [!NOTE] 
    > These are edit suggestions for improving your query parallelism. However, if you are using aggregate function among all partitions, having a parallel query might not be applicable to your business scenarios. 

1. For this example, you add the **PartitionId** to line#22 and save your change. Then you can use **Refresh simulation** to get the new diagram as below. 

    :::image type="content" source="./media/job-diagram-simulator/refresh-simulation-after-update-query.png" alt-text="Screenshot that shows the refresh diagram after updating query." lightbox= "./media/job-diagram-simulator/refresh-simulation-after-update-query.png" :::


1. You can also adjust **Streaming Units** to stimulate how streaming nodes are allocated with different SUs. It will give you an idea of how many SUs you need to maximize the query performance. 
    
    :::image type="content" source="./media/job-diagram-simulator/job-diagram-simulator-adjust-su.png" alt-text="Screenshot of the VSCode using SU adjuster." lightbox= "./media/job-diagram-simulator/job-diagram-simulator-adjust-su.png" :::



## Enhancement suggestions

Here are the explanations for Enhancements: 

| **Type**  | **Meaning**  |
| --------- | --------- |
| Customized partition not supported | Change input ‘xxx’ partition key to ‘xxx’. |
| Number of partitions not matched   | Input and output must have the same number of partitions. |
| Partition keys not matched    | Input, output and each query step must use the same partition key. |
| Number of input partitions not matched | All inputs must have the same number of partitions. |
| Input partition keys not matched | All inputs must use the same partition key. |
| Low compatibility level | Upgrade **CompatibilityLevel** on **JobConfig.json** file. |
| Output partition key not found | You need to use specified partition key for the output. |
| Customized partition not supported | You can only use pre-defined partition keys.  |
| Query step not using partition | Your query isn't using any PARTITION BY clause. |


## Next steps
If you want to learn more about query parallelization and job diagram, check out these tutorials: 

* [Debug queries using job diagram](debug-locally-using-job-diagram-vs-code.md)
* [Stream Analytics job diagram (preview) in Azure portal](./job-diagram-with-metrics.md)
* [Debugging with the physical job diagram (preview) in Azure portal](./stream-analytics-job-physical-diagram-with-metrics.md).
