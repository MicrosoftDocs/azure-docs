---
title: 'Quickstart: Create a Bastion host from a VM and connect via private IP address'
titleSuffix: Azure Bastion
description: In this quickstart article, learn how to create an Azure Bastion host from a virtual machine and connect securely using a private IP address.
services: bastion
author: cherylmc

ms.service: bastion
ms.topic: quickstart
ms.date: 10/12/2020
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to connect to a virtual machine securely via RDP/SSH without using a public IP address.

---

# Quickstart: Connect to a virtual machine using a private IP address and Azure Bastion

This quickstart article shows you how to connect to a virtual machine through your browser using Azure Bastion and the Azure portal. In the Azure portal, from your Azure VM, you can deploy Bastion to your virtual network. After deploying Bastion, you can connect to the VM via its private IP address using the Azure portal. Your VM does not need a public IP address or special software. One advantage of creating a Bastion host for your VNet directly from your VM is that many of the settings are prepopulated for you.

Once the service is provisioned, the RDP/SSH experience is available to all of the virtual machines in the same virtual network. For more information about Azure Bastion, see [What is Azure Bastion?](bastion-overview.md).

## <a name="prereq"></a>Prerequisites

* A virtual network.
* A Windows virtual machine in the virtual network.
* The following required roles:
  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.

* Ports: To connect to the VM, you must have the following ports open on the VM:
  * Inbound ports: RDP (3389)

### Example values

|**Name** | **Value** |
| --- | --- |
| Name |  TestVNet1-bastion |
| Virtual network |  TestVNet1 (based on the VM) |
| + Subnet Name | AzureBastionSubnet |
| AzureBastionSubnet addresses |  10.1.254.0/27 |
| Public IP address |  Create new |
| Public IP address name | VNet1BastionPIP  |
| Public IP address SKU |  Standard  |
| Assignment  | Static |

## <a name="createvmset"></a>Create a bastion host

When you create a bastion host in the Azure portal by using an existing virtual machine, various settings will automatically default to correspond to your virtual machine and/or virtual network.

1. Open the [Azure portal](https://portal.azure.com). Go to your virtual machine, then select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/vm-settings.png" alt-text="virtual machine settings" lightbox="./media/quickstart-host-portal/vm-settings.png":::
1. From the dropdown, select **Bastion**.
1. On the **TestVM | Connect page**, select **Use Bastion**.

   :::image type="content" source="./media/quickstart-host-portal/select-bastion.png" alt-text="Select Bastion" border="false":::

1. On the **Bastion** page, fill out the following settings fields:

   * **Name**: Name the bastion host.
   * **Subnet**: The subnet inside your virtual network to which Bastion resource will be deployed. The subnet must be created with the name **AzureBastionSubnet**. The name lets Azure know which subnet to deploy the Bastion resource to. This is different than a gateway subnet. Use a subnet of at least /27 or larger (/27, /26, /25, and so on).
   
      * Select **Manage subnet configuration**.
      * Select the **AzureBastionSubnet**.
      * If necessary, adjust the address range in CIDR notation. For example, 10.1.254.0/27.
      * Don't adjust any other settings. Select **OK** to accept and save the subnet changes, or select **x** at the top of the page if you don't want to make any changes.
1. Click the back button on your browser to navigate back to the **Bastion** page and continue specifying values.
   * **Public IP address name**: The name of the public IP address resource.
   * **Public IP address**: This is the public IP of the Bastion resource on which RDP/SSH will be accessed (over port 443). Create a new public IP.
1. Select **Create** to create the bastion host. Azure validates your settings, then creates the host. The host and its resources take about 5 minutes to create and deploy.

   :::image type="content" source="./media/quickstart-host-portal/validate.png" alt-text="Create the bastion host":::

## <a name="connect"></a>Connect

After Bastion has been deployed to the virtual network, the screen changes to the connect page.

1. Type the username and password for your virtual machine. Then, select **Connect**.

   :::image type="content" source="./media/quickstart-host-portal/connect-vm.png" alt-text="Screenshot shows the Connect using Azure Bastion dialog.":::
1. The RDP connection to this virtual machine via Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service.

   :::image type="content" source="./media/quickstart-host-portal/connected.png" alt-text="RDP connect":::

## Clean up resources

When you're done using the virtual network and the virtual machines, delete the resource group and all of the resources it contains:

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.

1. Select **Delete resource group**.

1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this quickstart, you created a Bastion host for your virtual network, and then connected to a virtual machine securely via the Bastion host. Next, you can continue with the following step if you want to connect to a virtual machine scale set.

> [!div class="nextstepaction"]
> [Connect to a virtual machine scale set using Azure Bastion](bastion-connect-vm-scale-set.md)
