<properties 
   pageTitle="Create a Traffic Manager profile using PowerShell in Resource Manager | Microsoft Azure"
   description="Learn how to create an Traffic Manager profile using PowerShell in Resource Manager"
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
   ms.date="12/14/2015"
   ms.author="joaoma" />

# Create a Traffic Manager profile using PowerShell

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-arm-selectors-include.md](../../includes/traffic-manager-get-started-create-profile-arm-selectors-include.md)]

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-intro-include.md](../../includes/traffic-manager-get-started-create-profile-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](traffic-manager-get-started-create-profile-classic-ps.md).

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-scenario-include.md](../../includes/traffic-manager-get-started-create-profile-scenario-include.md)]

ENTER YOUR CONTENT HERE

[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]



The following example configures a new traffic manager profile using each of the routing methods.

Weighted routing method:

	New-AzureRmTrafficManagerProfile -Name trafficmanager-rm-weighted -ResourceGroupName nrp-rg -RelativeDnsName trafficmanager-rm-weighted.trafficmanager.net -TrafficRoutingMethod Weighted -Ttl 60 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath / 

Performance routing method:

	New-AzureRmTrafficManagerProfile -Name trafficmanager-rm-performance -ResourceGroupName nrp-rg -RelativeDnsName trafficmanager-rm-performance.trafficmanager.net -TrafficRoutingMethod Performance -Ttl 60 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath /  


Priority routing method:

	New-AzureRmTrafficManagerProfile -Name trafficmanager-rm-priority -ResourceGroupName nrp-rg -RelativeDnsName trfficmanager-rm-priority.trafficmanager.net -TrafficRoutingMethod Priority -Ttl 60 -MonitorProtocol HTTP -MonitorPort 80 -MonitorPath / -Verbose


>[AZURE.NOTE]Health monitoring is also configured for the endpoints when creating a traffic manager profile. A monitoring port, protocol and path for the endpoints was configured to make sure the endpoint is online and able to receive traffic from Internet clients.

### Understanding parameters in PowerShell

- **-Name**: The ARM resource name for the Traffic Manager profile resource.  Profiles in the same resource group must have unique names.  This name is separate from the DNS name used for DNS queries.

- **-ResourceGroupName**: The name of the ARM resource group containing the profile resource.

- **-TrafficRoutingMethod**: Specifies the traffic routing method, used to determine which endpoint is returned in response to incoming DNS queries. Possible values are ‘Performance’, ‘Weighted’ or ‘Priority’.

- **-RelativeDnsName**: Specifies the relative DNS name provided by this Traffic Manager profile.  This value is combined with the DNS domain name used by Azure Traffic Manager to form the fully-qualified domain name (FQDN) of the profile.  For example, the value ‘contoso’ will give a Traffic Manager profile with the fully-qualified name ‘contoso.trafficmanager.net.’

- **-TTL**: Specifies the DNS Time-to-Live (TTL), in seconds.  This informs the Local DNS resolvers and DNS clients how long to cache DNS responses provided by this Traffic Manager profile.

- **MonitorProtocol**: Specifies the protocol to use to monitor endpoint health. Possible values are ‘HTTP’ and ‘HTTPS’.

- **-MonitorPort**: Specifies the TCP port used to monitor endpoint health.

- **-MonitorPath**: Specifies the path relative to the endpoint domain name used to probe for endpoint health.
 
## Next steps

You need to [add endpoints](traffic-manager-get-started-create-endpoints-arm-ps.md) for the traffic manager profile. You can also [associate your company domain to a traffic manager profile](traffic-manager-point-internet-domain.md).
