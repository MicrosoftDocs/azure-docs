---
title: Service levels for Azure NetApp Files | Microsoft Docs
description: Describes throughput performance for the service levels of Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/14/2019
ms.author: b-juche
---
# Service levels for Azure NetApp Files
Azure NetApp Files supports two service levels: Premium and Standard. 

## <a name="Premium"></a>Premium storage

The *Premium* storage provides up to 64 MiB/s per TiB of throughput. Throughput performance is indexed against volume quota. For example, a volume from the Premium storage with 2 TiB of provisioned quota (regardless of actual consumption) has a throughput of 128 MiB/s.

## <a name="Standard"></a>Standard storage

The *Standard* storage provides up to 16 MiB/s per TiB of throughput. Throughput performance is indexed against volume quota. For example, a volume from the Standard storage with 2 TiB of provisioned quota (regardless of actual consumption) has a throughput of 32 MiB/s.

## Next steps

- See the [Azure NetApp Files pricing page](https://azure.microsoft.com/pricing/details/storage/netapp/) for the price of different service levels
- [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
