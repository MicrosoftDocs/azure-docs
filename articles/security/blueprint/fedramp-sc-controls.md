---

title: Web Applications for FedRAMP: System and Communications Protection 
description: Web Applications for FedRAMP: System and Communications Protection 
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: b96cdef1-ce3a-4f73-9a9e-f2cbd056d485
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/15/2017
ms.author: jomolesk

---

> [!NOTE]
> These controls are defined by NIST and the U.S. Department of Commerce as part of the NIST Special Publication 800-53 Revision 4. Please refer to NIST 800-53 Rev. 4 for information on testing procedures and guidance for each control.
    
    

# System and Communications Protection (SC)

## NIST 800-53 Control SC-1

#### System and Communications Protection Policy and Procedures

**SC-1** The organization develops, documents, and disseminates to [Assignment: organization-defined personnel or roles] a system and communications protection policy that addresses purpose, scope, roles, responsibilities, management commitment, coordination among organizational entities, and compliance; and procedures to facilitate the implementation of the system and communications protection policy and associated system and communications protection controls; and reviews and updates the current system and communications protection policy [Assignment: organization-defined frequency]; and system and communications protection procedures [Assignment: organization-defined frequency].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system and communications protection policy and procedures may be sufficient to address this control. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-2

#### Application Partitioning

**SC-2** The information system separates user functionality (including user interface services) from information system management functionality.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint separates user functionality from system management functionality through enforcement of logical access controls and system architecture. User functionality is limited to customer-deployed web application interfaces. Interfaces for system management functionality are separate from user interfaces. All management connectivity is through a secure bastion host (jumpbox) located in a management subnet with network security group rules to limit access to production resources as appropriate. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-3

#### Security Function Isolation

**SC-3** The information system isolates security functions from nonsecurity functions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The virtual machines deployed by this Azure Blueprint run Windows operating systems. Windows maintains separate execution domains for each executing process by assigning a private virtual address space to each process. Additionally, the solution implements an architecture and access controls designed to isolate security functionality where necessary. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-4

#### Information in Shared Resources

**SC-4** The information system prevents unauthorized and unintended information transfer via shared system resources.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The virtual machines deployed by this Azure Blueprint run Windows operating systems. The operating system manages resources (e.g., memory, storage) such that information is accessible only to users and roles with appropriate permissions. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-5

#### Denial of Service Protection

**SC-5** The information system protects against or limits the effects of the following types of denial of service attacks: [Assignment: organization-defined types of denial of service attacks or references to sources for such information] by employing [Assignment: organization-defined security safeguards].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys an Application Gateway that include a web application firewall and load balancing capabilities. Deployed virtual machines supporting the web tier, database tier, and Active Directory are deployed in a scalable availability set. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-6

#### Resource Availability

**SC-6** The information system protects the availability of resources by allocating [Assignment: organization-defined resources] by [Selection (one or more); priority; quota; [Assignment: organization-defined security safeguards]].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The virtual machines deployed by this Azure Blueprint run Windows operating systems. Each Windows process provides the resources needed to execute a program. Resource priority is managed by the operating system. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-7.a

#### Boundary Protection

**SC-7.a** The information system monitors and controls communications at the external boundary of the system and at key internal boundaries within the system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys an Application Gateway, load balancer, and configures network security group rules to control commutations at external boundaries and between internal subnets. Application Gateway, load balancer, and network security group event and diagnostic logs are collected by OMS Log Analytics to allow customer monitoring. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-7.b

#### Boundary Protection

**SC-7.b** The information system implements subnetworks for publicly accessible system components that are [Selection: physically; logically] separated from internal organizational networks.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys resources in an architecture with a separate web subnet, database subnet, Active Directory subnet, and management subnet. Subnets are logically separated by network security group rules applied to the individual subnets to restrict traffic between subnets to only that necessary for system and management functionality (e.g., external traffic cannot access the database, management, or Active Directory subnets). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-7.c

#### Boundary Protection

**SC-7.c** The information system connects to external networks or information systems only through managed interfaces consisting of boundary protection devices arranged in accordance with an organizational security architecture.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys an Application Gateway to manage external connections to a customer-deployed web application. External connections for management access are restricted to a bastion host / jumpbox deployed in a management subnet with network security rules applied to restrict external connections to authorized IP addresses. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (3)

#### Boundary Protection | Access Points

**SC-7 (3)** The organization limits the number of external network connections to the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys two public IP addresses: one associated with the Application Gateway; one associated with the management bastion host / jumpbox. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (4).a

#### Boundary Protection | External Telecommunications Services

**SC-7 (4).a** The organization implements a managed interface for each external telecommunication service.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys two public IP addresses: one associated with the Application Gateway; one associated with the management bastion host / jumpbox. Management of these interfaces is enabled through software-defined networking. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (4).b

