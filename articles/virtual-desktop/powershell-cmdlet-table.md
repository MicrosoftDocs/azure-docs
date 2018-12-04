---
title: PowerShell cmdlets - Azure
description: A list of PowerShell cmdlets that can be used for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: reference
ms.date: 10/25/2018
ms.author: helohr
---
# PowerShell cmdlets (Preview)

This article lists the PowerShell cmdlets for Windows Virtual Desktop.

## RDS Owner

|Cmdlet name|Description|
|---|---|
|Get-RdsDeployment|Lists all deployments|
|Set-RdsDeployment|Updates a remote desktop deployment|
|Get-RdsInfraRole|Lists infrastructure roles|
|Set-RdsInfraRole|Updates infrastructure roles|
|New-RdsTenant|Creates a new tenant|
|Get-RdsDiagnosticsActivities|Lists diagnostics|
|New-RdsRoleAssignment|Creates a new role assignment|
|Get-RdsRoleAssignment|Lists all role assignments|
|Remove-RdsRoleAssignment|Deletes a role assignment|
|Get-RdsTenant|Lists all tenants|
|Set-RdsTenant|Updates tenants|
|Remove-RdsTenant|Deletes a tenant|
|New-RdsHostPool|Creates a new host pool|
|Get-RdsHostPool|Lists host pools|
|Set-RdsHostPool|Updates host pools|
|Remove-RdsHostPool|Deletes a host pool|
|Get-RdsHostPoolAvailableApp|Lists available apps|
|New-RdsAppGroup|Creates a new app group|
|New-RdsRegistrationInfo|Creates new registration information|
|Get-RdsDiagnostics|Lists diagnostic info|
|Get-RdsRegistationInfo|Lists registrations|
|Set-RdsRegistationInfo|Updates registration list|
|Remove-RdsRegistationInfo|Deletes a registration|
|Get-RdsSessionHost|Lists session hosts|
|Remove-RdsSessionHost|Deletes a session host|
|Get-RdsUserSession|Lists user session information|
|Send-RdsUserSession|Delivers user session information to a specified destination|
|Invoke-RdsUserSession|Executes a command for the user session|
|Disconnect-RdsUserSession|Disconnects a user session|
|Get-RdsAppGroup|Lists app groups|
|Set-RdsAppGroup|Updates app group list|
|Remove-RdsAppGroup|Deletes an app group|
|New-RdsRemoteApp|Creates a new remote app|
|Get-RdsRemoteApp|List all remote apps|
|Set-RdsRemoteApp|Update a remote app|
|Remove-RdsRemoteApp|Delete a remote app|

## RDS Contributor

Cmdlets for this role are the same as RDS Owner except without **New**, **Get**, or **Remove-RdsRoleAssignment**.

## RDS Reader

|Cmdlet name|Description|
|---|---|
|Get-RdsDeployment|Gets a remote desktop deployment|
|Get-RdsInfraRole|Lists infrastructure roles|
|Get-RdsDiagnostics|Lists diagnostic info|
|Get-RdsTenant|Lists all tenants|
|Get-RdsRegistrationInfo|Lists registration info|
|Get-RdsSessionHost|Lists all session hosts|
|Get-RdsUserSession|Lists all active sessions|
|Get-RdsAppGroup|Lists all app groups|
|Get-RdsRemoteApp|Lists all remote apps|

## RDS Tenant Creator

|Cmdlet name|Description|
|---|---|
|New-RdsTenant|Creates a new tenant|
