---
title: Dapr Invoke output binding for Azure Functions
description: Learn how to send data to a Dapr Invoke output binding during function execution in Azure Functions.
ms.topic: reference
ms.date: 10/11/2023
ms.devlang: csharp, java, javascript, powershell, python
ms.custom: "devx-track-csharp, devx-track-python"
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Dapr Invoke output binding for Azure Functions

[!INCLUDE [preview-support](../../includes/functions-dapr-support-limitations.md)]

The Dapr invoke output binding allows you to invoke another Dapr application during a function execution.

For information on setup and configuration details of the Dapr extension, see the [Dapr extension overview](./functions-bindings-dapr.md).

## Example

::: zone pivot="programming-language-csharp"

A C# function can be created using one of the following C# modes:

[!INCLUDE [dotnet-execution](../../includes/functions-dotnet-execution-model.md)]

# [In-process](#tab/in-process)

The following example demonstrates using a Dapr invoke output binding to perform a Dapr service invocation operation hosted in another Dapr-ized application. In this example, the function acts like a proxy.

```csharp
[FunctionName("InvokeOutputBinding")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "invoke/{appId}/{methodName}")] HttpRequest req,
    [DaprInvoke(AppId = "{appId}", MethodName = "{methodName}", HttpVerb = "post")] IAsyncCollector<InvokeMethodParameters> output,
    ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

    var outputContent = new InvokeMethodParameters
    {
        Body = requestBody
    };

    await output.AddAsync(outputContent);

    return new OkResult();
}
```

# [Isolated process](#tab/isolated-process)

