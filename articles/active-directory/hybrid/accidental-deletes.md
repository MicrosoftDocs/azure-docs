---
title: 'Configure accidental deletion prevention with Active Directory'
description: This article describes how you can configure accidental deletion prevention for the synchronization tools with Active Directory.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/02/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# How to prevent accidental deletions

When installing either cloud sync or Azure AD Connect, this feature is enabled by default and configured to not allow an export with more than 500 deletes. This feature is designed to protect you from accidental configuration changes and changes to your on-premises directory that would affect many users and other objects.

You can change the default behavior and tailor it to your organizations needs.

## Configure accidental delete prevention with cloud sync
To use the new feature, follow the steps below.


 1.  In the Azure portal, select **Azure Active Directory**.
 2.  On the left, select **Azure AD Connect**.
 3.  On the left, select **Cloud sync**.
 4. Under **Configuration**, select your configuration.
 5. Select **View default properties**.
 6. Click the pencil next to **Basics**
 5. On the right, fill in the following information.
	 - **Notification email** - email used for notifications
	- **Prevent accidental deletions** - check this box to enable the feature
	- **Accidental deletion threshold** - enter the number of objects to stop synchronization and send a notification

For more information, see [Accidental delete prevention with cloud sync](cloud-sync/how-to-accidental-deletes.md)


## Configure accidental delete prevention with Azure AD Connect
The default value of 500 objects can be changed with PowerShell using `Enable-ADSyncExportDeletionThreshold`, which is part of the [AD Sync module](connect/reference-connect-adsync.md) installed with Azure Active Directory Connect. You should configure this value to fit the size of your organization. Since the sync scheduler runs every 30 minutes, the value is the number of deletes seen within 30 minutes.

For more information, see [Accidental delete prevention with Azure AD Connect](connect/how-to-connect-sync-feature-prevent-accidental-deletes.md).