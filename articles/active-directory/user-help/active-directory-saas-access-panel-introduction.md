---
title: What is the MyApps portal in Azure Active Directory? | Microsoft Docs
description: Learn how to use variations of the MyApps portal (web browser, Android app, iPhone and iPad app) to access SaaS apps.
services: active-directory
author: eross-msft
manager: mtillman

ms.assetid: c0252d01-7e6e-4f79-a70e-600479577dfd
ms.service: active-directory
ms.component: user-help
ms.workload: identity
ms.topic: conceptual
ms.date: 09/11/2018
ms.author: lizross
ms.reviewer: asteen
---

# What is the MyApps portal?

If you have a work or school account in Azure Active Directory (Azure AD), you can use the My Apps web-based portal to view and start cloud-based applications that an Azure AD administrator has granted you access to. You can also use self-service group and app management capabilities through the MyApps portal.

The MyApps portal is separate from the Azure portal. It does not require you to have an Azure subscription.

![MyApps portal][1]
By using the MyApps portal, you can edit some of your profile settings and do the following:

- Change the password associated with a work or school account.

- Edit password reset settings.

- Edit contact and preference settings related to multi-factor authentication (for accounts that have been required to use it by an administrator).

- View account details, such as user ID, alternate email, mobile and office phone numbers, and devices.

- View and start cloud-based applications that the Azure AD administrator has granted you access to. 

- Self-manage groups. Administrators can create and manage security groups and request security group memberships in Azure AD. For more information, see [Self-service group management for users in Azure AD](../users-groups-roles/groups-self-service-management.md) and [Manage your groups](../fundamentals/active-directory-manage-groups.md).

## Access the MyApps portal

You can access the MyApps portal by going to `http://myapps.microsoft.com`.

If you have custom branding configured for your sign-in page, you can load the branding by appending your organization’s domain to the URL (for example, `http://myapps.microsoft.com/<your domain>.com`).

You can use any active or verified domain name that has been configured in your Azure portal, as shown here:
![Wingtip Toys domain name][2]  

Distribute the URL to all users who sign in to applications that are integrated with Azure AD.

## Authentication

To reach the MyApps portal, you must be authenticated through a work or school account in Azure AD. You can be authenticated to Azure AD directly. Alternatively, if an organization has configured federation by using Active Directory Federation Services (AD FS) or other technologies, you can be authenticated by Windows Server Active Directory.

If you have a subscription for Azure or Office 365 and you have been using the Azure portal or an Office 365 application, you can view the list of applications without signing in again. If you are not authenticated, you are prompted to sign in by using the username and password for your account in Azure AD. If your organization has configured federation, typing the username is sufficient.

When you are authenticated, you can interact with the applications that your administrator has integrated with the directory. To learn how to integrate applications with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md).

## Web browser requirements

At a minimum, the MyApps portal requires a browser that supports JavaScript and has CSS enabled. To be signed in to applications through password-based single sign-on (SSO), you must have the MyApps portal extension installed in your browser. The extension is downloaded automatically when you select an application that is configured for password-based SSO.

The installer is architecture-specific. If you click the download link, you only get the installer for the OS architecture that you are currently running on. If you are an application deployment administrator, make sure that you visit the download link from a 64 bit and 32 bit device to get both installers.


The MyApps portal extension is currently available for:
- **Edge**: on Windows 10 Anniversary Edition or later. 
- **Chrome**: on Windows 7 or later, and on MacOS X or later.
- **Firefox 26.0 or later**: on Windows XP SP2 or later, and on Mac OS X 10.6 or later.
- **Internet Explorer 11**: on Windows 7 or later (limited support).

## My Apps Secure Sign-in Extension
To sign in to password-based single sign-on, you must use the extension. After the extension is installed, you can sign in to it to enable additional features by selecting **Sign in to get started**. 

- You can sign in to an app directly by using the app's **Sign-on URL**. When you use the app's URL, the extension detects the action and gives you the option of signing in from the extension.
- You can launch any of your apps from the MyApps portal by using the *quick search* feature of the extension. 
- The extension shows you the last three applications that you launched in **Recently Used** section.
- You can use internal company URLs while remote through [Application Proxy](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-get-started)

