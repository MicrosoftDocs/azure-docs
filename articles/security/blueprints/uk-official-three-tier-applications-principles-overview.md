---

title: Azure Blueprint Automation - National Cyber Security Centre Cloud Security Principles overview
description: Azure Blueprint Automation - National Cyber Security Centre Cloud Security Principles overview
services: security
documentationcenter: na
author: jomolesk
manager: mbaldwin
editor: tomsh

ms.assetid: 49652fd9-b8c6-4a88-bc5e-0b58a0260ed6
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/17/2017
ms.author: jomolesk

---

# National Cyber Security Centre Cloud Security Principles overview


> [!NOTE]
> These security principles are defined by the UK National Cyber Security Centre (NCSC). Please refer to [NCSC documentation](https://www.ncsc.gov.uk/guidance/implementing-cloud-security-principles) for information on testing procedures and guidance for each security principle.



## NCSC Cloud Security Principle 1
### Data in Transit Protection
User data transiting networks should be adequately protected against tampering and eavesdropping.

This should be achieved through a combination of:

- network protection - denying your attacker the ability to intercept data
- encryption - denying your attacker the ability to read data


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | This Azure Blueprint configures resources to communicate using only secure protocols. The WAF component of the Application Gateway is configured to accept communicators from external uses over HTTPS/TLS and communicate with the backend pool only over HTTPS/TLS. Remote Desktop services are configured to use secure connections. VPN is used to secure web traffic between AppGateway and Azure. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Azure uses the industry-standard Transport Layer Security (TLS) 1.2 protocol with 2048-bit RSA/SHA256 encryption keys, as recommended by CESG/NCSC, to encrypt communications both between the customer and the cloud, and internally between Azure systems and datacentres. For example, when administrators use the Microsoft Azure Portal to manage the service for their organization, the data transmitted between the portal and the administrator's device is sent over an encrypted TLS channel. When an email user connects to Outlook.com using a standard web browser, the HTTPS connection provides a secure channel for receiving and sending email.<br /> <br /> Azure offers its customers a range of options for securing their own data and traffic. The certificate management features built into Azure give administrators flexibility for configuring certificates and encryption keys for management systems, individual services, secure shell (SSH) sessions, virtual private network (VPN) connections, remote desktop (RDP) connections, and other functions. <br /><br /> Developers can use the cryptographic service providers (CSPs) built into the Microsoft .NET Framework to access Advanced Encryption Standard (AES) algorithms, along with Secure Hash Algorithm (SHA-2) functionality to handle such tasks as validating digital signatures. Azure Key Vault helps customers safeguard cryptographic keys and secrets by storing them in hardware security modules (HSMs). |


 ## NCSC Cloud Security Principle 2
### Asset Protection and Resilience
User data, and the assets storing or processing it, should be protected against physical tampering, loss, damage or seizure.

The aspects to consider are:

1. Physical Location and Legal Jurisdiction
2. Datacentre Security
3. Data at Rest Protection
4. Data Sanitisation
5. Equipment Disposal
6. Physical Resilience and Availability


 ## NCSC Cloud Security Principle 2.1
### Physical Location and Legal Jurisdiction
In order to understand the legal circumstances under which your data could be accessed without your consent you must identify the locations at which it is stored, processed and managed.
You will also need to understand how data-handling controls within the service are enforced, relative to UK legislation. Inappropriate protection of user data could result in legal and regulatory sanction, or reputational damage.


**Responsibilities:** `Customer`

> [!NOTE]
> Azure services are deployed regionally, and customers can configure certain Azure services to store customer data only in a single region. Microsoft Azure provides a list of globally available datacentres in order to provide availability and reliability on a global scale. All Azure datacentres have been certified against the ISO/IEC 27001:2013. The UK Geo consists of 2 regions: UK South and UK West.

|||
|---|---|
| **Customer** | This Azure Blueprint prompts the administrator for which region to deploy Azure resources to. The recommended regions for deployment are UK South or UK West. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Not Applicable |


 ## NCSC Cloud Security Principle 2.2
### Datacentre Security
Locations used to provide cloud services need physical protection against unauthorised access, tampering, theft or reconfiguration of systems. Inadequate protections may result in the disclosure, alteration or loss of data.


**Responsibilities:** `Microsoft Azure`


|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacentres; datacentre security protection measures are implemented and managed by Microsoft Azure. This principle is inherited from Microsoft Azure. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Microsoft Azure implements this principle on behalf of customers. Microsoft Azure runs in geographically distributed Microsoft facilities, sharing space and utilities with other Microsoft online services. Each facility is designed to run 24x7x365 and employs various industry-standard measures to help protect operations from power failure, physical intrusion, and network outages. These datacentres comply with industry standards (such as ISO 27001) for physical security and availability. They are managed, monitored, and administered by Microsoft operations personnel. <br /> <br /> Azure customers can be confident that physical security controls are in place at all Azure datacentres due to Azure holding certificates at all datacentres for the ISO/IEC 27001:2013 standard. The UK Geo consists of 2 regions: UK South and UK West. |


 ## NCSC Cloud Security Principle 2.3
### Data at Rest Protection
To ensure data is not available to unauthorised parties with physical access to infrastructure, user data held within the service should be protected regardless of the storage media on which it's held. Without appropriate measures in place, data may be inadvertently disclosed on discarded, lost or stolen media.


**Responsibilities:** `Shared`

> [!NOTE]
> All encryption solutions that Microsoft Azure provides to its customers easily integrate with Azure Key Vault, which allows for easy management of encryption keys.

|||
|---|---|
| **Customer** | Confidentiality and integrity of all blob storage deployed by this Azure Blueprint solution is protected through use of Azure Storage Service Encryption (SSE). SSE safeguards data at rest within Azure storage accounts using 256-bit AES encryption. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Azure offers a wide range of encryption capabilities, giving customers the flexibility to choose the solution that best meets their needs. Azure Key Vault helps customers easily and cost effectively maintain control of keys used by cloud applications and services to encrypt data. Azure Disk Encryption enables customers to encrypt virtual machines. Azure Storage Service Encryption makes it possible to encrypt all data placed into a customer's storage account. |


 ## NCSC Cloud Security Principle 2.4
### Data Sanitisation
The process of provisioning, migrating and de-provisioning resources should not result in unauthorised access to user data.

Inadequate sanitization of data could result in:

- User data being retained by the service provider indefinitely
- User data being accessible to other users of the service as resources are reused
- User data being lost or disclosed on discarded, lost or stolen media.


**Responsibilities:** `Microsoft Azure`


|||
|---|---|
| **Customer** | Microsoft Azure provides contractual assurances regarding permanent data deletion in Azure. As such, this principle is inherited from Microsoft Azure. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Microsoft Azure follows the NIST SP800-88r1 disposal process with data classification aligned to FIPS-199 Moderate. NIST provides for Secure Erase approach (via hard drive firmware) for drives that support it. For hard drives that can't be wiped Microsoft destroys them and renders the recovery of information impossible (e.g., disintegrate, shred, pulverize, or incinerate). The appropriate means of disposal is determined by the asset type. Records of the destruction are retained. All Microsoft Azure services utilize approved media storage and disposal management services. <br />  <br /> Upon expiration or termination of a service subscription, the customer may contact Microsoft and tell them whether to: <br /><br /> (1) Disable the customer's account and then delete the customer data; or <br /> (2) Retain the data stored in the online service in a limited function account for at least 90 days after expiration or termination of customer's subscription (the "retention period") so that customer may extract the data. Following the expiration of the retention period, Microsoft will disable the customer's account and delete all data. Cached or backup copies will be purged within 30 days of the end of the retention period. |


 ## NCSC Cloud Security Principle 2.5
### Equipment Disposal
Once equipment used to deliver a service reaches the end of its useful life, it should be disposed of in a way which does not compromise the security of the service, or user data stored in the service.


**Responsibilities:** `Microsoft Azure`


|||
|---|---|
| **Customer** | Customers do not have physical access to any system resources in Azure datacentres; equipment disposal procedures are implemented and managed by Microsoft Azure. This principle is inherited from Microsoft Azure. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Microsoft Azure implements this principle on behalf of customers. Upon a system's end-of-life, Microsoft operational personnel follow rigorous data handling procedures and hardware disposal processes to help assure that no hardware that may contain customer data is made available to untrusted parties. Microsoft Azure follows the NIST SP800-88r1 disposal process with data classification aligned to FIPS-199 Moderate. NIST provides for Secure Erase approach (via hard drive firmware) for drives that support it. For hard drives that can't be wiped Microsoft destroys them and renders the recovery of information impossible (e.g., disintegrate, shred, pulverize, or incinerate). The appropriate means of disposal is determined by the asset type. Records of the destruction are retained. All Microsoft Azure services utilize approved media storage and disposal management services. |


 ## NCSC Cloud Security Principle 2.6
### Physical Resilience and Availability
Services have varying levels of resilience, which will affect their ability to operate normally in the event of failures, incidents or attacks. A service without guarantees of availability may become unavailable, potentially for prolonged periods, regardless of the impact on your business.


**Responsibilities:** `Shared`

> [!NOTE]
> If the customer configures Microsoft Azure appropriately by enabling Azure Site Recovery and alternative storage of data at another geo-graphically located datacentre, Microsoft Azure can support the continued operation of customer-deployed resources.

|||
|---|---|
| **Customer** | The customer is responsible for establishing an alternate storage site. The customer control implementation statement should address the customer's ability to operate in the event of an incident. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Microsoft Azure has UK National Cyber Security Centre (NCSC) approved datacentres in different geographical locations (UK South and UK West) in order to provide resilience and availability. It will be the customer's responsibility to reserve capacity in an alternate region using Azure's Site Recovery service. Once they have configured Azure Site Recovery, Azure will start and stop the customer's services in a seamless transition to the alternate processing site. |


 ## NCSC Cloud Security Principle 3
### Separation Between Users
A malicious or compromised user of the service should not be able to affect the service or data of another.

Factors affecting user separation include:

- where the separation controls are implemented - this is heavily influenced by the service model (e.g. IaaS, PaaS, SaaS)
- who you are sharing the service with - this is dictated by the deployment model (e.g. public, private or community cloud)
- the level of assurance available in the implementation of separation controls

> [!NOTE]
> In an IaaS service you should consider separation provided by compute, storage and networking components. Also, SaaS and PaaS services built upon IaaS may inherit some of the separation properties of the underlying IaaS infrastructure.

**Responsibilities:** `Microsoft Azure`


|||
|---|---|
| **Customer** | Microsoft Azure ensures isolation for each user to prevent one malicious or compromised user from affecting the service or data of another. As such, this principle is inherited from Microsoft Azure. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Due to customer cloud servers being virtual, the physical separation paradigm no longer applies. Microsoft Azure was designed to help identify and counter risks inherent in a multitenant environment. Data storage and processing is logically segregated among users of Azure using Active Directory and functionality specifically developed for multitenant services, which aims to ensure that user data stored in shared Azure datacentres is not accessible by another organization. <br /> <br /> Fundamental to any shared cloud architecture is the isolation provided for each user to prevent one malicious or compromised user from affecting the service or data of another. <br /> <br /> For more information regarding Microsoft tenant separation please see the full description in the [Azure Blueprint - NCSC Cloud Security Principles - Customer Responsibilities Matrix](https://aka.ms/blueprintuk-gcrm). |


 ## NCSC Cloud Security Principle 4
### Governance Framework
The service provider should have a security governance framework which coordinates and directs its management of the service and information within it. Any technical controls deployed outside of this framework will be fundamentally undermined.
Having an effective governance framework will ensure that procedure, personnel, physical and technical controls continue to work through the lifetime of a service. It should also respond to changes in the service, technological developments and the appearance of new threats.


**Responsibilities:** `Microsoft Azure`


|||
|---|---|
| **Customer** | Microsoft Azure maintains a documented security governance framework for Azure services. As such, this principle is inherited from Microsoft Azure. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | The Microsoft compliance framework includes a standard methodology for defining compliance domains, determining which objectives apply to a given team or asset, and capturing how domain control objectives are addressed in sufficient detail as they apply to a given set of industry standards, regulations, or business requirements. The framework maps controls to multiple regulatory standards, which enables Microsoft to design and build services using a common set of controls, thereby streamlining compliance across a range of regulations today and as they evolve in the future. <br /> <br /> Microsoft compliance processes also make it easier for customers to achieve compliance across multiple services and meet their changing needs efficiently. Together, security-enhancing technology and effective compliance processes enable Microsoft to maintain and expand a rich set of third-party certifications. These certifications help customers demonstrate compliance readiness to their customers, auditors, and regulators. <br /> <br />  Azure complies with a broad set of international as well as regional and industry-specific compliance standards, such as ISO 27001, FedRAMP, SOC 1, and SOC 2. Compliance with the strict security controls contained in these standards is verified by rigorous third-party audits that demonstrate Azure services work with and meet world-class industry standards, certifications, attestations, and authorizations. <br /> <br /> Azure is designed with a compliance strategy that helps customers address business objectives as well as industry standards and regulations. The security compliance framework includes test and audit phases, security analytics, risk management best practices, and security benchmark analysis to achieve certificates and attestations. <br /> <br /> For more information regarding Microsoft's adherence to compliance frameworks please see the full description in the [Azure Blueprint - NCSC Cloud Security Principles - Customer Responsibilities Matrix](https://aka.ms/blueprintuk-gcrm).|


 ## NCSC Cloud Security Principle 5
### Operational Security
The service needs to be operated and managed securely in order to impede, detect or prevent attacks. Good operational security should not require complex, bureaucratic, time consuming or expensive processes.

There are four elements to consider:

- Configuration and Change Management - you should ensure that changes to the system have been properly tested and authorised. Changes should not unexpectedly alter security properties
- Vulnerability Management - you should identify and mitigate security issues in constituent components
- Protective Monitoring - you should put measures in place to detect attacks and unauthorised activity on the service
- Incident Management - ensure you can respond to incidents and recover a secure, available service




 ## NCSC Cloud Security Principle 5.1
### Configuration and Change Management
You should have an accurate picture of the assets which make up the service, along with their configurations and dependencies.
Changes which could affect the security of the service should be identified and managed. Unauthorised changes should be detected.
Where change is not effectively managed, security vulnerabilities may be unwittingly introduced to a service. And even where there is awareness of the vulnerability, it may not be fully mitigated.


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | The Azure Resource Manager templates and accompanying resources that comprise this Azure Blueprint represent a "configuration as code" baseline for the deployed architecture. The solution is provided though GitHub, which can be used for configuration control. <br /> <br /> Azure Active Directory account privileges are implemented using role-based access control by assigning users to roles providing strict control over which users can view and control deployed resources. Active Directory account privileges are implemented using role-based access control by assigning users to security groups. These security groups control the actions that users can take with respect to operating system configuration. These role-based schemes can be extended by the customer to meet mission needs. <br /> <br /> In order to be compliant with this principle, further configuration is required by the customer for use in production. As such, these configurations will need to be a part of the customer's change management process. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Microsoft Azure reviews and updates configuration settings and baseline configurations of hardware, software and network devices annually. Changes are developed, tested, and approved prior to entering the production environment from a development and/or test environment. <br /> <br />Microsoft Azure applies baseline configurations using the change and release process for Microsoft Azure software components (e.g. OS, Fabric, RDFE, XStore, etc.) and bootstrap configuration process for hardware and network device components entering Microsoft Azure production environment as outlined below. <br /> <br /> The baseline configurations required for Azure-based services are reviewed by the Azure Security and Compliance team and by service teams as part of testing prior to deployment of their production service. |


 ## NCSC Cloud Security Principle 5.2
### Vulnerability Management
Service providers should have a management processes in place to identify, triage and mitigate vulnerabilities. Services which don't, will quickly become vulnerable to attack using publicly known methods and tools.


**Responsibilities:** `Customer`


|||
|---|---|
| **Customer** | The customer is responsible for vulnerability scanning on customer-deployed resources (to include applications, operating systems, databases, and software). The customer implementation statement should address the tools used to perform the vulnerability scans. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Security update management helps protect systems from known vulnerabilities. Azure uses integrated deployment systems to manage the distribution and installation of security updates for Microsoft software. Azure is also able to draw on the resources of the Microsoft Security Response Centre (MSRC), which identifies, monitors, responds to, and resolves security incidents and cloud vulnerabilities around the clock, each day of the year. |


 ## NCSC Cloud Security Principle 5.3
### Protective Monitoring
A service which does not effectively monitor for attack, misuse and malfunction will be unlikely to detect attacks (both successful and unsuccessful). As a result, it will be unable to quickly respond to potential compromises of your environments and data.


**Responsibilities:** `Customer`


|||
|---|---|
| **Customer** | The customer is responsible for monitoring customer-deployed resources (to include applications, operating systems, databases, and software). The customer control implementation statement should address the mechanisms to monitor, detect, and respond to attacks, misuse, and malfunction. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Microsoft Azure Security has defined requirements for active monitoring. Service teams configure active monitoring tools in accordance with these requirements. Active monitoring tools include the Monitoring Agent (MA) and System Centre Operations Manager (SCOM), which are configured to provide real time alerts to Microsoft Azure Security personnel in situations that require immediate action. |


 ## NCSC Cloud Security Principle 5.4
### Incident Management
Unless carefully pre-planned incident management processes are in place, poor decisions are likely to be made when incidents do occur, potentially exacerbating the overall impact on users.
These processes needn't be complex or require large amounts of description, but good incident management will minimise the impact to users of security, reliability and environmental issues with a service.


**Responsibilities:** `Shared`

> [!NOTE]
> In cases where customer security incidents may affect the security status of Microsoft Azure, the customer is responsible for notifying Microsoft Azure.

|||
|---|---|
| **Customer** | The customer is responsible for establishing an incident management process for customer-deployed resources (to include applications, operating systems, databases, and software). The customer implementation statement should address reporting incidents and alerts, supporting timely incident responses, and forwarding information to the PGA and other HMG organizations as appropriate. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Microsoft has implemented a security incident management process to facilitate a coordinated response to incidents should one occur. <br /> <br /> If Microsoft becomes aware of any unauthorized access to any customer data stored on its equipment or in its facilities, or unauthorized access to such equipment or facilities resulting in loss, disclosure, or alteration of customer data, Microsoft has stated that it will: <br /> <br />   - Promptly notify the customer of the security incident; <br /> - Promptly investigate the security incident and provide the customer with detailed information about the security incident; and <br /> - Take reasonable and prompt steps to mitigate the effects and minimize a damage resulting from the security incident.  <br />  <br /> An incident management framework has been established with roles defined and responsibilities allocated. The Windows Azure Security Incident Management (WASIM) team is responsible for managing security incidents, including escalation and ensuring the involvement of specialist teams when necessary. Azure Operations Managers are responsible for overseeing investigation and resolution of security and privacy incidents with support from other functions. <br /> <br /> For more information regarding Microsoft's Incident Response processes please see the full description in the [Azure Blueprint - NCSC Cloud Security Principles - Customer Responsibilities Matrix](https://aka.ms/blueprintuk-gcrm). |


 ## NCSC Cloud Security Principle 6
### Personnel Security
Where service provider personnel have access to your data and systems you need a high degree of confidence in their trustworthiness. Thorough screening, supported by adequate training, reduces the likelihood of accidental or malicious compromise by service provider personnel.
The service provider should subject personnel to security screening and regular security training. Personnel in these roles should understand their responsibilities. Providers should make clear how they screen and manage personnel within privileged roles.


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | The customer is responsible for screening individuals and providing regular security training for individuals with access to customer-deployed resources. The customer implementation statement should address the screening criteria for roles and the frequency of security training. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Microsoft Azure personnel who operate Azure services and provide customer support (or Microsoft subcontractors who assist with platform operations, troubleshooting, and technical support) undergo a Microsoft standard background (or equivalent) check to evaluate employee education, employment, and criminal history. The background checks are broadly in line with the requirements of the UK Government's BPSS/BS7858. They do not specifically include a formal identity check.  <br /> <br /> Microsoft includes nondisclosure provisions in its employee and subcontractor contracts. All appropriate Microsoft employees and subcontractors take part in a Microsoft Azure sponsored security-training program that informs staff of their responsibilities for information security. <br /> <br /> Microsoft Azure services staff or subcontractors suspected of committing breaches of security and/or violating the Information Security Policy are subject to an investigation process and appropriate disciplinary action up to and including termination. If the circumstances warrant it, Microsoft may refer the matter for prosecution by a law enforcement agency. <br /> <br /> To supplement this system of background checks and security education, Microsoft deploys combinations of preventive, defensive, and reactive controls to help protect against unauthorized developer and/or administrative activity, including the following mechanisms: <br />  <br /> - Tight access controls on sensitive data, including a requirement for two-factor smartcard-based authentication to perform sensitive operations. <br /> - Combinations of controls that enhance independent detection of malicious activity. <br /> - Multiple levels of monitoring, logging, and reporting. |


 ## NCSC Cloud Security Principle 7
### Secure Development
Services should be designed and developed to identify and mitigate threats to their security. Those which aren't may be vulnerable to security issues which could compromise your data, cause loss of service or enable other malicious activity.


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | The virtual machines deployed by this Azure Blueprint run Windows operating systems. Windows provides real-time file integrity validation, protection, and recovery of core system files that are installed as part of Windows or authorized Windows system updates through the Windows Resource Protection (WRP) capability, which enables real-time integrity checking. <br /> <br /> Windows has protections in place for preventing code execution in restricted memory locations: No Execute (NX), Address Space Layout Randomization (ASLR), and Data Execution Prevention (DEP). <br /> <br /> This Azure Blueprint deploys host-based antimalware protections for all deployed Windows virtual machines implemented using the Microsoft Windows Defender. Windows Defender is configured to automatically update both the antimalware engine and protection signatures as release become available. <br /> <br /> In order to be compliant with this principle, further configuration is required by the customer for use in production. As such, these configurations will need to be a part of the customer's secure development process. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | The Microsoft Security Development Lifecycle (SDL) provides an effective threat-modelling process to identify threats and vulnerabilities in software and services. Threat modelling is a team exercise, encompassing the operations manager, program/project managers, developers, and testers, and represents a key security analysis task performed for solution design. Team members use the SDL Threat Modelling Tool to model all services and projects, both when they are built and when they are updated with new features and functionality. Threat models cover all code exposed on the attack surface and all code written by or licensed from a third party, and consider all trust boundaries. The STRIDE system (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, and Elevation of privilege) is used to help identify and resolve security threats early in the design process, before they can affect customers. |


 ## NCSC Cloud Security Principle 8
### Supply Chain Security
The service provider should ensure that its supply chain satisfactorily supports all of the security principles which the service claims to implement.
Cloud services often rely upon third party products and services. Consequently, if this principle is not implemented, supply chain compromise can undermine the security of the service and affect the implementation of other security principles.


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | The customer is responsible for providing secure supply chain documentation for any third-party acquired software and operating systems used in their Azure subscription. The customer implementation statement should address the exception to follow processes identified by this supply chain documentation. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | The Microsoft Cloud Supply Chain (MCSC) group consists of six unique teams each contributing to protecting Azure from threats to the Supply Chain.  <br />  <br /> - Procurement <br /> - Customer Operations <br /> - Deployment Quality <br /> - Supplier Relationship Management <br /> - Spares <br />  <br /> For more information regarding Microsoft's MCSC group please see the full description in the [Azure Blueprint - NCSC Cloud Security Principles - Customer Responsibilities Matrix](https://aka.ms/blueprintuk-gcrm). |


 ## NCSC Cloud Security Principle 9
### Secure User Management
Your provider should make the tools available for you to securely manage your use of their service. Management interfaces and procedures are a vital part of the security barrier, preventing unauthorised access and alteration of your resources, applications and data.

The aspects to consider are:

- Authentication of users to management interfaces and support channels
- Separation and access control within management interfaces



 ## NCSC Cloud Security Principle 9.1
### Authentication of Users to Management Interfaces and within Support Channels
In order to maintain a secure service, users need to be properly authenticated before being allowed to perform management activities, report faults or request changes to the service.
These activities may be conducted through a service management web portal, or through other channels, such as telephone or email. They are likely to include such functions as provisioning new service elements, managing user accounts and managing user data.
Service providers need to ensure that all management requests which could have a security impact are performed over secure and authenticated channels. If users are not strongly authenticated then an imposter may be able to successfully perform privileged actions, undermining the security of the service or data.


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | When administrators access the Microsoft Azure Portal to manage Azure resources for their organization, the data transmitted between the portal and the administrator's device is sent over an encrypted Transport Layer Security (TLS) channel using 2048-bit RSA/SHA256 encryption keys, as recommended by CESG/NCSC.  <br /> <br /> This Azure Blueprint employs Windows authentication, remote desktop, and BitLocker. These components can be configured to rely on FIPS 140 validated cryptographic modules. <br /> <br /> This Azure Blueprint enforces logical access authorizations using role-based access control enforced by Azure Active Directory by assigning users to roles, Active Directory by assigning users to security groups, and Windows OS-level controls. Azure Active Directory roles assigned to users or groups control logical access to resources within Azure at the resource, group, or subscription level. Active Directory security groups control logical access to OS-level resources and functions. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Customers administer their Azure resources through the Azure portal, which provides access to all virtual machines, databases, cloud services, and other resources configured for the customer's account. Web access to the Azure portal is secured by industry-standard Transport Layer Security (TLS) 1.2 connections using 2048-bit RSA/SHA256 encryption keys, as recommended by CESG/NCSC. Role-based access controls are provided to enable customers to provide limited access to Azure management resources for specific users and groups. |


 ## NCSC Cloud Security Principle 9.2
### Separation and Access Control within Management Interfaces
Many cloud services are managed via web applications or APIs. These interfaces are a key part of the service's security. If users are not adequately separated within management interfaces, one user may be able to affect the service, or modify the data of another.
Your privileged administrative accounts probably have access to large volumes of data. Constraining the permissions of individual users to those absolutely necessary can help to limit the damage caused by malicious users, compromised credentials or compromised devices.
Role-based access control provides a mechanism to achieve this and is likely to be a particularly important capability for users managing larger deployments.
Exposing management interfaces to less accessible networks (e.g. community rather than public networks) makes it more difficult for attackers to reach and attack them, as they would first need to gain access to one of these networks. Guidance on assessing the risks of exposing interfaces to different types of networks is provided under Principle 11.


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | This Azure Blueprint deploys an Application Gateway, load balancer, and configures network security group rules to control commutations at external boundaries and between internal subnets. User functionality is separated from system management functionality through enforcement of logical access controls and system architecture. Interfaces for system management functionality are separate from user interfaces. All management connectivity is through a secure bastion host (jumpbox) located in a management subnet with network security group rules to limit access to production resources as appropriate. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | As outlined in separation between user's separation is built into Azure at its core. Azure Active Directory (Azure AD or AAD) can be used to provide every user who authenticates to the Azure portal with access to only the resources they are entitled to see and manage. As a result, different customer accounts are strictly segregated from one another when managed through the common Azure portal. |


 ## NCSC Cloud Security Principle 10
### Identity and Authentication
All access to service interfaces should be constrained to authenticated and authorised individuals.
Weak authentication to these interfaces may enable unauthorised access to your systems, resulting in the theft or modification of your data, changes to your service, or a denial of service.
Importantly, authentication should occur over secure channels. Email, HTTP or telephone are vulnerable to interception and social engineering attacks.


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | This Azure Blueprint employs Active Directory for account management. Access to resources deployed by this Azure Blueprint is protected from replay attacks by the built-in Kerberos functionality of Azure Active Directory, Active Directory, and the Windows operating system. In Kerberos authentication, the authenticator sent by the client contains additional data, such as an encrypted IP list, client timestamps, and ticket lifetime. If a packet is replayed, the timestamp is checked. If the timestamp is earlier than, or the same as a previous authenticator, the packet is rejected. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Azure provides services to help track identity as well as integrate it with identity stores that may already be in use. Azure AD is a comprehensive identity and access management service for the cloud that helps secure access to data in on-premises and cloud applications. Azure AD also simplifies the management of users and groups by combining core directory services, advanced identity governance, security, and application access management. |


 ## NCSC Cloud Security Principle 11
### External Interface Protection
All external or less trusted interfaces of the service should be identified and appropriately defended.
If some of the interfaces exposed are private (such as management interfaces) then the impact of compromise may be more significant.
You can use different models to connect to cloud services which expose your enterprise systems to varying levels of risk.


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | This Azure Blueprint deploys resources in an architecture with a separate web subnet, database subnet, Active Directory subnet, and management subnet. Subnets are logically separated by network security group rules applied to the individual subnets to restrict traffic between subnets to only that necessary for system and management functionality (e.g., external traffic cannot access the database, management, or Active Directory subnets).  <br /> <br /> An Application Gateway is deployed to manage external connections to a customer-deployed web application. External connections for management access are restricted to a jumpbox (bastion host) deployed in a management subnet with network security rules applied to restrict external connections to authorized IP addresses. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Microsoft employs a method it calls "Red Teaming" to improve Azure security controls and processes through regular penetration testing. The Red Team is a group of full-time staff within Microsoft that focuses on performing targeted and persistent attacks against Microsoft infrastructure, platforms, and applications, but not end-customers' applications or data. <br /> <br /> For more information regarding Microsoft's Red Teaming as well as a description of Blue Teaming efforts please see the full description in the [Azure Blueprint - NCSC Cloud Security Principles - Customer Responsibilities Matrix](https://aka.ms/blueprintuk-gcrm).  |


 ## NCSC Cloud Security Principle 12
### Secure Service Administration
Systems used for administration of a cloud service will have highly privileged access to that service. Their compromise would have significant impact, including the means to bypass security controls and steal or manipulate large volumes of data.
The design, implementation and management of administration systems should follow enterprise good practice, whilst recognising their high value to attackers.


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | The customer is responsible for ensuring a secure workstation for administration of their Azure subscription and customer-deployed resources (to include applications, operating systems, databases, and software). The customer implementation statement should address the mechanisms used to mitigate risk of exploitation of the customer-deployed resources. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Microsoft Azure operations personnel are required to use secure admin workstations (SAWs; also, known as privileged access workstations, or PAWs). The SAW approach is an extension of the well-established recommended practice to use separate admin and user accounts for administrative personnel. This practice uses an individually assigned administrative account that is completely separate from the user's standard user account. SAW builds on that account separation practice by providing a trustworthy workstation for those sensitive accounts. |


 ## NCSC Cloud Security Principle 13
### Audit Information for Users
You should be provided with the audit records needed to monitor access to your service and the data held within it. The type of audit information available to you will have a direct impact on your ability to detect and respond to inappropriate or malicious activity within reasonable timescales.


**Responsibilities:** `Shared`


|||
|---|---|
| **Customer** | Events audited by this Azure Blueprint include those audited by Azure activity logs for deployed resources, OS-level logs, and Active Directory logs. These event logs include information sufficient to determine when events occur, the source of the event, the outcome of the event, and other detailed information that supports investigation of security incidents. Customers may select additional events to be audited to meet mission needs. All Azure resources have audit logs available in the Azure Portal. |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Azure Log Analytics collects records of the events occurring within an organization's systems and networks as soon as they occur, before anyone can tamper with them, and allows different types of analysis by correlating data across multiple computers. Azure enables customers to perform security event generation and collection from Azure IaaS and PaaS roles to central storage in their subscriptions. These collected events can be exported to on-premises security information and event management (SIEM) systems for ongoing monitoring. After the data is transferred to storage, there are many options to view the diagnostic data. <br /> <br /> Azure built-in diagnostics can help with debugging. For applications that are deployed in Azure, a set of operating system security events are enabled by default. Customers can add, remove, or modify events to be audited by customizing the operating system audit policy. <br /> <br /> At a high level, it is quite easy and simple to begin collecting logs using Windows Event Forwarding (WEF) or the more advanced Azure Diagnostics when Windows-based VMs are deployed using IaaS in Azure. In addition, Azure Diagnostics can be configured to collect logs and events from PaaS role instances. When using IaaS-based VMs, a customer simply configures and enables the desired security events the same way they enable Windows Servers to log audits in their on-premises datacentre. For web applications, it's also possible to enable IIS logging if that is the primary application and deployment in Azure. Customers can always store security data in storage accounts in supported geo-locations of their choice to meet data sovereignty requirements. |


 ## NCSC Cloud Security Principle 14
### Secure Use of the Service
The security of cloud services and the data held within them can be undermined if you use the service poorly. Consequently, you will have certain responsibilities when using the service in order for your data to be adequately protected.
The extent of your responsibility will vary depending on the deployment models of the cloud service, and the scenario in which you intend to use the service. Specific features of individual services may also have bearing. For example, how a content delivery network protects your private key, or how a cloud payment provider detects fraudulent transactions, are important security considerations over and above the general considerations covered by the cloud security principles.  
With IaaS and PaaS offerings, you are responsible for significant aspects of the security of your data and workloads. For example, if you procure an IaaS compute instance, you will normally be responsible for installing a modern operating system, configuring that operating system securely, securely deploying any applications and also maintaining that instance through applying patches or performing maintenance required.


**Responsibilities:** `Customer`

> [!NOTE]
> The customer can use the Azure Security Centre to help prevent, detect, and respond to threats with increased visibility and control over the security of Azure resources. The Azure Security Centre provides integrated security monitoring and policy management across Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

|||
|---|---|
| **Customer** | The Azure Resource Manager templates and accompanying resources that comprise this Azure Blueprint follow a defence-in-depth approach to security. In order to be compliant with this principle, further configuration is required by the customer for use in production (e.g., database management software, web application deployment). |
| **Provider&nbsp;(Microsoft&nbsp;Azure)** | Not Applicable |

## Disclaimer

 - This document is for informational purposes only. MICROSOFT MAKES NO WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, AS TO THE INFORMATION IN THIS DOCUMENT. This document is provided "as-is." Information and views expressed in this document, including URL and other Internet website references, may change without notice. Customers reading this document bear the risk of using it.
 - This document does not provide customers with any legal rights to any intellectual property in any Microsoft product or solutions.
 - Customers may copy and use this document for internal reference purposes.
 - Certain recommendations in this document may result in increased data, network, or compute resource usage in Azure, and may increase a customer's Azure license or subscription costs.
 - This architecture is intended to serve as a foundation for customers to adjust to their specific requirements and should not be used as-is in a production environment.
 - This document is developed as a reference and should not be used to define all means by which a customer can meet specific compliance requirements and regulations. Customers should seek legal support from their organization on approved customer implementations.