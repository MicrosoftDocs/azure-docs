---
title: Microsoft Azure Virtual Data Center | Microsoft Docs
description: Learn how to build your virtual data center in Azure
services: networking
author: tracsman
manager: rossort
tags: azure-resource-manager

ms.service: networking
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/26/2017
ms.author: jonor
---

# Microsoft Azure Virtual Data Center
**Microsoft Azure**: Move faster, Save money, Integrate on-premises apps and data

## Overview
Migrating on-premises applications to Azure, even without any significant changes (an approach known as “lift and shift”), provides organizations the benefits of a secured and cost-efficient infrastructure. However, to make the most of the agility possible with cloud computing, enterprises should evolve their architectures to take advantage of Azure capabilities. Microsoft Azure delivers hyper-scale services and infrastructure, enterprise-grade capabilities and reliability, and many choices for hybrid connectivity. Customers can choose to access these cloud services either via the Internet or with Azure ExpressRoute, which provides private network connectivity. The Microsoft Azure platform allows customers to seamlessly extend their infrastructure into the cloud and build multi-tier architectures. Additionally, Microsoft partners provide enhanced capabilities by offering security services and virtual appliances that are optimized to run in Azure.

This article provides an overview of patterns and designs that can be used to solve the architectural scale, performance, and security concerns many customers face when thinking about moving en masse to the cloud. An overview of how to fit different organizational IT roles into the management and governance of the system is also discussed, with emphasis to security requirements and cost optimization.

## What is a Virtual Data Center?
In the early days, cloud solutions were designed to host single, relatively isolated, applications, in the public spectrum. This approach worked well for a few years. However, as the benefits of cloud solutions became apparent and multiple large-scale workloads were hosted on the cloud, addressing security, reliability, performance, and cost concerns of deployments in one or more regions became vital throughout the life cycle of the cloud service.

The following cloud deployment diagram illustrates some examples of security gaps (red box) and room for optimization network virtual appliances across workloads (yellow box).

[![0]][0]

The Virtual Data Center (vDC) was born from this necessity for scaling to support enterprise workloads, and the need to deal with the problems introduced when supporting large-scale applications in the public cloud.

A vDC is not just the application workloads in the cloud, but also the network, security, management, and infrastructure (for example, DNS and Directory Services). It usually also provides a private connection back to an on-premise network or data center. As more and more workloads move to Azure, it is important to think about the supporting infrastructure and objects that these workloads are placed in. Thinking carefully about how resources are structured can avoid the proliferation of hundreds of "workload islands" that must be managed separately with independent data flow, security models, and compliance challenges.

A Virtual Data Center is essentially a collection of separate but related entities with common supporting functions, features, and infrastructure. By viewing your workloads as an integrated vDC, you can realize reduced cost due to economies of scale, optimized security through component and data flow centralization, along with easier operations, management, and compliance audits.

> [!NOTE]
> It's important to understand that the vDC is **NOT** a discrete Azure product, but the combination of various features and capabilities to  meet your exact requirements. vDC is a way of thinking about your workloads and Azure usage to maximize your resources and abilities in the cloud. The virtual DC is therefore a modular approach on how to build up IT services in the Azure, respecting organizational roles and responsibilities.

The vDC can help enterprises get workloads and applications into Azure for the following scenarios:

-   Hosting multiple related workloads
-   Migrating workloads from an on-premise environment to Azure
-   Implementing shared or centralized security and access requirements across workloads
-   Mixing DevOps and Centralized IT appropriately for a large enterprise

The key to unlock the advantages of vDC, is a centralized topology (hub and spokes) with a mix of Azure features: [Azure VNet][VNet], [NSGs][NSG], [VNet Peering][VNetPeering], [User-Defined Routes (UDR)][UDR], and Azure Identity with [Role Base Access Control (RBAC)][RBAC].

## Who Needs a Virtual Data Center?
Any Azure customer that needs to move more than a couple of workloads into Azure can benefit from thinking about using common resources. Depending on the magnitude, even single applications can benefit from using the patterns and components used to build a vDC.

If your organization has a centralized IT, Network, Security, and/or Compliance team/department, a vDC can help enforce policy points, segregation of duty, and ensure uniformity of the underlying common components while giving application teams as much freedom and control as is appropriate for your requirements.

Organizations that are looking to DevOps can utilize the vDC concepts to provide authorized pockets of Azure resources and ensure they have total control within that group (either subscription or resource group in a common subscription), but the network and security boundaries stay compliant as defined by a centralized policy in a hub VNet and Resource Group.

## Considerations on Implementing a Virtual Data Center
When designing a vDC, there are several pivotal issues to consider:

-   Identity and Directory Services
-   Security infrastructure
-   Connectivity to the cloud
-   Connectivity within the cloud

