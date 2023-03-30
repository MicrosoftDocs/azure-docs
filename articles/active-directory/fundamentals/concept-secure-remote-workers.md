---
title: Secure your organization's identities with Azure AD
description: Improve your security posture and empower users with Microsoft Azure AD.

services: active-directory
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/27/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: lhuangnorth, martinco

ms.collection: M365-identity-device-management
ms.custom: zt-include
---
# Secure your organization's identities with Azure AD

It can seem daunting trying to secure your workers in today's world, especially when you have to respond rapidly and provide access to many services quickly. This article is meant to provide a concise list of all the actions to take, helping you identify and prioritize which order to deploy the Azure Active Directory (Azure AD) features based on the license type you own. Azure AD offers many features and provides many layers of security for your Identities, navigating which feature is relevant can sometimes be overwhelming. This document is intended to help organizations deploy services quickly, with secure identities as the primary consideration. 

Each table provides a consistent security recommendation, protecting identities from common security attacks while minimizing user friction. 

The guidance helps: 

- Configure access to SaaS and on-premises applications in a secure and protected manner.
- Both cloud and hybrid identities.
- Users working remotely or in the office.

## Prerequisites

This guide assumes that your cloud only or hybrid identities have been established in Azure AD already. For help with choosing your identity type see the article, [Choose the right authentication method for your Azure Active Directory hybrid identity solution](../hybrid/choose-ad-authn.md) 

### Guided walkthrough

