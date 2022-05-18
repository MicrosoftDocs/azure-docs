---
title: 'Quickstart: Create a private endpoint by using Azure PowerShell'
description: In this quickstart, you'll learn how to create a private endpoint by using Azure PowerShell.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 04/22/2022
ms.author: allensu
ms.custom: devx-track-azurepowershell, mode-api
#Customer intent: As someone who has a basic network background but is new to Azure, I want to create a private endpoint by using Azure PowerShell.
---
# Quickstart: Create a private endpoint by using Azure PowerShell

Get started with Azure Private Link by using a private endpoint to connect securely to an Azure web app.

In this quickstart, you'll create a private endpoint for an Azure web app and then create and deploy a virtual machine (VM) to test the private connection.  

You can create private endpoints for a variety of Azure services, such as Azure SQL and Azure Storage.

## Prerequisites

* An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An Azure web app with a *PremiumV2-tier* or higher app service plan, deployed in your Azure subscription.  

    For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    
    For a detailed tutorial on creating a web app and an endpoint, see [Tutorial: Connect to a web app by using a private endpoint](tutorial-private-endpoint-webapp-portal.md).

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install the Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
New-AzResourceGroup -Name 'CreatePrivateEndpointQS-rg' -Location 'eastus'
```

## Create a virtual network and bastion host

First, you'll create a virtual network, subnet, and bastion host. 

You'll use the bastion host to connect securely to the VM for testing the private endpoint.

1. Create a virtual network and bastion host with:

   * [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork)
   * [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress)
   * [New-AzBastion](/powershell/module/az.network/new-azbastion)

1. Configure the back-end subnet.

   ```azurepowershell-interactive
   $subnetConfig = New-AzVirtualNetworkSubnetConfig -Name myBackendSubnet -AddressPrefix 10.0.0.0/24
   ```

1. Create the Azure Bastion subnet:

    ```azurepowershell-interactive
    $bastsubnetConfig = New-AzVirtualNetworkSubnetConfig -Name AzureBastionSubnet -AddressPrefix 10.0.1.0/24
    ```

1. Create the virtual network:

    ```azurepowershell-interactive
    $parameters1 = @{
        Name = 'MyVNet'
        ResourceGroupName = 'CreatePrivateEndpointQS-rg'
        Location = 'eastus'
        AddressPrefix = '10.0.0.0/16'
        Subnet = $subnetConfig, $bastsubnetConfig
    }
    $vnet = New-AzVirtualNetwork @parameters1
    ```

1. Create the public IP address for the bastion host:

    ```azurepowershell-interactive
    $parameters2 = @{
        Name = 'myBastionIP'
        ResourceGroupName = 'CreatePrivateEndpointQS-rg'
        Location = 'eastus'
        Sku = 'Standard'
        AllocationMethod = 'Static'
    }
    $publicip = New-AzPublicIpAddress @parameters2
    ```

1. Create the bastion host:

    ```azurepowershell-interactive
    $parameters3 = @{
        ResourceGroupName = 'CreatePrivateEndpointQS-rg'
        Name = 'myBastion'
        PublicIpAddress = $publicip
        VirtualNetwork = $vnet
    }
    New-AzBastion @parameters3
    ```

It can take a few minutes for the Azure Bastion host to deploy.

## Create a test virtual machine

Next, create a VM that you can use to test the private endpoint.

1. Create the VM by using:

    * [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential)
    * [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) 
    * [New-AzVM](/powershell/module/az.compute/new-azvm)
    * [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig)
    * [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem)
    * [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage)
    * [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)


1. Get the server admin credentials and password:

    ```azurepowershell-interactive
    $cred = Get-Credential
    ```

1. Get the virtual network configuration:

    ```azurepowershell-interactive
    $vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName CreatePrivateEndpointQS-rg
    ```

1. Create a network interface for the VM:

    ```azurepowershell-interactive
    $parameters1 = @{
        Name = 'myNicVM'
        ResourceGroupName = 'CreatePrivateEndpointQS-rg'
        Location = 'eastus'
        Subnet = $vnet.Subnets[0]
    }
    $nicVM = New-AzNetworkInterface @parameters1
    ```

1. Configure the VM:

    ```azurepowershell-interactive
    $parameters2 = @{
        VMName = 'myVM'
        VMSize = 'Standard_DS1_v2'
    }
    $parameters3 = @{
        ComputerName = 'myVM'
        Credential = $cred
    }
    $parameters4 = @{
        PublisherName = 'MicrosoftWindowsServer'
        Offer = 'WindowsServer'
        Skus = '2019-Datacenter'
        Version = 'latest'
    }
    $vmConfig = 
    New-AzVMConfig @parameters2 | Set-AzVMOperatingSystem -Windows @parameters3 | Set-AzVMSourceImage @parameters4 | Add-AzVMNetworkInterface -Id $nicVM.Id
    ```

1. Create the VM:

    ```azurepowershell-interactive
    New-AzVM -ResourceGroupName 'CreatePrivateEndpointQS-rg' -Location 'eastus' -VM $vmConfig
    ```

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create a private endpoint

1. Create a private endpoint and connection by using:

    * [New-AzPrivateLinkServiceConnection](/powershell/module/az.network/New-AzPrivateLinkServiceConnection)
    * [New-AzPrivateEndpoint](/powershell/module/az.network/new-azprivateendpoint)

1. Place the web app into a variable. Replace \<webapp-resource-group-name> with the resource group name of your web app, and replace \<your-webapp-name> with your web app name.

    ```azurepowershell-interactive
    $webapp = Get-AzWebApp -ResourceGroupName <webapp-resource-group-name> -Name <your-webapp-name>
    ```

1. Create the private endpoint connection:

    ```azurepowershell-interactive
    $parameters1 = @{
        Name = 'myConnection'
        PrivateLinkServiceId = $webapp.ID
        GroupID = 'sites'
    }
    $privateEndpointConnection = New-AzPrivateLinkServiceConnection @parameters1
    ```

1. Place the virtual network into a variable:

    ```azurepowershell-interactive
    $vnet = Get-AzVirtualNetwork -ResourceGroupName 'CreatePrivateEndpointQS-rg' -Name 'myVNet'
    ```

1. Disable the private endpoint network policy:

    ```azurepowershell-interactive
    $vnet.Subnets[0].PrivateEndpointNetworkPolicies = "Disabled"
    $vnet | Set-AzVirtualNetwork
    ```

1. Create the private endpoint:

    ```azurepowershell-interactive
    $parameters2 = @{
        ResourceGroupName = 'CreatePrivateEndpointQS-rg'
        Name = 'myPrivateEndpoint'
        Location = 'eastus'
        Subnet = $vnet.Subnets[0]
        PrivateLinkServiceConnection = $privateEndpointConnection
    }
    New-AzPrivateEndpoint @parameters2
    ```
## Configure the private DNS zone

1. Create and configure the private DNS zone by using:

    * [New-AzPrivateDnsZone](/powershell/module/az.privatedns/new-azprivatednszone)
    * [New-AzPrivateDnsVirtualNetworkLink](/powershell/module/az.privatedns/new-azprivatednsvirtualnetworklink)
    * [New-AzPrivateDnsZoneConfig](/powershell/module/az.network/new-azprivatednszoneconfig)
    * [New-AzPrivateDnsZoneGroup](/powershell/module/az.network/new-azprivatednszonegroup)

1. Place the virtual network into a variable:

    ```azurepowershell-interactive
    $vnet = Get-AzVirtualNetwork -ResourceGroupName 'CreatePrivateEndpointQS-rg' -Name 'myVNet'
    ```

1. Create the private DNS zone:

    ```azurepowershell-interactive
    $parameters1 = @{
        ResourceGroupName = 'CreatePrivateEndpointQS-rg'
        Name = 'privatelink.azurewebsites.net'
    }
    $zone = New-AzPrivateDnsZone @parameters1
    ```

1. Create a DNS network link:

    ```azurepowershell-interactive
    $parameters2 = @{
        ResourceGroupName = 'CreatePrivateEndpointQS-rg'
        ZoneName = 'privatelink.azurewebsites.net'
        Name = 'myLink'
        VirtualNetworkId = $vnet.Id
    }
    $link = New-AzPrivateDnsVirtualNetworkLink @parameters2
    ```

1. Configure the DNS zone:

    ```azurepowershell-interactive
    $parameters3 = @{
        Name = 'privatelink.azurewebsites.net'
        PrivateDnsZoneId = $zone.ResourceId
    }
    $config = New-AzPrivateDnsZoneConfig @parameters3
    ```

1. Create the DNS zone group:

    ```azurepowershell-interactive
    $parameters4 = @{
        ResourceGroupName = 'CreatePrivateEndpointQS-rg'
        PrivateEndpointName = 'myPrivateEndpoint'
        Name = 'myZoneGroup'
        PrivateDnsZoneConfig = $config
    }
    New-AzPrivateDnsZoneGroup @parameters4
    ```

## Test connectivity with the private endpoint

Finally, use the VM you created in the previous step to connect to the SQL server across the private endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com). 
 
1. On the left pane, select **Resource groups**.

1. Select **CreatePrivateEndpointQS-rg**.

1. Select **myVM**.

1. On the overview page for **myVM**, select **Connect**, and then select **Bastion**.

1. Select the blue **Use Bastion** button.

1. Enter the username and password that you used when you created the VM.

1. After you've connected, open PowerShell on the server.

1. Enter `nslookup <your-webapp-name>.azurewebsites.net`. Replace **\<your-webapp-name>** with the name of the web app that you created earlier.  You'll receive a message that's similar to the following:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp8675.privatelink.azurewebsites.net
    Address:  10.0.0.5
    Aliases:  mywebapp8675.azurewebsites.net
    ```

    A private IP address of *10.0.0.5* is returned for the web app name. This address is in the subnet of the virtual network that you created earlier.

1. In the bastion connection to **myVM**, open your web browser.

1. Enter the URL of your web app, **https://\<your-webapp-name>.azurewebsites.net**.

   If your web app hasn't been deployed, you'll get the following default web app page:

    :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Screenshot of the default web app page on a browser." border="true":::

1. Close the connection to **myVM**.

## Clean up resources 
When you're done using the private endpoint and the VM, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all the resources within it:

```azurepowershell-interactive
Remove-AzResourceGroup -Name CreatePrivateEndpointQS-rg -Force
```

## What you've learned

In this quickstart, you created:

* A virtual network and bastion host
* A virtual machine
* A private endpoint for an Azure web app

You used the VM to securely test connectivity to the web app across the private endpoint.

## Next steps

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