##### *Identity and Directory Service*
Identity and Directory services are a key aspect of all data centers, both on-premises and in the cloud. Identity is related to all aspects of access and authorization to services within the vDC. To help ensure that only authorized users and processes access your Azure Account and resources, Azure uses several types of credentials for authentication. These include passwords (to access the Azure account), cryptographic keys, digital signatures, and certificates. [*Azure Multi-Factor Authentication* (MFA)][MFA] is an additional layer of security for accessing Azure services. Azure MFA provides strong authentication with a range of easy verification options—phone call, text message, or mobile app notification—and allow customers to choose the method they prefer.

Any large enterprise needs to define an identity management process that describes the management of individual identities, their authentication, authorization, roles, and privileges within or across the vDC. The goals of this process should be to increase security and productivity while decreasing cost, downtime, and repetitive manual tasks.

Enterprise/organizations can require a demanding mix of services for different Line-of-Businesses (LOBs), and employees often have different roles when involved with different projects. A vDC requires good cooperation between different teams, each with specific role definitions, to get systems running with good governance. The matrix of responsibilities, access, and rights can be extremely complex. Identity management in vDC is implemented through [*Azure Active Directory* (AAD)][AAD] and Role-Based Access Control (RBAC).

A Directory Service is a shared information infrastructure for locating, managing, administering, and organizing everyday items and network resources. These resources can include volumes, folders, files, printers, users, groups, devices, and other objects. Each resource on the network is considered an object by the directory server. Information about a resource is stored as a collection of attributes associated with that resource or object.

All Microsoft online business services rely on Azure Active Directory (AAD) for sign-in and other identity needs. Azure Active Directory is a comprehensive, highly available identity and access management cloud solution that combines core directory services, advanced identity governance, and application access management. AAD can be integrated with on-premises Active Directory to enable single sign-on for all cloud-based and locally hosted (on-premises) applications. The user attributes of on-premises Active Directory can be automatically synchronized to AAD.

A single global administrator is not required to assign all permissions in a vDC. Instead each specific department (or group of users or services in the Directory Service) can have the permissions required to manage their own resources within a vDC. Structuring permissions requires balancing. Too many permissions can impede performance efficiency, and too few or loose permissions can increase security risks. Azure Role-Based Access Control (RBAC) helps to address this problem, by offering fine-grained access management for vDC resources.

##### *Security Infrastructure*
Security infrastructure, in the context of a vDC, is mainly related to the segregation of traffic in the vDC's specific virtual network segment, and how to control ingress and egress flows throughout the vDC. Azure is based on multi-tenant architecture that prevents unauthorized and unintentional traffic between deployments, using Virtual Network (VNet) isolation, access control lists (ACLs), load balancers, and IP filters, along with traffic flow policies. Network address translation (NAT) separates internal network traffic from external traffic.

The Azure fabric allocates infrastructure resources to tenant workloads and manages communications to and from virtual machines (VMs). The Azure hypervisor enforces memory and process separation between VMs and securely routes network traffic to guest OS tenants.

##### *Connectivity to the cloud*
The vDC needs connectivity with external networks to offer services to customers, partners and/or internal users. This usually means connectivity not only to the Internet, but also to on-premises networks and data centers.

Customers can build their security policies to control what and how specific vDC hosted services are accessible to/from the Internet using Network Virtual Appliances (with filtering and traffic inspection), and custom routing policies and network filtering (User Defined Routing and Network Security Groups).

Enterprises often need to connect vDCs to on-premises data centers or other resources. The connectivity between Azure and on-premises networks is therefore a crucial aspect when designing an effective architecture. Enterprises have two different ways to create an interconnection between vDC and on-premises in Azure: transit over the Internet and/or by private direct connections.

An [**Azure Site-to-Site VPN**][VPN] is an interconnection service over the Internet between on-premises networks and the vDC, established through secure encrypted connections (IPsec/IKE tunnels). Azure Site-to-Site connection is flexible, quick to create, and does not require any further procurement, as all connections connect over the internet.

[**ExpressRoute**][ExR] is an Azure connectivity service that lets you create private connections between vDC and the on-premises networks. ExpressRoute connections do not go over the public Internet, and offer higher security, reliability, and higher speeds (up to 10 Gbps) along with consistent latency. ExpressRoute is very useful for vDCs, as ExpressRoute customers can get the benefits of compliance rules associated with private connections.

Deploying ExpressRoute connections involves engaging with an ExpressRoute service provider. For customers that need to start quickly, it is common to initially use Site-to-Site VPN to establish connectivity between the vDC and on-premises resources, and then migrate to ExpressRoute connection.

##### *Connectivity within the cloud*
[VNets][VNet] and [VNet Peering][VNetPeering] are the basic networking connectivity services inside a vDC. A VNet guarantees a natural boundary of isolation for vDC resources, and VNet peering allows intercommunication between different VNets within the same Azure region. Traffic control inside a VNet and between VNets need to match a set of security rules specified through Access Control Lists ([Network Security Group][NSG]), [Network Virtual Appliances][NVA], and custom routing tables ([UDR][UDR]).

## Virtual Data Center Overview

### Topology
Hub and spokes model extended the Virtual Data Center within a single Azure region

[![1]][1]

