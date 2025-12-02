---
title: 'Quickstart: Connect to a VM using Azure Bastion Developer: Azure portal'
description: Learn how to connect to VMs using Bastion Developer.
author: abell
ms.service: azure-bastion
ms.topic: quickstart
ms.date: 12/02/2025
ms.author: abell
ms.custom: references_regions
# Customer intent: As a cloud administrator, I want to connect to virtual machines securely using a browser-based solution, so that I can manage resources without exposing public IP addresses or installing additional software.
---

# Quickstart: Connect to a VM using Azure Bastion Developer: Azure portal

Azure Bastion Developer provides secure, browser-based connectivity to virtual machines without requiring public IP addresses or additional client software. This quickstart shows you how to deploy and use Bastion Developer to connect to a VM in your virtual network at no extra cost.

In this quickstart, you learn how to:

> [!div class="checklist"]
> * Deploy Azure Bastion Developer to your virtual network
> * Connect to a virtual machine using the Azure portal
> * Enable audio output for your VM session
> * Remove the public IP address from your VM
> * Clean up resources when finished

For more information about Azure Bastion, see [What is Azure Bastion](bastion-overview.md).

> [!IMPORTANT]
> Bastion Developer is currently only available in select regions.

[!INCLUDE [Bastion developer](../../includes/bastion-developer-description.md)] Virtual network peering isn't currently supported for Bastion Developer.

The following diagram shows the architecture for Azure Bastion Developer.

:::image type="content" source="./media/quickstart-developer/bastion-shared-pool.png" alt-text="Diagram that shows the Azure Bastion Developer architecture." lightbox="./media/quickstart-developer/bastion-shared-pool.png":::

[!INCLUDE [regions](../../includes/bastion-developer-regions.md)]

## Prerequisites

### Azure subscription

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

### Virtual machine in a virtual network

You need a VM in a virtual network to connect to using Bastion Developer. When you connect with Bastion Developer, the configuration values are pulled from the virtual network in which your VM resides. Make sure the VM is in a resource group that's in a region where Bastion Developer is supported.

* If you don't already have a VM in a virtual network, create one using [Quickstart: Create a Windows VM](/azure/virtual-machines/windows/quick-create-portal) or [Quickstart: Create a Linux VM](/azure/virtual-machines/linux/quick-create-portal).
* If you already have a virtual network, make sure it's selected on the Networking tab when you create your VM.
* If you don't have a virtual network, you can create one at the same time you create your VM.
* If you have a virtual network, make sure you have the rights to write to it.

### Required roles

* Reader role on the virtual machine
* Reader role on the NIC with private IP of the virtual machine

### Required inbound ports

* 3389 for Windows virtual machines
* 22 for Linux virtual machines

[!INCLUDE [DNS private zone](../../includes/bastion-private-dns-zones-non-support.md)]

### Example values

You can use the following example values when creating this configuration, or you can substitute your own values.

**Basic VNet and VM values:**

|**Name** | **Value** |
| --- | --- |
| Virtual machine| TestVM |
| Resource group | TestRG1 |
| Region | West US |
| Virtual network | VNet1 |
| Address space | 10.1.0.0/16 |
| Subnets | FrontEnd: 10.1.0.0/24 |

## Deploy Bastion and connect to a VM

In this section, you deploy Bastion Developer and connect to your VM through the Azure portal. The VM must be in a region that supports Bastion Developer. Your NSG rules must allow traffic to ports 22 and 3389 from the private IP address 168.63.129.16.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the VM you want to connect to. The configuration values from the VM's virtual network are used to deploy Bastion Developer.
1. On the VM page, select **Bastion** from the left menu.
1. On the **Bastion** page, select your **Authentication Type** and enter your credentials.
1. Select **Connect**. When you select **Connect**, Bastion Developer automatically deploys to your virtual network at no cost. This deployment takes a few seconds.
1. The connection opens directly in the Azure portal over HTML5 using port 443. When prompted for clipboard permissions, select **Allow**. This enables the remote clipboard arrows on the left side of the screen.

   * When you connect, the desktop might look different than the example screenshot.
   * Keyboard shortcut keys while connected to a VM might not result in the same behavior as shortcut keys on a local computer. For example, when connected to a Windows VM from a Windows client, CTRL+ALT+END is the keyboard shortcut for CTRL+ALT+Delete on a local computer. To do this from a Mac while connected to a Windows VM, the keyboard shortcut is Fn+CTRL+ALT+Backspace.

1. When you disconnect from the VM, the Bastion Developer resource remains deployed to the virtual network. You can reconnect by going to the VM page in the Azure portal and selecting **Bastion** > **Connect**.

### Enable audio output

[!INCLUDE [Enable VM audio output](../../includes/bastion-vm-audio.md)]

## Remove VM public IP address

[!INCLUDE [Remove a public IP address from a VM](../../includes/bastion-remove-ip.md)]

## Clean up resources

If you're not going to continue to use this application, delete the resource group and all the resources it contains by using the following steps:

1. In the Azure portal, enter the name of your resource group in the **Search** box at the top of the portal. Select the resource group from the search results.

1. Select **Delete resource group**.

1. For **Enter resource group name to confirm deletion**, enter your resource group name, and then select **Delete**.

## Next steps

In this quickstart, you deployed Bastion Developer and used it to connect securely to a virtual machine. Next, configure additional features and explore VM connection options.

> [!div class="nextstepaction"]
> [Upgrade to a dedicated SKU](upgrade-sku.md)

> [!div class="nextstepaction"]
> [Azure Bastion configuration settings and features](configuration-settings.md)
