---
title: Azure Multi-Factor Authentication FAQ - Azure Active Directory
description: Frequently asked questions and answers related to Azure Multi-Factor Authentication. 

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 04/13/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Frequently asked questions about Azure Multi-Factor Authentication

This FAQ answers common questions about Azure Multi-Factor Authentication and using the Multi-Factor Authentication service. It's broken down into questions about the service in general, billing models, user experiences, and troubleshooting.

> [!IMPORTANT]
> As of July 1, 2019, Microsoft will no longer offer MFA Server for new deployments. New customers who would like to require multi-factor authentication from their users should use cloud-based Azure Multi-Factor Authentication. Existing customers who have activated MFA Server prior to July 1 will be able to download the latest version, future updates and generate activation credentials as usual.
>
> The information shared below regarding the Azure Multi-Factor Authentication Server is only applicable for users who already have the MFA server running.
>
> Consumption-based licensing is no longer available to new customers effective September 1, 2018.
> Effective September 1, 2018 new auth providers may no longer be created. Existing auth providers may continue to be used and updated. Multi-factor authentication will continue to be an available feature in Azure AD Premium licenses.

## General

* [How does Azure Multi-Factor Authentication Server handle user data?](#how-does-azure-multi-factor-authentication-server-handle-user-data)
* [What SMS short codes are used for sending SMS messages to my users?](#what-sms-short-codes-are-used-for-sending-sms-messages-to-my-users)

### How does Azure Multi-Factor Authentication Server handle user data?

With Multi-Factor Authentication Server, user data is only stored on the on-premises servers. No persistent user data is stored in the cloud. When the user performs two-step verification, Multi-Factor Authentication Server sends data to the Azure Multi-Factor Authentication cloud service for authentication. Communication between Multi-Factor Authentication Server and the Multi-Factor Authentication cloud service uses Secure Sockets Layer (SSL) or Transport Layer Security (TLS) over port 443 outbound.

When authentication requests are sent to the cloud service, data is collected for authentication and usage reports. The following data fields are included in two-step verification logs:

* **Unique ID** (either user name or on-premises Multi-Factor Authentication Server ID)
* **First and Last Name** (optional)
* **Email Address** (optional)
* **Phone Number** (when using a voice call or SMS authentication)
* **Device Token** (when using mobile app authentication)
* **Authentication Mode**
* **Authentication Result**
* **Multi-Factor Authentication Server Name**
* **Multi-Factor Authentication Server IP**
* **Client IP** (if available)

The optional fields can be configured in Multi-Factor Authentication Server.

The verification result (success or denial), and the reason if it was denied, is stored with the authentication data. This data is available in authentication and usage reports.

### What SMS short codes are used for sending SMS messages to my users?

In the United States, we use the following SMS short codes:

* *97671*
* *69829*
* *51789*
* *99399*

In Canada, we use the following SMS short codes:

* *759731*
* *673801*

There's no guarantee of consistent SMS or voice-based Multi-Factor Authentication prompt delivery by the same number. In the interest of our users, we may add or remove short codes at any time as we make route adjustments to improve SMS deliverability. We don't support short codes for countries or regions besides the United States and Canada.

## Billing

Most billing questions can be answered by referring to either the [Multi-Factor Authentication Pricing page](https://azure.microsoft.com/pricing/details/multi-factor-authentication/) or the documentation for [Azure Multi-Factor Authentication versions and consumption plans](concept-mfa-licensing.md).

* [Is my organization charged for sending the phone calls and text messages that are used for authentication?](#is-my-organization-charged-for-sending-the-phone-calls-and-text-messages-that-are-used-for-authentication)
* [Does the per-user billing model charge me for all enabled users, or just the ones that performed two-step verification?](#does-the-per-user-billing-model-charge-me-for-all-enabled-users-or-just-the-ones-that-performed-two-step-verification)
* [How does Multi-Factor Authentication billing work?](#how-does-multi-factor-authentication-billing-work)
* [Is there a free version of Azure Multi-Factor Authentication?](#is-there-a-free-version-of-azure-multi-factor-authentication)
* [Can my organization switch between per-user and per-authentication consumption billing models at any time?](#can-my-organization-switch-between-per-user-and-per-authentication-consumption-billing-models-at-any-time)
* [Can my organization switch between consumption-based billing and subscriptions (a license-based model) at any time?](#can-my-organization-switch-between-consumption-based-billing-and-subscriptions-a-license-based-model-at-any-time)
* [Does my organization have to use and synchronize identities to use Azure Multi-Factor Authentication?](#does-my-organization-have-to-use-and-synchronize-identities-to-use-azure-multi-factor-authentication)

### Is my organization charged for sending the phone calls and text messages that are used for authentication?

No, you're not charged for individual phone calls placed or text messages sent to users through Azure Multi-Factor Authentication. If you use a per-authentication MFA provider, you're billed for each authentication, but not for the method used.

Your users might be charged for the phone calls or text messages they receive, according to their personal phone service.

### Does the per-user billing model charge me for all enabled users, or just the ones that performed two-step verification?

Billing is based on the number of users configured to use Multi-Factor Authentication, regardless of whether they performed two-step verification that month.

### How does Multi-Factor Authentication billing work?

When you create a per-user or per-authentication MFA provider, your organization's Azure subscription is billed monthly based on usage. This billing model is similar to how Azure bills for usage of virtual machines and Web Apps.

When you purchase a subscription for Azure Multi-Factor Authentication, your organization only pays the annual license fee for each user. MFA licenses and Office 365, Azure AD Premium, or Enterprise Mobility + Security bundles are billed this way.

For more information, see [How to get Azure Multi-Factor Authentication](concept-mfa-licensing.md).

### Is there a free version of Azure Multi-Factor Authentication?

Security defaults can be enabled in the Azure AD Free tier. With security defaults, all users are enabled for multi-factor authentication using the Microsoft Authenticator app. There's no ability to use text message or phone verification with security defaults, just the Microsoft Authenticator app.

For more information, see [What are security defaults?](../fundamentals/concept-fundamentals-security-defaults.md)

### Can my organization switch between per-user and per-authentication consumption billing models at any time?

If your organization purchases MFA as a standalone service with consumption-based billing, you choose a billing model when you create an MFA provider. You can't change the billing model after an MFA provider is created. 

If your MFA provider is *not* linked to an Azure AD tenant, or you link the new MFA provider to a different Azure AD tenant, user settings, and configuration options aren't transferred. Also, existing Azure MFA Servers need to be reactivated using activation credentials generated through the new MFA Provider. Reactivating the MFA Servers to link them to the new MFA Provider doesn't impact phone call and text message authentication, but mobile app notifications will stop working for all users until they reactivate the mobile app.

Learn more about MFA providers in [Getting started with an Azure Multi-Factor Auth Provider](concept-mfa-authprovider.md).

### Can my organization switch between consumption-based billing and subscriptions (a license-based model) at any time?

In some instances, yes.

If your directory has a *per-user* Azure Multi-Factor Authentication provider, you can add MFA licenses. Users with licenses aren't be counted in the per-user consumption-based billing. Users without licenses can still be enabled for MFA through the MFA provider. If you purchase and assign licenses for all your users configured to use Multi-Factor Authentication, you can delete the Azure Multi-Factor Authentication provider. You can always create another per-user MFA provider if you have more users than licenses in the future.

If your directory has a *per-authentication* Azure Multi-Factor Authentication provider, you're always billed for each authentication, as long as the MFA provider is linked to your subscription. You can assign MFA licenses to users, but you'll still be billed for every two-step verification request, whether it comes from someone with an MFA license assigned or not.

### Does my organization have to use and synchronize identities to use Azure Multi-Factor Authentication?

If your organization uses a consumption-based billing model, Azure Active Directory is optional, but not required. If your MFA provider isn't linked to an Azure AD tenant, you can only deploy Azure Multi-Factor Authentication Server on-premises.

Azure Active Directory is required for the license model because licenses are added to the Azure AD tenant when you purchase and assign them to users in the directory.

## Manage and support user accounts

* [What should I tell my users to do if they don't receive a response on their phone?](#what-should-i-tell-my-users-to-do-if-they-dont-receive-a-response-on-their-phone)
* [What should I do if one of my users can't get in to their account?](#what-should-i-do-if-one-of-my-users-cant-get-in-to-their-account)
* [What should I do if one of my users loses a phone that is using app passwords?](#what-should-i-do-if-one-of-my-users-loses-a-phone-that-is-using-app-passwords)
* [What if a user can't sign in to non-browser apps?](#what-if-a-user-cant-sign-in-to-non-browser-apps)
* [My users say that sometimes they don't receive the text message or the verification times out.](#my-users-say-that-sometimes-they-dont-receive-the-text-message-or-the-verification-times-out)
* [Can I change the amount of time my users have to enter the verification code from a text message before the system times out?](#can-i-change-the-amount-of-time-my-users-have-to-enter-the-verification-code-from-a-text-message-before-the-system-times-out)
* [Can I use hardware tokens with Azure Multi-Factor Authentication Server?](#can-i-use-hardware-tokens-with-azure-multi-factor-authentication-server)
* [Can I use Azure Multi-Factor Authentication Server to secure Terminal Services?](#can-i-use-azure-multi-factor-authentication-server-to-secure-terminal-services)
* [I configured Caller ID in MFA Server, but my users still receive Multi-Factor Authentication calls from an anonymous caller.](#i-configured-caller-id-in-mfa-server-but-my-users-still-receive-multi-factor-authentication-calls-from-an-anonymous-caller)
* [Why are my users being prompted to register their security information?](#why-are-my-users-being-prompted-to-register-their-security-information)

### What should I tell my users to do if they don't receive a response on their phone?

Have your users attempt up to five times in 5 minutes to get a phone call or SMS for authentication. Microsoft uses multiple providers for delivering calls and SMS messages. If this approach doesn't work, open a support case to troubleshoot further.

Third-party security apps may also block the verification code text message or phone call. If using a third-party security app, try disabling the protection, then request another MFA verification code be sent.

If the steps above don't work, check if users are configured for more than one verification method. Try signing in again, but select a different verification method on the sign-in page.

For more information, see the [end-user troubleshooting guide](../user-help/multi-factor-authentication-end-user-troubleshoot.md).

### What should I do if one of my users can't get in to their account?

You can reset the user's account by making them to go through the registration process again. Learn more about [managing user and device settings with Azure Multi-Factor Authentication in the cloud](howto-mfa-userdevicesettings.md).

### What should I do if one of my users loses a phone that is using app passwords?

To prevent unauthorized access, delete all the user's app passwords. After the user has a replacement device, they can recreate the passwords. Learn more about [managing user and device settings with Azure Multi-Factor Authentication in the cloud](howto-mfa-userdevicesettings.md).

### What if a user can't sign in to non-browser apps?

If your organization still uses legacy clients, and you [allowed the use of app passwords](howto-mfa-app-passwords.md), then your users can't sign in to these legacy clients with their username and password. Instead, they need to [set up app passwords](../user-help/multi-factor-authentication-end-user-app-passwords.md). Your users must clear (delete) their sign-in information, restart the app, and then sign in with their username and *app password* instead of their regular password.

If your organization doesn't have legacy clients, you shouldn't allow your users to create app passwords.

> [!NOTE]
> **Modern authentication for Office 2013 clients**
>
> App passwords are only necessary for apps that don't support modern authentication. Office 2013 clients support modern authentication protocols, but need to be configured. Modern authentication is available to any customer running the March 2015 or later update for Office 2013. For more information, see the blog post [Updated Office 365 modern authentication](https://www.microsoft.com/microsoft-365/blog/2015/11/19/updated-office-365-modern-authentication-public-preview/).

### My users say that sometimes they don't receive the text message or the verification times out.

Delivery of SMS messages aren't guaranteed because there are uncontrollable factors that might affect the reliability of the service. These factors include the destination country or region, the mobile phone carrier, and the signal strength.

Third-party security apps may also block the verification code text message or phone call. If using a third-party security app, try disabling the protection, then request another MFA verification code be sent.

If your users often have problems with reliably receiving text messages, tell them to use the Microsoft Authenticator app or phone call method instead. The Microsoft Authenticator can receive notifications both over cellular and Wi-Fi connections. In addition, the mobile app can generate verification codes even when the device has no signal at all. The Microsoft Authenticator app is available for [Android](https://go.microsoft.com/fwlink/?Linkid=825072), [iOS](https://go.microsoft.com/fwlink/?Linkid=825073), and [Windows Phone](https://www.microsoft.com/p/microsoft-authenticator/9nblgggzmcj6).

### Can I change the amount of time my users have to enter the verification code from a text message before the system times out?

In some cases, yes.

For one-way SMS with Azure MFA Server v7.0 or higher, you can configure the timeout setting by setting a registry key. After the MFA cloud service sends the text message, the verification code (or one-time passcode) is returned to the MFA Server. The MFA Server stores the code in memory for 300 seconds by default. If the user doesn't enter the code before the 300 seconds have passed, their authentication is denied. Use these steps to change the default timeout setting:

1. Go to `HKLM\Software\Wow6432Node\Positive Networks\PhoneFactor`.
2. Create a **DWORD** registry key called *pfsvc_pendingSmsTimeoutSeconds* and set the time in seconds that you want the Azure MFA Server to store one-time passcodes.

>[!TIP]
>
> If you have multiple MFA Servers, only the one that processed the original authentication request knows the verification code that was sent to the user. When the user enters the code, the authentication request to validate it must be sent to the same server. If the code validation is sent to a different server, the authentication is denied.

If users don't respond to the SMS within the defined timeout period, their authentication is denied.

For one-way SMS with Azure MFA in the cloud (including the AD FS adapter or the Network Policy Server extension), you can't configure the timeout setting. Azure AD stores the verification code for 180 seconds.

### Can I use hardware tokens with Azure Multi-Factor Authentication Server?

If you're using Azure Multi-Factor Authentication Server, you can import third-party Open Authentication (OATH) time-based, one-time password (TOTP) tokens, and then use them for two-step verification.

You can use ActiveIdentity tokens that are OATH TOTP tokens if you put the secret key in a CSV file and import to Azure Multi-Factor Authentication Server. You can use OATH tokens with Active Directory Federation Services (ADFS), Internet Information Server (IIS) forms-based authentication, and Remote Authentication Dial-In User Service (RADIUS) as long as the client system can accept the user input.

You can import third-party OATH TOTP tokens with the following formats:  

- Portable Symmetric Key Container (PSKC)
- CSV if the file contains a serial number, a secret key in Base 32 format, and a time interval

### Can I use Azure Multi-Factor Authentication Server to secure Terminal Services?

Yes, but if you're using Windows Server 2012 R2 or later, you can only secure Terminal Services by using Remote Desktop Gateway (RD Gateway).

Security changes in Windows Server 2012 R2 changed how Azure Multi-Factor Authentication Server connects to the Local Security Authority (LSA) security package in Windows Server 2012 and earlier versions. For versions of Terminal Services in Windows Server 2012 or earlier, you can [secure an application with Windows Authentication](howto-mfaserver-windows.md#to-secure-an-application-with-windows-authentication-use-the-following-procedure). If you're using Windows Server 2012 R2, you need RD Gateway.

### I configured Caller ID in MFA Server, but my users still receive Multi-Factor Authentication calls from an anonymous caller.

When Multi-Factor Authentication calls are placed through the public telephone network, sometimes they are routed through a carrier that doesn't support caller ID. Because of this carrier behavior, caller ID isn't guaranteed, even though the Multi-Factor Authentication system always sends it.

### Why are my users being prompted to register their security information?

There are several reasons that users could be prompted to register their security information:

- The user has been enabled for MFA by their administrator in Azure AD, but doesn't have security information registered for their account yet.
- The user has been enabled for self-service password reset in Azure AD. The security information will help them reset their password in the future if they ever forget it.
- The user accessed an application that has a Conditional Access policy to require MFA and hasn't previously registered for MFA.
- The user is registering a device with Azure AD (including Azure AD Join), and your organization requires MFA for device registration, but the user hasn't previously registered for MFA.
- The user is generating Windows Hello for Business in Windows 10 (which requires MFA) and hasn't previously registered for MFA.
- The organization has created and enabled an MFA Registration policy that has been applied to the user.
- The user previously registered for MFA, but chose a verification method that an administrator has since disabled. The user must therefore go through MFA registration again to select a new default verification method.

## Errors

* [What should users do if they see an "Authentication request is not for an activated account" error message when using mobile app notifications?](#what-should-users-do-if-they-see-an-authentication-request-is-not-for-an-activated-account-error-message-when-using-mobile-app-notifications)
* [What should users do if they see a 0x800434D4L error message when signing in to a non-browser application?](#what-should-users-do-if-they-see-a-0x800434d4l-error-message-when-signing-in-to-a-non-browser-application)

### What should users do if they see an "Authentication request is not for an activated account" error message when using mobile app notifications?

Ask the user to complete the following procedure to remove their account from the Microsoft Authenticator, then add it again:

1. Go to [their Azure portal profile](https://account.activedirectory.windowsazure.com/profile/) and sign in with an organizational account.
2. Select **Additional Security Verification**.
3. Remove the existing account from the Microsoft Authenticator app.
4. Click **Configure**, and then follow the instructions to reconfigure the Microsoft Authenticator.

### What should users do if they see a 0x800434D4L error message when signing in to a non-browser application?

The *0x800434D4L* error occurs when you try to sign in to a non-browser application, installed on a local computer, that doesn't work with accounts that require two-step verification.

A workaround for this error is to have separate user accounts for admin-related and non-admin operations. Later, you can link mailboxes between your admin account and non-admin account so that you can sign in to Outlook by using your non-admin account. For more details about this solution, learn how to [give an administrator the ability to open and view the contents of a user's mailbox](https://help.outlook.com/141/gg709759.aspx?sl=1).

## Next steps

If your question isn't answered here, the following support options are available:

* Search the [Microsoft Support Knowledge Base](https://support.microsoft.com) for solutions to common technical issues.
* Search for and browse technical questions and answers from the community, or ask your own question in the [Azure Active Directory Q&A](https://docs.microsoft.com/answers/topics/azure-active-directory.html).
* Contact Microsoft professional through [Azure Multi-Factor Authentication Server support](https://support.microsoft.com/oas/default.aspx?prid=14947). When contacting us, it's helpful if you can include as much information about your issue as possible. Information you can supply includes the page where you saw the error, the specific error code, the specific session ID, and the ID of the user who saw the error.
* If you're a legacy PhoneFactor customer and you have questions or need help with resetting a password, use the [phonefactorsupport@microsoft.com](mailto:phonefactorsupport@microsoft.com) e-mail address to open a support case.
