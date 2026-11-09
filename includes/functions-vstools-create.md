---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/30/2024
ms.author: glenga
---

The Azure Functions project template in Visual Studio creates a C# class library project that you can publish to a function app in Azure. You can use a function app to group functions as a logical unit for easier management, deployment, scaling, and sharing of resources.

1. From the Visual Studio menu, select **File** > **New** > **Project**.

1. In **Create a new project**, enter *functions* in the search box, choose the **Azure Functions** template, and then select **Next**.

1. In **Configure your new project**, enter a **Project name** for your project, and then select **Create**. The function app name must be valid as a C# namespace, so don't use underscores, hyphens, or any other nonalphanumeric characters.

1. For the **Create a new Azure Functions application** settings, use the values in the following table:

    # [Isolated worker model](#tab/isolated-process)

    | Setting      | Value  | Description                      |
    | ------------ |  ------- |----------------------------------------- |
    | **.NET version** | A supported .NET version using the isolated worker model | This value creates a function project that runs in an [isolated worker process](../articles/azure-functions/dotnet-isolated-process-guide.md). Update your tools and templates to support your target version. For version requirements and hosting restrictions, see [Supported versions](../articles/azure-functions/dotnet-isolated-process-guide.md#supported-versions). For project SDK and worker package requirements, see [Core SDK and package](../articles/azure-functions/dotnet-isolated-process-guide.md#core-sdk-and-package). |
    | **Function template** | **HTTP trigger** | This value creates a function triggered by an HTTP request. |
    | **Storage account (AzureWebJobsStorage)**  | **Storage emulator** | Because a function app in Azure requires a storage account, one is assigned or created when you publish your project to Azure. An HTTP trigger doesn't use an Azure Storage account connection string; all other trigger types require a valid Azure Storage account connection string.  |
    | **Authorization level** | **Anonymous** | The created function can be triggered by any client without providing a key. This authorization setting makes it easy to test your new function. For more information about keys and authorization, see [Authorization keys](../articles/azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys) and [HTTP and webhook bindings](../articles/azure-functions/functions-bindings-http-webhook.md). |
    
    ![Azure Functions project settings](./media/functions-vs-tools-create/functions-project-settings-v4-isolated.png)

    # [In-process model](#tab/in-process) 

    [!INCLUDE [functions-in-process-model-retirement-note](./functions-in-process-model-retirement-note.md)]

    | Setting      | Value  | Description                      |
    | ------------ |  ------- |----------------------------------------- |
    | **.NET version** | A supported .NET version using the in-process model | This value creates a function project that runs in-process with version 4.x of the Functions runtime. For this model's version requirements, see the [in-process model guide](../articles/azure-functions/functions-dotnet-class-library.md#supported-versions). |
    | **Function template** | **HTTP trigger** | This value creates a function triggered by an HTTP request. |
    | **Storage account (AzureWebJobsStorage)**  | **Storage emulator** | Because a function app in Azure requires a storage account, one is assigned or created when you publish your project to Azure. An HTTP trigger doesn't use an Azure Storage account connection string; all other trigger types require a valid Azure Storage account connection string.  |
    | **Authorization level** | **Anonymous** | The created function can be triggered by any client without providing a key. This authorization setting makes it easy to test your new function. For more information about keys and authorization, see [Authorization keys](../articles/azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys) and [HTTP and webhook bindings](../articles/azure-functions/functions-bindings-http-webhook.md). |
    
    ![Azure Functions project settings](./media/functions-vs-tools-create/functions-project-settings.png)

    ---

    Make sure you set the **Authorization level** to **Anonymous**. If you choose the default level of **Function**, you're required to present the [function key](../articles/azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys) in requests to access your function endpoint.

1. Select **Create** to create the function project and HTTP trigger function.
