---
title: Human interaction
description: Learn how to handle human interaction and timeouts in durable orchestrations with Durable Functions or Durable Task SDKs.
ms.topic: how-to
ms.date: 02/04/2026
ms.author: azfuncdf
ms.devlang: csharp
ms.custom: devx-track-js
zone_pivot_groups: azure-durable-approach
---

# Human interaction pattern

The human interaction pattern describes workflows that pause and wait for input from a person before they continue. The pattern is useful for approval workflows, multifactor authentication, and any scenario where a person responds within a time limit.

::: zone pivot="durable-functions"

This sample shows how to build a [Durable Functions](what-is-durable-task.md) orchestration that includes human interaction. The example implements an SMS based phone verification system. It's common in phone number verification and multifactor authentication (MFA) flows.

[!INCLUDE [functions-nodejs-durable-model-description](../../../includes/functions-nodejs-durable-model-description.md)]

[!INCLUDE [durable-functions-prerequisites](../../../includes/durable-functions-prerequisites.md)]

::: zone-end

::: zone pivot="durable-task-sdks"

This article shows how to implement the human interaction pattern by using the Durable Task SDKs. The example implements an approval workflow in which an orchestration waits for a person to approve or reject a request before it continues.

::: zone-end

## Scenario overview

::: zone pivot="durable-functions"

Phone verification helps confirm that people who use your app aren't spammers and that they control the phone number they provide. Multifactor authentication is a common way to protect accounts. Building your own phone verification requires a **stateful interaction** with a person. A user typically gets a code (for example, a four-digit number) and must respond **in a reasonable amount of time**.

Standard Azure Functions are stateless (like many other cloud endpoints), so this type of interaction requires you to store state in a database or another persistent store. You also split the interaction across multiple functions and coordinate them. For example, one function generates a code, stores it, and sends it to the user's phone. Another function receives the user's response and maps it to the original request to validate the code. Add a timeout to help protect security. This workflow gets complex quickly.

Durable Functions reduces the complexity of this scenario. In this sample, an orchestrator function manages the stateful interaction without an external data store. Because orchestrator functions are *durable*, these interactive flows are highly reliable.

::: zone-end

::: zone pivot="durable-task-sdks"

Approval workflows are common in business applications where a request must be reviewed by a human before proceeding. The workflow requirements are:

- **Wait indefinitely** for a human response, or until a timeout
- **Handle both approval and rejection** outcomes
- **Support timeouts** when no response is received
- **Track status** so the requester can check progress

The Durable Task SDKs simplify this scenario with:

- **External events**: The orchestration can pause and wait for an event raised by an external system or user
- **Durable timers**: Set a timeout that fires if no response is received
- **Custom status**: Track and expose the current workflow state to clients

::: zone-end

::: zone pivot="durable-functions"

## Configure Twilio integration

[!INCLUDE [functions-twilio-integration](../../../includes/functions-twilio-integration.md)]

::: zone-end

## The orchestrator and activities

::: zone pivot="durable-functions"

This article covers the following functions in the sample app:

* `E4_SmsPhoneVerification`: An [orchestrator function](durable-functions-bindings.md#orchestration-trigger) that runs the phone verification process and manages timeouts and retries.
* `E4_SendSmsChallenge`: An [activity function](durable-functions-bindings.md#activity-trigger) that sends a code by text message.

> [!NOTE]
> The `HttpStart` function in the [sample app and the quickstart](#prerequisites) acts as an [orchestration client](durable-functions-bindings.md#orchestration-client) and triggers the orchestrator function.

::: zone-end

::: zone pivot="durable-task-sdks"

This article explains the following components in the sample app:

* `ApprovalOrchestration` / `approvalOrchestrator` / `human_interaction_orchestrator`: An orchestrator that submits an approval request and waits for a human response or a timeout.
* `SubmitApprovalRequestActivity` / `submitRequest` / `submit_approval_request`: An activity that notifies a human approver, for example, by email or chat message.
* `ProcessApprovalActivity` / `processApproval` / `process_approval`: An activity that processes the approval decision.

::: zone-end

## Orchestrator

::: zone pivot="durable-functions"

### E4_SmsPhoneVerification orchestrator function

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/PhoneVerification.cs?range=17-70)]

> [!NOTE]
> It might not be obvious at first, but this orchestrator doesn't violate the [deterministic orchestration constraint](durable-functions-code-constraints.md). It's deterministic because the `CurrentUtcDateTime` property calculates the timer expiration time, and it returns the same value on every replay at this point in the orchestrator code. This behavior ensures that `winner` is the same for every repeated call to `Task.WhenAny`.

# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

The **E4_SmsPhoneVerification** function uses the standard *function.json* for orchestrator functions.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E4_SmsPhoneVerification/function.json":::

Here's the code that implements the function:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E4_SmsPhoneVerification/index.js":::

> [!NOTE]
> It might not be obvious at first, but this orchestrator doesn't violate the [deterministic orchestration constraint](durable-functions-code-constraints.md). It's deterministic because the `currentUtcDateTime` property calculates the timer expiration time, and it returns the same value on every replay at this point in the orchestrator code. This behavior ensures that `winner` is the same for every repeated call to `context.df.Task.any`.

</details>

<br>

<details>
<summary><b>V4 programming model</b></summary>

Here's the code that implements the `smsPhoneVerification` orchestration function:

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/smsPhoneVerification.js" range="2-43":::

</details>

# [Python](#tab/python)

The **E4_SmsPhoneVerification** function uses the standard *function.json* for orchestrator functions.

[!code-json[Main](~/samples-durable-functions-python/samples/human_interaction/E4_SmsPhoneVerification/function.json)]

Here's the code that implements the function:

[!code-python[Main](~/samples-durable-functions-python/samples/human_interaction/E4_SmsPhoneVerification/\_\_init\_\_.py)]

> [!NOTE]
> It may not be obvious at first, but this orchestrator does not violate the [deterministic orchestration constraint](durable-functions-code-constraints.md). It is deterministic because the `currentUtcDateTime` property is used to calculate the timer expiration time, and it returns the same value on every replay at this point in the orchestrator code. This behavior is important to ensure that the same `winner` results from every repeated call to `context.df.Task.any`.

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

Once started, this orchestrator function does the following:

1. Gets a phone number to send the SMS notification to.
1. Calls **E4_SendSmsChallenge** to send an SMS message to the user and returns the expected four-digit challenge code.
1. Creates a durable timer that triggers 90 seconds after the current time.
1. In parallel with the timer, waits for an **SmsChallengeResponse** event from the user.


The user receives an SMS message with a four-digit code. They have 90 seconds to send the same code to the orchestrator instance to complete verification. If they submit the wrong code, they get three more tries within the same 90-second window.

> [!WARNING]
> [Cancel timers](durable-functions-timers.md) you no longer need. In the example above, the orchestration cancels the timer when it accepts a challenge response.

::: zone-end

::: zone pivot="durable-task-sdks"

The orchestrator submits an approval request, then waits for either a human response or a timeout.

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;
using System;
using System.Threading;
using System.Threading.Tasks;

[DurableTask(nameof(ApprovalOrchestration))]
public class ApprovalOrchestration : TaskOrchestrator<ApprovalRequestData, ApprovalResult>
{
    public override async Task<ApprovalResult> RunAsync(
        TaskOrchestrationContext context, ApprovalRequestData input)
    {
        string requestId = input.RequestId;
        double timeoutHours = input.TimeoutHours;

        // Step 1: Submit the approval request (notify approver)
        SubmissionResult submissionResult = await context.CallActivityAsync<SubmissionResult>(
            nameof(SubmitApprovalRequestActivity), input);

        // Make the status available via custom status
        context.SetCustomStatus(submissionResult);

        // Step 2: Create a durable timer for the timeout
        DateTime timeoutDeadline = context.CurrentUtcDateTime.AddHours(timeoutHours);

        using var timeoutCts = new CancellationTokenSource();
        Task timeoutTask = context.CreateTimer(timeoutDeadline, timeoutCts.Token);

        // Step 3: Wait for an external event (approval/rejection)
        Task<ApprovalResponseData> approvalTask = context.WaitForExternalEvent<ApprovalResponseData>(
            "approval_response");

        // Step 4: Wait for either the timeout or the approval response
        Task completedTask = await Task.WhenAny(approvalTask, timeoutTask);

        // Step 5: Process based on which task completed
        ApprovalResult result;

        if (completedTask == approvalTask)
        {
            // Human responded in time - cancel the timeout timer
            timeoutCts.Cancel();

            ApprovalResponseData approvalData = approvalTask.Result;

            // Process the approval
            result = await context.CallActivityAsync<ApprovalResult>(
                nameof(ProcessApprovalActivity),
                new ProcessApprovalInput
                {
                    RequestId = requestId,
                    IsApproved = approvalData.IsApproved,
                    Approver = approvalData.Approver
                });
        }
        else
        {
            // Timeout occurred
            result = new ApprovalResult
            {
                RequestId = requestId,
                Status = "Timeout",
                ProcessedAt = context.CurrentUtcDateTime.ToString("o")
            };
        }

        return result;
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import {
  OrchestrationContext,
  TOrchestrator,
  whenAny,
} from "@microsoft/durabletask-js";

const approvalOrchestrator: TOrchestrator = async function* (
  ctx: OrchestrationContext,
  amount: number
): any {
  // Step 1: Submit the request
  const requestId: string = yield ctx.callActivity(submitRequest, { amount });

  ctx.setCustomStatus({ stage: "Awaiting approval", requestId });

  // Step 2: Race external event vs timer
  const approvalEvent = ctx.waitForExternalEvent<{ approved: boolean }>(
    "approval"
  );
  const timeout = ctx.createTimer(5); // 5-second timeout

  const winner = yield whenAny([approvalEvent, timeout]);

  let result: string;
  if (winner === approvalEvent) {
    // Human responded in time
    const decision = approvalEvent.getResult();
    ctx.setCustomStatus({
      stage: "Processing",
      requestId,
      approved: decision.approved,
    });
    result = yield ctx.callActivity(processApproval, {
      requestId,
      approved: decision.approved,
    });
  } else {
    // Timer fired first — timed out
    ctx.setCustomStatus({ stage: "Timed out", requestId });
    result = yield ctx.callActivity(notifyTimeout, requestId);
  }

  ctx.setCustomStatus({ stage: "Completed", requestId });
  return result;
};
```

# [Python](#tab/python)

```python
import datetime
from durabletask import task

def human_interaction_orchestrator(ctx: task.OrchestrationContext, input_data: dict) -> dict:
    """
    Orchestrator that demonstrates the human interaction pattern.

    Submits an approval request, then waits for a human to approve or reject.
    """
    request_id = input_data.get("request_id")
    timeout_hours = input_data.get("timeout_hours", 24)

    # Step 1: Submit the approval request (notify approver)
    request_data = {
        "request_id": request_id,
        "requester": input_data.get("requester"),
        "item": input_data.get("item")
    }

    submission_result = yield ctx.call_activity("submit_approval_request", input=request_data)

    # Make the status available via custom status
    ctx.set_custom_status(submission_result)

    # Step 2: Create a durable timer for the timeout
    timeout_deadline = ctx.current_utc_datetime + datetime.timedelta(hours=timeout_hours)
    timeout_task = ctx.create_timer(timeout_deadline)

    # Step 3: Wait for an external event (approval/rejection)
    approval_task = ctx.wait_for_external_event("approval_response")

    # Step 4: Wait for either the timeout or the approval response
    winner_task = yield task.when_any([approval_task, timeout_task])

    # Step 5: Process based on which task completed
    if winner_task == approval_task:
        # Human responded in time
        approval_data = yield approval_task

        # Process the approval
        result = yield ctx.call_activity("process_approval", input={
            "request_id": request_id,
            "is_approved": approval_data.get("is_approved", False),
            "approver": approval_data.get("approver", "Unknown")
        })
    else:
        # Timeout occurred
        result = {
            "request_id": request_id,
            "status": "Timeout",
            "timed_out_at": ctx.current_utc_datetime.isoformat()
        }

    return result
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

```java
import com.microsoft.durabletask.*;
import com.microsoft.durabletask.azuremanaged.DurableTaskSchedulerWorkerExtensions;
import java.time.Duration;

DurableTaskGrpcWorker worker = DurableTaskSchedulerWorkerExtensions.createWorkerBuilder(connectionString)
    .addOrchestration(new TaskOrchestrationFactory() {
        @Override
        public String getName() { return "ApprovalWorkflow"; }

        @Override
        public TaskOrchestration create() {
            return ctx -> {
                // Get the approval request
                ApprovalRequest request = ctx.getInput(ApprovalRequest.class);

                // Set initial status
                ctx.setCustomStatus(new WorkflowStatus("Waiting for approval", null));

                // Create a timeout timer
                Task timeoutTask = ctx.createTimer(
                    Duration.ofHours((long) request.timeoutHours));

                // Wait for external event (approval response)
                Task<ApprovalResponse> approvalTask = ctx.waitForExternalEvent(
                    "approval_response", ApprovalResponse.class);

                // Wait for either approval or timeout
                Task<?> winner = ctx.anyOf(approvalTask, timeoutTask).await();

                if (winner == approvalTask) {
                    // Human responded in time
                    ApprovalResponse response = approvalTask.await();
                    String status = response.isApproved ? "APPROVED" : "REJECTED";
                    ctx.setCustomStatus(new WorkflowStatus(status, response));
                    ctx.complete(new WorkflowResult(
                        status,
                        response.isApproved ? "Request approved" : "Request rejected"));
                } else {
                    // Timeout occurred
                    ctx.setCustomStatus(new WorkflowStatus("Timed out", null));
                    ctx.complete(new WorkflowResult("TIMEOUT", "Request timed out"));
                }
            };
        }
    })
    .build();
```

---

This orchestrator performs the following actions:

1. Submits the approval request by calling an activity that notifies the approver.
1. Sets the custom status so clients can track progress.
1. Creates a durable timer for the timeout deadline.
1. Waits for an external event (`approval_response`) that the approver raises.
1. Uses `WhenAny`, `when_any`, or `anyOf` to wait for whichever completes first: the approval or the timeout.
1. Processes the result based on which task completes.


> [!WARNING]
> Cancel timers you no longer need. In the C# example, the orchestration cancels the timeout timer when it receives approval.

::: zone-end

## Activities

::: zone pivot="durable-functions"

### E4_SendSmsChallenge activity function

The **E4_SendSmsChallenge** function uses the Twilio binding to send an SMS message that includes a four-digit code to the user.

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/PhoneVerification.cs?range=72-89)]

> [!NOTE]
> To run the sample, install the `Microsoft.Azure.WebJobs.Extensions.Twilio` NuGet package. Don't install the main [Twilio NuGet package](https://www.nuget.org/packages/Twilio/) because it can cause version conflicts and build errors.

# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

The *function.json* file is defined like this:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E4_SendSmsChallenge/function.json":::

This code generates the four-digit challenge code and sends the SMS message:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E4_SendSmsChallenge/index.js":::

</details>

<br>

<details>
<summary><b>V4 programming model</b></summary>

Here's the code that generates the four-digit challenge code and sends the SMS message:

:::code language="javascript" source="~/azure-functions-durable-js-v3/samples-js/functions/smsPhoneVerification.js" range="1-2,4-6,45-67":::

</details>

# [Python](#tab/python)

The *function.json* file is defined like this:

[!code-json[Main](~/samples-durable-functions-python/samples/human_interaction/SendSMSChallenge/function.json)]

This code generates the four-digit challenge code and sends the SMS message:

[!code-python[Main](~/samples-durable-functions-python/samples/human_interaction/SendSMSChallenge/\_\_init\_\_.py)]

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

::: zone-end

::: zone pivot="durable-task-sdks"

The activities submit the approval request and process the response.

### Submit approval request activity

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

[DurableTask(nameof(SubmitApprovalRequestActivity))]
public class SubmitApprovalRequestActivity : TaskActivity<ApprovalRequestData, SubmissionResult>
{
    private readonly ILogger<SubmitApprovalRequestActivity> _logger;

    public SubmitApprovalRequestActivity(ILogger<SubmitApprovalRequestActivity> logger)
    {
        _logger = logger;
    }

    public override Task<SubmissionResult> RunAsync(
        TaskActivityContext context, ApprovalRequestData input)
    {
        _logger.LogInformation(
            "Submitting approval request {RequestId} from {Requester} for {Item}",
            input.RequestId, input.Requester, input.Item);

        // In a real system, this would send an email, notification, or update a database
        var result = new SubmissionResult
        {
            RequestId = input.RequestId,
            Status = "Pending",
            SubmittedAt = DateTime.UtcNow.ToString("o"),
            ApprovalUrl = $"http://localhost:8000/api/approvals/{input.RequestId}"
        };

        return Task.FromResult(result);
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext } from "@microsoft/durabletask-js";

const submitRequest = async (
  _ctx: ActivityContext,
  request: { amount: number }
): Promise<string> => {
  console.log(
    `[submitRequest] Purchase request submitted: $${request.amount}`
  );
  return `REQ-${Date.now()}`;
};
```

# [Python](#tab/python)

```python
import datetime
from durabletask import task

def submit_approval_request(ctx: task.ActivityContext, request_data: dict) -> dict:
    """
    Activity that submits an approval request.
    In a real application, this would notify a human approver via email, message, etc.
    """
    request_id = request_data.get("request_id")
    requester = request_data.get("requester")
    item = request_data.get("item")

    # In a real system, this would send an email, notification, or update a database
    return {
        "request_id": request_id,
        "status": "Pending",
        "submitted_at": datetime.datetime.now().isoformat(),
        "approval_url": f"http://localhost:8000/api/approvals/{request_id}"
    }
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

The Java sample submits the approval request inline. For a production app, create a separate activity:

```java
.addActivity(new TaskActivityFactory() {
    @Override
    public String getName() { return "SubmitApprovalRequest"; }

    @Override
    public TaskActivity create() {
        return ctx -> {
            ApprovalRequest request = ctx.getInput(ApprovalRequest.class);

            // In a real system, send email/notification
            logger.info("Submitting approval request for " + request.item);

            return new SubmissionResult(
                "Pending",
                Instant.now().toString(),
                "http://localhost:8000/api/approvals/" + request.requester);
        };
    }
})
```

---

### Process approval activity

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

[DurableTask(nameof(ProcessApprovalActivity))]
public class ProcessApprovalActivity : TaskActivity<ProcessApprovalInput, ApprovalResult>
{
    private readonly ILogger<ProcessApprovalActivity> _logger;

    public ProcessApprovalActivity(ILogger<ProcessApprovalActivity> logger)
    {
        _logger = logger;
    }

    public override Task<ApprovalResult> RunAsync(
        TaskActivityContext context, ProcessApprovalInput input)
    {
        string status = input.IsApproved ? "Approved" : "Rejected";
        _logger.LogInformation(
            "Processing {Status} request {RequestId} by {Approver}",
            status, input.RequestId, input.Approver);

        // In a real system, this would update a database, trigger workflows, etc.
        var result = new ApprovalResult
        {
            RequestId = input.RequestId,
            Status = status,
            ProcessedAt = DateTime.UtcNow.ToString("o"),
            Approver = input.Approver
        };

        return Task.FromResult(result);
    }
}

// Data classes
public class ApprovalRequestData
{
    public string RequestId { get; set; } = string.Empty;
    public string Requester { get; set; } = string.Empty;
    public string Item { get; set; } = string.Empty;
    public double TimeoutHours { get; set; } = 24.0;
}

public class ApprovalResponseData
{
    public bool IsApproved { get; set; }
    public string Approver { get; set; } = string.Empty;
}

public class SubmissionResult
{
    public string RequestId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string SubmittedAt { get; set; } = string.Empty;
    public string ApprovalUrl { get; set; } = string.Empty;
}

public class ProcessApprovalInput
{
    public string RequestId { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public string Approver { get; set; } = string.Empty;
}

public class ApprovalResult
{
    public string RequestId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ProcessedAt { get; set; } = string.Empty;
    public string? Approver { get; set; }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext } from "@microsoft/durabletask-js";

const processApproval = async (
  _ctx: ActivityContext,
  data: { requestId: string; approved: boolean }
): Promise<string> => {
  console.log(
    `[processApproval] Request ${data.requestId}: ${
      data.approved ? "APPROVED" : "REJECTED"
    }`
  );
  return data.approved ? "Order placed" : "Order cancelled";
};

const notifyTimeout = async (
  _ctx: ActivityContext,
  requestId: string
): Promise<string> => {
  console.log(
    `[notifyTimeout] Request ${requestId} timed out — auto-rejected`
  );
  return "Timed out — auto-rejected";
};
```

# [Python](#tab/python)

```python
import datetime
from durabletask import task

def process_approval(ctx: task.ActivityContext, approval_data: dict) -> dict:
    """
    Activity that processes the approval once received.
    """
    request_id = approval_data.get("request_id")
    is_approved = approval_data.get("is_approved")
    approver = approval_data.get("approver")

    status = "Approved" if is_approved else "Rejected"

    # In a real system, this would update a database, trigger workflows, etc.
    return {
        "request_id": request_id,
        "status": status,
        "processed_at": datetime.datetime.now().isoformat(),
        "approver": approver
    }
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

The Java sample processes approvals inline in the orchestrator. For a production app, create a separate activity.

---

::: zone-end

## Run the sample

::: zone pivot="durable-functions"

Use the HTTP-triggered functions in the sample to start the orchestration by sending the following HTTP POST request:

```
POST http://{host}/orchestrators/E4_SmsPhoneVerification
Content-Length: 14
Content-Type: application/json

"+1425XXXXXXX"
```

```
HTTP/1.1 202 Accepted
Content-Length: 695
Content-Type: application/json; charset=utf-8
Location: http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

{"id":"741c65651d4c40cea29acdd5bb47baf1","statusQueryGetUri":"http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}","sendEventPostUri":"http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}","terminatePostUri":"http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1/terminate?reason={text}&taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}"}
```

The orchestrator function receives the phone number and immediately sends an SMS message to that number with a randomly generated 4-digit verification code—for example, `2168`. The function then waits 90 seconds for a response.

To reply with the code, use [`RaiseEventAsync` (.NET) or `raiseEvent` (JavaScript and TypeScript)](durable-functions-instance-management.md) in another function, or call the **sendEventPostUri** HTTP POST endpoint in the 202 response. Replace `{eventName}` with `SmsChallengeResponse`:

```
POST http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1/raiseEvent/SmsChallengeResponse?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
Content-Length: 4
Content-Type: application/json

2168
```

If you send the event before the timer expires, the orchestration completes, and the `output` field is set to `true`, which indicates successful verification.

```
GET http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
```

```
HTTP/1.1 200 OK
Content-Length: 144
Content-Type: application/json; charset=utf-8

{"runtimeStatus":"Completed","input":"+1425XXXXXXX","output":true,"createdTime":"2017-06-29T19:10:49Z","lastUpdatedTime":"2017-06-29T19:12:23Z"}
```

If the timer expires or you enter the wrong code four times, query the status to see `output` set to `false`, which indicates that phone verification failed.

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 145

{"runtimeStatus":"Completed","input":"+1425XXXXXXX","output":false,"createdTime":"2017-06-29T19:20:49Z","lastUpdatedTime":"2017-06-29T19:22:23Z"}
```

::: zone-end

::: zone pivot="durable-task-sdks"

To run the sample:

1. **Start the Durable Task Scheduler emulator** for local development.

   ```bash
   docker run -d -p 8080:8080 -p 8082:8082 --name dts-emulator mcr.microsoft.com/dts/dts-emulator:latest
   ```

1. **Start the worker** to register the orchestrator and activities.

1. **Run the client** to schedule an approval workflow and send events.

# [C#](#tab/csharp)

```csharp
using System;
using System.Threading.Tasks;

var client = DurableTaskClientBuilder.UseDurableTaskScheduler(connectionString).Build();

// Schedule the approval workflow
var input = new ApprovalRequestData
{
    RequestId = "request-" + Guid.NewGuid().ToString(),
    Requester = "john.doe@example.com",
    Item = "Vacation Request - 5 days",
    TimeoutHours = 24
};

string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
    nameof(ApprovalOrchestration), input);

Console.WriteLine($"Started approval workflow: {instanceId}");

// Simulate human approving the request
Console.WriteLine("Simulating approval...");
await Task.Delay(2000);

// Raise the approval event
var approvalResponse = new ApprovalResponseData
{
    IsApproved = true,
    Approver = "manager@example.com"
};

await client.RaiseEventAsync(instanceId, "approval_response", approvalResponse);

// Wait for completion
var result = await client.WaitForInstanceCompletionAsync(instanceId, getInputsAndOutputs: true);
Console.WriteLine($"Result: {result.ReadOutputAs<ApprovalResult>().Status}");
```

# [JavaScript](#tab/javascript)

```typescript
import {
  DurableTaskAzureManagedClientBuilder,
  DurableTaskAzureManagedWorkerBuilder,
} from "@microsoft/durabletask-js-azuremanaged";

const client = new DurableTaskAzureManagedClientBuilder()
  .connectionString(connectionString)
  .build();

const worker = new DurableTaskAzureManagedWorkerBuilder()
  .connectionString(connectionString)
  .addOrchestrator(approvalOrchestrator)
  .addActivity(submitRequest)
  .addActivity(processApproval)
  .addActivity(notifyTimeout)
  .build();

await worker.start();

// Schedule the approval workflow
const approvalId = await client.scheduleNewOrchestration(
  approvalOrchestrator,
  500 // amount
);

console.log(`Orchestration started: ${approvalId}`);

// Wait for it to reach "Awaiting approval", then send approval
await new Promise((r) => setTimeout(r, 3000));

await client.raiseOrchestrationEvent(approvalId, "approval", {
  approved: true,
});
console.log("Sent approval event");

const result = await client.waitForOrchestrationCompletion(
  approvalId,
  true,
  60
);
console.log(`Result: ${result?.serializedOutput}`);

await worker.stop();
await client.stop();
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient
import time
import uuid

client = DurableTaskSchedulerClient(
    host_address=endpoint,
    secure_channel=endpoint != "http://localhost:8080",
    taskhub=taskhub,
    token_credential=credential
)

# Schedule the approval workflow
input_data = {
    "request_id": f"request-{uuid.uuid4()}",
    "requester": "john.doe@example.com",
    "item": "Vacation Request - 5 days",
    "timeout_hours": 24
}

instance_id = client.schedule_new_orchestration(
    human_interaction_orchestrator,
    input=input_data
)

print(f"Started approval workflow: {instance_id}")

# Simulate human approving the request
print("Simulating approval...")
time.sleep(2)

# Raise the approval event
approval_response = {
    "is_approved": True,
    "approver": "manager@example.com"
}

client.raise_orchestration_event(instance_id, "approval_response", data=approval_response)

# Wait for completion
result = client.wait_for_orchestration_completion(instance_id, timeout=60)
print(f"Result: {result.serialized_output}")
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

```java
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

DurableTaskClient client = DurableTaskSchedulerClientExtensions
    .createClientBuilder(connectionString).build();

// Schedule the approval workflow
ApprovalRequest request = new ApprovalRequest(
    "john.doe@example.com",
    "Vacation Request - 5 days",
    24  // timeout hours
);

String instanceId = client.scheduleNewOrchestrationInstance(
    "ApprovalWorkflow",
    new NewOrchestrationInstanceOptions()
        .setInput(request)
        .setInstanceId("request-" + UUID.randomUUID().toString()));

System.out.println("Started approval workflow: " + instanceId);

// Simulate human approving the request
System.out.println("Simulating approval...");
Thread.sleep(2000);

// Raise the approval event
ApprovalResponse response = new ApprovalResponse(
    true,  // isApproved
    "manager@example.com",
    "Approved",
    Instant.now().toString()
);

client.raiseEvent(instanceId, "approval_response", response);

// Wait for completion
OrchestrationMetadata result = client.waitForInstanceCompletion(
    instanceId, Duration.ofSeconds(60), true);

System.out.println("Result: " + result.readOutputAs(WorkflowResult.class).status);
```

---

::: zone-end

## Next steps

::: zone pivot="durable-functions"

This sample demonstrates advanced Durable Functions capabilities, including the `WaitForExternalEvent` and `CreateTimer` APIs. It shows how to combine `Task.WhenAny` (C#), `context.df.Task.any` (JavaScript and TypeScript), or `context.task_any` (Python) to implement a reliable timeout pattern for workflows that wait for people to respond. Learn more about Durable Functions in a series of articles that cover specific topics.

> [!div class="nextstepaction"]
> [Read the first article in the series](durable-functions-bindings.md)

::: zone-end

::: zone pivot="durable-task-sdks"

This sample shows how to use the Durable Task SDKs to implement workflows that wait for people to respond, with configurable timeouts. Key concepts:

- **External events**: Using `WaitForExternalEvent` to wait for input
- **Durable timers**: Using `CreateTimer` to implement timeouts
- **Racing tasks**: Using `WhenAny`, `when_any`, or `anyOf` to handle whichever task completes first

- [Durable Task JavaScript SDK on GitHub](https://github.com/microsoft/durabletask-js)

> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](durable-task-scheduler/quickstart-portable-durable-task-sdks.md)

::: zone-end
