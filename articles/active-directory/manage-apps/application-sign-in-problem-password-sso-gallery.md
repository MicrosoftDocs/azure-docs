---
title: Problems signing in to an Azure AD Gallery application configured for password single sign-on | Microsoft Docs
description: How to troubleshoot issues with an Azure AD Gallery application that's configured for password single sign-on.
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
ms.reviewer: asteen

ms.collection: M365-identity-device-management
---

# Sign in problems with Azure AD Gallery app configured for single sign-on

The Access Panel is a web-based portal. It lets  users who have Azure Active Directory (Azure AD) work or school account to access cloud-based applications that the Azure AD administrator has granted them access to. A user who has Azure AD editions can also use self-service group and app management capabilities through the Access Panel. The Access Panel is separate from the Azure portal and does not require users to have an Azure subscription.

To use password-based single sign-on (SSO) in the Access Panel, the Access Panel extension must be installed in the user’s browser. This extension is downloaded automatically when a user selects an application that's configured for password-based SSO.

## Meeting browser requirements for the Access Panel

The Access Panel requires a browser that supports JavaScript and has CSS enabled.

For password-based SSO, the end user’s browser can be:

- Internet Explorer 8, 9, 10, 11 on on Windows 7 or later

- Chrome on Windows 7 or later or on MacOS X or later

-   Firefox 26.0 or later  on Windows XP SP2 or later or on Mac OS X 10.6 or later

>[!NOTE]
>The password-based SSO extension become available for Microsoft Edge in Windows 10 when browser extensions become supported for Microsoft Edge.
>

## How to install the Access Panel Browser extension

Follow these steps:

1. Open [Access Panel](https://myapps.microsoft.com) in a supported browsers, and sign in as a *user* in Azure AD.

2. Select a *password-SSO application* in Access Panel.

3. When you're prompted, select **Install Now**.

4. You'll be directed to a download link based on your browser. Select **Add** to install the browser extension.

5. If you're prompted, select to **Enable** or **Allow** the extension.

6. After the installation, restart your browser.

7.  Sign in into  Access Panel and see if you can start your password-SSO applications.

You can also download the extension for Chrome and Firefox directly through these links:

-   [Chrome Access Panel Extension](https://chrome.google.com/webstore/detail/access-panel-extension/ggjhpefgjjfobnfoldnjipclpcfbgbhl)

-   [Firefox Access Panel Extension](https://addons.mozilla.org/firefox/addon/access-panel-extension/)

## Sett up a Group Policy for Internet Explorer

You can setup a group policy that allow you to remotely install the Access Panel extension for Internet Explorer on your users' machines.

The prerequisites include:

-   You have set up [Active Directory Domain Services](https://msdn.microsoft.com/library/aa362244%28v=vs.85%29.aspx), and you have joined your users' machines to your domain.

-   You must have the "Edit settings" permission to edit the Group Policy Object (GPO). By default, members of the following security groups have this permission: Domain Administrators, Enterprise Administrators, and Group Policy Creator Owners. [Learn more](https://technet.microsoft.com/library/cc781991%28v=ws.10%29.aspx).

Follow the tutorial [How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](https://docs.microsoft.com/azure/active-directory/active-directory-saas-ie-group-policy) for step by step instructions on how to configure the group policy and deploy it to users.

## Troubleshoot the Access Panel in Internet Explorer

Follow the [Troubleshoot the Access Panel Extension for Internet Explorer](https://docs.microsoft.com/azure/active-directory/active-directory-saas-ie-troubleshooting) guide for access a diagnostics tool and step by step instructions on configuring the extension for IE.

## How to configure password single sign-on for an Azure AD gallery application

To configure an application from the Azure AD gallery you need to do these things:

-   Add an application from the Azure AD gallery

-   [Configure the application for password single sign-on](#configure-the-application-for-password-single-sign-on)

-   [Assign users to the application](#assign-users-to-the-application)

### Add an application from the Azure AD gallery

To add an application from the Azure AD Gallery, follow these steps:

1. Open the [Azure portal](https://portal.azure.com) and sign in as a gobal administrator or co-admin.

2. Select **All services** at the top of the navigation menu on the left side to open the Azure Active Directory Extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** from the Azure AD navigation menu on the left side.

5. Select **Add** in the upper-right corner of the **Enterprise Applications** pane.

6.  In the **Add from the gallery** section, type the name of the app in the **Enter a name** box.

7.  Select the application that you want to configure for SSO.

8.  Before adding the application, you can change its name from the **Name** textbox.

9.  Click **Add** to add the application.

After a brief delay, you'll be able to see the application’s configuration pane.

### Configure the application for password SSO

To configure single sign-on for an application, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator** or co-admin.

2. Select **All services** at the top of the navigation pain on the left side to open the Azure Active Directory Extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** from the Azure AD navigation pane.

5. Select **All Applications** to view a list of your applications.

   > [!NOTE]
   > If you don't see the application that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to **All Applications**

6. Select the application you want to configure single sign-on for.

7. After the application loads, select **Single sign-on** from the menu on the left side of the app.

8. Select **Password-based Sign-on** mode.

9. Assign users to the application.

10. Additionally, you can provide credentials on behalf of the user. To do this:
    1. Select the rows of the those users. and then s
    2. Select **Update Credentials**.
    3. Enter the username and password on behalf of the users. (Otherwise, users will be prompted to enter credentials themselves at startup).

### Assign users to the application

To assign one or more users to an application directly, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator.

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   > [!NOTE]
   > If you don't see the application that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to **All Applications**

6. Select the application you want to assign a user to from the list.

7. Once the application loads, click **Users and Groups** from the application’s left-hand navigation menu.

8. Click the **Add** button on top of the **Users and Groups** list to open the **Add Assignment** pane.

9. click the **Users and groups** selector from the **Add Assignment** pane.

10. Type in the **full name** or **email address** of the user you are interested in assigning into the **Search by name or email address** search box.

11. Hover over the **user** in the list to reveal a **checkbox**. Click the checkbox next to the user’s profile photo or logo to add your user to the **Selected** list.

12. **Optional:** If you would like to **add more than one user**, type in another **full name** or **email address** into the **Search by name or email address** search box, and click the checkbox to add this user to the **Selected** list.

13. When you are finished selecting users, click the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional:** click the **Select Role** selector in the **Add Assignment** pane to select a role to assign to the users you have selected.

15. Click the **Assign** button to assign the application to the selected users.

After a short period, the users you have selected be able to launch these applications in the Access Panel.

## If these troubleshoot steps don't resolve the issue 
open a support ticket with the following information if available:

-   Correlation error ID

-   UPN (user email address)

-   TenantID

-   Browser type

-   Time zone and time/timeframe during error occurs

-   Fiddler traces

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)
