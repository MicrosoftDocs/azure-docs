---
title: Archive of what's new
description: A description of what's new and changed in Microsoft Defender for Cloud from six months ago and earlier.
author: dcurwin
ms.author: dacurwin
ms.topic: reference
ms.date: 09/06/2023
---

# Archive for what's new in Defender for Cloud?

The primary [What's new in Defender for Cloud?](release-notes.md) release notes page contains updates for the last six months, while this page contains older items.

This page provides you with information about:

- New features
- Bug fixes
- Deprecated functionality

## March 2023

Updates in March include:

- [A new Defender for Storage plan is available, including near-real time malware scanning and sensitive data threat detection](#a-new-defender-for-storage-plan-is-available-including-near-real-time-malware-scanning-and-sensitive-data-threat-detection)
- [Data-aware security posture (preview)](#data-aware-security-posture-preview)
- [Improved experience for managing the default Azure security policies](#improved-experience-for-managing-the-default-azure-security-policies)
- [Defender CSPM (Cloud Security Posture Management) is now Generally Available (GA)](#defender-cspm-cloud-security-posture-management-is-now-generally-available-ga)
- [Option to create custom recommendations and security standards in Microsoft Defender for Cloud](#option-to-create-custom-recommendations-and-security-standards-in-microsoft-defender-for-cloud)
- [Microsoft cloud security benchmark (MCSB) version 1.0 is now Generally Available (GA)](#microsoft-cloud-security-benchmark-mcsb-version-10-is-now-generally-available-ga)
- [Some regulatory compliance standards are now available in government clouds](#some-regulatory-compliance-standards-are-now-available-in-government-clouds)
- [New preview recommendation for Azure SQL Servers](#new-preview-recommendation-for-azure-sql-servers)
- [New alert in Defender for Key Vault](#new-alert-in-defender-for-key-vault)

### A new Defender for Storage plan is available, including near-real time malware scanning and sensitive data threat detection

Cloud storage plays a key role in the organization and stores large volumes of valuable and sensitive data. Today we're announcing a new Defender for Storage plan. If you’re using the previous plan (now renamed to "Defender for Storage (classic)"), you need to proactively [migrate to the new plan](defender-for-storage-classic-migrate.md) in order to use the new features and benefits.

The new plan includes advanced security capabilities to help protect against malicious file uploads, sensitive data exfiltration, and data corruption. It also provides a more predictable and flexible pricing structure for better control over coverage and costs.

The new plan has new capabilities now in public preview:

- Detecting sensitive data exposure and exfiltration events

- Near real-time blob on-upload malware scanning across all file types

- Detecting entities with no identities using SAS tokens

These capabilities enhance the existing Activity Monitoring capability, based on control and data plane log analysis and behavioral modeling to identify early signs of breach.

All these capabilities are available in a new predictable and flexible pricing plan that provides granular control over data protection at both the subscription and resource levels.

Learn more at [Overview of Microsoft Defender for Storage](defender-for-storage-introduction.md).

### Data-aware security posture (preview)

Microsoft Defender for Cloud helps security teams to be more productive at reducing risks and responding to data breaches in the cloud. It allows them to cut through the noise with data context and prioritize the most critical security risks, preventing a costly data breach.

- Automatically discover data resources across cloud estate and evaluate their accessibility, data sensitivity and configured data flows.
-Continuously uncover risks to data breaches of sensitive data resources, exposure or attack paths that could lead to a data resource using a lateral movement technique.
- Detect suspicious activities that may indicate an ongoing threat to sensitive data resources.

[Learn more](concept-data-security-posture.md) about data-aware security posture.

### Improved experience for managing the default Azure security policies

We introduce an improved Azure security policy management experience for built-in recommendations that simplifies the way Defender for Cloud customers fine tune their security requirements. The new experience includes the following new capabilities:

- A simple interface allows better performance and experience when managing default security policies within Defender for Cloud.
- A single view of all built-in security recommendations offered by the Microsoft cloud security benchmark (formerly the Azure security benchmark). Recommendations are organized into logical groups, making it easier to understand the types of resources covered, and the relationship between parameters and recommendations.
- New features such as filters and search were added.

Learn how to  [manage security policies](tutorial-security-policy.md).

Read the [Microsoft Defender for Cloud blog](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/improved-experience-for-managing-the-default-azure-security/ba-p/3776522).

### Defender CSPM (Cloud Security Posture Management) is now Generally Available (GA)

We're announcing that Defender CSPM is now Generally Available (GA). Defender CSPM offers all of the services available under the Foundational CSPM capabilities and adds the following benefits:

- **Attack path analysis and ARG API** - Attack path analysis uses a graph-based algorithm that scans the cloud security graph to expose attack paths and suggests recommendations as to how best remediate issues that break the attack path and prevent successful breach. You can also consume attack paths programmatically by querying Azure Resource Graph (ARG) API. Learn how to use [attack path analysis](how-to-manage-attack-path.md)
- **Cloud Security explorer** - Use the Cloud Security Explorer to run graph-based queries on the cloud security graph, to proactively identify security risks in your multicloud environments.  Learn more about [cloud security explorer](concept-attack-path.md#what-is-cloud-security-explorer).

Learn more about [Defender CSPM](overview-page.md).

### Option to create custom recommendations and security standards in Microsoft Defender for Cloud

Microsoft Defender for Cloud provides the option of creating custom recommendations and standards for AWS and GCP using KQL queries. You can use a query editor to build and test queries over your data.
This feature is part of the Defender CSPM (Cloud Security Posture Management) plan. Learn how to [create custom recommendations and standards](create-custom-recommendations.md).

### Microsoft cloud security benchmark (MCSB) version 1.0 is now Generally Available (GA)

Microsoft Defender for Cloud is announcing that the Microsoft cloud security benchmark (MCSB) version 1.0 is now Generally Available (GA).

MCSB version 1.0 replaces the Azure Security Benchmark (ASB) version 3 as Defender for Cloud's default security policy. MCSB version 1.0 appears as the default compliance standard in the compliance dashboard, and is enabled by default for all Defender for Cloud customers.

You can also learn [How Microsoft cloud security benchmark (MCSB) helps you succeed in your cloud security journey](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/announcing-microsoft-cloud-security-benchmark-v1-general/ba-p/3763013).

Learn more about [MCSB](https://aka.ms/mcsb).

### Some regulatory compliance standards are now available in government clouds

We're updating these standards for customers in Azure Government and Microsoft Azure operated by 21Vianet.

**Azure Government**:

- [PCI DSS v4](/azure/compliance/offerings/offering-pci-dss)
- [SOC 2 Type 2](/azure/compliance/offerings/offering-soc-2)
- [ISO 27001:2013](/azure/compliance/offerings/offering-iso-27001)

**Microsoft Azure operated by 21Vianet**:

- [SOC 2 Type 2](/azure/compliance/offerings/offering-soc-2)
- [ISO 27001:2013](/azure/compliance/offerings/offering-iso-27001)

Learn how to [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

### New preview recommendation for Azure SQL Servers

We've added a new recommendation for Azure SQL Servers, `Azure SQL Server authentication mode should be Azure Active Directory Only (Preview)`.

The recommendation is based on the existing policy [`Azure SQL Database should have Azure Active Directory Only Authentication enabled`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fabda6d70-9778-44e7-84a8-06713e6db027)

This recommendation disables local authentication methods and allows only Azure Active Directory Authentication, which improves security by ensuring that Azure SQL Databases can exclusively be accessed by Azure Active Directory identities.

Learn how to [create servers with Azure AD-only authentication enabled in Azure SQL](/azure/azure-sql/database/authentication-azure-ad-only-authentication-create-server).

### New alert in Defender for Key Vault

Defender for Key Vault has the following new alert:

| Alert (alert type) | Description | MITRE tactics | Severity |
|---|---|:-:|---|
| **Denied access from a suspicious IP to a key vault**<br>(KV_SuspiciousIPAccessDenied) | An unsuccessful key vault access has been attempted by an IP that has been identified by Microsoft Threat Intelligence as a suspicious IP address. Though this attempt was unsuccessful, it indicates that your infrastructure might have been compromised. We recommend further investigations. | Credential Access | Low |

You can see a list of all of the [alerts available for Key Vault](alerts-reference.md).

## February 2023

Updates in February include:

- [Enhanced Cloud Security Explorer](#enhanced-cloud-security-explorer)
- [Defender for Containers' vulnerability scans of running Linux images now GA](#defender-for-containers-vulnerability-scans-of-running-linux-images-now-ga)
- [Announcing support for the AWS CIS 1.5.0 compliance standard](#announcing-support-for-the-aws-cis-150-compliance-standard)
- [Microsoft Defender for DevOps (preview) is now available in other regions](#microsoft-defender-for-devops-preview-is-now-available-in-other-regions)
- [The built-in policy [Preview]: Private endpoint should be configured for Key Vault is deprecated](#the-built-in-policy-preview-private-endpoint-should-be-configured-for-key-vault-is-deprecated)

### Enhanced Cloud Security Explorer

An improved version of the cloud security explorer includes a refreshed user experience that removes query friction dramatically, added the ability to run multicloud and multi-resource queries, and embedded documentation for each query option.

The Cloud Security Explorer now allows you to run cloud-abstract queries across resources. You can use either the prebuilt query templates or use the custom search to apply filters to build your query. Learn [how to manage Cloud Security Explorer](how-to-manage-cloud-security-explorer.md).

### Defender for Containers' vulnerability scans of running Linux images now GA

Defender for Containers detects vulnerabilities in running containers. Both Windows and Linux containers are supported.

In August 2022, this capability was [released in preview](release-notes-archive.md) for Windows and Linux. We're now releasing it for general availability (GA) for Linux.

When vulnerabilities are detected, Defender for Cloud generates the following security recommendation listing the scan's findings: [Running container images should have vulnerability findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462c/showSecurityCenterCommandBar~/false).

Learn more about [viewing vulnerabilities for running images](defender-for-containers-vulnerability-assessment-azure.md).

### Announcing support for the AWS CIS 1.5.0 compliance standard

Defender for Cloud now supports the CIS Amazon Web Services Foundations v1.5.0 compliance standard. The standard can be [added to your Regulatory Compliance dashboard](update-regulatory-compliance-packages.md#add-a-regulatory-standard-to-your-dashboard), and builds on MDC's existing offerings for multicloud recommendations and standards.

This new standard includes both existing and new recommendations that extend Defender for Cloud's coverage to new AWS services and resources.

Learn how to [Manage AWS assessments and standards](how-to-manage-aws-assessments-standards.md).

### Microsoft Defender for DevOps (preview) is now available in other regions

Microsoft Defender for DevOps has expanded its preview and is now available in the West Europe and East Australia regions, when you onboard your Azure DevOps and GitHub resources.

Learn more about [Microsoft Defender for DevOps](defender-for-devops-introduction.md).

### The built-in policy [Preview]: Private endpoint should be configured for Key Vault is deprecated

The built-in policy [`[Preview]: Private endpoint should be configured for Key Vault`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5f0bc445-3935-4915-9981-011aa2b46147) is deprecated and replaced with the [`[Preview]: Azure Key Vaults should use private link`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6abeaec-4d90-4a02-805f-6b26c4d3fbe9) policy.

Learn more about [integrating Azure Key Vault with Azure Policy](../key-vault/general/azure-policy.md#network-access).

## January 2023

Updates in January include:

- [The Endpoint protection (Microsoft Defender for Endpoint) component is now accessed in the Settings and monitoring page](#the-endpoint-protection-microsoft-defender-for-endpoint-component-is-now-accessed-in-the-settings-and-monitoring-page)
- [New version of the recommendation to find missing system updates (Preview)](#new-version-of-the-recommendation-to-find-missing-system-updates-preview)
- [Cleanup of deleted Azure Arc machines in connected AWS and GCP accounts](#cleanup-of-deleted-azure-arc-machines-in-connected-aws-and-gcp-accounts)
- [Allow continuous export to Event Hubs behind a firewall](#allow-continuous-export-to-event-hubs-behind-a-firewall)
- [The name of the Secure score control Protect your applications with Azure advanced networking solutions has changed](#the-name-of-the-secure-score-control-protect-your-applications-with-azure-advanced-networking-solutions-is-changed)
- [The policy Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports is deprecated](#the-policy-vulnerability-assessment-settings-for-sql-server-should-contain-an-email-address-to-receive-scan-reports-is-deprecated)
- [Recommendation to enable diagnostic logs for Virtual Machine Scale Sets is deprecated](#recommendation-to-enable-diagnostic-logs-for-virtual-machine-scale-sets-is-deprecated)

### The Endpoint protection (Microsoft Defender for Endpoint) component is now accessed in the Settings and monitoring page

To access Endpoint protection, navigate to **Environment settings** > **Defender plans** > **Settings and monitoring**. From here you can set Endpoint protection to **On**. You can also see the other components that are managed.

Learn more about [enabling Microsoft Defender for Endpoint](integration-defender-for-endpoint.md) on your servers with Defender for Servers.

### New version of the recommendation to find missing system updates (Preview)

You no longer need an agent on your Azure VMs and Azure Arc machines to make sure the machines have all of the latest security or critical system updates.

The new system updates recommendation, `System updates should be installed on your machines (powered by Azure Update Manager)` in the `Apply system updates` control, is based on the [Update Manager (preview)](../update-center/overview.md). The recommendation relies on a native agent embedded in every Azure VM and Azure Arc machines instead of an installed agent. The Quick Fix in the new recommendation leads you to a one-time installation of the missing updates in the Update Manager portal.

To use the new recommendation, you need to:

- Connect your non-Azure machines to Arc
- Turn on the [periodic assessment property](../update-center/assessment-options.md#periodic-assessment). You can use the Quick Fix in the new recommendation, `Machines should be configured to periodically check for missing system updates` to fix the recommendation.

The existing "System updates should be installed on your machines" recommendation, which relies on the Log Analytics agent, is still available under the same control.

### Cleanup of deleted Azure Arc machines in connected AWS and GCP accounts

A machine connected to an AWS and GCP account that is covered by Defender for Servers or Defender for SQL on machines is represented in Defender for Cloud as an Azure Arc machine. Until now, that machine wasn't deleted from the inventory when the machine was deleted from the AWS or GCP account. Leading to unnecessary Azure Arc resources left in Defender for Cloud that represents deleted machines.

Defender for Cloud will now automatically delete Azure Arc machines when those machines are deleted in connected AWS or GCP account.

### Allow continuous export to Event Hubs behind a firewall

You can now enable the continuous export of alerts and recommendations, as a trusted service to Event Hubs that are protected by an Azure firewall.

You can enable continuous export as the alerts or recommendations are generated. You can also define a schedule to send periodic snapshots of all of the new data.

Learn how to enable [continuous export to an Event Hubs behind an Azure firewall](continuous-export.md#continuously-export-to-an-event-hub-behind-a-firewall).

### The name of the Secure score control Protect your applications with Azure advanced networking solutions is changed

The secure score control, `Protect your applications with Azure advanced networking solutions` is changed to `Protect applications against DDoS attacks`.

The updated name is reflected on Azure Resource Graph (ARG), Secure Score Controls API and the `Download CSV report`.

### The policy Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports is deprecated

The policy [`Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F057d6cfe-9c4f-4a6d-bc60-14420ea1f1a9) is deprecated.

The Defender for SQL vulnerability assessment email report is still available and existing email configurations haven't changed.

### Recommendation to enable diagnostic logs for Virtual Machine Scale Sets is deprecated

The recommendation `Diagnostic logs in Virtual Machine Scale Sets should be enabled` is deprecated.

The related [policy definition](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c1b1214-f927-48bf-8882-84f0af6588b1) has also been deprecated from any standards displayed in the regulatory compliance dashboard.

| Recommendation | Description | Severity |
|--|--|--|
| Diagnostic logs in Virtual Machine Scale Sets should be enabled | Enable logs and retain them for up to a year, enabling you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. | Low |

## December 2022

Updates in December include:

- [Announcing express configuration for vulnerability assessment in Defender for SQL](#announcing-express-configuration-for-vulnerability-assessment-in-defender-for-sql)

### Announcing express configuration for vulnerability assessment in Defender for SQL

The express configuration for vulnerability assessment in Microsoft Defender for SQL provides security teams with a streamlined configuration experience on Azure SQL Databases and Dedicated SQL Pools outside of Synapse Workspaces.

With the express configuration experience for vulnerability assessments, security teams can:

- Complete the vulnerability assessment configuration in the security configuration of the SQL resource, without any another settings or dependencies on customer-managed storage accounts.
- Immediately add scan results to baselines so that the status of the finding changes from **Unhealthy** to **Healthy** without rescanning a database.
- Add multiple rules to baselines at once and use the latest scan results.
- Enable vulnerability assessment for all Azure SQL Servers when you turn on Microsoft Defender for databases at the subscription-level.

Learn more about [Defender for SQL vulnerability assessment](sql-azure-vulnerability-assessment-overview.md).

## November 2022

Updates in November include:

- [Protect containers across your GCP organization with Defender for Containers](#protect-containers-across-your-gcp-organization-with-defender-for-containers)
- [Validate Defender for Containers protections with sample alerts](#validate-defender-for-containers-protections-with-sample-alerts)
- [Governance rules at scale (Preview)](#governance-rules-at-scale-preview)
- [The ability to create custom assessments in AWS and GCP (Preview) is deprecated](#the-ability-to-create-custom-assessments-in-aws-and-gcp-preview-is-deprecated)
- [The recommendation to configure dead-letter queues for Lambda functions is deprecated](#the-recommendation-to-configure-dead-letter-queues-for-lambda-functions-is-deprecated)

### Protect containers across your GCP organization with Defender for Containers

Now you can enable [Defender for Containers](defender-for-containers-introduction.md) for your GCP environment to protect standard GKE clusters across an entire GCP organization. Just create a new GCP connector with Defender for Containers enabled or enable Defender for Containers on an existing organization level GCP connector.

Learn more about [connecting GCP projects and organizations](quickstart-onboard-gcp.md#connect-your-gcp-project) to Defender for Cloud.

### Validate Defender for Containers protections with sample alerts

You can now create sample alerts also for Defender for Containers plan. The new sample alerts are presented as being from AKS, Arc-connected clusters, EKS, and GKE resources with different severities and MITRE tactics. You can use the sample alerts to validate security alert configurations, such as SIEM integrations, workflow automation, and email notifications.

Learn more about [alert validation](alert-validation.md).

### Governance rules at scale (Preview)

We're happy to announce the new ability to apply governance rules at scale (Preview) in Defender for Cloud.

With this new experience, security teams are able to define governance rules in bulk for various scopes (subscriptions and connectors). Security teams can accomplish this task by using management scopes such as Azure management groups, AWS top level accounts or GCP organizations.

Additionally, the Governance rules (Preview) page presents all of the available governance rules that are effective in the organization’s environments.

Learn more about the [new governance rules at-scale experience](governance-rules.md).

> [!NOTE]
> As of January 1, 2023, in order to experience the capabilities offered by Governance, you must have the [Defender CSPM plan](concept-cloud-security-posture-management.md) enabled on your subscription or connector.

### The ability to create custom assessments in AWS and GCP (Preview) is deprecated

The ability to create custom assessments for [AWS accounts](how-to-manage-aws-assessments-standards.md) and [GCP projects](how-to-manage-gcp-assessments-standards.md), which was a Preview feature, is deprecated.

### The recommendation to configure dead-letter queues for Lambda functions is deprecated

The recommendation [`Lambda functions should have a dead-letter queue configured`](https://portal.azure.com/#view/Microsoft_Azure_Security/AwsRecommendationDetailsBlade/assessmentKey/dcf10b98-798f-4734-9afd-800916bf1e65/showSecurityCenterCommandBar~/false) is deprecated.

| Recommendation | Description | Severity |
|--|--|--|
| Lambda functions should have a dead-letter queue configured | This control checks whether a Lambda function is configured with a dead-letter queue. The control fails if the Lambda function isn't configured with a dead-letter queue. As an alternative to an on-failure destination, you can configure your function with a dead-letter queue to save discarded events for further processing. A dead-letter queue acts the same as an on-failure destination. It's used when an event fails all processing attempts or expires without being processed. A dead-letter queue allows you to look back at errors or failed requests to your Lambda function to debug or identify unusual behavior. From a security perspective, it's important to understand why your function failed and to ensure that your function doesn't drop data or compromise data security as a result. For example, if your function can't communicate to an underlying resource that could be a symptom of a denial of service (DoS) attack elsewhere in the network. | Medium |

## October 2022

Updates in October include:

- [Announcing the Microsoft cloud security benchmark](#announcing-the-microsoft-cloud-security-benchmark)
- [Attack path analysis and contextual security capabilities in Defender for Cloud (Preview)](#attack-path-analysis-and-contextual-security-capabilities-in-defender-for-cloud-preview)
- [Agentless scanning for Azure and AWS machines (Preview)](#agentless-scanning-for-azure-and-aws-machines-preview)
- [Defender for DevOps (Preview)](#defender-for-devops-preview)
- [Regulatory Compliance Dashboard now supports manual control management and detailed information on Microsoft's compliance status](#regulatory-compliance-dashboard-now-supports-manual-control-management-and-detailed-information-on-microsofts-compliance-status)
- [Autoprovisioning is renamed to Settings & monitoring and has an updated experience](#autoprovisioning-is-renamed-to-settings--monitoring-and-has-an-updated-experience)
- [Defender Cloud Security Posture Management (CSPM) (Preview)](#defender-cloud-security-posture-management-cspm)
- [MITRE ATT&CK framework mapping is now available also for AWS and GCP security recommendations](#mitre-attck-framework-mapping-is-now-available-also-for-aws-and-gcp-security-recommendations)
- [Defender for Containers now supports vulnerability assessment for Elastic Container Registry (Preview)](#defender-for-containers-now-supports-vulnerability-assessment-for-elastic-container-registry-preview)

### Announcing the Microsoft cloud security benchmark

The [Microsoft cloud security benchmark](/security/benchmark/azure/introduction) (MCSB) is a new framework defining fundamental cloud security principles based on common industry standards and compliance frameworks. Together with detailed technical guidance for implementing these best practices across cloud platforms. MCSB is replacing the Azure Security Benchmark. MCSB provides prescriptive details for how to implement its cloud-agnostic security recommendations on multiple cloud service platforms, initially covering Azure and AWS.

You can now monitor your cloud security compliance posture per cloud in a single, integrated dashboard. You can see MCSB as the default compliance standard when you navigate to Defender for Cloud's regulatory compliance dashboard.

Microsoft cloud security benchmark is automatically assigned to your Azure subscriptions and AWS accounts when you onboard Defender for Cloud.

Learn more about the [Microsoft cloud security benchmark](concept-regulatory-compliance.md).

### Attack path analysis and contextual security capabilities in Defender for Cloud (Preview)

The new cloud security graph, attack path analysis and contextual cloud security capabilities are now available in Defender for Cloud in preview.

One of the biggest challenges that security teams face today is the number of security issues they face on a daily basis. There are numerous security issues that need to be resolved and never enough resources to address them all.

Defender for Cloud's new cloud security graph and attack path analysis capabilities gives security teams the ability to assess the risk behind each security issue. Security teams can also identify the highest risk issues that need to be resolved soonest. Defender for Cloud works with security teams to reduce the risk of an affectful breach to their environment in the most effective way.

Learn more about the new [cloud security graph, attack path analysis, and the cloud security explorer](concept-attack-path.md).

### Agentless scanning for Azure and AWS machines (Preview)

Until now, Defender for Cloud based its posture assessments for VMs on agent-based solutions. To help customers maximize coverage and reduce onboarding and management friction, we're releasing agentless scanning for VMs to preview.

With agentless scanning for VMs, you get wide visibility on installed software and software CVEs. You get the visibility without the challenges of agent installation and maintenance, network connectivity requirements, and performance affect on your workloads. The analysis is powered by Microsoft Defender vulnerability management.

Agentless vulnerability scanning is available in both Defender Cloud Security Posture Management (CSPM) and in [Defender for Servers P2](defender-for-servers-introduction.md), with native support for AWS and Azure VMs.

- Learn more about [agentless scanning](concept-agentless-data-collection.md).
- Find out how to enable [agentless vulnerability assessment](enable-vulnerability-assessment-agentless.md).

### Defender for DevOps (Preview)

Microsoft Defender for Cloud enables comprehensive visibility, posture management, and threat protection across hybrid and multicloud environments including Azure, AWS, Google, and on-premises resources.

Now, the new Defender for DevOps plan integrates source code management systems, like GitHub and Azure DevOps, into Defender for Cloud. With this new integration, we're empowering security teams to protect their resources from code to cloud.

Defender for DevOps allows you to gain visibility into and manage your connected developer environments and code resources. Currently, you can connect [Azure DevOps](quickstart-onboard-devops.md) and [GitHub](quickstart-onboard-github.md) systems to Defender for Cloud and onboard DevOps repositories to Inventory and the new DevOps Security page. It provides security teams with a high-level overview of the discovered security issues that exist within them in a unified DevOps Security page.

You can configure annotations on pull requests, to help developers address secret scanning findings in Azure DevOps directly on their pull requests.

You can configure the Microsoft Security DevOps tools on Azure Pipelines and GitHub workflows to enable the following security scans:

| Name | Language | License |
|--|--|--|
| [Bandit](https://github.com/PyCQA/bandit) | Python | [Apache License 2.0](https://github.com/PyCQA/bandit/blob/main/LICENSE) |
| [BinSkim](https://github.com/Microsoft/binskim) | Binary – Windows, ELF | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [ESlint](https://github.com/eslint/eslint) | JavaScript | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [CredScan](https://secdevtools.azurewebsites.net/helpcredscan.html) (Azure DevOps Only) | Credential Scanner (also known as CredScan) is a tool developed and maintained by Microsoft to identify credential leaks such as those in source code and configuration files common types: default passwords, SQL connection strings, Certificates with private keys| Not Open Source |
| [Template Analyze](https://github.com/Azure/template-analyzer) | ARM template, Bicep file | [MIT License](https://github.com/microsoft/binskim/blob/main/LICENSE) |
| [Terrascan](https://github.com/tenable/terrascan) | Terraform (HCL2), Kubernetes (JSON/YAML), Helm v3, Kustomize, Dockerfiles, Cloud Formation | [Apache License 2.0](https://github.com/tenable/terrascan/blob/master/LICENSE) |
| [Trivy](https://github.com/aquasecurity/trivy) | Container images, file systems, git repositories | [Apache License 2.0](https://github.com/tenable/terrascan/blob/master/LICENSE) |

The following new recommendations are now available for DevOps:

| Recommendation | Description | Severity |
|--|--|--|
| (Preview) [Code repositories should have code scanning findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsWithRulesBlade/assessmentKey/c68a8c2a-6ed4-454b-9e37-4b7654f2165f/showSecurityCenterCommandBar~/false) | Defender for DevOps has found vulnerabilities in code repositories. To improve the security posture of the repositories, it's highly recommended to remediate these vulnerabilities. (No related policy) | Medium |
| (Preview) [Code repositories should have secret scanning findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsWithRulesBlade/assessmentKey/4e07c7d0-e06c-47d7-a4a9-8c7b748d1b27/showSecurityCenterCommandBar~/false) | Defender for DevOps has found a secret in code repositories.  This should be remediated immediately to prevent a security breach.  Secrets found in repositories can be leaked or discovered by adversaries, leading to compromise of an application or service. For Azure DevOps, the Microsoft Security DevOps CredScan tool only scans builds on which it's configured to run. Therefore, results may not reflect the complete status of secrets in your repositories. (No related policy) | High |
| (Preview) [Code repositories should have Dependabot scanning findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/822425e3-827f-4f35-bc33-33749257f851/showSecurityCenterCommandBar~/false) | Defender for DevOps has found vulnerabilities in code repositories. To improve the security posture of the repositories, it's highly recommended to remediate these vulnerabilities. (No related policy) | Medium |
| (Preview) [Code repositories should have infrastructure as code scanning findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/2ebc815f-7bc7-4573-994d-e1cc46fb4a35/showSecurityCenterCommandBar~/false) | (Preview) Code repositories should have infrastructure as code scanning findings resolved | Medium |
| (Preview) [GitHub repositories should have code scanning enabled](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6672df26-ff2e-4282-83c3-e2f20571bd11/showSecurityCenterCommandBar~/false) | GitHub uses code scanning to analyze code in order to find security vulnerabilities and errors in code. Code scanning can be used to find, triage, and prioritize fixes for existing problems in your code. Code scanning can also prevent developers from introducing new problems. Scans can be scheduled for specific days and times, or scans can be triggered when a specific event occurs in the repository, such as a push. If code scanning finds a potential vulnerability or error in code, GitHub displays an alert in the repository. A vulnerability is a problem in a project's code that could be exploited to damage the confidentiality, integrity, or availability of the project. (No related policy) | Medium |
| (Preview) [GitHub repositories should have secret scanning enabled](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/1a600c61-6443-4ab4-bd28-7a6b6fb4691d/showSecurityCenterCommandBar~/false) | GitHub scans repositories for known types of secrets, to prevent fraudulent use of secrets that were accidentally committed to repositories. Secret scanning will scan the entire Git history on all branches present in the GitHub repository for any secrets. Examples of secrets are tokens and private keys that a service provider can issue for authentication. If a secret is checked into a repository, anyone who has read access to the repository can use the secret to access the external service with those privileges. Secrets should be stored in a dedicated, secure location outside the repository for the project. (No related policy) | High |
| (Preview) [GitHub repositories should have Dependabot scanning enabled](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/92643c1f-1a95-4b68-bbd2-5117f92d6e35/showSecurityCenterCommandBar~/false) | GitHub sends Dependabot alerts when it detects vulnerabilities in code dependencies that affect repositories. A vulnerability is a problem in a project's code that could be exploited to damage the confidentiality, integrity, or availability of the project or other projects that use its code. Vulnerabilities vary in type, severity, and method of attack. When code depends on a package that has a security vulnerability, this vulnerable dependency can cause a range of problems. (No related policy) | Medium |

The Defender for DevOps recommendations replaced the deprecated vulnerability scanner for CI/CD workflows that was included in Defender for Containers.

Learn more about [Defender for DevOps](defender-for-devops-introduction.md)

### Regulatory Compliance dashboard now supports manual control management and detailed information on Microsoft's compliance status

The compliance dashboard in Defender for Cloud is a key tool for customers to help them understand and track their compliance status. Customers can continuously monitor environments in accordance with requirements from many different standards and regulations.

Now, you can fully manage your compliance posture by manually attesting to operational and other controls. You can now provide evidence of compliance for controls that aren't automated. Together with the automated assessments, you can now generate a full report of compliance within a selected scope, addressing the entire set of controls for a given standard.

In addition, with richer control information and in-depth details and evidence for Microsoft's compliance status, you now have all of the information required for audits at your fingertips.

Some of the new benefits include:

- **Manual customer actions** provide a mechanism for manually attesting compliance with non-automated controls. Including the ability to link evidence, set a compliance date and expiration date.

- Richer control details for supported standards that showcase **Microsoft actions** and **manual customer actions** in addition to the already existing automated customer actions.

- Microsoft actions provide transparency into Microsoft’s compliance status that includes audit assessment procedures, test results, and Microsoft responses to deviations.

- **Compliance offerings** provide a central location to check Azure, Dynamics 365, and Power Platform products and their respective regulatory compliance certifications.

Learn more on how to [Improve your regulatory compliance](regulatory-compliance-dashboard.md) with Defender for Cloud.

### Autoprovisioning is renamed to Settings & monitoring and has an updated experience

We've renamed the Autoprovisioning page to **Settings & monitoring**.

Autoprovisioning was meant to allow at-scale enablement of prerequisites, which are needed by Defender for Cloud's advanced features and capabilities. To better support our expanded capabilities, we're launching a new experience with the following changes:

**The Defender for Cloud's plans page now includes**:

- When you enable a Defender plan that requires monitoring components, those components are enabled for automatic provisioning with default settings. These settings can optionally be edited at any time.
- You can access the monitoring component settings for each Defender plan from the Defender plan page.
- The Defender plans page clearly indicates whether all the monitoring components are in place for each Defender plan, or if your monitoring coverage is incomplete.

**The Settings & monitoring page**:

- Each monitoring component indicates the Defender plans to which it's related.

Learn more about [managing your monitoring settings](monitoring-components.md).

### Defender Cloud Security Posture Management (CSPM)

One of Microsoft Defender for Cloud's main pillars for cloud security is Cloud Security Posture Management (CSPM). CSPM provides you with hardening guidance that helps you efficiently and effectively improve your security. CSPM also gives you visibility into your current security situation.

We're announcing a new Defender plan: Defender CSPM. This plan enhances the security capabilities of Defender for Cloud and includes the following new and expanded features:

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

The MITRE ATT&CK framework is integrated in three ways:

- Recommendations map to MITRE ATT&CK tactics and techniques.
- Query MITRE ATT&CK tactics and techniques on recommendations using the Azure Resource Graph.

:::image type="content" source="media/release-notes/mitre-screenshot.jpg" alt-text="Screenshot that shows where the MITRE attack exists in the Azure portal. ":::

### Defender for Containers now supports vulnerability assessment for Elastic Container Registry (Preview)

Microsoft Defender for Containers now provides agentless vulnerability assessment scanning for Elastic Container Registry (ECR) in Amazon AWS. Expanding on coverage for multicloud environments, building on the release earlier this year of advanced threat protection and Kubernetes environment hardening for AWS and Google GCP. The agentless model creates AWS resources in your accounts to scan your images without extracting images out of your AWS accounts and with no footprint on your workload.

Agentless vulnerability assessment scanning for images in ECR repositories helps reduce the attack surface of your containerized estate by continuously scanning images to identify and manage container vulnerabilities. With this new release, Defender for Cloud scans container images after they're pushed to the repository and continually reassess the ECR container images in the registry. The findings are available in Microsoft Defender for Cloud as recommendations, and you can use Defender for Cloud's built-in automated workflows to take action on the findings, such as opening a ticket for fixing a high severity vulnerability in an image.

Learn more about [vulnerability assessment for Amazon ECR images](defender-for-containers-vulnerability-assessment-elastic.md).

## September 2022

Updates in September include:

- [Suppress alerts based on Container and Kubernetes entities](#suppress-alerts-based-on-container-and-kubernetes-entities)
- [Defender for Servers supports File Integrity Monitoring with Azure Monitor Agent](#defender-for-servers-supports-file-integrity-monitoring-with-azure-monitor-agent)
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

File integrity monitoring (FIM) examines operating system files and registries for changes that might indicate an attack.

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

- **Extended evaluation scope** – Coverage is improved for identity accounts without MFA and external accounts on Azure resources (instead of subscriptions only) which allows your security administrators to view role assignments per account.

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

When vulnerabilities are detected, Defender for Cloud generates the following security recommendation listing the detected issues: [Running container images should have vulnerability findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462c/showSecurityCenterCommandBar~/false).

Learn more about [viewing vulnerabilities for running images](defender-for-containers-vulnerability-assessment-azure.md#view-vulnerabilities-for-images-running-on-your-aks-clusters).

### Azure Monitor Agent integration now in preview

Defender for Cloud now includes preview support for the [Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) (AMA). AMA is intended to replace the legacy Log Analytics agent (also referred to as the Microsoft Monitoring Agent (MMA)), which is on a path to deprecation. AMA [provides many benefits](../azure-monitor/agents/azure-monitor-agent-migration.md#benefits) over legacy agents.

In Defender for Cloud, when you [enable autoprovisioning for AMA](auto-deploy-azure-monitoring-agent.md), the agent is deployed on **existing and new** VMs and Azure Arc-enabled machines that are detected in your subscriptions. If Defenders for Cloud plans are enabled, AMA collects configuration information and event logs from Azure VMs and Azure Arc machines. The AMA integration is in preview, so we recommend using it in test environments, rather than in production environments.

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

The security agent enablement is available through autoprovisioning, recommendations flow, AKS RP or at scale using Azure Policy.

You can [deploy the Defender agent](./defender-for-containers-enable.md?pivots=defender-for-container-aks&tabs=aks-deploy-portal%2ck8s-deploy-asc%2ck8s-verify-asc%2ck8s-remove-arc%2caks-removeprofile-api#deploy-the-defender-agent) today on your AKS clusters.

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
- [Autoprovisioning of Microsoft Defender for Endpoint unified solution](#autoprovisioning-of-microsoft-defender-for-endpoint-unified-solution)
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

The ability to filter, sort and group by resource group is added to the Security alerts page.

A resource group column is added to the alerts grid.

:::image type="content" source="media/release-notes/resource-column.png" alt-text="Screenshot of the newly added resource group column." lightbox="media/release-notes/resource-column.png":::

A new filter is added which allows you to view all of the alerts for specific resource groups.

:::image type="content" source="media/release-notes/filter-by-resource-group.png" alt-text="Screenshot that shows the new resource group filter." lightbox="media/release-notes/filter-by-resource-group.png":::

You can now also group your alerts by resource group to view all of your alerts for each of your resource groups.

:::image type="content" source="media/release-notes/group-by-resource.png" alt-text="Screenshot that shows how to view your alerts when they're grouped by resource group." lightbox="media/release-notes/group-by-resource.png":::

### Autoprovisioning of Microsoft Defender for Endpoint unified solution

Until now, the integration with Microsoft Defender for Endpoint (MDE) included automatic installation of the new [MDE unified solution](/microsoft-365/security/defender-endpoint/configure-server-endpoints#new-windows-server-2012-r2-and-2016-functionality-in-the-modern-unified-solution&preserve-view=true) for machines (Azure subscriptions and multicloud connectors) with Defender for Servers Plan 1 enabled, and for multicloud connectors with Defender for Servers Plan 2 enabled. Plan 2 for Azure subscriptions enabled the unified solution for Linux machines and Windows 2019 and 2022 servers only. Windows servers 2012R2 and 2016 used the MDE legacy solution dependent on Log Analytics agent.

Now, the new unified solution is available for all machines in both plans, for both Azure subscriptions and multicloud connectors. For Azure subscriptions with Servers Plan 2 that enabled MDE integration *after* June 20, 2022, the unified solution is enabled by default for all machines Azure subscriptions with the Defender for Servers Plan 2 enabled with MDE integration *before* June 20, 2022 can now enable unified solution installation for Windows servers 2012R2 and 2016 through the dedicated button in the Integrations page:

Learn more about [MDE integration with Defender for Servers](integration-defender-for-endpoint.md#users-with-defender-for-servers-enabled-and-microsoft-defender-for-endpoint-deployed).

### Deprecating the "API App should only be accessible over HTTPS" policy

The policy `API App should only be accessible over HTTPS` is deprecated. This policy is replaced with the `Web Application should only be accessible over HTTPS` policy, which is renamed to `App Service apps should only be accessible over HTTPS`.

To learn more about policy definitions for Azure App Service, see [Azure Policy built-in definitions for Azure App Service](../azure-app-configuration/policy-reference.md).

### New Key Vault alerts

To expand the threat protections provided by Microsoft Defender for Key Vault, we've added two new alerts.

These alerts inform you of an access denied anomaly, is detected for any of your key vaults.

| Alert (alert type) | Description | MITRE tactics | Severity |
|--|--|--|--|
| **Unusual access denied - User accessing high volume of key vaults denied**<br>(KV_DeniedAccountVolumeAnomaly) | A user or service principal has attempted access to anomalously high volume of key vaults in the last 24 hours. This anomalous access pattern may be legitimate activity. Though this attempt was unsuccessful, it could be an indication of a possible attempt to gain access of key vault and the secrets contained within it. We recommend further investigations. | Discovery | Low |
| **Unusual access denied - Unusual user accessing key vault denied**<br>(KV_UserAccessDeniedAnomaly) | A key vault access was attempted by a user that doesn't normally access it, this anomalous access pattern may be legitimate activity. Though this attempt was unsuccessful, it could be an indication of a possible attempt to gain access of key vault and the secrets contained within it.  | Initial Access, Discovery | Low |

## May 2022

Updates in May include:

- [Multicloud settings of Servers plan are now available in connector level](#multicloud-settings-of-servers-plan-are-now-available-in-connector-level)
- [JIT (Just-in-time) access for VMs is now available for AWS EC2 instances (Preview)](#jit-just-in-time-access-for-vms-is-now-available-for-aws-ec2-instances-preview)
- [Add and remove the Defender agent for AKS clusters using the CLI](#add-and-remove-the-defender-agent-for-aks-clusters-using-the-cli)

### Multicloud settings of Servers plan are now available in connector level

There are now connector-level settings for Defender for Servers in multicloud.

The new connector-level settings provide granularity for pricing and autoprovisioning configuration per connector, independently of the subscription.

All autoprovisioning components available in the connector-level (Azure Arc, MDE, and vulnerability assessments) are enabled by default, and the new configuration supports both [Plan 1 and Plan 2 pricing tiers](plan-defender-for-servers-select-plan.md#plan-features).

Updates in the UI include a reflection of the selected pricing tier and the required components configured.

:::image type="content" source="media/release-notes/main-page.png" alt-text="Screenshot of the main plan page with the Server plan multicloud settings." lightbox="media/release-notes/main-page.png":::

:::image type="content" source="media/release-notes/auto-provision.png" alt-text="Screenshot of the autoprovision page with the multicloud connector enabled.":::

### Changes to vulnerability assessment

Defender for Containers now displays vulnerabilities that have medium and low severities that aren't patchable.

As part of this update, vulnerabilities that have medium and low severities are now shown, whether or not patches are available. This update provides maximum visibility, but still allows you to filter out undesired vulnerabilities by using the provided Disable rule.

:::image type="content" source="media/release-notes/disable-rule.png" alt-text="Screenshot of the disable rule screen.":::

Learn more about [vulnerability management](deploy-vulnerability-assessment-defender-vulnerability-management.md)

### JIT (Just-in-time) access for VMs is now available for AWS EC2 instances (Preview)

When you [connect AWS accounts](quickstart-onboard-aws.md), JIT will automatically evaluate the network configuration of your instance's security groups and recommend which instances need protection for their exposed management ports. This is similar to how JIT works with Azure. When you onboard unprotected EC2 instances, JIT will block public access to the management ports, and only open them with authorized requests for a limited time frame.

Learn how [JIT protects your AWS EC2 instances](just-in-time-access-overview.md#how-jit-operates-with-network-resources-in-azure-and-aws)

### Add and remove the Defender agent for AKS clusters using the CLI

The [Defender agent](defender-for-cloud-glossary.md#defender-agent) is required for Defender for Containers to provide the runtime protections and collects signals from nodes. You can now use the Azure CLI to [add and remove the Defender agent](defender-for-containers-enable.md?tabs=k8s-deploy-cli%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Ck8s-remove-cli&pivots=defender-for-container-aks#use-azure-cli-to-deploy-the-defender-agent) for an AKS cluster.

> [!NOTE]
> This option is included in [Azure CLI 3.7 and above](/cli/azure/update-azure-cli).

## April 2022

Updates in April include:

- [New Defender for Servers plans](#new-defender-for-servers-plans)
- [Relocation of custom recommendations](#relocation-of-custom-recommendations)
- [PowerShell script to stream alerts to Splunk and QRadar](#powershell-script-to-stream-alerts-to-splunk-and-ibm-qradar)
- [Deprecated the Azure Cache for Redis recommendation](#deprecated-the-azure-cache-for-redis-recommendation)
- [New alert variant for Microsoft Defender for Storage (preview) to detect exposure of sensitive data](#new-alert-variant-for-microsoft-defender-for-storage-preview-to-detect-exposure-of-sensitive-data)
- [Container scan alert title augmented with IP address reputation](#container-scan-alert-title-augmented-with-ip-address-reputation)
- [See the activity logs that relate to a security alert](#see-the-activity-logs-that-relate-to-a-security-alert)

### New Defender for Servers plans

Microsoft Defender for Servers is now offered in two incremental plans:

- Defender for Servers Plan 2, formerly Defender for Servers
- Defender for Servers Plan 1, provides support for Microsoft Defender for Endpoint only

While Defender for Servers Plan 2 continues to provide protections from threats and vulnerabilities to your cloud and on-premises workloads, Defender for Servers Plan 1 provides endpoint protection only, powered by the natively integrated Defender for Endpoint. Read more about the [Defender for Servers plans](plan-defender-for-servers-select-plan.md#plan-features).

If you have been using Defender for Servers until now no action is required.

In addition, Defender for Cloud also begins gradual support for the [Defender for Endpoint unified agent for Windows Server 2012 R2 and 2016](https://techcommunity.microsoft.com/t5/microsoft-defender-for-endpoint/defending-windows-server-2012-r2-and-2016/ba-p/2783292). Defender for Servers Plan 1 deploys the new unified agent to Windows Server 2012 R2 and 2016 workloads.

### Relocation of custom recommendations

Custom recommendations are those created by users and have no effect on the secure score. The custom recommendations can now be found under the All recommendations tab.

Use the new "recommendation type" filter, to locate custom recommendations.

Learn more in [Create custom security initiatives and policies](custom-security-policies.md).

### PowerShell script to stream alerts to Splunk and IBM QRadar

We recommend that you use Event Hubs and a built-in connector to export security alerts to Splunk and IBM QRadar. Now you can use a PowerShell script to set up the Azure resources needed to export security alerts for your subscription or tenant.

Just download and run the PowerShell script. After you provide a few details of your environment, the script configures the resources for you. The script then produces output that you use in the SIEM platform to complete the integration.

To learn more, see [Stream alerts to Splunk and QRadar](export-to-siem.md#stream-alerts-to-qradar-and-splunk).

### Deprecated the Azure Cache for Redis recommendation

The recommendation `Azure Cache for Redis should reside within a virtual network` (Preview) is deprecated. We’ve changed our guidance for securing Azure Cache for Redis instances. We recommend the use of a private endpoint to restrict access to your Azure Cache for Redis instance, instead of a virtual network.

### New alert variant for Microsoft Defender for Storage (preview) to detect exposure of sensitive data

Microsoft Defender for Storage's alerts notifies you when threat actors attempt to scan and expose, successfully or not, misconfigured, publicly open storage containers to try to exfiltrate sensitive information.

To allow for faster triaging and response time, when exfiltration of potentially sensitive data may have occurred, we've released a new variation to the existing `Publicly accessible storage containers have been exposed` alert.

The new alert, `Publicly accessible storage containers with potentially sensitive data have been exposed`, is triggered with a `High` severity level, after a successful discovery of a publicly open storage container(s) with names that statistically have been found to rarely be exposed publicly, suggesting they might hold sensitive information.

| Alert (alert type) | Description | MITRE tactic | Severity |
|--|--|--|--|
|**PREVIEW - Publicly accessible storage containers with potentially sensitive data have been exposed** <br>(Storage.Blob_OpenContainersScanning.SuccessfulDiscovery.Sensitive)| Someone has scanned your Azure Storage account and exposed container(s) that allow public access. One or more of the exposed containers have names that indicate that they may contain sensitive data. <br> <br> This usually indicates reconnaissance by a threat actor that is scanning for misconfigured publicly accessible storage containers that may contain sensitive data. <br> <br> After a threat actor successfully discovers a container, they may continue by exfiltrating the data. <br> ✔ Azure Blob Storage <br> ✖ Azure Files <br> ✖ Azure Data Lake Storage Gen2 | Collection  | High |

### Container scan alert title augmented with IP address reputation

An IP address's reputation can indicate whether the scanning activity originates from a known threat actor, or from an actor that is using the Tor network to hide their identity. Both of these indicators, suggest that there's malicious intent. The IP address's reputation is provided by [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684).

The addition of the IP address's reputation to the alert title provides a way to quickly evaluate the intent of the actor, and thus the severity of the threat.  

The following alerts will include this information:

- `Publicly accessible storage containers have been exposed`

- `Publicly accessible storage containers with potentially sensitive data have been exposed`

- `Publicly accessible storage containers have been scanned. No publicly accessible data was discovered`

For example, the added information to the title of the `Publicly accessible storage containers have been exposed` alert will look like this:

- `Publicly accessible storage containers have been exposed`**`by a suspicious IP address`**

- `Publicly accessible storage containers have been exposed`**`by a Tor exit node`**

All of the alerts for Microsoft Defender for Storage will continue to include threat intelligence information in the IP entity under the alert's Related Entities section.

### See the activity logs that relate to a security alert

As part of the actions you can take to [evaluate a security alert](managing-and-responding-alerts.md#respond-to-security-alerts), you can find the related platform logs in **Inspect resource context** to gain context about the affected resource.
Microsoft Defender for Cloud identifies platform logs that are within one day of the alert.

The platform logs can help you evaluate the security threat and identify steps that you can take to mitigate the identified risk.

## March 2022

Updates in March include:

- [Global availability of Secure Score for AWS and GCP environments](#global-availability-of-secure-score-for-aws-and-gcp-environments)
- [Deprecated the recommendations to install the network traffic data collection agent](#deprecated-the-recommendations-to-install-the-network-traffic-data-collection-agent)
- [Defender for Containers can now scan for vulnerabilities in Windows images (preview)](#defender-for-containers-can-now-scan-for-vulnerabilities-in-windows-images-preview)
- [New alert for Microsoft Defender for Storage (preview)](#new-alert-for-microsoft-defender-for-storage-preview)
- [Configure email notifications settings from an alert](#configure-email-notifications-settings-from-an-alert)
- [Deprecated preview alert: ARM.MCAS_ActivityFromAnonymousIPAddresses](#deprecated-preview-alert-armmcas_activityfromanonymousipaddresses)
- [Moved the recommendation Vulnerabilities in container security configurations should be remediated from the secure score to best practices](#moved-the-recommendation-vulnerabilities-in-container-security-configurations-should-be-remediated-from-the-secure-score-to-best-practices)
- [Deprecated the recommendation to use service principals to protect your subscriptions](#deprecated-the-recommendation-to-use-service-principals-to-protect-your-subscriptions)
- [Legacy implementation of ISO 27001 replaced with new ISO 27001:2013 initiative](#legacy-implementation-of-iso-27001-replaced-with-new-iso-270012013-initiative)
- [Deprecated Microsoft Defender for IoT device recommendations](#deprecated-microsoft-defender-for-iot-device-recommendations)
- [Deprecated Microsoft Defender for IoT device alerts](#deprecated-microsoft-defender-for-iot-device-alerts)
- [Posture management and threat protection for AWS and GCP released for general availability (GA)](#posture-management-and-threat-protection-for-aws-and-gcp-released-for-general-availability-ga)
- [Registry scan for Windows images in ACR added support for national clouds](#registry-scan-for-windows-images-in-acr-added-support-for-national-clouds)

### Global availability of Secure Score for AWS and GCP environments

The cloud security posture management capabilities provided by Microsoft Defender for Cloud, has now added support for your AWS and GCP environments within your Secure Score.

Enterprises can now view their overall security posture, across various environments, such as Azure, AWS and GCP.

The Secure Score page is replaced with the Security posture dashboard. The Security posture dashboard allows you to view an overall combined score for all of your environments, or a breakdown of your security posture based on any combination of environments that you choose.

The Recommendations page has also been redesigned to provide new capabilities such as: cloud environment selection, advanced filters based on content (resource group, AWS account, GCP project and more), improved user interface on low resolution, support for open query in resource graph, and more. You can learn more about your overall [security posture](secure-score-security-controls.md) and [security recommendations](review-security-recommendations.md).

### Deprecated the recommendations to install the network traffic data collection agent

Changes in our roadmap and priorities have removed the need for the network traffic data collection agent. The following two recommendations and their related policies were deprecated.  

|Recommendation |Description |Severity |
|---|---|---|
| Network traffic data collection agent should be installed on Linux virtual machines|Defender for Cloud uses the Microsoft Dependency agent to collect network traffic data from your Azure virtual machines to enable advanced network protection features such as traffic visualization on the network map, network hardening recommendations and specific network threats. |Medium |
| Network traffic data collection agent should be installed on Windows virtual machines |Defender for Cloud uses the Microsoft Dependency agent to collect network traffic data from your Azure virtual machines to enable advanced network protection features such as traffic visualization on the network map, network hardening recommendations, and specific network threats. |Medium |

### Defender for Containers can now scan for vulnerabilities in Windows images (preview)

Defender for Container's image scan now supports Windows images that are hosted in Azure Container Registry. This feature is free while in preview, and will incur a cost when it becomes generally available.

Learn more in [Use Microsoft Defender for Container to scan your images for vulnerabilities](defender-for-containers-vulnerability-assessment-azure.md).

### New alert for Microsoft Defender for Storage (preview)

To expand the threat protections provided by Microsoft Defender for Storage, we've added a new preview alert.

Threat actors use applications and tools to discover and access storage accounts. Microsoft Defender for Storage detects these applications and tools so that you can block them and remediate your posture.

This preview alert is called `Access from a suspicious application`. The alert is relevant to Azure Blob Storage, and ADLS Gen2 only.

| Alert (alert type) | Description | MITRE tactic | Severity |
|--|--|--|--|
| **PREVIEW - Access from a suspicious application**<br>(Storage.Blob_SuspiciousApp) | Indicates that a suspicious application has successfully accessed a container of a storage account with authentication.<br>This might indicate that an attacker has obtained the credentials necessary to access the account, and is exploiting it. This could also be an indication of a penetration test carried out in your organization.<br>Applies to: Azure Blob Storage, Azure Data Lake Storage Gen2 | Initial Access | Medium |

### Configure email notifications settings from an alert

A new section was added to the alert User Interface (UI) which allows you to view and edit who will receive email notifications for alerts that are triggered on the current subscription.

:::image type="content" source="media/release-notes/configure-email.png" alt-text="Screenshot of the new UI showing how to configure email notification.":::

Learn how to [Configure email notifications for security alerts](configure-email-notifications.md).

### Deprecated preview alert: ARM.MCAS_ActivityFromAnonymousIPAddresses

The following preview alert is deprecated:

|Alert name| Description|
|----------------------|---------------------------|
|**PREVIEW - Activity from a risky IP address**<br>(ARM.MCAS_ActivityFromAnonymousIPAddresses)|Users activity from an IP address that has been identified as an anonymous proxy IP address has been detected.<br>These proxies are used by people who want to hide their device's IP address, and can be used for malicious intent. This detection uses a machine learning algorithm that reduces false positives, such as mis-tagged IP addresses that are widely used by users in the organization.<br>Requires an active Microsoft Defender for Cloud Apps license.|

A new alert was created that provides this information and adds to it. In addition, the newer alerts (ARM_OperationFromSuspiciousIP, ARM_OperationFromSuspiciousProxyIP) don't require a license for Microsoft Defender for Cloud Apps (formerly known as Microsoft Cloud App Security).

See more alerts for [Resource Manager](alerts-reference.md#alerts-resourcemanager).

### Moved the recommendation Vulnerabilities in container security configurations should be remediated from the secure score to best practices

The recommendation `Vulnerabilities in container security configurations should be remediated` was moved from the secure score section to best practices section.

The current user experience only provides the score when all compliance checks have passed. Most customers have difficulties with meeting all the required checks. We're working on an improved experience for this recommendation, and once released the recommendation will be moved back to the secure score.

### Deprecated the recommendation to use service principals to protect your subscriptions

As organizations move away from using management certificates to manage their subscriptions, and [our recent announcement that we're retiring the Cloud Services (classic) deployment model](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/), we deprecated the following Defender for Cloud recommendation and its related policy:

|Recommendation |Description |Severity |
|---|---|---|
| Service principals should be used to protect your subscriptions instead of Management Certificates | Management certificates allow anyone who authenticates with them to manage the subscription(s) they're associated with. To manage subscriptions more securely, using service principals with Resource Manager is recommended to limit the blast radius in the case of a certificate compromise. It also automates resource management. <br />(Related policy: [Service principals should be used to protect your subscriptions instead of management certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6646a0bd-e110-40ca-bb97-84fcee63c414)) |Medium |

Learn more:

- [Cloud Services (classic) deployment model is retiring on 31 August 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/)
- [Overview of Azure Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md)
- [Workflow of Microsoft Azure classic VM Architecture - including RDFE workflow basics](../cloud-services/cloud-services-workflow-process.md)

### Legacy implementation of ISO 27001 replaced with new ISO 27001:2013 initiative

The legacy implementation of ISO 27001 was removed from Defender for Cloud's regulatory compliance dashboard. If you're tracking your ISO 27001 compliance with Defender for Cloud, onboard the new ISO 27001:2013 standard for all relevant management groups or subscriptions.

:::image type="content" source="media/upcoming-changes/removing-iso-27001-legacy-implementation.png" alt-text="Defender for Cloud's regulatory compliance dashboard showing the message about the removal of the legacy implementation of ISO 27001." lightbox="media/upcoming-changes/removing-iso-27001-legacy-implementation.png":::

### Deprecated Microsoft Defender for IoT device recommendations

Microsoft Defender for IoT device recommendations is no longer visible in Microsoft Defender for Cloud. These recommendations are still available on Microsoft Defender for IoT's Recommendations page.

The following recommendations are deprecated:

| Assessment key | Recommendations |
|--|--|
| 1a36f14a-8bd8-45f5-abe5-eef88d76ab5b: IoT Devices | Open Ports On Device |
| ba975338-f956-41e7-a9f2-7614832d382d: IoT Devices | Permissive firewall rule in the input chain was found |
| beb62be3-5e78-49bd-ac5f-099250ef3c7c: IoT Devices | Permissive firewall policy in one of the chains was found |
| d5a8d84a-9ad0-42e2-80e0-d38e3d46028a: IoT Devices | Permissive firewall rule in the output chain was found |
| 5f65e47f-7a00-4bf3-acae-90ee441ee876: IoT Devices | Operating system baseline validation failure |
|a9a59ebb-5d6f-42f5-92a1-036fd0fd1879: IoT Devices | Agent sending underutilized messages |
| 2acc27c6-5fdb-405e-9080-cb66b850c8f5: IoT Devices | TLS cipher suite upgrade needed |
|d74d2738-2485-4103-9919-69c7e63776ec: IoT Devices | Auditd process stopped sending events |

### Deprecated Microsoft Defender for IoT device alerts

All of Microsoft's Defender for IoT device alerts are no longer visible in Microsoft Defender for Cloud. These alerts are still available on Microsoft Defender for IoT's Alert page, and in Microsoft Sentinel.

### Posture management and threat protection for AWS and GCP released for general availability (GA)

- **Defender for Cloud's CSPM features** extend to your AWS and GCP resources. This agentless plan assesses your multicloud resources according to cloud-specific security recommendations that are included in your secure score. The resources are assessed for compliance using the built-in standards. Defender for Cloud's asset inventory page is a multicloud enabled feature that allows you to manage your AWS resources alongside your Azure resources.

- **Microsoft Defender for Servers** brings threat detection and advanced defenses to your compute instances in AWS and GCP. The Defender for Servers plan includes an integrated license for Microsoft Defender for Endpoint, vulnerability assessment scanning, and more. Learn about all of the [supported features for virtual machines and servers](supported-machines-endpoint-solutions-clouds-servers.md). Automatic onboarding capabilities allow you to easily connect any existing or new compute instances discovered in your environment.

Learn how to protect and connect your [AWS environment](quickstart-onboard-aws.md) and [GCP organization](quickstart-onboard-gcp.md) with Microsoft Defender for Cloud.

### Registry scan for Windows images in ACR added support for national clouds

Registry scan for Windows images is now supported in Azure Government and Microsoft Azure operated by 21Vianet. This addition is currently in preview.

Learn more about our [feature's availability](supported-machines-endpoint-solutions-clouds-containers.md).

## February 2022

Updates in February include:

- [Kubernetes workload protection for Arc-enabled Kubernetes clusters](#kubernetes-workload-protection-for-arc-enabled-kubernetes-clusters)
- [Native CSPM for GCP and threat protection for GCP compute instances](#native-cspm-for-gcp-and-threat-protection-for-gcp-compute-instances)
- [Microsoft Defender for Azure Cosmos DB plan released for preview](#microsoft-defender-for-azure-cosmos-db-plan-released-for-preview)
- [Threat protection for Google Kubernetes Engine (GKE) clusters](#threat-protection-for-google-kubernetes-engine-gke-clusters)

### Kubernetes workload protection for Arc-enabled Kubernetes clusters

Defender for Containers previously only protected Kubernetes workloads running in Azure Kubernetes Service. We've now extended the protective coverage to include Azure Arc-enabled Kubernetes clusters.

Learn how to [set up your Kubernetes workload protection](kubernetes-workload-protections.md#set-up-your-workload-protection) for AKS and Azure Arc enabled Kubernetes clusters.

### Native CSPM for GCP and threat protection for GCP compute instances

The new automated onboarding of GCP environments allows you to protect GCP workloads with Microsoft Defender for Cloud. Defender for Cloud protects your resources with the following plans:

- **Defender for Cloud's CSPM** features extend to your GCP resources. This agentless plan assesses your GCP resources according to the GCP-specific security recommendations, which are provided with Defender for Cloud. GCP recommendations are included in your secure score, and the resources will be assessed for compliance with the built-in GCP CIS standard. Defender for Cloud's asset inventory page is a multicloud enabled feature helping you manage your resources across Azure, AWS, and GCP.

- **Microsoft Defender for Servers** brings threat detection and advanced defenses to your GCP compute instances. This plan includes the integrated license for Microsoft Defender for Endpoint, vulnerability assessment scanning, and more.

    For a full list of available features, see [Supported features for virtual machines and servers](supported-machines-endpoint-solutions-clouds-servers.md). Automatic onboarding capabilities will allow you to easily connect any existing, and new compute instances discovered in your environment.

Learn how to protect, and [connect your GCP projects](quickstart-onboard-gcp.md) with Microsoft Defender for Cloud.

### Microsoft Defender for Azure Cosmos DB plan released for preview

We have extended Microsoft Defender for Cloud’s database coverage. You can now enable protection for your Azure Cosmos DB databases.

Microsoft Defender for Azure Cosmos DB is an Azure-native layer of security that detects any attempt to exploit databases in your Azure Cosmos DB accounts. Microsoft Defender for Azure Cosmos DB detects potential SQL injections, known bad actors based on Microsoft Threat Intelligence, suspicious access patterns, and potential exploitation of your database through compromised identities, or malicious insiders.

It continuously analyzes the customer data stream generated by the Azure Cosmos DB services.

When potentially malicious activities are detected, security alerts are generated. These alerts are displayed in Microsoft Defender for Cloud together with the details of the suspicious activity along with the relevant investigation steps, remediation actions, and security recommendations.

There's no impact on database performance when enabling the service, because Defender for Azure Cosmos DB doesn't access the Azure Cosmos DB account data.

Learn more at [Overview of Microsoft Defender for Azure Cosmos DB](concept-defender-for-cosmos.md).

We're also introducing a new enablement experience for database security. You can now enable Microsoft Defender for Cloud protection on your subscription to protect all database types, such as, Azure Cosmos DB, Azure SQL Database, Azure SQL servers on machines, and Microsoft Defender for open-source relational databases through one enablement process. Specific resource types can be included, or excluded by configuring your plan.  

Learn how to [enable your database security at the subscription level](quickstart-enable-database-protections.md#enable-database-protection-on-your-subscription).

### Threat protection for Google Kubernetes Engine (GKE) clusters

Following our recent announcement [Native CSPM for GCP and threat protection for GCP compute instances](#native-cspm-for-gcp-and-threat-protection-for-gcp-compute-instances), Microsoft Defender for Containers has extended its Kubernetes threat protection, behavioral analytics, and built-in admission control policies to Google's Kubernetes Engine (GKE) Standard clusters. You can easily onboard any existing, or new GKE Standard clusters to your environment through our Automatic onboarding capabilities. Check out [Container security with Microsoft Defender for Cloud](defender-for-containers-introduction.md#vulnerability-assessment), for a full list of available features.

## January 2022

Updates in January include:

- [Microsoft Defender for Resource Manager updated with new alerts and greater emphasis on high-risk operations mapped to MITRE ATT&CK® Matrix](#microsoft-defender-for-resource-manager-updated-with-new-alerts-and-greater-emphasis-on-high-risk-operations-mapped-to-mitre-attck-matrix)
- [Recommendations to enable Microsoft Defender plans on workspaces (in preview)](#recommendations-to-enable-microsoft-defender-plans-on-workspaces-in-preview)
- [Autoprovision Log Analytics agent to Azure Arc-enabled machines (preview)](#autoprovision-log-analytics-agent-to-azure-arc-enabled-machines-preview)
- [Deprecated the recommendation to classify sensitive data in SQL databases](#deprecated-the-recommendation-to-classify-sensitive-data-in-sql-databases)
- [Communication with suspicious domain alert expanded to included known Log4Shell-related domains](#communication-with-suspicious-domain-alert-expanded-to-included-known-log4shell-related-domains)
- ['Copy alert JSON' button added to security alert details pane](#copy-alert-json-button-added-to-security-alert-details-pane)
- [Renamed two recommendations](#renamed-two-recommendations)
- [Deprecate Kubernetes cluster containers should only listen on allowed ports policy](#deprecate-kubernetes-cluster-containers-should-only-listen-on-allowed-ports-policy)
- [Added 'Active Alerts' workbook](#added-active-alert-workbook)
- ['System update' recommendation added to government cloud](#system-update-recommendation-added-to-government-cloud)

### Microsoft Defender for Resource Manager updated with new alerts and greater emphasis on high-risk operations mapped to MITRE ATT&CK® Matrix

The cloud management layer is a crucial service connected to all your cloud resources. Because of this, it's also a potential target for attackers. We recommend security operations teams closely monitor the resource management layer.

Microsoft Defender for Resource Manager automatically monitors the resource management operations in your organization, whether they're performed through the Azure portal, Azure REST APIs, Azure CLI, or other Azure programmatic clients. Defender for Cloud runs advanced security analytics to detect threats and alerts you about suspicious activity.

The plan's protections greatly enhance an organization's resiliency against attacks from threat actors and significantly increase the number of Azure resources protected by Defender for Cloud.

In December 2020, we introduced the preview of Defender for Resource Manager, and in May 2021 the plan was release for general availability.

With this update, we've comprehensively revised the focus of the Microsoft Defender for Resource Manager plan. The updated plan includes many **new alerts focused on identifying suspicious invocation of high-risk operations**. These new alerts provide extensive monitoring for attacks across the *complete* [MITRE ATT&CK® matrix for cloud-based techniques](https://attack.mitre.org/matrices/enterprise/cloud/).

This matrix covers the following range of potential intentions of threat actors who may be targeting your organization's resources: *Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Exfiltration, and Impact*.

The new alerts for this Defender plan cover these intentions as shown in the following table.

> [!TIP]
> These alerts also appear in the [alerts reference page](alerts-reference.md).

| Alert (alert type)                                                                                                                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | MITRE tactics (intentions)| Severity |
|----------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------:|----------|
| **Suspicious invocation of a high-risk 'Initial Access' operation detected (Preview)**<br>(ARM_AnomalousOperation.InitialAccess)             | Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to access restricted resources. The identified operations are designed to allow administrators to efficiently access their environments. While this activity may be legitimate, a threat actor might utilize such operations to gain initial access to restricted resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.                  | Initial Access            | Medium   |
| **Suspicious invocation of a high-risk 'Execution' operation detected (Preview)**<br>(ARM_AnomalousOperation.Execution)                      | Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation on a machine in your subscription, which might indicate an attempt to execute code. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity may be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.         | Execution                 | Medium   |
| **Suspicious invocation of a high-risk 'Persistence' operation detected (Preview)**<br>(ARM_AnomalousOperation.Persistence)                  | Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to establish persistence. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity may be legitimate, a threat actor might utilize such operations to establish persistence in your environment. This can indicate that the account is compromised and is being used with malicious intent.                                              | Persistence               | Medium   |
| **Suspicious invocation of a high-risk 'Privilege Escalation' operation detected (Preview)**<br>(ARM_AnomalousOperation.PrivilegeEscalation) | Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to escalate privileges. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity may be legitimate, a threat actor might utilize such operations to escalate privileges while compromising resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.                     | Privilege Escalation      | Medium   |
| **Suspicious invocation of a high-risk 'Defense Evasion' operation detected (Preview)**<br>(ARM_AnomalousOperation.DefenseEvasion)           | Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to evade defenses. The identified operations are designed to allow administrators to efficiently manage the security posture of their environments. While this activity may be legitimate, a threat actor might utilize such operations to avoid being detected while compromising resources in your environment. This can indicate that the account is compromised and is being used with malicious intent. | Defense Evasion           | Medium   |
| **Suspicious invocation of a high-risk 'Credential Access' operation detected (Preview)**<br>(ARM_AnomalousOperation.CredentialAccess)       | Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to access credentials. The identified operations are designed to allow administrators to efficiently access their environments. While this activity may be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.                | Credential Access         | Medium   |
| **Suspicious invocation of a high-risk 'Lateral Movement' operation detected (Preview)**<br>(ARM_AnomalousOperation.LateralMovement)         | Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to perform lateral movement. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity may be legitimate, a threat actor might utilize such operations to compromise additional resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.                                 | Lateral Movement          | Medium   |
| **Suspicious invocation of a high-risk 'Data Collection' operation detected (Preview)**<br>(ARM_AnomalousOperation.Collection)               | Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempt to collect data. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity may be legitimate, a threat actor might utilize such operations to collect sensitive data on resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.                                         | Collection                | Medium   |
| **Suspicious invocation of a high-risk 'Impact' operation detected (Preview)**<br>(ARM_AnomalousOperation.Impact)                            | Microsoft Defender for Resource Manager identified a suspicious invocation of a high-risk operation in your subscription, which might indicate an attempted configuration change. The identified operations are designed to allow administrators to efficiently manage their environments. While this activity may be legitimate, a threat actor might utilize such operations to access restricted credentials and compromise resources in your environment. This can indicate that the account is compromised and is being used with malicious intent.               | Impact                    | Medium   |

In addition, these two alerts from this plan have come out of preview:

| Alert (alert type)                                                                                                                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | MITRE tactics (intentions)| Severity |
|----------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------:|----------|
| **Azure Resource Manager operation from suspicious IP address**<br>(ARM_OperationFromSuspiciousIP)                                                      | Microsoft Defender for Resource Manager detected an operation from an IP address that has been marked as suspicious in threat intelligence feeds.                                                                                                                                                                                                                                                                                            | Execution                             | Medium   |
| **Azure Resource Manager operation from suspicious proxy IP address**<br>(ARM_OperationFromSuspiciousProxyIP)                                           | Microsoft Defender for Resource Manager detected a resource management operation from an IP address that is associated with proxy services, such as TOR. While this behavior can be legitimate, it's often seen in malicious activities, when threat actors try to hide their source IP.                                                                                                                                                     | Defense Evasion                       | Medium   |

### Recommendations to enable Microsoft Defender plans on workspaces (in preview)

To benefit from all of the security features available from [Microsoft Defender for Servers](defender-for-servers-introduction.md) and [Microsoft Defender for SQL on machines](defender-for-sql-introduction.md), the plans must be enabled on **both** the subscription and workspace levels.

When a machine is in a subscription with one of these plan enabled, you'll be billed for the full protections. However, if that machine is reporting to a workspace *without* the plan enabled, you won't actually receive those benefits.

We've added two recommendations that highlight workspaces without these plans enabled, that nevertheless have machines reporting to them from subscriptions that *do* have the plan enabled.

The two recommendations, which both offer automated remediation (the 'Fix' action), are:

|Recommendation |Description |Severity |
|---|---|---|
|[Microsoft Defender for Servers should be enabled on workspaces](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1ce68079-b783-4404-b341-d2851d6f0fa2) |Microsoft Defender for Servers brings threat detection and advanced defenses for your Windows and Linux machines.<br>With this Defender plan enabled on your subscriptions but not on your workspaces, you're paying for the full capability of Microsoft Defender for Servers but missing out on some of the benefits.<br>When you enable Microsoft Defender for Servers on a workspace, all machines reporting to that workspace will be billed for Microsoft Defender for Servers - even if they're in subscriptions without Defender plans enabled. Unless you also enable Microsoft Defender for Servers on the subscription, those machines won't be able to take advantage of just-in-time VM access, adaptive application controls, and network detections for Azure resources.<br>Learn more in <a target="_blank" href="/azure/defender-for-cloud/defender-for-servers-introduction?wt.mc_id=defenderforcloud_inproduct_portal_recoremediation">Overview of Microsoft Defender for Servers</a>.<br />(No related policy) |Medium |
|[Microsoft Defender for SQL on machines should be enabled on workspaces](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e9c320f1-03a0-4d2b-9a37-84b3bdc2e281) |Microsoft Defender for Servers brings threat detection and advanced defenses for your Windows and Linux machines.<br>With this Defender plan enabled on your subscriptions but not on your workspaces, you're paying for the full capability of Microsoft Defender for Servers but missing out on some of the benefits.<br>When you enable Microsoft Defender for Servers on a workspace, all machines reporting to that workspace will be billed for Microsoft Defender for Servers - even if they're in subscriptions without Defender plans enabled. Unless you also enable Microsoft Defender for Servers on the subscription, those machines won't be able to take advantage of just-in-time VM access, adaptive application controls, and network detections for Azure resources.<br>Learn more in <a target="_blank" href="/azure/defender-for-cloud/defender-for-servers-introduction?wt.mc_id=defenderforcloud_inproduct_portal_recoremediation">Overview of Microsoft Defender for Servers</a>.<br />(No related policy) |Medium |

### Autoprovision Log Analytics agent to Azure Arc-enabled machines (preview)

Defender for Cloud uses the Log Analytics agent to gather security-related data from machines. The agent reads various security-related configurations and event logs and copies the data to your workspace for analysis.

Defender for Cloud's autoprovisioning settings has a toggle for each type of supported extension, including the Log Analytics agent.

In a further expansion of our hybrid cloud features, we've added an option to autoprovision the Log Analytics agent to machines connected to Azure Arc.

As with the other autoprovisioning options, this is configured at the subscription level.

When you enable this option, you'll be prompted for the workspace.

> [!NOTE]
> For this preview, you can't select the default workspaces that was created by Defender for Cloud. To ensure you receive the full set of security features available for the Azure Arc-enabled servers, verify that you have the relevant security solution installed on the selected workspace.

:::image type="content" source="media/release-notes/auto-provisioning-agent-toggle.jpg" alt-text="Screenshot of how to autoprovision the Log Analytics agent to your Azure Arc-enabled machines." lightbox="./media/release-notes/auto-provisioning-agent-toggle.jpg":::

### Deprecated the recommendation to classify sensitive data in SQL databases

We've removed the recommendation **Sensitive data in your SQL databases should be classified** as part of an overhaul of how Defender for Cloud identifies and protects sensitive date in your cloud resources.

Advance notice of this change appeared for the last six months in the [Important upcoming changes to Microsoft Defender for Cloud](upcoming-changes.md) page.

### Communication with suspicious domain alert expanded to included known Log4Shell-related domains

The following alert was previously only available to organizations who had enabled the [Microsoft Defender for DNS](defender-for-dns-introduction.md) plan.

With this update, the alert will also show for subscriptions with the [Microsoft Defender for Servers](defender-for-servers-introduction.md) or [Defender for App Service](defender-for-app-service-introduction.md) plan enabled.

In addition, [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684) has expanded the list of known malicious domains to include domains associated with exploiting the widely publicized vulnerabilities associated with Log4j.

| Alert (alert type)                                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                     | MITRE tactics  | Severity |
|-------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|----------|
| **Communication with suspicious domain identified by threat intelligence**<br>(AzureDNS_ThreatIntelSuspectDomain) | Communication with suspicious domain was detected by analyzing DNS transactions from your resource and comparing against known malicious domains identified by threat intelligence feeds. Communication to malicious domains is frequently performed by attackers and could imply that your resource is compromised.                                                                           | Initial Access / Persistence / Execution / Command And Control / Exploitation | Medium   |

### 'Copy alert JSON' button added to security alert details pane

To help our users quickly share an alert's details with others (for example, SOC analysts, resource owners, and developers) we've added the capability to easily extract all the details of a specific alert with one button from the security alert's details pane.

The new **Copy alert JSON** button puts the alert’s details, in JSON format, into the user's clipboard.

:::image type="content" source="media/release-notes/copy-alert-json.png" alt-text="Screenshot of the 'Copy alert JSON' button in the alert details pane." lightbox="./media/release-notes/copy-alert-json.png":::

### Renamed two recommendations

For consistency with other recommendation names, we've renamed the following two recommendations:

- Recommendation to resolve vulnerabilities discovered in running container images
  - Previous name: Vulnerabilities in running container images should be remediated (powered by Qualys)
  - New name: Running container images should have vulnerability findings resolved

- Recommendation to enable diagnostic logs for Azure App Service
  - Previous name: Diagnostic logs should be enabled in App Service
  - New name: Diagnostic logs in App Service should be enabled

### Deprecate Kubernetes cluster containers should only listen on allowed ports policy

We've deprecated the **Kubernetes cluster containers should only listen on allowed ports** recommendation.

| Policy name | Description | Effect(s) | Version |
|--|--|--|--|
| [Kubernetes cluster containers should only listen on allowed ports](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F440b515e-a580-421e-abeb-b159a61ddcbc) | Restrict containers to listen only on allowed ports to secure access to the Kubernetes cluster. This policy is generally available for Kubernetes Service (AKS), and preview for AKS Engine and Azure Arc enabled Kubernetes. For more information, see [https://aka.ms/kubepolicydoc](../governance/policy/concepts/policy-for-kubernetes.md). | audit, deny, disabled | [6.1.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Kubernetes/ContainerAllowedPorts.json) |

The **[Services should listen on allowed ports only](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/add45209-73f6-4fa5-a5a5-74a451b07fbe)** recommendation should be used to limit ports that an application exposes to the internet.

### Added 'Active Alert' workbook

To assist our users in their understanding of the active threats to their environments, and prioritize between active alerts during the remediation process, we've added the Active Alerts workbook.

:::image type="content" source="media/release-notes/active-alerts-workbook.png" alt-text="Screenshot showing the addition of the Active alerts workbook.":::

The active alerts workbook allows users to view a unified dashboard of their aggregated alerts by severity, type, tag, MITRE ATT&CK tactics, and location. Learn more in [Use the 'Active Alerts' workbook](custom-dashboards-azure-workbooks.md#use-the-active-alerts-workbook).

### 'System update' recommendation added to government cloud

The 'System updates should be installed on your machines' recommendation is now available on all government clouds.

It's likely that this change will impact your government cloud subscription's secure score. We expect the change to lead to a decreased score, but it's possible the recommendation's inclusion might result in an increased score in some cases.

## December 2021

Updates in December include:

- [Microsoft Defender for Containers plan released for general availability (GA)](#microsoft-defender-for-containers-plan-released-for-general-availability-ga)
- [New alerts for Microsoft Defender for Storage released for general availability (GA)](#new-alerts-for-microsoft-defender-for-storage-released-for-general-availability-ga)
- [Improvements to alerts for Microsoft Defender for Storage](#improvements-to-alerts-for-microsoft-defender-for-storage)
- ['PortSweeping' alert removed from network layer alerts](#portsweeping-alert-removed-from-network-layer-alerts)

### Microsoft Defender for Containers plan released for general availability (GA)

Over two years ago, we introduced [Defender for Kubernetes](defender-for-kubernetes-introduction.md) and [Defender for container registries](defender-for-container-registries-introduction.md) as part of the Azure Defender offering within Microsoft Defender for Cloud.

With the release of [Microsoft Defender for Containers](defender-for-containers-introduction.md), we've merged these two existing Defender plans.

The new plan:

- **Combines the features of the two existing plans** - threat detection for Kubernetes clusters and vulnerability assessment for images stored in container registries
- **Brings new and improved features** - including multicloud support, host level threat detection with over **sixty** new Kubernetes-aware analytics, and vulnerability assessment for running images
- **Introduces Kubernetes-native at-scale onboarding** - by default, when you enable the plan all relevant components are configured to be deployed automatically

With this release, the availability and presentation of Defender for Kubernetes and Defender for container registries has changed as follows:

- New subscriptions - The two previous container plans are no longer available
- Existing subscriptions - Wherever they appear in the Azure portal, the plans are shown as **Deprecated** with instructions for how to upgrade to the newer plan
    :::image type="content" source="media/release-notes/defender-plans-deprecated-indicator.png" alt-text="Defender for container registries and Defender for Kubernetes plans showing 'Deprecated' and upgrade information.":::

The new plan is free for the month of December 2021. For the potential changes to the billing from the old plans to Defender for Containers, and for more information on the benefits introduced with this plan, see [Introducing Microsoft Defender for Containers](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/introducing-microsoft-defender-for-containers/ba-p/2952317).

For more information, see:

- [Overview of Microsoft Defender for Containers](defender-for-containers-introduction.md)
- [Enable Microsoft Defender for Containers](defender-for-containers-enable.md)
- [Introducing Microsoft Defender for Containers - Microsoft Tech Community](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/introducing-microsoft-defender-for-containers/ba-p/2952317)
- [Microsoft Defender for Containers | Defender for Cloud in the Field #3 - YouTube](https://www.youtube.com/watch?v=KeH0a3enLJ0&t=201s)

### New alerts for Microsoft Defender for Storage released for general availability (GA)

Threat actors use tools and scripts to scan for publicly open containers in the hope of finding misconfigured open storage containers with sensitive data.

Microsoft Defender for Storage detects these scanners so that you can block them and remediate your posture.

The preview alert that detected this was called **“Anonymous scan of public storage containers”**. To provide greater clarity about the suspicious events discovered, we've divided this into **two** new alerts. These alerts are relevant to Azure Blob Storage only.

We've improved the detection logic, updated the alert metadata, and changed the alert name and alert type.

These are the new alerts:

| Alert   (alert type)                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | MITRE tactic | Severity |
|---------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|----------|
| **Publicly accessible storage containers successfully discovered**<br>(Storage.Blob_OpenContainersScanning.SuccessfulDiscovery) | A successful discovery of   publicly open storage container(s) in your storage account was performed in the last hour by a scanning script or tool.<br><br>            This usually indicates a reconnaissance attack, where the threat actor tries to list blobs by guessing container names, in the hope of finding misconfigured open storage containers with sensitive data in them.<br><br>            The threat actor may use their own script or use known scanning tools like   Microburst to scan for publicly open containers.<br><br>            ✔ Azure Blob Storage<br>      ✖ Azure Files<br>      ✖ Azure Data Lake Storage Gen2 | Collection   | Medium   |
| **Publicly accessible storage containers unsuccessfully scanned**<br>(Storage.Blob_OpenContainersScanning.FailedAttempt)        | A series of failed attempts to scan for publicly open storage containers were performed in the last hour. <br><br>This usually indicates a reconnaissance attack, where the threat actor tries to list blobs by guessing container names, in the hope of finding misconfigured open storage containers with sensitive data in them.<br><br> The threat actor may use their own script or use known scanning tools like Microburst to scan for publicly open containers.<br><br>            ✔ Azure Blob Storage<br>      ✖ Azure Files<br>      ✖ Azure Data Lake Storage Gen2                                         | Collection   | Low      |

For more information, see:

- [Threat matrix for storage services](https://www.microsoft.com/security/blog/2021/04/08/threat-matrix-for-storage/)
- [Overview of Microsoft Defender for Storage](defender-for-storage-introduction.md)
- [List of alerts provided by Microsoft Defender for Storage](alerts-reference.md#alerts-azurestorage)

### Improvements to alerts for Microsoft Defender for Storage

The initial access alerts now have improved accuracy and more data to support investigation.

Threat actors use various techniques in the initial access to gain a foothold within a network. Two of the [Microsoft Defender for Storage](defender-for-storage-introduction.md) alerts that detect behavioral anomalies in this stage now have improved detection logic and additional data to support investigations.

If you've [configured automations](workflow-automation.md) or defined [alert suppression rules](alerts-suppression-rules.md) for these alerts in the past, update them in accordance with these changes.

#### Detecting access from a Tor exit node

Access from a Tor exit node might indicate a threat actor trying to hide their identity.

The alert is now tuned to generate only for authenticated access, which results in higher accuracy and confidence that the activity is malicious. This enhancement reduces the benign positive rate.

An outlying pattern will have high severity, while less anomalous patterns will have medium severity.

The alert name and description have been updated. The AlertType remains unchanged.

- Alert name (old): Access from a Tor exit node to a storage account
- Alert name (new): Authenticated access from a Tor exit node
- Alert types:  Storage.Blob_TorAnomaly / Storage.Files_TorAnomaly
- Description: One or more storage container(s) / file share(s) in your storage account were successfully accessed from an IP address known to be an active exit node of Tor (an anonymizing proxy). Threat actors use Tor to make it difficult to trace the activity back to them. Authenticated access from a Tor exit node is a likely indication that a threat actor is trying to hide their identity. Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2
- MITRE tactic: Initial access
- Severity: High/Medium

#### Unusual unauthenticated access

A change in access patterns may indicate that a threat actor was able to exploit public read access to storage containers, either by exploiting a mistake in access configurations, or by changing the access permissions.

This medium severity alert is now tuned with improved behavioral logic, higher accuracy, and confidence that the activity is malicious. This enhancement reduces the benign positive rate.

The alert name and description have been updated. The AlertType remains unchanged.

- Alert name (old): Anonymous access to a storage account
- Alert name (new): Unusual unauthenticated access to a storage container
- Alert types: Storage.Blob_AnonymousAccessAnomaly
- Description: This storage account was accessed without authentication, which is a change in the common access pattern. Read access to this container is usually authenticated. This might indicate that a threat actor was able to exploit public read access to storage container(s) in this storage account(s). Applies to: Azure Blob Storage
- MITRE tactic: Collection
- Severity: Medium

For more information, see:

- [Threat matrix for storage services](https://www.microsoft.com/security/blog/2021/04/08/threat-matrix-for-storage/)
- [Introduction to Microsoft Defender for Storage](defender-for-storage-introduction.md)
- [List of alerts provided by Microsoft Defender for Storage](alerts-reference.md#alerts-azurestorage)

### 'PortSweeping' alert removed from network layer alerts

The following alert was removed from our network layer alerts due to inefficiencies:

| Alert (alert type)                                                                                                                                               | Description     | MITRE tactics | Severity      |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------:|---------------|
| **Possible outgoing port scanning activity detected**<br>(PortSweeping) | Network traffic analysis detected suspicious outgoing traffic from %{Compromised Host}. This traffic may be a result of a port scanning activity. When the compromised resource is a load balancer or an application gateway, the suspected outgoing traffic has been originated from to one or more of the resources in the backend pool (of the load balancer or application gateway). If this behavior is intentional, please note that performing port scanning is against Azure Terms of service. If this behavior is unintentional, it may mean your resource has been compromised. | Discovery | Medium   |

## November 2021

Our Ignite release includes:

- [Azure Security Center and Azure Defender become Microsoft Defender for Cloud](#azure-security-center-and-azure-defender-become-microsoft-defender-for-cloud)
- [Native CSPM for AWS and threat protection for Amazon EKS, and AWS EC2](#native-cspm-for-aws-and-threat-protection-for-amazon-eks-and-aws-ec2)
- [Prioritize security actions by data sensitivity (powered by Microsoft Purview) (in preview)](#prioritize-security-actions-by-data-sensitivity-powered-by-microsoft-purview-in-preview)
- [Expanded security control assessments with Azure Security Benchmark v3](#expanded-security-control-assessments-with-azure-security-benchmark-v3)
- [Microsoft Sentinel connector's optional bi-directional alert synchronization released for general availability (GA)](#microsoft-sentinel-connectors-optional-bi-directional-alert-synchronization-released-for-general-availability-ga)
- [New recommendation to push Azure Kubernetes Service (AKS) logs to Sentinel](#new-recommendation-to-push-azure-kubernetes-service-aks-logs-to-sentinel)
- [Recommendations mapped to the MITRE ATT&CK® framework - released for general availability (GA)](#recommendations-mapped-to-the-mitre-attck-framework---released-for-general-availability-ga)

Other changes in November include:

- [Microsoft Threat and Vulnerability Management added as vulnerability assessment solution - released for general availability (GA)](#microsoft-threat-and-vulnerability-management-added-as-vulnerability-assessment-solution---released-for-general-availability-ga)
- [Microsoft Defender for Endpoint for Linux now supported by Microsoft Defender for Servers - released for general availability (GA)](#microsoft-defender-for-endpoint-for-linux-now-supported-by-microsoft-defender-for-servers---released-for-general-availability-ga)
- [Snapshot export for recommendations and security findings (in preview)](#snapshot-export-for-recommendations-and-security-findings-in-preview)
- [Autoprovisioning of vulnerability assessment solutions released for general availability (GA)](#autoprovisioning-of-vulnerability-assessment-solutions-released-for-general-availability-ga)
- [Software inventory filters in asset inventory released for general availability (GA)](#software-inventory-filters-in-asset-inventory-released-for-general-availability-ga)
- [New AKS security policy added to default initiative – private preview](#new-aks-security-policy-added-to-default-initiative--for-use-by-private-preview-customers-only)
- [Inventory display of on-premises machines applies different template for resource name](#inventory-display-of-on-premises-machines-applies-different-template-for-resource-name)

### Azure Security Center and Azure Defender become Microsoft Defender for Cloud

According to the [2021 State of the Cloud report](https://info.flexera.com/CM-REPORT-State-of-the-Cloud#download), 92% of organizations now have a multicloud strategy. At Microsoft, our goal is to centralize security across environments, and to help security teams work more effectively.

**Microsoft Defender for Cloud**  is a Cloud Security Posture Management (CSPM) and cloud workload protection (CWP) solution that discovers weaknesses across your cloud configuration, helps strengthen the overall security posture of your environment, and protects workloads across multicloud and hybrid environments.


### Native CSPM for AWS and threat protection for Amazon EKS, and AWS EC2

A new **environment settings** page provides greater visibility and control over your management groups, subscriptions, and AWS accounts. The page is designed to onboard AWS accounts at scale: connect your AWS **management account**, and you'll automatically onboard existing and future accounts.

:::image type="content" source="media/release-notes/add-aws-account.png" alt-text="Use the new environment settings page to connect your AWS accounts.":::

When you've added your AWS accounts, Defender for Cloud protects your AWS resources with any or all of the following plans:

- **Defender for Cloud's CSPM features** extend to your AWS resources. This agentless plan assesses your AWS resources according to AWS-specific security recommendations and these are included in your secure score. The resources will also be assessed for compliance with built-in standards specific to AWS (AWS CIS, AWS PCI DSS, and AWS Foundational Security Best Practices). Defender for Cloud's [asset inventory page](asset-inventory.md) is a multicloud enabled feature helping you manage your AWS resources alongside your Azure resources.
- **Microsoft Defender for Kubernetes** extends its container threat detection and advanced defenses to your **Amazon EKS Linux clusters**.
- **Microsoft Defender for Servers** brings threat detection and advanced defenses to your Windows and Linux EC2 instances. This plan includes the integrated license for Microsoft Defender for Endpoint, security baselines and OS level assessments, vulnerability assessment scanning, adaptive application controls (AAC), file integrity monitoring (FIM), and more.

Learn more about [connecting your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md).

### Prioritize security actions by data sensitivity (powered by Microsoft Purview) (in preview)

Data resources remain a popular target for threat actors. So it's crucial for security teams to identify, prioritize, and secure sensitive data resources across their cloud environments.

To address this challenge, Microsoft Defender for Cloud now integrates sensitivity information from [Microsoft Purview](../purview/overview.md). Microsoft Purview is a unified data governance service that provides rich insights into the sensitivity of your data within multicloud, and on-premises workloads.

The integration with Microsoft Purview extends your security visibility in Defender for Cloud from the infrastructure level down to the data, enabling an entirely new way to prioritize resources and security activities for your security teams.

Learn more in [Prioritize security actions by data sensitivity](information-protection.md).

### Expanded security control assessments with Azure Security Benchmark v3

Security recommendations in Defender for Cloud are supported by the Azure Security Benchmark.

[Azure Security Benchmark](/security/benchmark/azure/introduction) is the Microsoft-authored, Azure-specific set of guidelines for security and compliance best practices based on common compliance frameworks. This widely respected benchmark builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security.

From Ignite 2021, Azure Security Benchmark **v3** is available in [Defender for Cloud's regulatory compliance dashboard](update-regulatory-compliance-packages.md) and enabled as the new default initiative for all Azure subscriptions protected with Microsoft
Defender for Cloud.

Enhancements for v3 include:

- Additional mappings to industry frameworks [PCI-DSS v3.2.1](https://www.pcisecuritystandards.org/documents/PCI_DSS_v3-2-1.pdf) and [CIS Controls v8](https://www.cisecurity.org/controls/v8/).
- More granular and actionable guidance for controls with the introduction of:
  - **Security Principles** - Providing insight into the overall security objectives that build the foundation for our recommendations.
  - **Azure Guidance** - The technical “how-to” for meeting these objectives.

- New controls include DevOps security for issues such as threat modeling and software supply chain security, as well as key and certificate management for best practices in Azure.

Learn more in [Introduction to Azure Security Benchmark](/security/benchmark/azure/introduction).

### Microsoft Sentinel connector's optional bi-directional alert synchronization released for general availability (GA)

In July, [we announced](release-notes-archive.md#azure-sentinel-connector-now-includes-optional-bi-directional-alert-synchronization-in-preview) a preview feature, **bi-directional alert synchronization**, for the built-in connector in [Microsoft Sentinel](../sentinel/index.yml) (Microsoft's cloud-native SIEM and SOAR solution). This feature is now released for general availability (GA).

When you connect Microsoft Defender for Cloud to Microsoft Sentinel, the status of security alerts is synchronized between the two services. So, for example, when an alert is closed in Defender for Cloud, that alert will display as closed in Microsoft Sentinel as well. Changing the status of an alert in Defender for Cloud won't affect the status of any Microsoft Sentinel **incidents** that contain the synchronized Microsoft Sentinel alert, only that of the synchronized alert itself.

When you enable **bi-directional alert synchronization** you'll automatically sync the status of the original Defender for Cloud alerts with Microsoft Sentinel incidents that contain the copies of those alerts. So, for example, when a Microsoft Sentinel incident containing a Defender for Cloud alert is closed, Defender for Cloud will automatically close the corresponding original alert.

Learn more in [Connect Azure Defender alerts from Azure Security Center](../sentinel/connect-azure-security-center.md) and [Stream alerts to Azure Sentinel](export-to-siem.md#stream-alerts-to-microsoft-sentinel).

### New recommendation to push Azure Kubernetes Service (AKS) logs to Sentinel

In a further enhancement to the combined value of Defender for Cloud and Microsoft Sentinel, we'll now highlight Azure Kubernetes Service instances that aren't sending log data to Microsoft Sentinel.

SecOps teams can choose the relevant Microsoft Sentinel workspace directly from the recommendation details page and immediately enable the streaming of raw logs. This seamless connection between the two products makes it easy for security teams to ensure complete logging coverage across their workloads to stay on top of their entire environment.

The new recommendation, "Diagnostic logs in Kubernetes services should be enabled" includes the 'Fix' option for faster remediation.

We've also enhanced the "Auditing on SQL server should be enabled" recommendation with the same Sentinel streaming capabilities.

### Recommendations mapped to the MITRE ATT&CK® framework - released for general availability (GA)

We've enhanced Defender for Cloud's security recommendations to show their position on the MITRE ATT&CK® framework. This globally accessible knowledge base of threat actors' tactics and techniques based on real-world observations, provides more context to help you understand the associated risks of the recommendations for your environment.

You'll find these tactics wherever you access recommendation information:

- **Azure Resource Graph query results** for relevant recommendations include the MITRE ATT&CK® tactics and techniques.

- **Recommendation details pages** show the mapping for all relevant recommendations:

    :::image type="content" source="media/review-security-recommendations/tactics-window.png" alt-text="Screenshot of the MITRE tactics mapping for a recommendation.":::

- **The recommendations page in Defender for Cloud** has a new :::image type="icon" source="media/review-security-recommendations/tactics-filter-recommendations-page.png" border="false"::: filter to select recommendations according to their associated tactic:

Learn more in [Review your security recommendations](review-security-recommendations.md).

### Microsoft Threat and Vulnerability Management added as vulnerability assessment solution - released for general availability (GA)

In October, [we announced](release-notes-archive.md#microsoft-threat-and-vulnerability-management-added-as-vulnerability-assessment-solution-in-preview) an extension to the integration between [Microsoft Defender for Servers](defender-for-servers-introduction.md) and Microsoft Defender for Endpoint, to support a new vulnerability assessment provider for your machines: [Microsoft threat and vulnerability management](/microsoft-365/security/defender-endpoint/next-gen-threat-and-vuln-mgt). This feature is now released for general availability (GA).

Use **threat and vulnerability management** to discover vulnerabilities and misconfigurations in near real time with the [integration with Microsoft Defender for Endpoint](integration-defender-for-endpoint.md) enabled, and without the need for additional agents or periodic scans. Threat and vulnerability management prioritizes vulnerabilities based on the threat landscape and detections in your organization.

Use the security recommendation "[A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ffff0522-1e88-47fc-8382-2a80ba848f5d)" to surface the vulnerabilities detected by threat and vulnerability management for your [supported machines](/microsoft-365/security/defender-endpoint/tvm-supported-os).

To automatically surface the vulnerabilities, on existing and new machines, without the need to manually remediate the recommendation, see [Vulnerability assessment solutions can now be auto enabled (in preview)](release-notes-archive.md#vulnerability-assessment-solutions-can-now-be-auto-enabled-in-preview).

Learn more in [Investigate weaknesses with Microsoft Defender for Endpoint's threat and vulnerability management](deploy-vulnerability-assessment-defender-vulnerability-management.md).

### Microsoft Defender for Endpoint for Linux now supported by Microsoft Defender for Servers - released for general availability (GA)

In August, [we announced](release-notes-archive.md#microsoft-defender-for-endpoint-for-linux-now-supported-by-azure-defender-for-servers-in-preview) preview support for deploying the [Defender for Endpoint for Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux) sensor to supported Linux machines. This feature is now released for general availability (GA).

[Microsoft Defender for Servers](defender-for-servers-introduction.md) includes an integrated license for [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender). Together, they provide comprehensive endpoint detection and response (EDR) capabilities.

When Defender for Endpoint detects a threat, it triggers an alert. The alert is shown in Defender for Cloud. From Defender for Cloud, you can also pivot to the Defender for Endpoint console, and perform a detailed investigation to uncover the scope of the attack.

Learn more in [Protect your endpoints with Security Center's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

### Snapshot export for recommendations and security findings (in preview)

Defender for Cloud generates detailed security alerts and recommendations. You can view them in the portal or through programmatic tools. You might also need to export some or all of this information for tracking with other monitoring tools in your environment.

Defender for Cloud's **continuous export** feature lets you fully customize *what* will be exported, and *where* it will go. Learn more in [Continuously export Microsoft Defender for Cloud data](continuous-export.md).

Even though the feature is called *continuous*, there's also an option to export weekly snapshots. Until now, these weekly snapshots were limited to secure score and regulatory compliance data. We've  added the capability to export recommendations and security findings.

### Autoprovisioning of vulnerability assessment solutions released for general availability (GA)

In October, [we announced](release-notes-archive.md#vulnerability-assessment-solutions-can-now-be-auto-enabled-in-preview) the addition of vulnerability assessment solutions to Defender for Cloud's autoprovisioning page. This is relevant to Azure virtual machines and Azure Arc machines on subscriptions protected by [Azure Defender for Servers](defender-for-servers-introduction.md). This feature is now released for general availability (GA).

If the [integration with Microsoft Defender for Endpoint](integration-defender-for-endpoint.md) is enabled, Defender for Cloud presents a choice of vulnerability assessment solutions:

- (**NEW**) The Microsoft threat and vulnerability management module of Microsoft Defender for Endpoint (see [the release note](#microsoft-threat-and-vulnerability-management-added-as-vulnerability-assessment-solution---released-for-general-availability-ga))
- The integrated Qualys agent

Your chosen solution will be automatically enabled on supported machines.

Learn more in [Automatically configure vulnerability assessment for your machines](auto-deploy-vulnerability-assessment.md).

### Software inventory filters in asset inventory released for general availability (GA)

In October, [we announced](release-notes-archive.md#software-inventory-filters-added-to-asset-inventory-in-preview) new filters for the [asset inventory](asset-inventory.md) page to select machines running specific software - and even specify the versions of interest. This feature is now released for general availability (GA).

You can query the software inventory data in **Azure Resource Graph Explorer**.

To use these features, you'll need to enable the [integration with Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

For full details, including sample Kusto queries for Azure Resource Graph, see [Access a software inventory](asset-inventory.md#access-a-software-inventory).

### New AKS security policy added to default initiative – for use by private preview customers only

To ensure that Kubernetes workloads are secure by default, Defender for Cloud includes Kubernetes level policies and hardening recommendations, including enforcement options with Kubernetes admission control.

As part of this project, we've added a policy and recommendation (disabled by default) for gating deployment on Kubernetes clusters. The policy is in the default initiative but is only relevant for organizations who register for the related private preview.

You can safely ignore the policies and recommendation ("Kubernetes clusters should gate deployment of vulnerable images") and there will be no impact on your environment.

If you'd like to participate in the private preview, you'll need to be a member of the private preview ring. If you're not already a member, submit a request [here](https://aka.ms/atscale). Members will be notified when the preview begins.

### Inventory display of on-premises machines applies different template for resource name

To improve the presentation of resources in the [Asset inventory](asset-inventory.md), we've removed the "source-computer-IP" element from the template for naming on-premises machines.

- **Previous format:** ``machine-name_source-computer-id_VMUUID``
- **From this update:** ``machine-name_VMUUID``

## October 2021

Updates in October include:

- [Microsoft Threat and Vulnerability Management added as vulnerability assessment solution (in preview)](#microsoft-threat-and-vulnerability-management-added-as-vulnerability-assessment-solution-in-preview)
- [Vulnerability assessment solutions can now be auto enabled (in preview)](#vulnerability-assessment-solutions-can-now-be-auto-enabled-in-preview)
- [Software inventory filters added to asset inventory (in preview)](#software-inventory-filters-added-to-asset-inventory-in-preview)
- [Changed prefix of some alert types from "ARM_" to "VM_"](#changed-prefix-of-some-alert-types-from-arm_-to-vm_)
- [Changes to the logic of a security recommendation for Kubernetes clusters](#changes-to-the-logic-of-a-security-recommendation-for-kubernetes-clusters)
- [Recommendations details pages now show related recommendations](#recommendations-details-pages-now-show-related-recommendations)
- [New alerts for Azure Defender for Kubernetes (in preview)](#new-alerts-for-azure-defender-for-kubernetes-in-preview)

### Microsoft Threat and Vulnerability Management added as vulnerability assessment solution (in preview)

We've extended the integration between [Azure Defender for Servers](defender-for-servers-introduction.md) and Microsoft Defender for Endpoint, to support a new vulnerability assessment provider for your machines: [Microsoft threat and vulnerability management](/microsoft-365/security/defender-endpoint/next-gen-threat-and-vuln-mgt).

Use **threat and vulnerability management** to discover vulnerabilities and misconfigurations in near real time with the [integration with Microsoft Defender for Endpoint](integration-defender-for-endpoint.md) enabled, and without the need for additional agents or periodic scans. Threat and vulnerability management prioritizes vulnerabilities based on the threat landscape and detections in your organization.

Use the security recommendation "[A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ffff0522-1e88-47fc-8382-2a80ba848f5d)" to surface the vulnerabilities detected by threat and vulnerability management for your [supported machines](/microsoft-365/security/defender-endpoint/tvm-supported-os).

To automatically surface the vulnerabilities, on existing and new machines, without the need to manually remediate the recommendation, see [Vulnerability assessment solutions can now be auto enabled (in preview)](#vulnerability-assessment-solutions-can-now-be-auto-enabled-in-preview).

Learn more in [Investigate weaknesses with Microsoft Defender for Endpoint's threat and vulnerability management](deploy-vulnerability-assessment-defender-vulnerability-management.md).

### Vulnerability assessment solutions can now be auto enabled (in preview)

Security Center's autoprovisioning page now includes the option to automatically enable a vulnerability assessment solution to Azure virtual machines and Azure Arc machines on subscriptions protected by [Azure Defender for Servers](defender-for-servers-introduction.md).

If the [integration with Microsoft Defender for Endpoint](integration-defender-for-endpoint.md) is enabled, Defender for Cloud presents a choice of vulnerability assessment solutions:

- (**NEW**) The Microsoft threat and vulnerability management module of Microsoft Defender for Endpoint (see [the release note](#microsoft-threat-and-vulnerability-management-added-as-vulnerability-assessment-solution-in-preview))
- The integrated Qualys agent

:::image type="content" source="media/deploy-vulnerability-assessment-defender-vulnerability-management/auto-provision-vulnerability-assessment-agent.png" alt-text="Configure autoprovisioning of Microsoft's threat and vulnerability management from Azure Security Center.":::

Your chosen solution will be automatically enabled on supported machines.

Learn more in [Automatically configure vulnerability assessment for your machines](auto-deploy-vulnerability-assessment.md).

### Software inventory filters added to asset inventory (in preview)

The [asset inventory](asset-inventory.md) page now includes a filter to select machines running specific software - and even specify the versions of interest.

Additionally, you can query the software inventory data in **Azure Resource Graph Explorer**.

To use these new features, you'll need to enable the [integration with Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

For full details, including sample Kusto queries for Azure Resource Graph, see [Access a software inventory](asset-inventory.md#access-a-software-inventory).

:::image type="content" source="media/deploy-vulnerability-assessment-defender-vulnerability-management/software-inventory.png" alt-text="If you've enabled the threat and vulnerability solution, Security Center's asset inventory offers a filter to select resources by their installed software.":::

### Changed prefix of some alert types from "ARM_" to "VM_"

In July 2021, we announced a [logical reorganization of Azure Defender for Resource Manager alerts](release-notes-archive.md#logical-reorganization-of-azure-defender-for-resource-manager-alerts)

During reorganization of Defender plans, we moved alerts from [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) to [Azure Defender for Servers](defender-for-servers-introduction.md).

With this update, we've changed the prefixes of these alerts to match this reassignment and replaced "ARM_" with "VM_" as shown in the following table:

| Original name                                  | From this change                              |
|------------------------------------------------|-----------------------------------------------|
| ARM_AmBroadFilesExclusion                      | VM_AmBroadFilesExclusion                      |
| ARM_AmDisablementAndCodeExecution              | VM_AmDisablementAndCodeExecution              |
| ARM_AmDisablement                              | VM_AmDisablement                              |
| ARM_AmFileExclusionAndCodeExecution            | VM_AmFileExclusionAndCodeExecution            |
| ARM_AmTempFileExclusionAndCodeExecution        | VM_AmTempFileExclusionAndCodeExecution        |
| ARM_AmTempFileExclusion                        | VM_AmTempFileExclusion                        |
| ARM_AmRealtimeProtectionDisabled               | VM_AmRealtimeProtectionDisabled               |
| ARM_AmTempRealtimeProtectionDisablement        | VM_AmTempRealtimeProtectionDisablement        |
| ARM_AmRealtimeProtectionDisablementAndCodeExec | VM_AmRealtimeProtectionDisablementAndCodeExec |
| ARM_AmMalwareCampaignRelatedExclusion          | VM_AmMalwareCampaignRelatedExclusion          |
| ARM_AmTemporarilyDisablement                   | VM_AmTemporarilyDisablement                   |
| ARM_UnusualAmFileExclusion                     | VM_UnusualAmFileExclusion                     |
| ARM_CustomScriptExtensionSuspiciousCmd         | VM_CustomScriptExtensionSuspiciousCmd         |
| ARM_CustomScriptExtensionSuspiciousEntryPoint  | VM_CustomScriptExtensionSuspiciousEntryPoint  |
| ARM_CustomScriptExtensionSuspiciousPayload     | VM_CustomScriptExtensionSuspiciousPayload     |
| ARM_CustomScriptExtensionSuspiciousFailure     | VM_CustomScriptExtensionSuspiciousFailure     |
| ARM_CustomScriptExtensionUnusualDeletion       | VM_CustomScriptExtensionUnusualDeletion       |
| ARM_CustomScriptExtensionUnusualExecution      | VM_CustomScriptExtensionUnusualExecution      |
| ARM_VMAccessUnusualConfigReset                 | VM_VMAccessUnusualConfigReset                 |
| ARM_VMAccessUnusualPasswordReset               | VM_VMAccessUnusualPasswordReset               |
| ARM_VMAccessUnusualSSHReset                    | VM_VMAccessUnusualSSHReset                    |

Learn more about the [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) and [Azure Defender for Servers](defender-for-servers-introduction.md) plans.

### Changes to the logic of a security recommendation for Kubernetes clusters

The recommendation "Kubernetes clusters should not use the default namespace" prevents usage of the default namespace for a range of resource types. Two of the resource types that were included in this recommendation have been removed: ConfigMap and Secret.

Learn more about this recommendation and hardening your Kubernetes clusters in [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md).

### Recommendations details pages now show related recommendations

To clarify the relationships between different recommendations, we've added a **Related recommendations** area to the details pages of many recommendations.

The three relationship types that are shown on these pages are:

- **Prerequisite** - A recommendation that must be completed before the selected recommendation
- **Alternative** - A different recommendation which provides another way of achieving the goals of the selected recommendation
- **Dependent** - A recommendation for which the selected recommendation is a prerequisite

For each related recommendation, the number of unhealthy resources is shown in the "Affected resources" column.

> [!TIP]
> If a related recommendation is grayed out, its dependency isn't yet completed and so isn't available.

An example of related recommendations:

1. Security Center checks your machines for supported vulnerability assessment solutions:<br>
    **A vulnerability assessment solution should be enabled on your virtual machines**

1. If one is found, you'll get notified about discovered vulnerabilities:<br>
    **Vulnerabilities in your virtual machines should be remediated**

Obviously, Security Center can't notify you about discovered vulnerabilities unless it finds a supported vulnerability assessment solution.

Therefore:

- Recommendation #1 is a prerequisite for recommendation #2
- Recommendation #2 depends upon recommendation #1

:::image type="content" source="media/release-notes/related-recommendations-solution-not-found.png" alt-text="Screenshot of recommendation to deploy vulnerability assessment solution.":::

:::image type="content" source="media/release-notes/related-recommendations-vulnerabilities-found.png" alt-text="Screenshot of recommendation to resolve discovered vulnerabilities.":::

### New alerts for Azure Defender for Kubernetes (in preview)

To expand the threat protections provided by Azure Defender for Kubernetes, we've added two preview alerts.

These alerts are generated based on a new machine learning model and Kubernetes advanced analytics, measuring multiple deployment and role assignment attributes against previous activities in the cluster and across all clusters monitored by Azure Defender.

| Alert (alert type)                                                                 | Description                                                                                                                                                                                                                                                                                                                                                      | MITRE tactic | Severity |
|------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------:|----------|
| **Anomalous pod deployment (Preview)**<br>(K8S_AnomalousPodDeployment)             | Kubernetes audit log analysis detected pod deployment that is anomalous, based on previous pod deployment activity. This activity is considered an anomaly when taking into account how the different features seen in the deployment operation are in relations to one another. The features monitored by this analytics include the container image registry used, the account performing the deployment, day of the week, how often does this account performs pod deployments, user agent used in the operation, is this a namespace which is pod deployment occur to often, or other feature. Top contributing reasons for raising this alert as anomalous activity are detailed under the alert extended properties. | Execution | Medium |
| **Excessive role permissions assigned in Kubernetes cluster (Preview)**<br>(K8S_ServiceAcountPermissionAnomaly) | Analysis of the Kubernetes audit logs detected an excessive permissions role assignment to your cluster. From examining role assignments, the listed permissions are uncommon to the specific service account. This detection considers previous role assignments to the same service account across clusters monitored by Azure, volume per permission, and the impact of the specific permission. The anomaly detection model used for this alert takes into account how this permission is used across all clusters monitored by Azure Defender. | Privilege Escalation | Low |

For a full list of the Kubernetes alerts, see [Alerts for Kubernetes clusters](alerts-reference.md#alerts-k8scluster).

## September 2021

In September, the following update was released:

### Two new recommendations to audit OS configurations for Azure security baseline compliance (in preview)

The following two recommendations have been released to assess your machines' compliance with the [Windows security baseline](../governance/policy/samples/guest-configuration-baseline-windows.md) and the [Linux security baseline](../governance/policy/samples/guest-configuration-baseline-linux.md):

- For Windows machines, [Vulnerabilities in security configuration on your Windows machines should be remediated (powered by Guest Configuration)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1f655fb7-63ca-4980-91a3-56dbc2b715c6)
- For Linux machines, [Vulnerabilities in security configuration on your Linux machines should be remediated (powered by Guest Configuration)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8c3d9ad0-3639-4686-9cd2-2b2ab2609bda)

These recommendations make use of the guest configuration feature of Azure Policy to compare the OS configuration of a machine with the baseline defined in the [Azure Security Benchmark](/security/benchmark/azure/overview).

Learn more about using these recommendations in [Harden a machine's OS configuration using guest configuration](apply-security-baseline.md).

## August 2021

Updates in August include:

- [Microsoft Defender for Endpoint for Linux now supported by Azure Defender for Servers (in preview)](#microsoft-defender-for-endpoint-for-linux-now-supported-by-azure-defender-for-servers-in-preview)
- [Two new recommendations for managing endpoint protection solutions (in preview)](#two-new-recommendations-for-managing-endpoint-protection-solutions-in-preview)
- [Built-in troubleshooting and guidance for solving common issues](#built-in-troubleshooting-and-guidance-for-solving-common-issues)
- [Regulatory compliance dashboard's Azure Audit reports released for general availability (GA)](#regulatory-compliance-dashboards-azure-audit-reports-released-for-general-availability-ga)
- [Deprecated recommendation 'Log Analytics agent health issues should be resolved on your machines'](#deprecated-recommendation-log-analytics-agent-health-issues-should-be-resolved-on-your-machines)
- [Azure Defender for container registries now scans for vulnerabilities in registries protected with Azure Private Link](#azure-defender-for-container-registries-now-scans-for-vulnerabilities-in-registries-protected-with-azure-private-link)
- [Security Center can now autoprovision the Azure Policy's Guest Configuration extension (in preview)](#security-center-can-now-autoprovision-the-azure-policys-guest-configuration-extension-in-preview)
- [Recommendations to enable Azure Defender plans now support "Enforce"](#recommendations-to-enable-azure-defender-plans-now-support-enforce)
- [CSV exports of recommendation data now limited to 20 MB](#csv-exports-of-recommendation-data-now-limited-to-20-mb)
- [Recommendations page now includes multiple views](#recommendations-page-now-includes-multiple-views)

### Microsoft Defender for Endpoint for Linux now supported by Azure Defender for Servers (in preview)

[Azure Defender for Servers](defender-for-servers-introduction.md) includes an integrated license for [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender). Together, they provide comprehensive endpoint detection and response (EDR) capabilities.

When Defender for Endpoint detects a threat, it triggers an alert. The alert is shown in Security Center. From Security Center, you can also pivot to the Defender for Endpoint console, and perform a detailed investigation to uncover the scope of the attack.

During the preview period, you'll deploy the [Defender for Endpoint for Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux) sensor to supported Linux machines in one of two ways depending on whether you've already deployed it to your Windows machines:

- [Existing users with Defender for Cloud's enhanced security features enabled and Microsoft Defender for Endpoint for Windows](integration-defender-for-endpoint.md#existing-users-with-defender-for-clouds-enhanced-security-features-enabled-and-microsoft-defender-for-endpoint-for-windows)
- [New users who have never enabled the integration with Microsoft Defender for Endpoint for Windows](integration-defender-for-endpoint.md?tabs=linux#new-users-who-never-enabled-the-integration-with-microsoft-defender-for-endpoint-for-windows)

Learn more in [Protect your endpoints with Security Center's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

### Two new recommendations for managing endpoint protection solutions (in preview)

We've added two **preview** recommendations to deploy and maintain the endpoint protection solutions on your machines. Both recommendations include support for Azure virtual machines and machines connected to Azure Arc-enabled servers.

|Recommendation |Description |Severity |
|---|---|---|
|[Endpoint protection should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) |To protect your machines from threats and vulnerabilities, install a supported endpoint protection solution.  <br> <a href="/azure/defender-for-cloud/endpoint-protection-recommendations-technical">Learn more about how Endpoint Protection for machines is evaluated.</a><br />(Related policy: [Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2faf6cd1bd-1635-48cb-bde7-5b15693900b9)) |High |
|[Endpoint protection health issues should be resolved on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000) |Resolve endpoint protection health issues on your virtual machines to protect them from latest threats and vulnerabilities. Azure Security Center supported endpoint protection solutions are documented [here](./supported-machines-endpoint-solutions-clouds-servers.md?tabs=features-windows). Endpoint protection assessment is documented <a href='/azure/defender-for-cloud/endpoint-protection-recommendations-technical'>here</a>.<br />(Related policy: [Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2faf6cd1bd-1635-48cb-bde7-5b15693900b9)) |Medium |

> [!NOTE]
> The recommendations show their freshness interval as 8 hours, but there are some scenarios in which this might take significantly longer. For example, when an on premises machine is deleted, it takes 24 hours for Security Center to identify the deletion. After that, the assessment will take up to 8 hours to return the information. In that specific situation therefore, it may take 32 hours for the machine to be removed from the list of affected resources.
>
> :::image type="content" source="media/release-notes/freshness-interval.png" alt-text="Freshness interval indicator for these two new Security Center recommendations":::

### Built-in troubleshooting and guidance for solving common issues

A new, dedicated area of the Security Center pages in the Azure portal provides a collated, ever-growing set of self-help materials for solving common challenges with Security Center and Azure Defender.

When you're facing an issue, or are seeking advice from our support team, **Diagnose and solve problems** is another tool to help you find the solution:

:::image type="content" source="media/release-notes/solve-problems.png" alt-text="Security Center's 'Diagnose and solve problems' page":::

### Regulatory compliance dashboard's Azure Audit reports released for general availability (GA)

The regulatory compliance dashboard's toolbar offers Azure and Dynamics certification reports for the standards applied to your subscriptions.

:::image type="content" source="media/release-notes/audit-reports-regulatory-compliance-dashboard.png" alt-text="Regulatory compliance dashboard's toolbar showing the button for generating audit reports.":::

You can select the tab for the relevant reports types (PCI, SOC, ISO, and others) and use filters to find the specific reports you need.

For more information, see [Generate compliance status reports and certificates](regulatory-compliance-dashboard.md#generate-compliance-status-reports-and-certificates).

:::image type="content" source="media/release-notes/audit-reports-list-regulatory-compliance-dashboard-ga.png" alt-text="Tabbed lists of available Azure Audit reports. Shown are tabs for ISO reports, SOC reports, PCI, and more.":::

### Deprecated recommendation 'Log Analytics agent health issues should be resolved on your machines'

We've found that recommendation **Log Analytics agent health issues should be resolved on your machines** impacts secure scores in ways that are inconsistent with Security Center's Cloud Security Posture Management (CSPM) focus. Typically, CSPM relates to identifying security misconfigurations. Agent health issues don't fit into this category of issues.

Also, the recommendation is an anomaly when compared with the other agents related to Security Center: this is the only agent with a recommendation related to health issues.

The recommendation was deprecated.

As a result of this deprecation, we've also made minor changes to the recommendations for installing the Log Analytics agent (**Log Analytics agent should be installed on...**).

It's likely that this change will impact your secure scores. For most subscriptions, we expect the change to lead to an increased score, but it's possible the updates to the installation recommendation might result in decreased scores in some cases.

> [!TIP]
> The [asset inventory](asset-inventory.md) page was also affected by this change as it displays the monitored status for machines (monitored, not monitored, or partially monitored - a state which refers to an agent with health issues).

### Azure Defender for container registries now scans for vulnerabilities in registries protected with Azure Private Link

Azure Defender for container registries includes a vulnerability scanner to scan images in your Azure Container Registry registries. Learn how to scan your registries and remediate findings in [Use Azure Defender for container registries to scan your images for vulnerabilities](defender-for-containers-vulnerability-assessment-azure.md).

To limit access to a registry hosted in Azure Container Registry, assign virtual network private IP addresses to the registry endpoints and use Azure Private Link as explained in [Connect privately to an Azure container registry using Azure Private Link](../container-registry/container-registry-private-link.md).

As part of our ongoing efforts to support additional environments and use cases, Azure Defender now also scans container registries protected with [Azure Private Link](../private-link/private-link-overview.md).

### Security Center can now autoprovision the Azure Policy's Guest Configuration extension (in preview)

Azure Policy can audit settings inside a machine, both for machines running in Azure and Arc connected machines. The validation is performed by the Guest Configuration extension and client. Learn more in [Understand Azure Policy's Guest Configuration](../governance/machine-configuration/overview.md).

With this update, you can now set Security Center to automatically provision this extension to all supported machines.

:::image type="content" source="media/release-notes/auto-provisioning-guest-configuration.png" alt-text="Enable auto deployment of Guest Configuration extension.":::

Learn more about how autoprovisioning works in [Configure autoprovisioning for agents and extensions](monitoring-components.md).

### Recommendations to enable Azure Defender plans now support "Enforce"

Security Center includes two features that help ensure newly created resources are provisioned in a secure manner: **enforce** and **deny**. When a recommendation offers these options, you can ensure your security requirements are met whenever someone attempts to create a resource:

- **Deny** stops unhealthy resources from being created
- **Enforce** automatically remediates non-compliant resources when they're created

With this update, the enforce option is now available on the recommendations to enable Azure Defender plans (such as **Azure Defender for App Service should be enabled**, **Azure Defender for Key Vault should be enabled**, **Azure Defender for Storage should be enabled**).

Learn more about these options in [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md).

### CSV exports of recommendation data now limited to 20 MB

We're instituting a limit of 20 MB when exporting Security Center recommendations data.

:::image type="content" source="media/upcoming-changes/download-csv-report.png" alt-text="Security Center's 'download CSV report' button to export recommendation data.":::

If you need to export larger amounts of data, use the available filters before selecting, or select subsets of your subscriptions and download the data in batches.

:::image type="content" source="media/upcoming-changes/filter-subscriptions.png" alt-text="Filtering subscriptions in the Azure portal.":::

Learn more about [performing a CSV export of your security recommendations](continuous-export.md#manual-one-time-export-of-alerts-and-recommendations).

### Recommendations page now includes multiple views

The recommendations page now has two tabs to provide alternate ways to view the recommendations relevant to your resources:

- **Secure score recommendations** - Use this tab to view the list of recommendations grouped by security control. Learn more about these controls in [Security controls and their recommendations](secure-score-security-controls.md).
- **All recommendations** - Use this tab to view the list of recommendations as a flat list. This tab is also great for understanding which initiative (including regulatory compliance standards) generated the recommendation. Learn more about initiatives and their relationship to recommendations in [What are security policies, initiatives, and recommendations?](security-policy-concept.md).

:::image type="content" source="media/release-notes/recommendations-tabs.png" alt-text="Tabs to change the view of the recommendations list in Azure Security Center.":::

## July 2021

Updates in July include:

- [Azure Sentinel connector now includes optional bi-directional alert synchronization (in preview)](#azure-sentinel-connector-now-includes-optional-bi-directional-alert-synchronization-in-preview)
- [Logical reorganization of Azure Defender for Resource Manager alerts](#logical-reorganization-of-azure-defender-for-resource-manager-alerts)
- [Enhancements to recommendation to enable Azure Disk Encryption (ADE)](#enhancements-to-recommendation-to-enable-azure-disk-encryption-ade)
- [Continuous export of secure score and regulatory compliance data released for general availability (GA)](#continuous-export-of-secure-score-and-regulatory-compliance-data-released-for-general-availability-ga)
- [Workflow automations can be triggered by changes to regulatory compliance assessments (GA)](#workflow-automations-can-be-triggered-by-changes-to-regulatory-compliance-assessments-ga)
- [Assessments API field 'FirstEvaluationDate' and 'StatusChangeDate' now available in workspace schemas and logic apps](#assessments-api-field-firstevaluationdate-and-statuschangedate-now-available-in-workspace-schemas-and-logic-apps)
- ['Compliance over time' workbook template added to Azure Monitor Workbooks gallery](#compliance-over-time-workbook-template-added-to-azure-monitor-workbooks-gallery)

### Azure Sentinel connector now includes optional bi-directional alert synchronization (in preview)

Security Center natively integrates with [Azure Sentinel](../sentinel/index.yml), Azure's cloud-native SIEM and SOAR solution.

Azure Sentinel includes built-in connectors for Azure Security Center at the subscription and tenant levels. Learn more in [Stream alerts to Azure Sentinel](export-to-siem.md#stream-alerts-to-microsoft-sentinel).

When you connect Azure Defender to Azure Sentinel, the status of Azure Defender alerts that get ingested into Azure Sentinel is synchronized between the two services. So, for example, when an alert is closed in Azure Defender, that alert will display as closed in Azure Sentinel as well. Changing the status of an alert in Azure Defender "won't"* affect the status of any Azure Sentinel **incidents** that contain the synchronized Azure Sentinel alert, only that of the synchronized alert itself.

When you enable preview feature **bi-directional alert synchronization**, it automatically syncs the status of the original Azure Defender alerts with Azure Sentinel incidents that contain copies of those Azure Defender alerts. So, for example, when an Azure Sentinel incident containing an Azure Defender alert is closed, Azure Defender will automatically close the corresponding original alert.

Learn more in [Connect Azure Defender alerts from Azure Security Center](../sentinel/connect-azure-security-center.md).

### Logical reorganization of Azure Defender for Resource Manager alerts

The alerts listed below were provided as part of the [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) plan.

As part of a logical reorganization of some of the Azure Defender plans, we've moved some alerts from **Azure Defender for Resource Manager** to **Azure Defender for Servers**.

The alerts are organized according to two main principles:

- Alerts that provide control-plane protection - across many Azure resource types - are part of Azure Defender for Resource Manager
- Alerts that protect specific workloads are in the Azure Defender plan that relates to the corresponding workload

These are the alerts that were part of Azure Defender for Resource Manager, and which, as a result of this change, are now part of Azure Defender for Servers:

- ARM_AmBroadFilesExclusion
- ARM_AmDisablementAndCodeExecution
- ARM_AmDisablement
- ARM_AmFileExclusionAndCodeExecution
- ARM_AmTempFileExclusionAndCodeExecution
- ARM_AmTempFileExclusion
- ARM_AmRealtimeProtectionDisabled
- ARM_AmTempRealtimeProtectionDisablement
- ARM_AmRealtimeProtectionDisablementAndCodeExec
- ARM_AmMalwareCampaignRelatedExclusion
- ARM_AmTemporarilyDisablement
- ARM_UnusualAmFileExclusion
- ARM_CustomScriptExtensionSuspiciousCmd
- ARM_CustomScriptExtensionSuspiciousEntryPoint
- ARM_CustomScriptExtensionSuspiciousPayload
- ARM_CustomScriptExtensionSuspiciousFailure
- ARM_CustomScriptExtensionUnusualDeletion
- ARM_CustomScriptExtensionUnusualExecution
- ARM_VMAccessUnusualConfigReset
- ARM_VMAccessUnusualPasswordReset
- ARM_VMAccessUnusualSSHReset

Learn more about the [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) and [Azure Defender for Servers](defender-for-servers-introduction.md) plans.

### Enhancements to recommendation to enable Azure Disk Encryption (ADE)

Following user feedback, we've renamed the recommendation **Disk encryption should be applied on virtual machines**.

The new recommendation uses the same assessment ID and is called **Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources**.

The description has also been updated to better explain the purpose of this hardening recommendation:

| Recommendation                                                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Severity |
|--------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|
| **Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources** | By default, a virtual machine’s OS and data disks are encrypted-at-rest using platform-managed keys; temp disks and data caches aren’t encrypted, and data isn’t encrypted when flowing between compute and storage resources. For more information, see the [comparison of different disk encryption technologies in Azure](https://aka.ms/diskencryptioncomparison).<br>Use Azure Disk Encryption to encrypt all this data. Disregard this recommendation if: (1) you’re using the encryption-at-host feature, or (2) server-side encryption on Managed Disks meets your security requirements. Learn more in Server-side encryption of Azure Disk Storage. | High     |

### Continuous export of secure score and regulatory compliance data released for general availability (GA)

[Continuous export](continuous-export.md) provides the mechanism for exporting your security alerts and recommendations for tracking with other monitoring tools in your environment.

When you set up your continuous export, you configure what is exported, and where it will go. Learn more in the [overview of continuous export](continuous-export.md).

We've enhanced and expanded this feature over time:

- In November 2020, we added the **preview** option to stream changes to your **secure score**.<br/>For full details, see [Secure score is now available in continuous export (preview)](release-notes-archive.md#secure-score-is-now-available-in-continuous-export-preview).

- In December 2020, we added the **preview** option to stream changes to your **regulatory compliance assessment data**.<br/>For full details, see [Continuous export gets new data types (preview)](release-notes-archive.md#continuous-export-gets-new-data-types-and-improved-deployifnotexist-policies).

With this update, these two options are released for general availability (GA).

### Workflow automations can be triggered by changes to regulatory compliance assessments (GA)

In February 2021, we added a **preview** third data type to the trigger options for your workflow automations: changes to regulatory compliance assessments. Learn more in [Workflow automations can be triggered by changes to regulatory compliance assessments](release-notes-archive.md#workflow-automations-can-be-triggered-by-changes-to-regulatory-compliance-assessments-in-preview).

With this update, this trigger option is released for general availability (GA).

Learn how to use the workflow automation tools in [Automate responses to Security Center triggers](workflow-automation.md).

:::image type="content" source="media/release-notes/regulatory-compliance-triggers-workflow-automation.png" alt-text="Using changes to regulatory compliance assessments to trigger a workflow automation." lightbox="media/release-notes/regulatory-compliance-triggers-workflow-automation.png":::

### Assessments API field 'FirstEvaluationDate' and 'StatusChangeDate' now available in workspace schemas and logic apps

In May 2021, we updated the Assessment API with two new fields, **FirstEvaluationDate** and **StatusChangeDate**. For full details, see [Assessments API expanded with two new fields](release-notes-archive.md#assessments-api-expanded-with-two-new-fields).

Those fields were accessible through the REST API, Azure Resource Graph, continuous export, and in CSV exports.

With this change, we're making the information available in the Log Analytics workspace schema and from logic apps.

### 'Compliance over time' workbook template added to Azure Monitor Workbooks gallery

In March, we announced the integrated Azure Monitor Workbooks experience in Security Center (see [Azure Monitor Workbooks integrated into Security Center and three templates provided](release-notes-archive.md#azure-monitor-workbooks-integrated-into-security-center-and-three-templates-provided)).

The initial release included three templates to build dynamic and visual reports about your organization's security posture.

We've now added a workbook dedicated to tracking a subscription's compliance with the regulatory or industry standards applied to it.

Learn about using these reports or building your own in [Create rich, interactive reports of Security Center data](custom-dashboards-azure-workbooks.md).

:::image type="content" source="media/custom-dashboards-azure-workbooks/compliance-over-time-details.png" alt-text="Azure Security Center's compliance over time workbook":::

## June 2021

Updates in June include:

- [New alert for Azure Defender for Key Vault](#new-alert-for-azure-defender-for-key-vault)
- [Recommendations to encrypt with customer-managed keys (CMKs) disabled by default](#recommendations-to-encrypt-with-customer-managed-keys-cmks-disabled-by-default)
- [Prefix for Kubernetes alerts changed from "AKS_" to "K8S_"](#prefix-for-kubernetes-alerts-changed-from-aks_-to-k8s_)
- [Deprecated two recommendations from "Apply system updates" security control](#deprecated-two-recommendations-from-apply-system-updates-security-control)

### New alert for Azure Defender for Key Vault

To expand the threat protections provided by Azure Defender for Key Vault, we've added the following alert:

| Alert (alert type)                                                                 | Description                                                                                                                                                                                                                                                                                                                                                      | MITRE tactic | Severity |
|------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------:|----------|
| Access from a suspicious IP address to a key vault<br>(KV_SuspiciousIPAccess)  | A key vault has been successfully accessed by an IP that has been identified by Microsoft Threat Intelligence as a suspicious IP address. This may indicate that your infrastructure has been compromised. We recommend further investigation. Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684). | Credential Access                            | Medium   |

For more information, see:

- [Introduction to Azure Defender for Key Vault](defender-for-resource-manager-introduction.md)
- [Respond to Azure Defender for Key Vault alerts](defender-for-key-vault-usage.md)
- [List of alerts provided by Azure Defender for Key Vault](alerts-reference.md#alerts-azurekv)

### Recommendations to encrypt with customer-managed keys (CMKs) disabled by default

Security Center includes multiple recommendations to encrypt data at rest with customer-managed keys, such as:

- Container registries should be encrypted with a customer-managed key (CMK)
- Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest
- Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)

Data in Azure is encrypted automatically using platform-managed keys, so the use of customer-managed keys should only be applied when required for compliance with a specific policy your organization is choosing to enforce.

With this change, the recommendations to use CMKs are now **disabled by default**. When relevant for your organization, you can enable them by changing the *Effect* parameter for the corresponding security policy to **AuditIfNotExists** or **Enforce**. Learn more in [Enable a security recommendation](tutorial-security-policy.md#enable-a-security-recommendation).

This change is reflected in the names of the recommendation with a new prefix, **[Enable if required]**, as shown in the following examples:

- [Enable if required] Storage accounts should use customer-managed key to encrypt data at rest
- [Enable if required] Container registries should be encrypted with a customer-managed key (CMK)
- [Enable if required] Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest

:::image type="content" source="media/upcoming-changes/customer-managed-keys-disabled.png" alt-text="Security Center's CMK recommendations will be disabled by default." lightbox="media/upcoming-changes/customer-managed-keys-disabled.png":::

### Prefix for Kubernetes alerts changed from "AKS_" to "K8S_"

Azure Defender for Kubernetes recently expanded to protect Kubernetes clusters hosted on-premises and in multicloud environments. Learn more in [Use Azure Defender for Kubernetes to protect hybrid and multicloud Kubernetes deployments (in preview)](release-notes-archive.md#use-azure-defender-for-kubernetes-to-protect-hybrid-and-multicloud-kubernetes-deployments-in-preview).

To reflect the fact that the security alerts provided by Azure Defender for Kubernetes are no longer restricted to clusters on Azure Kubernetes Service, we've changed the prefix for the alert types from "AKS_" to "K8S_." Where necessary, the names and descriptions were updated too. For example, this alert:

|Alert (alert type)|Description|
|----|----|
|Kubernetes penetration testing tool detected<br>(**AKS**_PenTestToolsKubeHunter)|Kubernetes audit log analysis detected usage of Kubernetes penetration testing tool in the **AKS** cluster. While this behavior can be legitimate, attackers might use such public tools for malicious purposes.

was changed to:

|Alert (alert type)|Description|
|----|----|
|Kubernetes penetration testing tool detected<br>(**K8S**_PenTestToolsKubeHunter)|Kubernetes audit log analysis detected usage of Kubernetes penetration testing tool in the **Kubernetes** cluster. While this behavior can be legitimate, attackers might use such public tools for malicious purposes.|

Any suppression rules that refer to alerts beginning "AKS_" were automatically converted. If you've setup SIEM exports, or custom automation scripts that refer to Kubernetes alerts by alert type, you'll need to update them with the new alert types.

For a full list of the Kubernetes alerts, see [Alerts for Kubernetes clusters](alerts-reference.md#alerts-k8scluster).

### Deprecated two recommendations from "Apply system updates" security control

The following two recommendations were deprecated:

- **OS version should be updated for your cloud service roles** - By default, Azure periodically updates your guest OS to the latest supported image within the OS family that you've specified in your service configuration (.cscfg), such as Windows Server 2016.
- **Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version** - This recommendation's evaluations aren't as wide-ranging as we'd like them to be. We plan to replace the recommendation with an enhanced version that's better aligned with your security needs.

## May 2021

Updates in May include:

- [Azure Defender for DNS and Azure Defender for Resource Manager released for general availability (GA)](#azure-defender-for-dns-and-azure-defender-for-resource-manager-released-for-general-availability-ga)
- [Azure Defender for open-source relational databases released for general availability (GA)](#azure-defender-for-open-source-relational-databases-released-for-general-availability-ga)
- [New alerts for Azure Defender for Resource Manager](#new-alerts-for-azure-defender-for-resource-manager)
- [CI/CD vulnerability scanning of container images with GitHub workflows and Azure Defender (preview)](#cicd-vulnerability-scanning-of-container-images-with-github-workflows-and-azure-defender-preview)
- [More Resource Graph queries available for some recommendations](#more-resource-graph-queries-available-for-some-recommendations)
- [SQL data classification recommendation severity changed](#sql-data-classification-recommendation-severity-changed)
- [New recommendations to enable trusted launch capabilities (in preview)](#new-recommendations-to-enable-trusted-launch-capabilities-in-preview)
- [New recommendations for hardening Kubernetes clusters (in preview)](#new-recommendations-for-hardening-kubernetes-clusters-in-preview)
- [Assessments API expanded with two new fields](#assessments-api-expanded-with-two-new-fields)
- [Asset inventory gets a cloud environment filter](#asset-inventory-gets-a-cloud-environment-filter)

### Azure Defender for DNS and Azure Defender for Resource Manager released for general availability (GA)

These two cloud-native breadth threat protection plans are now GA.

These new protections greatly enhance your resiliency against attacks from threat actors, and significantly increase the number of Azure resources protected by Azure Defender.

- **Azure Defender for Resource Manager** - automatically monitors all resource management operations performed in your organization. For more information, see:
  - [Introduction to Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md)
  - [Respond to Azure Defender for Resource Manager alerts](defender-for-resource-manager-usage.md)
  - [List of alerts provided by Azure Defender for Resource Manager](alerts-reference.md#alerts-resourcemanager)

- **Azure Defender for DNS** - continuously monitors all DNS queries from your Azure resources. For more information, see:
  - [Introduction to Azure Defender for DNS](defender-for-dns-introduction.md)
  - [Respond to Azure Defender for DNS alerts](defender-for-dns-usage.md)
  - [List of alerts provided by Azure Defender for DNS](alerts-reference.md#alerts-dns)

To simplify the process of enabling these plans, use the recommendations:

- **Azure Defender for Resource Manager should be enabled**
- **Azure Defender for DNS should be enabled**

> [!NOTE]
> Enabling Azure Defender plans results in charges. Learn about the pricing details per region on Security Center's [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

### Azure Defender for open-source relational databases released for general availability (GA)

Azure Security Center expands its offer for SQL  protection with a new bundle to cover your open-source relational databases:

- **Azure Defender for Azure SQL database servers** - defends your Azure-native SQL Servers
- **Azure Defender for SQL servers on machines** - extends the same protections to your SQL servers in hybrid, multicloud, and on-premises environments
- **Azure Defender for open-source relational databases** - defends your Azure Databases for MySQL, PostgreSQL, and MariaDB single servers

Azure Defender for open-source relational databases constantly monitors your servers for security threats and detects anomalous database activities indicating potential threats to Azure Database for MySQL, PostgreSQL, and MariaDB. Some examples are:

- **Granular detection of brute force attacks** -  Azure Defender for open-source relational databases provides detailed information on attempted and successful brute force attacks. This lets you investigate and respond with a more complete understanding of the nature and status of the attack on your environment.
- **Behavioral alerts detection** - Azure Defender for open-source relational databases alerts you to suspicious and unexpected behaviors on your servers, such as changes in the access pattern to your database.
- **Threat intelligence-based detection** - Azure Defender applies Microsoft’s threat intelligence and vast knowledge base to surface threat alerts so you can act against them.

Learn more in [Introduction to Azure Defender for open-source relational databases](defender-for-databases-introduction.md).

### New alerts for Azure Defender for Resource Manager

To expand the threat protections provided by Azure Defender for Resource Manager, we've added the following alerts:

| Alert (alert type)                                                                                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                              | MITRE tactics | Severity |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------:|----------|
|**Permissions granted for an RBAC role in an unusual way for your Azure environment (Preview)**<br>(ARM_AnomalousRBACRoleAssignment)|Azure Defender for Resource Manager detected an RBAC role assignment that's unusual when compared with other assignments performed by the same assigner /  performed for the same assignee / in your tenant due to the following anomalies: assignment time, assigner location, assigner, authentication method, assigned entities, client software used, assignment extent. This operation might have been performed by a legitimate user in your organization. Alternatively, it might indicate that an account in your organization was breached, and that the threat actor is trying to grant permissions to an additional user account they own.|Lateral Movement, Defense Evasion|Medium|
|**Privileged custom role created for your subscription in a suspicious way (Preview)**<br>(ARM_PrivilegedRoleDefinitionCreation)|Azure Defender for Resource Manager detected a suspicious creation of privileged custom role definition in your subscription. This operation might have been performed by a legitimate user in your organization. Alternatively, it might indicate that an account in your organization was breached, and that the threat actor is trying to create a privileged role to use in the future to evade detection.|Lateral Movement, Defense Evasion|Low|
|**Azure Resource Manager operation from suspicious IP address (Preview)**<br>(ARM_OperationFromSuspiciousIP)|Azure Defender for Resource Manager detected an operation from an IP address that has been marked as suspicious in threat intelligence feeds.|Execution|Medium|
|**Azure Resource Manager operation from suspicious proxy IP address (Preview)**<br>(ARM_OperationFromSuspiciousProxyIP)|Azure Defender for Resource Manager detected a resource management operation from an IP address that is associated with proxy services, such as TOR. While this behavior can be legitimate, it's often seen in malicious activities, when threat actors try to hide their source IP.|Defense Evasion|Medium|

For more information, see:

- [Introduction to Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md)
- [Respond to Azure Defender for Resource Manager alerts](defender-for-resource-manager-usage.md)
- [List of alerts provided by Azure Defender for Resource Manager](alerts-reference.md#alerts-resourcemanager)

### CI/CD vulnerability scanning of container images with GitHub workflows and Azure Defender (preview)

Azure Defender for container registries now provides DevSecOps teams observability into GitHub Actions workflows.

The new vulnerability scanning feature for container images, utilizing Trivy, helps you to scan for common vulnerabilities in their container images *before* pushing images to container registries.

Container scan reports are summarized in Azure Security Center, providing security teams better insight and understanding about the source of vulnerable container images and the workflows and repositories from where they originate.

Learn more in [Identify vulnerable container images in your CI/CD workflows](defender-for-devops-introduction.md).

### More Resource Graph queries available for some recommendations

All of Security Center's recommendations have the option to view the information about the status of affected resources using Azure Resource Graph from the **Open query**. For full details about this powerful feature, see [Review recommendation data in Azure Resource Graph Explorer (ARG)](review-security-recommendations.md#review-recommendation-data-in-azure-resource-graph-arg).

Security Center includes built-in vulnerability scanners to scan your VMs, SQL servers and their hosts, and container registries for security vulnerabilities. The findings are returned as recommendations with all the individual findings for each resource type gathered into a single view. The recommendations are:

- Vulnerabilities in Azure Container Registry images should be remediated (powered by Qualys)
- Vulnerabilities in your virtual machines should be remediated
- SQL databases should have vulnerability findings resolved
- SQL servers on machines should have vulnerability findings resolved

With this change, you can use the **Open query** button to also open the query showing the security findings.

:::image type="content" source="media/release-notes/open-query-menu-security-findings.png" alt-text="The open query button now offers options for a deeper query showing the security findings for vulnerability scanner-related recommendations.":::

The **Open query** button offers additional options for some other recommendations where relevant.

Learn more about Security Center's vulnerability scanners:

- [Azure Defender's integrated Qualys vulnerability scanner for Azure and hybrid machines](deploy-vulnerability-assessment-vm.md)
- [Azure Defender's integrated vulnerability assessment scanner for SQL servers](defender-for-sql-on-machines-vulnerability-assessment.md)
- [Azure Defender's integrated vulnerability assessment scanner for container registries](defender-for-containers-vulnerability-assessment-azure.md)

### SQL data classification recommendation severity changed

The severity of the recommendation **Sensitive data in your SQL databases should be classified** was changed from **High** to **Low**.

This is part of an ongoing change to this recommendation announced in our upcoming changes page.

### New recommendations to enable trusted launch capabilities (in preview)

Azure offers trusted launch as a seamless way to improve the security of [generation 2](../virtual-machines/generation-2.md) VMs. Trusted launch protects against advanced and persistent attack techniques. Trusted launch is composed of several, coordinated infrastructure technologies that can be enabled independently. Each technology provides another layer of defense against sophisticated threats. Learn more in [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).

> [!IMPORTANT]
> Trusted launch requires the creation of new virtual machines. You can't enable trusted launch on existing virtual machines that were initially created without it.
>
> Trusted launch is currently in public preview. The preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

Security Center's recommendation, **vTPM should be enabled on supported virtual machines**, ensures your Azure VMs are using a vTPM. This virtualized version of a hardware Trusted Platform Module enables attestation by measuring the entire boot chain of your VM (UEFI, OS, system, and drivers).

With the vTPM enabled, the **Guest Attestation extension** can remotely validate the secure boot. The following recommendations ensure this extension is deployed:

- **Secure Boot should be enabled on supported Windows virtual machines**
- **Guest Attestation extension should be installed on supported Windows virtual machines**
- **Guest Attestation extension should be installed on supported Windows Virtual Machine Scale Sets**
- **Guest Attestation extension should be installed on supported Linux virtual machines**
- **Guest Attestation extension should be installed on supported Linux Virtual Machine Scale Sets**

Learn more in [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).

### New recommendations for hardening Kubernetes clusters (in preview)

The following recommendations allow you to further harden your Kubernetes clusters

- **Kubernetes clusters should not use the default namespace** - To protect against unauthorized access for ConfigMap, Pod, Secret, Service, and ServiceAccount resource types, prevent usage of the default namespace in Kubernetes clusters.
- **Kubernetes clusters should disable automounting API credentials** - To prevent a potentially compromised Pod resource from running API commands against Kubernetes clusters, disable automounting API credentials.
- **Kubernetes clusters should not grant CAPSYSADMIN security capabilities**

Learn how Security Center can protect your containerized environments in [Container security in Security Center](defender-for-containers-introduction.md).

### Assessments API expanded with two new fields

We've added the following two fields to the [Assessments REST API](/rest/api/defenderforcloud/assessments):

- **FirstEvaluationDate** – The time that the recommendation was created and first evaluated. Returned as UTC time in ISO 8601 format.
- **StatusChangeDate** – The time that the status of the recommendation last changed. Returned as UTC time in ISO 8601 format.

The initial default value for these fields - for all recommendations - is `2021-03-14T00:00:00+0000000Z`.

To access this information, you can use any of the methods in the table below.

| Tool                 | Details                                                                                                                                                                |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| REST API call        | `GET https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/providers/Microsoft.Security/assessments?api-version=2019-01-01-preview&$expand=statusEvaluationDates` |
| Azure Resource Graph | `securityresources`<br>`where type == "microsoft.security/assessments"`                                                                                                |
| Continuous export    | The two dedicated fields will be available the Log Analytics workspace data                                                                                            |
| [CSV export](continuous-export.md#manual-one-time-export-of-alerts-and-recommendations) | The two fields are included in the CSV files                                                        |

Learn more about the [Assessments REST API](/rest/api/defenderforcloud/assessments).

### Asset inventory gets a cloud environment filter

Security Center's asset inventory page offers many filters to quickly refine the list of resources displayed. Learn more in [Explore and manage your resources with asset inventory](asset-inventory.md).

A new filter offers the option to refine the list according to the cloud accounts you've connected with Security Center's multicloud features:

:::image type="content" source="media/asset-inventory/filter-environment.png" alt-text="Inventory's environment filter":::

Learn more about the multicloud capabilities:

- [Connect your AWS accounts to Azure Security Center](quickstart-onboard-aws.md)
- [Connect your GCP projects to Azure Security Center](quickstart-onboard-gcp.md)

## April 2021

Updates in April include:

- [Refreshed resource health page (in preview)](#refreshed-resource-health-page-in-preview)
- [Container registry images that have been recently pulled are now rescanned weekly (released for general availability (GA))](#container-registry-images-that-have-been-recently-pulled-are-now-rescanned-weekly-released-for-general-availability-ga)
- [Use Azure Defender for Kubernetes to protect hybrid and multicloud Kubernetes deployments (in preview)](#use-azure-defender-for-kubernetes-to-protect-hybrid-and-multicloud-kubernetes-deployments-in-preview)
- [Microsoft Defender for Endpoint integration with Azure Defender now supports Windows Server 2019 and Windows 10 on Windows Virtual Desktop released for general availability (GA)](#microsoft-defender-for-endpoint-integration-with-azure-defender-now-supports-windows-server-2019-and-windows-10-on-windows-virtual-desktop-released-for-general-availability-ga)
- [Recommendations to enable Azure Defender for DNS and Resource Manager (in preview)](#recommendations-to-enable-azure-defender-for-dns-and-resource-manager-in-preview)
- [Three regulatory compliance standards added: Azure CIS 1.3.0, CMMC Level 3, and New Zealand ISM Restricted](#three-regulatory-compliance-standards-added-azure-cis-130-cmmc-level-3-and-new-zealand-ism-restricted)
- [Four new recommendations related to guest configuration (in preview)](#four-new-recommendations-related-to-guest-configuration-in-preview)
- [CMK recommendations moved to best practices security control](#cmk-recommendations-moved-to-best-practices-security-control)
- [Eleven Azure Defender alerts deprecated](#11-azure-defender-alerts-deprecated)
- [Two recommendations from "Apply system updates" security control were deprecated](#two-recommendations-from-apply-system-updates-security-control-were-deprecated)
- [Azure Defender for SQL on machine tile removed from Azure Defender dashboard](#azure-defender-for-sql-on-machine-tile-removed-from-azure-defender-dashboard)
- [Recommendations were moved between security controls](#twenty-one-recommendations-moved-between-security-controls)

### Refreshed resource health page (in preview)

Resource health was expanded, enhanced, and improved to provide a snapshot view of the overall health of a single resource.

You can review detailed information about the resource and all recommendations that apply to that resource. Also, if you're using [the advanced protection plans of Microsoft Defender](defender-for-cloud-introduction.md), you can see outstanding security alerts for that specific resource too.

To open the resource health page for a resource, select any resource from the [asset inventory page](asset-inventory.md).

This preview page in Security Center's portal pages shows:

1. **Resource information** - The resource group and subscription it's attached to, the geographic location, and more.
1. **Applied security feature** - Whether Azure Defender is enabled for the resource.
1. **Counts of outstanding recommendations and alerts** - The number of outstanding security recommendations and Azure Defender alerts.
1. **Actionable recommendations and alerts** - Two tabs list the recommendations and alerts that apply to the resource.

:::image type="content" source="media/investigate-resource-health/resource-health-page-virtual-machine.gif" alt-text="Azure Security Center's resource health page showing the health information for a virtual machine":::

Learn more in [Tutorial: Investigate the health of your resources](investigate-resource-health.md).

### Container registry images that have been recently pulled are now rescanned weekly (released for general availability (GA))

Azure Defender for container registries includes a built-in vulnerability scanner. This scanner immediately scans any image you push to your registry and any image pulled within the last 30 days.

New vulnerabilities are discovered every day. With this update, container images that were pulled from your registries during the last 30 days will be **rescanned** every week. This ensures that newly discovered vulnerabilities are identified in your images.

Scanning is charged on a per image basis, so there's no additional charge for these rescans.

Learn more about this scanner in [Use Azure Defender for container registries to scan your images for vulnerabilities](defender-for-containers-vulnerability-assessment-azure.md).

### Use Azure Defender for Kubernetes to protect hybrid and multicloud Kubernetes deployments (in preview)

Azure Defender for Kubernetes is expanding its threat protection capabilities to defend your clusters wherever they're deployed. This was enabled by integrating with [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) and its new [extensions capabilities](../azure-arc/kubernetes/extensions.md).

When you've enabled Azure Arc on your non-Azure Kubernetes clusters, a new recommendation from Azure Security Center offers to deploy the Azure Defender agent to them with only a few clicks.

Use the recommendation (**Azure Arc-enabled Kubernetes clusters should have Azure Defender's extension installed**) and the extension to protect Kubernetes clusters deployed in other cloud providers, although not on their managed Kubernetes services.

This integration between Azure Security Center, Azure Defender, and Azure Arc-enabled Kubernetes brings:

- Easy provisioning of the Azure Defender agent to unprotected Azure Arc-enabled Kubernetes clusters (manually and at-scale)
- Monitoring of the Azure Defender agent and its provisioning state from the Azure Arc Portal
- Security recommendations from Security Center are reported in the new Security page of the Azure Arc Portal
- Identified security threats from Azure Defender are reported in the new Security page of the Azure Arc Portal
- Azure Arc-enabled Kubernetes clusters are integrated into the Azure Security Center platform and experience

Learn more in [Use Azure Defender for Kubernetes with your on-premises and multicloud Kubernetes clusters](defender-for-kubernetes-azure-arc.md).

:::image type="content" source="media/defender-for-kubernetes-azure-arc/extension-recommendation.png" alt-text="Azure Security Center's recommendation for deploying the Azure Defender agent for Azure Arc-enabled Kubernetes clusters." lightbox="media/defender-for-kubernetes-azure-arc/extension-recommendation.png":::

### Microsoft Defender for Endpoint integration with Azure Defender now supports Windows Server 2019 and Windows 10 on Windows Virtual Desktop released for general availability (GA)

Microsoft Defender for Endpoint is a holistic, cloud delivered endpoint security solution. It provides risk-based vulnerability management and assessment as well as endpoint detection and response (EDR). For a full list of the benefits of using Defender for Endpoint together with Azure Security Center, see [Protect your endpoints with Security Center's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

When you enable Azure Defender for Servers running Windows Server, a license for Defender for Endpoint is included with the plan. If you've already enabled Azure Defender for Servers and you have Windows Server 2019 servers in your subscription, they'll automatically receive Defender for Endpoint with this update. No manual action is required.

Support has now been expanded to include Windows Server 2019 and Windows 10 on [Windows Virtual Desktop](../virtual-desktop/overview.md).

> [!NOTE]
> If you're enabling Defender for Endpoint on a Windows Server 2019 server, ensure it meets the prerequisites described in [Enable the Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md#enable-the-microsoft-defender-for-endpoint-integration).

### Recommendations to enable Azure Defender for DNS and Resource Manager (in preview)

Two new recommendations have been added to simplify the process of enabling [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) and [Azure Defender for DNS](defender-for-dns-introduction.md):

- **Azure Defender for Resource Manager should be enabled** - Defender for Resource Manager automatically monitors the resource management operations in your organization. Azure Defender detects threats and alerts you about suspicious activity.
- **Azure Defender for DNS should be enabled** - Defender for DNS provides an additional layer of protection for your cloud resources by continuously monitoring all DNS queries from your Azure resources. Azure Defender alerts you about suspicious activity at the DNS layer.

Enabling Azure Defender plans results in charges. Learn about the pricing details per region on Security Center's [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

> [!TIP]
> Preview recommendations don't render a resource unhealthy, and they aren't included in the calculations of your secure score. Remediate them wherever possible, so that when the preview period ends they'll contribute towards your score. Learn more about how to respond to these recommendations in [Remediate recommendations in Azure Security Center](implement-security-recommendations.md).

### Three regulatory compliance standards added: Azure CIS 1.3.0, CMMC Level 3, and New Zealand ISM Restricted

We've added three standards for use with Azure Security Center. Using the regulatory compliance dashboard, you can now track your compliance with:

- [CIS Microsoft Azure Foundations Benchmark 1.3.0](../governance/policy/samples/cis-azure-1-3-0.md)
- [CMMC Level 3](../governance/policy/samples/cmmc-l3.md)
- [New Zealand ISM Restricted](../governance/policy/samples/new-zealand-ism.md)

You can assign these to your subscriptions as described in [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

:::image type="content" source="media/release-notes/additional-regulatory-compliance-standards.png" alt-text="Three standards added for use with Azure Security Center's regulatory compliance dashboard." lightbox="media/release-notes/additional-regulatory-compliance-standards.png":::

Learn more in:

- [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md)
- [Tutorial: Improve your regulatory compliance](regulatory-compliance-dashboard.md)
- [FAQ - Regulatory compliance dashboard](faq-regulatory-compliance.yml)

### Four new recommendations related to guest configuration (in preview)

Azure's [Guest Configuration extension](../governance/machine-configuration/overview.md) reports to Security Center to help ensure your virtual machines' in-guest settings are hardened. The extension isn't required for Arc-enabled servers because it's included in the Arc Connected Machine agent. The extension requires a system-managed identity on the machine.

We've added four new recommendations to Security Center to make the most of this extension.

- Two recommendations prompt you to install the extension and its required system-managed identity:
  - **Guest Configuration extension should be installed on your machines**
  - **Virtual machines' Guest Configuration extension should be deployed with system-assigned managed identity**

- When the extension is installed and running, it will begin auditing your machines and you'll be prompted to harden settings such as configuration of the operating system and environment settings. These two recommendations will prompt you to harden your Windows and Linux machines as described:
  - **Windows Defender Exploit Guard should be enabled on your machines**
  - **Authentication to Linux machines should require SSH keys**

Learn more in [Understand Azure Policy's Guest Configuration](../governance/machine-configuration/overview.md).

### CMK recommendations moved to best practices security control

Every organization's security program includes data encryption requirements. By default, Azure customers' data is encrypted at rest with service-managed keys. However, customer-managed keys (CMK) are commonly required to meet regulatory compliance standards. CMKs let you encrypt your data with an [Azure Key Vault](../key-vault/general/overview.md) key created and owned by you. This gives you full control and responsibility for the key lifecycle, including rotation and management.

Azure Security Center's security controls are logical groups of related security recommendations, and reflect your vulnerable attack surfaces. Each control has a maximum number of points you can add to your secure score if you remediate all of the recommendations listed in the control, for all of your resources. The **Implement security best practices** security control is worth zero points. So recommendations in this control don't affect your secure score.

The recommendations listed below are being moved to the **Implement security best practices** security control to better reflect their optional nature. This move ensures that these recommendations are in the most appropriate control to meet their objective.

- Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest
- Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)
- Azure AI services accounts should enable data encryption with a customer-managed key (CMK)
- Container registries should be encrypted with a customer-managed key (CMK)
- SQL managed instances should use customer-managed keys to encrypt data at rest
- SQL servers should use customer-managed keys to encrypt data at rest
- Storage accounts should use customer-managed key (CMK) for encryption

Learn which recommendations are in each security control in [Security controls and their recommendations](secure-score-security-controls.md).

### 11 Azure Defender alerts deprecated

The eleven Azure Defender alerts listed below have been deprecated.

- New alerts will replace these two alerts and provide better coverage:

    | AlertType                | AlertDisplayName                                                         |
    |--------------------------|--------------------------------------------------------------------------|
    | ARM_MicroBurstDomainInfo | PREVIEW - MicroBurst toolkit "Get-AzureDomainInfo" function run detected |
    | ARM_MicroBurstRunbook    | PREVIEW - MicroBurst toolkit "Get-AzurePasswords" function run detected  |

- These nine alerts relate to an Azure Active Directory Identity Protection connector (IPC) that has already been deprecated:

    | AlertType           | AlertDisplayName              |
    |---------------------|-------------------------------|
    | UnfamiliarLocation  | Unfamiliar sign-in properties |
    | AnonymousLogin      | Anonymous IP address          |
    | InfectedDeviceLogin | Malware linked IP address     |
    | ImpossibleTravel    | Atypical travel               |
    | MaliciousIP         | Malicious IP address          |
    | LeakedCredentials   | Leaked credentials            |
    | PasswordSpray       | Password Spray                |
    | LeakedCredentials   | Azure AD threat intelligence  |
    | AADAI               | Azure AD AI                   |

    > [!TIP]
    > These nine IPC alerts were never Security Center alerts. They’re part of the Azure Active Directory (AAD) Identity Protection connector (IPC) that was sending them to Security Center. For the last two years, the only customers who’ve been seeing those alerts are organizations who configured the export (from the connector to ASC) in 2019 or earlier. AAD IPC has continued to show them in its own alerts systems and they’ve continued to be available in Azure Sentinel. The only change is that they’re no longer appearing in Security Center.

### Two recommendations from "Apply system updates" security control were deprecated

The following two recommendations were deprecated and the changes might result in a slight impact on your secure score:

- **Your machines should be restarted to apply system updates**
- **Monitoring agent should be installed on your machines**. This recommendation relates to on-premises machines only and some of its logic will be transferred to another recommendation, **Log Analytics agent health issues should be resolved on your machines**

We recommend checking your continuous export and workflow automation configurations to see whether these recommendations are included in them. Also, any dashboards or other monitoring tools that might be using them should be updated accordingly.

Learn more about these recommendations in the [security recommendations reference page](recommendations-reference.md).

### Azure Defender for SQL on machine tile removed from Azure Defender dashboard

The Azure Defender dashboard's coverage area includes tiles for the relevant Azure Defender plans for your environment. Due to an issue with the reporting of the numbers of protected and unprotected resources, we've decided to temporarily remove the resource coverage status for **Azure Defender for SQL on machines** until the issue is resolved.

### Twenty one recommendations moved between security controls

The following recommendations were moved to different security controls. Security controls are logical groups of related security recommendations, and reflect your vulnerable attack surfaces. This move ensures that each of these recommendations is in the most appropriate control to meet its objective.

Learn which recommendations are in each security control in [Security controls and their recommendations](secure-score-security-controls.md).

|Recommendation |Change and impact  |
|---------|---------|
|Vulnerability assessment should be enabled on your SQL servers<br>Vulnerability assessment should be enabled on your SQL managed instances<br>Vulnerabilities on your SQL databases should be remediated new<br>Vulnerabilities on your SQL databases in VMs should be remediated     |Moving from Remediate vulnerabilities (worth six points)<br>to Remediate security configurations (worth four points).<br>Depending on your environment, these recommendations will have a reduced impact on your score.|
|There should be more than one owner assigned to your subscription<br>Automation account variables should be encrypted<br>IoT Devices - Auditd process stopped sending events<br>IoT Devices - Operating system baseline validation failure<br>IoT Devices - TLS cipher suite upgrade needed<br>IoT Devices - Open Ports On Device<br>IoT Devices - Permissive firewall policy in one of the chains was found<br>IoT Devices - Permissive firewall rule in the input chain was found<br>IoT Devices - Permissive firewall rule in the output chain was found<br>Diagnostic logs in IoT Hub should be enabled<br>IoT Devices - Agent sending underutilized messages<br>IoT Devices - Default IP Filter Policy should be Deny<br>IoT Devices - IP Filter rule large IP range<br>IoT Devices - Agent message intervals and size should be adjusted<br>IoT Devices - Identical Authentication Credentials<br>IoT Devices - Audited process stopped sending events<br>IoT Devices - Operating system (OS) baseline configuration should be fixed|Moving to **Implement security best practices**.<br>When a recommendation moves to the Implement security best practices security control, which is worth no points, the recommendation no longer affects your secure score.|

## March 2021

Updates in March include:

- [Azure Firewall management integrated into Security Center](#azure-firewall-management-integrated-into-security-center)
- [SQL vulnerability assessment now includes the "Disable rule" experience (preview)](#sql-vulnerability-assessment-now-includes-the-disable-rule-experience-preview)
- [Azure Monitor Workbooks integrated into Security Center and three templates provided](#azure-monitor-workbooks-integrated-into-security-center-and-three-templates-provided)
- [Regulatory compliance dashboard now includes Azure Audit reports (preview)](#regulatory-compliance-dashboard-now-includes-azure-audit-reports-preview)
- [Recommendation data can be viewed in Azure Resource Graph with "Explore in ARG"](#recommendation-data-can-be-viewed-in-azure-resource-graph-with-explore-in-arg)
- [Updates to the policies for deploying workflow automation](#updates-to-the-policies-for-deploying-workflow-automation)
- [Two legacy recommendations no longer write data directly to Azure activity log](#two-legacy-recommendations-no-longer-write-data-directly-to-azure-activity-log)
- [Recommendations page enhancements](#recommendations-page-enhancements)

### Azure Firewall management integrated into Security Center

When you open Azure Security Center, the first page to appear is the overview page.

This interactive dashboard provides a unified view into the security posture of your hybrid cloud workloads. Additionally, it shows security alerts, coverage information, and more.

As part of helping you view your security status from a central experience, we have integrated the Azure Firewall Manager into this dashboard. You can now check Firewall coverage status across all networks and centrally manage Azure Firewall policies starting from Security Center.

Learn more about this dashboard in [Azure Security Center's overview page](overview-page.md).

:::image type="content" source="media/release-notes/overview-dashboard-firewall-manager.png" alt-text="Security Center's overview dashboard with a tile for Azure Firewall":::

### SQL vulnerability assessment now includes the "Disable rule" experience (preview)

Security Center includes a built-in vulnerability scanner to help you discover, track, and remediate potential database vulnerabilities. The results from your assessment scans provide an overview of your SQL machines' security state, and details of any security findings.

If you have an organizational need to ignore a finding, rather than remediate it, you can optionally disable it. Disabled findings don't impact your secure score or generate unwanted noise.

Learn more in [Disable specific findings](defender-for-sql-on-machines-vulnerability-assessment.md#disable-specific-findings).

### Azure Monitor Workbooks integrated into Security Center and three templates provided

As part of Ignite Spring 2021, we announced an integrated Azure Monitor Workbooks experience in Security Center.

You can use the new integration to start using the out-of-the-box templates from Security Center’s gallery. By using workbook templates, you can access and build dynamic and visual reports to track your organization’s security posture. Additionally, you can create new workbooks based on Security Center data or any other supported data types and quickly deploy community workbooks from Security Center's GitHub community.

Three templates reports are provided:

- **Secure Score Over Time** - Track your subscriptions' scores and changes to recommendations for your resources
- **System Updates** - View missing system updates by resources, OS, severity, and more
- **Vulnerability Assessment Findings** - View the findings of vulnerability scans of your Azure resources

Learn about using these reports or building your own in [Create rich, interactive reports of Security Center data](custom-dashboards-azure-workbooks.md).

:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-snip.png" alt-text="Secure score over time report.":::

### Regulatory compliance dashboard now includes Azure Audit reports (preview)

From the regulatory compliance dashboard's toolbar, you can now download Azure and Dynamics certification reports.

:::image type="content" source="media/release-notes/audit-reports-regulatory-compliance-dashboard.png" alt-text="Regulatory compliance dashboard's toolbar":::

You can select the tab for the relevant reports types (PCI, SOC, ISO, and others) and use filters to find the specific reports you need.

Learn more about [Managing the standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

:::image type="content" source="media/release-notes/audit-reports-list-regulatory-compliance-dashboard.png" alt-text="Filtering the list of available Azure Audit reports.":::

### Recommendation data can be viewed in Azure Resource Graph with "Explore in ARG"

The recommendation details pages now include the "Explore in ARG" toolbar button. Use this button to open an Azure Resource Graph query and explore, export, and share the recommendation's data.

Azure Resource Graph (ARG) provides instant access to resource information across your cloud environments with robust filtering, grouping, and sorting capabilities. It's a quick and efficient way to query information across Azure subscriptions programmatically or from within the Azure portal.

Learn more about [Azure Resource Graph (ARG)](../governance/resource-graph/index.yml).

:::image type="content" source="media/release-notes/explore-in-resource-graph.png" alt-text="Explore recommendation data in Azure Resource Graph.":::

### Updates to the policies for deploying workflow automation

Automating your organization's monitoring and incident response processes can greatly improve the time it takes to investigate and mitigate security incidents.

We provide three Azure Policy 'DeployIfNotExist' policies that create and configure workflow automation procedures so that you can deploy your automations across your organization:

|Goal  |Policy  |Policy ID  |
|---------|---------|---------|
|Workflow automation for security alerts|[Deploy Workflow Automation for Azure Security Center alerts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ff1525828-9a90-4fcf-be48-268cdd02361e)|f1525828-9a90-4fcf-be48-268cdd02361e|
|Workflow automation for security recommendations|[Deploy Workflow Automation for Azure Security Center recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f73d6ab6c-2475-4850-afd6-43795f3492ef)|73d6ab6c-2475-4850-afd6-43795f3492ef|
|Workflow automation for regulatory compliance changes|[Deploy Workflow Automation for Azure Security Center regulatory compliance](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f73d6ab6c-509122b9-ddd9-47ba-a5f1-d0dac20be63c)|509122b9-ddd9-47ba-a5f1-d0dac20be63c|

There are two updates to the features of these policies:

- When assigned, they will remain enabled by enforcement.
- You can now customize these policies and update any of the parameters even after they have already been deployed. For example you can add or edit an assessment key.

Get started with [workflow automation templates](https://github.com/Azure/Azure-Security-Center/tree/master/Workflow%20automation).

Learn more about how to [Automate responses to Security Center triggers](workflow-automation.md).

### Two legacy recommendations no longer write data directly to Azure activity log

Security Center passes the data for almost all security recommendations to Azure Advisor, which in turn, writes it to [Azure activity log](../azure-monitor/essentials/activity-log.md).

For two recommendations, the data is simultaneously written directly to Azure activity log. With this change, Security Center stops writing data for these legacy security recommendations directly to activity Log. Instead, we're exporting the data to Azure Advisor as we do for all the other recommendations.

The two legacy recommendations are:

- Endpoint protection health issues should be resolved on your machines
- Vulnerabilities in security configuration on your machines should be remediated

If you've been accessing information for these two recommendations in activity log's "Recommendation of type TaskDiscovery" category, this is no longer available.

### Recommendations page enhancements

We've released an improved version of the recommendations list to present more information at a glance.

Now on the page you'll see:

1. The maximum score and current score for each security control.
1. Icons replacing tags such as **Fix** and **Preview**.
1. A new column showing the [Policy initiative](security-policy-concept.md) related to each recommendation - visible when "Group by controls" is disabled.

:::image type="content" source="media/release-notes/recommendations-grid-enhancements.png" alt-text="Enhancements to Azure Security Center's recommendations page - March 2021" lightbox="media/release-notes/recommendations-grid-enhancements.png":::

:::image type="content" source="media/release-notes/recommendations-grid-enhancements-initiatives.png" alt-text="Enhancements to Azure Security Center's recommendations 'flat' list - March 2021" lightbox="media/release-notes/recommendations-grid-enhancements-initiatives.png":::

Learn more in [Security recommendations in Azure Security Center](review-security-recommendations.md).

## February 2021

Updates in February include:

- [New security alerts page in the Azure portal released for general availability (GA)](#new-security-alerts-page-in-the-azure-portal-released-for-general-availability-ga)
- [Kubernetes workload protection recommendations released for general availability (GA)](#kubernetes-workload-protection-recommendations-released-for-general-availability-ga)
- [Microsoft Defender for Endpoint integration with Azure Defender now supports Windows Server 2019 and Windows 10 on Windows Virtual Desktop (in preview)](#microsoft-defender-for-endpoint-integration-with-azure-defender-now-supports-windows-server-2019-and-windows-10-on-windows-virtual-desktop-in-preview)
- [Direct link to policy from recommendation details page](#direct-link-to-policy-from-recommendation-details-page)
- [SQL data classification recommendation no longer affects your secure score](#sql-data-classification-recommendation-no-longer-affects-your-secure-score)
- [Workflow automations can be triggered by changes to regulatory compliance assessments (in preview)](#workflow-automations-can-be-triggered-by-changes-to-regulatory-compliance-assessments-in-preview)
- [Asset inventory page enhancements](#asset-inventory-page-enhancements)

### New security alerts page in the Azure portal released for general availability (GA)

Azure Security Center's security alerts page was redesigned to provide:

- **Improved triage experience for alerts** - helping to reduce alerts fatigue and focus on the most relevant threats easier, the list includes customizable filters and grouping options.
- **More information in the alerts list** - such as MITRE ATT&ACK tactics.
- **Button to create sample alerts** - to evaluate Azure Defender capabilities and test your alerts. configuration (for SIEM integration, email notifications, and workflow automations), you can create sample alerts from all Azure Defender plans.
- **Alignment with Azure Sentinel's incident experience** - for customers who use both products, switching between them is now a more straightforward experience and it's easy to learn one from the other.
- **Better performance** for large alerts lists.
- **Keyboard navigation** through the alert list.
- **Alerts from Azure Resource Graph** - you can query alerts in Azure Resource Graph, the Kusto-like API for all of your resources. This is also useful if you're building your own alerts dashboards. [Learn more about Azure Resource Graph](../governance/resource-graph/index.yml).
- **Create sample alerts feature** - To create sample alerts from the new alerts experience, see [Generate sample Azure Defender alerts](alert-validation.md#generate-sample-security-alerts).

:::image type="content" source="media/managing-and-responding-alerts/alerts-page.png" alt-text="Azure Security Center's security alerts list":::

### Kubernetes workload protection recommendations released for general availability (GA)

We're happy to announce the general availability (GA) of the set of recommendations for Kubernetes workload protections.

To ensure that Kubernetes workloads are secure by default, Security Center has added Kubernetes level hardening recommendations, including enforcement options with Kubernetes admission control.

When Azure Policy for Kubernetes is installed on your Azure Kubernetes Service (AKS) cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices - displayed as 13 security recommendations - before being persisted to the cluster. You can then configure to enforce the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Workload protection best-practices using Kubernetes admission control](defender-for-containers-introduction.md).

> [!NOTE]
> While the recommendations were in preview, they didn't render an AKS cluster resource unhealthy, and they weren't included in the calculations of your secure score. with this GA announcement these will be included in the score calculation. If you haven't remediated them already, this might result in a slight impact on your secure score. Remediate them wherever possible as described in [Remediate recommendations in Azure Security Center](implement-security-recommendations.md).

### Microsoft Defender for Endpoint integration with Azure Defender now supports Windows Server 2019 and Windows 10 on Windows Virtual Desktop (in preview)

Microsoft Defender for Endpoint is a holistic, cloud delivered endpoint security solution. It provides risk-based vulnerability management and assessment as well as endpoint detection and response (EDR). For a full list of the benefits of using Defender for Endpoint together with Azure Security Center, see [Protect your endpoints with Security Center's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

When you enable Azure Defender for Servers running Windows Server, a license for Defender for Endpoint is included with the plan. If you've already enabled Azure Defender for Servers and you have Windows Server 2019 servers in your subscription, they'll automatically receive Defender for Endpoint with this update. No manual action is required.

Support has now been expanded to include Windows Server 2019 and Windows 10 on [Windows Virtual Desktop](../virtual-desktop/overview.md).

> [!NOTE]
> If you're enabling Defender for Endpoint on a Windows Server 2019 server, ensure it meets the prerequisites described in [Enable the Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md#enable-the-microsoft-defender-for-endpoint-integration).

### Direct link to policy from recommendation details page

When you're reviewing the details of a recommendation, it's often helpful to be able to see the underlying policy. For every recommendation supported by a policy, there's a new link from the recommendation details page:

:::image type="content" source="media/release-notes/view-policy-definition.png" alt-text="Link to Azure Policy page for the specific policy supporting a recommendation.":::

Use this link to view the policy definition and review the evaluation logic.

If you're reviewing the list of recommendations on our [Security recommendations reference guide](recommendations-reference.md), you'll also see links to the policy definition pages:

:::image type="content" source="media/release-notes/view-policy-definition-from-documentation.png" alt-text="Accessing the Azure Policy page for a specific policy directly from the Azure Security Center recommendations reference page." lightbox="media/release-notes/view-policy-definition-from-documentation.png":::

### SQL data classification recommendation no longer affects your secure score

The recommendation **Sensitive data in your SQL databases should be classified** no longer affects your secure score. This is the only recommendation in the **Apply data classification** security control, so that control now has a secure score value of 0.

For a full list of all security controls in Security Center, together with their scores and a list of the recommendations in each, see [Security controls and their recommendations](secure-score-security-controls.md).

### Workflow automations can be triggered by changes to regulatory compliance assessments (in preview)

We've added a third data type to the trigger options for your workflow automations: changes to regulatory compliance assessments.

Learn how to use the workflow automation tools in [Automate responses to Security Center triggers](workflow-automation.md).

:::image type="content" source="media/release-notes/regulatory-compliance-triggers-workflow-automation.png" alt-text="Using changes to regulatory compliance assessments to trigger a workflow automation." lightbox="media/release-notes/regulatory-compliance-triggers-workflow-automation.png":::

### Asset inventory page enhancements

Security Center's asset inventory page was improved:

- Summaries at the top of the page now include **Unregistered subscriptions**, showing the number of subscriptions without Security Center enabled.

    :::image type="content" source="media/release-notes/unregistered-subscriptions.png" alt-text="Count of unregistered subscriptions in the summaries at the top of the asset inventory page.":::

- Filters have been expanded and enhanced to include:
  - **Counts** - Each filter presents the number of resources that meet the criteria of each category

    :::image type="content" source="media/release-notes/counts-in-inventory-filters.png" alt-text="Counts in the filters in the asset inventory page of Azure Security Center.":::

  - **Contains exemptions filter** (Optional) - narrow the results to resources that have/haven't got exemptions. This filter isn't shown by default, but is accessible from the **Add filter** button.

    :::image type="content" source="media/release-notes/adding-contains-exemption-filter.gif" alt-text="Adding the filter 'contains exemption' in Azure Security Center's asset inventory page":::

Learn more about how to [Explore and manage your resources with asset inventory](asset-inventory.md).

## January 2021

Updates in January include:

- [Azure Security Benchmark is now the default policy initiative for Azure Security Center](#azure-security-benchmark-is-now-the-default-policy-initiative-for-azure-security-center)
- [Vulnerability assessment for on-premises and multicloud machines is released for general availability (GA)](#vulnerability-assessment-for-on-premises-and-multicloud-machines-is-released-for-general-availability-ga)
- [Secure score for management groups is now available in preview](#secure-score-for-management-groups-is-now-available-in-preview)
- [Secure score API is released for general availability (GA)](#secure-score-api-is-released-for-general-availability-ga)
- [Dangling DNS protections added to Azure Defender for App Service](#dangling-dns-protections-added-to-azure-defender-for-app-service)
- [Multicloud connectors are released for general availability (GA)](#multicloud-connectors-are-released-for-general-availability-ga)
- [Exempt entire recommendations from your secure score for subscriptions and management groups](#exempt-entire-recommendations-from-your-secure-score-for-subscriptions-and-management-groups)
- [Users can now request tenant-wide visibility from their global administrator](#users-can-now-request-tenant-wide-visibility-from-their-global-administrator)
- [35 preview recommendations added to increase coverage of Azure Security Benchmark](#35-preview-recommendations-added-to-increase-coverage-of-azure-security-benchmark)
- [CSV export of filtered list of recommendations](#csv-export-of-filtered-list-of-recommendations)
- ["Not applicable" resources now reported as "Compliant" in Azure Policy assessments](#not-applicable-resources-now-reported-as-compliant-in-azure-policy-assessments)
- [Export weekly snapshots of secure score and regulatory compliance data with continuous export (preview)](#export-weekly-snapshots-of-secure-score-and-regulatory-compliance-data-with-continuous-export-preview)

### Azure Security Benchmark is now the default policy initiative for Azure Security Center

Azure Security Benchmark is the Microsoft-authored, Azure-specific set of guidelines for security and compliance best practices based on common compliance frameworks. This widely respected benchmark builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security.

In recent months, Security Center's list of built-in security recommendations has grown significantly to expand our coverage of this benchmark.

From this release, the benchmark is the foundation for Security Center’s recommendations and fully integrated as the default policy initiative.

All Azure services have a security baseline page in their documentation. These baselines are built on Azure Security Benchmark.

If you're using Security Center's regulatory compliance dashboard, you'll see two instances of the benchmark during a transition period:

:::image type="content" source="media/release-notes/regulatory-compliance-with-azure-security-benchmark.png" alt-text="Azure Security Center's regulatory compliance dashboard showing the Azure Security Benchmark":::

Existing recommendations are unaffected and as the benchmark grows, changes will automatically be reflected within Security Center.

To learn more, see the following pages:

- [Learn more about Azure Security Benchmark](/security/benchmark/azure/introduction)
- [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md)

### Vulnerability assessment for on-premises and multicloud machines is released for general availability (GA)

In October, we announced a preview for scanning Azure Arc-enabled servers with [Azure Defender for Servers](defender-for-servers-introduction.md)' integrated vulnerability assessment scanner (powered by Qualys).

It's now released for general availability (GA).

When you've enabled Azure Arc on your non-Azure machines, Security Center will offer to deploy the integrated vulnerability scanner on them - manually and at-scale.

With this update, you can unleash the power of **Azure Defender for Servers** to consolidate your vulnerability management program across all of your Azure and non-Azure assets.

Main capabilities:

- Monitoring the VA (vulnerability assessment) scanner provisioning state on Azure Arc machines
- Provisioning the integrated VA agent to unprotected Windows and Linux Azure Arc machines (manually and at-scale)
- Receiving and analyzing detected vulnerabilities from deployed agents (manually and at-scale)
- Unified experience for Azure VMs and Azure Arc machines

[Learn more about deploying the integrated Qualys vulnerability scanner to your hybrid machines](deploy-vulnerability-assessment-vm.md#deploy-the-integrated-scanner-to-your-azure-and-hybrid-machines).

[Learn more about Azure Arc-enabled servers](../azure-arc/servers/index.yml).

### Secure score for management groups is now available in preview

The secure score page now shows the aggregated secure scores for your management groups in addition to the subscription level. So now you can see the list of management groups in your organization and the score for each management group.

:::image type="content" source="media/secure-score-security-controls/secure-score-management-groups.png" alt-text="Viewing the secure scores for your management groups.":::

Learn more about [secure score and security controls in Azure Security Center](secure-score-security-controls.md).

### Secure score API is released for general availability (GA)

You can now access your score via the [secure score API](/rest/api/defenderforcloud/secure-scores). The API methods provide the flexibility to query the data and build your own reporting mechanism of your secure scores over time. For example:

- use the **Secure Scores** API to get the score for a specific subscription
- use the **Secure Score Controls** API to list the security controls and the current score of your subscriptions

Learn about external tools made possible with the secure score API in [the secure score area of our GitHub community](https://github.com/Azure/Azure-Security-Center/tree/master/Secure%20Score).

Learn more about [secure score and security controls in Azure Security Center](secure-score-security-controls.md).

### Dangling DNS protections added to Azure Defender for App Service

Subdomain takeovers are a common, high-severity threat for organizations. A subdomain takeover can occur when you have a DNS record that points to a deprovisioned web site. Such DNS records are also known as "dangling DNS" entries. CNAME records are especially vulnerable to this threat.

Subdomain takeovers enable threat actors to redirect traffic intended for an organization’s domain to a site performing malicious activity.

Azure Defender for App Service now detects dangling DNS entries when an App Service website is decommissioned. This is the moment at which the DNS entry is pointing at a resource that doesn't exist, and your website is vulnerable to a subdomain takeover. These protections are available whether your domains are managed with Azure DNS or an external domain registrar and applies to both App Service on Windows and App Service on Linux.

Learn more:

- [App Service alert reference table](alerts-reference.md#alerts-azureappserv) - Includes two new Azure Defender alerts that trigger when a dangling DNS entry is detected
- [Prevent dangling DNS entries and avoid subdomain takeover](../security/fundamentals/subdomain-takeover.md) - Learn about the threat of subdomain takeover and the dangling DNS aspect
- [Introduction to Azure Defender for App Service](defender-for-app-service-introduction.md)

### Multicloud connectors are released for general availability (GA)

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same.

Azure Security Center protects workloads in Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP).

Connecting your AWS or GCP projects integrates their native security tools like AWS Security Hub and GCP Security Command Center into Azure Security Center.

This capability means that Security Center provides visibility and protection across all major cloud environments. Some of the benefits of this integration:

- Automatic agent provisioning - Security Center uses Azure Arc to deploy the Log Analytics agent to your AWS instances
- Policy management
- Vulnerability management
- Embedded Endpoint Detection and Response (EDR)
- Detection of security misconfigurations
- A single view showing security recommendations from all cloud providers
- Incorporate all of your resources into Security Center's secure score calculations
- Regulatory compliance assessments of your AWS and GCP resources

From Defender for Cloud's menu, select **Multicloud connectors** and you'll see the options for creating new connectors:

:::image type="content" source="./media/quickstart-onboard-aws/add-aws-account.png" alt-text="Add AWS account button on Security Center's multicloud connectors page":::

Learn more in:

- [Connect your AWS accounts to Azure Security Center](quickstart-onboard-aws.md)
- [Connect your GCP projects to Azure Security Center](quickstart-onboard-gcp.md)

### Exempt entire recommendations from your secure score for subscriptions and management groups

We're expanding the exemption capability to include entire recommendations. Providing further options to fine-tune the security recommendations that Security Center makes for your subscriptions, management group, or resources.

Occasionally, a resource will be listed as unhealthy when you know the issue is resolved by a third-party tool which Security Center hasn't detected. Or a recommendation will show in a scope where you feel it doesn't belong. The recommendation might be inappropriate for a specific subscription. Or perhaps your organization has decided to accept the risks related to the specific resource or recommendation.

With this preview feature, you can now create an exemption for a recommendation to:

- **Exempt a resource** to ensure it isn't listed with the unhealthy resources in the future, and doesn't impact your secure score. The resource will be listed as not applicable and the reason will be shown as "exempted" with the specific justification you select.

- **Exempt a subscription or management group** to ensure that the recommendation doesn't impact your secure score and won't be shown for the subscription or management group in the future. This relates to existing resources and any you create in the future. The recommendation will be marked with the specific justification you select for the scope that you selected.

Learn more in [Exempting resources and recommendations from your secure score](exempt-resource.md).

### Users can now request tenant-wide visibility from their global administrator

If a user doesn't have permissions to see Security Center data, they'll now see a link to request permissions from their organization's global administrator. The request includes the role they'd like and the justification for why it's necessary.

:::image type="content" source="media/management-groups-roles/request-tenant-permissions.png" alt-text="Banner informing a user they can request tenant-wide permissions.":::

Learn more in [Request tenant-wide permissions when yours are insufficient](tenant-wide-permissions-management.md#request-tenant-wide-permissions-when-yours-are-insufficient).

### 35 preview recommendations added to increase coverage of Azure Security Benchmark

[Azure Security Benchmark](/security/benchmark/azure/introduction) is the default policy initiative in Azure Security Center.

To increase the coverage of this benchmark, the following 35 preview recommendations have been added to Security Center.

> [!TIP]
> Preview recommendations don't render a resource unhealthy, and they aren't included in the calculations of your secure score. Remediate them wherever possible, so that when the preview period ends they'll contribute towards your score. Learn more about how to respond to these recommendations in [Remediate recommendations in Azure Security Center](implement-security-recommendations.md).

| Security control                     | New recommendations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Enable encryption at rest            | - Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest<br>- Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)<br>- Bring your own key data protection should be enabled for MySQL servers<br>- Bring your own key data protection should be enabled for PostgreSQL servers<br>- Azure AI services accounts should enable data encryption with a customer-managed key (CMK)<br>- Container registries should be encrypted with a customer-managed key (CMK)<br>- SQL managed instances should use customer-managed keys to encrypt data at rest<br>- SQL servers should use customer-managed keys to encrypt data at rest<br>- Storage accounts should use customer-managed key (CMK) for encryption                                                                                                                                                              |
| Implement security best practices    | - Subscriptions should have a contact email address for security issues<br> - Autoprovisioning of the Log Analytics agent should be enabled on your subscription<br> - Email notification for high severity alerts should be enabled<br> - Email notification to subscription owner for high severity alerts should be enabled<br> - Key vaults should have purge protection enabled<br> - Key vaults should have soft delete enabled |
| Manage access and permissions        | - Function apps should have 'Client Certificates (Incoming client certificates)' enabled |
| Protect applications against DDoS attacks | - Web Application Firewall (WAF) should be enabled for Application Gateway<br> - Web Application Firewall (WAF) should be enabled for Azure Front Door Service service |
| Restrict unauthorized network access | - Firewall should be enabled on Key Vault<br> - Private endpoint should be configured for Key Vault<br> - App Configuration should use private link<br> - Azure Cache for Redis should reside within a virtual network<br> - Azure Event Grid domains should use private link<br> - Azure Event Grid topics should use private link<br> - Azure Machine Learning workspaces should use private link<br> - Azure SignalR Service should use private link<br> - Azure Spring Cloud should use network injection<br> - Container registries should not allow unrestricted network access<br> - Container registries should use private link<br> - Public network access should be disabled for MariaDB servers<br> - Public network access should be disabled for MySQL servers<br> - Public network access should be disabled for PostgreSQL servers<br> - Storage account should use a private link connection<br> - Storage accounts should restrict network access using virtual network rules<br> - VM Image Builder templates should use private link|

Related links:

- [Learn more about Azure Security Benchmark](/security/benchmark/azure/introduction)
- [Learn more about Azure Database for MariaDB](../mariadb/overview.md)
- [Learn more about Azure Database for MySQL](../mysql/overview.md)
- [Learn more about Azure Database for PostgreSQL](../postgresql/overview.md)

### CSV export of filtered list of recommendations

In November 2020, we added filters to the recommendations page ([Recommendations list now includes filters](release-notes-archive.md#recommendations-list-now-includes-filters)). In December, we expanded those filters ([Recommendations page has new filters for environment, severity, and available responses](release-notes-archive.md#recommendations-page-has-new-filters-for-environment-severity-and-available-responses)).

With this announcement, we're changing the behavior of the **Download to CSV** button so that the CSV export only includes the recommendations currently displayed in the filtered list.

For example, in the image below you can see that the list is filtered to two recommendations. The CSV file that is generated includes the status details for every resource affected by those two recommendations.

:::image type="content" source="media/managing-and-responding-alerts/export-to-csv-with-filters.png" alt-text="Exporting filtered recommendations to a CSV file.":::

Learn more in [Security recommendations in Azure Security Center](review-security-recommendations.md).

### "Not applicable" resources now reported as "Compliant" in Azure Policy assessments

Previously, resources that were evaluated for a recommendation and found to be **not applicable** appeared in Azure Policy as "Non-compliant". No user actions could change their state to "Compliant." With this change, they're reported as "Compliant" for improved clarity.

The only impact will be seen in Azure Policy where the number of compliant resources will increase. There will be no impact to your secure score in Azure Security Center.

### Export weekly snapshots of secure score and regulatory compliance data with continuous export (preview)

We've added a new preview feature to the [continuous export](continuous-export.md) tools for exporting weekly snapshots of secure score and regulatory compliance data.

When you define a continuous export, set the export frequency:

:::image type="content" source="media/release-notes/export-frequency.png" alt-text="Choosing the frequency of your continuous export.":::

- **Streaming** – assessments will be sent when a resource’s health state is updated (if no updates occur, no data will be sent).
- **Snapshots** – a snapshot of the current state of all regulatory compliance assessments will be sent every week (this is a preview feature for weekly snapshots of secure scores and regulatory compliance data).

Learn more about the full capabilities of this feature in [Continuously export Security Center data](continuous-export.md).

## December 2020

Updates in December include:

- [Azure Defender for SQL servers on machines is generally available](#azure-defender-for-sql-servers-on-machines-is-generally-available)
- [Azure Defender for SQL support for Azure Synapse Analytics dedicated SQL pool is generally available](#azure-defender-for-sql-support-for-azure-synapse-analytics-dedicated-sql-pool-is-generally-available)
- [Global Administrators can now grant themselves tenant-level permissions](#global-administrators-can-now-grant-themselves-tenant-level-permissions)
- [Two new Azure Defender plans: Azure Defender for DNS and Azure Defender for Resource Manager (in preview)](#two-new-azure-defender-plans-azure-defender-for-dns-and-azure-defender-for-resource-manager-in-preview)
- [New security alerts page in the Azure portal (preview)](#new-security-alerts-page-in-the-azure-portal-preview)
- [Revitalized Security Center experience in Azure SQL Database & SQL Managed Instance](#revitalized-security-center-experience-in-azure-sql-database--sql-managed-instance)
- [Asset inventory tools and filters updated](#asset-inventory-tools-and-filters-updated)
- [Recommendation about web apps requesting SSL certificates no longer part of secure score](#recommendation-about-web-apps-requesting-ssl-certificates-no-longer-part-of-secure-score)
- [Recommendations page has new filters for environment, severity, and available responses](#recommendations-page-has-new-filters-for-environment-severity-and-available-responses)
- [Continuous export gets new data types and improved deployifnotexist policies](#continuous-export-gets-new-data-types-and-improved-deployifnotexist-policies)

### Azure Defender for SQL servers on machines is generally available

Azure Security Center offers two Azure Defender plans for SQL Servers:

- **Azure Defender for Azure SQL database servers** - defends your Azure-native SQL Servers
- **Azure Defender for SQL servers on machines** - extends the same protections to your SQL servers in hybrid, multicloud, and on-premises environments

With this announcement, **Azure Defender for SQL** now protects your databases and their data wherever they're located.

Azure Defender for SQL includes vulnerability assessment capabilities. The vulnerability assessment tool includes the following advanced features:

- **Baseline configuration** (New!) to intelligently refine the results of vulnerability scans to those that might represent real security issues. After you've established your baseline security state, the vulnerability assessment tool only reports deviations from that baseline state. Results that match the baseline are considered as passing subsequent scans. This lets you and your analysts focus your attention where it matters.
- **Detailed benchmark information** to help you *understand* the discovered findings, and why they relate to your resources.
- **Remediation scripts** to help you mitigate identified risks.

Learn more about [Azure Defender for SQL](defender-for-sql-introduction.md).

### Azure Defender for SQL support for Azure Synapse Analytics dedicated SQL pool is generally available

Azure Synapse Analytics (formerly SQL DW) is an analytics service that combines enterprise data warehousing and big data analytics. Dedicated SQL pools are the enterprise data warehousing features of Azure Synapse. Learn more in [What is Azure Synapse Analytics (formerly SQL DW)?](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md).

Azure Defender for SQL protects your dedicated SQL pools with:

- **Advanced threat protection** to detect threats and attacks
- **Vulnerability assessment capabilities** to identify and remediate security misconfigurations

Azure Defender for SQL's support for Azure Synapse Analytics SQL pools is automatically added to Azure SQL databases bundle in Azure Security Center. You'll find a new “Azure Defender for SQL” tab in your Synapse workspace page in the Azure portal.

Learn more about [Azure Defender for SQL](defender-for-sql-introduction.md).

### Global Administrators can now grant themselves tenant-level permissions

A user with the Azure Active Directory role of **Global Administrator** might have tenant-wide responsibilities, but lack the Azure permissions to view that organization-wide information in Azure Security Center.

To assign yourself tenant-level permissions, follow the instructions in [Grant tenant-wide permissions to yourself](tenant-wide-permissions-management.md#grant-tenant-wide-permissions-to-yourself).

### Two new Azure Defender plans: Azure Defender for DNS and Azure Defender for Resource Manager (in preview)

We've added two new cloud-native breadth threat protection capabilities for your Azure environment.

These new protections greatly enhance your resiliency against attacks from threat actors, and significantly increase the number of Azure resources protected by Azure Defender.

- **Azure Defender for Resource Manager** - automatically monitors all resource management operations performed in your organization. For more information, see:
  - [Introduction to Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md)
  - [Respond to Azure Defender for Resource Manager alerts](defender-for-resource-manager-usage.md)
  - [List of alerts provided by Azure Defender for Resource Manager](alerts-reference.md#alerts-resourcemanager)

- **Azure Defender for DNS** - continuously monitors all DNS queries from your Azure resources. For more information, see:
  - [Introduction to Azure Defender for DNS](defender-for-dns-introduction.md)
  - [Respond to Azure Defender for DNS alerts](defender-for-dns-usage.md)
  - [List of alerts provided by Azure Defender for DNS](alerts-reference.md#alerts-dns)

### New security alerts page in the Azure portal (preview)

Azure Security Center's security alerts page was redesigned to provide:

- **Improved triage experience for alerts** - helping to reduce alerts fatigue and focus on the most relevant threats easier, the list includes customizable filters and grouping options
- **More information in the alerts list** - such as MITRE ATT&ACK tactics
- **Button to create sample alerts** - to evaluate Azure Defender capabilities and test your alerts configuration (for SIEM integration, email notifications, and workflow automations), you can create sample alerts from all Azure Defender plans
- **Alignment with Azure Sentinel's incident experience** - for customers who use both products, switching between them is now a more straightforward experience and it's easy to learn one from the other
- **Better performance** for large alerts lists
- **Keyboard navigation** through the alert list
- **Alerts from Azure Resource Graph** - you can query alerts in Azure Resource Graph, the Kusto-like API for all of your resources. This is also useful if you're building your own alerts dashboards. [Learn more about Azure Resource Graph](../governance/resource-graph/index.yml).

To access the new experience, use the 'try it now' link from the banner at the top of the security alerts page.

:::image type="content" source="media/managing-and-responding-alerts/preview-alerts-experience-banner.png" alt-text="Banner with link to the new preview alerts experience.":::

To create sample alerts from the new alerts experience, see [Generate sample Azure Defender alerts](alert-validation.md#generate-sample-security-alerts).

### Revitalized Security Center experience in Azure SQL Database & SQL Managed Instance

The Security Center experience within SQL provides access to the following Security Center and Azure Defender for SQL features:

- **Security recommendations** – Security Center periodically analyzes the security state of all connected Azure resources to identify potential security misconfigurations. It then provides recommendations on how to remediate those vulnerabilities and improve organizations’ security posture.
- **Security alerts** – a detection service that continuously monitors Azure SQL activities for threats such as SQL injection, brute-force attacks, and privilege abuse. This service triggers detailed and action-oriented security alerts in Security Center and provides options for continuing investigations with Azure Sentinel, Microsoft’s Azure-native SIEM solution.
- **Findings** – a vulnerability assessment service that continuously monitors Azure SQL configurations and helps remediate vulnerabilities. Assessment scans provide an overview of Azure SQL security states together with detailed security findings.

:::image type="content" source="media/release-notes/microsoft-defender-for-cloud-experience-in-sql.png" alt-text="Azure Security Center's security features for SQL are available from within Azure SQL":::

### Asset inventory tools and filters updated

The inventory page in Azure Security Center was refreshed with the following changes:

- **Guides and feedback** added to the toolbar. This opens a pane with links to related information and tools.
- **Subscriptions filter** added to the default filters available for your resources.
- **Open query** link for opening the current filter options as an Azure Resource Graph query (formerly called "View in resource graph explorer").
- **Operator options** for each filter. Now you can choose from more logical operators other than '='. For example, you might want to find all resources with active recommendations whose titles include the string 'encrypt'.

    :::image type="content" source="media/release-notes/inventory-filter-operators.png" alt-text="Controls for the operator option in asset inventory's filters":::

Learn more about inventory in [Explore and manage your resources with asset inventory](asset-inventory.md).

### Recommendation about web apps requesting SSL certificates no longer part of secure score

The recommendation "Web apps should request an SSL certificate for all incoming requests" was moved from the security control **Manage access and permissions** (worth a maximum of 4 pts) into **Implement security best practices** (which is worth no points).

Ensuring a web app requests a certificate certainly makes it more secure. However, for public-facing web apps it's irrelevant. If you access your site over HTTP and not HTTPS, you will not receive any client certificate. So if your application requires client certificates, you should not allow requests to your application over HTTP. Learn more in [Configure TLS mutual authentication for Azure App Service](../app-service/app-service-web-configure-tls-mutual-auth.md).

With this change, the recommendation is now a recommended best practice that does not impact your score.

Learn which recommendations are in each security control in [Security controls and their recommendations](secure-score-security-controls.md).

### Recommendations page has new filters for environment, severity, and available responses

Azure Security Center monitors all connected resources and generates security recommendations. Use these recommendations to strengthen your hybrid cloud posture and track compliance with the policies and standards relevant to your organization, industry, and country/region.

As Security Center continues to expand its coverage and features, the list of security recommendations is growing every month. For example, see [Twenty nine preview recommendations added to increase coverage of Azure Security Benchmark](release-notes-archive.md#29-preview-recommendations-added-to-increase-coverage-of-azure-security-benchmark).

With the growing list, there's a need to filter the recommendations to find the ones of greatest interest. In November, we added filters to the recommendations page (see [Recommendations list now includes filters](release-notes-archive.md#recommendations-list-now-includes-filters)).

The filters added this month provide options to refine the recommendations list according to:

- **Environment** - View recommendations for your AWS, GCP, or Azure resources (or any combination)
- **Severity** - View recommendations according to the severity classification set by Security Center
- **Response actions** - View recommendations according to the availability of Security Center response options: Fix, Deny, and Enforce

    > [!TIP]
    > The response actions filter replaces the **Quick fix available (Yes/No)** filter.
    >
    > Learn more about each of these response options:
    >
    > - [Fix button](implement-security-recommendations.md#fix-button)
    > - [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md)

:::image type="content" source="./media/release-notes/added-recommendations-filters.png" alt-text="Recommendations grouped by security control." lightbox="./media/release-notes/added-recommendations-filters.png":::

### Continuous export gets new data types and improved deployifnotexist policies

Azure Security Center's continuous export tools enable you to export Security Center's recommendations and alerts for use with other monitoring tools in your environment.

Continuous export lets you fully customize what will be exported, and where it will go. For full details, see  [Continuously export Security Center data](continuous-export.md).

These tools have been enhanced and expanded in the following ways:

- **Continuous export's deployifnotexist policies enhanced**. The policies now:

  - **Check whether the configuration is enabled.** If it isn't, the policy will show as non-compliant and create a compliant resource. Learn more about the supplied Azure Policy templates in the "Deploy at scale with Azure Policy tab" in [Set up a continuous export](continuous-export.md#set-up-a-continuous-export).

  - **Support exporting security findings.** When using the Azure Policy templates, you can configure your  continuous export to include findings. This is relevant when exporting recommendations that have 'sub' recommendations, like findings from vulnerability assessment scanners or specific system updates for the 'parent' recommendation "System updates should be installed on your machines".

  - **Support exporting secure score data.**

- **Regulatory compliance assessment data added (in preview).** You can now continuously export updates to regulatory compliance assessments, including for any custom initiatives, to a Log Analytics workspace or Event Hubs. This feature is unavailable on national clouds.

    :::image type="content" source="media/release-notes/continuous-export-regulatory-compliance-option.png" alt-text="The options for including regulatory compliance assessment information with your continuous export data.":::

## November 2020

Updates in November include:

- [29 preview recommendations added to increase coverage of Azure Security Benchmark](#29-preview-recommendations-added-to-increase-coverage-of-azure-security-benchmark)
- [NIST SP 800 171 R2 added to Security Center's regulatory compliance dashboard](#nist-sp-800-171-r2-added-to-security-centers-regulatory-compliance-dashboard)
- [Recommendations list now includes filters](#recommendations-list-now-includes-filters)
- [Autoprovisioning experience improved and expanded](#autoprovisioning-experience-improved-and-expanded)
- [Secure score is now available in continuous export (preview)](#secure-score-is-now-available-in-continuous-export-preview)
- ["System updates should be installed on your machines" recommendation now includes subrecommendations](#system-updates-should-be-installed-on-your-machines-recommendation-now-includes-subrecommendations)
- [Policy management page in the Azure portal now shows status of default policy assignments](#policy-management-page-in-the-azure-portal-now-shows-status-of-default-policy-assignments)

### 29 preview recommendations added to increase coverage of Azure Security Benchmark

Azure Security Benchmark is the Microsoft-authored, Azure-specific, set of guidelines for security and compliance best practices based on common compliance frameworks. [Learn more about Azure Security Benchmark](/security/benchmark/azure/introduction).

The following 29 preview recommendations have been added to Security Center to increase the coverage of this benchmark.

Preview recommendations don't render a resource unhealthy, and they aren't included in the calculations of your secure score. Remediate them wherever possible, so that when the preview period ends they'll contribute towards your score. Learn more about how to respond to these recommendations in [Remediate recommendations in Azure Security Center](implement-security-recommendations.md).

| Security control                     | New recommendations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Encrypt data in transit              | - Enforce SSL connection should be enabled for PostgreSQL database servers<br>- Enforce SSL connection should be enabled for MySQL database servers<br>- TLS should be updated to the latest version for your API app<br>- TLS should be updated to the latest version for your function app<br>- TLS should be updated to the latest version for your web app<br>- FTPS should be required in your API App<br>- FTPS should be required in your function App<br>- FTPS should be required in your web App                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Manage access and permissions        | - Web apps should request an SSL certificate for all incoming requests<br>- Managed identity should be used in your API App<br>- Managed identity should be used in your function App<br>- Managed identity should be used in your web App                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Restrict unauthorized network access | - Private endpoint should be enabled for PostgreSQL servers<br>- Private endpoint should be enabled for MariaDB servers<br>- Private endpoint should be enabled for MySQL servers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Enable auditing and logging          | - Diagnostic logs in App Services should be enabled                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Implement security best practices    | - Azure Backup should be enabled for virtual machines<br>- Geo-redundant backup should be enabled for Azure Database for MariaDB<br>- Geo-redundant backup should be enabled for Azure Database for MySQL<br>- Geo-redundant backup should be enabled for Azure Database for PostgreSQL<br>- PHP should be updated to the latest version for your API app<br>- PHP should be updated to the latest version for your web app<br>- Java should be updated to the latest version for your API app<br>- Java should be updated to the latest version for your function app<br>- Java should be updated to the latest version for your web app<br>- Python should be updated to the latest version for your API app<br>- Python should be updated to the latest version for your function app<br>- Python should be updated to the latest version for your web app<br>- Audit retention for SQL servers should be set to at least 90 days |

Related links:

- [Learn more about Azure Security Benchmark](/security/benchmark/azure/introduction)
- [Learn more about Azure API apps](../app-service/app-service-web-tutorial-rest-api.md)
- [Learn more about Azure function apps](../azure-functions/functions-overview.md)
- [Learn more about Azure web apps](../app-service/overview.md)
- [Learn more about Azure Database for MariaDB](../mariadb/overview.md)
- [Learn more about Azure Database for MySQL](../mysql/overview.md)
- [Learn more about Azure Database for PostgreSQL](../postgresql/overview.md)

### NIST SP 800 171 R2 added to Security Center's regulatory compliance dashboard

The NIST SP 800-171 R2 standard is now available as a built-in initiative for use with Azure Security Center's regulatory compliance dashboard. The mappings for the controls are described in [Details of the NIST SP 800-171 R2 Regulatory Compliance built-in initiative](../governance/policy/samples/nist-sp-800-171-r2.md).

To apply the standard to your subscriptions and continuously monitor your compliance status, use the instructions in [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

:::image type="content" source="media/release-notes/nist-sp-800-171-r2-standard.png" alt-text="The NIST SP 800 171 R2 standard in Security Center's regulatory compliance dashboard":::

For more information about this compliance standard, see [NIST SP 800-171 R2](https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final).

### Recommendations list now includes filters

You can now filter the list of security recommendations according to a range of criteria. In the following example, the recommendations list is filtered to show recommendations that:

- are **generally available** (that is, not preview)
- are for **storage accounts**
- support **quick fix** remediation

:::image type="content" source="media/release-notes/recommendations-filters.png" alt-text="Filters for the recommendations list.":::

### Autoprovisioning experience improved and expanded

The autoprovisioning feature helps reduce management overhead by installing the required extensions on new - and existing - Azure VMs so they can benefit from Security Center's protections.

As Azure Security Center grows, more extensions have been developed and Security Center can monitor a larger list of resource types. The autoprovisioning tools have now been expanded to support other extensions and resource types by leveraging the capabilities of Azure Policy.

You can now configure the autoprovisioning of:

- Log Analytics agent
- (New) Azure Policy for Kubernetes
- (New) Microsoft Dependency agent

Learn more in [Autoprovisioning agents and extensions from Azure Security Center](monitoring-components.md).

### Secure score is now available in continuous export (preview)

With continuous export of secure score, you can stream changes to your score in real-time to Azure Event Hubs or a Log Analytics workspace. Use this capability to:

- track your secure score over time with dynamic reports
- export secure score data to Azure Sentinel (or any other SIEM)
- integrate this data with any processes you might already be using to monitor secure score in your organization

Learn more about how to [Continuously export Security Center data](continuous-export.md).

### "System updates should be installed on your machines" recommendation now includes subrecommendations

The **System updates should be installed on your machines** recommendation was enhanced. The new version includes subrecommendations for each missing update and brings the following improvements:

- A redesigned experience in the Azure Security Center pages of the Azure portal. The recommendation details page for **System updates should be installed on your machines** includes the list of findings as shown below. When you select a single finding, the details pane opens with a link to the remediation information and a list of affected resources.

    :::image type="content" source="./media/upcoming-changes/system-updates-should-be-installed-subassessment.png" alt-text="Opening one of the subrecommendations in the portal experience for the updated recommendation.":::

- Enriched data for the recommendation from Azure Resource Graph (ARG). ARG is an Azure service that's designed to provide efficient resource exploration. You can use ARG to query at scale across a given set of subscriptions so that you can effectively govern your environment.

    For Azure Security Center, you can use ARG and the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/) to query a wide range of security posture data.

    Previously, if you queried this recommendation in ARG, the only available information was that the recommendation needs to be remediated on a machine. The following query of the enhanced version  will return each missing system updates grouped by machine.

    ```kusto
    securityresources
    | where type =~ "microsoft.security/assessments/subassessments"
    | where extract(@"(?i)providers/Microsoft.Security/assessments/([^/]*)", 1, id) == "4ab6e3c5-74dd-8b35-9ab9-f61b30875b27"
    | where properties.status.code == "Unhealthy"
    ```

### Policy management page in the Azure portal now shows status of default policy assignments

You can now see whether or not your subscriptions have the default Security Center policy assigned, in the Security Center's **security policy** page of the Azure portal.

:::image type="content" source="media/release-notes/policy-assignment-info-per-subscription.png" alt-text="The policy management page of Azure Security Center showing the default policy assignments.":::

## October 2020

Updates in October include:

- [Vulnerability assessment for on-premises and multicloud machines (preview)](#vulnerability-assessment-for-on-premises-and-multicloud-machines-preview)
- [Azure Firewall recommendation added (preview)](#azure-firewall-recommendation-added-preview)
- [Authorized IP ranges should be defined on Kubernetes Services recommendation updated with quick fix](#authorized-ip-ranges-should-be-defined-on-kubernetes-services-recommendation-updated-with-quick-fix)
- [Regulatory compliance dashboard now includes option to remove standards](#regulatory-compliance-dashboard-now-includes-option-to-remove-standards)
- [Microsoft.Security/securityStatuses table removed from Azure Resource Graph (ARG)](#microsoftsecuritysecuritystatuses-table-removed-from-azure-resource-graph-arg)

### Vulnerability assessment for on-premises and multicloud machines (preview)

[Azure Defender for Servers](defender-for-servers-introduction.md)' integrated vulnerability assessment scanner (powered by Qualys) now scans Azure Arc-enabled servers.

When you've enabled Azure Arc on your non-Azure machines, Security Center will offer to deploy the integrated vulnerability scanner on them - manually and at-scale.

With this update, you can unleash the power of **Azure Defender for Servers** to consolidate your vulnerability management program across all of your Azure and non-Azure assets.

Main capabilities:

- Monitoring the VA (vulnerability assessment) scanner provisioning state on Azure Arc machines
- Provisioning the integrated VA agent to unprotected Windows and Linux Azure Arc machines (manually and at-scale)
- Receiving and analyzing detected vulnerabilities from deployed agents (manually and at-scale)
- Unified experience for Azure VMs and Azure Arc machines

[Learn more about deploying the integrated Qualys vulnerability scanner to your hybrid machines](deploy-vulnerability-assessment-vm.md#deploy-the-integrated-scanner-to-your-azure-and-hybrid-machines).

[Learn more about Azure Arc-enabled servers](../azure-arc/servers/index.yml).

### Azure Firewall recommendation added (preview)

A new recommendation was added to protect all your virtual networks with Azure Firewall.

The recommendation, **Virtual networks should be protected by Azure Firewall** advises you to restrict access to your virtual networks and prevent potential threats by using Azure Firewall.

Learn more about [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/).

### Authorized IP ranges should be defined on Kubernetes Services recommendation updated with quick fix

The recommendation **Authorized IP ranges should be defined on Kubernetes Services** now has a quick fix option.

For more information about this recommendation and all other Security Center recommendations, see [Security recommendations - a reference guide](recommendations-reference.md).

:::image type="content" source="./media/release-notes/authorized-ip-ranges-recommendation.png" alt-text="The authorized IP ranges should be defined on Kubernetes Services recommendation with the quick fix option.":::

### Regulatory compliance dashboard now includes option to remove standards

Security Center's regulatory compliance dashboard provides insights into your compliance posture based on how you're meeting specific compliance controls and requirements.

The dashboard includes a default set of regulatory standards. If any of the supplied standards isn't relevant to your organization, it's now a simple process to remove them from the UI for a subscription. Standards can be removed only at the *subscription* level; not the management group scope.

Learn more in [Remove a standard from your dashboard](update-regulatory-compliance-packages.md#remove-a-standard-from-your-dashboard).

### Microsoft.Security/securityStatuses table removed from Azure Resource Graph (ARG)

Azure Resource Graph is a service in Azure that is designed to provide efficient resource exploration with the ability to query at scale across a given set of subscriptions so that you can effectively govern your environment.

For Azure Security Center, you can use ARG and the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/) to query a wide range of security posture data. For example:

- Asset inventory utilizes (ARG)
- We have documented a sample ARG query for how to [Identify accounts without multifactor authentication (MFA) enabled](multi-factor-authentication-enforcement.md#identify-accounts-without-multi-factor-authentication-mfa-enabled)

Within ARG, there are tables of data for you to use in your queries.

:::image type="content" source="./media/release-notes/azure-resource-graph-tables.png" alt-text="Azure Resource Graph Explorer and the available tables.":::

> [!TIP]
> The ARG documentation lists all the available tables in [Azure Resource Graph table and resource type reference](../governance/resource-graph/reference/supported-tables-resources.md).

From this update, the **Microsoft.Security/securityStatuses** table was removed. The securityStatuses API is still available.

Data replacement can be used by Microsoft.Security/Assessments table.

The major difference between Microsoft.Security/securityStatuses and Microsoft.Security/Assessments is that while the first shows aggregation of assessments, the seconds holds a single record for each.

For example, Microsoft.Security/securityStatuses would return a result with an array of two policyAssessments:

```
{
id: "/subscriptions/449bcidd-3470-4804-ab56-2752595 felab/resourceGroups/mico-rg/providers/Microsoft.Network/virtualNetworks/mico-rg-vnet/providers/Microsoft.Security/securityStatuses/mico-rg-vnet",
name: "mico-rg-vnet",
type: "Microsoft.Security/securityStatuses",
properties:  {
    policyAssessments: [
        {assessmentKey: "e3deicce-f4dd-3b34-e496-8b5381bazd7e", category: "Networking", policyName: "Azure DDOS Protection should be enabled",...},
        {assessmentKey: "sefac66a-1ec5-b063-a824-eb28671dc527", category: "Compute", policyName: "",...}
    ],
    securitystateByCategory: [{category: "Networking", securityState: "None" }, {category: "Compute",...],
    name: "GenericResourceHealthProperties",
    type: "VirtualNetwork",
    securitystate: "High"
}
```

Whereas Microsoft.Security/Assessments hold a record for each such policy assessment as follows:

```
{
type: "Microsoft.Security/assessments",
id:  "/subscriptions/449bc1dd-3470-4804-ab56-2752595f01ab/resourceGroups/mico-rg/providers/Microsoft. Network/virtualNetworks/mico-rg-vnet/providers/Microsoft.Security/assessments/e3delcce-f4dd-3b34-e496-8b5381ba2d70",
name: "e3deicce-f4dd-3b34-e496-8b5381ba2d70",
properties:  {
    resourceDetails: {Source: "Azure", Id: "/subscriptions/449bc1dd-3470-4804-ab56-2752595f01ab/resourceGroups/mico-rg/providers/Microsoft.Network/virtualNetworks/mico-rg-vnet"...},
    displayName: "Azure DDOS Protection should be enabled",
    status: (code: "NotApplicable", cause: "VnetHasNOAppGateways", description: "There are no Application Gateway resources attached to this Virtual Network"...}
}

{
type: "Microsoft.Security/assessments",
id:  "/subscriptions/449bc1dd-3470-4804-ab56-2752595f01ab/resourcegroups/mico-rg/providers/microsoft.network/virtualnetworks/mico-rg-vnet/providers/Microsoft.Security/assessments/80fac66a-1ec5-be63-a824-eb28671dc527",
name: "8efac66a-1ec5-be63-a824-eb28671dc527",
properties: {
    resourceDetails: (Source: "Azure", Id: "/subscriptions/449bc1dd-3470-4804-ab56-2752595f01ab/resourcegroups/mico-rg/providers/microsoft.network/virtualnetworks/mico-rg-vnet"...),
    displayName: "Audit diagnostic setting",
    status:  {code: "Unhealthy"}
}
```

**Example of converting an existing ARG query using securityStatuses to now use the assessments table:**

Query that references SecurityStatuses:

```kusto
SecurityResources
| where type == 'microsoft.security/securitystatuses' and properties.type == 'virtualMachine'
| where name in ({vmnames})
| project name, resourceGroup, policyAssesments = properties.policyAssessments, resourceRegion = location, id, resourceDetails = properties.resourceDetails
```

Replacement query for the Assessments table:

```kusto
securityresources
| where type == "microsoft.security/assessments" and id contains "virtualMachine"
| extend resourceName = extract(@"(?i)/([^/]*)/providers/Microsoft.Security/assessments", 1, id)
| extend source = tostring(properties.resourceDetails.Source)
| extend resourceId = trim(" ", tolower(tostring(case(source =~ "azure", properties.resourceDetails.Id,
source =~ "aws", properties.additionalData.AzureResourceId,
source =~ "gcp", properties.additionalData.AzureResourceId,
extract("^(.+)/providers/Microsoft.Security/assessments/.+$",1,id)))))
| extend resourceGroup = tolower(tostring(split(resourceId, "/")[4]))
| where resourceName in ({vmnames})
| project resourceName, resourceGroup, resourceRegion = location, id, resourceDetails = properties.additionalData
```

Learn more at the following links:

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)
- [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/)

## September 2020

Updates in September include:

- [Security Center gets a new look!](#security-center-gets-a-new-look)
- [Azure Defender released](#azure-defender-released)
- [Azure Defender for Key Vault is generally available](#azure-defender-for-key-vault-is-generally-available)
- [Azure Defender for Storage protection for Files and ADLS Gen2 is generally available](#azure-defender-for-storage-protection-for-files-and-adls-gen2-is-generally-available)
- [Asset inventory tools are now generally available](#asset-inventory-tools-are-now-generally-available)
- [Disable a specific vulnerability finding for scans of container registries and virtual machines](#disable-a-specific-vulnerability-finding-for-scans-of-container-registries-and-virtual-machines)
- [Exempt a resource from a recommendation](#exempt-a-resource-from-a-recommendation)
- [AWS and GCP connectors in Security Center bring a multicloud experience](#aws-and-gcp-connectors-in-security-center-bring-a-multicloud-experience)
- [Kubernetes workload protection recommendation bundle](#kubernetes-workload-protection-recommendation-bundle)
- [Vulnerability assessment findings are now available in continuous export](#vulnerability-assessment-findings-are-now-available-in-continuous-export)
- [Prevent security misconfigurations by enforcing recommendations when creating new resources](#prevent-security-misconfigurations-by-enforcing-recommendations-when-creating-new-resources)
- [Network security group recommendations improved](#network-security-group-recommendations-improved)
- [Deprecated preview AKS recommendation "Pod Security Policies should be defined on Kubernetes Services"](#deprecated-preview-aks-recommendation-pod-security-policies-should-be-defined-on-kubernetes-services)
- [Email notifications from Azure Security Center improved](#email-notifications-from-azure-security-center-improved)
- [Secure score doesn't include preview recommendations](#secure-score-doesnt-include-preview-recommendations)
- [Recommendations now include a severity indicator and the freshness interval](#recommendations-now-include-a-severity-indicator-and-the-freshness-interval)

### Security Center gets a new look

We've released a refreshed UI for Security Center's portal pages. The new pages include a new overview page and dashboards for secure score, asset inventory, and Azure Defender.

The redesigned overview page now has a tile for accessing the secure score, asset inventory, and Azure Defender dashboards. It also has a tile linking to the regulatory compliance dashboard.

Learn more about the [overview page](overview-page.md).

### Azure Defender released

**Azure Defender** is the cloud workload protection platform (CWPP) integrated within Security Center for advanced, intelligent, protection of your Azure and hybrid workloads. It replaces Security Center's standard pricing tier option.

When you enable Azure Defender from the **Pricing and settings** area of Azure Security Center, the following Defender plans are all enabled simultaneously and provide comprehensive defenses for the compute, data, and service layers of your environment:

- [Azure Defender for Servers](defender-for-servers-introduction.md)
- [Azure Defender for App Service](defender-for-app-service-introduction.md)
- [Azure Defender for Storage](defender-for-storage-introduction.md)
- [Azure Defender for SQL](defender-for-sql-introduction.md)
- [Azure Defender for Key Vault](defender-for-key-vault-introduction.md)
- [Azure Defender for Kubernetes](defender-for-kubernetes-introduction.md)
- [Azure Defender for container registries](defender-for-container-registries-introduction.md)

Each of these plans is explained separately in the Security Center documentation.

With its dedicated dashboard, Azure Defender provides security alerts and advanced threat protection for virtual machines, SQL databases, containers, web applications, your network, and more.

[Learn more about Azure Defender](azure-defender.md)

### Azure Defender for Key Vault is generally available

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords.

**Azure Defender for Key Vault** provides Azure-native, advanced threat protection for Azure Key Vault, providing an additional layer of security intelligence. By extension, Azure Defender for Key Vault is consequently protecting many of the resources dependent upon your Key Vault accounts.

The optional plan is now GA. This feature was in preview as "advanced threat protection for Azure Key Vault."

Also, the Key Vault pages in the Azure portal now include a dedicated **Security** page for **Security Center** recommendations and alerts.

Learn more in [Azure Defender for Key Vault](defender-for-key-vault-introduction.md).

### Azure Defender for Storage protection for Files and ADLS Gen2 is generally available

**Azure Defender for Storage** detects potentially harmful activity on your Azure Storage accounts. Your data can be protected whether it's stored as blob containers, file shares, or data lakes.

Support for [Azure Files](../storage/files/storage-files-introduction.md) and [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) is now generally available.

From 1 October 2020, we'll begin charging for protecting resources on these services.

Learn more in [Azure Defender for Storage](defender-for-storage-introduction.md).

### Asset inventory tools are now generally available

The asset inventory page of Azure Security Center provides a single page for viewing the security posture of the resources you've connected to Security Center.

Security Center periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to remediate those vulnerabilities.

When any resource has outstanding recommendations, they'll appear in the inventory.

Learn more in [Explore and manage your resources with asset inventory](asset-inventory.md).

### Disable a specific vulnerability finding for scans of container registries and virtual machines

Azure Defender includes vulnerability scanners to scan images in your Azure Container Registry and your virtual machines.

If you have an organizational need to ignore a finding, rather than remediate it, you can optionally disable it. Disabled findings don't impact your secure score or generate unwanted noise.

When a finding matches the criteria you've defined in your disable rules, it won't appear in the list of findings.

This option is available from the recommendations details pages for:

- **Vulnerabilities in Azure Container Registry images should be remediated**
- **Vulnerabilities in your virtual machines should be remediated**

Learn more in [Disable specific findings for your container images](defender-for-containers-vulnerability-assessment-azure.md#disable-specific-findings) and [Disable specific findings for your virtual machines](remediate-vulnerability-findings-vm.md#disable-specific-findings).

### Exempt a resource from a recommendation

Occasionally, a resource will be listed as unhealthy regarding a specific recommendation (and therefore lowering your secure score) even though you feel it shouldn't be. It might have been remediated by a process not tracked by Security Center. Or perhaps your organization has decided to accept the risk for that specific resource.

In such cases, you can create an exemption rule and ensure that resource isn't listed amongst the unhealthy resources in the future. These rules can include documented justifications as described below.

Learn more in [Exempt a resource from recommendations and secure score](exempt-resource.md).

### AWS and GCP connectors in Security Center bring a multicloud experience

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same.

Azure Security Center now protects workloads in Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP).

When you onboard AWS and GCP projects into Security Center, it integrates AWS Security Hub, GCP Security Command and Azure Security Center.

Learn more in [Connect your AWS accounts to Azure Security Center](quickstart-onboard-aws.md) and [Connect your GCP projects to Azure Security Center](quickstart-onboard-gcp.md).

### Kubernetes workload protection recommendation bundle

To ensure that Kubernetes workloads are secure by default, Security Center is adding Kubernetes level hardening recommendations, including enforcement options with Kubernetes admission control.

When you've installed Azure Policy for Kubernetes on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure to enforce the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Workload protection best-practices using Kubernetes admission control](defender-for-containers-introduction.md).

### Vulnerability assessment findings are now available in continuous export

Use continuous export to stream your alerts and recommendations to Azure Event Hubs, Log Analytics workspaces, or Azure Monitor. From there, you can integrate this data with SIEMs (such as Azure Sentinel, Power BI, Azure Data Explorer, and more.

Security Center's integrated vulnerability assessment tools return findings about your resources as actionable recommendations within a 'parent' recommendation such as "Vulnerabilities in your virtual machines should be remediated".

The security findings are now available for export through continuous export when you select recommendations and enable the **include security findings** option.

:::image type="content" source="./media/continuous-export/include-security-findings-toggle.png" alt-text="Include security findings toggle in continuous export configuration." :::

Related pages:

- [Security Center's integrated Qualys vulnerability assessment solution for Azure virtual machines](deploy-vulnerability-assessment-vm.md)
- [Security Center's integrated vulnerability assessment solution for Azure Container Registry images](defender-for-containers-vulnerability-assessment-azure.md)
- [Continuous export](continuous-export.md)

### Prevent security misconfigurations by enforcing recommendations when creating new resources

Security misconfigurations are a major cause of security incidents. Security Center now has the ability to help *prevent* misconfigurations of new resources with regard to specific recommendations.

This feature can help keep your workloads secure and stabilize your secure score.

You can enforce a secure configuration, based on a specific recommendation, in two modes:

- Using the **Deny** effect of Azure Policy, you can stop unhealthy resources from being created

- Using the **Enforce** option, you can take advantage of Azure Policy's **DeployIfNotExist** effect and automatically remediate non-compliant resources upon creation

This is available for selected security recommendations and can be found at the top of the resource details page.

Learn more in [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md).

### Network security group recommendations improved

The following security recommendations related to network security groups have been improved to reduce some instances of false positives.

- All network ports should be restricted on NSG associated to your VM
- Management ports should be closed on your virtual machines
- Internet-facing virtual machines should be protected with Network Security Groups
- Subnets should be associated with a Network Security Group

### Deprecated preview AKS recommendation "Pod Security Policies should be defined on Kubernetes Services"

The preview recommendation "Pod Security Policies should be defined on Kubernetes Services" is being deprecated as described in the [Azure Kubernetes Service](../aks/use-pod-security-policies.md) documentation.

The pod security policy (preview) feature, is set for deprecation and will no longer be available after October 15, 2020 in favor of Azure Policy for AKS.

After pod security policy (preview) is deprecated, you must disable the feature on any existing clusters using the deprecated feature to perform future cluster upgrades and stay within Azure support.

### Email notifications from Azure Security Center improved

The following areas of the emails regarding security alerts have been improved:

- Added the ability to send email notifications about alerts for all severity levels
- Added the ability to notify users with different Azure roles on the subscription
- We're proactively notifying subscription owners by default on high-severity alerts (which have a high-probability of being genuine breaches)
- We've removed the phone number field from the email notifications configuration page

Learn more in [Set up email notifications for security alerts](configure-email-notifications.md).

### Secure score doesn't include preview recommendations

Security Center continually assesses your resources, subscriptions, and organization for security issues. It then aggregates all the findings into a single score so that you can tell, at a glance, your current security situation: the higher the score, the lower the identified risk level.

As new threats are discovered, new security advice is made available in Security Center through new recommendations. To avoid surprise changes your secure score, and to provide a grace period in which you can explore new recommendations before they impact your scores, recommendations flagged as **Preview** are no longer included in the calculations of your secure score. They should still be remediated wherever possible, so that when the preview period ends they'll contribute towards your score.

Also, **Preview** recommendations don't render a resource "Unhealthy".

An example of a preview recommendation:

:::image type="content" source="./media/secure-score-security-controls/example-of-preview-recommendation.png" alt-text="Recommendation with the preview flag.":::

[Learn more about secure score](secure-score-security-controls.md).

### Recommendations now include a severity indicator and the freshness interval

The details page for recommendations now includes a freshness interval indicator (whenever relevant) and a clear display of the severity of the recommendation.

:::image type="content" source="./media/release-notes/recommendations-severity-freshness-indicators.png" alt-text="Recommendation page showing freshness and severity.":::

## August 2020

Updates in August include:

- [Asset inventory - powerful new view of the security posture of your assets](#asset-inventory---powerful-new-view-of-the-security-posture-of-your-assets)
- [Added support for Azure Active Directory security defaults (for multifactor authentication)](#added-support-for-azure-active-directory-security-defaults-for-multifactor-authentication)
- [Service principals recommendation added](#service-principals-recommendation-added)
- [Vulnerability assessment on VMs - recommendations and policies consolidated](#vulnerability-assessment-on-vms---recommendations-and-policies-consolidated)
- [New AKS security policies added to ASC_default initiative – for use by private preview customers only](#new-aks-security-policies-added-to-asc_default-initiative--for-use-by-private-preview-customers-only)

### Asset inventory - powerful new view of the security posture of your assets

Security Center's asset inventory (currently in preview) provides a way to view the security posture of the resources you've connected to Security Center.

Security Center periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to remediate those vulnerabilities. When any resource has outstanding recommendations, they'll appear in the inventory.

You can use the view and its filters to explore your security posture data and take further actions based on your findings.

Learn more about [asset inventory](asset-inventory.md).

### Added support for Azure Active Directory security defaults (for multifactor authentication)

Security Center has added full support for [security defaults](../active-directory/fundamentals/concept-fundamentals-security-defaults.md), Microsoft's free identity security protections.

Security defaults provide preconfigured identity security settings to defend your organization from common identity-related attacks. Security defaults already protecting more than 5 million tenants overall; 50,000 tenants are also protected by Security Center.

Security Center now provides a security recommendation whenever it identifies an Azure subscription without security defaults enabled. Until now, Security Center recommended enabling multifactor authentication using conditional access, which is part of the Azure Active Directory (AD) premium license. For customers using Azure AD free, we now recommend enabling security defaults.

Our goal is to encourage more customers to secure their cloud environments with MFA, and mitigate one of the highest risks that is also the most impactful to your [secure score](secure-score-security-controls.md).

Learn more about [security defaults](../active-directory/fundamentals/concept-fundamentals-security-defaults.md).

### Service principals recommendation added

A new recommendation was added to recommend that Security Center customers using management certificates to manage their subscriptions switch to service principals.

The recommendation, **Service principals should be used to protect your subscriptions instead of Management Certificates** advises you to use Service Principals or Azure Resource Manager to more securely manage your subscriptions.

Learn more about [Application and service principal objects in Azure Active Directory](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object).

### Vulnerability assessment on VMs - recommendations and policies consolidated

Security Center inspects your VMs to detect whether they're running a vulnerability assessment solution. If no vulnerability assessment solution is found, Security Center provides a recommendation to simplify the deployment.

When vulnerabilities are found, Security Center provides a recommendation summarizing the findings for you to investigate and remediate as necessary.

To ensure a consistent experience for all users, regardless of the scanner type they're using, we've unified four recommendations into the following two:

|Unified recommendation|Change description|
|----|:----|
|**A vulnerability assessment solution should be enabled on your virtual machines**|Replaces the following two recommendations:<br> ***** Enable the built-in vulnerability assessment solution on virtual machines (powered by Qualys (now deprecated) (Included with standard tier)<br> ***** Vulnerability assessment solution should be installed on your virtual machines (now deprecated) (Standard and free tiers)|
|**Vulnerabilities in your virtual machines should be remediated**|Replaces the following two recommendations:<br>***** Remediate vulnerabilities found on your virtual machines (powered by Qualys) (now deprecated)<br>***** Vulnerabilities should be remediated by a Vulnerability Assessment solution (now deprecated)|

Now you'll use the same recommendation to deploy Security Center's vulnerability assessment extension or a  privately licensed solution ("BYOL") from a partner such as Qualys or Rapid 7.

Also, when vulnerabilities are found and reported to Security Center, a single recommendation will alert you to the findings regardless of the vulnerability assessment solution that identified them.

#### Updating dependencies

If you have scripts, queries, or automations referring to the previous recommendations or policy keys/names, use the tables below to update the references:

##### Before August 2020

| Recommendation|Scope|
|----|:----|
|**Enable the built-in vulnerability assessment solution on virtual machines (powered by Qualys)**<br>Key: 550e890b-e652-4d22-8274-60b3bdb24c63|Built-in|
|**Remediate vulnerabilities found on your virtual machines (powered by Qualys)**<br>Key: 1195afff-c881-495e-9bc5-1486211ae03f|Built-in|
|**Vulnerability assessment solution should be installed on your virtual machines**<br>Key: 01b1ed4c-b733-4fee-b145-f23236e70cf3|BYOL|
|**Vulnerabilities should be remediated by a Vulnerability Assessment solution**<br>Key: 71992a2a-d168-42e0-b10e-6b45fa2ecddb|BYOL|

|Policy|Scope|
|----|:----|
|**Vulnerability assessment should be enabled on virtual machines**<br>Policy ID: 501541f7-f7e7-4cd6-868c-4190fdad3ac9|Built-in|
|**Vulnerabilities should be remediated by a vulnerability assessment solution**<br>Policy ID: 760a85ff-6162-42b3-8d70-698e268f648c|BYOL|

##### From August 2020

|Recommendation|Scope|
|----|:----|
|**A vulnerability assessment solution should be enabled on your virtual machines**<br>Key: ffff0522-1e88-47fc-8382-2a80ba848f5d|Built-in + BYOL|
|**Vulnerabilities in your virtual machines should be remediated**<br>Key: 1195afff-c881-495e-9bc5-1486211ae03f|Built-in + BYOL|

|Policy|Scope|
|----|:----|
|[**Vulnerability assessment should be enabled on virtual machines**](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f501541f7-f7e7-4cd6-868c-4190fdad3ac9)<br>Policy ID: 501541f7-f7e7-4cd6-868c-4190fdad3ac9 |Built-in + BYOL|

### New AKS security policies added to ASC_default initiative – for use by private preview customers only

To ensure that Kubernetes workloads are secure by default, Security Center is adding Kubernetes level policies and  hardening recommendations, including enforcement options with Kubernetes admission control.

The early phase of this project includes a private preview and the addition of new (disabled by default) policies to the ASC_default initiative.

You can safely ignore these policies and there will be no impact on your environment. If you'd like to enable them, sign up for the preview via the [Microsoft Cloud Security
Private Community](https://aka.ms/SecurityPrP) and select from the following options:

1. **Single Preview** – To join only this private preview. Explicitly mention "ASC Continuous Scan" as the preview you would like to join.
1. **Ongoing Program** – To be added to this and future private previews. You'll need to complete a profile and privacy agreement.

## July 2020

Updates in July include:

- [Vulnerability assessment for virtual machines is now available for images that aren't in the marketplace](#vulnerability-assessment-for-virtual-machines-is-now-available-for-non-marketplace-images)
- [Threat protection for Azure Storage expanded to include Azure Files and Azure Data Lake Storage Gen2 (preview)](#threat-protection-for-azure-storage-expanded-to-include-azure-files-and-azure-data-lake-storage-gen2-preview)
- [Eight new recommendations to enable threat protection features](#eight-new-recommendations-to-enable-threat-protection-features)
- [Container security improvements - faster registry scanning and refreshed documentation](#container-security-improvements---faster-registry-scanning-and-refreshed-documentation)
- [Adaptive application controls updated with a new recommendation and support for wildcards in path rules](#adaptive-application-controls-updated-with-a-new-recommendation-and-support-for-wildcards-in-path-rules)
- [Six policies for SQL advanced data security deprecated](#six-policies-for-sql-advanced-data-security-deprecated)

### Vulnerability assessment for virtual machines is now available for non-marketplace images

When you deployed a vulnerability assessment solution, Security Center previously performed a validation check before deployment. The check was to confirm a marketplace SKU of the destination virtual machine.

From this update, the check is removed and you can now deploy vulnerability assessment tools to 'custom' Windows and Linux machines. Custom images are ones that you've modified from the marketplace defaults.

Although you can now deploy the integrated vulnerability assessment extension (powered by Qualys) on many more machines, support is only available if you're using an OS listed in [Deploy the integrated vulnerability scanner to standard tier VMs](deploy-vulnerability-assessment-vm.md#deploy-the-integrated-scanner-to-your-azure-and-hybrid-machines)

Learn more about the [integrated vulnerability scanner for virtual machines (requires Azure Defender)](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner).

Learn more about using your own privately licensed vulnerability assessment solution from Qualys or Rapid7 in [Deploying a partner vulnerability scanning solution](deploy-vulnerability-assessment-vm.md).

### Threat protection for Azure Storage expanded to include Azure Files and Azure Data Lake Storage Gen2 (preview)

Threat protection for Azure Storage detects potentially harmful activity on your Azure Storage accounts. Security Center displays alerts when it detects attempts to access or exploit your storage accounts.

Your data can be protected whether it's stored as blob containers, file shares, or data lakes.

### Eight new recommendations to enable threat protection features

Eight new recommendations have been added to provide a simple way to enable Azure Security Center's threat protection features for the following resource types: virtual machines, App Service plans, Azure SQL Database servers, SQL servers on machines, Azure Storage accounts, Azure Kubernetes Service clusters, Azure Container Registry registries, and Azure Key Vault vaults.

The new recommendations are:

- **Advanced data security should be enabled on Azure SQL Database servers**
- **Advanced data security should be enabled on SQL servers on machines**
- **Advanced threat protection should be enabled on Azure App Service plans**
- **Advanced threat protection should be enabled on Azure Container Registry registries**
- **Advanced threat protection should be enabled on Azure Key Vault vaults**
- **Advanced threat protection should be enabled on Azure Kubernetes Service clusters**
- **Advanced threat protection should be enabled on Azure Storage accounts**
- **Advanced threat protection should be enabled on virtual machines**

These new recommendations belong to the **Enable Azure Defender** security control.

The recommendations also include the quick fix capability.

> [!IMPORTANT]
> Remediating any of these recommendations will result in charges for protecting the relevant resources. These charges will begin immediately if you have related resources in the current subscription. Or in the future, if you add them at a later date.
>
> For example, if you don't have any Azure Kubernetes Service clusters in your subscription and you enable the threat protection, no charges will be incurred. If, in the future, you add a cluster on the same subscription, it will automatically be protected and charges will begin at that time.

Learn more about each of these in the [security recommendations reference page](recommendations-reference.md).

Learn more about [threat protection in Azure Security Center](azure-defender.md).

### Container security improvements - faster registry scanning and refreshed documentation

As part of the continuous investments in the container security domain, we are happy to share a significant performance improvement in Security Center's dynamic scans of container images stored in Azure Container Registry. Scans now typically complete in approximately two minutes. In some cases, they might take up to 15 minutes.

To improve the clarity and guidance regarding Azure Security Center's container security capabilities, we've also refreshed the container security documentation pages.

Learn more about Security Center's container security in the following articles:

- [Overview of Security Center's container security features](defender-for-containers-introduction.md)
- [Details of the integration with Azure Container Registry](defender-for-container-registries-introduction.md)
- [Details of the integration with Azure Kubernetes Service](defender-for-kubernetes-introduction.md)
- [How-to scan your registries and harden your Docker hosts](defender-for-containers-introduction.md)
- [Security alerts from the threat protection features for Azure Kubernetes Service clusters](alerts-reference.md#alerts-k8scluster)
- [Security recommendations for containers](recommendations-reference.md#recs-compute)

### Adaptive application controls updated with a new recommendation and support for wildcards in path rules

The adaptive application controls feature has received two significant updates:

- A new recommendation identifies potentially legitimate behavior that hasn't previously been allowed. The new recommendation, **Allowlist rules in your adaptive application control policy should be updated**, prompts you to add new rules to the existing policy to reduce the number of false positives in adaptive application controls violation alerts.

- Path rules now support wildcards. From this update, you can configure allowed path rules using wildcards. There are two supported scenarios:

  - Using a wildcard at the end of a path to allow all executables within this folder and subfolders.

  - Using a wildcard in the middle of a path to enable a known executable name with a changing folder name (e.g. personal user folders with a known executable, automatically generated folder names, etc.).

[Learn more about adaptive application controls](adaptive-application-controls.md).

### Six policies for SQL advanced data security deprecated

Six policies related to advanced data security for SQL machines are being deprecated:

- Advanced threat protection types should be set to 'All' in SQL managed instance advanced data security settings
- Advanced threat protection types should be set to 'All' in SQL server advanced data security settings
- Advanced data security settings for SQL managed instance should contain an email address to receive security alerts
- Advanced data security settings for SQL server should contain an email address to receive security alerts
- Email notifications to admins and subscription owners should be enabled in SQL managed instance advanced data security settings
- Email notifications to admins and subscription owners should be enabled in SQL server advanced data security settings

Learn more about [built-in policies](./policy-reference.md).

## June 2020

Updates in June include:

- [Secure score API (preview)](#secure-score-api-preview)
- [Advanced data security for SQL machines (Azure, other clouds, and on-premises) (preview)](#advanced-data-security-for-sql-machines-azure-other-clouds-and-on-premises-preview)
- [Two new recommendations to deploy the Log Analytics agent to Azure Arc machines (preview)](#two-new-recommendations-to-deploy-the-log-analytics-agent-to-azure-arc-machines-preview)
- [New policies to create continuous export and workflow automation configurations at scale](#new-policies-to-create-continuous-export-and-workflow-automation-configurations-at-scale)
- [New recommendation for using NSGs to protect non-internet-facing virtual machines](#new-recommendation-for-using-nsgs-to-protect-non-internet-facing-virtual-machines)
- [New policies for enabling threat protection and advanced data security](#new-policies-for-enabling-threat-protection-and-advanced-data-security)

### Secure score API (preview)

You can now access your score via the [secure score API](/rest/api/defenderforcloud/secure-scores) (currently in preview). The API methods provide the flexibility to query the data and build your own reporting mechanism of your secure scores over time. For example, you can use the **Secure Scores** API to get the score for a specific subscription. In addition, you can use the **Secure Score Controls** API to list the security controls and the current score of your subscriptions.

For examples of external tools made possible with the secure score API, see [the secure score area of our GitHub community](https://github.com/Azure/Azure-Security-Center/tree/master/Secure%20Score).

Learn more about [secure score and security controls in Azure Security Center](secure-score-security-controls.md).

### Advanced data security for SQL machines (Azure, other clouds, and on-premises) (preview)

Azure Security Center's advanced data security for SQL machines now protects SQL Servers hosted in Azure, on other cloud environments, and even on-premises machines. This extends the protections for your Azure-native SQL Servers to fully support hybrid environments.

Advanced data security provides vulnerability assessment and advanced threat protection for your SQL machines wherever they're located.

Set up involves two steps:

1. Deploying the Log Analytics agent to your SQL Server's host machine to provide the connection to Azure account.

1. Enabling the optional bundle in Security Center's pricing and settings page.

Learn more about [advanced data security for SQL machines](defender-for-sql-usage.md).

### Two new recommendations to deploy the Log Analytics agent to Azure Arc machines (preview)

Two new recommendations have been added to help deploy the [Log Analytics Agent](../azure-monitor/agents/log-analytics-agent.md) to your Azure Arc machines and ensure they're protected by Azure Security Center:

- **Log Analytics agent should be installed on your Windows-based Azure Arc machines (Preview)**
- **Log Analytics agent should be installed on your Linux-based Azure Arc machines (Preview)**

These new recommendations will appear in the same four security controls as the existing (related) recommendation, **Monitoring agent should be installed on your machines**: remediate security configurations, apply adaptive application control, apply system updates, and enable endpoint protection.

The recommendations also include the Quick fix capability to accelerate the deployment process.

Learn more about these two new recommendations in the [Compute and app recommendations](recommendations-reference.md#recs-compute) table.

Learn more about how Azure Security Center uses the agent in [What is the Log Analytics agent?](./faq-data-collection-agents.yml#what-is-the-log-analytics-agent-).

Learn more about [extensions for Azure Arc machines](../azure-arc/servers/manage-vm-extensions.md).

### New policies to create continuous export and workflow automation configurations at scale

Automating your organization's monitoring and incident response processes can greatly improve the time it takes to investigate and mitigate security incidents.

To deploy your automation configurations across your organization, use these built-in 'DeployIfdNotExist' Azure policies to create and configure [continuous export](continuous-export.md) and [workflow automation](workflow-automation.md) procedures:

The policy definitions can be found in Azure Policy:

|Goal  |Policy  |Policy ID  |
|---------|---------|---------|
|Continuous export to Event Hubs|[Deploy export to Event Hubs for Azure Security Center alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcdfcce10-4578-4ecd-9703-530938e4abcb)|cdfcce10-4578-4ecd-9703-530938e4abcb|
|Continuous export to Log Analytics workspace|[Deploy export to Log Analytics workspace for Azure Security Center alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fffb6f416-7bd2-4488-8828-56585fef2be9)|ffb6f416-7bd2-4488-8828-56585fef2be9|
|Workflow automation for security alerts|[Deploy Workflow Automation for Azure Security Center alerts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ff1525828-9a90-4fcf-be48-268cdd02361e)|f1525828-9a90-4fcf-be48-268cdd02361e|
|Workflow automation for security recommendations|[Deploy Workflow Automation for Azure Security Center recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f73d6ab6c-2475-4850-afd6-43795f3492ef)|73d6ab6c-2475-4850-afd6-43795f3492ef|

Get started with [workflow automation templates](https://github.com/Azure/Azure-Security-Center/tree/master/Workflow%20automation).

Learn more about using the two export policies in [Configure workflow automation at scale using the supplied policies](workflow-automation.md#configure-workflow-automation-at-scale-using-the-supplied-policies) and [Set up a continuous export](continuous-export.md#set-up-a-continuous-export).

### New recommendation for using NSGs to protect non-internet-facing virtual machines

The "implement security best practices" security control now includes the following new recommendation:

- **Non-internet-facing virtual machines should be protected with network security groups**

An existing recommendation, **Internet-facing virtual machines should be protected with network security groups**, didn't distinguish between internet-facing and non-internet facing VMs. For both, a high-severity recommendation was generated if a VM wasn't assigned to a network security group. This new recommendation separates the non-internet-facing machines to reduce the false positives and avoid unnecessary high-severity alerts.

Learn more in the [Network recommendations](recommendations-reference.md#recs-networking) table.

### New policies for enabling threat protection and advanced data security

The new policy definitions below were added to the ASC Default initiative and are designed to assist with enabling threat protection or advanced data security for the relevant resource types.

The policy definitions can be found in Azure Policy:

| Policy                                                                                                                                                                                                                                                                | Policy ID                            |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| [Advanced data security should be enabled on Azure SQL Database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7fe3b40f-802b-4cdd-8bd4-fd799c948cc2)     | 7fe3b40f-802b-4cdd-8bd4-fd799c948cc2 |
| [Advanced data security should be enabled on SQL servers on machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6581d072-105e-4418-827f-bd446d56421b) | 6581d072-105e-4418-827f-bd446d56421b |
| [Advanced threat protection should be enabled on Azure Storage accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f308fbb08-4ab8-4e67-9b29-592e93fb94fa)           | 308fbb08-4ab8-4e67-9b29-592e93fb94fa |
| [Advanced threat protection should be enabled on Azure Key Vault vaults](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0e6763cc-5078-4e64-889d-ff4d9a839047)           | 0e6763cc-5078-4e64-889d-ff4d9a839047 |
| [Advanced threat protection should be enabled on Azure App Service plans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2913021d-f2fd-4f3d-b958-22354e2bdbcb)                | 2913021d-f2fd-4f3d-b958-22354e2bdbcb |
| [Advanced threat protection should be enabled on Azure Container Registry registries](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fc25d9a16-bc35-4e15-a7e5-9db606bf9ed4)   | c25d9a16-bc35-4e15-a7e5-9db606bf9ed4 |
| [Advanced threat protection should be enabled on Azure Kubernetes Service clusters](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f523b5cd1-3e23-492f-a539-13118b6d1e3a)   | 523b5cd1-3e23-492f-a539-13118b6d1e3a |
| [Advanced threat protection should be enabled on Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f4da35fc9-c9e7-4960-aec9-797fe7d9051d)           | 4da35fc9-c9e7-4960-aec9-797fe7d9051d |

Learn more about [Threat protection in Azure Security Center](azure-defender.md).

## May 2020

Updates in May include:

- [Alert suppression rules (preview)](#alert-suppression-rules-preview)
- [Virtual machine vulnerability assessment is now generally available](#virtual-machine-vulnerability-assessment-is-now-generally-available)
- [Changes to just-in-time (JIT) virtual machine (VM) access](#changes-to-just-in-time-jit-virtual-machine-vm-access)
- [Custom recommendations have been moved to a separate security control](#custom-recommendations-have-been-moved-to-a-separate-security-control)
- [Toggle added to view recommendations in controls or as a flat list](#toggle-added-to-view-recommendations-in-controls-or-as-a-flat-list)
- [Expanded security control "Implement security best practices"](#expanded-security-control-implement-security-best-practices)
- [Custom policies with custom metadata are now generally available](#custom-policies-with-custom-metadata-are-now-generally-available)
- [Crash dump analysis capabilities migrating to fileless attack detection](#crash-dump-analysis-capabilities-migrating-to-fileless-attack-detection)

### Alert suppression rules (preview)

This new feature (currently in preview) helps reduce alert fatigue. Use rules to automatically hide alerts that are known to be innocuous or related to normal activities in your organization. This lets you focus on the most relevant threats.

Alerts that match your enabled suppression rules will still be generated, but their state will be set to dismissed. You can see the state in the Azure portal or however you access your Security Center security alerts.

Suppression rules define the criteria for which alerts should be automatically dismissed. Typically, you'd use a suppression rule to:

- suppress alerts that you've identified as false positives

- suppress alerts that are being triggered too often to be useful

Learn more about [suppressing alerts from Azure Security Center's threat protection](alerts-suppression-rules.md).

### Virtual machine vulnerability assessment is now generally available

Security Center's standard tier now includes an integrated vulnerability assessment for virtual machines for no additional fee. This extension is powered by Qualys but reports its findings directly back to Security Center. You don't need a Qualys license or even a Qualys account - everything's handled seamlessly inside Security Center.

The new solution can continuously scan your virtual machines to find vulnerabilities and present the findings in Security Center.

To deploy the solution, use the new security recommendation:

"Enable the built-in vulnerability assessment solution on virtual machines (powered by Qualys)"

Learn more about [Security Center's integrated vulnerability assessment for virtual machines](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner).

### Changes to just-in-time (JIT) virtual machine (VM) access

Security Center includes an optional feature to protect the management ports of your VMs. This provides a defense against the most common form of brute force attacks.

This update brings the following changes to this feature:

- The recommendation that advises you to enable JIT on a VM was renamed. Formerly, "Just-in-time network access control should be applied on virtual machines" it's now: "Management ports of virtual machines should be protected with just-in-time network access control."

- The recommendation is triggered only if there are open management ports.

Learn more about [the JIT access feature](just-in-time-access-usage.md).

### Custom recommendations have been moved to a separate security control

One security control introduced with the enhanced secure score was "Implement security best practices." Any custom recommendations created for your subscriptions were automatically placed in that control.

To make it easier to find your custom recommendations, we've moved them into a dedicated security control, "Custom recommendations." This control has no impact on your secure score.

Learn more about security controls in [Enhanced secure score (preview) in Azure Security Center](secure-score-security-controls.md).

### Toggle added to view recommendations in controls or as a flat list

Security controls are logical groups of related security recommendations. They reflect your vulnerable attack surfaces. A control is a set of security recommendations, with instructions that help you implement those recommendations.

To immediately see how well your organization is securing each individual attack surface, review the scores for each security control.

By default, your recommendations are shown in the security controls. From this update, you can also display them as a list. To view them as simple list sorted by the health status of the affected resources, use the new toggle 'Group by controls'. The toggle is above the list in the portal.

The security controls - and this toggle - are part of the new secure score experience. Remember to send us your feedback from within the portal.

Learn more about security controls in [Enhanced secure score (preview) in Azure Security Center](secure-score-security-controls.md).

:::image type="content" source="./media/secure-score-security-controls/recommendations-group-by-toggle.gif" alt-text="Group by controls toggle for recommendations.":::

### Expanded security control "Implement security best practices"

One security control introduced with the enhanced secure score is "Implement security best practices." When a recommendation is in this control, it doesn't impact the secure score.

With this update, three recommendations have moved out of the controls in which they were originally placed, and into this best practices control. We've taken this step because we've determined that the risk of these three recommendations is lower than was initially thought.

In addition, two new recommendations have been introduced and added to this control.

The three recommendations that moved are:

- **MFA should be enabled on accounts with read permissions on your subscription** (originally in the "Enable MFA" control)
- **External accounts with read permissions should be removed from your subscription** (originally in the "Manage access and permissions" control)
- **A maximum of 3 owners should be designated for your subscription** (originally in the "Manage access and permissions" control)

The two new recommendations added to the control are:

- **Guest configuration extension should be installed on Windows virtual machines (Preview)** - Using [Azure Policy Guest Configuration](../governance/machine-configuration/overview.md) provides visibility inside virtual machines to server and application settings (Windows only).

- **Windows Defender Exploit Guard should be enabled on your machines (Preview)** - Windows Defender Exploit Guard leverages the Azure Policy Guest Configuration agent. Exploit Guard has four components that are designed to lock down devices against a wide variety of attack vectors and block behaviors commonly used in malware attacks while enabling enterprises to balance their security risk and productivity requirements  (Windows only).

Learn more about Windows Defender Exploit Guard in [Create and deploy an Exploit Guard policy](/mem/configmgr/protect/deploy-use/create-deploy-exploit-guard-policy).

Learn more about security controls in [Enhanced secure score (preview)](secure-score-security-controls.md).

### Custom policies with custom metadata are now generally available

Custom policies are now part of the Security Center recommendations experience, secure score, and the regulatory compliance standards dashboard. This feature is now generally available and allows you to extend your organization's security assessment coverage in Security Center.

Create a custom initiative in Azure Policy, add policies to it and onboard it to Azure Security Center, and visualize it as recommendations.

We've now also added the option to edit the custom recommendation metadata. Metadata options include severity, remediation steps, threats information, and more.

Learn more about [enhancing your custom recommendations with detailed information](custom-security-policies.md#enhance-your-custom-recommendations-with-detailed-information).

### Crash dump analysis capabilities migrating to fileless attack detection

We are integrating the Windows crash dump analysis (CDA) detection capabilities into [fileless attack detection](defender-for-servers-introduction.md#plan-features). Fileless attack detection analytics brings improved versions of the following security alerts for Windows machines: Code injection discovered, Masquerading Windows Module Detected, Shell code discovered, and Suspicious code segment detected.

Some of the benefits of this transition:

- **Proactive and timely malware detection** - The CDA approach involved waiting for a crash to occur and then running analysis to find malicious artifacts. Using fileless attack detection brings proactive identification of in-memory threats while they are running.

- **Enriched alerts** - The security alerts from fileless attack detection include enrichments that aren't available from CDA, such as the active network connections information.

- **Alert aggregation** - When CDA detected multiple attack patterns within a single crash dump, it triggered multiple security alerts. Fileless attack detection combines all of the identified attack patterns from the same process into a single alert, removing the need to correlate multiple alerts.

- **Reduced requirements on your Log Analytics workspace** - Crash dumps containing potentially sensitive data will no longer be uploaded to your Log Analytics workspace.

## April 2020

Updates in April include:

- [Dynamic compliance packages are now generally available](#dynamic-compliance-packages-are-now-generally-available)
- [Identity recommendations now included in Azure Security Center free tier](#identity-recommendations-now-included-in-azure-security-center-free-tier)

### Dynamic compliance packages are now generally available

The Azure Security Center regulatory compliance dashboard now includes **dynamic compliance packages** (now generally available) to track additional industry and regulatory standards.

Dynamic compliance packages can be added to your subscription or management group from the Security Center security policy page. When you've onboarded a standard or benchmark, the standard appears in your regulatory compliance dashboard with all associated compliance data mapped as assessments. A summary report for any of the standards that have been onboarded will be available to download.

Now, you can add standards such as:

- **NIST SP 800-53 R4**
- **SWIFT CSP CSCF-v2020**
- **UK Official and UK NHS**
- **Canada Federal PBMM**
- **Azure CIS 1.1.0 (new)** (which is a more complete representation of Azure CIS 1.1.0)

In addition, we've recently added the [Azure Security Benchmark](/security/benchmark/azure/introduction), the Microsoft-authored Azure-specific guidelines for security and compliance best practices based on common compliance frameworks. Additional standards will be supported in the dashboard as they become available.

Learn more about [customizing the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

### Identity recommendations now included in Azure Security Center free tier

Security recommendations for identity and access on the Azure Security Center free tier are now generally available. This is part of the effort to make the cloud security posture management (CSPM) features free. Until now, these recommendations were only available on the standard pricing tier.

Examples of identity and access recommendations include:

- "Multifactor authentication should be enabled on accounts with owner permissions on your subscription."
- "A maximum of three owners should be designated for your subscription."
- "Deprecated accounts should be removed from your subscription."

If you have subscriptions on the free pricing tier, their secure scores will be impacted by this change because they were never assessed for their identity and access security.

Learn more about [identity and access recommendations](recommendations-reference.md#recs-identityandaccess).

Learn more about [Managing multifactor authentication (MFA) enforcement on your subscriptions](multi-factor-authentication-enforcement.md).

## March 2020

Updates in March include:

- [Workflow automation is now generally available](#workflow-automation-is-now-generally-available)
- [Integration of Azure Security Center with Windows Admin Center](#integration-of-azure-security-center-with-windows-admin-center)
- [Protection for Azure Kubernetes Service](#protection-for-azure-kubernetes-service)
- [Improved just-in-time experience](#improved-just-in-time-experience)
- [Two security recommendations for web applications deprecated](#two-security-recommendations-for-web-applications-deprecated)

### Workflow automation is now generally available

The workflow automation feature of Azure Security Center is now generally available. Use it to automatically trigger Logic Apps on security alerts and recommendations. In addition, manual triggers are available for alerts and all recommendations that have the quick fix option available.

Every security program includes multiple workflows for incident response. These processes might include notifying relevant stakeholders, launching a change management process, and applying specific remediation steps. Security experts recommend that you automate as many steps of those procedures as you can. Automation reduces overhead and can improve your security by ensuring the process steps are done quickly, consistently, and according to your predefined requirements.

For more information about the automatic and manual Security Center capabilities for running your workflows, see [workflow automation](workflow-automation.md).

Learn more about [creating Logic Apps](../logic-apps/logic-apps-overview.md).

### Integration of Azure Security Center with Windows Admin Center

It's now possible to move your on-premises Windows servers from the Windows Admin Center directly to the Azure Security Center. Security Center then becomes your single pane of glass to view security information for all your Windows Admin Center resources, including on-premises servers, virtual machines, and additional PaaS workloads.

After moving a server from Windows Admin Center to Azure Security Center, you'll be able to:

- View security alerts and recommendations in the Security Center extension of the Windows Admin Center.
- View the security posture and retrieve additional detailed information of your Windows Admin Center managed servers in the Security Center within the Azure portal (or via an API).

Learn more about [how to integrate Azure Security Center with Windows Admin Center](windows-admin-center-integration.md).

### Protection for Azure Kubernetes Service

Azure Security Center is expanding its container security features to protect Azure Kubernetes Service (AKS).

The popular, open-source platform Kubernetes is adopted so widely that it's now an industry standard for container orchestration. Despite this widespread implementation, there's still a lack of understanding regarding how to secure a Kubernetes environment. Defending the attack surfaces of a containerized application requires expertise to ensuring the infrastructure is configured securely and constantly monitored for potential threats.

The Security Center defense includes:

- **Discovery and visibility** - Continuous discovery of managed AKS instances within the subscriptions registered to Security Center.
- **Security recommendations** - Actionable recommendations to help you comply with security best-practices for AKS. These recommendations are included in your secure score to ensure they're viewed as a part of your organization's security posture. An example of an AKS-related recommendation you might see is "Role-based access control should be used to restrict access to a Kubernetes service cluster."
- **Threat protection** - Through continuous analysis of your AKS deployment, Security Center alerts you to threats and malicious activity detected at the host and AKS cluster level.

Learn more about [Azure Kubernetes Services' integration with Security Center](defender-for-kubernetes-introduction.md).

Learn more about [the container security features in Security Center](defender-for-containers-introduction.md).

### Improved just-in-time experience

The features, operation, and UI for Azure Security Center's just-in-time tools that secure your management ports have been enhanced as follows:

- **Justification field** - When requesting access to a virtual machine (VM) through the just-in-time page of the Azure portal, a new optional field is available to enter a justification for the request. Information entered into this field can be tracked in the activity log.
- **Automatic cleanup of redundant just-in-time (JIT) rules** - Whenever you update a JIT policy, a cleanup tool automatically runs to check the validity of your entire ruleset. The tool looks for mismatches between rules in your policy and rules in the NSG. If the cleanup tool finds a mismatch, it determines the cause and, when it's safe to do so, removes built-in rules that aren't needed anymore. The cleaner never deletes rules that you've created.

Learn more about [the JIT access feature](just-in-time-access-usage.md).

### Two security recommendations for web applications deprecated

Two security recommendations related to web applications are being deprecated:

- The rules for web applications on IaaS NSGs should be hardened.
    (Related policy: The NSGs rules for web applications on IaaS should be hardened)

- Access to App Services should be restricted.
    (Related policy: Access to App Services should be restricted [preview])

These recommendations will no longer appear in the Security Center list of recommendations. The related policies will no longer be included in the initiative named "Security Center Default".

Learn more about [security recommendations](recommendations-reference.md).

## February 2020

### Fileless attack detection for Linux (preview)

As attackers increasing employ stealthier methods to avoid detection, Azure Security Center is extending fileless attack detection for Linux, in addition to Windows. Fileless attacks exploit software vulnerabilities, inject malicious payloads into benign system processes, and hide in memory. These techniques:

- minimize or eliminate traces of malware on disk
- greatly reduce the chances of detection by disk-based malware scanning solutions

To counter this threat, Azure Security Center released fileless attack detection for Windows in October 2018, and has now extended fileless attack detection on Linux as well.

## January 2020

### Enhanced secure score (preview)

An enhanced version of the secure score feature of Azure Security Center is now available in preview. In this version, multiple recommendations are grouped into Security Controls that better reflect your vulnerable attack surfaces (for example, restrict access to management ports).

Familiarize yourself with the secure score changes during the preview phase and determine other remediations that will help you to further secure your environment.

Learn more about [enhanced secure score (preview)](secure-score-security-controls.md).

## November 2019

Updates in November include:

- [Threat Protection for Azure Key Vault in North America regions (preview)](#threat-protection-for-azure-key-vault-in-north-america-regions-preview)
- [Threat Protection for Azure Storage includes Malware Reputation Screening](#threat-protection-for-azure-storage-includes-malware-reputation-screening)
- [Workflow automation with Logic Apps (preview)](#workflow-automation-with-logic-apps-preview)
- [Quick Fix for bulk resources generally available](#quick-fix-for-bulk-resources-generally-available)
- [Scan container images for vulnerabilities (preview)](#scan-container-images-for-vulnerabilities-preview)
- [Additional regulatory compliance standards (preview)](#additional-regulatory-compliance-standards-preview)
- [Threat Protection for Azure Kubernetes Service (preview)](#threat-protection-for-azure-kubernetes-service-preview)
- [Virtual machine vulnerability assessment (preview)](#virtual-machine-vulnerability-assessment-preview)
- [Advanced data security for SQL servers on Azure Virtual Machines (preview)](#advanced-data-security-for-sql-servers-on-azure-virtual-machines-preview)
- [Support for custom policies (preview)](#support-for-custom-policies-preview)
- [Extending Azure Security Center coverage with platform for community and partners](#extending-azure-security-center-coverage-with-platform-for-community-and-partners)
- [Advanced integrations with export of recommendations and alerts (preview)](#advanced-integrations-with-export-of-recommendations-and-alerts-preview)
- [Onboard on-premises servers to Security Center from Windows Admin Center (preview)](#onboard-on-premises-servers-to-security-center-from-windows-admin-center-preview)

### Threat Protection for Azure Key Vault in North America Regions (preview)

Azure Key Vault is an essential service for protecting data and improving performance of cloud applications by offering the ability to centrally manage keys, secrets, cryptographic keys and policies in the cloud. Since Azure Key Vault stores sensitive and business critical data, it requires maximum security for the key vaults and the data stored in them.

Azure Security Center's support for Threat Protection for Azure Key Vault provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit key vaults. This new layer of protection allows customers to address threats against their key vaults without being a security expert or manage security monitoring systems. The feature is in public preview in North America Regions.

### Threat Protection for Azure Storage includes Malware Reputation Screening

Threat protection for Azure Storage offers new detections powered by Microsoft Threat Intelligence for detecting malware uploads to Azure Storage using hash reputation analysis and suspicious access from an active Tor exit node (an anonymizing proxy). You can now view detected malware across storage accounts using Azure Security Center.

### Workflow automation with Logic Apps (preview)

Organizations with centrally managed security and IT/operations implement internal workflow processes to drive required action within the organization when discrepancies are discovered in their environments. In many cases, these workflows are repeatable processes and automation can greatly streamline processes within the organization.

Today we are introducing a new capability in Security Center that allows customers to create automation configurations leveraging Azure Logic Apps and to create policies that will automatically trigger them based on specific ASC findings such as Recommendations or Alerts. Azure Logic App can be configured to do any custom action supported by the vast community of Logic App connectors, or use one of the templates provided by Security Center such as sending an email or opening a ServiceNow&trade; ticket.

For more information about the automatic and manual Security Center capabilities for running your workflows, see [workflow automation](workflow-automation.md).

To learn about creating Logic Apps, see [Azure Logic Apps](../logic-apps/logic-apps-overview.md).

### Quick Fix for bulk resources generally available

With the many tasks that a user is given as part of Secure Score, the ability to effectively remediate issues across a large fleet can become challenging.

Use Quick Fix remediation to fix security misconfigurations, remediate recommendations on multiple resources, and improve your secure score.

This operation will allow you to select the resources you want to apply the remediation to and launch a remediation action that will configure the setting on your behalf.

Quick fix is generally available today customers as part of the Security Center recommendations page.

See which recommendations have quick fix enabled in the [reference guide to security recommendations](recommendations-reference.md).

### Scan container images for vulnerabilities (preview)

Azure Security Center can now scan container images in Azure Container Registry for vulnerabilities.

The image scanning works by parsing the container image file, then checking to see whether there are any known vulnerabilities (powered by Qualys).

The scan itself is automatically triggered when pushing new container images to Azure Container Registry. Found vulnerabilities will surface as Security Center recommendations and included in the secure score together with information on how to patch them to reduce the attack surface they allowed.

### Additional regulatory compliance standards (preview)

The Regulatory Compliance dashboard provides insights into your compliance posture based on Security Center assessments. The dashboard shows how your environment complies with controls and requirements designated by specific regulatory standards and industry benchmarks and provides prescriptive recommendations for how to address these requirements.

The regulatory compliance dashboard has thus far supported four built-in standards:  Azure CIS 1.1.0, PCI-DSS, ISO 27001, and SOC-TSP. We are now announcing the public preview release of additional supported standards: NIST SP 800-53 R4, SWIFT CSP CSCF v2020, Canada Federal PBMM and UK Official together with UK NHS. We are also releasing an updated version of Azure CIS 1.1.0, covering more controls from the standard and enhancing extensibility.

[Learn more about customizing the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

### Threat Protection for Azure Kubernetes Service (preview)

Kubernetes is quickly becoming the new standard for deploying and managing software in the cloud. Few people have extensive experience with Kubernetes and many only focuses on general engineering and administration and overlook the security aspect. Kubernetes environment needs to be configured carefully to be secure, making sure no container focused attack surface doors are not left open is exposed for attackers. Security Center is expanding its support in the container space to one of the fastest growing services in Azure - Azure Kubernetes Service (AKS).

The new capabilities in this public preview release include:

- **Discovery & Visibility** - Continuous discovery of managed AKS instances within Security Center's registered subscriptions.
- **Secure Score recommendations** - Actionable items to help customers comply with security best practices for AKS, and increase their secure score. Recommendations include items such as "Role-based access control should be used to restrict access to a Kubernetes Service Cluster".
- **Threat Detection** - Host and cluster-based analytics, such as "A privileged container detected".

### Virtual machine vulnerability assessment (preview)

Applications that are installed in virtual machines could often have vulnerabilities that could lead to a breach of the virtual machine. We are announcing that the Security Center standard tier includes built-in vulnerability assessment for virtual machines for no additional fee. The vulnerability assessment, powered by Qualys in the public preview, will allow you to continuously scan all the installed applications on a virtual machine to find vulnerable applications and present the findings in the Security Center portal's experience. Security Center takes care of all deployment operations so that no extra work is required from the user. Going forward we are planning to provide vulnerability assessment options to support our customers' unique business needs.

[Learn more about vulnerability assessments for your Azure Virtual Machines](deploy-vulnerability-assessment-vm.md).

### Advanced data security for SQL servers on Azure Virtual Machines (preview)

Azure Security Center's support for threat protection and vulnerability assessment for SQL DBs running on IaaS VMs is now in preview.

[Vulnerability assessment](/azure/azure-sql/database/sql-vulnerability-assessment) is an easy to configure service that can discover, track, and help you remediate potential database vulnerabilities. It provides visibility into your security posture as part of secure score and includes the steps to resolve security issues and enhance your database fortifications.

[Advanced threat protection](/azure/azure-sql/database/threat-detection-overview) detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit your SQL server. It continuously monitors your database for suspicious activities and provides action-oriented security alerts on anomalous database access patterns. These alerts provide the suspicious activity details and recommended actions to investigate and mitigate the threat.

### Support for custom policies (preview)

Azure Security Center now supports custom policies (in preview).

Our customers have been wanting to extend their current security assessments coverage in Security Center with their own security assessments based on policies that they create in Azure Policy. With support for custom policies, this is now possible.

These new policies will be part of the Security Center recommendations experience, Secure Score, and the regulatory compliance standards dashboard. With the support for custom policies, you're now able to create a custom initiative in Azure Policy, then add it as a policy in Security Center and visualize it as a recommendation.

### Extending Azure Security Center coverage with platform for community and partners

Use Security Center to receive recommendations not only from Microsoft but also from existing solutions from partners such as Check Point, Tenable, and CyberArk with many more integrations coming.  Security Center's simple onboarding flow can connect your existing solutions to Security Center, enabling you to view your security posture recommendations in a single place, run unified reports and leverage all of Security Center's capabilities against both built-in and partner recommendations. You can also export Security Center recommendations to partner products.

[Learn more about Microsoft Intelligent Security Association](https://www.microsoft.com/security/partnerships/intelligent-security-association).

### Advanced integrations with export of recommendations and alerts (preview)

In order to enable enterprise level scenarios on top of Security Center, it's now possible to consume Security Center alerts and recommendations in additional places except the Azure portal or API. These can be directly exported to an event hub and to Log Analytics workspaces. Here are a few workflows you can create around these new capabilities:

- With export to Log Analytics workspace, you can create custom dashboards with Power BI.
- With export to Event Hubs, you'll be able to export Security Center alerts and recommendations to your third-party SIEMs, to a third-party solution, or Azure Data Explorer.

### Onboard on-premises servers to Security Center from Windows Admin Center (preview)

Windows Admin Center is a management portal for Windows Servers who are not deployed in Azure offering them several Azure management capabilities such as backup and system updates. We have recently added an ability to onboard these non-Azure servers to be protected by ASC directly from the Windows Admin Center experience.

Users can onboard a WAC server to Azure Security Center and enable viewing its security alerts and recommendations directly in the Windows Admin Center experience.

## September 2019

Updates in September include:

- [Managing rules with adaptive application controls improvements](#managing-rules-with-adaptive-application-controls-improvements)
- [Control container security recommendation using Azure Policy](#control-container-security-recommendation-using-azure-policy)

### Managing rules with adaptive application controls improvements

The experience of managing rules for virtual machines using adaptive application controls has improved. Azure Security Center's adaptive application controls help you control which applications can run on your virtual machines. In addition to a general improvement to rule management, a new benefit enables you to control which file types will be protected when you add a new rule.

[Learn more about adaptive application controls](adaptive-application-controls.md).

### Control container security recommendation using Azure Policy

Azure Security Center's recommendation to remediate vulnerabilities in container security can now be enabled or disabled via Azure Policy.

To view your enabled security policies, from Security Center open the Security Policy page.

## August 2019

Updates in August include:

- [Just-in-time (JIT) VM access for Azure Firewall](#just-in-time-jit-vm-access-for-azure-firewall)
- [Single click remediation to boost your security posture (preview)](#single-click-remediation-to-boost-your-security-posture-preview)
- [Cross-tenant management](#cross-tenant-management)

### Just-in-time (JIT) VM access for Azure Firewall

Just-in-time (JIT) VM access for Azure Firewall is now generally available. Use it to secure your Azure Firewall protected environments  in addition to your NSG protected environments.

JIT VM access reduces exposure to network volumetric attacks by providing controlled access to VMs only when needed, using your NSG and Azure Firewall rules.

When you enable JIT for your VMs, you create a policy that determines the ports to be protected, how long the ports are to remain open, and approved IP addresses from where these ports can be accessed. This policy helps you stay in control of what users can do when they request access.

Requests are logged in the Azure Activity Log, so you can easily monitor and audit access. The just-in-time page also helps you quickly identify existing VMs that have JIT enabled and VMs where JIT is recommended.

[Learn more about Azure Firewall](../firewall/overview.md).

### Single click remediation to boost your security posture (preview)

Secure score is a tool that helps you assess your workload security posture. It reviews your security recommendations and prioritizes them for you, so you know which recommendations to perform first. This helps you find the most serious security vulnerabilities to prioritize investigation.

In order to simplify remediation of security misconfigurations and help you to quickly improve your secure score, we've added a new capability that allows you to remediate a recommendation on a bulk of resources in a single click.

This operation will allow you to select the resources you want to apply the remediation to and launch a remediation action that will configure the setting on your behalf.

See which recommendations have quick fix enabled in the [reference guide to security recommendations](recommendations-reference.md).

### Cross-tenant management

Security Center now supports cross-tenant management scenarios as part of Azure Lighthouse. This enables you to gain visibility and manage the security posture of multiple tenants in Security Center.

[Learn more about cross-tenant management experiences](cross-tenant-management.md).

## July 2019

### Updates to network recommendations

Azure Security Center (ASC) has launched new networking recommendations and improved some existing ones. Now, using Security Center ensures even greater networking protection for your resources.

[Learn more about network recommendations](recommendations-reference.md#recs-networking).

## June 2019

### Adaptive network hardening - generally available

One of the biggest attack surfaces for workloads running in the public cloud are connections to and from the public Internet. Our customers find it hard to know which Network Security Group (NSG) rules should be in place to make sure that Azure workloads are only available to required source ranges. With this feature, Security Center learns the network traffic and connectivity patterns of Azure workloads and provides NSG rule recommendations, for Internet facing virtual machines. This helps our customer better configure their network access policies and limit their exposure to attacks.

[Learn more about adaptive network hardening](adaptive-network-hardening.md).
