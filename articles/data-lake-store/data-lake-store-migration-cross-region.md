---
title: Azure Data Lake Storage Gen1 cross-region migration | Microsoft Docs
description: Learn what to consider as you plan and complete a migration to Azure Data Lake Storage Gen1 as it becomes available in new regions.

author: normesta
ms.service: data-lake-store
ms.topic: conceptual
ms.date: 01/27/2017
ms.author: normesta

---
# Migrate Azure Data Lake Storage Gen1 across regions

As Azure Data Lake Storage Gen1 becomes available in new regions, you might choose to do a one-time migration, to take advantage of the new region. Learn what to consider as you plan and complete the migration.

## Prerequisites

* **An Azure subscription**. For more information, see [Create your free Azure account today](https://azure.microsoft.com/pricing/free-trial/).
* **A Data Lake Storage Gen1 account in two different regions**. For more information, see [Get started with Azure Data Lake Storage Gen1](data-lake-store-get-started-portal.md).
* **Azure Data Factory**. For more information, see [Introduction to Azure Data Factory](../data-factory/introduction.md).


## Migration considerations

First, identify the migration strategy that works best for your application that writes, reads, or processes data in Data Lake Storage Gen1. When you choose a strategy, consider your application's availability requirements, and the downtime that occurs during a migration. For example, your simplest approach might be to use the "lift-and-shift" cloud migration model. In this approach, you pause the application in your existing region while all your data is copied to the new region. When the copy process is finished, you resume your application in the new region, and then delete the old Data Lake Storage Gen1 account. Downtime during the migration is required.

To reduce downtime, you might immediately start ingesting new data in the new region. When you have the minimum data needed, run your application in the new region. In the background, continue to copy older data from the existing Data Lake Storage Gen1 account to the new Data Lake Storage Gen1 account in the new region. By using this approach, you can make the switch to the new region with little downtime. When all the older data has been copied, delete the old Data Lake Storage Gen1 account.

Other important details to consider when planning your migration are:

* **Data volume**. The volume of data (in gigabytes, the number of files and folders, and so on) affects the time and resources you need for the migration.

* **Data Lake Storage Gen1 account name**. The new account name in the new region must be globally unique. For example, the name of your old Data Lake Storage Gen1 account in East US 2 might be contosoeastus2.azuredatalakestore.net. You might name your new Data Lake Storage Gen1 account in North EU contosonortheu.azuredatalakestore.net.

* **Tools**. We recommend that you use the [Azure Data Factory Copy Activity](../data-factory/connector-azure-data-lake-store.md) to copy Data Lake Storage Gen1 files. Data Factory supports data movement with high performance and reliability. Keep in mind that Data Factory copies only the folder hierarchy and content of the files. You need to manually apply any access control lists (ACLs) that you use in the old account to the new account. For more information, including performance targets for best-case scenarios, see the [Copy Activity performance and tuning guide](../data-factory/copy-activity-performance.md). If you want data copied more quickly, you might need to use additional Cloud Data Movement Units. Some other tools, like AdlCopy, don't support copying data between regions.  

* **Bandwidth charges**. [Bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/) apply because data is transferred out of an Azure region.

* **ACLs on your data**. Secure your data in the new region by applying ACLs to files and folders. For more information, see [Securing data stored in Azure Data Lake Storage Gen1](data-lake-store-secure-data.md). We recommend that you use the migration to update and adjust your ACLs. You might want to use settings similar to your current settings. You can view the ACLs that are applied to any file by using the Azure portal, [PowerShell cmdlets](/powershell/module/az.datalakestore/get-azdatalakestoreitempermission), or SDKs.  

* **Location of analytics services**. For best performance, your analytics services, like Azure Data Lake Analytics or Azure HDInsight, should be in the same region as your data.  

## Next steps
* [Overview of Azure Data Lake Storage Gen1](data-lake-store-overview.md)
