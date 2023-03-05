---
title: Overview of Cloud Security Posture Management (CSPM)
description: Learn more about the new Defender CSPM plan and the other enhanced security features that can be enabled for your multicloud environment through the Defender Cloud Security Posture Management (CSPM) plan.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 03/05/2023
---

# Cloud Security Posture Management (CSPM)

One of Microsoft Defender for Cloud's main pillars for cloud security is Cloud Security Posture Management (CSPM). CSPM provides you with hardening guidance that helps you efficiently and effectively improve your security. CSPM also gives you visibility into your current security situation.

Defender for Cloud continually assesses your resources, subscriptions and organization for security issues. Defender for Cloud shows your security posture in secure score. The secure score is an aggregated score of the security findings that tells you your current security situation. The higher the score, the lower the identified risk level.

## Availability

|Aspect|Details|
|----|:----|
|Release state:| Foundational CSPM capabilities: GA <br> Defender Cloud Security Posture Management (CSPM): Preview |
| Prerequisites | - **Foundational CSPM capabilities** - None <br> <br> - **Defender Cloud Security Posture Management (CSPM)** - Agentless scanning requires the **Subscription Owner** to enable the plan. Anyone with a lower level of authorization can enable the Defender CSPM plan but the agentless scanner won't be enabled by default due to lack of permissions. Attack path analysis and security explorer won't populate with vulnerabilities because the agentless scanner is disabled. |
|Clouds:| 	**Foundational CSPM capabilities** <br> :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Azure China 21Vianet)<br> <br> For Connected AWS accounts and GCP projects availability, see the [feature availability](#defender-cspm-plan-options) table. <br> <br> **Defender Cloud Security Posture Management (CSPM)** <br> :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet)<br> <br> For Connected AWS accounts and GCP projects availability, see the [feature availability](#defender-cspm-plan-options) table. |

## Defender CSPM plan options

Defender for cloud offers foundational multicloud CSPM capabilities for free. These capabilities are automatically enabled by default on any subscription or account that has onboarded to Defender for Cloud. The foundational CSPM includes asset discovery, continuous assessment and security recommendations for posture hardening, compliance with Microsoft Cloud Security Benchmark (MCSB), and a [Secure score](secure-score-access-and-track.md) which measure the current status of your organization’s posture.

The optional Defender CSPM plan, provides advanced posture management capabilities such as [Attack path analysis](#attack-path-analysis), [Cloud security explorer](#cloud-security-explorer), advanced threat hunting, [security governance capabilities](#security-governance-and-regulatory-compliance), and also tools to assess your [security compliance](#security-governance-and-regulatory-compliance) with a wide range of benchmarks, regulatory standards, and any custom security policies required in your organization, industry, or region. 

The following table summarizes each plan and their cloud availability.

| Feature | Foundational CSPM capabilities | Defender CSPM | Cloud availability |
|--|--|--|--|
| Continuous assessment of the security configuration of your cloud resources | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Security recommendations to fix misconfigurations and weaknesses](review-security-recommendations.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png":::| Azure, AWS, GCP, on-premises |
| [Secure score](secure-score-security-controls.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Governance](concept-regulatory-compliance.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Regulatory compliance](concept-regulatory-compliance.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Cloud security explorer](how-to-manage-cloud-security-explorer) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Attack path analysis](how-to-manage-attack-path) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Agentless scanning for machines](concept-agentless-data-collection.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |


> [!NOTE]
> If you have enabled Defender for DevOps, you will only gain cloud security graph and attack path analysis to the artifacts that arrive through those connectors. 
>
> To enable Governance for for DevOps related recommendations, the Defender CSPM plan needs to be enabled on the Azure subscription that hosts the DevOps connector.

## Next steps

Learn about Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
