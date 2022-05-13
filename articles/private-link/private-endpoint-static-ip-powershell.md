---
title: Create a private endpoint with a static IP address - PowerShell
titleSuffix: Azure Private Link
description: Learn how to create a private endpoint for an Azure service with a static private IP address.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: how-to
ms.date: 05/13/2022
ms.custom:
---

# Create a private endpoint with a static IP address using PowerShell

 A private endpoint IP address is allocated by DHCP in your virtual network by default. In this article, you'll create a private endpoint with a static IP address.

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure web app with a **PremiumV2-tier** or higher app service plan, deployed in your Azure subscription.  

   - For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
   
   - The example webapp in this article is named **myWebApp1979**. Replace the example with your webapp name.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install the Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
New-AzResourceGroup -Name 'myResourceGroup' -Location 'eastus'
```

## Create a virtual network and bastion host

A virtual network and subnet is required for to host the private IP address for the private endpoint. You'll create a bastion host to connect securely to the virtual machine to test the private endpoint. You'll create the virtual machine in a later section.

In this section, you'll:

- Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork)

- Create subnet configurations for the backend subnet and the bastion subnet with [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig)

- Create a public IP address for the bastion host with [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress)

- Create the bastion host with [New-AzBastion](/powershell/module/az.network/new-azbastion)

```azurepowershell-interactive
## Configure the back-end subnet. ##
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name myBackendSubnet -AddressPrefix 10.0.0.0/24

## Create the Azure Bastion subnet. ##
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig -Name AzureBastionSubnet -AddressPrefix 10.0.1.0/24

## Create the virtual network. ##
$net = @{
    Name = 'MyVNet'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus'
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnetConfig, $bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net

## Create the public IP address for the bastion host. ##
$ip = @{
    Name = 'myBastionIP'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    Zone = 1,2,3
}
$publicip = New-AzPublicIpAddress @ip

## Create the bastion host. ##
$bastion = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myBastion'
    PublicIpAddress = $publicip
    VirtualNetwork = $vnet
}
New-AzBastion @bastion -AsJob
```

## Create a private endpoint

An Azure service that supports private endpoints is required to setup the private endpoint and connection to the virtual network. For the examples in this article, we are using an Azure WebApp from the prerequisites. For more information on the Azure services that support a private endpoint, see [Azure Private Link availability](availability.md).

> [!IMPORTANT]
> You must have a previously deployed Azure WebApp to proceed with the steps in this article. See [Prerequisites](#prerequisites) for more information.

In this section, you'll:

- Create a private link service connection with [New-AzPrivateLinkServiceConnection](/powershell/module/az.network/new-azprivatelinkserviceconnection).

- Create the private endpoint static IP configuration with [New-AzPrivateEndpointIpConfiguration](/powershell/module/az.network/new-azprivateendpointipconfiguration).

- Create the private endpoint with [New-AzPrivateEndpoint](/powershell/module/az.network/new-azprivateendpoint).

```azurepowershell-interactive
## Place the previously created webapp into a variable. ##
$webapp = Get-AzWebApp -ResourceGroupName myResourceGroup -Name myWebApp1979

## Create the private endpoint connection. ## 
$pec = @{
    Name = 'myConnection'
    PrivateLinkServiceId = $webapp.ID
    GroupID = 'sites'
}
$privateEndpointConnection = New-AzPrivateLinkServiceConnection @pec

## Place the virtual network you created previously into a variable. ##
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'myResourceGroup' -Name 'myVNet'

## Disable the private endpoint network policy. ##
$vnet.Subnets[0].PrivateEndpointNetworkPolicies = "Disabled"
$vnet | Set-AzVirtualNetwork

## Create the static IP configuration. ##
$ip = @{
    Name = 'myIPconfig'
    GroupId = 'sites'
    MemberName = 'sites'
    PrivateIPAddress = '10.0.0.10'
}
$ipconfig = New-AzPrivateEndpointIpConfiguration @ip

## Create the private endpoint. ##
$pe = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myPrivateEndpoint'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
    PrivateLinkServiceConnection = $privateEndpointConnection
    IpConfiguration = $ipconfig
}
New-AzPrivateEndpoint @pe

