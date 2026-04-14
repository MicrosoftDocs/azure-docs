---
ms.service: resource-graph
ms.topic: include
ms.date: 09/15/2025
author: seligj95
ms.author: jordanselig
---

### List all Azure App Service resources

List all Azure App Service resources.

```kusto
Resources
| where type in ('microsoft.web/sites', 'microsoft.web/sites/slots', 'microsoft.web/serverfarms', 'microsoft.web/environment', 'microsoft.web/hostingenvironment')
| project name, type, kind, location, resourceGroup, sku , properties
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type in ('microsoft.web/sites', 'microsoft.web/sites/slots', 'microsoft.web/serverfarms', 'microsoft.web/environment', 'microsoft.web/hostingenvironment') | project name, type, kind, location, resourceGroup, sku , properties"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type in ('microsoft.web/sites', 'microsoft.web/sites/slots', 'microsoft.web/serverfarms', 'microsoft.web/environment', 'microsoft.web/hostingenvironment') | project name, type, kind, location, resourceGroup, sku , properties"
```

# [Portal](#tab/azure-portal)

- Azure portal: <a href="https://portal.azure.com/#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20in%20('microsoft.web%2Fsites'%2C%20'microsoft.web%2Fsites%2Fslots'%2C%20'microsoft.web%2Fserverfarms'%2C%20'microsoft.web%2Fenvironment'%2C%20'microsoft.web%2Fhostingenvironment')%0D%0A%7C%20project%20name%2C%20type%2C%20kind%2C%20location%2C%20resourceGroup%2C%20sku%20%2C%20properties" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20in%20('microsoft.web%2Fsites'%2C%20'microsoft.web%2Fsites%2Fslots'%2C%20'microsoft.web%2Fserverfarms'%2C%20'microsoft.web%2Fenvironment'%2C%20'microsoft.web%2Fhostingenvironment')%0D%0A%7C%20project%20name%2C%20type%2C%20kind%2C%20location%2C%20resourceGroup%2C%20sku%20%2C%20properties" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/#blade/HubsExtension/ArgQueryBlade/query/Resources%0D%0A%7C%20where%20type%20in%20('microsoft.web%2Fsites'%2C%20'microsoft.web%2Fsites%2Fslots'%2C%20'microsoft.web%2Fserverfarms'%2C%20'microsoft.web%2Fenvironment'%2C%20'microsoft.web%2Fhostingenvironment')%0D%0A%7C%20project%20name%2C%20type%2C%20kind%2C%20location%2C%20resourceGroup%2C%20sku%20%2C%20properties" target="_blank">portal.azure.cn</a>

---
