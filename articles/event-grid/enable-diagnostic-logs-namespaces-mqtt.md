---
title: Enable diagnostic logs for Event Grid namespaces (MQTT)
description: This article provides step-by-step instructions on how to enable diagnostic logs for Event Grid namespaces.
ms.topic: how-to
ms.date: 01/17/2024
---

# Enable diagnostic logs for Event Grid namespaces (MQTT)

This article provides step-by-step instructions for enabling diagnostic settings for Event Grid namespaces. These settings allow you to capture and view diagnostic information so that you can troubleshoot any failures. The following table shows the settings available for Event Grid namespaces.

- Successful MQTT connections
- Failed MQTT connections
- MQTT disconnections
- Failed MQTT published messages
- Failed MQTT subscription operations

> [!IMPORTANT]
> For schemas of delivery failures, publish failures, and data plane requests, see [Diagnostic logs](monitor-mqtt-delivery-reference.md). 

## Prerequisites

- A provisioned Event Grid namespace with MQTT broker enabled. 
- One of the following destinations for capturing diagnostic logs: Log Analytics workspace, Azure Storage account, Event Hubs resource, or a partner solution

## Enable diagnostic logs for Event Grid namespaces

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the search bar at the top, search for **Event Grid namespaces**.
1. Select the **namespace** from the list for which you want to configure diagnostic settings.
1. Select **Diagnostic settings** under **Monitoring** in the left menu.
1. On the **Diagnostic settings** page, select **Add New Diagnostic Setting**.

    :::image type="content" source="./media/enable-diagnostic-logs-namespaces-mqtt/diagnostic-settings-page.png" alt-text="Screenshots showing the Diagnostic settings page of an Event Grid namespace.":::
1. Specify a **name** for the diagnostic setting.
1. If you want to enable logs for all categories, select the **allLogs** option in the **Logs** section. Otherwise, select one or more categories in the **Categories** section. If you select the **Audit** option, the **Successful MQTT connections** and **MQTT disconnections** categories are selected. You can also enable collection of **all metrics** for the namespace.

    :::image type="content" source="./media/enable-diagnostic-logs-namespaces-mqtt/log-failures.png" alt-text="Screenshot that shows the Diagnostic setting page with All logs and all metrics selected.":::    
1. In the **Destination details** section on the right, enable one or more of the capture destinations for the logs, and then configure them by selecting a previously created resource. 
1. Select **Save**. Then, select **X** in the right-corner to close the page.

    :::image type="content" source="./media/enable-diagnostic-logs-namespaces-mqtt/specify-destination.png" alt-text="Screenshot that shows selection of destinations for the diagnostic information for the Event Grid namespace with MQTT enabled."::: 
1. Now, back on the **Diagnostic settings** page, confirm that you see a new entry in the **Diagnostics Settings** table.

    :::image type="content" source="./media/enable-diagnostic-logs-namespaces-mqtt/saved-diagnostic-setting.png" alt-text="Screenshot that shows saved diagnostic configuration for the Event Grid namespace with MQTT enabled."::: 


## View diagnostic logs in Azure Storage

1. Once you enable a storage account as a capture destination, Event Grid starts emitting diagnostic logs. You should see new containers named **insights-logs-deliveryfailures** and **insights-logs-publishfailures** in the storage account.

    ![Storage - containers for diagnostic logs](./media/enable-diagnostic-logs-topic/storage-containers.png)
2. As you navigate through one of the containers, you'll end up at a blob in JSON format. The file contains log entries for either a delivery failure or a publish failure. The navigation path represents the **ResourceId** of the Event Grid topic and the timestamp (minute level) as to when the log entries were emitted. The blob/JSON file, which is downloadable, in the end adheres to the schema described in the next section.

    ![JSON file in the storage](./media/enable-diagnostic-logs-topic/select-json.png)
