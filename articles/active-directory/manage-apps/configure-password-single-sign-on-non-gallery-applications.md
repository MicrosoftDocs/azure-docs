---
title: How to configure password single sign-on for a non-gallery applicationn | Microsoft Docs
description: How to configure an custom non-gallery application for secure password-based single sign-on when it is not listed in the Azure AD Application Gallery
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: barbkess

---

# How to configure password single sign-on for a non-gallery application

In addition to the choices found within the Azure AD Application Gallery, you also have the option to add a **non-gallery application** when the application you want is not listed there. Using this capability, you can add any application that already exists in your organization, or any third-party application that you might use from a vendor who is not already part of the [Azure AD Application Gallery](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis#get-started-with-the-azure-ad-application-gallery).

Once you add a non-gallery application, you can then configure the Single sign-on method this application uses by selecting the **Single Sign-on** navigation item on an Enterprise Application in the [Azure portal](https://portal.azure.com/).

One of the Single Sign-on methods available to you is the [Password-Based Single Sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis#how-does-single-sign-on-with-azure-active-directory-work) option. With the **add a non-gallery application** experience, you can integrate any application that renders an HTML-based username and password input field, even if it is not in our set of pre-integrated applications.

The way this works is by a page scraping technology that is part of the Access Panel extension that allows us to auto-detect username and password input fields, store them securely for your specific application instance. Then securely replay usernames and passwords to those fields when a user navigates to that application on the application access panel.

This is a great way to get started integrating any kind of application into Azure AD quickly, and allows you to:

-   Integrate **any application in the world** with your Azure AD tenant, so long as it renders an HTML username and password input field

-   Enable **Single Sign-on for your users** by securely storing and replaying usernames and passwords for the application you’ve integrated with Azure AD

-   **Auto-detect input** fields for any application and allow you to manually detect those fields using the Access Panel Browser Extension, in case auto-detection does not find them

-   **Support applications that require multiple sign-in fields** for applications that require more than just username and password fields to sign in

-   **Customize the labels** of the username and password input fields your users see on the [Application Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction) when they enter their credentials

-   Allow your **users** to provide their own usernames and passwords for any existing application accounts they are typing in manually on the [Application Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction)

-   Allow a **member of the business group** to specify the usernames and passwords assigned to a user by using the [Self-Service Application Access](https://docs.microsoft.com/azure/active-directory/active-directory-self-service-application-access) feature

-   Allow an **administrator** to specify the usernames and passwords assigned to a user by using the Update Credentials feature when [assigning a user to an application](#_How_to_configure_1)

-   Allow an **administrator** to specify the shared username or password used by a group of people by using the Update Credentials feature when [assigning a group to an application](#assign-an-application-to-a-group-directly)

The following section describes how you can enable [Password-Based Single Sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis#how-does-single-sign-on-with-azure-active-directory-work) to any application that you add using the **add a non-gallery application** experience.

## Overview of steps required

To configure an application from the Azure AD gallery you need to:

-   [Add a non-gallery application](#add-a-non-gallery-application)

-   [Configure the application for password single sign-on](#configure-the-application-for-password-single-sign-on)

-   [Assign the application to a user or a group](#assign-the-application-to-a-user-or-a-group)

    -   [Assign a user to an application directly](#assign-a-user-to-an-application-directly)

    -   [Assign an application to a group directly](#assign-an-application-to-a-group-directly)

## Add a non-gallery application

To add an application from the Azure AD Gallery, follow these steps:

1.  Open the [Azure portal](https://portal.azure.com) and sign in as a **Global Administrator** or **Co-admin**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click the **Add** button at the top-right corner on the **Enterprise Applications** pane.

6.  click **Non-gallery application**.

7.  Enter the name of your application in the **Name** textbox. Select **Add.**

After a short period, you be able to see the application’s configuration pane.

## Configure the application for password single sign-on

To configure single sign-on for an application, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on.

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Select the mode **Password-based Sign-on.**

9.  Enter the **Sign-on URL**. This is the URL where users enter their username and password to sign in to. Ensure the sign-in fields are visible at the URL.

10. Assign users to the application.

11. Additionally, you can also provide credentials on behalf of the user by selecting the rows of the users and clicking on **Update Credentials** and entering the username and password on behalf of the users. Otherwise, users be prompted to enter the credentials themselves upon launch.

12. **Optional:** For certain social media applications like Twitter and Facebook, there is also the option to enable automatic rollover of the password for the application at a selected frequency. To enable this select **I want Azure AD to automatically manage this user or group's password** while entering credentials on behalf of a user or group. Then select the **Rollover frequency (in weeks)**.

## Assign a user to an application directly

To assign one or more users to an application directly, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to assign a user to from the list.

7.  Once the application loads, click **Users and Groups** from the application’s left-hand navigation menu.

8.  To open the **Add Assignment** pane, click the **Add** button on top of the **Users and Groups** list.

9.  click the **Users and groups** selector from the **Add Assignment** pane.

10. Type in the **full name** or **email address** of the user you are interested in assigning into the **Search by name or email address** search box.

11. Hover over the **user** in the list to reveal a **checkbox**. Click the checkbox next to the user’s profile photo or logo to add your user to the **Selected** list.

12. **Optional:** If you would like to **add more than one user**, type in another **full name** or **email address** into the **Search by name or email address** search box, and click the checkbox to add this user to the **Selected** list.

13. When you are finished selecting users, click the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional:** click the **Select Role** selector in the **Add Assignment** pane to select a role to assign to the users you have selected.

15. Click the **Assign** button to assign the application to the selected users.

## Assign an application to a group directly

To assign one or more groups to an application directly, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to assign a user to from the list.

7.  Once the application loads, click **Users and Groups** from the application’s left-hand navigation menu.

8.  To open the **Add Assignment** pane, click the **Add** button on top of the **Users and Groups** list.

9.  click the **Users and groups** selector from the **Add Assignment** pane.

10. Type in the **full group name** of the group you are interested in assigning into the **Search by name or email address** search box.

11. Hover over the **group** in the list to reveal a **checkbox**. Click the checkbox next to the group’s profile photo or logo to add your user to the **Selected** list.

12. **Optional:** If you would like to **add more than one group**, type in another **full group name** into the **Search by name or email address** search box, and click the checkbox to add this group to the **Selected** list.

13. When you are finished selecting groups, click the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional:** click the **Select Role** selector in the **Add Assignment** pane to select a role to assign to the groups you have selected.

15. Click the **Assign** button to assign the application to the selected groups.

After a short period, the users you have selected be able to launch these applications in the Access Panel.

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)
