---
title: 'Enable Azure AD Connect group writeback'
description: This article describes how to enable Group Writeback in Azure AD Connect. 
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

Group writeback is the feature that allows you to write cloud groups back to your on-premises Active Directory using Azure AD Connect Sync. 

The following document will walk you through enabling group writeback. 
 
## Deployment Steps 

Group writeback requires enabling both the original and new versions of the feature. If the original version was previously enabled in your environment, you will only need to follow the first set of steps, as the second set of steps has already been completed. 
 
>[!Note] 
>It is recommended that you follow the [swing migration](how-to-upgrade-previous-version.md#swing-migration) method for rolling out the new group writeback feature in your environment. This method will provide a clear contingency plan in the event that a major rollback is necessary. 

  
### Step 1 - Enable group writeback using PowerShell 

1. On your Azure AD Connect server, open a PowerShell prompt as administrator. 
2. Disable the sync scheduler after verifying that no synchronization operations are running. 

 ``` PowerShell 
 Set-ADSyncScheduler -SyncCycleEnabled $false  
 ``` 
3. Import the ADSync module. 
 ``` PowerShell 
 Import-Module  'C:\Program Files\Microsoft Azure AD Sync\Bin\ADSync\ADSync.psd1' 
 ``` 
4. Enable the group writeback feature for the tenant. 
 ``` PowerShell 
 Set-ADSyncAADCompanyFeature -GroupWritebackV2 $true 
 ``` 
5. Re-enable the Sync Scheduler. 
 ``` PowerShell 
 Set-ADSyncScheduler -SyncCycleEnabled $true  
 ``` 

### Step 2 – Enable group writeback using Azure AD Connect wizard 
If the original version of group writeback was not previously enabled, continue with the following steps. 

 

1. On your Azure AD Connect server, open the Azure AD Connect wizard, select **Configure** and then click **Next**. 
2. Select **Customize synchronization options** and then click **Next**. 
3. On the **Connect to Azure AD page**, enter your credentials. Click **Next**. 
4. On the **Optional features** page, verify that the options you previously configured are still selected. 
5. Select **Group Writeback** and then click **Next**. 
6. On the **Writeback page**, select an Active Directory organizational unit (OU) to store objects that are synchronized from Microsoft 365 to your on-premises organization, and then click **Next**. 
7. On the **Ready to configure page**, click **Configure**. 
8. When the wizard is complete, click **Exit** on the Configuration complete page. Group Writeback will be automatically configured. 

 >[!Note] 
 >The following is performed automatically after the last step above. However, if you experience permission issues while exporting the object to AD then do the following: 
 >  
 >Open the Windows PowerShell as an Administrator on the Azure Active Directory Connect server, and run the following commands. This step is optional 
 > 
 >``` PowerShell 
 >$AzureADConnectSWritebackAccountDN =  <MSOL_ account DN> 
 >Import-Module "C:\Program Files\Microsoft Azure Active Directory Connect\AdSyncConfig\AdSyncConfig.psm1" 
 > 
 ># To grant the <MSOL_account> permission to all domains in the forest: 
 >Set-ADSyncUnifiedGroupWritebackPermissions -ADConnectorAccountDN $AzureADConnectSWritebackAccountDN 
 > 
 ># To grant the <MSOL_account> permission to specific OU (eg. the OU chosen to writeback Office 365 Groups to): 
 >$GroupWritebackOU = <DN of OU where groups are to be written back to> 
 >Set-ADSyncUnifiedGroupWritebackPermissions –ADConnectorAccountDN $AzureADConnectSWritebackAccountDN -ADObjectDN $GroupWritebackOU 
 >``` 

 

## Optional configuration 

To make it easier to find groups being written back from Azure AD to Active Directory, there's an option to write back the group distinguished name with the cloud display name. 

- Default format: 
CN=Group_3a5c3221-c465-48c0-95b8-e9305786a271, OU=WritebackContainer, DC=domain, DC=com  

- New Format: 
CN=Administrators_e9305786a271, OU=WritebackContainer, DC=domain, DC=com  

When configuring group writeback, there will be a checkbox at the bottom of the Group Writeback configuration window. Select the box to enable this feature. 

>[!NOTE]
>Groups being written back from Azure AD to AD will have a source of authority of the cloud. This means any changes made on-premises to groups that are written back from Azure AD will be overwritten on the next sync cycle. 

## Next steps: 

- [Azure AD Connect group writeback](how-to-connect-group-writeback-v2.md) 
- [Modify Azure AD Connect group writeback default behavior](how-to-connect-modify-group-writeback.md) 
- [Disable Azure AD Connect group writeback](how-to-connect-group-writeback-disable.md) 

 

 

 

 

 

 

 

 
