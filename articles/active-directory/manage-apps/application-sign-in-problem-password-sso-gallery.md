---
title: Problems signing in to an Azure AD gallery application configured for password single sign-on | Microsoft Docs
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

# Sign in problems with an Azure AD Gallery app configured for single sign-on

Access Panel is a web-based portal. It lets users who have Azure Active Directory (Azure AD) work or school accounts access cloud-based apps that they have permissions for. Users who have Azure AD editions can also use self-service group and app management capabilities through Access Panel. Access Panel is separate from the Azure portal. Users don't need an Azure subscription to use Access Panel.

To use password-based single sign-on (SSO) in Access Panel, the Access Panel extension must be installed in the user’s browser. This extension is downloaded automatically when a user selects an app that's configured for password-based SSO.

## Browser requirements for Access Panel

Access Panel requires a browser that supports JavaScript and has CSS enabled.

For password-based SSO, the end user’s browser can be:

- Internet Explorer 8, 9, 10, 11 on Windows 7 or later

- Chrome on Windows 7 or later or on MacOS X or later

- Firefox 26.0 or later on Windows XP SP2 or later or on Mac OS X 10.6 or later

>[!NOTE]
>The password-based SSO extension become available for Microsoft Edge in Windows 10 when browser extensions become supported for Microsoft Edge.

## How to install the Access Panel Browser extension

Follow these steps:

1. Open [Access Panel](https://myapps.microsoft.com) in a supported browser, and sign in as a *user* in Azure AD.

2. Select a *password-SSO application* in Access Panel.

3. When you're prompted, select **Install Now**.

4. You'll be directed to a download link based on your browser. Select **Add** to install the browser extension.

5. If you're prompted, select to **Enable** or **Allow** the extension.

6. After the installation, restart your browser.

7.  Sign to  Access Panel and see if you can start your password-SSO apps.

You can also directly download the extension for Chrome and Firefox directly through these links:

-   [Chrome Access Panel extension](https://chrome.google.com/webstore/detail/access-panel-extension/ggjhpefgjjfobnfoldnjipclpcfbgbhl)

-   [Firefox Access Panel extension](https://addons.mozilla.org/firefox/addon/access-panel-extension/)

## Set up a Group Policy for Internet Explorer

You can set up a group policy that allows you to remotely install the Access Panel extension for Internet Explorer on your users' machines.

The prerequisites include:

-   [Active Directory Domain Services](https://msdn.microsoft.com/library/aa362244%28v=vs.85%29.aspx) is set up, and your users' machines are joined to your domain.

-   You must have the "Edit settings" permission to edit the Group Policy Object (GPO). By default, members of the following security groups have this permission: Domain Administrators, Enterprise Administrators, and Group Policy Creator Owners. [Learn more](https://technet.microsoft.com/library/cc781991%28v=ws.10%29.aspx).

To configure the group policy and deploy it to users, follow the tutorial [How to Deploy the Access Panel extension for Internet Explorer using Group Policy](https://docs.microsoft.com/azure/active-directory/active-directory-saas-ie-group-policy).

## Troubleshoot Access Panel in Internet Explorer

To access a diagnostics tool and instructions for configuring the extension, see [Troubleshoot the Access Panel extension for Internet Explorer](https://docs.microsoft.com/azure/active-directory/active-directory-saas-ie-troubleshooting).

## How to configure password SSO for an Azure AD gallery app

To configure an app from the Azure AD gallery, you need to do these things:

-   Add an app from the Azure AD gallery
-   [Configure the application for password single sign-on](#configure-the-application-for-password-single-sign-on)
-   [Assign users to the app](#assign-users-to-the-application)

### Add an app from the Azure AD gallery

Follow these steps:

1. Open the [Azure portal](https://portal.azure.com) and sign in as a global administrator or co-admin.

2. Select **All services** at the top of the navigation pane on the left side to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** from the Azure AD navigation pane.

5. Select **Add** in the upper-right corner of the **Enterprise Applications** pane.

6. In the **Add from the gallery** section, type the name of the app in the **Enter a name** box.

7. Select the app that you want to configure for SSO.

8. Before adding the application, you can change its name in the **Name** textbox.

9. Click **Add** to add the app.

After a brief delay, you'll be able to see the app’s configuration pane.

### Configure the app for password SSO

To configure single sign-on for an app, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator or co-admin.

2. Select **All services** at the top of the navigation pain on the left side to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** in the Azure AD navigation pane.

5. Select **All Applications** to view a list of your apps.

   > [!NOTE]
   > If you don't see the app that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to **All Applications**.

6. Select the app you want to configure for single sign-on.

7. After the app loads, select **Single sign-on** from the menu on the left side of the app.

8. Select **Password-based Sign-on** mode.

9. Assign users to the app.

10. Additionally, you can provide credentials on behalf of user. To do this, follow these steps:
    1. Select the rows of those users.
    2. Select **Update Credentials**.
    3. Enter the user names and passwords on behalf of the users. (Otherwise, the users will be prompted to enter credentials at startup).

### Assign users to the app

To assign one or more users to an app directly, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator.

2. Select **All services** in the navigation pain on the left side to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** in the Azure AD navigation pane.

5. Select **All Applications** to view a list of your applications.

   > [!NOTE]
   > If you don't see the app that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to **All Applications**.

6. From the list, select the app that you want to assign a user to.

7. After the application loads, select **Users and Groups** from the app’s navigation pane on the left side.

8. Select **Add** at the top of the **Users and Groups** list to open the **Add Assignment** pane.

9. Select **Users and groups** selector from the **Add Assignment** pane.

10. In the **Search by name or email address** box, type the full name or email address of the user that you want to assign.

11. Hover over the user in the list. Select the check box next to the user’s profile photo or logo to add that user to the **Selected** list.

12. *Optional:* If you want to add more than one user, type another full name or email address in the **Search by name or email address** box, and then select the check box to add that user to the **Selected** list.

13. When you're finished selecting users, click  **Select** to add them to the list of users and groups who are assigned to the application.

14. *Optional:* Click **Select Role** in the **Add Assignment** pane to select a role to assign to the users that you selected.

15. Select **Assign** to assign the app to the selected users.

After a brief delay, the users will be able to access those apps from Access Panel.

## If these troubleshoot steps don't resolve the issue 
Open a support ticket. Include as much of the following information as possible:

-   Correlation error ID
-   UPN (user email address)
-   TenantID
-   Browser type
-   Time zone and time/timeframe when error occurs
-   Fiddler traces

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)
