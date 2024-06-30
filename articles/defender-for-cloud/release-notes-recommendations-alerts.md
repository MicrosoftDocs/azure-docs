---
title: New and upcoming changes in Defender for Cloud recommendations and alerts
description: Get release notes for new and upcoming changes in recommendations and alerts in Microsoft Defender for Cloud. 
ms.topic: overview
ms.date: 03/18/2024
#customer intent: As a Defender for Cloud admin, I want to stay up to date on the latest new and changed security recommendations and alerts.
---

# Release notes for recommendations and alerts in Defender for Cloud

Microsoft Defender for Cloud is in active development and receives improvements on an ongoing basis.

This article provides information about new and modified security recommendations and alerts.

- Find the latest information about new and updated Defender for Cloud features in thee [feature release notes](release-notes.md) article.
- If you're looking for items older than six months, you can find them in the [release notes archive](release-notes-archive.md).
- Review a reference list of all [security recommendations](recommendations-reference.md) and [alerts](alerts-reference.md).
- Review [deprecated security recommendations](recommendations-reference-deprecated.md).

## Recommendations and alert updates

New and updated recommendations and alerts are added to the table in date order.

<!-- 1. Add new recommendations and alerts to the table.-->
<!-- 2. Include the date of the change or release of new item.-->
<!-- 3. If you're adding a new recommendation here, make sure you also add it to the recommendations reference page-->
<!-- 4. If you're adding a new alert here, make sure you also add it to the recommendations reference page-->
<!-- 5. You can optionally add a short sentence with additional details in the details column. The details column shouldn't include a description of the recommendation or its severity. that information belongs in the recommendations reference article-->

### New DevOps security recommendations

June 28, 2024

We're announcing DevOps security recommendations that improve the security posture of Azure DevOps and GitHub environments. If issues are found, these recommendations offer remediation steps.

The following new recommendations are supported if you have connected Azure DevOps or GitHub to Microsoft Defender for Cloud. All recommendations are included in Foundational Cloud Security Posture Management. 



