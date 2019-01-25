---
title: Debug recurring jobs in Azure Data Lake Analytics 
description: Learn how to use Azure Data Lake Tools for Visual Studio to debug an abnormal recurring job.
services: data-lake-analytics
author: yanancai 
ms.author: yanacai
ms.reviewer: jasonwhowell
ms.assetid: dc9b21d8-c5f4-4f77-bcbc-eff458f48de2
ms.service: data-lake-analytics
ms.topic: conceptual
ms.date: 05/20/2018
---

# Troubleshoot an abnormal recurring job

This article shows how to use [Azure Data Lake Tools for Visual Studio](https://aka.ms/adltoolsvs) to troubleshoot problems with recurring jobs. Learn more about pipeline and recurring jobs from the [Azure Data Lake and Azure HDInsight blog](https://blogs.msdn.microsoft.com/azuredatalake/2017/09/19/managing-pipeline-recurring-jobs-in-azure-data-lake-analytics-made-easy/).

Recurring jobs usually share the same query logic and similar input data. For example, imagine that you have a recurring job running every Monday morning at 8 A.M. to count last week’s weekly active user. The scripts for these jobs share one script template that contains the query logic. The inputs for these jobs are the usage data for last week. Sharing the same query logic and similar input usually means that performance of these jobs is similar and stable. If one of your recurring jobs suddenly performs abnormally, fails, or slows down a lot, you might want to:

- See the statistics reports for the previous runs of the recurring job to see what happened.
- Compare the abnormal job with a normal one to figure out what has been changed.

**Related Job View** in Azure Data Lake Tools for Visual Studio helps you accelerate the troubleshooting progress with both cases.

## Step 1: Find recurring jobs and open Related Job View

To use Related Job View to troubleshoot a recurring job problem, you need to first find the recurring job in Visual Studio and then open Related Job View.

### Case 1: You have the URL for the recurring job

Through **Tools** > **Data Lake** > **Job View**, you can paste the job URL to open Job View in Visual Studio. Select **View Related Jobs** to open Related Job View.

![View Related Jobs link in Data Lake Analytics Tools](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/view-related-job.png)
 
### Case 2: You have the pipeline for the recurring job, but not the URL

In Visual Studio, you can open Pipeline Browser through Server Explorer > your Azure Data Lake Analytics account > **Pipelines**. (If you can't find this node in Server Explorer, [download the latest plug-in](https://aka.ms/adltoolsvs).) 

![Selecting the Pipelines node](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/pipeline-browser.png)

In Pipeline Browser, all pipelines for the Data Lake Analytics account are listed at left. You can expand the pipelines to find all recurring jobs, and then select the one that has problems. Related Job View opens at right.

![Selecting a pipeline and opening Related Job View](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/recurring-job-view.png)

## Step 2: Analyze a statistics report

A summary and a statistics report are shown at top of Related Job View. There, you can find the potential root cause of the problem. 

1.	In the report, the X-axis shows the job submission time. Use it to find the abnormal job.
2.	Use the process in the following diagram to check statistics and get insights about the problem and the possible solutions.

![Process diagram for checking statistics](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/recurring-job-metrics-debugging-flow.png)

## Step 3: Compare the abnormal job to a normal job

You can find all submitted recurring jobs through the job list at the bottom of Related Job View. To find more insights and potential solutions, right-click the abnormal job. Use the Job Diff view to compare the abnormal job with a previous normal one.

![Shortcut menu for comparing jobs](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/compare-job.png)

Pay attention to the big differences between these two jobs. Those differences are probably causing the performance problems. To check further, use the steps in the following diagram:

![Process diagram for checking differences between jobs](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/recurring-job-diff-debugging-flow.png)

## Next steps

* [Resolve data-skew problems](data-lake-analytics-data-lake-tools-data-skew-solutions.md)
* [Debug user-defined C# code for failed U-SQL jobs](data-lake-analytics-debug-u-sql-jobs.md)
