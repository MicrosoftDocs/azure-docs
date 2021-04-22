---
title: Develop and publish .NET 5 functions using Azure Functions  
description: Learn how to create and debug C# functions using .NET 5.0, then deploy the local project to serverless hosting in Azure Functions.
ms.date: 03/03/2021
ms.topic: how-to
#Customer intent: As a developer, I need to know how to create functions that run in an isolated process so that I can run my function code on current (not LTS) releases of .NET.
zone_pivot_groups: development-environment-functions
---

# Develop and publish .NET 5 functions using Azure Functions 

This article shows you how to work with C# functions using .NET 5.0, which run out-of-process from the Azure Functions runtime. You'll learn how to create, debug locally, and publish these .NET isolated process functions to Azure. In Azure, these functions run in an isolated process that supports .NET 5.0. To learn more, see [Guide for running functions on .NET 5.0 in Azure](dotnet-isolated-process-guide.md).

If you don't need to support .NET 5.0 or run your functions out-of-process, you might want to instead [create a C# class library function](functions-create-your-first-function-visual-studio.md).

>[!NOTE]
>Developing .NET isolated process functions in the Azure portal isn't currently supported. You must use either the Azure CLI or Visual Studio Code publishing to create a function app in Azure that supports running .NET 5.0 apps out-of-process.   

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ [.NET 5.0 SDK](https://dotnet.microsoft.com/download)

+ [Azure Functions Core Tools](functions-run-local.md#v2) version 3.0.3381, or a later version.

+ [Azure CLI](/cli/azure/install-azure-cli) version 2.20, or a later version.  
::: zone pivot="development-environment-vscode"
+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).  

+ The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.  

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code, version 1.3.0 or newer.
::: zone-end
::: zone pivot="development-environment-vs"
+ [Visual Studio 2019](https://azure.microsoft.com/downloads/), including the **Azure development** workload.  
.NET isolated function project templates and publishing aren't currently available in Visual Studio.
::: zone-end

## Create a local function project

In Azure Functions, a function project is a container for one or more individual functions that each responds to a specific trigger. All functions in a project share the same local and hosting configurations. In this section, you create a function project that contains a single function.

::: zone pivot="development-environment-vs"

>[!NOTE]  
> At this time, there are no Visual Studio project templates that support creating .NET isolated function projects. This article shows you how to use Core Tools to create your C# project, which you can then run locally and debug in Visual Studio.  

::: zone-end

::: zone pivot="development-environment-vscode"  
1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, select the **Create new project...** icon.

    ![Choose Create a new project](./media/functions-create-first-function-vs-code/create-new-project.png)

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Provide the following information at the prompts:

    + **Select a language for your function project**: Choose `C#`.

    + **Select a .NET runtime**: Choose `.NET 5 isolated`.

    + **Select a template for your project's first function**: Choose `HTTP trigger`.

    + **Provide a function name**: Type `HttpExample`.

    + **Provide a namespace**: Type `My.Functions`.

    + **Authorization level**: Choose `Anonymous`, which enables anyone to call your function endpoint. To learn about authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).

    + **Select how you would like to open your project**: Choose `Add to workspace`.

1. Using this information, Visual Studio Code generates an Azure Functions project with an HTTP trigger. You can view the local project files in the Explorer. To learn more about files that are created, see [Generated project files](functions-develop-vs-code.md#generated-project-files).
::: zone-end  
::: zone pivot="development-environment-cli,development-environment-vs"  

1. Run the `func init` command, as follows, to create a functions project in a folder named *LocalFunctionProj*:  

    ```console
    func init LocalFunctionProj --worker-runtime dotnetisolated
    ```
    
    Specifying `dotnetisolated` creates a project that runs on .NET 5.0.


1. Navigate into the project folder:

    ```console
    cd LocalFunctionProj
    ```

    This folder contains various files for the project, including the [local.settings.json](functions-run-local.md#local-settings-file) and [host.json](functions-host-json.md) configurations files. Because *local.settings.json* can contain secrets downloaded from Azure, the file is excluded from source control by default in the *.gitignore* file.

1. Add a function to your project by using the following command, where the `--name` argument is the unique name of your function (HttpExample) and the `--template` argument specifies the function's trigger (HTTP).

    ```console
    func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous"
    ``` 

    `func new` creates an HttpExample.cs code file.
::: zone-end  

::: zone pivot="development-environment-vscode"  

[!INCLUDE [functions-run-function-test-local-vs-code](../../includes/functions-run-function-test-local-vs-code.md)]

::: zone-end  
::: zone pivot="development-environment-cli" 

[!INCLUDE [functions-run-function-test-local-cli](../../includes/functions-run-function-test-local-cli.md)]

::: zone-end

::: zone pivot="development-environment-vs"

## Run the function locally

At this point, you can run the `func start` command from the root of your project folder to compile and run the C# isolated functions project. Currently, if you want to debug your out-of-process function code in Visual Studio, you need to manually attach a debugger to the running Functions runtime process by using the following steps:  

1. Open the project file (.csproj) in Visual Studio. You can review and modify your project code and set any desired break points in the code. 

1. From the root project folder, use the following command from the terminal or a command prompt to start the runtime host:

    ```console
    func start --dotnet-isolated-debug
    ```

    The `--dotnet-isolated-debug` option tells the process to wait for a debugger to attach before continuing. Towards the end of the output, you should see something like the following lines: 
    
    <pre>
    ...
    
    Functions:

        HttpExample: [GET,POST] http://localhost:7071/api/HttpExample

    For detailed output, run func with --verbose flag.
    [2021-03-09T08:41:41.904Z] Azure Functions .NET Worker (PID: 81720) initialized in debug mode. Waiting for debugger to attach...
    ...
    
    </pre> 

    The `PID: XXXXXX` indicates the process ID (PID) of the dotnet.exe process that is the running Functions host.
 
1. In the Azure Functions runtime output, make a note of the process ID of the host process, to which you'll attach a debugger. Also note the URL of your local function.

1. From the **Debug** menu in Visual Studio, select **Attach to Process...**, locate the process that matches the process ID, and select **Attach**. 
    
    :::image type="content" source="media/dotnet-isolated-process-developer-howtos/attach-to-process.png" alt-text="Attach the debugger to the Functions host process":::    

    With the debugger attached you can debug your function code as normal.

1. Into your browser's address bar, type your local function URL, which looks like the following, and run the request. 

    `http://localhost:7071/api/HttpExample`

    You should see trace output from the request written to the running terminal. Code execution stops at any break points you set in your function code.

1. When you're done, go to the terminal and press Ctrl + C to stop the host process.
 
After you've verified that the function runs correctly on your local computer, it's time to publish the project to Azure.

> [!NOTE]  
> Visual Studio publishing isn't currently available for .NET isolated process apps. After you've finished developing your project in Visual Studio, you must use the Azure CLI to create the remote Azure resources. Then, you can again use Azure Functions Core Tools from the command line to publish your project to Azure.
::: zone-end

::: zone pivot="development-environment-cli,development-environment-vs" 
## Create supporting Azure resources for your function

Before you can deploy your function code to Azure, you need to create three resources:

- A [resource group](../azure-resource-manager/management/overview.md), which is a logical container for related resources.
- A [Storage account](../storage/common/storage-account-create.md), which is used to maintain state and other information about your functions.
- A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

Use the following commands to create these items.

1. If you haven't done so already, sign in to Azure:

    ```azurecli
    az login
    ```

    The [az login](/cli/azure/reference-index#az_login) command signs you into your Azure account.

1. Create a resource group named `AzureFunctionsQuickstart-rg` in the `westeurope` region:

    ```azurecli
    az group create --name AzureFunctionsQuickstart-rg --location westeurope
    ```
 
    The [az group create](/cli/azure/group#az_group_create) command creates a resource group. You generally create your resource group and resources in a region near you, using an available region returned from the `az account list-locations` command.

1. Create a general-purpose storage account in your resource group and region:

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location westeurope --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS
    ```

    The [az storage account create](/cli/azure/storage/account#az_storage_account_create) command creates the storage account. 

    In the previous example, replace `<STORAGE_NAME>` with a name that is appropriate to you and unique in Azure Storage. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account, which is [supported by Functions](storage-considerations.md#storage-account-requirements).

1. Create the function app in Azure:
   
    ```azurecli
    az functionapp create --resource-group AzureFunctionsQuickstart-rg --consumption-plan-location westeurope --runtime dotnet-isolated --runtime-version 5.0 --functions-version 3 --name <APP_NAME> --storage-account <STORAGE_NAME>
    ```

    The [az functionapp create](/cli/azure/functionapp#az_functionapp_create) command creates the function app in Azure. 
    
    In the previous example, replace `<STORAGE_NAME>` with the name of the account you used in the previous step, and replace `<APP_NAME>` with a globally unique name appropriate to you. The `<APP_NAME>` is also the default DNS domain for the function app. 
    
    This command creates a function app running .NET 5.0 under the [Azure Functions Consumption Plan](consumption-plan.md). This plan should be free for the amount of usage you incur in this article. The command also provisions an associated Azure Application Insights instance in the same resource group. Use this instance to monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.

[!INCLUDE [functions-publish-project-cli](../../includes/functions-publish-project-cli.md)]

::: zone-end

::: zone pivot="development-environment-vscode"

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

## Publish the project to Azure

In this section, you create a function app and related resources in your Azure subscription and then deploy your code.

> [!IMPORTANT]
> Publishing to an existing function app overwrites the content of that app in Azure.


1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app...** button.

    ![Publish your project to Azure](../../includes/media/functions-publish-project-vscode/function-app-publish-project.png)

1. Provide the following information at the prompts:

    - **Select folder**: Choose a folder from your workspace or browse to one that contains your function app. You won't see this prompt when you already have a valid function app opened.

    - **Select subscription**: Choose the subscription to use. You won't see this prompt when you only have one subscription.

    - **Select Function App in Azure**: Choose `- Create new Function App`. (Don't choose the `Advanced` option, which isn't covered in this article.)
      
    - **Enter a globally unique name for the function app**: Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions.
    
    - **Select a runtime stack**: Choose `.NET 5 (non-LTS)`. 
    
    - **Select a location for new resources**:  For better performance, choose a [region](https://azure.microsoft.com/regions/) near you. 
    
    In the notification area, you see the status of individual resources as they're created in Azure.

    :::image type="content" source="../../includes/media/functions-publish-project-vscode/resource-notification.png" alt-text="Notification of Azure resource creation":::
    
1.  When completed, the following Azure resources are created in your subscription, using names based on your function app name:
    
    [!INCLUDE [functions-vs-code-created-resources](../../includes/functions-vs-code-created-resources.md)]

    A notification is displayed after your function app is created and the deployment package is applied. 

    [!INCLUDE [functions-vs-code-create-tip](../../includes/functions-vs-code-create-tip.md)]

4. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you created. If you miss the notification, select the bell icon in the lower right corner to see it again.

    ![Create complete notification](../../includes/media/functions-publish-project-vscode/function-create-notifications.png)

::: zone-end

::: zone pivot="development-environment-cli"  
[!INCLUDE [functions-run-remote-azure-cli](../../includes/functions-run-remote-azure-cli.md)]  
::: zone-end  

::: zone pivot="development-environment-vscode"  
[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]  
::: zone-end  

## Clean up resources

You created resources to complete this article. You may be billed for these resources, depending on your [account status](https://azure.microsoft.com/account/) and [service pricing](https://azure.microsoft.com/pricing/). 

::: zone pivot="development-environment-cli"  
Use the following command to delete the resource group and all its contained resources to avoid incurring further costs.

```azurecli
az group delete --name AzureFunctionsQuickstart-rg
```
::: zone-end  

::: zone pivot="development-environment-vscode"  
Use the following steps to delete the function app and its related resources to avoid incurring any further costs.

[!INCLUDE [functions-cleanup-resources-vs-code-inner.md](../../includes/functions-cleanup-resources-vs-code-inner.md)]  
::: zone-end  
::: zone pivot="development-environment-vs"   
Use the following steps to delete the function app and its related resources to avoid incurring any further costs.

1. In the Cloud Explorer, expand your subscription > **App Services**, right-click your function app, and choose **Open in Portal**. 

1. In the function app page, select the **Overview** tab and then select the link under **Resource group**.

   :::image type="content" source="media/functions-create-your-first-function-visual-studio/functions-app-delete-resource-group.png" alt-text="Select the resource group to delete from the function app page":::

2. In the **Resource group** page, review the list of included resources, and verify that they're the ones you want to delete.
 
3. Select **Delete resource group**, and follow the instructions.

   Deletion may take a couple of minutes. When it's done, a notification appears for a few seconds. You can also select the bell icon at the top of the page to view the notification.
::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Learn more about .NET isolated functions](dotnet-isolated-process-guide.md)

