---
ms.service: resource-graph
ms.topic: include
ms.date: 01/22/2024
author: davidsmatlak
ms.author: davidsmatlak
---

### Current health of virtual machines in Virtual Instance for SAP

This query fetches the current availability health of all virtual machines of an SAP system given the SID of a [Virtual Instance for SAP](../../../../sap/center-sap-solutions/overview.md). Replace `mySubscriptionId` with your subscription ID, and replace `myResourceId` with the resource ID of your Virtual Instance for SAP.

```kusto
Resources
| where subscriptionId == 'mySubscriptionId'
| where type startswith 'microsoft.workloads/sapvirtualinstances/'
| where id startswith 'myResourceId'
| mv-expand d = properties.vmDetails
| project VmId = tolower(d.virtualMachineId)
| join kind = inner (
  HealthResources
  | where subscriptionId == 'mySubscriptionId'
  | where type == 'microsoft.resourcehealth/availabilitystatuses'
  | where properties contains 'Microsoft.Compute/virtualMachines'
  | extend VmId = tolower(tostring(properties['targetResourceId']))
  | extend AvailabilityState = tostring(properties['availabilityState']))
on $left.VmId == $right.VmId
| project VmId, todatetime(properties['occurredTime']), AvailabilityState
| project-rename ['Virtual Machine ID'] = VmId, UTCTimeStamp = properties_occurredTime, ['Availability State'] = AvailabilityState
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where subscriptionId == 'mySubscriptionId' | where type startswith 'microsoft.workloads/sapvirtualinstances/' | where id startswith 'myResourceId' | mv-expand d = properties.vmDetails | project VmId = tolower(d.virtualMachineId) | join kind = inner (HealthResources | where subscriptionId == 'mySubscriptionId' | where type == 'microsoft.resourcehealth/availabilitystatuses' | where properties contains 'Microsoft.Compute/virtualMachines' | extend VmId = tolower(tostring(properties['targetResourceId'])) | extend AvailabilityState = tostring(properties['availabilityState'])) on \$left.VmId == \$right.VmId | project VmId, todatetime(properties['occurredTime']), AvailabilityState | project-rename ['Virtual Machine ID'] = VmId, UTCTimeStamp = properties_occurredTime, ['Availability State'] = AvailabilityState"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where subscriptionId == 'mySubscriptionId' | where type startswith 'microsoft.workloads/sapvirtualinstances/' | where id startswith 'myResourceId' | mv-expand d = properties.vmDetails | project VmId = tolower(d.virtualMachineId) | join kind = inner (HealthResources | where subscriptionId == 'mySubscriptionId' | where type == 'microsoft.resourcehealth/availabilitystatuses' | where properties contains 'Microsoft.Compute/virtualMachines' | extend VmId = tolower(tostring(properties['targetResourceId'])) | extend AvailabilityState = tostring(properties['availabilityState'])) on `$left.VmId == `$right.VmId | project VmId, todatetime(properties['occurredTime']), AvailabilityState | project-rename ['Virtual Machine ID'] = VmId, UTCTimeStamp = properties_occurredTime, ['Availability State'] = AvailabilityState"
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%7C%20where%20type%20startswith%20%27microsoft.workloads%2Fsapvirtualinstances%2F%27%0D%0A%7C%20where%20id%20startswith%20%27myResourceId%27%0D%0A%7C%20mv-expand%20d%20%3D%20properties.vmDetails%0D%0A%7C%20project%20VmId%20%3D%20tolower%28d.virtualMachineId%29%0D%0A%7C%20join%20kind%20%3D%20inner%20%28%0D%0A%20%20HealthResources%0D%0A%20%20%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%20%20%7C%20where%20type%20%3D%3D%20%27microsoft.resourcehealth%2Favailabilitystatuses%27%0D%0A%20%20%7C%20where%20properties%20contains%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%20%20%7C%20extend%20VmId%20%3D%20tolower%28tostring%28properties%5B%27targetResourceId%27%5D%29%29%0D%0A%20%20%7C%20extend%20AvailabilityState%20%3D%20tostring%28properties%5B%27availabilityState%27%5D%29%29%0D%0Aon%20%24left.VmId%20%3D%3D%20%24right.VmId%0D%0A%7C%20project%20VmId%2C%20todatetime%28properties%5B%27occurredTime%27%5D%29%2C%20AvailabilityState%0D%0A%7C%20project-rename%20%5B%27Virtual%20Machine%20ID%27%5D%20%3D%20VmId%2C%20UTCTimeStamp%20%3D%20properties_occurredTime%2C%20%5B%27Availability%20State%27%5D%20%3D%20AvailabilityState" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%7C%20where%20type%20startswith%20%27microsoft.workloads%2Fsapvirtualinstances%2F%27%0D%0A%7C%20where%20id%20startswith%20%27myResourceId%27%0D%0A%7C%20mv-expand%20d%20%3D%20properties.vmDetails%0D%0A%7C%20project%20VmId%20%3D%20tolower%28d.virtualMachineId%29%0D%0A%7C%20join%20kind%20%3D%20inner%20%28%0D%0A%20%20HealthResources%0D%0A%20%20%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%20%20%7C%20where%20type%20%3D%3D%20%27microsoft.resourcehealth%2Favailabilitystatuses%27%0D%0A%20%20%7C%20where%20properties%20contains%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%20%20%7C%20extend%20VmId%20%3D%20tolower%28tostring%28properties%5B%27targetResourceId%27%5D%29%29%0D%0A%20%20%7C%20extend%20AvailabilityState%20%3D%20tostring%28properties%5B%27availabilityState%27%5D%29%29%0D%0Aon%20%24left.VmId%20%3D%3D%20%24right.VmId%0D%0A%7C%20project%20VmId%2C%20todatetime%28properties%5B%27occurredTime%27%5D%29%2C%20AvailabilityState%0D%0A%7C%20project-rename%20%5B%27Virtual%20Machine%20ID%27%5D%20%3D%20VmId%2C%20UTCTimeStamp%20%3D%20properties_occurredTime%2C%20%5B%27Availability%20State%27%5D%20%3D%20AvailabilityState" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%7C%20where%20type%20startswith%20%27microsoft.workloads%2Fsapvirtualinstances%2F%27%0D%0A%7C%20where%20id%20startswith%20%27myResourceId%27%0D%0A%7C%20mv-expand%20d%20%3D%20properties.vmDetails%0D%0A%7C%20project%20VmId%20%3D%20tolower%28d.virtualMachineId%29%0D%0A%7C%20join%20kind%20%3D%20inner%20%28%0D%0A%20%20HealthResources%0D%0A%20%20%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%20%20%7C%20where%20type%20%3D%3D%20%27microsoft.resourcehealth%2Favailabilitystatuses%27%0D%0A%20%20%7C%20where%20properties%20contains%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%20%20%7C%20extend%20VmId%20%3D%20tolower%28tostring%28properties%5B%27targetResourceId%27%5D%29%29%0D%0A%20%20%7C%20extend%20AvailabilityState%20%3D%20tostring%28properties%5B%27availabilityState%27%5D%29%29%0D%0Aon%20%24left.VmId%20%3D%3D%20%24right.VmId%0D%0A%7C%20project%20VmId%2C%20todatetime%28properties%5B%27occurredTime%27%5D%29%2C%20AvailabilityState%0D%0A%7C%20project-rename%20%5B%27Virtual%20Machine%20ID%27%5D%20%3D%20VmId%2C%20UTCTimeStamp%20%3D%20properties_occurredTime%2C%20%5B%27Availability%20State%27%5D%20%3D%20AvailabilityState" target="_blank">portal.azure.cn</a>

---

### Currently unhealthy virtual machines and annotations in Virtual Instance for SAP

This query fetches list of virtual machines of an SAP system that are unhealthy and corresponding annotations given the SID of a [Virtual Instance for SAP](../../../../sap/center-sap-solutions/overview.md). Replace `mySubscriptionId` with your subscription ID, and replace `myResourceId` with the resource ID of your Virtual Instance for SAP.

```kusto
HealthResources
| where subscriptionId == 'mySubscriptionId'
| where type == 'microsoft.resourcehealth/availabilitystatuses'
| where properties contains 'Microsoft.Compute/virtualMachines'
| extend VmId = tolower(tostring(properties['targetResourceId']))
| extend AvailabilityState = tostring(properties['availabilityState'])
| where AvailabilityState != 'Available'
| project VmId, todatetime(properties['occurredTime']), AvailabilityState
| join kind = inner (
  HealthResources
  | where subscriptionId == 'mySubscriptionId'
  | where type == 'microsoft.resourcehealth/resourceannotations'
  | where properties contains 'Microsoft.Compute/virtualMachines'
  | extend VmId = tolower(tostring(properties['targetResourceId']))) on $left.VmId == $right.VmId
  | join kind = inner (Resources
  | where subscriptionId == 'mySubscriptionId'
  | where type startswith 'microsoft.workloads/sapvirtualinstances/'
  | where id startswith 'myResourceId'
  | mv-expand d = properties.vmDetails
  | project VmId = tolower(d.virtualMachineId))