#### Boundary Protection | External Telecommunications Services

**SC-7 (4).b** The organization establishes a traffic flow policy for each managed interface.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys two public IP addresses: one associated with the Application Gateway; one associated with the management bastion host / jumpbox. Management of these interfaces is enabled through software-defined networking. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (4).c

#### Boundary Protection | External Telecommunications Services

**SC-7 (4).c** The organization protects the confidentiality and integrity of the information being transmitted across each interface.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The web application gateway deployed by this Azure Blueprint is configured with an HTTPS listener, ensuing confidentiality and integrity of communications sessions. Remote Desktop connections to the jumpbox are also encrypted providing confidentiality and integrity. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (4).d

#### Boundary Protection | External Telecommunications Services

**SC-7 (4).d** The organization documents each exception to the traffic flow policy with a supporting mission/business need and duration of that need.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Customers are not responsible for datacenter operations (to include telecommunications services). All telecommunication services are provided and managed by Microsoft Azure. This control is inherited from Azure. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (4).e

#### Boundary Protection | External Telecommunications Services

**SC-7 (4).e** The organization reviews exceptions to the traffic flow policy [Assignment: organization-defined frequency] and removes exceptions that are no longer supported by an explicit mission/business need.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Customers are not responsible for datacenter operations (to include telecommunications services). All telecommunication services are provided and managed by Microsoft Azure. This control is inherited from Azure. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (5)

#### Boundary Protection | Deny by Default / Allow by Exception

**SC-7 (5)** The information system at managed interfaces denies network communications traffic by default and allows network communications traffic by exception (i.e., deny all, permit by exception).

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Rulesets applied to network security groups deployed by this Azure Blueprint are configured using a deny-by-default scheme. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (7)

#### Boundary Protection | Prevent Split Tunneling for Remote Devices

**SC-7 (7)** The information system, in conjunction with a remote device, prevents the device from simultaneously establishing non-remote connections with the system and communicating via some other connection to resources in external networks.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level remote device configuration policy may address split-tunneling. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (8)

#### Boundary Protection | Route Traffic to Authenticated Proxy Servers

**SC-7 (8)** The information system routes [Assignment: organization-defined internal communications traffic] to [Assignment: organization-defined external networks] through authenticated proxy servers at managed interfaces.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for routing customer-defined information through an authenticated proxy to an external network. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (10)

#### Boundary Protection | Prevent Unauthorized Exfiltration

**SC-7 (10)** The organization prevents the unauthorized exfiltration of information across managed interfaces.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for preventing unauthorized exfiltration of information across managed interfaces. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (12)

#### Boundary Protection | Host-Based Protection

**SC-7 (12)** The organization implements [Assignment: organization-defined host-based boundary protection mechanisms] at [Assignment: organization-defined information system components].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Virtual machines deployed by this Azure Blueprint are configured with a host-based firewall enabled. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (13)

#### Boundary Protection | Isolation of Security Tools / Mechanisms / Support Components

**SC-7 (13)** The organization isolates [Assignment: organization-defined information security tools, mechanisms, and support components] from other internal information system components by implementing physically separate subnetworks with managed interfaces to other components of the system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys resources in an architecture with a separate management subnet for customer deployment of information security tools and support components. Subnets are logically separated by network security group rules. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (18)

#### Boundary Protection | Fail Secure

**SC-7 (18)** The information system fails securely in the event of an operational failure of a boundary protection device.

**Responsibilities:** `Azure Only`

|||
|---|---|
| **Customer** | There are no physical boundary protection devices within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Microsoft Azure deploys geographically separate and redundant Gateway servers and SSL VPN. When a Gateway system fails, it fails securely and access is restricted to the environment. In order to establish a connection to the Microsoft Azure environment, a user must establish a separate connection to an active Gateway server managed by Microsoft Azure. <br /> Additionally, if Microsoft Azure network devices (including edge routers, access routers, load balancers, aggregation switches, and TORS) fail, the affected circuit becomes disconnected, thereby failing securely. A failure of a Microsoft Azure network device cannot lead to, or cause information external to the system to enter the device, nor can a failure permit unauthorized information release. The built in redundancy allows Microsoft Azure assets to fail without impacting availability. |


 ### NIST 800-53 Control SC-7 (20)

#### Boundary Protection | Dynamic Isolation / Segregation

**SC-7 (20)** The information system provides the capability to dynamically isolate/segregate [Assignment: organization-defined information system components] from other components of the system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for ensuring that the system has the capability to dynamically isolate customer-deployed resources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-7 (21)

#### Boundary Protection | Isolation of Information System Components

