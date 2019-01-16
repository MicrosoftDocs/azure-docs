---
title: How to configure password single sign-on for an Azure AD Gallery application | Microsoft Docs
description: How to configure an application for secure password-based single sign-on when it is already listed in the Azure AD Application Gallery
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

# How to configure password single sign-on for an Azure AD Gallery application

When you add an application from the [Azure AD Application Gallery](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis#get-started-with-the-azure-ad-application-gallery), you have the choice of how you want your users to sign in to that application. You can configure this choice at any time by selecting the **Single Sign-on** navigation item on an Enterprise Application in the [Azure portal](https://portal.azure.com/).

One of the single sign-on methods available to you is the [Password-Based Single Sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis#how-does-single-sign-on-with-azure-active-directory-work) option. This is a great way to get started integrating applications into Azure AD quickly, and allows you to:

-   Enable **Single Sign-on for your users** by securely storing and replaying usernames and passwords for the application you’ve integrated with Azure AD

-   **Support applications that require multiple sign-in fields** for applications that require more than just username and password fields to sign in

-   **Customize the labels** of the username and password input fields your users see on the [Application Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction) when they enter their credentials

-   Allow your **users** to provide their own usernames and passwords for any existing application accounts they are typing in manually on the [Application Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction)

-   Allow a **member of the business group** to specify the usernames and passwords assigned to a user by using the [Self-Service Application Access](https://docs.microsoft.com/azure/active-directory/active-directory-self-service-application-access) feature

-   Allow an **administrator** to specify the usernames and passwords assigned to a user by using the Update Credentials feature when [assigning a user to an application](#assign-a-user-to-an-application-directly)

-   Allow an **administrator** to specify the shared username or password used by a group of people by using the Update Credentials feature when [assigning a group to an application](#assign-an-application-to-a-group-directly)

The following section describes how you can enable [Password-Based Single Sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis#how-does-single-sign-on-with-azure-active-directory-work) to an application that is already in the [Azure AD Application Gallery](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis#get-started-with-the-azure-ad-application-gallery).

## Overview of steps required
To configure an application from the Azure AD gallery you need to:

-   [Add an application from the Azure AD gallery](#add-an-application-from-the-azure-ad-gallery)

-   [Configure the application for password single sign-on](#configure-the-application-for-password-single-sign-on)

-   [Assign the application to a user or a group](#assign-the-application-to-a-user-or-a-group)

    -   [Assign a user to an application directly](#assign-a-user-to-an-application-directly)

    -   [Assign an application to a group directly](#assign-an-application-to-a-group-directly)

## Add an application from the Azure AD gallery

To add an application from the Azure AD Gallery, follow these steps:

1.  Open the [Azure portal](https://portal.azure.com) and sign in as a **Global Administrator** or **Co-admin**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click the **Add** button at the top-right corner on the **Enterprise Applications** pane.

6.  In the **Enter a name** textbox from the **Add from the gallery** section, type the name of the application.

7.  Select the application you want to configure for single sign-on.

8.  Before adding the application, you can change its name from the **Name** textbox.

9.  Click **Add** button, to add the application.

After a short period, you can see the application’s configuration pane.

## Configure the application for password single sign-on

To configure single sign-on for an application, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Select the mode **Password-based Sign-on.**

9.  [Assign users to the application](#assign-a-user-to-an-application-directly).

10. Additionally, you can also provide credentials on behalf of the user by selecting the rows of the users and clicking on **Update Credentials** and entering the username and password on behalf of the users. Otherwise, users be prompted to enter the credentials themselves upon launch.

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

8.  Click the **Add** button on top of the **Users and Groups** list to open the **Add Assignment** pane.

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

8.  Click the **Add** button on top of the **Users and Groups** list to open the **Add Assignment** pane.

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
