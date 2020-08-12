---
title: Enable shared disks for Azure managed disks
description: Configure an Azure managed disk with shared disks so that you can share it across multiple VMs
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 07/30/2020
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Enable shared disk

This article covers how to enable the shared disks feature for Azure managed disks. Azure shared disks is a new feature for Azure managed disks that enables you to attach a managed disk to multiple virtual machines (VMs) simultaneously. Attaching a managed disk to multiple VMs allows you to either deploy new or migrate existing clustered applications to Azure. 

If you are looking for conceptual information on managed disks that have shared disks enabled, refer to [Azure shared disks](disks-shared.md).
[!INCLUDE [virtual-machines-enable-shared-disk](../../../includes/virtual-machines-enable-shared-disk.md)]