---
title: How to use API Management in Virtual Network with Application Gateway
titleSuffix: Azure API Management
description: Learn how to setup and configure Azure API Management in Internal Virtual Network with Application Gateway (WAF) as FrontEnd
services: api-management
documentationcenter: ''
author: solankisamir
manager: kjoshi
editor: vlvinogr

ms.assetid: a8c982b2-bca5-4312-9367-4a0bbc1082b1
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 11/04/2019
ms.author: sasolank 
ms.custom: devx-track-azurepowershell

---
# Integrate API Management in an internal VNET with Application Gateway

## <a name="overview"> </a> Overview

The API Management service can be configured in a Virtual Network in internal mode, which makes it accessible only from within the Virtual Network. Azure Application Gateway is a PAAS Service, which provides a Layer-7 load balancer. It acts as a reverse-proxy service and provides among its offering a Web Application Firewall (WAF).

Combining API Management provisioned in an internal VNET with the Application Gateway frontend enables the following scenarios:

* Use the same API Management resource for consumption by both internal consumers and external consumers.
* Use a single API Management resource and have a subset of APIs defined in API Management available for external consumers.
* Provide a turn-key way to switch access to API Management from the public Internet on and off.

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To follow the steps described in this article, you must have:

* An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

* Certificates - pfx and cer for the API hostname and pfx for the developer portal's hostname.

## <a name="scenario"> </a> Scenario

This article covers how to use a single API Management service for both internal and external consumers and make it act as a single frontend for both on premises and cloud APIs. You will also see how to expose only a subset of your APIs (in the example they are highlighted in green) for External Consumption using routing functionality available in Application Gateway.

In the first setup example all your APIs are managed only from within your Virtual Network. Internal consumers (highlighted in orange) can access all your internal and external APIs. Traffic never goes out to the internet. High performance connectivity is delivered via Express Route circuits.

![url route](./media/api-management-howto-integrate-internal-vnet-appgateway/api-management-howto-integrate-internal-vnet-appgateway.png)

## <a name="before-you-begin"> </a> Before you begin

* Make sure that you are using the latest version of Azure PowerShell. See the installation instructions at [Install Azure PowerShell](/powershell/azure/install-az-ps). 

## What is required to create an integration between API Management and Application Gateway?

* **Back-end server pool:** This is the internal virtual IP address of the API Management service.
* **Back-end server pool settings:** Every pool has settings like port, protocol, and cookie-based affinity. These settings are applied to all servers within the pool.
* **Front-end port:** This is the public port that is opened on the application gateway. Traffic hitting it gets redirected to one of the back-end servers.
* **Listener:** The listener has a front-end port, a protocol (Http or Https, these values are case-sensitive), and the TLS/SSL certificate name (if configuring TLS offload).
* **Rule:** The rule binds a listener to a back-end server pool.
* **Custom Health Probe:** Application Gateway, by default, uses IP address based probes to figure out which servers in the BackendAddressPool are active. The API Management service only responds to requests with the correct host header, hence the default probes fail. A custom health probe needs to be defined to help application gateway determine that the service is alive and it should forward requests.
* **Custom domain certificates:** To access API Management from the internet, you need to create a CNAME mapping of its hostname to the Application Gateway front-end DNS name. This ensures that the hostname header and certificate sent to Application Gateway that is forwarded to API Management is one APIM can recognize as valid. In this example, we will use two certificates - for the backend and for the developer portal.  

## <a name="overview-steps"> </a> Steps required for integrating API Management and Application Gateway

1. Create a resource group for Resource Manager.
2. Create a Virtual Network, subnet, and public IP for the Application Gateway. Create another subnet for API Management.
3. Create an API Management service inside the VNET subnet created above and ensure you use the Internal mode.
4. Set up a custom domain name in the API Management service.
5. Create an Application Gateway configuration object.
6. Create an Application Gateway resource.
7. Create a CNAME from the public DNS name of the Application Gateway to the API Management proxy hostname.

## Exposing the developer portal externally through Application Gateway

In this guide we will also expose the **developer portal** to external audiences through the Application Gateway. It requires additional steps to create developer portal's listener, probe, settings and rules. All details are provided in respective steps.

