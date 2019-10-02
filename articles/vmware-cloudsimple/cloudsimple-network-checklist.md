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

Azure VMware Solution by CloudSimple offers a VMware Private Cloud environment that is accessible for users and applications from On-premises environments, from enterprise managed devices as well as from Azure resources. The connectivity is delivered using networking services such as VPNs and ExpressRoute connections.  Some of the Network Services require you to specify network address ranges for enabling the services.  Tables in this article describe the set of address ranges and corresponding services that use the specified addresses.  Some of the addressed are mandatory and some depend on the services you want to deploy.  These address spaces should not overlap with any of your On-premises subnets, Azure Virtual Network subnets, or planned CloudSimple workload subnets.

## Network address ranges required for creating a Private Cloud

During the creation of CloudSimple service and a Private Cloud, following network CIDR range is required.

| Name/Used for     | Description                                                                                                                            | Address Range            |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| Gateway CIDR      | Required for edge services (VPN gateways).  This CIDR is required during CloudSimple Service creation and must be from RFC 1918 space. | /28                      |
| vSphere/vSAN CIDR | Required for VMware management networks. This CIDR must be specified during Private Cloud creation.                                    | /24 or /23 or /22 or /21 |

## Network address range required for Azure network connection to on-premises network

Connecting from [on-premises network to the Private Cloud network using ExpressRoute](on-premises-connection.md) establishes a Global Reach connection.  The connection will exchange routes via BGP between your on-premises network, Private Cloud network, and your Azure networks.

| Name/Used for             | Description                                                                                                                                                                             | Address Range |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| ExpressRoute Peering CIDR | Required when using ExpressRoute Global Reach is used for On-premises connectivity. This CIDR needs to be provided when a Global Reach connection request is made via a support ticket. | /29           |

## Network address range required for using site-to-site VPN connection to on-premises network

Connecting from [on-premises network to the Private Cloud network using site-to-site VPN](vpn-gateway.md) requires the following IP addresses, on-premises network, and identifiers. 

| Address/Address Range | Description                                                                                                                                                                                                                                                           |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Peer IP               | On-premises VPN gateway public IP address. Required to establish site-to-site VPN connection between on-premises datacenter and the CloudSimple Service region. This IP is required during site-to-site VPN gateway creation.                                         |
| Peer Identifier       | Peer identifier of the on-premises VPN gateway. This is usually the same as **peer IP**.  If a unique identifier is specified on your on-premises VPN gateway, the identifier needs to be specified.  Peer ID is required during Site-to-Site VPN Gateway creation.   |
| On-premises Networks   | On-premises prefixes that need access CloudSimple networks in the region.  Include all prefixes from on-premises network which will access the CloudSimple network including the client network from where users will access.                                         |

## Network address range required for using point-to-site VPN connections

Point-to-Site VPN connection allows access to the CloudSimple network from a client machine.  [Setting up of point-to-site VPN](vpn-gateway.md) requires the following network address range to be specified.

| Address/Address Range | Description                                                                                                                                                                                                                                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Client subnet         | DHCP addresses will be given from the client subnet when you connect using point-to-site VPN. This subnet is required while creating a point-to-site VPN gateway on CloudSimple portal.  The network will be divided into two subnets and one will be used for UDP connection and other for TCP connections. |

## Next steps

* [Quickstart - Create CloudSimple service](quickstart-create-cloudsimple-service.md)
* [quickstart-create-private-cloud](quickstart-create-private-cloud.md)
* Learn more about [Azure network connections](cloudsimple-azure-network-connection.md)
* Learn more about [VPN gateways](cloudsimple-vpn-gateways.md)
