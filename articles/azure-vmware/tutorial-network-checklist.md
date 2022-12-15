---
title: Tutorial - Network planning checklist
description: Learn about the network requirements for network connectivity and network ports on Azure VMware Solution.
ms.topic: tutorial
ms.date: 07/01/2021
---

# Networking planning checklist for Azure VMware Solution 

Azure VMware Solution offers a VMware private cloud environment accessible for users and applications from on-premises and Azure-based environments or resources. The connectivity is delivered through networking services such as Azure ExpressRoute and VPN connections. It requires specific network address ranges and firewall ports to enable the services. This article provides you with the information you need to properly configure your networking to work with Azure VMware Solution.

In this tutorial, you'll learn about:

> [!div class="checklist"]
> * Virtual network and ExpressRoute circuit considerations
> * Routing and subnet requirements
> * Required network ports to communicate with the services
> * DHCP and DNS considerations in Azure VMware Solution

## Prerequisite
Ensure that all gateways, including the ExpressRoute provider's service, supports 4-byte Autonomous System Number (ASN). Azure VMware Solution uses 4-byte public ASNs for advertising routes.

## Virtual network and ExpressRoute circuit considerations
When you create a virtual network connection in your subscription, the ExpressRoute circuit is established through peering, using an authorization key and a peering ID you request in the Azure portal. The peering is a private, one-to-one connection between your private cloud and the virtual network.

> [!NOTE] 
> The ExpressRoute circuit is not part of a private cloud deployment. The on-premises ExpressRoute circuit is beyond the scope of this document. If you require on-premises connectivity to your private cloud, you can use one of your existing ExpressRoute circuits or purchase one in the Azure portal.

When deploying a private cloud, you receive IP addresses for vCenter and NSX-T Manager. To access those management interfaces, you'll need to create more resources in your subscription's virtual network. You can find the procedures for creating those resources and establishing [ExpressRoute private peering](tutorial-expressroute-global-reach-private-cloud.md) in the tutorials.

The private cloud logical networking comes with pre-provisioned NSX-T. A Tier-0 gateway and Tier-1 gateway are pre-provisioned for you. You can create a segment and attach it to the existing Tier-1 gateway or attach it to a new Tier-1 gateway that you define. NSX-T logical networking components provide East-West connectivity between workloads and North-South connectivity to the internet and Azure services.

>[!IMPORTANT]
>[!INCLUDE [disk-pool-planning-note](includes/disk-pool-planning-note.md)] 

## Routing and subnet considerations
The Azure VMware Solution private cloud is connected to your Azure virtual network using an Azure ExpressRoute connection. This high bandwidth, low latency connection allows you to access services running in your Azure subscription from your private cloud environment. The routing is Border Gateway Protocol (BGP) based, automatically provisioned, and enabled by default for each private cloud deployment. 

Azure VMware Solution private clouds require a minimum of a `/22` CIDR network address block for subnets, shown below. This network complements your on-premises networks. Therefore, the address block shouldn't overlap with address blocks used in other virtual networks in your subscription and on-premises networks. Within this address block, management, provisioning, and vMotion networks get provisioned automatically.

>[!NOTE]
>Permitted ranges for your address block are the RFC 1918 private address spaces (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), except for 172.17.0.0/16.

Example `/22` CIDR network address block:  `10.10.0.0/22`

The subnets:

| Network usage             | Summary | Subnet | Example          |
| ------------------------- | ------------------------- | ------ | ---------------- |
| Private cloud management  | Network for managment tools (i.e. vCenter, NSX-t ) | `/26`  | `10.10.0.0/26`   |
| HCX Mgmt Migrations       | VM's like HCX Interconnect and Network extension | `/26`  | `10.10.0.64/26`  |
| Global Reach Reserved     | Outbound interface for ExpressRoute | `/26`  | `10.10.0.128/26` |
| NSX-T DNS Service         | NSX-T DNS Service | `/32`  | `10.10.0.192/32` |
| Reserved                  | Reserved | `/32`  | `10.10.0.193/32` |
| Reserved                  | Reserved | `/32`  | `10.10.0.194/32` |
| Reserved                  | Reserved | `/32`  | `10.10.0.195/32` |
| Reserved                  | Reserved | `/30`  | `10.10.0.196/30` |
| Reserved                  | Reserved | `/29`  | `10.10.0.200/29` |
| Reserved                  | Reserved | `/28`  | `10.10.0.208/28` |
| ExpressRoute peering      | ExpressRoute Peering | `/27`  | `10.10.0.224/27` |
| ESXi Management           | Network for ESXi Managment VMkernal interfaces | `/25`  | `10.10.1.0/25`   |
| vMotion Network           | Network for vMotion VMkernal interfaces | `/25`  | `10.10.1.128/25` |
| Replication Network       | Network for| `/25`  | `10.10.2.0/25`   |
| vSAN                      | `/25`  | `10.10.2.128/25` |
| HCX Uplink                | `/26`  | `10.10.3.0/26`   |
| Reserved                  | `/26`  | `10.10.3.64/26`  |
| Reserved                  | `/26`  | `10.10.3.128/26` |
| Reserved                  | `/26`  | `10.10.3.192/26` |



