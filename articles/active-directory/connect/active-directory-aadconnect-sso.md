---
title: 'Azure AD Connect: Seamless Single Sign On | Microsoft Docs'
description: This topic describes Azure Active Directory (Azure AD) Seamless Single Sign On and how it allows you to provide true single sign on for corporate desktop users inside your corporate network.
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
ms.date: 04/26/2017
ms.author: billmath
---

# Azure Active Directory Seamless Single Sign On

## What is Azure Active Directory Seamless Single Sign On?

Azure Active Directory Seamless Single Sign On (Azure AD Seamless SSO) provides true single sign on for users signing in on their corporate desktops connected on the corporate network. When enabled, users won't need to type in their passwords to sign in to Azure AD, and in most cases, even type in their usernames. This feature provides your users easy access to your cloud-based services without needing any additional on-premises components.

Seamless SSO can be enabled via Azure AD Connect and can be combined with either [password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) or [pass-through authentication](active-directory-aadconnect-pass-through-authentication.md).

>[!NOTE]
>This feature is NOT applicable to Active Directory Federation Services (ADFS), which already provides this capability.

For this feature to work for a specific user, the following conditions need to be met:

- Your user is signing in on a corporate desktop.
- The desktop has been previously joined to your Active Directory (AD) domain.
- The desktop has a direct connection to your Domain Controller (DC), either on the corporate wired or wireless network or via a remote access connection, such as a VPN connection.
- Our service endpoints have been included to the browser's Intranet zone.

If any of the above conditions are not met, then the user will be prompted to enter their username and password as before.

![Seamless Single Sign On](./media/active-directory-aadconnect-sso/sso1.png)

## What's available during preview?

>[!NOTE]
>Azure AD Seamless SSO is currently in preview. It is a free feature and you don't need any paid editions of Azure AD to use it.

