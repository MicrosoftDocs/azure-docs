---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 07/07/2022
ms.author: davidsmatlak
ms.custom: generated
---

### Count resources that have IP addresses configured by subscription

Using the 'List all public IP addresses' example query and adding `summarize` and `count()`, we can get a list by subscription of resources with configured IP addresses.

```kusto
Resources
| where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress)
| summarize count () by subscriptionId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress) | summarize count () by subscriptionId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress) | summarize count () by subscriptionId"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty(properties.ipAddress)%0a%7c%20summarize%20count%20()%20by%20subscriptionId" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty(properties.ipAddress)%0a%7c%20summarize%20count%20()%20by%20subscriptionId" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty(properties.ipAddress)%0a%7c%20summarize%20count%20()%20by%20subscriptionId" target="_blank">portal.azure.cn</a>

---

### Get virtual networks and subnets of network interfaces

Use a regular expression `parse` to get the virtual network and subnet names from the resource ID property. While `parse` enables getting data from a complex field, it's optimal to access properties directly if they exist instead of using `parse`.

```kusto
Resources
| where type =~ 'microsoft.network/networkinterfaces'
| project id, ipConfigurations = properties.ipConfigurations
| mvexpand ipConfigurations
| project id, subnetId = tostring(ipConfigurations.properties.subnet.id)
| parse kind=regex subnetId with '/virtualNetworks/' virtualNetwork '/subnets/' subnet
| project id, virtualNetwork, subnet
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.network/networkinterfaces' | project id, ipConfigurations = properties.ipConfigurations | mvexpand ipConfigurations | project id, subnetId = tostring(ipConfigurations.properties.subnet.id) | parse kind=regex subnetId with '/virtualNetworks/' virtualNetwork '/subnets/' subnet | project id, virtualNetwork, subnet"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.network/networkinterfaces' | project id, ipConfigurations = properties.ipConfigurations | mvexpand ipConfigurations | project id, subnetId = tostring(ipConfigurations.properties.subnet.id) | parse kind=regex subnetId with '/virtualNetworks/' virtualNetwork '/subnets/' subnet | project id, virtualNetwork, subnet"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fnetworkinterfaces%27%0a%7c%20project%20id%2c%20ipConfigurations%20%3d%20properties.ipConfigurations%0a%7c%20mvexpand%20ipConfigurations%0a%7c%20project%20id%2c%20subnetId%20%3d%20tostring(ipConfigurations.properties.subnet.id)%0a%7c%20parse%20kind%3dregex%20subnetId%20with%20%27%2fvirtualNetworks%2f%27%20virtualNetwork%20%27%2fsubnets%2f%27%20subnet%0a%7c%20project%20id%2c%20virtualNetwork%2c%20subnet" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fnetworkinterfaces%27%0a%7c%20project%20id%2c%20ipConfigurations%20%3d%20properties.ipConfigurations%0a%7c%20mvexpand%20ipConfigurations%0a%7c%20project%20id%2c%20subnetId%20%3d%20tostring(ipConfigurations.properties.subnet.id)%0a%7c%20parse%20kind%3dregex%20subnetId%20with%20%27%2fvirtualNetworks%2f%27%20virtualNetwork%20%27%2fsubnets%2f%27%20subnet%0a%7c%20project%20id%2c%20virtualNetwork%2c%20subnet" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fnetworkinterfaces%27%0a%7c%20project%20id%2c%20ipConfigurations%20%3d%20properties.ipConfigurations%0a%7c%20mvexpand%20ipConfigurations%0a%7c%20project%20id%2c%20subnetId%20%3d%20tostring(ipConfigurations.properties.subnet.id)%0a%7c%20parse%20kind%3dregex%20subnetId%20with%20%27%2fvirtualNetworks%2f%27%20virtualNetwork%20%27%2fsubnets%2f%27%20subnet%0a%7c%20project%20id%2c%20virtualNetwork%2c%20subnet" target="_blank">portal.azure.cn</a>

---

### List all public IP addresses

Similar to the 'Show resources that contain storage' query, find everything that is a type with the word **publicIPAddresses**. This query expands on that pattern to only include results where **properties.ipAddress** `isnotempty`, to only return the **properties.ipAddress**, and to `limit` the results by the top 100. You may need to escape the quotes depending on your chosen shell.

