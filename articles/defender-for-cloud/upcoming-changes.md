---
title: Important upcoming changes
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 07/25/2023
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.
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
| [Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled"](#replacing-the-key-vaults-should-have-purge-protection-enabled-recommendation-with-combined-recommendation-key-vaults-should-have-deletion-protection-enabled) | June 2023
| [Changes to the Defender for DevOps recommendations environment source and resource ID](#changes-to-the-defender-for-devops-recommendations-environment-source-and-resource-id) | July 2023 |
| [DevOps Resource Deduplication for Defender for DevOps](#devops-resource-deduplication-for-defender-for-devops) | July 2023 |
| [Business model and pricing updates for Defender for Cloud plans](#business-model-and-pricing-updates-for-defender-for-cloud-plans) | July 2023 |
| [Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled"](#replacing-the-key-vaults-should-have-purge-protection-enabled-recommendation-with-combined-recommendation-key-vaults-should-have-deletion-protection-enabled) | June 2023|
| [Changes to the Defender for DevOps recommendations environment source and resource ID](#changes-to-the-defender-for-devops-recommendations-environment-source-and-resource-id) | August 2023 |
| [DevOps Resource Deduplication for Defender for DevOps](#devops-resource-deduplication-for-defender-for-devops) | August 2023 |
| [Business model and pricing updates for Defender for Cloud plans](#business-model-and-pricing-updates-for-defender-for-cloud-plans) | August 2023 |
| [Update naming format of Azure Center for Internet Security standards in regulatory compliance](#update-naming-format-of-azure-center-for-internet-security-standards-in-regulatory-compliance) | August 2023 |
| [Preview alerts for DNS servers to be deprecated](#preview-alerts-for-dns-servers-to-be-deprecated) | August 2023 |
| [Change to the Log Analytics daily cap](#change-to-the-log-analytics-daily-cap) | September 2023 |
| [Defender for Cloud plan and strategy for the Log Analytics agent deprecation](#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation) | August 2024 |

### Defender for Cloud plan and strategy for the Log Analytics agent deprecation

**Estimated date for change: August 2024**

The Azure Log Analytics agent, also known as the Microsoft Monitoring Agent (MMA) will be [retired in August 2024.](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/) As a result, features of the two Defender for Cloud plans that rely on the Log Analytics agent are impacted, and they have updated strategies: [Defender for Servers](#defender-for-servers) and [Defender for SQL Server on machines](#defender-for-sql-server-on-machines).

#### Key strategy points

- The Azure monitoring Agent (AMA) won’t be a requirement of the Defender for Servers offering, but will remain required as part of Defender for SQL.
- Defender for Servers MMA-based features and capabilities will be deprecated in their Log Analytics version in August 2024, and delivered over alternative infrastructures, before the MMA deprecation date.
- In addition, the currently shared autoprovisioning process that provides the installation and configuration of both agents (MMA/AMA), will be adjusted accordingly.

#### Defender for Servers

The following table explains how each capability will be provided after the Log Analytics agent retirement:

| **Feature**                                                  | **Support**                                                  | **Alternative**                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Defender for Endpoint/Defender for Cloud integration  for down level machines (Windows Server  2012 R2, 2016) | Defender for Endpoint integration that uses the  legacy Defender for Endpoint sensor and the Log Analytics agent (for Windows Server 2016 and Windows  Server 2012 R2 machines) won’t be supported after August 2024. | Enable the GA [unified agent](/microsoft-365/security/defender-endpoint/configure-server-endpoints#new-windows-server-2012-r2-and-2016-functionality-in-the-modern-unified-solution) integration to  maintain support for machines, and receive the full extended feature set. For more information, see [Enable the Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md#windows). |
| OS-level threat detection (agent-based)                      | OS-level threat detection based  on the Log Analytics agent won’t be available after August 2024.  A full list of deprecated detections will be provided soon. | OS-level detections are provided by Defender for Endpoint integration  and are already GA. |
| Adaptive application controls                                | The [current GA version](adaptive-application-controls.md) based on the  Log Analytics agent will be deprecated in August 2024, along with the preview version based on the Azure monitoring agent. | The next generation of this feature is currently under evaluation, further information will be provided soon. |
| Endpoint protection discovery recommendations                | The current [GA and preview recommendations](endpoint-protection-recommendations-technical.md) to install endpoint protection and fix health issues in the detected solutions will be deprecated in August 2024. | A new agentless version will be provided for discovery and configuration gaps by April 2024. As part of this upgrade, this feature will be provided as a component of Defender for Servers plan 2 and Defender for CSPM, and won’t cover on-premises or Arc-connected machines. |
| Missing OS patches (system  updates)                         | Recommendations to apply system updates based on the Log Analytics agent won’t be available after August 2024. | [New recommendations](release-notes.md#two-recommendations-related-to-missing-operating-system-os-updates-were-released-to-ga), based on integration  with Update Management Center, are already in GA, with no agent dependencies. |
| OS misconfigurations (Azure Security Benchmark  recommendations) | The [current GA version](apply-security-baseline.md) based on the Log Analytics agent won’t be  available after August 2024.   The current preview version that uses the Guest  Configuration agent will be deprecated as the Microsoft Defender  Vulnerability Management integration becomes available. | A new version, based on integration with Premium  Microsoft Defender Vulnerability Management, will be available early in 2024,  as part of Defender for Servers plan 2. |
| File integrity monitoring                                    | The [current GA version](file-integrity-monitoring-enable-log-analytics.md) based on the Log  Analytics agent won’t be available after August 2024. | A new version of this feature, either agent-based or agentless, will be available by April 2024. |
| The  [500-MB benefit](faq-defender-for-servers.yml#is-the-500-mb-of-free-data-ingestion-allowance-applied-per-workspace-or-per-machine-) for data  ingestion | The [500-MB benefit](faq-defender-for-servers.yml#is-the-500-mb-of-free-data-ingestion-allowance-applied-per-workspace-or-per-machine-)  for data ingestion over the defined tables will remain supported via the AMA agent for the machines  under subscriptions covered by Defender for Servers P2. Every machine is  eligible for the benefit only once, even if both Log Analytics agent and  Azure Monitor agent are installed on it. |                                                              |

##### Log analytics and Azure Monitoring agents autoprovisioning experience

- The MMA autoprovisioning mechanism and its related policy initiative will remain optional until August 2024.

- In October 2023, the current shared Log Analytics agent/Azure Monitor agent autoprovisioning mechanism will be updated and applied to the Log Analytics agent only. The Azure Monitor agent related (Public Preview) policy initiatives will be deprecated.

- The AMA autoprovisioning mechanism will still serve current customers with the Public Preview policy initiative enabled, but they won't be eligible for support. To disable the Azure Monitor agent provisioning, manually remove the policy initiative.

- If MMA autoprovisioning is enabled and AMA agents are already installed on the machines, MMA won’t be provisioned. However, AMA will remain functional.

To ensure the security of your servers and receive all the security updates from Defender for Servers, make sure to have [Defender for Endpoint integration](integration-defender-for-endpoint.md) and [agentless disk scanning](concept-agentless-data-collection.md) enabled on your subscriptions. This will also keep your servers up-to-date with the alternative deliverables.

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

Additionally, customers that have created custom queries using the DevOps workbook will need to update the assessment keys for the impacted DevOps security recommendations.

The recommendations page's experience will have minimal impact and deprecated assessments may continue to show for a maximum of 14 days if new scan results aren't submitted.  

### DevOps Resource Deduplication for Defender for DevOps

**Estimated date for change: August 2023**

To improve the Defender for DevOps user experience and enable further integration with Defender for Cloud's rich set of capabilities, Defender for DevOps will no longer support duplicate instances of a DevOps organization to be onboarded to an Azure tenant.

If you don't have an instance of a DevOps organization onboarded more than once to your organization, no further action is required. If you do have more than one instance of a DevOps organization onboarded to your tenant, the subscription owner will be notified and will need to delete the DevOps Connector(s) they don't want to keep by navigating to Defender for Cloud Environment Settings.

Customers will have until July 31, 2023 to resolve this issue. After this date, only the most recent DevOps Connector created where an instance of the DevOps organization exists will remain onboarded to Defender for DevOps. For example, if Organization Contoso exists in both connectorA and connectorB, and connectorB was created after connectorA, then connectorA will be removed from Defender for DevOps.

### Business model and pricing updates for Defender for Cloud plans

**Estimated date for change: August 2023**

Microsoft Defender for Cloud has three plans that offer service layer protection:

- Defender for Key Vault

- Defender for Azure Resource Manager

- Defender for DNS

These plans are transitioning to a new business model with different pricing and packaging to address customer feedback regarding spending predictability and simplifying the overall cost structure.

**Business model and pricing changes summary**:

Existing customers of Defender for Key-Vault, Defender for Azure Resource Manager, and Defender for DNS will keep their current business model and pricing unless they actively choose to switch to the new business model and price.

- **Defender for Azure Resource Manager**: This plan will have a fixed price per subscription per month. Customers will have the option to switch to the new business model by selecting the Defender for Azure Resource Manager new per-subscription model.

Existing customers of Defender for Key-Vault, Defender for Azure Resource Manager, and Defender for DNS will keep their current business model and pricing unless they actively choose to switch to the new business model and price.

- **Defender for Azure Resource Manager**: This plan will have a fixed price per subscription per month. Customers will have the option to switch to the new business model by selecting the Defender for Azure Resource Manager new per-subscription model.

- **Defender for Key Vault**: This plan will have a fixed price per vault at per month with no overage charge. Customers will have the option to switch to the new business model by selecting the Defender for Key Vault new per-vault model

- **Defender for DNS**: Defender for Servers Plan 2 customers will gain access to Defender for DNS value as part of Defender for Servers Plan 2 at no extra cost. Customers that have both Defender for Server Plan 2 and Defender for DNS will no longer be charged for Defender for DNS. Defender for DNS will no longer be available as a standalone plan.

For more information on all of these plans, check out the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h)

### Update naming format of Azure Center for Internet Security standards in regulatory compliance

**Estimated date for change: August 2023**

The naming format of Azure CIS (Center for Internet Security) foundations benchmarks in the compliance dashboard is set for change from `[Cloud] CIS [version number]` to `CIS [Cloud] Foundations v[version number]`. Refer to the following table:

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

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md).
