<properties 
	pageTitle="Setting up Azure AD Join for your users| Microsoft Azure" 
	description="Explains how administrators can set up Azure AD Join for their end users (employees, students, other users) in their organization." 
	services="active-directory" 
	documentationCenter="" 
	authors="femila" 
	manager="stevenpo" 
	editor=""/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/09/2015" 
	ms.author="femila"/>

# Setting up Azure AD Join in your organization

Before you set up Azure AD Join, you need to either sync up your on-premises directory of users to the cloud or manually create managed accounts in Azure AD. 

Detailed instructions for syncing your on-prem users to Azure AD is covered in [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).


To manually create and manage users in Azure AD, refer to [User management in Azure AD](https://msdn.microsoft.com/library/azure/hh967609.aspx).

## Set up device registration 
1. Sign in to the Azure Portal as Administrator.
2. On the left pane, select Active Directory.
3. On the **Directory** tab, select your directory.
4. Select the **Configure** tab.
5. Scroll to the section called **Devices**.
6. On the **devices** tab, set the following:  
   * **Maximum number of devices per user**: Select the maximum number of devices a user can have in Azure AD.  If a user reaches this quota, they will not be able to add additional devices until one or more of their existing devices are removed.
   * **Require multi-factor auth to join devices**: Enable when users should provide a second factor of authentication to join their device to Azure AD. For more information on multi-factor auth, see [Getting started with Azure Multi-Factor Authentication in the cloud](multi-factor-authentication-get-started-cloud/).
   *  **Users may Azure AD join devices**: Select the users and groups that are allowed to join devices to Azure AD.   
    * **Additional administrators on Azure AD Joined devices**: With Azure AD Premium or the Enterprise Mobility Suite (EMS), you can choose which users are granted local administrator rights to the device. Global Administrators and the device owner are granted local administrator rights by default.
   
>[AZURE.NOTE] If your users encounter the error,"**Device registration limit reached**" (Error code: **0x801C000E - DSREG_ E_ DEVICE_ REGISTRATION_ QUOTA_EXCCEEDED**), you need to change the max devices allowed per user. In the **Users may Azure AD Join Devices** section, select **Add ** and set the number of devices you want to allow per user.
      
    
<center>![](./media/active-directory-azureadjoin/active-directory-aadjoin-configure-devices.png) </center>
 
After you set up Azure AD Join for your users, they can connect to Azure AD through their corporate or personal devices. 

Following are the three scenarios how you can enable your users to set up Azure AD Join:

- Users join a company-owned device directly to Azure AD
- Users domain Join a company-owned device to on-premises Active Directory and extend to Azure AD
- Users add work accounts to Windows on a personal device 

## Additional Information
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md)
* [Learn about usage scenarios for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)



