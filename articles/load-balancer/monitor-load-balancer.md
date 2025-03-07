---
title: Monitor Azure Load Balancer
description: Start here to learn how to monitor Azure Load Balancer by using Azure Monitor and Azure Monitor Insights.
ms.date: 08/21/2024
ms.custom: horz-monitor, template-how-to, subject-monitoring, engagement-fy23, devx-track-azurecli, devx-track-azurepowershell
ms.topic: concept-article
author: mbender-ms
ms.author: mbender
ms.service: azure-load-balancer
---

# Monitor Azure Load Balancer

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

Load Balancer provides other monitoring data through:

- [Health Probes](./load-balancer-custom-probe-overview.md)
- [Resource health status](./load-balancer-standard-diagnostics.md#resource-health-status)
- [REST API](load-balancer-query-metrics-rest-api.md)

[!INCLUDE [horz-monitor-insights](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights.md)]

Load Balancer insights provide:

- Functional dependency view
- Metrics dashboard
- Overview tab
- Frontend and Backend Availability tab
- Data Throughput tab
- Flow Distribution
- Connection Monitors
- Metric Definitions

For more information on Load Balancer insights, see [Using Insights to monitor and configure your Azure Load Balancer](./load-balancer-insights.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

For more information about the resource types for Load Balancer, see [Azure Load Balancer monitoring data reference](monitor-load-balancer-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

You can analyze metrics for Load Balancer with metrics from other Azure services using metrics explorer by opening **Metrics** from the **Azure Monitor** menu. See [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/analyze-metrics) for details on using this tool.

For a list of available metrics for Load Balancer, see [Azure Load Balancer monitoring data reference](monitor-load-balancer-reference.md#metrics).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Load Balancer, see [Azure Load Balancer monitoring data reference](monitor-load-balancer-reference.md#resource-logs).

## Creating a diagnostic setting

Resource logs aren't collected and stored until you create a diagnostic setting and route them to one or more locations. You can create a diagnostic setting with the Azure portal, Azure PowerShell, or the Azure CLI.

To use the Azure portal and for general guidance, see [Create diagnostic setting to collect platform logs and metrics in Azure](/azure/azure-monitor/essentials/diagnostic-settings). To use PowerShell or the Azure CLI, see the following sections.

When you create a diagnostic setting, you specify which categories of logs to collect. The category for Load Balancer is **AllMetrics**.

### PowerShell

Sign in to Azure PowerShell:

```azurepowershell
Connect-AzAccount 
```

#### Log analytics workspace

To send resource logs to a Log Analytics workspace, enter these commands. Replace the bracketed values with your values:

```azurepowershell
## Place the load balancer in a variable. ##
$lbpara = @{
    ResourceGroupName = <your-resource-group-name>
    Name = <your-load-balancer-name>
}
$lb = Get-AzLoadBalancer @lbpara
    
## Place the workspace in a variable. ##
$wspara = @{
    ResourceGroupName = <your-resource-group-name>
    Name = <your-log-analytics-workspace-name>
}
$ws = Get-AzOperationalInsightsWorkspace @wspara
    
## Enable the diagnostic setting. ##
Set-AzDiagnosticSetting `
    -ResourceId $lb.id `
    -Name <your-diagnostic-setting-name> `
    -Enabled $true `
    -MetricCategory 'AllMetrics' `
    -WorkspaceId $ws.ResourceId
```

#### Storage account

To send resource logs to a storage account, enter these commands. Replace the bracketed values with your values:

```azurepowershell
## Place the load balancer in a variable. ##
$lbpara = @{
    ResourceGroupName = <your-resource-group-name>
    Name = <your-load-balancer-name>
}
$lb = Get-AzLoadBalancer @lbpara
    
## Place the storage account in a variable. ##
$storpara = @{
    ResourceGroupName = <your-resource-group-name>
    Name = <your-storage-account-name>
}
$storage = Get-AzStorageAccount @storpara
    
## Enable the diagnostic setting. ##
Set-AzDiagnosticSetting `
    -ResourceId $lb.id `
    -Name <your-diagnostic-setting-name> `
    -StorageAccountId $storage.id `
    -Enabled $true `
    -MetricCategory 'AllMetrics'
```

#### Event hub

To send resource logs to an event hub namespace, enter these commands. Replace the bracketed values with your values:

```azurepowershell
## Place the load balancer in a variable. ##
$lbpara = @{
    ResourceGroupName = <your-resource-group-name>
    Name = <your-load-balancer-name>
}
$lb = Get-AzLoadBalancer @lbpara
    
## Place the event hub in a variable. ##
$hubpara = @{
    ResourceGroupName = <your-resource-group-name>
    Name = <your-event-hub-name>
}
$eventhub = Get-AzEventHubNamespace @hubpara

## Place the event hub authorization rule in a variable. ##    
$hubrule = @{
    ResourceGroupName = 'myResourceGroup'
    Namespace = 'myeventhub8675'
}
$eventhubrule = Get-AzEventHubAuthorizationRule @hubrule

## Enable the diagnostic setting. ##
Set-AzDiagnosticSetting `
    -ResourceId $lb.Id `
    -Name 'myDiagSetting-event'`
    -EventHubName $eventhub.Name `
    -EventHubAuthorizationRuleId $eventhubrule.Id `
    -Enabled $true `
    -MetricCategory 'AllMetrics'
```

### Azure CLI

Sign in to Azure CLI:

```azurecli
az login
```

#### Log analytics workspace

To send resource logs to a Log Analytics workspace, enter these commands. Replace the bracketed values with your values:

```azurecli
lbid=$(az network lb show \
    --name <your-load-balancer-name> \
    --resource-group <your-resource-group> \
    --query id \
    --output tsv)

wsid=$(az monitor log-analytics workspace show \
    --resource-group <your-resource-group> \
    --workspace-name <your-log-analytics-workspace-name> \
    --query id \
    --output tsv)
    
az monitor diagnostic-settings create \
    --name <your-diagnostic-setting-name> \
    --resource $lbid \
    --metrics '[{"category": "AllMetrics","enabled": true}]' \
    --workspace $wsid
```

#### Storage account

To send resource logs to a storage account, enter these commands. Replace the bracketed values with your values:

```azurecli
lbid=$(az network lb show \
    --name <your-load-balancer-name> \
    --resource-group <your-resource-group> \
    --query id \
    --output tsv)

storid=$(az storage account show \
        --name <your-storage-account-name> \
        --resource-group <your-resource-group> \
        --query id \
        --output tsv)
    
az monitor diagnostic-settings create \
    --name <your-diagnostic-setting-name> \
    --resource $lbid \
    --metrics '[{"category": "AllMetrics","enabled": true}]' \
    --storage-account $storid
```

#### Event hub

To send resource logs to an event hub namespace, enter these commands. Replace the bracketed values with your values:

```azurecli
lbid=$(az network lb show \
    --name <your-load-balancer-name> \
    --resource-group <your-resource-group> \
    --query id \
    --output tsv)

az monitor diagnostic-settings create \
    --name myDiagSetting-event \
    --resource $lbid \
    --metrics '[{"category": "AllMetrics","enabled": true}]' \
    --event-hub-rule /subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group>/providers/Microsoft.EventHub/namespaces/<your-event-hub-namespace>/authorizationrules/RootManageSharedAccessKey
```

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

> [!NOTE]
>  Load balancer activity logs will not include updates to NIC-based backend pools. To monitor and alert on updates to the load balancer backend pool for NIC-based backend pools, we recommend collecting logs on the NIC resource-level or at a resource group level instead. 

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

## Analyzing Load Balancer Traffic with VNet flow logs

[Virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md) are a feature of Azure Network Watcher that logs information about IP traffic flowing through a virtual network. Flow data from virtual network flow logs is sent to Azure Storage. From there, you can access the data and export it to any visualization tool, security information and event management (SIEM) solution, or intrusion detection system (IDS).

For general guidance on creating and managing virtual network flow logs, see [Manage virtual network flow logs](../network-watcher/vnet-flow-logs-portal.md). Once you have created your virtual network flow logs, you can access the data on [Log Analytics workspaces](/azure/azure-monitor/logs/log-analytics-overview) where you can also query and filter the data to identify traffic flowing through your Load Balancer. See [Traffic analytics schema and data aggregation](../network-watcher/traffic-analytics-schema.md) for more details on the virtual network flow logs schema.

You can also enable [Traffic Analytics](../network-watcher/traffic-analytics.md) when you are creating your virtual network flow logs which provides insights and visualizations on the flow log data such as traffic distribution, traffic pattern, application ports utilized, and top talkers in your virtual network.
## Log Analytics query for VNet flow logs
To view logs for inbound flows connected to a specific Load Balancer:

```Kusto
NTANetAnalytics
| where DestLoadBalancer == '<Subscription ID>/<Resource Group name>/<Load Balancer name>'
```

1. Use the query above in your Log Analytics workspace and update the string with the valid values for your Load Balancer. To learn more about using Log Analytics, see [Log Analytics tutorial](/azure/azure-monitor/logs/log-analytics-tutorial).

1. To view the source IP of the connection, either the `SrcIp` or `SrcPublicIps` column will be populated. All traffic originating from public non-malicious or Azure service-owned IP addresses will appear in `SrcPublicIps` and all other source IPs will appear in `SrcIP`. If you want more details on the type of traffic, you can use the `FlowType` column to filter for different types of IP addresses involved in the flow. See  [Traffic analytics schema and data aggregation notes](../network-watcher/traffic-analytics-schema.md#notes) for `FlowType` field definitions.

1. Identify the backend pool instances being used in the inbound connection through any of the following columns: `DestIP`, `MacAddress`, `DestVM`, `TargetResourceID`, `DestNic`.

1. Through these logs, you can gather further information about the connections going through your Load Balancer such as port information, protocol, and traffic size through packet and byte count sent from destination and source. 



[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

[!INCLUDE [horz-monitor-insights-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-insights-alerts.md)]

### Load Balancer alert rules

The following table lists some suggested alert rules for Load Balancer. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Azure Load Balancer monitoring data reference](monitor-load-balancer-reference.md).

| Alert type | Condition | Description |
|:---|:---|:---|
| Load balancing rule unavailable due to unavailable VMs | If data path availability split by Frontend IP address and Frontend Port (all known and future values) is equal to zero, or in a second independent alert, if health probe status is equal to zero, then fire alerts | These alerts help determine if the data path availability for any configured load balancing rules isn't servicing traffic due to all VMs in the associated backend pool being probed down by the configured health probe. Review load balancer [troubleshooting guide](load-balancer-troubleshoot.md) to investigate the potential root cause. |
| VM availability significantly low | If health probe status split by Backend IP and Backend Port is equal to user defined probed-up percentage of total pool size (that is, 25% are probed up), then fire alert | This alert determines if there are less than needed VMs available to serve traffic |
| Outbound connections to internet endpoint failing | If SNAT Connection Count filtered to Connection State = Failed is greater than zero, then fire alert | This alert fires when SNAT ports are exhausted and VMs are failing to initiate outbound connections. |
| Approaching SNAT exhaustion | If Used SNAT Ports is greater than user defined number, then fire alert | This alert requires a static outbound configuration where the same number of ports are always allocated. It then fires when a percentage of the allocated ports is used. |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Azure Load Balancer monitoring data reference](monitor-load-balancer-reference.md) for a reference of the metrics, logs, and other important values created for Load Balancer.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
