---
title: Guidance to move from Change Tracking and Analytics using Log Analytics to Azure Monitoring Agent
description: An overview on how to migrate from Change Tracking and Analytics using Log Analytics to Azure Monitoring Agent.
author: snehasudhirG
services: automation
ms.subservice: change-inventory-management
ms.topic: conceptual
ms.date: 09/14/2023
ms.author: sudhirsneha
---

# Guidance to move from Change Tracking and Analytics using Log Analytics to Change Tracking and Analytics using Azure Monitoring Agent

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article provides guidance to move from Change Tracking and Inventory using Log Analytics version of the Azure Monitoring Agent version.

## Prerequisites

- Ensure to have the Windows PowerShell console installed. Follow the steps to [install Windows PowerShell](https://learn.microsoft.com/powershell/scripting/windows-powershell/install/installing-windows-powershell?view=powershell-7.3).
- We recommend that you use PowerShell version 7.1.3 or higher.
- Obtain Read access for the specified workspace resources.
- Ensure that you have `Az.Accounts` and `Az.OperationalInsights` modules installed. The `Az.PowerShell` module is used to pull workspace agent configuration information.
- Ensure to have the Azure credentials to run `Connect-AzAccount` and `Select Az-Context` that set the context for the script to run.


### Limitations

Currently, the following aren't supported:
- For File Content changes-based settings, you have to migrate manually from LA version to AMA version of Change Tracking & Inventory. Follow the guidance listed in [Track file contents](manage-change-tracking.md#track-file-contents).
- Alerts that you configure using the Log Analytics Workspace must be [manually configured](configure-alerts.md).

### Migration guidance

Follow these steps to migrate using scripts.

1. Install the script to run to conduct migrations.
1. Ensure that the new workspace resource ID is different to the one with which it's associated to in the Change Tracking and Inventory using the LA version.
1. Migrate settings for the following data types:
    - Windows Services
    - Linux Files
    - Windows Files
    - Windows Registry
1. Generate and associates a new DCR to transfer the settings to the Change Tracking and Inventory using AMA.

#### Parameters
 



**Parameter** | **Required** | **Description** |
--- | --- | --- | 
`InputWorkspaceResourceId`| Yes | Resource ID of the workspace associated to Change Tracking & Inventory with Log Analytics. |
`OutputWorkspaceResourceId`| Yes | Resource ID of the workspace associated to Change Tracking & Inventory with Azure Monitoring Agent. |
`OutputDCRName`| Yes | Custom name of the new DCR created. |
`OutputDCRLocation`| Yes | Azure location of the output workspace ID. |
`OutputDCRTemplateFolderPath`| Yes | Folder path where DCR templates are created. | 

 
## Next steps
-  To enable from the Azure portal, see [Enable Change Tracking and Inventory from the Azure portal](../change-tracking/enable-vms-monitoring-agent.md).

