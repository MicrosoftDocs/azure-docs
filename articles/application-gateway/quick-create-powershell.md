---
title: 'Quickstart: Direct web traffic using PowerShell'
titleSuffix: Azure Application Gateway
description: In this quickstart, you learn how to use Azure PowerShell to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
services: application-gateway
author: greg-lindsay
ms.author: greglin
ms.date: 05/30/2024
ms.topic: quickstart
ms.service: azure-application-gateway
ms.custom: devx-track-azurepowershell, mvc, mode-api
---

# Quickstart: Direct web traffic with Azure Application Gateway using Azure PowerShell

In this quickstart, you use Azure PowerShell to create an application gateway. Then you test it to make sure it works correctly.

The application gateway directs application web traffic to specific resources in a backend pool. You assign listeners to ports, create rules, and add resources to a backend pool. For the sake of simplicity, this article uses a simple setup with a public frontend IP address, a basic listener to host a single site on the application gateway, a basic request routing rule, and two virtual machines in the backend pool.

:::image type="content" source="./media/quick-create-portal/application-gateway-qs-resources.png" alt-text="Conceptual diagram of the quickstart setup." lightbox="./media/quick-create-portal/application-gateway-qs-resources.png":::

You can also complete this quickstart using [Azure CLI](quick-create-cli.md) or the [Azure portal](quick-create-portal.md).

> [!NOTE]
> Application Gateway frontend now supports dual-stack IP addresses (Preview). You can now create up to four frontend IP addresses: Two IPv4 addresses (public and private) and two IPv6 addresses (public and private).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure PowerShell version 1.0.0 or later](/powershell/azure/install-azure-powershell) (if you run Azure PowerShell locally).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Connect to Azure

To connect with Azure, run `Connect-AzAccount`.

## Create a resource group

In Azure, you allocate related resources to a resource group. You can either use an existing resource group or create a new one.

To create a new resource group, use the `New-AzResourceGroup` cmdlet: 

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroupAG -Location eastus
```
## Create network resources

For Azure to communicate between the resources that you create, it needs a virtual network.  The application gateway subnet can contain only application gateways. No other resources are allowed.  You can either create a new subnet for Application Gateway or use an existing one. You create two subnets in this example: one for the application gateway, and another for the backend servers. You can configure the Frontend IP address of the Application Gateway to be Public or Private as per your use case. In this example, you'll choose a Public Frontend IP address.

1. Create the subnet configurations using `New-AzVirtualNetworkSubnetConfig`.
2. Create the virtual network with the subnet configurations using `New-AzVirtualNetwork`. 
3. Create the public IP address using `New-AzPublicIpAddress`. 
> [!NOTE]
> [Virtual network service endpoint policies](../virtual-network/virtual-network-service-endpoint-policies-overview.md) are currently not supported in an Application Gateway subnet.

```azurepowershell-interactive
$agSubnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name myAGSubnet `
  -AddressPrefix 10.21.0.0/24
$backendSubnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name myBackendSubnet `
  -AddressPrefix 10.21.1.0/24
New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -Name myVNet `
  -AddressPrefix 10.21.0.0/16 `
  -Subnet $agSubnetConfig, $backendSubnetConfig
New-AzPublicIpAddress `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -Name myAGPublicIPAddress `
  -AllocationMethod Static `
  -Sku Standard
```
## Create an application gateway

The Standard v2 SKU is used in this example.

### Create the IP configurations and frontend port

1. Use `New-AzApplicationGatewayIPConfiguration` to create the configuration that associates the subnet you created with the application gateway. 
2. Use `New-AzApplicationGatewayFrontendIPConfig` to create the configuration that assigns the public IP address that you previously created for the application gateway. 
3. Use `New-AzApplicationGatewayFrontendPort` to assign port 80 to access the application gateway.

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
  > [!NOTE]
  > Application Gateway frontend now supports dual-stack IP addresses (Public Preview). You can now create up to four frontend IP addresses: Two IPv4 addresses (public and private) and two IPv6 addresses (public and private).

### Create the backend pool

1. Use `New-AzApplicationGatewayBackendAddressPool` to create the backend pool for the application gateway. The backend pool is empty for now. When you create the backend server NICs in the next section, you'll add them to the backend pool.
2. Configure the settings for the backend pool with `New-AzApplicationGatewayBackendHttpSetting`.

