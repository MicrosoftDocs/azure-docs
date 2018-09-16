---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: functions
ms.topic: include
ms.date: 05/22/2018
ms.author: glenga
ms.custom: include file
---

The Azure Functions project template in Visual Studio creates a project that can be published to a function app in Azure. A function app lets you group functions as a logical unit for management, deployment, and sharing of resources.

1. In Visual Studio, select **New** > **Project** from the **File** menu.

2. In the **New Project** dialog, select **Installed**, expand **Visual C#** > **Cloud**, select **Azure Functions**, type a **Name** for your project, and click **OK**. The function app name must be valid as a C# namespace, so don't use underscores, hyphens, or any other nonalphanumeric characters.

    ![New project dialog to create a function in Visual Studio](./media/functions-vstools-create/functions-vstools-add-new-project.png)

3. Use the settings specified in the table that follows the image.

    ![New function dialog in Visual Studio](./media/functions-vstools-create/functions-vstools-add-new-function.png) 

    | Setting      | Suggested value  | Description                      |
    | ------------ |  ------- |----------------------------------------- |
    | **Version** | Azure Functions v1 <br />(.NET Framework) | This creates a function project that uses the version 1 runtime of Azure Functions. The version 2 runtime, which supports .NET Core, is currently in preview. For more information, see [How to target Azure Functions runtime version](../articles/azure-functions/functions-versions.md).   |
    | **Template** | HTTP trigger | This creates a function triggered by an HTTP request. |
    | **Storage account**  | Storage Emulator | An HTTP trigger doesn't use the Storage account connection. All other trigger types require a valid Storage account connection string. |
    | **Access rights** | Anonymous | The created function can be triggered by any client without providing a key. This authorization setting makes it easy to test your new function. For more information about keys and authorization, see [Authorization keys](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys) in the [HTTP and webhook bindings](../articles/azure-functions/functions-bindings-http-webhook.md). |
4. Click **OK** to create the function project and HTTP triggered function.

