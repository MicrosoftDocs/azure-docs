<properties 
   pageTitle="Create a Traffic Manager profile using the Azure CLI in Resource Manager | Microsoft Azure"
   description="Learn how to create an Traffic Manager profile using the Azure CLI in Resource Manager"
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

# Create a Traffic Manager profile using the Azure CLI

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-arm-selectors-include.md](../../includes/traffic-manager-get-started-create-profile-arm-selectors-include.md)]

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-intro-include.md](../../includes/traffic-manager-get-started-create-profile-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](traffic-manager-get-started-create-profile-classic-cli.md).

[AZURE.INCLUDE [traffic-manager-get-started-create-profile-scenario-include.md](../../includes/traffic-manager-get-started-create-profile-scenario-include.md)]

## Create a new traffic manager profile using azure network traffic-manager profile create

[AZURE.INCLUDE [azure-cli-prerequisites-include.md](../../includes/azure-cli-prerequisites-include.md)]


The following example configures a new traffic manager profile using each of the routing methods

Weighted routing method:

	azure network traffic-manager profile create --name trafficmanager-weighted --resource-group nrp-rg --profile-status enabled --relative-dns-name contoso-weighted.trafficmanager.net --traffic-routing-method Weighted --monitor-port 80 --monitor-protocol http --monitor-path / --ttl 60

Performance routing method:

	azure network traffic-manager profile create --name trafficmanager-Performance --resource-group nrp-rg --profile-status enabled --relative-dns-name contoso-performance.trafficmanager.net --traffic-routing-method Performance --monitor-port 80 --monitor-protocol http --monitor-path / --ttl 60


Priority routing method:

	azure network traffic-manager profile create --name trafficmanager-priority --resource-group nrp-rg --profile-status enabled --relative-dns-name contoso-priority.trafficmanager.net --traffic-routing-method Priority --monitor-port 80 --monitor-protocol http --monitor-path / --ttl 60


>[AZURE.NOTE]Health monitoring is also configured for the endpoints when creating a traffic manager profile. A monitoring port, protocol and path for the endpoints was configured to make sure the endpoint is online and able to receive traffic from Internet clients.

### Understanding parameters in CLI

- **--name**: The ARM resource name for the Traffic Manager profile resource.  Profiles in the same resource group must have unique names.  This name is separate from the DNS name used for DNS queries.

- **--profile-status**: Specifies if the traffic manager profile is enabled or disabled. The default status is enabled.

- **--traffic-routing-method**: Specifies the traffic routing method, used to determine which endpoint is returned in response to incoming DNS queries. Possible values are ‘Performance’, ‘Weighted’ or ‘Priority’.

- **--resource-group**: The name of the ARM resource group containing the profile resource.

- **--relative-dns-name**: Specifies the relative DNS name provided by this Traffic Manager profile.  This value is combined with the DNS domain name used by Azure Traffic Manager to form the fully-qualified domain name (FQDN) of the profile.  For example, the value ‘contoso’ will give a Traffic Manager profile with the fully-qualified name ‘contoso.trafficmanager.net.’

- **--ttl**: Specifies the DNS Time-to-Live (TTL), in seconds.  This informs the Local DNS resolvers and DNS clients how long to cache DNS responses provided by this Traffic Manager profile.

- **--monitor-protocol**: Specifies the protocol to use to monitor endpoint health. Possible values are ‘HTTP’ and ‘HTTPS’.

- **--monitor-port**: Specifies the TCP port used to monitor endpoint health.

- **--monitor-path**: Specifies the path relative to the endpoint domain name used to probe for endpoint health.

## Next steps

You need to [add endpoints](traffic-manager-get-started-create-endpoint-arm-cli.md) for the traffic manager profile. You can also [associate your company domain to a traffic manager profile](traffic-manager-point-internet-domain.md).
