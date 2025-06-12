---
title: 'Quickstart: Connect to VMs using Azure Bastion Developer: Azure portal'
description: Learn how to connect to VMs using Bastion Developer.
author: abell
ms.service: azure-bastion
ms.topic: quickstart
ms.date: 05/27/2025
ms.author: abell
ms.custom: references_regions
---

# Quickstart: Connect with Azure Bastion Developer

In this quickstart, you learn how to connect to VMs using Azure Bastion Developer. In just a few seconds, you can connect to virtual machines (VM) in the virtual network at no extra cost via Bastion Developer using the private IP address of the VM. The VMs you connect to don't need a public IP address, client software, agent, or a special configuration. For more information about Azure Bastion, see [What is Azure Bastion](bastion-overview.md)?

> [!IMPORTANT]
> Bastion Developer is currently unavailable. We're working to restore service. As a workaround, you can use the [Basic SKU](tutorial-create-host-portal.md) or the [Standard SKU](quickstart-host-portal.md) to connect to your VMs. We'll update this article when Bastion Developer is available again.

[!INCLUDE [Bastion developer](../../includes/bastion-developer-description.md)] Virtual network peering isn't currently supported for Bastion Developer.

The following diagram shows the architecture for Azure Bastion Developer.

:::image type="content" source="./media/quickstart-developer/bastion-shared-pool.png" alt-text="Diagram that shows the Azure Bastion Developer architecture." lightbox="./media/quickstart-developer/bastion-shared-pool.png":::

[!INCLUDE [regions](../../includes/bastion-developer-regions.md)]

## <a name="prereq"></a>Prerequisites

* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

* **A VM in a virtual network**.

  When you connect with Bastion Developer using default values, the values are pulled from the virtual network in which your VM resides. Make sure the VM resides in a resource group that's in a region where Bastion Developer is supported.

  * If you don't already have a VM in a virtual network, create one using [Quickstart: Create a Windows VM](/azure/virtual-machines/windows/quick-create-portal), or [Quickstart: Create a Linux VM](/azure/virtual-machines/linux/quick-create-portal).
  * If you need example values, see the [Example values](#values) section.
  * If you already have a virtual network, make sure it's selected on the Networking tab when you create your VM.
  * If you don't have a virtual network, you can create one at the same time you create your VM.
  * If you have a virtual network, make sure you have the rights to write to it.

* **Required VM roles:**

  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.
  
* **Required VM ports inbound ports:**

  * 3389 for Windows VMs
  * 22 for Linux VMs

[!INCLUDE [DNS private zone](../../includes/bastion-private-dns-zones-non-support.md)]

### <a name="values"></a>Example values

You can use the following example values when creating this configuration as an exercise, or you can substitute your own.

**Basic VNet and VM values:**

|**Name** | **Value** |
| --- | --- |
| Virtual machine| TestVM |
| Resource group | TestRG1 |
| Region | West US |
| Virtual network | VNet1 |
| Address space | 10.1.0.0/16 |
| Subnets | FrontEnd: 10.1.0.0/24 |

## <a name="createvmset"></a>Deploy Bastion and connect to VM

These steps help you automatically connect to your VM via the portal with Bastion Developer. The VM must be located in a region that supports Bastion Developer. Additionally, to connect to a VM, your NSG rules must allow traffic to ports 22 and 3389 from the private IP address 168.63.129.16.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the portal, go to the VM to which you want to connect. The values from the virtual network in which this VM resides are used to connect with Bastion Developer. 
1. On the page for your VM, expand the settings on the left menu if necessary, and select **Bastion**.
1. On the **Bastion** page, you'll see multiple options, including dedicated SKUs and Bastion **Developer**. To automatically deploy using the Bastion Developer offering, select **Authentication Type** and input the required credential values. Then, click **Connect** to connect to your virtual machine in just a few seconds through Bastion Developer. When you click **Connect**, a free Bastion Developer resource automatically deploys to your virtual network. You could also deploy Bastion Developer using the "Configure manually" button, but it's more efficient to use the **Connect** button.
1. The connection to this virtual machine via Bastion Developer will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service. Select **Allow** when asked for permissions to the clipboard. This lets you use the remote clipboard arrows on the left of the screen.

   * When you connect, the desktop of the VM might look different than the example screenshot.
   * Using keyboard shortcut keys while connected to a VM might not result in the same behavior as shortcut keys on a local computer. For example, when connected to a Windows VM from a Windows client, CTRL+ALT+END is the keyboard shortcut for CTRL+ALT+Delete on a local computer. To do this from a Mac while connected to a Windows VM, the keyboard shortcut is Fn+CTRL+ALT+Backspace.

1. When you disconnect from the VM, the Bastion Developer resource remains deployed to the virtual network. You can reconnect to the VM from the virtual machine page in the Azure portal by selecting **Bastion -> Connect**.

### <a name="audio"></a>To enable audio output

[!INCLUDE [Enable VM audio output](../../includes/bastion-vm-audio.md)]

## <a name="remove"></a>Remove VM public IP address

[!INCLUDE [Remove a public IP address from a VM](../../includes/bastion-remove-ip.md)]

## Clean up resources

When you're done using the virtual network and the virtual machines, delete the resource group and all of the resources it contains:

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.

1. Select **Delete resource group**.

1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this quickstart, you used Bastion Developer to connect to a virtual machine securely. Next, you can configure more features and work with VM connections.

> [!div class="nextstepaction"]
> [Upgrade to a dedicated SKU](upgrade-sku.md)

> [!div class="nextstepaction"]
> [Azure Bastion configuration settings and features](configuration-settings.md)
