
<properties 
    pageTitle="User Profile data in Azure RemoteApp"
	description="Learn how user data is stored and accessed in Azure RemoteApp"
	services="remoteapp"
	documentationCenter="" 
	authors="lizap" 
	manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="08/12/2015" 
    ms.author="elizapo" />



# How does Azure RemoteApp save user data and settings?

Azure RemoteApp saves user identity and customizations across devices and sessions. This user data is stored in a per-user per-collection disk, known as a user profile disk (UPD). The disk follows the user and ensures the user has a consistent experience, regardless of where they sign in. 
saves 

User profile disks are completely transparent to the user — users save documents to their Documents folder (on what appears to be a local drive) and change their app settings as usual. At the same time, all personal settings persist when connecting to Azure RemoteApp from any device. All the user sees is their data in the same place.

Each UPD has 50GB of persistent storage and contains both user data and application settings. 

Read on for specifics on user profile data.

## How can an admin get to the data?

If you need to access the data for one of your users (for disaster recovery or if the user leaves the company), contact [Azure RemoteApp](mailto:remoteappforum@microsoft.com) and provide the subscription information for the collection and the user identity. The Azure RemoteApp team will provide you a URL where you can access the data - from there you can browse the location and retrieve any documents or files you need.


## Is the data backed up?

Yes, we save a backup of the user data per geographic location. The data is read-only and can be accessed in the same way as the regular data would be (contact Azure RemoteApp to get), if the primary data center is down.

## How do users see the UPD on the server side?

Each user will have their own directory on the server that maps to their UPD: c:\Users\username.

## What's the best way to use Outlook and UPD?

Azure RemoteApp saves the Outlook state (mailboxes, PSTs) between sessions. To enable this, we need the PST to be stored in the user profile data (c:\users\<username>). This is the default location for the data, so as long as you do not change the location, the data will persist between sessions.

We also recommend that you use "cached" mode in Outlook and use "server/online" mode for searching.

## Can we use shared data solutions?
Yes, Azure RemoteApp supports using shared data solutions - particularly OneDrive for Business and Dropbox. Note, however, that OneDrive Consumer (the personal version) and Box are not supported.

## What about redirection?
You can configure Azure RemoteApp to let users access local devices by setting up [redirection](remoteapp-redirection.md). Local devices will then be able to access the data on the UPD.

## Can I use my UPD as a network share?
No, because the UPD is not persistent. A UPD is only available when the user is actively connected to Azure RemoteApp.

## If I delete a user from a collection, is their UPD deleted?

No, when you delete a user, we do not automatically delete the UPD - instead, we store the data until you delete the collection. 90 days after you delete the collection, we delete all UPDs. 

If you need to delete a UPD from a collection, contact Azure RemoteApp - we can delete UPD from our side.

## Can I access my users' UPDs (either current or deleted users)?

Yes, if you contact [Azure RemoteApp](mailto:remoteappforum@microsoft.com), we can set you up with a URL to access the data. You'll have about 10 hours to download any data or files from the UPD before the access expires.

## Are UPDs available offline?

Right now we do not provide offline access to UPDs, beyond the 10 hour access window described above. This means that we do not currently have a way to provide you with access for long enough to complete more complicated tasks, like running anti-virus software on the UPDs or accessing data for an audit.

## Can I disable UPDs for a collection?

Yes, you can ask Azure RemoteApp to disable UPDs for a subscription, but you cannot do that yourself. This means that UPDs will be disabled for all collections in the subscription.

## Can I restrict users from saving data to the system drive?

Yes, but you'll need to set that up in the template image before you create the collection. Use the following steps to block access to the system drive:

1. Run **gpedit.msc** on the template image.
2. Navigate to **User Configuration > Administrative Templates > Windows Components > Explorer**.
3. Select the following options:
	- **Hide these specified drives in My Computer**
	- **Prevent access to drives from My Computer**

## Can I seed UPDs? I want to put some data in the UPD that's available the first time the user signs in.

Yes, when you create the template image, you can add information to the default profile. That information is then added to the UPD.

## Can I change the size of the UPD depending on how much data I want to store?

No, all UPDs have 50 GB of storage. If you want to store different amounts of data, try the following:

1. Disable UPDs for the collection.
2. Set up a file share for users to access.
3. Load the file share by using a startup script. See below for details on startup scripts in Azure RemoteApp.
4. Direct users to save all data to the file share.

You can also use data synchronization apps like OneDrive for Business.

## How do I run a startup script in Azure RemoteApp?

If you want to run a startup script, start by creating a scheduled task in the template image you are going to use for the collection. (Do this *before* you run sysprep.) 

![Create a system task](./media/remoteapp-upd/upd1.png)

![Create a system task that runs when a user logs on](./media/remoteapp-upd/upd2.png)

The scheduled task will launch your startup script, using the user's credentials. Schedule the task to run every a time a user logs on.

![Set the trigger for the task as "At log on"](./media/remoteapp-upd/upd3.png)

You can also use [Group Policy-based startup scripts](https://technet.microsoft.com/library/cc779329%28v=ws.10%29.aspx). 

## What about placing a startup script in the Start menu? Would that work?

In other words, can I create a .bat file that runs a config window script and save it to the c:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp folder, and then have that script run whenever a user starts a RemoteApp session?

No, that's not supported with Azure RemoteApp, which uses RDSH, which also does not support startup scripts in the Start menu.

## Can I use mstsc.exe (the Remote Desktop program) to configure logon scripts?

Nope, not supported by Azure RemoteApp.
