---
title: Move Azure Virtual Machines from regional to zonal availability zones
description: This article describes how to move single instance Azure virtual machines from a regional configuration to a target Availability Zone within the same Azure region.
author: ankitaduttaMSFT
ms.service: reliability
ms.subservice: availability-zones
ms.topic: article
ms.date: 08/10/2023
ms.author: ankitadutta
---

Move Azure VMs from regional to zonal target availability zones
This article provides information on how to move Azure Single Instance Virtual Machines (VMs) from a regional to a zonal configuration within the same Azure region.
Prerequisites
Before you begin, verify the following:
Requirement	Description
Availability zone regions support	Ensure that the regions you want to move to are supported by Availability Zones. Learn more on the details of the regions.

VM SKU availability	The availability of VM sizes, or SKUs, can differ based on the region and zone. To plan for the use of Availability Zones, you can view the available VM SKUs for each Azure region and zone. Review the details here. 

Subscription permissions	Check that you have Owner access on the subscription containing the VMs that you want to move.

Why do I need Owner access ?
The first time you add a VM to be moved to Zonal configuration, a system-assigned managed identity (formerly known as Managed Service Identify (MSI)) that's trusted by the subscription is necessary. To create the identity, and to assign it the required role (Contributor or User Access administrator in the source subscription), the account you use to add resources needs Owner permissions on the subscription. Learn more about Azure roles.

VM support	- Check that the VMs you want to move are supported. Learn more.
- Check supported VM settings. 
Subscription quota	The subscription must have enough quota to create the new VM and associated networking resources in target zonal configuration (in same region). If the subscription does not have enough quota, you will need to request additional limits. 

Select and move VMs
To select the VMs you want to move from Regional to Zonal configuration within same region, follow these steps:
1. Select the VMs
To select the VMs for the move, follow these steps: 
1.	On the Azure portal, select the chosen VM. In this tutorial, we are using DemoTestVM1 as an example. 
Alternatively, you can select the VM list view or select a resource groups and search for the VM.
 
2.	In the DemoTestVM1 resource blade , select Availability + scaling > edit.
 
2. Select the target availability zones
To select the target availability zones, follow these steps:
1.	Under Target availability zone option, select the desired target availability zones for the VM. For example, Zone 1.
 
IMPORTANT:
If you select an unsupported VM to move, the validation will fail. In this case, you will need tomust restart the workflow with the correct selection of VM. Refer to the Support Matrix to learn more about unsupported VMs type.
2.	Select the consent statement for  System Assigned Managed Identity process at the bottom  of the page, then select Next.
NOTE :
The MSI authentication process takes a few minutes to complete. During this time, you will see updates on the progress on the screen.  
3. Review the properties of the VM
To review the properties of the VM before you commit the move, follow these steps: 
1.	On the Review properties pane, review the VM properties.
VM properties 
Find additional information on the impact of the move on the VM properties. 
The following source VM properties are retained by default in the target zonal VM:
Property	Description
VM name	Source VM name is retained in the target zonal VM by default.
VNET	Source VNET is retained by default and target zonal VM will be created within the same VNET. If desired, you can create a new VNET or choose an existing from target zonal configuration. 
Subnet	By default, the source subnet is retained and the target zonal virtual machine is created within the same subnet. If desired, you can create a new subnet or choose an existing from target zonal configuration.
NSG	Source NSG is retained by default and target zonal VM will be created within the same NSG. If desired, you can create a new NSG or choose an existing from target zonal configuration.
Load balancer (Standard SKU)	Standard SKU Load balance will support target zonal configuration and will be retained.
Public IP (Standard SKU)	Standard SKU PIP will support target zonal configuration and will be retained.
The following source VM properties will be created new  by default in the target zonal VM:
Property	Description
VM	A copy of the source VM is created in the target zonal configuration. The source VM is left intact and stopped after the move.

Source VM ARM ID will not be retained.
Resource group	By default, a new resource group will be created as the source resource group will be unable to be utilized. This is because we are using the same source VM name in the target zone, it is not possible to have two identical VMs in the same resource group.
 
However, you can still edit the resource group properties or you can select a target resource group.
NIC	A new NIC (with source NIC name) will be is created and mapped to the newly created zonal VM.
Disks	The disks attached to the source VM will be recreated with a new disk name in the target zonal configuration and will be attached to the newly created zonal VM.
Load balancer (Basic SKU)	Basic SKU Load balance will not support target zonal configuration and hence will not be retained.

A new Standard SKU Load balancer will be created by default.

However, you can still edit the load balancer properties or you can select an existing target load balancer as well. 
Public IP (Basic SKU)	Basic SKU Public IP's will not be retained after the move as they do not support target zonal configurations.

By default, a new Standard SKU Public IP will be created.

However, you can still edit the Public IP properties or you can select an existing target Public IP as well.
2.	Review and fix if there are any errors.
 
3.	Select the consent statement at the bottom of the page to enable the Move option.
 
4. Move the VMs
Select Move to complete the move to Availability zones.
During this process:
•	The source virtual machine is stopped hence, there is a brief downtime.
•	A copy of the source VM is created in the target zonal configuration and the new virtual machine is up and running.
5. Configure settings post move
Review all the source VM settings and re-configure extensions, RBACs, Public IPs, Backup/DR etc. as desired.
6. Delete source VM
The source VM will remain in stopped mode after the move is complete. You can choose to either delete it or use it for another purpose, based on your requirements.
Delete additional resources created for move
After the move, you can manually delete the move collection that was created.
To manually remove the move collection that was made:
1.	Ensure you can view hidden resources as the move collection is hidden by default.
2.	Select the Resource group of the move collection using the search string ZonalMove-MC-RG-SourceRegion.
3.	Finally, dDelete the move collection. For example- ZonalMove-MC-RG-UKSouth.
It is important to keep in mind that: [!NOTE]
•	The move collection is hidden and must be turned on to view it.
