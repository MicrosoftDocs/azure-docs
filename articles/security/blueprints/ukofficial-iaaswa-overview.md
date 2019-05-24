---

title: Azure Security and Compliance Blueprint - Three-Tier IaaS Web Application for UK OFFICIAL
description: Azure Security and Compliance Blueprint - Three-Tier IaaS Web Application for UK OFFICIAL
services: security
author: jomolesk

ms.assetid: 9c32e836-0564-4906-9e15-f070d2707e63
ms.service: security
ms.topic: article
ms.date: 02/08/2018
ms.author: jomolesk

---

# Azure Security and Compliance Blueprint - Three-Tier IaaS Web Application for UK OFFICIAL

## Overview

 This article provides guidance and automation scripts to deliver a Microsoft Azure three-tier web based architecture appropriate for handling many workloads classified as OFFICIAL in the United Kingdom.

 Using an Infrastructure as Code approach, the set of [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) templates deploy an environment that aligns to the UK National Cyber Security Centre (NCSC) 14 [Cloud Security Principles](https://www.ncsc.gov.uk/guidance/implementing-cloud-security-principles) and  the Center for Internet Security (CIS) [Critical Security  Controls](https://www.cisecurity.org/critical-controls.cfm).

 The NCSC recommend their Cloud Security Principles be used by customers to evaluate the security properties of the service, and to help understand the division of responsibility between the customer and supplier. We've provided information against each of these principles to help you understand the split of responsibilities.

 This architecture and corresponding Azure Resource Manager templates are supported by the Microsoft whitepaper, [14 Cloud Security Controls for UK cloud Using Microsoft Azure](https://gallery.technet.microsoft.com/14-Cloud-Security-Controls-670292c1). This paper catalogues how Azure services align with the UK NCSC 14 Cloud Security Principles,  thereby enabling organizations to fast-track their ability to meet their compliance obligations using cloud-based services globally and in the UK on the Microsoft Azure cloud.

 This template deploys the infrastructure for the workload. Application code and supporting business tier and data tier software must be installed and configured. Detailed deployment instructions are available [here](https://aka.ms/ukwebappblueprintrepo).

 If you do not have an Azure subscription then you can sign up quickly and easily - [Get Started with Azure](https://azure.microsoft.com/get-started/).

## Architecture Diagram and Components

 The Azure templates deliver a three-tier web application  architecture in an Azure cloud environment that supports UK OFFICIAL workloads. The architecture delivers a secure hybrid environment that  extends an on-premises network to Azure allowing web based workloads  to be accessed securely by corporate users or from the internet.

![Three-Tier IaaS Web Application for UK OFFICIAL reference architecture diagram](images/ukofficial-iaaswa-architecture.png?raw=true "Three-Tier IaaS Web Application for UK OFFICIAL reference architecture diagram")

 This solution uses the following Azure services. Details of the deployment architecture are located in the [deployment architecture](#deployment-architecture) section.

(1) /16 Virtual Network - Operational VNet
- (3) /24 subnets - 3-tier (Web, Biz, Data)
- (1) /27 subnet - ADDS
- (1) /27 subnet - Gateway Subnet
- (1) /29 subnet - Application Gateway Subnet
- Uses Default (Azure-Provided) DNS
- Peering enabled to Management VNet
- Network Security Group (NSG) for managing traffic flow

(1) /24 Virtual Network - Management VNet
- (1) /27 subnet
- Uses (2) ADDS DNS and (1) Azure DNS entries
- Peering enabled to Operational VNet
- Network Security Group (NSG) for managing traffic flow

(1) Application Gateway
- WAF - enabled
- WAF Mode - Prevention
- Rule set: OWASP 3.0
- HTTP Listener on Port 80
- Connectivity/Traffic regulated through NSG
- Public IP address endpoint defined (Azure)

(1) VPN - Route-based, Site-2-Site IPSec VPN tunnel
- Public IP address endpoint defined (Azure)
- Connectivity/Traffic regulated through NSG
- (1) local network gateway (on-premises endpoint)
- (1) Azure network gateway (Azure endpoint)

(9) Virtual Machines - All VMs are deployed with Azure IaaS Antimalware DSC settings

- (2) Active Directory Domain Services Domain Controllers (Windows Server 2012 R2)
  - (2) DNS Server Roles - 1 per VM
  - (2) NICs connected to Operational VNet - 1 per VM
  - Both are domain-joined to the domain defined in the template
    - Domain created as a part of the deployment


- (1) Jumpbox (Bastion Host) Management VM
  - 1 NIC on the Management VNet with Public IP address
    - NSG is used for limiting traffic (in/out) to specific sources
  - Not domain-joined


- (2) Web Tier VMs
  - (2) IIS Server Roles - 1 per VM
  - (2) NICs connected to Operational VNet - 1 per VM
  - Not domain-joined


- (2) Biz Tier VMs
  - (2) NICs connected to Operational VNet - 1 per VM
  - Not domain-joined


- (2) Data Tier VMs
  - (2) NICs connected to Operational VNet - 1 per VM
  - Not domain-joined

Availability Sets
- (1) Active Directory Domain Controller VM set - 2 VMs
- (1) Web Tier VM set - 2 VMs
- (1) Biz Tier VM set - 2 VMs
- (1) Data Tier VM set - 2 VMs

Load Balancer
- (1) Web Tier Load Balancer
- (1) Biz Tier Load Balancer
- (1) Data Tier Load Balancer

Storage
- (14) Total Storage Accounts
  - Active Directory Domain Controller Availability Set
    - (2) Primary Locally Redundant Storage (LRS) accounts - 1 for each VM  
    - (1) Diagnostic Locally Redundant Storage (LRS) account for the ADDS Availability Set
  - Management Jumpbox VM
    - (1) Primary Locally Redundant Storage (LRS) account for the Jumpbox VM
    - (1) Diagnostic Locally Redundant Storage (LRS) account for the Jumpbox VM
  - Web Tier VMs
    - (2) Primary Locally Redundant Storage (LRS) accounts - 1 for each VM  
    - (1) Diagnostic Locally Redundant Storage (LRS) account for the Web Tier Availability Set
  - Biz Tier VMs
    - (2) Primary Locally Redundant Storage (LRS) accounts - 1 for each VM  
    - (1) Diagnostic Locally Redundant Storage (LRS) account for the Biz Tier Availability Set
  - Data Tier VMs
    - (2) Primary Locally Redundant Storage (LRS) accounts - 1 for each VM  
    - (1) Diagnostic Locally Redundant Storage (LRS) account for the Data Tier Availability Set

### Deployment Architecture:

**On-Premises Network**: A private local-area network implemented in an organization.

**Production VNet**: The Production [VNet](https://docs.microsoft.com/azure/Virtual-Network/virtual-networks-overview) (Virtual Network) hosts the application and other operational resources running in Azure. Each VNet may contain several subnets which are used for isolating and managing network traffic.

**Web Tier**: Handles incoming HTTP requests. Responses are returned through this tier.

**Business Tier**: Implements business processes and other functional logic for the system.

**Database Tier**: Provides persistent data storage, using [SQL Server Always On Availability Groups](https://msdn.microsoft.com/library/hh510230.aspx) for high availability. Customers may use [Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-technical-overview) as a PaaS alternative.

**Gateway**: The [VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways) provides connectivity between the routers in the on-premises network and the production VNet.

**Internet Gateway and Public IP Address**: The internet gateway exposes application services to users through the internet. Traffic accessing these services is secured using an [Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-introduction) offering Layer 7 routing and load balancing capabilities with web application firewall (WAF) protection.

**Management VNet**: This [VNet](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) contains resources that implement management and monitoring capabilities for the workloads running in the production VNet.

**Jumpbox**: Also called a [bastion host](https://en.wikipedia.org/wiki/Bastion_host), which is a secure VM on the network that administrators use to connect to VMs in the production VNet. The jumpbox has an NSG that allows remote traffic only from public IP addresses on a safe list. To permit remote desktop (RDP) traffic, the source of the traffic needs to be defined in the NSG. Management of production resources is via RDP using a secured Jumpbox VM.

**User Defined Routes**: [User defined routes](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview) are used to define the flow of IP traffic within Azure VNets.

**Network Peered VNETs**: The Production and Management VNets are connected using [VNet peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview).
     These VNets are still managed as separate resources, but appear as one for all connectivity purposes for these virtual machines. These networks communicate with each other directly by using private IP addresses. VNet peering is subject to the VNets being in the same Azure Region.

**Network Security Groups**: [NSGs](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) contain Access Control Lists that allow or deny traffic within a VNet. NSGs can be used to secure traffic at a subnet or individual VM level.

**Active Directory Domain Services (AD DS)**: This architecture provides a dedicated [Active Directory Domain Services](https://technet.microsoft.com/library/hh831484.aspx) deployment.

**Logging and Audit**: [Azure Activity Log](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) captures operations taken on the resources in your subscription such as who initiated the operation, when the operation occurred, the status of the operation and the values of other properties that might help you research the operation. Azure Activity Log is an Azure platform service that captures all actions on a subscription. Logs can be archived or exported if required.

**Network Monitoring and Alerting**: [Azure Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview) is a platform service provides network packet capture, flow logging, topology tools and diagnostics  for network traffics within your VNets.

## Guidance and Recommendations

### Business Continuity

**High Availability**: Server workloads are grouped in a [Availability Set](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-manage-availability?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to help ensure high availability of virtual machines in Azure. This configuration helps ensure that during a planned or unplanned maintenance event at least one virtual machine will be available and meet the 99.95% Azure SLA.

### Logging and Audit

**Monitoring**: [Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-get-started) is the platform service that provides a single source for monitoring the activity log, metrics, and diagnostic logs of all your Azure resources. Azure Monitor can be configured to visualize, query, route, archive, and act on the metrics and logs coming from resources in Azure. It is recommended that Resource Based Access Control is used to secure the audit trail to help ensure that users don't have the ability to modify the logs.

**Activity Logs**: Configure [Azure Activity Logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) to provide insight into the operations that were performed on resources in your subscription.

**Diagnostic Logs**: [Diagnostic Logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) are all logs emitted by a resource. These logs could include Windows event system logs, blob, table, and queue logs.

**Firewall Logs**: Application Gateway provides full diagnostics and access logs. Firewall logs are available for application gateway resources that have WAF enabled.

**Log Archiving**: Log data storage can be configured to write to a centralized Azure storage account for archival and a defined retention period. Logs can be processed using Azure Monitor logs or by third party SIEM systems.

### Identity

**Active Directory Domain Services**: This architecture delivers an Active Directory Domain Services deployment in Azure. For specific recommendations on implementing Active Directory in Azure, see the following articles:

[Extending Active Directory Domain Services (AD DS) to Azure](https://docs.microsoft.com/azure/guidance/guidance-identity-adds-extend-domain).

[Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](https://msdn.microsoft.com/library/azure/jj156090.aspx).

**Active Directory Integration**: As an alternative to a dedicated AD DS architecture, customers may wish to use [Azure Active Directory](https://docs.microsoft.com/azure/guidance/guidance-ra-identity) integration or [Active Directory in Azure joined to an on-premises forest](https://docs.microsoft.com/azure/guidance/guidance-ra-identity).

### Security

**Management Security**: This blueprint allows administrators to connect to the management VNet and Jumpbox using RDP from a trusted source. Network traffic for the management VNet is controlled using NSGs. Access to port 3389 is restricted to traffic from a trusted IP range that can access the subnet containing the Jumpbox.

Customers may also consider using an [enhanced security administrative model](https://technet.microsoft.com/windows-server-docs/security/securing-privileged-access/securing-privileged-access) to secure the environment when connecting to the management VNet and Jumpbox. It is suggested that for enhanced security customers use a [Privileged Access Workstation](https://technet.microsoft.com/windows-server-docs/security/securing-privileged-access/privileged-access-workstations#what-is-a-privileged-access-workstation-paw) and RDGateway configuration. The use of network virtual appliances and public/private DMZs will offer further security enhancements.

**Securing the Network**: [Network Security Groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) (NSGs) are recommended for each subnet to provide a second level of protection against inbound traffic bypassing an incorrectly configured or disabled gateway. Example - [Resource Manager template for deploying an NSG](https://github.com/mspnp/template-building-blocks/tree/v1.0.0/templates/buildingBlocks/networkSecurityGroups).

**Securing Public Endpoints**: The internet gateway exposes application services to users through the internet. Traffic accessing these services is secured using an [Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-introduction), which provides a Web Application Firewall and HTTPS protocol management.

**IP Ranges**: The IP ranges in the architecture are suggested ranges. Customers are advised to consider their own environment and use appropriate ranges.

**Hybrid Connectivity**: The cloud based workloads are connected to the on-premises datacenter through IPSEC VPN using the Azure VPN Gateway. Customers should ensure that they are using an appropriate VPN Gateway to connect to Azure. Example - [VPN Gateway Resource Manager template](https://github.com/mspnp/template-building-blocks/tree/v1.0.0/templates/buildingBlocks/vpn-gateway-vpn-connection). Customers running large-scale, mission critical workloads with big data requirements may wish to consider a hybrid network architecture using [ExpressRoute](https://docs.microsoft.com/azure/guidance/guidance-hybrid-network-expressroute) for private network connectivity to Microsoft cloud services.

**Separation of Concerns**: This reference architecture separates the VNets for management operations and business operations. Separate VNets and subnets allow traffic management, including traffic ingress and egress restrictions, by using NSGs between network segments following [Microsoft cloud services and network security](https://docs.microsoft.com/azure/best-practices-network-security) best practices.

**Resource Management**: Azure resources such as VMs, VNets, and load balancers are managed by grouping them together into [Azure Resource Groups](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview). Resource Based Access Control roles can then be assigned to each resource group to restrict access to only authorized users.

**Access Control Restrictions**: Use [Role-Based Access Control](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal) (RBAC) to manage the resources in your application using [custom roles](https://docs.microsoft.com/azure/role-based-access-control/custom-roles) RBAC can be used to restrict the operations that DevOps can perform on each tier. When granting permissions, use the [principle of least privilege](https://msdn.microsoft.com/library/hdb58b2f(v=vs.110).aspx#Anchor_1). Log all administrative operations and perform regular audits to ensure any configuration changes were planned.

**Internet Access**: This reference architecture utilizes [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-introduction) as the internet facing gateway and load balancer. Some customers may also consider using third party network virtual appliances for additional layers of networking security as an alternative to the [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-introduction).

**Azure Security Center**: The [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro) provides a central view of the security status of resources in the subscription, and provides recommendations that help prevent compromised resources. It can also be used to enable more granular policies. For example, policies can be applied to specific resource groups, which allows the enterprise to tailor its posture to risk. It is recommended that customers enable Azure Security Center in their Azure Subscription.

## NCSC Cloud Security Principles Compliance Documentation

The Crown Commercial Service (an agency that works to improve commercial and procurement activity by the government) renewed the classification of Microsoft in-scope enterprise cloud services to  G-Cloud v6, covering all its offerings at the OFFICIAL level. Details of Azure and G-Cloud can be found in the [Azure UK G-Cloud security assessment summary](https://www.microsoft.com/en-us/trustcenter/compliance/uk-g-cloud).

This blueprint aligns to the 14 cloud security  principles that are documented in the NCSC [Cloud Security  Principles](https://www.ncsc.gov.uk/guidance/implementing-cloud-security-principles) to help ensure an environment that supports workloads classified as UK-OFFICIAL.

The [Customer Responsibility Matrix](https://aka.ms/ukofficial-crm) (Excel Workbook) lists  all 14 cloud security principles, and the matrix denotes, for each principle (or principle subpart), whether the principle implementation is the responsibility of Microsoft, the customer, or shared between the two.

The [Principle Implementation Matrix](https://aka.ms/ukofficial-iaaswa-pim) (Excel Workbook) lists all 14 cloud security principles, and the matrix denotes, for each principle (or principle subpart) that is designated a customer responsibility in the Customer Responsibilities Matrix, 1) if the blueprint automation implements the principle, and 2) a description of how the implementation aligns with the principle requirement(s).

Furthermore, the Cloud Security Alliance (CSA) published the Cloud Control Matrix to support customers in the evaluation of cloud providers and to identify questions that should be  answered before moving to cloud services. In response, Microsoft Azure answered the CSA Consensus Assessment Initiative Questionnaire ([CSA CAIQ](https://www.microsoft.com/en-us/TrustCenter/Compliance/CSA)), which describes how Microsoft  addresses the suggested principles.

## Deploy the Solution

There are two methods that deployment users may use to deploy this blueprint automation. The first method uses a PowerShell script, whereas the second method utilizes the Azure portal to deploy the reference architecture. Detailed deployment instructions are available [here](https://aka.ms/ukofficial-iaaswa-repo).

## Disclaimer

 - This document is for informational purposes only. MICROSOFT MAKES NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other Internet website references, may change without notice. Customers reading this document bear the risk of using it.
 - This document does not provide customers with any legal rights to any intellectual property in any Microsoft product or solutions.
 - Customers may copy and use this document for internal reference purposes.
 - Certain recommendations in this document may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.
 - This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment.
 - This document is developed as a reference and should not be used to define all means by which a customer can meet specific compliance requirements and regulations. Customers should seek legal support from their organization on approved customer implementations.
