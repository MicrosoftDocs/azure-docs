---
ms.service: resource-graph
ms.topic: include
ms.date: 07/10/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### Get role assignments with key properties

Provides a sample of [role assignments](../../../../role-based-access-control/role-assignments.md) and some of the resources relevant properties.

```kusto
authorizationresources
| where type =~ 'microsoft.authorization/roleassignments'
| extend roleDefinitionId = properties.roleDefinitionId
| extend principalType = properties.principalType
| extend principalId = properties.principalId
| extend scope = properties.scope
| take 5
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "authorizationresources | where type =~ 'microsoft.authorization/roleassignments' | extend roleDefinitionId = properties.roleDefinitionId | extend principalType = properties.principalType | extend principalId = properties.principalId | extend scope = properties.scope | take 5"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "authorizationresources | where type =~ 'microsoft.authorization/roleassignments' | extend roleDefinitionId = properties.roleDefinitionId | extend principalType = properties.principalType | extend principalId = properties.principalId | extend scope = properties.scope | take 5"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Froleassignments%27%0A%7C%20extend%20roleDefinitionId%20%3D%20properties.roleDefinitionId%0A%7C%20extend%20principalType%20%3D%20properties.principalType%0A%7C%20extend%20principalId%20%3D%20properties.principalId%0A%7C%20extend%20scope%20%3D%20properties.scope%0A%7C%20take%205" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Froleassignments%27%0A%7C%20extend%20roleDefinitionId%20%3D%20properties.roleDefinitionId%0A%7C%20extend%20principalType%20%3D%20properties.principalType%0A%7C%20extend%20principalId%20%3D%20properties.principalId%0A%7C%20extend%20scope%20%3D%20properties.scope%0A%7C%20take%205" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Froleassignments%27%0A%7C%20extend%20roleDefinitionId%20%3D%20properties.roleDefinitionId%0A%7C%20extend%20principalType%20%3D%20properties.principalType%0A%7C%20extend%20principalId%20%3D%20properties.principalId%0A%7C%20extend%20scope%20%3D%20properties.scope%0A%7C%20take%205" target="_blank">portal.azure.cn</a>

---
