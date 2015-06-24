<properties 
   pageTitle="Configure Application Gateway for SSL offload | Microsoft Azure"
   description="This article provides instructions to configure SSL offload on an Azure Application Gateway."
   documentationCenter="na"
   services="application-gateway"
   authors="cherylmc"
   manager="jdial"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="get-started-article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="06/23/2015"
   ms.author="cherylmc"/>

# Configure Application Gateway for SSL offload

Application Gateway can be configured to terminate the SSL session at the gateway, thus avoiding costly SSL decryption on the web farm. SSL offload also simplifies the application's frontend server setup and management.

## Before you begin

1. Install latest version of the Azure PowerShell cmdlets using the Web Platform Installer. You can download and install the latest PowerShell cmdlets from the **Windows PowerShell** section of the [Download page](http://azure.microsoft.com/downloads/).
2. Verify that you have a working virtual network with valid subnet.
3. Verify that you have backend servers either in the virtual network or with a Public-IP/VIP assigned.

To configure SSL offload on an Application Gateway, do the following steps in the order listed. Below the steps are examples of each cmdlet you will use.

1. [Create a new Application Gateway](#create-a-new-application-gateway)
2. [Upload SSL certificates](#upload-ssl-certificates) 
3. [Configure the gateway](#configure-the-application-gateway)
4. [Set the gateway configuration](#set-the-application-gateway-configuration)
5. [Start the gateway](#start-the-application-gateway)


## Create a new Application Gateway:

**To create the gateway**, use the `New-AzureApplicationGateway` cmdlet, replacing the values with your own.

This sample shows the cmdlet on the first line, followed by the output. 

	PS C:\> New-AzureApplicationGateway -Name AppGwTest -VnetName testvnet1 -Subnets @("Subnet-1")

	VERBOSE: 4:31:35 PM - Begin Operation: New-AzureApplicationGateway 
	VERBOSE: 4:32:37 PM - Completed Operation: New-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   55ef0460-825d-2981-ad20-b9a8af41b399

**To validate** that the gateway was created, you can use the `Get-AzureApplicationGateway` cmdlet.


Note that in the sample, *Description*, *InstanceCount*, and *GatewaySize* are optional parameters. The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. Small and Large are other available values. *Vip* and *DnsName* are shown as blank because the gateway has not started yet. These will be created once the gateway is in the running state. The billing for Application Gateway does not start at this point. Billing begins when the gateway is created.

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

Use `Add-AzureApplicationGatewaySslCertificate` to upload the server certificate in pfx format to the Application Gateway. The certificate name is a user-chosen name and must be unique within the Application Gateway. This certificate is referred to by this name in all certificate management operations on the Application Gateway.

This sample shows the cmdlet on the first line, followed by the output. Replace the values in the sample with your own.

	PS C:\> Add-AzureApplicationGatewaySslCertificate  -Name AppGwTest -CertificateName GWCert -Password <password> -CertificateFile <full path to pfx file> 
	
	VERBOSE: 5:05:23 PM - Begin Operation: Get-AzureApplicationGatewaySslCertificate 
	VERBOSE: 5:06:29 PM - Completed Operation: Get-AzureApplicationGatewaySslCertificate
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   21fdc5a0-3bf7-2c12-ad98-192e0dd078ef

Use the `Get-AzureApplicationGatewayCertificate` cmdlet to validate certificate upload.

This sample shows the cmdlet on the first line, followed by the output. 

	PS C:\> Get-AzureApplicationGatewaySslCertificate AppGwTest 

	VERBOSE: 5:07:54 PM - Begin Operation: Get-AzureApplicationGatewaySslCertificate 
	VERBOSE: 5:07:55 PM - Completed Operation: Get-AzureApplicationGatewaySslCertificate
	Name           : SslCert 
	SubjectName    : CN=gwcert.app.test.contoso.com 
	Thumbprint     : AF5ADD77E160A01A6......EE48D1A 
	ThumbprintAlgo : sha1RSA
	State..........: Provisioned


## Configure the Application Gateway

Application Gateway configuration has the following entities that can be combined to construct the configuration. 
 
- **Backend server pool:** List of IP address of backend servers. This IP should either belong to the VNET subnet or should be a public-IP/VIP. 
- **Backend server pool settings:** Every pool has settings like port, protocol, and cookie based affinity. These settings are tied to a pool and are applied to all servers within the pool.
- **Frontend Port:** This port is the public port opened on Application Gateway. Customer traffic hits this port, and then gets redirected to one of the backend servers.
- **Listener:** Listener has a frontend port, protocol (Http or Https, these are case-sensitive), and SSL certificate name (if configuring SSL offload). 
- **Rule:** Rule binds the listener and the backend server pool and defines which backend server pool the traffic should be directed to when it hits a particular listener. Currently, only the "basic" rule, which is round-robin load distribution, is supported. 

Configuration can be constructed either by creating a configuration object, or by using configuration XML file.

For SSL certificates configuration, the protocol in **HttpListener** should change to *Https* (case sensitive). The **SslCert** element needs to be added to **HttpListener** with the value set to the same name as used in upload of SSL certificates section above. The frontend port should be updated to 443.

Note that Application Gateway can be configured to ensure that request from a client session is always directed to the same VM in the web farm. This is done by injection of a session cookie which allows Application Gateway to direct traffic appropriately. To enable cookie based affinity, set **CookieBasedAffinity** to *Enabled* in the **BackendHttpSettings** element. 


### Configuration XML sample


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


## Set the Application Gateway configuration

The `Set-ApplicationGatewayConfig` cmdlet can be run either with configuration object, or with configuration XML file. In the sample below, we will work with the configuration XML file.

This sample shows the cmdlet on the first line, followed by the output. Replace the values with your own.

	PS C:\> Set-AzureApplicationGatewayConfig -Name AppGwTest -ConfigFile D:\config.xml

	VERBOSE: 7:54:59 PM - Begin Operation: Set-AzureApplicationGatewayConfig 
	VERBOSE: 7:55:32 PM - Completed Operation: Set-AzureApplicationGatewayConfig
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   9b995a09-66fe-2944-8b67-9bb04fcccb9d

## Start the Application Gateway

Once the gateway has been configured, use the `Start-AzureApplicationGateway` cmdlet to start the gateway. This is the cmdlet that provisions the gateway. Once the cmdlet is run successfully and the gateway is provisioned, billing will also begin.


**Note** The `Start-AzureApplicationGateway` cmdlet might take up to 15-20 minutes.

This sample shows the cmdlet on the first line, followed by the output. Replace the values in the sample with your own.
   
	PS C:\> Start-AzureApplicationGateway AppGwTest 

	VERBOSE: 7:59:16 PM - Begin Operation: Start-AzureApplicationGateway 
	VERBOSE: 8:05:52 PM - Completed Operation: Start-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   fc592db8-4c58-2c8e-9a1d-1c97880f0b9b


Use the `Get-AzureApplicationGateway` cmdlet to check the status of gateway. If *Start-AzureApplicationGateway* succeeded, State should be "*Running*", and Vip and DnsName should have valid entries. 

This sample shows the cmdlet on the first line, followed by the output. In this sample, the gateway is up and ready to take traffic.

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


## Next Steps


If you want more information about load balancing options in general, see:

- [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
- [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)


