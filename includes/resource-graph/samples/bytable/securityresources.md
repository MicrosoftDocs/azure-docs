---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 07/07/2022
ms.author: davidsmatlak
ms.custom: generated
---

### Controls secure score per subscription

Returns controls secure score per subscription.

```kusto
SecurityResources
| where type == 'microsoft.security/securescores/securescorecontrols'
| extend controlName=properties.displayName,
	controlId=properties.definition.name,
	notApplicableResourceCount=properties.notApplicableResourceCount,
	unhealthyResourceCount=properties.unhealthyResourceCount,
	healthyResourceCount=properties.healthyResourceCount,
	percentageScore=properties.score.percentage,
	currentScore=properties.score.current,
	maxScore=properties.definition.properties.maxScore,
	weight=properties.weight,
	controlType=properties.definition.properties.source.sourceType,
	controlRecommendationIds=properties.definition.properties.assessmentDefinitions
| project tenantId, subscriptionId, controlName, controlId, unhealthyResourceCount, healthyResourceCount, notApplicableResourceCount, percentageScore, currentScore, maxScore, weight, controlType, controlRecommendationIds
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/securescores/securescorecontrols' | extend controlName=properties.displayName, controlId=properties.definition.name, notApplicableResourceCount=properties.notApplicableResourceCount, unhealthyResourceCount=properties.unhealthyResourceCount, healthyResourceCount=properties.healthyResourceCount, percentageScore=properties.score.percentage, currentScore=properties.score.current, maxScore=properties.definition.properties.maxScore, weight=properties.weight, controlType=properties.definition.properties.source.sourceType, controlRecommendationIds=properties.definition.properties.assessmentDefinitions | project tenantId, subscriptionId, controlName, controlId, unhealthyResourceCount, healthyResourceCount, notApplicableResourceCount, percentageScore, currentScore, maxScore, weight, controlType, controlRecommendationIds"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/securescores/securescorecontrols' | extend controlName=properties.displayName, controlId=properties.definition.name, notApplicableResourceCount=properties.notApplicableResourceCount, unhealthyResourceCount=properties.unhealthyResourceCount, healthyResourceCount=properties.healthyResourceCount, percentageScore=properties.score.percentage, currentScore=properties.score.current, maxScore=properties.definition.properties.maxScore, weight=properties.weight, controlType=properties.definition.properties.source.sourceType, controlRecommendationIds=properties.definition.properties.assessmentDefinitions | project tenantId, subscriptionId, controlName, controlId, unhealthyResourceCount, healthyResourceCount, notApplicableResourceCount, percentageScore, currentScore, maxScore, weight, controlType, controlRecommendationIds"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fsecurescores%2fsecurescorecontrols%27%0a%7c%20extend%20controlName%3dproperties.displayName%2c%0a%09controlId%3dproperties.definition.name%2c%0a%09notApplicableResourceCount%3dproperties.notApplicableResourceCount%2c%0a%09unhealthyResourceCount%3dproperties.unhealthyResourceCount%2c%0a%09healthyResourceCount%3dproperties.healthyResourceCount%2c%0a%09percentageScore%3dproperties.score.percentage%2c%0a%09currentScore%3dproperties.score.current%2c%0a%09maxScore%3dproperties.definition.properties.maxScore%2c%0a%09weight%3dproperties.weight%2c%0a%09controlType%3dproperties.definition.properties.source.sourceType%2c%0a%09controlRecommendationIds%3dproperties.definition.properties.assessmentDefinitions%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20controlName%2c%20controlId%2c%20unhealthyResourceCount%2c%20healthyResourceCount%2c%20notApplicableResourceCount%2c%20percentageScore%2c%20currentScore%2c%20maxScore%2c%20weight%2c%20controlType%2c%20controlRecommendationIds" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fsecurescores%2fsecurescorecontrols%27%0a%7c%20extend%20controlName%3dproperties.displayName%2c%0a%09controlId%3dproperties.definition.name%2c%0a%09notApplicableResourceCount%3dproperties.notApplicableResourceCount%2c%0a%09unhealthyResourceCount%3dproperties.unhealthyResourceCount%2c%0a%09healthyResourceCount%3dproperties.healthyResourceCount%2c%0a%09percentageScore%3dproperties.score.percentage%2c%0a%09currentScore%3dproperties.score.current%2c%0a%09maxScore%3dproperties.definition.properties.maxScore%2c%0a%09weight%3dproperties.weight%2c%0a%09controlType%3dproperties.definition.properties.source.sourceType%2c%0a%09controlRecommendationIds%3dproperties.definition.properties.assessmentDefinitions%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20controlName%2c%20controlId%2c%20unhealthyResourceCount%2c%20healthyResourceCount%2c%20notApplicableResourceCount%2c%20percentageScore%2c%20currentScore%2c%20maxScore%2c%20weight%2c%20controlType%2c%20controlRecommendationIds" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fsecurescores%2fsecurescorecontrols%27%0a%7c%20extend%20controlName%3dproperties.displayName%2c%0a%09controlId%3dproperties.definition.name%2c%0a%09notApplicableResourceCount%3dproperties.notApplicableResourceCount%2c%0a%09unhealthyResourceCount%3dproperties.unhealthyResourceCount%2c%0a%09healthyResourceCount%3dproperties.healthyResourceCount%2c%0a%09percentageScore%3dproperties.score.percentage%2c%0a%09currentScore%3dproperties.score.current%2c%0a%09maxScore%3dproperties.definition.properties.maxScore%2c%0a%09weight%3dproperties.weight%2c%0a%09controlType%3dproperties.definition.properties.source.sourceType%2c%0a%09controlRecommendationIds%3dproperties.definition.properties.assessmentDefinitions%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20controlName%2c%20controlId%2c%20unhealthyResourceCount%2c%20healthyResourceCount%2c%20notApplicableResourceCount%2c%20percentageScore%2c%20currentScore%2c%20maxScore%2c%20weight%2c%20controlType%2c%20controlRecommendationIds" target="_blank">portal.azure.cn</a>

---

### Count healthy, unhealthy, and not applicable resources per recommendation

Returns count of healthy, unhealthy, and not applicable resources per recommendation. Use `summarize` and `count` to define how to group and aggregate the values by property.

```kusto
SecurityResources
| where type == 'microsoft.security/assessments'
| extend resourceId=id,
	recommendationId=name,
	resourceType=type,
	recommendationName=properties.displayName,
	source=properties.resourceDetails.Source,
	recommendationState=properties.status.code,
	description=properties.metadata.description,
	assessmentType=properties.metadata.assessmentType,
	remediationDescription=properties.metadata.remediationDescription,
	policyDefinitionId=properties.metadata.policyDefinitionId,
	implementationEffort=properties.metadata.implementationEffort,
	recommendationSeverity=properties.metadata.severity,
	category=properties.metadata.categories,
	userImpact=properties.metadata.userImpact,
	threats=properties.metadata.threats,
	portalLink=properties.links.azurePortal
