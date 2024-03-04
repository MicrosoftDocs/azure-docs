---
title: Common questions about Azure Resource Mover?
description: Get answers to common questions about  Azure Resource Mover
author: ankitaduttaMSFT
manager: evansma
ms.service: resource-mover
ms.custom: ignite-2022, engagement-fy23, UpdateFrequency.5
ms.topic: conceptual
ms.date: 04/28/2023
ms.author: ankitadutta
---

# Common questions

This article answers common questions about [Azure Resource Mover](overview.md).


## Moving across regions

### Can I move resources across any regions?

Currently, you can move resources from any source public region to any target public region and within regions in China, depending on the [resource types available in that region](https://azure.microsoft.com/global-infrastructure/services/). Moving resources within Azure Gov is also supported (US DoD Central, US DoD East, US Gov Arizona, US Gov Texas, US Gov Virginia).  US Sec East/West/West Central are not currently supported.


### What regions are currently supported?

Azure Resource Mover is currently available as follows:

| Support | Details|
|-------- | -------|
|Move support | Azure resources that are supported for a move with Resource Mover can be moved from any public region to another public region and within regions in China. Moving resources within Azure Gov is also supported (US DoD Central, US DoD East, US Gov Arizona, US Gov Texas, US Gov Virginia).  US Sec East/West/West Central are not currently supported.|
|Metadata support |  Supported regions for storing metadata about machines to be moved include East US2, North Europe, Southeast Asia, Japan East, UK South, and Australia East as metadata regions. <br/><br/> Moving resources within the Microsoft Azure operated by 21Vianet region is also supported with the metadata region China North2.|

### What resources can I move across regions using Resource Mover?

Using Resource Mover, you can currently move the following resources across regions:

- Azure VMs and associated disks (Azure Spot VMs are not currently supported)
- NICs
- Availability sets 
- Azure virtual networks 
- Public IP addresses (Public IP will not be retained across Azure region)
- Network security groups (NSGs)
- Internal and public load balancers 
- Azure SQL databases and elastic pools

### Can I move disks across regions?

You can't select disks as resources to the moved across regions. However, disks are moved as part of a VM move.

### How can I move my resources across subscription?

Currently, Azure Resource Mover only supports move across regions within the same subscription. Move across subscriptions is not supported. 

However, on the Azure Portal, Azure Resource mover has an entry point to enable the move across subscriptions. The capability to move across subscriptions is supported by Azure Resource Manager (ARM). [Learn more](../azure-resource-manager/management/move-resource-group-and-subscription.md).

Moving across regions and across subscriptions is a two-step process:

1. Move resources across regions using Azure Resource Mover.
1. Use Azure Resource Manager (ARM) to move across subscriptions once resources are in the desired target region.

### What does it mean to move a resource group?

When a resource is selected for move, the corresponding resource group is added automatically for moving. This is so that the destination resource can be placed in a resource group. You can choose to customize and provide an existing resource group after it's added for move. Moving a resource group doesn't mean that all the resources in the source resource group will be moved.

### Can I move resources across subscriptions when I move them across regions?

You can change the subscription after moving resources to the destination region. [Learn more](../azure-resource-manager/management/move-resource-group-and-subscription.md) about moving resources to a different subscription. 

### Does Azure Resource Mover store customer data? 
No. Resource Mover service doesn't store customer data, it only stores metadata information that facilitates tracking and progress of resources you move.

### Where is the metadata for moving across regions stored?

It's stored in an [Azure Cosmos DB](../cosmos-db/database-encryption-at-rest.md) database, and in [Azure Blob storage](../storage/common/storage-service-encryption.md), in a Microsoft subscription. Currently, metadata is stored in East US 2 and North Europe. We will expand this coverage to other regions. This doesn't restrict you from moving resources across any public region.

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

### What if I don't have permissions to assign role identity?

There are a couple of reasons you might not have permission.

|Possible cause | Recommendation|
|-------------- | --------------|
|You're not a *Contributor* and *User Access Administrator* (or *Owner*) when you add a resource for the first time. | Use an account with *Contributor* and *User Access Administrator* (or *Owner*) permissions for the subscription.|
|The Resource Mover managed identity doesn't have the required role. | Add the 'Contributor' and 'User Access administrator' roles. |
|The Resource Mover managed identity was reset to *None*. | Reenable a system-assigned identity in the move collection settings > **Identity**. Alternatively, in **Add Resources**, add the resource again, which does the same thing. |
|The subscription was moved to a different tenant. | Disable and then enable managed identity for the move collection.|

### How can I do multiple moves together?

Change the source/target combinations as needed using the change option in the portal.

### What happens when I remove a resource from a list of move resources?

You can remove resources that you've added to the move list. The exact remove behavior depends on the resource state. [Learn more](remove-move-resources.md#vm-resource-state-after-removing).


## Next steps

[Learn more](about-move-process.md) about Resource Mover components, and the move process.
