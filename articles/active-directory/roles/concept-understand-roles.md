---
title: Understand Azure Active Directory role concepts
description: Learn how to understand Azure Active Directory built-in and custom roles with resource scope in Azure Active Directory.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: overview
ms.date: 04/22/2022
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Understand roles in Azure Active Directory

There are about 60 Azure Active Directory (Azure AD) built-in roles, which are roles with a fixed set of role permissions. To supplement the built-in roles, Azure AD also supports custom roles. Use custom roles to select the role permissions that you want. For example, you could create one to manage particular Azure AD resources such as applications or service principals.

This article explains what Azure AD roles are and how they can be used.

## How Azure AD roles are different from other Microsoft 365 roles

There are many different services in Microsoft 365, such as Azure AD and Intune. Some of these services have their own role-based access control systems, specifically:

- Azure Active Directory (Azure AD)
- Microsoft Exchange
- Microsoft Intune
- Microsoft Defender for Cloud Apps
- Microsoft 365 Defender portal
- Compliance portal
- Cost Management + Billing

Other services such as Teams, SharePoint, and Managed Desktop don’t have separate role-based access control systems. They use Azure AD roles for their administrative access. Azure has its own role-based access control system for Azure resources such as virtual machines, and this system is not the same as Azure AD roles.

![Azure RBAC versus Azure AD roles](./media/concept-understand-roles/azure-roles-azure-ad-roles.png)

When we say separate role-based access control system. it means there is a different data store where role definitions and role assignments are stored. Similarly, there is a different policy decision point where access checks happen. For more information, see [Roles for Microsoft 365 services in Azure AD](m365-workload-docs.md) and [Azure roles, Azure AD roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).

## Why some Azure AD roles are for other services

Microsoft 365 has a number of role-based access control systems that developed independently over time, each with its own service portal. To make it convenient for you to manage identity across Microsoft 365 from the Azure portal, we have added some service-specific built-in roles, each of which grants administrative access to a Microsoft 365 service. An example of this addition is the Exchange Administrator role in Azure AD. This role is equivalent to the [Organization Management role group](/exchange/organization-management-exchange-2013-help) in the Exchange role-based access control system, and can manage all aspects of Exchange. Similarly, we added the Intune Administrator role, Teams Administrator, SharePoint Administrator, and so on. Service-specific roles is one category of Azure AD built-in roles in the following section.

## Categories of Azure AD roles

Azure AD built-in roles differ in where they can be used, which fall into the following three broad categories.

- **Azure AD-specific roles**: These roles grant permissions to manage resources within Azure AD only. For example, User Administrator, Application Administrator, Groups Administrator all grant permissions to manage resources that live in Azure AD.
- **Service-specific roles**: For major Microsoft 365 services (non-Azure AD), we have built service-specific roles that grant permissions to manage all features within the service.  For example, Exchange Administrator, Intune Administrator, SharePoint Administrator, and Teams Administrator roles can manage features with their respective services. Exchange Administrator can manage mailboxes, Intune Administrator can manage device policies, SharePoint Administrator can manage site collections, Teams Administrator can manage call qualities and so on.
- **Cross-service roles**: There are some roles that span services. We have two global roles - Global Administrator and Global Reader. All Microsoft 365 services honor these two roles. Also, there are some security-related roles like Security Administrator and Security Reader that grant access across multiple security services within Microsoft 365. For example, using Security Administrator roles in Azure AD, you can manage Microsoft 365 Defender portal, Microsoft Defender Advanced Threat Protection, and Microsoft Defender for Cloud Apps. Similarly, in the Compliance Administrator role you can manage Compliance-related settings in Compliance portal, Exchange, and so on.

![The three categories of Azure AD built-in roles](./media/concept-understand-roles/role-overlap-diagram.png)

The following table is offered as an aid to understanding these role categories. The categories are named arbitrarily, and aren't intended to imply any other capabilities beyond the [documented Azure AD role permissions](permissions-reference.md).

Category | Role
---- | ----
Azure AD-specific roles | Application Administrator<br>Application Developer<br>Authentication Administrator<br>B2C IEF Keyset Administrator<br>B2C IEF Policy Administrator<br>Cloud Application Administrator<br>Cloud Device Administrator<br>Conditional Access Administrator<br>Device Administrators<br>Directory Readers<br>Directory Synchronization Accounts<br>Directory Writers<br>External ID User Flow Administrator<br>External ID User Flow Attribute Administrator<br>External Identity Provider Administrator<br>Groups Administrator<br>Guest Inviter<br>Helpdesk Administrator<br>Hybrid Identity Administrator<br>License Administrator<br>Partner Tier1 Support<br>Partner Tier2 Support<br>Password Administrator<br>Privileged Authentication Administrator<br>Privileged Role Administrator<br>Reports Reader<br>User Administrator
Cross-service roles | Global Administrator<br>Compliance Administrator<br>Compliance Data Administrator<br>Global Reader<br>Security Administrator<br>Security Operator<br>Security Reader<br>Service Support Administrator
Service-specific roles | Azure DevOps Administrator<br>Azure Information Protection Administrator<br>Billing Administrator<br>CRM Service Administrator<br>Customer Lockbox Access Approver<br>Desktop Analytics Administrator<br>Exchange Service Administrator<br>Insights Administrator<br>Insights Business Leader<br>Intune Service Administrator<br>Kaizala Administrator<br>Lync Service Administrator<br>Message Center Privacy Reader<br>Message Center Reader<br>Modern Commerce User<br>Network Administrator<br>Office Apps Administrator<br>Power BI Service Administrator<br>Power Platform Administrator<br>Printer Administrator<br>Printer Technician<br>Search Administrator<br>Search Editor<br>SharePoint Service Administrator<br>Teams Communications Administrator<br>Teams Communications Support Engineer<br>Teams Communications Support Specialist<br>Teams Devices Administrator<br>Teams Administrator

## Next steps

- [Overview of Azure AD role-based access control](custom-overview.md)
- Create role assignments using [the Azure portal, Azure AD PowerShell, and Microsoft Graph API](custom-create.md)
- [List role assignments](view-assignments.md)
