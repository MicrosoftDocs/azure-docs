---
ms.service: resource-graph
ms.topic: include
ms.date: 03/20/2024
author: davidsmatlak
ms.author: davidsmatlak
---

### Virtual Machine Scale Set Flexible orchestration

Get Virtual Machine Scale Set Flexible orchestration mode VMs categorized according to their power state. This table contains the model view and `powerState` in the instance view properties for the virtual machines part of Virtual Machine Scale Set Flexible mode.

```kusto
Resources
| where type == 'microsoft.compute/virtualmachines'
| extend powerState = tostring(properties.extended.instanceView.powerState.code)
| extend VMSS = tostring(properties.virtualMachineScaleSet.id)
| where isnotempty(VMSS)
| project name, powerState, id
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type == 'microsoft.compute/virtualmachines' | extend powerState = tostring(properties.extended.instanceView.powerState.code) | extend VMSS = tostring(properties.virtualMachineScaleSet.id) | where isnotempty(VMSS) | project name, powerState, id"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type == 'microsoft.compute/virtualmachines' | extend powerState = tostring(properties.extended.instanceView.powerState.code) | extend VMSS = tostring(properties.virtualMachineScaleSet.id) | where isnotempty(VMSS) | project name, powerState, id"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.compute%2Fvirtualmachines%27%0D%0A%7C%20extend%20powerState%20%3D%20tostring%28properties.extended.instanceView.powerState.code%29%0D%0A%7C%20extend%20VMSS%20%3D%20tostring%28properties.virtualMachineScaleSet.id%29%0D%0A%7C%20where%20isnotempty%28VMSS%29%0D%0A%7C%20project%20name%2C%20powerState%2C%20id" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.compute%2Fvirtualmachines%27%0D%0A%7C%20extend%20powerState%20%3D%20tostring%28properties.extended.instanceView.powerState.code%29%0D%0A%7C%20extend%20VMSS%20%3D%20tostring%28properties.virtualMachineScaleSet.id%29%0D%0A%7C%20where%20isnotempty%28VMSS%29%0D%0A%7C%20project%20name%2C%20powerState%2C%20id" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.compute%2Fvirtualmachines%27%0D%0A%7C%20extend%20powerState%20%3D%20tostring%28properties.extended.instanceView.powerState.code%29%0D%0A%7C%20extend%20VMSS%20%3D%20tostring%28properties.virtualMachineScaleSet.id%29%0D%0A%7C%20where%20isnotempty%28VMSS%29%0D%0A%7C%20project%20name%2C%20powerState%2C%20id" target="_blank">portal.azure.cn</a>

---
