---
title: "Quickstart: Create a Go function in Azure from the command line"
description: Create a Go function from the command line, then package and deploy the local project to serverless hosting in Azure Functions.
ms.topic: quickstart
ms.date: 05/05/2026
ms.devlang: golang
ms.custom:
  - devx-track-go
#customer intent: As a Go developer, I want to create a Go function app from the command line so that I can build and deploy serverless apps in Azure.
---

# Quickstart: Create a Go function in Azure from the command line

[!INCLUDE [functions-language-selector-quickstart-cli](../../includes/functions-language-selector-quickstart-cli.md)]

In this article, you use command-line tools to create a Go function that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

> [!IMPORTANT]
> Go support for Azure Functions is currently in public preview.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

+ [Go 1.24](https://go.dev/dl/) or later.

+ [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 4.x from a release that includes Go support.

+ The [Azure CLI](/cli/azure/install-azure-cli) version 2.60.0 or later.

## Create a local function project

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations.

1. Run the `func init` command to create a Go functions project:

    ```console
    func init MyGoFunctionApp --worker-runtime go
    ```

    This command creates a project folder named `MyGoFunctionApp` that includes the following files:

    | File | Description |
    | --- | --- |
    | `host.json` | Host configuration for the function app. |
    | `local.settings.json` | Settings used when running locally. |
    | `main.go` | Entry point with a sample HTTP-triggered function. |
    | `go.mod` | Go module file for dependency management. |
    | `go.sum` | Go module checksum file. |

1. Navigate to the project folder:

    ```console
    cd MyGoFunctionApp
    ```

1. Open `main.go` to review the generated code. It contains a sample HTTP-triggered function:

    ```go
    package main

    import (
        "log"
        "net/http"

        "github.com/azure/azure-functions-golang-worker/sdk"
        "github.com/azure/azure-functions-golang-worker/worker"
    )

    // HTTPTriggerHandler handles standard HTTP requests
    func HTTPTriggerHandler(w http.ResponseWriter, r *http.Request) {
        log.Printf("Processing HTTP Trigger for %s", r.URL.Path)
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("Hello from Go Worker!"))
    }

    func main() {
        app := sdk.FunctionApp()
        app.HTTP("hello", HTTPTriggerHandler,
            sdk.WithMethods("GET", "POST"),
            sdk.WithAuth("anonymous"),
        )
        worker.Start(app)
    }
    ```

    Go functions use the standard `net/http` types (`http.ResponseWriter` and `*http.Request`) for HTTP triggers, making the experience feel native to Go developers. Functions are registered in `main()` by using the Go worker SDK and functional options, and no `function.json` files are needed.

## Run the function locally

1. Start the function app locally:

    ```console
    func start
    ```

    Core Tools automatically compile your Go application before starting the local Azure Functions host. Toward the end of the output, the HTTP endpoint for your function is displayed:

    ```output
    Functions:

        hello: [GET,POST] http://localhost:7071/api/hello
    ```

1. With the function running locally, open a browser and navigate to the following URL:

    ```
    http://localhost:7071/api/hello
    ```

    You should see the following response:

    ```
    Hello from Go Worker!
    ```

1. Press **Ctrl+C** to stop the function app.

## Create supporting Azure resources

Before you can deploy your function code to Azure, you need to create three resources:

+ A [resource group](../azure-resource-manager/management/overview.md), which is a logical container for related resources.
+ A [storage account](../storage/common/storage-account-create.md), which is used to maintain state and other information about your functions.
+ A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

Use the following commands to create these items.

1. Sign in to Azure:

    ```azurecli
    az login
    ```

1. Use the `az functionapp list-flexconsumption-locations` command to review the list of regions that currently support the Flex Consumption plan:

    ```azurecli
    az functionapp list-flexconsumption-locations --query "sort_by(@, &name)[].{Region:name}" -o table
    ```

1. Create a resource group in a region that supports the Flex Consumption plan:

    ```azurecli
    az group create --name MyResourceGroup --location eastus2
    ```

1. Create a general-purpose storage account in the resource group:

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location eastus2 --resource-group MyResourceGroup --sku Standard_LRS --allow-blob-public-access false
    ```

    Replace `<STORAGE_NAME>` with a globally unique name. Names must contain 3 to 24 characters and only lowercase letters and numbers.

1. Create the function app in Azure:

    ```azurecli
    az functionapp create --resource-group MyResourceGroup --name <APP_NAME> --storage-account <STORAGE_NAME> --flexconsumption-location eastus2 --runtime go --runtime-version 1.0 --functions-version 4
    ```

    Replace `<APP_NAME>` with a globally unique name and `<STORAGE_NAME>` with the account name you used in the previous step. This command also creates an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md).

1. Disable HTTP/2 on the function app, which is required during the Go public preview:

    ```azurecli
    az resource update --resource-group MyResourceGroup --resource-type Microsoft.Web/sites --name <APP_NAME> --set properties.siteConfig.http20Enabled=false
    ```

## Deploy the function project to Azure

After you successfully create your function app in Azure, you're ready to deploy your local functions project. Use the [`func azure functionapp publish`](functions-core-tools-reference.md#func-azure-functionapp-publish) command to deploy your project to Azure:

```console
func azure functionapp publish <APP_NAME>
```

Replace `<APP_NAME>` with the name of your function app.

After deployment completes, open the following URL in a browser to verify that the function runs in Azure:

```
https://<APP_NAME>.azurewebsites.net/api/hello
```

## Clean up resources

If you continue to the [next step](#next-steps), keep all resources in place as you build on what you already created.

Otherwise, use the following command to delete the resource group and all its contained resources to avoid incurring further costs.

```azurecli
az group delete --name MyResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Go developer reference guide](functions-reference-go.md)

For more information about developing Go functions, see the following resources:

+ [Azure Functions Go developer reference](functions-reference-go.md)
+ [Azure Functions Go worker samples](https://github.com/Azure/azure-functions-golang-worker/tree/main/samples)
+ [Azure Functions triggers and bindings](functions-triggers-bindings.md)
