---
ms.service: resource-graph
ms.topic: include
ms.date: 08/24/2023
author: danielkim916
ms.author: danielkim
---

### Get classic administrators with key properties

Provides a sample of [classic administrators](../../../../role-based-access-control/classic-administrators.md) and some of the resources relevant properties.

```kusto
authorizationresources
| where type =~ 'microsoft.authorization/classicadministrators'
| extend state = properties.adminState
| extend roles = split(properties.role, ';')
| take 5
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "authorizationresources | where type =~ 'microsoft.authorization/classicadministrators' | extend state = properties.adminState | extend roles = split(properties.role, ';') | take 5"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "authorizationresources | where type =~ 'microsoft.authorization/classicadministrators' | extend state = properties.adminState | extend roles = split(properties.role, ';') | take 5"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Fclassicadministrators%27%0A%7C%20extend%20state%20%3D%20properties.adminState%0A%7C%20extend%20roles%20%3D%20split%28properties.role%2C%20%27%3B%27%29%0A%7C%20take%205" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Fclassicadministrators%27%0A%7C%20extend%20state%20%3D%20properties.adminState%0A%7C%20extend%20roles%20%3D%20split%28properties.role%2C%20%27%3B%27%29%0A%7C%20take%205" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0A%7C%20where%20type%20%3D~%20%27microsoft.authorization%2Fclassicadministrators%27%0A%7C%20extend%20state%20%3D%20properties.adminState%0A%7C%20extend%20roles%20%3D%20split%28properties.role%2C%20%27%3B%27%29%0A%7C%20take%205" target="_blank">portal.azure.cn</a>

---
