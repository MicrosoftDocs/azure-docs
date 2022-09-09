---
title: 'Disable group writeback in Azure AD Connect'
description: This article describes how to disable Group Writeback in Azure AD Connect. 
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.date: 06/15/2022
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---

# Disabling group writeback 
The following document will walk you thorough disabling group writeback. To disable group writeback for your organization, use the following steps: 

1. Launch the Azure Active Directory Connect wizard and navigate to the Additional Tasks page. Select the Customize synchronization options task and click next. 
2. On the Optional Features page, uncheck group writeback. You'll receive a warning letting you know that groups will be deleted. Click Yes. 
 >[!Important] 
 >Disabling Group Writeback will cause any groups that were previously created by this feature to be deleted from your local Active Directory on the next synchronization cycle. 

3. Uncheck the box 
4. Click Next. 
5. Click Configure. 


>[!Note] 
>Disabling Group Writeback will set the Full Import and Full Synchronization flags to 'true' on the Azure Active Directory Connector, causing the rule changes to propagate through on the next synchronization cycle, deleting the groups that were previously written back to your Active Directory. 

 

## Rolling back group writeback 

To disable or roll back group writeback via PowerShell, do the following: 

1. Open a PowerShell prompt as administrator. 
2. Disable the sync scheduler after verifying that no synchronization operations are running: 
``` PowerShell 
 Set-ADSyncScheduler -SyncCycleEnabled $false  
 ``` 
3. Import the ADSync module: 
 ``` PowerShell 
 Import-Module  'C:\Program Files\Microsoft Azure AD Sync\Bin\ADSync\ADSync.psd1' 
 ``` 
4. Disable the group writeback feature for the tenant: 
 ``` PowerShell 
 Set-ADSyncAADCompanyFeature -GroupWritebackV2 $false 
 ``` 
5. Re-enable the Sync Scheduler 
 ``` PowerShell 
 Set-ADSyncScheduler -SyncCycleEnabled $true  
 ``` 


## Next Steps: 

- [Azure AD Connect group writeback](how-to-connect-group-writeback-v2.md) 
- [Modify Azure AD Connect group writeback default behavior](how-to-connect-modify-group-writeback.md) 
- [Enable Azure AD Connect group writeback](how-to-connect-group-writeback-enable.md) 
 
