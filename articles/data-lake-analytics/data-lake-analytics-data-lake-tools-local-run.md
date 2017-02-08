---
title: Test and debug U-SQL jobs by using local run and the Azure Data Lake U-SQL SDK | Microsoft Docs
description: 'Learn how to use Azure Data Lake Tools for Visual Studio and the Azure Data Lake U-SQL SDK to test and debug U-SQL jobs on your local workstation.'
services: data-lake-analytics
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: 66dd58b1-0b28-46d1-aaae-43ee2739ae0a
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/15/2016
ms.author: jgao

---
# Test and debug U-SQL jobs by using local run and the Azure Data Lake U-SQL SDK

You can use Azure Data Lake Tools for Visual Studio and the Azure Data Lake U-SQL SDK to run U-SQL jobs on your workstation, just as you can in the Azure Data Lake service. These two local-run features save you time in testing and debugging your U-SQL jobs.

Prerequisites:

- An Azure Data Lake Analytics account. See [Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md).
- Azure Data Lake Tools for Visual Studio. See [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- The U-SQL script development experience. See [Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md).


## Understand the data-root folder and the file path

Both local run and the U-SQL SDK require a data-root folder. The data-root folder is a "local store" for the local compute account. It's equivalent to the Azure Data Lake Store account of a Data Lake Analytics account. Switching to a different data-root folder is just like switching to a different store account. If you want to access commonly shared data with different data-root folders, you must use absolute paths in your scripts. Or, create file system symbolic links (for example, **mklink** on NTFS) under the data-root folder to point to the shared data.

The data-root folder is used to:

- Store metadata, including databases, tables, table-valued functions (TVFs), and assemblies.
- Look up the input and output paths that are defined as relative paths in U-SQL. Using relative paths makes it easier to deploy your U-SQL projects to Azure.

You can use both a relative path and a local absolute path in U-SQL scripts. The relative path is relative to the specified data-root folder path. We recommend that you use "/" as the path separator to make your scripts compatible with the server side. Here are some examples of relative paths and their equivalent absolute paths. In these examples, C:\LocalRunDataRoot is the data-root folder.

|Relative path|Absolute path|
|-------------|-------------|
|/abc/def/input.csv |C:\LocalRunDataRoot\abc\def\input.csv|
|abc/def/input.csv  |C:\LocalRunDataRoot\abc\def\input.csv|
|D:/abc/def/input.csv |D:\abc\def\input.csv|

## Use local run from Visual Studio

Data Lake Tools for Visual Studio provides a U-SQL local-run experience in Visual Studio. By using this feature, you can:

- Run a U-SQL script locally, along with C# assemblies.
- Debug a C# assembly locally.
- Create, view, and delete U-SQL catalogs (local databases, assemblies, schemas, and tables) from Server Explorer. You can also find the local catalog also from Server Explorer.

    ![Data Lake Tools for Visual Studio local-run local catalog](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-local-catalog.png)

The Data Lake Tools installer creates a C:\LocalRunRoot folder to be used as the default data-root folder. The default local-run parallelism is 1.

### To configure local run in Visual Studio

1. Open Visual Studio.
2. Open **Server Explorer**.
3. Expand **Azure** > **Data Lake Analytics**.
4. Click the **Data Lake** menu, and then click **Options and Settings**.
5. In the left tree, expand **Azure Data Lake**, and then expand **General**.

    ![Data Lake Tools for Visual Studio local-run configure settings](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-configure.png)

A Visual Studio U-SQL project is required for performing local run. This part is different from running U-SQL scripts from Azure.

### To run a U-SQL script locally
1. From Visual Studio, open your U-SQL project.   
2. Right-click a U-SQL script in Solution Explorer, and then click **Submit Script**.
3. Select **(Local)** as the Analytics account to run your script locally.
You can also click the **(Local)** account on the top of script window, and then click **Submit** (or use the Ctrl + F5 keyboard shortcut).

    ![Data Lake Tools for Visual Studio local-run submit jobs](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-submit-job.png)



## Use local run from the Data Lake U-SQL SDK

In addition to running U-SQL scripts locally by using Visual Studio, you can use the Azure Data Lake U-SQL SDK to run U-SQL scripts locally with command-line and programming interfaces. Through these, you can scale your U-SQL local test.

### Install the SDK

The Data Lake U-SQL SDK requires the following dependencies:

- [Microsoft .NET Framework 4.6 or newer](https://www.microsoft.com/en-us/download/details.aspx?id=17851).
- Microsoft Visual C++ 14 and Windows SDK 10.0.10240.0 or newer. There are two ways to get this:

    - Install [Visual Studio Community Edition](https://developer.microsoft.com/downloads/vs-thankyou). You'll have a \Windows Kits\10 folder under the Program Files folder--for example, C:\Program Files (x86)\Windows Kits\10\. You'll also find the Windows 10 SDK version under \Windows Kits\10\Lib. If you don’t see these folders, reinstall Visual Studio and be sure to select the Windows 10 SDK during the installation. The U-SQL local compiler script will find these dependencies automatically.

    ![Data Lake Tools for Visual Studio local-run Windows 10 SDK](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-windows-10-sdk.png)

    - Install [Data Lake Tools for Visual Studio](http://aka.ms/adltoolsvs). You can find the prepackaged Visual C++ and Windows SDK files at
	C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\ADL Tools\X.X.XXXX.X\CppSDK. In this case, the U-SQL local compiler cannot find the dependencies automatically. You need to specify the CppSDK path for it. You can either copy the files to another location or use it as is. Then, you can choose to either set the environment variable **SCOPE_CPP_SDK** to the directory or specify the **-CppSDK** argument with this directory on the command line of the local-run helper application.

After you install the SDK, you must perform the following configuration steps:

- Set the **SCOPE_CPP_SDK** environment variable.

    If you get Microsoft Visual C++ and the Windows SDK by installing Data Lake Tools for Visual Studio, verify that you have the following folder:

        C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\Microsoft Azure Data Lake Tools for Visual Studio 2015\X.X.XXXX.X\CppSDK

    Define a new environment variable called **SCOPE_CPP_SDK** to point to this directory. Or copy the folder to the other location and specify **SCOPE_CPP_SDK** as that.

    In addition to setting the environment variable, you can specify the **-CppSDK** argument when you're using the command line. This argument overwrites your default CppSDK environment variable.

- Set the **LOCALRUN_DATAROOT** environment variable.

    Define a new environment variable called **LOCALRUN_DATAROOT** that points to the data root.

    In addition to setting the environment variable, you can specify the **-DataRoot** argument with the data-root path when you're using a command line. This argument overwrites your default data-root environment variable. You need to add this argument to every command line you're running so that you can overwrite the default data-root environment variable for all operations.

### Use the SDK from the command line

#### Command-line interface of the helper application

In the SDK, LocalRunHelper.exe is the command-line helper application that provides interfaces to most of the commonly used local-run functions. Note that both the command and the argument switches are case-sensitive. To invoke it:

    LocalRunHelper.exe <command> <Required-Command-Arguments> [Optional-Command-Arguments]

Run LocalRunHelper.exe without arguments or with the **help** switch to show the help information:

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

-  **Command** gives the command’s name.  
-  **Required Argument** lists arguments that must be supplied.  
-  **Optional Argument** lists arguments that are optional, with default values.  Optional Boolean arguments don’t have parameters, and their appearances mean negative to their default value.

#### Return value and logging

The helper application returns **0** for success and **-1** for failure. By default, the helper sends all messages to the current console. However, most of the commands support the **-MessageOut path_to_log_file** optional argument that redirects the outputs to a log file.


### SDK usage samples

#### Compile and run

The **run** command is used to compile the script and then execute compiled results. Its command-line arguments are a combination of those from **compile** and **run**.

    LocalRunHelper run -Script path_to_usql_script.usql [optional_arguments]

Here's an example:

    LocalRunHelper run -Script d:\test\test1.usql -WorkDir d:\test\bin -CodeBehind -References "d:\asm\ref1.dll;d:\asm\ref2.dll" -UseDatabase testDB –Parallel 5 -Verbose

Besides combining **compile** and **run**, you can compile and run the compiled executables separately.

#### Compile a U-SQL script

The **compile** command is used to compile a U-SQL script to executables.

    LocalRunHelper compile -Script path_to_usql_script.usql [optional_arguments]

The following are optional arguments for compilation:

|Argument|Description|
|--------|-----------|
|-CppSDK [default value '']|CppSDK directory.|
|-DataRoot [default value '']|Data root for data and metadata. It defaults to the **LOCALRUN_DATAROOT** environment variable.|
|-MessageOut [default value '']|Dump messages on the console to a file.|
|-Shallow [default value 'False']|Shallow compile. It does only a syntax check of the script and return.|
|-WorkDir [default value 'D:\localrun\t\ScopeWorkDir']|Directory for compiler usage and outputs. For more information, see "Working directory" in the appendix.|

The following are optional arguments for assemblies and code-behinds:

|Argument|Description|
|--------|-----------|
|-CodeBehind [default value 'False']|Indicator that the script has a .cs code-behind, which will be compiled and registered automatically as a user-defined object (UDO)|
|-References [default value '']|List of paths to extra reference assemblies or data files of a code-behind, separated by ';'|
|-UseDatabase [default value 'master']|Database to use for code-behind temporary assembly registration|
|-UdoRedirect [default value 'False']|UDO assembly redirect configuration that tells the .NET runtime to probe dependent assemblies from the compiled output directory first when UDO is called|

Here are some usage examples.

Compile a U-SQL script:

	LocalRunHelper compile -Script d:\test\test1.usql

Compile a U-SQL script and set the data-root folder. Note that this will overwrite the set environment variable.

	LocalRunHelper compile -Script d:\test\test1.usql –DataRoot c:\DataRoot

Compile a U-SQL script and set a working directory, reference assembly, and database:

	LocalRunHelper compile -Script d:\test\test1.usql -WorkDir d:\test\bin -References "d:\asm\ref1.dll;d:\asm\ref2.dll" -UseDatabase testDB

#### Execute compiled results

The **execute** command is used to execute compiled results.   

	LocalRunHelper execute -Algebra path_to_compiled_algebra_file [optional_arguments]

The following are optional arguments:

|Argument|Description|
|--------|-----------|
|-DataRoot [default value '']|Data root for metadata execution. It defaults to the **LOCALRUN_DATAROOT** environment variable.|
|-MessageOut [default value '']|Dump messages on the console to a file.|
|-Parallel [default value '1']|Indicator to run the generated local-run steps with the specified parallelism level.|
|-Verbose [default value 'False']|Indicator to show detailed outputs from runtime.|

Here's a usage example:

	LocalRunHelper execute -Algebra d:\test\workdir\C6A101DDCB470506\Script_66AE4909AA0ED06C\__script__.abr –DataRoot c:\DataRoot –Parallel 5

## Use the SDK with programming interfaces

The programming interfaces are all located in the Microsoft.Analytics.LocalRun assembly. You can use them to integrate the functionality of the U-SQL SDK and the C# test framework to scale your U-SQL script local test. For more information about the interfaces, see the appendix.

## Appendix

### Working directory

When you're running the U-SQL script locally, a working directory is created during compilation. In addition to the compilation outputs, the needed runtime files for local execution will be shadow copied to this working directory. If the **-WorkDir** argument is not given on the command line, the default working directory ScopeWorkDir will be created under the current directory. The files under the working directory are as follows:

|Directory/file|Definition|Description|
|--------------|----------|-----------|
|ScopeWorkDir|Working directory|Root folder|
|C6A101DDCB470506|Hash string of runtime version|Shadow copy of runtime files needed for local execution|
|\.\Script_66AE4909AA0ED06C|Script name plus hash string of script path|Compilation outputs and execution step logging|
|\.\.\\_\_script\_\_.abr|Compiler output|Algebra file|
|\.\.\\_\_ScopeCodeGen\_\_.*|Compiler output|Generated managed code|
|\.\.\\_\_ScopeCodeGenEngine\_\_.*|Compiler output|Generated native code|
|\.\.\referenced_assemblies|Assembly reference|Reference assembly files|
|\.\.\deployed_resources|Resource deployment|Resource deployment files|
|\.\.\xxxxxxxx.xxx[1..n]_*.*|Execution log|Log of execution steps|

### Programming interfaces for the Azure Data Lake U-SQL SDK

The programming interfaces are all located in the Microsoft.Analytics.LocalRun assembly.

#### Microsoft.Analytics.LocalRun.Configuration
Microsoft.Analytics.LocalRun.Configuration is the compilation configuration parameter class.

**Constructor**

public Configuration(string rootPath)

|Parameter|Type|Description|
|---------|----|-----------|
|rootPath|System.String|Path to the current directory of the working context. If WorkingDirectory is not set, the default working directory is rootPath plus ScopeWorkDir.|

**Properties**

|Name|Description|
|----|-----------|
|CppSDK|Location of CppSDK, if not the system default configuration. |
|DataDirectory|Location where tables, assemblies, and input/output data are saved. The default is ScopeWorkDir\DataDir. |
|GenerateUdoRedirect|Indicator of whether we want to generate an assembly loading redirection override configuration.|
|WorkingDirectory|Compiler's working directory. The default is ScopeWorkDir.|


#### Microsoft.Analytics.LocalRun.LocalCompiler
Microsoft.Analytics.LocalRun.LocalCompiler is the U-SQL local compiler class.

**Constructor**

public LocalCompiler(Configuration configuration)

|Parameter|Type|Description|
|---------|----|-----------|
|configuration|Microsoft.Analytics.LocalRun.Configuration||

**Method**

public bool Compile(
	string script,
	string filePath,
	bool shallow,
	out CommonCompileResult result
)

|Parameter|Type|Description|
|---------|----|-----------|
|script|System.String|String of the input script.|
|filePath|System.String|Path of the script file. It's set to null to use the default.|
|shallow|System.Boolean|Shallow compile (syntax verification only) or full compile.|
|result|Microsoft.Cosmos.ClientTools.Shared.CommonCompileResult|Detailed compilation results.|
|Return Value|System.Boolean|True: no severe error in compilation. <br>False: severe error in compilation.|

#### Microsoft.Analytics.LocalRun.LocalRunner : IDisposable
Microsoft.Analytics.LocalRun.LocalRunner : IDisposable is the U-SQL local runner class.

**Constructor**

public LocalRunner(
	string algebraFilePath,
	string dataRoot,
	Action<string> postMessage = null
)

|Parameter|Type|Description|
|---------|----|-----------|
|algebraFilePath|System.String|Path to the algebra file|
|dataRoot|System.String|Path to DataRoot|
|postMessage (Optional)|System.Action<String>|Logging handler for progress|

public LocalRunner(
	string algebraFilePath,
	string dataRoot,
	string cachePath,
	string runtimePath,
	string tempPath,
	string logPath,
	Action<Object, ExecutionStatusBase. ExecutionEventArgs> execEventHandler,
	Object eventContext,
	Action<string> postMessage = null
)

|Parameter|Type|Description|
|---------|----|-----------|
|algebraFilePath|System.String|Path to the algebra file.|
|dataRoot|System.String|Path to DataRoot.|
|cachePath|System.String|Path to the directory of the compilation result. It's set to null to use the default, where the algebra file is located.|
|runtimePath|System.String|Path to the directory of the shadow-copied runtime. It's set to null to use the default, where the parent directory of cachePath is located.|
|tempPath|System.String|Temporary storage path, for internal use only. It's set to null.|
|logPath|System.String|Path where execution logs will be written to. It's set to null to use cachePath as the default.|
|execEventHandler|System. Action<Object, ExecutionStatusBase.ExecutionEventArgs>|Event notification handler for execution status change.|
|eventContext|System. Object|Context to the event handler.|
|postMessage (Optional)|System.Action<String>|Logging handler for progress.|

**Properties**

|Name|Description|
|----|-----------|
|AlgebraPath|Path to the algebra file.|
|CachePath|Compiler result cache path where generated binaries are located.|
|CompletedSteps|Number of completed steps.|
|DataRoot|DataRoot for metadata.|
|LastErrorMessage|(Inherited from ExecutionStatusBase.)|
|LogPath|Logging file storage location. The setter will create the directory if it doesn't exist. The previously created log path will not be cleaned.|
|OutputHeader|Dump schema header in textual outputs.|
|Parallelism|Parallelism. Default to logic processors: 1. Changing this after start will result in an exception.|
|Progress|Execution progress in 0 to 100 percent scale.|
|RuntimePath|Location of the runtime files. It must be one directory above CachePath when it is the shadow copy by compiler.|
|Status|Execution status. <br><br>enum ExecutionStatusBase.ExecutionStatus <br>{ <br>Initialized, // Initialized. <br>Running,     // It is running.  WaitOne only checks the event in this state. <br>Success,     // It finished successfully. <br>Error,       // It failed. <br>}|
|TotalSteps|Total number of steps to run. A valid value is available only after the vertex DAG is built.|
|Verbose|Verbose during execution.|

**Method**

|Method|Description|
|------|-----------|
|Cancel()|Cancel the running algebra. <br><br>Return value type is Boolean. <br><br>Return value of false: failed to cancel due to error; check LastErrorMessage for details.|
|Start()|Start to run the algebra. <br><br>Return value type is Boolean. <br><br>Return value of false: failed to start due to error; check LastErrorMessage for details.|
|WaitOne() <br>WaitOne(Int32) <br>WaitOne(TimeSpan) <br>WaitOne(Int32, Boolean) <br>WaitOne(TimeSpan, Boolean)|Wait for completion. Refer to WaitHandle.WaitOne.|
|Dispose()||


## Next steps

* To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
* To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
* To log diagnostics information, see [Accessing diagnostics logs for Azure Data Lake Analytics](data-lake-analytics-diagnostic-logs.md).
* To see a more complex query, see [Analyze website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
* To view job details, see [Use Job Browser and Job View for Azure Data Lake Analytics jobs](data-lake-analytics-data-lake-tools-view-jobs.md).
* To use the vertex execution view, see [Use the Vertex Execution View in Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-use-vertex-execution-view.md).
