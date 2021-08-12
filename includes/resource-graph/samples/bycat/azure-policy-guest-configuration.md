---
author: DCtheGeek
ms.service: resource-graph
ms.topic: include
ms.date: 08/04/2021
ms.author: dacoulte
ms.custom: generated
---

### Count machines in scope of guest configuration policies

Displays the count of Azure virtual machines and Arc connected servers in scope for [Azure Policy guest configuration](../../../../articles/governance/policy/concepts/guest-configuration.md) assignments.

```kusto
GuestConfigurationResources
| where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments'
| extend vmid = split(properties.targetResourceId,'/')
| mvexpand properties.latestAssignmentReport.resources
| where properties_latestAssignmentReport_resources.resourceId != 'Invalid assignment package.'
| project machine = tostring(vmid[(-1)]),type = tostring(vmid[(-3)])
| distinct machine, type
| summarize count() by type
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "GuestConfigurationResources | where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments' | extend vmid = split(properties.targetResourceId,'/') | mvexpand properties.latestAssignmentReport.resources | where properties_latestAssignmentReport_resources.resourceId != 'Invalid assignment package.' | project machine = tostring(vmid[(-1)]),type = tostring(vmid[(-3)]) | distinct machine, type | summarize count() by type"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "GuestConfigurationResources | where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments' | extend vmid = split(properties.targetResourceId,'/') | mvexpand properties.latestAssignmentReport.resources | where properties_latestAssignmentReport_resources.resourceId != 'Invalid assignment package.' | project machine = tostring(vmid[(-1)]),type = tostring(vmid[(-3)]) | distinct machine, type | summarize count() by type"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20where%20properties_latestAssignmentReport_resources.resourceId%20!%3d%20%27Invalid%20assignment%20package.%27%0a%7c%20project%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%2ctype%20%3d%20tostring(vmid%5b(-3)%5d)%0a%7c%20distinct%20machine%2c%20type%0a%7c%20summarize%20count()%20by%20type" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20where%20properties_latestAssignmentReport_resources.resourceId%20!%3d%20%27Invalid%20assignment%20package.%27%0a%7c%20project%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%2ctype%20%3d%20tostring(vmid%5b(-3)%5d)%0a%7c%20distinct%20machine%2c%20type%0a%7c%20summarize%20count()%20by%20type" target="_blank">portal.azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20where%20properties_latestAssignmentReport_resources.resourceId%20!%3d%20%27Invalid%20assignment%20package.%27%0a%7c%20project%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%2ctype%20%3d%20tostring(vmid%5b(-3)%5d)%0a%7c%20distinct%20machine%2c%20type%0a%7c%20summarize%20count()%20by%20type" target="_blank">portal.azure.cn</a>

---

### Count of non-compliant guest configuration assignments

Displays a count of non-compliant machines per [guest configuration assignment reason](../../../../articles/governance/policy/how-to/determine-non-compliance.md#compliance-details-for-guest-configuration). Limits results to first 100 for performance.

```kusto
GuestConfigurationResources
| where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments'
| extend vmid = split(properties.targetResourceId,'/')
| where properties.complianceStatus == 'NonCompliant'
| mvexpand properties.latestAssignmentReport.resources
| mvexpand properties_latestAssignmentReport_resources.reasons
| project machine = tostring(vmid[(-1)]),
	type = tostring(vmid[(-3)]),
	name,
	status = tostring(properties.complianceStatus),
	resource = tostring(properties_latestAssignmentReport_resources.resourceId),
	phrase = tostring(properties_latestAssignmentReport_resources_reasons.phrase)
