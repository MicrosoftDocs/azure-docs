---
title: Compare Active Directory-based services in Azure | Microsoft Docs
description: In this overview, you compare the different identity offerings for Active Directory Domain Services, Azure Active Directory, and Azure Active Directory Domain Services.
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

To provide applications, services, or devices access to a central identity, there are three common ways to use Active Directory-based services in Azure. This choice in identity solutions gives you the flexibility to use the most appropriate directory for your organization's needs. For example, if you mostly manage cloud-only users that run mobile devices, it may not make sense to build and run your own Active Directory Domain Services identity solution. Instead, you could just use Azure Active Directory.

Although the three Active Directory-based identity solutions share a common name and technology, they are designed to provide services that meet different customer demands. At high level, these identity solutions and feature sets are:

* **Active Directory Domain Services (AD DS)** - Enterprise-ready lightweight directory access protocol (LDAP) server that provides key features such as identity and authentication, computer object management, group policy, and trusts.
    * AD DS is a central component in many organizations with an on-premises IT environment, and provides core user account authentication and computer management features.
* **Azure Active Directory (Azure AD)** - Cloud-based identity and mobile device management that provides user account and authentication services for resources such as Office 365, the Azure portal, or SaaS applications.
    * Azure AD can be synchronized with an on-premises AD DS environment to provide a single identity to users that works natively in the cloud.
* **Azure Active Directory Domain Services (Azure AD DS)** - Provides managed domain services with a subset of fully compatible traditional AD DS features such as domain join, group policy, LDAP, and Kerberos / NTLM authentication.
    * Azure AD DS integrates with Azure AD, which itself can synchronize with an on-premises AD DS environment, to extend central identity use cases to traditional web applications that run in Azure as part of a lift-and-shift strategy.

This overview article compares and contrasts how these identity solutions can work together, or would be used independently, depending on the needs of your organization.

## Azure AD DS compared to self-managed AD DS

If you have applications and services that need access to traditional authentication mechanisms such as Kerberos or NTLM, there are two ways to provide Active Directory Domain Services in the cloud:

* A *managed* domain that you create using Azure Active Directory Domain Services. Microsoft creates and manages the required resources.
* A *self-managed* domain that you create and configure using traditional resources such as virtual machines (VMs), Windows Server guest OS, and Active Directory Domain Services. You then continue to administer these resources.

With Azure AD DS, the core service components are deployed and maintained for you by Microsoft as a *managed* domain experience. You don't deploy, manage, patch, and secure the AD DS infrastructure for components like the VMs, Windows Server OS, or domain controllers (DCs). Azure AD DS provides a smaller subset of features to traditional self-managed AD DS environment, which reduces some of the design and management complexity. For example, there's no AD forests, domain, sites, and replication links to design and maintain. For applications and services that run in the cloud and need access to traditional authentication mechanisms such as Kerberos or NTLM, Azure AD DS provides a managed domain experience with the minimal amount of administrative overhead.

When you deploy and run a self-managed AD DS environment, you have to maintain all of the associated infrastructure and directory components. There's additional maintenance overhead with a self-managed AD DS environment, but you are then able to perform additional tasks such as extend the schema or create forest trusts. Common deployment models for a self-managed AD DS environment that provides identity to applications and services in the cloud include the following:

* **Standalone cloud-only AD DS** - Azure VMs are configured as domain controllers and a separate cloud-only AD DS environment is created. This AD DS environment doesn't integrate with an on-premises AD DS environment. A different set of credentials is used to sign in to and administer VMs in the cloud.
* **Resource forest deployment** - Azure VMs are configured as domain controllers and an AD DS domain as part of an existing forest is created. A trust relationship is then configured to an on-premises AD DS environment. Other Azure VMs can domain-join to this resource forest in the cloud. User authentication runs over a VPN / ExpressRoute connection to the on-premises AD DS environment.
* **Extend on-premises domain to Azure** - An Azure virtual network connects to an on-premises network using a VPN / ExpressRoute connection. Azure VMs connect to this Azure virtual network, which lets them domain-join to the on-premises AD DS environment.
    * An alternative is to create Azure VMs and promote them as replica domain controllers from the on-premises AD DS domain. These domain controllers replicate over a VPN / ExpressRoute connection to the on-premises AD DS environment. The on-premises AD DS domain is effectively extended into Azure.

The following table outlines some of the features you may need for your organization, and the differences between a managed Azure AD DS domain or a self-managed AD DS domain:

