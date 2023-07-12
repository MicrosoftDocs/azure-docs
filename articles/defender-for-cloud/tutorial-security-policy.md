---
title: Working with security policies
description: Learn how to work with security policies in Microsoft Defender for Cloud.
ms.topic: conceptual
ms.date: 01/25/2022
---

# Manage security policies

This page explains how security policies are configured, and how to view them in Microsoft Defender for Cloud. 

To understand the relationships between initiatives, policies, and recommendations, see [What are security policies, initiatives, and recommendations?](security-policy-concept.md)

## Who can edit security policies?

Defender for Cloud uses Azure role-based access control (Azure RBAC), which provides built-in roles you can assign to Azure users, groups, and services. When users open Defender for Cloud, they see only information related to the resources they can access. Which means users are assigned the role of *owner*, *contributor*, or *reader* to the resource's subscription. There are two specific Defender for Cloud roles that can view and manage security policies:

- **Security reader**: Has rights to view Defender for Cloud items such as recommendations, alerts, policy, and health. Can't make changes.
- **Security admin**: Has the same view rights as *security reader*. Can also update the security policy and dismiss alerts.

You can edit Azure security policies through Defender for Cloud, Azure Policy, via REST API or using PowerShell.

## Manage your security policies

To view your security policies in Defender for Cloud:

1. From Defender for Cloud's menu, open the **Environment settings** page. Here, you can see the Azure management groups or subscriptions.

1. Select the relevant subscription or management group whose security policies you want to view.

1. Open the **Security policy** page.

1. The security policy page for that subscription or management group appears. It shows the available and assigned policies.

    :::image type="content" source="./media/tutorial-security-policy/security-policy-page.png" alt-text="Screenshot showing a subscription's security policy settings page." lightbox="./media/tutorial-security-policy/security-policy-page.png":::

    > [!NOTE]
    > The settings of each recommendation that apply to the scope are compared and the cumulative outcome of actions taken by the recommendation appears. For example, if in one assignment, a recommendation is Disabled, but in another it's set to Audit, then the cumulative effect applies Audit. The more active effect always takes precedence.

