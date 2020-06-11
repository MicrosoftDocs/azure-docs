---
title: Azure VMware Solution by CloudSimple - Network checklist 
description: Checklist for allocating network CIDR on Azure VMware Solution by CloudSimple  
author: sharaths-cs 
ms.author: dikamath 
ms.date: 09/25/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Networking prerequisites for Azure VMware Solution by CloudSimple

Azure VMware Solution by CloudSimple offers a VMware private cloud environment that's accessible for users and applications from on-premises environments, enterprise-managed devices, and Azure resources. The connectivity is delivered through networking services such as VPNs and Azure ExpressRoute connections. Some of these networking services require you to specify network address ranges for enabling the services. 

Tables in this article describe the set of address ranges and corresponding services that use the specified addresses. Some of the addresses are mandatory and some depend on the services you want to deploy. These address spaces should not overlap with any of your on-premises subnets, Azure Virtual Network subnets, or planned CloudSimple workload subnets.

## Network address ranges required for creating a private cloud

During the creation of a CloudSimple service and a private cloud, you must comply with the specified network classless inter-domain routing (CIDR) ranges, as follows.

| Name/used for     | Description                                                                                                                            | Address range            |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| Gateway CIDR      | Required for edge services (VPN gateways).  This CIDR is required during CloudSimple Service creation and must be from the RFC 1918 space. | /28                      |
| vSphere/vSAN CIDR | Required for VMware management networks. This CIDR must be specified during private cloud creation.                                    | /24 or /23 or /22 or /21 |

## Network address range required for Azure network connection to an on-premises network

Connecting from an [on-premises network to the private cloud network through ExpressRoute](on-premises-connection.md) establishes a Global Reach connection.  The connection uses Border Gateway Protocol (BGP) to exchange routes between your on-premises network, your private cloud network, and your Azure networks.

| Name/used for             | Description                                                                                                                                                                             | Address range |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| ExpressRoute Peering CIDR | Required when you use ExpressRoute Global Reach for on-premises connectivity. This CIDR must be provided when a Global Reach connection request is made through a support ticket. | /29           |

## Network address range required for using a site-to-site VPN connection to an on-premises network

Connecting from an [on-premises network to the private cloud network by using site-to-site VPN](vpn-gateway.md) requires the following IP addresses, on-premises network, and identifiers. 

| Address/address range | Description                                                                                                                                                                                                                                                           |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Peer IP               | On-premises VPN gateway public IP address. Required to establish a site-to-site VPN connection between an on-premises datacenter and the CloudSimple Service region. This IP address is required during site-to-site VPN gateway creation.                                         |
| Peer identifier       | Peer identifier of the on-premises VPN gateway. This is usually the same as **peer IP**.  If a unique identifier is specified on your on-premises VPN gateway, the identifier must be specified.  Peer ID is required during site-to-site VPN gateway creation.   |
| On-premises networks   | On-premises prefixes that need access CloudSimple networks in the region.  Include all prefixes from an on-premises network that will access the CloudSimple network, including the client network from where users will access the network.                                         |

## Network address range required for using point-to-site VPN connections

A point-to-site VPN connection enables access to the CloudSimple network from a client machine.  [To set up point-to-site VPN](vpn-gateway.md), you must specify the following network address range.

| Address/address range | Description                                                                                                                                                                                                                                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Client subnet         | DHCP addresses are provided by the client subnet when you connect by using a point-to-site VPN. This subnet is required while you're creating a point-to-site VPN gateway on a CloudSimple portal.  The network is divided into two subnets; one for the UDP connection and the other for TCP connections. |

## Next steps

* [On-premises firewall setup for accessing your private cloud](on-premises-firewall-configuration.md)
* [Quickstart - Create a CloudSimple service](quickstart-create-cloudsimple-service.md)
* [Quickstart- Configure a private cloud](quickstart-create-private-cloud.md)
* Learn more about [Azure network connections](cloudsimple-azure-network-connection.md)
* Learn more about [VPN gateways](cloudsimple-vpn-gateways.md)