The hub is the central zone that controls and inspects ingress and/or egress traffic between different zones: Internet, on-premises, and the spokes. The hub and spoke topology gives the IT department an effective way to enforce security policies in a central location, while reducing the potential for misconfiguration and exposure.

The hub contains the common service components consumed by the spokes. Here are a few typical examples of common central services:

-   The Windows Active Directory infrastructure (with the related ADFS service) required for user authentication of third parties accessing from untrusted networks before getting access to the workloads in the spoke
-   A DNS service to resolve naming for the workload in the spokes, to access resources on-premises and on the Internet
-   A PKI infrastructure, to implement single sign-on on workloads
-   Flow control (TCP/UDP) between the spokes and Internet
-   Flow control between the spoke and on-premises
-   If desired, flow control between one spoke and another

The vDC reduces overall cost by using the shared hub infrastructure between multiple spokes.

The role of each spoke can be to host different types of workloads. The spokes can also provide a modular approach for repeatable deployments (for example, dev and test, User Acceptance Testing, pre-production, and production) of the same workloads. The spokes can also be used to segregate and enable different groups within your organization (for example, DevOps groups). Inside a spoke, it is possible to deploy a basic workload or complex multi-tier workloads with traffic control between the tiers.

##### Subscription limits and multiple hubs
In Azure, every component, whatever the type, is deployed in an Azure Subscription. The isolation of Azure components in different Azure subscriptions can satisfy the requirements of different LOBs, such as setting up differentiated levels of access and authorization.

A single vDC can scale up to large number of spokes, although, as with every IT system, there are platforms limits. The hub deployment is bound to a specific Azure subscription, which has restrictions and limits (for example, a max number of VNet peerings - see [Azure subscription and service limits, quotas, and constraints][Limits] for details). In cases where limits may be an issue, the architecture can scale up further by extending the model from a single hub-spokes to a cluster of hub and spokes. Multiple hubs in one or more Azure regions can be interconnected using Express Route or site-to-site VPN.

[![2]][2]

The introduction of multiple hubs increases the cost and management effort of the system and would only be justified by scalability (examples: system limits or redundancy) and regional replication (examples: end-user performance or disaster recovery). In scenarios requiring multiple hubs, all the hubs should strive to offer the same set of services for operational ease.

##### Interconnection between spokes
Inside a single spoke, it is possible to implement complex multi-tiers workloads. Multi-tier configurations can be implemented using subnets (one for every tier) in the same VNet and filtering the flows using NSGs.

On the other hand, an architect may want to deploy a multi-tier workload across multiple VNets. Using VNet peering, spokes can connect to other spokes in the same hub or different hubs. A typical example of this scenario is the case where application processing servers are in one spoke (VNet), while the database is deployed in a different spoke (VNet). In this case, it is easy to interconnect the spokes with VNet peering and thereby avoid transiting through the hub. A careful architecture and security review should be performed to ensure that bypassing the hub doesn’t bypass important security or auditing points that may only exist in the hub.

[![3]][3]

Spokes can also be interconnected to a spoke that acts as a hub. This approach creates a two-level hierarchy: the spoke in the higher level (level 0) become the hub of lower spokes (level 1) of the hierarchy. The spokes of vDC need to forward the traffic to the central hub to reach out either to the on-premises network or internet. An architecture with two levels of hub introduces complex routing that removes the benefits of a simple hub-spoke relationship.

Although Azure allows complex topologies, one of the core principles of the vDC concept is repeatability and simplicity. To minimize management effort, the simple hub-spoke design is the recommended vDC reference architecture.

### Components
A Virtual Data Center is made up of four basic component types: **Infrastructure**, **Perimeter Networks**, **Workloads**, and **Monitoring**.

Each component type consists of various Azure features and resources. Your vDC is made up of instances of multiple components types and multiple variations of the same component type. For instance, you may have many different, logically separated, workload instances that represent different applications. You use these different component types and instances to ultimately build the vDC.

[![4]][4]

The preceding high-level architecture of a vDC shows different component types used in different zones of the hub-spokes topology. The diagram shows infrastructure components in various parts of the architecture.

As a good practice (for an on-premises DC or vDC) access rights and privileges should be group-based. Dealing with groups, instead of individual users helps maintaining access policies consistently across teams and aids in minimizing configuration errors. Assigning and removing users to and from appropriate groups helps keeping the privileges of a specific user up-to-date.

Each role group should have a unique prefix on their names making it easy to identify which group is associated with which workload. For instance, a workload hosting an authentication service might have groups named *AuthServiceNetOps, AuthServiceSecOps, AuthServiceDevOps, and AuthServiceInfraOps.* Likewise for centralized roles, or roles not related to a specific service, could be prefaced with “Corp”, *CorpNetOps* for example.

Many organizations use a variation of the following groups to provide a major breakdown of roles:

