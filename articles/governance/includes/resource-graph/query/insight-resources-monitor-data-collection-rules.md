---
ms.service: resource-graph
ms.topic: include
ms.date: 10/27/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### List VMs with data collection rule associations

This query lists virtual machines with data collection rule associations. For each virtual machine, lists data collection rules associated with it.

```kusto
insightsresources
| where type == 'microsoft.insights/datacollectionruleassociations'
| where id contains 'microsoft.compute/virtualmachines/'
| project id = trim_start('/', tolower(id)), properties
| extend idComponents = split(id, '/')
| extend subscription = tolower(tostring(idComponents[1])), resourceGroup = tolower(tostring(idComponents[3])), vmName = tolower(tostring(idComponents[7]))
| extend dcrId = properties['dataCollectionRuleId']
| where isnotnull(dcrId)
| extend dcrId = tostring(dcrId)
| summarize dcrList = make_list(dcrId), dcrCount = count() by subscription, resourceGroup, vmName
| sort by dcrCount desc
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "insightsresources | where type == 'microsoft.insights/datacollectionruleassociations' | where id contains 'microsoft.compute/virtualmachines/' | project id = trim_start('/', tolower(id)), properties | extend idComponents = split(id, '/') | extend subscription = tolower(tostring(idComponents[1])), resourceGroup = tolower(tostring(idComponents[3])), vmName = tolower(tostring(idComponents[7])) | extend dcrId = properties['dataCollectionRuleId'] | where isnotnull(dcrId) | extend dcrId = tostring(dcrId) | summarize dcrList = make_list(dcrId), dcrCount = count() by subscription, resourceGroup, vmName | sort by dcrCount desc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "insightsresources | where type == 'microsoft.insights/datacollectionruleassociations' | where id contains 'microsoft.compute/virtualmachines/' | project id = trim_start('/', tolower(id)), properties | extend idComponents = split(id, '/') | extend subscription = tolower(tostring(idComponents[1])), resourceGroup = tolower(tostring(idComponents[3])), vmName = tolower(tostring(idComponents[7])) | extend dcrId = properties['dataCollectionRuleId'] | where isnotnull(dcrId) | extend dcrId = tostring(dcrId) | summarize dcrList = make_list(dcrId), dcrCount = count() by subscription, resourceGroup, vmName | sort by dcrCount desc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/insightsresources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionruleassociations%27%0D%0A%7C%20where%20id%20contains%20%27microsoft.compute%2Fvirtualmachines%2F%27%0D%0A%7C%20project%20id%20%3D%20trim_start%28%27%2F%27%2C%20tolower%28id%29%29%2C%20properties%0D%0A%7C%20extend%20idComponents%20%3D%20split%28id%2C%20%27%2F%27%29%0D%0A%7C%20extend%20subscription%20%3D%20tolower%28tostring%28idComponents%5B1%5D%29%29%2C%20resourceGroup%20%3D%20tolower%28tostring%28idComponents%5B3%5D%29%29%2C%20vmName%20%3D%20tolower%28tostring%28idComponents%5B7%5D%29%29%0D%0A%7C%20extend%20dcrId%20%3D%20properties%5B%27dataCollectionRuleId%27%5D%0D%0A%7C%20where%20isnotnull%28dcrId%29%0D%0A%7C%20extend%20dcrId%20%3D%20tostring%28dcrId%29%0D%0A%7C%20summarize%20dcrList%20%3D%20make_list%28dcrId%29%2C%20dcrCount%20%3D%20count%28%29%20by%20subscription%2C%20resourceGroup%2C%20vmName%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/insightsresources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionruleassociations%27%0D%0A%7C%20where%20id%20contains%20%27microsoft.compute%2Fvirtualmachines%2F%27%0D%0A%7C%20project%20id%20%3D%20trim_start%28%27%2F%27%2C%20tolower%28id%29%29%2C%20properties%0D%0A%7C%20extend%20idComponents%20%3D%20split%28id%2C%20%27%2F%27%29%0D%0A%7C%20extend%20subscription%20%3D%20tolower%28tostring%28idComponents%5B1%5D%29%29%2C%20resourceGroup%20%3D%20tolower%28tostring%28idComponents%5B3%5D%29%29%2C%20vmName%20%3D%20tolower%28tostring%28idComponents%5B7%5D%29%29%0D%0A%7C%20extend%20dcrId%20%3D%20properties%5B%27dataCollectionRuleId%27%5D%0D%0A%7C%20where%20isnotnull%28dcrId%29%0D%0A%7C%20extend%20dcrId%20%3D%20tostring%28dcrId%29%0D%0A%7C%20summarize%20dcrList%20%3D%20make_list%28dcrId%29%2C%20dcrCount%20%3D%20count%28%29%20by%20subscription%2C%20resourceGroup%2C%20vmName%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/insightsresources%0D%0A%7C%20where%20type%20%3D%3D%20%27microsoft.insights%2Fdatacollectionruleassociations%27%0D%0A%7C%20where%20id%20contains%20%27microsoft.compute%2Fvirtualmachines%2F%27%0D%0A%7C%20project%20id%20%3D%20trim_start%28%27%2F%27%2C%20tolower%28id%29%29%2C%20properties%0D%0A%7C%20extend%20idComponents%20%3D%20split%28id%2C%20%27%2F%27%29%0D%0A%7C%20extend%20subscription%20%3D%20tolower%28tostring%28idComponents%5B1%5D%29%29%2C%20resourceGroup%20%3D%20tolower%28tostring%28idComponents%5B3%5D%29%29%2C%20vmName%20%3D%20tolower%28tostring%28idComponents%5B7%5D%29%29%0D%0A%7C%20extend%20dcrId%20%3D%20properties%5B%27dataCollectionRuleId%27%5D%0D%0A%7C%20where%20isnotnull%28dcrId%29%0D%0A%7C%20extend%20dcrId%20%3D%20tostring%28dcrId%29%0D%0A%7C%20summarize%20dcrList%20%3D%20make_list%28dcrId%29%2C%20dcrCount%20%3D%20count%28%29%20by%20subscription%2C%20resourceGroup%2C%20vmName%0D%0A%7C%20sort%20by%20dcrCount%20desc" target="_blank">portal.azure.cn</a>

---
