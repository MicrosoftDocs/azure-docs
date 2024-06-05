---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 04/09/2024
ms.author: davidsmatlak
ms.custom: generated
---

### Active Service Health event subscription impact

Returns all active Service Health events - including service issues, planned maintenance, health advisories, and security advisories – grouped by event type and including count of impacted subscriptions.

```kusto
ServiceHealthResources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend eventType = tostring(properties.EventType), status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = properties.ImpactMitigationTime
| where eventType == 'ServiceIssue' and status == 'Active'
| summarize count(subscriptionId) by name
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = tostring(properties.EventType), status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = properties.ImpactMitigationTime | where eventType == 'ServiceIssue' and status == 'Active' | summarize count(subscriptionId) by name"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = tostring(properties.EventType), status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = properties.ImpactMitigationTime | where eventType == 'ServiceIssue' and status == 'Active' | summarize count(subscriptionId) by name"
```

# [Portal](#tab/azure-portal)

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20tostring%28properties.EventType%29%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20properties.ImpactMitigationTime%0D%0A%7C%20where%20eventType%20%3D%3D%20%27ServiceIssue%27%20and%20status%20%3D%3D%20%27Active%27%0D%0A%7C%20summarize%20count%28subscriptionId%29%20by%20name" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20tostring%28properties.EventType%29%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20properties.ImpactMitigationTime%0D%0A%7C%20where%20eventType%20%3D%3D%20%27ServiceIssue%27%20and%20status%20%3D%3D%20%27Active%27%0D%0A%7C%20summarize%20count%28subscriptionId%29%20by%20name" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20tostring%28properties.EventType%29%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20properties.ImpactMitigationTime%0D%0A%7C%20where%20eventType%20%3D%3D%20%27ServiceIssue%27%20and%20status%20%3D%3D%20%27Active%27%0D%0A%7C%20summarize%20count%28subscriptionId%29%20by%20name" target="_blank">portal.azure.cn</a>

---

### All active health advisory events

Returns all active health advisory Service Health events across all subscriptions to which the user has access.

```kusto
ServiceHealthResources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime))
| where eventType == 'HealthAdvisory' and impactMitigationTime > now()
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where eventType == 'HealthAdvisory' and impactMitigationTime > now()"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where eventType == 'HealthAdvisory' and impactMitigationTime > now()"
```

# [Portal](#tab/azure-portal)

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20todatetime%28tolong%28properties.ImpactMitigationTime%29%29%0D%0A%7C%20where%20eventType%20%3D%3D%20%27HealthAdvisory%27%20and%20impactMitigationTime%20%3E%20now%28%29" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20todatetime%28tolong%28properties.ImpactMitigationTime%29%29%0D%0A%7C%20where%20eventType%20%3D%3D%20%27HealthAdvisory%27%20and%20impactMitigationTime%20%3E%20now%28%29" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20todatetime%28tolong%28properties.ImpactMitigationTime%29%29%0D%0A%7C%20where%20eventType%20%3D%3D%20%27HealthAdvisory%27%20and%20impactMitigationTime%20%3E%20now%28%29" target="_blank">portal.azure.cn</a>

---

### All active planned maintenance events

Returns all active planned maintenance Service Health events across all subscriptions to which the user has access.

```kusto
ServiceHealthResources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime))
| where eventType == 'PlannedMaintenance' and impactMitigationTime > now()
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where eventType == 'PlannedMaintenance' and impactMitigationTime > now()"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = todatetime(tolong(properties.ImpactMitigationTime)) | where eventType == 'PlannedMaintenance' and impactMitigationTime > now()"
```

# [Portal](#tab/azure-portal)

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20todatetime%28tolong%28properties.ImpactMitigationTime%29%29%0D%0A%7C%20where%20eventType%20%3D%3D%20%27PlannedMaintenance%27%20and%20impactMitigationTime%20%3E%20now%28%29" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20todatetime%28tolong%28properties.ImpactMitigationTime%29%29%0D%0A%7C%20where%20eventType%20%3D%3D%20%27PlannedMaintenance%27%20and%20impactMitigationTime%20%3E%20now%28%29" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20todatetime%28tolong%28properties.ImpactMitigationTime%29%29%0D%0A%7C%20where%20eventType%20%3D%3D%20%27PlannedMaintenance%27%20and%20impactMitigationTime%20%3E%20now%28%29" target="_blank">portal.azure.cn</a>

