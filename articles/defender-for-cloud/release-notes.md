---
title: Release notes
description: This page is updated frequently with the latest updates in Defender for Cloud.
ms.topic: overview
ms.date: 11/14/2023
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

## November 2023

| Date | Update |
|--|--|
| November 15 | [Defender for Cloud is now integrated with Microsoft 365 Defender](#defender-for-cloud-is-now-integrated-with-microsoft-365-defender) |
| November 15 | [General availability of Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM) in Defender for Containers and Defender for Container Registries](#general-availability-of-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-mdvm-in-defender-for-containers-and-defender-for-container-registries) |
| November 15 | [Change to Container Vulnerability Assessments recommendation names](#change-to-container-vulnerability-assessments-recommendation-names) |
| November 15 | [Risk prioritization is now available for recommendations](#risk-prioritization-is-now-available-for-recommendations) |
| November 15 | [Attack path analysis new engine and extensive enhancements](#attack-path-analysis-new-engine-and-extensive-enhancements) |
| November 15 | [Changes to Attack Path's Azure Resource Graph table scheme](#changes-to-attack-paths-azure-resource-graph-table-scheme) |
| November 15 | [General Availability release of GCP support in Defender CSPM](#general-availability-release-of-gcp-support-in-defender-cspm) |
| November 15 | [General Availability release of Data security dashboard](#general-availability-release-of-data-security-dashboard) |
| November 15 | [General Availability release of sensitive data discovery for databases](#general-availability-release-of-sensitive-data-discovery-for-databases) |
| November 6 | [New version of the recommendation to find missing system updates is now GA](#new-version-of-the-recommendation-to-find-missing-system-updates-is-now-ga) |

### Defender for Cloud is now integrated with Microsoft 365 Defender

November 15, 2023

Businesses can protect their cloud resources and devices with the new integration between Microsoft Defender for Cloud and Microsoft 365 Defender. This integration connects the dots between cloud resources, devices, and identities, which previously required multiple experiences. 

The integration also brings competitive cloud protection capabilities into the Security Operations Center (SOC) day-to-day. With XDR as their single pane of glass, SOC teams can easily discover attacks that combine detections from multiple pillars, including Cloud, Endpoint, Identity, Office 365, and more.

Some of the key benefits include:

- **One easy-to-use interface for SOC teams**: With Defender for Cloud's alerts and cloud correlations integrated into M365D, SOC teams can now access all security information from a single interface, significantly improving operational efficiency.

- **One attack story**: Customers are able to understand the complete attack story, including their cloud environment, by using prebuilt correlations that combine security alerts from multiple sources.

- **New cloud entities in Microsoft 365 Defender**: Microsoft 365 Defender now supports new cloud entities that are unique to Microsoft Defender for Cloud, such as cloud resources. Customers can match Virtual Machine (VM) entities to device entities, providing a unified view of all relevant information about a machine, including alerts and incidents that were triggered on it.

- **Unified API for Microsoft Security products**: Customers can now export their security alerts data into their systems of choice using a single API, as Microsoft Defender for Cloud alerts and incidents are now part of Microsoft 365 Defender's public API.

The integration between Defender for Cloud and Microsoft 365 Defender is available to all new and existing Defender for Cloud customers.

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
|Running container images should have vulnerability findings resolved (powered by Qualys)|Azure running container images should have vulnerabilities resolved - (powered by Qualys)|Container image vulnerability assessment scans container images running on your Kubernetes clusters for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks.|41503391-efa5-47ee-9282-4eff6131462|

### Change to Container Vulnerability Assessments recommendation names

The following Container Vulnerability Assessments recommendations were renamed:

|Current recommendation name|New recommendation name|Description|Assessment key|
|--|--|--|--|
|Container registry images should have vulnerability findings resolved (powered by Qualys)|Azure registry container images should have vulnerabilities resolved (powered by Qualys)|Container image vulnerability assessment scans your registry for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. |dbd0cb49-b563-45e7-9724-889e799fa648|
|Running container images should have vulnerability findings resolved (powered by Qualys)|Azure running container images should have vulnerabilities resolved - (powered by Qualys)|Container image vulnerability assessment scans container images running on your Kubernetes clusters for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks.|41503391-efa5-47ee-9282-4eff6131462|
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
  - **Export capabilities** – export capabilities of attack paths to CSV, LA workspace and Event Hubs.
  - **Email notifications** – you can receive email notifications of new attack paths.

Learn [how to identify and remediate attack paths](how-to-manage-attack-path.md).

### Changes to Attack Path's Azure Resource Graph table scheme

November 15, 2023

The attack path's Azure Resource Graph (ARG) table scheme is updated. The `attackPathType` property is removed and other properties are added. Read more about the [updated Azure Resource Graph table scheme]().

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

The new system updates recommendation, `System updates should be installed on your machines (powered by Azure Update Manager)` in the `Apply system updates` control, is based on the [Update Manager](/azure/update-center/overview) and is now fully GA. The recommendation relies on a native agent embedded in every Azure VM and Azure Arc machines instead of an installed agent. The quick fix in the new recommendation navigates you to a one-time installation of the missing updates in the Update Manager portal.

The old and the new versions of the recommendations to find missing system updates will both be available until August 2024, which is when the older version is deprecated. Both recommendations: `System updates should be installed on your machines (powered by Azure Update Manager)`and `System updates should be installed on your machines` are available under the same control: `Apply system updates` and has the same results. Thus, there's no duplication in the effect on the secure score.

We recommend migrating to the new recommendation and remove the old one, by disabling it from Defender for Cloud's built-in initiative in Azure policy.

The recommendation `[Machines should be configured to periodically check for missing system updates](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/90386950-71ca-4357-a12e-486d1679427c)` is also GA and is a prerequisite, which will have a negative effect on your Secure Score. You can remediate the negative effect with the available Fix.  

To apply the new recommendation, you need to:

1. Connect your non-Azure machines to Arc.
1. Turn on the [periodic assessment property](/azure/update-center/assessment-options). You can use the Quick Fix in the new recommendation, `[Machines should be configured to periodically check for missing system updates](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/90386950-71ca-4357-a12e-486d1679427c)` to fix the recommendation.

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
| September 27 | [Data security dashboard available in public preview](#data-security-dashboard-available-in-public-preview)
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

Learn more about [exempting recommendations in Defender for Cloud](/azure/defender-for-cloud/exempt-resource).

### Create sample alerts for Defender for APIs detections

September 11, 2023

You can now generate sample alerts for the security detections that were released as part of the Defender for APIs public preview. Learn more about [generating sample alerts in Defender for Cloud](/azure/defender-for-cloud/alert-validation#generate-sample-security-alerts).

### Preview release: containers vulnerability assessment powered by Microsoft Defender Vulnerability Management now supports scan on pull

September 6, 2023

Containers vulnerability assessment powered by Microsoft Defender Vulnerability Management (MDVM), now supports an additional trigger for scanning images pulled from an ACR. This newly added trigger provides additional coverage for active images in addition to the existing triggers scanning images pushed to an ACR in the last 90 days and images currently running in AKS.

The new trigger will start rolling out today, and is expected to be available to all customers by end of September.

For more information, see [Container Vulnerability Assessment powered by MDVM](agentless-container-registry-vulnerability-assessment.md)

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
| August 22 | [Recommendation release: Microsoft Defender for Storage should be enabled with malware scanning and sensitive data threat detection](#recommendation-release-microsoft-defender-for-storage-should-be-enabled-with-malware-scanning-and-sensitive-data-threat-detection)
| August 17 | [Extended properties in Defender for Cloud security alerts are masked from activity logs](#extended-properties-in-defender-for-cloud-security-alerts-are-masked-from-activity-logs)
| August 15 | [Preview release of GCP support in Defender CSPM](#preview-release-of-gcp-support-in-defender-cspm)|
| August 7 | [New security alerts in Defender for Servers Plan 2: Detecting potential attacks abusing Azure virtual machine extensions](#new-security-alerts-in-defender-for-servers-plan-2-detecting-potential-attacks-abusing-azure-virtual-machine-extensions)
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
| **Suspicious installation of a GPU extension was detected on your virtual machine (Preview)**<br>(VM_GPUDriverExtensionUnusualExecution)<br>*This alert was [released in July  2023](#new-security-alert-in-defender-for-servers-plan-2-detecting-potential-attacks-leveraging-azure-vm-gpu-driver-extensions).* | Suspicious installation of a GPU extension was detected on your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the GPU driver extension to install GPU drivers on your virtual machine via the Azure Resource Manager to perform cryptojacking. This activity is deemed suspicious as the principal's behavior departs from its usual patterns. | Impact | Low |
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

## July 2023

Updates in July include:

|Date |Update  |
|----------|----------|
| July 31 | [Preview release of containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM) in Defender for Containers and Defender for Container Registries](#preview-release-of-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-mdvm-in-defender-for-containers-and-defender-for-container-registries) |
| July 30 | [Agentless container posture in Defender CSPM is now Generally Available](#agentless-container-posture-in-defender-cspm-is-now-generally-available) |
| July 20 | [Management of automatic updates to Defender for Endpoint for Linux](#management-of-automatic-updates-to-defender-for-endpoint-for-linux) |
| July 18 | [Agentless secret scanning for virtual machines in Defender for servers P2 & Defender CSPM](#agentless-secret-scanning-for-virtual-machines-in-defender-for-servers-p2--defender-cspm) |
| July 12 | [New Security alert in Defender for Servers plan 2: Detecting Potential Attacks leveraging Azure VM GPU driver extensions](#new-security-alert-in-defender-for-servers-plan-2-detecting-potential-attacks-leveraging-azure-vm-gpu-driver-extensions) |
| July 9 | [Support for disabling specific vulnerability findings](#support-for-disabling-specific-vulnerability-findings) |
| July 1 | [Data Aware Security Posture is now Generally Available](#data-aware-security-posture-is-now-generally-available) |

### Preview release of containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM) in Defender for Containers and Defender for Container Registries

July 31, 2023

We're announcing the release of Vulnerability Assessment (VA) for Linux container images in Azure container registries powered by Microsoft Defender Vulnerability Management (MDVM) in Defender for Containers and Defender for Container Registries. The new container VA offering will be provided alongside our existing Container VA offering powered by Qualys in both Defender for Containers and Defender for Container Registries, and include daily rescans of container images, exploitability information, support for OS and programming languages (SCA) and more.

This new offering will start rolling out today, and is expected to be available to all customers by August 7.

For more information, see [Container Vulnerability Assessment powered by MDVM](agentless-container-registry-vulnerability-assessment.md) and [Microsoft Defender Vulnerability Management (MDVM)](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management).

### Agentless container posture in Defender CSPM is now Generally Available

July 30, 2023

Agentless container posture capabilities are now Generally Available (GA) as part of the Defender CSPM (Cloud Security Posture Management) plan.

Learn more about [agentless container posture in Defender CSPM](concept-agentless-containers.md).

### Management of automatic updates to Defender for Endpoint for Linux

July 20, 2023

By default, Defender for Cloud attempts to update your Defender for Endpoint for Linux agents onboarded with the `MDE.Linux` extension. With this release, you can manage this setting and opt-out from the default configuration to manage your update cycles manually.

Learn how to [manage automatic updates configuration for Linux](integration-defender-for-endpoint.md#manage-automatic-updates-configuration-for-linux).  

### Agentless secret scanning for virtual machines in Defender for servers P2 & Defender CSPM

July 18, 2023

Secret scanning is now available as part of the agentless scanning in Defender for Servers P2 and Defender CSPM. This capability helps to detect unmanaged and insecure secrets saved on virtual machines in Azure or AWS resources that can be used to move laterally in the network. If secrets are detected, Defender for Cloud can help to prioritize and take actionable remediation steps to minimize the risk of lateral movement, all without affecting your machine's performance.

For more information about how to protect your secrets with secret scanning, see [Manage secrets with agentless secret scanning](secret-scanning.md).

### New security alert in Defender for Servers plan 2: detecting potential attacks leveraging Azure VM GPU driver extensions

July 12, 2023

This alert focuses on identifying suspicious activities leveraging Azure virtual machine **GPU driver extensions** and provides insights into attackers' attempts to compromise your virtual machines. The alert targets suspicious deployments of GPU driver extensions; such extensions are often abused by threat actors to utilize the full power of the GPU card and perform cryptojacking.

| Alert Display Name <br> (Alert Type)  | Description | Severity | MITRE Tactic  |
|---------|---------|---------|---------|
| Suspicious installation of GPU extension in your virtual machine (Preview) <br> (VM_GPUDriverExtensionUnusualExecution) | Suspicious installation of a GPU extension was detected in your virtual machine by analyzing the Azure Resource Manager operations in your subscription. Attackers might use the GPU driver extension to install GPU drivers on your virtual machine via the Azure Resource Manager to perform cryptojacking. | Low | Impact |

For a complete list of alerts, see the [reference table for all security alerts in Microsoft Defender for Cloud](alerts-reference.md).

### Support for disabling specific vulnerability findings

July 9, 2023

Release of support for disabling vulnerability findings for your container registry images or running images as part of agentless container posture. If you have an organizational need to ignore a vulnerability finding on your container registry image, rather than remediate it, you can optionally disable it. Disabled findings don't affect your secure score or generate unwanted noise.

Learn how to [disable vulnerability assessment findings on Container registry images](disable-vulnerability-findings-containers.md).

### Data Aware Security Posture is now Generally Available

July 1, 2023

Data-aware security posture in Microsoft Defender for Cloud is now Generally Available. It helps customers to reduce data risk, and respond to data breaches. Using data-aware security posture you can:

- Automatically discover sensitive data resources across Azure and AWS.
- Evaluate data sensitivity, data exposure, and how data flows across the organization.
- Proactively and continuously uncover risks that might lead to data breaches.
- Detect suspicious activities that might indicate ongoing threats to sensitive data resources

For more information, see [Data-aware security posture in Microsoft Defender for Cloud](concept-data-security-posture.md).

## June 2023

Updates in June include:

|Date |Update  |
|---------|---------|
| June 26 | [Streamlined multicloud account onboarding with enhanced settings](#streamlined-multicloud-account-onboarding-with-enhanced-settings) |
| June 25 | [Private Endpoint support for Malware Scanning in Defender for Storage](#private-endpoint-support-for-malware-scanning-in-defender-for-storage)
| June 15 | [Control updates were made to the NIST 800-53 standards in regulatory compliance](#control-updates-were-made-to-the-nist-800-53-standards-in-regulatory-compliance) |
|June 11 | [Planning of cloud migration with an Azure Migrate business case now includes Defender for Cloud](#planning-of-cloud-migration-with-an-azure-migrate-business-case-now-includes-defender-for-cloud) |
|June 7 | [Express configuration for vulnerability assessments in Defender for SQL is now Generally Available](#express-configuration-for-vulnerability-assessments-in-defender-for-sql-is-now-generally-available) |
|June 6 | [More scopes added to existing Azure DevOps Connectors](#more-scopes-added-to-existing-azure-devops-connectors) |
|June 4     | [Replacing agent-based discovery with agentless discovery for containers capabilities in Defender CSPM](#replacing-agent-based-discovery-with-agentless-discovery-for-containers-capabilities-in-defender-cspm)        |

### Streamlined multicloud account onboarding with enhanced settings

June 26, 2023

Defender for Cloud has improved the onboarding experience to include a new streamlined user interface and instructions in addition to new capabilities that allow you to onboard your AWS and GCP environments while providing access to advanced onboarding features.

For organizations that have adopted Hashicorp Terraform for automation, Defender for Cloud now includes the ability to use Terraform as the deployment method alongside AWS CloudFormation or GCP Cloud Shell. You can now customize the required role names when creating the integration. You can also select between:

- **Default access** - Allows Defender for Cloud to scan your resources and automatically include future capabilities.

- **Least privileged access** -Grants Defender for Cloud access only to the current permissions needed for the selected plans.

If you select the least privileged permissions, you'll only receive notifications on any new roles and permissions that are required to get full functionality on the connector health.

Defender for Cloud allows you to distinguish between your cloud accounts by their native names from the cloud vendors. For example, AWS account aliases and GCP project names.

### Private Endpoint support for Malware Scanning in Defender for Storage

June 25, 2023

Private Endpoint support is now available as part of the Malware Scanning public preview in Defender for Storage. This capability allows enabling Malware Scanning on storage accounts that are using private endpoints. No other configuration is needed.

[Malware Scanning (Preview)](defender-for-storage-malware-scan.md) in Defender for Storage helps protect your storage accounts from malicious content by performing a full malware scan on uploaded content in near real-time, using Microsoft Defender Antivirus capabilities. It's designed to help fulfill security and compliance requirements for handling untrusted content. It's an agentless SaaS solution that allows simple setup at scale, with zero maintenance, and supports automating response at scale.

Private endpoints provide secure connectivity to your Azure Storage services, effectively eliminating public internet exposure, and are considered a security best practice.

For storage accounts with private endpoints that have Malware Scanning already enabled, you'll need to disable and [enable the plan with Malware Scanning](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-subscription) for this to work.

Learn more about using [private endpoints](/azure/private-link/private-endpoint-overview) in [Defender for Storage](defender-for-storage-introduction.md) and how to secure your storage services further.

### Recommendation released for preview: Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)

June 21, 2023

 A new container recommendation in Defender CSPM powered by MDVM is released for preview:

|Recommendation | Description | Assessment Key|
|--|--|--|
| Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)(Preview) | Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. This recommendation provides visibility to vulnerable images currently running in your Kubernetes clusters. Remediating vulnerabilities in container images that are currently running is key to improving your security posture, significantly reducing the attack surface for your containerized workloads. | c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5

This new recommendation replaces the current recommendation of the same name, powered by Qualys, only in Defender CSPM (replacing assessment key 41503391-efa5-47ee-9282-4eff6131462c).

### Control updates were made to the NIST 800-53 standards in regulatory compliance

June 15, 2023

The NIST 800-53 standards (both R4 and R5) have recently been updated with control changes in Microsoft Defender for Cloud regulatory compliance. The Microsoft-managed controls have been removed from the standard, and the information on the Microsoft responsibility implementation (as part of the cloud shared responsibility model) is now available only in the control details pane under **Microsoft Actions**.

These controls were previously calculated as passed controls, so you might see a significant dip in your compliance score for NIST standards between April 2023 and May 2023.

For more information on compliance controls, see [Tutorial: Regulatory compliance checks - Microsoft Defender for Cloud](regulatory-compliance-dashboard.md).

### Planning of cloud migration with an Azure Migrate business case now includes Defender for Cloud

June 11, 2023

Now you can discover potential cost savings in security by applying Defender for Cloud within the context of an [Azure Migrate business case](/azure/migrate/concepts-business-case-calculation).

### Express configuration for vulnerability assessments in Defender for SQL is now Generally Available

June 7, 2023

Express configuration for vulnerability assessments in Defender for SQL is now Generally Available. Express configuration provides a streamlined onboarding experience for SQL vulnerability assessments by using a one-click configuration (or an API call). There's no extra settings or dependencies on managed storage accounts needed.

Check out this [blog](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/defender-for-sql-vulnerability-assessment-updates/ba-p/3837732) to learn more about express configuration.

You can learn the differences between [express and classic configuration](sql-azure-vulnerability-assessment-overview.md#what-are-the-express-and-classic-configurations).

### More scopes added to existing Azure DevOps Connectors

June 6, 2023

Defender for DevOps added the following extra scopes to the Azure DevOps (ADO) application:

- **Advance Security management**: `vso.advsec_manage`. Which is needed in order to allow you to enable, disable and manage GitHub Advanced Security for ADO.

- **Container Mapping**: `vso.extension_manage`, `vso.gallery_manager`; Which is needed in order to allow you to share the decorator extension with the ADO organization.  

Only new Defender for DevOps customers that are trying to onboard ADO resources to Microsoft Defender for Cloud are affected by this change.

### Onboarding directly (without Azure Arc) to Defender for Servers is now Generally Available

June 5, 2023

Previously, Azure Arc was required to onboard non-Azure servers to Defender for Servers. However, with the latest release you can also onboard your on-premises servers to Defender for Servers using only the Microsoft Defender for Endpoint agent.

This new method simplifies the onboarding process for customers focused on core endpoint protection and allows you to take advantage of Defender for Servers’ consumption-based billing for both cloud and noncloud assets. The direct onboarding option via Defender for Endpoint is available now, with billing for onboarded machines starting on July 1.

For more information, see [Connect your non-Azure machines to Microsoft Defender for Cloud with Defender for Endpoint](onboard-machines-with-defender-for-endpoint.md).

### Replacing agent-based discovery with agentless discovery for containers capabilities in Defender CSPM

June 4, 2023

With Agentless Container Posture capabilities available in Defender CSPM, the agent-based discovery capabilities are now retired. If you currently use container capabilities within Defender CSPM, please make sure that the [relevant extensions](how-to-enable-agentless-containers.md) are enabled to continue receiving container-related value of the new agentless capabilities such as container-related attack paths, insights, and inventory. (It can take up to 24 hours to see the effects of enabling the extensions).

Learn more about [agentless container posture](concept-agentless-containers.md).

## May 2023

Updates in might include:

- [New alert in Defender for Key Vault](#new-alert-in-defender-for-key-vault)
- [Agentless scanning now supports encrypted disks in AWS](#agentless-scanning-now-supports-encrypted-disks-in-aws)
- [Revised JIT (Just-In-Time) rule naming conventions in Defender for Cloud](#revised-jit-just-in-time-rule-naming-conventions-in-defender-for-cloud)
- [Onboard selected AWS regions](#onboard-selected-aws-regions)
- [Multiple changes to identity recommendations](#multiple-changes-to-identity-recommendations)
- [Deprecation of legacy standards in compliance dashboard](#deprecation-of-legacy-standards-in-compliance-dashboard)
- [Two Defender for DevOps recommendations now include Azure DevOps scan findings](#two-defender-for-devops-recommendations-now-include-azure-devops-scan-findings)
- [New default setting for Defender for Servers vulnerability assessment solution](#new-default-setting-for-defender-for-servers-vulnerability-assessment-solution)
- [Download a CSV report of your cloud security explorer query results (Preview)](#download-a-csv-report-of-your-cloud-security-explorer-query-results-preview)
- [Release of containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM) in Defender CSPM](#release-of-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-mdvm-in-defender-cspm)
- [Renaming container recommendations powered by Qualys](#renaming-container-recommendations-powered-by-qualys)
- [Defender for DevOps GitHub Application update](#defender-for-devops-github-application-update)
- [Defender for DevOps Pull Request annotations in Azure DevOps repositories now includes Infrastructure as Code misconfigurations](#defender-for-devops-pull-request-annotations-in-azure-devops-repositories-now-includes-infrastructure-as-code-misconfigurations)

### New alert in Defender for Key Vault

| Alert (alert type) | Description | MITRE tactics | Severity |
|---|---|:-:|---|
| **Unusual access to the key vault from a suspicious IP (Non-Microsoft or External)**<br>(KV_UnusualAccessSuspiciousIP) | A user or service principal has attempted anomalous access to key vaults from a non-Microsoft IP in the last 24 hours. This anomalous access pattern might be legitimate activity. It could be an indication of a possible attempt to gain access of the key vault and the secrets contained within it. We recommend further investigations. | Credential Access | Medium |

For all of the available alerts, see [Alerts for Azure Key Vault](alerts-reference.md#alerts-azurekv).

### Agentless scanning now supports encrypted disks in AWS

Agentless scanning for VMs now supports processing of instances with encrypted disks in AWS, using both CMK and PMK.

This extended support increases coverage and visibility over your cloud estate without impacting your running workloads. Support for encrypted disks maintains the same zero impact method on running instances.

- For new customers enabling agentless scanning in AWS - encrypted disks coverage is built in and supported by default.
- For existing customers that already have an AWS connector with agentless scanning enabled, you need to reapply the CloudFormation stack to your onboarded AWS accounts to update and add the new permissions that are required to process encrypted disks. The updated CloudFormation template includes new assignments that allow Defender for Cloud to process encrypted disks.

You can learn more about the [permissions used to scan AWS instances](faq-permissions.yml).

**To re-apply your CloudFormation stack**:

1. Go to Defender for Cloud environment settings and open your AWS connector.
1. Navigate to the **Configure Access** tab.
1. Select **Click to download the CloudFormation template**.
1. Navigate to your AWS environment and apply the updated template.

Learn more about [agentless scanning](concept-agentless-data-collection.md) and [enabling agentless scanning in AWS](enable-vulnerability-assessment-agentless.md#agentless-vulnerability-assessment-on-aws).

### Revised JIT (Just-In-Time) rule naming conventions in Defender for Cloud

We revised the JIT (Just-In-Time) rules to align with the Microsoft Defender for Cloud brand. We changed the naming conventions for Azure Firewall and NSG (Network Security Group) rules.

The changes are listed as follows:

| Description | Old Name |New Name  |
|---|---|---|
| JIT rule names (allow and deny) in NSG (Network Security Group) | SecurityCenter-JITRule | MicrosoftDefenderForCloud-JITRule
| JIT rule descriptions in NSG | ASC JIT Network Access rule | MDC JIT Network Access rule |
|JIT firewall rule collection names | ASC-JIT | MDC-JIT |
|JIT firewall rules names | ASC-JIT | MDC-JIT

Learn how to [secure your management ports with Just-In-Time access](just-in-time-access-usage.md).

### Onboard selected AWS regions

To help you manage your AWS CloudTrail costs and compliance needs, you can now select which AWS regions to scan when you add or edit a cloud connector.
You can now scan selected specific AWS regions or all available regions (default), when you onboard your AWS accounts to Defender for Cloud.
Learn more at [Connect your AWS account to Microsoft Defender for Cloud](quickstart-onboard-aws.md).

### Multiple changes to identity recommendations

The following recommendations are now released as General Availability (GA) and are replacing the V1 recommendations that are now deprecated.

#### General Availability (GA) release of identity recommendations V2

The V2 release of identity recommendations introduces the following enhancements:

- The scope of the scan has been expanded to include all Azure resources, not just subscriptions. This enables security administrators to view role assignments per account.
- Specific accounts can now be exempted from evaluation. Accounts such as break glass or service accounts can be excluded by security administrators.
- The scan frequency has been increased from 24 hours to 12 hours, thereby ensuring that the identity recommendations are more up-to-date and accurate.

The following security recommendations are available in GA and replace the V1 recommendations:

|Recommendation | Assessment Key|
|--|--|
| Accounts with owner permissions on Azure resources should be MFA enabled | 6240402e-f77c-46fa-9060-a7ce53997754 |
| Accounts with write permissions on Azure resources should be MFA enabled | c0cb17b2-0607-48a7-b0e0-903ed22de39b |
| Accounts with read permissions on Azure resources should be MFA enabled | dabc9bc4-b8a8-45bd-9a5a-43000df8aa1c |
| Guest accounts with owner permissions on Azure resources should be removed | 20606e75-05c4-48c0-9d97-add6daa2109a |
| Guest accounts with write permissions on Azure resources should be removed | 0354476c-a12a-4fcc-a79d-f0ab7ffffdbb |
| Guest accounts with read permissions on Azure resources should be removed | fde1c0c9-0fd2-4ecc-87b5-98956cbc1095 |
| Blocked accounts with owner permissions on Azure resources should be removed | 050ac097-3dda-4d24-ab6d-82568e7a50cf |
| Blocked accounts with read and write permissions on Azure resources should be removed | 1ff0b4c9-ed56-4de6-be9c-d7ab39645926 |

#### Deprecation of identity recommendations V1

The following security recommendations are now deprecated:

| Recommendation | Assessment Key |
|--|--|
| MFA should be enabled on accounts with owner permissions on subscriptions | 94290b00-4d0c-d7b4-7cea-064a9554e681 |
| MFA should be enabled on accounts with write permissions on subscriptions | 57e98606-6b1e-6193-0e3d-fe621387c16b |
| MFA should be enabled on accounts with read permissions on subscriptions | 151e82c5-5341-a74b-1eb0-bc38d2c84bb5 |
| External accounts with owner permissions should be removed from subscriptions | c3b6ae71-f1f0-31b4-e6c1-d5951285d03d |
| External accounts with write permissions should be removed from subscriptions | 04e7147b-0deb-9796-2e5c-0336343ceb3d |
| External accounts with read permissions should be removed from subscriptions | a8c6a4ad-d51e-88fe-2979-d3ee3c864f8b |
| Deprecated accounts with owner permissions should be removed from subscriptions | e52064aa-6853-e252-a11e-dffc675689c2 |
| Deprecated accounts should be removed from subscriptions | 00c6d40b-e990-6acf-d4f3-471e747a27c4 |

We recommend updating your custom scripts, workflows, and governance rules to correspond with the V2 recommendations.

### Deprecation of legacy standards in compliance dashboard

Legacy PCI DSS v3.2.1 and legacy SOC TSP have been fully deprecated in the Defender for Cloud compliance dashboard, and replaced by [SOC 2  Type 2](/azure/compliance/offerings/offering-soc-2) initiative and [PCI DSS v4](/azure/compliance/offerings/offering-pci-dss) initiative-based compliance standards.
We have fully deprecated support of [PCI DSS](/azure/compliance/offerings/offering-pci-dss) standard/initiative in Microsoft Azure operated by 21Vianet.

Learn how to [customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

### Two Defender for DevOps recommendations now include Azure DevOps scan findings

Defender for DevOps Code and IaC has expanded its recommendation coverage in Microsoft Defender for Cloud to include Azure DevOps security findings for the following two recommendations:

- `Code repositories should have code scanning findings resolved`

- `Code repositories should have infrastructure as code scanning findings resolved`

Previously, coverage for Azure DevOps security scanning only included the secrets recommendation.

Learn more about [Defender for DevOps](defender-for-devops-introduction.md).

### New default setting for Defender for Servers vulnerability assessment solution

Vulnerability assessment (VA) solutions are essential to safeguard machines from cyberattacks and data breaches.

Microsoft Defender Vulnerability Management (MDVM) is now enabled as the default, built-in solution for all subscriptions protected by Defender for Servers that don't already have a VA solution selected.

If a subscription has a VA solution enabled on any of its VMs, no changes are made and MDVM won't be enabled by default on the remaining VMs in that subscription. You can choose to [enable a VA solution](deploy-vulnerability-assessment-defender-vulnerability-management.md) on the remaining VMs on your subscriptions.

Learn how to [Find vulnerabilities and collect software inventory with agentless scanning (Preview)](enable-vulnerability-assessment-agentless.md).

### Download a CSV report of your cloud security explorer query results (Preview)

Defender for Cloud has added the ability to download a CSV report of your cloud security explorer query results.

After your run a search for a query, you can select the **Download CSV report (Preview)** button from the Cloud Security Explorer page in Defender for Cloud.

Learn how to [build queries with cloud security explorer](how-to-manage-cloud-security-explorer.md)

### Release of containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM) in Defender CSPM

We're announcing the release of Vulnerability Assessment for Linux images in Azure container registries powered by Microsoft Defender Vulnerability Management (MDVM) in Defender CSPM. This release includes daily scanning of images. Findings used in the Security Explorer and attack paths rely on MDVM Vulnerability Assessment instead of the Qualys scanner.  

The existing recommendation `Container registry images should have vulnerability findings resolved` is replaced by a new recommendation powered by MDVM:

|Recommendation | Description | Assessment Key|
|--|--|--|
| Container registry images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)| Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. This recommendation provides visibility to vulnerable images currently running in your Kubernetes clusters. Remediating vulnerabilities in container images that are currently running is key to  improving your security posture, significantly reducing the attack surface for your containerized workloads. |dbd0cb49-b563-45e7-9724-889e799fa648 <br> is replaced by  c0b7cfc6-3172-465a-b378-53c7ff2cc0d5

Learn more about [Agentless Containers Posture in Defender CSPM](concept-agentless-containers.md).

Learn more about [Microsoft Defender Vulnerability Management (MDVM)](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management).

### Renaming container recommendations powered by Qualys

The current container recommendations in Defender for Containers will be renamed as follows:

|Recommendation | Description | Assessment Key|
|--|--|--|
| Container registry images should have vulnerability findings resolved (powered by Qualys) | Container image vulnerability assessment scans your registry for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. | dbd0cb49-b563-45e7-9724-889e799fa648 |
| Running container images should have vulnerability findings resolved (powered by Qualys) | Container image vulnerability assessment scans container images running on your Kubernetes clusters for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. |  41503391-efa5-47ee-9282-4eff6131462c |

### Defender for DevOps GitHub Application update

Microsoft Defender for DevOps is constantly making changes and updates that require Defender for DevOps customers who have onboarded their GitHub environments in Defender for Cloud to provide permissions as part of the application deployed in their GitHub organization. These permissions are necessary to ensure all of the security features of Defender for DevOps operate normally and without issues.

We suggest updating the permissions as soon as possible to ensure continued access to all available features of Defender for DevOps.

Permissions can be granted in two different ways:

- In your organization, select **GitHub Apps**. Locate Your organization, and select **Review request**.

- You'll get an automated email from GitHub Support. In the email, select **Review permission request to accept or reject this change**.

After you have followed either of these options, you'll be navigated to the review screen where you should review the request. Select **Accept new permissions** to approve the request.

If you require any assistance updating permissions, you can [create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

You can also learn more about [Defender for DevOps](defender-for-devops-introduction.md).
If a subscription has a VA solution enabled on any of its VMs, no changes are made and MDVM won't be enabled by default on the remaining VMs in that subscription. You can choose to [enable a VA solution](deploy-vulnerability-assessment-defender-vulnerability-management.md) on the remaining VMs on your subscriptions.

Learn how to [Find vulnerabilities and collect software inventory with agentless scanning (Preview)](enable-vulnerability-assessment-agentless.md).

### Defender for DevOps Pull Request annotations in Azure DevOps repositories now includes Infrastructure as Code misconfigurations

Defender for DevOps has expanded its Pull Request (PR) annotation coverage in Azure DevOps to include Infrastructure as Code (IaC) misconfigurations that are detected in Azure Resource Manager and Bicep templates.

Developers can now see annotations for IaC misconfigurations directly in their PRs. Developers can also remediate critical security issues before the infrastructure is provisioned into cloud workloads. To simplify remediation, developers are provided with a severity level, misconfiguration description, and remediation instructions within each annotation.

Previously, coverage for Defender for DevOps PR annotations in Azure DevOps only included secrets.

Learn more about [Defender for DevOps](defender-for-devops-introduction.md) and [Pull Request annotations](enable-pull-request-annotations.md).

## April 2023

Updates in April include:

- [Agentless Container Posture in Defender CSPM (Preview)](#agentless-container-posture-in-defender-cspm-preview)
- [New preview Unified Disk Encryption recommendation](#unified-disk-encryption-recommendation-preview)
- [Changes in the recommendation Machines should be configured securely](#changes-in-the-recommendation-machines-should-be-configured-securely)
- [Deprecation of App Service language monitoring policies](#deprecation-of-app-service-language-monitoring-policies)
- [New alert in Defender for Resource Manager](#new-alert-in-defender-for-resource-manager)
- [Three alerts in the Defender for Resource Manager plan have been deprecated](#three-alerts-in-the-defender-for-resource-manager-plan-have-been-deprecated)
- [Alerts automatic export to Log Analytics workspace have been deprecated](#alerts-automatic-export-to-log-analytics-workspace-have-been-deprecated)
- [Deprecation and improvement of selected alerts for Windows and Linux Servers](#deprecation-and-improvement-of-selected-alerts-for-windows-and-linux-servers)
- [New Azure Active Directory authentication-related recommendations for Azure Data Services](#new-azure-active-directory-authentication-related-recommendations-for-azure-data-services)
- [Two recommendations related to missing Operating System (OS) updates were released to GA](#two-recommendations-related-to-missing-operating-system-os-updates-were-released-to-ga)
- [Defender for APIs (Preview)](#defender-for-apis-preview)

### Agentless Container Posture in Defender CSPM (Preview)

The new Agentless Container Posture (Preview) capabilities are available as part of the Defender CSPM (Cloud Security Posture Management) plan.

Agentless Container Posture allows security teams to identify security risks in containers and Kubernetes realms. An agentless approach allows security teams to gain visibility into their Kubernetes and containers registries across SDLC and runtime, removing friction and footprint from the workloads.

Agentless Container Posture offers container vulnerability assessments that, combined with attack path analysis, enable security teams to prioritize and zoom into specific container vulnerabilities. You can also use cloud security explorer to uncover risks and hunt for container posture insights, such as discovery of applications running vulnerable images or exposed to the internet.

Learn more at [Agentless Container Posture (Preview)](concept-agentless-containers.md).

### Unified Disk Encryption recommendation (preview)

We have introduced a unified disk encryption recommendation in public preview, `Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost` and `Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost`.

These recommendations replace `Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources`, which detected Azure Disk Encryption and the policy `Virtual machines and virtual machine scale sets should have encryption at host enabled`, which detected EncryptionAtHost. ADE and EncryptionAtHost provide comparable encryption at rest coverage, and we recommend enabling one of them on every virtual machine. The new recommendations detect whether either ADE or EncryptionAtHost are enabled and only warn if neither are enabled. We also warn if ADE is enabled on some, but not all disks of a VM (this condition isn't applicable to EncryptionAtHost).

The new recommendations require [Azure Automanage Machine Configuration](https://aka.ms/gcpol).

These recommendations are based on the following policies:

- [(Preview) Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f3dc5edcd-002d-444c-b216-e123bbfa37c0)
- [(Preview) Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fca88aadc-6e2b-416c-9de2-5a0f01d1693f)

Learn more about [ADE and EncryptionAtHost and how to enable one of them](../virtual-machines/disk-encryption-overview.md).

### Changes in the recommendation Machines should be configured securely

The recommendation `Machines should be configured securely` was updated. The update improves the performance and stability of the recommendation and aligns its experience with the generic behavior of Defender for Cloud's recommendations.

As part of this update, the recommendation's ID was changed from `181ac480-f7c4-544b-9865-11b8ffe87f47` to `c476dc48-8110-4139-91af-c8d940896b98`.

No action is required on the customer side, and there's no expected effect on the secure score.

### Deprecation of App Service language monitoring policies

The following App Service language monitoring policies have been deprecated due to their ability to generate false negatives and because they don't provide better security. You should always ensure you're using a language version without any known vulnerabilities.

| Policy name | Policy ID |
|--|--|
| [App Service apps that use Java should use the latest 'Java version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F496223c3-ad65-4ecd-878a-bae78737e9ed) | 496223c3-ad65-4ecd-878a-bae78737e9ed |
| [App Service apps that use Python should use the latest 'Python version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7008174a-fd10-4ef0-817e-fc820a951d73) | 7008174a-fd10-4ef0-817e-fc820a951d73 |
| [Function apps that use Java should use the latest 'Java version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9d0b6ea4-93e2-4578-bf2f-6bb17d22b4bc) | 9d0b6ea4-93e2-4578-bf2f-6bb17d22b4bc |
| [Function apps that use Python should use the latest 'Python version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7238174a-fd10-4ef0-817e-fc820a951d73) | 7238174a-fd10-4ef0-817e-fc820a951d73 |
| [App Service apps that use PHP should use the latest 'PHP version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7261b898-8a84-4db8-9e04-18527132abb3)| 7261b898-8a84-4db8-9e04-18527132abb3 |

Customers can use alternative built-in policies to monitor any specified language version for their App Services.

These policies are no longer available in Defender for Cloud's built-in recommendations. You can [add them as custom recommendations](create-custom-recommendations.md) to have Defender for Cloud monitor them.

### New alert in Defender for Resource Manager

Defender for Resource Manager has the following new alert:

| Alert (alert type) | Description | MITRE tactics | Severity |
|---|---|:-:|---|
| **PREVIEW - Suspicious creation of compute resources detected**<br>(ARM_SuspiciousComputeCreation) | Microsoft Defender for Resource Manager identified a suspicious creation of compute resources in your subscription utilizing Virtual Machines/Azure Scale Set. The identified operations are designed to allow administrators to efficiently manage their environments by deploying new resources when needed. While this activity might be legitimate, a threat actor might utilize such operations to conduct crypto mining.<br> The activity is deemed suspicious as the compute resources scale is higher than previously observed in the subscription. <br> This can indicate that the principal is compromised and is being used with malicious intent. | Impact | Medium  |

You can see a list of all of the [alerts available for Resource Manager](alerts-reference.md#alerts-resourcemanager).

### Three alerts in the Defender for Resource Manager plan have been deprecated

The following three alerts for the Defender for Resource Manager plan have been deprecated:

- `Activity from a risky IP address (ARM.MCAS_ActivityFromAnonymousIPAddresses)`
- `Activity from infrequent country (ARM.MCAS_ActivityFromInfrequentCountry)`
- `Impossible travel activity (ARM.MCAS_ImpossibleTravelActivity)`

In a scenario where activity from a suspicious IP address is detected, one of the following Defenders for Resource Manager plan alerts `Azure Resource Manager operation from suspicious IP address` or `Azure Resource Manager operation from suspicious proxy IP address` will be present.

### Alerts automatic export to Log Analytics workspace have been deprecated

Defenders for Cloud security alerts are automatically exported to a default Log Analytics workspace on the resource level. This causes an indeterministic behavior and therefore we have deprecated this feature.

Instead, you can export your security alerts to a dedicated Log Analytics workspace with [Continuous Export](continuous-export.md#set-up-a-continuous-export).

If you have already configured continuous export of your alerts to a Log Analytics workspace, no further action is required.

### Deprecation and improvement of selected alerts for Windows and Linux Servers

The security alert quality improvement process for Defender for Servers includes the deprecation of some alerts for both Windows and Linux servers. The deprecated alerts are now sourced from and covered by Defender for Endpoint threat alerts.  

If you already have the Defender for Endpoint integration enabled, no further action is required. You might experience a decrease in your alerts volume in April 2023.

If you don't have the Defender for Endpoint integration enabled in Defender for Servers, you'll need to enable the Defender for Endpoint integration to maintain and improve your alert coverage.

All Defender for Servers customers, have full access to the Defender for Endpoint’s integration as a part of the [Defender for Servers plan](plan-defender-for-servers-select-plan.md#plan-features).  

You can learn more about [Microsoft Defender for Endpoint onboarding options](integration-defender-for-endpoint.md#enable-the-microsoft-defender-for-endpoint-integration).

You can also view the [full list of alerts](alerts-reference.md#deprecated-defender-for-servers-alerts) that are set to be deprecated.

Read the [Microsoft Defender for Cloud blog](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/defender-for-servers-security-alerts-improvements/ba-p/3714175).

### New Azure Active Directory authentication-related recommendations for Azure Data Services

We have added four new Azure Active Directory authentication recommendations for Azure Data Services.

| Recommendation Name | Recommendation Description | Policy |
|--|--|--|
| Azure SQL Managed Instance authentication mode should be Azure Active Directory Only | Disabling local authentication methods and allowing only Azure Active Directory Authentication improves security by ensuring that Azure SQL Managed Instances can exclusively be accessed by Azure Active Directory identities. | [Azure SQL Managed Instance should have Azure Active Directory Only Authentication enabled](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f78215662-041e-49ed-a9dd-5385911b3a1f) |
| Azure Synapse Workspace authentication mode should be Azure Active Directory Only | Azure Active Directory only authentication methods improves security by ensuring that Synapse Workspaces exclusively require Azure AD identities for authentication. [Learn more](https://aka.ms/Synapse). | [Synapse Workspaces should use only Azure Active Directory identities for authentication](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2158ddbe-fefa-408e-b43f-d4faef8ff3b8) |
| Azure Database for MySQL should have an Azure Active Directory administrator provisioned | Provision an Azure AD administrator for your Azure Database for MySQL to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services | [An Azure Active Directory administrator should be provisioned for MySQL servers](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f146412e9-005c-472b-9e48-c87b72ac229e) |
| Azure Database for PostgreSQL should have an Azure Active Directory administrator provisioned | Provision an Azure AD administrator for your Azure Database for PostgreSQL to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services | [An Azure Active Directory administrator should be provisioned for PostgreSQL servers](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb4dec045-250a-48c2-b5cc-e0c4eec8b5b4) |

### Two recommendations related to missing Operating System (OS) updates were released to GA

The recommendations `System updates should be installed on your machines (powered by Azure Update Manager)` and `Machines should be configured to periodically check for missing system updates` have been released for General Availability.

To use the new recommendation, you need to:

- Connect your non-Azure machines to Arc.
- [Enable the periodic assessment property](../update-center/assessment-options.md#periodic-assessment). You can use the [Fix button](implement-security-recommendations.md).
 in the new recommendation, `Machines should be configured to periodically check for missing system updates` to fix the recommendation.

After completing these steps, you can remove the old recommendation `System updates should be installed on your machines`, by disabling it from Defender for Cloud's built-in initiative in Azure policy.

The two versions of the recommendations:

- [`System updates should be installed on your machines`](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SystemUpdatesRecommendationDetailsWithRulesBlade/assessmentKey/4ab6e3c5-74dd-8b35-9ab9-f61b30875b27/subscriptionIds~/%5B%220cd6095b-b140-41ec-ad1d-32f2f7493386%22%2C%220ee78edb-a0ad-456c-a0a2-901bf542c102%22%2C%2284ca48fe-c942-42e5-b492-d56681d058fa%22%2C%22b2a328a7-ffff-4c09-b643-a4758cf170bc%22%2C%22eef8b6d5-94da-4b36-9327-a662f2674efb%22%2C%228d5565a3-dec1-4ee2-86d6-8aabb315eec4%22%2C%22e0fd569c-e34a-4249-8c24-e8d723c7f054%22%2C%22dad45786-32e5-4ef3-b90e-8e0838fbadb6%22%2C%22a5f9f0d3-a937-4de5-8cf3-387fce51e80c%22%2C%220368444d-756e-4ca6-9ecd-e964248c227a%22%2C%22e686ef8c-d35d-4e9b-92f8-caaaa7948c0a%22%2C%222145a411-d149-4010-84d4-40fe8a55db44%22%2C%22212f9889-769e-45ae-ab43-6da33674bd26%22%2C%22615f5f56-4ba9-45cf-b644-0c09d7d325c8%22%2C%22487bb485-b5b0-471e-9c0d-10717612f869%22%2C%22cb9eb375-570a-4e75-b83a-77dd942bee9f%22%2C%224bbecc02-f2c3-402a-8e01-1dfb1ffef499%22%2C%22432a7068-99ae-4975-ad38-d96b71172cdf%22%2C%22c0620f27-ac38-468c-a26b-264009fe7c41%22%2C%22a1920ebd-59b7-4f19-af9f-5e80599e88e4%22%2C%22b43a6159-1bea-4fa2-9407-e875fdc0ff55%22%2C%22d07c0080-170c-4c24-861d-9c817742986a%22%2C%22ae71ef11-a03f-4b4f-a0e6-ef144727c711%22%2C%2255a24be0-d9c3-4ecd-86b6-566c7aac2512%22%2C%227afc2d66-d5b4-4e84-970b-a782e3e4cc46%22%2C%2252a442a2-31e9-42f9-8e3e-4b27dbf82673%22%2C%228c4b5b03-3b24-4ed0-91f5-a703cd91b412%22%2C%22e01de573-132a-42ac-9ee2-f9dea9dd2717%22%2C%22b5c0b80f-5932-4d47-ae25-cd617dac90ce%22%2C%22e4e06275-58d1-4081-8f1b-be12462eb701%22%2C%229b4236fe-df75-4289-bf00-40628ed41fd9%22%2C%2221d8f407-c4c4-452e-87a4-e609bfb86248%22%2C%227d411d23-59e5-4e2e-8566-4f59de4544f2%22%2C%22b74d5345-100f-408a-a7ca-47abb52ba60d%22%2C%22f30787b9-82a8-4e74-bb0f-f12d64ecc496%22%2C%22482e1993-01d4-4b16-bff4-1866929176a1%22%2C%2226596251-f2f3-4e31-8a1b-f0754e32ad73%22%2C%224628298e-882d-4f12-abf4-a9f9654960bb%22%2C%224115b323-4aac-47f4-bb13-22af265ed58b%22%2C%22911e3904-5112-4232-a7ee-0d1811363c28%22%2C%22cd0fa82d-b6b6-4361-b002-050c32f71353%22%2C%22dd4c2dac-db51-4cd0-b734-684c6cc360c1%22%2C%22d2c9544f-4329-4642-b73d-020e7fef844f%22%2C%22bac420ed-c6fc-4a05-8ac1-8c0c52da1d6e%22%2C%2250ff7bc0-cd15-49d5-abb2-e975184c2f65%22%2C%223cd95ff9-ac62-4b5c-8240-0cd046687ea0%22%2C%2213723929-6644-4060-a50a-cc38ebc5e8b1%22%2C%2209fa8e83-d677-474f-8f73-2a954a0b0ea4%22%2C%22ca38bc19-cf50-48e2-bbe6-8c35b40212d8%22%2C%22bf163a87-8506-4eb3-8d14-c2dc95908830%22%2C%221278a874-89fc-418c-b6b9-ac763b000415%22%2C%223b2fda06-3ef6-454a-9dd5-994a548243e9%22%2C%226560575d-fa06-4e7d-95fb-f962e74efd7a%22%2C%22c3547baf-332f-4d8f-96bd-0659b39c7a59%22%2C%222f96ae42-240b-4228-bafa-26d8b7b03bf3%22%2C%2229de2cfc-f00a-43bb-bdc8-3108795bd282%22%2C%22a1ffc958-d2c7-493e-9f1e-125a0477f536%22%2C%2254b875cc-a81a-4914-8bfd-1a36bc7ddf4d%22%2C%22407ff5d7-0113-4c5c-8534-f5cfb09298f5%22%2C%22365a62ee-6166-4d37-a936-03585106dd50%22%2C%226d17b59e-06c4-4203-89d2-de793ebf5452%22%2C%229372b318-ed3a-4504-95a6-941201300f78%22%2C%223c1bb38c-82e3-4f8d-a115-a7110ba70d05%22%2C%22c6dcd830-359f-44d0-b4d4-c1ba95e86f48%22%2C%2209e8ad18-7bdb-43b8-80c4-43ee53460e0b%22%2C%22dcbdac96-1896-478d-89fc-c95ed43f4596%22%2C%22d23422cf-c0f2-4edc-a306-6e32b181a341%22%2C%228c2c7b23-848d-40fe-b817-690d79ad9dfd%22%2C%221163fbbe-27e7-4b0f-8466-195fe5417043%22%2C%223905431d-c062-4c17-8fd9-c51f89f334c4%22%2C%227ea26ded-0260-4e78-9336-285d4d9e33d2%22%2C%225ccdbd03-f1b1-4b59-a609-300685e17ce3%22%2C%22bcdc6eb0-74cd-40b6-b3a9-584b33cea7b6%22%2C%22d557e825-27b1-4819-8af5-dc2429af91c9%22%2C%222bb50811-92b6-43a1-9d80-745962d9c759%22%2C%22409111bf-3097-421c-ad68-a44e716edf58%22%2C%2249e3f635-484a-43d1-b953-b29e1871ba88%22%2C%22b77ec8a9-04ed-48d2-a87a-e5887b978ba6%22%2C%22075423e9-7d33-4166-8bdf-3920b04e3735%22%2C%22ef143bbb-6a7e-4a3f-b64f-2f23330e0116%22%2C%2224afc59a-f969-4f83-95c9-3b70f52d833d%22%2C%22a8783cc5-1171-4c34-924f-6f71a20b21ec%22%2C%220079a9bb-e218-496a-9880-d27ad6192f52%22%2C%226f53185c-ea09-4fc3-9075-318dec805303%22%2C%22588845a8-a4a7-4ab1-83a1-1388452e8c0c%22%2C%22b68b2f37-1d37-4c2f-80f6-c23de402792e%22%2C%22eec2de82-6ab2-4a84-ae5f-57e9a10bf661%22%2C%22227531a4-d775-435b-a878-963ed8d0d18f%22%2C%228cff5d56-95fb-4a74-ab9d-079edb45313e%22%2C%22e72e5254-f265-4e95-9bd2-9ee8e7329051%22%2C%228ae1955e-f748-4273-a507-10159ba940f9%22%2C%22f6869ac6-2a40-404f-acd3-d07461be771a%22%2C%2285b3dbca-5974-4067-9669-67a141095a76%22%2C%228168a4f2-74d6-4663-9951-8e3a454937b7%22%2C%229ec1d932-0f3f-486c-acc6-e7d78b358f9b%22%2C%2279f57c16-00fe-48da-87d4-5192e86cd047%22%2C%22bac044cf-49e1-4843-8dda-1ce9662606c8%22%2C%22009d0e9f-a42a-470e-b315-82496a88cf0f%22%2C%2268f3658f-0090-4277-a500-f02227aaee97%22%5D/showSecurityCenterCommandBar~/false/assessmentOwners~/null)
- [`System updates should be installed on your machines (powered by Azure Update Manager)`](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SystemUpdatesV2RecommendationDetailsBlade/assessmentKey/e1145ab1-eb4f-43d8-911b-36ddf771d13f/subscriptionIds~/%5B%220cd6095b-b140-41ec-ad1d-32f2f7493386%22%2C%220ee78edb-a0ad-456c-a0a2-901bf542c102%22%2C%2284ca48fe-c942-42e5-b492-d56681d058fa%22%2C%22b2a328a7-ffff-4c09-b643-a4758cf170bc%22%2C%22eef8b6d5-94da-4b36-9327-a662f2674efb%22%2C%228d5565a3-dec1-4ee2-86d6-8aabb315eec4%22%2C%22e0fd569c-e34a-4249-8c24-e8d723c7f054%22%2C%22dad45786-32e5-4ef3-b90e-8e0838fbadb6%22%2C%22a5f9f0d3-a937-4de5-8cf3-387fce51e80c%22%2C%220368444d-756e-4ca6-9ecd-e964248c227a%22%2C%22e686ef8c-d35d-4e9b-92f8-caaaa7948c0a%22%2C%222145a411-d149-4010-84d4-40fe8a55db44%22%2C%22212f9889-769e-45ae-ab43-6da33674bd26%22%2C%22615f5f56-4ba9-45cf-b644-0c09d7d325c8%22%2C%22487bb485-b5b0-471e-9c0d-10717612f869%22%2C%22cb9eb375-570a-4e75-b83a-77dd942bee9f%22%2C%224bbecc02-f2c3-402a-8e01-1dfb1ffef499%22%2C%22432a7068-99ae-4975-ad38-d96b71172cdf%22%2C%22c0620f27-ac38-468c-a26b-264009fe7c41%22%2C%22a1920ebd-59b7-4f19-af9f-5e80599e88e4%22%2C%22b43a6159-1bea-4fa2-9407-e875fdc0ff55%22%2C%22d07c0080-170c-4c24-861d-9c817742986a%22%2C%22ae71ef11-a03f-4b4f-a0e6-ef144727c711%22%2C%2255a24be0-d9c3-4ecd-86b6-566c7aac2512%22%2C%227afc2d66-d5b4-4e84-970b-a782e3e4cc46%22%2C%2252a442a2-31e9-42f9-8e3e-4b27dbf82673%22%2C%228c4b5b03-3b24-4ed0-91f5-a703cd91b412%22%2C%22e01de573-132a-42ac-9ee2-f9dea9dd2717%22%2C%22b5c0b80f-5932-4d47-ae25-cd617dac90ce%22%2C%22e4e06275-58d1-4081-8f1b-be12462eb701%22%2C%229b4236fe-df75-4289-bf00-40628ed41fd9%22%2C%2221d8f407-c4c4-452e-87a4-e609bfb86248%22%2C%227d411d23-59e5-4e2e-8566-4f59de4544f2%22%2C%22b74d5345-100f-408a-a7ca-47abb52ba60d%22%2C%22f30787b9-82a8-4e74-bb0f-f12d64ecc496%22%2C%22482e1993-01d4-4b16-bff4-1866929176a1%22%2C%2226596251-f2f3-4e31-8a1b-f0754e32ad73%22%2C%224628298e-882d-4f12-abf4-a9f9654960bb%22%2C%224115b323-4aac-47f4-bb13-22af265ed58b%22%2C%22911e3904-5112-4232-a7ee-0d1811363c28%22%2C%22cd0fa82d-b6b6-4361-b002-050c32f71353%22%2C%22dd4c2dac-db51-4cd0-b734-684c6cc360c1%22%2C%22d2c9544f-4329-4642-b73d-020e7fef844f%22%2C%22bac420ed-c6fc-4a05-8ac1-8c0c52da1d6e%22%2C%2250ff7bc0-cd15-49d5-abb2-e975184c2f65%22%2C%223cd95ff9-ac62-4b5c-8240-0cd046687ea0%22%2C%2213723929-6644-4060-a50a-cc38ebc5e8b1%22%2C%2209fa8e83-d677-474f-8f73-2a954a0b0ea4%22%2C%22ca38bc19-cf50-48e2-bbe6-8c35b40212d8%22%2C%22bf163a87-8506-4eb3-8d14-c2dc95908830%22%2C%221278a874-89fc-418c-b6b9-ac763b000415%22%2C%223b2fda06-3ef6-454a-9dd5-994a548243e9%22%2C%226560575d-fa06-4e7d-95fb-f962e74efd7a%22%2C%22c3547baf-332f-4d8f-96bd-0659b39c7a59%22%2C%222f96ae42-240b-4228-bafa-26d8b7b03bf3%22%2C%2229de2cfc-f00a-43bb-bdc8-3108795bd282%22%2C%22a1ffc958-d2c7-493e-9f1e-125a0477f536%22%2C%2254b875cc-a81a-4914-8bfd-1a36bc7ddf4d%22%2C%22407ff5d7-0113-4c5c-8534-f5cfb09298f5%22%2C%22365a62ee-6166-4d37-a936-03585106dd50%22%2C%226d17b59e-06c4-4203-89d2-de793ebf5452%22%2C%229372b318-ed3a-4504-95a6-941201300f78%22%2C%223c1bb38c-82e3-4f8d-a115-a7110ba70d05%22%2C%22c6dcd830-359f-44d0-b4d4-c1ba95e86f48%22%2C%2209e8ad18-7bdb-43b8-80c4-43ee53460e0b%22%2C%22dcbdac96-1896-478d-89fc-c95ed43f4596%22%2C%22d23422cf-c0f2-4edc-a306-6e32b181a341%22%2C%228c2c7b23-848d-40fe-b817-690d79ad9dfd%22%2C%221163fbbe-27e7-4b0f-8466-195fe5417043%22%2C%223905431d-c062-4c17-8fd9-c51f89f334c4%22%2C%227ea26ded-0260-4e78-9336-285d4d9e33d2%22%2C%225ccdbd03-f1b1-4b59-a609-300685e17ce3%22%2C%22bcdc6eb0-74cd-40b6-b3a9-584b33cea7b6%22%2C%22d557e825-27b1-4819-8af5-dc2429af91c9%22%2C%222bb50811-92b6-43a1-9d80-745962d9c759%22%2C%22409111bf-3097-421c-ad68-a44e716edf58%22%2C%2249e3f635-484a-43d1-b953-b29e1871ba88%22%2C%22b77ec8a9-04ed-48d2-a87a-e5887b978ba6%22%2C%22075423e9-7d33-4166-8bdf-3920b04e3735%22%2C%22ef143bbb-6a7e-4a3f-b64f-2f23330e0116%22%2C%2224afc59a-f969-4f83-95c9-3b70f52d833d%22%2C%22a8783cc5-1171-4c34-924f-6f71a20b21ec%22%2C%220079a9bb-e218-496a-9880-d27ad6192f52%22%2C%226f53185c-ea09-4fc3-9075-318dec805303%22%2C%22588845a8-a4a7-4ab1-83a1-1388452e8c0c%22%2C%22b68b2f37-1d37-4c2f-80f6-c23de402792e%22%2C%22eec2de82-6ab2-4a84-ae5f-57e9a10bf661%22%2C%22227531a4-d775-435b-a878-963ed8d0d18f%22%2C%228cff5d56-95fb-4a74-ab9d-079edb45313e%22%2C%22e72e5254-f265-4e95-9bd2-9ee8e7329051%22%2C%228ae1955e-f748-4273-a507-10159ba940f9%22%2C%22f6869ac6-2a40-404f-acd3-d07461be771a%22%2C%2285b3dbca-5974-4067-9669-67a141095a76%22%2C%228168a4f2-74d6-4663-9951-8e3a454937b7%22%2C%229ec1d932-0f3f-486c-acc6-e7d78b358f9b%22%2C%2279f57c16-00fe-48da-87d4-5192e86cd047%22%2C%22bac044cf-49e1-4843-8dda-1ce9662606c8%22%2C%22009d0e9f-a42a-470e-b315-82496a88cf0f%22%2C%2268f3658f-0090-4277-a500-f02227aaee97%22%5D/showSecurityCenterCommandBar~/false/assessmentOwners~/null)

will both be available until the [Log Analytics agent is deprecated on August 31, 2024](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/), which is when the older version (`System updates should be installed on your machines`) of the recommendation will be deprecated as well. Both recommendations return the same results and are available under the same control `Apply system updates`.

The new recommendation `System updates should be installed on your machines (powered by Azure Update Manager)` has a remediation flow available through the Fix button, which can be used to remediate any results through the Update Manager (Preview). This remediation process is still in Preview.

The new recommendation `System updates should be installed on your machines (powered by Azure Update Manager)` isn't expected to affect your Secure Score, as it has the same results as the old recommendation `System updates should be installed on your machines`.

The prerequisite recommendation ([Enable the periodic assessment property](../update-center/assessment-options.md#periodic-assessment)) has a negative effect on your Secure Score. You can remediate the negative effect with the available [Fix button](implement-security-recommendations.md).

### Defender for APIs (Preview)

Microsoft's Defender for Cloud is announcing the new Defender for APIs is available in preview.

Defender for APIs offers full lifecycle protection, detection, and response coverage for APIs.

Defender for APIs helps you to gain visibility into business-critical APIs. You can investigate and improve your API security posture, prioritize vulnerability fixes, and quickly detect active real-time threats.

Learn more about [Defender for APIs](defender-for-apis-introduction.md).

## Next steps

For past changes to Defender for Cloud, see [Archive for what's new in Defender for Cloud?](release-notes-archive.md).
