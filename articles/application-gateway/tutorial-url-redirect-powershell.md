---
title: URL path-based redirection using PowerShell - Azure Application Gateway
description: Learn how to create an application gateway with URL path-based redirected traffic using Azure PowerShell.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.date: 07/16/2025
ms.author: mbender
ms.topic: how-to 
ms.custom: devx-track-azurepowershell
# Customer intent: As an IT administrator, I want to configure an application gateway with URL path-based redirection using PowerShell, so that I can efficiently route web traffic to specific server pools based on URL patterns and enhance the user experience.
---

# Create an application gateway with URL path-based redirection using Azure PowerShell

 
You can use Azure PowerShell to configure [URL-based routing rules](./url-route-overview.md) when you create an [application gateway](./overview.md). In this tutorial, you create backend pools using [virtual machine scale sets](/azure/virtual-machine-scale-sets/overview). You then create URL routing rules that redirect web traffic to the appropriate backend pool based on the request URL path.
You can use Azure PowerShell to configure advanced [URL-based routing rules](./url-route-overview.md) when you create an [application gateway](./overview.md).

This tutorial covers production-ready configurations including security best practices, performance optimization, and monitoring setup.
 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up the network infrastructure
> * Create an application gateway with path-based routing
> * Add listeners and routing rules for URL redirection
> * Create virtual machine scale sets for backend pools
> * Test the application gateway routing and redirection functionality

The following example shows site traffic coming from both ports 8080 and 8081 and being directed to the same backend pools:

:::image type="content" source="./media/tutorial-url-redirect-powershell/scenario.png" alt-text="Diagram of URL routing and redirection architecture." lightbox="./media/tutorial-url-redirect-powershell/scenario.png":::

## Prerequisites

If you prefer, you can complete this procedure using [Azure CLI](tutorial-url-redirect-cli.md).

Before you begin this tutorial, ensure you have:

- An active Azure subscription. Create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't have one.
- Azure PowerShell module version 5.4.1 or later installed locally, or access to Azure Cloud Shell
- Contributor or Owner permissions on the target Azure subscription
- A basic understanding of Application Gateway concepts and PowerShell scripting

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this tutorial requires the Azure PowerShell module version 5.4.1 or later. To find the version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create an Azure resource group using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).  

```azurepowershell-interactive
# Define variables for consistent naming and easier management
$resourceGroupName = "myResourceGroupAG"
$location = "eastus"

# Create the resource group
New-AzResourceGroup -Name $resourceGroupName -Location $location

# Verify the resource group creation
Write-Output "Resource group '$resourceGroupName' created successfully in '$location'"
```

## Create network resources

 
Create the subnet configurations for *myBackendSubnet* and *myAGSubnet* using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig). Create the virtual network named *myVNet* using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) with the subnet configurations. Finally, create the public IP address named *myAGPublicIPAddress* using [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress). These resources provide network connectivity to the application gateway and its associated resources.

> [!IMPORTANT]
> The application gateway subnet (*myAGSubnet*) can contain only application gateways. No other resources are allowed in this subnet.
Create the subnet configurations for *myBackendSubnet* and *myAGSubnet* using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig). The Application Gateway requires a dedicated subnet with minimum /24 CIDR for proper operation and future scaling. Create the virtual network named *myVNet* using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) with the subnet configurations. Finally, create the public IP address with Standard SKU and static allocation for improved security and performance using [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress).

 

```azurepowershell-interactive
# Create backend subnet configuration with appropriate CIDR for scale sets
$backendSubnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name myBackendSubnet `
  -AddressPrefix 10.0.1.0/24

# Create Application Gateway subnet - dedicated subnet required
$agSubnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name myAGSubnet `
  -AddressPrefix 10.0.2.0/24

New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -Name myVNet `
  -AddressPrefix 10.0.0.0/16 `
  -Subnet $backendSubnetConfig, $agSubnetConfig

New-AzPublicIpAddress `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -Name myAGPublicIPAddress `
  -AllocationMethod Dynamic
```

## Create an application gateway

In this section, you create resources that support the application gateway, and then finally create it. The resources that you create include:

- *IP configurations and frontend port* - Associates the subnet that you previously created to the application gateway and assigns a port to use to access it.
- *Default pool* - All application gateways must have at least one backend pool of servers.
- *Default listener and rule* - The default listener listens for traffic on the port that was assigned and the default rule sends traffic to the default pool.

