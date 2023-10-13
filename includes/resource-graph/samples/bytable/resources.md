---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 07/07/2022
ms.author: davidsmatlak
ms.custom: generated
---

### Combine results from two queries into a single result

The following query uses `union` to get results from the _ResourceContainers_ table and add them to results from the _Resources_ table.

```kusto
ResourceContainers
| where type=='microsoft.resources/subscriptions/resourcegroups' | project name, type  | limit 5
| union  (Resources | project name, type | limit 5)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ResourceContainers | where type=='microsoft.resources/subscriptions/resourcegroups' | project name, type | limit 5 | union (Resources | project name, type | limit 5)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ResourceContainers | where type=='microsoft.resources/subscriptions/resourcegroups' | project name, type | limit 5 | union (Resources | project name, type | limit 5)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%3d%3d%27microsoft.resources%2fsubscriptions%2fresourcegroups%27%20%7c%20project%20name%2c%20type%20%20%7c%20limit%205%0a%7c%20union%20%20(Resources%20%7c%20project%20name%2c%20type%20%7c%20limit%205)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%3d%3d%27microsoft.resources%2fsubscriptions%2fresourcegroups%27%20%7c%20project%20name%2c%20type%20%20%7c%20limit%205%0a%7c%20union%20%20(Resources%20%7c%20project%20name%2c%20type%20%7c%20limit%205)" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%3d%3d%27microsoft.resources%2fsubscriptions%2fresourcegroups%27%20%7c%20project%20name%2c%20type%20%20%7c%20limit%205%0a%7c%20union%20%20(Resources%20%7c%20project%20name%2c%20type%20%7c%20limit%205)" target="_blank">portal.azure.cn</a>

---

### Count Azure resources

This query returns number of Azure resources that exist in the subscriptions that you have access to. It's also a good query to validate your shell of choice has the appropriate Azure Resource Graph components installed and in working order.

```kusto
Resources
| summarize count()
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | summarize count()"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | summarize count()"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20summarize%20count()" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20summarize%20count()" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20summarize%20count()" target="_blank">portal.azure.cn</a>

---

### Count key vault resources

This query uses `count` instead of `summarize` to count the number of records returned. Only key vaults are included in the count.

```kusto
Resources
| where type =~ 'microsoft.keyvault/vaults'
| count
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.keyvault/vaults' | count"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.keyvault/vaults' | count"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.keyvault%2fvaults%27%0a%7c%20count" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.keyvault%2fvaults%27%0a%7c%20count" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.keyvault%2fvaults%27%0a%7c%20count" target="_blank">portal.azure.cn</a>

---

### Count of virtual machines by power state

Returns count of virtual machines (type `Microsoft.Compute/virtualMachines`) categorized according to their power state. For more information on power states, please see [Power states overview](../../../../articles/virtual-machines/states-billing.md).

```kusto
Resources
| where type == 'microsoft.compute/virtualmachines'
| summarize count() by PowerState = tostring(properties.extended.instanceView.powerState.code)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type == 'microsoft.compute/virtualmachines' | summarize count() by PowerState = tostring(properties.extended.instanceView.powerState.code)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type == 'microsoft.compute/virtualmachines' | summarize count() by PowerState = tostring(properties.extended.instanceView.powerState.code)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20summarize%20count()%20by%20PowerState%20%3d%20tostring(properties.extended.instanceView.powerState.code)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20summarize%20count()%20by%20PowerState%20%3d%20tostring(properties.extended.instanceView.powerState.code)" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20summarize%20count()%20by%20PowerState%20%3d%20tostring(properties.extended.instanceView.powerState.code)" target="_blank">portal.azure.cn</a>

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
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty(properties.ipAddress)%0a%7c%20summarize%20count%20()%20by%20subscriptionId" target="_blank">portal.azure.cn</a>

---

### Count virtual machines by OS type

Building on the previous query, we're still limiting by Azure resources of type `Microsoft.Compute/virtualMachines`, but are no longer limiting the number of records returned. Instead, we used `summarize` and `count()` to define how to group and aggregate the values by property, which in this example is `properties.storageProfile.osDisk.osType`. For an example of how this string looks in the full object, see [explore resources - virtual machine discovery](../../../../articles/governance/resource-graph/concepts/explore-resources.md#virtual-machine-discovery).

```kusto
Resources
| where type =~ 'Microsoft.Compute/virtualMachines'
| summarize count() by tostring(properties.storageProfile.osDisk.osType)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | summarize count() by tostring(properties.storageProfile.osDisk.osType)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | summarize count() by tostring(properties.storageProfile.osDisk.osType)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20summarize%20count()%20by%20tostring(properties.storageProfile.osDisk.osType)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20summarize%20count()%20by%20tostring(properties.storageProfile.osDisk.osType)" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20summarize%20count()%20by%20tostring(properties.storageProfile.osDisk.osType)" target="_blank">portal.azure.cn</a>

---

### Count virtual machines by OS type with extend

A different way to write the 'Count virtual machines by OS type' query is to `extend` a property and give it a temporary name for use within the query, in this case **os**. **os** is then used by `summarize` and `count()` as in the referenced example.

```kusto
Resources
| where type =~ 'Microsoft.Compute/virtualMachines'
| extend os = properties.storageProfile.osDisk.osType
| summarize count() by tostring(os)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | extend os = properties.storageProfile.osDisk.osType | summarize count() by tostring(os)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | extend os = properties.storageProfile.osDisk.osType | summarize count() by tostring(os)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20extend%20os%20%3d%20properties.storageProfile.osDisk.osType%0a%7c%20summarize%20count()%20by%20tostring(os)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20extend%20os%20%3d%20properties.storageProfile.osDisk.osType%0a%7c%20summarize%20count()%20by%20tostring(os)" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20extend%20os%20%3d%20properties.storageProfile.osDisk.osType%0a%7c%20summarize%20count()%20by%20tostring(os)" target="_blank">portal.azure.cn</a>

---

### Find storage accounts with a specific case-insensitive tag on the resource group

Similar to the 'Find storage accounts with a specific case-sensitive tag on the resource group' query, but when it's necessary to look for a case insensitive tag name and tag value, use `mv-expand` with the **bagexpansion** parameter. This query uses more quota than the original query, so use `mv-expand` only if necessary.

```kusto
Resources
| where type =~ 'microsoft.storage/storageaccounts'
| join kind=inner (
	ResourceContainers
	| where type =~ 'microsoft.resources/subscriptions/resourcegroups'
	| mv-expand bagexpansion=array tags
	| where isnotempty(tags)
	| where tags[0] =~ 'key1' and tags[1] =~ 'value1'
	| project subscriptionId, resourceGroup)
on subscriptionId, resourceGroup
| project-away subscriptionId1, resourceGroup1
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.storage/storageaccounts' | join kind=inner ( ResourceContainers | where type =~ 'microsoft.resources/subscriptions/resourcegroups' | mv-expand bagexpansion=array tags | where isnotempty(tags) | where tags[0] =~ 'key1' and tags[1] =~ 'value1' | project subscriptionId, resourceGroup) on subscriptionId, resourceGroup | project-away subscriptionId1, resourceGroup1"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.storage/storageaccounts' | join kind=inner ( ResourceContainers | where type =~ 'microsoft.resources/subscriptions/resourcegroups' | mv-expand bagexpansion=array tags | where isnotempty(tags) | where tags[0] =~ 'key1' and tags[1] =~ 'value1' | project subscriptionId, resourceGroup) on subscriptionId, resourceGroup | project-away subscriptionId1, resourceGroup1"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.storage%2fstorageaccounts%27%0a%7c%20join%20kind%3dinner%20(%0a%09ResourceContainers%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%2fresourcegroups%27%0a%09%7c%20mv-expand%20bagexpansion%3darray%20tags%0a%09%7c%20where%20isnotempty(tags)%0a%09%7c%20where%20tags%5b0%5d%20%3d%7e%20%27key1%27%20and%20tags%5b1%5d%20%3d%7e%20%27value1%27%0a%09%7c%20project%20subscriptionId%2c%20resourceGroup)%0aon%20subscriptionId%2c%20resourceGroup%0a%7c%20project-away%20subscriptionId1%2c%20resourceGroup1" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.storage%2fstorageaccounts%27%0a%7c%20join%20kind%3dinner%20(%0a%09ResourceContainers%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%2fresourcegroups%27%0a%09%7c%20mv-expand%20bagexpansion%3darray%20tags%0a%09%7c%20where%20isnotempty(tags)%0a%09%7c%20where%20tags%5b0%5d%20%3d%7e%20%27key1%27%20and%20tags%5b1%5d%20%3d%7e%20%27value1%27%0a%09%7c%20project%20subscriptionId%2c%20resourceGroup)%0aon%20subscriptionId%2c%20resourceGroup%0a%7c%20project-away%20subscriptionId1%2c%20resourceGroup1" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.storage%2fstorageaccounts%27%0a%7c%20join%20kind%3dinner%20(%0a%09ResourceContainers%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%2fresourcegroups%27%0a%09%7c%20mv-expand%20bagexpansion%3darray%20tags%0a%09%7c%20where%20isnotempty(tags)%0a%09%7c%20where%20tags%5b0%5d%20%3d%7e%20%27key1%27%20and%20tags%5b1%5d%20%3d%7e%20%27value1%27%0a%09%7c%20project%20subscriptionId%2c%20resourceGroup)%0aon%20subscriptionId%2c%20resourceGroup%0a%7c%20project-away%20subscriptionId1%2c%20resourceGroup1" target="_blank">portal.azure.cn</a>

---

### Find storage accounts with a specific case-sensitive tag on the resource group

The following query uses an **inner** `join` to connect storage accounts with resource groups that have a specified case-sensitive tag name and tag value.

```kusto
Resources
| where type =~ 'microsoft.storage/storageaccounts'
| join kind=inner (
	ResourceContainers
	| where type =~ 'microsoft.resources/subscriptions/resourcegroups'
	| where tags['Key1'] =~ 'Value1'
	| project subscriptionId, resourceGroup)
on subscriptionId, resourceGroup
| project-away subscriptionId1, resourceGroup1
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.storage/storageaccounts' | join kind=inner ( ResourceContainers | where type =~ 'microsoft.resources/subscriptions/resourcegroups' | where tags['Key1'] =~ 'Value1' | project subscriptionId, resourceGroup) on subscriptionId, resourceGroup | project-away subscriptionId1, resourceGroup1"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.storage/storageaccounts' | join kind=inner ( ResourceContainers | where type =~ 'microsoft.resources/subscriptions/resourcegroups' | where tags['Key1'] =~ 'Value1' | project subscriptionId, resourceGroup) on subscriptionId, resourceGroup | project-away subscriptionId1, resourceGroup1"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.storage%2fstorageaccounts%27%0a%7c%20join%20kind%3dinner%20(%0a%09ResourceContainers%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%2fresourcegroups%27%0a%09%7c%20where%20tags%5b%27Key1%27%5d%20%3d%7e%20%27Value1%27%0a%09%7c%20project%20subscriptionId%2c%20resourceGroup)%0aon%20subscriptionId%2c%20resourceGroup%0a%7c%20project-away%20subscriptionId1%2c%20resourceGroup1" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.storage%2fstorageaccounts%27%0a%7c%20join%20kind%3dinner%20(%0a%09ResourceContainers%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%2fresourcegroups%27%0a%09%7c%20where%20tags%5b%27Key1%27%5d%20%3d%7e%20%27Value1%27%0a%09%7c%20project%20subscriptionId%2c%20resourceGroup)%0aon%20subscriptionId%2c%20resourceGroup%0a%7c%20project-away%20subscriptionId1%2c%20resourceGroup1" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.storage%2fstorageaccounts%27%0a%7c%20join%20kind%3dinner%20(%0a%09ResourceContainers%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%2fresourcegroups%27%0a%09%7c%20where%20tags%5b%27Key1%27%5d%20%3d%7e%20%27Value1%27%0a%09%7c%20project%20subscriptionId%2c%20resourceGroup)%0aon%20subscriptionId%2c%20resourceGroup%0a%7c%20project-away%20subscriptionId1%2c%20resourceGroup1" target="_blank">portal.azure.cn</a>

