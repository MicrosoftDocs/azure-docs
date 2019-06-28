---
title: Azure Automation and Log Analytics workspace mappings
description: This article describes the mappings allowed between an Automation Account and a Log Analytics Workspace to support solution
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 05/20/2019
ms.topic: conceptual
manager: carmonm
---
# Workspace mappings

When enabling solutions like Update Management, Change Tracking and Inventory, or the Start/Stop VMs during off-hours solution, only certain regions are supported for linking a Log Analytics workspace and an Automation Account. This mapping only applies to the Automation Account and the Log Analytics workspace. The resources reporting to your Automation Account or Log Analytics workspace can reside in other regions.

## Supported mappings

The following table shows the supported mappings:

|**Log Analytics Workspace Region**|**Azure Automation Region**|
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

<sup>1</sup> EastUS mapping for Log Analytics workspaces to Automation Accounts is not an exact region to region mapping but is the correct mapping.

<sup>2</sup> Due to capacity restraints the region isn't available when creating new resources. This includes Automation Accounts and Log Analytics workspaces. However, preexisting linked resources in the region should continue to work.

## Unlink workspace

If you decide you no longer wish to integrate your Automation account with a Log Analytics workspace, you can unlink your account directly from the Azure portal. Before you proceed, you first need to remove the Update Management, Change Tracking and Inventory, or the Start/Stop VMs during off-hours solutions if you are using them. If you do not remove them, this process will be prevented from proceeding. Review the article for the particular solution you have imported to understand the steps required to remove it.

After you remove these solutions, you can perform the following steps to unlink your Automation account.

> [!NOTE]
> Some solutions including earlier versions of the Azure SQL monitoring solution may have created automation assets and may also need to be removed prior to unlinking the workspace.

1. From the Azure portal, open your Automation account, and on the Automation account page  select **Linked workspace** under the section **Related Resources** on the left.

2. On the Unlink workspace page, click **Unlink workspace**. You'll receive a prompt verifying you wish to continue.

3. While Azure Automation attempts to unlink the account your Log Analytics workspace, you can track the progress under **Notifications** from the menu.

If you used the Update Management solution, optionally you may want to remove the following items that are no longer needed after you remove the solution.

* Update schedules - Each will have names that match the update deployments you created)

* Hybrid worker groups created for the solution -  Each will be named similarly to  machine1.contoso.com_9ceb8108-26c9-4051-b6b3-227600d715c8).

If you used the Start/Stop VMs during off-hours solution, optionally you may want to remove the following items that are no longer needed after you remove the solution.

* Start and stop VM runbook schedules
* Start and stop VM runbooks
* Variables

Alternatively, you can also unlink your workspace from your Automation Account from your Log Analytics workspace. On your workspace, select **Automation Account** under **Related Resources**. On the Automation Account page, select **Unlink account**.

## Next steps

Learn how to onboard the following solutions:

Update Management and Change Tracking and Inventory:

* From a [virtual machine](../automation-onboard-solutions-from-vm.md)
* From your [Automation account](../automation-onboard-solutions-from-automation-account.md)
* When [browsing multiple machines](../automation-onboard-solutions-from-browse.md)
* From a [runbook](../automation-onboard-solutions.md)

Start/Stop VMs during off-hours

* [Deploy Start/Stop VMs during off-hours](../automation-solution-vm-management.md)