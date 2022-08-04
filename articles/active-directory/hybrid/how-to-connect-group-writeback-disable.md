---
title: 'Disable Group Writeback in Azure AD Connect'
description: This article describes how to disable Group Writeback in Azure AD Connect. 
services: active-directory
author: billmath
manager: karenhoran
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.date: 06/15/2022
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---


# Disable Azure AD Connect group writeback disabling group writeback 

 

## Disabling Group writeback 

To disable Group writeback for your organization, use the following steps: 

Launch the Azure Active Directory Connect wizard and navigate to the Additional Tasks page. Select the Customize synchronization options task and click next. 

On the Optional Features page, uncheck group writeback. You'll receive a warning letting you know that groups will be deleted. Click Yes. 

>[!Important] 

>Disabling Group Writeback will cause any groups that were previously created by this feature to be deleted from your local Active Directory on the next synchronization cycle. 

Uncheck box 

Click Next. 

Click Configure. 

  

 

>[!Note] 

>Disabling Group Writeback will set the Full Import and Full Synchronization flags to 'true' on the Azure Active Directory Connector, causing the rule changes to propagate through on the next synchronization cycle, deleting the groups that were previously written back to your Active Directory. 

 

## Rolling back group writeback 

To disable or rollback group writeback via powershell, do the following: 

Open a PowerShell prompt as administrator. 

Disable the sync scheduler after verifying that no synchronization operations are running: 

``` PowerShell 

Set-ADSyncScheduler -SyncCycleEnabled $false  

``` 

Import the ADSync module: 

``` PowerShell 

Import-Module  'C:\Program Files\Microsoft Azure AD Sync\Bin\ADSync\ADSync.psd1' 

``` 

Disable the group writeback feature for the tenant: 

``` PowerShell 

Set-ADSyncAADCompanyFeature -GroupWritebackV2 $false 

``` 

Re-enable the Sync Scheduler 

``` PowerShell 

Set-ADSyncScheduler -SyncCycleEnabled $true  

``` 

 

 

Next Steps: 

What you need to know 

Modify default group writeback 

Enable group writeback 

Group writeback portal operations (preview) in Azure Active Directory - Microsoft Entra | Microsoft Docs 

 