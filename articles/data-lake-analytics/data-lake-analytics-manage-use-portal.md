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
   * **Name**: The name of the Data Lake Analytics account.
   * **Subscription**: The Azure subscription used for the account.
   * **Resource Group**: The Azure resource group in which to create the account. 
   * **Location**: The Azure datacenter for the Data Lake Analytics account. 
   * **Data Lake Store**: The default store to be used for the Data Lake Analytics account. The Data Lake Store account and the Data Lake Analytics account must be in the same location.
4. Click **Create**. 

### Delete a Data Lake Analytics account

Before you delete a Data Lake Analytics account, delete its default Data Lake Store account.

1. Open the Data Lake Analytics account in the portal.
2. Click **Delete**.
3. Type the account name.
4. Click **Delete**.

<!-- ################################ -->
<!-- ################################ -->

## Manage data sources

Data Lake Analytics supports the following data sources:

* Data Lake Store
* Azure Storage

You can use the Data Explorer to browse data sources and perform basic file management operations. 

### Add a data source

1. Open the Data Lake Analytics account in the portal.
2. Click **Data Sources**.
3. Click **Add Data Source**.
    
   * To add a Data Lake Store account, you need the account name and access to the account to be able to query it.
   * To add Azure Blob storage, you need the storage account and the account key. To find them, go to the storage account in the portal.

## Set up firewall rules

You can use Data Lake Analytics to further lock down access to your Data Lake Analytics account at the network level. You can enable a firewall, specify an IP address, or define an IP address range for your trusted clients. After you enable these measures, only clients that have the IP addresses within the defined range can connect to the store.

If other Azure services, such as Azure Data Factory, or VMs connect to the Data Lake Analytics account, make sure that **Allow Azure Services** is turned **On**. 

### Set up a firewall rule

1. Open the Data Lake Analytics account in the portal.
2. On the menu on the left, click **Firewall**.

## Add a new user

The **Add User Wizard** lets you easily provision new Data Lake users.

1. Open an Azure Data Lake Analytics account in the portal.
2. On the left under **Getting Started**, click **Add User Wizard**.
3. Select a user, and click **Select**.
4. Select a role, and click **Select**. To enable a new developer to use Azure Data Lake, select the **Data Lake Analytics Developer** role.
5. Select the ACLs for the U-SQL databases. When you're satisfied with the choices, click **Select**.
6. Select the ACLs for files. For the default store, don't change the ACLs for the root folder "/" and for the /system folder. Click **Select**.
7. Review all the changes to be made by the wizard, and then click **Run**.
8. After the wizard is finished, click **Done**.

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
* Cancel only their own jobs.

### Add users or security groups to a Data Lake Analytics account

1. Open the Data Lake Analytics account in the portal.
2. Click **Access control (IAM)** > **Add**.
3. Select a role.
4. Add a user.
5. Click **OK**.

>[!NOTE]
>If this user or a security group needs to submit jobs, they need permission on the store as well. For more information, see [Secure data stored in Data Lake Store](../data-lake-store/data-lake-store-secure-data.md).
>

<!-- ################################ -->
<!-- ################################ -->

## Manage jobs

### Submit a job

1. Open the Data Lake Analytics account in the portal.

2. Click **New Job**. For each job, you can configure:

    * **Job Name**: The name of the job.
    * **Priority**: Lower numbers have higher priority. If two jobs are queued, the one with lower priority runs first.
    * **Parallelism**: The maximum number of compute processes to reserve for this job.

3. Click **Submit Job**.

### Monitor jobs

1. Open the Data Lake Analytics account in the portal.
2. Click **View All Jobs**. Now you can see a list of all the active and recently finished jobs in the account.
3. Optionally, click **Filter** to help you find the jobs by **Time Range**, **Job Name**, and **Author**. 

## Manage Policies

### Account Level Policies

These policies broadly apply to all jobs in a Data Lake Analytics account.

#### Maximum number of AUs in a Data Lake Analytics account
This policy controls how many AUs this Data Lake Analytics account can use in total. By default, this value is set to 250. For example, if this value is set to 250 AUs. You can have 1 job running with 250 AUs assigned to it, or 10 jobs running with 25 AUs each. Additional jobs submitted will be queued until the running jobs complete and free up enough AUs for the queued jobs to run.

