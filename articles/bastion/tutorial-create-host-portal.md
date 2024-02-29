---
title: 'Tutorial: Deploy Azure Bastion using specified settings: Azure portal'
description: Learn how to deploy Azure Bastion by using settings that you specify in the Azure portal.
author: cherylmc
ms.service: bastion
ms.topic: tutorial
ms.date: 10/13/2023
ms.author: cherylmc

---

# Tutorial: Deploy Azure Bastion by using specified settings

This tutorial helps you deploy Azure Bastion from the Azure portal by using your own manual settings and a SKU (product tier) that you specify. The SKU determines the features and connections that are available for your deployment. For more information about SKUs, see [Configuration settings - SKUs](configuration-settings.md#skus).

In the Azure portal, when you use the **Configure manually** option to deploy Bastion, you can specify configuration values such as instance counts and SKUs at the time of deployment. After Bastion is deployed, you can use SSH or RDP to connect to virtual machines (VMs) in the virtual network via Bastion using the private IP addresses of the VMs. When you connect to a VM, it doesn't need a public IP address, client software, an agent, or a special configuration.

The following diagram shows the architecture of Bastion.

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

In this tutorial, you deploy Bastion by using the Standard SKU. You adjust host scaling (instance count), which the Standard SKU supports. If you use a lower SKU for the deployment, you can't adjust host scaling.

After the deployment is complete, you connect to your VM via private IP address. If your VM has a public IP address that you don't need for anything else, you can remove it.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy Bastion to your virtual network.
> * Connect to a virtual machine.
> * Remove the public IP address from a virtual machine.

## Prerequisites

To complete this tutorial, you need these resources:

* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A [virtual network](../virtual-network/quick-create-portal.md) where you'll deploy Bastion.
* A virtual machine in the virtual network. This VM isn't a part of the Bastion configuration and doesn't become a bastion host. You connect to this VM later in this tutorial via Bastion. If you don't have a VM, create one by using [Quickstart: Create a Windows VM](../virtual-machines/windows/quick-create-portal.md) or [Quickstart: Create a Linux VM](../virtual-machines/linux/quick-create-portal.md).
* Required VM roles:

  * Reader role on the virtual machine
  * Reader role on the network adapter (NIC) with the private IP of the virtual machine

* Required inbound ports:

  * For Windows VMs: RDP (3389)
  * For Linux VMs: SSH (22)

[!INCLUDE [DNS private zone](../../includes/bastion-private-dns-zones-non-support.md)]

### <a name="values"></a>Example values

You can use the following example values when creating this configuration, or you can substitute your own.

#### Basic virtual network and VM values

|Name | Value |
| --- | --- |
| **Virtual machine**| **TestVM** |
| **Resource group** | **TestRG1** |
| **Region** | **East US** |
| **Virtual network** | **VNet1** |
| **Address space** | **10.1.0.0/16** |
| **Subnets** | **FrontEnd: 10.1.0.0/24** |

#### Bastion values

|Name | Value |
| --- | --- |
| **Name** | **VNet1-bastion** |
| **+ Subnet Name** | **AzureBastionSubnet** |
| **AzureBastionSubnet addresses** | A subnet within your virtual network address space with a subnet mask of /26 or larger; for example, **10.1.1.0/26**  |
| **Tier/SKU** | **Standard** |
| **Instance count (host scaling)**| **3** or greater |
| **Public IP address** |  **Create new** |
| **Public IP address name** | **VNet1-ip**  |
| **Public IP address SKU** |  **Standard**  |
| **Assignment**  | **Static** |

## <a name="createhost"></a>Deploy Bastion

This section helps you deploy Bastion to your virtual network. After Bastion is deployed, you can connect securely to any VM in the virtual network using its private IP address.

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your virtual network.

1. On the page for your virtual network, on the left pane, select **Bastion**.

1. On the **Bastion** pane, expand **Dedicated Deployment Options**.
1. Select **Configure manually**. This option lets you configure specific additional settings (such as the SKU) when you're deploying Bastion to your virtual network.

   :::image type="content" source="./media/tutorial-create-host-portal/manual-configuration.png" alt-text="Screenshot that shows dedicated deployment options for Azure Bastion and the button for manual configuration." lightbox="./media/tutorial-create-host-portal/manual-configuration.png":::

1. On the **Create a Bastion** pane, configure the settings for your bastion host. Project details are populated from your virtual network values. Under **Instance details**, configure these values:

   * **Name**: The name that you want to use for your Bastion resource.

   * **Region**: The Azure public region in which the resource will be created. Choose the region where your virtual network resides.

   * **Tier**: The SKU. For this tutorial, select **Standard**. For information about the features available for each SKU, see [Configuration settings - SKU](configuration-settings.md#skus).

   * **Instance count**: The setting for host scaling, which is available for the Standard SKU. You configure host scaling in scale unit increments. Use the slider or enter a number to configure the instance count that you want. For more information, see [Instances and host scaling](configuration-settings.md#instance) and [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion).

   :::image type="content" source="./media/tutorial-create-host-portal/instance-values.png" alt-text="Screenshot of Azure Bastion instance details." lightbox="./media/tutorial-create-host-portal/instance-values.png":::

1. Configure the **Virtual networks** settings. Select your virtual network from the dropdown list. If your virtual network isn't in the dropdown list, make sure that you selected the correct **Region** value in the previous step.

1. To configure AzureBastionSubnet, select **Manage subnet configuration**.

   :::image type="content" source="./media/tutorial-create-host-portal/select-vnet.png" alt-text="Screenshot of the section for configuring virtual networks." lightbox="./media/tutorial-create-host-portal/select-vnet.png":::

1. On the **Subnets** pane, select **+Subnet**.

1. On the **Add subnet** pane, create the AzureBastionSubnet subnet by using the following values. Leave the other values as default.

   * The subnet name must be **AzureBastionSubnet**.
   * The subnet must be **/26** or larger (for example, **/26**, **/25**, or **/24**) to accommodate features available with the Standard SKU.

   Select **Save** at the bottom of the pane to save your values.

1. At the top of the **Subnets** pane, select **Create a Bastion** to return to the Bastion configuration pane.

   :::image type="content" source="./media/tutorial-create-host-portal/create-page.png" alt-text="Screenshot of the pane that lists Azure Bastion subnets."lightbox="./media/tutorial-create-host-portal/create-page.png":::

1. The **Public IP address** section is where you configure the public IP address of the bastion host resource on which RDP/SSH will be accessed (over port 443). The public IP address must be in the same region as the Bastion resource that you're creating.

   Create a new IP address. You can leave the default naming suggestion.

1. When you finish specifying the settings, select **Review + Create**. This step validates the values.

1. After the values pass validation, you can deploy Bastion. Select **Create**.

   A message says that your deployment is in process. The status appears on this page as the resources are created. It takes about 10 minutes for the Bastion resource to be created and deployed.

## <a name="connect"></a>Connect to a VM

You can use any of the following detailed articles to connect to a VM. Some connection types require the Bastion [Standard SKU](configuration-settings.md#skus).

[!INCLUDE [Links to connect to VM articles](../../includes/bastion-vm-connect-article-list.md)]

You can also use these basic connection steps to connect to your VM:

[!INCLUDE [Connect to a VM](../../includes/bastion-vm-connect.md)]

### <a name="audio"></a>Enable audio output

[!INCLUDE [Enable VM audio output](../../includes/bastion-vm-audio.md)]

## <a name="ip"></a>Remove a VM's public IP address

[!INCLUDE [Remove a public IP address from a VM](../../includes/bastion-remove-ip.md)]

## Clean up resources

When you finish using this application, delete your resources:

1. Enter the name of your resource group in the **Search** box at the top of the portal. When your resource group appears in the search results, select it.
1. Select **Delete resource group**.
1. Enter the name of your resource group for **TYPE THE RESOURCE GROUP NAME**, and then select **Delete**.

## Next steps

In this tutorial, you deployed Bastion to a virtual network and connected to a VM. You then removed the public IP address from the VM. Next, learn about and configure additional Bastion features.

> [!div class="nextstepaction"]
> [Azure Bastion configuration settings](configuration-settings.md)

> [!div class="nextstepaction"]
> [VM connections and features](vm-about.md)

> [!div class="nextstepaction"]
> [Configure Azure DDos protection for your virtual network](../ddos-protection/manage-ddos-protection.md)