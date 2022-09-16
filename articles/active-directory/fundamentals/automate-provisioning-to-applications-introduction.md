---
title: Automate identity provisioning to applications introduction
description: Learn to design solutions to automatically provision identities in hybrid environments to provide application access.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: overview
ms.date: 09/23/2022
ms.author: jricketts
ms.custom:
  - it-pro
  - seodec18
  - kr2b-contr-experiment
ms.collection: M365-identity-device-management
---

# Introduction

These articles are for:

* Architects

* Microsoft partners

* IT professionals

The articles provides information for those who make decisions about how to address identity [provisioning](https://www.gartner.com/en/information-technology/glossary/user-provisioning) needs in their organizations, or the organizations they are working with. The content focuses on automating user provisioning for access to applications across all systems in your organization.

Employees in an organization rely on many applications to perform their work. These applications often require IT admins or application owners to provision accounts before an employee can start accessing them. Organizations also need to manage the lifecycle of these accounts and keep them up to date with the latest information and remove accounts when users do not require them anymore.

The Azure AD provisioning service automates your identity lifecycle and keeps identities in sync across trusted source systems (like HR systems) and applications that users need access to. It enables you to bring users into Azure AD and provision them into the various applications that they require. The provisioning capabilities are foundational building blocks that enable rich governance and lifecycle workflows. For [hybrid](../hybrid/whatis-hybrid-identity.md) scenarios, Azure AD employs an agent model to connect to various on-premises or IaaS based systems and includes components such as the Azure AD provisioning agent, Microsoft Identity Manager (MIM), and Azure AD Connect.

Thousands of organizations are running Azure AD cloud-hosted services, alongside its hybrid components delivered on-premises, for their provisioning scenarios. Microsoft continues to support and invest in both its cloud-hosted and on-premises delivered functionality, including MIM and Azure AD Connect sync, to help organizations provision users in all their connected systems and applications. This article focuses on how organizations can use Azure AD to address their provisioning needs and make clear which technology is most right for each scenario.

!Typical deployment of MIM](media/automate-user-provisioning-to-applications-introduction/typical-mim-deployment.png)

 Use the following table to find content specific to your scenario. For example, if you want to employee and contractor identities management from an HR system to Active Directory (AD) or Azure Active Directory (Azure AD), follow the link to *Connect identities with your system of record*.

| What | From | To | Read |
| - | - | - | - |
| Employees and contractors| HR systems| AD and Azure AD| [Connect identities with your system of record](automate-user-provisioning-to-applications-solutions.md#connect-identities-with-your-system-of-record) |
| Existing AD users and groups| AD| Azure AD| [Synchronize identities between Azure AD and Active Directory](automate-user-provisioning-to-applications-solutions.md#synchronize-identities-between-active-directory-and-azure-ad) |
| Users, groups| Azure AD| SaaS and on-prem apps| [Automate provisioning to non-Microsoft applications](../governance/entitlement-management-organization.md) |
| Access rights| Azure AD Identity Governance| SaaS and on-prem apps| [Entitlement management](../governance/entitlement-management-overview.md) |
| Existing users and groups| AD, SaaS and on-prem apps| Identity governance (so I can review them)| [Azure AD Access reviews](../governance/access-reviews-overview.md) |
| Non-employee users (with approval)| Other cloud directories| SaaS and on-prem apps| [Connected organizations](../governance/entitlement-management-organization.md) |
| Users, groups| Azure AD| Managed AD domain| [Azure AD Domain Services](https://azure.microsoft.com/services/active-directory-ds/) |

## Example Topologies

Organizations vary greatly in the applications and infrastructure that they rely on to run their business. Some organizations have all their infrastructure in the cloud, relying solely on SaaS applications, while others have invested deeply in on-premises infrastructure over several years. The three topologies below depict how Microsoft can meet the needs of a cloud only customer, hybrid customer with basic provisioning requirements, and a hybrid customer with advanced provisioning requirements.

### Cloud only

In this example the organization has a cloud HR system such as Workday or SuccessFactors, uses Microsoft 365 for collaboration, and SaaS apps such as ServiceNow and Zoom.

![Cloud only deployment](media/automate-user-provisioning-to-applications-introduction/cloud-only-identity-management.png)

1. The Azure AD provisioning service imports users from the cloud HR system and creates an account in Azure AD, based on business rules that the organization defines.

1. The user complete sets up the suitable authentication methods, such as the authenticator app, Fast Identity Online 2 (FIDO2)/Windows Hello for Business (WHfB) keys via [Temporary Access Pass](../authentication/howto-authentication-temporary-access-pass.md) and then signs into Teams. This Temporary Access Pass was automatically generated for the user through Azure AD Life Cycle Workflows.

1. The Azure AD provisioning service creates accounts in the various applications that the user needs, such as ServiceNow and Zoom. The user is able to request the necessary devices they need and start chatting with their teams.

### Hybrid-basic

In this example, the organization has a mix of cloud and on-premises infrastructure. In addition to the systems mentioned above, the organization relies on SaaS applications and on-premises applications that are both AD integrated and non-AD integrated.

![Hybrid deployment model](media/automate-user-provisioning-to-applications-introduction/hybrid-basic.png)

1.The Azure AD provisioning service imports the user from Workday and creates an account in AD DS, enabling the user to access AD-integrated applications.

2.Azure AD Connect Cloud Sync provisions the user into Azure AD, which enables the user to access SharePoint Online and their OneDrive files.

3.The Azure AD provisioning service detects that a new account has been created in Azure AD and then creates accounts in the SaaS and on-premises applications that the user needs access to.

### Hybrid-advanced

In this example, the organization has users spread across multiple on-prem HR systems and cloud HR. They have large groups and device synchronization requirements.

![Advanced hybrid deployment model](media/automate-user-provisioning-to-applications-introduction/hybrid-advanced.png)

1.MIM imports user information from each HR stem. MIM determines which users are needed for those employees in different directories. MIM provisions those identities in Active Directory.

2.Azure AD Connect Sync then synchronizes those users and groups to Azure AD and provides users access to their resources.

## Next steps

* [Solutions to automate user provisioning to applications](automate-user-provisioning-to-applications-solutions.md)
