---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 11/21/2022
---

### Your account is configured to prevent you from using this device

If you come across an error saying **Your account is configured to prevent you from using this device. For more information, contact your system administrator**, ensure the user account was given the [Virtual Machine User Login role](../../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#azure-role-not-assigned) on the VMs. 

### The user name or password is incorrect

If you can't sign in and keep receiving an error message that says your credentials are incorrect, first make sure you're using the right credentials. If you keep seeing error messages, check to make sure you've fulfilled the following requirements:

- Have you assigned the **Virtual Machine User Login** role-based access control (RBAC) permission to the virtual machine (VM) or resource group for each user?
- Does your Conditional Access policy exclude multi-factor authentication requirements for the **Azure Windows VM sign-in** cloud application?

If you've answered "no" to either of those questions, you'll need to reconfigure your multi-factor authentication. To reconfigure your multi-factor authentication, follow the instructions in [Enforce Azure Active Directory Multi-Factor Authentication for Azure Virtual Desktop using Conditional Access](../set-up-mfa.md#azure-ad-joined-session-host-vms).

> [!IMPORTANT] 
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
