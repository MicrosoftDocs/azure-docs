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
# Conditional access baseline protection policies

Baseline policies are a set of predefined conditional access policies that help protect organizations against many common attacks such as password spray, breach replay, and phishing. While managing custom conditional access policies requires an Azure AD Premium license, baseline policies are available in all editions of Azure AD. Microsoft is making these baseline protection policies available to everyone because identity-based attacks have been on the rise over the last few years. The goal of these four policies is to ensure that all organizations have a baseline level of security enabled at no extra cost.

## Baseline Policies

There are four baseline policies that organizations can enable:

* Require MFA for admins
* End user protection (preview)
* Block legacy authentication (preview)
* Require MFA for service management (preview)

All four of these policies will impact legacy authentication flows like POP, IMAP, and older Office desktop clients.

### Require MFA for admins

Due to the power and access that administrator accounts have, you should treat them with special care. One common method to improve the protection of privileged accounts is to require a stronger form of account verification when they are used to sign in. In Azure Active Directory, you can get a stronger account verification by requiring administrators to register for and use Azure Multi-Factor Authentication.

Require MFA for admins is a baseline policy that requires multi-factor authentication (MFA) for the following directory roles, considered to be the most privileged Azure AD roles:

* Global administrator
* SharePoint administrator
* Exchange administrator
* Conditional access administrator
* Security administrator
* Helpdesk administrator / Password administrator
* Billing administrator
* User administrator

If your organization has privileged accounts in use in scripts or code, you should replace them with [managed identities for Azure resources](../managed-identities-azure-resources/overview.md) or [service principals with certificates](../develop/howto-authenticate-service-principal-powershell.md). As a temporary workaround, you can exclude specific user accounts from the baseline policy.

### End user protection (preview)

High privileged administrators aren’t the only ones targeted in attacks. Bad actors tend to target normal users. After gaining access, these bad actors can request access to privileged information on behalf of the original account holder or download the entire directory and perform a phishing attack on your whole organization. One common method to improve the protection for all users is to require a stronger form of account verification when a risky sign-in is detected.

**End user protection (preview)** is a baseline policy that protects all users in a directory. Enabling this policy requires all users to register for Azure Multi-Factor Authentication within 14 days of accessing an application. Once registered, users will be prompted for MFA only during risky sign-in attempts. Compromised user accounts are blocked until password reset and risk dismissal.

### Block legacy authentication (preview)

Legacy authentication protocols (ex: IMAP, SMTP, POP3) are protocols normally used by older mail clients to authenticate. Legacy protocols do not support multi-factor authentication. Even if you have a policy requiring multi-factor authentication for your directory, a bad actor can authenticate using one of these legacy protocols and bypass multi-factor authentication.

The best way to protect your account from malicious authentication requests made by legacy protocols is to block them.

The **Block legacy authentication (preview)** baseline policy blocks all authentication requests that are made using legacy protocols. Modern authentication must be used to successfully sign in for all users. Used in conjunction with the other baseline policies, all requests coming from legacy protocols will be blocked and all users will be required to MFA whenever required. This policy does not block Exchange ActiveSync.

### Require MFA for service management (preview)

You might be using a variety of Azure services in your organization. These services can be managed through Azure Resource Manager (ARM) API, whether that’s Azure portal, Azure PowerShell, or Azure CLI. Using any of these applications to perform resource management is a highly privileged action. These actions can alter subscription-wide configurations, such as service settings and subscription billing.

To protect privileged actions, this **Require MFA for service management (preview)** policy will require multi-factor authentication for any user accessing Azure portal, Azure PowerShell, or Azure CLI.

## Testing a baseline policy

Baseline policies affect your entire directory. To better understand the behavior of each policy and to ensure a smooth deployment, each baseline policy can be tested with up to 50 users. Each baseline policy can be tested independently. Testing one baseline policy with 50 users does not affect the other policies.

To test a baseline policy:

1. Sign in to the **Azure portal** as global administrator, security administrator, or conditional access administrator.
1. Browse to **Azure Active Directory** > **Conditional Access**
1. In the list of policies, select the baseline policy to test.
1. Click on the Users picker underneath the Enable Policy buttons.
1. Under the Include tab, select the Select users option. To test the policy, click on Select and choose up to 50 users. The policy will only apply to the users selected. If you are testing “Baseline policy: Require MFA for admins”, you can only select administrators covered by this policy. Administrators outside of the nine accepted roles and end users cannot be chosen to test the policy.
1. Once test users have been selected, click Select and then Done to save your selection.
1. Enable the policy by selecting the Use policy immediately button. Click Save. The policy will now be enforced only for the users selected.

## Enable a baseline policy

To enable a baseline policy:

1. Sign in to the **Azure portal** as global administrator, security administrator, or conditional access administrator.
1. Browse to **Azure Active Directory** > **Conditional Access**
1. In the list of policies, select a baseline policy you’d like to enable
1. Set **Enable policy** to **On**
1. Click Save.

## Next steps

For more information, see:
[Five steps to securing your identity infrastructure](../security/azure-ad-secure-steps.md)
[What is conditional access in Azure Active Directory?](overview.md)
