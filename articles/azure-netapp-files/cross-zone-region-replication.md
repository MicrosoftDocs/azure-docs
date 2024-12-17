---
title: Understand cross-zone region replication in Azure NetApp Files
description: Learn about cross-zone region replication in Azure NetApp Files for creating an extra layer of data protection.  
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 11/20/2024
ms.author: anfdocs
---

# Understand cross-zone region replication in Azure NetApp Files

Azure NetApp Files supports using cross-zone and cross-region replication on the same source volume. With this added layer of protection, you can protect your volumes with a second protection volume in the following combinations:

* Cross-region and​ cross-zone replication target volumes

:::image type="content" source="./media/cross-zone-region-introduction/zone-region.png" alt-text="Diagram of cross-zone and cross-region replication." lightbox="./media/cross-zone-region-introduction/zone-region.png":::

* Two cross-region replication target volumes

:::image type="content" source="./media/cross-zone-region-introduction/double-region.png" alt-text="Diagram of double cross-region replication." lightbox="./media/cross-zone-region-introduction/double-region.png":::

* Two cross-zone replication target volumes in any combination of availability zones, including in-zone replication

:::image type="content" source="./media/cross-zone-region-introduction/double-zone.png" alt-text="Diagram of double cross-zone replication." lightbox="./media/cross-zone-region-introduction/double-zone.png":::

## Requirements 

* Cross-zone region replication adheres to the same requirements as [cross-zone replication](cross-zone-replication-requirements-considerations.md) and [cross-region replication](cross-region-replication-requirements-considerations.md).

* If you use cross-region replication, you must adhere to supported [cross-region replication pairs](cross-region-replication-introduction.md#supported-region-pairs).

## Next steps

- [Manage cross-zone region replication](cross-zone-region-replication-configure.md)