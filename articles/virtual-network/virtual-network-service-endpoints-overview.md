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

Virtual Network (VNet) service endpoints provide a direct connection from your Virtual Network to an Azure service, allowing you to use VNet's private address to access the service. Traffic destined to Azure services through service endpoints always stays on the Microsoft Azure backbone network. By extending VNet's private address space and identity to the service, endpoints give you the ability to secure Azure service resources only to your virtual network.

__This feature is available in preview for Azure Storage and Azure SQL, in specific Azure regions.__

For information on supported regions and most up-to-date notifications, check the [Azure Virtual Network updates](https://azure.microsoft.com/updates/?product=virtual-network) page.

[!NOTE]  During preview, the feature may not have the same level of availability and reliability as features that are in general availability release. Production workloads are not supported. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## __Key Benefits__

Service endpoints provide following benefits:

- __Improved security for Azure services__

With service endpoints, Azure service resources can be secured to your virtual network. This gives you improved security by fully removing public Internet access to these resources and allowing traffic only from your virtual network. 

-__Lower latencies for Azure service traffic from your Virtual Network__

Today, any routes in your Vnet that force Internet traffic through on-premises and/or virtual appliances, known as forced-tunneling, also force Azure service traffic to take the same route as the Internet traffic. This results in increased round-trip latencies for the service traffic. Service endpoints lower latencies by always taking service traffic directly from your Vnet to the service, without traversing the public Internet or on-premises/virtual appliances. Learn more about [user-defined routes and forced-tunneling.](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview)

- __Simple to set up with less management overhead__

You no longer need reserved, public IP addresses in your VNets to secure Azure resources through IP firewall. There are no NAT or Gateway devices required to set up the service endpoints. Service endpoint can be configured through a simple click on a subnet. There is no additional overhead to maintaining the endpoints. 

## __Limitations__

- The feature is available only to VNets deployed using Resource Manager (ARM) deployment model.
- Endpoints do not extend to on-premises and connected, peered VNets.
- Service endpoint applies only to Azure service traffic within VNet’s region. In case of Azure Storage, to support RA-GRS and GRS traffic, this also extends to include paired region where the VNet is deployed to. Learn more about [Azure paired regions.](https://docs.microsoft.com/azure/best-practices-availability-paired-regions#what-are-paired-regions)


## __Securing Azure services to Virtual Networks__

- VNet service endpoint shares identity of your VNet with the Azure service. Once service endpoints are enabled in your VNet, you can secure Azure service resources to your VNet by adding a Virtual network rule to the resources. 
- Today, Azure service traffic from your VNet uses public IPs as source IPs. With service endpoints, service traffic switches to use VNet private addresses as the source IPs when accessing the Azure service from your VNet. This allows you to access the services without the need for reserved, public IP addresses used in IP firewalls. 
- By sharing identity of your virtual network with the service, endpoints allow Azure service resources to be secured to your VNet and subnet by name. 

[!IMPORTANT] Vnet private address space is not unique and cannot be directly used for the Azure service virtual network rules or IP firewall rules.

- Service endpoints do no extend to on-premises. If you want to allow traffic from on-premises, you should also allow NAT IP addresses from your on-premises. NAT IP addresses can be added through IP firewall configuration for Azure service resources. Read more on [configuring access from on-premises.](https://docs.microsoft.com/azure/storage/common/storage-network-security#Configuring-access-from-on-premises-networks)

![Securing Azure Services to Virtual Networks](media/virtual-network-service-endpoints-overview/VNet_Service_Endpoints_Overview.png)

### __Configuration__

- Service endpoints should be configured per subnet in a VNet.
- Only one service endpoint can be opened to a specific service from a subnet. You can configure multiple service endpoints for all supported Azure services (Say, Storage, Sql) on a subnet.
- For supported services, you can secure new or existing resources to VNets using service endpoints. 
- VNets should be in the same region as the Azure service resource. For Azure Storage, if using GRS and RA-GRS accounts, the primary account should be in the same region as the VNet.
- VNet where the endpoint is configured can be in the same or different subscription as the Azure service resource. For more information on permissions required for setting up endpoints and securing Azure services, see ["Provisioning”](#Provisioning) section below.

### __Considerations__

- On enabling a service endpoint, the source IP addresses of virtual machines in the subnet switch from using public IPv4 addresses to using their private IPv4 address, when communicating with the service from that subnet.
  - Any existing open TCP connections to the service may be closed during this switch. Ensure that no critical tasks are running when enabling or disabling a service endpoint to a service for a subnet. Ensure that your applications can automatically connect to Azure services after this switch.
  - IP address switch only impacts service traffic from your VNet. There is no impact to any other traffic addressed to/from public Ipv4 addresses assigned to your VMs. 
  - For Azure services, if you have existing firewall rules using Azure public IPs, these rules stop working with the switch to VNet private addresses.
- With service endpoints, DNS entries for Azure services remain as is today and continue to resolve to IP addresses assigned to the Azure service.
- Network security groups (NSGs) with service endpoints:

   By default, NSGs allow outbound Internet traffic and so, also allow traffic from your Vnet to Azure services. This will continue to work as is, with service endpoints. 

   If you want to deny all outbound Internet traffic and allow only traffic to specific Azure services,  you can do so using __“Azure service tags”__ in your NSGs. You can specify supported Azure services as destination in your NSG rules and the maintenance of IP addresses underlying each tag is provided by Azure. For more information, see [Azure Service tags for NSGs](https://aka.ms/servicetags)

### __Scenarios__

- Peered, connected, or multiple VNets:

Service endpoints do not extend to peered, connected VNets. To secure Azure services to multiple subnets within a VNet or across multiple VNets, you can turn on service endpoints on each of these subnets independently and secure Azure service resources to all of these subnets. 

- Filtering outbound traffic from VNet to Azure services:

If you want to inspect or filter the traffic destined to an Azure service from the Virtual network, you can deploy a Network Virtual Appliance (NVA) within that VNet. You can then apply service endpoints to the subnet where the NVA is deployed and secure Azure service resource only to this subnet. This scenario might be helpful if you wish to restrict Azure service access from your VNet only to specific Azure resources, using NVA filtering. For more information, read the [egress with NVAs](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/dmz/nva-ha#egress-with-layer-7-nvas) article.

- Securing Azure resources to services deployed directly into VNets:

Various Azure services can be directly deployed into specific subnets in your VNets. You can secure Azure service resources to [managed service](virtual-network-for-azure-services.md) subnets, by setting up a service endpoint on the managed service subnet.


### __Logging and troubleshooting__

Once service endpoints are configured to a specific service:

- Effective routes on any NIC in subnet show a more specific “default” route to address prefix range of that service. The route has a nextHopType as "VirtualNetworkServiceEndpoint". This route indicates that a more direct connection to the service is in effect, compared to any forced-tunneling routes.

- Azure service diagnostics show the “SourceIP” of any request from the VNet as VNet’s private IP address. This indicates that the service access from VNet is coming through the endpoint. 

### __Provisioning__

Service endpoints can be configured on Virtual networks independently, by network administrators. A user with read-write access to Virtual network automatically inherits these rights. 

To secure Azure service resources to a VNet, the user must have permission to "Microsoft.Network/JoinServicetoaSubnet" for the subnets being added. This permission is included in the built-in service administrator roles, by default. You can modify this through custom roles.

Learn more about [built-in roles](https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles) and assigning specific permissions to [custom roles](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-custom-roles).

VNets and Azure service resources can be in the same or different subscriptions. If the VNet and Azure service resources are in different subscriptions, the resources should be under the same Active Directory (AD) tenant, during this preview. 

## __Pricing and Limits__

There is no additional charge for using service endpoints. Current pricing model for Azure service usage from Virtual Networks applies as is today. 

No limit on the total number of service endpoints in a VNet.

No limit to the number of Azure service resources secured to the same VNet. 

For an Azure service resource (such as, Storage account), services may enforce limits on number of subnets used for securing the resource. Refer to the documentation for various services in ["Next steps"](#next%20steps) for details.

## __Next Steps__

- Learn [how to configure VNet service endpoints](virtual-network-service-endpoints-configure.md)
- Learn more about [Securing Azure Storage accounts to Virtual Networks](https://docs.microsoft.com/azure/storage/common/storage-network-security)
- Learn more about [Securing Azure SQL to Virtual networks](https://docs.microsoft.com/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview)
- [Azure service integration overview for virtual networks](virtual-network-for-azure-services.md)
