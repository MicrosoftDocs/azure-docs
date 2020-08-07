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
ms.date: 06/08/2020
ms.author: iainfou

#Customer intent: As an IT administrator or decision maker, I want to understand the differences between Active Directory Domain Services (AD DS), Azure AD, and Azure AD DS so I can choose the most appropriate identity solution for my organization.
---

# Compare self-managed Active Directory Domain Services, Azure Active Directory, and managed Azure Active Directory Domain Services

To provide applications, services, or devices access to a central identity, there are three common ways to use Active Directory-based services in Azure. This choice in identity solutions gives you the flexibility to use the most appropriate directory for your organization's needs. For example, if you mostly manage cloud-only users that run mobile devices, it may not make sense to build and run your own Active Directory Domain Services (AD DS) identity solution. Instead, you could just use Azure Active Directory.

Although the three Active Directory-based identity solutions share a common name and technology, they're designed to provide services that meet different customer demands. At high level, these identity solutions and feature sets are:

* **Active Directory Domain Services (AD DS)** - Enterprise-ready lightweight directory access protocol (LDAP) server that provides key features such as identity and authentication, computer object management, group policy, and trusts.
    * AD DS is a central component in many organizations with an on-premises IT environment, and provides core user account authentication and computer management features.
    * For more information, see [Active Directory Domain Services overview in the Windows Server documentation][overview-adds].
* **Azure Active Directory (Azure AD)** - Cloud-based identity and mobile device management that provides user account and authentication services for resources such as Office 365, the Azure portal, or SaaS applications.
    * Azure AD can be synchronized with an on-premises AD DS environment to provide a single identity to users that works natively in the cloud.
    * For more information about Azure AD, see [What is Azure Active Directory?][whatis-azuread]
* **Azure Active Directory Domain Services (Azure AD DS)** - Provides managed domain services with a subset of fully-compatible traditional AD DS features such as domain join, group policy, LDAP, and Kerberos / NTLM authentication.
    * Azure AD DS integrates with Azure AD, which itself can synchronize with an on-premises AD DS environment. This ability extends central identity use cases to traditional web applications that run in Azure as part of a lift-and-shift strategy.
    * To learn more about synchronization with Azure AD and on-premises, see [How objects and credentials are synchronized in a managed domain][synchronization].

This overview article compares and contrasts how these identity solutions can work together, or would be used independently, depending on the needs of your organization.

> [!div class="nextstepaction"]
> [To get started, create an Azure AD DS managed domain using the Azure portal][tutorial-create]

## Azure AD DS and self-managed AD DS

If you have applications and services that need access to traditional authentication mechanisms such as Kerberos or NTLM, there are two ways to provide Active Directory Domain Services in the cloud:

* A *managed domain* that you create using Azure Active Directory Domain Services (Azure AD DS). Microsoft creates and manages the required resources.
* A *self-managed* domain that you create and configure using traditional resources such as virtual machines (VMs), Windows Server guest OS, and Active Directory Domain Services (AD DS). You then continue to administer these resources.

With Azure AD DS, the core service components are deployed and maintained for you by Microsoft as a *managed* domain experience. You don't deploy, manage, patch, and secure the AD DS infrastructure for components like the VMs, Windows Server OS, or domain controllers (DCs).

Azure AD DS provides a smaller subset of features to traditional self-managed AD DS environment, which reduces some of the design and management complexity. For example, there are no AD forests, domain, sites, and replication links to design and maintain. You can still [create forest trusts between Azure AD DS and on-premises environments (currently in preview)][create-forest-trust].

For applications and services that run in the cloud and need access to traditional authentication mechanisms such as Kerberos or NTLM, Azure AD DS provides a managed domain experience with the minimal amount of administrative overhead. For more information, see [Management concepts for user accounts, passwords, and administration in Azure AD DS][administration-concepts].

When you deploy and run a self-managed AD DS environment, you have to maintain all of the associated infrastructure and directory components. There's additional maintenance overhead with a self-managed AD DS environment, but you're then able to do additional tasks such as extend the schema or create forest trusts.

Common deployment models for a self-managed AD DS environment that provides identity to applications and services in the cloud include the following:

* **Standalone cloud-only AD DS** - Azure VMs are configured as domain controllers and a separate, cloud-only AD DS environment is created. This AD DS environment doesn't integrate with an on-premises AD DS environment. A different set of credentials is used to sign in and administer VMs in the cloud.
* **Resource forest deployment** - Azure VMs are configured as domain controllers and an AD DS domain that's part of an existing forest is created. A trust relationship is then configured to an on-premises AD DS environment. Other Azure VMs can domain-join to this resource forest in the cloud. User authentication runs over a VPN / ExpressRoute connection to the on-premises AD DS environment.
* **Extend on-premises domain to Azure** - An Azure virtual network connects to an on-premises network using a VPN / ExpressRoute connection. Azure VMs connect to this Azure virtual network, which lets them domain-join to the on-premises AD DS environment.
    * An alternative is to create Azure VMs and promote them as replica domain controllers from the on-premises AD DS domain. These domain controllers replicate over a VPN / ExpressRoute connection to the on-premises AD DS environment. The on-premises AD DS domain is effectively extended into Azure.