### Create the IP configurations and frontend port

Associate *myAGSubnet* that you previously created to the application gateway using [New-AzApplicationGatewayIPConfiguration](/powershell/module/az.network/new-azapplicationgatewayipconfiguration). Assign *myAGPublicIPAddress* to the application gateway using [New-AzApplicationGatewayFrontendIPConfig](/powershell/module/az.network/new-azapplicationgatewayfrontendipconfig). Then create the HTTP port using [New-AzApplicationGatewayFrontendPort](/powershell/module/az.network/new-azapplicationgatewayfrontendport).

```azurepowershell-interactive
# Get the virtual network and subnet references
$vnet = Get-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Name myVNet

$subnet=$vnet.Subnets[0]

# Get the public IP address
$pip = Get-AzPublicIpAddress `
  -ResourceGroupName myResourceGroupAG `
  -Name myAGPublicIPAddress

# Create IP configuration for the Application Gateway
$gipconfig = New-AzApplicationGatewayIPConfiguration `
  -Name myAGIPConfig `
  -Subnet $subnet

# Create frontend IP configuration
$fipconfig = New-AzApplicationGatewayFrontendIPConfig `
  -Name myAGFrontendIPConfig `
  -PublicIPAddress $pip

# Create frontend port for HTTP traffic
$frontendport = New-AzApplicationGatewayFrontendPort `
  -Name myFrontendPort `
  -Port 80

Write-Output "Application Gateway IP configurations created successfully"
```

### Create the default pool and settings

Create the default backend pool named *appGatewayBackendPool* for the application gateway using [New-AzApplicationGatewayBackendAddressPool](/powershell/module/az.network/new-azapplicationgatewaybackendaddresspool). Configure the settings for the backend pool using [New-AzApplicationGatewayBackendHttpSettings](/powershell/module/az.network/new-azapplicationgatewaybackendhttpsetting).

```azurepowershell-interactive
# Create default backend pool
$defaultPool = New-AzApplicationGatewayBackendAddressPool `
  -Name appGatewayBackendPool

# Create backend HTTP settings with optimized configuration
$poolSettings = New-AzApplicationGatewayBackendHttpSettings `
  -Name myPoolSettings `
  -Port 80 `
  -Protocol Http `
  -CookieBasedAffinity Enabled `
  -RequestTimeout 120
```

### Create the default listener and rule

A listener is required to enable the application gateway to route traffic appropriately to backend pools. In this tutorial, you create multiple listeners for different routing scenarios. The first basic listener expects traffic at the root URL. The other listeners expect traffic at specific URL paths, such as `http://203.0.113.1:8080/images/` or `http://203.0.113.1:8081/video/`.

Create a listener named *defaultListener* using [New-AzApplicationGatewayHttpListener](/powershell/module/az.network/new-azapplicationgatewayhttplistener) with the frontend configuration and frontend port that you previously created. A rule is required for the listener to know which backend pool to use for incoming traffic. Create a basic rule named *rule1* using [New-AzApplicationGatewayRequestRoutingRule](/powershell/module/az.network/new-azapplicationgatewayrequestroutingrule).

```azurepowershell-interactive
# Create default HTTP listener
$defaultlistener = New-AzApplicationGatewayHttpListener `
  -Name defaultListener `
  -Protocol Http `
  -FrontendIPConfiguration $fipconfig `
  -FrontendPort $frontendport

# Create basic routing rule that directs traffic to default pool
$frontendRule = New-AzApplicationGatewayRequestRoutingRule `
  -Name rule1 `
  -RuleType Basic `
  -HttpListener $defaultlistener `
  -BackendAddressPool $defaultPool `
  -BackendHttpSettings $poolSettings `
  -Priority 100

Write-Output "Default listener and routing rule created successfully"
```

### Create the application gateway

Now that you created the necessary supporting resources, specify parameters for the application gateway named *myAppGateway* using [New-AzApplicationGatewaySku](/powershell/module/az.network/new-azapplicationgatewaysku), and then create it using [New-AzApplicationGateway](/powershell/module/az.network/new-azapplicationgateway).

```azurepowershell-interactive
# Create SKU configuration for Application Gateway v2
$sku = New-AzApplicationGatewaySku `
  -Name Standard_Medium `
  -Tier Standard `
  -Capacity 2

