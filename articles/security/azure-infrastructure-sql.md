---
title: Azure SQL Database security features
description: This article provides a general description of Azure SQL Database protects customer data in Azure.
services: security
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/28/2018
ms.author: terrylan

---

# Microsoft Azure SQL Database security features    
Microsoft Azure SQL Database provides a relational database service in Azure. To protect customer data and provide strong security features that customers expect from a relational database service, SQL Database has its own sets of security capabilities. These capabilities build upon the controls that are inherited from Azure.

### Usage of Tabular Data Stream (TDS) protocol
Microsoft Azure SQL Database only supports the TDS protocol, which requires the database to be accessible only over the default port of TCP/1433.

### Microsoft Azure SQL Database Firewall
To help protect customers’ data, Microsoft Azure SQL Database includes a firewall functionality, which by default prevents all access to the SQL Database server, as shown below.

![Azure SQL Database firewall][1]

The gateway firewall provides the capability to limit addresses allowing for granular control to customers to specify ranges of acceptable IP addresses. The firewall grants access based on the originating IP address of each request.

Firewall configuration can be accomplished using a Management Portal or programmatically using the Microsoft Azure SQL Database Management REST API. The Microsoft Azure SQL Database Gateway firewall by default prevents all customer TDS access to Microsoft Azure SQL Databases. Access must be configured using ACLs to permit Microsoft Azure SQL Database connections by source and destination Internet addresses, protocols, and port numbers.

### DoSGuard
Denial-of-service (DoS) attacks are reduced by an SQL Database Gateway service called DoSGuard. DoSGuard actively tracks failed logins from IP addresses. If there are multiple failed logins from a specific IP address within a period of time, the IP address is blocked from accessing any resources in the service for a pre-defined time period.

In addition to the above, the Microsoft Azure SQL Database gateway also performs:

- Secure channel capability negotiations to implement TDS FIPS 140-2 validated encrypted connections when connecting to the database servers.
- Stateful TDS packet inspection while accepting connections from clients. The gateway validates the connection information and passes on the TDS packets to the appropriate physical server based on the database name specified in the connection string.

The overarching principle for network security of the Microsoft Azure SQL Database offering is to only allow connection and communication that is necessary to allow the service to operate. All other ports, protocols, and connections are blocked by default. VLANs and ACLs are used to restrict network communications by source and destination networks, protocols, and port numbers.

Approved mechanisms to implement network-based ACLs include: ACLs on routers and load balancers. These are managed by Azure Networking, Guest VM firewall, and Microsoft Azure SQL Database gateway firewall rules, which are configured by the customer.

## Data segregation and customer isolation
The Azure Production network is structured such that publicly accessible system components are segregated from internal resources. Physical and logical boundaries exist between web servers providing access to the public-facing Azure portal and the underlying Azure virtual infrastructure, where customer application instances and customer data reside.

All publicly accessible information is managed within the Azure Production network. The Production network is subject to two-factor authentication and boundary protection mechanisms, uses the firewall and security feature set described in the previous section, and uses data isolation functions as noted below.

### Unauthorized Systems and Isolation of FC
Since the FC is the central orchestrator of the Microsoft Azure Fabric, significant controls are in place to mitigate threats to it, especially from potentially compromised FAs within customer applications. FC does not recognize any hardware whose device information (for example, MAC address) is not pre-loaded within the FC. The DHCP servers on the FC have configured lists of MAC addresses of the nodes they are willing to boot. Even if unauthorized systems are connected, they are not incorporated into Fabric inventory, and therefore not connected or authorized to communicate with any system within the Fabric inventory. This reduces the risk of unauthorized systems communicating with the FC and gaining access to the VLAN and Azure.

### VLAN Isolation
The Azure production network is logically segregated into three primary VLANs:

- The main VLAN – interconnects untrusted customer nodes
- The FC VLAN – contains trusted FCs and supporting systems
- The device VLAN – contains trusted network and other infrastructure devices

### Packet Filtering
The IPFilter and the software firewalls implemented on the Root OS and Guest OS of the nodes enforce connectivity restrictions and prevent unauthorized traffic between VMs.

### Hypervisor, Root OS, and Guest VMs
The isolation of the Root OS from the Guest VMs and the Guest VMs from one another is managed by the Hypervisor and the Root OS.

### Types of Rules on Firewalls
A rule is defined as:

{Security Response Center (Src) IP, Src Port, Destination IP, Destination Port, Destination Protocol, In/Out, Stateful/Stateless, Stateful Flow Timeout}.

SYN packets are allowed in or out only if any one of the rules permits. For TCP, Microsoft Azure uses stateless rules where the principle is that it only allows all non-SYN packets into or out of the VM. The security premise is that any host stack is resilient of ignoring a non-SYN if it has not seen a SYN packet previously. The TCP protocol itself is stateful, and in combination with the stateless SYNbased rule achieves an overall behavior of a stateful implementation.

For User Datagram Protocol (UDP), Microsoft Azure uses a stateful rule. Every time a UDP packet matches a rule, a reverse flow is created in the other direction. This flow has a built-in timeout.

Customers are responsible for setting up their own firewalls on top of what Microsoft Azure provides. Here customers are able to define the rules for inbound and outbound traffic.

### Production Configuration Management
Standard secure configurations are maintained by respective operations teams in Azure and Microsoft Azure SQL Database. All configuration changes to production systems are documented and tracked through a central tracking system. Software and hardware changes are tracked through the central tracking system. Networking changes relating to ACL are tracked using ACL Management Service (AMS).

All configuration changes to Microsoft Azure are developed and tested in the staging environment; and thereafter deployed in production environment. Software builds are reviewed as part of testing. Security and privacy checks are reviewed as part of entry checklist criteria. Changes are deployed on scheduled intervals by the respective deployment team. Releases are reviewed and signed off by the respective deployment team personnel before they are deployed into production.

Changes are monitored for success. On a failure scenario, the change is rolled-back to its previous state or a hotfix is deployed to address the failure with approval of the designated personnel. Source Depot, Git, TFS, MDS, Runners, Azure Security Monitoring (ASM), the FC, and the WinFabric platform are used to centrally manage, apply, and verify the configuration settings in the Azure virtual environment.

Similarly, hardware and network changes have established validation steps to evaluate their adherence to the build requirements. The releases are reviewed and authorized through a coordinated Change Advisory Board (CAB) of respective groups across the stack.

## Next steps
To learn more about what Microsoft does to secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](azure-physical-security.md)
- [Availability of Azure infrastructure](azure-infrastructure-availability.md)
- [Azure information system components and boundaries](azure-infrastructure-components.md)
- [Azure network architecture](azure-infrastructure-network.md)
- [Azure production network](azure-production-network.md)
- [Azure production operations and management](azure-infrastructure-operations.md)
- [Monitoring of Azure infrastructure](azure-infrastructure-monitoring.md)
- [Integrity of Azure infrastructure](azure-infrastructure-integrity.md)
- [Protection of customer data in Azure](azure-protection-of-customer-data.md)

<!--Image references-->
[1]: ./media/azure-infrastructure-sql/sql-database-firewall.png
