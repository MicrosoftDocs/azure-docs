---
title: Deploy Stream Analytics jobs with Bicep Template
description: This article shows you how to generate and deploy Stream Analytics jobs using Bicep template. 
ms.service: stream-analytics
author: alexlzx
ms.author: zhenxilin
ms.date: 05/24/2023
ms.topic: how-to
---

# Deploy Azure Stream Analytics jobs using Bicep templates

The Azure Stream Analytics (ASA) CI/CD npm package allows you to build, test, and deploy your Stream Analytics projects in your CI/CD pipeline. This article shows how to generate bicep templates for deploying your ASA jobs. 

If you don't have a Stream Analytics project, create one using Visual Studio Code or export an existing one from the Azure portal.

## Installation
You can download the package from npm site, or run the following command in your PowerShell.

```powershell
npm install -g azure-streamanalytics-cicd
```

## Build project

```powershell
azure-streamanalytics-cicd build --v2 --project <projectFullPath> [--outputPath <outputPath>]
```


## Generate Bicep templates



## Deploy to Azure

```powershell
    az login
    
    az account set --subscription "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

    az deployment group create --name demodeployment --resource-group {resource-group-name} --template-file .\DeployV2\{project-name}.JobTemplate.bicep --parameters .\DeployV2\bicep-demo.JobTemplate.bicep.parameters.json
```

