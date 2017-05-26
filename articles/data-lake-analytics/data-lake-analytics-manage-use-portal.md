---
title: Manage Azure Data Lake Analytics using the Azure portal | Microsoft Docs
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
# Manage Azure Data Lake Analytics using Azure portal
[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

Learn how to manage Azure Data Lake Analytics accounts, account data sources, users, and jobs using the Azure portal. To see management topics using other tools, click the tab selector on the top of the page.

<!-- ################################ -->
<!-- ################################ -->

## Manage Data Lake Analytics accounts

**To create an account**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **New** > **Intelligence + analytics** > **Data Lake Analytics**.
3. Choose values for the following items:   
   * **Name**: The name the Data Lake Analytics account.
   * **Subscription**: The Azure subscription used for the account.
   * **Resource Group**: The Azure resource group in which to create the account. 
   * **Location**: The Azure data center for the Data Lake Analytics account. 
   * **Data Lake Store**: The default Data Lake Store to be used for the Analytics account. The Data Lake Store Account and the Data Lake Analytics account must be in the same Location.
4. Click **Create**. 

**To delete a Data Lake Analytics account**

1. Open the Data Lake Analytics account in the Azure portal.
2. Click **Delete**.
3. Type the account name.
4. Click **Delete**.

Before you delete the Data Lake Analytics account, delete its default Data Lake Store account.

<!-- ################################ -->
<!-- ################################ -->

## Manage data sources

Data Lake Analytics supports the following data sources:

* Azure Data Lake Store
* Azure Storage

The **Data Explorer** allows you to browse the data sources and perform basic file management operations. 

**To add a data source**

1. Open the Data Lake Analytics account in the Azure portal.
2. Click **Settings** > **Data Sources**.
3. Click **Add Data Source**.
    
* To add an Azure Data Lake Store account, you need the account name, and access to the account to be able query it.
* To add an Azure Blob storage, you need the storage account and the account key, which can be found by navigating to the storage account in the portal.

## Setup Firewall Rules

Azure Data Lake Analytics enables you to further lock down access to your Data Lake Analytics account at the network level. You can enable firewall, specify an IP address, or define an IP address range for your trusted clients. Once enabled, only clients that have the IP addresses within defined range can connect to the store.

If other Azure Services like Data Factory, or VMs will be connecting to the Data Lake Analytics account, make sure that the "Allow Azure Services" switch is toggled to "On". 

**To setup a firewall rule**

1. Open the Data Lake Analytics account in the Azure portal.
2. On the left hand side menu, under **Settings** > **Firewall**

## Manage role-based access control

Like other Azure services, you can use Azure Role-Based Access Control (RBAC) to control how users interact with the service.

The standard Azure RBAC roles have the folloing capabilities with respect to Data Lake Analytics:
* **Owner**: Can submit jobs, monitor jobs, cancel jobs from any user, and configure the account.
* **Contributor**: Can submit job, monitor jobs, and cancel jobs from any user, and configure the account.
* **Reader**: Can monitor jobs.

Use the **Data Lake Analytics Developer** to enable U-SQL developers to use the Data Lake Analytics service. The Data Lake Analytics Developer role allows a user to:
* submit jobs
* monitor jobs status and progress of jobs submitted by any user
* see the U-SQL scripts from jobs submitted by any user 
* cancel only their own jobs

**To add users or security groups to a Data Lake Analytics account**

1. Open the Data Lake Analytics account in the Azure portal.
2. Click **Settings** >  **Users** > **Add**.
4. Select a role.
5. Add a user.
6. Click **OK**.

>[!NOTE]
>If this user or security group needs to submit jobs, they need to be given permission on the Data Lake Store as well. For more information, see [Secure data stored in Data Lake Store](../data-lake-store/data-lake-store-secure-data.md)
>

<!-- ################################ -->
<!-- ################################ -->

## Manage jobs

**To submit a job**

1. Open the Data Lake Analytics account in the Azure portal.
2. Click **New Job**.
   
    For each job, you can configure:

    * **Job Name**: The name of the job.
    * **Priority**: Lower numbers have higher priority. If two jobs are both queued, the one with lower priority runs first
    * **Parallelism**: The Max number of compute processes to reserve for this job.

3. Click **Submit Job**.

**To monitor jobs**

1. Open the Data Lake Analytics account in the Azure portal.
2. Click **View All Jobs**. Now you can see a list of all the active and recently finished jobs in the account.
3. Optionally click **Filter** to help you to find the jobs by **Time Range**, **Job Name**, and **Author**. 

## See also

* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Get started with Data Lake Analytics using Azure portal](data-lake-analytics-get-started-portal.md)
* [Manage Azure Data Lake Analytics using Azure PowerShell](data-lake-analytics-manage-use-powershell.md)