---

### All active Service Health events

Returns all active Service Health events across all subscriptions to which the user has access including service issues, planned maintenance, health advisories, and security advisories.

```kusto
ServiceHealthResources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = properties.ImpactMitigationTime
| where (eventType in ('HealthAdvisory', 'SecurityAdvisory', 'PlannedMaintenance') and impactMitigationTime > now()) or (eventType == 'ServiceIssue' and status == 'Active')
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = properties.ImpactMitigationTime | where (eventType in ('HealthAdvisory', 'SecurityAdvisory', 'PlannedMaintenance') and impactMitigationTime > now()) or (eventType == 'ServiceIssue' and status == 'Active')"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = properties.ImpactMitigationTime | where (eventType in ('HealthAdvisory', 'SecurityAdvisory', 'PlannedMaintenance') and impactMitigationTime > now()) or (eventType == 'ServiceIssue' and status == 'Active')"
```

# [Portal](#tab/azure-portal)

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20properties.ImpactMitigationTime%0D%0A%7C%20where%20%28eventType%20in%20%28%27HealthAdvisory%27%2C%20%27SecurityAdvisory%27%2C%20%27PlannedMaintenance%27%29%20and%20impactMitigationTime%20%3E%20now%28%29%29%20or%20%28eventType%20%3D%3D%20%27ServiceIssue%27%20and%20status%20%3D%3D%20%27Active%27%29" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20properties.ImpactMitigationTime%0D%0A%7C%20where%20%28eventType%20in%20%28%27HealthAdvisory%27%2C%20%27SecurityAdvisory%27%2C%20%27PlannedMaintenance%27%29%20and%20impactMitigationTime%20%3E%20now%28%29%29%20or%20%28eventType%20%3D%3D%20%27ServiceIssue%27%20and%20status%20%3D%3D%20%27Active%27%29" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20properties.ImpactMitigationTime%0D%0A%7C%20where%20%28eventType%20in%20%28%27HealthAdvisory%27%2C%20%27SecurityAdvisory%27%2C%20%27PlannedMaintenance%27%29%20and%20impactMitigationTime%20%3E%20now%28%29%29%20or%20%28eventType%20%3D%3D%20%27ServiceIssue%27%20and%20status%20%3D%3D%20%27Active%27%29" target="_blank">portal.azure.cn</a>

---

### All active service issue events

Returns all active service issue (outage) Service Health events across all subscriptions to which the user has access.

```kusto
ServiceHealthResources
| where type =~ 'Microsoft.ResourceHealth/events'
| extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = properties.ImpactMitigationTime
| where eventType == 'ServiceIssue' and status == 'Active'
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = properties.ImpactMitigationTime | where eventType == 'ServiceIssue' and status == 'Active'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ServiceHealthResources | where type =~ 'Microsoft.ResourceHealth/events' | extend eventType = properties.EventType, status = properties.Status, description = properties.Title, trackingId = properties.TrackingId, summary = properties.Summary, priority = properties.Priority, impactStartTime = properties.ImpactStartTime, impactMitigationTime = properties.ImpactMitigationTime | where eventType == 'ServiceIssue' and status == 'Active'"
```

# [Portal](#tab/azure-portal)

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20properties.ImpactMitigationTime%0D%0A%7C%20where%20eventType%20%3D%3D%20%27ServiceIssue%27%20and%20status%20%3D%3D%20%27Active%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20properties.ImpactMitigationTime%0D%0A%7C%20where%20eventType%20%3D%3D%20%27ServiceIssue%27%20and%20status%20%3D%3D%20%27Active%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.ResourceHealth%2Fevents%27%0D%0A%7C%20extend%20eventType%20%3D%20properties.EventType%2C%20status%20%3D%20properties.Status%2C%20description%20%3D%20properties.Title%2C%20trackingId%20%3D%20properties.TrackingId%2C%20summary%20%3D%20properties.Summary%2C%20priority%20%3D%20properties.Priority%2C%20impactStartTime%20%3D%20properties.ImpactStartTime%2C%20impactMitigationTime%20%3D%20properties.ImpactMitigationTime%0D%0A%7C%20where%20eventType%20%3D%3D%20%27ServiceIssue%27%20and%20status%20%3D%3D%20%27Active%27" target="_blank">portal.azure.cn</a>

---
