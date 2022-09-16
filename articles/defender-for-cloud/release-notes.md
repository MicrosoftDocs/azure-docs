---
title: Release notes for Microsoft Defender for Cloud
description: A description of what's new and changed in Microsoft Defender for Cloud
author: bmansheim
ms.author: benmansheim
ms.topic: reference
ms.date: 08/31/2022
---

# What's new in Microsoft Defender for Cloud?

Defender for Cloud is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about new features, bug fixes, and deprecated functionality.

This page is updated frequently, so revisit it often.

To learn about *planned* changes that are coming soon to Defender for Cloud, see [Important upcoming changes to Microsoft Defender for Cloud](upcoming-changes.md).

> [!TIP]
> If you're looking for items older than six months, you'll find them in the [Archive for What's new in Microsoft Defender for Cloud](release-notes-archive.md).

## September 2022

- [Suppress alerts based on Container and Kubernetes entities](#suppress-alerts-based-on-container-and-kubernetes-entities)
- [Defender for Servers supports File Integrity Monitoring with Azure Monitor Agent](#defender-for-servers-supports-file-integrity-monitoring-with-azure-monitor-agent)

### Suppress alerts based on Container and Kubernetes entities

You can now suppress alerts based on these Kubernetes entities so you can use the container environment details to align your alerts your organization's policy and stop receiving unwanted alerts:

- Container Image
- Container Registry
- Kubernetes Namespace
- Kubernetes Pod
- Kubernetes Service
- Kubernetes Secret
- Kubernetes ServiceAccount
- Kubernetes Deployment
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

## August 2022

Updates in August include:

- [Vulnerabilities for running images are now visible with Defender for Containers on your Windows containers](#vulnerabilities-for-running-images-are-now-visible-with-defender-for-containers-on-your-windows-containers)
- [Azure Monitor Agent integration now in preview](#azure-monitor-agent-integration-now-in-preview)
- [Deprecated VM alerts regarding suspicious activity related to a Kubernetes cluster](#deprecated-vm-alerts-regarding-suspicious-activity-related-to-a-kubernetes-cluster)
- [Container vulnerabilities now include detailed package information](#container-vulnerabilities-now-include-detailed-package-information)

### Vulnerabilities for running images are now visible with Defender for Containers on your Windows containers 

Defender for Containers now shows vulnerabilities for running Windows containers.

When vulnerabilities are detected, Defender for Cloud generates the following security recommendation listing the detected issues: [Running container images should have vulnerability findings resolved](https://ms.portal.azure.com/#view/Microsoft_Azure_Security_CloudNativeCompute/KubernetesRuntimeVisibilityRecommendationDetailsBlade/assessmentKey/41503391-efa5-47ee-9282-4eff6131462c/showSecurityCenterCommandBar~/false).

Learn more about [viewing vulnerabilities for running images](defender-for-containers-introduction.md#view-vulnerabilities-for-running-images).

### Azure Monitor Agent integration now in preview
 
Defender for Cloud now includes preview support for the [Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) (AMA). AMA is intended to replace the legacy Log Analytics agent (also referred to as the Microsoft Monitoring Agent (MMA)), which is on a path to deprecation. AMA [provides a number of benefits](../azure-monitor/agents/azure-monitor-agent-migration.md#benefits) over legacy agents.
 
In Defender for Cloud, when you [enable auto provisioning for AMA](auto-deploy-azure-monitoring-agent.md), the agent is deployed on **existing and new** VMs and Azure Arc-enabled machines that are detected in your subscriptions. If Defender for Cloud plans are enabled, AMA collects configuration information and event logs from Azure VMs and Azure Arc machines. Note that the AMA integration is in preview, so we recommend using it in test environments, rather than in production environments.


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

This feature is in `preview` and is only available for Linux images.

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
| `Ensure that 'Python version' is the latest, if used as a part of the API app` | `App Service apps that use Python should use the latest 'Python version` |
| `CORS should not allow every resource to access your API App` | `App Service apps should not have CORS configured to allow every resource to access your apps` |
| `Managed identity should be used in your API App` | `App Service apps should use managed identity` |
| `Remote debugging should be turned off for API Apps` | `App Service apps should have remote debugging turned off` |
| `Ensure that 'PHP version' is the latest, if used as a part of the API app` | `App Service apps that use PHP should use the latest 'PHP version'`|
| `FTPS only should be required in your API App` | `App Service apps should require FTPS only` |
| `Ensure that 'Java version' is the latest, if used as a part of the API app` | `App Service apps that use Java should use the latest 'Java version` |
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

Now with the governance experience, security teams can assign remediation of security recommendations to the resource owners and require a remediation schedule. They can have full transparency into the progress of the remediation and get notified when tasks are overdue.

This feature is free while it is in the preview phase.

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

## May 2022

Updates in May include:

- [Multicloud settings of Servers plan are now available in connector level](#multicloud-settings-of-servers-plan-are-now-available-in-connector-level)
- [JIT (Just-in-time) access for VMs is now available for AWS EC2 instances (Preview)](#jit-just-in-time-access-for-vms-is-now-available-for-aws-ec2-instances-preview)
- [Add and remove the Defender profile for AKS clusters using the CLI](#add-and-remove-the-defender-profile-for-aks-clusters-using-the-cli)

### Multicloud settings of Servers plan are now available in connector level

There are now connector-level settings for Defender for Servers in multicloud.

The new connector-level settings provide granularity for pricing and auto-provisioning configuration per connector, independently of the subscription.

All auto-provisioning components available in the connector level (Azure Arc, MDE, and vulnerability assessments) are enabled by default, and the new configuration supports both [Plan 1 and Plan 2 pricing tiers](defender-for-servers-introduction.md#defender-for-servers-plans).

Updates in the UI include a reflection of the selected pricing tier and the required components configured.

:::image type="content" source="media/release-notes/main-page.png" alt-text="Screenshot of the main plan page with the Server plan multicloud settings." lightbox="media/release-notes/main-page.png":::

:::image type="content" source="media/release-notes/auto-provision.png" alt-text="Screenshot of the auto-provision page with the multicloud connector enabled.":::

### Changes to vulnerability assessment

Defender for Containers now displays vulnerabilities that have medium and low severities that aren't patchable.

As part of this update, vulnerabilities that have medium and low severities are now shown, whether or not patches are available. This update provides maximum visibility, but still allows you to filter out undesired vulnerabilities by using the provided Disable rule.

:::image type="content" source="media/release-notes/disable-rule.png" alt-text="Screenshot of the disable rule screen.":::

Learn more about [vulnerability management](deploy-vulnerability-assessment-tvm.md)

### JIT (Just-in-time) access for VMs is now available for AWS EC2 instances (Preview)

When you [connect AWS accounts](quickstart-onboard-aws.md), JIT will automatically evaluate the network configuration of your instance's security groups and recommend which instances need protection for their exposed management ports. This is similar to how JIT works with Azure. When you onboard unprotected EC2 instances, JIT will block public access to the management ports, and only open them with authorized requests for a limited time frame.

Learn how [JIT protects your AWS EC2 instances](just-in-time-access-overview.md#how-jit-operates-with-network-resources-in-azure-and-aws)

### Add and remove the Defender profile for AKS clusters using the CLI

The Defender profile (preview) is required for Defender for Containers to provide the runtime protections and collects signals from nodes. You can now use the Azure CLI to [add and remove the Defender profile](defender-for-containers-enable.md?tabs=k8s-deploy-cli%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Ck8s-remove-cli&pivots=defender-for-container-aks#use-azure-cli-to-deploy-the-defender-extension) for an AKS cluster.

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

While Defender for Servers Plan 2 continues to provide protections from threats and vulnerabilities to your cloud and on-premises workloads, Defender for Servers Plan 1 provides endpoint protection only, powered by the natively integrated Defender for Endpoint. Read more about the [Defender for Servers plans](defender-for-servers-introduction.md#defender-for-servers-plans).

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

The recommendation `Azure Cache for Redis should reside within a virtual network` (Preview) has been deprecated. We’ve changed our guidance for securing Azure Cache for Redis instances. We recommend the use of a private endpoint to restrict access to your Azure Cache for Redis instance, instead of a virtual network.

### New alert variant for Microsoft Defender for Storage (preview) to detect exposure of sensitive data

Microsoft Defender for Storage's alerts notifies you when threat actors attempt to scan and expose, successfully or not, misconfigured, publicly open storage containers to try to exfiltrate sensitive information.

To allow for faster triaging and response time, when exfiltration of potentially sensitive data may have occurred, we've released a new variation to the existing `Publicly accessible storage containers have been exposed` alert.

The new alert, `Publicly accessible storage containers with potentially sensitive data have been exposed`, is triggered with a `High` severity level, after there has been a successful discovery of a publicly open storage container(s) with names that statistically have been found to rarely be exposed publicly, suggesting they might hold sensitive information.

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
