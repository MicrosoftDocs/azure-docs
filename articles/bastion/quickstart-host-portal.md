---
title: 'Quickstart: Configure Bastion from VM settings'
titleSuffix: Azure Bastion
description: Learn how to create an Azure Bastion host from virtual machine settings and connect to the VM securely through your browser via private IP address.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: quickstart
ms.date: 07/13/2021
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to connect to a virtual machine securely via RDP/SSH using a private IP address through my browser.

---

# Quickstart: Configure Azure Bastion from VM settings

This quickstart article shows you how to configure Azure Bastion based on your VM settings in the Azure portal, and then connect to a VM via private IP address. Once the service is provisioned, the RDP/SSH experience is available to all of the virtual machines in the same virtual network. The VM doesn't need a public IP address, client software, agent, or a special configuration. If you don't need the public IP address on your VM for anything else, you can remove it. You then connect to your VM through the portal using the private IP address. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)

## <a name="prereq"></a>Prerequisites

* An Azure account with an active subscription. If you don't have one, [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). To be able to connect to a VM through your browser using Bastion, you must be able to sign in to the Azure portal.

* A Windows virtual machine in a virtual network. If you don't have a VM, create one using [Quickstart: Create a VM](../virtual-machines/windows/quick-create-portal.md).

  * If you need example values, see the provided [Example values](#values).
  * If you already have a virtual network, make sure to select it on the Networking tab when you create your VM.
  * If you don't already have a virtual network, you can create one at the same time you create your VM.
  * You do not need to have a public IP address for this VM in order to connect via Azure Bastion.

* Required VM roles:
  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.
  
* Required VM ports:
  * Inbound ports: RDP (3389)

 >[!NOTE]
 >The use of Azure Bastion with Azure Private DNS Zones is not supported at this time. Before you begin, please make sure that the virtual network where you plan to deploy your Bastion resource is not linked to a private DNS zone.
 >

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

**Azure Bastion values:**

|**Name** | **Value** |
| --- | --- |
| Name | VNet1-bastion |
| + Subnet Name | AzureBastionSubnet |
| AzureBastionSubnet addresses | A subnet within your VNet address space with a subnet mask /27 or larger.<br> For example, 10.1.1.0/26.  |
| Tier/SKU | Standard |
| Public IP address |  Create new |
| Public IP address name | VNet1-ip  |
| Public IP address SKU |  Standard  |
| Assignment  | Static |

## <a name="createvmset"></a>Create a bastion host

There are a few different ways to configure a bastion host. In the following steps, you'll create a bastion host in the Azure portal directly from your VM. When you create a host from a VM, various settings will automatically populate corresponding to your virtual machine and/or virtual network.

[!INCLUDE [Azure Bastion preview portal](../../includes/bastion-preview-portal-note.md)]

1. Sign in to the Azure portal.
1. Navigate to the VM that you want to connect to, then select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/vm-connect.png" alt-text="Screenshot of virtual machine settings." lightbox="./media/quickstart-host-portal/vm-connect.png":::
1. From the dropdown, select **Bastion**.

   :::image type="content" source="./media/quickstart-host-portal/bastion.png" alt-text="Screenshot of Bastion dropdown." lightbox="./media/quickstart-host-portal/bastion.png":::
1. On the **TestVM | Connect page**, select **Use Bastion**.

   :::image type="content" source="./media/quickstart-host-portal/select-bastion.png" alt-text="Screenshot of Use Bastion.":::

1. On the **Connect using Azure Bastion** page, **Step 1**, the values are pre-populated because you are creating the bastion host directly from your VM.

   :::image type="content" source="./media/quickstart-host-portal/create-step-1.png" alt-text="Screenshot of step 1 prepopulated settings." lightbox="./media/quickstart-host-portal/create-step-1.png":::

1. On the **Connect using Azure Bastion** page, **Step 2**, configure the subnet values. The AzureBastionSubnet address space is pre-populated with a suggested address space. The AzureBastionSubnet must have an address space of /27 or larger (/26, /25, etc.). We recommend using a /26 so that host scaling is not limited. When you finish configuring this setting, click **Create Subnet** to create the AzureBastionSubnet.

     :::image type="content" source="./media/quickstart-host-portal/create-subnet.png" alt-text="Screenshot of create the Bastion subnet.":::

1. After the subnet creates, the page advances automatically to **Step 3**. For Step 3, use the following values:

   * **Name:** Name the bastion host.
   * **Tier:** The tier is the SKU. For this exercise, select **Standard** from the dropdown. Selecting the Standard SKU lets you configure the instance count for host scaling. The Basic SKU doesn't support host scaling. For more information, see [Configuration settings - SKU](configuration-settings.md#skus). The Standard SKU is in Preview.
   * **Instance count:** This is the setting for host scaling. Use the slider to configure. If you specify the Basic tier SKU, you are limited to 2 instances and cannot configure this setting. For more information, see [Configuration settings - host scaling](configuration-settings.md#instance). Instance count is in Preview and relies on the Standard SKU. In this quickstart, you can select the instance count you'd prefer, keeping in mind any scale unit [pricing](https://azure.microsoft.com/pricing/details/azure-bastion) considerations.
   * **Public IP address:** Select **Create new**.
   * **Public IP address name:** The name of the Public IP address resource.
   * **Public IP address SKU:** Pre-configured as **Standard**.
   * **Assignment:** Pre-configured to **Static**. You can't use a Dynamic assignment for Azure Bastion.
   * **Resource group:** The same resource group as the VM.

   :::image type="content" source="./media/quickstart-host-portal/create-step-3.png" alt-text="Screenshot of Step 3.":::
1. After completing the values, select **Create Azure Bastion using defaults**. Azure validates your settings, then creates the host. The host and its resources take about 5 minutes to create and deploy.

## <a name="remove"></a>Remove VM public IP address

[!INCLUDE [Remove a public IP address from a VM](../../includes/bastion-remove-ip.md)]

## <a name="connect"></a>Connect to a VM

After Bastion has been deployed to the virtual network, the screen changes to the connect page.

1. Type the username and password for your virtual machine. Then, select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/connect.png" alt-text="Screenshot shows the Connect using Azure Bastion dialog.":::
1. The RDP connection to this virtual machine via Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service. Click **Allow** when asked for permissions to the clipboard. This lets you use the remote clipboard arrows on the left of the screen.

   * When you connect, the desktop of the VM may look different than the example screenshot. 
   * Using keyboard shortcut keys while connected to a VM may not result in the same behavior as shortcut keys on a local computer. For example, when connected to a Windows VM from a Windows client, CTRL+ALT+END is the keyboard shortcut for CTRL+ALT+Delete on a local computer. To do this from a Mac while connected to a Windows VM, the keyboard shortcut is Fn+CTRL+ALT+Backspace.

   :::image type="content" source="./media/quickstart-host-portal/connected.png" alt-text="RDP connect":::

## Clean up resources

When you're done using the virtual network and the virtual machines, delete the resource group and all of the resources it contains:

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.

1. Select **Delete resource group**.

1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this quickstart, you created a bastion host for your virtual network, and then connected to a virtual machine securely via Bastion. Next, you can continue with the following step if you want to connect to a virtual machine scale set.

> [!div class="nextstepaction"]
> [Connect to a virtual machine scale set using Azure Bastion](bastion-connect-vm-scale-set.md)
