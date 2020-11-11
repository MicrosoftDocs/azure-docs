---
title: Configure per-site WAF policies using PowerShell
titleSuffix: Azure Web Application Firewall
description: Learn how to configure per-site Web Application Firewall policies on an application gateway using Azure PowerShell.
services: web-application-firewall
author: winthrop28
ms.service: web-application-firewall
ms.date: 09/16/2020
ms.author: victorh
ms.topic: conceptual
---

# Configure per-site WAF policies using Azure PowerShell

Web Application Firewall (WAF) settings are contained in WAF policies, and to change your WAF configuration you modify the WAF policy.

When associated with your Application Gateway, the policies and all the settings are reflected globally. So, if you have five sites behind your WAF, all five sites are protected by the same WAF Policy. This is great if you need the same security settings for every site. But you can also apply WAF policies to individual listeners to allow for site-specific WAF configuration.

By applying WAF policies to a listener, you can configure WAF settings for individual sites without the changes affecting every site. The most specific policy takes precedent. If there's a global policy, and a per-site policy (a WAF policy associated with a listener), then the per-site policy overrides the global WAF policy for that listener. Other listeners without their own policies will only be affected by the global WAF policy.

In this article, you learn how to:

* Set up the network
* Create a WAF policy
* Create an application gateway with WAF enabled
* Apply the WAF policy globally, per-site, and per-URI (preview)
* Create a virtual machine scale set
* Create a storage account and configure diagnostics
* Test the application gateway

![Web application firewall example](../media/tutorial-restrict-web-traffic-powershell/scenario-waf.png)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you're running PowerShell locally, you also need to run `Login-AzAccount` to create a connection with Azure.

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create an Azure resource group using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup).  

```azurepowershell-interactive
$rgname = New-AzResourceGroup -Name myResourceGroupAG -Location eastus
```

## Create network resources 

Create the subnet configurations named *myBackendSubnet* and *myAGSubnet* using [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig). Create the virtual network named *myVNet* using [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) with the subnet configurations. And finally, create the public IP address named *myAGPublicIPAddress* using [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress). These resources are used to provide network connectivity to the application gateway and its associated resources.

```azurepowershell-interactive
$backendSubnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name myBackendSubnet `
  -AddressPrefix 10.0.1.0/24

$agSubnetConfig = New-AzVirtualNetworkSubnetConfig `
  -Name myAGSubnet `
  -AddressPrefix 10.0.2.0/24

$vnet = New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -Name myVNet `
  -AddressPrefix 10.0.0.0/16 `
  -Subnet $backendSubnetConfig, $agSubnetConfig

$pip = New-AzPublicIpAddress `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -Name myAGPublicIPAddress `
  -AllocationMethod Static `
  -Sku Standard
```

## Create an application gateway

In this section, you create resources that support the application gateway, and then finally create it and a WAF. The resources that you create include:

- *IP configurations and frontend port* - Associates the subnet that you previously created to the application gateway and assigns a port to use to access it.
- *Default pool* - All application gateways must have at least one backend pool of servers.
- *Default listener and rule* - The default listener listens for traffic on the port that was assigned and the default rule sends traffic to the default pool.

### Create the IP configurations and frontend port

Associate *myAGSubnet* that you previously created to the application gateway using [New-AzApplicationGatewayIPConfiguration](/powershell/module/az.network/new-azapplicationgatewayipconfiguration). Assign *myAGPublicIPAddress* to the application gateway using [New-AzApplicationGatewayFrontendIPConfig](/powershell/module/az.network/new-azapplicationgatewayfrontendipconfig).

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Name myVNet

$subnet=$vnet.Subnets[1]

$gipconfig = New-AzApplicationGatewayIPConfiguration `
  -Name myAGIPConfig `
  -Subnet $subnet

$fipconfig = New-AzApplicationGatewayFrontendIPConfig `
  -Name myAGFrontendIPConfig `
  -PublicIPAddress $pip

$frontendport80 = New-AzApplicationGatewayFrontendPort `
  -Name myFrontendPort80 `
  -Port 80
  
$frontendport8080 = New-AzApplicationGatewayFrontendPort `
  -Name myFrontendPort8080 `
  -Port 8080
