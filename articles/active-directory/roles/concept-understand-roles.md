---
title: Understand role-based access control (RBAC) in Azure Active Directory | Microsoft Docs
description: Learn how to understand Azure AD built-in and custom roles applied to restricted scope in Azure Active Directory.
services: active-directory
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: overview
ms.date: 11/11/2020
ms.author: curtand
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Understand roles in Azure Active Directory

There are about 60 Azure AD built-in roles right now and that number is increasing. To supplement these built-in roles, Azure AD also supports custom roles with which you can cherry pick permissions to manage particular Azure AD objects, such as applications or service principals, and bundle those permissions into a your own custom role.

- Azure AD built-in roles
- Azure AD custom roles

This article explains what Azure AD roles are and how should you use them.

## How Azure AD roles are different from other Microsoft 365 roles

There are different services within Microsoft 365 suite, Azure AD being one of them. Some of these services have their own role-based access control system, while others don't. Azure AD, Exchange, Intune, Security Center, Compliance Center, Microsoft Cloud App Security and Commerce each have a separate role-based access control system. Other services such as Teams, SharePoint, and Managed Desktop use Azure AD roles for their administrative access; they don’t have separate role-based access control systems. Azure has a separate role-based access control system that is also different from Azure AD roles. What does it mean when we say separate role-based access control system? It means there is a different data store where role definitions and role assignments are stored. Similarly, there is a different policy decision point where access checks happen.

## Overlap with other RBAC systems

Identity is new control plane. Our customers wanted to grant permissions through only Azure AD. This pushed us to add some service-specific built-in roles in Azure AD. An example of this addition is the Exchange Administrator role in Azure AD. This role is equivalent to Organization Management role group in the Exchange role-based access control system. It can manage all aspects of Exchange. Similarly, we added the Intune Administrator role, Teams Administrator, SharePoint Administrator, and so on.

## Categories of Azure AD roles

In general, there are 3 categories of built-in roles in Azure AD.

1. Azure AD specific roles - These roles grant permissions to manage resources within Azure AD only. For example, User Administrator, Application Administrator, Groups Administrator etc. grant permissions to manage resources that live in Azure AD.

1. Service specific roles - For major Microsoft 365 services (non-Azure AD), we have built service-specific roles which grant permissions to manage all functionalities within that service.  For example, Exchange Admin, Intune Admin, SharePoint Admin, Teams Admin etc. can manage functionalities with their respective services. Exchange Admin can manage mailboxes, Intune Admin can manage device policies, SharePoint Admin can manage site collections, Teams Admin can manage call qualities and so on. 

1. Cross-service roles - There are some roles that span across services. We have 2 'global' roles - Global Administrator and Global Reader. All Microsoft 365 services honor these two roles. Then there are some security-related roles like Security Admin and Security Reader that grants access across multiple security services within Microsoft 365. For example, using Security Admin roles in Azure AD, you can manage Microsoft 365 Security Center, MDATP and MCAS. Similarly, using Compliance Admin, you can manage Compliance-related settings in Microsoft 365 Compliance Center, Exchange and so on.

![The three categories of Azure AD built-in roles](./media/overview-understanding-roles/role-overlap-diagram.png)

The following table is offered as an aid to understanding this categorization of roles. The categorization is broad and arbitrary, and isn't intended to imply any other capabilities beyond the documented role permissions.

Category | Role
---- | ----
Azure AD specific role | Application Administrator
Azure AD specific role | Application Developer
Azure AD specific role | Authentication Administrator
Azure AD specific role | B2C IEF Keyset Administrator
Azure AD specific role | B2C IEF Policy Administrator
Azure AD specific role | Cloud Application Administrator
Azure AD specific role | Cloud Device Administrator
Azure AD specific role | Conditional Access Administrator
Azure AD specific role | Device Administrators
Azure AD specific role | Directory Readers
Azure AD specific role | Directory Synchronization Accounts
Azure AD specific role | Directory Writers
Azure AD specific role | External Id User flow Administrator
Azure AD specific role | External Id User Flow Attribute Administrator
Azure AD specific role | External Identity Provider Administrator
Azure AD specific role | Groups Administrator
Azure AD specific role | Guest Inviter
Azure AD specific role | Helpdesk Administrator
Azure AD specific role | Hybrid Identity Administrator
Azure AD specific role | License Administrator
Azure AD specific role | Partner Tier1 Support
Azure AD specific role | Partner Tier2 Support
Azure AD specific role | Password Administrator
Azure AD specific role | Privileged Authentication Administrator
Azure AD specific role | Privileged Role Administrator
Azure AD specific role | Reports Reader
Azure AD specific role | User Account Administrator
Cross-service role | Company Administrator
Cross-service role | Compliance Administrator
Cross-service role | Compliance Data Administrator
Cross-service role | Global Reader
Cross-service role | Security Administrator
Cross-service role | Security Operator
Cross-service role | Security Reader
Cross-service role | Service Support Administrator
Service-specific role | Azure DevOps Administrator
Service-specific role | Azure Information Protection Administrator
Service-specific role | Billing Administrator
Service-specific role | CRM Service Administrator
Service-specific role | Customer LockBox Access Approver
Service-specific role | Desktop Analytics Administrator
Service-specific role | Exchange Service Administrator
Service-specific role | Insights Administrator
Service-specific role | Insights Business Leader
Service-specific role | Intune Service Administrator
Service-specific role | Kaizala Administrator
Service-specific role | Lync Service Administrator
Service-specific role | Message Center Privacy Reader
Service-specific role | Message Center Reader
Service-specific role | Modern Commerce User
Service-specific role | Network Administrator
Service-specific role | Office Apps Administrator
Service-specific role | Power BI Service Administrator
Service-specific role | Power Platform Administrator
Service-specific role | Printer Administrator
Service-specific role | Printer Technician
Service-specific role | Search Administrator
Service-specific role | Search Editor
Service-specific role | SharePoint Service Administrator
Service-specific role | Teams Communications Administrator
Service-specific role | Teams Communications Support Engineer
Service-specific role | Teams Communications Support Specialist
Service-specific role | Teams Devices Administrator
Service-specific role | Teams Service Administrator

## Next steps

- Create custom role assignments using [the Azure portal, Azure AD PowerShell, and Graph API](custom-create.md)
- [View the assignments for a custom role](custom-view-assignments.md)
