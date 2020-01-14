---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/11/2020
ms.author: glenga
---

## <a name="create-an-azure-functions-project"></a>Create your local project 

The Azure Functions project template in Visual Studio Code creates a project that can be published to a function app in Azure. A function app lets you group functions as a logical unit for management, deployment, and sharing of resources.

1. In Visual Studio Code, press F1 to open the command palette. In the command palette, search for and select `Azure Functions: Create new project...`.

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Following the prompts, provide the following information for your desired language:

    ::: zone pivot="programming-language-csharp"

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | C# | Create a local Functions project in C#. |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Provide a namespace | My.Functions | C# class libraries must have a namespace.  |
    | Authorization level | Function | With this [Authorization level](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys), you must supply a key value when calling your function's HTTP endpoint. |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

    ::: zone-end

    ::: zone pivot="programming-language-nodejs"

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | JavaScript | Create a local Node.js Functions project. |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Authorization level | Function | With this [Authorization level](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys), you must supply a key value when calling your function's HTTP endpoint. |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

    ::: zone-end

    ::: zone pivot="programming-language-python"

    | Prompt | Value | Description |
    | ------ | ----- | ----------- |
    | Select a language for your function app project | Python | Create a local Python Functions project. |
    | Select a Python alias to create a virtual environment | Python alias | Choose the discovered alias of your installed version of Python 3.6 or 3.7. Your app runs in virtual environment based on this installation.  |
    | Select a template for your project's first function | HTTP trigger | Create an HTTP triggered function in the new function app. |
    | Provide a function name | HttpTrigger | Press Enter to use the default name. |
    | Authorization level | Function | With this [Authorization level](../articles/azure-functions/functions-bindings-http-webhook.md#authorization-keys), you must supply a key value when calling your function's HTTP endpoint. |
    | Select how you would like to open your project | Add to workspace | Creates the function app in the current workspace. |

    ::: zone-end

Visual Studio Code creates the function app project in a new workspace. This project contains the [host.json](../articles/azure-functions/functions-host-json.md) and [local.settings.json](../articles/azure-functions/functions-run-local.md#local-settings-file) configuration files. It also creates the following language-specific files.

::: zone pivot="programming-language-csharp"

An HttpTrigger.cs code file for the new HTTP triggered function is created. This file contains a **My.Functions.HttpTrigger** class. The **Run** method is your function, which is defined as follows:

```csharp
[FunctionName("HttpTrigger")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
    ILogger log)
{
    ...
}
```

::: zone-end

::: zone pivot="programming-language-nodejs"

The HTTP triggered function itself is created in the HttpTrigger project folder. The function is defined by the following function.json:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

The function itself in index.js is standard Node.js, as follows:

```javascript
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    ...
}
```

The project-level package.json is a standard Node.js package file.

::: zone-end

::: zone pivot="programming-language-python"

The HTTP triggered function itself is created in the HttpTrigger project folder. The function is defined by the following function.json:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

The Python code in the \_\_init\_\_.py file is defined as follows:

```python
import logging
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    ...
```

The project-level requirements.txt file lists packages required by the function app.

::: zone-end
