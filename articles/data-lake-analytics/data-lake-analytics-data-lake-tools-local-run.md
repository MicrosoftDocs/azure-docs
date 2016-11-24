@@ -23,14 +23,21 @@ Learn how to use Azure Data Lake Tools for Visual Studio and Azure Data Lake U-S

Prerequisites: 

- A Data Lake Analytics account. See [Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md). 
- The Data Lake Tools for Visual Studio.  See [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md). 
- An Azure Data Lake Analytics account. See [Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md). 
- The Azure Data Lake Tools for Visual Studio.  See [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md). 
- The U-SQL script development experience. See [Get started with Azure Data Lake Analytics](data-lake-analytics-get-started-portal.md). 


## Understand data-root and file path

Both local-run and the U-SQL SDK requires a data-root folder. Data-root is a "local store" for the local compute account. It is equivalent to the default Data Lake Store account or the default Storage account of a Data Lake Analytics account in Azure. Everything is contained within the data-root folder. Switching to a different data-root folder is just like switching to a different store account. If you want to access commonly shared data with different data-root folders, you must use absolute paths in your...(line truncated)...
Both local-run and the U-SQL SDK requires a data-root folder. Data-root is a "local store" for the local compute account. It is equivalent to the Data Lake Store account of a Data Lake Analytics account in Azure. Switching to a different data-root folder is just like switching to a different store account. If you want to access commonly shared data with different data-root folders, you must use absolute paths in your scripts or to create file system symbolic links (for example, mklink on NTFS) under this da...(line truncated)...

The data-root folder is used for:

- Store metadata including databases, tables, TVFs, assemblies, etc.
- Look up the input and output paths that are defined as relative paths in U-SQL. Using relative paths makes it easier to deploy your U-SQL projects to Azure.

You can use both relative path and local absolute path in U-SQL scripts, and the relative path is relative to the specified data-root folder path. It is recommended to use "/" as the path separator to make your scripts compatible with the server side. Here are some examples of relative paths and their equivalent absolute path. In these examples, "C:\LocalRunDataRoot" is the data-root:

|Relative path|Absolute path|
|-------------|-------------|
@@ -38,67 +45,56 @@ Both local-run and the U-SQL SDK requires a data-root folder. Data-root is a "lo
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
- Create, view, and delete U-SQL catalogs (local databases, assemblies, schemas, and tables) from Server Explorer. The local catalog also can be found from Server Explorer.

    ![Data Lake Tools for Visual Studio local-run local catalog](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-local-catalog.png)

Data Lake Tools installer creates a "C:\LocalRunRoot" folder to be used as the default data-root folder. The default local-run parallelism is 1. 

Data Lake Tools installer creates a "C:\LocalRunRoot" folder to be use as the default data-root folder. The default local-run parallelism is 1. 

**To configure local-run in Visual Studio**
###To configure local-run in Visual Studio

1. Open Visual Studio.
2. Open **Server Explorer**.
3. Expand **Azure**, **Data Lake Analytics**.
4. Click the **Data Lake** menu, and then click "Options and Settings". 
4. Click the **Data Lake** menu, and then click **Options and Settings**. 
5. On the left tree, expand **Azure Data Lake**, and then expand **General**.

    ![Data Lake Tools for Visual Studio local-run configure settings](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-configure.png)


A Visual Studio U-SQL project is required for performing local-run. This part is different from running U-SQL scripts from Azure.

**To run a U-SQL script locally**
###To run a U-SQL script locally
1. From Visual Studio, open your U-SQL project.   
2. Right-click a U-SQL script in Solution Explorer, and then click **Submit Script**. You can also click (local) account on the top of script window, then click **Submit** (or use the **CTRL + F5** hotkey).
3. Select (local) as the Analytics Account to run your script locally.
2. Right-click a U-SQL script in Solution Explorer, and then click **Submit Script**. Select (local) as the Analytics Account to run your script locally.
3. You can also click (local) account on the top of script window, then click **Submit** (or use the **CTRL + F5** hotkey).

    ![Data Lake Tools for Visual Studio local-run submit jobs](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-submit-job.png)






