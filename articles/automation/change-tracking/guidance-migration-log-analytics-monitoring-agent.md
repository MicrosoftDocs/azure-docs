---
title: Migration guidance from Change Tracking and inventory using Log Analytics to Azure Monitoring Agent
description: An overview on how to migrate from Change Tracking and inventory using Log Analytics to Azure Monitoring Agent.
author: snehasudhirG
services: automation
ms.subservice: change-inventory-management
ms.topic: how-to
ms.date: 01/03/2025
ms.author: sudhirsneha
ms.custom:
ms.service: azure-automation
---

# Migration guidance from Change Tracking and inventory using Log Analytics to Change Tracking and inventory using Azure Monitoring Agent version

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Azure Arc-enabled servers.

This article provides guidance to move from Change Tracking and Inventory using Log Analytics (LA) version to the Azure Monitoring Agent (AMA) version. 

Using the Azure portal, you can migrate from Change Tracking & Inventory with LA agent to Change Tracking & Inventory with AMA and there are two ways to do this migration: 

- Migrate single/multiple machines from the Azure Virtual Machines page or Machines-Azure Arc page.
- Migrate multiple Virtual Machines on LA version solution within a particular Automation Account.

Additionally, you can use a script to migrate all Virtual Machines and Arc-enabled non-Azure machines at a Log Analytics workspace level from LA version solution to Change Tracking and Inventory with AMA. This isn't possible using the Azure portal experience mentioned above.

The script allows you to also migrate to the same workspace. If you are migrating to the same workspace then, the script will remove the LA(MMA/OMS) Agent from your machines. This may cause the other solutions to stop working. We therefore, recommend that you plan the migration accordingly. For example, first migrate other solution and then proceed with Change Tracking migration.

> [!NOTE]
> The removal doesn't work on MMA agents that were installed using the MSI installer. It only works on VM/Arc VM extensions.


