---
title: Review security recommendations in Microsoft Defender for Cloud
description: Learn how to review security recommendations in Microsoft Defender for Cloud
ms.topic: how-to
ms.date: 01/10/2023
---

# Review security recommendations

Resources and workloads are assessed against built-in and custom security standards enabled in your Azure subscriptions, AWS accounts, and GCP projects. Based on those assessments, security recommendations provide practical steps to remediate security issues, and improve security posture.

This article describes how to review security recommendations in your Defender for Cloud deployment.

## Get an all-up view

In the Defender for Cloud portal > **Overview** dashboard, you can get a holistic look at your environment, including security recommendations. 
- **Active recommendations**:  Recommendations that are active in your environment.
- **Unassigned recommendations**: See which recommendations don't have owners assigned to them.
- **Overdue recommendations**: Recommendations that have an expired due date.

Selecting any information about recommendations on the **Overview** dashboard takes you to the **Recommendations** page, where you can search for and drill down into specific security standard compliance controls and recommendations.


## Review a recommendation

1. In Defender for Cloud, open the **Recommendations** page, and select the recommendation.
1. In the recommendation page, review recommendation details:

    - **Risk level** - Specifies whether the recommendation risk is Critical, High, Medium or Low.
    - **Resource** - Indicated affected resources.
    - **Status** - Recommendation status. **Overdue** indicates that the due date for fixing the recommendation has passed.
    - **Description** - A short description of the security issue.
    - **Attack Paths** - The number of attack paths
    - **Scope** - The affected subscription or resource.
    - **Freshness** - The freshness interval
    - **Last change date** - The date this recommendation last had a change
    - **Owner** - The person assigned to this recommendation
    - **Due date** - The assigned date the recommendation must be resolved by
    - **Risk factors** - Environmental factors of the resource affected by the recommendation, which influences the exploitability and the business effect of the underlying security issue. For example, Internet exposure, sensitive data, lateral movement potential and more.
    - **Findings by severity** - The total findings by severity
    - **Tactics & techniques** - The tactics and techniques mapped to MITRE ATT&CK.

        :::image type="content" source="./media/review-security-recommendations/recommendation-details-page.png" alt-text="Screenshot of the recommendation details page with labels for each element." lightbox="./media/security-policy-concept/recommendation-details-page.png":::

1. Within the recommendation, you can:

    - **Open query** - You can view detailed information about the affected resources using an Azure Resource Graph Explorer query.
    - **View policy definition** - View the Azure Policy entry for the underlying recommendation (if relevant).
    - **Take action**:
        - **Remediate**: A description of the manual steps required to remediate the security issue on the affected resources. For recommendations with the **Fix** option, you can select **View remediation logic** before applying the suggested fix to your resources.
        - **Assign owner and due date**: If you have a [governance rule](governance-rules.md) turned on for the recommendation, you can assign an owner and due date.
        - **Exempt**: You can exempt the entire recommendation, or disable specific findings using disable rules.
        - **Workflow automation**: Set a logic app to trigger with this recommendation.
    - **Graph**: Allows you to view and investigate all context that is used for risk prioritization, including [attack paths](how-to-manage-attack-path.md). 

        :::image type="content" source="media/review-security-recommendations/recommendation-graph.png" alt-text="Screenshot of the graph tab in a recommendation that shows all of the attack paths for that recommendation." lightbox="media/review-security-recommendations/recommendation-graph.png":::

    - **Findings**: Review affiliated findings.
    
        :::image type="content" source="media/review-security-recommendations/recommendation-findings.png" alt-text="Screenshot of the findings tab in a recommendation that shows all of the attack paths for that recommendation." lightbox="media/review-security-recommendations/recommendation-findings.png":::

> [!NOTE]
> If an option isn't available, it isn't relevant for the recommendation.

## Fix recommendations to improve secure score

To improve your [secure score](secure-score-security-controls.md), you have to remediate recommendations within relevant security controls in the [Microsoft Cloud Security Benchmark (MCSB)](concept-regulatory-compliance.md) standard.

1. In Defender for Cloud, open the **Recommendations** page.
1. In the **Secure score recommendations** tab, you see a list of security controls in the MCSB. Each security control groups together related security recommendations. 
1. For each control, you can review the **Current score**, and the **Potential score increase** that you can achieve when you remediate all of the recommendations in the security control.
1. Identify the controls with the highest potential for increase, and drill down into the recommendations you need to address. You can also search for recommendations.


    :::image type="content" source="media/review-security-recommendations/secure-score-recommendations.png" alt-text="Screenshot of the secure score recommendations." lightbox="media/review-security-recommendations/secure-score-recommendations.png":::


When all of the recommendations are fixed, secure score increases by the percentage point listed for the control.

## Manage recommendations assigned to you

