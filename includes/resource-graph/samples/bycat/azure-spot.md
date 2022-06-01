---
author: timwarner-msft
ms.service: resource-graph
ms.topic: include
ms.date: 03/23/2022
ms.author: timwarner
ms.custom: generated
---

### Compare the Spot eviction rate across multiple VM SKUs and regions

This query gets the Spot eviction rate across multiple VM SKUs and regions. Spot eviction rate is presented as a percentage range. The results are sorted by VM SKU and region in ascending order.

```kusto
SpotResources
| where type =~ 'microsoft.compute/skuspotevictionrate/location'
| where sku.name in~ ('standard_d2s_v4', 'standard_d4s_v4')
| where location in~ ('eastus', 'southcentralus')
| project skuName = tostring(sku.name), location, spotEvictionRate = tostring(properties.evictionRate)
| order by skuName asc, location asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az graph query -q "SpotResources | where type =~ 'microsoft.compute/skuspotevictionrate/location' | where sku.name in~ ('standard_d2s_v4', 'standard_d4s_v4') | where location in~ ('eastus', 'southcentralus') | project skuName = tostring(sku.name), location, spotEvictionRate = tostring(properties.evictionRate) | order by skuName asc, location asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Search-AzGraph -Query "SpotResources | where type =~ 'microsoft.compute/skuspotevictionrate/location' | where sku.name in~ ('standard_d2s_v4', 'standard_d4s_v4') | where location in~ ('eastus', 'southcentralus') | project skuName = tostring(sku.name), location, spotEvictionRate = tostring(properties.evictionRate) | order by skuName asc, location asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SpotResources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fskuspotevictionrate%2Flocation%27%0A%7C%20where%20sku.name%20in~%20%28%27standard_d2s_v4%27%2C%20%27standard_d4s_v4%27%29%0A%7C%20where%20location%20in~%20%28%27eastus%27%2C%20%27southcentralus%27%29%0A%7C%20project%20skuName%20%3D%20tostring%28sku.name%29%2C%20location%2C%20spotEvictionRate%20%3D%20tostring%28properties.evictionRate%29%0A%7C%20order%20by%20skuName%20asc%2C%20location%20asc" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SpotResources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fskuspotevictionrate%2Flocation%27%0A%7C%20where%20sku.name%20in~%20%28%27standard_d2s_v4%27%2C%20%27standard_d4s_v4%27%29%0A%7C%20where%20location%20in~%20%28%27eastus%27%2C%20%27southcentralus%27%29%0A%7C%20project%20skuName%20%3D%20tostring%28sku.name%29%2C%20location%2C%20spotEvictionRate%20%3D%20tostring%28properties.evictionRate%29%0A%7C%20order%20by%20skuName%20asc%2C%20location%20asc" target="_blank">portal.Azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SpotResources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fskuspotevictionrate%2Flocation%27%0A%7C%20where%20sku.name%20in~%20%28%27standard_d2s_v4%27%2C%20%27standard_d4s_v4%27%29%0A%7C%20where%20location%20in~%20%28%27eastus%27%2C%20%27southcentralus%27%29%0A%7C%20project%20skuName%20%3D%20tostring%28sku.name%29%2C%20location%2C%20spotEvictionRate%20%3D%20tostring%28properties.evictionRate%29%0A%7C%20order%20by%20skuName%20asc%2C%20location%20asc" target="_blank">portal.Azure.cn</a>

---

### Compare the latest Spot price across multiple VM SKUs and regions for an OS type

This query gets the latest Spot price across multiple VM SKUs and regions for an OS type. The results are sorted by price in ascending order.

```kusto
SpotResources
| where type =~ 'microsoft.compute/skuspotpricehistory/ostype/location'
| where sku.name in~ ('standard_d2s_v4', 'standard_d4s_v4')
| where properties.osType =~ 'linux'
| where location in~ ('eastus', 'southcentralus')
| project skuName = tostring(sku.name), osType = tostring(properties.osType), location, latestSpotPriceUSD = todouble(properties.spotPrices[0].priceUSD)
| order by latestSpotPriceUSD asc
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az graph query -q "SpotResources | where type =~ 'microsoft.compute/skuspotpricehistory/ostype/location' | where sku.name in~ ('standard_d2s_v4', 'standard_d4s_v4') | where properties.osType =~ 'linux' | where location in~ ('eastus', 'southcentralus') | project skuName = tostring(sku.name), osType = tostring(properties.osType), location, latestSpotPriceUSD = todouble(properties.spotPrices[0].priceUSD) | order by latestSpotPriceUSD asc"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Search-AzGraph -Query "SpotResources | where type =~ 'microsoft.compute/skuspotpricehistory/ostype/location' | where sku.name in~ ('standard_d2s_v4', 'standard_d4s_v4') | where properties.osType =~ 'linux' | where location in~ ('eastus', 'southcentralus') | project skuName = tostring(sku.name), osType = tostring(properties.osType), location, latestSpotPriceUSD = todouble(properties.spotPrices[0].priceUSD) | order by latestSpotPriceUSD asc"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SpotResources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fskuspotpricehistory%2Fostype%2Flocation%27%0A%7C%20where%20sku.name%20in~%20%28%27standard_d2s_v4%27%2C%20%27standard_d4s_v4%27%29%0A%7C%20where%20properties.osType%20%3D~%20%27linux%27%0A%7C%20where%20location%20in~%20%28%27eastus%27%2C%20%27southcentralus%27%29%0A%7C%20project%20skuName%20%3D%20tostring%28sku.name%29%2C%20osType%20%3D%20tostring%28properties.osType%29%2C%20location%2C%20latestSpotPriceUSD%20%3D%20todouble%28properties.spotPrices%5B0%5D.priceUSD%29%0A%7C%20order%20by%20latestSpotPriceUSD%20asc" target="_blank">portal.Azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SpotResources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fskuspotpricehistory%2Fostype%2Flocation%27%0A%7C%20where%20sku.name%20in~%20%28%27standard_d2s_v4%27%2C%20%27standard_d4s_v4%27%29%0A%7C%20where%20properties.osType%20%3D~%20%27linux%27%0A%7C%20where%20location%20in~%20%28%27eastus%27%2C%20%27southcentralus%27%29%0A%7C%20project%20skuName%20%3D%20tostring%28sku.name%29%2C%20osType%20%3D%20tostring%28properties.osType%29%2C%20location%2C%20latestSpotPriceUSD%20%3D%20todouble%28properties.spotPrices%5B0%5D.priceUSD%29%0A%7C%20order%20by%20latestSpotPriceUSD%20asc" target="_blank">portal.Azure.us</a>
- Azure China 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/SpotResources%0A%7C%20where%20type%20%3D~%20%27microsoft.compute%2Fskuspotpricehistory%2Fostype%2Flocation%27%0A%7C%20where%20sku.name%20in~%20%28%27standard_d2s_v4%27%2C%20%27standard_d4s_v4%27%29%0A%7C%20where%20properties.osType%20%3D~%20%27linux%27%0A%7C%20where%20location%20in~%20%28%27eastus%27%2C%20%27southcentralus%27%29%0A%7C%20project%20skuName%20%3D%20tostring%28sku.name%29%2C%20osType%20%3D%20tostring%28properties.osType%29%2C%20location%2C%20latestSpotPriceUSD%20%3D%20todouble%28properties.spotPrices%5B0%5D.priceUSD%29%0A%7C%20order%20by%20latestSpotPriceUSD%20asc" target="_blank">portal.Azure.cn</a>

---

