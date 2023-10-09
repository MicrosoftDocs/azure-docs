---
title: Important upcoming changes
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 10/09/2023
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which might be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

[Defender for Servers](#defender-for-servers)
On this page, you can learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might affect things like your secure score or workflows.

> [!TIP]
> Get notified when this page is updated by copying and pasting the following URL into your feed reader:
>
> `https://aka.ms/mdc/upcoming-rss`

If you're looking for the latest release notes, you can find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).

## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled"](#replacing-the-key-vaults-should-have-purge-protection-enabled-recommendation-with-combined-recommendation-key-vaults-should-have-deletion-protection-enabled) | June 2023|
| [Changes to the Defender for DevOps recommendations environment source and resource ID](#changes-to-the-defender-for-devops-recommendations-environment-source-and-resource-id) | August 2023 |
| [Preview alerts for DNS servers to be deprecated](#preview-alerts-for-dns-servers-to-be-deprecated) | August 2023 |
| [Classic connectors for multicloud will be retired](#classic-connectors-for-multicloud-will-be-retired) | September 2023 |
| [Change to the Log Analytics daily cap](#change-to-the-log-analytics-daily-cap) | September 2023 |
| [DevOps Resource Deduplication for Defender for DevOps](#devops-resource-deduplication-for-defender-for-devops) | September 2023 |
| [Changes to Attack Path's Azure Resource Graph table scheme](#changes-to-attack-paths-azure-resource-graph-table-scheme) | November 2023 |
| [Defender for Cloud plan and strategy for the Log Analytics agent deprecation](#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation) | August 2024 |

### Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled"

**Estimated date for change: June 2023**

The `Key Vaults should have purge protection enabled` recommendation is deprecated from the (regulatory compliance dashboard/Azure security benchmark initiative) and replaced with a new combined recommendation `Key Vaults should have deletion protection enabled`.

| Recommendation name | Description | Effect(s) | Version |
|--|--|--|--|
| [Key vaults should have deletion protection enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b60c0b2-2dc2-4e1c-b5c9-abbed971de53)| A malicious insider in your organization can potentially delete and purge key vaults. Purge protection protects you from insider attacks by enforcing a mandatory retention period for soft deleted key vaults. No one inside your organization or Microsoft will be able to purge your key vaults during the soft delete retention period. | audit, deny, disabled | [2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/KeyVault_Recoverable_Audit.json) |

See the [full index of Azure Policy built-in policy definitions for Key Vault](../key-vault/policy-reference.md)

### Changes to the Defender for DevOps recommendations environment source and resource ID

**Estimated date for change: August 2023**

The Security DevOps recommendations will be updated to align with the overall Microsoft Defender for Cloud features and experience.  Affected recommendations will point to a new recommendation source environment and have an updated resource ID.

Security DevOps recommendations impacted:

- Code repositories should have code scanning findings resolved (preview)
- Code repositories should have secret scanning findings resolved (preview)
- Code repositories should have dependency vulnerability scanning findings resolved (preview)
- Code repositories should have infrastructure as code scanning findings resolved (preview)
- GitHub repositories should have code scanning enabled (preview)
- GitHub repositories should have Dependabot scanning enabled (preview)
- GitHub repositories should have secret scanning enabled (preview)

The recommendation environment source will be updated from `Azure` to `AzureDevOps` or `GitHub`.

The format for resource IDs will be changed from:

`Microsoft.SecurityDevOps/githubConnectors/owners/repos/`

To:

`Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/repos`
`Microsoft.Security/securityConnectors/devops/gitHubOwners/repos`

As a part of the migration, source code management system specific recommendations will be created for security findings:

- GitHub repositories should have code scanning findings resolved (preview)
- GitHub repositories should have secret scanning findings resolved (preview)
- GitHub repositories should have dependency vulnerability scanning findings resolved (preview)
- GitHub repositories should have infrastructure as code scanning findings resolved (preview)
- GitHub repositories should have code scanning enabled (preview)
- GitHub repositories should have Dependabot scanning enabled (preview)
- GitHub repositories should have secret scanning enabled (preview)
- Azure DevOps repositories should have code scanning findings resolved (preview)
- Azure DevOps repositories should have secret scanning findings resolved (preview)
- Azure DevOps repositories should have infrastructure as code scanning findings resolved (preview)

Customers that rely on the `resourceID` to query DevOps recommendation data will be affected. For example, Azure Resource Graph queries, workbooks queries, API calls to Microsoft Defender for Cloud.

Queries will need to be updated to include both the old and new `resourceID` to show both, for example, total over time.

Additionally, customers that have created custom queries using the DevOps workbook will need to update the assessment keys for the impacted DevOps security recommendations. The template DevOps workbook is planned to be updated to reflect the new recommendations, although during the actual migration, customers might experience some errors with the workbook.

The experience on the recommendations page will be impacted and require customers to query under "All recommendations" to view the new DevOps recommendations. For Azure DevOps, deprecated assessments might continue to show for a maximum of 14 days if new pipelines are not run.  Refer to [Defender for DevOps Common questions](/azure/defender-for-cloud/faq-defender-for-devops#why-don-t-i-see-recommendations-for-findings-) for details.

### Preview alerts for DNS servers to be deprecated

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

### Classic connectors for multicloud will be retired

**Estimated date for change: September 15, 2023**

The classic multicloud connectors will be retiring on September 15, 2023 and no data will be streamed to them after this date. These classic connectors were used to connect AWS Security Hub and GCP Security Command Center recommendations to Defender for Cloud and onboard AWS EC2s to Defender for Servers.

The full value of these connectors has been replaced with the native multicloud security connectors experience, which has been Generally Available for AWS and GCP since March 2022 at no additional cost.

The new native connectors are included in your plan and offer an automated onboarding experience with options to onboard single accounts, multiple accounts (with Terraform), and organizational onboarding with auto provisioning for the following Defender plans: free foundational CSPM capabilities, Defender Cloud Security Posture Management (CSPM), Defender for Servers, Defender for SQL, and Defender for Containers.

If you're currently using the classic multicloud connectors, we strongly recommend that you begin your migration to the native security connectors before September 15, 2023.

How to migrate to the native security connectors:

- [Connect your AWS account to Defender for Cloud](quickstart-onboard-aws.md)
- [Connect your GCP project to Defender for Cloud](quickstart-onboard-gcp.md)

### Change to the Log Analytics daily cap

Azure monitor offers the capability to [set a daily cap](../azure-monitor/logs/daily-cap.md) on the data that is ingested on your Log analytics workspaces. However, Defender for Cloud security events are currently not supported in those exclusions.

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



#### Key strategy points

- The Azure monitoring Agent (AMA) won’t be a requirement of the Defender for Servers offering, but will remain required as part of Defender for SQL.
- Defender for Servers MMA-based features and capabilities will be deprecated in their Log Analytics version in August 2024, and delivered over alternative infrastructures, before the MMA deprecation date.
- In addition, the currently shared autoprovisioning process that provides the installation and configuration of both agents (MMA/AMA), will be adjusted accordingly.


#### Defender for Servers

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

##### Log analytics and Azure Monitoring agents autoprovisioning experience

The current provisioning process that provides the installation and configuration of both agents (MMA/AMA), will be adjusted according to the plan mentioned above: 

1. MMA auto-provisioning mechanism and its related policy initiative will remain optional and supported until August 2024 through the Defender for Cloud platform.   
1. In October 2023: 
   1. The current shared ‘Log Analytics agent’/’Azure Monitor agent’ auto-provisioning mechanism will be updated and applied to ‘Log Analytics agent’ only.  

      1. **Azure Monitor agent** (AMA) related Public Preview policy initiatives will be deprecated and replaced with the new auto-provisioning process for Azure Monitor agent (AMA), targeting only Azure registered SQL servers (SQL Server on Azure VM/ Arc-enabled SQL Server). 

1. Current customers with AMA with the Public Preview policy initiative enabled will still be supported but are recommended to migrate to the new policy. 

To ensure the security of your servers and receive all the security updates from Defender for Servers, make sure to have [Defender for Endpoint integration](integration-defender-for-endpoint.md) and [agentless disk scanning](concept-agentless-data-collection.md) enabled on your subscriptions. This will also keep your servers up-to-date with the alternative deliverables.

#### Agents migration planning 

**First, all Defender for Servers customers are advised to enable Defender for Endpoint integration and agentless disk scanning as part of the Defender for Servers offering, at no additional cost.** This will ensure you are automatically covered with the new alternative deliverables, with no additional onboarding required.    

Following that, plan your migration plan according to your organization requirements: 

|Azure Monitor agent (AMA) required (for Defender for SQL or other scenarios)|FIM/EPP discovery/Baselined is required as part of Defender for Server|What should I do|
| -------- | -------- | -------- |
|No |Yes |You can remove MMA starting April 2024, using GA version of Defender for Server capabilities according to your needs (preview versions will be available earlier)  |
|No |No |You can remove MMA starting now |
|Yes |No |You can start migration from MMA to AMA now |
|Yes |Yes |You can either start migration from MMA to AMA starting April 2024 or alternatively, you can use both agents side by side starting now. |

**Customers with Log analytics Agent** **(MMA) enabled** 

- If the following features are required in your organization: File Integrity Monitoring (FIM), Endpoint Protection recommendations, OS misconfigurations (security baselines recommendations), you can start retiring from MMA in April 2024 when an alternative will be delivered in GA (preview versions will be available earlier). 

- If the features mentioned above are required in your organization, and Azure Monitor agent (AMA) is required for other services as well, you can start migrating from MMA to AMA in April 2024. Alternatively, use both MMA and AMA to get all GA features, then remove MMA in April 2024. 

- If the features mentioned above are not required, and Azure Monitor agent (AMA) is required for other services, you can start migrating from MMA to AMA now. However, note that the preview Defender for Servers capabilities over AMA will be deprecated in April 2024. 

**Customers with Azure Monitor agent (AMA) enabled** 

No action is required from your end. 

- You’ll receive all Defender for Servers GA capabilities through Agentless and Defender for Endpoint. The following features will be available in GA in April 2024: File Integrity Monitoring (FIM), Endpoint Protection recommendations, OS misconfigurations (security baselines recommendations). The preview Defender for Servers capabilities over AMA will be deprecated in April 2024.

> [!IMPORTANT]
> For more information about how to plan for this change, see [Microsoft Defender for Cloud - strategy and plan towards Log Analytics Agent (MMA) deprecation](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341).

#### Defender for SQL Server on machines

The Defender for SQL Server on machines plan relies on the Log Analytics agent (MMA) / Azure monitoring agent (AMA) to provide Vulnerability Assessment and Advanced Threat Protection to IaaS SQL Server instances. The plan supports Log Analytics agent autoprovisioning in GA, and Azure Monitoring agent autoprovisioning in Public Preview.

The following section describes the planned introduction of a new and improved SQL Server-targeted Azure monitoring agent (AMA) autoprovisioning process and the deprecation procedure of the Log Analytics agent (MMA). On-premises SQL servers using MMA will require the Azure Arc agent when migrating to the new process due to AMA requirements. Customers who use the new autoprovisioning process will benefit from a simple and seamless agent configuration, reducing onboarding errors and providing broader protection coverage.

| Milestone                                                 | Date          | More information                                             |
| --------------------------------------------------------- | ------------- | ------------------------------------------------------------ |
| SQL-targeted AMA autoprovisioning Public Preview release | October 2023  | The new autoprovisioning process will only target Azure registered SQL servers (SQL Server on Azure VM/ Arc-enabled SQL Server). The current AMA autoprovisioning process and its related policy initiative will be deprecated. It can still be used customers, but they won't be eligible for support. |
| SQL-targeted AMA autoprovisioning GA release             | December 2023 | GA release of a SQL-targeted AMA autoprovisioning process. Following the release, it will be defined as the default option for all new customers. |
| MMA deprecation                                           | August 2024   | The current MMA autoprovisioning process and its related policy initiative will be deprecated. It can still be used customers, but they won't be eligible for support. |

### DevOps Resource Deduplication for Defender for DevOps

**Estimated date for change: September 2023**

To improve the Defender for DevOps user experience and enable further integration with Defender for Cloud's rich set of capabilities, Defender for DevOps will no longer support duplicate instances of a DevOps organization to be onboarded to an Azure tenant.

If you don't have an instance of a DevOps organization onboarded more than once to your organization, no further action is required. If you do have more than one instance of a DevOps organization onboarded to your tenant, the subscription owner will be notified and will need to delete the DevOps Connector(s) they don't want to keep by navigating to Defender for Cloud Environment Settings.

Customers will have until September 30, 2023 to resolve this issue. After this date, only the most recent DevOps Connector created where an instance of the DevOps organization exists will remain onboarded to Defender for DevOps. For example, if Organization Contoso exists in both connectorA and connectorB, and connectorB was created after connectorA, then connectorA will be removed from Defender for DevOps.

### Changes to Attack Path's Azure Resource Graph table scheme

**Estimated date for change: November 2023**

The Attack Path's Azure Resource Graph (ARG) table scheme will be updated. The `attackPathType` property wil be removed and additional properties will be added.

### Defender for Cloud plan and strategy for the Log Analytics agent deprecation

**Estimated date for change: August 2024**

The Azure Log Analytics agent, also known as the Microsoft Monitoring Agent (MMA) will be [retired in August 2024.](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/) As a result, features of the two Defender for Cloud plans that rely on the Log Analytics agent are impacted, and they have updated strategies: [Defender for Servers](#defender-for-servers) and [Defender for SQL Server on machines](#defender-for-sql-server-on-machines).

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md).

