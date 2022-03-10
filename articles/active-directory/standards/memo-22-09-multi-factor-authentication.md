---
title: Memo 22-09 multi-factor authentication requirements overview| Azure Active Directory
description: Guidance on meeting multi-factor authentication requirements outlined in US government OMB memorandum 22-09
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: barbaraselden
ms.author: baselden
manager: martinco
ms.reviewer: martinco
ms.date: 3/10/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Multi-factor authentication

This series of articles offer guidance for employing Azure Active Directory (Azure AD) as a centralized identity management system for implementing Zero Trust principles as described by the US Federal Government’s Office of Management and Budget (OMB) [Memorandum M-22-09](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf). Throughout this document. We refer to it as “The Memo.”

The Memo requires that all employees use enterprise-managed identities to access applications, and that phishing-resistant multi-factor authentication (MFA) protect those personnel from sophisticated online attacks. *Phishing* is the attempt to obtain and compromise credentials, for example through sending a spoofed email that leads to an inauthentic site.

Adoption of MFA is critical to preventing unauthorized access to accounts and data. The Memo requires MFA usage with phishing resistant methods, defined as “authentication processes designed to detect and prevent disclosure of authentication secrets and outputs to a website or application masquerading as a legitimate system.” The first step is to establish what MFA methods qualify as phishing resistant.

## Phishing resistant methods

* AD FS as a federated identity provider configured with Certificate Based Authentication

* Azure AD Certificate Based Authentication

* FIDO2 security keys 

* Windows Hello for Business 

* Microsoft Authenticator + Conditional access policies that enforce managed or compliant devices to access the application or service

   * Microsoft Authenticator native phishing resistance is in development.

### MFA requirements by method

Your current device capabilities, user personas, and other requirements may dictate specific multi-factor methods. For example, if you are adopting FIDO2 security keys that have only USB-C support, they can only be leveraged from devices with USB-C ports. 

Consider an approach to evaluating phishing resistant MFA methods that encompasses the following aspects:

* Device types and capabilities you wish to support

* Examples: Kiosks, laptops, mobile phones, biometric readers, USB, Bluetooth, NFC, etc.

* The user personas within your organization 

   * Examples: Front line workers, remote workers with and without company owned hardware, Administrators with privileged access workstation, B2B guest users, etc.

* Logistics of distributing, configuring, and registering MFA methods such as FIDO 2.0 security keys, smart cards, government furnished equipment, or Windows devices with TPM chips.

* Need for FIPS 140 validation at a specific [authenticator assurance level](nist-about-authenticator-assurance-levels.md) (AAL). 

  *  For example, some FIDO security keys are FIPS 140-validated at levels required for [AAL3](nist-authenticator-assurance-level-3.md) as set by [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html).

## Implementation considerations for phishing resistant MFA

The following describes support for implementing phishing resistant methods mentioned previously for both application and virtual device sign-in scenarios.

### Application sign-in scenarios from different clients

The following table details the availability of phishing-resistant MFA scenarios based on the device type being used to sign-in to the applications.


| Devices | AD FS as a federated IDP configured with certificate-based authentication| Azure AD certificate-based authentication| FIDO 2.0 security keys| Windows hello for Business| Microsoft authenticator + CA for managed devices |
| - | - | - | - | - | - |
| Windows device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |
| iOS mobile device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| N/A| N/A| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |
| Android mobile device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| N/A| N/A| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |
| MacOS device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| Edge/Chrome (Safari coming later)| N/A| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |

To learn more, see [Browser support for Fido 2.0 passwordless authentication](../authentication/fido2-compatibility.md).

### Virtual device sign-in scenarios requiring integration

To enforce the use of phishing resistant MFA methods, integration may be necessary based on your requirements. MFA should be enforced both when users access applications and devices.

For each of the five phishing-resistant MFA types previously mentioned, you use the same capabilities to access the following device types:

| Target System| Integration Actions |
| - | - |
| Azure Linux VM| Enable the [Linux VM for Azure AD sign-in](../devices/howto-vm-sign-in-azure-ad-linux.md) |
| Azure Windows VM| Enable the [Windows VM for Azure AD sign-in](../devices/howto-vm-sign-in-azure-ad-windows.md) |
| Azure Virtual Desktop| Enable [Azure virtual desktop for Azure AD sign-in](https://docs.microsoft.com/azure/architecture/example-scenario/wvd/azure-virtual-desktop-azure-active-directory-join) |
| VMs hosted on-prem or in other clouds| Enable [Azure Arc](../../azure-arc/overview.md) on the VM then enable Azure AD sign-in. (Currently in private preview for Linux. Support for Windows VMs hosted in these environments is on our roadmap.) |
| Non-Microsoft virtual desktop solutions| Integrate 3rd party virtual desktop solution as an app in Azure AD |


### Enforcing phishing-resistant MFA

Today, Conditional Access enable you to enforce MFA for users in your tenant. With the addition of Cross Tenant Access Policies, you can enforce it on external users. 

In the future, you will be able to assess the strength of authenticators in Conditional Access policies. This functionality will enable you to accept any authenticator with the specified strength.

#### Enforcement across agencies

[Azure AD B2B collaboration](../external-identities/what-is-b2b.md) (B2B) helps you to meet the requirement to facilitate integration among agencies. It does this by both limiting what other Microsoft tenants your users can access, and by enabling you to allow access to users that you do not have to manage in your own tenant, but whom you can subject to your MFA and other access requirements.

You must enforce MFA for partners and external users who access your organization’s resources. This is common in many inter-agency collaboration scenarios. Azure AD provides [Cross Tenant Access Policies (XTAP)](../external-identities/cross-tenant-access-overview.md) to help you configure MFA for external users accessing your applications and resources. XTAP uses trust settings that allow you to trust the MFA method used by the guest user’s tenant instead of having them register an MFA method directly with your tenant. These policies can be configured on a per organization basis. This requires you to understand the available MFA methods in the user’s home tenant and determine if they meet the requirement for phishing resistance. 

In the future, Microsoft will enable signals from your tenant and guest users’ home tenants to help determine if the MFA used by the guest user was phishing resistant. These settings will allow you to incorporate MFA requirements directly into your Conditional Access policies for external users

## Password policies

The memo requires organizations to change password policies that have proven to be ineffective, such as complex passwords that are rotated often. This includes the removal of the requirement for special characters and numbers as well as time-based password rotation policies. Instead, consider doing the following:

* Use [password protection](..//authentication/concept-password-ban-bad.md) to enforce a common list Microsoft maintains of weak passwords. You can also add custom banned passwords.

* Use [self-service password protection](..//authentication/tutorial-enable-sspr.md) (SSPR) to enable users to reset passwords as needed, for example after an account recovery.

* Use [Azure AD Identity Protection](..//identity-protection/concept-identity-protection-risks.md) to be alerted about compromised credentials so you can take immediate action.

While the memo isn’t specific on which policies to use with passwords consider the standard from [NIST 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html). 

## Next steps
The following articles are a part of this documentation set:

[Meet identity requirements of Memorandum 22-09](memo-22-09-meet-identity-requirements.md)

[Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)

[Multi-factor authentication](memo-22-09-multi-factor-authentication.md)

[Authorization](memo-22-09-authorization.md)

[Other areas of Zero Trust](memo-22-09-other-areas-zero-trust.md)

Additional Zero Trust Documentation

[Securing identity with Zero Trust](/security/zero-trust/deploy/identity)
