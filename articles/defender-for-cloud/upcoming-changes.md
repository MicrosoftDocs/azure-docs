---
title: Important upcoming changes
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan.
ms.topic: overview
ms.date: 06/03/2024
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
| [Changes to identity recommendations](#changes-to-identity-recommendations) | June 3, 2024 | July 2024 |
| [Removal of FIM over AMA and release of new version over Defender for Endpoint](#removal-of-fim-over-ama-and-release-of-new-version-over-defender-for-endpoint) | May 1, 2024 | June 2024 |
| [Deprecation of system update recommendations](#deprecation-of-system-update-recommendations) | May 1, 2024 | May 2024 |
| [Deprecation of MMA related recommendations](#deprecation-of-mma-related-recommendations) | May 1, 2024 | May 2024 |
| [Deprecation of fileless attack alerts](#deprecation-of-fileless-attack-alerts) | April 18, 2024 | May 2024 |
| [Change in CIEM assessment IDs](#change-in-ciem-assessment-ids) | April 16.2024 | May 2024 |
| [Deprecation of encryption recommendation](#deprecation-of-encryption-recommendation) | April 3, 2024 | May 2024 |
| [Deprecating of virtual machine recommendation](#deprecating-of-virtual-machine-recommendation) | April 2, 2024 | July, 2024 |
| [General Availability of Unified Disk Encryption recommendations](#general-availability-of-unified-disk-encryption-recommendations) | March 28, 2024 | April 30, 2024 |
| [Changes in where you access Compliance offerings and Microsoft Actions](#changes-in-where-you-access-compliance-offerings-and-microsoft-actions) | March 3, 2024 | September 30, 2025 |
| [Decommissioning of Microsoft.SecurityDevOps resource provider](#decommissioning-of-microsoftsecuritydevops-resource-provider) | February 5, 2024 | March 6, 2024 |
| [Change in pricing for multicloud container threat detection](#change-in-pricing-for-multicloud-container-threat-detection) | January 30, 2024 | April 2024 |
| [Enforcement of Defender CSPM for Premium DevOps Security Capabilities](#enforcement-of-defender-cspm-for-premium-devops-security-value) | January 29, 2024 | March 2024 |
| [Update to agentless VM scanning built-in Azure role](#update-to-agentless-vm-scanning-built-in-azure-role) |January 14, 2024 | February 2024 |
| [Upcoming change for the Defender for Cloud’s multicloud network requirements](#upcoming-change-for-the-defender-for-clouds-multicloud-network-requirements) | January 3, 2024 | May 2024 |
| [Deprecation of two DevOps security recommendations](#deprecation-of-two-devops-security-recommendations) | November 30, 2023 | January 2024 |
| [Changes to how Microsoft Defender for Cloud's costs are presented in Microsoft Cost Management](#changes-to-how-microsoft-defender-for-clouds-costs-are-presented-in-microsoft-cost-management) | October 25, 2023 | November 2023 |
| [Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled"](#replacing-the-key-vaults-should-have-purge-protection-enabled-recommendation-with-combined-recommendation-key-vaults-should-have-deletion-protection-enabled) |  | June 2023|
| [DevOps Resource Deduplication for Defender for DevOps](#devops-resource-deduplication-for-defender-for-devops) |  | November 2023 |
| [Deprecating two security incidents](#deprecating-two-security-incidents) |  | November 2023 |
| [Defender for Cloud plan and strategy for the Log Analytics agent deprecation](#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation) |  | August 2024 |

## Changes to identity recommendations

**Announcement date: June 3, 2024**

**Estimated date for change: July 2024**

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

## Removal of FIM over AMA and release of new version over Defender for Endpoint

**Announcement date: May 1, 2024**

**Estimated date for change: June 2024**

As part of the [MMA deprecation and the Defender for Servers updated deployment strategy](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341), all Defender for Servers security features will be provided via a single agent (MDE), or via agentless scanning capabilities, and without dependency on either Log Analytics Agent (MMA) or Azure Monitoring Agent (AMA).

The new version of File Integrity Monitoring (FIM) over Microsoft Defender for Endpoint (MDE) allows you to meet compliance by monitoring critical files and registries in real-time, auditing changes, and detecting suspicious file content alterations.

As part of this release, FIM experience over AMA will no longer be available through the Defender for Cloud portal beginning May 30th. For more information, see [File Integrity Monitoring experience - changes and migration guidance](prepare-deprecation-log-analytics-mma-agent.md#file-integrity-monitoring-experience---changes-and-migration-guidance).

## Deprecation of system update recommendations

**Announcement date: May 1, 2024**

**Estimated date for change: May 2024**

As use of the Azure Monitor Agent (AMA) and the Log Analytics agent (also known as the Microsoft Monitoring Agent (MMA)) is [phased out in Defender for Servers](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341), the following recommendations that rely on those agents are set for deprecation:

- [System updates should be installed on your machines](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/SystemUpdatesRecommendationDetailsWithRulesBlade/assessmentKey/4ab6e3c5-74dd-8b35-9ab9-f61b30875b27)
- [System updates on virtual machine scale sets should be installed](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/bd20bd91-aaf1-7f14-b6e4-866de2f43146)

The new recommendations based on Azure Update Manager integration [are Generally Available](release-notes-archive.md#two-recommendations-related-to-missing-operating-system-os-updates-were-released-to-ga) and have no agent dependencies.

## Deprecation of MMA related recommendations

**Announcement date: May 1, 2024**

**Estimated date for change: May 2024**

As part of the [MMA deprecation and the Defender for Servers updated deployment strategy](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/microsoft-defender-for-cloud-strategy-and-plan-towards-log/ba-p/3883341), all Defender for Servers security features will be provided via a single agent (MDE), or via agentless scanning capabilities, and without dependency on either Log Analytics Agent (MMA) or Azure Monitoring Agent (AMA).

As part of this, and in a goal to reduce complexity, the following recommendations are going to be deprecated:

| Display name                                             | Related feature |
| ------------------------------------------------------------ | ------------------- |
| Log Analytics agent should be installed on Windows-based Azure Arc-enabled machines | MMA enablement      |
| Log Analytics agent should be installed on virtual machine scale sets | MMA enablement      |
| Auto provisioning of the Log Analytics agent should be enabled on subscriptions | MMA enablement      |
| Log Analytics agent should be installed on virtual machines  | MMA enablement      |
| Log Analytics agent should be installed on Linux-based Azure Arc-enabled machines | MMA enablement      |
| Guest Configuration extension should be installed on machines | GC  enablement      |
| Virtual machines' Guest Configuration extension should be deployed with system-assigned managed identity | GC  enablement      |
| Adaptive application controls for defining safe applications should be enabled on your machines | AAC                 |
| Adaptive application controls for defining safe applications should be enabled on your machines | AAC  |

## Deprecation of fileless attack alerts

**Announcement date: April 18, 2024**

**Estimated date for change: May 2024**

In May 2024, to enhance the quality of security alerts for Defender for Servers, the fileless attack alerts specific to Windows and Linux virtual machines will be discontinued. These alerts will instead be generated by Defender for Endpoint:

- Fileless attack toolkit detected (VM_FilelessAttackToolkit.Windows)
- Fileless attack technique detected (VM_FilelessAttackTechnique.Windows)
- Fileless attack behavior detected (VM_FilelessAttackBehavior.Windows)
- Fileless Attack Toolkit Detected (VM_FilelessAttackToolkit.Linux)
- Fileless Attack Technique Detected (VM_FilelessAttackTechnique.Linux)
- Fileless Attack Behavior Detected (VM_FilelessAttackBehavior.Linux)

All security scenarios covered by the deprecated alerts are fully covered Defender for Endpoint threat alerts.

If you already have the Defender for Endpoint integration enabled, there's no action required on your part. In May 2024 you might experience a decrease in your alerts volume, but still remain protected. If you don't currently have Defender for Endpoint integration enabled in Defender for Servers, you need to enable integration to maintain and improve your alert coverage. All Defender for Server customers can access the full value of Defender for Endpoint's integration at no additional cost. For more information, see [Enable Defender for Endpoint integration](enable-defender-for-endpoint.md).

## Change in CIEM assessment IDs

**Announcement date: April 16, 2024**

**Estimated date for change: May 2024**

The following recommendations are scheduled for remodeling, which will result in changes to their assessment IDs:

- `Azure overprovisioned identities should have only the necessary permissions`
- `AWS Overprovisioned identities should have only the necessary permissions`
- `GCP overprovisioned identities should have only the necessary permissions`
- `Super identities in your Azure environment should be removed`
- `Unused identities in your Azure environment should be removed`

## Deprecation of encryption recommendation

**Announcement date: April 3, 2024**

**Estimated date for change: May 2024**

The recommendation [Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d57a4221-a804-52ca-3dea-768284f06bb7) is set to be deprecated.

## Deprecating of virtual machine recommendation

**Announcement date: April 2, 2024**

**Estimated date of change: July 30, 2024**

The recommendation [Virtual machines should be migrated to new Azure Resource Manager resources](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/12018f4f-3d10-999b-e4c4-86ec25be08a1) is set to be deprecated. There should be no effect on customers as these resources no longer exist.

## General Availability of Unified Disk Encryption recommendations

**Announcement date: March 28, 2024**

**Estimated date of change: April 30, 2024**

Unified Disk Encryption recommendations will be released for General Availability (GA) within Azure Public Cloud in April 2024. The recommendations enable customers to audit encryption compliance of virtual machines with Azure Disk Encryption or EncryptionAtHost.

**Recommendations moving to GA:**

| Recommendation name | Assessment key |
| ---- | ---- |
| Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost | a40cc620-e72c-fdf4-c554-c6ca2cd705c0 |
| Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost | 0cb5f317-a94b-6b80-7212-13a9cc8826af |

Azure Disk Encryption (ADE) and EncryptionAtHost provide encryption at rest coverage, as described in [Overview of managed disk encryption options - Azure Virtual Machines](/azure/virtual-machines/disk-encryption-overview), and we recommend enabling either of these on virtual machines.

The recommendations depend on [Guest Configuration](/azure/governance/machine-configuration/overview). Prerequisites to onboard to Guest configuration should be enabled on virtual machines for the recommendations to complete compliance scans as expected.

These recommendations will replace the recommendation "Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources."

## Changes in where you access Compliance offerings and Microsoft Actions

**Announcement date: March 3, 2024**

**Estimated date for change: September 30, 2025**

On September 30, 2025, the locations where you access two preview features, Compliance offering and Microsoft Actions, will change.

The table that lists the compliance status of Microsoft's products (accessed from the **Compliance offerings** button in the toolbar of Defender's [regulatory compliance dashboard](regulatory-compliance-dashboard.md)). After this button is removed from Defender for Cloud, you'll still be able to access this information using the [Service Trust Portal](https://servicetrust.microsoft.com/).

For a subset of controls, Microsoft Actions was accessible from the **Microsoft Actions (Preview)** button in the controls details pane. After this button is removed, you can view Microsoft Actions by visiting Microsoft’s [Service Trust Portal for FedRAMP](https://servicetrust.microsoft.com/viewpage/FedRAMP) and accessing  the Azure System Security Plan document.

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

Learn more about the [migration to the updated Endpoint protection recommendations experience](prepare-deprecation-log-analytics-mma-agent.md#endpoint-protection-recommendations-experience---changes-and-migration-guidance).

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
| Endpoint protection discovery recommendations                | The current [GA recommendations](endpoint-protection-recommendations-technical.md) to install endpoint protection and fix health issues in the detected solutions will be deprecated in August 2024. The preview recommendations available today over Log analytic agent will be deprecated when the alternative is provided over Agentless Disk Scanning capability. | A new agentless version will be provided for discovery and configuration gaps by June 2024. As part of this upgrade, this feature will be provided as a component of Defender for Servers plan 2 and Defender CSPM, and won’t cover on-premises or Arc-connected machines. |
| Missing OS patches (system  updates)                         | Recommendations to apply system updates based on the Log Analytics agent won’t be available after August 2024.  The preview version available today over Guest Configuration agent will be deprecated when the alternative is provided over Microsoft Defender Vulnerability Management premium capabilities. Support of this feature for Docker-hub and VMMS will be deprecated in Aug 2024 and will be considered as part of future Defender for Servers roadmap.| [New recommendations](release-notes-archive.md#two-recommendations-related-to-missing-operating-system-os-updates-were-released-to-ga), based on integration  with Update Manager, are already in GA, with no agent dependencies. |
| OS misconfigurations (Azure Security Benchmark  recommendations) | The [current GA version](apply-security-baseline.md) based on the Log Analytics agent won’t be  available after August 2024.   The current preview version that uses the Guest  Configuration agent will be deprecated as the Microsoft Defender  Vulnerability Management integration becomes available. | A new version, based on integration with Premium  Microsoft Defender Vulnerability Management, will be available early in 2024,  as part of Defender for Servers plan 2. |
| File integrity monitoring                                    | The [current GA version](file-integrity-monitoring-enable-log-analytics.md) based on the Log Analytics agent won’t be available after August 2024. The FIM [Public Preview version](file-integrity-monitoring-enable-ama.md) based on Azure Monitor Agent (AMA), will be deprecated when the alternative is provided over Defender for Endpoint.| A new version of this feature will be provided based on Microsoft Defender for Endpoint integration by June 2024. |
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
| SQL-targeted AMA autoprovisioning Public Preview release | October 2023  | The new autoprovisioning process will only target Azure registered SQL servers (SQL Server on Azure VM/ Arc-enabled SQL Server). The current AMA autoprovisioning process and its related policy initiative will be deprecated. It can still be used by customers, but they won't be eligible for support. |
| SQL-targeted AMA autoprovisioning GA release             | December 2023 | GA release of a SQL-targeted AMA autoprovisioning process. Following the release, it will be defined as the default option for all new customers. |
| MMA deprecation                                           | August 2024   | The current MMA autoprovisioning process and its related policy initiative will be deprecated. It can still be used by customers, but they won't be eligible for support. |

## Deprecating two security incidents

**Estimated date for change: November 2023**

Following quality improvement process, the following security incidents are set to be deprecated: `Security incident detected suspicious virtual machines activity` and `Security incident detected on multiple machines`.

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md).
