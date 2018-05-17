---
title: include file
description: include file
services: azure-policy
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 05/17/2018
ms.author: dacoulte
ms.custom: include file
---

### Virtual Machines

|  |  |
|---------|---------|
| [Allow custom VM image from a Resource Group](../articles/azure-policy/scripts/allow-custom-vm-image.md) |  Requires that custom images come from an approved resource group. You specify the name of the approved resource group. |
| [Allowed SKUs for Storage Accounts and Virtual Machines](../articles/azure-policy/scripts/allowed-skus-storage.md) | Requires that storage accounts and virtual machines use approved SKUs. Uses built-in policies to ensure approved SKUs. You specify an array of approved virtual machines SKUs, and an array of approved storage account SKUs. |
| [Approved VM images](../articles/azure-policy/scripts/allowed-custom-images.md) | Requires that only approved custom images are deployed in your environment. You specify an array of approved image IDs. |
| [Audit if extension does not exist](../articles/azure-policy/scripts/audit-ext-not-exist.md) | Audits if an extension is not deployed with a virtual machine. You specify the extension publisher and type to check whether it was deployed. |
| [Not allowed VM Extensions](../articles/azure-policy/scripts/not-allowed-vm-ext.md) | Prohibits the use of specified extensions. You specify an array containing the prohibited extension types. |