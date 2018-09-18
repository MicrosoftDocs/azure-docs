---
title: Get Started with Azure Data Lake Analytics using the Azure portal
description: Use the Azure portal to create an Azure Data Lake Analytics account and submit a U-SQL job.
services: data-lake-analytics
ms.service: data-lake-analytics
author: saveenr
ms.author: saveenr

ms.reviewer: jasonwhowell
ms.assetid: b1584d16-e0d2-4019-ad1f-f04be8c5b430
ms.topic: conceptual
ms.date: 03/21/2017
---

# Get started with Azure Data Lake Analytics using the Azure portal
[!INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

This article describes how to use the Azure portal to create Azure Data Lake Analytics accounts, define jobs in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit jobs to the Data Lake Analytics service.

## Prerequisites

Before you begin this tutorial, you must have an **Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

## Create a Data Lake Analytics account

Now, you will create a Data Lake Analytics and an Azure Data Lake Storage Gen1 account at the same time.  This step is simple and only takes about 60 seconds to finish.

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Click **Create a resource** >  **Data + Analytics** > **Data Lake Analytics**.
3. Select values for the following items:
   * **Name**: Name your Data Lake Analytics account (Only lower case letters and numbers allowed).
   * **Subscription**: Choose the Azure subscription used for the Analytics account.
   * **Resource Group**. Select an existing Azure Resource Group or create a new one.
   * **Location**. Select an Azure data center for the Data Lake Analytics account.
   * **Data Lake Storage Gen1**: Follow the instruction to create a new Data Lake Storage Gen1 account, or select an existing one. 
4. Optionally, select a pricing tier for your Data Lake Analytics account.
5. Click **Create**. 


## Your first U-SQL script

The following text is a very simple U-SQL script. All it does is define a small dataset within the script and then write that dataset out to the default Data Lake Storage Gen1 account as a file called `/data.csv`.

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

1. From the Data Lake Analytics account, select **New Job**.
2. Paste in the text of the preceding U-SQL script. Name the job. 
3. Select **Submit** button to start the job.   
4. Monitor the **Status** of the job, and wait until the job status changes to **Succeeded**.
5. Select the **Data** tab, then select the **Outputs** tab. Select the output file named `data.csv` and view the output data.

## See also

* To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
