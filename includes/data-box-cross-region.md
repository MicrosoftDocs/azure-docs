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

Data Box cross-region data transfer capabilities, now in preview, support offline seamless cross-region data transfers between many regions. This capability allows you to copy your data from a local source and transfer it to a destination within a different country, region, or boundary. It's important to note that the Data Box device isn't shipped across commerce boundaries. Instead, it's transported to an Azure data center within the originating country or region. Data transfer between the source country and the destination region takes place using the Azure network and incurs no additional cost.

Although cross-region data transfer doesn't incur additional costs, the functionality is currently in preview and subject to change. Note, too, that some data transfer scenarios take place over large geographic areas. Higher than normal latencies might be encountered during such transfers.

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