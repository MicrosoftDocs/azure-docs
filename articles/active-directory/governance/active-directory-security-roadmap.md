---
title: Azure AD deployment checklist 30 days, 90 days, and beyond
description: Azure Active Directory Premium P2 feature deployment checklist

services: active-directory
ms.service: active-directory
ms.component: 
ms.topic: conceptual
ms.date: 09/17/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer:

---
# Azure Active Directory Premium P2 licensing feature checklist

It can seem daunting to deploy Azure Active Directory (Azure AD) for your organization and keep it secure. This article identifies some common tasks that customers find helpful to complete over the course of 30 days, 90 days, or beyond to enhance their security posture. Even organizations who have already deployed Azure AD can use this checklist to ensure they are getting the most out of their investment.

A well-planned and executed identity infrastructure paves the way for more secure access to your productivity workloads and data only by authenticated users and devices.

## Prerequisites

This guide assumes you have Azure AD Premium P2 licenses, Enterprise Mobility + Security E5, Microsoft 365 E5, or an equivalent license bundle.

[Azure AD licensing](https://azure.microsoft.com/pricing/details/active-directory/)

[Microsoft 365 Enterprise](https://www.microsoft.com/licensing/product-licensing/microsoft-365-enterprise.aspx)

[Enterprise Mobility + Security](https://www.microsoft.com/licensing/product-licensing/enterprise-mobility-security.aspx)

## Plan and deploy: Day 1-30

- Designate more than one global administrator (break-glass account)
   - [Manage emergency-access administrative accounts in Azure AD](../users-groups-roles/directory-emergency-access.md)
- Turn on Azure AD Privileged Identity Management (PIM) to view reports
   - [Start using PIM](../privileged-identity-management/pim-getting-started.md)
- Use non-global administrative roles where possible.
   - [Assigning administrator roles in Azure Active Directory](../users-groups-roles/directory-assign-admin-roles.md)
- Authentication
   - [Roll out self-service password reset](../authentication/howto-sspr-deployment.md)
   - Deploy Azure AD Password Protection (preview)
      - [Eliminate bad passwords in your organization](../authentication/concept-password-ban-bad.md)
      - [Enforce Azure AD password protection for Windows Server Active Directory](../authentication/concept-password-ban-bad-on-premises.md)
   - Configure account lockout policies
      - [Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md)
      - [AD FS Extranet Lockout and Extranet Smart Lockout](/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-smart-lockout-protection)
   - [Deploy Azure AD Multi-Factor Authentication using conditional access policies](../authentication/howto-mfa-getstarted.md)
   - [Enable converged registration for self-service password reset and Azure AD Multi-Factor Authentication (preview)](../authentication/concept-registration-mfa-sspr-converged.md)
   - [Enable Azure Active Directory Identity Protection](../identity-protection/enable.md)
      - [Use risk events to trigger Multi-Factor Authentication and password changes](../authentication/tutorial-risk-based-sspr-mfa.md)
   - [Password guidance](https://www.microsoft.com/research/publication/password-guidance/)
      - Maintain an eight-character minimum length requirement, longer is not necessarily better.
      - Eliminate character-composition requirements.
      - [Eliminate mandatory periodic password resets for user accounts.](../authentication/concept-sspr-policy.md#set-a-password-to-never-expire)
- Synchronize users from on-premises Active Directory
   - [Install Azure AD Connect](../connect/active-directory-aadconnect-select-installation.md)
   - [Implement Password Hash Sync](../connect/active-directory-aadconnectsync-implement-password-hash-synchronization.md)
   - [Implement Password Writeback](../authentication/howto-sspr-writeback.md)
   - [Implement Azure AD Connect Health](../connect-health/active-directory-aadconnect-health.md)
- [Assign licenses to users by group membership in Azure Active Directory](../users-groups-roles/licensing-groups-assign.md)

## Plan and deploy: Day 31-90

- [Plan for guest user access](../b2b/what-is-b2b.md)
   - [Add Azure Active Directory B2B collaboration users in the Azure portal](../b2b/add-users-administrator.md)
   - [Allow or block invitations to B2B users from specific organizations](../b2b/allow-deny-list.md)
   - [Grant B2B users in Azure AD access to your on-premises applications](../b2b/hybrid-cloud-to-on-premises.md)
- Make decisions about user lifecycle management strategy
- [Decide on device managment strategy](../devices/overview.md)
   - [Usage scenarios and deployment considerations for Azure AD Join](../devices/azureadjoin-plan.md)
- [Manage Windows Hello for Business in your organization](/windows/security/identity-protection/hello-for-business/hello-manage-in-organization)

## Plan and deploy: Day 90 and beyond

- [Azure AD Privileged Identity Management](../privileged-identity-management/pim-configure.md)
   - [Configure Azure AD directory role settings in PIM](../privileged-identity-management/pim-how-to-change-default-settings.md)
   - [Assign Azure AD directory roles in PIM](../privileged-identity-management/pim-how-to-add-role-to-user.md)
- [Complete an access review for Azure AD directory roles in PIM](../privileged-identity-management/pim-how-to-start-security-review.md)
- Manage the user lifecycle holistically
   - Azure AD has an approach to managing Identity lifecycle
   - Remove manual steps from your employee account lifecycle, to prevent unauthorized access:
      - Synchronize identities from your source of truth (HR System) to Azure AD. link to supported HR systems)
      - [Use Dynamic Groups to automatically assign users to groups based on their attributes from HR (or your source of truth), such as department, title, region, and other attributes.](../users-groups-roles/groups-dynamic-membership.md)
      - [Use group-based access management provisioning to automatically provision users for SaaS applications.](../manage-apps/what-is-access-management.md)

## Next steps

[Identity and device access configurations](https://docs.microsoft.com/microsoft-365/enterprise/microsoft-365-policies-configurations)

[Common recommended identity and device access policies](https://docs.microsoft.com/microsoft-365/enterprise/identity-access-policies)