> [!NOTE]
> Additional features are available only for Edge, Chrome, and Firefox.
>
You can download the extension directly from the following sites:
- [Chrome](https://go.microsoft.com/fwlink/?linkid=866367)
- [Edge](https://go.microsoft.com/fwlink/?linkid=845176)
- [Firefox](https://go.microsoft.com/fwlink/?linkid=866366)

If you are using a My Apps URL other than `https://myapps.microsoft.com`, configure your default URL by doing the following:
1. While you are *not* signed in to the extension, right-click the extension icon.
2. On the menu, select **My Apps URL**.
3. Select your default URL.
4. Select the extension icon.
5. Select **Sign in to get started**.

To use internal company URLs while remote using the extension, do the following:
1. [Configure Application Proxy](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-enable) on your tenant.
2. [Publish the application](https://docs.microsoft.com/azure/active-directory/application-proxy-publish-azure-portal) and URL through Application Proxy.
3. Install the extension, and sign in to it by selecting Sign in to get started.
4. You can now browse to the internal company URL even while remote.

> [!NOTE]
> You may also turn off automatic redirection to company URLs by selecting the settings gear on the main menu and selecting **off** for the Company internal URL redirection option.


## Mobile app support

The Azure Active Directory team publishes the My Apps mobile app. When you install the app, you can sign in to password-based SSO applications on iOS and Android devices.

> [!NOTE]
> You can sign in to applications that support federation with Azure AD (including Salesforce, Google Apps, Dropbox, Box, Concur, Workday, Office 365, and more than 70 others) on virtually any web browser, on any device, without needing a plug-in or mobile app. To be used on a mobile device, the other [MyApps portal experiences](https://myapps.microsoft.com/) also do not require the My Apps mobile app.

### My Apps for iPhone and iPad

My Apps for iOS is supported on any iPhone or iPad that is running iOS version 7 or later.  

It is available at the [Apple App Store](https://itunes.apple.com/us/app/my-apps-azure-active-directory/id824048653?mt=8).

![My Apps for iOS][4]    


## Intune Managed Browser for My Apps

My Apps is also integrated with the Intune Managed Browser. The Intune Managed Browser for iOS and Android devices helps you to more safely view and navigate webpages that might contain company information, helping to provide a more secure web-browsing experience.  

You can get to My Apps from both the Managed Browser home page and from your bookmarks, which means there are fewer clicks needed to reach your apps.

Intune Managed Browser is available at the [Apple App Store](https://itunes.apple.com/us/app/microsoft-intune-managed-browser/id943264951?mt=8) and [Google Play Store](https://play.google.com/store/apps/details?id=com.microsoft.intune.mam.managedbrowser).

![Managed browser for My Apps][5]    


## Tips for testing the user experience

If you are an Azure administrator and you are signed in to the Azure portal by using an account in the directory, you are automatically signed in to the MyApps portal as your current account. This view displays all applications that are assigned to you.

To test in a *different* user account, do the following:

1. At the upper right of the Azure portal or the MyApps portal, select **Sign Out**. 
2. Go to the [MyApps portal](http://myapps.microsoft.com).
3. On the sign-in page, type the username and password for the account in your directory that you want to test.


## Starting applications

This section discusses several types of applications that can appear on the MyApps portal.

### Office 365 applications

If your organization is using Office 365 applications and you are licensed for them, the Office 365 applications appear on your MyApps portal.

When you select an application tile for an Office 365 application, you are redirected to the application and automatically signed in.

### Microsoft and third-party applications configured with federation-based SSO

Your administrator can add applications in the Active Directory section of the Azure portal with the SSO mode set to **Azure AD Single Sign-On**. You can see these applications only if your administrator has explicitly granted you access to them.

When you select a tile for an application, you are redirected and automatically signed in to it.

### Password-based SSO without identity provisioning

Your administrator can add applications in the Active Directory section of the Azure portal with the SSO mode set to **Password-based Single Sign-On**. All users in the directory can see all applications that have been configured in this mode.

The first time you select an application tile, you are prompted to install the Password SSO plug-in for Internet Explorer or Chrome. The installation might require you to restart your web browser. When you return to the MyApps portal and select the application tile again, you are prompted for a username and password for the application. When you have entered your username and password, the credentials are securely stored and linked to your account in Azure AD.

The next time you select the application tile, you are automatically signed in to the application.  

You don't have to enter your credentials again and or install the Password SSO plug-in.

If your credentials have changed in the target third-party application, you must also update your credentials that are stored in Azure AD. 

To update your credentials, do the following:

1. Select the icon on the application tile.
2. Select **update credentials** to reenter the username and password for the application.


### Password-based SSO with identity provisioning

Your administrator can add applications in the Active Directory section of the Azure portal with the SSO mode set to **Password-based Single Sign-On**, along with identity provisioning.

The first time you select an application tile, you are prompted to install the Password SSO plug-in for Internet Explorer or Chrome. The installation might require you to restart your web browser.  

When you return to the MyApps portal and select the application tile again, you are automatically signed in to the application.

Some applications might require you to change your password at the first sign-in. If your credentials have changed in the target third-party application, you must also update the credentials that are stored in Azure AD. 

To update your credentials, do the following:

1. Select the icon on the application tile.
2. Select **update credentials** to reenter the username and password for the application.


### Application with existing SSO solutions

To configure SSO for an application, the Azure portal provides a third option called Existing Single Sign-On. This option enables your administrator to create a link to an application and place it on the MyApps portal for selected users.

For example, if an application is configured to authenticate users by using AD FS 2.0, your administrator can use the Existing Single Sign-On option to create a link to it on the MyApps portal. When you access the link, you are authenticated through AD FS 2.0 or whatever existing SSO solution the application provides.


## Next steps

- To learn about application management, see [Application Management in Azure Active Directory](../manage-apps/what-is-application-management.md).
 
- To learn how to integrate a SaaS app with Azure AD, see the [list of tutorials on how to integrate SaaS apps](../saas-apps/tutorial-list.md).
 
- To learn more about managing apps with Azure AD, see the [introduction to single sign-on and managing app access with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).
 
- To learn more about user provisioning, see [automate user provisioning and deprovisioning to SaaS applications](../manage-apps/user-provisioning.md).

<!--Image references-->
[1]: ./media/active-directory-saas-access-panel-introduction/01.png
[2]: ./media/active-directory-saas-access-panel-introduction/02.png
[4]: ./media/active-directory-saas-access-panel-introduction/04.png
[5]: ./media/active-directory-saas-access-panel-introduction/05.png
