---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/09/2023
ms.author: glenga
ms.custom: devdivchpfy22
---
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"

## Add an output binding definition to the function

Although a function can have only one trigger, it can have multiple input and output bindings, which lets you connect to other Azure services and resources without writing custom integration code.
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-typescript"

You declare these bindings in the *function.json* file in your function folder. From the previous quickstart, your *function.json* file in the *HttpExample* folder contains two bindings in the `bindings` collection:  

::: zone-end

::: zone pivot="programming-language-python"

The way you declare binding attributes depends on your Python programming model.

# [v1](#tab/v1)

You declare these bindings in the *function.json* file in your function folder. From the previous quickstart, your *function.json* file in the *HttpExample* folder contains two bindings in the `bindings` collection:

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-Python/function.json" range="2-18":::

Each binding has at least a type, a direction, and a name. In the above example, the first binding is of type `httpTrigger` with the direction `in`. For the `in` direction, `name` specifies the name of an input parameter that's sent to the function when invoked by the trigger.

The second binding in the collection is of type `http` with the direction `out`, in which case the special `name` of `$return` indicates that this binding uses the function's return value rather than providing an input parameter.

To write to an Azure Storage queue from this function, add an `out` binding of type `queue` with the name `msg`, as shown in the code below:

:::code language="json" source="~/functions-docs-python/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="3-26":::

In this case, `msg` is given to the function as an output argument. For a `queue` type, you must also specify the name of the queue in `queueName` and provide the *name* of the Azure Storage connection (from *local.settings.json* file) in `connection`. 

# [v2](#tab/v2)

Binding attributes are defined directly in the *function_app.py* file as decorators. From the previous quickstart, your *function_app.py* file already contains one decorator-based binding:

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

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"  
:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-JavaScript/function.json" range="2-18":::  
::: zone-end


::: zone pivot="programming-language-powershell"  
:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-PowerShell/function.json" range="2-18":::
::: zone-end  


::: zone pivot="programming-language-javascript,programming-language-typescript"  
The second binding in the collection is named `res`. This `http` binding is an output binding (`out`) that is used to write the HTTP response.

To write to an Azure Storage queue from this function, add an `out` binding of type `queue` with the name `msg`, as shown in the code below:

:::code language="json" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="3-26":::
::: zone-end  


::: zone pivot="programming-language-powershell"  
The second binding in the collection is named `res`. This `http` binding is an output binding (`out`) that is used to write the HTTP response.

To write to an Azure Storage queue from this function, add an `out` binding of type `queue` with the name `msg`, as shown in the code below:

:::code language="json" source="~/functions-docs-powershell/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="3-26":::
::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-typescript"  
In this case, `msg` is given to the function as an output argument. For a `queue` type, you must also specify the name of the queue in `queueName` and provide the *name* of the Azure Storage connection (from *local.settings.json* file) in `connection`. 
::: zone-end  
