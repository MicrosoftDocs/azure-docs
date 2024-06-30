---
title: Release notes for Microsoft Defender for Cloud
description: What's new and updated in Microsoft Defender for Cloud
ms.topic: overview
ms.date: 03/24/2024
---

# What's new - Microsoft Defender for Cloud

Defender for Cloud is actively developed and improved on an ongoing basis.

This What's new article provides you with up-to-date information about new features in preview or general availability (GA), bug fixes, and deprecated functionality.

- To get the latest on new and updated security recommendations and alerts, review [What's new in recommendations and alerts](release-notes.md).
- If you're looking for items older than six months, you can find them in the [What's new archive](release-notes-archive.md).

> [!TIP]
> Get notified when this page is updated by copying and pasting the following URL into your feed reader:
>
> `https://aka.ms/mdc/rss`


## June 2024

|Date | Update |
|--|--|
| June 27 | [Checkov IaC Scanning in Defender for Cloud (GA)](#checkov-iac-scanning-in-defender-for-cloud-ga) |
| June 24 | [Change in pricing for Defender for Containers (multicloud)](#change-in-pricing-for-defender-for-containers-multicloud) | Estimated deprecation date: August 2024
| June 20 | [Reminder of the deprecation scope of adaptive recommendations as of MMA deprecation](#reminder-of-the-deprecation-scope-of-adaptive-recommendations-as-of-mma-deprecation)<br/><br/> Estimated deprecation: August 2024 
| June 10 | [Copilot for Security in Defender for Cloud (Preview)](#copilot-for-security-in-defender-for-cloud-preview) |
| June 10 | [SQL vulnerability assessment automatic enablement using express configuration on unconfigured servers](#sql-vulnerability-assessment-automatic-enablement-using-express-configuration-on-unconfigured-servers)<br/><br/> Estimated deprecation: July 10, 2024 |
| June 3 | [Changes to identity recommendations](#changes-to-identity-recommendations)<br/><br/> Estimated deprecation: July 10 2024 |



### Checkov IaC Scanning in Defender for Cloud (GA)

June 27, 2024

We are announcing the general availability of the Checkov integration for Infrasturcture-as-Code (IaC) scanning through [MSDO](azure-devops-extension.yml). As part of this release, Checkov will be replacing Terrascan as a default IaC analyzer that runs as part of the MSDO CLI. Terrascan may still be configured manually through MSDO's [environment variables](https://github.com/microsoft/security-devops-azdevops/wiki) but will not run by default. 

Security findings from Checkov will be represented as recommendations for both Azure DevOps and GitHub repositories under the assessments "Azure DevOps repositories should have infrastructure as code findings resolved" and "GitHub repositories should have infrastructure as code findings resolved". 

To learn more about DevOps security in Defender for Cloud, see the [DevOps Security Overview](defender-for-devops-introduction.md). To learn how to configure the MSDO CLI, see the [Azure DevOps](azure-devops-extension.yml) or [GitHub](github-action.md) documentation.

### Change in pricing for Defender for Containers in multicloud

June 24, 2024

Since Defender for Containers in multicloud is now generally available, it's no longer free of charge. For more information, see [Microsoft Defender for Cloud pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

### Copilot for Security in Defender for Cloud (Preview)

June 10, 2024

We're announcing the integration of Microsoft Copilot for Security into Defender for Cloud in public preview. Copilot's embedded experience in Defender for Cloud provides users with the ability to ask questions and get answers in natural language. Copilot can help you understand the context of a recommendation, the effect of implementing a recommendation, the steps needed to take to implement a recommendation, assist with the delegation of recommendations, and assist with the remediation of misconfigurations in code.

Learn more about [Copilot for Security in Defender for Cloud](copilot-security-in-defender-for-cloud.md).

### Copilot for Security in Defender for Cloud (Preview)

June 10, 2024

The integration of Microsoft Copilot for Security into Defender for Cloud is now in public preview. With Copilot's embedded experience in Defender for Cloud, you can ask questions and get answers in natural language. Copilot helps you to understand the context of a recommendation, the effect of implementing a recommendation, the steps for implementing a recommendation, and can assist with the delegation of recommendations and remediation of misconfigurations in code.

Learn more about [Copilot for Security in Defender for Cloud](copilot-security-in-defender-for-cloud.md).

## May 2024

|Date | Update |
|--|--|
| May 30 | [Agentless malware detection in Defender for Servers Plan 2 (GA)](#general-availability-of-agentless-malware-detection-in-defender-for-servers-plan-2) |
| May 22 | [Configure email notifications for attack paths](#configure-email-notifications-for-attack-paths) |
| May 9 | [Checkov integration for IaC scanning in Defender for Cloud (Preview)](#checkov-integration-for-iac-scanning-in-defender-for-cloud-preview) |
| May 6 | [AI multicloud security posture management is available for Azure and AWS (Preview)](#ai-multicloud-security-posture-management-is-available-for-azure-and-aws-preview) |
| May 2 | [Updated security policy management (GA)](#updated-security-policy-management-is-now-generally-available) |
| May 1 | [Defender for open-source databases is now available on AWS for Amazon instances (Preview)](#defender-for-open-source-databases-is-now-available-on-aws-for-amazon-instances-preview) |
| May 1 | [Removal of FIM over AMA and release of new version over Defender for Endpoint](#removal-of-fim-over-ama-and-release-of-new-version-over-defender-for-endpoint)<br/><br/> Estimated deprecation: August 2024 |
| May 1 | [Deprecation of system update recommendations](#deprecation-of-system-update-recommendations)<br/><br/> Estimated deprecation: July 2024 |
| May 1 | [Deprecation of MMA related recommendations](#deprecation-of-mma-related-recommendations)<br/><br/> Estimated deprecation: July 2024 |

### Agentless malware detection in Defender for Servers Plan 2 (GA)

May 30, 2024

Defender for Cloud's agentless malware detection for Azure VMs, AWS EC2 instances, and GCP VM instances is now generally available as a new feature in [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features).

Agentless malware detection uses the [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/microsoft-defender-antivirus-windows) anti-malware engine to scan and detect malicious files. Detected threats trigger security alerts directly into Defender for Cloud and Defender XDR, where they can be investigated and remediated. Learn more about [agentless malware scanning](agentless-malware-scanning.md) for servers and [agentless scanning for VMs](concept-agentless-data-collection.md).


### Configure email notifications for attack paths

May 22, 2024

You can now configure email notifications when an attack path is detected with a specified risk level or higher.
Learn how to [configure email notifications](configure-email-notifications.md).

### Advanced hunting in Microsoft Defender XDR includes Defender for Cloud alerts and incidents

May 21, 2024

Defender for Cloud's alerts and incidents are now integrated with Microsoft Defender XDR and can be accessed in the Microsoft Defender Portal. This integration provides richer context to investigations that span cloud resources, devices, and identities. Learn about [advanced hunting in XDR integration](concept-integration-365.md#advanced-hunting-in-xdr).

### Checkov integration for IaC scanning in Defender for Cloud (Preview)

May 9, 2024

Checkov integration for DevOps security in Defender for Clou is now in preview. This integration improves both the quality and total number of Infrastructure-as-Code checks run by the MSDO CLI when scanning IaC templates.

While in preview, Checkov must be explicitly invoked through the 'tools' input parameter for the MSDO CLI.

Learn more about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md) and configuring the MSDO CLI for [Azure DevOps](azure-devops-extension.yml) and [GitHub](github-action.md).

### Permissions management in Defender for Cloud (GA)

May 7, 2024

[Permissions management](permissions-management.md) is now generally available in Defender for Cloud.

### AI multicloud security posture management (Preview)

May 6, 2024

 AI security posture management is available in preview in Defender for Cloud. It provides AI security posture management capabilities for Azure and AWS, to enhance the security of your AI pipelines and services.

Learn more about [AI security posture management](ai-security-posture.md).

### Threat protection for AI workloads in Azure (limited preview)

May 6, 2024

Threat protection for AI workloads in Defender for Cloud is available in limited preview. his plan helps you monitor your Azure OpenAI powered applications in runtime for malicious activity, identify, and remediate security risks. It provides contextual insights into AI workload threat protection, integrating with [Responsible AI](../ai-services/responsible-use-of-ai-overview.md) and Microsoft Threat Intelligence. Relevant security alerts are integrated into the Defender portal.

Learn more about [threat protection for AI workloads](ai-threat-protection.md).

### Updated security policy management (GA)

May 2, 2024

Security policy management across clouds (Azure, AWS, GCP) is now generally available. This enables security teams to manage their security policies in a consistent way and with new features

Learn more about [security policies in Microsoft Defender for Cloud](security-policy-concept.md#working-with-security-standards).

### Defender for open-source databases available in AWS (preview)

May 1, 2024

Defender for open-source databases on AWS is now available in preview. It adds support for various types of Amazon Relational Database Service (RDS) instance types.

Learn more about [Defender for open-source databases](defender-for-databases-introduction.md) and how to [enable Defender for open-source databases on AWS](enable-defender-for-databases-aws.md).

## April 2024

|Date | Update |
|--|--|
| April 18 | [Deprecation of fileless attack alerts](#deprecation-of-fileless-attack-alerts)<br/><br/> Estimated deprecation: May 2024 |
| April 16 | [Change in CIEM assessment IDs](#change-in-ciem-assessment-ids)<br/><br/> Estimated deprecation: May 2024 |
| April 15 | [Defender for Containers is now generally available (GA) for AWS and GCP](#defender-for-containers-is-now-generally-available-ga-for-aws-and-gcp) |
| April 3 | [Risk prioritization is now the default experience in Defender for Cloud](#risk-prioritization-is-now-the-default-experience-in-defender-for-cloud) |
| April 3 | [Defender for open-source relational databases updates](#defender-for-open-source-relational-databases-updates) |
| April 3 | [Deprecation of encryption recommendation](#deprecation-of-encryption-recommendation)<br/><br/> Estimated deprecation: May 2024 |
|April 2 | [Deprecating of virtual machine recommendation](#deprecating-of-virtual-machine-recommendation)<br/><br/> Estimated deprecation: July, 2024 |

### Defender for Containers for AWS and GCP (GA)

April 15, 2024

Runtime threat detection and agentless discovery for AWS and GCP in Defender for Containers are now generally available. In addition, there's a new authentication capability in AWS which simplifies provisioning. 

Learn more about [containers support matrix in Defender for Cloud](support-matrix-defender-for-containers.md) and how to [configure Defender for Containers components](/azure/defender-for-cloud/defender-for-containers-enable?branch=pr-en-us-269845&tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api&pivots=defender-for-container-eks#deploying-the-defender-sensor).

### Risk prioritization 

April 3, 2024

Risk prioritization is now the default experience in Defender for Cloud. This feature helps you to focus on the most critical security issues in your environment by prioritizing recommendations based on the risk factors of each resource. The risk factors include the potential impact of the security issue being breached, the categories of risk, and the attack path that the security issue is part of. Learn more about [risk prioritization](risk-prioritization.md).

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

### Defender for Open-Source Relational Databases updates

April 3, 2024

- **Defender for PostgreSQL Flexible Servers post-GA updates** - The update enables customers to enforce protection for existing PostgreSQL flexible servers at the subscription level, allowing complete flexibility to enable protection on a per-resource basis or for automatic protection of all resources at the subscription level.
- **Defender for MySQL Flexible Servers Availability and GA** - Defender for Cloud expanded its support for Azure open-source relational databases by incorporating MySQL Flexible Servers.

This release includes:

- Alert compatibility with existing alerts for Defender for MySQL Single Servers.
- Enablement of individual resources.
- Enablement at the subscription level.
-  Updates for Azure Database for MySQL flexible servers are rolling out over the next few weeks. If you see the error `The server <servername> is not compatible with Advanced Threat Protection`, you can either wait for the update, or open a support ticket to update the server sooner to a supported version.

If you're already protecting your subscription with Defender for open-source relational databases, your flexible server resources are automatically enabled, protected, and billed. Specific billing notifications have been sent via email for affected subscriptions.

Learn more about [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).



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

## March 2024

|Date | Update |
|--|--|
| March 31 | [Windows container images scanning is now generally available (GA)](#windows-container-images-scanning-is-now-generally-available-ga) |
| March 28 | [General Availability of Unified Disk Encryption recommendations](#general-availability-of-unified-disk-encryption-recommendations)<br/><br/> Estimated deprecation: April 30, 2024 |
| March 25 | [Continuous export now includes attack path data](#continuous-export-now-includes-attack-path-data) |
| March 21 | [Agentless scanning supports CMK encrypted VMs in Azure (preview)](#agentless-scanning-supports-cmk-encrypted-vms-in-azure) |

| March 13 | [ServiceNow integration is now generally available (GA)](#servicenow-integration-is-now-generally-available-ga) |
| March 13 | [Critical assets protection in Microsoft Defender for Cloud (Preview)](#critical-assets-protection-in-microsoft-defender-for-cloud-preview) |

| March 6 | [(Preview) Compliance standards added to compliance dashboard](#preview-compliance-standards-added-to-compliance-dashboard)  |
| March 6 | **Upcoming**: [Defender for open-source relational databases updates](#upcoming:-defender-for-open-source-relational-databases-updates)<br/><br/> **Expected**: April, 2024 |
| March 3 | **Upcoming**: [Changes in where you access Compliance offerings and Microsoft Actions](#upcoming:-changes-in-where-you-access-compliance-offerings-and-microsoft-actions)<br/><br/> **Expected**: September 2025 |
| March 3 | [Defender for Cloud Containers Vulnerability Assessment powered by Qualys retirement](#defender-for-cloud-containers-vulnerability-assessment-powered-by-qualys-retirement) |
| March 3 | [Changes in where you access Compliance offerings and Microsoft Actions](#changes-in-where-you-access-compliance-offerings-and-microsoft-actions)<br/><br/> Estimated deprecation: September 30, 2025 |

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
| February 5 | [Decommissioning of Microsoft.SecurityDevOps resource provider](#decommissioning-of-microsoftsecuritydevops-resource-provider)<br/><br/> Estimated deprecation: March 6, 2024 |



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


## Next steps

For past changes to Defender for Cloud, see [Archive for what's new in Defender for Cloud?](release-notes-archive.md).
