---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 08/04/2022
ms.author: davidsmatlak
ms.custom: generated
---

### View recent Azure Monitor alerts

This sample query gets all Azure Monitor alerts that were fired in the last 12 hours and extracts
commonly used properties.

```kusto
alertsmanagementresources
| where properties.essentials.startDateTime > ago(12h)
| project
  alertId = id,
  name,
  monitorCondition = tostring(properties.essentials.monitorCondition),
  severity = tostring(properties.essentials.severity),
  monitorService = tostring(properties.essentials.monitorService),
  alertState = tostring(properties.essentials.alertState),
  targetResourceType = tostring(properties.essentials.targetResourceType),
  targetResource = tostring(properties.essentials.targetResource),
  subscriptionId,
  startDateTime = todatetime(properties.essentials.startDateTime),
  lastModifiedDateTime = todatetime(properties.essentials.lastModifiedDateTime),
  dimensions = properties.context.context.condition.allOf[0].dimensions, properties
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "alertsmanagementresources | where properties.essentials.startDateTime > ago(12h) | project   alertId = id,   name,   monitorCondition = tostring(properties.essentials.monitorCondition),   severity = tostring(properties.essentials.severity),   monitorService = tostring(properties.essentials.monitorService),   alertState = tostring(properties.essentials.alertState),   targetResourceType = tostring(properties.essentials.targetResourceType),   targetResource = tostring(properties.essentials.targetResource),   subscriptionId,   startDateTime = todatetime(properties.essentials.startDateTime),   lastModifiedDateTime = todatetime(properties.essentials.lastModifiedDateTime),   dimensions = properties.context.context.condition.allOf[0].dimensions, properties"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "alertsmanagementresources | where properties.essentials.startDateTime > ago(12h) | project   alertId = id,   name,   monitorCondition = tostring(properties.essentials.monitorCondition),   severity = tostring(properties.essentials.severity),   monitorService = tostring(properties.essentials.monitorService),   alertState = tostring(properties.essentials.alertState),   targetResourceType = tostring(properties.essentials.targetResourceType),   targetResource = tostring(properties.essentials.targetResource),   subscriptionId,   startDateTime = todatetime(properties.essentials.startDateTime),   lastModifiedDateTime = todatetime(properties.essentials.lastModifiedDateTime),   dimensions = properties.context.context.condition.allOf[0].dimensions, properties"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%20%7C%20where%20properties.essentials.startDateTime%20%3E%20ago%2812h%29%20%7C%20project%20%20%20alertId%20%3D%20id%2C%20%20%20name%2C%20%20%20monitorCondition%20%3D%20tostring%28properties.essentials.monitorCondition%29%2C%20%20%20severity%20%3D%20tostring%28properties.essentials.severity%29%2C%20%20%20monitorService%20%3D%20tostring%28properties.essentials.monitorService%29%2C%20%20%20alertState%20%3D%20tostring%28properties.essentials.alertState%29%2C%20%20%20targetResourceType%20%3D%20tostring%28properties.essentials.targetResourceType%29%2C%20%20%20targetResource%20%3D%20tostring%28properties.essentials.targetResource%29%2C%20%20%20subscriptionId%2C%20%20%20startDateTime%20%3D%20todatetime%28properties.essentials.startDateTime%29%2C%20%20%20lastModifiedDateTime%20%3D%20todatetime%28properties.essentials.lastModifiedDateTime%29%2C%20%20%20dimensions%20%3D%20properties.context.context.condition.allOf%5B0%5D.dimensions%2C%20properties" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%20%7C%20where%20properties.essentials.startDateTime%20%3E%20ago%2812h%29%20%7C%20project%20%20%20alertId%20%3D%20id%2C%20%20%20name%2C%20%20%20monitorCondition%20%3D%20tostring%28properties.essentials.monitorCondition%29%2C%20%20%20severity%20%3D%20tostring%28properties.essentials.severity%29%2C%20%20%20monitorService%20%3D%20tostring%28properties.essentials.monitorService%29%2C%20%20%20alertState%20%3D%20tostring%28properties.essentials.alertState%29%2C%20%20%20targetResourceType%20%3D%20tostring%28properties.essentials.targetResourceType%29%2C%20%20%20targetResource%20%3D%20tostring%28properties.essentials.targetResource%29%2C%20%20%20subscriptionId%2C%20%20%20startDateTime%20%3D%20todatetime%28properties.essentials.startDateTime%29%2C%20%20%20lastModifiedDateTime%20%3D%20todatetime%28properties.essentials.lastModifiedDateTime%29%2C%20%20%20dimensions%20%3D%20properties.context.context.condition.allOf%5B0%5D.dimensions%2C%20properties" target="_blank">portal.Azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%20%7C%20where%20properties.essentials.startDateTime%20%3E%20ago%2812h%29%20%7C%20project%20%20%20alertId%20%3D%20id%2C%20%20%20name%2C%20%20%20monitorCondition%20%3D%20tostring%28properties.essentials.monitorCondition%29%2C%20%20%20severity%20%3D%20tostring%28properties.essentials.severity%29%2C%20%20%20monitorService%20%3D%20tostring%28properties.essentials.monitorService%29%2C%20%20%20alertState%20%3D%20tostring%28properties.essentials.alertState%29%2C%20%20%20targetResourceType%20%3D%20tostring%28properties.essentials.targetResourceType%29%2C%20%20%20targetResource%20%3D%20tostring%28properties.essentials.targetResource%29%2C%20%20%20subscriptionId%2C%20%20%20startDateTime%20%3D%20todatetime%28properties.essentials.startDateTime%29%2C%20%20%20lastModifiedDateTime%20%3D%20todatetime%28properties.essentials.lastModifiedDateTime%29%2C%20%20%20dimensions%20%3D%20properties.context.context.condition.allOf%5B0%5D.dimensions%2C%20properties" target="_blank">portal.Azure.cn</a>

---

### View recent Azure Monitor alerts enriched with resource tags

This example query gets all Azure Monitor alerts that were fired in the last 12 hours, extracts commonly used properties, and adds the tags of the target resource.

```kusto
alertsmanagementresources
| where properties.essentials.startDateTime > ago(12h)
| where tostring(properties.essentials.monitorService) <> "ActivityLog Administrative"
| project // converting extracted fields to string / datetime to allow grouping
  alertId = id,
  name,
  monitorCondition = tostring(properties.essentials.monitorCondition),
  severity = tostring(properties.essentials.severity),
  monitorService = tostring(properties.essentials.monitorService),
  alertState = tostring(properties.essentials.alertState),
  targetResourceType = tostring(properties.essentials.targetResourceType),
  targetResource = tostring(properties.essentials.targetResource),
  subscriptionId,
  startDateTime = todatetime(properties.essentials.startDateTime),
  lastModifiedDateTime = todatetime(properties.essentials.lastModifiedDateTime),
  dimensions = properties.context.context.condition.allOf[0].dimensions, // usefor metric alerts and log search alerts
  properties
