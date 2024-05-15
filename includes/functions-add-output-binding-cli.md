---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/25/2024
ms.author: glenga
ms.custom: devdivchpfy22
---
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"

## Add an output binding definition to the function

Although a function can have only one trigger, it can have multiple input and output bindings, which lets you connect to other Azure services and resources without writing custom integration code.
::: zone-end  

::: zone pivot="programming-language-javascript"  
When using the [Node.js v4 programming model](../articles/azure-functions/functions-reference-node.md), binding attributes are defined directly in the *./src/functions/HttpExample.js* file. From the previous quickstart, your file already contains an HTTP binding defined by the `app.http` method. 

:::code language="javascript" source="~/functions-docs-javascript/src/functions/httpTrigger.js":::

::: zone-end  

::: zone pivot="programming-language-typescript"  
When using the [Node.js v4 programming model](../articles/azure-functions/functions-reference-node.md), binding attributes are defined directly in the *./src/functions/HttpExample.js* file. From the previous quickstart, your file already contains an HTTP binding defined by the `app.http` method. 

:::code language="typescript" source="~/functions-docs-javascript/functions-typescript/src/functions/httpTrigger1.ts":::

::: zone-end  


::: zone pivot="programming-language-powershell"  

You declare these bindings in the *function.json* file in your function folder. From the previous quickstart, your *function.json* file in the *HttpExample* folder contains two bindings in the `bindings` collection:  
::: zone-end  
::: zone pivot="programming-language-python"  
When using the [Python v2 programming model](../articles/azure-functions/functions-reference-python.md?pivots=python-mode-decorators), binding attributes are defined directly in the *function_app.py* file as decorators. From the previous quickstart, your *function_app.py* file already contains one decorator-based binding:

```python
import azure.functions as func
import logging

app = func.FunctionApp()

@app.function_name(name="HttpTrigger1")
@app.route(route="hello", auth_level=func.AuthLevel.ANONYMOUS)
```

The `route` decorator adds HttpTrigger and HttpOutput binding to the function, which enables your function be triggered when http requests hit the specified route. 

To write to an Azure Storage queue from this function, add the `queue_output` decorator to your function code:

```python
@app.queue_output(arg_name="msg", queue_name="outqueue", connection="AzureWebJobsStorage")
```

In the decorator, `arg_name` identifies the binding parameter referenced in your code, `queue_name` is name of the queue that the binding writes to, and `connection` is the name of an application setting that contains the connection string for the Storage account. In quickstarts you use the same storage account as the function app, which is in the `AzureWebJobsStorage` setting (from *local.settings.json* file). When the `queue_name` doesn't exist, the binding creates it on first use.
::: zone-end  
 
::: zone pivot="programming-language-powershell"  
:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-PowerShell/function.json" range="2-18":::
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  

To write to an Azure Storage queue:

* Add an `extraOutputs` property to the binding configuration

    ```typescript
    {
        methods: ['GET', 'POST'],
        extraOutputs: [sendToQueue], // add output binding to HTTP trigger
        authLevel: 'anonymous',
        handler: () => {}
    }
    ```

* Add a `output.storageQueue` function above the `app.http` call

    :::code language="typescript" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli-v4-programming-model-ts/src/functions/httpTrigger1.ts" range="10-13":::

::: zone-end  
::: zone pivot="programming-language-powershell"  
The second binding in the collection is named `res`. This `http` binding is an output binding (`out`) that is used to write the HTTP response.

To write to an Azure Storage queue from this function, add an `out` binding of type `queue` with the name `msg`, as shown in the code below:

:::code language="json" source="~/functions-docs-powershell/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="3-26":::
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-typescript"  
For a `queue` type, you must specify the name of the queue in `queueName` and provide the *name* of the Azure Storage connection (from *local.settings.json* file) in `connection`. 
::: zone-end  