3. You should see content in the JSON file similar to the following example:

    ```json
    {
        "time": "2019-11-01T00:17:13.4389048Z",
        "resourceId": "/SUBSCRIPTIONS/SAMPLE-SUBSCTIPTION-ID /RESOURCEGROUPS/SAMPLE-RESOURCEGROUP-NAME/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/SAMPLE-TOPIC-NAME ",
        "eventSubscriptionName": "SAMPLEDESTINATION",
        "category": "DeliveryFailures",
        "operationName": "Deliver",
        "message": "Message:outcome=NotFound, latencyInMs=2635, id=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx, systemId=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, state=FilteredFailingDelivery, deliveryTime=11/1/2019 12:17:10 AM, deliveryCount=0, probationCount=0, deliverySchema=EventGridEvent, eventSubscriptionDeliverySchema=EventGridEvent, fields=InputEvent, EventSubscriptionId, DeliveryTime, State, Id, DeliverySchema, LastDeliveryAttemptTime, SystemId, fieldCount=, requestExpiration=1/1/0001 12:00:00 AM, delivered=False publishTime=11/1/2019 12:17:10 AM, eventTime=11/1/2019 12:17:09 AM, eventType=Type, deliveryTime=11/1/2019 12:17:10 AM, filteringState=FilteredWithRpc, inputSchema=EventGridEvent, publisher=DIAGNOSTICLOGSTEST-EASTUS.EASTUS-1.EVENTGRID.AZURE.NET, size=363, fields=Id, PublishTime, SerializedBody, EventType, Topic, Subject, FilteringHashCode, SystemId, Publisher, FilteringTopic, TopicCategory, DataVersion, MetadataVersion, InputSchema, EventTime, fieldCount=15, url=sb://diagnosticlogstesting-eastus.servicebus.windows.net/, deliveryResponse=NotFound: The messaging entity 'sb://diagnosticlogstesting-eastus.servicebus.windows.net/eh-diagnosticlogstest' could not be found. TrackingId:c98c5af6-11f0-400b-8f56-c605662fb849_G14, SystemTracker:diagnosticlogstesting-eastus.servicebus.windows.net:eh-diagnosticlogstest, Timestamp:2019-11-01T00:17:13, referenceId: ac141738a9a54451b12b4cc31a10dedc_G14:"
    }
    ```

## Use Azure Resource Manager template

Here's a sample Azure Resource Manager template to enable diagnostic settings for an Event Grid naemspace. When you deploy this sample template, the following resources are created.

- An Event Grid namespace with MQTT feature enabled.
- A Log Analytics workspace

Then, it creates a diagnostic setting on the topic to send diagnostic information to the Log Analytics workspace.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "event-grid-namespace-name": {
            "defaultValue": "spegridns",
            "type": "String"
        },
        "log_analytics_workspace_name": {
            "defaultValue": "splogaw",
            "type": "String"
        },
        "location": {
            "defaultValue": "eastus",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.EventGrid/namespaces",
            "apiVersion": "2023-12-15-preview",
            "name": "[parameters('event-grid-namespace-name')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Standard",
                "capacity": 1
            },
            "identity": {
                "type": "None"
            },
            "properties": {
            }
        },
        {
            "type": "Microsoft.OperationalInsights/workspaces",
            "apiVersion": "2023-09-01",
            "name": "[parameters('log_analytics_workspace_name')]",
            "location": "[parameters('location')]",
            "properties": {
                "sku": {
                    "name": "pergb2018"
                },
                "retentionInDays": 30,
                "features": {
                    "enableLogAccessUsingOnlyResourcePermissions": true
                },
                "workspaceCapping": {
                    "dailyQuotaGb": -1
                },
                "publicNetworkAccessForIngestion": "Enabled",
                "publicNetworkAccessForQuery": "Enabled"
            }
        },
        {
            "type": "Microsoft.EventGrid/namespaces/providers/diagnosticSettings",
            "apiVersion": "2023-12-15-preview",
            "name": "[concat(parameters('event-grid-namespace-name'), '/', 'Microsoft.Insights/', parameters('log_analytics_workspace_name'))]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[resourceId('Microsoft.EventGrid/namespaces', parameters('event-grid-namespace-name'))]",
                "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('log_analytics_workspace_name'))]"
            ],
            "properties": {
                "workspaceId": "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('log_analytics_workspace_name'))]",
                "metrics": [
                    {
                        "category": "AllMetrics",
                        "enabled": true
                    }
                ],
                "logs": [
                    {
                        "category": "AllLogs",
                        "enabled": true
                    }
                ]
            }
        }
    ]
}
```


## Next steps

For the log schema and other conceptual information about diagnostic logs for topics or domains, see [Diagnostic logs](monitor-mqtt-delivery-reference.md).
