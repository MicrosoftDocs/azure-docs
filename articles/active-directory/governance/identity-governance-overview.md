---
title: Azure AD Identity governance| Microsoft Docs
description: Azure AD Identity Governance allows you to appropriately balance your organization’s need for security and employee productivity with the right processes and visibility.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: compliance
ms.date: 09/25/2018
ms.author: rolyon
ms.reviewer: markwahl-msft
---

# Azure AD identity governance

Azure Active Directory (Azure AD) identity governance allows you to appropriately balance your organization’s need for security and employee productivity with the right processes and visibility. It offers you capabilities to ensure that the right users have the right access to the right resources, and it allows you to protect, monitor, and audit access to critical assets -- while ensuring employee productivity.  

## Overview

The identity governance capabilities delivered in Azure AD identity governance will give organizations the ability to

- govern the identity lifecycle,
- govern access lifecycle, and
- secure administration

across employees, individuals from business partners and vendors, and services and applications.

Specifically, it is intended to help organizations address these four key questions:

- Which users should have access to which resources?
- What are those users doing with that access?
- Are there effective organizational controls for managing access?
- Can auditors verify that the controls are working?

## Identity lifecycle

Identity governance helps organizations to achieve a balance between *productivity* - How quickly can a person have access to the resources they need, such as when they join my organization? And *security*  - How should their access change over time, such as due to changes to that person’s employment status?  Identity lifecycle management is the foundation for identity governance, and effective governance at scale requires modernizing the identity lifecycle management infrastructure for applications.

For many organizations, identity lifecycle for employees is tied to the representation of that user in an HCM (human capital management) system.  Azure AD Premium implements automatically maintaining user identities for people represented in Workday in both Active Directory and Azure Active Directory, as described in the [Workday inbound provisioning (preview) tutorial](../saas-apps/workday-inbound-tutorial.md).  Azure AD Premium also includes the capabilities of [Microsoft Identity Manager](/microsoft-identity-manager/) which can import records from on-premises HCM systems such as SAP, Oracle eBusiness, and Oracle PeopleSoft.

Increasingly, scenarios require collaboration with people outside your organization. [Azure AD B2B](/azure/active-directory/b2b/) collaboration enables securely sharing your organization's applications and services with guest users and external partners from any organization, while maintaining control over your own corporate data.

## Access lifecycle

Organizations need a process manage access beyond what was initially provisioned for a user, when that user’s identity was created.  Furthermore, enterprise organizations need to be able to scale efficiently to be able to develop and enforce access policy and controls on an ongoing basis.

Typically, IT delegates access approval decisions to business decision makers.  Furthermore, IT can involve the users themselves.  For example, users accessing confidential customer data in a company’s marketing application in Europe need to know what the company’s policies. Guest users may be unaware of the handling requirements for data in an organization to which they have been invited.

Organizations can automate the access lifecycle process through technologies such as [dynamic groups](../users-groups-roles/groups-dynamic-membership.md), coupled with user provisioning to [SaaS apps](../saas-apps/tutorial-list.md) or [apps integrated with SCIM](../manage-apps/use-scim-to-provision-users-and-groups.md).  Organizations can also control which [guest users have access to on-premises applications](../b2b/hybrid-cloud-to-on-premises.md).  These access rights can then be regularly reviewed using recurring Azure AD [access reviews](access-reviews-overview.md).

When a user attempts to access applications, Azure AD enforces [conditional access](/azure/active-directory/conditional-access/) policies. For example, conditional access policies can include displaying to the user a [terms of use](active-directory-tou.md) and [ensure the user has agreed to those terms](../conditional-access/require-tou.md),  prior to being able to access an application.

## Privileged access lifecycle

Historically, privileged access has been described by other vendors as a separate capability from identity governance. However, at Microsoft, we think governing privileged access is a key part of identity governance -- especially given the potential for misuse associated with those admin rights can cause to an organization.
 The administrative access rights of users with those privileges need to be governed, across the employees, vendors, and contractors take on administrative rights.

Azure AD Privileged Identity Management provides additional controls tailored to securing access rights for resources, across Azure AD, Azure, and other Microsoft Online Services.  The just-in-time access, and role change alerting capabilities provided by Azure AD PIM, in addition to multi-factor authentication and conditional access, provide a comprehensive set of governance controls to secure your company’s resources – directory, Office 365, and Azure resource roles. As with other forms of access, organizations can configure recurring access recertification for all users in admin roles, using access reviews.

## Getting started

While there is no perfect solution or recommendation for every customer, the following provide a guide to what baseline policies Microsoft recommends configuring to ensure a secure and productive workforce.

- [Identity and device access configurations](/microsoft-365/enterprise/microsoft-365-policies-configurations)
- [Securing privileged access](../users-groups-roles/directory-admin-roles-secure.md)


### Access reviews

- [What is an access review?](access-reviews-overview.md)
- [Manage user access with access reviews](manage-user-access-with-access-reviews.md)
- [Manage guest access with access reviews](manage-guest-access-with-access-reviews.md)
- [Start an access review of a directory role](../privileged-identity-management/pim-how-to-start-security-review.md)

### Terms of use

- [What can I do with Terms of use?](active-directory-tou.md)

### Privileged identity management

- [What is Azure AD PIM?](../privileged-identity-management/pim-configure.md)
