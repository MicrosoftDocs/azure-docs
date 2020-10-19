---
title: Use Python to create a function in Azure to respond to HTTP
description: Learn how to create a function from the command line using Python, then publish the local project to serverless hosting in Azure Functions.
ms.date: 09/14/2020
ms.topic: quickstart
ms.custom: [devx-track-python, devx-track-azurecli]
---

# Quickstart: Create a function in Azure using Python that responds to HTTP requests

[!INCLUDE [functions-language-selector-quickstart-cli](../../includes/functions-language-selector-quickstart-cli.md)]

In this article, you use command-line tools to create a Python function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There is also a [Visual Studio Code-based version](create-first-function-vs-code-python.md) of this article.

## Configure your local environment

Before you begin, you must have the following:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [Azure Functions Core Tools](functions-run-local.md#v2) version 3.x.
  
+ The [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

+ [Python 3.8 (64-bit)](https://www.python.org/downloads/release/python-382/), [Python 3.7 (64-bit)](https://www.python.org/downloads/release/python-375/), [Python 3.6 (64-bit)](https://www.python.org/downloads/release/python-368/), which are all supported by version 3.x of Azure Functions.

### Prerequisite check

+ In a terminal or command window, run `func --version` to check that the Azure Functions Core Tools are version 3.x.

+ Run `az --version` to check that the Azure CLI version is 2.4 or later.

+ Run `az login` to sign in to Azure and verify an active subscription.

+ Run `python --version` (Linux/MacOS) or `py --version` (Windows) to check your Python version reports 3.8.x, 3.7.x or 3.6.x.

## Create a local function project

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single function.

Run the `func init` command, as follows, to create a functions project in a folder named *LocalFunctionProj* with the specified runtime:  

```console
func init LocalFunctionProj --python
```

Navigate into the project folder:

```console
cd LocalFunctionProj
```

This folder contains various files for the project, including configurations files named [local.settings.json](functions-run-local.md#local-settings-file) and [host.json](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

Add a function to your project by using the following command, where the `--name` argument is the unique name of your function (HttpExample) and the `--template` argument specifies the function's trigger (HTTP).

```console
func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
```   

`func new` creates a subfolder matching the function name that contains a code file appropriate to the project's chosen language and a configuration file named *function.json*.

### (Optional) Examine the file contents

If desired, you can skip to [Run the function locally](#run-the-function-locally) and examine the file contents later.

#### \_\_init\_\_.py

*\_\_init\_\_.py* contains a `main()` Python function that's triggered according to the configuration in *function.json*.

:::code language="python" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-Python/__init__.py":::

For an HTTP trigger, the function receives request data in the variable `req` as defined in *function.json*. `req` is an instance of the [azure.functions.HttpRequest class](/python/api/azure-functions/azure.functions.httprequest). The return object, defined as `$return` in *function.json*, is an instance of [azure.functions.HttpResponse class](/python/api/azure-functions/azure.functions.httpresponse). To learn more, see [Azure Functions HTTP triggers and bindings](./functions-bindings-http-webhook.md?tabs=python).

#### function.json

*function.json* is a configuration file that defines the input and output `bindings` for the function, including the trigger type.

You can change `scriptFile` to invoke a different Python file if desired.

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-Python/function.json":::

Each binding requires a direction, a type, and a unique name. The HTTP trigger has an input binding of type [`httpTrigger`](functions-bindings-http-webhook-trigger.md) and output binding of type [`http`](functions-bindings-http-webhook-output.md).

[!INCLUDE [functions-run-function-test-local-cli](../../includes/functions-run-function-test-local-cli.md)]

[!INCLUDE [functions-create-azure-resources-cli](../../includes/functions-create-azure-resources-cli.md)]

If you are using Python 3.7 or 3.6, change `--runtime-version` to `3.7` or `3.6`, respectively.

```azurecli
az functionapp create --resource-group AzureFunctionsQuickstart-rg --os-type Linux --consumption-plan-location westeurope --runtime python --runtime-version 3.8 --functions-version 3 --name <APP_NAME> --storage-account <STORAGE_NAME>
```

This command creates a function app running in your specified language runtime under the [Azure Functions Consumption Plan](functions-scale.md#consumption-plan), which is free for the amount of usage you incur here. The command also provisions an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.

[!INCLUDE [functions-publish-project-cli](../../includes/functions-publish-project-cli.md)]

[!INCLUDE [functions-run-remote-azure-cli](../../includes/functions-run-remote-azure-cli.md)]

Run the following command to view near real-time [streaming logs](functions-run-local.md#enable-streaming-logs) in Application Insights in the Azure portal:

```console
func azure functionapp logstream <APP_NAME> --browser
```

In a separate terminal window or in the browser, call the remote function again. A verbose log of the function execution in Azure is shown in the terminal. 

[!INCLUDE [functions-cleanup-resources-cli](../../includes/functions-cleanup-resources-cli.md)]

## Next steps

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue]

[Connect to an Azure Storage queue]: functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-python
