---
title: 'VNet peering and Azure Bastion architecture'
description: Learn how VNet peering and Azure Bastion can be used together to connect to VMs.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 07/13/2021
ms.author: cherylmc

---

# VNet peering and Azure Bastion

Azure Bastion and VNet peering can be used together. When VNet peering is configured, you don't have to deploy Azure Bastion in each peered VNet. This means if you have an Azure Bastion host configured in one virtual network (VNet), it can be used to connect to VMs deployed in a peered VNet without deploying an additional Bastion host. For more information about VNet peering, see [About virtual network peering](../virtual-network/virtual-network-peering-overview.md).

Azure Bastion works with the following types of peering:

* **Virtual network peering:** Connect virtual networks within the same Azure region.
* **Global virtual network peering:** Connecting virtual networks across Azure regions.

## Architecture

When VNet peering is configured, Azure Bastion can be deployed in hub-and-spoke or full-mesh topologies. Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine.

Once you provision the Azure Bastion service in your virtual network, the RDP/SSH experience is available to all your VMs in the same VNet, as well as peered VNets. This means you can consolidate Bastion deployment to single VNet and still reach VMs deployed in a peered VNet, centralizing the overall deployment.

:::image type="content" source="./media/vnet-peering/design.png" alt-text="Design and Architecture diagram":::

This figure shows the architecture of an Azure Bastion deployment in a hub-and-spoke model. In this diagram you can see the following configuration:

* The Bastion host is deployed in the centralized Hub virtual network.
* Centralized Network Security Group (NSG) is deployed.
* A public IP is not required on the Azure VM.

**Steps:**

1. Connect to the Azure portal using any HTML5 browser.
2. Ensure you have **read** access to both the target VM and the peered VNet. Additionally, check under IAM that you have read access to the following resources:
   * Reader role on the virtual machine.
   * Reader role on the NIC with private IP of the virtual machine.
   * Reader role on the Azure Bastion resource.
   * Reader Role on the Virtual Network (Not needed if there is no peered virtual network).
3. To see Bastion in the **Connect** drop down menu, you must select the subs you have access to in **Subscription > global subscription**.
4. Select the virtual machine to connect to.
5. Azure Bastion is seamlessly detected across the peered VNet.
6. With a single click, the RDP/SSH session opens in the browser.

  :::image type="content" source="../../includes/media/bastion-vm-rdp/connect-vm.png" alt-text="Connect":::

   For more information about connecting to a VM via Azure Bastion, see:

   * [Connect to a VM - RDP](bastion-connect-vm-rdp.md).
   * [Connect to a VM - SSH](bastion-connect-vm-ssh.md).

## FAQ

For frequently asked questions, see the Bastion VNet Peering [FAQ](bastion-faq.md#peering).

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
