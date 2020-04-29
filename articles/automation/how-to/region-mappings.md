---
title: Azure Automation and Log Analytics workspace mappings
description: This article describes the mappings allowed between an Automation account and a Log Analytics workspace.
services: automation
ms.service: automation
ms.subservice: process-automation
author: mgoedtel
ms.author: magoedte
ms.date: 04/23/2020
ms.topic: conceptual
manager: carmonm
---

# Workspace mappings

In Azure Automation, you can enable the following solutions: "Update Management," "Change Tracking and Inventory," and "Start/Stop VMs during off hours." When you do so, however, be aware that only certain regions are supported for linking a Log Analytics workspace and an Automation account in your subscription. This mapping only applies to the Automation account and the Log Analytics workspace. The Log Analytics workspace and Automation account must be in the same subscription, but can be in different resource groups deployed to the same region.

For further information, see [Log Analytics workspace and Automation account](../../azure-monitor/insights/solutions.md#log-analytics-workspace-and-automation-account).

## Supported mappings

The following table shows the supported mappings:

|**Log Analytics workspace region**|**Azure Automation region**|
|---|---|
|**US**||
|EastUS<sup>1</sup>|EastUS2|
|WestUS2|WestUS2|
|WestCentralUS<sup>2</sup>|WestCentralUS<sup>2</sup>|
|**Canada**||
|CanadaCentral|CanadaCentral|
|**Asia Pacific**||
|AustraliaSoutheast|AustraliaSoutheast|
|SoutheastAsia|SoutheastAsia|
|CentralIndia|CentralIndia|
|JapanEast|JapanEast|
|**Europe**||
|UKSouth|UKSouth|
|WestEurope|WestEurope|
|**US Gov**||
|USGovVirginia|USGovVirginia|

<sup>1</sup> EastUS mapping for Log Analytics workspaces to Automation accounts isn't an exact region-to-region mapping, but is the correct mapping.

<sup>2</sup> Due to capacity restraints, the region isn't available when you're creating new resources. This includes Automation accounts and Log Analytics workspaces. However, pre-existing linked resources in the region should continue to work.

## Unlink a workspace

If you decide that you no longer want to integrate your Automation account with a Log Analytics workspace, you can unlink your account directly from the Azure portal. Before proceeding, you first need to remove "Update Management," "Change Tracking and Inventory," and "Start/Stop VMs during off hours" if you are using them. If you don't remove them, you can't complete the unlinking operation. Review the article for each solution that you're enabling, in order to understand the steps required to remove it.

After you remove them, you can perform the following steps to unlink your Automation account.

> [!NOTE]
> Some solutions, including earlier versions of the Azure SQL monitoring solution, might have created Automation assets, and might need to be removed prior to unlinking the workspace.

1. From the Azure portal, open your Automation account. On the **Automation account** page, select **Linked workspace** under **Related Resources**.

2. On the **Unlink workspace** page, select **Unlink workspace**. You receive a prompt verifying if you want to continue.

3. While Azure Automation attempts to unlink the account your Log Analytics workspace, you can track the progress under **Notifications** from the menu.

4. If you used "Update Management," optionally you might want to remove the following items that are no longer needed after you remove it.

    * Update schedules: Each has a name that matches an update deployment that you created.
    * Hybrid worker groups created for the solution:  Each has a name similar to  `machine1.contoso.com_9ceb8108-26c9-4051-b6b3-227600d715c8`.

5. If you used "Start/Stop VMs during off hours," you can optionally remove the following items that aren't needed after you remove it.

    * Start and stop VM runbook schedules
    * Start and stop VM runbooks
    * Variables

Alternatively, you can unlink your workspace from your Automation account within the workspace.

1. In the workspace, select **Automation Account** under **Related Resources**. 
2. On the **Automation Account** page, select **Unlink account**.

## Next steps

* Learn how to start using "Update Management" and "Change Tracking and Inventory":

    * From a [virtual machine](../automation-onboard-solutions-from-vm.md).
    * From your [Automation account](../automation-onboard-solutions-from-automation-account.md).
    * When [browsing multiple machines](../automation-onboard-solutions-from-browse.md).
    * From a [runbook](../automation-onboard-solutions.md).

* Learn how to start using "Start/Stop VMs during off hours":

    * [Start/Stop VMs during off hours overview](../automation-solution-vm-management.md).
