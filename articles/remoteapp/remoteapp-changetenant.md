
<properties
    pageTitle="Change the Azure Active Directory tenant in Azure RemoteApp | Microsoft Azure"
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
    ms.date="06/27/2016"
    ms.author="elizapo" />



# Change the Azure Active Directory tenant in Azure RemoteApp

Azure RemoteApp uses Azure Active Directory (Azure AD) to allow user access. The only Azure AD tenant that you can use in Azure RemoteApp is the one associated with the Azure subscription. You can view the associated subscription on the **Settings** page in the portal. Look at the **Directory** column on the **Subscriptions** tab.

> [AZURE.NOTE] For this change to succeed, first remove all users from the existing Azure Active Directory tenant from all Azure RemoteApp collections. To do this, go to the Azure Portal, go to the **Azure RemoteApp** tab and open every Azure RemoteApp collection. Go to the **Users** tab and remove users that belong to your current Azure Active Directory tenant. Repeat for all existing Azure RemoteApp collections. Without doing this, you will not be able to create or patch collections.

If you want to use a different tenant, use these steps to change the association with your subscription:

1. In the portal, remove any Azure AD users to which you’ve given access to Azure RemoteApp collections. (See the note above for steps on how to do this.)


2. Set a Microsoft account (formerly called a Live ID) as the Service administrator. (Don't know if you already are the service admin? You can find out by clicking **Settings -> Administrators**.) Now, here's how you change that:
	1. Click the user in the upper right corner, and then click **View my bill**.
	2. Click the subscription. Then, on the new page, scroll down and click **Edit subscription details** in the right. (Sort of the middle bottom right, if that helps you find it.)
	3. Type the Microsoft account for the user that should be the service admin.

3. Now, sign out of the portal, and then sign back in with the Microsoft account you specified in the previous step.


4. Click **New -> App Services -> Active Directory -> Directory -> Custom Create**.
5. Under **Directory**, choose **Use existing directory**. We're going to have to sign you out of the portal now, so choose **I am ready to be signed out now**.
6. Sign back into the portal as a global admin of the directory you want to add. (If you weren't already a global admin, you will be after a round of sign in and then sign out.)
7. You'll be asked when you sign in if you want to use your existing AD tenant with your subscription. Click **Continue**, and then click **Sign out now**.
5. Sign back in again, and go back to **Settings -> Subscriptions**. Select your subscription, and then click **Edit Directory**. Select the Azure AD tenant that you want to use.



You can now use the new Azure AD tenant to control access to the Azure subscription and to configure user access in Azure RemoteApp.
