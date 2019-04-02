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

## Storage

|  |  |
|---------|---------|
| [Allowed SKUs for Storage Accounts and Virtual Machines](../articles/governance/policy/samples/allowed-skus-storage.md) | Requires that storage accounts and virtual machines use approved SKUs. Uses built-in policies to ensure approved SKUs. You specify an array of approved virtual machines SKUs, and an array of approved storage account SKUs. |
| [Allowed storage account SKUs](../articles/governance/policy/samples/allowed-storage-account-skus.md) | Requires that storage accounts use an approved SKU. You specify an array of approved SKUs. |
| [Deny cool access tiering for storage accounts](../articles/governance/policy/samples/deny-cool-access-tiering.md) | Prohibits the use of cool access tiering for blob storage accounts.  |
| [Ensure https traffic only for storage account](../articles/governance/policy/samples/ensure-https-storage-account.md) | Requires storage accounts to use HTTPS traffic.  |
| [Ensure storage file encryption](../articles/governance/policy/samples/ensure-storage-file-encryption.md) | Requires that file encryption is enabled for storage accounts.  |
| [Require storage account encryption](../articles/governance/policy/samples/require-storage-account-encryption.md) | Requires the storage account use blob encryption.  |