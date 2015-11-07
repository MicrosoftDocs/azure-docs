<properties
   pageTitle="Azure Resource Manager support for Traffic Manager Preview | Microsoft Azure "
   description="Using powershell for Traffic Manager with Azure Resource Manager (ARM) in preview"
   services="traffic-manager"
   documentationCenter="na"
   authors="joaoma"
   manager="adinah"
   editor="tysonn" />
<tags
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/19/2015"
   ms.author="joaoma" />





# Azure Resource Manager support for Azure Traffic Manager Preview
Azure Resource Manager (ARM) is the new management framework for services in Azure.  Azure Traffic Manager profiles can now be managed using Azure Resource Manager-based APIs and tools. To learn more about Azure Resource Manager, see [Using Resource groups to manage your Azure resources](../azure-preview-portal-using-resource-groups.md).

>[AZURE.NOTE] ARM support for Traffic Manager is currently in Preview, including REST API, Azure PowerShell, Azure CLI and .NET SDK.



## Resource model

Azure Traffic Manager is configured using a collection of settings called a Traffic Manager profile. This contains DNS settings, traffic routing settings, endpoint monitoring settings and the list of service endpoints to which traffic will be routed.

In ARM, each Traffic Manager profile is represented by an ARM resource, of type ‘TrafficManagerProfiles’, managed by the ‘Microsoft.Network’ resource provider.  At the REST API level, the URI for each profile is as follows:

	https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/trafficManagerProfiles/{profile-name}?api-version={api-version}

## Comparison with the Azure Traffic Manager Service Management API

Using ARM to configure Traffic Manager profiles provides access to the same set of Traffic Manager features as the (non-ARM) service management API, with the exception of the Preview Limitations listed below.

However, whilst the features remain the same, some terminology has changed:

- The ‘load-balancing method’, which determines how Traffic Manager choose which endpoint to route traffic to when responding to a particular DNS request, has been renamed ‘traffic routing method’.

- The ‘round robin’ traffic routing method has been renamed ‘weighted’.

- The ‘failover’ traffic routing method has been renamed ‘priority’.

## Preview limitations
As the Azure Resource Manager support for Traffic Manager is a Preview service, there are currently a small number of limitations:

- Traffic Manager profiles created using the existing (non-ARM) service management API, tools and Portal are not available via ARM, and vice versa. Migration of profiles from non-ARM to ARM APIs is not currently supported.

- 	The REST API does not support PATCHing of Traffic Manager profiles.  To update a profile property, you must GET the profile, and PUT the modified profile.
- 	Only ‘external’ endpoints are supported.  These can still be used to use Traffic Manager with Azure-based services, and when doing so those endpoints will be billed at the internal endpoint rate.  (The only impact of using external endpoints is that they will not be disabled or deleted automatically if the underlying Azure service is disabled or deleted, instead you will have to disable or delete the endpoint manually).
-	Azure Traffic Manager is not yet available in the Azure portal, only on the classic portal.

## Setting up Azure PowerShell

These instructions use Microsoft Azure PowerShell, which needs to be configured using the steps below.

For non-PowerShell users, the same operations can also be executed via the other interfaces.

### Step 1
Install the latest Azure PowerShell, available from the Azure downloads page.
### Step 2
Switch PowerShell mode to use the ARM cmdlets. More info is available at Using Windows Powershell with Resource Manager.

	PS C:\> Switch-AzureMode -Name AzureResourceManager
### Step 3
Log in to your Azure account.

	PS C:\> Add-AzureAccount

You will be prompted to Authenticate with your credentials.

### Step 4
Choose which of your Azure subscriptions to use.

	PS C:\> Select-AzureSubscription -SubscriptionName "MySubscription"

To see a list of available subscriptions, use the ‘Get-AzureSubscription’ cmdlet.

### Step 5

 The Traffic Manager service is managed by the Microsoft.Network resource provider.  Your Azure subscription needs to be registered to use this resource provider before you can use Traffic Manager via ARM.  This is a one-time operation for each subscription.

	PS C:\> Register-AzureProvider –ProviderNamespace Microsoft.Network

