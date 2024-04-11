---
author: stevenmatthew
ms.service: databox  
ms.topic: include
ms.date: 04/10/2024
ms.author: shaas
---

> [!IMPORTANT]
> Azure Data Box cross-region data transfer is in preview status

Previously, Data Box, Data Box Heavy, and Data Box Disk didn’t support cross-region data transfer. With the exception of transfers both originating and terminating between the United Kingdom (UK) and the European Union (EU), data couldn’t cross commerce boundaries.  

Data Box cross-region data transfer capabilities, now in preview, support offline seamless cross-region data transfers between many regions. This capability allows you to copy your data from a local source and transfer it to a destination within a different country, region, or boundary. Data is transferred between regions using the Azure network and incurs no additional cost while in preview status.  

Note that although cross-region data transfer currently doesn’t incur additional costs, functionality is presently in preview and subject to change. Note, too, that in some scenarios data transfers might be crossing large geographic areas. Higher than normal latencies may be encountered during such transfers. 

At present, cross-region transfers are supported between the following between the following countries and regions: 

| Source Geo  | Source Region | Destination Geo | Destination Region |
|-------------|---------------|-----------------|--------------------|
| Brazil      | Brazil South  | US<sup>1</sup>  |                    |
| APAC        | Australia<br>Singapore<br>Hong Kong<br>India<br>Japan<br>Korea | US<sup>1</sup>, EU<sup>2</sup> | |
| Middle East | UAE           | US<sup>1</sup>, EU<sup>2</sup> |     |
| US<sup>1</sup> |            | EU<sup>2</sup>  |                    |
| EU<sup>2</sup> |            | US<sup>1</sup>  |                    |
| China       |               | US<sup>1</sup>  |                    |

<sup>1</sup>US denotes all Azure regions in which Data Box is supported across the United States.<br>
<sup>2</sup>EU denotes all Azure regions in which Data Box is supported across the European Union. 

Data transfers not represented within the preceding table represent unsupported cross-commerce boundary transfer selections. For more information, or if your region combination is unsupported, please contact the [Azure Data Box team](mailto:azuredbx@microsoft.com).