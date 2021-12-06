---
title: 'VNet peering and Azure Bastion architecture'
description: Learn how VNet peering and Azure Bastion can be used together to connect to VMs.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: conceptual
ms.date: 12/06/2021
ms.author: cherylmc

---

# VNet peering and Azure Bastion

Azure Bastion and VNet peering can be used together. When VNet peering is configured, you don't have to deploy Azure Bastion in each peered VNet. This means if you have an Azure Bastion host configured in one virtual network (VNet), it can be used to connect to VMs deployed in a peered VNet without deploying an additional Bastion host. For more information about VNet peering, see [About virtual network peering](../virtual-network/virtual-network-peering-overview.md).

Azure Bastion works with the following types of peering:

* **Virtual network peering:** Connect virtual networks within the same Azure region.
* **Global virtual network peering:** Connecting virtual networks across Azure regions.

## Architecture

When VNet peering is configured, Azure Bastion can be deployed in hub-and-spoke or full-mesh topologies. Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine.

Once you provision the Azure Bastion service in your virtual network, the RDP/SSH experience is available to all your VMs in the same VNet and peered VNets. This means you can consolidate Bastion deployment to single VNet and still reach VMs deployed in a peered VNet, centralizing the overall deployment.

:::image type="content" source="./media/vnet-peering/design.png" alt-text="Design and Architecture diagram":::

The diagram shows the architecture of an Azure Bastion deployment in a hub-and-spoke model. In the diagram, you can see the following configuration:

* The bastion host is deployed in the centralized hub virtual network.
* Centralized Network Security Group (NSG) is deployed.
* A public IP is not required on the Azure VM.

## Configuration considerations

Review the following considerations when working with this architecture:

* Ensure you have **read** access to both the target VM and the peered VNet.
* Check your permissions in **YourSubscription | IAM** and verify that you have read access to the following resources:
  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.
  * Reader role on the Azure Bastion resource.
  * Reader role on the virtual network (This role is not required if there is no peered virtual network).

### To configure Azure Bastion

Select an article for steps to configure Azure Bastion in a VNet.

* [Configure Bastion using the Azure portal](tutorial-create-host-portal.md)
* [Configure Bastion using PowerShell](bastion-create-host-powershell.md)
* [Configure Bastion using Azure CLI](create-host-cli.md)

### To connect to a VM

Select an article for steps to connect to a VM using Azure Bastion.

> [!NOTE]
> In order to see the **Bastion** option from the **Connect** menu on the VM in the Azure portal, you must be connected to a subscription that has the proper permissions.
>

* [Connect to a Windows VM - RDP](bastion-connect-vm-rdp-windows.md)
* [Connect to a Windows VM - SSH](bastion-connect-vm-ssh-windows.md)
* [Connect to a Linux VM - SSH](bastion-connect-vm-ssh-linux.md)
* [Connect to a Linux VM - RDP](bastion-connect-vm-rdp-linux.md)

## Bastion VNet Peering FAQ

For frequently asked questions, see the Bastion VNet Peering [FAQ](bastion-faq.md#peering).

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
