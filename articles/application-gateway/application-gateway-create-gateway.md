<properties 
   pageTitle="Create, start, or delete an Application Gateway | Microsoft Azure"
   description="This page provides instructions to create, configure, start, and delete an Azure Application Gateway"
   documentationCenter="na"
   services="application-gateway"
   authors="cherylmc"
   manager="jdial"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="hero-article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="06/23/2015"
   ms.author="cherylmc"/>

# Create, start, or delete an Application Gateway

In this release, you can create an Application Gateway by using PowerShell or REST API calls. Portal and CLI support will be provided in an upcoming release.

This article walks you through the steps to create and configure, start, and delete an Application Gateway.

## Before you begin

1. Install latest version of the Azure PowerShell cmdlets using the Web Platform Installer. You can download and install the latest PowerShell cmdlets from the **Windows PowerShell** section of the [Download page](http://azure.microsoft.com/downloads/).
2. Verify that you have a working virtual network with valid subnet.
3. Verify that you have backend servers either in the virtual network or with a Public-IP/VIP assigned.


To create a new Application Gateway, you'll do the following steps, in the order listed. Below the steps are examples of each cmdlet you will use.

1. [Create a new Application Gateway](#create-a-new-application-gateway)
2. [Configure the gateway](#configure-the-application-gateway)
3. [Set the gateway](#set-the-application-gateway)
4. [Start the gateway](#start-the-application-gateway)
4. [Verify the gateway](#verify-the-application-gateway-status)

If you want to delete an Application Gateway, go to [Delete an Application Gateway](#delete-an-application-gateway).

## Create a new Application Gateway

**To create the gateway**, use the `New-AzureApplicationGateway` cmdlet, replacing the values with your own.

This sample shows the cmdlet on the first line followed by the output. 
    
	PS C:\> New-AzureApplicationGateway -Name AppGwTest -VnetName testvnet1 -Subnets @("Subnet-1")

	VERBOSE: 4:31:35 PM - Begin Operation: New-AzureApplicationGateway 
	VERBOSE: 4:32:37 PM - Completed Operation: New-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   55ef0460-825d-2981-ad20-b9a8af41b399

**To validate** that the gateway was created, you can use `Get-AzureApplicationGateway` cmdlet.

Note that in the sample, *Description*, *InstanceCount*, and *GatewaySize* are optional parameters. The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. Small and Large are other available values. *Vip* and *DnsName* are shown as blank because the gateway has not started yet. These will be created once the gateway is in the running state. The billing for Application Gateway does not start at this point. Billing begins when the gateway is created.

This sample shows the cmdlet on the first line, followed by the output. 

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


## Configure the Application Gateway

Application Gateway configuration consists of multiple values, which can be tied together to construct the configuration.

The values are:

- **Backend server pool:** List of IP address of backend servers. This IP should either belong to the VNET subnet or should be a public-IP/VIP. 
- **Backend server pool settings:** Every pool has settings like port, protocol, and cookie based affinity. These settings are tied to a pool and are applied to all servers within the pool.
- **Frontend Port:** This port is the public port opened on Application Gateway. Customer traffic hits this port, and then gets redirected to one of the backend servers.
- **Listener:** Listener has a frontend port, protocol (Http or Https, these are case-sensitive), and SSL certificate name (if configuring SSL offload). 
- **Rule:** Rule binds the listener and the backend server pool and defines which backend server pool the traffic should be directed to when it hits a particular listener. Currently, only the "basic" rule, which is round-robin load distribution, is supported.
You can construct your configuration either by creating a configuration object, or by using a configuration XML file. 

To construct your configuration by using a configuration XML file, use the sample below.

### Configuration XML sample

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

## Set the Application Gateway

Use the `Set-AzureApplicationGatewayConfig` cmdlet with a configuration object or with a configuration XML file, replacing the values with your own. 

This sample shows the cmdlet on the first line, followed by the output. 

	PS C:\> Set-AzureApplicationGatewayConfig -Name AppGwTest -ConfigFile D:\config.xml

	VERBOSE: 7:54:59 PM - Begin Operation: Set-AzureApplicationGatewayConfig 
	VERBOSE: 7:55:32 PM - Completed Operation: Set-AzureApplicationGatewayConfig
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   9b995a09-66fe-2944-8b67-9bb04fcccb9d

## Start the Application Gateway

Once the gateway has been configured, issue the `Start-AzureApplicationGateway` cmdlet to start the gateway. This is the cmdlet that provisions the gateway. Once the cmdlet is run successfully and the gateway is provisioned, billing will also begin. 


**Note** `Start-AzureApplicationGateway` cmdlet might take up to 15-20 minutes. Billing for Application Gateway only begins after the gateway is successfully started.

This sample shows the cmdlet on the first line, followed by the output. Replace the values in the sample with your own values.


	PS C:\> Start-AzureApplicationGateway AppGwTest 

	VERBOSE: 7:59:16 PM - Begin Operation: Start-AzureApplicationGateway 
	VERBOSE: 8:05:52 PM - Completed Operation: Start-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   fc592db8-4c58-2c8e-9a1d-1c97880f0b9b

## Verify the Application Gateway status

Use the `Get-AzureApplicationGateway` cmdlet to check the status of gateway. If *Start-AzureApplicationGateway* succeeded, State should be *Running*, and Vip and DnsName should have valid entries. 

This sample shows an Application Gateway that is up and running, and is ready to take traffic destined to `http://<generated-dns-name>.cloudapp.net`. The cmdlet is on the first line, followed by the output. 

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


## Delete an Application Gateway

To delete an Application Gateway, you'll need to do the following in order:

1. Issue `Stop-AzureApplicationGateway` to stop the gateway. 
2. Use the `Remove-AzureApplicationGateway` cmdlet to remove the gateway.
3. Verify the gateway has been removed by using the `Get-AzureApplicationGateway` cmdlet.

This sample shows the `Stop-AzureApplicationGateway` cmdlet on the first line, followed by the output. Replace the values in the sample with your own values.

	PS C:\> Stop-AzureApplicationGateway AppGwTest 

	VERBOSE: 9:49:34 PM - Begin Operation: Stop-AzureApplicationGateway 
	VERBOSE: 10:10:06 PM - Completed Operation: Stop-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   ce6c6c95-77b4-2118-9d65-e29defadffb8

Once the Application Gateway is in a stopped state, issue the `Remove-AzureApplicationGateway` cmdlet to remove the service.

This sample shows the cmdlet on the first line, followed by the output. Replace the values in the sample with your own values.

	PS C:\> Remove-AzureApplicationGateway AppGwTest 

	VERBOSE: 10:49:34 PM - Begin Operation: Remove-AzureApplicationGateway 
	VERBOSE: 10:50:36 PM - Completed Operation: Remove-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   055f3a96-8681-2094-a304-8d9a11ad8301

To verify that the service has been removed, you can use the `Get-AzureApplicationGateway` cmdlet. This step is not required.

This sample shows the cmdlet on the first line, followed by the output. Replace the values in the sample with your own values.

	PS C:\> Get-AzureApplicationGateway AppGwTest 

	VERBOSE: 10:52:46 PM - Begin Operation: Get-AzureApplicationGateway 

	Get-AzureApplicationGateway : ResourceNotFound: The gateway does not exist. 
	.....

## Next Steps

If you want to configure SSL offload, see [Configure Application Gateway for SSL offload](application-gateway-SSL.md).

If you want more information about load balancing options in general, see:

- [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
- [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)