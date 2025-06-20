---
author: kenieva
ms.service: resource-graph
ms.topic: include
ms.date: 06/20/2025
ms.author: kenieva
---

### List of all Service Group

Outputs a list of Service Groups.

```kusto
resourcecontainers
| where type == "microsoft.management/servicegroups"
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "resourcecontainers | where type == 'microsoft.management/servicegroups'"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "resourcecontainers | where type == 'microsoft.management/servicegroups'" -UseTenantScope
```

# [Portal](#tab/azure-portal)

- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.management%2fmanagementgroups%27%0a%7c%20project%20mgname%20%3d%20name%0a%7c%20join%20kind%3dleftouter%20(resourcecontainers%20%7c%20where%20type%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%20%7c%20project%20id%2c%20mgname%20%3d%20tostring(mgParent%5b0%5d.name))%20on%20mgname%0a%7c%20summarize%20count()%20by%20mgname](https://ms.portal.azure.com/#view/HubsExtension/ArgQueryBlade/query/resourcecontainers%0A%7C%20where%20type%20%3D%3D%20%22microsoft.management%2Fservicegroups%22)" target="_blank">portal.azure.com</a>

---

### List of all members for a particular Service Group

Outputs a list of resource IDs that are members for a particular Service Groups. In this example, the service group ID is '123'.

```kusto
relationshipresources
    | where type == "microsoft.relationships/servicegroupmember"
    | where properties.TargetId == '/providers/Microsoft.Management/serviceGroups/123'
    | project properties.SourceId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "relationshipresources| where type == 'microsoft.relationships/servicegroupmember'| where properties.TargetId == '/providers/Microsoft.Management/serviceGroups/123' | project properties.SourceId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "relationshipresources| where type == 'microsoft.relationships/servicegroupmember'| where properties.TargetId == '/providers/Microsoft.Management/serviceGroups/123' | project properties.SourceId" -UseTenantScope
```

# [Portal](#tab/azure-portal)

- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/relationshipresources%7C%20where%20type%20%3D%3D%20'microsoft.relationships%2Fservicegroupmember'%7C%20where%20properties.TargetId%20%3D%3D%20'%2Fproviders%2FMicrosoft.Management%2FserviceGroups%2F123'%20%7C%20project%20properties.SourceId" target="_blank">portal.azure.com</a>

---

### Count of Members for all Service Groups

Provides a count of service group members for a particular service group. In this example, the service group ID is '123'.

```kusto
relationshipresources
    | where type == "microsoft.relationships/servicegroupmember"
    | where properties.TargetId == '/providers/Microsoft.Management/serviceGroups/123'
    | count 
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "relationshipresources| where type == 'microsoft.relationships/servicegroupmember'| where properties.TargetId == '/providers/Microsoft.Management/serviceGroups/123' | count"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "relationshipresources| where type == 'microsoft.relationships/servicegroupmember'| where properties.TargetId == '/providers/Microsoft.Management/serviceGroups/123' | count" -UseTenantScope
```

# [Portal](#tab/azure-portal)

- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/relationshipresources%7C%20where%20type%20%3D%3D%20'microsoft.relationships%2Fservicegroupmember'%7C%20where%20properties.TargetId%20%3D%3D%20'%2Fproviders%2FMicrosoft.Management%2FserviceGroups%2F123'%20%7C%20count" target="_blank">portal.azure.com</a>

---

### Count members per Service Group 

Provides the number of relationships per existing Service Group. 

```kusto
resourcecontainers
| where type == "microsoft.management/servicegroups"
| project SGName = ['id']
| join kind=inner (
    relationshipresources
    | where type == "microsoft.relationships/servicegroupmember"
    | project TargetID = tostring(properties.TargetId), relationshipid = tostring(id)
) on $left.SGName == $right.TargetID
|project SGName, relationshipid
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



- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20subscriptionId%2c%20name%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20subscriptionId%2c%20name%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20subscriptionId%2c%20name%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.cn</a>

---

### Count Membership of Service Group per resource

Provides the number of relationships per existing Service Group. 

```kusto
resourcecontainers
| where type == "microsoft.management/servicegroups"
| project SGName = ['id']
| join kind=inner (
    relationshipresources
    | where type == "microsoft.relationships/servicegroupmember"
    | project TargetID = tostring(properties.TargetId), relationshipid = tostring(id)
) on $left.SGName == $right.TargetID
|project SGName, relationshipid
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



- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20subscriptionId%2c%20name%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20subscriptionId%2c%20name%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/#blade/HubsExtension/ArgQueryBlade/query/ResourceContainers%0a%7c%20where%20type%20%3d%7e%20%27microsoft.resources%2fsubscriptions%27%0a%7c%20extend%20%20mgParent%20%3d%20properties.managementGroupAncestorsChain%0a%7c%20mv-expand%20with_itemindex%3dMGHierarchy%20mgParent%0a%7c%20project%20subscriptionId%2c%20name%2c%20mgParent%2c%20MGHierarchy%2c%20mgParent.name" target="_blank">portal.azure.cn</a>

---

