---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/10/2022
ms.author: glenga
ms.custom: devdivchpfy22
---
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-powershell,programming-language-python,programming-language-java"

## Add an output binding definition to the function

Although a function can have only one trigger, it can have multiple input and output bindings, which lets you connect to other Azure services and resources without writing custom integration code.
::: zone-end
::: zone pivot="programming-language-python,programming-language-javascript,programming-language-powershell,programming-language-typescript"  

# [v1](#tab/v1)

You declare these bindings in the *function.json* file in your function folder. From the previous quickstart, your *function.json* file in the *HttpExample* folder contains two bindings in the `bindings` collection:  

# [v2](#tab/v2)

Binding attributes are defined directly in the *function_app.py* file. From the previous quickstart, your *function_app.py* file, which contains one decorator-based binding, is in the *HttpExample* folder:

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"  
:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-JavaScript/function.json" range="2-18":::  
::: zone-end

::: zone pivot="programming-language-python"  

# [v1](#tab/v1)

:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-Python/function.json" range="2-18":::  

# [v2](#tab/v2)

```python
import azure.functions as func
import logging

app = func.FunctionApp()

@app.function_name(name="HttpTrigger1")
@app.route(route="hello", auth_level=func.AuthLevel.ANONYMOUS)
```

---

::: zone-end

::: zone pivot="programming-language-powershell"  
:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-PowerShell/function.json" range="2-18":::
::: zone-end  

::: zone pivot="programming-language-python,programming-language-javascript, programming-language-powershell, programming-language-typescript"  

# [v1](#tab/v1)

Each binding has at least a type, a direction, and a name. In the above example, the first binding is of type `httpTrigger` with the direction `in`. For the `in` direction, `name` specifies the name of an input parameter that's sent to the function when invoked by the trigger.  

# [v2](#tab/v2)

TBD

---

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"  
The second binding in the collection is named `res`. This `http` binding is an output binding (`out`) that is used to write the HTTP response.

To write to an Azure Storage queue from this function, add an `out` binding of type `queue` with the name `msg`, as shown in the code below:

:::code language="json" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="3-26":::
::: zone-end  

::: zone pivot="programming-language-python"  

# [v1](#tab/v1)

The second binding in the collection is of type `http` with the direction `out`, in which case the special `name` of `$return` indicates that this binding uses the function's return value rather than providing an input parameter.

To write to an Azure Storage queue from this function, add an `out` binding of type `queue` with the name `msg`, as shown in the code below:

:::code language="json" source="~/functions-docs-python/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="3-26":::

# [v2](#tab/v2)

TBD

---

::: zone-end  

::: zone pivot="programming-language-powershell"  
The second binding in the collection is named `res`. This `http` binding is an output binding (`out`) that is used to write the HTTP response.

To write to an Azure Storage queue from this function, add an `out` binding of type `queue` with the name `msg`, as shown in the code below:

:::code language="json" source="~/functions-docs-powershell/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="3-26":::
::: zone-end  

::: zone pivot="programming-language-python,programming-language-javascript,programming-language-powershell,programming-language-typescript"  
In this case, `msg` is given to the function as an output argument. For a `queue` type, you must also specify the name of the queue in `queueName` and provide the *name* of the Azure Storage connection (from *local.settings.json* file) in `connection`. 
::: zone-end  
