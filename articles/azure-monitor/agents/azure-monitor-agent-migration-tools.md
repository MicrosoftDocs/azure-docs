---
title: Migration tools for legacy agent to Azure Monitor agent
description: This article describes various migration tools and helpers available for migrating from the existing legacy agents to the new Azure Monitor agent (AMA) and data collection rules (DCR).
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 7/6/2022 
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Migration tools for Log Analytics agent to Azure Monitor Agent
The [Azure Monitor agent (AMA)](azure-monitor-agent-overview.md) collects monitoring data from the guest operating system of Azure virtual machines, scale sets, on premise and multi-cloud servers and Windows client devices. It uploads the data to Azure Monitor destinations where it can be used by different features, insights, and other services such as [Microsoft Sentinel](../../sentintel/../sentinel/overview.md) and [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md). All of the data collection configuration is handled via [Data Collection Rules](../essentials/data-collection-rule-overview.md).  
The Azure Monitor agent is meant to replace the Log Analytics agent (also known as MMA and OMS) for both Windows and Linux machines. By comparison, it is more **secure, cost-effective, performant, manageable and reliable**. You must migrate from [Log Analytics agent] to [Azure Monitor agent] before **August 2024**. To make this process easier and automated, use agent migration described in this article.

:::image type="content" source="media/azure-monitor-agent-migration/migration-steps.png" alt-text="Flow diagram to demonstrate the steps involved in agent migration.":::

## AMA Migration Helper (preview)
A workbook-based solution in Azure Monitor that helps you discover **what to migrate** and **track progress** as you move from legacy Log Analytics agents to Azure Monitor agent on your virtual machines, scale sets, on premise and Arc-enabled servers in your subscriptions. Use this single glass pane view to expedite your agent migration journey. 

The workbook is available under the *Community Git repo > Azure Monitor* option, linked [here](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Monitor/Agents/Migration%20Tools/Migration%20Helper%20Workbook)

1. Open Azure portal > Monitor > Workbooks
2. Click ‘+ New’
3. Click on the ‘Advanced Editor’ </> button
4. Copy and paste the workbook JSON content here.
5. Click ‘Apply’ to load the workbook. Finally click ‘Done Editing’. You’re now ready to use the workbook
6. Select subscriptions and workspaces drop-downs to view relevant information


## DCR Config Generator (preview)
The Azure Monitor agent relies only on [Data Collection rules](../essentials/data-collection-rule-overview.md) for configuration, whereas the legacy agent pulls all its configuration from Log Analytics workspaces. Use this tool to parse legacy agent configuration from your workspaces and automatically generate corresponding rules. You can then associate the rules to machines running the new agent using built-in association policies. 

> [!NOTE]
> Additional configuration for [Azure solutions or services](./azure-monitor-agent-overview.md#supported-services-and-features) dependent on agent are not yet supported in this tool. 


1. **Prerequisites**
	- PowerShell version 7.1.3 or higher is recommended (minimum version 5.1)
	- Primarily uses `Az Powershell module` to pull workspace agent configuration information
	- You must have read access for the specified workspace resource
	- `Connect-AzAccount` and `Select-AzSubscription` will be used to set the context for the script to run so proper Azure credentials will be needed
2. [Download the PowerShell script](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Monitor/Agents/Migration%20Tools/DCR%20Config%20Generator)
2. Run the script using one of the options below:
	- Option 1
		# [PowerShell](#tab/ARMAgentPowerShell)
		```powershell
		.\WorkspaceConfigToDCRMigrationTool.ps1 -SubscriptionId $subId -ResourceGroupName $rgName -WorkspaceName $workspaceName -DCRName $dcrName -Location $location -FolderPath $folderPath
		```
	- Option 2 (if you are just looking for the DCR payload json)
		# [PowerShell](#tab/ARMAgentPowerShell)
		```powershell
		$dcrJson = Get-DCRJson -ResourceGroupName $rgName -WorkspaceName $workspaceName -PlatformType $platformType $dcrJson | ConvertTo-Json -Depth 10 | Out-File "<filepath>\OutputFiles\dcr_output.json"
		```
	
		**Parameters**  
		
		| Parameter | Required? | Description |
		|------|------|------|
		| SubscriptionId | Yes | Subscription ID that contains the target workspace |
		| ResourceGroupName | Yes | Resource Group that contains the target workspace |
		| WorkspaceName | Yes | Name of the target workspace |
		| DCRName | Yes | Name of the new generated DCR to create |
		| Location | Yes | Region location for the new DCR |
		| FolderPath | No |  Local path to store the output. Current directory will be used if nothing is provided |  
	
3. Review the output data collection rule(s). There are two separate ARM templates that can be produced (based on agent configuration of the target workspace):
	- Windows ARM Template and Parameter Files: will be created if target workspace contains Windows Performance Counters and/or Windows Events
	- Linux ARM Template and Parameter Files: will be created if target workspace contains Linux Performance Counters and/or Linux Syslog Events
	
4. Use the rule association built-in policies and other available methods to associate generated rules with machines running the new agent. [Learn more](./data-collection-rule-azure-monitor-agent.md#create-data-collection-rule-and-association)
