---
title: 'Azure AD Connect sync: Event ID 6000 or no-start-credentials error after password change | Microsoft Docs'
description: This topic documents how to update the connector after the password of the AD DS account is changed.
services: active-directory
keywords: AD DS account, password
documentationcenter: ''
author: cychua
manager: femila
editor: ''

ms.assetid: ac10fa0c-6269-48da-a1e5-ee24e4cc3738
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/27/2017
ms.author: billmath

---
# Azure AD Connect sync: Event ID 6000 or 'no-start-credentials' error after password change
The AD DS account refers to the domain user account used by Azure AD Connect Synchronization Service to connect with on-premises AD. If you change the account password, the Synchronization Service will no longer be able to import/export changes to on-premises AD.

## Symptoms
There are two common symptoms:

* The import/export step for the AD connector fails with *"no-start-credentials"* error.

* Under Windows Event Viewer, the application event log contains an error with Event ID 6000 and message *“The management agent “contoso.com” failed to run because the credentials were invalid.”*

## Recovery steps
To resolve the issue, provide the Synchronization Service with the new password:

1. Start the **Synchronization Service Manager** (START → Synchronization Service).

2. Go to the **Connectors** tab.

3. Select the **AD Connector** which is configured to use the AD DS account.

4. Under **Actions**, select **Properties**.

5. In the pop-up dialog, select **Connect to Active Directory Forest**:

    * The **Forest name** indicates the corresponding on-prem AD.
  
    * The **User name** indicates the AD DS account used for synchronization.

6. Enter the new password of the AD DS account in the **Password** textbox

7. Click **OK** to save the new password and close the pop-up dialog.

8.	Restart the **Synchronization Service** to remove the old password from memory cache:

    1. Go to **Windows Service Control Manager** (START → Services).
  
    2. Select **Microsoft Azure AD Sync** and click **Start** or **Restart**.
    
    
## Next steps
**Overview topics**

* [Azure AD Connect sync: Understand and customize synchronization](active-directory-aadconnectsync-whatis.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