```

### Create the backend pool and settings

Create the backend pool named *appGatewayBackendPool* for the application gateway using [New-AzApplicationGatewayBackendAddressPool](/powershell/module/az.network/new-azapplicationgatewaybackendaddresspool). Configure the settings for the backend address pools using [New-AzApplicationGatewayBackendHttpSettings](/powershell/module/az.network/new-azapplicationgatewaybackendhttpsetting).

```azurepowershell-interactive
$defaultPool = New-AzApplicationGatewayBackendAddressPool `
  -Name appGatewayBackendPool 

$poolSettings = New-AzApplicationGatewayBackendHttpSettings `
  -Name myPoolSettings `
  -Port 80 `
  -Protocol Http `
  -CookieBasedAffinity Enabled `
  -RequestTimeout 120
```

### Create three WAF policies

Create three WAF policies, one global, one per-site and one per-URI policy (preview).

Then add custom rules for each policy.

```azurepowershell-interactive
# wafpolicyGlobal rules

$variable = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable -Operator Contains -MatchValue "Default.htm" 
$rule = New-AzApplicationGatewayFirewallCustomRule -Name globalAllow -Priority 5 -RuleType MatchRule -MatchCondition $condition -Action Allow

$variable1 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition1 = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable1 -Operator Contains -MatchValue "Default" 
$rule1 = New-AzApplicationGatewayFirewallCustomRule -Name globalBlockDefault -Priority 10 -RuleType MatchRule -MatchCondition $condition1 -Action Block

$variable2 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition2 = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable2 -Operator Contains -MatchValue "8080/images/test.htm" 
$rule2 = New-AzApplicationGatewayFirewallCustomRule -Name globalBlockImages -Priority 20 -RuleType MatchRule -MatchCondition $condition2 -Action Block

$variable3 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition3 = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable3 -Operator Contains -MatchValue "iisstart" 
$rule3 = New-AzApplicationGatewayFirewallCustomRule -Name globalBlockiisstart -Priority 30 -RuleType MatchRule -MatchCondition $condition3 -Action Block

# wafpolicySite rules

$variable4 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition4 = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable4 -Operator Contains -MatchValue "images/test.htm" 
$rule4 = New-AzApplicationGatewayFirewallCustomRule -Name siteAllowtest -Priority 5 -RuleType MatchRule -MatchCondition $condition4 -Action Allow

$variable5 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition5 = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable5 -Operator Contains -MatchValue "images" 
$rule5 = New-AzApplicationGatewayFirewallCustomRule -Name siteBlockimages -Priority 10 -RuleType MatchRule -MatchCondition $condition5 -Action Block

$variable6 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition6 = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable6 -Operator Contains -MatchValue "8080/video/test.htm" 
$rule6 = New-AzApplicationGatewayFirewallCustomRule -Name siteBlockvideotest -Priority 20 -RuleType MatchRule -MatchCondition $condition6 -Action Block

# wafpolicyURI rules (Preview)

$variable7 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition7 = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable7 -Operator Contains -MatchValue "video/test.htm" 
$rule7 = New-AzApplicationGatewayFirewallCustomRule -Name URIAllowvideotest -Priority 5 -RuleType MatchRule -MatchCondition $condition7 -Action Allow

$variable8 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition8 = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable8 -Operator Contains -MatchValue "iisstart" 
$rule8 = New-AzApplicationGatewayFirewallCustomRule -Name URIAllowiisstart -Priority 10 -RuleType MatchRule -MatchCondition $condition8 -Action Allow

$variable9 = New-AzApplicationGatewayFirewallMatchVariable -VariableName RequestUri
$condition9 = New-AzApplicationGatewayFirewallCondition -MatchVariable $variable9 -Operator Contains -MatchValue "video"
$rule9 = New-AzApplicationGatewayFirewallCustomRule -Name URIBlockvideo -Priority 20 -RuleType MatchRule -MatchCondition $condition9 -Action Block

# wafpolicyGlobal

$policySettingGlobal = New-AzApplicationGatewayFirewallPolicySetting `
  -Mode Prevention `
  -State Enabled `
  -MaxRequestBodySizeInKb 100 `
  -MaxFileUploadInMb 256

$wafPolicyGlobal = New-AzApplicationGatewayFirewallPolicy `
  -Name wafpolicyGlobal `
  -ResourceGroup myResourceGroupAG `
  -Location eastus `
  -PolicySetting $PolicySettingGlobal `
  -CustomRule $rule, $rule1, $rule2, $rule3

# wafpolicySite

$policySettingSite = New-AzApplicationGatewayFirewallPolicySetting `
  -Mode Prevention `
  -State Enabled `
  -MaxRequestBodySizeInKb 100 `
  -MaxFileUploadInMb 5

$wafPolicySite = New-AzApplicationGatewayFirewallPolicy `
  -Name wafpolicySite `
  -ResourceGroup myResourceGroupAG `
  -Location eastus `
  -PolicySetting $PolicySettingSite `
  -CustomRule $rule4, $rule5, $rule6

