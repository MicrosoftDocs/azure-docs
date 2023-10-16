---
title: 'Disable group writeback in Microsoft Entra Connect'
description: This article describes how to disable group writeback in Microsoft Entra Connect by using the wizard and PowerShell. 
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---

# Disable group writeback 
This article walks you through disabling group writeback in Microsoft Entra Connect. 

## Disable group writeback by using the wizard

1. Open the Microsoft Entra Connect wizard and go to the **Additional Tasks** page. Select the **Customize synchronization options task**, and then select **Next**. 
2. On the **Optional Features** page, clear the checkbox for group writeback. In the warning that groups will be deleted, select **Yes**. 
 
   > [!IMPORTANT] 
   > Disabling group writeback sets the flags for full import and full synchronization in Active Directory Connect to `true`. It will cause any groups that were previously created by this feature to be deleted from your local Active Directory instance in the next synchronization cycle. 

3. Select **Next**. 
4. Select **Configure**. 


## Disable or roll back group writeback via PowerShell 

1. Open a PowerShell prompt as an administrator. 
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
5. Re-enable the sync scheduler:

   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $true  
   ``` 


## Next steps 

- [Microsoft Entra Connect group writeback](how-to-connect-group-writeback-v2.md) 
- [Modify Microsoft Entra Connect group writeback default behavior](how-to-connect-modify-group-writeback.md) 
- [Enable Microsoft Entra Connect group writeback](how-to-connect-group-writeback-enable.md) 
 