-   The *central IT group (Corp)* has the ownership rights to control infrastructure (such as networking and security) components, and therefore needs to have the role of contributor on the subscription (and have control of the hub) and network contributor rights in the spokes. Large organization frequently split up these management responsibilities between multiple teams such as; a Network Operations (CorpNetOps) group (with exclusive focus on networking) and a Security Operations (CorpSecOps) group (responsible for firewall and security policy). In this specific case, two different groups need to be created for assignment of these custom roles.
-   The *dev & test (AppDevOps) group* has the responsibility to deploy workloads (Apps or Services). This group takes the role of Virtual Machine Contributor for IaaS deployments and/or one or more PaaS contributor’s roles (see [Built-in roles for Azure Role-Based Access Control][Roles]). Optionally the dev & test team may need to have visibility on security policies (NSGs) and routing policies (UDR) inside the hub or a specific spoke. Therefore, in addition to the roles of contributor for workloads, this group would also need the role of Network Reader.
-   The *operation and maintenance group (CorpInfraOps or AppInfraOps)* have the responsibility of managing workloads in production. This group needs to be a subscription contributor on workloads in any production subscriptions. Some organizations might also evaluate if they need an additional escalation support team group with the role of subscription contributor in production and in the central hub subscription, in order to fix potential configuration issues in the production environment.

A vDC is structured so that groups created for the central IT groups managing the hub have corresponding groups at the workload level. In addition to managing hub resources only the central IT groups would be able to control external access and top-level permissions on the subscription. However, workload groups would be able to control resources and permissions of their VNet independently on Central IT.

The vDC needs to be partitioned to securely host multiple projects across different Line-of-Businesses (LOBs). All projects require different isolated environments (Dev, UAT, production). Separate Azure subscriptions for each of these environments provide natural isolation.

[![5]][5]

The preceding diagram shows the relationship between an organization's projects, users, groups, and the environments where the Azure components are deployed.

Typically in IT, an environment (or tier) is a system in which multiple applications are deployed and executed. Large enterprises use a development environment (where changes originally made and tested) and a production environment (what end-users use). Those environments are separated, often with several staging environments in between them to allow phased deployment (rollout), testing, and rollback in case of problems. Deployment architectures vary significantly, but usually the basic process of starting at development (DEV) and ending at production (PROD) is still followed.

A common architecture for these types of multi-tier environments consists of DevOps (development and testing), UAT (staging), and production environments. Organizations can leverage single or multiple Azure AD tenants to define access and rights to these environments. The previous diagram shows a case where two different Azure AD tenants are used: one for DevOps and UAT, and the other exclusively for production.

The presence of different Azure AD tenants enforces the separation between environments. The same group of users (as an example, Central IT) needs to authenticate using a different URI to access a different AD tenant modify the roles or permissions of either the DevOps or production environments of a project. The presence of different user authentication to access different environments reduces possible outages and other issues caused by human errors.

#### Component Type: Infrastructure
This component type is where most of the supporting infrastructure resides. It's also where your centralized IT, Security, and/or Compliance teams spend most of their time.

[![6]][6]

Infrastructure components provide an interconnection between the different components of a vDC, and are present in both the hub and the spokes. The responsibility for managing and maintaining the infrastructure components is typically assigned to the central IT and/or security team.

One of the primary tasks of the IT infrastructure team is to guarantee the consistency of IP address schemas across the enterprise. The private IP address space assigned to the vDC needs to be consistent and NOT overlapping with private IP addresses assigned on your on-premises networks.

While NAT on the on-premises edge routers or in Azure environments can avoid IP address conflicts, it adds complications to your infrastructure components. Simplicity of management is one of the key goals of vDC, so using NAT to handle IP concerns is not a recommended solution.

Infrastructure components contain the following functionality:

-   [**Identity and directory services**][AAD]. Access to every resource type in Azure is controlled by an identity stored in a directory service. The directory service stores not only the list of users, but also the access rights to resources in a specific Azure subscription. These services can exist cloud-only, or they can be synchronized with on-premises identity stored in Active Directory.
-   [**Virtual Network**][VPN]. Virtual Networks are one of main components of a vDC, and enable you to create a traffic isolation boundary on the Azure platform. A Virtual Network is composed of a single or multiple virtual network segments, each with a specific IP network prefix (a subnet). The Virtual Network defines an internal perimeter area where IaaS virtual machines and PaaS services can establish private communications. VMs (and PaaS services) in one virtual network cannot communicate directly to VMs (and PaaS services) in a different virtual network, even if both virtual networks are created by the same customer, under the same subscription. Isolation is a critical property that ensures customer VMs and communication remains private within a virtual network.
-   [**UDR**][UDR]. Traffic in a Virtual Network is routed by default based on the system routing table. A User Define Route is a custom routing table that network administrators can associate to one or more subnets to overwrite the behavior of the system routing table and define a communication path within a virtual network. The presence of UDRs guarantees that egress traffic from the spoke transit through specific custom VMs and/or Network Virtual Appliances and load balancers present in the hub and in the spokes.
-   [**NSG**][NSG]. A Network Security Group is a list of security rules that act as traffic filtering on IP Sources, IP Destination, Protocols, IP Source Ports, and IP Destination ports. The NSG can be applied to a subnet, a Virtual NIC card associated with an Azure VM, or both. The NSGs are essential to implement a correct flow control in the hub and in the spokes. The level of security afforded by the NSG is a function of which ports you open, and for what purpose. Customers should apply additional per-VM filters with host-based firewalls such as IPtables or the Windows Firewall.
-   **DNS**. The name resolution of resources in the VNets of a vDC is provided through DNS. The scope of name resolution of the default DNS is limited to the VNet. Usually, a custom DNS service needs to be deployed in the hub as part of common services, but the main consumers of DNS services reside in the spoke. If necessary, customers can create a hierarchical DNS structure with delegation of DNS zones to the spokes.
-   [**Subscription][SubMgmt] and [Resource Group Management][RGMgmt]**. A subscription defines a natural boundary to create multiple groups of resources in Azure. Resources in a subscription are assembled together in logical containers named Resource Groups. The Resource Group represents a logical group to organize the resources of a vDC.
-   [**RBAC**][RBAC]. Through RBAC, it is possible to map organizational role along with rights to access specific Azure resources, allowing you to restrict users to only a certain subset of actions. With RBAC, you can grant access by assigning the appropriate role to users, groups, and applications within the relevant scope. The scope of a role assignment can be an Azure subscription, a resource group, or a single resource. RBAC allows inheritance of permissions. A role assigned at a parent scope also grants access to the children contained within it. Using RBAC, you can segregate duties and grant only the amount of access to users that they need to perform their jobs. For example, use RBAC to let one employee manage virtual machines in a subscription, while another can manage SQL DBs within the same subscription.
-   [**VNet Peering**][VNetPeering]. The fundamental feature used to create the infrastructure of a vDC is VNet Peering, a mechanism that connects two virtual networks (VNets) in the same region through the network of the Azure data center.

#### Component Type: Perimeter Networks
[Perimeter network][DMZ] components (also known as a DMZ network) allow you to provide network  connectivity with your on-premises or physical data center networks, along with any connectivity to and from the Internet. It's also where your network and security teams likely spend most of their time.

Incoming packets should flow through the security appliances in the hub, such as the firewall, IDS, and IPS, before reaching the back-end servers in the spokes. Internet-bound packets from the workloads should also flow through the security appliances in the perimeter network for policy enforcement, inspection, and auditing purposes, before leaving the network.

Perimeter network components provide the following features:

-   [Virtual Networks][VNet], [UDR][UDR], [NSG][NSG]
-   [Network Virtual Appliance][NVA]
-   [Load Balancer][ALB]
-   [Application Gateway][AppGW] / [WAF][WAF]
-   [Public IPs][PIP]

Usually, the central IT and security teams have responsibility for requirement definition and operations of the perimeter networks.

[![7]][7]

The preceding diagram shows the enforcement of two perimeters with access to the internet and an on-premises network, both resident in the hub. In a single hub, the perimeter network to internet can scale up to support large numbers of LOBs, using multiple farms of Web Application Firewalls (WAFs) and/or firewalls.

[**Virtual Networks**][VNet]
The hub is typically built on a VNet with multiple subnets to host the different type of services filtering and inspecting traffic to or from the internet via NVAs, WAFs, and Azure Application Gateways.

[**UDR**][UDR]
Using UDR, customers can deploy firewalls, IDS/IPS, and other virtual appliances, and route network traffic through these security appliances for security boundary policy enforcement, auditing, and inspection. UDRs can be created in both the hub and the spokes to guarantee that traffic transits through the specific custom VMs, Network Virtual Appliances and load balancers used by the vDC. To guarantee that traffic generated from VMs resident in the spoke transit to the correct virtual appliances, a UDR needs to be set in the subnets of the spoke by setting the front-end IP address of the internal load balancer as the next-hop. The internal load balancer distributes the internal traffic to the virtual appliances (load balancer back-end pool).

[![8]][8]

[**Network Virtual Appliances**][NVA]
In the hub, the perimeter network with access to the internet is normally managed through a farm of firewalls and/or Web Application Firewalls (WAFs).

Different LOBs commonly use many web applications, and these applications tend to suffer from various vulnerabilities and potential exploits. Web Applications Firewalls are a special breed of product used to detect attacks against web applications (HTTP/HTTPS) in more depth than a generic firewall. Compared with tradition firewall technology, WAFs have a set of specific features to protect internal web servers from threats.

A firewall farm is group of firewalls working in tandem under the same common administration, with a set of security rules to protect the workloads hosted in the spokes, and control access to on-premises networks. A firewall farm has less specialized software compared with a WAF, but has a broad application scope to filter and inspect any type of traffic in egress and ingress. Firewall farms are normally implemented in Azure through Network Virtual Appliances (NVAs), which are available in the Azure marketplace.

