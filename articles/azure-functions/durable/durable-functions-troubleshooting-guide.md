---
title: Durable Function Troubleshooting Guide
description: Guide to troubleshoot common issues with durable functions.
author: nytiannn
ms.topic: conceptual
ms.date: 03/10/2023
ms.author: azfuncdf
---

# Durable Functions Troubleshooting Guide

Durable Functions is an extension of [Azure Functions](../functions-overview.md) that lets you build serverless orchestrations using ordinary code. For more information on Durable Functions, please see the [Durable Functions overview](./durable-functions-overview.md).

The rest of this article gives an overview of reasons and guides that you could try for certain common troubleshooting. 

> [!NOTE]
> Microsoft support engineers are available to assist in diagnosing issues with your application. If you're not able to diagnose your problem using this guide, you can file a support ticket by accessing the **New Support request** blade in the **Support + troubleshooting** section of your function app page in the Azure portal.

![Screenshot of support request page in Azure Portal.](./media/durable-functions-troubleshooting-guide/durable-function-support-request.png)

> [!TIP]
> When debugging and diagnosing issues, it's recommended that you start by ensuring your app is using the latest Durable Functions extension version. Most of the time, using the latest version mitigates known issues already reported by other users. Please read the **Durable Function Best Practice and Diagnostic Tools** article for instructions on how to upgrade your extension version. 

The **Diagnose and solve problems** tab in Azure Portal is a useful resource to monitor and diagnose potential issues related to your application. It also supplies potential solutions to your problems based on the diagnosis. Please see [the Durable Functions Diagnostics guide](./durable-functions-diagnostics.md) for more details. 

If neither the Diagnose and Solve problems tool nor the diagnostics documentation helped solve your problem, please see the following sections for more specific troubleshooting guidance.

## Orchestration is stuck in the `Pending` state

When you start an orchestration, a "start" message gets written to an internal queue managed by the Durable extension, and the status of the orchestration gets set to "Pending". After the orchestration message gets picked up and successfully processed by an available app instance, the status will transition to "Running" (or to some other non-"Pending" state).

Use the following steps to troubleshoot if you observe that one of your orchestration instances remain stuck indefinitely in the "Pending" state. 

