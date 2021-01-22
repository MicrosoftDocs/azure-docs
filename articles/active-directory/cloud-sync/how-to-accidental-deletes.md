---
title: 'Azure AD Connect cloud sync accidental deletes'
description: This topic describes how to use the accidental delete feature to prevent deletions.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 10/19/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Accidental delete prevention

The following document describes the accidental deletion feature for Azure AD Connect cloud sync.  The accidental delete feature is designed to protect you from accidental configuration changes and changes to your on-premises directory that would affect many users and groups.  This feature allows you to:

- configure the ability to prevent accidental deletes automatically. 
- Set the # of objects (threshold) beyond which the configuration will take effect 
- setup a notification email address so they can get an email notification once the sync job in question is put in quarantine for this scenario 

To use this feature, you set the threshold for the number of objects that, if deleted, synchronization should stop.  So if this number is reached, the synchronization will stop and a notification will be sent to the email that is specified.  This allows you to investigate what is going on.


## Configure accidental delete prevention
To use the new feature, follow the steps below.


1.  In the Azure portal, select **Azure Active Directory**.
2.  Select **Azure AD Connect**.
3.  Select **Manage cloud sync**.
4. Under **Configuration**, select your configuration.
5. Under **Settings** fill in the following:
	- **Notification email** - email used for notifications
	- **Prevent accidental deletions** - check this box to enable the feature
	- **Accidental deletion threshold** - enter a number of objects to trigger synchronization stop and notification

![Accidental deletes](media/how-to-accidental-deletes/accident-1.png)

## Recovering from an accidental delete instance
If you encounter an accidental delete you will see this on the status of your provisioning agent configuration.  It will say **Delete threshold exceeded**.
 ![Accidental deletes](media/how-to-accidental-deletes/delete-1.png)

By clicking on **Delete threshold exceeded**, you will see the sync status info.  This will provide additional details. 
 ![Accidental deletes](media/how-to-accidental-deletes/delete-2.png)

By right-clicking on the elipses you will get the following options:
 - View provisioning log
 - View agent
 - Allow deletes

 ![Accidental deletes](media/how-to-accidental-deletes/delete-3.png)

By viewing the provisioning logs, you can see the **StagedDelete** entries and review the information provided on the users that have been deleted.
 ![Accidental deletes](media/how-to-accidental-deletes/delete-7.png)


By allowing the deletes, click **Yes** on the confirmation to allow the deletes.
 ![Accidental deletes](media/how-to-accidental-deletes/delete-4.png)

You will see confirmation that the deletes were accepted and the status will return to healthy with the next cycle. 
 ![Accidental deletes](media/how-to-accidental-deletes/delete-8.png)

## Next steps 

- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)
- [How to install Azure AD Connect cloud sync](how-to-install.md)
 

