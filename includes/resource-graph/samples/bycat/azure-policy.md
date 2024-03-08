---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 07/07/2022
ms.author: davidsmatlak
ms.custom: generated
---

### Compliance by policy assignment

Provides compliance state, compliance percentage, and counts of resources for each Azure Policy assignment.

```kusto
PolicyResources
| where type =~ 'Microsoft.PolicyInsights/PolicyStates'
| extend complianceState = tostring(properties.complianceState)
| extend
	resourceId = tostring(properties.resourceId),
	policyAssignmentId = tostring(properties.policyAssignmentId),
	policyAssignmentScope = tostring(properties.policyAssignmentScope),
	policyAssignmentName = tostring(properties.policyAssignmentName),
	policyDefinitionId = tostring(properties.policyDefinitionId),
	policyDefinitionReferenceId = tostring(properties.policyDefinitionReferenceId),
	stateWeight = iff(complianceState == 'NonCompliant', int(300), iff(complianceState == 'Compliant', int(200), iff(complianceState == 'Conflict', int(100), iff(complianceState == 'Exempt', int(50), int(0)))))
| summarize max(stateWeight) by resourceId, policyAssignmentId, policyAssignmentScope, policyAssignmentName
| summarize counts = count() by policyAssignmentId, policyAssignmentScope, max_stateWeight, policyAssignmentName
| summarize overallStateWeight = max(max_stateWeight),
nonCompliantCount = sumif(counts, max_stateWeight == 300),
compliantCount = sumif(counts, max_stateWeight == 200),
conflictCount = sumif(counts, max_stateWeight == 100),
exemptCount = sumif(counts, max_stateWeight == 50) by policyAssignmentId, policyAssignmentScope, policyAssignmentName
| extend totalResources = todouble(nonCompliantCount + compliantCount + conflictCount + exemptCount)
| extend compliancePercentage = iff(totalResources == 0, todouble(100), 100 * todouble(compliantCount + exemptCount) / totalResources)
| project policyAssignmentName, scope = policyAssignmentScope,
complianceState = iff(overallStateWeight == 300, 'noncompliant', iff(overallStateWeight == 200, 'compliant', iff(overallStateWeight == 100, 'conflict', iff(overallStateWeight == 50, 'exempt', 'notstarted')))),
compliancePercentage,
compliantCount,
nonCompliantCount,
conflictCount,
exemptCount
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "PolicyResources | where type =~ 'Microsoft.PolicyInsights/PolicyStates' | extend complianceState = tostring(properties.complianceState) | extend resourceId = tostring(properties.resourceId), policyAssignmentId = tostring(properties.policyAssignmentId), policyAssignmentScope = tostring(properties.policyAssignmentScope), policyAssignmentName = tostring(properties.policyAssignmentName), policyDefinitionId = tostring(properties.policyDefinitionId), policyDefinitionReferenceId = tostring(properties.policyDefinitionReferenceId), stateWeight = iff(complianceState == 'NonCompliant', int(300), iff(complianceState == 'Compliant', int(200), iff(complianceState == 'Conflict', int(100), iff(complianceState == 'Exempt', int(50), int(0))))) | summarize max(stateWeight) by resourceId, policyAssignmentId, policyAssignmentScope, policyAssignmentName | summarize counts = count() by policyAssignmentId, policyAssignmentScope, max_stateWeight, policyAssignmentName | summarize overallStateWeight = max(max_stateWeight), nonCompliantCount = sumif(counts, max_stateWeight == 300), compliantCount = sumif(counts, max_stateWeight == 200), conflictCount = sumif(counts, max_stateWeight == 100), exemptCount = sumif(counts, max_stateWeight == 50) by policyAssignmentId, policyAssignmentScope, policyAssignmentName | extend totalResources = todouble(nonCompliantCount + compliantCount + conflictCount + exemptCount) | extend compliancePercentage = iff(totalResources == 0, todouble(100), 100 * todouble(compliantCount + exemptCount) / totalResources) | project policyAssignmentName, scope = policyAssignmentScope, complianceState = iff(overallStateWeight == 300, 'noncompliant', iff(overallStateWeight == 200, 'compliant', iff(overallStateWeight == 100, 'conflict', iff(overallStateWeight == 50, 'exempt', 'notstarted')))), compliancePercentage, compliantCount, nonCompliantCount, conflictCount, exemptCount"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "PolicyResources | where type =~ 'Microsoft.PolicyInsights/PolicyStates' | extend complianceState = tostring(properties.complianceState) | extend resourceId = tostring(properties.resourceId), policyAssignmentId = tostring(properties.policyAssignmentId), policyAssignmentScope = tostring(properties.policyAssignmentScope), policyAssignmentName = tostring(properties.policyAssignmentName), policyDefinitionId = tostring(properties.policyDefinitionId), policyDefinitionReferenceId = tostring(properties.policyDefinitionReferenceId), stateWeight = iff(complianceState == 'NonCompliant', int(300), iff(complianceState == 'Compliant', int(200), iff(complianceState == 'Conflict', int(100), iff(complianceState == 'Exempt', int(50), int(0))))) | summarize max(stateWeight) by resourceId, policyAssignmentId, policyAssignmentScope, policyAssignmentName | summarize counts = count() by policyAssignmentId, policyAssignmentScope, max_stateWeight, policyAssignmentName | summarize overallStateWeight = max(max_stateWeight), nonCompliantCount = sumif(counts, max_stateWeight == 300), compliantCount = sumif(counts, max_stateWeight == 200), conflictCount = sumif(counts, max_stateWeight == 100), exemptCount = sumif(counts, max_stateWeight == 50) by policyAssignmentId, policyAssignmentScope, policyAssignmentName | extend totalResources = todouble(nonCompliantCount + compliantCount + conflictCount + exemptCount) | extend compliancePercentage = iff(totalResources == 0, todouble(100), 100 * todouble(compliantCount + exemptCount) / totalResources) | project policyAssignmentName, scope = policyAssignmentScope, complianceState = iff(overallStateWeight == 300, 'noncompliant', iff(overallStateWeight == 200, 'compliant', iff(overallStateWeight == 100, 'conflict', iff(overallStateWeight == 50, 'exempt', 'notstarted')))), compliancePercentage, compliantCount, nonCompliantCount, conflictCount, exemptCount"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.PolicyInsights%2fPolicyStates%27%0a%7c%20extend%20complianceState%20%3d%20tostring(properties.complianceState)%0a%7c%20extend%0a%09resourceId%20%3d%20tostring(properties.resourceId)%2c%0a%09policyAssignmentId%20%3d%20tostring(properties.policyAssignmentId)%2c%0a%09policyAssignmentScope%20%3d%20tostring(properties.policyAssignmentScope)%2c%0a%09policyAssignmentName%20%3d%20tostring(properties.policyAssignmentName)%2c%0a%09policyDefinitionId%20%3d%20tostring(properties.policyDefinitionId)%2c%0a%09policyDefinitionReferenceId%20%3d%20tostring(properties.policyDefinitionReferenceId)%2c%0a%09stateWeight%20%3d%20iff(complianceState%20%3d%3d%20%27NonCompliant%27%2c%20int(300)%2c%20iff(complianceState%20%3d%3d%20%27Compliant%27%2c%20int(200)%2c%20iff(complianceState%20%3d%3d%20%27Conflict%27%2c%20int(100)%2c%20iff(complianceState%20%3d%3d%20%27Exempt%27%2c%20int(50)%2c%20int(0)))))%0a%7c%20summarize%20max(stateWeight)%20by%20resourceId%2c%20policyAssignmentId%2c%20policyAssignmentScope%2c%20policyAssignmentName%0a%7c%20summarize%20counts%20%3d%20count()%20by%20policyAssignmentId%2c%20policyAssignmentScope%2c%20max_stateWeight%2c%20policyAssignmentName%0a%7c%20summarize%20overallStateWeight%20%3d%20max(max_stateWeight)%2c%0anonCompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20300)%2c%0acompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20200)%2c%0aconflictCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20100)%2c%0aexemptCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%2050)%20by%20policyAssignmentId%2c%20policyAssignmentScope%2c%20policyAssignmentName%0a%7c%20extend%20totalResources%20%3d%20todouble(nonCompliantCount%20%2b%20compliantCount%20%2b%20conflictCount%20%2b%20exemptCount)%0a%7c%20extend%20compliancePercentage%20%3d%20iff(totalResources%20%3d%3d%200%2c%20todouble(100)%2c%20100%20*%20todouble(compliantCount%20%2b%20exemptCount)%20%2f%20totalResources)%0a%7c%20project%20policyAssignmentName%2c%20scope%20%3d%20policyAssignmentScope%2c%0acomplianceState%20%3d%20iff(overallStateWeight%20%3d%3d%20300%2c%20%27noncompliant%27%2c%20iff(overallStateWeight%20%3d%3d%20200%2c%20%27compliant%27%2c%20iff(overallStateWeight%20%3d%3d%20100%2c%20%27conflict%27%2c%20iff(overallStateWeight%20%3d%3d%2050%2c%20%27exempt%27%2c%20%27notstarted%27))))%2c%0acompliancePercentage%2c%0acompliantCount%2c%0anonCompliantCount%2c%0aconflictCount%2c%0aexemptCount" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.PolicyInsights%2fPolicyStates%27%0a%7c%20extend%20complianceState%20%3d%20tostring(properties.complianceState)%0a%7c%20extend%0a%09resourceId%20%3d%20tostring(properties.resourceId)%2c%0a%09policyAssignmentId%20%3d%20tostring(properties.policyAssignmentId)%2c%0a%09policyAssignmentScope%20%3d%20tostring(properties.policyAssignmentScope)%2c%0a%09policyAssignmentName%20%3d%20tostring(properties.policyAssignmentName)%2c%0a%09policyDefinitionId%20%3d%20tostring(properties.policyDefinitionId)%2c%0a%09policyDefinitionReferenceId%20%3d%20tostring(properties.policyDefinitionReferenceId)%2c%0a%09stateWeight%20%3d%20iff(complianceState%20%3d%3d%20%27NonCompliant%27%2c%20int(300)%2c%20iff(complianceState%20%3d%3d%20%27Compliant%27%2c%20int(200)%2c%20iff(complianceState%20%3d%3d%20%27Conflict%27%2c%20int(100)%2c%20iff(complianceState%20%3d%3d%20%27Exempt%27%2c%20int(50)%2c%20int(0)))))%0a%7c%20summarize%20max(stateWeight)%20by%20resourceId%2c%20policyAssignmentId%2c%20policyAssignmentScope%2c%20policyAssignmentName%0a%7c%20summarize%20counts%20%3d%20count()%20by%20policyAssignmentId%2c%20policyAssignmentScope%2c%20max_stateWeight%2c%20policyAssignmentName%0a%7c%20summarize%20overallStateWeight%20%3d%20max(max_stateWeight)%2c%0anonCompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20300)%2c%0acompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20200)%2c%0aconflictCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20100)%2c%0aexemptCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%2050)%20by%20policyAssignmentId%2c%20policyAssignmentScope%2c%20policyAssignmentName%0a%7c%20extend%20totalResources%20%3d%20todouble(nonCompliantCount%20%2b%20compliantCount%20%2b%20conflictCount%20%2b%20exemptCount)%0a%7c%20extend%20compliancePercentage%20%3d%20iff(totalResources%20%3d%3d%200%2c%20todouble(100)%2c%20100%20*%20todouble(compliantCount%20%2b%20exemptCount)%20%2f%20totalResources)%0a%7c%20project%20policyAssignmentName%2c%20scope%20%3d%20policyAssignmentScope%2c%0acomplianceState%20%3d%20iff(overallStateWeight%20%3d%3d%20300%2c%20%27noncompliant%27%2c%20iff(overallStateWeight%20%3d%3d%20200%2c%20%27compliant%27%2c%20iff(overallStateWeight%20%3d%3d%20100%2c%20%27conflict%27%2c%20iff(overallStateWeight%20%3d%3d%2050%2c%20%27exempt%27%2c%20%27notstarted%27))))%2c%0acompliancePercentage%2c%0acompliantCount%2c%0anonCompliantCount%2c%0aconflictCount%2c%0aexemptCount" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.PolicyInsights%2fPolicyStates%27%0a%7c%20extend%20complianceState%20%3d%20tostring(properties.complianceState)%0a%7c%20extend%0a%09resourceId%20%3d%20tostring(properties.resourceId)%2c%0a%09policyAssignmentId%20%3d%20tostring(properties.policyAssignmentId)%2c%0a%09policyAssignmentScope%20%3d%20tostring(properties.policyAssignmentScope)%2c%0a%09policyAssignmentName%20%3d%20tostring(properties.policyAssignmentName)%2c%0a%09policyDefinitionId%20%3d%20tostring(properties.policyDefinitionId)%2c%0a%09policyDefinitionReferenceId%20%3d%20tostring(properties.policyDefinitionReferenceId)%2c%0a%09stateWeight%20%3d%20iff(complianceState%20%3d%3d%20%27NonCompliant%27%2c%20int(300)%2c%20iff(complianceState%20%3d%3d%20%27Compliant%27%2c%20int(200)%2c%20iff(complianceState%20%3d%3d%20%27Conflict%27%2c%20int(100)%2c%20iff(complianceState%20%3d%3d%20%27Exempt%27%2c%20int(50)%2c%20int(0)))))%0a%7c%20summarize%20max(stateWeight)%20by%20resourceId%2c%20policyAssignmentId%2c%20policyAssignmentScope%2c%20policyAssignmentName%0a%7c%20summarize%20counts%20%3d%20count()%20by%20policyAssignmentId%2c%20policyAssignmentScope%2c%20max_stateWeight%2c%20policyAssignmentName%0a%7c%20summarize%20overallStateWeight%20%3d%20max(max_stateWeight)%2c%0anonCompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20300)%2c%0acompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20200)%2c%0aconflictCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20100)%2c%0aexemptCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%2050)%20by%20policyAssignmentId%2c%20policyAssignmentScope%2c%20policyAssignmentName%0a%7c%20extend%20totalResources%20%3d%20todouble(nonCompliantCount%20%2b%20compliantCount%20%2b%20conflictCount%20%2b%20exemptCount)%0a%7c%20extend%20compliancePercentage%20%3d%20iff(totalResources%20%3d%3d%200%2c%20todouble(100)%2c%20100%20*%20todouble(compliantCount%20%2b%20exemptCount)%20%2f%20totalResources)%0a%7c%20project%20policyAssignmentName%2c%20scope%20%3d%20policyAssignmentScope%2c%0acomplianceState%20%3d%20iff(overallStateWeight%20%3d%3d%20300%2c%20%27noncompliant%27%2c%20iff(overallStateWeight%20%3d%3d%20200%2c%20%27compliant%27%2c%20iff(overallStateWeight%20%3d%3d%20100%2c%20%27conflict%27%2c%20iff(overallStateWeight%20%3d%3d%2050%2c%20%27exempt%27%2c%20%27notstarted%27))))%2c%0acompliancePercentage%2c%0acompliantCount%2c%0anonCompliantCount%2c%0aconflictCount%2c%0aexemptCount" target="_blank">portal.azure.cn</a>

---

### Compliance by resource type

Provides compliance state, compliance percentage, and counts of resources for each resource type.

```kusto
PolicyResources
| where type =~ 'Microsoft.PolicyInsights/PolicyStates'
| extend complianceState = tostring(properties.complianceState)
| extend
	resourceId = tostring(properties.resourceId),
	resourceType = tolower(tostring(properties.resourceType)),
	policyAssignmentId = tostring(properties.policyAssignmentId),
	policyDefinitionId = tostring(properties.policyDefinitionId),
	policyDefinitionReferenceId = tostring(properties.policyDefinitionReferenceId),
	stateWeight = iff(complianceState == 'NonCompliant', int(300), iff(complianceState == 'Compliant', int(200), iff(complianceState == 'Conflict', int(100), iff(complianceState == 'Exempt', int(50), int(0)))))