---

### Get count and percentage of Arc-enabled servers by domain

This query summarizes the **domainName** property on [Azure Arc-enabled servers](../../../../articles/azure-arc/servers/overview.md) and uses a calculation with `bin` to create a **Pct** column for the percent of Arc-enabled servers per domain.

```kusto
Resources
| where type == 'microsoft.hybridcompute/machines'
| project domain=tostring(properties.domainName)
| summarize Domains=make_list(domain), TotalMachineCount=sum(1)
| mvexpand EachDomain = Domains
| summarize PerDomainMachineCount = count() by tostring(EachDomain), TotalMachineCount
| extend Pct = 100 * bin(todouble(PerDomainMachineCount) / todouble(TotalMachineCount), 0.001)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type == 'microsoft.hybridcompute/machines' | project domain=tostring(properties.domainName) | summarize Domains=make_list(domain), TotalMachineCount=sum(1) | mvexpand EachDomain = Domains | summarize PerDomainMachineCount = count() by tostring(EachDomain), TotalMachineCount | extend Pct = 100 * bin(todouble(PerDomainMachineCount) / todouble(TotalMachineCount), 0.001)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type == 'microsoft.hybridcompute/machines' | project domain=tostring(properties.domainName) | summarize Domains=make_list(domain), TotalMachineCount=sum(1) | mvexpand EachDomain = Domains | summarize PerDomainMachineCount = count() by tostring(EachDomain), TotalMachineCount | extend Pct = 100 * bin(todouble(PerDomainMachineCount) / todouble(TotalMachineCount), 0.001)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%27%0a%7c%20project%20domain%3dtostring(properties.domainName)%0a%7c%20summarize%20Domains%3dmake_list(domain)%2c%20TotalMachineCount%3dsum(1)%0a%7c%20mvexpand%20EachDomain%20%3d%20Domains%0a%7c%20summarize%20PerDomainMachineCount%20%3d%20count()%20by%20tostring(EachDomain)%2c%20TotalMachineCount%0a%7c%20extend%20Pct%20%3d%20100%20*%20bin(todouble(PerDomainMachineCount)%20%2f%20todouble(TotalMachineCount)%2c%200.001)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%27%0a%7c%20project%20domain%3dtostring(properties.domainName)%0a%7c%20summarize%20Domains%3dmake_list(domain)%2c%20TotalMachineCount%3dsum(1)%0a%7c%20mvexpand%20EachDomain%20%3d%20Domains%0a%7c%20summarize%20PerDomainMachineCount%20%3d%20count()%20by%20tostring(EachDomain)%2c%20TotalMachineCount%0a%7c%20extend%20Pct%20%3d%20100%20*%20bin(todouble(PerDomainMachineCount)%20%2f%20todouble(TotalMachineCount)%2c%200.001)" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%27%0a%7c%20project%20domain%3dtostring(properties.domainName)%0a%7c%20summarize%20Domains%3dmake_list(domain)%2c%20TotalMachineCount%3dsum(1)%0a%7c%20mvexpand%20EachDomain%20%3d%20Domains%0a%7c%20summarize%20PerDomainMachineCount%20%3d%20count()%20by%20tostring(EachDomain)%2c%20TotalMachineCount%0a%7c%20extend%20Pct%20%3d%20100%20*%20bin(todouble(PerDomainMachineCount)%20%2f%20todouble(TotalMachineCount)%2c%200.001)" target="_blank">portal.azure.cn</a>

---

### Get virtual machine scale set capacity and size

This query looks for virtual machine scale set resources and gets various details including the virtual machine size and the capacity of the scale set. The query uses the `toint()` function to cast the capacity to a number so that it can be sorted. Finally, the columns are renamed into custom named properties.

```kusto
Resources
| where type=~ 'microsoft.compute/virtualmachinescalesets'
| where name contains 'contoso'
| project subscriptionId, name, location, resourceGroup, Capacity = toint(sku.capacity), Tier = sku.name
| order by Capacity desc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type=~ 'microsoft.compute/virtualmachinescalesets' | where name contains 'contoso' | project subscriptionId, name, location, resourceGroup, Capacity = toint(sku.capacity), Tier = sku.name | order by Capacity desc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type=~ 'microsoft.compute/virtualmachinescalesets' | where name contains 'contoso' | project subscriptionId, name, location, resourceGroup, Capacity = toint(sku.capacity), Tier = sku.name | order by Capacity desc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%3d%7e%20%27microsoft.compute%2fvirtualmachinescalesets%27%0a%7c%20where%20name%20contains%20%27contoso%27%0a%7c%20project%20subscriptionId%2c%20name%2c%20location%2c%20resourceGroup%2c%20Capacity%20%3d%20toint(sku.capacity)%2c%20Tier%20%3d%20sku.name%0a%7c%20order%20by%20Capacity%20desc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%3d%7e%20%27microsoft.compute%2fvirtualmachinescalesets%27%0a%7c%20where%20name%20contains%20%27contoso%27%0a%7c%20project%20subscriptionId%2c%20name%2c%20location%2c%20resourceGroup%2c%20Capacity%20%3d%20toint(sku.capacity)%2c%20Tier%20%3d%20sku.name%0a%7c%20order%20by%20Capacity%20desc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%3d%7e%20%27microsoft.compute%2fvirtualmachinescalesets%27%0a%7c%20where%20name%20contains%20%27contoso%27%0a%7c%20project%20subscriptionId%2c%20name%2c%20location%2c%20resourceGroup%2c%20Capacity%20%3d%20toint(sku.capacity)%2c%20Tier%20%3d%20sku.name%0a%7c%20order%20by%20Capacity%20desc" target="_blank">portal.azure.cn</a>

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

### Key vaults with subscription name

The following query shows a complex use of `join` with **kind** as _leftouter_. The query limits the joined table to subscriptions resources and with `project` to include only the original field _subscriptionId_ and the _name_ field renamed to _SubName_. The field rename avoids `join` adding it as _name1_ since the field already exists in _resources_. The original table is filtered with `where` and the following `project` includes columns from both tables. The query result is all key vaults displaying type, the name of the key vault, and the name of the subscription it's in.

