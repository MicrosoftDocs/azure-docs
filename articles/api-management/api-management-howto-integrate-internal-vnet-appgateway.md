---
title: How to use API Management in a virtual network with Azure Application Gateway
titleSuffix: Azure API Management
description: Set up and configure Azure API Management in an internal virtual network with Application Gateway (Web Application Firewall) as a front end
services: api-management
documentationcenter: ''
author: solankisamir

ms.service: api-management
ms.topic: how-to
ms.author: sasolank
ms.date: 06/10/2021
ms.custom: devx-track-azurepowershell,contperf-fy21q4

---
# Integrate API Management in an internal virtual network with Application Gateway

You can configure the API Management service in a [virtual network in internal mode](api-management-using-with-internal-vnet.md), making it accessible only within the virtual network. [Azure Application Gateway](../application-gateway/overview.md) is a PaaS service, acting as a Layer-7 load balancer. It acts as a reverse-proxy service and provides among its offerings a Web Application Firewall (WAF).

By combining API Management provisioned in an internal virtual network with the Application Gateway front end, you can:

* Use the same API Management resource for consumption by both internal consumers and external consumers.
* Use a single API Management resource and have a subset of APIs defined in API Management available for external consumers.
* Provide a turnkey way to switch access to API Management from the public internet on and off.

> [!NOTE]
> This article has been updated to use the [Application Gateway WAF_v2 SKU](../application-gateway/application-gateway-autoscaling-zone-redundant.md).

[!INCLUDE [premium-dev.md](../../includes/api-management-availability-premium-dev.md)]

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To follow the steps described in this article, you must have:

* An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

* Certificates
     - PFX files for the API Management service's custom hostnames: gateway, developer portal, and management endpoint. 
     - A CER file for the root certificate of the PFX certificates. 
     
    For more information, see [Certificates for the backend](../application-gateway/certificates-for-backend-authentication.md). For testing purposes, optionally generate [self-signed certificates](../application-gateway/self-signed-certificates.md).
* The latest version of Azure PowerShell. If you haven't already, [install Azure PowerShell](/powershell/azure/install-az-ps).

## Scenario

In this article, you learn how to Use a single API Management service for both internal and external consumers and make it act as a single front end for both on-premises and cloud APIs. You will also understand how to expose only a subset of your APIs (in the example they are highlighted in green) for external consumption using routing functionality available in Application Gateway.

In the first setup example, all your APIs are managed only from within your virtual network. Internal consumers (highlighted in orange) can access all your internal and external APIs. Traffic never goes out to the internet. High-performance connectivity can be delivered via Express Route circuits.

![url route](./media/api-management-howto-integrate-internal-vnet-appgateway/api-management-howto-integrate-internal-vnet-appgateway.png)

### What is required to integrate API Management and Application Gateway?

* **Backend server pool:** This is the internal virtual IP address of the API Management service.
* **Backend server pool settings:** Every pool has settings like port, protocol, and cookie-based affinity. These settings are applied to all servers within the pool.
* **Front-end port:** This is the public port that is opened on the application gateway. Traffic hitting it gets redirected to one of the back-end servers.
* **Listener:** The listener has a front-end port, a protocol (Http or Https, these values are case-sensitive), and the TLS/SSL certificate name (if configuring TLS offload).
* **Rule:** The rule binds a listener to a backend server pool.
* **Custom health probe:** Application Gateway, by default, uses IP address-based probes to figure out which servers in the BackendAddressPool are active. The API Management service only responds to requests with the correct host header, hence the default probes fail. You define a custom health probe to help the application gateway determine that the service is alive and it should forward requests.
* **Custom domain certificates:** To access API Management from the internet, you need to create a CNAME mapping of its hostname to the Application Gateway front-end DNS name. This ensures that the hostname header and certificate sent to Application Gateway and forwarded to API Management is one that API Management recognizes as valid. In this example, we will use three certificates - for the API Management service's gateway (the backend), the developer portal, and the management endpoint.  

## Steps required to integrate API Management and Application Gateway

