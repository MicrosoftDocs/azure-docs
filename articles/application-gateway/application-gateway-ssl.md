<properties
   pageTitle="Configure an application gateway for SSL offload by using classic deployment| Microsoft Azure"
   description="This article provides instructions to create an application gateway with SSL offload by using the Azure classic deployment model."
   documentationCenter="na"
   services="application-gateway"
   authors="joaoma"
   manager="carmonm"
   editor="tysonn"/>
<tags
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/05/2016"
   ms.author="joaoma"/>

# Configure an application gateway for SSL offload by using the classic deployment model

> [AZURE.SELECTOR]
-[Azure Classic PowerShell](application-gateway-ssl.md)
-[Azure Resource Manager PowerShell](application-gateway-ssl-arm.md)

Azure Application Gateway can be configured to terminate the Secure Sockets Layer (SSL) session at the gateway to avoid costly SSL decryption tasks to happen at the web farm. SSL offload also simplifies the front-end server setup and management of the web application.


## Before you begin

1. Install the latest version of the Azure PowerShell cmdlets by using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Downloads page](https://azure.microsoft.com/downloads/).
2. Verify that you have a working virtual network with a valid subnet. Make sure that no virtual machines or cloud deployments are using the subnet. The application gateway must be by itself in a virtual network subnet.
3. The servers that you will configure to use the application gateway must exist or have their endpoints created either in the virtual network or with a public IP/VIP assigned.

To configure SSL offload on an application gateway, do the following steps in the order listed:

1. [Create a new application gateway](#create-a-new-application-gateway)
2. [Upload SSL certificates](#upload-ssl-certificates)
3. [Configure the gateway](#configure-the-gateway)
4. [Set the gateway configuration](#set-the-gateway-configuration)
5. [Start the gateway](#start-the-gateway)
6. [Verify the gateway status](#verify-the-gateway-status)


## Create a new application gateway

To create the gateway, use the **New-AzureApplicationGateway** cmdlet, replacing the values with your own. Note that billing for the gateway does not start at this point. Billing begins in a later step, when the gateway is successfully started.

This sample shows the cmdlet on the first line, followed by the output.

	PS C:\> New-AzureApplicationGateway -Name AppGwTest -VnetName testvnet1 -Subnets @("Subnet-1")

	VERBOSE: 4:31:35 PM - Begin Operation: New-AzureApplicationGateway
	VERBOSE: 4:32:37 PM - Completed Operation: New-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error
	----       ----------------     ------------                             ----
	Successful OK                   55ef0460-825d-2981-ad20-b9a8af41b399

To validate that the gateway was created, you can use the **Get-AzureApplicationGateway** cmdlet.

In the sample, *Description*, *InstanceCount*, and *GatewaySize* are optional parameters. The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. Small and Large are other available values. *VirtualIPs* and *DnsName* are shown as blank because the gateway has not started yet. These will be created once the gateway is in the running state.

This sample shows the cmdlet on the first line, followed by the output.

	PS C:\> Get-AzureApplicationGateway AppGwTest

	VERBOSE: 4:39:39 PM - Begin Operation:
	Get-AzureApplicationGateway VERBOSE: 4:39:40 PM - Completed
	Operation: Get-AzureApplicationGateway
	Name: AppGwTest
	Description:
	VnetName: testvnet1
	Subnets: {Subnet-1}
	InstanceCount: 2
	GatewaySize: Medium
	State: Stopped
	VirtualIPs:
	DnsName:


## Upload SSL certificates

Use **Add-AzureApplicationGatewaySslCertificate** to upload the server certificate in *pfx* format to the application gateway. The certificate name is a user-chosen name and must be unique within the application gateway. This certificate is referred to by this name in all certificate management operations on the application gateway.

This sample shows the cmdlet on the first line, followed by the output. Replace the values in the sample with your own.

	PS C:\> Add-AzureApplicationGatewaySslCertificate  -Name AppGwTest -CertificateName GWCert -Password <password> -CertificateFile <full path to pfx file>

	VERBOSE: 5:05:23 PM - Begin Operation: Get-AzureApplicationGatewaySslCertificate
	VERBOSE: 5:06:29 PM - Completed Operation: Get-AzureApplicationGatewaySslCertificate
	Name       HTTP Status Code     Operation ID                             Error
	----       ----------------     ------------                             ----
	Successful OK                   21fdc5a0-3bf7-2c12-ad98-192e0dd078ef

Next, validate the certificate upload. Use the **Get-AzureApplicationGatewayCertificate** cmdlet.

This sample shows the cmdlet on the first line, followed by the output.

	PS C:\> Get-AzureApplicationGatewaySslCertificate AppGwTest

	VERBOSE: 5:07:54 PM - Begin Operation: Get-AzureApplicationGatewaySslCertificate
	VERBOSE: 5:07:55 PM - Completed Operation: Get-AzureApplicationGatewaySslCertificate
	Name           : SslCert
	SubjectName    : CN=gwcert.app.test.contoso.com
	Thumbprint     : AF5ADD77E160A01A6......EE48D1A
	ThumbprintAlgo : sha1RSA
	State..........: Provisioned

>[AZURE.NOTE] The certificate password has to be in between 4 to 12 characters, letters or numbers. Special characters are not accepted.

## Configure the gateway

An application gateway configuration consists of multiple values. The values can be tied together to construct the configuration.

The values are:

- **Back-end server pool:** The list of IP addresses of the back-end servers. The IP addresses listed should either belong to the virtual network subnet or should be a public IP/VIP.
- **Back-end server pool settings:** Every pool has settings like port, protocol, and cookie-based affinity. These settings are tied to a pool and are applied to all servers within the pool.
- **Front-end port:** This port is the public port that is opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back end servers.
- **Listener:** The listener has a front-end port, a protocol (Http or Https, these are case-sensitive), and the SSL certificate name (if configuring SSL offload).
- **Rule:** The rule binds the listener and the back-end server pool and defines which back-end server pool the traffic should be directed to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.

**Additional configuration notes**

For SSL certificates configuration, the protocol in **HttpListener** should change to *Https* (case sensitive). The **SslCert** element needs to be added to **HttpListener** with the value set to the same name as used in the upload of SSL certificates section above. The front-end port should be updated to 443.

**To enable cookie based affinity**: An application gateway can be configured to ensure that a request from a client session is always directed to the same VM in the web farm. This is done by injection of a session cookie that allows the gateway to direct traffic appropriately. To enable cookie-based affinity, set **CookieBasedAffinity** to *Enabled* in the **BackendHttpSettings** element.



You can construct your configuration either by creating a configuration object or by using a configuration XML file.
To construct your configuration by using a configuration XML file, use the sample below.

**Configuration XML sample**


	    <?xml version="1.0" encoding="utf-8"?>
	<ApplicationGatewayConfiguration xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure">
	    <FrontendIPConfigurations />
	    <FrontendPorts>
	        <FrontendPort>
	            <Name>FrontendPort1</Name>
	            <Port>443</Port>
	        </FrontendPort>
	    </FrontendPorts>
	    <BackendAddressPools>
	        <BackendAddressPool>
	            <Name>BackendPool1</Name>
	            <IPAddresses>
	                <IPAddress>10.0.0.1</IPAddress>
	                <IPAddress>10.0.0.2</IPAddress>
	            </IPAddresses>
	        </BackendAddressPool>
	    </BackendAddressPools>
	    <BackendHttpSettingsList>
	        <BackendHttpSettings>
	            <Name>BackendSetting1</Name>
	            <Port>80</Port>
	            <Protocol>Http</Protocol>
	            <CookieBasedAffinity>Enabled</CookieBasedAffinity>
	        </BackendHttpSettings>
	    </BackendHttpSettingsList>
	    <HttpListeners>
	        <HttpListener>
	            <Name>HTTPListener1</Name>
	            <FrontendPort>FrontendPort1</FrontendPort>
	            <Protocol>Https</Protocol>
	            <SslCert>GWCert</SslCert>
	        </HttpListener>
	    </HttpListeners>
	    <HttpLoadBalancingRules>
	        <HttpLoadBalancingRule>
	            <Name>HttpLBRule1</Name>
	            <Type>basic</Type>
	            <BackendHttpSettings>BackendSetting1</BackendHttpSettings>
	            <Listener>HTTPListener1</Listener>
	            <BackendAddressPool>BackendPool1</BackendAddressPool>
	        </HttpLoadBalancingRule>
	    </HttpLoadBalancingRules>
	</ApplicationGatewayConfiguration>


## Set the gateway configuration

Next, you'll set the application gateway. You can use the **Set-AzureApplicationGatewayConfig** cmdlet with either a configuration object or with a configuration XML file.


	PS C:\> Set-AzureApplicationGatewayConfig -Name AppGwTest -ConfigFile D:\config.xml

	VERBOSE: 7:54:59 PM - Begin Operation: Set-AzureApplicationGatewayConfig
	VERBOSE: 7:55:32 PM - Completed Operation: Set-AzureApplicationGatewayConfig
	Name       HTTP Status Code     Operation ID                             Error
	----       ----------------     ------------                             ----
	Successful OK                   9b995a09-66fe-2944-8b67-9bb04fcccb9d

## Start the gateway

Once the gateway has been configured, use the **Start-AzureApplicationGateway** cmdlet to start the gateway. Billing for an application gateway begins after the gateway has been successfully started.


**Note:** The **Start-AzureApplicationGateway** cmdlet might take up to 15-20 minutes to finish.


	PS C:\> Start-AzureApplicationGateway AppGwTest

	VERBOSE: 7:59:16 PM - Begin Operation: Start-AzureApplicationGateway
	VERBOSE: 8:05:52 PM - Completed Operation: Start-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error
	----       ----------------     ------------                             ----
	Successful OK                   fc592db8-4c58-2c8e-9a1d-1c97880f0b9b


## Verify the gateway status

Use the **Get-AzureApplicationGateway** cmdlet to check the status of the gateway. If **Start-AzureApplicationGateway** succeeded in the previous step, *State* should be Running, and *VirtualIPs* and *DnsName* should have valid entries.

This sample shows an application gateway that is up, running, and is ready to take traffic.

	PS C:\> Get-AzureApplicationGateway AppGwTest

	Name          : AppGwTest2
	Description   :
	VnetName      : testvnet1
	Subnets       : {Subnet-1}
	InstanceCount : 2
	GatewaySize   : Medium
	State         : Running
	VirtualIPs    : {23.96.22.241}
	DnsName       : appgw-4c960426-d1e6-4aae-8670-81fd7a519a43.cloudapp.net


## Next steps


If you want more information about load balancing options in general, see:

- [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
- [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)
