---
title: 'Quickstart: Use Azure PowerShell to create a virtual network'
titleSuffix: Azure Virtual Network
description: Learn how to use Azure PowerShell to create and connect through an Azure virtual network and virtual machines.
author: asudbring
ms.service: virtual-network
ms.topic: quickstart
ms.date: 06/09/2023
ms.author: allensu
ms.custom: devx-track-azurepowershell, mode-api
#Customer intent: I want to use PowerShell to create a virtual network so that virtual machines can communicate privately with each other and with the internet.
---

# Quickstart: Use Azure PowerShell to create a virtual network

This quickstart shows you how to create a virtual network by using Azure PowerShell. You then create two virtual machines (VMs) in the network, securely connect to the VMs from the internet, and communicate privately between the VMs.

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

:::image type="content" source="./media/quick-create-portal/virtual-network-qs-resources.png" alt-text="Diagram of resources created in virtual network quickstart.":::

## Prerequisites

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

  The steps in this quickstart run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  If you run PowerShell locally, run `Connect-AzAccount` to connect to Azure.

## Create a resource group

1. Use [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) to create a resource group to host the virtual network. Run the following code to create a resource group named **test-rg** in the **eastus2** Azure region.

    ```azurepowershell-interactive
    $rg = @{
        Name = 'test-rg'
        Location = 'eastus2'
    }
    New-AzResourceGroup @rg
    ```

## Create a virtual network

   
1. Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create a virtual network named **vnet-1** with IP address prefix **10.0.0.0/16** in the **test-rg** resource group and **eastus2** location.

    ```azurepowershell-interactive
    $vnet = @{
        Name = 'vnet-1'
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        AddressPrefix = '10.0.0.0/16'
    }
    $virtualNetwork = New-AzVirtualNetwork @vnet
   ```

1. Azure deploys resources to a subnet within a virtual network. Use [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) to create a subnet configuration named **subnet-1** with address prefix **10.0.0.0/24**.

    ```azurepowershell-interactive
    $subnet = @{
        Name = 'subnet-1'
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

 [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

1. Configure an Azure Bastion subnet for your virtual network. This subnet is reserved exclusively for Azure Bastion resources and must be named **AzureBastionSubnet**.

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
    $ip = @{
            ResourceGroupName = 'test-rg'
            Name = 'public-ip'
            Location = 'eastus2'
            AllocationMethod = 'Static'
            Sku = 'Standard'
            Zone = 1,2,3
    }
    New-AzPublicIpAddress @ip
    ```

1. Use the [New-AzBastion](/powershell/module/az.network/new-azbastion) command to create a new Standard SKU Azure Bastion host in the AzureBastionSubnet.

    ```azurepowershell-interactive
    $bastion = @{
        Name = 'bastion'
        ResourceGroupName = 'test-rg'
        PublicIpAddressRgName = 'test-rg'
        PublicIpAddressName = 'public-ip'
        VirtualNetworkRgName = 'test-rg'
        VirtualNetworkName = 'vnet-1'
        Sku = 'Basic'
    }
    New-AzBastion @bastion
    ```

It takes about 10 minutes for the Bastion resources to deploy. You can create VMs in the next section while Bastion deploys to your virtual network.

## Create virtual machines

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create two VMs named **vm-1** and **vm-2** in the **subnet-1** subnet of the virtual network. When you're prompted for credentials, enter user names and passwords for the VMs.

