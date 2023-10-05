---
title: 'Tutorial: Deploy Bastion using specified settings: Azure portal'
description: Learn how to deploy Bastion using settings that you specify - Azure portal.
author: cherylmc
ms.service: bastion
ms.topic: tutorial
ms.date: 10/05/2023
ms.author: cherylmc

---

# Tutorial: Deploy Bastion using specified settings

This tutorial helps you deploy Azure Bastion from the Azure portal using your own specified manual settings. When you use manual settings, you can specify configuration values such as instance counts and the SKU at the time of deployment. After Bastion is deployed, you can connect (SSH/RDP) to virtual machines in the virtual network via Bastion using the private IP address of the VM. When you connect to a VM, it doesn't need a public IP address, client software, agent, or a special configuration.

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram showing Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

In this tutorial, you deploy Bastion using the Standard SKU tier and adjust host scaling (instance count). After the deployment is complete, you connect to your VM via private IP address. If your VM has a public IP address that you don't need for anything else, you can remove it.

Azure Bastion is a PaaS service that's maintained for you, not a bastion host that you install on one of your VMs and maintain yourself. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Deploy Bastion to your VNet.
> * Connect to a virtual machine.
> * Remove the public IP address from a virtual machine.

## Prerequisites

* If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A [virtual network](../virtual-network/quick-create-portal.md). This will be the virtual network to which you deploy Bastion.
* A virtual machine in the virtual network. This VM isn't a part of the Bastion configuration and doesn't become a bastion host. You connect to this VM later in this tutorial via Bastion. If you don't have a VM, create one using [Quickstart: Create a VM](../virtual-machines/windows/quick-create-portal.md).
* **Required VM roles:**

  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.

* **Required inbound ports:**

  * For Windows VMs - RDP (3389)
  * For Linux VMs - SSH (22)

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

**Azure Bastion values:**

|**Name** | **Value** |
| --- | --- |
| Name | VNet1-bastion |
| + Subnet Name | AzureBastionSubnet |
| AzureBastionSubnet addresses | A subnet within your VNet address space with a subnet mask /26 or larger.<br> For example, 10.1.1.0/26.  |
| Tier/SKU | Standard |
| Instance count (host scaling)| 3 or greater |
| Public IP address |  Create new |
| Public IP address name | VNet1-ip  |
| Public IP address SKU |  Standard  |
| Assignment  | Static |

## <a name="createhost"></a>Deploy Bastion

This section helps you deploy Bastion to your virtual network. Once Bastion is deployed, you can connect securely to any VM in the virtual network using its private IP address.

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]
>

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your virtual network.

1. On the page for your virtual network, in the left pane, select **Bastion** to open the **Bastion** page.

1. On the Bastion page, expand **Dedicated Deployment Options**.
1. Select **Configure manually**. This lets you configure specific additional settings (such as the SKU) when deploying Bastion to your virtual network.

   :::image type="content" source="./media/tutorial-create-host-portal/manual-configuration.png" alt-text="Screenshot of Bastion page showing configure bastion on my own." lightbox="./media/tutorial-create-host-portal/manual-configuration.png":::

1. On the **Create a Bastion** page, configure the settings for your bastion host. Project details are populated from your virtual network values. Configure the **Instance details** values.

   * **Name**: Type the name that you want to use for your bastion resource.

   * **Region**: The Azure public region in which the resource will be created. Choose the region in which your virtual network resides.

   * **Tier:** The tier is also known as the **SKU**. For this tutorial, select **Standard**. For information about the features available for each SKU, see [Configuration settings - SKU](configuration-settings.md#skus).

   * **Instance count:** This is the setting for **host scaling** and is available for the Standard SKU. Host scaling is configured in scale unit increments. Use the slider or type a number to configure the instance count that you want. For this tutorial, you can select the instance count you'd prefer. For more information, see [Host scaling](configuration-settings.md#instance) and [Pricing](https://azure.microsoft.com/pricing/details/azure-bastion).

   :::image type="content" source="./media/tutorial-create-host-portal/instance-values.png" alt-text="Screenshot of Bastion page instance values." lightbox="./media/tutorial-create-host-portal/instance-values.png":::

1. Configure the **virtual networks** settings. Select your virtual network from the dropdown. If you don't see your virtual network in the dropdown list, make sure you selected the correct Region in the previous settings on this page.

1. To configure the AzureBastionSubnet, select **Manage subnet configuration**.

   :::image type="content" source="./media/tutorial-create-host-portal/select-vnet.png" alt-text="Screenshot of configure virtual networks section." lightbox="./media/tutorial-create-host-portal/select-vnet.png":::

1. On the **Subnets** page, select **+Subnet** to open the **Add subnet** page.

1. On the **Add subnet page**, create the 'AzureBastionSubnet' subnet using the following values. Leave the other values as default.

   * The subnet name must be **AzureBastionSubnet**.
   * The subnet must be at least **/26 or larger** (/26, /25, /24 etc.) to accommodate features available with the Standard SKU.

   Select **Save** at the bottom of the page to save your values.

1. At the top of the **Subnets** page, select **Create a Bastion** to return to the Bastion configuration page.

   :::image type="content" source="./media/tutorial-create-host-portal/create-page.png" alt-text="Screenshot of Create a Bastion."lightbox="./media/tutorial-create-host-portal/create-page.png":::

1. The **Public IP address** section is where you configure the public IP address of the Bastion host resource on which RDP/SSH will be accessed (over port 443). The public IP address must be in the same region as the Bastion resource you're creating. Create a new IP address. You can leave the default naming suggestion.

1. When you finish specifying the settings, select **Review + Create**. This validates the values.

1. Once validation passes, you can deploy Bastion. Select **Create**.  You'll see a message letting you know that your deployment is in process. Status displays on this page as the resources are created. It takes about 10 minutes for the Bastion resource to be created and deployed.

## <a name="connect"></a>Connect to a VM

You can use any of the following detailed articles to connect to a VM. Some connection types require the Bastion [Standard SKU](configuration-settings.md#skus).

[!INCLUDE [Links to Connect to VM articles](../../includes/bastion-vm-connect-article-list.md)]

You can also use the basic [Connection steps](#steps) in the following section to connect to your VM.

### <a name="steps"></a>Connection steps

[!INCLUDE [Connect to a VM](../../includes/bastion-vm-connect.md)]

### <a name="audio"></a>To enable audio output

[!INCLUDE [Enable VM audio output](../../includes/bastion-vm-audio.md)]

## <a name="ip"></a>Remove VM public IP address

[!INCLUDE [Remove a public IP address from a VM](../../includes/bastion-remove-ip.md)]

## Clean up resources

If you're not going to continue to use this application, delete
your resources using the following steps:

1. Enter the name of your resource group in the **Search** box at the top of the portal. When you see your resource group in the search results, select it.
1. Select **Delete resource group**.
1. Enter the name of your resource group for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this tutorial, you deployed Bastion to a virtual network and connected to a VM. You then removed the public IP address from the VM. Next, learn about and configure additional Bastion features.

> [!div class="nextstepaction"]
> [Bastion features and configuration settings](configuration-settings.md)

> [!div class="nextstepaction"]
> [Bastion - VM connections and features](vm-about.md)
