---
title: How to use Stream Analytics Visual Studio tools to setup CI/CD process  | Microsoft Docs
description:  Tutorial for using Stream Analytics Visual Studio tools to setup CI/CD process
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
ms.date: 9/21/2017
ms.author: sujie

---
[Learn how to use Stream Analytics tools for Visual Studio](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-tools-for-visual-studio)

# Introduction
In this tutorial you will learn how to use the Stream Analytics Visual Studio tools to accomplish CI/CD process.

The latest Stream Analytics tools for Visual Studio add the support for **MSBuild**. 
There is also a newly released NuGet package [Microsoft.Azure.Stream Analytics.CICD](https://www.nuget.org/packages/Microsoft.Azure.StreamAnalytics.CICD/) that provides the MSBuild, local run and deployment tools that support the CI/CD process of Stream Analytics Visual Studio projects.

## MSBuild
Like the standard Visual Studio MSBuild experience, to build a project you can either right click on the project then choose **Build**, 
or use **MSBuild** in the NuGet package from command line.
```
./build/msbuild /t:build [Your Project Full Path] /p:CompilerTaskAssemblyFile=Microsoft.WindowsAzure.StreamAnalytics.Common.CompileService.dll  /p:ASATargetsFilePath="[NuGet Package Local Path]\build\StreamAnalytics.targets"

```

When a Stream Analytics Visual Studio project builds successfully, it generates the following two ARM (Azure Resource Manager) template files under **bin/[Debug/Retail]/Deploy** folder: 

ARM template file.
*       [ProjectName].JobTemplate.json 

ARM parameters file.
*       [ProjectName].JobTemplate.parameters.json   

The default parameters in the parameters.json file are from the settings in your Visual Studio project. If you want to deploy to other environment, just simply replace the parameters accordingly. 
> [!NOTE] For all the credentials, the default values are all set to null. They are **REQUIRED** to set before you deploy it to the cloud.
```json
"Input_EntryStream_sharedAccessPolicyKey": {
      "value": null
    },
```
Learn more on [How to deploy with ARM template and Azure PowerShell](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy) and [How to use an object as a parameter in an Azure Resource Manager template](https://docs.microsoft.com/en-us/azure/architecture/building-blocks/extending-templates/objects-as-parameters).


## Command line tool

### Build the project
In the NuGet package, there is a command line tool called **SA.exe**. It supports project build, local testing on an arbitrary machine, which you can use in your continuous integration and continuous delivery process. 

The deployment files are placed under the current directory by default. You can specify the output path by -OutputPath parameter.

```
./tools/SA.exe build -Project [Your Project Full Path] [-OutputPath <outputPath>] 
```

### Test the script locally

If your project has specified local input files in Visual Studio, you can run automated script test by using the *localrun* command. The output result will be placed 
under current directory.
 
```
localrun -Project [ProjectFullPath]
```

### Generate job definition file to use with Stream Analytics Power Shell.

The *arm* command takes the job template and job template parameter files generated through build as input, combine them into a job definition JSON file which can be used 
with Stream Analytics PowerShell API.

```
arm -JobTemplate <templateFilePath> -JobParameterFile <jobParameterFilePath> [-OutputFile <asaArmFilePath>]
```

```
Example
./tools/SA.exe arm -JobTemplate "ProjectA.JobTemplate.json" -JobParameterFile "ProjectA.JobTemplate.parameters.json" -OutputFile "JobDefinition.json" 
```


