---
title: 'Quickstart: Configure Azure Bastion and connect to a VM via private IP address and a browser'
titleSuffix: Azure Bastion
description: In this quickstart article, learn how to create an Azure Bastion host from a virtual machine and connect to the VM securely through your browser via private IP address.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: quickstart
ms.date: 10/15/2020
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
| Resource group | TestRG |
| Region | East US |
| Virtual network | TestVNet1 |
| Address space | 10.0.0.0/16 |
| Subnets | FrontEnd: 10.0.0.0/24 |

**Azure Bastion values:**

|**Name** | **Value** |
| --- | --- |
| Name | TestVNet1-bastion |
| + Subnet Name | AzureBastionSubnet |
| AzureBastionSubnet addresses | A subnet within your VNet address space with a /27 subnet mask. For example, 10.0.1.0/27.  |
| Public IP address |  Create new |
| Public IP address name | VNet1BastionPIP  |
| Public IP address SKU |  Standard  |
| Assignment  | Static |

## <a name="createvmset"></a>Create a bastion host

There are a few different ways to configure a bastion host. In the following steps, you'll create a bastion host in the Azure portal directly from your VM. When you create a host from a VM, various settings will automatically populate corresponding to your virtual machine and/or virtual network.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the VM that you want to connect to, then select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/vm-settings.png" alt-text="virtual machine settings" lightbox="./media/quickstart-host-portal/vm-settings.png":::
1. From the dropdown, select **Bastion**.
1. On the **TestVM | Connect page**, select **Use Bastion**.

   :::image type="content" source="./media/quickstart-host-portal/select-bastion.png" alt-text="Select Bastion" border="false":::

1. On the **Bastion** page, fill out the following settings fields:

   * **Name**: Name the bastion host.
   * **Subnet**: This is the virtual network address space to which the Bastion resource will be deployed. The subnet must be created with the name **AzureBastionSubnet**. Use a subnet of at least /27 or larger (/27, /26, /25, and so on).
   * Select **Manage subnet configuration**.
1. On the **Subnets** page, select **+Subnet**.

   :::image type="content" source="./media/quickstart-host-portal/subnet.png" alt-text="+ Subnet":::
    
1. On **Add subnet** page, for **Name**, type **AzureBastionSubnet**.
   * For subnet address range, choose a subnet address that is within your virtual network address space.
   * Don't adjust any other settings. Select **OK** to accept and save the subnet changes.

   :::image type="content" source="./media/quickstart-host-portal/add-subnet.png" alt-text="Add subnet":::
1. Click the back button on your browser to navigate back to the **Bastion** page, and continue specifying values.
   * **Public IP address**: Leave as **Create new**.
   * **Public IP address name**: The name of the public IP address resource.
   * **Assignment**: Defaults to Static. You can't use a Dynamic assignment for Azure Bastion.
   * **Resource group**: The same resource group as the VM.

   :::image type="content" source="./media/quickstart-host-portal/validate.png" alt-text="Create the bastion host":::
1. Select **Create** to create the bastion host. Azure validates your settings, then creates the host. The host and its resources take about 5 minutes to create and deploy.

## <a name="connect"></a>Connect

After Bastion has been deployed to the virtual network, the screen changes to the connect page.

1. Type the username and password for your virtual machine. Then, select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/connect-vm.png" alt-text="Screenshot shows the Connect using Azure Bastion dialog.":::
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
