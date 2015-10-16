
<properties
    pageTitle="Change the Azure Active Directory tenant in Azure RemoteApp"
    description="Learn how to change the Azure Active Directory tenant associated with Azure RemoteApp"
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



# Change the Azure Active Directory tenant in Azure RemoteApp

Azure RemoteApp uses Azure Active Directory (Azure AD) to allow user access. The only Azure AD tenant that you can use is the one associated with the Azure subscription. You can view the associated subscription on the Settings page in the portal. Look at the Directory column on the Subscriptions tab.

> [AZURE.NOTE] For this change to succeed, first remove all users from the existing Azure Active Directory tenant from all Azure RemoteApp collections. To do this, go to the Azure Portal, go to the Azure RemoteApp tab and open every Azure RemoteApp collection. Go to the **Users** tab and remove users that belong to your current Azure Active Directory tenant. Repeat for all existing Azure RemoteApp collections. Without doing this, you will not be able to create or patch collections.

If you want to use a different tenant, use these steps to change the association with your subscription:

1. In the portal, remove any Azure AD users to which you’ve given access to Azure RemoteApp collections.


2. Set a Microsoft account (formerly called a Live ID) as the Service Administrator. (Look at **Settings -> Administrators**.)
	1. Click the currently logged in user in the upper right corner, and then click **View my bill**.
	2. Select your subscription, and then click **Edit subscription details**.
	3. Make the changes necessary.



3. Sign out of the portal, and then sign back in with the Microsoft account you specified in the previous step.


4. Click **New -> App Services -> Active Directory -> Custom Create -> Use Existing Directory**. Add the Azure AD tenant that you want to associate with this subscription.


5. Under **Settings -> Subscriptions**, select your subscription, and then click **Edit Directory**. Select the Azure AD tenant that you want to use.



You can now use the new Azure AD tenant to control access to the Azure subscription and to configure user access in Azure RemoteApp.
