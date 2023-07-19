---
title: Azure Virtual Desktop (classic) PowerShell - Azure
description: How to troubleshoot issues with PowerShell when you set up an Azure Virtual Desktop (classic) tenant environment.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 04/05/2022
ms.author: helohr
manager: femila
---

# Azure Virtual Desktop (classic) PowerShell

> [!IMPORTANT]
> This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../troubleshoot-powershell.md).

Use this article to resolve errors and issues when using PowerShell with Azure Virtual Desktop. For more information on Remote Desktop Services PowerShell, see [Azure Virtual Desktop PowerShell](/powershell/windows-virtual-desktop/overview).

## Provide feedback

Visit the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop) to discuss the Azure Virtual Desktop service with the product team and active community members.

## PowerShell commands used during Azure Virtual Desktop setup

This section lists PowerShell commands that are typically used while setting up Azure Virtual Desktop and provides ways to resolve issues that may occur while using them.

### Error: Add-RdsAppGroupUser command -- The specified UserPrincipalName is already assigned to a RemoteApp app group in the specified Host Pool

```powershell
Add-RdsAppGroupUser -TenantName <TenantName> -HostPoolName <HostPoolName> -AppGroupName 'Desktop Application Group' -UserPrincipalName <UserName>
```

**Cause:** The username used has been already assigned to an application group of a different type. Users can't be assigned to both a remote desktop and RemoteApp application group under the same session host pool.

**Fix:** If user needs both a RemoteApp and desktop, create different host pools or only grant user access to the remote desktop, which will permit the use of any application on the session host VM.

### Error: Add-RdsAppGroupUser command -- The specified UserPrincipalName doesn't exist in the Azure Active Directory associated with the Remote Desktop tenant

```powershell
Add-RdsAppGroupUser -TenantName <TenantName> -HostPoolName <HostPoolName> -AppGroupName "Desktop Application Group" -UserPrincipalName <UserPrincipalName>
```

**Cause:** The user specified by the -UserPrincipalName cannot be found in the Azure Active Directory tied to the Azure Virtual Desktop tenant.

**Fix:** Confirm the items in the following list.

- The user is synched to Azure Active Directory.
- The user isn't tied to business to consumer (B2C) or business-to-business (B2B) commerce.
- The Azure Virtual Desktop tenant is tied to correct Azure Active Directory.

### Error: Get-RdsDiagnosticActivities -- User isn't authorized to query the management service

```powershell
Get-RdsDiagnosticActivities -ActivityId <ActivityId>
```

**Cause:** -TenantName parameter

**Fix:** Issue Get-RdsDiagnosticActivities with -TenantName \<TenantName>.

### Error: Get-RdsDiagnosticActivities -- the user isn't authorized to query the management service

```powershell
Get-RdsDiagnosticActivities -Deployment -username <username>
```

**Cause:** Using -Deployment switch.

**Fix:** -Deployment switch can be used only by deployment administrators. These administrators are usually members of the Remote Desktop Services/Azure Virtual Desktop team. Replace the -Deployment switch with -TenantName \<TenantName>.

### Error: New-RdsRoleAssignment -- the user isn't authorized to query the management service

**Cause 1:** The account being used doesn't have Remote Desktop Services Owner permissions on the tenant.

**Fix 1:** A user with Remote Desktop Services owner permissions needs to execute the role assignment.

**Cause 2:** The account being used has Remote Desktop Services owner permissions but isn't part of the tenant's Azure Active Directory or doesn't have permissions to query the Azure Active Directory where the user is located.

**Fix 2:** A user with Active Directory permissions needs to execute the role assignment.

> [!NOTE]
> New-RdsRoleAssignment cannot give permissions to a user that doesn't exist in the Azure Active Directory (Azure AD).

## Error: SessionHostPool could not be deleted

This error usually happens when you run the following command to try to remove a session host.

```powershell
Remove-RdsHostPool -TenantName <TenantName> -Name <HostPoolName>
```

**Cause:** If you run the command before deleting the host pool's leaf objects, it won't work.

**Fix:** Run the following command to delete the session host. 

```powershell
Get-RdsSessionHost-TenantName <TenantName> -Hostpook <HostPoolName> | Remove-RdsSessionHost -Force
```

Using the force command will let you delete the session host even if it has assigned users.

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview-2019.md).
- To troubleshoot issues while creating a tenant and host pool in an Azure Virtual Desktop environment, see [Tenant and host pool creation](troubleshoot-set-up-issues-2019.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration-2019.md).
- To troubleshoot issues with Azure Virtual Desktop client connections, see [Azure Virtual Desktop service connections](troubleshoot-service-connection-2019.md).
- To troubleshoot issues with Remote Desktop clients, see [Troubleshoot the Remote Desktop client](../troubleshoot-client-windows.md)
- To learn more about the service, see [Azure Virtual Desktop environment](environment-setup-2019.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
- To learn about auditing actions, see [Audit operations with Resource Manager](../../azure-monitor/essentials/activity-log.md).
- To learn about actions to determine the errors during deployment, see [View deployment operations](../../azure-resource-manager/templates/deployment-history.md).
