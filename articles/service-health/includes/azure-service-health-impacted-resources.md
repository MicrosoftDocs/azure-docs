---
author: KennedyDenMSFT
ms.author: rboucher
ms.service: service-health
ms.topic: include
ms.date: 2/12/2024
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

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20resourceName%3d%20p.resourceName%2c%20resourceGroup%3dp.resourceGroup%2c%20resourceType%3dp.targetResourceType%2c%20details%20%3d%20p%2c%20id" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20resourceName%3d%20p.resourceName%2c%20resourceGroup%3dp.resourceGroup%2c%20resourceType%3dp.targetResourceType%2c%20details%20%3d%20p%2c%20id" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20resourceName%3d%20p.resourceName%2c%20resourceGroup%3dp.resourceGroup%2c%20resourceType%3dp.targetResourceType%2c%20details%20%3d%20p%2c%20id" target="_blank">portal.azure.cn</a>

---

### Confirmed impacted resources with more details

Returns all impacted resources for all service issue (outage) Service Health events across all subscriptions to which the user has access. This query also provides more details from the `resources` table.

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

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20targetResourceId%20%3d%20tostring(p.targetResourceId)%2c%20details%20%3d%20p%0a%7c%20join%20kind%3dinner%20(%0a%09resources%0a%09)%0a%09on%20%24left.targetResourceId%20%3d%3d%20%24right.id" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20targetResourceId%20%3d%20tostring(p.targetResourceId)%2c%20details%20%3d%20p%0a%7c%20join%20kind%3dinner%20(%0a%09resources%0a%09)%0a%09on%20%24left.targetResourceId%20%3d%3d%20%24right.id" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ServiceHealthResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.resourcehealth%2fevents%2fimpactedresources%27%0a%7c%20extend%20TrackingId%20%3d%20split(split(id%2c%20%27%2fevents%2f%27%2c%201)%5b0%5d%2c%20%27%2fimpactedResources%27%2c%200)%5b0%5d%0a%7c%20extend%20p%20%3d%20%20parse_json(properties)%0a%7c%20project%20subscriptionId%2c%20TrackingId%2c%20targetResourceId%20%3d%20tostring(p.targetResourceId)%2c%20details%20%3d%20p%0a%7c%20join%20kind%3dinner%20(%0a%09resources%0a%09)%0a%09on%20%24left.targetResourceId%20%3d%3d%20%24right.id" target="_blank">portal.azure.cn</a>

---
