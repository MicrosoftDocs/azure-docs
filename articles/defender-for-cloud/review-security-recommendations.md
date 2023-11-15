---
title: Review security recommendations in Microsoft Defender for Cloud
description: Learn how to review security recommendations in Microsoft Defender for Cloud
ms.topic: how-to
ms.date: 01/10/2023
---

# Review security recommendations

In Microsoft Defender for Cloud, resources and workloads are assessed against built-in and custom security standards enabled in your Azure subscriptions, AWS accounts, and GCP projects. Based on those assessments, security recommendations provide practical steps to remediate security issues, and improve security posture.

This article describes how to review security recommendations in your Defender for Cloud deployment using the latest version of the portal experience.

## Get an overview

In the Defender for Cloud portal > **Overview** dashboard, get a holistic look at your environment, including security recommendations.

- **Active recommendations**:  Recommendations that are active in your environment.
- **Unassigned recommendations**: See which recommendations don't have owners assigned to them.
- **Overdue recommendations**: Recommendations that have an expired due date.
- **Attack paths**: See the number of attack paths.


## Review recommendations

1. In Defender for Cloud, open the **Recommendations** page.
1. For each recommendation, review:

    - **Risk level** - Specifies whether the recommendation risk is Critical, High, Medium or Low.
    - **Affected resource** - Indicated affected resources.
    - **Risk factors** - Environmental factors of the resource affected by the recommendation, which influences the exploitability and the business effect of the underlying security issue. For example, Internet exposure, sensitive data, lateral movement potential and more.
    - **Attack Paths** - The number of attack paths.
    - **Owner** - The person assigned to this recommendation.
    - **Due date** - Indicates the due date for fixing the recommendation.
    - **Recommendation status** indicates whether the recommendation has been assigned, and whether the due date for fixing the recommendation has passed.
    

## Review recommendation details

1. In the **Recommendations** page, select the recommendation.
1. In the recommendation page, review the details:
    - **Description** - A short description of the security issue.
    - **Attack Paths** - The number of attack paths.
    - **Scope** - The affected subscription or resource.
    - **Freshness** - The freshness interval for the recommendation.
    - **Last change date** - The date this recommendation last had a change
    - **Owner** - The person assigned to this recommendation.
    - **Due date** - The assigned date the recommendation must be resolved by.
    - **Findings by severity** - The total findings by severity.
    - **Tactics & techniques** - The tactics and techniques mapped to MITRE ATT&CK.

        :::image type="content" source="./media/review-security-recommendations/recommendation-details-page.png" alt-text="Screenshot of the recommendation details page with labels for each element." lightbox="./media/security-policy-concept/recommendation-details-page.png":::

## Explore a recommendation

You can perform a number of actions to interact with recommendations. If an option isn't available, it isn't relevant for the recommendation.

1. In the **Recommendations** page, select a recommendation.
1. Select **Open query** to view detailed information about the affected resources using an Azure Resource Graph Explorer query
1. Select **View policy definition** to view the Azure Policy entry for the underlying recommendation (if relevant).
1. In **Review findings**, you can review affiliated findings by severity.
    
     :::image type="content" source="media/review-security-recommendations/recommendation-findings.png" alt-text="Screenshot of the findings tab in a recommendation that shows all of the attack paths for that recommendation." lightbox="media/review-security-recommendations/recommendation-findings.png":::

1. In **Take action**:
    - **Remediate**: A description of the manual steps required to remediate the security issue on the affected resources. For recommendations with the **Fix** option, you can select **View remediation logic** before applying the suggested fix to your resources.
     - **Assign owner and due date**: If you have a [governance rule](governance-rules.md) turned on for the recommendation, you can assign an owner and due date.
    - **Exempt**: You can exempt resources from the recommendation, or disable specific findings using disable rules.
    - **Workflow automation**: Set a logic app to trigger with this recommendation.
1. In **Graph**, you can view and investigate all context that is used for risk prioritization, including [attack paths](how-to-manage-attack-path.md).

     :::image type="content" source="media/review-security-recommendations/recommendation-graph.png" alt-text="Screenshot of the graph tab in a recommendation that shows all of the attack paths for that recommendation." lightbox="media/review-security-recommendations/recommendation-graph.png":::



## Manage recommendations assigned to you

Defender for Cloud supports governance rules for recommendations, to specify a recommendation owner or due date for action. Governance rules help ensure accountability and an SLA for recommendations.

- Recommendations are listed as **On time** until their due date is passed, when they're changed to **Overdue**.
- Before the recommendation is overdue, the recommendation doesn't affect the secure score.
- You can also apply a grace period during which overdue recommendations continue to not affect the secure score.

[Learn more](governance-rules.md) about configuring governance rules.

Manage recommendations assigned to you as follows:

1. In the Defender for Cloud portal > **Recommendations** page, select **Add filter** > **Owner**.

1. Select your user entry.
1. In the recommendation results, review the recommendations, including affected resources, risk factors, attack paths, due dates, and status.
1. Select a recommendation to review it further.
1. In **Take action** > **Change owner & due date**, you change the recommendation owner and due date if needed.
    - By default the owner of the resource gets a weekly email listing the recommendations assigned to them.
    - If you select a new remediation date, in **Justification** specify reasons for remediation by that date.
    - In **Set email notifications** you can:
        - Override the default weekly email to the owner.
        - Notify owners weekly with a list of open/overdue tasks.
        - Notify the owner's direct manager with an open task list.
1. Select **Save**.

> [!NOTE]
> Changing the expected completion date doesn't change the due date for the recommendation, but security partners can see that you plan to update the resources by the specified date.

## Review recommendations in Azure Resource Graph

You can use [Azure Resource Graph](../governance/resource-graph/index.yml) to query Defender for Cloud security posture data across multiple subscriptions. Azure Resource Graph provides an efficient way to query at scale across cloud environments by viewing, filtering, grouping, and sorting data.

1. In the Defender for Cloud portal > **Recommendations** page > select **Open query**.

1. In [Azure Resource Graph](../governance/resource-graph/index.yml), write a [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/).
1. You can open the query in one of two ways:

   - **Query returning affected resource** - Returns a list of all of the resources affected by this recommendation.
   - **Query returning security findings** - Returns a list of all security issues found by the recommendation.


### Example

In this example,  this recommendation details page shows 15 affected resources:

:::image type="content" source="./media/review-security-recommendations/open-query.png" alt-text="The **Open Query** button on the recommendation details page.":::

When you open the underlying query, and run it, Azure Resource Graph Explorer returns the same 15 resources and their health status for this recommendation:

:::image type="content" source="./media/review-security-recommendations/run-query.png" alt-text="Screenshot of Azure Resource Graph Explorer showing the results for the recommendation shown in the previous screenshot.":::



## Next steps

[Remediate security recommendations](implement-security-recommendations.md)

