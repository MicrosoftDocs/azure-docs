---
ms.service: resource-graph
ms.topic: include
ms.date: 10/27/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### Count Azure Monitor data collection rules by subscription and resource group

This query groups Azure Monitor data collection rules by subscription and resource group.

```kusto
resources
| where type == 'microsoft.insights/datacollectionrules'
| summarize dcrCount = count() by subscriptionId, resourceGroup, location
| sort by dcrCount desc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "resources | where type == 'microsoft.insights/datacollectionrules' | summarize dcrCount = count() by subscriptionId, resourceGroup, location | sort by dcrCount desc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "resources | where type == 'microsoft.insights/datacollectionrules' | summarize dcrCount = count() by subscriptionId, resourceGroup, location | sort by dcrCount desc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20summarize%20dcrCount%20%3D%20count%28%29%20by%20subscriptionId%2C%20resourceGroup%2C%20location%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20summarize%20dcrCount%20%3D%20count%28%29%20by%20subscriptionId%2C%20resourceGroup%2C%20location%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20summarize%20dcrCount%20%3D%20count%28%29%20by%20subscriptionId%2C%20resourceGroup%2C%20location%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.cn</a>

---

### Count Azure Monitor data collection rules by location

This query groups Azure Monitor data collection rules by location.

```kusto
resources
| where type == 'microsoft.insights/datacollectionrules'
| summarize dcrCount=count() by location
| sort by dcrCount desc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "resources | where type == 'microsoft.insights/datacollectionrules' | summarize dcrCount=count() by location | sort by dcrCount desc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "resources | where type == 'microsoft.insights/datacollectionrules' | summarize dcrCount=count() by location | sort by dcrCount desc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20summarize%20dcrCount%3Dcount%28%29%20by%20location%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20summarize%20dcrCount%3Dcount%28%29%20by%20location%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20summarize%20dcrCount%3Dcount%28%29%20by%20location%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.cn</a>

---

### List Azure Monitor data collection rules with Log Analytics workspace as destination

Get the list of Log Analytics workspaces, and for each of the workspaces, list data collection rules that specify the workspace as one of the destinations.

