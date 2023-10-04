---
title: 'Quickstart: Deploy Azure Bastion with default settings'
titleSuffix: Azure Bastion
description: Learn how to deploy Azure Bastion with default settings from the Azure portal.
author: cherylmc
ms.service: bastion
ms.topic: quickstart
ms.date: 10/03/2023
ms.author: cherylmc

---

# Quickstart: Deploy Azure Bastion with default settings

In this quickstart, you learn how to deploy Azure Bastion with default settings to your virtual network by using the Azure portal.

After Azure Bastion is deployed, you can connect (via SSH or RDP) to virtual machines (VMs) in the virtual network via Azure Bastion by using the private IP address of the VMs. The VMs that you connect to don't need a public IP address, client software, agent, or a special configuration. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md).

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram that shows Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]
>

## <a name="prereq"></a>Prerequisites

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).
* A VM in a virtual network.

  When you deploy Azure Bastion by using default values, the values are pulled from the virtual network in which your VM resides. This VM doesn't become a part of the Azure Bastion deployment itself, but you do connect to it later in the exercise.

  If you don't already have a VM in a virtual network, create one by using [Quickstart: Create a Windows VM](../virtual-machines/windows/quick-create-portal.md) or [Quickstart: Create a Linux VM](../virtual-machines/linux/quick-create-portal.md). If you need example values, see the [Example values](#values) section of this quickstart.
  
  If you don't have a virtual network, you can create one at the same time that you create your VM. If you already have a virtual network, make sure it's selected on the **Networking** tab when you create your VM.

* Required VM roles:

  * Reader role on the virtual machine.
  * Reader role on the network adapter with private IP of the virtual machine.
  
* Required VM inbound ports:

  * 3389 for Windows VMs
  * 22 for Linux VMs

[!INCLUDE [DNS private zone](../../includes/bastion-private-dns-zones-non-support.md)]

### <a name="values"></a>Example values

You can use the following example values when creating this configuration, or you can substitute your own.

**Basic virtual network and VM values:**

|Name | Value |
| --- | --- |
| Virtual machine| TestVM |
| Resource group | TestRG1 |
| Region | East US |
| Virtual network | VNet1 |
| Address space | 10.1.0.0/16 |
| Subnets | FrontEnd: 10.1.0.0/24 |

**Azure Bastion values:**

When you deploy from VM settings, Azure Bastion is automatically configured with default values from the virtual network.

|Name | Default value |
|---|---|
|AzureBastionSubnet | This subnet is created within the virtual network as a /26 |
|SKU | Basic |
| Name | Based on  the virtual network name |
| Public IP address name | Based on the virtual network name |

## <a name="createvmset"></a>Deploy Azure Bastion

When you create Azure Bastion by using default settings, the settings are configured for you. You can't modify or specify additional values for a default deployment.

After deployment finishes, you can always go to the Azure Bastion host **Configuration** page to select additional settings and features. For example, the default SKU is the Basic SKU. You can later upgrade to the Standard SKU to support more features. For more information, see [About configuration settings](configuration-settings.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the portal, go to the VM to which you want to connect. The values from the virtual network in which this VM resides will be used to create the Azure Bastion deployment.
1. On the page for your VM, in the **Operations** section on the left menu, select **Bastion**. When the **Bastion** page opens, it checks whether you have enough available address space to create the Azure Bastion subnet. If you don't, you'll see settings to allow you to add more address space to your virtual network to meet this requirement.
1. On the **Bastion** page, you can view some of the values that will be used when you create the Azure Bastion host for your virtual network. Select **Deploy Bastion** to deploy Azure Bastion by using default settings.

   :::image type="content" source="./media/quickstart-host-portal/deploy.png" alt-text="Screenshot of Deploy Azure Bastion." lightbox="./media/quickstart-host-portal/deploy.png":::

   The deployment can take around 10 minutes to finish.

> [!NOTE]
> [!INCLUDE [Bastion failed subnet](../../includes/bastion-failed-subnet.md)]
>

## <a name="connect"></a>Connect to a VM

When the Azure Bastion deployment is complete, the screen changes to the **Connect** page.

1. Enter your authentication credentials. Then, select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/connect-vm.png" alt-text="Screenshot shows the Connect using Azure Bastion dialog." lightbox="./media/quickstart-host-portal/connect-vm.png":::

1. The connection to this virtual machine via Azure Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Azure Bastion service. Select **Allow** when asked for permissions to the clipboard. This lets you use the remote clipboard arrows on the left of the screen.

   * When you connect, the desktop of the VM might look different from the example screenshot.
   * Using keyboard shortcut keys while connected to a VM might not result in the same behavior as shortcut keys on a local computer. For example, when you're connected to a Windows VM from a Windows client, CTRL+ALT+END is the keyboard shortcut for CTRL+ALT+Delete on a local computer. To do this from a Mac while connected to a Windows VM, the keyboard shortcut is Fn+CTRL+ALT+Backspace.

     :::image type="content" source="./media/quickstart-host-portal/connected.png" alt-text="Screenshot of RDP connection." lightbox="./media/quickstart-host-portal/connected.png":::

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

In this quickstart, you deployed Azure Bastion to your virtual network, and then connected to a virtual machine securely via Azure Bastion. Next, you can configure more features and work with VM connections.

> [!div class="nextstepaction"]
> [VM connections](vm-about.md)

> [!div class="nextstepaction"]
> [Azure Bastion configuration settings and features](configuration-settings.md)
