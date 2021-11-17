---
title: Security recommendations in Microsoft Defender for Cloud
description: This document walks you through how recommendations in Microsoft Defender for Cloud help you protect your Azure resources and stay in compliance with security policies.
author: memildin
manager: rkarlin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: memildin
---
# Review your security recommendations

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This topic explains how to view and understand the recommendations in Microsoft Defender for Cloud to help you protect your Azure resources.

## Monitor recommendations <a name="monitor-recommendations"></a>

Defender for Cloud analyzes the security state of your resources to identify potential vulnerabilities. 

1. From Defender for Cloud's menu, open the **Recommendations** page to see the recommendations applicable to your environment. Recommendations are grouped into security controls.

    :::image type="content" source="./media/review-security-recommendations/view-recommendations.png" alt-text="Recommendations grouped by security control." lightbox="./media/review-security-recommendations/view-recommendations.png":::

1. To find recommendations specific to the resource type, severity, environment, or other criteria that are important to you, use the optional filters above the list of recommendations.

    :::image type="content" source="media/review-security-recommendations/recommendation-list-filters.png" alt-text="Filters for refining the list of Microsoft Defender for Cloud recommendations.":::

1. Expand a control and select a specific recommendation to view the recommendation details page.

    :::image type="content" source="./media/review-security-recommendations/recommendation-details-page.png" alt-text="Recommendation details page." lightbox="./media/review-security-recommendations/recommendation-details-page.png":::

    The page includes:

    1. For supported recommendations, the top toolbar shows any or all of the following buttons:
        - **Enforce** and **Deny** (see [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md)).
        - **View policy definition** to go directly to the Azure Policy entry for the underlying policy.
        - **Open query** - All recommendations have the option to view the detailed information about the affected resources using Azure Resource Graph Explorer.
    1. **Severity indicator**.
    1. **Freshness interval** (where relevant).
    1. **Count of exempted resources** if exemptions exist for a recommendation, this shows the number of resources that have been exempted with a link to view the specific resources.
    1. **Mapping to MITRE ATT&CK ® tactics and techniques** if a recommendation has defined tactics and techniques, select the icon for links to the relevant pages on MITRE's site. 

        :::image type="content" source="media/review-security-recommendations/tactics-window.png" alt-text="Screenshot of the MITRE tactics mapping for a recommendation.":::

    1. **Description** - A short description of the security issue.
    1. When relevant, the details page also includes a table of **related recommendations**:

        The relationship types are:

        - **Prerequisite** - A recommendation that must be completed before the selected recommendation
        - **Alternative** - A different recommendation which provides another way of achieving the goals of the selected recommendation
        - **Dependent** - A recommendation for which the selected recommendation is a prerequisite

        For each related recommendation, the number of unhealthy resources is shown in the "Affected resources" column.

        > [!TIP]
        > If a related recommendation is grayed out, its dependency isn't yet completed and so isn't available.

    1. **Remediation steps** - A description of the manual steps required to remediate the security issue on the affected resources. For recommendations with the **Fix** option**, you can select **View remediation logic** before applying the suggested fix to your resources.

    1. **Affected resources** - Your resources are grouped into tabs:
        - **Healthy resources** – Relevant resources which either aren't impacted or on which you've already  remediated the issue.
        - **Unhealthy resources** – Resources which are still impacted by the identified issue.
        - **Not applicable resources** – Resources for which the recommendation can't give a definitive answer. The not applicable tab also includes reasons for each resource. 

            :::image type="content" source="./media/review-security-recommendations/recommendations-not-applicable-reasons.png" alt-text="Not applicable resources with reasons.":::
    1. Action buttons to remediate the recommendation or trigger a logic app.

## Review recommendation data in Azure Resource Graph Explorer (ARG)

The toolbar on the recommendation details page includes an **Open query** button to explore the details in [Azure Resource Graph (ARG)](../governance/resource-graph/index.yml), an Azure service that provides the ability to query - across multiple subscriptions - Defender for Cloud's security posture data.

ARG is designed to provide efficient resource exploration with the ability to query at scale across your cloud environments with robust filtering, grouping, and sorting capabilities. It's a quick and efficient way to query information across Azure subscriptions programmatically or from within the Azure portal.

Using the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/), you can cross-reference Defender for Cloud data with other resource properties.

For example, this recommendation details page shows fifteen affected resources:

:::image type="content" source="./media/review-security-recommendations/open-query.png" alt-text="The **Open Query** button on the recommendation details page.":::

When you open the underlying query, and run it, Azure Resource Graph Explorer returns the same fifteen resources and their health status for this recommendation: 

:::image type="content" source="./media/review-security-recommendations/run-query.png" alt-text="Azure Resource Graph Explorer showing the results for the recommendation shown in the previous screenshot.":::

## Preview recommendations

Recommendations flagged as **Preview** aren't included in the calculations of your secure score.

They should still be remediated wherever possible, so that when the preview period ends they'll contribute towards your score.

An example of a preview recommendation:

:::image type="content" source="./media/secure-score-security-controls/example-of-preview-recommendation.png" alt-text="Recommendation with the preview flag.":::
 
## Next steps

In this document, you were introduced to security recommendations in Defender for Cloud. For related information:

- [Remediate recommendations](implement-security-recommendations.md)--Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md).
- [Automate responses to Defender for Cloud triggers](workflow-automation.md)--Automate responses to recommendations
- [Exempt a resource from a recommendation](exempt-resource.md)
- [Security recommendations - a reference guide](recommendations-reference.md)
