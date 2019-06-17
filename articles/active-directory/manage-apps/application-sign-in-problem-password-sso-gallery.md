---
title: Problem signing in to an Azure AD gallery app configured for password SSO | Microsoft Docs
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

# Sign-in problems with an Azure AD gallery app configured for SSO

Access Panel is a web-based portal. It enables users who have Azure Active Directory (Azure AD) work or school accounts to access cloud-based apps that they have permissions for. Users who have Azure AD editions can also use self-service group and app-management capabilities through Access Panel.

Access Panel is separate from the Azure portal. Users don't need an Azure subscription to use Access Panel.

To use password-based single sign-on (SSO) in Access Panel, the Access Panel extension must be installed in your browser. The extension downloads automatically when you select an app that's configured for password-based SSO.

## Browser requirements for Access Panel

Access Panel requires a browser that supports JavaScript and has CSS enabled.

The following browsers support password-based SSO:

- Internet Explorer 8, 9, 10, and 11 on Windows 7 or later

- Chrome on Windows 7 or later or on MacOS X or later

- Firefox 26.0 or later on Windows XP SP2 or later or on Mac OS X 10.6 or later

>[!NOTE]
>The password-based SSO extension become available for Microsoft Edge in Windows 10 when support for browser extensions was added to Microsoft Edge.

## Install the Access Panel Browser extension

Follow these steps:

1. Open [Access Panel](https://myapps.microsoft.com) in a supported browser, and sign in as a user in Azure AD.

2. Select a password-SSO-enabled app in Access Panel.

3. When you're prompted, select **Install Now**.

4. You'll be directed to a download link based on your browser. Select **Add** to install the browser extension.

5. If you're prompted, select **Enable** or **Allow**.

6. After the installation, restart your browser.

7.  Sign in to  Access Panel and see if you can start your password-SSO-enabled apps.

You can also directly download the extensions for Chrome and Firefox through these links:

-   [Chrome Access Panel extension](https://chrome.google.com/webstore/detail/access-panel-extension/ggjhpefgjjfobnfoldnjipclpcfbgbhl)

-   [Firefox Access Panel extension](https://addons.mozilla.org/firefox/addon/access-panel-extension/)

## Set up a group policy for Internet Explorer

You can set up a group policy that allows you to remotely install the Access Panel extension for Internet Explorer on your users' machines.

These are the prerequisites:

-   [Active Directory Domain Services](https://msdn.microsoft.com/library/aa362244%28v=vs.85%29.aspx) must be set up, and your users' machines must be joined to your domain.

-   You have "Edit settings" permission to edit the Group Policy Object (GPO). By default, members of the following security groups have this permission: Domain Administrators, Enterprise Administrators, and Group Policy Creator Owners. [Learn more](https://technet.microsoft.com/library/cc781991%28v=ws.10%29.aspx).

To configure the group policy and deploy it to users, see [How to deploy the Access Panel extension for Internet Explorer using group policy](https://docs.microsoft.com/azure/active-directory/active-directory-saas-ie-group-policy).

## Troubleshoot Access Panel in Internet Explorer

To access a diagnostics tool and instructions to configure the extension, see [Troubleshoot the Access Panel extension for Internet Explorer](https://docs.microsoft.com/azure/active-directory/active-directory-saas-ie-troubleshooting).

## Configure password SSO for an Azure AD gallery app

To configure an app from the Azure AD gallery, you need to do these things:

-   Add the app from the Azure AD gallery
-   [Configure the app for password single sign-on](#configure-the-app-for-password-sso)
-   [Assign users to the app](#assign-users-to-the-app)

### Add the app from the Azure AD gallery

Follow these steps:

1. Open the [Azure portal](https://portal.azure.com) and sign in as a global administrator or co-admin.

2. Select **All services** at the top of the navigation pane on the left side to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** from the Azure AD navigation pane.

5. Select **Add** in the upper-right corner of the **Enterprise Applications** pane.

6. In the **Add from the gallery** section, type the name of the app in the **Enter a name** box.

7. Select the app that you want to configure for SSO.

8. *Optional:* Before you add the app, you can change its name in the **Name** box.

9. Click **Add** to add the app.

   After a brief delay, you'll be able to see the app’s configuration pane.

### Configure the app for password SSO

Follow these steps:

1. Open the [Azure portal](https://portal.azure.com/) and sign in as a global administrator or co-admin.

2. Select **All services** at the top of the navigation pane on the left side to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** in the Azure AD navigation pane.

5. Select **All Applications** to view a list of your apps.

   > [!NOTE]
   > If you don't see the app that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to "All Applications."

6. Select the app that you want to configure for SSO.

7. After the app loads, select **Single sign-on** in the pane on the left side of the app.

8. Select **Password-based sign-on** mode.

9. Assign users to the app.

10. You can also provide credentials for users. (Otherwise, users will be prompted to enter credentials at app startup.) To do this, select the rows of the users. Then select **Update Credentials** and enter their user names and passwords.

### Assign users to the app

To assign users to an app directly, follow these steps:

1. Open the [Azure portal](https://portal.azure.com/) and sign in as a global admin.

2. Select **All services** in the navigation pain on the left side to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** in the Azure AD navigation pane.

5. Select **All Applications** to view a list of your applications.

   > [!NOTE]
   > If you don't see the app that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to "All Applications."

6. From the list, select the app that you want to assign a user to.

7. After the application loads, select **Users and Groups** from the app’s navigation pane on the left side.

8. Select **Add** at the top of the **Users and Groups** list to open the **Add Assignment** pane.

9. Select **Users and groups** in the **Add Assignment** pane.

10. In the **Search by name or email address** box, type the full name or email address of the user that you want to assign.

11. Hover over the user in the list. Select the check box next to the user’s profile photo or logo to add that user to the **Selected** list.

12. *Optional:* To add another user, type another name or email address in the **Search by name or email address** box, and then select the check box to add that user to the **Selected** list.

13. When you're finished selecting users, click  **Select** to add them to the list of users and groups who are assigned to the app.

14. *Optional:* Click **Select Role** in the **Add Assignment** pane to select a role to assign to the users that you selected.

15. Select **Assign** to assign the app to the selected users.

    After a brief delay, the users will be able to access those apps from Access Panel.

## Request support 
If you get an error message when you set up SSO and assign users, open a support ticket. Include as much of the following information as possible:

-   Correlation error ID
-   UPN (user email address)
-   TenantID
-   Browser type
-   Time zone and time/time frame when the error occurred
-   Fiddler traces

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)
