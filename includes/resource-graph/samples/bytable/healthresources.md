---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 02/14/2023
ms.author: davidsmatlak
ms.custom: generated
---

### Count of virtual machines by availability state and Subscription Id

Returns the count of virtual machines (type `Microsoft.Compute/virtualMachines`) aggregated by their availability state across each of your subscriptions.

```kusto
HealthResources
| where type =~ 'microsoft.resourcehealth/availabilitystatuses'
| summarize count() by subscriptionId, AvailabilityState = tostring(properties.availabilityState)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | summarize count() by subscriptionId, AvailabilityState = tostring(properties.availabilityState)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | summarize count() by subscriptionId, AvailabilityState = tostring(properties.availabilityState)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20count()%20by%20subscriptionId%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20count()%20by%20subscriptionId%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20count()%20by%20subscriptionId%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.cn</a>

---

### List of virtual machines and associated availability states by Resource Ids

Returns the latest list of virtual machines (type `Microsoft.Compute/virtualMachines`) aggregated by availability state. The query also provides the associated Resource Id based on `properties.targetResourceId`, for easy debugging and mitigation. Availability states can be one of four values: Available, Unavailable, Degraded and Unknown. For more details on what each of the availability states mean, please see [Azure Resource Health overview](../../../../articles/service-health/resource-health-overview.md#health-status).

```kusto
HealthResources
| where type =~ 'microsoft.resourcehealth/availabilitystatuses'
| summarize by ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | summarize by ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | summarize by ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.cn</a>

---

### List of virtual machines by availability state and power state with Resource Ids and resource Groups

Returns list of virtual machines (type `Microsoft.Compute/virtualMachines`) aggregated on their power state and availability state to provide a cohesive state of health for your virtual machines. The query also provides details on the resource group and resource Id associated with each entry for detailed visibility into your resources.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| project resourceGroup, Id = tolower(id), PowerState = tostring( properties.extended.instanceView.powerState.code)
| join kind=leftouter (
	HealthResources
	| where type =~ 'microsoft.resourcehealth/availabilitystatuses'
	| where tostring(properties.targetResourceType) =~ 'microsoft.compute/virtualmachines'
	| project targetResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState))
	on $left.Id == $right.targetResourceId
| project-away targetResourceId
| where PowerState != 'PowerState/deallocated'
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.compute/virtualmachines' | project resourceGroup, Id = tolower(id), PowerState = tostring( properties.extended.instanceView.powerState.code) | join kind=leftouter ( HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | where tostring(properties.targetResourceType) =~ 'microsoft.compute/virtualmachines' | project targetResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)) on \$left.Id == \$right.targetResourceId | project-away targetResourceId | where PowerState != 'PowerState/deallocated'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.compute/virtualmachines' | project resourceGroup, Id = tolower(id), PowerState = tostring( properties.extended.instanceView.powerState.code) | join kind=leftouter ( HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | where tostring(properties.targetResourceType) =~ 'microsoft.compute/virtualmachines' | project targetResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)) on $left.Id == $right.targetResourceId | project-away targetResourceId | where PowerState != 'PowerState/deallocated'"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20project%20resourceGroup%2c%20Id%20%3d%20tolower(id)%2c%20PowerState%20%3d%20tostring(%20properties.extended.instanceView.powerState.code)%0a%7c%20join%20kind%3dleftouter%20(%0a%09HealthResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%09%7c%20where%20tostring(properties.targetResourceType)%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%09%7c%20project%20targetResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState))%0a%09on%20%24left.Id%20%3d%3d%20%24right.targetResourceId%0a%7c%20project-away%20targetResourceId%0a%7c%20where%20PowerState%20!%3d%20%27PowerState%2fdeallocated%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20project%20resourceGroup%2c%20Id%20%3d%20tolower(id)%2c%20PowerState%20%3d%20tostring(%20properties.extended.instanceView.powerState.code)%0a%7c%20join%20kind%3dleftouter%20(%0a%09HealthResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%09%7c%20where%20tostring(properties.targetResourceType)%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%09%7c%20project%20targetResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState))%0a%09on%20%24left.Id%20%3d%3d%20%24right.targetResourceId%0a%7c%20project-away%20targetResourceId%0a%7c%20where%20PowerState%20!%3d%20%27PowerState%2fdeallocated%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20project%20resourceGroup%2c%20Id%20%3d%20tolower(id)%2c%20PowerState%20%3d%20tostring(%20properties.extended.instanceView.powerState.code)%0a%7c%20join%20kind%3dleftouter%20(%0a%09HealthResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%09%7c%20where%20tostring(properties.targetResourceType)%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%09%7c%20project%20targetResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState))%0a%09on%20%24left.Id%20%3d%3d%20%24right.targetResourceId%0a%7c%20project-away%20targetResourceId%0a%7c%20where%20PowerState%20!%3d%20%27PowerState%2fdeallocated%27" target="_blank">portal.azure.cn</a>