**SC-7 (21)** The organization employs boundary protection mechanisms to separate [Assignment: organization-defined information system components] supporting [Assignment: organization-defined missions and/or business functions].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys resources in an architecture with a separate web subnet, database subnet, Active Directory subnet, and management subnet. Subnets are logically separated by network security group rules applied to the individual subnets to restrict traffic between subnets to only that necessary for system and management functionality. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-8

#### Transmission Confidentiality and Integrity

**SC-8** The information system protects the [Selection (one or more): confidentiality; integrity] of transmitted information.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | SI-8 (1) implementation satisfies this control requirement. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-8 (1)

#### Transmission Confidentiality and Integrity | Cryptographic or Alternate Physical Protection

**SC-8 (1)** The information system implements cryptographic mechanisms to [Selection (one or more): prevent unauthorized disclosure of information; detect changes to information] during transmission unless otherwise protected by [Assignment: organization-defined alternative physical safeguards].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint configures resources to communicate using only secure protocols. The WAF component of the Application Gateway is configured to accept communicators from external uses over HTTPS/TLS and communicate with the backend pool only over HTTPS/TLS. SQL Server is configured to communicate only over HTTPS/TLS. Remote Desktop services are configured to use secure connections. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-10

#### Network Disconnect

**SC-10** The information system terminates the network connection associated with a communications session at the end of the session or after [Assignment: organization-defined time period] of inactivity.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Authentication for Remote Desktop sessions is managed by Active Directory. Once access is disabled for a user in Active Directory, remote sessions are immediately terminated. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-12

#### Cryptographic Key Establishment and Management

**SC-12** The organization establishes and manages cryptographic keys for required cryptography employed within the information system in accordance with [Assignment: organization-defined requirements for key generation, distribution, storage, access, and destruction].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | This Azure Blueprint deploys an Azure Key Vault. Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. Azure Key Vault can generate keys using a FIPS 140-2 level 2 hardware security module (HSM) key generation capability. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-12 (1)

#### Cryptographic Key Establishment and Management | Availability

**SC-12 (1)** The organization maintains availability of information in the event of the loss of cryptographic keys by users.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Azure Key Vault is used to store cryptographic keys and secrets used in this Azure Blueprint. Key Vault streamlines the key management process for keys that access and encrypt data. The following authenticators are stored in Key Vault: Azure password for deploy account, virtual machine administrator password, SQL Server service account password. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-12 (2)

#### Cryptographic Key Establishment and Management | Symmetric Keys

**SC-12 (2)** The organization produces, controls, and distributes symmetric cryptographic keys using [Selection: NIST FIPS-compliant; NSA-approved] key management technology and processes.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Azure Key Vault is used to produce, control, and distribute cryptographic keys. Azure Key Vault can generate keys using a FIPS 140-2 level 2 hardware security module (HSM) key generation capability. Keys are stored and managed within securely encrypted containers within Azure Key Vault. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-12 (3)

#### Cryptographic Key Establishment and Management | Asymmetric Keys

