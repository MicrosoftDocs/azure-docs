<properties
   pageTitle="Azure Resource Manager support for Traffic Manager | Microsoft Azure "
   description="Using powershell for Traffic Manager with Azure Resource Manager (ARM)"
   services="traffic-manager"
   documentationCenter="na"
   authors="jtuliani"
   manager="carmonm"
   editor="tysonn" />
<tags
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/17/2016"
   ms.author="jtuliani" />

# Azure Resource Manager support for Azure Traffic Manager
Azure Resource Manager (ARM) is the new management framework for services in Azure.  Azure Traffic Manager profiles can now be managed using Azure Resource Manager-based APIs and tools. 

## Resource model

Azure Traffic Manager is configured using a collection of settings called a Traffic Manager profile. This contains DNS settings, traffic routing settings, endpoint monitoring settings and the list of service endpoints to which traffic will be routed.

In ARM, each Traffic Manager profile is represented by an ARM resource, of type ‘TrafficManagerProfiles’, managed by the ‘Microsoft.Network’ resource provider.  At the REST API level, the URI for each profile is as follows:

	https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/trafficManagerProfiles/{profile-name}?api-version={api-version}

## Comparison with the Azure Traffic Manager Service Management API

Using ARM to configure Traffic Manager profiles provides access to the same set of Traffic Manager features as the Azure Service Management (ASM) API, with the exception of the Preview Limitations listed below.

However, whilst the features remain the same, some terminology has changed:

- The ‘load-balancing method’, which determines how Traffic Manager choose which endpoint to route traffic to when responding to a particular DNS request, has been renamed ‘traffic routing method’.

- The ‘round robin’ traffic routing method has been renamed ‘weighted’.

- The ‘failover’ traffic routing method has been renamed ‘priority’.

## Limitations
There are currently a small number of limitations in the ARM support for Azure Traffic Manager:

- Traffic Manager profiles created using the existing (non-ARM) Azure Service Management (ASM) API, tools and 'classic' portal are not available via ARM, and vice versa. Migration of profiles from ASM to ARM APIs is not currently supported, other than by deleting and re-creating the profile.

- Traffic Manager endpoints of type 'AzureEndpoints', when referencing a Web App, can only reference the default (production) [Web App slot](../app-service-web/web-sites-staged-publishing.md).  Custom slots are not yet supported.  As a workaround, custom slots can be configured using the 'ExternalEndpoints' type. 

## Setting up Azure PowerShell

These instructions use Microsoft Azure PowerShell, which needs to be configured using the steps below.

For non-PowerShell users, or non-Windows users, analogous operations can be executed via the Azure CLI.  All operations, with the exception of managing 'nested' Traffic Manager profiles, are also available via the Azure portal.

### Step 1
Install the latest Azure PowerShell, available from the Azure downloads page.

### Step 2
Log in to your Azure account.

	PS C:\> Login-AzureRmAccount

You will be prompted to authenticate with your credentials.

### Step 3
Choose which of your Azure subscriptions to use.

	PS C:\> Set-AzureRmContext -SubscriptionName "MySubscription"

To see a list of available subscriptions, use the ‘Get-AzureRmSubscription’ cmdlet.

### Step 4

The Traffic Manager service is managed by the Microsoft.Network resource provider.  Your Azure subscription needs to be registered to use this resource provider before you can use Traffic Manager via ARM.  This is a one-time operation for each subscription.

	PS C:\> Register-AzureRmResourceProvider –ProviderNamespace Microsoft.Network

### Step 5
Create a resource group (skip this step if using an existing resource group)

	PS C:\> New-AzureRmResourceGroup -Name MyRG -Location "West US"

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. However, since all Traffic Manager profile resources are global, not regional, the choice of resource group location has no impact on Azure Traffic Manager.

## Create a Traffic Manager Profile

To create a Traffic Manager profile, use the New-AzureRmTrafficManagerProfile cmdlet:

	PS C:\> $profile = New-AzureRmTrafficManagerProfile –Name MyProfile -ResourceGroupName MyRG -TrafficRoutingMethod Performance -RelativeDnsName contoso -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"

The parameters are as follows:

- Name: The ARM resource name for the Traffic Manager profile resource.  Profiles in the same resource group must have unique names.  This name is separate from the DNS name used for DNS queries.

- ResourceGroupName: The name of the ARM resource group containing the profile resource.

- TrafficRoutingMethod: Specifies the traffic routing method, used to determine which endpoint is returned in response to incoming DNS queries. Possible values are ‘Performance’, ‘Weighted’ or ‘Priority’.