# wafpolicyURI (Preview)

$policySettingURI = New-AzApplicationGatewayFirewallPolicySetting `
  -Mode Prevention `
  -State Enabled `
  -MaxRequestBodySizeInKb 100 `
  -MaxFileUploadInMb 5

$wafPolicyURI = New-AzApplicationGatewayFirewallPolicy `
  -Name wafpolicyURI `
  -ResourceGroup myResourceGroupAG `
  -Location eastus `
  -PolicySetting $PolicySettingURI `
  -CustomRule $rule7, $rule8, $rule9
```

### Create the path map rules

The path rules and path maps are required on a pathBasedRouting rule.

Create the path based rules using [New-AzApplicationGatewayPathRuleConfig](/powershell/module/az.network/new-azapplicationgatewaypathruleconfig)

Create the url path map using [New-AzApplicationGatewayUrlPathMapConfig](/powershell/module/az.network/new-azapplicationgatewayurlpathmapconfig)

```azurepowershell-interactive
$PathRuleConfig = New-AzApplicationGatewayPathRuleConfig `
  -Name images -Paths "/images" `
  -BackendAddressPool $defaultPool `
  -BackendHttpSettings $poolSettings `
  -FirewallPolicy $wafPolicyURI

$PathRuleConfig1 = New-AzApplicationGatewayPathRuleConfig `
  -Name videos -Paths "/videos" `
  -BackendAddressPool $defaultPool `
  -BackendHttpSettings $poolSettings `
  -FirewallPolicy $wafPolicyURI

$PathRuleConfig2 = New-AzApplicationGatewayPathRuleConfig `
  -Name iisstart -Paths "/iisstart.htm" `
  -BackendAddressPool $defaultPool `
  -BackendHttpSettings $poolSettings `
  -FirewallPolicy $wafPolicyURI

$URLPathMap = New-AzApplicationGatewayUrlPathMapConfig `
  -Name URLPathMap `
  -PathRules $PathRuleConfig, $PathRuleConfig1, $PathRuleConfig2 `
  -DefaultBackendAddressPool $defaultPool `
  -DefaultBackendHttpSettings $poolSettings
```

### Create the default listener and rule

A listener is required to enable the application gateway to route traffic appropriately to the backend address pools. In this example, you create a basic listener that listens for traffic at the root URL. 

Create a listener named *mydefaultListener* using [New-AzApplicationGatewayHttpListener](/powershell/module/az.network/new-azapplicationgatewayhttplistener) with the frontend configuration and frontend port that you previously created. A rule is required for the listener to know which backend pool to use for incoming traffic. Create a pathBasedRouting rule named *rule1* using [New-AzApplicationGatewayRequestRoutingRule](/powershell/module/az.network/new-azapplicationgatewayrequestroutingrule).

```azurepowershell-interactive
$globalListener = New-AzApplicationGatewayHttpListener `
  -Name mydefaultListener80 `
  -Protocol Http `
  -FrontendIPConfiguration $fipconfig `
  -FrontendPort $frontendport80

$frontendRule = New-AzApplicationGatewayRequestRoutingRule `
  -Name rule1 `
  -RuleType PathBasedRouting `
  -HttpListener $globallistener `
  -BackendAddressPool $defaultPool `
  -BackendHttpSettings $poolSettings `
  -UrlPathMap $URLPathMap
  
$siteListener = New-AzApplicationGatewayHttpListener `
  -Name mydefaultListener8080 `
  -Protocol Http `
  -FrontendIPConfiguration $fipconfig `
  -FrontendPort $frontendport8080 `
  -FirewallPolicy $wafPolicySite
  
$frontendRuleSite = New-AzApplicationGatewayRequestRoutingRule `
  -Name rule2 `
  -RuleType Basic `
  -HttpListener $siteListener `
  -BackendAddressPool $defaultPool `
  -BackendHttpSettings $poolSettings
```

### Create the application gateway with the WAF

