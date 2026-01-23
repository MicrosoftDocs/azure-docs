---	
title: Azure function rule example
titleSuffix: An Azure Communication Services how-to guide
description: Learn how to wire up Azure Functions to Job Router decision points.
author: danielgerlag
manager: bo.gao
services: azure-communication-services

ms.author: danielgerlag
ms.date: 04/08/2022
ms.topic: how-to
ms.service: azure-communication-services
---	

# Azure function rule engine

As part of the customer extensibility model, Azure Communication Services Job Router supports an Azure Function based rule engine. It gives you the ability to bring your own Azure function. With Azure Functions, you can incorporate custom and complex logic into the process of routing.

## Creating an Azure function

If you're new to Azure Functions, refer to [Getting started with Azure Functions](../../../azure-functions/functions-get-started.md) to learn how to create your first function with your favorite tool and language.

> [!NOTE]
> Your Azure Function needs to be configured to use an [Http trigger](../../../azure-functions/functions-triggers-bindings.md)

The Http request body that is sent to your function includes the labels of each of the entities involved. For example, if you're writing a function to determine job priority, the payload includes the all the job labels under the `job` key.

```json
{
    "job": {
        "label1": "foo",
        "label2": "bar",
        "urgent": true,
    }
}
```

The following example inspects the value of the `urgent` label and return a priority of 10 if it's true.

```csharp
public static class GetPriority
{
    [FunctionName("GetPriority")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
        ILogger log)
    {
        var priority = 5;
        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        var data = JsonConvert.DeserializeObject<JObject>(requestBody);
        var isUrgent = data["job"]["urgent"].Value<bool>();
        if (isUrgent)
            priority = 10;

        return new OkObjectResult(JsonConvert.SerializeObject(priority));
    }
}
```

## Configure a policy to use the Azure function

Inspect your deployed function in the Azure portal and locate the function Uri and authentication key. Then use the SDK to configure a policy that uses a rule engine to point to that function.

```csharp
await administrationClient.CreateClassificationPolicyAsync(
    new CreateClassificationPolicyOptions("policy-1") {
        PrioritizationRule = new FunctionRouterRule(new Uri("<insert function uri>")) {
            Credential = new FunctionRouterRuleCredential("<insert function key>")
        }});
```

When a new job is submitted or updated, this function is called to determine the priority of the job.

## Minimum requirements for Azure Functions used with Job Router

When integrating an Azure Function as a custom rule engine for Azure Communication Services Job Router, ensure that your Function App meets the following required minimum versions to avoid serialization issues and runtime errors. These requirements are based on recent customer cases and internal validation.

| Requirement | Minimum Version | Recommended Version |
|------------|-----------------|----------------------|
| **Target Framework** | `net8.0` | `net8.0` |
| **Azure Functions Runtime** | `v4` | `v4` |
| **Microsoft.NET.Sdk.Functions** | `4.1.0` | `4.4.0` |
| **Serialization Library** | `System.Text.Json 8.0.6` | `System.Text.Json 8.0.6` |

**Important notes**

- `Newtonsoft.Json` is not supported for Job Router rule execution. Continuing to reference it may lead to payload deserialization failures.
- Ensure that any models used in your function and rule engine payloads are `System.Text.Json‑compatible`.

## Errors

If the Azure Function fails or returns a non-200 code, the job moves to the `ClassificationFailed` state and your application receives a `JobClassificationFailedEvent` from Event Grid containing details of the error.

## Next steps

- [How to customize how workers are ranked for the best worker distribution mode](customize-worker-scoring.md)
