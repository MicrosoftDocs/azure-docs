<properties 
   pageTitle="Create a Traffic Manager profile using PowerShell in the classic deployment model | Microsoft Azure"
   description="Learn how to create an Traffic Manager profile using PowerShell in the classic deployment model"
   services="traffic-manager"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="traffic-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="12/14/2015"
   ms.author="joaoma" />

# Create a Traffic Manager profile (classic) using PowerShell

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-classic-selectors-include.md](../../includes/traffic-manager-get-started-create-profile-classic-selectors-include.md)]

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-intro-include.md](../../includes/traffic-manager-get-started-create-profile-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-classic-include.md)] [Resource Manager model](traffic-manager-get-started-create-profile-arm-ps.md).

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-scenario-include.md](../../includes/traffic-manager-get-started-create-profile-scenario-include.md)]


[AZURE.INCLUDE [azure-ps-prerequisites-include.md](../../includes/azure-ps-prerequisites-include.md)]


## Create a new traffic manager profile using New-AzureTrafficManagerProfile


The following example configures a new traffic manager profile using each of the routing methods

Failover routing method:

	New-AzureTrafficManagerProfile -Name trafficmanager-failover -Domainname trafficmanager-failover.trafficmanager.net -LoadbalancingMethod Failover -MonitorPort 80 -MonitorProtocol Http -MonitorRelativePath '/' -Ttl 60 

Performance routing method:

	New-AzureTrafficManagerProfile -Name trafficmanager-performance -Domainname trafficmanager-performance.trafficmanager.net -LoadbalancingMethod Performance -MonitorPort 80 -MonitorProtocol Http -MonitorRelativePath '/' -Ttl 60

Round-robin routing method:

	New-AzureTrafficManagerProfile -Name trafficmanager-roundrobin -Domainname trafficmanager-roundrobin.trafficmanager.net -LoadbalancingMethod RoundRobin -MonitorPort 80 -MonitorProtocol Http -MonitorRelativePath '/' -Ttl 60

>[AZURE.NOTE] Health monitoring is also configured for the endpoints when creating a traffic manager profile. A monitoring port, protocol and path for the endpoints is configured to make sure the endpoint is online and able to receive traffic from Internet clients.

### Understanding parameters in Powershell

- **Name**: The ARM resource name for the Traffic Manager profile resource.  Profiles in the same resource group must have unique names.  This name is separate from the DNS name used for DNS queries.<BR>
- **DomainName**: Specifies the relative DNS name provided by this Traffic Manager profile.  This value is combined with the DNS domain name used by Azure Traffic Manager to form the fully-qualified domain name (FQDN) of the profile.  For example, the value ‘contoso’ will give a Traffic Manager profile with the fully-qualified name ‘contoso.trafficmanager.net.’<BR>
- **LoadBalancingMethod**: Specifies the traffic routing method, used to determine which endpoint is returned in response to incoming DNS queries. Possible values are ‘Performance’, ‘RoundRobin’ or ‘Failover’.
- **MonitorPort**: Specifies the TCP port used to monitor endpoint health.<BR>
- **MonitorProtocol**: Specifies the protocol to use to monitor endpoint health. Possible values are ‘HTTP’ and ‘HTTPS’.<BR>
- **MonitorRelativePath**: Specifies the path relative to the endpoint domain name used to probe for endpoint health.<BR>
- **TTL**: Specifies the DNS Time-to-Live (TTL), in seconds.  This informs the Local DNS resolvers and DNS clients how long to cache DNS responses provided by this Traffic Manager profile.<BR>

