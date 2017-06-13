---
title: 'Azure AD Connect: Seamless Single Sign-On - Quick Start | Microsoft Docs'
description: This article describes how to get started with Azure Active Directory Seamless Single Sign-On.
services: active-directory
keywords: what is Azure AD Connect, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/12/2017
ms.author: billmath
---

# Azure Active Directory Seamless Single Sign-On: Quick start

Azure Active Directory Seamless Single Sign-On (Azure AD Seamless SSO) automatically signs users in when they are on their corporate desktops connected to your corporate network. It provides your users easy access to your cloud-based applications without needing any additional on-premises components.

## How to deploy Azure AD Seamless SSO

To deploy Seamless SSO, you need to follow these steps:
1. *Check prerequisites*: Set up your tenant and on-premises environment correctly before you enable the feature.
2. *Enable the feature*: Turn on Seamless SSO on your tenant using Azure AD Connect.
3. *Roll out the feature*: Use Group Policy to roll out the feature to some or all of your users.
4. *Test the feature*: Test user sign-in using Seamless SSO.

## Step 1: Check prerequisites

Ensure that the following prerequisites are in place:

1. Set up your Azure AD Connect server: If you use [Pass-through Authentication](active-directory-aadconnect-pass-through-authentication.md) as your sign-in method, no further action is required. If you use [Password Hash Synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) as your sign-in method, and if there is a firewall between Azure AD Connect and Azure AD, ensure that:

- You are using versions 1.1.484.0 or later of Azure AD Connect.
- Azure AD Connect can communicate with `*.msappproxy.net` URLs and over port 443. This is only used to enable the feature, not for actual user sign-ins.
- Azure AD Connect can make direct IP connections to the [Azure data center IP ranges](https://www.microsoft.com/download/details.aspx?id=41653). Again, this is only used to enable the feature.

2. You need to have Domain Administrator credentials for each AD forest that you synchronize to Azure AD (using Azure AD Connect) and for whose users you want to enable Seamless SSO.

## Step 2: Enable the feature

Seamless SSO can be enabled using [Azure AD Connect](active-directory-aadconnect.md).

If you are doing a fresh installation of Azure AD Connect, choose the [custom installation path](active-directory-aadconnect-get-started-custom.md). At the "User sign-in" page, check the "Enable single sign on" option.

![Azure AD Connect - User sign-in](./media/active-directory-aadconnect-sso/sso8.png)

If you already have an installation of Azure AD Connect, choose "Change user sign-in page" on Azure AD Connect and click "Next". Then check the "Enable single sign on" option.

![Azure AD Connect - Change user sign-in](./media/active-directory-aadconnect-user-signin/changeusersignin.png)

Continue through the wizard till you get to the "Enable single sign on" page. You will need to provide Domain Administrator credentials for each AD forest that you synchronize to Azure AD (via Azure AD Connect) and for whose users you want to enable Seamless SSO. 

After completion of the wizard Seamless SSO is enabled on your tenant.

>[!NOTE]
> The Domain Administrator credentials are not stored in Azure AD Connect or in Azure AD, but are only used to enable the feature.

## Step 3: Roll out the feature

To roll out the feature to your users, you will need to add two Azure AD URLs (https://autologon.microsoftazuread-sso.com and https://aadg.windows.net.nsatc.net) to the users' Intranet zone settings via Group Policy in Active Directory. 

### Why do you need this?

By default, the browser automatically calculates the right zone (Internet or Intranet) from a URL. For example, http://contoso/ will be mapped to the Intranet zone, whereas http://intranet.contoso.com/ will be mapped to the Internet zone (because the URL contains a period). Browsers don't send Kerberos tickets to a cloud endpoint - like the two Azure AD URLs - unless its URL is explictly added to the browser's Intranet zone.

### Detailed steps

1. Open the Group Policy Management tool.
2. Edit the Group Policy that is applied to some or all your users. In this example, we'll use the **Default Domain Policy**.
3. Navigate to **User Configuration\Administrative Templates\Windows Components\Internet Explorer\Internet Control Panel\Security Page** and select **Site to Zone Assignment List**.
![Single sign-on](./media/active-directory-aadconnect-sso/sso6.png)  
4. Enable the policy, and enter the following values/data in the dialog box. These are the Azure AD URLs where the Kerberos tickets are sent.

		Value: https://autologon.microsoftazuread-sso.com
		Data: 1
		Value: https://aadg.windows.net.nsatc.net
		Data: 1
>[!NOTE]
> If you want to disallow some users from using Seamless SSO - for instance, if these users are signing in on shared kiosks - set the preceding values to *4*. This adds the Azure AD URLs to the Restricted Zone, and will force Seamless SSO to fail all the time.

5. Click **OK** and **OK** again.

It should look like this:

![Single sign-on](./media/active-directory-aadconnect-sso/sso7.png)

### Browser considerations <<<<<< TBD >>>>>>>>

Note that this only works for Internet Explorer and Google Chrome (if it shares the same set of trusted site URLs as Internet Explorer). You will need to separately configure for Mozilla Firefox.

>[!NOTE]
>By default, Chrome uses the same set of trusted site URLs as Internet Explorer. If you have configured different settings for Chrome, then you need to update those settings separately.

## Step 4: Test the feature

To test the feature for a specific user, ensure that _all_ the following conditions are in place:
  - The user is signing in on a corporate device.
  - The device has been previously joined to your Active Directory (AD) domain.
  - The device has a direct connection to your Domain Controller (DC), either on the corporate wired or wireless network or via a remote access connection, such as a VPN connection.
  - You have [rolled out the feature](##step-3-roll-out-the-feature) to this user using Group Policy.

## Next steps

- [**Technical Deep Dive**](active-directory-aadconnect-sso-how-it-works.md) - Understand how this feature works.
- [**Frequently Asked Questions**](active-directory-aadconnect-sso-faq.md) - Answers to frequently asked questions.
- [**Troubleshoot**](active-directory-aadconnect-troubleshoot-sso.md) - Learn how to resolve common issues with the feature.
- [**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect) - For filing new feature requests.
