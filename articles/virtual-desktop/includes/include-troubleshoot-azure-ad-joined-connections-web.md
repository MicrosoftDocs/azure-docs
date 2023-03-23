---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 11/21/2022
---

### Sign in failed. Please check your username and password and try again

If you come across an error saying **Oops, we couldn't connect to *NAME*. Sign in failed. Please check your username and password and try again.** when using the web client, ensure that you [enabled connections from other clients](../deploy-azure-ad-joined-vm.md#connect-using-the-other-clients).

### We couldn't connect to the remote PC because of a security error

If you come across an error saying **Oops, we couldn't connect to *NAME*. We couldn't connect to the remote PC because of a security error. If this keeps happening, ask your admin or tech support for help.**, you have Conditional Access policies restricting access. Follow the instructions in [Enforce Azure Active Directory Multi-Factor Authentication for Azure Virtual Desktop using Conditional Access](../set-up-mfa.md#azure-ad-joined-session-host-vms) to enforce Azure Active Directory Multi-Factor Authentication for your Azure AD-joined VMs.
