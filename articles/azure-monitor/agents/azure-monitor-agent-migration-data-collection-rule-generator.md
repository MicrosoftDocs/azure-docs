---
title: Workspace configuration to DCR config generator
description: Using the Workspace configuration to DCR config generator to help migrate from MMA to AMA agents
author: EdB-MSFT
ms.author: edbaynash
ms.reviewer: guywild
ms.topic: conceptual 
ms.date: 06/16/2024

# Customer intent: As an azure administrator, I want to understand how to use the workspace configuration to DCR config generator.

---

# Convert workspace configuration to DCR configurations

Whereas Log Analytics Agent inherits its configuration from Log Analytics workspaces, the Azure Monitor Agent relies on data collection rules (DCRs) for configuration

The workspace configuration to DCR config generator is a PowerShell that reads the configuration from your workspace produce multiple DCR ARM templates, based on the MMA configurations present on the workspace. 

## Prerequisites
- PowerShell version 7.1.3 or higher is recommended (minimum version 5.1)
- Az PowerShell module to pull workspace agent configuration information Az PowerShell module. To install the Az PowerShell module, see [Install Azure PowerShell on Windows](/powershell/azure/install-azps-windows)
- Read/Write access to the specified workspace resource

## Installation and execution

Download the [PowerShell script](https://github.com/microsoft/AzureMonitorCommunity/tree/master/Azure%20Services/Azure%20Monitor/Agents/Migration%20Tools/DCR%20Config%20Generator) from Git Hub.


The script retrieves the configuration of the legacy agent configurations from the workspace and generates DCR ARM templates for each supported DCR type in the specified output folder. More than one template may be created, one for each DCR type.

For multiple workspaces with data collections configured, you must run the script for each workspace. IIS logs the script also creates an additional data collection role as part of that configuration.


When the script completes, it prompts you to test the deployment of the template in your environment. Choose to either let it deploy the template for you, or store the template specified output folder

> [!NOTE]
> The script does not associate the DCRs with the workspace. You must create your own data collection rule associations (DCRAs), to associate the DCRs with the relevant servers. This allows you to control the deployment of the DCRs to the servers and test the DCRs on a sample of servers before deploying at scale. 


To run script, copy the following command and replace the parameters with your values:

```powershell
	.\WorkspaceConfigToDCRMigrationTool.ps1 -SubscriptionId $subId -ResourceGroupName $rgName -WorkspaceName $workspaceName -DCRName $dcrName -OutputFolder $outputFolderPath
```

### Script parameters


| Name                    | Required  | Description                                                                   |
| ----------------------- |:---------:|:-----------------------------------------------------------------------------:|
| `SubscriptionId`        | YES       | The subscription ID of the workspace                                  |
| `ResourceGroupName`     | YES       | The resource Group of the workspace                                   |
| `WorkspaceName`         | YES       | The name of the workspace (Azure resource IDs are case insensitive)   |
| `DCRName`               | YES       | The base name used for each one the outputs DCRs                 |
| `OutputFolder`          | NO        | The output folder path. If not provided, the working directory path is used   |


### Outputs:
 -  For each supported `DCR type`, the script produces a ready to be deployed DCR ARM template and a DCR payload, for users that don't need the ARM template.

 Currently supported DCR types:
 
  - **Windows** contains `WindowsPerfCounters` and `WindowsEventLogs` data sources only
  - **Linux** contains `LinuxPerfCounters` and `Syslog` data sources only
  - **Custom Logs** contains `logFiles` data sources only
  - **IIS Logs** contains `iisLogs` data sources only
  - **Extensions** contains `extensions` data sources only along with any associated perfCounters data sources
    - `VMInsights` 

## Deployment

For information on deploying the DCRs, see [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview) and [Create and edit data collection rules (DCRs) in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-create-edit)


## Next steps

- [Azure Monitor Agent Migration Helper workbook](azure-monitor-agent-migration-helper-workbook.md)
- [Data collection rule structure](../essentials/data-collection-rule-structure.md) 
- [Sample data collection rules (DCRs)](../essentials/data-collection-rule-samples.md) for sample DCRs for different data collection scenarios.
- [Azure Monitor service limits](../service-limits.md#data-collection-rules) for limits that apply to each DCR.