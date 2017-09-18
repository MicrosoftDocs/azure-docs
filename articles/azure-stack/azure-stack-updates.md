---
title: Manage updates in Azure Stack overview | Microsoft Docs
description: Learn about update management for Azure Stack integrated systems.
services: azure-stack
documentationcenter: ''
author: twooley
manager: byronr
editor: ''

ms.assetid: 9b0781f4-2cd5-4619-a9b1-59182b4a6e43
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: twooley

---
# Manage updates in Azure Stack overview

*Applies to: Azure Stack integrated systems*

Microsoft will release update packages for Azure Stack integrated systems on a regular basis. Each release of Microsoft software updates is bundled as a single update package. As an Azure Stack operator, you can easily import, install, and monitor the installation progress of these update packages from the administrator portal. 

Your original equipment manufacturer (OEM) hardware vendor will also release updates, such as driver and firmware updates. These updates are delivered as separate packages by your OEM hardware vendor, and are managed separately from Microsoft updates.

To keep your system under support, you must keep Azure Stack updated to a specific version level. Make sure that you review the [Azure Stack servicing policy](azure-stack-servicing-policy.md).

> [!NOTE]
> You can't apply Azure Stack update packages to Azure Stack Development Kit. The update packages are designed for highly available integrated systems.

## The Update resource provider

Azure Stack includes an Update resource provider that orchestrates the application of Microsoft software updates. This resource provider ensures that updates are applied across all physical hosts, Service Fabric applications and runtimes, and all infrastructure virtual machines and their associated services.

As updates install, you can easily view high-level status as the update process targets the various subsystems in Azure Stack (for example, physical hosts, and infrastructure virtual machines).

## Plan for updates

We strongly recommend that you notify users of any maintenance operations, and that you schedule normal maintenance windows during non-business hours as much as possible. Maintenance operations may affect both tenant workloads and portal operations.

## Using the Update tile to manage updates
Managing updates from the administrator portal is a simple process. An Azure Stack operator can navigate to the Update tile in the dashboard to:

- view important information such as the current version.
- install updates, and monitor progress.
- review update history for previously installed updates.
 
## Determine the current version

The Update tile shows the current version of Azure Stack. You can get to the Update tile by using either of the following methods in the administrator portal:

- On the dashboard, view the current version in the **Update** tile.
 
   ![Updates tile on default dashboard](./media/azure-stack-updates/image1.png)
 
- On the **Region management** tile, click the region name. View the current version in the **Update** tile.

## Next steps

- [Azure Stack servicing policy](azure-stack-servicing-policy.md) 
- [Region management in Azure Stack](azure-stack-region-management.md)     


