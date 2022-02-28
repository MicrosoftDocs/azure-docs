---
title: 'Quickstart: Deploy Bastion from VM settings'
titleSuffix: Azure Bastion
description: Learn how to create an Azure Bastion host from virtual machine settings and connect to the VM securely through your browser via private IP address.
services: bastion
author: cherylmc
ms.service: bastion
ms.topic: quickstart
ms.date: 02/25/2022
ms.author: cherylmc
ms.custom: ignite-fall-2021, mode-other
#Customer intent: As someone with a networking background, I want to connect to a virtual machine securely via RDP/SSH using a private IP address through my browser.
---

# Quickstart: Deploy Azure Bastion from VM settings

This quickstart article shows you how to deploy Azure Bastion to your virtual network from the Azure portal based on settings from an existing virtual machine. After you deploy Bastion, the RDP/SSH experience is available to all of the virtual machines in the virtual network. Azure Bastion is a PaaS service that is maintained for you. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md)

In this quickstart, after you deploy Bastion, you connect to your VM via private IP address using the Azure portal. When you connect to the VM, it doesn't need a public IP address, client software, agent, or a special configuration. If your VM has a public IP address that you don't need for anything else, you can remove it.

## <a name="prereq"></a>Prerequisites

* **An Azure account with an active subscription**. If you don't have one, [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

* **A VM in a VNet**. This quickstart lets you quickly deploy Bastion to a VNet using settings from the virtual machine to which you want to connect. Bastion pulls the required values from the VM and deploys to the VNet based on these values. The virtual machine itself doesn't become a bastion host.

  * If you don't already have a VM in a VNet, create one using [Quickstart: Create a VM](../virtual-machines/windows/quick-create-portal.md).
  * If you need example values, see the provided [Example values](#values).
  * If you already have a virtual network, make sure to select it on the Networking tab when you create your VM.
  * If you don't already have a virtual network, you can create one at the same time you create your VM.
  * You don't need to have a public IP address for this VM in order to connect via Azure Bastion.

* **Required VM roles:**

  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.
  
* **Required VM ports inbound ports:**

  * 3389 for Windows VMs
  * 22 for Linux VMs
 
 > [!NOTE]
 > The use of Azure Bastion with Azure Private DNS Zones is not supported at this time. Before you begin, please make sure that the virtual network where you plan to deploy your Bastion resource is not linked to a private DNS zone.
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

**Bastion values:**

When you deploy from VM settings, Bastion is automatically configured with default values. You don't need to specify any additional values for this exercise. However, once Bastion deploys, you can later modify [configuration settings](configuration-settings.md). For example, the SKU that is automatically configured is the Basic SKU. To support more Bastion features, you can easily [upgrade the SKU](upgrade-sku.md) after the deployment completes.

After completing this configuration, you'll have an Azure Bastion deployment with the values listed in the following table:

|**Name** | **Value** |
|---|---|
|AzureBastionSubnet | This subnet is created within the VNet as a /26 |
|SKU | Basic |
| Name | Based on  the virtual network name |
| Public IP address name | Based on the virtual network name |

## <a name="createvmset"></a>Deploy Bastion to a VNet

There are a few different ways to deploy Bastion to a virtual network. In this quickstart, you deploy Bastion from your virtual machine settings in the Azure portal (you don't sign in and deploy from your VM directly).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the portal, navigate to the VM to which you want to connect. The values from the virtual network in which this VM resides will be used to create the Bastion deployment.
1. Select **Bastion** in the left menu. You can view some of the values that will be used when creating the bastion host for your virtual network. Select **Deploy Bastion**.

   :::image type="content" source="./media/quickstart-host-portal/deploy-bastion.png" alt-text="Screenshot of Deploy Bastion." lightbox="./media/quickstart-host-portal/deploy-bastion.png":::
1. Bastion begins deploying. This can take around 10 minutes to complete.

   :::image type="content" source="./media/quickstart-host-portal/creating-bastion.png" alt-text="Screenshot of Bastion resources being created." lightbox="./media/quickstart-host-portal/creating-bastion.png":::

## <a name="connect"></a>Connect to a VM

When the Bastion deployment is complete, the screen changes to the **Connect** page.

1. Type the username and password for your virtual machine. Then, select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/connect-vm.png" alt-text="Screenshot shows the Connect using Azure Bastion dialog." lightbox="./media/quickstart-host-portal/connect-vm.png":::
1. The connection to this virtual machine via Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service. Select **Allow** when asked for permissions to the clipboard. This lets you use the remote clipboard arrows on the left of the screen.

   * When you connect, the desktop of the VM may look different than the example screenshot.
   * Using keyboard shortcut keys while connected to a VM may not result in the same behavior as shortcut keys on a local computer. For example, when connected to a Windows VM from a Windows client, CTRL+ALT+END is the keyboard shortcut for CTRL+ALT+Delete on a local computer. To do this from a Mac while connected to a Windows VM, the keyboard shortcut is Fn+CTRL+ALT+Backspace.

     :::image type="content" source="./media/quickstart-host-portal/connected.png" alt-text="Screenshot of RDP connection." lightbox="./media/quickstart-host-portal/connected.png":::

## <a name="remove"></a>Remove VM public IP address

[!INCLUDE [Remove a public IP address from a VM](../../includes/bastion-remove-ip.md)]

## Clean up resources

When you're done using the virtual network and the virtual machines, delete the resource group and all of the resources it contains:

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.

1. Select **Delete resource group**.

1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this quickstart, you created a bastion host for your virtual network, and then connected to a virtual machine securely via Bastion. Next, you can continue with the following step if you want to connect to a virtual machine scale set.

> [!div class="nextstepaction"]
> [Connect to a virtual machine scale set using Azure Bastion](bastion-connect-vm-scale-set.md)
