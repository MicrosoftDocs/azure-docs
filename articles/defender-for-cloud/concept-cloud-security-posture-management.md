---
title: Cloud Security Posture Management (CSPM)
description: Learn more about Cloud Security Posture Management (CSPM) in Microsoft Defender for Cloud and how it helps improve your security posture.
ms.topic: concept-article
ms.date: 05/23/2024
#customer intent: As a reader, I want to understand the concept of Cloud Security Posture Management (CSPM) in Microsoft Defender for Cloud.
---

# Cloud security posture management (CSPM)

One of Microsoft Defender for Cloud's main pillars is cloud security posture management (CSPM). CSPM provides detailed visibility into the security state of your assets and workloads, and provides hardening guidance to help you efficiently and effectively improve your security posture.

Defender for Cloud continually assesses your resources against security standards that are defined for your Azure subscriptions, AWS accounts, and GCP projects. Defender for Cloud issues security recommendations based on these assessments.

By default, when you enable Defender for Cloud on an Azure subscription, the [Microsoft Cloud Security Benchmark (MCSB)](concept-regulatory-compliance.md) compliance standard is turned on. It provides recommendations. Defender for Cloud provides an aggregated [secure score](secure-score-security-controls.md) based on some of the MCSB recommendations. The higher the score, the lower the identified risk level.

## CSPM features

Defender for Cloud provides the following CSPM offerings:

- **Foundational CSPM** - Defender for Cloud offers foundational multicloud CSPM capabilities for free. These capabilities are automatically enabled by default for subscriptions and accounts that onboard to Defender for Cloud.

- **Defender Cloud Security Posture Management (CSPM) plan** - The optional, paid Defender for Cloud Secure Posture Management plan provides more, advanced security posture features.

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
| [Workflow automation](workflow-automation.yml) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| Tools for remediation | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP, on-premises |
| [Microsoft Cloud Security Benchmark](concept-regulatory-compliance.md) | :::image type="icon" source="./media/icons/yes-icon.png"::: | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [AI security posture management](ai-security-posture.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS |
| [Agentless VM vulnerability scanning](enable-agentless-scanning-vms.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Agentless VM secrets scanning](secrets-scanning-servers.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Attack path analysis](how-to-manage-attack-path.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Risk prioritization](risk-prioritization.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Risk hunting with security explorer](how-to-manage-cloud-security-explorer.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Code-to-cloud mapping for containers](container-image-mapping.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | GitHub, Azure DevOps |
| [Code-to-cloud mapping for IaC](iac-template-mapping.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure DevOps |
| [PR annotations](review-pull-request-annotations.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | GitHub, Azure DevOps |
| Internet exposure analysis | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [External attack surface management (EASM)](concept-easm.md) (for details see [Defender CSPM integration](concept-easm.md#defender-cspm-integration)) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Permissions Management (CIEM)](permissions-management.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Regulatory compliance assessments](concept-regulatory-compliance-standards.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [ServiceNow Integration](integration-servicenow.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Critical assets protection](critical-assets-protection.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Governance to drive remediation at-scale](governance-rules.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Data security posture management, Sensitive data scanning](concept-data-security-posture.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Agentless discovery for Kubernetes](concept-agentless-containers.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |
| [Agentless code-to-cloud containers vulnerability assessment](agentless-vulnerability-assessment-azure.md) | - | :::image type="icon" source="./media/icons/yes-icon.png"::: | Azure, AWS, GCP |

> [!NOTE]
> Starting March 7, 2024, Defender CSPM must be enabled to have premium DevOps security capabilities that include code-to-cloud contextualization powering security explorer and attack paths and pull request annotations for Infrastructure-as-Code security findings. See DevOps security [support and prerequisites](devops-support.md) to learn more.

## Integrations (preview)

Microsoft Defender for Cloud now has built-in integrations to help you use third-party systems to seamlessly manage and track tickets, events, and customer interactions. You can push recommendations to a third-party ticketing tool, and assign responsibility to a team for remediation.

Integration streamlines your incident response process, and improves your ability to manage security incidents. You can track, prioritize, and resolve security incidents more effectively.

You can choose which ticketing system to integrate. For preview, only ServiceNow integration is supported. For more information about how to configure ServiceNow integration, see [Integrate ServiceNow with Microsoft Defender for Cloud (preview)](integration-servicenow.md).

## Plan pricing

- Review the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) to learn about Defender CSPM pricing.

- From March 7, 2024, advanced DevOps security posture capabilities will only be available through the paid Defender CSPM plan. Free foundational security posture management in Defender for Cloud will continue providing a number of Azure DevOps recommendations. Learn more about [DevOps security features](devops-support.md#azure-devops).

- For subscriptions that use both Defender CSPM and Defender for Containers plans, free vulnerability assessment is calculated based on free image scans provided via the Defender for Containers plan, as summarized [in the Microsoft Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

- Defender CSPM protects all multicloud workloads, but billing is applied only on specific resources. The following tables list the billable resources when Defender CSPM is enabled on Azure subscriptions, AWS accounts, or GCP projects.

    | Azure Service | Resource types | Exclusions |
    |---|---|---|
    | Compute | Microsoft.Compute/virtualMachines<br/>Microsoft.Compute/virtualMachineScaleSets/virtualMachines<br/>Microsoft.ClassicCompute/virtualMachines | - Deallocated VMs<br/>- Databricks VMs |
    | Storage | Microsoft.Storage/storageAccounts | Storage accounts without blob containers or file shares |
    | DBs | Microsoft.Sql/servers<br/>Microsoft.DBforPostgreSQL/servers<br/>Microsoft.DBforMySQL/servers<br/>Microsoft.Sql/managedInstances<br/>Microsoft.DBforMariaDB/servers<br/>Microsoft.Synapse/workspaces | --- |

    | AWS Service | Resource types | Exclusions |
    |---|---|---|
    | Compute | EC2 instances |  Deallocated VMs |
    | Storage | S3 Buckets | --- |
    | DBs | RDS instances | --- |

    | GCP Service | Resource types | Exclusions |
    |---|---|---|
    | Compute |  1. Google Compute instances<br/> 2. Google Instance Group | Instances with non-running states |
    | Storage | Storage buckets | - Buckets from classes: ‘nearline’, ‘coldline’, ‘archive’<br/>- Buckets from regions other than: europe-west1, us-east1, us-west1, us-central1, us-east4, asia-south1, northamerica-northeast1 |
    | DBs | Cloud SQL Instances | --- |

## Azure cloud support

For commercial and national cloud coverage, review the [features supported in Azure cloud environments](support-matrix-cloud-environment.md).

## Support for Resource type in AWS and GCP

For multicloud support of resource types (or services) in our foundational multicloud CSPM tier, see the [table of multicloud resource and service types for AWS and GCP](multicloud-resource-types-support-foundational-cspm.md).

## Next steps

- Watch [Predict future security incidents! Cloud Security Posture Management with Microsoft Defender](https://www.youtube.com/watch?v=jF3NSR_OepI).
- Learn about [security standards and recommendations](security-policy-concept.md).
- Learn about [secure score](secure-score-security-controls.md).
