---
title: Stream Azure Diagnostic Logs to an event hub
description: Learn how to stream Azure diagnostic logs to an event hub.
author: johnkemnetz
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 07/25/2018
ms.author: johnkem
ms.subservice: ""
---
# Stream Azure Diagnostic Logs to an event hub
**[Azure diagnostic logs](diagnostic-logs-overview.md)** can be streamed in near real time to any application using the built-in “Export to Event Hubs” option in the Portal, or by enabling the Event Hub Authorization Rule ID in a diagnostic setting via the Azure PowerShell Cmdlets or Azure CLI.

## What you can do with diagnostics logs and Event Hubs
Here are just a few ways you might use the streaming capability for Diagnostic Logs:

* **Stream logs to 3rd party logging and telemetry systems** – You can stream all of your diagnostic logs to a single event hub to pipe log data to a third-party SIEM or log analytics tool.
* **View service health by streaming “hot path” data to Power BI** – Using Event Hubs, Stream Analytics, and Power BI, you can easily transform your diagnostics data in to near real-time insights on your Azure services. [This documentation article gives a great overview of how to set up Event Hubs, process data with Stream Analytics, and use Power BI as an output](../../stream-analytics/stream-analytics-power-bi-dashboard.md). Here are a few tips for getting set up with diagnostic logs:

  * An event hub for a category of diagnostic logs is created automatically when you check the option in the portal or enable it through PowerShell, so you want to select the event hub in the namespace with the name that starts with **insights-**.
  * The following SQL code is a sample Stream Analytics query that you can use to parse all the log data in to a Power BI table:

    ```sql
    SELECT
    records.ArrayValue.[Properties you want to track]
    INTO
    [OutputSourceName – the Power BI source]
    FROM
    [InputSourceName] AS e
    CROSS APPLY GetArrayElements(e.records) AS records
    ```

