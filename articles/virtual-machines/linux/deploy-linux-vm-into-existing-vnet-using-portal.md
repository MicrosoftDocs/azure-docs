---
title: Deploy Linux VMs into existing network with Azure portal | Microsoft Docs
description: Deploy a Linux VM into an existing Azure Virtual Network using the portal.
services: virtual-machines-linux
documentationcenter: virtual-machines-linux
author: iainfoulds
manager: timlt
editor: ''

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/11/2017
ms.author: iainfou

---

# How to deploy a Linux virtual machine into an existing Azure Virtual Network with the Azure portal

This article shows you how to deploy a virtual machine (VM) into an existing virtual network (VNet). Azure assets like VNets and network security groups should be static and long lived resources that are rarely deployed. Once a VNet has been deployed, it can be reused by constant redeployments without any adverse affects to the infrastructure. Thinking about a VNet as being a traditional hardware network switch - you would not need to configure a brand new hardware switch with each deployment.  

With a correctly configured VNet, you can continue to deploy new servers into that VNet over and over with few, if any, changes required over the life of the VNet.

## Create the resource group

First, create a resource group to organize everything you create in this walkthrough. For more information about Azure resource groups, see [Azure Resource Manager overview](../../azure-resource-manager/resource-group-overview.md)

![createResourceGroup](./media/deploy-linux-vm-into-existing-vnet-using-portal/createResourceGroup.png)


## Create the VNet

Next, build a VNet to launch the VMs into. The VNet contains one subnet and is associated with the network security group with this subnet in a later step.

![createVNet](./media/deploy-linux-vm-into-existing-vnet-using-portal/createVNet.png)

## Add a VNic to the subnet

Virtual network cards (VNics) are important as you can connect them to different VMs. This approach keeps the VNic as a static resource while the VMs can be temporary. Create a VNic and associate it with the subnet created in the previous step.

![createVNic](./media/deploy-linux-vm-into-existing-vnet-using-portal/createVNic.png)

## Create the network security group

Azure network security groups are equivalent to a firewall at the network layer. For more information on Azure network security groups, see [What is a Network Security Group](../../virtual-network/virtual-networks-nsg.md).

![createNSG](./media/deploy-linux-vm-into-existing-vnet-using-portal/createNSG.png)

## Add an inbound SSH allow rule

The VM needs access from the internet, so a rule allowing inbound port 22 traffic to be passed through the network to port 22 on the VM is created.

![createInboundSSH](./media/deploy-linux-vm-into-existing-vnet-using-portal/createInboundSSH.png)

## Associate the NSG with the subnet

With the VNet and the subnet created, associate the network security group with the subnet. Network security groups can be associated with either an entire subnet or an individual VNic. With the firewall filtering traffic at the subnet level, all VNics and the VMs within the subnet are protected by the network security group. The other approach is the network security group being associated with just a single VNic and protecting just one VM.

![associateNSG](./media/deploy-linux-vm-into-existing-vnet-using-portal/associateNSG.png)


## Deploy the VM into the VNet and NSG

Using the Azure portal, the Linux VM is deployed to the existing Azure Resource Group, VNet, Subnet, and VNic.

![createVM](./media/deploy-linux-vm-into-existing-vnet-using-portal/createVM.png)

By using the portal to choose existing resources, you instruct Azure to deploy the VM inside the existing network. Once a VNet and subnet have been deployed, they can be left as static or permanent resources inside your Azure region.  

## Next steps

* [Use an Azure Resource Manager template to create a specific deployment](../windows/cli-deploy-templates.md)
* [Create your own custom environment for a Linux VM using Azure CLI commands directly](create-cli-complete.md)
* [Create a Linux VM on Azure using templates](create-ssh-secured-vm-from-template.md)
