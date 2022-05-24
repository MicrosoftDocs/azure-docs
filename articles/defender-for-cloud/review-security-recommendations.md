---
title: Security recommendations in Microsoft Defender for Cloud
description: This document walks you through how recommendations in Microsoft Defender for Cloud help you protect your Azure resources and stay in compliance with security policies.
ms.topic: conceptual
ms.date: 04/03/2022
---
# Review your security recommendations

This article explains how to view and understand the recommendations in Microsoft Defender for Cloud to help you protect your multi-cloud resources.

## View your recommendations <a name="monitor-recommendations"></a>

Defender for Cloud analyzes the security state of your resources to identify potential vulnerabilities. 

**To view your Secure score recommendations**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

    :::image type="content" source="media/review-security-recommendations/recommendations-view.png" alt-text="Screenshot of the recommendations page.":::

    Here you'll see the recommendations applicable to your environment(s). Recommendations are grouped into security controls.

1. Select **Secure score recommendations**.

    :::image type="content" source="media/review-security-recommendations/secure-score-recommendations.png" alt-text="Screenshot showing the location of the secure score recommendations tab.":::

    > [!NOTE]
    > Custom recommendations can be found under the All recommendations tab. Learn how to [Create custom security initiatives and policies](custom-security-policies.md).

    Secure score recommendations affect the secure score and are mapped to the various security controls. The All recommendations tab, allows you to see all of the recommendations including recommendations that are part of different regulatory compliance standards.

1.  (Optional) Select a relevant environment(s).

    :::image type="content" source="media/review-security-recommendations/environment-filter.png" alt-text="Screenshot of the environment filter, to select your filters.":::

1. Select the :::image type="icon" source="media/review-security-recommendations/drop-down-arrow.png" border="false"::: to expand the control, and view a list of recommendations.

    :::image type="content" source="media/review-security-recommendations/list-recommendations.png" alt-text="Screenshot showing how to see the full list of recommendations by selecting the drop-down menu icon." lightbox="media/review-security-recommendations/list-recommendations-expanded.png":::

1. Select a specific recommendation to view the recommendation details page.

    :::image type="content" source="./media/review-security-recommendations/recommendation-details-page.png" alt-text="Screenshot of the recommendation details page." lightbox="./media/review-security-recommendations/recommendation-details-page-expanded.png":::

    1. For supported recommendations, the top toolbar shows any or all of the following buttons:
        - **Enforce** and **Deny** (see [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md)).
        - **View policy definition** to go directly to the Azure Policy entry for the underlying policy.
        - **Open query** - All recommendations have the option to view the detailed information about the affected resources using Azure Resource Graph Explorer.
    1. **Severity indicator**.
    1. **Freshness interval** (where relevant).
    1. **Count of exempted resources** if exemptions exist for a recommendation, this shows the number of resources that have been exempted with a link to view the specific resources.
    1. **Mapping to MITRE ATT&CK ® tactics and techniques** if a recommendation has defined tactics and techniques, select the icon for links to the relevant pages on MITRE's site. This applies only to Azure scored recommendations.

        :::image type="content" source="media/review-security-recommendations/tactics-window.png" alt-text="Screenshot of the MITRE tactics mapping for a recommendation.":::

    1. **Description** - A short description of the security issue.
    1. When relevant, the details page also includes a table of **related recommendations**:

        The relationship types are:

        - **Prerequisite** - A recommendation that must be completed before the selected recommendation
        - **Alternative** - A different recommendation, which provides another way of achieving the goals of the selected recommendation
        - **Dependent** - A recommendation for which the selected recommendation is a prerequisite

        For each related recommendation, the number of unhealthy resources is shown in the "Affected resources" column.

        > [!TIP]
        > If a related recommendation is grayed out, its dependency isn't yet completed and so isn't available.

    1. **Remediation steps** - A description of the manual steps required to remediate the security issue on the affected resources. For recommendations with the **Fix** option**, you can select **View remediation logic** before applying the suggested fix to your resources.

    1. **Affected resources** - Your resources are grouped into tabs:
        - **Healthy resources** – Relevant resources, which either aren't impacted or on which you've already  remediated the issue.
        - **Unhealthy resources** – Resources that are still impacted by the identified issue.
        - **Not applicable resources** – Resources for which the recommendation can't give a definitive answer. The not applicable tab also includes reasons for each resource. 

            :::image type="content" source="./media/review-security-recommendations/recommendations-not-applicable-reasons.png" alt-text="Not applicable resources with reasons.":::
    1. Action buttons to remediate the recommendation or trigger a logic app.

