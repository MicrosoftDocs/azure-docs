---
title: Compare of Azure Active Directory Domain Services | Microsoft Docs
description: In this overview, compare the different identity offerings for Active Directory Domain Services, Azure Active Directory, and Azure Active Directory Domain Services.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: overview
ms.date: 07/25/2019
ms.author: iainfou

#Customer intent: As an IT administrator or decision maker, I want to understand the differences between Active Directory Domain Services (AD DS), Azure AD, and Azure AD DS so I can choose the most appropriate identity solution for my organization.
---

# Compare self-managed Active Directory Domain Services, Azure Active Directory, and managed Azure Active Directory Domain Services

To provide applications, services, or devices access to a central identity, there are three common ways to use Active Directory-based services in Azure. This choice of identity solutions gives you the flexibility to use the most appropriate directory for your organization's needs. For example, if you mostly managed cloud-only users that run mobile devices, it may not make sense to build and run your own Active Directory-based identity solution.

Although the three identity solutions share a common name and technology, they are designed to provide services that meet different customer demands. At high-level, these identity solutions are:

* **Active Directory Domain Services (AD DS)** - Enterprise-ready lightweight directory access protocol (LDAP) server that provides key features such as identity and authentication, computer object management, group policy, and trusts.
    * AD DS is a central component in many organizations with an on-premises IT environment, and provides core user account authentication and computer management features.
* **Azure Active Directory (Azure AD)** - Cloud-based identity and access management that provides user account and authentication services for resources such as Office 365, the Azure portal, or SaaS applications.
    * Azure AD can be synchronized with an on-premises AD DS environment to provide a single identity to users that works natively in the cloud.
* **Azure Active Directory Domain Services (Azure AD DS)** - Provides managed domain services with a subset of fully-compatible traditional AD DS features such as domain join, group policy, LDAP, and Kerberos / NTLM authentication.
    * Azure AD DS integrates with Azure AD, which itself can synchronize with an on-premises AD DS environment, to extend central identity use cases to traditional web applications that run in Azure as part of a lift-and-shift strategy.

This overview article compares and contrasts how these identity solutions can work together, or would be used independently, depending on the needs of your organization.

## Azure AD DS compared to self-managed AD DS

With Azure AD DS, the core components are deployed and maintained for you by Microsoft. Azure AD DS provides a *managed* domain experience. You don't deploy, manage, patch, and secure the AD DS infrastructure for components like the virtual machines (VMs), Windows Server OS, or domain controllers (DCs). There's a smaller subset of features provided by Azure AD DS which reduces some of the design and management complexity. Fr example, there's no AD forests, domain, sites, and replication links to design and maintain. If you have applications and services that run in the cloud that need access to traditional authentication mechanisms such as Kerberos or NTLM, Azure AD DS provides that managed domain experience with the minimal amount of additional administrative overhead.

When you deploy and run a self-managed AD DS environment, you have to maintain all of the associated infrastructure and directory components. There's additional maintenance overhead with a self-managed AD DS environment, but you are then able to perform additional tasks such as extend the schema or create forest trusts. If you only run services and applications in your on-premises environments, a self-managed AD DS environment remains a good approach. If you have applications and services in the cloud, you may choose to build and maintain a self-managed AD DS environment. Common deployment models for a self-managed AD DS environment that provides identity to applications and services in the cloud include the following:

* **Standalone cloud-only AD DS** - Azure VMs are configured as domain controllers and a separate cloud-only AD DS environment is created. This AD DS environment doesn't integrate with an on-premises AD DS environment. A different set of credentials are used to sign in to and administer VMs in the cloud.
* **Resource forest deployment** - Azure VMs are configured as domain controllers and an AD DS domain as part of an existing forest is created. A trust relationship is then configured to an on-premises AD DS environment. Other Azure VMs can domain-join to this resource forest in the cloud. User authentication runs over a VPN / ExpressRoute connection to the on-premises AD DS environment.
* **Extend on-premises domain to Azure** - An Azure virtual network connects to an on-premises network using a VPN / ExpressRoute connection. Azure VMs connect to this Azure virtual network, which lets them domain-join to the on-premises AD DS environment.
    * An alternative is to create Azure VMs and promote them as replica domain controllers from the on-premises AD DS domain. These domain controllers replicate over a VPN / ExpressRoute connection to the on-premises AD DS environment. The on-premises AD DS done is effectively extended into Azure.

