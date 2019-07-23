---
title: Conditional Access baseline protection policies - Azure Active Directory
description: Baseline Conditional Access policies to protect organizations from common attacks

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
# What are baseline policies?

Baseline policies are a set of predefined  policies that help protect organizations against many common attacks. These common attacks can include password spray, replay, and phishing. Baseline policies are available in all editions of Azure AD. Microsoft is making these baseline protection policies available to everyone because identity-based attacks have been on the rise over the last few years. The goal of these four policies is to ensure that all organizations have a baseline level of security enabled at no extra cost.  

Managing customized Conditional Access policies requires an Azure AD Premium license.

## Baseline policies

![Conditional Access baseline policies in the Azure portal](./media/concept-baseline-protection/conditional-access-baseline-policies.png)

There are four baseline policies that organizations can enable:

* [Require MFA for admins (preview)](howto-baseline-protect-administrators.md)
* [End user protection (preview)](howto-baseline-protect-end-users.md)
* [Block legacy authentication (preview)](howto-baseline-protect-legacy-auth.md)
* [Require MFA for service management (preview)](howto-baseline-protect-azure.md)

All four of these policies will impact legacy authentication flows like POP, IMAP, and older Office desktop clients.

### Require MFA for admins (preview)

Due to the power and access that administrator accounts have, you should treat them with special care. One common method to improve the protection of privileged accounts is to require a stronger form of account verification when they are used to sign in. In Azure Active Directory, you can get a stronger account verification by requiring administrators to register for and use Azure Multi-Factor Authentication.

[Require MFA for admins (preview)](howto-baseline-protect-administrators.md) is a baseline policy that requires multi-factor authentication (MFA) for the following directory roles, considered to be the most privileged Azure AD roles:

* Global administrator
* SharePoint administrator
* Exchange administrator
* Conditional Access administrator
* Security administrator
* Helpdesk administrator / Password administrator
* Billing administrator
* User administrator

If your organization has these accounts in use in scripts or code, consider replacing them with [managed identities](../managed-identities-azure-resources/overview.md).

### End user protection (preview)

High privileged administrators aren’t the only ones targeted in attacks. Bad actors tend to target normal users. After gaining access, these bad actors can request access to privileged information on behalf of the original account holder or download the entire directory and perform a phishing attack on your whole organization. One common method to improve the protection for all users is to require a stronger form of account verification when a risky sign-in is detected.

**End user protection (preview)** is a baseline policy that protects all users in a directory. Enabling this policy requires all users to register for Azure Multi-Factor Authentication within 14 days. Once registered, users will be prompted for MFA only during risky sign-in attempts. Compromised user accounts are blocked until password reset and risk dismissal.

### Block legacy authentication (preview)

Legacy authentication protocols (ex: IMAP, SMTP, POP3) are protocols normally used by older mail clients to authenticate. Legacy protocols do not support multi-factor authentication. Even if you have a policy requiring multi-factor authentication for your directory, a bad actor can authenticate using one of these legacy protocols and bypass multi-factor authentication.

The best way to protect your account from malicious authentication requests made by legacy protocols is to block them.

The **Block legacy authentication (preview)** baseline policy blocks authentication requests that are made using legacy protocols. Modern authentication must be used to successfully sign in for all users. Used in conjunction with the other baseline policies, requests coming from legacy protocols will be blocked. In addition, all users will be required to MFA whenever required. This policy does not block Exchange ActiveSync.

### Require MFA for service management (preview)

Organizations use a variety of Azure services and manage them from Azure Resource Manager based tools like:

* Azure portal
* Azure PowerShell
* Azure CLI

Using any of these tools to perform resource management is a highly privileged action. These tools can alter subscription-wide configurations, such as service settings and subscription billing.

To protect privileged actions, this **Require MFA for service management (preview)** policy will require multi-factor authentication for any user accessing Azure portal, Azure PowerShell, or Azure CLI.

## Enable a baseline policy

To enable a baseline policy:

1. Sign in to the **Azure portal** as global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Conditional Access**.
1. In the list of policies, select a baseline policy you’d like to enable.
1. Set **Enable policy** to **On**.
1. Click Save.

## Next steps

For more information, see:

* [Five steps to securing your identity infrastructure](../../security/azure-ad-secure-steps.md)
* [What is Conditional Access in Azure Active Directory?](overview.md)
* [Require MFA for admins (preview)](howto-baseline-protect-administrators.md)
* [End user protection (preview)](howto-baseline-protect-end-users.md)
* [Block legacy authentication (preview)](howto-baseline-protect-legacy-auth.md)
* [Require MFA for service management (preview)](howto-baseline-protect-azure.md)
