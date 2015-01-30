<properties pageTitle="Add a user in RemoteApp" description="Learn how to add users in RemoteApp" services="remoteapp" solutions="" documentationCenter="" authors="lizap" manager="mbaldwin" />

<tags ms.service="remoteapp" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/12/2014" ms.author="elizapo" />

#How to add a user in RemoteApp

Before your users can see and use the apps in RemoteApp, you have to grant them access. This is the easy part: On the **User Access** tab, enter the account information for the user to grant access to this service.

What account information do you need? That depends on the type of collection you created (cloud or hybrid) and whether you are using Office 365 ProPlus in that collection.

##Cloud vs. hybrid user account information
The cloud collection supports Microsoft accounts and directory-synchronized Azure Active Directory work accounts (which are also Office 365 accounts). 

The hybrid collection supports only Azure Active Directory accounts that have been synced (using a tool like DirSync) from a Windows Server Active Directory deployment; specifically, either synced with the Password Synchronization option or synced with Active Directory Federation Services (AD FS) federation configured. See [Configuring Active Directory for Azure RemoteApp](http://azure.microsoft.com/en-us/documentation/articles/remoteapp-ad/) for more information about Azure AD requirements.

**Note:** The Azure Active Directory users must be from the tenant that's associated with your subscription. (You can view and modify your subscription on the **Settings** tab in the portal. See [Change the Azure Active Directory tenant used by RemoteApp](http://msdn.microsoft.com/en-us/3d6c4fd1-c981-4c57-9402-59fe31b11883) for more information.)

##Office 365 ProPlus user account information
If you are using the Office 365 ProPlus template image in your collection *or* if you created a custom image that uses Office 365, you are only allowed to add Azure Active Directory users that have Office 365 subscriptions for the default domain of your subscription. See [Using Office 365 with Azure RemoteApp](http://azure.microsoft.com/en-us/documentation/articles/remoteapp-o365/) for more information.
