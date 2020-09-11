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
ms.date: 07/29/2019
ms.author: memildin

---
# Security recommendations in Azure Security Center 
This topic explains how to view and understand the recommendations in Azure Security Center to help you protect your Azure resources.

> [!NOTE]
> This document introduces the service by using an example deployment.  This document is not a step-by-step guide.
>

## What are security recommendations?

Recommendations are actions for you to take in order to secure your resources.

Security Center periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to remediate those vulnerabilities.

Each recommendation provides you with:

- A short description of the issue.
- The remediation steps to carry out in order to implement the recommendation.
- The affected resources.

## Monitor recommendations <a name="monitor-recommendations"></a>

Security Center analyzes the security state of your resources to identify potential vulnerabilities. The **Recommendations** tile under **Overview** shows the total number of recommendations identified by Security Center.

![Security center overview](./media/security-center-recommendations/asc-overview.png)

1. Select the **Recommendations tile** under **Overview**. The **Recommendations** list opens.

1. Recommendations are grouped into security controls.

      ![Recommendations grouped by security control](./media/security-center-recommendations/view-recommendations.png)

1. Expand a control and select a specific recommendation to view the recommendation page.

    :::image type="content" source="./media/security-center-recommendations/recommendation-details-page.png" alt-text="Recommendation details page." lightbox="./media/security-center-recommendations/recommendation-details-page.png":::

    The page includes:

    - **Enforce** and **Deny** buttons on supported recommendations (see [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md))
    - **Severity indicator**
    - **Freshness interval**  (where relevant) 
    - **Description** - A short description of the issue
    - **Remediation steps** - A description of the manual steps required to remediate the security issue on the affected resources. For recommendations with 'quick fix', you can select **View remediation logic** before applying the suggested fix to your resources. 
    - **Affected resources** - Your resources are grouped into tabs:
        - **Healthy resources** – Relevant resources which either aren't impacted or on which you've already  remediated the issue.
        - **Unhealthy resources** – Resources which are still impacted by the identified issue.
        - **Not applicable resources** – Resources for which the recommendation can't give a definitive answer. The not applicable tab also includes reasons for each resource. 

            :::image type="content" source="./media/security-center-recommendations/recommendations-not-applicable-reasons.png" alt-text="Not applicable resources with reasons.":::

## Preview recommendations

Recommendations flagged as **Preview** aren't included in the calculations of your secure score.

They should still be remediated wherever possible, so that when the preview period ends they'll contribute towards your score.

An example of a preview recommendation:

:::image type="content" source="./media/secure-score-security-controls/example-of-preview-recommendation.png" alt-text="Recommendation with the preview flag":::
 
## Next steps

In this document, you were introduced to security recommendations in Security Center. To learn how to remediate the recommendations:

- [Remediate recommendations](security-center-remediate-recommendations.md) — Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md).
