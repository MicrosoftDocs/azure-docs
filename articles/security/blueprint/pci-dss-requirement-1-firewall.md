---

title: Firewall requirements for PCI DSS-compliant environments
description: PCI DSS Requirement 1
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: b1935d88-acae-42f9-bc25-bb0766f876ab
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/15/2017
ms.author: frasim

---

# Firewall requirements for PCI DSS-compliant environments 
## PCI DSS Requirement 1

**Install and maintain a firewall configuration to protect cardholder data**

> [!NOTE] These requirements are defined by the [Payment Card Industry (PCI) Security Standards Council](https://www.pcisecuritystandards.org/pci_security/) as part of the [PCI Data Security Standard (DSS) Version 3.2](https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss). Please refer to the PCI DSS for information on testing procedures and guidance for each requirement.

Firewalls are devices that control computer traffic allowed between an entity’s networks (internal) and untrusted networks (external), as well as traffic into and out of more sensitive areas within an entity’s internal trusted networks. The cardholder data environment is an example of a more sensitive area within an entity’s trusted network.
A firewall examines all network traffic and blocks those transmissions that do not meet the specified security criteria.
All systems must be protected from unauthorized access from untrusted networks, whether entering the system via the Internet as e-commerce, employee Internet access through desktop browsers, employee e-mail access, dedicated connections such as business-to-business connections, via wireless networks, or via other sources. Often, seemingly insignificant paths to and from untrusted networks can provide unprotected pathways into key systems. Firewalls are a key protection mechanism for any computer network.
Other system components may provide firewall functionality, as long as they meet the minimum requirements for firewalls as defined in Requirement 1. Where other system components are used within the cardholder data environment to provide firewall functionality, these devices must be included within the scope and assessment of Requirement 1.

## PCI DSS Requirement 1.1

**1.1** Establish and implement firewall and router configuration standards that include the following (see 1.1.1 through 1.1.7).


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides firewalling of the CDE using PaaS isolation, and an App Service Environment implementation ensures that CDE ingress and egress of data is protected.<br /><br />An [App Service Environment (ASE)](/azure/app-service-web/app-service-app-service-environment-intro) is a Premium service plan used for compliance reasons. For more information on ASE controls and configuration, see [PCI Guidance - App Service Environment](payment-processing-blueprint.md#app-service-environment).|



### PCI DSS Requirement 1.1.1

**1.1.1** A formal process for approving and testing all network connections and changes to the firewall and router configurations


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | A Contoso Webstore instance establishes a CI/CD DevOps model for ensuring that all changes are managed correctly. [Operations Management Suite (OMS)](/azure/operations-management-suite/) provides extensive logging of changes. Changes can be reviewed and verified for accuracy. For more specific guidance, see [PCI Guidance - Operations Management Suite](payment-processing-blueprint.md#logging-and-auditing).<br /><br />[Azure Security Center](https://azure.microsoft.com/services/security-center/) provides a centralized view of the security state of all your Azure resources. At a glance, you can verify that the appropriate security controls are in place and configured correctly, and you can quickly identify any resources that require attention.|



### PCI DSS Requirement 1.1.2

**1.1.2** Current network diagram that identifies all connections between the cardholder data environment and other networks, including any wireless networks

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Refer to the Contoso Webstore reference architecture and design documentation provided as part of the installation pattern of the solution.|



### PCI DSS Requirement 1.1.3

**1.1.3** Current diagram that shows all cardholder data flows across systems and networks

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Refer to the Contoso Webstore DFD and the Threat Model.|



### PCI DSS Requirement 1.1.4

**1.1.4** Requirements for a firewall at each Internet connection and between any demilitarized zone (DMZ) and the internal network zone

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure employs boundary protection devices such as gateways, network ACLs, and application firewalls to control communications at external and internal boundaries at the platform level. The customer then configures these to their specifications and requirements. Microsoft Azure filters communication when coming into the platform. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides a DMZ using PaaS isolation, and an App Service Environment implementation ensures that CDE ingress and egress of data is protected.<br /><br />An [App Service Environment (ASE)](/azure/app-service-web/app-service-app-service-environment-intro) is a Premium service plan used for compliance reasons. For more information on ASE controls and configuration, see [PCI Guidance - App Service Environment](payment-processing-blueprint.md#app-service-environment).|



### PCI DSS Requirement 1.1.5

**1.1.5** Description of groups, roles, and responsibilities for management of network components

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses [Azure Role-Based Access Control (RBAC)](/azure/active-directory/role-based-access-control-configure) to isolate user roles. RBAC enables precisely focused access management for Azure. Specific configurations exist for subscription access and Azure Key Vault access.|



### PCI DSS Requirement 1.1.6

**1.1.6** Documentation of business justification and approval for use of all services, protocols, and ports allowed, including documentation of security features implemented for those protocols considered to be insecure.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore opens only required ports and protocols throughout the RA design. Details about data flow can be seen in the DFD and Threat model.|



### PCI DSS Requirement 1.1.7

**1.1.7** Requirement to review firewall and router rule sets at least every six months

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | In the Contoso Webstore, the firewall rule sets are reviewed to ensure that no unnecessary or unused rules are included. By design, the demo is deployed with a least privilege, smallest path footprint.|



## PCI DSS Requirement 1.2

**1.2** Build firewall and router configurations that restrict connections between untrusted networks and any system components in the cardholder data environment. 

> [!NOTE] An “untrusted network” is any network that is external to the networks belonging to the entity under review, and/or which is out of the entity's ability to control or manage.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore's CDE is defined in the RA and deployment documentation. Untrusted networks are denied by design.|



### PCI DSS Requirement 1.2.1

**1.2.1** Restrict inbound and outbound traffic to that which is necessary for the cardholder data environment, and specifically deny all other traffic.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore's CDE is defined in the RA and deployment documentation. Untrusted networks are denied by design. The Contoso Webstore demo configures the Microsoft Azure application firewall to allow only specified ranges of IP addresses to access Microsoft Azure services. The Contoso Webstore provides a deny-all firewall at all CDE boundaries. All configurations is performed during the initial setup of the deployment.

[!NOTE] App Service Environment (ASE) is used in this solution to isolate the CDE However, it is essential that your Qualified Security Assessor (QSA) evaluates this solution, as ASE implements a DMZ isolation that allows outbound connections to be made by the ASE. PCI-DSS requires that all inbound and outbound connections which are not required must be blocked. For ASE to operate correctly, ASE will establish outbound connections as needed as defined in ["Networking considerations for an App Service Environment"](/azure/app-service/app-service-environment/network-info). Customers should evaluate the outbound connections with your QSA prior to deploying the solution into a production environment to ensure it will meet the requirements. |



### PCI DSS Requirement 1.2.2

**1.2.2** Secure and synchronize router configuration files.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides configurations synchronized for Microsoft Azure native network controls.|



### PCI DSS Requirement 1.2.3

**1.2.3** Install perimeter firewalls between all wireless networks and the cardholder data environment, and configure these firewalls to deny or, if traffic is necessary for business purposes, permit only authorized traffic between the wireless environment and the cardholder data environment.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore does not have any wireless solutions or capabilities enabled.|



## PCI DSS Requirement 1.3

**1.3** Prohibit direct public access between the Internet and any system component in the cardholder data environment.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure employs network-based and host-based boundary protection devices such as firewalls, load balancers, and ACLs. These devices use mechanisms such as VLAN isolation, NAT, and packet filtering to separate customer traffic from Internet and management traffic. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides, at the time of deployment, the configurations of the Azure application firewall to allow only specified ranges of IP addresses to access the site, include the bastion Azure VMs in their CDE.|



### PCI DSS Requirement 1.3.1

**1.3.1** Implement a DMZ to limit inbound traffic to only system components that provide authorized publicly accessible services, protocols, and ports.


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore implementation of its DMZ ensures that only authorized services can connect with the CDE.|



### PCI DSS Requirement 1.3.2

**1.3.2** Limit inbound Internet traffic to IP addresses within the DMZ.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore implementation of its DMZ ensures that only authorized services can connect with the CDE.|



### PCI DSS Requirement 1.3.3

**1.3.3** Implement anti-spoofing measures to detect and block forged source IP addresses from entering the network. (For example, block traffic originating from the Internet with an internal source address.)

**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure implements network filtering to prevent spoofed traffic and restrict incoming and outgoing traffic to trusted platform components. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



### PCI DSS Requirement 1.3.4

**1.3.4** Do not allow unauthorized outbound traffic from the cardholder data environment to the Internet.


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore architecture prevents unauthorized outbound traffic from the in-scope environment to the Internet. This is accomplished by configuring outbound traffic ACLs for approved ports and protocols in Microsoft Azure. These controls include access to the CDE in the SQL Server database. <br /><br />A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



### PCI DSS Requirement 1.3.5

**1.3.5** Permit only “established” connections into the network.


**Responsibilities:&nbsp;&nbsp;`Microsoft Azure Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure implements network filtering to prevent spoofed traffic and restrict incoming and outgoing traffic to trusted platform components. The Microsoft Azure network is segregated to separate customer traffic from management traffic. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Not applicable.|



### PCI DSS Requirement 1.3.6

**1.3.6** Place system components that store cardholder data (such as a database) in an internal network zone, segregated from the DMZ and other untrusted networks.


**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure uses network segregation and NAT to separate customer traffic from management traffic. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore architecture prevents unauthorized outbound traffic from the in-scope environment to the Internet. This is accomplished by configuring outbound traffic ACLs for approved ports and protocols in Microsoft Azure. These controls include access to the CDE in the SQL Server database. <br /><br />A PaaS SQL Database instance is used to showcase database security measures. For more information, see [PCI Guidance - Azure SQL Database](payment-processing-blueprint.md#azure-sql-database).|



### PCI DSS Requirement 1.3.7

**1.3.7** Do not disclose private IP
addresses and routing information to
unauthorized parties. 

> [!NOTE] Methods to obscure IP addressing may include, but are not limited to:
> - Network Address Translation (NAT).
> - Placing servers containing cardholder data behind proxy servers/firewalls.
> - Removal or filtering of route advertisements for private networks that employ registered addressing.
> - Internal use of RFC1918 address space instead of registered addresses.


**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure uses Network Address Translation (NAT) and network segregation to separate customer traffic from management traffic. Azure devices are uniquely identified by their UUID and are authenticated using Kerberos. Azure managed network devices are identified by RFC 1918 IP addressed. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore places all cardholder data behind proxy servers/firewalls and uses RFC1918 address space internally.|



## PCI DSS Requirement 1.4

**1.4** Install personal firewall software or equivalent functionality on any portable computing devices (including company and/or employee-owned) that connect to the Internet when outside the network (for example, laptops used by employees), and which are also used to access the CDE. Firewall (or equivalent) configurations include:
-Specific configuration settings are defined.
- Personal firewall (or equivalent functionality) is actively running.
- Personal firewall (or equivalent functionality) is not alterable by users of the portable computing devices.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore does not provide protection of end user devices. [Microsoft Intune](https://www.microsoft.com/cloud-platform/microsoft-intune) can be used to manage the mobile devices your workforce uses to access company data.|



## PCI DSS Requirement 1.5

**1.5** Ensure that security policies and operational procedures for managing firewalls are documented, in use, and known to all affected parties.

**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides, at the time of deployment, the configurations of the Azure application firewall to allow only specified ranges of IP addresses to access the site, include the bastion Azure VMs in their CDE.|




