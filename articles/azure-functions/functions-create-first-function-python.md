---
title: Create your first Python function from the Azure CLI (preview) | Microsoft Docs 
description: Learn how to create your first Python function in Azure using the Azure CLI.
services: functions 
keywords: 
author: ggailey777
ms.author: glenga
ms.date: 04/21/2018
ms.topic: quickstart
ms.service: functions
ms.custom: mvc
ms.devlang: python
manager: cfowler
---

# Create your first Python function using the Azure CLI (preview)

Azure Functions supports Python for you to create, publish and run your Python functions in Azure. This functionality is currently in preview and requires [the Functions 2.0 runtime](functions-versions.md), which is also in preview.

This quickstart topic walks you through how to use Azure Functions with the Azure CLI to create your first Python function app on Linux hosted on the default App Service container. The function code is created locally from a template and deployed to Azure using the [Azure Functions Core Tools](functions-run-local.md).   

The following steps are supported on a Mac, Windows, or Linux computer. 

## Prerequisites 

To complete this tutorial:

+ Install [Python 3.6.4](https://www.python.org/downloads/) or a later version.

+ Install [Azure Core Tools version 2.x](functions-run-local.md#v2).

+ You need an active Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a Python virtual environment 



```bash
python -m venv myenv
```

## Create the local function app project

```bash
func init MyFunctionProj --language Python
```

## Create a function



```bash
func new --name HttpTriggerPython --template HttpTrigger --language Python
```


## Run the function locally

```bash
func host start
```

Now that you have run your function locally, you can create the resources in Azure 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires the Azure CLI version 2.0.21 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 



[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a Linux App Service plan

Linux hosting for Functions is currently only supported on an App Service plan. Consumption plan hosting is not yet supported. To learn more about hosting, see [Azure Functions hosting plans comparison](functions-scale.md). 

[!INCLUDE [app-service-plan-no-h](../../includes/app-service-web-create-app-service-plan-linux-no-h.md)]

## Create a function app on Linux

You must have a function app to host the execution of your functions on Linux. The function app provides an environment for execution of your function code. It lets you group functions as a logic unit for easier management, deployment, and sharing of resources. Create a function app by using the [az functionapp create](/cli/azure/functionapp#az_functionapp_create) command with a Linux App Service plan. 

In the following command, substitute a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. The _deployment-source-url_ parameter is a sample repository in GitHub that contains a "Hello World" HTTP triggered function.

```azurecli-interactive
az functionapp create --name <app_name> --storage-account  <storage_name>  --resource-group myResourceGroup \
--plan myAppServicePlan 
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

[!INCLUDE [functions-test-function-code](../../includes/functions-test-function-code.md)]

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

[!INCLUDE [functions-quickstart-next-steps-cli](../../includes/functions-quickstart-next-steps-cli.md)]
