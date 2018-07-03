---
title: How to test your Azure Data Lake Analytics code | Microsoft Docs
description: 'Learn how to add test cases for your U-SQL and extended C# code for Azure Data Lake Analytics.'
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

In this document, we show how you can set up CI/CD pipeline for U-SQL jobs and U-SQL databases.

## CI/CD for U-SQL job

### Build U-SQL project

#### Project migration

Before setting up build task for U-SQL project, make sure you are using the latest version of U-SQL project. Open the U-SQL project file in editor and check if you have below import items:
    <!-- check for SDK Build target in current path then in USQLSDKPath-->
    <Import Project="UsqlSDKBuild.targets" Condition="Exists('UsqlSDKBuild.targets')" />
    <Import Project="$(USQLSDKPath)\UsqlSDKBuild.targets" Condition="!Exists('UsqlSDKBuild.targets') And '$(USQLSDKPath)' != '' And Exists('$(USQLSDKPath)\UsqlSDKBuild.targets')" />

If not, you have two options to migrate the project:

1. Option 1: Change the old import item to the one above.
2. Option 2: Open the old project in Azure Data Lake Tools for Visual Studio after version 2.3.3000.0. The old project template will be upgraded automatically to the newest version. The new created project after version 2.3.3000.0 uses the new template directly.

#### Get Nuget Package

MSBuild doesn't provide built-in support for U-SQL project type. To add this ability, you need to add a reference for your solution to the [Microsoft.Azure.DataLake.USQL.SDK Nuget package](https://www.nuget.org/packages/Microsoft.Azure.DataLake.USQL.SDK/) that adds the required language service.

To add the Nuget package reference, you can right click the solution in Solution Explorer, and choose **Manage NuGet Packages** for Solution, then search and install the Nuget package. Or you can add a file called "packages.config" in the solution folder and add below contents into it.

<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="Microsoft.Azure.DataLake.USQL.SDK" version="1.3.180615" targetFramework="net452" />
</packages>

#### Manage U-SQL database references

If the U-SQL scripts in U-SQL project include query for U-SQL database objects, for example, query a U-SQL table or reference an assembly, you need to reference the corresponding U-SQL database project that contains the definition of these objects in order to build this U-SQL project.

[Learn more about U-SQL database project and how to manage the database references for U-SQL project](dabataproject.md)

#### Build U-SQL project with MSBuild command line
After migrating the project and getting the Nuget package, you can call the standard MSBuild command line with the additional arguments below to build your U-SQL project:

msbuild USQLBuild.usqlproj /p:USQLSDKPath=packages\Microsoft.Azure.DataLake.USQL.SDK.1.3.180615\build\runtime;USQLTargetType=SyntaxCheck;DataRoot=datarootfolder

The arguments definition and values are:

* USQLSDKPath=<U-SQL Nuget package>\build\runtime: This refers to the install path of the NuGet package for the U-SQL language service mentioned above.
* USQLTargetType=Merge or SyntaxCheck:
    * Merge: Merge mode compiles code-behind files, like .cs, .py and .r files, and inlines the resulting user defined code library (such as a dll binary, Python or R code) into the U-SQL script.
    * SyntaxCheck: SyntaxCheck mode first merges code-behind files into the U-SQL script, and then compiles the U-SQL script to validate your code.
* DataRoot=<DataRoot path>: DataRoot is only needed for SyntaxCheck mode. While building the script with SyntaxCheck mode, MSBuild checks the references in the script to database objects. You need to make sure to set up a matching local environment that contains the referenced objects from the U-SQL database on the build machine's DataRoot folder before building. You can also manage these database dependencies by [referencing a U-SQL database project](dabataproject.md). Note that MSBuild only checks database objects reference, not files.

#### Continuous integration with Visual Studio Team Service

Besides the command line, customers can also use Visual Studio Build or MSBuild task to build U-SQL projects in Visual Studio Team Service. To do this, make sure:

1.	Add Nuget restore task to get the solution referenced Nuget package including Azure.DataLake.USQL.SDK, so that MSBuild can find the U-SQL language targets. 
2.	Set MSBuild Arguments, and you can set the arguments in Visual Studio Build or MSBuild task like below, or you can define variables for these arguments in VSTS build definition.
    /p:USQLSDKPath=$(Build.SourcesDirectory)/<your project name>/packages/Microsoft.Azure.DataLake.USQL.SDK.1.3.1019-preview/build/runtime /p:USQLTargetType=SyntaxCheck /p:DataRoot=$(Build.SourcesDirectory)

![Data Lake Set CI CD MSBuild Variables usql project](./media/data-lake-analytics-cicd-overview/set-vsts-msbuild-variables-usql-project.png) 

#### U-SQL project build output

After running build, all scripts in the U-SQL project are built and outputted to a zip file called **USQLProjectName.usqlpack**. The folder structure in your project will be kept in the zipped build output.

>[!NOTE]
>
>Code behind file for each U-SQL script will be merged as inline statement to the script build output.
>

### Test U-SQL script

Azure Data Lake provides test capability for both your U-SQL script and C# UDO/UDAG/UDF:
* [Learn how to add test cases for U-SQL script and extended C# code](data-lake-analytics-cicd-test.md)
* [Learn how to run these test cases in Visual Studio Team Service](data-lake-analytics-cicd-test.md)

### U-SQL job deployment

After verifying code through build and test process, you can submit U-SQL jobs directly from Visual Studio Team Service through **Azure PowerShell task**. You can also deploy the script to Azure Data Lake Store/Azure Blob Storage and [run the scheduled jobs through Azure Data Factory](https://docs.microsoft.com/azure/data-factory/transform-data-using-data-lake-analytics).

#### Submit U-SQL jobs through Visual Studio Team Service

The build output of the U-SQL project is a zip file called **USQLProjectName.usqlpack** contains all U-SQL scripts in the project. You can use the [Azure PowserShell task in Visual Studio Team Service]() with below sample PowserShell script to submit the U-SQL jobs directly from Visual Studio Team Service build and release pipeline.

    param(
        [Parameter(Mandatory=$true)][string]$AnalyticsAccountName, #ADLA account name
        [Parameter(Mandatory=$true)][string]$ArtifactsRoot, #Root folder (e.g. artifacts root folder)
        [Parameter(Mandatory=$false)][string]$DegreeOfParallelism = 1
    )

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
            # [System.IO.Compression.ZipFile]::ExtractToDirectory($USQLPackfile, $UnzipOutput, 0)
            # $USQLPackfileZip = Rename-Item -Path $USQLPackfile -NewName $([System.IO.Path]::ChangeExtension($USQLPackfile, ".zip")) -Force -PassThru
            # Expand-Archive -Path $USQLPackfileZip -DestinationPath $UnzipOutput -Force
        }

        $USQLFiles = Get-ChildItem -Path $UnzipOutput -Include *.usql -File -Recurse -ErrorAction SilentlyContinue | Where-Object {$_.DirectoryName -match $subFolder}

        return $USQLFiles
    }

    Function SubmitAnalyticsJob()
    {
        $usqlFiles = GetUsqlFiles

        Write-Output "$($usqlFiles.Count) jobs to be submitted..."
        # submit each usql script and wait for completion before moving ahead.
        foreach ($usqlFile in $usqlFiles)
        {
            $scriptName = "[Release].[$([System.IO.Path]::GetFileNameWithoutExtension($usqlFile.fullname))]"

            Write-Output "($usqlFiles.IndexOf())Submitting job for '{$usqlFile}'"

            $jobToSubmit = Submit-AzureRmDataLakeAnalyticsJob -Account $AnalyticsAccountName -Name $scriptName -ScriptPath $usqlFile -DegreeOfParallelism $DegreeOfParallelism
            LogJobInformation $jobToSubmit
            
            Write-Output "waiting for job to complete. Job ID:'{$($jobToSubmit.JobId)}', Name: '$($jobToSubmit.Name)' "
            $jobResult = Wait-AzureRmDataLakeAnalyticsJob -Account $AnalyticsAccountName -JobId $jobToSubmit.JobId  
            LogJobInformation $jobResult
            
            # ProcessResult $jobResult
        }
    }

    Function ProcessResult($jobResult)
    {
        if ($jobResult.Result -eq "Failed")
        {
            Write-Error "Job Failed. Job Id: $($jobResult.JobId), Job Name: $($jobResult.Name), Log: $($jobResult.LogFolder)"
        }
        else
        {
            Write-Output "Job Succeeded. Job Id: $($jobResult.JobId), Job Name: $($jobResult.Name)"
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

        Write-Output "Starting USQL script deployment..."

        # Submit ADLA jobs with usql scripts in given sub-folder.
        # Order is important here. Scripts with least dependency goes first followed 
        # by scripts which more dependencies.
        
        SubmitAnalyticsJob

        Write-Output "Finished deployment..."
    }

    Main

#### Deploy U-SQL jobs through Azure Data Factory
Besides of submitting U-SQL jobs directly from Visual Studio Team Service, you can also upload the built scripts to Azure Data Lake Store/Azure Blob Storage and [run the scheduled jobs through Azure Data Factory](https://docs.microsoft.com/azure/data-factory/transform-data-using-data-lake-analytics).

Use the [Azure PowerShell task in Visual Studio Team Service]() with below sample PowerShell script to upload the U-SQL scripts to Azure Data Lake Store account.

    param(
        [Parameter(Mandatory=$true)][string]$ADLSName, #ADLA account name
        [Parameter(Mandatory=$true)][string]$ArtifactsRoot #Root folder (e.g. artifacts root folder)
    )

    Function UploadResources()
    {
        Write-Host "************************************************************************"
        Write-Host "Uploading DLL files to $ADLSName"
        Write-Host "***********************************************************************"

        $usqlScripts = GetUsqlFiles
        Import-AzureRmDataLakeStoreItem -AccountName $ADLSName -Path $usqlScripts.FullName -Destination "/ScriptResource2/$usqlScripts" -Force -Recurse
        # $files = @(get-childitem $usqlScripts -recurse)
        # foreach($file in $files)
        # {
        #    Write-Host "Uploading file: $($file.Name)"
        #    Import-AzureRmDataLakeStoreItem -AccountName $ADLSName -Path $file.FullName -Destination "/ScriptResource/$file" -Force -Recurse
        # }
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

        return $UnzipOutput
    }

    UploadResources

## CI/CD for U-SQL database

Azure Data Lake Tools for Visual Studio provides U-SQL database project template helps developers to develop, manage and deploy the U-SQL databases fast and easily. [Learn more about the U-SQL database project](database.md)

### Build U-SQL database project

#### Get Nuget Package

MSBuild doesn't provide built-in support for U-SQL database project type. To add this ability, you need to add a reference for your solution to the [Microsoft.Azure.DataLake.USQL.SDK Nuget package](https://www.nuget.org/packages/Microsoft.Azure.DataLake.USQL.SDK/) that adds the required language service.

To add the Nuget package reference, you can right click the solution in Solution Explorer, and choose **Manage NuGet Packages** for Solution, then search and install the Nuget package. Or you can add a file called "packages.config" in the solution folder and add below contents into it.

<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="Microsoft.Azure.DataLake.USQL.SDK" version="1.3.180615" targetFramework="net452" />
</packages>

#### Build U-SQL database project with MSBuild command line

You can call the standard MSBuild command line and pass the U-SQL SDK Nuget Package reference as additional argument like below to build your U-SQL database project:

    msbuild DatabaseProject.usqldbproj /p:USQLSDKPath=packages\Microsoft.Azure.DataLake.USQL.SDK.1.3.180615\build\runtime

The arguments **USQLSDKPath=<U-SQL Nuget package>\build\runtime** refers to the install path of the NuGet package for the U-SQL language service mentioned above.

#### Continuous integration with Visual Studio Team Service

Besides the command line, customers can also use **Visual Studio Build** or **MSBuild task** to build U-SQL database projects in Visual Studio Team Service. To do this, make sure:

1.	Add Nuget restore task to get the solution referenced Nuget package including Azure.DataLake.USQL.SDK, so that MSBuild can find the U-SQL language targets. 
2.	Set MSBuild Arguments, and you can set the arguments in Visual Studio Build or MSBuild task like below, or you can define variables for these arguments in VSTS build definition.

    /p:USQLSDKPath=$(Build.SourcesDirectory)/<your project name>/packages/Microsoft.Azure.DataLake.USQL.SDK.1.3.1019-preview/build/runtime

![Data Lake set CI CD MSBuild variables for database project](./media/data-lake-analytics-cicd-overview/set-vsts-msbuild-variables-database-project.png) 

#### U-SQL database project build output

The build output for U-SQL database project is an U-SQL database deployment package, named with suffix **.usqldbpack**. The **.usqldbpack** package is a zip file contains all DDL statements in a single U-SQL script in DDL folder, and all .dlls and additional files for assemblies in Temp folder.

#### Test table valued function and stored procedure

At this moment, we don’t support to add test cases for table valued functions and stored procedures directly. As a workaround, you can create a U-SQL project which has U-SQL scripts calling those functions and write test cases for them. Follow below steps to set up test cases for table valued functions and stored procedures defined in the U-SQL database project:

1.	Create a U-SQL project for test purpose and write U-SQL scripts calling the table valued functions and stored procedures.
2.	Add database reference to this U-SQL project. In order to get the table valued function and stored procedure definition, you need to reference the database project which contains the DDL statement. [Learn more about database reference](database.md)
3.	Add test cases for the U-SQL scripts that call table valued functions and stored procedures. [Learn how to add test cases for U-SQL script](data-lake-analytics-cicd-test.md)

#### Deploy U-SQL database through Visual Studio Team Service

PackageDeploymentTool.exe provides the programming and command line interfaces that help to deploy U-SQL database deloyment package(.usqldbpack). The SDK is included in [U-SQL SDK Nuget package](), locating at build/runtime/PackageDeploymentTool.exe. By using PackageDeploymentTool.exe, you can deploy U-SQL databases to both Azure Data Lake Analytics and local account.

>[!NOTE]
>
>PowerShell command line support and Visual Studio Team Service release task support for U-SQL database deployment is on the way.
>

Follow below steps to set up database deployment task in Visual Studio Team Service:

1. Add a PowerShell Script task in build or release pipeline and execute below PowerShell script. This task helps to get Azure SDK dependencies for PackageDeploymentTool.exe. You can set the -outputfolder parameter to load these dependencies to some specific folder. You need to pass this folder path to PackageDeploymentTool.exe in step 2. 
    param (
        [string]$outputfolder = "RequiredDll",
        [string]$workingfolder = ""
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

    echo "Extracting packages..."

    Expand-Archive Microsoft.Azure.Management.DataLake.Analytics.3.2.3-preview.zip -DestinationPath Microsoft.Azure.Management.DataLake.Analytics.3.2.3-preview -Force
    Expand-Archive Microsoft.Azure.Management.DataLake.Store.2.3.3-preview.zip -DestinationPath Microsoft.Azure.Management.DataLake.Store.2.3.3-preview -Force
    Expand-Archive Microsoft.IdentityModel.Clients.ActiveDirectory.2.28.3.zip -DestinationPath Microsoft.IdentityModel.Clients.ActiveDirectory.2.28.3 -Force
    Expand-Archive Microsoft.Rest.ClientRuntime.2.3.11.zip -DestinationPath Microsoft.Rest.ClientRuntime.2.3.11 -Force
    Expand-Archive Microsoft.Rest.ClientRuntime.Azure.3.3.7.zip -DestinationPath Microsoft.Rest.ClientRuntime.Azure.3.3.7 -Force
    Expand-Archive Microsoft.Rest.ClientRuntime.Azure.Authentication.2.3.3.zip -DestinationPath Microsoft.Rest.ClientRuntime.Azure.Authentication.2.3.3 -Force

    echo "Copy required DLLs to output folder..."

    mkdir $outputfolder -Force
    copy Microsoft.Azure.Management.DataLake.Analytics.3.2.3-preview\lib\net452\*.dll $outputfolder
    copy Microsoft.Azure.Management.DataLake.Store.2.3.3-preview\lib\net452\*.dll $outputfolder
    copy Microsoft.IdentityModel.Clients.ActiveDirectory.2.28.3\lib\net45\*.dll $outputfolder
    copy Microsoft.Rest.ClientRuntime.2.3.11\lib\net452\*.dll $outputfolder
    copy Microsoft.Rest.ClientRuntime.Azure.3.3.7\lib\net452\*.dll $outputfolder
    copy Microsoft.Rest.ClientRuntime.Azure.Authentication.2.3.3\lib\net452\*.dll $outputfolder

2. Add a **Command Line task** in build or release pipeline and fill in the script calling PackageDeploymentTool.exe. The sample script is as follows: 

* Deploy U-SQL database locally

    PackageDeploymentTool.exe deploylocal -Package <package path> -Database <database name> -DataRoot <data root path>

* Use interactive authentication mode to deploy U-SQL database to Azure Data Lake Analytics Account:

    PackageDeploymentTool.exe deploycluster -Package <package path> -Database <database name> -Account <account name> -ResourceGroup <resource group name> -SubscriptionId <subscript id> -Tenant <tanant name> -AzureSDKPath <azure sdk path> -Interactive

* Use secrete authentication to deploy U-SQL database to Azure Data Lake Analytics Account:

    PackageDeploymentTool.exe deploycluster -Package <package path> -Database <database name> -Account <account name> -ResourceGroup <resource group name> -SubscriptionId <subscript id> -Tenant <tanant name> -ClientId <client id> -Secrete <secrete>

* Use certFile authentication to deploy U-SQL database to Azure Data Lake Analytics Account:

    PackageDeploymentTool.exe deploycluster -Package <package path> -Database <database name> -Account <account name> -ResourceGroup <resource group name> -SubscriptionId <subscript id> -Tenant <tanant name> -ClientId <client id> -Secrete <secrete> -CertFile <certFile>

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
|ResourceGroup|Azure resource group name contains the Azure Data Lake Analytics account|null|true|
|SubscriptionId|Azure subscription ID contains the Azure Data Lake Analytics account|null|true|
|Tenant|Tenant name (AAD directory domain name, can be got in subscription management page in Azure Portal)|null|true|
|AzureSDKPath|Path to search dependent assemblies in Azure SDK|null|true|
|Interactive|Use interactive mode for authentication or not|false|false|
|ClientId|AAD application ID for none interactive authentication, required for none interactive authentication|null|required for none interactive authentication|
|Secrete|Secrete/password for none interactive authentication, it should only use in trusted/secure environment|null|required for none interactive authentication, or use SecreteFile|
|SecreteFile|File contains secrete/password for none interactive authentication, make sure to keep it only readable by current user|null|required for none interactive authentication, or use Secrete|
|CertFile|File contains X.509 certification for none interactive authentication, default is to use client secrete authentication|null|false|
|JobPrefix|Prefix for database deployment U-SQL DDL job|Deploy_ + DateTime.Now|false|

## Next Step