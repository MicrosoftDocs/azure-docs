---
title: Introduction to the Access Panel | Microsoft Docs
description: Learn how to use variations of the Access Panel (web browser, Android app, iPhone and iPad app) to access SaaS apps.
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
ms.date: 02/27/2017
ms.author: markvi

ms.custom: H1Hack27Feb2017

---
# What is the Access Panel?
The Access Panel is a web-based portal. It enables a user who has a work or school account in Azure Active Directory (Azure AD) to view and start cloud-based applications that the Azure AD administrator has granted them access to. A user who has Azure AD editions can also use self-service group management capabilities through the Access Panel.

The Access Panel is separate from the Azure portal and does not require users to have an Azure subscription.

![Access Panel][1]

The Access Panel enables users to edit some of their profile settings, including the ability to:

* Change the password associated with a work or school account.
* Edit password reset settings.
* Edit contact and preference settings related to multi-factor authentication (for accounts that have been required to use it by an administrator).
* View account details, such as user ID, alternate email, and mobile and office phone numbers.
* View and start cloud-based applications that the Azure AD administrator has granted them access to. For more information about the Access Panel from the users’ perspective, see [Using the Access Panel](https://msdn.microsoft.com/library/azure/dn756411.aspx).
* Self-manage groups. More specifically, the administrator can create and manage security groups and request security group memberships in Azure AD. For more information, see [Self-service group management for users in Azure AD](active-directory-accessmanagement-self-service-group-management.md) and [Manage your groups](active-directory-manage-groups.md).

## Accessing the Access Panel
Users access the Access Panel by visiting the following URL in a web browser: <br>
**http://myapps.microsoft.com**

If you have custom branding configured for your sign-in page, you can load this branding by default by appending your organization’s domain to the end of the URL: <br>
**http://myapps.microsoft.com/contosobuild.com**

In this case, you can use any active or verified domain name that has been configured under the **Domains** tab of your directory in the Azure portal, as illustrated in the following screenshot:

![Wingtip Toys domain name][2]  

This URL must be distributed to all users who will sign in to applications that are integrated with Azure AD.

## Authentication
To reach the Access Panel, a user must be authenticated through a work or school account in Azure AD. A user can be authenticated to Azure AD directly. Alternatively, if an organization has configured federation by using Active Directory Federation Services (AD FS) or other technologies, users can be authenticated by Windows Server Active Directory.

If a user has a subscription for Azure or Office 365 and has been using the Azure portal or an Office 365 application, they'll see the list of applications without needing to sign in again. Users who are not authenticated will be prompted to sign in by using the username and password for their account in Azure AD. If the organization has configured federation, typing the username is sufficient.

After authentication, users can interact with the applications that the administrator has integrated with the directory. To learn how to integrate applications with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md).

## Web browser requirements
At a minimum, the Access Panel requires a browser that supports JavaScript and has CSS enabled. For the user to be signed in to applications through password-based single sign-on (SSO), the Access Panel extension must be installed in the user’s browser. This extension is downloaded automatically when a user selects an application that is configured for password-based SSO.

The Access Panel extension is currently available for Internet Explorer 8 and later, Edge, Chrome, and Firefox browsers.

## Mobile app support
The Azure Active Directory team publishes the My Apps mobile app. When users install this app, they can sign in to password-based SSO applications on iOS and Android devices.

