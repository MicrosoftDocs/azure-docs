---
title: Common questions about Azure Resource Mover?
description: Get answers to common questions about  Azure Resource Mover
author: rayne-wiselman
manager: evansma
ms.service: resource-move
ms.topic: conceptual
ms.date: 02/04/2021
ms.author: raynew

---

# Common questions

This article answers common questions about [Azure Resource Mover](overview.md).


## Moving across regions

### Can I move resources across any regions?

Currently, you can move resources from any source public region to any target public region, depending on the [resource types available in that region](https://azure.microsoft.com/global-infrastructure/services/). Moving resources in Azure Government regions isn't currently supported.

### What resources can I move across regions using Resource Mover?

Using Resource Mover, you can currently move the following resources across regions:

- Azure VMs and associated disks
- NICs
- Availability sets 
- Azure virtual networks 
- Public IP addresses
- Network security groups (NSGs)
- Internal and public load balancers 
- Azure SQL databases and elastic pools

### Can I move disks across regions?

You can't select disks as resources to the moved across regions. However, disks are moved as part of a VM move.

### What does it mean to move a Resource Group

When a resource is selected for move, the corresponding Resource Group is automatically added for move. This is needed as the destination resource will need to be placed under a Resource Group like it was in the target. You can choose to customize and provide an exsiting Resource Group, once it is added for move. Note that, moving a Resource Group **doesnt** mean that all the resources in the source Resource Group will be moved.

### Can I move resources across subscriptions when I move them across regions?

You can change the subscription after moving resources to the destination region. [Learn more](../azure-resource-manager/management/move-resource-group-and-subscription.md) about moving resources to a different subscription. 

### Does Azure Resource Move service store customer data? 
No. Resource Move service does not store customer data, it only stores metadata information which facilitates the tracking and progress of the resources selected for move, by the customer.


### Where is the metadata for moving across regions stored?

It's stored in an [Azure Cosmos](../cosmos-db/database-encryption-at-rest.md) database, and in [Azure blob storage](../storage/common/storage-service-encryption.md), in a Microsoft subscription. Currently metadata is stored in East US 2 and North Europe. We will expand this coverage to other regions. This doesn't restrict you from moving resources across any public regions.

### Is the collected metadata encrypted?

Yes, both in transit and at rest.
- During transit, the metadata is securely sent to the Resource Mover service over the internet using HTTPS.
- In storage, metadata is encrypted.

### How is managed identity used in Resource Mover?

[Managed identity](../active-directory/managed-identities-azure-resources/overview.md) (formerly known as Managed Service Identity (MSI)) provides Azure services with an automatically managed identity in Azure AD.
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

### How can I do multiple moves together?

Change the source/target combinations as needed using the change option in the portal.

### What happens when I remove a resource from a list of move resources?

You can remove resources that you've added to move list. Behavior when you remove a resource from the list depends on the resource state. [Learn more](remove-move-resources.md#vm-resource-state-after-removing).



## Next steps

[Learn more](about-move-process.md) about Resource Mover components, and the move process.
