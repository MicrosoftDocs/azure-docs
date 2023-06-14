---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 11/21/2022
---

### The logon attempt failed

If you come across an error saying **The logon attempt failed** on the Windows Security credential prompt, verify the following:

- You're using a device that is Azure AD-joined or hybrid Azure AD-joined to the same Azure AD tenant as the session host.
- The [PKU2U protocol is enabled](/windows/security/threat-protection/security-policy-settings/network-security-allow-pku2u-authentication-requests-to-this-computer-to-use-online-identities) on both the local PC and the session host.
- [Per-user multi-factor authentication is disabled](../set-up-mfa.md#azure-ad-joined-session-host-vms) for the user account as it's not supported for Azure AD-joined VMs.

### The sign-in method you're trying to use isn't allowed

If you come across an error saying **The sign-in method you're trying to use isn't allowed. Try a different sign-in method or contact your system administrator**, you have Conditional Access policies restricting access. Follow the instructions in [Enforce Azure Active Directory Multi-Factor Authentication for Azure Virtual Desktop using Conditional Access](../set-up-mfa.md#azure-ad-joined-session-host-vms) to enforce Azure Active Directory Multi-Factor Authentication for your Azure AD-joined VMs.

### A specified logon session does not exist. It may already have been terminated.

If you come across an error that says, **An authentication error occurred. A specified logon session does not exist. It may already have been terminated**, verify that you properly created and configured the Kerberos server object when [configuring single sign-on](../configure-single-sign-on.md).
