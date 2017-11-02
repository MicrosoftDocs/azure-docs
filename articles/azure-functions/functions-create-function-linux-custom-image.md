---
title: Create a function on Linux using a custom image | Microsoft Docs 
description: Learn how to create Azure Functions running on a custom Linux image.
services: functions 
keywords: 
author: ggailey777
ms.author: glenga
ms.date: 10/30/2017
ms.topic: quickstart
ms.service: functions
ms.custom: mvc
ms.devlang: azure-cli
manager: cfowler
---

# Create a function on Linux using a custom image

Azure Functions provides a built-in Docker image when running on Linux.   When running on a Linux App Service plan, you can host your function app on the  built-in image or on a custom image. In this tutorial, you learn how to deploy a function app as a custom Docker image. This pattern is useful when the built-in image don't include your language of choice, or when your function app requires a specific configuration that isn't provided within the built-in image.

When you run Azure Functions in a Linux App Service plan, you This tutorial walks through how to use Azure Functions to create your first function on Linux. You use the Azure CLI to create a function app running on a built-in image. This app is the [serverless](https://azure.microsoft.com/overview/serverless-computing/) infrastructure that hosts your function. The function code itself is deployed to the image from a GitHub sample repository.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Storage account. 
> * Create a Linux App Service plan.
> * Deploy a function app from a Docker hub image.
> * Add application settings to the function app. 

You can follow the steps below using a Mac, Windows, or Linux computer. 

## Prerequisites

To complete this tutorial, you need:

* [Git](https://git-scm.com/downloads)
* An active [Azure subscription](https://azure.microsoft.com/pricing/free-trial/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
* [Docker](https://docs.docker.com/get-started/#setup)
* A [Docker Hub account](https://docs.docker.com/docker-id/)

[!INCLUDE [Free trial note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a Linux App Service plan

Linux hosting for Functions is currently not supported on consumption plans. You must run on a Linux App Service plan. To learn more about hosting, see [Azure Functions hosting plans comparison](functions-scale.md). 

[!INCLUDE [app-service-plan-no-h](../../includes/app-service-web-create-app-service-plan-linux-no-h.md)]

## Create and deploy the custom image

The function app hosts the execution of your functions. Create a function app from a Docker Hub image by using the [az functionapp create](/cli/azure/functionapp#create) command. 

In the following command, substitute a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. 

```azurecli-interactive
az functionapp create --name <app_name> --storage-account  <storage_name>  --resource-group myResourceGroup \
--plan myAppServicePlan --deployment-container-image-name microsoft/azure-functions-runtime 
```
After the function app has been created, the Azure CLI shows information similar to the following example:

```json
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "containerSize": 1536,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "quickstart.azurewebsites.net",
  "enabled": true,
  "enabledHostNames": [
    "quickstart.azurewebsites.net",
    "quickstart.scm.azurewebsites.net"
  ],
   ....
    // Remaining output has been truncated for readability.
}
```

The _deployment-container-image-name_ parameter indicates the image hosted on Docker Hub to use to create the function app. 

[!INCLUDE [functions-test-function-code](../../includes/functions-test-function-code.md)]

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

[!INCLUDE [Next steps note](../../includes/functions-quickstart-next-steps-cli.md)]
