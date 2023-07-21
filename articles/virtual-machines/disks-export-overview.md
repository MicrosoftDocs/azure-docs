---
title: Ultra disks for VMs - Azure managed disks 
description: Learn about ultra disks for Azure VMs
author: roygara
ms.service: azure-disk-storage
ms.topic: how-to
ms.date: 06/07/2023
ms.author: rogarana
ms.custom: references_regions
---

# Options for securing a managed disk

There are a few options for securing Azure managed disks.

First, you can 

Via Azure RBAC by creating a custom role without the operations required for exporting and importing.
Setting NetworkAccessPolicy to DenyAll for all the disks and snapshots in a subscription via an Azure policy
Enabling AzureAD authentication for exporting and importing
Enabling private links for exporting and importing data from secured Microsoft network.
