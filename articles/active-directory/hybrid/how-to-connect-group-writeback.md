---
title: 'Azure AD Connect: Group writeback'
description: This article describes group writeback in Azure AD Connect.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.date: 06/11/2020
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---


# Azure AD Connect group writeback

Groups writeback enables customers to leverage cloud groups for their hybrid needs. If you use the Office 365 Groups feature, then you can have these groups represented in your on-premises Active Directory. This option is **only** available if you have Exchange present in your on-premises Active Directory.

## Pre-requisites
The following pre-requisites must be met in order to enable group writeback.
- Azure Active Directory Premium licenses for your tenant.
- A configured hybrid deployment between your Exchange on-premises organization and Office 365 and verified it's functioning correctly.
- Installed a supported version of Exchange on-premises
- Configured single sign-on using Azure Active Directory Connect 

## Enable group writeback
To enable group writeback, use the following steps:

1. Open the Azure AD Connect wizard, select **Configure** and then click **Next**.
2. Select **Customize synchronization options** and then click **Next**.
3. On the **Connect to Azure AD** page, enter your credentials. Click **Next**.
4. On the **Optional features** page, verify that the options you previously configured are still selected.
5. Select **Group writeback** and then click **Next**.
6. On the **Writeback page**, select an Active Directory organizational unit (OU) to store objects that are synchronized from Office 365 to your on-premises organization, and then click **Next**.
7. On the **Ready** to configure page, click **Configure**.
8. When the wizard is complete, click **Exit** on the Configuration complete page.
9. Open the Windows PowerShell on the Azure Active Directory Connect server, and run the following commands.

```Powershell
$AzureADConnectSWritebackAccountDN =  <MSOL_ account DN>
Import-Module "C:\Program Files\Microsoft Azure Active Directory Connect\AdSyncConfig\AdSyncConfig.psm1"
Set-ADSyncUnifiedGroupWritebackPermissions -ADConnectorAccountDN $AzureADConnectSWritebackAccountDN
```

For additional information on configuring the Office 365 groups see [Configure Microsoft 365 Groups with on-premises Exchange hybrid](https://docs.microsoft.com/exchange/hybrid-deployment/set-up-office-365-groups#enable-group-writeback-in-azure-ad-connect).

## Disabling group writeback
To disable Group Writeback, use the following steps: 


1. Launch the Azure Active Directory Connect wizard and navigate to the Additional Tasks page. Select the **Customize synchronization options** task and click **next**.
2. On the **Optional Features** page, uncheck group writeback.  You will receive a warning letting you know that groups will be deleted.  Click **Yes**.
   >[!IMPORTANT]
   > Disabling Group Writeback will cause any groups that were previously created by this feature to be deleted from your local Active Directory on the next synchronization cycle. 

   ![Uncheck box](media/how-to-connect-group-writeback/group2.png)
  
3. Click **Next**.
4. Click **Configure**.

 >[!NOTE]
 > Disabling Group Writeback will set the Full Import and Full Synchronization flags to ‘true’ on the Azure Active Directory Connector, causing the rule changes to propagate through on the next synchronization cycle, deleting the groups that were previously written back to your Active Directory.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
