---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/11/2020
ms.author: glenga
---

## <a name="create-an-azure-functions-project"></a>Create your Functions project with a function 

The Azure Functions project template in Visual Studio Code creates a project that can be published to a function app in Azure. A function app lets you group functions as a logical unit for management, deployment, and sharing of resources.

1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select `Azure Functions: Create new project...`.

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Following the prompts, provide the following information for your desired language:

    # [C\#](#tab/csharp)

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | C# | Create a local Functions project in C#. |
    | Select a version | Azure Functions v2 | Function app runs on [version 2.x](../articles/azure-functions/functions-versions.md) of the Functions runtime. |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Provide a namespace | My.Functions | C# class libraries must have a namespace.  |
    | Authorization level | Anonymous | With this [Authorization level](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys), anyone can call your function's HTTP endpoint. |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

     # [JavaScript](#tab/nodejs)

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | JavaScript | Create a local Node.js Functions project. |
    | Select a version | Azure Functions v2 | Function app runs on [version 2.x](../articles/azure-functions/functions-versions.md) of the Functions runtime. |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Authorization level | Anonymous | With this [Authorization level](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys), anyone can call your function's HTTP endpoint. |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

    # [Python](#tab/python)

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | Python | Create a local Python Functions project. |
    | Select a version | Azure Functions v2 | Function app runs on [version 2.x](../articles/azure-functions/functions-versions.md) of the Functions runtime. |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Authorization level | Anonymous | With this [Authorization level](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys), anyone can call your function's HTTP endpoint. |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

    ---

Visual Studio Code creates the function app project in a new workspace. This project contains the [host.json](../articles/azure-functions/functions-host-json.md) and [local.settings.json](../articles/azure-functions/functions-run-local.md#local-settings-file) configuration files, plus any language-specific project files. 

A new HTTP triggered function is also created in the HttpTrigger folder of the function app project.