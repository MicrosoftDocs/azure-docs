---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 06/21/2023
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you can learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might affect things like your secure score or workflows.

If you're looking for the latest release notes, you can find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).

## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled"](#replacing-the-key-vaults-should-have-purge-protection-enabled-recommendation-with-combined-recommendation-key-vaults-should-have-deletion-protection-enabled) | June 2023
| [Changes to the Defender for DevOps recommendations environment source and resource ID](#changes-to-the-defender-for-devops-recommendations-environment-source-and-resource-id) | July 2023 |
| [DevOps Resource Deduplication for Defender for DevOps](#devops-resource-deduplication-for-defender-for-devops) | July 2023 |
| [General availability release of agentless container posture in Defender CSPM](#general-availability-ga-release-of-agentless-container-posture-in-defender-cspm) | July 2023 |
| [Business model and pricing updates for Defender for Cloud plans](#business-model-and-pricing-updates-for-defender-for-cloud-plans) | July 2023 |
| [Change to the Log Analytics daily cap](#change-to-the-log-analytics-daily-cap) | September 2023 |

### Replacing the "Key Vaults should have purge protection enabled" recommendation with combined recommendation "Key Vaults should have deletion protection enabled". 

**Estimated date for change: June 2023**

The `Key Vaults should have purge protection enabled` recommendation is deprecated from the (regulatory compliance dashboard/Azure security benchmark initiative) and replaced with a new combined recommendation `Key Vaults should have deletion protection enabled`. 

| Recommendation name | Description | Effect(s) | Version |
|--|--|--|--|
| [Key vaults should have deletion protection enabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b60c0b2-2dc2-4e1c-b5c9-abbed971de53)| A malicious insider in your organization can potentially delete and purge key vaults. Purge protection protects you from insider attacks by enforcing a mandatory retention period for soft deleted key vaults. No one inside your organization or Microsoft will be able to purge your key vaults during the soft delete retention period. | audit, deny, disabled | [2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/KeyVault_Recoverable_Audit.json) |

See the [full index of Azure Policy built-in policy definitions for Key Vault](../key-vault/policy-reference.md)

### Changes to the Defender for DevOps recommendations environment source and resource ID

**Estimated date for change: July 2023**

The Security DevOps recommendations will be updated to align with the overall Microsoft Defender for Cloud features and experience.  Affected recommendations will point to a new recommendation source environment and have an updated resource ID.


Security DevOps recommendations impacted:
-	Code repositories should have code scanning findings resolved (preview)
-	Code repositories should have secret scanning findings resolved (preview)
-	Code repositories should have dependency vulnerability scanning findings resolved (preview)
-	Code repositories should have infrastructure as code scanning findings resolved (preview)
-	GitHub repositories should have code scanning enabled (preview)
-	GitHub repositories should have Dependabot scanning enabled (preview)
-	GitHub repositories should have secret scanning enabled (preview)

The recommendation environment source will be updated from `Azure` to `AzureDevOps` or `GitHub`. 

The format for resource IDs will be changed from:

`Microsoft.SecurityDevOps/githubConnectors/owners/repos/`

To:

`Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/repos`
`Microsoft.Security/securityConnectors/devops/gitHubOwners/repos`

As a part of the migration, source code management system specific recommendations will be created for security findings:
-	GitHub repositories should have code scanning findings resolved (preview)
-	GitHub repositories should have secret scanning findings resolved (preview)
-	GitHub repositories should have dependency vulnerability scanning findings resolved (preview)
-	GitHub repositories should have infrastructure as code scanning findings resolved (preview)
-	GitHub repositories should have code scanning enabled (preview)
-	GitHub repositories should have Dependabot scanning enabled (preview)
-	GitHub repositories should have secret scanning enabled (preview)
-	Azure DevOps repositories should have code scanning findings resolved (preview)
-	Azure DevOps repositories should have secret scanning findings resolved (preview)
-	Azure DevOps repositories should have infrastructure as code scanning findings resolved (preview)

Customers that rely on the `resourceID` to query DevOps recommendation data will be affected. For example, Azure Resource Graph queries, workbooks queries, API calls to Microsoft Defender for Cloud. 

Queries will need to be updated to include both the old and new `resourceID` to show both, for example, total over time.  

The recommendations page's experience will have minimal impact and deprecated assessments may continue to show for a maximum of 14 days if new scan results aren't submitted.  

### DevOps Resource Deduplication for Defender for DevOps

**Estimated date for change: July 2023**

To improve the Defender for DevOps user experience and enable further integration with Defender for Cloud's rich set of capabilities, Defender for DevOps will no longer support duplicate instances of a DevOps organization to be onboarded to an Azure tenant. 

If you don't have an instance of a DevOps organization onboarded more than once to your organization, no further action is required. If you do have more than one instance of a DevOps organization onboarded to your tenant, the subscription owner will be notified and will need to delete the DevOps Connector(s) they don't want to keep by navigating to Defender for Cloud Environment Settings. 

Customers will have until July 31, 2023 to resolve this issue. After this date, only the most recent DevOps Connector created where an instance of the DevOps organization exists will remain onboarded to Defender for DevOps. For example, if Organization Contoso exists in both connectorA and connectorB, and connectorB was created after connectorA, then connectorA will be removed from Defender for DevOps.

### General Availability (GA) release of Agentless Container Posture in Defender CSPM

**Estimated date for change: July 2023**

The new Agentless Container Posture capabilities are set for General Availability (GA) as part of the Defender CSPM (Cloud Security Posture Management) plan.

Learn more about [Agentless Containers Posture in Defender CSPM](concept-agentless-containers.md).

### Business model and pricing updates for Defender for Cloud plans

**Estimated date for change: July 2023**

Microsoft Defender for Cloud has three plans that offer service layer protection: 

- Defender for Key Vault 

- Defender for Azure Resource Manager 

- Defender for DNS 

These plans are transitioning to a new business model with different pricing and packaging to address customer feedback regarding spending predictability and simplifying the overall cost structure. 

**Business model and pricing changes summary**: 
 
Existing customers of Defender for Key-Vault, Defender for Azure Resource Manager, and Defender for DNS will keep their current business model and pricing unless they actively choose to switch to the new business model and price. 
 
- **Defender for Azure Resource Manager**: This plan will have a fixed price per subscription per month. Customers will have the option to switch to the new business model by selecting the Defender for Azure Resource Manager new per-subscription model. 

- **Defender for Key Vault**: This plan will have a fixed price per vault at per month with no overage charge. Customers will have the option to switch to the new business model by selecting the Defender for Key Vault new per-vault model 

- **Defender for DNS**: Defender for Servers Plan 2 customers will gain access to Defender for DNS value as part of Defender for Servers Plan 2 at no extra cost. Customers that have both Defender for Server Plan 2 and Defender for DNS will no longer be charged for Defender for DNS. Defender for DNS will no longer be available as a standalone plan. 

For more information on all of these plans, check out the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h) 

### Change to the Log Analytics daily cap

Azure monitor offers the capability to [set a daily cap](../azure-monitor/logs/daily-cap.md) on the data that is ingested on your Log analytics workspaces. However, Defender for Cloud security events are currently not supported in those exclusions.

Starting on September 18, 2023 the Log Analytics Daily Cap will no longer exclude the below set of data types: 

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
