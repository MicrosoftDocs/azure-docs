---
title: Cloud Security Posture Management (CSPM)
description: Learn more about CSPM in Microsoft Defender for Cloud.
ms.topic: conceptual
ms.custom: ignite-2022, build-2023
ms.date: 11/15/2023
---

# Cloud security posture management (CSPM)

One of Microsoft Defender for Cloud's main pillars is cloud security posture management (CSPM). CSPM provides detailed visibility into the security state of your assets and workloads, and provides hardening guidance to help you efficiently and effectively improve your security posture.

Defender for Cloud continually assesses your resources against security standards that are defined for your Azure subscriptions, AWS accounts, and GCP projects. Defender for Cloud issues security recommendations based on these assessments.


By default, when you enable Defender for Cloud on an Azure subscription, the [Microsoft Cloud Security Benchmark (MCSB)](concept-regulatory-compliance.md) compliance standard is turned on. It provides recommendations. Defender for Cloud provides an aggregated [secure score](secure-score-security-controls.md) based on some of the MCSB recommendations. The higher the score, the lower the identified risk level.


## CSPM features

Defender for Cloud provides the following CSPM offerings:

- **Foundational CSPM** - Defender for Cloud offers foundational multicloud CSPM capabilities for free. These capabilities are automatically enabled by default for subscriptions and accounts that onboard to Defender for Cloud.

- **Defender Cloud Security Posture Management (CSPM) plan** - The optional, paid Defender for Cloud Secure Posture Management plan provides additional, advanced security posture features.


## Plan availability

Learn more about [Defender CSPM pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

The following table summarizes each plan and their cloud availability.

| Feature | Foundational CSPM | Defender CSPM | Cloud availability |
|--|--|--|--|
| [Security recommendations](review-security-recommendations.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png":::| Azure, AWS, GCP, on-premises |
| [Asset inventory](asset-inventory.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Secure score](secure-score-security-controls.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Data visualization and reporting with Azure Workbooks | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Data exporting](export-to-siem.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Workflow automation](workflow-automation.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Tools for remediation | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Microsoft Cloud Security Benchmark | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Security governance](governance-rules.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Regulatory compliance standards](concept-regulatory-compliance.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Cloud security explorer](how-to-manage-cloud-security-explorer.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Attack path analysis](how-to-manage-attack-path.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Agentless scanning for machines](concept-agentless-data-collection.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Agentless discovery for Kubernetes](concept-agentless-containers.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure |
| [Container registries vulnerability assessment](concept-agentless-containers.md), including registry scanning | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure |
| [Data aware security posture](concept-data-security-posture.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| EASM insights in network exposure | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |


Starting March 1, 2024, Defender CSPM must be enabled to have premium DevOps security capabilities which include code-to-cloud contextualization powering security explorer and attack paths and pull request annotations for Infrastructure-as-Code security findings. See DevOps security [support and prerequisites](devops-support.md) to learn more.

## Integrations (preview)

Microsoft Defender for Cloud now has built-in integrations to help you use third-party systems to seamlessly manage and track tickets, events, and customer interactions. You can push recommendations to a third-party ticketing tool, and assign responsibility to a team for remediation. 

Integration streamlines your incident response process, and improves your ability to manage security incidents. You can track, prioritize, and resolve security incidents more effectively.


You can choose which ticketing system to integrate. For preview, only ServiceNow integration is supported. For more information about how to configure ServiceNow integration, see [Integrate ServiceNow with Microsoft Defender for Cloud (preview)](integration-servicenow.md).


## Plan pricing

- Review the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) to learn about Defender CSPM pricing.

- DevOps security features under the Defender CSPM plan will remain free until March 1, 2024. Defender CSPM DevOps security features include code-to-cloud contextualization powering security explorer and attack paths and pull request annotations for Infrastructure-as-Code security findings.

- For subscriptions that use both Defender CSPM and Defender for Containers plans, free vulnerability assessment is calculated based on free image scans provided via the Defender for Containers plan, as summarized [in the Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Azure cloud support

For commercial and national cloud coverage, review [features supported in Azure cloud environments](support-matrix-cloud-environment.md).

## Next steps

- Watch [Predict future security incidents! Cloud Security Posture Management with Microsoft Defender](https://www.youtube.com/watch?v=jF3NSR_OepI).
- Learn about [security standards and recommendations](security-policy-concept.md).
- Learn about [secure score](secure-score-security-controls.md).
