---
title: Azure Multi-Factor Authentication FAQ
description: Provides a list of frequently asked questions and answers related to Azure Multi-Factor Authentication. Multi-Factor Authentication is a method of verifying a user's identity that requires more than a user name and password. It provides an additional layer of security to user sign-in and transactions.
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
ms.date: 10/13/2016
ms.author: kgremban

---
# Azure Multi-Factor Authentication FAQ
This FAQ answers common questions about Azure Multi-Factor Authentication and using the Multi-Factor Authentication service, including questions about the billing model and usability.

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

The verification result (success or denial), and the reason if it was denied, is stored with the authentication data and is available in authentication and usage reports.

## Billing
Most billing questions can be answered by referring to the [Multi-Factor Authentication Pricing page](https://azure.microsoft.com/pricing/details/multi-factor-authentication/).

**Q: Is my organization charged for phone calls or text messages used to authenticate my users?**

Organizations are not charged for individual phone calls placed or text messages sent to users through Azure Multi-Factor Authentication. Phone owners might be charged for the phone calls or text messages they receive, according to their personal phone service.

**Q: Does the per-user billing model charge based on the number of users who are configured to use Multi-Factor Authentication or the number of users who perform verifications?**

Billing is based on the number of users configured to use Multi-Factor Authentication.

**Q: How does Multi-Factor Authentication billing work?**

When you use the "per user" or "per authentication" model, Azure MFA is a consumption-based resource. Any charges are billed to the organization’s Azure subscription just like virtual machines, websites, etc.

When you use the license model, Azure Multi-Factor Authentication licenses are purchased and then assigned to users, just like for Office 365 and other subscription products.

**Q: Is there a free version of Azure Multi-Factor Authentication for administrators?**

In some instances, yes. Multi-Factor Authentication for Azure Administrators offers a subset of Azure MFA features at no cost. This offer applies to members of the Azure Global Administrators group in Azure Active Directory instances that aren't linked to a consumption-based Azure Multi-Factor Authentication provider. Using a Multi-Factor Authentication provider upgrades all admins and users in the directory who are configured to use Multi-Factor Authentication to the full version of Azure Multi-Factor Authentication.

**Q: Is there a free version of Azure Multi-Factor Authentication for Office 365 users?**

In some instances, yes. Multi-Factor Authentication for Office 365 offers a subset of Azure MFA features at no cost. This offer applies to users who have an Office 365 license assigned, when a consumption-based Azure Multi-Factor Authentication provider has not been linked to the corresponding instance of Azure Active Directory. Using the Multi-Factor Authentication provider upgrades all admins and users in the directory who are configured to use Multi-Factor Authentication to the full version of Azure Multi-Factor Authentication.

**Q: Can my organization switch between per-user and per-authentication consumption billing models at any time?**

Your organization chooses a billing model when it creates a resource. You cannot change a billing model after the resource is provisioned. You can, however, create another Multi-Factor Authentication resource to replace the original. User settings and configuration options cannot be transferred to the new resource.

**Q: Can my organization switch between the consumption billing and license model at any time?**

When licenses are added to a directory that already has a per-user Azure Multi-Factor Authentication provider, consumption-based billing is decremented by the number of licenses owned. If all users configured to use Multi-Factor Authentication have licenses assigned, the administrator can delete the Azure Multi-Factor Authentication provider.

You cannot mix per-authentication consumption billing with a license model. When a per-authentication Multi-Factor Authentication provider is linked to a directory, the organization is billed for all Multi-Factor Authentication verification requests, regardless of any licenses owned.

**Q: Does my organization have to use and synchronize identities to use Azure Multi-Factor Authentication?**

When an organization uses a consumption-based billing model, Azure Active Directory is not required. Linking a Multi-Factor Authentication provider to a directory is optional. If your organization is not linked to a directory, it can deploy Azure Multi-Factor Authentication Server or the Azure Multi-Factor Authentication SDK on-premises.

Azure Active Directory is required for the license model because licenses are added to the directory when you purchase and assign them to users in the directory.

## Usability
**Q: What does a user do if they don’t receive a response on their phone, or if the phone is not available to the user?**

If the user has configured a backup phone, they should try again and select that phone when prompted on the sign-in page. If the user doesn’t have another method configured, the organization's administrator can update the number assigned to the user's primary phone.

**Q: What does the administrator do if a user contacts the administrator about an account that the user can no longer access?**

The administrator can reset the user's account by asking them to go through the registration process again. Learn more about [managing user and device settings with Azure Multi-Factor Authentication in the cloud](multi-factor-authentication-manage-users-and-devices.md).

**Q: What does an administrator do if a user's phone that is using app passwords is lost or stolen?**

The administrator can delete all the user's app passwords to prevent unauthorized access. After the user has a replacement device, the user can recreate the passwords. Learn more about [managing user and device settings with Azure Multi-Factor Authentication in the cloud](multi-factor-authentication-manage-users-and-devices.md).

**Q: What if the user can't sign in to non-browser apps?**

A user who is configured to use Multi-Factor Authentication requires an app password to sign in to some non-browser apps. A user needs to clear (delete) sign-in information, restart the app, and sign in by using their user name and app password.

Get more information about creating app passwords and other [help with app passwords](multi-factor-authentication-end-user-app-passwords.md).

> [!NOTE]
> Modern authentication for Office 2013 clients
> 
> Office 2013 clients (including Outlook) support new authentication protocols. You can configure Office 2013 to support Multi-Factor Authentication. After you configure Office 2013, app passwords are not required for Office 2013 clients. For more information, see the [Office 2013 modern authentication public preview announcement](https://blogs.office.com/2015/03/23/office-2013-modern-authentication-public-preview-announced/).
> 
> 

**Q: What does a user do if the user does not receive a text message, or if the user replies to a two-way text message but the verification times out?**

Deliver of text messages, and receipt of replies in two-way SMS is not guaranteed because there are uncontrollable factors that might affect the reliability of the service. These factors include the destination country, the mobile phone carrier, and the signal strength.

Users who experience difficulty reliably receiving text messages should select the mobile app or phone call method instead. The mobile app can receive notifications both over cellular and Wi-Fi connections. In addition, the mobile app can generate verification codes even when the device has no signal at all. The Microsoft Authenticator app is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).

If you must use text messages, we recommend using one-way SMS rather than two-way SMS when possible. One-way SMS is more reliable and it prevents users from incurring global SMS charges from replying to a text message that was sent from another country.

**Q: Can I use hardware tokens with Azure Multi-Factor Authentication Server?**

If you are using Azure Multi-Factor Authentication Server, you can import third-party Open Authentication (OATH) time-based, one-time password (TOTP) tokens, and then use them for two-step verification.

You can use ActiveIdentity tokens that are OATH TOTP tokens if you put the secret key file in a CSV file and import to Azure Multi-Factor Authentication Server. You can use OATH tokens with Active Directory Federation Services (ADFS), Remote Authentication Dial-In User Service (RADIUS) when the client system can process access challenge responses, and Internet Information Server (IIS) forms-based authentication.

You can import third-part OATH TOTP tokens with the following formats:  

* Portable Symmetric Key Container (PSKC)  
* CSV if the file contains a serial number, a secret key in Base 32 format, and a time interval  

**Q: Can I use Azure Multi-Factor Authentication Server to secure Terminal Services?**

Yes, but, if you are using Windows Server 2012 R2 or later, only by using Remote Desktop Gateway (RD Gateway).

Security changes in Windows Server 2012 R2 have changed the way that Azure Multi-Factor Authentication Server connects to the Local Security Authority (LSA) security package in Windows Server 2012 and earlier versions. For versions of Terminal Services in Windows Server 2012 or earlier, you can [secure an application with Windows Authentication](multi-factor-authentication-get-started-server-windows.md#to-secure-an-application-with-windows-authentication-use-the-following-procedure). If you are using Windows Server 2012 R2, you need RD Gateway.

**Q: Why would a user receive a Multi-Factor Authentication call from an anonymous caller after setting up caller ID?**

When Multi-Factor Authentication calls are placed through the public telephone network, sometimes they are routed through a carrier that doesn't support caller ID. Because of this, caller ID is not guaranteed, even though the Multi-Factor Authentication system always sends it.

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

**Q: How can I get help with Azure Multi-Factor Authentication?**

* Search the [Microsoft Support Knowledge Base](https://www.microsoft.com/en-us/Search/result.aspx?form=mssupport&q=phonefactor&form=mssupport) for solutions to common technical issues.
* Search for and browse technical questions and answers from the community, or ask your own question in the [Azure Active Directory forums](https://social.msdn.microsoft.com/Forums/azure/newthread?category=windowsazureplatform&forum=WindowsAzureAD&prof=required).
* If you're a legacy PhoneFactor customer and you have questions or need help resetting a password, use the [password reset](mailto:phonefactorsupport@microsoft.com) link to open a support case.
* Contact a support professional through [Azure Multi-Factor Authentication Server (PhoneFactor) support](https://support.microsoft.com/oas/default.aspx?prid=14947). When contacting us, it's helpful if you can include as much information about your issue as possible. Information you can supply includes the page where you saw the error, the specific error code, the specific session ID, and the ID of the user who saw the error.

