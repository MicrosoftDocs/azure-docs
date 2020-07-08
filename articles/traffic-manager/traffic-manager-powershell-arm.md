---
title: Using PowerShell to manage Traffic Manager in Azure
description: With this learning path, get started using Azure PowerShell for Traffic Manager.
services: traffic-manager
documentationcenter: na
author: rohinkoul
ms.service: traffic-manager
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/16/2017
ms.author: rohink
---

# Using PowerShell to manage Traffic Manager

Azure Resource Manager is the preferred management interface for services in Azure. Azure Traffic Manager profiles can be managed using Azure Resource Manager-based APIs and tools.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Resource model

Azure Traffic Manager is configured using a collection of settings called a Traffic Manager profile. This profile contains DNS settings, traffic routing settings, endpoint monitoring settings, and a list of service endpoints to which traffic is routed.

Each Traffic Manager profile is represented by a resource of type 'TrafficManagerProfiles'. At the REST API level, the URI for each profile is as follows:

    https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/trafficManagerProfiles/{profile-name}?api-version={api-version}

## Setting up Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

These instructions use Microsoft Azure PowerShell. The following article explains how to install and configure Azure PowerShell.

* [How to install and configure Azure PowerShell](/powershell/azure/overview)

The examples in this article assume that you have an existing resource group. You can create a resource group using the following command:

```powershell
New-AzResourceGroup -Name MyRG -Location "West US"
```

> [!NOTE]
> Azure Resource Manager requires that all resource groups have a location. This location is used as the default for resources created in that resource group. However, since Traffic Manager profile resources are global, not regional, the choice of resource group location has no impact on Azure Traffic Manager.

## Create a Traffic Manager Profile

To create a Traffic Manager profile, use the `New-AzTrafficManagerProfile` cmdlet:

```powershell
$TmProfile = New-AzTrafficManagerProfile -Name MyProfile -ResourceGroupName MyRG -TrafficRoutingMethod Performance -RelativeDnsName contoso -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
```

The following table describes the parameters:

| Parameter | Description |
| --- | --- |
| Name |The resource name for the Traffic Manager profile resource. Profiles in the same resource group must have unique names. This name is separate from the DNS name used for DNS queries. |
| ResourceGroupName |The name of the resource group containing the profile resource. |
| TrafficRoutingMethod |Specifies the traffic-routing method used to determine which endpoint is returned in response a DNS query. Possible values are 'Performance', 'Weighted' or 'Priority'. |
| RelativeDnsName |Specifies the hostname portion of the DNS name provided by this Traffic Manager profile. This value is combined with the DNS domain name used by Azure Traffic Manager to form the fully qualified domain name (FQDN) of the profile. For example, setting the value of 'contoso' becomes 'contoso.trafficmanager.net.' |
| TTL |Specifies the DNS Time-to-Live (TTL), in seconds. This TTL informs the Local DNS resolvers and DNS clients how long to cache DNS responses for this Traffic Manager profile. |
| MonitorProtocol |Specifies the protocol to use to monitor endpoint health. Possible values are 'HTTP' and 'HTTPS'. |
| MonitorPort |Specifies the TCP port used to monitor endpoint health. |
| MonitorPath |Specifies the path relative to the endpoint domain name used to probe for endpoint health. |

The cmdlet creates a Traffic Manager profile in Azure and returns a corresponding profile object to PowerShell. At this point, the profile does not contain any endpoints. For more information about adding endpoints to a Traffic Manager profile, see Adding Traffic Manager Endpoints.

## Get a Traffic Manager Profile

To retrieve an existing Traffic Manager profile object, use the `Get-AzTrafficManagerProfle` cmdlet:

```powershell
$TmProfile = Get-AzTrafficManagerProfile -Name MyProfile -ResourceGroupName MyRG
```

This cmdlet returns a Traffic Manager profile object.

## Update a Traffic Manager Profile

Modifying Traffic Manager profiles follows a 3-step process:

1. Retrieve the profile using `Get-AzTrafficManagerProfile` or use the profile returned by `New-AzTrafficManagerProfile`.
2. Modify the profile. You can add and remove endpoints or change endpoint or profile parameters. These changes are off-line operations. You are only changing the local object in memory that represents the profile.
3. Commit your changes using the `Set-AzTrafficManagerProfile` cmdlet.

All profile properties can be changed except the profile's RelativeDnsName. To change the RelativeDnsName, you must delete profile and a new profile with a new name.

The following example demonstrates how to change the profile's TTL:

```powershell
$TmProfile = Get-AzTrafficManagerProfile -Name MyProfile -ResourceGroupName MyRG
$TmProfile.Ttl = 300
Set-AzTrafficManagerProfile -TrafficManagerProfile $TmProfile
```