1. Check the Durable Task Framework traces for warnings or errors for the impacted orchestration instance ID. A sample query can be found in the [Trace Errors/Warnings section](#trace-errorswarnings).

2. Check the Azure Storage control queues to see if the message is still in the queue. For more information on control queues, see the [Azure Storage provider control queue documentation](durable-functions-azure-storage-provider.md#control-queues).

3. Change [platform configuration](../../app-service/configure-common.md#configure-general-settings) version to “64-Bit” for function applications. 
   Sometimes orchestrations don't start because the app is running out of memory. Switching to 64-bit process can allow the app to allocate more total memory. This only applies to App Service Basic, Standard, Premium, and Elastic Premium plans. Free or Consumption plans **do not** support 64-bit processes. 

## Orchestration starts after a long delay

Normally orchestrations start within a few seconds after they are scheduled. However, there are certain cases where orchestrations may take much longer to start. Use the following steps to troubleshoot when orchestrations take more than a few seconds to start executing.

1. Refer to the [documentation on delayed orchestration in Azure Storage](./durable-functions-azure-storage-provider.md#orchestration-start-delays) to check whether the delay may be caused by known limitations.

2. Check the Durable Task Framework traces for warnings or errors for the impacted orchestration instance ID. A sample query can be found in [Trace Errors/Warnings section](#trace-errorswarnings).

## Orchestration does not complete / is stuck in the `Running` state

If an orchestration remains in the "Running" state for a long period of time, it usually means that it's waiting for a long-running task that it scheduled to complete. For example, it could be waiting for a durable timer task, an activity task, or an external event task to be completed. However, if you observe that scheduled tasks have completed successfully but the orchestration still isn't making progress, then there might be a problem that's preventing the orchestration from beginning its next task. We often refer to orchestrations in this state as "stuck orchestrations".

Use the following steps to troubleshoot stuck orchestrations:

1. Try restarting the function app. This can help if the orchestration gets stuck due to a transient bug or deadlock in the app or extension code.

2. Check the Azure Storage account control queues to see if any queues are growing but not shrinking. This could indicate a problem with dequeuing orchestration messages. If the problem impacts only a single control queue, it might indicate a problem that exists only on a specific app instance, in which case scaling up or down to move off the unhealthy VM instance could help.

3. Use the Application Insights query in the [Azure Storage Messaging section](./durable-functions-troubleshooting-guide.md#azure-storage-messaging) to filter on that queue name as the Partition ID and look for any problems related to that control queue partition.

4. Please check if you have followed the guidance in **Durable Functions Best Practice and Diagnostic Tools**. Some problems are caused by known Durable Functions anti-patterns. If you need to make changes to your function app, be sure to be aware of how your changes might impact in-flight orchestration instances. For more information on app versioning, see the [Durable Functions Versioning documentation](durable-functions-versioning.md).

## Orchestration runs slowly

Heavy data processing, internal errors, and insufficient compute resources can cause orchestrations to execute slower than normal. Use the following steps to troubleshoot orchestrations that are taking longer than expected to execute:

1. Check the Durable Task Framework traces for warnings or errors for the impacted orchestration instance ID. A sample query can be found in the [Trace Errors/Warnings section](#trace-errorswarnings).

2. Check if [extendedSessionsEnabled](./durable-functions-azure-storage-provider.md#extended-sessions) is set.  
   Excessive history load can result in extremely slow orchestrator processing.

3. Check for performance and scalability bottlenecks. 
   Performance issues can include many aspects. For example, high CPU usage, or large memory consumption could result in a delay. Please read [Performance and scale in Durable Functions](./durable-functions-perf-and-scale.md) for detailed information.

## Sample Queries

This section shows how to troubleshoot issues by writing custom [KQL queries](/azure/data-explorer/kusto/query/) in the Azure Application Insights instance configured for your Azure Functions app.

### Azure Storage Messaging
When using the default storage provider, all Durable Functions behavior is driven by Azure Storage queue messages and all state related to an orchestration is stored in Table Storage and blob storage. All Azure Storage interactions are logged to Application Insights, and this data is critically important for debugging execution and performance problems.

Starting in v2.3.0 of the Durable Functions extension, you can have these Durable Task Framework logs published to your Application Insights instance by updating your logging configuration in the host.json file. See the [Durable Task Framework logging article](./durable-functions-diagnostics.md) for more information.

The following query is for inspecting end-to-end Azure Storage interactions for a specific orchestration instance. Edit `start` and `targetInstanceId` to filter by time range and instance ID.

```kusto
let start = datetime(XXXX-XX-XXTXX:XX:XX); // edit this 
let targetInstanceId = "XXXXXXX"; //edit this
traces  
| where timestamp > start and timestamp < start + 1h 
| where customDimensions.Category == "DurableTask.AzureStorage" 
| extend taskName = customeDimensions["EventName"]
| extend eventType = customDimensions["prop__EventType"] 
| extend eventId = customDimensions["prop__TaskEventId"] 
| extend extendedSession = customDimensions["prop__IsExtendedSession"]
| extend account = customDimensions["prop__Account"] 
| extend details = customDimensions["prop__Details"] 
| extend instanceId = customDimensions["prop__InstanceId"] 
| extend messageId = customDimensions["prop__MessageId"] 
| extend executionId = customDimensions["prop__ExecutionId"] 
| extend age = customDimensions["prop__Age"] 
| extend latencyMs = customDimensions["prop__LatencyMs"] 
| extend dequeueCount = customDimensions["prop__DequeueCount"] 
| extend partitionId = customDimensions["prop__PartitionId"] 
| extend logLevel = customDimensions["LogLevel"] 
| extend eventCount = customDimensions["prop__TotalEventCount"] 
| extend taskHub = customDimensions["prop__TaskHub"] 
| extend pid = customDimensions["ProcessId"] 
| where instanceId == targetInstanceId
| sort by timestamp asc
| project timestamp, message, pid, severityLevel, messageId, executionId, partitionId, instanceId, eventType, eventId, age, extendedSession, logLevel, eventCount, dequeueCount, details, latencyMs, taskHub, account, sdkVersion, appName = cloud_RoleName
```

### Trace Errors/Warnings

The following query searches for errors and warnings for a given orchestration instance. You'll need to provide a value for `targetInstanceId`.

```kusto
let targetInstanceId = "XXXXXX"; // edit this
let start = datetime(XXXX-XX-XXTXX:XX:XX); 
 traces  
| where timestamp > start and timestamp < start + 1h
| extend instanceId = customDimensions["prop__InstanceId"] 
| extend logLevel = customDimensions["LogLevel"]
| extend functionName = customDimensions["prop__functionName"]
| extend status = customDimensions["prop__status"]
| extend details = customDimensions["prop__Details"] 
| where severityLevel > 1 //when severityLevel == 2, it's a warning; when severityLevel == 3, then it means a error. 
| where instanceId == targetInstanceId
| sort by timestamp asc 
```

|Column |Description |
|-------|------------|
|pid|Process ID of the function app instance. This is useful for determining if the process was recycled while an orchestration was executing.|
|taskName|The name of the event which can help understand what the orchestrator is doing.|
|eventType|The n type of message, usually representing work done by the orchestrator. A full list of it's possible values and their descriptions is [here](https://github.com/Azure/durabletask/blob/d76cf22bef5a298ab8744997758f4c8921457924/src/DurableTask.Core/History/EventType.cs#L19.)|
|eventId|An auto-incrementing integer value that identifies an activity, timer, or sub-orchestration for a particular orchestration instance.|
|extendedSession|Boolean value indicating whether ExtendedSessions is enabled.|
|Account|The storage account used by the app.|
|Details|Additional information about a particular event. This is where you would find error messages as well.|
|InstanceId|The ID for a given orchestration or entity instance.|
|MessageId|The unique Azure Storage ID for a particular queue message. This value most commonly appears in ReceivedMessage, ProcessingMessage, and DeletingMessage trace events. Note that it is NOT present in SendingMessage event because the message ID is generated by Azure Storage after we send the message. |
|ExecutionId|The ID of the orchestrator execution, which changes whenever `continue-as-new` is invoked.|
|Age|The number of milliseconds since a message was enqueued. Large numbers often indicate performance problems (except for TimerFired messages, which are supposed to have large Age values depending on how long the durable timer was scheduled for).|
|LatencyMs|The number of milliseconds taken by some storage operation.|
|DequeueCount|The number of times a message has been dequeued. Under normal circumstances, this value is always 1. If it is more than one, then there might be a problem.|
|PartitionId|This is both a) the name of the partition and b) the name of the queue for all message-related trace events.|
|logLevel|This indicates the message severity level. "Information" is for normal operations. Its values adhere to the [LogLevel Enum](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.logging.loglevel?view=dotnet-plat-ext-7.0#fields) definition.|
|TotalEventCount|The total number of history events function is operating on.|
|TaskHub|The name of your [task hub](./durable-functions-task-hubs.md).|