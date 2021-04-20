---
title: Create a C# function from the command line - Azure Functions
description: Learn how to create a C# function from the command line, then publish the local project to serverless hosting in Azure Functions.
ms.date: 10/03/2020
ms.topic: quickstart
ms.custom: [devx-track-csharp, devx-track-azurecli]
ROBOTS: NOINDEX,NOFOLLOW
---

# Quickstart: Create a C# function in Azure from the command line

> [!div class="op_single_selector" title1="Select your function language: "]
> - [C#](create-first-function-cli-csharp-ieux.md)
> - [Java](create-first-function-cli-java.md)
> - [JavaScript](create-first-function-cli-node.md)
> - [PowerShell](create-first-function-cli-powershell.md)
> - [Python](create-first-function-cli-python.md)
> - [TypeScript](create-first-function-cli-typescript.md)

In this article, you use command-line tools to create a C# class library-based function that responds to HTTP requests. After testing the code locally, you deploy it to the <abbr title="A runtime computing environment in which all the details of the server are transparent to application developers, which simplifies the process of deploying and managing code.">serverless</abbr> environment of <abbr title="Azure's service that provides a low-cost serverless computing environment for applications.">Azure Functions</abbr>.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There is also a [Visual Studio Code-based version](create-first-function-vs-code-csharp.md) of this article.

## 1. Prepare your environment

+ Get an Azure <abbr title="The profile that maintains billing information for Azure usage.">account</abbr> with an active <abbr title="The basic organizational structure in which you manage resources on Azure, typically associated with an individual or department within an organization.">subscription</abbr>. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ Install [.NET Core SDK 3.1](https://www.microsoft.com/net/download)

+ Install [Azure Functions Core Tools](functions-run-local.md#v2) version 3.x.

+ Either the <abbr title="A set of cross-platform command line tools for working with Azure resources from your local development computer, as an alternative to using the Azure portal.">Azure CLI</abbr> or <abbr title="A PowerShell module that provides commands for working with Azure resources from your local development computer, as an alternative to using the Azure portal.">Azure PowerShell</abbr> for creating Azure resources:

    + [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

    + [Azure PowerShell](/powershell/azure/install-az-ps) version 5.0 or later.

---

### 2. Verify prerequisites

Verify your prerequisites, which depend on whether you are using the Azure CLI or Azure PowerShell for creating Azure resources:

# [Azure CLI](#tab/azure-cli)

+ In a terminal or command window, run `func --version` to check that the <abbr title="The set of command line tools for working with Azure Functions on your local computer.">Azure Functions Core Tools</abbr> are version 3.x.

+ **Run** `az --version` to check that the Azure CLI version is 2.4 or later.

+ **Run** `az login` to sign in to Azure and verify an active subscription.

+ **Run** `dotnet --list-sdks` to check that .NET Core SDK version 3.1.x is installed

# [Azure PowerShell](#tab/azure-powershell)

+**Run** `func --version` to check that the Azure Functions Core Tools are version 3.x.

+ **Run** `(Get-Module -ListAvailable Az).Version` and verify version 5.0 or later. 

+ **Run** `Connect-AzAccount` to sign in to Azure and verify an active subscription.

+ **Run** `dotnet --list-sdks` to check that .NET Core SDK version 3.1.x is installed

---

## 3. Create a local function project

In this section, you create a local <abbr title="A logical container for one or more individual functions that can be deployed and managed together.">Azure Functions project</abbr> in C#. Each function in the project responds to a specific <abbr title="An event that invokes the function’s code, such as an HTTP request, a queue message, or a specific time.">trigger</abbr>.

1. Run the `func init` command to create a functions project in a folder named *LocalFunctionProj* with the specified runtime:  

    ```csharp
    func init LocalFunctionProj --dotnet
    ```

1. **Run** 'cd LocalFunctionProj'  to navigate to the <abbr title="This folder contains various files for the project, including configurations files named local.settings.json and host.json. Because local.settings.json can contain secrets downloaded from Azure, the file is excluded from source control by default in the .gitignore file.">project folder</abbr>.

    ```console
    cd LocalFunctionProj
    ```
    <br/>

1. Add a function to your project by using the following command:
    
    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ``` 
    The `--name` argument is the unique name of your function (HttpExample).

    The `--template` argument specifies the function's trigger (HTTP).

    
    <br/>   
    <details>  
    <summary><strong>Optional: Code for HttpExample.cs</strong></summary>  
    
    *HttpExample.cs* contains a `Run` method that receives request data in the `req` variable is an [HttpRequest](/dotnet/api/microsoft.aspnetcore.http.httprequest) that's decorated with the **HttpTriggerAttribute**, which defines the trigger behavior.

    :::code language="csharp" source="~/functions-docs-csharp/http-trigger-template/HttpExample.cs":::
        
    The return object is an [ActionResult](/dotnet/api/microsoft.aspnetcore.mvc.actionresult) that returns a response message as either an [OkObjectResult](/dotnet/api/microsoft.aspnetcore.mvc.okobjectresult) (200) or a [BadRequestObjectResult](/dotnet/api/microsoft.aspnetcore.mvc.badrequestobjectresult) (400). To learn more, see [Azure Functions HTTP triggers and bindings](./functions-bindings-http-webhook.md?tabs=csharp).  
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


1. Select  <kbd>Ctrl+C</kbd> and choose <kbd>y</kbd> to stop the functions host.

<br/>

---
    
## 5. Create supporting Azure resources for your function

Before you can deploy your function code to Azure, you need to create a <abbr title="A logical container for related Azure resources that you can manage as a unit.">resource group</abbr>, a <abbr title="An account that contains all your Azure storage data objects. The storage account provides a unique namespace for your storage data.">storage account</abbr>, and a <abbr title="The cloud resource that hosts serverless functions in Azure, which provides the underlying compute environment in which functions run.">function app</abbr> by using the following commands:

1. If you haven't done so already, sign in to Azure:

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az login
    ```


    # [Azure PowerShell](#tab/azure-powershell) 
    ```azurepowershell
    Connect-AzAccount
    ```


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


    ---

    You can't host Linux and Windows apps in the same resource group. If you have an existing resource group named `AzureFunctionsQuickstart-rg` with a Windows function app or web app, you must use a different resource group.
    
1. Create a general-purpose Azure Storage account in your resource group and region:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location westeurope --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS
    ```


    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzStorageAccount -ResourceGroupName AzureFunctionsQuickstart-rg -Name <STORAGE_NAME> -SkuName Standard_LRS -Location westeurope
    ```


    ---

    Replace `<STORAGE_NAME>` with a name that is appropriate to you and <abbr title="The name must be unique across all storage accounts used by all Azure customers globally. For example, you can use a combination of your personal or company name, application name, and a numeric identifier, as in contosobizappstorage20">unique in Azure Storage</abbr>. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account, which is [supported by Functions](storage-considerations.md#storage-account-requirements).


1. Create the function app in Azure.
**Replace** '<STORAGE_NAME>** with name  in previous step.
**Replace** '<APP_NAME>' with a globally unique name.

    # [Azure CLI](#tab/azure-cli)
        
    ```azurecli
    az functionapp create --resource-group AzureFunctionsQuickstart-rg --consumption-plan-location westeurope --runtime dotnet --functions-version 3 --name <APP_NAME> --storage-account <STORAGE_NAME>
    ```
    
    
    # [Azure PowerShell](#tab/azure-powershell)
    
    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsQuickstart-rg -StorageAccount <STORAGE_NAME> -Runtime dotnet -FunctionsVersion 3 -Location 'West Europe'
    ```
    
    
    ---
    
    Replace `<STORAGE_NAME>` with the name of the account you used in the previous step.

    Replace `<APP_NAME>` with a <abbr title="A name that must be unique across all Azure customers globally. For example, you can use a combination of your personal or organization name, application name, and a numeric identifier, as in contoso-bizapp-func-20.">unique name</abbr>. The `<APP_NAME>` is also the default DNS domain for the function app. 

    <br/>
    <details>
    <summary><strong>What is the cost of the resources provisioned on Azure?</strong></summary>

    This command creates a function app running in your specified language runtime under the [Azure Functions Consumption plan](consumption-plan.md), which is free for the amount of usage you incur here. The command also provisions an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.
    </details>

<br/>

---

## 6. Deploy the function project to Azure


**Copy** ' func azure funtionapp publish <APP_NAME> into your terminal
**Replace** `<APP_NAME>` with the name of your app.
**Run**

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

Copy the complete **Invoke URL** shown in the output of the `publish` command into a browser address bar. **Append** the query parameter **&name=Functions**. 

![The output of the function run on Azure in a browser](../../includes/media/functions-run-remote-azure-cli/function-test-cloud-browser.png)

<br/>

---

## 8. Clean up resources

If you continue to the [next step](#next-steps) and add an Azure Storage queue output <abbr title="A declarative connection between a function and other resources. An input binding provides data to the function; an output binding provides data from the function to other resources.">binding</abbr>, keep all your resources in place as you'll build on what you've already done.

Otherwise, use the following command to delete the resource group and all its contained resources to avoid incurring further costs.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name AzureFunctionsQuickstart-rg
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name AzureFunctionsQuickstart-rg
```

---

<br/>

---

## Next steps

> [!div class="nextstepaction"]
> [Connect to an Azure Storage queue](functions-add-output-binding-storage-queue-cli.md?pivots=programming-language-csharp)
