---
title: Release notes
description: This page is updated frequently with the latest updates in Defender for Cloud.
ms.topic: overview
ms.date: 12/21/2023
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

## December 2023

| Date | Update |
|--|--|
| December 21 | [Release of the Coverage workbook](#release-of-the-coverage-workbook) | 
| December 14 | [General availability of Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management in Azure Government and Azure operated by 21Vianet](#general-availability-of-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-in-azure-government-and-azure-operated-by-21vianet) |
| December 14 | [Public preview of Windows support for Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management](#public-preview-of-windows-support-for-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management) |
| December 13 | [Retirement of AWS container vulnerability assessment powered by Trivy](#retirement-of-aws-container-vulnerability-assessment-powered-by-trivy) |
| December 13 | [Agentless container posture for AWS in Defender for Containers and Defender CSPM (Preview)](#agentless-container-posture-for-aws-in-defender-for-containers-and-defender-cspm-preview) |
| December 13 | [Deny effect - replacing deprecated policies](#deny-effect---replacing-deprecated-policies) |
| December 13 | [General availability (GA) support for PostgreSQL Flexible Server in Defender for open-source relational databases plan](#general-availability-support-for-postgresql-flexible-server-in-defender-for-open-source-relational-databases-plan) |
| December 12 | [Container vulnerability assessment powered by Microsoft Defender Vulnerability Management now supports Google Distroless](#container-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-now-supports-google-distroless) |
| December 4 | [Defender for Storage alert released for preview: malicious blob was downloaded from a storage account](#defender-for-storage-alert-released-for-preview-malicious-blob-was-downloaded-from-a-storage-account) |

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
| Running container images should have vulnerability findings resolved (powered by Qualys) | Azure running container images should have vulnerabilities resolved - (powered by Qualys) | Container image vulnerability assessment scans container images running on your Kubernetes clusters for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. | 41503391-efa5-47ee-9282-4eff6131462  |

### Public preview of Windows support for Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management

December 14, 2023

Support for Windows images was released in public preview as part of Vulnerability assessment (VA) powered by Microsoft Defender Vulnerability Management for Azure container registries and Azure Kubernetes Services.

### Retirement of AWS container vulnerability assessment powered by Trivy

December 13, 2023

The [container vulnerability assessment powered by Trivy](defender-for-containers-vulnerability-assessment-elastic.md) is now on a retirement path to be completed by February 13. This capability is now deprecated and will continue to be available to existing customers using this capability until February 13. We encourage customers using this capability to upgrade to the new [AWS container vulnerability assessment powered by Microsoft Defender Vulnerability Management](agentless-vulnerability-assessment-aws.md) by February 13.

### Agentless container posture for AWS in Defender for Containers and Defender CSPM (Preview)

December 13, 2023

The new Agentless container posture (Preview) capabilities are available for AWS. For more information, see [Agentless container posture in Defender CSPM](concept-agentless-containers.md) and [Agentless capabilities in Defender for Containers](defender-for-containers-introduction.md#agentless-capabilities).

### Deny effect - replacing deprecated policies

December 13, 2023

The [Deny effect](manage-mcsb.md#deny-and-enforce-recommendations) is used to prevent deployment of resources that don't comply with the [Microsoft Cloud Security Benchmark (MCSB) standard](concept-regulatory-compliance.md). A change in the policy's effects requires the deprecation of the current versions of the policy.

To make sure you can still use the Deny effect, you must delete the old policies and assign the new policies in their place.

**Deprecated policies**:

- Function apps should use the latest TLS version
- App Service apps should have local authentication methods disabled for FTP deployments
- Function app slots should use the latest TLS version
- App Service app slots should have local authentication methods disabled for FTP deployments
- App Service apps should use the latest TLS version
- App Service apps should have local authentication methods disabled for SCM site deployments
- App Service app slots should use the latest TLS version
- App Service app slots should have local authentication methods disabled for SCM site deployments

Learn how to [Enable and configure at scale with an Azure built-in policy](defender-for-storage-policy-enablement.md).

Check out [Azure Policy built-in definitions for Microsoft Defender for Cloud](policy-reference.md).

### General availability support for PostgreSQL Flexible Server in Defender for open-source relational databases plan

December 13, 2023

We're announcing the general availability (GA) release of PostgreSQL Flexible Server support in the [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md) plan. Microsoft Defender for open-source relational databases provides advanced threat protection to PostgreSQL Flexible Servers, by detecting anomalous activities and generating [security alerts](defender-for-databases-usage.md).

Learn how to [Enable Microsoft Defender for open-source relational databases](defender-for-databases-usage.md).

### Container vulnerability assessment powered by Microsoft Defender Vulnerability Management now supports Google Distroless

Container vulnerability assessment powered by Microsoft Defender Vulnerability Management have been extended with additional coverage for Linux OS packages, now supporting Google Distroless.

For a list of all supported operating systems, see [Registries and images support for Azure - Vulnerability assessment powered by Microsoft Defender Vulnerability Management](support-matrix-defender-for-containers.md#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management).

### Defender for Storage alert released for preview: malicious blob was downloaded from a storage account

December 4, 2023

The following alert is being released for preview:

|Alert (alert type)|Description|MITRE tactics|Severity|
|----|----|----|----|
| **Malicious blob was downloaded from a storage account (Preview)**<br>Storage.Blob_MalwareDownload | The alert indicates that a malicious blob was downloaded from a storage account. Potential causes may include malware that was uploaded to the storage account and not removed or quarantined, thereby enabling a threat actor to download it, or an unintentional download of the malware by legitimate users or applications. <br>Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2 or premium block blobs) storage accounts with the new Defender for Storage plan with the Malware Scanning feature enabled. | Lateral Movement | High, if Eicar - low |

See the [extension-based alerts in Defender for Storage](alerts-reference.md#alerts-azurestorage).

For a complete list of alerts, see the [reference table for all security alerts in Microsoft Defender for Cloud](alerts-reference.md).

## November 2023

| Date | Update |
|--|--|
| November 27 | [General availability of agentless secret scanning in Defender for Servers and Defender CSPM](#general-availability-of-agentless-secret-scanning-in-defender-for-servers-and-defender-cspm) |
| November 22 | [Enable permissions management with Defender for Cloud (Preview)](#enable-permissions-management-with-defender-for-cloud-preview) |
| November 22 | [Defender for Cloud integration with ServiceNow](#defender-for-cloud-integration-with-servicenow) |
| November 20| [General Availability of the autoprovisioning process for SQL Servers on machines plan](#general-availability-of-the-autoprovisioning-process-for-sql-servers-on-machines-plan)|
| November 15  | [General availability of Defender for APIs](#general-availability-of-defender-for-apis) |
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

### General availability of agentless secret scanning in Defender for Servers and Defender CSPM

November 27, 2023

Agentless secret scanning enhances the security cloud based Virtual Machines (VM) by identifying plaintext secrets on VM disks. Agentless secret scanning provides comprehensive information to help prioritize detected findings and mitigate lateral movement risks before they occur. This proactive approach prevents unauthorized access, ensuring your cloud environment remains secure.

We're announcing the General Availability (GA) of agentless secret scanning, which is included in both the [Defender for Servers P2](tutorial-enable-servers-plan.md) and the [Defender CSPM](tutorial-enable-cspm-plan.md) plans.

Agentless secret scanning utilizes cloud APIs to capture snapshots of your disks, conducting out-of-band analysis that ensures that there's no effect on your VM's performance. Agentless secret scanning broadens the coverage offered by Defender for Cloud over cloud assets across Azure, AWS, and GCP environments to enhance your cloud security.

With this release, Defender for Cloud's detection capabilities now support other database types, data store signed URLs, access tokens, and more.

Learn how to [manage secrets with agentless secret scanning](secret-scanning.md).

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

Customers using the MMA autoprovisioning process are requested to [migrate to the new Azure Monitoring Agent for SQL server on machines autoprovisioning process](/azure/defender-for-cloud/defender-for-sql-autoprovisioning). The migration process is seamless and provides continuous protection for all machines.  

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

For more information, see [Container Vulnerability Assessment powered by MDVM](agentless-vulnerability-assessment-azure.md) and [Microsoft Defender Vulnerability Management (MDVM)](/microsoft-365/security/defender-vulnerability-management/defender-vulnerability-management).

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


## Next steps

For past changes to Defender for Cloud, see [Archive for what's new in Defender for Cloud?](release-notes-archive.md).
