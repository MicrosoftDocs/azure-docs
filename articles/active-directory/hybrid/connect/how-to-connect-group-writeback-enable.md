---
title: 'Enable Microsoft Entra Connect group writeback'
description: This article describes how to enable group writeback in Microsoft Entra Connect by using PowerShell and a wizard. 
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

# Enable Microsoft Entra Connect group writeback 

Group writeback is a feature that allows you to write cloud groups back to your on-premises Active Directory instance by using Microsoft Entra Connect Sync. 

This article walks you through enabling group writeback. 
 
## Deployment steps 

Group writeback requires enabling both the original and new versions of the feature. If the original version was previously enabled in your environment, you need to use only the first set of the following steps, because the second set of steps has already been completed. 
 
> [!NOTE] 
> We recommend that you follow the [swing migration](how-to-upgrade-previous-version.md#swing-migration) method for rolling out the new group writeback feature in your environment. This method will provide a clear contingency plan if a major rollback is necessary. 
>
>The enhanced group writeback feature is enabled on the tenant and not per Microsoft Entra Connect client instance. Please be sure that all Microsoft Entra Connect client instances are updated to a minimal build version of 1.6.4.0 or later.

> [!NOTE]
> If you don't want to writeback all existing Microsoft 365 groups to Active Directory, you need to make changes to group writeback default behaviour before performing the steps in this article to enable the feature. See [Modify Microsoft Entra Connect group writeback default behavior](how-to-connect-modify-group-writeback.md).
> Also the new and original versions of the feature need to be enabled in the order documented. If the original feature is enabled first, all existing Microsoft 365 groups will be written back to Active Directory.

### Enable group writeback by using PowerShell 

1. On your Microsoft Entra Connect server, open a PowerShell prompt as an administrator. 
2. Disable the sync scheduler after you verify that no synchronization operations are running: 

   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $false  
   ``` 
3. Import the ADSync module:

   ``` PowerShell 
   Import-Module  'C:\Program Files\Microsoft Azure AD Sync\Bin\ADSync\ADSync.psd1' 
   ``` 
4. Enable the group writeback feature for the tenant:

   ``` PowerShell 
   Set-ADSyncAADCompanyFeature -GroupWritebackV2 $true 
   ``` 
5. Re-enable the sync scheduler:

   ``` PowerShell 
   Set-ADSyncScheduler -SyncCycleEnabled $true  
   ``` 
6. Run a full sync cycle if group writeback was previously configured and will not be configured in the ⁠Microsoft Entra Connect wizard:
   ``` PowerShell 
   Start-ADSyncSyncCycle -PolicyType Initial
   ``` 


<a name='enable-group-writeback-by-using-the-azure-ad-connect-wizard-'></a>

### Enable group writeback by using the Microsoft Entra Connect wizard 
If the original version of group writeback was not previously enabled, continue with the following steps: 

1. On your Microsoft Entra Connect server, open the Microsoft Entra Connect wizard.
2. Select **Configure**, and then select **Next**. 
3. Select **Customize synchronization options**, and then select **Next**. 
4. On the **Connect to Microsoft Entra ID** page, enter your credentials. Select **Next**. 
5. On the **Optional features** page, verify that the options you previously configured are still selected. 
6. Select **Group Writeback**, and then select **Next**. 
7. On the **Writeback** page, select an Active Directory organizational unit (OU) to store objects that are synchronized from Microsoft 365 to your on-premises organization. Select **Next**. 
8. On the **Ready to configure** page, select **Configure**. 
9. On the **Configuration complete** page, select **Exit**. 

After you finish this procedure, group writeback is configured automatically. If you experience permission issues while exporting the object to Active Directory, open Windows PowerShell as an administrator on the Microsoft Entra Connect server. Then run the following commands. This step is optional. 
 
``` PowerShell 
$AzureADConnectSWritebackAccountDN =  <MSOL_ account DN> 
Import-Module "C:\Program Files\Microsoft Azure Active Directory Connect\AdSyncConfig\AdSyncConfig.psm1" 
 
# To grant the <MSOL_account> permission to all domains in the forest: 
Set-ADSyncUnifiedGroupWritebackPermissions -ADConnectorAccountDN $AzureADConnectSWritebackAccountDN 
 
# To grant the <MSOL_account> permission to a specific OU (for example, the OU chosen to write back Office 365 groups to): 
$GroupWritebackOU = <DN of OU where groups are to be written back to> 
Set-ADSyncUnifiedGroupWritebackPermissions –ADConnectorAccountDN $AzureADConnectSWritebackAccountDN -ADObjectDN $GroupWritebackOU 
``` 

## Optional configuration 

To make it easier to find groups being written back from Microsoft Entra ID to Active Directory, there's an option to write back the group distinguished name by using the cloud display name: 

- Default format: 
`CN=Group_3a5c3221-c465-48c0-95b8-e9305786a271, OU=WritebackContainer, DC=domain, DC=com`  

- New format: 
`CN=Administrators_e9305786a271, OU=WritebackContainer, DC=domain, DC=com`  

When you're configuring group writeback, a checkbox appears at the bottom of the configuration window. Select it to enable this feature. 

> [!NOTE]
> Groups being written back from Microsoft Entra ID to Active Directory will have a source of authority in the cloud. Any changes made on-premises to groups that are written back from Microsoft Entra ID will be overwritten in the next sync cycle. 

## Next steps 

- [Microsoft Entra Connect group writeback](how-to-connect-group-writeback-v2.md) 
- [Modify Microsoft Entra Connect group writeback default behavior](how-to-connect-modify-group-writeback.md) 
- [Disable Microsoft Entra Connect group writeback](how-to-connect-group-writeback-disable.md) 
