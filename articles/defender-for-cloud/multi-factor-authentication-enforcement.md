---
title: Microsoft Defender for Cloud's security recommendations for MFA
description: Learn how to enforce multi-factor authentication for your Azure subscriptions using Microsoft Defender for Cloud
ms.topic: conceptual
ms.date: 01/24/2023
---

# Manage multi-factor authentication (MFA) enforcement on your subscriptions

If you're using passwords, only to authenticate your users, you're leaving an attack vector open. Users often use weak passwords or reuse them for multiple services. With [MFA](https://www.microsoft.com/security/business/identity/mfa) enabled, your accounts are more secure, and users can still authenticate to almost any application with single sign-on (SSO).

There are multiple ways to enable MFA for your Azure Active Directory (AD) users based on the licenses that your organization owns. This page provides the details for each in the context of Microsoft Defender for Cloud.


## MFA and Microsoft Defender for Cloud 

Defender for Cloud places a high value on MFA. The security control that contributes the most to your secure score is **Enable MFA**. 

The recommendations in the Enable MFA control ensure you're meeting the recommended practices for users of your subscriptions:

- MFA should be enabled on accounts with owner permissions on your subscription
- MFA should be enabled on accounts with write permissions on your subscription

There are three ways to enable MFA and be compliant with the two recommendations in Defender for Cloud: security defaults, per-user assignment, conditional access (CA) policy.

### Free option - security defaults

If you're using the free edition of Azure AD, you should use the [security defaults](../active-directory/fundamentals/concept-fundamentals-security-defaults.md) to enable multi-factor authentication on your tenant.

### MFA for Microsoft 365 Business, E3, or E5 customers

Customers with Microsoft 365 can use **Per-user assignment**. In this scenario, Azure AD MFA is either enabled or disabled for all users, for all sign-in events. There's no ability to enable multi-factor authentication for a subset of users, or under certain scenarios, and management is through the Office 365 portal.

### MFA for Azure AD Premium customers

For an improved user experience, upgrade to Azure AD Premium P1 or P2 for **conditional access (CA) policy** options. To configure a CA policy, you'll need [Azure Active Directory (AD) tenant permissions](../active-directory/roles/permissions-reference.md).

Your CA policy must:

- enforce MFA

- include the Microsoft Azure Management app ID (797f4846-ba00-4fd7-ba43-dac1f8f63013) or all apps

- not exclude the Microsoft Azure Management app ID

**Azure AD Premium P1** customers can use Azure AD CA to prompt users for multi-factor authentication during certain scenarios or events to fit your business requirements. Other licenses that include this functionality:  Enterprise Mobility + Security E3, Microsoft 365 F1, and Microsoft 365 E3.

**Azure AD Premium P2** provides the strongest security features and an improved user experience. This license adds [risk-based conditional access](../active-directory/conditional-access/howto-conditional-access-policy-risk.md) to the Azure AD Premium P1 features. Risk-based CA adapts to your users' patterns and minimizes multi-factor authentication prompts. Other licenses that include this functionality: Enterprise Mobility + Security E5 or Microsoft 365 E5.

Learn more in the [Azure Conditional Access documentation](../active-directory/conditional-access/overview.md).

## Identify accounts without multi-factor authentication (MFA) enabled

You can view the list of user accounts without MFA enabled from either the Defender for Cloud recommendations details page, or using Azure Resource Graph.

### View the accounts without MFA enabled in the Azure portal

From the recommendation details page, select a subscription from the **Unhealthy resources** list or select **Take action** and the list will be displayed.

### View the accounts without MFA enabled using Azure Resource Graph

To see which accounts don't have MFA enabled, use the following Azure Resource Graph query. The query returns all unhealthy resources - accounts - of the recommendation "MFA should be enabled on accounts with owner permissions on your subscription". 

1. Open **Azure Resource Graph Explorer**.

    :::image type="content" source="./media/multi-factor-authentication-enforcement/opening-resource-graph-explorer.png" alt-text="Launching Azure Resource Graph Explorer** recommendation page" :::

1. Enter the following query and select **Run query**.

    ```kusto
    securityresources
     | where type == "microsoft.security/assessments"
     | where properties.displayName == "MFA should be enabled on accounts with owner permissions on subscriptions"
     | where properties.status.code == "Unhealthy"
    ```

1. The `additionalData` property reveals the list of account object IDs for accounts that don't have MFA enforced. 

    > [!NOTE]
    > The accounts are shown as object IDs rather than account names to protect the privacy of the account holders.

> [!TIP]
> Alternatively, you can use the Defender for Cloud REST API method [Assessments - Get](/rest/api/defenderforcloud/assessments/get).


## FAQ - MFA in Defender for Cloud

- [We're already using CA policy to enforce MFA. Why do we still get the Defender for Cloud recommendations?](#were-already-using-ca-policy-to-enforce-mfa-why-do-we-still-get-the-defender-for-cloud-recommendations)
- [We're using a third-party MFA tool to enforce MFA. Why do we still get the Defender for Cloud recommendations?](#were-using-a-third-party-mfa-tool-to-enforce-mfa-why-do-we-still-get-the-defender-for-cloud-recommendations)
- [Why does Defender for Cloud show user accounts without permissions on the subscription as "requiring MFA"?](#why-does-defender-for-cloud-show-user-accounts-without-permissions-on-the-subscription-as-requiring-mfa)
- [We're enforcing MFA with PIM. Why are PIM accounts shown as noncompliant?](#were-enforcing-mfa-with-pim-why-are-pim-accounts-shown-as-noncompliant)
- [Can I exempt or dismiss some of the accounts?](#can-i-exempt-or-dismiss-some-of-the-accounts)
- [Are there any limitations to Defender for Cloud's identity and access protections?](#are-there-any-limitations-to-defender-for-clouds-identity-and-access-protections)

### We're already using CA policy to enforce MFA. Why do we still get the Defender for Cloud recommendations?
To investigate why the recommendations are still being generated, verify the following configuration options in your MFA CA policy:

- You've included the accounts in the **Users** section of your MFA CA policy (or one of the groups in the **Groups** section)
- The Azure Management app ID (797f4846-ba00-4fd7-ba43-dac1f8f63013), or all apps, are included in the **Apps** section of your MFA CA policy
- The Azure Management app ID isn't excluded in the **Apps** section of your MFA CA policy

### We're using a third-party MFA tool to enforce MFA. Why do we still get the Defender for Cloud recommendations?
Defender for Cloud's MFA recommendations doesn't support third-party MFA tools (for example, DUO).

If the recommendations are irrelevant for your organization, consider marking them as "mitigated" as described in [Exempting resources and recommendations from your secure score](exempt-resource.md). You can also [disable a recommendation](tutorial-security-policy.md#disable-a-security-recommendation).

### Why does Defender for Cloud show user accounts without permissions on the subscription as "requiring MFA"?
Defender for Cloud's MFA recommendations refers to [Azure RBAC](../role-based-access-control/role-definitions-list.md) roles and the [Azure classic subscription administrators](../role-based-access-control/classic-administrators.md) role. Verify that none of the accounts have such roles.

### We're enforcing MFA with PIM. Why are PIM accounts shown as noncompliant?
Defender for Cloud's MFA recommendations currently doesn't support PIM accounts. You can add these accounts to a CA Policy in the Users/Group section.

### Can I exempt or dismiss some of the accounts?

The capability to exempt some accounts that don’t use MFA is available on the new recommendations in preview:

- Accounts with owner permissions on Azure resources should be MFA enabled
- Accounts with write permissions on Azure resources should be MFA enabled
- Accounts with read permissions on Azure resources should be MFA enabled

To exempt account(s), follow these steps:

1. Select an MFA recommendation associated with an unhealthy account.
1. In the Accounts tab, select an account to exempt.
1. Select the three dots button, then select **Exempt account**.
1. Select a scope and exemption reason. 

If you would like to see which accounts are exempt, navigate to **Exempted accounts** for each recommendation.

> [!TIP]
> When you exempt an account, it won't be shown as unhealthy and won't cause a subscription to appear unhealthy.

### Are there any limitations to Defender for Cloud's identity and access protections?
There are some limitations to Defender for Cloud's identity and access protections:

- Identity recommendations aren't available for subscriptions with more than 6,000 accounts. In these cases, these types of subscriptions will be listed under Not applicable tab.
- Identity recommendations aren't available for Cloud Solution Provider (CSP) partner's admin agents.
- Identity recommendations don’t identify accounts that are managed with a privileged identity management (PIM) system. If you're using a PIM tool, you might see inaccurate results in the **Manage access and permissions** control.
- Identity recommendations don't support Azure AD conditional access policies with included Directory Roles instead of users and groups.

## Next steps
To learn more about recommendations that apply to other Azure resource types, see the following article:

- [Protecting your network in Microsoft Defender for Cloud](protect-network-resources.md)