| extend targetResource = tolower(targetResource)
| join kind=leftouter
  ( resources | project targetResource = tolower(id), targetResourceTags = tags) on targetResource
| project-away targetResource1
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "alertsmanagementresources | where properties.essentials.startDateTime > ago(12h) | where tostring(properties.essentials.monitorService) <> "ActivityLog Administrative" | project // converting extracted fields to string / datetime to allow grouping   alertId = id,   name,   monitorCondition = tostring(properties.essentials.monitorCondition),   severity = tostring(properties.essentials.severity),   monitorService = tostring(properties.essentials.monitorService),   alertState = tostring(properties.essentials.alertState),   targetResourceType = tostring(properties.essentials.targetResourceType),   targetResource = tostring(properties.essentials.targetResource),   subscriptionId,   startDateTime = todatetime(properties.essentials.startDateTime),   lastModifiedDateTime = todatetime(properties.essentials.lastModifiedDateTime),   dimensions = properties.context.context.condition.allOf[0].dimensions, // usefor metric alerts and log search alerts   properties | extend targetResource = tolower(targetResource) | join kind=leftouter   ( resources | project targetResource = tolower(id), targetResourceTags = tags) on targetResource | project-away targetResource1"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "alertsmanagementresources | where properties.essentials.startDateTime > ago(12h) | where tostring(properties.essentials.monitorService) <> "ActivityLog Administrative" | project // converting extracted fields to string / datetime to allow grouping   alertId = id,   name,   monitorCondition = tostring(properties.essentials.monitorCondition),   severity = tostring(properties.essentials.severity),   monitorService = tostring(properties.essentials.monitorService),   alertState = tostring(properties.essentials.alertState),   targetResourceType = tostring(properties.essentials.targetResourceType),   targetResource = tostring(properties.essentials.targetResource),   subscriptionId,   startDateTime = todatetime(properties.essentials.startDateTime),   lastModifiedDateTime = todatetime(properties.essentials.lastModifiedDateTime),   dimensions = properties.context.context.condition.allOf[0].dimensions, // usefor metric alerts and log search alerts   properties | extend targetResource = tolower(targetResource) | join kind=leftouter   ( resources | project targetResource = tolower(id), targetResourceTags = tags) on targetResource | project-away targetResource1"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%20%7C%20where%20properties.essentials.startDateTime%20%3E%20ago%2812h%29%20%7C%20where%20tostring%28properties.essentials.monitorService%29%20%3C%3E%20%22ActivityLog%20Administrative%22%20%7C%20project%20%2F%2F%20converting%20extracted%20fields%20to%20string%20%2F%20datetime%20to%20allow%20grouping%20%20%20alertId%20%3D%20id%2C%20%20%20name%2C%20%20%20monitorCondition%20%3D%20tostring%28properties.essentials.monitorCondition%29%2C%20%20%20severity%20%3D%20tostring%28properties.essentials.severity%29%2C%20%20%20monitorService%20%3D%20tostring%28properties.essentials.monitorService%29%2C%20%20%20alertState%20%3D%20tostring%28properties.essentials.alertState%29%2C%20%20%20targetResourceType%20%3D%20tostring%28properties.essentials.targetResourceType%29%2C%20%20%20targetResource%20%3D%20tostring%28properties.essentials.targetResource%29%2C%20%20%20subscriptionId%2C%20%20%20startDateTime%20%3D%20todatetime%28properties.essentials.startDateTime%29%2C%20%20%20lastModifiedDateTime%20%3D%20todatetime%28properties.essentials.lastModifiedDateTime%29%2C%20%20%20dimensions%20%3D%20properties.context.context.condition.allOf%5B0%5D.dimensions%2C%20%2F%2F%20usefor%20metric%20alerts%20and%20log%20search%20alerts%20%20%20properties%20%7C%20extend%20targetResource%20%3D%20tolower%28targetResource%29%20%7C%20join%20kind%3Dleftouter%20%20%20%28%20resources%20%7C%20project%20targetResource%20%3D%20tolower%28id%29%2C%20targetResourceTags%20%3D%20tags%29%20on%20targetResource%20%7C%20project-away%20targetResource1" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%20%7C%20where%20properties.essentials.startDateTime%20%3E%20ago%2812h%29%20%7C%20where%20tostring%28properties.essentials.monitorService%29%20%3C%3E%20%22ActivityLog%20Administrative%22%20%7C%20project%20%2F%2F%20converting%20extracted%20fields%20to%20string%20%2F%20datetime%20to%20allow%20grouping%20%20%20alertId%20%3D%20id%2C%20%20%20name%2C%20%20%20monitorCondition%20%3D%20tostring%28properties.essentials.monitorCondition%29%2C%20%20%20severity%20%3D%20tostring%28properties.essentials.severity%29%2C%20%20%20monitorService%20%3D%20tostring%28properties.essentials.monitorService%29%2C%20%20%20alertState%20%3D%20tostring%28properties.essentials.alertState%29%2C%20%20%20targetResourceType%20%3D%20tostring%28properties.essentials.targetResourceType%29%2C%20%20%20targetResource%20%3D%20tostring%28properties.essentials.targetResource%29%2C%20%20%20subscriptionId%2C%20%20%20startDateTime%20%3D%20todatetime%28properties.essentials.startDateTime%29%2C%20%20%20lastModifiedDateTime%20%3D%20todatetime%28properties.essentials.lastModifiedDateTime%29%2C%20%20%20dimensions%20%3D%20properties.context.context.condition.allOf%5B0%5D.dimensions%2C%20%2F%2F%20usefor%20metric%20alerts%20and%20log%20search%20alerts%20%20%20properties%20%7C%20extend%20targetResource%20%3D%20tolower%28targetResource%29%20%7C%20join%20kind%3Dleftouter%20%20%20%28%20resources%20%7C%20project%20targetResource%20%3D%20tolower%28id%29%2C%20targetResourceTags%20%3D%20tags%29%20on%20targetResource%20%7C%20project-away%20targetResource1" target="_blank">portal.Azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%20%7C%20where%20properties.essentials.startDateTime%20%3E%20ago%2812h%29%20%7C%20where%20tostring%28properties.essentials.monitorService%29%20%3C%3E%20%22ActivityLog%20Administrative%22%20%7C%20project%20%2F%2F%20converting%20extracted%20fields%20to%20string%20%2F%20datetime%20to%20allow%20grouping%20%20%20alertId%20%3D%20id%2C%20%20%20name%2C%20%20%20monitorCondition%20%3D%20tostring%28properties.essentials.monitorCondition%29%2C%20%20%20severity%20%3D%20tostring%28properties.essentials.severity%29%2C%20%20%20monitorService%20%3D%20tostring%28properties.essentials.monitorService%29%2C%20%20%20alertState%20%3D%20tostring%28properties.essentials.alertState%29%2C%20%20%20targetResourceType%20%3D%20tostring%28properties.essentials.targetResourceType%29%2C%20%20%20targetResource%20%3D%20tostring%28properties.essentials.targetResource%29%2C%20%20%20subscriptionId%2C%20%20%20startDateTime%20%3D%20todatetime%28properties.essentials.startDateTime%29%2C%20%20%20lastModifiedDateTime%20%3D%20todatetime%28properties.essentials.lastModifiedDateTime%29%2C%20%20%20dimensions%20%3D%20properties.context.context.condition.allOf%5B0%5D.dimensions%2C%20%2F%2F%20usefor%20metric%20alerts%20and%20log%20search%20alerts%20%20%20properties%20%7C%20extend%20targetResource%20%3D%20tolower%28targetResource%29%20%7C%20join%20kind%3Dleftouter%20%20%20%28%20resources%20%7C%20project%20targetResource%20%3D%20tolower%28id%29%2C%20targetResourceTags%20%3D%20tags%29%20on%20targetResource%20%7C%20project-away%20targetResource1" target="_blank">portal.Azure.cn</a>

