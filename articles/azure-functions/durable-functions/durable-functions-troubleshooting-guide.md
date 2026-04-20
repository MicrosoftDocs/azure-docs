---
title: Durable Functions Troubleshooting Guide - Azure Functions
description: Guide to troubleshoot common issues with durable functions.
author: nytian
ms.topic: troubleshooting
ms.service: azure-functions
ms.date: 03/10/2023
ms.author: azfuncdf
---

# Durable Functions troubleshooting guide

Durable Functions is an extension of [Azure Functions](../functions-overview.md) that lets you build serverless orchestrations using ordinary code. For more information about Durable Functions, see [Durable Functions overview](../../durable-task/common/what-is-durable-task.md).

This article helps you troubleshoot common scenarios in Durable Functions apps.

> [!NOTE]
> Microsoft support engineers are available to help diagnose issues with your application. If you can't diagnose your problem using this guide, file a support ticket by opening the **New Support request** blade in the **Support + troubleshooting** section of your function app page in the Azure portal.

:::image type="content" source="./media/durable-functions-troubleshooting-guide/durable-function-support-request.png" alt-text="Screenshot of the support request page in the Azure portal.":::

> [!TIP]
> When debugging and diagnosing issues, we recommend that you start by ensuring your app uses the latest Durable Functions extension version. Most of the time, using the latest version mitigates known issues already reported by other users. For instructions on how to upgrade your extension version, see [Upgrade Durable Functions extension version](./durable-functions-extension-upgrade.md). 

The **Diagnose and solve problems** tab in the Azure portal is a useful resource to monitor and diagnose possible issues related to your application. It also provides potential solutions to your problems based on the diagnosis. For more information, see [Azure Function app diagnostics](./function-app-diagnostics.md). 

If the previous resources didn't solve your problem, the following sections provide advice for specific application symptoms:

## Orchestration is stuck in the `Pending` state

When you start an orchestration, a "start" message is written to an internal queue managed by the Durable extension, and the status of the orchestration is set to "Pending". After an available app instance picks up and successfully processes the orchestration message, the status transitions to "Running" (or to some other non-"Pending" state).

Follow these steps to troubleshoot orchestration instances that remain stuck indefinitely in the "Pending" state. 

