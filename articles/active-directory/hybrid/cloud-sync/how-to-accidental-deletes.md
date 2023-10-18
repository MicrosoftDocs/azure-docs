---
title: 'Microsoft Entra Connect cloud sync accidental deletes'
description: This topic describes how to use the accidental delete feature to prevent deletions.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 01/11/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Accidental delete prevention

The following document describes the accidental deletion feature for Microsoft Entra Connect cloud sync.  The accidental delete feature is designed to protect you from accidental configuration changes and changes to your on-premises directory that would affect many users and groups.  This feature allows you to:

- configure the ability to prevent accidental deletes automatically. 
- Set the # of objects (threshold) beyond which the configuration takes effect 
- set up a notification email address so they can get an email notification once the sync job in question is put in quarantine for this scenario 

To use this feature, you set the threshold for the number of objects that, if deleted, synchronization should stop.  So if this number is reached, the synchronization stops and a notification is sent to the email that is specified.  This notification allows you to investigate what is going on.

For more information and an example, see the following video.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWK5mV]


## Configure accidental delete prevention
To use the new feature, follow the steps below.


 [!INCLUDE [sign in](../../../../includes/cloud-sync-sign-in.md)]
 3. Under **Configuration**, select your configuration.
 4. Select **Properties**.
 5. Click the pencil next to **Basics**
 6. On the right, fill in the following information.
	- **Notification email** - email used for notifications
	- **Prevent accidental deletions** - check this box to enable the feature
	- **Accidental deletion threshold** - enter the number of objects to stop synchronization and send a notification


## Recovering from an accidental delete instance
If you encounter an accidental delete you see this message on the status of your provisioning agent configuration.  It says **Delete threshold exceeded**.
 
![Accidental delete status](media/how-to-accidental-deletes/delete-1.png)

By clicking on **Delete threshold exceeded**, you'll see the sync status info.  This action will provide more details. 
 
 ![Sync status](media/how-to-accidental-deletes/delete-2.png)

By right-clicking on the ellipses, you get the following options:
 - View provisioning log
 - View agent
 - Allow deletes

 ![Right click](media/how-to-accidental-deletes/delete-3.png)

Using **View provisioning log**, you can see the **StagedDelete** entries and review the information provided on the users that have been deleted.
 
 ![Provisioning logs](media/how-to-accidental-deletes/delete-7.png)

### Allowing deletes

The **Allow deletes** action, deletes the objects that triggered the accidental delete threshold.  Use the following procedure to accept these deletes.  

1. Right-click on the ellipses and select **Allow deletes**.
2. Click **Yes** on the confirmation to allow the deletions.
 
 ![Yes on confirmation](media/how-to-accidental-deletes/delete-4.png)

3. You'll see confirmation that the deletions were accepted and the status will return to healthy with the next cycle. 
 
 ![Accept deletes](media/how-to-accidental-deletes/delete-8.png)

### Rejecting deletions

If you don't want to allow the deletions, you need to do the following actions:
- investigate the source of the deletions
- fix the issue (example, OU was moved out of scope accidentally and you've now readded it back to the scope)
- Run **Restart sync** on the agent configuration

## Next steps 

- [Microsoft Entra Connect cloud sync troubleshooting?](how-to-troubleshoot.md)
- [Microsoft Entra Connect cloud sync error codes](reference-error-codes.md)
 