New-AzApplicationGateway `
  -Name myAppGateway `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -BackendAddressPools $defaultPool `
  -BackendHttpSettingsCollection $poolSettings `
  -FrontendIpConfigurations $fipconfig `
  -GatewayIpConfigurations $gipconfig `
  -FrontendPorts $frontendport `
  -HttpListeners $defaultlistener `
  -RequestRoutingRules $frontendRule `
  -Sku $sku
```

### Add backend pools and ports

You can add backend pools to your application gateway using [Add-AzApplicationGatewayBackendAddressPool](/powershell/module/az.network/add-azapplicationgatewaybackendaddresspool). In this example, *imagesBackendPool* and *videoBackendPool* are created for routing specific content types. You add frontend ports for the pools using [Add-AzApplicationGatewayFrontendPort](/powershell/module/az.network/add-azapplicationgatewayfrontendport). Submit the changes to the application gateway using [Set-AzApplicationGateway](/powershell/module/az.network/set-azapplicationgateway).

```azurepowershell-interactive
# Get the current Application Gateway configuration
$appgw = Get-AzApplicationGateway `
  -ResourceGroupName myResourceGroupAG `
  -Name myAppGateway

# Add specialized backend pools for different content types
Add-AzApplicationGatewayBackendAddressPool `
  -ApplicationGateway $appgw `
  -Name imagesBackendPool

Add-AzApplicationGatewayBackendAddressPool `
  -ApplicationGateway $appgw `
  -Name videoBackendPool

# Add frontend ports for specialized listeners
Add-AzApplicationGatewayFrontendPort `
  -ApplicationGateway $appgw `
  -Name bport `
  -Port 8080

Add-AzApplicationGatewayFrontendPort `
  -ApplicationGateway $appgw `
  -Name rport `
  -Port 8081

# Apply the configuration changes
Set-AzApplicationGateway -ApplicationGateway $appgw
```

## Add listeners and rules

### Add listeners

Add the listeners named *backendListener* and *redirectedListener* that are needed to route traffic using [Add-AzApplicationGatewayHttpListener](/powershell/module/az.network/add-azapplicationgatewayhttplistener).

```azurepowershell-interactive
# Get the current Application Gateway configuration
$appgw = Get-AzApplicationGateway `
  -ResourceGroupName myResourceGroupAG `
  -Name myAppGateway

# Get frontend port references
$backendPort = Get-AzApplicationGatewayFrontendPort `
  -ApplicationGateway $appgw `
  -Name bport

$redirectPort = Get-AzApplicationGatewayFrontendPort `
  -ApplicationGateway $appgw `
  -Name rport

# Get frontend IP configuration
$fipconfig = Get-AzApplicationGatewayFrontendIPConfig `
  -ApplicationGateway $appgw

# Add listeners for different ports
Add-AzApplicationGatewayHttpListener `
  -ApplicationGateway $appgw `
  -Name backendListener `
  -Protocol Http `
  -FrontendIPConfiguration $fipconfig `
  -FrontendPort $backendPort

Add-AzApplicationGatewayHttpListener `
  -ApplicationGateway $appgw `
  -Name redirectedListener `
  -Protocol Http `
  -FrontendIPConfiguration $fipconfig `
  -FrontendPort $redirectPort

# Apply the configuration changes
Set-AzApplicationGateway -ApplicationGateway $appgw
```

### Add the default URL path map

URL path maps ensure that specific URLs are routed to specific backend pools. You can create URL path maps named *imagePathRule* and *videoPathRule* using [New-AzApplicationGatewayPathRuleConfig](/powershell/module/az.network/new-azapplicationgatewaypathruleconfig) and [Add-AzApplicationGatewayUrlPathMapConfig](/powershell/module/az.network/add-azapplicationgatewayurlpathmapconfig).

```azurepowershell-interactive
# Get the current Application Gateway configuration
$appgw = Get-AzApplicationGateway `
  -ResourceGroupName myResourceGroupAG `
  -Name myAppGateway

# Get backend HTTP settings
$poolSettings = Get-AzApplicationGatewayBackendHttpSettings `
  -ApplicationGateway $appgw `
  -Name myPoolSettings

# Get backend address pools
$imagePool = Get-AzApplicationGatewayBackendAddressPool `
  -ApplicationGateway $appgw `
  -Name imagesBackendPool

$videoPool = Get-AzApplicationGatewayBackendAddressPool `
  -ApplicationGateway $appgw `
  -Name videoBackendPool

