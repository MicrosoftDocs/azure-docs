<properties 
   pageTitle="Create an endpoint for Traffic Manager by using PowerShell in Resource Manager | Microsoft Azure"
   description="Learn how to create an endpoint for Traffic Manager using PowerShell in Resource Manager"
   services="traffic-manager"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/20/2016"
   ms.author="joaoma" />

# Create an endpoint for Traffic Manager by using PowerShell

[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-arm-selectors-include.md](../../includes/traffic-manager-get-started-create-endpoint-arm-selectors-include.md)]

[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-intro-include.md](../../includes/traffic-manager-get-started-create-endpoint-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](traffic-manager-get-started-create-endpoint-classic-ps.md).

[AZURE.INCLUDE [traffic-manager-get-started-create-endpoint-scenario-include.md](../../includes/traffic-manager-get-started-create-endpoint-scenario-include.md)]


## Adding Azure Endpoints

[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]


Azure endpoints reference other services hosted in Azure.  Currently, 3 types of Azure endpoint are supported:

1. Azure Web Apps
2. 'Classic' cloud services (which can contain either a PaaS service or IaaS virtual machines)
3. ARM Microsoft.Network/publicIpAddress resources (which can be attached either to a load-balancer or a virtual machine NIC).  Note that the publicIpAddress must have a DNS name assigned to be used in Traffic Manager.

In each case:

 - The service is specified using the 'targetResourceId' parameter of Add-AzureRmTrafficManagerEndpointConfig or New-AzureRmTrafficManagerEndpoint.
 - The 'Target' and 'EndpointLocation' should not be specified, they are implied by the TargetResourceId specified above
 - Specifying the 'Weight' is optional.  Weights are only used if the profile is configured to use the 'Weighted' traffic-routing method, otherwise they are ignored.  If specified, they must be from the range 1...1000.  The default value is '1'.
 - Specifying the 'Priority' is optional.  Priorities are only used if the profile is configured to use the 'Priority' traffic-routing method, otherwise they are ignored.  Valid values are from 1 to 1000 (lower values are higher priority).  If specified for one endpoint, they must be specified for all endpoints.  If omitted, default values starting from 1, 2, 3, etc. are applied in the order the endpoints are provided.

### Example 1: Adding Web App endpoints using Add-AzureRmTrafficManagerEndpointConfig

In this example, we create a new Traffic Manager profile and add two Web App endpoints using the Add-AzureRmTrafficManagerEndpointConfig cmdlet, then commit the updated profile to Azure Traffic Manager using Set-AzureRmTrafficManagerProfile.

### Step 1
Create a new Traffic Manager profile.
	
	PS C:\> $profile = New-AzureRmTrafficManagerProfile –Name myprofile -ResourceGroupName myrg -TrafficRoutingMethod Performance -RelativeDnsName myapp -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"

### Step 2
Create a variable with the web app object to add as an endpoint.

	PS C:\> $webapp1 = Get-AzureRMWebApp -Name webapp1

### Step 3
Add an endpoint to the traffic manager profile using the variable object $webapp1 
	
	PS C:\> Add-AzureRmTrafficManagerEndpointConfig –EndpointName webapp1ep –TrafficManagerProfile $profile –Type AzureEndpoints -TargetResourceId $webapp1.Id –EndpointStatus Enabled

### Step 4
Create a second variable with the web app object to add as second endpoint.

	PS C:\> $webapp2 = Get-AzureRMWebApp -Name webapp2

### Step 5
Add an endpoint to the traffic manager profile using the variable object $webapp2.

	PS C:\> Add-AzureRmTrafficManagerEndpointConfig –EndpointName webapp2ep –TrafficManagerProfile $profile –Type AzureEndpoints -TargetResourceId $webapp2.Id –EndpointStatus Enabled

### Step 6
Save the configuration changes to the traffic manager profile. 

	PS C:\> Set-AzureRmTrafficManagerProfile –TrafficManagerProfile $profile  

### Example 2: Adding a 'classic' cloud service endpoint using New-AzureRmTrafficManagerEndpoint

In this example, a 'classic' Cloud Service endpoint is added to a Traffic Manager profile.  Note that in this case we chose to specify the profile using the profile name and resource group name, rather than passing a profile object (both approaches are supported).

### Step 1
Create a variable with a classic cloud service object to add as an endpoint.
The resource group name will be the same name as the classic cloud service.

	PS C:\> $cloudService = Get-AzureRmResource -ResourceName MyCloudService -ResourceType "Microsoft.ClassicCompute/domainNames" -ResourceGroupName MyCloudService

### Step 2
Add an endpoint to the traffic manager profile using the variable object $cloudservice.

	PS C:\> New-AzureRmTrafficManagerEndpoint –Name MyCloudServiceEndpoint –ProfileName MyProfile -ResourceGroupName MyRG –Type AzureEndpoints -TargetResourceId $cloudService.Id –EndpointStatus Enabled

### Example 3: Adding a publicIpAddress endpoint using New-AzureRmTrafficManagerEndpoint

