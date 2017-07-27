---
title: Azure Government Compliance | Microsoft Docs
description: Provides and overview of the available compliance services for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: jomolesk
manager: zakramer

ms.assetid: 1d2e0938-482f-4f43-bdf6-0a5da2e9a185
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 12/07/2016
ms.author: jomolesk

---
# Azure Government compliance

## Azure Blueprint

The Azure Blueprint program is designed to facilitate the secure and compliant use of Azure for government agencies and third-party providers building on behalf of government. Azure Government customers may leverage Azure Government’s FedRAMP JAB Provisional Authority to Operate (P-ATO) or DoD Provisional Authorization (PA), reducing the scope of customer-responsibility security controls in Azure-based systems. Inheriting security control implementations from Azure Government allows customers to focus on control implementations specific to their IaaS, PaaS, or SaaS environments built in Azure.

> [!NOTE]
> Within the context of Azure Blueprint, "customer" references the organization building directly within Azure. Azure customers may include third-party ISVs building on behalf of government or government agencies building directly in Azure.

## Blueprint Customer Responsibilities Matrix

The Azure Blueprint Customer Responsibilities Matrix (CRM) is designed to aid Azure Government customers implementing and documenting system-specific security controls implemented within Azure. The CRM explicitly lists all [NIST SP 800-53](http://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r4.pdf) security control requirements for FedRAMP and DISA baselines that include a customer implementation requirement. This includes controls with a shared responsibility between Azure and Azure customers, as well as controls that must be fully implemented by Azure customers. Where appropriate, controls are delineated at a control sub-requirement granularity to provide more specific guidance.

The CRM format is designed for utility and is conducive to focused documentation of only the customer portions of implemented security controls.

For example, control AC-1 requires documented access control policies and procedures for the system seeking an ATO. For this control, Microsoft has internal Azure-specific policies and procedures regarding access control mechanisms used to manage the Azure infrastructure and platform. Customers must also create their own access control policies and procedures used within their specific system built in Azure. The CRM documents control parts AC-1a, which requires the policies and procedures to include specific content, as well as AC-1b, which requires customers to review and update these documents on an annual basis.

The Blueprint CRM is available as Microsoft Excel workbook for the FedRAMP Moderate and High baselines, the DISA Cloud Computing SRG L4 and L5 baselines, and the NIST Cybersecurity Framework (CSF).

To request a copy of the Azure Blueprint CRM or to provide feedback, email [AzureBlueprint@microsoft.com](mailto:AzureBlueprint@microsoft.com).

## Blueprint System Security Plan

The Azure Blueprint System Security Plan (SSP) template is customer-focused and designed for use in developing an SSP that documents both customer security control implementations as well as controls inherited from Azure. Controls which include a customer responsibility, contain guidance on documenting control implementation with a thorough and compliant response. Azure inheritance sections document how security controls are implemented by Azure on behalf of the customer.

The Azure Blueprint SSP is available for the FedRAMP Moderate and High baselines, and the DISA Cloud Computing SRG L4 and L5 baselines. 

To request a copy of the Azure Blueprint SSP or to provide feedback, email [AzureBlueprint@microsoft.com](mailto:AzureBlueprint@microsoft.com).

## Azure Blueprint implementation guidance

Azure Blueprint implementation guidance is designed to help cloud solution architects and security personnel understand how Azure Government services and features can be deployed to implement a subset of customer-responsibility FedRAMP and DoD security controls. 
An array of documentation, tools, templates, and other resources are available to guide the secure deployment of Azure services and features. Azure resources can be deployed using Azure Resource Manager template [building blocks](https://github.com/mspnp/template-building-blocks), community-contributed Azure [Quickstart Templates](https://azure.microsoft.com/resources/templates/), or through use of [customer-authored](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates) JSON-based Resource Manager templates. The architecture of a basic deployment in Azure includes compute, networking, and storage resources. This implementation guidance addresses how these resources can be deployed in ways that help meet security control implementation requirements.

### Virtual Machines

Azure Resource Manager templates can be used to deploy pre-configured virtual machines that meet U.S. Government and industry security technical implementation guides (STIGs) and security benchmarks. Custom Azure virtual machines can be created using an existing pre-configured machine or deploy a new virtual machine and apply a security policy using Active Directory, for domain-joined machines, or the Local Group Policy Object Utility, for standalone machines. The Azure virtual machine Custom Script extension can be used to manage these post-deployment configuration tasks.

Windows virtual machine configuration may include security control implementations for:

- System use notification and acknowledgement [NIST SP 800-53 control AC-8]

  > AC-8 example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is configured in accordance with the CIS benchmark for Windows Server 2012 R2 and customized to meet organization requirements, including the use of an appropriate system use notification, which users must acknowledge prior to logon (ref. CIS benchmark sections 2.3.7.4, 2.3.7.5).*

- Local machine account restrictions including account lockout [NIST SP 800-53 control AC-7] concurrent session control [NIST SP 800-53 control AC-10], session lock [NIST SP-800-53 control AC-11], authenticator management [NIST SP 800-53 control IA-5], and others

  > AC-7 example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is configured in accordance with the CIS benchmark for Windows Server 2012 R2 and customized to meet organization requirements, including initiating an account lock after consecutive failed logon attempts (ref. CIS benchmark sections 1.2.1, 1.2.2, 1.2.3; note: CIS benchmark default values must be changed to meet FedRAMP and DoD parameter requirements).*

  > AC-10 example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is configured in accordance with the CIS benchmark for Windows Server 2012 R2 and customized to meet organization requirements, including restricting users to a single remote desktop services session, which meets FedRAMP and DoD requirements. (ref. CIS benchmark section 18.9.48.3.2).*

  > AC-11 example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is configured in accordance with the CIS benchmark for Windows Server 2012 R2 and customized to meet organization requirements, including initiating a session lock after 900 seconds (15 minutes) of inactivity that is retained until the user re-authenticates (ref. CIS benchmark sections 2.3.7.3, 19.1.3.1, 19.1.3.3).*

  > IA-5 example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is configured in accordance with the CIS benchmark for Windows Server 2012 R2 and customized to meet organization requirements, including restrictions on local account passwords that enforce minimum (1 day) and maximum (60 days) lifetime restrictions, reuse conditions (24 passwords), length (14 characters), and complexity requirements, which meet FedRAMP requirements (ref. CIS benchmark sections 1.1.1, 1.1.2., 1.1.3., 1.1.4, 1.1.5; note: CIS benchmark default values must be changed to meet DoD parameter requirements).*

- Configuration settings, including least functionality [NIST SP 800-53 controls CM-6, CM-7]

  > CM-6 example control implementation statement: *A configuration-controlled group policy object (GPO) is maintained for all customer-controlled Windows machines within Azure. The group policy object is configured in accordance with the CIS benchmark for Windows Server 2012 R2 and customized to meet organization requirements specific to the operational needs of the system. This group policy object is established, in addition to other configuration resources, to document and ensure consistent implementation of configuration settings.*

  > CM-7 example control implementation statement: *A configuration-controlled group policy object (GPO) is maintained for all customer-controlled Windows machines within Azure. The group policy object is configured in accordance with the CIS benchmark for Windows Server 2012 R2 and customized to meet organization requirements specific to the operational needs of the system. The group policy object is used to establish a baseline virtual machine image, which is maintained for all Windows machines within Azure and reflects the configuration of Windows machines to provide only the capabilities essential for operation of the system.*

  Security baseline remediation tools, which include pre-configured group policy objects (GPOs), for Windows machines, and shell scripts, for Linux machines, are available from [Microsoft](https://technet.microsoft.com/itpro/windows/keep-secure/windows-security-baselines), for Windows machines, and the [Center for Internet Security](https://benchmarks.cisecurity.org/) and the [Defense Information Systems Agency (DISA)](http://iase.disa.mil/stigs), for both Windows and Linux machines.  

Azure virtual machines can be encrypted to meet security control requirements to protect information at rest [NIST SP 800-53 control SC-28]. Azure Quickstart Templates are available to deploy encryption to both [new](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-create-new-vm-gallery-image) and existing [Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-windows-vm) and [Linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-linux-vm) virtual machines. 

> SC-28 example control implementation statement: *Customer-controlled virtual machines within Azure implement disk encryption to protect the confidentiality and integrity of information at rest. Azure disk encryption for Windows is implemented using the BitLocker feature of Windows; disk encryption for Linux virtual machines is implemented using the DM-Crypt feature of Linux.

Several Azure virtual machine extensions can be deployed to meet security control requirements. The [Microsoft Antimalware virtual machine extension](https://docs.microsoft.com/azure/security/azure-security-antimalware) can be deployed to new and existing virtual machines. The Antimalware extension can enable real-time protection as well as periodic, scheduled scans [NIST SP 800-53 control SI-3].

> SI-3 example control implementation statement: *Host-based antimalware protections for customer-controlled Windows virtual machines in Azure are implemented using the Microsoft Antimalware virtual machine extension. This extension is configured to perform both real-time and periodic scans (weekly), automatically update both the antimalware engine and protection signatures, perform automatic remediation actions, and provide notifications through Azure Diagnostics.*

*Additional tools and resources*

Azure Resource Manager template [building blocks](https://github.com/mspnp/template-building-blocks) that can be customized and used to deploy Azure resources, including deployment of [virtual machines](https://github.com/mspnp/template-building-blocks/tree/master/templates/buildingBlocks/multi-vm-n-nic-m-storage) and [virtual machine extensions](https://github.com/mspnp/template-building-blocks/tree/master/templates/buildingBlocks/virtualMachine-extensions). 

### Virtual Network

Azure Virtual Network (VNet) allows full control of security policies and routing within virtual network architectures through deployment and configuration of subnets, network security groups, and user defined routes. Network security groups can be applied to subnets or individual machines, logically separating resources by workload, based on a multi-tier architecture, of for any other purpose. In the reference architecture below, resources are grouped in separate subnets for the web, business, and data tiers, and subnets for Active Directory resources and management. Network security groups are applied to each subnet to restrict network traffic within the virtual network. 
 
![N-tier architecture using Microsoft Azure](./media/documentation-government-plan-compliance/compute-n-tier.png)

Network security groups enable full control of the communication paths between resources [NIST SP 800-53 control AC-4].

> AC-4 example control implementation statement: *Customer-controlled virtual machines in Azure implementing web, business, and data tier functions are segregated by subnet. Network security groups are defined and applied for each subnet that restrict information flow at the network layer to the minimum necessary for information system functionality.*

Network security groups can be applied to outgoing communications from subnets and virtual machines. This allows full control over communication between information system components in Azure and external information systems [NIST SP 800-53 control CA-3 (5)]. Network security group rule processing is implemented as a deny-all, permit-by-exception function. Further, user defined routes can be configured to route both incoming and outgoing communications from specific subnets and virtual machines through a virtual appliance such as a firewall or IDS/IPS, further managing system communications.

> CA-3 (5) example control implementation statement: *All outbound communication originating form customer-controlled resources in Azure is restricted through implementation of network security groups, which are configured with an outbound ruleset that denies all traffic except that explicitly allowed in order to support information system functionality, which meets FedRAMP and DoD L4 requirements. Further, user defined routes are configured to route all outbound traffic through a virtual firewall appliance, which is configured with a ruleset allowing communication with only approved external information systems.*

The reference architecture above demonstrates how Azure resources can be logically grouped into separate subnets with network security group rulesets applied to ensure that security functions and non-security functions are isolated. In this case, the three web-application tiers are isolated from the Active Directory subnet as well as the management subnet, which may host information system and security management tools and resources [NIST SP 800-53 control SC-3].

> SC-3 example control implementation statement: *Security functions are isolated from non-security functions within the customer-controlled Azure environment through implementation of subnets and network security groups that are applied to these subnets. The information system resources dedicated to the web, business, and data tiers of the web application are logically separated from the management subnet, where information system security-related tasks are performed.*

The reference architecture also implements managed access control points for remote access to the information system [NIST SP 800-53 control AC-17 (3)]. An Internet-facing load balancer is deployed to distribute incoming Internet traffic to the web application, and the management subnet includes a jumpbox, or bastion host, through which all management-related remote access to the system is controlled. Network security groups restrict traffic within the virtual network ensuring external traffic is only routed to designated public-facing resources.

> AC-17 (3) example control implementation statement: *Remote access to customer-controlled components of the information system within Azure is restricted to two managed network access control points. 1) Internet traffic designated for the web application is managed through an Internet-facing load balancer, which distributes traffic to web-tier resources. 2) Management remote access is managed through a bastion host on a segregated subnet within the environment. The network security group applied to the management subnet, in which the jumpbox resides, allows connections only from whitelisted public IP addresses and is restricted to remote desktop traffic only.*

Network security groups allow full control of communications between Azure resources and external host and systems, as well as between internal subnets and hosts, separating information system components that are designated publicly accessible and those that are not. In addition to the solutions in the reference architecture above, Azure enables deployment of virtual appliances, such as firewall and IDS/IPS solutions which, when used in conjunction with user defined routes, further secure and manage connections between Azure resources and external networks and information systems [NIST SP 800-53 control SC-7].

> SC-7 example control implementation statement: *Customer-controlled resources within Azure are protected though several deployed boundary protection mechanisms. Network security groups are defined and applied to network subnets which restrict traffic both at the information system boundary and within the virtual network. Network security groups include access control list (ACL) rules that control traffic to and from subnets and virtual machines. Load balancers are deployed to distribute incoming Internet traffic to specific resources. Subnets ensure that publicly accessible information system components are logically separated from nonpublic resources.*

Rulesets for network security groups enable restrictions on specific network ports and protocols, which is a key component of ensuring that information systems are implemented in a manner that provides only essential capabilities [NIST SP 800-53 control CM-7].

> CM-7 example control implementation statement: *The network security groups applied to subnets and virtual machines with the customer-controlled Azure environment are implemented using a deny-all, permit-by-exception approach. This ensures that only network traffic over explicitly approved ports and protocols is permitted, supporting the concept of least functionality.*

*Additional tools and resources*

Documentation for the reference architecture above is available on the Azure [documentation site](https://docs.microsoft.com/azure/guidance/guidance-compute-n-tier-vm). Azure Resource Manager templates to deploy the reference architecture are included on the same page. The Azure documentation site also contains detailed information regarding [network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) and [user defined routes](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview).

### Storage

Data stored in Azure storage is replicated to ensure high availability. While multiple replication options are available, geo-redundant storage (GRS) and read-access geo-redundant storage (RA-GRS) ensure that data is replicated to a secondary region. Primary and secondary regions are paired to ensure necessary distance between datacenters to ensure availability in the event of an area-wide outage or disaster [NIST SP 800-53 control CP-9]. For geo-redundant, high availability storage, select either geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS) when creating a new storage account. 

> CP-9 example control implementation statement: *All customer-controlled storage accounts within Azure implement geo-redundant storage, ensuring six copies of all data are maintained on separate nodes across two data centers.*

Azure Storage Service Encryption (SSE) safeguards data at rest within Azure storage accounts [NIST SP 800-53 controls SC-28, SC-28 (1)]. When enabled, Azure automatically encrypts data prior to persisting to storage. Data is encrypted using 256-bit AES encryption. SSE supports encryption of block blobs, append blobs, and page blobs.

> SC-28, SC-28 (1) example control implementation statement: *Confidentiality and integrity of all storage blobs with the customer-controlled Azure environment are protected through use of Azure SSE, which uses 256-bit AES encryption for all data-at-rest.*

*Additional tools and resources*

The Azure documentation site has detailed information regarding [storage service encryption](https://docs.microsoft.com/azure/storage/storage-service-encryption) and [storage replication](https://docs.microsoft.com/azure/storage/storage-redundancy). 

### Azure Active Directory

Azure Active Directory offers identity and access capabilities for information systems running in Microsoft Azure. Through the use of directory services, security groups, and group policy, customers can help control the access and security policies of the machines that make use of Azure Active Directory. Accounts and security groups can be used to help manage access to the information system. Group policy can help ensure that configuration requirements are met.

Azure Active Directory security groups and directory services can help implement role-based access control (RBAC) access control schemes, and control access to the information system. This may include security control implementations for:

- Account management [NIST SP 800-53 control AC-2]

  > AC-2.a example control implementation statement: *Azure Active Directory is used to manage access by implementing Role-Based Access Control with the use of Active Directory groups. There are established requirements for account management and access to accounts on the domains supported by AAD. Access to member servers of the domain is only supported by security groups. Each group has a primary and a secondary owner. These owners are responsible for maintaining accuracy of the group membership, permission, and description.*

  > AC-2.c example control implementation statement: *When a user requests access to any security group, the request must be approved by the owner of the group based on the criteria defined for membership. Account conditions are determined by the security group owners.*

  > AC-2.f example control implementation statement: *Azure Active Directory is used to manage control access to information systems. Account Administrators create, enable, modify, disable, or remove information system accounts as required, following account management policy.*

  > AC-2 (1) example control implementation statement: *Azure Active Directory is used to manage access by implementing Role-Based Access Control with the use of Active Directory groups. There are established requirements for account management and access to accounts on the domains supported by AAD. Access to member servers of the domain is only supported by security groups. Each group has a primary and a secondary owner. These owners are responsible for maintaining accuracy of the group membership, permission, and description.*

  > AC-2 (2) example control implementation statement: *Azure Active Directory is used to manage control access to information systems. Account Administrators create temporary accounts following account management policy. These temporary accounts are required to be set to expire in line with policy requirements.*

  > AC-2 (3) example control implementation statement: *Azure Active Directory manages control access to information systems. Account Administrators create temporary accounts following account management policy. These temporary accounts are required to be set to expire in line with policy requirements.*

  >AC-2 (7) example control implementation statement: *Azure Active Directory manages control access to information systems in accordance with a role-based access scheme, which organizes information system privileges into roles that are assigned to security groups. Security Group Administrators are responsible for granting access to users for assigning users to the correct security group. Each security group is assigned permissions with the minimum appropriate access to properly fulfill their tasks.*

  > AC-2 (11) example control implementation statement: *Azure Active Directory manages control access to information systems within Azure. Usage restrictions required by the security policies are defined and enforced within Azure Active Directory by Account Administrators.*

- Access Enforcement [NIST SP 800-53 control AC-3]

  > AC-3 example control implementation statement: *Azure Active Directory enforces approved authorizations to the Customer environment using role-based access control. Access to Azure Active Directory security groups is managed by Security Group Administrators. Users are placed in appropriate security groups according to their roles, using the principles of least privilege.*

- Least Privilege [NIST SP 800-53 control AC-6]

  > AC-6 (10) example control implementation statement: *Azure Active Directory enforces approved authorizations to the Customer environment using role-based access control. Access to Azure Active Directory security groups is managed by Security Group Administrators. Non-Privileged users are not granted access to security groups that would allow them to access privileged functions, including any permissions that would allow them to disable, circumvent, or alter security safeguards.*

- Remote Access [NIST SP 800-53 control AC-17]

  > AC-17 (1) example control implementation statement: *Azure Active Directory is used to monitor and control all remote access. Azure Active Directory includes security, activity, and audit reports for your directory.*

- Protection of Audit Information [NIST SP 800-53 control AU-9]

  > AU-9 example control implementation statement: *Tightly managed access controls are used to protect audit information and tools from unauthorized access, modification, and deletion. Azure Active Directory enforces approved logical access to users using a layer approach of access authorizations and logical controls using Active Directory policies, and role-based group memberships. The ability to view audit information and use auditing tools is limited to users that require these permissions.*

  > AU-9 (4) example control implementation statement: *Azure Active Directory restricts the management of audit functionality to members of the appropriate security groups. Only personnel with a specific need to access the management of audit functionality are granted these permissions.*

- Access Restrictions for Change [NIST SP 800-53 control CM-5]

  > CM-5 example control implementation statement: *RBAC enforced by Azure Active Directory is used to define, document, approve, and enforce logical access restrictions associated with changes. All accounts created within the system are role-based. Personnel request access from Account Administrators, and if approved, are placed in the appropriate security groups according to their roles. Access to the produce environment is only allowed to members of specific security groups after approval.*

  > CM-5 (1) example control implementation statement: *Azure Active Directory enforces logical access restrictions via security group memberships. This requires security group owners to grant access to a given security group.*

- User Identification and Authentication [NIST SP 800-53 control IA-2]

  > IA-2 example control implementation statement: *Personnel accessing the information system environment are uniquely identified by their username, and authenticated using Azure Active Directory. Authentication to Azure Active Directory is required in order to access the information system.*

  > IA-2 (8) example control implementation statement: *Access to the production environment is protected from replay attacks by the built-in Kerberos functionality of Azure Active Directory. In Kerberos authentication, the authenticator sent by the client contains additional data, such as an encrypted IP list, client timestamps, and ticket lifetime. If a packet is replayed, the timestamp is checked. If the timestamp is earlier than, or the same as a previous authenticator, the packet is rejected.*

  > IA-2 (9) example control implementation statement: *All accounts are protected from replay attacks by the built-in Kerberos functionality of Azure Active Directory. In Kerberos authentication, the authenticator sent by the client contains additional data, such as an encrypted IP list, the client timestamps, and the ticket lifetime. If a packet is replayed, the timestamp is checked. If the timestamp is earlier than, or the same as a previous authenticator, the packet is rejected.*

- Identifier Management [NIST SP 800-53 control IA-4]

  > IA-4.b example control implementation statement: *Azure Active Directory account identifiers are used to identify users. These unique identifiers are not reused.*

  > IA-4.c example control implementation statement: *Azure Active Directory is the central account repository used to provide access to the service environment. When accounts are created in Azure Active Directory, the user’s unique identifier is assigned to the individual.*

  > IA-4.d example control implementation statement: *Unique user identifiers are never reused. This is enforced by Azure Active Directory.*

  > IA-4.e example control implementation statement: *All accounts within Azure Active Directory are configured to automatically be disabled after 35 days of inactivity.*

  > IA-4 (4) example control implementation statement: *Azure Active Directory denotes contractors and vendors by using naming conventions applied to their unique Azure Active Directory credentials.*

- Authenticator Management [NIST SP 800-53 control IA-5]

  > IA-5.b example control implementation statement: *Azure Active Directory assigns a unique identification and random temporary password that meets policy requirements at the initial time of account creation. Azure Active Directory maintains the unique identification associated with the account throughout the life of the account. Account identification is never repeated with Azure Active Directory*

  > IA-5.c example control implementation statement: *Azure Active Directory ensures that issued passwords meet policy requirements for password complexity.*

  > IA-5.d example control implementation statement: *Initial authenticator distribution procedures are handled by Account Administrators. Access modifications to user accounts go through the account management process as defined in AC-2. If an authenticator is lost or compromised, Account Administrators follow the defined processes for resetting, re-issuing, or revoking the authenticator, as needed.*

  > IA-5 (1).c example control implementation statement: *Azure Active Directory is used to ensure that all passwords are cryptographically protected while stored and transmitted. Passwords stored by Azure Active Directory are automatically hashed as part of Azure Active Directory’s functionality.*

  > IA-5 (1).f example control implementation statement: *Azure Active Directory is used to manage control access to the information system. Whenever an account is initially created, or a temporary password is generated, Azure Active Directory is employed to require that the user change the password at the next login.*

  > IA-5 (4) example control implementation statement: *Azure Active Directory is the automated tool employed to determine if password authenticators are sufficiently strong to satisfy the password length, complexity, rotation, and lifetime restrictions established in IA-5 (1). Azure Active Directory ensures that password authenticator strength at creation meets these standards.*

Azure Active Directory group policy configuration can be used to deploy customer security policies that meet specific security requirements. Customer Azure virtual machines can have these policies applied by Azure Active Directory.
Azure Active Directory group policy configurations can include security control implementations for:

- Least Privilege [NIST SP 800-53 control AC-6]

  > AC-6 (9) example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including auditing for the execution of privileged functions.*

- Unsuccessful Login Attempts [NIST SP 800-53 control AC-7]

  > AC-7 example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including initiating an account lock after consecutive failed logon attempts.*

- Concurrent Session Control [NIST SP 800-53 control AC-10], Session Lock [NIST SP 800-53 control AC-11], Session Termination [NIST SP 800-53 control AC-12]

  > AC-10 example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including restricting users to a single remote desktop services session, which meets FedRAMP and DoD requirements.*

  > AC-11.a example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including initiating a session lock after 900 seconds (15 minutes) of inactivity that is retained until the user re-authenticates.*

  > AC-12 example control implementation statement: *Windows automatically terminates remote desktop sessions upon receiving a logout request from the customer user. Additionally, a configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including terminating a remote desktop session after 900 seconds (15 minutes) of inactivity.*

- Authenticator Management [NIST SP 800-53 control IA-5]

  > IA-5.f example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including restrictions on local account passwords that enforce minimum (1 day) and maximum (60 days) lifetime restrictions, reuse conditions (24 passwords), length (14 characters), and complexity requirements, which meet FedRAMP requirements.*

  > IA-5.g example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including restrictions on local account passwords that enforce maximum (60 days) lifetime restrictions, which meet FedRAMP requirements.*

  > IA-5 (1).a example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including complexity requirements, which meet FedRAMP requirements.*

  > IA-5 (1).b example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including complexity requirements, which meet FedRAMP requirements.*

  > IA-5 (1).d example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including restrictions on local account passwords that enforce minimum (1 day) and maximum (60 days) lifetime restrictions, which meet FedRAMP requirements."

  > IA-5 (1).e example control implementation statement: *A configuration-controlled group policy object (GPO) is applied to all customer-controlled Windows machines within Azure. The group policy object is customized to meet organization requirements, including restrictions on reuse conditions (24 passwords), which meet FedRAMP requirements.*

*Additional tools and resources*

Documentation, tools, templates, and other resources are available to guide the secure deployment of Azure services and features. Get started with Azure Active Directory by visiting [Microsoft Azure Docs](https://docs.microsoft.com/azure/active-directory/).

### Key Vault

Azure Key Vault offers safeguards for cryptographic keys and secrets used by cloud applications and services. Through the use of Azure Key Vault, customers can create, manage, and protect keys and secrets. Secure containers (vaults) can be used to store and manage cryptographic keys and secrets securely. Azure Key Vault can be used to generate cryptographic keys using HSMs that are FIPS 140-2 Level 2 validated.

Azure Key Vault containers can help store cryptographic keys securely with high availability. This may include security control implementations for:

-	Protection of Authenticators [NIST SP 800-53 control IA-5 (7)]

  > IA-5 (7) example control implementation statement: *The use of unencrypted static authenticators embedded in applications, access scripts, or function keys is explicitly prohibited. Any script or application that uses an authenticator makes a call to an Azure Key Vault container prior to each use. Access to Azure Key Vault containers is audited, which allows detection of violations of this prohibition if a service account is used to access a system without a corresponding call to the Azure Key Vault container.*

- Cryptographic Key Establishment and Management [NIST SP 800-53 control SC-12 (1)]

  > SC-12 (1) example control implementation statement: *Azure Key Vault is used to store cryptographic keys and secrets. This service tracks and monitors access to secrets. This service is used to ensure that secrets are not lost.*

Azure Key Vault can be used to create cryptographic keys using HSMs that meet FIPS 140-2 Level 2 validated. Azure Active Directory group policy configurations can include security control implementations for:

- Cryptographic Key Establishment and Management [NIST SP 800-53 control SC-12 (2)]

  > SC-12 (2) example control implementation statement: *Azure Key Vault is used to produce, control, and distribute cryptographic keys. These keys are generated using HSMs that are FIPS 140-2 Level 2 validated. These keys are stored and managed within securely encrypted containers within Azure Key Vault.*

*Additional tools and resources*

Documentation, tools, templates, and other resources are available to guide the secure deployment of Azure services and features. Get started with Azure Key Vault by visiting [Microsoft Azure Docs](https://docs.microsoft.com/azure/key-vault/).

### Operations Management Suite

Microsoft Operations Management Suite (OMS) is Microsoft's cloud-based IT management solution that helps manage and protect on-premises and cloud infrastructure. Security and Compliance helps identify, assess, and mitigate security risks to infrastructure. These features of OMS are implemented through multiple solutions, including Log Analytics, that analyze log data and monitor security configurations.

OMS enabled Security and Audit services can help implement account monitoring and logging. This may include security control implementations for:

- Account Management [NIST SP 800-53 control AC-2]

  > AC-2.g example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used to monitor the use of system accounts. OMS creates audit logs for system accounts which can then be analyzed with OMS’s analytics and alert based on a defined set of criteria.*

  > AC-2 (4) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used to generate audit logs for account management functions, such as; account creation, modification, enabling, disabling, and removal actions. OMS is used to alert the system owner if any of the above conditions have been executed.*

  > AC-2 (12) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used to monitor the use of system accounts for atypical use. OMS creates audit logs for system accounts which can then be analyzed with OMS’s analytics and alert the appropriate personnel based on a defined set of criteria.*

- Least Privilege [NIST SP 800-53 control AC-6]

  > AC-6 (9) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used to monitor the execution of privileged functions. OMS creates audit logs for a list of specified functions which can then be analyzed with OMS’s analytics and alert based on a defined set of criteria.*

 - Remote Access [NIST SP 800-53 control AC-17]

  > AC-17 (1) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used to monitor and control remote access. OMS includes security, activity, and audit reports for your directory.*

- Audit Events [NIST SP 800-53 control AU-2]

  > AU-2 example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used to audit: successful and unsuccessful account logon events, account management events, object access, policy change, privilege functions, process tracking, and system events. For Web applications: all administrator activity, authentication checks, authorization checks, data deletions, data access, data changes, and permission changes. As well any other customer defined set of events.*

- Content of Audit Records [NIST SP 800-53 control AU-3]

  > AU-3 (2) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used as a centralized management and configuration for all audit records generated by network, storage and computing equipment.*

- Audit Storage Capacity [NIST SP 800-53 control AU-4]

  > AU-4 example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used for centralized management and configuration of all audit records generated by network, storage and computing equipment. The centralized management tool is used to configure audit record storage capacity.*

- Response to Audit Processing Failures [NIST SP 800-53 control AU-5]

  > AU-5 example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution to alert organization defined personnel of audit processing failures.*

  > AU-5 (1) control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution to alert organization defined personnel within organization defined period of time that audit record storage has reached an organization defined percentage of the maximum repository volume.*

  > AU-5 (2) control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution to alert organization defined personnel in real time when auditable events defined in organization policy fail.*

- Audit Review, Analysis, and Reporting [NIST SP 800-53 control AU-6]

  > AU-6 (3) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution as well as the Log Analytics solution to analyze different audit log repositories to provide organization-wide situational awareness. The analytics tool is used for reporting on audit logs to provide situation awareness.*

  > AU-6 (4) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used for centralized management and configuration of all audit records. The centralized management tool allows for audit records from all sources to be reviewed and analyzed.*

  > AU-6 (5) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution as well as the Log Analytics solution to analyze different security related data generated from vulnerability scanning, information system monitoring and performance related data. The analysis of these different resources provide an enhanced ability to identify suspicious activity.*

- Audit Reduction and Report Generation [NIST SP 800-53 control AU-7]

  > AU-7 example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution as well as the Log Analytics solution to generate on-demand human readable reports which allow for after-the-fact investigations of security incidents. The use of the Microsoft Log Analytics tool does not permanently or irreversibly alter the original audit record content or time ordering.*

  > AU-7 (1) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution to query organization defined auditable events.*

- Protection of Audit Information [NIST SP 800-53 control AU-9]

  > AU-9 example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with security groups to manage access to audit information and tools to prevent unauthorized access, modification, and deletion of audit records. The ability to view audit information and use auditing tools is limited to users that require these permissions.*

  > AU-9 (2) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution as well as Azure Backup to backup audit logs to Azure which then replicates data in order to provide data reliability and availability. Azure Backup provides a secure place for audit logs to be stored on a system other than the one being audited.* 

  > AU-9 (4) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with security groups to manage access to audit information and tools. Only personnel with a specific need to access the management of audit functionality are granted these permissions.*

- Audit Record Retention [NIST SP 800-53 control AU-11]

  > AU-11 example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution to configure audit log retention. Audit log retention is configured to retain audit data for at least 90 days.*

- Audit Generation [NIST SP 800-53 control AU-12]

  > AU-12 example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution to collect the auditable events defined in AU-02 from information system components. OMS’s Security and Audit solution is used by organization-defined personnel to define which auditable events are collected from specific devices.*

  > AU-12 (1) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution as well as the Log Analytics solution to compile audit records from system components which can be sorted by time stamps to create a system wide audit trail.*

- Access Restrictions for Change [NIST SP 800-53 control CM-5]

  > CM-5 (1) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution and Active Directory to enforce logical access restrictions via security group memberships. Actions performed by these security groups are audited by OMS.*

- Information System Component Inventory [NIST SP 800-53 control CM-8]

  > CM-8 (3) example control implementation statement: *Microsoft’s Operation Management Suite (OMS) is used with the Security and Audit solution as well as the Antimalware solution to detect the presence of unauthorized software. Upon detection OMS disables the infected component and sends an alert to organization defined personnel.*

Documentation, tools, templates, and other resources are available to guide the secure deployment of Azure services and features. Get started with Operation Management Suite by visiting [Microsoft Azure Docs](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-overview/).

### Additional implementation guidance

In addition to the core Azure services described above, several built-in features can help organizations meet security control compliance requirements. All Azure resources are organized into resource groups. Assets can be further organized by applying tags, which are key-value pairs that may be customer-selected to identify resources by category or any other property. Azure resource groups ensure complete identification and tracking of all customer resources deployed within Azure [NIST SP 800-53 control CM-8]. 

> CM-8 example control implementation statement: *All customer-controlled resources deployed within belong to the “Customer-resources” resource group. Within the Azure portal, all deployed assets are identified within the resource group blade, ensuring an accurate, current, inventory. Tags are applied to resources, as necessary, to meet tracking and reporting requirements.*

Azure Resource Manager templates, allow customers to define the configuration of resources within their Azure deployment. Resource Manager templates are JSON-based and use declarative syntax to document resources, configuration parameters, and other aspects of an Azure environment. Resource Manager templates are generated automatically when Azure solutions are deployed from the Azure portal and can also be authored and edited manually to meet specific customer needs. These Resource Manager templates can serve as a representation of the baseline configuration for an information system [NIST SP 800-53 control CM-2]. Existing Resource Manager templates, such as the building blocks referenced above, can be customized to meet the needs of any deployment.

> CM-2 example control implementation statement: *As a component of the information system baseline configuration, Azure Resource Manager templates are maintained, under configuration control, representing the deployed customer-controlled resources and configuration of information system components within Azure. These templates capture deployed resources, including virtual machines, storage, and network resources (including configurations of network resources that control network traffic entering, exiting, and within the customer Azure environment.*

## Next steps

For inquiries related to Azure Blueprint, FedRAMP, DoD, or Agency ATO processes, or other compliance assistance; or to provide Blueprint feedback, email [AzureBlueprint@microsoft.com](mailto:AzureBlueprint@microsoft.com).

[Microsoft Trust Center](https://www.microsoft.com/trustcenter/Compliance/default.aspx)

[Microsoft Azure Government Blog](https://blogs.msdn.microsoft.com/azuregov/)
