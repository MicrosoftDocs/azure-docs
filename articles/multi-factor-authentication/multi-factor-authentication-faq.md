---
title: Azure Multi-Factor Authentication FAQ | Microsoft Docs
description: Frequently asked questions and answers related to Azure Multi-Factor Authentication. Multi-Factor Authentication is a method of verifying a user's identity that requires more than a user name and password. It provides an additional layer of security to user sign-in and transactions.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid: 50bb8ac3-5559-4d8b-a96a-799a74978b14
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/16/2017
ms.author: kgremban

ms.custom: H1Hack27Feb2017
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

## Billing
Most billing questions can be answered by referring to either the [Multi-Factor Authentication Pricing page](https://azure.microsoft.com/pricing/details/multi-factor-authentication/) or the documentation about [How to get Azure Multi-Factor Authentication](multi-factor-authentication-versions-plans.md).

**Q: Is my organization charged for the phone calls and text messages that are used for authentication?**

No, organizations are not charged for individual phone calls placed or text messages sent to users through Azure Multi-Factor Authentication. If you use a per-authentication MFA provider, you are billed for each authentication but not for the method used.

Phone owners might be charged for the phone calls or text messages they receive, according to their personal phone service.

**Q: How does the per-user billing model charge?**

Billing is based on the number of users configured to use Multi-Factor Authentication. It doesn't matter whether all of them perform verification in a month or if none of them do. 

**Q: How does Multi-Factor Authentication billing work?**

When you purchase Azure Multi-Factor Authentication as a standalone service (by creating a per-user or per-authentication MFA provider) your organization's Azure subscription is billed monthly based on usage. This billing model works like virtual machines and websites.

When you purchase a subscription for Azure Multi-Factor Authentication (as a per-user annual license, or as part of an Office 365, Azure AD Premium, or Enterprise Mobility + Security bundle), your organization only pays the annual license fee for each user.

Learn more about your options in [How to get Azure Multi-Factor Authentication](multi-factor-authentication-versions-plans.md).

**Q: Is there a free version of Azure Multi-Factor Authentication?**

In some instances, yes. 

Multi-Factor Authentication for Azure Administrators offers a subset of Azure MFA features at no cost for access to Microsoft online services, including the Azure and Office 365 administrator portals. This offer applies to the Azure Administrators in Azure Active Directory instances that don't have the full version of Azure MFA through an MFA license, a bundle, or a standalone consumption-based provider. 

Using a Multi-Factor Authentication provider upgrades all admins and users in the directory who are configured to use Multi-Factor Authentication to the full version of Azure Multi-Factor Authentication.

Multi-Factor Authentication for Office 365 users offers a subset of Azure MFA features at no cost for access to Microsoft online services, including Exchange Online, SharePoint Online, and other Office 365 services. This offer applies to users who have an Office 365 license assigned, when the corresponding instance of Azure Active Directory doesn't have the full version of Azure MFA through an MFA license, a bundle, or a standalone consumption-based provider. Using the Multi-Factor Authentication provider upgrades all admins and users in the directory who are configured to use Multi-Factor Authentication to the full version of Azure Multi-Factor Authentication.

**Q: Can my organization switch between per-user and per-authentication consumption billing models at any time?**

Your organization chooses a billing model when it creates a resource. You cannot change a billing model after the resource is provisioned. You can, however, create another Multi-Factor Authentication resource to replace the original. User settings and configuration options can only be transferred to the new resource if the original provider was linked to an Azure AD tenant and the new provider is linked to the same tenant during creation. An Azure AD tenant cannot be linked to two Multi-Factor Authentication providers at the same time. Delete the original one before creating a new one.

**Q: Can my organization switch between consumption-based billing and subscriptions (a license-based model) at any time?**

In some instances, yes. 

If your directory has a *per-user* Azure Multi-Factor Authentication provider, you can add MFA licenses. Users with licenses aren't be counted in the per-user consumption-based billing. Users without licenses can still be enabled for MFA through the MFA provider. If you purchase and assign licenses for all your users configured to use Multi-Factor Authentication, you can delete the Azure Multi-Factor Authentication provider. You can always create another per-user MFA provider if you have more users than licenses in the future. 

If your directory has a *per-authentication* Azure Multi-Factor Authentication, you cannot combine that with MFA licenses. Technically you can, but you don't want to because you'll be billed for every two-step verification request, whether it comes from someone with an MFA license assigned or not. 

**Q: Does my organization have to use and synchronize identities to use Azure Multi-Factor Authentication?**

When an organization uses a consumption-based billing model, Azure Active Directory is optional, but not required. If your MFA provider is not linked to an Azure AD tenant, you can only deploy Azure Multi-Factor Authentication Server or the Azure Multi-Factor Authentication SDK on-premises.

Azure Active Directory is required for the license model because licenses are added to the Azure AD tenant when you purchase and assign them to users in the directory.

## Troubleshooting the end-user experience

**Q: What should I tell my users to do if they don’t receive a response on their phone, or don't have their phone with them?**

Hopefully all your users configured more than one verification method. Tell them to try signing in again, but select a different verification method on the sign-in page. If the user doesn’t have another method configured, you can update the number assigned to be the user's primary phone.

You can point your users to the [End-user troubleshooting guide](./end-user/multi-factor-authentication-end-user-troubleshoot.md).


**Q: What should I do if one of my users can't get in to their account?**

You can reset the user's account by making them to go through the registration process again. Learn more about [managing user and device settings with Azure Multi-Factor Authentication in the cloud](multi-factor-authentication-manage-users-and-devices.md).

**Q: What should I do if one of my users loses a phone that is using app passwords?**

To prevent unauthorized access, delete all the user's app passwords. After the user has a replacement device, they can recreate the passwords. Learn more about [managing user and device settings with Azure Multi-Factor Authentication in the cloud](multi-factor-authentication-manage-users-and-devices.md).

**Q: What if a user can't sign in to non-browser apps?**

If your organization still uses legacy clients, and you [allowed the use of app passwords](multi-factor-authentication-whats-next.md#app-passwords), then your users can't sign in to these legacy clients with their username and password. Instead, they need to [set up app passwords](./end-user/multi-factor-authentication-end-user-app-passwords.md). Your users clear (delete) their sign-in information, restart the app, and then sign in with their username and *app password* instead of their regular password. 

If your organization doesn't have legacy clients, you should not allow your users to create app passwords. 

> [!NOTE]
> Modern authentication for Office 2013 clients
> 
> App passwords are only necessary for apps that don't support modern authentication. Office 2013 clients support modern authentication protocols, but need to be configured. Newer Office clients automatically support modern authentication protocols. For more information, see the [Office 2013 modern authentication public preview announcement](https://blogs.office.com/2015/03/23/office-2013-modern-authentication-public-preview-announced/).

**Q: My users say that sometimes they don't receive the text message, or they reply to two-way text messages but the verification times out.**

Delivery of text messages, and receipt of replies in two-way SMS, is not guaranteed because there are uncontrollable factors that might affect the reliability of the service. These factors include the destination country, the mobile phone carrier, and the signal strength.

If your users often have problems with reliably receiving text messages, tell them to use the mobile app or phone call method instead. The mobile app can receive notifications both over cellular and Wi-Fi connections. In addition, the mobile app can generate verification codes even when the device has no signal at all. The Microsoft Authenticator app is available for [Android](http://go.microsoft.com/fwlink/?Linkid=825072), [IOS](http://go.microsoft.com/fwlink/?Linkid=825073), and [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071).

If you must use text messages, we recommend using one-way SMS rather than two-way SMS when possible. One-way SMS is more reliable and it prevents users from incurring global SMS charges from replying to a text message that was sent from another country.

**Q: Can I change the amount of time my users have to enter the verification code from a text message before the system times out?**

It depends. This setting is configurable in Azure MFA Server 7.0 and higher, but not in earlier versions of the server or Azure MFA in the cloud.

Azure MFA Server stores one-time passcodes for 300 seconds (5 minutes) by default. If the user enters their code after the 300 seconds have passed, their authentication is denied. You can adjust the timeout by setting a registry key. 

1. Go to HKLM\Software\Wow6432Node\Positive Networks\PhoneFactor.
2. Create a DWORD registry key called **pfsvc_pendingSmsTimeoutSeconds** and set the time in seconds that you want the Azure MFA Server to store one-time passcodes.

Cloud-based MFA in Azure AD stores one-time passcodes for 120 seconds (2 minutes), and this setting is not configurable. 

**Q: Can I use hardware tokens with Azure Multi-Factor Authentication Server?**

If you are using Azure Multi-Factor Authentication Server, you can import third-party Open Authentication (OATH) time-based, one-time password (TOTP) tokens, and then use them for two-step verification.

You can use ActiveIdentity tokens that are OATH TOTP tokens if you put the secret key in a CSV file and import to Azure Multi-Factor Authentication Server. You can use OATH tokens with Active Directory Federation Services (ADFS), Internet Information Server (IIS) forms-based authentication, and Remote Authentication Dial-In User Service (RADIUS) when the client system can process access challenge responses.

You can import third-party OATH TOTP tokens with the following formats:  

- Portable Symmetric Key Container (PSKC)  
- CSV if the file contains a serial number, a secret key in Base 32 format, and a time interval  

**Q: Can I use Azure Multi-Factor Authentication Server to secure Terminal Services?**

Yes, but if you are using Windows Server 2012 R2 or later you can only secure Terminal Services by using Remote Desktop Gateway (RD Gateway).

Security changes in Windows Server 2012 R2 changed how Azure Multi-Factor Authentication Server connects to the Local Security Authority (LSA) security package in Windows Server 2012 and earlier versions. For versions of Terminal Services in Windows Server 2012 or earlier, you can [secure an application with Windows Authentication](multi-factor-authentication-get-started-server-windows.md#to-secure-an-application-with-windows-authentication-use-the-following-procedure). If you are using Windows Server 2012 R2, you need RD Gateway.

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

Currently, a user can use additional security verification only with applications and services that the user can access through a browser. Non-browser applications (also referred to as *rich client applications*) that are installed on a local computer, such as Windows PowerShell, doesn't work with accounts that require additional security verification. In this case, the user might see the application generate an 0x800434D4L error.

A workaround for this is to have separate user accounts for admin-related and non-admin operations. Later, you can link mailboxes between your admin account and non-admin account so that you can sign in to Outlook by using your non-admin account. For more details about this, learn how to [give an administrator the ability to open and view the contents of a user's mailbox](http://help.outlook.com/141/gg709759.aspx?sl=1).

## Next steps
If your question isn't answered here, please leave it in the comments at the bottom of the page. Or, here are some additional options for getting help:

* Search the [Microsoft Support Knowledge Base](https://www.microsoft.com/en-us/Search/result.aspx?form=mssupport&q=phonefactor&form=mssupport) for solutions to common technical issues.
* Search for and browse technical questions and answers from the community, or ask your own question in the [Azure Active Directory forums](https://social.msdn.microsoft.com/Forums/azure/newthread?category=windowsazureplatform&forum=WindowsAzureAD&prof=required).
* If you're a legacy PhoneFactor customer and you have questions or need help resetting a password, use the [password reset](mailto:phonefactorsupport@microsoft.com) link to open a support case.
* Contact a support professional through [Azure Multi-Factor Authentication Server (PhoneFactor) support](https://support.microsoft.com/oas/default.aspx?prid=14947). When contacting us, it's helpful if you can include as much information about your issue as possible. Information you can supply includes the page where you saw the error, the specific error code, the specific session ID, and the ID of the user who saw the error.

