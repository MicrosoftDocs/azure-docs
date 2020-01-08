---
title: Resize the capacity pool or a volume for Azure NetApp Files  | Microsoft Docs
description: Describes how to change the size of a capacity pool or a volume. 
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
ms.date: 05/14/2019
ms.author: b-juche
---
# Resize a capacity pool or a volume
You can change the size of a capacity pool or a volume as necessary. 

## Resize the capacity pool 

You can change the capacity pool size in 1-TiB increments or decrements. However, the capacity pool size cannot be smaller than 4 TiB. Resizing the capacity pool changes the purchased Azure NetApp Files capacity.

1. From the Manage NetApp Account blade, click the capacity pool that you want to resize. 
2. Right-click the capacity pool name or click the "…" icon at the end of the capacity pool’s row to display the context menu. 
3. Use the context menu options to resize or delete the capacity pool.

## Resize a volume

You can change the size of a volume as necessary. A volume's capacity consumption counts against its pool's provisioned capacity.

1. From the Manage NetApp Account blade, click **Volumes**. 
2. Right-click the name of the volume that you want to resize or click the "…" icon at the end of the volume's row to display the context menu.
3. Use the context menu options to resize or delete the volume.

