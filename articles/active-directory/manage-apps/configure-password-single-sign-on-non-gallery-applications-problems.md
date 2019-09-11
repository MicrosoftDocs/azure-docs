---
title: Problems configuring password SSO for a non-gallery application | Microsoft Docs
description: Common problems that occur when you configure password single sign-on (SSO) for custom apps that aren't in the Azure AD application gallery.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: celested

ms.collection: M365-identity-device-management
---

# Problems configuring password single sign-on for a non-gallery application

This article describes common problems that can occur when you configure *password single sign-on* (SSO) for a non-gallery app.

## Capture sign-in fields for an app

Sign-in field capture is supported only for HTML-enabled sign-in pages. It's not supported for non-standard sign-in pages, like those that use Adobe Flash or other non-HTML-enabled technologies.

There are two ways to capture sign-in fields for your custom apps:

- **Automatic sign-in field capture** works well with most HTML-enabled sign-in pages, *if they use well-known DIV IDs* for the user name and password fields. The HTML on the page is scraped to find DIV IDs that match certain criteria. That metadata is saved so that it can be replayed to the app later.

- **Manual sign-in field capture** is used if the app vendor *doesn't label the sign-in input fields*. Manual capture is also used if the vendor *renders multiple fields that can't be auto-detected*. Azure Active Directory (Azure AD) can store data for as many fields as there are on the sign-in page, if you tell it where those fields are on the page.

In general, if automatic sign-in field capture doesn't work, try the manual option.

### Automatically capture sign-in fields for an app

To configure password-based SSO by using automatic sign-in field capture, follow these steps:

