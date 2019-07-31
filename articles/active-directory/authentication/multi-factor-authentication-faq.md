---
title: Azure Multi-Factor Authentication FAQ - Azure Active Directory
description: Frequently asked questions and answers related to Azure Multi-Factor Authentication. 

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Frequently asked questions about Azure Multi-Factor Authentication

This FAQ answers common questions about Azure Multi-Factor Authentication and using the Multi-Factor Authentication service. It's broken down into questions about the service in general, billing models, user experiences, and troubleshooting.

## General

**Q: How does Azure Multi-Factor Authentication Server handle user data?**

With Multi-Factor Authentication Server, user data is stored only on the on-premises servers. No persistent user data is stored in the cloud. When the user performs two-step verification, Multi-Factor Authentication Server sends data to the Azure Multi-Factor Authentication cloud service for authentication. Communication between Multi-Factor Authentication Server and the Multi-Factor Authentication cloud service uses Secure Sockets Layer (SSL) or Transport Layer Security (TLS) over port 443 outbound.

When authentication requests are sent to the cloud service, data is collected for authentication and usage reports. Data fields included in two-step verification logs are as follows:

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

**Q: What SMS short codes are used for sending SMS messages to my users?**

In the United States Microsoft uses the following SMS short codes:

   * 97671
   * 69829
   * 51789
   * 99399

In Canada Microsoft uses the following SMS short codes:

   * 759731 
   * 673801

Microsoft does not guarantee consistent SMS or Voice-based Multi-Factor Authentication prompt delivery by the same number. In the interest of our users, Microsoft may add or remove Short codes at any time as we make route adjustments to improve SMS deliverability. Microsoft does not support short codes for countries/regions besides the United States and Canada.

## Billing

