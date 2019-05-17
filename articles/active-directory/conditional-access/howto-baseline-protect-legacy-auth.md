---
title: 
description: 

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 05/16/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Blocking legacy authentication with baseline protection

To give your users easy access to your cloud apps, Azure Active Directory (Azure AD) supports a broad variety of authentication protocols including legacy authentication. Legacy authentication is a term that refers to an authentication request made by:
Older Office clients that do not use modern authentication (e.g. Office 2010 client)
Any client that uses legacy mail protocols such as IMAP/SMPT/POP3
Today, majority of all compromising sign-in attempts come from legacy authentication. Legacy authentications do not support MFA. Even if you have an MFA policy enabled on your tenant, a bad actor can authenticate using a legacy protocol and bypass MFA.

The best way to protect your account from malicious authentication requests made by legacy protocols is to block these attempts all together. To make it easier for you to block all login requests made by legacy protocols, we created a baseline policy that does just that.
Block legacy authentication is baseline policy that blocks all authentication requests made from legacy protocols. Modern authentication must be used to successfully sign-in for all users. Used in conjunction with the other baseline policies, all requests coming from legacy protocols will be blocked and all users will be required to MFA whenever required. This policy does not block Exchange ActiveSync.

## Understanding Your Environment

Before you can block legacy authentication in your tenant, you need to first understand if your users have apps that use legacy authentication and how it affects your overall tenant. Azure AD sign-in logs can be used to understand if you’re using legacy authentication.
Navigate to Azure Portal -> Azure Active Directory -> Sign-ins.
Filter by Client App -> Other Clients and click Apply. If you don’t see the column at first, click on Columns in the toolbar.

Filtering will only show you sign-in attempts that were made by legacy authentication protocols. Clicking on each individual sign-in attempt will show you additional details. The Client App field under the Basic Info tab will indicate which legacy authentication protocol was used.

These logs will indicate which users are still depending on legacy authentication and which applications are using legacy protocols to make authentication requests. For users that do not appear in these logs and are confirmed to not be using legacy authentication, implement a conditional access policy or enable Baseline policy: block legacy authentication for these users only.

## Moving Away from Legacy Authentication

Once you have a better idea of who is using legacy authentication in your tenant and which applications depend on it, the next step is upgrading your users to modern authentication. Modern authentication is a method of identity management that offers more secure user authentication and authorization. If you have an MFA policy in place on your tenant, modern authentication ensures that the user is prompted for MFA when required. It is the more secure alternative to legacy authentication protocols.
This section gives a step-by-step overview on how to update your environment to modern authentication. Read through the steps below before enabling a block legacy authentication policy in your organization

Step 1: Enable Modern Authentication in your Tenant

The first step in enabling modern authentication is making sure your tenant supports modern authentication. Modern authentication is enabled by default for tenants created on or after August 1st, 2017. If your tenant was created prior to this date, you’ll need to manually enable modern authentication for your tenant – follow these steps to enable modern authentication.
First check to see if your tenant already supports modern authentication.
If your command returns an empty ‘OAuthServers’ property, then Modern Authentication is disabled. Update the setting to enable modern authentication. If your ‘OAuthServers’ property contains an entry, you’re good to go.
Be sure to complete this step before moving forward. It’s critical that your tenant configurations are changed first because they dictate which protocol will be used by all Office clients. Even if you’re using Office clients that support modern authentication, they will default to using legacy protocols if modern authentication is disabled on your tenant.

Step 2: Enable Modern authentication for Office Applications

Once you have enabled modern authentication in your tenant, you can start updating applications by enabling modern authentication for Office clients.
Office 2016 and newer clients support modern authentication by default. No extra steps are required.
If you are using Office 2013 Windows clients or older, we recommend upgrading to Office 2016. Even after completing the prior step of enabling modern authentication in your tenant, the older Office applications will continue to use legacy authentication protocols. However, if you are using Office 2013 clients and are unable to immediately upgrade to Office 2016, follow these steps to enable modern authentication for Office 2013. To help protect your account while you’re using legacy authentication, we recommend using strong passwords across your tenant. Check out Password Protection to ban weak passwords across your tenant.
Office 2010 does not support modern authentication. You will need to upgrade any users with Office 2010 to a more recent version of Office. We recommend upgrading to Office 2016, as it blocks legacy authentication by default.
If you are using MacOS, we recommend upgrading to Office 2016 or later for MacOS. If you are using the native mail client, you will need to have MacOS version 10.14 or later on all devices.

Step 3: Enabling modern authentication for Exchange and SharePoint

For Windows-based Outlook clients to use modern authentication, Exchange Online must be modern authentication enabled as well. If modern authentication is disabled for Exchange Online, Windows-based Outlook clients that support modern authentication (Outlook 2013 or later) will use basic authentication to connect to Exchange Online mailboxes.
SharePoint Online is modern authentication enabled by default. For tenants created after August 1st, 2017, modern authentication is enabled by default in Exchange Online. However, if you had previously disabled it modern authentication or are you using a tenant created prior to this date, follow these steps to Enable modern authentication in Exchange Online.

Step 4: Skype for Business

To prevent legacy authentication requests made by Skype for Business, it is necessary to enable modern authentication for Skype for Business Online. For tenants created after August 1st 2017, modern authentication for Skype for Business is enabled by default.
To enable modern authentication in Skype for Business, we suggest you upgrade to Teams, which supports modern authentication by default. However, if you are unable to upgrade at this time, you will need to enable modern authentication for Skype for Business Online so that Skype for Business clients start using modern authentication. Follow these steps to enable modern authentication for Skype for Business clients.
In addition to enabling modern authentication for Skype for Business Online, we recommend modern authentication be enabled for Exchange Online when enabling modern authentication for Skype for Business. This will help synchronize the state of modern authentication in Exchange Online and Skype for Business online and will prevent multiple log in prompts for Skype for Business clients.

Step 5: Using Mobile Devices

Applications on your mobile device need to block legacy authentication as well. We recommend using Outlook for Mobile. Outlook Mobile supports modern authentication by default and will satisfy other MFA baseline protection policies.
In order to use the native iOS mail client, you will need to be running iOS version 11.0 or later to ensure the mail client has been updated to block legacy authentication.

Step 6: Enable Modern Authentication for On-Premises Clients

If you are a hybrid customer using Exchange Server on-premises and Skype for Business on-premises, both services will need to be updated to enable modern authentication. When using modern authentication in a hybrid environment, you’re still authentication users on-premises. The story of authorizing their access to resources (files or emails) changes.

Before you can begin enabling modern authentication on-premises, be sure you meet theIf you meet the requirements, you’re now ready to enable modern authentication on-premises.

Steps for enabling modern authentication be found below:

Exchange Servicer on-premises
Skype for Business on-premises

Enable Block legacy authentication

Baseline policy: Block legacy authentication comes pre-configured and will show up at the top when you navigate to the Conditional Access blade in Azure portal.  
To enable this policy and protect your privileged actions:  
Sign in to the Azure portal as global administrator, security administrator, or conditional access administrator.
In the Azure portal, on the left navigation bar, click Azure Active Directory.
On the Azure Active Directory page, in the Security section, click Conditional access.

Baseline policies will automatically appear at the top. Click on Baseline policy: Require MFA for admins

To enable the policy, click Use policy immediately.
You can test the policy with up to 50 users by clicking on Select users. Under the Include tab, click Select users and then use the Select option to choose which administrators you want this policy to apply to.
Click Save and you’re ready to go.
