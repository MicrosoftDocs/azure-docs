---
title: Create an HTTP triggered function in Azure
description: Learn how to create your first Python function in Azure using the Azure Functions Core Tools and the Azure CLI.
author: ggailey777
ms.author: glenga
ms.date: 09/11/2019
ms.topic: quickstart
ms.service: azure-functions
ms.custom: mvc
ms.devlang: python
manager: gwallace
---

# Create an HTTP triggered function in Azure

This article shows you how to use command-line tools to create a Python project that runs in Azure Functions. An HTTP request triggers the function you create. Finally, you publish your project to run as a [serverless function](functions-scale.md#consumption-plan) in Azure.

This article is the first of two quickstarts for Azure Functions. After you complete this article, you [add an Azure Storage queue output binding](functions-add-output-binding-storage-queue-python.md) to your function.

## Prerequisites

Before you start, you must:

+ Install [Python 3.6.x](https://www.python.org/downloads/).

+ Install [Azure Functions Core Tools](./functions-run-local.md#v2) version 2.7.1575 or a later version.

+ Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.x or a later version.

+ Have an active Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create and activate a virtual environment (optional)

To locally develop and test Python functions, it's recommended to use a Python 3.6.x environment. Run the following commands to create and activate a virtual environment named `.venv`.

> [!NOTE]
> If Python didn't install venv on your Linux distribution, you can install it using the following command:
> ```command
> sudo apt-get install python3-venv

### Bash:

```bash
python -m venv .venv
source .venv/bin/activate
```

### PowerShell or a Windows command prompt:

```powershell
py -m venv .venv
.venv\scripts\activate
```

Now that the virtualenv is activated, you'll run the remaining commands in it. If you want to get out of the virtual environment, run this command:

```console
deactivate
```

## Create a local Functions project

A Functions project is the equivalent of a function app in Azure. It can have multiple functions that all share the same local and hosting configurations.

1. In the virtual environment, run the following command:

```console
func init MyFunctionProj
```
1. Select **python** as your worker runtime.

    The command creates a _MyFunctionProj_. It contains these three files:

    * `local.settings.json`: used to store app settings and connection strings when running locally. This file doesn't get published to Azure.
    * `requirements.txt`: contains the list of packages the system will install on publishing to Azure.
    * `host.json`: contains global configuration options that affect all functions in a function app. This file does get published to Azure.

1. Go to the new *MyFunctionProj* folder:

    ```console
    cd MyFunctionProj
    ```

## Create a function

Now it's time to create a function for the new project.

1. To add a function to your project, run the following command:

    ```console
    func new
    ```

1. Use your down-arrow to select the **HTTP trigger** template.

1. When you're prompted for a function name, enter *HttpTrigger* and then press Enter.

These commands create a subfolder named _HttpTrigger_. It contains the following files:

* **function.json**: configuration file that defines the function, trigger, and other bindings. Take a look at this file. Notice that the value for `scriptFile` points to the file containing the function, while the system defines the invocation trigger and bindings in the `bindings` array.

    Each binding requires a direction, type and a unique name. The HTTP trigger has an input binding of type [`httpTrigger`](functions-bindings-http-webhook.md#trigger) and output binding of type [`http`](functions-bindings-http-webhook.md#output).

* **\_\_init\_\_.py**: script file that is your HTTP triggered function. Open the script. Take note that it contains a default `main()`. HTTP data from the trigger is passed to this function using the `req` named binding parameter. Defined in function.json, `req` is an instance of the [azure.functions.HttpRequest class](/python/api/azure-functions/azure.functions.httprequest). 

    The return object, defined as `$return` in *function.json*, is an instance of [azure.functions.HttpResponse class](/python/api/azure-functions/azure.functions.httpresponse). To learn more, see [Azure Functions HTTP triggers and bindings](functions-bindings-http-webhook.md).

## Run the function locally

The function runs locally using the same Azure Functions runtime that is in Azure.

1. This command starts the function app:

    ```console
    func host start
    ```

    When the Functions host starts, it writes something like the following output. It's truncated so you can read it better:

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

1. Copy the URL of your `HttpTrigger` function from the runtime output.

1.  Paste it into your browser's address bar.

1. Append the query string `?name=<yourname>` to this URL and execute the request. The following screenshot shows the response in the browser to the GET request returned by the local function:

    ![Test locally in the browser](./media/functions-create-first-function-python/function-test-local-browser.png)

1. Select Ctrl+C to shut down your function app

Now that you have run your function locally, you can create the function app and other required resources in Azure.

[!INCLUDE [functions-create-resource-group](../../includes/functions-create-resource-group.md)]

[!INCLUDE [functions-create-storage-account](../../includes/functions-create-storage-account.md)]

## Create a function app in Azure

A function app provides an environment for executing your function code. It lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

Run the following command. Replace `<APP_NAME>` with a unique function app name. Replace `<STORAGE_NAME>` with a storage account name. The `<APP_NAME>` is also the default DNS domain for the function app. This name needs to be unique across all apps in Azure.

```azurecli-interactive
az functionapp create --resource-group myResourceGroup --os-type Linux \
--consumption-plan-location westeurope  --runtime python \
--name <APP_NAME> --storage-account  <STORAGE_NAME>
```
> [!NOTE]
> You can't host Linux and Windows apps in the same resource group. If you have an existing resource group named `myResourceGroup` with a Windows function app or web app, you must use a different resource group.

This command will also provision an associated Azure Application Insights instance. It will be in the same resource group that you can use for monitoring and viewing logs.

You're now ready to publish your local functions project to the function app in Azure.

## Deploy the function app project to Azure

After the function app is created in Azure, you can use the [func azure functionapp publish](functions-run-local.md#project-file-deployment) Core Tools command to deploy your project code to Azure. In these examples, replace `<APP_NAME>` with the name of your app from the previous step.

```azurecli-interactive
func azure functionapp publish <APP_NAME> --build remote
```

The `--build remote` option builds your Python project remotely in Azure from the files in the deployment package. 

You'll see output similar to the following message. It's truncated so you can read it better:

```output
Getting site publishing info...
...

Preparing archive...
Uploading content...
Upload completed successfully.
Deployment completed successfully.
Syncing triggers...
Functions in myfunctionapp:
    HttpTrigger - [httpTrigger]
        Invoke url: https://myfunctionapp.azurewebsites.net/api/httptrigger?code=cCr8sAxfBiow548FBDLS1....
```

Copy the `Invoke url` value for your `HttpTrigger`. You can use it to test your function in Azure. The URL contains a `code` query string value. It's your function key. This key makes it difficult for others to call your HTTP trigger endpoint in Azure.

[!INCLUDE [functions-test-function-code](../../includes/functions-test-function-code.md)]

> [!NOTE]
> To view near real-time logs for a published Python app, we recommend using the [Application Insights Live Metrics Stream](functions-monitoring.md#streaming-logs)

## Next steps

You've created a Python functions project with an HTTP triggered function, run it on your local machine, and deployed it to Azure. Now, extend your function by...

> [!div class="nextstepaction"]
> [Adding an Azure Storage queue output binding](functions-add-output-binding-storage-queue-python.md)
