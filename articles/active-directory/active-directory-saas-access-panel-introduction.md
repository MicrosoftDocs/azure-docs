---
title: What is the access panel in Azure Active Directory? | Microsoft Docs
description: Learn how to use variations of the access panel (web browser, Android app, iPhone and iPad app) to access SaaS apps.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: c0252d01-7e6e-4f79-a70e-600479577dfd
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/31/2017
ms.author: markvi
ms.reviewer: asteen
ms.custom: H1Hack27Feb2017

---
# What is the access panel?

The access panel is a web-based portal. It enables a user with a work or school account in Azure Active Directory to view and start cloud-based applications an Azure AD administrator has granted them access to. You can also use self-service group and app management capabilities through the access panel.

The access panel is separate from the Azure portal and does not you to have an Azure subscription.

![Access Panel][1]

The access panel enables you to edit some of your profile settings, including the ability to:

- Change the password associated with a work or school account

- Edit password reset settings

- Edit contact and preference settings related to multi-factor authentication (for accounts that have been required to use it by an administrator)

- View account details, such as user ID, alternate email, and mobile and office phone numbers, and devices

- View and start cloud-based applications that the Azure AD administrator has granted them access to. For more information about the access panel from the users’ perspective, see Using the access panel. 

- Self-manage groups. More specifically, the administrator can create and manage security groups and request security group memberships in Azure AD. For more information, see [Self-service group management for users in Azure AD](active-directory-accessmanagement-self-service-group-management.md) and [Manage your groups](active-directory-manage-groups.md).




## Accessing the access panel

You can access the access panel by visiting the following URL in a web browser: `http://myapps.microsoft.com`

If you have custom branding configured for your sign-in page, you can load this branding by appending your organization’s domain to the end of the URL: `http://myapps.microsoft.com/<your domain>.com`

In this case, you can use any active or verified domain name that has been configured in your Azure portal.

![Wingtip Toys domain name][2]  

You need to distribute the URL to all users who will sign in to applications that are integrated with Azure AD.

## Authentication

To reach the access panel, you must be authenticated through a work or school account in Azure AD. You can be authenticated to Azure AD directly. Alternatively, if an organization has configured federation by using Active Directory Federation Services (AD FS) or other technologies, you can be authenticated by Windows Server Active Directory.

If you have a subscription for Azure or Office 365 and you have been using the Azure portal or an Office 365 application, you can see the list of applications without signing-in again. If you are are not authenticated you are prompted to sign in by using the username and password for your account in Azure AD. If your organization has configured federation, typing the username is sufficient.

When you are authenticated, you can interact with the applications that your administrator has integrated with the directory. To learn how to integrate applications with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md).

## Web browser requirements

At a minimum, the access panel requires a browser that supports JavaScript and has CSS enabled. For the user to be signed in to applications through password-based single sign-on (SSO), the access panel extension must be installed in your browser. The extension is downloaded automatically when you select an application that is configured for password-based SSO.

The access panel extension is currently available for Internet Explorer 8 and later, Edge, Chrome, and Firefox browsers.

## Mobile app support

The Azure Active Directory team publishes the my apps mobile app. When you install the app, you can sign in to password-based SSO applications on iOS and Android devices.