### Step 6
Create a resource group (skip this step if using an existing resource group)

	PS C:\> New-AzureResourceGroup -Name MyAzureResourceGroup -location "West US"

Azure Resource Manager requires that all resource groups specify a location. This is used as the default location for resources in that resource group. However, since all Traffic Manager profile resources are global, not regional, the choice of resource group location has no impact on Azure Traffic Manager.

## Create a Traffic Manager Profile

To create a Traffic Manager profile, use the New-AzureTrafficManagerProfile cmdlet:

	PS C:\> $profile = New-AzureTrafficManagerProfile –Name MyProfile -ResourceGroupName MyAzureResourceGroup -TrafficRoutingMethod Performance -RelativeDnsName contoso -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"

The parameters are as follows:

- Name: The ARM resource name for the Traffic Manager profile resource.  Profiles in the same resource group must have unique names.  This name is separate from the DNS name used for DNS queries.

-	ResourceGroupName: The name of the ARM resource group containing the profile resource.

-	TrafficRoutingMethod: Specifies the traffic routing method, used to determine which endpoint is returned in response to incoming DNS queries. Possible values are ‘Performance’, ‘Weighted’ or ‘Priority’.

-	RelativeDnsName: Specifies the relative DNS name provided by this Traffic Manager profile.  This value is combined with the DNS domain name used by Azure Traffic Manager to form the fully-qualified domain name (FQDN) of the profile.  For example, the value ‘contoso’ will give a Traffic Manager profile with the fully-qualified name ‘contoso.trafficmanager.net’.

-	TTL: Specifies the DNS Time-to-Live (TTL), in seconds.  This informs the Local DNS resolvers and DNS clients how long to cache DNS responses provided by this Traffic Manager profile.

-	MonitorProtocol: Specifies the protocol to use to monitor endpoint health. Possible values are ‘HTTP’ and ‘HTTPS’.

-	MonitorPort: Specifies the TCP port used to monitor endpoint health.

-	MonitorPath: Specifies the path relative to the endpoint domain name used to probe for endpoint health.

