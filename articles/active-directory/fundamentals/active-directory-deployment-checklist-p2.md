---
title: Azure AD deployment checklist
description: Azure Active Directory feature deployment checklist

services: active-directory
ms.service: active-directory
ms.subservice: 
ms.topic: conceptual
ms.date: 01/08/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer:

ms.collection: M365-identity-device-management
---
# Azure Active Directory feature deployment guide

It can seem daunting to deploy Azure Active Directory (Azure AD) for your organization and keep it secure. This article identifies common tasks that customers find helpful to complete in phases, over the course of 30, 60, 90 days, or more, to enhance their security posture. Even organizations who have already deployed Azure AD can use this guide to ensure they are getting the most out of their investment.

A well-planned and executed identity infrastructure paves the way for secure access to your productivity workloads and data by known users and devices only.

Additionally customers can check their [identity secure score](identity-secure-score.md) to see how aligned they are to Microsoft best practices. Check your secure score before and after implementing these recommendations to see how well you are doing compared to others in your industry and to other organizations of your size.

## Prerequisites

Many of the recommendations in this guide can be implemented with Azure AD Free, Basic, or no license at all. Where licenses are required we state which license is required at minimum to accomplish the task.

Additional information about licensing can be found on the following pages:

* [Azure AD licensing](https://azure.microsoft.com/pricing/details/active-directory/)
* [Microsoft 365 Enterprise](https://www.microsoft.com/en-us/licensing/product-licensing/microsoft-365-enterprise)
* [Enterprise Mobility + Security](https://www.microsoft.com/en-us/licensing/product-licensing/enterprise-mobility-security)
* [Azure AD B2B licensing guidance](../b2b/licensing-guidance.md)

## Phase 1: Build a foundation of security

In this phase, administrators enable baseline security features to create a more secure and easy to use foundation in Azure AD before we import or create normal user accounts. This foundational phase ensures you are in a more secure state from the start and that your end-users only have to be introduced to new concepts one time.

| Task | Detail | Required license |
| ---- | ------ | ---------------- |
| [Designate more than one global administrator](../users-groups-roles/directory-emergency-access.md) | Assign at least two cloud-only permanent global administrator accounts for use if there is an emergency. These accounts are not be used daily and should have long and complex passwords. | Azure AD Free |
| [Use non-global administrative roles where possible](../users-groups-roles/directory-assign-admin-roles.md) | Give your administrators only the access they need to only the areas they need access to. Not all administrators need to be global administrators. | Azure AD Free |
| [Enable Privileged Identity Management for tracking admin role use](../privileged-identity-management/pim-getting-started.md) | Enable Privileged Identity Management to start tracking administrative role usage. | Azure AD Premium P2 |
| [Roll out self-service password reset](../authentication/howto-sspr-deployment.md) | Reduce helpdesk calls for password resets by allowing staff to reset their own passwords using policies you as an administrator control. | Azure AD Basic |
| [Create an organization specific custom banned password list](../authentication/howto-password-ban-bad-configure.md) | Prevent users from creating passwords that include common words or phrases from your organization or area. | Azure AD Basic |
| [Enable on-premises integration with Azure AD password protection](../authentication/concept-password-ban-bad-on-premises.md) | Extend the banned password list to your on-premises directory, to ensure passwords set on-premises are also in compliance with the global and tenant-specific banned password lists. | Azure AD Premium P1 |
| [Enable Microsoft's password guidance](https://www.microsoft.com/research/publication/password-guidance/) | Stop requiring users to change their password on a set schedule, disable complexity requirements, and your users are more apt to remember their passwords and keep them something that is secure. | Azure AD Free |
| [Disable periodic password resets for cloud-based user accounts](../authentication/concept-sspr-policy.md#set-a-password-to-never-expire) | Periodic password resets encourage your users to increment their existing passwords. Use the guidelines in Microsoft's password guidance doc and mirror your on-premises policy to cloud-only users. | Azure AD Free |
| [Customize Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md) | Stop lockouts from cloud-based users from being replicated to on-premises Active Directory users | Azure AD Basic |
| [Enable Extranet Smart Lockout for AD FS](/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-smart-lockout-protection) | AD FS extranet lockout protects against brute force password guessing attacks, while letting valid AD FS users continue to use their accounts. | |
| [Deploy Azure AD Multi-Factor Authentication using Conditional Access policies](../authentication/howto-mfa-getstarted.md) | Require users to perform two-step verification when accessing sensitive applications using Conditional Access policies. | Azure AD Premium P1 |
| [Enable Azure Active Directory Identity Protection](../identity-protection/enable.md) | Enable tracking of risky sign-ins and compromised credentials for users in your organization. | Azure AD Premium P2 |
| [Use risk events to trigger multi-factor authentication and password changes](../authentication/tutorial-risk-based-sspr-mfa.md) | Enable automation that can trigger events such as multi-factor authentication, password reset, and blocking of sign-ins based on risk. | Azure AD Premium P2 |
| [Enable converged registration for self-service password reset and Azure AD Multi-Factor Authentication (preview)](../authentication/concept-registration-mfa-sspr-converged.md) | Allow your users to register from one common experience for both Azure Multi-Factor Authentication and self-service password reset. | Azure AD Premium P1 |

## Phase 2: Import users, enable synchronization, and manage devices

Next, we add to the foundation laid in phase 1 by importing our users and enabling synchronization, planning for guest access, and preparing to support additional functionality.

| Task | Detail | Required license |
| ---- | ------ | ---------------- |
| [Install Azure AD Connect](../connect/active-directory-aadconnect-select-installation.md) | Prepare to synchronize users from your existing on-premises directory to the cloud. | Azure AD Free |
| [Implement Password Hash Sync](../connect/active-directory-aadconnectsync-implement-password-hash-synchronization.md) | Synchronize password hashes to allow password changes to be replicated, bad password detection and remediation, and leaked credential reporting. | Azure AD Free |
| [Implement Password Writeback](../authentication/howto-sspr-writeback.md) | Allow password changes in the cloud to be written back to an on-premises Windows Server Active Directory environment. | Azure AD Premium P1 |
| [Implement Azure AD Connect Health](../connect-health/active-directory-aadconnect-health.md) | Enable monitoring of key health statistics for your Azure AD Connect servers, AD FS servers, and domain controllers. | Azure AD Premium P1 |
| [Assign licenses to users by group membership in Azure Active Directory](../users-groups-roles/licensing-groups-assign.md) | Save time and effort by creating licensing groups that enable or disable features by group instead of setting per user. | |
| [Create a plan for guest user access](../b2b/what-is-b2b.md) | Collaborate with guest users by letting them sign in to your apps and services with their own work, school, or social identities. | [Azure AD B2B licensing guidance](../b2b/licensing-guidance.md) |
| [Decide on device management strategy](../devices/overview.md) | Decide what your organization allows regarding devices. Registering vs joining, Bring Your Own Device vs company provided. | |
| [Deploy Windows Hello for Business in your organization](/windows/security/identity-protection/hello-for-business/hello-manage-in-organization) | Prepare for password-less authentication using Windows Hello | |

## Phase 3: Manage applications

As we continue to build on the previous phases, we identify candidate applications for migration and integration with Azure AD and complete the setup of those applications.

| Task | Detail | Required license |
| ---- | ------ | ---------------- |
| Identify your applications | Identify applications in use in your organization: on-premises, SaaS applications in the cloud, and other line-of-business applications. Determine if these applications can and should be managed with Azure AD. | No license required |
| [Integrate supported SaaS applications in the gallery](../manage-apps/add-application-portal.md) | Azure AD has a gallery that contains thousands of pre-integrated applications. Some of the applications your organization uses are probably in the gallery accessible directly from the Azure portal. | Azure AD Free |
| [Use Application Proxy to integrate on-premises applications](../manage-apps/application-proxy-add-on-premises-application.md) | Application Proxy enables users to access on-premises applications by signing in with their Azure AD account. | Azure AD Basic |

## Phase 4: Audit privileged identities, complete an access review, and manage user lifecycle

Phase 4 sees administrators enforcing least privilege principles for administration, completing their first access reviews, and enabling automation of common user lifecycle tasks.

| Task | Detail | Required license |
| ---- | ------ | ---------------- |
| [Enforce the use of Privileged Identity Management](../privileged-identity-management/pim-security-wizard.md) | Remove administrative roles from normal day to day user accounts. Make administrative users eligible to use their role after succeeding a multi-factor authentication check, providing a business justification, or requesting approval from designated approvers. | Azure AD Premium P2 |
| [Complete an access review for Azure AD directory roles in PIM](../privileged-identity-management/pim-how-to-start-security-review.md) | Work with your security and leadership teams to create an access review policy to review administrative access based on your organization's policies. | Azure AD Premium P2 |
| [Implement dynamic group membership policies](../users-groups-roles/groups-dynamic-membership.md) | Use dynamic groups to automatically assign users to groups based on their attributes from HR (or your source of truth), such as department, title, region, and other attributes. |  |
| [Implement group based application provisioning](../manage-apps/what-is-access-management.md) | Use group-based access management provisioning to automatically provision users for SaaS applications. |  |
| [Automate user provisioning and deprovisioning](../manage-apps/user-provisioning.md) | Remove manual steps from your employee account lifecycle to prevent unauthorized access. Synchronize identities from your source of truth (HR System) to Azure AD. |  |

## Next steps

[Azure AD licensing and pricing details](https://azure.microsoft.com/pricing/details/active-directory/)

[Identity and device access configurations](https://docs.microsoft.com/microsoft-365/enterprise/microsoft-365-policies-configurations)

[Common recommended identity and device access policies](https://docs.microsoft.com/microsoft-365/enterprise/identity-access-policies)