---

### List of virtual machines that are not Available by Resource Ids

Returns the latest list of virtual machines (type `Microsoft.Compute/virtualMachines`) aggregated by their availability state. The populated list only highlights virtual machines whose availability state is not "Available" to ensure you are aware of all the concerning states your virtual machines are in. When all your virtual machines are Available, you can expect to receive no results.

```kusto
HealthResources
| where type =~ 'microsoft.resourcehealth/availabilitystatuses'
| where tostring(properties.availabilityState) != 'Available'
| summarize by ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | where tostring(properties.availabilityState) != 'Available' | summarize by ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | where tostring(properties.availabilityState) != 'Available' | summarize by ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20where%20tostring(properties.availabilityState)%20!%3d%20%27Available%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20where%20tostring(properties.availabilityState)%20!%3d%20%27Available%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20where%20tostring(properties.availabilityState)%20!%3d%20%27Available%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.cn</a>

---

### List of resources with availability states that have been impacted by unplanned, platform-initiated health events

Returns the latest list of virtual machines impacted by unplanned disruptions that were triggered unexpectedly by the Azure platform. This query returns all the impacted virtual machines aggregated by their ID property, along with the corresponding availability state and associated annotation (properties.reason) summarizing the specific disruption.

```kusto
HealthResources
| where type == "microsoft.resourcehealth/resourceannotations"
| where  properties.category == 'Unplanned' and  properties.context != 'Customer Initiated'
| project ResourceId = tolower(tostring(properties.targetResourceId)), Annotation = tostring(properties.reason)
| join (
    HealthResources
    | where type == 'microsoft.resourcehealth/availabilitystatuses'
    | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)) on ResourceId
| project ResourceId, AvailabilityState, Annotation
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "HealthResources | where type == "microsoft.resourcehealth/resourceannotations" | where  properties.category == 'Unplanned' and  properties.context != 'Customer Initiated' | project ResourceId = tolower(tostring(properties.targetResourceId)), Annotation = tostring(properties.reason) | join (HealthResources | where type == 'microsoft.resourcehealth/availabilitystatuses' | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)) on ResourceId | project ResourceId, AvailabilityState, Annotation"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResources | where type == "microsoft.resourcehealth/resourceannotations" | where  properties.category == 'Unplanned' and  properties.context != 'Customer Initiated' | project ResourceId = tolower(tostring(properties.targetResourceId)), Annotation = tostring(properties.reason) | join (HealthResources | where type == 'microsoft.resourcehealth/availabilitystatuses' | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)) on ResourceId | project ResourceId, AvailabilityState, Annotation"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%E2%80%AFwhere%E2%80%AF%20properties.category%E2%80%AF%3D%3D%E2%80%AF%27Unplanned%27%E2%80%AFand%E2%80%AF%20properties.context%E2%80%AF%21%3D%E2%80%AF%27Customer%E2%80%AFInitiated%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAnnotation%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFproject%E2%80%AFResourceId%2C%E2%80%AFAvailabilityState%2C%E2%80%AFAnnotation" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%E2%80%AFwhere%E2%80%AF%20properties.category%E2%80%AF%3D%3D%E2%80%AF%27Unplanned%27%E2%80%AFand%E2%80%AF%20properties.context%E2%80%AF%21%3D%E2%80%AF%27Customer%E2%80%AFInitiated%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAnnotation%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFproject%E2%80%AFResourceId%2C%E2%80%AFAvailabilityState%2C%E2%80%AFAnnotation" target="_blank">portal.Azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%E2%80%AFwhere%E2%80%AF%20properties.category%E2%80%AF%3D%3D%E2%80%AF%27Unplanned%27%E2%80%AFand%E2%80%AF%20properties.context%E2%80%AF%21%3D%E2%80%AF%27Customer%E2%80%AFInitiated%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAnnotation%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFproject%E2%80%AFResourceId%2C%E2%80%AFAvailabilityState%2C%E2%80%AFAnnotation" target="_blank">portal.Azure.cn</a>

