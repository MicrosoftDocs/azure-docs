---
title: Create a Private Endpoint using Azure PowerShell
description: Create a Private Endpoint for Azure Attestation using Azure PowerShell
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Quickstart: Create a Private Endpoint using Azure PowerShell

Get started with Azure Private Link by using a Private Endpoint to connect securely to Azure Attestation.

In this quickstart, you'll create a private endpoint for Azure Attestation and deploy a virtual machine to test the private connection.  

## Prerequisites

* Learn about [Azure Private Link](/azure/private-link/private-link-overview)
* [Set up Azure Attestation with Azure PowerShell](/azure/attestation/quickstart-powershell)

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
## Create to your Azure account subscription and create a resource group in a desired location. ##
Connect-AzAccount
Set-AzSubscription “mySubscription”
$rg = “CreateAttestationPrivateLinkTutorial-rg”
$loc= "eastus”
New-AzResourceGroup -Name $rg -Location $loc
```

## Create a virtual network and bastion host

In this section, you'll create a virtual network, subnet, and bastion host. 

The bastion host will be used to connect securely to the virtual machine for testing the private endpoint.

Create a virtual network and bastion host with:

* [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork)
* [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress)
* [New-AzBastion](/powershell/module/az.network/new-azbastion)

```azurepowershell-interactive
## Create backend subnet config. ##
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name myBackendSubnet -AddressPrefix 10.0.0.0/24

## Create Azure Bastion subnet. ##
$bastsubnetConfig = New-AzVirtualNetworkSubnetConfig -Name AzureBastionSubnet -AddressPrefix 10.0.1.0/24

## Create the virtual network. ##
$vnet = New-AzVirtualNetwork -Name "myAttestationTutorialVNet" -ResourceGroupName $rg -Location $loc -AddressPrefix "10.0.0.0/16" -Subnet $subnetConfig, $bastsubnetConfig

## Create public IP address for bastion host. ##
$publicip = New-AzPublicIpAddress -Name "myBastionIP" -ResourceGroupName $rg -Location $loc -Sku "Standard" -AllocationMethod "Static"

## Create bastion host ##
New-AzBastion -ResourceGroupName $rg -Name "myBastion" -PublicIpAddress $publicip -VirtualNetwork $vnet
```

It can take a few minutes for the Azure Bastion host to deploy.

## Create test virtual machine

In this section, you'll create a virtual machine that will be used to test the private endpoint.

Create the virtual machine with:

  * [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential)
  * [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) 
  * [New-AzVM](/powershell/module/az.compute/new-azvm)
  * [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig)
  * [Set-AzVMOperatingSystem](/powershell/module/az.compute/set-azvmoperatingsystem)
  * [Set-AzVMSourceImage](/powershell/module/az.compute/set-azvmsourceimage)
  * [Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface)


```azurepowershell-interactive
## Set credentials for server admin and password. ##
$cred = Get-Credential

## Command to create network interface for VM ##
$nicVM = New-AzNetworkInterface -Name "myNicVM" -ResourceGroupName $rg -Location $loc -Subnet $vnet.Subnets[0] 

## Create a virtual machine configuration.##
$vmConfig = New-AzVMConfig -VMName "myVM" -VMSize "Standard_DS1_v2" | Set-AzVMOperatingSystem -Windows -ComputerName "myVM" -Credential $cred | Set-AzVMSourceImage -PublisherName "MicrosoftWindowsServer" -Offer "WindowsServer" -Skus "2019-Datacenter" -Version "latest" | Add-AzVMNetworkInterface -Id $nicVM.Id 

## Create the virtual machine ##
New-AzVM -ResourceGroupName $rg -Location $loc -VM $vmConfig
```

## Create private endpoint

In this section, you'll create the private endpoint and connection using:

* [New-AzPrivateLinkServiceConnection](/powershell/module/az.network/New-AzPrivateLinkServiceConnection)
* [New-AzPrivateEndpoint](/powershell/module/az.network/new-azprivateendpoint)

```azurepowershell-interactive
## Place web app into variable. Replace <webapp-resource-group-name> with the resource group of your webapp. ##
## Replace <your-webapp-name> with your webapp name ##
$webapp = Get-AzWebApp -ResourceGroupName <webapp-resource-group-name> -Name <your-webapp-name>

