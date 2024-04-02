---
title: Important upcoming changes
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan. 
ms.topic: overview
ms.date: 03/13/2024
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
| [Defender for open-source relational databases updates](#defender-for-open-source-relational-databases-updates) | March 6, 2024 | April, 2024 |
| [Changes in where you access Compliance offerings and Microsoft Actions](#changes-in-where-you-access-compliance-offerings-and-microsoft-actions) | March 3, 2024 | September 30, 2025 |
| [Microsoft Security Code Analysis (MSCA) is no longer operational](#microsoft-security-code-analysis-msca-is-no-longer-operational) | February 26, 2024 | February 26, 2024 |
| [Update recommendations to align with Azure AI Services resources](#update-recommendations-to-align-with-azure-ai-services-resources) | February 20, 2024 | February 28, 2024 |
| [Deprecation of data recommendation](#deprecation-of-data-recommendation) | February 12, 2024 | March 14, 2024 |
| [Decommissioning of Microsoft.SecurityDevOps resource provider](#decommissioning-of-microsoftsecuritydevops-resource-provider) | February 5, 2024 | March 6, 2024 |
| [Change in pricing for multicloud container threat detection](#change-in-pricing-for-multicloud-container-threat-detection) | January 30, 2024 | April 2024 |
| [Enforcement of Defender CSPM for Premium DevOps Security Capabilities](#enforcement-of-defender-cspm-for-premium-devops-security-value) | January 29, 2024 | March 2024 |
| [Update to agentless VM scanning built-in Azure role](#update-to-agentless-vm-scanning-built-in-azure-role) |January 14, 2024 | February 2024 |
| [Defender for Servers built-in vulnerability assessment (Qualys) retirement path](#defender-for-servers-built-in-vulnerability-assessment-qualys-retirement-path) | January 9, 2024 | May 2024 |
| [Upcoming change for the Defender for Cloud’s multicloud network requirements](#upcoming-change-for-the-defender-for-clouds-multicloud-network-requirements) | January 3, 2024 | May 2024 |
| [Deprecation of two DevOps security recommendations](#deprecation-of-two-devops-security-recommendations) | November 30, 2023 | January 2024 |
| [Consolidation of Defender for Cloud's Service Level 2 names](#consolidation-of-defender-for-clouds-service-level-2-names) | November 1, 2023 | December 2023 |
| [Changes to how Microsoft Defender for Cloud's costs are presented in Microsoft Cost Management](#changes-to-how-microsoft-defender-for-clouds-costs-are-presented-in-microsoft-cost-management) | October 25, 2023 | November 2023 |
| [Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled"](#replacing-the-key-vaults-should-have-purge-protection-enabled-recommendation-with-combined-recommendation-key-vaults-should-have-deletion-protection-enabled) |  | June 2023|
| [Change to the Log Analytics daily cap](#change-to-the-log-analytics-daily-cap) |  | September 2023 |
| [DevOps Resource Deduplication for Defender for DevOps](#devops-resource-deduplication-for-defender-for-devops) |  | November 2023 |
| [Deprecating two security incidents](#deprecating-two-security-incidents) |  | November 2023 |
| [Defender for Cloud plan and strategy for the Log Analytics agent deprecation](#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation) |  | August 2024 |

## Defender for open-source relational databases updates

**Announcement date: March 6, 2024**

**Estimated date for change: April, 2024**

**Defender for PostgreSQL Flexible Servers post-GA updates** - The update enables customers to enforce protection for existing PostgreSQL flexible servers at the subscription level, allowing complete flexibility to enable protection on a per-resource basis or for automatic protection of all resources at the subscription level.

**Defender for MySQL Flexible Servers Availability and GA** - Defender for Cloud is set to expand its support for Azure open-source relational databases by incorporating MySQL Flexible Servers.
This release will include:

- Alert compatibility with existing alerts for Defender for MySQL Single Servers.
- Enablement of individual resources.
- Enablement at the subscription level.

If you're already protecting your subscription with Defender for open-source relational databases, your flexible server resources are automatically enabled, protected, and billed.
Specific billing notifications have been sent via email for affected subscriptions.

Learn more about [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).

## Changes in where you access Compliance offerings and Microsoft Actions

**Announcement date: March 3, 2024**

**Estimated date for change: September 30, 2025**

On September 30, 2025, the locations where you access two preview features, Compliance offering and Microsoft Actions, will change.

The table that lists the compliance status of Microsoft's products (accessed from the **Compliance offerings** button in the toolbar of Defender's [regulatory compliance dashboard](regulatory-compliance-dashboard.md)). After this button is removed from Defender for Cloud, you'll still be able to access this information using the [Service Trust Portal](https://servicetrust.microsoft.com/).

For a subset of controls, Microsoft Actions was accessible from the **Microsoft Actions (Preview)** button in the controls details pane. After this button is removed, you can view Microsoft Actions by visiting Microsoft’s [Service Trust Portal for FedRAMP](https://servicetrust.microsoft.com/viewpage/FedRAMP) and accessing  the Azure System Security Plan document.

## Microsoft Security Code Analysis (MSCA) is no longer operational

**Announcement date: February 26, 2024**

**Estimated date for change: February 26, 2024**

In February 2021, the deprecation of the MSCA task was communicated to all customers and has been past end of life support since [March 2022](https://devblogs.microsoft.com/premier-developer/microsoft-security-code-analysis/). As of February 26, 2024, MSCA is officially no longer operational.

Customers can get the latest DevOps security tooling from Defender for Cloud through [Microsoft Security DevOps](azure-devops-extension.md) and more security tooling through [GitHub Advanced Security for Azure DevOps](https://azure.microsoft.com/products/devops/github-advanced-security).

## Update recommendations to align with Azure AI Services resources

**Announcement date: February 20, 2024**

**Estimated date of change: February 28, 2024**

The Azure AI Services category (formerly known as Cognitive Services) is adding new resource types. As a result, the following recommendations and related policy are set to be updated to comply with the new Azure AI Services naming format and align with the relevant resources.

| Current Recommendation | Updated Recommendation |
| ---- | ---- |
| Cognitive Services accounts should restrict network access | [Azure AI Services resources should restrict network access](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/f738efb8-005f-680d-3d43-b3db762d6243) |
| Cognitive Services accounts should have local authentication methods disabled | [Azure AI Services resources should have key access disabled (disable local authentication)](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/13b10b36-aa99-4db6-b00c-dcf87c4761e6) |

See the [list of security recommendations](recommendations-reference.md).

## Deprecation of data recommendation

**Announcement date: February 12, 2024**

**Estimated date of change: March 14, 2024**

The recommendation [`Public network access should be disabled for Cognitive Services accounts`](https://ms.portal.azure.com/?feature.msaljs=true#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/684a5b6d-a270-61ce-306e-5cea400dc3a7) is set to be deprecated. The related policy definition [`Cognitive Services accounts should disable public network access`](https://ms.portal.azure.com/?feature.msaljs=true#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0725b4dd-7e76-479c-a735-68e7ee23d5ca) is also being removed from the regulatory compliance dashboard.

This recommendation is already being covered by another networking recommendation for Azure AI Services, [`Cognitive Services accounts should restrict network access`](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/f738efb8-005f-680d-3d43-b3db762d6243/showSecurityCenterCommandBar~/false).

See the [list of security recommendations](recommendations-reference.md).

## Decommissioning of Microsoft.SecurityDevOps resource provider

**Announcement date: February 5, 2024**

**Estimated date of change: March 6, 2024**

Microsoft Defender for Cloud is decommissioning the resource provider `Microsoft.SecurityDevOps` that was used during public preview of DevOps security, having migrated to the existing `Microsoft.Security` provider. The reason for the change is to improve customer experiences by reducing the number of resource providers associated with DevOps connectors.

Customers that are still using the API version **2022-09-01-preview** under `Microsoft.SecurityDevOps` to query Defender for Cloud DevOps security data will be impacted. To avoid disruption to their service, customer will need to update to the new API version **2023-09-01-preview** under the `Microsoft.Security` provider.

Customers currently using Defender for Cloud DevOps security from Azure portal won't be impacted.

For details on the new API version, see [Microsoft Defender for Cloud REST APIs](/rest/api/defenderforcloud/operation-groups).

## Changes in endpoint protection recommendations

**Announcement date: February 1, 2024**

**Estimated date of change: March 2024**

As use of the Azure Monitor Agent (AMA) and the Log Analytics agent (also known as the Microsoft Monitoring Agent (MMA)) is [phased out in Defender for Servers](https://techcommunity.microsoft.com/t5/user/ssoregistrationpage?dest_url=https:%2F%2Ftechcommunity.microsoft.com%2Ft5%2Fblogs%2Fblogworkflowpage%2Fblog-id%2FMicrosoftDefenderCloudBlog%2Farticle-id%2F1269), existing endpoint recommendations, which rely on those agents, will be replaced with new recommendations. The new recommendations rely on [agentless machine scanning](concept-agentless-data-collection.md) which allows the recommendations to discover and assesses the configuration of supported endpoint detection and response solutions and offers remediation steps, if issues are found.

These public preview recommendations will be deprecated.

| Recommendation | Agent | Deprecation date | Replacement recommendation |
|--|--|--|--|
| [Endpoint protection should be installed on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) (public) | MMA/AMA | March 2024 | New agentless recommendations. |
| [Endpoint protection health issues should be resolved on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000) (public)| MMA/AMA | March 2024 | New agentless recommendations. |

The current generally available recommendations will remain supported until August 2024.

As part of that deprecation, we’ll be introducing new agentless endpoint protection recommendations. These recommendations will be available in Defender for Servers Plan 2 and the Defender CSPM plan. They'll support Azure and multicloud machines. On-premises machines aren't supported.

| Preliminary recommendation name | Estimated release date |
|--|--|--|
| Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines | March 2024 |
| Endpoint Detection and Response (EDR) solution should be installed on EC2s | March 2024 |
| Endpoint Detection and Response (EDR) solution should be installed on Virtual Machines (GCP) | March 2024 |
| Endpoint Detection and Response (EDR) configuration issues should be resolved on virtual machines | March 2024 |
| Endpoint Detection and Response (EDR) configuration issues should be resolved on EC2s | March 2024 |
| Endpoint Detection and Response (EDR) configuration issues should be resolved on GCP virtual machines | March 2024 |

Learn more about the [migration to the updated Endpoint protection recommendations experience](prepare-deprecation-log-analytics-mma-agent.md#endpoint-protection-recommendations-experience).

## Change in pricing for multicloud container threat detection

**Announcement date: January 30, 2024**

**Estimated date for change: April 2024**

When [multicloud container threat detection](support-matrix-defender-for-containers.md) moves to GA, it will no longer be free of charge. For more information, see [Microsoft Defender for Cloud pricing](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Enforcement of Defender CSPM for Premium DevOps Security Value

**Announcement date: January 29, 2024**

**Estimated date for change: March 7, 2024**

Defender for Cloud will begin enforcing the Defender CSPM plan check for premium DevOps security value beginning **March 7th, 2024**. If you have the Defender CSPM plan enabled on a cloud environment (Azure, AWS, GCP) within the same tenant your DevOps connectors are created in, you'll continue to receive premium DevOps capabilities at no extra cost. If you aren't a Defender CSPM customer, you have until **March 7th, 2024** to enable Defender CSPM before losing access to these security features. To enable Defender CSPM on a connected cloud environment before March 7, 2024, follow the enablement documentation outlined [here](tutorial-enable-cspm-plan.md#enable-the-components-of-the-defender-cspm-plan).

For more information about which DevOps security features are available across both the Foundational CSPM and Defender CSPM plans, see [our documentation outlining feature availability](devops-support.md#feature-availability).

For more information about DevOps Security in Defender for Cloud, see the [overview documentation](defender-for-devops-introduction.md).

For more information on the code to cloud security capabilities in Defender CSPM, see [how to protect your resources with Defender CSPM](tutorial-enable-cspm-plan.md).

## Update to agentless VM scanning built-in Azure role

**Announcement date: January 14, 2024**

**Estimated date of change: February 2024**

In Azure, agentless scanning for VMs uses a built-in role (called [VM scanner operator](faq-permissions.yml)) with the minimum necessary permissions required to scan and assess your VMs for security issues. To continuously provide relevant scan health and configuration recommendations for VMs with encrypted volumes, an update to this role's permissions is planned. The update includes the addition of the ```Microsoft.Compute/DiskEncryptionSets/read``` permission. This permission solely enables improved identification of encrypted disk usage in VMs. It doesn't provide Defender for Cloud any more capabilities to decrypt or access the content of these encrypted volumes beyond the encryption methods [already supported](concept-agentless-data-collection.md#availability) prior to this change. This change is expected to take place during February 2024 and no action is required on your end.

## Defender for Servers built-in vulnerability assessment (Qualys) retirement path

**Announcement date: January 9, 2024**

**Estimated date for change: May 2024**

The Defender for Servers built-in vulnerability assessment solution powered by Qualys is on a retirement path, which is estimated to complete on **May 1st, 2024**. If you're currently using the vulnerability assessment solution powered by Qualys, you should plan your [transition to the integrated Microsoft Defender vulnerability management solution](how-to-transition-to-built-in.md).

For more information about our decision to unify our vulnerability assessment offering with Microsoft Defender Vulnerability Management, you can read [this blog post](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/defender-for-cloud-unified-vulnerability-assessment-powered-by/ba-p/3990112).

You can also check out the [common questions about the transition to Microsoft Defender Vulnerability Management solution](faq-scanner-detection.yml).

## Upcoming change for the Defender for Cloud’s multicloud network requirements

**Announcement date: January 3, 2024**

**Estimated date for change: May 2024**

Beginning May 2024, we'll be retiring the old IP addresses associated with our multicloud discovery services to accommodate improvements and ensure a more secure and efficient experience for all users.

To ensure uninterrupted access to our services, you should update your IP allowlist with the new ranges provided in the following sections. You should make the necessary adjustments in your firewall settings, security groups, or any other configurations that may be applicable to your environment.

The list is applicable to all plans and sufficient for full capability of the CSPM foundational (free) offering.

**IP addresses to be retired**:

- Discovery GCP: 104.208.29.200, 52.232.56.127
- Discovery AWS: 52.165.47.219, 20.107.8.204
- Onboarding: 13.67.139.3

**New region-specific IP ranges to be added**:

- West Europe (weu): 52.178.17.48/28
- North Europe (neu): 13.69.233.80/28
- Central US (cus): 20.44.10.240/28
- East US 2 (eus2): 20.44.19.128/28

## Deprecation of two DevOps security recommendations

**Announcement date: November 30, 2023**

**Estimated date for change: January 2024**

With the general availability of DevOps environment posture management, we're updating our approach to having recommendations displayed in the subassessment format. Previously, we had broad recommendations encompassing multiple findings. Now, we're shifting to individual recommendations for each specific finding. With this change, the two broad recommendations will be deprecated:

- `Azure DevOps Posture Management findings should be resolved`
- `GitHub Posture Management findings should be resolved`

This means instead of a singular recommendation for all discovered misconfigurations, we'll provide distinct recommendations for each issue, such as "Azure DevOps service connections should not grant access to all pipelines". This change aims to enhance clarity and visibility of specific issues.

For more information, see the [new recommendations](recommendations-reference-devops.md).

## Consolidation of Defender for Cloud's Service Level 2 names

**Announcement date: November 1, 2023**

**Estimated date for change: December 2023**

We're consolidating the legacy Service Level 2 names for all Defender for Cloud plans into a single new Service Level 2 name, **Microsoft Defender for Cloud**.

Today, there are four Service Level 2 names: Azure Defender, Advanced Threat Protection, Advanced Data Security, and Security Center. The various meters for Microsoft Defender for Cloud are grouped across these separate Service Level 2 names, creating complexities when using Cost Management + Billing, invoicing, and other Azure billing-related tools.

The change simplifies the process of reviewing Defender for Cloud charges and provides better clarity in cost analysis.

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

## Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled"

**Estimated date for change: June 2023**

The `Key Vaults should have purge protection enabled` recommendation is deprecated from the (regulatory compliance dashboard/Azure security benchmark initiative) and replaced with a new combined recommendation `Key Vaults should have deletion protection enabled`.

| Recommendation name | Description | Effect(s) | Version |
|--|--|--|--|
| [Key vaults should have deletion protection enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b60c0b2-2dc2-4e1c-b5c9-abbed971de53)| A malicious insider in your organization can potentially delete and purge key vaults. Purge protection protects you from insider attacks by enforcing a mandatory retention period for soft deleted key vaults. No one inside your organization or Microsoft will be able to purge your key vaults during the soft delete retention period. | audit, deny, disabled | [2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Recoverable_Audit.json) |

See the [full index of Azure Policy built-in policy definitions for Key Vault](../key-vault/policy-reference.md).

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
| Defender for Endpoint/Defender for Cloud integration  for down level machines (Windows Server  2012 R2, 2016) | Defender for Endpoint integration that uses the  legacy Defender for Endpoint sensor and the Log Analytics agent (for Windows Server 2016 and Windows  Server 2012 R2 machines) won’t be supported after August 2024. | Enable the GA [unified agent](/microsoft-365/security/defender-endpoint/configure-server-endpoints#new-windows-server-2012-r2-and-2016-functionality-in-the-modern-unified-solution) integration to  maintain support for machines, and receive the full extended feature set. For more information, see [Enable the Microsoft Defender for Endpoint integration](enable-defender-for-endpoint.md#windows). |
| OS-level threat detection (agent-based)                      | OS-level threat detection based  on the Log Analytics agent won’t be available after August 2024.  A full list of deprecated detections will be provided soon. | OS-level detections are provided by Defender for Endpoint integration  and are already GA. |
| Adaptive application controls                                | The [current GA version](adaptive-application-controls.md) based on the  Log Analytics agent will be deprecated in August 2024, along with the preview version based on the Azure monitoring agent. | Adaptive Application Controls feature as it is today will be discontinued, and new capabilities in the application control space (on top of what Defender for Endpoint and Windows Defender Application Control offer today) will be considered as part of future Defender for Servers roadmap. |
| Endpoint protection discovery recommendations                | The current [GA recommendations](endpoint-protection-recommendations-technical.md) to install endpoint protection and fix health issues in the detected solutions will be deprecated in August 2024. The preview recommendations available today over Log analytic agent will be deprecated when the alternative is provided over Agentless Disk Scanning capability. | A new agentless version will be provided for discovery and configuration gaps by April 2024. As part of this upgrade, this feature will be provided as a component of Defender for Servers plan 2 and Defender CSPM, and won’t cover on-premises or Arc-connected machines. |
| Missing OS patches (system  updates)                         | Recommendations to apply system updates based on the Log Analytics agent won’t be available after August 2024.  The preview version available today over Guest Configuration agent will be deprecated when the alternative is provided over Microsoft Defender Vulnerability Management premium capabilities. Support of this feature for Docker-hub and VMMS will be deprecated in Aug 2024 and will be considered as part of future Defender for Servers roadmap.| [New recommendations](release-notes-archive.md#two-recommendations-related-to-missing-operating-system-os-updates-were-released-to-ga), based on integration  with Update Manager, are already in GA, with no agent dependencies. |
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