| summarize numberOfResources=count(resourceId) by tostring(recommendationName), tostring(recommendationState)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/assessments' | extend resourceId=id, recommendationId=name, resourceType=type, recommendationName=properties.displayName, source=properties.resourceDetails.Source, recommendationState=properties.status.code, description=properties.metadata.description, assessmentType=properties.metadata.assessmentType, remediationDescription=properties.metadata.remediationDescription, policyDefinitionId=properties.metadata.policyDefinitionId, implementationEffort=properties.metadata.implementationEffort, recommendationSeverity=properties.metadata.severity, category=properties.metadata.categories, userImpact=properties.metadata.userImpact, threats=properties.metadata.threats, portalLink=properties.links.azurePortal | summarize numberOfResources=count(resourceId) by tostring(recommendationName), tostring(recommendationState)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/assessments' | extend resourceId=id, recommendationId=name, resourceType=type, recommendationName=properties.displayName, source=properties.resourceDetails.Source, recommendationState=properties.status.code, description=properties.metadata.description, assessmentType=properties.metadata.assessmentType, remediationDescription=properties.metadata.remediationDescription, policyDefinitionId=properties.metadata.policyDefinitionId, implementationEffort=properties.metadata.implementationEffort, recommendationSeverity=properties.metadata.severity, category=properties.metadata.categories, userImpact=properties.metadata.userImpact, threats=properties.metadata.threats, portalLink=properties.links.azurePortal | summarize numberOfResources=count(resourceId) by tostring(recommendationName), tostring(recommendationState)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20extend%20resourceId%3did%2c%0a%09recommendationId%3dname%2c%0a%09resourceType%3dtype%2c%0a%09recommendationName%3dproperties.displayName%2c%0a%09source%3dproperties.resourceDetails.Source%2c%0a%09recommendationState%3dproperties.status.code%2c%0a%09description%3dproperties.metadata.description%2c%0a%09assessmentType%3dproperties.metadata.assessmentType%2c%0a%09remediationDescription%3dproperties.metadata.remediationDescription%2c%0a%09policyDefinitionId%3dproperties.metadata.policyDefinitionId%2c%0a%09implementationEffort%3dproperties.metadata.implementationEffort%2c%0a%09recommendationSeverity%3dproperties.metadata.severity%2c%0a%09category%3dproperties.metadata.categories%2c%0a%09userImpact%3dproperties.metadata.userImpact%2c%0a%09threats%3dproperties.metadata.threats%2c%0a%09portalLink%3dproperties.links.azurePortal%0a%7c%20summarize%20numberOfResources%3dcount(resourceId)%20by%20tostring(recommendationName)%2c%20tostring(recommendationState)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20extend%20resourceId%3did%2c%0a%09recommendationId%3dname%2c%0a%09resourceType%3dtype%2c%0a%09recommendationName%3dproperties.displayName%2c%0a%09source%3dproperties.resourceDetails.Source%2c%0a%09recommendationState%3dproperties.status.code%2c%0a%09description%3dproperties.metadata.description%2c%0a%09assessmentType%3dproperties.metadata.assessmentType%2c%0a%09remediationDescription%3dproperties.metadata.remediationDescription%2c%0a%09policyDefinitionId%3dproperties.metadata.policyDefinitionId%2c%0a%09implementationEffort%3dproperties.metadata.implementationEffort%2c%0a%09recommendationSeverity%3dproperties.metadata.severity%2c%0a%09category%3dproperties.metadata.categories%2c%0a%09userImpact%3dproperties.metadata.userImpact%2c%0a%09threats%3dproperties.metadata.threats%2c%0a%09portalLink%3dproperties.links.azurePortal%0a%7c%20summarize%20numberOfResources%3dcount(resourceId)%20by%20tostring(recommendationName)%2c%20tostring(recommendationState)" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20extend%20resourceId%3did%2c%0a%09recommendationId%3dname%2c%0a%09resourceType%3dtype%2c%0a%09recommendationName%3dproperties.displayName%2c%0a%09source%3dproperties.resourceDetails.Source%2c%0a%09recommendationState%3dproperties.status.code%2c%0a%09description%3dproperties.metadata.description%2c%0a%09assessmentType%3dproperties.metadata.assessmentType%2c%0a%09remediationDescription%3dproperties.metadata.remediationDescription%2c%0a%09policyDefinitionId%3dproperties.metadata.policyDefinitionId%2c%0a%09implementationEffort%3dproperties.metadata.implementationEffort%2c%0a%09recommendationSeverity%3dproperties.metadata.severity%2c%0a%09category%3dproperties.metadata.categories%2c%0a%09userImpact%3dproperties.metadata.userImpact%2c%0a%09threats%3dproperties.metadata.threats%2c%0a%09portalLink%3dproperties.links.azurePortal%0a%7c%20summarize%20numberOfResources%3dcount(resourceId)%20by%20tostring(recommendationName)%2c%20tostring(recommendationState)" target="_blank">portal.azure.cn</a>

---

### Get all IoT alerts on hub, filtered by type

Returns all IoT alerts for a specific hub (replace placeholder `{hub_id}`) and alert type (replace placeholder `{alert_type}`).

```kusto
SecurityResources
| where type =~ 'microsoft.security/iotalerts' and id contains '{hub_id}' and properties.alertType contains '{alert_type}'
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type =~ 'microsoft.security/iotalerts' and id contains '{hub_id}' and properties.alertType contains '{alert_type}'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type =~ 'microsoft.security/iotalerts' and id contains '{hub_id}' and properties.alertType contains '{alert_type}'"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.security%2fiotalerts%27%20and%20id%20contains%20%27%7bhub_id%7d%27%20and%20properties.alertType%20contains%20%27%7balert_type%7d%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.security%2fiotalerts%27%20and%20id%20contains%20%27%7bhub_id%7d%27%20and%20properties.alertType%20contains%20%27%7balert_type%7d%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.security%2fiotalerts%27%20and%20id%20contains%20%27%7bhub_id%7d%27%20and%20properties.alertType%20contains%20%27%7balert_type%7d%27" target="_blank">portal.azure.cn</a>

---

### Get sensitivity insight of a specific resource

Returns sensitivity insight of a specific resource (replace placeholder {resource_id}).

```kusto
SecurityResources
| where type == 'microsoft.security/insights/classification'
| where properties.associatedResource contains '$resource_id'
| project SensitivityInsight = properties.insightProperties.purviewCatalogs[0].sensitivity
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/insights/classification' | where properties.associatedResource contains '\$resource_id' | project SensitivityInsight = properties.insightProperties.purviewCatalogs[0].sensitivity"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/insights/classification' | where properties.associatedResource contains '$resource_id' | project SensitivityInsight = properties.insightProperties.purviewCatalogs[0].sensitivity"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2finsights%2fclassification%27%0a%7c%20where%20properties.associatedResource%20contains%20%27%24resource_id%27%0a%7c%20project%20SensitivityInsight%20%3d%20properties.insightProperties.purviewCatalogs%5b0%5d.sensitivity" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2finsights%2fclassification%27%0a%7c%20where%20properties.associatedResource%20contains%20%27%24resource_id%27%0a%7c%20project%20SensitivityInsight%20%3d%20properties.insightProperties.purviewCatalogs%5b0%5d.sensitivity" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2finsights%2fclassification%27%0a%7c%20where%20properties.associatedResource%20contains%20%27%24resource_id%27%0a%7c%20project%20SensitivityInsight%20%3d%20properties.insightProperties.purviewCatalogs%5b0%5d.sensitivity" target="_blank">portal.azure.cn</a>