More samples for the Dapr output invoke binding are available in the [GitHub repository](https://github.com/Azure/azure-functions-dapr-extension/tree/master/samples/dotnet-isolated-azurefunction/OutputBinding).

:::code language="csharp" source="~/azure-functions-dapr-extension/samples/dotnet-isolated-azurefunction/OutputBinding/InvokeOutputBinding.cs" range="22-38"::: 

---

::: zone-end 

::: zone pivot="programming-language-java"

The following example creates a `"InvokeOutputBinding"` function using the `DaprInvokeOutput` binding with an `HttpTrigger`:


```java
@FunctionName("InvokeOutputBinding")
public String run(
        @HttpTrigger(
            name = "req",
            methods = {HttpMethod.GET, HttpMethod.POST},
            authLevel = AuthorizationLevel.ANONYMOUS,
            route = "invoke/{appId}/{methodName}")
            HttpRequestMessage<Optional<String>> request,
        @DaprInvokeOutput(
            appId = "{appId}", 
            methodName = "{methodName}", 
            httpVerb = "post")
        OutputBinding<String> payload,
        final ExecutionContext context)
```
::: zone-end

::: zone pivot="programming-language-javascript"

> [!NOTE]  
> The [Node.js v4 model for Azure Functions](functions-reference-node.md?pivots=nodejs-model-v4) isn't currently available for use with the Dapr extension during the preview.  

The following examples show Dapr triggers in a _function.json_ file and JavaScript code that uses those bindings. 

Here's the _function.json_ file for `daprInvoke`:

```json
{
  "bindings":
    {
      "type": "daprInvoke",
      "direction": "out",
      "appId": "{appId}",
      "methodName": "{methodName}",
      "httpVerb": "post",
      "name": "payload"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

Here's the JavaScript code:

```javascript
module.exports = async function (context, req) {
    context.log("Node HTTP trigger function processed a request.");
    context.bindings.output = { body: req.body };
    context.done(null);
};
```

::: zone-end

::: zone pivot="programming-language-powershell"

The following examples show Dapr triggers in a _function.json_ file and PowerShell code that uses those bindings. 

Here's the _function.json_ file for `daprInvoke`:

```json
{
  "bindings":
    {
      "type": "daprInvoke",
      "direction": "out",
      "appId": "{appId}",
      "methodName": "{methodName}",
      "httpVerb": "post",
      "name": "payload"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section.

In code:

```powershell
using namespace System.Net

# Input bindings are passed in via param block.
param($req, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "Powershell InvokeOutputBinding processed a request."

$req_body = $req.Body

$invoke_output_binding_req_body = @{
    "body" = $req_body
}

# Associate values to output bindings by calling 'Push-OutputBinding'.
Push-OutputBinding -Name payload -Value $invoke_output_binding_req_body

Push-OutputBinding -Name res -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body = $req_body
})
```

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following example shows a Dapr Invoke output binding, which uses the [v2 Python programming model](functions-reference-python.md). To use `daprInvoke` in your Python function app code:

```python
import logging
import json
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="InvokeOutputBinding")
@app.route(route="invoke/{appId}/{methodName}", auth_level=dapp.auth_level.ANONYMOUS)
@app.dapr_invoke_output(arg_name = "payload", app_id = "{appId}", method_name = "{methodName}", http_verb = "post")
def main(req: func.HttpRequest, payload: func.Out[str] ) -> str:
    # request body must be passed this way "{\"body\":{\"value\":{\"key\":\"some value\"}}}" to use the InvokeOutputBinding, all the data must be enclosed in body property.
    logging.info('Python function processed a InvokeOutputBinding request from the Dapr Runtime.')

    body = req.get_body()
    logging.info(body)
    if body is not None:
        payload.set(body)
    else:
        logging.info('req body is none')
    return 'ok'
```

 
# [Python v1](#tab/v1)

The following example shows a Dapr Invoke output binding, which uses the [v1 Python programming model](functions-reference-python.md).

Here's the _function.json_ file for `daprInvoke`:

```json
{
  "scriptFile": "__init__.py",
  "bindings":
    {
      "type": "daprInvoke",
      "direction": "out",
      "appId": "{appId}",
      "methodName": "{methodName}",
      "httpVerb": "post",
      "name": "payload"
    }
}
```

For more information about *function.json* file properties, see the [Configuration](#configuration) section explains these properties.

Here's the Python code:

```python
def main(req: func.HttpRequest,
         payload: func.Out[bytes]) -> func.HttpResponse:
    logging.info('Python InvokeOutputBinding processed a request.')
    data = req.params.get('data')
```

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Attributes

# [In-process](#tab/in-process)

In the [in-process model](./functions-dotnet-class-library.md), use the `DaprInvoke` attribute to define a Dapr invoke output binding, which supports these parameters:

| Parameter | Description | Can be sent via Attribute | Can be sent via RequestBody |
| --------- | ----------- |  :---------------------:  |  :-----------------------:  |
| **AppId** | The Dapr app ID to invoke. | :heavy_check_mark: | :heavy_check_mark: |
| **MethodName** | The method name of the app to invoke. | :heavy_check_mark: | :heavy_check_mark: |
| **HttpVerb** | _Optional._ HTTP verb to use of the app to invoke. Default is `POST`. | :heavy_check_mark: | :heavy_check_mark: |
| **Body** | _Required._ The body of the request. | :x: | :heavy_check_mark: |


# [Isolated process](#tab/isolated-process)

In the [isolated worker model](./dotnet-isolated-process-guide.md), use the `DaprInvokeOutput` attribute to define a Dapr invoke output binding, which supports these parameters:

| Parameter | Description | Can be sent via Attribute | Can be sent via RequestBody | 
| --------- | ----------- |  :---------------------:  |  :-----------------------:  | 
| **AppId** | The Dapr app ID to invoke. | :heavy_check_mark: | :heavy_check_mark: |
| **MethodName** | The method name of the app to invoke. | :heavy_check_mark: | :heavy_check_mark: |
| **HttpVerb** | _Optional._ HTTP verb to use of the app to invoke. Default is `POST`. | :heavy_check_mark: | :heavy_check_mark: |
| **Body** | _Required._ The body of the request. | :x: | :heavy_check_mark: |

---

::: zone-end

::: zone pivot="programming-language-java"

## Annotations

The `DaprInvokeOutput` annotation allows you to have your function invoke and listen to an output binding. 

| Element | Description | Can be sent via Attribute | Can be sent via RequestBody | 
| ------- | ----------- |  :---------------------:  |  :-----------------------:  | 
| **appId** | The app ID of the application involved in the invoke binding. | :heavy_check_mark: | :heavy_check_mark: |
| **methodName** | The name of the method variable. | :heavy_check_mark: | :heavy_check_mark: |
| **httpVerb** | Post or get. | :heavy_check_mark: | :heavy_check_mark: |
| **body** | _Required._ The body of the request. | :x: | :heavy_check_mark: |

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell, programming-language-python"

## Configuration

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"
The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description| Can be sent via Attribute | Can be sent via RequestBody |
|-----------------------|------------|  :---------------------:  |  :-----------------------:  |
|**appId** | The app ID of the application involved in the invoke binding. | :heavy_check_mark: | :heavy_check_mark: |
|**methodName** | The name of the method variable. | :heavy_check_mark: | :heavy_check_mark: |
|**httpVerb** | Post or get. | :heavy_check_mark: | :heavy_check_mark: |
| **body** | _Required._ The body of the request. | :x: | :heavy_check_mark: |

::: zone-end

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

The following table explains the binding configuration properties for `@dapp.dapr_invoke_output` that you set in your Python code.

|Property | Description| Can be sent via Attribute | Can be sent via RequestBody |
|---------|------------|  :---------------------:  |  :-----------------------:  |
|**app_id** | The app ID of the application involved in the invoke binding. | :heavy_check_mark: | :heavy_check_mark: |
|**method_name** | The name of the method variable. | :heavy_check_mark: | :heavy_check_mark: |
|**http_verb** | Set to `post` or `get`. | :heavy_check_mark: | :heavy_check_mark: |
| **body** | _Required._ The body of the request. | :x: | :heavy_check_mark: |

# [Python v1](#tab/v1)

The following table explains the binding configuration properties that you set in the function.json file.

|function.json property | Description| Can be sent via Attribute | Can be sent via RequestBody |
|-----------------------|------------|  :---------------------:  |  :-----------------------:  |
|**appId** | The app ID of the application involved in the invoke binding. | :heavy_check_mark: | :heavy_check_mark: |
|**methodName** | The name of the method variable. | :heavy_check_mark: | :heavy_check_mark: |
|**httpVerb** | Post or get. | :heavy_check_mark: | :heavy_check_mark: |
| **body** | _Required._ The body of the request. | :x: | :heavy_check_mark: |

---

::: zone-end

If properties are defined in both Attributes and `RequestBody`, priority is given to data provided in `RequestBody`.

See the [Example section](#example) for complete examples.

## Usage

To use the Dapr service invocation output binding, learn more about [how to use Dapr service invocation in the official Dapr documentation](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/).

::: zone pivot="programming-language-python"

# [Python v2](#tab/v2)

To use the `daprInvoke` in Python v2, set up your project with the correct dependencies.

1. [Create and activate a virtual environment](https://learn.microsoft.com/azure/azure-functions/create-first-function-cli-python?tabs=macos%2Cbash%2Cazure-cli&pivots=python-mode-decorators#create-venv). 

1. In your `requirements.text` file, add the following line:

   ```txt
   azure-functions==1.18.0b3
   ```

1. In the terminal, install the Python library.

   ```bash
   pip install -r .\requirements.txt
   ```

1. Modify your `local.setting.json` file with the following configuration:

   ```json
   "PYTHON_ISOLATE_WORKER_DEPENDENCIES":1
   ```

# [Python v1](#tab/v1)

The Python v1 model requires no additional changes, aside from setting up the service invocation components.

---

::: zone-end


## Next steps

[Learn more about Dapr service invocation.](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/)