---

### List of unavailable resources with their corresponding annotation details

Returns a list of virtual machines currently not in an **Available** state, aggregated by their ID property. The query also shows the virtual machines' actual availability state as well as their associated details, including the reason for their unavailability.

```kusto
HealthResources
| where type == 'microsoft.resourcehealth/availabilitystatuses'
| where  properties.availabilityState != 'Available'
| project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)
| join ( 
    HealthResources
    | where type == "microsoft.resourcehealth/resourceannotations"
    | project ResourceId = tolower(tostring(properties.targetResourceId)), Reason = tostring(properties.reason), Context = tostring(properties.context), Category = tostring(properties.category)) on ResourceId
| project ResourceId, AvailabilityState, Reason, Context, Category
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "HealthResources | where type == 'microsoft.resourcehealth/availabilitystatuses' | where  properties.availabilityState != 'Available' | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState) | join (HealthResources | where type == "microsoft.resourcehealth/resourceannotations" |  project ResourceId = tolower(tostring(properties.targetResourceId)), Reason = tostring(properties.reason), Context = tostring(properties.context), Category = tostring(properties.category)) on ResourceId | project ResourceId, AvailabilityState, Reason, Context, Category"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResources | where type == 'microsoft.resourcehealth/availabilitystatuses' | where  properties.availabilityState != 'Available' | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState) | join (HealthResources | where type == "microsoft.resourcehealth/resourceannotations" |  project ResourceId = tolower(tostring(properties.targetResourceId)), Reason = tostring(properties.reason), Context = tostring(properties.context), Category = tostring(properties.category)) on ResourceId | project ResourceId, AvailabilityState, Reason, Context, Category"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%E2%80%AFwhere%E2%80%AF%20properties.availabilityState%E2%80%AF%21%3D%E2%80%AF%27Available%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%20%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFReason%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%2C%E2%80%AFContext%E2%80%AF%3D%E2%80%AFtostring%28properties.context%29%2C%E2%80%AFCategory%E2%80%AF%3D%E2%80%AFtostring%28properties.category%29%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFproject%E2%80%AFResourceId%2C%E2%80%AFAvailabilityState%2C%E2%80%AFReason%2C%E2%80%AFContext%2C%E2%80%AFCategory" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%E2%80%AFwhere%E2%80%AF%20properties.availabilityState%E2%80%AF%21%3D%E2%80%AF%27Available%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%20%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFReason%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%2C%E2%80%AFContext%E2%80%AF%3D%E2%80%AFtostring%28properties.context%29%2C%E2%80%AFCategory%E2%80%AF%3D%E2%80%AFtostring%28properties.category%29%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFproject%E2%80%AFResourceId%2C%E2%80%AFAvailabilityState%2C%E2%80%AFReason%2C%E2%80%AFContext%2C%E2%80%AFCategory" target="_blank">portal.Azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%E2%80%AFwhere%E2%80%AF%20properties.availabilityState%E2%80%AF%21%3D%E2%80%AF%27Available%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%20%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFReason%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%2C%E2%80%AFContext%E2%80%AF%3D%E2%80%AFtostring%28properties.context%29%2C%E2%80%AFCategory%E2%80%AF%3D%E2%80%AFtostring%28properties.category%29%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFproject%E2%80%AFResourceId%2C%E2%80%AFAvailabilityState%2C%E2%80%AFReason%2C%E2%80%AFContext%2C%E2%80%AFCategory" target="_blank">portal.Azure.cn</a>

---

### Count of resources in a region that have been impacted by an availability disruption along with the type of impact

Returns the count of virtual machines that are currently not in an **Available** state, aggregated by their ID property. The query also shows the corresponding location and annotation details, including the cause for the VMs not being in an **Available** state.

```kusto
HealthResources
| where type == 'microsoft.resourcehealth/availabilitystatuses'
| where  properties.availabilityState != 'Available'
| project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState), Location = location
| join ( 
    HealthResources
    | where type == "microsoft.resourcehealth/resourceannotations"
    | project ResourceId = tolower(tostring(properties.targetResourceId)), Context = tostring(properties.context), Category = tostring(properties.category), Location = location) on ResourceId
