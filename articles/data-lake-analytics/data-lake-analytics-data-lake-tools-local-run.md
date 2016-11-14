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
•	The Data Lake Tools for Visual Studio.  See [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md). 
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

## Use local-run from Visual Studio

The Data Lake Tools for Visual Studio provides U-SQL local-run experience in Visual Studio. Using this feature, you can:

- Run U-SQL script locally, along with C# assemblies.
- Debug C# assembly locally.
- Create, view, and delete U-SQL catalogs (local databases, assemblies, schemas, and tables) from Server Explorer. The local catalog can be found from Server Explorer:

    ![Data Lake Tools for Visual Studio local run local catalog](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-local-catalog.png)


Data Lake Tools installer creates a “C:\LocalRunRoot” folder to be use as the default data-root folder. The default local-run parallelism is 1. 

**To configure local-run in Visual Studio**

1. Open Visual Studio.
2. Open **Server Explorer**.
3. Expand **Azure**, **Data Lake Analytics**.
4. Click the **Data Lake** menu, and then click "Options and Settings". 
5. On the left tree, expand **Azure Data Lake**, and then expand **General**.

    ![Data Lake Tools for Visual Studio local run configure settings](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-configure.png)


A Visual Studio U-SQL project is required for performing local run. This part is different from running U-SQL scripts from Azure.

**To run a U-SQL script locally**
1. From Visual Studio, open your U-SQL project.   
2. Right-click a U-SQL script in Solution Explorer, and then click **Submit Script**. You can also click (local) account on the top of script window, then click **Submit** (or use the **CTRL + F5** hotkey).
3. Select (local) as the Analytics Account to run your script locally.

    ![Data Lake Tools for Visual Studio local run submit jobs](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-submit-job.png)






## Use local-run from Data Lake U-SQL SDK
 
In addition to running U-SQL scripts localling using Visual Studio, you can also use Data Lake U-SQL SDK to run U-SQL scripts locally.


### Install the SDK

The Data Lake U-SQL SDK requires the following dependencies:

- [Microsoft .Net Framework 4.6 or newer](https://www.microsoft.com/en-us/download/details.aspx?id=17851).
- Microsoft Visual C++ 14 and Windows SDK 10.0.10240.0 or newer. To get this:

    - Install Visual Studio ([Visual Studio Community Edition](https://developer.microsoft.com/downloads/vs-thankyou)). You shall have a “\Windows Kits\10” folder under the program files folder, for example, “C:\Program Files (x86)\Windows Kits\10\”; you shall also find the Windows 10 SDK version under “\Windows Kits\10\Lib”. If you don’t see these folders, re-install Visual Studio.
 
    - Install the [Data Lake Tools for Visual Studio](http://aka.ms/adltoolsvs). The prepackaged VC++ and Windows SDK files can be found at 
	C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\ADL Tools\X.X.XXXX.X\CppSDK. You can either copy the files to another location or just use it as is.  n this case, you can choose to either set an environment variable “SCOPE_CPP_SDK” to the directory, or to specify “-CppSDK” argument with this directory on the command line of the localrun helper application. This will also be covered in configure section.

After you have installed the SDK, you must perform the following configuration steps:

- Set the SCOPE_CPP_SDK environment variable
If you are After installing ADL Tools for VS to get Microsoft Visual C++ and Windows SDKthe SDK, verify that you have the following folder:
C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\Microsoft Azure Data Lake Tools for Visual Studio 2015\X.X.XXXX.X\CppSDK
Define a new environment variable called “SCOPE_CPP_SDK” to point to this directory.
You can also specify the CppSDK path when using command line with “-CppSDK” argument, this argument will overwrite your default CppSDK environment variable. 
Set the LOCALRUN_DATAROOT environment variable
Define a new environment variable called “LOCALRUN_DATAROOT” pointing to the data root. 
You can also specify the Data Root path when using command line with “-DataRoot” argument, this argument will overwrite your default Data Root environment variable. And you need to add this argument to every command line you are executing so that you can use the same new overwrite Data Root for all operations. See more about this in Basic Concepts.





































## Next Steps
* To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
* To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
* To log diagnostics information, see [Accessing diagnostics logs for Azure Data Lake Analytics](data-lake-analytics-diagnostic-logs.md)
* To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
* To view use vertex execution view, see [Use the Vertex Execution View in Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-use-vertex-execution-view.md)

