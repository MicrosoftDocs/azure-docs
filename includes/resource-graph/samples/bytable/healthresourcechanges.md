---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 02/14/2023
ms.author: davidsmatlak
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
az graph query -q "HealthResourceChanges | where properties.targetResourceType =~ 'microsoft.resourcehealth/resourceannotations' | where properties['changes']['properties.category']['newValue'] =~ 'Planned' | project Id = tostring(split(tolower(properties.targetResourceId), '/providers/microsoft.resourcehealth/resourceannotations')[0]), Reason = properties['changes']['properties.reason']['newValue']"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "HealthResourceChanges | where properties.targetResourceType =~ 'microsoft.resourcehealth/resourceannotations' | where properties['changes']['properties.category']['newValue'] =~ 'Planned' | project Id = tostring(split(tolower(properties.targetResourceId), '/providers/microsoft.resourcehealth/resourceannotations')[0]), Reason = properties['changes']['properties.reason']['newValue']"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResourceChanges%20%7C%20where%20properties.targetResourceType%20%3D~%20%27microsoft.resourcehealth%2Fresourceannotations%27%20%7C%20where%20properties%5B%27changes%27%5D%5B%27properties.category%27%5D%5B%27newValue%27%5D%20%3D~%20%27Planned%27%20%7C%20project%20Id%20%3D%20tostring%28split%28tolower%28properties.targetResourceId%29%2C%20%27%2Fproviders%2Fmicrosoft.resourcehealth%2Fresourceannotations%27%29%5B0%5D%29%2C%20Reason%20%3D%20properties%5B%27changes%27%5D%5B%27properties.reason%27%5D%5B%27newValue%27%5D" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResourceChanges%20%7C%20where%20properties.targetResourceType%20%3D~%20%27microsoft.resourcehealth%2Fresourceannotations%27%20%7C%20where%20properties%5B%27changes%27%5D%5B%27properties.category%27%5D%5B%27newValue%27%5D%20%3D~%20%27Planned%27%20%7C%20project%20Id%20%3D%20tostring%28split%28tolower%28properties.targetResourceId%29%2C%20%27%2Fproviders%2Fmicrosoft.resourcehealth%2Fresourceannotations%27%29%5B0%5D%29%2C%20Reason%20%3D%20properties%5B%27changes%27%5D%5B%27properties.reason%27%5D%5B%27newValue%27%5D" target="_blank">portal.Azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/HealthResourceChanges%20%7C%20where%20properties.targetResourceType%20%3D~%20%27microsoft.resourcehealth%2Fresourceannotations%27%20%7C%20where%20properties%5B%27changes%27%5D%5B%27properties.category%27%5D%5B%27newValue%27%5D%20%3D~%20%27Planned%27%20%7C%20project%20Id%20%3D%20tostring%28split%28tolower%28properties.targetResourceId%29%2C%20%27%2Fproviders%2Fmicrosoft.resourcehealth%2Fresourceannotations%27%29%5B0%5D%29%2C%20Reason%20%3D%20properties%5B%27changes%27%5D%5B%27properties.reason%27%5D%5B%27newValue%27%5D" target="_blank">portal.Azure.cn</a>

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
az graph query -q "healthresourcechanges | where type == "microsoft.resources/changes" | where properties.targetResourceType =~ "microsoft.resourcehealth/resourceannotations" | extend Id = tolower(split(properties.targetResourceId, '/providers/Microsoft.ResourceHealth/resourceAnnotations/current')[0]), Timestamp = todatetime(properties.changeAttributes.timestamp), AnnotationName = properties['changes']['properties.annotationName']['newValue'], Reason = properties['changes']['properties.reason']['newValue'], Context = properties['changes']['properties.context']['newValue'], Category = properties['changes']['properties.category']['newValue'] | where isnotempty(AnnotationName) | project Timestamp, Id, PreviousAnnotation = properties['changes']['properties.annotationName']['previousValue'], AnnotationName, Reason, Context, Category | order by Timestamp desc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "healthresourcechanges | where type == "microsoft.resources/changes" | where properties.targetResourceType =~ "microsoft.resourcehealth/resourceannotations" | extend Id = tolower(split(properties.targetResourceId, '/providers/Microsoft.ResourceHealth/resourceAnnotations/current')[0]), Timestamp = todatetime(properties.changeAttributes.timestamp), AnnotationName = properties['changes']['properties.annotationName']['newValue'], Reason = properties['changes']['properties.reason']['newValue'], Context = properties['changes']['properties.context']['newValue'], Category = properties['changes']['properties.category']['newValue'] | where isnotempty(AnnotationName) | project Timestamp, Id, PreviousAnnotation = properties['changes']['properties.annotationName']['previousValue'], AnnotationName, Reason, Context, Category | order by Timestamp desc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/healthresourcechanges%20%7C%20where%20type%20%3D%3D%20%22microsoft.resources%2Fchanges%22%20%7C%20where%20properties.targetResourceType%20%3D~%20%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%20extend%20Id%20%3D%20tolower%28split%28properties.targetResourceId%2C%20%27%2Fproviders%2FMicrosoft.ResourceHealth%2FresourceAnnotations%2Fcurrent%27%29%5B0%5D%29%2C%20Timestamp%20%3D%20todatetime%28properties.changeAttributes.timestamp%29%2C%20AnnotationName%20%3D%20properties%5B%27changes%27%5D%5B%27properties.annotationName%27%5D%5B%27newValue%27%5D%2C%20Reason%20%3D%20properties%5B%27changes%27%5D%5B%27properties.reason%27%5D%5B%27newValue%27%5D%2C%20Context%20%3D%20properties%5B%27changes%27%5D%5B%27properties.context%27%5D%5B%27newValue%27%5D%2C%20Category%20%3D%20properties%5B%27changes%27%5D%5B%27properties.category%27%5D%5B%27newValue%27%5D%20%7C%20where%20isnotempty%28AnnotationName%29%20%7C%20project%20Timestamp%2C%20Id%2C%20PreviousAnnotation%20%3D%20properties%5B%27changes%27%5D%5B%27properties.annotationName%27%5D%5B%27previousValue%27%5D%2C%20AnnotationName%2C%20Reason%2C%20Context%2C%20Category%20%7C%20order%20by%20Timestamp%20desc" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/healthresourcechanges%20%7C%20where%20type%20%3D%3D%20%22microsoft.resources%2Fchanges%22%20%7C%20where%20properties.targetResourceType%20%3D~%20%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%20extend%20Id%20%3D%20tolower%28split%28properties.targetResourceId%2C%20%27%2Fproviders%2FMicrosoft.ResourceHealth%2FresourceAnnotations%2Fcurrent%27%29%5B0%5D%29%2C%20Timestamp%20%3D%20todatetime%28properties.changeAttributes.timestamp%29%2C%20AnnotationName%20%3D%20properties%5B%27changes%27%5D%5B%27properties.annotationName%27%5D%5B%27newValue%27%5D%2C%20Reason%20%3D%20properties%5B%27changes%27%5D%5B%27properties.reason%27%5D%5B%27newValue%27%5D%2C%20Context%20%3D%20properties%5B%27changes%27%5D%5B%27properties.context%27%5D%5B%27newValue%27%5D%2C%20Category%20%3D%20properties%5B%27changes%27%5D%5B%27properties.category%27%5D%5B%27newValue%27%5D%20%7C%20where%20isnotempty%28AnnotationName%29%20%7C%20project%20Timestamp%2C%20Id%2C%20PreviousAnnotation%20%3D%20properties%5B%27changes%27%5D%5B%27properties.annotationName%27%5D%5B%27previousValue%27%5D%2C%20AnnotationName%2C%20Reason%2C%20Context%2C%20Category%20%7C%20order%20by%20Timestamp%20desc" target="_blank">portal.Azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/healthresourcechanges%20%7C%20where%20type%20%3D%3D%20%22microsoft.resources%2Fchanges%22%20%7C%20where%20properties.targetResourceType%20%3D~%20%22microsoft.resourcehealth%2Fresourceannotations%22%20%7C%20extend%20Id%20%3D%20tolower%28split%28properties.targetResourceId%2C%20%27%2Fproviders%2FMicrosoft.ResourceHealth%2FresourceAnnotations%2Fcurrent%27%29%5B0%5D%29%2C%20Timestamp%20%3D%20todatetime%28properties.changeAttributes.timestamp%29%2C%20AnnotationName%20%3D%20properties%5B%27changes%27%5D%5B%27properties.annotationName%27%5D%5B%27newValue%27%5D%2C%20Reason%20%3D%20properties%5B%27changes%27%5D%5B%27properties.reason%27%5D%5B%27newValue%27%5D%2C%20Context%20%3D%20properties%5B%27changes%27%5D%5B%27properties.context%27%5D%5B%27newValue%27%5D%2C%20Category%20%3D%20properties%5B%27changes%27%5D%5B%27properties.category%27%5D%5B%27newValue%27%5D%20%7C%20where%20isnotempty%28AnnotationName%29%20%7C%20project%20Timestamp%2C%20Id%2C%20PreviousAnnotation%20%3D%20properties%5B%27changes%27%5D%5B%27properties.annotationName%27%5D%5B%27previousValue%27%5D%2C%20AnnotationName%2C%20Reason%2C%20Context%2C%20Category%20%7C%20order%20by%20Timestamp%20desc" target="_blank">portal.Azure.cn</a>

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
az graph query -q "healthresourcechanges | where type == "microsoft.resources/changes" | where properties.targetResourceType =~ "microsoft.resourcehealth/availabilityStatuses" | extend Id = tolower(split(properties.targetResourceId, '/providers/Microsoft.ResourceHealth/availabilityStatuses/current')[0]), Timestamp = todatetime(properties.changeAttributes.timestamp), PreviousAvailabilityState = properties['changes']['properties.availabilityState']['previousValue'], LatestAvailabilityState = properties['changes']['properties.availabilityState']['newValue'] | where isnotempty(LatestAvailabilityState) | project Timestamp, Id, PreviousAvailabilityState, LatestAvailabilityState | order by Timestamp desc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "healthresourcechanges | where type == "microsoft.resources/changes" | where properties.targetResourceType =~ "microsoft.resourcehealth/availabilityStatuses" | extend Id = tolower(split(properties.targetResourceId, '/providers/Microsoft.ResourceHealth/availabilityStatuses/current')[0]), Timestamp = todatetime(properties.changeAttributes.timestamp), PreviousAvailabilityState = properties['changes']['properties.availabilityState']['previousValue'], LatestAvailabilityState = properties['changes']['properties.availabilityState']['newValue'] | where isnotempty(LatestAvailabilityState) | project Timestamp, Id, PreviousAvailabilityState, LatestAvailabilityState | order by Timestamp desc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/healthresourcechanges%20%7C%20where%20type%20%3D%3D%20%22microsoft.resources%2Fchanges%22%20%7C%20where%20properties.targetResourceType%20%3D~%20%22microsoft.resourcehealth%2FavailabilityStatuses%22%20%7C%20extend%20Id%20%3D%20tolower%28split%28properties.targetResourceId%2C%20%27%2Fproviders%2FMicrosoft.ResourceHealth%2FavailabilityStatuses%2Fcurrent%27%29%5B0%5D%29%2C%20Timestamp%20%3D%20todatetime%28properties.changeAttributes.timestamp%29%2C%20PreviousAvailabilityState%20%3D%20properties%5B%27changes%27%5D%5B%27properties.availabilityState%27%5D%5B%27previousValue%27%5D%2C%20LatestAvailabilityState%20%3D%20properties%5B%27changes%27%5D%5B%27properties.availabilityState%27%5D%5B%27newValue%27%5D%20%7C%20where%20isnotempty%28LatestAvailabilityState%29%20%7C%20project%20Timestamp%2C%20Id%2C%20PreviousAvailabilityState%2C%20LatestAvailabilityState%20%7C%20order%20by%20Timestamp%20desc" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/healthresourcechanges%20%7C%20where%20type%20%3D%3D%20%22microsoft.resources%2Fchanges%22%20%7C%20where%20properties.targetResourceType%20%3D~%20%22microsoft.resourcehealth%2FavailabilityStatuses%22%20%7C%20extend%20Id%20%3D%20tolower%28split%28properties.targetResourceId%2C%20%27%2Fproviders%2FMicrosoft.ResourceHealth%2FavailabilityStatuses%2Fcurrent%27%29%5B0%5D%29%2C%20Timestamp%20%3D%20todatetime%28properties.changeAttributes.timestamp%29%2C%20PreviousAvailabilityState%20%3D%20properties%5B%27changes%27%5D%5B%27properties.availabilityState%27%5D%5B%27previousValue%27%5D%2C%20LatestAvailabilityState%20%3D%20properties%5B%27changes%27%5D%5B%27properties.availabilityState%27%5D%5B%27newValue%27%5D%20%7C%20where%20isnotempty%28LatestAvailabilityState%29%20%7C%20project%20Timestamp%2C%20Id%2C%20PreviousAvailabilityState%2C%20LatestAvailabilityState%20%7C%20order%20by%20Timestamp%20desc" target="_blank">portal.Azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/healthresourcechanges%20%7C%20where%20type%20%3D%3D%20%22microsoft.resources%2Fchanges%22%20%7C%20where%20properties.targetResourceType%20%3D~%20%22microsoft.resourcehealth%2FavailabilityStatuses%22%20%7C%20extend%20Id%20%3D%20tolower%28split%28properties.targetResourceId%2C%20%27%2Fproviders%2FMicrosoft.ResourceHealth%2FavailabilityStatuses%2Fcurrent%27%29%5B0%5D%29%2C%20Timestamp%20%3D%20todatetime%28properties.changeAttributes.timestamp%29%2C%20PreviousAvailabilityState%20%3D%20properties%5B%27changes%27%5D%5B%27properties.availabilityState%27%5D%5B%27previousValue%27%5D%2C%20LatestAvailabilityState%20%3D%20properties%5B%27changes%27%5D%5B%27properties.availabilityState%27%5D%5B%27newValue%27%5D%20%7C%20where%20isnotempty%28LatestAvailabilityState%29%20%7C%20project%20Timestamp%2C%20Id%2C%20PreviousAvailabilityState%2C%20LatestAvailabilityState%20%7C%20order%20by%20Timestamp%20desc" target="_blank">portal.Azure.cn</a>

---

