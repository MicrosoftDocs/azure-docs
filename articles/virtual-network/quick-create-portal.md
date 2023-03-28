---
title: 'Quickstart: Use the Azure portal to create a virtual network'
titleSuffix: Azure Virtual Network
description: Learn how to use the Azure portal to create and connect through an Azure virtual network and virtual machines.
author: asudbring
ms.author: allensu
ms.date: 03/15/2023
ms.topic: quickstart
ms.service: virtual-network
ms.workload: infrastructure
ms.tgt_pltfrm: virtual-network
tags: azure-resource-manager
ms.custom: mode-ui
#Customer intent: I want to use the Azure portal to create a virtual network so that virtual machines can communicate privately with each other and with the internet.
---

# Quickstart: Use the Azure portal to create a virtual network

This quickstart shows you how to create a virtual network by using the Azure portal. You then create two virtual machines (VMs) in the network, deploy Azure Bastion to securely connect to the VMs from the internet, and communicate privately between the VMs.

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a virtual network

The following procedure creates a virtual network with a resource subnet, an Azure Bastion subnet, and an Azure Bastion host.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **Create**.

1. On the **Basics** tab of the **Create virtual network** screen, enter or select the following information:

   - **Subscription**: Keep the default or select a different subscription.
   - **Resource group**: Select **Create new**, and then name the resource group *TestRG*.
   - **Virtual network name**: Enter *VNet*.
   - **Region**: Keep the default or select a different region for the network and all its resources.

   :::image type="content" source="media/quick-create-portal/example-basics-tab.png" alt-text="Screenshot of the Create virtual network screen in the Azure portal.":::

1. Select **Next: IP Addresses** at the bottom of the page.

1. On the **IP Addresses** tab, under **IPv4 address space**, select the garbage can icon to remove any address space that already appears, and then enter *10.0.0.0/16*.

1. Select **Add subnet**.

1. On the **Add subnet** screen, enter the following information, and then select **Add**:

   - **Subnet name**: *default*
   - **Subnet address range**: *10.0.0.0/24*.

   :::image type="content" source="media/quick-create-portal/example-ip-addresses-with-subnet.png" alt-text="Screenshot of the IP addresses tab and Add subnet screen on the Create virtual network page.":::

1. Select **Next: Security** at the bottom of the page.

1. On the **Security** tab, next to **BastionHost**, select **Enable**.

   Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](/azure/bastion/bastion-overview).

1. Enter the following information:

   - **Bastion name**: *VNet-Bastion*
   - **AzureBastionSubnet address space**: *10.0.1.0/26*. Azure automatically creates the AzureBastionSubnet subnet.
   - **Public IP address**: Select **Create new**, then enter *VNet-bastion-publicIp* under **Name** and select **OK**.

   :::image type="content" source="media/quick-create-portal/example-security-tab.png" alt-text="Screenshot of the Security tab on the Create virtual network screen.":::

1. Select **Review + create** at the bottom of the screen, and when validation passes, select **Create**. 

## Create virtual machines

Create two VMs named VM1 and VM2 in the virtual network.

1. In the portal, search for and select **Virtual machines**.

1. On the **Virtual machines** page, select **Create**, and select **Azure virtual machine**.

1. On the **Basics** tab of the **Create a virtual machine** screen, enter or select the following values:

   - **Resource group**: Select **TestRG** if not already selected.
   - **Virtual machine name**: Enter *VM1*.
   - **Region**: Select the same region as your resource group and virtual network if not already selected.
   - **Availability options**: Select **No infrastructure redundancy required**.
   - **Image**: Select **Windows Server 2019 Datacenter - x64 Gen2**.
   - **Size**: Accept the default, or drop down and select a size.
   - **Username**, **Password**, and **Confirm password**: Enter an admin username and password for the VM.
   - **Public inbound ports**: Select **None**.

   :::image type="content" source="./media/quick-create-portal/azure-virtual-machine-basic-settings.png" alt-text="Screenshot of creating basic settings for a VM.":::

