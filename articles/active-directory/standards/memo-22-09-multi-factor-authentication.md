---
title: Memo 22-09 multifactor authentication requirements overview
description: Get guidance on meeting multifactor authentication requirements outlined in US government OMB memorandum 22-09.
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

# Meet multifactor authentication requirements of Memorandum 22-09

This series of articles offers guidance for using Azure Active Directory (Azure AD) as a centralized identity management system for implementing Zero Trust principles, as described by the US Federal Government's Office of Management and Budget (OMB) [Memorandum M-22-09](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf). 

The memo requires that all employees use enterprise-managed identities to access applications, and that phishing-resistant multifactor authentication (MFA) protect those personnel from sophisticated online attacks. Phishing is the attempt to obtain and compromise credentials, such as by sending a spoofed email that leads to an inauthentic site.

Adoption of MFA is critical for preventing unauthorized access to accounts and data. The memo requires MFA usage with phishing-resistant methods, defined as "authentication processes designed to detect and prevent disclosure of authentication secrets and outputs to a website or application masquerading as a legitimate system." The first step is to establish what MFA methods qualify as phishing resistant.

## Phishing-resistant methods

* Active Directory Federation Services (AD FS) as a federated identity provider that's configured with certificate-based authentication

* Azure AD certificate-based authentication

* FIDO2 security keys 

* Windows Hello for Business 

* Microsoft Authenticator and conditional access policies that enforce managed or compliant devices to access the application or service. Microsoft Authenticator native phishing resistance is in development.

Your current device capabilities, user personas, and other requirements might dictate specific multifactor methods. For example, if you're adopting FIDO2 security keys that have only USB-C support, they can be used only from devices with USB-C ports. 

Consider the following approach to evaluating phishing-resistant MFA methods:

* Device types and capabilities that you want to support. Examples: kiosks, laptops, mobile phones, biometric readers, USB, Bluetooth, and near-field communication devices.

* User personas within your organization. Examples: Front-line workers, remote workers with and without company-owned hardware, administrators with privileged access workstation, and business-to-business guest users.

* Logistics of distributing, configuring, and registering MFA methods such as FIDO 2.0 security keys, smart cards, government-furnished equipment, or Windows devices with TPM chips.

* Need for FIPS 140 validation at a specific [authenticator assurance level](nist-about-authenticator-assurance-levels.md). For example, some FIDO security keys are FIPS 140 validated at levels required for [AAL3](nist-authenticator-assurance-level-3.md), as set by [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html).

## Implementation considerations for phishing-resistant MFA

The following sections describe support for implementing phishing-resistant methods for both application and virtual device sign-in scenarios.

### Application sign-in scenarios from different clients

The following table details the availability of phishing-resistant MFA scenarios, based on the device type that's used to sign in to the applications.

| Devices | AD FS as a federated identity provider configured with certificate-based authentication| Azure AD certificate-based authentication| FIDO 2.0 security keys| Windows Hello for Business| Microsoft authenticator + certificate authority for managed devices |
| - | - | - | - | - | - |
| Windows device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |
| iOS mobile device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| Not applicable| Not applicable| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |
| Android mobile device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| Not applicable| Not applicable| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |
| MacOS device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| Edge/Chrome | Not applicable| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |

To learn more, see [Browser support for Fido 2.0 passwordless authentication](../authentication/fido2-compatibility.md).

### Virtual device sign-in scenarios that require integration

To enforce the use of phishing-resistant MFA methods, integration might be necessary based on your requirements. MFA should be enforced when users access applications and devices.

For each of the five phishing-resistant MFA types previously mentioned, you use the same capabilities to access the following device types:

| Target system| Integration actions |
| - | - |
| Azure Linux virtual machine (VM)| Enable the [Linux VM for Azure AD sign-in](../devices/howto-vm-sign-in-azure-ad-linux.md). |
| Azure Windows VM| Enable the [Windows VM for Azure AD sign-in](../devices/howto-vm-sign-in-azure-ad-windows.md). |
| Azure Virtual Desktop| Enable [Azure Virtual Desktop for Azure AD sign-in](/azure/architecture/example-scenario/wvd/azure-virtual-desktop-azure-active-directory-join). |
| VMs hosted on-premises or in other clouds| Enable [Azure Arc](../../azure-arc/overview.md) on the VM and then enable Azure AD sign-in. (Currently in private preview for Linux. Support for Windows VMs hosted in these environments is on our roadmap.) |
| Non-Microsoft virtual desktop solution| Integrate the virtual desktop solution as an app in Azure AD. |


### Enforcing phishing-resistant MFA

Conditional access enables you to enforce MFA for users in your tenant. With the addition of [cross-tenant access policies](../external-identities/cross-tenant-access-overview.md), you can enforce it on external users. 

[Azure AD B2B collaboration](../external-identities/what-is-b2b.md) helps you meet the requirement to facilitate integration among agencies. It does this by:

- Limiting what other Microsoft tenants your users can access.
- Enabling you to allow access to users whom you don't have to manage in your own tenant, but whom you can subject to your MFA and other access requirements.

You must enforce MFA for partners and external users who access your organization's resources. This is common in many inter-agency collaboration scenarios. Azure AD provides cross-tenant access policies to help you configure MFA for external users who access your applications and resources. 

By using trust settings in cross-tenant access policies, you can trust the MFA method that the guest user's tenant is using instead of having them register an MFA method directly with your tenant. These policies can be configured on a per-organization basis. This ability requires you to understand the available MFA methods in the user's home tenant and determine if they meet the requirement for phishing resistance. 

## Password policies

The memo requires organizations to change password policies that are proven ineffective, such as complex passwords that are rotated often. This includes the removal of the requirement for special characters and numbers, along with time-based password rotation policies. Instead, consider doing the following:

* Use [password protection](..//authentication/concept-password-ban-bad.md) to enforce a common list of weak passwords that Microsoft maintains. You can also add custom banned passwords.

* Use [self-service password protection](..//authentication/tutorial-enable-sspr.md) to enable users to reset passwords as needed, such as after an account recovery.

* Use [Azure AD Identity Protection](..//identity-protection/concept-identity-protection-risks.md) to be alerted about compromised credentials so you can take immediate action.

While the memo isn't specific on which policies to use with passwords, consider the standard from [NIST 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html). 

## Next steps

The following articles are a part of this documentation set:

[Meet identity requirements of Memorandum 22-09](memo-22-09-meet-identity-requirements.md)

[Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)

[Authorization](memo-22-09-authorization.md)

[Other areas of Zero Trust](memo-22-09-other-areas-zero-trust.md)

For more information about Zero Trust, see:

[Securing identity with Zero Trust](/security/zero-trust/deploy/identity)