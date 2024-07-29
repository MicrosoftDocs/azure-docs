---
title: Azure CLI samples for Azure Functions
description: Find links to bash scripts for Azure Functions that use the Azure CLI. Learn how to create a function app that allows integration and deployment.
ms.assetid: 577d2f13-de4d-40d2-9dfc-86ecc79f3ab0
ms.topic: sample
ms.date: 04/21/2024
ms.custom: mvc, devx-track-azurecli, seo-azure-cli
keywords: functions, azure cli samples, azure cli examples, azure cli code samples
---

# Azure CLI Samples

These end-to-end Azure CLI scripts are provided to help you learn how to provision and managing the Azure resources required by Azure Functions. You must use the [Azure Functions Core Tools](functions-run-local.md) to create actual Azure Functions code projects from the command line on your local computer and deploy code to these Azure resources. For a complete end-to-end example of developing and deploying from the command line using both Core Tools and the Azure CLI, see one of these language-specific command line quickstarts: 

+ [C#](create-first-function-cli-csharp.md)
+ [Java](create-first-function-cli-java.md)
+ [JavaScript](create-first-function-cli-node.md)
+ [PowerShell](create-first-function-cli-powershell.md)
+ [Python](create-first-function-cli-python.md)
+ [TypeScript](create-first-function-cli-typescript.md)

The following table includes links to bash scripts that you can use to create and manage the Azure resources required by Azure Functions using the Azure CLI.

<a id="create"></a>

| Create app | Description |
|---|---|
| [Create a function app for serverless execution](scripts/functions-cli-create-serverless.md) | Create a function app in a Consumption plan.  |
| [Create a serverless Python function app](scripts/functions-cli-create-serverless-python.md) | Create a Python function app in a Consumption plan. |
| [Create a function app in a scalable Premium plan](scripts/functions-cli-create-premium-plan.md) | Create a function app in a Premium plan. |
| [Create a function app in a dedicated (App Service) plan](scripts/functions-cli-create-app-service-plan.md) | Create a function app in a dedicated App Service plan. |

| Integrate | Description|
|---|---|
| [Create a function app and connect to a storage account](scripts/functions-cli-create-function-app-connect-to-storage-account.md) | Create a function app and connect it to a storage account. |
| [Create a function app and connect to an Azure Cosmos DB](scripts/functions-cli-create-function-app-connect-to-cosmos-db.md) | Create a function app and connect it to an Azure Cosmos DB instance. |
| [Create a Python function app and mount an Azure Files share](scripts/functions-cli-mount-files-storage-linux.md) | By mounting a share to your Linux function app, you can leverage existing machine learning models or other data in your functions. |

| Continuous deployment | Description|
|---|---|
| [Deploy from GitHub](scripts/functions-cli-create-function-app-github-continuous.md) | Create a function app that deploys from a GitHub repository.  |
