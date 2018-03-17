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
ms.date: 02/26/2018
ms.author: snmuvva, vinagara
ms.custom: 

---

# Near real-time metric alerts (preview)
Azure Monitor supports a new alert type called near real-time metric alerts (preview). This feature currently is in public preview.

Near real-time metric alerts differ from regular metric alerts in a few ways:

- **Improved latency**: Near real-time metric alerts can monitor changes in metric values with a frequency as small as one minute.
- **More control over metric conditions**: You can define richer alert rules in near real-time metric alerts. The alerts support monitoring the maximum, minimum, average, and total values of metrics.
- **Metrics from Logs**: From popular log data coming into [Log Analytics](../log-analytics/log-analytics-overview.md), metrics can be extracted into Azure Monitor and be alerted at near real-time basis
- **Combined monitoring of multiple metrics**: Near real-time metric alerts can monitor multiple metrics (currently, up to two metrics) with a single rule. An alert is triggered if both metrics breach their respective thresholds for the specified time period.
- **Modular notification system**: Near real-time metric alerts use [action groups](monitoring-action-groups.md). You can use action groups to create modular actions. You can reuse action groups for multiple alert rules.

> [!NOTE]
> The near real-time metric alert is currently is in public preview. And metrics from logs features are in *limited* public preview. The functionality and user experience is subject to change.
>

## Metrics and Dimensions Supported
Near real-time metric alerts support alerting for metrics that use dimensions. You can use dimensions to filter your metric to the right level. All supported metrics along with applicable dimensions can be explored and visualized from [Azure Monitor - Metrics Explorer (Preview)](monitoring-metric-charts.md).

Here's the full list of Azure monitor based metric sources that are supported for near real-time metric alerts:

|Metric Name/Details  |Dimensions Supported  |
|---------|---------|
|Microsoft.ApiManagement/service     | Yes        |
|Microsoft.Automation/automationAccounts     |     N/A    |
|Microsoft.Automation/automationAccounts     |   N/A      |
|Microsoft.Cache/Redis     |    N/A     |
|Microsoft.Compute/virtualMachines     |    N/A     |
|Microsoft.Compute/virtualMachineScaleSets     |   N/A      |
|Microsoft.DataFactory/factories     |   N/A      |
|Microsoft.DBforMySQL/servers     |   N/A      |
|Microsoft.DBforPostgreSQL/servers     |    N/A     |
|Microsoft.EventHub/namespaces     |   N/A      |
|Microsoft.Logic/workflows     |     N/A    |
|Microsoft.Network/applicationGateways     |    N/A     |
|Microsoft.Network/publicipaddresses     |  N/A       |
|Microsoft.Search/searchServices     |   N/A      |
|Microsoft.ServiceBus/namespaces     |  N/A       |
|Microsoft.Storage/storageAccounts     |    Yes     |
|Microsoft.Storage/storageAccounts/services     |     Yes    |
|Microsoft.StreamAnalytics/streamingjobs     |  N/A       |
|Microsoft.CognitiveServices/accounts     |    N/A     |


Metrics from Logs, currently supports the following popular OMS logs:
- [Performance counters](../log-analytics/log-analytics-data-sources-performance-counters.md) for Windows & Linux machines
- [Heartbeat records for Agent Health](../operations-management-suite/oms-solution-agenthealth.md)
- [Update management](../operations-management-suite/oms-solution-update-management.md) records

Here's the full list of OMS log based metric sources that are supported for near real-time metric alerts:

