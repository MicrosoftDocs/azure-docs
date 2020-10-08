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
ms.date: 03/16/2020
ms.author: memildin
---

# Monitor identity and access

The security perimeter has evolved from a network perimeter to an identity perimeter. Security becomes less about defending your network and more about defending your data, as well as managing the security of your apps and users. Nowadays, with more data and more apps moving to the cloud, identity becomes the new perimeter.

By monitoring the activities and configuration settings related to identity and multi-factor authentication (MFA), you can take proactive actions before an incident takes place, or reactive actions to stop an attack attempt.

## What identity and access safeguards does Security Center   

Azure Security Center has two dedicated security controls for ensuring you're meeting your organization's identity security requirements: 

 - **Manage access and permissions** - Security Center encourages adoption of the [least privilege access model](https://docs.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models) to ensure your users have the necessary access to do their jobs but no more than that. In addition, this control has recommendations related to controlling access to your resources with role assignments with [role-based access control (RBAC)](https://docs.microsoft.com/azure/role-based-access-control/o.verview)
 
 - **Enable MFA** - With [MFA](https://www.microsoft.com/security/business/identity/mfa) enabled, your accounts are more secure, and users can still authenticate to almost any application with single sign-on.
 

These are some examples of recommendations you might see in these two controls on Security Center's **Recommendations** page:

- MFA should be enabled on accounts with owner permissions on your subscription
- A maximum of 3 owners should be designated for your subscription
- External accounts with read permissions should be removed from your subscription
- Deprecated accounts should be removed from your subscription
    > [!TIP]
    > Deprecated accounts are accounts that are no longer needed, and blocked from signing in by Azure Active Directory)

For more information about these recommendations as well as a full list of the recommendations you might see here, see [Identity and Access recommendations](recommendations-reference.md#recs-identity).

> [!NOTE]
> If your subscription has more than 600 accounts, Security Center is unable to run the Identity recommendations against your subscription. Recommendations that are not run are listed under "unavailable assessments" below.
Security Center is unable to run the Identity recommendations against a Cloud Solution Provider (CSP) partner's admin agents.
>

## Identify accounts without multi-factor authentication (MFA) enabled

To see which accounts don't have MFA enabled, use the Azure Resource Graph query below. The query returns all unhealthy resources (in this case, accounts) of the recommendation "MFA should be enabled on accounts with owner permissions on your subscription". 

1. Open **Azure Resource Graph Explorer**.

    :::image type="content" source="./media/security-center-identity-access/opening-resource-graph-explorer.png" alt-text="Launching Azure Resource Graph Explorer** recommendation page" :::

1. Enter the following query and select **Run query**.

    ```
    securityresources
     | where type == "microsoft.security/assessments"
     | where properties.displayName == "MFA should be enabled on accounts with owner permissions on your subscription"
     | where properties.status.code == "Unhealthy"
    ```

1. The `additionalData` property reveals the list of account object ids for accounts that don't have MFA enforced. 

    > [!NOTE]
    > The accounts are shown as object ids rather than account names to protect the pivacy of the account holders.

> [!TIP]
> Alternatively, you can use Security Center's REST API method [Assessments - Get ](https://docs.microsoft.com/rest/api/securitycenter/assessments/get).


## Enable multi-factor authentication (MFA)

Enabling MFA requires [Azure Active Directory (AD) tenant permissions](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles). 

- If you have a premium edition of AD, enable MFA using [Conditional Access](../active-directory/conditional-access/concept-conditional-access-policy-common.md).
- If you're using AD free edition, enable **security defaults** in Azure Active Directory as described in the [AD documentation](https://docs.microsoft.com/azure/active-directory/fundamentals/concept-fundamentals-security-defaults).


## Next steps
To learn more about recommendations that apply to other Azure resource types, see the following article:

- [Protecting your network in Azure Security Center](security-center-network-recommendations.md)