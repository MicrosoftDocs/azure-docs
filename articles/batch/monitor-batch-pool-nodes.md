---
title: Monitor Azure Batch pool compute nodes with Azure Monitor Agent
description: Learn how to use Azure Monitor Agent and data collection rules to collect guest performance counters and logs from Azure Batch pool nodes.
author: xinlaoda
ms.author: xxin
ms.service: azure-batch
ms.topic: how-to
ms.date: 08/31/2026
ai-usage: ai-assisted
ms.custom: devx-track-azurecli, linux-related-content
# Customer intent: As a cloud administrator, I want to collect guest operating system performance data from Batch pool compute nodes, so that I can monitor node health and troubleshoot workload performance.
---

# Monitor Azure Batch pool compute nodes with Azure Monitor Agent

Azure Batch account platform metrics provide information about pools, nodes, cores, jobs, and tasks. To monitor guest operating system performance, such as CPU, memory, disk, and network usage, install [Azure Monitor Agent (AMA)](/azure/azure-monitor/agents/azure-monitor-agent-overview) on the pool compute nodes.

This article shows how to:

- Create a Batch pool with a user-assigned managed identity and AMA.
- Create a data collection rule (DCR) for Linux performance counters and Syslog.
- Associate the DCR with the Batch pool resource.
- Verify data in Log Analytics and Azure Monitor Metrics.

The examples use Azure CLI and a Linux pool. The same architecture supports Windows pools with the Windows AMA extension and Windows data sources.

> [!IMPORTANT]
> Monitoring Batch pool compute nodes with AMA is supported only for Batch accounts that use **user subscription** pool allocation mode. In Batch service pool allocation mode, compute nodes are created in Batch-managed subscriptions that customers can't access.

## How node monitoring works

A monitored Batch pool uses the following resources:

- A Batch account in user subscription pool allocation mode.
- A Batch pool that has a user-assigned managed identity.
- The Azure Monitor Agent extension installed when the pool is created.
- A DCR that specifies the data to collect and the destinations.
- A DCR association whose target is the Batch pool Azure Resource Manager resource.
- A Log Analytics workspace for log data and, optionally, Azure Monitor Metrics for guest metrics.

Associate the DCR with the Batch pool resource ID:

```text
/subscriptions/<subscription-id>/resourceGroups/<resource-group>/
providers/Microsoft.Batch/batchAccounts/<batch-account>/pools/<pool-name>
```

Don't associate the DCR only with the virtual machine scale set that Batch creates for the pool. Batch manages the lifecycle of that scale set. When a pool scales to zero nodes, Batch can delete the scale set and create a new one during a later resize.

Log Analytics records retain the resource ID of the Batch-created compute resource. Guest metrics are available on the current Batch-created virtual machine scale set in the `azure.vm.linux.guestmetrics` namespace for Linux or the **Virtual Machine Guest (Windows)** namespace for Windows.

## Prerequisites

Before you begin, you need:

- An Azure Batch account in [user subscription pool allocation mode](batch-account-create-portal.md#additional-configuration-for-user-subscription-mode).
- Permission to create pools by using the [Batch management plane](batch-apis-tools.md#batch-management-apis).
- A [Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).
- A [user-assigned managed identity](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal) in the same Microsoft Entra tenant as the Batch account.
- Permission to create DCRs and DCR associations. For details, see [Create and edit data collection rules in Azure Monitor](/azure/azure-monitor/data-collection/data-collection-rule-create-edit#permissions).
- Azure CLI installed and authenticated to the subscription.

Create the DCR, Log Analytics workspace, and Batch pool in the same Azure region. If the pool uses a virtual network with restricted outbound access, review [Azure Monitor Agent network requirements](/azure/azure-monitor/agents/azure-monitor-agent-network-configuration).

> [!TIP]
> Pools with extensions must use Virtual Machine Configuration. You can't add extensions to an existing pool. To add, remove, or update AMA, create a new pool. For more information, see [Use extensions with Batch pools](create-pool-extensions.md).

## Set environment variables

Set variables for your resources. Replace the placeholder values.

```azurecli
subscriptionId="<subscription-id>"
resourceGroup="<resource-group>"
location="<location>"
batchAccount="<batch-account-name>"
poolName="<pool-name>"
workspaceName="<log-analytics-workspace-name>"
identityName="<managed-identity-name>"
dcrName="<data-collection-rule-name>"

az account set --subscription "$subscriptionId"

identityId=$(az identity show \
  --resource-group "$resourceGroup" \
  --name "$identityName" \
  --query id \
  --output tsv)

workspaceId=$(az monitor log-analytics workspace show \
  --resource-group "$resourceGroup" \
  --workspace-name "$workspaceName" \
  --query id \
  --output tsv)

batchAccountId="/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.Batch/batchAccounts/$batchAccount"
poolResourceId="$batchAccountId/pools/$poolName"
dcrId="/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.Insights/dataCollectionRules/$dcrName"
```

## Create a data collection rule

The following data collection rule (DCR) collects common Linux performance counters every 60 seconds. It sends the counters to both the `Perf` table in Log Analytics and Azure Monitor Metrics. It also sends warning and higher-severity Syslog records to Log Analytics.

Azure Monitor Metrics as a destination for guest performance counters is in preview. For current limitations, see [Collect performance counters with Azure Monitor Agent](/azure/azure-monitor/vm/data-collection-performance).

Create a file named *dcr.json*. Replace `<location>` and `<workspace-resource-id>` with your values.

```json
{
  "location": "<location>",
  "kind": "Linux",
  "properties": {
    "dataSources": {
      "performanceCounters": [
        {
          "name": "batchNodePerformance",
          "streams": [
            "Microsoft-Perf",
            "Microsoft-InsightsMetrics"
          ],
          "samplingFrequencyInSeconds": 60,
          "counterSpecifiers": [
            "\\Processor(*)\\% Processor Time",
            "\\Processor(*)\\% User Time",
            "\\Processor(*)\\% Privileged Time",
            "\\Processor(*)\\% Idle Time",
            "\\Memory\\% Available Memory",
            "\\Memory\\Used Memory MBytes",
            "\\Memory\\% Used Memory",
            "\\Logical Disk(*)\\% Free Space",
            "\\Logical Disk(*)\\Free Megabytes",
            "\\Logical Disk(*)\\Disk Reads/sec",
            "\\Logical Disk(*)\\Disk Writes/sec",
            "\\Logical Disk(*)\\Disk Read Bytes/sec",
            "\\Logical Disk(*)\\Disk Write Bytes/sec",
            "\\Network(*)\\Total Bytes Transmitted",
            "\\Network(*)\\Total Bytes Received",
            "\\Network(*)\\Total Bytes",
            "\\System\\Uptime"
          ]
        }
      ],
      "syslog": [
        {
          "name": "batchNodeSyslog",
          "streams": [
            "Microsoft-Syslog"
          ],
          "facilityNames": [
            "auth",
            "authpriv",
            "cron",
            "daemon",
            "kern",
            "syslog",
            "user"
          ],
          "logLevels": [
            "Warning",
            "Error",
            "Critical",
            "Alert",
            "Emergency"
          ]
        }
      ]
    },
    "destinations": {
      "logAnalytics": [
        {
          "name": "batchMonitorWorkspace",
          "workspaceResourceId": "<workspace-resource-id>"
        }
      ],
      "azureMonitorMetrics": {
        "name": "azureMonitorMetrics-default"
      }
    },
    "dataFlows": [
      {
        "streams": [
          "Microsoft-Perf"
        ],
        "destinations": [
          "batchMonitorWorkspace"
        ]
      },
      {
        "streams": [
          "Microsoft-InsightsMetrics"
        ],
        "destinations": [
          "azureMonitorMetrics-default"
        ]
      },
      {
        "streams": [
          "Microsoft-Syslog"
        ],
        "destinations": [
          "batchMonitorWorkspace"
        ]
      }
    ]
  }
}
```

Create or update the DCR:

```azurecli
az rest \
  --method put \
  --url "https://management.azure.com${dcrId}?api-version=2022-06-01" \
  --body @dcr.json
```

For information about selecting counters and controlling ingestion cost, see [Collect performance counters with Azure Monitor Agent](/azure/azure-monitor/vm/data-collection-performance).

## Create a pool with Azure Monitor Agent

Create a file named *pool.json*. The following example uses Ubuntu 22.04 and installs the Linux AMA extension. Replace `<managed-identity-resource-id>` with the value of `$identityId`.

```json
{
  "name": "<pool-name>",
  "type": "Microsoft.Batch/batchAccounts/pools",
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "<managed-identity-resource-id>": {}
    }
  },
  "properties": {
    "vmSize": "STANDARD_D2S_V3",
    "taskSlotsPerNode": 1,
    "taskSchedulingPolicy": {
      "nodeFillType": "Pack"
    },
    "deploymentConfiguration": {
      "virtualMachineConfiguration": {
        "imageReference": {
          "publisher": "canonical",
          "offer": "0001-com-ubuntu-server-jammy",
          "sku": "22_04-lts",
          "version": "latest"
        },
        "nodeAgentSkuId": "batch.node.ubuntu 22.04",
        "extensions": [
          {
            "name": "AzureMonitorAgent",
            "publisher": "Microsoft.Azure.Monitor",
            "type": "AzureMonitorLinuxAgent",
            "typeHandlerVersion": "1.0",
            "autoUpgradeMinorVersion": true,
            "enableAutomaticUpgrade": true,
            "settings": {
              "authentication": {
                "managedIdentity": {
                  "identifier-name": "mi_res_id",
                  "identifier-value": "<managed-identity-resource-id>"
                }
              }
            }
          }
        ]
      }
    },
    "scaleSettings": {
      "fixedScale": {
        "targetDedicatedNodes": 1,
        "targetLowPriorityNodes": 0,
        "resizeTimeout": "PT15M"
      }
    }
  }
}
```

Create the pool by using the Batch management API:

```azurecli
az rest \
  --method put \
  --url "https://management.azure.com${poolResourceId}?api-version=2024-07-01" \
  --body @pool.json
```

For a Windows pool, use:

- Extension type `AzureMonitorWindowsAgent`.
- A Windows image and compatible Batch node agent SKU.
- A Windows DCR with `kind` set to `Windows`.
- Windows performance counters and, if needed, [Windows event collection](/azure/azure-monitor/vm/data-collection-windows-events) instead of Syslog.

Don't use one DCR for both Windows and Linux counters. Some counter names can resolve to the same metric and cause duplicate collection.

## Associate the DCR with the Batch pool

Create the association on the Batch pool resource:

```azurecli
az monitor data-collection rule association create \
  --name "batch-pool-monitoring" \
  --resource "$poolResourceId" \
  --rule-id "$dcrId"
```

Confirm the association:

```azurecli
az monitor data-collection rule association list \
  --resource "$poolResourceId" \
  --output table
```

The association remains on the pool when nodes are removed or replaced. Don't replace it with an association that targets only the current Batch-created virtual machine scale set.

## Verify agent and log collection

Allow up to five minutes after the node reaches the idle state for the first records to arrive.

### Verify the agent heartbeat

Run the following query in the Log Analytics workspace:

```kusto
Heartbeat
| where TimeGenerated > ago(30m)
| summarize
    Samples = count(),
    FirstSeen = min(TimeGenerated),
    LastSeen = max(TimeGenerated),
    AgentVersion = any(Version)
    by Computer, _ResourceId
```

An operational agent normally sends one heartbeat each minute.

### Verify performance counters

```kusto
Perf
| where TimeGenerated > ago(30m)
| summarize
    Samples = count(),
    Average = avg(CounterValue),
    P95 = percentile(CounterValue, 95),
    Maximum = max(CounterValue)
    by Computer, ObjectName, CounterName, InstanceName
| order by ObjectName asc, CounterName asc
```

Linux logical disk counters include multiple mount-point instances. Filter on `InstanceName` when you create charts or alerts so that read-only mounts and temporary mounts don't distort the result.

### Verify Syslog

```kusto
Syslog
| where TimeGenerated > ago(30m)
| project
    TimeGenerated,
    Computer,
    Facility,
    SeverityLevel,
    ProcessName,
    SyslogMessage,
    _ResourceId
| order by TimeGenerated desc
```

## View guest metrics

If the DCR sends the `Microsoft-InsightsMetrics` stream to the Azure Monitor Metrics destination, guest metrics appear on the current Batch-created virtual machine scale set.

1. In the Azure portal, open the virtual machine scale set that Batch created for the pool.
1. Select **Metrics**.
1. For **Metric Namespace**, select `azure.vm.linux.guestmetrics` for Linux or **Virtual Machine Guest (Windows)** for Windows.
1. Select a metric and aggregation.

You can locate the current compute resource ID from recent `Perf` records:

```kusto
Perf
| where TimeGenerated > ago(30m)
| summarize arg_max(TimeGenerated, _ResourceId) by Computer
```

> [!NOTE]
> When a pool scales to zero nodes, Batch can delete its backing virtual machine scale set. The guest metric resource isn't available while the scale set doesn't exist. Log Analytics data already collected in the workspace remains available according to the workspace retention settings.

## Monitor Batch platform metrics with node data

Node guest data complements the automatically collected Batch account platform metrics. Use both sources:

- Use Batch account metrics such as `TotalNodeCount`, `RunningNodeCount`, `IdleNodeCount`, `UnusableNodeCount`, `TaskStartEvent`, and `TaskCompleteEvent` to monitor service and scheduling state.
- Use guest performance counters to investigate CPU, memory, disk, and network conditions on the compute nodes.
- Use Batch service logs to correlate pool, job, and task lifecycle events with node behavior.

For metric definitions and aggregation guidance, see [Azure Batch monitoring data reference](monitor-batch-reference.md) and [Monitor Azure Batch](monitor-batch.md).

## Troubleshoot data collection

Use the following checks when data doesn't arrive:

| Symptom | Checks |
| --- | --- |
| No heartbeat | Confirm that the AMA extension provisioned successfully, the user-assigned identity is attached to the pool and referenced in the extension settings, and required Azure Monitor endpoints are reachable. |
| AMA reports that the resource isn't associated with a DCR | Confirm that the DCR association targets the Batch pool resource ID. An association only on the backing virtual machine scale set isn't a substitute for the pool association. |
| Heartbeat arrives but `Perf` is empty | Confirm that `Microsoft-Perf` is present in both the performance-counter data source and a data flow that targets Log Analytics. Check the counter paths and DCR operating system kind. |
| Guest metric namespace isn't available | Confirm that `Microsoft-InsightsMetrics` targets `azureMonitorMetrics-default`, allow several minutes for aggregation, and confirm that the pool currently has nodes and a backing scale set. |
| Duplicate records | Check for multiple DCRs that collect the same data from the pool. Duplicate collection increases ingestion cost. |

For AMA log locations and disk requirements, see [Azure Monitor Agent requirements](/azure/azure-monitor/agents/azure-monitor-agent-requirements). For Batch allocation and node failures, see [Azure Batch pool and node errors](batch-pool-node-error-checking.md).

## Cost considerations

Azure Monitor charges can apply to Log Analytics ingestion, retention, alerts, and other enabled features. To control cost:

- Collect only the counters and logs required for your monitoring goals.
- Use a sampling frequency appropriate for your workload.
- Filter disk data by meaningful mount-point instances in queries and alerts.
- Avoid associating overlapping DCRs with the same pool.
- Review workspace retention settings.

For more information, see [Azure Monitor cost and usage](/azure/azure-monitor/fundamentals/cost-usage) and [Plan to manage costs for Azure Batch](plan-to-manage-costs.md).

## Clean up resources

When you no longer need the monitored pool, delete the pool and any monitoring resources that aren't shared with other workloads.

To retain the pool configuration without continuing to run compute nodes, resize the pool to zero:

```azurecli
az batch account login \
  --resource-group "$resourceGroup" \
  --name "$batchAccount"

az batch pool resize \
  --pool-id "$poolName" \
  --target-dedicated-nodes 0 \
  --target-low-priority-nodes 0
```

Scaling to zero can remove the backing virtual machine scale set. Data already stored in Log Analytics remains available according to the workspace retention settings.

## Related content

- [Monitor Azure Batch](monitor-batch.md)
- [Use extensions with Batch pools](create-pool-extensions.md)
- [Configure managed identities in Batch pools](managed-identity-pools.md)
- [Collect log data from virtual machines with Azure Monitor](/azure/azure-monitor/vm/data-collection)
- [Manage data collection rule associations](/azure/azure-monitor/data-collection/data-collection-rule-associations)
