---
title: Windows Virtual Desktop Troubleshooting Guide - Azure
description: How to resolve common issues when you setting up a Windows Virtual Desktop tenant environment.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 04/08/2019
ms.author: v-chjenk
---
# Troubleshoot issues when using PowerShell with Windows Virtual Desktop

This article covers common errors and issues reported when using PowerShell with Windows Virtual Desktop. For more information on Remote Desktop Services PowerShell, see [Windows Virtual Desktop Powershell](https://docs.microsoft.com/powershell/module/windowsvirtualdesktop/).

## Provide feedback

We currently aren't taking support cases while Windows Virtual Desktop is in preview. Visit the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop) to discuss the Windows Virtual Desktop service with the product team and active community members.

### Add-RdsAppGroupUser command

Below are typical errors when using the Powershell Add-RdsAppGroupUser command.

```cmd
Add-RdsAppGroupUser -TenantName <TenantName> -HostPoolName <HostPoolName> -AppGroupName 'Desktop Application Group' -UserPrincipalName <UserName>
```

### Error: The specified UserPrincipalName is already assigned to a RemoteApp AppGroup in the specified HostPool

**Cause:** The username used has been already assigned to an AppGroup of a different type. Users can’t be assigned to both a remote desktop and remote app group under the same session host pool.

**Fix:** If user needs both remote apps and remote desktop, create different host pools or grant user access to the remote desktop, which will permit the use of any application on the session host VM.

```cmd
Add-RdsAppGroupUser -TenantName <TenantName> -HostPoolName <HostPoolName> -AppGroupName “Desktop Application Group” -UserPrincipalName <UserPrincipalName>
```

### Error: The specified UserPrincipalName doesn't exist in the Azure Active Directory associated with the Remote Desktop tenant

**Cause:** The user specified by the -UserPrincipalName cannot be found in the Azure Active Directory tied to the Windows Virtual Desktop tenant.

**Fix:** Confirm the items in the following list.

- The user is synched to Azure Active Directory.
- The user isn't tied to business to consumer (B2C) or business-to-business (B2B) commerce.
- The Windows Virtual Desktop tenant is tied to correct Azure Active Directory.

## Get-RdsDiagnosticActivities command

```cmd
Get-RdsDiagnosticActivities -ActivityId \<ActivityId\>
```

### Error: Get-RdsDiagnosticActivities: User isn't authorized to query the management service

**Cause:** -TenantName switch isn't specified. Issuing Get-RdsDiagnosticActivities without -TenantName \<TenantName\> will query the entire Windows Virtual Desktop service, which isn't allowed.

**Fix:** Issue Get-RdsDiagnosticActivities with -TenantName \<TenantName\>.

```cmd
Get-RdsDiagnosticActivities -Deployment -username \<username\>
```

### Error: Get-RdsDiagnosticActivities -- the user isn't authorized to query the management service

**Cause:** Using -Deployment switch.

**Fix:** -Deployment switch can be used by deployment administrators only. These administrators are usually members of the Remote Desktop Services/Windows Virtual Desktop team. Replace -Deployment with -TenantName \<TenantName\>

## New-RdsRoleAssignment command

New-RdsRoleAssignment cannot give permissions to a user that doesn't exist in the Azure Active Directory (AD).

### Error: New-RdsRoleAssignment -- the user isn't authorized to query the management service

**Cause:** The account being used doesn't have Remote Desktop Services Owner permissions on the tenant.

**Fix:** A user with Remote Desktop Services owner permissions needs to execute the role assignment.

### Error: New-RdsRoleAssignment -- the user isn't authorized to query the management service

**Cause:** The account being used has Remote Desktop Services owner permissions but isn't part of AD or doesn't have permissions to query AD where the user is located.

**Fix:** A user with Active Directory permissions needs to execute the role assignment.

- To see an overview for troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshoot overview for Windows Virtual Desktop issues](troubleshoot-set-up-overview.md) 
- To troubleshoot issues during the initial set up of Windows Virtual Desktop, see [Troubleshoot Windows Virtual Desktop set up issues](troubleshoot-set-up-issues.md)
- To troubleshoot issues with Windows Virtual Desktop VM configuration, see [Troubleshoot Windows Virtual Desktop VM issues](troubleshoot-vm-configuration.md)
- To troubleshoot issues with Windows Virtual Desktop client connections, see [Troubleshoot Windows Virtual Desktop client connections](troubleshoot-client-connection.md)
- To learn more about the Preview service, see [Windows Desktop Preview environment](https://review.docs.microsoft.com/azure/virtual-desktop/environment-setup?branch=pr-en-us-71423).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-tutorial-troubleshoot).
- To learn about auditing actions, see [Audit operations with Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-audit).
- To learn about actions to determine the errors during deployment, see [View deployment operations](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-deployment-operations).