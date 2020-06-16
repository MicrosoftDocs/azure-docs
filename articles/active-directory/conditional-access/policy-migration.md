---
title: Migrate Conditional Access policies - Azure Active Directory 
description: Learn what you need to know to migrate classic policies in the Azure portal.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 12/04/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

#Customer intent: As an IT admin, I need to understand what a policy migration is in Conditional Access so that I can get rid of my classic policies.
ms.collection: M365-identity-device-management
---
# Conditional Access classic policy migration

Conditional Access is the tool used by Azure Active Directory to bring signals together, to make decisions, and enforce organizational policies. Conditional Access is at the heart of the new identity driven control plane. While the purpose is still the same, the release of the new Azure portal has introduced significant improvements to how Conditional Access works.

Consider migrating the policies you have not created in the Azure portal because:

- You can now address scenarios you could not handle before.
- You can reduce the number of policies you have to manage by consolidating them.
- You can manage all your Conditional Access policies in one central location.
- The Azure classic portal will be retired.

This article explains what you need to know to migrate your existing Conditional Access policies to the new framework.

## Classic policies

In the [Azure portal](https://portal.azure.com), Conditional Access policies can be found under **Azure Active Directory** > **Security** > **Conditional Access**. Your organization might also have older Conditional Access policies not created using this page. These policies are known as *classic policies*. Classic policies are Conditional Access policies, you have created in:

- The Azure classic portal
- The Intune classic portal
- The Intune App Protection portal

On the **Conditional Access** page, you can access your classic policies by clicking [**Classic policies**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ConditionalAccessBlade/ClassicPolicies) in the **Manage** section. 

![Conditional Access in Azure AD showing classic policies view](./media/policy-migration/71.png)

The **Classic policies** view provides you with an option to:

- Filter your classic policies.
- Disable classic policies.
- Review the settings of a classic policy and disable it.

   ![Classic policy details including existing policy configuration](./media/policy-migration/74.png)

> [!WARNING]
> Once disabled a classic policy can't be re-enabled.

The details view of a classic policy allows you to document the settings, modify the included or excluded groups, and disable the policy.

![Policy details - Groups to include or exclude](./media/policy-migration/75.png)

By changing the selected groups or by excluding specific groups, you can test the effect of a disabled classic policy for a few test users before disabling the policy for all included users and groups.
 
## Migration considerations

In this article, Azure AD Conditional Access policies are also referred to as *new policies*.
Your classic policies continue to work side by side with your new policies until you disable or delete them. 

The following aspects are important in the context of a policy consolidation:

- While classic policies are tied to a specific cloud app, you can select as many cloud apps as you need to in a new policy.
- Controls of a classic policy and a new policy for a cloud app require all controls (*AND*) to be fulfilled. 
- In a new policy, you can:
   - Combine multiple conditions if required by your scenario. 
   - Select several grant requirements as access control and combine them with a logical *OR* (require one of the selected controls) or with a logical *AND* (require all of the selected controls).

### Office 365 Exchange online

If you want to migrate classic policies for **Office 365 Exchange online** that include **Exchange Active Sync** as client apps condition, you might not be able to consolidate them into one new policy. 

This is, for example, the case if you want to support all client app types. In a new policy that has **Exchange Active Sync** as client apps condition, you can't select other client apps.

![Conditional Access selecting client apps](./media/policy-migration/64.png)

A consolidation into one new policy is also not possible if your classic policies contain several conditions. A new policy that has **Exchange Active Sync** as client apps condition configured does not support other conditions:   

![Exchange ActiveSync does not support the selected conditions](./media/policy-migration/08.png)

If you have a new policy that has **Exchange Active Sync** as client apps condition configured, you need to make sure that all other conditions are not configured. 

![Conditional Access conditions](./media/policy-migration/16.png)
 
App-based classic policies for Office 365 Exchange Online that include **Exchange Active Sync** as client apps condition allow **supported** and **unsupported** device platforms. While you can't configure individual device platforms in a related new policy, you can limit the support to [supported device platforms](concept-conditional-access-conditions.md#device-platforms) only. 

![Conditional Access select Exchange ActiveSync](./media/policy-migration/65.png)

You can consolidate multiple classic policies that include **Exchange Active Sync** as client apps condition if they have:

- Only **Exchange Active Sync** as condition 
- Several requirements for granting access configured

One common scenario is the consolidation of:

- A device-based classic policy from the Azure classic portal 
- An app-based classic policy in the Intune app protection portal 
 
In this case, you can consolidate your classic policies into one new policy that has both requirements selected.

![Conditional Access grant controls](./media/policy-migration/62.png)

### Device platforms

Classic policies with app-based controls are pre-configured with iOS and Android as the device platform condition. 

In a new policy, you need to select the [device platforms](concept-conditional-access-conditions.md#device-platforms) you want to support individually.

![Conditional Access device platforms selection](./media/policy-migration/41.png)

## Next steps

- [Use report-only mode for Conditional Access to determine the impact of new policy decisions.](concept-conditional-access-report-only.md)
- If you want to know how to configure a Conditional Access policy, see [Conditional Access common policies](concept-conditional-access-policy-common.md).
- If you are ready to configure Conditional Access policies for your environment, see the article [How To: Plan your Conditional Access deployment in Azure Active Directory](plan-conditional-access.md). 
