---
author: stevenmatthew
ms.service: databox  
ms.topic: include
ms.date: 05/30/2024
ms.author: shaas
---

> [!IMPORTANT]
> Azure Data Box cross-region data transfer is in preview status

Previous releases of Data Box, Data Box Disk, and Data Box Heavy didn’t support cross-region data transfer. With the exception of transfers both originating and terminating between the United Kingdom (UK) and the European Union (EU), data couldn’t cross commerce boundaries.

Data Box cross-region data transfer capabilities, now in preview, support offline seamless cross-region data transfers between many regions. This capability allows you to copy your data from a local source and transfer it to a destination within a different country, region, or boundary. Data is transferred between regions using the Azure network and incurs no additional cost.

Note that although cross-region data transfer currently doesn’t incur additional costs, functionality is presently in preview and subject to change. Note, too, that in some scenarios data transfers might be crossing large geographic areas. Higher than normal latencies may be encountered during such transfers.

Cross-region transfers are currently supported between the following countries and regions:

| Source Country |  Destination Region |
|----------------|---------------------|
| Brazil         |  US<sup>1</sup>     |
| Australia<br>Singapore<br>Hong Kong<br>India<br>Japan<br>Korea | US<sup>1</sup>, EU<sup>2</sup> |
| UAE            | US<sup>1</sup>, EU<sup>2</sup> |
| US<sup>1</sup> | EU<sup>2</sup>      |
| EU<sup>2</sup> | US<sup>1</sup>      |

<sup>1</sup>US denotes all Azure regions in which Data Box is supported across the United States.<br>
<sup>2</sup>EU denotes all Azure regions in which Data Box is supported across the European Union. 

Data transfers not represented within the preceding table represent unsupported cross-commerce boundary transfer selections. For more information, or if your region combination is unsupported, please contact the [Azure Data Box team](mailto:azuredbx@microsoft.com).