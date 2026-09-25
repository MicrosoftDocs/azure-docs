---
title: Connect Azure Functions to Azure Storage using command line tools
description: Learn how to connect Azure Functions to an Azure Storage queue by adding an output binding to your command line project.
ms.date: 08/19/2026
ms.topic: quickstart
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, powershell, python, typescript
ms.custom: devx-track-python, mode-other, devx-track-extended-java, devx-track-js, devx-track-ts
zone_pivot_groups: programming-languages-set-functions
---

# Connect Azure Functions to Azure Storage using command line tools

In this article, you integrate an Azure Storage queue with the function and storage account you created in the previous quickstart article. Completing this article incurs no extra costs beyond the few USD cents of the previous quickstart.

::: zone pivot="programming-language-go"
Because the Go worker doesn't currently support output bindings, you use the Azure Queue Storage SDK for Go to write data from an HTTP request to a message in the queue.
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell"
You achieve this integration by using an *output binding* that writes data from an HTTP request to a message in the queue. To learn more about bindings, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).
::: zone-end

## Configure your local environment

::: zone pivot="programming-language-csharp"  
Before you begin, you must complete the article, [Quickstart: Create an Azure Functions project from the command line](how-to-create-function-azure-cli.md?pivots=programming-language-csharp). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end  
::: zone pivot="programming-language-javascript"  
Before you begin, you must complete the article, [Quickstart: Create an Azure Functions project from the command line](how-to-create-function-azure-cli.md?pivots=programming-language-javascript). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end   
::: zone pivot="programming-language-java"  
Before you begin, you must complete the article, [Quickstart: Create an Azure Functions project from the command line](how-to-create-function-azure-cli.md?pivots=programming-language-java). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end   
::: zone pivot="programming-language-typescript"  
Before you begin, you must complete the article, [Quickstart: Create an Azure Functions project from the command line](how-to-create-function-azure-cli.md?pivots=programming-language-typescript). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end   
::: zone pivot="programming-language-python"  
Before you begin, you must complete the article, [Quickstart: Create an Azure Functions project from the command line](how-to-create-function-azure-cli.md?pivots=programming-language-python). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end   
::: zone pivot="programming-language-powershell"  
Before you begin, you must complete the article, [Quickstart: Create an Azure Functions project from the command line](how-to-create-function-azure-cli.md?pivots=programming-language-powershell). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.  
::: zone-end   
::: zone pivot="programming-language-go"
Before you begin, complete the article, [Quickstart: Create an Azure Functions project from the command line](how-to-create-function-azure-cli.md?pivots=programming-language-go). If you already cleaned up resources at the end of that article, go through the steps again to recreate the function app and related resources in Azure.
::: zone-end

### Retrieve the Azure Storage connection string

>[!IMPORTANT]
>This article currently shows how to connect to your Azure Storage account by using the connection string, which contains a shared secret key. Using a connection string makes it easier for you to verify data updates in the storage account. For the best security, you should instead use managed identities when connecting to your storage account. For more information, see [Manage connections](./manage-connections.md?tabs=identity).

Earlier, you created an Azure Storage account for function app's use. The connection string for this account is stored securely in app settings in Azure. By downloading the setting into the *local.settings.json* file, you can use the connection to write to a Storage queue in the same account when running the function locally.

1. From the root of the project, run the following command, replacing `<APP_NAME>` with the name of your function app from the previous step. This command overwrites any existing values in the file.

    ```
    func azure functionapp fetch-app-settings <APP_NAME>
    ```

1. Open *local.settings.json* file and locate the value named `AzureWebJobsStorage`, which is the Storage account connection string. You use the name `AzureWebJobsStorage` and the connection string in other sections of this article.

> [!IMPORTANT]
> Because the *local.settings.json* file contains secrets downloaded from Azure, always exclude this file from source control. The *.gitignore* file created with a local functions project excludes the file by default.

::: zone pivot="programming-language-csharp"  
## Register binding extensions
::: zone-end 

[!INCLUDE [functions-register-storage-binding-extension-csharp](../../includes/functions-register-storage-binding-extension-csharp.md)]

[!INCLUDE [functions-add-output-binding-cli](../../includes/functions-add-output-binding-cli.md)]

