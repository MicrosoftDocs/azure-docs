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

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

As part of the customer extensibility model, Azure Communication Services Job Router supports an Azure Function based rule engine. It gives you the ability to bring your own Azure function. With Azure Functions, you can incorporate custom and complex logic into the process of routing.

## Creating an Azure function

If you're new to Azure Functions, refer to [Getting started with Azure Functions](../../../azure-functions/functions-get-started.md) to learn how to create your first function with your favorite tool and language.

> [!NOTE]
> Your Azure Function will need to be configured to use an [Http trigger](../../../azure-functions/functions-triggers-bindings.md)

The Http request body that is sent to your function will include the labels of each of the entities involved. For example, if you're writing a function to determine job priority, the payload will include the all the job labels under the `job` key.

```json
{
    "job": {
        "label1": "foo",
        "label2": "bar",
        "urgent": true,
    }
}
```

The following example will inspect the value of the `urgent` label and return a priority of 10 if it's true.

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

When a new job is submitted or updated, this function will be called to determine the priority of the job.

## Errors

If the Azure Function fails or returns a non-200 code, the job will move to the `ClassificationFailed` state and you'll receive a `JobClassificationFailedEvent` from Event Grid containing details of the error.

## Next steps

- [How to customize how workers are ranked for the best worker distribution mode](customize-worker-scoring.md)
