---
title: Overview of Cloud Security Posture Management (CSPM)
description: Learn more about the new Defender CSPM plan and the other enhanced security features that can be enabled for your multicloud environment through the Defender Cloud Security Posture Management (CSPM) plan.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 03/26/2023
---

# Cloud Security Posture Management (CSPM)

One of Microsoft Defender for Cloud's main pillars for cloud security is Cloud Security Posture Management (CSPM). CSPM provides you with hardening guidance that helps you efficiently and effectively improve your security. CSPM also gives you visibility into your current security situation.

Defender for Cloud continually assesses your resources, subscriptions and organization for security issues. Defender for Cloud shows your security posture in secure score. The secure score is an aggregated score of the security findings that tells you your current security situation. The higher the score, the lower the identified risk level.

## Prerequisites

- **Foundational CSPM capabilities** - None 
- **Defender Cloud Security Posture Management (CSPM)** - Agentless scanning requires the **Subscription Owner** to enable the plan. Anyone with a lower level of authorization can enable the Defender CSPM plan but the agentless scanner won't be enabled by default due to lack of permissions. Attack path analysis and security explorer won't be populated with vulnerabilities because the agentless scanner is disabled. 

For commercial and national cloud coverage, see the [features supported in different Azure cloud environments](support-matrix-defender-for-cloud.md#features-supported-in-different-azure-cloud-environments).

## Defender CSPM plan options

Defender for cloud offers foundational multicloud CSPM capabilities for free. These capabilities are automatically enabled by default on any subscription or account that has onboarded to Defender for Cloud. The foundational CSPM includes asset discovery, continuous assessment and security recommendations for posture hardening, compliance with Microsoft Cloud Security Benchmark (MCSB), and a [Secure score](secure-score-access-and-track.md) which measure the current status of your organization's posture.

The optional Defender CSPM plan, provides advanced posture management capabilities such as [Attack path analysis](how-to-manage-attack-path.md), [Cloud security explorer](how-to-manage-cloud-security-explorer.md), advanced threat hunting, [security governance capabilities](concept-regulatory-compliance.md), and also tools to assess your [security compliance](review-security-recommendations.md) with a wide range of benchmarks, regulatory standards, and any custom security policies required in your organization, industry, or region. 

### Plan pricing

> [!NOTE]
> The Microsoft Defender CSPM plan protects across multicloud workloads. With Defender CSPM generally available (GA), the plan will remain free until billing starts on May 1 2023. Billing will apply for compute, database, and storage resources. Billable workloads will be VMs, Storage Accounts, OSS DBs, and SQL PaaS & Servers on Machines. When billing starts, existing Microsoft Defender for Cloud customers will receive automatically applied discounts for Defender CSPM. ​

 Microsoft Defender CSPM protects across all your multicloud workloads, but billing only applies for Servers, Databases and Storage accounts at $15/billable resource/month. If you have one of the following plans enabled, you will receive a discount.

Current Microsoft Defender for Cloud customers receive automatically applied discounts (5-25% discount per billed workload based on the highest applicable discount). 

Refer to the following table:

| Current Defender for Cloud Customer | Automatic Discount | Defender CSPM Price |
|--|--|--|
|Defender for Servers P2 | 25% | **$11.25/** Compute or Data workload / month
|Defender for Containers | 10% | **$13.50/** Compute or Data workload / month
|Defender for DBs / Defender for Storage | 5% | **$14.25/** Compute or Data workload / month  

## Plan Availability

Learn more about [Defender CSPM pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

The following table summarizes each plan and their cloud availability.

| Feature | Foundational CSPM capabilities | Defender CSPM | Cloud availability |
|--|--|--|--|
| [Security recommendations to fix misconfigurations and weaknesses](review-security-recommendations.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png":::| Azure, AWS, GCP, on-premises |
| Asset inventory | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Secure score](secure-score-security-controls.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Data visualization and reporting with Azure Workbooks | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Data exporting | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Workflow automation | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Remediation tracking | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Microsoft Cloud Security Benchmark | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Governance](concept-regulatory-compliance.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Regulatory compliance](concept-regulatory-compliance.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Cloud security explorer](how-to-manage-cloud-security-explorer.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Attack path analysis](how-to-manage-attack-path.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Agentless scanning for machines](concept-agentless-data-collection.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| Agentless discovery for Kubernetes | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure |
| Agentless vulnerability assessments for container images, including registry scanning (\* Up to 20 unique images per billable resource) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure |
| Sensitive data discovery | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| Data flows discovery | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| EASM insights in network exposure | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |


> [!NOTE]
> If you have enabled Defender for DevOps, you will only gain cloud security graph and attack path analysis to the artifacts that arrive through those connectors. 
>
> To enable Governance for DevOps related recommendations, the Defender CSPM plan needs to be enabled on the Azure subscription that hosts the DevOps connector.

## Next steps

Learn about Defender for Cloud [Defender plans](defender-for-cloud-introduction.md#protect-cloud-workloads).
