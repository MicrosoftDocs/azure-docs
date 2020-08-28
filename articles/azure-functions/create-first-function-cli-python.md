---
title: Use Python to create a function in Azure to respond to HTTP
description: Learn how to create a function from the command line using Python, then publish the local project to serverless hosting in Azure Functions.
ms.date: 09/02/2020
ms.topic: quickstart
ms.custom: devx-track-python
---

# Quickstart: Create a function in Azure using Python that responds to HTTP requests

In this article, you use command-line tools to create a Python function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions. 

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There is also a [Visual Studio Code-based version](functions-create-first-function-vs-code.md) of this article.

[!INCLUDE [functions-requirements-cli](../../includes/functions-requirements-cli.md)]

[!INCLUDE [functions-cli-verify-prereqs](../../includes/functions-cli-verify-prereqs.md)]

[!INCLUDE [functions-cli-create-venv](../../includes/functions-cli-create-venv.md)]

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

[!INCLUDE [functions-cli-add-function](../../includes/functions-cli-add-function.md)]

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

## Create supporting Azure resources for your function

Before you can deploy your function code to Azure, you need to create three resources:

- A resource group, which is a logical container for related resources.
- A Storage account, which maintains state and other information about your projects.
- A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

Use the following Azure CLI commands to create these items. Each command provides JSON output upon completion.

If you haven't done so already, sign in to Azure with the [az login](/cli/azure/reference-index#az-login) command:

```azurecli
az login
```

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group named `AzureFunctionsQuickstart-rg` in the `westeurope` region. (You generally create your resource group and resources in a region near you, using an available region from the `az account list-locations` command.)

```azurecli
az group create --name AzureFunctionsQuickstart-rg --location westeurope
```

> [!NOTE]
> You can't host Linux and Windows apps in the same resource group. If you have an existing resource group named `AzureFunctionsQuickstart-rg` with a Windows function app or web app, you must use a different resource group.

Create a general-purpose storage account in your resource group and region by using the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command. In the following example, replace `<STORAGE_NAME>` with a globally unique name appropriate to you. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account, which is [supported by Functions](storage-considerations.md#storage-account-requirements).

```azurecli
az storage account create --name <STORAGE_NAME> --location westeurope --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS
```

The storage account incurs only a few cents (USD) for this quickstart.

Create the function app using the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command. In the following example, replace `<STORAGE_NAME>` with the name of the account you used in the previous step, and replace `<APP_NAME>` with a globally unique name appropriate to you. The `<APP_NAME>` is also the default DNS domain for the function app. 

If you are using Python 3.8, change `--runtime-version` to `3.8` and `--functions_version` to `3`.

If you are using Python 3.6, change `--runtime-version` to `3.6`.

```azurecli
az functionapp create --resource-group AzureFunctionsQuickstart-rg --os-type Linux --consumption-plan-location westeurope --runtime python --runtime-version 3.7 --functions-version 2 --name <APP_NAME> --storage-account <STORAGE_NAME>
```

This command creates a function app running in your specified language runtime under the [Azure Functions Consumption Plan](functions-scale.md#consumption-plan), which is free for the amount of usage you incur here. The command also provisions an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.

## Deploy the function project to Azure

With the necessary resources in place, you're now ready to deploy your local functions project to the function app in Azure by using the [func azure functionapp publish](functions-run-local.md#project-file-deployment) command. In the following example, replace `<APP_NAME>` with the name of your app.

```console
func azure functionapp publish <APP_NAME>
```

If you see the error, "Can't find app with name ...", wait a few seconds and try again, as Azure may not have fully initialized the app after the previous `az functionapp create` command.

The publish command shows results similar to the following output (truncated for simplicity):

<pre>
...

Getting site publishing info...
Creating archive for current directory...
Performing remote build for functions project.

...

Deployment successful.
Remote build succeeded!
Syncing triggers...
Functions in msdocs-azurefunctions-qs:
    HttpExample - [httpTrigger]
        Invoke url: https://msdocs-azurefunctions-qs.azurewebsites.net/api/httpexample?code=KYHrydo4GFe9y0000000qRgRJ8NdLFKpkakGJQfC3izYVidzzDN4gQ==
</pre>

## Invoke the function on Azure

Because your function uses an HTTP trigger, you invoke it by making an HTTP request to its URL in the browser or with a tool like curl. In both instances, the `code` URL parameter is your unique [function key](functions-bindings-http-webhook-trigger.md#authorization-keys) that authorizes the invocation of your function endpoint.

# [Browser](#tab/browser)

Copy the complete **Invoke URL** shown in the output of the publish command into a browser address bar, appending the query parameter `&name=Functions`. The browser should display similar output as when you ran the function locally.

![The output of the function run on Azure in a browser](./media/functions-create-first-azure-function-azure-cli/function-test-cloud-browser.png)

# [curl](#tab/curl)

Run [`curl`](https://curl.haxx.se/) with the **Invoke URL**, appending the parameter `&name=Functions`. The output of the command should be the text, "Hello Functions."

![The output of the function run on Azure using curl](./media/functions-create-first-azure-function-azure-cli/function-test-cloud-curl.png)

---

> [!TIP]
> To view near real-time logs for a published function app, use the [Application Insights Live Metrics Stream](functions-monitoring.md#streaming-logs).
>
> Run the following command to open the live metrics stream in a browser.
>
>   ```console
>   func azure functionapp logstream <APP_NAME> --browser
>   ```

## Clean up resources

If you continue to the next step, [Add an Azure Storage queue output binding](functions-add-output-binding-storage-queue-cli.md), keep all your resources in place as you'll build on what you've already done.

Otherwise, use the following command to delete the resource group and all its contained resources to avoid incurring further costs.

```azurecli
az group delete --name AzureFunctionsQuickstart-rg
```

To exit the virtual environment, run `deactivate`.

## Next steps

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md)
