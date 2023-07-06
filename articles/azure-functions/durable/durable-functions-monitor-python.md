---
title: Monitors in Durable Functions (Python) - Azure
description: Learn how to implement a status monitor using the Durable Functions extension for Azure Functions (Python).
author: davidmrdavid
ms.topic: conceptual
ms.date: 12/02/2020
ms.author: azfuncdf
ms.devlang: python
ms.custom: devx-track-python
---

# Monitor scenario in Durable Functions - GitHub Issue monitoring sample

The monitor pattern refers to a flexible recurring process in a workflow - for example, polling until certain conditions are met. This article explains a sample that uses Durable Functions to implement monitoring.

## Prerequisites

* [Complete the quickstart article](quickstart-python-vscode.md)
* [Clone or download the samples project from GitHub](https://github.com/Azure/azure-functions-durable-python/tree/main/samples/)


## Scenario overview

This sample monitors the count of issues in a GitHub repo and alerts the user if there are more than 3 open issues. You could use a regular timer-triggered function to request the opened issue counts at regular intervals. However, one problem with this approach is **lifetime management**. If only one alert should be sent, the monitor needs to disable itself after 3 or more issues are detected. The monitoring pattern can end its own execution, among other benefits:

* Monitors run on intervals, not schedules: a timer trigger *runs* every hour; a monitor *waits* one hour between actions. A monitor's actions will not overlap unless specified, which can be important for long-running tasks.
* Monitors can have dynamic intervals: the wait time can change based on some condition.
* Monitors can terminate when some condition is met or be terminated by another process.
* Monitors can take parameters. The sample shows how the same repo-monitoring process can be applied to any requested public GitHub repo and phone number.
* Monitors are scalable. Because each monitor is an orchestration instance, multiple monitors can be created without having to create new functions or define more code.
* Monitors integrate easily into larger workflows. A monitor can be one section of a more complex orchestration function, or a [sub-orchestration](durable-functions-sub-orchestrations.md).

## Configuration

### Configuring Twilio integration

[!INCLUDE [functions-twilio-integration](../../../includes/functions-twilio-integration.md)]

## The functions

This article explains the following functions in the sample app:

* `E3_Monitor`: An [orchestrator function](durable-functions-bindings.md#orchestration-trigger) that calls `E3_TooManyOpenIssues` periodically. It calls `E3_SendAlert` if the return value of `E3_TooManyOpenIssues` is `True`.
* `E3_TooManyOpenIssues`: An [activity function](durable-functions-bindings.md#activity-trigger) that checks if a repository has too many open issues. For demoing purposes, we consider having more than 3 open issues to be too many.
* `E3_SendAlert`: An activity function that sends an SMS message via Twilio.

### E3_Monitor orchestrator function


The **E3_Monitor** function uses the standard *function.json* for orchestrator functions.

[!code-json[Main](~/samples-durable-functions-python/samples/monitor/E3_Monitor/function.json)]

Here is the code that implements the function:

[!code-python[Main](~/samples-durable-functions-python/samples/monitor/E3_Monitor/\_\_init\_\_.py)]


This orchestrator function performs the following actions:

1. Gets the *repo* to monitor and the *phone number* to which it will send an SMS notification.
2. Determines the expiration time of the monitor. The sample uses a hard-coded value for brevity.
3. Calls **E3_TooManyOpenIssues** to determine whether there are too many open issues at the requested repo.
4. If there are too many issues, calls **E3_SendAlert** to send an SMS notification to the requested phone number.
5. Creates a durable timer to resume the orchestration at the next polling interval. The sample uses a hard-coded value for brevity.
6. Continues running until the current UTC time passes the monitor's expiration time, or an SMS alert is sent.

Multiple orchestrator instances can run simultaneously by calling the orchestrator function multiple times. The repo to monitor and the phone number to send an SMS alert to can be specified. Finally, do note that the orchestrator function is *not* running while waiting for the timer, so you will not get charged for it.


### E3_TooManyOpenIssues activity function

As with other samples, the helper activity functions are regular functions that use the `activityTrigger` trigger binding. The **E3_TooManyOpenIssues** function gets a list of currently open issues on the repo and determines if there are "too many" of them: more than 3 as per our sample.


The *function.json* is defined as follows:

[!code-json[Main](~/samples-durable-functions-python/samples/monitor/E3_TooManyOpenIssues/function.json)]

And here is the implementation.

[!code-python[Main](~/samples-durable-functions-python/samples/monitor/E3_TooManyOpenIssues/\_\_init\_\_.py)]


### E3_SendAlert activity function

The **E3_SendAlert** function uses the Twilio binding to send an SMS message notifying the end user that there are at least 3 open issues awaiting a resolution.


Its *function.json* is simple:

[!code-json[Main](~/samples-durable-functions-python/samples/monitor/E3_TooManyOpenIssues/function.json)]

And here is the code that sends the SMS message:

[!code-python[Main](~/samples-durable-functions-python/samples/monitor/E3_SendAlert/\_\_init\_\_.py)]


## Run the sample

You will need a [GitHub](https://github.com/) account. With it, create a temporary public repository that you can open issues to.

Using the HTTP-triggered functions included in the sample, you can start the orchestration by sending the following HTTP POST request:

```
POST https://{host}/orchestrators/E3_Monitor
Content-Length: 77
Content-Type: application/json

{ "repo": "<your GitHub handle>/<a new GitHub repo under your user>", "phone": "+1425XXXXXXX" }
```

For example, if your GitHub username is `foo` and your repository is `bar` then your value for `"repo"` should be `"foo/bar"`.

```
HTTP/1.1 202 Accepted
Content-Type: application/json; charset=utf-8
Location: https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635?taskHub=SampleHubVS&connection=Storage&code={SystemKey}
RetryAfter: 10

{"id": "f6893f25acf64df2ab53a35c09d52635", "statusQueryGetUri": "https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635?taskHub=SampleHubVS&connection=Storage&code={systemKey}", "sendEventPostUri": "https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635/raiseEvent/{eventName}?taskHub=SampleHubVS&connection=Storage&code={systemKey}", "terminatePostUri": "https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635/terminate?reason={text}&taskHub=SampleHubVS&connection=Storage&code={systemKey}"}
```

The **E3_Monitor** instance starts and queries the provided repo for open issues. If at least 3 open issues are found, it calls an activity function to send an alert; otherwise, it sets a timer. When the timer expires, the orchestration will resume.

You can see the orchestration's activity by looking at the function logs in the Azure Functions portal.

```
[2020-12-04T18:24:30.007Z] Executing 'Functions.HttpStart' (Reason='This function was programmatically 
called via the host APIs.', Id=93772f6b-f4f0-405a-9d7b-be9eb7a38aa6)
[2020-12-04T18:24:30.769Z] Executing 'Functions.E3_Monitor' (Reason='(null)', Id=058e656e-bcb1-418c-95b3-49afcd07bd08)
[2020-12-04T18:24:30.847Z] Started orchestration with ID = '788420bb31754c50acbbc46e12ef4f9c'.
[2020-12-04T18:24:30.932Z] Executed 'Functions.E3_Monitor' (Succeeded, Id=058e656e-bcb1-418c-95b3-49afcd07bd08, Duration=174ms)
[2020-12-04T18:24:30.955Z] Executed 'Functions.HttpStart' (Succeeded, Id=93772f6b-f4f0-405a-9d7b-be9eb7a38aa6, Duration=1028ms)
[2020-12-04T18:24:31.229Z] Executing 'Functions.E3_TooManyOpenIssues' (Reason='(null)', Id=6fd5be5e-7f26-4b0b-98df-c3ac39125da3)
[2020-12-04T18:24:31.772Z] Executed 'Functions.E3_TooManyOpenIssues' (Succeeded, Id=6fd5be5e-7f26-4b0b-98df-c3ac39125da3, Duration=555ms)
[2020-12-04T18:24:40.754Z] Executing 'Functions.E3_Monitor' (Reason='(null)', Id=23915e4c-ddbf-46f9-b3f0-53289ed66082)
[2020-12-04T18:24:40.789Z] Executed 'Functions.E3_Monitor' (Succeeded, Id=23915e4c-ddbf-46f9-b3f0-53289ed66082, Duration=38ms)
(...trimmed...)
```

The orchestration will complete once its timeout is reached or more than 3 open issues are detected. You can also use the `terminate` API inside another function or invoke the **terminatePostUri** HTTP POST webhook referenced in the 202 response above. To use the webhook, replace `{text}` with the reason for the early termination. The HTTP POST URL will look roughly as follows:

```
POST https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635/terminate?reason=Because&taskHub=SampleHubVS&connection=Storage&code={systemKey}
```

## Next steps

This sample has demonstrated how to use Durable Functions to monitor an external source's status using [durable timers](durable-functions-timers.md) and conditional logic. The next sample shows how to use external events and [durable timers](durable-functions-timers.md) to handle human interaction.

> [!div class="nextstepaction"]
> [Run the human interaction sample](durable-functions-phone-verification.md)