It is recommended to use one set of NVAs for traffic originating on the Internet, and another for traffic originating on-premises. Using only one set of NVAs for both is a security risk, as it provides no security perimeter between the two sets of network traffic. Using separate NVAs reduces the complexity of checking security rules, and makes it clear which rules correspond to which incoming network request.

Most large enterprises manage multiple domains. Azure DNS can be used to host the DNS records for a particular domain. As example, the Virtual IP Address (VIP) of the Azure external load balancer (or the WAFs) can be registered in the A record of an Azure DNS record.

[**Azure Load Balancer**][ALB]
Azure load balancer offers a high availability Layer 4 (TCP, UDP) service, which can distribute incoming traffic among service instances defined in a load-balanced set. Traffic sent to the load balancer from front-end endpoints (public IP endpoints or private IP endpoints) can be redistributed with or without address translation to a set of back-end IP address pool (examples being; Network Virtual Appliances or VMs).

Azure Load Balancer can probe the health of the various server instances as well, and when a probe fails to respond the load balancer stops sending traffic to the unhealthy instance. In a vDC, we have the presence of an external load balancer in the hub (for instance, balance the traffic to NVAs), and in the spokes (to perform tasks like balancing traffic between different VMs of a multitier application).

[**Application Gateway**][AppGW]
Microsoft Azure Application Gateway is a dedicated virtual appliance providing application delivery controller (ADC) as a service, offering various layer 7 load balancing capabilities for your application. It allows you to optimize web farm productivity by offloading CPU intensive SSL termination to the application gateway. It also provides other layer 7 routing capabilities including round robin distribution of incoming traffic, cookie-based session affinity, URL path-based routing, and the ability to host multiple websites behind a single Application Gateway. A web application firewall (WAF) is also provided as part of the application gateway WAF SKU. This SKU provides protection to web applications from common web vulnerabilities and exploits. Application Gateway can be configured as internet facing gateway, internal only gateway, or a combination of both. 

[**Public IPs**][PIP]
Some Azure features enable you to associate service endpoints to a public IP address that allows to your resource to be accessed from the internet. This endpoint uses Network Address Translation (NAT) to route traffic to the internal address and port on the Azure virtual network. This path is the primary way for external traffic to pass into the virtual network. The Public IP addresses can be configured to determine which traffic is passed in, and how and where it's translated on to the virtual network.

#### Component Type: Monitoring
Monitoring components provide visibility and alerting from all the other components types. All teams should have access to monitoring for the components and services they have access to. If you have a centralized help desk or operations teams, they would need to have integrated access to the data provided by these components.

Azure offers different types of logging and monitoring services to track the behavior of Azure hosted resources. Governance and control of workloads in Azure is based not just on collecting log data, but also the ability to trigger actions based on specific reported events.

There are two major types of logs in Azure:

-   [**Activity Logs**][ActLog] (referred also as "Operational Log") provide insight into the operations that were performed on resources in the Azure subscription. These logs report the control-plane events for your subscriptions. Every Azure resource produces audit logs.

-   [**Azure Diagnostic Logs**][DiagLog] are logs generated by a resource that provide rich, frequent data about the operation of that resource. The content of these logs varies by resource type.

[![9]][9]

In a vDC, it is extremely important to track the NSGs logs, particularly this information:

-   [**Event logs**][NSGLog]: provides information on what NSG rules are applied to VMs and instance roles based on MAC address.
-   [**Counter logs**][NSGLog]: tracks how many times each NSG rule was executed to deny or allow traffic.

All logs can be stored in Azure Storage Accounts for audit, static analysis, or backup purposes. When the logs are stored in an Azure storage account, customers can use different types of frameworks to retrieve, prep, analyze, and visualize this data to report the status and health of cloud resources.

Large enterprises should already have acquired a standard framework for monitoring on-premises systems and can extend that framework to integrate logs generated by cloud deployments. For organizations that wish to keep all the logging in the cloud, [Microsoft Operations Management Suite (OMS)][OMS] is a great choice. Since OMS is implemented as a cloud-based service, you can have it up and running quickly with minimal investment in infrastructure services. OMS can also integrate with System Center components such as System Center Operations Manager to extend your existing management investments into the cloud.

OMS Log analytics is a component of the OMS framework to help collect, correlate, search, and act on log and performance data generated by operating systems, applications, infrastructure cloud components. It gives customers real-time operational insights using integrated search and custom dashboards to analyze all the records across all your workloads in a vDC.

#### Component Type: Workloads
Workload components are where your actual applications and services reside. It's also where your application development teams spend most of their time.

The workload possibilities are truly endless. The following are just a few of the possible workload types:

**Internal LOB Applications**

Line-of-business applications are computer applications critical to the ongoing operation of an enterprise. LOB applications have some common characteristics:

-   **Interactive**. LOB applications are interactive by nature: data is entered, and result/reports are returned.
-   **Data driven**. LOB applications are data intensive with frequent access to the databases or other storage.
-   **Integrated**. LOB applications offer integration with other systems within or outside the organization.