| summarize max(stateWeight) by resourceId, resourceType
| summarize counts = count() by resourceType, max_stateWeight
| summarize overallStateWeight = max(max_stateWeight),
nonCompliantCount = sumif(counts, max_stateWeight == 300),
compliantCount = sumif(counts, max_stateWeight == 200),
conflictCount = sumif(counts, max_stateWeight == 100),
exemptCount = sumif(counts, max_stateWeight == 50) by resourceType
| extend totalResources = todouble(nonCompliantCount + compliantCount + conflictCount + exemptCount)
| extend compliancePercentage = iff(totalResources == 0, todouble(100), 100 * todouble(compliantCount + exemptCount) / totalResources)
| project resourceType,
overAllComplianceState = iff(overallStateWeight == 300, 'noncompliant', iff(overallStateWeight == 200, 'compliant', iff(overallStateWeight == 100, 'conflict', iff(overallStateWeight == 50, 'exempt', 'notstarted')))),
compliancePercentage,
compliantCount,
nonCompliantCount,
conflictCount,
exemptCount
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "PolicyResources | where type =~ 'Microsoft.PolicyInsights/PolicyStates' | extend complianceState = tostring(properties.complianceState) | extend resourceId = tostring(properties.resourceId), resourceType = tolower(tostring(properties.resourceType)), policyAssignmentId = tostring(properties.policyAssignmentId), policyDefinitionId = tostring(properties.policyDefinitionId), policyDefinitionReferenceId = tostring(properties.policyDefinitionReferenceId), stateWeight = iff(complianceState == 'NonCompliant', int(300), iff(complianceState == 'Compliant', int(200), iff(complianceState == 'Conflict', int(100), iff(complianceState == 'Exempt', int(50), int(0))))) | summarize max(stateWeight) by resourceId, resourceType | summarize counts = count() by resourceType, max_stateWeight | summarize overallStateWeight = max(max_stateWeight), nonCompliantCount = sumif(counts, max_stateWeight == 300), compliantCount = sumif(counts, max_stateWeight == 200), conflictCount = sumif(counts, max_stateWeight == 100), exemptCount = sumif(counts, max_stateWeight == 50) by resourceType | extend totalResources = todouble(nonCompliantCount + compliantCount + conflictCount + exemptCount) | extend compliancePercentage = iff(totalResources == 0, todouble(100), 100 * todouble(compliantCount + exemptCount) / totalResources) | project resourceType, overAllComplianceState = iff(overallStateWeight == 300, 'noncompliant', iff(overallStateWeight == 200, 'compliant', iff(overallStateWeight == 100, 'conflict', iff(overallStateWeight == 50, 'exempt', 'notstarted')))), compliancePercentage, compliantCount, nonCompliantCount, conflictCount, exemptCount"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "PolicyResources | where type =~ 'Microsoft.PolicyInsights/PolicyStates' | extend complianceState = tostring(properties.complianceState) | extend resourceId = tostring(properties.resourceId), resourceType = tolower(tostring(properties.resourceType)), policyAssignmentId = tostring(properties.policyAssignmentId), policyDefinitionId = tostring(properties.policyDefinitionId), policyDefinitionReferenceId = tostring(properties.policyDefinitionReferenceId), stateWeight = iff(complianceState == 'NonCompliant', int(300), iff(complianceState == 'Compliant', int(200), iff(complianceState == 'Conflict', int(100), iff(complianceState == 'Exempt', int(50), int(0))))) | summarize max(stateWeight) by resourceId, resourceType | summarize counts = count() by resourceType, max_stateWeight | summarize overallStateWeight = max(max_stateWeight), nonCompliantCount = sumif(counts, max_stateWeight == 300), compliantCount = sumif(counts, max_stateWeight == 200), conflictCount = sumif(counts, max_stateWeight == 100), exemptCount = sumif(counts, max_stateWeight == 50) by resourceType | extend totalResources = todouble(nonCompliantCount + compliantCount + conflictCount + exemptCount) | extend compliancePercentage = iff(totalResources == 0, todouble(100), 100 * todouble(compliantCount + exemptCount) / totalResources) | project resourceType, overAllComplianceState = iff(overallStateWeight == 300, 'noncompliant', iff(overallStateWeight == 200, 'compliant', iff(overallStateWeight == 100, 'conflict', iff(overallStateWeight == 50, 'exempt', 'notstarted')))), compliancePercentage, compliantCount, nonCompliantCount, conflictCount, exemptCount"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.PolicyInsights%2fPolicyStates%27%0a%7c%20extend%20complianceState%20%3d%20tostring(properties.complianceState)%0a%7c%20extend%0a%09resourceId%20%3d%20tostring(properties.resourceId)%2c%0a%09resourceType%20%3d%20tolower(tostring(properties.resourceType))%2c%0a%09policyAssignmentId%20%3d%20tostring(properties.policyAssignmentId)%2c%0a%09policyDefinitionId%20%3d%20tostring(properties.policyDefinitionId)%2c%0a%09policyDefinitionReferenceId%20%3d%20tostring(properties.policyDefinitionReferenceId)%2c%0a%09stateWeight%20%3d%20iff(complianceState%20%3d%3d%20%27NonCompliant%27%2c%20int(300)%2c%20iff(complianceState%20%3d%3d%20%27Compliant%27%2c%20int(200)%2c%20iff(complianceState%20%3d%3d%20%27Conflict%27%2c%20int(100)%2c%20iff(complianceState%20%3d%3d%20%27Exempt%27%2c%20int(50)%2c%20int(0)))))%0a%7c%20summarize%20max(stateWeight)%20by%20resourceId%2c%20resourceType%0a%7c%20summarize%20counts%20%3d%20count()%20by%20resourceType%2c%20max_stateWeight%0a%7c%20summarize%20overallStateWeight%20%3d%20max(max_stateWeight)%2c%0anonCompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20300)%2c%0acompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20200)%2c%0aconflictCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20100)%2c%0aexemptCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%2050)%20by%20resourceType%0a%7c%20extend%20totalResources%20%3d%20todouble(nonCompliantCount%20%2b%20compliantCount%20%2b%20conflictCount%20%2b%20exemptCount)%0a%7c%20extend%20compliancePercentage%20%3d%20iff(totalResources%20%3d%3d%200%2c%20todouble(100)%2c%20100%20*%20todouble(compliantCount%20%2b%20exemptCount)%20%2f%20totalResources)%0a%7c%20project%20resourceType%2c%0aoverAllComplianceState%20%3d%20iff(overallStateWeight%20%3d%3d%20300%2c%20%27noncompliant%27%2c%20iff(overallStateWeight%20%3d%3d%20200%2c%20%27compliant%27%2c%20iff(overallStateWeight%20%3d%3d%20100%2c%20%27conflict%27%2c%20iff(overallStateWeight%20%3d%3d%2050%2c%20%27exempt%27%2c%20%27notstarted%27))))%2c%0acompliancePercentage%2c%0acompliantCount%2c%0anonCompliantCount%2c%0aconflictCount%2c%0aexemptCount" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.PolicyInsights%2fPolicyStates%27%0a%7c%20extend%20complianceState%20%3d%20tostring(properties.complianceState)%0a%7c%20extend%0a%09resourceId%20%3d%20tostring(properties.resourceId)%2c%0a%09resourceType%20%3d%20tolower(tostring(properties.resourceType))%2c%0a%09policyAssignmentId%20%3d%20tostring(properties.policyAssignmentId)%2c%0a%09policyDefinitionId%20%3d%20tostring(properties.policyDefinitionId)%2c%0a%09policyDefinitionReferenceId%20%3d%20tostring(properties.policyDefinitionReferenceId)%2c%0a%09stateWeight%20%3d%20iff(complianceState%20%3d%3d%20%27NonCompliant%27%2c%20int(300)%2c%20iff(complianceState%20%3d%3d%20%27Compliant%27%2c%20int(200)%2c%20iff(complianceState%20%3d%3d%20%27Conflict%27%2c%20int(100)%2c%20iff(complianceState%20%3d%3d%20%27Exempt%27%2c%20int(50)%2c%20int(0)))))%0a%7c%20summarize%20max(stateWeight)%20by%20resourceId%2c%20resourceType%0a%7c%20summarize%20counts%20%3d%20count()%20by%20resourceType%2c%20max_stateWeight%0a%7c%20summarize%20overallStateWeight%20%3d%20max(max_stateWeight)%2c%0anonCompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20300)%2c%0acompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20200)%2c%0aconflictCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20100)%2c%0aexemptCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%2050)%20by%20resourceType%0a%7c%20extend%20totalResources%20%3d%20todouble(nonCompliantCount%20%2b%20compliantCount%20%2b%20conflictCount%20%2b%20exemptCount)%0a%7c%20extend%20compliancePercentage%20%3d%20iff(totalResources%20%3d%3d%200%2c%20todouble(100)%2c%20100%20*%20todouble(compliantCount%20%2b%20exemptCount)%20%2f%20totalResources)%0a%7c%20project%20resourceType%2c%0aoverAllComplianceState%20%3d%20iff(overallStateWeight%20%3d%3d%20300%2c%20%27noncompliant%27%2c%20iff(overallStateWeight%20%3d%3d%20200%2c%20%27compliant%27%2c%20iff(overallStateWeight%20%3d%3d%20100%2c%20%27conflict%27%2c%20iff(overallStateWeight%20%3d%3d%2050%2c%20%27exempt%27%2c%20%27notstarted%27))))%2c%0acompliancePercentage%2c%0acompliantCount%2c%0anonCompliantCount%2c%0aconflictCount%2c%0aexemptCount" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.PolicyInsights%2fPolicyStates%27%0a%7c%20extend%20complianceState%20%3d%20tostring(properties.complianceState)%0a%7c%20extend%0a%09resourceId%20%3d%20tostring(properties.resourceId)%2c%0a%09resourceType%20%3d%20tolower(tostring(properties.resourceType))%2c%0a%09policyAssignmentId%20%3d%20tostring(properties.policyAssignmentId)%2c%0a%09policyDefinitionId%20%3d%20tostring(properties.policyDefinitionId)%2c%0a%09policyDefinitionReferenceId%20%3d%20tostring(properties.policyDefinitionReferenceId)%2c%0a%09stateWeight%20%3d%20iff(complianceState%20%3d%3d%20%27NonCompliant%27%2c%20int(300)%2c%20iff(complianceState%20%3d%3d%20%27Compliant%27%2c%20int(200)%2c%20iff(complianceState%20%3d%3d%20%27Conflict%27%2c%20int(100)%2c%20iff(complianceState%20%3d%3d%20%27Exempt%27%2c%20int(50)%2c%20int(0)))))%0a%7c%20summarize%20max(stateWeight)%20by%20resourceId%2c%20resourceType%0a%7c%20summarize%20counts%20%3d%20count()%20by%20resourceType%2c%20max_stateWeight%0a%7c%20summarize%20overallStateWeight%20%3d%20max(max_stateWeight)%2c%0anonCompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20300)%2c%0acompliantCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20200)%2c%0aconflictCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%20100)%2c%0aexemptCount%20%3d%20sumif(counts%2c%20max_stateWeight%20%3d%3d%2050)%20by%20resourceType%0a%7c%20extend%20totalResources%20%3d%20todouble(nonCompliantCount%20%2b%20compliantCount%20%2b%20conflictCount%20%2b%20exemptCount)%0a%7c%20extend%20compliancePercentage%20%3d%20iff(totalResources%20%3d%3d%200%2c%20todouble(100)%2c%20100%20*%20todouble(compliantCount%20%2b%20exemptCount)%20%2f%20totalResources)%0a%7c%20project%20resourceType%2c%0aoverAllComplianceState%20%3d%20iff(overallStateWeight%20%3d%3d%20300%2c%20%27noncompliant%27%2c%20iff(overallStateWeight%20%3d%3d%20200%2c%20%27compliant%27%2c%20iff(overallStateWeight%20%3d%3d%20100%2c%20%27conflict%27%2c%20iff(overallStateWeight%20%3d%3d%2050%2c%20%27exempt%27%2c%20%27notstarted%27))))%2c%0acompliancePercentage%2c%0acompliantCount%2c%0anonCompliantCount%2c%0aconflictCount%2c%0aexemptCount" target="_blank">portal.azure.cn</a>

