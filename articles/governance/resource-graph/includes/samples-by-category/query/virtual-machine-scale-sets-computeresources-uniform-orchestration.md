---
ms.service: resource-graph
ms.topic: include
ms.date: 05/30/2023
author: jaspkaur28
ms.author: jaspkaur
---

### Virtual Machine Scale Set Uniform orchestration

Get virtual machines in the Virtual Machine Scale Sets (VMSS) Uniform orchestration mode categorized according to their power state. This table contains the model view and `powerState` in the instance view properties for the virtual machines part of Virtual Machine Scale Set Uniform mode.

The model view and `powerState` in the instance view properties for the virtual machines part of Virtual Machine Scale Set Flexible mode can be queried through `Resources` table.

```kusto
ComputeResources
| where type =~ 'microsoft.compute/virtualmachinescalesets/virtualmachines'
| extend powerState = properties.extended.instanceView.powerState.code
| project name, powerState, id
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ComputeResources | where type =~ 'microsoft.compute/virtualmachinescalesets/virtualmachines' | extend powerState = properties.extended.instanceView.powerState.code | project name, powerState, id"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ComputeResources | where type =~ 'microsoft.compute/virtualmachinescalesets/virtualmachines' | extend powerState = properties.extended.instanceView.powerState.code | project name, powerState, id"
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/ComputeResources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fvirtualmachinescalesets%2Fvirtualmachines%27%0D%0A%7C%20extend%20powerState%20%3D%20properties.extended.instanceView.powerState.code%0D%0A%7C%20project%20name%2C%20powerState%2C%20id" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/#blade/HubsExtension/ArgQueryBlade/query/ComputeResources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fvirtualmachinescalesets%2Fvirtualmachines%27%0D%0A%7C%20extend%20powerState%20%3D%20properties.extended.instanceView.powerState.code%0D%0A%7C%20project%20name%2C%20powerState%2C%20id" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/#blade/HubsExtension/ArgQueryBlade/query/ComputeResources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fvirtualmachinescalesets%2Fvirtualmachines%27%0D%0A%7C%20extend%20powerState%20%3D%20properties.extended.instanceView.powerState.code%0D%0A%7C%20project%20name%2C%20powerState%2C%20id" target="_blank">portal.azure.cn</a>

---