Defender for Cloud support governance rules for recommendations, to specify a recommendation owner or due date for action. Governance rules help ensure accountability and an SLA for recommendations.

- Recommendations are listed as **On time** until their due date is passed, when they're changed to **Overdue**.
- Before the recommendation is overdue, the recommendation doesn't affect the secure score.
- You can also apply a grace period during which overdue recommendations continue to not affect the secure score.

[Learn more](governance-rules.md) about configuring governance rules.

Manage recommendations assigned to you as follows:

1. In the Defender for Cloud portal > **Recommendations** page, select the **Owner** option in the top menu.

1. In the filters for list of recommendations, select **Show my items only**.
1. In the recommendation results, review the recommendation status:

    - The **Status** column indicates the recommendations that are on time, overdue, or completed.
    - The **Insights** column indicates the recommendations that are in a grace period, so they currently don't affect your secure score until they become overdue.

1. Select a recommendation.
1. In the **Affected resources** section of the recommendation details page, select the relevant resource and select **Change owner and set ETA**.
1. In **Change owner and set ETA**, make the required changes:

    - To change the resource owner, select **Change owner**, enter the email address of the owner of the resource, and select **Save**. By default the owner of the resource gets a weekly email listing the recommendations assigned to them.
    - To change the estimated completion date. select **Change ETA**, and select a new remediation date. In **Justification** specify reasons for remediation by that date.
    - In **Set email notifications** you can:
        - Override the default weekly email to the owner.
        - Notify owners weekly with a list of open/overdue tasks.
        - Notify the owner's direct manager with an open task list.
1. Select **Save**

> [Note]
> Changing the expected completion date doesn't change the due date for the recommendation, but security partners can see that you plan to update the resources by the specified date.

## Review recommendations in Azure Resource Graph (ARG)

You can use [Azure Resource Graph (ARG)](../governance/resource-graph/index.yml) to query Defender for Cloud security posture data across multiple subscriptions. Azure Resource Graph provides an efficient way to query at scale across cloud environments by viewing, filtering, grouping, and sorting data.

1. In the Defender for Cloud portal > **Recommendations** page > select a recommendation, and then select **Open query**.

1. In [Azure Resource Graph (ARG)](../governance/resource-graph/index.yml), write a [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/), you can cross-reference Defender for Cloud data across multiple subscriptions.
1. You can open the query in one of two ways:

   - **Query returning affected resource** - Returns a list of all of the resources affected by this recommendation.
   - **Query returning security findings** - Returns a list of all security issues found by the recommendation.


### Example

In this example,  this recommendation details page shows 15 affected resources:

:::image type="content" source="./media/review-security-recommendations/open-query.png" alt-text="The **Open Query** button on the recommendation details page.":::

When you open the underlying query, and run it, Azure Resource Graph Explorer returns the same 15 resources and their health status for this recommendation:

:::image type="content" source="./media/review-security-recommendations/run-query.png" alt-text="Azure Resource Graph Explorer showing the results for the recommendation shown in the previous screenshot.":::

## Review recommendation insights

The **Insights** for a recommendation provides additional details. The table summarizes the icon meanings.

| Icon | Name | Description |
|--|--|--|
| :::image type="icon" source="media/secure-score-security-controls/preview-icon.png" border="false":::  | **Preview recommendation** | This recommendation won't affect your secure score until it's GA. |
| :::image type="icon" source="media/secure-score-security-controls/fix-icon.png" border="false"::: | **Fix** | From within the recommendation details page, you can use 'Fix' to resolve this issue. |
| :::image type="icon" source="media/secure-score-security-controls/enforce-icon.png" border="false"::: | **Enforce** | From within the recommendation details page, you can automatically deploy a policy to fix this issue whenever someone creates a non-compliant resource. |
| :::image type="icon" source="media/secure-score-security-controls/deny-icon.png" border="false"::: | **Deny** | From within the recommendation details page, you can prevent new resources from being created with this issue. |

Recommendations that aren't included in the calculations of your secure score, should still be remediated wherever possible, so that when the period ends they'll contribute towards your score instead of against it.

## Download recommendations to a CSV report

Recommendations can be downloaded to a CSV report from the Recommendations page.

1. In the Defender for Cloud portal > **Recommendations** page, select **Download CSV report**.

    :::image type="content" source="media/review-security-recommendations/download-csv.png" alt-text="Screenshot showing you where to select the Download C S V report from.":::

2. Wait for a pop-up indication that the report is being prepared.

:::image type="content" source="media/review-security-recommendations/preparing-report.png" alt-text="Screenshot of pop-up indicating report being prepared.":::

3. Wait for a second pop-up indicating that the report is ready.

:::image type="content" source="media/review-security-recommendations/downloaded-csv.png" alt-text="Screenshot of pop-up indicating your downloaded completed.":::


## Next steps

[Remediate security recommendations](implement-security-recommendations.md)