---

### List all non-compliant resources

Provides a list of all resources types that are in a `NonCompliant` state.

```kusto
PolicyResources
| where type == 'microsoft.policyinsights/policystates'
| where properties.complianceState == 'NonCompliant'
| extend NonCompliantResourceId = properties.resourceId, PolicyAssignmentName = properties.policyAssignmentName
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "PolicyResources | where type == 'microsoft.policyinsights/policystates' | where properties.complianceState == 'NonCompliant' | extend NonCompliantResourceId = properties.resourceId, PolicyAssignmentName = properties.policyAssignmentName"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "PolicyResources | where type == 'microsoft.policyinsights/policystates' | where properties.complianceState == 'NonCompliant'"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%e2%80%afwhere%e2%80%aftype%e2%80%af%3d%3d%e2%80%af%27microsoft.policyinsights%2fpolicystates%27%0a%7c%e2%80%afwhere%e2%80%afproperties.complianceState%e2%80%af%3d%3d%e2%80%af%27NonCompliant%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%e2%80%afwhere%e2%80%aftype%e2%80%af%3d%3d%e2%80%af%27microsoft.policyinsights%2fpolicystates%27%0a%7c%e2%80%afwhere%e2%80%afproperties.complianceState%e2%80%af%3d%3d%e2%80%af%27NonCompliant%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%e2%80%afwhere%e2%80%aftype%e2%80%af%3d%3d%e2%80%af%27microsoft.policyinsights%2fpolicystates%27%0a%7c%e2%80%afwhere%e2%80%afproperties.complianceState%e2%80%af%3d%3d%e2%80%af%27NonCompliant%27" target="_blank">portal.azure.cn</a>

---

### Summarize resource compliance by state

Details the number of resources in each compliance state.

```kusto
PolicyResources
| where type == 'microsoft.policyinsights/policystates'
| extend complianceState = tostring(properties.complianceState)
| summarize count() by complianceState
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "PolicyResources | where type == 'microsoft.policyinsights/policystates' | extend complianceState = tostring(properties.complianceState) | summarize count() by complianceState"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "PolicyResources | where type == 'microsoft.policyinsights/policystates' | extend complianceState = tostring(properties.complianceState) | summarize count() by complianceState"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%e2%80%afwhere%e2%80%aftype%e2%80%af%3d%3d%e2%80%af%27microsoft.policyinsights%2fpolicystates%27%0a%7c%e2%80%afextend%e2%80%afcomplianceState%e2%80%af%3d%e2%80%aftostring(properties.complianceState)%0a%7c%e2%80%afsummarize%e2%80%afcount()%e2%80%afby%e2%80%afcomplianceState" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%e2%80%afwhere%e2%80%aftype%e2%80%af%3d%3d%e2%80%af%27microsoft.policyinsights%2fpolicystates%27%0a%7c%e2%80%afextend%e2%80%afcomplianceState%e2%80%af%3d%e2%80%aftostring(properties.complianceState)%0a%7c%e2%80%afsummarize%e2%80%afcount()%e2%80%afby%e2%80%afcomplianceState" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%e2%80%afwhere%e2%80%aftype%e2%80%af%3d%3d%e2%80%af%27microsoft.policyinsights%2fpolicystates%27%0a%7c%e2%80%afextend%e2%80%afcomplianceState%e2%80%af%3d%e2%80%aftostring(properties.complianceState)%0a%7c%e2%80%afsummarize%e2%80%afcount()%e2%80%afby%e2%80%afcomplianceState" target="_blank">portal.azure.cn</a>

