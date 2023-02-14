---
author: timwarner-msft
ms.service: resource-graph
ms.topic: include
ms.date: 02/14/2023
ms.author: timwarner
ms.custom: generated
---

### Azure VMs impacted by Azure-initiated maintenance

Returns a list of virtual machines (VMs) impacted by routine Azure-initiated maintenance operations in the past 14 days, along with the corresponding reason for impact.

```kusto
HealthResourceChanges
| where properties.targetResourceType =~ 'microsoft.resourcehealth/resourceannotations'
| where properties['changes']['properties.category']['newValue'] =~ 'Planned'
| project Id = tostring(split(tolower(properties.targetResourceId), '/providers/microsoft.resourcehealth/resourceannotations')[0]), Reason = properties['changes']['properties.reason']['newValue']
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q ""
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query ""
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ " target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ " target="_blank">portal.Azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ " target="_blank">portal.Azure.cn</a>

---

### Changes to health annotations over past 14 days

Returns a list of all changes to health annotations in the past 14 days. Nulls indicate there was no update to that specific field, corresponding to a change in the `Annotation Name` field)

```kusto
healthresourcechanges
| where type == "microsoft.resources/changes"
| where properties.targetResourceType =~ "microsoft.resourcehealth/resourceannotations"
| extend Id = tolower(split(properties.targetResourceId, '/providers/Microsoft.ResourceHealth/resourceAnnotations/current')[0]),
Timestamp = todatetime(properties.changeAttributes.timestamp), AnnotationName = properties['changes']['properties.annotationName']['newValue'], Reason = properties['changes']['properties.reason']['newValue'],
Context = properties['changes']['properties.context']['newValue'], Category = properties['changes']['properties.category']['newValue']
| where isnotempty(AnnotationName)
| project Timestamp, Id, PreviousAnnotation = properties['changes']['properties.annotationName']['previousValue'], AnnotationName, Reason, Context, Category
| order by Timestamp desc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q ""
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query ""
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ " target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ " target="_blank">portal.Azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ " target="_blank">portal.Azure.cn</a>

---

### VM availability state changes over past 14 days

Returns a list of all changes to VM availability states in the past 14 days.

```kusto
healthresourcechanges
| where type == "microsoft.resources/changes"
| where properties.targetResourceType =~ "microsoft.resourcehealth/availabilityStatuses"
| extend Id = tolower(split(properties.targetResourceId, '/providers/Microsoft.ResourceHealth/availabilityStatuses/current')[0]),
Timestamp = todatetime(properties.changeAttributes.timestamp), PreviousAvailabilityState = properties['changes']['properties.availabilityState']['previousValue'],
LatestAvailabilityState = properties['changes']['properties.availabilityState']['newValue']
| where isnotempty(LatestAvailabilityState)
| project Timestamp, Id, PreviousAvailabilityState, LatestAvailabilityState
| order by Timestamp desc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q ""
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query ""
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ " target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ " target="_blank">portal.Azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ " target="_blank">portal.Azure.cn</a>

---