```

## Configure the private DNS zone

A private DNS zone is used to resolve the DNS name of the private endpoint in the virtual network. For this example, we are using the DNS information for an Azure WebApp, for more information on the DNS configuration of private endpoints, see [Azure Private Endpoint DNS configuration](private-endpoint-dns.md)].

In this section, you'll:

- Create a new private Azure DNS zone with [New-AzPrivateDnsZone](/powershell/module/az.privatedns/new-azprivatednszone)

- Link the DNS zone to the virtual network you created previously with [New-AzPrivateDnsVirtualNetworkLink](/powershell/module/az.privatedns/new-azprivatednsvirtualnetworklink)

- Create a DNS zone configuration with [New-AzPrivateDnsZoneConfig](/powershell/module/az.network/new-azprivatednszoneconfig)

- Create a DNS zone group with [New-AzPrivateDnsZoneGroup](/powershell/module/az.network/new-azprivatednszonegroup)

```azurepowershell-interactive
## Place the virtual network into a variable. ##
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'myResourceGroup' -Name 'myVNet'

## Create the private DNS zone. ##
$zn = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'privatelink.azurewebsites.net'
}
$zone = New-AzPrivateDnsZone @zn

## Create a DNS network link. ##
$lk = @{
    ResourceGroupName = 'myResourceGroup'
    ZoneName = 'privatelink.azurewebsites.net'
    Name = 'myLink'
    VirtualNetworkId = $vnet.Id
}
$link = New-AzPrivateDnsVirtualNetworkLink @lk

## Configure the DNS zone. ##
$cg = @{
    Name = 'privatelink.azurewebsites.net'
    PrivateDnsZoneId = $zone.ResourceId
}
$config = New-AzPrivateDnsZoneConfig @cg

## Create the DNS zone group. ##
$zg = @{
    ResourceGroupName = 'myResourceGroup'
    PrivateEndpointName = 'myPrivateEndpoint'
    Name = 'myZoneGroup'
    PrivateDnsZoneConfig = $config
}
New-AzPrivateDnsZoneGroup @zg

```

## Create a test virtual machine

To verify the static IP address and the functionality of the private endpoint, a test virtual machine connected to your virtual network is required.

In this section, you'll:

- Create a login credential for the virtual machine with [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential)

- Create a network interface for the virtual machine with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface)

- Create a virtual machine configuration with [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig), [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem), [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage), and [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)

- Create the virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm)

```azurepowershell-interactive
## Create the credential for the virtual machine. Enter a username and password at the prompt. ##
$cred = Get-Credential

## Place the virtual network into a variable. ##
$vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName myResourceGroup

## Create a network interface for the virtual machine. ##
$nic = @{
    Name = 'myNicVM'
    ResourceGroupName = 'myResourceGroup'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
}
$nicVM = New-AzNetworkInterface @nic

## Create the configuration for the virtual machine. ##
$vm1 = @{
    VMName = 'myVM'
    VMSize = 'Standard_DS1_v2'
}
$vm2 = @{
    ComputerName = 'myVM'
    Credential = $cred
}
$vm3 = @{
    PublisherName = 'MicrosoftWindowsServer'
    Offer = 'WindowsServer'
    Skus = '2019-Datacenter'
    Version = 'latest'
}
$vmConfig = 
New-AzVMConfig @vm1 | Set-AzVMOperatingSystem -Windows @vm2 | Set-AzVMSourceImage @vm3 | Add-AzVMNetworkInterface -Id $nicVM.Id

## Create the virtual machine. ##
New-AzVM -ResourceGroupName 'myResourceGroup' -Location 'eastus' -VM $vmConfig

```

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Test connectivity with the private endpoint

Use the VM you created in the previous step to connect to the webapp across the private endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com). 
 
2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines**.

3. Select **myVM**.

4. On the overview page for **myVM**, select **Connect**, and then select **Bastion**.

5. Enter the username and password that you used when you created the VM. Select **Connect**.

6. After you've connected, open PowerShell on the server.

7. Enter `nslookup mywebapp1979.azurewebsites.net`. Replace **mywebapp1979** with the name of the web app that you created earlier. You'll receive a message that's similar to the following:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp1979.privatelink.azurewebsites.net
    Address:  10.0.0.10
    Aliases:  mywebapp1979.azurewebsites.net
    ```

    A static private IP address of *10.0.0.10* is returned for the web app name.

8. In the bastion connection to **myVM**, open the web browser.

9. Enter the URL of your web app, **https://mywebapp1979.azurewebsites.net**.

   If your web app hasn't been deployed, you'll get the following default web app page:

   :::image type="content" source="./media/private-endpoint-static-ip-powershell/web-app-default-page.png" alt-text="Screenshot of the default web app page on a browser." border="true":::

10. Close the connection to **myVM**.

## Next steps

To learn more about Private Link and Private endpoints, see

- [What is Azure Private Link](private-link-overview.md)

- [Private endpoint overview](private-endpoint-overview.md)



