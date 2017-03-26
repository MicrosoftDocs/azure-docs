---
title: 'Azure AD Connect sync: How to manage the AD DS account | Microsoft Docs'
description: This topic documents how to update the connector after the password of the AD DS account is changed.
services: active-directory
keywords: AD DS account, password
documentationcenter: ''
author: cychua
manager: femila
editor: ''

ms.assetid: 6a9ca762-2e16-4fda-a304-ebda16818416
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/25/2017
ms.author: billmath

---
# Azure AD Connect sync: How to manage sync service account
The Azure AD Connect sync service account refers to the user account used by Azure AD Connect Synchronization Service as its operating context while running as a Windows service. If you change the service account password, the Synchronization Service will no longer start correctly.

## Symptoms
There are two common symptoms:

* If you try to start the Synchronization Service in Windows Service Control Manager, you will receive the error *"Windows could not start the Microsoft Azure AD Sync service on Local Computer. Error 1069: The service did not start due to a logon failure."*

* Under Windows Event Viewer, the system event log contains an error with Event ID 7038 and message *“The ADSync service was unable to log on as <User Account> with the currently configured password due to the following error: The user name or password is incorrect."*

## Recovery steps
To resolve the issue, update the Synchronize Service’s user account under Windows Service Control Manager:

1. Start the **Windows Service Control Manager** (START → Services).

2. Select **Microsoft Azure AD Sync** and right click.

3. Select **Properties**.

4. In the pop-up dialog, go to the **Log On** tab.

5. Enter the new password.

6. Click **OK** to save the new password and close the pop-up dialog.

7. Click **Start** to start the Synchronization Service.

## Encryption key error
Under specific conditions, changing the password of the service account leads to encryption key issue. Refer to article () if the Synchronization Service fails to start with error *“Windows could not start the Microsoft Azure AD Sync on Local Computer. For more information, review the System Event log. If this is a non-Microsoft service, contact the service vendor, and refer to service-specific error code -21451857952.”*
