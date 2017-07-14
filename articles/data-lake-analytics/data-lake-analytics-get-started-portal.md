---
title: Get Started with Azure Data Lake Analytics using Azure portal | Microsoft Docs
description: 'Learn how to use the Azure portal to create a Data Lake Analytics account, create a Data Lake Analytics job using U-SQL, and submit the job. '
services: data-lake-analytics
documentationcenter: ''
author: edmacauley
manager: jhubbard
editor: cgronlun

ms.assetid: b1584d16-e0d2-4019-ad1f-f04be8c5b430
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 03/21/2017
ms.author: edmaca

---
# Tutorial: get started with Azure Data Lake Analytics using Azure portal
[!INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use the Azure portal to create Azure Data Lake Analytics accounts, define jobs in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit jobs to the Data Lake Analytics service. For more
information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

## Prerequisites

Before you begin this tutorial, you must have an **Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

## Create a Data Lake Analytics account

Now, you will create a Data Lake Analytics and a Data Lake Store account at the same time.  This step is simple and only takes about 60 seconds to finish.

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **New** >  **Intelligence + analytics** > **Data Lake Analytics**.
3. Select values for the following items:
   * **Name**: Name your Data Lake Analytics account (Only lower case letters and numbers allowed).
   * **Subscription**: Choose the Azure subscription used for the Analytics account.
   * **Resource Group**. Select an existing Azure Resource Group or create a new one.
   * **Location**. Select an Azure data center for the Data Lake Analytics account.
   * **Data Lake Store**: Follow the instruction to create a new Data Lake Store account, or select an existing one. 
4. Optionally, select a pricing tier for your Data Lake Analytics account.
5. Click **Create**. 


## Your first U-SQL script

The following text is a very simple U-SQL script. All it does is define a small dataset within the script and then write that dataset out to the default Data Lake Store as a file called `/data.csv`.

```
@a  = 
    SELECT * FROM 
        (VALUES
            ("Contoso", 1500.0),
            ("Woodgrove", 2700.0)
        ) AS 
              D( customer, amount );
OUTPUT @a
    TO "/data.csv"
    USING Outputters.Csv();
```

## Submit a U-SQL job

1. From the Data Lake Analytics account, click **New Job**.
2. Paste in the text of the U-SQL script shown above. 
3. Click **Submit Job**.   
4. Wait until the job status changes to **Succeeded**.
5. If the job failed, see [Monitor and troubleshoot Data Lake Analytics jobs](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md).
6. Click the **Output** tab, and then click `SearchLog-from-Data-Lake.csv`. 

## See also

* To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
