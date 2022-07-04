---
title: Tools for migrating to Azure Monitor Agent from legacy agents 
description: This article describes various migration tools and helpers available for migrating from existing legacy agents to the new Azure Monitor agent (AMA) and data collection rules (DCR).
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: shseth
ms.date: 6/22/2022 
ms.custom: devx-track-azurepowershell, devx-track-azurecli

# Customer intent: As an Azure account administrator, I want to use the available Azure Monitor tools to migrate from Log Analytics agent to Azure Monitor Agent and track the status of the migration in my account.    

---

# Migration tools for Log Analytics agent to Azure Monitor Agent

Azure Monitor Agent (AMA) replaces the Log Analytics Agent for Windows and Linux virtual machines, scale sets, and on premise and Arc-enabled servers. The [benefits of migrating to Azure Monitor Agent](../agents/azure-monitor-agent-migration.md) include enhanced security, cost-effectiveness, performance, manageability and reliability. This article explains how to use the AMA Migration Helper Azure Monitor DCR Config Generator tools to help automate and track the migration from Log Analytics Agent to Azure Monitor Agent.

You must migrate from Log Analytics agent to Azure Monitor agent before **August 2024**. 

## Installing and using DCR Config Generator (preview)
Azure Monitor Agent relies only on [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md) for configuration, whereas the legacy agent pulls all its configuration from Log Analytics workspaces. Use the DCR Config Generator to parse legacy agent configuration from your workspaces and automatically generate corresponding rules. You can then associate the rules to machines running the new agent using built-in association policies. 

> [!NOTE]
> DCR Config Generator does not currently support additional configuration for [Azure solutions or services](./azure-monitor-agent-overview.md#supported-services-and-features) dependent on legacy the agent. DCR Config Generator will support migrating Azure solution and service configurationin future versions.

![Flow diagram that shows the steps involved in agent migration.](media/azure-monitor-agent-migration/mma-to-ama-migration-steps.png)

### Prerequisites

1. Powershell version 7.1.3 or higher is recommended (minimum version 5.1).
1. Primarily uses `Az Powershell module` to pull workspace agent configuration.
1. Read access for the specified workspace resource.
1. `Connect-AzAccount` and `Select-AzSubscription` used to set the context for the script to run so proper Azure credentials will be needed.

### Installing DCR Config Generator

1. [Download the powershell script](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Monitor/Agents/Migration%20Tools)
1. Run the script:

	1. Option 1

		```powershell
		.\WorkspaceConfigToDCRMigrationTool.ps1 -SubscriptionId $subId -ResourceGroupName $rgName -WorkspaceName $workspaceName -DCRName $dcrName -Location $location -FolderPath $folderPath
		```
	1. Option 2 (if you are just looking for the DCR payload json)

		```powershell
		$dcrJson = Get-DCRJson -ResourceGroupName $rgName -WorkspaceName $workspaceName -PlatformType $platformType $dcrJson | ConvertTo-Json -Depth 10 | Out-File "<filepath>\OutputFiles\dcr_output.json"
		```
	
		**Parameters**  
		
		| Parameter | Required? | Description |
		|------|------|------|
		| `SubscriptionId` | Yes | ID of the subscription that contains the target workspace. |
		| `ResourceGroupName` | Yes | Resource group that contains the target workspace. |
		| `WorkspaceName` | Yes | Name of the target workspace. |
		| `DCRName` | Yes | Name of the new DCR. |
		| `Location` | Yes | Region location for the new DCR. |
		| `FolderPath` | No | Path in which to save the new DCR. By default, Azure Monitor uses the current directory. |  
	
1. Review the output data collection rules. There are two ARM templates that can be produced (based on agent configuration of the target workspace):
	- Windows ARM Template and Parameter Files: created if target workspace contains Windows Performance Counters and/or Windows Events
	- Linux ARM Template and Parameter Files: created if target workspace contains Linux Performance Counters and/or Linux Syslog Events
	
1. Use the rule association built-in policies to associate generated rules with machines running the new agent. [Learn more](./data-collection-rule-azure-monitor-agent.md#data-collection-rule-associations)

## Installing and using AMA Migration Helper (preview)

AMA Migration Helper is a workbook-based Azure Monitor solution that helps you discover **what to migrate** and **track progress** as you move from legacy Log Analytics agents to Azure Monitor agent. Use this single pane of glass view to expedite and track the status of your agent migration journey. 

To set up the AMA Migration Helper workbook in the Azure portal:

1. From the **Monitor** menu, select **Workbooks** > **+ New** > **Advanced Editor** (**</>**).
4. Paste the content from the file attached.
5. Select **Apply** to load the workbook. 
1. Select **Done Editing**. 

    You’re now ready to use the workbook.

1. Select the **Subscriptions** and **Workspaces** dropdowns to view relevant information.

