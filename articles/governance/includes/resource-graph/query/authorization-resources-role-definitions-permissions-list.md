---
ms.service: resource-graph
ms.topic: include
ms.date: 07/10/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### Get role definitions with permissions listed out

Displays a summary of the `Actions` and `notActions` for each unique role definition.

```kusto
authorizationresources
| where type =~ 'microsoft.authorization/roledefinitions'
| extend assignableScopes = properties.assignableScopes
| extend permissionsList = properties.permissions
| extend isServiceRole = properties.isServiceRole
| mv-expand permissionsList
| extend Actions = permissionsList.Actions
| extend notActions = permissionsList.notActions
| extend DataActions = permissionsList.DataActions
| extend notDataActions = permissionsList.notDataActions
| summarize make_set(Actions), make_set(notActions), make_set(DataActions), make_set(notDataActions), any(assignableScopes, isServiceRole) by id
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "authorizationresources | where type =~ 'microsoft.authorization/roledefinitions' | extend assignableScopes = properties.assignableScopes | extend permissionsList = properties.permissions | extend isServiceRole = properties.isServiceRole | mv-expand permissionsList | extend Actions = permissionsList.Actions | extend notActions = permissionsList.notActions | extend DataActions = permissionsList.DataActions | extend notDataActions = permissionsList.notDataActions | summarize make_set(Actions), make_set(notActions), make_set(DataActions), make_set(notDataActions), any(assignableScopes, isServiceRole) by id"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "authorizationresources | where type =~ 'microsoft.authorization/roledefinitions' | extend assignableScopes = properties.assignableScopes | extend permissionsList = properties.permissions | extend isServiceRole = properties.isServiceRole | mv-expand permissionsList | extend Actions = permissionsList.Actions | extend notActions = permissionsList.notActions | extend DataActions = permissionsList.DataActions | extend notDataActions = permissionsList.notDataActions | summarize make_set(Actions), make_set(notActions), make_set(DataActions), make_set(notDataActions), any(assignableScopes, isServiceRole) by id"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Froledefinitions%27%0A%7C%20extend%20assignableScopes%20%3D%20properties.assignableScopes%0A%7C%20extend%20permissionsList%20%3D%20properties.permissions%0A%7C%20extend%20isServiceRole%20%3D%20properties.isServiceRole%0A%7C%20mv-expand%20permissionsList%0A%7C%20extend%20Actions%20%3D%20permissionsList.Actions%0A%7C%20extend%20notActions%20%3D%20permissionsList.notActions%0A%7C%20extend%20DataActions%20%3D%20permissionsList.DataActions%0A%7C%20extend%20notDataActions%20%3D%20permissionsList.notDataActions%0A%7C%20summarize%20make_set%28Actions%29%2C%20make_set%28notActions%29%2C%20make_set%28DataActions%29%2C%20make_set%28notDataActions%29%2C%20any%28assignableScopes%2C%20isServiceRole%29%20by%20id" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Froledefinitions%27%0A%7C%20extend%20assignableScopes%20%3D%20properties.assignableScopes%0A%7C%20extend%20permissionsList%20%3D%20properties.permissions%0A%7C%20extend%20isServiceRole%20%3D%20properties.isServiceRole%0A%7C%20mv-expand%20permissionsList%0A%7C%20extend%20Actions%20%3D%20permissionsList.Actions%0A%7C%20extend%20notActions%20%3D%20permissionsList.notActions%0A%7C%20extend%20DataActions%20%3D%20permissionsList.DataActions%0A%7C%20extend%20notDataActions%20%3D%20permissionsList.notDataActions%0A%7C%20summarize%20make_set%28Actions%29%2C%20make_set%28notActions%29%2C%20make_set%28DataActions%29%2C%20make_set%28notDataActions%29%2C%20any%28assignableScopes%2C%20isServiceRole%29%20by%20id" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Froledefinitions%27%0A%7C%20extend%20assignableScopes%20%3D%20properties.assignableScopes%0A%7C%20extend%20permissionsList%20%3D%20properties.permissions%0A%7C%20extend%20isServiceRole%20%3D%20properties.isServiceRole%0A%7C%20mv-expand%20permissionsList%0A%7C%20extend%20Actions%20%3D%20permissionsList.Actions%0A%7C%20extend%20notActions%20%3D%20permissionsList.notActions%0A%7C%20extend%20DataActions%20%3D%20permissionsList.DataActions%0A%7C%20extend%20notDataActions%20%3D%20permissionsList.notDataActions%0A%7C%20summarize%20make_set%28Actions%29%2C%20make_set%28notActions%29%2C%20make_set%28DataActions%29%2C%20make_set%28notDataActions%29%2C%20any%28assignableScopes%2C%20isServiceRole%29%20by%20id" target="_blank">portal.azure.cn</a>

---
