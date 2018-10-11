---
title: 'Azure AD Connect sync:  Changing the Azure AD Connect Sync service account | Microsoft Docs'
description: This topic document describes the encryption key and how to abandon it after the password is changed.
services: active-directory
keywords: Azure AD sync service account, password
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''
ms.assetid: 76b19162-8b16-4960-9e22-bd64e6675ecc
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.component: hybrid
ms.author: billmath

---
# Changing the Azure AD Connect sync service account password
If you change the  Azure AD Connect sync service account password, the Synchronization Service will not be able start correctly until you have abandoned the encryption key and reinitialized the Azure AD Connect sync service account password. 

Azure AD Connect, as part of the Synchronization Services uses an encryption key to store the passwords of the AD DS and Azure AD service accounts.  These accounts are encrypted before they are stored in the database. 

The encryption key used is secured using [Windows Data Protection (DPAPI)](https://msdn.microsoft.com/library/ms995355.aspx). DPAPI protects the encryption key using the **password of the Azure AD Connect sync service account**. 

If you need to change the service account password you can use the procedures in [Abandoning the Azure AD Connect Sync encryption key](#abandoning-the-azure-ad-connect-sync-encryption-key) to accomplish this.  These procedures should also be used if you need to abandon the encryption key for any reason.

## Issues that arise from changing the password
There are two things that need to be done when you change the service account password.

First, you need to change the password under the Windows Service Control Manager.  Until this issue is resolved you will see following errors:


- If you try to start the Synchronization Service in Windows Service Control Manager, you receive the error "**Windows could not start the Microsoft Azure AD Sync service on Local Computer**". **Error 1069: The service did not start due to a logon failure.**"
- Under Windows Event Viewer, the system event log contains an error with **Event ID 7038** and message “**The ADSync service was unable to log on as with the currently configured password due to the following error: The user name or password is incorrect.**"

Second, under specific conditions, if the password is updated, the Synchronization Service can no longer retrieve the encryption key via DPAPI. Without the encryption key, the Synchronization Service cannot decrypt the passwords required to synchronize to/from on-premises AD and Azure AD.
You will see errors such as:

- Under Windows Service Control Manager, if you try to start the Synchronization Service and it cannot retrieve the encryption key, it fails with error “**Windows could not start the Microsoft Azure AD Sync on Local Computer. For more information, review the System Event log. If this is a non-Microsoft service, contact the service vendor, and refer to service-specific error code **-21451857952****.”
- Under Windows Event Viewer, the application event log contains an error with **Event ID 6028** and error message *“**The server encryption key cannot be accessed.**”*

To ensure that you do not receive these errors, follow the procedures in [Abandoning the Azure AD Connect Sync encryption key](#abandoning-the-azure-ad-connect-sync-encryption-key) when changing the password.
 
## Abandoning the Azure AD Connect Sync encryption key
>[!IMPORTANT]
>The following procedures only apply to Azure AD Connect build 1.1.443.0 or older.

Use the following procedures to abandon the encryption key.

### What to do if you need to abandon the encryption key

If you need to abandon the encryption key, use the following procedures to accomplish this.

1. [Abandon the existing encryption key](#abandon-the-existing-encryption-key)

2. [Provide the password of the AD DS account](#provide-the-password-of-the-ad-ds-account)

3. [Reinitialize the password of the Azure AD sync account](#reinitialize-the-password-of-the-azure-ad-sync-account)

4. [Start the Synchronization Service](#start-the-synchronization-service)

#### Abandon the existing encryption key
Abandon the existing encryption key so that new encryption key can be created:

1. Log in to your Azure AD Connect Server as administrator.

2. Start a new PowerShell session.

3. Navigate to folder: `$env:Program Files\Microsoft Azure AD Sync\bin\`

4. Run the command: `./miiskmu.exe /a`

![Azure AD Connect Sync Encryption Key Utility](./media/how-to-connect-sync-change-serviceacct-pass/key5.png)

#### Provide the password of the AD DS account
As the existing passwords stored inside the database can no longer be decrypted, you need to provide the Synchronization Service with the password of the AD DS account. The Synchronization Service encrypts the passwords using the new encryption key:

1. Start the Synchronization Service Manager (START → Synchronization Service).
</br>![Sync Service Manager](./media/how-to-connect-sync-change-serviceacct-pass/startmenu.png)  
2. Go to the **Connectors** tab.
3. Select the **AD Connector** that corresponds to your on-premises AD. If you have more than one AD connector, repeat the following steps for each of them.
4. Under **Actions**, select **Properties**.
5. In the pop-up dialog, select **Connect to Active Directory Forest**:
6. Enter the password of the AD DS account in the **Password** textbox. If you do not know its password, you must set it to a known value before performing this step.
7. Click **OK** to save the new password and close the pop-up dialog.
![Azure AD Connect Sync Encryption Key Utility](./media/how-to-connect-sync-change-serviceacct-pass/key6.png)

#### Reinitialize the password of the Azure AD sync account
You cannot directly provide the password of the Azure AD service account to the Synchronization Service. Instead, you need to use the cmdlet **Add-ADSyncAADServiceAccount** to reinitialize the Azure AD service account. The cmdlet resets the account password and makes it available to the Synchronization Service:

1. Start a new PowerShell session on the Azure AD Connect server.
2. Run cmdlet `Add-ADSyncAADServiceAccount`.
3. In the pop-up dialog, provide the Azure AD Global admin credentials for your Azure AD tenant.
![Azure AD Connect Sync Encryption Key Utility](./media/how-to-connect-sync-change-serviceacct-pass/key7.png)
4. If it is successful, you will see the PowerShell command prompt.

#### Start the Synchronization Service
Now that the Synchronization Service has access to the encryption key and all the passwords it needs, you can restart the service in the Windows Service Control Manager:


1. Go to Windows Service Control Manager (START → Services).
2. Select **Microsoft Azure AD Sync** and click Restart.

## Next steps
**Overview topics**

* [Azure AD Connect sync: Understand and customize synchronization](how-to-connect-sync-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md)