Now that you created the necessary supporting resources, specify parameters for the application gateway using [New-AzApplicationGatewaySku](/powershell/module/az.network/new-azapplicationgatewaysku). Specify the Firewall Policy using [New-AzApplicationGatewayFirewallPolicy](/powershell/module/az.network/new-azapplicationgatewayfirewallpolicy). And then create the application gateway named *myAppGateway* using [New-AzApplicationGateway](/powershell/module/az.network/new-azapplicationgateway). The application gateway allows for two front ends, listening on port 80 and port 8080. The port 80 front end allows for pathBasedRouting, where the 'wafpolicyGlobal' policy and also the URI scoped policy 'wafpolicyURI' have been associated. The port 8080 front end allows for Basic routing and the 'wafpolicySite' policy has been associated. 

```azurepowershell-interactive
$sku = New-AzApplicationGatewaySku `
  -Name WAF_v2 `
  -Tier WAF_v2 `
  -Capacity 2

$appgw = New-AzApplicationGateway `
  -Name myAppGateway `
  -ResourceGroupName myResourceGroupAG `
  -Location eastus `
  -BackendAddressPools $defaultPool `
  -BackendHttpSettingsCollection $poolSettings `
  -FrontendIpConfigurations $fipconfig `
  -GatewayIpConfigurations $gipconfig `
  -FrontendPorts $frontendport80,$frontendport8080 `
  -HttpListeners $globallistener,$siteListener `
  -RequestRoutingRules $frontendRule,$frontendRuleSite `
  -Sku $sku `
  -FirewallPolicy $wafPolicyGlobal `
  -UrlPathMaps $URLPathMap
```

## Create a virtual machine scale set

In this example, you create a virtual machine scale set to provide servers for the backend pool in the application gateway. You assign the scale set to the backend pool when you configure the IP settings.

```azurepowershell-interactive
$vnet = Get-AzVirtualNetwork `
  -ResourceGroupName myResourceGroupAG `
  -Name myVNet

$myBackEndSubnetID = $vnet.Subnets | where Name -match myBackendSubnet | foreach Id

$appgw = Get-AzApplicationGateway `
  -ResourceGroupName myResourceGroupAG `
  -Name myAppGateway

$backendPool = Get-AzApplicationGatewayBackendAddressPool `
  -Name appGatewayBackendPool `
  -ApplicationGateway $appgw

$ipConfig = New-AzVmssIpConfig `
  -Name myVmssIPConfig `
  -SubnetId $myBackEndSubnetID `
  -ApplicationGatewayBackendAddressPoolsId $backendPool.Id

$vmssConfig = New-AzVmssConfig `
  -Location eastus `
  -SkuCapacity 2 `
  -SkuName Standard_DS2 `
  -UpgradePolicyMode Automatic

Set-AzVmssStorageProfile $vmssConfig `
  -ImageReferencePublisher MicrosoftWindowsServer `
  -ImageReferenceOffer WindowsServer `
  -ImageReferenceSku 2016-Datacenter `
  -ImageReferenceVersion latest `
  -OsDiskCreateOption FromImage

Set-AzVmssOsProfile $vmssConfig `
  -AdminUsername azureuser `
  -AdminPassword "Azure123456!" `
  -ComputerNamePrefix myvmss

Add-AzVmssNetworkInterfaceConfiguration `
  -VirtualMachineScaleSet $vmssConfig `
  -Name myVmssNetConfig `
  -Primary $true `
  -IPConfiguration $ipConfig

New-AzVmss `
  -ResourceGroupName myResourceGroupAG `
  -Name myvmss `
  -VirtualMachineScaleSet $vmssConfig
```

### Install IIS

```azurepowershell-interactive
$publicSettings = @{ "fileUris" = (,"https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/application-gateway/iis/appgatewayurl.ps1"); 
  "commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File appgatewayurl.ps1" }

$vmss = Get-AzVmss -ResourceGroupName myResourceGroupAG -VMScaleSetName myvmss

Add-AzVmssExtension -VirtualMachineScaleSet $vmss `
  -Name "customScript" `
  -Publisher "Microsoft.Compute" `
  -Type "CustomScriptExtension" `
  -TypeHandlerVersion 1.8 `
  -Setting $publicSettings

Update-AzVmss `
  -ResourceGroupName myResourceGroupAG `
  -Name myvmss `
  -VirtualMachineScaleSet $vmss
```

## Create a storage account and configure diagnostics

In this article, the application gateway uses a storage account to store data for detection and prevention purposes. You could also use Azure Monitor logs or Event Hub to record data.