The cmdlet creates a Traffic Manager profile in Azure Traffic Manager and returns a corresponding profile object.  At this point, the profile does not contain any endpoints—see [Update a Traffic Manager Profile](#update-a-traffic-manager-profile) for details of how to add endpoints to a Traffic Manager profile.

## Get a Traffic Manager Profile

To retrieve an existing Traffic Manager profile object, use the Get-AzureTrafficManagerProfle cmdlet:

	PS C:\> $profile = Get-AzureTrafficManagerProfile –Name MyProfile -ResourceGroupName MyAzureResourceGroup

This cmdlet returns a Traffic Manager profile object.

## Update a Traffic Manager Profile [](#update-traffic-manager-profile)

Modifying Traffic Manager profiles, for example to add or remove endpoints or modify profile settings, follows a 3-step process:

1.	Retrieve the profile using Get-AzureTrafficManagerProfile (or use the profile returned by New-AzureTrafficManagerProfile).

2.	Modify the profile, by either adding endpoints, removing endpoints, changing the endpoint parameters or changing profile paramters.  These changes are off-line—only the local object representing the profile is changed.

3.	Commit your changes using the Set-AzureTrafficManagerProfile cmdlet.  This replaces the existing profile in Azure Traffic Manager with the profile provided.

This can be further explained using the examples below:

### Add endpoints to a Profile

Endpoints can be added to a Traffic Manager profile using the ‘Add-AzureTrafficManagerEndpointConfig’ cmdlet:

	PS C:\> $profile = Get-AzureTrafficManagerProfile –Name MyProfile -ResourceGroupName MyAzureResourceGroup
	PS C:\> Add-AzureTrafficManagerEndpointConfig –EndpointName site1 –TrafficManagerProfile $profile –Type ExternalEndpoints –Target site1.contoso.com –EndpointStatus Enabled –Weight 10 –Priority 1 –EndpointLocation “West US”
	PS C:\> Set-AzureTrafficManagerProfile –TrafficManagerProfile $profile

The parameters to Add-AzureTrafficManagerEndpointConfig are as follows:

- EndpointName: The name of the endpoint.  Endpoints in the same profile must have distinct names.  This is used to reference the endpoint during service management operations, it is not the DNS name of the endpoint.

-	TrafficManagerProfile: The Traffic Manager profile object to which the endpoint will be added.

-	Type: The type of the Traffic Manager endpoint.  Currently, only the ‘ExternalEndpoint’ type is supported via the ARM API (see [Preview Limitations](#preview-limitations)).

-	Target: The fully-qualified DNS name of the endpoint.  Traffic Manager returns this value in DNS responses to direct traffic to this endpoint.

-	EndpointStatus: Specifies the status of the endpoint.  If the endpoint is Enabled, it is probed for endpoint health and is included in the traffic routing method. Possible values are ‘Enabled’ or ‘Disabled’.

-	Weight: Specifies the weight assigned to the endpoint.  This is only used if the Traffic Manager profile is configured to use the 'weighted' traffic routing method.  Possible values are from 1 to 1000.

-	Priority: Specifies the priority of this endpoint when using the ‘priority’ traffic routing method. Priority must lie in the range 1…1000.  Lower values represent higher priority.

-	EndpointLocation: Specifies the location of the external endpoint, for use with the ‘Performance’ traffic routing method.  For a list of possible locations, see Get-AzureLocation.

Endpoint Status, Weight and Priority are optional parameters.  If omitted, they are not passed by PowerShell and the server-side defaults apply.

### Remove endpoints from a Profile

To remove an endpoint from a profile, use ‘Remove-AzureTrafficmanagerEndpointConfig’, specifying the name of the endpoint to be removed:

	PS C:\> $profile = Get-AzureTrafficManagerProfile –Name MyProfile -ResourceGroupName MyAzureResourceGroup
	PS C:\> Remove-AzureTrafficManagerEndpointConfig –EndpointName site1 –TrafficManagerProfile $profile
	PS C:\> Set-AzureTrafficManagerProfile –TrafficManagerProfile $profile

The sequence of operations to add or remove endpoints can also be ‘piped’, passing the profile object via the pipe instead of as a parameter.  For example:

	PS C:\> Get-AzureTrafficManagerProfile –Name MyProfile -ResourceGroupName MyAzureResourceGroup | Remove-AzureTrafficManagerEndpointConfig –EndpointName site1 | Set-AzureTrafficManagerProfile

### Change profile or endpoint settings

Both profile and endpoint parameters can be changed off-line, and the changes committed using Set-AzureTrafficManagerProfile.  The only exception is that the profile RelativeDnsName cannot be changed after the profile is created (to change this value, delete and re-create the profile).
For example, to change the profile TTL and the status of the first endpoint:

	PS C:\> $profile = Get-AzureTrafficManagerProfile –Name MyProfile -ResourceGroupName MyAzureResourceGroup
	PS C:\> $profile.Ttl = 300
	PS C:\> $profile.Endpoints[0].EndpointStatus = "Disabled"
	PS C:\> Set-AzureTrafficManagerProfile –TrafficManagerProfile $profile

### Delete a Traffic Manager Profile
To delete a Traffic Manager profile, use the Remove-AzureTrafficManagerProfile cmdlet, specifying the profile name and resource group name:

	PS C:\> Remove-AzureTrafficManagerProfile –Name MyProfile -ResourceGroupName MyAzureResourceGroup [-Force]

This cmdlet will prompt for confirmation.  The optional ‘-Force’ switch can be used to suppress this prompt.
The profile to be deleted can also be specified using a profile object:

	PS C:\> $profile = Get-AzureTrafficManagerProfile –Name MyProfile -ResourceGroupName MyAzureResourceGroup
	PS C:\> Remove-AzureTrafficManagerProfile –TrafficManagerProfile $profile [-Force]

This sequence can also be piped:

	PS C:\> Get-AzureTrafficManagerProfile –Name MyProfile -ResourceGroupName MyAzureResourceGroup | Remove-AzureTrafficManagerProfile [-Force]


## See Also

[What is Traffic Manager?](traffic-manager-overview.md)

[Getting started with Azure cmdlets](https://msdn.microsoft.com/library/jj554332.aspx)
 