For a guided walkthrough of many of the recommendations in this article, see the [Set up Azure AD](https://go.microsoft.com/fwlink/?linkid=2221308) guide.

## Guidance for Azure AD Free, Office 365, or Microsoft 365 customers.

There are many recommendations that Azure AD Free, Office 365, or Microsoft 365 app customers should take to protect their user identities. The following table is intended to highlight key actions for the following license subscriptions:

- Office 365 (Office 365 E1, E3, E5, F1, A1, A3, A5)
- Microsoft 365 (Business Basic, Apps for Business, Business Standard, Business Premium, A1)
- Azure AD Free (included with Azure, Dynamics 365, Intune, and Power Platform)

| Recommended action | Detail |
| --- | --- |
| [Enable Security Defaults](concept-fundamentals-security-defaults.md) | Protect all user identities and applications by enabling MFA and blocking legacy authentication |
| [Enable Password Hash Sync](../hybrid/how-to-connect-password-hash-synchronization.md) (if using hybrid identities) | Provide redundancy for authentication and improve security (including Smart Lockout, IP Lockout, and the ability to discover leaked credentials.) |
| [Enable ADFS smart lock out](/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-smart-lockout-protection) (If applicable) | Protects your users from experiencing extranet account lockout from malicious activity. |
| [Enable Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md) (if using managed identities) | Smart lockout helps to lock out bad actors who are trying to guess your users' passwords or use brute-force methods to get in. |
| [Disable end-user consent to applications](../manage-apps/configure-user-consent.md) | The admin consent workflow gives admins a secure way to grant access to applications that require admin approval so end users don't expose corporate data. Microsoft recommends disabling future user consent operations to help reduce your surface area and mitigate this risk. |
| [Integrate supported SaaS applications from the gallery to Azure AD and enable Single sign on](../manage-apps/add-application-portal.md) | Azure AD has a gallery that contains thousands of pre-integrated applications. Some of the applications your organization uses are probably in the gallery accessible directly from the Azure portal. Provide access to corporate SaaS applications remotely and securely with improved user experience (SSO) |
| [Automate user provisioning and deprovisioning from SaaS Applications](../app-provisioning/user-provisioning.md) (if applicable) | Automatically create user identities and roles in the cloud (SaaS) applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change, increasing your organization's security. |
| [Enable Secure hybrid access: Secure legacy apps with existing app delivery controllers and networks](../manage-apps/secure-hybrid-access.md) (if applicable) | Publish and protect your on-premises and cloud legacy authentication applications by connecting them to Azure AD with your existing application delivery controller or network. |
| [Enable self-service password reset](../authentication/tutorial-enable-sspr.md) (applicable to cloud only accounts) | This ability reduces help desk calls and loss of productivity when a user can't sign into their device or an application. |
| [Use least privileged roles where possible](../roles/permissions-reference.md) | Give your administrators only the access they need to only the areas they need access to. Not all administrators need to be Global Administrators. |
| [Enable Microsoft's password guidance](https://www.microsoft.com/research/publication/password-guidance/) | Stop requiring users to change their password on a set schedule, disable complexity requirements, and your users are more apt to remember their passwords and keep them something that is secure. |

## Guidance for Azure AD Premium Plan 1 customers.

The following table is intended to highlight the key actions for the following license subscriptions:

- Azure Active Directory Premium P1 (Azure AD P1)
- Enterprise Mobility + Security (EMS E3)
- Microsoft 365 (E3, A3, F1, F3)

| Recommended action | Detail |
| --- | --- |
| [Create more than one Global Administrator](../roles/security-emergency-access.md) | Assign at least two cloud-only permanent Global Administrator accounts for use in an emergency. These accounts aren't to be used daily and should have long and complex passwords. |
| [Enable combined registration experience for Azure AD MFA and SSPR to simplify user registration experience](../authentication/howto-registration-mfa-sspr-combined.md) | Allow your users to register from one common experience for both Azure AD Multi-Factor Authentication and self-service password reset. |
| [Configure MFA settings for your organization](../authentication/howto-mfa-getstarted.md) | Ensure accounts are protected from being compromised with multi-factor authentication |
| [Enable self-service password reset](../authentication/tutorial-enable-sspr.md) | This ability reduces help desk calls and loss of productivity when a user can't sign into their device or an application |
| [Implement Password Writeback](../authentication/tutorial-enable-sspr-writeback.md) (if using hybrid identities) | Allow password changes in the cloud to be written back to an on-premises Windows Server Active Directory environment. |
| Create and enable Conditional Access policies | [MFA for admins to protect accounts that are assigned administrative rights.](../conditional-access/howto-conditional-access-policy-admin-mfa.md) <br><br> [Block legacy authentication protocols due to the increased risk associated with legacy authentication protocols.](../conditional-access/howto-conditional-access-policy-block-legacy.md) <br><br> [MFA for all users and applications to create a balanced MFA policy for your environment, securing your users and applications.](../conditional-access/howto-conditional-access-policy-all-users-mfa.md) <br><br> [Require MFA for Azure Management to protect your privileged resources by requiring multi-factor authentication for any user accessing Azure resources.](../conditional-access/howto-conditional-access-policy-azure-management.md) |
| [Enable Password Hash Sync](../hybrid/how-to-connect-password-hash-synchronization.md) (if using hybrid identities) | Provide redundancy for authentication and improve security (including Smart Lockout, IP Lockout, and the ability to discover leaked credentials.) |
| [Enable ADFS smart lock out](/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-smart-lockout-protection) (If applicable) | Protects your users from experiencing extranet account lockout from malicious activity. |
| [Enable Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md) (if using managed identities) | Smart lockout  helps to lock out bad actors who are trying to guess your users' passwords or use brute-force methods to get in. |
| [Disable end-user consent to applications](../manage-apps/configure-user-consent.md) | The admin consent workflow gives admins a secure way to grant access to applications that require admin approval so end users don't expose corporate data. Microsoft recommends disabling future user consent operations to help reduce your surface area and mitigate this risk. |
| [Enable remote access to on-premises legacy applications with Application Proxy](../app-proxy/application-proxy-add-on-premises-application.md) | Enable Azure AD Application Proxy and integrate with legacy apps for users to securely access on-premises applications by signing in with their Azure AD account. |
| [Enable Secure hybrid access: Secure legacy apps with existing app delivery controllers and networks](../manage-apps/secure-hybrid-access.md) (if applicable). | Publish and protect your on-premises and cloud legacy authentication applications by connecting them to Azure AD with your existing application delivery controller or network. |
| [Integrate supported SaaS applications from the gallery to Azure AD and enable Single sign on](../manage-apps/add-application-portal.md) | Azure AD has a gallery that contains thousands of pre-integrated applications. Some of the applications your organization uses are probably in the gallery accessible directly from the Azure portal. Provide access to corporate SaaS applications remotely and securely with improved user experience (SSO). |
| [Automate user provisioning and deprovisioning from SaaS Applications](../app-provisioning/user-provisioning.md) (if applicable) | Automatically create user identities and roles in the cloud (SaaS) applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change, increasing your organization's security. |
| [Enable Conditional Access – Device based](../conditional-access/require-managed-devices.md) | Improve security and user experiences with device-based Conditional Access. This step ensures users can only access from devices that meet your standards for security and compliance. These devices are also known as managed devices. Managed devices can be Intune compliant or Hybrid Azure AD joined devices. |
| [Enable Password Protection](../authentication/howto-password-ban-bad-on-premises-deploy.md) | Protect users from using weak and easy to guess passwords. |
| [Use least privileged roles where possible](../roles/permissions-reference.md) | Give your administrators only the access they need to only the areas they need access to. Not all administrators need to be Global Administrators. |
| [Enable Microsoft's password guidance](https://www.microsoft.com/research/publication/password-guidance/) | Stop requiring users to change their password on a set schedule, disable complexity requirements, and your users are more apt to remember their passwords and keep them something that is secure. |
| [Create an organization specific custom banned password list](../authentication/tutorial-configure-custom-password-protection.md) | Prevent users from creating passwords that include common words or phrases from your organization or area. |
| [Deploy passwordless authentication methods for your users](../authentication/concept-authentication-passwordless.md) | Provide your users with convenient passwordless authentication methods |
| [Create a plan for guest user access](../external-identities/what-is-b2b.md) | Collaborate with guest users by letting them sign into your apps and services with their own work, school, or social identities. |

## Guidance for Azure AD Premium Plan 2 customers.

The following table is intended to highlight the key actions for the following license subscriptions:

- Azure Active Directory Premium P2 (Azure AD P2)
- Enterprise Mobility + Security (EMS E5)
- Microsoft 365 (E5, A5)

| Recommended action | Detail |
| --- | --- |
| [Create more than one Global Administrator](../roles/security-emergency-access.md) | Assign at least two cloud-only permanent Global Administrator accounts for use in an emergency. These accounts aren't to be used daily and should have long and complex passwords. |
| [Enable combined registration experience for Azure AD MFA and SSPR to simplify user registration experience](../authentication/howto-registration-mfa-sspr-combined.md) | Allow your users to register from one common experience for both Azure AD Multi-Factor Authentication and self-service password reset. |
| [Configure MFA settings for your organization](../authentication/howto-mfa-getstarted.md) | Ensure accounts are protected from being compromised with multi-factor authentication |
| [Enable self-service password reset](../authentication/tutorial-enable-sspr.md) | This ability reduces help desk calls and loss of productivity when a user can't sign into their device or an application |
| [Implement Password Writeback](../authentication/tutorial-enable-sspr-writeback.md) (if using hybrid identities) | Allow password changes in the cloud to be written back to an on-premises Windows Server Active Directory environment. |
| [Enable Identity Protection policies to enforce MFA registration](../identity-protection/howto-identity-protection-configure-mfa-policy.md) | Manage the roll-out of Azure AD Multi-Factor Authentication (MFA). |
| [Enable Identity Protection user and sign-in risk policies](../identity-protection/howto-identity-protection-configure-risk-policies.md) | Enable Identity Protection User and Sign-in policies. The recommended sign-in policy is to target medium risk sign-ins and require MFA. For User policies, you should target high risk users requiring the password change action. |
| Create and enable Conditional Access policies | [MFA for admins to protect accounts that are assigned administrative rights.](../conditional-access/howto-conditional-access-policy-admin-mfa.md) <br><br> [Block legacy authentication protocols due to the increased risk associated with legacy authentication protocols.](../conditional-access/howto-conditional-access-policy-block-legacy.md) <br><br> [Require MFA for Azure Management to protect your privileged resources by requiring multi-factor authentication for any user accessing Azure resources.](../conditional-access/howto-conditional-access-policy-azure-management.md) |
| [Enable Password Hash Sync](../hybrid/how-to-connect-password-hash-synchronization.md) (if using hybrid identities) | Provide redundancy for authentication and improve security (including Smart Lockout, IP Lockout, and the ability to discover leaked credentials.) |
| [Enable ADFS smart lock out](/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-smart-lockout-protection) (If applicable) | Protects your users from experiencing extranet account lockout from malicious activity. |
| [Enable Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md) (if using managed identities) | Smart lockout  helps to lock out bad actors who are trying to guess your users' passwords or use brute-force methods to get in. |
| [Disable end-user consent to applications](../manage-apps/configure-user-consent.md) | The admin consent workflow gives admins a secure way to grant access to applications that require admin approval so end users don't expose corporate data. Microsoft recommends disabling future user consent operations to help reduce your surface area and mitigate this risk. |
| [Enable remote access to on-premises legacy applications with Application Proxy](../app-proxy/application-proxy-add-on-premises-application.md) | Enable Azure AD Application Proxy and integrate with legacy apps for users to securely access on-premises applications by signing in with their Azure AD account. |
| [Enable Secure hybrid access: Secure legacy apps with existing app delivery controllers and networks](../manage-apps/secure-hybrid-access.md) (if applicable). | Publish and protect your on-premises and cloud legacy authentication applications by connecting them to Azure AD with your existing application delivery controller or network. |
| [Integrate supported SaaS applications from the gallery to Azure AD and enable Single sign on](../manage-apps/add-application-portal.md) | Azure AD has a gallery that contains thousands of pre-integrated applications. Some of the applications your organization uses are probably in the gallery accessible directly from the Azure portal. Provide access to corporate SaaS applications remotely and securely with improved user experience (SSO). |
| [Automate user provisioning and deprovisioning from SaaS Applications](../app-provisioning/user-provisioning.md) (if applicable) | Automatically create user identities and roles in the cloud (SaaS) applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change, increasing your organization's security. |
| [Enable Conditional Access – Device based](../conditional-access/require-managed-devices.md) | Improve security and user experiences with device-based Conditional Access. This step ensures users can only access from devices that meet your standards for security and compliance. These devices are also known as managed devices. Managed devices can be Intune compliant or Hybrid Azure AD joined devices. |
| [Enable Password Protection](../authentication/howto-password-ban-bad-on-premises-deploy.md) | Protect users from using weak and easy to guess passwords. |
| [Use least privileged roles where possible](../roles/permissions-reference.md) | Give your administrators only the access they need to only the areas they need access to. Not all administrators need to be Global Administrators. |
| [Enable Microsoft's password guidance](https://www.microsoft.com/research/publication/password-guidance/) | Stop requiring users to change their password on a set schedule, disable complexity requirements, and your users are more apt to remember their passwords and keep them something that is secure. |
| [Create an organization specific custom banned password list](../authentication/tutorial-configure-custom-password-protection.md) | Prevent users from creating passwords that include common words or phrases from your organization or area. |
| [Deploy passwordless authentication methods for your users](../authentication/concept-authentication-passwordless.md) | Provide your users with convenient passwordless authentication methods |
| [Create a plan for guest user access](../external-identities/what-is-b2b.md) | Collaborate with guest users by letting them sign into your apps and services with their own work, school, or social identities. |
| [Enable Privileged Identity Management](../privileged-identity-management/pim-configure.md) | Enables you to manage, control, and monitor access to important resources in your organization, ensuring admins have access only when needed and with approval |
| [Complete an access review for Azure AD directory roles in PIM](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md) | Work with your security and leadership teams to create an access review policy to review administrative access based on your organization's policies. |

[!INCLUDE [active-directory-zero-trust](../../../includes/active-directory-zero-trust.md)]

## Next steps

- For detailed deployment guidance for individual features of Azure AD, review the [Azure AD project deployment plans](active-directory-deployment-plans.md).
- Organizations can use [identity secure score](identity-secure-score.md) to track their progress against other Microsoft recommendations.