| summarize count() by resource, name
| order by count_
| limit 100
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "GuestConfigurationResources | where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments' | extend vmid = split(properties.targetResourceId,'/') | where properties.complianceStatus == 'NonCompliant' | mvexpand properties.latestAssignmentReport.resources | mvexpand properties_latestAssignmentReport_resources.reasons | project machine = tostring(vmid[(-1)]), type = tostring(vmid[(-3)]), name, status = tostring(properties.complianceStatus), resource = tostring(properties_latestAssignmentReport_resources.resourceId), phrase = tostring(properties_latestAssignmentReport_resources_reasons.phrase) | summarize count() by resource, name | order by count_ | limit 100"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "GuestConfigurationResources | where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments' | extend vmid = split(properties.targetResourceId,'/') | where properties.complianceStatus == 'NonCompliant' | mvexpand properties.latestAssignmentReport.resources | mvexpand properties_latestAssignmentReport_resources.reasons | project machine = tostring(vmid[(-1)]), type = tostring(vmid[(-3)]), name, status = tostring(properties.complianceStatus), resource = tostring(properties_latestAssignmentReport_resources.resourceId), phrase = tostring(properties_latestAssignmentReport_resources_reasons.phrase) | summarize count() by resource, name | order by count_ | limit 100"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20where%20properties.complianceStatus%20%3d%3d%20%27NonCompliant%27%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20mvexpand%20properties_latestAssignmentReport_resources.reasons%0a%7c%20project%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%2c%0a%09type%20%3d%20tostring(vmid%5b(-3)%5d)%2c%0a%09name%2c%0a%09status%20%3d%20tostring(properties.complianceStatus)%2c%0a%09resource%20%3d%20tostring(properties_latestAssignmentReport_resources.resourceId)%2c%0a%09phrase%20%3d%20tostring(properties_latestAssignmentReport_resources_reasons.phrase)%0a%7c%20summarize%20count()%20by%20resource%2c%20name%0a%7c%20order%20by%20count_%0a%7c%20limit%20100" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20where%20properties.complianceStatus%20%3d%3d%20%27NonCompliant%27%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20mvexpand%20properties_latestAssignmentReport_resources.reasons%0a%7c%20project%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%2c%0a%09type%20%3d%20tostring(vmid%5b(-3)%5d)%2c%0a%09name%2c%0a%09status%20%3d%20tostring(properties.complianceStatus)%2c%0a%09resource%20%3d%20tostring(properties_latestAssignmentReport_resources.resourceId)%2c%0a%09phrase%20%3d%20tostring(properties_latestAssignmentReport_resources_reasons.phrase)%0a%7c%20summarize%20count()%20by%20resource%2c%20name%0a%7c%20order%20by%20count_%0a%7c%20limit%20100" target="_blank">portal.azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20where%20properties.complianceStatus%20%3d%3d%20%27NonCompliant%27%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20mvexpand%20properties_latestAssignmentReport_resources.reasons%0a%7c%20project%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%2c%0a%09type%20%3d%20tostring(vmid%5b(-3)%5d)%2c%0a%09name%2c%0a%09status%20%3d%20tostring(properties.complianceStatus)%2c%0a%09resource%20%3d%20tostring(properties_latestAssignmentReport_resources.resourceId)%2c%0a%09phrase%20%3d%20tostring(properties_latestAssignmentReport_resources_reasons.phrase)%0a%7c%20summarize%20count()%20by%20resource%2c%20name%0a%7c%20order%20by%20count_%0a%7c%20limit%20100" target="_blank">portal.azure.cn</a>

---

### Find all reasons a machine is non-compliant for guest configuration assignments