```kusto
resources
| where type == 'microsoft.insights/datacollectionrules'
| extend destinations = properties['destinations']
| extend logAnalyticsWorkspaces = destinations['logAnalytics']
| where isnotnull(logAnalyticsWorkspaces)
| mv-expand logAnalyticsWorkspace = logAnalyticsWorkspaces
| extend logAnalyticsWorkspaceResourceId = tolower(tostring(logAnalyticsWorkspace['workspaceResourceId']))
| summarize dcrList = make_list(id), dcrCount = count() by logAnalyticsWorkspaceResourceId
| sort by dcrCount desc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "resources | where type == 'microsoft.insights/datacollectionrules' | extend destinations = properties['destinations'] | extend logAnalyticsWorkspaces = destinations['logAnalytics'] | where isnotnull(logAnalyticsWorkspaces) | mv-expand logAnalyticsWorkspace = logAnalyticsWorkspaces | extend logAnalyticsWorkspaceResourceId = tolower(tostring(logAnalyticsWorkspace['workspaceResourceId'])) | summarize dcrList = make_list(id), dcrCount = count() by logAnalyticsWorkspaceResourceId | sort by dcrCount desc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "resources | where type == 'microsoft.insights/datacollectionrules' | extend destinations = properties['destinations'] | extend logAnalyticsWorkspaces = destinations['logAnalytics'] | where isnotnull(logAnalyticsWorkspaces) | mv-expand logAnalyticsWorkspace = logAnalyticsWorkspaces | extend logAnalyticsWorkspaceResourceId = tolower(tostring(logAnalyticsWorkspace['workspaceResourceId'])) | summarize dcrList = make_list(id), dcrCount = count() by logAnalyticsWorkspaceResourceId | sort by dcrCount desc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20extend%20destinations%20%3D%20properties%5B%27destinations%27%5D%0D%0A%7C%20extend%20logAnalyticsWorkspaces%20%3D%20destinations%5B%27logAnalytics%27%5D%0D%0A%7C%20where%20isnotnull%28logAnalyticsWorkspaces%29%0D%0A%7C%20mv-expand%20logAnalyticsWorkspace%20%3D%20logAnalyticsWorkspaces%0D%0A%7C%20extend%20logAnalyticsWorkspaceResourceId%20%3D%20tolower%28tostring%28logAnalyticsWorkspace%5B%27workspaceResourceId%27%5D%29%29%0D%0A%7C%20summarize%20dcrList%20%3D%20make_list%28id%29%2C%20dcrCount%20%3D%20count%28%29%20by%20logAnalyticsWorkspaceResourceId%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20extend%20destinations%20%3D%20properties%5B%27destinations%27%5D%0D%0A%7C%20extend%20logAnalyticsWorkspaces%20%3D%20destinations%5B%27logAnalytics%27%5D%0D%0A%7C%20where%20isnotnull%28logAnalyticsWorkspaces%29%0D%0A%7C%20mv-expand%20logAnalyticsWorkspace%20%3D%20logAnalyticsWorkspaces%0D%0A%7C%20extend%20logAnalyticsWorkspaceResourceId%20%3D%20tolower%28tostring%28logAnalyticsWorkspace%5B%27workspaceResourceId%27%5D%29%29%0D%0A%7C%20summarize%20dcrList%20%3D%20make_list%28id%29%2C%20dcrCount%20%3D%20count%28%29%20by%20logAnalyticsWorkspaceResourceId%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20extend%20destinations%20%3D%20properties%5B%27destinations%27%5D%0D%0A%7C%20extend%20logAnalyticsWorkspaces%20%3D%20destinations%5B%27logAnalytics%27%5D%0D%0A%7C%20where%20isnotnull%28logAnalyticsWorkspaces%29%0D%0A%7C%20mv-expand%20logAnalyticsWorkspace%20%3D%20logAnalyticsWorkspaces%0D%0A%7C%20extend%20logAnalyticsWorkspaceResourceId%20%3D%20tolower%28tostring%28logAnalyticsWorkspace%5B%27workspaceResourceId%27%5D%29%29%0D%0A%7C%20summarize%20dcrList%20%3D%20make_list%28id%29%2C%20dcrCount%20%3D%20count%28%29%20by%20logAnalyticsWorkspaceResourceId%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.cn</a>

---

### List data collection rules that use Azure Monitor Metrics as one of its destinations

This query lists data collection rules that use Azure Monitor Metrics as one of its destinations.

```kusto
resources
| where type == 'microsoft.insights/datacollectionrules'
| extend destinations = properties['destinations']
| extend azureMonitorMetrics = destinations['azureMonitorMetrics']
| where isnotnull(azureMonitorMetrics)
| project-away destinations, azureMonitorMetrics
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "resources | where type == 'microsoft.insights/datacollectionrules' | extend destinations = properties['destinations'] | extend azureMonitorMetrics = destinations['azureMonitorMetrics'] | where isnotnull(azureMonitorMetrics) | project-away destinations, azureMonitorMetrics"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "resources | where type == 'microsoft.insights/datacollectionrules' | extend destinations = properties['destinations'] | extend azureMonitorMetrics = destinations['azureMonitorMetrics'] | where isnotnull(azureMonitorMetrics) | project-away destinations, azureMonitorMetrics"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20extend%20destinations%20%3D%20properties%5B%27destinations%27%5D%0D%0A%7C%20extend%20azureMonitorMetrics%20%3D%20destinations%5B%27azureMonitorMetrics%27%5D%0D%0A%7C%20where%20isnotnull%28azureMonitorMetrics%29%0D%0A%7C%20project-away%20destinations%2C%20azureMonitorMetrics" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20extend%20destinations%20%3D%20properties%5B%27destinations%27%5D%0D%0A%7C%20extend%20azureMonitorMetrics%20%3D%20destinations%5B%27azureMonitorMetrics%27%5D%0D%0A%7C%20where%20isnotnull%28azureMonitorMetrics%29%0D%0A%7C%20project-away%20destinations%2C%20azureMonitorMetrics" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionrules%27%0D%0A%7C%20extend%20destinations%20%3D%20properties%5B%27destinations%27%5D%0D%0A%7C%20extend%20azureMonitorMetrics%20%3D%20destinations%5B%27azureMonitorMetrics%27%5D%0D%0A%7C%20where%20isnotnull%28azureMonitorMetrics%29%0D%0A%7C%20project-away%20destinations%2C%20azureMonitorMetrics" target="_blank">portal.azure.cn</a>

---
