---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 07/07/2022
ms.author: davidsmatlak
ms.custom: generated
---

### Active Service Health event subscription impact

Returns all active Service Health events - including service issues, planned maintenance, health advisories, and security advisories – grouped by event type and including count of impacted subscriptions.

```kusto
ServiceHealthResources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend eventType = tostring(properties.EventType), status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime))
| where properties.Status == 'Active' and tolong(impactStartTime) > 1
| summarize count(subscriptionId) by name, eventType
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = tostring(properties.EventType), status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where properties.Status == 'Active' and tolong(impactStartTime) > 1 | summarize count(subscriptionId) by name, eventType"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = tostring(properties.EventType), status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where properties.Status == 'Active' and tolong(impactStartTime) > 1 | summarize count(subscriptionId) by name, eventType"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20tostring(properties.EventType)%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%0a%7c%20summarize%20count(subscriptionId)%20by%20name%2c%20eventType" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20tostring(properties.EventType)%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%0a%7c%20summarize%20count(subscriptionId)%20by%20name%2c%20eventType" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20tostring(properties.EventType)%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%0a%7c%20summarize%20count(subscriptionId)%20by%20name%2c%20eventType" target="_blank">portal.azure.cn</a>

---

### All active health advisory events

Returns all active health advisory Service Health events across all subscriptions to which the user has access.

```kusto
ServiceHealthResources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime))
| where properties.Status == 'Active' and tolong(impactStartTime) > 1 and eventType == 'HealthAdvisory'
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where properties.Status == 'Active' and tolong(impactStartTime) > 1 and eventType == 'HealthAdvisory'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where properties.Status == 'Active' and tolong(impactStartTime) > 1 and eventType == 'HealthAdvisory'"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%20and%20eventType%20%3d%3d%20%27HealthAdvisory%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%20and%20eventType%20%3d%3d%20%27HealthAdvisory%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%20and%20eventType%20%3d%3d%20%27HealthAdvisory%27" target="_blank">portal.azure.cn</a>

---

### All active planned maintenance events

Returns all active planned maintenance Service Health events across all subscriptions to which the user has access.

```kusto
ServiceHealthResources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime))
| where properties.Status == 'Active' and tolong(impactStartTime) > 1 and eventType == 'PlannedMaintenance'
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where properties.Status == 'Active' and tolong(impactStartTime) > 1 and eventType == 'PlannedMaintenance'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where properties.Status == 'Active' and tolong(impactStartTime) > 1 and eventType == 'PlannedMaintenance'"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%20and%20eventType%20%3d%3d%20%27PlannedMaintenance%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%20and%20eventType%20%3d%3d%20%27PlannedMaintenance%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%20and%20eventType%20%3d%3d%20%27PlannedMaintenance%27" target="_blank">portal.azure.cn</a>

---

### All active Service Health events

Returns all active Service Health events across all subscriptions to which the user has access including service issues, planned maintenance, health advisories, and security advisories.

```kusto
ServiceHealthResources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime))
| where properties.Status == 'Active' and tolong(impactStartTime) > 1
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where properties.Status == 'Active' and tolong(impactStartTime) > 1"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where properties.Status == 'Active' and tolong(impactStartTime) > 1"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201" target="_blank">portal.azure.cn</a>

---

### All active service issue events

Returns all active service issue (outage) Service Health events across all subscriptions to which the user has access.

