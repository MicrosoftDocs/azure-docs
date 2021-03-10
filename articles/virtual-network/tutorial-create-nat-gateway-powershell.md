---
title: 'Tutorial: Create a NAT gateway - PowerShell'
titlesuffix: Azure Virtual Network NAT
description: Get started created a NAT gateway using Azure PowerShell.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: nat
ms.topic: tutorial 
ms.date: 03/09/2021
ms.custom: template-tutorial
---

# Tutorial: Create a NAT gateway using Azure PowerShell

This tutorial shows you how to use Azure Virtual Network NAT service. You'll create a NAT gateway to provide outbound connectivity for a virtual machine in Azure. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network.
> * Create a virtual machine.
> * Create a NAT gateway and associate with the virtual network.
> * Connect to virtual machine and verify NAT IP address.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **myResourceGroupNAT** in the **eastus2** location:

```azurepowershell-interactive
$rsg = @{
    Name = 'myResourceGroupNAT'
    Location = 'eastus2'
}
  New-AzResourceGroup @rsg
```
## Create the NAT gateway

In this section we create the NAT gateway and supporting resources.

* To access the Internet, you need one or more public IP addresses for the NAT gateway. Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a public IP address resource named **myPublicIP** in **myResourceGroupNAT**. 

* Create a global Azure NAT gateway with [New-AzNatGateway](/powershell/module/az.network/new-aznatgateway). The result of this command will create a gateway resource named **myNATgateway** that uses the public IP address **myPublicIP**. The idle timeout is set to 10 minutes.  

* Create a virtual network named **myVnet** with a subnet named **mySubnet** using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) in the **myResourceGroup** using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The IP address space for the virtual network is **10.1.0.0/16**. The subnet within the virtual network is **10.1.0.0/24**.

* Create an Azure Bastion host named **myBastionHost** using [New-AzBastion](/powershell/module/az.network/new-azbastion) to access the virtual machine. Create a public IP address for the bastion host with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

```azurepowershell-interactive
## Create public IP address for NAT gateway ##
$ip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'myResourceGroupNAT'
    Location = 'eastus2'
    Sku = 'Standard'
}
$publicIP = New-AzPublicIpAddress @ip

## Create NAT gateway resource ##
$nat = @{
    ResourceGroupName = 'myResourceGroupNAT'
    Name = 'myNATgateway'
    IdleTimeoutInMinutes = '10'
    Sku = 'Standard'
    Location = 'eastus2'
    PublicIpAddress = $publicIP
}
$natGateway = New-AzNatGateway @nat

## Create subnet config and associate NAT gateway to subnet ##
$subnet = @{
    Name = 'mySubnet'
    AddressPrefix = '10.1.0.0/24'
    NatGateway = $natGateway
}
$subnetConfig = New-AzVirtualNetworkSubnetConfig @subnet 

## Create Azure Bastion subnet. ##
$bastsubnet = @{
    Name = 'AzureBastionSubnet' 
    AddressPrefix = '10.1.1.0/24'
}
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig @bastsubnet

## Create the virtual network ##
$net = @{
    Name = 'myVNet'
    ResourceGroupName = 'myResourceGroupNAT'
    Location = 'eastus'
    AddressPrefix = '10.1.0.0/16'
    Subnet = $subnetConfig,$bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net

## Create public IP address for bastion host. ##
$ip = @{
    Name = 'myBastionIP'
    ResourceGroupName = 'myResourceGroupNAT'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'Static'
}
$publicip = New-AzPublicIpAddress @ip

## Create bastion host ##
$bastion = @{
    ResourceGroupName = 'myResourceGroupNAT'
    Name = 'myBastion'
    PublicIpAddress = $publicip
    VirtualNetwork = $vnet
}
New-AzBastion @bastion -AsJob

```

## Virtual machine

In this section, you'll create a virtual machine to test the NAT gateway and verify the public IP address of the outbound connection.

* Create the virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm).
    
```azurepowershell-interactive
## Create virtual machine to test the NAT gateway ##
$vm = @{
    ResourceGroupName = 'myResourceGroupNAT'
    Location = 'eastus2'
    Name = 'myVM'
    VirtualNetworkName = 'myVNet'
    SubnetName = 'mySubnet'
}
New-AzVM @vm
```

Wait for the virtual machine creation to complete before moving on to the next section.

## Test NAT gateway

In this section, we'll test the NAT gateway. We'll first discover the public IP of the NAT gateway. We'll then connect to the test virtual machine and verify the outbound connection through the NAT gateway.
    
1. Sign in to the [Azure Portal](https://portal.azure.com)

1. Find the public IP address for the NAT gateway on the **Overview** screen. Select **All services** in the left-hand menu, select **All resources**, and then select **myPublicIP**.

2. Make note of the public IP address:

    :::image type="content" source="./media/tutorial-create-nat-gateway-portal/find-public-ip.png" alt-text="Discover public IP address of NAT gateway" border="true":::

3. Select **All services** in the left-hand menu, select **All resources**, and then from the resources list, select **myVM** that is located in the **myResourceGroupNAT** resource group.

4. On the **Overview** page, select **Connect**, then **Bastion**.

5. Select the blue **Use Bastion** button.

6. Enter the username and password entered during VM creation.

7. Open **Internet Explorer** on **myTestVM**.

8. Enter **https://whatsmyip.com** in the address bar.

9. Verify the IP address displayed matches the NAT gateway address you noted in the previous step:

    :::image type="content" source="./media/tutorial-create-nat-gateway-portal/my-ip.png" alt-text="Internet Explorer showing external outbound IP" border="true":::

## Clean up resources

If you're not going to continue to use this application, delete
the virtual network, virtual machine, and NAT gateway with the following steps:

1. From the left-hand menu, select **Resource groups**.

2. Select the **myResourceGroupNAT** resource group.

3. Select **Delete resource group**.

4. Enter **myResourceGroupNAT** and select **Delete**.

## Next steps

For more information on Azure Virtual Network NAT, see:
> [!div class="nextstepaction"]
> [Virtual Network NAT overview](nat-overview.md)