1. Open the [Azure portal](https://portal.azure.com/). Sign in as a global administrator or co-admin.

2. In the navigation pane on the left side, select **All services** to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** in the Azure AD navigation pane.

5. Select **All Applications** to view a list of your apps.

   > [!NOTE]
   > If you don't see the app that you want, use the **Filter** control at the top of the **All Applications** list. Set the **Show** option to "All Applications."

6. Select the app that you want to configure for SSO.

7. After the app loads, select **Single sign-on** in the navigation pane on the left side.

8. Select **Password-based Sign-on** mode.

9. Enter the **Sign-on URL**, which is the URL of the page where users enter their user name and password to sign in. *Make sure that the sign-in fields are visible on the page for the URL that you provide*.

10. Select **Save**.

    The page is automatically scraped for the user name and password input boxes. You can now use Azure AD to securely transmit passwords to that app by using the Access Panel browser extension.

### Manually capture sign-in fields for an app

To manually capture sign-in fields, you must have the Access Panel browser extension installed. Also, your browser can't be running in *inPrivate*, *incognito*, or *private* mode.

To install the extension, see the [Install the Access Panel Browser extension](#install-the-access-panel-browser-extension) section of this article.

To configure password-based SSO for an app by using manual sign-in field capture, follow these steps:

1. Open the [Azure portal](https://portal.azure.com/). Sign in as a global administrator or co-admin.

2. In the navigation pane on the left side, select **All services** to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** in the Azure AD navigation pane.

5. Select **All Applications** to view a list of your apps.

   > [!NOTE] 
   > If you don't see the app that you want, use the **Filter** control at the top of the **All Applications** list. Set the **Show** option to "All Applications."

6. Select the app that you want to configure for SSO.

7. After the app loads, select **Single sign-on** in the navigation pane on the left side.

8. Select **Password-based Sign-on** mode.

9. Enter the **Sign-on URL**, which is the page where users enter their user name and password to sign in. *Make sure that the sign-in fields are visible on the page for the URL that you provide*.

10. Select **Configure *&lt;appname&gt;* Password Single Sign-on Settings**.

11. Select **Manually detect sign-in fields**.

14. Select **Ok**.

15. Select **Save**.

16. Follow the instructions to use Access Panel.

## Troubleshoot problems

### I get a “We couldn’t find any sign-in fields at that URL” error

You get this error message when automatic detection of sign-in fields fails. To resolve the issue, try manual sign-in field detection. See the [Manually capture sign-in fields for an application](#manually-capture-sign-in-fields-for-an-app) section of this article.

### I get an “Unable to save single sign-on configuration” error

Rarely, updating the SSO configuration fails. To resolve this problem, try saving the configuration again.

If you keep getting the error, open a support case. Include the information that's described in the [View portal notification details](#view-portal-notification-details) and [Send notification details to a support engineer to get help](#send-notification-details-to-a-support-engineer-to-get-help) sections of this article.

### I can't manually detect sign-in fields for my app

You might observe the following behaviors when manual detection isn't working:

- The manual capture process appeared to work, but the captured fields aren't correct.

- The correct fields don’t get highlighted when the capture process runs.

- The capture process takes you to the app’s sign-in page as expected, but nothing happens.

- Manual capture appears to work, but SSO doesn’t happen when users navigate to the app from Access Panel.

If you experience any of these problems, do the following things:

- Make sure that you have the latest version of the Access Panel browser extension *installed and enabled*. See the [Install the Access Panel browser extension](#install-the-access-panel-browser-extension) section of this article.

- Make sure that your browser isn't in *incognito*, *inPrivate*, or *Private* mode during the capture process. The Access Panel extension isn't supported in these modes.

- Make sure that your users aren't trying to sign in to the app from Access Panel while in *incognito*, *inPrivate*, or *Private mode*.

- Try the manual capture process again. Make sure that the red markers are over the correct fields.

- If the manual capture process seems to stop responding or the sign-in page doesn’t respond, try the manual capture process again. But this time, after completing the process, press the F12 key to open your browser’s developer console. Select the **console** tab. Type **window.location="*&lt;the sign-in URL that you specified when configuring the app&gt;*"**, and then press Enter. This forces a page redirect that ends the capture process and stores the fields that were captured.

### Contact support

If you still have problems, open a case with Microsoft Support. Describe what you tried. Include the details that are described in the [View portal notification details](#view-portal-notification-details) and [Send notification details to a support engineer to get help](#send-notification-details-to-a-support-engineer-to-get-help) sections of this article (if applicable).

## Install the Access Panel browser extension

Follow these steps:

1. Open [Access Panel](https://myapps.microsoft.com) in a supported browser. Sign in to Azure AD as a *user*.

2. Select **password-SSO application** in Access Panel.

3. When you're prompted to install the software, select **Install Now**.

4. You'll be directed to a download page for your browser. Choose to **Add** the extension.

5. If you're prompted, select **Enable** or **Allow**.

6. After the installation, restart your browser.

7. Sign in to Access Panel. See if you can open your password-SSO-enabled apps.

You can also directly download the browser extension for Chrome and Firefox through these links:

-   [Chrome Access Panel extension](https://chrome.google.com/webstore/detail/access-panel-extension/ggjhpefgjjfobnfoldnjipclpcfbgbhl)

-   [Firefox Access Panel extension](https://addons.mozilla.org/firefox/addon/access-panel-extension/)

## View portal notification details

To see the details of any portal notification, follow these steps:

1. Select the **Notifications** icon (the bell) in the upper-right corner of the Azure portal.

2. Select any notification that shows an *Error* state. (They have a red "!".)

   > [!NOTE]
   > You can't select notifications that are in the *Successful* or *In Progress* state.

3. The **Notification Details** pane opens. Read the information to learn about the problem.

5. If you still need help, share the information with a support engineer or the product group. Select the **copy** icon to the right of the **Copy error** box to copy the notification details to share.

## Send notification details to a support engineer to get help

It's important that you share *all* the details that are listed in this section with support so that they can help you quickly. To record it, you can take a screenshot or select **Copy error**.

The following information explains what each notification item means and provides examples.

### Essential notification items

- **Title**: the descriptive title of the notification.

   Example: *Application proxy settings*

- **Description**: what occurred as a result of the operation.

   Example: *Internal URL entered is already being used by another application.*

- **Notification ID**: the unique ID of the notification.

    Example: *clientNotification-2adbfc06-2073-4678-a69f-7eb78d96b068*

- **Client Request ID**: the specific request ID that your browser made.

    Example: *302fd775-3329-4670-a9f3-bea37004f0bc*

- **Time Stamp UTC**: the timestamp of when the notification occurred, in UTC.

    Example: *2017-03-23T19:50:43.7583681Z*

- **Internal Transaction ID**: the internal ID that's used to look up the error in our systems.

    Example: **71a2f329-ca29-402f-aa72-bc00a7aca603**

- **UPN**: The user who ran the operation.

    Example: *tperkins\@f128.info*

- **Tenant ID**: the unique ID of the tenant that the user who ran the operation is a member of.

    Example: *7918d4b5-0442-4a97-be2d-36f9f9962ece*

- **User object ID**: The unique ID of the user who ran the operation.

    Example: *17f84be4-51f8-483a-b533-383791227a99*

### Detailed notification items

- **Display Name**: (can be empty) a more-detailed display name for the error.

    Example: *Application proxy settings*

- **Status**: the specific status of the notification.

    Example: *Failed*

- **Object ID**: (can be empty) the object ID against which the operation was run.

   Example: *8e08161d-f2fd-40ad-a34a-a9632d6bb599*

- **Details**: the detailed description of what occurred as a result of the operation.

    Example: *Internal url '<https://bing.com/>' is invalid since it is already in use.*

- **Copy error**: Enables you to select the **copy icon** to the right of the **Copy error** textbox to copy the notification details to help with support.

    Example: 
    ```{"errorCode":"InternalUrl\_Duplicate","localizedErrorDetails":{"errorDetail":"Internal url 'https://google.com/' is invalid since it is already in use"},"operationResults":\[{"objectId":null,"displayName":null,"status":0,"details":"Internal url 'https://bing.com/' is invalid since it is already in use"}\],"timeStampUtc":"2017-03-23T19:50:26.465743Z","clientRequestId":"302fd775-3329-4670-a9f3-bea37004f0bb","internalTransactionId":"ea5b5475-03b9-4f08-8e95-bbb11289ab65","upn":"tperkins@f128.info","tenantId":"7918d4b5-0442-4a97-be2d-36f9f9962ece","userObjectId":"17f84be4-51f8-483a-b533-383791227a99"}```

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)
