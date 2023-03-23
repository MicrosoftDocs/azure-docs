---
title: Release notes for Microsoft Defender for Cloud
description: A description of what's new and changed in Microsoft Defender for Cloud
ms.topic: overview
ms.date: 02/20/2023
---

# What's new in Microsoft Defender for Cloud?

Defender for Cloud is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about new features, bug fixes, and deprecated functionality.

This page is updated frequently, so revisit it often.

To learn about *planned* changes that are coming soon to Defender for Cloud, see [Important upcoming changes to Microsoft Defender for Cloud](upcoming-changes.md).

> [!TIP]
> If you're looking for items older than six months, you can find them in the [Archive for What's new in Microsoft Defender for Cloud](release-notes-archive.md).

## February 2023

Updates in February include:

- [Enhanced Cloud Security Explorer](#enhanced-cloud-security-explorer) 
- [Recommendation to find vulnerabilities in running container images for Linux released for General Availability (GA)](#recommendation-to-find-vulnerabilities-in-running-container-images-released-for-general-availability-ga)
- [Announcing support for the AWS CIS 1.5.0 compliance standard](#announcing-support-for-the-aws-cis-150-compliance-standard)
- [Microsoft Defender for DevOps (preview) is now available in other regions](#microsoft-defender-for-devops-preview-is-now-available-in-other-regions)
- [The built-in policy [Preview]: Private endpoint should be configured for Key Vault has been deprecated](#the-built-in-policy-preview-private-endpoint-should-be-configured-for-key-vault-has-been-deprecated)

### Enhanced Cloud Security Explorer

An improved version of the cloud security explorer includes a refreshed user experience that removes query friction dramatically, added the ability to run multicloud and multi-resource queries, and embedded documentation for each query option.

The Cloud Security Explorer now allows you to run cloud-abstract queries across resources. You can use either the pre-built query templates or use the custom search to apply filters to build your query. Learn [how to manage Cloud Security Explorer](how-to-manage-cloud-security-explorer.md).

### Recommendation to find vulnerabilities in running container images released for General Availability (GA)

The [Running container images should have vulnerability findings resolved](defender-for-containers-vulnerability-assessment-azure.md#view-vulnerabilities-for-images-running-on-your-aks-clusters) recommendation for Linux is now GA. The recommendation is used to identify unhealthy resources and is included in the calculations of your secure score.

We recommend that you use the recommendation to remediate vulnerabilities in your Linux containers. Learn about [recommendation remediation](implement-security-recommendations.md).

### Announcing support for the AWS CIS 1.5.0 compliance standard

Defender for Cloud now supports the CIS Amazon Web Services Foundations v1.5.0 compliance standard. The standard can be [added to your Regulatory Compliance dashboard](update-regulatory-compliance-packages.md#add-a-regulatory-standard-to-your-dashboard), and builds on MDC's existing offerings for multicloud recommendations and standards.

This new standard includes both existing and new recommendations that extend Defender for Cloud's coverage to new AWS services and resources.

Learn how to [Manage AWS assessments and standards](how-to-manage-aws-assessments-standards.md).

### Microsoft Defender for DevOps (preview) is now available in other regions

Microsoft Defender for DevOps has expanded its preview and is now available in the West Europe and East Australia regions, when you onboard your Azure DevOps and GitHub resources.  

Learn more about [Microsoft Defender for DevOps](defender-for-devops-introduction.md).

### The built-in policy \[Preview]: Private endpoint should be configured for Key Vault has been deprecated

The built-in policy [`[Preview]: Private endpoint should be configured for Key Vault`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5f0bc445-3935-4915-9981-011aa2b46147) has been deprecated and has been replaced with the [`[Preview]: Azure Key Vaults should use private link`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6abeaec-4d90-4a02-805f-6b26c4d3fbe9) policy.

Learn more about [integrating Azure Key Vault with Azure Policy](../key-vault/general/azure-policy.md#network-access).

## January 2023

Updates in January include:

- [The Endpoint protection (Microsoft Defender for Endpoint) component is now accessed in the Settings and monitoring page](#the-endpoint-protection-microsoft-defender-for-endpoint-component-is-now-accessed-in-the-settings-and-monitoring-page)
- [New version of the recommendation to find missing system updates (Preview)](#new-version-of-the-recommendation-to-find-missing-system-updates-preview)
- [Cleanup of deleted Azure Arc machines in connected AWS and GCP accounts](#cleanup-of-deleted-azure-arc-machines-in-connected-aws-and-gcp-accounts)
- [Allow continuous export to Event Hubs behind a firewall](#allow-continuous-export-to-event-hubs-behind-a-firewall)
- [The name of the Secure score control Protect your applications with Azure advanced networking solutions has been changed](#the-name-of-the-secure-score-control-protect-your-applications-with-azure-advanced-networking-solutions-has-been-changed)
- [The policy Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports has been deprecated](#the-policy-vulnerability-assessment-settings-for-sql-server-should-contain-an-email-address-to-receive-scan-reports-has-been-deprecated)
- [Recommendation to enable diagnostic logs for Virtual Machine Scale Sets has been deprecated](#recommendation-to-enable-diagnostic-logs-for-virtual-machine-scale-sets-has-been-deprecated)

### The Endpoint protection (Microsoft Defender for Endpoint) component is now accessed in the Settings and monitoring page

In our continuing efforts to simplify your Defender for Cloud configuration experience, we moved the configuration for Endpoint protection (Microsoft Defender for Endpoint) component from the **Environment settings** > **Integrations** page to the **Environment settings** > **Defender plans** > **Settings and monitoring** page, where the other components are managed as well. There's no change to the functionality other than the location in the portal.

Learn more about [enabling Microsoft Defender for Endpoint](integration-defender-for-endpoint.md) on your servers with Defender for Servers.

### New version of the recommendation to find missing system updates (Preview)

You no longer need an agent on your Azure VMs and Azure Arc machines to make sure the machines have all of the latest security or critical system updates.

The new system updates recommendation, `System updates should be installed on your machines (powered by Update management center)` in the `Apply system updates` control, is based on the [Update management center (preview)](../update-center/overview.md). The recommendation relies on a native agent embedded in every Azure VM and Azure Arc machines instead of an installed agent. The Quick Fix in the new recommendation leads you to a one-time installation of the missing updates in the Update management center portal.

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

### The name of the Secure score control Protect your applications with Azure advanced networking solutions has been changed

The secure score control, `Protect your applications with Azure advanced networking solutions` has been changed to `Protect applications against DDoS attacks`.

The updated name is reflected on Azure Resource Graph (ARG), Secure Score Controls API and the `Download CSV report`.

### The policy Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports has been deprecated 

The policy [`Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F057d6cfe-9c4f-4a6d-bc60-14420ea1f1a9) has been deprecated. 

The Defender for SQL vulnerability assessment email report is still available and existing email configurations haven't changed.

### Recommendation to enable diagnostic logs for Virtual Machine Scale Sets has been deprecated

The recommendation `Diagnostic logs in Virtual Machine Scale Sets should be enabled` has been deprecated. 

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
- [The ability to create custom assessments in AWS and GCP (Preview) has been deprecated](#the-ability-to-create-custom-assessments-in-aws-and-gcp-preview-has-been-deprecated)
- [The recommendation to configure dead-letter queues for Lambda functions has been deprecated](#the-recommendation-to-configure-dead-letter-queues-for-lambda-functions-has-been-deprecated)

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

### The ability to create custom assessments in AWS and GCP (Preview) has been deprecated

The ability to create custom assessments for [AWS accounts](how-to-manage-aws-assessments-standards.md) and [GCP projects](how-to-manage-gcp-assessments-standards.md), which was a Preview feature, has been deprecated. 

### The recommendation to configure dead-letter queues for Lambda functions has been deprecated

The recommendation [`Lambda functions should have a dead-letter queue configured`](https://portal.azure.com/#view/Microsoft_Azure_Security/AwsRecommendationDetailsBlade/assessmentKey/dcf10b98-798f-4734-9afd-800916bf1e65/showSecurityCenterCommandBar~/false) has been deprecated.

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
- [Auto-provisioning has been renamed to Settings & monitoring and has an updated experience](#auto-provisioning-has-been-renamed-to-settings--monitoring-and-has-an-updated-experience)
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

Security teams, can now configure pull request annotations to help developers address secret scanning findings in Azure DevOps directly on their pull requests.

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

| Recommendation | Description | Severity | 
|--|--|--|
| (Preview) [Code repositories should have code scanning findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsWithRulesBlade/assessmentKey/c68a8c2a-6ed4-454b-9e37-4b7654f2165f/showSecurityCenterCommandBar~/false) | Defender for DevOps has found vulnerabilities in code repositories. To improve the security posture of the repositories, it's highly recommended to remediate these vulnerabilities. (No related policy) | Medium |
| (Preview) [Code repositories should have secret scanning findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsWithRulesBlade/assessmentKey/4e07c7d0-e06c-47d7-a4a9-8c7b748d1b27/showSecurityCenterCommandBar~/false) | Defender for DevOps has found a secret in code repositories.  This should be remediated immediately to prevent a security breach.  Secrets found in repositories can be leaked or discovered by adversaries, leading to compromise of an application or service. For Azure DevOps, the Microsoft Security DevOps CredScan tool only scans builds on which it has been configured to run. Therefore, results may not reflect the complete status of secrets in your repositories. (No related policy) | High |
| (Preview) [Code repositories should have Dependabot scanning findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/822425e3-827f-4f35-bc33-33749257f851/showSecurityCenterCommandBar~/false) | Defender for DevOps has found vulnerabilities in code repositories. To improve the security posture of the repositories, it's highly recommended to remediate these vulnerabilities. (No related policy) | Medium |
| (Preview) [Code repositories should have infrastructure as code scanning findings resolved](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/2ebc815f-7bc7-4573-994d-e1cc46fb4a35/showSecurityCenterCommandBar~/false) | (Preview) Code repositories should have infrastructure as code scanning findings resolved | Medium |
| (Preview) [GitHub repositories should have code scanning enabled](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/6672df26-ff2e-4282-83c3-e2f20571bd11/showSecurityCenterCommandBar~/false) | GitHub uses code scanning to analyze code in order to find security vulnerabilities and errors in code. Code scanning can be used to find, triage, and prioritize fixes for existing problems in your code. Code scanning can also prevent developers from introducing new problems. Scans can be scheduled for specific days and times, or scans can be triggered when a specific event occurs in the repository, such as a push. If code scanning finds a potential vulnerability or error in code, GitHub displays an alert in the repository. A vulnerability is a problem in a project's code that could be exploited to damage the confidentiality, integrity, or availability of the project. (No related policy) | Medium |
| (Preview) [GitHub repositories should have secret scanning enabled](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/1a600c61-6443-4ab4-bd28-7a6b6fb4691d/showSecurityCenterCommandBar~/false) | GitHub scans repositories for known types of secrets, to prevent fraudulent use of secrets that were accidentally committed to repositories. Secret scanning will scan the entire Git history on all branches present in the GitHub repository for any secrets. Examples of secrets are tokens and private keys that a service provider can issue for authentication. If a secret is checked into a repository, anyone who has read access to the repository can use the secret to access the external service with those privileges. Secrets should be stored in a dedicated, secure location outside the repository for the project. (No related policy) | High |
| (Preview) [GitHub repositories should have Dependabot scanning enabled](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/92643c1f-1a95-4b68-bbd2-5117f92d6e35/showSecurityCenterCommandBar~/false) | GitHub sends Dependabot alerts when it detects vulnerabilities in code dependencies that affect repositories. A vulnerability is a problem in a project's code that could be exploited to damage the confidentiality, integrity, or availability of the project or other projects that use its code. Vulnerabilities vary in type, severity, and method of attack. When code depends on a package that has a security vulnerability, this vulnerable dependency can cause a range of problems. (No related policy) | Medium |

The Defender for DevOps recommendations replaced the deprecated vulnerability scanner for CI/CD workflows that was included in Defender for Containers.

Learn more about [Defender for DevOps](defender-for-devops-introduction.md)

### Regulatory Compliance dashboard now supports manual control management and detailed information on Microsoft's compliance status

The compliance dashboard in Defender for Cloud is a key tool for customers to help them understand and track their compliance status. Customers can continuously monitor environments in accordance with requirements from many different standards and regulations.

Now, you can fully manage your compliance posture by manually attesting to operational and non-technical controls. You can now provide evidence of compliance for controls that aren't automated. Together with the automated assessments, you can now generate a full report of compliance within a selected scope, addressing the entire set of controls for a given standard.

In addition, with richer control information and in-depth details and evidence for Microsoft's compliance status, you now have all of the information required for audits at your fingertips.

Some of the new benefits include:

- **Manual customer actions** provide a mechanism for manually attesting compliance with non-automated controls. Including the ability to link evidence, set a compliance date and expiration date.

- Richer control details for supported standards that showcase **Microsoft actions** and **manual customer actions** in addition to the already existing automated customer actions.

- Microsoft actions provide transparency into Microsoft’s compliance status that includes audit assessment procedures, test results, and Microsoft responses to deviations.

- **Compliance offerings** provide a central location to check Azure, Dynamics 365, and Power Platform products and their respective regulatory compliance certifications.

Learn more on how to [Improve your regulatory compliance](regulatory-compliance-dashboard.md) with Defender for Cloud.

### Auto-provisioning has been renamed to Settings & monitoring and has an updated experience

We've renamed the Auto-provisioning page to **Settings & monitoring**. 

Auto-provisioning was meant to allow at-scale enablement of prerequisites, which are needed by Defender for Cloud's advanced features and capabilities. To better support our expanded capabilities, we're launching a new experience with the following changes: 

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

The MITRE ATT&CK framework has been integrated in three ways:

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

## Next steps

For past changes to Defender for Cloud, see [Archive for what's new in Defender for Cloud?](release-notes-archive.md).
