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
   ms.date="09/21/2015"
   ms.author="joaoma"/>

# Create, start, or delete an Application Gateway

Application Gateway is load balancer layer 7. It provides failover, performance routing HTTP requests between different servers, whether they are on the cloud or on premise. Application gateway has the following application delivery features: HTTP load balancing, Cookie based session affinity, SSL offload. 

> [AZURE.SELECTOR]
- [Azure Classic Powershell steps](application-gateway-create-gateway.md)
- [Azure Resource Manager Powershell steps](application-gateway-create-gateway-arm.md)
- [Azure Resource Manager template steps](application-gateway-create-gateway-arm-template.md)


<BR>

This article walks you through the steps to create and configure, start, and delete an Application Gateway.


>[AZURE.IMPORTANT] Before you work with Azure resources, it's important to understand that Azure currently has two deployment models: Resource Manager, and classic. Make sure you understand [deployment models and tools](azure-classic-rm.md) before working with any Azure resource. You can view the documentation for different tools by clicking the tabs at the top of this article.This document will cover creating an Application Gateway using Azure Classic deployment. To use the Resource Manager version, go to [create an Application Gateway deployment using Resource Manager](application-gateway-create-gateway-arm.md).





## Before you begin

1. Install the latest version of the Azure PowerShell cmdlets using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Download page](http://azure.microsoft.com/downloads/).
2. Verify that you have a working virtual network with a valid subnet. Make sure no virtual machines or cloud deployments are using the subnet. The Application Gateway must be by itself in a virtual network subnet.
3. The servers which you will configure to use the Application Gateway must exist or have their endpoints created either in the virtual network, or with a public IP/VIP assigned.

## What is required to create an Application Gateway?


When you use ther **New-AzureApplicationGateway** command to create the Application Gateway, no configuration is set at this point and the newly created resource will have to be configured either using XML or a configuration object.


The values are:

- **Back end server pool:** The list of IP addresses of the back end servers. The IP addresses listed should either belong to the virtual network subnet, or should be a public IP/VIP.
- **Back end server pool settings:** Every pool has settings like port, protocol, and cookie-based affinity. These settings are tied to a pool and are applied to all servers within the pool.
- **Front end Port:** This port is the public port opened on the Application Gateway. Traffic hits this port, and then gets redirected to one of the back end servers.
- **Listener:** The listener has a front end port, a protocol (Http or Https, these are case-sensitive), and the SSL certificate name (if configuring SSL offload).
- **Rule:** The rule binds the listener and the back end server pool and defines which back end server pool the traffic should be directed to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.



## Create a new Application Gateway

There is an order of steps you will have to follow to create an Application Gateway:

1. Create Application Gateway resource.
2. Create configuration XML file or configuration object.
3. Commit the configuration to newly created Application Gateway resource.

### Create an Application Gateway Resource

To create the gateway, use the `New-AzureApplicationGateway` cmdlet, replacing the values with your own. Note that billing for the gateway does not start at this point. Billing begins in a later step, when the gateway is successfully started.

The following example creates a new Application Gateway using a virtual network called "testvnet1" and a subnet called "subnet-1".


	PS C:\> New-AzureApplicationGateway -Name AppGwTest -VnetName testvnet1 -Subnets @("Subnet-1")

	VERBOSE: 4:31:35 PM - Begin Operation: New-AzureApplicationGateway
	VERBOSE: 4:32:37 PM - Completed Operation: New-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error
	----       ----------------     ------------                             ----
	Successful OK                   55ef0460-825d-2981-ad20-b9a8af41b399


 *Description*, *InstanceCount*, and *GatewaySize* are optional parameters.


**To validate** that the gateway was created, you can use the `Get-AzureApplicationGateway` cmdlet.




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

>[AZURE.NOTE]  The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. You can choose between Small, Medium and Large.


 *Vip* and *DnsName* are shown as blank because the gateway has not started yet. These will be created once the gateway is in the running state.

## Configure Application Gateway

You can configure Application Gateway using XML or a configuration object.

## Configure Application Gateway using XML

In the following example, you will use an XML file to configure all Application Gateway settings and commit them to the Application Gateway resource.  

### Step 1  

Copy the following text to Notepad.

	<?xml version="1.0" encoding="utf-8"?>
	<ApplicationGatewayConfiguration xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure">
	    <FrontendPorts>
	        <FrontendPort>
	            <Name>(name-of-your-frontend-port)</Name>
	            <Port>(port number)</Port>
	        </FrontendPort>
	    </FrontendPorts>
	    <BackendAddressPools>
	        <BackendAddressPool>
	            <Name>(name-of-your-backend-pool)</Name>
	            <IPAddresses>
	                <IPAddress>(your-IP-address-for-backend-pool)</IPAddress>
	                <IPAddress>(your-second-IP-address-for-backend-pool)</IPAddress>
	            </IPAddresses>
	        </BackendAddressPool>
	    </BackendAddressPools>
	    <BackendHttpSettingsList>
	        <BackendHttpSettings>
	            <Name>(backend-setting-name-to-configure-rule)</Name>
	            <Port>80</Port>
	            <Protocol>[Http|Https]</Protocol>
	            <CookieBasedAffinity>Enabled</CookieBasedAffinity>
	        </BackendHttpSettings>
	    </BackendHttpSettingsList>
	    <HttpListeners>
	        <HttpListener>
	            <Name>(name-of-the-listener)</Name>
	            <FrontendPort>(name-of-your-frontend-port)</FrontendPort>
	            <Protocol>[Http|Https]</Protocol>
	        </HttpListener>
	    </HttpListeners>
	    <HttpLoadBalancingRules>
	        <HttpLoadBalancingRule>
	            <Name>(name-of-load-balancing-rule)</Name>
	            <Type>basic</Type>
	            <BackendHttpSettings>(backend-setting-name-to-configure-rule)</BackendHttpSettings>
	            <Listener>(name-of-the-listener)</Listener>
	            <BackendAddressPool>(name-of-your-backend-pool)</BackendAddressPool>
	        </HttpLoadBalancingRule>
	    </HttpLoadBalancingRules>
	</ApplicationGatewayConfiguration>

Edit the values between the parenthesis for the configuration items. Save the file with extension .xml

>[AZURE.IMPORTANT] The protocol item Http or Https is case sensitive.

The following example shows how to use a configuration file to set up the Application Gateway to load balance Http traffic on public port 80 and send network traffic to back end port 80 between 2 IP addresses.

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





### Step 2

Next, you'll set the Application Gateway. You will use the `Set-AzureApplicationGatewayConfig` cmdlet with a configuration XML file.


	PS C:\> Set-AzureApplicationGatewayConfig -Name AppGwTest -ConfigFile "D:\config.xml"

	VERBOSE: 7:54:59 PM - Begin Operation: Set-AzureApplicationGatewayConfig
	VERBOSE: 7:55:32 PM - Completed Operation: Set-AzureApplicationGatewayConfig
	Name       HTTP Status Code     Operation ID                             Error
	----       ----------------     ------------                             ----
	Successful OK                   9b995a09-66fe-2944-8b67-9bb04fcccb9d

## Configure Application Gateway using a configuration object

The following example shows how to configure the Application Gateway using configuration objects. All configuration items have to be configured individually and then added to an Application Gateway configuration object. After creating the configuration object, you will use the `Set-AzureApplicationGateway` command to commit the configuration to the previously created Application Gateway resource.

>[AZURE.NOTE] Before assigning a value to each configuration object, you need to declare what kind of object PowerShell uses for storage. The first line to create the individual items defines what Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model(object name) will be used.

### Step 1

Create all individual configuration items.

Create front end IP as shown in the following example.

	PS C:\> $fip = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.FrontendIPConfiguration
	PS C:\> $fip.Name = "fip1"
	PS C:\> $fip.Type = "Private"
	PS C:\> $fip.StaticIPAddress = "10.0.0.5"

Create front end port as shown in the following example.

	PS C:\> $fep = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.FrontendPort
	PS C:\> $fep.Name = "fep1"
	PS C:\> $fep.Port = 80

Create back end server pool

 Define the IP addresses which will be added to the back end server pool as shown in the next example.


	PS C:\> $servers = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.BackendServerCollection
	PS C:\> $servers.Add("10.0.0.1")
	PS C:\> $servers.Add("10.0.0.2")

 Using the $server object, add the values to the back end pool object ($pool).

	PS C:\> $pool = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.BackendAddressPool
	PS C:\> $pool.BackendServers = $servers
	PS C:\> $pool.Name = "pool1"

Create back end server pool setting

	PS C:\> $setting = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.BackendHttpSettings
	PS C:\> $setting.Name = "setting1"
	PS C:\> $setting.CookieBasedAffinity = "enabled"
	PS C:\> $setting.Port = 80
	PS C:\> $setting.Protocol = "http"

Create listener

	PS C:\> $listener = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.HttpListener
	PS C:\> $listener.Name = "listener1"
	PS C:\> $listener.FrontendPort = "fep1"
	PS C:\> $listener.FrontendIP = "fip1"
	PS C:\> $listener.Protocol = "http"
	PS C:\> $listener.SslCert = ""

Create rule

	PS C:\> $rule = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.HttpLoadBalancingRule
	PS C:\> $rule.Name = "rule1"
	PS C:\> $rule.Type = "basic"
	PS C:\> $rule.BackendHttpSettings = "setting1"
	PS C:\> $rule.Listener = "listener1"
	PS C:\> $rule.BackendAddressPool = "pool1"

### Step 2

Assign all individual configuration items to a Application Gateway configuration object ($appgwconfig):

Add front end IP to the configuration

	PS C:\> $appgwconfig = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.ApplicationGatewayConfiguration
	PS C:\> $appgwconfig.FrontendIPConfigurations = New-Object "System.Collections.Generic.List[Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.FrontendIPConfiguration]"
	PS C:\> $appgwconfig.FrontendIPConfigurations.Add($fip)

Add front end port to the configuration

	PS C:\> $appgwconfig.FrontendPorts = New-Object "System.Collections.Generic.List[Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.FrontendPort]"
	PS C:\> $appgwconfig.FrontendPorts.Add($fep)

Add back end server pool to the configuration

	PS C:\> $appgwconfig.BackendAddressPools = New-Object "System.Collections.Generic.List[Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.BackendAddressPool]"
	PS C:\> $appgwconfig.BackendAddressPools.Add($pool)  

Add back end pool setting to the configuration

	PS C:\> $appgwconfig.BackendHttpSettingsList = New-Object "System.Collections.Generic.List[Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.BackendHttpSettings]"
	PS C:\> $appgwconfig.BackendHttpSettingsList.Add($setting)

Add listener to the configuration

	PS C:\> $appgwconfig.HttpListeners = New-Object "System.Collections.Generic.List[Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.HttpListener]"
	PS C:\> $appgwconfig.HttpListeners.Add($listener)

Add rule to the configuration

	PS C:\> $appgwconfig.HttpLoadBalancingRules = New-Object "System.Collections.Generic.List[Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.HttpLoadBalancingRule]"
	PS C:\> $appgwconfig.HttpLoadBalancingRules.Add($rule)

### Step 3

Commit the configuration object to the Application Gateway resource using `Set-AzureApplicationGatewayConfig`.

	Set-AzureApplicationGatewayConfig -Name AppGwTest -Config $appgwconfig

## Start the gateway

Once the gateway has been configured, use the `Start-AzureApplicationGateway` cmdlet to start the gateway. Billing for an Application Gateway begins after the gateway has been successfully started.


> [AZURE.NOTE] The `Start-AzureApplicationGateway` cmdlet might take up to 15-20 minutes to complete.



	PS C:\> Start-AzureApplicationGateway AppGwTest

	VERBOSE: 7:59:16 PM - Begin Operation: Start-AzureApplicationGateway
	VERBOSE: 8:05:52 PM - Completed Operation: Start-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error
	----       ----------------     ------------                             ----
	Successful OK                   fc592db8-4c58-2c8e-9a1d-1c97880f0b9b

## Verify the gateway status

Use the `Get-AzureApplicationGateway` cmdlet to check the status of the gateway. If *Start-AzureApplicationGateway* succeeded in the previous step, the State should be *Running*, and the Vip and DnsName should have valid entries.

The following example shows an Application Gateway that is up, running, and ready to take traffic destined to `http://<generated-dns-name>.cloudapp.net`.

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

To delete an Application Gateway:

1. Use the `Stop-AzureApplicationGateway` cmdlet to stop the gateway.
2. Use the `Remove-AzureApplicationGateway` cmdlet to remove the gateway.
3. Verify the gateway has been removed by using the `Get-AzureApplicationGateway` cmdlet.

The following example shows the `Stop-AzureApplicationGateway` cmdlet on the first line, followed by the output.

	PS C:\> Stop-AzureApplicationGateway AppGwTest

	VERBOSE: 9:49:34 PM - Begin Operation: Stop-AzureApplicationGateway
	VERBOSE: 10:10:06 PM - Completed Operation: Stop-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error
	----       ----------------     ------------                             ----
	Successful OK                   ce6c6c95-77b4-2118-9d65-e29defadffb8

Once the Application Gateway is in a Stopped state, use the `Remove-AzureApplicationGateway` cmdlet to remove the service.


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

## Next steps

If you want to configure SSL offload, see [Configure Application Gateway for SSL offload](application-gateway-ssl.md).

If you want to configure an Application Gateway to use with ILB, see [Create an Application Gateway with an Internal Load Balancer (ILB)](application-gateway-ilb.md).

If you want more information about load balancing options in general, see:

- [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
- [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)
