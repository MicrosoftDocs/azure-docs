<properties 
   pageTitle="Create custom probe for Application Gateway using PowerShell in the classic deployment model | Microsoft Azure"
   description="Learn how to create custom probe for Application Gateway using PowerShell in the classic deployment model"
   services="application-gateway"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="12/17/2015"
   ms.author="joaoma" />

# Create custom probe for Application Gateway (classic) using PowerShell


[AZURE.INCLUDE [azure-probe-intro-include](../../includes/application-gateway-create-probe-intro-include.md)].

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](application-gateway-create-probe-ps.md).


[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]


## Create a new application gateway 

There is an order of steps you will have to follow to create an Application Gateway:

1. Create Application Gateway resource.
2. Create configuration XML file or configuration object.
3. Commit the configuration to newly created Application Gateway resource.

### Create an application gateway Resource

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

## Configure an application gateway

You can configure Application Gateway using XML or a configuration object.

## Configure an application gateway using XML

In the following example, you will use an XML file to configure all Application Gateway settings and commit them to the Application Gateway resource.  

### Step 1  

Copy the following text to Notepad.


	<ApplicationGatewayConfiguration xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure">
    <FrontendIPConfigurations>
        <FrontendIPConfiguration>
            <Name>fip1</Name>
            <Type>Private</Type>
        </FrontendIPConfiguration>
    </FrontendIPConfigurations>    
	<FrontendPorts>
        <FrontendPort>
            <Name>port1</Name>
            <Port>80</Port>
        </FrontendPort>
    </FrontendPorts>
    <Probes>
        <Probe>
            <Name>Probe01</Name>
            <Protocol>Http</Protocol>
            <Host>contoso.com</Host>
            <Path>/path/custompath.htm</Path>
            <Interval>15</Interval>
            <Timeout>15</Timeout>
            <UnhealthyThreshold>5</UnhealthyThreshold>
        </Probe>
    <BackendAddressPools>
        <BackendAddressPool>
            <Name>pool1</Name>
            <IPAddresses>
                <IPAddress>1.1.1.1</IPAddress>
				<IPAddress>2.2.2.2</IPAddress>
            </IPAddresses>
        </BackendAddressPool>
    </BackendAddressPools>
    <BackendHttpSettingsList>
        <BackendHttpSettings>
            <Name>setting1</Name>
            <Port>80</Port>
            <Protocol>Http</Protocol>
            <CookieBasedAffinity>Enabled</CookieBasedAffinity>
            <RequestTimeout>120</RequestTimeout>
            <Probe>Probe01</Probe>
        </BackendHttpSettings>
    </BackendHttpSettingsList>
    <HttpListeners>
        <HttpListener>
            <Name>listener1</Name>
            <FrontendIP>fip1</FrontendIP>
	    <FrontendPort>port1</FrontendPort>
            <Protocol>Http</Protocol>
        </HttpListener>
    </HttpListeners>
    <HttpLoadBalancingRules>
        <HttpLoadBalancingRule>
            <Name>lbrule1</Name>
            <Type>basic</Type>
            <BackendHttpSettings>setting1</BackendHttpSettings>
            <Listener>listener1</Listener>
            <BackendAddressPool>pool1</BackendAddressPool>
        </HttpLoadBalancingRule>
    </HttpLoadBalancingRules>
	</ApplicationGatewayConfiguration>


Edit the values between the parenthesis for the configuration items. Save the file with extension .xml

The following example shows how to use a configuration file to set up the Application Gateway to load balance Http traffic on public port 80 and send network traffic to back end port 80 between 2 IP addresses using custom probe.

>[AZURE.IMPORTANT] The protocol item Http or Https is case sensitive.


A new configuration item <Probe> is added to configure custom probes. 

The configuration parameters are:

- **Name** - reference name for custom probe
- **Protocol** - protocol used (possible values are Http or Https)
- **Host** and **Path** - Complete URL path which is invoked by Application Gateway to determine health of the instance. For example: you have a web site http://contoso.com/ then the custom probe can be configured for "http://contoso.com/path/custompath.htm" for probe checks to have successful HTTP response. 
- **Interval** - configures the probe interval checks in seconds 
- **Timeout** - defines the probe timeout for an HTTP response check
- **UnhealthyThreshold** - the number of failed HTTP responses it's needed to flag the back end instance as *unhealthy*

The probe name is referenced in the <BackendHttpSettings> configuration to assign which back end pool will use custom probe settings.

## Adding custom probe configuration to an existing application gateway

Changing the current configuration of an application gateway requires three steps: Get the current XML configuration file, modify to have custom probe and configure application gateway with the new XML settings.

### Step 1

Get the xml file using get-AzureApplicationGatewayConfig. This will export the configuration XML to be modified to add a probe setting
	
	get-AzureApplicationGatewayConfig -Name <application gateway name> -Exporttofile "<path to file>"


### Step 2 

Open the XML file in a text editor. Add `<probe>` section after `<frontendport>`
	
	<Probes>
        <Probe>
            <Name>Probe01</Name>
            <Protocol>Http</Protocol>
            <Host>contoso.com</Host>
            <Path>/path/custompath.htm</Path>
            <Interval>15</Interval>
            <Timeout>15</Timeout>
            <UnhealthyThreshold>5</UnhealthyThreshold>
        </Probe>

On backendHttpSettings section of the XML, Add the probe name as it shows in the example below:
    
        <BackendHttpSettings>
            <Name>setting1</Name>
            <Port>80</Port>
            <Protocol>Http</Protocol>
            <CookieBasedAffinity>Enabled</CookieBasedAffinity>
            <RequestTimeout>120</RequestTimeout>
            <Probe>Probe01</Probe>
        </BackendHttpSettings>

Save XML file


### Step 3 

Update application gateway configuration with the new XML file using `Set-AzureApplicationGatewayConfig`. This will update your application gateway with the new configuration.

	set-AzureApplicationGatewayConfig -Name <application gateway name> -Configfile "<path to file>"


## Next steps

If you want to configure SSL offload, see [Configure Application Gateway for SSL offload](application-gateway-ssl.md).

If you want to configure an Application Gateway to use with ILB, see [Create an Application Gateway with an Internal Load Balancer (ILB)](application-gateway-ilb.md).