Metric Name/Details  |Dimensions Supported  | Type of Log  |
|---------|---------|---------|
|Average_Avg. Disk sec/Read     |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
| Average_Avg. Disk sec/Write     |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
| Average_Current Disk Queue Length   |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
| Average_Disk Reads/sec    |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
| Average_Disk Transfers/sec    |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
|   Average_% Free Space    |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
| Average_Available MBytes     |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
| Average_% Committed Bytes In Use    |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
| Average_Bytes Received/sec    |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
|  Average_Bytes Sent/sec    |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
|  Average_Bytes Total/sec    |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
|  Average_% Processor Time    |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
|   Average_Processor Queue Length    |     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Windows Performance Counter      |
|	Average_% Free Inodes	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Free Space	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Used Inodes	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Used Space	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Disk Read Bytes/sec	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Disk Reads/sec	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Disk Transfers/sec	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Disk Write Bytes/sec	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Disk Writes/sec	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Free Megabytes	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Logical Disk Bytes/sec	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Available Memory	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Available Swap Space	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Used Memory	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Used Swap Space	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Available MBytes Memory	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Available MBytes Swap	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Page Reads/sec	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Page Writes/sec	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Pages/sec	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Used MBytes Swap Space	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Used Memory MBytes	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Total Bytes Transmitted	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Total Bytes Received	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Total Bytes	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Total Packets Transmitted	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Total Packets Received	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Total Rx Errors	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Total Tx Errors	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Total Collisions	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Avg. Disk sec/Read	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Avg. Disk sec/Transfer	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Avg. Disk sec/Write	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Physical Disk Bytes/sec	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Pct Privileged Time	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Pct User Time	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Used Memory kBytes	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Virtual Shared Memory	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% DPC Time	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Idle Time	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Interrupt Time	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% IO Wait Time	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Nice Time	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Privileged Time	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% Processor Time	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_% User Time	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Free Physical Memory	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Free Space in Paging Files	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Free Virtual Memory	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Processes	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Size Stored In Paging Files	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Uptime	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Average_Users	|     Yes - Computer, ObjectName, InstanceName, CounterPath & SourceSystem    |   Linux Performance Counter      |
|	 Heartbeat	|     Yes - Computer, OSType, Version & SourceComputerId    |   Heartbeat Records |
|	 Update	|     Yes - Computer, Product, Classification, UpdateState, Optional & Approved    |   Update Management |

> [!NOTE]
> Specific metric and/or dimension will only be shown if data for it exists in chosen period

## Create a near real-time metric alert
Currently, you can create near real-time metric alerts only in the Azure portal. Support for configuring near real-time metric alerts by using PowerShell, the Azure command-line interface (Azure CLI), and Azure Monitor REST APIs is coming soon.

The experience for creating a near real-time metric alert has moved to the new **Alerts (Preview)** page. Even if the current alerts page displays **Add Near Real-Time Metric alert**, you are redirected to the **Alerts (Preview)** page.

To learn how to create a near real-time metric alert, see [Create an alert rule in the Azure portal](monitor-alerts-unified-usage.md#create-an-alert-rule-with-the-azure-portal).

## Manage near real-time metric alerts
After you create a near real-time metric alert, you can manage the alert by using the steps described in [Manage your alerts in the Azure portal](monitor-alerts-unified-usage.md#managing-your-alerts-in-azure-portal).

## Payload schema

The POST operation contains the following JSON payload and schema for all near real-time metric alerts when appropriately configured [action group](monitoring-action-groups.md) is used:

```json
{"schemaId":"AzureMonitorMetricAlert","data":
    {
    "version": "2.0",
    "status": "Activated",
    "context": {
    "timestamp": "2018-02-28T10:44:10.1714014Z",
    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Contoso/providers/microsoft.insights/metricAlerts/StorageCheck",
    "name": "StorageCheck",
    "description": "",
    "conditionType": "SingleResourceMultipleMetricCriteria",
    "condition": {
      "windowSize": "PT5M",
      "allOf": [
        {
          "metricName": "Transactions",
          "dimensions": [
            {
              "name": "AccountResourceId",
              "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Contoso/providers/Microsoft.Storage/storageAccounts/diag500"
            },
            {
              "name": "GeoType",
              "value": "Primary"
            }
          ],
          "operator": "GreaterThan",
          "threshold": "0",
          "timeAggregation": "PT5M",
          "metricValue": 1.0
        },
      ]
    },
    "subscriptionId": "00000000-0000-0000-0000-000000000000",
    "resourceGroupName": "Contoso",
    "resourceName": "diag500",
    "resourceType": "Microsoft.Storage/storageAccounts",
    "resourceId": "/subscriptions/1e3ff1c0-771a-4119-a03b-be82a51e232d/resourceGroups/Contoso/providers/Microsoft.Storage/storageAccounts/diag500",
    "portalLink": "https://portal.azure.com/#resource//subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/Contoso/providers/Microsoft.Storage/storageAccounts/diag500"
  },
        "properties": {
                "key1": "value1",
                "key2": "value2"
        }
    }
}
```

## Next steps

* Learn more about the new [Alerts (Preview) experience](monitoring-overview-unified-alerts.md).
* Learn about [log alerts in Azure Alerts (Preview)](monitor-alerts-unified-log.md).
* Learn about [alerts in Azure](monitoring-overview-alerts.md).