| summarize NumResources = count(ResourceId) by Location, Context, Category
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "HealthResources | where type == 'microsoft.resourcehealth/availabilitystatuses' | where  properties.availabilityState != 'Available' | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState), Location = location | join (HealthResources | where type == "microsoft.resourcehealth/resourceannotations" | project ResourceId = tolower(tostring(properties.targetResourceId)), Context = tostring(properties.context), Category = tostring(properties.category), Location = location) on ResourceId | summarize NumResources = count(ResourceId) by Location, Context, Category"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResources | where type == 'microsoft.resourcehealth/availabilitystatuses' | where  properties.availabilityState != 'Available' | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState), Location = location | join (HealthResources | where type == "microsoft.resourcehealth/resourceannotations" | project ResourceId = tolower(tostring(properties.targetResourceId)), Context = tostring(properties.context), Category = tostring(properties.category), Location = location) on ResourceId | summarize NumResources = count(ResourceId) by Location, Context, Category"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%E2%80%AFwhere%E2%80%AF%20properties.availabilityState%E2%80%AF%21%3D%E2%80%AF%27Available%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%20Context%E2%80%AF%3D%E2%80%AFtostring%28properties.context%29%2C%E2%80%AFCategory%E2%80%AF%3D%E2%80%AFtostring%28properties.category%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFsummarize%E2%80%AFNumResources%20%3D%20count%28ResourceId%29%E2%80%AFby%E2%80%AFLocation%2C%E2%80%AFContext%2C%E2%80%AFCategory" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%E2%80%AFwhere%E2%80%AF%20properties.availabilityState%E2%80%AF%21%3D%E2%80%AF%27Available%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%20Context%E2%80%AF%3D%E2%80%AFtostring%28properties.context%29%2C%E2%80%AFCategory%E2%80%AF%3D%E2%80%AFtostring%28properties.category%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFsummarize%E2%80%AFNumResources%20%3D%20count%28ResourceId%29%E2%80%AFby%E2%80%AFLocation%2C%E2%80%AFContext%2C%E2%80%AFCategory" target="_blank">portal.Azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%E2%80%AFwhere%E2%80%AF%20properties.availabilityState%E2%80%AF%21%3D%E2%80%AF%27Available%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%20Context%E2%80%AF%3D%E2%80%AFtostring%28properties.context%29%2C%E2%80%AFCategory%E2%80%AF%3D%E2%80%AFtostring%28properties.category%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFsummarize%E2%80%AFNumResources%20%3D%20count%28ResourceId%29%E2%80%AFby%E2%80%AFLocation%2C%E2%80%AFContext%2C%E2%80%AFCategory" target="_blank">portal.Azure.cn</a>

---

### List of resources impacted by a specific health event, along with impact time, impact details, availability state, and region

Returns a list of virtual machines impacted by the `VirtualMachineHostRebootedForRepair` annotation, aggregated by their ID property. The query also returns the virtual machines' corresponding availability state, time of disruption, and annotation details, including the impact cause.

