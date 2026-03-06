---
title: Azure CLI samples for Azure Functions
description: Find links to bash scripts for Azure Functions that use the Azure CLI. Learn how to create a function app that allows integration and deployment.
ms.assetid: 577d2f13-de4d-40d2-9dfc-86ecc79f3ab0
ms.topic: sample
ms.date: 02/27/2026
ms.custom: mvc, devx-track-azurecli, seo-azure-cli
keywords: functions, azure cli samples, azure cli examples, azure cli code samples
---

# Azure CLI Samples

These end-to-end Azure CLI scripts are provided to help you learn how to provision and manage the Azure resources required by Azure Functions. You must use the [Azure Functions Core Tools](functions-run-local.md) to create actual Azure Functions code projects from the command line on your local computer and deploy code to these Azure resources. For a complete end-to-end example of developing and deploying from the command line using both Core Tools and the Azure CLI, see one of these language-specific command line quickstarts: 

+ [C#](how-to-create-function-azure-cli.md?pivots=programming-language-csharp)
+ [Java](how-to-create-function-azure-cli.md?pivots=programming-language-java)
+ [JavaScript](how-to-create-function-azure-cli.md?pivots=programming-language-javascript)
+ [PowerShell](how-to-create-function-azure-cli.md?pivots=programming-language-powershell)
+ [Python](how-to-create-function-azure-cli.md?pivots=programming-language-python)
+ [TypeScript](how-to-create-function-azure-cli.md?pivots=programming-language-typescript)

The following table includes links to bash scripts that you can use to create and manage the Azure resources required by Azure Functions using the Azure CLI. These scripts are maintained in the [Azure-Samples/azure-cli-samples](https://github.com/Azure-Samples/azure-cli-samples/tree/master/azure-functions) GitHub repository.

<a id="create"></a>

| Create app | Description |
|---|---|
| [create-function-app-flex-consumption.sh](https://github.com/Azure-Samples/azure-cli-samples/tree/master/azure-functions/create-function-app-flex-consumption) | Creates a function app in a Flex Consumption plan with a user-assigned managed identity. **This is the recommended serverless hosting plan.** |
| [create-function-app-consumption.sh](https://github.com/Azure-Samples/azure-cli-samples/tree/master/azure-functions/create-function-app-consumption) | Creates a function app in a Consumption plan. |
| [create-function-app-premium-plan.sh](https://github.com/Azure-Samples/azure-cli-samples/tree/master/azure-functions/create-function-app-premium-plan) | Creates a function app in a Premium (Elastic Premium) plan. |
| [create-function-app-app-service-plan.sh](https://github.com/Azure-Samples/azure-cli-samples/tree/master/azure-functions/create-function-app-app-service-plan) | Creates a function app in a dedicated App Service plan. |

| Connect to services | Description|
|---|---|
| [create-function-app-connect-to-storage-account.sh](https://github.com/Azure-Samples/azure-cli-samples/tree/master/azure-functions/create-function-app-connect-to-storage) | Creates a function app in a Flex Consumption plan and connects it to a storage account using managed identity. |
| [create-function-app-connect-to-cosmos-db.sh](https://github.com/Azure-Samples/azure-cli-samples/tree/master/azure-functions/create-function-app-connect-to-cosmos-db) | Creates a function app in a Flex Consumption plan and connects it to Azure Cosmos DB using managed identity and RBAC. |
| [connect-azure-openai-resources.sh](https://github.com/Azure-Samples/azure-cli-samples/tree/master/azure-functions/connect-azure-openai-resources) | Creates a function app in a Flex Consumption plan and connects it to Azure OpenAI using managed identity. |
| [functions-cli-mount-files-storage-linux.sh](https://github.com/Azure-Samples/azure-cli-samples/tree/master/azure-functions/functions-cli-mount-files-storage-linux) | Creates a Linux function app and mounts an Azure Files share, which lets you leverage existing data or machine learning models in your functions. |

| Deploy code | Description|
|---|---|
| [deploy-function-app-with-function-github-continuous.sh](https://github.com/Azure-Samples/azure-cli-samples/tree/master/azure-functions/deploy-function-app-with-function-github-continuous) | Creates a function app in a Consumption plan and deploys code from a public GitHub repository. |
