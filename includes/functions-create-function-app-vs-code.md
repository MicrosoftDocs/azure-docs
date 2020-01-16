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

    ::: zone pivot="programming-language-csharp"

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | C# | Create a local Functions project in C#. |
    | Select a version | Azure Functions v2 | You only see this option when the Core Tools aren't already installed. In this case, Core Tools are installed the first time you run the app. |    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Provide a namespace | My.Functions | C# class libraries must have a namespace.  |
    | Authorization level | Function | The `function` authorization level requires you to supply an access key when calling your function's HTTP endpoint. This makes it more difficult to access an unsecured endpoint. To learn more, see [Authorization keys](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys).  |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

    ::: zone-end

    ::: zone pivot="programming-language-javascript"

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | JavaScript | Create a local Node.js Functions project. |
    | Select a version | Azure Functions v2 | You only see this option when the Core Tools aren't already installed. In this case, Core Tools are installed the first time you run the app. |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Authorization level | Function | The `function` authorization level requires you to supply an access key when calling your function's HTTP endpoint. This makes it more difficult to access an unsecured endpoint. To learn more, see [Authorization keys](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys).  |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

    ::: zone-end

        ::: zone pivot="programming-language-typescript"

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | TypeScript | Create a local Node.js Functions project using [TypeScript](../articles/azure-functions/functions-reference-node.md#typescript). |
    | Select a version | Azure Functions v2 | You only see this option when the Core Tools aren't already installed. In this case, Core Tools are installed the first time you run the app. |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Authorization level | Function | The `function` authorization level requires you to supply an access key when calling your function's HTTP endpoint. This makes it more difficult to access an unsecured endpoint. To learn more, see [Authorization keys](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys).  |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

    ::: zone-end

    ::: zone pivot="programming-language-powershell"

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | PowerShell | Create a local PowerShell Functions project. |
    | Select a version | Azure Functions v2 | You only see this option when the Core Tools aren't already installed. In this case, Core Tools are installed the first time you run the app. |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Authorization level | Function | The `function` authorization level requires you to supply an access key when calling your function's HTTP endpoint. This makes it more difficult to access an unsecured endpoint. To learn more, see [Authorization keys](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys).  |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

    ::: zone-end

    ::: zone pivot="programming-language-python"

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | Python | Create a local Python Functions project. |
    | Select a version | Azure Functions v2 | You only see this option when the Core Tools aren't already installed. In this case, Core Tools are installed the first time you run the app. |
    | Select a Python alias to create a virtual environment | Python alias | Choose the discovered alias of your installed version of Python 3.6 or 3.7. Your app runs in virtual environment based on this installation.  |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Authorization level | Function | The `function` authorization level requires you to supply an access key when calling your function's HTTP endpoint. This makes it more difficult to access an unsecured endpoint. To learn more, see [Authorization keys](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys).  |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

    ::: zone-end

Visual Studio Code installs the Azure Functions Core Tools, if needed. It also creates a function app project in a new workspace. This project contains the [host.json](../articles/azure-functions/functions-host-json.md) and [local.settings.json](../articles/azure-functions/functions-run-local.md#local-settings-file) configuration files. It also creates the following language-specific files.

::: zone pivot="programming-language-csharp"

An [HttpTrigger.cs class library file](../articles/azure-functions/functions-dotnet-class-library.md#functions-class-library-project) that implements the function. 

::: zone-end

::: zone pivot="programming-language-javascript"

An HttpTrigger folder that contains the [function.json definition file](../articles/azure-functions/functions-reference-node.md#folder-structure) and the [index.js file](../articles/azure-functions/functions-reference-node.md#exporting-a-function), a Node.js file that contains the function code.

A package.json file is also created in the root folder.

::: zone-end

::: zone pivot="programming-language-typescript"

An HttpTrigger folder that contains the [function.json definition file](../articles/azure-functions/functions-reference-node.md#folder-structure) and the [index.ts file](../articles/azure-functions/functions-reference-node.md#typescript), a TypeScript file that contains the function code.

A package.json file and a tsconfig.json file are also created in the root folder.

::: zone-end

::: zone pivot="programming-language-powershell"

An HttpTrigger folder  contains the [function.json definition file](../articles/azure-functions/functions-reference-python.md#programming-model) and the 

::: zone-end

::: zone pivot="programming-language-python"

The project-level requirements.txt file lists packages required by the function app.

An HttpTrigger folder  contains the [function.json definition file](../articles/azure-functions/functions-reference-python.md#programming-model)  and the \_\_init\_\_.py file, which contains the function code.

::: zone-end