::: zone pivot="programming-language-csharp"  
[!INCLUDE [functions-add-storage-binding-csharp-library](../../includes/functions-add-storage-binding-csharp-library.md)]  
::: zone-end  
::: zone pivot="programming-language-java" 
[!INCLUDE [functions-add-output-binding-java-cli](../../includes/functions-add-output-binding-java-cli.md)]
::: zone-end   

::: zone pivot="programming-language-go"
## Install the Azure Queue Storage SDK

From the root of your project, run the following command to install the current major version of the Azure Queue Storage SDK for Go:

```console
go get github.com/Azure/azure-sdk-for-go/sdk/storage/azqueue
```
::: zone-end

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell"
For more information on the details of bindings, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md) and [queue output configuration](functions-bindings-storage-queue-output.md#configuration).
::: zone-end

## Add code to use the output binding

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell"
With the queue binding defined, you can now update your function to receive the `msg` output parameter and write messages to the queue.
::: zone-end

::: zone pivot="programming-language-go"
Update your function to write messages directly to the queue by using the Azure Queue Storage SDK.
::: zone-end

::: zone pivot="programming-language-python"     
[!INCLUDE [functions-add-output-binding-python](../../includes/functions-add-storage-binding-python-v2.md)]
::: zone-end  

::: zone pivot="programming-language-javascript" 

[!INCLUDE [functions-add-output-binding-js](../../includes/functions-add-output-binding-js-v4.md)]
::: zone-end  

::: zone pivot="programming-language-typescript"  
[!INCLUDE [functions-add-output-binding-ts](../../includes/functions-add-output-binding-ts-v4.md)]
::: zone-end  

::: zone pivot="programming-language-powershell"  
[!INCLUDE [functions-add-output-binding-powershell](../../includes/functions-add-output-binding-powershell.md)]  
::: zone-end

::: zone pivot="programming-language-csharp"  
[!INCLUDE [functions-add-storage-binding-csharp-library-code](../../includes/functions-add-storage-binding-csharp-library-code.md)]
::: zone-end 

::: zone pivot="programming-language-java"
[!INCLUDE [functions-add-output-binding-java-code](../../includes/functions-add-output-binding-java-code.md)]

[!INCLUDE [functions-add-output-binding-java-test-cli](../../includes/functions-add-output-binding-java-test-cli.md)]
::: zone-end

::: zone pivot="programming-language-go"
Replace the contents of *main.go* with the following code. This implementation reads the `AzureWebJobsStorage` connection string, creates the `outqueue` queue if it doesn't exist, and writes a message by using the Azure Queue Storage SDK:

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "os"

    "github.com/Azure/azure-sdk-for-go/sdk/storage/azqueue"
    "github.com/azure/azure-functions-golang-worker/sdk"
    "github.com/azure/azure-functions-golang-worker/worker"
)

func HTTPTriggerHandler(w http.ResponseWriter, r *http.Request) {
    name := r.URL.Query().Get("name")
    if name == "" {
        var body struct{ Name string }
        if err := json.NewDecoder(r.Body).Decode(&body); err == nil {
            name = body.Name
        }
    }
    if name == "" {
        http.Error(w, "Pass a name in the query string or request body.", http.StatusBadRequest)
        return
    }

    queueClient, err := azqueue.NewQueueClientFromConnectionString(
        os.Getenv("AzureWebJobsStorage"),
        "outqueue",
        nil,
    )
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    if _, err := queueClient.Create(r.Context(), nil); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    message := "Name passed to the function: " + name
    if _, err := queueClient.EnqueueMessage(r.Context(), message, nil); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    fmt.Fprintf(w, "Hello, %s!", name)
}