The following table outlines some of the features you may need for your organization, and the differences between a managed Azure AD DS domain or a self-managed AD DS domain:

| **Feature** | **Azure AD DS** | **Self-managed AD DS** |
| ----------- |:---------------:|:----------------------:|
| **Managed service**                               | **&#x2713;** | **&#x2715;** |
| **Secure deployments**                            | **&#x2713;** | Administrator secures the deployment |
| **DNS server**                                    | **&#x2713;** (managed service) |**&#x2713;** |
| **Domain or Enterprise administrator privileges** | **&#x2715;** | **&#x2713;** |
| **Domain join**                                   | **&#x2713;** | **&#x2713;** |
| **Domain authentication using NTLM and Kerberos** | **&#x2713;** | **&#x2713;** |
| **Kerberos constrained delegation**               | Resource-based | Resource-based & account-based|
| **Custom OU structure**                           | **&#x2713;** | **&#x2713;** |
| **Group Policy**                                  | **&#x2713;** | **&#x2713;** |
| **Schema extensions**                             | **&#x2715;** | **&#x2713;** |
| **AD domain / forest trusts**                     | **&#x2713;** (one-way outbound forest trusts only) | **&#x2713;** |
| **Secure LDAP (LDAPS)**                           | **&#x2713;** | **&#x2713;** |
| **LDAP read**                                     | **&#x2713;** | **&#x2713;** |
| **LDAP write**                                    | **&#x2713;** (within the managed domain) | **&#x2713;** |
| **Geo-distributed deployments**                   | **&#x2715;** | **&#x2713;** |

## Azure AD DS and Azure AD

Azure AD lets you manage the identity of devices used by the organization and control access to corporate resources from those devices. Users can also register their personal device (a bring-your-own (BYO) model) with Azure AD, which provides the device with an identity. Azure AD then authenticates the device when a user signs in to Azure AD and uses the device to access secured resources. The device can be managed using Mobile Device Management (MDM) software like Microsoft Intune. This management ability lets you restrict access to sensitive resources to managed and policy-compliant devices.

Traditional computers and laptops can also join to Azure AD. This mechanism offers the same benefits of registering a personal device with Azure AD, such as to allow users to sign in to the device using their corporate credentials.

Azure AD joined devices give you the following benefits:

* Single-sign-on (SSO) to applications secured by Azure AD.
* Enterprise policy-compliant roaming of user settings across devices.
* Access to the Windows Store for Business using corporate credentials.
* Windows Hello for Business.
* Restricted access to apps and resources from devices compliant with corporate policy.

Devices can be joined to Azure AD with or without a hybrid deployment that includes an on-premises AD DS environment. The following table outlines common device ownership models and how they would typically be joined to a domain:

| **Type of device**                                        | **Device platforms**             | **Mechanism**          |
|:----------------------------------------------------------| -------------------------------- | ---------------------- |
| Personal devices                                          | Windows 10, iOS, Android, macOS | Azure AD registered    |
| Organization-owned device not joined to on-premises AD DS | Windows 10                       | Azure AD joined        |
| Organization-owned device joined to an on-premises AD DS  | Windows 10                       | Hybrid Azure AD joined |

On an Azure AD-joined or registered device, user authentication happens using modern OAuth / OpenID Connect based protocols. These protocols are designed to work over the internet, so are great for mobile scenarios where users access corporate resources from anywhere.

With Azure AD DS-joined devices, applications can use the Kerberos and NTLM protocols for authentication, so can support legacy applications migrated to run on Azure VMs as part of a lift-and-shift strategy. The following table outlines differences in how the devices are represented and can authenticate themselves against the directory:

| **Aspect**                      | **Azure AD-joined**                                 | **Azure AD DS-joined**                                                    |
|:--------------------------------| --------------------------------------------------- | ------------------------------------------------------------------------- |
| Device controlled by            | Azure AD                                            | Azure AD DS managed domain                                                |
| Representation in the directory | Device objects in the Azure AD directory            | Computer objects in the Azure AD DS managed domain                        |
| Authentication                  | OAuth / OpenID Connect based protocols              | Kerberos and NTLM protocols                                               |
| Management                      | Mobile Device Management (MDM) software like Intune | Group Policy                                                              |
| Networking                      | Works over the internet                             | Must be connected to, or peered with, the virtual network where the managed domain is deployed |
| Great for...                    | End-user mobile or desktop devices                  | Server VMs deployed in Azure                                              |

## Next steps

To get started with using Azure AD DS, [create an Azure AD DS managed domain using the Azure portal][tutorial-create].

You can also learn more about 
[management concepts for user accounts, passwords, and administration in Azure AD DS][administration-concepts] and [how objects and credentials are synchronized in a managed domain][synchronization].

<!-- INTERNAL LINKS -->
[manage-dns]: manage-dns.md
[deploy-kcd]: deploy-kcd.md
[custom-ou]: create-ou.md
[manage-gpos]: manage-group-policy.md
[tutorial-ldaps]: tutorial-configure-ldaps.md
[tutorial-create]: tutorial-create-instance.md
[whatis-azuread]: ../active-directory/fundamentals/active-directory-whatis.md
[overview-adds]: /windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview
[create-forest-trust]: tutorial-create-forest-trust.md
[administration-concepts]: administration-concepts.md
[synchronization]: synchronization.md