```kusto
HealthResources
| where type == "microsoft.resourcehealth/resourceannotations"
| where properties.AnnotationName contains 'VirtualMachineHostRebootedForRepair'
| project ResourceId = tolower(tostring(properties.targetResourceId)), Reason = tostring(properties.reason), Context = tostring(properties.context), Category = tostring(properties.category), Location = location, Timestamp = tostring(properties.occurredTime)
| join ( 
     HealthResources
    | where type == 'microsoft.resourcehealth/availabilitystatuses'
    | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState), Location = location) on ResourceId
| project ResourceId, Reason, Context, Category, AvailabilityState, Timestamp
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "HealthResources | where type == "microsoft.resourcehealth/resourceannotations" | where properties.AnnotationName contains 'VirtualMachineHostRebootedForRepair' | project ResourceId = tolower(tostring(properties.targetResourceId)), Reason = tostring(properties.reason), Context = tostring(properties.context), Category = tostring(properties.category), Location = location, Timestamp = tostring(properties.occuredTime) | join (HealthResources | where type == 'microsoft.resourcehealth/availabilitystatuses' | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState), Location = location) on ResourceId | project ResourceId, Reason, Context, Category, AvailabilityState, Timestamp"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResources | where type == "microsoft.resourcehealth/resourceannotations" | where properties.AnnotationName contains 'VirtualMachineHostRebootedForRepair' | project ResourceId = tolower(tostring(properties.targetResourceId)), Reason = tostring(properties.reason), Context = tostring(properties.context), Category = tostring(properties.category), Location = location, Timestamp = tostring(properties.occuredTime) | join (HealthResources | where type == 'microsoft.resourcehealth/availabilitystatuses' | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState), Location = location) on ResourceId | project ResourceId, Reason, Context, Category, AvailabilityState, Timestamp"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%E2%80%AFwhere%E2%80%AFproperties.AnnotationName%E2%80%AFcontains%E2%80%AF%27VirtualMachineHostRebootedForRepair%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFReason%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%2C%E2%80%AFContext%E2%80%AF%3D%E2%80%AFtostring%28properties.context%29%2C%E2%80%AFCategory%E2%80%AF%3D%E2%80%AFtostring%28properties.category%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%2C%E2%80%AFTimestamp%E2%80%AF%3D%E2%80%AFtostring%28properties.occuredTime%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFproject%E2%80%AFResourceId%2C%E2%80%AFReason%2C%E2%80%AFContext%2C%E2%80%AFCategory%2C%E2%80%AFAvailabilityState%2C%E2%80%AFTimestamp" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%E2%80%AFwhere%E2%80%AFproperties.AnnotationName%E2%80%AFcontains%E2%80%AF%27VirtualMachineHostRebootedForRepair%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFReason%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%2C%E2%80%AFContext%E2%80%AF%3D%E2%80%AFtostring%28properties.context%29%2C%E2%80%AFCategory%E2%80%AF%3D%E2%80%AFtostring%28properties.category%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%2C%E2%80%AFTimestamp%E2%80%AF%3D%E2%80%AFtostring%28properties.occuredTime%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFproject%E2%80%AFResourceId%2C%E2%80%AFReason%2C%E2%80%AFContext%2C%E2%80%AFCategory%2C%E2%80%AFAvailabilityState%2C%E2%80%AFTimestamp" target="_blank">portal.Azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%E2%80%AFwhere%E2%80%AFproperties.AnnotationName%E2%80%AFcontains%E2%80%AF%27VirtualMachineHostRebootedForRepair%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFReason%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%2C%E2%80%AFContext%E2%80%AF%3D%E2%80%AFtostring%28properties.context%29%2C%E2%80%AFCategory%E2%80%AF%3D%E2%80%AFtostring%28properties.category%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%2C%E2%80%AFTimestamp%E2%80%AF%3D%E2%80%AFtostring%28properties.occuredTime%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFproject%E2%80%AFResourceId%2C%E2%80%AFReason%2C%E2%80%AFContext%2C%E2%80%AFCategory%2C%E2%80%AFAvailabilityState%2C%E2%80%AFTimestamp" target="_blank">portal.Azure.cn</a>

---

### List of resources impacted by planned events per region

Returns a list of virtual machines impacted by planned maintenance or repair operations conducted by the Azure platform, aggregated by their ID property. The query also returns the virtual machines' corresponding availability state, time of disruption, location, and annotation details, including the impact cause.

```kusto
HealthResources
| where type == "microsoft.resourcehealth/resourceannotations"
| where properties.category contains 'Planned'
| project ResourceId = tolower(tostring(properties.targetResourceId)), Reason = tostring(properties.reason), Location = location, Timestamp = tostring(properties.occuredTime)
| join ( 
     HealthResources
    | where type == 'microsoft.resourcehealth/availabilitystatuses'
    | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState), Location = location) on ResourceId
