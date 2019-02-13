---
title: Troubleshooting in Azure AD password protection preview
description: Understand Azure AD password protection preview common troubleshooting

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 02/01/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jsimmons
ms.collection: M365-identity-device-management
---

# Preview: Azure AD Password Protection troubleshooting

|     |
| --- |
| Azure AD Password Protection is a public preview feature of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

After the deployment of Azure AD Password Protection, troubleshooting may be required. This article goes into detail to help you understand some common troubleshooting steps.

## Weak passwords are not getting rejected as expected

This may have several possible causes:

1. Your DC agent(s) have not yet downloaded a policy. The symptom of this is 30001 events in the DC agent Admin event log.

    Possible causes for this issue include:

    1. Forest is not yet registered
    2. Proxy is not yet registered
    3. Network connectivity issues are preventing the Proxy service from communicating with Azure (check HTTP Proxy requirements)

2. The password policy Enforce mode is still set to Audit. If this is the case, reconfigure it to Enforce using the Azure AD Password Protection portal. Please see [Enable Password protection](howto-password-ban-bad-on-premises-operations.md#enable-password-protection).

3. The password policy has been disabled. If this is the case, reconfigure it to enabled using the Azure AD Password Protection portal. Please see [Enable Password protection](howto-password-ban-bad-on-premises-operations.md#enable-password-protection).

4. The password validation algorithm may be working as expected. Please see [How are passwords evaluated](concept-password-ban-bad.md#how-are-passwords-evaluated).

## Directory Services Repair Mode

If the domain controller is booted into Directory Services Repair Mode, the DC agent service detects this and will cause all password validation or enforcement activities to be disabled, regardless of the currently active policy configuration.

## Emergency remediation

If a situation occurs where the DC agent service is causing problems, the DC agent service may be immediately shut down. The DC agent password filter dll still attempts to call the non-running service and will log warning events (10012, 10013), but all incoming passwords are accepted during that time. The DC agent service may then also be configured via the Windows Service Control Manager with a startup type of “Disabled” as needed.

Another remediation measure would be to set the Enable mode to No in the Azure AD Password Protection portal. Once the updated policy has been downloaded, each DC agent service will go into a quiescent mode where all passwords are accepted as-is. For more information, see [Enforce mode](howto-password-ban-bad-on-premises-operations.md#enforce-mode).

## Domain controller demotion

It is supported to demote a domain controller that is still running the DC agent software. Administrators should be aware however that the DC agent software continues to enforce the current password policy during the demotion procedure. The new local Administrator account password (specified as part of the demotion operation) is validated like any other password. Microsoft recommends that secure passwords be chosen for local Administrator accounts as part of a DC demotion procedure; however the validation of the new local Administrator account password by the DC agent software may be disruptive to pre-existing demotion operational procedures.

Once the demotion has succeeded, and the domain controller has been rebooted and is again running as a normal member server, the DC agent software reverts to running in a passive mode. It may then be uninstalled at any time.

## Removal

If it is decided to uninstall the public preview software and cleanup all related state from the domain(s) and forest, this task can be accomplished using the following steps:

> [!IMPORTANT]
> It is important to perform these steps in order. If any instance of the Proxy service is left running it will periodically re-create its serviceConnectionPoint object. If any instance of the DC agent service is left running it will periodically re-create its serviceConnectionPoint object and the sysvol state.

1. Uninstall the Proxy software from all machines. This step does **not** require a reboot.
2. Uninstall the DC Agent software from all domain controllers. This step **requires** a reboot.
3. Manually remove all Proxy service connection points in each domain naming context. The location of these objects may be discovered with the following Active Directory PowerShell command:

   ```PowerShell
   $scp = "serviceConnectionPoint"
   $keywords = "{ebefb703-6113-413d-9167-9f8dd4d24468}*"
   Get-ADObject -SearchScope Subtree -Filter { objectClass -eq $scp -and keywords -like $keywords }
   ```

   Do not omit the asterisk (“*”) at the end of the $keywords variable value.

   The resulting object(s) found via the `Get-ADObject` command can then be piped to `Remove-ADObject`, or deleted manually. 

4. Manually remove all DC agent connection points in each domain naming context. There may be one these objects per domain controller in the forest, depending on how widely the public preview software was deployed. The location of that object may be discovered with the following Active Directory PowerShell command:

   ```PowerShell
   $scp = "serviceConnectionPoint"
   $keywords = "{2bac71e6-a293-4d5b-ba3b-50b995237946}*"
   Get-ADObject -SearchScope Subtree -Filter { objectClass -eq $scp -and keywords -like $keywords }
   ```

   The resulting object(s) found via the `Get-ADObject` command can then be piped to `Remove-ADObject`, or deleted manually.

   Do not omit the asterisk (“*”) at the end of the $keywords variable value.

5. Manually remove the forest-level configuration state. The forest configuration state is maintained in a container in the Active Directory configuration naming context. It can be discovered and deleted as follows:

   ```PowerShell
   $passwordProtectionConfigContainer = "CN=Azure AD Password Protection,CN=Services," + (Get-ADRootDSE).configurationNamingContext
   Remove-ADObject -Recursive $passwordProtectionConfigContainer
   ```

6. Manually remove all sysvol related state by manually deleting the following folder and all of its contents:

   `\\<domain>\sysvol\<domain fqdn>\AzureADPasswordProtection`

   If necessary, this path may also be accessed locally on a given domain controller; the default location would be something like the following path:

   `%windir%\sysvol\domain\Policies\AzureADPasswordProtection`

   This path is different if the sysvol share has been configured in a non-default location.

## Next steps

[Frequently asked questions for Azure AD Password Protection](howto-password-ban-bad-on-premises-faq.md)

For more information on the global and custom banned password lists, see the article [Ban bad passwords](concept-password-ban-bad.md)
