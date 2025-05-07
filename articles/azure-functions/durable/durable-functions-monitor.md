---
title: Monitors in Durable Functions - Azure
description: Learn how to implement a status monitor using the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.date: 12/07/2018
ms.author: azfuncdf
ms.devlang: csharp
# ms.devlang: csharp, javascript
---

# Monitor scenario in Durable Functions - Weather watcher sample

The monitor pattern refers to a flexible *recurring* process in a workflow - for example, polling until certain conditions are met. This article explains a sample that uses [Durable Functions](durable-functions-overview.md) to implement monitoring.

## Prerequisites

# [C#](#tab/csharp)

* [Complete the quickstart article](durable-functions-isolated-create-first-csharp.md)
* [Clone or download the samples project from GitHub](https://github.com/Azure/azure-functions-durable-extension/tree/main/samples/precompiled)

# [JavaScript](#tab/javascript)

* [Complete the quickstart article](quickstart-js-vscode.md)
* [Clone or download the samples project from GitHub](https://github.com/Azure/azure-functions-durable-js/tree/main/samples)

---

## Scenario overview

This sample monitors a location's current weather conditions and alerts a user by SMS when the skies are clear. You could use a regular timer-triggered function to check the weather and send alerts. However, one problem with this approach is **lifetime management**. If only one alert should be sent, the monitor needs to disable itself after clear weather is detected. The monitoring pattern can end its own execution, among other benefits:

* Monitors run on intervals, not schedules: a timer trigger *runs* every hour; a monitor *waits* one hour between actions. A monitor's actions won't overlap unless specified, which can be important for long-running tasks.
* Monitors can have dynamic intervals: the wait time can change based on some condition.
* Monitors can terminate when some condition is met or be terminated by another process.
* Monitors can take parameters. The sample shows how the same weather-monitoring process can be applied to any requested location and phone number.
* Monitors are scalable. Because each monitor is an orchestration instance, multiple monitors can be created without having to create new functions or define more code.
* Monitors integrate easily into larger workflows. A monitor can be one section of a more complex orchestration function, or a [sub-orchestration](durable-functions-sub-orchestrations.md).

## Configuration

### Configuring Twilio integration

[!INCLUDE [functions-twilio-integration](../../../includes/functions-twilio-integration.md)]

### Configuring Weather Underground integration

This sample involves using the Weather Underground API to check current weather conditions for a location.

The first thing you need is a Weather Underground account. You can create one for free at [https://www.wunderground.com/signup](https://www.wunderground.com/signup). Once you have an account, you need to acquire an API key. You can do so by visiting [https://www.wunderground.com/weather/api](https://www.wunderground.com/weather/api/?MR=1), then selecting Key Settings. The Stratus Developer plan is free and sufficient to run this sample.

Once you have an API key, add the following **app setting** to your function app.

| App setting name | Value description |
| - | - |
| **WeatherUndergroundApiKey**  | Your Weather Underground API key. |

## The functions

This article explains the following functions in the sample app:

* `E3_Monitor`: An [orchestrator function](durable-functions-bindings.md#orchestration-trigger) that calls `E3_GetIsClear` periodically. It calls `E3_SendGoodWeatherAlert` if `E3_GetIsClear` returns true.
* `E3_GetIsClear`: An [activity function](durable-functions-bindings.md#activity-trigger) that checks the current weather conditions for a location.
* `E3_SendGoodWeatherAlert`: An activity function that sends an SMS message via Twilio.

### E3_Monitor orchestrator function

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/Monitor.cs?range=41-78,97-115)]

The orchestrator requires a location to monitor and a phone number to send a message to when the weather becomes clear at the location. This data is passed to the orchestrator as a strongly typed `MonitorRequest` object.

# [JavaScript](#tab/javascript)

The **E3_Monitor** function uses the standard *function.json* for orchestrator functions.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_Monitor/function.json":::

Here's the code that implements the function:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_Monitor/index.js":::

---

This orchestrator function performs the following actions:

1. Gets the **MonitorRequest** consisting of the *location* to monitor and the *phone number* to which it sends an SMS notification.
2. Determines the expiration time of the monitor. The sample uses a hard-coded value for brevity.
3. Calls **E3_GetIsClear** to determine whether there are clear skies at the requested location.
4. If the weather is clear, calls **E3_SendGoodWeatherAlert** to send an SMS notification to the requested phone number.
5. Creates a durable timer to resume the orchestration at the next polling interval. The sample uses a hard-coded value for brevity.
6. Continues running until the current UTC time passes the monitor's expiration time, or an SMS alert is sent.

Multiple orchestrator instances can run simultaneously by calling the orchestrator function multiple times. The location to monitor and the phone number to send an SMS alert to can be specified. Finally, do note that the orchestrator function isn't* running while waiting for the timer, so you won't get charged for it.
### E3_GetIsClear activity function

As with other samples, the helper activity functions are regular functions that use the `activityTrigger` trigger binding. The **E3_GetIsClear** function gets the current weather conditions using the Weather Underground API and determines whether the sky is clear.

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/Monitor.cs?range=80-85)]

# [JavaScript](#tab/javascript)

The *function.json* is defined as follows:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_GetIsClear/function.json":::

And here's the implementation.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_GetIsClear/index.js":::

---

### E3_SendGoodWeatherAlert activity function

The **E3_SendGoodWeatherAlert** function uses the Twilio binding to send an SMS message notifying the end user that it's a good time for a walk.

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/Monitor.cs?range=87-96,140-205)]

