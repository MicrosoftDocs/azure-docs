---
title: Create your first function using the Azure CLI
description: Learn how to create your first Azure Function for serverless execution using the Azure CLI and Azure Functions Core Tools.
services: functions 
keywords: 
author: ggailey777
ms.author: glenga
ms.assetid: 674a01a7-fd34-4775-8b69-893182742ae0
ms.date: 09/10/2018
ms.topic: quickstart
ms.service: azure-functions
ms.custom: mvc
ms.devlang: azure-cli
manager: jeconnoc
---

# Create your first function from the command line

This quickstart topic walks you through how to create your first function from the command line or terminal. You use the Azure CLI to create a function app, which is the [serverless](https://azure.microsoft.com/solutions/serverless/) infrastructure that hosts your function. The function code project is generated from a template by using the [Azure Functions Core Tools](functions-run-local.md), which is also used to deploy the function app project to Azure.

You can follow the steps below using a Mac, Windows, or Linux computer.

## Prerequisites

Before running this sample, you must have the following:

+ Install [Azure Core Tools version 2.x](functions-run-local.md#v2).

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
+ `node`: creates a JavaScript project.

When the command executes, you see something like the following output:

```output
Writing .gitignore
Writing host.json
Writing local.settings.json
Initialized empty Git repository in C:/functions/MyFunctionProj/.git/
```

## Create a function

The following command navigates to the new project and creates an HTTP triggered function named `MyHtpTrigger`.

```bash
cd MyFunctionProj
func new --name MyHttpTrigger --template "HttpTrigger"
```

When the command executes, you see something like the following output, which is a JavaScript function:

```output
Writing C:\functions\MyFunctionProj\MyHttpTrigger\index.js
Writing C:\functions\MyFunctionProj\MyHttpTrigger\sample.dat
Writing C:\functions\MyFunctionProj\MyHttpTrigger\function.json
```

## Edit the function

By default, the template creates a function that requires a function key when making requests. To make it easier to test the function in Azure, you need to update the function to allow anonymous access. The way that you make this change depends on your functions project language.

### C\#

Open the MyHttpTrigger.cs code file that is your new function and update the **AuthorizationLevel** attribute in the function definition to a value of `anonymous` and save your changes.

```csharp
[FunctionName("MyHttpTrigger")]
        public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, 
            "get", "post", Route = null)]HttpRequest req, ILogger log)
```

### JavaScript

Open the function.json file for your new function, open it in a text editor, update the **authLevel** property in **bindings.httpTrigger** to `anonymous`, and save your changes.

```json
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
```

Now you can call the function in Azure without having to supply the function key. The function key is never required when running locally.

## Run the function locally

The following command starts the function app. The app runs using the same Azure Functions runtime that is in Azure.

```bash
func host start --build
```

The `--build` option is required to compile C# projects. You do not need this option for a JavaScript project.

When the Functions host starts, it write something like the following output, which has been truncated for readability:

```output

                  %%%%%%
                 %%%%%%
            @   %%%%%%    @
          @@   %%%%%%      @@
       @@@    %%%%%%%%%%%    @@@
     @@      %%%%%%%%%%        @@
       @@         %%%%       @@
         @@      %%%       @@
           @@    %%      @@
                %%
                %

...

Content root path: C:\functions\MyFunctionProj
Now listening on: http://0.0.0.0:7071
Application started. Press Ctrl+C to shut down.

...

Http Functions:

        HttpTrigger: http://localhost:7071/api/HttpTrigger

[8/27/2018 10:38:27 PM] Host started (29486ms)
[8/27/2018 10:38:27 PM] Job host started
```

Copy the URL of your `HTTPTrigger` function from the runtime output and paste it into your browser's address bar. Append the query string `?name=<yourname>` to this URL and execute the request. The following shows the response in the browser to the GET request returned by the local function:

![Test locally in the browser](./media/functions-create-first-azure-function-azure-cli/functions-test-local-browser.png)

Now that you have run your function locally, you can create the function app and other required resources in Azure.

[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a function app

You must have a function app to host the execution of your functions. The function app provides an environment for serverless execution of your function code. It lets you group functions as a logic unit for easier management, deployment, and sharing of resources. Create a function app by using the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command. 

In the following command, substitute a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is used as the default DNS domain for the function app, and so the name needs to be unique across all apps in Azure. The _deployment-source-url_ parameter is a sample repository in GitHub that contains a "Hello World" HTTP triggered function.

```azurecli-interactive
az functionapp create --resource-group myResourceGroup --consumption-plan-location westeurope \
--name <app_name> --storage-account  <storage_name>  
```

Setting the _consumption-plan-location_ parameter means that the function app is hosted in a Consumption hosting plan. In this serverless plan, resources are added dynamically as required by your functions and you only pay when functions are running. For more information, see [Choose the correct hosting plan](functions-scale.md).

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

## Configure the function app

Core Tools version 2.x creates projects using templates for the Azure Functions 2.x runtime. Because of this, you need to make sure that the version 2.x runtime is used in Azure. Setting the `FUNCTIONS_WORKER_RUNTIME` application setting to `~2` pins the function app to the latest 2.x version. Set application settings with the [az functionapp config appsettings set](https://docs.microsoft.com/cli/azure/functionapp/config/appsettings#set) command.

In the following Azure CLI command, `<app_name> is the name of your function app.

```azurecli-interactive
az functionapp config appsettings set --name <app_name> \
--resource-group myResourceGroup \
--settings FUNCTIONS_WORKER_RUNTIME=~2
```

[!INCLUDE [functions-publish-project](../../includes/functions-publish-project.md)]

[!INCLUDE [functions-test-function-code](../../includes/functions-test-function-code.md)]

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

[!INCLUDE [functions-quickstart-next-steps-cli](../../includes/functions-quickstart-next-steps-cli.md)]
