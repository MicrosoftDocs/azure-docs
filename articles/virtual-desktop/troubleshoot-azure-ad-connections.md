---
title: Connections to Azure AD-joined VMs Azure Virtual Desktop - Azure
description: How to resolve issues while connecting to Azure AD-joined VMs in Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 08/24/2022
ms.author: helohr
---
# Connections to Azure AD-joined VMs

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects.

Use this article to resolve issues with connections to Azure Active Directory (Azure AD)-joined VMs in Azure Virtual Desktop.

## All clients

### Your account is configured to prevent you from using this device

If you come across an error saying **Your account is configured to prevent you from using this device. For more information, contact your system administrator**, ensure the user account was given the [Virtual Machine User Login role](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#azure-role-not-assigned) on the VMs. 

### The user name or password is incorrect

If you can't sign in and keep receiving an error message that says your credentials are incorrect, first make sure you're using the right credentials. If you keep seeing error messages, check to make sure you've fulfilled the following requirements:

- Have you assigned the **Virtual Machine User Login** role-based access control (RBAC) permission to the virtual machine (VM) or resource group for each user?
- Does your Conditional Access policy exclude multi-factor authentication requirements for the **Azure Windows VM sign-in** cloud application?

If you've answered "no" to either of those questions, you'll need to reconfigure your multi-factor authentication. To reconfigure your multi-factor authentication, follow the instructions in [Enforce Azure Active Directory Multi-Factor Authentication for Azure Virtual Desktop using Conditional Access](set-up-mfa.md#azure-ad-joined-session-host-vms).

> [!WARNING] 
> VM sign-ins don't support per-user enabled or enforced Azure AD Multi-Factor Authentication. If you try to sign in with multi-factor authentication on a VM, you won't be able to sign in and will receive an error message.

If you can access your Azure AD sign-in logs through Log Analytics, you can see if you've enabled multi-factor authentication and which Conditional Access policy is triggering the event. The events shown are non-interactive user login events for the VM, which means the IP address will appear to come from the external IP address that your VM accesses Azure AD from. 

You can access your sign-in logs by running the following Kusto query:

```kusto
let UPN = "userupn";
AADNonInteractiveUserSignInLogs
| where UserPrincipalName == UPN
| where AppId == "38aa3b87-a06d-4817-b275-7a316988d93b"
| project ['Time']=(TimeGenerated), UserPrincipalName, AuthenticationRequirement, ['MFA Result']=ResultDescription, Status, ConditionalAccessPolicies, DeviceDetail, ['Virtual Machine IP']=IPAddress, ['Cloud App']=ResourceDisplayName
| order by ['Time'] desc
```

## Windows Desktop client

### The logon attempt failed

If you come across an error saying **The logon attempt failed** on the Windows Security credential prompt, verify the following:

- You are on a device that is Azure AD-joined or hybrid Azure AD-joined to the same Azure AD tenant as the session host OR
- You are on a device running Windows 10 2004 or later that is Azure AD registered to the same Azure AD tenant as the session host
- The [PKU2U protocol is enabled](/windows/security/threat-protection/security-policy-settings/network-security-allow-pku2u-authentication-requests-to-this-computer-to-use-online-identities) on both the local PC and the session host
- [Per-user multi-factor authentication is disabled](set-up-mfa.md#azure-ad-joined-session-host-vms) for the user account as it's not supported for Azure AD-joined VMs.

### The sign-in method you're trying to use isn't allowed

If you come across an error saying **The sign-in method you're trying to use isn't allowed. Try a different sign-in method or contact your system administrator**, you have Conditional Access policies restricting access. Follow the instructions in [Enforce Azure Active Directory Multi-Factor Authentication for Azure Virtual Desktop using Conditional Access](set-up-mfa.md#azure-ad-joined-session-host-vms) to enforce Azure Active Directory Multi-Factor Authentication for your Azure AD-joined VMs.

### A specified logon session does not exist. It may already have been terminated.

If you come across an error that says, **An authentication error occurred. A specified logon session does not exist. It may already have been terminated**, verify that you properly created and configured the Kerberos server object when [configuring single sign-on](configure-single-sign-on.md).

## Web client

### Sign in failed. Please check your username and password and try again

If you come across an error saying **Oops, we couldn't connect to NAME. Sign in failed. Please check your username and password and try again.** when using the web client, ensure that you [enabled connections from other clients](deploy-azure-ad-joined-vm.md#connect-using-the-other-clients).

### We couldn't connect to the remote PC because of a security error

If you come across an error saying **Oops, we couldn't connect to NAME. We couldn't connect to the remote PC because of a security error. If this keeps happening, ask your admin or tech support for help.**, you have Conditional Access policies restricting access. Follow the instructions in [Enforce Azure Active Directory Multi-Factor Authentication for Azure Virtual Desktop using Conditional Access](set-up-mfa.md#azure-ad-joined-session-host-vms) to enforce Azure Active Directory Multi-Factor Authentication for your Azure AD-joined VMs.

## Android client

### Error code 2607 - We couldn't connect to the remote PC because your credentials did not work

If you come across an error saying **We couldn't connect to the remote PC because your credentials did not work. The remote machine is AADJ joined.** with error code 2607 when using the Android client, ensure that you [enabled connections from other clients](deploy-azure-ad-joined-vm.md#connect-using-the-other-clients).

## Provide feedback

Visit the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/bd-p/AzureVirtualDesktopForum) to discuss the Azure Virtual Desktop service with the product team and active community members.

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating an Azure Virtual Desktop environment and host pool in an Azure Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues related to the Azure Virtual Desktop agent or session connectivity, see [Troubleshoot common Azure Virtual Desktop Agent issues](troubleshoot-agent.md).
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