> [!WARNING]
> If you use Azure AD or third party authentication, please enable [cookie-based session affinity](../application-gateway/features.md#session-affinity) feature in Application Gateway.

> [!WARNING]
> To prevent Application Gateway WAF from breaking the download of OpenAPI specification in the developer portal, you need to disable the firewall rule `942200 - "Detects MySQL comment-/space-obfuscated injections and backtick termination"`.
> 
> Application Gateway WAF rules, which may break portal's functionality include:
> 
> - `920300`, `920330`, `931130`, `942100`, `942110`, `942180`, `942200`, `942260`, `942340`, `942370` for the administrative mode
> - `942200`, `942260`, `942370`, `942430`, `942440` for the published portal

## Create a resource group for Resource Manager

### Step 1

Log in to Azure

```powershell
Connect-AzAccount
```

Authenticate with your credentials.

### Step 2

Select the desired subscription.

```powershell
$subscriptionId = "00000000-0000-0000-0000-000000000000" # GUID of your Azure subscription
Get-AzSubscription -Subscriptionid $subscriptionId | Select-AzSubscription
```

### Step 3

Create a resource group (skip this step if you're using an existing resource group).

```powershell
$resGroupName = "apim-appGw-RG" # resource group name
$location = "West US"           # Azure region
New-AzResourceGroup -Name $resGroupName -Location $location
```

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway use the same resource group.

## Create a Virtual Network and a subnet for the application gateway

The following example shows how to create a Virtual Network using Resource Manager.

### Step 1

Assign the address range 10.0.0.0/24 to the subnet variable to be used for Application Gateway while creating a Virtual Network.

```powershell
$appgatewaysubnet = New-AzVirtualNetworkSubnetConfig -Name "apim01" -AddressPrefix "10.0.0.0/24"
```

### Step 2

Assign the address range 10.0.1.0/24 to the subnet variable to be used for API Management while creating a Virtual Network.

```powershell
$apimsubnet = New-AzVirtualNetworkSubnetConfig -Name "apim02" -AddressPrefix "10.0.1.0/24"
```

### Step 3

Create a Virtual Network named **appgwvnet** in resource group **apim-appGw-RG** for the West US region. Use the prefix 10.0.0.0/16 with subnets 10.0.0.0/24 and 10.0.1.0/24.

```powershell
$vnet = New-AzVirtualNetwork -Name "appgwvnet" -ResourceGroupName $resGroupName -Location $location -AddressPrefix "10.0.0.0/16" -Subnet $appgatewaysubnet,$apimsubnet
```

### Step 4

Assign a subnet variable for the next steps

```powershell
$appgatewaysubnetdata = $vnet.Subnets[0]
$apimsubnetdata = $vnet.Subnets[1]
```

## Create an API Management service inside a VNET configured in internal mode

The following example shows how to create an API Management service in a VNET configured for internal access only.

### Step 1

Create an API Management Virtual Network object using the subnet $apimsubnetdata created above.

```powershell
$apimVirtualNetwork = New-AzApiManagementVirtualNetwork -SubnetResourceId $apimsubnetdata.Id
```

### Step 2

Create an API Management service inside the Virtual Network.

```powershell
$apimServiceName = "ContosoApi"       # API Management service instance name
$apimOrganization = "Contoso"         # organization name
$apimAdminEmail = "admin@contoso.com" # administrator's email address
$apimService = New-AzApiManagement -ResourceGroupName $resGroupName -Location $location -Name $apimServiceName -Organization $apimOrganization -AdminEmail $apimAdminEmail -VirtualNetwork $apimVirtualNetwork -VpnType "Internal" -Sku "Developer"
```

After the above command succeeds refer to [DNS Configuration required to access internal VNET API Management service](api-management-using-with-internal-vnet.md#apim-dns-configuration) to access it. This step may take more than half an hour.

## Set-up a custom domain name in API Management

> [!IMPORTANT]
> The [new developer portal](api-management-howto-developer-portal.md) also requires enabling connectivity to the API Management's management endpoint in addition to the steps below.

### Step 1

Initialize the following variables with the details of the certificates with private keys for the domains. In this example, we will use `api.contoso.net` and `portal.contoso.net`.  

```powershell
$gatewayHostname = "api.contoso.net"                 # API gateway host
$portalHostname = "portal.contoso.net"               # API developer portal host
$gatewayCertCerPath = "C:\Users\Contoso\gateway.cer" # full path to api.contoso.net .cer file
$gatewayCertPfxPath = "C:\Users\Contoso\gateway.pfx" # full path to api.contoso.net .pfx file
$portalCertPfxPath = "C:\Users\Contoso\portal.pfx"   # full path to portal.contoso.net .pfx file
$gatewayCertPfxPassword = "certificatePassword123"   # password for api.contoso.net pfx certificate
$portalCertPfxPassword = "certificatePassword123"    # password for portal.contoso.net pfx certificate

$certPwd = ConvertTo-SecureString -String $gatewayCertPfxPassword -AsPlainText -Force
$certPortalPwd = ConvertTo-SecureString -String $portalCertPfxPassword -AsPlainText -Force
```

### Step 2

Create and set the hostname configuration objects for the proxy and for the portal.  

```powershell
$proxyHostnameConfig = New-AzApiManagementCustomHostnameConfiguration -Hostname $gatewayHostname -HostnameType Proxy -PfxPath $gatewayCertPfxPath -PfxPassword $certPwd
$portalHostnameConfig = New-AzApiManagementCustomHostnameConfiguration -Hostname $portalHostname -HostnameType DeveloperPortal -PfxPath $portalCertPfxPath -PfxPassword $certPortalPwd

$apimService.ProxyCustomHostnameConfiguration = $proxyHostnameConfig
$apimService.PortalCustomHostnameConfiguration = $portalHostnameConfig
Set-AzApiManagement -InputObject $apimService
```

> [!NOTE]
> To configure the legacy developer portal connectivity you need to replace `-HostnameType DeveloperPortal` with `-HostnameType Portal`.

## Create a public IP address for the front-end configuration

Create a public IP resource **publicIP01** in the resource group.

```powershell
$publicip = New-AzPublicIpAddress -ResourceGroupName $resGroupName -name "publicIP01" -location $location -AllocationMethod Dynamic
```

An IP address is assigned to the application gateway when the service starts.

## Create application gateway configuration

All configuration items must be set up before creating the application gateway. The following steps create the configuration items that are needed for an application gateway resource.

### Step 1

Create an application gateway IP configuration named **gatewayIP01**. When Application Gateway starts, it picks up an IP address from the subnet configured and route network traffic to the IP addresses in the back-end IP pool. Keep in mind that each instance takes one IP address.

```powershell
$gipconfig = New-AzApplicationGatewayIPConfiguration -Name "gatewayIP01" -Subnet $appgatewaysubnetdata
```

### Step 2

Configure the front-end IP port for the public IP endpoint. This port is the port that end users connect to.

```powershell
$fp01 = New-AzApplicationGatewayFrontendPort -Name "port01"  -Port 443
```

### Step 3

Configure the front-end IP with public IP endpoint.

```powershell
$fipconfig01 = New-AzApplicationGatewayFrontendIPConfig -Name "frontend1" -PublicIPAddress $publicip
```

### Step 4

Configure the certificates for the Application Gateway, which will be used to decrypt and re-encrypt the traffic passing through.

```powershell
$cert = New-AzApplicationGatewaySslCertificate -Name "cert01" -CertificateFile $gatewayCertPfxPath -Password $certPwd
$certPortal = New-AzApplicationGatewaySslCertificate -Name "cert02" -CertificateFile $portalCertPfxPath -Password $certPortalPwd
```

### Step 5

Create the HTTP listeners for the Application Gateway. Assign the front-end IP configuration, port, and TLS/SSL certificates to them.

```powershell
$listener = New-AzApplicationGatewayHttpListener -Name "listener01" -Protocol "Https" -FrontendIPConfiguration $fipconfig01 -FrontendPort $fp01 -SslCertificate $cert -HostName $gatewayHostname -RequireServerNameIndication true
$portalListener = New-AzApplicationGatewayHttpListener -Name "listener02" -Protocol "Https" -FrontendIPConfiguration $fipconfig01 -FrontendPort $fp01 -SslCertificate $certPortal -HostName $portalHostname -RequireServerNameIndication true
```

### Step 6

Create custom probes to the API Management service `ContosoApi` proxy domain endpoint. The path `/status-0123456789abcdef` is a default health endpoint hosted on all the API Management services. Set `api.contoso.net` as a custom probe hostname to secure it with the TLS/SSL certificate.

> [!NOTE]
> The hostname `contosoapi.azure-api.net` is the default proxy hostname configured when a service named `contosoapi` is created in public Azure.
>

```powershell
$apimprobe = New-AzApplicationGatewayProbeConfig -Name "apimproxyprobe" -Protocol "Https" -HostName $gatewayHostname -Path "/status-0123456789abcdef" -Interval 30 -Timeout 120 -UnhealthyThreshold 8
$apimPortalProbe = New-AzApplicationGatewayProbeConfig -Name "apimportalprobe" -Protocol "Https" -HostName $portalHostname -Path "/internal-status-0123456789abcdef" -Interval 60 -Timeout 300 -UnhealthyThreshold 8
```

### Step 7

Upload the certificate to be used on the TLS-enabled backend pool resources. This is the same certificate which you provided in Step 4 above.

```powershell
$authcert = New-AzApplicationGatewayAuthenticationCertificate -Name "whitelistcert1" -CertificateFile $gatewayCertCerPath
```

### Step 8

Configure HTTP backend settings for the Application Gateway. This includes setting a time-out limit for backend request, after which they're canceled. This value is different from the probe time-out.

```powershell
$apimPoolSetting = New-AzApplicationGatewayBackendHttpSettings -Name "apimPoolSetting" -Port 443 -Protocol "Https" -CookieBasedAffinity "Disabled" -Probe $apimprobe -AuthenticationCertificates $authcert -RequestTimeout 180
$apimPoolPortalSetting = New-AzApplicationGatewayBackendHttpSettings -Name "apimPoolPortalSetting" -Port 443 -Protocol "Https" -CookieBasedAffinity "Disabled" -Probe $apimPortalProbe -AuthenticationCertificates $authcert -RequestTimeout 180
```

### Step 9

Configure a back-end IP address pool named **apimbackend**  with the internal virtual IP address of the API Management service created above.

```powershell
$apimProxyBackendPool = New-AzApplicationGatewayBackendAddressPool -Name "apimbackend" -BackendIPAddresses $apimService.PrivateIPAddresses[0]
```

### Step 10

Create rules for the Application Gateway to use basic routing.

```powershell
$rule01 = New-AzApplicationGatewayRequestRoutingRule -Name "rule1" -RuleType Basic -HttpListener $listener -BackendAddressPool $apimProxyBackendPool -BackendHttpSettings $apimPoolSetting
$rule02 = New-AzApplicationGatewayRequestRoutingRule -Name "rule2" -RuleType Basic -HttpListener $portalListener -BackendAddressPool $apimProxyBackendPool -BackendHttpSettings $apimPoolPortalSetting
```

> [!TIP]
> Change the -RuleType and routing, to restrict access to certain pages of the developer portal.

### Step 11

Configure the number of instances and size for the Application Gateway. In this example, we are using the [WAF SKU](../web-application-firewall/ag/ag-overview.md) for increased security of the API Management resource.

```powershell
$sku = New-AzApplicationGatewaySku -Name "WAF_Medium" -Tier "WAF" -Capacity 2
```

### Step 12

Configure WAF to be in "Prevention" mode.

```powershell
$config = New-AzApplicationGatewayWebApplicationFirewallConfiguration -Enabled $true -FirewallMode "Prevention"
```

## Create Application Gateway

Create an Application Gateway with all the configuration objects from the preceding steps.

```powershell
$appgwName = "apim-app-gw"
$appgw = New-AzApplicationGateway -Name $appgwName -ResourceGroupName $resGroupName -Location $location -BackendAddressPools $apimProxyBackendPool -BackendHttpSettingsCollection $apimPoolSetting, $apimPoolPortalSetting  -FrontendIpConfigurations $fipconfig01 -GatewayIpConfigurations $gipconfig -FrontendPorts $fp01 -HttpListeners $listener, $portalListener -RequestRoutingRules $rule01, $rule02 -Sku $sku -WebApplicationFirewallConfig $config -SslCertificates $cert, $certPortal -AuthenticationCertificates $authcert -Probes $apimprobe, $apimPortalProbe
```

## CNAME the API Management proxy hostname to the public DNS name of the Application Gateway resource

Once the gateway is created, the next step is to configure the front end for communication. When using a public IP, Application Gateway requires a dynamically assigned DNS name, which may not be easy to use.

The Application Gateway's DNS name should be used to create a CNAME record which points the APIM proxy host name (e.g. `api.contoso.net` in the examples above) to this DNS name. To configure the frontend IP CNAME record, retrieve the details of the Application Gateway and its associated IP/DNS name using the PublicIPAddress element. The use of A-records is not recommended since the VIP may change on restart of gateway.

```powershell
Get-AzPublicIpAddress -ResourceGroupName $resGroupName -Name "publicIP01"
```

## <a name="summary"> </a> Summary
Azure API Management configured in a VNET provides a single gateway interface for all configured APIs, whether they are hosted on premises or in the cloud. Integrating Application Gateway with API Management provides the flexibility of selectively enabling particular APIs to be accessible on the Internet, as well as providing a Web Application Firewall as a frontend to your API Management instance.

## <a name="next-steps"> </a> Next steps
* Learn more about Azure Application Gateway
  * [Application Gateway Overview](../application-gateway/overview.md)
  * [Application Gateway Web Application Firewall](../web-application-firewall/ag/ag-overview.md)
  * [Application Gateway using Path-based Routing](../application-gateway/tutorial-url-route-powershell.md)
* Learn more about API Management and VNETs
  * [Using API Management available only within the VNET](api-management-using-with-internal-vnet.md)
  * [Using API Management in VNET](api-management-using-with-vnet.md)
