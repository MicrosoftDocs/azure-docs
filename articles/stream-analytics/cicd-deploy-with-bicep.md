---
title: Deploy Azure Stream Analytics jobs using Bicep files
description: This article shows you how to generate and deploy Azure Stream Analytics jobs using Bicep files. 
ms.service: stream-analytics
ms.custom: devx-track-bicep
author: alexlzx
ms.author: zhenxilin
ms.date: 05/24/2023
ms.topic: how-to
---

# Deploy Stream Analytics jobs with Bicep files

The Azure Stream Analytics (ASA) CI/CD npm package allows you to build, test, and deploy your Stream Analytics projects in your CI/CD pipeline using Bicep files. This article walks you through how to generate bicep files and deploy your ASA jobs. 

Follow this [guide](quick-create-visual-studio-code.md) to create a new Stream Analytics project using Visual Studio Code or export an existing one from the Azure portal.

## Installation
```powershell
npm install -g azure-streamanalytics-cicd
```

## Build project with Bicep
```powershell
# Generate Bicep template
azure-streamanalytics-cicd build --v2 --project <projectFullPath> [--outputPath <outputPath>] --type Bicep

# Example: 
azure-streamanalytics-cicd build --v2 --project ./asaproj.json --outputPath ./Deploy --type Bicep
```

The **build** command does a keyword syntax check and generates Bicep files. If the project is built successfully, you see two files created under the output folder:
* **Bicep template file**: [ProjectName].JobTemplate.bicep
* **Bicep parameter file**: [ProjectName].JobTemplate.bicep.parameters.json

The default values for **parameters.json** file come from your project settings. If you want to deploy to another environment, replace the values accordingly.

The default values for all credentials are null. You're required to set the values before you deploy to Azure.

## Deploy to Azure

```powershell
az login

az account set --subscription "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

az deployment group create --name demodeployment --resource-group {resource-group-name} --template-file .\DeployV2\{project-name}.JobTemplate.bicep --parameters .\DeployV2\{project-name}.JobTemplate.bicep.parameters.json
```

## Next steps

* [Azure Stream Analytics CI/CD tool](cicd-overview.md)
* [Automate builds, tests, and deployments of an Azure Stream Analytics job](cicd-tools.md)
* [Set up CI/CD pipeline for Stream Analytics job using Azure Pipelines](set-up-cicd-pipeline.md)