$defaultPool = Get-AzApplicationGatewayBackendAddressPool `
  -ApplicationGateway $appgw `
  -Name appGatewayBackendPool

# Create path rules for different content types
$imagePathRule = New-AzApplicationGatewayPathRuleConfig `
  -Name imagePathRule `
  -Paths "/images/*" `
  -BackendAddressPool $imagePool `
  -BackendHttpSettings $poolSettings

$videoPathRule = New-AzApplicationGatewayPathRuleConfig `
  -Name videoPathRule `
  -Paths "/video/*" `
  -BackendAddressPool $videoPool `
  -BackendHttpSettings $poolSettings

# Add URL path map configuration
Add-AzApplicationGatewayUrlPathMapConfig `
  -ApplicationGateway $appgw `
  -Name urlpathmap `
  -PathRules $imagePathRule, $videoPathRule `
  -DefaultBackendAddressPool $defaultPool `
  -DefaultBackendHttpSettings $poolSettings

# Apply the configuration changes
Set-AzApplicationGateway -ApplicationGateway $appgw
```

### Add redirection configuration

You can configure redirection for the listener using [Add-AzApplicationGatewayRedirectConfiguration](/powershell/module/az.network/add-azapplicationgatewayredirectconfiguration).

```azurepowershell-interactive
# Get the current Application Gateway configuration
$appgw = Get-AzApplicationGateway `
  -ResourceGroupName $resourceGroupName `
  -Name myAppGateway

# Get the target listener for redirection
$backendListener = Get-AzApplicationGatewayHttpListener `
  -ApplicationGateway $appgw `
  -Name backendListener

# Add redirection configuration with query string and path preservation
$redirectConfig = Add-AzApplicationGatewayRedirectConfiguration `
  -ApplicationGateway $appgw `
  -Name redirectConfig `
  -RedirectType Found `
  -TargetListener $backendListener `
  -IncludePath $true `
  -IncludeQueryString $true

# Apply the configuration changes
Set-AzApplicationGateway -ApplicationGateway $appgw

Write-Output "Redirection configuration added successfully"
Write-Output "Redirect type: HTTP 302 Found"
Write-Output "Target: backendListener (Port 8080)"
Write-Output "Preserves: Path and Query String"
```

### Add the redirection URL path map

Create a separate URL path map for redirection scenarios. This map will handle traffic on port 8081 and redirect specific paths to the appropriate listener on port 8080.

```azurepowershell-interactive
# Get the current Application Gateway configuration
$appgw = Get-AzApplicationGateway `
  -ResourceGroupName $resourceGroupName `
  -Name myAppGateway

# Get references to existing configurations
$poolSettings = Get-AzApplicationGatewayBackendHttpSettings `
  -ApplicationGateway $appgw `
  -Name myPoolSettings

$defaultPool = Get-AzApplicationGatewayBackendAddressPool `
  -ApplicationGateway $appgw `
  -Name appGatewayBackendPool

$redirectConfig = Get-AzApplicationGatewayRedirectConfiguration `
  -ApplicationGateway $appgw `
  -Name redirectConfig

# Create path rule for redirection - images traffic will be redirected
$redirectPathRule = New-AzApplicationGatewayPathRuleConfig `
  -Name redirectPathRule `
  -Paths "/images/*" `
  -RedirectConfiguration $redirectConfig

# Add redirection path map configuration
Add-AzApplicationGatewayUrlPathMapConfig `
  -ApplicationGateway $appgw `
  -Name redirectpathmap `
  -PathRules $redirectPathRule `
  -DefaultBackendAddressPool $defaultPool `
  -DefaultBackendHttpSettings $poolSettings

# Apply the configuration changes
Set-AzApplicationGateway -ApplicationGateway $appgw

Write-Output "Redirection URL path map added successfully"
Write-Output "Redirection rule: /images/* on port 8081 -> port 8080"
```

### Add routing rules

The routing rules associate the URL maps with the listeners that you created. You can add the rules named *defaultRule* and *redirectedRule* using [Add-AzApplicationGatewayRequestRoutingRule](/powershell/module/az.network/add-azapplicationgatewayrequestroutingrule).


