<properties 
	pageTitle="Getting started with Microsoft Azure Multi-Factor Authentication in the cloud" 
	description="This is the Microsoft Azure Multi-Factor authentication page that describes how to get started with Azure MFA in the cloud." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtand"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="08/04/2016" 
	ms.author="billmath"/>

# Getting started with Azure Multi-Factor Authentication in the cloud
In the following article you will learn how to get started using Azure Multi-Factor Authentication in the cloud.

> [AZURE.NOTE]  The following documentation provides information on how to enable users using the **Azure Classic Portal**. If you are looking for information on how to setup Azure Multi-Factor Authentication for O365 users see [Setup multi-factor authentication for Office 365.](https://support.office.com/article/Set-up-multi-factor-authentication-for-Office-365-users-8f0454b2-f51a-4d9c-bcde-2c48e41621c6?ui=en-US&rs=en-US&ad=US)

![MFA in the Cloud](./media/multi-factor-authentication-get-started-cloud/mfa_in_cloud.png)

## Prerequisites
The following prerequisites are required before you can enable Azure Multi-Factor Authentication for your users. 




- [Sign up for an Azure subscription](https://azure.microsoft.com/pricing/free-trial/) - If you do not already have an Azure subscription, you need to sign-up for one. If you are just starting out and using Azure MFA you can use a trial subscription
2. [Create a Multi-Factor Auth Provider](multi-factor-authentication-get-started-auth-provider.md) and assign it to your directory or [assign licenses to users](multi-factor-authentication-get-started-assign-licenses.md) 

> [AZURE.NOTE]  Licenses are available for users who have Azure MFA, Azure AD Premium, or Enterprise Mobility Suite (EMS).  MFA is included in Azure AD Premium and the EMS. If you have enough licenses, you do not need to create an Auth Provider. 
		

## Turn on multi-factor authentication for users
To turn multi-factor authentication on for a user, you simply change the user's state from disabled to enabled.  For more information on user states see [User States in Azure Multi-Factor Authentication](multi-factor-authentication-get-started-user-states.md)

Use the following procedure to enable MFA for your users.

### To turn on multi-factor authentication
--------------------------------------------------------------------------------
1.  Sign in to the **Azure classic portal** as an Administrator.
2.  On the left, click **Active Directory**.
3.  Under, **Directory** click on the directory for the user you wish to enable.
![Click Directory](./media/multi-factor-authentication-get-started-cloud/directory1.png)
4.  At the top, click **Users**.
5.  At the bottom of the page, click **Manage Multi-Factor Auth**.
![Click Directory](./media/multi-factor-authentication-get-started-cloud/manage1.png)
6.  This will open a new browser tab.  Find the user that you wish to enable for multi-factor authentication. You may need to change the view at the top. Ensure that the status is **disabled.**
![Enable user](./media/multi-factor-authentication-get-started-cloud/enable1.png)
7.  Place a **check** in the box next to their name.
7.  On the right, click **Enable**. 
![Enable user](./media/multi-factor-authentication-get-started-cloud/user1.png)
8.  Click **enable multi-factor auth**.
![Enable user](./media/multi-factor-authentication-get-started-cloud/enable2.png)
9.  You should notice the user's state has changed from **disabled** to **enabled**.
![Enable Users](./media/multi-factor-authentication-get-started-cloud/user.png)
10.  After you have enabled your users, it is recommended that you notify them via email.  It should also inform them how they can use their non-browser apps to avoid being locked out.


## Automate turning on multi-factor authentication using PowerShell

To change the [state](multi-factor-authentication-whats-next.md) using [Azure AD PowerShell](../powershell-install-configure.md), you can use the following.  You can change `$st.State` to equal one of the following states:


- Enabled
- Enforced
- Disabled  

> [AZURE.IMPORTANT]  Please be aware that if you go directly from the Disable state to the Enforced state, non-modern auth clients will stop working because the user has not gone through MFA registration and obtained an [app password](multi-factor-authentication-whats-next.md#app-passwords).  If you have non-modern auth clients and require app passwords then it is recommended that you go from a Disabled state to Enabled.  This will allow users to register and obtain their app passwords.   
		
		$st = New-Object -TypeName Microsoft.Online.Administration.StrongAuthenticationRequirement
		$st.RelyingParty = "*"
		$st.State = “Enabled”
		$sta = @($st)
		Set-MsolUser -UserPrincipalName bsimon@contoso.com -StrongAuthenticationRequirements $sta

Using PowerShell would be an option for bulk enabling users.  Currently there is no bulk enable feature in the Azure portal and you need to select each user individually.  This can be quite a task if you have a lot of users.  By creating a PowerShell script using the above, you can loop through a list of users and enable them.  Here is an example:
    
    $users = "bsimon@contoso.com","jsmith@contoso.com","ljacobson@contoso.com"
    foreach ($user in $users)
    {
    	$st = New-Object -TypeName Microsoft.Online.Administration.StrongAuthenticationRequirement
    	$st.RelyingParty = "*"
    	$st.State = “Enabled”
    	$sta = @($st)
    	Set-MsolUser -UserPrincipalName $user -StrongAuthenticationRequirements $sta
    }


For more information on user states see [User States in Azure Multi-Factor Authentication](multi-factor-authentication-get-started-user-states.md)

## Next Steps
Now that you have setup multi-factor authentication in the cloud, you can configure and setup your deployment.  See [Configuring Azure Multi-Factor Authentication.]
