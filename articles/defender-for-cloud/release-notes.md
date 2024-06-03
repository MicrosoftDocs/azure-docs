---
title: Release notes
description: This page is updated frequently with the latest updates in Defender for Cloud.
ms.topic: overview
ms.date: 06/03/2024
---

# What's new in Microsoft Defender for Cloud?

Defender for Cloud is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about new features, bug fixes, and deprecated functionality.

This page is updated frequently with the latest updates in Defender for Cloud.

> [!TIP]
> Get notified when this page is updated by copying and pasting the following URL into your feed reader:
>
> `https://aka.ms/mdc/rss`

To learn about *planned* changes that are coming soon to Defender for Cloud, see [Important upcoming changes to Microsoft Defender for Cloud](upcoming-changes.md).

If you're looking for items older than six months, you can find them in the [Archive for What's new in Microsoft Defender for Cloud](release-notes-archive.md).

## May 2024

|Date | Update |
|--|--|
| May 30 | [General Availability of Unified Disk Encryption recommendations](#general-availability-of-unified-disk-encryption-recommendations) |
| May 28 | [Remediate security baseline recommendation](#remediate-security-baseline-recommendation) |
| May 22 | [Configure email notifications for attack paths](#configure-email-notifications-for-attack-paths) |
| May 9 | [Checkov integration for IaC scanning in Defender for Cloud (Preview)](#checkov-integration-for-iac-scanning-in-defender-for-cloud-preview) |
| May 2 | [Updated security policy management is now generally available](#updated-security-policy-management-is-now-generally-available) |
| May 1 | [Defender for open-source databases is now available on AWS for Amazon instances (Preview)](#defender-for-open-source-databases-is-now-available-on-aws-for-amazon-instances-preview) |


### General Availability of Unified Disk Encryption recommendations

May 30, 2024

The following Unified Disk Encryption recommendations are now generally available (GA) within Azure Public Cloud. The recommendations enable customers to audit encryption compliance of virtual machines with Azure Disk Encryption or EncryptionAtHost.

| Recommendation name | Assessment key |
| ---- | ---- |
| [Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/a40cc620-e72c-fdf4-c554-c6ca2cd705c0) | a40cc620-e72c-fdf4-c554-c6ca2cd705c0 |
| [Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/0cb5f317-a94b-6b80-7212-13a9cc8826af) | 0cb5f317-a94b-6b80-7212-13a9cc8826af |

Azure Disk Encryption (ADE) and EncryptionAtHost provide encryption at rest coverage, as described in [Overview of managed disk encryption options - Azure Virtual Machines](/azure/virtual-machines/disk-encryption-overview), and we recommend enabling either of these on virtual machines. 

The recommendations depend on [Guest configuration](/azure/governance/machine-configuration/overview). The recommendations in this document are dependent on the configuration of the guest operating system. To ensure that the recommendations can be properly assessed for compliance, it is necessary to enable the required prerequisites on all virtual machines. 

These recommendations replace the recommendation [Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d57a4221-a804-52ca-3dea-768284f06bb7).

### Remediate security baseline recommendation

May 28, 2024

Microsoft Defender for Cloud enhances the Center for Internet Security (CIS) benchmarks by providing security baselines that are powered by Microsoft Defender Vulnerability Management (MDVM). The new recommendation **Machine should be configured securely (powered by MDVM)** helps you secure your servers by providing recommendations that improve your security posture.

### Configure email notifications for attack paths

May 22, 2024

You can now configure email notifications for attack paths in Defender for Cloud. This feature allows you to receive email notifications when an attack path is detected with a specified risk level or higher. 
Learn how to [configure email notifications](configure-email-notifications.md).

### Advanced hunting in Microsoft Defender XDR now includes Defender for Cloud alerts and incidents

May 21, 2024

Defender for Cloud's alerts and incidents are now integrated with Microsoft Defender XDR. This integration allows security teams to access Defender for Cloud alerts and incidents within the Microsoft Defender Portal. This integration provides richer context to investigations that span cloud resources, devices, and identities.

Learn more about the [advanced hunting in XDR integration](concept-integration-365.md#advanced-hunting-in-xdr).

### Checkov integration for IaC scanning in Defender for Cloud (Preview)

May 9, 2024

We are announcing the public preview of the Checkov integration for DevOps security in Defender for Cloud. This integration improves both the quality and total number of Infrastructure-as-Code checks run by the MSDO CLI when scanning IaC templates.

While in preview, Checkov must be explicitly invoked through the 'tools' input parameter for the MSDO CLI.

Learn more about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md) and configuring the MSDO CLI for [Azure DevOps](azure-devops-extension.yml) and [GitHub](github-action.md). 

### General availability of permissions management in Defender for Cloud

May 7, 2024

We're announcing the general availability (GA) of [permissions management](permissions-management.md) in Defender for Cloud.

### AI multicloud security posture management is publicly available for Azure and AWS

May 6, 2024

We're announcing the inclusion of AI security posture management in Defender for Cloud. This feature provides AI security posture management capabilities for Azure and AWS that enhance the security of your AI pipelines and services.

Learn more about [AI security posture management](ai-security-posture.md).

### Limited public preview of threat protection for AI workloads in Azure

May 6, 2024

Threat protection for AI workloads in Defender for Cloud provides contextual insights into AI workload threat protection, integrating with [Responsible AI](../ai-services/responsible-use-of-ai-overview.md) and Microsoft Threat Intelligence. Threat protections for AI workloads security alerts are integrated into Defender XDR in the Defender portal.
This plan helps you monitor your Azure OpenAI powered applications in runtime for malicious activity, identify, and remediate security risks.

Learn more about [threat protection for AI workloads](ai-threat-protection.md).

### Updated security policy management is now generally available

May 2, 2024

Security policy management across clouds (Azure, AWS, GCP) is now generally available (GA). This enables security teams to manage their security policies in a consistent way and with new features:

- A simplified and same cross cloud interface for creating and managing the Microsoft Cloud Security Benchmark (MCSB) as well as custom recommendations based on KQL queries.
- Managing regulatory compliance standards in Defender for Cloud across Azure, AWS, and GCP environments.
- New filtering and export capabilities for reporting.

For more information, see [Security policies in Microsoft Defender for Cloud](security-policy-concept.md#working-with-security-standards).

### Defender for open-source databases is now available on AWS for Amazon instances (Preview)

May 1, 2024

We're announcing the public preview of Defender for open-source databases on AWS that adds support for various types of Amazon Relational Database Service (RDS) instance types.

Learn more about [Defender for open-source databases](defender-for-databases-introduction.md) and how to [enable Defender for open-source databases on AWS](enable-defender-for-databases-aws.md).

## April 2024

|Date | Update |
|--|--|
| April 15 | [Defender for Containers is now generally available (GA) for AWS and GCP](#defender-for-containers-is-now-generally-available-ga-for-aws-and-gcp) |
| April 3 | [Risk prioritization is now the default experience in Defender for Cloud](#risk-prioritization-is-now-the-default-experience-in-defender-for-cloud) |
| April 3 | [New container vulnerability assessment recommendations](#new-container-vulnerability-assessment-recommendations) |
| April 3 | [Defender for open-source relational databases updates](#defender-for-open-source-relational-databases-updates) |
| April 2 | [Update to recommendations to align with Azure AI Services resources](#update-to-recommendations-to-align-with-azure-ai-services-resources) |
| April 2 | [Deprecation of Cognitive Services recommendation](#deprecation-of-cognitive-services-recommendation) |
| April 2 | [Containers multicloud recommendations (GA)](#containers-multicloud-recommendations-ga) |

### Defender for Containers is now generally available (GA) for AWS and GCP

April 15, 2024

Runtime threat detection and agentless discovery for AWS and GCP in Defender for Containers are now Generally Available (GA). For more information, see [Containers support matrix in Defender for Cloud](support-matrix-defender-for-containers.md).

In addition, there's a new authentication capability in AWS which simplifies provisioning. For more information, see [Configure Microsoft Defender for Containers components](/azure/defender-for-cloud/defender-for-containers-enable?branch=pr-en-us-269845&tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api&pivots=defender-for-container-eks#deploying-the-defender-sensor).

### Risk prioritization is now the default experience in Defender for Cloud

April 3, 2024

Risk prioritization is now the default experience in Defender for Cloud. This feature helps you to focus on the most critical security issues in your environment by prioritizing recommendations based on the risk factors of each resource. The risk factors include the potential impact of the security issue being breached, the categories of risk, and the attack path that the security issue is part of.

Learn more about [risk prioritization](risk-prioritization.md).

### New container vulnerability assessment recommendations

April 3, 2024

To support the new [risk-based prioritization](risk-prioritization.md) experience for recommendations, we've created new recommendations for container vulnerability assessments in Azure, AWS, and GCP. They report on container images for registry and container workloads for runtime:

- [Container images in Azure registry should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/33422d8f-ab1e-42be-bc9a-38685bb567b9)
- [Containers running in Azure should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e9acaf48-d2cf-45a3-a6e7-3caa2ef769e0)
- [Container images in AWS registry should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2a139383-ec7e-462a-90ac-b1b60e87d576)
- [Containers running in AWS should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d5d1e526-363a-4223-b860-f4b6e710859f)
- [Container images in GCP registry should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/24e37609-dcf5-4a3b-b2b0-b7d76f2e4e04)
- [Containers running in GCP should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c7c1d31d-a604-4b86-96df-63448618e165)

The previous container vulnerability assessment recommendations are on a retirement path and will be removed when the new recommendations are generally available.

- [Azure registry container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c0b7cfc6-3172-465a-b378-53c7ff2cc0d5)
- [Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5)
- [AWS registry container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/AwsContainerRegistryRecommendationDetailsBlade/assessmentKey/c27441ae-775c-45be-8ffa-655de37362ce)
- [AWS running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/AwsContainersRuntimeRecommendationDetailsBlade/assessmentKey/682b2595-d045-4cff-b5aa-46624eb2dd8f)
- [GCP registry container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/GcpContainerRegistryRecommendationDetailsBlade/assessmentKey/5cc3a2c1-8397-456f-8792-fe9d0d4c9145)
- [GCP running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/GcpContainersRuntimeRecommendationDetailsBlade/assessmentKey/e538731a-80c8-4317-a119-13075e002516)

> [!NOTE]
> The new recommendations are currently in public preview and will not be used for secure score calculation.

### Defender for open-source relational databases updates

April 3, 2024

**Defender for PostgreSQL Flexible Servers post-GA updates** - The update enables customers to enforce protection for existing PostgreSQL flexible servers at the subscription level, allowing complete flexibility to enable protection on a per-resource basis or for automatic protection of all resources at the subscription level.

**Defender for MySQL Flexible Servers Availability and GA** - Defender for Cloud expanded its support for Azure open-source relational databases by incorporating MySQL Flexible Servers.

This release includes:

- Alert compatibility with existing alerts for Defender for MySQL Single Servers.
- Enablement of individual resources.
- Enablement at the subscription level.

If you're already protecting your subscription with Defender for open-source relational databases, your flexible server resources are automatically enabled, protected, and billed.

Specific billing notifications have been sent via email for affected subscriptions.

Learn more about [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).

> [!NOTE]
> Updates for Azure Database for MySQL flexible servers are rolling out over the next few weeks. If you see the error message `The server <servername> is not compatible with Advanced Threat Protection`, you can either wait for the update to roll out, or open a support ticket to update the server sooner to a supported version.

### Update to recommendations to align with Azure AI Services resources

April 2, 2024

The following recommendations have been updated to align with the Azure AI Services category (formerly known as Cognitive Services and Cognitive search) to comply with the new Azure AI Services naming format and align with the relevant resources.

| Old recommendation | Updated recommendation |
| ---- | ---- |
| Cognitive Services accounts should restrict network access | [Azure AI Services resources should restrict network access](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/f738efb8-005f-680d-3d43-b3db762d6243) |
| Cognitive Services accounts should have local authentication methods disabled | [Azure AI Services resources should have key access disabled (disable local authentication)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/13b10b36-aa99-4db6-b00c-dcf87c4761e6) |
| Diagnostic logs in Search services should be enabled | [Diagnostic logs in Azure AI services resources should be enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/dea5192e-1bb3-101b-b70c-4646546f5e1e) |

See the [list of security recommendations](recommendations-reference.md).

### Deprecation of Cognitive Services recommendation

April 2, 2024

The recommendation [`Public network access should be disabled for Cognitive Services accounts`](https://ms.portal.azure.com/?feature.msaljs=true#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/684a5b6d-a270-61ce-306e-5cea400dc3a7) is deprecated. The related policy definition [`Cognitive Services accounts should disable public network access`](https://ms.portal.azure.com/?feature.msaljs=true#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0725b4dd-7e76-479c-a735-68e7ee23d5ca) has been removed from the regulatory compliance dashboard.

This recommendation is already being covered by another networking recommendation for Azure AI Services, [`Cognitive Services accounts should restrict network access`](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/f738efb8-005f-680d-3d43-b3db762d6243/showSecurityCenterCommandBar~/false).

See the [list of security recommendations](recommendations-reference.md).

### Containers multicloud recommendations (GA)

April 2, 2024

As part of Defender for Containers multicloud general availability, the following recommendations are announced GA as well:

- For Azure

| **Recommendation** | **Description** | **Assessment Key** |
| ------------------ | --------------- | ------------------ |
| Azure registry container images should have vulnerabilities resolved| Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. Resolving vulnerabilities can greatly improve your security posture, ensuring images are safe to use prior to deployment.  | c0b7cfc6-3172-465a-b378-53c7ff2cc0d5  |
| Azure running container images should have vulnerabilities resolved| Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. This recommendation provides visibility to vulnerable images currently running in your Kubernetes clusters. Remediating vulnerabilities in container images that are currently running is key to improving your security posture, significantly reducing the attack surface for your containerized workloads. | c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5 |

- For GCP

| **Recommendation** | **Description** | **Assessment Key** |
| ------------------ | --------------- | ------------------ |
| GCP registry container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) - Microsoft Azure  | Scans your GCP registries container images for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. Resolving vulnerabilities can greatly improve your security posture, ensuring images are safe to use prior to deployment.   | c27441ae-775c-45be-8ffa-655de37362ce  |
| GCP running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) - Microsoft Azure   | Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. This recommendation provides visibility to vulnerable images currently running in your Google Kubernetes clusters. Remediating vulnerabilities in container images that are currently running is key to improving your security posture, significantly reducing the attack surface for your containerized workloads.   | 5cc3a2c1-8397-456f-8792-fe9d0d4c9145   |

- For AWS

| **Recommendation** | **Description** | **Assessment Key** |
| ------------------ | --------------- | ------------------ |
| AWS registry container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) | Scans your GCP registries container images for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. Resolving vulnerabilities can greatly improve your security posture, ensuring images are safe to use prior to deployment. Scans your AWS registries container images for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. Resolving vulnerabilities can greatly improve your security posture, ensuring images are safe to use prior to deployment.  | c27441ae-775c-45be-8ffa-655de37362ce  |
| AWS running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) | Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. This recommendation provides visibility to vulnerable images currently running in your Elastic Kubernetes clusters. Remediating vulnerabilities in container images that are currently running is key to improving your security posture, significantly reducing the attack surface for your containerized workloads.   | 682b2595-d045-4cff-b5aa-46624eb2dd8f   |

The recommendations affect the secure score calculation.

## March 2024

|Date | Update |
|--|--|
| March 31 | [Windows container images scanning is now generally available (GA)](#windows-container-images-scanning-is-now-generally-available-ga) |
| March 25 | [Continuous export now includes attack path data](#continuous-export-now-includes-attack-path-data) |
| March 21 | [Agentless scanning supports CMK encrypted VMs in Azure (preview)](#agentless-scanning-supports-cmk-encrypted-vms-in-azure) |
| March 18 | [New endpoint detection and response recommendations](#new-endpoint-detection-and-response-recommendations) |
| March 17 | [Custom recommendations based on KQL for Azure is now public preview](#custom-recommendations-based-on-kql-for-azure-is-now-public-preview) |
| March 13 | [Inclusion of DevOps recommendations in the Microsoft cloud security benchmark](#inclusion-of-devops-recommendations-in-the-microsoft-cloud-security-benchmark) |
| March 13 | [ServiceNow integration is now generally available (GA)](#servicenow-integration-is-now-generally-available-ga) |
| March 13 | [Critical assets protection in Microsoft Defender for Cloud (Preview)](#critical-assets-protection-in-microsoft-defender-for-cloud-preview) |
| March 13 | [Enhanced AWS and GCP recommendations with automated remediation scripts](#enhanced-aws-and-gcp-recommendations-with-automated-remediation-scripts) |
| March 6 | [(Preview) Compliance standards added to compliance dashboard](#preview-compliance-standards-added-to-compliance-dashboard)  |
| March 5 | [Deprecation of two recommendations related to PCI](#deprecation-of-two-recommendations-related-to-pci) |
| March 3 | [Defender for Cloud Containers Vulnerability Assessment powered by Qualys retirement](#defender-for-cloud-containers-vulnerability-assessment-powered-by-qualys-retirement) |

### Windows container images scanning is now generally available (GA)

March 31, 2024

We're announcing the general availability (GA) of the Windows container images support for scanning by Defender for Containers.

### Continuous export now includes attack path data

March 25, 2024

We're announcing that continuous export now includes attack path data. This feature allows you to stream security data to Log Analytics in Azure Monitor, to Azure Event Hubs, or to another Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), or IT classic deployment model solution.

Learn more about [continuous export](benefits-of-continuous-export.md).

### Agentless scanning supports CMK encrypted VMs in Azure

March 21, 2024

Until now agentless scanning covered CMK encrypted VMs in AWS and GCP. With this release, we're completing support for Azure as well. The capability employs a unique scanning approach for CMK in Azure:

- Defender for Cloud doesn't handle the key or decryption process. Key handling and decryption are seamlessly handled by Azure Compute and is transparent to Defender for Cloud's agentless scanning service.
- The unencrypted VM disk data is never copied or re-encrypted with another key.
- The original key isn't replicated during the process. Purging it eradicates the data on both your production VM and Defender for Cloud’s temporary snapshot.

During public preview this capability isn't automatically enabled. If you're using Defender for Servers P2 or Defender CSPM and your environment has VMs with CMK encrypted disks, you can now have them scanned for vulnerabilities, secrets, and malware following these [enablement steps](enable-agentless-scanning-vms.md#agentless-vulnerability-assessment-on-azure).

- [Learn more on agentless scanning for VMs](concept-agentless-data-collection.md)
- [Learn more on agentless scanning permissions](faq-permissions.yml#which-permissions-are-used-by-agentless-scanning-)

### New endpoint detection and response recommendations

March 18, 2024

We're announcing new endpoint detection and response recommendations that discover and assesses the configuration of supported endpoint detection and response solutions. If issues are found, these recommendations offer remediation steps.

The following new agentless endpoint protection recommendations are now available if you have Defender for Servers Plan 2 or the Defender CSPM plan enabled on your subscription with the agentless machine scanning feature enabled. The recommendations support Azure and multicloud machines. On-premises machines aren't supported.

| Recommendation name | Description | Severity |
|--|
| [EDR solution should be installed on Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/) | To protect virtual machines, install an Endpoint Detection and Response (EDR) solution. EDRs help prevent, detect, investigate, and respond to advanced threats. Use Microsoft Defender for Servers to deploy Microsoft Defender for Endpoint. If resource is classified as "Unhealthy", it doesn't have a supported EDR solution installed [Place Holder link - Learn more]. If you have an EDR solution installed which isn't discoverable by this recommendation, you can exempt it. | High |
| [EDR solution should be installed on EC2s](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/77d09952-2bc2-4495-8795-cc8391452f85) | To protect EC2s, install an Endpoint Detection and Response (EDR) solution. EDRs help prevent, detect, investigate, and respond to advanced threats. Use Microsoft Defender for Servers to deploy Microsoft Defender for Endpoint. If resource is classified as "Unhealthy", it doesn't have a supported EDR solution installed [Place Holder link - Learn more]. If you have an EDR solution installed which isn't discoverable by this recommendation, you can exempt it. | High |
| [EDR solution should be installed on GCP Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/68e595c1-a031-4354-b37c-4bdf679732f1) | To protect virtual machines, install an Endpoint Detection and Response (EDR) solution. EDRs help prevent, detect, investigate, and respond to advanced threats. Use Microsoft Defender for Servers to deploy Microsoft Defender for Endpoint. If resource is classified as "Unhealthy", it doesn't have a supported EDR solution installed [Place Holder link - Learn more]. If you have an EDR solution installed which isn't discoverable by this recommendation, you can exempt it. | High |
| [EDR configuration issues should be resolved on virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dc5357d0-3858-4d17-a1a3-072840bff5be) | To protect virtual machines from the latest threats and vulnerabilities, resolve all identified configuration issues with the installed Endpoint Detection and Response (EDR) solution. <br> Note: Currently, this recommendation only applies to resources with Microsoft Defender for Endpoint (MDE) enabled. | High |
| [EDR configuration issues should be resolved on EC2s](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/695abd03-82bd-4d7f-a94c-140e8a17666c) | To protect virtual machines from the latest threats and vulnerabilities, resolve all identified configuration issues with the installed Endpoint Detection and Response (EDR) solution. <br> Note: Currently, this recommendation only applies to resources with Microsoft Defender for Endpoint (MDE) enabled. | High |
| [EDR configuration issues should be resolved on GCP virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f36a15fb-61a6-428c-b719-6319538ecfbc) | To protect virtual machines from the latest threats and vulnerabilities, resolve all identified configuration issues with the installed Endpoint Detection and Response (EDR) solution. <br> Note: Currently, this recommendation only applies to resources with Microsoft Defender for Endpoint (MDE) enabled. | High |

Learn how to manage these new [endpoint detection and response recommendations (agentless)](endpoint-detection-response.md)

These public preview recommendations will be deprecated at the end March.

| Recommendation | Agent |
|--|--|
| [Endpoint protection should be installed on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) (public) | MMA/AMA |
| [Endpoint protection health issues should be resolved on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000) (public)| MMA/AMA |

The current generally available recommendations are still supported and will be until August 2024.

Learn how to [prepare for the new endpoint detection recommendation experience](prepare-deprecation-log-analytics-mma-agent.md#endpoint-protection-recommendations-experience---changes-and-migration-guidance).

### Custom recommendations based on KQL for Azure is now public preview

March 17, 2024

Custom recommendations based on KQL for Azure is now public preview, and supported for all clouds. For more information, see [Create custom security standards and recommendations](create-custom-recommendations.md).

### Inclusion of DevOps recommendations in the Microsoft cloud security benchmark

March 13, 2024

Today, we are announcing that you can now monitor your DevOps security and compliance posture in the [Microsoft cloud security benchmark](concept-regulatory-compliance.md) (MCSB) in addition to Azure, AWS, and GCP. DevOps assessments are part of the DevOps Security control in the MCSB.

The MCSB is a framework that defines fundamental cloud security principles based on common industry standards and compliance frameworks. MCSB provides prescriptive details for how to implement its cloud-agnostic security recommendations.

Learn more about the [DevOps recommendations](recommendations-reference-devops.md) that will be included and the [Microsoft cloud security benchmark](concept-regulatory-compliance.md).

### ServiceNow integration is now generally available (GA)

March 12, 2024

We're announcing the general availability (GA) of the [ServiceNow integration](integration-servicenow.md).

### Critical assets protection in Microsoft Defender for Cloud (Preview)

March 12, 2024

Defender for Cloud now includes a business criticality feature, using Microsoft Security Exposure Management’s critical assets engine, to identify and protect important assets through risk prioritization, attack path analysis, and cloud security explorer. For more information, see [Critical assets protection in Microsoft Defender for Cloud (Preview)](critical-assets-protection.md).

### Enhanced AWS and GCP recommendations with automated remediation scripts

March 12, 2024

We're enhancing the AWS and GCP recommendations with automated remediation scripts that allow you to remediate them programmatically and at scale.
Learn more about [automated remediation scripts](implement-security-recommendations.md#use-the-automated-remediation-scripts).

### (Preview) Compliance standards added to compliance dashboard

March 6, 2024

Based on customer feedback, we've added compliance standards in preview to Defender for Cloud.

Check out the [full list of supported compliance standards](concept-regulatory-compliance-standards.md#available-compliance-standards)

We are continuously working on adding and updating new standards for Azure, AWS, and GCP environments.

Learn how to [assign a security standard](update-regulatory-compliance-packages.yml).

### Deprecation of two recommendations related to PCI

March 5, 2024

The following two recommendations related to Permission Creep Index (PCI) are being deprecated:

- Over-provisioned identities in accounts should be investigated to reduce the Permission Creep Index (PCI)
- Over-provisioned identities in subscriptions should be investigated to reduce the Permission Creep Index (PCI)

See the [list of deprecated security recommendations](recommendations-reference.md#deprecated-recommendations).

### Defender for Cloud Containers Vulnerability Assessment powered by Qualys retirement

March 3, 2024

The Defender for Cloud Containers Vulnerability Assessment powered by Qualys is being retired. The retirement will be completed by March 6, and until that time partial results may still appear both in the Qualys recommendations, and Qualys results in the security graph. Any customers who were previously using this assessment should upgrade to [Vulnerability assessments for Azure with Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-azure.md). For information about transitioning to the container vulnerability assessment offering powered by Microsoft Defender Vulnerability Management, see [Transition from Qualys to Microsoft Defender Vulnerability Management](transition-to-defender-vulnerability-management.md).

## February 2024

|Date | Update |
|----------|----------|
| February 28 | [Microsoft Security Code Analysis (MSCA) is no longer operational](#microsoft-security-code-analysis-msca-is-no-longer-operational) |
| February 28 | [Updated security policy management expands support to AWS and GCP](#updated-security-policy-management-expands-support-to-aws-and-gcp) |
| February 26 | [Cloud support for Defender for Containers](#cloud-support-for-defender-for-containers) |
| February 20 | [New version of Defender sensor for Defender for Containers](#new-version-of-defender-sensor-for-defender-for-containers) |
| February 18| [Open Container Initiative (OCI) image format specification support](#open-container-initiative-oci-image-format-specification-support) |
| February 13 | [AWS container vulnerability assessment powered by Trivy retired](#aws-container-vulnerability-assessment-powered-by-trivy-retired) |
| February 8 | [Recommendations released for preview: four recommendations for Azure Stack HCI resource type](#recommendations-released-for-preview-four-recommendations-for-azure-stack-hci-resource-type) |

### Microsoft Security Code Analysis (MSCA) is no longer operational

February 28, 2024

MSCA is no longer operational.

Customers can get the latest DevOps security tooling from Defender for Cloud through [Microsoft Security DevOps](azure-devops-extension.yml) and more security tooling through [GitHub Advanced Security for Azure DevOps](https://azure.microsoft.com/products/devops/github-advanced-security).

### Updated security policy management expands support to AWS and GCP

February 28, 2024

The updated experience for managing security policies, initially released in Preview for Azure, is expanding its support to cross cloud (AWS and GCP) environments. This Preview release includes:

- Managing [regulatory compliance standards](update-regulatory-compliance-packages.yml) in Defender for Cloud across Azure, AWS, and GCP environments.
- Same cross cloud interface experience for creating and managing [Microsoft Cloud Security Benchmark(MCSB) custom recommendations](manage-mcsb.md).
- The updated experience is applied to AWS and GCP for [creating custom recommendations with a KQL query](create-custom-recommendations.md).

### Cloud support for Defender for Containers

February 26, 2024

Azure Kubernetes Service (AKS) threat detection features in Defender for Containers are now fully supported in commercial, Azure Government, and Azure China 21Vianet clouds. [Review](support-matrix-defender-for-containers.md#azure) supported features.

### New version of Defender sensor for Defender for Containers

February 20, 2024

[A new version](../aks/supported-kubernetes-versions.md#aks-kubernetes-release-calendar) of the [Defender sensor for Defender for Containers](tutorial-enable-containers-azure.md#deploy-the-defender-sensor-in-azure) is available. It includes performance and security improvements, support for both AMD64 and ARM64 arch nodes (Linux only), and uses [Inspektor Gadget](https://www.inspektor-gadget.io/) as the process collection agent instead of Sysdig. The new version is only supported on Linux kernel versions 5.4 and higher, so if you have older versions of the Linux kernel, you need to upgrade. Support for ARM 64 is only available from AKS V1.29 and above. For more information, see [Supported host operating systems](support-matrix-defender-for-containers.md#supported-host-operating-systems).

### Open Container Initiative (OCI) image format specification support

February 18, 2024

The [Open Container Initiative (OCI)](https://github.com/opencontainers/image-spec/blob/main/spec.md) image format specification is now supported by vulnerability assessment, powered by Microsoft Defender Vulnerability Management for AWS, Azure & GCP clouds.

### AWS container vulnerability assessment powered by Trivy retired

February 13, 2024

The container vulnerability assessment powered by Trivy has been retired. Any customers who were previously using this assessment should upgrade to the new [AWS container vulnerability assessment powered by Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-aws.md). For instructions on how to upgrade, see [How do I upgrade from the retired Trivy vulnerability assessment to the AWS vulnerability assessment powered by Microsoft Defender Vulnerability Management?](faq-defender-for-containers.yml#how-do-i-upgrade-from-the-retired-trivy-vulnerability-assessment-to-the-aws-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-)

### Recommendations released for preview: four recommendations for Azure Stack HCI resource type

February 8, 2024

We have added four new recommendations for Azure Stack HCI as a new resource type that can be managed through Microsoft Defender for Cloud. These new recommendations are currently in public preview.

| Recommendation | Description  | Severity |
|----------|----------|----------|
| [(Preview) Azure Stack HCI servers should meet Secured-core requirements](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f56c47221-b8b7-446e-9ab7-c7c9dc07f0ad)| Ensure that all Azure Stack HCI servers meet the Secured-core requirements. (Related policy: [Guest Configuration extension should be installed on machines - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6c99f570-2ce7-46bc-8175-cde013df43bc)) | Low |
| [(Preview) Azure Stack HCI servers should have consistently enforced application control policies](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7384fde3-11b0-4047-acbd-b3cf3cc8ce07) | At a minimum, apply the Microsoft WDAC base policy in enforced mode on all Azure Stack HCI servers. Applied Windows Defender Application Control (WDAC) policies must be consistent across servers in the same cluster. (Related policy: [Guest Configuration extension should be installed on machines - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6c99f570-2ce7-46bc-8175-cde013df43bc)) | High |
| [(Preview) Azure Stack HCI systems should have encrypted volumes](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fae95f12a-b6fd-42e0-805c-6b94b86c9830) | Use BitLocker to encrypt the OS and data volumes on Azure Stack HCI systems. (Related policy: [Guest Configuration extension should be installed on machines - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6c99f570-2ce7-46bc-8175-cde013df43bc)) | High |
| [(Preview) Host and VM networking should be protected on Azure Stack HCI systems](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2faee306e7-80b0-46f3-814c-d3d3083ed034) | Protect data on the Azure Stack HCI host’s network and on virtual machine network connections. (Related policy: [Guest Configuration extension should be installed on machines - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6c99f570-2ce7-46bc-8175-cde013df43bc)) | Low |

See the [list of security recommendations](recommendations-reference.md).

## January 2024

|Date | Update |
|----------|----------|
| January 31 | [New insight for active repositories in Cloud Security Explorer](#new-insight-for-active-repositories-in-cloud-security-explorer) |
| January 25 | [Deprecation of security alerts and update of security alerts to informational severity level](#deprecation-of-security-alerts-and-update-of-security-alerts-to-informational-severity-level) |
| January 24 | [Agentless container posture for GCP in Defender for Containers and Defender CSPM (Preview)](#agentless-container-posture-for-gcp-in-defender-for-containers-and-defender-cspm-preview) |
| January 16 | [Public preview of agentless malware scanning for servers](#public-preview-of-agentless-malware-scanning-for-servers)|
| January 15 | [General availability of Defender for Cloud's integration with Microsoft Defender XDR](#general-availability-of-defender-for-clouds-integration-with-microsoft-defender-xdr) |
| January 12 | [DevOps security Pull Request annotations are now enabled by default for Azure DevOps connectors](#devops-security-pull-request-annotations-are-now-enabled-by-default-for-azure-devops-connectors) |
| January 4 | [Recommendations released for preview: Nine new Azure security recommendations](#recommendations-released-for-preview-nine-new-azure-security-recommendations) |

### New insight for active repositories in Cloud Security Explorer

January 31, 2024

A new insight for Azure DevOps repositories has been added to the Cloud Security Explorer to indicate whether repositories are active. This insight indicates that the code repository is not archived or disabled, meaning that write access to code, builds, and pull requests is still available for users. Archived and disabled repositories might be considered lower priority as the code isn't typically used in active deployments.

To test out the query through Cloud Security Explorer, use [this query link](https://ms.portal.azure.com#view/Microsoft_Azure_Security/SecurityGraph.ReactView/query/%7B%22type%22%3A%22securitygraphquery%22%2C%22version%22%3A2%2C%22properties%22%3A%7B%22source%22%3A%7B%22type%22%3A%22datasource%22%2C%22properties%22%3A%7B%22sources%22%3A%5B%7B%22type%22%3A%22entity%22%2C%22properties%22%3A%7B%22source%22%3A%22azuredevopsrepository%22%7D%7D%5D%2C%22conditions%22%3A%7B%22type%22%3A%22conditiongroup%22%2C%22properties%22%3A%7B%22operator%22%3A%22and%22%2C%22conditions%22%3A%5B%7B%22type%22%3A%22insights%22%2C%22properties%22%3A%7B%22name%22%3A%226b8f221b-c0ce-48e3-9fbb-16f917b1c095%22%7D%7D%5D%7D%7D%7D%7D%7D%7D).

### Deprecation of security alerts and update of security alerts to informational severity level

January 25, 2024

This announcement includes container security alerts that are deprecated, and security alerts whose severity level is updated to **Informational**.

- The following container security alerts are deprecated:

  - `Anomalous pod deployment (Preview) (K8S_AnomalousPodDeployment)`
  - `Excessive role permissions assigned in Kubernetes cluster (Preview) (K8S_ServiceAcountPermissionAnomaly)`
  - `Anomalous access to Kubernetes secret (Preview) (K8S_AnomalousSecretAccess)`

The following security alerts are updated to the **informational** severity level:

- **Alerts for Windows machines**:
  
  - `Adaptive application control policy violation was audited (VM_AdaptiveApplicationControlWindowsViolationAudited)`
  - `Adaptive application control policy violation was audited (VM_AdaptiveApplicationControlLinuxViolationAudited)`
  
- **Alerts for containers**:
  
  - `Attempt to create a new Linux namespace from a container detected (K8S.NODE_NamespaceCreation)`
  - `Attempt to stop apt-daily-upgrade.timer service detected (K8S.NODE_TimerServiceDisabled)`
  - `Command within a container running with high privileges (K8S.NODE_PrivilegedExecutionInContainer)`
  - `Container running in privileged mode (K8S.NODE_PrivilegedContainerArtifacts)`
  - `Container with a sensitive volume mount detected (K8S_SensitiveMount)`
  - `Creation of admission webhook configuration detected (K8S_AdmissionController)`
  - `Detected suspicious file download (K8S.NODE_SuspectDownloadArtifacts)`
  - `Docker build operation detected on a Kubernetes node (K8S.NODE_ImageBuildOnNode)`
  - `New container in the kube-system namespace detected (K8S_KubeSystemContainer)`
  - `New high privileges role detected (K8S_HighPrivilegesRole)`
  - `Privileged container detected (K8S_PrivilegedContainer)`
  - `Process seen accessing the SSH authorized keys file in an unusual way (K8S.NODE_SshKeyAccess)`
  - `Role binding to the cluster-admin role detected (K8S_ClusterAdminBinding)`
  - `SSH server is running inside a container (K8S.NODE_ContainerSSH)`
  
- **Alerts for DNS**:

  - `Communication with suspicious algorithmically generated domain (AzureDNS_DomainGenerationAlgorithm)`
  - `Communication with suspicious algorithmically generated domain (DNS_DomainGenerationAlgorithm)`
  - `Communication with suspicious random domain name (Preview) (DNS_RandomizedDomain)`
  - `Communication with suspicious random domain name (AzureDNS_RandomizedDomain)`
  - `Communication with possible phishing domain (AzureDNS_PhishingDomain)`
  - `Communication with possible phishing domain (Preview) (DNS_PhishingDomain)`
  
- **Alerts for Azure App Service**:

  - `NMap scanning detected (AppServices_Nmap)`
  - `Suspicious User Agent detected (AppServices_UserAgentInjection)`
  
- **Alerts for Azure network layer**:
  
  - `Possible incoming SMTP brute force attempts detected (Generic_Incoming_BF_OneToOne)`
  - `Traffic detected from IP addresses recommended for blocking (Network_TrafficFromUnrecommendedIP)`

- **Alerts for Azure Resource Manager**:

  - `Privileged custom role created for your subscription in a suspicious way (Preview)(ARM_PrivilegedRoleDefinitionCreation)`
  
See the full [list of security alerts](alerts-reference.md).

### Agentless container posture for GCP in Defender for Containers and Defender CSPM (Preview)

January 24, 2024

The new Agentless container posture (Preview) capabilities are available for GCP, including [Vulnerability assessments for GCP with Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-gcp.md). For more information about all the capabilities, see [Agentless container posture in Defender CSPM](concept-agentless-containers.md) and [Agentless capabilities in Defender for Containers](defender-for-containers-introduction.md#agentless-capabilities).

You can also read about Agentless container posture management for multicloud in [this blog post](https://aka.ms/agentless-container-posture-management-multicloud).

### Public preview of agentless malware scanning for servers

January 16, 2024

We're announcing the release of Defender for Cloud's agentless malware detection for Azure virtual machines (VM), AWS EC2 instances and GCP VM instances, as a new feature included in [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features).

Agentless malware detection for VMs is now included in our agentless scanning platform. Agentless malware scanning utilizes [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/microsoft-defender-antivirus-windows) anti-malware engine to scan and detect malicious files. Any detected threats, trigger security alerts directly into Defender for Cloud and Defender XDR, where they can be investigated and remediated. The Agentless malware scanner complements the agent-based coverage with a second layer of threat detection with frictionless onboarding and has no effect on your machine's performance.

Learn more about [agentless malware scanning](agentless-malware-scanning.md) for servers and [agentless scanning for VMs](concept-agentless-data-collection.md).

### General availability of Defender for Cloud's integration with Microsoft Defender XDR

January 15, 2024

We're announcing the general availability (GA) of the integration between Defender for Cloud and Microsoft Defender XDR (formerly Microsoft 365 Defender).

The integration brings competitive cloud protection capabilities into the Security Operations Center (SOC) day-to-day. With Microsoft Defender for Cloud and the Defender XDR integration, SOC teams can discover attacks that combine detections from multiple pillars, including Cloud, Endpoint, Identity, Office 365, and more.

Learn more about [alerts and incidents in Microsoft Defender XDR](concept-integration-365.md).

### DevOps security Pull Request annotations are now enabled by default for Azure DevOps connectors

January 12, 2024

DevOps security exposes security findings as annotations in Pull Requests (PR) to help developers prevent and fix potential security vulnerabilities and misconfigurations before they enter production. As of January 12, 2024, PR annotations are now enabled by default for all new and existing Azure DevOps repositories that are connected to Defender for Cloud.

By default, PR annotations are enabled only for High severity Infrastructure as Code (IaC) findings. Customers will still need to configure Microsoft Security for DevOps (MSDO) to run in PR builds and enable the Build Validation policy for CI builds in Azure DevOps repository settings. Customers can disable the PR Annotation feature for specific repositories from within the DevOps security blade repository configuration options.

Learn more about [enabling Pull Request annotations for Azure DevOps](enable-pull-request-annotations.md#enable-pull-request-annotations-in-azure-devops).

### Recommendations released for preview: Nine new Azure security recommendations

January 4, 2024

We have added nine new Azure security recommendations aligned with the Microsoft Cloud Security Benchmark. These new recommendations are currently in public preview.

|Recommendation | Description  | Severity |
|----------|----------|----------|
| [Cognitive Services accounts should have local authentication methods disabled](recommendations-reference.md#identity-and-access-recommendations) | Disabling local authentication methods improves security by ensuring that Cognitive Services accounts require Azure Active Directory identities exclusively for authentication. Learn more at: <https://aka.ms/cs/auth>. (Related policy: [Cognitive Services accounts should have local authentication methods disabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f71ef260a-8f18-47b7-abcb-62d0673d94dc)). | Low |
| [Cognitive Services should use private link](recommendations-reference.md#data-recommendations) | Azure Private Link lets you connect your virtual networks to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to Cognitive Services, you'll reduce the potential for data leakage. Learn more about [private links](https://go.microsoft.com/fwlink/?linkid=2129800). (Related policy: [Cognitive Services should use private link](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcddd188c-4b82-4c48-a19d-ddf74ee66a01)). | Medium |
| [Virtual machines and virtual machine scale sets should have encryption at host enabled](recommendations-reference.md#compute-recommendations) | Use encryption at host to get end-to-end encryption for your virtual machine and virtual machine scale set data. Encryption at host enables encryption at rest for your temporary disk and OS/data disk caches. Temporary and ephemeral OS disks are encrypted with platform-managed keys when encryption at host is enabled. OS/data disk caches are encrypted at rest with either customer-managed or platform-managed key, depending on the encryption type selected on the disk. Learn more at <https://aka.ms/vm-hbe>. (Related policy: [Virtual machines and virtual machine scale sets should have encryption at host enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ffc4d8e41-e223-45ea-9bf5-eada37891d87)). | Medium |
| [Azure Cosmos DB should disable public network access](recommendations-reference.md#data-recommendations) | Disabling public network access improves security by ensuring that your Cosmos DB account isn't exposed on the public internet. Creating private endpoints can limit exposure of your Cosmos DB account. [Learn more](../cosmos-db/how-to-configure-private-endpoints.md#blocking-public-network-access-during-account-creation). (Related policy: [Azure Cosmos DB should disable public network access](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f797b37f7-06b8-444c-b1ad-fc62867f335a)). | Medium |
| [Cosmos DB accounts should use private link](recommendations-reference.md#data-recommendations) | Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your Cosmos DB account, data leakage risks are reduced. Learn more about [private links](../cosmos-db/how-to-configure-private-endpoints.md). (Related policy: [Cosmos DB accounts should use private link](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f58440f8a-10c5-4151-bdce-dfbaad4a20b7)). | Medium |
| [VPN gateways should use only Azure Active Directory (Azure AD) authentication for point-to-site users](recommendations-reference.md#identity-and-access-recommendations) | Disabling local authentication methods improves security by ensuring that VPN Gateways use only Azure Active Directory identities for authentication. Learn more about [Azure AD authentication](../vpn-gateway/openvpn-azure-ad-tenant.md). (Related policy: [VPN gateways should use only Azure Active Directory (Azure AD) authentication for point-to-site users](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f21a6bc25-125e-4d13-b82d-2e19b7208ab7)). | Medium |
| [Azure SQL Database should be running TLS version 1.2 or newer](recommendations-reference.md#data-recommendations) | Setting TLS version to 1.2 or newer improves security by ensuring your Azure SQL Database can only be accessed from clients using TLS 1.2 or newer. Using versions of TLS less than 1.2 is not recommended since they have well documented security vulnerabilities. (Related policy: [Azure SQL Database should be running TLS version 1.2 or newer](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f32e6bbec-16b6-44c2-be37-c5b672d103cf)). | Medium |
| [Azure SQL Managed Instances should disable public network access](recommendations-reference.md#data-recommendations) | Disabling public network access (public endpoint) on Azure SQL Managed Instances improves security by ensuring that they can only be accessed from inside their virtual networks or via Private Endpoints. Learn more about [public network access](https://aka.ms/mi-public-endpoint). (Related policy: [Azure SQL Managed Instances should disable public network access](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f9dfea752-dd46-4766-aed1-c355fa93fb91)). | Medium |
| [Storage accounts should prevent shared key access](recommendations-reference.md#data-recommendations) | Audit requirement of Azure Active Directory (Azure AD) to authorize requests for your storage account. By default, requests can be authorized with either Azure Active Directory credentials, or by using the account access key for Shared Key authorization. Of these two types of authorization, Azure AD provides superior security and ease of use over shared Key, and is recommended by Microsoft. (Related policy: [Storage accounts should prevent shared key access](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f8c6a50c6-9ffd-4ae7-986f-5fa6111f9a54)). |Medium |

See the [list of security recommendations](recommendations-reference.md).

## December 2023

| Date | Update |
|--|--|
| December 30 | [Consolidation of Defender for Cloud's Service Level 2 names](#consolidation-of-defender-for-clouds-service-level-2-names) |
| December 24 | [Defender for Servers at the resource level available as GA](#defender-for-servers-at-the-resource-level-available-as-ga) |
| December 21 | [Retirement of Classic connectors for multicloud](#retirement-of-classic-connectors-for-multicloud) |
| December 21 | [Release of the Coverage workbook](#release-of-the-coverage-workbook) |
| December 14 | [General availability of Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management in Azure Government and Azure operated by 21Vianet](#general-availability-of-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-in-azure-government-and-azure-operated-by-21vianet) |
| December 14 | [Public preview of Windows support for Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management](#public-preview-of-windows-support-for-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management) |
| December 13 | [Retirement of AWS container vulnerability assessment powered by Trivy](#retirement-of-aws-container-vulnerability-assessment-powered-by-trivy) |
| December 13 | [Agentless container posture for AWS in Defender for Containers and Defender CSPM (Preview)](#agentless-container-posture-for-aws-in-defender-for-containers-and-defender-cspm-preview) |
| December 13 | [General availability (GA) support for PostgreSQL Flexible Server in Defender for open-source relational databases plan](#general-availability-support-for-postgresql-flexible-server-in-defender-for-open-source-relational-databases-plan) |
| December 12 | [Container vulnerability assessment powered by Microsoft Defender Vulnerability Management now supports Google Distroless](#container-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-now-supports-google-distroless) |
| December 4 | [Defender for Storage alert released for preview: malicious blob was downloaded from a storage account](#defender-for-storage-alert-released-for-preview-malicious-blob-was-downloaded-from-a-storage-account) |

### Consolidation of Defender for Cloud's Service Level 2 names

December 30, 2023

We're consolidating the legacy Service Level 2 names for all Defender for Cloud plans into a single new Service Level 2 name, **Microsoft Defender for Cloud**.

Today, there are four Service Level 2 names: Azure Defender, Advanced Threat Protection, Advanced Data Security, and Security Center. The various meters for Microsoft Defender for Cloud are grouped across these separate Service Level 2 names, creating complexities when using Cost Management + Billing, invoicing, and other Azure billing-related tools.

The change simplifies the process of reviewing Defender for Cloud charges and provides better clarity in cost analysis.

To ensure a smooth transition, we've taken measures to maintain the consistency of the Product/Service name, SKU, and Meter IDs. Impacted customers will receive an informational Azure Service Notification to communicate the changes.

Organizations that retrieve cost data by calling our APIs, will need to update the values in their calls to accommodate the change. For example, in this filter function, the values will return no information:

```json
"filter": {
          "dimensions": {
              "name": "MeterCategory",
              "operator": "In",
              "values": [
                  "Advanced Threat Protection",
                  "Advanced Data Security",
                  "Azure Defender",
                  "Security Center"
                ]
          }
      }
```

| OLD Service Level 2 name | NEW Service Level 2 name | Service Tier - Service Level 4 (No change) |
|--|--|--|
|Advanced Data Security    |Microsoft Defender for Cloud|Defender for SQL|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for Container Registries |
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for DNS |
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for Key Vault|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for Kubernetes|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for MySQL|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for PostgreSQL|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for Resource Manager|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for Storage|
|Azure Defender            |Microsoft Defender for Cloud|Defender for External Attack Surface Management|
|Azure Defender            |Microsoft Defender for Cloud|Defender for Azure Cosmos DB|
|Azure Defender            |Microsoft Defender for Cloud|Defender for Containers|
|Azure Defender            |Microsoft Defender for Cloud|Defender for MariaDB|
|Security Center           |Microsoft Defender for Cloud|Defender for App Service|
|Security Center           |Microsoft Defender for Cloud|Defender for Servers|
|Security Center           |Microsoft Defender for Cloud|Defender CSPM |

### Defender for Servers at the resource level available as GA

December 24, 2023

It's now possible to manage Defender for Servers on specific resources within your subscription, giving you full control over your protection strategy. With this capability, you can configure specific resources with custom configurations that differ from the settings configured at the subscription level.

Learn more about [enabling Defender for Servers at the resource level](tutorial-enable-servers-plan.md#enable-defender-for-servers-at-the-resource-level).

### Retirement of Classic connectors for multicloud

December 21, 2023

The classic multicloud connector experience is retired and data is no longer streamed to connectors created through that mechanism. These classic connectors were used to connect AWS Security Hub and GCP Security Command Center recommendations to Defender for Cloud and onboard AWS EC2s to Defender for Servers.

The full value of these connectors has been replaced with the native multicloud security connectors experience, which has been Generally Available for AWS and GCP since March 2022 at no extra cost.

The new native connectors are included in your plan and offer an automated onboarding experience with options to onboard single accounts, multiple accounts (with Terraform), and organizational onboarding with auto provisioning for the following Defender plans: free foundational CSPM capabilities, Defender Cloud Security Posture Management (CSPM), Defender for Servers, Defender for SQL, and Defender for Containers.

### Release of the Coverage workbook

December 21, 2023

The Coverage workbook allows you to keep track of which Defender for Cloud plans are active on which parts of your environments. This workbook can help you to ensure that your environments and subscriptions are fully protected. By having access to detailed coverage information, you can also identify any areas that might need other protection and take action to address those areas.

Learn more about the [Coverage workbook](custom-dashboards-azure-workbooks.md#use-the-coverage-workbook).

### General availability of Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management in Azure Government and Azure operated by 21Vianet

December 14, 2023

Vulnerability assessment (VA) for Linux container images in Azure container registries powered by Microsoft Defender Vulnerability Management is released for General Availability (GA) in Azure Government and Azure operated by 21Vianet. This new release is available under the Defender for Containers and Defender for Container Registries plans.

As part of this change, the following recommendations are released for GA, and are included in secure score calculation:

| Recommendation name                                          | Description                                                  | Assessment key                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------ |
| Azure registry container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management) | Container image vulnerability assessments scan your registry for commonly known vulnerabilities (CVEs) and provide a detailed vulnerability report for each image. Resolving vulnerabilities can greatly improve your security posture, ensuring images are safe to use prior to deployment. | c0b7cfc6-3172-465a-b378-53c7ff2cc0d5 |
| Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) | Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management). <br /><br />Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. This recommendation provides visibility to vulnerable images currently running in your Kubernetes clusters. Remediating vulnerabilities in container images that are currently running is key to improving your security posture, significantly reducing the attack surface for your containerized workloads. | c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5 |

Container image scan powered by Microsoft Defender Vulnerability Management now also incurs charges according to [plan pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing).

> [!NOTE]
> Images scanned both by our container VA offering powered by Qualys and Container VA offering powered by Microsoft Defender Vulnerability Management will only be billed once.

The following Qualys recommendations for Containers Vulnerability Assessment are renamed and continue to be available for customers who enabled Defender for Containers on any of their subscriptions prior to this release. New customers onboarding Defender for Containers after this release will only see the new Container vulnerability assessment recommendations powered by Microsoft Defender Vulnerability Management.

| Current recommendation name                                  | New recommendation name                                      | Description                                                  | Assessment key                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------ |
| Container registry images should have vulnerability findings resolved (powered by Qualys) | Azure registry container images should have vulnerabilities resolved (powered by Qualys) | Container image vulnerability assessment scans your registry for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. | dbd0cb49-b563-45e7-9724-889e799fa648 |
| Running container images should have vulnerability findings resolved (powered by Qualys) | Azure running container images should have vulnerabilities resolved - (powered by Qualys) | Container image vulnerability assessment scans container images running on your Kubernetes clusters for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. | 41503391-efa5-47ee-9282-4eff6131462c  |

### Public preview of Windows support for Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management

December 14, 2023

Support for Windows images was released in public preview as part of Vulnerability assessment (VA) powered by Microsoft Defender Vulnerability Management for Azure container registries and Azure Kubernetes Services.

### Retirement of AWS container vulnerability assessment powered by Trivy

December 13, 2023

The container vulnerability assessment powered by Trivy is now on a retirement path to be completed by February 13. This capability is now deprecated and will continue to be available to existing customers using this capability until February 13. We encourage customers using this capability to upgrade to the new [AWS container vulnerability assessment powered by Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-aws.md) by February 13.

### Agentless container posture for AWS in Defender for Containers and Defender CSPM (Preview)

December 13, 2023

The new Agentless container posture (Preview) capabilities are available for AWS. For more information, see [Agentless container posture in Defender CSPM](concept-agentless-containers.md) and [Agentless capabilities in Defender for Containers](defender-for-containers-introduction.md#agentless-capabilities).

### General availability support for PostgreSQL Flexible Server in Defender for open-source relational databases plan

December 13, 2023

We're announcing the general availability (GA) release of PostgreSQL Flexible Server support in the [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md) plan. Microsoft Defender for open-source relational databases provides advanced threat protection to PostgreSQL Flexible Servers, by detecting anomalous activities and generating [security alerts](defender-for-databases-usage.md).

Learn how to [Enable Microsoft Defender for open-source relational databases](defender-for-databases-usage.md).

### Container vulnerability assessment powered by Microsoft Defender Vulnerability Management now supports Google Distroless

December 12, 2023

Container vulnerability assessments powered by Microsoft Defender Vulnerability Management have been extended with additional coverage for Linux OS packages, now supporting Google Distroless.

For a list of all supported operating systems, see [Registries and images support for Azure - Vulnerability assessment powered by Microsoft Defender Vulnerability Management](support-matrix-defender-for-containers.md#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management).

### Defender for Storage alert released for preview: malicious blob was downloaded from a storage account

December 4, 2023

The following alert is being released for preview:

|Alert (alert type)|Description|MITRE tactics|Severity|
|----|----|----|----|
| **Malicious blob was downloaded from a storage account (Preview)**<br>Storage.Blob_MalwareDownload | The alert indicates that a malicious blob was downloaded from a storage account. Potential causes may include malware that was uploaded to the storage account and not removed or quarantined, thereby enabling a threat actor to download it, or an unintentional download of the malware by legitimate users or applications. <br>Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2 or premium block blobs) storage accounts with the new Defender for Storage plan with the Malware Scanning feature enabled. | Lateral Movement | High, if Eicar - low |

See the [extension-based alerts in Defender for Storage](alerts-reference.md#alerts-for-azure-storage).

For a complete list of alerts, see the [reference table for all security alerts in Microsoft Defender for Cloud](alerts-reference.md).

## Next steps

For past changes to Defender for Cloud, see [Archive for what's new in Defender for Cloud?](release-notes-archive.md).
