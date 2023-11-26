---
title: Important upcoming changes
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 11/26/2023
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which might be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

<!-- Please don't adjust this next line without getting approval from the Defender for Cloud documentation team. It is necessary for proper RSS functionality. -->

On this page, you can learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might affect things like your secure score or workflows.

> [!TIP]
> Get notified when this page is updated by copying and pasting the following URL into your feed reader:
>
> `https://aka.ms/mdc/upcoming-rss`

If you're looking for the latest release notes, you can find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).

## Planned changes

| Planned change | Announcement date | Estimated date for change |
|--|--|--|
| [General availability of Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM) in Azure Government and Azure operated by 21Vianet](#general-availability-of-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-mdvm-in-azure-government-and-azure-operated-by-21vianet) | November 27, 2023 | December 2023 |
| [Public preview of Windows support for Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM)](#public-preview-of-windows-support-for-containers-vulnerability-assessment-powered-by-microsoft-defender-vulnerability-management-mdvm) | November 27, 2023 | December 2023 |
| [Consolidation of Defender for Cloud's Service Level 2 names](#consolidation-of-defender-for-clouds-service-level-2-names) | November 1, 2023 | December 2023 |
| [Changes to how Microsoft Defender for Cloud's costs are presented in Microsoft Cost Management](#changes-to-how-microsoft-defender-for-clouds-costs-are-presented-in-microsoft-cost-management) | October 25, 2023 | November 2023 |
| [Four alerts are set to be deprecated](#four-alerts-are-set-to-be-deprecated) | October 23, 2023 | November 23, 2023 |
| [Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled"](#replacing-the-key-vaults-should-have-purge-protection-enabled-recommendation-with-combined-recommendation-key-vaults-should-have-deletion-protection-enabled) |  | June 2023|
| [Preview alerts for DNS servers to be deprecated](#preview-alerts-for-dns-servers-to-be-deprecated) |  | August 2023 |
| [Classic connectors for multicloud will be retired](#classic-connectors-for-multicloud-will-be-retired) |  | September 2023 |
| [Change to the Log Analytics daily cap](#change-to-the-log-analytics-daily-cap) |  | September 2023 |
| [DevOps Resource Deduplication for Defender for DevOps](#devops-resource-deduplication-for-defender-for-devops) |  | November 2023 |
| [Deprecating two security incidents](#deprecating-two-security-incidents) |  | November 2023 |
| [Defender for Cloud plan and strategy for the Log Analytics agent deprecation](#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation) |  | August 2024 |

## General availability of Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM) in Azure Government and Azure operated by 21Vianet

**Announcement date: November 27, 2023**

**Estimated date for change: December 2023**

Vulnerability assessment (VA) for Linux container images in Azure container registries powered by Microsoft Defender Vulnerability Management (MDVM) will be released for General Availability (GA) in Azure Government and Azure operated by 21Vianet. This new release will be available under the Defender for Containers and Defender for Container Registries plans.

As part of this change, the following recommendations will be released for GA, and will be included in secure score calculation:

| Recommendation name                                          | Description                                                  | Assessment key                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------ |
| Azure registry container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management) | Container image vulnerability assessments scan your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. Resolving vulnerabilities can greatly improve your security posture, ensuring images are safe to use prior to deployment. | c0b7cfc6-3172-465a-b378-53c7ff2cc0d5 |
| Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) | Azure running container images should have vulnerabilities resolved (powered by Microsoft Defender Vulnerability Management). <br /><br />Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. This recommendation provides visibility to vulnerable images currently running in your Kubernetes clusters. Remediating vulnerabilities in container images that are currently running is key to improving your security posture, significantly reducing the attack surface for your containerized workloads. | c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5 |

Container image scan powered by MDVM now also incur charges according to [plan pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing).

> [!NOTE]
> Images scanned both by our container VA offering powered by Qualys and Container VA offering powered by MDVM will only be billed once.

The following Qualys recommendations for Containers Vulnerability Assessment will be renamed and will continue to be available for customers who enabled Defender for Containers on any of their subscriptions prior to this release. New customers onboarding Defender for Containers after this release will only see the new Container vulnerability assessment recommendations powered by Microsoft Defender Vulnerability Management.

| Current recommendation name                                  | New recommendation name                                      | Description                                                  | Assessment key                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------ |
| Container registry images should have vulnerability findings resolved (powered by Qualys) | Azure registry container images should have vulnerabilities resolved (powered by Qualys) | Container image vulnerability assessment scans your registry for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. | dbd0cb49-b563-45e7-9724-889e799fa648 |
| Running container images should have vulnerability findings resolved (powered by Qualys) | Azure running container images should have vulnerabilities resolved - (powered by Qualys) | Container image vulnerability assessment scans container images running on your Kubernetes clusters for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. | 41503391-efa5-47ee-9282-4eff6131462  |

## Public preview of Windows support for Containers Vulnerability Assessment powered by Microsoft Defender Vulnerability Management (MDVM)

**Announcement date: November 27, 2023**

**Estimated date for change: December 2023**

Support for Windows images will be released in public preview as part of Vulnerability assessment (VA) powered by Microsoft Defender Vulnerability Management (MDVM) for Azure container registries and Azure Kubernetes Services.

## Consolidation of Defender for Cloud's Service Level 2 names

**Announcement date: November 1, 2023**

**Estimated date for change: December 2023**

We're consolidating the legacy Service Level 2 names for all Defender for Cloud plans into a single new Service Level 2 name, **Microsoft Defender for Cloud**.

Today, there are four Service Level 2 names: Azure Defender, Advanced Threat Protection, Advanced Data Security, and Security Center. The various meters for Microsoft Defender for Cloud are grouped across these separate Service Level 2 names, creating complexities when using Cost Management + Billing, invoicing, and other Azure billing-related tools.

The change simplifies the process of reviewing Defender for Cloud charges and provide better clarity in cost analysis.

To ensure a smooth transition, we've taken measures to maintain the consistency of the Product/Service name, SKU, and Meter IDs. Impacted customers will receive an informational Azure Service Notification to communicate the changes.

Organizations that retrieve cost data by calling our APIs, will need to update the values in their calls to accommodate the change. For example, in this filter function, the values will return no information:

```json
"filter": {
          "dimensions": {
              "name": "MeterCategory",
              "operator": "In",
              "values": [
                  "Advanced Threat Protection",
                  "Advanced Data Security",
                  "Azure Defender",
                  "Security Center"
                ]
          }
      }
```

The change is planned to go into effect on December 1, 2023.

| OLD Service Level 2 name | NEW Service Level 2 name | Service Tier - Service Level 4 (No change) |
|--|--|--|
|Advanced Data Security    |Microsoft Defender for Cloud|Defender for SQL|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for Container Registries |
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for DNS |
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for Key Vault|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for Kubernetes|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for MySQL|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for PostgreSQL|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for Resource Manager|
|Advanced Threat Protection|Microsoft Defender for Cloud|Defender for Storage|
|Azure Defender            |Microsoft Defender for Cloud|Defender for External Attack Surface Management|
|Azure Defender            |Microsoft Defender for Cloud|Defender for Azure Cosmos DB|
|Azure Defender            |Microsoft Defender for Cloud|Defender for Containers|
|Azure Defender            |Microsoft Defender for Cloud|Defender for MariaDB|
|Security Center           |Microsoft Defender for Cloud|Defender for App Service|
|Security Center           |Microsoft Defender for Cloud|Defender for Servers|
|Security Center           |Microsoft Defender for Cloud|Defender CSPM |

## Changes to how Microsoft Defender for Cloud's costs are presented in Microsoft Cost Management

**Announcement date: October 26, 2023**

**Estimated date for change: November 2023**

In November there will be a change as to how Microsoft Defender for Cloud's costs are presented in Cost Management and in Subscriptions invoices.

Costs will be presented for each protected resource instead of as an aggregation of all resources on the subscription.

If a resource has a tag applied, which are often used by organizations to perform financial chargeback processes, it will be added to the appropriate billing lines.

## Four alerts are set to be deprecated

**Announcement date: October 23, 2023**

**Estimated date for change: November 23, 2023**

As part of our quality improvement process, the following security alerts are set to be deprecated:

- `Possible data exfiltration detected (K8S.NODE_DataEgressArtifacts)`
- `Executable found running from a suspicious location (K8S.NODE_SuspectExecutablePath)`
- `Suspicious process termination burst (VM_TaskkillBurst)`
- `PsExec execution detected (VM_RunByPsExec)`

## Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled"

**Estimated date for change: June 2023**

The `Key Vaults should have purge protection enabled` recommendation is deprecated from the (regulatory compliance dashboard/Azure security benchmark initiative) and replaced with a new combined recommendation `Key Vaults should have deletion protection enabled`.

| Recommendation name | Description | Effect(s) | Version |
|--|--|--|--|
| [Key vaults should have deletion protection enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b60c0b2-2dc2-4e1c-b5c9-abbed971de53)| A malicious insider in your organization can potentially delete and purge key vaults. Purge protection protects you from insider attacks by enforcing a mandatory retention period for soft deleted key vaults. No one inside your organization or Microsoft will be able to purge your key vaults during the soft delete retention period. | audit, deny, disabled | [2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/KeyVault_Recoverable_Audit.json) |

See the [full index of Azure Policy built-in policy definitions for Key Vault](../key-vault/policy-reference.md)

## Preview alerts for DNS servers to be deprecated

**Estimated date for change: August 2023**

Following quality improvement process, security alerts for DNS servers are set to be deprecated in August. For cloud resources, use [Azure DNS](defender-for-dns-introduction.md) to receive the same security value.

The following table lists the alerts to be deprecated:

| AlertDisplayName | AlertType |
|--|--|
| Communication with suspicious random domain name (Preview) | DNS_RandomizedDomain
| Communication with suspicious domain identified by threat intelligence (Preview) | DNS_ThreatIntelSuspectDomain |
| Digital currency mining activity (Preview) | DNS_CurrencyMining |
| Network intrusion detection signature activation (Preview) | DNS_SuspiciousDomain |
| Attempted communication with suspicious sinkholed domain (Preview) | DNS_SinkholedDomain |
| Communication with possible phishing domain (Preview) | DNS_PhishingDomain|
| Possible data transfer via DNS tunnel (Preview) | DNS_DataObfuscation |
| Possible data exfiltration via DNS tunnel (Preview) | DNS_DataExfiltration |
| Communication with suspicious algorithmically generated domain (Preview) | DNS_DomainGenerationAlgorithm |
| Possible data download via DNS tunnel (Preview) | DNS_DataInfiltration |
| Anonymity network activity (Preview) | DNS_DarkWeb |
| Anonymity network activity using web proxy (Preview) | DNS_DarkWebProxy |

## Classic connectors for multicloud will be retired

**Estimated date for change: September 15, 2023**

The classic multicloud connectors will be retiring on September 15, 2023 and no data will be streamed to them after this date. These classic connectors were used to connect AWS Security Hub and GCP Security Command Center recommendations to Defender for Cloud and onboard AWS EC2s to Defender for Servers.

The full value of these connectors has been replaced with the native multicloud security connectors experience, which has been Generally Available for AWS and GCP since March 2022 at no extra cost.

The new native connectors are included in your plan and offer an automated onboarding experience with options to onboard single accounts, multiple accounts (with Terraform), and organizational onboarding with auto provisioning for the following Defender plans: free foundational CSPM capabilities, Defender Cloud Security Posture Management (CSPM), Defender for Servers, Defender for SQL, and Defender for Containers.

If you're currently using the classic multicloud connectors, we strongly recommend that you begin your migration to the native security connectors before September 15, 2023.

How to migrate to the native security connectors:

- [Connect your AWS account to Defender for Cloud](quickstart-onboard-aws.md)
- [Connect your GCP project to Defender for Cloud](quickstart-onboard-gcp.md)

## Change to the Log Analytics daily cap

Azure monitor offers the capability to [set a daily cap](../azure-monitor/logs/daily-cap.md) on the data that is ingested on your Log analytics workspaces. However, Defenders for Cloud security events are currently not supported in those exclusions.

Starting on September 18, 2023 the Log Analytics Daily Cap will no longer exclude the following set of data types:

- WindowsEvent
- SecurityAlert
- SecurityBaseline
- SecurityBaselineSummary
- SecurityDetection
- SecurityEvent
- WindowsFirewall
- MaliciousIPCommunication
- LinuxAuditLog
- SysmonEvent
- ProtectionStatus
- Update
- UpdateSummary
- CommonSecurityLog
- Syslog

At that time, all billable data types will be capped if the daily cap is met. This change improves your ability to fully contain costs from higher-than-expected data ingestion.

Learn more about [workspaces with Microsoft Defender for Cloud](../azure-monitor/logs/daily-cap.md#workspaces-with-microsoft-defender-for-cloud).

## DevOps Resource Deduplication for Defender for DevOps

**Estimated date for change: November 2023**

To improve the Defender for DevOps user experience and enable further integration with Defender for Cloud's rich set of capabilities, Defender for DevOps will no longer support duplicate instances of a DevOps organization to be onboarded to an Azure tenant.

If you don't have an instance of a DevOps organization onboarded more than once to your organization, no further action is required. If you do have more than one instance of a DevOps organization onboarded to your tenant, the subscription owner will be notified and will need to delete the DevOps Connector(s) they don't want to keep by navigating to Defender for Cloud Environment Settings.

Customers will have until November 14, 2023 to resolve this issue. After this date, only the most recent DevOps Connector created where an instance of the DevOps organization exists will remain onboarded to Defender for DevOps. For example, if Organization Contoso exists in both connectorA and connectorB, and connectorB was created after connectorA, then connectorA will be removed from Defender for DevOps.

## Defender for Cloud plan and strategy for the Log Analytics agent deprecation

**Estimated date for change: August 2024**

The Azure Log Analytics agent, also known as the Microsoft Monitoring Agent (MMA) will be [retired in August 2024.](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/) As a result, features of the two Defender for Cloud plans that rely on the Log Analytics agent are impacted, and they have updated strategies: [Defender for Servers](#defender-for-servers) and [Defender for SQL Server on machines](#defender-for-sql-server-on-machines).

### Key strategy points

- The Azure monitoring Agent (AMA) won’t be a requirement of the Defender for Servers offering, but will remain required as part of Defender for SQL.
- Defender for Servers MMA-based features and capabilities will be deprecated in their Log Analytics version in August 2024, and delivered over alternative infrastructures, before the MMA deprecation date.
- In addition, the currently shared autoprovisioning process that provides the installation and configuration of both agents (MMA/AMA), will be adjusted accordingly.

### Defender for Servers

The following table explains how each capability will be provided after the Log Analytics agent retirement:

| **Feature**                                                  | **Deprecation plan**                                                  | **Alternative**                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Defender for Endpoint/Defender for Cloud integration  for down level machines (Windows Server  2012 R2, 2016) | Defender for Endpoint integration that uses the  legacy Defender for Endpoint sensor and the Log Analytics agent (for Windows Server 2016 and Windows  Server 2012 R2 machines) won’t be supported after August 2024. | Enable the GA [unified agent](/microsoft-365/security/defender-endpoint/configure-server-endpoints#new-windows-server-2012-r2-and-2016-functionality-in-the-modern-unified-solution) integration to  maintain support for machines, and receive the full extended feature set. For more information, see [Enable the Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md#windows). |
| OS-level threat detection (agent-based)                      | OS-level threat detection based  on the Log Analytics agent won’t be available after August 2024.  A full list of deprecated detections will be provided soon. | OS-level detections are provided by Defender for Endpoint integration  and are already GA. |
| Adaptive application controls                                | The [current GA version](adaptive-application-controls.md) based on the  Log Analytics agent will be deprecated in August 2024, along with the preview version based on the Azure monitoring agent. | Adaptive Application Controls feature as it is today will be discontinued, and new capabilities in the application control space (on top of what Defender for Endpoint and Windows Defender Application Control offer today) will be considered as part of future Defender for Servers roadmap. |
| Endpoint protection discovery recommendations                | The current [GA recommendations](endpoint-protection-recommendations-technical.md) to install endpoint protection and fix health issues in the detected solutions will be deprecated in August 2024. The preview recommendations available today over Azure Monitor agent (AMA) will be deprecated when the alternative is provided over Agentless Disk Scanning capability. | A new agentless version will be provided for discovery and configuration gaps by April 2024. As part of this upgrade, this feature will be provided as a component of Defender for Servers plan 2 and Defender CSPM, and won’t cover on-premises or Arc-connected machines. |
| Missing OS patches (system  updates)                         | Recommendations to apply system updates based on the Log Analytics agent won’t be available after August 2024.  The preview version available today over Guest Configuration agent will be deprecated when the alternative is provided over MDVM premium capabilities. Support of this feature for Docker-hub and VMMS will be deprecated in Aug 2024 and will be considered as part of future Defender for Servers roadmap.| [New recommendations](release-notes.md#two-recommendations-related-to-missing-operating-system-os-updates-were-released-to-ga), based on integration  with Update Manager, are already in GA, with no agent dependencies. |
| OS misconfigurations (Azure Security Benchmark  recommendations) | The [current GA version](apply-security-baseline.md) based on the Log Analytics agent won’t be  available after August 2024.   The current preview version that uses the Guest  Configuration agent will be deprecated as the Microsoft Defender  Vulnerability Management integration becomes available. | A new version, based on integration with Premium  Microsoft Defender Vulnerability Management, will be available early in 2024,  as part of Defender for Servers plan 2. |
| File integrity monitoring                                    | The [current GA version](file-integrity-monitoring-enable-log-analytics.md) based on the Log Analytics agent won’t be available after August 2024. The FIM [Public Preview version](file-integrity-monitoring-enable-ama.md) based on Azure Monitor Agent (AMA), will be deprecated when the alternative is provided over Defender for Endpoint.| A new version of this feature will be provided based on Microsoft Defender for Endpoint integration by April 2024. |
| The  [500-MB benefit](faq-defender-for-servers.yml#is-the-500-mb-of-free-data-ingestion-allowance-applied-per-workspace-or-per-machine-) for data  ingestion | The [500-MB benefit](faq-defender-for-servers.yml#is-the-500-mb-of-free-data-ingestion-allowance-applied-per-workspace-or-per-machine-)  for data ingestion over the defined tables will remain supported via the AMA agent for the machines  under subscriptions covered by Defender for Servers P2. Every machine is  eligible for the benefit only once, even if both Log Analytics agent and  Azure Monitor agent are installed on it. |                                                              |

#### Log analytics and Azure Monitoring agents autoprovisioning experience

The current provisioning process that provides the installation and configuration of both agents (MMA/AMA), will be adjusted according to the plan mentioned above:

1. MMA autoprovisioning mechanism and its related policy initiative will remain optional and supported until August 2024 through the Defender for Cloud platform.
1. In October 2023:
   1. The current shared ‘Log Analytics agent’/’Azure Monitor agent’ autoprovisioning mechanism will be updated and applied to ‘Log Analytics agent’ only.

      1. **Azure Monitor agent** (AMA) related Public Preview policy initiatives will be deprecated and replaced with the new autoprovisioning process for Azure Monitor agent (AMA), targeting only Azure registered SQL servers (SQL Server on Azure VM/ Arc-enabled SQL Server).

1. Current customers with AMA with the Public Preview policy initiative enabled will still be supported but are recommended to migrate to the new policy.

To ensure the security of your servers and receive all the security updates from Defender for Servers, make sure to have [Defender for Endpoint integration](integration-defender-for-endpoint.md) and [agentless disk scanning](concept-agentless-data-collection.md) enabled on your subscriptions. This will also keep your servers up-to-date with the alternative deliverables.

### Agents migration planning

**First, all Defender for Servers customers are advised to enable Defender for Endpoint integration and agentless disk scanning as part of the Defender for Servers offering, at no additional cost.** This will ensure you're automatically covered with the new alternative deliverables, with no extra onboarding required.

Following that, plan your migration plan according to your organization requirements:

|Azure Monitor agent (AMA) required (for Defender for SQL or other scenarios)|FIM/EPP discovery/Baselined is required as part of Defender for Server|What should I do|
| -------- | -------- | -------- |
|No|Yes|You can remove MMA starting April 2024, using GA version of Defender for Server capabilities according to your needs (preview versions will be available earlier)|
|No|No|You can remove MMA starting now|
|Yes|No|You can start migration from MMA to AMA now|
|Yes|Yes|You can either start migration from MMA to AMA starting April 2024 or alternatively, you can use both agents side by side starting now.|

**Customers with Log analytics Agent** **(MMA) enabled**

- If the following features are required in your organization: File Integrity Monitoring (FIM), Endpoint Protection recommendations, OS misconfigurations (security baselines recommendations), you can start retiring from MMA in April 2024 when an alternative will be delivered in GA (preview versions will be available earlier).

- If the features mentioned above are required in your organization, and Azure Monitor agent (AMA) is required for other services as well, you can start migrating from MMA to AMA in April 2024. Alternatively, use both MMA and AMA to get all GA features, then remove MMA in April 2024.

- If the features mentioned above aren't required, and Azure Monitor agent (AMA) is required for other services, you can start migrating from MMA to AMA now. However, note that the preview Defender for Servers capabilities over AMA will be deprecated in April 2024.

**Customers with Azure Monitor agent (AMA) enabled**

No action is required from your end.

- You’ll receive all Defender for Servers GA capabilities through Agentless and Defender for Endpoint. The following features will be available in GA in April 2024: File Integrity Monitoring (FIM), Endpoint Protection recommendations, OS misconfigurations (security baselines recommendations). The preview Defender for Servers capabilities over AMA will be deprecated in April 2024.

> [!IMPORTANT]
> For more information about how to plan for this change, see [Microsoft Defender for Cloud - strategy and plan towards Log Analytics Agent (MMA) deprecation](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341).

### Defender for SQL Server on machines

The Defender for SQL Server on machines plan relies on the Log Analytics agent (MMA) / Azure monitoring agent (AMA) to provide Vulnerability Assessment and Advanced Threat Protection to IaaS SQL Server instances. The plan supports Log Analytics agent autoprovisioning in GA, and Azure Monitoring agent autoprovisioning in Public Preview.

The following section describes the planned introduction of a new and improved SQL Server-targeted Azure monitoring agent (AMA) autoprovisioning process and the deprecation procedure of the Log Analytics agent (MMA). On-premises SQL servers using MMA will require the Azure Arc agent when migrating to the new process due to AMA requirements. Customers who use the new autoprovisioning process will benefit from a simple and seamless agent configuration, reducing onboarding errors and providing broader protection coverage.

| Milestone                                                 | Date          | More information                                             |
| --------------------------------------------------------- | ------------- | ------------------------------------------------------------ |
| SQL-targeted AMA autoprovisioning Public Preview release | October 2023  | The new autoprovisioning process will only target Azure registered SQL servers (SQL Server on Azure VM/ Arc-enabled SQL Server). The current AMA autoprovisioning process and its related policy initiative will be deprecated. It can still be used customers, but they won't be eligible for support. |
| SQL-targeted AMA autoprovisioning GA release             | December 2023 | GA release of a SQL-targeted AMA autoprovisioning process. Following the release, it will be defined as the default option for all new customers. |
| MMA deprecation                                           | August 2024   | The current MMA autoprovisioning process and its related policy initiative will be deprecated. It can still be used customers, but they won't be eligible for support. |

## Deprecating two security incidents

**Estimated date for change: November 2023**

Following quality improvement process, the following security incidents are set to be deprecated: `Security incident detected suspicious virtual machines activity` and `Security incident detected on multiple machines`.

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md).