```kusto
Resources
| where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress)
| project properties.ipAddress
| limit 100
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress) | project properties.ipAddress | limit 100"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type contains 'publicIPAddresses' and isnotempty(properties.ipAddress) | project properties.ipAddress | limit 100"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty(properties.ipAddress)%0a%7c%20project%20properties.ipAddress%0a%7c%20limit%20100" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty(properties.ipAddress)%0a%7c%20project%20properties.ipAddress%0a%7c%20limit%20100" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty(properties.ipAddress)%0a%7c%20project%20properties.ipAddress%0a%7c%20limit%20100" target="_blank">portal.azure.cn</a>

---

### Show unassociated network security groups

This query returns network security groups (NSGs) that aren't associated to a network interface or subnet.

```kusto
Resources
| where type =~ 'microsoft.network/networksecuritygroups' and isnull(properties.networkInterfaces) and isnull(properties.subnets)
| project name, resourceGroup
| sort by name asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.network/networksecuritygroups' and isnull(properties.networkInterfaces) and isnull(properties.subnets) | project name, resourceGroup | sort by name asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.network/networksecuritygroups' and isnull(properties.networkInterfaces) and isnull(properties.subnets) | project name, resourceGroup | sort by name asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fnetworksecuritygroups%27%20and%20isnull(properties.networkInterfaces)%20and%20isnull(properties.subnets)%0a%7c%20project%20name%2c%20resourceGroup%0a%7c%20sort%20by%20name%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fnetworksecuritygroups%27%20and%20isnull(properties.networkInterfaces)%20and%20isnull(properties.subnets)%0a%7c%20project%20name%2c%20resourceGroup%0a%7c%20sort%20by%20name%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fnetworksecuritygroups%27%20and%20isnull(properties.networkInterfaces)%20and%20isnull(properties.subnets)%0a%7c%20project%20name%2c%20resourceGroup%0a%7c%20sort%20by%20name%20asc" target="_blank">portal.azure.cn</a>

---

### Show Virtual Machines with Basic SKU Public IP Addresses

This query returns a list of Virtual Machines IDs with Basic SKU Public IP addresses attached.

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
az graph query -q "Resources | where type =~ 'microsoft.compute/virtualmachines' | project vmId = tolower(id), vmNics = properties.networkProfile.networkInterfaces | join ( Resources | where type =~ 'microsoft.network/networkinterfaces' | project nicVMId = tolower(tostring(properties.virtualMachine.id)), allVMNicID = tolower(id), nicIPConfigs = properties.ipConfigurations) on $left.vmId == $right.nicVMId | join ( Resources | where type =~ 'microsoft.network/publicipaddresses' and isnotnull(properties.ipConfiguration.id) | where sku.name == 'Basic' | project pipId = id, pipSku = sku.name, pipAssociatedNicId = tolower(tostring(split(properties.ipConfiguration.id, '/ipConfigurations/')[0]))) on $left.allVMNicID == $right.pipAssociatedNicId | project vmId, pipId, pipSku"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query @"
Resources
    | where type =~ 'microsoft.compute/virtualmachines'
    | project vmId = tolower(id), vmNics = properties.networkProfile.networkInterfaces
    | join (
        Resources | 
        where type =~ 'microsoft.network/networkinterfaces' | 
        project nicVMId = tolower(tostring(properties.virtualMachine.id)), allVMNicID = tolower(id), nicIPConfigs = properties.ipConfigurations) 
        on `$left.vmId == `$right.nicVMId
    | join (
        Resources
        | where type =~ 'microsoft.network/publicipaddresses' and isnotnull(properties.ipConfiguration.id) 
        | where sku.name == 'Basic' // exclude to find all VMs with Public IPs
        | project pipId = id, pipSku = sku.name, pipAssociatedNicId = tolower(tostring(split(properties.ipConfiguration.id, '/ipConfigurations/')[0])))
        on `$left.allVMNicID == `$right.pipAssociatedNicId
    | project vmId, pipId, pipSku
