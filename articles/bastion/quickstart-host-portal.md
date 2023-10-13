---
title: 'Quickstart: Deploy Azure Bastion automatically - Basic SKU'
titleSuffix: Azure Bastion
description: Learn how to deploy Bastion with default settings from the Azure portal.
author: cherylmc
ms.service: bastion
ms.topic: quickstart
ms.date: 10/12/2023
ms.author: cherylmc

---

# Quickstart: Deploy Bastion automatically - Basic SKU

In this quickstart, you'll learn how to deploy Azure Bastion automatically in the Azure portal using default settings and the Basic SKU. After Bastion is deployed, you can connect (SSH/RDP) to virtual machines (VM) in the virtual network via Bastion using the private IP address of the VM. The VMs you connect to don't need a public IP address, client software, agent, or a special configuration.

The default SKU for this type of deployment is the Basic SKU. If you want to deploy using the Developer SKU instead, see [Deploy Bastion automatically - Developer SKU](quickstart-developer-sku.md). If you want to deploy using the Standard SKU, see the [Tutorial - Deploy Bastion using specified settings](tutorial-create-host-portal.md). For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram showing Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

The steps in this article help you do the following:

* Deploy Bastion with default settings from your VM resource using the Azure portal. When you deploy using default settings, the settings are based on the virtual network to which Bastion will be deployed.
* After you deploy Bastion, you'll then connect to your VM via the portal using RDP/SSH connectivity and the VM's private IP address.
* If your VM has a public IP address that you don't need for anything else, you can remove it. 

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]
>

## <a name="prereq"></a>Prerequisites

* Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).
* **A VM in a VNet**.

  When you deploy Bastion using default values, the values are pulled from the virtual network in which your VM resides. This VM doesn't become a part of the Bastion deployment itself, but you do connect to it later in the exercise.

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

You can use the following example values when creating this configuration, or you can substitute your own.

**Basic VNet and VM values:**

|**Name** | **Value** |
| --- | --- |
| Virtual machine| TestVM |
| Resource group | TestRG1 |
| Region | East US |
| Virtual network | VNet1 |
| Address space | 10.1.0.0/16 |
| Subnets | FrontEnd: 10.1.0.0/24 |

**Bastion values:**

When you deploy from VM settings, Bastion is automatically configured with default values from the virtual network.

|**Name** | **Default value** |
|---|---|
|AzureBastionSubnet | This subnet is created within the virtual network as a /26 |
|SKU | Basic |
| Name | Based on  the virtual network name |
| Public IP address name | Based on the virtual network name |

## <a name="createvmset"></a>Deploy Bastion

When you create Azure Bastion in the portal using **Deploy Bastion**, Azure Bastion deploys automatically using default settings and the Basic SKU. You can't modify or specify additional values for a default deployment. After deployment completes, you can go to the bastion host **Configuration** page to select certain additional settings and features. You can also upgrade a SKU later to add more features, but you can't downgrade a SKU once Bastion is deployed. For more information, see [About configuration settings](configuration-settings.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the portal, go to the VM to which you want to connect. The values from the virtual network in which this VM resides will be used to create the Bastion deployment.
1. On the page for your VM, in the **Operations** section on the left menu, select **Bastion**.
1. On the Bastion page, select the arrow next to **Dedicated Deployment Options** to expand the section.

   :::image type="content" source="./media/quickstart-host-portal/deploy-bastion-automatically.png" alt-text="Screenshot showing how to expand Dedicated Deployent Options and Deploy Bastion." lightbox="./media/quickstart-host-portal/deploy-bastion-automatically.png":::
1. In the Create Bastion section, select **Deploy Bastion**.
1. Bastion begins deploying. This can take around 10 minutes to complete.

   > [!NOTE]
   > [!INCLUDE [Bastion failed subnet](../../includes/bastion-failed-subnet.md)]
   >

## <a name="connect"></a>Connect to a VM

When the Bastion deployment is complete, the screen changes to the **Connect** page.

1. Type your authentication credentials. Then, select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/connect-vm.png" alt-text="Screenshot shows the Connect using Azure Bastion dialog." lightbox="./media/quickstart-host-portal/connect-vm.png":::

1. The connection to this virtual machine via Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service. Select **Allow** when asked for permissions to the clipboard. This lets you use the remote clipboard arrows on the left of the screen.

   * When you connect, the desktop of the VM might look different than the example screenshot.
   * Using keyboard shortcut keys while connected to a VM might not result in the same behavior as shortcut keys on a local computer. For example, when connected to a Windows VM from a Windows client, CTRL+ALT+END is the keyboard shortcut for CTRL+ALT+Delete on a local computer. To do this from a Mac while connected to a Windows VM, the keyboard shortcut is Fn+CTRL+ALT+Backspace.

     :::image type="content" source="./media/quickstart-host-portal/connected.png" alt-text="Screenshot shows an RDP connection to a virtual machine." lightbox="./media/quickstart-host-portal/connected.png":::

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

In this quickstart, you deployed Bastion to your virtual network, and then connected to a virtual machine securely via Bastion. Next, you can configure more features and work with VM connections.

> [!div class="nextstepaction"]
> [VM connections](vm-about.md)

> [!div class="nextstepaction"]
> [Azure Bastion configuration settings and features](configuration-settings.md)
