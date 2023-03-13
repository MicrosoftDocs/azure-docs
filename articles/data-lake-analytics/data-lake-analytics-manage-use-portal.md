---
title: Manage Azure Data Lake Analytics by using the Azure portal
description: This article describes how to use the Azure portal to manage Data Lake Analytics accounts, data sources, users, & jobs.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 11/15/2022
ms.custom: subject-rbac-steps
---
# Manage Azure Data Lake Analytics using the Azure portal
[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

[!INCLUDE [retirement-flag-creation](includes/retirement-flag-creation.md)]

This article describes how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs by using the Azure portal.

## Manage Data Lake Analytics accounts

### Create an account

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Create a resource** and search for **Data Lake Analytics**.
3. Select values for the following items: 
   1. **Name**: The name of the Data Lake Analytics account.
   2. **Subscription**: The Azure subscription used for the account.
   3. **Resource Group**: The Azure resource group in which to create the account. 
   4. **Location**: The Azure datacenter for the Data Lake Analytics account. 
   5. **Data Lake Store**: The default store to be used for the Data Lake Analytics account. The Azure Data Lake Store account and the Data Lake Analytics account must be in the same location.
4. Select **Create**. 

### Delete a Data Lake Analytics account

Before you delete a Data Lake Analytics account, delete its default Data Lake Store account.

1. In the Azure portal, go to your Data Lake Analytics account.
2. Select **Delete**.
3. Type the account name.
4. Select **Delete**.


## Manage data sources

Data Lake Analytics supports the following data sources:

* Data Lake Store
* Azure Storage

You can use Data Explorer to browse data sources and perform basic file management operations. 

### Add a data source

1. In the Azure portal, go to your Data Lake Analytics account.
2. Select **Data explorer**.
3. Select **Add Data Source**.
    
   * To add a Data Lake Store account, you need the account name and access to the account to be able to query it.
   * To add Azure Blob storage, you need the storage account and the account key. To find them, go to the storage account in the portal and select **Access keys**.

## Set up firewall rules

You can use Data Lake Analytics to further lock down access to your Data Lake Analytics account at the network level. You can enable a firewall, specify an IP address, or define an IP address range for your trusted clients. After you enable these measures, only clients that have the IP addresses within the defined range can connect to the store.

If other Azure services, like Azure Data Factory or VMs, connect to the Data Lake Analytics account, make sure that **Allow Azure Services** is turned **On**. 

### Set up a firewall rule

1. In the Azure portal, go to your Data Lake Analytics account.
2. On the menu on the left, select **Firewall**.

## Add a new user

You can use the **Add User Wizard** to easily provision new Data Lake users.

1. In the Azure portal, go to your Data Lake Analytics account.
2. On the left, under **Getting Started**, select **Add User Wizard**.
3. Select a user, and then select **Select**.
4. Select a role, and then select **Select**. To set up a new developer to use Azure Data Lake, select the **Data Lake Analytics Developer** role.
5. Select the access control lists (ACLs) for the U-SQL databases. When you're satisfied with your choices, select **Select**.
6. Select the ACLs for files. For the default store, don't change the ACLs for the root folder "/" and for the /system folder. select **Select**.
7. Review all your selected changes, and then select **Run**.
8. When the wizard is finished, select **Done**.

## Manage Azure role-based access control

Like other Azure services, you can use Azure role-based access control (Azure RBAC) to control how users interact with the service.

The standard Azure roles have the following capabilities:
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

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign a role to a user. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

   ![Screenshot that shows Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)

>[!NOTE]
>If a user or a security group needs to submit jobs, they also need permission on the store account. For more information, see [Secure data stored in Data Lake Store](../data-lake-store/data-lake-store-secure-data.md).
>

## Manage jobs

### Submit a job

1. In the Azure portal, go to your Data Lake Analytics account.

2. Select **New Job**. For each job,  configure:

    1. **Job Name**: The name of the job.
    2. **Priority**: This is under **More options**. Lower numbers have higher priority. If two jobs are queued, the one with lower priority value runs first.
    3. **AUs**: The maximum number of Analytics Units, or compute processes to reserve for this job.
    4. **Runtime**: Also under **More options**. Select the Default runtime unless you've received a custom runtime.

3. Add your script.

4. Select **Submit Job**.

### Monitor jobs

1. In the Azure portal, go to your Data Lake Analytics account.
2. Select **View All Jobs** at the top of the page. A list of all the active and recently finished jobs in the account is shown.
3. Optionally, select **Filter** to help you find the jobs by **Time Range**, **Status**, **Job Name**, **Job ID**, **Pipeline name** or **Pipeline ID**, **Recurrence name** or **Recurrence ID**, and **Author** values.

### Monitoring pipeline jobs

Jobs that are part of a pipeline work together, usually sequentially, to accomplish a specific scenario. For example, you can have a pipeline that cleans, extracts, transforms, aggregates usage for customer insights. Pipeline jobs are identified using the "Pipeline" property when the job was submitted. Jobs scheduled using ADF V2 will automatically have this property populated. 

To view a list of U-SQL jobs that are part of pipelines: 

1. In the Azure portal, go to your Data Lake Analytics accounts.
2. Select **Job Insights**. The "All Jobs" tab will be defaulted, showing a list of running, queued, and ended jobs.
3. Select the **Pipeline Jobs** tab. A list of pipeline jobs will be shown along with aggregated statistics for each pipeline.

### Monitoring recurring jobs

A recurring job is one that has the same business logic but uses different input data every time it runs. Ideally, recurring jobs should always succeed, and have relatively stable execution time; monitoring these behaviors will help ensure the job is healthy. Recurring jobs are identified using the "Recurrence" property. Jobs scheduled using ADF V2 will automatically have this property populated.

To view a list of U-SQL jobs that are recurring: 

1. In the Azure portal, go to your Data Lake Analytics accounts.
2. Select **Job Insights**. The "All Jobs" tab will be defaulted, showing a list of running, queued, and ended jobs.
3. Select the **Recurring Jobs** tab. A list of recurring jobs will be shown along with aggregated statistics for each recurring job.

## Next steps

* [Overview of Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Manage Azure Data Lake Analytics by using Azure PowerShell](data-lake-analytics-manage-use-powershell.md)
* [Manage Azure Data Lake Analytics using policies](data-lake-analytics-account-policies.md)
