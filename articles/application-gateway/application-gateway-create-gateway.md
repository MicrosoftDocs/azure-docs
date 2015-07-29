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
   ms.date="07/29/2015"
   ms.author="joaoma"/>

# Create, start, or delete an Application Gateway

In this release, you can create an Application Gateway by using PowerShell or REST API calls. Portal and CLI support will be provided in an upcoming release.
This article walks you through the steps to create and configure, start, and delete an application gateway.

## Before you begin

1. Install latest version of the Azure PowerShell cmdlets using the Web Platform Installer. You can download and install the latest version from the **Windows PowerShell** section of the [Download page](http://azure.microsoft.com/downloads/).
2. Verify that you have a working virtual network with valid subnet. Make sure no Virtual machines or cloud deployments are using the subnet. Application gateway must be by itself in a virtual network subnet.
3. The servers which you will configure to use the Application gateway must exist or have their endpoints created either in the virtual network, or with a public IP/VIP assigned.

## What is required to create an Application Gateway?
 

When you use New-AzureApplicationGateway command to create the Application gateway, no configuration is set at this point and the newly created resource will have to be configured either using XML or configuration object. 


The values are:

- **Back end server pool:** The list of IP addresses of the back end servers. The IP addresses listed should either belong to the virtual network subnet, or should be a public IP/VIP. 
- **Back end server pool settings:** Every pool has settings like port, protocol, and cookie based affinity. These settings are tied to a pool and are applied to all servers within the pool.
- **Front end Port:** This port is the public port opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back end servers.
- **Listener:** The listener has a frontend port, a protocol (Http or Https, these are case-sensitive), and the SSL certificate name (if configuring SSL offload). 
- **Rule:** The rule binds the listener and the back end server pool and defines which back end server pool the traffic should be directed to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.


 
## Create a new Application Gateway

There is an order of steps you will have to follow to create an Application gateway:

1. Create Application Gateway resource
2. Create configuration XML file or configuration object
3. Commit the configuration to newly created Application gateway resource

### Create an Application Gateway Resource

**To create the gateway**, use the `New-AzureApplicationGateway` cmdlet, replacing the values with your own. Note that billing for the gateway does not start at this point. Billing begins in a later step, when the gateway is successfully started.

The following example shows the creating a new Application Gateway. 
    
	PS C:\> New-AzureApplicationGateway -Name AppGwTest -VnetName testvnet1 -Subnets @("Subnet-1")

	VERBOSE: 4:31:35 PM - Begin Operation: New-AzureApplicationGateway 
	VERBOSE: 4:32:37 PM - Completed Operation: New-AzureApplicationGateway
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   55ef0460-825d-2981-ad20-b9a8af41b399


 *Description*, *InstanceCount*, and *GatewaySize* are optional parameters.


**To validate** that the gateway was created, you can use the `Get-AzureApplicationGateway` cmdlet. 

>[AZURE.NOTE]  The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. You can choose between Small, Medium and Large.


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

 *Vip* and *DnsName* are shown as blank because the gateway has not started yet. These will be created once the gateway is in the running state. 

## Configure Application Gateway

You can configure application gateway using the following methods below: XML or configuration object. 

## Configure Application gateway using XML 

In the example below, you will use an XML file to configure all Application Gateway settings and commit them to the Application Gateway resource.  

### Step 1  

Copy text below and paste it on notepad:

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

Edit the values between parenthesis for the configuration items. Save the file with extension .xml

>[AZURE.IMPORTANT] The protocol item Http or Https is case sensitive.

The following example shows how to use a configuration file setting up the Application gateway to load balance Http traffic on public port 80 and sending network traffic to back end port 80 between 2 IP addresses:

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

Next, you'll set the application gateway. You will use the `Set-AzureApplicationGatewayConfig` cmdlet with a configuration XML file. 


	PS C:\> Set-AzureApplicationGatewayConfig -Name AppGwTest -ConfigFile "D:\config.xml"

	VERBOSE: 7:54:59 PM - Begin Operation: Set-AzureApplicationGatewayConfig 
	VERBOSE: 7:55:32 PM - Completed Operation: Set-AzureApplicationGatewayConfig
	Name       HTTP Status Code     Operation ID                             Error 
	----       ----------------     ------------                             ----
	Successful OK                   9b995a09-66fe-2944-8b67-9bb04fcccb9d

## Configure Application Gateway using configuration object

The following example will show how to configure the application gateway using configuration objects. All configuration items have to be configured individually and then added to an Application gateway configuration object. After creating the configuration object, you will use `Set-AzureApplicationGateway` command to commit the configuration to the previously created Application Gateway resource.

>[AZURE.NOTE] Before assigning a value to each configuration object, you need to declare what kind of object PowerShell will be storing it. The first line to create the individual items defines what Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model(object name) will be used.

### Step 1

Create all individual configuration items:

Create front end IP:

	PS C:\> $fip = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.FrontendIPConfiguration 
	PS C:\> $fip.Name = "fip1" 
	PS C:\> $fip.Type = "Private" 
	PS C:\> $fip.StaticIPAddress = "10.0.0.5" 

Create front end port:
	
	PS C:\> $fep = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.FrontendPort 
	PS C:\> $fep.Name = "fep1" 
	PS C:\> $fep.Port = 80
	
Create back end server pool:

 Define the IP addresses which will be added to the back end server pool:


	PS C:\> $servers = New-Object Microsoft.WindowsAzure.Commands.ServiceManagement.Network.ApplicationGateway.Model.BackendServerCollection 
	PS C:\> $servers.Add("10.0.0.1") 
	PS C:\> $servers.Add("10.0.0.2")

 Using the $server object, add the values to the back end pool object ($pool)

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

Commit the configuration object to Application Gateway resource using `Set-AzureApplicationGatewayConfig`:
 
	Set-AzureApplicationGatewayConfig -Name AppGwTest -Config $appgwconfig

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