---

### Get specific IoT alert

Returns specific IoT alert by a provided system alert ID (replace placeholder `{system_Alert_Id}`).

```kusto
SecurityResources
| where type =~ 'microsoft.security/iotalerts' and properties.systemAlertId contains '{system_Alert_Id}'
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type =~ 'microsoft.security/iotalerts' and properties.systemAlertId contains '{system_Alert_Id}'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type =~ 'microsoft.security/iotalerts' and properties.systemAlertId contains '{system_Alert_Id}'"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.security%2fiotalerts%27%20and%20properties.systemAlertId%20contains%20%27%7bsystem_Alert_Id%7d%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.security%2fiotalerts%27%20and%20properties.systemAlertId%20contains%20%27%7bsystem_Alert_Id%7d%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.security%2fiotalerts%27%20and%20properties.systemAlertId%20contains%20%27%7bsystem_Alert_Id%7d%27" target="_blank">portal.azure.cn</a>

---

### List Container Registry vulnerability assessment results

Returns all the all the vulnerabilities found on container images. Microsoft Defender for Containers has to be enabled in order to view these security findings.

```kusto
SecurityResources
| where type == 'microsoft.security/assessments'
| where properties.displayName contains 'Container registry images should have vulnerability findings resolved'
| summarize by assessmentKey=name //the ID of the assessment
| join kind=inner (
	securityresources
	| where type == 'microsoft.security/assessments/subassessments'
	| extend assessmentKey = extract('.*assessments/(.+?)/.*',1,  id)
) on assessmentKey
| project assessmentKey, subassessmentKey=name, id, parse_json(properties), resourceGroup, subscriptionId, tenantId
| extend description = properties.description,
	displayName = properties.displayName,
	resourceId = properties.resourceDetails.id,
	resourceSource = properties.resourceDetails.source,
	category = properties.category,
	severity = properties.status.severity,
	code = properties.status.code,
	timeGenerated = properties.timeGenerated,
	remediation = properties.remediation,
	impact = properties.impact,
	vulnId = properties.id,
	additionalData = properties.additionalData
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/assessments' | where properties.displayName contains 'Container registry images should have vulnerability findings resolved' | summarize by assessmentKey=name //the ID of the assessment | join kind=inner ( securityresources | where type == 'microsoft.security/assessments/subassessments' | extend assessmentKey = extract('.*assessments/(.+?)/.*',1, id) ) on assessmentKey | project assessmentKey, subassessmentKey=name, id, parse_json(properties), resourceGroup, subscriptionId, tenantId | extend description = properties.description, displayName = properties.displayName, resourceId = properties.resourceDetails.id, resourceSource = properties.resourceDetails.source, category = properties.category, severity = properties.status.severity, code = properties.status.code, timeGenerated = properties.timeGenerated, remediation = properties.remediation, impact = properties.impact, vulnId = properties.id, additionalData = properties.additionalData"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/assessments' | where properties.displayName contains 'Container registry images should have vulnerability findings resolved' | summarize by assessmentKey=name //the ID of the assessment | join kind=inner ( securityresources | where type == 'microsoft.security/assessments/subassessments' | extend assessmentKey = extract('.*assessments/(.+?)/.*',1, id) ) on assessmentKey | project assessmentKey, subassessmentKey=name, id, parse_json(properties), resourceGroup, subscriptionId, tenantId | extend description = properties.description, displayName = properties.displayName, resourceId = properties.resourceDetails.id, resourceSource = properties.resourceDetails.source, category = properties.category, severity = properties.status.severity, code = properties.status.code, timeGenerated = properties.timeGenerated, remediation = properties.remediation, impact = properties.impact, vulnId = properties.id, additionalData = properties.additionalData"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20where%20properties.displayName%20contains%20%27Container%20registry%20images%20should%20have%20vulnerability%20findings%20resolved%27%0a%7c%20summarize%20by%20assessmentKey%3dname%20%2f%2fthe%20ID%20of%20the%20assessment%0a%7c%20join%20kind%3dinner%20(%0a%09securityresources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%2fsubassessments%27%0a%09%7c%20extend%20assessmentKey%20%3d%20extract(%27.*assessments%2f(.%2b%3f)%2f.*%27%2c1%2c%20%20id)%0a)%20on%20assessmentKey%0a%7c%20project%20assessmentKey%2c%20subassessmentKey%3dname%2c%20id%2c%20parse_json(properties)%2c%20resourceGroup%2c%20subscriptionId%2c%20tenantId%0a%7c%20extend%20description%20%3d%20properties.description%2c%0a%09displayName%20%3d%20properties.displayName%2c%0a%09resourceId%20%3d%20properties.resourceDetails.id%2c%0a%09resourceSource%20%3d%20properties.resourceDetails.source%2c%0a%09category%20%3d%20properties.category%2c%0a%09severity%20%3d%20properties.status.severity%2c%0a%09code%20%3d%20properties.status.code%2c%0a%09timeGenerated%20%3d%20properties.timeGenerated%2c%0a%09remediation%20%3d%20properties.remediation%2c%0a%09impact%20%3d%20properties.impact%2c%0a%09vulnId%20%3d%20properties.id%2c%0a%09additionalData%20%3d%20properties.additionalData" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20where%20properties.displayName%20contains%20%27Container%20registry%20images%20should%20have%20vulnerability%20findings%20resolved%27%0a%7c%20summarize%20by%20assessmentKey%3dname%20%2f%2fthe%20ID%20of%20the%20assessment%0a%7c%20join%20kind%3dinner%20(%0a%09securityresources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%2fsubassessments%27%0a%09%7c%20extend%20assessmentKey%20%3d%20extract(%27.*assessments%2f(.%2b%3f)%2f.*%27%2c1%2c%20%20id)%0a)%20on%20assessmentKey%0a%7c%20project%20assessmentKey%2c%20subassessmentKey%3dname%2c%20id%2c%20parse_json(properties)%2c%20resourceGroup%2c%20subscriptionId%2c%20tenantId%0a%7c%20extend%20description%20%3d%20properties.description%2c%0a%09displayName%20%3d%20properties.displayName%2c%0a%09resourceId%20%3d%20properties.resourceDetails.id%2c%0a%09resourceSource%20%3d%20properties.resourceDetails.source%2c%0a%09category%20%3d%20properties.category%2c%0a%09severity%20%3d%20properties.status.severity%2c%0a%09code%20%3d%20properties.status.code%2c%0a%09timeGenerated%20%3d%20properties.timeGenerated%2c%0a%09remediation%20%3d%20properties.remediation%2c%0a%09impact%20%3d%20properties.impact%2c%0a%09vulnId%20%3d%20properties.id%2c%0a%09additionalData%20%3d%20properties.additionalData" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20where%20properties.displayName%20contains%20%27Container%20registry%20images%20should%20have%20vulnerability%20findings%20resolved%27%0a%7c%20summarize%20by%20assessmentKey%3dname%20%2f%2fthe%20ID%20of%20the%20assessment%0a%7c%20join%20kind%3dinner%20(%0a%09securityresources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%2fsubassessments%27%0a%09%7c%20extend%20assessmentKey%20%3d%20extract(%27.*assessments%2f(.%2b%3f)%2f.*%27%2c1%2c%20%20id)%0a)%20on%20assessmentKey%0a%7c%20project%20assessmentKey%2c%20subassessmentKey%3dname%2c%20id%2c%20parse_json(properties)%2c%20resourceGroup%2c%20subscriptionId%2c%20tenantId%0a%7c%20extend%20description%20%3d%20properties.description%2c%0a%09displayName%20%3d%20properties.displayName%2c%0a%09resourceId%20%3d%20properties.resourceDetails.id%2c%0a%09resourceSource%20%3d%20properties.resourceDetails.source%2c%0a%09category%20%3d%20properties.category%2c%0a%09severity%20%3d%20properties.status.severity%2c%0a%09code%20%3d%20properties.status.code%2c%0a%09timeGenerated%20%3d%20properties.timeGenerated%2c%0a%09remediation%20%3d%20properties.remediation%2c%0a%09impact%20%3d%20properties.impact%2c%0a%09vulnId%20%3d%20properties.id%2c%0a%09additionalData%20%3d%20properties.additionalData" target="_blank">portal.azure.cn</a>