**Customer facing web sites (Internet or Internal facing)**
Most applications that interact with the Internet are web sites. Azure offers the capability to run a web site on an IaaS VM or from an [Azure Web Apps][WebApps] site (PaaS). Azure Web Apps support integration with VNets that allow the deployment of the Web Apps in the spoke of a vDC. With the VNET integration, you don't need to expose an Internet endpoint for your applications but can use the resources private non-internet routable address from your private VNet instead.

**Big Data/Analytics**
When data needs to scale up to a very large volume, databases may not scale up properly. Hadoop technology offers a system to run distributed queries in parallel on large number of nodes. Customers have the option to run data workloads in IaaS VMs or PaaS ([HDInsight][HDI]). HDInsight supports deploying into a location-based VNet, can be deployed to a cluster in a spoke of the vDC.

**Events and Messaging**
[Azure Event Hubs][EventHubs] is a hyper-scale telemetry ingestion service that collects, transforms, and stores millions of events. As a distributed streaming platform, it offers low latency and configurable time retention, enabling you to ingest massive amounts of telemetry into Azure and read that data from multiple applications. With Event Hubs, a single stream can support both real-time and batch-based pipelines.

A highly reliable cloud messaging service between applications and services, can be implemented through [Azure Service Bus][ServiceBus] that offers asynchronous brokered messaging between client and server, along with structured first-in-first-out (FIFO) messaging and publish/subscribe capabilities.

[![10]][10]

### Multiple vDC
So far, this article has focused on a single vDC, describing the basic components and architecture that contribute to a resilient vDC. Azure features such as Azure load balancer, NVAs, availability sets, scale sets, along with other mechanisms contribute to a system that allow you to build solid SLA levels into your production services.

However, a single vDC is hosted within a single region, and is vulnerable to major outage that might affect that entire region. Customers that want to achieve high SLAs need to protect the services through deployments of the same project in two (or more) vDCs, placed in different regions.

In addition to SLA concerns, there are several common scenarios where deploying multiple vDCs makes sense:

-   Regional/Global presence
-   Disaster Recovery
-   Mechanism to divert traffic between DC

#### Regional/Global presence
Azure data centers are present in numerous regions worldwide. When selecting multiple Azure data centers, customers need to consider two related factors: geographical distances and latency. Customers need to evaluate the geographical distance between the vDCs and  the distance between the vDC and the end users, to offer the best user experience.

The Azure Region where vDCs are hosted also need to conform with regulatory requirements established by any legal jurisdiction under which your organization operates.

#### Disaster Recovery
The implementation of a disaster recovery plan is strongly related to the type of workload concerned, and the ability to synchronize the workload state between different vDCs. Ideally, most customers want to synchronize application data between deployments running in two different vDCs to implement a fast fail-over mechanism. Most applications are sensitive to latency, and that can cause potential timeout and delay in data synchronization.

Synchronization or heartbeat monitoring of applications in different vDCs requires communication between them. Two vDCs in different regions can be connected through:

-   ExpressRoute private peering when the vDC hubs are connected to the same ExpressRoute circuit
-   multiple ExpressRoute circuits connected via your corporate backbone and your vDC mesh connected to the ExpressRoute circuits
-   Site-to-Site VPN connections between your vDC hubs in each Azure Region

Usually the ExpressRoute connection is the preferred mechanism due higher bandwidth and consistent latency when transiting through the Microsoft backbone.

There is no magic recipe to validate an application distributed between two (or more) different vDCs located in different regions. Customers should run network qualification tests to verify the latency and bandwidth of the connections and target whether synchronous or asynchronous data replication is appropriate and what the optimal recovery time objective (RTO) can be for your workloads.

#### Mechanism to divert traffic between DC
One effective technique to divert the traffic incoming in one DC to another is based on DNS. [Azure Traffic Manager][TM] uses the Domain Name System (DNS) mechanism to direct the end-user traffic to the most appropriate public endpoint in a specific vDC. Through probes, Traffic Manager periodically checks the service health of public endpoints in different vDCs and, in case of failure of those endpoints, it routes automatically to the secondary vDC.

Traffic Manager works on Azure public endpoints and can be used, for example, to control/divert traffic to Azure VMs and Web Apps in the appropriate vDC. Traffic Manager is resilient even in the face of an entire Azure region failing and can control the distribution of user traffic for service endpoints in different vDCs based on several criteria (for instance, failure of a service in a specific vDC, or selecting the vDC with the lowest network latency for the client).

### Conclusion
The Virtual Data Center is an approach to data center migration into the cloud that uses a combination of features and capabilities to create a scalable architecture in Azure that maximizes cloud resource use, reducing costs, and simplifying system governance. The vDC concept is based on a hub-spokes topology, providing common shared services in the hub and allowing specific applications/workloads in the spokes. A vDC matches the structure of company roles, where different departments (Central IT, DevOps, operation and maintenance) work together, each with a specific list of roles and duties. A vDC satisfies the requirements for a "Lift and Shift" migration, but also provides many advantages to native cloud deployments.

## References
The following features were discussed in this document. Click the links to learn more.

