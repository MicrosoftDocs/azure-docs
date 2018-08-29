---
title: Create your first Python function from the command line 
description: Learn how to create your first Python function in Azure using the Azure Functions Core Tools and the Azure CLI.
services: functions 
keywords: 
author: ggailey777
ms.author: glenga
ms.date: 08/27/2018
ms.topic: quickstart
ms.service: functions
ms.custom: mvc
ms.devlang: python
manager: jeconnoc
---

# Create your first Python function using Core Tools and the Azure CLI (preview)

Azure Functions supports Python for you to create, publish, and run your Python functions in Azure. This functionality is currently in preview and requires [the Functions 2.0 runtime](functions-versions.md).

This quickstart article walks you through how to use Azure Functions with the Azure CLI to create your first [serverless](https://azure.microsoft.com/overview/serverless-computing/) Python function app running on Linux. The function code is created locally and then deployed to Azure by using the [Azure Functions Core Tools](functions-run-local.md).

The following steps are supported on a Mac, Windows, or Linux computer.

## Prerequisites

To complete this tutorial:

+ Install [Python 3.6.4](https://www.python.org/downloads/) or a later version of Python 3.x.

+ Install [Azure Core Tools version 2.x](functions-run-local.md#v2).

<!---Verify the correct version of Azure CLI.--->

+ Install the [Azure CLI]( /cli/azure/install-azure-cli). This article requires the Azure CLI version 2.x or later. Run `az --version` to find the version you have.

+ You need an active Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create and activate a Python virtual environment

You need a virtual environment to create a Python function app project locally using the Core Tools. The following command creates a virtual environment named `env`.

```bash
python -m venv env
```

Activate your environment using one of the following commands, depending on your operating system:

+ Terminal

    ```bash
    source env/bin/activate
    ```

+ Command prompt

    ```cmd
    env\Scripts\activate.bat
    ````
+ Powershell

    ```powershell
    .\env\Scripts\activate.ps1
    ```

## Create the local function app project

Run the following command in your `myenv` environment to create a Python function app project in the `MyFunctionProj` folder of the current local directory. A GitHub repo is also created in `MyFunctionProj`.

```bash
func init MyFunctionProj --worker-runtime python
```

When the command executes, you see something like the following output:

```output
Installing wheel package
Installing azure-functions package
Installing azure-functions-worker package
Running pip freeze
Writing .gitignore
Writing host.json
Writing local.settings.json
Writing C:\functions\MyFunctionProj\.vscode\extensions.json
```

## Create a function

The following command navigates to the new project and creates an HTTP triggered function named `MyHtpTrigger` using the  Python-specific `HTTP Trigger` template.

```bash
cd MyFunctionProj
func new --name MyHttpTrigger --template "Http Trigger"
```

When the command executes, you see something like the following output:

```output
Select a language: Select a template: Http Trigger
Function name: [HttpTrigger] 
Writing C:\functions\MyFunctionProj\HttpTrigger\sample.dat
Writing C:\functions\MyFunctionProj\HttpTrigger\__init__.py
Writing C:\functions\MyFunctionProj\HttpTrigger\function.json
```

## Edit the function

Go to the new function.json file for your function, open it in a text editor, update the **authLevel** property in the **bindings.httpTrigger** to `anonymous`, and save your changes.

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

This change lets you call the function in Azure without having to supply the function key. The function key is never required when running locally.

## Run the function locally

The following command starts the function app. The app runs using the same Azure Functions runtime that is in Azure.

```bash
func host start
```

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

Azure Functions Core Tools (2.0.1-beta.35)
Function Runtime Version: 2.0.11960.0
Hosting environment: Production
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

![test](./media/functions-create-first-function-python/function-test-local-browser.png)

Now that you have run your function locally, you can create the function app and other required resources in Azure.

[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a Linux function app in Azure

You must have a function app to host the execution of your functions on Linux. The function app provides a serverless environment for executing your function code. It lets you group functions as a logic unit for easier management, deployment, and sharing of resources. Create a Python function app running on Linux by using the [az functionapp create](/cli/azure/functionapp#az_functionapp_create) command.

In the following command, use a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is also the default DNS domain for the function app. This name needs to be unique across all apps in Azure.

```azurecli
az functionapp create --name <app_name> --storage-account  <storage_name>  --resource-group myResourceGroup \
--location "westeurope" --runtime python --is-linux
```

> [!NOTE]
> If you have an existing resource group named `myResourceGroup` with any non-Linux App Service apps, you must use a different resource group. You can't host both Windows and Linux apps in the same resource group.  

<!--- Output goes here:

After the function app has been created, the Azure CLI shows information similar to the following example:

```json

```

--->

## Generate the requirements.txt file

Use the following Python command to generate a requirement file for your project. This file makes sure that all dependencies are deployed along with your function app.

```bash
pip freeze > requirements.txt
```

## Deploy the function app project to Azure

The following Core Tools command deploys your project to the new function app in Azure. Replace `<app_name>` with the function app name from the previous step.

```bash
func azure functionapp publish <app_name>
```

When deployment executes, you see something like the following output, which as been truncated for readability:

```output
Getting site publishing info...

...

Preparing archive...
Uploading content...
Upload completed successfully.
Deployment completed successfully.
Syncing triggers...
```

[!INCLUDE [functions-test-function-code](../../includes/functions-test-function-code.md)]

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

[!INCLUDE [functions-quickstart-next-steps-cli](../../includes/functions-quickstart-next-steps-cli.md)]
