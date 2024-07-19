---
title: Risk prioritization
author: Elazark
ms.author: elkrieger
description: Learn how Defender for Cloud prioritizes security recommendations and mitigates risks to protect your environment.
ms.topic: concept-article
ms.date: 03/04/2024
ai-usage: ai-assisted
#customer intent: As a security analyst, I want to understand how Defender for Cloud prioritizes security risks so that I can effectively protect my environment.
---

# Risk prioritization

Microsoft Defender for Cloud proactively utilizes a dynamic engine which assesses the risks in your environment while taking into account the potential for the exploitation and the potential business impact to your organization. The engine prioritizes security recommendations based on the risk factors of each resource, which are determined by the context of the environment, including the resource's configuration, network connections, and security posture.

When Defender for Cloud performs a risk assessment of your security issues, the engine identifies the most significant security risks while distinguishing them from less risky issues. The recommendations are then sorted based on their risk level, allowing you to address the security issues that pose immediate threats with the greatest potential of being exploited in your environment.

Defender for Cloud then analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved to mitigate these risks. This approach helps you focus on urgent security concerns and makes remediation efforts more efficient and effective. Although risk prioritization doesn't affect the secure score, it helps you to address the most critical security issues in your environment.

## Recommendations

Microsoft Defender for Cloud's resources and workloads are assessed against built-in and custom security standards enabled in your Azure subscriptions, AWS accounts, and GCP projects. Based on those assessments, security recommendations provide practical steps to remediate security issues, and improve security posture.

> [!NOTE]
> Recommendations are included with the [Foundational CSPM plan](concept-cloud-security-posture-management.md#plan-availability) which is included with Defender for Cloud. However, risk prioritization and governance is supported only with the [Defender CSPM plan](concept-cloud-security-posture-management.md#plan-availability).
>
> If your environment is not protected by the Defender CSPM plan the columns with the risk prioritization features will appear blurred out.

Different resources can have the same recommendation with different risk levels. For example, a recommendation to enable MFA on a user account can have a different risk level for different users. The risk level is determined by the risk factors of each resource, such as its configuration, network connections, and security posture. The risk level is calculated based on the potential impact of the security issue being breached, the categories of risk, and the attack path that the security issue is part of.

In Defender for Cloud, navigate to the **Recommendations** dashboard to view an overview of the recommendations that exist for your environments prioritized by risk look at your environments.

On this page you can review the:

- **Title** - The title of the recommendation.

- **Affected resource** - The resource that the recommendation applies to.

- **Risk level** - The exploitability and the business impact of the underlying security issue, taking into account environmental resource context such as: Internet exposure, sensitive data, lateral movement, and more.

- **Risk factors** - Environmental factors of the resource affected by the recommendation, which influence the exploitability and the business impact of the underlying security issue. Examples for risk factors include internet exposure, sensitive data, lateral movement potential.

- **Attack paths** - The number of attack paths that the recommendation is part of based on the security engine's search for all potential attack paths based on the resources that exist in the environment and relationship that exists between them. Each environment will present its own unique attack paths.

- **Owner** - The person the recommendation is assigned to.

- **Status** - The current status of the recommendation. For example, unassigned, on time, overdue.

- **Insights** - Information related to the recommendation such as, if it's in preview, if it can be denied, if there is a fix option available and more.

    :::image type="content" source="media/risk-prioritization/recommendations-dashboard.png" alt-text="Screenshot of the recommendations dashboard which shows recommendations prioritized by their risk." lightbox="media/risk-prioritization/recommendations-dashboard.png":::

When you select a recommendation, you can view the details of the recommendation, including the description, attack paths, scope, freshness, last change date, owner, due date, severity, tactics & techniques, and more.

- **Description** - A short description of the security issue.

- **Attack Paths** - The number of attack paths.

- **Scope** - The affected subscription or resource.

- **Freshness** - The freshness interval for the recommendation.

- **Last change date** - The date this recommendation last had a change

- **Owner** - The person assigned to this recommendation.

- **Due date** - The assigned date the recommendation must be resolved by.

- **Severity** - The severity of the recommendation (High, Medium, or Low). More details below.

- **Tactics & techniques** - The tactics and techniques mapped to MITRE ATT&CK.

    :::image type="content" source="./media/risk-prioritization/recommendation-details-page.png" alt-text="Screenshot of the recommendation details page with labels for each element." lightbox="./media/security-policy-concept/recommendation-details-page.png":::

## What are risk factors?

Defender for Cloud utilizes the context of an environment, including the resource's configuration, network connections, and security posture, to perform a risk assessment of potential security issues. By doing so, it identifies the most significant security risks while distinguishing them from less risky issues. The recommendations are then sorted based on their risk level.

This risk assessment engine considers essential risk factors, such as internet exposure, data sensitivity, lateral movement, and potential attack paths. This approach prioritizes urgent security concerns, making remediation efforts more efficient and effective.

## How is risk calculated?

Defender for Cloud uses a context-aware risk-prioritization engine to calculate the risk level of each security recommendation. The risk level is determined by the risk factors of each resource, such as its configuration, network connections, and security posture. The risk level is calculated based on the potential impact of the security issue being breached, the categories of risk, and the attack path that the security issue is part of.

## Risk levels

Recommendations can be classified into five categories based on their risk level:

- **Critical**: Recommendations that indicate a critical security vulnerability that could be exploited by an attacker to gain unauthorized access to your systems or data.

- **High**: Recommendations that indicate a potential security risk that should be addressed in a timely manner, but might not require immediate attention.

- **Medium**: Recommendations that indicate a relatively minor security issue that can be addressed at your convenience.

- **Low**: Recommendations that indicate a relatively minor security issue that can be addressed at your convenience.

- **Not evaluated**: Recommendations that have not been evaluated yet. This could be due to the resource not being covered by the Defender CSPM plan which is a prerequisite for risk level.

The risk level is determined by a context-aware risk-prioritization engine that considers the risk factors of each resource. Learn more about how Defender for Cloud [identifies and remediates attack paths](how-to-manage-attack-path.md).

## Related content

- [Review security recommendations](review-security-recommendations.md)
- [Remediate security recommendations](implement-security-recommendations.md)
- [Drive remediation with governance rules](governance-rules.md)
- [Automate remediation responses](workflow-automation.yml)