## Required network ports

| Source | Destination | Protocol | Port | Description  | 
| ------ | ----------- | :------: | :---:| ------------ | 
| Private Cloud DNS server (cloud) | On-Premises DNS Server (on-prem)| UDP | 53 | DNS Client - Forward requests from Azure VMware Solution vCenter for any on-premises DNS queries (check DNS section below) |  
| On-premises DNS Server (on-prem)   | Private Cloud DNS server (cloud) | UDP | 53 | DNS Client - Forward requests from on-premises services to Azure VMware Solution DNS servers (check DNS section below) |  
| On-premises network (on-prem)  | Private Cloud vCenter server (cloud) | TCP(HTTP)  | 80 | vCenter Server requires port 80 for direct HTTP connections. Port 80 redirects requests to HTTPS port 443. This redirection helps if you use `http://server` instead of `https://server`.  |  
| Private Cloud management network (cloud) | Directory (on-prem or cloud) | TCP  | 389/636 | These ports are open to allow communications for Azure VMware Solutions vCenter to communicate to any on-premises Active Directory/LDAP server(s).  These port(s) are optional - for configuring on-premises AD as an identity source on the Private Cloud vCenter. Port 636 is recommended for security purposes. |  
| Private Cloud management network (cloud) | Active Directory Global Catalog (on-prem or cloud)  | TCP  | 3268/3269 | These ports are open to allow communications for Azure VMware Solutions vCenter to communicate to any on-premises or cloud Active Directory/LDAP global catalog server(s).  These port(s) are optional - for configuring on-premises AD as an identity source on the Private Cloud vCenter. Port 3269 is recommended for security purposes. |  
| admin network (on-prem)  | Private Cloud vCenter server (cloud) | TCP(HTTPS)  | 443 | This port allows you to access vCenter from an on-premises network. The default port that the vCenter Server system uses to listen for connections from the vSphere Client. To enable the vCenter Server system to receive data from the vSphere Client, open port 443 in the firewall. The vCenter Server system also uses port 443 to monitor data transfer from SDK clients. |  
| Admin Network (on-prem)  | HCX Connector (on-prem)  | TCP(HTTPS) | 9443 | Hybrid Cloud Manager Virtual Appliance Management Interface for Hybrid Cloud Manager system configuration. |
| Admin Network (on-prem)  | HCX Connector (on-prem) | SSH | 22 | Administrator SSH access to Hybrid Cloud Manager. Allows capability to troubleshoot and test connectivity to cloud with ping and other tools |
| HCX Connector (on-prem) | Interconnect (HCX-IX) (on-prem) | TCP(HTTPS) | 8123 | Send host-based replication service instructions to the HCX Interconnect. |
| HCX Connector (on-prem) | Interconnect (HCX-IX on-prem) | HTTP  TCP(HTTPS) | 9443 | Send management instructions to the local HCX Interconnect using the REST API. |
| Interconnect (HCX-IX) (on-prem) | Network Extension (HCX-NE) (on-prem) | TCP(HTTPS) | 443 | Send management instructions from Interconnect to Network Extension when Network Extension uses the same path as the Hybrid Interconnect. |
| HCX Connector (on-prem) | ESXi Hosts (on-prem) | TCP | 80,902,443 | Authentication, Management and OVF deployment. |
| Interconnect and Network Extension (on-prem)| Interconnect and Network Extenion (cloud) | UDP | 4500 | Required for IPSEC<br>   Internet key exchange (IKEv2) to encapsulate workloads for the bidirectional tunnel. Network Address Translation-Traversal (NAT-T) is also supported. |
| Interconnect (HCX-IX) (on-prem) | Interconnect (HCX-IX) (cloud)  | UDP | 500 | Required for IPSEC<br> Internet key exchange (ISAKMP) for the bidirectional tunnel. |
| On-premises vCenter network | Private Cloud management network | TCP | 8000 |  vMotion of VMs from on-premises vCenter to Private Cloud vCenter using "Cross vCenter vMotion."  This is outside of HCX vMotions and is not an hcx requirement. |    
| HCX Connector (on-prem) | connect.hcx.vmware.com and hybridity-depot.vmware.com | TCP | 443 |  connect.hcx.vmware.com is needed to validate Hybrid Cloud Manager license key.  Hybridity-depot is used for updates.   |    

There can be more items to consider when it comes to firewall rules, this is intended to give common rules for common scanerios. Note that when source and destination says "on-prem", this is only important if you have a firewall that inspects flows within your datacenter. If you do not have a firewall that inspects between on-prem components, you can ignore those rules as they would not be needed. For a detailed list of HCX ports for different features, please refer to the following links:

https://ports.esp.vmware.com/home/VMware-HCX


## DHCP and DNS resolution considerations

[!INCLUDE [dhcp-dns-in-azure-vmware-solution-description](includes/dhcp-dns-in-azure-vmware-solution-description.md)]


## Next steps

In this tutorial, you learned about the considerations and requirements for deploying an Azure VMware Solution private cloud. Once you have the proper networking in place, continue to the next tutorial to create your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Create an Azure VMware Solution private cloud](tutorial-create-private-cloud.md)
