---
title: Phone authentication methods
description: Learn about using phone authentication methods in Microsoft Entra ID to help improve and secure sign-in events

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/23/2023

ms.author: justinha
author: justinha
manager: amycolannino

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to understand how to use phone authentication methods in Microsoft Entra ID to improve and secure user sign-in events.
---

# Authentication methods in Microsoft Entra ID - phone options

Microsoft recommends users move away from using text messages or voice calls for multifactor authentication. Modern authentication methods like [Microsoft Authenticator](concept-authentication-authenticator-app.md) are a recommended alternative. For more information, see [It's Time to Hang Up on Phone Transports for Authentication](https://aka.ms/hangup). Users can still verify themselves using a mobile phone or office phone as secondary form of authentication used for multifactor authentication or self-service password reset (SSPR).

You can [configure and enable users for SMS-based authentication](howto-authentication-sms-signin.md) for direct authentication using text message. Text messages are convenient for Frontline workers. With text messages, users don't need to know a username and password to access applications and services. The user instead enters their registered mobile phone number, receives a text message with a verification code, and enters that in the sign-in interface.

>[!NOTE]
>Phone call verification isn't available for Microsoft Entra tenants with trial subscriptions. For example, if you sign up for a trial license Microsoft Enterprise Mobility and Security (EMS), phone call verification isn't available. Phone numbers must be provided in the format *+CountryCode PhoneNumber*, for example, *+1 4251234567*. There must be a space between the country/region code and the phone number.

## Mobile phone verification

For Microsoft Entra multifactor authentication or SSPR, users can choose to receive a text message with a verification code to enter in the sign-in interface, or receive a phone call.

If users don't want their mobile phone number to be visible in the directory but want to use it for password reset, administrators shouldn't populate the phone number in the directory. Instead, users should populate their **Authentication Phone** at [My Sign-Ins](https://aka.ms/setupsecurityinfo). Administrators can see this information in the user's profile, but it's not published elsewhere.

:::image type="content" source="media/concept-authentication-methods/user-authentication-methods.png" alt-text="Screenshot of the Microsoft Entra admin center that shows authentication methods with a phone number populated":::

> [!NOTE]
> Phone extensions are supported only for office phones.

Microsoft doesn't guarantee consistent text message or voice-based Microsoft Entra multifactor authentication prompt delivery by the same number. In the interest of our users, we may add or remove short codes at any time as we make route adjustments to improve text message deliverability. Microsoft doesn't support short codes for countries/regions besides the United States and Canada.

> [!NOTE]
> We apply delivery method optimizations such that tenants with a free or trial subscription may receive a text message or voice call.

### Text message verification

With text message verification during SSPR or Microsoft Entra multifactor authentication, a text message is sent to the mobile phone number containing a verification code. To complete the sign-in process, the verification code provided is entered into the sign-in interface. 

Text messages can be sent over channels such as Short Message Service (SMS), Rich Communication Services (RCS), or WhatsApp.

Android users can enable RCS on their devices. RCS offers encryption and other improvements over SMS. For Android, MFA text messages may be sent over RCS rather than SMS. The MFA text message is similar to SMS, but RCS messages have more Microsoft branding and a verified checkmark so users know they can trust the message.

:::image type="content" source="media/concept-authentication-methods/brand.png" alt-text="Screenshot of Microsoft branding in RCS messages.":::

Some users with phone numbers that have country codes belonging to India, Indonesia, and New Zealand may receive their verification codes in WhatsApp. Like RCS, these messages are similar to SMS, but have more Microsoft branding and a verified checkmark. Only users that have WhatsApp receive verification codes via this channel. To check if a user has WhatsApp, we silently try to deliver them a message in the app by using the phone number they registered for text message verification. If users don't have any internet connectivity or uninstall WhatsApp, they'll receive SMS verification codes. The phone number associated with Microsoft's WhatsApp Business Agent is: *+1 (217) 302 1989*.

:::image type="content" border="true" source="media/concept-authentication-methods/code.png" alt-text="Screenshot of confirmation.":::

### Phone call verification

With phone call verification during SSPR or Microsoft Entra multifactor authentication, an automated voice call is made to the phone number registered by the user. To complete the sign-in process, the user is prompted to press # on their keypad.

The calling number that a user receives the voice call from differs for each country. See [phone call settings](howto-mfa-mfasettings.md#phone-call-settings) to view all possible voice call numbers.

## Office phone verification

With office phone call verification during SSPR or Microsoft Entra multifactor authentication, an automated voice call is made to the phone number registered by the user. To complete the sign-in process, the user is prompted to press # on their keypad. 

## Troubleshooting phone options

If you have problems with phone authentication for Microsoft Entra ID, review the following troubleshooting steps:

* "You've hit our limit on verification calls" or "You've hit our limit on text verification codes" error messages during sign-in
   * Microsoft may limit repeated authentication attempts that are performed by the same user or organization in a short period of time. This limitation doesn't  apply to Microsoft Authenticator or verification codes. If you have hit these limits, you can use the Authenticator App, verification code or try to sign in again in a few minutes.
* "Sorry, we're having trouble verifying your account" error message during sign-in
   * Microsoft may limit or block voice or text message authentication attempts that are performed by the same user, phone number, or organization due to high number of voice or text message authentication attempts. If you experience this error, you can try another method, such as Authenticator or verification code, or reach out to your admin for support.
* Blocked caller ID on a single device.
   * Review any blocked numbers configured on the device.
* Wrong phone number or incorrect country/region code, or confusion between personal phone number versus work phone number.
   * Troubleshoot the user object and configured authentication methods. Make sure that the correct phone numbers are registered.
* Wrong PIN entered.
   * Confirm the user has used the correct PIN as registered for their account (MFA Server users only).
* Call forwarded to voicemail.
   * Ensure that the user has their phone turned on and that service is available in their area, or use alternate method.
* User is blocked
   * Have a Microsoft Entra administrator unblock the user in the Microsoft Entra admin center.
* Text messaging platforms like SMS, RCS, or WhatsApp aren't subscribed on the device.
   * Have the user change methods or activate a text messaging platform on the device.
* Faulty telecom providers, such as when no phone input is detected, missing DTMF tones issues, blocked caller ID on multiple devices, or blocked text messages across multiple devices.
   * Microsoft uses multiple telecom providers to route phone calls and text messages for authentication. If you see any of these issues, have a user attempt to use the method at least five times within 5 minutes and have that user's information available when contacting Microsoft support.
*  Poor signal quality.
   * Have the user attempt to log in using a wi-fi connection by installing the Authenticator app.
   * Or use a text message instead of phone (voice) authentication.

* Phone number is blocked and unable to be used for Voice MFA 

   - There are a few country codes blocked for voice MFA unless your Microsoft Entra administrator has opted in for those country codes. Have your Microsoft Entra administrator opt-in to receive MFA for those country codes. 

   - Or, use Microsoft Authenticator instead of voice authentication.

## Next steps

To get started, see the [tutorial for self-service password reset (SSPR)][tutorial-sspr] and [Microsoft Entra multifactor authentication][tutorial-azure-mfa].

To learn more about SSPR concepts, see [How Microsoft Entra self-service password reset works][concept-sspr].

To learn more about MFA concepts, see [How Microsoft Entra multifactor authentication works][concept-mfa].

Learn more about configuring authentication methods using the [Microsoft Graph REST API](/graph/api/resources/authenticationmethods-overview).

<!-- INTERNAL LINKS -->
[tutorial-sspr]: tutorial-enable-sspr.md

[tutorial-azure-mfa]: tutorial-enable-azure-mfa.md

[concept-sspr]: concept-sspr-howitworks.md

[concept-mfa]: concept-mfa-howitworks.md