> [!NOTE]
> File Integrity Monitoring (FIM) using [Microsoft Defender for Endpoint (MDE)](/azure/defender-for-cloud/file-integrity-monitoring-enable-defender-endpoint) is now currently available. Follow the guidance to migrate from:
> - [FIM with Change Tracking and Inventory using AMA](/azure/defender-for-cloud/migrate-file-integrity-monitoring#migrate-from-fim-over-ama).
> - [FIM with Change Tracking and Inventory using MMA](/azure/defender-for-cloud/migrate-file-integrity-monitoring#migrate-from-fim-over-mma).

## Onboarding to Change tracking and inventory using Azure Monitoring Agent

### [Single Azure VM - Azure portal](#tab/ct-single-vm)

To onboard through Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and select your virtual machine
1. Under **Operations** ,  select **Change tracking**.
1. Select **Configure with AMA** and in the **Configure with Azure monitor agent**,  provide the **Log analytics workspace** and select **Migrate** to initiate the deployment.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/onboarding-single-vm-inline.png" alt-text="Screenshot of onboarding a single VM to Change tracking and inventory using Azure monitoring agent." lightbox="media/guidance-migration-log-analytics-monitoring-agent/onboarding-single-vm-expanded.png":::

1. Select **Switch to CT&I with AMA** to evaluate the incoming events and logs across LA agent and AMA version.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/switch-versions-inline.png" alt-text="Screenshot that shows switching between log analytics and Azure Monitoring Agent after a successful migration." lightbox="media/guidance-migration-log-analytics-monitoring-agent/switch-versions-expanded.png":::

### [Automation account - Azure portal](#tab/ct-at-scale)

1. Sign in to [Azure portal](https://portal.azure.com) and select your Automation account.
1. Under **Configuration Management**, select **Change tracking** and then select **Configure with AMA**.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/onboarding-at-scale-inline.png" alt-text="Screenshot of onboarding at scale to Change tracking and inventory using Azure monitoring agent." lightbox="media/guidance-migration-log-analytics-monitoring-agent/onboarding-at-scale-expanded.png":::

1. On the **Onboarding to Change Tracking with Azure Monitoring** page, you can view your automation account and list of both Azure and Azure Arc machines that are currently on Log Analytics and ready to be onboarded to Azure Monitoring Agent of Change Tracking and inventory.
   
   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/onboarding-from-log-analytics-inline.png" alt-text="Screenshot of onboarding multiple virtual machines to Change tracking and inventory from log analytics to Azure monitoring agent." lightbox="media/guidance-migration-log-analytics-monitoring-agent/onboarding-from-log-analytics-expanded.png":::

1. On the **Assess virtual machines** tab, select the machines and then select **Next**.
1. On **Assign workspace** tab, assign a new [Log Analytics workspace resource ID](#obtain-log-analytics-workspace-resource-id) to which the settings of AMA based solution should be stored and select **Next**.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/assign-workspace-inline.png" alt-text="Screenshot of assigning new Log Analytics resource ID." lightbox="media/guidance-migration-log-analytics-monitoring-agent/assign-workspace-expanded.png":::

1. On **Review** tab, you can review the machines that are being onboarded and the new workspace.
1. Select  **Migrate** to initiate the deployment.

1. After a successful migration, select **Switch to CT&I with AMA** to compare both the LA and AMA experience.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/switch-versions-inline.png" alt-text="Screenshot that shows switching between log analytics and Azure Monitoring Agent after a successful migration." lightbox="media/guidance-migration-log-analytics-monitoring-agent/switch-versions-expanded.png":::

### [Single Azure Arc VM - Azure portal](#tab/ct-single-arcvm)

1. Sign in to the [Azure portal](https://portal.azure.com). Search for and select **Machines-Azure Arc**.

   :::image type="content" source="media/enable-vms-monitoring-agent/select-arc-machines-portal.png" alt-text="Screenshot showing how to select Azure Arc machines from the portal." lightbox="media/enable-vms-monitoring-agent/select-arc-machines-portal.png":::

1. Select the specific Arc machine with Change Tracking V1 enabled that needs to be migrated to Change Tracking V2.

1. Select **Migrate to Change Tracking with AMA** and in the **Configure with Azure monitor agent**,  provide the resource ID in the **Log analytics workspace** and select **Migrate** to initiate the deployment.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/onboarding-single-arc-vm.png" alt-text="Screenshot of onboarding a single Arc VM to Change tracking and inventory using Azure monitoring agent." lightbox="media/guidance-migration-log-analytics-monitoring-agent/onboarding-single-arc-vm.png":::

1. Select **Manage Activity log connection** to evaluate the incoming events and logs across LA agent and AMA version.

### [Log Analytics Workspace - PowerShell Script ](#tab/ps-policy)

#### Prerequisites

- Ensure you have PowerShell installed on the machine where you are planning to execute the script.
    - The script cannot be executed on Azure Cloud Shell.
    -  The latest version of PowerShell 7 or higher is recommended. Follow the steps to [Install PowerShell on Windows, Linux, and macOS](/powershell/scripting/install/installing-powershell).
- Obtain Write access for the specified workspace and machine resources.
- [Install the latest version of the Az PowerShell module](/powershell/azure/install-azure-powershell). The **Az.Accounts** and **Az.OperationalInsights** modules are required to pull workspace agent configuration information.
- Ensure you have Azure credentials to run `Connect-AzAccount` and `Select-AzContext` which set the script's context.

Follow these steps to migrate using scripts:

#### Migration guidance

- The [script](https://github.com/Azure/ChangeTrackingAndInventory/blob/main/MigrateToChangeTrackingAndInventoryUsingAMA/CTAndIMigrationFromMMAToAMA.ps1) will migrate all Azure Machines and Arc enabled Non-Azure Machines onboarded to LA Agent Change Tracking solution for the Input Log Analytics Workspace to the Change Tracking using AMA agent for the Output Log Analytics Workspace. 

- The script provides the ability to migrate using the same workspace, that is Input and Output Log Analytics Workspaces are the same. However, it will then remove the LA (MMA/OMS) agents from the machines.

- The script migrates the settings for the following data types:
    - Windows services
    - Linux files
    - Windows files
    - Windows registry
    - Linux Daemons
      
- The script consists of the following **Parameters**  that require an input from you. 

   **Parameter** | **Required** | **Description** |
   --- | --- | --- |
   `InputLogAnalyticsWorkspaceResourceId`| Yes | Resource ID of the workspace associated with Change Tracking & Inventory with Log Analytics. |
   `OutputLogAnalyticsWorkspaceResourceId`| Yes | Resource ID of the workspace associated with Change Tracking & Inventory with Azure Monitoring Agent. |
   `OutputDCRName`| Yes | Custom name of the new DCR to be created. |
   `OutputVerbose`| No | Optional. Input $true for verbose logs. |
   `AzureEnvironment`| Yes | Folder path where DCR templates are created. |

- In Details, the script does the following:

   1. Get list of all Azure and Arc Onboarded Non-Azure machines onboarded to Input Log Analytics Workspace for Change Tracking solution using MMA Agent. 
   1. Create the Data Collection Rule (DCR) ARM template by fetching the files, services, tracking & registry settings configured in the legacy solution and translating them to equivalent settings for the latest solution using AMA Agent and Change Tracking Extensions for the Output Log Analytics Workspace. 
   1. Deploy Change Tracking solution ARM template to Output Log Analytics Workspace. This is done only if migration to the same workspace is not done. The output workspace requires the legacy solution to create the log analytics tables for Change Tracking like ConfigurationChange & ConfigurationData. The deployment name will be DeployCTSolution_CTMig_{GUID} and it will be in same resource group as Output Log Analytics Workspace. 
   1. Deploy the DCR ARM template created in Step 2. The deployment name will be OutputDCRName_CTMig_{GUID} and it will be in same resource group as Output Log Analytics Workspace. The DCR will be created in the same location as the Output Log Analytics Workspace. 
   1. Removes MMA Agent from machines list populated in Step 1. This is done only if migration to the same workspace is carried out. Machines which have the MMA agent installed via the MSI, will not have the MMA agent removed. It will be removed only if the MMA Agent was installed as an extension. 
   1. Assign DCR to machines and install AMA Agent and CT Extensions. The deployment name of it will be MachineName_CTMig and it will be in same resource group as the machine. 
       - Assign the DCR deployed in Step 4 to all machines populated in Step 1. 
       - Install the AMA Agent to all machines populated in Step 1.  
       - Install the CT Agent to all machines populated in Step 1. 
---

### Compare data across Log analytics Agent and Azure Monitoring Agent version

After you complete the onboarding to Change tracking with AMA version, select **Switch to CT with AMA** on the landing page to switch across the two versions and compare the following events.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/data-compare-log-analytics-monitoring-agent-inline.png" alt-text="Screenshot of data comparison from log analytics to Azure monitoring agent." lightbox="media/guidance-migration-log-analytics-monitoring-agent/data-compare-log-analytics-monitoring-agent-expanded.png":::

For example, if the onboarding to AMA version of service takes place after 3rd November at 6:00 a.m. You can compare the data by keeping consistent filters across parameters like **Change Types**, **Time Range**. You can compare incoming logs in **Changes** section and in the graphical section to be assured on data consistency.

> [!NOTE]
> You must compare for the incoming data and logs after the onboarding to AMA version is done.

### Obtain Log Analytics Workspace Resource ID

To obtain the Log Analytics Workspace resource ID, follow these steps:

1. Sign in to [Azure portal](https://portal.azure.com)
1. In **Log Analytics Workspace**, select the specific workspace and select **Json View**.
1. Copy the **Resource ID**.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/workspace-resource-inline.png" alt-text="Screenshot that shows the log analytics workspace ID." lightbox="media/guidance-migration-log-analytics-monitoring-agent/workspace-resource-expanded.png":::


## Limitations

### [Using Azure portal](#tab/limit-single-vm)

**For single VM and Automation Account**

1. For File Content changes-based settings, you have to migrate manually from LA version to AMA version of Change Tracking & Inventory. Follow the guidance listed in [Track file contents](manage-change-tracking-monitoring-agent.md#configure-file-content-changes).
1. If migration to different workspace is carried out, then alerts configured using the Log Analytics Workspace must be [manually configured](configure-alerts.md).

### [Using PowerShell script](#tab/limit-policy)

1. For File Content changes-based settings, you have to migrate manually from LA version to AMA version of Change Tracking & Inventory. Follow the guidance listed in [Track file contents](manage-change-tracking-monitoring-agent.md#configure-file-content-changes).
1. If migration to different workspace is carried out, then alerts configured using the Log Analytics Workspace must be [manually configured](configure-alerts.md).

---

## Disable Change tracking using Log Analytics Agent

After you enable management of your virtual machines using Change Tracking and Inventory using Azure Monitoring Agent, you might decide to stop using Change Tracking & Inventory with LA agent version and remove the configuration from the account.

The disable method incorporates the following:
- [Removes change tracking with LA agent for selected few VMs within Log Analytics Workspace](remove-vms-from-change-tracking.md).
- [Removes change tracking with LA agent from the entire Log Analytics Workspace](remove-feature.md).

## Next steps
-  To enable from the Azure portal, see [Enable Change Tracking and Inventory from the Azure portal](../change-tracking/enable-vms-monitoring-agent.md).
