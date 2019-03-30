---
title: Data tiering and extension nodes for SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Data tiering and extension nodes for SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: jeconnoc
editor: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/04/2018
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Use SAP HANA data tiering and extension nodes

SAP supports a data tiering model for SAP BW of different SAP NetWeaver releases and SAP BW/4HANA. For more information about the data tiering model, see the SAP document
[SAP BW/4HANA and SAP BW on HANA with SAP HANA extension nodes](https://www.sap.com/documents/2017/05/ac051285-bc7c-0010-82c7-eda71af511fa.html#).
With HANA Large Instance, you can use option-1 configuration of SAP HANA extension nodes as explained in the FAQ and SAP blog documents. Option-2 configurations can be set up with the following HANA Large Instance SKUs: S72m, S192, S192m, S384, and S384m. 

When you look at the documentation, the advantage might not be visible immediately. But when you look at the SAP sizing guidelines, you can see an advantage by using option-1 and option-2 SAP HANA extension nodes. Here are examples:

- SAP HANA sizing guidelines usually require double the amount of data volume as memory. When you run your SAP HANA instance with the hot data, you have only 50 percent or less of the memory filled with data. The remainder of the memory is ideally held for SAP HANA doing its work.
- That means in a HANA Large Instance S192 unit with 2 TB of memory, running an SAP BW database, you only have 1 TB as data volume.
- If you use an additional SAP HANA extension node of option-1, also a S192 HANA Large Instance SKU, it gives you an additional 2-TB capacity for data volume. In the option-2 configuration, you get an additional 4 TB for warm data volume. Compared to the hot node, the full memory capacity of the "warm" extension node can be used for data storing for option-1. Double the memory can be used for data volume in option-2 SAP HANA extension node configuration.
- You end up with a capacity of 3 TB for your data and a hot-to-warm ratio of 1:2 for option-1. You have 5 TB of data and a 1:4 ratio with the option-2 extension node configuration.

The higher the data volume compared to the memory, the higher the chances are that the warm data you are asking for is stored on disk storage.

**Next steps**
- Refer [SAP HANA (Large Instances) architecture on Azure](hana-architecture.md)