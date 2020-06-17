---
title: Stream Azure platform logs to an event hub
description: Learn how to stream Azure resource logs to an event hub to send data to external systems such as third-party SIEMs and other log analytics solutions.
author: bwren
services: azure-monitor

ms.topic: conceptual
ms.date: 12/15/2019
ms.author: bwren
ms.subservice: ""
---
# Stream Azure platform logs to Azure Event Hubs
[Platform logs](platform-logs-overview.md) in Azure, including Azure Activity log and resource logs, provide detailed diagnostic and auditing information for Azure resources and the Azure platform they depend on.  This article describes streaming platform logs to event hubs to send data to external systems such as third-party SIEMs and other log analytics solutions.


## What you can do with platform logs sent to an event hub
Stream platform logs in Azure to event hubs to provide the following functionality:

* **Stream logs to 3rd party logging and telemetry systems** – Stream all of your platform logs to a single event hub to pipe log data to a third-party SIEM or log analytics tool.
  
* **Build a custom telemetry and logging platform** – The highly scalable publish-subscribe nature of event hubs allows you to flexibly ingest platform logs into a custom teletry platform. See [Designing and Sizing a Global Scale Telemetry Platform on Azure Event Hubs](https://azure.microsoft.com/documentation/videos/build-2015-designing-and-sizing-a-global-scale-telemetry-platform-on-azure-event-Hubs/) for details.

* **View service health by streaming data to Power BI** – Use Event Hubs, Stream Analytics, and Power BI to transform your diagnostics data into near real-time insights on your Azure services. See [Stream Analytics and Power BI: A real-time analytics dashboard for streaming data](../../stream-analytics/stream-analytics-power-bi-dashboard.md) for details on this solution.

    The following SQL code is a sample Stream Analytics query that you can use to parse all the log data in to a Power BI table:
    
    ```sql
    SELECT
    records.ArrayValue.[Properties you want to track]
    INTO
    [OutputSourceName – the Power BI source]
    FROM
    [InputSourceName] AS e
    CROSS APPLY GetArrayElements(e.records) AS records
    ```

## Prerequisites
You need to [create an event hub](../../event-hubs/event-hubs-create.md) if you don't already have one. If you already have a diagnostic setting using this Event Hubs namespace, then that event hub will be reused.

The shared access policy for the namespace defines the permissions that the streaming mechanism has. Streaming to Event Hubs requires Manage, Send, and Listen permissions. You can create or modify shared access policies in the Azure portal under the Configure tab for your Event Hubs namespace.

To update the diagnostic setting to include streaming, you must have the ListKey permission on that Event Hubs authorization rule. The Event Hubs namespace does not have to be in the same subscription as the subscription that's emitting logs, as long as the user who configures the setting has appropriate RBAC access to both subscriptions and both subscriptions are in the same AAD tenant.

## Create a diagnostic setting
Send platform logs to an event hub and other destinations by creating a diagnostic setting for an Azure resource. See [Create diagnostic setting to collect logs and metrics in Azure](diagnostic-settings.md) for details.

## Collect data from compute resources
Diagnostic settings will collect resource logs for Azure compute resources like any other resource, but not their guest operating system or workloads. To collect this data, install the [Log Analytics agent](log-analytics-agent.md). 


## Consuming log data from event hubs
Platform logs from event hubs are consumed in JSON format with the elements in the following table.

| Element Name | Description |
| --- | --- |
| records |An array of all log events in this payload. |
| time |Time at which the event occurred. |
| category |Log category for this event. |
| resourceId |Resource ID of the resource that generated this event. |
| operationName |Name of the operation. |
| level |Optional. Indicates the log event level. |
| properties |Properties of the event. These will vary for each Azure service as described in [](). |


Following is sample output data from Event Hubs for a resource log:

```json
{
    "records": [
        {
            "time": "2016-07-15T18:00:22.6235064Z",
            "workflowId": "/SUBSCRIPTIONS/DF602C9C-7AA0-407D-A6FB-EB20C8BD1192/RESOURCEGROUPS/JOHNKEMTEST/PROVIDERS/MICROSOFT.LOGIC/WORKFLOWS/JOHNKEMTESTLA",
            "resourceId": "/SUBSCRIPTIONS/DF602C9C-7AA0-407D-A6FB-EB20C8BD1192/RESOURCEGROUPS/JOHNKEMTEST/PROVIDERS/MICROSOFT.LOGIC/WORKFLOWS/JOHNKEMTESTLA/RUNS/08587330013509921957/ACTIONS/SEND_EMAIL",
            "category": "WorkflowRuntime",
            "level": "Error",
            "operationName": "Microsoft.Logic/workflows/workflowActionCompleted",
            "properties": {
                "$schema": "2016-04-01-preview",
                "startTime": "2016-07-15T17:58:55.048482Z",
                "endTime": "2016-07-15T18:00:22.4109204Z",
                "status": "Failed",
                "code": "BadGateway",
                "resource": {
                    "subscriptionId": "df602c9c-7aa0-407d-a6fb-eb20c8bd1192",
                    "resourceGroupName": "JohnKemTest",
                    "workflowId": "243aac67fe904cf195d4a28297803785",
                    "workflowName": "JohnKemTestLA",
                    "runId": "08587330013509921957",
                    "location": "westus",
                    "actionName": "Send_email"
                },
                "correlation": {
                    "actionTrackingId": "29a9862f-969b-4c70-90c4-dfbdc814e413",
                    "clientTrackingId": "08587330013509921958"
                }
            }
        },
        {
            "time": "2016-07-15T18:01:15.7532989Z",
            "workflowId": "/SUBSCRIPTIONS/DF602C9C-7AA0-407D-A6FB-EB20C8BD1192/RESOURCEGROUPS/JOHNKEMTEST/PROVIDERS/MICROSOFT.LOGIC/WORKFLOWS/JOHNKEMTESTLA",
            "resourceId": "/SUBSCRIPTIONS/DF602C9C-7AA0-407D-A6FB-EB20C8BD1192/RESOURCEGROUPS/JOHNKEMTEST/PROVIDERS/MICROSOFT.LOGIC/WORKFLOWS/JOHNKEMTESTLA/RUNS/08587330012106702630/ACTIONS/SEND_EMAIL",
            "category": "WorkflowRuntime",
            "level": "Information",
            "operationName": "Microsoft.Logic/workflows/workflowActionStarted",
            "properties": {
                "$schema": "2016-04-01-preview",
                "startTime": "2016-07-15T18:01:15.5828115Z",
                "status": "Running",
                "resource": {
                    "subscriptionId": "df602c9c-7aa0-407d-a6fb-eb20c8bd1192",
                    "resourceGroupName": "JohnKemTest",
                    "workflowId": "243aac67fe904cf195d4a28297803785",
                    "workflowName": "JohnKemTestLA",
                    "runId": "08587330012106702630",
                    "location": "westus",
                    "actionName": "Send_email"
                },
                "correlation": {
                    "actionTrackingId": "042fb72c-7bd4-439e-89eb-3cf4409d429e",
                    "clientTrackingId": "08587330012106702632"
                }
            }
        }
    ]
}
```



## Next steps

* [Read more about resource logs](platform-logs-overview.md).
* [Create diagnostic setting to collect logs and metrics in Azure](diagnostic-settings.md).
* [Stream Azure Active Directory logs with Azure Monitor](../../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md).
* [Get started with Event Hubs](../../event-hubs/event-hubs-dotnet-standard-getstarted-send.md).

