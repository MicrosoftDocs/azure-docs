---
title: Data tiering and extension nodes for SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Learn about data tiering and extension nodes for SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: lauradolan
manager: bburns
editor: ''
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/17/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---
# Use SAP HANA data tiering and extension nodes

SAP supports a data tiering model for SAP Business Warehouse (BW) with different SAP NetWeaver releases and SAP BW/4HANA. For more information about the data tiering model, see [SAP BW/4HANA and SAP BW on HANA with SAP HANA extension nodes](https://www.sap.com/documents/2018/05/9878c71f-037d-0010-87a3-c30de2ffd8ff.html).

With HANA Large Instance, you can use the option 1 configuration of SAP HANA extension nodes, as explained in the FAQ and SAP blog documents. Option 2 configurations can be set up with the following HANA Large Instance SKUs: S72m, S192, S192m, S384, and S384m.

## Advantages of SAP HANA extension nodes

Using SAP HANA extension nodes, either option 1 or 2, is an easy way to make better use of SAP HANA memory. The advantages of SAP HANA extension nodes become clear when you look at the SAP sizing guidelines. Here are a few examples:

- SAP HANA sizing guidelines usually require double the amount of data volume compared to memory. When you run your SAP HANA instance with hot data, only 50 percent or less of your memory stores data. Ideally, the remaining memory is held for SAP HANA to do its work.
- That means in a HANA Large Instance S192 unit with 2 TB of memory running an SAP BW database, you only have 1 TB in data volume.
- If you use another SAP HANA extension node option 1, also a S192 HANA Large Instance SKU, it gives you another 2-TB capacity in data volume. In the option 2 configuration, you get another 4 TB for warm data volume. Compared to the hot node, the full memory capacity of the "warm" extension node can be used for storing data for option 1. Double the memory can be used for data volume in the option 2 SAP HANA extension node configuration.
- You end up with a capacity of 3 TB for your data and a hot-to-warm ratio of 1:2 for option 1. You have 5 TB of data and a 1:4 ratio with the option 2 extension node configuration.

The higher the data volume compared to memory, the greater your chances that the warm data you're asking for is stored on disk.

## Next steps

Learn about the operations model for SAP HANA on Azure (Large Instances) and your responsibilities.

> [!div class="nextstepaction"]
> [Operations model and responsibilities](hana-operations-model.md)
