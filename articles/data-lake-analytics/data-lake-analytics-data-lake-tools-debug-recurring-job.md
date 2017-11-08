---
title: How to troubleshoot an abnormal recurring job | Microsoft Docs
description: 'Learn how to use Azure Data Lake Tools for Visual Studio to debug an abnormal recurring job.'
services: data-lake-analytics
documentationcenter: ''
author: yanancai 
manager:  
editor:  

ms.assetid: dc9b21d8-c5f4-4f77-bcbc-eff458f48de2
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 09/27/2017
ms.author: yanacai

---

# How to troubleshoot an abnormal recurring job

In this document, we will introduce how to use [Azure Data Lake Tools for Visual Studio](http://aka.ms/adltoolsvs) to troubleshoot recurring job problems. Learn more about pipeline and recurring jobs from [here](https://blogs.msdn.microsoft.com/azuredatalake/2017/09/19/managing-pipeline-recurring-jobs-in-azure-data-lake-analytics-made-easy/).
Recurring jobs usually share same query logic and similar input data. For example, you have a recurring job running on every Monday morning at 8 A.M. to count last week’s weekly active user, the scripts for these jobs share one script template which contains the query logic, and the inputs for these jobs are the usage data for last week. Sharing same query logic and similar input usually means performance of these jobs is similar and stable, if one of your recurring jobs suddenly performs abnormal, failed or slow down a lot, you might want to:

1.	See the statistics reports for the previews runs of the recurring job to see what happened.
2.	Compare the abnormal job with a normal one to figure out what has been changed.

**Related Job View** in Azure Data Lake Tools for Visual Studio helps you accelerate the troubleshooting progress with both cases.

## Step 1: Find recurring jobs and open Related Job View

To use Related Job View troubleshoot recurring job problem, you need to first find the recurring job in Visual Studio and then open Related Job View.

### Case 1: You have the URL for the recurring job

Through **Tools > Data Lake > Job View**, you can paste the job URL to open Job View in Visual Studio, and through View Related Jobs to open Related Job View.

![Data Lake Analytics Tools View Related Jobs](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/view-related-job.png)
 
### Case 2: You have the pipeline for the recurring job, but not the URL

In Visual Studio, you can open Pipeline Browser through **Server Explorer > your Data Lake Analytics account > Pipelines** (if you cannot find this node in Server Explorer, please get the lasted tool [here](http://aka.ms/adltoolsvs)). In Pipeline Browser, all pipelines for the ADLA account are listed at left, you can expand the pipelines to find all recurring jobs, click the one has problems, the Related Job View opens at right.

![Data Lake Analytics Tools View Related Jobs](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/pipeline-browser.png)

![Data Lake Analytics Tools View Related Jobs](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/recurring-job-view.png)

## Step 2: Analyze statistics report

A summary and a statistics report are shown at top of Related Job View, through which you can get the potential root cause of the abnormal. 

1.	First you need to find the abnormal job in the report. The X axis shows job submission time, through which you can locate the abnormal job.
2.	Follow below process to check the statistics and get the insights of the abnormal and the possible solutions.

![Data Lake Analytics Tools View Related Jobs](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/recurring-job-metrics-debugging-flow.png)

## Step 3: Compare the abnormal recurring job to a normal job

You can find all submitted recurring jobs through job list at bottom of Related Job View. Through right click you can compare the abnormal job with a previous normal one to find more insights and potential solutions in Job Diff view.

![Data Lake Analytics Tools View Related Jobs](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/compare-job.png)

You usually need to pay attention to the big differences between these 2 jobs as they are probably the reasons causing performance issues, and you can also follow below steps to do a further checking.

![Data Lake Analytics Tools View Related Jobs](./media/data-lake-analytics-data-lake-tools-debug-recurring-job/recurring-job-diff-debugging-flow.png)

## Next steps

* [How to debug and resolve data skew issues](data-lake-analytics-data-lake-tools-data-skew-solutions.md)
* [How to debug U-SQL job failure for user-defined code error](data-lake-analytics-debug-u-sql-jobs.md)