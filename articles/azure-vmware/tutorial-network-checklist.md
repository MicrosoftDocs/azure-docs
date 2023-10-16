---
title: Tutorial - Network planning checklist
description: In this tutorial, learn about the network requirements for network connectivity and network ports on Azure VMware Solution.
ms.topic: tutorial
ms.service: azure-vmware
ms.date: 05/01/2023
---

# Networking planning checklist for Azure VMware Solution

Azure VMware Solution provides a VMware private cloud environment accessible to users and applications from on-premises and Azure-based environments or resources. Connectivity is delivered through networking services such as Azure ExpressRoute and VPN connections. Specific network address ranges and firewall ports are required to enable these services. This article helps you configure your networking to work with Azure VMware Solution.

In this tutorial, you'll learn about:

> [!div class="checklist"]
> * Virtual network and ExpressRoute circuit considerations
> * Routing and subnet requirements
> * Required network ports to communicate with the services
> * DHCP and DNS considerations in Azure VMware Solution

## Prerequisites

Ensure all gateways, including the ExpressRoute provider's service, support 4-byte Autonomous System Number (ASN). Azure VMware Solution uses 4-byte public ASNs for advertising routes.

## Virtual network and ExpressRoute circuit considerations

When you create a virtual network connection in your subscription, the ExpressRoute circuit is established through peering, using an authorization key and a peering ID you request in the Azure portal. The peering is a private, one-to-one connection between your private cloud and the virtual network.

> [!NOTE] 
> The ExpressRoute circuit is not part of a private cloud deployment. The on-premises ExpressRoute circuit is beyond the scope of this document. If you require on-premises connectivity to your private cloud, use one of your existing ExpressRoute circuits or purchase one in the Azure portal.

When deploying a private cloud, you receive IP addresses for vCenter Server and NSX-T Manager. To access these management interfaces, create additional resources in your subscription's virtual network. Find the procedures for creating those resources and establishing [ExpressRoute private peering](tutorial-expressroute-global-reach-private-cloud.md) in the tutorials.

The private cloud logical networking includes a pre-provisioned NSX-T Data Center configuration. A Tier-0 gateway and Tier-1 gateway are pre-provisioned for you. You can create a segment and attach it to the existing Tier-1 gateway or attach it to a new Tier-1 gateway that you define. NSX-T Data Center logical networking components provide East-West connectivity between workloads and North-South connectivity to the internet and Azure services.

>[!IMPORTANT]
>[!INCLUDE [disk-pool-planning-note](includes/disk-pool-planning-note.md)]

## Routing and subnet considerations

The Azure VMware Solution private cloud connects to your Azure virtual network using an Azure ExpressRoute connection. This high bandwidth, low latency connection allows you to access services running in your Azure subscription from your private cloud environment. The routing uses Border Gateway Protocol (BGP), is automatically provisioned, and enabled by default for each private cloud deployment.

Azure VMware Solution private clouds require a minimum `/22` CIDR network address block for subnets. This network complements your on-premises networks, so the address block shouldn't overlap with address blocks used in other virtual networks in your subscription and on-premises networks. Management, provisioning, and vMotion networks are provisioned automatically within this address block.

> [!NOTE]
> Permitted ranges for your address block are the RFC 1918 private address spaces (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), except for 172.17.0.0/16.

> [!IMPORTANT]
> Avoid using the following IP schemas reserved for NSX-T Data Center usage:
> * 169.254.0.0/24 - used for internal transit network
> * 169.254.2.0/23 - used for inter-VRF transit network
> * 100.64.0.0/16 - used to connect T1 and T0 gateways internally

Example `/22` CIDR network address block: `10.10.0.0/22`

The subnets:

| Network usage                 | Description                                          | Subnet | Example          |
| ----------------------------- | ---------------------------------------------------- | ------ | ---------------- |
| Private cloud management      | Management Network (such as vCenter, NSX-T)          | `/26`  | `10.10.0.0/26`   |
| HCX Mgmt Migrations           | Local connectivity for HCX appliances (downlinks)    | `/26`  | `10.10.0.64/26`  |
| Global Reach Reserved         | Outbound interface for ExpressRoute                  | `/26`  | `10.10.0.128/26` |
| NSX-T Data Center DNS Service | Built-in NSX-T DNS Service                           | `/32`  | `10.10.0.192/32` |
| Reserved                      | Reserved                                             | `/32`  | `10.10.0.193/32` |
| Reserved                      | Reserved                                             | `/32`  | `10.10.0.194/32` |
| Reserved                      | Reserved                                             | `/32`  | `10.10.0.195/32` |
| Reserved                      | Reserved                                             | `/30`  | `10.10.0.196/30` |
| Reserved                      | Reserved                                             | `/29`  | `10.10.0.200/29` |
| Reserved                      | Reserved                                             | `/28`  | `10.10.0.208/28` |
| ExpressRoute peering          | ExpressRoute Peering                                 | `/27`  | `10.10.0.224/27` |
| ESXi Management               | ESXi management VMkernel interfaces                  | `/25`  | `10.10.1.0/25`   |
| vMotion Network               | vMotion VMkernel interfaces                          | `/25`  | `10.10.1.128/25` |
| Replication Network           | vSphere Replication interfaces                       | `/25`  | `10.10.2.0/25`   |
| vSAN                          | vSAN VMkernel interfaces and node communication      | `/25`  | `10.10.2.128/25` |
| HCX uplink                    | Uplinks for HCX IX and NE appliances to remote peers | `/26`  | `10.10.3.0/26`   |
| Reserved                      | Reserved                                            | `/26`  | `10.10.3.64/26`  |
| Reserved                      | Reserved                                            | `/26`  | `10.10.3.128/26` |
| Reserved                      | Reserved                                            | `/26`  | `10.10.3.192/26` |

