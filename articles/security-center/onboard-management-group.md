---
title: Onboard a management group to Azure Security Center
description: Learn how to use a supplied Azure Policy definition to enable Azure Security Center for all the subscriptions in a management group.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 03/11/2021
ms.author: memildin

---

# Enable Security Center on all subscriptions in a management group

You can use Azure Policy to enable Azure Security Center on all the Azure subscriptions within the same management group (MG). This is more convenient than accessing them individually from the portal, and works even if the subscriptions belong to different owners. 

To onboard a management group and all its subscriptions:

1. As a user with **Security Admin** permissions, open Azure Policy and search for the definition **Enable Azure Security Center on your subscription**.

    :::image type="content" source="./media/security-center-get-started/enable-security-center-policy.png" alt-text="The Azure Policy definition Enable Azure Security Center on your subscription.":::

1. Select **Assign** and ensure you set the scope to the MG level.

    :::image type="content" source="./media/security-center-get-started/assign-policy.png" alt-text="Assigning the definition Enable Azure Security Center on your subscription.":::

    > [!TIP]
    > Other than the scope, there are no required parameters.

1. Select **Create a remediation task** to ensure all existing subscriptions that don't have Security Center enabled, will get onboarded.

    :::image type="content" source="./media/security-center-get-started/remediation-task.png" alt-text="Creating a remediation task for the Azure Policy definition Enable Azure Security Center on your subscription.":::

1. When the definition is assigned it will:

    1. Detect all subscriptions in the MG that aren't yet registered with Security Center.
    1. Mark those subscriptions as “non-compliant”.
    1. Mark as "compliant" all registered subscriptions (regardless of whether they have Azure Defender on or off).

    The remediation task will then enable Security Center, for free, on the non-compliant subscriptions.

> [!IMPORTANT]
> The policy definition will only enable Security Center on **existing** subscriptions. To register newly created subscriptions, open the compliance tab, select the relevant non-compliant subscriptions, and create a remediation task.Repeat this step when you have one or more new subscriptions you want to monitor with Security Center.

## Optional modifications

There are a variety of ways you might choose to modify the Azure Policy definition: 

- **Define compliance differently** - The supplied policy classifies all subscriptions in the MG that aren't yet registered with Security Center as “non-compliant”. You might choose to set it to all subscriptions without Azure Defender.

    The supplied definition, defines *either* of the 'pricing' settings below as compliant. Meaning that a subscription set to 'standard' or 'free' is compliant.

    > [!TIP]
    > When an Azure Defender plan is enabled, it's described in a policy definition as being on the 'Standard' setting. When it's disabled, it's 'Free'. To learn about the differences between these plans, see [Security Center free vs Azure Defender enabled](security-center-pricing.md). 

    ```
    "existenceCondition": {
        "anyof": [
            {
                "field": "microsoft.security/pricings/pricingTier",
                "equals": "standard"
            },
            {
                "field": "microsoft.security/pricings/pricingTier",
                "equals": "free"
            }
        ]
    },
    ```

    If you change it to the following, only subscriptions set to 'standard' would be classified as compliant:

    ```
    "existenceCondition": {
          {
            "field": "microsoft.security/pricings/pricingTier",
            "equals": "standard"
          },
    },
    ```

- **Define some Azure Defender plans to apply when enabling Security Center** - The supplied policy enables Security Center without any of the optional Azure Defender plans. You might choose to enable one or more of them.

    The supplied definition's `deployment` section has a parameter `pricingTier`. By default, this is set to `free`, but you can modify it. 


## Next steps:

Now that you've onboarded an entire management group, enable the advanced protections of Azure Defender. 

> [!div class="nextstepaction"]
> [Enable Azure Defender](enable-azure-defender.md)