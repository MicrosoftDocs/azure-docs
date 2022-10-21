---
title: Memo 22-09 multifactor authentication requirements overview
description: Get guidance on meeting multifactor authentication requirements outlined in US government OMB memorandum 22-09.
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 3/10/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Meet multifactor authentication requirements of memorandum 22-09

This series of articles offers guidance for using Azure Active Directory (Azure AD) as a centralized identity management system for implementing Zero Trust principles, as described in the US federal government's Office of Management and Budget (OMB) [memorandum 22-09](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf).

The memo requires that all employees use enterprise-managed identities to access applications, and that phishing-resistant multifactor authentication (MFA) protect those personnel from sophisticated online attacks. Phishing is the attempt to obtain and compromise credentials, such as by sending a spoofed email that leads to an inauthentic site.

Adoption of MFA is critical for preventing unauthorized access to accounts and data. The memo requires MFA usage with phishing-resistant methods, defined as "authentication processes designed to detect and prevent disclosure of authentication secrets and outputs to a website or application masquerading as a legitimate system." The first step is to establish what MFA methods qualify as phishing resistant.

## Phishing-resistant methods

U.S. Federal agencies will be approaching this guidance from different starting points. Some agencies will have already deployed modern credentials such as [FIDO2 security keys](../authentication/concept-authentication-passwordless.md#fido2-security-keys) or [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview), many are evaluating [Azure AD certificate-based authentication](../authentication/concept-certificate-based-authentication.md) (currently in Public Preview), some are just starting to modernize their authentication credentials. This guidance is meant to inform agencies on the multiple options available to meet phishing-resistant MFA requirements with Azure AD. The reality is that phishing-resistant MFA is needed sooner then later.  Microsoft recommends adopting phishing-resistant MFA method as soon as possible by whichever method below best matches the agency's current capability. Agencies should approach the phishing-resistant MFA requirement of the memorandum from the mindset of what can I do **now** to gain phishing-resistance for my accounts. Implementing phishing-resistant MFA will provide a significant positive impact on improving the agency's overall cybersecurity posture. The end goal here is to fully implement one or more of the modern credentials. However, if the quickest path to phishing-resistance is not a modern approach below, agencies should take that step as a starting point on their journey towards the more modern approaches.

![Table of Azure AD phishing-resistant methods.](media/memo-22-09/azure-active-directory-pr-methods.png)

### Modern approaches

- **[FIDO2 security keys](../authentication/concept-authentication-passwordless.md#fido2-security-keys)** are, according to the [Cybersecurity & Infrastructure Security Agency (CISA)](https://www.cisa.gov/mfa) the gold standard of multifactor authentication.

- **[Azure AD certificate-based authentication](../authentication/concept-certificate-based-authentication.md)** offers cloud native  certificate based authentication (without dependency on a federated identity provider). This includes smart card implementations such as Common Access Card (CAC) & Personal Identity Verification (PIV) as well as derived PIV credentials deployed to mobile devices or security keys

- **[Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview)** offers passwordless multifactor authentication that is phishing-resistant. For more information, see the [Windows Hello for Business Deployment Overview](/windows/security/identity-protection/hello-for-business/hello-deployment-guide)

### Protection from external phishing

**[Microsoft Authenticator](../authentication/concept-authentication-authenticator-app.md) and conditional access policies that enforce managed devices**. Managed devices are Hybrid Azure AD joined device or device marked as compliant.

Microsoft Authenticator can be installed on the device accessing the application protected by Azure AD or on a separate device.

>[!Important]
>
>To meet the phishing-resistant requirement with this approach:
>
>- Only the device accessing the protected application needs to be managed
>- All users allowed to use Microsoft Authenticator must be in scope for conditional access policy requiring managed device for access to all applications.
>- An additional conditional access policy is needed to block access targeting the Microsoft Intune Enrollment Cloud App. All users allowed to use Microsoft Authenticator must be in scope for this conditional access policy.
>
>Microsoft recommends that you use the same group(s) used to allow the Microsoft Authenticator App authentication method within both conditional access policies to ensure that once a user is enabled for the authentication method they are simultaneously in scope of both policies.
>
>This conditional access policy effectively prevents both:
>
>- The most significant vector of phishing threats from malicious external actors.
>- A malicious actor's ability to phish Microsoft Authenticator to register a new credential or join a device and enroll it in Intune such that it will be marked as compliant

For more information on deploying this method, see the following resources:
- [Plan your hybrid Azure Active Directory join implementation](../devices/hybrid-azuread-join-plan.md) **or** [How to: Plan your Azure AD join implementation](../devices/azureadjoin-plan.md)

- [Conditional Access: Require compliant or hybrid Azure AD joined device](../conditional-access/howto-conditional-access-policy-compliant-device.md)

>[!NOTE]
>
> Today, Microsoft Authenticator by itself is **not** phishing-resistant. You must additionally secure the authentication with the phishing resistant properties gained from conditional access policy enforcement of managed devices.
>
>**Microsoft Authenticator native phishing resistance is in development.** Once available, Microsoft Authenticator will be natively phishing-resistant without reliance on conditional access policies that enforce Hybrid join device or device marked as compliant.

### Legacy

**Federated Identity Provider (IdP) such as Active Directory Federation Services (AD FS) that's configured with phishing-resistant method(s).** While agencies can achieve phishing resistance via federated IdP, adopting or continuing to use a federated IdP adds significant cost, complexity and risk. Microsoft encourages agencies to realize the security benefits of Azure AD as a cloud based identity provider, removing [associated risk of a federated IdP](../fundamentals/protect-m365-from-on-premises-attacks.md).

For more information on deploying this method, see the following resources:

- [Deploying Active Directory Federation Services in Azure](/windows-server/identity/ad-fs/deployment/how-to-connect-fed-azure-adfs)
- [Configuring AD FS for user certificate authentication](/windows-server/identity/ad-fs/operations/configure-user-certificate-authentication)

### Additional phishing-resistant method considerations

Your current device capabilities, user personas, and other requirements might dictate specific multifactor methods. For example, if you're adopting FIDO2 security keys that have only USB-C support, they can be used only from devices with USB-C ports.

Consider the following when evaluating phishing-resistant MFA methods:

- Device types and capabilities that you want to support. Examples include kiosks, laptops, mobile phones, biometric readers, USB, Bluetooth, and near-field communication devices.

- User personas within your organization. Examples include front-line workers, remote workers with and without company-owned hardware, administrators with privileged access workstations, and business-to-business guest users.

- Logistics of distributing, configuring, and registering MFA methods such as FIDO2 security keys, smart cards, government-furnished equipment, or Windows devices with TPM chips.

- Need for FIPS 140 validation at a specific [authenticator assurance level](nist-about-authenticator-assurance-levels.md). For example, some FIDO security keys are FIPS 140 validated at levels required for [AAL3](nist-authenticator-assurance-level-3.md), as set by [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html).

## Implementation considerations for phishing-resistant MFA

The following sections describe support for implementing phishing-resistant methods for both application and virtual device sign-in scenarios.

### Application sign-in scenarios from various clients

The following table details the availability of phishing-resistant MFA scenarios, based on the device type that's used to sign in to the applications:

| Device | AD FS as a federated identity provider configured with certificate-based authentication| Azure AD certificate-based authentication| FIDO2 security keys| Windows Hello for Business| Microsoft Authenticator with conditional access policies that enforce hybrid Azure AD join or compliant devices |
| - | - | - | - | - | - |
| Windows device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |
| iOS mobile device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| Not applicable| Not applicable| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |
| Android mobile device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| Not applicable| Not applicable| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |
| MacOS device| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| ![Checkmark with solid fill](media/memo-22-09/check.jpg)| Edge/Chrome | Not applicable| ![Checkmark with solid fill](media/memo-22-09/check.jpg) |

To learn more, see [Browser support for FIDO2 passwordless authentication](../authentication/fido2-compatibility.md).

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

#### Enforcement across agencies

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

Although the memo isn't specific on which policies to use with passwords, consider the standard from [NIST 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html).

## Next steps

The following articles are part of this documentation set:

[Meet identity requirements of memorandum 22-09](memo-22-09-meet-identity-requirements.md)

[Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)

[Authorization](memo-22-09-authorization.md)

[Other areas of Zero Trust](memo-22-09-other-areas-zero-trust.md)

For more information about Zero Trust, see:

[Securing identity with Zero Trust](/security/zero-trust/deploy/identity)
