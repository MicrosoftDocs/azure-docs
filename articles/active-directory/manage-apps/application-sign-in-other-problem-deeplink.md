---
title: Problems signing in to an application using a deeplink | Microsoft Docs
description: How to troubleshoot issues accessing an application from a deeplink URL using Azure AD
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
ms.reviewer: asteen

---

# Problems signing in to an application using a deeplink

The Access Panel is a web-based portal which enables a user with a work or school account in Azure Active Directory (Azure AD) to view and start cloud-based applications that the Azure AD administrator has granted them access to. 

These applications are configured on behalf of the user in the Azure AD portal. The application must be configured properly and assigned to the user or a group the user is a member of to see the application in the Access Panel.

Deep links or User access URLs are links your users may use to access their password-SSO applications directly from their browsers URL bars. By navigating to this link, users be automatically signed into the application without having to go to the Access Panel first. This is the same link that users use to access these applications from the Office 365 application launcher.

## General issues to check first

-   Make sure your using a **browser** that meets the minimum requirements for the Access Panel.

-   Make sure the user’s browser has added the URL of the application to its **trusted sites**.

-   Make sure to check the application is **configured** correctly.

-   Make sure the user’s account is **enabled** for sign-ins.

-   Make sure the user’s account is **not locked out.**

-   Make sure the user’s **password is not expired or forgotten.**

-   Make sure **Multi-Factor Authentication** is not blocking user access.

-   Make sure a **Conditional Access policy** or **Identity Protection** policy is not blocking user access.

-   Make sure that a user’s **authentication contact info** is up to date to allow Multi-Factor Authentication or Conditional Access policies to be enforced.

-   Make sure to also try clearing your browser’s cookies and trying to sign in again.

## Checking the deeplink

To check if you have the correct deeplink, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

7.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

8.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

9.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

10. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

11. Select the application you want the check the deeplink for.

12. Find the label **User Access URL**. Your deeplink should match this URL.

## How to install the Access Panel Browser extension

To install the Access Panel Browser extension, follow these steps:

1.  Open the [Access Panel](https://myapps.microsoft.com) in one of the supported browsers and sign in as a **user** in your Azure AD.

2.  click a **password-SSO application** in the Access Panel.

3.  In the prompt asking to install the software, select **Install Now**.

4.  Based on your browser you are directed to the download link. **Add** the extension to your browser.

5.  If your browser asks, select to either **Enable** or **Allow** the extension.

6.  Once installed, **restart** your browser session.

7.  Sign in into the Access Panel and see if you can **launch** your password-SSO applications

You may also download the extension for Chrome and Firefox from these direct links:

-   [Chrome Access Panel Extension](https://chrome.google.com/webstore/detail/access-panel-extension/ggjhpefgjjfobnfoldnjipclpcfbgbhl)

-   [Firefox Access Panel Extension](https://addons.mozilla.org/firefox/addon/access-panel-extension/)

## How to configure password single sign-on for an Azure AD gallery application

To configure an application from the Azure AD gallery, you must:

-   [Add an application from the Azure AD gallery](#add-an-application-from-the-Azure-AD-gallery)

-   [Configure the application for password single sign-on](#configure-the-application-for-password-single-sign-on)

### Add an application from the Azure AD gallery

To add an application from the Azure AD Gallery, follow these steps:

1.  Open the [Azure portal](https://portal.azure.com) and sign in as a **Global Administrator** or **Co-admin**.

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click the **Add** button at the top-right corner on the **Enterprise Applications** pane.

6.  In the **Enter a name** textbox from the **Add from the gallery** section, type the name of the application.

7.  Select the application you want to configure for single sign-on.

8.  Before adding the application, you can change its name from the **Name** textbox.

9.  To add the application, click **Add**.

After a short period, you are able to see the application’s configuration pane.

### Configure the application for password single sign-on

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

9.  [Assign users to the application](#how-to-assign-a-user-to-an-application-directly).

10. Additionally, you can also provide credentials on behalf of the user by selecting the rows of the users and clicking on **Update Credentials** and entering the username and password on behalf of the users. Otherwise, users be prompted to enter the credentials themselves upon launch.

## How to configure password single sign-on for a non-gallery application

To configure an application from the Azure AD gallery, you must:

-   [Add a non-gallery application](#add-a-non-gallery-application)

-   [Configure the application for password single sign-on](#configure-the-application-for-password-single-sign-on)

### Add a non-gallery application

To add an application from the Azure AD Gallery, follow these steps:

1.  Open the [Azure portal](https://portal.azure.com) and sign in as a **Global Administrator** or **Co-admin**.

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click the **Add** button at the top-right corner on the **Enterprise Applications** pane.

6.  click **Non-gallery application.**

7.  Enter the name of your application in the **Name** textbox. Select **Add.**

After a short period, you are able to see the application’s configuration pane.

### Configure the application for password single sign-on

To configure single sign-on for an application, follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

    1.  If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on.

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Select the mode **Password-based Sign-on.**

9.  Enter the **Sign-on URL**, the URL where users enter their username and password to sign in. Ensure the sign-in fields are visible at the URL.

10. Assign users to the application.

11. Additionally, you can also provide credentials on behalf of the user by selecting the rows of the users and clicking on **Update Credentials** and entering the username and password on behalf of the users. Otherwise, users be prompted to enter the credentials themselves upon launch.

## How to assign a user to an application directly

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

11. Hover over the **user** in the list to reveal a **checkbox**. To add your user to the **Selected** list, click the checkbox next to the user’s profile photo or logo.

12. **Optional:** If you would like to **add more than one user**, type in another **full name** or **email address** into the **Search by name or email address** search box, and click the checkbox to add this user to the **Selected** list.

13. When you are finished selecting users, click the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional:** click the **Select Role** selector in the **Add Assignment** pane to select a role to assign to the users you have selected.

15. Click the **Assign** button to assign the application to the selected users.

After a short period, the users you have selected be able to launch these applications in the Access Panel.

## If these troubleshooting steps do not the resolve the issue. 

open a support ticket with the following information if available:

-   Correlation error ID

-   UPN (user email address)

-   TenantID

-   Browser type

-   Time zone and time/timeframe during error occurs

-   Fiddler traces

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)
