---
title: Overview of Cloud Security Posture Management (CSPM)
description: Learn more about the new Defender CSPM plan and the other enhanced security features that can be enabled for your multicloud environment through the Defender Cloud Security Posture Management (CSPM) plan.
ms.topic: conceptual
ms.custom: ignite-2022, build-2023
ms.date: 08/10/2023
---

# Cloud Security Posture Management (CSPM)

One of Microsoft Defender for Cloud's main pillars for cloud security is Cloud Security Posture Management (CSPM). CSPM provides you with hardening guidance that helps you efficiently and effectively improve your security. CSPM also gives you visibility into your current security situation.

Defender for Cloud continually assesses your resources, subscriptions and organization for security issues. Defender for Cloud shows your security posture in secure score. The secure score is an aggregated score of the security findings that tells you your current security situation. The higher the score, the lower the identified risk level.

## Prerequisites

- **Foundational CSPM** - None
- **Defender Cloud Security Posture Management (CSPM)** - Agentless scanning requires the **Subscription Owner** to enable the plan. Anyone with a lower level of authorization can enable the Defender CSPM plan but the agentless scanner won't be enabled by default due to lack of permissions. Attack path analysis and security explorer won't be populated with vulnerabilities because the agentless scanner is disabled.

For commercial and national cloud coverage, review [features supported in different Azure cloud environments](support-matrix-cloud-environment.md).

## Defender CSPM plan options

Defender for Cloud offers foundational multicloud CSPM capabilities for free. These capabilities are automatically enabled by default on any subscription or account that has onboarded to Defender for Cloud. The foundational CSPM includes asset discovery, continuous assessment and security recommendations for posture hardening, compliance with Microsoft Cloud Security Benchmark (MCSB), and a [Secure score](secure-score-access-and-track.md) which measure the current status of your organization's posture.

The optional Defender CSPM plan, provides advanced posture management capabilities such as [Attack path analysis](how-to-manage-attack-path.md), [Cloud security explorer](how-to-manage-cloud-security-explorer.md), advanced threat hunting, [security governance capabilities](governance-rules.md), and also tools to assess your [security compliance](review-security-recommendations.md) with a wide range of benchmarks, regulatory standards, and any custom security policies required in your organization, industry, or region.

### Plan pricing

Microsoft Defender CSPM protects across all your multicloud workloads, but billing only applies for Servers, Database, and Storage accounts at $5/billable resource/month. The underlying compute services for AKS are regarded as servers for billing purposes.

> [!NOTE]
>
> - The Microsoft Defender CSPM plan protects across multicloud workloads. With Defender CSPM generally available (GA), the plan will remain free until billing starts on August 1, 2023. Billing will apply for Servers, Database, and Storage resources. Billable workloads will be VMs, Storage accounts, OSS DBs, SQL PaaS, & SQL servers on machines.​
>
> - This price includes free vulnerability assessments for 20 unique images per charged resource, whereby the count will be based on the previous month's consumption. Every subsequent scan will be charged at $0.29 per image digest. The majority of customers are not expected to incur any additional image scan charges. For subscriptions that are both under the Defender CSPM and Defender for Containers plans, free vulnerability assessment will be calculated based on free image scans provided via the Defender for Containers plan, as specified [in the Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).
>
> - DevOps security features under the Defender CSPM plan will remain free until March 1, 2024. Defender CSPM DevOps security features include code-to-cloud contextualization powering security explorer and attack paths and pull request annotations for Infrastructure-as-Code security findings.

## Plan availability

Learn more about [Defender CSPM pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

The following table summarizes each plan and their cloud availability.

| Feature | Foundational CSPM | Defender CSPM | Cloud availability |
|--|--|--|--|
| [Security recommendations to fix misconfigurations and weaknesses](review-security-recommendations.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png":::| Azure, AWS, GCP, on-premises |
| [Asset inventory](asset-inventory.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Secure score](secure-score-security-controls.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Data visualization and reporting with Azure Workbooks | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Data exporting](export-to-siem.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Workflow automation](workflow-automation.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Tools for remediation | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Microsoft Cloud Security Benchmark | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Governance](governance-rules.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Regulatory compliance](concept-regulatory-compliance.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Cloud security explorer](how-to-manage-cloud-security-explorer.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Attack path analysis](how-to-manage-attack-path.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Agentless scanning for machines](concept-agentless-data-collection.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Agentless discovery for Kubernetes](concept-agentless-containers.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure |
| [Container registries vulnerability assessment](concept-agentless-containers.md), including registry scanning | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure |
| [Data aware security posture](concept-data-security-posture.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| EASM insights in network exposure | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |

## Next steps

- Watch video: [Predict future security incidents! Cloud Security Posture Management with Microsoft Defender](https://www.youtube.com/watch?v=jF3NSR_OepI)

- Learn about Defender for Cloud's [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