---

### List Microsoft Defender recommendations

Returns all Microsoft Defender assessments, organized in tabular manner with field per property.

```kusto
SecurityResources
| where type == 'microsoft.security/assessments'
| extend resourceId=id,
	recommendationId=name,
	recommendationName=properties.displayName,
	source=properties.resourceDetails.Source,
	recommendationState=properties.status.code,
	description=properties.metadata.description,
	assessmentType=properties.metadata.assessmentType,
	remediationDescription=properties.metadata.remediationDescription,
	policyDefinitionId=properties.metadata.policyDefinitionId,
	implementationEffort=properties.metadata.implementationEffort,
	recommendationSeverity=properties.metadata.severity,
	category=properties.metadata.categories,
	userImpact=properties.metadata.userImpact,
	threats=properties.metadata.threats,
	portalLink=properties.links.azurePortal
| project tenantId, subscriptionId, resourceId, recommendationName, recommendationId, recommendationState, recommendationSeverity, description, remediationDescription, assessmentType, policyDefinitionId, implementationEffort, userImpact, category, threats, source, portalLink
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/assessments' | extend resourceId=id, recommendationId=name, recommendationName=properties.displayName, source=properties.resourceDetails.Source, recommendationState=properties.status.code, description=properties.metadata.description, assessmentType=properties.metadata.assessmentType, remediationDescription=properties.metadata.remediationDescription, policyDefinitionId=properties.metadata.policyDefinitionId, implementationEffort=properties.metadata.implementationEffort, recommendationSeverity=properties.metadata.severity, category=properties.metadata.categories, userImpact=properties.metadata.userImpact, threats=properties.metadata.threats, portalLink=properties.links.azurePortal | project tenantId, subscriptionId, resourceId, recommendationName, recommendationId, recommendationState, recommendationSeverity, description, remediationDescription, assessmentType, policyDefinitionId, implementationEffort, userImpact, category, threats, source, portalLink"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/assessments' | extend resourceId=id, recommendationId=name, recommendationName=properties.displayName, source=properties.resourceDetails.Source, recommendationState=properties.status.code, description=properties.metadata.description, assessmentType=properties.metadata.assessmentType, remediationDescription=properties.metadata.remediationDescription, policyDefinitionId=properties.metadata.policyDefinitionId, implementationEffort=properties.metadata.implementationEffort, recommendationSeverity=properties.metadata.severity, category=properties.metadata.categories, userImpact=properties.metadata.userImpact, threats=properties.metadata.threats, portalLink=properties.links.azurePortal | project tenantId, subscriptionId, resourceId, recommendationName, recommendationId, recommendationState, recommendationSeverity, description, remediationDescription, assessmentType, policyDefinitionId, implementationEffort, userImpact, category, threats, source, portalLink"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20extend%20resourceId%3did%2c%0a%09recommendationId%3dname%2c%0a%09recommendationName%3dproperties.displayName%2c%0a%09source%3dproperties.resourceDetails.Source%2c%0a%09recommendationState%3dproperties.status.code%2c%0a%09description%3dproperties.metadata.description%2c%0a%09assessmentType%3dproperties.metadata.assessmentType%2c%0a%09remediationDescription%3dproperties.metadata.remediationDescription%2c%0a%09policyDefinitionId%3dproperties.metadata.policyDefinitionId%2c%0a%09implementationEffort%3dproperties.metadata.implementationEffort%2c%0a%09recommendationSeverity%3dproperties.metadata.severity%2c%0a%09category%3dproperties.metadata.categories%2c%0a%09userImpact%3dproperties.metadata.userImpact%2c%0a%09threats%3dproperties.metadata.threats%2c%0a%09portalLink%3dproperties.links.azurePortal%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20resourceId%2c%20recommendationName%2c%20recommendationId%2c%20recommendationState%2c%20recommendationSeverity%2c%20description%2c%20remediationDescription%2c%20assessmentType%2c%20policyDefinitionId%2c%20implementationEffort%2c%20userImpact%2c%20category%2c%20threats%2c%20source%2c%20portalLink" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20extend%20resourceId%3did%2c%0a%09recommendationId%3dname%2c%0a%09recommendationName%3dproperties.displayName%2c%0a%09source%3dproperties.resourceDetails.Source%2c%0a%09recommendationState%3dproperties.status.code%2c%0a%09description%3dproperties.metadata.description%2c%0a%09assessmentType%3dproperties.metadata.assessmentType%2c%0a%09remediationDescription%3dproperties.metadata.remediationDescription%2c%0a%09policyDefinitionId%3dproperties.metadata.policyDefinitionId%2c%0a%09implementationEffort%3dproperties.metadata.implementationEffort%2c%0a%09recommendationSeverity%3dproperties.metadata.severity%2c%0a%09category%3dproperties.metadata.categories%2c%0a%09userImpact%3dproperties.metadata.userImpact%2c%0a%09threats%3dproperties.metadata.threats%2c%0a%09portalLink%3dproperties.links.azurePortal%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20resourceId%2c%20recommendationName%2c%20recommendationId%2c%20recommendationState%2c%20recommendationSeverity%2c%20description%2c%20remediationDescription%2c%20assessmentType%2c%20policyDefinitionId%2c%20implementationEffort%2c%20userImpact%2c%20category%2c%20threats%2c%20source%2c%20portalLink" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20extend%20resourceId%3did%2c%0a%09recommendationId%3dname%2c%0a%09recommendationName%3dproperties.displayName%2c%0a%09source%3dproperties.resourceDetails.Source%2c%0a%09recommendationState%3dproperties.status.code%2c%0a%09description%3dproperties.metadata.description%2c%0a%09assessmentType%3dproperties.metadata.assessmentType%2c%0a%09remediationDescription%3dproperties.metadata.remediationDescription%2c%0a%09policyDefinitionId%3dproperties.metadata.policyDefinitionId%2c%0a%09implementationEffort%3dproperties.metadata.implementationEffort%2c%0a%09recommendationSeverity%3dproperties.metadata.severity%2c%0a%09category%3dproperties.metadata.categories%2c%0a%09userImpact%3dproperties.metadata.userImpact%2c%0a%09threats%3dproperties.metadata.threats%2c%0a%09portalLink%3dproperties.links.azurePortal%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20resourceId%2c%20recommendationName%2c%20recommendationId%2c%20recommendationState%2c%20recommendationSeverity%2c%20description%2c%20remediationDescription%2c%20assessmentType%2c%20policyDefinitionId%2c%20implementationEffort%2c%20userImpact%2c%20category%2c%20threats%2c%20source%2c%20portalLink" target="_blank">portal.azure.cn</a>

---

### List Qualys vulnerability assessment results

Returns all the vulnerabilities found on virtual machines that have a Qualys agent installed.

```kusto
SecurityResources
| where type == 'microsoft.security/assessments'
| where * contains 'vulnerabilities in your virtual machines'
| summarize by assessmentKey=name //the ID of the assessment
| join kind=inner (
	securityresources
	| where type == 'microsoft.security/assessments/subassessments'
	| extend assessmentKey = extract('.*assessments/(.+?)/.*',1,  id)
) on assessmentKey
| project assessmentKey, subassessmentKey=name, id, parse_json(properties), resourceGroup, subscriptionId, tenantId
| extend description = properties.description,
	displayName = properties.displayName,
	resourceId = properties.resourceDetails.id,
	resourceSource = properties.resourceDetails.source,
	category = properties.category,
	severity = properties.status.severity,
	code = properties.status.code,
	timeGenerated = properties.timeGenerated,
	remediation = properties.remediation,
	impact = properties.impact,
	vulnId = properties.id,
	additionalData = properties.additionalData
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/assessments' | where * contains 'vulnerabilities in your virtual machines' | summarize by assessmentKey=name //the ID of the assessment | join kind=inner ( securityresources | where type == 'microsoft.security/assessments/subassessments' | extend assessmentKey = extract('.*assessments/(.+?)/.*',1, id) ) on assessmentKey | project assessmentKey, subassessmentKey=name, id, parse_json(properties), resourceGroup, subscriptionId, tenantId | extend description = properties.description, displayName = properties.displayName, resourceId = properties.resourceDetails.id, resourceSource = properties.resourceDetails.source, category = properties.category, severity = properties.status.severity, code = properties.status.code, timeGenerated = properties.timeGenerated, remediation = properties.remediation, impact = properties.impact, vulnId = properties.id, additionalData = properties.additionalData"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/assessments' | where * contains 'vulnerabilities in your virtual machines' | summarize by assessmentKey=name //the ID of the assessment | join kind=inner ( securityresources | where type == 'microsoft.security/assessments/subassessments' | extend assessmentKey = extract('.*assessments/(.+?)/.*',1, id) ) on assessmentKey | project assessmentKey, subassessmentKey=name, id, parse_json(properties), resourceGroup, subscriptionId, tenantId | extend description = properties.description, displayName = properties.displayName, resourceId = properties.resourceDetails.id, resourceSource = properties.resourceDetails.source, category = properties.category, severity = properties.status.severity, code = properties.status.code, timeGenerated = properties.timeGenerated, remediation = properties.remediation, impact = properties.impact, vulnId = properties.id, additionalData = properties.additionalData"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20where%20*%20contains%20%27vulnerabilities%20in%20your%20virtual%20machines%27%0a%7c%20summarize%20by%20assessmentKey%3dname%20%2f%2fthe%20ID%20of%20the%20assessment%0a%7c%20join%20kind%3dinner%20(%0a%09securityresources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%2fsubassessments%27%0a%09%7c%20extend%20assessmentKey%20%3d%20extract(%27.*assessments%2f(.%2b%3f)%2f.*%27%2c1%2c%20%20id)%0a)%20on%20assessmentKey%0a%7c%20project%20assessmentKey%2c%20subassessmentKey%3dname%2c%20id%2c%20parse_json(properties)%2c%20resourceGroup%2c%20subscriptionId%2c%20tenantId%0a%7c%20extend%20description%20%3d%20properties.description%2c%0a%09displayName%20%3d%20properties.displayName%2c%0a%09resourceId%20%3d%20properties.resourceDetails.id%2c%0a%09resourceSource%20%3d%20properties.resourceDetails.source%2c%0a%09category%20%3d%20properties.category%2c%0a%09severity%20%3d%20properties.status.severity%2c%0a%09code%20%3d%20properties.status.code%2c%0a%09timeGenerated%20%3d%20properties.timeGenerated%2c%0a%09remediation%20%3d%20properties.remediation%2c%0a%09impact%20%3d%20properties.impact%2c%0a%09vulnId%20%3d%20properties.id%2c%0a%09additionalData%20%3d%20properties.additionalData" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20where%20*%20contains%20%27vulnerabilities%20in%20your%20virtual%20machines%27%0a%7c%20summarize%20by%20assessmentKey%3dname%20%2f%2fthe%20ID%20of%20the%20assessment%0a%7c%20join%20kind%3dinner%20(%0a%09securityresources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%2fsubassessments%27%0a%09%7c%20extend%20assessmentKey%20%3d%20extract(%27.*assessments%2f(.%2b%3f)%2f.*%27%2c1%2c%20%20id)%0a)%20on%20assessmentKey%0a%7c%20project%20assessmentKey%2c%20subassessmentKey%3dname%2c%20id%2c%20parse_json(properties)%2c%20resourceGroup%2c%20subscriptionId%2c%20tenantId%0a%7c%20extend%20description%20%3d%20properties.description%2c%0a%09displayName%20%3d%20properties.displayName%2c%0a%09resourceId%20%3d%20properties.resourceDetails.id%2c%0a%09resourceSource%20%3d%20properties.resourceDetails.source%2c%0a%09category%20%3d%20properties.category%2c%0a%09severity%20%3d%20properties.status.severity%2c%0a%09code%20%3d%20properties.status.code%2c%0a%09timeGenerated%20%3d%20properties.timeGenerated%2c%0a%09remediation%20%3d%20properties.remediation%2c%0a%09impact%20%3d%20properties.impact%2c%0a%09vulnId%20%3d%20properties.id%2c%0a%09additionalData%20%3d%20properties.additionalData" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20where%20*%20contains%20%27vulnerabilities%20in%20your%20virtual%20machines%27%0a%7c%20summarize%20by%20assessmentKey%3dname%20%2f%2fthe%20ID%20of%20the%20assessment%0a%7c%20join%20kind%3dinner%20(%0a%09securityresources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%2fsubassessments%27%0a%09%7c%20extend%20assessmentKey%20%3d%20extract(%27.*assessments%2f(.%2b%3f)%2f.*%27%2c1%2c%20%20id)%0a)%20on%20assessmentKey%0a%7c%20project%20assessmentKey%2c%20subassessmentKey%3dname%2c%20id%2c%20parse_json(properties)%2c%20resourceGroup%2c%20subscriptionId%2c%20tenantId%0a%7c%20extend%20description%20%3d%20properties.description%2c%0a%09displayName%20%3d%20properties.displayName%2c%0a%09resourceId%20%3d%20properties.resourceDetails.id%2c%0a%09resourceSource%20%3d%20properties.resourceDetails.source%2c%0a%09category%20%3d%20properties.category%2c%0a%09severity%20%3d%20properties.status.severity%2c%0a%09code%20%3d%20properties.status.code%2c%0a%09timeGenerated%20%3d%20properties.timeGenerated%2c%0a%09remediation%20%3d%20properties.remediation%2c%0a%09impact%20%3d%20properties.impact%2c%0a%09vulnId%20%3d%20properties.id%2c%0a%09additionalData%20%3d%20properties.additionalData" target="_blank">portal.azure.cn</a>

