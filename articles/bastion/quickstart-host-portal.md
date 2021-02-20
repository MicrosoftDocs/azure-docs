---
title: 'Quickstart: Configure Azure Bastion and connect to a VM via private IP address and a browser'
titleSuffix: Azure Bastion
description: In this quickstart article, learn how to create an Azure Bastion host from a virtual machine and connect to the VM securely through your browser via private IP address.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: quickstart
ms.date: 02/18/2021
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to connect to a virtual machine securely via RDP/SSH using a private IP address through my browser.

---

# Quickstart: Connect to a VM securely through a browser via private IP address

You can connect to a virtual machine (VM) through your browser using the Azure portal and Azure Bastion. This quickstart article shows you how to configure Azure Bastion based on your VM settings, and then connect to your VM through the portal. The VM doesn't need a public IP address, client software, agent, or a special configuration. Once the service is provisioned, the RDP/SSH experience is available to all of the virtual machines in the same virtual network. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md).

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
| AzureBastionSubnet addresses | A subnet within your VNet address space with a /27 subnet mask. For example, 10.1.1.0/27.  |
| Public IP address |  Create new |
| Public IP address name | VNet1-ip  |
| Public IP address SKU |  Standard  |
| Assignment  | Static |

## <a name="createvmset"></a>Create a bastion host

There are a few different ways to configure a bastion host. In the following steps, you'll create a bastion host in the Azure portal directly from your VM. When you create a host from a VM, various settings will automatically populate corresponding to your virtual machine and/or virtual network.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the VM that you want to connect to, then select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/vm-connect.png" alt-text="Screenshot of virtual machine settings." lightbox="./media/quickstart-host-portal/vm-connect.png":::
1. From the dropdown, select **Bastion**.

   :::image type="content" source="./media/quickstart-host-portal/bastion.png" alt-text="Screenshot of Bastion dropdown." lightbox="./media/quickstart-host-portal/bastion.png":::
1. On the **TestVM | Connect page**, select **Use Bastion**.

   :::image type="content" source="./media/quickstart-host-portal/select-bastion.png" alt-text="Screenshot of Use Bastion.":::

1. On the **Connect using Azure Bastion** page, configure the values.

   * **Step 1:** The values are pre-populated because you are creating the bastion host directly from your VM.

   * **Step 2:** The address space is pre-populated with a suggested address space. The AzureBastionSubnet must have an address space of /27 or larger (/26, /25, etc.)..

   :::image type="content" source="./media/quickstart-host-portal/create-subnet.png" alt-text="Screenshot of create the Bastion subnet.":::

1. Click **Create Subnet** to create the AzureBastionSubnet.
1. After the subnet creates, the page advances automatically to **Step 3**. For Step 3, use the following values:

   * **Name:** Name the bastion host.
   * **Public IP address:** Select **Create new**.
   * **Public IP address name:** The name of the Public IP address resource.
   * **Public IP address SKU:** Pre-configured as **Standard**
   * **Assignment:** Pre-configured to **Static**. You can't use a Dynamic assignment for Azure Bastion.
   * **Resource group**: The same resource group as the VM.

   :::image type="content" source="./media/quickstart-host-portal/create-bastion.png" alt-text="Screenshot of Step 3.":::
1. After completing the values, select **Create Azure Bastion using defaults**. Azure validates your settings, then creates the host. The host and its resources take about 5 minutes to create and deploy.

## <a name="connect"></a>Connect

After Bastion has been deployed to the virtual network, the screen changes to the connect page.

1. Type the username and password for your virtual machine. Then, select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/connect.png" alt-text="Screenshot shows the Connect using Azure Bastion dialog.":::
1. The RDP connection to this virtual machine will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service.

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
