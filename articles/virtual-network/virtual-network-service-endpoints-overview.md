---
title: Azure virtual network service endpoints | Microsoft Docs
description: Learn how to enable direct access to Azure resources from a virtual network using service endpoints.
services: virtual-network
documentationcenter: na
author: anithaa
manager: narayan
editor: ''

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/15/2017
ms.author: anithaa
ms.custom: 
---

# Virtual Network Service Endpoints (Preview)

Virtual Network(VNet) service endpoints extend your virtual network private address space and the identity of your VNet to the Azure services, over a direct connection. Endpoints allow you to secure your critical Azure service resources to only your virtual networks. Traffic from your VNet to the Azure service always remains on the Microsoft Azure backbone network.

This feature is available in __preview__ for following Azure services and regions:

__Azure Storage__: WestCentralUS, WestUS2, EastUS, WestUS, AustraliaEast, AustraliaSouthEast.

__Azure SQL Database__: WestCentralUS, WestUS2, EastUS.

For most up-to-date notifications for the preview, check the [Azure Virtual Network updates](https://azure.microsoft.com/updates/?product=virtual-network) page.

> [!NOTE]
> During preview, the feature may not have the same level of availability and reliability as features that are in general availability release. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Key Benefits

Service endpoints provide following benefits:

- __Improved security for your Azure service resources__

  With service endpoints, Azure service resources can be secured to your virtual network. This gives you improved security by fully removing public Internet access to these resources and allowing traffic only from your virtual network.

- __Optimal routing for Azure service traffic from your Virtual Network__

  Today, any routes in your VNet that force Internet traffic through on-premises and/or virtual appliances, known as forced-tunneling, also force Azure service traffic to take the same route as the Internet traffic. Service endpoints provide optimal routing for Azure traffic. 

  Endpoints always take service traffic directly from your VNet to the service on the Microsoft Azure backbone network. This allows you to continue auditing and monitoring the outbound Internet traffic from your VNets, through forced-tunneling, without impacting the service traffic. Learn more about [user-defined routes and forced-tunneling.](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview)

- __Simple to set up with less management overhead__

  You no longer need reserved, public IP addresses in your VNets to secure Azure resources through IP firewall. There are no NAT or Gateway devices required to set up the service endpoints. Service endpoint can be configured through a simple click on a subnet. No additional overhead to maintaining the endpoints.

## Limitations

- The feature is available only to VNets deployed using Azure Resource Manager deployment model.
- Endpoints are enabled on subnets configured in Azure VNets. Endpoints cannot be used for traffic from your on-premises to Azure services. For more details, see ["Securing Azure service access from on-premises"](#Securing%20Azure%20services%20to%20Virtual-Networks)
- Service endpoint applies only to Azure service traffic within VNet’s region. For Azure Storage, to support RA-GRS and GRS traffic, this also extends to include paired region where the VNet is deployed to. Learn more about [Azure paired regions.](https://docs.microsoft.com/azure/best-practices-availability-paired-regions#what-are-paired-regions)

## Securing Azure services to Virtual Networks

- VNet service endpoint provides identity of your VNet to the Azure service. Once service endpoints are enabled in your VNet, you can secure Azure service resources to your VNet by adding a Virtual network rule to the resources.
- Today, Azure service traffic from your VNet uses public IPs as source IPs. With service endpoints, service traffic switches to use VNet private addresses as the source IPs when accessing the Azure service from your VNet. This switch allows you to access the services without the need for reserved, public IP addresses used in IP firewalls.
- __Securing Azure service access from on-premises__:
 
   By default, Azure service resources secured to virtual networks are not reachable from on-premises networks. If you want to allow traffic from on-premises, you must also allow NAT IP addresses from your on-premises or ExpressRoute circuits. NAT IP addresses can be added through IP firewall configuration for Azure service resources.
  
   __ExpressRoute__: 

    If you are using [ExpressRoute](/azure/expressroute/expressroute-introduction) (ER) from your on-premises, each Expressroute circuit uses two NAT IP addresses, that are applied to Azure service traffic when the traffic enters the Microsoft Azure network backbone.  To allow access to your service resources , you must allow those two IP addresses in the resource IP firewall setting.  In order to find your ExpressRoute circuit IP addresses, [open a support ticket with ExpressRoute](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) via the Azure portal.

![Securing Azure Services to Virtual Networks](media/virtual-network-service-endpoints-overview/VNet_Service_Endpoints_Overview.png)

### Configuration

- Service endpoints are configured on a subnet in a VNet. Endpoints work with any type of compute instances running within that subnet.
- Only one service endpoint can be enabled to a specific service from a subnet. You can configure multiple service endpoints for all supported Azure services (Say, Storage, Sql) on a subnet.
- VNets should be in the same region as the Azure service resource. For Azure Storage, if using GRS and RA-GRS accounts, the primary account should be in the same region as the VNet.
- VNet where the endpoint is configured can be in the same or different subscription as the Azure service resource. For more information on permissions required for setting up endpoints and securing Azure services, see ["Provisioning”](#Provisioning) section below.
- For supported services, you can secure new or existing resources to VNets using service endpoints.

### Considerations

- On enabling a service endpoint, the source IP addresses of virtual machines in the subnet switch from using public IPv4 addresses to using their private IPv4 address, when communicating with the service from that subnet.
  - Any existing open TCP connections to the service will be closed during this switch. Ensure that no critical tasks are running when enabling or disabling a service endpoint to a service for a subnet. Also, ensure that your applications can automatically connect to Azure services after this IP address switch.
  - IP address switch only impacts service traffic from your VNet. There is no impact to any other traffic addressed to/from public IPV4 addresses assigned to your VMs. 
  - For Azure services, if you have existing firewall rules using Azure public IPs, these rules stop working with the switch to VNet private addresses.
- With service endpoints, DNS entries for Azure services remain as is today and continue to resolve to IP addresses assigned to the Azure service.
- Network security groups (NSGs) with service endpoints:
  - By default, NSGs allow outbound Internet traffic and so, also allow traffic from your VNet to Azure services. This continues to work as is, with service endpoints.
  - If you want to deny all outbound Internet traffic and allow only traffic to specific Azure services,  you can do so using __“Azure service tags”__ in your NSGs. You can specify supported Azure services as destination in your NSG rules and the maintenance of IP addresses underlying each tag is provided by Azure. For more information, see [Azure Service tags for NSGs.](https://aka.ms/servicetags)

### Scenarios

- Peered, connected or multiple VNets:

To secure Azure services to multiple subnets within a VNet or across multiple VNets, you can enable service endpoints on each of these subnets independently and secure Azure service resources to all of these subnets.

- Filtering outbound traffic from VNet to Azure services:

If you want to inspect or filter the traffic destined to an Azure service from the virtual network, you can deploy a Network Virtual Appliance (NVA) within that VNet. You can then apply service endpoints to the subnet where the NVA is deployed and secure Azure service resource only to this subnet. This scenario might be helpful if you wish to restrict Azure service access from your VNet only to specific Azure resources, using NVA filtering. For more information, read the [egress with NVAs](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/dmz/nva-ha#egress-with-layer-7-nvas) article.

- Securing Azure resources to services deployed directly into VNets:

Various Azure services can be directly deployed into specific subnets in your VNets. You can secure Azure service resources to [managed service](virtual-network-for-azure-services.md) subnets, by setting up a service endpoint on the managed service subnet.

### Logging and troubleshooting

Once service endpoints are configured to a specific service, validate that the service endpoint route is in effect by: 

- __Monitoring Azure service diagnostics__: You can confirm request access is coming from your private network, i.e. your VNet, by validating the "source IP" of any service request in the service diagnostics. All new requests with service endpoints show the "source IP" for the request as the VNet private address, assigned to the client making the request from your VNet. Without the endpoint, this address will be an Azure public IP.

- __Effective routes__ on any NIC in subnet show a more specific “default” route to address prefix range of that service. The route has a nextHopType as "VirtualNetworkServiceEndpoint". This route indicates that a more direct connection to the service is in effect, compared to any forced-tunneling routes.

[!NOTE] Service endpoint route overrides BGP or UDR routes for the address prefix match, as the Azure service. Learn more about [troubleshooting with effective routes](https://docs.microsoft.com/azure/virtual-network/virtual-network-routes-troubleshoot-portal#using-effective-routes-to-troubleshoot-vm-traffic-flow)

### Provisioning

Service endpoints can be configured on virtual networks independently, by a user with write access to virtual network.

To secure Azure service resources to a VNet, the user must have permission to "Microsoft.Network/JoinServicetoaSubnet" for the subnets being added. This permission is included in the built-in service administrator roles, by default and can be modified by creating custom roles.

Learn more about [built-in roles](https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles) and assigning specific permissions to [custom roles](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-custom-roles).

VNets and Azure service resources can be in the same or different subscriptions. If the VNet and Azure service resources are in different subscriptions, the resources should be under the same Active Directory (AD) tenant, during this preview. 

## Pricing and Limits

There is no additional charge for using service endpoints. Current pricing model for Azure services (Azure Storage, Azure SQL Database) applies as is today.

No limit on the total number of service endpoints in a VNet.

For an Azure service resource (such as, Storage account), services may enforce limits on number of subnets used for securing the resource. Refer to the documentation for various services in ["Next steps"](#next%20steps) for details.

## Next Steps

- Learn [how to configure VNet service endpoints](virtual-network-service-endpoints-configure.md)
- Learn more about [Securing Azure Storage accounts to Virtual Networks](https://docs.microsoft.com/azure/storage/common/storage-network-security)
- Learn more about [Securing Azure SQL Database to Virtual networks](https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview)
- [Azure service integration overview for virtual networks](virtual-network-for-azure-services.md)

