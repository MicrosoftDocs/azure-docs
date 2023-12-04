---
title: Manage MCSB in Microsoft Defender for Cloud
description: Learn how to manage the  MCSB standard in Microsoft Defender for Cloud
ms.topic: conceptual
ms.date: 01/25/2022
---

# Manage MCSB recommendations in Defender for Cloud

Microsoft Defender for Cloud assesses resources against [security standards](security-policy-concept.md). By default, when you onboard Azure subscriptions to Defender for Cloud, the [Microsoft Cloud Security Benchmark (MCSB) standard](concept-regulatory-compliance.md) is enabled. Defender for Cloud starts assessing the security posture of your resource against controls in the MCSB standard, and issues security recommendations based on the assessments.

This article describes how you can manage recommendations provided by MCSB.

## Before you start

 There are two specific roles in Defender for Cloud that can view and manage security elements:

- **Security reader**: Has rights to view Defender for Cloud items such as recommendations, alerts, policy, and health. Can't make changes.
- **Security admin**: Has the same view rights as *security reader*. Can also update security policies, and dismiss alerts.

### Deny and enforce recommendations

- **Deny** is used to prevent deployment of resources that don't comply with MCSB. For example, if you have a Deny control that specifies that a new storage account must meet a certain criteria, a storage account can't be created if it doesn't meet that criteria.

- **Enforce** lets you take advantage of the **DeployIfNotExist** effect in Azure Policy, and automatically remediate non-compliant resources upon creation.


To review which recommendations you can deny and enforce, in the **Security policies** page, on the **Standards** tab, select **Microsoft cloud security benchmark** and drill into a recommendation to see if the deny/enforce actions are available.

## Manage recommendation settings

You can enable/disable, deny and enforce recommendations.

1. In the Defender for Cloud portal, open the **Environment settings** page.

1. Select the subscription or management group for which you want to manage MCSB recommendations.

1. Open the **Security policies** page, and select the MCSB standard. The standard should be turned on.

1. Select the ellipses > **Manage recommendations**.

     :::image type="content" source="./media/manage-mcsb/select-benchmark.png" alt-text="Screenshot showing the manage effect and parameters screen for a given recommendation." lightbox="./media/manage-mcsb/select-benchmark.png":::

1. Next to the relevant recommendation, select the ellipses menu, select **Manage effect and parameters**.

- To turn on a recommendation, select **Audit**.
- To turn off a recommendation, select **Disabled**
- To deny or enforce a recommendation, select **Deny**.

### Enforce a recommendation

You can only enforce a recommendation from the recommendation details page.

1. In the Defender for Cloud portal, open the **Recommendations** page, and select the relevant recommendation.
1. In the top menu, select **Enforce**.

    :::image type="content" source="./media/manage-mcsb/enforce-recommendation.png" alt-text="Screenshot showing how to enforce a given recommendation." lightbox="./media/manage-mcsb/enforce-recommendation.png":::

1. Select **Save**.

The setting will take effect immediately, but recommendations will update based on their freshness interval (up to 12 hours).




## Modify additional parameters

You might want to configure additional parameters for some recommendations. For example diagnostic logging recommendations have a default retention period of one day. You can change that default value.

In the recommendation details page, the **Additional parameters** column indicates whether a recommendation has associated additional parameters.

- **Default** – the recommendation is running with default configuration
- **Configured** – the recommendation’s configuration is modified from its default values
- **None** – the recommendation doesn't require any additional configuration

1. Next to the MCSB recommendation, select the ellipses menu, select **Manage effect and parameters**.

1. In **Additional parameters**, configure the available parameters with new values.

1. Select **Save**.

    :::image type="content" source="./media/manage-mcsb/additional-parameters.png" alt-text="Screenshot showing how to configure additional parameters on the manage effect and parameters screen." lightbox="./media/manage-mcsb/additional-parameters.png":::

If you want to revert changes, select **Reset to default** to restore the default value for the recommendation.

## Identify potential conflicts

Potential conflicts can arise when you have multiple assignments of standards with different values.

1. To identify conflicts in effect actions, in **Add**, select **Effect conflict** > **Has conflict** to identify any conflicts.

    :::image type="content" source="./media/manage-mcsb/effect-conflict.png" alt-text="Screenshot showing how to manage assignment of standards with different values." lightbox="./media/manage-mcsb/effect-conflict.png":::

1. To identify conflicts in additional parameters, in **Add**, select **Additional parameters conflict** > **Has conflict** to identify any conflicts.
1. If conflicts are found, in **Recommendation settings**, select the required value, and save. 

All assignments on the scope will be aligned with the new setting, resolving the conflict.

## Next steps
This page explained security policies. For related information, see the following pages:

- [Learn how to set policies using PowerShell](../governance/policy/assign-policy-powershell.md)
- [Learn how to edit a security policy in Azure Policy](../governance/policy/tutorials/create-and-manage.md)
- [Learn how to set a policy across subscriptions or on Management groups using Azure Policy](../governance/policy/overview.md)
- [Learn how to enable Defender for Cloud on all subscriptions in a management group](onboard-management-group.md)
