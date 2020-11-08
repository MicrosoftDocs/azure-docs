---
title: Exempt a resource from Azure Security Center security recommendations and the secure score
description: Learn how to exempt a resource from security recommendations and the secure score
author: memildin
ms.author: memildin
ms.date: 9/22/2020
ms.topic: how-to
ms.service: security-center
manager: rkarlin

---

# Exempt a resource from recommendations and secure score

A core priority of every security team is trying to ensure the analysts can focus on the tasks and incidents that matter to the organization. Security Center has many features for customizing the information you prioritize the most and making sure your secure score is a valid reflection of your organization's security decisions. Exempting resources is one such feature.

When you investigate a security recommendation in Azure Security Center, one of the first pieces of information you review is the list of affected resources.

Occasionally, a resource will be listed that you feel shouldn't be included. It might have been remediated by a process not tracked by Security Center. Or perhaps your organization has decided to accept the risk for that specific resource. 

In such cases, you can create an exemption rule and ensure that resource isn't listed with the unhealthy resources in the future, and doesn't impact your secure score. 

The resource will be listed as not applicable and the reason will be shown as "exempted" with the justification you select.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|Preview - [!INCLUDE [Legalese](../../includes/security-center-preview-legal-text.md)] |
|Pricing:|This is a premium Azure policy capability that's offered for Azure Defender customers with no additional cost. For other users, charges may apply in the future.|
|Required roles and permissions:|**Subscription owner** or **Policy contributor** to create an exemption<br>To create a rule, you need permissions to edit policies in Azure Policy.<br>Learn more in [Azure RBAC permissions in Azure Policy](../governance/policy/overview.md#azure-rbac-permissions-in-azure-policy).|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![No](./media/icons/no-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||


## Create an exemption rule

1. On the list of unhealthy resources, select the ellipsis menu ("...") for the resource you want to exempt.

    :::image type="content" source="./media/exempt-resource/create-exemption.png" alt-text="Create exemption option from context menu":::

    The create exemption pane opens.

    :::image type="content" source="./media/exempt-resource/exemption-rule-options.png" alt-text="Create exemption pane":::

1. Enter your criteria and select a criteria for why this resource should be exempted:
    - **Mitigated** - This issue isn't relevant to the resource because it's been handled by a different tool or process than the one being suggested
    - **Waiver** - Accepting the risk for this resource
1. Select **Save**.
1. After a while (it might take up to 24 hours):
    - The resource doesn't impact your secure score.
    - The resource is listed in the **Not applicable** tab of the recommendation details page
    - The information strip at the top of the recommendation details page lists the number of exempted resources:
        
        :::image type="content" source="./media/exempt-resource/info-banner.png" alt-text="Number of exempted resources":::

1. To review your exempted resources, open the **Not applicable** tab.

    :::image type="content" source="./media/exempt-resource/modifying-exemption.png" alt-text="Modifying an exemption":::

    The reason for each exemption is included in the table (1).

    To modify or delete an exemption, select the ellipsis menu ("...") as shown (2).


## Review all of the exemption rules on your subscription

Exemption rules use Azure policy to create an exemption for the resource on the policy assignment.

You can use Azure Policy to track all your exemption in the **Exemption** page:

:::image type="content" source="./media/exempt-resource/policy-page-exemption.png" alt-text="Azure Policy's exemption page":::



## Next steps

In this article, you learned how to exempt a resource from a recommendation so that it doesn't impact your secure score. For more information about secure score, see:

- [Secure score in Azure Security Center](secure-score-security-controls.md)