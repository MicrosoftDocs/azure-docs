---
title:  Continuously integrate and develop with Stream Analytics CI/CD NPM package 
description: This article describes how to use Azure Stream Analytics CI/CD NPM package to set up a continuous integration and deployment process.
services: stream-analytics
author: su-jie
ms.author: sujie
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 09/27/2017
---


# Continuously integrate and develop with Stream Analytics CI/CD NuGet package
This article describes how to use the Azure Stream Analytics CI/CD NPM package to set up a continuous integration and deployment process.

## build the 

You can enable continuous integration and deployment for Azure Stream Analytics jobs using the [asa-streamanalytics-cicd]() NPM package. The NPM package provides the tools to generate Azure Resource Manager templates of [Stream Analytics Visual Studio Code projects](quick-create-vs-code.md). It can be used on Windows, macOS, and Linux without installing Visual Studio Code.

Once you have [downloaded the package](https://www.npmjs.com/package/azure-streamanalytics-cicd), use the following command to output the Azure Resource Manager templates. If the **outputPath** is not specified, the templates will be placed in the **Deploy** folder under the project's **bin** folder.

```powershell
asa-cicd build -scriptPath <scriptFullPath> -outputPath <outputPath>
```

When a Stream Analytics Visual Studio Code project builds successfully, it generates the following two Azure Resource Manager template files under the **bin/[Debug/Retail]/Deploy** folder: 

*  Resource Manager template file

       [ProjectName].JobTemplate.json 

*  Resource Manager parameters file

       [ProjectName].JobTemplate.parameters.json   

The default parameters in the parameters.json file are from the settings in your Visual Studio project. If you want to deploy to another environment, replace the parameters accordingly.

> [!NOTE]
> For all the credentials, the default values are set to null. You are **required** to set the values before you deploy to the cloud.

```json
"Input_EntryStream_sharedAccessPolicyKey": {
      "value": null
    },
```
Learn more about how to [deploy with a Resource Manager template file and Azure PowerShell](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-deploy). Learn more about how to [use an object as a parameter in a Resource Manager template](https://docs.microsoft.com/azure/architecture/building-blocks/extending-templates/objects-as-parameters).

To use Managed Identity for Azure Data Lake Store Gen1 as output sink, you need to provide Access to the service principal using PowerShell before deploying to Azure. Learn more about how to [deploy ADLS Gen1 with Managed Identity with Resource Manager template](stream-analytics-managed-identities-adls.md#resource-manager-template-deployment).

