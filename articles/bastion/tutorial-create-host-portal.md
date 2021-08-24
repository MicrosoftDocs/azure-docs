---
title: 'Tutorial: Create an Azure Bastion host: Windows VM: portal'
description: Learn how to create an Azure Bastion host and connect to a Windows VM.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: tutorial
ms.date: 07/13/2021
ms.author: cherylmc

---

# Tutorial: Configure Bastion and connect to a Windows VM

This tutorial shows you how to connect to a virtual machine through your browser using Azure Bastion and the Azure portal. In this tutorial, using the Azure portal, you deploy Bastion to your virtual network. Once the service is provisioned, the RDP/SSH experience is available to all of the virtual machines in the same virtual network. When you use Bastion to connect, the VM does not need a public IP address or special software. After deploying Bastion, you can remove the public IP address from your VM if it is not needed for anything else. Next, you connect to a VM via its private IP address using the Azure portal. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md).

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create a bastion host for your VNet.
> * Remove the public IP address from a virtual machine.
> * Connect to a Windows virtual machine.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* A virtual network.
* A Windows virtual machine in the virtual network. If you don't have a VM, create one using [Quickstart: Create a VM](../virtual-machines/windows/quick-create-portal.md).
* The following required roles for your resources:
   * Required VM roles:
     * Reader role on the virtual machine.
     * Reader role on the NIC with private IP of the virtual machine.

* Ports: To connect to the Windows VM, you must have the following ports open on your Windows VM:
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
| Instance count (host scaling)| 3 or greater |
| Public IP address |  Create new |
| Public IP address name | VNet1-ip  |
| Public IP address SKU |  Standard  |
| Assignment  | Static |

## Sign in to the Azure portal

[!INCLUDE [Azure Bastion preview portal](../../includes/bastion-preview-portal-note.md)]

Sign in to the Azure portal.

## <a name="createhost"></a>Create a bastion host

This section helps you create the bastion object in your VNet. This is required in order to create a secure connection to a VM in the VNet.

1. Type **Bastion** into the search.
1. Under services, click **Bastions**.
1. On the Bastions page, click **+ Create** to open the **Create a Bastion** page.
1. On the **Create a Bastion** page, configure a new Bastion resource.

   :::image type="content" source="./media/tutorial-create-host-portal/review-create.png" alt-text="Screenshot of Create a Bastion portal page." lightbox="./media/tutorial-create-host-portal/create-expand.png":::

### Project details

* **Subscription**: The Azure subscription you want to use.

* **Resource Group**: The Azure resource group in which the new Bastion resource will be created. If you don't have an existing resource group, you can create a new one.

### Instance details

* **Name**: The name of the new Bastion resource.

* **Region**: The Azure public region in which the resource will be created.

* **Tier:** The tier is also known as the **SKU**. For this tutorial, we select the **Standard** SKU from the dropdown. Selecting the Standard SKU lets you configure the instance count for host scaling. The Basic SKU doesn't support host scaling. For more information, see [Configuration settings - SKU](configuration-settings.md#skus). The Standard SKU is in Preview.

* **Instance count:** This is the setting for **host scaling** and configured in scale unit increments. Use the slider to configure the instance count. If you specified the Basic tier SKU, you cannot configure this setting. For more information, see [Configuration settings - host scaling](configuration-settings.md#instance). In this tutorial, you can select the instance count you'd prefer, keeping in mind any scale unit [pricing](https://azure.microsoft.com/pricing/details/azure-bastion) considerations.

### Configure virtual networks

* **Virtual network**: The virtual network in which the Bastion resource will be created. You can create a new virtual network in the portal during this process, or use an existing virtual network. If you are using an existing virtual network, make sure the existing virtual network has enough free address space to accommodate the Bastion subnet requirements. If you don't see your virtual network from the dropdown, make sure you have selected the correct Resource Group.

* **Subnet**: Once you create or select a virtual network, the subnet field appears on the page. This is the subnet in which your Bastion instances will be deployed. 

#### Add the AzureBastionSubnet

In most cases, you will not already have an AzureBastionSubnet configured. To configure the bastion subnet: 

1. Select **Manage subnet configuration**. This takes you to the **Subnets** page.

   :::image type="content" source="./media/tutorial-create-host-portal/subnet.png" alt-text="Screenshot of Manage subnet configuration.":::
1. On the **Subnets** page, select **+Subnet** to open the **Add subnet** page. 

1. Create a subnet using the following guidelines:

   * The subnet must be named **AzureBastionSubnet**.
   * The subnet must be at least /27 or larger. For the Standard SKU, we recommend /26 or larger to accommodate future additional host scaling instances.

   :::image type="content" source="./media/tutorial-create-host-portal/bastion-subnet.png" alt-text="Screenshot of the AzureBastionSubnet subnet.":::

1. You don't need to fill out additional fields on this page. Select **Save** at the bottom of the page to save the settings and close the **Add subnet** page.

1. At the top of the **Subnets** page, select **Create a Bastion** to return to the Bastion configuration page.

   :::image type="content" source="./media/tutorial-create-host-portal/create-a-bastion.png" alt-text="Screenshot of Create a Bastion.":::

### Public IP address

The public IP address of the Bastion resource on which RDP/SSH will be accessed (over port 443). Create a **new public IP address**. The public IP address must be in the same region as the Bastion resource you are creating. This IP address does not have anything to do with any of the VMs that you want to connect to. It's the public IP address for the Bastion host resource.

   * **Public IP address name**: The name of the public IP address resource. For this tutorial, you can leave the default.
   * **Public IP address SKU**: This setting is prepopulated by default to **Standard**. Azure Bastion uses/supports only the Standard public IP SKU.
   * **Assignment**: This setting is prepopulated by default to **Static**.

### Review and create

1. When you finish specifying the settings, select **Review + Create**. This validates the values. Once validation passes, you can create the Bastion resource.
1. Review your settings. 
1. At the bottom of the page, select **Create**.
1. You will see a message letting you know that your deployment is underway. Status will display on this page as the resources are created. It takes about 5 minutes for the Bastion resource to be created and deployed.

## Remove VM public IP address

[!INCLUDE [Remove a public IP address from a VM](../../includes/bastion-remove-ip.md)]

## Connect to a VM

[!INCLUDE [Connect to a Windows VM](../../includes/bastion-vm-rdp.md)]

## Clean up resources

If you're not going to continue to use this application, delete
your resources using the following steps:

1. Enter the name of your resource group in the **Search** box at the top of the portal. When you see your resource group in the search results, select it.
1. Select **Delete resource group**.
1. Enter the name of your resource group for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this tutorial, you created a Bastion host and associated it to a virtual network. You then removed the public IP address from a VM and connected to it. You may choose to use Network Security Groups with your Azure Bastion subnet. To do so, see:

> [!div class="nextstepaction"]
> [Work with NSGs](bastion-nsg.md)
