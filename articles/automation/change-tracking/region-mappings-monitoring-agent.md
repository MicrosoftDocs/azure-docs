---
title: Supported regions for Change tracking and inventory using Azure Monitoring Agent (Preview)
description: This article describes the supported region mappings between an Automation account and monitoring agent workspace as it relates to certain features of Azure Automation.
ms.date: 11/24/2022
services: automation
ms.topic: conceptual
ms.custom: references_regions
---

# Supported regions for Change tracking and inventory Azure Monitoring Agent (Preview)

This article provides the supported mappings in order to successfully enable and use these features in your Automation account.

For more information, see [Log Analytics workspace and Automation account](../../azure-monitor/insights/solutions.md#log-analytics-workspace-and-automation-account).

## Supported mappings

> [!NOTE]
> As shown in following table, only one mapping can exist between Log Analytics and Azure Automation.

The following table shows the supported mappings:

|**Geography**| **Monitoring Agent workspace region**|
|---| ---|
|**US**| East US<sup>1</sup> </br> East US2<sup>2</sup> </br> West US </br> West US2 </br> NorthCentral US </br> Central US </br> SouthCentral US </br> WestCentral US|
|**Brazil**| Brazil South|
|**Canada**| Canada Central|
|**China**| China East2<sup>3</sup>|
|**Asia Pacific**| EastAsia </br> Southeast Asia|
|**India**| Central India|
|**Japan**| Japan East|
|**Australia**| Australia East </br> Australia Southeast|
|**Korea**| Korea Central|
|**Norway**| Norway East|
|**Europe**| North Europe </br> West Europe|
|**France**| France Central|
|**United Kingdom**| UK South|
|**Switzerland**| Switzerland North|
|**United Arab Emirates**| UAE North|
|**US Gov**| US Gov Virginia </br> US Gov Arizona<sup>3</sup>|

<sup>1</sup> East US mapping for Log Analytics workspaces to Automation accounts isn't an exact region-to-region mapping, but is the correct mapping.

<sup>2</sup> East US2 mapping for Log Analytics workspaces to Automation accounts isn't an exact region-to-region mapping, but is the correct mapping.

<sup>3</sup> In this region, only Update Management is supported, and other features like Change Tracking and Inventory aren't available at this time.

## Unlink a workspace

If you decide that you no longer want to integrate your Automation account with a Log Analytics workspace, you can unlink your account directly from the Azure portal. Before proceeding, you first need to Update Management, Change Tracking and Inventory, and Start/Stop VMs during off-hours if you're using them. If you don't remove them, you can't complete the unlinking operation.

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

* Learn about Update Management in [Update Management overview](../update-management/overview.md).
* Learn about Change Tracking and Inventory in [Change Tracking and Inventory overview](../change-tracking/overview.md).
* Learn about Start/Stop VMs during off-hours in [Start/Stop VMs during off-hours overview](../automation-solution-vm-management.md).
