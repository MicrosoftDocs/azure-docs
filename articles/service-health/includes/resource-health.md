---
ms.service: azure-service-health
ms.topic: include
ms.date: 07/07/2022
author: rboucher
ms.author: robb
---

### Count of virtual machines by availability state and subscription ID

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



- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20count()%20by%20subscriptionId%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20count()%20by%20subscriptionId%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20count()%20by%20subscriptionId%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.cn</a>

---

### List of virtual machines and associated availability states by resource IDs

Returns the latest list of virtual machines (type `Microsoft.Compute/virtualMachines`) aggregated by availability state. The query also provides the associated Resource ID based on `properties.targetResourceId`, for easy debugging and mitigation. Availability states can be one of four values: Available, Unavailable, Degraded, and Unknown. For more details on what each of the availability states mean, go to [Azure Resource Health overview](../resource-health-overview.md#health-status).

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



- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.cn</a>

---

### List of virtual machines by availability state and power state with resource IDs and resource groups

Returns list of virtual machines (type `Microsoft.Compute/virtualMachines`) aggregated on their power state and availability state to provide a cohesive state of health for your virtual machines. The query also provides details on the resource group and resource ID associated with each entry for detailed visibility into your resources.

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



- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20project%20resourceGroup%2c%20Id%20%3d%20tolower(id)%2c%20PowerState%20%3d%20tostring(%20properties.extended.instanceView.powerState.code)%0a%7c%20join%20kind%3dleftouter%20(%0a%09HealthResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%09%7c%20where%20tostring(properties.targetResourceType)%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%09%7c%20project%20targetResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState))%0a%09on%20%24left.Id%20%3d%3d%20%24right.targetResourceId%0a%7c%20project-away%20targetResourceId%0a%7c%20where%20PowerState%20!%3d%20%27PowerState%2fdeallocated%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20project%20resourceGroup%2c%20Id%20%3d%20tolower(id)%2c%20PowerState%20%3d%20tostring(%20properties.extended.instanceView.powerState.code)%0a%7c%20join%20kind%3dleftouter%20(%0a%09HealthResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%09%7c%20where%20tostring(properties.targetResourceType)%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%09%7c%20project%20targetResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState))%0a%09on%20%24left.Id%20%3d%3d%20%24right.targetResourceId%0a%7c%20project-away%20targetResourceId%0a%7c%20where%20PowerState%20!%3d%20%27PowerState%2fdeallocated%27" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20project%20resourceGroup%2c%20Id%20%3d%20tolower(id)%2c%20PowerState%20%3d%20tostring(%20properties.extended.instanceView.powerState.code)%0a%7c%20join%20kind%3dleftouter%20(%0a%09HealthResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%09%7c%20where%20tostring(properties.targetResourceType)%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%09%7c%20project%20targetResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState))%0a%09on%20%24left.Id%20%3d%3d%20%24right.targetResourceId%0a%7c%20project-away%20targetResourceId%0a%7c%20where%20PowerState%20!%3d%20%27PowerState%2fdeallocated%27" target="_blank">portal.azure.cn</a>

---

### List of virtual machines that aren't available by resource IDs

Returns the latest list of virtual machines (type `Microsoft.Compute/virtualMachines`) aggregated by their availability state. The populated list only highlights virtual machines whose availability state isn't _Available_ to ensure you're aware of all the concerning states your virtual machines are in. When all your virtual machines are Available, you can expect to receive no results.

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



- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20where%20tostring(properties.availabilityState)%20!%3d%20%27Available%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20where%20tostring(properties.availabilityState)%20!%3d%20%27Available%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%7c%20where%20tostring(properties.availabilityState)%20!%3d%20%27Available%27%0a%7c%20summarize%20by%20ResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState)" target="_blank">portal.azure.cn</a>

---
