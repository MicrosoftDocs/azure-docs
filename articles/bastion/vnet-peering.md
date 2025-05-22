---
title: VNet peering and Azure Bastion architecture
description: Learn how virtual network peering and Azure Bastion can be used together to connect to VMs.
author: cherylmc
ms.service: azure-bastion
ms.topic: concept-article
ms.date: 12/09/2024
ms.author: cherylmc

---

# Virtual network peering and Azure Bastion

Azure Bastion and Virtual Network peering can be used together. When Virtual Network peering is configured, you don't have to deploy Azure Bastion in each peered VNet (virtual network). This means if you have an Azure Bastion host configured in one virtual network, it can be used to connect to virtual machines (VMs) deployed in a peered virtual network without deploying an additional bastion host. For more information about virtual network peering, see [About virtual network peering](../virtual-network/virtual-network-peering-overview.md).

Azure Bastion works with the following types of peering:

* **Virtual network peering:** Connect virtual networks within the same Azure region.
* **Global virtual network peering:** Connecting virtual networks across Azure regions.

> [!NOTE]
> Deploying Azure Bastion **within** a Virtual WAN hub is not supported. You can deploy Azure Bastion in a spoke VNet and use the [IP-based connection](connect-ip-address.md) feature to connect to virtual machines deployed across a different VNet via the Virtual WAN hub.

## Architecture

When virtual network peering is configured, Azure Bastion can be deployed in hub-and-spoke or full-mesh topologies. Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine.

Once you provision the Azure Bastion service in your virtual network, the RDP/SSH experience is available to all your virtual machines in the same virtual network and peered virtual networks. This means you can consolidate Bastion deployment to a single virtual network and still reach virtual machines deployed in a peered virtual network, centralizing the overall deployment.

:::image type="content" source="./media/vnet-peering/design.png" alt-text="Design and Architecture diagram":::

The diagram shows the architecture of an Azure Bastion deployment in a hub-and-spoke model. In the diagram, you can see the following configuration:

* The bastion host is deployed in the centralized hub virtual network.
* Centralized Network Security Group (NSG) is deployed.
* A public IP isn't required on the Azure VM.

## <a name="deploy"></a>Deployment overview

1. Verify that you have configured [virtual networks](../virtual-network/quick-create-portal.md), and [virtual machines](/azure/virtual-machines/windows/quick-create-portal) within the virtual networks.
1. [Configure virtual network peering](../virtual-network/virtual-network-peering-overview.md).
1. [Configure Bastion](tutorial-create-host-portal.md) in one of the VNets.
1. [Verify permissions](#permissions).
1. [Connect to a virtual machine](bastion-connect-vm-rdp-windows.md) via Azure Bastion. In order to connect via Azure Bastion, you must have the correct permissions for the subscription you're signed into.

### <a name="permissions"></a>To verify permissions

Verify the following permissions when working with this architecture:

* Ensure you have **read** access to both the target VM and the peered virtual network.
* Check your permissions in **YourSubscription | IAM** and verify that you have read access to the following resources:
  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.
  * Reader role on the Azure Bastion resource.
  * Reader role on the virtual networks of the target virtual machines.

## <a name="FAQ"></a>Bastion VNet peering FAQ

For frequently asked questions, see the Bastion virtual network peering [FAQ](bastion-faq.md#peering).

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
