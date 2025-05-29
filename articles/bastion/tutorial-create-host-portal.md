---
title: 'Tutorial: Deploy Azure Bastion using specified settings: Azure portal'
description: Learn how to deploy a dedicated Azure Bastion bastion host using settings that you specify in the Azure portal. Use these steps when you want to specify features and settings. 
author: abell
ms.service: azure-bastion
ms.topic: tutorial
ms.date: 01/22/2025
ms.author: abell
---

# Tutorial: Deploy Azure Bastion by using specified settings

This tutorial helps you configure dedicated deployment of Azure Bastion to your virtual network from the Azure portal using the settings and SKU of your choice. The SKU determines the features and connections that are available for your deployment. For more information about SKUs and features, see [Configuration settings - SKUs](configuration-settings.md#skus). After Bastion is deployed, you can use SSH or RDP to connect to virtual machines (VMs) in the virtual network via Bastion using the private IP addresses of the VMs. When you connect to a VM, it doesn't need a public IP address, client software, an agent, or a special configuration.

The following diagram shows the Azure Bastion dedicated deployment [architecture](design-architecture.md) for this tutorial. Unlike the [Bastion Developer architecture](design-architecture.md#developer), a dedicated deployment architecture deploys a dedicated bastion host directly to your virtual network.

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

The steps in this tutorial deploy Bastion using the Standard SKU via the Dedicated Deployment Option **Configure Manually**. In this tutorial, you adjust host scaling (instance count), which the Standard SKU supports. If you use a lower SKU for the deployment, you can't adjust host scaling. You can also select an availability zone, depending on the region to which you want to deploy.

After the deployment is complete, you connect to your VM via private IP address. If your VM has a public IP address that you don't need for anything else, you can remove it.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy Bastion to your virtual network.
> * Connect to a virtual machine.
> * Remove the public IP address from a virtual machine.

## Prerequisites

To complete this tutorial, you need these resources:

* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A [virtual network](../virtual-network/quick-create-portal.md) to which you'll deploy Bastion.
* A virtual machine in the virtual network. This VM isn't a part of the Bastion configuration and doesn't become a bastion host. You connect to this VM later in this tutorial via Bastion. If you don't have a VM, create one by using [Quickstart: Create a Windows VM](/azure/virtual-machines/windows/quick-create-portal) or [Quickstart: Create a Linux VM](/azure/virtual-machines/linux/quick-create-portal).
* Required VM roles:

  * Reader role on the virtual machine
  * Reader role on the network adapter (NIC) with the private IP of the virtual machine

* Required inbound ports:

  * For Windows VMs: RDP (3389)
  * For Linux VMs: SSH (22)

[!INCLUDE [DNS private zone](../../includes/bastion-private-dns-zones-non-support.md)]

## <a name="createhost"></a>Deploy Bastion

This section helps you deploy Bastion to your virtual network. After Bastion is deployed, you can connect securely to any VM in the virtual network using its private IP address.

> [!IMPORTANT]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your virtual network. On the page for your virtual network, in the left pane, select **Bastion**. These instructions will also work if you're configuring Bastion from your virtual machine's page in the portal.

1. On the **Bastion** pane, expand **Dedicated Deployment Options** to show the **Configure manually** button. You might need to scroll to see the option to expand.
1. Select **Configure manually**. This option lets you configure specific additional settings (such as the SKU) when you're deploying Bastion to your virtual network.

1. On the **Create a Bastion** pane, configure the settings for your bastion host. Project details are populated from your virtual network values. Under **Instance details**, configure these values:

   | Setting | Value |
   | --- | --- |
   | Name| Specify the name that you want to use for your Bastion resource. For example, **VNet1-bastion**. |
   | Region | Select the region where your virtual network resides. |
   | Availability zone | Select the zone(s) from the dropdown, if desired. Only certain regions are supported. For more information, see [What are availability zones?](../reliability/availability-zones-overview.md?tabs=azure-cli) |
   | Tier| For this tutorial, select the **Standard** SKU. For information about the features available for each SKU, see [Configuration settings - SKU](configuration-settings.md#skus). |
   | Instance count | Configure host scaling in scale unit increments. Use the slider or enter a number to configure the instance count that you want, for example, **3**. For more information, see [Instances and host scaling](configuration-settings.md#instance) and [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion). |

1. Configure the **Virtual networks** settings. Select your virtual network from the dropdown list. If your virtual network isn't in the dropdown list, make sure that you selected the correct **Region** value in the previous step.

1. For **Subnet**, if you already have a subnet configured in your virtual network that is named **AzureBastionSubnet**, it will automatically select in the portal. If you don't, you can create one. To create the AzureBastionSubnet, select **Manage subnet configuration**. On the **Subnets** pane, select **+Subnet**. Configure the following values, then **Add**.

   | Setting | Value |
   |--- | --- |
   | Subnet purpose | Select **Azure Bastion** from the dropdown. This specifies that the name is **AzureBastionSubnet**.|
   | Starting address | Enter the starting address for the subnet. For example, if your address space is 10.1.0.0/16, you could use **10.1.1.0** for the starting address. |
   | Size| The subnet must be **/26** or larger (for example, **/26**, **/25**, or **/24**) to accommodate the features available with the Standard SKU. |

1. At the top of the **Subnets** pane, using the breadcrumb links, select **Create a Bastion** to return to the Bastion configuration pane.

   :::image type="content" source="./media/tutorial-create-host-portal/create-page.png" alt-text="Screenshot of the pane that lists Azure Bastion subnets."lightbox="./media/tutorial-create-host-portal/create-page.png":::

1. The **Public IP address** section is where you configure the public IP address of the bastion host resource on which RDP/SSH will be accessed (over port 443). Configure the following settings:

   | Setting | Value|
   | --- | --- |
   | Public IP address | Select **Create new** to create a new public IP address for the Bastion resource. You can also select **Use existing** and select an existing public IP address from the dropdown list if you already have an IP address created that meets the proper criteria and isn't in already in use. The public IP address must be in the same region as the Bastion resource that you're creating. |
   | Public IP address name | Specify a name for the public IP address. For example, **VNet1-bastion-ip**. |
   | Public IP address SKU | The public IP address must use the **Standard** SKU. The portal will autofill this value. |
   | Assignment | Static |
   | Availability zone  | Zone-redundant (if available)

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
