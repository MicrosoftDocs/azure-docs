---
title: Review security recommendations
description: This document walks you through how to identify security recommendations that help you improve your security posture.
ms.topic: how-to
ms.date: 11/08/2023
---

# Review security recommendations

Security recommendations contain details that help you understand its significance and how to handle it.

:::image type="content" source="./media/security-policy-concept/recommendation-details-page.png" alt-text="Screenshot of the recommendation details page with labels for each element." lightbox="./media/security-policy-concept/recommendation-details-page.png":::

The recommendation details shown are:

For supported recommendations, the top toolbar shows any or all of the following buttons:

- **View policy definition** to go directly to the Azure Policy entry for the underlying policy.
- **Open query** - You can view the detailed information about the affected resources using Azure Resource Graph Explorer.

The left side of the screen shows the:

- **Risk level** - Critical, High, Medium, Low
- **Resource** - the resource that is affected
- **Status** - if the recommendation is assigned
- **Description** - A short description of the security issue.
- **Attack Paths** - The number of attack paths
- **Scope** - The affected subscription
- **Freshness** - The freshness interval
- **Last change date** - The date this recommendation last had a change
- **Owner** - The person assigned to this recommendation
- **Due date** - The assigned date the recommendation must be resolved by
- **Risk factors** - Environmental factors of the resource affected by the recommendation, which influences the exploitability and the business effect of the underlying security issue. For example, Internet exposure, sensitive data, lateral movement potential and more.
- **Findings by severity** - The total findings by severity
- **Tactics & techniques** - The tactics and techniques mapped to MITRE ATT&CK.

The right side of the screen shows the:

- **Take action**
    - **Remediate** - A description of the manual steps required to remediate the security issue on the affected resources. For recommendations with the **Fix** option, you can select**View remediation logic** before applying the suggested fix to your resources
    - **Assign owner and set due date** - Gives you the option to assign an owner and due date
    - **Exempt** - Exempt the entire recommendation, or disable specific findings using disable rules
    - **Workflow automation** - Set a logic app, which you would like to trigger with this security recommendation
    
- **Graph** - Allows you to view and investigate all context that is used for risk prioritization, including attack paths. Learn how to [identify and manage attack paths](how-to-manage-attack-path.md).

    :::image type="content" source="media/security-policy-concept/recommendation-graph.png" alt-text="Screenshot of the graph tab in a recommendation that shows all of the attack paths for that recommendation." lightbox="media/security-policy-concept/recommendation-graph.png":::

- **Findings** - all affiliated findings

    :::image type="content" source="media/security-policy-concept/recommendation-findings.png" alt-text="Screenshot of the findings tab in a recommendation that shows all of the attack paths for that recommendation." lightbox="media/security-policy-concept/recommendation-findings.png":::

    > [!NOTE]
    > If an option is not present on your screen or is greyed out, it is not relevant to your recommendation.

## Find recommendations that can improve your security posture

To improve your [secure score](secure-score-security-controls.md), you have to implement the security recommendations for your environment. From the list of recommendations, you can use filters to find the recommendations that have the most effect on your score, or the ones that you were assigned to implement.

**To get to the list of recommendations**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

You can search for specific recommendations by name. Use the search box and filters above the list of recommendations to find specific recommendations. Look at the [details of the recommendation](review-security-recommendations.md) to decide whether to [remediate it](implement-security-recommendations.md#remediate-recommendations), [exempt resources](exempt-resource.md), or [disable the recommendation](tutorial-security-policy.md#disable-a-security-recommendation).

You can learn more by watching this video from the Defender for Cloud in the Field video series:
- [Security posture management improvements](episode-four.md)

## Finding recommendations with high effect on your secure score<a name="monitor-recommendations"></a>

Your [secure score is calculated](secure-score-security-controls.md?branch=main#how-your-secure-score-is-calculated) based on the security recommendations that were implemented. In order to increase your score and improve your security posture, you have to find recommendations with unhealthy resources and [remediate those recommendations](implement-security-recommendations.md).

The list of recommendations shows the **Potential score increase** that you can achieve when you remediate all of the recommendations in the security control.

**To find recommendations that can improve your secure score**:

1. In the list of recommendations, use the **Potential score increase** to identify the security control that contains recommendations that increase your secure score.

    You can also use the search box and filters above the list of recommendations to find specific recommendations.

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

You can open the query in one of two ways:

   - **Query returning affected resource** - Returns a list of all of the resources affected by this recommendation.
   - **Query returning security findings** - Returns a list of all security issues found by the recommendation.

ARG is designed to provide efficient resource exploration with the ability to query at scale across your cloud environments with robust filtering, grouping, and sorting capabilities. It's a quick and efficient way to query information across Azure subscriptions programmatically or from within the Azure portal.

Using the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/), you can cross-reference Defender for Cloud data with other resource properties.

For example, this recommendation details page shows several affected resources:

:::image type="content" source="./media/review-security-recommendations/open-query.png" alt-text="Screenshot of the Open Query button on the recommendation details page." lightbox="media/review-security-recommendations/open-query.png":::

When you open the underlying query, and run it, Azure Resource Graph Explorer returns the same affected resources for this recommendation:

:::image type="content" source="./media/review-security-recommendations/run-query.png" alt-text="Screenshot of the Azure Resource Graph Explorer, which shows the results for the recommendation shown in the previous screenshot." lightbox="media/review-security-recommendations/run-query.png":::

## Download recommendations to a CSV report

Recommendations can be downloaded to a CSV report from the Recommendations page.

To download a CSV report of your recommendations:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.
1. Select **Download CSV report**.

    :::image type="content" source="media/review-security-recommendations/download-csv.png" alt-text="Screenshot showing you where to select the Download C S V report from.":::

You know the report is being prepared when the pop-up appears.

:::image type="content" source="media/review-security-recommendations/preparing-report.png" alt-text="Screenshot of pop-up indicating report being prepared.":::

When the report is ready, a second pop-up appears.

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
