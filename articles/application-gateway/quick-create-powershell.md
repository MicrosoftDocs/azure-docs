---
title: Quickstart - Direct web traffic with Azure Application Gateway - Azure PowerShell | Microsoft Docs
description: Learn how use Azure PowerShell to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: quickstart
ms.date: 1/11/2019
ms.author: victorh
ms.custom: mvc
---

# Quickstart: Direct web traffic with Azure Application Gateway - Azure PowerShell

This quickstart shows you how to use the Azure portal to quickly create an application gateway with two virtual machines in its backend pool. You then test it to make sure it's working correctly. With Azure Application Gateway, you direct your application web traffic to specific resources by: assigning listeners to ports, creating rules, and adding resources to a backend pool.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

## Run Azure PowerShell locally

If you choose to install and use Azure PowerShell locally, this tutorial requires the Azure PowerShell module version 1.0.0 or later.

1. To find the version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). 
2. To create a connection with Azure, run `Login-AzAccount`.

## Create a resource group

In Azure, you allocate related resources to a resource group. Create a resource group by using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet as follows: 

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroupAG -Location eastus
```

## Create network resources

Create a virtual network so that the application gateway can communicate with other resources. Two subnets are created in this example: one for the application gateway and the other for the backend servers. The application gateway subnet can contain only application gateways. No other resources are allowed.

1. Create the subnet configurations by calling [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig).
2. Create the virtual network with the subnet configurations by calling [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork).
3. Create the public IP address by calling [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

```azurepowershell-interactive
$agSubnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name myAGSubnet `
  -AddressPrefix 10.0.1.0/24
$backendSubnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name myBackendSubnet `
  -AddressPrefix 10.0.2.0/24
New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -Name myVNet `
  -AddressPrefix 10.0.0.0/16 `
  -Subnet $agSubnetConfig, $backendSubnetConfig
New-AzPublicIpAddress `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -Name myAGPublicIPAddress `
  -AllocationMethod Dynamic
```
## Create backend servers

In this example, you create two virtual machines for Azure to use as backend servers for the application gateway. You also install IIS on the virtual machines to verify that Azure successfully created the application gateway.

### Create two virtual machines

1. Create a network interface with [New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface). 
2. Create a virtual machine configuration with [New-AzVMConfig](/powershell/module/az.compute/new-azvmconfig).
3. Create the virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm).

When you run the following code sample to create the virtual machines, Azure prompts you for credentials. Enter *azureuser* for the user name and *Azure123456!* for the password:
    
```azurepowershell-interactive
$vnet   = Get-AzVirtualNetwork -ResourceGroupName myResourceGroupAG -Name myVNet
$subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name myBackendSubnet
$cred = Get-Credential
for ($i=1; $i -le 2; $i++)
{
  $nic = New-AzNetworkInterface `
    -Name myNic$i `
    -ResourceGroupName myResourceGroupAG `
    -Location EastUS `
    -SubnetId $subnet.Id
  $vm = New-AzVMConfig `
    -VMName myVM$i `
    -VMSize Standard_DS2_v2
  Set-AzVMOperatingSystem `
    -VM $vm `
    -Windows `
    -ComputerName myVM$i `
    -Credential $cred
  Set-AzVMSourceImage `
    -VM $vm `
    -PublisherName MicrosoftWindowsServer `
    -Offer WindowsServer `
    -Skus 2016-Datacenter `
    -Version latest
  Add-AzVMNetworkInterface `
    -VM $vm `
    -Id $nic.Id
  Set-AzVMBootDiagnostics `
    -VM $vm `
    -Disable
  New-AzVM -ResourceGroupName myResourceGroupAG -Location EastUS -VM $vm
  Set-AzVMExtension `
    -ResourceGroupName myResourceGroupAG `
    -ExtensionName IIS `
    -VMName myVM$i `
    -Publisher Microsoft.Compute `
    -ExtensionType CustomScriptExtension `
    -TypeHandlerVersion 1.4 `
    -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}' `
    -Location EastUS
}
```

## Create an application gateway

### Create the IP configurations and frontend port

1. Use [New-AzApplicationGatewayIPConfiguration](/powershell/module/az.network/new-azapplicationgatewayipconfiguration) to create the configuration that associates the subnet you created with the application gateway. 
2. Use [New-AzApplicationGatewayFrontendIPConfig](/powershell/module/az.network/new-azapplicationgatewayfrontendipconfig) to create the configuration that assigns the public IP address that you previously created to the application gateway. 
3. Use [New-AzApplicationGatewayFrontendPort](/powershell/module/az.network/new-azapplicationgatewayfrontendport) to assign port 80 to access the application gateway.

```azurepowershell-interactive
$vnet   = Get-AzVirtualNetwork -ResourceGroupName myResourceGroupAG -Name myVNet
$subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name myAGSubnet
$pip    = Get-AzPublicIPAddress -ResourceGroupName myResourceGroupAG -Name myAGPublicIPAddress 
$gipconfig = New-AzApplicationGatewayIPConfiguration `
  -Name myAGIPConfig `
  -Subnet $subnet
