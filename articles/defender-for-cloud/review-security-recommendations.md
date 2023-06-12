---
title: Improving your security posture with recommendations in Microsoft Defender for Cloud
description: This document walks you through how to identify security recommendations that will help you improve your security posture.
ms.topic: how-to
ms.date: 01/10/2023
---

# Find recommendations that can improve your security posture

To improve your [secure score](secure-score-security-controls.md), you have to implement the security recommendations for your environment. From the list of recommendations, you can use filters to find the recommendations that have the most impact on your score, or the ones that you were assigned to implement.

To get to the list of recommendations:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Either:
    - In the Defender for Cloud overview, select **Security posture** and then select **View recommendations** for the environment you want to improve.
    - Go to **Recommendations** in the Defender for Cloud menu.

You can search for specific recommendations by name. Use the search box and filters above the list of recommendations to find specific recommendations. Look at the [details of the recommendation](security-policy-concept.md#security-recommendation-details) to decide whether to [remediate it](implement-security-recommendations.md), [exempt resources](exempt-resource.md), or [disable the recommendation](tutorial-security-policy.md#disable-a-security-recommendation).

You can learn more by watching this video from the Defender for Cloud in the Field video series:
- [Security posture management improvements](episode-four.md)

## Finding recommendations with high impact on your secure score<a name="monitor-recommendations"></a>

Your [secure score is calculated](secure-score-security-controls.md?branch=main#how-your-secure-score-is-calculated) based on the security recommendations that you've implemented. In order to increase your score and improve your security posture, you have to find recommendations with unhealthy resources and [remediate those recommendations](implement-security-recommendations.md).

The list of recommendations shows the **Potential score increase** that you can achieve when you remediate all of the recommendations in the security control.

To find recommendations that can improve your secure score:

1. In the list of recommendations, use the **Potential score increase** to identify the security control that contains recommendations that will increase your secure score.
    - You can also use the search box and filters above the list of recommendations to find specific recommendations.
1. Open a security control to see the recommendations that have unhealthy resources.

When you [remediate](implement-security-recommendations.md) all of the recommendations in the security control, your secure score increases by the percentage point listed for the control.

## Manage the owner and ETA of recommendations that are assigned to you

[Security teams can assign a recommendation](governance-rules.md) to a specific person and assign a due date to drive your organization towards increased security. If you have recommendations assigned to you, you're accountable to remediate the resources affected by the recommendations to help your organization be compliant with the security policy.

Recommendations are listed as **On time** until their due date is passed, when they're changed to **Overdue**. Before the recommendation is overdue, the recommendation doesn't affect the secure score. The security team can also apply a grace period during which overdue recommendations continue to not affect the secure score.

To help you plan your work and report on progress, you can set an ETA for the specific resources to show when you plan to have the recommendation resolved by for those resources. You can also change the owner of the recommendation for specific resources so that the person responsible for remediation is assigned to the resource.

:::image type="content" source="./media/governance-rules/change-governance-owner-eta.png" alt-text="Screenshot of fields required to add a governance rule." lightbox="media/governance-rules/change-governance-owner-eta.png":::

To change the owner of resources and set the ETA for remediation of recommendations that are assigned to you:

1. In the filters for list of recommendations, select **Show my items only**.

    - The status column indicates the recommendations that are on time, overdue, or completed.
    - The insights column indicates the recommendations that are in a grace period, so they currently don't affect your secure score until they become overdue.

1. Select an on time or overdue recommendation.
1. For the resources that are assigned to you, set the owner of the resource:
    1. Select the resources that are owned by another person, and select **Change owner and set ETA**.
    1. Select **Change owner**, enter the email address of the owner of the resource, and select **Save**.

    The owner of the resource gets a weekly email listing the recommendations that they're assigned.

1. For resources that you own, set an ETA for remediation:
    1. Select resources that you plan to remediate by the same date, and select **Change owner and set ETA**.
    1. Select **Change ETA** and set the date by which you plan to remediate the recommendation for those resources.
    1. Enter a justification for the remediation by that date, and select **Save**.

The due date for the recommendation doesn't change, but the security team can see that you plan to update the resources by the specified ETA date.

## Review recommendation data in Azure Resource Graph (ARG)

You can review recommendations in ARG both on the Recommendations page or on an individual recommendation.

The toolbar on the Recommendations page includes an **Open query** button to explore the details in [Azure Resource Graph (ARG)](../governance/resource-graph/index.yml), an Azure service that gives you the ability to query - across multiple subscriptions - Defender for Cloud's security posture data.

ARG is designed to provide efficient resource exploration with the ability to query at scale across your cloud environments with robust filtering, grouping, and sorting capabilities. It's a quick and efficient way to query information across Azure subscriptions programmatically or from within the Azure portal.

Using the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/), you can cross-reference Defender for Cloud data with other resource properties.

For example, this recommendation details page shows 15 affected resources:

:::image type="content" source="./media/review-security-recommendations/open-query.png" alt-text="The **Open Query** button on the recommendation details page.":::

When you open the underlying query, and run it, Azure Resource Graph Explorer returns the same 15 resources and their health status for this recommendation:

:::image type="content" source="./media/review-security-recommendations/run-query.png" alt-text="Azure Resource Graph Explorer showing the results for the recommendation shown in the previous screenshot.":::

## Recommendation insights

The Insights column of the page gives you more details for each recommendation. The options available in this section include:

| Icon | Name | Description |
|--|--|--|
| :::image type="icon" source="media/secure-score-security-controls/preview-icon.png" border="false":::  | **Preview recommendation** | This recommendation won't affect your secure score until it's GA. |
| :::image type="icon" source="media/secure-score-security-controls/fix-icon.png" border="false"::: | **Fix** | From within the recommendation details page, you can use 'Fix' to resolve this issue. |
| :::image type="icon" source="media/secure-score-security-controls/enforce-icon.png" border="false"::: | **Enforce** | From within the recommendation details page, you can automatically deploy a policy to fix this issue whenever someone creates a non-compliant resource. |
| :::image type="icon" source="media/secure-score-security-controls/deny-icon.png" border="false"::: | **Deny** | From within the recommendation details page, you can prevent new resources from being created with this issue. |

Recommendations that aren't included in the calculations of your secure score, should still be remediated wherever possible, so that when the period ends they'll contribute towards your score instead of against it.

## Download recommendations to a CSV report

Recommendations can be downloaded to a CSV report from the Recommendations page.

To download a CSV report of your recommendations:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.
1. Select **Download CSV report**.

    :::image type="content" source="media/review-security-recommendations/download-csv.png" alt-text="Screenshot showing you where to select the Download C S V report from.":::

You'll know the report is being prepared when the pop-up appears.

:::image type="content" source="media/review-security-recommendations/preparing-report.png" alt-text="Screenshot of pop-up indicating report being prepared.":::

When the report is ready, you'll be notified by a second pop-up.

:::image type="content" source="media/review-security-recommendations/downloaded-csv.png" alt-text="Screenshot of pop-up indicating your downloaded completed.":::

## Learn more

You can check out the following blogs:

- [Security posture management and server protection for AWS and GCP are now generally available](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/security-posture-management-and-server-protection-for-aws-and/ba-p/3271388)
- [New enhancements added to network security dashboard](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/new-enhancements-added-to-network-security-dashboard/ba-p/2896021)

## Next steps

In this document, you were introduced to security recommendations in Defender for Cloud. For related information:

- [Remediate recommendations](implement-security-recommendations.md)-Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md).
- [Automate responses to Defender for Cloud triggers](workflow-automation.md)-Automate responses to recommendations
- [Exempt a resource from a recommendation](exempt-resource.md)
- [Security recommendations - a reference guide](recommendations-reference.md)