```azurepowershell-interactive
$appgw = Get-AzApplicationGateway `
  -ResourceGroupName myResourceGroupAG `
  -Name myAppGateway

$backendlistener = Get-AzApplicationGatewayHttpListener `
  -ApplicationGateway $appgw `
  -Name backendListener

$redirectlistener = Get-AzApplicationGatewayHttpListener `
  -ApplicationGateway $appgw `
  -Name redirectedListener

$urlPathMap = Get-AzApplicationGatewayUrlPathMapConfig `
  -ApplicationGateway $appgw `
  -Name urlpathmap

$redirectPathMap = Get-AzApplicationGatewayUrlPathMapConfig `
  -ApplicationGateway $appgw `
  -Name redirectpathmap

Add-AzApplicationGatewayRequestRoutingRule `
  -ApplicationGateway $appgw `
  -Name defaultRule `
  -RuleType PathBasedRouting `
  -HttpListener $backendlistener `
  -UrlPathMap $urlPathMap

Add-AzApplicationGatewayRequestRoutingRule `
  -ApplicationGateway $appgw `
  -Name redirectedRule `
  -RuleType PathBasedRouting `
  -HttpListener $redirectlistener `
  -UrlPathMap $redirectPathMap

Set-AzApplicationGateway -ApplicationGateway $appgw
```

## Create virtual machine scale sets

In this example, you create three virtual machine scale sets that support the three backend pools that you created. The scale sets are named *myvmss1*, *myvmss2*, and *myvmss3*. Each scale set contains two virtual machine instances on which you install IIS. You assign the scale set to the backend pool when you configure the IP settings.

  
> [!IMPORTANT]
> Replace `<username>` and `<password>` with your own values before running the script. Use a strong password that meets Azure's security requirements.
**Security Note**: Replace `<username>` and `<password>` with secure credentials. Consider using Azure Key Vault for credential management in production scenarios.
 

```azurepowershell-interactive
# Get network and Application Gateway references
$vnet = Get-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Name myVNet

$appgw = Get-AzApplicationGateway `
  -ResourceGroupName myResourceGroupAG `
  -Name myAppGateway

# Get backend pool references
$backendPool = Get-AzApplicationGatewayBackendAddressPool `
  -Name appGatewayBackendPool `
  -ApplicationGateway $appgw

$imagesPool = Get-AzApplicationGatewayBackendAddressPool `
  -Name imagesBackendPool `
  -ApplicationGateway $appgw

$videoPool = Get-AzApplicationGatewayBackendAddressPool `
  -Name videoBackendPool `
  -ApplicationGateway $appgw

# Create three scale sets with improved configuration
for ($i=1; $i -le 3; $i++)
{
  if ($i -eq 1)
  {
     $poolId = $backendPool.Id
  }
  if ($i -eq 2) 
  {
    $poolId = $imagesPool.Id
  }
  if ($i -eq 3)
  {
    $poolId = $videoPool.Id
  }

  $ipConfig = New-AzVmssIpConfig `
    -Name myVmssIPConfig$i `
    -SubnetId $vnet.Subnets[1].Id `
    -ApplicationGatewayBackendAddressPoolsId $poolId

  # Create scale set configuration with modern VM size and settings
  $vmssConfig = New-AzVmssConfig `
    -Location eastus `
    -SkuCapacity 2 `
    -SkuName Standard_DS2 `
    -UpgradePolicyMode Automatic

  # Configure storage profile with Windows Server 2022
  Set-AzVmssStorageProfile $vmssConfig `
    -ImageReferencePublisher MicrosoftWindowsServer `
    -ImageReferenceOffer WindowsServer `
    -ImageReferenceSku 2016-Datacenter `
    -ImageReferenceVersion latest `
    -OsDiskCreateOption FromImage

  Set-AzVmssOsProfile $vmssConfig `
    -AdminUsername <username> `
    -AdminPassword "<password>" `
    -ComputerNamePrefix myvmss$i

  # Add network interface configuration
  Add-AzVmssNetworkInterfaceConfiguration `
    -VirtualMachineScaleSet $vmssConfig `
    -Name myVmssNetConfig$i `
    -Primary $true `
    -IPConfiguration $ipConfig

  New-AzVmss `
    -ResourceGroupName myResourceGroupAG `
    -Name myvmss$i `
    -VirtualMachineScaleSet $vmssConfig

  Write-Output "Virtual Machine Scale Set myvmss$i created successfully"
}

Write-Output "All Virtual Machine Scale Sets created successfully"
```

