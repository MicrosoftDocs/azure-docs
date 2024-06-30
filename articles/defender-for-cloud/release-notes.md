---
title: Release notes for Microsoft Defender for Cloud
description: What's new and updated in Microsoft Defender for Cloud
ms.topic: overview
<<<<<<< HEAD
ms.date: 03/24/2024
=======
ms.date: 06/10/2024
>>>>>>> 256b73bc103f6acb7e25794072fd71a81c58cdde
---

# Release notes - Microsoft Defender for Cloud

Defender for Cloud is in active development and receives improvements on an ongoing basis. 

This article provides you with up-to-date information about new features, bug fixes, and deprecated functionality.

- To get the latest on new and updated security recommendations and alerts, review the [recommendations and alerts release notes](release-notes.md).
- If you're looking for items older than six months, you can find them in the [Archive for What's new in Microsoft Defender for Cloud](release-notes-archive.md).

> [!TIP]
> Get notified when this page is updated by copying and pasting the following URL into your feed reader:
>
> `https://aka.ms/mdc/rss`




## June 2024

|Date | Update |
|--|--|
| June 10 | [Copilot for Security in Defender for Cloud (Preview)](#copilot-for-security-in-defender-for-cloud-preview) |

### Copilot for Security in Defender for Cloud (Preview)

June 10, 2024

We're announcing the integration of Microsoft Copilot for Security into Defender for Cloud in public preview. Copilot's embedded experience in Defender for Cloud provides users with the ability to ask questions and get answers in natural language. Copilot can help you understand the context of a recommendation, the effect of implementing a recommendation, the steps needed to take to implement a recommendation, assist with the delegation of recommendations, and assist with the remediation of misconfigurations in code.

Learn more about [Copilot for Security in Defender for Cloud](copilot-security-in-defender-for-cloud.md).

## May 2024

|Date | Update |
|--|--|
| May 30 | [General availability of agentless malware detection in Defender for Servers Plan 2](#general-availability-of-agentless-malware-detection-in-defender-for-servers-plan-2) |
| May 30 | [General Availability of Unified Disk Encryption recommendations](#general-availability-of-unified-disk-encryption-recommendations) |
| May 28 | [Remediate security baseline recommendation](#remediate-security-baseline-recommendation) |
| May 22 | [Configure email notifications for attack paths](#configure-email-notifications-for-attack-paths) |
| May 9 | [Checkov integration for IaC scanning in Defender for Cloud (Preview)](#checkov-integration-for-iac-scanning-in-defender-for-cloud-preview) |
| May 6 | [AI multicloud security posture management is available for Azure and AWS (Preview)](#ai-multicloud-security-posture-management-is-available-for-azure-and-aws-preview) |
| May 2 | [Updated security policy management is now generally available](#updated-security-policy-management-is-now-generally-available) |
| May 1 | [Defender for open-source databases is now available on AWS for Amazon instances (Preview)](#defender-for-open-source-databases-is-now-available-on-aws-for-amazon-instances-preview) |

### General availability of agentless malware detection in Defender for Servers Plan 2

May 30, 2024

We're announcing the release of Defender for Cloud's agentless malware detection for Azure virtual machines (VMs), AWS EC2 instances, and GCP VM instances, as a new feature included in [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features).

Agentless malware detection for VMs is now included in our agentless scanning platform. Agentless malware detection utilizes [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/microsoft-defender-antivirus-windows) anti-malware engine to scan and detect malicious files. Any detected threats, trigger security alerts directly into Defender for Cloud and Defender XDR, where they can be investigated and remediated. The Agentless malware scanner complements the agent-based coverage with a second layer of threat detection with frictionless onboarding and has no effect on your machine's performance.

Learn more about [agentless malware scanning](agentless-malware-scanning.md) for servers and [agentless scanning for VMs](concept-agentless-data-collection.md).

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

### AI multicloud security posture management is available for Azure and AWS (Preview)

May 6, 2024

We're announcing the inclusion of AI security posture management in Defender for Cloud in public preview. This feature provides AI security posture management capabilities for Azure and AWS that enhance the security of your AI pipelines and services.

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
| March 17 | [Custom recommendations based on KQL for Azure is now public preview](#custom-recommendations-based-on-kql-for-azure-is-now-public-preview) |
| March 13 | [Inclusion of DevOps recommendations in the Microsoft cloud security benchmark](#inclusion-of-devops-recommendations-in-the-microsoft-cloud-security-benchmark) |
| March 13 | [ServiceNow integration is now generally available (GA)](#servicenow-integration-is-now-generally-available-ga) |
| March 13 | [Critical assets protection in Microsoft Defender for Cloud (Preview)](#critical-assets-protection-in-microsoft-defender-for-cloud-preview) |
| March 13 | [Enhanced AWS and GCP recommendations with automated remediation scripts](#enhanced-aws-and-gcp-recommendations-with-automated-remediation-scripts) |
| March 6 | [(Preview) Compliance standards added to compliance dashboard](#preview-compliance-standards-added-to-compliance-dashboard)  |
| March 6 | **Upcoming**: [Defender for open-source relational databases updates](#upcoming:-defender-for-open-source-relational-databases-updates)<br/><br/> **Expected**: April, 2024 |
| March 3 | **Upcoming**: [Changes in where you access Compliance offerings and Microsoft Actions](#upcoming:-changes-in-where-you-access-compliance-offerings-and-microsoft-actions)<br/><br/> **Expected**: September 2025 |
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

<<<<<<< HEAD

=======
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
>>>>>>> 256b73bc103f6acb7e25794072fd71a81c58cdde

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

### Upcoming: Defender for open-source relational databases updates

March 6, 2024**

**Estimated date for change: April, 2024**

**Defender for PostgreSQL Flexible Servers post-GA updates** - The update enables customers to enforce protection for existing PostgreSQL flexible servers at the subscription level, allowing complete flexibility to enable protection on a per-resource basis or for automatic protection of all resources at the subscription level.

**Defender for MySQL Flexible Servers Availability and GA** - Defender for Cloud is set to expand its support for Azure open-source relational databases by incorporating MySQL Flexible Servers.
This release will include:

- Alert compatibility with existing alerts for Defender for MySQL Single Servers.
- Enablement of individual resources.
- Enablement at the subscription level.

If you're already protecting your subscription with Defender for open-source relational databases, your flexible server resources are automatically enabled, protected, and billed.
Specific billing notifications have been sent via email for affected subscriptions.

Learn more about [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).

### Upcoming: Changes in where you access Compliance offerings and Microsoft Actions

March 3, 2024**

**Estimated date for change: September 2025**

On September 30, 2025, the locations where you access two preview features, Compliance offering and Microsoft Actions, will change.

The table that lists the compliance status of Microsoft's products (accessed from the **Compliance offerings** button in the toolbar of Defender's [regulatory compliance dashboard](regulatory-compliance-dashboard.md)). After this button is removed from Defender for Cloud, you'll still be able to access this information using the [Service Trust Portal](https://servicetrust.microsoft.com/).

For a subset of controls, Microsoft Actions was accessible from the **Microsoft Actions (Preview)** button in the controls details pane. After this button is removed, you can view Microsoft Actions by visiting Microsoft’s [Service Trust Portal for FedRAMP](https://servicetrust.microsoft.com/viewpage/FedRAMP) and accessing  the Azure System Security Plan document.



### Defender for Cloud Containers Vulnerability Assessment powered by Qualys retirement

March 3, 2024

The Defender for Cloud Containers Vulnerability Assessment powered by Qualys is being retired. The retirement will be completed by March 6, and until that time partial results may still appear both in the Qualys recommendations, and Qualys results in the security graph. Any customers who were previously using this assessment should upgrade to [Vulnerability assessments for Azure with Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-azure.md). For information about transitioning to the container vulnerability assessment offering powered by Microsoft Defender Vulnerability Management, see [Transition from Qualys to Microsoft Defender Vulnerability Management](transition-to-defender-vulnerability-management.md).

## February 2024

|Date | Update |
|----------|----------|
| February 28 | [Microsoft Security Code Analysis (MSCA) is no longer operational](#microsoft-security-code-analysis-msca-is-no-longer-operational) |
| February 28 | [Updated security policy management expands support to AWS and GCP](#updated-security-policy-management-expands-support-to-aws-and-gcp) |
| February 26 | **Upcoming**: [Microsoft Security Code Analysis (MSCA) is no longer operational](#upcoming:-microsoft-security-code-analysis-msca-is-no-longer-operational)<br/><br/> **Expected**: February 26, 2024 |
| February 26 | [Cloud support for Defender for Containers](#cloud-support-for-defender-for-containers) |
| February 20 | [New version of Defender sensor for Defender for Containers](#new-version-of-defender-sensor-for-defender-for-containers) |
| February 20 | **Upcoming**: [Update recommendations to align with Azure AI Services resources](#upcoming:-update-recommendations-to-align-with-azure-ai-services-resources)<br/><br/> **Expected**: February 28, 2024 |
| February 18| [Open Container Initiative (OCI) image format specification support](#open-container-initiative-oci-image-format-specification-support) |
| February 13 | [AWS container vulnerability assessment powered by Trivy retired](#aws-container-vulnerability-assessment-powered-by-trivy-retired) |
| February 12 | [New version of Defender sensor for Defender for Containers](#new-version-of-defender-sensor-for-defender-for-containers) |
| February 12 | **Upcoming**: [Deprecation of data recommendation](#upcoming:-deprecation-of-data-recommendation)br/><br/> **Expected**: March 14, 2024 |
| February 5 | **Upcoming**: [Decommissioning of Microsoft.SecurityDevOps resource provider](#upcoming:-decommissioning-of-microsoftsecuritydevops-resource-provider)br/><br/> **Expected**: March 6, 2024 |



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

### Upcoming: Microsoft Security Code Analysis (MSCA) is no longer operational

February 26, 2024**

**Estimated date for change: February 26, 2024**

In February 2021, the deprecation of the MSCA task was communicated to all customers and has been past end of life support since [March 2022](https://devblogs.microsoft.com/premier-developer/microsoft-security-code-analysis/). As of February 26, 2024, MSCA is officially no longer operational.

Customers can get the latest DevOps security tooling from Defender for Cloud through [Microsoft Security DevOps](azure-devops-extension.md) and more security tooling through [GitHub Advanced Security for Azure DevOps](https://azure.microsoft.com/products/devops/github-advanced-security).


### New version of Defender sensor for Defender for Containers

February 20, 2024

[A new version](../aks/supported-kubernetes-versions.md#aks-kubernetes-release-calendar) of the [Defender sensor for Defender for Containers](tutorial-enable-containers-azure.md#deploy-the-defender-sensor-in-azure) is available. It includes performance and security improvements, support for both AMD64 and ARM64 arch nodes (Linux only), and uses [Inspektor Gadget](https://www.inspektor-gadget.io/) as the process collection agent instead of Sysdig. The new version is only supported on Linux kernel versions 5.4 and higher, so if you have older versions of the Linux kernel, you need to upgrade. Support for ARM 64 is only available from AKS V1.29 and above. For more information, see [Supported host operating systems](support-matrix-defender-for-containers.md#supported-host-operating-systems).

### Upcoming: Update recommendations to align with Azure AI Services resources

February 20, 2024**

**Estimated date of change: February 28, 2024**

The Azure AI Services category (formerly known as Cognitive Services) is adding new resource types. As a result, the following recommendations and related policy are set to be updated to comply with the new Azure AI Services naming format and align with the relevant resources.

| Current Recommendation | Updated Recommendation |
| ---- | ---- |
| Cognitive Services accounts should restrict network access | [Azure AI Services resources should restrict network access](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/f738efb8-005f-680d-3d43-b3db762d6243) |
| Cognitive Services accounts should have local authentication methods disabled | [Azure AI Services resources should have key access disabled (disable local authentication)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/13b10b36-aa99-4db6-b00c-dcf87c4761e6) |

See the [list of security recommendations](recommendations-reference.md).


### Open Container Initiative (OCI) image format specification support

February 18, 2024

The [Open Container Initiative (OCI)](https://github.com/opencontainers/image-spec/blob/main/spec.md) image format specification is now supported by vulnerability assessment, powered by Microsoft Defender Vulnerability Management for AWS, Azure & GCP clouds.

### AWS container vulnerability assessment powered by Trivy retired

February 13, 2024

The container vulnerability assessment powered by Trivy has been retired. Any customers who were previously using this assessment should upgrade to the new [AWS container vulnerability assessment powered by Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-aws.md). For instructions on how to upgrade, see [How do I upgrade from the retired Trivy vulnerability assessment to the AWS vulnerability assessment powered by Microsoft Defender Vulnerability Management?](faq-defender-for-containers.yml#how-do-i-upgrade-from-the-retired-trivy-vulnerability-assessment-to-the-aws-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-)

### Upcoming: Deprecation of data recommendation

February 12, 2024**

**Estimated date of change: March 14, 2024**

The recommendation [`Public network access should be disabled for Cognitive Services accounts`](https://ms.portal.azure.com/?feature.msaljs=true#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/684a5b6d-a270-61ce-306e-5cea400dc3a7) is set to be deprecated. The related policy definition [`Cognitive Services accounts should disable public network access`](https://ms.portal.azure.com/?feature.msaljs=true#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0725b4dd-7e76-479c-a735-68e7ee23d5ca) is also being removed from the regulatory compliance dashboard.

This recommendation is already being covered by another networking recommendation for Azure AI Services, [`Cognitive Services accounts should restrict network access`](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/f738efb8-005f-680d-3d43-b3db762d6243/showSecurityCenterCommandBar~/false).

### Upcoming: Decommissioning of Microsoft.SecurityDevOps resource provider

February 5, 2024**

**Estimated date of change: March 6, 2024**

Microsoft Defender for Cloud is decommissioning the resource provider `Microsoft.SecurityDevOps` that was used during public preview of DevOps security, having migrated to the existing `Microsoft.Security` provider. The reason for the change is to improve customer experiences by reducing the number of resource providers associated with DevOps connectors.

Customers that are still using the API version **2022-09-01-preview** under `Microsoft.SecurityDevOps` to query Defender for Cloud DevOps security data will be impacted. To avoid disruption to their service, customer will need to update to the new API version **2023-09-01-preview** under the `Microsoft.Security` provider.

Customers currently using Defender for Cloud DevOps security from Azure portal won't be impacted.

For details on the new API version, see [Microsoft Defender for Cloud REST APIs](/rest/api/defenderforcloud/operation-groups).

## January 2024

|Date | Update |
|----------|----------|
| January 31 | [New insight for active repositories in Cloud Security Explorer](#new-insight-for-active-repositories-in-cloud-security-explorer) |
| January 30 | **Upcoming**: [Change in pricing for multicloud container threat detection](#upcoming:-change-in-pricing-for-multicloud-container-threat-detection)<br/><br/> **Expected**: April 2024 |
| January 29 | **Upcoming**: [Enforcement of Defender CSPM for Premium DevOps Security Capabilities](#upcoming:-enforcement-of-defender-cspm-for-premium-devops-security-value)<br/><br/> **Expected**: March 2024 |
| January 24 | [Agentless container posture for GCP in Defender for Containers and Defender CSPM (Preview)](#agentless-container-posture-for-gcp-in-defender-for-containers-and-defender-cspm-preview) |
| January 16 | [Public preview of agentless malware scanning for servers](#public-preview-of-agentless-malware-scanning-for-servers)|
| January 15 | [General availability of Defender for Cloud's integration with Microsoft Defender XDR](#general-availability-of-defender-for-clouds-integration-with-microsoft-defender-xdr) |
| January 14 | [Update to agentless VM scanning built-in Azure role](#update-to-agentless-vm-scanning-built-in-azure-role)<br/><br/> **Expected**: March 2024 | 
| January 12 | [DevOps security Pull Request annotations are now enabled by default for Azure DevOps connectors](#devops-security-pull-request-annotations-are-now-enabled-by-default-for-azure-devops-connectors) |
| January 9 | [Defender for Servers built-in vulnerability assessment (Qualys) retirement path](#defender-for-servers-built-in-vulnerability-assessment-qualys-retirement-path)<br/><br/> **Expected**: May 2024 | 
| January 3 | [Upcoming change for the Defender for Cloud’s multicloud network requirements](#upcoming:-upcoming-change-for-the-defender-for-clouds-multicloud-network-requirements)<br/><br/> **Expected**: May 2024 | 



### New insight for active repositories in Cloud Security Explorer

January 31, 2024

A new insight for Azure DevOps repositories has been added to the Cloud Security Explorer to indicate whether repositories are active. This insight indicates that the code repository is not archived or disabled, meaning that write access to code, builds, and pull requests is still available for users. Archived and disabled repositories might be considered lower priority as the code isn't typically used in active deployments.

To test out the query through Cloud Security Explorer, use [this query link](https://ms.portal.azure.com#view/Microsoft_Azure_Security/SecurityGraph.ReactView/query/%7B%22type%22%3A%22securitygraphquery%22%2C%22version%22%3A2%2C%22properties%22%3A%7B%22source%22%3A%7B%22type%22%3A%22datasource%22%2C%22properties%22%3A%7B%22sources%22%3A%5B%7B%22type%22%3A%22entity%22%2C%22properties%22%3A%7B%22source%22%3A%22azuredevopsrepository%22%7D%7D%5D%2C%22conditions%22%3A%7B%22type%22%3A%22conditiongroup%22%2C%22properties%22%3A%7B%22operator%22%3A%22and%22%2C%22conditions%22%3A%5B%7B%22type%22%3A%22insights%22%2C%22properties%22%3A%7B%22name%22%3A%226b8f221b-c0ce-48e3-9fbb-16f917b1c095%22%7D%7D%5D%7D%7D%7D%7D%7D%7D).

### Upcoming: Change in pricing for multicloud container threat detection

January 30, 2024**

**Estimated date for change: April 2024**

When [multicloud container threat detection](support-matrix-defender-for-containers.md) moves to GA, it will no longer be free of charge. For more information, see [Microsoft Defender for Cloud pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

### Upcoming: Enforcement of Defender CSPM for Premium DevOps Security Value

January 29, 2024**

**Estimated date for change: March 7, 2024**

Defender for Cloud will begin enforcing the Defender CSPM plan check for premium DevOps security value beginning **March 7th, 2024**. If you have the Defender CSPM plan enabled on a cloud environment (Azure, AWS, GCP) within the same tenant your DevOps connectors are created in, you'll continue to receive premium DevOps capabilities at no extra cost. If you aren't a Defender CSPM customer, you have until **March 7th, 2024** to enable Defender CSPM before losing access to these security features. To enable Defender CSPM on a connected cloud environment before March 7, 2024, follow the enablement documentation outlined [here](tutorial-enable-cspm-plan.md#enable-the-components-of-the-defender-cspm-plan).

For more information about which DevOps security features are available across both the Foundational CSPM and Defender CSPM plans, see [our documentation outlining feature availability](devops-support.md#feature-availability).

For more information about DevOps Security in Defender for Cloud, see the [overview documentation](defender-for-devops-introduction.md).

For more information on the code to cloud security capabilities in Defender CSPM, see [how to protect your resources with Defender CSPM](tutorial-enable-cspm-plan.md).




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

### Upcoming: Update to agentless VM scanning built-in Azure role

January 14, 2024**

**Estimated date of change: February 2024**

In Azure, agentless scanning for VMs uses a built-in role (called [VM scanner operator](faq-permissions.yml)) with the minimum necessary permissions required to scan and assess your VMs for security issues. To continuously provide relevant scan health and configuration recommendations for VMs with encrypted volumes, an update to this role's permissions is planned. The update includes the addition of the ```Microsoft.Compute/DiskEncryptionSets/read``` permission. This permission solely enables improved identification of encrypted disk usage in VMs. It doesn't provide Defender for Cloud any more capabilities to decrypt or access the content of these encrypted volumes beyond the encryption methods [already supported](concept-agentless-data-collection.md#availability) prior to this change. This change is expected to take place during February 2024 and no action is required on your end.

### DevOps security Pull Request annotations are now enabled by default for Azure DevOps connectors

January 12, 2024

DevOps security exposes security findings as annotations in Pull Requests (PR) to help developers prevent and fix potential security vulnerabilities and misconfigurations before they enter production. As of January 12, 2024, PR annotations are now enabled by default for all new and existing Azure DevOps repositories that are connected to Defender for Cloud.

By default, PR annotations are enabled only for High severity Infrastructure as Code (IaC) findings. Customers will still need to configure Microsoft Security for DevOps (MSDO) to run in PR builds and enable the Build Validation policy for CI builds in Azure DevOps repository settings. Customers can disable the PR Annotation feature for specific repositories from within the DevOps security blade repository configuration options.

Learn more about [enabling Pull Request annotations for Azure DevOps](enable-pull-request-annotations.md#enable-pull-request-annotations-in-azure-devops).

### Upcoming: Defender for Servers built-in vulnerability assessment (Qualys) retirement path

January 9, 2024**

**Estimated date for change: May 2024**

The Defender for Servers built-in vulnerability assessment solution powered by Qualys is on a retirement path, which is estimated to complete on **May 1st, 2024**. If you're currently using the vulnerability assessment solution powered by Qualys, you should plan your [transition to the integrated Microsoft Defender vulnerability management solution](how-to-transition-to-built-in.md).

For more information about our decision to unify our vulnerability assessment offering with Microsoft Defender Vulnerability Management, you can read [this blog post](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/defender-for-cloud-unified-vulnerability-assessment-powered-by/ba-p/3990112).

You can also check out the [common questions about the transition to Microsoft Defender Vulnerability Management solution](faq-scanner-detection.yml).

### Upcoming: Defender for Cloud’s multicloud network requirements

January 3, 2024**

**Estimated date for change: May 2024**

Beginning May 2024, we'll be retiring the old IP addresses associated with our multicloud discovery services to accommodate improvements and ensure a more secure and efficient experience for all users.

To ensure uninterrupted access to our services, you should update your IP allowlist with the new ranges provided in the following sections. You should make the necessary adjustments in your firewall settings, security groups, or any other configurations that may be applicable to your environment.

The list is applicable to all plans and sufficient for full capability of the CSPM foundational (free) offering.

**IP addresses to be retired**:

- Discovery GCP: 104.208.29.200, 52.232.56.127
- Discovery AWS: 52.165.47.219, 20.107.8.204
- Onboarding: 13.67.139.3

**New region-specific IP ranges to be added**:

- West Europe (weu): 52.178.17.48/28
- North Europe (neu): 13.69.233.80/28
- Central US (cus): 20.44.10.240/28
- East US 2 (eus2): 20.44.19.128/28

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

- As part of this change, new recommendations were released for GA, and included in secure score calculation. [Review new and updated security recommendations](release-notes-recommendations-alerts.md)
- Container image scan powered by Microsoft Defender Vulnerability Management now also incurs charges according to [plan pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing). Note that images scanned both by our container VA offering powered by Qualys and Container VA offering powered by Microsoft Defender Vulnerability Management will only be billed once.

Qualys recommendations for Containers Vulnerability Assessment have been renamed and continue to be available for customers who enabled Defender for Containers on any of their subscriptions prior to this release. New customers onboarding Defender for Containers after this release will only see the new Container vulnerability assessment recommendations powered by Microsoft Defender Vulnerability Management.


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


<<<<<<< HEAD
## November 2023

| Date | Update |
|--|--|
| November 30 | [Deprecation of two DevOps security recommendations](#deprecation-of-two-devops-security-recommendations)<br/><br/> **Expected**: January 2024 | 
| November 27 | [General availability of agentless secrets scanning in Defender for Servers and Defender CSPM](#general-availability-of-agentless-secrets-scanning-in-defender-for-servers-and-defender-cspm) |
| November 22 | [Enable permissions management with Defender for Cloud (Preview)](#enable-permissions-management-with-defender-for-cloud-preview) |
| November 22 | [Defender for Cloud integration with ServiceNow](#defender-for-cloud-integration-with-servicenow) |
| November 20 | [General Availability of the autoprovisioning process for SQL Servers on machines plan](#general-availability-of-the-autoprovisioning-process-for-sql-servers-on-machines-plan)|
| November 15 | [General availability of Defender for APIs](#general-availability-of-defender-for-apis) |
| November 15 | [Defender for Cloud is now integrated with Microsoft 365 Defender (Preview)](#defender-for-cloud-is-now-integrated-with-microsoft-365-defender-preview) |
| November 15 | [General availability of Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM) in Defender for Containers and Defender for Container Registries](#general-availability-of-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-mdvm-in-defender-for-containers-and-defender-for-container-registries) |
| November 15 | [Risk prioritization is now available for recommendations](#risk-prioritization-is-now-available-for-recommendations) |
| November 15 | [Attack path analysis new engine and extensive enhancements](#attack-path-analysis-new-engine-and-extensive-enhancements) |
| November 15 | [Changes to Attack Path's Azure Resource Graph table scheme](#changes-to-attack-paths-azure-resource-graph-table-scheme) |
| November 15 | [General Availability release of GCP support in Defender CSPM](#general-availability-release-of-gcp-support-in-defender-cspm) |
| November 15 | [General Availability release of Data security dashboard](#general-availability-release-of-data-security-dashboard) |
| November 15 | [General Availability release of sensitive data discovery for databases](#general-availability-release-of-sensitive-data-discovery-for-databases) |
November 1 | [Consolidation of Defender for Cloud's Service Level 2 names](#consolidation-of-defender-for-clouds-service-level-2-names) <br/><br/> **Expected**: December 2023 | 


### General availability of agentless secrets scanning in Defender for Servers and Defender CSPM

November 27, 2023

Agentless secrets scanning enhances the security cloud based Virtual Machines (VM) by identifying plaintext secrets on VM disks. Agentless secrets scanning provides comprehensive information to help prioritize detected findings and mitigate lateral movement risks before they occur. This proactive approach prevents unauthorized access, ensuring your cloud environment remains secure.

We're announcing the General Availability (GA) of agentless secrets scanning, which is included in both the [Defender for Servers P2](tutorial-enable-servers-plan.md) and the [Defender CSPM](tutorial-enable-cspm-plan.md) plans.

Agentless secrets scanning utilizes cloud APIs to capture snapshots of your disks, conducting out-of-band analysis that ensures that there's no effect on your VM's performance. Agentless secrets scanning broadens the coverage offered by Defender for Cloud over cloud assets across Azure, AWS, and GCP environments to enhance your cloud security.

With this release, Defender for Cloud's detection capabilities now support other database types, data store signed URLs, access tokens, and more.

Learn how to [manage secrets with agentless secrets scanning](secret-scanning.md).

### Enable permissions management with Defender for Cloud (Preview)

November 22, 2023

Microsoft now offers both Cloud-Native Application Protection Platforms (CNAPP) and Cloud Infrastructure Entitlement Management (CIEM) solutions with [Microsoft Defender for Cloud (CNAPP)](defender-for-cloud-introduction.md) and [Microsoft Entra Permissions Management](/entra/permissions-management/) (CIEM).

Security administrators can get a centralized view of their unused or excessive access permissions within Defender for Cloud.

Security teams can drive the least privilege access controls for cloud resources and receive actionable recommendations for resolving permissions risks across Azure, AWS, and GCP cloud environments as part of their Defender Cloud Security Posture Management (CSPM), without any extra licensing requirements.

Learn how to [Enable Permissions Management in Microsoft Defender for Cloud (Preview)](enable-permissions-management.md).

### Defender for Cloud integration with ServiceNow

November 22, 2023

ServiceNow is now integrated with Microsoft Defender for Cloud, which enables customers to connect ServiceNow to their Defender for Cloud environment to prioritize remediation of recommendations that affect your business. Microsoft Defender for Cloud integrates with the ITSM module (incident management). As part of this connection, customers are able to create/view ServiceNow tickets (linked to recommendations) from Microsoft Defender for Cloud.

You can learn more about [Defender for Cloud's integration with ServiceNow](integration-servicenow.md).

### General Availability of the autoprovisioning process for SQL Servers on machines plan

November 20, 2023

In preparation for the Microsoft Monitoring Agent (MMA) deprecation in August 2024, Defender for Cloud released a SQL Server-targeted Azure Monitoring Agent (AMA) autoprovisioning process. The new process is automatically enabled and configured for all new customers, and also provides the ability for resource level enablement for Azure SQL VMs and Arc-enabled SQL Servers.

Customers using the MMA autoprovisioning process are requested to [migrate to the new Azure Monitoring Agent for SQL server on machines autoprovisioning process](defender-for-sql-autoprovisioning.md). The migration process is seamless and provides continuous protection for all machines.  

### General availability of Defender for APIs

November 15, 2023

We're announcing the General Availability (GA) of Microsoft Defender for APIs. Defender for APIs is designed to protect organizations against API security threats.

Defender for APIs allows organizations to protect their APIs and data from malicious actors. Organizations can investigate and improve their API security posture, prioritize vulnerability fixes, and quickly detect and respond to active real-time threats. Organizations can also integrate security alerts directly into their Security Incident and Event Management (SIEM) platform, for example Microsoft Sentinel, to investigate and triage issues.

You can learn how to [Protect your APIs with Defender for APIs](defender-for-apis-deploy.md). You can also learn more about [About Microsoft Defender for APIs](defender-for-apis-introduction.md).

You can also read [this blog](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-announces-general-availability-of-defender-for-apis/ba-p/3981488) to learn more about the GA announcement.

### Defender for Cloud is now integrated with Microsoft 365 Defender (Preview)

November 15, 2023

Businesses can protect their cloud resources and devices with the new integration between Microsoft Defender for Cloud and Microsoft Defender XDR. This integration connects the dots between cloud resources, devices, and identities, which previously required multiple experiences.

The integration also brings competitive cloud protection capabilities into the Security Operations Center (SOC) day-to-day. With Microsoft Defender XDR, SOC teams can easily discover attacks that combine detections from multiple pillars, including Cloud, Endpoint, Identity, Office 365, and more.

Some of the key benefits include:

- **One easy-to-use interface for SOC teams**: With Defender for Cloud's alerts and cloud correlations integrated into M365D, SOC teams can now access all security information from a single interface, significantly improving operational efficiency.

- **One attack story**: Customers are able to understand the complete attack story, including their cloud environment, by using prebuilt correlations that combine security alerts from multiple sources.

- **New cloud entities in Microsoft Defender XDR**: Microsoft Defender XDR now supports new cloud entities that are unique to Microsoft Defender for Cloud, such as cloud resources. Customers can match Virtual Machine (VM) entities to device entities, providing a unified view of all relevant information about a machine, including alerts and incidents that were triggered on it.

- **Unified API for Microsoft Security products**: Customers can now export their security alerts data into their systems of choice using a single API, as Microsoft Defender for Cloud alerts and incidents are now part of Microsoft Defender XDR's public API.

The integration between Defender for Cloud and Microsoft Defender XDR is available to all new and existing Defender for Cloud customers.

### General availability of Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM) in Defender for Containers and Defender for Container Registries

November 15, 2023

Vulnerability assessment (VA) for Linux container images in Azure container registries powered by Microsoft Defender Vulnerability Management (MDVM) is released for General Availability (GA) in Defender for Containers and Defender for Container Registries.

- As part of this change, recommendations were released for GA and renamed, and are now included in the secure score calculation. [Review recommendations and alerts release notes](release-notes-recommendations-alerts.md)
- Container image scan powered by MDVM now also incur charges as per [plan pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing). Note that images scanned both by our container VA offering powered by Qualys and Container VA offering powered by MDVM, will only be billed once.

Qualys recommendations for Containers Vulnerability Assessment were renamed and will continue to be available for customers that enabled Defender for Containers on any of their subscriptions prior to November 15. New customers onboarding Defender for Containers after November 15, will only see the new Container vulnerability assessment recommendations powered by Microsoft Defender Vulnerability Management.


### Risk prioritization is now available for recommendations

November 15, 2023

You can now prioritize your security recommendations according to the risk level they pose, taking in to consideration both the exploitability and potential business effect of each underlying security issue.

By organizing your recommendations based on their risk level (Critical, high, medium, low), you're able to address the most critical risks within your environment and efficiently prioritize the remediation of security issues based on the actual risk such as internet exposure, data sensitivity, lateral movement possibilities, and potential attack paths that could be mitigated by resolving the recommendations.

Learn more about [risk prioritization](implement-security-recommendations.md#group-recommendations-by-risk-level).

### Attack path analysis new engine and extensive enhancements

November 15, 2023

We're releasing enhancements to the attack path analysis capabilities in Defender for Cloud.  

- **New engine** - attack path analysis has a new engine, which uses path-finding algorithm to detect every possible attack path that exists in your cloud environment (based on the data we have in our graph). We can find many more attack paths in your environment and detect more complex and sophisticated attack patterns that attackers can use to breach your organization.

- **Improvements** - The following improvements are released:

  - **Risk prioritization** - prioritized list of attack paths based on risk (exploitability & business affect).
  - **Enhanced remediation** - pinpointing the specific recommendations that should be resolved to actually break the chain.
  - **Cross-cloud attack paths** – detection of attack paths that are cross-clouds (paths that start in one cloud and end in another).
  - **MITRE** – Mapping all attack paths to the MITRE framework.
  - **Refreshed user experience** – refreshed experience with stronger capabilities: advanced filters, search, and grouping of attack paths to allow easier triage.

Learn [how to identify and remediate attack paths](how-to-manage-attack-path.md).

### Changes to Attack Path's Azure Resource Graph table scheme

November 15, 2023

The attack path's Azure Resource Graph (ARG) table scheme is updated. The `attackPathType` property is removed and other properties are added.

### General Availability release of GCP support in Defender CSPM

November 15, 2023

We're announcing the GA (General Availability) release of the Defender CSPM contextual cloud security graph and attack path analysis with support for GCP resources. You can apply the power of Defender CSPM for comprehensive visibility and intelligent cloud security across GCP resources.

 Key features of our GCP support include:

- **Attack path analysis** - Understand the potential routes attackers might take.
- **Cloud security explorer** - Proactively identify security risks by running graph-based queries on the security graph.
- **Agentless scanning** - Scan servers and identify secrets and vulnerabilities without installing an agent.
- **Data-aware security posture** - Discover and remediate risks to sensitive data in Google Cloud Storage buckets.

Learn more about [Defender CSPM plan options](concept-cloud-security-posture-management.md).

> [!NOTE]
> Billing for the GA release of GCP support in Defender CSPM will begin on February 1st 2024.

### General Availability release of Data security dashboard

November 15, 2023

The data security dashboard is now available in General Availability (GA) as part of the Defender CSPM plan.

The data security dashboard allows you to view your organization's data estate, risks to sensitive data, and insights about your data resources.

Learn more about the [data security dashboard](data-aware-security-dashboard-overview.md).

### General Availability release of sensitive data discovery for databases

November 15, 2023

Sensitive data discovery for managed databases including Azure SQL databases and AWS RDS instances (all RDBMS flavors) is now generally available and allows for the automatic discovery of critical databases that contain sensitive data.

To enable this feature across all supported datastores on your environments, you need to enable `Sensitive data discovery` in Defender CSPM. Learn [how to enable sensitive data discovery in Defender CSPM](tutorial-enable-cspm-plan.md#enable-the-components-of-the-defender-cspm-plan).

You can also learn how [sensitive data discovery is used in data-aware security posture](concept-data-security-posture.md).

Public Preview announcement: [New expanded visibility into multicloud data security in Microsoft Defender for Cloud](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/new-expanded-visibility-into-multicloud-data-security-in/ba-p/3913010).

### New version of the recommendation to find missing system updates is now GA

November 6, 2023

An extra agent is no longer needed on your Azure VMs and Azure Arc machines to ensure the machines have all of the latest security or critical system updates.

The new system updates recommendation, `System updates should be installed on your machines (powered by Azure Update Manager)` in the `Apply system updates` control, is based on the [Update Manager](../update-manager/overview.md) and is now fully GA. The recommendation relies on a native agent embedded in every Azure VM and Azure Arc machines instead of an installed agent. The quick fix in the new recommendation navigates you to a one-time installation of the missing updates in the Update Manager portal.

The old and the new versions of the recommendations to find missing system updates will both be available until August 2024, which is when the older version is deprecated. Both recommendations: `System updates should be installed on your machines (powered by Azure Update Manager)`and `System updates should be installed on your machines` are available under the same control: `Apply system updates` and has the same results. Thus, there's no duplication in the effect on the secure score.

We recommend migrating to the new recommendation and remove the old one, by disabling it from Defender for Cloud's built-in initiative in Azure policy.

The recommendation `[Machines should be configured to periodically check for missing system updates](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/90386950-71ca-4357-a12e-486d1679427c)` is also GA and is a prerequisite, which will have a negative effect on your Secure Score. You can remediate the negative effect with the available Fix.  

To apply the new recommendation, you need to:

1. Connect your non-Azure machines to Arc.
1. Turn on the [periodic assessment property](../update-manager/assessment-options.md). You can use the Quick Fix in the new recommendation, `[Machines should be configured to periodically check for missing system updates](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/90386950-71ca-4357-a12e-486d1679427c)` to fix the recommendation.

> [!NOTE]
> Enabling periodic assessments for Arc enabled machines that Defender for Servers Plan 2 isn't enabled on their related Subscription or Connector, is subject to [Azure Update Manager pricing](https://azure.microsoft.com/pricing/details/azure-update-management-center/). Arc enabled machines that [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features) is enabled on their related Subscription or Connectors, or any Azure VM, are eligible for this capability with no additional cost.

## October 2023

|Date |Update  |
|----------|----------|
| October 25 | [Offline Azure API Management revisions removed from Defender for APIs](#offline-azure-api-management-revisions-removed-from-defender-for-apis) |
October 25 | [Changes to how Microsoft Defender for Cloud's costs are presented in Microsoft Cost Management](#changes-to-how-microsoft-defender-for-clouds-costs-are-presented-in-microsoft-cost-management)<br/><br/> **Expected**: November 2023 | 
| October 19 | [DevOps security posture management recommendations available in public preview](#devops-security-posture-management-recommendations-available-in-public-preview) |
| October 18 | [Releasing CIS Azure Foundations Benchmark v2.0.0 in Regulatory Compliance dashboard](#releasing-cis-azure-foundations-benchmark-v200-in-regulatory-compliance-dashboard) |




### Offline Azure API Management revisions removed from Defender for APIs

October 25, 2023

Defender for APIs updated its support for Azure API Management API revisions. Offline revisions no longer appear in the onboarded Defender for APIs inventory and no longer appear to be onboarded to Defender for APIs. Offline revisions don't allow any traffic to be sent to them and pose no risk from a security perspective.

### DevOps security posture management recommendations available in public preview

October 19, 2023

New DevOps posture management recommendations are now available in public preview for all customers with a connector for Azure DevOps or GitHub. DevOps posture management helps to reduce the attack surface of DevOps environments by uncovering weaknesses in security configurations and access controls. Learn more about [DevOps posture management](concept-devops-environment-posture-management-overview.md).

### Releasing CIS Azure Foundations Benchmark v2.0.0 in regulatory compliance dashboard

October 18, 2023

Microsoft Defender for Cloud now supports the latest [CIS Azure Security Foundations Benchmark - version 2.0.0](https://www.cisecurity.org/benchmark/azure) in the Regulatory Compliance [dashboard](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/22), and a built-in policy initiative in Azure Policy. The release of version 2.0.0 in Microsoft Defender for Cloud is a joint collaborative effort between Microsoft, the Center for Internet Security (CIS), and the user communities. The version 2.0.0 significantly expands assessment scope, which now includes 90+ built-in Azure policies and succeed the prior versions 1.4.0 and 1.3.0 and 1.0 in Microsoft Defender for Cloud and Azure Policy. For more information, you can check out this [blog post](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-cloud-now-supports-cis-azure-security/ba-p/3944860).


=======
>>>>>>> 256b73bc103f6acb7e25794072fd71a81c58cdde
## Next steps

For past changes to Defender for Cloud, see [Archive for what's new in Defender for Cloud?](release-notes-archive.md).