*  Check the Durable Task Framework traces for warnings or errors for the affected orchestration instance ID. Find a sample query in the [Trace Errors/Warnings section](#trace-errors-and-warnings).

*  Check the Azure Storage control queues assigned to the stuck orchestrator to see if its "start message" is still there. For more information on control queues, see the [Azure Storage provider control queue documentation](durable-functions-azure-storage-provider.md#control-queues).

*  Change your app's [platform configuration](../../app-service/configure-common.md#configure-general-settings) version to "64 Bit". 
   Sometimes orchestrations don't start because the app is running out of memory. Switching to a 64-bit process lets the app allocate more total memory. This change only applies to App Service Basic, Standard, Premium, and Elastic Premium plans. Free or Consumption plans **do not** support 64-bit processes. 

## Orchestrations start after a long delay

Normally, orchestrations start within a few seconds after they're scheduled. However, orchestrations might take longer to start in certain cases. Follow these steps to troubleshoot when orchestrations take more than a few seconds to start executing.

*  Refer to the [documentation on delayed orchestrations in Azure Storage](./durable-functions-azure-storage-provider.md#orchestration-start-delays) to check whether the delay is caused by known limitations.

*  Check the Durable Task Framework traces for warnings or errors with the affected orchestration instance ID. Find a sample query in the [Trace Errors/Warnings section](#trace-errors-and-warnings).

## Orchestration doesn't complete or is stuck in the `Running` state

If an orchestration remains in the "Running" state for a long period of time, it usually means that it's waiting for a long-running task scheduled to complete. For example, it could be waiting for a durable timer task, an activity task, or an external event task to be completed. If you observe that scheduled tasks completed successfully but the orchestration still isn't making progress, there might be a problem preventing the orchestration from proceeding to its next task. Orchestrations in this state are often called "stuck orchestrations".

Follow these steps to troubleshoot stuck orchestrations:

*  Try restarting the function app. This step can help if the orchestration gets stuck because of a transient bug or deadlock in either the app or the extension code.

*  Check the Azure Storage account control queues to see if any queues are growing continuously. [This Azure Storage messaging KQL query](./durable-functions-troubleshooting-guide.md#azure-storage-messaging) can help identify problems with dequeuing orchestration messages. If the problem affects only a single control queue, it might indicate a problem that exists only on a specific app instance, in which case scaling up or down to move off the unhealthy VM instance could help.

*  Use the Application Insights query in the [Azure Storage Messaging section](./durable-functions-troubleshooting-guide.md#azure-storage-messaging) to filter on that queue name as the Partition ID and look for any problems related to that control queue partition.

*  Check the [Durable Functions Versioning documentation](durable-functions-versioning.md). Some problems might be caused by breaking changes to in-flight orchestration instances.

## Orchestration runs slow

Heavy data processing, internal errors, and insufficient compute resources can cause orchestrations to run slower than normal. Follow these steps to troubleshoot orchestrations that take longer than expected to run:

*  Check the Durable Task Framework traces for warnings or errors for the impacted orchestration instance ID. A sample query can be found in the [Trace Errors/Warnings section](#trace-errors-and-warnings).

*  If your app uses the .NET in-process model, consider enabling [extended sessions](./durable-functions-azure-storage-provider.md#extended-sessions). 
   Extended sessions minimize history loads, which can slow down processing.

*  Check for performance and scalability bottlenecks. 
   Application performance depends on many factors. For example, high CPU usage or large memory consumption can result in delays. For detailed guidance, see [Performance and scale in Durable Functions](./durable-functions-perf-and-scale.md).

## Sample queries

Troubleshoot issues by writing custom [KQL queries](/azure/data-explorer/kusto/query/) in the Azure Application Insights instance configured for your Azure Functions app.

### Azure Storage messaging

When you use the default Azure Storage provider, all Durable Functions behavior is driven by Azure Storage queue messages, and all state related to an orchestration is stored in table storage and blob storage. When you enable Durable Task Framework tracing, all Azure Storage interactions are logged to Application Insights. This data is critically important for debugging execution and performance problems.

Starting in v2.3.0 of the Durable Functions extension, you can publish these Durable Task Framework logs to your Application Insights instance by updating your logging configuration in the *host.json* file. For more information, see [Durable Task Framework logging article](./durable-functions-diagnostics.md).

The following query inspects end-to-end Azure Storage interactions for a specific orchestration instance. Edit `start` and `orchestrationInstanceID` to filter by time range and instance ID.

```kusto
let start = datetime(XXXX-XX-XXTXX:XX:XX); // edit this 
let orchestrationInstanceID = "XXXXXXX"; //edit this
traces  
| where timestamp > start and timestamp < start + 1h 
| where customDimensions.Category == "DurableTask.AzureStorage" 
| extend taskName = customDimensions["EventName"]
| extend eventType = customDimensions["prop__EventType"] 
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
| extend eventCount = customDimensions["prop__TotalEventCount"] 
| extend taskHub = customDimensions["prop__TaskHub"] 
| extend pid = customDimensions["ProcessId"]
| extend appName = cloud_RoleName
| extend newEvents = customDimensions["prop__NewEvents"]
| where instanceId == orchestrationInstanceID
| sort by timestamp asc
| project timestamp, appName, severityLevel, pid, taskName, eventType, message, details, messageId, partitionId, instanceId, executionId, age, latencyMs, dequeueCount, eventCount, newEvents, taskHub, account, extendedSession, sdkVersion
```

### Trace errors and warnings

The following query searches for errors and warnings for a given orchestration instance. Provide a value for `orchestrationInstanceID`.

```kusto
let orchestrationInstanceID = "XXXXXX"; // edit this
let start = datetime(XXXX-XX-XXTXX:XX:XX); 
traces  
| where timestamp > start and timestamp < start + 1h
| extend instanceId = iif(isnull(customDimensions["prop__InstanceId"] ) , customDimensions["prop__instanceId"], customDimensions["prop__InstanceId"] ) 
| extend logLevel = customDimensions["LogLevel"]
| extend functionName = customDimensions["prop__functionName"]
| extend status = customDimensions["prop__status"]
| extend details = customDimensions["prop__Details"] 
| extend reason = customDimensions["prop__reason"]
| where severityLevel >= 1 // to see all logs of severity level "Information" or greater.
| where instanceId == orchestrationInstanceID
| sort by timestamp asc 
```

### Control queue and partition ID logs

The following query searches for all activity associated with an instanceId's control queue. Provide the value for the instanceID in `orchestrationInstanceID` and the query's start time in `start`.

```kusto
let orchestrationInstanceID = "XXXXXX"; // edit this
let start = datetime(XXXX-XX-XXTXX:XX:XX); // edit this
traces  // determine control queue for this orchestrator
| where timestamp > start and timestamp < start + 1h 
| extend instanceId = customDimensions["prop__TargetInstanceId"] 
| extend partitionId = tostring(customDimensions["prop__PartitionId"])
| where partitionId contains "control" 
| where instanceId == orchestrationInstanceID
| join kind = rightsemi(
traces  
| where timestamp > start and timestamp < start + 1h 
| where customDimensions.Category == "DurableTask.AzureStorage" 
| extend taskName = customDimensions["EventName"]
| extend eventType = customDimensions["prop__EventType"] 
| extend extendedSession = customDimensions["prop__IsExtendedSession"]
| extend account = customDimensions["prop__Account"] 
| extend details = customDimensions["prop__Details"] 
| extend instanceId = customDimensions["prop__InstanceId"] 
| extend messageId = customDimensions["prop__MessageId"] 
| extend executionId = customDimensions["prop__ExecutionId"] 
| extend age = customDimensions["prop__Age"] 
| extend latencyMs = customDimensions["prop__LatencyMs"] 
| extend dequeueCount = customDimensions["prop__DequeueCount"] 
| extend partitionId = tostring(customDimensions["prop__PartitionId"])
| extend eventCount = customDimensions["prop__TotalEventCount"] 
| extend taskHub = customDimensions["prop__TaskHub"] 
| extend pid = customDimensions["ProcessId"]
| extend appName = cloud_RoleName
| extend newEvents = customDimensions["prop__NewEvents"]
) on partitionId
| sort by timestamp asc
| project timestamp, appName, severityLevel, pid, taskName, eventType, message, details, messageId, partitionId, instanceId, executionId, age, latencyMs, dequeueCount, eventCount, newEvents, taskHub, account, extendedSession, sdkVersion
```

### Application Insights column reference

The following table lists the columns projected by the preceding queries and their descriptions.

|Column |Description |
|-------|------------|
|pid|Process ID of the function app instance. This value is useful for checking if the process was recycled while an orchestration was running.|
|taskName|The name of the event being logged.|
|eventType|The type of message, which usually represents work done by an orchestrator. For a full list of possible values and their descriptions, see [EventType.cs](https://github.com/Azure/durabletask/blob/main/src/DurableTask.Core/History/EventType.cs).|
|extendedSession|Boolean value indicating whether [extended sessions](durable-functions-azure-storage-provider.md#extended-sessions) are enabled.|
|account|The storage account used by the app.|
|details|Additional information about a particular event, if available.|
|instanceId|The ID for a given orchestration or entity instance.|
|messageId|The unique Azure Storage ID for a given queue message. This value most commonly appears in ReceivedMessage, ProcessingMessage, and DeletingMessage trace events. This value isn't present in SendingMessage events because the message ID is generated by Azure Storage _after_ the message is sent.|
|executionId|The ID of the orchestrator execution, which changes whenever `continue-as-new` is invoked.|
|age|The number of milliseconds since a message was enqueued. Large numbers often indicate performance problems. An exception is the TimerFired message type, which might have a large Age value depending on the timer's duration.|
|latencyMs|The number of milliseconds taken by some storage operation.|
|dequeueCount|The number of times a message is dequeued. Under normal circumstances, this value is always 1. If it's more than one, there might be a problem.|
|partitionId|The name of the queue associated with this log.|
|totalEventCount|The number of history events involved in the current action.|
|taskHub|The name of your [task hub](../../durable-task/common/durable-task-hubs.md).|
|newEvents|A comma-separated list of history events that are being written to the History table in storage.|

## Connection management issues in the consumption plan

Apps running on the Azure Functions Consumption plan are subject to connection limits. If you experience connectivity errors or orchestrations that fail intermittently because of exhausted connections, see [Manage connections in Azure Functions](../manage-connections.md?toc=/azure/azure-functions/durable-functions/toc.json) for guidance on connection pooling and best practices to reduce connection usage.

## Getting support

For questions and support, open an issue in one of the following GitHub repos. When you report a bug in Azure, include information like affected instance IDs, time ranges in UTC showing the problem, the application name (if possible), and deployment region to greatly speed up investigations.

- [Durable Functions extension and .NET in-process SDK](https://github.com/Azure/azure-functions-durable-extension/issues)
- [.NET isolated SDK](https://github.com/microsoft/durabletask-dotnet/issues)
- [Durable Functions for Java](https://github.com/microsoft/durabletask-java/issues)
- [Durable Functions for JavaScript](https://github.com/Azure/azure-functions-durable-js/issues)
- [Durable Functions for Python](https://github.com/Azure/azure-functions-durable-python/issues)