## Search for a recommendation

You can search for specific recommendations by name. The search box and filters above the list of recommendations can be used to help locate a specific recommendation. 

Custom recommendations only appear under the All recommendations tab.

**To search for recommendations**:

1. On the recommendation page, select an environment from the environment filter.

    :::image type="content" source="media/review-security-recommendations/environment-filter.png" alt-text="Screenshot of the environmental filter on the recommendation page.":::

    You can select 1, 2, or all options at a time. The page's results will automatically reflect your choice.

1. Enter a name in the search box, or select one of the available filters.

    :::image type="content" source="media/review-security-recommendations/search-filters.png" alt-text="Screenshot of the search box and filter list.":::

1. Select :::image type="icon" source="media/review-security-recommendations/add-filter.png" border="false"::: to add more filter(s).

1. Select a filter from the drop-down menu.

    :::image type="content" source="media/review-security-recommendations/filter-drop-down.png" alt-text="Screenshot of the available filters to select.":::

1. Select a value from the drop-down menu.

1. Select **OK**.

## Review recommendation data in Azure Resource Graph Explorer (ARG)

You can review recommendations in ARG both on the recommendations page or on an individual recommendation. 

The toolbar on the recommendation details page includes an **Open query** button to explore the details in [Azure Resource Graph (ARG)](../governance/resource-graph/index.yml), an Azure service that gives you the ability to query - across multiple subscriptions - Defender for Cloud's security posture data.

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
| :::image type="icon" source="media/secure-score-security-controls/preview-icon.png" border="false":::  | *Preview recommendation** | This recommendation won't affect your secure score until it's GA. |
| :::image type="icon" source="media/secure-score-security-controls/fix-icon.png" border="false"::: | **Fix** | From within the recommendation details page, you can use 'Fix' to resolve this issue. |
| :::image type="icon" source="media/secure-score-security-controls/enforce-icon.png" border="false"::: | **Enforce** | From within the recommendation details page, you can automatically deploy a policy to fix this issue whenever someone creates a non-compliant resource. |
| :::image type="icon" source="media/secure-score-security-controls/deny-icon.png" border="false"::: | **Deny** | From within the recommendation details page, you can prevent new resources from being created with this issue. |

Recommendations that aren't included in the calculations of your secure score, should still be remediated wherever possible, so that when the period ends they'll contribute towards your score instead of against it.

## Download recommendations in a CSV report

Recommendations can be downloaded to a CSV report from the Recommendations page.

**To download a CSV report of your recommendations**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Select **Download CSV report**.

    :::image type="content" source="media/review-security-recommendations/download-csv.png" alt-text="Screenshot showing you where to select the Download C S V report from.":::

You'll know the report is being prepared by the pop-up.

:::image type="content" source="media/review-security-recommendations/preparing-report.png" alt-text="Screenshot of report being prepared.":::

When the report is ready, you'll be notified by a second pop-up.

:::image type="content" source="media/review-security-recommendations/downloaded-csv.png" alt-text="Screenshot letting you know your downloaded completed.":::

## Next steps

In this document, you were introduced to security recommendations in Defender for Cloud. For related information:

- [Remediate recommendations](implement-security-recommendations.md)--Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md).
- [Automate responses to Defender for Cloud triggers](workflow-automation.md)--Automate responses to recommendations
- [Exempt a resource from a recommendation](exempt-resource.md)
- [Security recommendations - a reference guide](recommendations-reference.md)
