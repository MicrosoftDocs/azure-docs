---
title: Block legacy authentication - Azure Active Directory
description: Learn how to improve your security posture by blocking legacy authentication using Azure AD Conditional Access.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 01/26/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, dawoo

ms.collection: M365-identity-device-management
---
# How to: Block legacy authentication to Azure AD with Conditional Access   

To give your users easy access to your cloud apps, Azure Active Directory (Azure AD) supports a broad variety of authentication protocols including legacy authentication. However, legacy protocols don't support multi-factor authentication (MFA). MFA is in many environments a common requirement to address identity theft. 

Alex Weinert, Director of Identity Security at Microsoft, in his March 12, 2020 blog post [New tools to block legacy authentication in your organization](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/new-tools-to-block-legacy-authentication-in-your-organization/ba-p/1225302#) emphasizes why organizations should block legacy authentication and what other tools Microsoft provides to accomplish this task:

> For MFA to be effective, you also need to block legacy authentication. This is because legacy authentication protocols like POP, SMTP, IMAP, and MAPI can't enforce MFA, making them preferred entry points for adversaries attacking your organization...
> 
>...The numbers on legacy authentication from an analysis of Azure Active Directory (Azure AD) traffic are stark:
> 
> - More than 99 percent of password spray attacks use legacy authentication protocols
> - More than 97 percent of credential stuffing attacks use legacy authentication
> - Azure AD accounts in organizations that have disabled legacy authentication experience 67 percent fewer compromises than those where legacy authentication is enabled
>

If your environment is ready to block legacy authentication to improve your tenant's protection, you can accomplish this goal with Conditional Access. This article explains how you can configure Conditional Access policies that block legacy authentication for your tenant. Customers without licenses that include Conditional Access can make use of [security defaults](../fundamentals/concept-fundamentals-security-defaults.md)) to block legacy authentication.

## Prerequisites

This article assumes that you are familiar with the [basic concepts](overview.md) of Azure AD Conditional Access.

## Scenario description

Azure AD supports several of the most widely used authentication and authorization protocols including legacy authentication. Legacy authentication refers to protocols that use basic authentication. Typically, these protocols can't enforce any type of second factor authentication. Examples for apps that are based on legacy authentication are:

- Older Microsoft Office apps
- Apps using mail protocols like POP, IMAP, and SMTP

Single factor authentication (for example, username and password) is not enough these days. Passwords are bad as they are easy to guess and we (humans) are bad at choosing good passwords. Passwords are also vulnerable to various attacks, like phishing and password spray. One of the easiest things you can do to protect against password threats is to implement multi-factor authentication (MFA). With MFA, even if an attacker gets in possession of a user's password, the password alone is not sufficient to successfully authenticate and access the data.

How can you prevent apps using legacy authentication from accessing your tenant's resources? The recommendation is to just block them with a Conditional Access policy. If necessary, you allow only certain users and specific network locations to use apps that are based on legacy authentication.

Conditional Access policies are enforced after the first-factor authentication has been completed. Therefore, Conditional Access is not intended as a first line defense for scenarios like denial-of-service (DoS) attacks, but can utilize signals from these events (for example, the sign-in risk level, location of the request, and so on) to determine access.

## Implementation

This section explains how to configure a Conditional Access policy to block legacy authentication. 

### Legacy authentication protocols

The following options are considered legacy authentication protocols

- Authenticated SMTP - Used by POP and IMAP clients to send email messages.
- Autodiscover - Used by Outlook and EAS clients to find and connect to mailboxes in Exchange Online.
- Exchange ActiveSync (EAS) - Used to connect to mailboxes in Exchange Online.
- Exchange Online PowerShell - Used to connect to Exchange Online with remote PowerShell. If you block Basic authentication for Exchange Online PowerShell, you need to use the Exchange Online PowerShell Module to connect. For instructions, see [Connect to Exchange Online PowerShell using multi-factor authentication](/powershell/exchange/exchange-online/connect-to-exchange-online-powershell/mfa-connect-to-exchange-online-powershell).
- Exchange Web Services (EWS) - A programming interface that's used by Outlook, Outlook for Mac, and third-party apps.
- IMAP4 - Used by IMAP email clients.
- MAPI over HTTP (MAPI/HTTP) - Used by Outlook 2010 and later.
- Offline Address Book (OAB) - A copy of address list collections that are downloaded and used by Outlook.
- Outlook Anywhere (RPC over HTTP) - Used by Outlook 2016 and earlier.
- Outlook Service - Used by the Mail and Calendar app for Windows 10.
- POP3 - Used by POP email clients.
- Reporting Web Services - Used to retrieve report data in Exchange Online.
- Other clients - Other protocols identified as utilizing legacy authentication.

For more information about these authentication protocols and services, see [Sign-in activity reports in the Azure Active Directory portal](../reports-monitoring/concept-sign-ins.md#filter-sign-in-activities).

### Identify legacy authentication use

Before you can block legacy authentication in your directory, you need to first understand if your users have apps that use legacy authentication and how it affects your overall directory. Azure AD sign-in logs can be used to understand if you're using legacy authentication.

1. Navigate to the **Azure portal** > **Azure Active Directory** > **Sign-ins**.
1. Add the Client App column if it is not shown by clicking on **Columns** > **Client App**.
1. **Add filters** > **Client App** > select all of the legacy authentication protocols. Select outside the filtering dialog box to apply your selections and close the dialog box.
1. If you have activated the [new sign-in activity reports preview](../reports-monitoring/concept-all-sign-ins.md), repeat the above steps also on the **User sign-ins (non-interactive)** tab.

Filtering will only show you sign-in attempts that were made by legacy authentication protocols. Clicking on each individual sign-in attempt will show you more details. The **Client App** field under the **Basic Info** tab will indicate which legacy authentication protocol was used.

These logs will indicate which users are still depending on legacy authentication and which applications are using legacy protocols to make authentication requests. For users that do not appear in these logs and are confirmed to not be using legacy authentication, implement a Conditional Access policy for these users only.

## Block legacy authentication 

There are two ways to use Conditional Access policies to block legacy authentication.

- [Directly blocking legacy authentication](#directly-blocking-legacy-authentication)
- [Indirectly blocking legacy authentication](#indirectly-blocking-legacy-authentication)
 
### Directly blocking legacy authentication

The easiest way to block legacy authentication across your entire organization is by configuring a Conditional Access policy that applies specifically to legacy authentication clients and blocks access. When assigning users and applications to the policy, make sure to exclude users and service accounts that still need to sign in using legacy authentication. Configure the client apps condition by selecting **Exchange ActiveSync clients** and **Other clients**. To block access for these client apps, configure the access controls to Block access.

![Client apps condition configured to block legacy auth](./media/block-legacy-authentication/client-apps-condition-configured-yes.png)

### Indirectly blocking legacy authentication

Even if your organization isn’t ready to block legacy authentication across the entire organization, you should ensure that sign-ins using legacy authentication aren’t bypassing policies that require grant controls such as requiring multi-factor authentication or compliant/hybrid Azure AD joined devices. During authentication, legacy authentication clients do not support sending MFA, device compliance, or join state information to Azure AD. Therefore, apply policies with grant controls to all client applications so that legacy authentication based sign-ins that cannot satisfy the grant controls are blocked. With the general availability of the client apps condition in August 2020, newly created Conditional Access policies apply to all client apps by default.

![Client apps condition default configuration](./media/block-legacy-authentication/client-apps-condition-configured-no.png)

## What you should know

Blocking access using **Other clients** also blocks Exchange Online PowerShell and Dynamics 365 using basic auth.

Configuring a policy for **Other clients** blocks the entire organization from certain clients like SPConnect. This block happens because older clients authenticate in unexpected ways. The issue doesn't apply to major Office applications like the older Office clients.

It can take up to 24 hours for the policy to go into effect.

You can select all available grant controls for the **Other clients** condition; however, the end-user experience is always the same - blocked access.

### SharePoint Online and B2B guest users

To block B2B user access via legacy authentication to SharePoint Online, organizations must disable legacy authentication on SharePoint using the `Set-SPOTenant` PowerShell command and setting the `-LegacyAuthProtocolsEnabled` parameter to `$false`. More information about setting this parameter can be found in the SharePoint PowerShell reference document regarding [Set-SPOTenant](/powershell/module/sharepoint-online/set-spotenant)

## Next steps

- [Determine impact using Conditional Access report-only mode](howto-conditional-access-insights-reporting.md)
- If you are not familiar with configuring Conditional Access policies yet, see [require MFA for specific apps with Azure Active Directory Conditional Access](../authentication/tutorial-enable-azure-mfa.md) for an example.
- For more information about modern authentication support, see [How modern authentication works for Office 2013 and Office 2016 client apps](/office365/enterprise/modern-auth-for-office-2013-and-2016) 
- [How to set up a multifunction device or application to send email using Microsoft 365](/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365)