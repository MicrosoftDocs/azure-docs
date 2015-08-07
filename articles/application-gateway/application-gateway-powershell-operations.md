<properties 
   pageTitle="Create, start, or delete an Application Gateway | Microsoft Azure"
   description="This page provides instructions to create, configure, start, and delete an Azure Application Gateway"
   documentationCenter="na"
   services="application-gateway"
   authors="joaoma"
   manager="jdial"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="hero-article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="06/30/2015"
   ms.author="joaoma"/>

# Create, start, or delete an Application Gateway

In this release, you can create an Application Gateway by using PowerShell or REST API calls. Portal and CLI support will be provided in an upcoming release.
This article walks you through the steps to create and configure, start, and delete an application gateway.

## Before you begin

1. Install latest version of the Azure PowerShell cmdlets using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Download page](http://azure.microsoft.com/downloads/).
2. Verify that you have a working virtual network with valid subnet.
3. Verify that you have backend servers either in the virtual network, or with a public IP/VIP assigned.


To create a new application gateway, perform the following steps in the order listed. 

1. [Create a new application gateway](#create-a-new-application-gateway)
2. [Configure the gateway](#configure-the-gateway)
3. [Set the gateway configuration](#set-the-gateway-configuration)
4. [Start the gateway](#start-the-gateway)
4. [Verify the gateway status](#verify-the-gateway-status)

If you want to delete an application gateway, go to [Delete an application gateway](#delete-an-application-gateway).

## Create a new application gateway

**To create the gateway**, use the `New-AzureApplicationGateway` cmdlet, replacing the values with your own. Note that billing for the gateway does not start at this point. Billing begins in a later step, when the gateway is successfully started.

This sample shows the cmdlet on the first line followed by the output. 
    
	PS C:\> New-AzureApplicationGateway -Name AppGwTest -VnetName testvnet1 -Subnets @("Subnet-1")

	VERBOSE: 4:31:35 PM - Begin Operation: New-AzureApplicationGateway 
	VERBOSE: 4:32:37 PM - Completed Operation: New-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   55ef0460-825d-2981-ad20-b9a8af41b399

**To validate** that the gateway was created, you can use the `Get-AzureApplicationGateway` cmdlet. 

In the sample, *Description*, *InstanceCount*, and *GatewaySize* are optional parameters. The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. Small and Large are other available values. *Vip* and *DnsName* are shown as blank because the gateway has not started yet. These will be created once the gateway is in the running state. 




	PS C:\> Get-AzureApplicationGateway AppGwTest
	Name          : AppGwTest
	Description   : 
	VnetName      : testvnet1
	Subnets       : {Subnet-1}
	InstanceCount : 2
	GatewaySize   : Medium
	State         : Stopped
	VirtualIPs    : {}
	DnsName       :


## Configure the gateway

An application gateway configuration consists of multiple values. The values can be tied together to construct the configuration.

The values are:

- **Backend server pool:** The list of IP addresses of the backend servers. The IP addresses listed should either belong to the VNet subnet, or should be a public IP/VIP. 
- **Backend server pool settings:** Every pool has settings like port, protocol, and cookie based affinity. These settings are tied to a pool and are applied to all servers within the pool.
- **Frontend Port:** This port is the public port opened on the application gateway. Traffic hits this port, and then gets redirected to one of the backend servers.
- **Listener:** The listener has a frontend port, a protocol (Http or Https, these are case-sensitive), and the SSL certificate name (if configuring SSL offload). 
- **Rule:** The rule binds the listener and the backend server pool and defines which backend server pool the traffic should be directed to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.

You can construct your configuration either by creating a configuration object, or by using a configuration XML file. 
To construct your configuration by using a configuration XML file, use the sample below.

 **Configuration XML sample**

	<?xml version="1.0" encoding="utf-8"?>
	<ApplicationGatewayConfiguration xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure">
	    <FrontendPorts>
	        <FrontendPort>
	            <Name>FrontendPort1</Name>
	            <Port>80</Port>
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
	            <Protocol>Http</Protocol>
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

Next, you'll set the application gateway. You can use the `Set-AzureApplicationGatewayConfig` cmdlet with a configuration object, or with a configuration XML file. 


	PS C:\> Set-AzureApplicationGatewayConfig -Name AppGwTest -ConfigFile D:\config.xml

	VERBOSE: 7:54:59 PM - Begin Operation: Set-AzureApplicationGatewayConfig 
	VERBOSE: 7:55:32 PM - Completed Operation: Set-AzureApplicationGatewayConfig
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   9b995a09-66fe-2944-8b67-9bb04fcccb9d

## Start the gateway

Once the gateway has been configured, use the `Start-AzureApplicationGateway` cmdlet to start the gateway. Billing for an application gateway begins after the gateway has been successfully started. 


**Note:** The `Start-AzureApplicationGateway` cmdlet might take up to 15-20 minutes to complete. 



	PS C:\> Start-AzureApplicationGateway AppGwTest 

	VERBOSE: 7:59:16 PM - Begin Operation: Start-AzureApplicationGateway 
	VERBOSE: 8:05:52 PM - Completed Operation: Start-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   fc592db8-4c58-2c8e-9a1d-1c97880f0b9b

## Verify the gateway status

Use the `Get-AzureApplicationGateway` cmdlet to check the status of gateway. If *Start-AzureApplicationGateway* succeeded in the previous step, the State should be *Running*, and the Vip and DnsName should have valid entries. 

This sample shows an application gateway that is up, running, and is ready to take traffic destined to `http://<generated-dns-name>.cloudapp.net`. 

	PS C:\> Get-AzureApplicationGateway AppGwTest 

	VERBOSE: 8:09:28 PM - Begin Operation: Get-AzureApplicationGateway 
	VERBOSE: 8:09:30 PM - Completed Operation: Get-AzureApplicationGateway
	Name          : AppGwTest 
	Description   : 
	VnetName      : testvnet1 
	Subnets       : {Subnet-1} 
	InstanceCount : 2 
	GatewaySize   : Medium 
	State         : Running 
	Vip           : 138.91.170.26 
	DnsName       : appgw-1b8402e8-3e0d-428d-b661-289c16c82101.cloudapp.net


## Delete an application gateway

To delete an application gateway, you'll need to do the following in order:

1. Use the `Stop-AzureApplicationGateway` cmdlet to stop the gateway. 
2. Use the `Remove-AzureApplicationGateway` cmdlet to remove the gateway.
3. Verify the gateway has been removed by using the `Get-AzureApplicationGateway` cmdlet.

This sample shows the `Stop-AzureApplicationGateway` cmdlet on the first line, followed by the output. 

	PS C:\> Stop-AzureApplicationGateway AppGwTest 

	VERBOSE: 9:49:34 PM - Begin Operation: Stop-AzureApplicationGateway 
	VERBOSE: 10:10:06 PM - Completed Operation: Stop-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   ce6c6c95-77b4-2118-9d65-e29defadffb8

Once the application gateway is in a Stopped state, use the `Remove-AzureApplicationGateway` cmdlet to remove the service.


	PS C:\> Remove-AzureApplicationGateway AppGwTest 

	VERBOSE: 10:49:34 PM - Begin Operation: Remove-AzureApplicationGateway 
	VERBOSE: 10:50:36 PM - Completed Operation: Remove-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   055f3a96-8681-2094-a304-8d9a11ad8301

To verify that the service has been removed, you can use the `Get-AzureApplicationGateway` cmdlet. This step is not required.


	PS C:\> Get-AzureApplicationGateway AppGwTest 

	VERBOSE: 10:52:46 PM - Begin Operation: Get-AzureApplicationGateway 

	Get-AzureApplicationGateway : ResourceNotFound: The gateway does not exist. 
	.....

## Next Steps

If you want to configure SSL offload, see [Configure Application Gateway for SSL offload](application-gateway-ssl.md).

If you want to configure an application gateway to use with ILB, see [Create an Application Gateway with an Internal Load Balancer (ILB)](application-gateway-ilb.md).

If you want more information about load balancing options in general, see:

- [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
- [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)