1. Create a resource group for Resource Manager.
1. Create a virtual network, subnet, and public IP for the Application Gateway. Create another subnet for API Management.
1. Create an API Management service inside the virtual network subnet created in the previous step. Ensure you use the internal mode.
1. Set up custom domain names in the API Management service.
1. Configure a private DNS zone for DNS resolution in the virtual network
1. Create an Application Gateway configuration object.
1. Create an Application Gateway resource.
1. Create a CNAME from the public DNS name of the Application Gateway to the API Management proxy hostname.

### Expose the developer portal and management endpoint externally through Application Gateway

In this guide, we also expose the **developer portal** and the **management endpoint** to external audiences through the application gateway. Extra steps are needed to create a listener, probe, settings, and rules for each endpoint. All details are provided in respective steps.

> [!WARNING]
> If you use Azure AD or third party authentication, please enable the [cookie-based session affinity](../application-gateway/features.md#session-affinity) feature in Application Gateway.

> [!WARNING]
> To prevent Application Gateway WAF from breaking the download of OpenAPI specifications in the developer portal, you need to disable the firewall rule `942200 - "Detects MySQL comment-/space-obfuscated injections and backtick termination"`.
> 
> Application Gateway WAF rules that may break portal's functionality include:
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

## Create a virtual network and a subnet for the application gateway

The following example shows how to create a virtual network using Resource Manager. The virtual network in this example consists of separate subnets for Application Gateway and API Management.

### Step 1

Create network security groups and NSG rules for the Application Gateway and API Management subnets.

```powershell
$appGwRule1 = New-AzNetworkSecurityRuleConfig -Name appgw-in -Description "AppGw inbound" `
    -Access Allow -Protocol * -Direction Inbound -Priority 100 -SourceAddressPrefix `
    GatewayManager -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 65200-65535
$appGwNsg = New-AzNetworkSecurityGroup -ResourceGroupName $resGroupName -Location $location -Name `
    "NSG-APPGW" -SecurityRules $appGwRule1

$apimRule1 = New-AzNetworkSecurityRuleConfig -Name apim-in -Description "APIM inbound" `
    -Access Allow -Protocol Tcp -Direction Inbound -Priority 100 -SourceAddressPrefix `
    ApiManagement -SourcePortRange * -DestinationAddressPrefix VirtualNetwork -DestinationPortRange 3443
$apimNsg = New-AzNetworkSecurityGroup -ResourceGroupName $resGroupName -Location $location -Name `
    "NSG-APIM" -SecurityRules $apimRule1
```

### Step 2

Assign the address range 10.0.0.0/24 to the subnet variable to be used for Application Gateway while creating a virtual network.

```powershell
$appGatewaySubnet = New-AzVirtualNetworkSubnetConfig -Name "appGatewaySubnet" -NetworkSecurityGroup $appGwNsg -AddressPrefix "10.0.0.0/24"
```

### Step 3

Assign the address range 10.0.1.0/24 to the subnet variable to be used for API Management while creating a virtual network.

```powershell
$apimSubnet = New-AzVirtualNetworkSubnetConfig -Name "apimSubnet" -NetworkSecurityGroup $apimNsg -AddressPrefix "10.0.1.0/24"
```

### Step 4

Create a virtual network named **appgwvnet** in resource group **apim-appGw-RG** for the West US region. Use the prefix 10.0.0.0/16 with subnets 10.0.0.0/24 and 10.0.1.0/24.

```powershell
$vnet = New-AzVirtualNetwork -Name "appgwvnet" -ResourceGroupName $resGroupName `
  -Location $location -AddressPrefix "10.0.0.0/16" -Subnet $appGatewaySubnet,$apimSubnet
```

### Step 5

Assign subnet variables for the next steps

```powershell
$appGatewaySubnetData = $vnet.Subnets[0]
$apimSubnetData = $vnet.Subnets[1]
```

## Create an API Management service inside a virtual network configured in internal mode

The following example shows how to create an API Management service in a virtual network configured for internal access only.

### Step 1

Create an API Management virtual network object using the subnet `$apimSubnetData` created above.

```powershell
$apimVirtualNetwork = New-AzApiManagementVirtualNetwork -SubnetResourceId $apimSubnetData.Id
```

### Step 2

Create an API Management service inside the virtual network. This example creates the service in the Developer service tier. Substitute a unique name for your API Management service.

```powershell
$apimServiceName = "ContosoApi"       # API Management service instance name, must be globally unique
$apimOrganization = "Contoso"         # organization name
$apimAdminEmail = "admin@contoso.com" # administrator's email address
$apimService = New-AzApiManagement -ResourceGroupName $resGroupName -Location $location -Name $apimServiceName -Organization $apimOrganization -AdminEmail $apimAdminEmail -VirtualNetwork $apimVirtualNetwork -VpnType "Internal" -Sku "Developer"
```

It can take between 30 and 40 minutes to create and activate an API Management service in this tier. After the previous command succeeds, refer to [DNS Configuration required to access internal virtual network API Management service](api-management-using-with-internal-vnet.md#apim-dns-configuration) to confirm access it. 

## Set up custom domain names in API Management

### Step 1

Initialize the following variables with the details of the certificates with private keys for the domains and the trusted root certificate. In this example, we use `api.contoso.net`, `portal.contoso.net`, and `management.contoso.net`.  

```powershell
$gatewayHostname = "api.contoso.net"                 # API gateway host
$portalHostname = "portal.contoso.net"               # API developer portal host
$managementHostname = "management.contoso.net"               # API management endpoint host
$gatewayCertPfxPath = "C:\Users\Contoso\gateway.pfx" # full path to api.contoso.net .pfx file
$portalCertPfxPath = "C:\Users\Contoso\portal.pfx"   # full path to portal.contoso.net .pfx file
$managementCertPfxPath = "C:\Users\Contoso\management.pfx"   # full path to management.contoso.net .pfx file
$gatewayCertPfxPassword = "certificatePassword123"   # password for api.contoso.net pfx certificate
$portalCertPfxPassword = "certificatePassword123"    # password for portal.contoso.net pfx certificate
$managementCertPfxPassword = "certificatePassword123"    # password for management.contoso.net pfx certificate
# Path to trusted root CER file used in Application Gateway HTTP settings
$trustedRootCertCerPath = "C:\Users\Contoso\trustedroot.cer" # full path to contoso.net trusted root .cer file

$certGatewayPwd = ConvertTo-SecureString -String $gatewayCertPfxPassword -AsPlainText -Force
$certPortalPwd = ConvertTo-SecureString -String $portalCertPfxPassword -AsPlainText -Force
$certManagementPwd = ConvertTo-SecureString -String $managementCertPfxPassword -AsPlainText -Force
```

### Step 2

Create and set the hostname configuration objects for the API Management endpoints.  

```powershell
$gatewayHostnameConfig = New-AzApiManagementCustomHostnameConfiguration -Hostname $gatewayHostname `
  -HostnameType Proxy -PfxPath $gatewayCertPfxPath -PfxPassword $certGatewayPwd
$portalHostnameConfig = New-AzApiManagementCustomHostnameConfiguration -Hostname $portalHostname `
  -HostnameType DeveloperPortal -PfxPath $portalCertPfxPath -PfxPassword $certPortalPwd
$managementHostnameConfig = New-AzApiManagementCustomHostnameConfiguration -Hostname $managementHostname `
  -HostnameType Management -PfxPath $managementCertPfxPath -PfxPassword $certManagementPwd

$apimService.ProxyCustomHostnameConfiguration = $gatewayHostnameConfig
$apimService.PortalCustomHostnameConfiguration = $portalHostnameConfig
$apimService.ManagementCustomHostnameConfiguration = $managementHostnameConfig

Set-AzApiManagement -InputObject $apimService
```

> [!NOTE]
> To configure connectivity to the legacy developer portal, you need to replace `-HostnameType DeveloperPortal` with `-HostnameType Portal`.

## Configure a private zone for DNS resolution in the virtual network

### Step 1

Create a private DNS zone and link the virtual network.

```powershell
$myZone = New-AzPrivateDnsZone -Name "contoso.net" -ResourceGroupName $resGroupName 
$link = New-AzPrivateDnsVirtualNetworkLink -ZoneName contoso.net `
  -ResourceGroupName $resGroupName -Name "mylink" `
  -VirtualNetworkId $vnet.id
```

### Step 2

Create A-records for the custom domain hostnames, mapping to the private IP address of the API Management service:

```powershell
$apimIP = $apimService.PrivateIPAddresses[0]

New-AzPrivateDnsRecordSet -Name api -RecordType A -ZoneName contoso.net `
  -ResourceGroupName $resGroupName -Ttl 3600 `
  -PrivateDnsRecords (New-AzPrivateDnsRecordConfig -IPv4Address $apimIP)
New-AzPrivateDnsRecordSet -Name portal -RecordType A -ZoneName contoso.net `
  -ResourceGroupName $resGroupName -Ttl 3600 `
  -PrivateDnsRecords (New-AzPrivateDnsRecordConfig -IPv4Address $apimIP)
New-AzPrivateDnsRecordSet -Name management -RecordType A -ZoneName contoso.net `
  -ResourceGroupName $resGroupName -Ttl 3600 `
  -PrivateDnsRecords (New-AzPrivateDnsRecordConfig -IPv4Address $apimIP)
```

## Create a public IP address for the front-end configuration

Create a Standard public IP resource **publicIP01** in the resource group.

```powershell
$publicip = New-AzPublicIpAddress -ResourceGroupName $resGroupName `
  -name "publicIP01" -location $location -AllocationMethod Static -Sku Standard
```

An IP address is assigned to the application gateway when the service starts.

## Create application gateway configuration

All configuration items must be set up before creating the application gateway. The following steps create the configuration items that are needed for an application gateway resource.

### Step 1

Create an application gateway IP configuration named **gatewayIP01**. When Application Gateway starts, it picks up an IP address from the subnet configured and routes network traffic to the IP addresses in the backend IP pool. Keep in mind that each instance takes one IP address.

```powershell
$gipconfig = New-AzApplicationGatewayIPConfiguration -Name "gatewayIP01" -Subnet $appGatewaySubnetData
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

> [!NOTE]
> Application Gateway supports defining custom TLS options, disabling certain TLS protocol versions, and specifying cipher suites and the order of preference. To learn more about configurable TLS options, see the [TLS policy overview](../application-gateway/application-gateway-ssl-policy-overview.md).

```powershell
$certGateway = New-AzApplicationGatewaySslCertificate -Name "gatewaycert" `
  -CertificateFile $gatewayCertPfxPath -Password $certGatewayPwd
$certPortal = New-AzApplicationGatewaySslCertificate -Name "portalcert" `
  -CertificateFile $portalCertPfxPath -Password $certPortalPwd
$certManagement = New-AzApplicationGatewaySslCertificate -Name "managementcert" `
  -CertificateFile $managementCertPfxPath -Password $certManagementPwd
```

### Step 5

Create the HTTP listeners for the Application Gateway. Assign the front-end IP configuration, port, and TLS/SSL certificates to them.

```powershell
$gatewayListener = New-AzApplicationGatewayHttpListener -Name "gatewaylistener" `
  -Protocol "Https" -FrontendIPConfiguration $fipconfig01 -FrontendPort $fp01 `
  -SslCertificate $certGateway -HostName $gatewayHostname -RequireServerNameIndication true
$portalListener = New-AzApplicationGatewayHttpListener -Name "portallistener" `
  -Protocol "Https" -FrontendIPConfiguration $fipconfig01 -FrontendPort $fp01 `
  -SslCertificate $certPortal -HostName $portalHostname -RequireServerNameIndication true
$managementListener = New-AzApplicationGatewayHttpListener -Name "managementlistener" `
  -Protocol "Https" -FrontendIPConfiguration $fipconfig01 -FrontendPort $fp01 `
  -SslCertificate $certManagement -HostName $managementHostname -RequireServerNameIndication true
```

### Step 6

Create custom probes to the API Management service `ContosoApi` gateway domain endpoint. The path `/status-0123456789abcdef` is a default health endpoint hosted on all the API Management services. Set `api.contoso.net` as a custom probe hostname to secure it with the TLS/SSL certificate.

> [!NOTE]
> The hostname `contosoapi.azure-api.net` is the default proxy hostname configured when a service named `contosoapi` is created in public Azure.
>

```powershell
$apimGatewayProbe = New-AzApplicationGatewayProbeConfig -Name "apimgatewayprobe" `
  -Protocol "Https" -HostName $gatewayHostname -Path "/status-0123456789abcdef" `
  -Interval 30 -Timeout 120 -UnhealthyThreshold 8
$apimPortalProbe = New-AzApplicationGatewayProbeConfig -Name "apimportalprobe" `
  -Protocol "Https" -HostName $portalHostname -Path "/signin" `
  -Interval 60 -Timeout 300 -UnhealthyThreshold 8
$apimManagementProbe = New-AzApplicationGatewayProbeConfig -Name "apimmanagementprobe" `
  -Protocol "Https" -HostName $managementHostname -Path "/ServiceStatus" `
  -Interval 60 -Timeout 300 -UnhealthyThreshold 8
```

### Step 7

Upload the trusted root certificate to be configured on the HTTP settings.

```powershell
$trustedRootCert = New-AzApplicationGatewayTrustedRootCertificate -Name "whitelistcert1" -CertificateFile $trustedRootCertCerPath
```

### Step 8

Configure HTTP backend settings for the Application Gateway, including a timeout limit for backend requests, after which they're canceled. This value is different from the probe timeout.

```powershell
$apimPoolGatewaySetting = New-AzApplicationGatewayBackendHttpSettings -Name "apimPoolGatewaySetting" `
  -Port 443 -Protocol "Https" -CookieBasedAffinity "Disabled" -Probe $apimGatewayProbe `
  -TrustedRootCertificate $trustedRootCert -PickHostNameFromBackendAddress -RequestTimeout 180
$apimPoolPortalSetting = New-AzApplicationGatewayBackendHttpSettings -Name "apimPoolPortalSetting" `
  -Port 443 -Protocol "Https" -CookieBasedAffinity "Disabled" -Probe $apimPortalProbe `
  -TrustedRootCertificate $trustedRootCert -PickHostNameFromBackendAddress -RequestTimeout 180
$apimPoolManagementSetting = New-AzApplicationGatewayBackendHttpSettings -Name "apimPoolManagementSetting" `
  -Port 443 -Protocol "Https" -CookieBasedAffinity "Disabled" -Probe $apimManagementProbe `
  -TrustedRootCertificate $trustedRootCert -PickHostNameFromBackendAddress -RequestTimeout 180
```

### Step 9

Configure a backend IP address pool for each API Management endpoint, using its respective domain name.

```powershell
$apimGatewayBackendPool = New-AzApplicationGatewayBackendAddressPool -Name "gatewaybackend" `
  -BackendFqdns $gatewayHostname
$apimPortalBackendPool = New-AzApplicationGatewayBackendAddressPool -Name "portalbackend" `
  -BackendFqdns $portalHostname
$apimManagementBackendPool = New-AzApplicationGatewayBackendAddressPool -Name "managementbackend" `
  -BackendFqdns $managementHostname
```

### Step 10

Create rules for the application gateway to use basic routing.

```powershell
$gatewayRule = New-AzApplicationGatewayRequestRoutingRule -Name "gatewayrule" `
  -RuleType Basic -HttpListener $gatewayListener -BackendAddressPool $apimGatewayBackendPool `
  -BackendHttpSettings $apimPoolGatewaySetting
$portalRule = New-AzApplicationGatewayRequestRoutingRule -Name "portalrule" `
  -RuleType Basic -HttpListener $portalListener -BackendAddressPool $apimPortalBackendPool `
  -BackendHttpSettings $apimPoolPortalSetting
$managementRule = New-AzApplicationGatewayRequestRoutingRule -Name "managementrule" `
  -RuleType Basic -HttpListener $managementListener -BackendAddressPool $apimManagementBackendPool `
  -BackendHttpSettings $apimPoolManagementSetting
```

> [!TIP]
> Change the `-RuleType` and routing, to restrict access to certain pages of the developer portal.

### Step 11

Configure the number of instances and size for the application gateway. In this example, we are using the [WAF_v2 SKU](../web-application-firewall/ag/ag-overview.md) for increased security of the API Management resource.

```powershell
$sku = New-AzApplicationGatewaySku -Name "WAF_v2" -Tier "WAF_v2" -Capacity 2
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
$appgw = New-AzApplicationGateway -Name $appgwName -ResourceGroupName $resGroupName -Location $location `
  -BackendAddressPools $apimGatewayBackendPool,$apimPortalBackendPool,$apimManagementBackendPool `
  -BackendHttpSettingsCollection $apimPoolGatewaySetting, $apimPoolPortalSetting, $apimPoolManagementSetting `
  -FrontendIpConfigurations $fipconfig01 -GatewayIpConfigurations $gipconfig -FrontendPorts $fp01 `
  -HttpListeners $gatewayListener,$portalListener,$managementListener `
  -RequestRoutingRules $gatewayRule,$portalRule,$managementRule `
  -Sku $sku -WebApplicationFirewallConfig $config -SslCertificates $certGateway,$certPortal,$certManagement `
  -TrustedRootCertificate $trustedRootCert -Probes $apimGatewayProbe,$apimPortalProbe,$apimManagementProbe
```

After deployment of the application gateway completes, confirm the health status of the API Management backends in the portal or by running the following command:

```powershell
Get-AzApplicationGatewayBackendHealth -Name $appgwName -ResourceGroupName $resGroupName
```

Ensure that the health status of each backend pool is Healthy. If you need to troubleshoot an unhealthy backend or a backend with unknown health status, see [Troubleshoot backend health issues in Application Gateway](../application-gateway/application-gateway-backend-health-troubleshooting.md).

## CNAME the API Management proxy hostname to the public DNS name of the Application Gateway resource

Once the gateway is created, configure the front end for communication. When using a public IP address, Application Gateway requires a dynamically assigned DNS name, which may not be easy to use.

Use the Application Gateway's DNS name to create a CNAME record pointing the API Management gateway hostname (`api.contoso.net` in the preceding examples) to this DNS name. To configure the frontend IP CNAME record, retrieve the details of the Application Gateway and its associated IP/DNS name using the `PublicIPAddress` element. We don't recommend using A-records is not recommended, since the VIP may change when the gateway restarts.

```powershell
Get-AzPublicIpAddress -ResourceGroupName $resGroupName -Name "publicIP01"
```

For testing purposes, you may update the hosts file on your local machine with entries mapping the Application Gateway's public IP address to each of the API Management endpoint hostnames that you configured (for example, `api.contoso.net`, `portal.contoso.net`, `management.contoso.net`).

## Summary

Azure API Management configured in a virtual network provides a single gateway interface for all configured APIs, whether hosted on-premises or in the cloud. Integrating Application Gateway with API Management provides the flexibility of selectively enabling particular APIs to be accessible on the internet, and providing a WAF as a front end to your API Management instance.

## Next steps

* Learn more about Azure Application Gateway
  * [Application Gateway Overview](../application-gateway/overview.md)
  * [Application Gateway Web Application Firewall](../web-application-firewall/ag/ag-overview.md)
  * [Application Gateway using Path-based Routing](../application-gateway/tutorial-url-route-powershell.md)
* Learn more about API Management and virtual network
  * [Using API Management with an internal virtual network](api-management-using-with-internal-vnet.md)
  * [How to use API Management with virtual networks](api-management-using-with-vnet.md)