```kusto
ServiceHealthResources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime))
| where properties.Status == 'Active' and tolong(impactStartTime) > 1 and eventType == 'ServiceIssue'
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where properties.Status == 'Active' and tolong(impactStartTime) > 1 and eventType == 'ServiceIssue'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where properties.Status == 'Active' and tolong(impactStartTime) > 1 and eventType == 'ServiceIssue'"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%20and%20eventType%20%3d%3d%20%27ServiceIssue%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%20and%20eventType%20%3d%3d%20%27ServiceIssue%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.ResourceHealth%2fevents%27%0a%7c%20extend%20eventType%20%3d%20properties.EventType%2c%20status%20%3d%20properties.Status%2c%20description%20%3d%20properties.Title%2c%20trackingId%20%3d%20properties.TrackingId%2c%20summary%20%3d%20properties.Summary%2c%20priority%20%3d%20properties.Priority%2c%20impactStartTime%20%3d%20properties.ImpactStartTime%2c%20impactMitigationTime%20%3d%20todatetime(tolong(properties.ImpactMitigationTime))%0a%7c%20where%20properties.Status%20%3d%3d%20%27Active%27%20and%20tolong(impactStartTime)%20%3e%201%20and%20eventType%20%3d%3d%20%27ServiceIssue%27" target="_blank">portal.azure.cn</a>

---

### Confirmed impacted resources

Returns all impacted resources for all service issue (outage) Service Health events across all subscriptions to which the user has access.

```kusto
ServiceHealthResources
| where type == "microsoft.resourcehealth/events/impactedresources"
| extend TrackingId = split(split(id, "/events/", 1)[0], "/impactedResources", 0)[0]
| extend p = parse_json(properties)
| project subscriptionId, TrackingId, resourceName= p.resourceName, resourceGroup=p.resourceGroup, resourceType=p.targetResourceType, details = p, id
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type == 'microsoft.resourcehealth/events/impactedresources' | extend TrackingId = split(split(id, '/events/', 1)[0], '/impactedResources', 0)[0] | extend p = parse_json(properties) | project subscriptionId, TrackingId, resourceName= p.resourceName, resourceGroup=p.resourceGroup, resourceType=p.targetResourceType, details = p, id"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type == 'microsoft.resourcehealth/events/impactedresources' | extend TrackingId = split(split(id, '/events/', 1)[0], '/impactedResources', 0)[0] | extend p = parse_json(properties) | project subscriptionId, TrackingId, resourceName= p.resourceName, resourceGroup=p.resourceGroup, resourceType=p.targetResourceType, details = p, id"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20resourceName%3d%20p.resourceName%2c%20resourceGroup%3dp.resourceGroup%2c%20resourceType%3dp.targetResourceType%2c%20details%20%3d%20p%2c%20id" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20resourceName%3d%20p.resourceName%2c%20resourceGroup%3dp.resourceGroup%2c%20resourceType%3dp.targetResourceType%2c%20details%20%3d%20p%2c%20id" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20resourceName%3d%20p.resourceName%2c%20resourceGroup%3dp.resourceGroup%2c%20resourceType%3dp.targetResourceType%2c%20details%20%3d%20p%2c%20id" target="_blank">portal.azure.cn</a>

---

### Confirmed impacted resources with more details

Returns all impacted resources for all service issue (outage) Service Health events across all subscriptions to which the user has access. This query also provides more details from the 'resources' table.

```kusto
servicehealthresources
| where type == "microsoft.resourcehealth/events/impactedresources"
| extend TrackingId = split(split(id, "/events/", 1)[0], "/impactedResources", 0)[0]
| extend p = parse_json(properties)
| project subscriptionId, TrackingId, targetResourceId= tostring(p.targetResourceId), details = p
| join kind=inner (
    resources
    )
    on $left.targetResourceId == $right.id
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type == 'microsoft.resourcehealth/events/impactedresources' | extend TrackingId = split(split(id, '/events/', 1)[0], '/impactedResources', 0)[0] | extend p =  parse_json(properties) | project subscriptionId, TrackingId, targetResourceId = tostring(p.targetResourceId), details = p | join kind=inner (resources) on $left.targetResourceId == $right.id"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type == 'microsoft.resourcehealth/events/impactedresources' | extend TrackingId = split(split(id, '/events/', 1)[0], '/impactedResources', 0)[0] | extend p =  parse_json(properties) | project subscriptionId, TrackingId, targetResourceId = tostring(p.targetResourceId), details = p | join kind=inner (resources) on $left.targetResourceId == $right.id"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20targetResourceId%20%3d%20tostring(p.targetResourceId)%2c%20details%20%3d%20p%0a%7c%20join%20kind%3dinner%20(%0a%09resources%0a%09)%0a%09on%20%24left.targetResourceId%20%3d%3d%20%24right.id" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20targetResourceId%20%3d%20tostring(p.targetResourceId)%2c%20details%20%3d%20p%0a%7c%20join%20kind%3dinner%20(%0a%09resources%0a%09)%0a%09on%20%24left.targetResourceId%20%3d%3d%20%24right.id" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20targetResourceId%20%3d%20tostring(p.targetResourceId)%2c%20details%20%3d%20p%0a%7c%20join%20kind%3dinner%20(%0a%09resources%0a%09)%0a%09on%20%24left.targetResourceId%20%3d%3d%20%24right.id" target="_blank">portal.azure.cn</a>

---