**Date** | **Type** | **Name** | **Details**
--- | --- | --- | --- 
June 28 | New recommendation GA | [Azure DevOps repositories should require minimum two-reviewer approval for code pushes](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/470742ea-324a-406c-b91f-fc1da6a27c0c) |
June 28 | New recommendation GA | [Azure DevOps repositories should not allow requestors to approve their own Pull Requests](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/98b5895a-0ad8-4ed9-8c9d-d654f5bda816) | 
June 28 | New recommendation GA | [GitHub organizations should not make action secrets accessible to all repositories](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6331fad3-a7a2-497d-b616-52672057e0f3) | 
June 27 | Deprecated alert | **Security incident detected suspicious source IP activity** | 
June 27 | Deprecated alert | **Security incident detected on multiple resources** |
June 27 | Deprecated alert | **Security incident detected compromised machine** 
June 27 | Deprecated alert |  **Security incident detected suspicious virtual machines activity** | T
May 30 | New recommendation GA |  [Linux virtual machines should enable Azure Disk Encryption (ADE) or EncryptionAtHost](recommendations-reference-compute.md#edr-solution-should-be-installed-on-virtual-machines) | This description, and [Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost](recommendations-reference-compute.md#windows-virtual-machines-should-enable-azure-disk-encryption-or-encryptionathost) replace [Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](recommendations-reference.md#virtual-machines-should-encrypt-temp-disks-caches-and-data-flows-between-compute-and-storage-resources).
May 30 | New recommendation GA |  [Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost](recommendations-reference-compute.md#edr-solution-should-be-installed-on-virtual-machines) | This description, and [Linux vitual machines should enable Azure Disk Encryption (ADE) or EncryptionAtHost](recommendations-reference-compute.md#edr-solution-should-be-installed-on-virtual-machines) replace [Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](recommendations-reference-compute.md#virtual-machines-should-encrypt-temp-disks-caches-and-data-flows-between-compute-and-storage-resources).
May 28 | New recommendation  GA| [Machine should be configured securely (powered by MDVM)](recommendations-reference.md#virtual-machines-should-encrypt-temp-disks-caches-and-data-flows-between-compute-and-storage-resources) |The new recommendation **Machine should be configured securely (powered by MDVM)** helps you secure your servers by providing recommendations that improve your security posture. | Defender for Cloud enhances the Center for Internet Security (CIS) benchmarks by providing security baselines that are powered by Microsoft Defender Vulnerability Management (MDVM). [Learn more](remediate-security-baseline.md). | Learn more about [risk-based recommendation prioritization](risk-prioritization.md).
April 3 | New recommendation preview | [Container images in Azure registry should have vulnerability findings resolved (Preview)](recommendations-reference-container.md#preview-container-images-in-azure-registry-should-have-vulnerability-findings-resolved) | Recommendation [Azure registry container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/33422d8f-ab1e-42be-bc9a-38685bb567b9recommendations-reference-container.md#preview-containers-running-in-gcp-should-have-vulnerability-findings-resolved) will be removed when the new recommendation is generally available.
April 3 | New recommendation preview| [Containers running in Azure should have vulnerability findings resolved (Preview)](recommendations-reference-container.md#preview-containers-running-in-azure-should-have-vulnerability-findings-resolved) | Recommendation [Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5) will be removed when the new recommendation is generally available.
April 3 | New recommendation preview| [Container images in AWS registry should have vulnerability findings resolved (Preview)]
(recommendations-reference-container.md#preview-container-images-in-aws-registry-should-have-vulnerability-findings-resolved) | Recommendation [AWS registry container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/AwsContainerRegistryRecommendationDetailsBlade/assessmentKey/c27441ae-775c-45be-8ffa-655de37362ce) will be removed by the new recommendation is generally available.
April 3 | New recommendation preview | [Containers running in AWS should have vulnerability findings resolved (Preview)](recommendations-reference-aws.md#preview-containers-running-in-aws-should-have-vulnerability-findings-resolved) | Recommendation [AWS running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/AwsContainersRuntimeRecommendationDetailsBlade/assessmentKey/682b2595-d045-4cff-b5aa-46624eb2dd8f) will be removed when the new recommendation is generally available.
April 3 | New recommendation preview | [Container images in GCP registry should have vulnerability findings resolved (Preview)](recommendations-reference-container.md#preview-container-images-in-gcp-registry-should-have-vulnerability-findings-resolved) | Recommendation [GCP registry container images should have vulnerability findings resolved (powered by Microsoft Defender vulnerability Management](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/GcpContainerRegistryRecommendationDetailsBlade/assessmentKey/5cc3a2c1-8397-456f-8792-fe9d0d4c9145) will be removed when the new recommendation is generally available.
April 3 | New recommendation preview | [Containers running in GCP should have vulnerability findings resolved (Preview)](recommendations-reference-container.md#preview-containers-running-in-gcp-should-have-vulnerability-findings-resolved) | Recommendation [GCP running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/GcpContainersRuntimeRecommendationDetailsBlade/assessmentKey/e538731a-80c8-4317-a119-13075e002516) will be removed when the new recommendation is generally available.
April 2 | Update recommendation | [Azure AI Services should restrict network access](recommendations-reference-ai.md#azure-ai-services-resources-should-restrict-network-access). | This recommendation replaces the old recommendation *Cognitive Services accounts should restrict network access*. It was formerly in category Cognitive Services and Cognitive Search, and was updated to comply with the Azure AI Services naming format and align with the relevant resources. 
April 2 | Updated recommendation | [Azure AI Services should have key access disabled (disable local authentication)](recommendations-reference-ai.md#azure-ai-services-resources-should-have-key-access-disabled-disable-local-authentication). | This recommendation replaces the old recommendation *Cognitive Services accounts should have local authentication methods disabled*. It was formerly in category Cognitive Services and Cognitive Search, and was updated to comply with the Azure AI Services naming format and align with the relevant resources. New name: .
April 2 | Updated recommendation | [Diagnostic logs in Azure AI services resources should be enabled](recommendations-reference-ai.md#diagnostic-logs-in-azure-ai-services-resources-should-be-enabled). | This recommendation replaces the old recommendation *Diagnostic logs in Search services should be enabled*. It was formerly in the category Cognitive Services and Cognitive Search, and was updated to comply with the Azure AI Services naming format and align with the relevant resources. 
April 2 | Deprecated recommendation | *Public network access should be disabled for Cognitivie Services accounts*. | The related policy definition Cognitive Services accounts should disable public network access has been removed from the regulatory compliance dashboard. This recommendation is covered by existing recommendation *Cognitive Services accounts should restrict network access* (now replaced with *Azure AI Services should restrict network access*.)
April 2 | New recommendation GA  | [Azure registry container images should have vulnerabilities resolved](recommendations-reference-container.md#azure-registry-container-images-should-have-vulnerabilities-resolved-powered-by-microsoft-defender-vulnerability-management) |
April 2 | New recommendation GA | [Azure running container images should have vulnerabilities resolved](recommendations-reference-container.md#azure-running-container-images-should-have-vulnerabilities-resolved-powered-by-microsoft-defender-vulnerability-management) |
April 2 | New recommendation GA | [AWS registry container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](recommendations-reference-container.md#preview-container-images-in-aws-registry-should-have-vulnerability-findings-resolved) |
April 2 | New recommendation GA | [AWS running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](recommendations-reference-container.md#preview-containers-running-in-aws-should-have-vulnerability-findings-resolved)|
April 2 | New recommendation GA  | [GCP registry container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](recommendations-reference-container.md#preview-container-images-in-gcp-registry-should-have-vulnerability-findings-resolved)|
April 2 | New recommendation GA | [GCP running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](recommendations-reference-container.md#preview-containers-running-in-gcp-should-have-vulnerability-findings-resolved)|
March 18 | New recommendation |  [EDR solution should be installed on virtual machines](recommendations-reference-compute.md#edr-solution-should-be-installed-on-virtual-machines) | [Learn more](endpoint-detection-response.md) about agentless endpoint protection recommendations.
March 18 | [EDR configuration issues should be resolved on virtual machines](recommendations-reference-compute.md#edr-configuration-issues-should-be-resolved-on-virtual-machines | To protect virtual machines, resolve all identified configuration issues for your endpoint detection and response solutions.<br/><br/> This recommendation currently only applies to resources with Microsoft Defender for Endpointenabled . |
March 18 | New recommendation | [EDR configuration issues should be resolved on EC2s](recommendations-reference-compute.md#edr-configuration-issues-should-be-resolved-on-ec2s) |
March 18 | New recommendation | [EDR solution should be installed on EC2s](recommendations-reference-compute.md#edr-solution-should-be-installed-on-ec2s) |
March 18 | New recommendation | ### [EDR configuration issues should be resolved on GCP virtual machines](recommendations-reference-compute.md#edr-configuration-issues-should-be-resolved-on-gcp-virtual-machines) |
March 18 | New recommendation | [EDR solution should be installed on GCP virtual machines](recommendations-reference-compute.md#edr-solution-should-be-installed-on-gcp-virtual-machines)
End March | Deprecated recommendation  | [Endpoint protection should be installed on machines](recommendations-reference-deprecated.md#endpoint-protection-should-be-installed-on-machines) | MMA/AMA (preview).
End March | Deprecation | [Endpoint protection health issues on machines should be resolved](recommendations-reference-deprecated.md#endpoint-protection-health-issues-on-machines-should-be-resolved) |  MMA/AMA (preview) 
| March 17 | [Custom recommendations based on KQL for Azure is now public preview](#custom-recommendations-based-on-kql-for-azure-is-now-public-preview) |
| March 13 | [Enhanced AWS and GCP recommendations with automated remediation scripts](#enhanced-aws-and-gcp-recommendations-with-automated-remediation-scripts) |
| March 13 | [Inclusion of DevOps recommendations in the Microsoft cloud security benchmark](#inclusion-of-devops-recommendations-in-the-microsoft-cloud-security-benchmark) |
March 5 | Deprecated recommendation | [Over-provisioned identities in accounts should be investigated to reduce the Permission Creep Index (PCI)](recommendations-reference-deprecated.md#over-provisioned-identities-in-accounts-should-be-investigated-to-reduce-the-permission-creep-index-pci) | 
March 5 | Deprecated recommendation | [Over-provisioned identities in subscriptions should be investigated to reduce the Permission Creep Index (PCI)](recommendations-reference-deprecated.md#over-provisioned-identities-in-subscriptions-should-be-investigated-to-reduce-the-permission-creep-index-pci) | 
February 8 | New recommendation | [(Preview) Azure Stack HCI servers should meet secured-core requirements](recommendations-reference-compute.md#preview-azure-stack-hci-servers-should-meet-secured-core-requirements)
February 8 | New recommendation | [(Preview) Azure Stack HCI servers should have consistently enforced application control policies](recommendations-reference.md)| md#preview-azure-stack-hci-servers-should-have-consistently-enforced-application-control-policies)
February 8 | New recommendation | [(Preview) Azure Stack HCI systems should have encrypted volumes](recommendations-reference-compute.md#preview-azure-stack-hci-systems-should-have-encrypted-volumes) | 
February 8 | New recommendation | [(Preview) Host and VM networking should be protected on Azure Stack HCI systems](recommendations-reference-compute.md#preview-host-and-vm-networking-should-be-protected-on-azure-stack-hci-systems) | 
January 25 | Deprecated alert | `Anomalous pod deployment (Preview) (K8S_AnomalousPodDeployment)` | Container alert
January 25 | Deprecated alert | `Excessive role permissions assigned in Kubernetes cluster (Preview) (K8S_ServiceAcountPermissionAnomaly)` | Containers alert
January 25 | Deprecated alert | `Anomalous access to Kubernetes secret (Preview) (K8S_AnomalousSecretAccess)` | Containers alert
January 25 | Updated to Informational  | `Adaptive application control policy violation was audited (VM_AdaptiveApplicationControlWindowsViolationAudited)` | Windows machine alert
January 25 | Updated to Informational | `Adaptive application control policy violation was audited (VM_AdaptiveApplicationControlLinuxViolationAudited)` | Windows machine alert
January 25 | Updated to Informational  | `Attempt to create a new Linux namespace from a container detected (K8S.NODE_NamespaceCreation)` | Containers alert
January 25 | Updated to Informational  | `Attempt to stop apt-daily-upgrade.timer service detected (K8S.NODE_TimerServiceDisabled)` | Containers alert
January 25 | Updated to Informational | `Command within a container running with high privileges (K8S.NODE_PrivilegedExecutionInContainer)` | Containers alert
January 25 | Updated to Informational | `Container running in privileged mode (K8S.NODE_PrivilegedContainerArtifacts)` | Containers alert
January 25 | Updated to Informational | `Container with a sensitive volume mount detected (K8S_SensitiveMount)` | Containers alert
January 25 | Updated to Informational  | `Creation of admission webhook configuration detected (K8S_AdmissionController)` | Containers alert
January 25 | Updated to Informational | `Detected suspicious file download (K8S.NODE_SuspectDownloadArtifacts)` | Containers alert
January 25 | Updated to Informational  | `Docker build operation detected on a Kubernetes node (K8S.NODE_ImageBuildOnNode)` | Containers alert
January 25 | Updated to Informational  | `New container in the kube-system namespace detected (K8S_KubeSystemContainer)` | Containers alert
January 25 | Updated to Informational  | `New high privileges role detected (K8S_HighPrivilegesRole)` | Containers alert
January 25 | Updated to Informational | `Privileged container detected (K8S_PrivilegedContainer)` | Containers alert
January 25 | Updated to Informational | `Process seen accessing the SSH authorized keys file in an unusual way (K8S.NODE_SshKeyAccess)` | Containers alert
January 25 | Updated to Informational  | `Role binding to the cluster-admin role detected (K8S_ClusterAdminBinding)` | Containers alert
January 25 | Updated to Informational | `SSH server is running inside a container (K8S.NODE_ContainerSSH)` | Containers alert
January 25 | Updated to Informational  | `Communication with suspicious algorithmically generated domain (AzureDNS_DomainGenerationAlgorithm)` | DNS alert
January 25 | Updated to Informational |`Communication with suspicious algorithmically generated domain (DNS_DomainGenerationAlgorithm)` | DNS alert
January 25 | Updated to Informational |`Communication with suspicious random domain name (Preview) (DNS_RandomizedDomain)` | DNS alert
January 25 | Updated to Informational |`Communication with suspicious random domain name (AzureDNS_RandomizedDomain)` | DNS alert
January 25 | Updated to Informational  |`Communication with possible phishing domain (AzureDNS_PhishingDomain)` | DNS alert
January 25 | Updated to Informational |`Communication with possible phishing domain (Preview) (DNS_PhishingDomain)` | DNS alert
January 25 | Updated to Informational  |`NMap scanning detected (AppServices_Nmap)` | Azure App Service
January 25 | Updated to Informational  |`Suspicious User Agent detected (AppServices_UserAgentInjection)` | Azure App Service
January 25 | Updated to Informational  |`Possible incoming SMTP brute force attempts detected (Generic_Incoming_BF_OneToOne)` | Azure network layer
January 25 | Updated to Informational |`Traffic detected from IP addresses recommended for blocking (Network_TrafficFromUnrecommendedIP)` | Azure network layer
January 25 | Updated to Informational  |`Privileged custom role created for your subscription in a suspicious way (Preview)(ARM_PrivilegedRoleDefinitionCreation)` | Azure Resource Manager
January 4 | New recommendation | [Cognitive Services accounts should have local authentication methods disabled](recommendations-reference-data.md) | Microsoft Cloud Security Benchmarkmd#cognitive-services-accounts-should-have-local-authentication-methods-disabled) | 
January 4 | New recommendation| [Cognitive Services should use private link](recommendations-reference-data.md#cognitive-services-should-use-private-link) | Microsoft Cloud Security Benchmark
January 4 | New recommendation  | [Virtual machines and virtual machine scale sets should have encryption at host enabled](recommendations-reference-compute.md#virtual-machines-and-virtual-machine-scale-sets-should-have-encryption-at-host-enabled) | Microsoft Cloud Security Benchmark 
January 4 | New recommendation | [Azure Cosmos DB should disable public network access](recommendations-reference-data.md#azure-cosmos-db-should-disable-public-network-access) | Microsoft Cloud Security Benchmark | 
January 4 | New recommendation | [Cosmos DB accounts should use private link](recommendations-reference-data.md#cosmos-db-accounts-should-use-private-link) | Microsoft Cloud Security Benchmark
January 4 | New recommendation | [VPN gateways should use only Azure Active Directory (Azure AD) authentication for point-to-site users](recommendations-reference-identity-access.md#vpn-gateways-should-use-only-azure-active-directory-azure-ad-authentication-for-point-to-site-users) | Microsoft Cloud Security Benchmark
January 4 | New recommendation | [Azure SQL Database should be running TLS version 1.2 or newer](recommendations-reference-data.md#azure-sql-database-should-be-running-tls-version-12-or-newer) | Microsoft Cloud Security Benchmark
January 4 | New recommendation | [Azure SQL Managed Instances should disable public network access](recommendations-reference-data.md#azure-sql-managed-instances-should-disable-public-network-access) | Microsoft Cloud Security Benchmark
January 4 | New recommendation | [Storage accounts should prevent shared key access](recommendations-reference-data.md#storage-accounts-should-prevent-shared-key-access) | Microsoft Cloud Security Benchmark
December 14 | New recommendation  | [Azure registry container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)](recommendations-reference-container.md#azure-registry-container-images-should-have-vulnerabilities-resolved-powered-by-microsoft-defender-vulnerability-management) | Vulnerability assessment for Linux container images with Microsoft Defender Vulnerability Management.
December 14 | New recommendation  | [Azure running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)](recommendations-reference-container.md#azure-running-container-images-should-have-vulnerabilities-resolved-powered-by-microsoft-defender-vulnerability-management) | Vulnerability assessment for Linux container images with Microsoft Defender Vulnerability Management.
December 14 | Renamed recommendation  | **Old**: Container registry images should have vulnerability findings resolved (powered by Qualys)<br/>**New**: [Azure registry container images should have vulnerabilities resolved (powered by Qualys)](recommendations-reference-container.md#azure-registry-container-images-should-have-vulnerabilities-resolved-powered-by-qualys). | Vulnerability assessment for container images using Qualys.
December 14 | Renamed recommendation | Old: Running container images should have vulnerability findings resolved (powered by Qualys)<br/>****New**: [Azure running container images should have vulnerabilities resolved - (powered by Qualys)](recommendations-reference-container.md#azure-running-container-images-should-have-vulnerabilities-resolved---powered-by-qualys). | Vulnerability assessment for container images using Qualys.
December 4 | New preview alert | `Malicious blob was downloaded from a storage account (Preview)` | MITRE tactics: Lateral movember
November 30 | Deprecated alert | `Possible data exfiltration detected (K8S.NODE_DataEgressArtifacts)` | 
November 30 | Deprecated alert | `Executable found running from a suspicious location (K8S.NODE_SuspectExecutablePath)` | 
November 30 | Deprecated alert | `Suspicious process termination burst (VM_TaskkillBurst)` | 
November 30 | Deprecated alert | `PsExec execution detected (VM_RunByPsExec)` | 
November 15 | New recommendation (renamed from preview) | **Old**: Container registry images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)<br/>**New**:[Azure registry container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)](recommendations-reference-container.md#azure-registry-container-images-should-have-vulnerabilities-resolved-powered-by-qualys) | 
November 15 | New recommendation (renamed from preview) | **Old**: Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)<br/>**New**:[Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management)](recommendations-reference-container.md#azure-running-container-images-should-have-vulnerabilities-resolved-powered-by-microsoft-defender-vulnerability-management). | 
November 15 | Renamed recommendation | **Old**: Container registry images should have vulnerability findings resolved (powered by Qualys)<br/>**New**: [Azure registry container images should have vulnerabilities resolved (powered by Qualys)](recommendations-reference-container.md#azure-registry-container-images-should-have-vulnerabilities-resolved-powered-by-microsoft-defender-vulnerability-management). | 
November 15 | Renamed recommendation | **Old**: Running container images should have vulnerability findings resolved (powered by Qualys)<br/>**New**: [Azure running container images should have vulnerabilities resolved - (powered by Qualys)](recommendations-reference-container.md#azure-running-container-images-should-have-vulnerabilities-resolved---powered-by-qualys). | 
November 15 | Renamed recommendation | **Old**: Elastic container registry images should have vulnerability findings resolved<br/>**New**: AWS registry container images should have vulnerabilities resolved - (powered by Trivy) | 
October 30 | Alert changed to Informational | `Adaptive application control policy violation was audited.[VM_AdaptiveApplicationControlWindowsViolationAudited, VM_AdaptiveApplicationControlWindowsViolationAudited]` | 



## Next steps

For past changes to Defender for Cloud, see [Archive for what's new in Defender for Cloud?](release-notes-archive.md).
