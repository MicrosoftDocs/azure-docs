---
title: 'VNet peering and Azure Bastion architecture'
description: In this article, learn how VNet peering and Azure Bastion can be used together to connect to VMs.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 11/05/2020
ms.author: cherylmc

---

# VNet peering and Azure Bastion (Preview)

Azure Bastion supports VNet peering. When VNet peering is configured, you don't have to deploy Azure Bastion in each peered VNet. This means if you have an Azure Bastion host configured in one virtual network (VNet), it can be used to connect to VMs deployed in a peered VNet without deploying an additional Bastion host. For more information about VNet peering, see [About virtual network peering](../virtual-network/virtual-network-peering-overview.md).

Azure Bastion supports the following types of peering:

* **Virtual network peering:** Connect virtual networks within the same Azure region.
* **Global virtual network peering:** Connecting virtual networks across Azure regions.

## Architecture

When VNet peering support is configured, Azure Bastion can be deployed in hub-and-spoke or full-mesh topologies. Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine.

Once you provision the Azure Bastion service in your virtual network, the RDP/SSH experience is available to all your VMs in the same VNet, as well as peered VNets. Because VNet peering is supported, you can consolidate Bastion deployment to single VNet and still reach VMs deployed in a peered VNet. This centralizes the overall deployment.

:::image type="content" source="./media/vnet-peering/design.png" alt-text="Design and Architecture diagram":::

This figure shows the architecture of an Azure Bastion deployment in a hub-and-spoke model. In this diagram you can see the following configuration:

* The Bastion host is deployed in the centralized Hub virtual network.
* Centralized Network Security Group (NSG) is deployed.
* A public IP is not required on the Azure VM.

### Steps

1. Connect to the Azure portal using any HTML5 browser.
1. Select the virtual machine to connect to.
1. Azure Bastion is seamlessly detected across the peered VNet.
1. With a single click, the RDP/SSH session opens in the browser. For RDP and SSH concurrent session limits, see [RDP and SSH sessions](bastion-faq.md#limits).

   :::image type="content" source="../../includes/media/bastion-vm-rdp/connect-vm.png" alt-text="Connect":::

For more information about connecting to a VM via Azure Bastion, see:

* [Connect to a VM - RDP](bastion-connect-vm-rdp.md).
* [Connect to a VM - SSH](bastion-connect-vm-ssh.md).

## FAQ

[!INCLUDE [FAQ for VNet peering](../../includes/bastion-faq-peering-include.md)]

## Next steps

Read the [Bastion FAQ](bastion-faq.md).