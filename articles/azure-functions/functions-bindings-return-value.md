---
title: Using return value from an Azure Function
description: Learn to manage return values for Azure Functions
ms.topic: reference
ms.devlang: csharp, fsharp, java, javascript, powershell, python
ms.custom: devx-track-csharp, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 07/25/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Using the Azure Function return value

This article explains how return values work inside a function. In languages that have a return value, you can bind a function [output binding](./functions-triggers-bindings.md#binding-direction) to the return value.

::: zone pivot="programming-language-javascript,programming-language-powershell,programming-language-python" 

Set the `name` property in *function.json* to `$return`. If there are multiple output bindings, use the return value for only one of them.

::: zone-end

::: zone pivot="programming-language-csharp"

How return values are used depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)


In a C# class library, apply the output binding attribute to the method return value. In C# and C# script, alternative ways to send data to an output binding are `out` parameters and [collector objects](functions-reference-csharp.md#writing-multiple-output-values).

Here's C# code that uses the return value for an output binding, followed by an async example:

```cs
[FunctionName("QueueTrigger")]
[return: Blob("output-container/{id}")]
public static string Run([QueueTrigger("inputqueue")]WorkItem input, ILogger log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.LogInformation($"C# script processed queue message. Item={json}");
    return json;
}
```

```cs
[FunctionName("QueueTrigger")]
[return: Blob("output-container/{id}")]
public static Task<string> Run([QueueTrigger("inputqueue")]WorkItem input, ILogger log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.LogInformation($"C# script processed queue message. Item={json}");
    return Task.FromResult(json);
}
```

# [Isolated process](#tab/isolated-process)

See [Output bindings in the .NET worker guide](./dotnet-isolated-process-guide.md#output-bindings) for details and examples.

---

::: zone-end

::: zone pivot="programming-language-javascript"  

Here's the output binding in the *function.json* file:

```json
{
    "name": "$return",
    "type": "blob",
    "direction": "out",
    "path": "output-container/{id}"
}
```

Here's the JavaScript code:

```javascript
module.exports = function (context, input) {
    var json = JSON.stringify(input);
    context.log('Node.js script processed queue message', json);
    return json;
}
```


::: zone-end

::: zone pivot="programming-language-powershell"  

Here's the output binding in the *function.json* file:

```json
{
    "name": "Response",
    "type": "blob",
    "direction": "out",
    "path": "output-container/{blobname}"
}
```

Here's the PowerShell code that uses the return value for an http output binding:

```powershell
Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body = $blobname
    })
```

::: zone-end

::: zone pivot="programming-language-python"

Here's the output binding in the *function.json* file:

```json
{
    "name": "$return",
    "type": "blob",
    "direction": "out",
    "path": "output-container/{id}"
}
```
Here's the Python code:

```python
def main(input: azure.functions.InputStream) -> str:
    return json.dumps({
        'name': input.name,
        'length': input.length,
        'content': input.read().decode('utf-8')
    })
```


::: zone-end

::: zone pivot="programming-language-java"

Apply the output binding annotation to the function method. If there are multiple output bindings, use the return value for only one of them.


Here's Java code that uses the return value for an output binding:

```java
@FunctionName("QueueTrigger")
@StorageAccount("AzureWebJobsStorage")
@BlobOutput(name = "output", path = "output-container/{id}")
public static String run(
  @QueueTrigger(name = "input", queueName = "inputqueue") WorkItem input,
  final ExecutionContext context
) {
  String json = String.format("{ \"id\": \"%s\" }", input.id);
  context.getLogger().info("Java processed queue message. Item=" + json);
  return json;
}
```

::: zone-end


## Next steps

> [!div class="nextstepaction"]
> [Handle Azure Functions binding errors](./functions-bindings-errors.md)