---

### Summarize resource compliance by state per location

Details the number of resources in each compliance state per location.

```kusto
PolicyResources
| where type == 'microsoft.policyinsights/policystates'
| extend complianceState = tostring(properties.complianceState)
| extend resourceLocation = tostring(properties.resourceLocation)
| summarize count() by resourceLocation, complianceState
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "PolicyResources | where type == 'microsoft.policyinsights/policystates' | extend complianceState = tostring(properties.complianceState) | extend resourceLocation = tostring(properties.resourceLocation) | summarize count() by resourceLocation, complianceState"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "PolicyResources | where type == 'microsoft.policyinsights/policystates' | extend complianceState = tostring(properties.complianceState) | extend resourceLocation = tostring(properties.resourceLocation) | summarize count() by resourceLocation, complianceState"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%e2%80%afwhere%e2%80%aftype%e2%80%af%3d%3d%e2%80%af%27microsoft.policyinsights%2fpolicystates%27%0a%7c%e2%80%afextend%e2%80%afcomplianceState%e2%80%af%3d%e2%80%aftostring(properties.complianceState)%0a%7c%e2%80%afextend%e2%80%afresourceLocation%e2%80%af%3d%e2%80%aftostring(properties.resourceLocation)%0a%7c%e2%80%afsummarize%e2%80%afcount()%e2%80%afby%e2%80%afresourceLocation%2c%e2%80%afcomplianceState" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%e2%80%afwhere%e2%80%aftype%e2%80%af%3d%3d%e2%80%af%27microsoft.policyinsights%2fpolicystates%27%0a%7c%e2%80%afextend%e2%80%afcomplianceState%e2%80%af%3d%e2%80%aftostring(properties.complianceState)%0a%7c%e2%80%afextend%e2%80%afresourceLocation%e2%80%af%3d%e2%80%aftostring(properties.resourceLocation)%0a%7c%e2%80%afsummarize%e2%80%afcount()%e2%80%afby%e2%80%afresourceLocation%2c%e2%80%afcomplianceState" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/PolicyResources%0a%7c%e2%80%afwhere%e2%80%aftype%e2%80%af%3d%3d%e2%80%af%27microsoft.policyinsights%2fpolicystates%27%0a%7c%e2%80%afextend%e2%80%afcomplianceState%e2%80%af%3d%e2%80%aftostring(properties.complianceState)%0a%7c%e2%80%afextend%e2%80%afresourceLocation%e2%80%af%3d%e2%80%aftostring(properties.resourceLocation)%0a%7c%e2%80%afsummarize%e2%80%afcount()%e2%80%afby%e2%80%afresourceLocation%2c%e2%80%afcomplianceState" target="_blank">portal.azure.cn</a>

---

