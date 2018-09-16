---
title: Manage Azure Data Lake Analytics policies
description: Learn how to use policies to control usage of a Data Lake Analytics account.
services: data-lake-analytics
ms.service: data-lake-analytics
author: saveenr
ms.author: saveenr

ms.reviewer: jasonwhowell
ms.assetid: 0a6102d1-7554-4df2-b487-4dae9a7287b6
ms.topic: conceptual
ms.date: 04/30/2018
---
# Manage Azure Data Lake Analytics using policies

Using account policies, you can control how resources an Azure Data Lake Analytics account are used. These policies allow you to control the cost of using Azure Data Lake Analytics. For example, with these policies you can prevent unexpected cost spikes by limiting how many AUs the account can simultaneously use.

## Account-level policies

These policies apply to all jobs in a Data Lake Analytics account.

### Maximum number of AUs in a Data Lake Analytics account
A policy controls the total number of Analytics Units (AUs) your Data Lake Analytics account can use. By default, the value is set to 250. For example, if this value is set to 250 AUs, you can have one job running with 250 AUs assigned to it, or 10 jobs running with 25 AUs each. Additional jobs that are submitted are queued until the running jobs are finished. When running jobs are finished, AUs are freed up for the queued jobs to run.

To change the number of AUs for your Data Lake Analytics account:

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Properties**.
3. Under **Maximum AUs**, move the slider to select a value, or enter the value in the text box. 
4. Click **Save**.

> [!NOTE]
> If you need more than the default (250) AUs, in the portal, click **Help+Support** to submit a support request. The number of AUs available in your Data Lake Analytics account can be increased.
>

### Maximum number of jobs that can run simultaneously
A policy controls how many jobs can run at the same time. By default, this value is set to 20. If your Data Lake Analytics has AUs available, new jobs are scheduled to run immediately until the total number of running jobs reaches the value of this policy. When you reach the maximum number of jobs that can run simultaneously, subsequent jobs are queued in priority order until one or more running jobs complete (depending on AU availability).

To change the number of jobs that can run simultaneously:

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Properties**.
3. Under **Maximum Number of Running Jobs**, move the slider to select a value, or enter the value in the text box. 
4. Click **Save**.

> [!NOTE]
> If you need to run more than the default (20) number of jobs, in the portal, click **Help+Support** to submit a support request. The number of jobs that can run simultaneously in your Data Lake Analytics account can be increased.
>

### How long to keep job metadata and resources 
When your users run U-SQL jobs, the Data Lake Analytics service retains all related files. Related files include the U-SQL script, the DLL files referenced in the U-SQL script, compiled resources, and statistics. The files are in the /system/ folder of the default Azure Data Lake Storage account. This policy controls how long these resources are stored before they are automatically deleted (the default is 30 days). You can use these files for debugging, and for performance-tuning of jobs that you'll rerun in the future.

To change how long to keep job metadata and resources:

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Properties**.
3. Under **Days to Retain Job Queries**, move the slider to select a value, or enter the value in the text box.  
4. Click **Save**.

## Job-level policies

With job-level policies, you can control the maximum AUs and the maximum priority that individual users (or members of specific security groups) can set on jobs that they submit. This policy lets you control the costs incurred by users. It also lets you control the effect that scheduled jobs might have on high-priority production jobs that are running in the same Data Lake Analytics account.

Data Lake Analytics has two policies that you can set at the job level:

* **AU limit per job**: Users can only submit jobs that have up to this number of AUs. By default, this limit is the same as the maximum AU limit for the account.
* **Priority**: Users can only submit jobs that have a priority lower than or equal to this value. A higher number indicates a lower priority. By default, this limit is set to 1, which is the highest possible priority.

There is a default policy set on every account. The default policy applies to all users of the account. You can set additional policies for specific users and groups. 

> [!NOTE]
> Account-level policies and job-level policies apply simultaneously.
>

### Add a policy for a specific user or group

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Properties**.
3. Under **Job Submission Limits**, click the **Add Policy** button. Then, select or enter the following settings:
    1. **Compute Policy Name**: Enter a policy name, to remind you of the purpose of the policy.
    2. **Select User or Group**: Select the user or group this policy applies to.
    3. **Set the Job AU Limit**: Set the AU limit that applies to the selected user or group.
    4. **Set the Priority Limit**: Set the priority limit that applies to the selected user or group.

4. Click **Ok**.

5. The new policy is listed in the **Default** policy table, under **Job Submission Limits**. 

### Delete or edit an existing policy

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Properties**.
3. Under **Job Submission Limits**, find the policy you want to edit.
4.  To see the **Delete** and **Edit** options, in the rightmost column of the table, click `...`.

## Additional resources for job policies
* [Policy overview blog post](https://blogs.msdn.microsoft.com/azuredatalake/2017/06/08/managing-your-azure-data-lake-analytics-compute-resources-overview/)
* [Account-level policies blog post](https://blogs.msdn.microsoft.com/azuredatalake/2017/06/08/managing-your-azure-data-lake-analytics-compute-resources-account-level-policy/)
* [Job-level policies blog post](https://blogs.msdn.microsoft.com/azuredatalake/2017/06/08/managing-your-azure-data-lake-analytics-compute-resources-job-level-policy/)

## Next steps

* [Overview of Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Get started with Data Lake Analytics by using the Azure portal](data-lake-analytics-get-started-portal.md)
* [Manage Azure Data Lake Analytics by using Azure PowerShell](data-lake-analytics-manage-use-powershell.md)

