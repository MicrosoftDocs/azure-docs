---
title: Tutorial - Network planning checklist
description: Learn about the network requirements for network connectivity and network ports on Azure VMware Solution.
ms.topic: tutorial
ms.date: 04/23/2021
---

# Networking planning checklist for Azure VMware Solution 

Azure VMware Solution offers a VMware private cloud environment accessible for users and applications from on-premises and Azure-based environments or resources. The connectivity is delivered through networking services such as Azure ExpressRoute and VPN connections. It requires specific network address ranges and firewall ports to enable the services. This article provides you with the information you need to configure your networking to work with Azure VMware Solution properly.

In this tutorial, you'll learn about:

> [!div class="checklist"]
> * Virtual network and ExpressRoute circuit considerations
> * Routing and subnet requirements
> * Required network ports to communicate with the services
> * DHCP and DNS considerations in Azure VMware Solution

## Prerequisite
Ensure that all gateways, including the ExpressRoute provider's service, support 4-byte Autonomous System Number (ASN). Azure VMware Solution uses 4-byte public ASNs for advertising routes.

## Virtual network and ExpressRoute circuit considerations
When you create a virtual network connection in your subscription, the ExpressRoute circuit gets established through peering, uses an authorization key, and a peering ID you request in the Azure portal. The peering is a private, one-to-one connection between your private cloud and the virtual network.

> [!NOTE] 
> The ExpressRoute circuit is not part of a private cloud deployment. The on-premises ExpressRoute circuit is beyond the scope of this document. If you require on-premises connectivity to your private cloud, you can use one of your existing ExpressRoute circuits or purchase one in the Azure portal.

When deploying a private cloud, you receive IP addresses for vCenter and NSX-T Manager. To access those management interfaces, you'll need to create more resources in your subscription's virtual network. You can find the procedures for creating those resources and establishing [ExpressRoute private peering](tutorial-expressroute-global-reach-private-cloud.md) in the tutorials.

The private cloud logical networking comes with pre-provisioned NSX-T. A Tier-0 gateway and Tier-1 gateway is pre-provisioned for you. You can create a segment and attach it to the existing Tier-1 gateway or attach it to a new Tier-1 gateway that you define. NSX-T logical networking components provide East-West connectivity between workloads and provide North-South connectivity to the internet and Azure services.

## Routing and subnet considerations
The Azure VMware Solution private cloud is connected to your Azure virtual network using an Azure ExpressRoute connection. This high bandwidth, low latency connection allows you to access services running in your Azure subscription from your private cloud environment. The routing is Border Gateway Protocol (BGP) based, automatically provisioned, and enabled by default for each private cloud deployment. 

Azure VMware Solution private clouds require a minimum of a `/22` CIDR network address block for subnets, shown below. This network complements your on-premises networks. The address block shouldn't overlap with address blocks used in other virtual networks in your subscription and on-premises networks. Within this address block, management, provisioning, and vMotion networks get provisioned automatically.

>[!NOTE]
>Permitted ranges for your address block are the RFC 1918 private address spaces (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), except for 172.17.0.0/16.

Example `/22` CIDR network address block:  `10.10.0.0/22`

The subnets:

| Network usage             | Subnet | Example          |
| ------------------------- | ------ | ---------------- |
| Private cloud management  | `/26`  | `10.10.0.0/26`   |
| HCX Mgmt Migrations       | `/26`  | `10.10.0.64/26`  |
| Global Reach Reserved     | `/26`  | `10.10.0.128/26` |
| ExpressRoute Reserved     | `/27`  | `10.10.0.192/27` |
| ExpressRoute peering      | `/27`  | `10.10.0.224/27` |
| ESXi Management           | `/25`  | `10.10.1.0/25`   |
| vMotion Network           | `/25`  | `10.10.1.128/25` |
| Replication Network       | `/25`  | `10.10.2.0/25`   |
| vSAN                      | `/25`  | `10.10.2.128/25` |
| HCX Uplink                | `/26`  | `10.10.3.0/26`   |
| Reserved                  | `/26`  | `10.10.3.64/26`  |
| Reserved                  | `/26`  | `10.10.3.128/26` |
| Reserved                  | `/26`  | `10.10.3.192/26` |



## Required network ports