Most billing questions can be answered by referring to either the [Multi-Factor Authentication Pricing page](https://azure.microsoft.com/pricing/details/multi-factor-authentication/) or the documentation about [How to get Azure Multi-Factor Authentication](concept-mfa-licensing.md).

**Q: Is my organization charged for sending the phone calls and text messages that are used for authentication?**

No, you are not charged for individual phone calls placed or text messages sent to users through Azure Multi-Factor Authentication. If you use a per-authentication MFA provider, you are billed for each authentication but not for the method used.

Your users might be charged for the phone calls or text messages they receive, according to their personal phone service.

**Q: Does the per-user billing model charge me for all enabled users, or just the ones that performed two-step verification?**

Billing is based on the number of users configured to use Multi-Factor Authentication, regardless of whether they performed two-step verification that month.

**Q: How does Multi-Factor Authentication billing work?**

When you create a per-user or per-authentication MFA provider, your organization's Azure subscription is billed monthly based on usage. This billing model is similar to how Azure bills for usage of virtual machines and websites.

When you purchase a subscription for Azure Multi-Factor Authentication, your organization only pays the annual license fee for each user. MFA licenses and Office 365, Azure AD Premium, or Enterprise Mobility + Security bundles are billed this way. 

Learn more about your options in [How to get Azure Multi-Factor Authentication](concept-mfa-licensing.md).

**Q: Is there a free version of Azure Multi-Factor Authentication?**

In some instances, yes.

Multi-Factor Authentication for Azure Administrators offers a subset of Azure MFA features at no cost for access to Microsoft online services, including the [Azure portal](https://portal.azure.com) and [Microsoft 365 admin center](https://admin.microsoft.com). This offer only applies to global administrators in Azure Active Directory instances that don't have the full version of Azure MFA through an MFA license, a bundle, or a standalone consumption-based provider. If your admins use the free version, and then you purchase a full version of Azure MFA, then all global administrators are elevated to the paid version automatically.

Multi-Factor Authentication for Office 365 users offers a subset of Azure MFA features at no cost for access to Office 365 services, including Exchange Online and SharePoint Online. This offer applies to users who have an Office 365 license assigned, when the corresponding instance of Azure Active Directory doesn't have the full version of Azure MFA through an MFA license, a bundle, or a standalone consumption-based provider.

**Q: Can my organization switch between per-user and per-authentication consumption billing models at any time?**

If your organization purchases MFA as a standalone service with consumption-based billing, you choose a billing model when you create an MFA provider. You cannot change the billing model after an MFA provider is created. However, you can delete the MFA provider and then create one with a different billing model.

When an MFA provider is created, it can be linked to an Azure Active Directory, or "Azure AD tenant." If the current MFA provider is linked to an Azure AD tenant, you can safely delete the MFA provider and create one that is linked to the same Azure AD tenant. Alternatively, if you purchased enough MFA, Azure AD Premium, or Enterprise Mobility + Security (EMS) licenses to cover all users that are enabled for MFA, you can delete the MFA provider altogether.

If your MFA provider is *not* linked to an Azure AD tenant, or you link the new MFA provider to a different Azure AD tenant, user settings and configuration options are not transferred. Also, existing Azure MFA Servers need to be reactivated using activation credentials generated through the new MFA Provider. Reactivating the MFA Servers to link them to the new MFA Provider doesn't impact phone call and text message authentication, but mobile app notifications will stop working for all users until they reactivate the mobile app.

Learn more about MFA providers in [Getting started with an Azure Multi-Factor Auth Provider](concept-mfa-authprovider.md).

**Q: Can my organization switch between consumption-based billing and subscriptions (a license-based model) at any time?**

In some instances, yes.

If your directory has a *per-user* Azure Multi-Factor Authentication provider, you can add MFA licenses. Users with licenses aren't be counted in the per-user consumption-based billing. Users without licenses can still be enabled for MFA through the MFA provider. If you purchase and assign licenses for all your users configured to use Multi-Factor Authentication, you can delete the Azure Multi-Factor Authentication provider. You can always create another per-user MFA provider if you have more users than licenses in the future.

If your directory has a *per-authentication* Azure Multi-Factor Authentication provider, you are always billed for each authentication, as long as the MFA provider is linked to your subscription. You can assign MFA licenses to users, but you'll still be billed for every two-step verification request, whether it comes from someone with an MFA license assigned or not.

**Q: Does my organization have to use and synchronize identities to use Azure Multi-Factor Authentication?**

If your organization uses a consumption-based billing model, Azure Active Directory is optional, but not required. If your MFA provider is not linked to an Azure AD tenant, you can only deploy Azure Multi-Factor Authentication Server on-premises.

Azure Active Directory is required for the license model because licenses are added to the Azure AD tenant when you purchase and assign them to users in the directory.

## Manage and support user accounts

**Q: What should I tell my users to do if they don’t receive a response on their phone?**

Have your users attempt up to 5 times in 5 minutes to get a phone call or SMS for authentication. Microsoft uses multiple providers for delivering calls and SMS messages. If this doesn't work please open a support case with Microsoft to further troubleshoot.

If the steps above do not work hopefully all your users configured more than one verification method. Tell them to try signing in again, but select a different verification method on the sign-in page.

You can point your users to the [End-user troubleshooting guide](../user-help/multi-factor-authentication-end-user-troubleshoot.md).

**Q: What should I do if one of my users can't get in to their account?**

You can reset the user's account by making them to go through the registration process again. Learn more about [managing user and device settings with Azure Multi-Factor Authentication in the cloud](howto-mfa-userdevicesettings.md).

**Q: What should I do if one of my users loses a phone that is using app passwords?**

To prevent unauthorized access, delete all the user's app passwords. After the user has a replacement device, they can recreate the passwords. Learn more about [managing user and device settings with Azure Multi-Factor Authentication in the cloud](howto-mfa-userdevicesettings.md).

**Q: What if a user can't sign in to non-browser apps?**

If your organization still uses legacy clients, and you [allowed the use of app passwords](howto-mfa-mfasettings.md#app-passwords), then your users can't sign in to these legacy clients with their username and password. Instead, they need to [set up app passwords](../user-help/multi-factor-authentication-end-user-app-passwords.md). Your users must clear (delete) their sign-in information, restart the app, and then sign in with their username and *app password* instead of their regular password.

If your organization doesn't have legacy clients, you should not allow your users to create app passwords.

> [!NOTE]
> Modern authentication for Office 2013 clients
>
> App passwords are only necessary for apps that don't support modern authentication. Office 2013 clients support modern authentication protocols, but need to be configured. Now modern authentication is available to any customer running the March 2015 or later update for Office 2013. For more information, see the blog post [Updated Office 365 modern authentication](https://www.microsoft.com/microsoft-365/blog/2015/11/19/updated-office-365-modern-authentication-public-preview/).

**Q: My users say that sometimes they don't receive the text message, or they reply to two-way text messages but the verification times out.**

Delivery of text messages and receipt of replies in two-way SMS are not guaranteed because there are uncontrollable factors that might affect the reliability of the service. These factors include the destination country/region, the mobile phone carrier, and the signal strength.

If your users often have problems with reliably receiving text messages, tell them to use the mobile app or phone call method instead. The mobile app can receive notifications both over cellular and Wi-Fi connections. In addition, the mobile app can generate verification codes even when the device has no signal at all. The Microsoft Authenticator app is available for [Android](https://go.microsoft.com/fwlink/?Linkid=825072), [IOS](https://go.microsoft.com/fwlink/?Linkid=825073), and [Windows Phone](https://go.microsoft.com/fwlink/?Linkid=825071).

If you must use text messages, we recommend using one-way SMS rather than two-way SMS when possible. One-way SMS is more reliable and it prevents users from incurring global SMS charges from replying to a text message that was sent from another country/region.

**Q: Can I change the amount of time my users have to enter the verification code from a text message before the system times out?**

In some cases, yes. 

For one-way SMS with Azure MFA Server v7.0 or higher, you can configure the timeout setting by setting a registry key. After the MFA cloud service sends the text message, the verification code (or one-time passcode) is returned to the MFA Server. The MFA Server stores the code in memory for 300 seconds by default. If the user doesn't enter the code before the 300 seconds have passed, their authentication is denied. Use these steps to change the default timeout setting:

1. Go to HKLM\Software\Wow6432Node\Positive Networks\PhoneFactor.
2. Create a DWORD registry key called **pfsvc_pendingSmsTimeoutSeconds** and set the time in seconds that you want the Azure MFA Server to store one-time passcodes.

>[!TIP] 
>If you have multiple MFA Servers, only the one that processed the original authentication request knows the verification code that was sent to the user. When the user enters the code, the authentication request to validate it must be sent to the same server. If the code validation is sent to a different server, the authentication is denied. 

For two-way SMS with Azure MFA Server, you can configure the timeout setting in the MFA Management Portal. If users don't respond to the SMS within the defined timeout period, their authentication is denied. 

For one-way SMS with Azure MFA in the cloud (including the AD FS adapter or the Network Policy Server extension), you cannot configure the timeout setting. Azure AD stores the verification code for 180 seconds. 

**Q: Can I use hardware tokens with Azure Multi-Factor Authentication Server?**

If you are using Azure Multi-Factor Authentication Server, you can import third-party Open Authentication (OATH) time-based, one-time password (TOTP) tokens, and then use them for two-step verification.

You can use ActiveIdentity tokens that are OATH TOTP tokens if you put the secret key in a CSV file and import to Azure Multi-Factor Authentication Server. You can use OATH tokens with Active Directory Federation Services (ADFS), Internet Information Server (IIS) forms-based authentication, and Remote Authentication Dial-In User Service (RADIUS) as long as the client system can accept the user input.

You can import third-party OATH TOTP tokens with the following formats:  

- Portable Symmetric Key Container (PSKC)  
- CSV if the file contains a serial number, a secret key in Base 32 format, and a time interval  

**Q: Can I use Azure Multi-Factor Authentication Server to secure Terminal Services?**

Yes, but if you are using Windows Server 2012 R2 or later you can only secure Terminal Services by using Remote Desktop Gateway (RD Gateway).

Security changes in Windows Server 2012 R2 changed how Azure Multi-Factor Authentication Server connects to the Local Security Authority (LSA) security package in Windows Server 2012 and earlier versions. For versions of Terminal Services in Windows Server 2012 or earlier, you can [secure an application with Windows Authentication](howto-mfaserver-windows.md#to-secure-an-application-with-windows-authentication-use-the-following-procedure). If you are using Windows Server 2012 R2, you need RD Gateway.

**Q: I configured Caller ID in MFA Server, but my users still receive Multi-Factor Authentication calls from an anonymous caller.**

When Multi-Factor Authentication calls are placed through the public telephone network, sometimes they are routed through a carrier that doesn't support caller ID. Because of this, caller ID is not guaranteed, even though the Multi-Factor Authentication system always sends it.

**Q: Why are my users being prompted to register their security information?**
There are several reasons that users could be prompted to register their security information:

- The user has been enabled for MFA by their administrator in Azure AD, but doesn't have security information registered for their account yet.
- The user has been enabled for self-service password reset in Azure AD. The security information will help them reset their password in the future if they ever forget it.
- The user accessed an application that has a Conditional Access policy to require MFA and hasn’t previously registered for MFA.
- The user is registering a device with Azure AD (including Azure AD Join), and your organization requires MFA for device registration, but the user has not previously registered for MFA.
- The user is generating Windows Hello for Business in Windows 10 (which requires MFA) and hasn’t previously registered for MFA.
- The organization has created and enabled an MFA Registration policy that has been applied to the user.
- The user previously registered for MFA, but chose a verification method that an administrator has since disabled. The user must therefore go through MFA registration again to select a new default verification method.

## Errors

**Q: What should users do if they see an “Authentication request is not for an activated account” error message when using mobile app notifications?**

Tell them to follow this procedure to remove their account from the mobile app, then add it again:

1. Go to [your Azure portal profile](https://account.activedirectory.windowsazure.com/profile/) and sign in with your organizational account.
2. Select **Additional Security Verification**.
3. Remove the existing account from the mobile app.
4. Click **Configure**, and then follow the instructions to reconfigure the mobile app.

**Q: What should users do if they see a 0x800434D4L error message when signing in to a non-browser application?**

The 0x800434D4L error occurs when you try to sign in to a non-browser application, installed on a local computer, that doesn't work with accounts that require two-step verification.

A workaround for this error is to have separate user accounts for admin-related and non-admin operations. Later, you can link mailboxes between your admin account and non-admin account so that you can sign in to Outlook by using your non-admin account. For more details about this solution, learn how to [give an administrator the ability to open and view the contents of a user's mailbox](https://help.outlook.com/141/gg709759.aspx?sl=1).

## Next steps

If your question isn't answered here, please leave it in the comments at the bottom of the page. Or, here are some additional options for getting help:

* Search the [Microsoft Support Knowledge Base](https://www.microsoft.com/Search/result.aspx?form=mssupport&q=phonefactor&form=mssupport) for solutions to common technical issues.
* Search for and browse technical questions and answers from the community, or ask your own question in the [Azure Active Directory forums](https://social.msdn.microsoft.com/Forums/azure/newthread?category=windowsazureplatform&forum=WindowsAzureAD&prof=required).
* If you're a legacy PhoneFactor customer and you have questions or need help resetting a password, use the [password reset](mailto:phonefactorsupport@microsoft.com) link to open a support case.
* Contact a support professional through [Azure Multi-Factor Authentication Server (PhoneFactor) support](https://support.microsoft.com/oas/default.aspx?prid=14947). When contacting us, it's helpful if you can include as much information about your issue as possible. Information you can supply includes the page where you saw the error, the specific error code, the specific session ID, and the ID of the user who saw the error.
