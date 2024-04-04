---
title: Automatically pause an Azure Stream Analytics with PowerShell
description: This article describes how to automatically pause an Azure Stream Analytics job on a schedule by using PowerShell.
ms.service: stream-analytics
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 11/03/2021
---

# Automatically pause a job by using PowerShell and Azure Functions or Azure Automation

Some applications require a stream processing approach (such as through [Azure Stream Analytics](./stream-analytics-introduction.md)) but don't strictly need to run continuously. The reasons include:

- Input data that arrives on a schedule (for example, top of the hour)
- A sparse or low volume of incoming data (few records per minute)
- Business processes that benefit from time-windowing capabilities but that run in batch by essence (for example, finance or HR)
- Demonstrations, prototypes, or tests that involve long-running jobs at low scale

The benefit of not running these jobs continuously is cost savings, because Stream Analytics jobs are [billed](https://azure.microsoft.com/pricing/details/stream-analytics/) per Streaming Unit over time.

This article explains how to set up automatic pausing for an Azure Stream Analytics job. You configure a task that automatically pauses and resumes a job on a schedule. The term *pause* means that the job [state](./job-states.md) is **Stopped** to avoid any billing.

This article discusses the overall design, the required components, and some implementation details.

> [!NOTE]
> There are downsides to automatically pausing a job. The main downsides are the loss of low-latency/real-time capabilities and the potential risks from allowing the input event backlog to grow unsupervised while a job is paused. Organizations shouldn't consider automatic pausing for most production scenarios that run at scale.

## Design

For the example in this article, you want your job to run for *N* minutes before pausing it for *M* minutes. When the job is paused, the input data isn't consumed and accumulates upstream. After the job starts, it catches up with that backlog and processes the data trickling in before it's shut down again.

![Diagram that illustrates the behavior of an automatically paused job over time.](./media/automation/principle.png)

When the job is running, the task shouldn't stop the job until its metrics are healthy. The metrics of interest are the input backlog and the [watermark](./stream-analytics-time-handling.md#background-time-concepts). You'll check that both are at their baseline for at least *N* minutes. This behavior translates to two actions:

- A stopped job is restarted after *M* minutes.
- A running job is stopped anytime after *N* minutes, as soon as its backlog and watermark metrics are healthy.

![Diagram that shows the possible states of a job.](./media/automation/States.png)

As an example, consider that *N* = 5 minutes and *M* = 10 minutes. With these settings, a job has at least 5 minutes to process all the data received in 15. Potential cost savings are up to 66%.

To restart the job, use the **When Last Stopped** [start option](./start-job.md#start-options). This option tells Stream Analytics to process all the events that were backlogged upstream since the job was stopped.

There are two caveats in this situation. First, the job can't stay stopped longer than the retention period of the input stream. If you run the job only once a day, you need to make sure that the [retention period for events](/azure/event-hubs/event-hubs-faq#what-is-the-maximum-retention-period-for-events-) is more than one day. Second, the job needs to have been started at least once for the mode **When Last Stopped** to be accepted (or else it has literally never been stopped before). So the first run of a job needs to be manual, or you need to extend the script to cover for that case.

The last consideration is to make these actions idempotent. You can then repeat them at will with no side effects, for both ease of use and resiliency.

## Components

### API calls

This article anticipates the need to interact with Stream Analytics on the following aspects:

- Get the current job status (Stream Analytics resource management):
  - If the job is running:
    - Get the time since the job started (logs).
    - Get the current metric values (metrics).
    - If applicable, stop the job (Stream Analytics resource management).
  - If the job is stopped:
    - Get the time since the job stopped (logs).
    - If applicable, start the job (Stream Analytics resource management).

For Stream Analytics resource management, you can use the [REST API](/rest/api/streamanalytics/), the [.NET SDK](/dotnet/api/microsoft.azure.management.streamanalytics), or one of the CLI libraries ([Azure CLI](/cli/azure/stream-analytics) or [PowerShell](/powershell/module/az.streamanalytics)).

For metrics and logs, everything in Azure is centralized under [Azure Monitor](../azure-monitor/overview.md), with a similar choice of API surfaces. Logs and metrics are always 1 to 3 minutes behind when you're querying the APIs. So setting *N* at 5 usually means the job runs 6 to 8 minutes in reality.

Another consideration is that metrics are always emitted. When the job is stopped, the API returns empty records. You have to clean up the output of your API calls to focus on relevant values.

### Scripting language

This article implements automatic pausing in [PowerShell](/powershell/scripting/overview). The first reason for this choice is that PowerShell is now cross-platform. It can run on any operating system, which makes deployments easier. The second reason is that it takes and returns objects rather than strings. Objects make parsing and processing easier for automation tasks.

In PowerShell, use the [Az PowerShell](/powershell/azure/new-azureps-module-az) module (which embarks [Az.Monitor](/powershell/module/az.monitor/) and [Az.StreamAnalytics](/powershell/module/az.streamanalytics/)) for everything you need:

- [Get-AzStreamAnalyticsJob](/powershell/module/az.streamanalytics/get-azstreamanalyticsjob) for the current job status
- [Start-AzStreamAnalyticsJob](/powershell/module/az.streamanalytics/start-azstreamanalyticsjob) or [Stop-AzStreamAnalyticsJob](/powershell/module/az.streamanalytics/stop-azstreamanalyticsjob)
- [Get-AzMetric](/powershell/module/az.monitor/get-azmetric) with `InputEventsSourcesBacklogged` (from [Stream Analytics metrics](../azure-monitor/essentials/metrics-supported.md#microsoftstreamanalyticsstreamingjobs))
- [Get-AzActivityLog](/powershell/module/az.monitor/get-azactivitylog) for event names that begin with `Stop Job`

### Hosting service

To host your PowerShell task, you need a service that offers scheduled runs. There are many options, but here are two serverless ones:

- [Azure Functions](../azure-functions/functions-overview.md), a compute engine that can run almost any piece of code. It offers a [timer trigger](../azure-functions/functions-bindings-timer.md?tabs=csharp) that can run up to every second.
- [Azure Automation](../automation/overview.md), a managed service for operating cloud workloads and resources. Its purpose is appropriate, but its minimal schedule interval is 1 hour (less with [workarounds](../automation/shared-resources/schedules.md#schedule-runbooks-to-run-more-frequently)).

If you don't mind the workarounds, Azure Automation is the easier way to deploy the task. But in this article, you write a local script first so you can compare. After you have a functioning script, you deploy it both in Functions and in an Automation account.

### Developer tools

We highly recommend local development through [Visual Studio Code](https://code.visualstudio.com/), for both [Functions](../azure-functions/create-first-function-vs-code-powershell.md) and [Stream Analytics](./quick-create-visual-studio-code.md). Using a local development environment allows you to use source control and helps you easily repeat deployments. But for the sake of brevity, this article illustrates the process in the [Azure portal](https://portal.azure.com).

## Writing the PowerShell script locally

The best way to develop the script is locally. Because PowerShell is cross-platform, you can write the script and test it on any operating system. On Windows, you can use [Windows Terminal](https://www.microsoft.com/p/windows-terminal/9n0dx20hk701) with [PowerShell 7](/powershell/scripting/install/installing-powershell-on-windows) and [Azure PowerShell](/powershell/azure/install-azure-powershell).

The final script that this article uses is available for [Azure Functions](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/Automation/Auto-pause/run.ps1) and [Azure Automation](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/Automation/Auto-pause/runbook.ps1). It's different from the following script in that it's wired to the hosting environment (Functions or Automation). This article discusses that aspect later. First, you step through a version of the script that runs only locally.

This script is purposefully written in a simple form, so everyone can understand it.

At the top, you set the required parameters and check the initial job status:

```PowerShell

# Setting variables
$restartThresholdMinute = 10 # This is M
$stopThresholdMinute = 5 # This is N

$maxInputBacklog = 0 # The amount of backlog you tolerate when stopping the job (in event count, 0 is a good starting point)
$maxWatermark = 10 # The amount of watermark you tolerate when stopping the job (in seconds, 10 is a good starting point at low Streaming Units)

$subscriptionId = "<Replace with your Subscription Id - not the name>"
$resourceGroupName = "<Replace with your Resource Group Name>"
$asaJobName = "<Replace with your Stream Analytics job name>"

$resourceId = "/subscriptions/$($subscriptionId )/resourceGroups/$($resourceGroupName )/providers/Microsoft.StreamAnalytics/streamingjobs/$($asaJobName)"

# If not already logged, uncomment and run the two following commands:
# Connect-AzAccount
# Set-AzContext -SubscriptionId $subscriptionId

# Check current Stream Analytics job status
$currentJobState = Get-AzStreamAnalyticsJob  -ResourceGroupName $resourceGroupName -Name $asaJobName | Foreach-Object {$_.JobState}
Write-Output "asaRobotPause - Job $($asaJobName) is $($currentJobState)."

```

If the job is running, you then check if the job has been running at least *N* minutes. You also check its backlog and its watermark.

```PowerShell

# Switch state
if ($currentJobState -eq "Running")
{
    # First, look up the job start time with Get-AzActivityLog
    ## Get-AzActivityLog issues warnings about deprecation coming in future releases. Here you ignore them via -WarningAction Ignore.
    ## You check in 1,000 records of history, to make sure you're not missing what you're looking for. It might need adjustment for a job that has a lot of logging happening.
    ## There's a bug in Get-AzActivityLog that triggers an error when Select-Object First is in the same pipeline (on the same line). So you move it down.
    $startTimeStamp = Get-AzActivityLog -ResourceId $resourceId -MaxRecord 1000 -WarningAction Ignore | Where-Object {$_.EventName.Value -like "Start Job*"}
    $startTimeStamp = $startTimeStamp | Select-Object -First 1 | Foreach-Object {$_.EventTimeStamp}

    # Then gather the current metric values
    ## Get-AzMetric issues warnings about deprecation coming in future releases. Here you ignore them via -WarningAction Ignore.
    $currentBacklog = Get-AzMetric -ResourceId $resourceId -TimeGrain 00:01:00 -MetricName "InputEventsSourcesBacklogged" -DetailedOutput -WarningAction Ignore
    $currentWatermark = Get-AzMetric -ResourceId $resourceId -TimeGrain 00:01:00 -MetricName "OutputWatermarkDelaySeconds" -DetailedOutput -WarningAction Ignore

    # Metrics are always lagging 1-3 minutes behind, so grabbing the last N minutes actually means checking N+3. This might be overly safe and can be fine-tuned down per job.
    $Backlog =  $currentBacklog.Data |
                    Where-Object {$_.Maximum -ge 0} | # Remove the empty records (when the job is stopped or starting)
                    Sort-Object -Property Timestamp -Descending |
                    Where-Object {$_.Timestamp -ge $startTimeStamp} | # Keep only the records of the latest run
                    Select-Object -First $stopThresholdMinute | # Take the last N records
                    Measure-Object -Sum Maximum # Sum over those N records
    $BacklogSum = $Backlog.Sum

    $Watermark = $currentWatermark.Data |
                    Where-Object {$_.Maximum -ge 0} |
                    Sort-Object -Property Timestamp -Descending |
                    Where-Object {$_.Timestamp -ge $startTimeStamp} |
                    Select-Object -First $stopThresholdMinute |
                    Measure-Object -Average Maximum # Here you average
    $WatermarkAvg = [int]$Watermark.Average # Rounding the decimal value and casting it to integer

    # Because you called Get-AzMetric with a TimeGrain of a minute, counting the number of records gives you the duration in minutes
    Write-Output "asaRobotPause - Job $($asaJobName) is running since $($startTimeStamp) with a sum of $($BacklogSum) backlogged events, and an average watermark of $($WatermarkAvg) sec, for $($Watermark.Count) minutes."

    # -le for lesser or equal, -ge for greater or equal
    if (
        ($BacklogSum -ge 0) -and ($BacklogSum -le $maxInputBacklog) -and ` # is not null and is under the threshold
        ($WatermarkAvg -ge 0) -and ($WatermarkAvg -le $maxWatermark) -and ` # is not null and is under the threshold
        ($Watermark.Count -ge $stopThresholdMinute) # at least N values
        )
    {
        Write-Output "asaRobotPause - Job $($asaJobName) is stopping..."
        Stop-AzStreamAnalyticsJob -ResourceGroupName $resourceGroupName -Name $asaJobName
    }
    else {
        Write-Output "asaRobotPause - Job $($asaJobName) is not stopping yet, it needs to have less than $($maxInputBacklog) backlogged events and under $($maxWatermark) sec watermark for at least $($stopThresholdMinute) minutes."
    }
}

```

If the job is stopped, check the log to find when the last `Stop Job` action happened:

```PowerShell

elseif ($currentJobState -eq "Stopped")
{
    # First, look up the job start time with Get-AzActivityLog
    ## Get-AzActivityLog issues warnings about deprecation coming in future releases. Here you ignore them via -WarningAction Ignore.
    ## You check in 1,000 records of history, to make sure you're not missing what you're looking for. It might need adjustment for a job that has a lot of logging happening.
    ## There's a bug in Get-AzActivityLog that triggers an error when Select-Object First is in the same pipeline (on the same line). So you move it down.
    $stopTimeStamp = Get-AzActivityLog -ResourceId $resourceId -MaxRecord 1000 -WarningAction Ignore | Where-Object {$_.EventName.Value -like "Stop Job*"}
    $stopTimeStamp = $stopTimeStamp | Select-Object -First 1 | Foreach-Object {$_.EventTimeStamp}

    # Get-Date returns a local time. You project it to the same time zone (universal) as the result of Get-AzActivityLog that you extracted earlier.
    $minutesSinceStopped = ((Get-Date).ToUniversalTime()- $stopTimeStamp).TotalMinutes

    # -ge for greater or equal
    if ($minutesSinceStopped -ge $restartThresholdMinute)
    {
        Write-Output "asaRobotPause - Job $($jobName) was paused $([int]$minutesSinceStopped) minutes ago, set interval is $($restartThresholdMinute), it is now starting..."
        Start-AzStreamAnalyticsJob -ResourceGroupName $resourceGroupName -Name $asaJobName -OutputStartMode LastOutputEventTime
    }
    else{
        Write-Output "asaRobotPause - Job $($jobName) was paused $([int]$minutesSinceStopped) minutes ago, set interval is $($restartThresholdMinute), it will not be restarted yet."
    }
}
else {
    Write-Output "asaRobotPause - Job $($jobName) is not in a state I can manage: $($currentJobState). Let's wait a bit, but consider helping is that doesn't go away!"
}
```

At the end, log the job completion:

```PowerShell

# Final Stream Analytics job status check
$newJobState = Get-AzStreamAnalyticsJob  -ResourceGroupName $resourceGroupName -Name $asaJobName | Foreach-Object {$_.JobState}
Write-Output "asaRobotPause - Job $($asaJobName) was $($currentJobState), is now $($newJobState). Job completed."

```

## Option 1: Host the task in Azure Functions

For reference, the Azure Functions team maintains an exhaustive [PowerShell developer guide](../azure-functions/functions-reference-powershell.md?tabs=portal).

First, you need a new *function app*. A function app is similar to a solution that can host multiple functions.

You can get the [full procedure](../azure-functions/functions-create-function-app-portal.md#create-a-function-app), but the gist is to go in the [Azure portal](https://portal.azure.com) and create a new function app with:

- Publish: **Code**
- Runtime: **PowerShell Core**
- Version: **7+**

After you provision the function app, start with its overall configuration.

### Managed identity for Azure Functions

The function needs permissions to start and stop the Stream Analytics job. You assign these permissions by using a [managed identity](../active-directory/managed-identities-azure-resources/overview.md).

The first step is to enable a *system-assigned managed identity* for the function, by following [this procedure](../app-service/overview-managed-identity.md?tabs=ps%2cportal&toc=/azure/azure-functions/toc.json).

Now you can grant the right permissions to that identity on the Stream Analytics job that you want to automatically pause. For this task, in the portal area for the Stream Analytics job (not the function one), in **Access control (IAM)**, add a role assignment to the role **Contributor** for a member of type **Managed Identity**. Select the name of the function from earlier.

![Screenshot of access control settings for a Stream Analytics job.](./media/automation/function-asa-role.png)

In the PowerShell script, you can add a check to ensure that the managed identity is set properly. (The final script is available on [GitHub](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/Automation/Auto-pause/run.ps1).)

```PowerShell

# Check if a managed identity has been enabled and granted access to a subscription, resource group, or resource
$AzContext = Get-AzContext -ErrorAction SilentlyContinue
if (-not $AzContext.Subscription.Id)
{
    Throw ("Managed identity is not enabled for this app or it has not been granted access to any Azure resources. Please see /azure/app-service/overview-managed-identity for additional details.")
}

```

Add some logging info to make sure that the function is firing up:

```PowerShell

$currentUTCtime = (Get-Date).ToUniversalTime()

# Write an information log with the current time.
Write-Host "asaRobotPause - PowerShell timer trigger function is starting at time: $currentUTCtime"

```

### Parameters for Azure Functions

The best way to pass your parameters to the script in Functions is to use the function app's application settings as [environment variables](../azure-functions/functions-reference-powershell.md?tabs=portal#environment-variables).

The first step is to follow the [procedure](../azure-functions/functions-how-to-use-azure-function-app-settings.md?tabs=portal#settings) to define your parameters as **App Settings** on the page for the function app. You need:

|Name|Value|
|-|-|
|`maxInputBacklog`|The amount of backlog that you tolerate when stopping the job. In the event count, `0` is a good starting point.|
|`maxWatermark`|The amount of watermark that you tolerate when stopping the job. In seconds, `10` is a good starting point at low Streaming Units.|
|`restartThresholdMinute`|*M*: The time (in minutes) until a stopped job is restarted.|
|`stopThresholdMinute`|*N*: The time (in minutes) of cooldown until a running job is stopped. The input backlog needs to stay at `0` during that time.|
|`subscriptionId`|The subscription ID (not the name) of the Stream Analytics job to be automatically paused.|
|`resourceGroupName`|The resource group name of the Stream Analytics job to be automatically paused.|
|`asaJobName`|The name of the Stream Analytics job to be automatically paused.|

Then, update your PowerShell script to load the variables accordingly:

```PowerShell
$maxInputBacklog = $env:maxInputBacklog
$maxWatermark = $env:maxWatermark

$restartThresholdMinute = $env:restartThresholdMinute
$stopThresholdMinute = $env:stopThresholdMinute

$subscriptionId = $env:subscriptionId
$resourceGroupName = $env:resourceGroupName
$asaJobName = $env:asaJobName

```

### PowerShell module requirements

The same way that you had to install Azure PowerShell locally to use the Stream Analytics commands (like `Start-AzStreamAnalyticsJob`), you need to [add it to the function app host](../azure-functions/functions-reference-powershell.md?tabs=portal#dependency-management):

1. On the page for the function app, under **Functions**, select **App files**, and then select **requirements.psd1**.
1. Uncomment the line `'Az' = '6.*'`.
1. To make that change take effect, restart the app.

![Screenshot of the app files settings for the function app.](./media/automation/function-app-files.png)

### Creating the function

After you finish all that configuration, you can create the specific function inside the function app to run the script.

In the portal, develop a function that's triggered on a timer. Make sure that the function is triggered every minute with `0 */1 * * * *`, and that it [reads](../azure-functions/functions-bindings-timer.md?tabs=csharp#ncrontab-expressions) "on second 0 of every 1 minute."

![Screenshot of creating a new timer trigger function in a function app.](./media/automation/new-function-timer.png)

If necessary, you can change the timer value in **Integration** by updating the schedule.

![Screenshot of the integration settings of a function.](./media/automation/function-timer.png)

Then, in **Code + Test**, you can copy your script in *run.ps1* and test it. Or you can copy the full script from [GitHub](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/Automation/Auto-pause/run.ps1). The business logic was moved into a try/catch statement to generate proper errors if anything fails during processing.

![Screenshot of the Code+Test pane for the function.](./media/automation/function-code.png)

You can check that everything runs fine by selecting **Test/Run** on the **Code + Test** pane. You can also check the **Monitor** pane, but it's always late by a couple of executions.

![Screenshot of the output of a successful run.](./media/automation/function-run.png)

### Setting an alert on the function execution

Finally, you want to be notified via an alert if the function doesn't run successfully. Alerts have a minor cost, but they might prevent more expensive situations.

On the page for the function app, under **Logs**, run the following query. It returns all unsuccessful runs in the last 5 minutes.

```SQL
requests
| where success == false
| where timestamp > ago(5min)
| summarize failedCount=sum(itemCount) by operation_Name
| order by failedCount desc
```

In the query editor, select **New alert rule**. On the pane that opens, define **Measurement** as:

- Measure: **failedCount**
- Aggregation type: **Total**
- Aggregation granularity: **5 minutes**

Next, set up **Alert logic** as follows:

- Operator: **Greater than**
- Threshold value: **0**
- Frequency of evaluation: **5 minutes**

From there, reuse or create a new [action group](../azure-monitor/alerts/action-groups.md?WT.mc_id=Portal-Microsoft_Azure_Monitoring). Then complete the configuration.

To check that you set up the alert properly, you can add `throw "Testing the alert"` anywhere in the PowerShell script and then wait 5 minutes to receive an email.

## Option 2: Host the task in Azure Automation

First, you need a new Automation account. An Automation account is similar to a solution that can host multiple runbooks.

For the procedure, see the [Create an Automation account using the Azure portal](../automation/quickstarts/create-azure-automation-account-portal.md) quickstart. You can choose to use a system-assigned managed identity directly on the **Advanced** tab.

For reference, the Automation team has a [tutorial](../automation/learn/powershell-runbook-managed-identity.md) for getting started on PowerShell runbooks.

### Parameters for Azure Automation

With a runbook, you can use the classic parameter syntax of PowerShell to pass arguments:

```PowerShell
Param(
    [string]$subscriptionId,
    [string]$resourceGroupName,
    [string]$asaJobName,

    [int]$restartThresholdMinute,
    [int]$stopThresholdMinute,

    [int]$maxInputBacklog,
    [int]$maxWatermark
)
```

### Managed identity for Azure Automation

The Automation account should have received a managed identity during provisioning. But if necessary, you can enable a managed identity by using [this procedure](../automation/enable-managed-identity-for-automation.md).

Like you did for the function, you need to grant the right permissions on the Stream Analytics job that you want to automatically pause.

To grant the permissions, in the portal area for the Stream Analytics job (not the Automation page), in **Access control (IAM)**, add a role assignment to the role **Contributor** for a member of type **Managed Identity**. Select the name of the Automation account from earlier.

![Screenshot of access control settings for a Stream Analytics job.](./media/automation/function-asa-role.png)

In the PowerShell script, you can add a check to ensure that the managed identity is set properly. (The final script is available on [GitHub](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/Automation/Auto-pause/runbook.ps1).)

```PowerShell
# Ensure that you don't inherit an AzContext in your runbook
Disable-AzContextAutosave -Scope Process | Out-Null

# Connect by using a managed service identity
try {
        $AzureContext = (Connect-AzAccount -Identity).context
    }
catch{
        Write-Output "There is no system-assigned user identity. Aborting.";
        exit
    }
```

### Creating the runbook

After you finish the configuration, you can create the specific runbook inside the Automation account to run your script. Here, you don't need to add Azure PowerShell as a requirement. It's already built in.

In the portal, under **Process Automation**, select **Runbooks**. Then select **Create a runbook**, select **PowerShell** as the runbook type, and choose any version above **7** as the version (at the moment, **7.1 (preview)**).

You can now paste your script and test it. You can copy the full script from [GitHub](https://github.com/Azure/azure-stream-analytics/blob/master/Samples/Automation/Auto-pause/runbook.ps1). The business logic was moved into a try/catch statement to generate proper errors if anything fails during processing.

![Screenshot of the runbook script editor in Azure Automation.](./media/automation/automation-code.png)

You can check that everything is wired properly in **Test pane**.

After that, you need to publish the job (by selecting **Publish**) so that you can link the runbook to a schedule. Creating and linking the schedule is a straightforward process. Now is a good time to remember that there are [workarounds](../automation/shared-resources/schedules.md#schedule-runbooks-to-run-more-frequently) to achieve schedule intervals under 1 hour.

Finally, you can set up an alert. The first step is to enable logs by using the [diagnostic settings](../azure-monitor/essentials/create-diagnostic-settings.md?tabs=cli) of the Automation account. The second step is to capture errors by using a query like you did for Functions.

## Outcome

In your Stream Analytics job, you can verify that everything is running as expected in two places.

Here's the activity log:

![Screenshot of the logs of the Stream Analytics job.](./media/automation/asa-logs.png)

And here are the metrics:

![Screenshot of the metrics of the Stream Analytics job.](./media/automation/asa-metrics.png)

After you understand the script, reworking it to extend its scope is a straightforward task. You can easily update the script to target a list of jobs instead of a single one. You can define and process larger scopes by using tags, resource groups, or even entire subscriptions.

## Get support

For further assistance, try the [Microsoft Q&A page for Azure Stream Analytics](/answers/tags/179/azure-stream-analytics).

## Next steps

You learned the basics of using PowerShell to automate the management of Azure Stream Analytics jobs. To learn more, see the following articles:

- [Introduction to Azure Stream Analytics](stream-analytics-introduction.md)
- [Analyze fraudulent call data with Stream Analytics and visualize results in a Power BI dashboard](stream-analytics-real-time-fraud-detection.md)
- [Scale an Azure Stream Analytics job to increase throughput](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language reference](/stream-analytics-query/stream-analytics-query-language-reference)
- [Azure Stream Analytics Management REST API](/rest/api/streamanalytics/)