| project ResourceId, Reason, AvailabilityState, Timestamp, Location
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "HealthResources | where type == "microsoft.resourcehealth/resourceannotations" | where properties.category contains 'Planned' | project ResourceId = tolower(tostring(properties.targetResourceId)), Reason = tostring(properties.reason), Location = location, Timestamp = tostring(properties.occuredTime) | join (HealthResources | where type == 'microsoft.resourcehealth/availabilitystatuses' | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState), Location = location) on ResourceId | project ResourceId, Reason, AvailabilityState, Timestamp, Location"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResources | where type == "microsoft.resourcehealth/resourceannotations" | where properties.category contains 'Planned' | project ResourceId = tolower(tostring(properties.targetResourceId)), Reason = tostring(properties.reason), Location = location, Timestamp = tostring(properties.occuredTime) | join (HealthResources | where type == 'microsoft.resourcehealth/availabilitystatuses' | project ResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState), Location = location) on ResourceId | project ResourceId, Reason, AvailabilityState, Timestamp, Location"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%E2%80%AFwhere%E2%80%AFproperties.category%E2%80%AFcontains%E2%80%AF%27Planned%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFReason%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%2C%E2%80%AFTimestamp%E2%80%AF%3D%E2%80%AFtostring%28properties.occuredTime%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%20project%E2%80%AFResourceId%2C%E2%80%AFReason%2C%E2%80%AFAvailabilityState%2C%E2%80%AFTimestamp%2C%E2%80%AFLocation" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%E2%80%AFwhere%E2%80%AFproperties.category%E2%80%AFcontains%E2%80%AF%27Planned%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFReason%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%2C%E2%80%AFTimestamp%E2%80%AF%3D%E2%80%AFtostring%28properties.occuredTime%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%20project%E2%80%AFResourceId%2C%E2%80%AFReason%2C%E2%80%AFAvailabilityState%2C%E2%80%AFTimestamp%2C%E2%80%AFLocation" target="_blank">portal.Azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%E2%80%AFwhere%E2%80%AFproperties.category%E2%80%AFcontains%E2%80%AF%27Planned%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFReason%E2%80%AF%3D%E2%80%AFtostring%28properties.reason%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%2C%E2%80%AFTimestamp%E2%80%AF%3D%E2%80%AFtostring%28properties.occuredTime%29%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D%3D%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28tostring%28properties.targetResourceId%29%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%20project%E2%80%AFResourceId%2C%E2%80%AFReason%2C%E2%80%AFAvailabilityState%2C%E2%80%AFTimestamp%2C%E2%80%AFLocation" target="_blank">portal.Azure.cn</a>

---

### List of resources that have been impacted by unplanned platform disruptions, along with availability, power states and location

Returns a list of virtual machines impacted by planned maintenance or repair operations conducted by the Azure platform, aggregated by their ID property. The query also shows the virtual machines' corresponding availability state, power state, and location details.