1. Select the **Networking** tab at the top of the page.
  
1. On the **Networking** page, enter or select the following values:

   - **Virtual network**: Select **VNet** if not already selected.
   - **Subnet**: Select **default** if not already selected.
   - **Public IP**: Select **None**.

   :::image type="content" source="./media/quick-create-portal/azure-virtual-machine-networking.png" alt-text="Screenshot of the networking settings for a VM.":::

1. Accept the other settings, and select **Review + create**. Review the settings, and then select **Create**.

1. After the VM creation finishes, you can select **Create another VM** to create the second VM. Name the VM *VM2*, with all the same settings.

>[!NOTE]
>VMs in a virtual network with a Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](ip-services/remove-public-ip-address-vm.md).

## Connect to a VM

1. In the portal, search for and select **Virtual machines**.

1. On the **Virtual machines** page, select **VM1**.

1. At the top of the **VM1** page, select the dropdown arrow next to **Connect**, and then select **Bastion**.

   :::image type="content" source="./media/quick-create-portal/connect-to-virtual-machine.png" alt-text="Screenshot of connecting to VM1 with Azure Bastion." border="true":::

1. On the **Bastion** page, enter the username and password you created for the VM, and then select **Connect**.

## Communicate between VMs

1. From the desktop of VM1, open PowerShell.

1. Enter `ping myVM2`. You get a reply similar to the following message:

   ```powershell
   PS C:\Users\VM1> ping VM2
   
   Pinging VM2.ovvzzdcazhbu5iczfvonhg2zrb.bx.internal.cloudapp.net with 32 bytes of data
   Request timed out.
   Request timed out.
   Request timed out.
   Request timed out.
   
   Ping statistics for 10.0.0.5:
       Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),
   ```

   The ping fails because it uses the Internet Control Message Protocol (ICMP). By default, ICMP isn't allowed through Windows firewall.

1. To allow ICMP to inbound through Windows firewall on this VM, enter the following command:

   ```powershell
   New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
   ```

1. Close the Bastion connection to VM1.

1. Repeat the steps in [Connect to a VM](#connect-to-a-vm) to connect to VM2.

1. From PowerShell on VM2, enter `ping VM1`.

   This time you get a success reply similar to the following message, because you allowed ICMP through the firewall on VM1.

   ```cmd
   PS C:\Users\VM2> ping VM1
   
   Pinging VM1.e5p2dibbrqtejhq04lqrusvd4g.bx.internal.cloudapp.net [10.0.0.4] with 32 bytes of data:
   Reply from 10.0.0.4: bytes=32 time=2ms TTL=128
   Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.0.0.4: bytes=32 time<1ms TTL=128
   
   Ping statistics for 10.0.0.4:
       Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
   Approximate round trip times in milli-seconds:
       Minimum = 0ms, Maximum = 2ms, Average = 0ms
   ```

1. Close the Bastion connection to VM2.

## Clean up resources

When you're done using the virtual network and VMs, you can delete the resource group and all its resources.

1. In the Azure portal, search for and select **Resource groups**.

1. On the **Resource groups** page, select the **TestRG** resource group.

1. On the **TestRG** page, note all the resources the resource group contains. At the top of the page, select **Delete resource group**.

1. On the **Delete a resource group** page, under **Enter resource group name to confirm deletion**, enter *TestRG*, and then select **Delete**.

1. Select **Delete** again.

## Next steps

In this quickstart, you created a virtual network with two subnets, one containing two VMs and the other for Azure Bastion. You deployed Azure Bastion and used it to connect to the VMs, and securely communicated between the VMs. To learn more about virtual network settings, see [Create, change, or delete a virtual network](manage-virtual-network.md).

Private communication between VMs is unrestricted in a virtual network. Continue to the next article to learn more about configuring different types of VM network communications.
> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
