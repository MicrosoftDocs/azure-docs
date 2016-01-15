<properties
	pageTitle="Add a new Microsoft Azure Stack tenant account in Azure Active Directory"
	description="Add a new Microsoft Azure Stack tenant account in Azure Active Directory"
	services="azure-stack" 
	documentationCenter=""
	authors="v-anpasi"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/04/2016"
	ms.author="v-anpasi"/>

# Add a new Microsoft Azure Stack tenant account in Azure Active Directory

After deploying Microsoft Azure Stack POC, you’ll need to create at least one tenant user account so you can explore the tenant portal.

## Create a Microsoft Azure Stack tenant account by using Windows PowerShell with Azure Active Directory Module (no Azure subscription required)

1.  Install the [Microsoft Online Services Sign-In Assistant for IT Professionals RTW](http://go.microsoft.com/fwlink/?LinkID=286152).

2.  Install the [Azure Active Directory Module for Windows PowerShell (64-bit version)](http://go.microsoft.com/fwlink/p/?linkid=236297) and run it.

3.  Run the following cmdlets:

	    $msolcred = get-credential (Now input the AAD account and password you used to deploy Azure Stack.
	    connect-msolservice -credential $msolcred
	    $user = new-msoluser -DisplayName "Tenant Admin" -UserPrincipalName \<username\>@\<yourdomainname\> -Password \<password\>
		Add-MsolRoleMember -RoleName "Company Administrator" -RoleMemberType User -RoleMemberObjectId $user.ObjectId

## Create a Microsoft Azure Stack tenant account by using the Azure Portal (Azure subscription required)

1.  In Microsoft Azure left navigation bar, click **Active Directory**.

2.  In the directory list, click your Microsoft Azure Stack directory.

3.  On the Microsoft Azure Stack directory page, click **Users**.

4.  Click **Add user**.

5.  In the **Add user** wizard, in the **Type of user** dropdown box, select **New user in your organization**.

6.  In the **User name** box, enter a name for the user.

7.  In the **@** box, select the appropriate entry.

8.  Click the next arrow.

9.  In the **User profile** page of the wizard, provide a **First name**, **Last name**, and **Display name**.

10. In the **Role** dropdown box, select **User**.

11. Click the next arrow.

12. On the **Get temporary password** page, click **Create**.

13. Copy the **New password**.

14. Navigate to your Microsoft Azure sign in page and sign in with the new account. Azure will prompt you to change the password.

15. Navigate to https://portal.azurestack.local and sign in with the new account to see the tenant portal.