---

### List all Azure Arc-enabled Kubernetes clusters with the Azure Monitor extension

Returns the connected cluster ID of each Azure Arc-enabled Kubernetes cluster that has the Azure Monitor extension installed.

```kusto
KubernetesConfigurationResources
| where type == 'microsoft.kubernetesconfiguration/extensions'
| where properties.ExtensionType  == 'microsoft.azuremonitor.containers'
| parse id with connectedClusterId '/providers/Microsoft.KubernetesConfiguration/Extensions' *
| project connectedClusterId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "KubernetesConfigurationResources | where type == 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.azuremonitor.containers' | parse id with connectedClusterId '/providers/Microsoft.KubernetesConfiguration/Extensions' * | project connectedClusterId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "KubernetesConfigurationResources | where type == 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.azuremonitor.containers' | parse id with connectedClusterId '/providers/Microsoft.KubernetesConfiguration/Extensions' * | project connectedClusterId"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/KubernetesConfigurationResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%7c%20parse%20id%20with%20connectedClusterId%20%27%2fproviders%2fMicrosoft.KubernetesConfiguration%2fExtensions%27%20*%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/KubernetesConfigurationResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%7c%20parse%20id%20with%20connectedClusterId%20%27%2fproviders%2fMicrosoft.KubernetesConfiguration%2fExtensions%27%20*%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/KubernetesConfigurationResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%7c%20parse%20id%20with%20connectedClusterId%20%27%2fproviders%2fMicrosoft.KubernetesConfiguration%2fExtensions%27%20*%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.cn</a>

---

### List all Azure Arc-enabled Kubernetes clusters without the Azure Monitor extension

Returns the connected cluster ID of each Azure Arc-enabled Kubernetes cluster that's missing the Azure Monitor extension.

```kusto
Resources
| where type =~ 'Microsoft.Kubernetes/connectedClusters' | extend connectedClusterId = tolower(id) | project connectedClusterId
| join kind = leftouter
	(KubernetesConfigurationResources
	| where type == 'microsoft.kubernetesconfiguration/extensions'
	| where properties.ExtensionType  == 'microsoft.azuremonitor.containers'
	| parse tolower(id) with connectedClusterId '/providers/microsoft.kubernetesconfiguration/extensions' *
	| project connectedClusterId
)  on connectedClusterId
| where connectedClusterId1 == ''
| project connectedClusterId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'Microsoft.Kubernetes/connectedClusters' | extend connectedClusterId = tolower(id) | project connectedClusterId | join kind = leftouter (KubernetesConfigurationResources | where type == 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.azuremonitor.containers' | parse tolower(id) with connectedClusterId '/providers/microsoft.kubernetesconfiguration/extensions' * | project connectedClusterId ) on connectedClusterId | where connectedClusterId1 == '' | project connectedClusterId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Kubernetes/connectedClusters' | extend connectedClusterId = tolower(id) | project connectedClusterId | join kind = leftouter (KubernetesConfigurationResources | where type == 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.azuremonitor.containers' | parse tolower(id) with connectedClusterId '/providers/microsoft.kubernetesconfiguration/extensions' * | project connectedClusterId ) on connectedClusterId | where connectedClusterId1 == '' | project connectedClusterId"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20%7c%20extend%20connectedClusterId%20%3d%20tolower(id)%20%7c%20project%20connectedClusterId%20%0a%7c%20join%20kind%20%3d%20leftouter%0a%09(KubernetesConfigurationResources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%09%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%09%7c%20parse%20tolower(id)%20with%20connectedClusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2fextensions%27%20*%0a%09%7c%20project%20connectedClusterId%0a)%20%20on%20connectedClusterId%0a%7c%20where%20connectedClusterId1%20%3d%3d%20%27%27%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20%7c%20extend%20connectedClusterId%20%3d%20tolower(id)%20%7c%20project%20connectedClusterId%20%0a%7c%20join%20kind%20%3d%20leftouter%0a%09(KubernetesConfigurationResources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%09%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%09%7c%20parse%20tolower(id)%20with%20connectedClusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2fextensions%27%20*%0a%09%7c%20project%20connectedClusterId%0a)%20%20on%20connectedClusterId%0a%7c%20where%20connectedClusterId1%20%3d%3d%20%27%27%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20%7c%20extend%20connectedClusterId%20%3d%20tolower(id)%20%7c%20project%20connectedClusterId%20%0a%7c%20join%20kind%20%3d%20leftouter%0a%09(KubernetesConfigurationResources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%09%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%09%7c%20parse%20tolower(id)%20with%20connectedClusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2fextensions%27%20*%0a%09%7c%20project%20connectedClusterId%0a)%20%20on%20connectedClusterId%0a%7c%20where%20connectedClusterId1%20%3d%3d%20%27%27%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.cn</a>

---

### Returns all Azure Monitor alerts in a subscription in the last day

```json
{
  "subscriptions": [
    <subscriptionId>
  ],
  "query": "alertsmanagementresources | where properties.essentials.lastModifiedDateTime > ago(1d) | project alertInstanceId = id, parentRuleId = tolower(tostring(properties['essentials']['alertRule'])), sourceId = properties['essentials']['sourceCreatedId'], alertName = name, severity = properties.essentials.severity, status = properties.essentials.monitorCondition, state = properties.essentials.alertState, affectedResource = properties.essentials.targetResourceName, monitorService = properties.essentials.monitorService, signalType = properties.essentials.signalType, firedTime = properties['essentials']['startDateTime'], lastModifiedDate = properties.essentials.lastModifiedDateTime, lastModifiedBy = properties.essentials.lastModifiedUserName"
}
```
