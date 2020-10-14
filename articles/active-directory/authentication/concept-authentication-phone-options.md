---
title: Phone authentication methods - Azure Active Directory
description: Learn about using phone authentication methods in Azure Active Directory to help improve and secure sign-in events

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/02/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to understand how to use phone authentication methods in Azure AD to improve and secure user sign-in events.
---
# Authentication methods in Azure Active Directory - phone options

For direct authentication using text message, you can [Configure and enable users for SMS-based authentication(preview)](howto-authentication-sms-signin.md). SMS-based sign-in is great for front-line workers. With SMS-based sign-in, users don't need to know a username and password to access applications and services. The user instead enters their registered mobile phone number, receives a text message with a verification code, and enters that in the sign-in interface.

Users can also verify themselves using a mobile phone or office phone as secondary form of authentication used during Azure Multi-Factor Authentication or self-service password reset (SSPR).

To work properly, phone numbers must be in the format *+CountryCode PhoneNumber*, for example, *+1 4251234567*.

> [!NOTE]
> There needs to be a space between the country/region code and the phone number.
>
> Password reset doesn't support phone extensions. Even in the *+1 4251234567X12345* format, extensions are removed before the call is placed.

## Mobile phone verification

For Azure Multi-Factor Authentication or SSPR, users can choose to receive a text message with a verification code to enter in the sign-in interface, or receive a phone call with a prompt to enter their defined pin code.

If users don't want their mobile phone number to be visible in the directory but want to use it for password reset, administrators shouldn't populate the phone number in the directory. Instead, users should populate their **Authentication Phone** attribute via the combined security info registration at [https://aka.ms/setupsecurityinfo](https://aka.ms/setupsecurityinfo). Administrators can see this information in the user's profile, but it's not published elsewhere.

![Screenshot of the Azure portal that shows authentication methods with a phone number populated](media/concept-authentication-methods/user-authentication-methods.png)

Microsoft doesn't guarantee consistent SMS or voice-based Azure Multi-Factor Authentication prompt delivery by the same number. In the interest of our users, we may add or remove short codes at any time as we make route adjustments to improve SMS deliverability. Microsoft doesn't support short codes for countries / regions besides the United States and Canada.

### Text message verification

With text message verification during SSPR or Azure Multi-Factor Authentication, an SMS is sent to the mobile phone number containing a verification code. To complete the sign-in process, the verification code provided is entered into the sign-in interface.

### Phone call verification

With phone call verification during SSPR or Azure Multi-Factor Authentication, an automated voice call is made to the phone number registered by the user. To complete the sign-in process, the user is prompted to enter their pin number followed by # on their keypad.

## Office phone verification

The office phone attribute is managed by the Azure AD administrator and can't be registered by a user themselves.

With phone call verification during SSPR or Azure Multi-Factor Authentication, an automated voice call is made to the phone number registered by the user. To complete the sign-in process, the user is prompted to enter their pin number followed by # on their keypad.

## Troubleshooting phone options

If you have problems with phone authentication for Azure AD, review the following troubleshooting steps:

* Blocked caller ID on a single device.
   * Review any blocked numbers configured on the device.
* Wrong phone number or incorrect country/region code, or confusion between personal phone number versus work phone number.
   * Troubleshoot the user object and configured authentication methods. Make sure that the correct phone numbers are registered.
* Wrong PIN entered.
   * Confirm the user has used the correct PIN as registered for their account.
* Call forwarded to voicemail.
   * Ensure that the user has their phone turned on and that service is available in their area, or use alternate method.
* User is blocked
   * Have an Azure AD administrator unblock the user in the Azure portal.
* SMS is not subscribed on the device.
   * Have the user change methods or activate SMS on the device.
* Faulty telecom providers such as no phone input detected, missing DTMF tones issues, blocked caller ID on multiple devices, or blocked SMS across multiple devices.
   * Microsoft uses multiple telecom providers to route phone calls and SMS messages for authentication. If you see any of the above issues, have a user attempt to use the method at least five times within 5 minutes and have that user's information available when contacting Microsoft support.

## Next steps

To get started, see the [tutorial for self-service password reset (SSPR)][tutorial-sspr] and [Azure Multi-Factor Authentication][tutorial-azure-mfa].

To learn more about SSPR concepts, see [How Azure AD self-service password reset works][concept-sspr].

To learn more about MFA concepts, see [How Azure Multi-Factor Authentication works][concept-mfa].

Learn more about configuring authentication methods using the [Microsoft Graph REST API beta](/graph/api/resources/authenticationmethods-overview?view=graph-rest-beta).

<!-- INTERNAL LINKS -->
[tutorial-sspr]: tutorial-enable-sspr.md
[tutorial-azure-mfa]: tutorial-enable-azure-mfa.md
[concept-sspr]: concept-sspr-howitworks.md
[concept-mfa]: concept-mfa-howitworks.md
