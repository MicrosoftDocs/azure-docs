---
title: Use Job Browser and Job View for Azure Data Lake Analytics jobs | Microsoft Docs
description: 'Learn how to use Job Browser and Job View for Azure Data Lake Analytics jobs. '
services: data-lake-analytics
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: bdf27b4d-6f58-4093-ab83-4fa3a99b5650
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 10/17/2016
ms.author: jgao

---
# Test and debug U-SQL jobs using local-run and the Azure Data Lake U-SQL SDK

Learn how to use Azure Data Lake Tools for Visual Studio and Azure Data Lake U-SQL SDK to test and debug U-SQL jobs on your local workstation.  These two local-run features make it possible to run U-SQL jobs on your workstation just as you can in the Azure Data Lake Service. These features save you time for testing and debugging your U-SQL jobs.

Prerequisites: 
•	A Data Lake Analytics account. See [Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md). 
•	Data Lake Tools for Visual Studio.  See [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md). 
•	The U-SQL script development experience. See [Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md). 


## Understand data-root and file path

Both local-run and the U-SQL SDK requires a data-root folder. Data-root is a “local store” for the local compute account. It is equivalent to the default Data Lake Store account or the default Storage account of a Data Lake Analytics account in Azure. Everything is contained within the data-root folder. Switching to a different data-root folder is just like switching to a different store account. If you want to access commonly shared data with different data-root folders, you must use absolute paths in your scripts or to create file system symbolic links (for example, mklink on NTFS) under these data-root folder which point to the shared data. You can use both relative path and local absolute path in U-SQL scripts to access the data-root folder.  It is recommended to use “/” as the path separator to make your scripts compatible with the server side. Here are some examples of relative paths and their equivalent absolute path. In these examples, “C:\LocalRunDataRoot” is the data-root:

|Relative path|Absolute path|
|-------------|-------------|
|/abc/def/input.csv |C:\LocalRunDataRoot\abc\def\input.csv|
|abc/def/input.csv  |C:\LocalRunDataRoot\abc\def\input.csv|
|D:/abc/def/input.csv |D:\abc\def\input.csv|

When you deploy your scripts to Azure, the Data Lake Tools doesn't convert the relative paths used in the script to absolute paths.

The data-root folder is used for:

- Store metadata including databases, tables, TVFs, assemblies, etc.
- Look up the input and output paths that are defined as relative paths in U-SQL. Using relative paths makes it easier to deploy your U-SQL projects to Azure.

## Use local-run

The Data Lake Tools for Visual Studio provides U-SQL local-run experience in Visual Studio. Using this feature, you can:

- Run U-SQL script locally, along with C# assemblies.
- Debug C# assembly locally.
- Create, view, and delete U-SQL catalogs (local databases, assemblies, schemas, and tables) from Server Explorer. The local catalog can be found from Server Explorer:

    ![Data Lake Tools for Visual Studio local run local catalog](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-local-catalog.png)

### Run U-SQL script locally

A Visual Studio U-SQL project is required for performing local run. This part is different from running U-SQL scripts from Azure.


**To run a U-SQL script locally**
1. From Visual Studio, open your U-SQL project.   
2. Right-click a U-SQL script in Solution Explorer, and then click **Submit Script**. You can also click (local) account on the top of script window, then click **Submit** (or use the **CTRL + F5** hotkey).
3. Select (local) as the Analytics Account to run your script locally.

    ![Data Lake Tools for Visual Studio local run submit jobs](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-submit-job.png)

### Configure data root

Data Lake Tools installer creates a Data Root folder located at “C:\LocalRunRoot” by default. You can update the path through Data Lake>Options and Settings>Local Run.
Configure Local Run Parallelism
By default, U-SQL jobs are executed with 1 Parallelism locally. The parallelism is configuration via Data Lake>Options and Setting>Local Run. You can also change the Parallelism in the submit dialog when submitting the job. 
 







































## Next Steps
* To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
* To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
* To log diagnostics information, see [Accessing diagnostics logs for Azure Data Lake Analytics](data-lake-analytics-diagnostic-logs.md)
* To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
* To view use vertex execution view, see [Use the Vertex Execution View in Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-use-vertex-execution-view.md)