```kusto
HealthResources
| where type =~ 'microsoft.resourcehealth/resourceannotations'
| where tostring(properties.context) == 'Platform Initiated' and tostring(properties.category) == 'Planned'
| project ResourceId = tolower(properties.targetResourceId), Location = location
| join (
    HealthResources
    | where type =~ 'microsoft.resourcehealth/availabilitystatuses'
    | project ResourceId = tolower(properties.targetResourceId), AvailabilityState = tostring(properties.availabilityState), Location = location) on ResourceId
| join (
    Resources
    | where type =~ 'microsoft.compute/virtualmachines'
    | project ResourceId = tolower(id), PowerState = properties.extended.instanceView.powerState.code, Location = location) on ResourceId
| project ResourceId, AvailabilityState, PowerState, Location
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "HealthResources | where type =~ 'microsoft.resourcehealth/resourceannotations' | where tostring(properties.context) == 'Platform Initiated' and tostring(properties.category) == 'Planned' | project ResourceId = tolower(properties.targetResourceId), Location = location | join (HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | project ResourceId = tolower(properties.targetResourceId), AvailabilityState = tostring(properties.availabilityState), Location = location) on ResourceId | join (Resources | where type =~ 'microsoft.compute/virtualmachines' | project ResourceId = tolower(id), PowerState = properties.extended.instanceView.powerState.code, Location = location) on ResourceId | project ResourceId, AvailabilityState, PowerState, Location"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResources | where type =~ 'microsoft.resourcehealth/resourceannotations' | where tostring(properties.context) == 'Platform Initiated' and tostring(properties.category) == 'Planned' | project ResourceId = tolower(properties.targetResourceId), Location = location | join (HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | project ResourceId = tolower(properties.targetResourceId), AvailabilityState = tostring(properties.availabilityState), Location = location) on ResourceId | join (Resources | where type =~ 'microsoft.compute/virtualmachines' | project ResourceId = tolower(id), PowerState = properties.extended.instanceView.powerState.code, Location = location) on ResourceId | project ResourceId, AvailabilityState, PowerState, Location"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D~%E2%80%AF%27microsoft.resourcehealth%2Fresourceannotations%27%20%7C%E2%80%AFwhere%E2%80%AFtostring%28properties.context%29%E2%80%AF%3D%3D%E2%80%AF%27Platform%E2%80%AFInitiated%27%E2%80%AFand%E2%80%AFtostring%28properties.category%29%E2%80%AF%3D%3D%E2%80%AF%27Planned%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28properties.targetResourceId%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D~%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28properties.targetResourceId%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFjoin%E2%80%AF%28Resources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D~%E2%80%AF%27microsoft.compute%2Fvirtualmachines%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28id%29%2C%E2%80%AFPowerState%E2%80%AF%3D%E2%80%AFproperties.extended.instanceView.powerState.code%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%20project%E2%80%AFResourceId%2C%E2%80%AFAvailabilityState%2C%E2%80%AFPowerState%2C%E2%80%AFLocation" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D~%E2%80%AF%27microsoft.resourcehealth%2Fresourceannotations%27%20%7C%E2%80%AFwhere%E2%80%AFtostring%28properties.context%29%E2%80%AF%3D%3D%E2%80%AF%27Platform%E2%80%AFInitiated%27%E2%80%AFand%E2%80%AFtostring%28properties.category%29%E2%80%AF%3D%3D%E2%80%AF%27Planned%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28properties.targetResourceId%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D~%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28properties.targetResourceId%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFjoin%E2%80%AF%28Resources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D~%E2%80%AF%27microsoft.compute%2Fvirtualmachines%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28id%29%2C%E2%80%AFPowerState%E2%80%AF%3D%E2%80%AFproperties.extended.instanceView.powerState.code%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%20project%E2%80%AFResourceId%2C%E2%80%AFAvailabilityState%2C%E2%80%AFPowerState%2C%E2%80%AFLocation" target="_blank">portal.Azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%20%7C%E2%80%AFwhere%E2%80%AFtype%E2%80%AF%3D~%E2%80%AF%27microsoft.resourcehealth%2Fresourceannotations%27%20%7C%E2%80%AFwhere%E2%80%AFtostring%28properties.context%29%E2%80%AF%3D%3D%E2%80%AF%27Platform%E2%80%AFInitiated%27%E2%80%AFand%E2%80%AFtostring%28properties.category%29%E2%80%AF%3D%3D%E2%80%AF%27Planned%27%20%7C%E2%80%AFproject%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28properties.targetResourceId%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%20%7C%E2%80%AFjoin%E2%80%AF%28HealthResources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D~%E2%80%AF%27microsoft.resourcehealth%2Favailabilitystatuses%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28properties.targetResourceId%29%2C%E2%80%AFAvailabilityState%E2%80%AF%3D%E2%80%AFtostring%28properties.availabilityState%29%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%E2%80%AFjoin%E2%80%AF%28Resources%20%7C%20where%E2%80%AFtype%E2%80%AF%3D~%E2%80%AF%27microsoft.compute%2Fvirtualmachines%27%20%7C%20project%E2%80%AFResourceId%E2%80%AF%3D%E2%80%AFtolower%28id%29%2C%E2%80%AFPowerState%E2%80%AF%3D%E2%80%AFproperties.extended.instanceView.powerState.code%2C%E2%80%AFLocation%E2%80%AF%3D%E2%80%AFlocation%29%E2%80%AFon%E2%80%AFResourceId%20%7C%20project%E2%80%AFResourceId%2C%E2%80%AFAvailabilityState%2C%E2%80%AFPowerState%2C%E2%80%AFLocation" target="_blank">portal.Azure.cn</a>

---

