---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 07/07/2022
ms.author: davidsmatlak
ms.custom: generated
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
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SecurityResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%27%0a%7c%20where%20properties.displayName%20contains%20%27Container%20registry%20images%20should%20have%20vulnerability%20findings%20resolved%27%0a%7c%20summarize%20by%20assessmentKey%3dname%20%2f%2fthe%20ID%20of%20the%20assessment%0a%7c%20join%20kind%3dinner%20(%0a%09securityresources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.security%2fassessments%2fsubassessments%27%0a%09%7c%20extend%20assessmentKey%20%3d%20extract(%27.*assessments%2f(.%2b%3f)%2f.*%27%2c1%2c%20%20id)%0a)%20on%20assessmentKey%0a%7c%20project%20assessmentKey%2c%20subassessmentKey%3dname%2c%20id%2c%20parse_json(properties)%2c%20resourceGroup%2c%20subscriptionId%2c%20tenantId%0a%7c%20extend%20description%20%3d%20properties.description%2c%0a%09displayName%20%3d%20properties.displayName%2c%0a%09resourceId%20%3d%20properties.resourceDetails.id%2c%0a%09resourceSource%20%3d%20properties.resourceDetails.source%2c%0a%09category%20%3d%20properties.category%2c%0a%09severity%20%3d%20properties.status.severity%2c%0a%09code%20%3d%20properties.status.code%2c%0a%09timeGenerated%20%3d%20properties.timeGenerated%2c%0a%09remediation%20%3d%20properties.remediation%2c%0a%09impact%20%3d%20properties.impact%2c%0a%09vulnId%20%3d%20properties.id%2c%0a%09additionalData%20%3d%20properties.additionalData" target="_blank">portal.azure.cn</a>

---