> [!NOTE]
> Users can sign in to applications that support federation with Azure AD (including Salesforce, Google Apps, Dropbox, Box, Concur, Workday, Office 365, and more than 70 others) on virtually any web browser, on any device, without needing a plug-in or mobile app. The rest of the [Access Panel experience](https://myapps.microsoft.com/) also does not require the My Apps mobile app to be used on a mobile device.
>
>

### My Apps for Android
My Apps for Android is supported on any Android device that's running Android version 4.1 and later. It's available today in the [Google Play store](https://play.google.com/store/apps/details?id=com.microsoft.myapps).

![My Apps for Android screen][3]   

### My Apps for iPhone and iPad
My Apps for iOS is supported on any iPhone or iPad that's running iOS version 7 and later. It's available today in the Apple App Store.

![My Apps for iOS screen][4]    

## Tips for testing the user experience
If you're an Azure administrator and you're signed in to the Azure portal by using an account in the directory, you're automatically signed in to the Access Panel as your current administrator account. In this case, you can see all applications that have been assigned to this account.

To test as a *different* user account:

1. Click the user menu in the upper-right corner of the Azure portal or the Access Panel, and select **Sign Out**. This signs you out of Azure AD.
2. Go to the [Access Panel](http://myapps.microsoft.com).
3. On the sign-in page, enter the username and password for the account in your directory that you want to test.

## Starting applications
Several types of applications can appear on the Access Panel.

### Office 365 applications
If an organization is using Office 365 applications and the user is licensed for them, the Office 365 applications appear on the user’s Access Panel.

When a user clicks an application tile for an Office 365 application, they're redirected to that application and automatically signed in.

### Microsoft and third-party applications configured with federation-based SSO
The administrator can add applications in the Active Directory section of the Azure portal with the SSO mode set to **Azure AD Single Sign-On**. A user sees these applications only if the administrator has explicitly granted that user access to the applications.

When a user clicks a tile for one of these applications, they are redirected to that application and automatically signed in.

### Password-based SSO without identity provisioning
The administrator can add applications in the Active Directory section of the Azure portal with the SSO mode set to **Password-based Single Sign-On**. All users in the directory see all applications that have been configured in this mode.

The first time a user clicks a tile for one of these applications, they're prompted to install the Password SSO plug-in for Internet Explorer or Chrome. The installation might require the user to restart their web browser. When the user returns to the Access Panel and clicks the application tile again, they're prompted for a username and password for the application. After the user enters the username and password, these credentials are securely stored in Azure AD and linked to their account in Azure AD.

The next time the user clicks the application tile, they'll be automatically signed in to the application. The user won't need to enter the credentials again and or install the Password SSO plug-in again.

If a user’s credentials have changed in the target third-party application, the user must also update their credentials that are stored in Azure AD. To update credentials, the user selects the icon on the application tile, and then selects **update credentials** to reenter the username and password for that application.

### Password-based SSO with identity provisioning
The administrator can add applications in the Active Directory section of the Azure portal with the SSO mode set to **Password-based Single Sign-On**, along with identity provisioning.

The first time a user clicks an application tile for one of these applications, they're prompted to install the Password SSO plug-in for Internet Explorer or Chrome. The installation might require the user to restart their web browser. When the user returns to the Access Panel and clicks the application tile again, they're automatically signed in to the application.

Some applications might require the user to change their password on first sign-in. If a user’s credentials have changed in the target third-party application, the user must also update their credentials that are stored in Azure AD. To update credentials, the user selects the icon on the application tile, and then selects **update credentials** to reenter the username and password for that application.

### Application with existing SSO solutions
For configuring SSO for an application, the Azure portal provides a third option of **Existing Single Sign-On**. This option enables the administrator to create a link to an application and place it on the Access Panel for selected users.

For example, if an application is configured to authenticate users by using AD FS 2.0, the administrator can use the **Existing Single Sign-On** option to create a link to it on the Access Panel. When users access the link, they are authenticated through AD FS 2.0 or whatever existing SSO solution the application provides.

## Related articles
* [Article index for application management in Azure Active Directory](active-directory-apps-index.md)
* [List of tutorials on how to integrate SaaS apps](active-directory-saas-tutorial-list.md)
* [Introduction to single sign-on and managing app access with Azure Active Directory](active-directory-appssoaccess-whatis.md)
* [Automate user provisioning and deprovisioning to SaaS applications](active-directory-saas-app-provisioning.md)

<!--Image references-->
[1]: ./media/active-directory-saas-access-panel-introduction/ic767166.png
[2]: ./media/active-directory-saas-access-panel-introduction/ic767167.png
[3]: ./media/active-directory-saas-access-panel-introduction/ic767168.png
[4]: ./media/active-directory-saas-access-panel-introduction/ic767169.png