Configure diagnostics to record data into the ApplicationGatewayAccessLog, ApplicationGatewayPerformanceLog, and ApplicationGatewayFirewallLog logs using [Set-AzDiagnosticSetting](/powershell/module/az.monitor/set-azdiagnosticsetting).

### Create the storage account

Create a storage account with random guid name, using [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount).

```azurepowershell-interactive
# generate random/unique storage account name
$saname = -join ((new-guid).guid)[0..24] -replace '-',''

$storageAccount = New-AzStorageAccount `
  -ResourceGroupName myResourceGroupAG `
  -Name $saname `
  -Location eastus `
  -SkuName "Standard_LRS"

$appgw = Get-AzApplicationGateway `
  -ResourceGroupName myResourceGroupAG `
  -Name myAppGateway

Set-AzDiagnosticSetting `
  -ResourceId $appgw.Id `
  -StorageAccountId $storageAccount.Id `
  -Category ApplicationGatewayAccessLog, ApplicationGatewayPerformanceLog, ApplicationGatewayFirewallLog `
  -Enabled $true `
  -RetentionEnabled $true `
  -RetentionInDays 30
```

## Test the application gateway

You can use [Get-AzPublicIPAddress](/powershell/module/az.network/get-azpublicipaddress) to get the public IP address of the application gateway. Then use this IP address to curl against. 

```azurepowershell-interactive
${wafIP} = Get-AzPublicIPAddress -ResourceGroupName myResourceGroupAG -Name myAGPublicIPAddress | foreach IpAddress

#1 Global Default allow
$default = "${wafIP}"
curl $default
#> myvmss000001

#2 wafpolicyGlobal allow
$defaultdefaultallow = "${wafIP}/Default.htm"
curl $defaultdefaultallow
#> myvmss000001

#3 wafpolicyGlobal deny [Default]
$defaultdefaultblock = "${wafIP}/Default"
curl $defaultdefaultblock
#> 403 Forbidden

#4 wafpolicyGlobal deny [iisstart]
$defaultiisstartblock = "${wafIP}/iisstart"
curl $defaultiisstartblock
#> 403 Forbidden

#5 wafpolicyGlobal deny [8080/images/test.htm]
$defaulttestblock = "${wafIP}/8080/images/test.htm"
curl $defaulttestblock
#> 403 Forbidden

#6 wafpolicySite allow [8080/images/test.htm] - Site overrides previous block at Global Default
$site8080imagestestallow = "${wafIP}:8080/images/test.htm"
curl $site8080imagestestallow
#> Images: myvmss000002

#7 wafpolicySite deny [images]
$site8080imagesblock = "${wafIP}:8080/images"
curl $site8080imagesblock
#> 403 Forbidden

#8 wafpolicySite deny [8080/video/test.htm]
$site8080videodeny = "${wafIP}:8080/8080/video/test.htm"
curl $site8080videodeny
#> 403 Forbidden

#9 wafpolicyURI allow [video/test.htm] - URI overrides previous block at Site Default8080
$uri8080videotestsllow = "${wafIP}:8080/video/test.htm"
curl $uri8080videotestsllow
#> Video: myvmss000002

#10 wafpolicyURI allow [video/test.htm] - same as previous works at Default or Default8080
$urivideotestallow = "${wafIP}/video/test.htm"
curl $urivideotestallow
#> Video: myvmss000000

#11 wafpolicyURI deny [video] Default
$urivideodeny = "${wafIP}/video/"
curl $urivideodeny
#> 403 Forbidden

#12 wafpolicyURI deny [video] Default8080
$uri8080videodeny = "${wafIP}:8080/video/"
curl $uri8080videodeny
#> 403 Forbidden

#13 wafpolicyURI allow [iisstart.htm] - URI overrides previous block at Global Default8080
$uri8080iisstartallow = "${wafIP}:8080/iisstart.htm"
curl $uri8080iisstartallow
#> <title>IIS Windows Server</title>

#14 wafpolicyURI allow [iisstart.htm] - URI overrides previous block at Global Default
$uriiisstartallow = "${wafIP}/iisstart.htm"
curl $uriiisstartallow
#> <title>IIS Windows Server</title>
```

![Test base URL in application gateway](../media/tutorial-restrict-web-traffic-powershell/application-gateway-iistest.png)

## Clean up resources

When no longer needed, remove the resource group, application gateway, and all related resources using [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupAG
```

## Next steps

[Customize web application firewall rules](application-gateway-customize-waf-rules-portal.md)