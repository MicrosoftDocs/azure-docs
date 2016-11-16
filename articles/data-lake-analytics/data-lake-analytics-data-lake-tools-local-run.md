---
title: Test and debug U-SQL jobs using local-run and the Azure Data Lake U-SQL SDK | Microsoft Docs
description: 'Learn how to use Azure Data Lake Tools for Visual Studio and Azure Data Lake U-SQL SDK to test and debug U-SQL jobs on your local workstation.'
services: data-lake-analytics
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: 76dbdfa3-d922-4edd-b008-e16c1afb9fb4
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/15/2016
ms.author: jgao

---
# Test and debug U-SQL jobs using local-run and the Azure Data Lake U-SQL SDK

Learn how to use Azure Data Lake Tools for Visual Studio and Azure Data Lake U-SQL SDK to test and debug U-SQL jobs on your local workstation.  These two local-run features make it possible to run U-SQL jobs on your workstation just as you can in the Azure Data Lake Service. These features save you time for testing and debugging your U-SQL jobs.

Prerequisites: 

- A Data Lake Analytics account. See [Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md). 
- The Data Lake Tools for Visual Studio.  See [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md). 
- The U-SQL script development experience. See [Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md). 


## Understand data-root and file path

Both local-run and the U-SQL SDK requires a data-root folder. Data-root is a "local store" for the local compute account. It is equivalent to the default Data Lake Store account or the default Storage account of a Data Lake Analytics account in Azure. Everything is contained within the data-root folder. Switching to a different data-root folder is just like switching to a different store account. If you want to access commonly shared data with different data-root folders, you must use absolute paths in your scripts or to create file system symbolic links (for example, mklink on NTFS) under this data-root folder which point to the shared data. You can use both relative path and local absolute path in U-SQL scripts to access the data-root folder.  It is recommended to use "/" as the path separator to make your scripts compatible with the server side. Here are some examples of relative paths and their equivalent absolute path. In these examples, "C:\LocalRunDataRoot" is the data-root:

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

    ![Data Lake Tools for Visual Studio local-run local catalog](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-local-catalog.png)


Data Lake Tools installer creates a "C:\LocalRunRoot" folder to be use as the default data-root folder. The default local-run parallelism is 1. 

**To configure local-run in Visual Studio**

1. Open Visual Studio.
2. Open **Server Explorer**.
3. Expand **Azure**, **Data Lake Analytics**.
4. Click the **Data Lake** menu, and then click "Options and Settings". 
5. On the left tree, expand **Azure Data Lake**, and then expand **General**.

    ![Data Lake Tools for Visual Studio local-run configure settings](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-configure.png)


A Visual Studio U-SQL project is required for performing local-run. This part is different from running U-SQL scripts from Azure.

**To run a U-SQL script locally**
1. From Visual Studio, open your U-SQL project.   
2. Right-click a U-SQL script in Solution Explorer, and then click **Submit Script**. You can also click (local) account on the top of script window, then click **Submit** (or use the **CTRL + F5** hotkey).
3. Select (local) as the Analytics Account to run your script locally.

    ![Data Lake Tools for Visual Studio local-run submit jobs](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-submit-job.png)






## Use local-run from Data Lake U-SQL SDK
 
In addition to running U-SQL scripts locally using Visual Studio, you can also use Data Lake U-SQL SDK to run U-SQL scripts locally.


### Install the SDK

The Data Lake U-SQL SDK requires the following dependencies:

