---
title: FAQ - Move Azure Single Instance Virtual Machines from regional to zonal availability zones
description: FAQs for single instance Azure virtual machines from a regional configuration to a target Availability Zone within the same Azure region.
author: ankitaduttaMSFT
ms.service: reliability
ms.subservice: availability-zones
ms.topic: article
ms.date: 09/06/2023
ms.author: ankitadutta
---

# Frequently asked questions - Move Azure single instance VMs from regional to zonal target availability zones

This article answers common questions about about Azure virtual machines - Regional to Zonal Move.

## Regional to zonal move

### Can I move VM(s) in all Azure regions?

Currently, you can move VM(s) in all Availability zones supported public regions. Learn more about the availability zone service and regional support for additional region details.

### Where is the metadata stored?

The metadata related to the move will be stored in either the East US2 or North Europe regions in an Azure Cosmos DB database, and in Azure Blob storage, in a Microsoft subscription.

The coverage will be expanded to other regions in the future. This doesn't restrict you from moving VMs in other regions. No customer data is stored by the service and no customer data goes outside of source VM region.

### Is the collected metadata encrypted?

Yes, the collected metadata is encrypted both during transit and at rest. During transit, the metadata is securely sent to the Resource Mover service over the internet using HTTPS.

In storage, the metadata is also encrypted.

### What resources are supported for this Zonal Move?

Single Instance VMs with managed disks are currently supported.

### What source resources can be leveraged in the target zonal configuration, if preferred?

The following resources can be leveraged:
- Networking resources such as VNET, Subnet, NSG can be re-used.
- Public IP address (Standard SKU)
- Load Balancers (Standard SKU)


### What resources are created new by default in the target zonal configuration?

The following resource are created in the target zonal configuration:
- **Resource group**: By default, a new resource group will be created. The source resource group cannot be leveraged, as we will be using the same source VM name in the target zone and two identical VMs cannot co-exist in the same resource group. However, you can still edit the resource group properties, or you can select a target resource group.
- **VM**: A copy of the source VM is created in the target zonal configuration. The source VM is left intact and stopped after the move.
- **Disks**: The disks attached to the source VM, will be recreated in the target zonal configuration.
- **NIC**: A new NIC will be created and mapped to the newly created VM in the specific zone.

### What managed identity permissions/access requirements do I need?

To use the managed identity service, you need to have the following permissions:
- Permission to write or create resources in user subscription, available with the Contributor role.
- Permission to create role assignments, available with the Owner or User Access Administrator roles, or custom roles that has the Microsoft.Authorization or role assignments or write permission assigned. This permission isn't needed if the data share resource's managed identity is already granted access to the Azure data store.

When you add resources in the portal, permissions are handled automatically as long as the user has the prior described permissions.

> [!IMPORTANT]
> We recommend that you don't modify or remove identity role assignments.


### What if I don't have permissions to assign role identity?

There are a couple of reasons you might not have permission. Review the following cases:

| Possible cause	| Recommendation |
| --- | --- |
| You're not a Contributor and User Access Administrator (or Owner) when you add a resource for the first time.	| Use an account with Contributor and User Access Administrator (or Owner) permissions for the subscription.|
| The Resource Mover managed identity doesn't have the required role. | Add the Contributor and User Access administrator roles.|


### How is managed identity used?

Managed identity (formerly known as Managed Service Identity (MSI)) provides Azure services with an automatically managed identity in Azure AD.

- Managed identity is used so that we can access Azure subscriptions to move resources to availability zones.
- A move collection needs a system-assigned identity, with access to the subscription that contains resources you're moving.
- If you move VMs using the Azure portal, this process happens automatically once user consent is provided and it takes a few minutes to complete.

### Can I move my resources from Regional to Zonal and across subscriptions?

Move within the same subscription is supported. You can move the VMs from Regional to Zonal within the same subscription and then move across subscriptions using Azure Resource Manager.

### Are Azure Backup/DR, RBAC, Tags, Policies, and extensions on VMs supported?

Only Tags and User Assigned Managed Identities are replicated to the target zones. RBAC, Policies and extensions need to be re-configured post move. See the support matrix for further details.

### Is customer data stored during the move?

No customer data is stored. Only metadata information is stored that facilitates tracking and progress of resources you move.

### What happens to the source VM(s)?

When you select Move, the following steps are performed on the source VMs:

1.	Source VMs are stopped and left intact in their original configuration.
2.	VM restore points of the source VM are taken. These restore points contain a disk restore point for each of the attached disks and a disk restore point consists of a snapshot of an individual managed disk.
3.	From this restore point, a new VM along with disks (copy of the source) is created in the zonal configuration.

> [!NOTE]
> After the move is completed, you can choose to delete the source VMs.


### Is there any cost associated as part of this move?

The Zonal Move feature of VMs is offered at free of cost. But you might incur cost of goods as part of this move for creation of disk snapshots/restore point.
> [!NOTE]
> The snapshot of VM/disks will automatically get deleted (after the move is complete).


### Can I retain my Public IP of the source VM?

Review the following scenarios where you can or cannot retain Public IP addresses associated to the source VM.

| Source Property| Description |
| --- | --- |    
| Public IP addresses (Basic SKU) attached to source VM NIC |	Source Public IP address will not be retained. <br> Source Public IP SKU doesn’t support target zonal configuration. <br> A copy of the source VM and a new network interface card (NIC) will be created by default. Source VM and NIC will be left intact post move and source VM will be in shutdown state.|
|Public IP addresses (Standard SKU) attached to source VM NIC |	Source Public IP address will not be retained. <br> A copy of the source VM and a new NIC will be created by default. Source VM and NIC will be left intact post move and VM will be in shutdown state. <br> **Note**: If desired, post move you can dissociate the source Public IP from source NIC and associate it with new target zonal VM NIC. |
| Public IP address (Basic SKU) attached to Load Balancer (Basic SKU) |	Source Public IP address will not be retained. <br> Source Public IP SKU doesn’t support target zonal configuration.|
| Public IP address (Standard SKU) with Non-Zonal configuration attached to Load Balancer (Standard SKU) |	Source Public IP address will be retained. |
| Public IP address (Standard SKU) with Zone pined configuration attached to Load Balancer (Standard SKU)| Source Public IP address will be retained. <br> **Note:** The target VM zone# might not be the same as the zone pinned Public IP.|
| Public IP address (Standard SKU) with Zone redundant configuration attached to Load Balancer (Standard SKU)| Source Public IP address will be retained.|

