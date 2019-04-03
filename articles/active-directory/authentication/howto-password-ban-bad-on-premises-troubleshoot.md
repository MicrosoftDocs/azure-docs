---
title: Troubleshooting in Azure AD password protection - Azure Active Directory
description: Understand Azure AD password protection common troubleshooting

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

# Azure AD Password Protection troubleshooting

After the deployment of Azure AD Password Protection, troubleshooting may be required. This article goes into detail to help you understand some common troubleshooting steps.

## The DC agent cannot locate a proxy in the directory

The main symptom of this problem is 30017 events in the DC agent Admin event log.

The usual cause of this issue is that a proxy has not yet been registered. If a proxy has been registered, there may be some delay due to AD replication latency until a particular DC agent is able to see that proxy.

## The DC agent is not able to communicate with a proxy

The main symptom of this problem is 30018 events in the DC agent Admin event log. This may have several possible causes:

1. The DC agent is located in an isolated portion of the network that does not allow network connectivity to the registered proxy(s). This problem may therefore be expected\benign as long as other DC agents can communicate with the proxy(s) in order to download password policies from Azure, which will then be obtained by the isolated DC via replication of the policy files in the sysvol share.

1. The proxy host machine is blocking access to the RPC endpoint mapper endpoint (port 135)

   The Azure AD Password Protection Proxy installer automatically creates a Windows Firewall inbound rule that allows access to port 135. If this rule is later deleted or disabled, DC agents will be unable to communicate with the Proxy service. If the builtin Windows Firewall has been disabled in lieu of another firewall product, you must configure that firewall to allow access to port 135.

1. The proxy host machine is blocking access to the RPC endpoint (dynamic or static) listened on by the Proxy service

   The Azure AD Password Protection Proxy installer automatically creates a Windows Firewall inbound rule that allows access to any inbound ports listened to by the Azure AD Password Protection Proxy service. If this rule is later deleted or disabled, DC agents will be unable to communicate with the Proxy service. If the builtin Windows Firewall has been disabled in lieu of another firewall product, you must configure that firewall to allow access to any inbound ports listened to by the Azure AD Password Protection Proxy service. This configuration may be made more specific if the Proxy service has been configured to listen on a specific static RPC port (using the `Set-AzureADPasswordProtectionProxyConfiguration` cmdlet).

## The Proxy service can receive calls from DC agents in the domain but is unable to communicate with Azure

1. Ensure the proxy machine has connectivity to the endpoints listed in the [deployment requirements](howto-password-ban-bad-on-premises-deploy.md).

1. Ensure that the forest and all proxy servers are registered against the same Azure tenant.

   You can check this by running the  `Get-AzureADPasswordProtectionProxy` and `Get-AzureADPasswordProtectionDCAgent` PowerShell cmdlets, then compare the `AzureTenant` property of each returned item. For correct operation these must be the same within a forest, across all DC agents and proxy servers.

   If an Azure tenant registration mismatch condition does exist, this can be repaired by running the `Register-AzureADPasswordProtectionProxy` and/or `Register-AzureADPasswordProtectionForest` PowerShell cmdlets as needed, making sure to use credentials from the same Azure tenant for all registrations.

## The DC agent is unable to encrypt or decrypt password policy files and other state

This problem can manifest with a variety of symptoms but usually has a common root cause.

Azure AD Password Protection has a critical dependency on the encryption and decryption functionality supplied by the Microsoft Key Distribution Service, which is available on domain controllers running Windows Server 2012 and later. The KDS service must be enabled and functional on all Windows Server 2012 and later domain controllers in a domain.

By default the KDS service's service start mode is configured as Manual (Trigger Start). This configuration means that the first time a client tries to use the service, it is started on-demand. This default service start mode is acceptable for Azure AD Password Protection to work.

If the KDS service start mode has been configured to Disabled, this configuration must be fixed before Azure AD Password Protection will work properly.

A simple test for this issue is to manually start the KDS service, either via the Service management MMC console, or using other service management tools (for example, run "net start kdssvc" from a command prompt console). The KDS service is expected to start successfully and stay running.

The most common root cause for the KDS service being unable to start is that the Active Directory domain controller object is located outside of the default Domain Controllers OU. This configuration is not supported by the KDS service and is not a limitation imposed by Azure AD Password Protection. The fix for this condition is to move the domain controller object to a location under the default Domain Controllers OU.

## Weak passwords are being accepted but should not be

This problem may have several causes.

1. Your DC agent(s) cannot download a policy or is unable to decrypt existing policies. Check for possible causes in the above topics.

