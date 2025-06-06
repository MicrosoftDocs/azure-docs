---
ms.service: resource-graph
ms.topic: include
ms.date: 07/10/2023
author: jaspkaur28
ms.author: jaspkaur
---

### Get role definitions with key properties

Provides a sample of [role definitions](/azure/role-based-access-control/role-definitions) and some of the resources relevant properties.

```kusto
authorizationresources
| where type =~ 'microsoft.authorization/roledefinitions'
| extend assignableScopes = properties.assignableScopes
| extend permissionsList = properties.permissions
| extend isServiceRole = properties.isServiceRole
| take 5
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "authorizationresources | where type =~ 'microsoft.authorization/roledefinitions' | extend assignableScopes = properties.assignableScopes | extend permissionsList = properties.permissions | extend isServiceRole = properties.isServiceRole | take 5"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "authorizationresources | where type =~ 'microsoft.authorization/roledefinitions' | extend assignableScopes = properties.assignableScopes | extend permissionsList = properties.permissions | extend isServiceRole = properties.isServiceRole | take 5"
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Froledefinitions%27%0A%7C%20extend%20assignableScopes%20%3D%20properties.assignableScopes%0A%7C%20extend%20permissionsList%20%3D%20properties.permissions%0A%7C%20extend%20isServiceRole%20%3D%20properties.isServiceRole%0A%7C%20take%205" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Froledefinitions%27%0A%7C%20extend%20assignableScopes%20%3D%20properties.assignableScopes%0A%7C%20extend%20permissionsList%20%3D%20properties.permissions%0A%7C%20extend%20isServiceRole%20%3D%20properties.isServiceRole%0A%7C%20take%205" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Froledefinitions%27%0A%7C%20extend%20assignableScopes%20%3D%20properties.assignableScopes%0A%7C%20extend%20permissionsList%20%3D%20properties.permissions%0A%7C%20extend%20isServiceRole%20%3D%20properties.isServiceRole%0A%7C%20take%205" target="_blank">portal.azure.cn</a>

---