---

### Regulatory compliance assessments state

Returns regulatory compliance assessments state per compliance standard and control.

```kusto
SecurityResources
| where type == 'microsoft.security/regulatorycompliancestandards/regulatorycompliancecontrols/regulatorycomplianceassessments'
| extend assessmentName=properties.description,
	complianceStandard=extract(@'/regulatoryComplianceStandards/(.+)/regulatoryComplianceControls',1,id),
	complianceControl=extract(@'/regulatoryComplianceControls/(.+)/regulatoryComplianceAssessments',1,id),
	skippedResources=properties.skippedResources,
	passedResources=properties.passedResources,
	failedResources=properties.failedResources,
	state=properties.state
| project tenantId, subscriptionId, id, complianceStandard, complianceControl, assessmentName, state, skippedResources, passedResources, failedResources
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/regulatorycompliancestandards/regulatorycompliancecontrols/regulatorycomplianceassessments' | extend assessmentName=properties.description, complianceStandard=extract(@'/regulatoryComplianceStandards/(.+)/regulatoryComplianceControls',1,id), complianceControl=extract(@'/regulatoryComplianceControls/(.+)/regulatoryComplianceAssessments',1,id), skippedResources=properties.skippedResources, passedResources=properties.passedResources, failedResources=properties.failedResources, state=properties.state | project tenantId, subscriptionId, id, complianceStandard, complianceControl, assessmentName, state, skippedResources, passedResources, failedResources"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/regulatorycompliancestandards/regulatorycompliancecontrols/regulatorycomplianceassessments' | extend assessmentName=properties.description, complianceStandard=extract(@'/regulatoryComplianceStandards/(.+)/regulatoryComplianceControls',1,id), complianceControl=extract(@'/regulatoryComplianceControls/(.+)/regulatoryComplianceAssessments',1,id), skippedResources=properties.skippedResources, passedResources=properties.passedResources, failedResources=properties.failedResources, state=properties.state | project tenantId, subscriptionId, id, complianceStandard, complianceControl, assessmentName, state, skippedResources, passedResources, failedResources"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fregulatorycompliancestandards%2fregulatorycompliancecontrols%2fregulatorycomplianceassessments%27%0a%7c%20extend%20assessmentName%3dproperties.description%2c%0a%09complianceStandard%3dextract(%40%27%2fregulatoryComplianceStandards%2f(.%2b)%2fregulatoryComplianceControls%27%2c1%2cid)%2c%0a%09complianceControl%3dextract(%40%27%2fregulatoryComplianceControls%2f(.%2b)%2fregulatoryComplianceAssessments%27%2c1%2cid)%2c%0a%09skippedResources%3dproperties.skippedResources%2c%0a%09passedResources%3dproperties.passedResources%2c%0a%09failedResources%3dproperties.failedResources%2c%0a%09state%3dproperties.state%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20id%2c%20complianceStandard%2c%20complianceControl%2c%20assessmentName%2c%20state%2c%20skippedResources%2c%20passedResources%2c%20failedResources" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fregulatorycompliancestandards%2fregulatorycompliancecontrols%2fregulatorycomplianceassessments%27%0a%7c%20extend%20assessmentName%3dproperties.description%2c%0a%09complianceStandard%3dextract(%40%27%2fregulatoryComplianceStandards%2f(.%2b)%2fregulatoryComplianceControls%27%2c1%2cid)%2c%0a%09complianceControl%3dextract(%40%27%2fregulatoryComplianceControls%2f(.%2b)%2fregulatoryComplianceAssessments%27%2c1%2cid)%2c%0a%09skippedResources%3dproperties.skippedResources%2c%0a%09passedResources%3dproperties.passedResources%2c%0a%09failedResources%3dproperties.failedResources%2c%0a%09state%3dproperties.state%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20id%2c%20complianceStandard%2c%20complianceControl%2c%20assessmentName%2c%20state%2c%20skippedResources%2c%20passedResources%2c%20failedResources" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fregulatorycompliancestandards%2fregulatorycompliancecontrols%2fregulatorycomplianceassessments%27%0a%7c%20extend%20assessmentName%3dproperties.description%2c%0a%09complianceStandard%3dextract(%40%27%2fregulatoryComplianceStandards%2f(.%2b)%2fregulatoryComplianceControls%27%2c1%2cid)%2c%0a%09complianceControl%3dextract(%40%27%2fregulatoryComplianceControls%2f(.%2b)%2fregulatoryComplianceAssessments%27%2c1%2cid)%2c%0a%09skippedResources%3dproperties.skippedResources%2c%0a%09passedResources%3dproperties.passedResources%2c%0a%09failedResources%3dproperties.failedResources%2c%0a%09state%3dproperties.state%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20id%2c%20complianceStandard%2c%20complianceControl%2c%20assessmentName%2c%20state%2c%20skippedResources%2c%20passedResources%2c%20failedResources" target="_blank">portal.azure.cn</a>

---

### Regulatory compliance state per compliance standard

Returns regulatory compliance state per compliance standard per subscription.

```kusto
SecurityResources
| where type == 'microsoft.security/regulatorycompliancestandards'
| extend complianceStandard=name,
	state=properties.state,
	passedControls=properties.passedControls,
	failedControls=properties.failedControls,
	skippedControls=properties.skippedControls,
	unsupportedControls=properties.unsupportedControls
