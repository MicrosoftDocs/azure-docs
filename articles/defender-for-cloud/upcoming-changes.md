---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 03/20/2023
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might affect things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).

## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Changes in the recommendation "Machines should be configured securely"](#changes-in-the-recommendation-machines-should-be-configured-securely) | March 2023 |
| [Three alerts in the Defender for Azure Resource Manager plan will be deprecated](#three-alerts-in-the-defender-for-resource-manager-plan-will-be-deprecated) | March 2023 |
| [Alerts automatic export to Log Analytics workspace will be deprecated](#alerts-automatic-export-to-log-analytics-workspace-will-be-deprecated) | March 2023 |
| [Deprecation and improvement of selected alerts for Windows and Linux Servers](#deprecation-and-improvement-of-selected-alerts-for-windows-and-linux-servers) | April 2023 |
| [Deprecation of App Service language monitoring policies](#deprecation-of-app-service-language-monitoring-policies) | April 2023 |
| [Deprecation of legacy compliance standards across cloud environments](#deprecation-of-legacy-compliance-standards-across-cloud-environments) | April 2023 |
| [Multiple changes to identity recommendations](#multiple-changes-to-identity-recommendations) | April 2023 |
| [New Azure Active Directory authentication-related recommendations for Azure Data Services](#new-azure-active-directory-authentication-related-recommendations-for-azure-data-services) | April 2023 |

### Changes in the recommendation "Machines should be configured securely"

**Estimated date for change: March 2023**

The recommendation `Machines should be configured securely` will be updated. The update will improve the performance and stability of the recommendation and align its experience with the generic behavior of Defender for Cloud's recommendations.

As part of this update, the recommendation's ID will be changed from `181ac480-f7c4-544b-9865-11b8ffe87f47` to `c476dc48-8110-4139-91af-c8d940896b98`.

No action is required on the customer side, and there's no expected downtime nor impact on the secure score.


### Three alerts in the Defender for Resource Manager plan will be deprecated

**Estimated date for change: March 2023**

As we continue to improve the quality of our alerts, the following three alerts from the Defender for Resource Manager plan will be deprecated:
1. `Activity from a risky IP address (ARM.MCAS_ActivityFromAnonymousIPAddresses)`
1. `Activity from infrequent country (ARM.MCAS_ActivityFromInfrequentCountry)`
1. `Impossible travel activity (ARM.MCAS_ImpossibleTravelActivity)`

You can learn more details about each of these alerts from the [alerts reference list](alerts-reference.md#alerts-resourcemanager).

In the scenario where an activity from a suspicious IP address is detected, one of the following Defenders for Resource Manager plan alerts `Azure Resource Manager operation from suspicious IP address` or `Azure Resource Manager operation from suspicious proxy IP address` will be present.

### Alerts automatic export to Log Analytics workspace will be deprecated

**Estimated date for change: March 2023**

Currently, Defender for Cloud security alerts are automatically exported to a default Log Analytics workspace on the resource level. This causes an indeterministic behavior and therefore, this feature is set to be deprecated.

You can export your security alerts to a dedicated Log Analytics workspace with the [Continuous Export](continuous-export.md#set-up-a-continuous-export) feature. 
If you have already configured continuous export of your alerts to a Log Analytics workspace, no further action is required.

### Deprecation and improvement of selected alerts for Windows and Linux Servers

**Estimated date for change: April 2023**

The security alert quality improvement process for Defender for Servers includes the deprecation of some alerts for both Windows and Linux servers. The deprecated alerts will now be sourced from and covered by Defender for Endpoint threat alerts.  

If you already have the Defender for Endpoint integration enabled, no further action is required. You may experience a decrease in your alerts volume in April 2023.

If you don't have the Defender for Endpoint integration enabled in Defender for Servers, you'll need to enable the Defender for Endpoint integration to maintain and improve your alert coverage. 

All Defender for Servers customers, have full access to the Defender for Endpoint’s integration as a part of the [Defender for Servers plan](plan-defender-for-servers-select-plan.md#plan-features).  

You can learn more about [Microsoft Defender for Endpoint onboarding options](integration-defender-for-endpoint.md#enable-the-microsoft-defender-for-endpoint-integration).

You can also view the [full list of alerts](alerts-reference.md#defender-for-servers-alerts-to-be-deprecated) that are set to be deprecated.

Read the [Microsoft Defender for Cloud blog](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/defender-for-servers-security-alerts-improvements/ba-p/3714175).

### Deprecation of App Service language monitoring policies

The following App Service language monitoring policies are set to be deprecated because they generate false negatives and they don't necessarily provide better security. Instead, you should always ensure you're using a language version without any known vulnerabilities.

| Policy name | Policy ID |
|--|--|
| [App Service apps that use Java should use the latest 'Java version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F496223c3-ad65-4ecd-878a-bae78737e9ed) | 496223c3-ad65-4ecd-878a-bae78737e9ed |
| [App Service apps that use Python should use the latest 'Python version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7008174a-fd10-4ef0-817e-fc820a951d73) | 7008174a-fd10-4ef0-817e-fc820a951d73 |
| [Function apps that use Java should use the latest 'Java version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9d0b6ea4-93e2-4578-bf2f-6bb17d22b4bc) | 9d0b6ea4-93e2-4578-bf2f-6bb17d22b4bc |
| [Function apps that use Python should use the latest 'Python version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7238174a-fd10-4ef0-817e-fc820a951d73) | 7238174a-fd10-4ef0-817e-fc820a951d73 |
| [App Service apps that use PHP should use the latest 'PHP version'](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7261b898-8a84-4db8-9e04-18527132abb3)| 7261b898-8a84-4db8-9e04-18527132abb3 |

Customers can use alternative built-in policies to monitor any specified language version for their App Services. 

These will no longer be in Defender for Cloud's built-in recommendations. You can add them as custom recommendations to have Defender for Cloud monitor them.

### Deprecation of legacy compliance standards across cloud environments

**Estimated date for change: April 2023**

We are announcing the full deprecation of support of [`PCI DSS`](/azure/compliance/offerings/offering-pci-dss) standard/initiative in Azure China 21Vianet.

Legacy PCI DSS v3.2.1 and legacy SOC TSP are set to be fully deprecated and replaced by [SOC 2 Type 2](/azure/compliance/offerings/offering-soc-2) initiative and [PCI DSS v4](/azure/compliance/offerings/offering-pci-dss) initiative.
Learn how to [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

### Multiple changes to identity recommendations

**Estimated date for change: May 2023**

We announced previously the [availability of identity recommendations V2 (preview)](release-notes-archive.md#extra-recommendations-added-to-identity), which included enhanced capabilities.

As part of these changes, the following recommendations will be released as General Availability (GA) and replace the V1 recommendations that are set to be deprecated.

#### General Availability (GA) release of identity recommendations V2 

The following security recommendations will be released as GA and replace the V1 recommendations:
 
|Recommendation | Assessment Key|
|--|--|
|Accounts with owner permissions on Azure resources should be MFA enabled | 6240402e-f77c-46fa-9060-a7ce53997754 |
|Accounts with write permissions on Azure resources should be MFA enabled | c0cb17b2-0607-48a7-b0e0-903ed22de39b |
| Accounts with read permissions on Azure resources should be MFA enabled | dabc9bc4-b8a8-45bd-9a5a-43000df8aa1c |
| Guest accounts with owner permissions on Azure resources should be removed | 20606e75-05c4-48c0-9d97-add6daa2109a |
| Guest accounts with write permissions on Azure resources should be removed | 0354476c-a12a-4fcc-a79d-f0ab7ffffdbb |
| Guest accounts with read permissions on Azure resources should be removed | fde1c0c9-0fd2-4ecc-87b5-98956cbc1095 |
| Blocked accounts with owner permissions on Azure resources should be removed | 050ac097-3dda-4d24-ab6d-82568e7a50cf |
| Blocked accounts with read and write permissions on Azure resources should be removed | 1ff0b4c9-ed56-4de6-be9c-d7ab39645926 |

#### Deprecation of identity recommendations V1

The following security recommendations will be deprecated as part of this change:

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

We recommend updating custom scripts, workflows, and governance rules to correspond with the V2 recommendations.

We've improved the coverage of the V2 identity recommendations by scanning all Azure resources (rather than just subscriptions) which allows security administrators to view role assignments per account. These changes may result in changes to your Secure Score throughout the GA process.

### Deprecation of legacy compliance standards across cloud environments

**Estimated date for change: April 2023**

We are announcing the full deprecation of support of [`PCI DSS`](/azure/compliance/offerings/offering-pci-dss) standard/initiative in Azure China 21Vianet.

Legacy PCI DSS v3.2.1 and legacy SOC TSP are set to be fully deprecated and replaced by [SOC 2 Type 2](/azure/compliance/offerings/offering-soc-2) initiative and [`PCI DSS v4`](/azure/compliance/offerings/offering-pci-dss) initiative.
Learn how to [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

### New Azure Active Directory authentication-related recommendations for Azure Data Services

**Estimated date for change: April 2023**

| Recommendation Name | Recommendation Description | Policy |
|--|--|--|
| Azure SQL Managed Instance authentication mode should be Azure Active Directory Only | Disabling local authentication methods and allowing only Azure Active Directory Authentication improves security by ensuring that Azure SQL Managed Instances can exclusively be accessed by Azure Active Directory identities. Learn more at: aka.ms/adonlycreate | [Azure SQL Managed Instance should have Azure Active Directory Only Authentication enabled](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f78215662-041e-49ed-a9dd-5385911b3a1f) |
| Azure Synapse Workspace authentication mode should be Azure Active Directory Only | Azure Active Directory (AAD) only authentication methods improves security by ensuring that Synapse Workspaces exclusively require AAD identities for authentication. Learn more at: https://aka.ms/Synapse | [Synapse Workspaces should use only Azure Active Directory identities for authentication](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2158ddbe-fefa-408e-b43f-d4faef8ff3b8) |
| Azure Database for MySQL should have an Azure Active Directory administrator provisioned | Provision an Azure AD administrator for your Azure Database for MySQL to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services | Based on policy: [An Azure Active Directory administrator should be provisioned for MySQL servers](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f146412e9-005c-472b-9e48-c87b72ac229e) |
| Azure Database for PostgreSQL should have an Azure Active Directory administrator provisioned | Provision an Azure AD administrator for your Azure Database for PostgreSQL to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services | Based on policy: [An Azure Active Directory administrator should be provisioned for PostgreSQL servers](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb4dec045-250a-48c2-b5cc-e0c4eec8b5b4) |


## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md).