1. To create the first VM, use the following code:

    ```azurepowershell-interactive
    # Set the administrator and password for the VMs. ##
    $cred = Get-Credential

    ## Place the virtual network into a variable. ##
    $vnet = Get-AzVirtualNetwork -Name 'vnet-1' -ResourceGroupName 'test-rg'

    ## Create network interface for virtual machine. ##
    $nic = @{
        Name = "nic-1"
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        Subnet = $vnet.Subnets[0]
    }
    $nicVM = New-AzNetworkInterface @nic

    ## Create a virtual machine configuration for VMs ##
    $vmsz = @{
        VMName = "vm-1"
        VMSize = 'Standard_DS1_v2'  
    }
    $vmos = @{
        ComputerName = "vm-1"
        Credential = $cred
    }
    $vmimage = @{
        PublisherName = 'Canonical'
        Offer = '0001-com-ubuntu-server-jammy'
        Skus = '22_04-lts-gen2'
        Version = 'latest'    
    }
    $vmConfig = New-AzVMConfig @vmsz `
        | Set-AzVMOperatingSystem @vmos -Linux `
        | Set-AzVMSourceImage @vmimage `
        | Add-AzVMNetworkInterface -Id $nicVM.Id

    ## Create the virtual machine for VMs ##
    $vm = @{
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        VM = $vmConfig
    }
    New-AzVM @vm
    ```

1. To create the second VM, use the following code:

    ```azurepowershell-interactive
    # Set the administrator and password for the VMs. ##
    $cred = Get-Credential

    ## Place the virtual network into a variable. ##
    $vnet = Get-AzVirtualNetwork -Name 'vnet-1' -ResourceGroupName 'test-rg'

    ## Create network interface for virtual machine. ##
    $nic = @{
        Name = "nic-2"
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        Subnet = $vnet.Subnets[0]
    }
    $nicVM = New-AzNetworkInterface @nic

    ## Create a virtual machine configuration for VMs ##
    $vmsz = @{
        VMName = "vm-2"
        VMSize = 'Standard_DS1_v2'  
    }
    $vmos = @{
        ComputerName = "vm-2"
        Credential = $cred
    }
    $vmimage = @{
        PublisherName = 'Canonical'
        Offer = '0001-com-ubuntu-server-jammy'
        Skus = '22_04-lts-gen2'
        Version = 'latest'    
    }
    $vmConfig = New-AzVMConfig @vmsz `
        | Set-AzVMOperatingSystem @vmos -Linux `
        | Set-AzVMSourceImage @vmimage `
        | Add-AzVMNetworkInterface -Id $nicVM.Id

    ## Create the virtual machine for VMs ##
    $vm = @{
        ResourceGroupName = 'test-rg'
        Location = 'eastus2'
        VM = $vmConfig
    }
    New-AzVM @vm
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

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Connect to a virtual machine

1. In the portal, search for and select **Virtual machines**.

1. On the **Virtual machines** page, select **vm-1**.

1. In the **Overview** of **vm-1**, select **Connect**.

1. In the **Connect to virtual machine** page, select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password you created when you created the VM, and then select **Connect**.

## Communicate between VMs

1. At the bash prompt for **vm-1**, enter `ping -c 4 vm-2`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-1:~$ ping -c 4 vm-2
    PING vm-2.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.5) 56(84) bytes of data.
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=1 ttl=64 time=1.83 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=2 ttl=64 time=0.987 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=3 ttl=64 time=0.864 ms
    64 bytes from vm-2.internal.cloudapp.net (10.0.0.5): icmp_seq=4 ttl=64 time=0.890 ms
    ```

1. Close the Bastion connection to VM1.

1. Repeat the steps in [Connect to a virtual machine](#connect-to-a-virtual-machine) to connect to VM2.

1. At the bash prompt for **vm-2**, enter `ping -c 4 vm-1`.

   You get a reply similar to the following message:

    ```output
    azureuser@vm-2:~$ ping -c 4 vm-1
    PING vm-1.3bnkevn3313ujpr5l1kqop4n4d.cx.internal.cloudapp.net (10.0.0.4) 56(84) bytes of data.
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=1 ttl=64 time=0.695 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=2 ttl=64 time=0.896 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=3 ttl=64 time=3.43 ms
    64 bytes from vm-1.internal.cloudapp.net (10.0.0.4): icmp_seq=4 ttl=64 time=0.780 ms
    ```

1. Close the Bastion connection to VM2.

## Clean up resources

When you're done with the virtual network and the VMs, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all its resources.

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'test-rg' -Force
```

## Next steps

In this quickstart, you created a virtual network with a default subnet that contains two VMs. You deployed Azure Bastion and used it to connect to the VMs, and securely communicated between the VMs. To learn more about virtual network settings, see [Create, change, or delete a virtual network](manage-virtual-network.md).

Private communication between VMs in a virtual network is unrestricted. Continue to the next article to learn more about configuring different types of VM network communications.
> [!div class="nextstepaction"]
> [Filter network traffic](tutorial-filter-network-traffic.md)
