---
title: How to set up CI/CD pipeline for Azure Data Lake Analytics | Microsoft Docs
description: 'Learn how to set up continuous integration and continuous deployment for Azure Data Lake Analytics.'
services: data-lake-analytics
documentationcenter: ''
author: yanancai
manager:  
editor: 

ms.assetid: 66dd58b1-0b28-46d1-aaae-43ee2739ae0a
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 07/03/2018
ms.author: yanacai

---
# How to set up CI/CD pipeline for Azure Data Lake Analytics

In this document, you learn how to set up CI/CD pipeline for U-SQL jobs and U-SQL databases.

## CI/CD for U-SQL job

Azure Data Lake Tools for Visual Studio provides the U-SQL project type that helps you organize U-SQL scripts. Using the U-SQL project to manage your U-SQL code makes the further CI/CD scenarios easily.

## Build U-SQL project

The U-SQL project can be built with MSBuild by passing corresponding parameters. Follow the steps below to set up build process for U-SQL projects.

### Project migration

Before setting up build task for U-SQL project, make sure to use the latest version of U-SQL project. Open the U-SQL project file in editor and check if you have below import items:

```   
<!-- check for SDK Build target in current path then in USQLSDKPath-->
<Import Project="UsqlSDKBuild.targets" Condition="Exists('UsqlSDKBuild.targets')" />
<Import Project="$(USQLSDKPath)\UsqlSDKBuild.targets" Condition="!Exists('UsqlSDKBuild.targets') And '$(USQLSDKPath)' != '' And Exists('$(USQLSDKPath)\UsqlSDKBuild.targets')" />
``` 

If not, you have two options to migrate the project:

- Option 1: Change the old import item to the one above.
- Option 2: Open the old project in Azure Data Lake Tools for Visual Studio after version 2.3.3000.0. The old project template will be upgraded automatically to the newest version. The new created project after version 2.3.3000.0 uses the new template directly.

### Get NuGet Package

MSBuild doesn't provide built-in support for U-SQL project type. To add this ability, you need to add a reference for your solution to the [Microsoft.Azure.DataLake.USQL.SDK Nuget package](https://www.nuget.org/packages/Microsoft.Azure.DataLake.USQL.SDK/) that adds the required language service.

To add the NuGet package reference, you can right-click the solution in Solution Explorer and choose **Manage NuGet Packages**. Or you can add a file called `packages.config` in the solution folder and add below contents into it.

```xml 
<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="Microsoft.Azure.DataLake.USQL.SDK" version="1.3.180620" targetFramework="net452" />
</packages>
``` 

### Manage U-SQL database references

If the U-SQL scripts in the U-SQL project has query statements for U-SQL database objects, for example, query a U-SQL table or reference an assembly, you need to reference the corresponding U-SQL database project that includes the definition of these objects before building this U-SQL project.

[Learn more about U-SQL database project](data-lake-analytics-data-lake-tools-develop-usql-database.md)

>[!NOTE]
>U-SQL database project is currently in public preview. If you have DROP statement in the project, the build fails. The DROP statement will be allowed soon.
>

### Build U-SQL project with MSBuild command line

After migrating the project and getting the NuGet package, you can call the standard MSBuild command line with the additional arguments below to build your U-SQL project:

``` 
msbuild USQLBuild.usqlproj /p:USQLSDKPath=packages\Microsoft.Azure.DataLake.USQL.SDK.1.3.180615\build\runtime;USQLTargetType=SyntaxCheck;DataRoot=datarootfolder;/p:EnableDeployment=true
``` 

The arguments definition and values are:

* USQLSDKPath=<U-SQL Nuget package>\build\runtime: This parameter refers to the install path of the NuGet package for the U-SQL language service.
* USQLTargetType=Merge or SyntaxCheck:
    * Merge: Merge mode compiles code-behind files, like .cs, .py and .r files, and inlines the resulting user-defined code library (such as a dll binary, Python, or R code) into the U-SQL script.
    * SyntaxCheck: SyntaxCheck mode first merges code-behind files into the U-SQL script, and then compiles the U-SQL script to validate your code.