- RelativeDnsName: Specifies the relative DNS name provided by this Traffic Manager profile.  This value is combined with the DNS domain name used by Azure Traffic Manager to form the fully-qualified domain name (FQDN) of the profile.  For example, the value ‘contoso’ will give a Traffic Manager profile with the fully-qualified name ‘contoso.trafficmanager.net.’

- TTL: Specifies the DNS Time-to-Live (TTL), in seconds.  This informs the Local DNS resolvers and DNS clients how long to cache DNS responses provided by this Traffic Manager profile.

- MonitorProtocol: Specifies the protocol to use to monitor endpoint health. Possible values are ‘HTTP’ and ‘HTTPS’.

- MonitorPort: Specifies the TCP port used to monitor endpoint health.

- MonitorPath: Specifies the path relative to the endpoint domain name used to probe for endpoint health.

The cmdlet creates a Traffic Manager profile in Azure Traffic Manager and returns a corresponding profile object.  At this point, the profile does not contain any endpoints—see [Adding Traffic Manager Endpoints](#adding-traffic-manager-endpoints) for details of how to add endpoints to a Traffic Manager profile.

## Get a Traffic Manager Profile

To retrieve an existing Traffic Manager profile object, use the Get-AzureRmTrafficManagerProfle cmdlet:

	PS C:\> $profile = Get-AzureRmTrafficManagerProfile –Name MyProfile -ResourceGroupName MyRG

This cmdlet returns a Traffic Manager profile object.

## Update a Traffic Manager Profile [](#update-traffic-manager-profile)

Modifying Traffic Manager profiles, for example to add or remove endpoints or modify profile settings, follows a 3-step process:

1.	Retrieve the profile using Get-AzureRmTrafficManagerProfile (or use the profile returned by New-AzureRmTrafficManagerProfile).

2.	Modify the profile, by either adding endpoints, removing endpoints, changing the endpoint parameters or changing profile paramters.  These changes are off-line operations, only the local object representing the profile is changed.

3.	Commit your changes using the Set-AzureRmTrafficManagerProfile cmdlet.  This replaces the existing profile in Azure Traffic Manager with the profile provided.

All profile properties can be changed, with the exception that the profile RelativeDnsName cannot be changed after the profile is created (to change this value, delete and re-create the profile).

For example, to change the profile TTL:

	PS C:\> $profile = Get-AzureRmTrafficManagerProfile –Name MyProfile -ResourceGroupName MyRG
	PS C:\> $profile.Ttl = 300
	PS C:\> Set-AzureRmTrafficManagerProfile –TrafficManagerProfile $profile

## Add Traffic Manager Endpoints
There are three types of Traffic Manager endpoints:

1. Azure endpoints: these represent services hosted in Azure.<BR>
2. External endpoints: these represent services hosted outside of Azure.<BR>
3. Nested endpoints: these are used to construct nested hierarchies of Traffic Manager profiles, to enable advanced traffic-routing configurations for more complex applications.  They are not yet supported via the ARM API.<BR>

In all three cases, endpoints can be added in two ways:<BR>

1. Using a 3-step process similar to that described in [Update a Traffic Manager Profile](#update-traffic-manager-profile): get the profile object using Get-AzureRmTrafficManagerProfile; update it off-line to add an endpoint, using Add-AzureRmTrafficManagerEndpointConfig; upload changes to Azure Traffic Manager using Set-AzureRmTrafficManagerProfile.  The advantage of this method is that a number of endpoint changes can be made in a single update.<BR>

2. Using the New-AzureRmTrafficManagerEndpoint cmdlet.  This adds an endpoint to an existing Traffic Manager profile in a single operation.

### Adding Azure Endpoints

Azure endpoints reference other services hosted in Azure.  Currently, 3 types of Azure endpoint are supported:<BR>
1. Azure Web Apps <BR>
2. 'Classic' cloud services (which can contain either a PaaS service or IaaS virtual machines)<BR>
3. ARM Microsoft.Network/publicIpAddress resources (which can be attached either to a load-balancer or a virtual machine NIC).  Note that the publicIpAddress must have a DNS name assigned to be used in Traffic Manager.

In each case:
 - The service is specified using the 'targetResourceId' parameter of Add-AzureRmTrafficManagerEndpointConfig or New-AzureRmTrafficManagerEndpoint.<BR>
 - The 'Target' and 'EndpointLocation' should not be specified, they are implied by the TargetResourceId specified above<BR>
 - Specifying the 'Weight' is optional.  Weights are only used if the profile is configured to use the 'Weighted' traffic-routing method, otherwise they are ignored.  If specified, they must be from the range 1...1000.  The default value is '1'.<BR>
 - Specifying the 'Priority' is optional.  Priorities are only used if the profile is configured to use the 'Priority' traffic-routing method, otherwise they are ignored.  Valid values are from 1 to 1000 (lower values are higher priority).  If specified for one endpoint, they must be specified for all endpoints.  If omitted, default values starting from 1, 2, 3, etc. are applied in the order the endpoints are provided.

#### Example 1: Adding Web App endpoints using Add-AzureRmTrafficManagerEndpointConfig
In this example, we create a new Traffic Manager profile and add two Web App endpoints using the Add-AzureRmTrafficManagerEndpointConfig cmdlet, then commit the updated profile to Azure Traffic Manager using Set-AzureRmTrafficManagerProfile.

	PS C:\> $profile = New-AzureRmTrafficManagerProfile –Name myprofile -ResourceGroupName MyRG -TrafficRoutingMethod Performance -RelativeDnsName myapp -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
	PS C:\> $webapp1 = Get-AzureRMWebApp -Name webapp1
	PS C:\> Add-AzureRmTrafficManagerEndpointConfig –EndpointName webapp1ep –TrafficManagerProfile $profile –Type AzureEndpoints -TargetResourceId $webapp1.Id –EndpointStatus Enabled
	PS C:\> $webapp2 = Get-AzureRMWebApp -Name webapp2
	PS C:\> Add-AzureRmTrafficManagerEndpointConfig –EndpointName webapp2ep –TrafficManagerProfile $profile –Type AzureEndpoints -TargetResourceId $webapp2.Id –EndpointStatus Enabled
	PS C:\> Set-AzureRmTrafficManagerProfile –TrafficManagerProfile $profile  

#### Example 2: Adding a 'classic' cloud service endpoint using New-AzureRmTrafficManagerEndpoint
In this example, a 'classic' Cloud Service endpoint is added to a Traffic Manager profile.  Note that in this case we chose to specify the profile using the profile name and resource group name, rather than passing a profile object (both approaches are supported).

	PS C:\> $cloudService = Get-AzureRmResource -ResourceName MyCloudService -ResourceType "Microsoft.ClassicCompute/domainNames" -ResourceGroupName MyCloudService
	PS C:\> New-AzureRmTrafficManagerEndpoint –Name MyCloudServiceEndpoint –ProfileName MyProfile -ResourceGroupName MyRG –Type AzureEndpoints -TargetResourceId $cloudService.Id –EndpointStatus Enabled

#### Example 3: Adding a publicIpAddress endpoint using New-AzureRmTrafficManagerEndpoint
In this example, an ARM public IP address resource is added to the Traffic Manager profile.  The public IP address must have a DNS name configured, and can be bound either to the NIC of a VM or to a load balancer.

	PS C:\> $ip = Get-AzureRmPublicIpAddress -Name MyPublicIP -ResourceGroupName MyRG
	PS C:\> New-AzureRmTrafficManagerEndpoint –Name MyIpEndpoint –ProfileName MyProfile -ResourceGroupName MyRG –Type AzureEndpoints -TargetResourceId $ip.Id –EndpointStatus Enabled

### Adding External Endpoints
Traffic Manager uses external endpoints to direct traffic to services hosted outside of Azure.  As with Azure endpoints, external endpoints can be added either using Add-AzureRmTrafficManagerEndpointConfig followed by Set-AzureRmTrafficManagerProfile, or New-AzureRMTrafficManagerEndpoint.

When specifying external endpoints:
 - The endpoint domain name must be specified using the 'Target' parameter<BR>
 - The 'EndpointLocation' is required if the 'Performance' traffic-routing method is used, otherwise it is optional.  The value must be a [valid Azure region name](https://azure.microsoft.com/regions/).<BR>
 - The 'Weight' and 'Priority' are optional, as for Azure endpoints.<BR>
 

#### Example 1: Adding external endpoints using Add-AzureRmTrafficManagerEndpointConfig and Set-AzureRmTrafficManagerProfile
In this example, we create a new Traffic Manager profile, add two external endpoints, and commit the changes.

	PS C:\> $profile = New-AzureRmTrafficManagerProfile –Name myprofile -ResourceGroupName MyRG -TrafficRoutingMethod Performance -RelativeDnsName myapp -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
	PS C:\> Add-AzureRmTrafficManagerEndpointConfig –EndpointName eu-endpoint –TrafficManagerProfile $profile –Type ExternalEndpoints -Target app-eu.contoso.com –EndpointStatus Enabled
	PS C:\> Add-AzureRmTrafficManagerEndpointConfig –EndpointName us-endpoint –TrafficManagerProfile $profile –Type ExternalEndpoints -Target app-us.contoso.com –EndpointStatus Enabled
	PS C:\> Set-AzureRmTrafficManagerProfile –TrafficManagerProfile $profile  

#### Example 2: Adding external endpoints using New-AzureRmTrafficManagerEndpoint
In this example, we add an external endpoint to an existing profile, specified using the profile name and resource group name.

	PS C:\> New-AzureRmTrafficManagerEndpoint –Name eu-endpoint –ProfileName MyProfile -ResourceGroupName MyRG –Type ExternalEndpoints -Target app-eu.contoso.com –EndpointStatus Enabled

### Adding 'Nested' endpoints

Traffic Manager allows you to configure a Traffic Manager profile (we'll call it a 'child' profile) as an endpoint within another Traffic Manager profile (which we'll call the 'parent' profile).

Nesting Traffic Manager enable you to create more flexible and powerful traffic-routing and failover schemes to support the needs of larger, more complex deployments. [This blog post](https://azure.microsoft.com/blog/new-azure-traffic-manager-nested-profiles/) gives several examples.

Nested endpoints are configured at the parent profile, using a specific endpoint type, 'NestedEndpoints'.  When specifying nested endpoints:
 - The endpoint (i.e. child profile) must be specified using the 'targetResourceId' parameter <BR>
 - The 'EndpointLocation' is required if the 'Performance' traffic-routing method is used, otherwise it is optional.  The value must be a [valid Azure region name](http://azure.microsoft.com/regions/).<BR>
 - The 'Weight' and 'Priority' are optional, as for Azure endpoints.<BR>
 - The 'MinChildEndpoints' parameter is optional, default '1'.  If the number of available endpoints in the child profile falls below this threshold, the parent profile will consider the child profile 'degraded' and divert traffic to the other parent profile endpoints.<BR>


#### Example 1: Adding nested endpoints using Add-AzureRmTrafficManagerEndpointConfig and Set-AzureRmTrafficManagerProfile

In this example, we create new Traffic Manager child and parent profiles, add the child as a nested endpoint in the parent, and commit the changes. (For brevity, we will not add any other endpoints to the child profile or to the parent profile, although normally these would also be required.)<BR>

	PS C:\> $child = New-AzureRmTrafficManagerProfile –Name child -ResourceGroupName MyRG -TrafficRoutingMethod Priority -RelativeDnsName child -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
	PS C:\> $parent = New-AzureRmTrafficManagerProfile –Name parent -ResourceGroupName MyRG -TrafficRoutingMethod Performance -RelativeDnsName parent -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
	PS C:\> Add-AzureRmTrafficManagerEndpointConfig –EndpointName child-endpoint –TrafficManagerProfile $parent –Type NestedEndpoints -TargetResourceId $child.Id –EndpointStatus Enabled -EndpointLocation "North Europe" -MinChildEndpoints 2
	PS C:\> Set-AzureRmTrafficManagerProfile –TrafficManagerProfile $profile

#### Example 2: Adding nested endpoints using New-AzureRmTrafficManagerEndpoint

In this example, we add an existing child profile as a nested endpoint to an existing parent profile, specified using the profile name and resource group name.

	PS C:\> $child = Get-AzureRmTrafficManagerEndpoint –Name child -ResourceGroupName MyRG
	PS C:\> New-AzureRmTrafficManagerEndpoint –Name child-endpoint –ProfileName parent -ResourceGroupName MyRG –Type NestedEndpoints -TargetResourceId $child.Id –EndpointStatus Enabled -EndpointLocation "North Europe" -MinChildEndpoints 2


## Update a Traffic Manager Endpoint
There are two ways to update an existing Traffic Manager endpoint:<BR>

1. Get the Traffic Manager profile using Get-AzureRmTrafficManagerProfile, update the endpoint properties within the profile, and commit the changes using Set-AzureRmTrafficManagerProfile.  This method has the advantage of being able to update more than one endpoint in a single operation.<BR>
2. Get the Traffic Manager endpoint using Get-AzureRmTrafficManagerEndpoint, update the endpoint properties, and commit the changes using Set-AzureRmTrafficManagerEndpoint.  This method is simpler, since it does not require indexing into the Endpoints array in the profile.<BR>

#### Example 1: Updating endpoints using Get-AzureRmTrafficManagerProfile and Set-AzureRmTrafficManagerProfile
In this example, we will modify the priority on two endpoints within an existing profile.

	PS C:\> $profile = Get-AzureRmTrafficManagerProfile –Name myprofile -ResourceGroupName MyRG
	PS C:\> $profile.Endpoints[0].Priority = 2
	PS C:\> $profile.Endpoints[1].Priority = 1
	PS C:\> Set-AzureRmTrafficManagerProfile –TrafficManagerProfile $profile

#### Example 2: Updating an endpoint using Get-AzureRmTrafficManagerEndpoint and Set-AzureRmTrafficManagerEndpoint
In this example, we will modify the weight of a single endpoint in an existing profile.

	PS C:\> $endpoint = Get-AzureRmTrafficManagerEndpoint -Name myendpoint -ProfileName myprofile -ResourceGroupName MyRG -Type ExternalEndpoints
	PS C:\> $endpoint.Weight = 20
	PS C:\> Set-AzureRmTrafficManagerEndpoint -TrafficManagerEndpoint $endpoint

## Enabling and Disabling Endpoints and Profiles
Traffic Manager allows individual endpoints to be enabled and disabled, as well as allowing enabling and disabling of entire profiles.
These changes can be made by getting/updating/setting the endpoint or profile resources.  To streamline these common operations, they are also supported via dedicated cmdlets.

#### Example 1: Enabling and disabling a Traffic Manager profile
To enable a Traffic Manager profile, use Enable-AzureRmTrafficManagerProfile.  The profile can be specified using a profile object (passed via the pipeline or using the '-TrafficManagerProfile' parameter), or by specifying the profile name and resource group name directly, as in this example.

	PS C:\> Enable-AzureRmTrafficManagerProfile -Name MyProfile -ResourceGroupName MyResourceGroup

Similarly, to disable a Traffic Manager profile: 

	PS C:\> Disable-AzureRmTrafficManagerProfile -Name MyProfile -ResourceGroupName MyResourceGroup

The Disable-AzureRmTrafficManagerProfile cmdlet will prompt for confirmation, this prompt can be suppressed using the '-Force' parameter.

#### Example 2: Enabling and disabling a Traffic Manager endpoint
To enable a Traffic Manager endpoint, use Enable-AzureRmTrafficManagerEndpoint.  The endpoint can be specified using a TrafficManagerEndpoint object (passed via the pipeline or using the '-TrafficManagerEndpoint' parameter), or by using the endpoint name, endpoint type, profile name and resource group name:

	PS C:\> Enable-AzureRmTrafficManagerEndpoint -Name MyEndpoint -Type AzureEndpoints -ProfileName MyProfile -ResourceGroupName MyRG

Similarly, to disable a Traffic Manager endpoint: 

 	PS C:\> Disable-AzureRmTrafficManagerEndpoint -Name MyEndpoint -Type AzureEndpoints -ProfileName MyProfile -ResourceGroupName MyRG -Force

As with Disable-AzureRmTrafficManagerProfile, the Disable-AzureRmTrafficManagerEndpoint cmdlet includes a confirmation prompt which can be suppressed using the '-Force' parameter.

## Delete a Traffic Manager Endpoint
One way to delete a Traffic Manager endpoint is to retrieve the profile object (using Get-AzureRmTrafficManagerProfile), update the endpoints list within the local profile object, and commit your changes (using Set-AzureRmTrafficManagerProfile).  This method allows multiple endpoint changes to be committed together.

Another way to remove individual endpoints is by using the Remove-AzureRmTrafficManagerEndpoint cmdlet:

	PS C:\> Remove-AzureRmTrafficManagerEndpoint -Name MyEndpoint -Type AzureEndpoints -ProfileName MyProfile -ResourceGroupName MyRG
	
This cmdlet will prompt for confirmation, unless the '-Force' parameter is used to suppress the prompt.

## Delete a Traffic Manager Profile
To delete a Traffic Manager profile, use the Remove-AzureRmTrafficManagerProfile cmdlet, specifying the profile name and resource group name:

	PS C:\> Remove-AzureRmTrafficManagerProfile –Name MyProfile -ResourceGroupName MyRG [-Force]

This cmdlet will prompt for confirmation.  The optional ‘-Force’ switch can be used to suppress this prompt.
The profile to be deleted can also be specified using a profile object:

	PS C:\> $profile = Get-AzureRmTrafficManagerProfile –Name MyProfile -ResourceGroupName MyRG
	PS C:\> Remove-AzureRmTrafficManagerProfile –TrafficManagerProfile $profile [-Force]

This sequence can also be piped:

	PS C:\> Get-AzureRmTrafficManagerProfile –Name MyProfile -ResourceGroupName MyRG | Remove-AzureRmTrafficManagerProfile [-Force]

## Next steps

[Traffic Manager monitoring](traffic-manager-monitoring.md)

[Traffic Manager performance considerations](traffic-manager-performance-considerations.md)
 