In this example, an ARM public IP address resource is added to the Traffic Manager profile.  The public IP address must have a DNS name configured, and can be bound either to the NIC of a VM or to a load balancer.

### Step 1
Create a variable for the public IP object to add as an endpoint.

	PS C:\> $ip = Get-AzureRmPublicIpAddress -Name MyPublicIP -ResourceGroupName MyResourceGroup

### Step 2
Add an endpoint to traffic manager profile using the variable object $ip.

	PS C:\> New-AzureRmTrafficManagerEndpoint –Name MyIpEndpoint –ProfileName MyProfile -ResourceGroupName MyRG –Type AzureEndpoints -TargetResourceId $ip.Id –EndpointStatus Enabled

## Adding External Endpoints

Traffic Manager uses external endpoints to direct traffic to services hosted outside of Azure.  As with Azure endpoints, external endpoints can be added either using Add-AzureRmTrafficManagerEndpointConfig followed by Set-AzureRmTrafficManagerProfile, or New-AzureRMTrafficManagerEndpoint.

When specifying external endpoints:
 - The endpoint domain name must be specified using the 'Target' parameter
 - The 'EndpointLocation' is required if the 'Performance' traffic-routing method is used, otherwise it is optional.  The value must be a [valid Azure region name](http://azure.microsoft.com/regions/).
 - The 'Weight' and 'Priority' are optional, as for Azure endpoints.

### Example 1: Adding external endpoints using Add-AzureRmTrafficManagerEndpointConfig and Set-AzureRmTrafficManagerProfile

In this example, we create a new Traffic Manager profile, add two external endpoints, and commit the changes.

### Step 1 
Create a traffic manager profile called **myapp.trafficmanager.net**.

	PS C:\> $profile = New-AzureRmTrafficManagerProfile –Name myprofile -ResourceGroupName myrg -TrafficRoutingMethod Performance -RelativeDnsName myapp -Ttl 30 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath "/"

### Step 2 
Add external endpoint called app-eu.contoso.com to the traffic manager profile.

	PS C:\> Add-AzureRmTrafficManagerEndpointConfig –EndpointName eu-endpoint –TrafficManagerProfile $profile –Type ExternalEndpoints -Target app-eu.contoso.com –EndpointStatus Enabled

### Step 3
Add external endpoint called app-us.contoso.com to the traffic manager profile.

	PS C:\> Add-AzureRmTrafficManagerEndpointConfig –EndpointName us-endpoint –TrafficManagerProfile $profile –Type ExternalEndpoints -Target app-us.contoso.com –EndpointStatus Enabled

### Step 4
Save the configuration changes to the traffic manager profile.

	PS C:\> Set-AzureRmTrafficManagerProfile –TrafficManagerProfile $profile  

### Example 2: Adding external endpoints using New-AzureRmTrafficManagerEndpoint
In this example, we add an external endpoint to an existing profile, specified using the profile name and resource group name.

	PS C:\> New-AzureRmTrafficManagerEndpoint –Name eu-endpoint –ProfileName MyProfile -ResourceGroupName MyRG –Type ExternalEndpoints -Target app-eu.contoso.com –EndpointStatus Enabled

## Update a Traffic Manager Endpoint

There are two ways to update an existing Traffic Manager endpoint:

1. Get the Traffic Manager profile using Get-AzureRmTrafficManagerProfile, update the endpoint properties within the profile, and commit the changes using Set-AzureRmTrafficManagerProfile.  This method has the advantage of being able to update more than one endpoint in a single operation.
2. Get the Traffic Manager endpoint using Get-AzureRmTrafficManagerEndpoint, update the endpoint properties, and commit the changes using Set-AzureRmTrafficManagerEndpoint.  This method is simpler, since it does not require indexing into the Endpoints array in the profile.

### Example 1: Updating endpoints using Get-AzureRmTrafficManagerProfile and Set-AzureRmTrafficManagerProfile
In this example, we will modify the priority on two endpoints within an existing profile.

	PS C:\> $profile = Get-AzureRmTrafficManagerProfile –Name myprofile -ResourceGroupName myrg
	PS C:\> $profile.Endpoints[0].Priority = 2
	PS C:\> $profile.Endpoints[1].Priority = 1
	PS C:\> Set-AzureRmTrafficManagerProfile –TrafficManagerProfile $profile

### Example 2: Updating an endpoint using Get-AzureRmTrafficManagerEndpoint and Set-AzureRmTrafficManagerEndpoint
In this example, we will modify the weight of a single endpoint in an existing profile.

	PS C:\> $endpoint = Get-AzureRmTrafficManagerEndpoint -Name myendpoint -ProfileName myprofile -ResourceGroupName myrg -Type ExternalEndpoints
	PS C:\> $endpoint.Weight = 20
	PS C:\> Set-AzureRmTrafficManagerEndpoint -TrafficManagerEndpoint $endpoint


## Next steps

After configuring endpoints for your traffic manager profile, you have to [create a CNAME record to point your Internet domain to Traffic Manager](traffic-manager-point-internet-domain.md). This step will resolve your DNS record to your traffic manager resource. 