| project tenantId, subscriptionId, complianceStandard, state, passedControls, failedControls, skippedControls, unsupportedControls
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/regulatorycompliancestandards' | extend complianceStandard=name, state=properties.state, passedControls=properties.passedControls, failedControls=properties.failedControls, skippedControls=properties.skippedControls, unsupportedControls=properties.unsupportedControls | project tenantId, subscriptionId, complianceStandard, state, passedControls, failedControls, skippedControls, unsupportedControls"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/regulatorycompliancestandards' | extend complianceStandard=name, state=properties.state, passedControls=properties.passedControls, failedControls=properties.failedControls, skippedControls=properties.skippedControls, unsupportedControls=properties.unsupportedControls | project tenantId, subscriptionId, complianceStandard, state, passedControls, failedControls, skippedControls, unsupportedControls"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fregulatorycompliancestandards%27%0a%7c%20extend%20complianceStandard%3dname%2c%0a%09state%3dproperties.state%2c%0a%09passedControls%3dproperties.passedControls%2c%0a%09failedControls%3dproperties.failedControls%2c%0a%09skippedControls%3dproperties.skippedControls%2c%0a%09unsupportedControls%3dproperties.unsupportedControls%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20complianceStandard%2c%20state%2c%20passedControls%2c%20failedControls%2c%20skippedControls%2c%20unsupportedControls" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fregulatorycompliancestandards%27%0a%7c%20extend%20complianceStandard%3dname%2c%0a%09state%3dproperties.state%2c%0a%09passedControls%3dproperties.passedControls%2c%0a%09failedControls%3dproperties.failedControls%2c%0a%09skippedControls%3dproperties.skippedControls%2c%0a%09unsupportedControls%3dproperties.unsupportedControls%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20complianceStandard%2c%20state%2c%20passedControls%2c%20failedControls%2c%20skippedControls%2c%20unsupportedControls" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fregulatorycompliancestandards%27%0a%7c%20extend%20complianceStandard%3dname%2c%0a%09state%3dproperties.state%2c%0a%09passedControls%3dproperties.passedControls%2c%0a%09failedControls%3dproperties.failedControls%2c%0a%09skippedControls%3dproperties.skippedControls%2c%0a%09unsupportedControls%3dproperties.unsupportedControls%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20complianceStandard%2c%20state%2c%20passedControls%2c%20failedControls%2c%20skippedControls%2c%20unsupportedControls" target="_blank">portal.azure.cn</a>

