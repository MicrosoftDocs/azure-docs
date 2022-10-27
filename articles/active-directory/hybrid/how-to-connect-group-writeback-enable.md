---
title: 'Enable Azure AD Connect group writeback'
description: This article describes how to enable group writeback in Azure AD Connect by using PowerShell and a wizard. 
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

# Enable Azure AD Connect group writeback 

Group writeback is a feature that allows you to write cloud groups back to your on-premises Active Directory instance by using Azure Active Directory (Azure AD) Connect sync. 

This article walks you through enabling group writeback. 
 
## Deployment steps 

Group writeback requires enabling both the original and new versions of the feature. If the original version was previously enabled in your environment, you need to use only the first set of the following steps, because the second set of steps has already been completed. 
 
> [!NOTE] 
> We recommend that you follow the [swing migration](how-to-upgrade-previous-version.md#swing-migration) method for rolling out the new group writeback feature in your environment. This method will provide a clear contingency plan if a major rollback is necessary. 
>
>The enhanced group writeback feature is enabled on the tenant and not per Azure AD Connect client instance. Please be sure that all Azure AD Connect client instances are updated to a minimal build version of 1.6.4.0 or later.

### Enable group writeback by using PowerShell 

1. On your Azure AD Connect server, open a PowerShell prompt as an administrator. 
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

### Enable group writeback by using the Azure AD Connect wizard 
If the original version of group writeback was not previously enabled, continue with the following steps: 

1. On your Azure AD Connect server, open the Azure AD Connect wizard.
2. Select **Configure**, and then select **Next**. 
3. Select **Customize synchronization options**, and then select **Next**. 
4. On the **Connect to Azure AD** page, enter your credentials. Select **Next**. 
5. On the **Optional features** page, verify that the options you previously configured are still selected. 
6. Select **Group Writeback**, and then select **Next**. 
7. On the **Writeback** page, select an Active Directory organizational unit (OU) to store objects that are synchronized from Microsoft 365 to your on-premises organization. Select **Next**. 
8. On the **Ready to configure** page, select **Configure**. 
9. On the **Configuration complete** page, select **Exit**. 

After you finish this procedure, group writeback is configured automatically. If you experience permission issues while exporting the object to Active Directory, open Windows PowerShell as an administrator on the Azure AD Connect server. Then run the following commands. This step is optional. 
 
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

To make it easier to find groups being written back from Azure AD to Active Directory, there's an option to write back the group distinguished name by using the cloud display name: 

- Default format: 
`CN=Group_3a5c3221-c465-48c0-95b8-e9305786a271, OU=WritebackContainer, DC=domain, DC=com`  

- New format: 
`CN=Administrators_e9305786a271, OU=WritebackContainer, DC=domain, DC=com`  

When you're configuring group writeback, a checkbox appears at the bottom of the configuration window. Select it to enable this feature. 

> [!NOTE]
> Groups being written back from Azure AD to Active Directory will have a source of authority in the cloud. Any changes made on-premises to groups that are written back from Azure AD will be overwritten in the next sync cycle. 

## Next steps 

- [Azure AD Connect group writeback](how-to-connect-group-writeback-v2.md) 
- [Modify Azure AD Connect group writeback default behavior](how-to-connect-modify-group-writeback.md) 
- [Disable Azure AD Connect group writeback](how-to-connect-group-writeback-disable.md) 
