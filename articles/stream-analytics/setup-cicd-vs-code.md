---
title:  Continuously integrate and develop with Azure Stream Analytics CI/CD npm package 
description: This article describes how to use Azure Stream Analytics CI/CD npm package to set up a continuous integration and deployment process.
services: stream-analytics
author: su-jie
ms.author: sujie
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 05/15/2019
---

# Continuously integrate and develop with Stream Analytics CI/CD npm package
This article describes how to use the Azure Stream Analytics CI/CD npm package to set up a continuous integration and deployment process.

## Build the VS Code project

You can enable continuous integration and deployment for Azure Stream Analytics jobs using the **asa-streamanalytics-cicd** npm package. The npm package provides the tools to generate Azure Resource Manager templates of [Stream Analytics Visual Studio Code projects](quick-create-vs-code.md). It can be used on Windows, macOS, and Linux without installing Visual Studio Code.

Once you have [downloaded the package](https://www.npmjs.com/package/azure-streamanalytics-cicd), use the following command to output the Azure Resource Manager templates. The **scriptPath** argument is the absolute path to the **asaql** file in your project. Make sure the asaproj.json and JobConfig.json files are in the same folder with the script file. If the **outputPath** is not specified, the templates will be placed in the **Deploy** folder under the project's **bin** folder.

```powershell
azure-streamanalytics-cicd build -scriptPath <scriptFullPath> -outputPath <outputPath>
```
Example (on macOS)
```powershell
azure-streamanalytics-cicd build -scriptPath "/Users/roger/projects/samplejob/script.asaql" 
```

When a Stream Analytics Visual Studio Code project builds successfully, it generates the following two Azure Resource Manager template files under the **bin/[Debug/Retail]/Deploy** folder: 

*  Resource Manager template file

       [ProjectName].JobTemplate.json 

*  Resource Manager parameters file

       [ProjectName].JobTemplate.parameters.json   

The default parameters in the parameters.json file are from the settings in your Visual Studio Code project. If you want to deploy to another environment, replace the parameters accordingly.

> [!NOTE]
> For all the credentials, the default values are set to null. You are **required** to set the values before you deploy to the cloud.

```json
"Input_EntryStream_sharedAccessPolicyKey": {
      "value": null
    },
```
Learn more about how to [deploy with a Resource Manager template file and Azure PowerShell](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-deploy). Learn more about how to [use an object as a parameter in a Resource Manager template](https://docs.microsoft.com/azure/architecture/building-blocks/extending-templates/objects-as-parameters).

To use Managed Identity for Azure Data Lake Store Gen1 as output sink, you need to provide Access to the service principal using PowerShell before deploying to Azure. Learn more about how to [deploy ADLS Gen1 with Managed Identity with Resource Manager template](stream-analytics-managed-identities-adls.md#resource-manager-template-deployment).
## Next steps

* [Quickstart: Create an Azure Stream Analytics cloud job in Visual Studio Code (Preview)](quick-create-vs-code.md)
* [Test Stream Analytics queries locally with Visual Studio Code (Preview)](vscode-local-run.md)
* [Explore Azure Stream Analytics with Visual Studio Code (Preview)](vscode-explore-jobs.md)
