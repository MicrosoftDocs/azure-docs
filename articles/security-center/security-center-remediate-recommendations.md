---
title: Remediate recommendations in Azure Security Center | Microsoft Docs
description: This article explains how to remediate recommendations in Azure Security Center to protect your resources and comply with security policies.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 8be947cc-cc86-421d-87a6-b1e23077fd50
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/08/2020
ms.author: memildin

---
# Remediate recommendations in Azure Security Center

Recommendations give you suggestions on how to better secure your resources. You implement a recommendation by following the remediation steps provided in the recommendation.

## Remediation steps <a name="remediation-steps"></a>

After reviewing all the recommendations, decide which one to remediate first. We recommend that you use the [Secure Score impact](security-center-recommendations.md#monitor-recommendations) to help prioritize what to do first.

1. From the list, click the recommendation.

1. Follow the instructions in the **Remediation steps** section. Each recommendation has its own set of instructions. The following screenshot shows remediation steps for configuring applications to only allow traffic over HTTPS.

    ![Recommendation details](./media/security-center-remediate-recommendations/security-center-remediate-recommendation.png)

1. Once completed, a notification appears informing you if the remediation succeeded.

## Quick Fix remediation<a name="one-click"></a>

Quick Fix enables you to quickly remediate a recommendation on multiple resources. It's only available for specific recommendations. Quick Fix simplifies remediation and enables you to quickly increase your Secure Score, improving your environment's security.

To implement Quick Fix remediation:

1. From the list of recommendations that have the **Quick Fix!** label, click on the recommendation.

    [![Select Quick Fix!](media/security-center-remediate-recommendations/security-center-one-click-fix-select.png)](media/security-center-remediate-recommendations/security-center-one-click-fix-select.png#lightbox)

1. From the **Unhealthy resources** tab, select the resources that you want to implement the recommendation on, and click **Remediate**.

    > [!NOTE]
    > Some of the listed resources might be disabled, because you don't have the appropriate permissions to modify them.

1. In the confirmation box, read the remediation details and implications.

    ![Quick Fix](./media/security-center-remediate-recommendations/security-center-one-click-fix-view.png)

    > [!NOTE]
    > The implications are listed in the grey box in the **Remediate resources** window that opens after clicking **Remediate**. They list what changes happen when proceeding with the Quick Fix remediation.

1. Insert the relevant parameters if necessary, and approve the remediation.

    > [!NOTE]
    > It can take several minutes after remediation completes to see the resources in the **Healthy resources** tab. To view the remediation actions, check the [activity log](#activity-log).

1. Once completed, a notification appears informing you if the remediation succeeded.

## Quick Fix remediation logging in the activity log <a name="activity-log"></a>

The remediation operation uses a template deployment or REST PATCH API call to apply the configuration on the resource. These operations are logged in [Azure activity log](../azure-resource-manager/management/view-activity-logs.md).


## Enforcing recommendations on newly created resources

Security misconfigurations are a major cause of security incidents. Security Center now has the ability to help *prevent* misconfigurations of new resources with regards to specific recommendations. 

This feature can help keep your workloads secure and stabilize your secure score.

Enforcing a secure configuration, based on a specific recommendation, is offered in two modes:

- Using the **Deny** effect of Azure Policy, you can stop unhealthy resources from being created

- Using the **Enforce** option, you can take advantage of Azure policy's **DeployIfNotExist** effect and automatically remediate non-compliant resources upon creation
 
This is available for selected security recommendations and can be found at the top of the resource details page.

- **To prevent resource creation:**

    1. Open the recommendation that your new resources must satisfy, and select the **Deny** button at the top of the page.

        :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-deny-button.png" alt-text="Recommendation page with Deny button highlighted":::

        The configuration pane opens listing the scope options. 

    1. Set the scope by selecting the relevant subscription or management group.

        > [!TIP]
        > You can use the three dots at the end of the row to change a single subscription, or use the checkboxes to select multiple subscriptions or groups then select **Change to Deny**.

        :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-prevent-resource-creation.png" alt-text="Setting the scope for Azure Policy deny":::


- **To enforce a secured configuration:**

    1. Open the recommendation that you'll deploy a template deployment for if new resources don't  satisfy it, and select the **Enforce** button at the top of the page.

        :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-enforce-button.png" alt-text="Recommendation page with Enforce button highlighted":::

        The configuration pane opens with all of the policy configuration options. 

        :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-enforce-config.png" alt-text="Enforce configuration options":::

    1. Set the scope, assignment name, and other relevant options.

    1. Select **Review + create**.


## Next steps

In this document, you were shown how to remediate recommendations in Security Center. To learn more about Security Center, see the following topics:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) - Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) - Learn how to monitor the health of your Azure resources.
