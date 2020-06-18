---
title: Blocking legacy authentication protocols in Azure AD
description: Learn how and why organizations should block legacy authentication protocols

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 04/13/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: rogoya

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Blocking legacy authentication
 
To give your users easy access to your cloud apps, Azure Active Directory (Azure AD) supports a broad variety of authentication protocols including legacy authentication. Legacy authentication is a term that refers to an authentication request made by:

- Older Office clients that do not use modern authentication (for example, Office 2010 client)
- Any client that uses legacy mail protocols such as IMAP/SMTP/POP3

Today, the majority of all compromising sign-in attempts come from legacy authentication. Legacy authentication does not support multi-factor authentication (MFA). Even if you have an MFA policy enabled on your directory, a bad actor can authenticate using a legacy protocol and bypass MFA. The best way to protect your account from malicious authentication requests made by legacy protocols is to block these attempts altogether.

## Identify legacy authentication use

Before you can block legacy authentication in your directory, you need to first understand if your users have apps that use legacy authentication and how it affects your overall directory. Azure AD sign-in logs can be used to understand if you're using legacy authentication.

1. Navigate to the **Azure portal** > **Azure Active Directory** > **Sign-ins**.
1. Add the **Client App** column if it is not shown by clicking on **Columns** > **Client App**.
1. Filter by **Client App** > check all the **Legacy Authentication Clients** options presented.
1. Filter by **Status** > **Success**. 
1. Expand your date range if necessary using the **Date** filter.

Filtering will only show you successful sign-in attempts that were made by the selected legacy authentication protocols. Clicking on each individual sign-in attempt will show you additional details. The Client App column or the Client App field under the Basic Info tab after selecting an individual row of data will indicate which legacy authentication protocol was used. 
These logs will indicate which users are still depending on legacy authentication and which applications are using legacy protocols to make authentication requests. For users that do not appear in these logs and are confirmed to not be using legacy authentication, implement a Conditional Access policy or enable the Baseline policy: block legacy authentication for these users only.

## Moving away from legacy authentication 

Once you have a better idea of who is using legacy authentication in your directory and which applications depend on it, the next step is upgrading your users to use modern authentication. Modern authentication is a method of identity management that offers more secure user authentication and authorization. If you have an MFA policy in place on your directory, modern authentication ensures that the user is prompted for MFA when required. It is the more secure alternative to legacy authentication protocols.

This section gives a step-by-step overview on how to update your environment to modern authentication. Read through the steps below before enabling a legacy authentication blocking policy in your organization.

### Step 1: Enable modern authentication in your directory

The first step in enabling modern authentication is making sure your directory supports modern authentication. Modern authentication is enabled by default for directories created on or after August 1, 2017. If your directory was created prior to this date, you'll need to manually enable modern authentication for your directory using the following steps:

1. Check to see if your directory already supports modern authentication by running `Get-CsOAuthConfiguration` from the [Skype for Business Online PowerShell module](https://docs.microsoft.com/office365/enterprise/powershell/manage-skype-for-business-online-with-office-365-powershell).
1. If your command returns an empty `OAuthServers` property, then Modern Authentication is disabled. Update the setting to enable modern authentication using `Set-CsOAuthConfiguration`. If your `OAuthServers` property contains an entry, you're good to go.

Be sure to complete this step before moving forward. It's critical that your directory configurations are changed first because they dictate which protocol will be used by all Office clients. Even if you're using Office clients that support modern authentication, they will default to using legacy protocols if modern authentication is disabled on your directory.

### Step 2: Office applications

Once you have enabled modern authentication in your directory, you can start updating applications by enabling modern authentication for Office clients. Office 2016 or later clients support modern authentication by default. No extra steps are required.

If you are using Office 2013 Windows clients or older, we recommend upgrading to Office 2016 or later. Even after completing the prior step of enabling modern authentication in your directory, the older Office applications will continue to use legacy authentication protocols. If you are using Office 2013 clients and are unable to immediately upgrade to Office 2016 or later, follow the steps in the following article to [Enable Modern Authentication for Office 2013 on Windows devices](https://docs.microsoft.com/office365/admin/security-and-compliance/enable-modern-authentication). To help protect your account while you're using legacy authentication, we recommend using strong passwords across your directory. Check out [Azure AD password protection](../authentication/concept-password-ban-bad.md) to ban weak passwords across your directory.

Office 2010 does not support modern authentication. You will need to upgrade any users with Office 2010 to a more recent version of Office. We recommend upgrading to Office 2016 or later, as it blocks legacy authentication by default.

If you are using macOS, we recommend upgrading to Office for Mac 2016 or later. If you are using the native mail client, you will need to have macOS version 10.14 or later on all devices.

### Step 3: Exchange and SharePoint

For Windows-based Outlook clients to use modern authentication, Exchange Online must be modern authentication enabled as well. If modern authentication is disabled for Exchange Online, Windows-based Outlook clients that support modern authentication (Outlook 2013 or later) will use basic authentication to connect to Exchange Online mailboxes.

SharePoint Online is enabled for modern authentication default. For directories created after August 1, 2017, modern authentication is enabled by default in Exchange Online. However, if you had previously disabled modern authentication or are you using a directory created prior to this date, follow the steps in the following article to [Enable modern authentication in Exchange Online](https://docs.microsoft.com/exchange/clients-and-mobile-in-exchange-online/enable-or-disable-modern-authentication-in-exchange-online).

### Step 4: Skype for Business

To prevent legacy authentication requests made by Skype for Business, it is necessary to enable modern authentication for Skype for Business Online. For directories created after August 1, 2017, modern authentication for Skype for Business is enabled by default.

We suggest you transition to Microsoft Teams, which supports modern authentication by default. However, if you are unable to migrate at this time, you will need to enable modern authentication for Skype for Business Online so that Skype for Business clients start using modern authentication. Follow the steps in this article [Skype for Business topologies supported with Modern Authentication](https://docs.microsoft.com/skypeforbusiness/plan-your-deployment/modern-authentication/topologies-supported), to enable Modern Authentication for Skype for Business.

In addition to enabling modern authentication for Skype for Business Online, we recommend enabling modern authentication for Exchange Online when enabling modern authentication for Skype for Business. This process will help synchronize the state of modern authentication in Exchange Online and Skype for Business online and will prevent multiple sign-in prompts for Skype for Business clients.

### Step 5: Using mobile devices

Applications on your mobile device need to block legacy authentication as well. We recommend using Outlook for Mobile. Outlook for Mobile supports modern authentication by default and will satisfy other MFA baseline protection policies.

In order to use the native iOS mail client, you will need to be running iOS version 11.0 or later to ensure the mail client has been updated to block legacy authentication.

### Step 6: On-premises clients

If you are a hybrid customer using Exchange Server on-premises and Skype for Business on-premises, both services will need to be updated to enable modern authentication. When using modern authentication in a hybrid environment, you're still authenticating users on-premises. The story of authorizing their access to resources (files or emails) changes.

Before you can begin enabling modern authentication on-premises, please be sure that you have met the pre-requisites. You're now ready to enable modern authentication on-premises.

Steps for enabling modern authentication can be found in the following articles:

* [How to configure Exchange Server on-premises to use Hybrid Modern Authentication](https://docs.microsoft.com/office365/enterprise/configure-exchange-server-for-hybrid-modern-authentication)
* [How to use Modern Authentication (ADAL) with Skype for Business](https://docs.microsoft.com/skypeforbusiness/manage/authentication/use-adal)

## Next steps

- [How to configure Exchange Server on-premises to use Hybrid Modern Authentication](https://docs.microsoft.com/office365/enterprise/configure-exchange-server-for-hybrid-modern-authentication)
- [How to use Modern Authentication (ADAL) with Skype for Business](https://docs.microsoft.com/skypeforbusiness/manage/authentication/use-adal)
- [Block legacy authentication](../conditional-access/block-legacy-authentication.md)
