---
title: Rapid response to secure identities with Azure Active Directory
description: Rapidly respond to threats with Azure AD cloud-based identities

services: active-directory
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 04/09/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: davidspo

ms.collection: M365-identity-device-management
---
# Rapid response to secure identities with Azure AD

It can seem daunting trying to secure your workers in today's world, especially when you have to respond rapidly and provide access to many services quickly. This article is meant to provide a concise list of all the actions to take, helping you identify and prioritize which order to deploy the Azure AD features based on the license type you own. Azure AD offers many features and provides many layers of security for your Identities, navigating which feature is relevant can sometimes be overwhelming. Many organizations are already in the cloud or moving quickly to the cloud, this document is intended to allow you to deploy services quickly, with securing your identities as the primary consideration. 

Each table provides a consistent security recommendation, protecting both Administrator and User identities from the main security attacks (breach replay, phishing, and password spray) while minimizing the user impact and improving the user experience. 

The guidance will also allow administrators to configure access to SaaS and on prem applications in a secure and protected manner and is applicable to either cloud or hybrid (synced) identities and applies to users working remotely or in the office.

This guide is not intended to provide guidance at the device, application or data layer. To secure devices or applications please refer to the following documents  xxxxxxxx.

This checklist will help you quickly deploy critical recommended actions to protect your organization immediately by explaining how to:

- Strengthen your credentials.
- Reduce your attack surface area.
- Automate threat response.
- Utilize cloud intelligence.
- Enable end-user self-service.

## Secure Access for remote workers 

\* requires Azure AD premium P1 licenses.
\** requires Azure AD premium P2 licenses.

### Guidance for Azure AD Free or Office 365 customers.

There are a number of recommendations that Azure AD Free or OFFICE 365 app customers should take to protect their user identities, the following table is intended to highlight the key actions for the following license subscriptions:

- Office 365 (O365 E1 / E3 / E5 / F1 / A1 /A3 /A5)
- Office 365 Business (Essentials / Business /Business Premium)
- Microsoft 365 (M365 Business / A1)
- Azure AD free (included with Azure, Dynamics 365, Intune and Power Platform

#### Azure AD Free Customers / OFFICE 365 APPS (O365 E1, E3, E5, F1, A1)

| Recommended action | Detail |
| --- | --- |
| [Enable Security Defaults](concept-fundamentals-security-defaults.md) | Protect all user identities and applications by enabling MFA and blocking legacy authentication |
| [Enable Password Hash Sync](../hybrid/how-to-connect-password-hash-synchronization.md) (if using hybrid identities) | Provide redundancy for authentication and improve security (including Smart Lockout, IP Lockout, and the ability to discover leaked credentials.) |
| [Enable ADFS smart lock out](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-smart-lockout-protection) (If applicable) | Protects your users from experiencing extranet account lockout from malicious activity. |
| [Enable Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md) (if using hybrid identities) | Smart lockout assists in locking out bad actors who are trying to guess your users' passwords or use brute-force methods to get in. |
| [Disable end-user consent to applications](../manage-apps/configure-user-consent.md) | The admin consent workflow gives admins a secure way to grant access to applications that require admin approval so end users do not expose corporate data. Microsoft recommends disabling future user consent operations to help reduce your surface area and mitigate this risk. |
| [Integrate supported SaaS applications from the gallery to Azure AD and enable Single sign on](../manage-apps/add-application-portal.md) | Azure AD has a gallery that contains thousands of pre-integrated applications. Some of the applications your organization uses are probably in the gallery accessible directly from the Azure portal. Provide access to corporate SaaS applications remotely and securely with improved user experience (SSO) |
| [Enable Secure hybrid access: Secure legacy apps with existing app delivery controllers and networks](../manage-apps/secure-hybrid-access.md) (if applicable) | Publish and protect your on-premises and cloud legacy authentication applications by connecting them to Azure AD with your existing application delivery controller or network. |
| [Enable self-service password reset](../authentication/tutorial-enable-sspr.md) (applicable to cloud only accounts) | This ability reduces help desk calls and loss of productivity when a user cannot sign into their device or an application. (applicable to cloud only accounts) |
| [Use non-global administrative roles where possible](../users-groups-roles/directory-assign-admin-roles.md) | Give your administrators only the access they need to only the areas they need access to. Not all administrators need to be global administrators. |
| [Enable Microsoft's password guidance](https://www.microsoft.com/research/publication/password-guidance/) | Stop requiring users to change their password on a set schedule, disable complexity requirements, and your users are more apt to remember their passwords and keep them something that is secure. |
| [Automate user provisioning and deprovisioning from SaaS Applications](../app-provisioning/user-provisioning.md) (if applicable) | Automatically create user identities and roles in the cloud (SaaS) applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change, increasing your organization's security. |

### Secure guidance for Azure AD Premium Plan 1 customers.

The following table is intended to highlight the key actions for the following license subscriptions:

- Azure Active Directory Premium P1 (Azure AD P1)
- Enterprise, Mobility and Security (EMS E3)
- Microsoft 365 (M365 E3 / A3 / F1 / F3)

#### PREMIUM P1 (AADP P1/ M365 E3/A3, EMS E3)

| Recommended action | Detail |
| --- | --- |
| [Enable combined registration experience for Azure MFA and SSPR to simplify user registration experience](../authentication/howto-registration-mfa-sspr-combined.md) | Setup registration and enrollment for users with authenticator app using the combined registration experience. |
| [Enable self-service password reset](../authentication/tutorial-enable-sspr.md) | This ability reduces help desk calls and loss of productivity when a user cannot sign into their device or an application |
| [Configure MFA settings for your organization](../authentication/howto-mfa-getstarted.md) | Ensure accounts are protected from being compromised with multi-factor authentication |
| Create and enable Conditional Access policies | [MFA for admins to protect accounts that are assigned administrative rights.](../conditional-access/howto-conditional-access-policy-admin-mfa.md) <br><br> [Block legacy authentication protocols due to the increased risk associated with legacy authentication protocols.](../conditional-access/howto-conditional-access-policy-block-legacy.md) <br><br> [MFA for all users and applications to create a balanced MFA policy for your environment, securing your users and applications.](../conditional-access/howto-conditional-access-policy-all-users-mfa.md) <br><br> [Require MFA for Azure Management to protect your privileged resources by requiring multi-factor authentication for any user accessing Azure resources.](../conditional-access/howto-conditional-access-policy-azure-management.md) |
| [Enable Password Hash Sync](../hybrid/how-to-connect-password-hash-synchronization.md) (if using hybrid identities) | Provide redundancy for authentication and improve security (including Smart Lockout, IP Lockout, and the ability to discover leaked credentials.) |
| [Enable ADFS smart lock out](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-smart-lockout-protection) (If applicable) | Protects your users from experiencing extranet account lockout from malicious activity. |
| [Enable Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md) (if using hybrid identities) | Smart lockout assists in locking out bad actors who are trying to guess your users' passwords or use brute-force methods to get in. |
| [Disable end-user consent to applications](../manage-apps/configure-user-consent.md) | The admin consent workflow gives admins a secure way to grant access to applications that require admin approval so end users do not expose corporate data. Microsoft recommends disabling future user consent operations to help reduce your surface area and mitigate this risk. |
| [Enable remote access to on-premises legacy applications with Application Proxy](../manage-apps/application-proxy-add-on-premises-application.md) | Enable Azure AD Application Proxy and integrate with legacy apps for users to securely access on-premises applications by signing in with their Azure AD account. |
| [Enable Secure hybrid access: Secure legacy apps with existing app delivery controllers and networks](../manage-apps/secure-hybrid-access.md) (if applicable). | Publish and protect your on-premises and cloud legacy authentication applications by connecting them to Azure AD with your existing application delivery controller or network. |
| [Implement Password Writeback](../authentication/tutorial-enable-sspr-writeback.md) (if using hybrid identities) | Allow password changes in the cloud to be written back to an on-premises Windows Server Active Directory environment. |
| [Integrate supported SaaS applications from the gallery to Azure AD and enable Single sign on](../manage-apps/add-application-portal.md) | Azure AD has a gallery that contains thousands of pre-integrated applications. Some of the applications your organization uses are probably in the gallery accessible directly from the Azure portal. Provide access to corporate SaaS applications remotely and securely with improved user experience (SSO). |
| [Enable Conditional Access – Device based](../conditional-access/require-managed-devices.md) | Improve security and user experiences with device based Conditional Access. This ensures users can only access from devices that meet your standards for security and compliance. These devices are also known as managed devices. Managed devices can be Intune compliant or Hybrid Azure AD joined devices. |
| [Enable Password Protection](../authentication/howto-password-ban-bad-on-premises-deploy.md) | Protect users from using weak and easy to guess passwords. |
| [Designate more than one global administrator](../users-groups-roles/directory-emergency-access.md) | Assign at least two cloud-only permanent global administrator accounts for use if there is an emergency. These accounts are not be used daily and should have long and complex passwords. Break Glass Accounts ensure you can access the service in an emergency. |
| [Use non-global administrative roles where possible](../users-groups-roles/directory-assign-admin-roles.md) | Give your administrators only the access they need to only the areas they need access to. Not all administrators need to be global administrators. |
| [Enable Microsoft's password guidance](https://www.microsoft.com/research/publication/password-guidance/) | Stop requiring users to change their password on a set schedule, disable complexity requirements, and your users are more apt to remember their passwords and keep them something that is secure. |
| [Automate user provisioning and deprovisioning from SaaS Applications](../app-provisioning/user-provisioning.md) (if applicable) | Automatically create user identities and roles in the cloud (SaaS) applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change, increasing your organization's security. |
| [Create a plan for guest user access](../b2b/what-is-b2b.md) | Collaborate with guest users by letting them sign into your apps and services with their own work, school, or social identities. |

### Secure guidance for Azure AD Premium Plan 2 customers.

The following table is intended to highlight the key actions for the following license subscriptions:

- Azure Active Directory Premium P2 (Azure AD P2)
- Enterprise, Mobility and Security (EMS E5)
- Microsoft 365 (M365 E5 / A5)

#### PREMIUM P2 (AADP P2/ M365 E5/A5, EMS E5)

| Recommended action | Detail |
| --- | --- |
| [Enable combined registration experience for Azure MFA and SSPR to simplify user registration experience](../authentication/howto-registration-mfa-sspr-combined.md) | Setup registration and enrollment for users with authenticator app using the combined registration experience. |
| [Enable self-service password reset](../authentication/tutorial-enable-sspr.md) | This ability reduces help desk calls and loss of productivity when a user cannot sign into their device or an application |
| [Configure MFA settings for your organization](../authentication/howto-mfa-getstarted.md) | Ensure accounts are protected from being compromised with multi-factor authentication |
| [Enable Identity Protection policies to enforce MFA registration](../identity-protection/howto-identity-protection-configure-mfa-policy.md) | Manage the roll-out of Azure Multi-Factor Authentication (MFA). |
| [Enable user and sign-in risk policies](../identity-protection/howto-identity-protection-configure-risk-policies.md) | Enable the sign-in policy to target medium risk sign-ins and require MFA. Require multi-factor authentication and password change to target high risk. |
| Create and enable Conditional Access policies | [MFA for admins to protect accounts that are assigned administrative rights.](../conditional-access/howto-conditional-access-policy-admin-mfa.md) <br><br> [Block legacy authentication protocols due to the increased risk associated with legacy authentication protocols.](../conditional-access/howto-conditional-access-policy-block-legacy.md) <br><br> [Require MFA for Azure Management to protect your privileged resources by requiring multi-factor authentication for any user accessing Azure resources.](../conditional-access/howto-conditional-access-policy-azure-management.md) |
| [Enable Password Hash Sync](../hybrid/how-to-connect-password-hash-synchronization.md) (if using hybrid identities) | Provide redundancy for authentication and improve security (including Smart Lockout, IP Lockout, and the ability to discover leaked credentials.) |
| [Enable ADFS smart lock out](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-smart-lockout-protection) (If applicable) | Protects your users from experiencing extranet account lockout from malicious activity. |
| [Enable Azure Active Directory smart lockout](../authentication/howto-password-smart-lockout.md) (if using hybrid identities) | Smart lockout assists in locking out bad actors who are trying to guess your users' passwords or use brute-force methods to get in. |
| [Disable end-user consent to applications](../manage-apps/configure-user-consent.md) | The admin consent workflow gives admins a secure way to grant access to applications that require admin approval so end users do not expose corporate data. Microsoft recommends disabling future user consent operations to help reduce your surface area and mitigate this risk. |
| [Enable remote access to on-premises legacy applications with Application Proxy](../manage-apps/application-proxy-add-on-premises-application.md) | Enable Azure AD Application Proxy and integrate with legacy apps for users to securely access on-premises applications by signing in with their Azure AD account. |
| [Enable Secure hybrid access: Secure legacy apps with existing app delivery controllers and networks](../manage-apps/secure-hybrid-access.md) (if applicable). | Publish and protect your on-premises and cloud legacy authentication applications by connecting them to Azure AD with your existing application delivery controller or network. |
| [Implement Password Writeback](../authentication/tutorial-enable-sspr-writeback.md) (if using hybrid identities) | Allow password changes in the cloud to be written back to an on-premises Windows Server Active Directory environment. |
| [Integrate supported SaaS applications from the gallery to Azure AD and enable Single sign on](../manage-apps/add-application-portal.md) | Azure AD has a gallery that contains thousands of pre-integrated applications. Some of the applications your organization uses are probably in the gallery accessible directly from the Azure portal. Provide access to corporate SaaS applications remotely and securely with improved user experience (SSO). |
| [Enable Conditional Access – Device based](../conditional-access/require-managed-devices.md) | Improve security and user experiences with device based Conditional Access. This ensures users can only access from devices that meet your standards for security and compliance. These devices are also known as managed devices. Managed devices can be Intune compliant or Hybrid Azure AD joined devices. |
| [Enable Password Protection](../authentication/howto-password-ban-bad-on-premises-deploy.md) | Protect users from using weak and easy to guess passwords. |
| [Designate more than one global administrator](../users-groups-roles/directory-emergency-access.md) | Assign at least two cloud-only permanent global administrator accounts for use if there is an emergency. These accounts are not be used daily and should have long and complex passwords. Break Glass Accounts ensure you can access the service in an emergency. |
| [Use non-global administrative roles where possible](../users-groups-roles/directory-assign-admin-roles.md) | Give your administrators only the access they need to only the areas they need access to. Not all administrators need to be global administrators. |
| [Enable Microsoft's password guidance](https://www.microsoft.com/research/publication/password-guidance/) | Stop requiring users to change their password on a set schedule, disable complexity requirements, and your users are more apt to remember their passwords and keep them something that is secure. |
| [Automate user provisioning and deprovisioning from SaaS Applications](../app-provisioning/user-provisioning.md) (if applicable) | Automatically create user identities and roles in the cloud (SaaS) applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change, increasing your organization's security. |
| [Create a plan for guest user access](../b2b/what-is-b2b.md) | Collaborate with guest users by letting them sign into your apps and services with their own work, school, or social identities. |
| [Enable Privileged Identity Management](../privileged-identity-management/pim-configure.md) | Enables you to manage, control, and monitor access to important resources in your organization, ensuring admins have access only when needed and with approval |

## Summary

There are many aspects to a secure Identity infrastructure, but this checklist will help you quickly accomplish a safer and secure identity infrastructure while enabling you users to work remotely. Securing your identity is just part of your security story, protecting data, applications and devices should also be considered. For more information, there is additional information in the following articles which provide an additional view on deploying these features : Azure Active Directory Feature Deployment Guide and Five steps to securing your identity infrastructure.  

We appreciate how seriously you take Identity Security and hope this document is a useful roadmap to a more secure posture for your organization.

## Next steps

For detailed deployment guidance for individual features of Azure AD review the [Azure AD project deployment plans](active-directory-deployment-plans.md).

For an end-to-end Azure AD deployment checklist see the article [Azure Active Directory feature deployment guide](active-directory-deployment-checklist-p2.md)