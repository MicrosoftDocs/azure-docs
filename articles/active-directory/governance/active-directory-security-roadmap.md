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

A well-planned and executed identity infrastructure paves the way for stronger security and access to your productivity workloads and their data only by authenticated users and devices.

## Prerequisites

This guide assumes you have Azure AD Premium P2 licenses, Enterprise Mobility + Security E5, Microsoft 365 E5, or an equivalent license bundle.

[Azure AD licensing](https://azure.microsoft.com/pricing/details/active-directory/)

[Microsoft 365 Enterprise](https://www.microsoft.com/licensing/product-licensing/microsoft-365-enterprise.aspx)

[Enterprise Mobility + Security](https://www.microsoft.com/licensing/product-licensing/enterprise-mobility-security.aspx)

## Plan and deploy: Day 1-30

- Designate more than one global administrator (break glass account)
   - Refer to this doc: [DOC](../users-groups-roles/directory-emergency-access.md)
- Turn on Azure AD Privileged Identity Management (PIM) to view reports [DOC](../privileged-identity-management/pim-getting-started.md)
- Use non-global administrative roles where possible.
   - [DOC](../users-groups-roles/directory-assign-admin-roles.md)
   - Which specific features are needed, then you are likely needed to configure the following. Base it off golden config as an example?
- Turn on Identity Protection to view reports [DOC](../identity-protection/enable.md)
   - Remediate the users at risk (admin activity in the portal)
   - Take action on risky sign-ins (admin activity in the portal)
- Authentication
   - Enable self-service password reset [DOC](../authentication/quickstart-sspr.md)
   - Password policy - Use same guidance from PDF + below NEED A DOC
      - Do not expire passwords, do not require long passwords, password complexity replaced by password protection https://www.microsoft.com/research/publication/password-guidance/
      - Password writeback (Included in Azure AD Connect)
   - Deploy Password Protection (preview) [DOC](../authentication/concept-password-ban-bad.md)
   - For ADFS, use Smart Lockout (2016) or Extranet Lockout (2012)
      - Why we do not recommend account lockout policies (not a modern way of managing accounts)
      - Azure AD Smart Lockout for non-ADFS [DOC](../authentication/howto-password-smart-lockout.md)
   - CA based MFA [DOC](../authentication/howto-mfa-getstarted.md)
   - SSPR/MFA Converged registration [DOC](../authentication/concept-registration-mfa-sspr-converged.md)
- Azure AD Connect (PHS) [DOC](../connect/active-directory-aadconnect#install-azure-ad-connect.md)
   - Implement Password Hash Sync [DOC](../connect/active-directory-aadconnectsync-implement-password-hash-synchronization.md)
   - Implement Passwrod Writeback [DOC](../authentication/howto-sspr-writeback.md)
   - Implement Azure AD Connect Health [DOC](../connect-health/active-directory-aadconnect-health.md)
- Enable group-based licensing to assign services to your users automatically as soon as they arrive in the cloud. [DOC](../users-groups-roles/licensing-groups-assign.md)

## Plan and deploy: Day 31-90

- Enable sign in risk and user risk policy automation (based on golden config recs) NEED A DOC
- Decide on external user strategy [DOC](../b2b/what-is-b2b.md)
- Decide on user lifecycle management strategy NEED A DOC
- Decide on device join strategy [DOC](../devices/overview.md)
   - Use Azure AD Join with Windows 10 devices [DOC](../devices/azuread-joined-devices-frx.md)
- Use B2B for new external users [DOC](../b2b/add-user-without-invite.md)
   - Allow or deny specific domains [DOC](../b2b/allow-deny-list.md)
- Enable Windows Hello for Business on all Windows 10 PCs + Authenticator App for passwordless [DOC](/windows/security/identity-protection/hello-for-business/hello-identity-verification.md)

## Plan and deploy: Day 90 and beyond

- Remove just in time access eligible admins that no longer need access
   - Refer to [DOC](../privileged-identity-management/pim-how-to-add-role-to-user.md)
- Require just in time access for global administrators
   - Refer to [DOC](../privileged-identity-management/pim-how-to-add-role-to-user.md)
- Configure reoccurring access reviews for all administrator roles
   - Refer to [DOC](../privileged-identity-management/pim-how-to-start-security-review.md)
- Manage the user lifecycle holistically
   - Azure AD has an approach to managing Identity lifecycle NEED A DOC
   - Remove manual steps from your employee account lifecycle everywhere you can to prevent unauthorized access:
      - Synchronize identities from your source of truth (HR System) to Azure AD. link to supported HR systems) NEED A DOC
      - Use Dynamic Groups to automatically assign users to groups based on their attributes from HR (or your source of truth), such as department, title, region, and other attributes. [DOC](../users-groups-roles/groups-dynamic-membership.md)
      - Use group-based access management/ provisioning to automatically provision users for SaaS applications. [DOC](../manage-apps/what-is-access-management.md)
   - Migrate your external accounts to Azure AD B2B collaboration [DOC](../b2b/hybrid-cloud-to-on-premises.md)