- [Microsoft .Net Framework 4.6 or newer](https://www.microsoft.com/en-us/download/details.aspx?id=17851).
- Microsoft Visual C++ 14 and Windows SDK 10.0.10240.0 or newer. To get this:

    - Install Visual Studio ([Visual Studio Community Edition](https://developer.microsoft.com/downloads/vs-thankyou)). You shall have a "\Windows Kits\10" folder under the program files folder, for example, "C:\Program Files (x86)\Windows Kits\10\"; you shall also find the Windows 10 SDK version under "\Windows Kits\10\Lib". If you don’t see these folders, re-install Visual Studio.
 
    - Install the [Data Lake Tools for Visual Studio](http://aka.ms/adltoolsvs). The prepackaged VC++ and Windows SDK files can be found at 
	C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\ADL Tools\X.X.XXXX.X\CppSDK. You can either copy the files to another location or just use it as is. In this case, you can choose to either set an environment variable "SCOPE_CPP_SDK" to the directory, or to specify "-CppSDK" argument with this directory on the command line of the local-run helper application. 

After you have installed the SDK, you must perform the following configuration steps:

- Set the **SCOPE_CPP_SDK** environment variable

    If you get Microsoft Visual C++ and Windows SDK by installing the Data Lake Tools for Visual Studio, verify that you have the following folder:

        C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\Microsoft Azure Data Lake Tools for Visual Studio 2015\X.X.XXXX.X\CppSDK

    Define a new environment variable called "SCOPE_CPP_SDK" to point to this directory.

    In addition to setting the environment variable, you can also specify the "-CppSDK" argument when using command line. This argument overwrites your default CppSDK environment variable. 

- Set the **LOCALRUN_DATAROOT** environment variable

    Define a new environment variable called "LOCALRUN_DATAROOT" pointing to the data root. 

    In addition to setting the environment variable, you can also specify the "-DataRoot" argument with the data-root path when using command line. This argument overwrites your default Data Root environment variable. And you need to add this argument to every command line you are executing so that you can use the same new overwrite Data Root for all operations. 






### Using the SDK from Command Line

The Command Line Interface of the Helper Application

The LocalRunHelper.exe of the SDK is the command line helper application that provides interfaces to most of the commonly used local-run functions. 

    LocalRunHelper.exe <command> <Required-Command-Arguments> [Optional-Command-Arguments]

Both the command and the arguments switches are case-sensitive:

Run "LocalRunHelper.exe" without arguments or with the "help" switch to show the help information:

    > LocalRunHelper.exe help

    Command 'help' :  Show usage information
    Command 'compile' :  Compile the script
    Required Arguments :
            -Script param
                    Script File Path
    Optional Arguments :
            -Shallow [default value 'False']
                    Shallow compile

In the help information: 

-  **Command**  gives the command’s name.  
-  **Required Argument**  lists arguments that must be supplied.  
-  **Optional Argument**  lists arguments that are optional and with default values.  Optional bool arguments don’t have parameter and their appearances mean negative to their default value.

The helper application returns 0 in the case of success and -1 in the case of failure. By default, the helper will output all messages to the current console.  However, most of the commands support "-MessageOut path_to_log_file" optional argument that will redirect the outputs to a log file.


### The SDK usage samples

#### Compile and Run

The "run" command is used to compile the script and then execute compiled results. Its command line arguments are combination of those from "compile" and "run".

    LocalRunHelper run -Script path_to_usql_script.usql [optional_arguments]

Here is an example:

    LocalRunHelper run -Script d:\test\test1.usql -WorkDir d:\test\bin -CodeBehind -References "d:\asm\ref1.dll;d:\asm\ref2.dll" -UseDatabase testDB –Parallel 5 -Verbose

Besides of combining "compile" and "run" together, you can compile and execute the compiled executables separately. 

#### Compile U-SQL Script

The "compile" command is used to compile a U-SQL script to executables. 

    LocalRunHelper compile -Script path_to_usql_script.usql [optional_arguments]

Optional arguments for compilation:

|Argument|Description|
|--------|-----------|
|-CppSDK param [default value '']|CppSDK Directory|
|-DataRoot param [default value '']|DataRoot for data and metadata, default to 'LOCALRUN_DATAROOT' environment variable|
|-MessageOut param [default value '']|Dump messages on console to a file|
|-Shallow [default value 'False']|Shallow compile, does only a syntax check of the script and return.|
|-WorkDir param [default value 'D:\localrun\t\ScopeWorkDir']|Directory for compiler usage and outputs, see more in Appendix – Working Directory.|


Optional arguments for assemblies and code-behind:

|Argument|Description|
|--------|-----------|
|-CodeBehind [default value 'False']|The script has .cs code behind which will be compiled and registered automatically as UDO object|
|-References param [default value '']|List of paths to extra reference assemblies or data files of code behind, separated by ';'|
|-UseDatabase param [default value 'master']|Database to use for code behind temporary assembly registration|
|-UdoRedirect [default value 'False']|Generate Udo assembly redirect config that tells the .Net runtime to probe dependent assemblies from the compiled output directory first when UDO is called|

Here are some usage examples:

	LocalRunHelper compile -Script d:\test\test1.usql
	LocalRunHelper compile -Script d:\test\test1.usql –DataRoot c:\DataRoot
	LocalRunHelper compile -Script d:\test\test1.usql -WorkDir d:\test\bin -References "d:\asm\ref1.dll;d:\asm\ref2.dll" -UseDatabase testDB

#### Execute Compiled Result

The "execute" command is used to execute compiled results.   

	LocalRunHelper execute -Algebra path_to_compiled_algebra_file [optional_arguments]

Optional arguments:

|Argument|Description|
|--------|-----------|
|-DataRoot param [default value '']|DataRoot for metadata execution, default to 'LOCALRUN_DATAROOT' environment variable|
|-MessageOut param [default value '']|Dump messages on console to a file|
|-Parallel param [default value '1']|Run the generated local-run steps with the specified parallelism level|
|-Verbose [default value 'False']|Show detailed outputs from runtime|


Here are a usage example:

	LocalRunHelper execute -Algebra d:\test\workdir\ C6A101DDCB470506\ Script_66AE4909AA0ED06C\__script__.abr –DataRoot c:\DataRoot –Parallel 5




## Next steps

* To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
* To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
* To log diagnostics information, see [Accessing diagnostics logs for Azure Data Lake Analytics](data-lake-analytics-diagnostic-logs.md)
* To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
* To view job details, see [Use Job Browser and Job View for Azure Data lake Analytics jobs](data-lake-analytics-data-lake-tools-view-jobs.md)
* To view use vertex execution view, see [Use the Vertex Execution View in Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-use-vertex-execution-view.md)

