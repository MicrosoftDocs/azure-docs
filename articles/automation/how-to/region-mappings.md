---
title: Supported regions for linked Log Analytics workspace
description: This article describes the supported region mappings between an Automation account and a Log Analytics workspace.
services: automation
ms.service: automation
ms.subservice: process-automation
author: mgoedtel
ms.author: magoedte
ms.date: 06/12/2020
ms.topic: conceptual
manager: carmonm
ms.custom: references_regions
---

# Supported regions for linked Log Analytics workspace

In Azure Automation, you can enable the Update Management, Change Tracking and Inventory, and Start/Stop VMs during off-hours features for your VMs. However, only certain regions are supported for linking a Log Analytics workspace and an Automation account in your subscription. The region mappings only apply to the Automation account and the Log Analytics workspace. The Log Analytics workspace and Automation account must be in the same subscription, but can be in different resource groups deployed to the same region. For further information, see [Log Analytics workspace and Automation account](../../azure-monitor/insights/solutions.md#log-analytics-workspace-and-automation-account).

## Supported mappings

The following table shows the supported mappings:

|**Log Analytics workspace region**|**Azure Automation region**|
|---|---|
|**US**||
|EastUS<sup>1</sup>|EastUS2|
|WestUS2|WestUS2|
|WestCentralUS2|WestCentralUS|
|**Canada**||
|CanadaCentral|CanadaCentral|
|**Asia Pacific**||
|AustraliaSoutheast|AustraliaSoutheast|
|SoutheastAsia|SoutheastAsia|
|CentralIndia|CentralIndia|
|ChinaEast2<sup>2</sup>|ChinaEast2|
|JapanEast|JapanEast|
|**Europe**||
|UKSouth|UKSouth|
|WestEurope|WestEurope|
|**US Gov**||
|USGovVirginia|USGovVirginia|
|USGovArizona<sup>2</sup>|USGovArizona|

<sup>1</sup> EastUS mapping for Log Analytics workspaces to Automation accounts isn't an exact region-to-region mapping, but is the correct mapping.

<sup>2</sup> In this region, only Update Management is supported, and other features like Change Tracking and Inventory are not available at this time.

## Unlink a workspace

If you decide that you no longer want to integrate your Automation account with a Log Analytics workspace, you can unlink your account directly from the Azure portal. Before proceeding, you first need to [remove](move-account.md#remove-features) Update Management, Change Tracking and Inventory, and Start/Stop VMs during off-hours if you are using them. If you don't remove them, you can't complete the unlinking operation. 

With the features removed, you can follow the steps below to unlink your Automation account.

> [!NOTE]
> Some features, including earlier versions of the Azure SQL monitoring solution, might have created Automation assets that need to be removed prior to unlinking the workspace.

1. From the Azure portal, open your Automation account. On the Automation account page, select **Linked workspace** under **Related Resources**.

2. On the Unlink workspace page, select **Unlink workspace**. You receive a prompt verifying if you want to continue.

3. While Azure Automation is unlinking the account from your Log Analytics workspace, you can track the progress under **Notifications** from the menu.

4. If you used Update Management, optionally you might want to remove the following items that are no longer needed:

    * Update schedules: Each has a name that matches an update deployment that you created.
    * Hybrid worker groups created for the feature: Each has a name similar to  `machine1.contoso.com_9ceb8108-26c9-4051-b6b3-227600d715c8`.

5. If you used Start/Stop VMs during off-hours, optionally you can remove the following items that are no longer needed:

    * Start and stop VM runbook schedules
    * Start and stop VM runbooks
    * Variables

Alternatively, you can unlink your workspace from your Automation account within the workspace.

1. In the workspace, select **Automation Account** under **Related Resources**. 
2. On the Automation Account page, select **Unlink account**.

## Next steps

* Learn about Update Management in [Update Management overview](../automation-update-management.md).
* Learn about Change Tracking and Inventory in [Change Tracking and Inventory overview](../change-tracking.md).
* Learn about Start/Stop VMs during off-hours in [Start/Stop VMs during off-hours overview](../automation-solution-vm-management.md).
