---
title: Develop U-SQL scripts by using Data Lake Tools for Visual Studio | Microsoft Docs
description: Learn how to install Data Lake Tools for Visual Studio, and how to develop and test U-SQL scripts. 
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: saveenr
editor: cgronlun

ms.assetid: ad8a6992-02c7-47d4-a108-62fc5a0777a3
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/06/2017
ms.author: edmaca, yanacai

---
# Develop U-SQL scripts by using Data Lake Tools for Visual Studio
[!INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]


Learn how to use Visual Studio to create Azure Data Lake Analytics accounts, define jobs in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit jobs to the Data Lake Analytics service. For more
information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).


## Prerequisites

* **Visual Studio**: All editions except Express are supported.
    * Visual Studio 2017
    * Visual Studio 2015 Update 4
    * Visual Studio 2013
* **Microsoft Azure SDK for .NET** version 2.7.1 or later.  Install it by using the [Web platform installer](http://www.microsoft.com/web/downloads/platform.aspx).
* A **Data Lake Analytics** account. To create an account, see [Get Started with Azure Data Lake Analytics using Azure portal](data-lake-analytics-get-started-portal.md).

## Install Azure Data Lake Tools for Visual Studio 

Download and install Azure Data Lake Tools for Visual Studio [from the Download Center](http://aka.ms/adltoolsvs). After installation, note that:
* The **Server Explorer** > **Azure** node contains a **Data Lake Analytics** node. 
* The **Tools** menu has a **Data Lake** item.

## Connect to an Azure Data Lake Analytics account

1. Open Visual Studio.
2. Open Server Explorer by selecting **View** > **Server Explorer**.
3. Right-click **Azure**. Then select **Connect to Microsoft Azure Subscription** and follow the instructions.
4. In Server Explorer, select **Azure** > **Data Lake Analytics**. You see a list of your Data Lake Analytics accounts.


## Write your first U-SQL script

The following text is a simple U-SQL script. It defines a small dataset and writes that dataset to the default Data Lake Store as a file called `/data.csv`.

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

### Submit a Data Lake Analytics job

1. Select **File** > **New** > **Project**.

2. Select the **U-SQL Project** type, and then click **OK**. Visual Studio creates a solution with a **Script.usql** file.

3. Paste the previous script into the **Script.usql** window.

4. In the upper-left corner of the **Script.usql** window, specify the Data Lake Analytics account.

    ![Submit U-SQL Visual Studio project](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-submit-job.png)

5. In the upper-left corner of the **Script.usql** window, select **Submit**.
6. Verify the **Analytics Account**, and then select **Submit**. Submission results are available in the Data Lake Tools for Visual Studio Results after the submission is complete.

    ![Submit U-SQL Visual Studio project](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-submit-job-advanced.png)
7. To see the latest job status and refresh the screen, click **Refresh**. When the job succeeds, it shows the **Job Graph**, **MetaData Operations**, **State History**, and **Diagnostics**:

    ![U-SQL Visual Studio Data Lake Analytics job performance graph](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-performance-graph.png)

   *  **Job Summary** shows the summary of the job.   
   * **Job Details** shows more specific information about the job, including the script, resources, and vertices.
   *  **Job Graph** visualizes the progress of the job.
   *  **MetaData Operations** shows all the actions that were taken on the U-SQL catalog.
   * **Data** shows all the inputs and outputs.
   * **Diagnostics** provides an advanced analysis for job execution and performance optimization.

### To check job state

1. In Server Explorer, select **Azure** > **Data Lake Analytics**. 
2. Expand the Data Lake Analytics account name.
3. Double-click **Jobs**.
4. Select the job that you previously submitted.

### To see the output of a job

1. In Server Explorer, browse to the job you submitted.
2. Click the **Data** tab.
3. In the **Job Outputs** tab, select the `"/data.csv"` file.

## Next steps

* Get started with Data Lake Analytics using: [Azure portal](data-lake-analytics-get-started-portal.md) | [Azure PowerShell](data-lake-analytics-get-started-powershell.md) 
* [Debug C# code in U-SQL jobs](data-lake-analytics-debug-u-sql-jobs.md)
* [Use the Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md)