Seamless SSO is supported via web browser-based clients and Office clients that support [modern authentication](https://aka.ms/modernauthga) on desktops capable of Kerberos authentication, such as Windows-based desktops. The matrix below provides details of the browser-based clients on various operating systems.

| OS\Browser |Internet Explorer|Google Chrome|Mozilla Firefox|Edge
| --- | --- |--- | --- | --- |
|Windows 10|Yes|Yes|Yes\*|No
|Windows 8.1|Yes|Yes|Yes\*|N/A
|Windows 8|Yes|Yes|Yes\*|N/A
|Windows 7|Yes|Yes|Yes\*|N/A
|Mac OS X|N/A|Yes\*|Yes\*|N/A

\*Requires additional configuration.

>[!NOTE]
>For Windows 10, the recommendation is to use [Azure AD Join](../active-directory-azureadjoin-overview.md) for the optimal experience with Azure AD.

If an Azure AD sign-in request includes the `domain_hint` or `login_hint` parameter (initiated by an application on your tenant), Seamless SSO will take advantage of it and the user will avoid entering their username and password.

## How does Azure AD Seamless SSO work?

You can enable Seamless SSO in Azure AD Connect as shown [below](#how-to-enable-azure-ad-seamless-sso?). Once enabled, a computer account named AZUREADSSOACCT is created in your on-premises Active Directory (AD) and its Kerberos decryption key is shared securely with Azure AD. In addition, two Kerberos service principal names (SPNs) are created to represent two service URLs that are used during Azure AD sign-in.

>[!NOTE]
> The computer account and the Kerberos SPNs need to be created in each AD forest that you synchronize to Azure AD (via Azure AD Connect) and for whose users you want to enable Seamless SSO. If your AD forest has organizational units (OUs) for computer accounts, after enabling the Seamless SSO feature, move the AZUREADSSOACCT computer account to an OU to ensure that it is not deleted and is managed in the same way as other computer accounts.

Once this setup is complete, Azure AD sign-in works the same way as any other sign-in that uses Integrated Windows Authentication (IWA). The Seamless SSO process works as follows:

Let's say that your user attempts to access a cloud-based resource that is secured by Azure AD, such as SharePoint Online. SharePoint Online redirects the user's browser to Azure AD for sign-in.

If the sign-in request to Azure AD includes a `domain_hint` (identifies your Azure AD tenant; for example, contoso.onmicrosoft.com) or a `login_hint` (identifies the user's username; for example, user@contoso.onmicrosoft.com or user@contoso.com) parameter, then steps 1-5 occur.

If either of those two parameters are not included in the request, the user will be asked to provide their username on the Azure AD sign-in page. Steps 1-5 occur only after the user tabs out of the username field or clicks the "Continue" button.

1. Azure AD challenges the client, via a 401 Unauthorized response, to provide a Kerberos ticket.
2. The client requests a ticket from Active Directory for Azure AD (represented by the computer account which was setup earlier).
3. Active Directory locates the computer account and returns a Kerberos ticket to the client encrypted with the computer account's secret. The ticket includes the identity of the user currently signed in to the desktop.
4. The client sends the Kerberos ticket it acquired from Active Directory to Azure AD.
5. Azure AD decrypts the Kerberos ticket using the previously shared key. If successful, Azure AD either returns a token or asks the user to perform additional proofs such as multi-factor authentication as required by the resource.

Seamless SSO is an opportunistic feature, which means that if it fails for any reason, the user sign-in experience falls back to its regular behavior - i.e, the user will need to enter their password on the sign-in page.

The process is also illustrated in the diagram below:

![Seamless Single Sign On](./media/active-directory-aadconnect-sso/sso2.png)

## How to enable Azure AD Seamless SSO?

### Pre-requisites

If you are enabling Seamless SSO with Pass-through authentication, there are no additional pre-requisites beyond what is required for the Pass-through authentication feature.

If you are enabling Seamless SSO with Password synchronization, and if there is a firewall between Azure AD Connect and Azure AD, make sure that:

- The Azure AD Connect server can communicate with `*.msappproxy.net` URLs.
- Azure AD Connect (versions 1.1.484.0 or higher) can make HTTPS requests to Azure AD over port 443. This is only used for enabling the feature, not for the actual user sign-ins.
- Azure AD Connect can also make direct IP connections to the [Azure data center IP ranges](https://www.microsoft.com/en-us/download/details.aspx?id=41653). Again, this is only used for enabling the feature.

>[!NOTE]
> Older versions of Azure AD Connect (lower than 1.1.484.0) need to be able to communicate with Azure AD over port 9090.

### Enabling the Azure AD Seamless SSO feature

Azure AD Seamless SSO can be enabled via Azure AD Connect.

If you are performing a new installation of Azure AD Connect, choose the [custom installation path](active-directory-aadconnect-get-started-custom.md). At the "User sign-in" page, check the "Enable single sign on" option.

![Azure AD Connect - User sign-in](./media/active-directory-aadconnect-sso/sso8.png)

If you already have an installation of Azure AD Connect, setup using the [express installation](active-directory-aadconnect-get-started-express.md) or the [custom installation](active-directory-aadconnect-get-started-custom.md) path, choose "Change user sign-in page" on Azure AD Connect and click "Next". Then check the "Enable single sign on" option.

![Azure AD Connect - Change user sign-in](./media/active-directory-aadconnect-user-signin/changeusersignin.png)

Continue through the installation wizard till you get to the "Enable single sign on" page. You will need to provide domain administrator credentials for each AD forest that you synchronize to Azure AD (via Azure AD Connect) and for whose users you want to enable Seamless SSO. Note that the domain administrator credentials are not stored in Azure AD Connect or Azure AD but are only used to create the computer account and configure the Kerberos SPNs as described earlier.

At this point Seamless SSO is enabled on your tenant. Note that you will still have to complete the steps in the next section before your users can benefit from this feature.

## Rolling the feature out to your users

To roll the Seamless SSO feature out to your users, you will need to add two Azure AD URLs (https://autologon.microsoftazuread-sso.com and https://aadg.windows.net.nsatc.net) to the users' Intranet zone settings via group policy in Active Directory. Note that this only works for Internet Explorer and Google Chrome (if it shares the same set of trusted site URLs as Internet Explorer). You will need to separately configure for Mozilla Firefox.

### Why do you need this?

By default, browsers don't send Kerberos tickets to a cloud endpoint unless its URL is defined as being part of the browser's Intranet zone. The browser automatically calculates the right zone (Internet or Intranet) from the URL. For example, http://contoso/ will be mapped to the Intranet zone, whereas http://intranet.contoso.com/ will be mapped to the Internet zone (because the URL contains a period).

Because the Azure AD URLs used for Seamless SSO contain a period, they need to be explicitly added to the each browser's Intranet zone settings. This makes the browser automatically send the currently logged in user's Kerberos tickets to Azure AD. While you can do this manually on each desktop, the easiest way to add the required URLs to the Intranet zone across all users is to create a group policy in Active Directory.

### Detailed steps

1. Open the Group Policy Management tool.
2. Edit the group policy that is applied to all users, for example, the **Default Domain Policy**.
3. Navigate to **User Configuration\Administrative Templates\Windows Components\Internet Explorer\Internet Control Panel\Security Page** and select **Site to Zone Assignment List**.
![Single sign-on](./media/active-directory-aadconnect-sso/sso6.png)  
4. Enable the policy, and enter the following values/data in the dialog box. These are the Azure AD URLs where the Kerberos tickets are sent.

		Value: https://autologon.microsoftazuread-sso.com  
    	Data: 1  
    	Value: https://aadg.windows.net.nsatc.net  
    	Data: 1  
5. Click **OK** and **OK** again.

It should look like this:

![Single sign-on](./media/active-directory-aadconnect-sso/sso7.png)

>[!NOTE]
>By default, Chrome uses the same set of trusted site URLs as Internet Explorer. If you have configured different settings for Chrome, then you need to update those settings separately.

## Troubleshooting Seamless SSO

Use the following checklist for troubleshooting Seamless SSO:

1. Check if the Seamless SSO feature is enabled on your tenant in the Azure AD Connect tool. If you can't enable the feature (for example, due to a blocked port), make sure that you have all the [pre-requisites](#pre-requisites) in place. If you are still facing issues with enabling the feature, contact Microsoft Support.
2. Both the service URLs (https://autologon.microsoftazuread-sso.com and https://aadg.windows.net.nsatc.net) are defined to be part of the Intranet zone settings.
3. Ensure the corporate desktop is joined to the AD domain.
4. Ensure the user is logged on to the desktop using an AD domain account.
5. Ensure that the user's account is from an AD forest where Seamless SSO has been setup.
6. Ensure the desktop is connected on the corporate network.
7. Ensure that the desktop's time is synchronized with the Active Directory's and the Domain Controllers' time and is within 5 minutes of each other.
8. Purge existing Kerberos tickets from their desktop. This can be done by running the **klist purge** command from a command prompt.
9. Review the console logs of the browser (under "Developer Tools") to help determine potential issues.

### Domain Controller logs

If success auditing is enabled on your Domain Controller, then every time a user signs in using Seamless SSO a security entry (event 4769 associated with computer account **AzureADSSOAcc$**) is recorded in the Event log. You can find these security events by using the following query:

```
	<QueryList>
	  <Query Id="0" Path="Security">
	<Select Path="Security">*[EventData[Data[@Name='ServiceName'] and (Data='AZUREADSSOACC$')]]</Select>
	  </Query>
	</QueryList>
```
