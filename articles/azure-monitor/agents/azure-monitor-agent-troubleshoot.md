---
title: Troubleshoot the Azure Monitor agent
description: Guidance for troubleshooting issues with Azure Monitor agent and Data Collection Rules.
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 3/17/2022
ms.custom: references_region

---

# Troubleshooting guidance for Azure Monitor agent
This document provides a deeper overview into the technical architecture of the new Azure Monitor agent, that will help understand how it works and thus better troubleshoot any issues that you may run into.  
Follow the troubleshooting guidance listed below to proceed.

## Overview of the technical architecture
Before you read further, you must be familiar with [Azure Monitor agent](./azure-monitor-agent-overview.md) and [Data Collection Rules](./data-collection-rule-azure-monitor-agent.md).  
The diagram below shows overall archtecture of the components involved when using the Azure Monitor agent, including the data flow and control flow in the sequence that it occurs.

### Terminology
- Azure Monitor Agent or AMA
- Data Collection Rules or DCR
- Azure Monitor Configuration Service (AMCS) - Regional service hosted in Azure, which controls data collection for this agent and other parts of Azure Monitor. The agent calls into this service to fetch DCRs.
- Logs Pipeline - Data pipeline for sending data to Log Analytics workspaces.
- Metrics Pipeline - Data pipeline for sending data to Azure Monitor Metrics databases.
- Instance Metadata Service (IMDS) and Hybrid IMDS (HIMDS) - Services hosted in Azure which provide information about currently running virtual machines, scale sets (via IMDS) and Arc-enabled servers (via HIMDS) respectively. [Learn more]



## Basic troubleshooting steps 
Follow the steps below to troubleshoot the latest version of the Azure Monitor agent running on virtual machines, scale sets and Arc-enabled servers by clicking on the respective tabs.

# [Windows virtual machine](#tab/WVM)
1. Carefully review the [prerequisites here](./azure-monitor-agent-manage.md##prerequisites).
2. Verify that the extension was successfully installed and provisioned, which installs the agent binaries on your machine:
	i. Open Azure Portal > select your virtual machine > Open 'Settings: Extensions + applications' blade from left menu > 'AzureMonitorWindowsAgent'should show up with Status: 'Provisioning succeeded'
	ii. If you don't see the extension listed, check if machine can reach Azure and find the extension to install using the command below:
	```azurecli
	az vm extension image list-versions --location <machine-region> --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor
	```
	iii. Wait for 10-15 minutes as extension maybe in transitioning status. If it still doesn't show up as above, uninstall and install the extension again. 
	iv. Check if you see any errors in extension logs located at 'C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent' on your machine
	iv. If none of the above helps, [file a ticket](#file-a-ticket) stating 'AMA extension fails to install or provision'
3. Verify that the agent is running:
	i. Open Task Manager and check if 'MonAgentCore.exe' process is running
	ii. Check if you see any errors in core agent logs located at 'C:\WindowsAzure\Resources\<virtual-machine-name>.AMADataStore\Configuration' on your machine
	iii. If none of the above helps, [file a ticket](#file-a-ticket) stating 'AMA extension installed but not running'
4. Verify that the DCR exists and is associated with the virtual machine:
	i. If using Log Analytics workspace as destination, verify that DCR exists in the same physical region as the Log Analytics workspace.
	ii. Open Azure Portal > select your data collection rule > Open 'Resources' blade from left menu > You should see the virtual machine listed here
5. Verify that agent was able to download the associated DCR(s) from AMCS service:
	i. Check if you see the latest DCR downloaded at this location 'C:\WindowsAzure\Resources\<virtual-machine-name>.AMADataStore\mcs\configchunks'
	
### Issues collecting Performance counters

### Issues collecting Windows event logs
	
# [Linux virtual machine](#tab/LVM)
1. Carefully review the [prerequisites here](./azure-monitor-agent-manage.md##prerequisites).
2. Verify that the extension was successfully installed and provisioned, which installs the agent binaries on your machine:
	i. Open Azure Portal > select your virtual machine > Open 'Settings: Extensions + applications' blade from left menu > 'AzureMonitorLinuxAgent'should show up with Status: 'Provisioning succeeded'
	ii. If you don't see the extension listed, check if machine can reach Azure and find the extension to install using the command below:
	```azurecli
	az vm extension image list-versions --location <machine-region> --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor
	```
	iii. Wait for 10-15 minutes as extension maybe in transitioning status. If it still doesn't show up as above, uninstall and install the extension again. 
	iv. Check if you see any errors in extension logs located at '/var/log/azure/Microsoft.Azure.Monitor.AzureMonitorLinuxAgent/' on your machine
	iv. If none of the above helps, [file a ticket](#file-a-ticket) stating 'AMA extension fails to install or provision'
3. Verify that the agent is running:
	i. Check if you see any errors in core agent logs located at '???' on your machine
	iii. If none of the above helps, [file a ticket](#file-a-ticket) stating 'AMA extension installed but not running'
4. Verify that the DCR exists and is associated with the virtual machine:
	i. If using Log Analytics workspace as destination, verify that DCR exists in the same physical region as the Log Analytics workspace.
	ii. Open Azure Portal > select your data collection rule > Open 'Resources' blade from left menu > You should see the virtual machine listed here
5. Verify that agent was able to download the associated DCR(s) from AMCS service:
	i. Check if you see the latest DCR downloaded at this location '/etc/opt/microsoft/azuremonitoragent/config-cache/configchunks/'

### Issues collecting Performance counters

### Issues collecting Syslog

# [Windows Arc-enabled server](#tab/WARC)
1. Carefully review the [prerequisites here](./azure-monitor-agent-manage.md##prerequisites).
2. Verify that the extension was successfully installed and provisioned, which installs the agent binaries on your machine:
	i. Open Azure Portal > select your Arc-enabled server > Open 'Settings: Extensions' blade from left menu > 'AzureMonitorWindowsAgent'should show up with Status: 'Succeeded'
	ii. If you don't see the extension listed, check if machine can reach Azure and find the extension to install using the command below:
	```azurecli
	az vm extension image list-versions --location <machine-region> --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor
	```
	iii. Wait for 10-15 minutes as extension maybe in transitioning status. If it still doesn't show up as above, uninstall and install the extension again. 
	iv. Check if you see any errors in extension logs located at 'C:\ProgramData\GuestConfig\extension_logs\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent' on your machine
	iv. If none of the above works, [file a ticket](#file-a-ticket) stating 'AMA extension fails to install or provision'
3. Verify that the agent is running:
	i. Check if you see any errors in core agent logs located at 'C:\Resources\Directory\AMADataStore\Configuration'
	ii. If none of the above helps, [file a ticket](#file-a-ticket) stating 'AMA extension installed but not running'
4. Verify that the DCR exists and is associated with the Arc-enabled server:
	i. If using Log Analytics workspace as destination, verify that DCR exists in the same physical region as the Log Analytics workspace.
	ii. Open Azure Portal > select your data collection rule > Open 'Resources' blade from left menu > You should see the Arc-enabled server listed here
5. Verify that agent was able to download the associated DCR(s) from AMCS service:
	i. Check if you see the latest DCR downloaded at this location 'C:\Resources\Directory\AMADataStore\mcs\configchunks'

### Issues collecting Performance counters

### Issues collecting Windows event logs

## File a ticket