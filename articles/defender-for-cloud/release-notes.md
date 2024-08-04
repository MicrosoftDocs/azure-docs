---
title: What's new in Microsoft Defender for Cloud features
description: What's new and updated in Microsoft Defender for Cloud features
ms.topic: overview
ms.date: 08/01/2024
---

# What's new in Defender for Cloud features

This article summarizes what's new in Microsoft Defender for Cloud. It includes information about new features in preview or in general availability (GA), feature updates, upcoming feature plans, and deprecated functionality.

<!-- Please don't adjust this next line without getting approval from the Defender for Cloud documentation team. It is necessary for proper RSS functionality. -->
- This page is updated frequently with the latest updates in Defender for Cloud.

- Find the latest information about security recommendations and alerts in [What's new in recommendations and alerts](release-notes-recommendations-alerts.md).
- If you're looking for items older than six months, you can find them in the [What's new archive](release-notes-archive.md).

> [!TIP]
> Get notified when this page is updated by copying and pasting the following URL into your feed reader:
>
> `https://aka.ms/mdc/rss`

<!-- 1. The docs team update this article at the beginning of each month. For example, on August 1 2024 we'll add all the features that were new, updated, and deleted in July 2024.-->
<!-- 2. If you want to add an item in the middle of the month, go ahead and do that. You should add the item and sign off on the PR. We'll check your entry at the beginning of the next month.-->
<!-- 3. In Date, specify the date you added the entry.-->
<!-- 4. In Category, specify whether the item is GA, Preview, Update, Deprecation, Upcoming update, Upcoming deprecation.-->
<!-- 5. Under the relevant month, add a short paragraph about the new feature. Give the paragraph an H3 (###) heading. Keep the title short and not rambling. -->
<!-- 6. In the Update column, add a bookmark to the H3 paragraph that you created (#<bookmark-name>) .-->

## August 2024

|Date | Category | Update|
|--|--|--|
| August 1 | GA | [Enable Microsoft Defender for SQL servers on machines at scale](#enable-microsoft-defender-for-sql-servers-on-machines-at-scale) |

### Enable Microsoft Defender for SQL servers on machines at scale

August 1, 2024

You can now enable Microsoft Defender for SQL servers on machines at scale. This feature allows you to enable Microsoft Defender for SQL on multiple servers at once, saving time and effort. 

Learn how to [enable Microsoft Defender for SQL servers on machines at scale](enable-defender-sql-at-scale.md).

## July 2024

| Date    | Category        | Update                                                       |
| ------- | --------------- | ------------------------------------------------------------ |
| July 31 | GA              | [General availability of enhanced discovery and configuration recommendations for endpoint protection](#general-availability-of-enhanced-discovery-and-configuration-recommendations-for-endpoint-protection) |
| July 31 | Upcoming update | [Adaptive network hardening deprecation](#adaptive-network-hardening-deprecation) |
| July 22 | Preview         | [Security assessments for GitHub no longer requires additional licensing](#preview-security-assessments-for-github-no-longer-requires-additional-licensing) |
| July 18 | Upcoming update | [Updated timelines toward MMA deprecation in Defender for Servers Plan 2](#updated-timelines-toward-mma-deprecation-in-defender-for-servers-plan-2) |
| July 18 | Upcoming update | [Deprecation of MMA-related features as part of agent retirement](#deprecation-of-mma-related-features-as-part-of-agent-retirement) |
| July 15 | Preview         | [Binary Drift Public Preview in Defender for Containers](#binary-drift-public-preview-now-available-in-defender-for-containers) |
| July 14 | GA              | [Automated remediation scripts for AWS and GCP are now GA](#automated-remediation-scripts-for-aws-and-gcp-are-now-ga) |
| July 11 | Upcoming update | [GitHub application permissions update](#github-application-permissions-update) |
| July 10 | GA              | [Compliance standards are now GA](#compliance-standards-are-now-ga) |
| July 9  | Upcoming update | [Inventory experience improvement](#inventory-experience-improvement) |
| July 8  | Upcoming update | [Container mapping tool to run by default in GitHub](#container-mapping-tool-to-run-by-default-in-github) |

### General availability of enhanced discovery and configuration recommendations for endpoint protection

July 31, 2024

Improved discovery features for endpoint protection solutions and enhanced identification of configuration issues are now GA and available for multicloud servers. These updates are included in the Defender for Servers Plan 2 and Defender Cloud Security Posture Management (CSPM).  

The enhanced recommendations feature uses [agentless machine scanning](/azure/defender-for-cloud/concept-agentless-data-collection), enabling comprehensive discovery and assessment of the configuration of [supported endpoint detection and response solutions](/azure/defender-for-cloud/endpoint-detection-response). When configuration issues are identified, remediation steps are provided.  

With this general availability release, the list of [supported solutions](/azure/defender-for-cloud/endpoint-detection-response) is expanded to include two more endpoint detection and response tools:  

- Singularity Platform by SentinelOne  
- Cortex XDR

### Adaptive network hardening deprecation

July 31, 2024

**Estimated date for change: August 31, 2024**

Defender for Server's adaptive network hardening is being deprecated.

The feature deprecation includes the following experiences:

- **Recommendation**: [Adaptive network hardening recommendations should be applied on internet facing virtual machines](recommendations-reference-networking.md#adaptive-network-hardening-recommendations-should-be-applied-on-internet-facing-virtual-machines) [assessment Key: f9f0eed0-f143-47bf-b856-671ea2eeed62]
- **Alert**: [Traffic detected from IP addresses recommended for blocking](alerts-azure-network-layer.md#traffic-detected-from-ip-addresses-recommended-for-blocking)

### Preview: Security assessments for GitHub no longer requires additional licensing

July 22, 2024

GitHub users in Defender for Cloud no longer need a GitHub Advanced Security license to view security findings. This applies to security assessments for code weaknesses, Infrastructure-as-Code (IaC) misconfigurations, and vulnerabilities in container images that are detected during the build phase.

Customers with GitHub Advanced Security will continue to receive additional security assessments in Defender for Cloud for exposed credentials, vulnerabilities in open source dependencies, and CodeQL findings.

To learn more about DevOps security in Defender for Cloud, see the [DevOps Security Overview](defender-for-devops-introduction.md). To learn how to onboard your GitHub environment to Defender for Cloud, follow the [GitHub onboarding guide](quickstart-onboard-github.md). To learn how to configure the Microsoft Security DevOps GitHub Action, see our [GitHub Action](github-action.md) documentation.

### Updated timelines toward MMA deprecation in Defender for Servers Plan 2

July 18, 2024

**Estimated date for change**: August 2024

With the [upcoming deprecation of Log Analytics agent in August](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341), all security value for server protection in Defender for Cloud will rely on integration with Microsoft Defender for Endpoint (MDE) as a single agent and on agentless capabilities provided by the cloud platform and agentless machine scanning.

The following capabilities have updated timelines and plans, thus the support for them over MMA will be extended for Defender for Cloud customers to the end of November 2024:

- **File Integrity Monitoring (FIM):** Public preview release for FIM new version over MDE is planned for **August 2024**. The GA version of FIM powered by Log Analytics agent will continue to be supported for existing customers until the end of **November 2024**.

- **Security Baseline:** as an alternative to the version based on MMA, the current preview version based on Guest Configuration will be released to general availability in **September 2024.** OS Security Baselines powered by Log Analytics agent will continue to be supported for existing customers until the end of **November 2024.**

For more information, see [Prepare for retirement of the Log Analytics agent](prepare-deprecation-log-analytics-mma-agent.md).

### Deprecation of MMA-related features as part of agent retirement

July 18, 2024

**Estimated date for change**: August 2024

As part of the [deprecation of the Microsoft Monitoring Agent (MMA) and the updated Defender for Servers deployment strategy](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341), all security features for Defender for Servers will now be provided through a single agent (Defender for Endpoint), or via agentless scanning capabilities. This won't require dependence on either the MMA or Azure Monitoring Agent (AMA).

As we approach the agent's retirement in August 2024, the following MMA-related features will be removed from the Defender for Cloud portal:

- Display of MMA installation status on the **Inventory** and **Resource Health** blades.
- [The capability](quickstart-onboard-machines.md#connect-on-premises-machines-by-using-the-azure-portal) to onboard new non-Azure servers to Defender for Servers via Log Analytics workspaces will be removed from both the **Inventory** and **Getting Started** blades.  

> [!NOTE]
> We recommend that current customers, who have onboarded on-premises servers using the [legacy approach](quickstart-onboard-machines.md#connect-on-premises-machines-by-using-the-azure-portal), should now connect these machines via Azure Arc-enabled servers.  We  also recommend enabling the Defender for Servers Plan 2 on the Azure subscriptions to which these servers are connected.
>
>For those customers who have selectively enabled Defender for Servers Plan 2 on specific Azure VMs through the [legacy approach](quickstart-onboard-machines.md#connect-on-premises-machines-by-using-the-azure-portal), we recommend enabling the Defender for Servers Plan 2 on the Azure subscriptions of these machines. You can then exclude individual machines from the Defender for Servers coverage using the Defender for Servers [per-resource configuration](tutorial-enable-servers-plan.md#enable-defender-for-servers-at-the-resource-level).
>
> These steps will ensure there is no loss of security coverage due to the retirement of the Log Analytics agent.

To maintain security continuity, we advise customers with Defender for Servers Plan 2 to enable [agentless machine scanning](enable-agentless-scanning-vms.md) and [integration with Microsoft Defender for Endpoint](enable-defender-for-endpoint.md) on their subscriptions.

You can use [this custom workbook](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Workbooks/Defender%20for%20Servers%20Deployment%20Status) to keep track of your Log Analytics Agent (MMA) estate and monitor the deployment status of Defender for Servers across Azure VMs and Azure Arc machines.

For more information, see [Prepare for retirement of the Log Analytics agent](prepare-deprecation-log-analytics-mma-agent.md).

### Binary Drift public preview now available in Defender for Containers

We are introducing the public preview of Binary Drift for Defender for Containers. This feature aids in identifying and mitigating potential security risks associated with unauthorized binaries in your containers. Binary Drift autonomously identifies and sends alerts about potentially harmful binary processes within your containers. Furthermore, it allows the implementation of a new Binary Drift Policy to control alert preferences, offering the ability to tailor notifications to specific security needs.
For more information about this feature, see [Binary Drift Detection](binary-drift-detection.md)

### Automated remediation scripts for AWS and GCP are now GA

July 14, 2024

In March, we released automated remediation scripts for AWS & GCP to Public Preview, that allows you to remediate recommendations for AWS & GCP at scale programmatically.

Today we are releasing this feature to  generally available (GA). [Learn how to use automated remediation scripts](/azure/defender-for-cloud/implement-security-recommendations)>

### GitHub application permissions update

July 11, 2024

**Estimated date for change**: July 18, 2024

DevOps security in Defender for Cloud is constantly making updates that require customers with GitHub connectors in Defender for Cloud to update the permissions for the Microsoft Security DevOps application in GitHub.

As part of this update, the GitHub application will require GitHub Copilot Business read permissions. This permission will be used to help customers better secure their GitHub Copilot deployments. We suggest updating the application as soon as possible.

Permissions can be granted in two different ways:

1. In your GitHub organization, navigate to the Microsoft Security DevOps application within **Settings > GitHub Apps** and accept the permissions request.

1. In an automated email from GitHub Support, select **Review permission request** to accept or reject this change.

### Compliance standards are now GA

July 10, 2024

In March, we added preview versions of many new compliance standards for customers to validate their AWS and GCP resources against.

Those standards included CIS Google Kubernetes Engine (GKE) Benchmark, ISO/IEC 27001 and ISO/IEC 27002, CRI Profile, CSA Cloud Controls Matrix (CCM), Brazilian General Personal Data Protection Law (LGPD), California Consumer Privacy Act (CCPA), and more.

Those preview standards are now generally available (GA).

Check out the [full list of supported compliance standards](concept-regulatory-compliance-standards.md#available-compliance-standards)

### Inventory experience improvement

July 9, 2024

**Estimated date for change**: July 11, 2024

The inventory experience will be updated to improve performance, including improvements to the blade's 'Open query' query logic in Azure Resource Graph. Updates to the logic behind Azure resource calculation may result in additional resources counted and presented.

### Container mapping tool to run by default in GitHub

July 8, 2024

**Estimated date for change**: August 12, 2024

With DevOps security capabilities in Microsoft Defender Cloud Security Posture Management (CSPM), you can map your cloud-native applications from code to cloud to easily kick off developer remediation workflows and reduce the time to remediation of vulnerabilities in your container images. Currently, you must manually configure the container image mapping tool to run in the Microsoft Security DevOps action in GitHub. With this change, container mapping will run by default as part of the Microsoft Security DevOps action. [Learn more about the Microsoft Security DevOps action](https://github.com/microsoft/security-devops-action/blob/main/README.md#advanced).

## June 2024

| Date    | Category             | Update                                                       |
| ------- | -------------------- | ------------------------------------------------------------ |
| June 27 | GA                   | [Checkov IaC Scanning in Defender for Cloud](#ga-checkov-iac-scanning-in-defender-for-cloud). |
| June 24 | Update               | [Change in pricing for multicloud Defender for Containers](#update-change-in-pricing-for-defender-for-containers-in-multicloud) |
| June 20 | Upcoming deprecation | [Reminder of deprecation for adaptive recommendations at Microsoft Monitoring Agent (MMA) deprecation](#deprecation-reminder-of-deprecation-for-adaptive-recommendations).<br/><br/> Estimated deprecation August 2024. |
| June 10 | Preview              | [Copilot for Security in Defender for Cloud](#preview-copilot-for-security-in-defender-for-cloud) |
| June 10 | Upcoming update      | [SQL vulnerability assessment automatic enablement using express configuration on unconfigured servers](#update-sql-vulnerability-assessment-automatic-enablement).<br/><br/> Estimated update: July 10, 2024. |
| June 3  | Upcoming update      | [Changes in identity recommendations behavior](#update-changes-in-identity-recommendations-behavior)<br/><br/> Estimated update: July 10 2024. |

### GA: Checkov IaC Scanning in Defender for Cloud

June 27, 2024

We are announcing the general availability of the Checkov integration for Infrastructure-as-Code (IaC) scanning through [MSDO](azure-devops-extension.yml). As part of this release, Checkov will replace TerraScan as a default IaC analyzer that runs as part of the MSDO CLI. TerraScan may still be configured manually through MSDO's [environment variables](https://github.com/microsoft/security-devops-azdevops/wiki) but will not run by default.

Security findings from Checkov present as recommendations for both Azure DevOps and GitHub repositories under the assessments "Azure DevOps repositories should have infrastructure as code findings resolved" and "GitHub repositories should have infrastructure as code findings resolved".

To learn more about DevOps security in Defender for Cloud, see the [DevOps Security Overview](defender-for-devops-introduction.md). To learn how to configure the MSDO CLI, see the [Azure DevOps](azure-devops-extension.yml) or [GitHub](github-action.md) documentation.

### Update: Change in pricing for Defender for Containers in multicloud

June 24, 2024

Since Defender for Containers in multicloud is now generally available, it's no longer free of charge. For more information, see [Microsoft Defender for Cloud pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

### Deprecation: Reminder of deprecation for adaptive recommendations

June 20, 2024

**Estimated date for change**: August, 2024

As part of the [MMA deprecation and the Defender for Servers updated deployment strategy](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341), Defender for Servers security features will be provided through the Microsoft Defender for Endpoint (MDE) agent, or through the [agentless scanning capabilities](enable-agentless-scanning-vms.md). Both of these options won't depend on either the MMA or Azure Monitoring Agent (AMA).

Adaptive Security Recommendations, known as Adaptive Application Controls and Adaptive Network Hardening, will be discontinued. The current GA version based on the MMA and the preview version based on the AMA will be deprecated in August 2024.

### Preview: Copilot for Security in Defender for Cloud

June 10, 2024

We're announcing the integration of Microsoft Copilot for Security into Defender for Cloud in public preview. Copilot's embedded experience in Defender for Cloud provides users with the ability to ask questions and get answers in natural language. Copilot can help you understand the context of a recommendation, the effect of implementing a recommendation, the steps needed to take to implement a recommendation, assist with the delegation of recommendations, and assist with the remediation of misconfigurations in code.

Learn more about [Copilot for Security in Defender for Cloud](copilot-security-in-defender-for-cloud.md).

### Update: SQL vulnerability assessment automatic enablement

June 10, 2024

**Estimated date for change**: July 10, 2024

Originally, SQL Vulnerability Assessment (VA) with Express Configuration was only automatically enabled on servers where Microsoft Defender for SQL was activated after the introduction of Express Configuration in December 2022.

We will be updating all Azure SQL Servers that had Microsoft Defender for SQL activated before December 2022 and had no existing SQL VA policy in place, to have SQL Vulnerability Assessment (SQL VA) automatically enabled with Express Configuration.

- The implementation of this change will be gradual, spanning several weeks, and does not require any action on the user’s part.
- This change applies to Azure SQL Servers where Microsoft Defender for SQL was activated at the Azure subscription level.
- Servers with an existing classic configuration (whether valid or invalid) will not be affected by this change.
- Upon activation, the recommendation ‘SQL databases should have vulnerability findings resolved’ may appear and could potentially impact your secure score.

### Update: Changes in identity recommendations behavior

June 3, 2024

**Estimated date for change**: July 2024

These changes:

- The assessed resource will become the identity instead of the subscription
- The recommendations won't have 'sub-recommendations' anymore
- The value of the 'assessmentKey' field in the API will be changed for those recommendations

Will be applied to the following recommendations:

- Accounts with owner permissions on Azure resources should be MFA enabled
- Accounts with write permissions on Azure resources should be MFA enabled
- Accounts with read permissions on Azure resources should be MFA enabled
- Guest accounts with owner permissions on Azure resources should be removed
- Guest accounts with write permissions on Azure resources should be removed
- Guest accounts with read permissions on Azure resources should be removed
- Blocked accounts with owner permissions on Azure resources should be removed
- Blocked accounts with read and write permissions on Azure resources should be removed
- A maximum of 3 owners should be designated for your subscription
- There should be more than one owner assigned to your subscription

## May 2024

|Date|Category|Update |
|--|--|--|
| May 30 | GA | [Agentless malware detection in Defender for Servers Plan 2](#ga-agentless-malware-detection-in-defender-for-servers-plan-2) |
| May 22 | Update |[Configure email notifications for attack paths](#update-configure-email-notifications-for-attack-paths) |
| May 21 | Update |[Advanced hunting in Microsoft Defender XDR includes Defender for Cloud alerts and incidents](#update-advanced-hunting-in-microsoft-defender-xdr-includes-defender-for-cloud-alerts-and-incidents) |
| May 9 | Preview | [Checkov integration for IaC scanning in Defender for Cloud](#preview-checkov-integration-for-iac-scanning-in-defender-for-cloud) |
| May 7 | GA | [Permissions management in Defender for Cloud](#ga-permissions-management-in-defender-for-cloud) |
| May 6 | Preview | [AI multicloud security posture management is available for Azure and AWS](#preview-ai-multicloud-security-posture-management). |
| May 6 | Limited preview | [Threat protection for AI workloads in Azure](#limited-preview-threat-protection-for-ai-workloads-in-azure). |
| May 2 | Update |[Security policy management](#ga-security-policy-management). |
| May 1 | Preview | [Defender for open-source databases is now available on AWS for Amazon instances](#preview-defender-for-open-source-databases-available-in-aws). |
| May 1 | Upcoming deprecation |[Removal of FIM over AMA and release of new version over Defender for Endpoint](#deprecation-removal-of-fim-with-ama).<br/><br/> Estimated Deprecation August 2024. |

### GA: Agentless malware detection in Defender for Servers Plan 2

May 30, 2024

Defender for Cloud's agentless malware detection for Azure VMs, AWS EC2 instances, and GCP VM instances is now generally available as a new feature in [Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features).

Agentless malware detection uses the [Microsoft Defender Antivirus](/microsoft-365/security/defender-endpoint/microsoft-defender-antivirus-windows) anti-malware engine to scan and detect malicious files. Detected threats trigger security alerts directly into Defender for Cloud and Defender XDR, where they can be investigated and remediated. Learn more about [agentless malware scanning](agentless-malware-scanning.md) for servers and [agentless scanning for VMs](concept-agentless-data-collection.md).

### Update: Configure email notifications for attack paths

May 22, 2024

You can now configure email notifications when an attack path is detected with a specified risk level or higher.
Learn how to [configure email notifications](configure-email-notifications.md).

### Update: Advanced hunting in Microsoft Defender XDR includes Defender for Cloud alerts and incidents

May 21, 2024

Defender for Cloud's alerts and incidents are now integrated with Microsoft Defender XDR and can be accessed in the Microsoft Defender Portal. This integration provides richer context to investigations that span cloud resources, devices, and identities. Learn about [advanced hunting in XDR integration](concept-integration-365.md#advanced-hunting-in-xdr).

### Preview: Checkov integration for IaC scanning in Defender for Cloud

May 9, 2024

Checkov integration for DevOps security in Defender for Cloud is now in preview. This integration improves both the quality and total number of Infrastructure-as-Code checks run by the MSDO CLI when scanning IaC templates.

While in preview, Checkov must be explicitly invoked through the 'tools' input parameter for the MSDO CLI.

Learn more about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md) and configuring the MSDO CLI for [Azure DevOps](azure-devops-extension.yml) and [GitHub](github-action.md).

### GA: Permissions management in Defender for Cloud

May 7, 2024

[Permissions management](permissions-management.md) is now generally available in Defender for Cloud.

### Preview: AI multicloud security posture management

May 6, 2024

 AI security posture management is available in preview in Defender for Cloud. It provides AI security posture management capabilities for Azure and AWS, to enhance the security of your AI pipelines and services.

Learn more about [AI security posture management](ai-security-posture.md).

### Limited preview: Threat protection for AI workloads in Azure

May 6, 2024

Threat protection for AI workloads in Defender for Cloud is available in limited preview. This plan helps you monitor your Azure OpenAI powered applications in runtime for malicious activity, identify, and remediate security risks. It provides contextual insights into AI workload threat protection, integrating with [Responsible AI](../ai-services/responsible-use-of-ai-overview.md) and Microsoft Threat Intelligence. Relevant security alerts are integrated into the Defender portal.

Learn more about [threat protection for AI workloads](ai-threat-protection.md).

### GA: Security policy management

May 2, 2024

Security policy management across clouds (Azure, AWS, GCP) is now generally available. This enables security teams to manage their security policies in a consistent way and with new features

Learn more about [security policies in Microsoft Defender for Cloud](security-policy-concept.md#working-with-security-standards).

### Preview: Defender for open-source databases available in AWS

May 1, 2024

Defender for open-source databases on AWS is now available in preview. It adds support for various types of Amazon Relational Database Service (RDS) instance types.

Learn more about [Defender for open-source databases](defender-for-databases-introduction.md) and how to [enable Defender for open-source databases on AWS](enable-defender-for-databases-aws.md).

### Deprecation: Removal of FIM (with AMA)

May 1, 2024

**Estimated date for change**: August 2024

As part of the [MMA deprecation and the Defender for Servers updated deployment strategy](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341), all Defender for Servers security features will be provided via a single agent (MDE), or via agentless scanning capabilities, and without dependency on either the MMA or AMA.

The new version of File Integrity Monitoring (FIM) over Microsoft Defender for Endpoint (MDE) allows you to meet compliance requirements by monitoring critical files and registries in real-time, auditing changes, and detecting suspicious file content alterations.

As part of this release, FIM experience over AMA will no longer be available through the Defender for Cloud portal beginning August 2024. For more information, see [File Integrity Monitoring experience - changes and migration guidance](prepare-deprecation-log-analytics-mma-agent.md#file-integrity-monitoring-experience---changes-and-migration-guidance).

## April 2024

|Date| Category | Update |
|--|--|--|
| April 16 | Upcoming update | [Change in CIEM assessment IDs](#update-change-in-ciem-assessment-ids).<br/><br/> Estimated update: May 2024. |
| April 15 | GA | [Defender for Containers is now available for AWS and GCP](#ga-defender-for-containers-for-aws-and-gcp). |
| April 3 | Update | [Risk prioritization is now the default experience in Defender for Cloud](#update-risk-prioritization) |
| April 3 | Update | [Defender for open-source relational databases updates](#update-defender-for-open-source-relational-databases-updates). |

### Update: Change in CIEM assessment IDs

April 16, 2024

**Estimated date for change**: May 2024

The following recommendations are scheduled for remodeling, which will result in changes to their assessment IDs:

- `Azure overprovisioned identities should have only the necessary permissions`
- `AWS Overprovisioned identities should have only the necessary permissions`
- `GCP overprovisioned identities should have only the necessary permissions`
- `Super identities in your Azure environment should be removed`
- `Unused identities in your Azure environment should be removed`

### GA: Defender for Containers for AWS and GCP

April 15, 2024

Runtime threat detection and agentless discovery for AWS and GCP in Defender for Containers are now generally available. In addition, there's a new authentication capability in AWS which simplifies provisioning.

Learn more about [containers support matrix in Defender for Cloud](support-matrix-defender-for-containers.md) and how to [configure Defender for Containers components](/azure/defender-for-cloud/defender-for-containers-enable?branch=pr-en-us-269845&tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api&pivots=defender-for-container-eks#deploying-the-defender-sensor).

### Update: Risk prioritization

April 3, 2024

Risk prioritization is now the default experience in Defender for Cloud. This feature helps you to focus on the most critical security issues in your environment by prioritizing recommendations based on the risk factors of each resource. The risk factors include the potential impact of the security issue being breached, the categories of risk, and the attack path that the security issue is part of. Learn more about [risk prioritization](risk-prioritization.md).

### Update: Defender for Open-Source Relational Databases

April 3, 2024

- **Defender for PostgreSQL Flexible Servers post-GA updates** - The update enables customers to enforce protection for existing PostgreSQL flexible servers at the subscription level, allowing complete flexibility to enable protection on a per-resource basis or for automatic protection of all resources at the subscription level.
- **Defender for MySQL Flexible Servers Availability and GA** - Defender for Cloud expanded its support for Azure open-source relational databases by incorporating MySQL Flexible Servers.

This release includes:

- Alert compatibility with existing alerts for Defender for MySQL Single Servers.
- Enablement of individual resources.
- Enablement at the subscription level.
- Updates for Azure Database for MySQL flexible servers are rolling out over the next few weeks. If you see the error `The server <servername> is not compatible with Advanced Threat Protection`, you can either wait for the update, or open a support ticket to update the server sooner to a supported version.

If you're already protecting your subscription with Defender for open-source relational databases, your flexible server resources are automatically enabled, protected, and billed. Specific billing notifications have been sent via email for affected subscriptions.

Learn more about [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).

## March 2024

|Date| Category | Update |
|--|--|--|
| March 31 | GA | [Windows container images scanning](#ga-windows-container-images-scanning) |
| March 25 | Update  |[Continuous export now includes attack path data](#update-continuous-export-now-includes-attack-path-data) |
| March 21 | Preview | [Agentless scanning supports CMK encrypted VMs in Azure](#preview-agentless-scanning-supports-cmk-encrypted-vms-in-azure) |
| March 17 | Preview | [Custom recommendations based on KQL for Azure](#preview-custom-recommendations-based-on-kql-for-azure). |
| March 13 | Update |[Inclusion of DevOps recommendations in the Microsoft cloud security benchmark](#update-inclusion-of-devops-recommendations-in-the-microsoft-cloud-security-benchmark) |
| March 13 | GA | [ServiceNow integration](#ga-servicenow-integration-is-now-generally-available). |
| March 13 | Preview | [Critical assets protection in Microsoft Defender for Cloud](#preview-critical-assets-protection-in-microsoft-defender-for-cloud). |
| March 12 | Update |[Enhanced AWS and GCP recommendations with automated remediation scripts](#update-enhanced-aws-and-gcp-recommendations-with-automated-remediation-scripts) |
| March 6 | Preview | [Compliance standards added to compliance dashboard](#preview-compliance-standards-added-to-compliance-dashboard)  |
| March 6 | Upcoming update |[Defender for open-source relational databases updates](#update-defender-for-open-source-relational-databases-updates)<br/><br/> Expected: April, 2024 |
| March 3 | Upcoming update |[Changes in where you access Compliance offerings and Microsoft Actions](#update-changes-to-compliance-offerings-and-microsoft-actions-settings)<br/><br/> Expected: September 2025 |
| March 3 | Deprecation | [Defender for Cloud Containers Vulnerability Assessment powered by Qualys retirement](#deprecation-defender-for-cloud-containers-vulnerability-assessment-powered-by-qualys-retirement) |
| March 3 | Upcoming update |[Changes in where you access Compliance offerings and Microsoft Actions](#update-changes-in-where-you-access-compliance-offerings-and-microsoft-actions).<br/><br/> Estimated deprecation: September 30, 2025. |

### GA: Windows container images scanning

March 31, 2024

We're announcing the general availability (GA) of the Windows container images support for scanning by Defender for Containers.

### Update: Continuous export now includes attack path data

March 25, 2024

We're announcing that continuous export now includes attack path data. This feature allows you to stream security data to Log Analytics in Azure Monitor, to Azure Event Hubs, or to another Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), or IT classic deployment model solution.

Learn more about [continuous export](benefits-of-continuous-export.md).

### Preview: Agentless scanning supports CMK encrypted VMs in Azure

March 21, 2024

Until now agentless scanning covered CMK encrypted VMs in AWS and GCP. With this release, we're completing support for Azure as well. The capability employs a unique scanning approach for CMK in Azure:

- Defender for Cloud doesn't handle the key or decryption process. Keys and decryption are seamlessly handled by Azure Compute and is transparent to Defender for Cloud's agentless scanning service.
- The unencrypted VM disk data is never copied or re-encrypted with another key.
- The original key isn't replicated during the process. Purging it eradicates the data on both your production VM and Defender for Cloud’s temporary snapshot.

During public preview this capability isn't automatically enabled. If you're using Defender for Servers P2 or Defender CSPM and your environment has VMs with CMK encrypted disks, you can now have them scanned for vulnerabilities, secrets, and malware following these [enablement steps](enable-agentless-scanning-vms.md#agentless-vulnerability-assessment-on-azure).

- [Learn more on agentless scanning for VMs](concept-agentless-data-collection.md)
- [Learn more on agentless scanning permissions](faq-permissions.yml#which-permissions-are-used-by-agentless-scanning-)

### Preview: Custom recommendations based on KQL for Azure

March 17, 2024

Custom recommendations based on KQL for Azure are now in public preview, and supported for all clouds. For more information, see [Create custom security standards and recommendations](create-custom-recommendations.md).

### Update: Inclusion of DevOps recommendations in the Microsoft cloud security benchmark

March 13, 2024

Today, we are announcing that you can now monitor your DevOps security and compliance posture in the [Microsoft cloud security benchmark](concept-regulatory-compliance.md) (MCSB) in addition to Azure, AWS, and GCP. DevOps assessments are part of the DevOps Security control in the MCSB.

The MCSB is a framework that defines fundamental cloud security principles based on common industry standards and compliance frameworks. MCSB provides prescriptive details for how to implement its cloud-agnostic security recommendations.

Learn more about the [DevOps recommendations](recommendations-reference-devops.md) that will be included and the [Microsoft cloud security benchmark](concept-regulatory-compliance.md).

### GA: ServiceNow integration is now generally available

March 12, 2024

We're announcing the general availability (GA) of the [ServiceNow integration](integration-servicenow.md).

### Preview: Critical assets protection in Microsoft Defender for Cloud

March 12, 2024

Defender for Cloud now includes a business criticality feature, using Microsoft Security Exposure Management’s critical assets engine, to identify and protect important assets through risk prioritization, attack path analysis, and cloud security explorer. For more information, see [Critical assets protection in Microsoft Defender for Cloud (Preview)](critical-assets-protection.md).

### Update: Enhanced AWS and GCP recommendations with automated remediation scripts

March 12, 2024

We're enhancing the AWS and GCP recommendations with automated remediation scripts that allow you to remediate them programmatically and at scale.
Learn more about [automated remediation scripts](implement-security-recommendations.md#use-the-automated-remediation-scripts).

### Preview: Compliance standards added to compliance dashboard

March 6, 2024

Based on customer feedback, we've added compliance standards in preview to Defender for Cloud.

Check out the [full list of supported compliance standards](concept-regulatory-compliance-standards.md#available-compliance-standards)

We are continuously working on adding and updating new standards for Azure, AWS, and GCP environments.

Learn how to [assign a security standard](update-regulatory-compliance-packages.yml).

### Update: Defender for open-source relational databases updates

March 6, 2024**

**Estimated date for change**: April, 2024

**Defender for PostgreSQL Flexible Servers post-GA updates** - The update enables customers to enforce protection for existing PostgreSQL flexible servers at the subscription level, allowing complete flexibility to enable protection on a per-resource basis or for automatic protection of all resources at the subscription level.

**Defender for MySQL Flexible Servers Availability and GA** - Defender for Cloud is set to expand its support for Azure open-source relational databases by incorporating MySQL Flexible Servers.
This release will include:

- Alert compatibility with existing alerts for Defender for MySQL Single Servers.
- Enablement of individual resources.
- Enablement at the subscription level.

If you're already protecting your subscription with Defender for open-source relational databases, your flexible server resources are automatically enabled, protected, and billed.
Specific billing notifications have been sent via email for affected subscriptions.

Learn more about [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).

### Update: Changes to Compliance Offerings and Microsoft Actions settings

March 3, 2024

**Estimated date for change**: September 30, 2025

On September 30, 2025, the locations where you access two preview features, Compliance offering and Microsoft Actions, will change.

The table that lists the compliance status of Microsoft's products (accessed from the **Compliance offerings** button in the toolbar of Defender's [regulatory compliance dashboard](regulatory-compliance-dashboard.md)). After this button is removed from Defender for Cloud, you'll still be able to access this information using the [Service Trust Portal](https://servicetrust.microsoft.com/).

For a subset of controls, Microsoft Actions was accessible from the **Microsoft Actions (Preview)** button in the controls details pane. After this button is removed, you can view Microsoft Actions by visiting Microsoft’s [Service Trust Portal for FedRAMP](https://servicetrust.microsoft.com/viewpage/FedRAMP) and accessing  the Azure System Security Plan document.

### Update: Changes in where you access Compliance offerings and Microsoft Actions

March 3, 2024**

**Estimated date for change**: September 2025

On September 30, 2025, the locations where you access two preview features, Compliance offering and Microsoft Actions, will change.

The table that lists the compliance status of Microsoft's products (accessed from the **Compliance offerings** button in the toolbar of Defender's [regulatory compliance dashboard](regulatory-compliance-dashboard.md)). After this button is removed from Defender for Cloud, you'll still be able to access this information using the [Service Trust Portal](https://servicetrust.microsoft.com/).

For a subset of controls, Microsoft Actions was accessible from the **Microsoft Actions (Preview)** button in the controls details pane. After this button is removed, you can view Microsoft Actions by visiting Microsoft’s [Service Trust Portal for FedRAMP](https://servicetrust.microsoft.com/viewpage/FedRAMP) and accessing  the Azure System Security Plan document.

### Deprecation: Defender for Cloud Containers Vulnerability Assessment powered by Qualys retirement

March 3, 2024

The Defender for Cloud Containers Vulnerability Assessment powered by Qualys is being retired. The retirement will be completed by March 6, and until that time partial results may still appear both in the Qualys recommendations, and Qualys results in the security graph. Any customers who were previously using this assessment should upgrade to [Vulnerability assessments for Azure with Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-azure.md). For information about transitioning to the container vulnerability assessment offering powered by Microsoft Defender Vulnerability Management, see [Transition from Qualys to Microsoft Defender Vulnerability Management](transition-to-defender-vulnerability-management.md).

## February 2024

|Date|Category|Update|
|--|--|--|
| February 28 | Deprecation |[Microsoft Security Code Analysis (MSCA) is no longer operational](#deprecation-microsoft-security-code-analysis-msca-is-no-longer-operational). |
| February 28 | Update |[Updated security policy management expands support to AWS and GCP](#update-security-policy-management-expands-support-to-aws-and-gcp). |
| February 26 | Update |[Cloud support for Defender for Containers](#update-cloud-support-for-defender-for-containers) |
| February 20 | Update |[New version of Defender sensor for Defender for Containers](#update-new-version-of-defender-sensor-for-defender-for-containers) |
| February 18| Update |[Open Container Initiative (OCI) image format specification support](#update-open-container-initiative-oci-image-format-specification-support) |
| February 13 | Deprecation |[AWS container vulnerability assessment powered by Trivy retired](#deprecation-aws-container-vulnerability-assessment-powered-by-trivy-retired). |
| February 5 | Upcoming update |[Decommissioning of Microsoft.SecurityDevOps resource provider](#update-decommissioning-of-microsoftsecuritydevops-resource-provider)<br/><br/>Expected: March 6, 2024 |

### Deprecation: Microsoft Security Code Analysis (MSCA) is no longer operational

February 28, 2024

In February 2021, the deprecation of the MSCA task was communicated to all customers and has been past end of life support since [March 2022](https://devblogs.microsoft.com/premier-developer/microsoft-security-code-analysis/). As of February 26, 2024, MSCA is officially no longer operational.

Customers can get the latest DevOps security tooling from Defender for Cloud through [Microsoft Security DevOps](azure-devops-extension.yml) and more security tooling through [GitHub Advanced Security for Azure DevOps](https://azure.microsoft.com/products/devops/github-advanced-security).

### Update: Security policy management expands support to AWS and GCP

February 28, 2024

The updated experience for managing security policies, initially released in Preview for Azure, is expanding its support to cross cloud (AWS and GCP) environments. This Preview release includes:

- Managing [regulatory compliance standards](update-regulatory-compliance-packages.yml) in Defender for Cloud across Azure, AWS, and GCP environments.
- Same cross cloud interface experience for creating and managing [Microsoft Cloud Security Benchmark(MCSB) custom recommendations](manage-mcsb.md).
- The updated experience is applied to AWS and GCP for [creating custom recommendations with a KQL query](create-custom-recommendations.md).

### Update: Cloud support for Defender for Containers

February 26, 2024

Azure Kubernetes Service (AKS) threat detection features in Defender for Containers are now fully supported in commercial, Azure Government, and Azure China 21Vianet clouds. [Review](support-matrix-defender-for-containers.md#azure) supported features.

### Update: New version of Defender sensor for Defender for Containers

February 20, 2024

[A new version](/azure/aks/supported-kubernetes-versions#aks-kubernetes-release-calendar) of the [Defender sensor for Defender for Containers](tutorial-enable-containers-azure.md#deploy-the-defender-sensor-in-azure) is available. It includes performance and security improvements, support for both AMD64 and ARM64 arch nodes (Linux only), and uses [Inspektor Gadget](https://www.inspektor-gadget.io/) as the process collection agent instead of Sysdig. The new version is only supported on Linux kernel versions 5.4 and higher, so if you have older versions of the Linux kernel, you need to upgrade. Support for ARM64 is only available from AKS V1.29 and above. For more information, see [Supported host operating systems](support-matrix-defender-for-containers.md#supported-host-operating-systems).

### Update: Open Container Initiative (OCI) image format specification support

February 18, 2024

The [Open Container Initiative (OCI)](https://github.com/opencontainers/image-spec/blob/main/spec.md) image format specification is now supported by vulnerability assessment, powered by Microsoft Defender Vulnerability Management for AWS, Azure & GCP clouds.

### Deprecation: AWS container vulnerability assessment powered by Trivy retired

February 13, 2024

The container vulnerability assessment powered by Trivy has been retired. Any customers who were previously using this assessment should upgrade to the new [AWS container vulnerability assessment powered by Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-aws.md). For instructions on how to upgrade, see [How do I upgrade from the retired Trivy vulnerability assessment to the AWS vulnerability assessment powered by Microsoft Defender Vulnerability Management?](faq-defender-for-containers.yml#how-do-i-upgrade-from-the-retired-trivy-vulnerability-assessment-to-the-aws-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-)

### Update: Decommissioning of Microsoft.SecurityDevOps resource provider

February 5, 2024

**Estimated date for change**: March 6, 2024

Microsoft Defender for Cloud is decommissioning the resource provider `Microsoft.SecurityDevOps` that was used during public preview of DevOps security, having migrated to the existing `Microsoft.Security` provider. The reason for the change is to improve customer experiences by reducing the number of resource providers associated with DevOps connectors.

Customers that are still using the API version **2022-09-01-preview** under `Microsoft.SecurityDevOps` to query Defender for Cloud DevOps security data will be impacted. To avoid disruption to their service, customer will need to update to the new API version **2023-09-01-preview** under the `Microsoft.Security` provider.

Customers currently using Defender for Cloud DevOps security from Azure portal won't be impacted.

For details on the new API version, see [Microsoft Defender for Cloud REST APIs](/rest/api/defenderforcloud/operation-groups).

## Next steps

Check [What's new in security recommendations and alerts](release-notes-recommendations-alerts.md).
