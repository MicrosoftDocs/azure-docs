---
title: "Tutorial: Network checklist"
description: Network Requirement prerequisites and details on Network Connectivity and Network Ports
ms.topic: tutorial
ms.date: 05/04/2020
---

# Networking checklist for Azure VMware Solution (AVS)

Azure VMware Solution offers a VMware private cloud environment, which is accessible for users and applications from on-premises and Azure-based environments or resources. The connectivity is delivered through networking services such as Azure ExpressRoute and VPN connections and will require some specific network address ranges and firewall ports for enabling the services. This article provides you with the information you need to know to properly configure your networking to work with AVS.

In this tutorial, you learn how about:

> [!div class="checklist"]
> * Network connectivity requirements
> * DHCP in AVS

## Network connectivity

The AVS private cloud is connected to your Azure virtual network using an Azure ExpressRoute connection. This high bandwidth, low latency connection allows you to access services running in your Azure subscription from your private cloud environment.

AVS private clouds require a minimum of a `/22` CIDR network address block for subnets, shown below. This network complements your on-premises networks. In order to connect to on-premises environments and virtual networks, this must be a non-overlapping network address block.

Example `/22` CIDR network address block:  `10.10.0.0/22`

The subnets:

| Network usage             | Subnet | Example        |
| ------------------------- | ------ | -------------- |
| Private cloud management            | `/24`    | `10.10.0.0/24`   |
| vMotion network       | `/24`    | `10.10.1.0/24`   |
| VM workloads | `/24`   | `10.10.2.0/24`   |
| ExpressRoute peering | `/24`    | `10.10.3.8/30`   |

### Network ports required to communicate with the service

Source|Destination|Protocol |Port |Description  |Comment
---|-----|:-----:|:-----:|-----|-----
Private Cloud DNS server  |On-Premises DNS Server  |UDP |53|DNS Client - Forward requests from PC vCenter for any on-premises DNS queries (check DNS section below) |
On-premises DNS Server  |Private Cloud DNS server  |UDP |53|DNS Client - Forward requests from on-premises services to Private Cloud DNS servers (check DNS section below)
On-premises network  |Private Cloud vCenter server  |TCP(HTTP)  |80|vCenter Server requires port 80 for direct HTTP connections. Port 80 redirects requests to HTTPS port 443. This redirection helps if you use `http://server` instead of `https://server`.  <br><br>WS-Management (also requires port 443 to be open) <br><br>If you use a custom Microsoft SQL database and not the bundled SQL Server 2008 database on the vCenter Server, port 80 is used by the SQL Reporting Services. When you install vCenter Server, the installer prompts you to change the HTTP port for the vCenter Server. Change the vCenter Server HTTP port to a custom value to ensure a successful installation. Microsoft Internet Information Services (IIS) also uses port 80. See Conflict Between vCenter Server and IIS for Port 80.
Private Cloud management network |On-premises Active Directory  |TCP  |389|This port must be open on the local and all remote instances of vCenter Server. This port is the LDAP port number for the Directory Services for the vCenter Server group. The vCenter Server system needs to bind to port 389, even if you aren't joining this vCenter Server instance to a Linked Mode group. If another service is running on this port, it might be preferable to remove it or change its port to a different port. You can run the LDAP service on any port from 1025 through 65535.  If this instance is serving as the Microsoft Windows Active Directory, change the port number from 389 to an available port from 1025 through 65535. This port is optional - for configuring on-premises AD as an identity source on the Private Cloud vCenter
On-premises network  |Private Cloud vCenter server  |TCP(HTTPS)  |443|This port allows you to access vCenter from on-premises network. The default port that the vCenter Server system uses to listen for connections from the vSphere Client. To enable the vCenter Server system to receive data from the vSphere Client, open port 443 in the firewall. The vCenter Server system also uses port 443 to monitor data transfer from SDK clients. This port is also used for the following services: WS-Management (also requires port 80 to be open). vSphere Client access to vSphere Update Manager. Third-party network management client connections to vCenter Server. Third-party network management clients access to hosts. 
Web Browser  | Hybrid Cloud Manager  | TCP(Https) | 9443 | Hybrid Cloud Manager Virtual Appliance Management Interface for Hybrid Cloud Manager system configuration.
Admin Network  | Hybrid Cloud Manager |ssh |22| Administrator SSH access to Hybrid Cloud Manager.
HCM |   Cloud  Gateway|TCP(HTTPS) |8123| Send host-based replication service instructions to the Hybrid Cloud Gateway.
HCM |   Cloud  Gateway  |    HTTP  TCP(HTTPS) |    9443  |  Send management instructions to the local Hybrid Cloud Gateway using the REST API.
Cloud Gateway|      L2C |    TCP (HTTP)  |   443 |   Send management instructions from Cloud Gateway to L2C when L2C uses the same path as the Hybrid Cloud Gateway.
Cloud Gateway |     ESXi Hosts |     TCP |    80,902  |   Management and OVF deployment
Cloud Gateway (local)|     Cloud Gateway (remote)|     UDP  |   4500 | Required for IPSEC<br>   Internet key exchange (IKEv2) to encapsulate workloads for the bidirectional tunnel. Network Address Translation-Traversal (NAT-T) is also supported.
Cloud Gateway (local)  |   Cloud Gateway (remote)  |   UDP  |   500   | Required for IPSEC<br> Internet key exchange (ISAKMP) for the bidirectional tunnel.
On-premises vCenter network|      Private Cloud management network|      TCP  |    8000    |  vMotion of VMs from on-premises vCenter to Private Cloud vCenter   |     

## DHCP

Applications and workloads running in a private cloud environment require name resolution and DHCP services for lookup and IP address assignment. A proper DHCP and DNS infrastructure is required to provide these services. You can configure a virtual machine to provide these services in your private cloud environment.  
It is recommended to use the DHCP service that is built-in to NSX or using a local DHCP server in the private cloud instead of routing broadcast DHCP traffic over the WAN back to on-premises.

In this tutorial, you learned about:

> [!div class="checklist"]
> * Network connectivity requirements
> * DHCP in AVS

## Next steps

Once you have the proper networking in place, continue to the next tutorial to create your AVS private cloud.

> [!div class="nextstepaction"]
> [Tutorial: Create an AVS private cloud](tutorial-create-private-cloud.md)
