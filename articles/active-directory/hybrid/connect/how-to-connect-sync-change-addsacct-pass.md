---
title: 'Microsoft Entra Connect Sync:  Changing the AD DS account password'
description: This topic document describes how to update Microsoft Entra Connect after the password of the AD DS account is changed.
services: active-directory
keywords: AD DS account, Active Directory account, password
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.assetid: 76b19162-8b16-4960-9e22-bd64e6675ecc
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Changing the AD DS connector account password
The AD DS connector account refers to the user account used by Microsoft Entra Connect to communicate with on-premises Active Directory. If you change the password of the AD DS connector account in AD, you must update Microsoft Entra Connect Synchronization Service with the new password. Otherwise, the Synchronization can no longer synchronize correctly with the on-premises Active Directory and you will encounter the following errors:

* In the Synchronization Service Manager, any import or export operation with on-premises AD fails with **no-start-credentials** error.

* Under Windows Event Viewer, the application event log contains an error with **Event ID 6000** and message **'The management agent "contoso.com" failed to run because the credentials were invalid'**.


## How to update the Synchronization Service with new password for AD DS connector account
To update the Synchronization Service with the new password:

1. Start the Synchronization Service Manager (START → Synchronization Service).
</br>![Sync Service Manager](./media/how-to-connect-sync-change-addsacct-pass/startmenu.png)  

2. Go to the **Connectors** tab.

3. Select the **AD Connector** that corresponds to the AD DS connector account for which its password was changed.

4. Under **Actions**, select **Properties**.

5. In the pop-up dialog, select **Connect to Active Directory Forest**:

6. Enter the new password of the AD DS connector account in the **Password** textbox.

7. Click **OK** to save the new password and close the pop-up dialog.

8. Restart the **Microsoft Entra ID Sync** service under Windows Service Control Manager. This is to ensure that any reference to the old password is removed from the memory cache.

## Next steps
**Overview topics**

* [Microsoft Entra Connect Sync: Understand and customize synchronization](how-to-connect-sync-whatis.md)

* [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md)
