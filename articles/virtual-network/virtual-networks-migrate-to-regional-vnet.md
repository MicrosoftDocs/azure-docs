<properties 
   pageTitle="How to migrate from Affinity Groups to a Regional Virtual Network (VNet)"
   description="Learn how to migrate from affinity groups to regional vnets"
   services="virtual-network"
   documentationCenter="na"
   authors="jimdial"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/15/2016"
   ms.author="jdial" />

# How to migrate from Affinity Groups to a Regional Virtual Network (VNet)

You can use an affinity group to ensure that resources created within the same affinity group are physically hosted by servers that are close together, enabling these resources to communicate quicker. In the past, affinity groups were a requirement for creating virtual networks (VNets). At that time, the network manager service that managed VNets could only work within a set of physical servers or scale unit. Architectural improvements have increased the scope of network management to a region.

As a result of these architectural improvements, affinity groups are no longer recommended, or required for virtual networks. The use of affinity groups for VNets is being replaced by regions. VNets that are associated with regions are called regional VNets.

Additionally, we recommend that you don't use affinity groups in general. Aside from the VNet requirement, affinity groups were also important to use to ensure resources, such as compute and storage, were placed near each other. However, with the current Azure network architecture, these placement requirements are no longer necessary. See [Affinity groups and VMs](#Affinity-groups-and-VMs) for the few remaining specific cases where you may want to use an affinity group.

## Creating and migrating to regional VNets

Going forward, when creating new VNets, use *Region*. You'll see this as an option in the Management Portal. Note that in the network configuration file, this shows as *Location*.

>[AZURE.IMPORTANT] Although it is still technically possible to create a virtual network that is associated with an affinity group, there is no compelling reason to do so. Many new features, such as Network Security Groups, are only available when using a regional VNet and are not available for virtual networks that are associated with affinity groups.

### About VNets currently associated with affinity groups

VNets that are currently associated with affinity groups are enabled for migration to regional VNets. To migrate to a regional VNet, follow these steps:

1. Export the network configuration file. You can use PowerShell or the Management Portal. For instructions using the Management Portal, see [Configure your VNet using a Network Configuration File](virtual-networks-using-network-configuration-file.md).

1. Edit your network configuration file, replacing the old values with the new values. 

	> [AZURE.NOTE] The **Location** is the region that you specified for the affinity group that is associated with your VNet. For example, if your VNet is associated with an affinity group that is located in West US, when you migrate, your Location must point to West US. 
	
	Edit the following lines in your network configuration file, replacing the values with your own: 

	**Old value:** \<VirtualNetworkSitename="VNetUSWest" AffinityGroup="VNetDemoAG"\> 

	**New value:** \<VirtualNetworkSitename="VNetUSWest" Location="West US"\>

1. Save your changes and [import](virtual-networks-using-network-configuration-file.md) the network configuration to Azure.

>[AZURE.NOTE] This migration does NOT cause any downtime to your services.

## Affinity groups and VMs

As mentioned previously, affinity groups are no longer generally recommended for VMs. You should use an affinity group only when a set of VMs must have the absolute lowest network latency between the VMs. By placing VMs in an affinity group, the VMs will all be placed in the same compute cluster or scale unit.

It's important to note that using an affinity group can have two, possibly negative, consequences:

- The set of VM sizes will be limited to the set of VM sizes offered by the compute scale unit.

- There is a higher probability of not being able to allocate a new VM. This happens when the specific scale unit for the affinity group is out of capacity.

### What to do if you have a VM in an affinity group

VMs that are currently in an affinity group do not need to be removed from the affinity group.

Once a VM is deployed, it is deployed to a single scale unit. Affinity groups can restrict the set of available VM sizes for a new VM deployment, but any existing VM that is deployed is already restricted to the set of VM sizes available in the scale unit in which the VM is deployed. Because of this, removing a VM from the affinity group will have no effect.
 