---

### Secure score per management group

Returns secure score per management group.

```kusto
SecurityResources
| where type == 'microsoft.security/securescores'
| project subscriptionId,
	subscriptionTotal = iff(properties.score.max == 0, 0.00, round(tolong(properties.weight) * todouble(properties.score.current)/tolong(properties.score.max),2)),
	weight = tolong(iff(properties.weight == 0, 1, properties.weight))
| join kind=leftouter (
	ResourceContainers
	| where type == 'microsoft.resources/subscriptions' and properties.state == 'Enabled'
	| project subscriptionId, mgChain=properties.managementGroupAncestorsChain )
	on subscriptionId
| mv-expand mg=mgChain
| summarize sumSubs = sum(subscriptionTotal), sumWeight = sum(weight), resultsNum = count() by tostring(mg.displayName), mgId = tostring(mg.name)
| extend secureScore = iff(tolong(resultsNum) == 0, 404.00, round(sumSubs/sumWeight*100,2))
| project mgName=mg_displayName, mgId, sumSubs, sumWeight, resultsNum, secureScore
| order by mgName asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/securescores' | project subscriptionId, subscriptionTotal = iff(properties.score.max == 0, 0.00, round(tolong(properties.weight) * todouble(properties.score.current)/tolong(properties.score.max),2)), weight = tolong(iff(properties.weight == 0, 1, properties.weight)) | join kind=leftouter ( ResourceContainers | where type == 'microsoft.resources/subscriptions' and properties.state == 'Enabled' | project subscriptionId, mgChain=properties.managementGroupAncestorsChain ) on subscriptionId | mv-expand mg=mgChain | summarize sumSubs = sum(subscriptionTotal), sumWeight = sum(weight), resultsNum = count() by tostring(mg.displayName), mgId = tostring(mg.name) | extend secureScore = iff(tolong(resultsNum) == 0, 404.00, round(sumSubs/sumWeight*100,2)) | project mgName=mg_displayName, mgId, sumSubs, sumWeight, resultsNum, secureScore | order by mgName asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/securescores' | project subscriptionId, subscriptionTotal = iff(properties.score.max == 0, 0.00, round(tolong(properties.weight) * todouble(properties.score.current)/tolong(properties.score.max),2)), weight = tolong(iff(properties.weight == 0, 1, properties.weight)) | join kind=leftouter ( ResourceContainers | where type == 'microsoft.resources/subscriptions' and properties.state == 'Enabled' | project subscriptionId, mgChain=properties.managementGroupAncestorsChain ) on subscriptionId | mv-expand mg=mgChain | summarize sumSubs = sum(subscriptionTotal), sumWeight = sum(weight), resultsNum = count() by tostring(mg.displayName), mgId = tostring(mg.name) | extend secureScore = iff(tolong(resultsNum) == 0, 404.00, round(sumSubs/sumWeight*100,2)) | project mgName=mg_displayName, mgId, sumSubs, sumWeight, resultsNum, secureScore | order by mgName asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fsecurescores%27%0a%7c%20project%20subscriptionId%2c%0a%09subscriptionTotal%20%3d%20iff(properties.score.max%20%3d%3d%200%2c%200.00%2c%20round(tolong(properties.weight)%20*%20todouble(properties.score.current)%2ftolong(properties.score.max)%2c2))%2c%0a%09weight%20%3d%20tolong(iff(properties.weight%20%3d%3d%200%2c%201%2c%20properties.weight))%0a%7c%20join%20kind%3dleftouter%20(%0a%09ResourceContainers%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.resources%2fsubscriptions%27%20and%20properties.state%20%3d%3d%20%27Enabled%27%0a%09%7c%20project%20subscriptionId%2c%20mgChain%3dproperties.managementGroupAncestorsChain%20)%0a%09on%20subscriptionId%0a%7c%20mv-expand%20mg%3dmgChain%0a%7c%20summarize%20sumSubs%20%3d%20sum(subscriptionTotal)%2c%20sumWeight%20%3d%20sum(weight)%2c%20resultsNum%20%3d%20count()%20by%20tostring(mg.displayName)%2c%20mgId%20%3d%20tostring(mg.name)%0a%7c%20extend%20secureScore%20%3d%20iff(tolong(resultsNum)%20%3d%3d%200%2c%20404.00%2c%20round(sumSubs%2fsumWeight*100%2c2))%0a%7c%20project%20mgName%3dmg_displayName%2c%20mgId%2c%20sumSubs%2c%20sumWeight%2c%20resultsNum%2c%20secureScore%0a%7c%20order%20by%20mgName%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fsecurescores%27%0a%7c%20project%20subscriptionId%2c%0a%09subscriptionTotal%20%3d%20iff(properties.score.max%20%3d%3d%200%2c%200.00%2c%20round(tolong(properties.weight)%20*%20todouble(properties.score.current)%2ftolong(properties.score.max)%2c2))%2c%0a%09weight%20%3d%20tolong(iff(properties.weight%20%3d%3d%200%2c%201%2c%20properties.weight))%0a%7c%20join%20kind%3dleftouter%20(%0a%09ResourceContainers%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.resources%2fsubscriptions%27%20and%20properties.state%20%3d%3d%20%27Enabled%27%0a%09%7c%20project%20subscriptionId%2c%20mgChain%3dproperties.managementGroupAncestorsChain%20)%0a%09on%20subscriptionId%0a%7c%20mv-expand%20mg%3dmgChain%0a%7c%20summarize%20sumSubs%20%3d%20sum(subscriptionTotal)%2c%20sumWeight%20%3d%20sum(weight)%2c%20resultsNum%20%3d%20count()%20by%20tostring(mg.displayName)%2c%20mgId%20%3d%20tostring(mg.name)%0a%7c%20extend%20secureScore%20%3d%20iff(tolong(resultsNum)%20%3d%3d%200%2c%20404.00%2c%20round(sumSubs%2fsumWeight*100%2c2))%0a%7c%20project%20mgName%3dmg_displayName%2c%20mgId%2c%20sumSubs%2c%20sumWeight%2c%20resultsNum%2c%20secureScore%0a%7c%20order%20by%20mgName%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fsecurescores%27%0a%7c%20project%20subscriptionId%2c%0a%09subscriptionTotal%20%3d%20iff(properties.score.max%20%3d%3d%200%2c%200.00%2c%20round(tolong(properties.weight)%20*%20todouble(properties.score.current)%2ftolong(properties.score.max)%2c2))%2c%0a%09weight%20%3d%20tolong(iff(properties.weight%20%3d%3d%200%2c%201%2c%20properties.weight))%0a%7c%20join%20kind%3dleftouter%20(%0a%09ResourceContainers%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.resources%2fsubscriptions%27%20and%20properties.state%20%3d%3d%20%27Enabled%27%0a%09%7c%20project%20subscriptionId%2c%20mgChain%3dproperties.managementGroupAncestorsChain%20)%0a%09on%20subscriptionId%0a%7c%20mv-expand%20mg%3dmgChain%0a%7c%20summarize%20sumSubs%20%3d%20sum(subscriptionTotal)%2c%20sumWeight%20%3d%20sum(weight)%2c%20resultsNum%20%3d%20count()%20by%20tostring(mg.displayName)%2c%20mgId%20%3d%20tostring(mg.name)%0a%7c%20extend%20secureScore%20%3d%20iff(tolong(resultsNum)%20%3d%3d%200%2c%20404.00%2c%20round(sumSubs%2fsumWeight*100%2c2))%0a%7c%20project%20mgName%3dmg_displayName%2c%20mgId%2c%20sumSubs%2c%20sumWeight%2c%20resultsNum%2c%20secureScore%0a%7c%20order%20by%20mgName%20asc" target="_blank">portal.azure.cn</a>

---

### Secure score per subscription

Returns secure score per subscription.

```kusto
SecurityResources
| where type == 'microsoft.security/securescores'
| extend percentageScore=properties.score.percentage,
	currentScore=properties.score.current,
	maxScore=properties.score.max,
	weight=properties.weight
