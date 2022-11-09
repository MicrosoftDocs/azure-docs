---
title: Release notes for Microsoft Defender for Cloud
description: A description of what's new and changed in Microsoft Defender for Cloud
ms.topic: reference
ms.date: 10/03/2022
---

# What's new in Microsoft Defender for Cloud?

Defender for Cloud is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about new features, bug fixes, and deprecated functionality.

This page is updated frequently, so revisit it often.

To learn about *planned* changes that are coming soon to Defender for Cloud, see [Important upcoming changes to Microsoft Defender for Cloud](upcoming-changes.md).

> [!TIP]
> If you're looking for items older than six months, you'll find them in the [Archive for What's new in Microsoft Defender for Cloud](release-notes-archive.md).

## October 2022

Updates in October include:

- [Announcing the Microsoft cloud security benchmark](#announcing-the-microsoft-cloud-security-benchmark)
- [Attack path analysis and contextual security capabilities in Defender for Cloud (Preview)](#attack-path-analysis-and-contextual-security-capabilities-in-defender-for-cloud-preview)
- [Agentless scanning for Azure and AWS machines (Preview)](#agentless-scanning-for-azure-and-aws-machines-preview)
- [Defender for DevOps (Preview)](#defender-for-devops-preview)
- [Regulatory Compliance Dashboard now supports manual control management and detailed information on Microsoft's compliance status](#regulatory-compliance-dashboard-now-supports-manual-control-management-and-detailed-information-on-microsofts-compliance-status)
- [Auto-provisioning has been renamed to Settings & monitoring and has an updated experience](#auto-provisioning-has-been-renamed-to-settings--monitoring-and-has-an-updated-experience)
- [Defender Cloud Security Posture Management (CSPM) (Preview)](#defender-cloud-security-posture-management-cspm)
- [MITRE ATT&CK framework mapping is now available also for AWS and GCP security recommendations](#mitre-attck-framework-mapping-is-now-available-also-for-aws-and-gcp-security-recommendations)
- [Defender for Containers now supports vulnerability assessment for Elastic Container Registry (Preview)](#defender-for-containers-now-supports-vulnerability-assessment-for-elastic-container-registry-preview)

### Announcing the Microsoft cloud security benchmark

The [Microsoft cloud security benchmark](/security/benchmark/azure/introduction) (MCSB) is a new framework defining fundamental cloud security principles based on common industry standards and compliance frameworks, together with detailed technical guidance for implementing these best practices across cloud platforms. Replacing the Azure Security Benchmark, the MCSB provides prescriptive details for how to implement its cloud-agnostic security recommendations on multiple cloud service platforms, initially covering Azure and AWS.

You can now monitor your cloud security compliance posture per cloud in a single, integrated dashboard. You can see MCSB as the default compliance standard when you navigate to Defender for Cloud's regulatory compliance dashboard.

Microsoft cloud security benchmark is automatically assigned to your Azure subscriptions and AWS accounts when you onboard Defender for Cloud. 

Learn more about the [Microsoft cloud security benchmark](concept-regulatory-compliance.md).

### Attack path analysis and contextual security capabilities in Defender for Cloud (Preview)

The new cloud security graph, attack path analysis and contextual cloud security capabilities are now available in Defender for Cloud in preview.

One of the biggest challenges that security teams face today is the number of security issues they face on a daily basis. There are numerous security issues that need to be resolved and never enough resources to address them all.

Defender for Cloud's new cloud security graph and attack path analysis capabilities give security teams the ability to assess the risk behind each security issue. Security teams can also identify the highest risk issues that need to be resolved soonest. Defender for Cloud works with security teams to reduce the risk of an impactful breach to their environment in the most effective way.

Learn more about the new [cloud security graph, attack path analysis, and the cloud security explorer](concept-attack-path.md).

### Agentless scanning for Azure and AWS machines (Preview)

Until now, Defender for Cloud based its posture assessments for VMs on agent-based solutions. To help customers maximize coverage and reduce onboarding and management friction, we are releasing agentless scanning for VMs to preview.

With agentless scanning for VMs, you get wide visibility on installed software and software CVEs, without the challenges of agent installation and maintenance, network connectivity requirements, and performance impact on your workloads. The analysis is powered by Microsoft Defender vulnerability management.

Agentless vulnerability scanning is available in both Defender Cloud Security Posture Management (CSPM) and in [Defender for Servers P2](defender-for-servers-introduction.md), with native support for AWS and Azure VMs.

- Learn more about [agentless scanning](concept-agentless-data-collection.md).
- Find out how to enable [agentless vulnerability assessment](enable-vulnerability-assessment-agentless.md).

### Defender for DevOps (Preview)

Microsoft Defender for Cloud enables comprehensive visibility, posture management, and threat protection across hybrid and multicloud environments including Azure, AWS, Google, and on-premises resources. 

Now, the new Defender for DevOps plan integrates source code management systems, like GitHub and Azure DevOps, into Defender for Cloud. With this new integration we are empowering security teams to protect their resources from code to cloud.

Defender for DevOps allows you to gain visibility into and manage your connected developer environments and code resources. Currently, you can connect [Azure DevOps](quickstart-onboard-devops.md) and [GitHub](quickstart-onboard-github.md) systems to Defender for Cloud and onboard DevOps repositories to Inventory and the new DevOps Security page. It provides security teams with a high-level overview of the discovered security issues that exist within them in a unified DevOps Security page.

Security teams can configure pull request annotations to help developers address secret scanning findings in Azure DevOps directly on their pull requests.

You can configure the Microsoft Security DevOps tools on Azure Pipelines and GitHub workflows to enable the following security scans: 

| Name | Language | License |
|--|--|--|
| [Bandit](https://github.com/PyCQA/bandit) | python | [Apache License 2.0](https://github.com/PyCQA/bandit/blob/main/LICENSE) |
| [BinSkim](https://github.com/Microsoft/binskim) | Binary – Windows, ELF | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [ESlint](https://github.com/eslint/eslint) | JavaScript | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [CredScan](https://secdevtools.azurewebsites.net/helpcredscan.html) (Azure DevOps Only) | Credential Scanner (also known as CredScan) is a tool developed and maintained by Microsoft to identify credential leaks such as those in source code and configuration files common types: default passwords, SQL connection strings, Certificates with private keys| Not Open Source |
| [Template Analyze](https://github.com/Azure/template-analyzer) | ARM template, Bicep file | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [Terrascan](https://github.com/tenable/terrascan) | Terraform (HCL2), Kubernetes (JSON/YAML), Helm v3, Kustomize, Dockerfiles, Cloud Formation | [Apache License 2.0](https://github.com/tenable/terrascan/blob/master/LICENSE) |
| [Trivy](https://github.com/aquasecurity/trivy) | Container images, file systems, git repositories | [Apache License 2.0](https://github.com/tenable/terrascan/blob/master/LICENSE) |

The following new recommendations are now available for DevOps:

| Recommendation | Description | Severity | 
|--|--|--|
| (Preview) [Code repositories should have code scanning findings resolved](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsWithRulesBlade/assessmentKey/c68a8c2a-6ed4-454b-9e37-4b7654f2165f/showSecurityCenterCommandBar~/false) | Defender for DevOps has found vulnerabilities in code repositories. To improve the security posture of the repositories, it is highly recommended to remediate these vulnerabilities. (No related policy) | Medium |
| (Preview) [Code repositories should have secret scanning findings resolved](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsWithRulesBlade/assessmentKey/4e07c7d0-e06c-47d7-a4a9-8c7b748d1b27/showSecurityCenterCommandBar~/false) | Defender for DevOps has found a secret in code repositories.  This should be remediated immediately to prevent a security breach.  Secrets found in repositories can be leaked or discovered by adversaries, leading to compromise of an application or service. For Azure DevOps, the Microsoft Security DevOps CredScan tool only scans builds on which it has been configured to run. Therefore, results may not reflect the complete status of secrets in your repositories. (No related policy) | High |
| (Preview) [Code repositories should have Dependabot scanning findings resolved](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/822425e3-827f-4f35-bc33-33749257f851/showSecurityCenterCommandBar~/false) | Defender for DevOps has found vulnerabilities in code repositories. To improve the security posture of the repositories, it is highly recommended to remediate these vulnerabilities. (No related policy) | Medium |
| (Preview) [Code repositories should have infrastructure as code scanning findings resolved](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/2ebc815f-7bc7-4573-994d-e1cc46fb4a35/showSecurityCenterCommandBar~/false) | (Preview) Code repositories should have infrastructure as code scanning findings resolved | Medium |
| (Preview) [GitHub repositories should have code scanning enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6672df26-ff2e-4282-83c3-e2f20571bd11/showSecurityCenterCommandBar~/false) | GitHub uses code scanning to analyze code in order to find security vulnerabilities and errors in code. Code scanning can be used to find, triage, and prioritize fixes for existing problems in your code. Code scanning can also prevent developers from introducing new problems. Scans can be scheduled for specific days and times, or scans can be triggered when a specific event occurs in the repository, such as a push. If code scanning finds a potential vulnerability or error in code, GitHub displays an alert in the repository. A vulnerability is a problem in a project's code that could be exploited to damage the confidentiality, integrity, or availability of the project. (No related policy) | Medium |
| (Preview) [GitHub repositories should have secret scanning enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/1a600c61-6443-4ab4-bd28-7a6b6fb4691d/showSecurityCenterCommandBar~/false) | GitHub scans repositories for known types of secrets, to prevent fraudulent use of secrets that were accidentally committed to repositories. Secret scanning will scan the entire Git history on all branches present in the GitHub repository for any secrets. Examples of secrets are tokens and private keys that a service provider can issue for authentication. If a secret is checked into a repository, anyone who has read access to the repository can use the secret to access the external service with those privileges. Secrets should be stored in a dedicated, secure location outside the repository for the project. (No related policy) | High |
| (Preview) [GitHub repositories should have Dependabot scanning enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/92643c1f-1a95-4b68-bbd2-5117f92d6e35/showSecurityCenterCommandBar~/false) | GitHub sends Dependabot alerts when it detects vulnerabilities in code dependencies that affect repositories. A vulnerability is a problem in a project's code that could be exploited to damage the confidentiality, integrity, or availability of the project or other projects that use its code. Vulnerabilities vary in type, severity, and method of attack. When code depends on a package that has a security vulnerability, this vulnerable dependency can cause a range of problems. (No related policy) | Medium |

The Defender for DevOps recommendations replace the deprecated vulnerability scanner for CI/CD workflows that was included in Defender for Containers.

Learn more about [Defender for DevOps](defender-for-devops-introduction.md)

### Regulatory Compliance dashboard now supports manual control management and detailed information on Microsoft's compliance status

The compliance dashboard in Defender for Cloud is a key tool for customers to help them understand and track their compliance status. Customers can do this by continuously monitoring environments in accordance with requirements from many different standards and regulations.

Now, you can fully manage your compliance posture by manually attesting to operational and non-technical controls. You can now provide evidence of compliance for controls that are not automated. Together with the automated assessments, you can now generate a full report of compliance within a selected scope, addressing the entire set of controls for a given standard.

In addition, with richer control information and in-depth details and evidence for Microsoft's compliance status, you now have all of the information required for audits at your fingertips.

Some of the new benefits include:

- **Manual customer actions** provide a mechanism for manually attesting compliance with non-automated controls. This includes the ability to link evidence, set a compliance date and expiration date.

- Richer control details for supported standards that showcase **Microsoft actions** and **manual customer actions** in addition to the already existing automated customer actions.

- Microsoft actions provide transparency into Microsoft’s compliance status that include audit assessment procedures, test results, and Microsoft responses to deviations.

- **Compliance offerings** provide a central location to check Azure, Dynamics 365, and Power Platform products and their respective regulatory compliance certifications.

Learn more on how to [Improve your regulatory compliance](regulatory-compliance-dashboard.md) with Defender for Cloud.

### Auto-provisioning has been renamed to Settings & monitoring and has an updated experience

We have renamed the Auto-provisioning page to **Settings & monitoring**. 

Auto-provisioning was meant to allow at-scale enablement of prerequisites, which are needed by Defender for Cloud's advanced features and capabilities. To better support our expanded capabilities, we are launching a new experience with the following changes: 

**The Defender for Cloud's plans page now includes**:
- When you enable Defender plans, a Defender plan that requires monitoring components automatically turns on the required components with default settings. These settings can be edited by the user at any time.
- You can access the monitoring component settings for each Defender plan from the Defender plan page.
- The Defender plans page clearly indicates whether all the monitoring components are in place for each Defender plan, or if your monitoring coverage is incomplete.

**The Settings & monitoring page**:
- Each monitoring component indicates the Defender plans that it is related to.

Learn more about [managing your monitoring settings](monitoring-components.md).

### Defender Cloud Security Posture Management (CSPM)

One of Microsoft Defender for Cloud's main pillars for cloud security is Cloud Security Posture Management (CSPM). CSPM provides you with hardening guidance that helps you efficiently and effectively improve your security. CSPM also gives you visibility into your current security situation.

We are announcing a new Defender plan: Defender CSPM. This plan enhances the security capabilities of Defender for Cloud and includes the following new and expanded features:

- Continuous assessment of the security configuration of your cloud resources
- Security recommendations to fix misconfigurations and weaknesses
- Secure score
- Governance
- Regulatory compliance
- Cloud security graph
- Attack path analysis
- Agentless scanning for machines

Learn more about the [Defender CSPM plan](concept-cloud-security-posture-management.md).

### MITRE ATT&CK framework mapping is now available also for AWS and GCP security recommendations

For security analysts, it’s essential to identify the potential risks associated with security recommendations and understand the attack vectors, so that they can efficiently prioritize their tasks.

Defender for Cloud makes prioritization easier by mapping the Azure, AWS and GCP security recommendations against the MITRE ATT&CK framework. The MITRE ATT&CK framework is a globally accessible knowledge base of adversary tactics and techniques based on real-world observations, allowing customers to strengthen the secure configuration of their environments.

The MITRE ATT&CK framework has been integrated in three ways:

- Recommendations map to MITRE ATT&CK tactics and techniques.
- Query MITRE ATT&CK tactics and techniques on recommendations using the Azure Resource Graph.

:::image type="content" source="media/release-notes/mitre-screenshot.jpg" alt-text="Screenshot that shows where the MITRE attack exists in the Azure portal. "::: 

### Defender for Containers now supports vulnerability assessment for Elastic Container Registry (Preview)

Microsoft Defender for Containers now provides agentless vulnerability assessment scanning for Elastic Container Registry (ECR) in Amazon AWS. This expands on coverage for multicloud environments, building on the release earlier this year of advanced threat protection and Kubernetes environment hardening for AWS and Google GCP. The agentless model creates AWS resources in your accounts to scan your images without extracting images out of your AWS accounts and with no footprint on your workload.

Agentless vulnerability assessment scanning for images in ECR repositories helps reduce the attack surface of your containerized estate by continuously scanning images to identify and manage container vulnerabilities. With this new release, Defender for Cloud scans container images after they are pushed to the repository and continually reassess the ECR container images in the registry. The findings are available in Microsoft Defender for Cloud as recommendations, and you can use Defender for Cloud's built-in automated workflows to take action on the findings, such as opening a ticket for fixing a high severity vulnerability in an image.

Learn more about [vulnerability assessment for Amazon ECR images](defender-for-containers-vulnerability-assessment-elastic.md).

## September 2022

Updates in September include:

- [Suppress alerts based on Container and Kubernetes entities](#suppress-alerts-based-on-container-and-kubernetes-entities)
- [Defender for Servers supports File Integrity Monitoring with Azure Monitor Agent](#defender-for-servers-supports-file-integrity-monitoring-with-azure-monitor-agent)
- [Legacy Assessments APIs deprecation](#legacy-assessments-apis-deprecation)
- [Extra recommendations added to identity](#extra-recommendations-added-to-identity)
- [Removed security alerts for machines reporting to cross-tenant Log Analytics workspaces](#removed-security-alerts-for-machines-reporting-to-cross-tenant-log-analytics-workspaces)

### Suppress alerts based on Container and Kubernetes entities

- Kubernetes Namespace
- Kubernetes Pod
- Kubernetes Secret
- Kubernetes ServiceAccount
- Kubernetes ReplicaSet
- Kubernetes StatefulSet
- Kubernetes DaemonSet
- Kubernetes Job
- Kubernetes CronJob

Learn more about [alert suppression rules](alerts-suppression-rules.md).

### Defender for Servers supports File Integrity Monitoring with Azure Monitor Agent

File integrity monitoring (FIM) examines operating system files and registries for changes that might indicate an attack.

FIM is now available in a new version based on Azure Monitor Agent (AMA), which you can [deploy through Defender for Cloud](auto-deploy-azure-monitoring-agent.md).

Learn more about [File Integrity Monitoring with the Azure Monitor Agent](file-integrity-monitoring-enable-ama.md).

### Legacy Assessments APIs deprecation

The following APIs are deprecated:

- Security Tasks
- Security Statuses
- Security Summaries

These three APIs exposed old formats of assessments and are replaced by the [Assessments APIs](/rest/api/defenderforcloud/assessments) and [SubAssessments APIs](/rest/api/defenderforcloud/sub-assessments). All data that is exposed by these legacy APIs are also available in the new APIs.

### Extra recommendations added to identity

Defender for Cloud's  recommendations for improving the management of users and accounts.

#### New recommendations

The new release contains the following capabilities:

- **Extended evaluation scope** – Coverage has been improved for identity accounts without MFA and external accounts on Azure resources (instead of subscriptions only) which allows your security administrators to view role assignments per account.

- **Improved freshness interval** - The identity recommendations now have a freshness interval of 12 hours.

- **Account exemption capability** - Defender for Cloud has many features you can use to customize your experience and ensure that your secure score reflects your organization's security priorities. For example, you can [exempt resources and recommendations from your secure score](exempt-resource.md).

    This update allows you to exempt specific accounts from evaluation with the six recommendations listed in the following table.

    Typically, you'd exempt emergency “break glass” accounts from MFA recommendations, because such accounts are often deliberately excluded from an organization's MFA requirements. Alternatively, you might have external accounts that you'd like to permit access to, that don't have MFA enabled.

    > [!TIP]
    > When you exempt an account, it won't be shown as unhealthy and also won't cause a subscription to appear  unhealthy.

    | Recommendation | Assessment key |
    |--|--|
    |Accounts with owner permissions on Azure resources should be MFA enabled|6240402e-f77c-46fa-9060-a7ce53997754|
    |Accounts with write permissions on Azure resources should be MFA enabled|c0cb17b2-0607-48a7-b0e0-903ed22de39b|
    |Accounts with read permissions on Azure resources should be MFA enabled|dabc9bc4-b8a8-45bd-9a5a-43000df8aa1c|
    |Guest accounts with owner permissions on Azure resources should be removed|20606e75-05c4-48c0-9d97-add6daa2109a|
    |Guest accounts with write permissions on Azure resources should be removed|0354476c-a12a-4fcc-a79d-f0ab7ffffdbb|
    |Guest accounts with read permissions on Azure resources should be removed|fde1c0c9-0fd2-4ecc-87b5-98956cbc1095|
    |Blocked accounts with owner permissions on Azure resources should be removed|050ac097-3dda-4d24-ab6d-82568e7a50cf|
    |Blocked accounts with read and write permissions on Azure resources should be removed| 1ff0b4c9-ed56-4de6-be9c-d7ab39645926 |

The recommendations although in preview, will appear next to the recommendations that are currently in GA.

### Removed security alerts for machines reporting to cross-tenant Log Analytics workspaces

In the past, Defender for Cloud let you choose the workspace that your Log Analytics agents report to. When a machine belonged to one tenant (“Tenant A”) but its Log Analytics agent reported to a workspace in a different tenant (“Tenant B”), security alerts about the machine were reported to the first tenant (“Tenant A”).

With this change, alerts on machines connected to Log Analytics workspace in a different tenant no longer appear in Defender for Cloud.

If you want to continue receiving the alerts in Defender for Cloud, connect the Log Analytics agent of the relevant machines to the workspace in the same tenant as the machine.

Learn more about [security alerts](alerts-overview.md).

## August 2022

Updates in August include:

- [Vulnerabilities for running images are now visible with Defender for Containers on your Windows containers](#vulnerabilities-for-running-images-are-now-visible-with-defender-for-containers-on-your-windows-containers)
- [Azure Monitor Agent integration now in preview](#azure-monitor-agent-integration-now-in-preview)
- [Deprecated VM alerts regarding suspicious activity related to a Kubernetes cluster](#deprecated-vm-alerts-regarding-suspicious-activity-related-to-a-kubernetes-cluster)
### Vulnerabilities for running images are now visible with Defender for Containers on your Windows containers 

Defender for Containers now shows vulnerabilities for running Windows containers.

When vulnerabilities are detected, Defender for Cloud generates the following security recommendation listing the detected issues: [Running container images should have vulnerability findings resolved](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462c/showSecurityCenterCommandBar~/false).

Learn more about [viewing vulnerabilities for running images](defender-for-containers-introduction.md#view-vulnerabilities-for-running-images-in-azure-container-registry-acr).

### Azure Monitor Agent integration now in preview
 
Defender for Cloud now includes preview support for the [Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) (AMA). AMA is intended to replace the legacy Log Analytics agent (also referred to as the Microsoft Monitoring Agent (MMA)), which is on a path to deprecation. AMA [provides many benefits](../azure-monitor/agents/azure-monitor-agent-migration.md#benefits) over legacy agents.

In Defender for Cloud, when you [enable auto provisioning for AMA](auto-deploy-azure-monitoring-agent.md), the agent is deployed on **existing and new** VMs and Azure Arc-enabled machines that are detected in your subscriptions. If Defenders for Cloud plans are enabled, AMA collects configuration information and event logs from Azure VMs and Azure Arc machines. The AMA integration is in preview, so we recommend using it in test environments, rather than in production environments.

### Deprecated VM alerts regarding suspicious activity related to a Kubernetes cluster

The following table lists the alerts that were deprecated:

| Alert name | Description | Tactics | Severity |
|--|--|--|--|
| **Docker build operation detected on a Kubernetes node** <br>(VM_ImageBuildOnNode) | Machine logs indicate a build operation of a container image on a Kubernetes node. While this behavior might be legitimate, attackers might build their malicious images locally to avoid detection. | Defense Evasion | Low |
| **Suspicious request to Kubernetes API** <br>(VM_KubernetesAPI) | Machine logs indicate that a suspicious request was made to the Kubernetes API. The request was sent from a Kubernetes node, possibly from one of the containers running in the node. Although this behavior can be intentional, it might indicate that the node is running a compromised container. | LateralMovement | Medium |
| **SSH server is running inside a container** <br>(VM_ContainerSSH) | Machine logs indicate that an SSH server is running inside a Docker container. While this behavior can be intentional, it frequently indicates that a container is misconfigured or breached. | Execution | Medium |

These alerts are used to notify a user about suspicious activity connected to a Kubernetes cluster. The alerts will be replaced with matching alerts that are part of the Microsoft Defender for Cloud Container alerts (`K8S.NODE_ImageBuildOnNode`, `K8S.NODE_ KubernetesAPI` and `K8S.NODE_ ContainerSSH`) which will provide improved fidelity and comprehensive context to investigate and act on the alerts. Learn more about alerts for [Kubernetes Clusters](alerts-reference.md).

### Container vulnerabilities now include detailed package information

Defender for Container's vulnerability assessment (VA) now includes detailed package information for each finding, including: package name, package type, path, installed version, and fixed version. The package information lets you find vulnerable packages so you can remediate the vulnerability or remove the package.

This detailed package information is available for new scans of images.

:::image type="content" source="media/release-notes/mdc-container-va-package-information.png" alt-text="Screenshot of the package information for container vulnerabilities." lightbox="media/release-notes/mdc-container-va-package-information.png":::

## July 2022

Updates in July include:

- [General availability (GA) of the Cloud-native security agent for Kubernetes runtime protection](#general-availability-ga-of-the-cloud-native-security-agent-for-kubernetes-runtime-protection)
- [Defender for Container's VA adds support for the detection of language specific packages (Preview)](#defender-for-containers-va-adds-support-for-the-detection-of-language-specific-packages-preview)
- [Protect against the Operations Management Infrastructure vulnerability CVE-2022-29149](#protect-against-the-operations-management-infrastructure-vulnerability-cve-2022-29149)
- [Integration with Entra Permissions Management](#integration-with-entra-permissions-management)
- [Key Vault recommendations changed to "audit"](#key-vault-recommendations-changed-to-audit)
- [Deprecate API App policies for App Service](#deprecate-api-app-policies-for-app-service)

### General availability (GA) of the cloud-native security agent for Kubernetes runtime protection

We're excited to share that the cloud-native security agent for Kubernetes runtime protection is now generally available (GA)!

The production deployments of Kubernetes clusters continue to grow as customers continue to containerize their applications. To assist with this growth, the Defender for Containers team has developed a cloud-native Kubernetes oriented security agent.

The new security agent is a Kubernetes DaemonSet, based on eBPF technology and is fully integrated into AKS clusters as part of the AKS Security Profile.

The security agent enablement is available through auto-provisioning, recommendations flow, AKS RP or at scale using Azure Policy.

You can [deploy the Defender profile](./defender-for-containers-enable.md?pivots=defender-for-container-aks&tabs=aks-deploy-portal%2ck8s-deploy-asc%2ck8s-verify-asc%2ck8s-remove-arc%2caks-removeprofile-api#deploy-the-defender-profile) today on your AKS clusters.

With this announcement, the runtime protection - threat detection (workload) is now also generally available.

Learn more about the Defender for Container's [feature availability](supported-machines-endpoint-solutions-clouds-containers.md).

You can also review [all available alerts](alerts-reference.md#alerts-k8scluster).

Note, if you're using the preview version, the `AKS-AzureDefender` feature flag is no longer required.

### Defender for Container's VA adds support for the detection of language specific packages (Preview)

Defender for Container's vulnerability assessment (VA) is able to detect vulnerabilities in OS packages deployed via the OS package manager. We have now extended VA's abilities to detect vulnerabilities included in language specific packages.

This feature is in preview and is only available for Linux images.

To see all of the included language specific packages that have been added, check out Defender for Container's full list of [features and their availability](supported-machines-endpoint-solutions-clouds-containers.md#registries-and-images).

### Protect against the Operations Management Infrastructure vulnerability CVE-2022-29149

Operations Management Infrastructure (OMI) is a collection of cloud-based services for managing on-premises and cloud environments from one single place. Rather than deploying and managing on-premises resources, OMI components are entirely hosted in Azure.

Log Analytics integrated with Azure HDInsight running OMI version 13 requires a patch to remediate [CVE-2022-29149](https://nvd.nist.gov/vuln/detail/CVE-2022-29149). Review the report about this vulnerability in the [Microsoft Security Update guide](https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2022-29149) for information about how to identify resources that are affected by this vulnerability and remediation steps.

If you have Defender for Servers enabled with Vulnerability Assessment, you can use [this workbook](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Workbooks/OMI%20Vulnerability%20Dashboard) to identify affected resources.

### Integration with Entra Permissions Management

Defender for Cloud has integrated with [Microsoft Entra Permissions Management](../active-directory/cloud-infrastructure-entitlement-management/index.yml), a cloud infrastructure entitlement management (CIEM) solution that provides comprehensive visibility and control over permissions for any identity and any resource in Azure, AWS, and GCP.

Each Azure subscription, AWS account, and GCP project that you onboard, will now show you a view of your [Permission Creep Index (PCI)](../active-directory/cloud-infrastructure-entitlement-management/ui-dashboard.md).

Learn more about [Entra Permission Management (formerly Cloudknox)](other-threat-protections.md#entra-permission-management-formerly-cloudknox)

### Key Vault recommendations changed to "audit"

The effect for the Key Vault recommendations listed here was changed to "audit":

| Recommendation name | Recommendation ID |
| ------- | ------ |
| Validity period of certificates stored in Azure Key Vault should not exceed 12 months | fc84abc0-eee6-4758-8372-a7681965ca44 |
| Key Vault secrets should have an expiration date | 14257785-9437-97fa-11ae-898cfb24302b |
| Key Vault keys should have an expiration date | 1aabfa0d-7585-f9f5-1d92-ecb40291d9f2 |


### Deprecate API App policies for App Service

We deprecated the following policies to corresponding policies that already exist to include API apps:

| To be deprecated | Changing to |
|--|--|
|`Ensure API app has 'Client Certificates (Incoming client certificates)' set to 'On'` | `App Service apps should have 'Client Certificates (Incoming client certificates)' enabled` | 
| `Ensure that 'Python version' is the latest, if used as a part of the API app` | `App Service apps that use Python should use the latest Python version'` |
| `CORS should not allow every resource to access your API App` | `App Service apps should not have CORS configured to allow every resource to access your apps` |
| `Managed identity should be used in your API App` | `App Service apps should use managed identity` |
| `Remote debugging should be turned off for API Apps` | `App Service apps should have remote debugging turned off` |
| `Ensure that 'PHP version' is the latest, if used as a part of the API app` | `App Service apps that use PHP should use the latest 'PHP version'`|
| `FTPS only should be required in your API App` | `App Service apps should require FTPS only` |
| `Ensure that 'Java version' is the latest, if used as a part of the API app` | `App Service apps that use Java should use the latest 'Java version'` |
| `Latest TLS version should be used in your API App` | `App Service apps should use the latest TLS version` |

## June 2022

Updates in June include:

- [General availability (GA) for Microsoft Defender for Azure Cosmos DB](#general-availability-ga-for-microsoft-defender-for-azure-cosmos-db)
- [General availability (GA) of Defender for SQL on machines for AWS and GCP environments](#general-availability-ga-of-defender-for-sql-on-machines-for-aws-and-gcp-environments)
- [Drive implementation of security recommendations to enhance your security posture](#drive-implementation-of-security-recommendations-to-enhance-your-security-posture)
- [Filter security alerts by IP address](#filter-security-alerts-by-ip-address)
- [Alerts by resource group](#alerts-by-resource-group)
- [Auto-provisioning of Microsoft Defender for Endpoint unified solution](#auto-provisioning-of-microsoft-defender-for-endpoint-unified-solution)
- [Deprecating the "API App should only be accessible over HTTPS" policy](#deprecating-the-api-app-should-only-be-accessible-over-https-policy)
- [New Key Vault alerts](#new-key-vault-alerts)

### General availability (GA) for Microsoft Defender for Azure Cosmos DB

Microsoft Defender for Azure Cosmos DB is now generally available (GA) and supports SQL (core) API account types. 

This new release to GA is a part of the Microsoft Defender for Cloud database protection suite, which includes different types of SQL databases, and MariaDB. Microsoft Defender for Azure Cosmos DB is an Azure native layer of security that detects attempts to exploit databases in your Azure Cosmos DB accounts.

By enabling this plan, you'll be alerted to potential SQL injections, known bad actors, suspicious access patterns, and potential explorations of your database through compromised identities, or malicious insiders.  

When potentially malicious activities are detected, security alerts are generated. These alerts provide details of suspicious activity along with the relevant investigation steps, remediation actions, and security recommendations.

Microsoft Defender for Azure Cosmos DB continuously analyzes the telemetry stream generated by the Azure Cosmos DB services and crosses them with Microsoft Threat Intelligence and behavioral models to detect any suspicious activity. Defender for Azure Cosmos DB doesn't access the Azure Cosmos DB account data and doesn't have any effect on your database's performance.

Learn more about [Microsoft Defender for Azure Cosmos DB](concept-defender-for-cosmos.md).

With the addition of support for Azure Cosmos DB, Defender for Cloud now provides one of the most comprehensive workload protection offerings for cloud-based databases. Security teams and database owners can now have a centralized experience to manage their database security of their environments. 

Learn how to [enable protections](enable-enhanced-security.md) for your databases.

### General availability (GA) of Defender for SQL on machines for AWS and GCP environments

The database protection capabilities provided by Microsoft Defender for Cloud, has added support for your SQL servers that are hosted in either AWS or GCP environments.

Defender for SQL, enterprises can now protect their entire database estate, hosted in Azure, AWS, GCP and on-premises machines.

Microsoft Defender for SQL provides a unified multicloud experience to view security recommendations, security alerts and vulnerability assessment findings for both the SQL server and the underlining Windows OS.

Using the multicloud onboarding experience, you can enable and enforce databases protection for SQL servers running on AWS EC2, RDS Custom for SQL Server and GCP compute engine. Once you've enabled either of these plans, all supported resources that exist within the subscription are protected. Future resources created on the same subscription will also be protected.

Learn how to protect and connect your [AWS environment](quickstart-onboard-aws.md) and your [GCP organization](quickstart-onboard-gcp.md) with Microsoft Defender for Cloud.

### Drive implementation of security recommendations to enhance your security posture

Today's increasing threats to organizations stretch the limits of security personnel to protect their expanding workloads. Security teams are challenged to implement the protections defined in their security policies.

Now with the governance experience in preview, security teams can assign remediation of security recommendations to the resource owners and require a remediation schedule. They can have full transparency into the progress of the remediation and get notified when tasks are overdue.

Learn more about the governance experience in [Driving your organization to remediate security issues with recommendation governance](governance-rules.md).

### Filter security alerts by IP address

In many cases of attacks, you want to track alerts based on the IP address of the entity involved in the attack. Up until now, the IP appeared only in the "Related Entities" section in the single alert pane. Now, you can filter the alerts in the security alerts page to see the alerts related to the IP address, and you can search for a specific IP address.

:::image type="content" source="media/release-notes/ip-address-filter-for-alerts.png" alt-text="Screenshot of filter for I P address in Defender for Cloud alerts." lightbox="media/release-notes/ip-address-filter-for-alerts.png":::

### Alerts by resource group

The ability to filter, sort and group by resource group has been added to the Security alerts page. 

A resource group column has been added to the alerts grid.

:::image type="content" source="media/release-notes/resource-column.png" alt-text="Screenshot of the newly added resource group column." lightbox="media/release-notes/resource-column.png":::

A new filter has been added which allows you to view all of the alerts for specific resource groups.

:::image type="content" source="media/release-notes/filter-by-resource-group.png" alt-text="Screenshot that shows the new resource group filter." lightbox="media/release-notes/filter-by-resource-group.png":::

You can now also group your alerts by resource group to view all of your alerts for each of your resource groups. 

:::image type="content" source="media/release-notes/group-by-resource.png" alt-text="Screenshot that shows how to view your alerts when they're grouped by resource group." lightbox="media/release-notes/group-by-resource.png":::

### Auto-provisioning of Microsoft Defender for Endpoint unified solution

Until now, the integration with Microsoft Defender for Endpoint (MDE) included automatic installation of the new [MDE unified solution](/microsoft-365/security/defender-endpoint/configure-server-endpoints?view=o365-worldwide#new-windows-server-2012-r2-and-2016-functionality-in-the-modern-unified-solution&preserve-view=true) for machines (Azure subscriptions and multicloud connectors) with Defender for Servers Plan 1 enabled, and for multicloud connectors with Defender for Servers Plan 2 enabled. Plan 2 for Azure subscriptions enabled the unified solution for Linux machines and Windows 2019 and 2022 servers only. Windows servers 2012R2 and 2016 used the MDE legacy solution dependent on Log Analytics agent.

Now, the new unified solution is available for all machines in both plans, for both Azure subscriptions and multicloud connectors. For Azure subscriptions with Servers Plan 2 that enabled MDE integration *after* June 20th 2022, the unified solution is enabled by default for all machines Azure subscriptions with the Defender for Servers Plan 2 enabled with MDE integration *before* June 20th 2022 can now enable unified solution installation for Windows servers 2012R2 and 2016 through the dedicated button in the Integrations page:

:::image type="content" source="media/integration-defender-for-endpoint/enable-unified-solution.png" alt-text="The integration between Microsoft Defender for Cloud and Microsoft's EDR solution, Microsoft Defender for Endpoint, is enabled." lightbox="media/integration-defender-for-endpoint/enable-unified-solution.png":::

Learn more about [MDE integration with Defender for Servers](integration-defender-for-endpoint.md#users-with-defender-for-servers-enabled-and-microsoft-defender-for-endpoint-deployed).

### Deprecating the "API App should only be accessible over HTTPS" policy

The policy `API App should only be accessible over HTTPS` has been deprecated. This policy is replaced with the `Web Application should only be accessible over HTTPS` policy, which has been renamed to `App Service apps should only be accessible over HTTPS`.

To learn more about policy definitions for Azure App Service, see [Azure Policy built-in definitions for Azure App Service](../azure-app-configuration/policy-reference.md).

### New Key Vault alerts

To expand the threat protections provided by Microsoft Defender for Key Vault, we've added two new alerts.

These alerts inform you of an access denied anomaly, is detected for any of your key vaults.

| Alert (alert type) | Description | MITRE tactics | Severity |
|--|--|--|--|
| **Unusual access denied - User accessing high volume of key vaults denied**<br>(KV_DeniedAccountVolumeAnomaly) | A user or service principal has attempted access to anomalously high volume of key vaults in the last 24 hours. This anomalous access pattern may be legitimate activity. Though this attempt was unsuccessful, it could be an indication of a possible attempt to gain access of key vault and the secrets contained within it. We recommend further investigations. | Discovery | Low |
| **Unusual access denied - Unusual user accessing key vault denied**<br>(KV_UserAccessDeniedAnomaly) | A key vault access was attempted by a user that doesn't normally access it, this anomalous access pattern may be legitimate activity. Though this attempt was unsuccessful, it could be an indication of a possible attempt to gain access of key vault and the secrets contained within it.  | Initial Access, Discovery | Low |
