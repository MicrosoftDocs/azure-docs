---
author: timwarner-msft
ms.service: resource-graph
ms.topic: include
ms.date: 03/18/2022
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

---
