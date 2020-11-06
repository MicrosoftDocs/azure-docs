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

* **Virtual network peering:** Connect virtual networks within the same Azure region.
* **Global virtual network peering:** Connecting virtual networks across Azure regions.

## Architecture

When VNet peering support is configured, Azure Bastion can be deployed in hub-and-spoke or full-mesh topologies. Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine. 

Once you provision the Azure Bastion service in your virtual network, the RDP/SSH experience is available to all your VMs in the same VNet, as well as peered VNets. Because VNet peering is supported, you can consolidate Bastion deployment to single VNet with reachability to VMs deployed in a peered VNet. This centralizes the overall deployment.

:::image type="content" source="./media/vnet-peering/old/design.png" alt-text="Design and Architecture diagram":::

:::image type="content" source="./media/vnet-peering/design.png" alt-text="Design and Architecture diagram":::

This figure shows the architecture of an Azure Bastion deployment in a hub-and-spoke model. In this diagram you can see the following configuration:

* The Bastion host is deployed in the centralized Hub virtual network.
* Centralized Network Security Group (NSG) is deployed.
* A public IP is not required on the Azure VM.

Steps:

1. The user connects to the Azure portal using any HTML5 browser.
1. The user selects the virtual machine to connect to.
1. Azure Bastion is seamlessly detected across the peered VNet.
1. With a single click, the RDP/SSH session opens in the browser.

## FAQ

### Can I still deploy multiple Bastion hosts across peered virtual networks?

Yes. By default, a user sees the Bastion host that is deployed in the same virtual network in which VM resides. However, in the **Connect** menu, a user can see multiple Bastion hosts detected across peered networks. They can select the Bastion host that they prefer to use to connect to the VM deployed in the virtual network.

### If my peered VNets are deployed in different subscriptions, will connectivity via Bastion work?

Yes, connectivity via Bastion will continue to work for peered VNets across different subscription for a single Tenant. Subscriptions across two different Tenants is not supported. To see Bastion in the **Connect** drop down menu, the user must select the subs they have access to in **Subscription > global subscription**.

:::image type="content" source="./media/vnet-peering/global-subscriptions.png" alt-text="Design and Architecture diagram":::

### I have access to the peered VNet, but I can't see the VM deployed there.

Make sure the user has **read** access to both the VM, and the peered VNet. Additionally, check under IAM that the user has **read** access to following resources:

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Reader Role on the Virtual Network ( This is not needed if there is no peered virtual network ).

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