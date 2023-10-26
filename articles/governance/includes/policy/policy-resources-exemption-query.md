---
ms.service: resource-graph
ms.topic: include
ms.date: 08/31/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### Policy exemptions per assignment

Lists the number of exemptions for each assignment.

```kusto
PolicyResources
| where type == 'microsoft.authorization/policyexemptions'
| summarize count() by tostring(properties.policyAssignmentId)
```

For more information about using scopes with Azure CLI or Azure PowerShell, go to [Count Azure resources](../../resource-graph/samples/starter.md#count-resources).

# [Azure CLI](#tab/azure-cli)

Use the `--management-groups` parameter with an Azure management group ID or tenant ID. In this example, the `tenantid` variable stores the tenant ID.

```azurecli-interactive
tenantid="$(az account show --query tenantId --output tsv)"
az graph query -q "policyresources | where type == 'microsoft.authorization/policyexemptions' | summarize count() by tostring(properties.policyAssignmentId)" --management-groups $tenantid
```

# [Azure PowerShell](#tab/azure-powershell)

By default, PowerShell get results for all subscriptions in your tenant but you can also include the `-UseTenantScope` parameter.

```azurepowershell-interactive
Search-AzGraph -Query "policyresources | where type == 'microsoft.authorization/policyexemptions' | summarize count() by tostring(properties.policyAssignmentId)" -UseTenantScope
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/policyresources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.authorization%2Fpolicyexemptions%27%0D%0A%7C%20summarize%20count%28%29%20by%20tostring%28properties.policyAssignmentId%29" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/policyresources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.authorization%2Fpolicyexemptions%27%0D%0A%7C%20summarize%20count%28%29%20by%20tostring%28properties.policyAssignmentId%29" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/policyresources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.authorization%2Fpolicyexemptions%27%0D%0A%7C%20summarize%20count%28%29%20by%20tostring%28properties.policyAssignmentId%29" target="_blank">portal.azure.cn</a>

---

### Policy exemptions that expire within 90 days

Lists the name and expiration date.

```kusto
PolicyResources
| where type == 'microsoft.authorization/policyexemptions'
| extend expiresOnC = todatetime(properties.expiresOn)
| where isnotnull(expiresOnC)
| where expiresOnC >= now() and expiresOnC < now(+90d)
| project name, expiresOnC
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "policyresources | where type == 'microsoft.authorization/policyexemptions' | extend expiresOnC = todatetime(properties.expiresOn) | where isnotnull(expiresOnC) | where expiresOnC >= now() and expiresOnC < now(+90d) | project name, expiresOnC"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "policyresources | where type == 'microsoft.authorization/policyexemptions' | extend expiresOnC = todatetime(properties.expiresOn) | where isnotnull(expiresOnC) | where expiresOnC >= now() and expiresOnC < now(+90d) | project name, expiresOnC"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/policyresources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.authorization%2Fpolicyexemptions%27%0D%0A%7C%20extend%20expiresOnC%20%3D%20todatetime%28properties.expiresOn%29%0D%0A%7C%20where%20isnotnull%28expiresOnC%29%0D%0A%7C%20where%20expiresOnC%20%3E%3D%20now%28%29%20and%20expiresOnC%20%3C%20now%28%2B90d%29%0D%0A%7C%20project%20name%2C%20expiresOnC" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/policyresources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.authorization%2Fpolicyexemptions%27%0D%0A%7C%20extend%20expiresOnC%20%3D%20todatetime%28properties.expiresOn%29%0D%0A%7C%20where%20isnotnull%28expiresOnC%29%0D%0A%7C%20where%20expiresOnC%20%3E%3D%20now%28%29%20and%20expiresOnC%20%3C%20now%28%2B90d%29%0D%0A%7C%20project%20name%2C%20expiresOnC" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/policyresources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.authorization%2Fpolicyexemptions%27%0D%0A%7C%20extend%20expiresOnC%20%3D%20todatetime%28properties.expiresOn%29%0D%0A%7C%20where%20isnotnull%28expiresOnC%29%0D%0A%7C%20where%20expiresOnC%20%3E%3D%20now%28%29%20and%20expiresOnC%20%3C%20now%28%2B90d%29%0D%0A%7C%20project%20name%2C%20expiresOnC" target="_blank">portal.azure.cn</a>

---
