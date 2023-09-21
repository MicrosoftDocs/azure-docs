---
title: Troubleshoot password-based single sign-on
description: Troubleshoot issues with a Microsoft Entra app that's configured for password-based single sign-on.
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/07/2023
ms.author: jomondi
ms.reviewer: alamaral
ms.custom: enterprise-apps
---

# Troubleshoot password-based single sign-on

To use password-based single sign-on (SSO) in My Apps, the browser extension must be installed. The extension downloads automatically when you select an app that's configured for password-based SSO. To learn about using My Apps from an end-user perspective, see [My Apps portal help](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## My Apps browser extension not installed

Make sure the browser extension is installed. To learn more, see [Plan a Microsoft Entra My Apps deployment](./myapps-overview.md).

## Single sign-on not configured

Make sure password-based single sign-on is configured. To learn more, see [Configure password-based single sign-on](configure-password-single-sign-on-non-gallery-applications.md).

## Users not assigned

Make sure the user is assigned to the app. To learn more, see [Assign a user or group to an app](assign-user-or-group-access-portal.md).

## Credentials are filled in, but the extension does not submit them

This problem typically happens if the application vendor has changed their sign-in page recently to add a field, changed an identifier used for detecting the username and password fields, or modified how the sign-in experience works for their application. Fortunately, in many instances, Microsoft can work with application vendors to rapidly resolve these issues.

While Microsoft has technologies to automatically detect when integrations break, it might not be possible to find the issues right away, or the issues take some time to fix. In the case when one of these integrations does not work correctly, open a support case so it can be fixed as quickly as possible.

**If you are in contact with this application’s vendor,** send them our way so Microsoft can work with them to natively integrate their application with Microsoft Entra ID. You can send the vendor to the [Listing your application in the Microsoft Entra application gallery](../manage-apps/v2-howto-app-gallery-listing.md) to get them started.

## Credentials are filled in and submitted, but the page indicates the credentials are incorrect

To resolve this issue, first try these things:

- Have the user first try to **sign in to the application website directly** with the credentials stored for them.

  - If sign-in works, then have the user click the **Update credentials** button on the **Application Tile** in the **Apps** section of [My Apps](https://myapps.microsoft.com/) to update them to the latest known working username and password.

  - If you, or another administrator assigned the credentials for this user, find the user or group’s application assignment by navigating to the **Users & Groups** tab of the application, selecting the assignment and clicking the **Update Credentials** button.

- If the user assigned their own credentials, have the user **check to be sure that their password has not expired in the application** and if so, **update their expired password** by signing in to the application directly.

  - After the password has been updated in the application, request the user to click the **Update credentials** button on the **Application Tile** in the **Apps** section of [My Apps](https://myapps.microsoft.com/) to update them to the latest known working username and password.

  - If you, or another administrator assigned the credentials for this user, find the user or group’s application assignment by navigating to the **Users & Groups** tab of the application, selecting the assignment and clicking the **Update Credentials** button.

- Ensure that the My Apps browser extension is running and enabled in your user’s browser.

- Ensure that your users are not trying to sign in to the application from My Apps while in **incognito, inPrivate, or Private mode**. The My Apps extension is not supported in these modes.

In case the previous suggestions do not work, it could be the case that a change has occurred on the application side that has temporarily broken the application’s integration with Microsoft Entra ID. For example, this can occur when the application vendor introduces a script on their page which behaves differently for manual vs automated input, which causes automated integration, like our own, to break. Fortunately, in many instances, Microsoft can work with application vendors to rapidly resolve these issues.

While Microsoft has technologies to automatically detect when application integrations break, it might not be possible to find the issues right away, or the issues might take some time to fix. When an integration does not work correctly, you can open a support case to get it fixed as quickly as possible.

In addition to this, **if you are in contact with this application’s vendor,** **send them our way** so we can work with them to natively integrate their application with Microsoft Entra ID. You can send the vendor to the [Listing your application in the Microsoft Entra application gallery](../manage-apps/v2-howto-app-gallery-listing.md) to get them started.

## Check if the application’s login page has changed recently or requires an additional field

If the application’s login page has changed drastically, sometimes this causes our integrations to break. An example of this is when an application vendor adds a sign-in field, a captcha, or multi-factor authentication to their experiences. Fortunately, in many instances, Microsoft can work with application vendors to rapidly resolve these issues.

While Microsoft has technologies to automatically detect when application integrations break, it might not be possible to find the issues right away, or the issues might take some time to fix. When an integration does not work correctly, you can open a support case to get it fixed as quickly as possible.

In addition to this, **if you are in contact with this application’s vendor,** **send them our way** so we can work with them to natively integrate their application with Microsoft Entra ID. You can send the vendor to the [Listing your application in the Microsoft Entra application gallery](../manage-apps/v2-howto-app-gallery-listing.md) to get them started.

## Capture sign-in fields for an app

Sign-in field capture is supported only for HTML-enabled sign-in pages. It's not supported for non-standard sign-in pages, like those that use Adobe Flash or other non-HTML-enabled technologies.

There are two ways to capture sign-in fields for your custom apps:

- **Automatic sign-in field capture** works well with most HTML-enabled sign-in pages, *if they use well-known DIV IDs* for the user name and password fields. The HTML on the page is scraped to find DIV IDs that match certain criteria. That metadata is saved so that it can be replayed to the app later.

- **Manual sign-in field capture** is used if the app vendor *doesn't label the sign-in input fields*. Manual capture is also used if the vendor *renders multiple fields that can't be auto-detected*. Microsoft Entra ID can store data for as many fields as there are on the sign-in page, if you tell it where those fields are on the page.

In general, if automatic sign-in field capture doesn't work, try the manual option.

[!INCLUDE [portal updates](../includes/portal-update.md)]

### Automatically capture sign-in fields for an app

To configure password-based SSO by using automatic sign-in field capture, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
1. Select the app that you want to configure for SSO.
1. After the app loads, select **Single sign-on** in the navigation pane on the left side.
1. Select **Password-based Sign-on** mode.
1. Enter the **Sign-on URL**, which is the URL of the page where users enter their user name and password to sign in. *Make sure that the sign-in fields are visible on the page for the URL that you provide*.
1. Select **Save**.
    The page is automatically scraped for the user name and password input boxes. You can now use Microsoft Entra ID to securely transmit passwords to that app by using the My Apps browser extension.

### Manually capture sign-in fields for an app

To manually capture sign-in fields, you must have the My Apps browser extension installed. Also, your browser can't be running in *inPrivate*, *incognito*, or *private* mode.

To configure password-based SSO for an app by using manual sign-in field capture, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
1. Select the app that you want to configure for SSO.
1. After the app loads, select **Single sign-on** in the navigation pane on the left side.
1. Select **Password-based Sign-on** mode.
1. Enter the **Sign-on URL**, which is the page where users enter their user name and password to sign in. *Make sure that the sign-in fields are visible on the page for the URL that you provide*.
1. Select **Configure *&lt;appname&gt;* Password Single Sign-on Settings**.
1. Select **Manually detect sign-in fields**.
1. Select **Ok**.
1. Select **Save**.
1. Follow the instructions to use My Apps.

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
- Manual capture appears to work, but SSO doesn’t happen when users navigate to the app from My Apps.

If you experience any of these problems, do the following things:

- Make sure that you have the latest version of the My Apps browser extension *installed and enabled*.
- Make sure that your browser isn't in *incognito*, *inPrivate*, or *Private* mode during the capture process. The My Apps extension isn't supported in these modes.
- Make sure that your users aren't trying to sign in to the app from My Apps while in *incognito*, *inPrivate*, or *Private mode*.
- Try the manual capture process again. Make sure that the red markers are over the correct fields.
- If the manual capture process seems to stop responding or the sign-in page doesn’t respond, try the manual capture process again. But this time, after completing the process, press the F12 key to open your browser’s developer console. Select the **console** tab. Type **window.location="*&lt;the sign-in URL that you specified when configuring the app&gt;*"**, and then press Enter. This forces a page redirect that ends the capture process and stores the fields that were captured.

### I can't add another user to my password-based SSO app

A user cannot have more than 48 credentials configured across all password SSO apps where the user is directly assigned.

If you want to add more apps with password-based SSO to a user, consider assigning the app to a group the user is a direct member of, and configuring the credential for the group. Note that the credentials configured for the group will be available for all members of the group.

### I can't add another group to my password-based SSO app

Each password-based SSO app has a limit of 48 groups which are assigned and have had credentials configured for them. If you want to add additional groups, you can either:

- Add additional instance of the app
- Remove groups who are no longer using the app

## Request support

If you get an error message when you set up SSO and assign users, open a support ticket. Include as much of the following information as possible:

- Correlation error ID
- UPN (user email address)
- TenantID
- Browser type
- Time zone and time/time frame when the error occurred
- Fiddler traces

### View portal notification details

To see the details of any portal notification, follow these steps:

1. Select the **Notifications** icon (the bell) in the upper-right corner of the Microsoft Entra admin center.
2. Select any notification that shows an **Error** state. (They have a red "!".)
   > [!NOTE]
   > You can't select notifications that are in the *Successful* or *In Progress* state.
3. The **Notification Details** pane opens. Read the information to learn about the problem.
4. If you still need help, share the information with a support engineer or the product group. Select the **copy** icon to the right of the **Copy error** box to copy the notification details to share.

### Send notification details to a support engineer to get help

It's important that you share *all* the details that are listed in this section with support so that they can help you quickly. To record it, you can take a screenshot or select **Copy error**.

The following information explains what each notification item means and provides examples.

#### Essential notification items

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

#### Detailed notification items

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
    
    `{"errorCode":"InternalUrl\_Duplicate","localizedErrorDetails":{"errorDetail":"Internal url 'https://google.com/' is invalid since it is already in use"},"operationResults":\[{"objectId":null,"displayName":null,"status":0,"details":"Internal url 'https://bing.com/' is invalid since it is already in use"}\],"timeStampUtc":"2017-03-23T19:50:26.465743Z","clientRequestId":"302fd775-3329-4670-a9f3-bea37004f0bb","internalTransactionId":"ea5b5475-03b9-4f08-8e95-bbb11289ab65","upn":"tperkins@f128.info","tenantId":"7918d4b5-0442-4a97-be2d-36f9f9962ece","userObjectId":"17f84be4-51f8-483a-b533-383791227a99"}`

## Next steps

- [Quickstart Series on Application Management](view-applications-portal.md)
- [Plan a My Apps deployment](./myapps-overview.md)
