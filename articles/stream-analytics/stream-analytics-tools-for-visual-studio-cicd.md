---
title: Use the Azure Stream Analytics CI/CD NuGet package
description: This article describes how to use Azure Stream Analytics CI/CD NuGet package to set up a continuous integration and deployment process.
author: su-jie
ms.author: sujie

ms.service: azure-stream-analytics
ms.topic: how-to
ms.date: 05/15/2019
---
# Use the Azure Stream Analytics CI/CD NuGet package for integration and development 
This article describes how to use the Azure Stream Analytics CI/CD NuGet package to set up a continuous integration and deployment process.

Use version 2.3.0000.0 or above of [Stream Analytics tools for Visual Studio](./stream-analytics-quick-create-vs.md) to get support for MSBuild.

A NuGet package is available: [Microsoft.Azure.Stream Analytics.CICD](https://www.nuget.org/packages/Microsoft.Azure.StreamAnalytics.CICD/). It provides the MSBuild, local run, and deployment tools that support the continuous integration and deployment process of [Stream Analytics Visual Studio projects](stream-analytics-vs-tools.md). 
> [!NOTE]
> The NuGet package can be used only with the 2.3.0000.0 or above version of Stream Analytics Tools for Visual Studio. If you have projects created in previous versions of Visual Studio tools, just open them with the 2.3.0000.0 or above version and save. Then the new capabilities are enabled. 

For more information, see [Stream Analytics tools for Visual Studio](./stream-analytics-quick-create-vs.md).

## MSBuild
Like the standard Visual Studio MSBuild experience, to build a project you have two options. You can right-click the project, and then choose **Build**. You also can use **MSBuild** in the NuGet package from the command line.
```
./build/msbuild /t:build [Your Project Full Path] /p:CompilerTaskAssemblyFile=Microsoft.WindowsAzure.StreamAnalytics.Common.CompileService.dll  /p:ASATargetsFilePath="[NuGet Package Local Path]\build\StreamAnalytics.targets"

```

When a Stream Analytics Visual Studio project builds successfully, it generates the following two Azure Resource Manager template files under the **bin/[Debug/Retail]/Deploy** folder: 

* Resource Manager template file

   `[ProjectName].JobTemplate.json`

* Resource Manager parameters file
   
   `[ProjectName].JobTemplate.parameters.json`

The default parameters in the parameters.json file are from the settings in your Visual Studio project. If you want to deploy to another environment, replace the parameters accordingly.

> [!NOTE]
> For all the credentials, the default values are set to null. You are **required** to set the values before you deploy to the cloud.

```json
"Input_EntryStream_sharedAccessPolicyKey": {
      "value": null
    },
```
Learn more about how to [deploy with a Resource Manager template file and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md). Learn more about how to [use an object as a parameter in a Resource Manager template](/azure/architecture/guide/azure-resource-manager/advanced-templates/objects-as-parameters).

To use Managed Identity for Azure Data Lake Store Gen2 as output sink, you need to provide Access to the service principal using PowerShell before deploying to Azure. Learn more about how to [deploy ADLS Gen2 with Managed Identity with Resource Manager template](blob-output-managed-identity.md#azure-resource-manager-deployment).


## Command-line tool

### Build the project
The NuGet package has a command-line tool called **SA.exe**. It supports project build and local testing on an arbitrary machine, which you can use in your continuous integration and continuous delivery process. 

The deployment files are placed under the current directory by default. You can specify the output path by using the following -OutputPath parameter:

```
./tools/SA.exe build -Project [Your Project Full Path] [-OutputPath <outputPath>] 
```

### Test the script locally

If your project has specified local input files in Visual Studio, you can run an automated script test by using the *localrun* command. The output result is placed under the current directory.
 
```
localrun -Project [ProjectFullPath]
```

### Generate a job definition file to use with the Stream Analytics PowerShell API

The *arm* command takes the job template and job template parameter files generated through build as input. Then it combines them into a job definition JSON file that can be used with the Stream Analytics PowerShell API.

```powershell
arm -JobTemplate <templateFilePath> -JobParameterFile <jobParameterFilePath> [-OutputFile <asaArmFilePath>]
```
Example:
```powershell
./tools/SA.exe arm -JobTemplate "ProjectA.JobTemplate.json" -JobParameterFile "ProjectA.JobTemplate.parameters.json" -OutputFile "JobDefinition.json" 
```



## Next steps

* [Quickstart: Create an Azure Stream Analytics cloud job in Visual Studio](stream-analytics-quick-create-vs.md)
* [Test Stream Analytics queries locally with Visual Studio](stream-analytics-vs-tools-local-run.md)
* [Explore Azure Stream Analytics jobs with Visual Studio](stream-analytics-vs-tools.md)