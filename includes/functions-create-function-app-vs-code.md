---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/11/2020
ms.author: glenga
---

## <a name="create-an-azure-functions-project"></a>Create your local project 

In this section, you use Visual Studio Code to create a local Azure Functions project in your chosen language. Later in this article, you'll publish your function code to Azure. 

1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select `Azure Functions: Create new project...`.

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Following the prompts, provide the following information for your desired language:



    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    ::: zone pivot="programming-language-csharp"
    | Select a language for your function app project | C# | Create a local Functions project in C#. |
    ::: zone-end
    ::: zone pivot="programming-language-javascript"
    | Select a language for your function app project | JavaScript | Create a local Node.js Functions project. |
    ::: zone-end
    ::: zone pivot="programming-language-powershell"
    | Select a language for your function app project | PowerShell | Create a local PowerShell Functions project. |
    ::: zone-end
    ::: zone pivot="programming-language-python"
    | Select a language for your function app project | Python | Create a local Python Functions project. |
    | Select a Python alias to create a virtual environment | Python alias | Choose the discovered alias of your installed version of Python 3.6 or 3.7. Your app runs in virtual environment based on this installation.  |
    ::: zone-end
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    ::: zone pivot="programming-language-csharp"
    | Provide a namespace | My.Functions | C# class libraries must have a namespace.  |
    ::: zone-end
    | Authorization level | Function | The `function` authorization level requires you to supply an access key when calling your function's HTTP endpoint. This makes it more difficult to access an unsecured endpoint. To learn more, see [Authorization keys](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys).  |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |


Visual Studio Code creates the function app project in a new workspace. This project contains the [host.json](../articles/azure-functions/functions-host-json.md) and [local.settings.json](../articles/azure-functions/functions-run-local.md#local-settings-file) configuration files. It also creates the following language-specific files.

::: zone pivot="programming-language-csharp"

An [HttpTrigger.cs class library file](../articles/azure-functions/functions-dotnet-class-library.md#functions-class-library-project) that implements the function. 

::: zone-end

::: zone pivot="programming-language-javascript"

An HttpTrigger folder that contains the [function.json definition file](../articles/azure-functions/functions-reference-node.md#folder-structure) and the [index.js file](../articles/azure-functions/functions-reference-node.md#exporting-a-function), a Node.js file that contains the function code.

::: zone-end

::: zone pivot="programming-language-python"

The project-level requirements.txt file lists packages required by the function app.

An HttpTrigger folder  contains the [function.json definition file](../articles/azure-functions/functions-reference-python.md#programming-model) and the 

::: zone-end
