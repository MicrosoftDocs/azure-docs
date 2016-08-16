<properties 
   pageTitle="Create and Configure an Application Gateway with Internal Load Balancer (ILB) in a Virtual Network | Microsoft Azure"
   description="This page provides instructions to configure an Azure Application Gateway with an Internal Load Balanced endpoint"
   documentationCenter="na"
   services="application-gateway"
   authors="georgewallace"
   manager="jdial"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/05/2016"
   ms.author="gwallace"/>

# Create an Application Gateway with an Internal Load Balancer (ILB)

> [AZURE.SELECTOR]
- [Azure classic steps](application-gateway-ilb.md)
- [Resource Manager Powershell steps](application-gateway-ilb-arm.md)


Application Gateway can be configured with an internet facing virtual IP or with an internal end-point not exposed to the internet, also known as Internal Load Balancer (ILB) endpoint. Configuring the gateway with an ILB is useful for internal line of business applications not exposed to internet. It's also useful for services/tiers within a multi-tier application which sit in a security boundary not exposed to internet, but still require round robin load distribution, session stickiness, or SSL termination. This article will walk you through the steps to configure an application gateway with an ILB.

## Before you begin

1. Install latest version of the Azure PowerShell cmdlets using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Download page](https://azure.microsoft.com/downloads/).
2. Verify that you have a working virtual network with valid subnet.
3. Verify that you have backend servers either in the virtual network, or with a public IP/VIP assigned.


To create a new application gateway, perform the following steps in the order listed. 

1. [Create a new application gateway](#create-a-new-application-gateway)
2. [Configure the gateway](#configure-the-gateway)
3. [Set the gateway configuration](#set-the-gateway-configuration)
4. [Start the gateway](#start-the-gateway)
4. [Verify the gateway](#verify-the-gateway-status)



## Create a new application gateway:

**To create the gateway**, use the `New-AzureApplicationGateway` cmdlet, replacing the values with your own. Note that billing for the gateway does not start at this point. Billing begins in a later step, when the gateway is successfully started.

	PS C:\> New-AzureApplicationGateway -Name AppGwTest -VnetName testvnet1 -Subnets @("Subnet-1")

	VERBOSE: 4:31:35 PM - Begin Operation: New-AzureApplicationGateway 
	VERBOSE: 4:32:37 PM - Completed Operation: New-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   55ef0460-825d-2981-ad20-b9a8af41b399

**To validate** that the gateway was created, you can use the `Get-AzureApplicationGateway` cmdlet. 

In the sample, *Description*, *InstanceCount*, and *GatewaySize* are optional parameters. The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. Small and Large are other available values. *Vip* and *DnsName* are shown as blank because the gateway has not started yet. These will be created once the gateway is in the running state. 

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



Note the following:


- The *FrontendIPConfigurations* element describes the ILB details relevant for configuring Application Gateway with an ILB. 

- The Frontend IP *Type* should be set to 'Private'

- The *StaticIPAddress* should be set to the desired internal IP on which the gateway will receive traffic. Note that the  *StaticIPAddress* element is optional. If not set, an available internal IP from the deployed subnet is chosen. 

- The value of the *Name* element specified in *FrontendIPConfiguration* should be used in the  HTTPListener's *FrontendIP* element to refer to the FrontendIPConfiguration.

 **Configuration XML sample**

 

		<?xml version="1.0" encoding="utf-8"?>
		<ApplicationGatewayConfiguration xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure">
			<FrontendIPConfigurations>
				<FrontendIPConfiguration>
					<Name>fip1</Name> 
					<Type>Private</Type> 
					<StaticIPAddress>10.0.0.10</StaticIPAddress> 
				</FrontendIPConfiguration>
			</FrontendIPConfigurations>
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
					<FrontendIP>fip1</FrontendIP>
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


> [AZURE.NOTE] The `Start-AzureApplicationGateway` cmdlet might take up to 15-20 minutes to complete. 
   
	PS C:\> Start-AzureApplicationGateway AppGwTest 

	VERBOSE: 7:59:16 PM - Begin Operation: Start-AzureApplicationGateway 
	VERBOSE: 8:05:52 PM - Completed Operation: Start-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   fc592db8-4c58-2c8e-9a1d-1c97880f0b9b

## Verify the gateway status

Use the `Get-AzureApplicationGateway` cmdlet to check the status of gateway. If *Start-AzureApplicationGateway* succeeded in the previous step, the State should be *Running*, and the Vip and DnsName should have valid entries. This sample shows the cmdlet on the first line, followed by the output. In this sample, the gatway is running, and is ready to take traffic. 

> [AZURE.NOTE] The application gateway is configured to accept traffic at the configured ILB endpoint of 10.0.0.10 in this example.

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
	VirtualIPs    : {10.0.0.10}
	DnsName       : appgw-b2a11563-2b3a-4172-a4aa-226ee4c23eed.cloudapp.net

## Next steps


If you want more information about load balancing options in general, see:

- [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
- [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)
