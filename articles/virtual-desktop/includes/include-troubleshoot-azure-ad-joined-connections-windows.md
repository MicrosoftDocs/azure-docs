---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 11/21/2022
---

### The logon attempt failed

If you come across an error saying **The logon attempt failed** on the Windows Security credential prompt, verify the following:

- You're using a device that is Microsoft Entra joined or Microsoft Entra hybrid joined to the same Microsoft Entra tenant as the session host.
- The [PKU2U protocol is enabled](/windows/security/threat-protection/security-policy-settings/network-security-allow-pku2u-authentication-requests-to-this-computer-to-use-online-identities) on both the local PC and the session host.
- [Per-user multifactor authentication is disabled](../set-up-mfa.md#azure-ad-joined-session-host-vms) for the user account as it's not supported for Microsoft Entra joined VMs.

### The sign-in method you're trying to use isn't allowed

If you come across an error saying **The sign-in method you're trying to use isn't allowed. Try a different sign-in method or contact your system administrator**, you have Conditional Access policies restricting access. Follow the instructions in [Enforce Microsoft Entra multifactor authentication for Azure Virtual Desktop using Conditional Access](../set-up-mfa.md#azure-ad-joined-session-host-vms) to enforce Microsoft Entra multifactor authentication for your Microsoft Entra joined VMs.

### A specified logon session does not exist. It may already have been terminated.

If you come across an error that says, **An authentication error occurred. A specified logon session does not exist. It may already have been terminated**, verify that you properly created and configured the Kerberos server object when [configuring single sign-on](../configure-single-sign-on.md).