* DataRoot=<DataRoot path>: DataRoot is only needed for SyntaxCheck mode. While building the script with SyntaxCheck mode, MSBuild checks the references in the script to database objects. Make sure to set up a matching local environment that contains the referenced objects from the U-SQL database on the build machine's DataRoot folder before building. You can also manage these database dependencies by [referencing a U-SQL database project](data-lake-analytics-data-lake-tools-develop-usql-database.md#reference-a-u-sql-database-project). Note that MSBuild only checks database objects reference, not files.
* EnableDeployment=true or false: EnableDeployment indicates if it is allowed to deploy referenced U-SQL databases during build process. If you reference U-SQL database project, and consume the database objects in your U-SQL script, set this parameter to true.

### Continuous integration with Visual Studio Team Service

Besides the command line, customers can also use Visual Studio Build or MSBuild task to build U-SQL projects in Visual Studio Team Service. To set up build task, make sure:

1.	Add NuGet restore task to get the solution referenced NuGet package including `Azure.DataLake.USQL.SDK`, so that MSBuild can find the U-SQL language targets. Set **Advanced > Destination directory** as `$(Build.SourcesDirectory)/packages` if you want to use the MSBuild arguments sample directly in step 2.

    ![Data Lake Set CI CD MSBuild task for U-SQL project](./media/data-lake-analytics-cicd-overview/data-lake-analytics-set-vsts-msbuild-task.png) 

    ![Data Lake Set CI CD Nuget task for U-SQL project](./media/data-lake-analytics-cicd-overview/data-lake-analytics-set-vsts-nuget-task.png)

2.	Set MSBuild Arguments, and you can set the arguments in Visual Studio Build or MSBuild task like below, or you can define variables for these arguments in VSTS build definition.

    ```
    /p:USQLSDKPath=/p:USQLSDKPath=$(Build.SourcesDirectory)/packages/Microsoft.Azure.DataLake.USQL.SDK.1.3.180615/build/runtime /p:USQLTargetType=SyntaxCheck /p:DataRoot=$(Build.SourcesDirectory) /p:EnableDeployment=true
    ```

    ![Data Lake Set CI CD MSBuild Variables for U-SQL project](./media/data-lake-analytics-cicd-overview/data-lake-analytics-set-vsts-msbuild-variables.png) 

### U-SQL project build output

After running build, all scripts in the U-SQL project are built and outputted to a zip file called `USQLProjectName.usqlpack`. The folder structure in your project will be kept in the zipped build output.

>[!NOTE]
>
>Code behind file for each U-SQL script will be merged as inline statement to the script build output.
>

## Test U-SQL script

