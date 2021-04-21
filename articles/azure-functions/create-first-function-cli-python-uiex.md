---
title: Create a Python function from the command line for Azure Functions
description: Learn how to create a Python function from the command line and publish the local project to serverless hosting in Azure Functions.
ms.date: 11/03/2020
ms.topic: quickstart
ms.custom: [devx-track-python, devx-track-azurecli] 
ROBOTS: NOINDEX,NOFOLLOW
---

# Quickstart: Create a Python function in Azure from the command line

> [!div class="op_single_selector" title1="Select your function language: "]
> - [Python](create-first-function-cli-python.md)
> - [C#](create-first-function-cli-csharp.md)
> - [Java](create-first-function-cli-java.md)
> - [JavaScript](create-first-function-cli-node.md)
> - [PowerShell](create-first-function-cli-powershell.md)
> - [TypeScript](create-first-function-cli-typescript.md)

In this article, you use command-line tools to create a Python function that responds to HTTP requests. After testing the code locally, you deploy it to the <abbr title="A runtime computing environment in which all the details of the server are transparent to application developers, which simplifies the process of deploying and managing code.">serverless</abbr> environment of <abbr title="An Azure service that provides a low-cost serverless computing environment for applications.">Azure Functions</abbr>.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There is also a [Visual Studio Code-based version](create-first-function-vs-code-python.md) of this article.

## 1. Configure your environment

Before you begin, you must have the following:

+ An Azure <abbr title="The profile that maintains billing information for Azure usage.">account</abbr> with an active <abbr title="The basic organizational structure in which you manage resources in Azure, typically associated with an individual or department within an organization.">subscription</abbr>. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ The [Azure Functions Core Tools](functions-run-local.md#v2) version 3.x. 
  
+ Either the <abbr title="A set of cross-platform command line tools for working with Azure resources from your local development computer, as an alternative to using the Azure portal.">Azure CLI</abbr> or <abbr title="A PowerShell module that provides commands for working with Azure resources from your local development computer, as an alternative to using the Azure portal.">Azure PowerShell</abbr> for creating Azure resources:

    + [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

    + [Azure PowerShell](/powershell/azure/install-az-ps) version 5.0 or later.

+ [Python 3.8 (64-bit)](https://www.python.org/downloads/release/python-382/), [Python 3.7 (64-bit)](https://www.python.org/downloads/release/python-375/), [Python 3.6 (64-bit)](https://www.python.org/downloads/release/python-368/), which are all supported by version 3.x of Azure Functions.

### 1.1 Prerequisite check

Verify your prerequisites, which depend on whether you are using the Azure CLI or Azure PowerShell for creating Azure resources:

# [Azure CLI](#tab/azure-cli)

+ In a terminal or command window, run `func --version` to check that the <abbr title="The set of command line tools for working with Azure Functions on your local computer.">Azure Functions Core Tools</abbr> are version 3.x.

+ Run `az --version` to check that the Azure CLI version is 2.4 or later.

+ Run `az login` to sign in to Azure and verify an active subscription.

+ Run `python --version` (Linux/macOS) or `py --version` (Windows) to check your Python version reports 3.8.x, 3.7.x or 3.6.x.

# [Azure PowerShell](#tab/azure-powershell)

+ In a terminal or command window, run `func --version` to check that the <abbr title="The set of command line tools for working with Azure Functions on your local computer.">Azure Functions Core Tools</abbr> are version 3.x.

+ Run `(Get-Module -ListAvailable Az).Version` and verify version 5.0 or later. 

+ Run `Connect-AzAccount` to sign in to Azure and verify an active subscription.

+ Run `python --version` (Linux/macOS) or `py --version` (Windows) to check your Python version reports 3.8.x, 3.7.x or 3.6.x.

---

<br/>

---

## 2. <a name="create-venv"></a>Create and activate a virtual environment

In a suitable folder, run the following commands to create and activate a virtual environment named `.venv`. Be sure to use Python 3.8, 3.7 or 3.6, which are supported by Azure Functions.

# [bash](#tab/bash)

```bash
python -m venv .venv
```

```bash
source .venv/bin/activate
```

If Python didn't install the venv package on your Linux distribution, run the following command:

```bash
sudo apt-get install python3-venv
```

# [PowerShell](#tab/powershell)

```powershell
py -m venv .venv
```

```powershell
.venv\scripts\activate
```

# [Cmd](#tab/cmd)

```cmd
py -m venv .venv
```

```cmd
.venv\scripts\activate
```

---

You run all subsequent commands in this activated virtual environment. 

<br/>

---

## 3. Create a local function project

In this section, you create a local <abbr title="A logical container for one or more individual functions that can be deployed and managed together.">Azure Functions project</abbr> in Python. Each function in the project responds to a specific <abbr title="The type of event that invokes the function’s code, such as an HTTP request, a queue message, or a specific time.">trigger</abbr>.

1. Run the `func init` command to create a functions project in a folder named *LocalFunctionProj* with the specified runtime:  

    ```console
    func init LocalFunctionProj --python
    ```

1. Navigate into the project folder:

    ```console
    cd LocalFunctionProj
    ```
    
    <br/>
    <details>
    <summary><strong>What's created in the LocalFunctionProj folder?</strong></summary>
    
    This folder contains various files for the project, including configurations files named [local.settings.json](functions-run-local.md#local-settings-file) and [host.json](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.
    </details>

1. Add a function to your project by using the following command:

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ```   
    The `--name` argument is the unique name of your function (HttpExample).

    The `--template` argument specifies the function's trigger (HTTP).
    
    `func new` creates a subfolder matching the function name that contains an *\_\_init\_\_.py* file  with the function's code and a configuration file named *function.json*.

    <br/>    
    <details>
    <summary><strong>Code for __init__.py</strong></summary>
    
    *\_\_init\_\_.py* contains a `main()` Python function that's triggered according to the configuration in *function.json*.
    
    :::code language="python" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-Python/__init__.py":::
    
    For an HTTP trigger, the function receives request data in the variable `req` as defined in *function.json*. `req` is an instance of the [azure.functions.HttpRequest class](/python/api/azure-functions/azure.functions.httprequest). The return object, defined as `$return` in *function.json*, is an instance of [azure.functions.HttpResponse class](/python/api/azure-functions/azure.functions.httpresponse). To learn more, see [Azure Functions HTTP triggers and bindings](./functions-bindings-http-webhook.md?tabs=python).
    </details>

    <br/>
    <details>
    <summary><strong>Code for function.json</strong></summary>

    *function.json* is a configuration file that defines the <abbr title="Declarative connections between a function and other resources. An input binding provides data to the function; an output binding provides data from the function to other resources.">input and output bindings</abbr> for the function, including the trigger type.
    
    You can change `scriptFile` to invoke a different Python file if desired.
    
    :::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-Python/function.json":::
    
    Each binding requires a direction, a type, and a unique name. The HTTP trigger has an input binding of type [`httpTrigger`](functions-bindings-http-webhook-trigger.md) and output binding of type [`http`](functions-bindings-http-webhook-output.md).    
    </details>

<br/>

---

## 4. Run the function locally

1. Run your function by starting the local Azure Functions runtime host from the *LocalFunctionProj* folder:

    ```
    func start
    ```

    Toward the end of the output, the following lines should appear: 
    
    <pre class="is-monospace is-size-small has-padding-medium has-background-tertiary has-text-tertiary-invert">
    ...
    
    Now listening on: http://0.0.0.0:7071
    Application started. Press Ctrl+C to shut down.
    
    Http Functions:
    
            HttpExample: [GET,POST] http://localhost:7071/api/HttpExample
    ...
    
    </pre>
    
    <br/>
    <details>
    <summary><strong>I don't see HttpExample in the output</strong></summary>

    If HttpExample doesn't appear, you likely started the host from outside the root folder of the project. In that case, use <kbd>Ctrl+C</kbd> to stop the host, navigate to the project's root folder, and run the previous command again.
    </details>

1. Copy the URL of your **HttpExample** function from this output to a browser and append the query string **?name=<YOUR_NAME>**, making the full URL like **http://localhost:7071/api/HttpExample?name=Functions**. The browser should display a message like **Hello Functions**:

    ![Result of the function run locally in the browser](../../includes/media/functions-run-function-test-local-cli/function-test-local-browser.png)

1. The terminal in which you started your project also shows log output as you make requests.

1. When you're done, use <kbd>Ctrl+C</kbd> and choose <kbd>y</kbd> to stop the functions host.

<br/>

---

## 5. Create supporting Azure resources for your function

Before you can deploy your function code to Azure, you need to create a <abbr title="A logical container for related Azure resources that you can manage as a unit.">resource group</abbr>, a <abbr title="An account that contains all your Azure storage data objects. The storage account provides a unique namespace for your storage data.">storage account</abbr>, and a <abbr title="The cloud resource that hosts serverless functions in Azure, which provides the underlying compute environment in which functions run.">function app</abbr> by using the following commands:

1. If you haven't done so already, sign in to Azure:

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az login
    ```

    The [az login](/cli/azure/reference-index#az_login) command signs you into your Azure account.

    # [Azure PowerShell](#tab/azure-powershell) 
    ```azurepowershell
    Connect-AzAccount
    ```

    The [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet signs you into your Azure account.

    ---

1. Create a resource group named `AzureFunctionsQuickstart-rg` in the `westeurope` region. 

    # [Azure CLI](#tab/azure-cli)
    
    ```azurecli
    az group create --name AzureFunctionsQuickstart-rg --location westeurope
    ```
 
    The [az group create](/cli/azure/group#az_group_create) command creates a resource group. You generally create your resource group and resources in a <abbr title="A geographical reference to a specific Azure datacenter in which resources are allocated.">region</abbr> near you, using an available region returned from the `az account list-locations` command.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzResourceGroup -Name AzureFunctionsQuickstart-rg -Location westeurope
    ```

    The [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command creates a resource group. You generally create your resource group and resources in a region near you, using an available region returned from the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) cmdlet.

    ---

    You can't host Linux and Windows apps in the same resource group. If you have an existing resource group named `AzureFunctionsQuickstart-rg` with a Windows function app or web app, you must use a different resource group.

1. Create a general-purpose Azure Storage account in your resource group and region:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location westeurope --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS
    ```

    The [az storage account create](/cli/azure/storage/account#az_storage_account_create) command creates the storage account. 

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzStorageAccount -ResourceGroupName AzureFunctionsQuickstart-rg -Name <STORAGE_NAME> -SkuName Standard_LRS -Location westeurope
    ```

    The [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet creates the storage account.

    ---

    Replace `<STORAGE_NAME>` with a name that is appropriate to you and <abbr title="The name must be unique across all storage accounts used by all Azure customers globally. For example, you can use a combination of your personal or company name, application name, and a numeric identifier, as in contosobizappstorage20.">unique in Azure Storage</abbr>. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account, which is [supported by Functions](storage-considerations.md#storage-account-requirements).
    
    The storage account incurs only a few cents (USD) for this quickstart.

1. Create the function app in Azure:

    # [Azure CLI](#tab/azure-cli)
        
    ```azurecli
    az functionapp create --resource-group AzureFunctionsQuickstart-rg --consumption-plan-location westeurope --runtime python --runtime-version 3.8 --functions-version 3 --name <APP_NAME> --storage-account <STORAGE_NAME> --os-type linux
    ```
    
    The [az functionapp create](/cli/azure/functionapp#az_functionapp_create) command creates the function app in Azure. If you are using Python 3.7 or 3.6, change `--runtime-version` to `3.7` or `3.6`, respectively.
    
    # [Azure PowerShell](#tab/azure-powershell)
    
    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsQuickstart-rg -StorageAccount <STORAGE_NAME> -FunctionsVersion 3 -RuntimeVersion 3.8 -Runtime python -Location 'West Europe'
    ```
    
    The [New-AzFunctionApp](/powershell/module/az.functions/new-azfunctionapp) cmdlet creates the function app in Azure. If you're using Python 3.7 or 3.6, change `-RuntimeVersion` to `3.7` or `3.6`, respectively.

    ---
    
    Replace `<STORAGE_NAME>` with the name of the account you used in the previous step.

    Replace `<APP_NAME>` with a <abbr title="A name that must be unique across all Azure customers globally. For example, you can use a combination of your personal or organization name, application name, and a numeric identifier, as in contoso-bizapp-func-20.">globally unique name appropriate to you</abbr>. The `<APP_NAME>` is also the default DNS domain for the function app. 
    
    <br/>
    <details>
    <summary><strong>What is the cost of the resources provisioned on Azure?</strong></summary>

    This command creates a function app running in your specified language runtime under the [Azure Functions Consumption Plan](functions-scale.md#overview-of-plans), which is free for the amount of usage you incur here. The command also provisions an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.
    </details>

<br/>

---

## 6. Deploy the function project to Azure

After you've successfully created your function app in Azure, you're now ready to **deploy your local functions project** by using the [func azure functionapp publish](functions-run-local.md#project-file-deployment) command.  

In the following example, replace `<APP_NAME>` with the name of your app.

```console
func azure functionapp publish <APP_NAME>
```

The `publish` command shows results similar to the following output (truncated for simplicity):

<pre class="is-monospace is-size-small has-padding-medium has-background-tertiary has-text-tertiary-invert">
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
        Invoke url: https://msdocs-azurefunctions-qs.azurewebsites.net/api/httpexample
</pre>

<br/>

---

## 7. Invoke the function on Azure

Because your function uses an HTTP trigger, you invoke it by making an HTTP request to its URL in the browser or with a tool like <abbr title="A command line tool for generating HTTP requests to a URL; see https://curl.se/">curl</abbr>. 

# [Browser](#tab/browser)

Copy the complete **Invoke URL** shown in the output of the `publish` command into a browser address bar, appending the query parameter **&name=Functions**. The browser should display similar output as when you ran the function locally.

![The output of the function run on Azure in a browser](../../includes/media/functions-run-remote-azure-cli/function-test-cloud-browser.png)

# [curl](#tab/curl)

Run [`curl`](https://curl.haxx.se/) with the **Invoke URL**, appending the parameter **&name=Functions**. The output of the command should be the text, "Hello Functions."

![The output of the function run on Azure using curl](../../includes/media/functions-run-remote-azure-cli/function-test-cloud-curl.png)

---

### 7.1 View real-time streaming logs

Run the following command to view near real-time [streaming logs](functions-run-local.md#enable-streaming-logs) in Application Insights in the Azure portal:

```console
func azure functionapp logstream <APP_NAME> --browser
```

Replace `<APP_NAME>` with the name of your function app.

In a separate terminal window or in the browser, call the remote function again. A verbose log of the function execution in Azure is shown in the terminal. 

<br/>

---

## 8. Clean up resources

If you continue to the [next step](#next-steps) and add an <abbr title="A means to associate a function with a storage queue, so that it can create messages on the queue. ">Azure Storage queue output binding</abbr>, keep all your resources in place as you'll build on what you've already done.

Otherwise, use the following command to delete the resource group and all its contained resources to avoid incurring further costs.

 # [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name AzureFunctionsQuickstart-rg
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name AzureFunctionsQuickstart-rg
```

<br/>

---

## Next steps

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-python)

[Having issues? Let us know.](https://aka.ms/python-functions-qs-survey)