```kusto
Resources
| join kind=leftouter (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId
| where type == 'microsoft.keyvault/vaults'
| project type, name, SubName
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | join kind=leftouter (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId | where type == 'microsoft.keyvault/vaults' | project type, name, SubName"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | join kind=leftouter (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId | where type == 'microsoft.keyvault/vaults' | project type, name, SubName"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20join%20kind%3dleftouter%20(ResourceContainers%20%7c%20where%20type%3d%3d%27microsoft.resources%2fsubscriptions%27%20%7c%20project%20SubName%3dname%2c%20subscriptionId)%20on%20subscriptionId%0a%7c%20where%20type%20%3d%3d%20%27microsoft.keyvault%2fvaults%27%0a%7c%20project%20type%2c%20name%2c%20SubName" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20join%20kind%3dleftouter%20(ResourceContainers%20%7c%20where%20type%3d%3d%27microsoft.resources%2fsubscriptions%27%20%7c%20project%20SubName%3dname%2c%20subscriptionId)%20on%20subscriptionId%0a%7c%20where%20type%20%3d%3d%20%27microsoft.keyvault%2fvaults%27%0a%7c%20project%20type%2c%20name%2c%20SubName" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20join%20kind%3dleftouter%20(ResourceContainers%20%7c%20where%20type%3d%3d%27microsoft.resources%2fsubscriptions%27%20%7c%20project%20SubName%3dname%2c%20subscriptionId)%20on%20subscriptionId%0a%7c%20where%20type%20%3d%3d%20%27microsoft.keyvault%2fvaults%27%0a%7c%20project%20type%2c%20name%2c%20SubName" target="_blank">portal.azure.cn</a>

---

### List all Azure Arc-enabled Kubernetes clusters without Azure Monitor extension

Returns the connected cluster ID of each Azure Arc-enabled Kubernetes cluster that is missing the Azure Monitor extension.

```kusto
Resources
| where type =~ 'Microsoft.Kubernetes/connectedClusters' | extend connectedClusterId = tolower(id) | project connectedClusterId 
| join kind = leftouter
	(KubernetesConfigurationResources
	| where type == 'microsoft.kubernetesconfiguration/extensions'
	| where properties.ExtensionType  == 'microsoft.azuremonitor.containers'
	| parse tolower(id) with connectedClusterId '/providers/microsoft.kubernetesconfiguration/extensions' *
	| project connectedClusterId
)  on connectedClusterId
| where connectedClusterId1 == ''
| project connectedClusterId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'Microsoft.Kubernetes/connectedClusters' | extend connectedClusterId = tolower(id) | project connectedClusterId | join kind = leftouter (KubernetesConfigurationResources | where type == 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.azuremonitor.containers' | parse tolower(id) with connectedClusterId '/providers/microsoft.kubernetesconfiguration/extensions' * | project connectedClusterId ) on connectedClusterId | where connectedClusterId1 == '' | project connectedClusterId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Kubernetes/connectedClusters' | extend connectedClusterId = tolower(id) | project connectedClusterId | join kind = leftouter (KubernetesConfigurationResources | where type == 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.azuremonitor.containers' | parse tolower(id) with connectedClusterId '/providers/microsoft.kubernetesconfiguration/extensions' * | project connectedClusterId ) on connectedClusterId | where connectedClusterId1 == '' | project connectedClusterId"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20%7c%20extend%20connectedClusterId%20%3d%20tolower(id)%20%7c%20project%20connectedClusterId%20%0a%7c%20join%20kind%20%3d%20leftouter%0a%09(KubernetesConfigurationResources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%09%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%09%7c%20parse%20tolower(id)%20with%20connectedClusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2fextensions%27%20*%0a%09%7c%20project%20connectedClusterId%0a)%20%20on%20connectedClusterId%0a%7c%20where%20connectedClusterId1%20%3d%3d%20%27%27%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20%7c%20extend%20connectedClusterId%20%3d%20tolower(id)%20%7c%20project%20connectedClusterId%20%0a%7c%20join%20kind%20%3d%20leftouter%0a%09(KubernetesConfigurationResources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%09%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%09%7c%20parse%20tolower(id)%20with%20connectedClusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2fextensions%27%20*%0a%09%7c%20project%20connectedClusterId%0a)%20%20on%20connectedClusterId%0a%7c%20where%20connectedClusterId1%20%3d%3d%20%27%27%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20%7c%20extend%20connectedClusterId%20%3d%20tolower(id)%20%7c%20project%20connectedClusterId%20%0a%7c%20join%20kind%20%3d%20leftouter%0a%09(KubernetesConfigurationResources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%09%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%09%7c%20parse%20tolower(id)%20with%20connectedClusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2fextensions%27%20*%0a%09%7c%20project%20connectedClusterId%0a)%20%20on%20connectedClusterId%0a%7c%20where%20connectedClusterId1%20%3d%3d%20%27%27%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.cn</a>

---

### List all Azure Arc-enabled Kubernetes resources

Returns a list of each Azure Arc-enabled Kubernetes cluster and relevant metadata for each cluster.

```kusto
Resources
| project id, subscriptionId, location, type, properties.agentVersion, properties.kubernetesVersion, properties.distribution, properties.infrastructure, properties.totalNodeCount, properties.totalCoreCount
| where type =~ 'Microsoft.Kubernetes/connectedClusters'
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | project id, subscriptionId, location, type, properties.agentVersion, properties.kubernetesVersion, properties.distribution, properties.infrastructure, properties.totalNodeCount, properties.totalCoreCount | where type =~ 'Microsoft.Kubernetes/connectedClusters'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | project id, subscriptionId, location, type, properties.agentVersion, properties.kubernetesVersion, properties.distribution, properties.infrastructure, properties.totalNodeCount, properties.totalCoreCount | where type =~ 'Microsoft.Kubernetes/connectedClusters'"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20id%2c%20subscriptionId%2c%20location%2c%20type%2c%20properties.agentVersion%2c%20properties.kubernetesVersion%2c%20properties.distribution%2c%20properties.infrastructure%2c%20properties.totalNodeCount%2c%20properties.totalCoreCount%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20id%2c%20subscriptionId%2c%20location%2c%20type%2c%20properties.agentVersion%2c%20properties.kubernetesVersion%2c%20properties.distribution%2c%20properties.infrastructure%2c%20properties.totalNodeCount%2c%20properties.totalCoreCount%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20id%2c%20subscriptionId%2c%20location%2c%20type%2c%20properties.agentVersion%2c%20properties.kubernetesVersion%2c%20properties.distribution%2c%20properties.infrastructure%2c%20properties.totalNodeCount%2c%20properties.totalCoreCount%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27" target="_blank">portal.azure.cn</a>

---

### List all ConnectedClusters and ManagedClusters that contain a Flux Configuration

Returns the connectedCluster and managedCluster Ids for clusters that contain at least one fluxConfiguration.

```kusto
resources
| where type =~ 'Microsoft.Kubernetes/connectedClusters' or type =~ 'Microsoft.ContainerService/managedClusters' | extend clusterId = tolower(id) | project clusterId
| join
( kubernetesconfigurationresources
| where type == 'microsoft.kubernetesconfiguration/fluxconfigurations'
| parse tolower(id) with clusterId '/providers/microsoft.kubernetesconfiguration/fluxconfigurations' *
| project clusterId
) on clusterId
| project clusterId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "resources | where type =~ 'Microsoft.Kubernetes/connectedClusters' or type =~ 'Microsoft.ContainerService/managedClusters' | extend clusterId = tolower(id) | project clusterId | join ( kubernetesconfigurationresources | where type == 'microsoft.kubernetesconfiguration/fluxconfigurations' | parse tolower(id) with clusterId '/providers/microsoft.kubernetesconfiguration/fluxconfigurations' * | project clusterId ) on clusterId | project clusterId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "resources | where type =~ 'Microsoft.Kubernetes/connectedClusters' or type =~ 'Microsoft.ContainerService/managedClusters' | extend clusterId = tolower(id) | project clusterId | join ( kubernetesconfigurationresources | where type == 'microsoft.kubernetesconfiguration/fluxconfigurations' | parse tolower(id) with clusterId '/providers/microsoft.kubernetesconfiguration/fluxconfigurations' * | project clusterId ) on clusterId | project clusterId"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20or%20type%20%3d%7e%20%27Microsoft.ContainerService%2fmanagedClusters%27%20%7c%20extend%20clusterId%20%3d%20tolower(id)%20%7c%20project%20clusterId%0a%7c%20join%0a(%20kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20parse%20tolower(id)%20with%20clusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2ffluxconfigurations%27%20*%0a%7c%20project%20clusterId%0a)%20on%20clusterId%0a%7c%20project%20clusterId" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20or%20type%20%3d%7e%20%27Microsoft.ContainerService%2fmanagedClusters%27%20%7c%20extend%20clusterId%20%3d%20tolower(id)%20%7c%20project%20clusterId%0a%7c%20join%0a(%20kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20parse%20tolower(id)%20with%20clusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2ffluxconfigurations%27%20*%0a%7c%20project%20clusterId%0a)%20on%20clusterId%0a%7c%20project%20clusterId" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20or%20type%20%3d%7e%20%27Microsoft.ContainerService%2fmanagedClusters%27%20%7c%20extend%20clusterId%20%3d%20tolower(id)%20%7c%20project%20clusterId%0a%7c%20join%0a(%20kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20parse%20tolower(id)%20with%20clusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2ffluxconfigurations%27%20*%0a%7c%20project%20clusterId%0a)%20on%20clusterId%0a%7c%20project%20clusterId" target="_blank">portal.azure.cn</a>

---

### List all extensions installed on a virtual machine

First, this query uses `extend` on the virtual machines resource type to get the ID in uppercase (`toupper()`) the ID, get the operating system name and type, and get the virtual machine size. Getting the resource ID in uppercase is a good way to prepare to join to another property. Then, the query uses `join` with **kind** as _leftouter_ to get virtual machine extensions by matching an uppercase `substring` of the extension ID. The portion of the ID before "/extensions/\<ExtensionName\>" is the same format as the virtual machines ID, so we use this property for the `join`. `summarize` is then used with `make_list` on the name of the virtual machine extension to combine the name of each extension where _id_, _OSName_, _OSType_, and _VMSize_ are the same into a single array property. Lastly, we `order by` lowercase _OSName_ with **asc**. By default, `order by` is descending.

```kusto
Resources
| where type == 'microsoft.compute/virtualmachines'
| extend
	JoinID = toupper(id),
	OSName = tostring(properties.osProfile.computerName),
	OSType = tostring(properties.storageProfile.osDisk.osType),
	VMSize = tostring(properties.hardwareProfile.vmSize)
| join kind=leftouter(
	Resources
	| where type == 'microsoft.compute/virtualmachines/extensions'
	| extend 
		VMId = toupper(substring(id, 0, indexof(id, '/extensions'))),
		ExtensionName = name
) on $left.JoinID == $right.VMId
| summarize Extensions = make_list(ExtensionName) by id, OSName, OSType, VMSize
| order by tolower(OSName) asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type == 'microsoft.compute/virtualmachines' | extend JoinID = toupper(id), OSName = tostring(properties.osProfile.computerName), OSType = tostring(properties.storageProfile.osDisk.osType), VMSize = tostring(properties.hardwareProfile.vmSize) | join kind=leftouter( Resources | where type == 'microsoft.compute/virtualmachines/extensions' | extend  VMId = toupper(substring(id, 0, indexof(id, '/extensions'))),  ExtensionName = name ) on \$left.JoinID == \$right.VMId | summarize Extensions = make_list(ExtensionName) by id, OSName, OSType, VMSize | order by tolower(OSName) asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type == 'microsoft.compute/virtualmachines' | extend JoinID = toupper(id), OSName = tostring(properties.osProfile.computerName), OSType = tostring(properties.storageProfile.osDisk.osType), VMSize = tostring(properties.hardwareProfile.vmSize) | join kind=leftouter( Resources | where type == 'microsoft.compute/virtualmachines/extensions' | extend  VMId = toupper(substring(id, 0, indexof(id, '/extensions'))),  ExtensionName = name ) on $left.JoinID == $right.VMId | summarize Extensions = make_list(ExtensionName) by id, OSName, OSType, VMSize | order by tolower(OSName) asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20extend%0a%09JoinID%20%3d%20toupper(id)%2c%0a%09OSName%20%3d%20tostring(properties.osProfile.computerName)%2c%0a%09OSType%20%3d%20tostring(properties.storageProfile.osDisk.osType)%2c%0a%09VMSize%20%3d%20tostring(properties.hardwareProfile.vmSize)%0a%7c%20join%20kind%3dleftouter(%0a%09Resources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%2fextensions%27%0a%09%7c%20extend%20%0a%09%09VMId%20%3d%20toupper(substring(id%2c%200%2c%20indexof(id%2c%20%27%2fextensions%27)))%2c%0a%09%09ExtensionName%20%3d%20name%0a)%20on%20%24left.JoinID%20%3d%3d%20%24right.VMId%0a%7c%20summarize%20Extensions%20%3d%20make_list(ExtensionName)%20by%20id%2c%20OSName%2c%20OSType%2c%20VMSize%0a%7c%20order%20by%20tolower(OSName)%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20extend%0a%09JoinID%20%3d%20toupper(id)%2c%0a%09OSName%20%3d%20tostring(properties.osProfile.computerName)%2c%0a%09OSType%20%3d%20tostring(properties.storageProfile.osDisk.osType)%2c%0a%09VMSize%20%3d%20tostring(properties.hardwareProfile.vmSize)%0a%7c%20join%20kind%3dleftouter(%0a%09Resources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%2fextensions%27%0a%09%7c%20extend%20%0a%09%09VMId%20%3d%20toupper(substring(id%2c%200%2c%20indexof(id%2c%20%27%2fextensions%27)))%2c%0a%09%09ExtensionName%20%3d%20name%0a)%20on%20%24left.JoinID%20%3d%3d%20%24right.VMId%0a%7c%20summarize%20Extensions%20%3d%20make_list(ExtensionName)%20by%20id%2c%20OSName%2c%20OSType%2c%20VMSize%0a%7c%20order%20by%20tolower(OSName)%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20extend%0a%09JoinID%20%3d%20toupper(id)%2c%0a%09OSName%20%3d%20tostring(properties.osProfile.computerName)%2c%0a%09OSType%20%3d%20tostring(properties.storageProfile.osDisk.osType)%2c%0a%09VMSize%20%3d%20tostring(properties.hardwareProfile.vmSize)%0a%7c%20join%20kind%3dleftouter(%0a%09Resources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%2fextensions%27%0a%09%7c%20extend%20%0a%09%09VMId%20%3d%20toupper(substring(id%2c%200%2c%20indexof(id%2c%20%27%2fextensions%27)))%2c%0a%09%09ExtensionName%20%3d%20name%0a)%20on%20%24left.JoinID%20%3d%3d%20%24right.VMId%0a%7c%20summarize%20Extensions%20%3d%20make_list(ExtensionName)%20by%20id%2c%20OSName%2c%20OSType%2c%20VMSize%0a%7c%20order%20by%20tolower(OSName)%20asc" target="_blank">portal.azure.cn</a>

---

### List all extensions installed on an Azure Arc-enabled server

First, this query uses `project` on the hybrid machine resource type to get the ID in uppercase (`toupper()`), get the computer name, and the operating system running on the machine. Getting the resource ID in uppercase is a good way to prepare to `join` to another property. Then, the query uses `join` with **kind** as _leftouter_ to get extensions by matching an uppercase `substring` of the extension ID. The portion of the ID before `/extensions/<ExtensionName>` is the same format as the hybrid machine ID, so we use this property for the `join`. `summarize` is then used with `make_list` on the name of the virtual machine extension to combine the name of each extension where _id_, _OSName_, and _ComputerName_ are the same into a single array property. Lastly, we order by lowercase _OSName_ with **asc**. By default, `order by` is descending.

```kusto
Resources
| where type == 'microsoft.hybridcompute/machines'
| project
	id,
	JoinID = toupper(id),
	ComputerName = tostring(properties.osProfile.computerName),
	OSName = tostring(properties.osName)
| join kind=leftouter(
	Resources
	| where type == 'microsoft.hybridcompute/machines/extensions'
	| project
		MachineId = toupper(substring(id, 0, indexof(id, '/extensions'))),
		ExtensionName = name
) on $left.JoinID == $right.MachineId
| summarize Extensions = make_list(ExtensionName) by id, ComputerName, OSName
| order by tolower(OSName) asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type == 'microsoft.hybridcompute/machines' | project id, JoinID = toupper(id), ComputerName = tostring(properties.osProfile.computerName), OSName = tostring(properties.osName) | join kind=leftouter( Resources | where type == 'microsoft.hybridcompute/machines/extensions' | project  MachineId = toupper(substring(id, 0, indexof(id, '/extensions'))),  ExtensionName = name ) on \$left.JoinID == \$right.MachineId | summarize Extensions = make_list(ExtensionName) by id, ComputerName, OSName | order by tolower(OSName) asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type == 'microsoft.hybridcompute/machines' | project id, JoinID = toupper(id), ComputerName = tostring(properties.osProfile.computerName), OSName = tostring(properties.osName) | join kind=leftouter( Resources | where type == 'microsoft.hybridcompute/machines/extensions' | project  MachineId = toupper(substring(id, 0, indexof(id, '/extensions'))),  ExtensionName = name ) on $left.JoinID == $right.MachineId | summarize Extensions = make_list(ExtensionName) by id, ComputerName, OSName | order by tolower(OSName) asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%27%0a%7c%20project%0a%09id%2c%0a%09JoinID%20%3d%20toupper(id)%2c%0a%09ComputerName%20%3d%20tostring(properties.osProfile.computerName)%2c%0a%09OSName%20%3d%20tostring(properties.osName)%0a%7c%20join%20kind%3dleftouter(%0a%09Resources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%2fextensions%27%0a%09%7c%20project%0a%09%09MachineId%20%3d%20toupper(substring(id%2c%200%2c%20indexof(id%2c%20%27%2fextensions%27)))%2c%0a%09%09ExtensionName%20%3d%20name%0a)%20on%20%24left.JoinID%20%3d%3d%20%24right.MachineId%0a%7c%20summarize%20Extensions%20%3d%20make_list(ExtensionName)%20by%20id%2c%20ComputerName%2c%20OSName%0a%7c%20order%20by%20tolower(OSName)%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%27%0a%7c%20project%0a%09id%2c%0a%09JoinID%20%3d%20toupper(id)%2c%0a%09ComputerName%20%3d%20tostring(properties.osProfile.computerName)%2c%0a%09OSName%20%3d%20tostring(properties.osName)%0a%7c%20join%20kind%3dleftouter(%0a%09Resources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%2fextensions%27%0a%09%7c%20project%0a%09%09MachineId%20%3d%20toupper(substring(id%2c%200%2c%20indexof(id%2c%20%27%2fextensions%27)))%2c%0a%09%09ExtensionName%20%3d%20name%0a)%20on%20%24left.JoinID%20%3d%3d%20%24right.MachineId%0a%7c%20summarize%20Extensions%20%3d%20make_list(ExtensionName)%20by%20id%2c%20ComputerName%2c%20OSName%0a%7c%20order%20by%20tolower(OSName)%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%27%0a%7c%20project%0a%09id%2c%0a%09JoinID%20%3d%20toupper(id)%2c%0a%09ComputerName%20%3d%20tostring(properties.osProfile.computerName)%2c%0a%09OSName%20%3d%20tostring(properties.osName)%0a%7c%20join%20kind%3dleftouter(%0a%09Resources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%2fextensions%27%0a%09%7c%20project%0a%09%09MachineId%20%3d%20toupper(substring(id%2c%200%2c%20indexof(id%2c%20%27%2fextensions%27)))%2c%0a%09%09ExtensionName%20%3d%20name%0a)%20on%20%24left.JoinID%20%3d%3d%20%24right.MachineId%0a%7c%20summarize%20Extensions%20%3d%20make_list(ExtensionName)%20by%20id%2c%20ComputerName%2c%20OSName%0a%7c%20order%20by%20tolower(OSName)%20asc" target="_blank">portal.azure.cn</a>

---

### List All Flux Configurations that Are in a Non-Compliant State

Returns the fluxConfiguration Ids of configurations that are failing to sync resources on the cluster.

```kusto
kubernetesconfigurationresources
| where type == 'microsoft.kubernetesconfiguration/fluxconfigurations'
| where properties.complianceState == 'Non-Compliant'
| project id
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "kubernetesconfigurationresources | where type == 'microsoft.kubernetesconfiguration/fluxconfigurations' | where properties.complianceState == 'Non-Compliant' | project id"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "kubernetesconfigurationresources | where type == 'microsoft.kubernetesconfiguration/fluxconfigurations' | where properties.complianceState == 'Non-Compliant' | project id"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20where%20properties.complianceState%20%3d%3d%20%27Non-Compliant%27%0a%7c%20project%20id" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20where%20properties.complianceState%20%3d%3d%20%27Non-Compliant%27%0a%7c%20project%20id" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20where%20properties.complianceState%20%3d%3d%20%27Non-Compliant%27%0a%7c%20project%20id" target="_blank">portal.azure.cn</a>

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

### List all storage accounts with specific tag value

Combine the filter functionality of the previous example and filter Azure resource type by **type** property. This query also limits our search for specific types of Azure resources with a specific tag name and value.

```kusto
Resources
| where type =~ 'Microsoft.Storage/storageAccounts'
| where tags['tag with a space']=='Custom value'
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'Microsoft.Storage/storageAccounts' | where tags['tag with a space']=='Custom value'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Storage/storageAccounts' | where tags['tag with a space']=='Custom value'"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Storage%2fstorageAccounts%27%0a%7c%20where%20tags%5b%27tag%20with%20a%20space%27%5d%3d%3d%27Custom%20value%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Storage%2fstorageAccounts%27%0a%7c%20where%20tags%5b%27tag%20with%20a%20space%27%5d%3d%3d%27Custom%20value%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Storage%2fstorageAccounts%27%0a%7c%20where%20tags%5b%27tag%20with%20a%20space%27%5d%3d%3d%27Custom%20value%27" target="_blank">portal.azure.cn</a>

---

### List all tag names

This query starts with the tag and builds a JSON object listing all unique tag names and their corresponding types.

```kusto
Resources
| project tags
| summarize buildschema(tags)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | project tags | summarize buildschema(tags)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | project tags | summarize buildschema(tags)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20tags%0a%7c%20summarize%20buildschema(tags)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20tags%0a%7c%20summarize%20buildschema(tags)" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20tags%0a%7c%20summarize%20buildschema(tags)" target="_blank">portal.azure.cn</a>

---

### List all tags and their values

This query lists tags on management groups, subscriptions, and resources along with their values. The query first limits to resources where tags `isnotempty()`, limits the included fields by only including _tags_ in the `project`, and `mvexpand` and `extend` to get the paired data from the property bag. It then uses `union` to combine the results from _ResourceContainers_ to the same results from _Resources_, giving broad coverage to which tags are fetched. Last, it limits the results to `distinct` paired data and excludes system-hidden tags.

```kusto
ResourceContainers
| where isnotempty(tags)
| project tags
| mvexpand tags
| extend tagKey = tostring(bag_keys(tags)[0])
| extend tagValue = tostring(tags[tagKey])
| union (
	resources
	| where isnotempty(tags)
	| project tags
	| mvexpand tags
	| extend tagKey = tostring(bag_keys(tags)[0])
	| extend tagValue = tostring(tags[tagKey])
)
| distinct tagKey, tagValue
| where tagKey !startswith "hidden-"
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ResourceContainers | where isnotempty(tags) | project tags | mvexpand tags | extend tagKey = tostring(bag_keys(tags)[0]) | extend tagValue = tostring(tags[tagKey]) | union ( resources | where isnotempty(tags) | project tags | mvexpand tags | extend tagKey = tostring(bag_keys(tags)[0]) | extend tagValue = tostring(tags[tagKey]) ) | distinct tagKey, tagValue | where tagKey !startswith "hidden-""
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ResourceContainers | where isnotempty(tags) | project tags | mvexpand tags | extend tagKey = tostring(bag_keys(tags)[0]) | extend tagValue = tostring(tags[tagKey]) | union ( resources | where isnotempty(tags) | project tags | mvexpand tags | extend tagKey = tostring(bag_keys(tags)[0]) | extend tagValue = tostring(tags[tagKey]) ) | distinct tagKey, tagValue | where tagKey !startswith "hidden-""
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20isnotempty(tags)%0a%7c%20project%20tags%0a%7c%20mvexpand%20tags%0a%7c%20extend%20tagKey%20%3d%20tostring(bag_keys(tags)%5b0%5d)%0a%7c%20extend%20tagValue%20%3d%20tostring(tags%5btagKey%5d)%0a%7c%20union%20(%0a%09resources%0a%09%7c%20where%20isnotempty(tags)%0a%09%7c%20project%20tags%0a%09%7c%20mvexpand%20tags%0a%09%7c%20extend%20tagKey%20%3d%20tostring(bag_keys(tags)%5b0%5d)%0a%09%7c%20extend%20tagValue%20%3d%20tostring(tags%5btagKey%5d)%0a)%0a%7c%20distinct%20tagKey%2c%20tagValue%0a%7c%20where%20tagKey%20!startswith%20%22hidden-%22" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20isnotempty(tags)%0a%7c%20project%20tags%0a%7c%20mvexpand%20tags%0a%7c%20extend%20tagKey%20%3d%20tostring(bag_keys(tags)%5b0%5d)%0a%7c%20extend%20tagValue%20%3d%20tostring(tags%5btagKey%5d)%0a%7c%20union%20(%0a%09resources%0a%09%7c%20where%20isnotempty(tags)%0a%09%7c%20project%20tags%0a%09%7c%20mvexpand%20tags%0a%09%7c%20extend%20tagKey%20%3d%20tostring(bag_keys(tags)%5b0%5d)%0a%09%7c%20extend%20tagValue%20%3d%20tostring(tags%5btagKey%5d)%0a)%0a%7c%20distinct%20tagKey%2c%20tagValue%0a%7c%20where%20tagKey%20!startswith%20%22hidden-%22" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20isnotempty(tags)%0a%7c%20project%20tags%0a%7c%20mvexpand%20tags%0a%7c%20extend%20tagKey%20%3d%20tostring(bag_keys(tags)%5b0%5d)%0a%7c%20extend%20tagValue%20%3d%20tostring(tags%5btagKey%5d)%0a%7c%20union%20(%0a%09resources%0a%09%7c%20where%20isnotempty(tags)%0a%09%7c%20project%20tags%0a%09%7c%20mvexpand%20tags%0a%09%7c%20extend%20tagKey%20%3d%20tostring(bag_keys(tags)%5b0%5d)%0a%09%7c%20extend%20tagValue%20%3d%20tostring(tags%5btagKey%5d)%0a)%0a%7c%20distinct%20tagKey%2c%20tagValue%0a%7c%20where%20tagKey%20!startswith%20%22hidden-%22" target="_blank">portal.azure.cn</a>

---

### List Arc-enabled servers not running latest released agent version

This query returns all Arc-enabled servers running an outdated version of the Connected Machine agent. Agents with a status of **Expired** are excluded from the results. The query uses _leftouter_ `join` to bring together the Advisor recommendations raised about any Connected Machine agents identified as out of date, and Hybrid Computer machines to filter out any agent that haven't communicated with Azure over a period of time.

```kusto
AdvisorResources
| where type == 'microsoft.advisor/recommendations'
| where properties.category == 'HighAvailability'
| where properties.shortDescription.solution == 'Upgrade to the latest version of the Azure Connected Machine agent'
| project
		id,
		JoinId = toupper(properties.resourceMetadata.resourceId),
		machineName = tostring(properties.impactedValue),
		agentVersion = tostring(properties.extendedProperties.installedVersion),
		expectedVersion = tostring(properties.extendedProperties.latestVersion)
| join kind=leftouter(
	Resources
	| where type == 'microsoft.hybridcompute/machines'
	| project
		machineId = toupper(id),
		status = tostring (properties.status)
	) on $left.JoinId == $right.machineId
| where status != 'Expired'
| summarize by id, machineName, agentVersion, expectedVersion
| order by tolower(machineName) asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "AdvisorResources | where type == 'microsoft.advisor/recommendations' | where properties.category == 'HighAvailability' | where properties.shortDescription.solution == 'Upgrade to the latest version of the Azure Connected Machine agent' | project  id,  JoinId = toupper(properties.resourceMetadata.resourceId),  machineName = tostring(properties.impactedValue),  agentVersion = tostring(properties.extendedProperties.installedVersion),  expectedVersion = tostring(properties.extendedProperties.latestVersion) | join kind=leftouter( Resources | where type == 'microsoft.hybridcompute/machines' | project  machineId = toupper(id),  status = tostring (properties.status) ) on \$left.JoinId == \$right.machineId | where status != 'Expired' | summarize by id, machineName, agentVersion, expectedVersion | order by tolower(machineName) asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "AdvisorResources | where type == 'microsoft.advisor/recommendations' | where properties.category == 'HighAvailability' | where properties.shortDescription.solution == 'Upgrade to the latest version of the Azure Connected Machine agent' | project  id,  JoinId = toupper(properties.resourceMetadata.resourceId),  machineName = tostring(properties.impactedValue),  agentVersion = tostring(properties.extendedProperties.installedVersion),  expectedVersion = tostring(properties.extendedProperties.latestVersion) | join kind=leftouter( Resources | where type == 'microsoft.hybridcompute/machines' | project  machineId = toupper(id),  status = tostring (properties.status) ) on $left.JoinId == $right.machineId | where status != 'Expired' | summarize by id, machineName, agentVersion, expectedVersion | order by tolower(machineName) asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/AdvisorResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.advisor%2frecommendations%27%0a%7c%20where%20properties.category%20%3d%3d%20%27HighAvailability%27%0a%7c%20where%20properties.shortDescription.solution%20%3d%3d%20%27Upgrade%20to%20the%20latest%20version%20of%20the%20Azure%20Connected%20Machine%20agent%27%0a%7c%20project%0a%09%09id%2c%0a%09%09JoinId%20%3d%20toupper(properties.resourceMetadata.resourceId)%2c%0a%09%09machineName%20%3d%20tostring(properties.impactedValue)%2c%0a%09%09agentVersion%20%3d%20tostring(properties.extendedProperties.installedVersion)%2c%0a%09%09expectedVersion%20%3d%20tostring(properties.extendedProperties.latestVersion)%0a%7c%20join%20kind%3dleftouter(%0a%09Resources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%27%0a%09%7c%20project%0a%09%09machineId%20%3d%20toupper(id)%2c%0a%09%09status%20%3d%20tostring%20(properties.status)%0a%09)%20on%20%24left.JoinId%20%3d%3d%20%24right.machineId%0a%7c%20where%20status%20!%3d%20%27Expired%27%0a%7c%20summarize%20by%20id%2c%20machineName%2c%20agentVersion%2c%20expectedVersion%0a%7c%20order%20by%20tolower(machineName)%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/AdvisorResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.advisor%2frecommendations%27%0a%7c%20where%20properties.category%20%3d%3d%20%27HighAvailability%27%0a%7c%20where%20properties.shortDescription.solution%20%3d%3d%20%27Upgrade%20to%20the%20latest%20version%20of%20the%20Azure%20Connected%20Machine%20agent%27%0a%7c%20project%0a%09%09id%2c%0a%09%09JoinId%20%3d%20toupper(properties.resourceMetadata.resourceId)%2c%0a%09%09machineName%20%3d%20tostring(properties.impactedValue)%2c%0a%09%09agentVersion%20%3d%20tostring(properties.extendedProperties.installedVersion)%2c%0a%09%09expectedVersion%20%3d%20tostring(properties.extendedProperties.latestVersion)%0a%7c%20join%20kind%3dleftouter(%0a%09Resources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%27%0a%09%7c%20project%0a%09%09machineId%20%3d%20toupper(id)%2c%0a%09%09status%20%3d%20tostring%20(properties.status)%0a%09)%20on%20%24left.JoinId%20%3d%3d%20%24right.machineId%0a%7c%20where%20status%20!%3d%20%27Expired%27%0a%7c%20summarize%20by%20id%2c%20machineName%2c%20agentVersion%2c%20expectedVersion%0a%7c%20order%20by%20tolower(machineName)%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/AdvisorResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.advisor%2frecommendations%27%0a%7c%20where%20properties.category%20%3d%3d%20%27HighAvailability%27%0a%7c%20where%20properties.shortDescription.solution%20%3d%3d%20%27Upgrade%20to%20the%20latest%20version%20of%20the%20Azure%20Connected%20Machine%20agent%27%0a%7c%20project%0a%09%09id%2c%0a%09%09JoinId%20%3d%20toupper(properties.resourceMetadata.resourceId)%2c%0a%09%09machineName%20%3d%20tostring(properties.impactedValue)%2c%0a%09%09agentVersion%20%3d%20tostring(properties.extendedProperties.installedVersion)%2c%0a%09%09expectedVersion%20%3d%20tostring(properties.extendedProperties.latestVersion)%0a%7c%20join%20kind%3dleftouter(%0a%09Resources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.hybridcompute%2fmachines%27%0a%09%7c%20project%0a%09%09machineId%20%3d%20toupper(id)%2c%0a%09%09status%20%3d%20tostring%20(properties.status)%0a%09)%20on%20%24left.JoinId%20%3d%3d%20%24right.machineId%0a%7c%20where%20status%20!%3d%20%27Expired%27%0a%7c%20summarize%20by%20id%2c%20machineName%2c%20agentVersion%2c%20expectedVersion%0a%7c%20order%20by%20tolower(machineName)%20asc" target="_blank">portal.azure.cn</a>

---

### List Azure Arc-enabled custom locations with VMware or SCVMM enabled

Provides a list of all Azure Arc-enabled custom locations that have either VMware or SCVMM resource types enabled.

```kusto
Resources
| where type =~ 'microsoft.extendedlocation/customlocations' and properties.provisioningState =~ 'succeeded'
| extend clusterExtensionIds=properties.clusterExtensionIds
| mvexpand clusterExtensionIds
| extend clusterExtensionId = tolower(clusterExtensionIds)
| join kind=leftouter(
	ExtendedLocationResources
	| where type =~ 'microsoft.extendedlocation/customLocations/enabledResourcetypes'
	| project clusterExtensionId = tolower(properties.clusterExtensionId), extensionType = tolower(properties.extensionType)
	| where extensionType in~ ('microsoft.scvmm','microsoft.vmware')
) on clusterExtensionId
| where extensionType in~ ('microsoft.scvmm','microsoft.vmware')
| summarize virtualMachineKindsEnabled=make_set(extensionType) by id,name,location
| sort by name asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.extendedlocation/customlocations' and properties.provisioningState =~ 'succeeded' | extend clusterExtensionIds=properties.clusterExtensionIds | mvexpand clusterExtensionIds | extend clusterExtensionId = tolower(clusterExtensionIds) | join kind=leftouter( ExtendedLocationResources | where type =~ 'microsoft.extendedlocation/customLocations/enabledResourcetypes' | project clusterExtensionId = tolower(properties.clusterExtensionId), extensionType = tolower(properties.extensionType) | where extensionType in~ ('microsoft.scvmm','microsoft.vmware') ) on clusterExtensionId | where extensionType in~ ('microsoft.scvmm','microsoft.vmware') | summarize virtualMachineKindsEnabled=make_set(extensionType) by id,name,location | sort by name asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.extendedlocation/customlocations' and properties.provisioningState =~ 'succeeded' | extend clusterExtensionIds=properties.clusterExtensionIds | mvexpand clusterExtensionIds | extend clusterExtensionId = tolower(clusterExtensionIds) | join kind=leftouter( ExtendedLocationResources | where type =~ 'microsoft.extendedlocation/customLocations/enabledResourcetypes' | project clusterExtensionId = tolower(properties.clusterExtensionId), extensionType = tolower(properties.extensionType) | where extensionType in~ ('microsoft.scvmm','microsoft.vmware') ) on clusterExtensionId | where extensionType in~ ('microsoft.scvmm','microsoft.vmware') | summarize virtualMachineKindsEnabled=make_set(extensionType) by id,name,location | sort by name asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.extendedlocation%2fcustomlocations%27%20and%20properties.provisioningState%20%3d%7e%20%27succeeded%27%0a%7c%20extend%20clusterExtensionIds%3dproperties.clusterExtensionIds%0a%7c%20mvexpand%20clusterExtensionIds%0a%7c%20extend%20clusterExtensionId%20%3d%20tolower(clusterExtensionIds)%0a%7c%20join%20kind%3dleftouter(%0a%09ExtendedLocationResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.extendedlocation%2fcustomLocations%2fenabledResourcetypes%27%0a%09%7c%20project%20clusterExtensionId%20%3d%20tolower(properties.clusterExtensionId)%2c%20extensionType%20%3d%20tolower(properties.extensionType)%0a%09%7c%20where%20extensionType%20in%7e%20(%27microsoft.scvmm%27%2c%27microsoft.vmware%27)%0a)%20on%20clusterExtensionId%0a%7c%20where%20extensionType%20in%7e%20(%27microsoft.scvmm%27%2c%27microsoft.vmware%27)%0a%7c%20summarize%20virtualMachineKindsEnabled%3dmake_set(extensionType)%20by%20id%2cname%2clocation%0a%7c%20sort%20by%20name%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.extendedlocation%2fcustomlocations%27%20and%20properties.provisioningState%20%3d%7e%20%27succeeded%27%0a%7c%20extend%20clusterExtensionIds%3dproperties.clusterExtensionIds%0a%7c%20mvexpand%20clusterExtensionIds%0a%7c%20extend%20clusterExtensionId%20%3d%20tolower(clusterExtensionIds)%0a%7c%20join%20kind%3dleftouter(%0a%09ExtendedLocationResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.extendedlocation%2fcustomLocations%2fenabledResourcetypes%27%0a%09%7c%20project%20clusterExtensionId%20%3d%20tolower(properties.clusterExtensionId)%2c%20extensionType%20%3d%20tolower(properties.extensionType)%0a%09%7c%20where%20extensionType%20in%7e%20(%27microsoft.scvmm%27%2c%27microsoft.vmware%27)%0a)%20on%20clusterExtensionId%0a%7c%20where%20extensionType%20in%7e%20(%27microsoft.scvmm%27%2c%27microsoft.vmware%27)%0a%7c%20summarize%20virtualMachineKindsEnabled%3dmake_set(extensionType)%20by%20id%2cname%2clocation%0a%7c%20sort%20by%20name%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.extendedlocation%2fcustomlocations%27%20and%20properties.provisioningState%20%3d%7e%20%27succeeded%27%0a%7c%20extend%20clusterExtensionIds%3dproperties.clusterExtensionIds%0a%7c%20mvexpand%20clusterExtensionIds%0a%7c%20extend%20clusterExtensionId%20%3d%20tolower(clusterExtensionIds)%0a%7c%20join%20kind%3dleftouter(%0a%09ExtendedLocationResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.extendedlocation%2fcustomLocations%2fenabledResourcetypes%27%0a%09%7c%20project%20clusterExtensionId%20%3d%20tolower(properties.clusterExtensionId)%2c%20extensionType%20%3d%20tolower(properties.extensionType)%0a%09%7c%20where%20extensionType%20in%7e%20(%27microsoft.scvmm%27%2c%27microsoft.vmware%27)%0a)%20on%20clusterExtensionId%0a%7c%20where%20extensionType%20in%7e%20(%27microsoft.scvmm%27%2c%27microsoft.vmware%27)%0a%7c%20summarize%20virtualMachineKindsEnabled%3dmake_set(extensionType)%20by%20id%2cname%2clocation%0a%7c%20sort%20by%20name%20asc" target="_blank">portal.azure.cn</a>

---

### List Azure Cosmos DB with specific write locations

The following query limits to Azure Cosmos DB resources, uses `mv-expand` to expand the property bag for **properties.writeLocations**, then project specific fields and limit the results further to **properties.writeLocations.locationName** values matching either 'East US' or 'West US'.

```kusto
Resources
| where type =~ 'microsoft.documentdb/databaseaccounts'
| project id, name, writeLocations = (properties.writeLocations)
| mv-expand writeLocations
| project id, name, writeLocation = tostring(writeLocations.locationName)
| where writeLocation in ('East US', 'West US')
| summarize by id, name
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.documentdb/databaseaccounts' | project id, name, writeLocations = (properties.writeLocations) | mv-expand writeLocations | project id, name, writeLocation = tostring(writeLocations.locationName) | where writeLocation in ('East US', 'West US') | summarize by id, name"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.documentdb/databaseaccounts' | project id, name, writeLocations = (properties.writeLocations) | mv-expand writeLocations | project id, name, writeLocation = tostring(writeLocations.locationName) | where writeLocation in ('East US', 'West US') | summarize by id, name"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.documentdb%2fdatabaseaccounts%27%0a%7c%20project%20id%2c%20name%2c%20writeLocations%20%3d%20(properties.writeLocations)%0a%7c%20mv-expand%20writeLocations%0a%7c%20project%20id%2c%20name%2c%20writeLocation%20%3d%20tostring(writeLocations.locationName)%0a%7c%20where%20writeLocation%20in%20(%27East%20US%27%2c%20%27West%20US%27)%0a%7c%20summarize%20by%20id%2c%20name" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.documentdb%2fdatabaseaccounts%27%0a%7c%20project%20id%2c%20name%2c%20writeLocations%20%3d%20(properties.writeLocations)%0a%7c%20mv-expand%20writeLocations%0a%7c%20project%20id%2c%20name%2c%20writeLocation%20%3d%20tostring(writeLocations.locationName)%0a%7c%20where%20writeLocation%20in%20(%27East%20US%27%2c%20%27West%20US%27)%0a%7c%20summarize%20by%20id%2c%20name" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.documentdb%2fdatabaseaccounts%27%0a%7c%20project%20id%2c%20name%2c%20writeLocations%20%3d%20(properties.writeLocations)%0a%7c%20mv-expand%20writeLocations%0a%7c%20project%20id%2c%20name%2c%20writeLocation%20%3d%20tostring(writeLocations.locationName)%0a%7c%20where%20writeLocation%20in%20(%27East%20US%27%2c%20%27West%20US%27)%0a%7c%20summarize%20by%20id%2c%20name" target="_blank">portal.azure.cn</a>

---

### List impacted resources when transferring an Azure subscription

Returns some of the Azure resources that are impacted when you transfer a subscription to a different Azure Active Directory (Azure AD) directory. You will need to re-create some of the resources that existed prior to the subscription transfer.

```kusto
Resources
| where type in (
	'microsoft.managedidentity/userassignedidentities',
	'microsoft.keyvault/vaults',
	'microsoft.sql/servers/databases',
	'microsoft.datalakestore/accounts',
	'microsoft.containerservice/managedclusters')
	or identity has 'SystemAssigned'
	or (type =~ 'microsoft.storage/storageaccounts' and properties['isHnsEnabled'] == true)
| summarize count() by type
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type in ( 'microsoft.managedidentity/userassignedidentities', 'microsoft.keyvault/vaults', 'microsoft.sql/servers/databases', 'microsoft.datalakestore/accounts', 'microsoft.containerservice/managedclusters') or identity has 'SystemAssigned' or (type =~ 'microsoft.storage/storageaccounts' and properties['isHnsEnabled'] == true) | summarize count() by type"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type in ( 'microsoft.managedidentity/userassignedidentities', 'microsoft.keyvault/vaults', 'microsoft.sql/servers/databases', 'microsoft.datalakestore/accounts', 'microsoft.containerservice/managedclusters') or identity has 'SystemAssigned' or (type =~ 'microsoft.storage/storageaccounts' and properties['isHnsEnabled'] == true) | summarize count() by type"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20in%20(%0a%09%27microsoft.managedidentity%2fuserassignedidentities%27%2c%0a%09%27microsoft.keyvault%2fvaults%27%2c%0a%09%27microsoft.sql%2fservers%2fdatabases%27%2c%0a%09%27microsoft.datalakestore%2faccounts%27%2c%0a%09%27microsoft.containerservice%2fmanagedclusters%27)%0a%09or%20identity%20has%20%27SystemAssigned%27%0a%09or%20(type%20%3d%7e%20%27microsoft.storage%2fstorageaccounts%27%20and%20properties%5b%27isHnsEnabled%27%5d%20%3d%3d%20true)%0a%7c%20summarize%20count()%20by%20type" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20in%20(%0a%09%27microsoft.managedidentity%2fuserassignedidentities%27%2c%0a%09%27microsoft.keyvault%2fvaults%27%2c%0a%09%27microsoft.sql%2fservers%2fdatabases%27%2c%0a%09%27microsoft.datalakestore%2faccounts%27%2c%0a%09%27microsoft.containerservice%2fmanagedclusters%27)%0a%09or%20identity%20has%20%27SystemAssigned%27%0a%09or%20(type%20%3d%7e%20%27microsoft.storage%2fstorageaccounts%27%20and%20properties%5b%27isHnsEnabled%27%5d%20%3d%3d%20true)%0a%7c%20summarize%20count()%20by%20type" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20in%20(%0a%09%27microsoft.managedidentity%2fuserassignedidentities%27%2c%0a%09%27microsoft.keyvault%2fvaults%27%2c%0a%09%27microsoft.sql%2fservers%2fdatabases%27%2c%0a%09%27microsoft.datalakestore%2faccounts%27%2c%0a%09%27microsoft.containerservice%2fmanagedclusters%27)%0a%09or%20identity%20has%20%27SystemAssigned%27%0a%09or%20(type%20%3d%7e%20%27microsoft.storage%2fstorageaccounts%27%20and%20properties%5b%27isHnsEnabled%27%5d%20%3d%3d%20true)%0a%7c%20summarize%20count()%20by%20type" target="_blank">portal.azure.cn</a>

---

### List machines that are not running and the last compliance status

Provides a list of a machines that aren't powered on with their configuration assignments and the last reported compliance status.

```kusto
Resources
| where type =~ 'Microsoft.Compute/virtualMachines'
| where properties.extended.instanceView.powerState.code != 'PowerState/running'
| project vmName = name, power = properties.extended.instanceView.powerState.code
| join kind = leftouter (GuestConfigurationResources
	| extend vmName = tostring(split(properties.targetResourceId,'/')[(-1)])
	| project vmName, name, compliance = properties.complianceStatus) on vmName | project-away vmName1
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | where properties.extended.instanceView.powerState.code != 'PowerState/running' | project vmName = name, power = properties.extended.instanceView.powerState.code | join kind = leftouter (GuestConfigurationResources | extend vmName = tostring(split(properties.targetResourceId,'/')[(-1)]) | project vmName, name, compliance = properties.complianceStatus) on vmName | project-away vmName1"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | where properties.extended.instanceView.powerState.code != 'PowerState/running' | project vmName = name, power = properties.extended.instanceView.powerState.code | join kind = leftouter (GuestConfigurationResources | extend vmName = tostring(split(properties.targetResourceId,'/')[(-1)]) | project vmName, name, compliance = properties.complianceStatus) on vmName | project-away vmName1"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20where%20properties.extended.instanceView.powerState.code%20!%3d%20%27PowerState%2frunning%27%0a%7c%20project%20vmName%20%3d%20name%2c%20power%20%3d%20properties.extended.instanceView.powerState.code%0a%7c%20join%20kind%20%3d%20leftouter%20(GuestConfigurationResources%0a%09%7c%20extend%20vmName%20%3d%20tostring(split(properties.targetResourceId%2c%27%2f%27)%5b(-1)%5d)%0a%09%7c%20project%20vmName%2c%20name%2c%20compliance%20%3d%20properties.complianceStatus)%20on%20vmName%20%7c%20project-away%20vmName1" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20where%20properties.extended.instanceView.powerState.code%20!%3d%20%27PowerState%2frunning%27%0a%7c%20project%20vmName%20%3d%20name%2c%20power%20%3d%20properties.extended.instanceView.powerState.code%0a%7c%20join%20kind%20%3d%20leftouter%20(GuestConfigurationResources%0a%09%7c%20extend%20vmName%20%3d%20tostring(split(properties.targetResourceId%2c%27%2f%27)%5b(-1)%5d)%0a%09%7c%20project%20vmName%2c%20name%2c%20compliance%20%3d%20properties.complianceStatus)%20on%20vmName%20%7c%20project-away%20vmName1" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20where%20properties.extended.instanceView.powerState.code%20!%3d%20%27PowerState%2frunning%27%0a%7c%20project%20vmName%20%3d%20name%2c%20power%20%3d%20properties.extended.instanceView.powerState.code%0a%7c%20join%20kind%20%3d%20leftouter%20(GuestConfigurationResources%0a%09%7c%20extend%20vmName%20%3d%20tostring(split(properties.targetResourceId%2c%27%2f%27)%5b(-1)%5d)%0a%09%7c%20project%20vmName%2c%20name%2c%20compliance%20%3d%20properties.complianceStatus)%20on%20vmName%20%7c%20project-away%20vmName1" target="_blank">portal.azure.cn</a>

---

### List of virtual machines by availability state and power state with Resource Ids and resource Groups

Returns list of virtual machines (type `Microsoft.Compute/virtualMachines`) aggregated on their power state and availability state to provide a cohesive state of health for your virtual machines. The query also provides details on the resource group and resource Id associated with each entry for detailed visibility into your resources.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| project resourceGroup, Id = tolower(id), PowerState = tostring( properties.extended.instanceView.powerState.code)
| join kind=leftouter (
	HealthResources
	| where type =~ 'microsoft.resourcehealth/availabilitystatuses'
	| where tostring(properties.targetResourceType) =~ 'microsoft.compute/virtualmachines'
	| project targetResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState))
	on $left.Id == $right.targetResourceId
| project-away targetResourceId
| where PowerState != 'PowerState/deallocated'
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.compute/virtualmachines' | project resourceGroup, Id = tolower(id), PowerState = tostring( properties.extended.instanceView.powerState.code) | join kind=leftouter ( HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | where tostring(properties.targetResourceType) =~ 'microsoft.compute/virtualmachines' | project targetResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)) on \$left.Id == \$right.targetResourceId | project-away targetResourceId | where PowerState != 'PowerState/deallocated'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.compute/virtualmachines' | project resourceGroup, Id = tolower(id), PowerState = tostring( properties.extended.instanceView.powerState.code) | join kind=leftouter ( HealthResources | where type =~ 'microsoft.resourcehealth/availabilitystatuses' | where tostring(properties.targetResourceType) =~ 'microsoft.compute/virtualmachines' | project targetResourceId = tolower(tostring(properties.targetResourceId)), AvailabilityState = tostring(properties.availabilityState)) on $left.Id == $right.targetResourceId | project-away targetResourceId | where PowerState != 'PowerState/deallocated'"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20project%20resourceGroup%2c%20Id%20%3d%20tolower(id)%2c%20PowerState%20%3d%20tostring(%20properties.extended.instanceView.powerState.code)%0a%7c%20join%20kind%3dleftouter%20(%0a%09HealthResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%09%7c%20where%20tostring(properties.targetResourceType)%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%09%7c%20project%20targetResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState))%0a%09on%20%24left.Id%20%3d%3d%20%24right.targetResourceId%0a%7c%20project-away%20targetResourceId%0a%7c%20where%20PowerState%20!%3d%20%27PowerState%2fdeallocated%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20project%20resourceGroup%2c%20Id%20%3d%20tolower(id)%2c%20PowerState%20%3d%20tostring(%20properties.extended.instanceView.powerState.code)%0a%7c%20join%20kind%3dleftouter%20(%0a%09HealthResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%09%7c%20where%20tostring(properties.targetResourceType)%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%09%7c%20project%20targetResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState))%0a%09on%20%24left.Id%20%3d%3d%20%24right.targetResourceId%0a%7c%20project-away%20targetResourceId%0a%7c%20where%20PowerState%20!%3d%20%27PowerState%2fdeallocated%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20project%20resourceGroup%2c%20Id%20%3d%20tolower(id)%2c%20PowerState%20%3d%20tostring(%20properties.extended.instanceView.powerState.code)%0a%7c%20join%20kind%3dleftouter%20(%0a%09HealthResources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.resourcehealth%2favailabilitystatuses%27%0a%09%7c%20where%20tostring(properties.targetResourceType)%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%09%7c%20project%20targetResourceId%20%3d%20tolower(tostring(properties.targetResourceId))%2c%20AvailabilityState%20%3d%20tostring(properties.availabilityState))%0a%09on%20%24left.Id%20%3d%3d%20%24right.targetResourceId%0a%7c%20project-away%20targetResourceId%0a%7c%20where%20PowerState%20!%3d%20%27PowerState%2fdeallocated%27" target="_blank">portal.azure.cn</a>

---

### List resources sorted by name

This query returns any type of resource, but only the **name**, **type**, and **location** properties. It uses `order by` to sort the properties by the **name** property in ascending (`asc`) order.

```kusto
Resources
| project name, type, location
| order by name asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | project name, type, location | order by name asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | project name, type, location | order by name asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20name%2c%20type%2c%20location%0a%7c%20order%20by%20name%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20name%2c%20type%2c%20location%0a%7c%20order%20by%20name%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20name%2c%20type%2c%20location%0a%7c%20order%20by%20name%20asc" target="_blank">portal.azure.cn</a>

---

### List resources with a specific tag value

We can limit the results by properties other than the Azure resource type, such as a tag. In this example, we're filtering for Azure resources with a tag name of **Environment** that have a value of **Internal**. To also provide what tags the resource has and their values, add the property **tags** to the `project` keyword.

```kusto
Resources
| where tags.environment=~'internal'
| project name, tags
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where tags.environment=~'internal' | project name, tags"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where tags.environment=~'internal' | project name, tags"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20tags.environment%3d%7e%27internal%27%0a%7c%20project%20name%2c%20tags" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20tags.environment%3d%7e%27internal%27%0a%7c%20project%20name%2c%20tags" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20tags.environment%3d%7e%27internal%27%0a%7c%20project%20name%2c%20tags" target="_blank">portal.azure.cn</a>

---

### List SQL Databases and their elastic pools

The following query uses **leftouter** `join` to bring together SQL Database resources and their related elastic pools, if they've any.

```kusto
Resources
| where type =~ 'microsoft.sql/servers/databases'
| project databaseId = id, databaseName = name, elasticPoolId = tolower(tostring(properties.elasticPoolId))
| join kind=leftouter (
	Resources
	| where type =~ 'microsoft.sql/servers/elasticpools'
	| project elasticPoolId = tolower(id), elasticPoolName = name, elasticPoolState = properties.state)
	on elasticPoolId
| project-away elasticPoolId1
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.sql/servers/databases' | project databaseId = id, databaseName = name, elasticPoolId = tolower(tostring(properties.elasticPoolId)) | join kind=leftouter ( Resources | where type =~ 'microsoft.sql/servers/elasticpools' | project elasticPoolId = tolower(id), elasticPoolName = name, elasticPoolState = properties.state) on elasticPoolId | project-away elasticPoolId1"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.sql/servers/databases' | project databaseId = id, databaseName = name, elasticPoolId = tolower(tostring(properties.elasticPoolId)) | join kind=leftouter ( Resources | where type =~ 'microsoft.sql/servers/elasticpools' | project elasticPoolId = tolower(id), elasticPoolName = name, elasticPoolState = properties.state) on elasticPoolId | project-away elasticPoolId1"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.sql%2fservers%2fdatabases%27%0a%7c%20project%20databaseId%20%3d%20id%2c%20databaseName%20%3d%20name%2c%20elasticPoolId%20%3d%20tolower(tostring(properties.elasticPoolId))%0a%7c%20join%20kind%3dleftouter%20(%0a%09Resources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.sql%2fservers%2felasticpools%27%0a%09%7c%20project%20elasticPoolId%20%3d%20tolower(id)%2c%20elasticPoolName%20%3d%20name%2c%20elasticPoolState%20%3d%20properties.state)%0a%09on%20elasticPoolId%0a%7c%20project-away%20elasticPoolId1" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.sql%2fservers%2fdatabases%27%0a%7c%20project%20databaseId%20%3d%20id%2c%20databaseName%20%3d%20name%2c%20elasticPoolId%20%3d%20tolower(tostring(properties.elasticPoolId))%0a%7c%20join%20kind%3dleftouter%20(%0a%09Resources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.sql%2fservers%2felasticpools%27%0a%09%7c%20project%20elasticPoolId%20%3d%20tolower(id)%2c%20elasticPoolName%20%3d%20name%2c%20elasticPoolState%20%3d%20properties.state)%0a%09on%20elasticPoolId%0a%7c%20project-away%20elasticPoolId1" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.sql%2fservers%2fdatabases%27%0a%7c%20project%20databaseId%20%3d%20id%2c%20databaseName%20%3d%20name%2c%20elasticPoolId%20%3d%20tolower(tostring(properties.elasticPoolId))%0a%7c%20join%20kind%3dleftouter%20(%0a%09Resources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.sql%2fservers%2felasticpools%27%0a%09%7c%20project%20elasticPoolId%20%3d%20tolower(id)%2c%20elasticPoolName%20%3d%20name%2c%20elasticPoolState%20%3d%20properties.state)%0a%09on%20elasticPoolId%0a%7c%20project-away%20elasticPoolId1" target="_blank">portal.azure.cn</a>

---

### List virtual machines with their network interface and public IP

This query uses two **leftouter** `join` commands to bring together virtual machines created with the Resource Manager deployment model, their related network interfaces, and any public IP address related to those network interfaces.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines'
| extend nics=array_length(properties.networkProfile.networkInterfaces)
| mv-expand nic=properties.networkProfile.networkInterfaces
| where nics == 1 or nic.properties.primary =~ 'true' or isempty(nic)
| project vmId = id, vmName = name, vmSize=tostring(properties.hardwareProfile.vmSize), nicId = tostring(nic.id)
| join kind=leftouter (
	Resources
	| where type =~ 'microsoft.network/networkinterfaces'
	| extend ipConfigsCount=array_length(properties.ipConfigurations)
	| mv-expand ipconfig=properties.ipConfigurations
	| where ipConfigsCount == 1 or ipconfig.properties.primary =~ 'true'
	| project nicId = id, publicIpId = tostring(ipconfig.properties.publicIPAddress.id))
	on nicId
| project-away nicId1
| summarize by vmId, vmName, vmSize, nicId, publicIpId
| join kind=leftouter (
	Resources
	| where type =~ 'microsoft.network/publicipaddresses'
	| project publicIpId = id, publicIpAddress = properties.ipAddress)
on publicIpId
| project-away publicIpId1
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.compute/virtualmachines' | extend nics=array_length(properties.networkProfile.networkInterfaces) | mv-expand nic=properties.networkProfile.networkInterfaces | where nics == 1 or nic.properties.primary =~ 'true' or isempty(nic) | project vmId = id, vmName = name, vmSize=tostring(properties.hardwareProfile.vmSize), nicId = tostring(nic.id) | join kind=leftouter ( Resources | where type =~ 'microsoft.network/networkinterfaces' | extend ipConfigsCount=array_length(properties.ipConfigurations) | mv-expand ipconfig=properties.ipConfigurations | where ipConfigsCount == 1 or ipconfig.properties.primary =~ 'true' | project nicId = id, publicIpId = tostring(ipconfig.properties.publicIPAddress.id)) on nicId | project-away nicId1 | summarize by vmId, vmName, vmSize, nicId, publicIpId | join kind=leftouter ( Resources | where type =~ 'microsoft.network/publicipaddresses' | project publicIpId = id, publicIpAddress = properties.ipAddress) on publicIpId | project-away publicIpId1"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.compute/virtualmachines' | extend nics=array_length(properties.networkProfile.networkInterfaces) | mv-expand nic=properties.networkProfile.networkInterfaces | where nics == 1 or nic.properties.primary =~ 'true' or isempty(nic) | project vmId = id, vmName = name, vmSize=tostring(properties.hardwareProfile.vmSize), nicId = tostring(nic.id) | join kind=leftouter ( Resources | where type =~ 'microsoft.network/networkinterfaces' | extend ipConfigsCount=array_length(properties.ipConfigurations) | mv-expand ipconfig=properties.ipConfigurations | where ipConfigsCount == 1 or ipconfig.properties.primary =~ 'true' | project nicId = id, publicIpId = tostring(ipconfig.properties.publicIPAddress.id)) on nicId | project-away nicId1 | summarize by vmId, vmName, vmSize, nicId, publicIpId | join kind=leftouter ( Resources | where type =~ 'microsoft.network/publicipaddresses' | project publicIpId = id, publicIpAddress = properties.ipAddress) on publicIpId | project-away publicIpId1"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20extend%20nics%3darray_length(properties.networkProfile.networkInterfaces)%0a%7c%20mv-expand%20nic%3dproperties.networkProfile.networkInterfaces%0a%7c%20where%20nics%20%3d%3d%201%20or%20nic.properties.primary%20%3d%7e%20%27true%27%20or%20isempty(nic)%0a%7c%20project%20vmId%20%3d%20id%2c%20vmName%20%3d%20name%2c%20vmSize%3dtostring(properties.hardwareProfile.vmSize)%2c%20nicId%20%3d%20tostring(nic.id)%0a%7c%20join%20kind%3dleftouter%20(%0a%09Resources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fnetworkinterfaces%27%0a%09%7c%20extend%20ipConfigsCount%3darray_length(properties.ipConfigurations)%0a%09%7c%20mv-expand%20ipconfig%3dproperties.ipConfigurations%0a%09%7c%20where%20ipConfigsCount%20%3d%3d%201%20or%20ipconfig.properties.primary%20%3d%7e%20%27true%27%0a%09%7c%20project%20nicId%20%3d%20id%2c%20publicIpId%20%3d%20tostring(ipconfig.properties.publicIPAddress.id))%0a%09on%20nicId%0a%7c%20project-away%20nicId1%0a%7c%20summarize%20by%20vmId%2c%20vmName%2c%20vmSize%2c%20nicId%2c%20publicIpId%0a%7c%20join%20kind%3dleftouter%20(%0a%09Resources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fpublicipaddresses%27%0a%09%7c%20project%20publicIpId%20%3d%20id%2c%20publicIpAddress%20%3d%20properties.ipAddress)%0aon%20publicIpId%0a%7c%20project-away%20publicIpId1" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20extend%20nics%3darray_length(properties.networkProfile.networkInterfaces)%0a%7c%20mv-expand%20nic%3dproperties.networkProfile.networkInterfaces%0a%7c%20where%20nics%20%3d%3d%201%20or%20nic.properties.primary%20%3d%7e%20%27true%27%20or%20isempty(nic)%0a%7c%20project%20vmId%20%3d%20id%2c%20vmName%20%3d%20name%2c%20vmSize%3dtostring(properties.hardwareProfile.vmSize)%2c%20nicId%20%3d%20tostring(nic.id)%0a%7c%20join%20kind%3dleftouter%20(%0a%09Resources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fnetworkinterfaces%27%0a%09%7c%20extend%20ipConfigsCount%3darray_length(properties.ipConfigurations)%0a%09%7c%20mv-expand%20ipconfig%3dproperties.ipConfigurations%0a%09%7c%20where%20ipConfigsCount%20%3d%3d%201%20or%20ipconfig.properties.primary%20%3d%7e%20%27true%27%0a%09%7c%20project%20nicId%20%3d%20id%2c%20publicIpId%20%3d%20tostring(ipconfig.properties.publicIPAddress.id))%0a%09on%20nicId%0a%7c%20project-away%20nicId1%0a%7c%20summarize%20by%20vmId%2c%20vmName%2c%20vmSize%2c%20nicId%2c%20publicIpId%0a%7c%20join%20kind%3dleftouter%20(%0a%09Resources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fpublicipaddresses%27%0a%09%7c%20project%20publicIpId%20%3d%20id%2c%20publicIpAddress%20%3d%20properties.ipAddress)%0aon%20publicIpId%0a%7c%20project-away%20publicIpId1" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20extend%20nics%3darray_length(properties.networkProfile.networkInterfaces)%0a%7c%20mv-expand%20nic%3dproperties.networkProfile.networkInterfaces%0a%7c%20where%20nics%20%3d%3d%201%20or%20nic.properties.primary%20%3d%7e%20%27true%27%20or%20isempty(nic)%0a%7c%20project%20vmId%20%3d%20id%2c%20vmName%20%3d%20name%2c%20vmSize%3dtostring(properties.hardwareProfile.vmSize)%2c%20nicId%20%3d%20tostring(nic.id)%0a%7c%20join%20kind%3dleftouter%20(%0a%09Resources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fnetworkinterfaces%27%0a%09%7c%20extend%20ipConfigsCount%3darray_length(properties.ipConfigurations)%0a%09%7c%20mv-expand%20ipconfig%3dproperties.ipConfigurations%0a%09%7c%20where%20ipConfigsCount%20%3d%3d%201%20or%20ipconfig.properties.primary%20%3d%7e%20%27true%27%0a%09%7c%20project%20nicId%20%3d%20id%2c%20publicIpId%20%3d%20tostring(ipconfig.properties.publicIPAddress.id))%0a%09on%20nicId%0a%7c%20project-away%20nicId1%0a%7c%20summarize%20by%20vmId%2c%20vmName%2c%20vmSize%2c%20nicId%2c%20publicIpId%0a%7c%20join%20kind%3dleftouter%20(%0a%09Resources%0a%09%7c%20where%20type%20%3d%7e%20%27microsoft.network%2fpublicipaddresses%27%0a%09%7c%20project%20publicIpId%20%3d%20id%2c%20publicIpAddress%20%3d%20properties.ipAddress)%0aon%20publicIpId%0a%7c%20project-away%20publicIpId1" target="_blank">portal.azure.cn</a>

---

### Remove columns from results

The following query uses `summarize` to count resources by subscription, `join` to combine it with subscription details from _ResourceContainers_ table, then `project-away` to remove some of the columns.

```kusto
Resources
| summarize resourceCount=count() by subscriptionId
| join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId
| project-away subscriptionId, subscriptionId1
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | summarize resourceCount=count() by subscriptionId | join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId | project-away subscriptionId, subscriptionId1"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | summarize resourceCount=count() by subscriptionId | join (ResourceContainers | where type=='microsoft.resources/subscriptions' | project SubName=name, subscriptionId) on subscriptionId | project-away subscriptionId, subscriptionId1"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20summarize%20resourceCount%3dcount()%20by%20subscriptionId%0a%7c%20join%20(ResourceContainers%20%7c%20where%20type%3d%3d%27microsoft.resources%2fsubscriptions%27%20%7c%20project%20SubName%3dname%2c%20subscriptionId)%20on%20subscriptionId%0a%7c%20project-away%20subscriptionId%2c%20subscriptionId1" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20summarize%20resourceCount%3dcount()%20by%20subscriptionId%0a%7c%20join%20(ResourceContainers%20%7c%20where%20type%3d%3d%27microsoft.resources%2fsubscriptions%27%20%7c%20project%20SubName%3dname%2c%20subscriptionId)%20on%20subscriptionId%0a%7c%20project-away%20subscriptionId%2c%20subscriptionId1" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20summarize%20resourceCount%3dcount()%20by%20subscriptionId%0a%7c%20join%20(ResourceContainers%20%7c%20where%20type%3d%3d%27microsoft.resources%2fsubscriptions%27%20%7c%20project%20SubName%3dname%2c%20subscriptionId)%20on%20subscriptionId%0a%7c%20project-away%20subscriptionId%2c%20subscriptionId1" target="_blank">portal.azure.cn</a>

---

### Show all virtual machines ordered by name in descending order

To list only virtual machines (which are type `Microsoft.Compute/virtualMachines`), we can match the property **type** in the results. Similar to the previous query, `desc` changes the `order by` to be descending. The `=~` in the type match tells Resource Graph to be case insensitive.

```kusto
Resources
| project name, location, type
| where type =~ 'Microsoft.Compute/virtualMachines'
| order by name desc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | project name, location, type | where type =~ 'Microsoft.Compute/virtualMachines' | order by name desc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | project name, location, type | where type =~ 'Microsoft.Compute/virtualMachines' | order by name desc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20name%2c%20location%2c%20type%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20order%20by%20name%20desc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20name%2c%20location%2c%20type%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20order%20by%20name%20desc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20project%20name%2c%20location%2c%20type%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20order%20by%20name%20desc" target="_blank">portal.azure.cn</a>

---

### Show first five virtual machines by name and their OS type

This query uses `top` to only retrieve five matching records that are ordered by name. The type of the Azure resource is `Microsoft.Compute/virtualMachines`. `project` tells Azure Resource Graph which properties to include.

```kusto
Resources
| where type =~ 'Microsoft.Compute/virtualMachines'
| project name, properties.storageProfile.osDisk.osType
| top 5 by name desc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | project name, properties.storageProfile.osDisk.osType | top 5 by name desc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | project name, properties.storageProfile.osDisk.osType | top 5 by name desc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20project%20name%2c%20properties.storageProfile.osDisk.osType%0a%7c%20top%205%20by%20name%20desc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20project%20name%2c%20properties.storageProfile.osDisk.osType%0a%7c%20top%205%20by%20name%20desc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Compute%2fvirtualMachines%27%0a%7c%20project%20name%2c%20properties.storageProfile.osDisk.osType%0a%7c%20top%205%20by%20name%20desc" target="_blank">portal.azure.cn</a>

---

### Show resource types and API versions

Resource Graph primarily uses the most recent non-preview version of a Resource Provider's API to `GET` resource properties during an update. In some cases, the API version used has been overridden to provide more current or widely used properties in the results. The following query details the API version used for gathering properties on each resource type:

```kusto
Resources
| distinct type, apiVersion
| where isnotnull(apiVersion)
| order by type asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | distinct type, apiVersion | where isnotnull(apiVersion) | order by type asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | distinct type, apiVersion | where isnotnull(apiVersion) | order by type asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20distinct%20type%2c%20apiVersion%0a%7c%20where%20isnotnull(apiVersion)%0a%7c%20order%20by%20type%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20distinct%20type%2c%20apiVersion%0a%7c%20where%20isnotnull(apiVersion)%0a%7c%20order%20by%20type%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20distinct%20type%2c%20apiVersion%0a%7c%20where%20isnotnull(apiVersion)%0a%7c%20order%20by%20type%20asc" target="_blank">portal.azure.cn</a>

---

### Show resources that contain storage

Instead of explicitly defining the type to match, this example query will find any Azure resource that `contains` the word **storage**.

```kusto
Resources
| where type contains 'storage' | distinct type
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type contains 'storage' | distinct type"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type contains 'storage' | distinct type"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20contains%20%27storage%27%20%7c%20distinct%20type" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20contains%20%27storage%27%20%7c%20distinct%20type" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20contains%20%27storage%27%20%7c%20distinct%20type" target="_blank">portal.azure.cn</a>

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

### Summarize virtual machine by the power states extended property

This query uses the [extended properties](../../../../articles/governance/resource-graph/concepts/query-language.md#extended-properties) on virtual machines to summarize by power states.

```kusto
Resources
| where type == 'microsoft.compute/virtualmachines'
| summarize count() by tostring(properties.extended.instanceView.powerState.code)
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type == 'microsoft.compute/virtualmachines' | summarize count() by tostring(properties.extended.instanceView.powerState.code)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type == 'microsoft.compute/virtualmachines' | summarize count() by tostring(properties.extended.instanceView.powerState.code)"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20summarize%20count()%20by%20tostring(properties.extended.instanceView.powerState.code)" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20summarize%20count()%20by%20tostring(properties.extended.instanceView.powerState.code)" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.compute%2fvirtualmachines%27%0a%7c%20summarize%20count()%20by%20tostring(properties.extended.instanceView.powerState.code)" target="_blank">portal.azure.cn</a>

---

### Virtual machines matched by regex

This query looks for virtual machines that match a [regular expression](/dotnet/standard/base-types/regular-expression-language-quick-reference) (known as _regex_). The **matches regex \@** allows us to define the regex to match, which is `^Contoso(.*)[0-9]+$`. That regex definition is explained as:

- `^` - Match must start at the beginning of the string.
- `Contoso` - The case-sensitive string.
- `(.*)` - A subexpression match:
  - `.` - Matches any single character (except a new line).
  - `*` - Matches previous element zero or more times.
- `[0-9]` - Character group match for numbers 0 through 9.
- `+` - Matches previous element one or more times.
- `$` - Match of the previous element must occur at the end of the string.

After matching by name, the query projects the name and orders by name ascending.

```kusto
Resources
| where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$'
| project name
| order by name asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+\$' | project name | order by name asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'microsoft.compute/virtualmachines' and name matches regex @'^Contoso(.*)[0-9]+$' | project name | order by name asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%20and%20name%20matches%20regex%20%40%27%5eContoso(.*)%5b0-9%5d%2b%24%27%0a%7c%20project%20name%0a%7c%20order%20by%20name%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%20and%20name%20matches%20regex%20%40%27%5eContoso(.*)%5b0-9%5d%2b%24%27%0a%7c%20project%20name%0a%7c%20order%20by%20name%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27microsoft.compute%2fvirtualmachines%27%20and%20name%20matches%20regex%20%40%27%5eContoso(.*)%5b0-9%5d%2b%24%27%0a%7c%20project%20name%0a%7c%20order%20by%20name%20asc" target="_blank">portal.azure.cn</a>

---

