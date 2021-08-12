---
author: DCtheGeek
ms.service: resource-graph
ms.topic: include
ms.date: 08/09/2021
ms.author: dacoulte
ms.custom: generated
---

### Count of subscriptions per management group

Summarizes the count of subscriptions in each management group.

```kusto
ResourceContainers
| where type =~ 'microsoft.management/managementgroups'
| project mgname = name
| join kind=leftouter (resourcecontainers | where type=~ 'microsoft.resources/subscriptions'
| extend  mgParent = properties.managementGroupAncestorsChain | project id, mgname = tostring(mgParent[0].name)) on mgname
| summarize count() by mgname
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ResourceContainers | where type =~ 'microsoft.management/managementgroups' | project mgname = name | join kind=leftouter (resourcecontainers | where type=~ 'microsoft.resources/subscriptions' | extend mgParent = properties.managementGroupAncestorsChain | project id, mgname = tostring(mgParent[0].name)) on mgname | summarize count() by mgname"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ResourceContainers | where type =~ 'microsoft.management/managementgroups' | project mgname = name | join kind=leftouter (resourcecontainers | where type=~ 'microsoft.resources/subscriptions' | extend mgParent = properties.managementGroupAncestorsChain | project id, mgname = tostring(mgParent[0].name)) on mgname | summarize count() by mgname"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.management%2fmanagementgroups%27%0a%7c%20project%20mgname%20%3d%20name%0a%7c%20join%20kind%3dleftouter%20(resourcecontainers%20%7c%20where%20type%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%20%7c%20project%20id%2c%20mgname%20%3d%20tostring(mgParent%5b0%5d.name))%20on%20mgname%0a%7c%20summarize%20count()%20by%20mgname" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.management%2fmanagementgroups%27%0a%7c%20project%20mgname%20%3d%20name%0a%7c%20join%20kind%3dleftouter%20(resourcecontainers%20%7c%20where%20type%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%20%7c%20project%20id%2c%20mgname%20%3d%20tostring(mgParent%5b0%5d.name))%20on%20mgname%0a%7c%20summarize%20count()%20by%20mgname" target="_blank">portal.azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.management%2fmanagementgroups%27%0a%7c%20project%20mgname%20%3d%20name%0a%7c%20join%20kind%3dleftouter%20(resourcecontainers%20%7c%20where%20type%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%20%7c%20project%20id%2c%20mgname%20%3d%20tostring(mgParent%5b0%5d.name))%20on%20mgname%0a%7c%20summarize%20count()%20by%20mgname" target="_blank">portal.azure.cn</a>

---

### List all management group ancestors for a specified management group

Provides the management group hierarchy details for the management group specified in the [query scope](../../../../articles/governance/resource-graph/concepts/query-language.md#query-scope). In this example, the management group is named **Application**.

```kusto
ResourceContainers
| where type =~ 'microsoft.management/managementgroups'
| extend  mgParent = properties.details.managementGroupAncestorsChain
| mv-expand with_itemindex=MGHierarchy mgParent
| project name, properties.displayName, mgParent, MGHierarchy, mgParent.name
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ResourceContainers | where type =~ 'microsoft.management/managementgroups' | extend mgParent = properties.details.managementGroupAncestorsChain | mv-expand with_itemindex=MGHierarchy mgParent | project name, properties.displayName, mgParent, MGHierarchy, mgParent.name" --management-groups Application
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ResourceContainers | where type =~ 'microsoft.management/managementgroups' | extend mgParent = properties.details.managementGroupAncestorsChain | mv-expand with_itemindex=MGHierarchy mgParent | project name, properties.displayName, mgParent, MGHierarchy, mgParent.name" -ManagementGroup Application
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.management%2fmanagementgroups%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.details.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20name%2c%20properties.displayName%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.management%2fmanagementgroups%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.details.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20name%2c%20properties.displayName%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.management%2fmanagementgroups%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.details.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20name%2c%20properties.displayName%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.cn</a>

---

### List all management group ancestors for a specified subscription

Provides the management group hierarchy details for the subscription specified in the [query scope](../../../../articles/governance/resource-graph/concepts/query-language.md#query-scope). In this example, the subscription GUID is **11111111-1111-1111-1111-111111111111**.

```kusto
ResourceContainers
| where type =~ 'microsoft.resources/subscriptions'
| extend  mgParent = properties.managementGroupAncestorsChain
| mv-expand with_itemindex=MGHierarchy mgParent
| project subscriptionId, name, mgParent, MGHierarchy, mgParent.name
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ResourceContainers | where type =~ 'microsoft.resources/subscriptions' | extend mgParent = properties.managementGroupAncestorsChain | mv-expand with_itemindex=MGHierarchy mgParent | project subscriptionId, name, mgParent, MGHierarchy, mgParent.name" --subscriptions 11111111-1111-1111-1111-111111111111
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ResourceContainers | where type =~ 'microsoft.resources/subscriptions' | extend mgParent = properties.managementGroupAncestorsChain | mv-expand with_itemindex=MGHierarchy mgParent | project subscriptionId, name, mgParent, MGHierarchy, mgParent.name" -Subscription 11111111-1111-1111-1111-111111111111
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20subscriptionId%2c%20name%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20subscriptionId%2c%20name%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20subscriptionId%2c%20name%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.cn</a>

---

### List all subscriptions under a specified management group

Provides the name and subscription ID of all subscriptions under the management group specified in the [query scope](../../../../articles/governance/resource-graph/concepts/query-language.md#query-scope). In this example, the management group is named **Application**.

```kusto
ResourceContainers
| where type =~ 'microsoft.resources/subscriptions'
| project subscriptionId, name
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "ResourceContainers | where type =~ 'microsoft.resources/subscriptions' | project subscriptionId, name" --management-groups Application
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "ResourceContainers | where type =~ 'microsoft.resources/subscriptions' | project subscriptionId, name" -ManagementGroup Application
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20project%20subscriptionId%2c%20name" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20project%20subscriptionId%2c%20name" target="_blank">portal.azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20project%20subscriptionId%2c%20name" target="_blank">portal.azure.cn</a>

---