Display all [guest configuration assignment reasons](../../../../articles/governance/policy/how-to/determine-non-compliance.md#compliance-details-for-guest-configuration) for a specific machine. Remove the first `where` clause to also include audits where the machine is compliant.

```kusto
GuestConfigurationResources
| where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments'
| where properties.complianceStatus == 'NonCompliant'
| extend vmid = split(properties.targetResourceId,'/')
| mvexpand properties.latestAssignmentReport.resources
| mvexpand properties_latestAssignmentReport_resources.reasons
| extend machine = tostring(vmid[(-1)])
| where machine == 'MACHINENAME'
| project phrase = tostring(properties_latestAssignmentReport_resources_reasons.phrase),
	resource = tostring(properties_latestAssignmentReport_resources.resourceId),
	name,
	machine,
	resourceGroup,
	subscriptionId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "GuestConfigurationResources | where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments' | where properties.complianceStatus == 'NonCompliant' | extend vmid = split(properties.targetResourceId,'/') | mvexpand properties.latestAssignmentReport.resources | mvexpand properties_latestAssignmentReport_resources.reasons | extend machine = tostring(vmid[(-1)]) | where machine == 'MACHINENAME' | project phrase = tostring(properties_latestAssignmentReport_resources_reasons.phrase), resource = tostring(properties_latestAssignmentReport_resources.resourceId), name, machine, resourceGroup, subscriptionId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "GuestConfigurationResources | where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments' | where properties.complianceStatus == 'NonCompliant' | extend vmid = split(properties.targetResourceId,'/') | mvexpand properties.latestAssignmentReport.resources | mvexpand properties_latestAssignmentReport_resources.reasons | extend machine = tostring(vmid[(-1)]) | where machine == 'MACHINENAME' | project phrase = tostring(properties_latestAssignmentReport_resources_reasons.phrase), resource = tostring(properties_latestAssignmentReport_resources.resourceId), name, machine, resourceGroup, subscriptionId"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20where%20properties.complianceStatus%20%3d%3d%20%27NonCompliant%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20mvexpand%20properties_latestAssignmentReport_resources.reasons%0a%7c%20extend%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%0a%7c%20where%20machine%20%3d%3d%20%27MACHINENAME%27%0a%7c%20project%20phrase%20%3d%20tostring(properties_latestAssignmentReport_resources_reasons.phrase)%2c%0a%09resource%20%3d%20tostring(properties_latestAssignmentReport_resources.resourceId)%2c%0a%09name%2c%0a%09machine%2c%0a%09resourceGroup%2c%0a%09subscriptionId" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20where%20properties.complianceStatus%20%3d%3d%20%27NonCompliant%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20mvexpand%20properties_latestAssignmentReport_resources.reasons%0a%7c%20extend%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%0a%7c%20where%20machine%20%3d%3d%20%27MACHINENAME%27%0a%7c%20project%20phrase%20%3d%20tostring(properties_latestAssignmentReport_resources_reasons.phrase)%2c%0a%09resource%20%3d%20tostring(properties_latestAssignmentReport_resources.resourceId)%2c%0a%09name%2c%0a%09machine%2c%0a%09resourceGroup%2c%0a%09subscriptionId" target="_blank">portal.azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20where%20properties.complianceStatus%20%3d%3d%20%27NonCompliant%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20mvexpand%20properties_latestAssignmentReport_resources.reasons%0a%7c%20extend%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%0a%7c%20where%20machine%20%3d%3d%20%27MACHINENAME%27%0a%7c%20project%20phrase%20%3d%20tostring(properties_latestAssignmentReport_resources_reasons.phrase)%2c%0a%09resource%20%3d%20tostring(properties_latestAssignmentReport_resources.resourceId)%2c%0a%09name%2c%0a%09machine%2c%0a%09resourceGroup%2c%0a%09subscriptionId" target="_blank">portal.azure.cn</a>

---

### Query details of guest configuration assignment reports

Display report from [guest configuration assignment reason](../../../../articles/governance/policy/how-to/determine-non-compliance.md#compliance-details-for-guest-configuration) details. In the following example, the query returns only results where the Guest Assignment name is `installed_application_linux` and the output contains the string `Python` to list all Linux machines where a package is installed that includes the name **Python**. To query compliance of all machines for a specific assignment, remove the second `where` clause.

```kusto
GuestConfigurationResources
| where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments'
| extend vmid = split(properties.targetResourceId,'/')
| mvexpand properties.latestAssignmentReport.resources
| mvexpand properties_latestAssignmentReport_resources.reasons
| where name in ('installed_application_linux')
| where properties_latestAssignmentReport_resources_reasons.phrase contains 'Python'
| project machine = tostring(vmid[(-1)]),
	type = tostring(vmid[(-3)]),
	name,
	status = tostring(properties.complianceStatus),
	resource = tostring(properties_latestAssignmentReport_resources.resourceId),
	phrase = tostring(properties_latestAssignmentReport_resources_reasons.phrase)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "GuestConfigurationResources | where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments' | extend vmid = split(properties.targetResourceId,'/') | mvexpand properties.latestAssignmentReport.resources | mvexpand properties_latestAssignmentReport_resources.reasons | where name in ('installed_application_linux') | where properties_latestAssignmentReport_resources_reasons.phrase contains 'Python' | project machine = tostring(vmid[(-1)]), type = tostring(vmid[(-3)]), name, status = tostring(properties.complianceStatus), resource = tostring(properties_latestAssignmentReport_resources.resourceId), phrase = tostring(properties_latestAssignmentReport_resources_reasons.phrase)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "GuestConfigurationResources | where type =~ 'microsoft.guestconfiguration/guestconfigurationassignments' | extend vmid = split(properties.targetResourceId,'/') | mvexpand properties.latestAssignmentReport.resources | mvexpand properties_latestAssignmentReport_resources.reasons | where name in ('installed_application_linux') | where properties_latestAssignmentReport_resources_reasons.phrase contains 'Python' | project machine = tostring(vmid[(-1)]), type = tostring(vmid[(-3)]), name, status = tostring(properties.complianceStatus), resource = tostring(properties_latestAssignmentReport_resources.resourceId), phrase = tostring(properties_latestAssignmentReport_resources_reasons.phrase)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20mvexpand%20properties_latestAssignmentReport_resources.reasons%0a%7c%20where%20name%20in%20(%27installed_application_linux%27)%0a%7c%20where%20properties_latestAssignmentReport_resources_reasons.phrase%20contains%20%27Python%27%0a%7c%20project%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%2c%0a%09type%20%3d%20tostring(vmid%5b(-3)%5d)%2c%0a%09name%2c%0a%09status%20%3d%20tostring(properties.complianceStatus)%2c%0a%09resource%20%3d%20tostring(properties_latestAssignmentReport_resources.resourceId)%2c%0a%09phrase%20%3d%20tostring(properties_latestAssignmentReport_resources_reasons.phrase)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20mvexpand%20properties_latestAssignmentReport_resources.reasons%0a%7c%20where%20name%20in%20(%27installed_application_linux%27)%0a%7c%20where%20properties_latestAssignmentReport_resources_reasons.phrase%20contains%20%27Python%27%0a%7c%20project%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%2c%0a%09type%20%3d%20tostring(vmid%5b(-3)%5d)%2c%0a%09name%2c%0a%09status%20%3d%20tostring(properties.complianceStatus)%2c%0a%09resource%20%3d%20tostring(properties_latestAssignmentReport_resources.resourceId)%2c%0a%09phrase%20%3d%20tostring(properties_latestAssignmentReport_resources_reasons.phrase)" target="_blank">portal.azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/GuestConfigurationResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.guestconfiguration%2fguestconfigurationassignments%27%0a%7c%20extend%20vmid%20%3d%20split(properties.targetResourceId%2c%27%2f%27)%0a%7c%20mvexpand%20properties.latestAssignmentReport.resources%0a%7c%20mvexpand%20properties_latestAssignmentReport_resources.reasons%0a%7c%20where%20name%20in%20(%27installed_application_linux%27)%0a%7c%20where%20properties_latestAssignmentReport_resources_reasons.phrase%20contains%20%27Python%27%0a%7c%20project%20machine%20%3d%20tostring(vmid%5b(-1)%5d)%2c%0a%09type%20%3d%20tostring(vmid%5b(-3)%5d)%2c%0a%09name%2c%0a%09status%20%3d%20tostring(properties.complianceStatus)%2c%0a%09resource%20%3d%20tostring(properties_latestAssignmentReport_resources.resourceId)%2c%0a%09phrase%20%3d%20tostring(properties_latestAssignmentReport_resources_reasons.phrase)" target="_blank">portal.azure.cn</a>

---

