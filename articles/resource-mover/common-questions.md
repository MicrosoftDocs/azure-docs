---
title: Common questions about Azure Resource Mover?
description: Get answers to common questions about  Azure Resource Mover
author: rayne-wiselman
manager: evansma
ms.service: resource-move
ms.topic: conceptual
ms.date: 09/07/2020
ms.author: raynew

---

# Common questions

This article answers common questions about [Azure Resource Mover](overview.md).

## General

### Is Resource Mover generally available?

Resource Mover is currently in public preview. Production workloads are supported.

## Region move

### What resources can I move across regions using Resource Mover?

Using Resource Mover, you can currently move the following resources across regions:

- Azure VMs and associated disks
- NICs
- Availability sets 
- Azure virtual networks 
- Public IP addresses
Network security groups (NSGs)
- Internal and public load balancers 
- Azure SQL databases and elastic pools

### Where is the metadata about a region move stored?

It's stored in an [Azure Cosmos](../cosmos-db/database-encryption-at-rest.md) database, and in [Azure blob storage](../storage/common/storage-service-encryption.md), in a Microsoft subscription.

### Is the collected metadata encrypted?

Yes, both in transit and at rest.
- During transit, the metadata is securely sent to the Resource Mover service over the internet using HTTPS.
- In storage, metadata is encrypted.

### How is managed identity used in Resource Mover?

[Managed identity](../active-directory/managed-identities-azure-resources/overview.md) (formerly known as Managed Service Identity (MIS)) provides Azure services with an automatically managed identity in Azure AD.
- Resource Mover uses managed identity so that it can access Azure subscriptions to move resources across regions.
- A move collection needs a system-assigned identity, with access to the subscription that contains resources you're moving.

- If you move resources across regions in the portal, this process happens automatically.
- If you move resources using PowerShell, you run cmdlets to assign a system-assigned identity to the collection, and then assign a role with the correct subscription permissions to the identity principal. 

### What managed identity permissions does Resource Mover need?

Azure Resource Mover managed identity needs at least these permissions: 

- Permission to write/ create resources in user subscription, available with the *Contributor* role. 
- Permission to create role assignments. Typically available with the *Owner* or *User Access Administrator* roles, or with a custom role that has the *Microsoft.Authorization/role assignments/write permission* assigned. This permission isn't needed if the data share resource's managed identity is already granted access to the Azure data store. 
 
When you add resources in the Resource Mover hub in the portal, permissions are handled automatically as long as the user has the permissions described above. If you add resources with PowerShell, you assign permissions manually.

> [!IMPORTANT]
> We strongly recommend that you don't modify or remove identity role assignments. 

### What should I do if I don't have permissions to assign role identity?

**Possible cause** | **Recommendation**
--- | ---
You're not a *Contributor* and *User Access Administrator* (or *Owner*) when you add a resource for first time. | Use an account with *Contributor* and *User Access Administrator* (or *Owner*) permissions for the subscription.
Resource Mover managed identity doesn't have the required role. | Add the 'Contributor' and 'User Access administrator' roles.
Resource Mover managed identity was reset to *None*. | Reenable a system-assigned identity in the move collection > **Identity**. Alternatively, add the resource again in **Add resources**, which does the same thing.  
Subscription was moved to a different tenant. | Disable and then enable managed identity for the move collection.


## Next steps

[Learn more](about-move-process.md) about Resource Mover components, and the move process.
