---
title: Near real-time metric alerts in Azure Monitor | Microsoft Docs
description: Learn how to use near real-time metric alerts to monitor Azure resource metrics with a frequency as small as 1 minute.
author: snehithm
manager: kmadnani1
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: 
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/06/2017
ms.author: snmuvva
ms.custom: 

---

# Near real-time metric alerts (preview)
Azure Monitor supports a new alert type called near real-time metric alerts (preview). This feature currently is in public preview.

Near real-time metric alerts differ from regular metric alerts in a few ways:

- **Improved latency**: Near real-time metric alerts can monitor changes in metric values with a frequency as small as 1 minute.
- **More control over metric conditions**: You can define richer alert rules in near real-time metric alerts. The alerts support monitoring the maximum, minimum, average, and total values of metrics.
- **Combined monitoring of multiple metrics**: Near real-time metric alerts can monitor multiple metrics (currently, up to two metrics) with a single rule. An alert is triggered if both metrics breach their respective thresholds for the specified time period.
- **Modular notification system**: Near real-time metric alerts use [action groups](monitoring-action-groups.md). You can use action groups to create modular actions. You can reuse action groups for multiple alert rules.

> [!NOTE]
> The near real-time metric alert feature currently is in public preview. The functionality and user experience is subject to change.
>

## Resources you can use with near real-time metric alerts
Here's the full list of resource types that are supported for near real-time metric alerts:

* Microsoft.ApiManagement/service
* Microsoft.Automation/automationAccounts
* Microsoft.Batch/batchAccounts
* Microsoft.Cache/Redis
* Microsoft.Compute/virtualMachines
* Microsoft.Compute/virtualMachineScaleSets
* Microsoft.DataFactory/factories
* Microsoft.DBforMySQL/servers
* Microsoft.DBforPostgreSQL/servers
* Microsoft.EventHub/namespaces
* Microsoft.Logic/workflows
* Microsoft.Network/applicationGateways
* Microsoft.Network/publicipaddresses
* Microsoft.Search/searchServices
* Microsoft.ServiceBus/namespaces
* Microsoft.Storage/storageAccounts
* Microsoft.Storage/storageAccounts/services
* Microsoft.StreamAnalytics/streamingjobs
* Microsoft.CognitiveServices/accounts

## Near real-time metric alerts for metrics that use dimensions
Near real-time metric alerts support alerting for metrics that use dimensions. You can use dimensions to filter your metric to the right level. Near real-time metric alerts for metrics that use dimensions are supported for the following resource types:

* Microsoft.ApiManagement/service
* Microsoft.Storage/storageAccounts (supported only for storage accounts in US regions)
* Microsoft.Storage/storageAccounts/services (supported only for storage accounts in US regions)

## Create a near real-time metric alert
Currently, you can create near real-time metric alerts only in the Azure portal. Support for configuring near real-time metric alerts by using PowerShell, the Azure command-line interface (Azure CLI), and Azure Monitor REST APIs is coming soon.

The experience for creating a near real-time metric alert has moved to the new **Alerts (Preview)** page. Even if the current alerts page displays **Add Near Real-Time Metric alert**, you are redirected to the **Alerts (Preview)** page.

To learn how to create a near real-time metric alert, see [Create an alert rule in the Azure portal](monitor-alerts-unified-usage.md#create-an-alert-rule-with-the-azure-portal).

## Manage near real-time metric alerts
After you create a near real-time metric alert, you can manage the alert by using the steps described in [Manage your alerts in the Azure portal](monitor-alerts-unified-usage.md#managing-your-alerts-in-azure-portal).

## Payload schema

The POST operation contains the following JSON payload and schema for all near real-time metric alerts:

```json
{
    "WebhookName": "Alert1510875839452",
    "RequestBody": {
        "status": "Activated",
        "context": {
            "condition": {
                "metricName": "Percentage CPU",
                "metricUnit": "Percent",
                "metricValue": "17.7654545454545",
                "threshold": "1",
                "windowSize": "10",
                "timeAggregation": "Average",
                "operator": "GreaterThan"
            },
            "resourceName": "ContosoVM1",
            "resourceType": "microsoft.compute/virtualmachines",
            "resourceRegion": "westus",
            "portalLink": "https://portal.azure.com/#resource/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/automationtest/providers/Microsoft.Compute/virtualMachines/ContosoVM1",
            "timestamp": "2017-11-16T23:54:03.9517451Z",
            "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoVM/providers/microsoft.insights/alertrules/VMMetricAlert1",
            "name": "VMMetricAlert1",
            "description": "A metric alert for the VM Win2012R2",
            "conditionType": "Metric",
            "subscriptionId": "00000000-0000-0000-0000-000000000000",
            "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoVM/providers/Microsoft.Compute/virtualMachines/ContosoVM1",
            "resourceGroupName": "ContosoVM"
        },
        "properties": {
                "key1": "value1",
                "key2": "value2"
        }
    },
    "RequestHeader": {
        "Connection": "Keep-Alive",
        "Host": "s1events.azure-automation.net",
        "User-Agent": "azure-insights/0.9",
        "x-ms-request-id": "00000000-0000-0000-0000-000000000000"
    }
}
```

## Next steps

* Learn more about the new [Alerts (Preview) experience](monitoring-overview-unified-alerts.md).
* Learn about [log alerts in Azure Alerts (Preview)](monitor-alerts-unified-log.md).
* Learn about [alerts in Azure](monitoring-overview-alerts.md).