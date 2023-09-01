---
ms.service: resource-graph
ms.topic: include
ms.date: 08/31/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### Summarize count

```kusto
authorizationresources
| summarize count()
```

# [Azure CLI](#tab/azure-cli)

By default, Azure CLI queries all accessible subscriptions but you can specify the `--subscriptions` parameter to query specific subscriptions.

```azurecli-interactive
az graph query -q "authorizationresources | summarize count()"
```

This example uses a variable for the subscription ID.

```azurecli-interactive
subid=$(az account show --query id --output tsv)
az graph query -q "authorizationresources | summarize count()" --subscriptions $subid
```

You can also query by the scopes for management group and tenant. Replace `<managementGroupId>` and `<tenantId>` with your values.

```azurecli-interactive
az graph query -q "authorizationresources | summarize count()" --management-groups '<managementGroupId>'
```

```azurecli-interactive
az graph query -q "authorizationresources | summarize count()" --management-groups '<tenantId>'
```

You can also use a variable for the tenant ID.

```azurecli-interactive
tenantid=$(az account show --query tenantId --output tsv)
az graph query -q "authorizationresources | summarize count()" --management-groups $tenantid
```

# [Azure PowerShell](#tab/azure-powershell)

By default, Azure PowerShell gets results for all subscriptions in your tenant.

```azurepowershell-interactive
Search-AzGraph -Query "authorizationresources | summarize count()"
```

This example uses a variable to query a specific subscription ID.

```azurepowershell-interactive
$subid = (Get-AzContext).Subscription.Id
Search-AzGraph -Query "authorizationresources | summarize count()" -Subscription $subid
```

You can query by the scopes for management group and tenant. Replace `<managementGroupId>`with your value. The `UseTenantScope` parameter doesn't require a value.

```azurepowershell-interactive
Search-AzGraph -Query "authorizationresources | summarize count()" -ManagementGroup '<managementGroupId>'
```

```azurepowershell-interactive
Search-AzGraph -Query "authorizationresources | summarize count()" -UseTenantScope
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0D%0A%7C%20summarize%20count%28%29" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0D%0A%7C%20summarize%20count%28%29" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/authorizationresources%0D%0A%7C%20summarize%20count%28%29" target="_blank">portal.azure.cn</a>

---
