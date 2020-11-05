---
title: 'VNet peering and Azure Bastion architecture'
description: In this article, learn how VNet peering and Azure Bastion can be used to gether to connect to VMs.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 11/05/2020
ms.author: cherylmc

---

# VNet peering and Azure Bastion

Azure Bastion supports VNet peering. With VNet peering support, if you have an Azure Bastion host configured in one VNet, it can be leveraged to connect to VMs deployed in a peered virtual network (VNet). This removes the requirement of deploying Azure Bastion with in each VNet.

Azure Bastion supports the following types of peering:

• **Virtual network peering:** Connect virtual networks within the same Azure region.

• **Global virtual network peering:** Connecting virtual networks across Azure regions.

## Architecture

With VNet peering support Azure bastion can be deployed in Hub and Spoke topology or full messed topologies.  Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine. Once you provision an Azure Bastion service in your virtual network, the RDP/SSH experience is available to all your VMs in the same and peered virtual network. With VNet peering support now you can consolidate bastion deployment to single VNet with reachability to VM deployed in a peered VNet, centralizing the overall deployment.

:::image type="content" source="./media/vnet-peering/design.png" alt-text="Design and Architecture diagram":::

This figure shows the architecture of an Azure Bastion deployment in hub and spoke model.  In this diagram:

• The Bastion host is deployed in the centralized Hub virtual network.

• Centralized Network Security Group (NSG) deployment.

• The user connects to the Azure portal using any HTML5 browser.

• The user selects the virtual machine to connect to.

• Azure bastion is seamlessly detected across peered VNet.

• With a single click, the RDP/SSH session opens in the browser.

• No public IP is required on the Azure VM.

## FAQ

### Can I still deploy multiple bastions across peered virtual networks?

Yes you can.  User will see multiple bastions detected across peered network in the connect menu. User can select the bastion they prefer to connect to the Virtual machine deployed in a virtual network.  User will see Bastion deployed in virtual network same as where virtual machine resides as default option.

### Will connectivity via bastion work when my peered VNet’s are deployed in two different subscription.

Yes, connectivity via bastion will continue to work for peered VNet across different subscription for a Tenant. Subscription across two different Tenant is not supported. User must make sure that under subscription > global subscription they have selected the subs they have access too for user to see bastion in connect drop down menu.

:::image type="content" source="./media/vnet-peering/global-subscriptions.png" alt-text="Design and Architecture diagram":::

### I have access to peered VNet but I am not able to see VM deployed in a VNet?

Make sure user has Read access to VM and peered VNet. Check under IAM that user has read access to following resources:

• Reader role on the virtual machine.

• Reader role on the NIC with private IP of the virtual machine.

• Reader role on the Azure Bastion resource.

• Reader Role on the Virtual Network ( This is not needed if there is no peered virtual network ).

|Permissions|Description|Permission type|
|---|---| ---|
|Microsoft.Network/bastionHosts/read |Gets a Bastion Host|Action|
|Microsoft.Network/virtualNetworks/BastionHosts/action |Gets Bastion Host references in a Virtual Network.|Action|
|Microsoft.Network/virtualNetworks/bastionHosts/default/action|Gets Bastion Host references in a Virtual Network.|Action|
|Microsoft.Network/networkInterfaces/read|Gets a network interface definition.|Action|
|Microsoft.Network/networkInterfaces/ipconfigurations/read|Gets a network interface IP configuration definition.|Action|
|Microsoft.Network/virtualNetworks/read|Get the virtual network definition|Action|
|Microsoft.Network/virtualNetworks/subnets/virtualMachines/read|Gets references to all the virtual machines in a virtual network subnet|Action|
|Microsoft.Network/virtualNetworks/virtualMachines/read|Gets references to all the virtual machines in a virtual network|Action|

## Next steps

Read the [Bastion FAQ](bastion-faq.md).