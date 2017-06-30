---
title: Manage Azure Data Lake Analytics by using the Azure portal | Microsoft Docs
description: Learn how to manage Data Lake Analytics acounts, data sources, users, and jobs.
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: saveenr
editor: cgronlun

ms.assetid: a0e045f1-73d6-427f-868d-7b55c10f811b
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 12/05/2016
ms.author: edmaca

---
# Manage Azure Data Lake Analytics by using the Azure portal
[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

Learn how to manage Azure Data Lake Analytics accounts, account data sources, users, and jobs by using the Azure portal. To see management topics about using other tools, click a tab at the top of the page.

<!-- ################################ -->
<!-- ################################ -->

## Manage Data Lake Analytics accounts

### Create an account

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **New** > **Intelligence + analytics** > **Data Lake Analytics**.
3. Select values for the following items: 
   1. **Name**: The name of the Data Lake Analytics account.
   2. **Subscription**: The Azure subscription used for the account.
   3. **Resource Group**: The Azure resource group in which to create the account. 
   4. **Location**: The Azure datacenter for the Data Lake Analytics account. 
   5. **Data Lake Store**: The default store to be used for the Data Lake Analytics account. The Azure Data Lake Store account and the Data Lake Analytics account must be in the same location.
4. Click **Create**. 

### Delete a Data Lake Analytics account

Before you delete a Data Lake Analytics account, delete its default Data Lake Store account.

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Delete**.
3. Type the account name.
4. Click **Delete**.

<!-- ################################ -->
<!-- ################################ -->

## Manage data sources

Data Lake Analytics supports the following data sources:

* Data Lake Store
* Azure Storage

You can use Data Explorer to browse data sources and perform basic file management operations. 

### Add a data source

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Data Sources**.
3. Click **Add Data Source**.
    
   * To add a Data Lake Store account, you need the account name and access to the account to be able to query it.
   * To add Azure Blob storage, you need the storage account and the account key. To find them, go to the storage account in the portal.

## Set up firewall rules

You can use Data Lake Analytics to further lock down access to your Data Lake Analytics account at the network level. You can enable a firewall, specify an IP address, or define an IP address range for your trusted clients. After you enable these measures, only clients that have the IP addresses within the defined range can connect to the store.

If other Azure services, like Azure Data Factory or VMs, connect to the Data Lake Analytics account, make sure that **Allow Azure Services** is turned **On**. 

### Set up a firewall rule

1. In the Azure portal, go to your Data Lake Analytics account.
2. On the menu on the left, click **Firewall**.

## Add a new user

You can use the **Add User Wizard** to easily provision new Data Lake users.

1. In the Azure portal, go to your Data Lake Analytics account.
2. On the left, under **Getting Started**, click **Add User Wizard**.
3. Select a user, and then click **Select**.
4. Select a role, and then click **Select**. To set up a new developer to use Azure Data Lake, select the **Data Lake Analytics Developer** role.
5. Select the access control lists (ACLs) for the U-SQL databases. When you're satisfied with your choices, click **Select**.
6. Select the ACLs for files. For the default store, don't change the ACLs for the root folder "/" and for the /system folder. Click **Select**.
7. Review all your selected changes, and then click **Run**.
8. When the wizard is finished, click **Done**.

## Manage Role-Based Access Control

Like other Azure services, you can use Role-Based Access Control (RBAC) to control how users interact with the service.

The standard RBAC roles have the following capabilities:
* **Owner**: Can submit jobs, monitor jobs, cancel jobs from any user, and configure the account.
* **Contributor**: Can submit jobs, monitor jobs, cancel jobs from any user, and configure the account.
* **Reader**: Can monitor jobs.

Use the Data Lake Analytics Developer role to enable U-SQL developers to use the Data Lake Analytics service. You can use the Data Lake Analytics Developer role to:
* Submit jobs.
* Monitor job status and the progress of jobs submitted by any user.
* See the U-SQL scripts from jobs submitted by any user.
* Cancel only your own jobs.

### Add users or security groups to a Data Lake Analytics account

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Access control (IAM)** > **Add**.
3. Select a role.
4. Add a user.
5. Click **OK**.

>[!NOTE]
>If a user or a security group needs to submit jobs, they also need permission on the store account. For more information, see [Secure data stored in Data Lake Store](../data-lake-store/data-lake-store-secure-data.md).
>

<!-- ################################ -->
<!-- ################################ -->

## Manage jobs

### Submit a job

1. In the Azure portal, go to your Data Lake Analytics account.

2. Click **New Job**. For each job,  configure:

    1. **Job Name**: The name of the job.
    2. **Priority**: Lower numbers have higher priority. If two jobs are queued, the one with lower priority value runs first.
    3. **Parallelism**: The maximum number of compute processes to reserve for this job.

3. Click **Submit Job**.

### Monitor jobs

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **View All Jobs**. A list of all the active and recently finished jobs in the account is shown.
3. Optionally, click **Filter** to help you find the jobs by **Time Range**, **Job Name**, and **Author** values. 

## Manage policies

### Account-level policies

These policies apply to all jobs in a Data Lake Analytics account.

#### Maximum number of AUs in a Data Lake Analytics account
A policy controls the total number of Analytics Units (AUs) your Data Lake Analytics account can use. By default, the value is set to 250. For example, if this value is set to 250 AUs, you can have one job running with 250 AUs assigned to it, or 10 jobs running with 25 AUs each. Additional jobs that are submitted are queued until the running jobs are finished. When running jobs are finished, AUs are freed up for the queued jobs to run.

To change the number of AUs for your Data Lake Analytics account:

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Properties**.
3. Under **Maximum AUs**, move the slider to select a value, or enter the value in the text box. 
4. Click **Save**

> [!NOTE]
> If you need more than the default (250) AUs, in the portal, click **Help+Support** to submit a support request. The number of AUs available in your Data Lake Analytics account can be increased.
>

#### Maximum number of jobs that can run simultaneously
A policy controls how many jobs can run at the same time. By default, this value is set to 20. If your Data Lake Analytics has AUs available, new jobs are scheduled to run immediately until the total number of running jobs reaches the value of this policy. When you reach the maximum number of jobs that can run simultaneously, subsequent jobs are queued in priority order until one or more running jobs complete (depending on AU availability).

To change the number of jobs that can run simultaneously:

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Properties**.
3. Under **Maximum Number of Running Jobs**, move the slider to select a value, or enter the value in the text box. 
4. Click **Save**

> [!NOTE]
> If you need to run more than the default (20) number of jobs, in the portal, click **Help+Support** to submit a support request. The number of jobs that can run simultaneously in your Data Lake Analytics account can be increased.
>

#### How long to keep job metadata and resources 
When your users run U-SQL jobs, the Data Lake Analytics service retains all related files. Related files include the U-SQL script, the DLL files referenced in the U-SQL script, compiled resources, and statistics. The files are in the /system/ folder of the default Azure Data Lake Storage account. This policy controls how long these resources are stored before they are automatically deleted (the default is 30 days). You can use these files for debugging, and for performance-tuning of jobs that you'll rerun in the future.

To change how long to keep job metadata and resources:

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Properties**.
3. Under **Days to Retain Job Queries**, move the slider to select a value, or enter the value in the text box.  
4. Click **Save**

### Job-level policies
With job-level policies, you can control the maximum AUs and the maximum priority that individual users (or members of specific security groups) can set on jobs that they submit. This lets you control the costs incurred by users. It also lets you control the effect that scheduled jobs might have on high-priority production jobs that are running in the same Data Lake Analytics account.

Data Lake Analytics has two policies that you can set at the job level:

* **AU limit per job**: Users can only submit jobs that have up to this number of AUs. By default, this limit is the same as the maximum AU limit for the account.
* **Priority**: Users can only submit jobs that have a priority lower than or equal to this value. Note that a higher number means a lower priority. By default, this is set to 1, which is the highest possible priority.

There is a default policy set on every account. The default policy applies to all users of the account. You can set additional policies for specific users and groups. 

> [!NOTE]
> Account-level policies work in conjunction with job-level policies.
>

#### Add a policy for a specific user or group

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Properties**.
3. Under **Job Submission Limits**, click the **Add Policy** button. Then, select or enter the following settings:
    1. **Compute Policy Name**: Enter a policy name, to remind you of the purpose of the policy.
    2. **Select User or Group**: Select the user or group this policy applies to.
    3. **Set the Job AU Limit**: Set the AU limit that applies to the selected user or group.
    4. **Set the Priority Limit**: Set the priority limit that applies to the selected user or group.

4. Click **Ok**

5. The new policy is listed in the **Default** policy table, under **Job Submission Limits**. 

#### Delete or edit an existing policy

1. In the Azure portal, go to your Data Lake Analytics account.
2. Click **Properties**.
3. Under **Job Submission Limits**, find the policy you want to edit.
4.  To see the **Delete** and **Edit** options, in the rightmost column of the table, click **...**.

### Additional resources for job policies
* [Policy overview blog post](https://blogs.msdn.microsoft.com/azuredatalake/2017/06/08/managing-your-azure-data-lake-analytics-compute-resources-overview/)
* [Account-level policies blog post](https://blogs.msdn.microsoft.com/azuredatalake/2017/06/08/managing-your-azure-data-lake-analytics-compute-resources-account-level-policy/)
* [Job-level policies blog post](https://blogs.msdn.microsoft.com/azuredatalake/2017/06/08/managing-your-azure-data-lake-analytics-compute-resources-job-level-policy/)

## Next steps

* [Overview of Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Get started with Data Lake Analytics by using the Azure portal](data-lake-analytics-get-started-portal.md)
* [Manage Azure Data Lake Analytics by using Azure PowerShell](data-lake-analytics-manage-use-powershell.md)

