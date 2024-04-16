---
title: 'VNet peering and Azure Bastion architecture'
description: Learn how VNet peering and Azure Bastion can be used together to connect to VMs.
author: cherylmc
ms.service: bastion
ms.topic: conceptual
ms.date: 06/23/2023
ms.author: cherylmc

---

# VNet peering and Azure Bastion

Azure Bastion and VNet peering can be used together. When VNet peering is configured, you don't have to deploy Azure Bastion in each peered VNet. This means if you have an Azure Bastion host configured in one virtual network (VNet), it can be used to connect to VMs deployed in a peered VNet without deploying an additional bastion host. For more information about VNet peering, see [About virtual network peering](../virtual-network/virtual-network-peering-overview.md).

Azure Bastion works with the following types of peering:

* **Virtual network peering:** Connect virtual networks within the same Azure region.
* **Global virtual network peering:** Connecting virtual networks across Azure regions.

> [!NOTE]
> Deploying Azure Bastion **within** a Virtual WAN hub is not supported. You can deploy Azure Bastion in a spoke VNet and use the [IP-based connection](connect-ip-address.md) feature to connect to virtual machines deployed across a different VNet via the Virtual WAN hub.
>

## Architecture

When VNet peering is configured, Azure Bastion can be deployed in hub-and-spoke or full-mesh topologies. Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine.

Once you provision the Azure Bastion service in your virtual network, the RDP/SSH experience is available to all your VMs in the same VNet and peered VNets. This means you can consolidate Bastion deployment to single VNet and still reach VMs deployed in a peered VNet, centralizing the overall deployment.

:::image type="content" source="./media/vnet-peering/design.png" alt-text="Design and Architecture diagram":::

The diagram shows the architecture of an Azure Bastion deployment in a hub-and-spoke model. In the diagram, you can see the following configuration:

* The bastion host is deployed in the centralized hub virtual network.
* Centralized Network Security Group (NSG) is deployed.
* A public IP is not required on the Azure VM.

## <a name="deploy"></a>Deployment overview

1. Verify that you have configured [VNets](../virtual-network/quick-create-portal.md), and [virtual machines](../virtual-machines/windows/quick-create-portal.md) within the VNets.
1. [Configure VNet peering](../virtual-network/virtual-network-peering-overview.md).
1. [Configure Bastion](tutorial-create-host-portal.md) in one of the VNets.
1. [Verify permissions](#permissions).
1. [Connect to a VM](bastion-connect-vm-rdp-windows.md) via Azure Bastion. In order to connect via Azure Bastion, you must have the correct permissions for the subscription you are signed into.

### <a name="permissions"></a>To verify permissions

Verify the following permissions when working with this architecture:

* Ensure you have **read** access to both the target VM and the peered VNet.
* Check your permissions in **YourSubscription | IAM** and verify that you have read access to the following resources:
  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.
  * Reader role on the Azure Bastion resource.
  * Reader role on the virtual networks of the target virtual machines.

## <a name="FAQ"></a>Bastion VNet peering FAQ

For frequently asked questions, see the Bastion VNet peering [FAQ](bastion-faq.md#peering).

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
