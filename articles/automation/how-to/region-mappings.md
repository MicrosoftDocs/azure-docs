---
title: Supported regions for linked Log Analytics workspace
description: This article describes the supported region mappings between an Automation account and a Log Analytics workspace as it relates to certain features of Azure Automation.
ms.date: 03/16/2023
services: automation
ms.topic: conceptual
ms.custom: references_regions
---

# Supported regions for linked Log Analytics workspace

> [!NOTE]
> Start/Stop VM during off-hours version 1 is unavailable in the marketplace now as it will retire by 30 September 2023. We recommend you start using [version 2](../../azure-functions/start-stop-vms/overview.md), which is now generally available. The new version offers all existing capabilities and provides new features, such as multi-subscription support from a single Start/Stop instance. If you have the version 1 solution already deployed, you can still use the feature, and we will provide support until 30 September 2023. The details of the announcement will be shared soon. 

In Azure Automation, you can enable the Update Management, Change Tracking and Inventory, and Start/Stop VMs during off-hours features for your servers and virtual machines. These features have a dependency on a Log Analytics workspace, and therefore require linking the workspace with an Automation account. However, only certain regions are supported to link them together. In general, the mapping is *not* applicable if you plan to link an Automation account to a workspace that won't have these features enabled.

The mappings discussed here applying only to linking the Log Analytics Workspace to an Automation account. They don't apply to the virtual machines (VMs) that are connected to the workspace that's linked to the Automation Account. VMs aren't limited to the regions supported by a given Log Analytics workspace. They can be in any region. Keep in mind that having the VMs in a different region may affect state, local, and country/regional regulatory requirements, or your company's compliance requirements. Having VMs in a different region could also introduce data bandwidth charges.

Before connecting VMs to a workspace in a different region, you should review the requirements and potential costs to confirm and understand the legal and cost implications.

This article provides the supported mappings in order to successfully enable and use these features in your Automation account.

For more information, see [Log Analytics workspace and Automation account](/previous-versions/azure/azure-monitor/insights/solutions#log-analytics-workspace-and-automation-account).

## Supported mappings for Log Analytics and Azure Automation

> [!NOTE]
> As shown in following table, only one mapping can exist between Log Analytics and Azure Automation.

The following table shows the supported mappings:

|**Log Analytics workspace region**|**Azure Automation region**|
|---|---|
|**Asia Pacific**||
|EastAsia|EastAsia|
|SoutheastAsia|SoutheastAsia|
|**Australia**||
|AustraliaEast|AustraliaEast|
|AustraliaSoutheast|AustraliaSoutheast|
|**Brazil**||
|BrazilSouth|BrazilSouth|
|**Canada**||
|CanadaCentral|CanadaCentral|
|**China**||
|ChinaEast2<sup>3</sup>|ChinaEast2|
|**Europe**||
|NorthEurope|NorthEurope|
|WestEurope|WestEurope|
|**France**||
|FranceCentral|FranceCentral|
|**India**||
|CentralIndia|CentralIndia|
|**Japan**||
|JapanEast|JapanEast|
|**Korea**||
|KoreaCentral|KoreaCentral|
|**Norway**||
|NorwayEast|NorwayEast|
|**Qatar**||
|QatarCentral|QatarCentral|
|**Switzerland**||
|SwitzerlandNorth|SwitzerlandNorth|
|**United Arab Emirates**||
|UAENorth|UAENorth|
|**United Kingdom**
|UK South|UK South|
|**US Gov**||
|USGovArizona<sup>3</sup>|USGovArizona|
|USGovVirginia|USGovVirginia|
|**US**||
|EastUS<sup>1</sup>|EastUS2|
|EastUS2<sup>2</sup>|EastUS|
|CentralUS|CentralUS|
|NorthCentralUS|NorthCentralUS|
|SouthCentralUS|SouthCentralUS|
|WestUS|WestUS|
|WestUS2|WestUS2|
|WestUS3|WestUS3|
|WestCentralUS|WestCentralUS|

<sup>1</sup> EastUS mapping for Log Analytics workspaces to Automation accounts isn't an exact region-to-region mapping, but is the correct mapping.

<sup>2</sup> EastUS2 mapping for Log Analytics workspaces to Automation accounts isn't an exact region-to-region mapping, but is the correct mapping.

<sup>3</sup> In this region, only Update Management is supported, and other features like Change Tracking and Inventory aren't available at this time.


## Next steps

* Learn about Update Management in [Update Management overview](../update-management/overview.md).
* Learn about Change Tracking and Inventory in [Change Tracking and Inventory overview](../change-tracking/overview.md).
* Learn about Start/Stop VMs during off-hours in [Start/Stop VMs during off-hours overview](../automation-solution-vm-management.md).