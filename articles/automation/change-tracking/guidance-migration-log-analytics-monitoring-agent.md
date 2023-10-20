---
title: Migration guidance from Change Tracking and inventory using Log Analytics to Azure Monitoring Agent
description: An overview on how to migrate from Change Tracking and inventory using Log Analytics to Azure Monitoring Agent.
author: snehasudhirG
services: automation
ms.subservice: change-inventory-management
ms.topic: conceptual
ms.date: 09/14/2023
ms.author: sudhirsneha
---

# Migration guidance from Change Tracking and inventory using Log Analytics to Change Tracking and inventory using Azure Monitoring Agent version


Migration from Log Analytics to Azure Monitoring Agent version
**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Azure Arc-enabled servers.

This article provides guidance to move from Change Tracking and Inventory using Log Analytics version to the Azure Monitoring Agent version.

## Onboarding to Change tracking and inventory using Azure Monitoring Agent

### [Using Azure portal - for single VM](#tab/ct-single-vm)

1.	Sign in to the [Azure portal](https://portal.azure.com) and select your virtual machine
1. Under **Operations** ,  select **Change tracking**.
1. Select **Configure with AMA** and in the **Configure with Azure monitor agent**,  provide the **Log analytics workspace** and select **Migrate** to initiate the deployment.

:::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/onboarding-single-vm-inline.png" alt-text="Screenshot of onboarding a single VM to Change tracking and inventory using Azure monitoring agent." lightbox="media/guidance-migration-log-analytics-monitoring-agent/onboarding-single-vm-expanded.png":::

Select **Switch to CT&I with AMA** to evaluate the incoming events and logs across LA agent and AMA version.

:::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/switch-versions-inline.png" alt-text="Screenshot that shows switching between log analytics and Azure Monitoring Agent after a successful migration." lightbox="media/guidance-migration-log-analytics-monitoring-agent/switch-versions-expanded.png":::

### [Using Azure portal - for Automation account](#tab/ct-at-scale)

1. Sign in to [Azure portal](https://portal.azure.com) and select your Automation account.
1. Under **Configuration Management**, select **Change tracking** and then select **Configure with AMA**.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/onboarding-at-scale-inline.png" alt-text="Screenshot of onboarding at scale to Change tracking and inventory using Azure monitoring agent." lightbox="media/guidance-migration-log-analytics-monitoring-agent/onboarding-at-scale-expanded.png":::

1. On the **Onboarding to Change Tracking with Azure Monitoring** page, you can view your automation account and list of machines that are currently on Log Analytics and ready to be onboarded to Azure Monitoring Agent of Change Tracking and inventory.
1. On the **Assess virtual machines** tab, select the machines and then select **Next**.
1. On **Assign workspace** tab, assign a new [Log Analytics workspace resource ID](#obtain-log-analytics-workspace-resource-id) to which the settings of AMA based solution should be stored and select **Next**.
   
   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/assign-workspace-inline.png" alt-text="Screenshot of assigning new Log Analytics resource ID." lightbox="media/guidance-migration-log-analytics-monitoring-agent/assign-workspace-expanded.png":::
   
1. On **Review** tab, you can review the machines that are being onboarded and the new workspace.
1. Select  **Migrate** to initiate the deployment.

After a successful migration, select **Switch to CT&I with AMA** to compare both the LA and AMA experience.

:::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/switch-versions-inline.png" alt-text="Screenshot that shows switching between log analytics and Azure Monitoring Agent after a successful migration." lightbox="media/guidance-migration-log-analytics-monitoring-agent/switch-versions-expanded.png":::


### [Using PowerShell script](#tab/ps-policy)

#### Prerequisites

- Ensure to have the Windows PowerShell console installed. Follow the steps to [install Windows PowerShell](https://learn.microsoft.com/powershell/scripting/windows-powershell/install/installing-windows-powershell?view=powershell-7.3).
- We recommend that you use PowerShell version 7.1.3 or higher.
- Obtain Read access for the specified workspace resources.
- Ensure that you have `Az.Accounts` and `Az.OperationalInsights` modules installed. The `Az.PowerShell` module is used to pull workspace agent configuration information.
- Ensure to have the Azure credentials to run `Connect-AzAccount` and `Select Az-Context` that set the context for the script to run.
Follow these steps to migrate using scripts.

#### Migration guidance

1. Install the script to run to conduct migrations.
1. Ensure that the new workspace resource ID is different to the one with which it's associated to in the Change Tracking and Inventory using the LA version.
1. Migrate settings for the following data types:
    - Windows Services
    - Linux Files
    - Windows Files
    - Windows Registry
    - Linux Daemons
1. Generate and associates a new DCR to transfer the settings to the Change Tracking and Inventory using AMA.

#### Onboard at scale

Use the [script](https://github.com/mayguptMSFT/AzureMonitorCommunity/blob/master/Azure%20Services/Azure%20Monitor/Agents/Migration%20Tools/DCR%20Config%20Generator/CTDcrGenerator/CTWorkSpaceSettingstoDCR.ps1) to migrate Change tracking workspace settings to data collection rule.
 
#### Parameters

**Parameter** | **Required** | **Description** |
--- | --- | --- | 
`InputWorkspaceResourceId`| Yes | Resource ID of the workspace associated to Change Tracking & Inventory with Log Analytics. |
`OutputWorkspaceResourceId`| Yes | Resource ID of the workspace associated to Change Tracking & Inventory with Azure Monitoring Agent. |
`OutputDCRName`| Yes | Custom name of the new DCR created. |
`OutputDCRLocation`| Yes | Azure location of the output workspace ID. |
`OutputDCRTemplateFolderPath`| Yes | Folder path where DCR templates are created. | 

---

### Obtain Log Analytics Workspace Resource ID

To obtain the Log Analytics Workspace resource ID, follow these steps:

1. Sign in to [Azure portal](https://portal.azure.com)
1. In **Log Analytics Worspace**, select the specific workspace and select **Json View**.
1. Copy the **Resource ID**.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/workspace-resource-inline.png" alt-text="Screenshot on how to obtain Log Analytics workspace resource ID." lightbox="media/guidance-migration-log-analytics-monitoring-agent/workspace-resource-expanded.png":::


## Limitations

### [Using Azure portal - for single VM](#tab/limit-single-vm)

1. 100 VMs per Automation Account can be migrated in one instance 
1. Any VM with > 100 file/registry settings for migration via portal is not supported at present 
1. Arc VM migration is not supported with portal, we recommend that you use PowerShell script migration.
1. For File Content changes-based settings, you have to migrate manually from LA version to AMA version of Change Tracking & Inventory. Follow the guidance listed in [Track file contents](manage-change-tracking-monitoring-agent.md#configure-file-content-changes).
1. Alerts that you configure using the Log Analytics Workspace must be [manually configured](configure-alerts.md).


### [Using Azure portal - for Automation account](#tab/limit-at-scale)

1. 100 VMs per Automation Account can be migrated in one instance 
1. Any VM with > 100 file/registry settings for migration via portal is not supported at present 
1. Arc VM migration is not supported with portal, we recommend that you use PowerShell script migration.
1. For File Content changes-based settings, you have to migrate manually from LA version to AMA version of Change Tracking & Inventory. Follow the guidance listed in [Track file contents](manage-change-tracking-monitoring-agent.md#configure-file-content-changes).
1. Alerts that you configure using the Log Analytics Workspace must be [manually configured](configure-alerts.md).

### [Using PowerShell script](#tab/limit-policy)

1. For File Content changes-based settings, you have to migrate manually from LA version to AMA version of Change Tracking & Inventory. Follow the guidance listed in [Track file contents](manage-change-tracking.md#track-file-contents).
1. Alerts that you configure using the Log Analytics Workspace must be [manually configured](configure-alerts.md).

---

## Disable Change tracking using Log Analytics Agent

After you enable management of your virtual machines using Change Tracking and Inventory using Azure Monitoring Agent, you may decide to stop using Change Tracking & Inventory with LA agent version and remove the configuration from the account.

The disable method incorporates the following:
- Removes change tracking with LA agent for selected few VMs within Log Analytics Workspace.
- Removes change tracking with LA agent from the entire Log Analytics Workspace.
 
## Next steps
-  To enable from the Azure portal, see [Enable Change Tracking and Inventory from the Azure portal](../change-tracking/enable-vms-monitoring-agent.md).

