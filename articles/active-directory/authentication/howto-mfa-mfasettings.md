---
title: Configure Azure Multi-Factor Authentication - Azure Active Directory
description: Learn how to configure settings for Azure Multi-Factor Authentication in the Azure portal

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 05/11/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
ms.custom: contperfq4
---
# Configure Azure Multi-Factor Authentication settings

This article helps you to manage Multi-Factor Authentication settings in the Azure portal. It covers various topics that help you to get the most out of Azure Multi-Factor Authentication. Not all of the features are available in every version of Azure Multi-Factor Authentication.

You can access settings related to Azure Multi-Factor Authentication from the Azure portal by browsing to **Azure Active Directory** > **Security** > **MFA**.

![Azure portal - Azure AD Multi-Factor Authentication settings](./media/howto-mfa-mfasettings/multi-factor-authentication-settings-portal.png)

## Settings

| Feature | Description |
| ------- | ----------- |
| Account lockout | Temporarily lock accounts in the multi-factor authentication service if there are too many denied authentication attempts in a row. This feature only applies to users who enter a PIN to authenticate. (MFA Server) |
| [Block/unblock users](#block-and-unblock-users) | Used to block specific users from being able to receive Multi-Factor Authentication requests. Any authentication attempts for blocked users are automatically denied. Users remain blocked for 90 days from the time that they are blocked. |
| [Fraud alert](#fraud-alert) | Configure settings related to users ability to report fraudulent verification requests |
| [Notifications](#notifications) | Enable notifications of events from MFA Server. |
| [OATH tokens](concept-authentication-methods.md#oath-tokens) | Used in cloud-based Azure MFA environments to manage OATH tokens for users. |
| [Phone call settings](#phone-call-settings) | Configure settings related to phone calls and greetings for cloud and on-premises environments. |
| Providers | This will show any existing authentication providers that you may have associated with your account. New authentication providers may not be created as of September 1, 2018 |

## Account lockout

## Block and unblock users

Use the _block and unblock users_ feature to prevent users from receiving authentication requests. Any authentication attempts for blocked users are automatically denied. Users remain blocked for 90 days from the time that they are blocked.

### Block a user

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Browse to **Azure Active Directory** > **Security** > **MFA** > **Block/unblock users**.
3. Select **Add** to block a user.
4. Select the **Replication Group**. Enter the username for the blocked user as **username\@domain.com**. Enter a comment in the **Reason** field.
5. Select **Add** to finish blocking the user.

### Unblock a user

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Browse to **Azure Active Directory** > **Security** > **MFA** > **Block/unblock users**.
3. Select **Unblock** in the **Action** column next to the user to unblock.
4. Enter a comment in the **Reason for unblocking** field.
5. Select **Unblock** to finish unblocking the user.

## Fraud alert

Configure the _fraud alert_ feature so that your users can report fraudulent attempts to access their resources. Users can report fraud attempts by using the mobile app or through their phone.

### Turn on fraud alerts

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Browse to **Azure Active Directory** > **Security** > **MFA** > **Fraud alert**.
3. Set the **Allow users to submit fraud alerts** setting to **On**.
4. Select **Save**.

### Configuration options

* **Block user when fraud is reported**: If a user reports fraud, their account is blocked for 90 days or until an administrator unblocks their account. An administrator can review sign-ins by using the sign-in report, and take appropriate action to prevent future fraud. An administrator can then [unblock](#unblock-a-user) the user's account.
* **Code to report fraud during initial greeting**: When users receive a phone call to perform two-step verification, they normally press **#** to confirm their sign-in. To report fraud, the user enters a code before pressing **#**. This code is **0** by default, but you can customize it.

   >[!NOTE]
   >The default voice greetings from Microsoft instruct users to press **0#** to submit a fraud alert. If you want to use a code other than **0**, record and upload your own custom voice greetings with appropriate instructions for your users.
   >

### View fraud reports

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Azure Active Directory** > **Sign-ins** > **Authentication Details**. The fraud report is now part of the standard Azure AD Sign-ins report and it will show in the **"Result Detail"** as MFA denied, Fraud Code Entered.
 
## Notifications

Configure email addresses here for users who will receive fraud alert emails in **Azure Active Directory** > **Security** > **Multi-Factor Authentication** > **Notifications**.

![Notification fraud alert email sample](./media/howto-mfa-mfasettings/multi-factor-authentication-fraud-alert-email.png)

## OATH tokens



## Phone call settings

### Caller ID

**MFA caller ID number** - This is the number your users will see on their phone. Only US-based numbers are allowed.

>[!NOTE]
>When Multi-Factor Authentication calls are placed through the public telephone network, sometimes they are routed through a carrier that doesn't support caller ID. Because of this, caller ID is not guaranteed, even though the Multi-Factor Authentication system always sends it.

In the United States, if you haven't configured MFA Caller ID, voice calls from Microsoft come from the following numbers: +1 (866) 539 4191, +1 (855) 330 8653, and +1 (877) 668 6536. If using spam filters, make sure to exclude these numbers.

### Custom voice messages

You can use your own recordings or greetings for two-step verification with the _custom voice messages_ feature. These messages can be used in addition to or to replace the Microsoft recordings.

Before you begin, be aware of the following restrictions:

* The supported file formats are .wav and .mp3.
* The file size limit is 1 MB.
* Authentication messages should be shorter than 20 seconds. Messages that are longer than 20 seconds can cause the verification to fail. The user might not respond before the message finishes and the verification times out.

### Custom message language behavior

When a custom voice message is played to the user, the language of the message depends on these factors:

* The language of the current user.
  * The language detected by the user's browser.
  * Other authentication scenarios may behave differently.
* The language of any available custom messages.
  * This language is chosen by the administrator, when a custom message is added.

For example, if there is only one custom message, with a language of German:

* A user who authenticates in the German language will hear the custom German message.
* A user who authenticates in English will hear the standard English message.

### Set up a custom message

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
1. Browse to **Azure Active Directory** > **Security** > **MFA** > **Phone call settings**.
1. Select **Add greeting**.
1. Choose the type of greeting.
1. Choose the language.
1. Select an .mp3 or .wav sound file to upload.
1. Select **Add**.

### Custom voice message defaults

Sample scripts for creating custom messages.

| Message name | Script |
| --- | --- |
| Authentication successful | Your sign in was successfully verified. Goodbye. |
| Extension prompt | Thank you for using Microsoft's sign-in verification system. Please press pound key to continue. |
| Fraud Confirmation | A fraud alert has been submitted. To unblock your account, please contact your company's IT help desk. |
| Fraud greeting (Standard) | Thank you for using Microsoft's sign-in verification system. Please press the pound key to finish your verification. If you did not initiate this verification, someone may be trying to access your account. Please press zero pound to submit a fraud alert. This will notify your company's IT team and block further verification attempts. |
| Fraud reported    A fraud alert has been submitted. | To unblock your account, please contact your company's IT help desk. |
| Activation | Thank you for using the Microsoft's sign-in verification system. Please press the pound key to finish your verification. |
| Authentication denied retry | Verification denied. |
| Retry (Standard) | Thank you for using the Microsoft's sign-in verification system. Please press the pound key to finish your verification. |
| Greeting (Standard) | Thank you for using the Microsoft's sign-in verification system. Please press the pound key to finish your verification. |
| Greeting (PIN) | Thank you for using Microsoft's sign-in verification system. Please enter your PIN followed by the pound key to finish your verification. |
| Fraud greeting (PIN) | Thank you for using Microsoft's sign-in verification system.  Please enter your PIN followed by the pound key to finish your verification. If you did not initiate this verification, someone may be trying to access your account. Please press zero pound to submit a fraud alert. This will notify your company's IT team and block further verification attempts. |
| Retry(PIN) | Thank you for using Microsoft's sign-in verification system. Please enter your PIN followed by the pound key to finish your verification. |
| Extension prompt after digits | If already at this extension, press the pound key to continue. |
| Authentication denied | I'm sorry, we cannot sign you in at this time. Please try again later. |
| Activation greeting (Standard) | Thank you for using the Microsoft's sign-in verification system. Please press the pound key to finish your verification. |
| Activation retry (Standard) | Thank you for using the Microsoft's sign-in verification system. Please press the pound key to finish your verification. |
| Activation greeting (PIN) | Thank you for using Microsoft's sign-in verification system. Please enter your PIN followed by the pound key to finish your verification. |
| Extension prompt before digits | Thank you for using Microsoft's sign-in verification system. Please transfer this call to extension … |

## MFA service settings

Settings for app passwords, trusted IPs, verification options, and remember multi-factor authentication for Azure Multi-Factor Authentication can be found in service settings. Service settings can be accessed from the Azure portal by browsing to **Azure Active Directory** > **Security** > **MFA** > **Getting started** > **Configure** > **Additional cloud-based MFA settings**.

![Azure Multi-Factor Authentication service settings](./media/howto-mfa-mfasettings/multi-factor-authentication-settings-service-settings.png)

> [!NOTE]
> The trusted IPs can include private IP ranges only when you use MFA Server. For cloud-based Azure Multi-Factor Authentication, you can only use public IP address ranges.

## Named locations

The _Trusted IPs_ feature of Azure Multi-Factor Authentication is used by administrators of a managed or federated tenant. The feature bypasses two-step verification for users who sign in from the company intranet. The feature is available with the full version of Azure Multi-Factor Authentication, and not the free version for administrators. For details on how to get the full version of Azure Multi-Factor Authentication, see [Azure Multi-Factor Authentication](multi-factor-authentication.md).

> [!TIP]
> IPv6 ranges are only supported in the [Named location (preview)](../conditional-access/location-condition.md#preview-features) interface.

If your organization deploys the NPS extension to provide MFA to on-premises applications note the source IP address will always appear to be the NPS server the authentication attempt flows through.

| Azure AD tenant type | Trusted IPs feature options |
|:--- |:--- |
| Managed |**Specific range of IP addresses**: Administrators specify a range of IP addresses that can bypass two-step verification for users who sign in from the company intranet. A maximum of 50 Trusted IP ranges can be configured.|
| Federated |**All Federated Users**: All federated users who sign in from inside of the organization can bypass two-step verification. The users bypass verification by using a claim that is issued by Active Directory Federation Services (AD FS).<br/>**Specific range of IP addresses**: Administrators specify a range of IP addresses that can bypass two-step verification for users who sign in from the company intranet. |

The Trusted IPs bypass works only from inside of the company intranet. If you select the **All Federated Users** option and a user signs in from outside the company intranet, the user has to authenticate by using two-step verification. The process is the same even if the user presents an AD FS claim. 

### End-user experience inside of corpnet

When the Trusted IPs feature is disabled, two-step verification is required for browser flows. App passwords are required for older rich client applications.

When the Trusted IPs feature is enabled, two-step verification is *not* required for browser flows. App passwords are *not* required for older rich client applications, provided that the user hasn't created an app password. After an app password is in use, the password remains required. 

### End-user experience outside corpnet

Regardless of whether the Trusted IPs feature is enabled, two-step verification is required for browser flows. App passwords are required for older rich client applications.

### Enable named locations by using Conditional Access

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left, select **Azure Active Directory** > **Security** > **Conditional Access** > **Named locations**.
3. Select **New location**.
4. Enter a name for the location.
5. Select **Mark as trusted location**.
6. Enter the IP Range in CIDR notation like **40.77.182.32/27**.
7. Select **Create**.

### Enable the Trusted IPs feature by using Conditional Access

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left, select **Azure Active Directory** > **Security** >  **Conditional Access** > **Named locations**.
3. Select **Configure MFA trusted IPs**.
4. On the **Service Settings** page, under **Trusted IPs**, choose from any of the following two options:

   * **For requests from federated users originating from my intranet**: To choose this option, select the check box. All federated users who sign in from the corporate network bypass two-step verification by using a claim that is issued by AD FS. Ensure that AD FS has a rule to add the intranet claim to the appropriate traffic. If the rule does not exist, create the following rule in AD FS:

      `c:[Type== "http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork"] => issue(claim = c);`

   * **For requests from a specific range of public IPs**: To choose this option, enter the IP addresses in the text box by using CIDR notation.
      * For IP addresses that are in the range xxx.xxx.xxx.1 through xxx.xxx.xxx.254, use notation like **xxx.xxx.xxx.0/24**.
      * For a single IP address, use notation like **xxx.xxx.xxx.xxx/32**.
      * Enter up to 50 IP address ranges. Users who sign in from these IP addresses bypass two-step verification.

5. Select **Save**.

### Enable the Trusted IPs feature by using service settings

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left, select **Azure Active Directory** > **Users**.
3. Select **Multi-Factor Authentication**.
4. Under Multi-Factor Authentication, select **service settings**.
5. On the **Service Settings** page, under **Trusted IPs**, choose one (or both) of the following two options:

   * **For requests from federated users on my intranet**: To choose this option, select the check box. All federated users who sign in from the corporate network bypass two-step verification by using a claim that is issued by AD FS. Ensure that AD FS has a rule to add the intranet claim to the appropriate traffic. If the rule does not exist, create the following rule in AD FS:

      `c:[Type== "http://schemas.microsoft.com/ws/2012/01/insidecorporatenetwork"] => issue(claim = c);`

   * **For requests from a specified range of IP address subnets**: To choose this option, enter the IP addresses in the text box by using CIDR notation.
      * For IP addresses that are in the range xxx.xxx.xxx.1 through xxx.xxx.xxx.254, use notation like **xxx.xxx.xxx.0/24**.
      * For a single IP address, use notation like **xxx.xxx.xxx.xxx/32**.
      * Enter up to 50 IP address ranges. Users who sign in from these IP addresses bypass two-step verification.

6. Select **Save**.

## Verification methods

You can choose the verification methods that are available for your users. The following table provides a brief overview of the methods.

When your users enroll their accounts for Azure Multi-Factor Authentication, they choose their preferred verification method from the options that you have enabled. Guidance for the user enrollment process is provided in [Set up my account for two-step verification](../user-help/multi-factor-authentication-end-user-first-time.md).

| Method | Description |
|:--- |:--- |
| Call to phone |Places an automated voice call. The user answers the call and presses # in the phone keypad to authenticate. The phone number is not synchronized to on-premises Active Directory. |
| Text message to phone |Sends a text message that contains a verification code. The user is prompted to enter the verification code into the sign-in interface. This process is called one-way SMS. Two-way SMS means that the user must text back a particular code. Two-way SMS is deprecated and not supported after November 14, 2018. Administrators should enable another method for users who previously used two-way SMS.|
| Notification through mobile app |Sends a push notification to your phone or registered device. The user views the notification and selects **Verify** to complete verification. The Microsoft Authenticator app is available for [Windows Phone](https://www.microsoft.com/p/microsoft-authenticator/9nblgggzmcj6), [Android](https://go.microsoft.com/fwlink/?Linkid=825072), and [iOS](https://go.microsoft.com/fwlink/?Linkid=825073). |
| Verification code from mobile app or hardware token |The Microsoft Authenticator app generates a new OATH verification code every 30 seconds. The user enters the verification code into the sign-in interface. The Microsoft Authenticator app is available for [Windows Phone](https://www.microsoft.com/p/microsoft-authenticator/9nblgggzmcj6), [Android](https://go.microsoft.com/fwlink/?Linkid=825072), and [iOS](https://go.microsoft.com/fwlink/?Linkid=825073). |

### Enable and disable verification methods

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left, select **Azure Active Directory** > **Users**.
3. Select **Multi-Factor Authentication**.
4. Under Multi-Factor Authentication, select **service settings**.
5. On the **Service Settings** page, under **verification options**, select/unselect the methods to provide to your users.
6. Click **Save**.

Additional details about the use of authentication methods can be found in the article [What are authentication methods](concept-authentication-methods.md).

## Remember Multi-Factor Authentication

The _remember Multi-Factor Authentication_ feature for devices and browsers that are trusted by the user is a free feature for all Multi-Factor Authentication users. Users can bypass subsequent verifications for a specified number of days, after they've successfully signed-in to a device by using Multi-Factor Authentication. The feature enhances usability by minimizing the number of times a user has to perform two-step verification on the same device.

>[!IMPORTANT]
>If an account or device is compromised, remembering Multi-Factor Authentication for trusted devices can affect security. If a corporate account becomes compromised or a trusted device is lost or stolen, you should [Revoke MFA Sessions](howto-mfa-userdevicesettings.md).
>
>The restore action revokes the trusted status from all devices, and the user is required to perform two-step verification again. You can also instruct your users to restore Multi-Factor Authentication on their own devices with the instructions in [Manage your settings for two-step verification](../user-help/multi-factor-authentication-end-user-manage-settings.md#turn-on-two-factor-verification-prompts-on-a-trusted-device).

### How the feature works

The remember Multi-Factor Authentication feature sets a persistent cookie on the browser when a user selects the **Don't ask again for X days** option at sign-in. The user isn't prompted again for Multi-Factor Authentication from that same browser until the cookie expires. If the user opens a different browser on the same device or clears their cookies, they're prompted again to verify.

The **Don't ask again for X days** option isn't shown on non-browser applications, regardless of whether the app supports modern authentication. These apps use _refresh tokens_ that provide new access tokens every hour. When a refresh token is validated, Azure AD checks that the last two-step verification occurred within the specified number of days.

The feature reduces the number of authentications on web apps, which normally prompt every time. The feature increases the number of authentications for modern authentication clients that normally prompt every 90 days. May also increase the number of authentications when combined with Conditional Access policies.

>[!IMPORTANT]
>The **remember Multi-Factor Authentication** feature is not compatible with the **keep me signed in** feature of AD FS, when users perform two-step verification for AD FS through Azure Multi-Factor Authentication Server or a third-party multi-factor authentication solution.
>
>If your users select **keep me signed in** on AD FS and also mark their device as trusted for Multi-Factor Authentication, the user isn't automatically verified after the **remember multi-factor authentication** number of days expires. Azure AD requests a fresh two-step verification, but AD FS returns a token with the original Multi-Factor Authentication claim and date, rather than performing two-step verification again. **This reaction sets off a verification loop between Azure AD and AD FS.**
>
>The **remember Multi-Factor Authentication** feature is not compatible with B2B users and will not be visible for B2B users when signing into the invited tenants.
>

### Enable remember Multi-Factor Authentication

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left, select **Azure Active Directory** > **Users**.
3. Select **Multi-Factor Authentication**.
4. Under Multi-Factor Authentication, select **service settings**.
5. On the **Service Settings** page, **manage remember multi-factor authentication**, select the **Allow users to remember multi-factor authentication on devices they trust** option.
6. Set the number of days to allow trusted devices to bypass two-step verification. The default is 14 days.
7. Select **Save**.

### Mark a device as trusted

After you enable the remember Multi-Factor Authentication feature, users can mark a device as trusted when they sign in by selecting **Don't ask again**.

## Next steps
