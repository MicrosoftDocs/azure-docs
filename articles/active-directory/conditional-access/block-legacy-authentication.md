---
title: Block legacy authentication
description: Block legacy authentication using Azure AD Conditional Access.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 07/18/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, jebeckha, grtaylor

ms.collection: M365-identity-device-management
---
# Block legacy authentication with Azure AD Conditional Access   

To give your users easy access to your cloud apps, Azure Active Directory (Azure AD) supports a broad variety of authentication protocols including legacy authentication. However, legacy authentication doesn't support things like multifactor authentication (MFA). MFA is a common requirement to improve security posture in organizations. 

Based on Microsoft's analysis more than 97 percent of credential stuffing attacks use legacy authentication and more than 99 percent of password spray attacks use legacy authentication protocols. These attacks would stop with basic authentication disabled or blocked.

> [!NOTE]
> Effective October 1, 2022, we will begin to permanently disable Basic Authentication for Exchange Online in all Microsoft 365 tenants regardless of usage, except for SMTP Authentication. For more information, see the article [Deprecation of Basic authentication in Exchange Online](/exchange/clients-and-mobile-in-exchange-online/deprecation-of-basic-authentication-exchange-online)

Alex Weinert, Director of Identity Security at Microsoft, in his March 12, 2020 blog post [New tools to block legacy authentication in your organization](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/new-tools-to-block-legacy-authentication-in-your-organization/ba-p/1225302#) emphasizes why organizations should block legacy authentication and what other tools Microsoft provides to accomplish this task:

This article explains how you can configure Conditional Access policies that block legacy authentication for all workloads within your tenant. 

While rolling out legacy authentication blocking protection, we recommend a phased approach, rather than disabling it for all users all at once. Customers may choose to first begin disabling basic authentication on a per-protocol basis, by applying Exchange Online authentication policies, then (optionally) also blocking legacy authentication via Conditional Access policies when ready.

Customers without licenses that include Conditional Access can make use of [security defaults](../fundamentals/security-defaults.md) to block legacy authentication.

## Prerequisites

This article assumes that you're familiar with the [basic concepts](overview.md) of Azure AD Conditional Access.

> [!NOTE]
> Conditional Access policies are enforced after first-factor authentication is completed. Conditional Access isn't intended to be an organization's first line of defense for scenarios like denial-of-service (DoS) attacks, but it can use signals from these events to determine access.

## Scenario description

Azure AD supports the most widely used authentication and authorization protocols including legacy authentication. Legacy authentication can't prompt users for second factor authentication or other authentication requirements needed to satisfy Conditional Access policies, directly. This authentication pattern includes basic authentication, a widely used industry-standard method for collecting user name and password information.  Examples of applications that commonly or only use legacy authentication are:

- Microsoft Office 2013 or older.
- Apps using mail protocols like POP, IMAP, and SMTP AUTH.

For more information about modern authentication support in Office, see [How modern authentication works for Office client apps](/microsoft-365/enterprise/modern-auth-for-office-2013-and-2016).

Single factor authentication (for example, username and password) isn't enough these days. Passwords are bad as they're easy to guess and we (humans) are bad at choosing good passwords. Passwords are also vulnerable to various attacks, like phishing and password spray. One of the easiest things you can do to protect against password threats is to implement multifactor authentication (MFA). With MFA, even if an attacker gets in possession of a user's password, the password alone isn't sufficient to successfully authenticate and access the data.

How can you prevent apps using legacy authentication from accessing your tenant's resources? The recommendation is to just block them with a Conditional Access policy. If necessary, you allow only certain users and specific network locations to use apps that are based on legacy authentication.

## Implementation

This section explains how to configure a Conditional Access policy to block legacy authentication.

### Messaging protocols that support legacy authentication

The following messaging protocols support legacy authentication:

- Authenticated SMTP - Used to send authenticated email messages.
- Autodiscover - Used by Outlook and EAS clients to find and connect to mailboxes in Exchange Online.
- Exchange ActiveSync (EAS) - Used to connect to mailboxes in Exchange Online.
- Exchange Online PowerShell - Used to connect to Exchange Online with remote PowerShell. If you block Basic authentication for Exchange Online PowerShell, you need to use the Exchange Online PowerShell Module to connect. For instructions, see [Connect to Exchange Online PowerShell using multifactor authentication](/powershell/exchange/exchange-online/connect-to-exchange-online-powershell/mfa-connect-to-exchange-online-powershell).
- Exchange Web Services (EWS) - A programming interface that's used by Outlook, Outlook for Mac, and third-party apps.
- IMAP4 - Used by IMAP email clients.
- MAPI over HTTP (MAPI/HTTP) - Primary mailbox access protocol used by Outlook 2010 SP2 and later.
- Offline Address Book (OAB) - A copy of address list collections that are downloaded and used by Outlook.
- Outlook Anywhere (RPC over HTTP) - Legacy mailbox access protocol supported by all current Outlook versions.
- POP3 - Used by POP email clients.
- Reporting Web Services - Used to retrieve report data in Exchange Online.
- Universal Outlook - Used by the Mail and Calendar app for Windows 10.
- Other clients - Other protocols identified as utilizing legacy authentication.

For more information about these authentication protocols and services, see [Sign-in activity reports in the Azure portal](../reports-monitoring/concept-sign-ins.md#filter-sign-in-activities).

### Identify legacy authentication use

Before you can block legacy authentication in your directory, you need to first understand if your users have client apps that use legacy authentication.

#### Sign-in log indicators

1. Navigate to the **Azure portal** > **Azure Active Directory** > **Sign-in logs**.
1. Add the **Client App** column if it isn't shown by clicking on **Columns** > **Client App**.
1. Select **Add filters** > **Client App** > choose all of the legacy authentication protocols and select **Apply**.
1. If you've activated the [new sign-in activity reports preview](../reports-monitoring/concept-all-sign-ins.md), repeat the above steps also on the **User sign-ins (non-interactive)** tab.

Filtering shows you sign-in attempts made by legacy authentication protocols. Clicking on each individual sign-in attempt shows you more details. The **Client App** field under the **Basic Info** tab indicates which legacy authentication protocol was used.

These logs indicate where users are using clients that are still depending on legacy authentication. For users that don't appear in these logs and are confirmed to not be using legacy authentication, implement a Conditional Access policy for these users only.

Additionally, to help triage legacy authentication within your tenant use the [Sign-ins using legacy authentication workbook](../reports-monitoring/workbook-legacy%20authentication.md).

#### Indicators from client

To determine if a client is using legacy or modern authentication based on the dialog box presented at sign-in, see the article [Deprecation of Basic authentication in Exchange Online](/exchange/clients-and-mobile-in-exchange-online/deprecation-of-basic-authentication-exchange-online#authentication-dialog).

## Important considerations

Many clients that previously only supported legacy authentication now support modern authentication. Clients that support both legacy and modern authentication may require configuration update to move from legacy to modern authentication. If you see **modern mobile**, **desktop client** or **browser** for a client in the Sign-in logs, it's using modern authentication. If it has a specific client or protocol name, such as **Exchange ActiveSync**, it's using legacy authentication. The client types in Conditional Access, Sign-in logs, and the legacy authentication workbook distinguish between modern and legacy authentication clients for you.

- Clients that support modern authentication but aren't configured to use modern authentication should be updated or reconfigured to use modern authentication.
- All clients that don't support modern authentication should be replaced.

> [!IMPORTANT]
>
> **Exchange Active Sync with Certificate-based authentication (CBA)**
>
> When implementing Exchange Active Sync (EAS) with CBA, configure clients to use modern authentication. Clients not using modern authentication for EAS with CBA **are not blocked** with [Deprecation of Basic authentication in Exchange Online](/exchange/clients-and-mobile-in-exchange-online/deprecation-of-basic-authentication-exchange-online). However, these clients **are blocked** by Conditional Access policies configured to block legacy authentication.
>
> For more Information on implementing support for CBA with Azure AD and modern authentication See: [How to configure Azure AD certificate-based authentication (Preview)](../authentication/how-to-certificate-based-authentication.md). As another option, CBA performed at a federation server can be used with modern authentication.


If you're using Microsoft Intune, you might be able to change the authentication type using the email profile you push or deploy to your devices. If you're using iOS devices (iPhones and iPads), you should take a look at [Add e-mail settings for iOS and iPadOS devices in Microsoft Intune](/mem/intune/configuration/email-settings-ios).

## Block legacy authentication

There are two ways to use Conditional Access policies to block legacy authentication.

- [Directly blocking legacy authentication](#directly-blocking-legacy-authentication)
- [Indirectly blocking legacy authentication](#indirectly-blocking-legacy-authentication)
 
### Directly blocking legacy authentication

The easiest way to block legacy authentication across your entire organization is by configuring a Conditional Access policy that applies specifically to legacy authentication clients and blocks access. When assigning users and applications to the policy, make sure to exclude users and service accounts that still need to sign in using legacy authentication. When choosing the cloud apps in which to apply this policy, select All cloud apps, targeted apps such as Office 365 (recommended) or at a minimum, Office 365 Exchange Online. Organizations can use the policy available in [Conditional Access templates](concept-conditional-access-policy-common.md) or the common policy [Conditional Access: Block legacy authentication](howto-conditional-access-policy-block-legacy.md) as a reference.

### Indirectly blocking legacy authentication

If your organization isn't ready to block legacy authentication completely, you should ensure that sign-ins using legacy authentication aren't bypassing policies that require grant controls like multifactor authentication. During authentication, legacy authentication clients don't support sending MFA, device compliance, or join state information to Azure AD. Therefore, apply policies with grant controls to all client applications so that legacy authentication based sign-ins that can’t satisfy the grant controls are blocked. With the general availability of the client apps condition in August 2020, newly created Conditional Access policies apply to all client apps by default.

## What you should know

It can take up to 24 hours for the Conditional Access policy to go into effect.

Blocking access using **Other clients** also blocks Exchange Online PowerShell and Dynamics 365 using basic auth.

Configuring a policy for **Other clients** blocks the entire organization from certain clients like SPConnect. This block happens because older clients authenticate in unexpected ways. The issue doesn't apply to major Office applications like the older Office clients.

You can select all available grant controls for the **Other clients** condition; however, the end-user experience is always the same - blocked access.

## Next steps

- [Determine effect using Conditional Access report-only mode](howto-conditional-access-insights-reporting.md)
- If you aren't familiar with configuring Conditional Access policies yet, see [require MFA for specific apps with Azure Active Directory Conditional Access](../authentication/tutorial-enable-azure-mfa.md) for an example.
- For more information about modern authentication support, see [How modern authentication works for Office client apps](/office365/enterprise/modern-auth-for-office-2013-and-2016) 
- [How to set up a multifunction device or application to send email using Microsoft 365](/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365)
- [Enable modern authentication in Exchange Online](/exchange/clients-and-mobile-in-exchange-online/enable-or-disable-modern-authentication-in-exchange-online)
- [Enable Modern Authentication for Office 2013 on Windows devices](/office365/admin/security-and-compliance/enable-modern-authentication)
- [How to configure Exchange Server on-premises to use Hybrid Modern Authentication](/office365/enterprise/configure-exchange-server-for-hybrid-modern-authentication)
- [How to use Modern Authentication with Skype for Business](/skypeforbusiness/manage/authentication/use-adal)
