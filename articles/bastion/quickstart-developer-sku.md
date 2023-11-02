---
title: 'Quickstart: Deploy Bastion using the Developer SKU: Azure portal'
description: Learn how to deploy Bastion using the Developer SKU.
author: cherylmc
ms.service: bastion
ms.topic: quickstart
ms.date: 10/26/2023
ms.author: cherylmc
ms.custom: references_regions
---

# Quickstart: Deploy Azure Bastion - Developer SKU (Preview)

In this quickstart, you'll learn how to deploy Azure Bastion using the Developer SKU. After Bastion is deployed, you can connect to virtual machines (VM) in the virtual network via Bastion using the private IP address of the VM. The VMs you connect to don't need a public IP address, client software, agent, or a special configuration. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

[!INCLUDE [regions](../../includes/bastion-developer-sku-regions.md)]

> [!NOTE]
> VNet peering isn't currently supported for the Developer SKU.

## About the Developer SKU

The Bastion Developer SKU is a new [lower-cost](https://azure.microsoft.com/pricing/details/azure-bastion/), lightweight SKU. This SKU is ideal for Dev/Test users who want to securely connect to their VMs if they don't need additional features or scaling. With the Developer SKU, you can connect to one Azure VM at a time directly through the virtual machine connect page.

When you deploy Bastion using the Developer SKU, the deployment requirements are different than when you deploy using other SKUs. Typically when you create a bastion host, a host is deployed to the AzureBastionSubnet in your virtual network. The Bastion host is dedicated for your use. When using the Developer SKU, a bastion host isn't deployed to your virtual network and you don't need an AzureBastionSubnet. However, the Developer SKU bastion host isn't a dedicated resource and is, instead, part of a shared pool.

Because the Developer SKU bastion resource isn't dedicated, the features for the Developer SKU are limited. See the Bastion configuration settings [SKU](configuration-settings.md) section for features by SKU. For more information about pricing, see the [Pricing](https://azure.microsoft.com/pricing/details/azure-bastion/) page. You can always upgrade the Developer SKU to a higher SKU if you need more features. See [Upgrade a SKU](upgrade-sku.md).

## <a name="prereq"></a>Prerequisites

* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

* **A VM in a VNet**.

  When you deploy Bastion using default values, the values are pulled from the virtual network in which your VM resides. Within the context of this exercise, we use this VM both as the starting point to deploy Bastion, and also to demonstrate how to connect to a VM via Bastion.

  * If you don't already have a VM in a virtual network, create one using [Quickstart: Create a Windows VM](../virtual-machines/windows/quick-create-portal.md), or [Quickstart: Create a Linux VM](../virtual-machines/linux/quick-create-portal.md).
  * If you need example values, see the [Example values](#values) section.
  * If you already have a virtual network, make sure it's selected on the Networking tab when you create your VM.
  * If you don't have a virtual network, you can create one at the same time you create your VM.

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

### Workflow

* Deploy Bastion automatically using the Developer SKU.
* After you deploy Bastion, you'll then connect to your VM via the portal using RDP/SSH connectivity and the VM's private IP address.
* If your VM has a public IP address that you don't need for anything else, you can remove it.

## <a name="createvmset"></a>Deploy Bastion

When you create Azure Bastion using default settings, the settings are configured for you. You can't modify or specify values for a default deployment.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the portal, go to the VM to which you want to connect. The values from the virtual network in which this VM resides will be used to create the Bastion deployment.
1. On the page for your VM, in the **Operations** section on the left menu, select **Bastion**. You can also get to this page via your **Virtual Network/Bastion** in the portal.
1. On the **Bastion** page, select **Deploy Bastion Developer**.

   :::image type="content" source="./media/deploy-host-developer-sku/deploy-bastion-developer.png" alt-text="Screenshot of the Bastion page showing Deploy Bastion." lightbox="./media/deploy-host-developer-sku/deploy-bastion-developer.png":::

1. Bastion begins deploying. This can take around 10 minutes to complete.

## <a name="connect"></a>Connect to a VM

> [!NOTE]
> Before connecting to a VM, verify that your NSG rules allow traffic to ports 22 and 3389 from the private IP address 168.63.129.16.

When the Bastion deployment is complete, the screen changes to the **Connect** page.

1. Type your authentication credentials. Then, select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/connect-vm.png" alt-text="Screenshot shows the Connect using Azure Bastion dialog." lightbox="./media/quickstart-host-portal/connect-vm.png":::

1. The connection to this virtual machine via Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service. Select **Allow** when asked for permissions to the clipboard. This lets you use the remote clipboard arrows on the left of the screen.

   * When you connect, the desktop of the VM might look different than the example screenshot.
   * Using keyboard shortcut keys while connected to a VM might not result in the same behavior as shortcut keys on a local computer. For example, when connected to a Windows VM from a Windows client, CTRL+ALT+END is the keyboard shortcut for CTRL+ALT+Delete on a local computer. To do this from a Mac while connected to a Windows VM, the keyboard shortcut is Fn+CTRL+ALT+Backspace.

     :::image type="content" source="./media/quickstart-host-portal/connected.png" alt-text="Screenshot showing a Bastion RDP connection selected." lightbox="./media/quickstart-host-portal/connected.png":::

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

In this quickstart, you deployed Bastion using the Developer SKU, and then connected to a virtual machine securely via Bastion. Next, you can configure more features and work with VM connections.

> [!div class="nextstepaction"]
> [Upgrade SKUs](upgrade-sku.md)

> [!div class="nextstepaction"]
> [Azure Bastion configuration settings and features](configuration-settings.md)
