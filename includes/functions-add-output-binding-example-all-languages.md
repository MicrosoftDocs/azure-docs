---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/06/2024
ms.author: glenga
---

The following example shows the function definition after adding a [Queue Storage output binding](../articles/azure-functions/functions-bindings-storage-queue-output.md) to an [HTTP triggered function](../articles/azure-functions/functions-bindings-http-webhook-trigger.md):  
::: zone pivot="programming-language-csharp" 
### [Isolated process](#tab/isolated-process)
Because an HTTP triggered function also returns an HTTP response, the function returns a `MultiResponse` object, which represents both the HTTP and queue output.

```csharp
[Function("HttpExample")]
public static MultiResponse Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req,
    FunctionContext executionContext)
{
```

This example is the definition of the `MultiResponse` object that includes the output binding:

```csharp
public class MultiResponse
{
    [QueueOutput("outqueue",Connection = "AzureWebJobsStorage")]
    public string[] Messages { get; set; }
    public IActionResult HttpResponse { get; set; }
}
```

When applying that example to your own project, you might need to change `HttpRequest` to `HttpRequestData` and `IActionResult` to `HttpResponseData`, depending on if you are using [ASP.NET Core integration](../articles/azure-functions/dotnet-isolated-process-guide.md#aspnet-core-integration) or not.

### [In-process](#tab/in-process)
:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-cli/HttpExample.cs" range="14-18" highlight="4":::

---
Messages are sent to the queue when the function completes. The way you define the output binding depends on your process model. For more information, including links to example binding code that you can refer to, see [Add bindings to a function](../articles/azure-functions/add-bindings-existing-function.md?tabs=csharp#manually-add-bindings-based-on-examples).  
::: zone-end  
::: zone pivot="programming-language-java"

:::code language="java" source="~/functions-quickstart-java/functions-add-output-binding-storage-queue/src/main/java/com/function/Function.java" range="16-22" highlight="5-6":::
  
For more information, including links to example binding code that you can refer to, see [Add bindings to a function](../articles/azure-functions/add-bindings-existing-function.md?tabs=java#manually-add-bindings-based-on-examples).  
::: zone-end  
::: zone pivot="programming-language-javascript"
### [v4](#tab/node-v4)

:::code language="javascript" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli-v4-programming-model/src/functions/httpTrigger1.js":::


### [v3](#tab/node-v3)
:::code language="json" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" highlight="18-24" :::

--- 

The way you define the output binding depends on the version of your Node.js model. For more information, including links to example binding code that you can refer to, see [Add bindings to a function](../articles/azure-functions/add-bindings-existing-function.md?tabs=javascript#manually-add-bindings-based-on-examples).   
::: zone-end  
::: zone pivot="programming-language-powershell"  
:::code language="powershell" range="18-19" source="~/functions-docs-powershell/functions-add-output-binding-storage-queue-cli/HttpExample/run.ps1" highlight="18-24":::

For more information, including links to example binding code that you can refer to, see [Add bindings to a function](../articles/azure-functions/add-bindings-existing-function.md?tabs=powershell#manually-add-bindings-based-on-examples).   
::: zone-end  
::: zone pivot="programming-language-python"  
### [v2](#tab/python-v2)

:::code language="python" source="~/functions-docs-python-v2/function_app.py" range="6-9" highlight="2":::

### [v1](#tab/python-v1)

:::code language="json" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" highlight="18-24":::

---

The way you define the output binding depends on the version of your Python model. For more information, including links to example binding code that you can refer to, see [Add bindings to a function](../articles/azure-functions/add-bindings-existing-function.md?tabs=python#manually-add-bindings-based-on-examples).   
::: zone-end
::: zone pivot="programming-language-typescript"
### [v4](#tab/node-v4)

:::code language="typescript" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli-v4-programming-model-ts/src/functions/httpTrigger1.ts":::

### [v3](#tab/node-v3)

:::code language="json" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" highlight="18-24":::

--- 

The way you define the output binding depends on the version of your Node.js model. For more information, including links to example binding code that you can refer to, see [Add bindings to a function](../articles/azure-functions/add-bindings-existing-function.md?tabs=typescript#manually-add-bindings-based-on-examples).
::: zone-end