**SC-12 (3)** The organization produces, controls, and distributes asymmetric cryptographic keys using [Selection: NSA-approved key management technology and processes; approved PKI Class 3 certificates or prepositioned keying material; approved PKI Class 3 or Class 4 certificates and hardware security tokens that protect the user's private key].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for producing, controlling, and distributing asymmetric cryptographic keys (if they are used within customer-deployed resources). |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-13

#### Cryptographic Protection

**SC-13** The information system implements [Assignment: organization-defined cryptographic uses and type of cryptography required for each use] in accordance with applicable federal laws, Executive Orders, directives, policies, regulations, and standards.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Windows authentication, remote desktop, and BitLocker are employed by this Azure Blueprint. These components can be configured to rely on FIPS 140 validated cryptographic modules. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-15.a

#### Collaborative Computing Devices

**SC-15.a** The information system prohibits remote activation of collaborative computing devices with the following exceptions: [Assignment: organization-defined exceptions where remote activation is to be allowed].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | There are no collaborative computing devices deployed as part of this Azure Blueprint. Note: There are physical collaborative computing devices within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-15.b

#### Collaborative Computing Devices

**SC-15.b** The information system provides an explicit indication of use to users physically present at the devices.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | There are no collaborative computing devices deployed as part of this Azure Blueprint. Note: There are physical collaborative computing devices within the scope of systems deployed on Azure. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-17

#### Public Key Infrastructure Certificates

**SC-17** The organization issues public key certificates under an [Assignment: organization-defined certificate policy] or obtains public key certificates from an approved service provider.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an enterprise-level public key infrastructure for certificate issuance. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-18.a

#### Mobile Code

**SC-18.a** The organization defines acceptable and unacceptable mobile code and mobile code technologies.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system and communications protection procedures may define acceptable and unacceptable mobile code. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-18.b

#### Mobile Code

**SC-18.b** The organization establishes usage restrictions and implementation guidance for acceptable mobile code and mobile code technologies.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer's enterprise-level system and communications protection procedures may establish restrictions on the use of mobile code. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-18.c

#### Mobile Code

**SC-18.c** The organization authorizes, monitors, and controls the use of mobile code within the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer may rely on an enterprise-level process for authorization, monitoring, and control of the use of mobile code. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-19.a

#### Voice Over Internet Protocol

**SC-19.a** The organization establishes usage restrictions and implementation guidance for Voice over Internet Protocol (VoIP) technologies based on the potential to cause damage to the information system if used maliciously.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | There are no voice over internet protocol technologies deployed as part of this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-19.b

#### Voice Over Internet Protocol

**SC-19.b** The organization authorizes, monitors, and controls the use of VoIP within the information system.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | There are no voice over internet protocol technologies deployed as part of this Azure Blueprint. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-20.a

#### Secure Name / Address Resolution Service (Authoritative Source)

**SC-20.a** The information system provides additional data origin authentication and integrity verification artifacts along with the authoritative name resolution data the system returns in response to external name/address resolution queries.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for a secure name and address resolution service. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-20.b

#### Secure Name / Address Resolution Service (Authoritative Source)

**SC-20.b** The information system provides the means to indicate the security status of child zones and (if the child supports secure resolution services) to enable verification of a chain of trust among parent and child domains, when operating as part of a distributed, hierarchical namespace.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for a secure name and address resolution service. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-21

#### Secure Name / Address Resolution Service (Recursive or Caching Resolver)

**SC-21** The information system requests and performs data origin authentication and data integrity verification on the name/address resolution responses the system receives from authoritative sources.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for configuring customer-deployed resources to request and perform data origin authentication and data integrity verification on name/address resolution responses received from authoritative sources. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-22

#### Architecture and Provisioning for Name / Address Resolution Service

**SC-22** The information systems that collectively provide name/address resolution service for an organization are fault-tolerant and implement internal/external role separation.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for ensuring that the systems providing address resolution services for customer-deployed resources are fault-tolerant and implement internal/external role separation. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-23

#### Session Authenticity

**SC-23** The information system protects the authenticity of communications sessions.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Remote access to resources deployed by this Azure Blueprint, including the Azure portal, remote desktop connection, and web application gateway, are secured using TLS. TLS provides authenticity for communications at the session level. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-23 (1)

#### Session Authenticity | Invalidate Session Identifiers at Logout

**SC-23 (1)** The information system invalidates session identifiers upon user logout or other session termination.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Remote access to resources deployed by this Azure Blueprint, including the Azure portal, remote desktop connection, and web application gateway, are secured using TLS. The Azure portal and remote desktop sessions invalidate session identifiers upon logout. Web session invalidation is enforced through Azure Application Gateway - Web Application Firewall (WAF) rules. The WAF applies cookie affinity per session and performs session timeout after 30 minutes (configurable post deployment to organization specific rules) of inactivity from the client. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-24

#### Fail in Known State

**SC-24** The information system fails to a [Assignment: organization-defined known-state] for [Assignment: organization-defined types of failures] preserving [Assignment: organization-defined system state information] in failure.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The customer is responsible for ensuring customer-deployed resources fail in a known-state. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-28

#### Protection of Information at Rest

**SC-28** The information system protects the [Selection (one or more): confidentiality; integrity] of [Assignment: organization-defined information at rest].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | SC-28 (1) implementation satisfies this control requirement. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ### NIST 800-53 Control SC-28 (1)

#### Protection of Information at Rest | Cryptographic Protection

**SC-28 (1)** The information system implements cryptographic mechanisms to prevent unauthorized disclosure and modification of [Assignment: organization-defined information] on [Assignment: organization-defined information system components].

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | Virtual machines deployed by this Azure Blueprint implement disk encryption to protect the confidentiality and integrity of information at rest. Azure disk encryption for Windows is implemented using the BitLocker feature of Windows. SQL Server is configured to use Transparent Data Encryption (TDE), which performs real-time encryption and decryption of data and log files to protect information at rest. TDE provides assurance that stored data has not been subject to unauthorized access. Customer may elect to implement additional application-level controls to protect the integrity of stored information. Confidentiality and integrity of all storage blobs deployed by this Azure Blueprint are protected through use of Azure Storage Service Encryption (SSE). SSE safeguards data at rest within Azure storage accounts using 256-bit AES encryption. |
| **Provider (Microsoft Azure)** | Not Applicable |


 ## NIST 800-53 Control SC-39

#### Process Isolation

**SC-39** The information system maintains a separate execution domain for each executing process.

**Responsibilities:** `Customer Only`

|||
|---|---|
| **Customer** | The virtual machines deployed by this Azure Blueprint run Windows operating systems. Windows maintains separate execution domains for each executing process by assigning a private virtual address space to each process. |
| **Provider (Microsoft Azure)** | Not Applicable |
