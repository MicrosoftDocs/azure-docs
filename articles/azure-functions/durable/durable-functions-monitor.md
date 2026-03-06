---
title: Monitors in Durable Functions - Azure
description: Learn how to implement a status monitor using Durable Functions or Durable Task SDKs.
ms.topic: conceptual
ms.custom: devx-track-js, devx-track-python
ms.date: 02/04/2026
ms.author: azfuncdf
zone_pivot_groups: azure-durable-approach
---

# Monitor scenario

The monitor pattern refers to a flexible *recurring* process in a workflow - for example, polling until certain conditions are met. This article explains how to implement monitoring using durable orchestrations.

::: zone pivot="durable-functions"

This sample uses [Durable Functions](what-is-durable-task.md) to implement monitoring. The examples include a weather monitoring scenario (C#/JavaScript) and a GitHub issue monitoring scenario (Python).

[!INCLUDE [functions-nodejs-durable-model-description](../../../includes/functions-nodejs-durable-model-description.md)]

::: zone-end

::: zone pivot="durable-task-sdks"

This article explains how to implement the monitor pattern using the Durable Task SDKs for .NET, JavaScript, Python, and Java. The example demonstrates job status monitoring with configurable polling intervals.

::: zone-end

## Prerequisites

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

* [Complete the quickstart article](durable-functions-isolated-create-first-csharp.md)
* [Clone or download the samples project from GitHub](https://github.com/Azure/azure-functions-durable-extension/tree/main/samples/precompiled)

# [JavaScript](#tab/javascript)

* [Complete the quickstart article](quickstart-js-vscode.md)
* [Clone or download the samples project from GitHub](https://github.com/Azure/azure-functions-durable-js/tree/main/samples)

# [Python](#tab/python)

* [Complete the quickstart article](quickstart-python-vscode.md)
* [Clone or download the samples project from GitHub](https://github.com/Azure/azure-functions-durable-python/tree/main/samples/)

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

* .NET 8.0 SDK or later
* Access to Azure Durable Task Scheduler or the local emulator

# [JavaScript](#tab/javascript)

* Node.js 22 or later
* Access to Azure Durable Task Scheduler or the local emulator

# [Python](#tab/python)

* Python 3.9 or later
* Access to Azure Durable Task Scheduler or the local emulator

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

* Java 11 or later
* Access to Azure Durable Task Scheduler or the local emulator

---

::: zone-end

## Scenario overview

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

This sample monitors a location's current weather conditions and alerts a user by SMS when the skies are clear. You could use a regular timer-triggered function to check the weather and send alerts. However, one problem with this approach is **lifetime management**. If only one alert should be sent, the monitor needs to disable itself after clear weather is detected.

# [JavaScript](#tab/javascript)

This sample monitors a location's current weather conditions and alerts a user by SMS when the skies are clear. You could use a regular timer-triggered function to check the weather and send alerts. However, one problem with this approach is **lifetime management**. If only one alert should be sent, the monitor needs to disable itself after clear weather is detected.

# [Python](#tab/python)

This sample monitors the count of issues in a GitHub repo and alerts the user if there are more than 3 open issues. You could use a regular timer-triggered function to request the opened issue counts at regular intervals. However, one problem with this approach is **lifetime management**. If only one alert should be sent, the monitor needs to disable itself after 3 or more issues are detected.

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

The monitoring pattern can end its own execution, among other benefits:

* Monitors run on intervals, not schedules: a timer trigger *runs* every hour; a monitor *waits* one hour between actions. A monitor's actions won't overlap unless specified, which can be important for long-running tasks.
* Monitors can have dynamic intervals: the wait time can change based on some condition.
* Monitors can terminate when some condition is met or be terminated by another process.
* Monitors can take parameters. The sample shows how the same monitoring process can be applied to any requested location, phone number, or repository.
* Monitors are scalable. Because each monitor is an orchestration instance, multiple monitors can be created without having to create new functions or define more code.
* Monitors integrate easily into larger workflows. A monitor can be one section of a more complex orchestration function, or a [sub-orchestration](durable-functions-sub-orchestrations.md).

::: zone-end

::: zone pivot="durable-task-sdks"

This sample monitors the status of a long-running job and returns the final result when the job completes or times out. You could use a regular polling loop to check job status, but this approach has limitations around **lifetime management** and **reliability**.

The monitoring pattern provides these benefits:

* **Durable polling**: The orchestration survives process restarts and can continue monitoring even after failures.
* **Configurable intervals**: The wait time between status checks can be adjusted dynamically.
* **Timeout support**: The monitor can terminate when a condition is met or a timeout expires.
* **Status visibility**: Clients can query the orchestration's custom status to see current monitoring progress.
* **Scalability**: Multiple monitors can run concurrently, each tracking different jobs.

::: zone-end

::: zone pivot="durable-functions"

## Configuration

# [C#](#tab/csharp)

### Configuring Twilio integration

[!INCLUDE [functions-twilio-integration](../../../includes/functions-twilio-integration.md)]

### Configuring Weather Underground integration

This sample involves using the Weather Underground API to check current weather conditions for a location.

The first thing you need is a Weather Underground account. You can create one for free at [https://www.wunderground.com/signup](https://www.wunderground.com/signup). Once you have an account, you need to acquire an API key. You can do so by visiting [https://www.wunderground.com/weather/api](https://www.wunderground.com/weather/api/?MR=1), then selecting Key Settings. The Stratus Developer plan is free and sufficient to run this sample.

Once you have an API key, add the following **app setting** to your function app.

| App setting name | Value description |
| - | - |
| **WeatherUndergroundApiKey**  | Your Weather Underground API key. |

# [JavaScript](#tab/javascript)

### Configuring Twilio integration

[!INCLUDE [functions-twilio-integration](../../../includes/functions-twilio-integration.md)]

### Configuring Weather Underground integration

This sample involves using the Weather Underground API to check current weather conditions for a location.

The first thing you need is a Weather Underground account. You can create one for free at [https://www.wunderground.com/signup](https://www.wunderground.com/signup). Once you have an account, you need to acquire an API key. You can do so by visiting [https://www.wunderground.com/weather/api](https://www.wunderground.com/weather/api/?MR=1), then selecting Key Settings. The Stratus Developer plan is free and sufficient to run this sample.

Once you have an API key, add the following **app setting** to your function app.

| App setting name | Value description |
| - | - |
| **WeatherUndergroundApiKey**  | Your Weather Underground API key. |

# [Python](#tab/python)

### Configuring Twilio integration

[!INCLUDE [functions-twilio-integration](../../../includes/functions-twilio-integration.md)]

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

::: zone-end

## The orchestrator and activities

::: zone pivot="durable-functions"

This article explains the following functions in the sample app:

# [C#](#tab/csharp)

* `E3_Monitor`: An [orchestrator function](durable-functions-bindings.md#orchestration-trigger) that calls `E3_GetIsClear` periodically. It calls `E3_SendGoodWeatherAlert` if `E3_GetIsClear` returns true.
* `E3_GetIsClear`: An [activity function](durable-functions-bindings.md#activity-trigger) that checks the current weather conditions for a location.
* `E3_SendGoodWeatherAlert`: An activity function that sends an SMS message via Twilio.

# [JavaScript](#tab/javascript)

* `E3_Monitor`: An [orchestrator function](durable-functions-bindings.md#orchestration-trigger) that calls `E3_GetIsClear` periodically. It calls `E3_SendGoodWeatherAlert` if `E3_GetIsClear` returns true.
* `E3_GetIsClear`: An [activity function](durable-functions-bindings.md#activity-trigger) that checks the current weather conditions for a location.
* `E3_SendGoodWeatherAlert`: An activity function that sends an SMS message via Twilio.

# [Python](#tab/python)

* `E3_Monitor`: An [orchestrator function](durable-functions-bindings.md#orchestration-trigger) that calls `E3_TooManyOpenIssues` periodically. It calls `E3_SendAlert` if the return value of `E3_TooManyOpenIssues` is `True`.
* `E3_TooManyOpenIssues`: An [activity function](durable-functions-bindings.md#activity-trigger) that checks if a repository has too many open issues. For demoing purposes, we consider having more than 3 open issues to be too many.
* `E3_SendAlert`: An activity function that sends an SMS message via Twilio.

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

::: zone-end

::: zone pivot="durable-task-sdks"

This article explains the following components in the sample app:

* `MonitoringJobOrchestrator` / `monitorOrchestrator` / `monitoring_job_orchestrator`: An orchestrator that periodically checks the status of a job until it completes or times out.
* `CheckJobStatus` / `checkJobStatus` / `check_job_status`: An activity that checks the current status of a job.

::: zone-end

## Orchestrator

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/Monitor.cs?range=41-78,97-115)]

The orchestrator function requires a location to monitor and a phone number to send a message to when the weather becomes clear at the location. This data is passed to the orchestrator function as a strongly typed `MonitorRequest` object.

# [JavaScript](#tab/javascript)

The **E3_Monitor** function uses the standard *function.json* for orchestrator functions.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_Monitor/function.json":::

Here's the code that implements the function:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_Monitor/index.js":::

# [Python](#tab/python)

The **E3_Monitor** function uses the standard *function.json* for orchestrator functions.

[!code-json[Main](~/samples-durable-functions-python/samples/monitor/E3_Monitor/function.json)]

Here is the code that implements the function:

[!code-python[Main](~/samples-durable-functions-python/samples/monitor/E3_Monitor/\_\_init\_\_.py)]

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

This orchestrator function performs the following actions:

1. Gets the **MonitorRequest** consisting of the *location* to monitor and the *phone number* to which it sends an SMS notification (or *repo* for the Python example).
2. Determines the expiration time of the monitor. The sample uses a hard-coded value for brevity.
3. Calls the status-checking activity to determine whether the condition is met.
4. If the condition is met, calls the alert activity to send a notification.
5. Creates a durable timer to resume the orchestration at the next polling interval. The sample uses a hard-coded value for brevity.
6. Continues running until the current UTC time passes the monitor's expiration time, or an alert is sent.

Multiple orchestrator function instances can run simultaneously by calling the orchestrator function multiple times. The location to monitor and the phone number to send an alert to can be specified. The orchestrator function isn't running while waiting for the timer, so you won't get charged for it.

::: zone-end

::: zone pivot="durable-task-sdks"

The orchestrator periodically checks the status of a job and returns when the job completes or times out.

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;
using System;
using System.Threading.Tasks;

[DurableTask(nameof(MonitoringJobOrchestration))]
public class MonitoringJobOrchestration : TaskOrchestrator<JobMonitorInput, JobMonitorResult>
{
    public override async Task<JobMonitorResult> RunAsync(
        TaskOrchestrationContext context, JobMonitorInput input)
    {
        var jobId = input.JobId;
        var pollingInterval = TimeSpan.FromSeconds(input.PollingIntervalSeconds);
        var expirationTime = context.CurrentUtcDateTime.AddSeconds(input.TimeoutSeconds);

        // Initialize monitoring state
        int checkCount = 0;

        while (context.CurrentUtcDateTime < expirationTime)
        {
            // Check current job status
            var jobStatus = await context.CallActivityAsync<JobStatus>(
                nameof(CheckJobStatusActivity),
                new CheckJobInput { JobId = jobId, CheckCount = checkCount });

            checkCount = jobStatus.CheckCount;

            // Make job status available via custom status
            context.SetCustomStatus(jobStatus);

            if (jobStatus.Status == "Completed")
            {
                return new JobMonitorResult
                {
                    JobId = jobId,
                    FinalStatus = "Completed",
                    ChecksPerformed = checkCount
                };
            }

            // Calculate next check time
            var nextCheck = context.CurrentUtcDateTime.Add(pollingInterval);
            if (nextCheck > expirationTime)
            {
                nextCheck = expirationTime;
            }

            // Wait until next polling interval
            await context.CreateTimer(nextCheck, default);
        }

        // Timeout reached
        return new JobMonitorResult
        {
            JobId = jobId,
            FinalStatus = "Timeout",
            ChecksPerformed = checkCount
        };
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import {
  OrchestrationContext,
  TOrchestrator,
} from "@microsoft/durabletask-js";

const monitorOrchestrator: TOrchestrator = async function* (
  ctx: OrchestrationContext,
  input: { jobId: string; pollingIntervalSeconds: number; timeoutSeconds: number }
): any {
  const { jobId, pollingIntervalSeconds, timeoutSeconds } = input;
  const expirationTime = new Date(
    ctx.currentUtcDateTime.getTime() + timeoutSeconds * 1000
  );

  let checkCount = 0;

  while (ctx.currentUtcDateTime < expirationTime) {
    // Check current job status
    const jobStatus: any = yield ctx.callActivity(checkJobStatus, {
      jobId,
      checkCount,
    });

    checkCount = jobStatus.checkCount;

    // Make job status available via custom status
    ctx.setCustomStatus(jobStatus);

    if (jobStatus.status === "Completed") {
      return {
        jobId,
        finalStatus: "Completed",
        checksPerformed: checkCount,
      };
    }

    // Wait for next polling interval
    yield ctx.createTimer(pollingIntervalSeconds);
  }

  // Timeout reached
  return {
    jobId,
    finalStatus: "Timeout",
    checksPerformed: checkCount,
  };
};
```

# [Python](#tab/python)

```python
import datetime
from durabletask import task

def monitoring_job_orchestrator(ctx: task.OrchestrationContext, job_data: dict) -> dict:
    """
    Orchestrator that demonstrates the monitoring pattern.

    Periodically checks the status of a job until it completes or times out.
    """
    job_id = job_data.get("job_id")
    polling_interval = job_data.get("polling_interval_seconds", 5)
    timeout = job_data.get("timeout_seconds", 30)

    # Record the start time
    start_time = ctx.current_utc_datetime
    expiration_time = start_time + datetime.timedelta(seconds=timeout)

    # Initialize monitoring state
    job_status = {
        "job_id": job_id,
        "status": "Unknown",
        "check_count": 0
    }

    # Loop until the job completes or times out
    while True:
        # Check current job status
        check_input = {"job_id": job_id, "check_count": job_status.get("check_count", 0)}
        job_status = yield ctx.call_activity("check_job_status", input=check_input)

        # Make the job status available via custom status
        ctx.set_custom_status(job_status)

        if job_status["status"] == "Completed":
            break

        # Check if we've hit the timeout
        current_time = ctx.current_utc_datetime
        if current_time >= expiration_time:
            job_status["status"] = "Timeout"
            break

        # Calculate next check time
        next_check_time = current_time + datetime.timedelta(seconds=polling_interval)
        if next_check_time > expiration_time:
            next_check_time = expiration_time

        # Wait until next polling interval
        yield ctx.create_timer(next_check_time)

    # Return the final status
    return {
        "job_id": job_id,
        "final_status": job_status["status"],
        "checks_performed": job_status["check_count"]
    }
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
        public String getName() { return "MonitoringJobOrchestrator"; }

        @Override
        public TaskOrchestration create() {
            return ctx -> {
                JobData jobData = ctx.getInput(JobData.class);
                int pollingCount = 0;

                // Set initial status
                ctx.setCustomStatus(new JobStatus("Starting monitoring..."));

                while (true) {
                    // Update status
                    ctx.setCustomStatus(new JobStatus(
                        "Polling job status (attempt " + (++pollingCount) + ")"));

                    // Wait for polling interval
                    ctx.createTimer(Duration.ofSeconds(jobData.pollingIntervalSeconds)).await();

                    // Check if job is complete (simulated after 3 attempts)
                    if (pollingCount >= 3) {
                        ctx.setCustomStatus(new JobStatus("Job completed successfully"));
                        ctx.complete(new JobResult(
                            "COMPLETED",
                            "Job completed after " + pollingCount + " attempts"));
                        break;
                    }
                }
            };
        }
    })
    .build();
```

---

This orchestrator performs the following actions:

1. Takes the job ID, polling interval, and timeout as input parameters.
2. Records the start time and calculates the expiration time.
3. Enters a polling loop that checks the job status.
4. Updates the custom status so clients can monitor progress.
5. If the job completes, returns the final result.
6. If the timeout is reached, returns a timeout status.
7. Uses `CreateTimer` to wait between polling attempts without consuming resources.

::: zone-end

## Activities

::: zone pivot="durable-functions"

As with other samples, the helper activity functions are regular functions that use the `activityTrigger` trigger binding.

### Status checking activity

# [C#](#tab/csharp)

The **E3_GetIsClear** function gets the current weather conditions using the Weather Underground API and determines whether the sky is clear.

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/Monitor.cs?range=80-85)]

# [JavaScript](#tab/javascript)

The *function.json* is defined as follows:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_GetIsClear/function.json":::

And here's the implementation.

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_GetIsClear/index.js":::

# [Python](#tab/python)

The **E3_TooManyOpenIssues** function gets a list of currently open issues on the repo and determines if there are "too many" of them: more than 3 as per our sample.

The *function.json* is defined as follows:

[!code-json[Main](~/samples-durable-functions-python/samples/monitor/E3_TooManyOpenIssues/function.json)]

And here is the implementation.

[!code-python[Main](~/samples-durable-functions-python/samples/monitor/E3_TooManyOpenIssues/\_\_init\_\_.py)]

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

### Alert activity

# [C#](#tab/csharp)

The **E3_SendGoodWeatherAlert** function uses the Twilio binding to send an SMS message notifying the end user that it's a good time for a walk.

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/Monitor.cs?range=87-96,140-205)]

> [!NOTE]
> You will need to install the `Microsoft.Azure.WebJobs.Extensions.Twilio` Nuget package to run the sample code.

# [JavaScript](#tab/javascript)

Its *function.json* is simple:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_SendGoodWeatherAlert/function.json":::

And here's the code that sends the SMS message:

:::code language="javascript" source="~/azure-functions-durable-js/samples/E3_SendGoodWeatherAlert/index.js":::

# [Python](#tab/python)

The **E3_SendAlert** function uses the Twilio binding to send an SMS message notifying the end user that there are at least 3 open issues awaiting a resolution.

Its *function.json* is simple:

[!code-json[Main](~/samples-durable-functions-python/samples/monitor/E3_TooManyOpenIssues/function.json)]

And here is the code that sends the SMS message:

[!code-python[Main](~/samples-durable-functions-python/samples/monitor/E3_SendAlert/\_\_init\_\_.py)]

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

::: zone-end

::: zone pivot="durable-task-sdks"

The activity checks the current status of the job. In a real application, this would call an external API or service.

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

[DurableTask(nameof(CheckJobStatusActivity))]
public class CheckJobStatusActivity : TaskActivity<CheckJobInput, JobStatus>
{
    private readonly ILogger<CheckJobStatusActivity> _logger;

    public CheckJobStatusActivity(ILogger<CheckJobStatusActivity> logger)
    {
        _logger = logger;
    }

    public override Task<JobStatus> RunAsync(TaskActivityContext context, CheckJobInput input)
    {
        _logger.LogInformation("Checking status for job: {JobId} (check #{CheckCount})",
            input.JobId, input.CheckCount + 1);

        // Simulate job status - completes after 3 checks
        var status = input.CheckCount >= 3 ? "Completed" : "Running";

        return Task.FromResult(new JobStatus
        {
            JobId = input.JobId,
            Status = status,
            CheckCount = input.CheckCount + 1,
            LastCheckTime = DateTime.UtcNow
        });
    }
}

// Data classes
public class JobMonitorInput
{
    public string JobId { get; set; }
    public int PollingIntervalSeconds { get; set; } = 5;
    public int TimeoutSeconds { get; set; } = 30;
}

public class CheckJobInput
{
    public string JobId { get; set; }
    public int CheckCount { get; set; }
}

public class JobStatus
{
    public string JobId { get; set; }
    public string Status { get; set; }
    public int CheckCount { get; set; }
    public DateTime LastCheckTime { get; set; }
}

public class JobMonitorResult
{
    public string JobId { get; set; }
    public string FinalStatus { get; set; }
    public int ChecksPerformed { get; set; }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext } from "@microsoft/durabletask-js";

const checkJobStatus = async (
  _ctx: ActivityContext,
  input: { jobId: string; checkCount: number }
): Promise<any> => {
  console.log(
    `Checking status for job: ${input.jobId} (check #${input.checkCount + 1})`
  );

  // Simulate job status — completes after 3 checks
  const status = input.checkCount >= 3 ? "Completed" : "Running";

  return {
    jobId: input.jobId,
    status,
    checkCount: input.checkCount + 1,
    lastCheckTime: new Date().toISOString(),
  };
};
```

# [Python](#tab/python)

```python
import datetime
from durabletask import task

def check_job_status(ctx: task.ActivityContext, job_data: dict) -> dict:
    """
    Activity that checks the status of a long-running job.
    In a real application, this would call an external API or service.
    """
    job_id = job_data.get("job_id", "unknown")
    check_count = job_data.get("check_count", 0)

    # Simulate job status - completes after 3 checks
    if check_count >= 3:
        status = "Completed"
    else:
        status = "Running"

    return {
        "job_id": job_id,
        "status": status,
        "check_count": check_count + 1,
        "last_check_time": datetime.datetime.now().isoformat()
    }
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

In the Java sample, the status checking is simulated directly in the orchestrator. In a real application, you would create a separate activity:

```java
.addActivity(new TaskActivityFactory() {
    @Override
    public String getName() { return "CheckJobStatus"; }

    @Override
    public TaskActivity create() {
        return ctx -> {
            JobCheckInput input = ctx.getInput(JobCheckInput.class);

            // Simulate checking job status
            // In a real app, this would call an external API
            String status = input.checkCount >= 3 ? "Completed" : "Running";

            return new JobStatus(status, input.checkCount + 1);
        };
    }
})
```

---

::: zone-end

## Run the sample

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

Using the HTTP-triggered functions included in the sample, you can start the orchestration by sending the following HTTP POST request:

```
POST https://{host}/orchestrators/E3_Monitor
Content-Length: 77
Content-Type: application/json

{ "location": { "city": "Redmond", "state": "WA" }, "phone": "+1425XXXXXXX" }
```

# [JavaScript](#tab/javascript)

Using the HTTP-triggered functions included in the sample, you can start the orchestration by sending the following HTTP POST request:

```
POST https://{host}/orchestrators/E3_Monitor
Content-Length: 77
Content-Type: application/json

{ "location": { "city": "Redmond", "state": "WA" }, "phone": "+1425XXXXXXX" }
```

# [Python](#tab/python)

You need a [GitHub](https://github.com/) account. Create a temporary public repository that you can open issues to.

Using the HTTP-triggered functions included in the sample, you can start the orchestration by sending the following HTTP POST request:

```
POST https://{host}/orchestrators/E3_Monitor
Content-Length: 77
Content-Type: application/json

{ "repo": "<your GitHub handle>/<a new GitHub repo under your user>", "phone": "+1425XXXXXXX" }
```

For example, if your GitHub username is `foo` and your repository is `bar` then your value for `"repo"` should be `"foo/bar"`.

# [PowerShell](#tab/powershell)

PowerShell sample coming soon.

# [Java](#tab/java)

Java sample coming soon.

---

```
HTTP/1.1 202 Accepted
Content-Type: application/json; charset=utf-8
Location: https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635?taskHub=SampleHubVS&connection=Storage&code={SystemKey}
RetryAfter: 10

{"id": "f6893f25acf64df2ab53a35c09d52635", "statusQueryGetUri": "https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635?taskHub=SampleHubVS&connection=Storage&code={systemKey}", "sendEventPostUri": "https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635/raiseEvent/{eventName}?taskHub=SampleHubVS&connection=Storage&code={systemKey}", "terminatePostUri": "https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635/terminate?reason={text}&taskHub=SampleHubVS&connection=Storage&code={systemKey}"}
```

The **E3_Monitor** instance starts and queries the current conditions. If the condition is met, it calls an activity function to send an alert; otherwise, it sets a timer. When the timer expires, the orchestration resumes.

You can see the orchestration's activity by looking at the function logs in the Azure Functions portal.

The orchestration completes once its timeout is reached or the condition is detected. You can also use the `terminate` API inside another function or invoke the **terminatePostUri** HTTP POST webhook referenced in the preceding 202 response. To use the webhook, replace `{text}` with the reason for the early termination. The HTTP POST URL looks roughly as follows:

```
POST https://{host}/runtime/webhooks/durabletask/instances/f6893f25acf64df2ab53a35c09d52635/terminate?reason=Because&taskHub=SampleHubVS&connection=Storage&code={systemKey}
```

::: zone-end

::: zone pivot="durable-task-sdks"

To run the sample, you need:

1. **Start the Durable Task Scheduler emulator** (for local development):

   ```bash
   docker run -d -p 8080:8080 -p 8082:8082 --name dts-emulator mcr.microsoft.com/dts/dts-emulator:latest
   ```

2. **Start the worker** to register the orchestrator and activities.

3. **Run the client** to schedule a monitoring orchestration.

# [C#](#tab/csharp)

```csharp
using System;
using System.Threading.Tasks;

var client = DurableTaskClientBuilder.UseDurableTaskScheduler(connectionString).Build();

// Schedule the monitoring orchestration
var input = new JobMonitorInput
{
    JobId = "job-" + Guid.NewGuid().ToString(),
    PollingIntervalSeconds = 5,
    TimeoutSeconds = 30
};

string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
    nameof(MonitoringJobOrchestration), input);

Console.WriteLine($"Started monitoring orchestration: {instanceId}");

// Wait for completion while checking status
while (true)
{
    var state = await client.GetInstanceMetadataAsync(instanceId, getInputsAndOutputs: true);

    if (state.RuntimeStatus == OrchestrationRuntimeStatus.Completed ||
        state.RuntimeStatus == OrchestrationRuntimeStatus.Failed)
    {
        Console.WriteLine($"Monitoring completed: {state.ReadOutputAs<JobMonitorResult>().FinalStatus}");
        break;
    }

    Console.WriteLine($"Current status: {state.ReadCustomStatusAs<JobStatus>()?.Status}");
    await Task.Delay(2000);
}
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
  .addOrchestrator(monitorOrchestrator)
  .addActivity(checkJobStatus)
  .build();

await worker.start();

// Schedule the monitoring orchestration
const input = {
  jobId: `job-${Date.now()}`,
  pollingIntervalSeconds: 5,
  timeoutSeconds: 30,
};

const instanceId = await client.scheduleNewOrchestration(
  monitorOrchestrator,
  input
);

console.log(`Started monitoring orchestration: ${instanceId}`);

// Wait for completion
const result = await client.waitForOrchestrationCompletion(
  instanceId,
  true,
  60
);
console.log(`Final result: ${result?.serializedOutput}`);

await worker.stop();
await client.stop();
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient
import time

client = DurableTaskSchedulerClient(
    host_address=endpoint,
    secure_channel=endpoint != "http://localhost:8080",
    taskhub=taskhub,
    token_credential=credential
)

# Schedule the monitoring orchestration
job_data = {
    "job_id": "job-123",
    "polling_interval_seconds": 5,
    "timeout_seconds": 30
}

instance_id = client.schedule_new_orchestration(
    monitoring_job_orchestrator,
    input=job_data
)

print(f"Started monitoring orchestration: {instance_id}")

# Wait for completion
result = client.wait_for_orchestration_completion(instance_id, timeout=60)
print(f"Final result: {result.serialized_output}")
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

```java
import java.time.Duration;
import java.util.UUID;

DurableTaskClient client = DurableTaskSchedulerClientExtensions
    .createClientBuilder(connectionString).build();

// Schedule the monitoring orchestration
JobData jobData = new JobData(
    "job-" + UUID.randomUUID().toString(),
    5,  // polling interval seconds
    30  // timeout seconds
);

String instanceId = client.scheduleNewOrchestrationInstance(
    "MonitoringJobOrchestrator",
    new NewOrchestrationInstanceOptions().setInput(jobData));

System.out.println("Started monitoring orchestration: " + instanceId);

// Wait for completion
OrchestrationMetadata result = client.waitForInstanceCompletion(
    instanceId, Duration.ofSeconds(60), true);

System.out.println("Final result: " + result.readOutputAs(JobResult.class).status);
```

---

::: zone-end

## Next steps

::: zone pivot="durable-functions"

This sample demonstrates how to use Durable Functions to monitor an external source's status using [durable timers](durable-functions-timers.md) and conditional logic. The next sample shows how to use external events and [durable timers](durable-functions-timers.md) to handle human interaction.

> [!div class="nextstepaction"]
> [Run the human interaction sample](durable-functions-human-interaction.md)

::: zone-end

::: zone pivot="durable-task-sdks"

This sample demonstrated how to use the Durable Task SDKs to implement the monitoring pattern with durable timers and status tracking. Learn more about other patterns and features.

- [Durable Task JavaScript SDK on GitHub](https://github.com/microsoft/durabletask-js)

> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](durable-task-scheduler/quickstart-portable-durable-task-sdks.md)

::: zone-end
