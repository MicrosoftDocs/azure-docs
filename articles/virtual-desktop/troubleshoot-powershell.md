---
title: Windows Virtual Desktop PowerShell - Azure
description: How to troubleshoot issues with PowerShell when you set up a Windows Virtual Desktop tenant environment.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 04/08/2019
ms.author: v-chjenk
---
# Windows Virtual Desktop PowerShell

Use this article to resolve errors and issues when using PowerShell with Windows Virtual Desktop. For more information on Remote Desktop Services PowerShell, see [Windows Virtual Desktop Powershell](https://docs.microsoft.com/powershell/module/windowsvirtualdesktop/).

## Provide feedback

We currently aren't taking support cases while Windows Virtual Desktop is in preview. Visit the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop) to discuss the Windows Virtual Desktop service with the product team and active community members.

## PowerShell commands used during Windows Virtual Desktop setup

This section lists PowerShell commands that are typically used while setting up Windows Virtual Desktop and provides ways to resolve issues that may occur while using them.

### Error: Add-RdsAppGroupUser command -- The specified UserPrincipalName is already assigned to a RemoteApp app group in the specified Host Pool

```Powershell
Add-RdsAppGroupUser -TenantName <TenantName> -HostPoolName <HostPoolName> -AppGroupName 'Desktop Application Group' -UserPrincipalName <UserName>
```

**Cause:** The username used has been already assigned to an app group of a different type. Users can’t be assigned to both a remote desktop and remote app group under the same session host pool.

**Fix:** If user needs both remote apps and remote desktop, create different host pools or grant user access to the remote desktop, which will permit the use of any application on the session host VM.

### Error: Add-RdsAppGroupUser command -- The specified UserPrincipalName doesn't exist in the Azure Active Directory associated with the Remote Desktop tenant

```PowerShell
Add-RdsAppGroupUser -TenantName <TenantName> -HostPoolName <HostPoolName> -AppGroupName “Desktop Application Group” -UserPrincipalName <UserPrincipalName>
```

**Cause:** The user specified by the -UserPrincipalName cannot be found in the Azure Active Directory tied to the Windows Virtual Desktop tenant.

**Fix:** Confirm the items in the following list.

- The user is synched to Azure Active Directory.
- The user isn't tied to business to consumer (B2C) or business-to-business (B2B) commerce.
- The Windows Virtual Desktop tenant is tied to correct Azure Active Directory.

### Error: Get-RdsDiagnosticActivities -- User isn't authorized to query the management service

```PowerShell
Get-RdsDiagnosticActivities -ActivityId <ActivityId>
```

**Cause:** -TenantName parameter

**Fix:** Issue Get-RdsDiagnosticActivities with -TenantName <TenantName>.

### Error: Get-RdsDiagnosticActivities -- the user isn't authorized to query the management service

```PowerShell
Get-RdsDiagnosticActivities -Deployment -username <username>
```

**Cause:** Using -Deployment switch.

**Fix:** -Deployment switch can be used only by deployment administrators. These administrators are usually members of the Remote Desktop Services/Windows Virtual Desktop team. Replace the -Deployment switch with -TenantName <TenantName>.

### Error: New-RdsRoleAssignment -- the user isn't authorized to query the management service

**Cause 1:** The account being used doesn't have Remote Desktop Services Owner permissions on the tenant.

**Fix 1:** A user with Remote Desktop Services owner permissions needs to execute the role assignment.

**Cause 2:** The account being used has Remote Desktop Services owner permissions but isn't part of the tenant’s Azure Active Directory or doesn't have permissions to query the Azure Active Directory where the user is located.

**Fix 2:** A user with Active Directory permissions needs to execute the role assignment.

>[!Note]
>New-RdsRoleAssignment cannot give permissions to a user that doesn't exist in the Azure Active Directory (AD).

## Next steps

- For an overview on troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating a tenant and host pool in a Windows Virtual Desktop environment, see [Tenant and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Windows Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues with Windows Virtual Desktop client connections, see [Remote Desktop client connections](troubleshoot-client-connection.md).
- To learn more about the Preview service, see [Windows Desktop Preview environment](https://docs.microsoft.com/azure/virtual-desktop/environment-setup).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-tutorial-troubleshoot).
- To learn about auditing actions, see [Audit operations with Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-audit).
- To learn about actions to determine the errors during deployment, see [View deployment operations](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-deployment-operations).