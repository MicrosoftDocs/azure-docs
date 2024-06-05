---
ms.service: resource-graph
ms.topic: include
ms.date: 12/13/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### List Azure App Service TLS version

List an Azure App Service's minimum Transport Layer Security (TLS) version for incoming requests to a web app.

```kusto
AppServiceResources
| where type =~ 'microsoft.web/sites/config'
| project id, name, properties.MinTlsVersion
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "AppServiceResources | where type =~ 'microsoft.web/sites/config' | project id, name, properties.MinTlsVersion"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "AppServiceResources | where type =~ 'microsoft.web/sites/config' | project id, name, properties.MinTlsVersion"
```

# [Portal](#tab/azure-portal)



- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/AppServiceResources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.web%2Fsites%2Fconfig%27%0D%0A%7C%20project%20id%2C%20name%2C%20properties.MinTlsVersion" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/AppServiceResources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.web%2Fsites%2Fconfig%27%0D%0A%7C%20project%20id%2C%20name%2C%20properties.MinTlsVersion" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/AppServiceResources%0D%0A%7C%20where%20type%20%3D~%20%27microsoft.web%2Fsites%2Fconfig%27%0D%0A%7C%20project%20id%2C%20name%2C%20properties.MinTlsVersion" target="_blank">portal.azure.cn</a>

---
