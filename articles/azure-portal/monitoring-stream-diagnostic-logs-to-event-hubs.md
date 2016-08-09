<properties
	pageTitle="Stream Azure Diagnostic Logs to Event Hubs | Microsoft Azure"
	description="Learn how to stream Azure Diagnostic Logs to Event Hubs."
	authors="johnkemnetz"
	manager="rboucher"
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring-and-diagnostics"/>

<tags
	ms.service="monitoring-and-diagnostics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/08/2016"
	ms.author="johnkem"/>

# Stream Azure Diagnostic Logs to Event Hubs

**[Azure Diagnostic Logs](monitoring-overview-of-diagnostic-logs.md)** can be streamed in near real time to any application using the built-in “Export to Event Hubs” option in the Portal, or by enabling the Service Bus Rule Id in a Diagnostic Setting via the Azure PowerShell Cmdlets or Azure CLI.

## What you can do with Diagnostics Logs and Event Hubs
Here are just a few ways you might use the streaming capability for Diagnostic Logs:

- **Stream logs to 3rd party logging and telemetry systems** – Over time, Event Hubs streaming will become the mechanism to pipe your Diagnostic Logs into third party SIEMs and log analytics solutions.

- **View service health by streaming “hot path” data to PowerBI** – Using Event Hubs, Stream Analytics, and PowerBI, you can easily transform your diagnostics data into near real-time insights on your Azure services. [This documentation article gives a great overview of how to set up an Event Hubs, process data with Stream Analytics, and use PowerBI as an output](../stream-analytics/stream-analytics-power-bi-dashboard.md). Here’s a few tips for getting set up with Diagnostic Logs:
	- The Event Hubs for a category of Diagnostic Logs is created automatically when you check the option in the portal or enable it through PowerShell, so you want to select the Event Hubs in the Service Bus namespace with the name that starts with “insights-”
	- Here’s a sample Stream Analytics query you can use to simply parse all the log data in to a PowerBI table:

```
SELECT
records.ArrayValue.[Properties you want to track]
INTO
[OutputSourceName – the PowerBI source]
FROM
[InputSourceName] AS e
CROSS APPLY GetArrayElements(e.records) AS records
```

- **Build a custom telemetry and logging platform** – If you already have a custom-built telemetry platform or are just thinking about building one, the highly scalable publish-subscribe nature of Event Hubs allows you to flexibly ingest diagnostic logs. [See Dan Rosanova’s guide to using Event Hubs in a global scale telemetry platform here](https://azure.microsoft.com/documentation/videos/build-2015-designing-and-sizing-a-global-scale-telemetry-platform-on-azure-event-Hubs/).

##Enable streaming of Diagnostic Logs
You can enable streaming of Diagnostic Logs programmatically, via the portal, or using the [Insights REST API](https://msdn.microsoft.com/library/azure/dn931943.aspx). Either way, you pick a Service Bus Namespace and an Event Hubs is created in the namespace for each log category you enable. A Diagnostic **Log Category** is a type of log that a resource may collect. You can select which log categories you’d like to collect for a particular resource in the Azure Portal under the Diagnostics blade.

![Log categories in the Portal](./media/monitoring-stream-diagnostic-logs-to-event-hubs/log-categories.png)

### Via PowerShell Cmdlets
To enable streaming via the [Azure PowerShell Cmdlets](insights-powershell-samples.md), you can use the `Set-AzureRmDiagnosticSetting` cmdlet with these parameters:
```
Set-AzureRmDiagnosticSetting -ResourceId [your resource Id] -ServiceBusRuleId [your service bus rule id] -Enabled $true
```
The Service Bus Rule ID is a string with this format: `{service bus resource ID}/authorizationrules/{key name}`, for example, `/subscriptions/{subscription ID}/resourceGroups/Default-ServiceBus-WestUS/providers/Microsoft.ServiceBus/namespaces/{service bus namespace}/authorizationrules/RootManageSharedAccessKey`.


### Via Azure CLI
To enable streaming via the [Azure CLI](insights-cli-samples.md), you can use the `insights diagnostic set` command like this:
```
azure insights diagnostic set --resourceId <resourceId> --serviceBusRuleId <serviceBusRuleId> --enabled true
```
Use the same format for Service Bus Rule ID as explained for the PowerShell Cmdlet.

###Via Azure Portal
To enable streaming via the Azure Portal, navigate to the diagnostics settings of a resource and select ‘Export to Event Hub.’

![Export to Event Hubs in the Portal](./media/monitoring-stream-diagnostic-logs-to-event-hubs/portal-export.png)

To configure it, select an existing Service Bus Namespace. The namespace selected will be where the Event Hubs is created (if this is your first time streaming diagnostic logs) or streamed to (if there are already resources that are streaming that log category to this namespace), and the policy defines the permissions that the streaming mechanism has. Today, streaming to an Event Hubs requires Manage, Read, and Send permissions. You can create or modify Service Bus Namespace shared access policies in the classic portal under the “Configure” tab for your Service Bus Namespace. To update one of these Diagnostic Settings, the client must have the ListKey permission on the Service Bus Authorization Rule.

##How do I consume the log data from Event Hubs?
Here is sample output data from the Event Hubs:

```
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

| Element Name | Description                                            |
|--------------|--------------------------------------------------------|
|records       | An array of all log events in this payload.            |
|time          | Time at which the event occurred.                      |
|category      | Log category for this event.                           |
|resourceId    | Resource ID of the resource that generated this event. |
|operationName | Name of the operation.                                 |
|level         | Optional. Indicates the log event level.               |
|properties    | Properties of the event.                               |


You can view a list of all resource providers that support streaming to Event Hub [here](monitoring-diagnostic-logs-supported-services.md).

##Next Steps
- [Read more about Azure Diagnostic Logs](monitoring-overview-of-diagnostic-logs.md)
