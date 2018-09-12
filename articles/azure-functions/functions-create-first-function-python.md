---
title: Create your first Python function in Azure 
description: Learn how to create your first Python function in Azure using the Azure Functions Core Tools and the Azure CLI.
services: functions 
keywords: 
author: ggailey777
ms.author: glenga
ms.date: 08/29/2018
ms.topic: quickstart
ms.service: functions
ms.custom: mvc
ms.devlang: python
manager: jeconnoc
---

# Create your first Python function in Azure

[!INCLUDE [functions-python-preview-note](../../includes/functions-python-preview-note.md)]

This quickstart walks you through creating an HTTP triggered function written in Python, testing it locally and publishing it to Azure as a serverless Function App. By the end of this article, you'll be able to invoke the function from anywhere using an HTTP request.

The following steps are supported on a Mac, Windows, or Linux machine.

## Prerequisites

To build and test locally:

+ Install [Python 3.6](https://www.python.org/downloads/)

+ Install [Azure Core Tools](functions-run-local.md#v2) version 2.0.1.39 or later

To publish and run in Azure:

+ Install the [Azure CLI]( /cli/azure/install-azure-cli) version 2.x or later.

+ You'll need an active Azure subscription.
  [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create and activate a virtual environment

To create a Functions project, it is required that you work in a Python 3.6 virtual environment. You can either use an existing environment or create and activate a new one. For example, the following commands initiate a virtual environment named `env`.

```bash
# In Bash
python3.6 -m venv env
source env/bin/activate

# In PowerShell
py -3.6 -m venv env
env\scripts\activate
```

## Create a local Functions project

You can now create a local Functions project. This directory is the equivalent of a Function App in Azure. It can contain multiple functions that share the same local and hosting configuration.

In the terminal window or from a command prompt, run the following command to create the project:

```bash
func init MyFunctionProj
```

Pick **python** as the desired runtime.

```output
Select a worker runtime:
1. dotnet
2. node
3. python
```

When the command executes, you will see something like the following output.

```output
Installing wheel package
Installing azure-functions package
Installing azure-functions-worker package
Running pip freeze
Writing .gitignore
Writing host.json
Writing local.settings.json
Writing /MyFunctionProj/.vscode/extensions.json
```

A new folder named _MyFunctionProj_ is created. To continue, change directory to this folder:

```bash
cd MyFunctionProj
```

## Create a function

To create a function, run the following command:

```bash
func new
```

Pick `HTTP Trigger` as the desired template and press enter to use the default name for the function.

```output
Select a template:
1. Blob trigger
2. Cosmos DB trigger
3. Event Grid trigger
4. Event Hub trigger
5. HTTP trigger
6. Queue trigger
7. Service Bus Queue trigger
8. Service Bus Topic trigger
9. Timer trigger

Choose option: 5
Function name: [HttpTriggerPython]
```

When the command executes, you will see something like the following output.

```output
Writing /MyFunctionProj/HttpTriggerPython/sample.dat
Writing /MyFunctionProj/HttpTriggerPython/__init__.py
Writing /MyFunctionProj/HttpTriggerPython/function.json
The function "HttpTriggerPython" was created successfully from the "HTTP trigger" template.
```

A sub-folder named _HttpTriggerPython_ is created. This contains `__init__.py` which is the primary script file and `function.json` file which describes the trigger and bindings used by the function. To learn more about the programming model, you can refer to the [Azure Functions Python developer guide](functions-reference-python.md).

## Run the function locally

To run your project locally, run the Functions host using the following command. The host enables triggers for all functions in the project:

```bash
func host start
```

When the Functions host starts, it outputs the URL of your HTTP-triggered function. (Note that the entire output has been  truncated for readability.)

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
Now listening on: http://0.0.0.0:7071
Application started. Press Ctrl+C to shut down.
...

Http Functions:

        HttpTrigger: http://localhost:7071/api/HttpTriggerPython
```

Copy the URL of your function from the output and paste it into your browser's address bar. Append the query string `?name=<yourname>` to this URL and execute the request.

The following screenshot shows the response from the function, when it is triggered from the browser using an HTTP request:

![test](./media/functions-create-first-function-python/function-test-local-browser.png)

Now that you've tested the function locally, you are ready to create the function app and other required resources for publishing to Azure.

[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a Linux function app in Azure

The function app provides an environment for executing your function code. It lets you group functions as a logical unit for easier management, deployment, and sharing of resources. Create a **Python function app running on Linux** using the [az functionapp create](/cli/azure/functionapp#az_functionapp_create) command.

In the following command, use a unique function app name where you see the `<app_name>` placeholder and the storage account name for  `<storage_name>`. The `<app_name>` is also the default DNS domain for the function app. This name needs to be unique across all apps in Azure.

```azurecli
az functionapp create --name <app_name> --storage-account  <storage_name>  --resource-group myResourceGroup \
--location "westus" --runtime python --is-linux
```

> [!NOTE]
> If you have an existing resource group named `myResourceGroup` with any non-Linux App Service apps, you must use a different resource group. You can't host both Windows and Linux apps in the same resource group.  

After the function app has been created, you will see the following message:

```output
Your serverless Linux function app 'myfunctionapp' has been successfully created.
To active this function app, publish your app content using Azure Functions Core Tools or the Azure portal.
```

You're now ready to publish your local python functions project to the Function App in Azure.

## Deploy the function app project to Azure

Using the Azure Functions Core Tools, run the following command. Replace `<app_name>` with the name of your app from the previous step.

```bash
func azure functionapp publish <app_name>
```

When this command executes, you see something like the following output, which has been truncated for readability:

```output
Getting site publishing info...

...

Preparing archive...
Uploading content...
Upload completed successfully.
Deployment completed successfully.
Syncing triggers...
```

## Test the function

Enter the URL below in your browser's address bar. Replace the `<app_name>` placeholder with the name of your function app, and append the query string `&name=<yourname>` to the URL and execute the request.

    http://<app_name>.azurewebsites.net/api/HttpTriggerPython?name=<yourname>

The following screenshot shows the response to your function:

![Function response shown in a browser.](../media/functions-test-function-code/functions-azure-cli-function-test-browser.png)

[!INCLUDE [functions-cleanup-resources](../../includes/functions-cleanup-resources.md)]

## Next steps

Learn more about developing Azure Functions using Python.

> [!div class="nextstepaction"]
> [Azure Functions Python developer guide](functions-reference-python.md)
> [Azure Functions triggers and bindings](functions-triggers-bindings.md)
