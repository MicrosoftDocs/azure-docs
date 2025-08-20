---
title: Turning off key-based access on cache accounts.
description: Azure Resource Manager templates for using Azure Site Recovery features.
services: site-recovery
author: swbela
ms.service: azure-site-recovery
ms.topic: Security
ms.date: 20/08/2025
ms.author: swbela
ms.custom: engagement-fy23, devx-track-arm-template
# Customer intent: "I want to turn off key-based authentication on cache account."
---

# Steps for turning off key-based authentication on cache account.

Step 1 : Enable Managed Identity on the Recovery Services Vault. Follow below guide on how to do it.
        https://learn.microsoft.com/en-us/azure/site-recovery/azure-to-azure-how-to-enable-replication-private-endpoints#enable-the-managed-identity-for-the-vault

Step 2: Grant access to Recovery services vault managed identity to read-write to cache account. Follow this guide.
        https://learn.microsoft.com/en-us/azure/site-recovery/azure-to-azure-how-to-enable-replication-private-endpoints#grant-required-permissions-to-the-vault
        
Step 3: Turn off the key based access on cache account.
Step 4: New protections can be done now with cache account that has key-auth off.

Note : 
1. If you are already using a scenario that requires use of recovery services vault identity, then you just need to do step 3.
2. If your vault does not have managed identity when VMs were protected, managed identity can be added after VMs are protected as well.
   You will need to follow step 1 to step 3 in this case.
In either case re-enable is NOT needed.
   