---
title: Azure Data Lake Store Guidance for Cross-region Migration | Microsoft Docs
description: Azure Data Lake Store Guidance for Cross-region Migration
services: data-lake-store
documentationcenter: ''
author: stewu
manager: amitkul
editor: stewu

ms.assetid: ebde7b9f-2e51-4d43-b7ab-566417221335
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 01/27/2017
ms.author: stewu

---
# Guidance to migrate Azure Data Lake Store across regions

As Azure Data Lake Store becomes available in new regions, you may decide to perform a one-time migration to take advantage of a new region.  Here’s some guidance on what to consider when planning and performing the migration.

## Prerequisites

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **An Azure Data Lake Store account in two different regions**. For instructions on how to create one, see [Get started with Azure Data Lake Store](data-lake-store-get-started-portal.md).
* **Azure Data Factory**.  To learn more, see [Introduction to Azure Data Factory](../data-factory/data-factory-introduction.md).


## Guidance for migration

We recommend you first identify the migration strategy appropriate for your application that is writing, reading, or processing data in Azure Data Lake Store. When choosing a strategy, you should consider your application’s availability requirements (i.e. downtime) e.g. the simplest approach would be to “lift and shift” your data.  This means pausing your applications in the old region while all the data is copied to the new region.  Once the copy process has completed you can resume your application in the new region and delete the old Azure Data Lake Store account.  However, there will be downtime during this migration.

Alternatively, to reduce downtime you could start ingesting new data in the new region right away and start running your applications in the new region as soon as you have the minimum data needed.  In the background you can copy older data from the old Azure Data Lake Store account to the new Azure Data Lake Store account in the new region.  This allows you to make the switch to the new region with little downtime.  Once all the older data has been copied you can delete the old ADLS account.

Other important details to consider when planning your migration are:

* **Volume of data** - The volume of data (GBs, number of files and folders etc.) will impact the time and resources needed for the move.

* **Azure Data Lake Store Account Name** - The new account name in the new region will need to be globally unique, e.g. If contosoeastus2.azuredatalakestore.net is name of the old store account in East US 2, you can name your store account in North EU as contosonortheu.azuredatalakestore.net

* **Choice of tools** - For copying Azure Data Lake Store files we recommend you use the [Azure Data Factory Copy Activity](../data-factory/data-factory-azure-datalake-connector.md).   Azure Data Factory supports data movement with high performance and reliability.  Keep in mind that Azure Data Factory will only copy the folder hierarchy and content of the files over. Any access control lists (ACLs) you have applied will need to be applied manually in the new account.  The [Azure Data Factory performance tuning guidance](../data-factory/data-factory-copy-activity-performance.md) is a good reference with performance targets for best-case scenarios.  If you would like data to be copied over in a shorter duration, you may need to use additional Cloud Data Movement Units.  Note that some other tools such as ADLCopy, do not support copying data between regions.  

* **[Bandwidth charges](https://azure.microsoft.com/en-us/pricing/details/bandwidth/)** Charges will be applicable since data will be transferring out of an Azure region.

* **ACLs on your data** - Secure your data in the new region by applying ACLs to files and folders.  Guidance on this is provided [here](data-lake-store-secure-data.md).  We recommend you take this migration as an opportunity to update and adjust your ACLs.  But if you want to use similar setting you can view the ACLs applied to any file via the portal, [PowerShell cmdlets](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.datalakestore/v3.1.0/get-azurermdatalakestoreitempermission), or SDKs.  

* **Location of analytics services** - For best performance, your analytics services, such as Data Lake Analytics or HDInsight, should be co-located in the same region as your data.  

## See also
* [Overview of Azure Data Lake Store](data-lake-store-overview.md)