1. The password policy Enforce mode is still set to Audit. If this configuration is in effect, reconfigure it to Enforce using the Azure AD Password Protection portal. See [Enable Password protection](howto-password-ban-bad-on-premises-operations.md#enable-password-protection).

1. The password policy has been disabled. If this configuration is in effect, reconfigure it to enabled using the Azure AD Password Protection portal. See [Enable Password protection](howto-password-ban-bad-on-premises-operations.md#enable-password-protection).

1. You have not installed the DC agent software on all domain controllers in the domain. In this situation, it is difficult to ensure that remote Windows clients target a particular domain controller during a password change operation. If you have think you have successfully targeted a particular DC where the DC agent software is installed, you can verify by double-checking the DC agent admin event log: regardless of outcome, there will be at least one event to document the outcome of the password validation. If there is no event present for the user whose password is changed, then the password change was likely processed by a different domain controller.

   As an alternative test, try setting\changing passwords while logged in directly to a DC where the DC agent software is installed. This technique is not recommended for production Active Directory domains.

   While incremental deployment of the DC agent software is supported subject to these limitations, Microsoft strongly recommends that the DC agent software is installed on all domain controllers in a domain as soon as possible.

1. The password validation algorithm may actually be working as expected. See [How are passwords evaluated](concept-password-ban-bad.md#how-are-passwords-evaluated).

## Directory Services Repair Mode

If the domain controller is booted into Directory Services Repair Mode, the DC agent service detects this condition and will cause all password validation or enforcement activities to be disabled, regardless of the currently active policy configuration.

## Emergency remediation

If a situation occurs where the DC agent service is causing problems, the DC agent service may be immediately shut down. The DC agent password filter dll still attempts to call the non-running service and will log warning events (10012, 10013), but all incoming passwords are accepted during that time. The DC agent service may then also be configured via the Windows Service Control Manager with a startup type of “Disabled” as needed.

Another remediation measure would be to set the Enable mode to No in the Azure AD Password Protection portal. Once the updated policy has been downloaded, each DC agent service will go into a quiescent mode where all passwords are accepted as-is. For more information, see [Enforce mode](howto-password-ban-bad-on-premises-operations.md#enforce-mode).

## Domain controller demotion

It is supported to demote a domain controller that is still running the DC agent software. Administrators should be aware however that the DC agent software continues to enforce the current password policy during the demotion procedure. The new local Administrator account password (specified as part of the demotion operation) is validated like any other password. Microsoft recommends that secure passwords be chosen for local Administrator accounts as part of a DC demotion procedure; however the validation of the new local Administrator account password by the DC agent software may be disruptive to pre-existing demotion operational procedures.

Once the demotion has succeeded, and the domain controller has been rebooted and is again running as a normal member server, the DC agent software reverts to running in a passive mode. It may then be uninstalled at any time.

## Removal

If it is decided to uninstall the Azure AD password protection software and cleanup all related state from the domain(s) and forest, this task can be accomplished using the following steps:

> [!IMPORTANT]
> It is important to perform these steps in order. If any instance of the Proxy service is left running it will periodically re-create its serviceConnectionPoint object. If any instance of the DC agent service is left running it will periodically re-create its serviceConnectionPoint object and the sysvol state.

1. Uninstall the Proxy software from all machines. This step does **not** require a reboot.
2. Uninstall the DC Agent software from all domain controllers. This step **requires** a reboot.
3. Manually remove all Proxy service connection points in each domain naming context. The location of these objects may be discovered with the following Active Directory PowerShell command:

   ```powershell
   $scp = "serviceConnectionPoint"
   $keywords = "{ebefb703-6113-413d-9167-9f8dd4d24468}*"
   Get-ADObject -SearchScope Subtree -Filter { objectClass -eq $scp -and keywords -like $keywords }
   ```

   Do not omit the asterisk (“*”) at the end of the $keywords variable value.

   The resulting object(s) found via the `Get-ADObject` command can then be piped to `Remove-ADObject`, or deleted manually.

4. Manually remove all DC agent connection points in each domain naming context. There may be one these objects per domain controller in the forest, depending on how widely the software was deployed. The location of that object may be discovered with the following Active Directory PowerShell command:

   ```powershell
   $scp = "serviceConnectionPoint"
   $keywords = "{2bac71e6-a293-4d5b-ba3b-50b995237946}*"
   Get-ADObject -SearchScope Subtree -Filter { objectClass -eq $scp -and keywords -like $keywords }
   ```

   The resulting object(s) found via the `Get-ADObject` command can then be piped to `Remove-ADObject`, or deleted manually.

   Do not omit the asterisk (“*”) at the end of the $keywords variable value.

5. Manually remove the forest-level configuration state. The forest configuration state is maintained in a container in the Active Directory configuration naming context. It can be discovered and deleted as follows:

   ```powershell
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
