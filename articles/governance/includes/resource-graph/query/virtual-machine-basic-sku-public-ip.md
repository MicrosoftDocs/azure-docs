---
ms.service: resource-graph
ms.topic: include
ms.date: 08/11/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### Show virtual machines with Basic SKU public IP addresses

This query returns a list of virtual machine IDs with Basic SKU public IP addresses attached.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| project vmId = tolower(id), vmNics = properties.networkProfile.networkInterfaces
| join (
  Resources |
  where type =~ 'microsoft.network/networkinterfaces' |
  project nicVMId = tolower(tostring(properties.virtualMachine.id)), allVMNicID = tolower(id), nicIPConfigs = properties.ipConfigurations)
  on $left.vmId == $right.nicVMId
| join (
  Resources
  | where type =~ 'microsoft.network/publicipaddresses' and isnotnull(properties.ipConfiguration.id)
  | where sku.name == 'Basic' // exclude to find all VMs with Public IPs
  | project pipId = id, pipSku = sku.name, pipAssociatedNicId = tolower(tostring(split(properties.ipConfiguration.id, '/ipConfigurations/')[0])))
  on $left.allVMNicID == $right.pipAssociatedNicId
| project vmId, pipId, pipSku
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.compute/virtualmachines' | project vmId = tolower(id), vmNics = properties.networkProfile.networkInterfaces | join (Resources | where type =~ 'microsoft.network/networkinterfaces' | project nicVMId = tolower(tostring(properties.virtualMachine.id)), allVMNicID = tolower(id), nicIPConfigs = properties.ipConfigurations) on \$left.vmId == \$right.nicVMId | join ( Resources | where type =~ 'microsoft.network/publicipaddresses' and isnotnull(properties.ipConfiguration.id) | where sku.name == 'Basic' | project pipId = id, pipSku = sku.name, pipAssociatedNicId = tolower(tostring(split(properties.ipConfiguration.id, '/ipConfigurations/')[0]))) on \$left.allVMNicID == \$right.pipAssociatedNicId | project vmId, pipId, pipSku"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.compute/virtualmachines' | project vmId = tolower(id), vmNics = properties.networkProfile.networkInterfaces | join (Resources | where type =~ 'microsoft.network/networkinterfaces' | project nicVMId = tolower(tostring(properties.virtualMachine.id)), allVMNicID = tolower(id), nicIPConfigs = properties.ipConfigurations) on `$left.vmId == `$right.nicVMId | join ( Resources | where type =~ 'microsoft.network/publicipaddresses' and isnotnull(properties.ipConfiguration.id) | where sku.name == 'Basic' | project pipId = id, pipSku = sku.name, pipAssociatedNicId = tolower(tostring(split(properties.ipConfiguration.id, '/ipConfigurations/')[0]))) on `$left.allVMNicID == `$right.pipAssociatedNicId | project vmId, pipId, pipSku"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fvirtualmachines%27%0A%7C%20project%20vmId%20%3D%20tolower%28id%29%2C%20vmNics%20%3D%20properties.networkProfile.networkInterfaces%0A%7C%20join%20%28%0A%20%20Resources%20%7C%0A%20%20where%20type%20%3D~%20%27microsoft.network%2Fnetworkinterfaces%27%20%7C%0A%20%20project%20nicVMId%20%3D%20tolower%28tostring%28properties.virtualMachine.id%29%29%2C%20allVMNicID%20%3D%20tolower%28id%29%2C%20nicIPConfigs%20%3D%20properties.ipConfigurations%29%0A%20%20on%20%24left.vmId%20%3D%3D%20%24right.nicVMId%0A%7C%20join%20%28%0A%20%20Resources%0A%20%20%7C%20where%20type%20%3D~%20%27microsoft.network%2Fpublicipaddresses%27%20and%20isnotnull%28properties.ipConfiguration.id%29%0A%20%20%7C%20where%20sku.name%20%3D%3D%20%27Basic%27%0A%20%20%7C%20project%20pipId%20%3D%20id%2C%20pipSku%20%3D%20sku.name%2C%20pipAssociatedNicId%20%3D%20tolower%28tostring%28split%28properties.ipConfiguration.id%2C%20%27%2FipConfigurations%2F%27%29%5B0%5D%29%29%29%0A%20%20on%20%24left.allVMNicID%20%3D%3D%20%24right.pipAssociatedNicId%0A%7C%20project%20vmId%2C%20pipId%2C%20pipSku" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fvirtualmachines%27%0A%7C%20project%20vmId%20%3D%20tolower%28id%29%2C%20vmNics%20%3D%20properties.networkProfile.networkInterfaces%0A%7C%20join%20%28%0A%20%20Resources%20%7C%0A%20%20where%20type%20%3D~%20%27microsoft.network%2Fnetworkinterfaces%27%20%7C%0A%20%20project%20nicVMId%20%3D%20tolower%28tostring%28properties.virtualMachine.id%29%29%2C%20allVMNicID%20%3D%20tolower%28id%29%2C%20nicIPConfigs%20%3D%20properties.ipConfigurations%29%0A%20%20on%20%24left.vmId%20%3D%3D%20%24right.nicVMId%0A%7C%20join%20%28%0A%20%20Resources%0A%20%20%7C%20where%20type%20%3D~%20%27microsoft.network%2Fpublicipaddresses%27%20and%20isnotnull%28properties.ipConfiguration.id%29%0A%20%20%7C%20where%20sku.name%20%3D%3D%20%27Basic%27%0A%20%20%7C%20project%20pipId%20%3D%20id%2C%20pipSku%20%3D%20sku.name%2C%20pipAssociatedNicId%20%3D%20tolower%28tostring%28split%28properties.ipConfiguration.id%2C%20%27%2FipConfigurations%2F%27%29%5B0%5D%29%29%29%0A%20%20on%20%24left.allVMNicID%20%3D%3D%20%24right.pipAssociatedNicId%0A%7C%20project%20vmId%2C%20pipId%2C%20pipSku" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fvirtualmachines%27%0A%7C%20project%20vmId%20%3D%20tolower%28id%29%2C%20vmNics%20%3D%20properties.networkProfile.networkInterfaces%0A%7C%20join%20%28%0A%20%20Resources%20%7C%0A%20%20where%20type%20%3D~%20%27microsoft.network%2Fnetworkinterfaces%27%20%7C%0A%20%20project%20nicVMId%20%3D%20tolower%28tostring%28properties.virtualMachine.id%29%29%2C%20allVMNicID%20%3D%20tolower%28id%29%2C%20nicIPConfigs%20%3D%20properties.ipConfigurations%29%0A%20%20on%20%24left.vmId%20%3D%3D%20%24right.nicVMId%0A%7C%20join%20%28%0A%20%20Resources%0A%20%20%7C%20where%20type%20%3D~%20%27microsoft.network%2Fpublicipaddresses%27%20and%20isnotnull%28properties.ipConfiguration.id%29%0A%20%20%7C%20where%20sku.name%20%3D%3D%20%27Basic%27%0A%20%20%7C%20project%20pipId%20%3D%20id%2C%20pipSku%20%3D%20sku.name%2C%20pipAssociatedNicId%20%3D%20tolower%28tostring%28split%28properties.ipConfiguration.id%2C%20%27%2FipConfigurations%2F%27%29%5B0%5D%29%29%29%0A%20%20on%20%24left.allVMNicID%20%3D%3D%20%24right.pipAssociatedNicId%0A%7C%20project%20vmId%2C%20pipId%2C%20pipSku" target="_blank">portal.azure.cn</a>

---
