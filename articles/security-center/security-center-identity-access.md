---
title: Monitor identity and access in Azure Security Center | Microsoft Docs
description: Learn how to use the identity and access capability in Azure Security Center to monitor your users' access activity and identity-related issues.
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
ms.date: 10/08/2020
ms.author: memildin
---

# Monitor identity and access

The security perimeter has evolved from a network perimeter to an identity perimeter. With this development, security is less about defending your network, and more about managing the security of your apps, data, and users.

By monitoring the activities and configuration settings related to identity, you can take proactive actions before an incident takes place, or reactive actions to stop attempted attacks.

## What identity and access safeguards does Security Center provide? 

Azure Security Center has two dedicated security controls for ensuring you're meeting your organization's identity and security requirements: 

 - **Manage access and permissions** - We encourage you to adopt the [least privilege access model](https://docs.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models) and ensure you grant your users only the access necessary for them to do their jobs. This control also includes recommendations for implementing [role-based access control (RBAC)](../role-based-access-control/overview.md) to control access to your resources.
 
 - **Enable MFA** - With [MFA](https://www.microsoft.com/security/business/identity/mfa) enabled, your accounts are more secure, and users can still authenticate to almost any application with single sign-on.

### Example recommendations for identity and access

Examples of recommendations you might see in these two controls on Security Center's **Recommendations** page:

- MFA should be enabled on accounts with owner permissions on your subscription
- A maximum of 3 owners should be designated for your subscription
- External accounts with read permissions should be removed from your subscription
- Deprecated accounts should be removed from your subscription (Deprecated accounts are accounts that are no longer needed, and blocked from signing in by Azure Active Directory)

> [!TIP]
> For more information about these recommendations and the others you might see in these controls, see [Identity and Access recommendations](recommendations-reference.md#recs-identity).

### Limitations

There are some limitations to Security Center's identity and access protections:

- Identity recommendations aren't available for subscriptions with more than 600 accounts. In such cases, these recommendations will be listed under "unavailable assessments".
- Identity recommendations aren't available for Cloud Solution Provider (CSP) partner's admin agents.
- Identity recommendations don’t identify accounts that are managed with a privileged identity management (PIM) system. If you're using a PIM tool, you may see inaccurate results in the **Manage access and permissions** control.

## Multi-factor authentication (MFA) and Azure Active Directory 

Enabling MFA requires [Azure Active Directory (AD) tenant permissions](../active-directory/roles/permissions-reference.md).

- If you have a premium edition of AD, enable MFA using [Conditional Access](../active-directory/conditional-access/concept-conditional-access-policy-common.md).
- If you're using AD free edition, enable **security defaults** as described in [Azure Active Directory documentation](../active-directory/fundamentals/concept-fundamentals-security-defaults.md).

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
> Alternatively, you can use Security Center's REST API method [Assessments - Get](https://docs.microsoft.com/rest/api/securitycenter/assessments/get).


## Next steps
To learn more about recommendations that apply to other Azure resource types, see the following article:

- [Protecting your network in Azure Security Center](security-center-network-recommendations.md)