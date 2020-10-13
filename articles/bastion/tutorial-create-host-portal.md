---
title: 'Create an Azure Bastion host: Windows VM: portal'
description: In this article, you learn how to create an Azure Bastion host and connect to a Windows VM.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: tutorial
ms.date: 10/09/2020
ms.author: cherylmc

---

# Tutorial: Create an Azure Bastion host and connect to a Windows VM

You can connect to a Windows virtual machine (VM) through a browser via the Azure portal. Connect to your VM directly through the browser over TLS using a private IP address. You don't need to install and configure client software locally.

To connect to a VM using Bastion, you need to provision the Azure Bastion service in your virtual network (VNet). Once the service is provisioned, this type of connection is available to all of the VMs that are in the VNet, depending on the security configuration of the VM. Azure Bastion deployment is per virtual network, not per subscription/account or virtual machine.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create a bastion host for your VNet
> * Connect to a Windows virtual machine

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* A virtual network.
* A Windows virtual machine in the virtual network.
* The following required roles:
  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.
  * Reader role on the Azure Bastion resource.

* Ports: To connect to the Windows VM, you must have the following ports open on your Windows VM:
  * Inbound ports: RDP (3389)

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## <a name="createhost"></a>Create a bastion host

This section helps you create the bastion object in your VNet. This is required in order to create a secure connection to a VM in the VNet.

1. From the **Home** page, select **+ Create a resource**.
1. On the **New** page, in the Search box, type **Bastion**, then select **Enter** to get to the search results. On the result for **Bastion**, verify that the publisher is Microsoft.
1. Select **Create**.
1. On the **Create a Bastion** page, configure a new Bastion resource.

   :::image type="content" source="./media/tutorial-create-host-portal/bastion-basics.png" alt-text="Create a Bastion host" lightbox="./media/tutorial-create-host-portal/bastion-basics.png":::

    * **Subscription**: The Azure subscription you want to use to create a new Bastion resource.
    * **Resource Group**: The Azure resource group in which the new Bastion resource will be created. If you don't have an existing resource group, you can create a new one.
    * **Name**: The name of the new Bastion resource.
    * **Region**: The Azure public region that the resource will be created in.
    * **Virtual network**: The virtual network in which the Bastion resource will be created. You can create a new virtual network in the portal during this process, or use an existing virtual network. If you are using an existing virtual network, make sure the existing virtual network has enough free address space to accommodate the Bastion subnet requirements. If you don't see your virtual network from the dropdown, make sure you have selected the correct Resource Group.
    * **Subnet**: Once you create or select a virtual network, the subnet field will appear. The subnet in your virtual network where the new Bastion host will be deployed. The subnet will be dedicated to the Bastion host. Select **Manage subnet configuration** and create the Azure Bastion subnet. Select **+Subnet** and create a subnet using the following guidelines:

         * The subnet must be named **AzureBastionSubnet**.
         * The subnet must be at least /27 or larger.

      You don't need to fill out additional fields. Select **OK** and then, at the top of the page, select **Create a Bastion** to return to the Bastion configuration page.
    * **Public IP address**: The public IP of the Bastion resource on which RDP/SSH will be accessed (over port 443). Create a new public IP. The public IP address must be in the same region as the Bastion resource you are creating. This is IP address does not have anything to do with any of the VMs that you want to connect to. It's the public IP for the Bastion host resource.
    * **Public IP address name**: The name of the public IP address resource. For this tutorial, you can leave the default.
    * **Public IP address SKU**: This setting is prepopulated by default to **Standard**. Azure Bastion uses/supports only the Standard Public IP SKU.
    * **Assignment**: This setting is prepopulated by default to **Static**.

1. When you have finished specifying the settings, select **Review + Create**. This validates the values. Once validation passes, you can create the Bastion resource.
1. Select **Create**.
1. You will see a message letting you know that your deployment is underway. Status will display on this page as the resources are created. It takes about 5 minutes for the Bastion resource to be created and deployed.

## Connect to a VM

[!INCLUDE [Connect to a Windows VM](../../includes/bastion-vm-rdp.md)]

## Clean up resources

If you're not going to continue to use this application, delete
your resources using the following steps:

1. Enter the name of your resource group in the **Search** box at the top of the portal. When you see your resource group in the search results, select it.
1. Select **Delete resource group**.
1. Enter the name of your resource group for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this tutorial, you created a Bastion Host and associated it to a virtual network, and connected to a Windows VM. You may choose to use Network Security Groups with your Azure Bastion subnet. To do so, see [Work with NSGs](bastion-nsg.md).
