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

This article answers common questions about Azure Virtual Machines - Regional to Zonal Move.

## Regional to zonal move

### Can I move VM(s) in all Azure regions?

Currently, you can move VM(s) across all public regions that are supported by Availability Zones. Learn more about the availability zone service and regional support.

### Where is the metadata stored?

The metadata associated with the move is stored in an Azure Cosmos DB database located in either the East US2 or North Europe regions and in Azure Blob storage in a Microsoft subscription.

Although the coverage will eventually extend to other regions, this doesn't restrict you from moving VMs to other regions. The service does not retain any customer data, and no customer data goes outside of the source VM region.

### Is the collected metadata encrypted?

Yes, the collected metadata is encrypted both during transit and at rest. While in transit, the metadata is securely sent to the Resource Mover service over the internet using HTTPS. The metadata is also encrypted while in storage.

### What resources are supported for this Zonal Move?

Currently, managed disks are supported for VMs that only have a single instance.

### What source resources can be leveraged in the target zonal configuration, if preferred?

The following resources can be leveraged in the target zonal configuration:
- Networking resources such as VNET, Subnet, and NSG can be re-used.
- Public IP address (Standard SKU)
- Load Balancers (Standard SKU)


### What resources are created new by default in the target zonal configuration?

The following resource are created in the target zonal configuration:

- **Resource group**: By default, a new resource group is automatically created. The source resource group cannot be used, as we are using the same source VM name in the target zone and two identical VMs cannot co-exist in the same resource group. However, you can still modify the properties of the new resource group or choose a different target resource group. 
- **VM**: A copy of the source VM is created in the target zonal configuration. The source VM remains unchanged and is stopped after the transfer.
- **Disks**: The disks attached to the source VM are recreated in the target zonal configuration.
- **NIC**: A new network interface card (NIC) is produced and linked to the newly created VM in the designated zone.

### What permissions do I need to use managed identity?

To use the managed identity service, you must have the following permissions:

- Permission to write or create resources in your subscription (which is available with the *Contributor* role).
- Permission to create role assignments (which is available with the *Owner* or *User Access Administrator* roles, or, custom roles that have the Microsoft.Authorization or role assignments or write permission assigned). 
    This permission is not required if the data share resource's managed identity has already been granted access to the Azure data store. 

When adding resources in the portal, permissions to use managed identity are handled automatically as long as you have the appropriate role assignments.


> [!IMPORTANT]
> We recommend that you don't modify or remove identity role assignments.

### What if I don't have permissions to assign role identity?

There are a couple of reasons you might not have the permissions. Consider the following scenarios:

| Scenario | Resolution |
| --- | --- |
| You don't have Contributor and User Access Administrator (or Owner) permissions when you add a resource for the first time.	| Use an account with Contributor and User Access Administrator (or Owner) permissions for the subscription.|
| The Resource Mover managed identity doesn't have the necessary role. | Add the Contributor and User Access Administrator roles. |


### How is managed identity used?

Managed identity previously known as Managed Service Identity (MSI), is a feature that provides Azure services with an automatically managed identity in Azure AD. This identity is used to access Azure subscriptions and perform various tasks, such as moving resources to Availability Zones.

- Managed identity is used so that you can access Azure subscriptions to move resources to availability zones.
- To move resources using a move collection, you need a system-assigned identity that has access to the subscription containing the resources you want to move. 
-  If you're using the Azure portal to move the VMs, this process is automated once the user consent is provided. The process typically takes a few minutes to complete.

### Can I move my resources from Regional to Zonal and across subscriptions?

You can use Azure Resource Manager to move VMs from a regional to a zonal deployment within the same subscription, and then move them across subscriptions.

### Are Azure Backup/DR, RBAC, Tags, Policies, and extensions on VMs supported?

Only tags and user assigned managed identities are replicated to the target zones. RBAC, policies and extensions must be re-configured after the move. See the support matrix for further details.

### Is customer data stored during the move?

Customer data is not stored during the move. The system only stores metadata information that helps track and monitor the progress of the resources being moved.

### What happens to the source VM(s)?

When you select **Move**, the following steps are performed on the source VMs:

1.	The source VMs are stopped and left intact in their original configuration.
2.	VM restore points of the source VM are taken. These restore points contain a disk restore point for each of the attached disks and a disk restore point consists of a snapshot of an individual managed disk.
3.	Using these restore points, a new VM with its associated disks (a copy of the source) is created in the zonal configuration.
4.	After the move is complete, you can choose to delete the source VMs.


### Is there any cost associated as part of this move?

The Zonal Move feature of VMs is offered free of cost, but you may incur cost of goods for the creation of disk snapshots or restore points.

> [!NOTE]
> The snapshot of VM or disks is automatically deleted after the move is complete.

### Can I retain my Public IP of the source VM?

Review the following scenarios where you can or cannot retain Public IP addresses associated with the source VM.

| Source Property| Description |
| --- | --- |    
| Public IP addresses (Basic SKU) attached to source VM NIC | The source public IP address isn't retained. <br> <br> The source public IP SKU doesn’t support target zonal configuration. <br> By default, a copy of the source VM and a new network interface card (NIC) is created. The source VM and NIC are left intact after the move and the source VM will be in a shutdown state.|
| Public IP addresses (Standard SKU) attached to source VM NIC | The source Public IP address isn't retained. <br><br> A new NIC and a copy of the source virtual machine (VM) is created, and both the source VM and NIC will remain intact after the move. However, the VM will be in a shutdown state. <br><br> **Note**: After the move, if you wish, you can separate the source public IP from the source NIC and connect it to a new target zonal VM NIC.  |
| Public IP address (Basic SKU) attached to Load Balancer (Basic SKU) |	The source public IP address isn't retained. <br><br> Source Public IP SKU doesn’t support target zonal configuration.|
| Public IP address (Standard SKU) with Non-Zonal configuration attached to Load Balancer (Standard SKU) |	Source Public IP address is retained. |
| Public IP address (Standard SKU) with Zone pined configuration attached to Load Balancer (Standard SKU)| Source Public IP address will be retained. <br><br> **Note:** The target VM zone# might not be the same as the zone pinned Public IP.|
| Public IP address (Standard SKU) with Zone redundant configuration attached to Load Balancer (Standard SKU)| Source Public IP address is retained.|

## Next Step