on $left.VmId1 == $right.VmId
| extend AnnotationName = tostring(properties['annotationName']), ImpactType = tostring(properties['impactType']), Context = tostring(properties['context']), Summary = tostring(properties['summary']), Reason = tostring(properties['reason']), OccurredTime = todatetime(properties['occurredTime'])
| project VmId, OccurredTime, AvailabilityState, AnnotationName, ImpactType, Context, Summary, Reason
| project-rename ['Virtual Machine ID'] = VmId, ['Time Since Not Available'] = OccurredTime, ['Availability State'] = AvailabilityState, ['Annotation Name'] = AnnotationName, ['Impact Type'] = ImpactType
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "HealthResources | where subscriptionId == 'mySubscriptionId' | where type == 'microsoft.resourcehealth/availabilitystatuses' | where properties contains 'Microsoft.Compute/virtualMachines' | extend VmId = tolower(tostring(properties['targetResourceId'])) | extend AvailabilityState = tostring(properties['availabilityState']) | where AvailabilityState != 'Available' | project VmId, todatetime(properties['occurredTime']), AvailabilityState | join kind = inner (HealthResources | where subscriptionId == 'mySubscriptionId' | where type == 'microsoft.resourcehealth/resourceannotations' | where properties contains 'Microsoft.Compute/virtualMachines' | extend VmId = tolower(tostring(properties['targetResourceId']))) on \$left.VmId == \$right.VmId   | join kind = inner (Resources | where subscriptionId == 'mySubscriptionId' | where type startswith 'microsoft.workloads/sapvirtualinstances/' | where id startswith 'myResourceId' | mv-expand d = properties.vmDetails | project VmId = tolower(d.virtualMachineId)) on \$left.VmId1 == \$right.VmId | extend AnnotationName = tostring(properties['annotationName']), ImpactType = tostring(properties['impactType']), Context = tostring(properties['context']), Summary = tostring(properties['summary']), Reason = tostring(properties['reason']), OccurredTime = todatetime(properties['occurredTime']) | project VmId, OccurredTime, AvailabilityState, AnnotationName, ImpactType, Context, Summary, Reason | project-rename ['Virtual Machine ID'] = VmId, ['Time Since Not Available'] = OccurredTime, ['Availability State'] = AvailabilityState, ['Annotation Name'] = AnnotationName, ['Impact Type'] = ImpactType"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResources | where subscriptionId == 'mySubscriptionId' | where type == 'microsoft.resourcehealth/availabilitystatuses' | where properties contains 'Microsoft.Compute/virtualMachines' | extend VmId = tolower(tostring(properties['targetResourceId'])) | extend AvailabilityState = tostring(properties['availabilityState']) | where AvailabilityState != 'Available' | project VmId, todatetime(properties['occurredTime']), AvailabilityState | join kind = inner (HealthResources | where subscriptionId == 'mySubscriptionId' | where type == 'microsoft.resourcehealth/resourceannotations' | where properties contains 'Microsoft.Compute/virtualMachines' | extend VmId = tolower(tostring(properties['targetResourceId']))) on `$left.VmId == `$right.VmId   | join kind = inner (Resources | where subscriptionId == 'mySubscriptionId' | where type startswith 'microsoft.workloads/sapvirtualinstances/' | where id startswith 'myResourceId' | mv-expand d = properties.vmDetails | project VmId = tolower(d.virtualMachineId)) on `$left.VmId1 == `$right.VmId | extend AnnotationName = tostring(properties['annotationName']), ImpactType = tostring(properties['impactType']), Context = tostring(properties['context']), Summary = tostring(properties['summary']), Reason = tostring(properties['reason']), OccurredTime = todatetime(properties['occurredTime']) | project VmId, OccurredTime, AvailabilityState, AnnotationName, ImpactType, Context, Summary, Reason | project-rename ['Virtual Machine ID'] = VmId, ['Time Since Not Available'] = OccurredTime, ['Availability State'] = AvailabilityState, ['Annotation Name'] = AnnotationName, ['Impact Type'] = ImpactType"
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0D%0A%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.resourcehealth%2Favailabilitystatuses%27%0D%0A%7C%20where%20properties%20contains%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20extend%20VmId%20%3D%20tolower%28tostring%28properties%5B%27targetResourceId%27%5D%29%29%0D%0A%7C%20extend%20AvailabilityState%20%3D%20tostring%28properties%5B%27availabilityState%27%5D%29%0D%0A%7C%20where%20AvailabilityState%20%21%3D%20%27Available%27%0D%0A%7C%20project%20VmId%2C%20todatetime%28properties%5B%27occurredTime%27%5D%29%2C%20AvailabilityState%0D%0A%7C%20join%20kind%20%3D%20inner%20%28%0D%0A%20%20HealthResources%0D%0A%20%20%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%20%20%7C%20where%20type%20%3D%3D%20%27microsoft.resourcehealth%2Fresourceannotations%27%0D%0A%20%20%7C%20where%20properties%20contains%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%20%20%7C%20extend%20VmId%20%3D%20tolower%28tostring%28properties%5B%27targetResourceId%27%5D%29%29%29%20on%20%24left.VmId%20%3D%3D%20%24right.VmId%0D%0A%20%20%7C%20join%20kind%20%3D%20inner%20%28Resources%0D%0A%20%20%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%20%20%7C%20where%20type%20startswith%20%27microsoft.workloads%2Fsapvirtualinstances%2F%27%0D%0A%20%20%7C%20where%20id%20startswith%20%27myResourceId%27%0D%0A%20%20%7C%20mv-expand%20d%20%3D%20properties.vmDetails%0D%0A%20%20%7C%20project%20VmId%20%3D%20tolower%28d.virtualMachineId%29%29%0D%0Aon%20%24left.VmId1%20%3D%3D%20%24right.VmId%0D%0A%7C%20extend%20AnnotationName%20%3D%20tostring%28properties%5B%27annotationName%27%5D%29%2C%20ImpactType%20%3D%20tostring%28properties%5B%27impactType%27%5D%29%2C%20Context%20%3D%20tostring%28properties%5B%27context%27%5D%29%2C%20Summary%20%3D%20tostring%28properties%5B%27summary%27%5D%29%2C%20Reason%20%3D%20tostring%28properties%5B%27reason%27%5D%29%2C%20OccurredTime%20%3D%20todatetime%28properties%5B%27occurredTime%27%5D%29%0D%0A%7C%20project%20VmId%2C%20OccurredTime%2C%20AvailabilityState%2C%20AnnotationName%2C%20ImpactType%2C%20Context%2C%20Summary%2C%20Reason%0D%0A%7C%20project-rename%20%5B%27Virtual%20Machine%20ID%27%5D%20%3D%20VmId%2C%20%5B%27Time%20Since%20Not%20Available%27%5D%20%3D%20OccurredTime%2C%20%5B%27Availability%20State%27%5D%20%3D%20AvailabilityState%2C%20%5B%27Annotation%20Name%27%5D%20%3D%20AnnotationName%2C%20%5B%27Impact%20Type%27%5D%20%3D%20ImpactType" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0D%0A%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.resourcehealth%2Favailabilitystatuses%27%0D%0A%7C%20where%20properties%20contains%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20extend%20VmId%20%3D%20tolower%28tostring%28properties%5B%27targetResourceId%27%5D%29%29%0D%0A%7C%20extend%20AvailabilityState%20%3D%20tostring%28properties%5B%27availabilityState%27%5D%29%0D%0A%7C%20where%20AvailabilityState%20%21%3D%20%27Available%27%0D%0A%7C%20project%20VmId%2C%20todatetime%28properties%5B%27occurredTime%27%5D%29%2C%20AvailabilityState%0D%0A%7C%20join%20kind%20%3D%20inner%20%28%0D%0A%20%20HealthResources%0D%0A%20%20%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%20%20%7C%20where%20type%20%3D%3D%20%27microsoft.resourcehealth%2Fresourceannotations%27%0D%0A%20%20%7C%20where%20properties%20contains%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%20%20%7C%20extend%20VmId%20%3D%20tolower%28tostring%28properties%5B%27targetResourceId%27%5D%29%29%29%20on%20%24left.VmId%20%3D%3D%20%24right.VmId%0D%0A%20%20%7C%20join%20kind%20%3D%20inner%20%28Resources%0D%0A%20%20%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%20%20%7C%20where%20type%20startswith%20%27microsoft.workloads%2Fsapvirtualinstances%2F%27%0D%0A%20%20%7C%20where%20id%20startswith%20%27myResourceId%27%0D%0A%20%20%7C%20mv-expand%20d%20%3D%20properties.vmDetails%0D%0A%20%20%7C%20project%20VmId%20%3D%20tolower%28d.virtualMachineId%29%29%0D%0Aon%20%24left.VmId1%20%3D%3D%20%24right.VmId%0D%0A%7C%20extend%20AnnotationName%20%3D%20tostring%28properties%5B%27annotationName%27%5D%29%2C%20ImpactType%20%3D%20tostring%28properties%5B%27impactType%27%5D%29%2C%20Context%20%3D%20tostring%28properties%5B%27context%27%5D%29%2C%20Summary%20%3D%20tostring%28properties%5B%27summary%27%5D%29%2C%20Reason%20%3D%20tostring%28properties%5B%27reason%27%5D%29%2C%20OccurredTime%20%3D%20todatetime%28properties%5B%27occurredTime%27%5D%29%0D%0A%7C%20project%20VmId%2C%20OccurredTime%2C%20AvailabilityState%2C%20AnnotationName%2C%20ImpactType%2C%20Context%2C%20Summary%2C%20Reason%0D%0A%7C%20project-rename%20%5B%27Virtual%20Machine%20ID%27%5D%20%3D%20VmId%2C%20%5B%27Time%20Since%20Not%20Available%27%5D%20%3D%20OccurredTime%2C%20%5B%27Availability%20State%27%5D%20%3D%20AvailabilityState%2C%20%5B%27Annotation%20Name%27%5D%20%3D%20AnnotationName%2C%20%5B%27Impact%20Type%27%5D%20%3D%20ImpactType" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResources%0D%0A%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.resourcehealth%2Favailabilitystatuses%27%0D%0A%7C%20where%20properties%20contains%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20extend%20VmId%20%3D%20tolower%28tostring%28properties%5B%27targetResourceId%27%5D%29%29%0D%0A%7C%20extend%20AvailabilityState%20%3D%20tostring%28properties%5B%27availabilityState%27%5D%29%0D%0A%7C%20where%20AvailabilityState%20%21%3D%20%27Available%27%0D%0A%7C%20project%20VmId%2C%20todatetime%28properties%5B%27occurredTime%27%5D%29%2C%20AvailabilityState%0D%0A%7C%20join%20kind%20%3D%20inner%20%28%0D%0A%20%20HealthResources%0D%0A%20%20%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%20%20%7C%20where%20type%20%3D%3D%20%27microsoft.resourcehealth%2Fresourceannotations%27%0D%0A%20%20%7C%20where%20properties%20contains%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%20%20%7C%20extend%20VmId%20%3D%20tolower%28tostring%28properties%5B%27targetResourceId%27%5D%29%29%29%20on%20%24left.VmId%20%3D%3D%20%24right.VmId%0D%0A%20%20%7C%20join%20kind%20%3D%20inner%20%28Resources%0D%0A%20%20%7C%20where%20subscriptionId%20%3D%3D%20%27mySubscriptionId%27%0D%0A%20%20%7C%20where%20type%20startswith%20%27microsoft.workloads%2Fsapvirtualinstances%2F%27%0D%0A%20%20%7C%20where%20id%20startswith%20%27myResourceId%27%0D%0A%20%20%7C%20mv-expand%20d%20%3D%20properties.vmDetails%0D%0A%20%20%7C%20project%20VmId%20%3D%20tolower%28d.virtualMachineId%29%29%0D%0Aon%20%24left.VmId1%20%3D%3D%20%24right.VmId%0D%0A%7C%20extend%20AnnotationName%20%3D%20tostring%28properties%5B%27annotationName%27%5D%29%2C%20ImpactType%20%3D%20tostring%28properties%5B%27impactType%27%5D%29%2C%20Context%20%3D%20tostring%28properties%5B%27context%27%5D%29%2C%20Summary%20%3D%20tostring%28properties%5B%27summary%27%5D%29%2C%20Reason%20%3D%20tostring%28properties%5B%27reason%27%5D%29%2C%20OccurredTime%20%3D%20todatetime%28properties%5B%27occurredTime%27%5D%29%0D%0A%7C%20project%20VmId%2C%20OccurredTime%2C%20AvailabilityState%2C%20AnnotationName%2C%20ImpactType%2C%20Context%2C%20Summary%2C%20Reason%0D%0A%7C%20project-rename%20%5B%27Virtual%20Machine%20ID%27%5D%20%3D%20VmId%2C%20%5B%27Time%20Since%20Not%20Available%27%5D%20%3D%20OccurredTime%2C%20%5B%27Availability%20State%27%5D%20%3D%20AvailabilityState%2C%20%5B%27Annotation%20Name%27%5D%20%3D%20AnnotationName%2C%20%5B%27Impact%20Type%27%5D%20%3D%20ImpactType" target="_blank">portal.azure.cn</a>

---