| Source | Destination | Protocol | Port | Description  | 
| ------ | ----------- | :------: | :---:| ------------ | 
| Private Cloud DNS server | On-Premises DNS Server | UDP | 53 | DNS Client - Forward requests from PC vCenter for any on-premises DNS queries (check DNS section below) |  
| On-premises DNS Server   | Private Cloud DNS server | UDP | 53 | DNS Client - Forward requests from on-premises services to Private Cloud DNS servers (check DNS section below) |  
| On-premises network  | Private Cloud vCenter server  | TCP(HTTP)  | 80 | vCenter Server requires port 80 for direct HTTP connections. Port 80 redirects requests to HTTPS port 443. This redirection helps if you use `http://server` instead of `https://server`.  <br><br>WS-Management (also requires port 443 to be open) <br><br>If you use a custom Microsoft SQL database and not the bundled SQL Server 2008 database on the vCenter Server, port 80 is used by the SQL Reporting Services. When you install vCenter Server, the installer prompts you to change the HTTP port for the vCenter Server. Change the vCenter Server HTTP port to a custom value to ensure a successful installation. Microsoft Internet Information Services (IIS) also uses port 80. See Conflict Between vCenter Server and IIS for Port 80. |  
| Private Cloud management network | On-premises Active Directory  | TCP  | 389 | This port must be open on the local and all remote instances of vCenter Server. This port is the LDAP port number for the Directory Services for the vCenter Server group. The vCenter Server system needs to bind to port 389, even if you aren't joining this vCenter Server instance to a Linked Mode group. If another service is running on this port, it might be preferable to remove it or change its port to a different port. You can run the LDAP service on any port from 1025 through 65535.  If this instance is serving as the Microsoft Windows Active Directory, change the port number from 389 to an available port from 1025 through 65535. This port is optional - for configuring on-premises AD as an identity source on the Private Cloud vCenter. |  
| On-premises network  | Private Cloud vCenter server  | TCP(HTTPS)  | 443 | This port allows you to access vCenter from an on-premises network. The default port that the vCenter Server system uses to listen for connections from the vSphere Client. To enable the vCenter Server system to receive data from the vSphere Client, open port 443 in the firewall. The vCenter Server system also uses port 443 to monitor data transfer from SDK clients. This port is also used for the following services: WS-Management (also requires port 80 to be open). vSphere Client access to vSphere Update Manager. Third-party network management client connections to vCenter Server. Third-party network management clients access to hosts. |  
| Web Browser  | Hybrid Cloud Manager  | TCP(HTTPS) | 9443 | Hybrid Cloud Manager Virtual Appliance Management Interface for Hybrid Cloud Manager system configuration. |
| Admin Network  | Hybrid Cloud Manager | SSH | 22 | Administrator SSH access to Hybrid Cloud Manager. |
| HCM | Cloud  Gateway | TCP(HTTPS) | 8123 | Send host-based replication service instructions to the Hybrid Cloud Gateway. |
| HCM | Cloud  Gateway | HTTP  TCP(HTTPS) | 9443 | Send management instructions to the local Hybrid Cloud Gateway using the REST API. |
| Cloud Gateway | L2C | TCP(HTTPS) | 443 | Send management instructions from Cloud Gateway to L2C when L2C uses the same path as the Hybrid Cloud Gateway. |
| Cloud Gateway | ESXi Hosts | TCP | 80,902 | Management and OVF deployment. |
| Cloud Gateway (local)| Cloud Gateway (remote) | UDP | 4500 | Required for IPSEC<br>   Internet key exchange (IKEv2) to encapsulate workloads for the bidirectional tunnel. Network Address Translation-Traversal (NAT-T) is also supported. |
| Cloud Gateway (local) | Cloud Gateway (remote)  | UDP | 500 | Required for IPSEC<br> Internet key exchange (ISAKMP) for the bidirectional tunnel. |
| On-premises vCenter network | Private Cloud management network | TCP | 8000 |  vMotion of VMs from on-premises vCenter to Private Cloud vCenter   |     

## DHCP and DNS resolution considerations
Applications and workloads running in a private cloud environment require name resolution and DHCP services for lookup and IP address assignments. A proper DHCP and DNS infrastructure are required to provide these services. You can configure a virtual machine to provide these services in your private cloud environment.  

Use the DHCP service built-in to NSX or use a local DHCP server in the private cloud instead of routing broadcast DHCP traffic over the WAN back to on-premises.


## Next steps

In this tutorial, you learned about the considerations and requirements for deploying an Azure VMware Solution private cloud. Once you have the proper networking in place, continue to the next tutorial to create your Azure VMware Solution private cloud.

> [!div class="nextstepaction"]
> [Create an Azure VMware Solution private cloud](tutorial-create-private-cloud.md)
