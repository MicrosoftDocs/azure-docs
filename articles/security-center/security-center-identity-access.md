---
title: Azure Security Center's security recommendations for MFA
description: Learn how to enforce multi-factor authentication for your Azure subscriptions using Azure Security Center
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 9f04e730-4cfa-4078-8eec-905a443133da
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/11/2021
ms.author: memildin
---

# Configure multi-factor authentication (MFA) on your subscriptions

The security perimeter has evolved from a network perimeter to an identity perimeter. With this development, security is less about defending your network, and more about managing the security of your apps, data, and users.

The security control that contributes the most to your secure score is **Enable MFA**. If you only use a password to authenticate a user, it leaves an attack vector open. If the password is weak or has been exposed elsewhere, is it really the user signing in with the username and password? With MFA enabled, your accounts are more secure, and users can still authenticate to almost any application with single sign-on (SSO).

## What MFA recommendations are Security Center provide? 

Azure Security Center has a dedicated security control for ensuring you're meeting the recommended practice of enabling MFA for users of your subscriptions: 

- **Enable MFA** - With [MFA](https://www.microsoft.com/security/business/identity/mfa) enabled, your accounts are more secure, and users can still authenticate to almost any application with single sign-on. This control includes two recommendations:

    - MFA should be enabled on accounts with owner permissions on your subscription
    - MFA should be enabled on accounts with write permissions on your subscription

There are three ways to enable MFA and be compliant with the two recommendations in Security Center:

- **Per-user assignment**
- **Conditional Access (CA) Policy** - To enable MFA using conditional access, you need:

    - An Active Directory Premium license
    - [Azure Active Directory (AD) tenant permissions](../active-directory/roles/permissions-reference.md)
    - A CA policy that enforces MFA, includes the Microsoft Azure Management App Id (797f4846-ba00-4fd7-ba43-dac1f8f63013) or All apps, and doesn't exclude Microsoft Azure Management App Id 

    Learn more in the [Azure Conditional Access documentation](../active-directory/conditional-access/overview.md).

- **Security Defaults** - To enable MFA on an entire tenant, or if you're using the free edition of Azure AD, enable security defaults as described in [Azure Active Directory documentation](../active-directory/fundamentals/concept-fundamentals-security-defaults.md).





## Limitations

There are some limitations to Security Center's identity and access protections:

- Identity recommendations aren't available for subscriptions with more than 600 accounts. In such cases, these recommendations will be listed under "unavailable assessments".
- Identity recommendations aren't available for Cloud Solution Provider (CSP) partner's admin agents.
- Identity recommendations don’t identify accounts that are managed with a privileged identity management (PIM) system. If you're using a PIM tool, you might see inaccurate results in the **Manage access and permissions** control.

## Multi-factor authentication (MFA) and Azure Active Directory 

Enabling MFA requires [Azure Active Directory (AD) tenant permissions](../active-directory/roles/permissions-reference.md).

- If you have a premium edition of AD, enable MFA using [Conditional Access](../active-directory/conditional-access/concept-conditional-access-policy-common.md).


## Identify accounts without multi-factor authentication (MFA) enabled

To see which accounts don't have MFA enabled, use the following Azure Resource Graph query. The query returns all unhealthy resources - accounts - of the recommendation "MFA should be enabled on accounts with owner permissions on your subscription". 

1. Open **Azure Resource Graph Explorer**.

    :::image type="content" source="./media/security-center-identity-access/opening-resource-graph-explorer.png" alt-text="Launching Azure Resource Graph Explorer** recommendation page" :::

1. Enter the following query and select **Run query**.

    ```kusto
    securityresources
     | where type == "microsoft.security/assessments"
     | where properties.displayName == "MFA should be enabled on accounts with owner permissions on your subscription"
     | where properties.status.code == "Unhealthy"
    ```

1. The `additionalData` property reveals the list of account object IDs for accounts that don't have MFA enforced. 

    > [!NOTE]
    > The accounts are shown as object IDs rather than account names to protect the privacy of the account holders.

> [!TIP]
> Alternatively, you can use Security Center's REST API method [Assessments - Get](/rest/api/securitycenter/assessments/get).


## Next steps
To learn more about recommendations that apply to other Azure resource types, see the following article:

- [Protecting your network in Azure Security Center](security-center-network-recommendations.md)