---
title: 'Quickstart: Use Azure PowerShell to create a virtual network'
titleSuffix: Azure Virtual Network
description: Learn how to use Azure PowerShell to create and connect through an Azure virtual network and virtual machines.
author: asudbring
ms.service: virtual-network
ms.topic: quickstart
ms.date: 03/15/2023
ms.author: allensu
ms.custom: devx-track-azurepowershell, mode-api
#Customer intent: I want to use PowerShell to create a virtual network so that virtual machines can communicate privately with each other and with the internet.
---

# Quickstart: Use Azure PowerShell to create a virtual network

This quickstart shows you how to create a virtual network by using Azure PowerShell. You then create two virtual machines (VMs) in the network, securely connect to the VMs from the internet, and communicate privately between the VMs.

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

  The steps in this quickstart run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-Az-ps) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  If you run PowerShell locally, run `Connect-AzAccount` to connect to Azure.

## Create a virtual network

1. First, use [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) to create a resource group to host the virtual network. Run the following code to create a resource group named `TestRG` in the `eastus` Azure region.

   ```azurepowershell-interactive
   $rg = @{
       Name = 'TestRG'
       Location = 'eastus'
   }
   New-AzResourceGroup @rg
   ```
   
1. Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create a virtual network named `VNet` with IP address prefix `10.0.0.0/16` in the `TestRG` resource group and `eastus` location.

   ```azurepowershell-interactive
   $vnet = @{
       Name = 'VNet'
       ResourceGroupName = 'TestRG'
       Location = 'eastus'
       AddressPrefix = '10.0.0.0/16'
   }
   $virtualNetwork = New-AzVirtualNetwork @vnet
   ```

1. Azure deploys resources to a subnet within a virtual network. Use [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) to create a subnet configuration named `default` with address prefix `10.0.0.0/24`.

   ```azurepowershell-interactive
   $subnet = @{
       Name = 'default'
       VirtualNetwork = $virtualNetwork
       AddressPrefix = '10.0.0.0/24'
   }
   $subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
   ```

1. Then associate the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork).

   ```azurepowershell-interactive
   $virtualNetwork | Set-AzVirtualNetwork
   ```

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](/azure/bastion/bastion-overview).

1. Configure an Azure Bastion subnet for your virtual network. This subnet is reserved exclusively for Azure Bastion resources and must be named `AzureBastionSubnet`.

   ```azurepowershell-interactive
   $subnet = @{
       Name = 'AzureBastionSubnet'
       VirtualNetwork = $virtualNetwork
       AddressPrefix = '10.0.1.0/26'
   }
   $subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
   ```

1. Set the configuration.

   ```azurepowershell-interactive
   $virtualNetwork | Set-AzVirtualNetwork
   ```

1. Create a public IP address for Azure Bastion. The bastion host uses the public IP to access secure shell (SSH) and remote desktop protocol (RDP) over port 443.

   ```azurepowershell-interactive
   $publicip = New-AzPublicIpAddress -ResourceGroupName "TestRG" -name "VNet-ip" -location "EastUS" -AllocationMethod Static -Sku Standard
   ```

1. Use the [New-AzBastion](/powershell/module/az.network/new-azbastion) command to create a new Standard SKU Azure Bastion host in the AzureBastionSubnet.

   ```azurepowershell-interactive
      New-AzBastion -ResourceGroupName "TestRG" -Name "VNet-bastion" `
      -PublicIpAddressRgName "TestRG" -PublicIpAddressName "VNet-ip" `
      -VirtualNetworkRgName "TestRG" -VirtualNetworkName "VNet" `
      -Sku "Standard"
   ```

It takes about 10 minutes for the Bastion resources to deploy. You can create VMs in the next section while Bastion deploys to your virtual network.

## Create virtual machines

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create two VMs named `VM1` and `VM2` in the `default` subnet of the virtual network. When you're prompted for credentials, enter user names and passwords for the VMs.

1. To create the first VM, run the following code:

   ```azurepowershell-interactive
   $vm1 = @{
       ResourceGroupName = 'TestRG'
       Location = 'eastus'
       Name = 'VM1'
       VirtualNetworkName = 'VNet'
       SubnetName = 'default'
   }
   New-AzVM @vm1
   ```

1. To create the second VM, run the following code:

   ```azurepowershell-interactive
   $vm2 = @{
       ResourceGroupName = 'TestRG'
       Location = 'eastus'
       Name = 'VM2'
       VirtualNetworkName = 'VNet'
       SubnetName = 'default'
   }
   New-AzVM @vm2
   ```
   
>[!TIP]
>You can use the `-AsJob` option to create a VM in the background while you continue with other tasks. For example, run `New-AzVM @vm1 -AsJob`. When Azure starts creating the VM in the background, you get something like the following output:
>
>```powershell
>Id     Name            PSJobTypeName   State         HasMoreData     Location             Command
>--     ----            -------------   -----         -----------     --------             -------
>1      Long Running... AzureLongRun... Running       True            localhost            New-AzVM
>```

Azure takes a few minutes to create the VMs. When Azure finishes creating the VMs, it returns output to PowerShell.

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

1. Close the remote desktop connection to VM1.

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

1. Close the remote desktop connection to VM2.

## Clean up resources

When you're done with the virtual network and the VMs, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all its resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'TestRG' -Force
```

## Next steps

In this quickstart, you created a virtual network with a default subnet that contains two VMs. You deployed Azure Bastion and used it to connect to the VMs, and securely communicated between the VMs. To learn more about virtual network settings, see [Create, change, or delete a virtual network](manage-virtual-network.md).

Private communication between VMs in a virtual network is unrestricted. Continue to the next article to learn more about configuring different types of VM network communications.
> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
