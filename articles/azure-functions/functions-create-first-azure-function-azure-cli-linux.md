---
title: Create your first function on Linux from the Azure CLI (preview) | Microsoft Docs 
description: Learn how to create your first Azure Function running on a default Linux image using the Azure CLI.
services: functions 
keywords: 
author: ggailey777
ms.author: glenga
ms.date: 11/15/2017
ms.topic: quickstart
ms.service: azure-functions
ms.custom: mvc
ms.devlang: azure-cli
manager: jeconnoc
---

# Create your first function running on Linux using the Azure CLI (preview)

Azure Functions lets you host your functions on Linux in a default Azure App Service container. You can also [bring your own custom container](functions-create-function-linux-custom-image.md). This functionality is currently in preview and requires [the Functions 2.0 runtime](functions-versions.md).

This quickstart topic walks you through how to use Azure Functions with the Azure CLI to create your first function app on Linux hosted on the default App Service container. The function code itself is deployed to the image from a GitHub sample repository.    

The following steps are supported on a Mac, Windows, or Linux computer. 

## Prerequisites 

To complete this quickstart, you need:

+ An active Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires the Azure CLI version 2.0.21 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a Linux App Service plan

Linux hosting for Functions is currently only supported on an App Service plan. Consumption plan hosting is not yet supported. To learn more about hosting, see [Azure Functions hosting plans comparison](functions-scale.md). 

[!INCLUDE [app-service-plan-no-h](../../includes/app-service-web-create-app-service-plan-linux-no-h.md)]

## Create a function app on Linux

You must have a function app to host the execution of your functions on Linux. The function app provides an environment for execution of your function code. It lets you group functions as a logic unit for easier management, deployment, and sharing of resources. Create a function app by using the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command with a Linux App Service plan. 

In the following command, substitute a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. The _deployment-source-url_ parameter is a sample repository in GitHub that contains a "Hello World" HTTP triggered function.

```azurecli-interactive
az functionapp create --name <app_name> --storage-account  <storage_name>  --resource-group myResourceGroup \
--plan myAppServicePlan --deployment-source-url https://github.com/Azure-Samples/functions-quickstart-linux
```
After the function app has been created and deployed, the Azure CLI shows information similar to the following example:

```json
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
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

Because `myAppServicePlan` is a Linux plan, the built-in docker image is used to create the container that runs the function app on Linux. 

>[!NOTE]  
>The sample repository currently includes two scripting files, [deploy.sh](https://github.com/Azure-Samples/functions-quickstart-linux/blob/master/deploy.sh) and [.deployment](https://github.com/Azure-Samples/functions-quickstart-linux/blob/master/.deployment). The .deployment file tells the deployment process to use deploy.sh as the [custom deployment script](https://github.com/projectkudu/kudu/wiki/Custom-Deployment-Script). In the current preview release, scripts are required to deploy the function app on a Linux image.  

## Configure the function app

The project in the GitHub repository requires the version 1.x of the Functions runtime. Setting the `FUNCTIONS_WORKER_RUNTIME` application setting to `~1` pins the function app to the latest 1.x version. Set application settings with the [az functionapp config appsettings set](https://docs.microsoft.com/cli/azure/functionapp/config/appsettings#set) command.

In the following Azure CLI command, `<app_name> is the name of your function app.

```azurecli-interactive
az functionapp config appsettings set --name <app_name> \
--resource-group myResourceGroup \
--settings FUNCTIONS_WORKER_RUNTIME=~1
```

[!INCLUDE [functions-test-function-code](../../includes/functions-test-function-code.md)]

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

[!INCLUDE [functions-quickstart-next-steps-cli](../../includes/functions-quickstart-next-steps-cli.md)]
