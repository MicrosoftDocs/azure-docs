---
title: Security recommendations in Azure Security Center
description: This document walks you through how recommendations in Azure Security Center help you protect your Azure resources and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 86c50c9f-eb6b-4d97-acb3-6d599c06133e
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/24/2021
ms.author: memildin

---
# Security recommendations in Azure Security Center 

This topic explains how to view and understand the recommendations in Azure Security Center to help you protect your Azure resources.


## What are security recommendations?

Security Center periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to remediate those vulnerabilities.

Recommendations are actions for you to take in order to secure and harden your resources. 

Each recommendation provides you with:

- A short description of the issue
- The remediation steps to carry out in order to implement the recommendation
- The affected resources

## How does Microsoft decide what needs securing and hardening?

Security Center's recommendations are based on the Azure Security Benchmark. Almost every recommendation has an underlying policy that is derived from a requirement in the benchmark.

Azure Security Benchmark is the Microsoft-authored, Azure-specific set of guidelines for security and compliance best practices based on common compliance frameworks. This widely respected benchmark builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security. Learn more about [Azure Security Benchmark](../security/benchmarks/introduction.md).

When you're reviewing the details of a recommendation, it's often helpful to be able to see the underlying policy. For every recommendation supported by a policy, use the **View policy definition** link from the recommendation details page to go directly to the Azure Policy entry for the relevant policy:

:::image type="content" source="media/release-notes/view-policy-definition.png" alt-text="Link to Azure Policy page for the specific policy supporting a recommendation":::

Use this link to view the policy definition and review the evaluation logic. 

If you're reviewing the list of recommendations on our [Security recommendations reference guide](recommendations-reference.md), you'll also see links to the policy definition pages:

:::image type="content" source="media/release-notes/view-policy-definition-from-documentation.png" alt-text="Accessing the Azure Policy page for a specific policy directly from the Azure Security Center recommendations reference page":::

## Monitor recommendations <a name="monitor-recommendations"></a>

Security Center analyzes the security state of your resources to identify potential vulnerabilities. 

1. From Security Center's menu, open the **Recommendations** page to see the recommendations applicable to your environment. Recommendations are grouped into security controls.

    :::image type="content" source="./media/security-center-recommendations/view-recommendations.png" alt-text="Recommendations grouped by security control" lightbox="./media/security-center-recommendations/view-recommendations.png":::

1. To find recommendations specific to the resource type, severity, environment, or other criteria that are important to you, use the optional filters above the list of recommendations.

    :::image type="content" source="media/security-center-recommendations/recommendation-list-filters.png" alt-text="Filters for refining the list of Azure Security Center recommendations":::

1. Expand a control and select a specific recommendation to view the recommendation details page.

    :::image type="content" source="./media/security-center-recommendations/recommendation-details-page.png" alt-text="Recommendation details page." lightbox="./media/security-center-recommendations/recommendation-details-page.png":::

    The page includes:

    1. For supported recommendations, the top toolbar shows any or all of the following buttons:
        - **Enforce** and **Deny** (see [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md))
        - **View policy definition** to go directly to the Azure Policy entry for the underlying policy
    1. **Severity indicator**
    1. **Freshness interval** (where relevant)
    1. **Count of exempted resources** if exemptions exist for this recommendation, this shows the number of resources that have been exempted
    1. **Description** - A short description of the issue
    1. **Remediation steps** - A description of the manual steps required to remediate the security issue on the affected resources. For recommendations with 'quick fix', you can select **View remediation logic** before applying the suggested fix to your resources. 
    1. **Affected resources** - Your resources are grouped into tabs:
        - **Healthy resources** – Relevant resources which either aren't impacted or on which you've already  remediated the issue.
        - **Unhealthy resources** – Resources which are still impacted by the identified issue.
        - **Not applicable resources** – Resources for which the recommendation can't give a definitive answer. The not applicable tab also includes reasons for each resource. 

            :::image type="content" source="./media/security-center-recommendations/recommendations-not-applicable-reasons.png" alt-text="Not applicable resources with reasons.":::
    1. Action buttons to remediate the recommendation or trigger a logic app.

## Preview recommendations

Recommendations flagged as **Preview** aren't included in the calculations of your secure score.

They should still be remediated wherever possible, so that when the preview period ends they'll contribute towards your score.

An example of a preview recommendation:

:::image type="content" source="./media/secure-score-security-controls/example-of-preview-recommendation.png" alt-text="Recommendation with the preview flag":::
 
## Next steps

In this document, you were introduced to security recommendations in Security Center. For related information:

- [Remediate recommendations](security-center-remediate-recommendations.md)--Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md).
- [Automate responses to Security Center triggers](workflow-automation.md)--Automate responses to recommendations
- [Exempt a resource from a recommendation](exempt-resource.md)
- [Security recommendations - a reference guide](recommendations-reference.md)