<properties 
    pageTitle="Add a user in RemoteApp" 
    description="Learn how to add users in RemoteApp" 
    services="remoteapp" 
    solutions="" 
	documentationCenter="" 
    authors="lizap" 
    manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="04/06/2015" 
    ms.author="elizapo" />

# How to add a user in RemoteApp

Before your users can see and use the apps in RemoteApp, you have to grant them access. This is the easy part: On the **User Access** tab, enter the account information for the user to grant access to this service.

What account information do you need? That depends on the type of collection you created (cloud or hybrid) and whether you are using Office 365 ProPlus in that collection.

## Supported user identities

Azure RemoteApp has two deployment methods: cloud and hybrid. Each supports using different user identities for user access to applications.  

For a hybrid collection of RemoteApp, you need to set up an Active Directory domain infrastructure on premises and an Azure Active Directory tenant with Directory Integration (and optionally single sign-on). Additionally, you need to create some Active Directory objects in the on-premises directory.  

For a cloud collection of RemoteApp, any user that has Azure Active Directory support identities can be granted user access to RemoteApp to include Microsoft Accounts.  See table below. 

Office 365 users are Azure Active Directory users. If they have Azure Active Directory hybrid, Directory synchronized accounts, they can be granted user access in a RemoteApp hybrid deployment.   

You can use this table as a quick reference for which identity is supported in your collection and what the Active Directory requirements are.

|User accounts |Cloud	|Hybrid|
|--------------|--------|------|
|Microsoft Account| 	Yes|	No|
|Azure Active Directory (Azure AD)|	| |	
|Azure AD cloud only 	|Yes	|No	|
|ADsync with password sync	|Yes	|Yes	|
|ADsync without password sync|	Yes	|No	|
|ADsync with AD FS	|Yes	|Yes	|
|3rd-party Azure supported identity providers  (example Ping)	|Yes	|No|	
|Multi-Factor Authentication	|Yes	|Yes	|

Check out [more information](remoteapp-ad.md) about configuring Active Directory for RemoteApp.


**Note:** The Azure Active Directory users must be from the tenant that's associated with your subscription. (You can view and modify your subscription on the **Settings** tab in the portal. See [Change the Azure Active Directory tenant used by RemoteApp](remoteapp-changetenant.md) for more information.)

## Office 365 ProPlus user account information
If you are using the Office 365 ProPlus template image in your collection *or* if you created a custom image that uses Office 365, you are only allowed to add Azure Active Directory users that have Office 365 subscriptions for the default domain of your subscription. See [Using Office 365 with Azure RemoteApp](remoteapp-o365.md) for more information.