* **Build a custom telemetry and logging platform** – If you already have a custom-built telemetry platform or are just thinking about building one, the highly scalable publish-subscribe nature of Event Hubs allows you to flexibly ingest diagnostic logs. [See Dan Rosanova’s guide to using Event Hubs in a global scale telemetry platform here](https://azure.microsoft.com/documentation/videos/build-2015-designing-and-sizing-a-global-scale-telemetry-platform-on-azure-event-Hubs/).

## Enable streaming of diagnostic logs

You can enable streaming of diagnostic logs programmatically, via the portal, or using the [Azure Monitor REST APIs](https://docs.microsoft.com/rest/api/monitor/diagnosticsettings). Either way, you create a diagnostic setting in which you specify an Event Hubs namespace and the log categories and metrics you want to send in to the namespace. An event hub is created in the namespace for each log category you enable. A diagnostic **log category** is a type of log that a resource may collect.

> [!WARNING]
> Enabling and streaming diagnostic logs from Compute resources (for example, VMs or Service Fabric) [requires a different set of steps](../../azure-monitor/platform/diagnostics-extension-stream-event-hubs.md).

The Event Hubs namespace does not have to be in the same subscription as the resource emitting logs as long as the user who configures the setting has appropriate RBAC access to both subscriptions and both subscriptions are part of the same AAD tenant.

> [!NOTE]
> Sending multi-dimensional metrics via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values.
>
> *For example*: The 'Incoming Messages' metric on an Event Hub can be explored and charted on a per queue level. However, when exported via diagnostic settings the metric will be represented as all incoming messages across all queues in the Event Hub.
>
>

## Stream diagnostic logs using the portal

1. In the portal, navigate to Azure Monitor and click on **Diagnostic Settings**

    ![Monitoring section of Azure Monitor](media/diagnostic-logs-stream-event-hubs/diagnostic-settings-blade.png)

2. Optionally filter the list by resource group or resource type, then click on the resource for which you would like to set a diagnostic setting.

3. If no settings exist on the resource you have selected, you are prompted to create a setting. Click "Turn on diagnostics."

   ![Add diagnostic setting - no existing settings](media/diagnostic-logs-stream-event-hubs/diagnostic-settings-none.png)

   If there are existing settings on the resource, you will see a list of settings already configured on this resource. Click "Add diagnostic setting."

   ![Add diagnostic setting - existing settings](media/diagnostic-logs-stream-event-hubs/diagnostic-settings-multiple.png)

3. Give your setting a name and check the box for **Stream to an event hub**, then select an Event Hubs namespace.

   ![Add diagnostic setting - existing settings](media/diagnostic-logs-stream-event-hubs/diagnostic-settings-configure.png)

   The namespace selected will be where the event hub is created (if this is your first time streaming diagnostic logs) or streamed to (if there are already resources that are streaming that log category to this namespace), and the policy defines the permissions that the streaming mechanism has. Today, streaming to an event hub requires Manage, Send, and Listen permissions. You can create or modify Event Hubs namespace shared access policies in the portal under the Configure tab for your namespace. To update one of these diagnostic settings, the client must have the ListKey permission on the Event Hubs authorization rule. You can also optionally specify an event hub name. If you specify an event hub name, logs are routed to that event hub rather than to a newly created event hub per log category.

4. Click **Save**.

After a few moments, the new setting appears in your list of settings for this resource, and diagnostic logs are streamed to that event hub as soon as new event data is generated.

### Via PowerShell Cmdlets

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

To enable streaming via the [Azure PowerShell Cmdlets](../../azure-monitor/platform/powershell-quickstart-samples.md), you can use the `Set-AzDiagnosticSetting` cmdlet with these parameters:

```powershell
Set-AzDiagnosticSetting -ResourceId [your resource ID] -EventHubAuthorizationRuleId [your Event Hub namespace auth rule ID] -Enabled $true
```

The Event Hub Authorization Rule ID is a string with this format: `{Event Hub namespace resource ID}/authorizationrules/{key name}`, for example, `/subscriptions/{subscription ID}/resourceGroups/{resource group}/providers/Microsoft.EventHub/namespaces/{Event Hub namespace}/authorizationrules/RootManageSharedAccessKey`. You cannot currently select a particular event hub name with PowerShell.

### Via Azure CLI

To enable streaming via the [Azure CLI](https://docs.microsoft.com/cli/azure/monitor?view=azure-cli-latest), you can use the [az monitor diagnostic-settings create](https://docs.microsoft.com/cli/azure/monitor/diagnostic-settings?view=azure-cli-latest#az-monitor-diagnostic-settings-create) command.

```azurecli
az monitor diagnostic-settings create --name <diagnostic name> \
    --event-hub <event hub name> \
    --event-hub-rule <event hub rule ID> \
    --resource <target resource object ID> \
    --logs '[
    {
        "category": <category name>,
        "enabled": true
    }
    ]'
```

You can add additional categories to the diagnostic log by adding dictionaries to the JSON array passed as the `--logs` parameter.

The `--event-hub-rule` argument uses the same format as the Event Hub Authorization Rule ID as explained for the PowerShell Cmdlet.

## How do I consume the log data from Event Hubs?

Here is sample output data from Event Hubs:

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

| Element Name | Description |
| --- | --- |
| records |An array of all log events in this payload. |
| time |Time at which the event occurred. |
| category |Log category for this event. |
| resourceId |Resource ID of the resource that generated this event. |
| operationName |Name of the operation. |
| level |Optional. Indicates the log event level. |
| properties |Properties of the event. |

You can view a list of all resource providers that support streaming to Event Hubs [here](diagnostic-logs-overview.md).

## Stream data from Compute resources

You can also stream diagnostic logs from Compute resources using the Windows Azure Diagnostics agent. [See this article](../../azure-monitor/platform/diagnostics-extension-stream-event-hubs.md) for how to set that up.

## Next steps

* [Stream Azure Active Directory logs with Azure Monitor](../../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md)
* [Read more about Azure Diagnostic Logs](diagnostic-logs-overview.md)
* [Get started with Event Hubs](../../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)

