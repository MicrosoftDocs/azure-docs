---
title: Create a custom probe for Application Gateway by using PowerShell in Resource Manager | Microsoft Docs
description: Learn how to create a custom probe for Application Gateway by using PowerShell in Resource Manager
services: application-gateway
documentationcenter: na
author: georgewallace
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.assetid: 68feb660-7fa4-4f69-a7e4-bdd7bdc474db
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/06/2016
ms.author: gwallace

---
# Create a custom probe for Azure Application Gateway by using PowerShell for Azure Resource Manager
> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-probe-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-probe-ps.md)
> * [Azure Classic PowerShell](application-gateway-create-probe-classic-ps.md)
> 
> 

[!INCLUDE [azure-probe-intro-include](../../includes/application-gateway-create-probe-intro-include.md)]

[!INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)]

[classic deployment model](application-gateway-create-probe-classic-ps.md).

[!INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]

### Step 1
Use Login-AzureRmAccount to authenticate.

```powershell
Login-AzureRmAccount
```

### Step 2
Check the subscriptions for the account.

```powershell
Get-AzureRmSubscription
```

### Step 3
Choose which of your Azure subscriptions to use. <BR>

```powershell
Select-AzureRmSubscription -Subscriptionid "GUID of subscription"
```

### Step 4
Create a resource group (skip this step if you're using an existing resource group).

```powershell
New-AzureRmResourceGroup -Name appgw-rg -Location "West US"
```

Azure Resource Manager requires that all resource groups specify a location. This location is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway use the same resource group.

In the example above, we created a resource group called "appgw-RG" and location "West US".

## Create a virtual network and a subnet for the application gateway
The following steps create a virtual network and a subnet for the application gateway.

### Step 1
Assign the address range 10.0.0.0/24 to a subnet variable to be used to create a virtual network.

```powershell
$subnet = New-AzureRmVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24
```

### Step 2
Create a virtual network named "appgwvnet" in resource group "appgw-rg" for the West US region using the prefix 10.0.0.0/16 with subnet 10.0.0.0/24.

```powershell
$vnet = New-AzureRmVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
```

### Step 3
Assign a subnet variable for the next steps, which create an application gateway.

```powershell
$subnet = $vnet.Subnets[0]
```

## Create a public IP address for the front-end configuration
Create a public IP resource "publicIP01" in resource group "appgw-rg" for the West US region.

```powershell
$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-rg -Name publicIP01 -Location "West US" -AllocationMethod Dynamic
```

## Create an application gateway configuration object with a custom probe
You set up all configuration items before creating the application gateway. The following steps create the configuration items that are needed for an application gateway resource.

### Step 1
Create an application gateway IP configuration named "gatewayIP01". When Application Gateway starts, it picks up an IP address from the subnet configured and route network traffic to the IP addresses in the back-end IP pool. Keep in mind that each instance takes one IP address.

```powershell
$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet
```

### Step 2
Configure the back-end IP address pool named "pool01" with IP addresses "134.170.185.46, 134.170.188.221,134.170.185.50". Those values are the IP addresses that receive the network traffic that comes from the front-end IP endpoint. You replace the IP addresses above to add your own application IP address endpoints.

```powershell
$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221,134.170.185.50
```

### Step 3
The custom probe is configured in this step.

The parameters used are:

* **Interval** - Configures the probe interval checks in seconds.
* **Timeout** - Defines the probe time-out for an HTTP response check.
* **-Hostname and path** - Complete URL path that is invoked by Application Gateway to determine the health of the instance. For example, if you have a website http://contoso.com/, then the custom probe can be configured for "http://contoso.com/path/custompath.htm" for probe checks to have a successful HTTP response.
* **UnhealthyThreshold** - The number of failed HTTP responses needed to flag the back-end instance as *unhealthy*.

```powershell
$probe = New-AzureRmApplicationGatewayProbeConfig -Name probe01 -Protocol Http -HostName "contoso.com" -Path "/path/path.htm" -Interval 30 -Timeout 120 -UnhealthyThreshold 8
```

### Step 4
Configure application gateway setting "poolsetting01" for the traffic in the back-end pool. This step also has a time-out configuration that is for the back-end pool response to an application gateway request. When a back-end response hits a time-out limit, Application Gateway cancels the request. This value is different from a probe time-out that is only for the back-end response to probe checks.

```powershell
$poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name poolsetting01 -Port 80 -Protocol Http -CookieBasedAffinity Disabled -Probe $probe -RequestTimeout 80
```

### Step 5
Configure the front-end IP port named "frontendport01" for the public IP endpoint.

```powershell
$fp = New-AzureRmApplicationGatewayFrontendPort -Name frontendport01 -Port 80
```

### Step 6
Create the front-end IP configuration named "fipconfig01" and associate the public IP address with the front-end IP configuration.

```powershell
$fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name fipconfig01 -PublicIPAddress $publicip
```

### Step 7
Create the listener name "listener01" and associate the front-end port to the front-end IP configuration.

```powershell
$listener = New-AzureRmApplicationGatewayHttpListener -Name listener01  -Protocol Http -FrontendIPConfiguration $fipconfig -FrontendPort $fp
```

### Step 8
Create the load balancer routing rule named "rule01" that configures the load balancer behavior.

```powershell
$rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool
```

### Step 9
Configure the instance size of the application gateway.

```powershell
$sku = New-AzureRmApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2
```


> [!NOTE]
> The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. You can choose between Standard_Small, Standard_Medium, and Standard_Large.
> 
> 

## Create an application gateway by using New-AzureRmApplicationGateway
Create an application gateway with all configuration items from the steps above. In this example, the application gateway is called "appgwtest".

```powershell
$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -Probes $probe -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku
```

## Add a probe to an existing application gateway
You have four steps to add a custom probe to an existing application gateway.

### Step 1
Load the application gateway resource into a PowerShell variable by using **Get-AzureRmApplicationGateway**.

```powershell
$getgw =  Get-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg
```

### Step 2
Add a probe to the existing gateway configuration.

```powershell
$getgw = Add-AzureRmApplicationGatewayProbeConfig -ApplicationGateway $getgw -Name probe01 -Protocol Http -HostName "contoso.com" -Path "/path/custompath.htm" -Interval 30 -Timeout 120 -UnhealthyThreshold 8
```


In the example, the custom probe is configured to check for URL path contoso.com/path/custompath.htm every 30 seconds. A time-out threshold of 120 seconds is configured with a maximum number of 8 failed probe requests.

### Step 3
Add the probe to the back-end pool setting configuration and time-out by using **-Set-AzureRmApplicationGatewayBackendHttpSettings**.

```powershell
    $getgw = Set-AzureRmApplicationGatewayBackendHttpSettings -ApplicationGateway $getgw -Name $getgw.BackendHttpSettingsCollection.name -Port 80 -Protocol Http -CookieBasedAffinity Disabled -Probe $probe -RequestTimeout 120
```

### Step 4
Save the configuration to the application gateway by using **Set-AzureRmApplicationGateway**.

```powershell
Set-AzureRmApplicationGateway -ApplicationGateway $getgw
```

## Remove a probe from an existing application gateway
Here are the steps to remove a custom probe from an existing application gateway.

### Step 1
Load the application gateway resource into a PowerShell variable by using **Get-AzureRmApplicationGateway**.

```powershell
$getgw =  Get-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg
```


### Step 2
Remove the probe configuration from the application gateway by using **Remove-AzureRmApplicationGatewayProbeConfig**.

```powershell
$getgw = Remove-AzureRmApplicationGatewayProbeConfig -ApplicationGateway $getgw -Name $getgw.Probes.name
```

### Step 3
Update the back-end pool setting to remove the probe and time-out setting by using **-Set-AzureRmApplicationGatewayBackendHttpSettings**.

```powershell
    $getgw = Set-AzureRmApplicationGatewayBackendHttpSettings -ApplicationGateway $getgw -Name $getgw.BackendHttpSettingsCollection.name -Port 80 -Protocol http -CookieBasedAffinity Disabled
```

### Step 4
Save the configuration to the application gateway by using **Set-AzureRmApplicationGateway**. 

```powershell
Set-AzureRmApplicationGateway -ApplicationGateway $getgw
```

## Get application gateway DNS name
Once the gateway is created, the next step is to configure the front end for communication. When using a public IP, application gateway requires a dynamically assigned DNS name, which is not friendly. To ensure end users can hit the application gateway a CNAME record can be used to point to the public endpoint of the application gateway. [Configuring a custom domain name for in Azure](../cloud-services/cloud-services-custom-domain-name-portal.md). To do this, retrieve details of the application gateway and its associated IP/DNS name using the PublicIPAddress element attached to the application gateway. The application gateway's DNS name should be used to create a CNAME record, which points the two web applications to this DNS name. The use of A-records is not recommended since the VIP may change on restart of application gateway.

```powershell
Get-AzureRmPublicIpAddress -ResourceGroupName appgw-RG -Name publicIP01

Name                     : publicIP01
ResourceGroupName        : appgw-RG
Location                 : westus
Id                       : /subscriptions/<subscription_id>/resourceGroups/appgw-RG/providers/Microsoft.Network/publicIPAddresses/publicIP01
Etag                     : W/"00000d5b-54ed-4907-bae8-99bd5766d0e5"
ResourceGuid             : 00000000-0000-0000-0000-000000000000
ProvisioningState        : Succeeded
Tags                     : 
PublicIpAllocationMethod : Dynamic
IpAddress                : xx.xx.xxx.xx
PublicIpAddressVersion   : IPv4
IdleTimeoutInMinutes     : 4
IpConfiguration          : {
                                "Id": "/subscriptions/<subscription_id>/resourceGroups/appgw-RG/providers/Microsoft.Network/applicationGateways/appgwtest/frontendIP
                            Configurations/frontend1"
                            }
DnsSettings              : {
                                "Fqdn": "00000000-0000-xxxx-xxxx-xxxxxxxxxxxx.cloudapp.net"
                            }
```

## Next steps
Learn to configure SSL offloading by visiting [Configure SSL Offload](application-gateway-ssl-arm.md)

