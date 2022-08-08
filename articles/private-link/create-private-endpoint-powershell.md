---
title: 'Quickstart: Create a private endpoint by using Azure PowerShell'
description: In this quickstart, you'll learn how to create a private endpoint by using Azure PowerShell.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 05/24/2022
ms.author: allensu
ms.custom: devx-track-azurepowershell, mode-api
#Customer intent: As someone who has a basic network background but is new to Azure, I want to create a private endpoint by using Azure PowerShell.
---
# Quickstart: Create a private endpoint by using Azure PowerShell

Get started with Azure Private Link by using a private endpoint to connect securely to an Azure web app.

In this quickstart, you'll create a private endpoint for an Azure web app and then create and deploy a virtual machine (VM) to test the private connection.  

You can create private endpoints for various Azure services, such as Azure SQL and Azure Storage.

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure web app with a *PremiumV2-tier* or higher app service plan, deployed in your Azure subscription.  

    - For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    
    - The example webapp in this article is named **myWebApp1979**. Replace the example with your webapp name.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install the Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
New-AzResourceGroup -Name 'CreatePrivateEndpointQS-rg' -Location 'eastus'
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
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
    Location = 'eastus'
    AddressPrefix = '10.0.0.0/16'
    Subnet = $subnetConfig, $bastsubnetConfig
}
$vnet = New-AzVirtualNetwork @net

## Create the public IP address for the bastion host. ##
$ip = @{
    Name = 'myBastionIP'
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
    Location = 'eastus'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    Zone = 1,2,3
}
$publicip = New-AzPublicIpAddress @ip

## Create the bastion host. ##
$bastion = @{
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
    Name = 'myBastion'
    PublicIpAddress = $publicip
    VirtualNetwork = $vnet
}
New-AzBastion @bastion -AsJob
```

## Create a private endpoint

An Azure service that supports private endpoints is required to set up the private endpoint and connection to the virtual network. For the examples in this article, we're using an Azure WebApp from the prerequisites. For more information on the Azure services that support a private endpoint, see [Azure Private Link availability](availability.md).

A private endpoint can have a static or dynamically assigned IP address.

> [!IMPORTANT]
> You must have a previously deployed Azure WebApp to proceed with the steps in this article. For more information, see [Prerequisites](#prerequisites).

In this section, you'll:

- Create a private link service connection with [New-AzPrivateLinkServiceConnection](/powershell/module/az.network/new-azprivatelinkserviceconnection).

- Create the private endpoint with [New-AzPrivateEndpoint](/powershell/module/az.network/new-azprivateendpoint).

- Optionally create the private endpoint static IP configuration with [New-AzPrivateEndpointIpConfiguration](/powershell/module/az.network/new-azprivateendpointipconfiguration).

# [**Dynamic IP**](#tab/dynamic-ip)

```azurepowershell-interactive
## Place the previously created webapp into a variable. ##
$webapp = Get-AzWebApp -ResourceGroupName CreatePrivateEndpointQS-rg -Name myWebApp1979

## Create the private endpoint connection. ## 
$pec = @{
    Name = 'myConnection'
    PrivateLinkServiceId = $webapp.ID
    GroupID = 'sites'
}
$privateEndpointConnection = New-AzPrivateLinkServiceConnection @pec

## Place the virtual network you created previously into a variable. ##
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'CreatePrivateEndpointQS-rg' -Name 'myVNet'

## Create the private endpoint. ##
$pe = @{
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
    Name = 'myPrivateEndpoint'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
    PrivateLinkServiceConnection = $privateEndpointConnection
}
New-AzPrivateEndpoint @pe

```

# [**Static IP**](#tab/static-ip)

```azurepowershell-interactive
## Place the previously created webapp into a variable. ##
$webapp = Get-AzWebApp -ResourceGroupName CreatePrivateEndpointQS-rg -Name myWebApp1979

## Create the private endpoint connection. ## 
$pec = @{
    Name = 'myConnection'
    PrivateLinkServiceId = $webapp.ID
    GroupID = 'sites'
}
$privateEndpointConnection = New-AzPrivateLinkServiceConnection @pec

## Place the virtual network you created previously into a variable. ##
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'CreatePrivateEndpointQS-rg' -Name 'myVNet'

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
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
    Name = 'myPrivateEndpoint'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
    PrivateLinkServiceConnection = $privateEndpointConnection
    IpConfiguration = $ipconfig
}
New-AzPrivateEndpoint @pe

```

---

## Configure the private DNS zone

A private DNS zone is used to resolve the DNS name of the private endpoint in the virtual network. For this example, we're using the DNS information for an Azure WebApp, for more information on the DNS configuration of private endpoints, see [Azure Private Endpoint DNS configuration](private-endpoint-dns.md).

In this section, you'll:

- Create a new private Azure DNS zone with [New-AzPrivateDnsZone](/powershell/module/az.privatedns/new-azprivatednszone)

- Link the DNS zone to the virtual network you created previously with [New-AzPrivateDnsVirtualNetworkLink](/powershell/module/az.privatedns/new-azprivatednsvirtualnetworklink)

- Create a DNS zone configuration with [New-AzPrivateDnsZoneConfig](/powershell/module/az.network/new-azprivatednszoneconfig)

- Create a DNS zone group with [New-AzPrivateDnsZoneGroup](/powershell/module/az.network/new-azprivatednszonegroup)

```azurepowershell-interactive
## Place the virtual network into a variable. ##
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'CreatePrivateEndpointQS-rg' -Name 'myVNet'

## Create the private DNS zone. ##
$zn = @{
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
    Name = 'privatelink.azurewebsites.net'
}
$zone = New-AzPrivateDnsZone @zn

## Create a DNS network link. ##
$lk = @{
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
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
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
    PrivateEndpointName = 'myPrivateEndpoint'
    Name = 'myZoneGroup'
    PrivateDnsZoneConfig = $config
}
New-AzPrivateDnsZoneGroup @zg

```

## Create a test virtual machine

To verify the static IP address and the functionality of the private endpoint, a test virtual machine connected to your virtual network is required.

In this section, you'll:

- Create a sign-in credential for the virtual machine with [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential)

- Create a network interface for the virtual machine with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface)

- Create a virtual machine configuration with [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig), [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem), [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage), and [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)

- Create the virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm)

```azurepowershell-interactive
## Create the credential for the virtual machine. Enter a username and password at the prompt. ##
$cred = Get-Credential

## Place the virtual network into a variable. ##
$vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName CreatePrivateEndpointQS-rg

## Create a network interface for the virtual machine. ##
$nic = @{
    Name = 'myNicVM'
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
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
New-AzVM -ResourceGroupName 'CreatePrivateEndpointQS-rg' -Location 'eastus' -VM $vmConfig

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

7. Enter `nslookup mywebapp1979.azurewebsites.net`. Replace **mywebapp1979** with the name of the web app that you created earlier. You'll receive a message that's similar to the following example:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp1979.privatelink.azurewebsites.net
    Address:  10.0.0.10
    Aliases:  mywebapp1979.azurewebsites.net
    ```

8. In the bastion connection to **myVM**, open the web browser.

9. Enter the URL of your web app, ``https://mywebapp1979.azurewebsites.net``.

   If your web app hasn't been deployed, you'll get the following default web app page:

   :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Screenshot of the default web app page on a browser." border="true":::

10. Close the connection to **myVM**.

## Next steps

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
