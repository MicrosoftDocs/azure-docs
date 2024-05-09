---
title: Starter query samples
description: Use Azure Resource Graph to run some starter queries, including counting resources, ordering resources, or by a specific tag.
ms.date: 12/19/2023
ms.topic: sample
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Starter Resource Graph query samples

The first step to understanding queries with Azure Resource Graph is a basic understanding of the
[Query Language](../concepts/query-language.md). If you aren't already familiar with
[Kusto Query Language (KQL)](/azure/kusto/query/index), it's recommended to review the
[KQL tutorial](/azure/kusto/query/tutorial) to understand how to compose requests for the
resources you're looking for.

This article uses the following starter queries:

- [Count Azure resources](#count-azure-resources)
- [Count Key Vault resources](#count-key-vault-resources)
- [List resources sorted by name](#list-resources-sorted-by-name)
- [Show all virtual machines ordered by name in descending order](#show-all-virtual-machines-ordered-by-name-in-descending-order)
- [Show first five virtual machines by name and their OS type](#show-first-five-virtual-machines-by-name-and-their-os-type)
- [Count virtual machines by OS type](#count-virtual-machines-by-os-type)
- [Show resources that contain storage](#show-resources-that-contain-storage)
- [List all virtual network subnets](#list-all-azure-virtual-network-subnets)
- [List all public IP addresses](#list-all-public-ip-addresses)
- [Count resources that have IP addresses configured by subscription](#count-resources-that-have-ip-addresses-configured-by-subscription)
- [List resources with a specific tag value](#list-resources-with-a-specific-tag-value)
- [List all storage accounts with specific tag value](#list-all-storage-accounts-with-specific-tag-value)
- [List all tags and their values](#list-all-tags-and-their-values)
- [Show unassociated network security groups](#show-unassociated-network-security-groups)
- [List Azure Monitor alerts ordered by severity](#list-azure-monitor-alerts-ordered-by-severity)
- [List Azure Monitor alerts ordered by severity and alert state](#list-azure-monitor-alerts-ordered-by-severity-and-alert-state)
- [List Azure Monitor alerts ordered by severity, monitor service, and target resource type](#list-azure-monitor-alerts-ordered-by-severity-monitor-service-and-target-resource-type)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
before you begin.

## Language support

Azure CLI (through an extension) and Azure PowerShell (through a module) support Azure Resource
Graph. Before running any of the following queries, check that your environment is ready. See
[Azure CLI](../first-query-azurecli.md#install-the-extension) and [Azure
PowerShell](../first-query-powershell.md#install-the-module) for steps to install and
validate your shell environment of choice.

## Count Azure resources

This query returns number of Azure resources that exist in the subscriptions that you have access
to. It's also a good query to validate your shell of choice has the appropriate Azure Resource
Graph components installed and in working order.

```kusto
Resources
| summarize count()
```

# [Azure CLI](#tab/azure-cli)

By default, Azure CLI queries all accessible subscriptions but you can specify the `--subscriptions` parameter to query specific subscriptions.

```azurecli-interactive
az graph query -q "Resources | summarize count()"
```

This example uses a variable for the subscription ID.

```azurecli-interactive
subid=$(az account show --query id --output tsv)
az graph query -q "Resources | summarize count()" --subscriptions $subid
```

You can also query by the scopes for management group and tenant. Replace `<managementGroupId>` and `<tenantId>` with your values.

```azurecli-interactive
az graph query -q "Resources | summarize count()" --management-groups '<managementGroupId>'
```

```azurecli-interactive
az graph query -q "Resources | summarize count()" --management-groups '<tenantId>'
```

You can also use a variable for the tenant ID.

```azurecli-interactive
tenantid=$(az account show --query tenantId --output tsv)
az graph query -q "Resources | summarize count()" --management-groups $tenantid
```

# [Azure PowerShell](#tab/azure-powershell)

By default, Azure PowerShell gets results for all subscriptions in your tenant.

```azurepowershell-interactive
Search-AzGraph -Query "Resources | summarize count()"
```

This example uses a variable to query a specific subscription ID.

```azurepowershell-interactive
$subid = (Get-AzContext).Subscription.Id
Search-AzGraph -Query "authorizationresources | summarize count()" -Subscription $subid
```

You can query by the scopes for management group and tenant. Replace `<managementGroupId>`with your value. The `UseTenantScope` parameter doesn't require a value.

```azurepowershell-interactive
Search-AzGraph -Query "Resources | summarize count()" -ManagementGroup '<managementGroupId>'
```

```azurepowershell-interactive
Search-AzGraph -Query "Resources | summarize count()" -UseTenantScope
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20summarize%20count%28%29" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20summarize%20count%28%29" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20summarize%20count%28%29" target="_blank">portal.azure.cn</a>

---

## Count Key Vault resources

This query uses `count` instead of `summarize` to count the number of records returned. Only key
vaults are included in the count.

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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.keyvault%2Fvaults%27%0D%0A%7C%20count" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.keyvault%2Fvaults%27%0D%0A%7C%20count" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.keyvault%2Fvaults%27%0D%0A%7C%20count" target="_blank">portal.azure.cn</a>

---

## List resources sorted by name

This query returns any type of resource, but only the **name**, **type**, and **location**
properties. It uses `order by` to sort the properties by the **name** property in ascending (`asc`)
order.

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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20project%20name%2C%20type%2C%20location%0D%0A%7C%20order%20by%20name%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20project%20name%2C%20type%2C%20location%0D%0A%7C%20order%20by%20name%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20project%20name%2C%20type%2C%20location%0D%0A%7C%20order%20by%20name%20asc" target="_blank">portal.azure.cn</a>

---

## Show all virtual machines ordered by name in descending order

To list only virtual machines (which are type `Microsoft.Compute/virtualMachines`), we can match
the property **type** in the results. Similar to the previous query, `desc` changes the `order by`
to be descending. The `=~` in the type match tells Resource Graph to be case insensitive.

```kusto
Resources
| project name, location, type
| where type =~ 'Microsoft.Compute/virtualMachines'
| order by name desc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | project name, location, type| where type =~ 'Microsoft.Compute/virtualMachines' | order by name desc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | project name, location, type| where type =~ 'Microsoft.Compute/virtualMachines' | order by name desc"
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20project%20name%2C%20location%2C%20type%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20order%20by%20name%20desc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20project%20name%2C%20location%2C%20type%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20order%20by%20name%20desc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20project%20name%2C%20location%2C%20type%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20order%20by%20name%20desc" target="_blank">portal.azure.cn</a>

---

## Show first five virtual machines by name and their OS type

This query uses `top` to only retrieve five matching records that are ordered by name. The type
of the Azure resource is `Microsoft.Compute/virtualMachines`. `project` tells Azure Resource Graph
which properties to include.

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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20project%20name%2C%20properties.storageProfile.osDisk.osType%0D%0A%7C%20top%205%20by%20name%20desc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20project%20name%2C%20properties.storageProfile.osDisk.osType%0D%0A%7C%20top%205%20by%20name%20desc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20project%20name%2C%20properties.storageProfile.osDisk.osType%0D%0A%7C%20top%205%20by%20name%20desc" target="_blank">portal.azure.cn</a>

---

## Count virtual machines by OS type

Building on the previous query, we're still limiting by Azure resources of type
`Microsoft.Compute/virtualMachines`, but are no longer limiting the number of records returned.
Instead, we used `summarize` and `count()` to define how to group and aggregate the values by
property, which in this example is `properties.storageProfile.osDisk.osType`. For an example of how
this string looks in the full object, see [explore resources - virtual machine
discovery](../concepts/explore-resources.md#virtual-machine-discovery).

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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20summarize%20count%28%29%20by%20tostring%28properties.storageProfile.osDisk.osType%29" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20summarize%20count%28%29%20by%20tostring%28properties.storageProfile.osDisk.osType%29" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20summarize%20count%28%29%20by%20tostring%28properties.storageProfile.osDisk.osType%29" target="_blank">portal.azure.cn</a>

---

A different way to write the same query is to `extend` a property and give it a temporary name for
use within the query, in this case **os**. **os** is then used by `summarize` and `count()` as in
the previous example.

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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20extend%20os%20%3D%20properties.storageProfile.osDisk.osType%0D%0A%7C%20summarize%20count%28%29%20by%20tostring%28os%29" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20extend%20os%20%3D%20properties.storageProfile.osDisk.osType%0D%0A%7C%20summarize%20count%28%29%20by%20tostring%28os%29" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Compute%2FvirtualMachines%27%0D%0A%7C%20extend%20os%20%3D%20properties.storageProfile.osDisk.osType%0D%0A%7C%20summarize%20count%28%29%20by%20tostring%28os%29" target="_blank">portal.azure.cn</a>

---

> [!NOTE]
> Be aware that while `=~` allows case insensitive matching, use of properties (such as
> **properties.storageProfile.osDisk.osType**) in the query require the case to be correct. If the
> property is the incorrect case, a null or incorrect value is returned and the grouping or
> summarization would be incorrect.

## Show resources that contain storage

Instead of explicitly defining the type to match, this example query finds any Azure resource
that `contains` the word **storage**.

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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20contains%20%27storage%27%20%7C%20distinct%20type" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20contains%20%27storage%27%20%7C%20distinct%20type" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20contains%20%27storage%27%20%7C%20distinct%20type" target="_blank">portal.azure.cn</a>

---

## List all Azure virtual network subnets

This query returns a list of Azure virtual networks (VNets) including subnet names and address prefixes.

```kusto
Resources
| where type == 'microsoft.network/virtualnetworks'
| extend subnets = properties.subnets
| mv-expand subnets
| project name, subnets.name, subnets.properties.addressPrefix, location, resourceGroup, subscriptionId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type == 'microsoft.network/virtualnetworks' | extend subnets = properties.subnets | mv-expand subnets | project name, subnets.name, subnets.properties.addressPrefix, location, resourceGroup, subscriptionId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type == 'microsoft.network/virtualnetworks' | extend subnets = properties.subnets | mv-expand subnets | project name, subnets.name, subnets.properties.addressPrefix, location, resourceGroup, subscriptionId
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0A%7C%20where%20type%20%3D%3D%20%27microsoft.network%2Fvirtualnetworks%27%0A%7C%20extend%20subnets%20%3D%20properties.subnets%0A%7C%20mv-expand%20subnets%0A%7C%20project%20name%2C%20subnets.name%2C%20subnets.properties.addressPrefix%2C%20location%2C%20resourceGroup%2C%20subscriptionId" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0A%7C%20where%20type%20%3D%3D%20%27microsoft.network%2Fvirtualnetworks%27%0A%7C%20extend%20subnets%20%3D%20properties.subnets%0A%7C%20mv-expand%20subnets%0A%7C%20project%20name%2C%20subnets.name%2C%20subnets.properties.addressPrefix%2C%20location%2C%20resourceGroup%2C%20subscriptionId" target="_blank">portal.Azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0A%7C%20where%20type%20%3D%3D%20%27microsoft.network%2Fvirtualnetworks%27%0A%7C%20extend%20subnets%20%3D%20properties.subnets%0A%7C%20mv-expand%20subnets%0A%7C%20project%20name%2C%20subnets.name%2C%20subnets.properties.addressPrefix%2C%20location%2C%20resourceGroup%2C%20subscriptionId" target="_blank">portal.Azure.cn</a>

---

## List all public IP addresses

Similar to the previous query, find everything that is a type with the word **publicIPAddresses**.
This query expands on that pattern to only include results where **properties.ipAddress**
`isnotempty`, to only return the **properties.ipAddress**, and to `limit` the results by the top
100. You might need to escape the quotes depending on your chosen shell.

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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty%28properties.ipAddress%29%0D%0A%7C%20project%20properties.ipAddress%0D%0A%7C%20limit%20100" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty%28properties.ipAddress%29%0D%0A%7C%20project%20properties.ipAddress%0D%0A%7C%20limit%20100" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty%28properties.ipAddress%29%0D%0A%7C%20project%20properties.ipAddress%0D%0A%7C%20limit%20100" target="_blank">portal.azure.cn</a>

---

## Count resources that have IP addresses configured by subscription

Using the previous example query and adding `summarize` and `count()`, we can get a list by subscription of resources with configured IP addresses.

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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty%28properties.ipAddress%29%0D%0A%7C%20summarize%20count%20%28%29%20by%20subscriptionId" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty%28properties.ipAddress%29%0D%0A%7C%20summarize%20count%20%28%29%20by%20subscriptionId" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20contains%20%27publicIPAddresses%27%20and%20isnotempty%28properties.ipAddress%29%0D%0A%7C%20summarize%20count%20%28%29%20by%20subscriptionId" target="_blank">portal.azure.cn</a>

---

## List resources with a specific tag value

We can limit the results by properties other than the Azure resource type, such as a tag. In this
example, we're filtering for Azure resources with a tag name of **Environment** that have a value
of **Internal**.

```kusto
Resources
| where tags.environment=~'internal'
| project name
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where tags.environment=~'internal' | project name"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where tags.environment=~'internal' | project name"
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20tags.environment%3D~%27internal%27%0D%0A%7C%20project%20name" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20tags.environment%3D~%27internal%27%0D%0A%7C%20project%20name" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20tags.environment%3D~%27internal%27%0D%0A%7C%20project%20name" target="_blank">portal.azure.cn</a>

---

To also provide what tags the resource has and their values, add the property **tags** to the
`project` keyword.

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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20tags.environment%3D~%27internal%27%0D%0A%7C%20project%20name%2C%20tags" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20tags.environment%3D~%27internal%27%0D%0A%7C%20project%20name%2C%20tags" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20tags.environment%3D~%27internal%27%0D%0A%7C%20project%20name%2C%20tags" target="_blank">portal.azure.cn</a>

---

## List all storage accounts with specific tag value

Combine the filter functionality of the previous example and filter Azure resource type by **type**
property. This query also limits our search for specific types of Azure resources with a specific
tag name and value.

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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Storage%2FstorageAccounts%27%0D%0A%7C%20where%20tags%5B%27tag%20with%20a%20space%27%5D%3D%3D%27Custom%20value%27" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Storage%2FstorageAccounts%27%0D%0A%7C%20where%20tags%5B%27tag%20with%20a%20space%27%5D%3D%3D%27Custom%20value%27" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%27Microsoft.Storage%2FstorageAccounts%27%0D%0A%7C%20where%20tags%5B%27tag%20with%20a%20space%27%5D%3D%3D%27Custom%20value%27" target="_blank">portal.azure.cn</a>

---

> [!NOTE]
> This example uses `==` for matching instead of the `=~` conditional. `==` is a case sensitive match.

## List all tags and their values

This query lists tags on management groups, subscriptions, and resources along with their values.
The query first limits to resources where tags `isnotempty()`, limits the included fields by only
including _tags_ in the `project`, and `mvexpand` and `extend` to get the paired data from the
property bag. It then uses `union` to combine the results from _ResourceContainers_ to the same
results from _Resources_, giving broad coverage to which tags are fetched. Last, it limits the
results to `distinct` paired data and excludes system-hidden tags.

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
az graph query -q "ResourceContainers | where isnotempty(tags) | project tags | mvexpand tags | extend tagKey = tostring(bag_keys(tags)[0]) | extend tagValue = tostring(tags[tagKey]) | union (resources | where notempty(tags) | project tags | mvexpand tags | extend tagKey = tostring(bag_keys(tags)[0]) | extend tagValue = tostring(tags[tagKey]) ) | distinct tagKey, tagValue | where tagKey !startswith "hidden-""
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ResourceContainers | where isnotempty(tags) | project tags | mvexpand tags | extend tagKey = tostring(bag_keys(tags)[0]) | extend tagValue = tostring(tags[tagKey]) | union (resources | where notempty(tags) | project tags | mvexpand tags | extend tagKey = tostring(bag_keys(tags)[0]) | extend tagValue = tostring(tags[tagKey]) ) | distinct tagKey, tagValue | where tagKey !startswith "hidden-""
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%20%0A%7C%20where%20isnotempty%28tags%29%0A%7C%20project%20tags%0A%7C%20mvexpand%20tags%0A%7C%20extend%20tagKey%20%3D%20tostring%28bag_keys%28tags%29%5B0%5D%29%0A%7C%20extend%20tagValue%20%3D%20tostring%28tags%5BtagKey%5D%29%0A%7C%20union%20%28%0A%20%20%20%20resources%0A%20%20%20%20%7C%20where%20isnotempty%28tags%29%0A%20%20%20%20%7C%20project%20tags%0A%20%20%20%20%7C%20mvexpand%20tags%0A%20%20%20%20%7C%20extend%20tagKey%20%3D%20tostring%28bag_keys%28tags%29%5B0%5D%29%0A%20%20%20%20%7C%20extend%20tagValue%20%3D%20tostring%28tags%5BtagKey%5D%29%0A%29%0A%7C%20distinct%20tagKey%2C%20tagValue%0A%7C%20where%20tagKey%20%21startswith%20%22hidden-%22" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%20%0A%7C%20where%20isnotempty%28tags%29%0A%7C%20project%20tags%0A%7C%20mvexpand%20tags%0A%7C%20extend%20tagKey%20%3D%20tostring%28bag_keys%28tags%29%5B0%5D%29%0A%7C%20extend%20tagValue%20%3D%20tostring%28tags%5BtagKey%5D%29%0A%7C%20union%20%28%0A%20%20%20%20resources%0A%20%20%20%20%7C%20where%20isnotempty%28tags%29%0A%20%20%20%20%7C%20project%20tags%0A%20%20%20%20%7C%20mvexpand%20tags%0A%20%20%20%20%7C%20extend%20tagKey%20%3D%20tostring%28bag_keys%28tags%29%5B0%5D%29%0A%20%20%20%20%7C%20extend%20tagValue%20%3D%20tostring%28tags%5BtagKey%5D%29%0A%29%0A%7C%20distinct%20tagKey%2C%20tagValue%0A%7C%20where%20tagKey%20%21startswith%20%22hidden-%22" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%20%0A%7C%20where%20isnotempty%28tags%29%0A%7C%20project%20tags%0A%7C%20mvexpand%20tags%0A%7C%20extend%20tagKey%20%3D%20tostring%28bag_keys%28tags%29%5B0%5D%29%0A%7C%20extend%20tagValue%20%3D%20tostring%28tags%5BtagKey%5D%29%0A%7C%20union%20%28%0A%20%20%20%20resources%0A%20%20%20%20%7C%20where%20isnotempty%28tags%29%0A%20%20%20%20%7C%20project%20tags%0A%20%20%20%20%7C%20mvexpand%20tags%0A%20%20%20%20%7C%20extend%20tagKey%20%3D%20tostring%28bag_keys%28tags%29%5B0%5D%29%0A%20%20%20%20%7C%20extend%20tagValue%20%3D%20tostring%28tags%5BtagKey%5D%29%0A%29%0A%7C%20distinct%20tagKey%2C%20tagValue%0A%7C%20where%20tagKey%20%21startswith%20%22hidden-%22" target="_blank">portal.azure.cn</a>

---

## Show unassociated network security groups

This query returns Network Security Groups (NSGs) that aren't associated to a network interface or
subnet.

```kusto
Resources
| where type =~ "microsoft.network/networksecuritygroups" and isnull(properties.networkInterfaces) and isnull(properties.subnets)
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



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%22microsoft.network%2Fnetworksecuritygroups%22%20and%20isnull%28properties.networkInterfaces%29%20and%20isnull%28properties.subnets%29%0D%0A%7C%20project%20name%2C%20resourceGroup%0D%0A%7C%20sort%20by%20name%20asc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%22microsoft.network%2Fnetworksecuritygroups%22%20and%20isnull%28properties.networkInterfaces%29%20and%20isnull%28properties.subnets%29%0D%0A%7C%20project%20name%2C%20resourceGroup%0D%0A%7C%20sort%20by%20name%20asc" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20%3D~%20%22microsoft.network%2Fnetworksecuritygroups%22%20and%20isnull%28properties.networkInterfaces%29%20and%20isnull%28properties.subnets%29%0D%0A%7C%20project%20name%2C%20resourceGroup%0D%0A%7C%20sort%20by%20name%20asc" target="_blank">portal.azure.cn</a>

---

## List Azure Monitor alerts ordered by severity

This query uses the `alertsmanagementresources` table to return Azure Monitor alerts ordered by severity.

```kusto
alertsmanagementresources
| where type =~ 'microsoft.alertsmanagement/alerts'
| where todatetime(properties.essentials.startDateTime) >= ago(2h) and todatetime(properties.essentials.startDateTime) < now()
| project Severity = tostring(properties.essentials.severity)
| summarize AlertsCount = count() by Severity
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "alertsmanagementresources | where type =~ 'microsoft.alertsmanagement/alerts' | where todatetime(properties.essentials.startDateTime) >= ago(2h) and todatetime(properties.essentials.startDateTime) < now() | project Severity = tostring(properties.essentials.severity) | summarize AlertsCount = count() by Severity"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "alertsmanagementresources | where type =~ 'microsoft.alertsmanagement/alerts' | where todatetime(properties.essentials.startDateTime) >= ago(2h) and todatetime(properties.essentials.startDateTime) < now() | project Severity = tostring(properties.essentials.severity) | summarize AlertsCount = count() by Severity"
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.alertsmanagement%2Falerts%27%0D%0A%7C%20where%20todatetime%28properties.essentials.startDateTime%29%20%3E%3D%20ago%282h%29%20and%20todatetime%28properties.essentials.startDateTime%29%20%3C%20now%28%29%0D%0A%7C%20project%20Severity%20%3D%20tostring%28properties.essentials.severity%29%0D%0A%7C%20summarize%20AlertsCount%20%3D%20count%28%29%20by%20Severity" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.alertsmanagement%2Falerts%27%0D%0A%7C%20where%20todatetime%28properties.essentials.startDateTime%29%20%3E%3D%20ago%282h%29%20and%20todatetime%28properties.essentials.startDateTime%29%20%3C%20now%28%29%0D%0A%7C%20project%20Severity%20%3D%20tostring%28properties.essentials.severity%29%0D%0A%7C%20summarize%20AlertsCount%20%3D%20count%28%29%20by%20Severity" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.alertsmanagement%2Falerts%27%0D%0A%7C%20where%20todatetime%28properties.essentials.startDateTime%29%20%3E%3D%20ago%282h%29%20and%20todatetime%28properties.essentials.startDateTime%29%20%3C%20now%28%29%0D%0A%7C%20project%20Severity%20%3D%20tostring%28properties.essentials.severity%29%0D%0A%7C%20summarize%20AlertsCount%20%3D%20count%28%29%20by%20Severity" target="_blank">portal.azure.cn</a>

---

## List Azure Monitor alerts ordered by severity and alert state

This query uses the `alertsmanagementresources` table to return Azure Monitor alerts ordered by severity and alert state.

```kusto
alertsmanagementresources
| where type =~ 'microsoft.alertsmanagement/alerts'
| where todatetime(properties.essentials.startDateTime) >= ago(2h) and todatetime(properties.essentials.startDateTime) < now()
| project Severity = tostring(properties.essentials.severity), AlertState = tostring(properties.essentials.alertState)
| summarize AlertsCount = count() by Severity, AlertState
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "alertsmanagementresources | where type =~ 'microsoft.alertsmanagement/alerts' | where todatetime(properties.essentials.startDateTime) >= ago(2h) and todatetime(properties.essentials.startDateTime) < now() | project Severity = tostring(properties.essentials.severity), AlertState = tostring(properties.essentials.alertState) | summarize AlertsCount = count() by Severity, AlertState"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "alertsmanagementresources | where type =~ 'microsoft.alertsmanagement/alerts' | where todatetime(properties.essentials.startDateTime) >= ago(2h) and todatetime(properties.essentials.startDateTime) < now() | project Severity = tostring(properties.essentials.severity), AlertState = tostring(properties.essentials.alertState) | summarize AlertsCount = count() by Severity, AlertState"
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.alertsmanagement%2Falerts%27%0D%0A%7C%20where%20todatetime%28properties.essentials.startDateTime%29%20%3E%3D%20ago%282h%29%20and%20todatetime%28properties.essentials.startDateTime%29%20%3C%20now%28%29%0D%0A%7C%20project%20Severity%20%3D%20tostring%28properties.essentials.severity%29%2C%20AlertState%20%3D%20tostring%28properties.essentials.alertState%29%0D%0A%7C%20summarize%20AlertsCount%20%3D%20count%28%29%20by%20Severity%2C%20AlertState" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.alertsmanagement%2Falerts%27%0D%0A%7C%20where%20todatetime%28properties.essentials.startDateTime%29%20%3E%3D%20ago%282h%29%20and%20todatetime%28properties.essentials.startDateTime%29%20%3C%20now%28%29%0D%0A%7C%20project%20Severity%20%3D%20tostring%28properties.essentials.severity%29%2C%20AlertState%20%3D%20tostring%28properties.essentials.alertState%29%0D%0A%7C%20summarize%20AlertsCount%20%3D%20count%28%29%20by%20Severity%2C%20AlertState" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.alertsmanagement%2Falerts%27%0D%0A%7C%20where%20todatetime%28properties.essentials.startDateTime%29%20%3E%3D%20ago%282h%29%20and%20todatetime%28properties.essentials.startDateTime%29%20%3C%20now%28%29%0D%0A%7C%20project%20Severity%20%3D%20tostring%28properties.essentials.severity%29%2C%20AlertState%20%3D%20tostring%28properties.essentials.alertState%29%0D%0A%7C%20summarize%20AlertsCount%20%3D%20count%28%29%20by%20Severity%2C%20AlertState" target="_blank">portal.azure.cn</a>

---

## List Azure Monitor alerts ordered by severity, monitor service, and target resource type

This query uses the `alertsmanagementresources` table to return Azure Monitor alerts ordered by severity, monitor service, and target resource type.

```kusto
alertsmanagementresources
| where type =~ 'microsoft.alertsmanagement/alerts'
| where todatetime(properties.essentials.startDateTime) >= ago(2h) and todatetime(properties.essentials.startDateTime) < now()
| project Severity = tostring(properties.essentials.severity),
MonitorCondition = tostring(properties.essentials.monitorCondition),
ObjectState = tostring(properties.essentials.alertState),
MonitorService = tostring(properties.essentials.monitorService),
AlertRuleId = tostring(properties.essentials.alertRule),
SignalType = tostring(properties.essentials.signalType),
TargetResource = tostring(properties.essentials.targetResourceName),
TargetResourceType = tostring(properties.essentials.targetResourceName), id
| summarize AlertsCount = count() by Severity, MonitorService , TargetResourceType
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "alertsmanagementresources | where type =~ 'microsoft.alertsmanagement/alerts' | where todatetime(properties.essentials.startDateTime) >= ago(2h) and todatetime(properties.essentials.startDateTime) < now() | project Severity = tostring(properties.essentials.severity), MonitorCondition = tostring(properties.essentials.monitorCondition), ObjectState = tostring(properties.essentials.alertState), MonitorService = tostring(properties.essentials.monitorService), AlertRuleId = tostring(properties.essentials.alertRule), SignalType = tostring(properties.essentials.signalType), TargetResource = tostring(properties.essentials.targetResourceName), TargetResourceType = tostring(properties.essentials.targetResourceName), id | summarize AlertsCount = count() by Severity, MonitorService , TargetResourceType"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "alertsmanagementresources | where type =~ 'microsoft.alertsmanagement/alerts' | where todatetime(properties.essentials.startDateTime) >= ago(2h) and todatetime(properties.essentials.startDateTime) < now() | project Severity = tostring(properties.essentials.severity), MonitorCondition = tostring(properties.essentials.monitorCondition), ObjectState = tostring(properties.essentials.alertState), MonitorService = tostring(properties.essentials.monitorService), AlertRuleId = tostring(properties.essentials.alertRule), SignalType = tostring(properties.essentials.signalType), TargetResource = tostring(properties.essentials.targetResourceName), TargetResourceType = tostring(properties.essentials.targetResourceName), id | summarize AlertsCount = count() by Severity, MonitorService , TargetResourceType"
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.alertsmanagement%2Falerts%27%0D%0A%7C%20where%20todatetime%28properties.essentials.startDateTime%29%20%3E%3D%20ago%282h%29%20and%20todatetime%28properties.essentials.startDateTime%29%20%3C%20now%28%29%0D%0A%7C%20project%20Severity%20%3D%20tostring%28properties.essentials.severity%29%2C%0D%0AMonitorCondition%20%3D%20tostring%28properties.essentials.monitorCondition%29%2C%0D%0AObjectState%20%3D%20tostring%28properties.essentials.alertState%29%2C%0D%0AMonitorService%20%3D%20tostring%28properties.essentials.monitorService%29%2C%0D%0AAlertRuleId%20%3D%20tostring%28properties.essentials.alertRule%29%2C%0D%0ASignalType%20%3D%20tostring%28properties.essentials.signalType%29%2C%0D%0ATargetResource%20%3D%20tostring%28properties.essentials.targetResourceName%29%2C%0D%0ATargetResourceType%20%3D%20tostring%28properties.essentials.targetResourceName%29%2C%20id%0D%0A%7C%20summarize%20AlertsCount%20%3D%20count%28%29%20by%20Severity%2C%20MonitorService%20%2C%20TargetResourceType" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.alertsmanagement%2Falerts%27%0D%0A%7C%20where%20todatetime%28properties.essentials.startDateTime%29%20%3E%3D%20ago%282h%29%20and%20todatetime%28properties.essentials.startDateTime%29%20%3C%20now%28%29%0D%0A%7C%20project%20Severity%20%3D%20tostring%28properties.essentials.severity%29%2C%0D%0AMonitorCondition%20%3D%20tostring%28properties.essentials.monitorCondition%29%2C%0D%0AObjectState%20%3D%20tostring%28properties.essentials.alertState%29%2C%0D%0AMonitorService%20%3D%20tostring%28properties.essentials.monitorService%29%2C%0D%0AAlertRuleId%20%3D%20tostring%28properties.essentials.alertRule%29%2C%0D%0ASignalType%20%3D%20tostring%28properties.essentials.signalType%29%2C%0D%0ATargetResource%20%3D%20tostring%28properties.essentials.targetResourceName%29%2C%0D%0ATargetResourceType%20%3D%20tostring%28properties.essentials.targetResourceName%29%2C%20id%0D%0A%7C%20summarize%20AlertsCount%20%3D%20count%28%29%20by%20Severity%2C%20MonitorService%20%2C%20TargetResourceType" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/alertsmanagementresources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.alertsmanagement%2Falerts%27%0D%0A%7C%20where%20todatetime%28properties.essentials.startDateTime%29%20%3E%3D%20ago%282h%29%20and%20todatetime%28properties.essentials.startDateTime%29%20%3C%20now%28%29%0D%0A%7C%20project%20Severity%20%3D%20tostring%28properties.essentials.severity%29%2C%0D%0AMonitorCondition%20%3D%20tostring%28properties.essentials.monitorCondition%29%2C%0D%0AObjectState%20%3D%20tostring%28properties.essentials.alertState%29%2C%0D%0AMonitorService%20%3D%20tostring%28properties.essentials.monitorService%29%2C%0D%0AAlertRuleId%20%3D%20tostring%28properties.essentials.alertRule%29%2C%0D%0ASignalType%20%3D%20tostring%28properties.essentials.signalType%29%2C%0D%0ATargetResource%20%3D%20tostring%28properties.essentials.targetResourceName%29%2C%0D%0ATargetResourceType%20%3D%20tostring%28properties.essentials.targetResourceName%29%2C%20id%0D%0A%7C%20summarize%20AlertsCount%20%3D%20count%28%29%20by%20Severity%2C%20MonitorService%20%2C%20TargetResourceType" target="_blank">portal.azure.cn</a>

---

## Next steps

- Learn more about the [query language](../concepts/query-language.md).
- Learn more about how to [explore resources](../concepts/explore-resources.md).
- See samples of [Advanced queries](advanced.md).