func main() {
    app := sdk.FunctionApp()
    app.HTTP("HttpExample", HTTPTriggerHandler,
        sdk.WithMethods("GET", "POST"),
        sdk.WithAuth("anonymous"),
    )
    worker.Start(app)
}
```
::: zone-end

::: zone pivot="programming-language-csharp,programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell"
Observe that you *don't* need to write any code for authentication, obtain a queue reference, or write data. All these integration tasks are conveniently handled in the Azure Functions runtime and queue output binding.
::: zone-end

[!INCLUDE [functions-run-function-test-local-cli](../../includes/functions-run-function-test-local-cli.md)]

## View the message in the Azure Storage queue

[!INCLUDE [functions-add-output-binding-view-queue-cli](../../includes/functions-add-output-binding-view-queue-cli.md)]

## Redeploy the project to Azure

After you verify locally that the function wrote a message to the Azure Storage queue, you can redeploy your project to update the endpoint running on Azure.

::: zone pivot="programming-language-go,programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell,programming-language-csharp"
From the root folder of your local project, use the [`func azure functionapp publish`](functions-run-local.md#project-file-deployment) command to redeploy the project. Replace `<APP_NAME>` with the name of your app.

```
func azure functionapp publish <APP_NAME>
```
::: zone-end  

::: zone pivot="programming-language-java" 

In the local project folder, use the following Maven command to republish your project:
```
mvn azure-functions:deploy
```
::: zone-end

## Verify in Azure

1. As in the previous quickstart, use a browser or CURL to test the redeployed function.

    # [Browser](#tab/browser)
    
    Copy the complete **Invoke URL** shown in the output of the publish command into a browser address bar, appending the query parameter `&name=Functions`. The browser should display the same output as when you ran the function locally.

    # [curl](#tab/curl)
    
    Run [`curl`](https://curl.haxx.se/) with the **Invoke URL**, appending the parameter `&name=Functions`. The output should be the same as when you ran the function locally.

    --- 

1. Examine the Storage queue again, as described in the previous section, to verify that it contains the new message written to the queue.

## Clean up resources

After you finish, use the following command to delete the resource group and all its contained resources to avoid incurring further costs.

```azurecli
az group delete --name AzureFunctionsQuickstart-rg
```

## Next steps

You've updated your HTTP triggered function to write data to a Storage queue. Now you can learn more about developing Functions from the command line using Core Tools and Azure CLI:

+ [Work with Azure Functions Core Tools](functions-run-local.md)  

+ [Azure Functions triggers and bindings](functions-triggers-bindings.md)

::: zone pivot="programming-language-csharp"  
+ [Examples of complete Function projects in C#](/samples/browse/?products=azure-functions&languages=csharp).

+ [Azure Functions C# developer reference](functions-dotnet-class-library.md)  

[previous-quickstart]: how-to-create-function-azure-cli.md?pivots=programming-language-csharp

::: zone-end 
::: zone pivot="programming-language-javascript"  
+ [Examples of complete Function projects in JavaScript](/samples/browse/?products=azure-functions&languages=javascript).

+ [Azure Functions JavaScript developer guide](functions-reference-node.md?tabs=javascript)  

[previous-quickstart]: how-to-create-function-azure-cli.md?pivots=programming-language-javascript
::: zone-end  
::: zone pivot="programming-language-typescript"  
+ [Examples of complete Function projects in TypeScript](/samples/browse/?products=azure-functions&languages=typescript).

+ [Azure Functions TypeScript developer guide](functions-reference-node.md?tabs=typescript)  

[previous-quickstart]: how-to-create-function-azure-cli.md?pivots=programming-language-typescript
::: zone-end  
::: zone pivot="programming-language-python"  
+ [Examples of complete Function projects in Python](/samples/browse/?products=azure-functions&languages=python).

+ [Azure Functions Python developer guide](functions-reference-python.md)  

[previous-quickstart]: how-to-create-function-azure-cli.md?pivots=programming-language-python
::: zone-end  
::: zone pivot="programming-language-powershell"  
+ [Examples of complete Function projects in PowerShell](/samples/browse/?products=azure-functions&languages=azurepowershell).

+ [Azure Functions PowerShell developer guide](functions-reference-powershell.md) 

[previous-quickstart]: how-to-create-function-azure-cli.md?pivots=programming-language-powershell
::: zone-end
::: zone pivot="programming-language-go"
+ [Azure Functions Go developer reference](functions-reference-go.md)

+ [Azure Queue Storage SDK for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azqueue)

[previous-quickstart]: how-to-create-function-azure-cli.md?pivots=programming-language-go
::: zone-end