> [!NOTE]
> You can sign in to applications that support federation with Azure AD (including Salesforce, Google Apps, Dropbox, Box, Concur, Workday, Office 365, and more than 70 others) on virtually any web browser, on any device, without needing a plug-in or mobile app. All other [access panel experiences](https://myapps.microsoft.com/) do also not require the my apps mobile app to be used on a mobile device.
>
>

### My apps for Android

My apps for Android is supported on any Android device that is running Android version 4.1 and later.  
It is available in the [Google Play store](https://play.google.com/store/apps/details?id=com.microsoft.myapps).

![My apps for Android][3]   

### My apps for iPhone and iPad

My apps for iOS is supported on any iPhone or iPad that is running iOS version 7 and later.  
It is available in the [Apple App Store](https://itunes.apple.com/us/app/my-apps-azure-active-directory/id824048653?mt=8).

![My apps for iOS][4]    



## Managed browser for my apps

My apps is also integrated in the Intune Managed Browser. The Intune Managed Browser for iOS and Android devices plays a key role in ensuring that data on mobile devices stays secure. It lets you safely view and navigate web pages that might contain company information, and provides a secure web-browsing experience.  
You find quick access to my apps on your Managed Browser homepage and in your bookmarks, giving you fewer clicks to reach any application you want to access.

It is available in the [Apple App Store](https://itunes.apple.com/us/app/microsoft-intune-managed-browser/id943264951?mt=8) and [Google Play Store](https://play.google.com/store/apps/details?id=com.microsoft.intune.mam.managedbrowser&hl=en).

![Mananged browser for my apps][5]    





## Tips for testing the user experience

If you are an Azure administrator and you are signed in to the Azure portal by using an account in the directory, you are automatically signed in to the access panel as your current account. In this case, you can see all applications that have been assigned to you.

**To test as a *different* user account:**

1. Click the user menu in the upper-right corner of the Azure portal or the access panel, and then select **Sign Out**. 
2. Go to the [access panel](http://myapps.microsoft.com).
3. On the sign-in page, type the username and password for the account in your directory you want to test.


## Starting applications

Several types of applications can appear on the access panel.

### Office 365 applications

If your organization is using Office 365 applications and you are licensed for them, the Office 365 applications appear on your access panel.

When you click an application tile for an Office 365 application, you are redirected to the application and automatically signed in.

### Microsoft and third-party applications configured with federation-based SSO

Your administrator can add applications in the Active Directory section of the Azure portal with the SSO mode set to **Azure AD Single Sign-On**. You can only see these applications if your administrator has explicitly granted you access to the applications.

When you click a tile for one of these applications, you are redirected and automatically signed in to the application.

### Password-based SSO without identity provisioning

Your administrator can add applications in the Active Directory section of the Azure portal with the SSO mode set to **Password-based Single Sign-On**. All users in the directory can see all applications that have been configured in this mode.

The first time, you click a tile for one of these applications, you are prompted to install the Password SSO plug-in for Internet Explorer or Chrome. The installation might require you to restart your web browser. When you return to the access panel and click the application tile again, you are prompted for a username and password for the application. When you have entered your username and password, these credentials are securely stored and linked to your account in Azure AD.

The next time you click the application tile, you are automatically signed in to the application.  
You don't have to enter your credentials again and or install the Password SSO plug-in.

If your credentials have changed in the target third-party application, you must also update your credentials that are stored in Azure AD. 

**To update credentials:**

1. Select the icon on the application tile.
2. Select **update credentials** to reenter the username and password for the application.


### Password-based SSO with identity provisioning

Your administrator can add applications in the **Active Directory** section of the Azure portal with the SSO mode set to **Password-based Single Sign-On**, along with identity provisioning.

The first time, you click an application tile for one of these applications, you are prompted to install the **Password SSO plug-in for Internet Explorer or Chrome**. The installation might require you to restart your web browser.  
When you return to the access panel and click the application tile again, you are automatically signed in to the application.

Some applications might require you to change your password on the first sign-in. If your credentials have changed in the target third-party application, you must also update the credentials that are stored in Azure AD. 

**To update credentials:**

1. Select the icon on the application tile.
2. Select **update credentials** to reenter the username and password for the application.


### Application with existing SSO solutions

To configure SSO for an application, the Azure portal provides a third option called **Existing Single Sign-On**. This option enables your administrator to create a link to an application and place it on the access panel for selected users.

For example, if an application is configured to authenticate users by using AD FS 2.0, your administrator can use the **Existing Single Sign-On** option to create a link to it on the access panel. When you access the link, you are authenticated through AD FS 2.0 or whatever existing SSO solution the application provides.


## Next steps

- To see a list of all topics that are related to application management, see the [article index for application management in Azure Active Directory](active-directory-apps-index.md).
 
- To learn how to integrate a SaaS app into Azure AD, see the [list of tutorials on how to integrate SaaS apps](active-directory-saas-tutorial-list.md).
 
- To learn more about managing apps with Azure AD, see the [introduction to single sign-on and managing app access with Azure Active Directory](active-directory-appssoaccess-whatis.md).
 
- To learn more about user provisioning, see [automate user provisioning and deprovisioning to SaaS applications](active-directory-saas-app-provisioning.md).

<!--Image references-->
[1]: ./media/active-directory-saas-access-panel-introduction/01.png
[2]: ./media/active-directory-saas-access-panel-introduction/02.png
[3]: ./media/active-directory-saas-access-panel-introduction/03.png
[4]: ./media/active-directory-saas-access-panel-introduction/04.png
[5]: ./media/active-directory-saas-access-panel-introduction/05.png
