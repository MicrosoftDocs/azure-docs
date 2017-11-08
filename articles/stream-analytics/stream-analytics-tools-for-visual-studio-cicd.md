---
title: Use Stream Analytics Visual Studio tools to set up the continuous integration and deployment process | Microsoft Docs
description: Tutorial for using Stream Analytics Visual Studio tools to set up a continuous integration and deployment process
keywords: visual studio, NuGet, DevOps, CI/CD
documentationcenter: ''
services: stream-analytics
author: su-jie
manager: 
editor: 

ms.assetid: a473ea0a-3eaa-4e5b-aaa1-fec7e9069f20
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 9/27/2017
ms.author: sujie

--- 
# Use Stream Analytics Visual Studio tools to set up a continuous integration and deployment process
In this tutorial, you learn how to use the Azure Stream Analytics Visual Studio tools to set up a continuous integration and deployment process.

The latest version (2.3.0000.0 or above) of [Stream Analytics tools for Visual Studio](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-tools-for-visual-studio) adds support for MSBuild.

There is also a newly released NuGet package, [Microsoft.Azure.Stream Analytics.CICD](https://www.nuget.org/packages/Microsoft.Azure.StreamAnalytics.CICD/). It provides the MSBuild, local run, and deployment tools that support the continuous integration and deployment process of Stream Analytics Visual Studio projects. 
> [!NOTE] 
The NuGet package can be used only with the 2.3.0000.0 or above version of Stream Analytics Tools for Visual Studio. If you have projects created in previous versions of Visual Studio tools, just open them with the 2.3.0000.0 or above version and save. Then the new capabilities are enabled. 

Learn how to use the [Stream Analytics tools for Visual Studio](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-tools-for-visual-studio).

## MSBuild
Like the standard Visual Studio MSBuild experience, to build a project you have two options. You can right-click the project, and then choose **Build**. You also can use **MSBuild** in the NuGet package from the command line.
```
./build/msbuild /t:build [Your Project Full Path] /p:CompilerTaskAssemblyFile=Microsoft.WindowsAzure.StreamAnalytics.Common.CompileService.dll  /p:ASATargetsFilePath="[NuGet Package Local Path]\build\StreamAnalytics.targets"

```

When a Stream Analytics Visual Studio project builds successfully, it generates the following two Azure Resource Manager template files under the **bin/[Debug/Retail]/Deploy** folder: 

*  Resource Manager template file

       [ProjectName].JobTemplate.json 

*  Resource Manager parameters file

       [ProjectName].JobTemplate.parameters.json   

The default parameters in the parameters.json file are from the settings in your Visual Studio project. If you want to deploy to another environment, replace the parameters accordingly.

> [!NOTE] 
For all the credentials, the default values are set to null. You are *required* to set the values before you deploy to the cloud.

```json
"Input_EntryStream_sharedAccessPolicyKey": {
      "value": null
    },
```
Learn more about how to [deploy with a Resource Manager template file and Azure PowerShell](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy). Learn more about how to [use an object as a parameter in a Resource Manager template](https://docs.microsoft.com/en-us/azure/architecture/building-blocks/extending-templates/objects-as-parameters).


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

```
arm -JobTemplate <templateFilePath> -JobParameterFile <jobParameterFilePath> [-OutputFile <asaArmFilePath>]
```
Example:
```
./tools/SA.exe arm -JobTemplate "ProjectA.JobTemplate.json" -JobParameterFile "ProjectA.JobTemplate.parameters.json" -OutputFile "JobDefinition.json" 
```