1. Choose from the available options on this page:

    1. To work with industry standards, select **Add more standards**. For more information, see [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

    1. To assign and manage custom initiatives, select **Add custom initiatives**. For more information, see [Using custom security initiatives and policies](custom-security-policies.md).

    1. To view and edit the default initiative, select it and proceed as described below.

        :::image type="content" source="./media/tutorial-security-policy/policy-screen.png" alt-text="Screenshot showing the security policy settings for a subscription, focusing on the default assignment." lightbox="./media/tutorial-security-policy/policy-screen.png":::

       This **Security policy** screen reflects the action taken by the policies assigned on the subscription or management group you selected.
       
       * Use the links at the top to open a policy **assignment** that applies on the subscription or management group. These links let you access the assignment and manage recommendations. For example, if you see that a particular recommendation is set to audit effect, use to change it to deny or disable from being evaluated.
       
       * In the list of recommendations, you can see the effective application of the recommendation on your subscription or management group. 
       
       * The recommendations' effect can be:
        
            **Audit** evaluates the compliance state of resources according to recommendation logic.<br>
            **Deny** prevents deployment of non-compliant resources based on recommendation logic.<br>
            **Disabled** prevents the recommendation from running.

         :::image type="content" source="./media/tutorial-security-policy/default-assignment-screen.png" alt-text="Screenshot showing the edit default assignment screen." lightbox="./media/tutorial-security-policy/default-assignment-screen.png":::

## Enable a security recommendation

Some recommendations might be disabled by default. For example, in the Azure Security Benchmark initiative, some recommendations are provided for you to enable only if they meet a specific regulatory or compliance requirement for your organization. For example: recommendations to encrypt data at rest with customer-managed keys, such as "Container registries should be encrypted with a customer-managed key (CMK)".

To enable a disabled recommendation and ensure it's assessed for your resources:

1. From Defender for Cloud's menu, open the **Environment settings** page.

1. Select the subscription or management group for which you want to disable a recommendation.

1. Open the **Security policy** page.

1. From the **Default initiative** section, select the relevant initiative.

1. Search for the recommendation that you want to disable, either by the search bar or filters.

1. Select the ellipses menu, select **Manage effect and parameters**.

1. From the effect section, select **Audit**.

1. Select **Save**.

    :::image type="content" source="./media/tutorial-security-policy/enable-security-recommendation.png" alt-text="Screenshot showing the manage effect and parameters screen for a given recommendation." lightbox="./media/tutorial-security-policy/enable-security-recommendation.png":::

   > [!NOTE]
   > Setting will take effect immediately, but recommendations will update based on their freshness interval (up to 12 hours).

## Manage a security recommendation's settings

It may be necessary to configure additional parameters for some recommendations.
As an example, diagnostic logging recommendations have a default retention period of 1 day. You can change the default value if your organizational security requirements require logs to be kept for more than that, for example: 30 days.
The **additional parameters** column indicates whether a recommendation has associated additional parameters:

**Default** – the recommendation is running with default configuration<br>
**Configured** – the recommendation’s configuration is modified from its default values<br>
**None** – the recommendation doesn't require any additional configuration

1. From Defender for Cloud's menu, open the **Environment settings** page.

1. Select the subscription or management group for which you want to disable a recommendation.

1. Open the **Security policy** page.

1. From the **Default initiative** section, select the relevant initiative.

1. Search for the recommendation that you want to configure.

   > [!TIP]
   > To view all available recommendations with additional parameters, using the filters to view the **Additional parameters** column and then default.

1. Select the ellipses menu and select **Manage effect and parameters**.

1. From the additional parameters section, configure the available parameters with new values.

1. Select **Save**.

    :::image type="content" source="./media/tutorial-security-policy/additional-parameters.png" alt-text="Screenshot showing where to configure additional parameters on the manage effect and parameters screen." lightbox="./media/tutorial-security-policy/additional-parameters.png":::

Use the "reset to default" button to revert changes per the recommendation and restore the default value.

## Disable a security recommendation

When your security policy triggers a recommendation that's irrelevant for your environment, you can prevent that recommendation from appearing again. To disable a recommendation, select an initiative and change its settings to disable relevant recommendations.

The recommendation you want to disable will still appear if it's required for a regulatory standard you've applied with Defender for Cloud's regulatory compliance tools. Even if you've disabled a recommendation in the built-in initiative, a recommendation in the regulatory standard's initiative will still trigger the recommendation if it's necessary for compliance. You can't disable recommendations from regulatory standard initiatives.

Learn more about [managing security recommendations](review-security-recommendations.md).

1. From Defender for Cloud's menu, open the **Environment settings** page.

1. Select the subscription or management group for which you want to enable a recommendation.

   > [!NOTE]
   > Remember that a management group applies its settings to its subscriptions. If you disabled a subscription's recommendation, and the subscription belongs to a management group that still uses the same settings, then you will continue to receive the recommendation. The security policy settings will still be applied from the management level and the recommendation will still be generated.

1. Open the **Security policy** page.

1. From the **Default initiative** section, select the relevant initiative.

1. Search for the recommendation that you want to enable, either by the search bar or filters.

1. Select the ellipses menu, select **Manage effect and parameters**.

1. From the effect section, select **Disabled**.

1. Select **Save**.

   > [!NOTE]
   > Setting will take effect immediately, but recommendations will update based on their freshness interval (up to 12 hours).

## Next steps
This page explained security policies. For related information, see the following pages:

- [Learn how to set policies using PowerShell](../governance/policy/assign-policy-powershell.md)
- [Learn how to edit a security policy in Azure Policy](../governance/policy/tutorials/create-and-manage.md)
- [Learn how to set a policy across subscriptions or on Management groups using Azure Policy](../governance/policy/overview.md)
- [Learn how to enable Defender for Cloud on all subscriptions in a management group](onboard-management-group.md)