> [!NOTE]
> You will need to install the `Microsoft.Azure.WebJobs.Extensions.Twilio` Nuget package to run the sample code.

# [JavaScript](#tab/javascript)

Its *function.json* is simple:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_SendGoodWeatherAlert/function.json":::

And here's the code that sends the SMS message:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_SendGoodWeatherAlert/index.js":::

---

## Run the sample

Using the HTTP-triggered functions included in the sample, you can start the orchestration by sending the following HTTP POST request:

```
POST https://{host}/orchestrators/E3_Monitor
Content-Length: 77
Content-Type: application/json

{ "location": { "city": "Redmond", "state": "WA" }, "phone": "+1425XXXXXXX" }
```

```
HTTP/1.1 202 Accepted
Content-Type: application/json; charset=utf-8
Location: https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635?taskHub=SampleHubVS&connection=Storage&code={SystemKey}
RetryAfter: 10

{"id": "f6893f25acf64df2ab53a35c09d52635", "statusQueryGetUri": "https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635?taskHub=SampleHubVS&connection=Storage&code={systemKey}", "sendEventPostUri": "https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635/raiseEvent/{eventName}?taskHub=SampleHubVS&connection=Storage&code={systemKey}", "terminatePostUri": "https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635/terminate?reason={text}&taskHub=SampleHubVS&connection=Storage&code={systemKey}"}
```

The **E3_Monitor** instance starts and queries the current weather conditions for the requested location. If the weather is clear, it calls an activity function to send an alert; otherwise, it sets a timer. When the timer expires, the orchestration resumes.

You can see the orchestration's activity by looking at the function logs in the Azure Functions portal.

```
2018-03-01T01:14:41.649 Function started (Id=2d5fcadf-275b-4226-a174-f9f943c90cd1)
2018-03-01T01:14:42.741 Started orchestration with ID = '1608200bb2ce4b7face5fc3b8e674f2e'.
2018-03-01T01:14:42.780 Function completed (Success, Id=2d5fcadf-275b-4226-a174-f9f943c90cd1, Duration=1111ms)
2018-03-01T01:14:52.765 Function started (Id=b1b7eb4a-96d3-4f11-a0ff-893e08dd4cfb)
2018-03-01T01:14:52.890 Received monitor request. Location: Redmond, WA. Phone: +1425XXXXXXX.
2018-03-01T01:14:52.895 Instantiating monitor for Redmond, WA. Expires: 3/1/2018 7:14:52 AM.
2018-03-01T01:14:52.909 Checking current weather conditions for Redmond, WA at 3/1/2018 1:14:52 AM.
2018-03-01T01:14:52.954 Function completed (Success, Id=b1b7eb4a-96d3-4f11-a0ff-893e08dd4cfb, Duration=189ms)
2018-03-01T01:14:53.226 Function started (Id=80a4cb26-c4be-46ba-85c8-ea0c6d07d859)
2018-03-01T01:14:53.808 Function completed (Success, Id=80a4cb26-c4be-46ba-85c8-ea0c6d07d859, Duration=582ms)
2018-03-01T01:14:53.967 Function started (Id=561d0c78-ee6e-46cb-b6db-39ef639c9a2c)
2018-03-01T01:14:53.996 Next check for Redmond, WA at 3/1/2018 1:44:53 AM.
2018-03-01T01:14:54.030 Function completed (Success, Id=561d0c78-ee6e-46cb-b6db-39ef639c9a2c, Duration=62ms)
```

The orchestration completes once its timeout is reached or clear skies are detected. You can also use the `terminate` API inside another function or invoke the **terminatePostUri** HTTP POST webhook referenced in the preceding 202 response. To use the webhook, replace `{text}` with the reason for the early termination. The HTTP POST URL looks roughly as follows:

```
POST https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635/terminate?reason=Because&taskHub=SampleHubVS&connection=Storage&code={systemKey}
```

## Next steps

This sample demonstrates how to use Durable Functions to monitor an external source's status using [durable timers](durable-functions-timers.md) and conditional logic. The next sample shows how to use external events and [durable timers](durable-functions-timers.md) to handle human interaction.

> [!div class="nextstepaction"]
> [Run the human interaction sample](durable-functions-phone-verification.md)
