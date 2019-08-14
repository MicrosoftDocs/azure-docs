---
title: How to configure password single sign-on for an Azure AD Gallery application | Microsoft Docs
description: How to configure an application for secure password-based single sign-on when it's already listed in the Azure AD Application Gallery
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: mimart

ms.collection: M365-identity-device-management
ROBOTS: NOINDEX
---

# How to configure password single sign-on (SSO) for an Azure AD gallery application

When you add an application from the [Azure AD application gallery](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis), you can choose how you want your users to sign in to that application. You can configure this choice at any time by selecting **Single Sign-on** on an Enterprise application in the [Azure portal](https://portal.azure.com/).

One of the available single sign-on options is [password-sased single sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis). This is a great way to start quickly integrating applications into Azure Active Directory (Azure AD). It enables the following:

-   **Single Sign-on for your users** by securely storing and replaying usernames and passwords for the application you’ve integrated with Azure AD

-   **Support for applications that require multiple sign-in fields** beyond just the username and password fields

-   Lets you **customize the labels** of the username and password fields your users see on the [Application Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction) when they enter their credentials

-   Allows your **users** to provide their own usernames and passwords for any existing application accounts they manually enter on the [Application Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction)

-   Allows a **member of the business group** to use the [Self-Service Application Access](https://docs.microsoft.com/azure/active-directory/active-directory-self-service-application-access) feature to specify the usernames and passwords assigned to a user

-   Lets an **administrator** specify the usernames and passwords assigned to a user by using the Update Credentials feature when they [assign a user to an application](#assign-a-user-to-an-application-directly)

-   Lets an **administrator** use the Update Credentials feature to specify the shared username or password for a group of people when they [assign a group to an application](#assign-an-application-to-a-group-directly)

The following section describes how you can enable [password-based single sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis) to an application that's already in the [Azure AD application gallery](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Overview of steps required
To configure an application from the Azure AD gallery, you need to:

-   [Add an application from the Azure AD gallery](#add-an-application-from-the-azure-ad-gallery)

-   [Configure the application for password single sign-on](#configure-the-application-for-password-single-sign-on)

-   Assign the application to a user or a group

    -   [Assign a user to an application directly](#assign-a-user-to-an-application-directly)

    -   [Assign an application to a group directly](#assign-an-application-to-a-group-directly)

## Add an application from the Azure AD gallery

To add an application from the Azure AD Gallery, follow these steps:

1.  Open the [Azure portal](https://portal.azure.com), and sign in as a **Global Administrator** or **Co-admin**.

2.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the navigation menu on the left.

3.  Type “azure active directory” in the search box, and then select the **Azure Active Directory** item.

4.  Select **Enterprise applications** on the Azure AD navigation menu on the left.

5.  Select the **Add** button at the top-right corner of the **Enterprise Applications** pane.

6.  In the **Enter a name** box in the **Add from the gallery** section, enter the name of the application.

7.  Select the application you want to configure for single sign-on.

8.  Before you add the application, you can change its name in the **Name** box.

9.  Select **Add** to add the application.

After a short period, you can see the application’s configuration pane.

## Configure the application for password single sign-on

To configure single sign-on for an application, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by selecting **All services** at the top of the navigation menu on the left.

3. Type “azure active directory” in the search box, and then select the **Azure Active Directory** item.

4. Select **Enterprise Applications** from the Azure Active Directory navigation menu on the left.

5. Select **All Applications** to view a list of all your applications.

   * If you don't see the application you want here, use the **Filter** control at the top of **All Applications List**, and set the **Show** option to **All Applications.**

6. Select the application you want to configure for single sign-on.

7. After the application loads, select **Single sign-on** from the application’s navigation menu on the left.

8. Select **Password-based Sign-on** mode.

9. [Assign users to the application](#assign-a-user-to-an-application-directly).

10. You can also provide credentials on behalf of users by selecting a user's row, selecting **Update Credentials**, and then entering the username and password. Otherwise, users are prompted to enter their credentials when they start the application.

## Assign a user to an application directly

To assign one or more users to an application directly, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by selecting **All services** at the top of the navigation menu on the left.

3. Type "azure active directory” in the search box, and then select the **Azure Active Directory** item.

4. Select **Enterprise Applications** from the Azure Active Directory navigation menu on the left.

5. Select **All Applications** to view a list of all your applications.

   * If you don't see the application you want here, use the **Filter** control at the top of **All Applications List**, and set the **Show** option to **All Applications**.

6. Select the application you want to assign a user to.

7. After the application loads, select **Users and Groups** from the application’s navigation menu on the left.

8. Select the **Add** button on top of the **Users and Groups** list to open the **Add Assignment** pane.

9. Select **Users and groups** from the **Add Assignment** pane.

10. Type the full name or email address of the user in question into the **Search by name or email address** search box.

11. Hover over the user in the list, and then select the check box next to the user’s profile photo or logo to add them to the **Selected** list.

12. **Optional**: If you want to add more than one user, type  another full name or email address into the **Search by name or email address** box, and select the check box for that user to add them to the **Selected** list.

13. When you're finished selecting users, use the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional**: select **Select Role** in the **Add Assignment** pane to select a role to assign to the users you've selected.

15. Select **Assign** to assign the application to the selected users.

## Assign an application to a group directly

To assign one or more groups to an application directly, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by selecting **All services** at the top of the navigation menu on the left.

3. Type "azure active directory” in the search box, and then select the **Azure Active Directory** item.

4. Select **Enterprise Applications** from the Azure AD navigation menu on the left.

5. Select **All Applications** to view a list of all your applications.

   * If you don't see the application you want here, use the **Filter** control at the top of **All Applications List** and set the **Show** option to **All Applications**.

6. Select the application you want to assign a user to.

7. After the application loads, select **Users and Groups** from the application’s navigation menu on the left.

8. Select the **Add** button at the top of the **Users and Groups** list to open the **Add Assignment** pane.

9. Select **Users and groups** from the **Add Assignment** pane.

10. Type the full group name of the group you want to assign into the **Search by name or email address** search box.

11. Hover over **group** in the list, and then select the check box next to the group’s profile photo or logo to add the group to the **Selected** list.

12. **Optional**: If you want to add more than one group, type another full group name into the **Search by name or email address** search box, and then select the corresponding check box to add this group to the **Selected** list.

13. When you're finished selecting groups, use the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional**: Select **Select Role** in the **Add Assignment** pane to select a role to assign to the groups you've selected.

15. Select **Assign** to assign the application to the selected groups.

After a short period, the users you've selected should be able to start these applications from the Access Panel.

## Next steps
[Provide single sign-on to your apps through Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md).