There are three types of Traffic Manager endpoints:

1. **Azure endpoints** are services hosted in Azure
2. **External endpoints** are services hosted outside of Azure
3. **Nested endpoints** are used to construct nested hierarchies of Traffic Manager profiles. Nested endpoints enable advanced traffic-routing configurations for complex applications.

In all three cases, endpoints can be added in two ways:

1. Using a 3-step process described previously. The advantage of this method is that several endpoint changes can be made in a single update.
2. Using the New-AzTrafficManagerEndpoint cmdlet. This cmdlet adds an endpoint to an existing Traffic Manager profile in a single operation.

## Adding Azure Endpoints

Azure endpoints reference services hosted in Azure. Two types of Azure endpoints are supported:

1. Azure App Service
2. Azure PublicIpAddress resources (which can be attached to a load-balancer or a virtual machine NIC). The PublicIpAddress must have a DNS name assigned to be used in Traffic Manager.

In each case:

* The service is specified using the 'targetResourceId' parameter of `Add-AzTrafficManagerEndpointConfig` or `New-AzTrafficManagerEndpoint`.
* The 'Target' and 'EndpointLocation' are implied by the TargetResourceId.
* Specifying the 'Weight' is optional. Weights are only used if the profile is configured to use the 'Weighted' traffic-routing method. Otherwise, they are ignored. If specified, the value must be a number between 1 and 1000. The default value is '1'.
* Specifying the 'Priority' is optional. Priorities are only used if the profile is configured to use the 'Priority' traffic-routing method. Otherwise, they are ignored. Valid values are from 1 to 1000 with lower values indicating a higher priority. If specified for one endpoint, they must be specified for all endpoints. If omitted, default values starting from '1' are applied in the order that the endpoints are listed.

### Example 1: Adding App Service endpoints using `Add-AzTrafficManagerEndpointConfig`

In this example, we create a Traffic Manager profile and add two App Service endpoints using the `Add-AzTrafficManagerEndpointConfig` cmdlet.

```powershell
$TmProfile = New-AzTrafficManagerProfile -Name myprofile -ResourceGroupName MyRG -TrafficRoutingMethod Performance -RelativeDnsName myapp -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
$webapp1 = Get-AzWebApp -Name webapp1
Add-AzTrafficManagerEndpointConfig -EndpointName webapp1ep -TrafficManagerProfile $TmProfile -Type AzureEndpoints -TargetResourceId $webapp1.Id -EndpointStatus Enabled
$webapp2 = Get-AzWebApp -Name webapp2
Add-AzTrafficManagerEndpointConfig -EndpointName webapp2ep -TrafficManagerProfile $TmProfile -Type AzureEndpoints -TargetResourceId $webapp2.Id -EndpointStatus Enabled
Set-AzTrafficManagerProfile -TrafficManagerProfile $TmProfile
```
### Example 2: Adding a publicIpAddress endpoint using `New-AzTrafficManagerEndpoint`

In this example, a public IP address resource is added to the Traffic Manager profile. The public IP address must have a DNS name configured, and can be bound either to the NIC of a VM or to a load balancer.

```powershell
$ip = Get-AzPublicIpAddress -Name MyPublicIP -ResourceGroupName MyRG
New-AzTrafficManagerEndpoint -Name MyIpEndpoint -ProfileName MyProfile -ResourceGroupName MyRG -Type AzureEndpoints -TargetResourceId $ip.Id -EndpointStatus Enabled
```

## Adding External Endpoints

Traffic Manager uses external endpoints to direct traffic to services hosted outside of Azure. As with Azure endpoints, external endpoints can be added either using `Add-AzTrafficManagerEndpointConfig` followed by `Set-AzTrafficManagerProfile`, or `New-AzTrafficManagerEndpoint`.

When specifying external endpoints:

* The endpoint domain name must be specified using the 'Target' parameter
* If the 'Performance' traffic-routing method is used, the 'EndpointLocation' is required. Otherwise it is optional. The value must be a [valid Azure region name](https://azure.microsoft.com/regions/).
* The 'Weight' and 'Priority' are optional.

### Example 1: Adding external endpoints using `Add-AzTrafficManagerEndpointConfig` and `Set-AzTrafficManagerProfile`

In this example, we create a Traffic Manager profile, add two external endpoints, and commit the changes.

```powershell
$TmProfile = New-AzTrafficManagerProfile -Name myprofile -ResourceGroupName MyRG -TrafficRoutingMethod Performance -RelativeDnsName myapp -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
Add-AzTrafficManagerEndpointConfig -EndpointName eu-endpoint -TrafficManagerProfile $TmProfile -Type ExternalEndpoints -Target app-eu.contoso.com -EndpointLocation "North Europe" -EndpointStatus Enabled
Add-AzTrafficManagerEndpointConfig -EndpointName us-endpoint -TrafficManagerProfile $TmProfile -Type ExternalEndpoints -Target app-us.contoso.com -EndpointLocation "Central US" -EndpointStatus Enabled
Set-AzTrafficManagerProfile -TrafficManagerProfile $TmProfile
```

### Example 2: Adding external endpoints using `New-AzTrafficManagerEndpoint`

In this example, we add an external endpoint to an existing profile. The profile is specified using the profile and resource group names.

```powershell
New-AzTrafficManagerEndpoint -Name eu-endpoint -ProfileName MyProfile -ResourceGroupName MyRG -Type ExternalEndpoints -Target app-eu.contoso.com -EndpointStatus Enabled
```

## Adding 'Nested' endpoints

Each Traffic Manager profile specifies a single traffic-routing method. However, there are scenarios that require more sophisticated traffic routing than the routing provided by a single Traffic Manager profile. You can nest Traffic Manager profiles to combine the benefits of more than one traffic-routing method. Nested profiles allow you to override the default Traffic Manager behavior to support larger and more complex application deployments. For more detailed examples, see [Nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

Nested endpoints are configured at the parent profile, using a specific endpoint type, 'NestedEndpoints'. When specifying nested endpoints:

* The endpoint must be specified using the 'targetResourceId' parameter
* If the 'Performance' traffic-routing method is used, the 'EndpointLocation' is required. Otherwise it is optional. The value must be a [valid Azure region name](https://azure.microsoft.com/regions/).
* The 'Weight' and 'Priority' are optional, as for Azure endpoints.
* The 'MinChildEndpoints' parameter is optional. The default value is '1'. If the number of available endpoints falls below this threshold, the parent profile considers the child profile 'degraded' and diverts traffic to the other endpoints in the parent profile.

### Example 1: Adding nested endpoints using `Add-AzTrafficManagerEndpointConfig` and `Set-AzTrafficManagerProfile`

In this example, we create new Traffic Manager child and parent profiles, add the child as a nested endpoint to the parent, and commit the changes.

```powershell
$child = New-AzTrafficManagerProfile -Name child -ResourceGroupName MyRG -TrafficRoutingMethod Priority -RelativeDnsName child -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
$parent = New-AzTrafficManagerProfile -Name parent -ResourceGroupName MyRG -TrafficRoutingMethod Performance -RelativeDnsName parent -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"
Add-AzTrafficManagerEndpointConfig -EndpointName child-endpoint -TrafficManagerProfile $parent -Type NestedEndpoints -TargetResourceId $child.Id -EndpointStatus Enabled -EndpointLocation "North Europe" -MinChildEndpoints 2
Set-AzTrafficManagerProfile -TrafficManagerProfile $parent
```

For brevity in this example, we did not add any other endpoints to the child or parent profiles.

### Example 2: Adding nested endpoints using `New-AzTrafficManagerEndpoint`

In this example, we add an existing child profile as a nested endpoint to an existing parent profile. The profile is specified using the profile and resource group names.

```powershell
$child = Get-AzTrafficManagerEndpoint -Name child -ResourceGroupName MyRG
New-AzTrafficManagerEndpoint -Name child-endpoint -ProfileName parent -ResourceGroupName MyRG -Type NestedEndpoints -TargetResourceId $child.Id -EndpointStatus Enabled -EndpointLocation "North Europe" -MinChildEndpoints 2
```

## Adding endpoints from another subscription

Traffic Manager can work with endpoints from different subscriptions. You need to switch to the subscription with the endpoint you want to add to retrieve the needed input to Traffic Manager. Then you need to switch to the subscriptions with the Traffic Manager profile, and add the endpoint to it. The below example shows how to do this with a public IP address.

```powershell
Set-AzContext -SubscriptionId $EndpointSubscription
$ip = Get-AzPublicIpAddress -Name $IpAddressName -ResourceGroupName $EndpointRG

Set-AzContext -SubscriptionId $trafficmanagerSubscription
New-AzTrafficManagerEndpoint -Name $EndpointName -ProfileName $ProfileName -ResourceGroupName $TrafficManagerRG -Type AzureEndpoints -TargetResourceId $ip.Id -EndpointStatus Enabled
```

## Update a Traffic Manager Endpoint

There are two ways to update an existing Traffic Manager endpoint:

1. Get the Traffic Manager profile using `Get-AzTrafficManagerProfile`, update the endpoint properties within the profile, and commit the changes using `Set-AzTrafficManagerProfile`. This method has the advantage of being able to update more than one endpoint in a single operation.
2. Get the Traffic Manager endpoint using `Get-AzTrafficManagerEndpoint`, update the endpoint properties, and commit the changes using `Set-AzTrafficManagerEndpoint`. This method is simpler, since it does not require indexing into the Endpoints array in the profile.

### Example 1: Updating endpoints using `Get-AzTrafficManagerProfile` and `Set-AzTrafficManagerProfile`

In this example, we modify the priority on two endpoints within an existing profile.

```powershell
$TmProfile = Get-AzTrafficManagerProfile -Name myprofile -ResourceGroupName MyRG
$TmProfile.Endpoints[0].Priority = 2
$TmProfile.Endpoints[1].Priority = 1
Set-AzTrafficManagerProfile -TrafficManagerProfile $TmProfile
```

### Example 2: Updating an endpoint using `Get-AzTrafficManagerEndpoint` and `Set-AzTrafficManagerEndpoint`

In this example, we modify the weight of a single endpoint in an existing profile.

```powershell
$endpoint = Get-AzTrafficManagerEndpoint -Name myendpoint -ProfileName myprofile -ResourceGroupName MyRG -Type ExternalEndpoints
$endpoint.Weight = 20
Set-AzTrafficManagerEndpoint -TrafficManagerEndpoint $endpoint
```

## Enabling and Disabling Endpoints and Profiles

Traffic Manager allows individual endpoints to be enabled and disabled, as well as allowing enabling and disabling of entire profiles.
These changes can be made by getting/updating/setting the endpoint or profile resources. To streamline these common operations, they are also supported via dedicated cmdlets.

### Example 1: Enabling and disabling a Traffic Manager profile

To enable a Traffic Manager profile, use `Enable-AzTrafficManagerProfile`. The profile can be specified using a profile object. The profile object can be passed via the pipeline or by using the '-TrafficManagerProfile' parameter. In this example, we specify the profile by the profile and resource group name.

```powershell
Enable-AzTrafficManagerProfile -Name MyProfile -ResourceGroupName MyResourceGroup
```

To disable a Traffic Manager profile:

```powershell
Disable-AzTrafficManagerProfile -Name MyProfile -ResourceGroupName MyResourceGroup
```

The Disable-AzTrafficManagerProfile cmdlet prompts for confirmation. This prompt can be suppressed using the '-Force' parameter.

### Example 2: Enabling and disabling a Traffic Manager endpoint

To enable a Traffic Manager endpoint, use `Enable-AzTrafficManagerEndpoint`. There are two ways to specify the endpoint

1. Using a TrafficManagerEndpoint object passed via the pipeline or using the '-TrafficManagerEndpoint' parameter
2. Using the endpoint name, endpoint type, profile name, and resource group name:

```powershell
Enable-AzTrafficManagerEndpoint -Name MyEndpoint -Type AzureEndpoints -ProfileName MyProfile -ResourceGroupName MyRG
```

Similarly, to disable a Traffic Manager endpoint:

```powershell
Disable-AzTrafficManagerEndpoint -Name MyEndpoint -Type AzureEndpoints -ProfileName MyProfile -ResourceGroupName MyRG -Force
```

As with `Disable-AzTrafficManagerProfile`, the `Disable-AzTrafficManagerEndpoint` cmdlet prompts for confirmation. This prompt can be suppressed using the '-Force' parameter.

## Delete a Traffic Manager Endpoint

To remove individual endpoints, use the `Remove-AzTrafficManagerEndpoint` cmdlet:

```powershell
Remove-AzTrafficManagerEndpoint -Name MyEndpoint -Type AzureEndpoints -ProfileName MyProfile -ResourceGroupName MyRG
```

This cmdlet prompts for confirmation. This prompt can be suppressed using the '-Force' parameter.

## Delete a Traffic Manager Profile

To delete a Traffic Manager profile, use the `Remove-AzTrafficManagerProfile` cmdlet, specifying the profile and resource group names:

```powershell
Remove-AzTrafficManagerProfile -Name MyProfile -ResourceGroupName MyRG [-Force]
```

This cmdlet prompts for confirmation. This prompt can be suppressed using the '-Force' parameter.

The profile to be deleted can also be specified using a profile object:

```powershell
$TmProfile = Get-AzTrafficManagerProfile -Name MyProfile -ResourceGroupName MyRG
Remove-AzTrafficManagerProfile -TrafficManagerProfile $TmProfile [-Force]
```

This sequence can also be piped:

```powershell
Get-AzTrafficManagerProfile -Name MyProfile -ResourceGroupName MyRG | Remove-AzTrafficManagerProfile [-Force]
```

## Next steps

[Traffic Manager monitoring](traffic-manager-monitoring.md)

[Traffic Manager performance considerations](traffic-manager-performance-considerations.md)