## Create private endpoint connection. ##
$parameters1 = @{
    Name = 'myConnection'
    PrivateLinkServiceId = $webapp.ID
    GroupID = 'sites'
}
$privateEndpointConnection = New-AzPrivateLinkServiceConnection @parameters1

## Place virtual network into variable. ##
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'CreatePrivateEndpointQS-rg' -Name 'myVNet'

## Disable private endpoint network policy ##
$vnet.Subnets[0].PrivateEndpointNetworkPolicies = "Disabled"
$vnet | Set-AzVirtualNetwork

## Create private endpoint
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

In this section you'll create and configure the private DNS zone using:

* [New-AzPrivateDnsZone](/powershell/module/az.privatedns/new-azprivatednszone)
* [New-AzPrivateDnsVirtualNetworkLink](/powershell/module/az.privatedns/new-azprivatednsvirtualnetworklink)
* [New-AzPrivateDnsZoneConfig](/powershell/module/az.network/new-azprivatednszoneconfig)
* [New-AzPrivateDnsZoneGroup](/powershell/module/az.network/new-azprivatednszonegroup)

```azurepowershell-interactive
## Place virtual network into variable. ##
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'CreatePrivateEndpointQS-rg' -Name 'myVNet'

## Create private dns zone. ##
$parameters1 = @{
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
    Name = 'privatelink.azurewebsites.net'
}
$zone = New-AzPrivateDnsZone @parameters1

## Create dns network link. ##
$parameters2 = @{
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
    ZoneName = 'privatelink.azurewebsites.net'
    Name = 'myLink'
    VirtualNetworkId = $vnet.Id
}
$link = New-AzPrivateDnsVirtualNetworkLink @parameters2

## Create DNS configuration ##
$parameters3 = @{
    Name = 'privatelink.azurewebsites.net'
    PrivateDnsZoneId = $zone.ResourceId
}
$config = New-AzPrivateDnsZoneConfig @parameters3

## Create DNS zone group. ##
$parameters4 = @{
    ResourceGroupName = 'CreatePrivateEndpointQS-rg'
    PrivateEndpointName = 'myPrivateEndpoint'
    Name = 'myZoneGroup'
    PrivateDnsZoneConfig = $config
}
New-AzPrivateDnsZoneGroup @parameters4
```

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous step to connect to the SQL server across the private endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com) 
 
2. Select **Resource groups** in the left-hand navigation pane.

3. Select **CreatePrivateEndpointQS-rg**.

4. Select **myVM**.

5. On the overview page for **myVM**, select **Connect** then **Bastion**.

6. Select the blue **Use Bastion** button.

7. Enter the username and password that you entered during the virtual machine creation.

8. Open Windows PowerShell on the server after you connect.

9. Enter `nslookup <your-webapp-name>.azurewebsites.net`. Replace **\<your-webapp-name>** with the name of the web app you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp8675.privatelink.azurewebsites.net
    Address:  10.0.0.5
    Aliases:  mywebapp8675.azurewebsites.net
    ```

    A private IP address of **10.0.0.5** is returned for the web app name.  This address is in the subnet of the virtual network you created previously.

10. In the bastion connection to **myVM**, open Internet Explorer.

11. Enter the url of your web app, **https://\<your-webapp-name>.azurewebsites.net**.

12. You'll receive the default web app page if your application hasn't been deployed:

    :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Default web app page." border="true":::

13. Close the connection to **myVM**.

## Clean up resources 
When you're done using the private endpoint and the VM, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all the resources it has:

```azurepowershell-interactive
Remove-AzResourceGroup -Name CreatePrivateEndpointQS-rg -Force
```

## Next steps

In this quickstart, you created a:

* Virtual network and bastion host.
* Virtual machine.
* Private endpoint for an Azure Web App.

You used the virtual machine to test connectivity securely to the web app across the private endpoint.

For more information on the services that support a private endpoint, see:
> [!div class="nextstepaction"]
> [Private Link availability](private-link-overview.md#availability)

