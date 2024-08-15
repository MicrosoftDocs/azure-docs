# Quickstart: Create a Python function in Azure with Azure Developer CLI

In this article, you use Azure Developer command-line tools to create a Python function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions. 

This article uses the Python v2 programming model for Azure Functions, which provides a decorator-based approach for creating functions. To learn more about the Python v2 programming model, see the [Developer Reference Guide](functions-reference-python.md?pivots=python-mode-decorators)

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [Visual Studio Code-based version](create-first-function-vs-code-python.md) of this article.

## Configure your local environment

Before you begin, you must have the following requirements in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ One of the following tools for creating Azure resources:

  + [Azure CLI](/cli/azure/install-azure-cli) version 2.4 or later.

  + The Azure [Az PowerShell module](/powershell/azure/install-azure-powershell) version 5.9.0 or later.

+ [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)

+ [A Python version supported by Azure Functions](supported-languages.md#languages-by-runtime-version).

+ The [Azurite storage emulator](../storage/common/storage-use-azurite.md?tabs=npm#install-azurite). While you can also use an actual Azure Storage account, the article assumes you're using this emulator.

## Install the Azure Functions Core Tools

* Embed from existing documentation

## Create and activate a virtual environment

In a suitable folder, run the following commands to create and activate a virtual environment named `.venv`. Make sure that you're using a [version of Python supported by Azure Functions](supported-languages.md?pivots=programming-language-python#languages-by-runtime-version).

* Embed from existing documentation

## Create a local function

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. 
 
In this section, you create a function project and add an HTTP triggered function.

1. Run the [`func init`](functions-core-tools-reference.md#func-init) command as follows to create a Python v2 functions project in the virtual environment.

    ```console
    func init --python
    ```

    The environment now contains various files for the project, including configuration files named [*local.settings.json*](functions-develop-local.md#local-settings-file) and [*host.json*](functions-host-json.md). Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function (HttpExample) and the `--template` argument specifies the function's trigger (HTTP).

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ```

    If prompted, choose the **ANONYMOUS** option. [`func new`](functions-core-tools-reference.md#func-new) adds an HTTP trigger endpoint named `HttpExample` to the `function_app.py` file, which is accessible without authentication. 

## Run the function locally

* Embed from existing documentation

## Install Azure Developer CLI

* Embed from existing documentation (https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)

## Deploy the Azure Function to Azure

To deploy the function to Azure, use the commands:

```
azd auth login
```

Run the azd up command. This will deploy your Function application and create additional resources for your app in Azure. By using the referenced bicep templates, your project will be secure by default.

```
azd up
```

Parameter	Description
* Azure Location: The Azure location where your resources will be deployed.
* Azure Subscription: The Azure Subscription where your resources will be deployed.

Select your desired values and press enter. The azd up command handles the following tasks for you using the template configuration and infrastructure files:

* Creates and configures all necessary Azure resources (azd provision), including:
* Access policies and roles for your account
* Service-to-service communication with Managed Identities
* Packages and deploys the code (azd deploy)

When the azd up command completes successfully, the CLI displays links to view resources created. You can call azd up as many times as you like to both provision and deploy updates to your application.

## Invoke the function on Azure

Because your function uses an HTTP trigger, you invoke it by making an HTTP request to its URL in the browser or with a tool like curl. 

* Embed from existing documentation

## Clean up resources

* Embed from existing documentation