The following table outlines some of the features you may need for your organization, and the differences between a managed Azure AD DS domain or a self-managed AD DS domain:

| **Feature** | **Azure AD DS** | **Self-managed AD DS** |
| ----------- |:----------------------------:|:----------------------:|
| [**Managed service**](#managed-service)                                                             | **&#x2713;** | **&#x2715;** |
| [**Secure deployments**](#secure-deployments)                                                       | **&#x2713;** | Administrator secures the deployment |
| [**DNS server**](#dns-server)                                                                       | **&#x2713;** (managed service) |**&#x2713;** |
| [**Domain or Enterprise administrator privileges**](#domain-or-enterprise-administrator-privileges) | **&#x2715;** | **&#x2713;** |
| [**Domain join**](#domain-join)                                                                     | **&#x2713;** | **&#x2713;** |
| [**Domain authentication using NTLM and Kerberos**](#domain-authentication-using-ntlm-and-kerberos) | **&#x2713;** | **&#x2713;** |
| [**Kerberos constrained delegation**](#kerberos-constrained-delegation)                             | Resource-based | Resource-based & account-based|
| [**Custom OU structure**](#custom-ou-structure)                                                     | **&#x2713;** | **&#x2713;** |
| [**Schema extensions**](#schema-extensions)                                                         | **&#x2715;** | **&#x2713;** |
| [**AD domain/forest trusts**](#ad-domain-or-forest-trusts)                                          | **&#x2715;** | **&#x2713;** |
| [**LDAP read**](#ldap-read)                                                                         | **&#x2713;** | **&#x2713;** |
| [**Secure LDAP (LDAPS)**](#secure-ldap)                                                             | **&#x2713;** | **&#x2713;** |
| [**LDAP write**](#ldap-write)                                                                       | **&#x2715;** | **&#x2713;** |
| [**Group Policy**](#group-policy)                                                                   | **&#x2713;** | **&#x2713;** |
| [**Geo-distributed deployments**](#geo-dispersed-deployments)                                       | **&#x2715;** | **&#x2713;** |

### Managed service

Azure AD Domain Services domains are managed by Microsoft. You do not have to worry about patching, updates, monitoring, backups, and ensuring availability of your domain. These management tasks are offered as a service by Microsoft Azure for your managed domains.

### Secure deployments

The managed domain is securely locked down as per Microsoft’s security recommendations for AD deployments. These recommendations stem from the AD product team's decades of experience engineering and supporting AD deployments. For do-it-yourself deployments, you need to take specific deployment steps to lock down/secure your deployment.

### DNS server

An Azure AD Domain Services managed domain includes managed DNS services. Members of the 'AAD DC Administrators' group can manage DNS on the managed domain. Members of this group are given full DNS Administration privileges for the managed domain. DNS management can be performed using the 'DNS Administration console' included in the Remote Server Administration Tools (RSAT) package.
[More information](manage-dns.md)

### Domain or Enterprise Administrator privileges

These elevated privileges are not offered on an AAD-DS managed domain. Applications that require these elevated privileges cannot be deployed against AAD-DS managed domains. A smaller subset of administrative privileges is available to members of the delegated administration group called ‘AAD DC Administrators’. These privileges include privileges to configure DNS, configure group policy, gain administrator privileges on domain-joined machines etc.

### Domain join

You can join virtual machines to the managed domain similar to how you join computers to an AD domain.

### Domain authentication using NTLM and Kerberos

With Azure AD Domain Services, you can use your corporate credentials to authenticate with the managed domain. Credentials are kept in sync with your Azure AD tenant. For synced tenants, Azure AD Connect ensures that changes to credentials made on-premises are synchronized to Azure AD. With a do-it-yourself domain setup, you may need to set up an AD domain trust with your on-premises AD for users to authenticate with their corporate credentials. Alternately, you may need to set up AD replication to ensure that user passwords synchronize to your Azure domain controller virtual machines.

### Kerberos constrained delegation

You do not have 'Domain Administrator' privileges on an Active Directory Domain Services managed domain. Therefore, you cannot configure account-based (traditional) Kerberos constrained delegation. However, you can configure the more secure resource-based constrained delegation.
[More information](deploy-kcd.md)

### Custom OU structure

Members of the 'AAD DC Administrators' group can create custom OUs within the managed domain. Users who create custom OUs are granted full administrative privileges over the OU.
[More information](create-ou.md)

### Schema extensions

You cannot extend the base schema of an Azure AD Domain Services managed domain. Therefore, applications that rely on extensions to AD schema (for example, new attributes under the user object) cannot be lifted and shifted to AAD-DS domains.

### AD Domain or Forest Trusts

Managed domains cannot be configured to set up trust relationships (inbound/outbound) with other domains. Therefore, resource forest deployment scenarios cannot use Azure AD Domain Services. Similarly, deployments where you prefer not to synchronize passwords to Azure AD cannot use Azure AD Domain Services.

### LDAP Read

The managed domain supports LDAP read workloads. Therefore you can deploy applications that perform LDAP read operations against the managed domain.

### Secure LDAP

You can configure Azure AD Domain Services to provide secure LDAP access to your managed domain, including over the internet.
[More information](tutorial-configure-ldaps.md)

### LDAP Write

The managed domain is read-only for user objects. Therefore, applications that perform LDAP write operations against attributes of the user object do not work in a managed domain. Additionally, user passwords cannot be changed from within the managed domain. Another example would be modification of group memberships or group attributes within the managed domain, which is not permitted. However, any changes to user attributes or passwords made in Azure AD (via PowerShell/Azure portal) or on-premises AD are synchronized to the AAD-DS managed domain.

### Group policy

There is a built-in GPO each for the "AADDC Computers" and "AADDC Users" containers. You can customize these built-in GPOs to configure group policy. Members of the 'AAD DC Administrators' group can also create custom GPOs and link them to existing OUs (including custom OUs).
[More information](manage-group-policy.md)

### Geo-dispersed deployments

Azure AD Domain Services managed domains are available in a single virtual network in Azure. For scenarios that require domain controllers to be available in multiple Azure regions across the world, setting up domain controllers in Azure IaaS VMs might be the better alternative.

## Azure AD DS compared to Azure AD

Azure AD lets you to manage the identity of devices used by the organization and control access to corporate resources from those devices. Users can register their personal device (a bring-your-own, or BYO, model) with Azure AD, which provides the device with an identity. Azure AD can then authenticate the device when a user signs in to Azure AD and uses the device to access secured resources. The device can be managed using Mobile Device Management (MDM) software like Microsoft Intune. This management ability lets you restrict access to sensitive resources to managed and policy-compliant devices.





You can also join organization owned devices to Azure AD. This mechanism offers the same benefits of registering a personal device with Azure AD. Additionally, users can sign in to the device using their corporate credentials. Azure AD joined devices give you the following benefits:

* Single-sign-on (SSO) to applications secured by Azure AD
* Enterprise policy-compliant roaming of user settings across devices.
* Access to the Windows Store for Business using your corporate credentials.
* Windows Hello for Business
* Restricted access to apps and resources from devices compliant with corporate policy.

| **Type of device** | **Device platforms** | **Mechanism** |
|:---| --- | --- |
| Personal devices | Windows 10, iOS, Android, Mac OS | Azure AD registered |
| Organization owned device not joined to on-premises AD | Windows 10 | Azure AD joined |
| Organization owned device joined to an on-premises AD | Windows 10 | Hybrid Azure AD joined |

On an Azure AD joined or registered device, user authentication happens using modern OAuth/OpenID Connect based protocols. These protocols are designed to work over the internet and are great for mobile scenarios where users access corporate resources from anywhere.

| **Aspect** | **Azure AD Join** | **Azure AD Domain Services** |
|:---| --- | --- |
| Device controlled by | Azure AD | Azure AD Domain Services managed domain |
| Representation in the directory | Device objects in the Azure AD directory. | Computer objects in the AAD-DS managed domain. |
| Authentication | OAuth/OpenID Connect based protocols | Kerberos, NTLM protocols |
| Management | Mobile Device Management (MDM) software like Intune | Group Policy |
| Networking | Works over the internet | Requires machines to be on the same virtual network as the managed domain.|
| Great for ... | End-user mobile or desktop devices | Server virtual machines deployed in Azure |

## Next steps