## Required network ports

| Source | Destination | Protocol | Port | Description  | 
| ------ | ----------- | :------: | :---:| ------------ | 
| Private Cloud DNS server | On-premises DNS Server | UDP | 53 | DNS Client - Forward requests from Private Cloud vCenter Server for any on-premises DNS queries (see DNS section below). |  
| On-premises DNS Server   | Private Cloud DNS server | UDP | 53 | DNS Client - Forward requests from on-premises services to Private Cloud DNS servers (see DNS section below.) |  
| On-premises network  | Private Cloud vCenter Server  | TCP (HTTP)  | 80 | vCenter Server requires port 80 for direct HTTP connections. Port 80 redirects requests to HTTPS port 443. This redirection helps if you use `http://server` instead of `https://server`.  |  
| Private Cloud management network | On-premises Active Directory  | TCP  | 389/636 | Enable Azure VMware Solutions vCenter Server to communicate with on-premises Active Directory/LDAP server(s). Optional for configuring on-premises AD as an identity source on the Private Cloud vCenter. Port 636 is recommended for security purposes. |  
| Private Cloud management network | On-premises Active Directory Global Catalog  | TCP  | 3268/3269 | Enable Azure VMware Solutions vCenter Server to communicate with on-premises Active Directory/LDAP global catalog server(s). Optional for configuring on-premises AD as an identity source on the Private Cloud vCenter Server. Use port 3269 for security. |  
| On-premises network  | Private Cloud vCenter Server  | TCP (HTTPS)  | 443 | Access vCenter Server from an on-premises network. Default port for vCenter Server to listen for vSphere Client connections. To enable the vCenter Server system to receive data from the vSphere Client, open port 443 in the firewall. The vCenter Server system also uses port 443 to monitor data transfer from SDK clients. |  
| On-premises network  | HCX Cloud Manager  | TCP (HTTPS) | 9443 | HCX Cloud Manager virtual appliance management interface for HCX system configuration. |
| On-premises Admin Network  | HCX Cloud Manager | SSH | 22 | Administrator SSH access to HCX Cloud Manager virtual appliance. |
| HCX Manager | Interconnect (HCX-IX) | TCP (HTTPS) | 8123 | HCX Bulk Migration Control. |
| HCX Manager | Interconnect (HCX-IX), Network Extension (HCX-NE) | TCP (HTTPS) | 9443 | Send management instructions to the local HCX Interconnect using the REST API. |
| Interconnect (HCX-IX)| L2C | TCP (HTTPS) | 443 | Send management instructions from Interconnect to L2C when L2C uses the same path as the Interconnect. |
| HCX Manager, Interconnect (HCX-IX) | ESXi Hosts | TCP | 80,443,902 | Management and OVF deployment. |
| Interconnect (HCX-IX), Network Extension (HCX-NE) at Source| Interconnect (HCX-IX), Network Extension (HCX-NE) at Destination| UDP | 4500 | Required for IPSEC<br>   Internet key exchange (IKEv2) to encapsulate workloads for the bidirectional tunnel. Supports Network Address Translation-Traversal (NAT-T). |
| On-premises Interconnect (HCX-IX) | Cloud Interconnect (HCX-IX) | UDP | 500 | Required for IPSEC<br> Internet Key Exchange (ISAKMP) for the bidirectional tunnel. |
| On-premises vCenter Server network | Private Cloud management network | TCP | 8000 |  vMotion of VMs from on-premises vCenter Server to Private Cloud vCenter Server   |
| HCX Connector | connect.hcx.vmware.com<br> hybridity.depot.vmware.com | TCP | 443 | `connect` is needed to validate license key.<br> `hybridity` is needed for updates. |

This table presents common firewall rules for typical scenarios. However, you might need to consider additional items when configuring firewall rules. Note that when the source and destination say "on-premises," this information is only relevant if your datacenter has a firewall that inspects flows. If your on-premises components don't have a firewall for inspection, you can ignore those rules.

For more information, see the [full list of VMware HCX port requirements](https://ports.esp.vmware.com/home/VMware-HCX).

## DHCP and DNS resolution considerations

[!INCLUDE [dhcp-dns-in-azure-vmware-solution-description](includes/dhcp-dns-in-azure-vmware-solution-description.md)]

## Next steps

In this tutorial, you learned about the considerations and requirements for deploying an Azure VMware Solution private cloud. Once you have the proper networking in place, continue to the next tutorial to create your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Create an Azure VMware Solution private cloud](tutorial-create-private-cloud.md)