$fipconfig = New-AzApplicationGatewayFrontendIPConfig `
  -Name myAGFrontendIPConfig `
  -PublicIPAddress $pip
$frontendport = New-AzApplicationGatewayFrontendPort `
  -Name myFrontendPort `
  -Port 80
```

### Create the backend pool

1. Use [New-AzApplicationGatewayBackendAddressPool](/powershell/module/az.network/new-azapplicationgatewaybackendaddresspool) to create the backend pool for the application gateway. 
2. Configure the settings for the backend pool with [New-AzApplicationGatewayBackendHttpSettings](/powershell/module/az.network/new-azapplicationgatewaybackendhttpsettings).

```azurepowershell-interactive
$address1 = Get-AzNetworkInterface -ResourceGroupName myResourceGroupAG -Name myNic1
$address2 = Get-AzNetworkInterface -ResourceGroupName myResourceGroupAG -Name myNic2
$backendPool = New-AzApplicationGatewayBackendAddressPool `
  -Name myAGBackendPool `
  -BackendIPAddresses $address1.ipconfigurations[0].privateipaddress, $address2.ipconfigurations[0].privateipaddress
$poolSettings = New-AzApplicationGatewayBackendHttpSettings `
  -Name myPoolSettings `
  -Port 80 `
  -Protocol Http `
  -CookieBasedAffinity Enabled `
  -RequestTimeout 120
```

### Create the listener and add a rule

Azure requires a listener to enable the application gateway for routing traffic appropriately to the backend pool. Azure also requires a rule for the listener to know which backend pool to use for incoming traffic. 

1. Create a listener by using [New-AzApplicationGatewayHttpListener](/powershell/module/az.network/new-azapplicationgatewayhttplistener) with the frontend configuration and frontend port that you previously created. 
2. Use [New-AzApplicationGatewayRequestRoutingRule](/powershell/module/az.network/new-azapplicationgatewayrequestroutingrule) to create a rule named *rule1*. 

```azurepowershell-interactive
$defaultlistener = New-AzApplicationGatewayHttpListener `
  -Name myAGListener `
  -Protocol Http `
  -FrontendIPConfiguration $fipconfig `
  -FrontendPort $frontendport
$frontendRule = New-AzApplicationGatewayRequestRoutingRule `
  -Name rule1 `
  -RuleType Basic `
  -HttpListener $defaultlistener `
  -BackendAddressPool $backendPool `
  -BackendHttpSettings $poolSettings
```

### Create the application gateway

Now that you've created the necessary supporting resources, create the application gateway:

1. Use [New-AzApplicationGatewaySku](/powershell/module/az.network/new-azapplicationgatewaysku) to specify parameters for the application gateway.
2. Use [New-AzApplicationGateway](/powershell/module/az.network/new-azapplicationgateway) to create the application gateway.

```azurepowershell-interactive
$sku = New-AzApplicationGatewaySku `
  -Name Standard_Medium `
  -Tier Standard `
  -Capacity 2
New-AzApplicationGateway `
  -Name myAppGateway `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -BackendAddressPools $backendPool `
  -BackendHttpSettingsCollection $poolSettings `
  -FrontendIpConfigurations $fipconfig `
  -GatewayIpConfigurations $gipconfig `
  -FrontendPorts $frontendport `
  -HttpListeners $defaultlistener `
  -RequestRoutingRules $frontendRule `
  -Sku $sku
```

## Test the application gateway

Although IIS isn't required to create the application gateway, you installed it in this quickstart to verify whether Azure successfully created the application gateway. Use IIS to test the application gateway:

1. Run [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress) to get the public IP address of the application gateway. 
2. Copy and paste the public IP address into the address bar of your browser. When you refresh the browser, you should see the name of the virtual machine.

```azurepowershell-interactive
Get-AzPublicIPAddress -ResourceGroupName myResourceGroupAG -Name myAGPublicIPAddress
```

![Test application gateway](./media/quick-create-powershell/application-gateway-iistest.png)


## Clean up resources

When you no longer need the resources that you created with the application gateway, remove the resource group. By removing the resource group, you also remove the application gateway and all its related resources. 

To remove the resource group, call the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet as follows:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupAG
```

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using Azure PowerShell](./tutorial-manage-web-traffic-powershell.md)