"@
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%20%7C%20where%20type%20%3D~%20'microsoft.compute%2Fvirtualmachines'%20%7C%20project%20vmId%20%3D%20tolower(id)%2C%20vmNics%20%3D%20properties.networkProfile.networkInterfaces%20%7C%20join%20(%20Resources%20%7C%20where%20type%20%3D~%20'microsoft.network%2Fnetworkinterfaces'%20%7C%20project%20nicVMId%20%3D%20tolower(tostring(properties.virtualMachine.id))%2C%20allVMNicID%20%3D%20tolower(id)%2C%20nicIPConfigs%20%3D%20properties.ipConfigurations)%20on%20%24left.vmId%20%3D%3D%20%24right.nicVMId%20%7C%20join%20(%20Resources%20%7C%20where%20type%20%3D~%20'microsoft.network%2Fpublicipaddresses'%20and%20isnotnull(properties.ipConfiguration.id)%20%7C%20where%20sku.name%20%3D%3D%20'Basic'%20%%7C%20project%20pipId%20%3D%20id%2C%20pipSku%20%3D%20sku.name%2C%20pipAssociatedNicId%20%3D%20tolower(tostring(split(properties.ipConfiguration.id%2C%20'%2FipConfigurations%2F')%5B0%5D)))%20on%20%24left.allVMNicID%20%3D%3D%20%24right.pipAssociatedNicId%20%7C%20project%20vmId%2C%20pipId%2C%20pipSku" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%20%7C%20where%20type%20%3D~%20'microsoft.compute%2Fvirtualmachines'%20%7C%20project%20vmId%20%3D%20tolower(id)%2C%20vmNics%20%3D%20properties.networkProfile.networkInterfaces%20%7C%20join%20(%20Resources%20%7C%20where%20type%20%3D~%20'microsoft.network%2Fnetworkinterfaces'%20%7C%20project%20nicVMId%20%3D%20tolower(tostring(properties.virtualMachine.id))%2C%20allVMNicID%20%3D%20tolower(id)%2C%20nicIPConfigs%20%3D%20properties.ipConfigurations)%20on%20%24left.vmId%20%3D%3D%20%24right.nicVMId%20%7C%20join%20(%20Resources%20%7C%20where%20type%20%3D~%20'microsoft.network%2Fpublicipaddresses'%20and%20isnotnull(properties.ipConfiguration.id)%20%7C%20where%20sku.name%20%3D%3D%20'Basic'%20%%7C%20project%20pipId%20%3D%20id%2C%20pipSku%20%3D%20sku.name%2C%20pipAssociatedNicId%20%3D%20tolower(tostring(split(properties.ipConfiguration.id%2C%20'%2FipConfigurations%2F')%5B0%5D)))%20on%20%24left.allVMNicID%20%3D%3D%20%24right.pipAssociatedNicId%20%7C%20project%20vmId%2C%20pipId%2C%20pipSku" target="_blank">portal.azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%20%7C%20where%20type%20%3D~%20'microsoft.compute%2Fvirtualmachines'%20%7C%20project%20vmId%20%3D%20tolower(id)%2C%20vmNics%20%3D%20properties.networkProfile.networkInterfaces%20%7C%20join%20(%20Resources%20%7C%20where%20type%20%3D~%20'microsoft.network%2Fnetworkinterfaces'%20%7C%20project%20nicVMId%20%3D%20tolower(tostring(properties.virtualMachine.id))%2C%20allVMNicID%20%3D%20tolower(id)%2C%20nicIPConfigs%20%3D%20properties.ipConfigurations)%20on%20%24left.vmId%20%3D%3D%20%24right.nicVMId%20%7C%20join%20(%20Resources%20%7C%20where%20type%20%3D~%20'microsoft.network%2Fpublicipaddresses'%20and%20isnotnull(properties.ipConfiguration.id)%20%7C%20where%20sku.name%20%3D%3D%20'Basic'%20%%7C%20project%20pipId%20%3D%20id%2C%20pipSku%20%3D%20sku.name%2C%20pipAssociatedNicId%20%3D%20tolower(tostring(split(properties.ipConfiguration.id%2C%20'%2FipConfigurations%2F')%5B0%5D)))%20on%20%24left.allVMNicID%20%3D%3D%20%24right.pipAssociatedNicId%20%7C%20project%20vmId%2C%20pipId%2C%20pipSku" target="_blank">portal.azure.cn</a>

---