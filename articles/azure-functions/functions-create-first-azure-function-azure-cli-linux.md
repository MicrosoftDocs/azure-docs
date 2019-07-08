---
title: Create your first function on Linux in Azure 
description: Learn how to create your first function hosted on Linux in Azure using the Azure Functions Core Tools and the Azure CLI.
services: functions 
keywords: 
author: ggailey777
ms.author: glenga
ms.date: 03/12/2019
ms.topic: quickstart
ms.service: azure-functions
ms.custom: mvc, fasttrack-edit
ms.devlang: javascript
manager: jeconnoc
---

# Create your first function hosted on Linux using Core Tools and the Azure CLI (preview)

Azure Functions lets you execute your code in a [serverless](https://azure.com/serverless) Linux environment without having to first create a VM or publish a web application. Linux-hosting requires [the Functions 2.0 runtime](functions-versions.md). Support to run a function app on Linux in the serverless [Consumption plan](functions-scale.md#consumption-plan) is currently in preview. To learn more, see [this preview considerations article](https://aka.ms/funclinux).

This quickstart article walks you through how to use the Azure CLI to create your first function app running on Linux. The function code is created locally and then deployed to Azure by using the [Azure Functions Core Tools](functions-run-local.md).

The following steps are supported on a Mac, Windows, or Linux computer. This article shows you how to create functions in either JavaScript or C#. To learn how to create Python functions, see [Create your first Python function using Core Tools and the Azure CLI (preview)](functions-create-first-function-python.md).

## Prerequisites

Before running this sample, you must have the following:

- Install [Azure Functions Core Tools](./functions-run-local.md#v2) version 2.6.666 or above.

+ Install the [Azure CLI]( /cli/azure/install-azure-cli). This article requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. You can also use the [Azure Cloud Shell](https://shell.azure.com/bash).

+ An active Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create the local function app project

Run the following command from the command line to create a function app project in the `MyFunctionProj` folder of the current local directory. A GitHub repo is also created in `MyFunctionProj`.

```bash
func init MyFunctionProj
```

When prompted, use the arrow keys to select a worker runtime from the following language choices:

+ `dotnet`: creates a .NET class library project (.csproj).
+ `node`: creates a JavaScript or TypeScript project. When prompted, choose `JavaScript`.
+ `python`: creates a Python project. For Python functions, see the [Python quickstart](functions-create-first-function-python.md).

When the command executes, you see something like the following output:

```output
Writing .gitignore
Writing host.json
Writing local.settings.json
Initialized empty Git repository in C:/functions/MyFunctionProj/.git/
```

Use the following command to navigate to the new `MyFunctionProj` project folder.

```bash
cd MyFunctionProj
```

## Enable extension bundles

[!INCLUDE [functions-extension-bundles](../../includes/functions-extension-bundles.md)]

[!INCLUDE [functions-create-function-core-tools](../../includes/functions-create-function-core-tools.md)]

[!INCLUDE [functions-run-function-test-local](../../includes/functions-run-function-test-local.md)]

[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a Linux function app in Azure

You must have a function app to host the execution of your functions on Linux. The function app provides a serverless environment for executing your function code. It lets you group functions as a logic unit for easier management, deployment, and sharing of resources. Create a function app running on Linux by using the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command.

In the following command, use a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is also the default DNS domain for the function app. This name needs to be unique across all apps in Azure. You should also set the `<language>` runtime for your function app, from `dotnet` (C#), `node` (JavaScript/TypeScript), or `python`.

```azurecli-interactive
az functionapp create --resource-group myResourceGroup --consumption-plan-location westus --os-type Linux \
--name <app_name> --storage-account  <storage_name> --runtime <language>
```

After the function app has been created, you see the following message:

```output
Your serverless Linux function app 'myfunctionapp' has been successfully created.
To active this function app, publish your app content using Azure Functions Core Tools or the Azure portal.
```

Now, you can publish your project to the new function app in Azure.

[!INCLUDE [functions-publish-project](../../includes/functions-publish-project.md)]

[!INCLUDE [functions-test-function-code](../../includes/functions-test-function-code.md)]

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

[!INCLUDE [functions-quickstart-next-steps-cli](../../includes/functions-quickstart-next-steps-cli.md)]