```azurepowershell-interactive
$backendPool = New-AzApplicationGatewayBackendAddressPool `
  -Name myAGBackendPool
$poolSettings = New-AzApplicationGatewayBackendHttpSetting `
  -Name myPoolSettings `
  -Port 80 `
  -Protocol Http `
  -CookieBasedAffinity Enabled `
  -RequestTimeout 30
```

### Create the listener and add a rule

Azure requires a listener to enable the application gateway for routing traffic appropriately to the backend pool. Azure also requires a rule for the listener to know which backend pool to use for incoming traffic. 

1. Create a listener using `New-AzApplicationGatewayHttpListener` with the frontend configuration and frontend port that you previously created. 
2. Use `New-AzApplicationGatewayRequestRoutingRule` to create a rule named *rule1*. 

```azurepowershell-interactive
$defaultlistener = New-AzApplicationGatewayHttpListener `
  -Name myAGListener `
  -Protocol Http `
  -FrontendIPConfiguration $fipconfig `
  -FrontendPort $frontendport
$frontendRule = New-AzApplicationGatewayRequestRoutingRule `
  -Name rule1 `
  -RuleType Basic `
  -Priority 100 `
  -HttpListener $defaultlistener `
  -BackendAddressPool $backendPool `
  -BackendHttpSettings $poolSettings
```

### Create the application gateway

Now that you've created the necessary supporting resources, create the application gateway:

1. Use `New-AzApplicationGatewaySku` to specify parameters for the application gateway.
2. Use `New-AzApplicationGateway` to create the application gateway.

```azurepowershell-interactive
$sku = New-AzApplicationGatewaySku `
  -Name Standard_v2 `
  -Tier Standard_v2 `
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

> [!TIP]
> You can modify values of the `Name` and `Tier` parameters to use a different SKU. For example: `Basic`.

### Backend servers

Now that you have created the Application Gateway, create the backend virtual machines which will host the websites. A backend can be composed of NICs, virtual machine scale sets, public IP address, internal IP address, fully qualified domain names (FQDN), and multitenant backends like Azure App Service. 

In this example, you create two virtual machines to use as backend servers for the application gateway. You also install IIS on the virtual machines to verify that Azure successfully created the application gateway.

#### Create two virtual machines

1. Get the recently created Application Gateway backend pool configuration with `Get-AzApplicationGatewayBackendAddressPool`.
2. Create a network interface with `New-AzNetworkInterface`.
3. Create a virtual machine configuration with `New-AzVMConfig`.
4. Create the virtual machine with `New-AzVM`.

When you run the following code sample to create the virtual machines, Azure prompts you for credentials. Enter a user name and a password:
​    
```azurepowershell-interactive
$appgw = Get-AzApplicationGateway -ResourceGroupName myResourceGroupAG -Name myAppGateway
$backendPool = Get-AzApplicationGatewayBackendAddressPool -Name myAGBackendPool -ApplicationGateway $appgw
$vnet   = Get-AzVirtualNetwork -ResourceGroupName myResourceGroupAG -Name myVNet
$subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name myBackendSubnet
$cred = Get-Credential
for ($i=1; $i -le 2; $i++)
{
  $nic = New-AzNetworkInterface `
    -Name myNic$i `
    -ResourceGroupName myResourceGroupAG `
    -Location EastUS `
    -Subnet $subnet `
    -ApplicationGatewayBackendAddressPool $backendpool
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
  Set-AzVMBootDiagnostic `
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

## Test the application gateway

Although IIS isn't required to create the application gateway, you installed it in this quickstart to verify if Azure successfully created the application gateway.

Use IIS to test the application gateway:

1. Run `Get-AzPublicIPAddress` to get the public IP address of the application gateway. 
2. Copy and paste the public IP address into the address bar of your browser. When you refresh the browser, you should see the name of the virtual machine. A valid response verifies that the application gateway was successfully created and it can successfully connect with the backend.

```azurepowershell-interactive
Get-AzPublicIPAddress -ResourceGroupName myResourceGroupAG -Name myAGPublicIPAddress
```

![Test application gateway](./media/quick-create-powershell/application-gateway-iistest.png)


## Clean up resources

When you no longer need the resources that you created with the application gateway, delete the resource group. When you delete the resource group, you also delete the application gateway and all its related resources. 

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupAG
```

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using Azure PowerShell](./tutorial-manage-web-traffic-powershell.md)
