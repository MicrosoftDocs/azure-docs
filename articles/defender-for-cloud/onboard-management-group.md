---
title: Onboard a management group
description: Learn how to use a supplied Azure Policy definition to enable Microsoft Defender for Cloud for all the subscriptions in a management group.
ms.topic: how-to
ms.date: 02/21/2023
---

# Enable Defender for Cloud on all subscriptions in a management group

You can use Azure Policy to enable Microsoft Defender for Cloud on all the Azure subscriptions within the same management group (MG). This is more convenient than accessing them individually from the portal, and works even if the subscriptions belong to different owners. 

## Prerequisites

Enable the resource provider `_Microsoft.Security_` for the management group using the following Azure CLI command:

```azurecli
az provider register --namespace Microsoft.Security --management-group-id …
```

## Onboard a management group and all its subscriptions

**To onboard a management group and all its subscriptions**:

1. As a user with **Security Admin** permissions, open Azure Policy and search for the definition `Enable Microsoft Defender for Cloud on your subscription`.

    :::image type="content" source="./media/get-started/enable-microsoft-defender-for-cloud-policy.png" alt-text="Screenshot showing the Azure Policy definition Enable Defender for Cloud on your subscription." lightbox="media/get-started/enable-microsoft-defender-for-cloud-policy-extended.png":::

1. Select **Assign** and ensure you set the scope to the MG level.

    :::image type="content" source="./media/get-started/assign-policy.png" alt-text="Screenshot showing how to assign the definition Enable Defender for Cloud on your subscription.":::

    > [!TIP]
    > Other than the scope, there are no required parameters.

1. Select **Remediation**, and select **Create a remediation task** to ensure all existing subscriptions that don't have Defender for Cloud enabled, will get onboarded.

    :::image type="content" source="./media/get-started/remediation-task.png" alt-text="Screenshot that shows how to create a remediation task for the Azure Policy definition Enable Defender for Cloud on your subscription.":::

1. Select **Review + create**.

1. Review your information and select **Create**.

When the definition is assigned, it will:

- Detect all subscriptions in the MG that aren't yet registered with Defender for Cloud.
- Mark those subscriptions as “non-compliant”.
- Mark as "compliant" all registered subscriptions (regardless of whether they have Defender for Cloud's enhanced security features on or off).

The remediation task will then enable Defender for Cloud's basic functionality on the non-compliant subscriptions.

## Optional modifications

There are various ways you might choose to modify the Azure Policy definition: 

- **Define compliance differently** - The supplied policy classifies all subscriptions in the MG that aren't yet registered with Defender for Cloud as “non-compliant”. You might choose to set it to all subscriptions without Defender for Cloud's enhanced security features enabled.

    The supplied definition, defines *either* of the 'pricing' settings below as compliant. Meaning that a subscription set to 'standard' or 'free' is compliant.

    > [!TIP]
    > When any Microsoft Defender plan is enabled, it's described in a policy definition as being on the 'Standard' setting. When it's disabled, it's 'Free'. To learn about the differences between these plans, see [Microsoft Defender for Cloud's Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads). 

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

- **Define some Microsoft Defender plans to apply when enabling Defender for Cloud** - The supplied policy enables Defender for Cloud without any of the optional enhanced security features. You might choose to enable one or more of the Microsoft Defender plans.

    The supplied definition's `deployment` section has a parameter `pricingTier`. By default, this is set to `free`, but you can modify it. 


## Next steps:

Now that you've onboarded an entire management group, enable the enhanced security features. 

> [!div class="nextstepaction"]
> [Enable enhanced protections](enable-enhanced-security.md)