Azure Data Lake provides test projects for the U-SQL script and C# UDO/UDAG/UDF:
* [Learn how to add test cases for U-SQL script and extended C# code](data-lake-analytics-cicd-test.md#test-u-sql-scripts)
* [Learn how to run these test cases in Visual Studio Team Service](data-lake-analytics-cicd-test.md#run-test-cases-in-visual-studio-team-service)

## U-SQL job deployment

After verifying code through build and test process, you can submit U-SQL jobs directly from Visual Studio Team Service through **Azure PowerShell task**. You can also deploy the script to Azure Data Lake Store/Azure Blob Storage and [run the scheduled jobs through Azure Data Factory](https://docs.microsoft.com/azure/data-factory/transform-data-using-data-lake-analytics).

### Submit U-SQL jobs through Visual Studio Team Service

The build output of the U-SQL project is a zip file called **USQLProjectName.usqlpack** includes all U-SQL scripts in the project. You can use the [Azure PowserShell task in Visual Studio Team Service](https://docs.microsoft.com/vsts/pipelines/tasks/deploy/azure-powershell?view=vsts) with below sample PowserShell script to submit the U-SQL jobs directly from Visual Studio Team Service build or release pipeline.

```powershell
<#
    This script can be used to submit U-SQL Jobs with given U-SQL project build output(.usqlpack file).
    This will unzip the U-SQL project build output, and submit all scripts one-by-one.

    Note: the code behind file for each U-SQL script will be merged into the built U-SQL script in build output.
          
    Example :
        USQLJobSubmission.ps1 -ADLAAccountName "myadlaaccount" -ArtifactsRoot "C:\USQLProject\bin\debug\" -DegreeOfParallelism 2
#>

param(
    [Parameter(Mandatory=$true)][string]$ADLAAccountName, # ADLA account name to submit U-SQL jobs
    [Parameter(Mandatory=$true)][string]$ArtifactsRoot, # Root folder of U-SQL project build output
    [Parameter(Mandatory=$false)][string]$DegreeOfParallelism = 1
)

function Unzip($USQLPackfile, $UnzipOutput)
{
    $USQLPackfileZip = Rename-Item -Path $USQLPackfile -NewName $([System.IO.Path]::ChangeExtension($USQLPackfile, ".zip")) -Force -PassThru
    Expand-Archive -Path $USQLPackfileZip -DestinationPath $UnzipOutput -Force
    Rename-Item -Path $USQLPackfileZip -NewName $([System.IO.Path]::ChangeExtension($USQLPackfileZip, ".usqlpack")) -Force
}

## Get U-SQL scripts in U-SQL project build output(.usqlpack file)
Function GetUsqlFiles()
{

    $USQLPackfiles = Get-ChildItem -Path $ArtifactsRoot -Include *.usqlpack -File -Recurse -ErrorAction SilentlyContinue

    $UnzipOutput = Join-Path $ArtifactsRoot -ChildPath "UnzipUSQLScripts"

    foreach ($USQLPackfile in $USQLPackfiles)
    {
        Unzip $USQLPackfile $UnzipOutput
    }

    $USQLFiles = Get-ChildItem -Path $UnzipOutput -Include *.usql -File -Recurse -ErrorAction SilentlyContinue

    return $USQLFiles
}

## Submit U-SQL scripts to ADLA account one-by-one
Function SubmitAnalyticsJob()
{
    $usqlFiles = GetUsqlFiles

    Write-Output "$($usqlFiles.Count) jobs to be submitted..."

    # Submit each usql script and wait for completion before moving ahead.
    foreach ($usqlFile in $usqlFiles)
    {
        $scriptName = "[Release].[$([System.IO.Path]::GetFileNameWithoutExtension($usqlFile.fullname))]"

        Write-Output "Submitting job for '{$usqlFile}'"

        $jobToSubmit = Submit-AzureRmDataLakeAnalyticsJob -Account $ADLAAccountName -Name $scriptName -ScriptPath $usqlFile -DegreeOfParallelism $DegreeOfParallelism
        
		LogJobInformation $jobToSubmit
        
        Write-Output "Waiting for job to complete. Job ID:'{$($jobToSubmit.JobId)}', Name: '$($jobToSubmit.Name)' "
        $jobResult = Wait-AzureRmDataLakeAnalyticsJob -Account $ADLAAccountName -JobId $jobToSubmit.JobId  
        LogJobInformation $jobResult
    }
}

Function LogJobInformation($jobInfo)
{
    Write-Output "************************************************************************"
    Write-Output ([string]::Format("Job Id: {0}", $(DefaultIfNull $jobInfo.JobId)))
    Write-Output ([string]::Format("Job Name: {0}", $(DefaultIfNull $jobInfo.Name)))
    Write-Output ([string]::Format("Job State: {0}", $(DefaultIfNull $jobInfo.State)))
    Write-Output ([string]::Format("Job Started at: {0}", $(DefaultIfNull  $jobInfo.StartTime)))
    Write-Output ([string]::Format("Job Ended at: {0}", $(DefaultIfNull  $jobInfo.EndTime)))
    Write-Output ([string]::Format("Job Result: {0}", $(DefaultIfNull $jobInfo.Result)))
    Write-Output "************************************************************************"
}

Function DefaultIfNull($item)
{
    if ($item -ne $null)
	{
        return $item
    }
    return ""
}

Function Main()
{
	Write-Output ([string]::Format("ADLA account: {0}", $ADLAAccountName))
	Write-Output ([string]::Format("Root folde for usqlpack: {0}", $ArtifactsRoot))
	Write-Output ([string]::Format("AU count: {0}", $DegreeOfParallelism))

    Write-Output "Starting USQL script deployment..."
    
	SubmitAnalyticsJob

    Write-Output "Finished deployment..."
}

Main
```

### Deploy U-SQL jobs through Azure Data Factory

Besides of submitting U-SQL jobs directly from Visual Studio Team Service, you can also upload the built scripts to Azure Data Lake Store/Azure Blob Storage and [run the scheduled jobs through Azure Data Factory](https://docs.microsoft.com/azure/data-factory/transform-data-using-data-lake-analytics).

Use the [Azure PowerShell task in Visual Studio Team Service](https://docs.microsoft.com/vsts/pipelines/tasks/deploy/azure-powershell?view=vsts) with below sample PowerShell script to upload the U-SQL scripts to Azure Data Lake Store account.

```powershell
<#
    This script can be used to upload U-SQL files to ADLS with given U-SQL project build output(.usqlpack file).
    This will unzip the U-SQL project build output, and upload all scripts to ADLS one-by-one.
          
    Example :
        FileUpload.ps1 -ADLSName "myadlsaccount" -ArtifactsRoot "C:\USQLProject\bin\debug\"
#>

param(
    [Parameter(Mandatory=$true)][string]$ADLSName, # ADLS account name to upload U-SQL scripts
    [Parameter(Mandatory=$true)][string]$ArtifactsRoot, # Root folder of U-SQL project build output
    [Parameter(Mandatory=$false)][string]$DesitinationFolder = "USQLScriptSource" # Desitination folder in ADLS
)

Function UploadResources()
{
	Write-Host "************************************************************************"
    Write-Host "Uploading files to $ADLSName"
    Write-Host "***********************************************************************"

    $usqlScripts = GetUsqlFiles

    $files = @(get-childitem $usqlScripts -recurse)
    foreach($file in $files)
    {
        Write-Host "Uploading file: $($file.Name)"
        Import-AzureRmDataLakeStoreItem -AccountName $ADLSName -Path $file.FullName -Destination "/$(Join-Path $DesitinationFolder $file)" -Force
    }
}

function Unzip($USQLPackfile, $UnzipOutput)
{
    $USQLPackfileZip = Rename-Item -Path $USQLPackfile -NewName $([System.IO.Path]::ChangeExtension($USQLPackfile, ".zip")) -Force -PassThru
    Expand-Archive -Path $USQLPackfileZip -DestinationPath $UnzipOutput -Force
    Rename-Item -Path $USQLPackfileZip -NewName $([System.IO.Path]::ChangeExtension($USQLPackfileZip, ".usqlpack")) -Force
}

Function GetUsqlFiles()
{

    $USQLPackfiles = Get-ChildItem -Path $ArtifactsRoot -Include *.usqlpack -File -Recurse -ErrorAction SilentlyContinue

    $UnzipOutput = Join-Path $ArtifactsRoot -ChildPath "UnzipUSQLScripts"

    foreach ($USQLPackfile in $USQLPackfiles)
    {
        Unzip $USQLPackfile $UnzipOutput
    }

    return Get-ChildItem -Path $UnzipOutput -Include *.usql -File -Recurse -ErrorAction SilentlyContinue
}

UploadResources
```

## CI/CD for U-SQL database

Azure Data Lake Tools for Visual Studio provides U-SQL database project template helps developers to develop, manage, and deploy the U-SQL databases fast and easily. [Learn more about the U-SQL database project](data-lake-analytics-data-lake-tools-develop-usql-database.md).

## Build U-SQL database project

### Get NuGet Package

MSBuild doesn't provide built-in support for U-SQL database project type. To add this ability, you need to add a reference for your solution to the [Microsoft.Azure.DataLake.USQL.SDK Nuget package](https://www.nuget.org/packages/Microsoft.Azure.DataLake.USQL.SDK/) that adds the required language service.

To add the NuGet package reference, you can right-click the solution in Solution Explorer, and choose **Manage NuGet Packages** for Solution, then search and install the NuGet package. Or you can add a file called "packages.config" in the solution folder and add below contents into it.

```xml
<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="Microsoft.Azure.DataLake.USQL.SDK" version="1.3.180615" targetFramework="net452" />
</packages>
```

### Build U-SQL database project with MSBuild command line

You can call the standard MSBuild command line and pass the U-SQL SDK NuGet Package reference as additional argument like below to build your U-SQL database project:

```
msbuild DatabaseProject.usqldbproj /p:USQLSDKPath=packages\Microsoft.Azure.DataLake.USQL.SDK.1.3.180615\build\runtime
```

The arguments `USQLSDKPath=<U-SQL Nuget package>\build\runtime` refers to the install path of the NuGet package for the U-SQL language service.

### Continuous integration with Visual Studio Team Service

Besides the command line, customers can also use **Visual Studio Build** or **MSBuild task** to build U-SQL database projects in Visual Studio Team Service. To set up build task, make sure:

1.	Add NuGet restore task to get the solution referenced NuGet package including `Azure.DataLake.USQL.SDK`, so that MSBuild can find the U-SQL language targets. Set **Advanced > Destination directory** as `$(Build.SourcesDirectory)/packages` if you want to use the MSBuild arguments sample directly in step 2.

    ![Data Lake Set CI CD MSBuild task for U-SQL project](./media/data-lake-analytics-cicd-overview/data-lake-analytics-set-vsts-msbuild-task.png) 

    ![Data Lake Set CI CD Nuget task for U-SQL project](./media/data-lake-analytics-cicd-overview/data-lake-analytics-set-vsts-nuget-task.png)

2.	Set MSBuild Arguments, and you can set the arguments in Visual Studio Build or MSBuild task like below, or you can define variables for these arguments in VSTS build definition.

    ```
    /p:USQLSDKPath=/p:USQLSDKPath=$(Build.SourcesDirectory)/packages/Microsoft.Azure.DataLake.USQL.SDK.1.3.180615/build/runtime
    ```

    ![Data Lake set CI CD MSBuild variables for U-SQL database project](./media/data-lake-analytics-cicd-overview/data-lake-analytics-set-vsts-msbuild-variables-database-project.png) 

### U-SQL database project build output

The build output for U-SQL database project is an U-SQL database deployment package, named with suffix `.usqldbpack`. The `.usqldbpack` package is a zip file includes all DDL statements in a single U-SQL script in DDL folder, and all .dlls and additional files for assemblies in Temp folder.

## Test table-valued function and stored procedure

At this moment, adding test cases for table-valued functions and stored procedures directly is not supported. As a workaround, you can create a U-SQL project that has U-SQL scripts calling those functions and write test cases for them. Follow below steps to set up test cases for table-valued functions and stored procedures defined in the U-SQL database project:

1.	Create a U-SQL project for test purpose and write U-SQL scripts calling the table-valued functions and stored procedures.
2.	Add database reference to this U-SQL project. In order to get the table-valued function and stored procedure definition, you need to reference the database project that contains the DDL statement. [Learn more about database reference](data-lake-analytics-data-lake-tools-develop-usql-database.md#reference-a-u-sql-database-project).
3.	Add test cases for the U-SQL scripts that call table-valued functions and stored procedures. [Learn how to add test cases for U-SQL script](data-lake-analytics-cicd-test.md#test-u-sql-scripts).

## Deploy U-SQL database through Visual Studio Team Service

`PackageDeploymentTool.exe` provides the programming and command-line interfaces that help to deploy U-SQL database deployment package(.usqldbpack). The SDK is included in [U-SQL SDK NuGet package](https://www.nuget.org/packages/Microsoft.Azure.DataLake.USQL.SDK/), locating at build/runtime/PackageDeploymentTool.exe. By using `PackageDeploymentTool.exe`, you can deploy U-SQL databases to both Azure Data Lake Analytics and local account.

>[!NOTE]
>
>PowerShell command line support and Visual Studio Team Service release task support for U-SQL database deployment is on the way.
>

Follow below steps to set up database deployment task in Visual Studio Team Service:

1. Add a PowerShell Script task in build or release pipeline and execute below PowerShell script. This task helps to get Azure SDK dependencies for `PackageDeploymentTool.exe` and `PackageDeploymentTool.exe`. You can set the -AzureSDK and -DBDeploymentTool parameters to load the dependencies and deployment tool to some specific folders. Pass -AzureSDK path to `PackageDeploymentTool.exe` as -AzureSDKPath parameter in step 2. 

    ```powershell
    <#
        This script is used for getting dependencies and SDKs for U-SQL database deployment.
        PowerShell command line support for deploying U-SQL database package(.usqldbpack file) will come soon.
        
        Example :
            GetUSQLDBDeploymentSDK.ps1 -AzureSDK "AzureSDKFolderPath" -DBDeploymentTool "DBDeploymentToolFolderPath"
    #>

    param (
        [string]$AzureSDK = "AzureSDK", # Folder to cache Azure SDK dependencies
        [string]$DBDeploymentTool = "DBDeploymentTool", # Folder to cache U-SQL dabatase deployment tool
        [string]$workingfolder = "" # Folder to execute these command lines
    )

    if ([string]::IsNullOrEmpty($workingfolder))
    {
        $scriptpath = $MyInvocation.MyCommand.Path
        $workingfolder = Split-Path $scriptpath
    }
    cd $workingfolder

    echo "workingfolder=$workingfolder, outputfolder=$outputfolder"
    echo "Downloading required packages..."

    iwr https://www.nuget.org/api/v2/package/Microsoft.Azure.Management.DataLake.Analytics/3.2.3-preview -outf Microsoft.Azure.Management.DataLake.Analytics.3.2.3-preview.zip
    iwr https://www.nuget.org/api/v2/package/Microsoft.Azure.Management.DataLake.Store/2.3.3-preview -outf Microsoft.Azure.Management.DataLake.Store.2.3.3-preview.zip
    iwr https://www.nuget.org/api/v2/package/Microsoft.IdentityModel.Clients.ActiveDirectory/2.28.3 -outf Microsoft.IdentityModel.Clients.ActiveDirectory.2.28.3.zip
    iwr https://www.nuget.org/api/v2/package/Microsoft.Rest.ClientRuntime/2.3.11 -outf Microsoft.Rest.ClientRuntime.2.3.11.zip
    iwr https://www.nuget.org/api/v2/package/Microsoft.Rest.ClientRuntime.Azure/3.3.7 -outf Microsoft.Rest.ClientRuntime.Azure.3.3.7.zip
    iwr https://www.nuget.org/api/v2/package/Microsoft.Rest.ClientRuntime.Azure.Authentication/2.3.3 -outf Microsoft.Rest.ClientRuntime.Azure.Authentication.2.3.3.zip
    iwr https://www.nuget.org/api/v2/package/Newtonsoft.Json/6.0.8 -outf Newtonsoft.Json.6.0.8.zip
    iwr https://www.nuget.org/api/v2/package/Microsoft.Azure.DataLake.USQL.SDK/ -outf USQLSDK.zip

    echo "Extracting packages..."

    Expand-Archive Microsoft.Azure.Management.DataLake.Analytics.3.2.3-preview.zip -DestinationPath Microsoft.Azure.Management.DataLake.Analytics.3.2.3-preview -Force
    Expand-Archive Microsoft.Azure.Management.DataLake.Store.2.3.3-preview.zip -DestinationPath Microsoft.Azure.Management.DataLake.Store.2.3.3-preview -Force
    Expand-Archive Microsoft.IdentityModel.Clients.ActiveDirectory.2.28.3.zip -DestinationPath Microsoft.IdentityModel.Clients.ActiveDirectory.2.28.3 -Force
    Expand-Archive Microsoft.Rest.ClientRuntime.2.3.11.zip -DestinationPath Microsoft.Rest.ClientRuntime.2.3.11 -Force
    Expand-Archive Microsoft.Rest.ClientRuntime.Azure.3.3.7.zip -DestinationPath Microsoft.Rest.ClientRuntime.Azure.3.3.7 -Force
    Expand-Archive Microsoft.Rest.ClientRuntime.Azure.Authentication.2.3.3.zip -DestinationPath Microsoft.Rest.ClientRuntime.Azure.Authentication.2.3.3 -Force
    Expand-Archive Newtonsoft.Json.6.0.8.zip -DestinationPath Newtonsoft.Json.6.0.8 -Force
    Expand-Archive USQLSDK.zip -DestinationPath USQLSDK -Force

    echo "Copy required DLLs to output folder..."

    mkdir $AzureSDK -Force
    mkdir $DBDeploymentTool -Force
    copy Microsoft.Azure.Management.DataLake.Analytics.3.2.3-preview\lib\net452\*.dll $AzureSDK
    copy Microsoft.Azure.Management.DataLake.Store.2.3.3-preview\lib\net452\*.dll $AzureSDK
    copy Microsoft.IdentityModel.Clients.ActiveDirectory.2.28.3\lib\net45\*.dll $AzureSDK
    copy Microsoft.Rest.ClientRuntime.2.3.11\lib\net452\*.dll $AzureSDK
    copy Microsoft.Rest.ClientRuntime.Azure.3.3.7\lib\net452\*.dll $AzureSDK
    copy Microsoft.Rest.ClientRuntime.Azure.Authentication.2.3.3\lib\net452\*.dll $AzureSDK
    copy Newtonsoft.Json.6.0.8\lib\net45\*.dll $AzureSDK
    copy USQLSDK\build\runtime\*.* $DBDeploymentTool
    ```

2. Add a **Command-Line task** in build or release pipeline and fill in the script calling `PackageDeploymentTool.exe`. `PackageDeploymentTool.exe` is located under defined $DBDeploymentTool folder. The sample script is as follows: 

    * Deploy U-SQL database locally

        ```
        PackageDeploymentTool.exe deploylocal -Package <package path> -Database <database name> -DataRoot <data root path>
        ```

    * Use interactive authentication mode to deploy U-SQL database to Azure Data Lake Analytics Account:

        ```
        PackageDeploymentTool.exe deploycluster -Package <package path> -Database <database name> -Account <account name> -ResourceGroup <resource group name> -SubscriptionId <subscript id> -Tenant <tanant name> -AzureSDKPath <azure sdk path> -Interactive
        ```

    * Use secrete authentication to deploy U-SQL database to Azure Data Lake Analytics Account:

        ```
        PackageDeploymentTool.exe deploycluster -Package <package path> -Database <database name> -Account <account name> -ResourceGroup <resource group name> -SubscriptionId <subscript id> -Tenant <tanant name> -ClientId <client id> -Secrete <secrete>
        ```

    * Use certFile authentication to deploy U-SQL database to Azure Data Lake Analytics Account:

        ```
        PackageDeploymentTool.exe deploycluster -Package <package path> -Database <database name> -Account <account name> -ResourceGroup <resource group name> -SubscriptionId <subscript id> -Tenant <tanant name> -ClientId <client id> -Secrete <secrete> -CertFile <certFile>
        ```

**PackageDeploymentTool.exe parameter description:**

**Common Parameters:**

|Parameter|Description|Default Value|Required|
|---------|-----------|-------------|--------|
|Package|Path of the U-SQL database deployment package to be deployed|null|true|
|Database|Database Name to be deployed to/or created|master|false|
|LogFile|Path of file for logging, default to standard out (console)|null|false|
|LogLevel|Log level : Verbose, Normal, Warning, Error|LogLevel.Normal|false|

**Parameter for local deployment:**

|Parameter|Description|Default Value|Required|
|---------|-----------|-------------|--------|
|DataRoot|Path of the local Data Root Folder|null|true|

**Parameter for Azure Data Lake Analytics deployment:**

|Parameter|Description|Default Value|Required|
|---------|-----------|-------------|--------|
|Account|Specifies deploying to which Azure Data Lake Analytics account by account name|null|true|
|ResourceGroup|Azure resource group name for the Azure Data Lake Analytics account|null|true|
|SubscriptionId|Azure subscription ID for the Azure Data Lake Analytics account|null|true|
|Tenant|Tenant name (AAD directory domain name, you can find it in the subscription management page in Azure portal)|null|true|
|AzureSDKPath|Path to search dependent assemblies in Azure SDK|null|true|
|Interactive|Use interactive mode for authentication or not|false|false|
|ClientId|AAD application ID for none interactive authentication, required for none interactive authentication|null|required for none interactive authentication|
|Secrete|Secrete/password for none interactive authentication, it should only use in trusted/secure environment|null|required for none interactive authentication, or use SecreteFile|
|SecreteFile|File saves secrete/password for none interactive authentication, make sure to keep it only readable by current user|null|required for none interactive authentication, or use Secrete|
|CertFile|File saves X.509 certification for none interactive authentication, default is to use client secrete authentication|null|false|
|JobPrefix|Prefix for database deployment U-SQL DDL job|Deploy_ + DateTime.Now|false|

## Next Steps

- [How to test your Azure Data Lake Analytics code](data-lake-analytics-cicd-test.md)
- [Run U-SQL script on your local machine](data-lake-analytics-data-lake-tools-local-run.md)
- [Use U-SQL database project to develop U-SQL database](data-lake-analytics-data-lake-tools-develop-usql-database.md)
