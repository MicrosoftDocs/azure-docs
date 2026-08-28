---
title: Enable Diagnostic Logs for Azure Event Grid
description: Learn how to enable diagnostic logs for Azure Event Grid resources to capture and troubleshoot delivery and publish failures across topics and domains.
ms.topic: how-to
ms.custom: devx-track-arm-template, build-2023
ms.date: 08/27/2026
author: robece
ms.author: robece
ai-usage: ai-assisted
#customer intent: As an Event Grid user, I want to enable diagnostic logs for my Event Grid resources so that I can capture and troubleshoot delivery and publish failures.
---

# Enable diagnostic logs for Event Grid resources

This article provides step-by-step instructions for enabling diagnostic settings for Event Grid resources. Diagnostic settings capture information about publish and delivery failures so that you can diagnose and troubleshoot problems with your Event Grid resources. The following table shows the settings available for different types of Event Grid resources: custom topics, system topics, and domains.

| Diagnostic setting | Event Grid topics | Event Grid system topics | Event domains | Event Grid partner namespaces |
| ------------- | --------- | ----------- | ----------- | ----------- |
| [DeliveryFailures](monitor-push-reference.md#schema-for-publishdelivery-failure-logs) | Yes | Yes | Yes | No |
| [PublishFailures](monitor-push-reference.md#schema-for-publishdelivery-failure-logs) | Yes | No | Yes | Yes |
| [DataPlaneRequests](monitor-push-reference.md#schema-for-data-plane-operations-logs) | Yes | No | Yes | Yes |

> [!IMPORTANT]
> For schemas of delivery failures, publish failures, and data plane requests, see [Diagnostic logs](monitor-push-reference.md).

## Prerequisites

- A provisioned Event Grid resource
- A provisioned destination for capturing diagnostic logs:
  - Log Analytics workspace
  - Storage account
  - Event Hubs
  - Partner solution

## Enable diagnostic logs for Event Grid topics and domains

> [!NOTE]
> The following procedure provides step-by-step instructions for enabling diagnostic logs for topics. Steps for enabling diagnostic logs for a domain are similar. In step 2, navigate to the Event Grid **domain** in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the Event Grid topic for which you want to enable diagnostic log settings.
    1. In the search bar at the top, search for **Event Grid topics**.

        :::image type="content" source="./media/enable-diagnostic-logs-topic/search-custom-topics.png" alt-text="Screenshot that shows the Azure portal with Event Grid topics in the search box.":::
    1. Select the **topic** from the list for which you want to configure diagnostic settings.
1. Select **Diagnostic settings** under **Monitoring** in the left menu.
1. On the **Diagnostic settings** page, select **Add diagnostic setting**.

    :::image type="content" source="./media/enable-diagnostic-logs-topic/diagnostic-settings-add.png" alt-text="Screenshot that shows the Diagnostic settings page of a custom topic.":::
1. Enter a **name** for the diagnostic setting.
1. Select the **allLogs** option in the **Logs** section.

    :::image type="content" source="./media/enable-diagnostic-logs-topic/log-failures.png" alt-text="Screenshot that shows the Diagnostic setting page with All logs selected.":::
1. Enable one or more of the capture destinations for the logs, and then configure them by selecting a previously created capture resource.
    - If you select **Send to Log Analytics**, select the Log Analytics workspace.

        :::image type="content" source="./media/enable-diagnostic-logs-topic/send-log-analytics.png" alt-text="Screenshot that shows the Diagnostic settings page with Send to Log Analytics selected.":::
    - If you select **Archive to a storage account**, select **Storage account - Configure**, and then select the storage account in your Azure subscription.

        :::image type="content" source="./media/enable-diagnostic-logs-topic/archive-storage.png" alt-text="Screenshot that shows the Diagnostic settings page with Archive to an Azure storage account checked and a storage account selected.":::
    - If you select **Stream to an event hub**, select **Event hub - Configure**, and then select the Event Hubs namespace, event hub, and the access policy.

        :::image type="content" source="./media/enable-diagnostic-logs-topic/archive-event-hub.png" alt-text="Screenshot that shows the Diagnostic settings page with Stream to an event hub selected.":::
1. Select **Save**. Then, select **X** in the upper-right corner to close the page.
1. Back on the **Diagnostic settings** page, confirm that you see a new entry in the **Diagnostic settings** table.

    :::image type="content" source="./media/enable-diagnostic-logs-topic/diagnostic-setting-list.png" alt-text="Screenshot that shows the Diagnostic settings page with a new entry highlighted in the Diagnostic settings table.":::

You can also enable collection of all metrics for the topic.

## Enable diagnostic logs for Event Grid system topics

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the system topic where you want to enable diagnostic log settings.
    1. In the search bar at the top, search for **Event Grid system topics**.

        :::image type="content" source="./media/enable-diagnostic-logs-topic/search-system-topics.png" alt-text="Screenshot that shows the Azure portal with Event Grid system topics in the search box.":::
    1. Select the **system topic** where you want to configure diagnostic settings.

        :::image type="content" source="./media/enable-diagnostic-logs-topic/select-system-topic.png" alt-text="Screenshot that shows the list of Event Grid system topics.":::
1. Select **Diagnostic settings** under **Monitoring** on the left menu, and then select **Add diagnostic setting**.

    :::image type="content" source="./media/enable-diagnostic-logs-topic/system-topic-add-diagnostic-settings-button.png" alt-text="Screenshot that shows the Diagnostic settings page of a system topic with the Add diagnostic setting button.":::
1. Enter a **name** for the diagnostic setting.
1. Select the **allLogs** option in the **Logs** section.

    :::image type="content" source="./media/enable-diagnostic-logs-topic/system-topic-select-delivery-failures.png" alt-text="Screenshot that shows the Diagnostic settings page of a system topic with All logs selected.":::
1. Enable one or more of the capture destinations for the logs, and then configure them by selecting a previously created capture resource.
    - If you select **Send to Log Analytics**, select the Log Analytics workspace.

        :::image type="content" source="./media/enable-diagnostic-logs-topic/system-topic-select-log-workspace.png" alt-text="Screenshot that shows the Diagnostic settings page of a system topic with Send to Log Analytics selected.":::
    - If you select **Archive to a storage account**, select **Storage account - Configure**, and then select the storage account in your Azure subscription.

        :::image type="content" source="./media/enable-diagnostic-logs-topic/system-topic-select-storage-account.png" alt-text="Screenshot that shows the Diagnostic settings page of a system topic with Archive to a storage account selected.":::
    - If you select **Stream to an event hub**, select **Event hub - Configure**, and then select the Event Hubs namespace, event hub, and the access policy.

        :::image type="content" source="./media/enable-diagnostic-logs-topic/system-topic-select-event-hub.png" alt-text="Screenshot that shows the Diagnostic settings page of a system topic with Stream to an event hub selected.":::
1. Select **Save**. Then, select **X** in the upper-right corner to close the page.
1. Back on the **Diagnostic settings** page, confirm that you see a new entry in the **Diagnostic settings** table.

    :::image type="content" source="./media/enable-diagnostic-logs-topic/system-topic-diagnostic-settings-targets.png" alt-text="Screenshot that shows the Diagnostic settings page of a system topic with a new entry in the table.":::

You can also enable collection of all metrics for the system topic.

:::image type="content" source="./media/enable-diagnostic-logs-topic/system-topics-metrics.png" alt-text="Screenshot that shows the Diagnostic settings page of a system topic with all metrics selected.":::

## View diagnostic logs in Azure Storage

1. When you enable a storage account as a capture destination, Event Grid starts emitting diagnostic logs. You see new containers named **insights-logs-deliveryfailures** and **insights-logs-publishfailures** in the storage account.

    :::image type="content" source="./media/enable-diagnostic-logs-topic/storage-containers.png" alt-text="Screenshot that shows the storage account containers for diagnostic logs.":::
1. As you navigate through one of the containers, you reach a blob in JSON format. The file contains log entries for either a delivery failure or a publish failure. The navigation path represents the **ResourceId** of the Event Grid topic and the timestamp (minute level) when Event Grid emitted the log entries. The blob/JSON file, which you can download, follows the schema described in the next section.

    :::image type="content" source="./media/enable-diagnostic-logs-topic/select-json.png" alt-text="Screenshot that shows a JSON blob file in the storage account.":::
1. You see content in the JSON file similar to the following example:

    ```json
    {
        "time": "2019-11-01T00:17:13.4389048Z",
        "resourceId": "/SUBSCRIPTIONS/SAMPLE-SUBSCRIPTION-ID /RESOURCEGROUPS/SAMPLE-RESOURCEGROUP-NAME/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/SAMPLE-TOPIC-NAME ",
        "eventSubscriptionName": "SAMPLEDESTINATION",
        "category": "DeliveryFailures",
        "operationName": "Deliver",
        "message": "Message:outcome=NotFound, latencyInMs=2635, id=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx, systemId=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, state=FilteredFailingDelivery, deliveryTime=11/1/2019 12:17:10 AM, deliveryCount=0, probationCount=0, deliverySchema=EventGridEvent, eventSubscriptionDeliverySchema=EventGridEvent, fields=InputEvent, EventSubscriptionId, DeliveryTime, State, Id, DeliverySchema, LastDeliveryAttemptTime, SystemId, fieldCount=, requestExpiration=1/1/0001 12:00:00 AM, delivered=False publishTime=11/1/2019 12:17:10 AM, eventTime=11/1/2019 12:17:09 AM, eventType=Type, deliveryTime=11/1/2019 12:17:10 AM, filteringState=FilteredWithRpc, inputSchema=EventGridEvent, publisher=SAMPLE-TOPIC-NAME.EASTUS-1.EVENTGRID.AZURE.NET, size=363, fields=Id, PublishTime, SerializedBody, EventType, Topic, Subject, FilteringHashCode, SystemId, Publisher, FilteringTopic, TopicCategory, DataVersion, MetadataVersion, InputSchema, EventTime, fieldCount=15, url=sb://sample-namespace.servicebus.windows.net/, deliveryResponse=NotFound: The messaging entity 'sb://sample-namespace.servicebus.windows.net/sample-eventhub' could not be found. TrackingId:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_G14, SystemTracker:sample-namespace.servicebus.windows.net:sample-eventhub, Timestamp:2019-11-01T00:17:13, referenceId: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_G14:"
    }
    ```

## Use Azure Resource Manager template

Here's a sample Azure Resource Manager template to enable diagnostic settings for an Event Grid topic. When you deploy this sample template, it creates the following resources:

- An Event Grid topic
- A Log Analytics workspace

Then, it creates a diagnostic setting on the topic to send diagnostic information to the Log Analytics workspace.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "topic_name": {
            "defaultValue": "spegrid0917topic",
            "type": "String"
        },
        "log_analytics_workspace_name": {
            "defaultValue": "splogaw0625",
            "type": "String"
        },
        "location": {
            "defaultValue": "eastus",
            "type": "String"
        },
        "sku": {
            "defaultValue": "Free",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.EventGrid/topics",
            "apiVersion": "2020-10-15-preview",
            "name": "[parameters('topic_name')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Basic"
            },
            "kind": "Azure",
            "identity": {
                "type": "None"
            },
            "properties": {
                "inputSchema": "EventGridSchema",
                "publicNetworkAccess": "Enabled"
            }
        },
        {
            "apiVersion": "2017-03-15-preview",
            "name": "[parameters('log_analytics_workspace_name')]",
            "location": "[parameters('location')]",
            "type": "Microsoft.OperationalInsights/workspaces",
            "properties": {
                "sku": {
                    "name": "[parameters('sku')]"
                }
            }
        },
        {
            "type": "Microsoft.EventGrid/topics/providers/diagnosticSettings",
            "apiVersion": "2017-05-01-preview",
            "name": "[concat(parameters('topic_name'), '/', 'Microsoft.Insights/', parameters('log_analytics_workspace_name'))]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[resourceId('Microsoft.EventGrid/topics', parameters('topic_name'))]",
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
                        "category": "DeliveryFailures",
                        "enabled": true
                    },
                    {
                        "category": "PublishFailures",
                        "enabled": true
                    }
                ]
            }
        }
    ]
}
```

## Enable diagnostic logs for audit traces

Event Grid can publish audit traces for data plane operations. To enable the feature, select **audit** in the **Category groups** section or select **DataPlaneRequests** in the **Categories** section.

Use the audit trace to ensure that data access is allowed only for authorized purposes. It collects information about security controls, such as resource name, operation type, network access, level, and region. For more information about how to enable the diagnostic setting, see [Enable diagnostic logs for Event Grid topics and domains](#enable-diagnostic-logs-for-event-grid-topics-and-domains).

:::image type="content" source="./media/enable-diagnostic-logs-topic/enable-audit-logs.png" alt-text="Screenshot that shows the Diagnostic settings page with Audit selected.":::

> [!IMPORTANT]
> For more information about the `DataPlaneRequests` schema, see [Diagnostic logs](monitor-push-reference.md).

## Next steps

For the log schema and other conceptual information about diagnostic logs for topics or domains, see [Diagnostic logs](monitor-push-reference.md#schema-for-data-plane-operations-logs).