## Use local-run from Data Lake U-SQL SDK
 
In addition to running U-SQL scripts locally using Visual Studio, you can also use Data Lake U-SQL SDK to run U-SQL scripts locally.

In addition to running U-SQL scripts locally using Visual Studio, you can also use Azure Data Lake U-SQL SDK to run U-SQL scripts locally with command line and programming interfaces, through which you can scale your U-SQL local test.

### Install the SDK

The Data Lake U-SQL SDK requires the following dependencies:

- [Microsoft .Net Framework 4.6 or newer](https://www.microsoft.com/en-us/download/details.aspx?id=17851).
- Microsoft Visual C++ 14 and Windows SDK 10.0.10240.0 or newer. To get this:
- Microsoft Visual C++ 14 and Windows SDK 10.0.10240.0 or newer. There are 2 possible ways to get this:

    - Install Visual Studio ([Visual Studio Community Edition](https://developer.microsoft.com/downloads/vs-thankyou)). You shall have a "\Windows Kits\10" folder under the program files folder, for example, "C:\Program Files (x86)\Windows Kits\10\"; you shall also find the Windows 10 SDK version under "\Windows Kits\10\Lib". If you don’t see these folders, re-install Visual Studio and make sure you have Windows 10 SDK checked when installing. The U-SQL local compiler script will find these dependencies aut...(line truncated)...

    - Install Visual Studio ([Visual Studio Community Edition](https://developer.microsoft.com/downloads/vs-thankyou)). You shall have a "\Windows Kits\10" folder under the program files folder, for example, "C:\Program Files (x86)\Windows Kits\10\"; you shall also find the Windows 10 SDK version under "\Windows Kits\10\Lib". If you don’t see these folders, re-install Visual Studio.
    ![Data Lake Tools for Visual Studio local-run Windows 10 SDK](./media/data-lake-analytics-data-lake-tools-local-run/data-lake-tools-for-visual-studio-local-run-windows-10-sdk.png)
 
    - Install the [Data Lake Tools for Visual Studio](http://aka.ms/adltoolsvs). The prepackaged VC++ and Windows SDK files can be found at 
	C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\ADL Tools\X.X.XXXX.X\CppSDK. You can either copy the files to another location or just use it as is. In this case, you can choose to either set an environment variable "SCOPE_CPP_SDK" to the directory, or to specify "-CppSDK" argument with this directory on the command line of the local-run helper application. 
    - Alternatively, install the [Data Lake Tools for Visual Studio](http://aka.ms/adltoolsvs). The prepackaged VC++ and Windows SDK files can be found at 
	C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\ADL Tools\X.X.XXXX.X\CppSDK. In this case, the U-SQL local compiler can not find the dependencies automatically, you need to specify CppSDK path for it. You can either copy the files to another location or just use it as is. Then, you can choose to either set an environment variable "SCOPE_CPP_SDK" to the directory, or to specify "-CppSDK" argument with this directory on the command line of the local-run helper application...(line truncated)...

After you have installed the SDK, you must perform the following configuration steps:

@@ -108,7 +104,7 @@ After you have installed the SDK, you must perform the following configuration s

        C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\Extensions\Microsoft\Microsoft Azure Data Lake Tools for Visual Studio 2015\X.X.XXXX.X\CppSDK

    Define a new environment variable called "SCOPE_CPP_SDK" to point to this directory.
    Define a new environment variable called "SCOPE_CPP_SDK" to point to this directory. Or copy the folder to other location and specify "SCOPE_CPP_SDK" as that.

    In addition to setting the environment variable, you can also specify the "-CppSDK" argument when using command line. This argument overwrites your default CppSDK environment variable. 

@@ -118,31 +114,24 @@ After you have installed the SDK, you must perform the following configuration s

    In addition to setting the environment variable, you can also specify the "-DataRoot" argument with the data-root path when using command line. This argument overwrites your default Data Root environment variable. And you need to add this argument to every command line you are executing so that you can use the same new overwrite Data Root for all operations. 






### Using the SDK from Command Line

The Command Line Interface of the Helper Application
#### The Command Line Interface of the Helper Application

The LocalRunHelper.exe of the SDK is the command line helper application that provides interfaces to most of the commonly used local-run functions. 
The LocalRunHelper.exe of the SDK is the command line helper application that provides interfaces to most of the commonly used local-run functions. And please note that both the command and the arguments switches are case-sensitive. To invoke it:

    LocalRunHelper.exe <command> <Required-Command-Arguments> [Optional-Command-Arguments]

Both the command and the arguments switches are case-sensitive:

Run "LocalRunHelper.exe" without arguments or with the "help" switch to show the help information:
Run "LocalRunHelper.exe" without arguments or with the **help** switch to show the help information:

    > LocalRunHelper.exe help

    Command 'help' :  Show usage information
    Command 'compile' :  Compile the script
    Required Arguments :
        Command 'help' :  Show usage information
        Command 'compile' :  Compile the script
        Required Arguments :
            -Script param
                    Script File Path
    Optional Arguments :
        Optional Arguments :
            -Shallow [default value 'False']
                    Shallow compile

@@ -152,10 +141,12 @@ In the help information:
-  **Required Argument**  lists arguments that must be supplied.  
-  **Optional Argument**  lists arguments that are optional and with default values.  Optional bool arguments don’t have parameter and their appearances mean negative to their default value.

The helper application returns 0 in the case of success and -1 in the case of failure. By default, the helper will output all messages to the current console.  However, most of the commands support "-MessageOut path_to_log_file" optional argument that will redirect the outputs to a log file.
#### Return Value and Logging

The helper application returns **0** in the case of success and **-1** in the case of failure. By default, the helper will output all messages to the current console.  However, most of the commands support **-MessageOut path_to_log_file** optional argument that will redirect the outputs to a log file.


### The SDK usage samples
### The SDK Usage Samples

#### Compile and Run

@@ -175,30 +166,37 @@ The "compile" command is used to compile a U-SQL script to executables.

    LocalRunHelper compile -Script path_to_usql_script.usql [optional_arguments]

Optional arguments for compilation:
Optional arguments for compilation, you can find more about working directory (-WorkDir) in appendix.

|Argument|Description|
|--------|-----------|
|-CppSDK param [default value '']|CppSDK Directory|
|-DataRoot param [default value '']|DataRoot for data and metadata, default to 'LOCALRUN_DATAROOT' environment variable|
|-MessageOut param [default value '']|Dump messages on console to a file|
|-CppSDK [default value '']|CppSDK Directory|
|-DataRoot [default value '']|DataRoot for data and metadata, default to 'LOCALRUN_DATAROOT' environment variable|
|-MessageOut [default value '']|Dump messages on console to a file|
|-Shallow [default value 'False']|Shallow compile, does only a syntax check of the script and return.|
|-WorkDir param [default value 'D:\localrun\t\ScopeWorkDir']|Directory for compiler usage and outputs, see more in Appendix – Working Directory.|

|-WorkDir [default value 'D:\localrun\t\ScopeWorkDir']|Directory for compiler usage and outputs, see more in Appendix – Working Directory.|

Optional arguments for assemblies and code-behind:

|Argument|Description|
|--------|-----------|
|-CodeBehind [default value 'False']|The script has .cs code behind which will be compiled and registered automatically as UDO object|
|-References param [default value '']|List of paths to extra reference assemblies or data files of code behind, separated by ';'|
|-UseDatabase param [default value 'master']|Database to use for code behind temporary assembly registration|
|-References [default value '']|List of paths to extra reference assemblies or data files of code behind, separated by ';'|
|-UseDatabase [default value 'master']|Database to use for code behind temporary assembly registration|
|-UdoRedirect [default value 'False']|Generate Udo assembly redirect config that tells the .Net runtime to probe dependent assemblies from the compiled output directory first when UDO is called|

Here are some usage examples:

Compile U-SQL script:

	LocalRunHelper compile -Script d:\test\test1.usql

Compile U-SQL script and set data-root folder, note that this will overwrite the set environment variable.

	LocalRunHelper compile -Script d:\test\test1.usql –DataRoot c:\DataRoot

Compile U-SQL script and set working directory, reference assembly and database.

	LocalRunHelper compile -Script d:\test\test1.usql -WorkDir d:\test\bin -References "d:\asm\ref1.dll;d:\asm\ref2.dll" -UseDatabase testDB

#### Execute Compiled Result
@@ -211,20 +209,177 @@ Optional arguments:

|Argument|Description|
|--------|-----------|
|-DataRoot param [default value '']|DataRoot for metadata execution, default to 'LOCALRUN_DATAROOT' environment variable|
|-MessageOut param [default value '']|Dump messages on console to a file|
|-Parallel param [default value '1']|Run the generated local-run steps with the specified parallelism level|
|-DataRoot [default value '']|DataRoot for metadata execution, default to 'LOCALRUN_DATAROOT' environment variable|
|-MessageOut [default value '']|Dump messages on console to a file|
|-Parallel [default value '1']|Run the generated local-run steps with the specified parallelism level|
|-Verbose [default value 'False']|Show detailed outputs from runtime|


Here are a usage example:

	LocalRunHelper execute -Algebra d:\test\workdir\ C6A101DDCB470506\ Script_66AE4909AA0ED06C\__script__.abr –DataRoot c:\DataRoot –Parallel 5
	LocalRunHelper execute -Algebra d:\test\workdir\C6A101DDCB470506\Script_66AE4909AA0ED06C\__script__.abr –DataRoot c:\DataRoot –Parallel 5

## Using the SDK with Programming Interface

The programming interface are all located in the “Microsoft.Analytics.LocalRun” assembly, through which you can integrate the functionality of U-SQL SDK and C# test framework to scale your U-SQL script local test, a new doc for this is coming soon. See appendix for more information about the interfaces.

## Appendix

### Working Directory

## Next steps
When local running the U-SQL script, a working directory is created during compilation.  In addition to the compilation outputs, the needed runtime files for local execution will also be shadow copied to this working directory.   If **-WorkDir** argument is not given on the command line, the default working directory “ScopeWorkDir” will be created under current directory. The files under working directory are shown as below.

|Directory/File|Definition|Description|
|--------------|----------|-----------|
|ScopeWorkDir|The working directory|root folder|
|  C6A101DDCB470506|Hash string of runtime version|Shadow copy of runtime files needed for local execution|
|    Script_66AE4909AA0ED06C|Script name + hash string of script path|Compilation outputs and execution step logging|
|      __script__.abr|Compiler Output|The Algebra file|
|      __ScopeCodeGen__.*|Compiler Output|Generated managed code|
|      __ScopeCodeGenEngine__.*|Compiler Output|Generated native code|
|      referenced_assemblies|Assembly Reference|REFERENCE ASSEMBLY files|
|      deployed_resources|Resource Deployment|RESOURCE DEPLOYMENT files|
|      xxxxxxxx.xxx[1..n]_*.*|Execution Log|Log of execution steps|

### Programming Interfaces for Azure Data Lake U-SQL SDK

The programming interface are all located in the “Microsoft.Analytics.LocalRun” assembly.

#### Microsoft.Analytics.LocalRun.Configuration
Compilation configuration parameter class

**Constructor**

public Configuration(string rootPath)

|Parameter|Type|Description|
|---------|----|-----------|
|rootPath|System.String|Path to current directory of working context. If WorkingDirectory is not set, the default working directory will be rootPath + "ScopeWorkDir".|

**Properties**

|Name|Description|
|----|-----------|
|CppSDK|Where to find Cpp SDK, default to use system default configuration |
|DataDirectory|Where tables and assemblies and input output data are saved, default to ScopeWorkDir\DataDir |
|GenerateUdoRedirect|If we want to generate assembly loading redirection override config|
|WorkingDirectory|Compiler's working directory, default to ScopeWorkDir if not set|


#### Microsoft.Analytics.LocalRun.LocalCompiler
The U-SQL local compiler class

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
|script|System.String|string of the input script|
|filePath|System.String|path of the script file, set to null to use default|
|shallow|System.Boolean|shallow compile (syntax verification only) or full compile|
|result|Microsoft.Cosmos.ClientTools.Shared.CommonCompileResult|Detailed compilation results|
|Return Value|System.Boolean|true: no severe error in compilation. false: severe error in compilation|

#### Microsoft.Analytics.LocalRun.LocalRunner : IDisposable
The U-SQL local runner class

**Constructor**

public LocalRunner(
	string algebraFilePath,
	string dataRoot,
	Action<string> postMessage = null
)

|Parameter|Type|Description|
|---------|----|-----------|
|algebraFilePath|System.String|Path to Algebra file|
|dataRoot|System.String|Path to DataRoot|
|postMessage (Optional)|System.Action<String>|logging handler for progress|

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
|algebraFilePath|System.String|Path to Algebra file|
|dataRoot|System.String|Path to DataRoot|
|cachePath|System.String|Path to directory of compilation result, set to null to use default where Algebra file is located|
|runtimePath|System.String|Path to directory of shadow copied runtime, set to null to use default where parent directory of cachePath|
|tempPath|System.String|Temporary storage path, internal use only, set to null|
|logPath|System.String|Path where execution logs will be written to, set to null to use default as cachePath|
|execEventHandler|System. Action<Object, ExecutionStatusBase.ExecutionEventArgs>|execution status change event notification handler|
|eventContext|System. Object|context to the event handler|
|postMessage (Optional)|System.Action<String>|logging handler for progress|

**Properties**

|Name|Description|
|----|-----------|
|AlgebraPath|Path to the algebra file|
|CachePath|The compiler result cache path where generated binaries are located|
|CompletedSteps|Number of completed steps|
|DataRoot|DataRoot for metadata|
|LastErrorMessage|(Inherited from ExecutionStatusBase.)|
|LogPath|Logging file storage location Setter will create the directory if inexist Previously created log path will not be cleaned|
|OutputHeader|Dump schema header in textual outputs|
|Parallelism|Parallelism, default to logic processors - 1 Changing this after Start will results in an Exception|
|Progress|Execution progress in 0 to 100 percent scale|
|RuntimePath|Where the runtime files are located, must be one directory above CachePath when it is the shadow copy by compiler|
|Status|Execution status 
enum ExecutionStatusBase.ExecutionStatus
{
Initialized, // initialize
Running,     // it is running,  WaitOne only check the event in this state
Success,     // it completed successfully
Error,       // it failed
}|
|TotalSteps|Total number of steps to run, valid value available only after the vertex DAG is built|
|Verbose|Verbose during execution|

**Method**

|Method|Description|
|------|-----------|
|Cancel()|Cancel the running algebra
Return Value
Type: Boolean
false: failed to cancel due to error, check LastErrorMessage for details|
|Start()|Start to run the algebra 
Return Value
Type: Boolean
false: failed to start due to error, check LastErrorMessage for details|
|WaitOne()
WaitOne(Int32)
WaitOne(TimeSpan)
WaitOne(Int32, Boolean)
WaitOne(TimeSpan, Boolean)|Wait for completion, refer to WaitHandle.WaitOne|
|Dispose()||


## See Also

* To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
* To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
* To log diagnostics information, see [Accessing diagnostics logs for Azure Data Lake Analytics](data-lake-analytics-diagnostic-logs.md)
* To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
* To view job details, see [Use Job Browser and Job View for Azure Data lake Analytics jobs](data-lake-analytics-data-lake-tools-view-jobs.md)
* To view use vertex execution view, see [Use the Vertex Execution View in Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-use-vertex-execution-view.md)
* To learn Data Lake Tools for Visual Studio code, see [Use the Azure Data Lake Tools for Visual Studio Code](data-lake-analytics-data-lake-tools-for-vscode.md).
