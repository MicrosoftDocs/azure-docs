---
title: Release notes
description: This page is updated frequently with the latest updates in Defender for Cloud.
ms.topic: overview
ms.date: 03/18/2024
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

## March 2024

|Date | Update |
|--|--|
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

### Agentless scanning supports CMK encrypted VMs in Azure

March 21 2024

Until now agentless scanning covered CMK encrypted VMs in AWS and GCP. With this release we are completing support for Azure as well. The capability employs a unique scanning approach for CMK in Azure:
- Defender for Cloud does not handle the key or decryption process. Key handling and decryption is seamlessly handled by Azure Compute and is transparent to Defender for Cloud's agentless scanning service.
- The unencrypted VM disk data is never copied or re-encrypted with another key.
- The original key is not replicated during the process. Purging it eradicates the data on both your production VM and Defender for Cloud’s temporary snapshot.

During public preview this capability is not automatically enabled. If you are using Defender for Servers P2 or Defender CSPM and your environment has VMs with CMK encrypted disks, you can now have them scanned for vulnerabilities, secrets and malware following these [enablement steps](enable-agentless-scanning-vms.md#agentless-vulnerability-assessment-on-azure).

- [Learn more on agentless scanning for VMs](concept-agentless-data-collection.md)
- [Learn more on agentless scanning permissions](faq-permissions.yml#which-permissions-are-used-by-agentless-scanning-)


### New endpoint detection and response recommendations

March 18 2024

We are announcing new endpoint detection and response recommendations that discover and assesses the configuration of supported endpoint detection and response solutions. If issues are found, these recommendations offer remediation steps. 

The following new agentless endpoint protection recommendations are now available if you have Defender for Servers Plan 2 or the Defender CSPM plan enabled on your subscription with the agentless machine scanning feature enabled. The recommendations support Azure and multicloud machines. On-premises machines are not supported. 

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

Learn how to [prepare for the new endpoint detection recommendation experience](prepare-deprecation-log-analytics-mma-agent.md#endpoint-protection-recommendations-experience).

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

Based on customer feedback, we've added the following compliance standards in preview to our compliance dashboard. As shown, these are for reviewing the compliance status of AWS and GCP resources protected by Defender for Cloud.

| Compliance standard                                   | Version    | AWS                             | GCP                             |
| ----------------------------------------------------- | ---------- | ------------------------------- | ------------------------------- |
| AWS Well-Architected Framework                        | N/A        | :white_check_mark:              | :x:                             |
| Brazilian General Personal Data Protection Law (LGPD) | 53/2018    | :white_check_mark:              | :white_check_mark:              |
| California Consumer Privacy Act (CCPA)                | 2018       | :white_check_mark:              | :white_check_mark:              |
| CIS Controls                                          | v8         | :x:                             | :white_check_mark:              |
| CIS Google Cloud Platform Foundation Benchmark        | v2.0.0     | :x:                             | :white_check_mark:              |
| CIS Google Kubernetes Engine (GKE) Benchmark          | v1.5.0     | :x:                             | :white_check_mark:              |
| CPS 234 (APRA)                                        | 2019       | :x:                             | :white_check_mark:              |
| CRI Profile                                           | v1.2.1     | :white_check_mark:              | :white_check_mark:              |
| CSA Cloud Controls Matrix (CCM)                       | v4.0.10    | :white_check_mark:              | :white_check_mark:              |
| Cybersecurity Maturity Model Certification (CMMC)     | v2.0       | :x:                             | :white_check_mark:              |
| FFIEC Cybersecurity Assessment Tool (CAT)             | 2017       | :x:                             | :white_check_mark:              |
| GDPR                                                  | 2016/679   | :white_check_mark:              | :white_check_mark:              |
| ISO/IEC 27001                                         | 27001:2022 | :white_check_mark:              | :white_check_mark: **(Update)** |
| ISO/IEC 27002                                         | 27002:2022 | :white_check_mark:              | :white_check_mark:              |
| ISO/IEC 27017                                         | 27017:2015 | :x:                             | :white_check_mark:              |
| NIST Cybersecurity Framework (CSF)                    | v1.1       | :white_check_mark:              | :white_check_mark:              |
| NIST SP 800-171                                       | Revision 2 | :x:                             | :white_check_mark:              |
| NIST SP 800-172                                       | 2021       | :white_check_mark:              | :white_check_mark:              |
| PCI-DSS                                               | v4.0.0     | :white_check_mark: **(Update)** | :white_check_mark: **(Update)** |
| Sarbanes Oxley Act (SOX)                              | 2002       | :x:                             | :white_check_mark:              |
| SOC 2                                                 | 2017       | :x:                             | :white_check_mark:              |

We are continuously working on adding and updating new standards for Azure, AWS, and GCP environments.

Learn how to [assign a security standard](update-regulatory-compliance-packages.md).

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
| February 28 | [Updated security policy management expands support to AWS and GCP](#updated-security-policy-management-expands-support-to-aws-and-gcp) |
| February 26 | [Cloud support for Defender for Containers](#cloud-support-for-defender-for-containers) |
| February 20 | [New version of Defender sensor for Defender for Containers](#new-version-of-defender-sensor-for-defender-for-containers) |
| February 18| [Open Container Initiative (OCI) image format specification support](#open-container-initiative-oci-image-format-specification-support) |
| February 13 | [AWS container vulnerability assessment powered by Trivy retired](#aws-container-vulnerability-assessment-powered-by-trivy-retired) |
| February 8 | [Recommendations released for preview: four recommendations for Azure Stack HCI resource type](#recommendations-released-for-preview-four-recommendations-for-azure-stack-hci-resource-type) |

### Updated security policy management expands support to AWS and GCP

February 28, 2024

The updated experience for managing security policies, initially released in Preview for Azure, is expanding its support to cross cloud (AWS and GCP) environments. This Preview release includes:

- Managing [regulatory compliance standards](update-regulatory-compliance-packages.md) in Defender for Cloud across Azure, AWS, and GCP environments.
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

## November 2023

| Date | Update |
|--|--|
| November 30 | [Four alerts are deprecated](#four-alerts-are-deprecated) |
| November 27 | [General availability of agentless secrets scanning in Defender for Servers and Defender CSPM](#general-availability-of-agentless-secrets-scanning-in-defender-for-servers-and-defender-cspm) |
| November 22 | [Enable permissions management with Defender for Cloud (Preview)](#enable-permissions-management-with-defender-for-cloud-preview) |
| November 22 | [Defender for Cloud integration with ServiceNow](#defender-for-cloud-integration-with-servicenow) |
| November 20 | [General Availability of the autoprovisioning process for SQL Servers on machines plan](#general-availability-of-the-autoprovisioning-process-for-sql-servers-on-machines-plan)|
| November 15 | [General availability of Defender for APIs](#general-availability-of-defender-for-apis) |
| November 15 | [Defender for Cloud is now integrated with Microsoft 365 Defender (Preview)](#defender-for-cloud-is-now-integrated-with-microsoft-365-defender-preview) |
| November 15 | [General availability of Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM) in Defender for Containers and Defender for Container Registries](#general-availability-of-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-mdvm-in-defender-for-containers-and-defender-for-container-registries) |
| November 15 | [Change to Container Vulnerability Assessments recommendation names](#change-to-container-vulnerability-assessments-recommendation-names) |
| November 15 | [Risk prioritization is now available for recommendations](#risk-prioritization-is-now-available-for-recommendations) |
| November 15 | [Attack path analysis new engine and extensive enhancements](#attack-path-analysis-new-engine-and-extensive-enhancements) |
| November 15 | [Changes to Attack Path's Azure Resource Graph table scheme](#changes-to-attack-paths-azure-resource-graph-table-scheme) |
| November 15 | [General Availability release of GCP support in Defender CSPM](#general-availability-release-of-gcp-support-in-defender-cspm) |
| November 15 | [General Availability release of Data security dashboard](#general-availability-release-of-data-security-dashboard) |
| November 15 | [General Availability release of sensitive data discovery for databases](#general-availability-release-of-sensitive-data-discovery-for-databases) |
| November 6 | [New version of the recommendation to find missing system updates is now GA](#new-version-of-the-recommendation-to-find-missing-system-updates-is-now-ga) |

### Four alerts are deprecated

November 30, 2023

As part of our quality improvement process, the following security alerts are deprecated:

- `Possible data exfiltration detected (K8S.NODE_DataEgressArtifacts)`
- `Executable found running from a suspicious location (K8S.NODE_SuspectExecutablePath)`
- `Suspicious process termination burst (VM_TaskkillBurst)`
- `PsExec execution detected (VM_RunByPsExec)`

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

As part of this change, the following recommendations were released for GA and renamed, and are now included in the secure score calculation:

|Current recommendation name|New recommendation name|Description|Assessment key|
|--|--|--|--|
|Container registry images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)|Azure registry container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)|Container image vulnerability assessments scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. Resolving vulnerabilities can greatly improve your security posture, ensuring images are safe to use prior to deployment. |c0b7cfc6-3172-465a-b378-53c7ff2cc0d5|
|Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)|Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management|Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. This recommendation provides visibility to vulnerable images currently running in your Kubernetes clusters. Remediating vulnerabilities in container images that are currently running is key to improving your security posture, significantly reducing the attack surface for your containerized workloads.|c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5|

Container image scan powered by MDVM now also incur charges as per [plan pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing).  

> [!NOTE]
> Images scanned both by our container VA offering powered by Qualys and Container VA offering powered by MDVM, will only be billed once.

The below Qualys recommendations for Containers Vulnerability Assessment were renamed and will continue to be available for customers that enabled Defender for Containers on any of their subscriptions prior to November 15. New customers onboarding Defender for Containers after November 15, will only see the new Container vulnerability assessment recommendations powered by Microsoft Defender Vulnerability Management.

|Current recommendation name|New recommendation name|Description|Assessment key|
|--|--|--|--|
|Container registry images should have vulnerability findings resolved (powered by Qualys)|Azure registry container images should have vulnerabilities resolved (powered by Qualys)|Container image vulnerability assessment scans your registry for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. |dbd0cb49-b563-45e7-9724-889e799fa648|
|Running container images should have vulnerability findings resolved (powered by Qualys)|Azure running container images should have vulnerabilities resolved - (powered by Qualys)|Container image vulnerability assessment scans container images running on your Kubernetes clusters for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks.|41503391-efa5-47ee-9282-4eff6131462c|

### Change to Container Vulnerability Assessments recommendation names

The following Container Vulnerability Assessments recommendations were renamed:

|Current recommendation name|New recommendation name|Description|Assessment key|
|--|--|--|--|
|Container registry images should have vulnerability findings resolved (powered by Qualys)|Azure registry container images should have vulnerabilities resolved (powered by Qualys)|Container image vulnerability assessment scans your registry for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. |dbd0cb49-b563-45e7-9724-889e799fa648|
|Running container images should have vulnerability findings resolved (powered by Qualys)|Azure running container images should have vulnerabilities resolved - (powered by Qualys)|Container image vulnerability assessment scans container images running on your Kubernetes clusters for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks.|41503391-efa5-47ee-9282-4eff6131462c|
|Elastic container registry images should have vulnerability findings resolved|AWS registry container images should have vulnerabilities resolved - (powered by Trivy)|Container image vulnerability assessment scans your registry for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks.|03587042-5d4b-44ff-af42-ae99e3c71c87|

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
| October 30 | [Changing adaptive application control’s security alert's severity](#changing-adaptive-application-controls-security-alerts-severity) |
| October 25 | [Offline Azure API Management revisions removed from Defender for APIs](#offline-azure-api-management-revisions-removed-from-defender-for-apis) |
| October 19 | [DevOps security posture management recommendations available in public preview](#devops-security-posture-management-recommendations-available-in-public-preview) |
| October 18 | [Releasing CIS Azure Foundations Benchmark v2.0.0 in Regulatory Compliance dashboard](#releasing-cis-azure-foundations-benchmark-v200-in-regulatory-compliance-dashboard) |

### Changing adaptive application controls security alert's severity

Announcement date: October 30, 2023

As part of security alert quality improvement process of Defender for Servers, and as part of the [adaptive application controls](adaptive-application-controls.md) feature, the severity of the following security alert is changing to “Informational”:

| Alert [Alert Type] | Alert Description |
|--|--|
| Adaptive application control policy violation was audited.[VM_AdaptiveApplicationControlWindowsViolationAudited, VM_AdaptiveApplicationControlWindowsViolationAudited] | The below users ran applications that are violating the application control policy of your organization on this machine. It can possibly expose the machine to malware or application vulnerabilities.|

To keep viewing this alert in the “Security alerts” page in the Microsoft Defender for Cloud portal, change the default view filter **Severity** to include **informational** alerts in the grid.

   :::image type="content" source="media/release-notes/add-informational-severity.png" alt-text="Screenshot that shows you where to add the informational severity for alerts." lightbox="media/release-notes/add-informational-severity.png":::

### Offline Azure API Management revisions removed from Defender for APIs

October 25, 2023

Defender for APIs updated its support for Azure API Management API revisions. Offline revisions no longer appear in the onboarded Defender for APIs inventory and no longer appear to be onboarded to Defender for APIs. Offline revisions don't allow any traffic to be sent to them and pose no risk from a security perspective.

### DevOps security posture management recommendations available in public preview

October 19, 2023

New DevOps posture management recommendations are now available in public preview for all customers with a connector for Azure DevOps or GitHub. DevOps posture management helps to reduce the attack surface of DevOps environments by uncovering weaknesses in security configurations and access controls. Learn more about [DevOps posture management](concept-devops-environment-posture-management-overview.md).

### Releasing CIS Azure Foundations Benchmark v2.0.0 in regulatory compliance dashboard

October 18, 2023

Microsoft Defender for Cloud now supports the latest [CIS Azure Security Foundations Benchmark - version 2.0.0](https://www.cisecurity.org/benchmark/azure) in the Regulatory Compliance [dashboard](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/22), and a built-in policy initiative in Azure Policy. The release of version 2.0.0 in Microsoft Defender for Cloud is a joint collaborative effort between Microsoft, the Center for Internet Security (CIS), and the user communities. The version 2.0.0 significantly expands assessment scope, which now includes 90+ built-in Azure policies and succeed the prior versions 1.4.0 and 1.3.0 and 1.0 in Microsoft Defender for Cloud and Azure Policy. For more information, you can check out this [blog post](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-cloud-now-supports-cis-azure-security/ba-p/3944860).

## September 2023

|Date |Update  |
|----------|----------|
| September 27 | [Data security dashboard available in public preview](#data-security-dashboard-available-in-public-preview) |
| September 21 | [Preview release: New autoprovisioning process for SQL Server on machines plan](#preview-release-new-autoprovisioning-process-for-sql-server-on-machines-plan) |
| September 20 | [GitHub Advanced Security for Azure DevOps alerts in Defender for Cloud](#github-advanced-security-for-azure-devops-alerts-in-defender-for-cloud) |
| September 11 | [Exempt functionality now available for Defender for APIs recommendations](#exempt-functionality-now-available-for-defender-for-apis-recommendations) |
| September 11 | [Create sample alerts for Defender for APIs detections](#create-sample-alerts-for-defender-for-apis-detections) |
| September 6 | [Preview release: Containers vulnerability assessment powered by Microsoft Defender Vulnerability Management now supports scan on pull](#preview-release-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-now-supports-scan-on-pull)|
| September 6 | [Updated naming format of Center for Internet Security (CIS) standards in regulatory compliance](#updated-naming-format-of-center-for-internet-security-cis-standards-in-regulatory-compliance) |
| September 5 | [Sensitive data discovery for PaaS databases (Preview)](#sensitive-data-discovery-for-paas-databases-preview) |
| September 1 | [General Availability (GA): malware scanning in Defender for Storage](#general-availability-ga-malware-scanning-in-defender-for-storage)|

### Data security dashboard available in public preview

September 27, 2023

The data security dashboard is now available in public preview as part of the Defender CSPM plan.
The data security dashboard is an interactive, data-centric dashboard that illuminates significant risks to sensitive data, prioritizing alerts and potential attack paths for data across hybrid cloud workloads. Learn more about the [data security dashboard](data-aware-security-dashboard-overview.md).

### Preview release: New autoprovisioning process for SQL Server on machines plan

September 21, 2023

Microsoft Monitoring Agent (MMA) is being deprecated in August 2024. Defender for Cloud [updated it's strategy](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation) by replacing MMA with the release of a SQL Server-targeted Azure Monitoring Agent autoprovisioning process.

During the preview, customers who are using the MMA autoprovisioning process with Azure Monitor Agent (Preview) option, are requested to [migrate to the new Azure Monitoring Agent for SQL server on machines (Preview) autoprovisioning process](defender-for-sql-autoprovisioning.md#migrate-to-the-sql-server-targeted-ama-autoprovisioning-process). The migration process is seamless and provides continuous protection for all machines.

For more information, see [Migrate to SQL server-targeted Azure Monitoring Agent autoprovisioning process](defender-for-sql-autoprovisioning.md).

### GitHub Advanced Security for Azure DevOps alerts in Defender for Cloud

September 20, 2023

You can now view GitHub Advanced Security for Azure DevOps (GHAzDO) alerts related to CodeQL, secrets, and dependencies in Defender for Cloud. Results are displayed in the DevOps page and in Recommendations. To see these results, onboard your GHAzDO-enabled repositories to Defender for Cloud.

Learn more about [GitHub Advanced Security for Azure DevOps](https://azure.microsoft.com/products/devops/github-advanced-security).

### Exempt functionality now available for Defender for APIs recommendations

September 11, 2023

You can now exempt recommendations for the following Defender for APIs security recommendations.

| Recommendation | Description & related policy | Severity |
|--|--|--|
| (Preview) API endpoints that are unused should be disabled and removed from the Azure API Management service | As a security best practice, API endpoints that haven't received traffic for 30 days are considered unused, and should be removed from the Azure API Management service. Keeping unused API endpoints might pose a security risk. These might be APIs that should have been deprecated from the Azure API Management service, but have accidentally been left active. Such APIs typically do not receive the most up-to-date security coverage. | Low |
| (Preview) API endpoints in Azure API Management should be authenticated | API endpoints published within Azure API Management should enforce authentication to help minimize security risk. Authentication mechanisms are sometimes implemented incorrectly or are missing. This allows attackers to exploit implementation flaws and to access data. For APIs published in Azure API Management, this recommendation assesses the execution of authentication via the Subscription Keys, JWT, and Client Certificate configured within Azure API Management. If none of these authentication mechanisms are executed during the API call, the API will receive this recommendation. | High |

Learn more about [exempting recommendations in Defender for Cloud](exempt-resource.md).

### Create sample alerts for Defender for APIs detections

September 11, 2023

You can now generate sample alerts for the security detections that were released as part of the Defender for APIs public preview. Learn more about [generating sample alerts in Defender for Cloud](alert-validation.md#generate-sample-security-alerts).

### Preview release: containers vulnerability assessment powered by Microsoft Defender Vulnerability Management now supports scan on pull

September 6, 2023

Containers vulnerability assessment powered by Microsoft Defender Vulnerability Management (MDVM), now supports an additional trigger for scanning images pulled from an ACR. This newly added trigger provides additional coverage for active images in addition to the existing triggers scanning images pushed to an ACR in the last 90 days and images currently running in AKS.

The new trigger will start rolling out today, and is expected to be available to all customers by end of September.

For more information, see [Container Vulnerability Assessment powered by MDVM](agentless-vulnerability-assessment-azure.md)

### Updated naming format of Center for Internet Security (CIS) standards in regulatory compliance

September 6, 2023

The naming format of CIS (Center for Internet Security) foundations benchmarks in the compliance dashboard is changed from `[Cloud] CIS [version number]` to `CIS [Cloud] Foundations v[version number]`. Refer to the following table:

| Current Name | New Name |
|--|--|
| Azure CIS 1.1.0 | CIS Azure Foundations v1.1.0 |
| Azure CIS 1.3.0 | CIS Azure Foundations v1.3.0 |
| Azure CIS 1.4.0 | CIS Azure Foundations v1.4.0 |
| AWS CIS 1.2.0 | CIS AWS Foundations v1.2.0 |
| AWS CIS 1.5.0 | CIS AWS Foundations v1.5.0 |
| GCP CIS 1.1.0 | CIS GCP Foundations v1.1.0 |
| GCP CIS 1.2.0 | CIS GCP Foundations v1.2.0 |

Learn how to [improve your regulatory compliance](regulatory-compliance-dashboard.md).

### Sensitive data discovery for PaaS databases (Preview)

September 5, 2023

Data-aware security posture capabilities for frictionless sensitive data discovery for PaaS Databases (Azure SQL Databases and Amazon RDS Instances of any type) are now in public preview. This public preview allows you to create a map of your critical data wherever it resides, and the type of data that is found in those databases.

Sensitive data discovery for Azure and AWS databases, adds to the shared taxonomy and configuration, which is already publicly available for cloud object storage resources (Azure Blob Storage, AWS S3 buckets and GCP storage buckets) and provides a single configuration and enablement experience.

Databases are scanned on a weekly basis. If you enable `sensitive data discovery`, discovery runs within 24 hours. The results can be viewed in the [Cloud Security Explorer](how-to-manage-cloud-security-explorer.md) or by reviewing the new [attack paths](how-to-manage-attack-path.md) for managed databases with sensitive data.

Data-aware security posture for databases is available through the [Defender CSPM plan](tutorial-enable-cspm-plan.md), and is automatically enabled on subscriptions where `sensitive data discovery` option is enabled.

You can learn more about data aware security posture in the following articles:

- [Support and prerequisites for data-aware security posture](concept-data-security-posture-prepare.md)
- [Enable data-aware security posture](data-security-posture-enable.md)
- [Explore risks to sensitive data](data-security-review-risks.md)

### General Availability (GA): malware scanning in Defender for Storage

September 1, 2023

Malware scanning is now generally available (GA) as an add-on to Defender for Storage. Malware scanning in Defender for Storage helps protect your storage accounts from malicious content by performing a full malware scan on uploaded content in near real time, using Microsoft Defender Antivirus capabilities. It's designed to help fulfill security and compliance requirements for handling untrusted content. The malware scanning capability is an agentless SaaS solution that allows setup at scale, and supports automating response at scale.

Learn more about [malware scanning in Defender for Storage](defender-for-storage-malware-scan.md).

Malware scanning is priced according to your data usage and budget. Billing begins on September 3, 2023. Visit the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) for more information.

If you're using the previous plan (now renamed "Microsoft Defender for Storage (classic)"), you need to proactively [migrate to the new plan](defender-for-storage-classic-migrate.md) in order to enable malware scanning.

Read the [Microsoft Defender for Cloud announcement blog post](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/malware-scanning-for-cloud-storage-ga-pre-announcement-prevent/ba-p/3884470).

## August 2023

Updates in August include:

|Date |Update  |
|----------|----------|
| August 30 | [Defender For Containers: Agentless Discovery for Kubernetes](#defender-for-containers-agentless-discovery-for-kubernetes)|
| August 22 | [Recommendation release: Microsoft Defender for Storage should be enabled with malware scanning and sensitive data threat detection](#recommendation-release-microsoft-defender-for-storage-should-be-enabled-with-malware-scanning-and-sensitive-data-threat-detection) |
| August 17 | [Extended properties in Defender for Cloud security alerts are masked from activity logs](#extended-properties-in-defender-for-cloud-security-alerts-are-masked-from-activity-logs) |
| August 15 | [Preview release of GCP support in Defender CSPM](#preview-release-of-gcp-support-in-defender-cspm)|
| August 7 | [New security alerts in Defender for Servers Plan 2: Detecting potential attacks abusing Azure virtual machine extensions](#new-security-alerts-in-defender-for-servers-plan-2-detecting-potential-attacks-abusing-azure-virtual-machine-extensions) |
| August 1 | [Business model and pricing updates for Defender for Cloud plans](#business-model-and-pricing-updates-for-defender-for-cloud-plans) |

### Defender For Containers: Agentless discovery for Kubernetes

August 30, 2023

We're excited to introduce to Defender For Containers: Agentless discovery for Kubernetes. This release marks a significant step forward in container security, empowering you with advanced insights and comprehensive inventory capabilities for Kubernetes environments. The new container offering is powered by the Defender for Cloud contextual security graph.  Here's what you can expect from this latest update:

- Agentless Kubernetes discovery
- Comprehensive inventory capabilities
- Kubernetes-specific security insights
- Enhanced risk hunting with Cloud Security Explorer

Agentless discovery for Kubernetes is now available to all Defender For Containers customers. You can start using these advanced capabilities today. We encourage you to update your subscriptions to have the full set of extensions enabled, and benefit from the latest additions and features. Visit the **Environment and settings** pane of your Defender for Containers subscription to enable the extension.

> [!NOTE]
> Enabling the latest additions won't incur new costs to active Defender for Containers customers.

For more information, see [Overview of Container security Microsoft Defender for Containers](defender-for-containers-introduction.md).

### Recommendation release: Microsoft Defender for Storage should be enabled with malware scanning and sensitive data threat detection

August 22, 2023

A new recommendation in Defender for Storage has been released. This recommendation ensures that Defender for Storage is enabled at the subscription level with malware scanning and sensitive data threat detection capabilities.

| Recommendation | Description  |
|--|--|
| Microsoft Defender for Storage should be enabled with malware scanning and sensitive data threat detection | Microsoft Defender for Storage detects potential threats to your storage accounts. It helps prevent the three major impacts on your data and workload: malicious file uploads, sensitive data exfiltration, and data corruption. The new Defender for Storage plan includes malware scanning and sensitive data threat detection. This plan also provides a predictable pricing structure (per storage account) for control over coverage and costs. With a simple agentless setup at scale, when enabled at the subscription level, all existing and newly created storage accounts under that subscription will be automatically protected. You can also exclude specific storage accounts from protected subscriptions.|

This new recommendation replaces the current recommendation `Microsoft Defender for Storage should be enabled` (assessment key 1be22853-8ed1-4005-9907-ddad64cb1417). However, this recommendation will still be available in Azure Government clouds.

Learn more about [Microsoft Defender for Storage](defender-for-storage-introduction.md).

### Extended properties in Defender for Cloud security alerts are masked from activity logs

August 17, 2023

We recently changed the way security alerts and activity logs are integrated. To better protect sensitive customer information, we no longer include this information in activity logs. Instead, we mask it with asterisks. However, this information is still available through the alerts API, continuous export, and the Defender for Cloud portal.

Customers who rely on activity logs to export alerts to their SIEM solutions should consider using a different solution, as it isn't the recommended method for exporting Defender for Cloud security alerts.

For instructions on how to export Defender for Cloud security alerts to SIEM, SOAR and other third party applications, see [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md).

### Preview release of GCP support in Defender CSPM

August 15, 2023

We're announcing the preview release of the Defender CSPM contextual cloud security graph and attack path analysis with support for GCP resources. You can apply the power of Defender CSPM for comprehensive visibility and intelligent cloud security across GCP resources.

 Key features of our GCP support include:

- **Attack path analysis** - Understand the potential routes attackers might take.
- **Cloud security explorer** - Proactively identify security risks by running graph-based queries on the security graph.
- **Agentless scanning** - Scan servers and identify secrets and vulnerabilities without installing an agent.
- **Data-aware security posture** - Discover and remediate risks to sensitive data in Google Cloud Storage buckets.

Learn more about [Defender CSPM plan options](concept-cloud-security-posture-management.md).

### New security alerts in Defender for Servers Plan 2: Detecting potential attacks abusing Azure virtual machine extensions

August 7, 2023

This new series of alerts focuses on detecting suspicious activities of Azure virtual machine extensions and provides insights into attackers' attempts to compromise and perform malicious activities on your virtual machines.

Microsoft Defender for Servers can now detect suspicious activity of the virtual machine extensions, allowing you to get better coverage of the workloads security.  

Azure virtual machine extensions are small applications that run post-deployment on virtual machines and provide capabilities such as configuration, automation, monitoring, security, and more. While extensions are a powerful tool, they can be used by threat actors for various malicious intents, for example:

- Data collection and monitoring
- Code execution and configuration deployment with high privileges
- Resetting credentials and creating administrative users
- Encrypting disks

Here's a table of the new alerts.

|Alert (alert type)|Description|MITRE tactics|Severity|
|----|----|----|----|
| **Suspicious failure installing GPU extension in your subscription (Preview)**<br>(VM_GPUExtensionSuspiciousFailure) | Suspicious intent of installing a GPU extension on unsupported VMs. This extension should be installed on virtual machines equipped with a graphic processor, and in this case the virtual machines aren't equipped with such. These failures can be seen when malicious adversaries execute multiple installations of such extension for crypto-mining purposes. | Impact | Medium |
| **Suspicious installation of a GPU extension was detected on your virtual machine (Preview)**<br>(VM_GPUDriverExtensionUnusualExecution)<br>*This alert was [released in July  2023](release-notes-archive.md#new-security-alert-in-defender-for-servers-plan-2-detecting-potential-attacks-leveraging-azure-vm-gpu-driver-extensions).* | Suspicious installation of a GPU extension was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the GPU driver extension to install GPU drivers on your virtual machine via the Azure Resource Manager to perform cryptojacking. This activity is deemed suspicious as the principal's behavior departs from its usual patterns. | Impact | Low |
| **Run Command with a suspicious script was detected on your virtual machine (Preview)**<br>(VM_RunCommandSuspiciousScript) | A Run Command with a suspicious script was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use Run Command to execute malicious code with high privileges on your virtual machine via the Azure Resource Manager. The script is deemed suspicious as certain parts were identified as being potentially malicious. | Execution | High |
| **Suspicious unauthorized Run Command usage was detected on your virtual machine (Preview)**<br>(VM_RunCommandSuspiciousFailure) | Suspicious unauthorized usage of Run Command has failed and was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might attempt to use Run Command to execute malicious code with high privileges on your virtual machines via the Azure Resource Manager. This activity is deemed suspicious as it hasn't been commonly seen before. | Execution | Medium |
| **Suspicious Run Command usage was detected on your virtual machine (Preview)**<br>(VM_RunCommandSuspiciousUsage) | Suspicious usage of Run Command was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use Run Command to execute malicious code with high privileges on your virtual machines via the Azure Resource Manager. This activity is deemed suspicious as it hasn't been commonly seen before. | Execution | Low |
| **Suspicious usage of multiple monitoring or data collection extensions was detected on your virtual machines (Preview)**<br>(VM_SuspiciousMultiExtensionUsage) | Suspicious usage of multiple monitoring or data collection extensions was detected on your virtual machines by analyzing the Azure Resource Manager operations in your subscription. Attackers might abuse such extensions for data collection, network traffic monitoring, and more, in your subscription. This usage is deemed suspicious as it hasn't been commonly seen before. | Reconnaissance | Medium |
| **Suspicious installation of disk encryption extensions was detected on your virtual machines (Preview)**<br>(VM_DiskEncryptionSuspiciousUsage) | Suspicious installation of disk encryption extensions was detected on your virtual machines by analyzing the Azure Resource Manager operations in your subscription. Attackers might abuse the disk encryption extension to deploy full disk encryptions on your virtual machines via the Azure Resource Manager in an attempt to perform ransomware activity. This activity is deemed suspicious as it hasn't been commonly seen before and due to the high number of extension installations. | Impact | Medium |
| **Suspicious usage of VM Access extension was detected on your virtual machines (Preview)**<br>(VM_VMAccessSuspiciousUsage) | Suspicious usage of VM Access extension was detected on your virtual machines. Attackers might abuse the VM Access extension to gain access and compromise your virtual machines with high privileges by resetting access or managing administrative users. This activity is deemed suspicious as the principal's behavior departs from its usual patterns, and due to the high number of the extension installations. | Persistence | Medium |
| **Desired State Configuration (DSC) extension with a suspicious script was detected on your virtual machine (Preview)**<br>(VM_DSCExtensionSuspiciousScript) | Desired State Configuration (DSC) extension with a suspicious script was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the Desired State Configuration (DSC) extension to deploy malicious configurations, such as persistence mechanisms, malicious scripts, and more, with high privileges, on your virtual machines. The script is deemed suspicious as certain parts were identified as being potentially malicious. | Execution | High |
| **Suspicious usage of a Desired State Configuration (DSC) extension was detected on your virtual machines (Preview)**<br>(VM_DSCExtensionSuspiciousUsage) | Suspicious usage of a Desired State Configuration (DSC) extension was detected on your virtual machines by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the Desired State Configuration (DSC) extension to deploy malicious configurations, such as persistence mechanisms, malicious scripts, and more, with high privileges, on your virtual machines. This activity is deemed suspicious as the principal's behavior departs from its usual patterns, and due to the high number of the extension installations. | Impact | Low |
| **Custom script extension with a suspicious script was detected on your virtual machine (Preview)**<br>(VM_CustomScriptExtensionSuspiciousCmd)<br>*(This alert already exists and has been improved with more enhanced logic and detection methods.)* | Custom script extension with a suspicious script was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use Custom script extension to execute malicious code with high privileges on your virtual machine via the Azure Resource Manager. The script is deemed suspicious as certain parts were identified as being potentially malicious. | Execution | High |

 See the [extension-based alerts in Defender for Servers](alerts-reference.md#alerts-for-azure-vm-extensions).

For a complete list of alerts, see the [reference table for all security alerts in Microsoft Defender for Cloud](alerts-reference.md).

### Business model and pricing updates for Defender for Cloud plans

August 1, 2023

Microsoft Defender for Cloud has three plans that offer service layer protection:

- Defender for Key Vault

- Defender for Resource Manager
- Defender for DNS

These plans have transitioned to a new business model with different pricing and packaging to address customer feedback regarding spending predictability and simplifying the overall cost structure.

**Business model and pricing changes summary**:

Existing customers of Defender for Key-Vault, Defender for Resource Manager, and Defender for DNS keep their current business model and pricing unless they actively choose to switch to the new business model and price.

- **Defender for Resource Manager**: This plan has a fixed price per subscription per month. Customers can switch to the new business model by selecting the Defender for Resource Manager new per subscription model.

Existing customers of Defender for Key-Vault, Defender for Resource Manager, and Defender for DNS keep their current business model and pricing unless they actively choose to switch to the new business model and price.

- **Defender for Resource Manager**: This plan has a fixed price per subscription per month. Customers can switch to the new business model by selecting the Defender for Resource Manager new per subscription model.
- **Defender for Key Vault**: This plan has a fixed price per vault, per month with no overage charge. Customers can switch to the new business model by selecting the Defender for Key Vault new per vault model
- **Defender for DNS**: Defender for Servers Plan 2 customers gain access to Defender for DNS value as part of Defender for Servers Plan 2 at no extra cost. Customers that have both Defender for Server Plan 2 and Defender for DNS are no longer charged for Defender for DNS. Defender for DNS is no longer available as a standalone plan.

Learn more about the pricing for these plans in the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h).

## Next steps

For past changes to Defender for Cloud, see [Archive for what's new in Defender for Cloud?](release-notes-archive.md).
