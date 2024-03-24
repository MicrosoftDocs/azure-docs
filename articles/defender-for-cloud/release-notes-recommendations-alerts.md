---
title: New and upcoming changes in Defender for Cloud recommendations and alerts
description: Get release notes for new and upcoming changes in recommendations and alerts in Microsoft Defender for Cloud. 
ms.topic: overview
ms.date: 03/18/2024
#customer intent: As a Defender for Cloud admin, I want to stay up to date on the latest new and changed security recommendations and alerts.
---

# Release notes for recommendations/alerts - Microsoft Defender for Cloud

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
<!-- 4. You can optionally add a short sentence with additional details in the details column. The details column shouldn't include a description of the recommendation or its severity. that information belongs in the recommendations reference article-->


**Date** | **Type** | **Name** | **Details**
--- | --- | --- | --- 
March 18 | New recommendation |  [EDR solution should be installed on virtual machines](recommendations-reference-compute.md#edr-solution-should-be-installed-on-virtual-machines) | [Learn more](endpoint-detection-response.md) about agentless endpoint protection recommendations.
March 18 | [EDR configuration issues should be resolved on virtual machines](recommendations-reference-compute.md#edr-configuration-issues-should-be-resolved-on-virtual-machines | To protect virtual machines, resolve all identified configuration issues for your endpoint detection and response solutions.<br/><br/> This recommendation currently only applies to resources with Microsoft Defender for Endpointenabled . |
March 18 | New recommendation | [EDR configuration issues should be resolved on EC2s](recommendations-reference-compute.md#edr-configuration-issues-should-be-resolved-on-ec2s) |
March 18 | New recommendation | [EDR solution should be installed on EC2s](recommendations-reference-compute.md#edr-solution-should-be-installed-on-ec2s) |
March 18 | New recommendation | ### [EDR configuration issues should be resolved on GCP virtual machines](recommendations-reference-compute.md#edr-configuration-issues-should-be-resolved-on-gcp-virtual-machines) |
March 18 | New recommendation | [EDR solution should be installed on GCP virtual machines](recommendations-reference-compute.md#edr-solution-should-be-installed-on-gcp-virtual-machines)
End March | Deprecated recommendation  | [Endpoint protection should be installed on machines](recommendations-reference-deprecated.md#endpoint-protection-should-be-installed-on-machines) | MMA/AMA (preview).
End March | Deprecation | [Endpoint protection health issues on machines should be resolved](recommendations-reference-deprecated.md#endpoint-protection-health-issues-on-machines-should-be-resolved) |  MMA/AMA (preview) 
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
