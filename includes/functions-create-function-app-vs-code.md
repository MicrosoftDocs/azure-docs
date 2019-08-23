---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/27/2018
ms.author: glenga
---

## <a name="create-an-azure-functions-project"></a>Create your Functions project with a function 

The Azure Functions project template in Visual Studio Code creates a project that can be published to a function app in Azure. A function app lets you group functions as a logical unit for management, deployment, and sharing of resources.

1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select `Azure Functions: Create new project...`.

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Following the prompts, provide the following information:

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | C# or JavaScript | This article supports C# and JavaScript. For Python, see [this Python article](https://code.visualstudio.com/docs/python/tutorial-azure-functions), and for PowerShell, see [this PowerShell article](../articles/azure-functions/functions-create-first-function-powershell.md).  |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Provide a namespace | My.Functions | (C# only) C# class libraries must have a namespace.  |
    | Authorization level | Function | Requires a [function key](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys) to call the function's HTTP endpoint. |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

Visual Studio Code creates the function app project in a new workspace. This project contains the [host.json](../articles/azure-functions/functions-host-json.md) and [local.settings.json](../articles/azure-functions/functions-run-local.md#local-settings-file) configuration files, plus any language-specific project files. 

A new HTTP triggered function is also created in the HttpTrigger folder of the function app project.