| | | |
|-|-|-|
|Network Features|Load Balancing|Connectivity|
|[Azure Virtual Networks][VNet]</br>[Network Security Groups][NSG]</br>[NSG Logs][NSGLog]</br>[User Defined Routing][UDR]</br>[Network Virtual Appliances][NVA]</br>[Public IP Addresses][PIP]|[Azure Load Balancer (L3) ][ALB]</br>[Application Gateway (L7) ][AppGW]</br>[Web Application Firewall][WAF]</br>[Azure Traffic Manager][TM] |[VNet Peering][VNetPeering]</br>[Virtual Private Network][VPN]</br>[ExpressRoute][ExR]
|Identity</br>|Monitoring</br>|Best Practices</br>|
|[Azure Active Directory][AAD]</br>[Multi-Factor Authentication][MFA]</br>[Role Base Access Controls][RBAC]</br>[Default AAD Roles][Roles] |[Activity Logs][ActLog]</br>[Diagnostic Logs][DiagLog]</br>[Microsoft Operations Management Suite][OMS]</br> |[Perimeter Networks Best Practices][DMZ]</br>[Subscription Management][SubMgmt]</br>[Resource Group Management][RGMgmt]</br>[Azure Subscription Limits][Limits] |
|Other Azure Services|
|[Azure Web Apps][WebApps]</br>[HDInsights (Hadoop) ][HDI]</br>[Event Hubs][EventHubs]</br>[Service Bus][ServiceBus]|



## Next Steps
 - Explore [VNet Peering][VNetPeering], the underpinning technology for vDC hub and spoke designs
 - Implement [AAD][AAD] to get started with [RBAC][RBAC] exploration
 - Develop a Subscription and Resource management model and RBAC model to meet the structure, requirements, and polices of your organization. The most important activity is planning. As much as practical, plan for reorganizations, mergers, new product lines, etc.

<!--Image References-->
[0]: ./media/networking-virtual-datacenter/redundant-equipment.png "Examples of component overlap" 
[1]: ./media/networking-virtual-datacenter/vdc-high-level.png "High-level example of hub and spoke vDC"
[2]: ./media/networking-virtual-datacenter/hub-spokes-cluster.png "Cluster of hubs and spokes"
[3]: ./media/networking-virtual-datacenter/spoke-to-spoke.png "Spoke-to-spoke"
[4]: ./media/networking-virtual-datacenter/vdc-block-level-diagram.png "Block level diagram of the vDC"
[5]: ./media/networking-virtual-datacenter/users-groups-subsciptions.png "Users, groups, subscriptions, and projects"
[6]: ./media/networking-virtual-datacenter/infrastructure-high-level.png "High-level infrastructure diagram"
[7]: ./media/networking-virtual-datacenter/highlevel-perimeter-networks.png "High-level infrastructure diagram"
[8]: ./media/networking-virtual-datacenter/vnet-peering-perimeter-neworks.png "VNet Peering and perimeter networks"
[9]: ./media/networking-virtual-datacenter/high-level-diagram-monitoring.png "High-Level diagram for Monitoring"
[10]: ./media/networking-virtual-datacenter/high-level-workloads.png "High-level diagram for Workload"

<!--Link References-->
[Limits]: https://docs.microsoft.com/azure/azure-subscription-service-limits
[Roles]: https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles
[VNet]: https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview
[NSG]: https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg 
[VNetPeering]: https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview 
[UDR]: https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview 
[RBAC]: https://docs.microsoft.com/azure/active-directory/role-based-access-control-what-is
[MFA]: https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication
[AAD]: https://docs.microsoft.com/azure/active-directory/active-directory-whatis
[VPN]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways 
[ExR]: https://docs.microsoft.com/azure/expressroute/expressroute-introduction 
[NVA]: https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/nva-ha
[SubMgmt]: https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-subscription-governance 
[RGMgmt]: https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview
[DMZ]: https://docs.microsoft.com/azure/best-practices-network-security
[ALB]: https://docs.microsoft.com/azure/load-balancer/load-balancer-overview
[PIP]: https://docs.microsoft.com/azure/virtual-network/resource-groups-networking#public-ip-address
[AppGW]: https://docs.microsoft.com/azure/application-gateway/application-gateway-introduction
[WAF]: https://docs.microsoft.com/azure/application-gateway/application-gateway-web-application-firewall-overview
[ActLog]: https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs 
[DiagLog]: https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs
[NSGLog]: https://docs.microsoft.com/azure/virtual-network/virtual-network-nsg-manage-log
[OMS]: https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-overview
[WebApps]: https://docs.microsoft.com/azure/app-service-web/
[HDI]: https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-introduction
[EventHubs]: https://docs.microsoft.com/azure/event-hubs/event-hubs-what-is-event-hubs 
[ServiceBus]: https://docs.microsoft.com/azure/service-bus-messaging/service-bus-messaging-overview
[TM]: https://docs.microsoft.com/azure/traffic-manager/traffic-manager-overview