| project tenantId, subscriptionId, percentageScore, currentScore, maxScore, weight
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/securescores' | extend percentageScore=properties.score.percentage, currentScore=properties.score.current, maxScore=properties.score.max, weight=properties.weight | project tenantId, subscriptionId, percentageScore, currentScore, maxScore, weight"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/securescores' | extend percentageScore=properties.score.percentage, currentScore=properties.score.current, maxScore=properties.score.max, weight=properties.weight | project tenantId, subscriptionId, percentageScore, currentScore, maxScore, weight"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fsecurescores%27%0a%7c%20extend%20percentageScore%3dproperties.score.percentage%2c%0a%09currentScore%3dproperties.score.current%2c%0a%09maxScore%3dproperties.score.max%2c%0a%09weight%3dproperties.weight%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20percentageScore%2c%20currentScore%2c%20maxScore%2c%20weight" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fsecurescores%27%0a%7c%20extend%20percentageScore%3dproperties.score.percentage%2c%0a%09currentScore%3dproperties.score.current%2c%0a%09maxScore%3dproperties.score.max%2c%0a%09weight%3dproperties.weight%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20percentageScore%2c%20currentScore%2c%20maxScore%2c%20weight" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fsecurescores%27%0a%7c%20extend%20percentageScore%3dproperties.score.percentage%2c%0a%09currentScore%3dproperties.score.current%2c%0a%09maxScore%3dproperties.score.max%2c%0a%09weight%3dproperties.weight%0a%7c%20project%20tenantId%2c%20subscriptionId%2c%20percentageScore%2c%20currentScore%2c%20maxScore%2c%20weight" target="_blank">portal.azure.cn</a>

---

### Show Defender for Cloud plan pricing tier per subscription

Returns Defender for Cloud plan pricing tier plan per subscription.

```kusto
SecurityResources
| where type == 'microsoft.security/pricings'
| project Subscription= subscriptionId, Azure_Defender_plan= name, Status= properties.pricingTier
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "SecurityResources | where type == 'microsoft.security/pricings' | project Subscription= subscriptionId, Azure_Defender_plan= name, Status= properties.pricingTier"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "SecurityResources | where type == 'microsoft.security/pricings' | project Subscription= subscriptionId, Azure_Defender_plan= name, Status= properties.pricingTier"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fpricings%27%0a%7c%20project%20Subscription%3d%20subscriptionId%2c%20Azure_Defender_plan%3d%20name%2c%20Status%3d%20properties.pricingTier" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fpricings%27%0a%7c%20project%20Subscription%3d%20subscriptionId%2c%20Azure_Defender_plan%3d%20name%2c%20Status%3d%20properties.pricingTier" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fpricings%27%0a%7c%20project%20Subscription%3d%20subscriptionId%2c%20Azure_Defender_plan%3d%20name%2c%20Status%3d%20properties.pricingTier" target="_blank">portal.azure.cn</a>

---