### Install IIS

The following script installs IIS on the virtual machines in each scale set and configures them to display different content based on which backend pool they serve.

```azurepowershell-interactive
$publicSettings = @{ "fileUris" = (,"https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/application-gateway/iis/appgatewayurl.ps1"); 
  "commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File appgatewayurl.ps1" }

# Install IIS on all scale sets
for ($i=1; $i -le 3; $i++)
{
  $vmss = Get-AzVmss -ResourceGroupName myResourceGroupAG -VMScaleSetName myvmss$i

  Add-AzVmssExtension -VirtualMachineScaleSet $vmss `
    -Name "customScript" `
    -Publisher "Microsoft.Compute" `
    -Type "CustomScriptExtension" `
    -TypeHandlerVersion 1.8 `
    -Setting $publicSettings

  Update-AzVmss `
    -ResourceGroupName myResourceGroupAG `
    -Name myvmss$i `
    -VirtualMachineScaleSet $vmss
}
```

## Test the application gateway

Although IIS isn't required to create the application gateway, you installed it in this tutorial to verify if Azure successfully created the application gateway. Use IIS to test the application gateway:

1. Run [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress) to get the public IP address of the application gateway:

   ```azurepowershell-interactive
   Get-AzPublicIPAddress -ResourceGroupName myResourceGroupAG -Name myAGPublicIPAddress
   ```

2. Copy the public IP address, and then paste it into the address bar of your browser. For example:
   - `http://203.0.113.1` (base URL)
   - `http://203.0.113.1:8080/images/test.htm` (images path)
   - `http://203.0.113.1:8080/video/test.htm` (video path)
   - `http://203.0.113.1:8081/images/test.htm` (redirection test)

:::image type="content" source="./media/tutorial-url-redirect-powershell/application-gateway-iistest.png" alt-text="Screenshot showing the default IIS welcome page when testing the base URL of the application gateway." lightbox="./media/tutorial-url-redirect-powershell/application-gateway-iistest.png":::

Change the URL to `http://<ip-address>:8080/images/test.htm`, substituting your IP address for `<ip-address>`, and you should see something like the following example:

:::image type="content" source="./media/tutorial-url-redirect-powershell/application-gateway-iistest-images.png" alt-text="Screenshot showing the images backend pool test page when accessing the /images path on the application gateway." lightbox="./media/tutorial-url-redirect-powershell/application-gateway-iistest-images.png":::

Change the URL to `http://<ip-address>:8080/video/test.htm`, substituting your IP address for `<ip-address>`, and you should see something like the following example:

:::image type="content" source="./media/tutorial-url-redirect-powershell/application-gateway-iistest-video.png" alt-text="Screenshot showing the video backend pool test page when accessing the /video path on the application gateway." lightbox="./media/tutorial-url-redirect-powershell/application-gateway-iistest-video.png":::

Now, change the URL to `http://<ip-address>:8081/images/test.htm`, substituting your IP address for `<ip-address>`, and you should see traffic redirected back to the images backend pool at `http://<ip-address>:8080/images`.

### Performance monitoring

Monitor key Application Gateway metrics for optimal performance:

- **Request Count**: Total number of requests processed
- **Response Time**: Average response time for requests
- **Unhealthy Host Count**: Number of unhealthy backend servers
- **Throughput**: Data transfer rate through the Application Gateway

## Clean up resources

When no longer needed, remove the resource group, application gateway, and all related resources using [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupAG
```
## Next steps

Now that you learned URL path-based redirection with Application Gateway, explore these advanced scenarios:

> [!div class="nextstepaction"]
> [Learn more about Application Gateway features and capabilities](./overview.md)

> [!div class="nextstepaction"]
> [Configure SSL termination with Application Gateway](./tutorial-ssl-powershell.md)

> [!div class="nextstepaction"]
> [Implement Web Application Firewall (WAF) policies](./tutorial-restrict-web-traffic-powershell.md)

> [!div class="nextstepaction"]
> [Set up Application Gateway with Azure Container Instances](./tutorial-url-route-cli.md)

### More resources

- [Application Gateway configuration overview](./configuration-overview.md)
- [Application Gateway monitoring and diagnostics](./application-gateway-diagnostics.md)
- [Application Gateway autoscaling and zone redundancy](./application-gateway-autoscaling-zone-redundant.md)
- [URL-based routing overview](./url-route-overview.md)