| **Feature** | **Azure AD DS** | **Self-managed AD DS** |
| ----------- |:---------------:|:----------------------:|
| [**Managed service**](#managed-service)                                                               | **&#x2713;** | **&#x2715;** |
| [**Secure deployments**](#secure-deployments)                                                         | **&#x2713;** | Administrator secures the deployment |
| [**DNS server**](#dns-server)                                                                         | **&#x2713;** (managed service) |**&#x2713;** |
| [**Domain or Enterprise administrator privileges**](#domain-or-enterprise-administrator-privileges)   | **&#x2715;** | **&#x2713;** |
| [**Domain join**](#domain-join)                                                                       | **&#x2713;** | **&#x2713;** |
| [**Domain authentication using NTLM and Kerberos**](#domain-authentication-using-ntlm-and-kerberos)   | **&#x2713;** | **&#x2713;** |
| [**Kerberos constrained delegation**](#kerberos-constrained-delegation)                               | Resource-based | Resource-based & account-based|
| [**Custom OU structure**](#custom-ou-structure)                                                       | **&#x2713;** | **&#x2713;** |
| [**Group Policy**](#group-policy)                                                                     | **&#x2713;** | **&#x2713;** |
| [**Schema extensions**](#schema-extensions)                                                           | **&#x2715;** | **&#x2713;** |
| [**AD domain / forest trusts**](#ad-domain-or-forest-trusts)                                          | **&#x2715;** | **&#x2713;** |
| [**Secure LDAP (LDAPS)**](#secure-ldap)                                                               | **&#x2713;** | **&#x2713;** |
| [**LDAP read**](#ldap-read)                                                                           | **&#x2713;** | **&#x2713;** |
| [**LDAP write**](#ldap-write)                                                                         | **&#x2715;** | **&#x2713;** |
| [**Geo-distributed deployments**](#geo-dispersed-deployments)                                         | **&#x2715;** | **&#x2713;** |

### Managed service

Azure AD DS is managed by Microsoft. You don't have to patch, update, monitor, back-up, and ensure availability of your domain. These management tasks are offered as a service by Microsoft Azure for your managed domains.

In a self-managed AD DS environment, you perform all these actions.

### Secure deployments

An Azure AD DS managed domain is securely locked down as per Microsoft’s security recommendations for AD deployments.

For self-managed AD DS environments, you need to take specific deployment steps to lock down and secure your deployment.

### DNS server

An Azure AD DS managed domain includes managed DNS services. DNS management can be performed using the *DNS Administration console* included in the Remote Server Administration Tools (RSAT) package. For more information, see [manage DNS in Azure AD DS](manage-dns.md).

For self-managed AD DS environments, you have to configure and managed DNS yourself.

### Domain or Enterprise Administrator privileges

Elevated privileges are not available on an Azure AD DS managed domain. Applications that require these elevated privileges cannot be deployed against Azuer AD DS managed domains. A smaller subset of administrative privileges is available to members of the delegated administration group called *AAD DC Administrators*. These privileges include privileges to configure DNS, configure group policy, or gain administrator privileges on domain-joined machines. 

Self-managed AD DS environments can use the *Domain Administrator* or *Enterprise Administrator* privileges.

### Domain join

Virtual machines in an Azure AD DS managed domain can be domain-joined in the same way as with a self-managed AD DS environment.

### Domain authentication using NTLM and Kerberos

With Azure AD DS, existing credentials can be used to authenticate with the managed domain. These credentials are automatically kept in sync with an Azure AD tenant. To extend this single source of credentials, Azure AD Connect can be used to make sure that changes to credentials made on-premises are synchronized to Azure AD.

With a self-managed AD DS environment that runs on Azure VMs, you could set up a domain trust with your on-premises AD DS for users to authenticate with their existing credentials. Alternately, you could set up AD replication to ensure that user passwords synchronize to your Azure domain controller VMs.

### Kerberos constrained delegation

As you don't have *Domain Administrator* privileges on an Azure AD DS managed domain, you can't configure account-based (traditional) Kerberos constrained delegation. Instead, you can configure the more secure resource-based constrained delegation. For more information, see [Configure Kerberos constrained delegation (KCD) in Azure AD DS](deploy-kcd.md).

In a self-managed AD DS environment, you can use both forms of constrained delegation.

### Custom OU structure

Members of the *AAD DC Administrators* group can create custom OUs within an Azure AD DS managed domain. Users who create custom OUs are granted full administrative privileges over the OU. For more information, see [create a custom OU in Azure AD DS](create-ou.md).

A self-managed AD DS environment can create more complex OU structures for user and computer accounts.

### Group Policy

In an Azure AD DS managed domain, there are built-in GPOs applied to the *AADDC Computers* and *AADDC Users* containers. You can customize these built-in GPOs to configure group policy. Members of the *AAD DC Administrators* group can create custom GPOs and link them to existing OUs, including custom OUs. For more information, see [Administer Group Policy in Azure AD DS](manage-group-policy.md).

In a self-managed AD DS environment, you can also create and apply GPOs to OUs.

### Schema extensions

You can't extend the base schema of an Azure AD DS managed domain. Applications that rely on extensions to AD schema (for example, new attributes under the user object) can't use a lift-and-shift strategy and connect to Azure AD DS.

In a self-managed AD DS environment, you can extend the schema as needed.

### AD Domain or Forest Trusts

Azure AD DS managed domains can't be configured to set up trust relationships (inbound or outbound) with other domains. Resource forest deployment scenarios can't use Azure AD DS. Also, deployments where you prefer not to synchronize passwords to Azure AD can't use Azure AD DS.

In a self-managed AD DS environment, you can create trust relationships as needed.

### Secure LDAP

An Azure AD DS managed domain can be configured to provide secure LDAP access, including over the internet. For more information, see [Configure secure LDAP in Azure AD DS](tutorial-configure-ldaps.md).

A self-managed AD DS environment can also be configured to use secure LDAP.

### LDAP read

An Azure AD DS managed domain supports LDAP read workloads. Applications that use LDAP read operations can be deployed against the Azure AD DS managed domain.

Self-managed AD DS environments also support LDAP read operations

### LDAP write

Azure AD DS managed domains are read-only for user objects. Applications that perform LDAP write operations against attributes of the user object won't work in an Azure AD DS managed domain. User passwords or group membership changes also can't be changed from within the Azure AD DS managed domain. Changes to user attributes or passwords should be made in Azure AD, such as using Azure PowerShell or the Azure portal, or to an on-premises AD DS environment that is synchronized to Azure AD using Azure AD Connect.

Self-managed AD DS environments support LDAP write operations.

### Geo-dispersed deployments

Azure AD DS managed domains are available in a single virtual network in Azure. A single Azure AD DS instance is available per Azure AD tenant. Although other Azure resources and services in different regions can connect through peered virtual networks, Azure AD DS can only be deployed to a single geographic region.

For self-managed AD DS environments, you can create Azure VMs in different geographic regions and promote them to domain controllers.

## Azure AD DS compared to Azure AD

Azure AD lets you to manage the identity of devices used by the organization and control access to corporate resources from those devices. Users can register their personal device (a bring-your-own, or BYO, model) with Azure AD, which provides the device with an identity. Azure AD can then authenticate the device when a user signs in to Azure AD and uses the device to access secured resources. The device can be managed using Mobile Device Management (MDM) software like Microsoft Intune. This management ability lets you restrict access to sensitive resources to managed and policy-compliant devices.

Traditional computers and laptops can also join to Azure AD. This mechanism offers the same benefits of registering a personal device with Azure AD, such as to allow users to sign in to the device using their corporate credentials. Azure AD joined devices give you the following benefits:

* Single-sign-on (SSO) to applications secured by Azure AD.
* Enterprise policy-compliant roaming of user settings across devices.
* Access to the Windows Store for Business using corporate credentials.
* Windows Hello for Business.
* Restricted access to apps and resources from devices compliant with corporate policy.

Devices can be joined to Azure AD with or without a hybrid deployment that includes an on-premises AD DS environment. The following table outlines common device ownership models and how they would typically be joined to a domain:

| **Type of device**                                        | **Device platforms**             | **Mechanism**          |
|:----------------------------------------------------------| -------------------------------- | ---------------------- |
| Personal devices                                          | Windows 10, iOS, Android, Mac OS | Azure AD registered    |
| Organization owned device not joined to on-premises AD DS | Windows 10                       | Azure AD joined        |
| Organization owned device joined to an on-premises AD DS  | Windows 10                       | Hybrid Azure AD joined |

On an Azure AD-joined or registered device, user authentication happens using modern OAuth / OpenID Connect based protocols. These protocols are designed to work over the internet, so are great for mobile scenarios where users access corporate resources from anywhere. With Azure AD DS-joined devices, applications can use the Kerberos and NTLM protocols for authentication, so can support legacy applications migrated to run on Azure VMs as part of a lift-and-shift strategy. The following table outlines differences in how the devices are represented and can authenticate themselves against the directory:

| **Aspect**                      | **Azure AD-joined**                                 | **Azure AD DS-joined**                                                    |
|:--------------------------------| --------------------------------------------------- | ------------------------------------------------------------------------- |
| Device controlled by            | Azure AD                                            | Azure AD DS managed domain                                                |
| Representation in the directory | Device objects in the Azure AD directory            | Computer objects in the Azure AD DS managed domain                        |
| Authentication                  | OAuth / OpenID Connect based protocols              | Kerberos and NTLM protocols                                               |
| Management                      | Mobile Device Management (MDM) software like Intune | Group Policy                                                              |
| Networking                      | Works over the internet                             | Requires machines to be on the same virtual network as the managed domain |
| Great for...                    | End-user mobile or desktop devices                  | Server VMs deployed in Azure                                              |

## Next steps

To get started, [create an Azure AD DS managed domain using the Azure portal][tutorial-create].