1. Open the Data Lake Analytics account in the portal.

2. Click on **Properties** (located on the left side)

3. You will see a section called **Maximum AUs**. Move the slider or type the value in the text box directly to change this value. 

4. Click **Save**

>[!NOTE]
>If you need more AUs than the default (250), please open a support ticket using the "Help+Support" option in the Azure Portal. We can increase this number for you.
>

#### Control how many jobs can run simultaneously
The policy controls how many jobs can run at the same time. By default, this value is set to 20. If there are AUs available, new jobs will be scheduled for immediate execution until the total number of running jobs reaches the value of this policy. After this point, any subsequent jobs that are submitted will be placed in a queue in priority order until one or more running jobs complete (depending on AU availability).

1. Open the Data Lake Analytics account in the portal.

2. Click on **Properties** (located on the left side)

3. You will see a section called **Maximum Number of Running Jobs**. Move the slider or type the value in the text box directly to change this value. 

4. Click **Save**

>[!NOTE]
>If you need to run more jobs than the default (20), please open a support ticket using the "Help+Support" option in the Azure Portal. We can increase this number for you.
>

#### Amount of time to keep Job metadata and resources 
When your users run U-SQL jobs, the ADLA service keeps all related files like the U-SQL script, the DLLs referenced in the U-SQL script, compiled resources, and statistics etc. in the /system/ folder of the default ADLS account. This policy controls how long to keep these resources stored before automatically cleaning them up (default 30 days). These files can be used for debugging, and performance tuning of the jobs in the future.

1. Open the Data Lake Analytics account in the portal.

2. Click on **Properties** (located on the left side)

3. You will see a section called **Days to Retain Job Queries**. Move the slider or type the value in the text box directly to change this value. 

4. Click **Save**

### Job Level Policies
With job-level policies, you can control the maximum AUs and the maximum priority that individual users (or members of security groups) can set on the jobs that they submit. This allows you to not only control the costs incurred by your users but also control the impact they might have on high priority production jobs running in the same ADLA account.

There are two policies that can be set at a job level:
* **AU Limit per job**: Users can only submit jobs with up to this number of AUs. By default, this limit is the same as the maximum AU limit at the account level.
* **Priority**: Users can only submit jobs with priority lower than or equal to this value. Please note that a higher number means lower priority. By default, this is set to 1 which is the highest possible priority.

There is a "Default" policy set on every account. The default policy applies to all users of the account. Additional policies can be set for specific users and groups. 

>[!NOTE]
> The previously mentioned Account Level Policies work in conjunction with Job Level Policies.
>

#### Adding a policy for a specific user/group
1. Open the Data Lake Analytics account in the portal.

2. Click on **Properties** (located on the left side)

3. You will see a section called **Job Submission Limits**, click the **Add Policy** button.
* **Compute Policy Name**: Give the policy a name to remind you what this policy is about
* **Select User or Group**: Select the user or group this policy will apply to
* **Set the Job AU Limit**: Set the AU Limit that will apply to the previously selected user or group
* **Set the Priority Limit**: Set the Priority limit that will apply to the previously selected user or group

4. Click **Ok**

5. You will see the policy you created under the "Default" policy table under **Job Submission Limits** 

#### Delete/Edit an existing policy
1. Open the Data Lake Analytics account in the portal.

2. Click on **Properties** (located on the left side)

3. You will see a section called **Job Submission Limits**, find the policy you want to edit.

4. Click the **...** option in the right most column of the table to see the **Delete** and **Edit** options.

### Additional resources for Job Policies
* [Policy overview blog post](https://blogs.msdn.microsoft.com/azuredatalake/2017/06/08/managing-your-azure-data-lake-analytics-compute-resources-overview/)
* [Account-level Policy blog post](https://blogs.msdn.microsoft.com/azuredatalake/2017/06/08/managing-your-azure-data-lake-analytics-compute-resources-account-level-policy/)
* [Job-level Policy blog post](https://blogs.msdn.microsoft.com/azuredatalake/2017/06/08/managing-your-azure-data-lake-analytics-compute-resources-job-level-policy/)

## Next steps

* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Get started with Data Lake Analytics by using Azure portal](data-lake-analytics-get-started-portal.md)
* [Manage Azure Data Lake Analytics by using Azure PowerShell](data-lake-analytics-manage-use-powershell.md)

