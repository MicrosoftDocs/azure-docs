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
1. Carefully review the [prerequisites here](./azure-monitor-agent-manage.md#prerequisites).
2. Verify that the extension was successfully **installed and provisioned**, which installs the agent binaries on your machine:  
	1. Open Azure Portal > select your virtual machine > Open **Settings** : **Extensions + applications** blade from left menu > 'AzureMonitorWindowsAgent'should show up with Status: 'Provisioning succeeded'  
	2. If you don't see the extension listed, check if machine can reach Azure and find the extension to install using the command below:  
		```azurecli
		az vm extension image list-versions --location <machine-region> --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor
		```  
	3. Wait for 10-15 minutes as extension maybe in transitioning status. If it still doesn't show up as above, [uninstall and install the extension](./azure-monitor-agent-manage.md) again.   
	4. Check if you see any errors in extension logs located at `C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent` on your machine  
	4. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA extension fails to install or provision' and **Problem type** as 'I need help with Azure Monitor Windows Agent'.    
3. Verify that the agent is **running**:  
	1. Open Task Manager and check if 'MonAgentCore.exe' process is running  
	2. Check if the agent is emitting heartbeat logs to Log Analytics workspace, but running the query below (not applicable if 'Custom Metrics' is the only destination in the DCR):
		```Kusto
		Heartbeat | where Category == "Azure Monior Agent" and 'Computer' == "<computer-name>" | take 10
		```	
	3. Check if you see any errors in core agent logs located at `C:\WindowsAzure\Resources\<virtual-machine-name>.AMADataStore\Configuration` on your machine  
	3. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA extension provisioned but not running' and **Problem type** as 'I need help with Azure Monitor Windows Agent'.  
4. Verify that the DCR exists and is **associated** with the virtual machine:  
	1. If using Log Analytics workspace as destination, verify that DCR exists in the same physical region as the Log Analytics workspace.  
	2. Open Azure Portal > select your data collection rule > Open **Configuration** : **Resources** blade from left menu > You should see the virtual machine listed here  
	3. If not listed, click 'Add' and select your virtual machine from the resource picker. Repeat across all DCRs.
	4. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'DCR not found or associated' and **Problem type** as 'I need help configuring data collection from a VM'.
5. Verify that agent was able to **download** the associated DCR(s) from AMCS service:  
	1. Check if you see the latest DCR downloaded at this location `C:\WindowsAzure\Resources\<virtual-machine-name>.AMADataStore\mcs\configchunks`  
	2. If not, [file a ticket](#file-a-ticket) with **Summary** as 'AMA unable to download DCR config' and **Problem type** as 'I need help with Azure Monitor Windows Agent'. 

	
### Issues collecting Performance counters

#### Using 'Custom Metrics' as destination
1. Carefully review the [prerequisites here](./azure-monitor-agent-manage.md#prerequisites).  
2. Ensure that the DCR is correctly authored to collect performance counters and send them to azure monitor metrics. See highlighted sections in sample DCR below for reference: should check the 

Here is a sample DCR that does that:

{ 

  "properties": { 

    "description": " My data collection rule", 

    "dataSources": { 

      "performanceCounters": [ 

        { 

          "streams": ["Microsoft-InsightsMetrics"], 

          "scheduledTransferPeriod": "PT1M", 

          "samplingFrequencyInSeconds": 15, 

          "counterSpecifiers": [ 

            "\\Processor(_Total)\\% Processor Time", 

            "\\Memory\\Committed Bytes", 

            "\\LogicalDisk(_Total)\\Free Megabytes", 

            "\\PhysicalDisk(_Total)\\Avg. Disk Queue Length" 

          ], 

          "name": "myPerfCounterDataSource1" 

        } 

      ] 

    }, 

    "destinations": { 

      "azureMonitorMetrics": { 

        "name": "myAmMetricsDest" 

      } 

    }, 

    "dataFlows": [ 

      { 

        "streams": [ 

          "Microsoft-InsightsMetrics" 

        ], 

        "destinations": [ 

          "myAmMetricsDest" 

        ] 

      } 

    ] 

  }, 

  "location": "East US" 

}
Ensure that the DCR is correctly associated with the VM.

Run powershell command:

Get-WmiObject Win32_Process -Filter "name = 'MetricsExtension.Native.exe'" | select Name,ExecutablePath,CommandLine | Format-List

Verify that the command line contains argument "-TokenSource MSI"

Verify [AMA Configuration Store]\AuthToken-MSI.json file is present.

Verify [AMA Configuration Store]\CUSTOMMETRIC_[subscription]_[region]_MonitoringAccount_Configuration.json file is present.

Verify if metrics are being emitted locally by AMA:

 Download nuget: https://microsoft.sharepoint.com/:u:/t/EMEAAMASupport/EYp16ZzYPa5Cv861sCeistYBA6emw30k1QqMxKgk7VUZYg?e=i8bu2r 

 Change extension to zip and expand.

 From a cmd window change directory to [expand location]\microsoft.cloud.instrumentationframework.devex.3.2.3.1\IfxConsumer

 Run IfxConsumer.exe without any arguments for 5 minutes. Press Esc key to stop.

 Look for a file called PlatformMetrics.csv under [expand location]\microsoft.cloud.instrumentationframework.devex.3.2.3.1\IfxConsumer\IfxTracing

 If present open PlatformMetrics.csv and look for counters configured in DCR.

Collect MetricsExtension logs

[AMA Installation Directory][Latest]\Monitoring\Agent\table2csv.exe [AMA Data Directory]\Tables\MaMetricsExtensionEtw.tsf

This will generate MaMetricsExtensionEtw.csv. Open it and look for any Level 2 errors and fix those.

If the above does not solve your issue Logs to collect by CSS before opening IcM incident

### Issues collecting Windows event logs
Need inputs


	
# [Linux virtual machine](#tab/LVM)
1. Carefully review the [prerequisites here](./azure-monitor-agent-manage.md#prerequisites).  
2. Verify that the extension was successfully **installed and provisioned**, which installs the agent binaries on your machine:  
	1. Open Azure Portal > select your virtual machine > Open **Settings** : **Extensions + applications** blade from left menu > 'AzureMonitorLinuxAgent'should show up with Status: 'Provisioning succeeded'  
	2. If you don't see the extension listed, check if machine can reach Azure and find the extension to install using the command below:  
		```azurecli
		az vm extension image list-versions --location <machine-region> --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor
		```  
	3. Wait for 10-15 minutes as extension maybe in transitioning status. If it still doesn't show up as above, [uninstall and install the extension](./azure-monitor-agent-manage.md) again.   
	4. Check if you see any errors in extension logs located at `/var/log/azure/Microsoft.Azure.Monitor.AzureMonitorLinuxAgent/` on your machine  
	4. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA extension fails to install or provision' and **Problem type** as 'I need help with Azure Monitor Linux Agent'.  
3. Verify that the agent is **running**:  
	1. Check if you see any errors in core agent logs located at `???` on your machine  
	2. Check if the agent is emitting heartbeat logs to Log Analytics workspace, but running the query below (not applicable if 'Custom Metrics' is the only destination in the DCR):
		```Kusto
		Heartbeat | where Category == "Azure Monior Agent" and 'Computer' == "<computer-name>" | take 10
		```	
	3. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA extension provisioned but not running' and **Problem type** as 'I need help with Azure Monitor Linux Agent'.  
4. Verify that the DCR exists and is **associated** with the virtual machine:  
	1. If using Log Analytics workspace as destination, verify that DCR exists in the same physical region as the Log Analytics workspace.  
	2. Open Azure Portal > select your data collection rule > Open **Configuration** : **Resources** blade from left menu > You should see the virtual machine listed here. 
	3. If not listed, click 'Add' and select your virtual machine from the resource picker. Repeat across all DCRs. 
	4. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'DCR not found or associated' and **Problem type** as 'I need help configuring data collection from a VM'.
5. Verify that agent was able to **download** the associated DCR(s) from AMCS service:  
	1. Check if you see the latest DCR downloaded at this location `/etc/opt/microsoft/azuremonitoragent/config-cache/configchunks/`  
	2. If not, [file a ticket](#file-a-ticket) with **Summary** as 'AMA unable to download DCR config' and **Problem type** as 'I need help with Azure Monitor Linux Agent'.  


### Issues collecting Performance counters

### Issues collecting Syslog
Here's how AMA collects sylog events:  

- AMA installs an output configuration for the system syslog daemon during the installation process. The configuration file specifies the way events flow between the syslog daemon and AMA.
- For `rsyslog` (most Linux distributions), the configuration file is `/etc/rsyslog.d/10-azuremonitoragent.conf`. For `syslog-ng`, the configuration file is `/etc/syslog-ng/conf.d/azuremonitoragent.conf`.
- AMA listens to a UNIX domain socket to receive events from `rsyslog` / `syslog-ng`. The socket path for this communication is `/run/azuremonitoragent/default_syslog.socket`
- The syslog daemon will use queues when AMA ingestion is delayed, or when AMA is not reachable.
- AMA ingests syslog events via the aforementioned socket and filters them based on facility / severity combination from DCR configuration in `/etc/opt/microsoft/azuremonitoragent/config-cache/configchunks/`. Any `facility` / `severity` not present in the DCR will be dropped.
- AMA attempts to parse events in accordance with **RFC3164** and **RFC5424**. Additionally, it knows how to parse the message formats listed [here](./azure-monitor-agent-overview.md##data-sources-and-destinations).
- AMA identifies the destination endpoint for Syslog events from the DCR configuration and attempts to upload the events. 
	> [!NOTE]
	> AMA uses local persistency by default, all events received from `rsyslog` / `syslog-ng` are queued in /var/opt/microsoft/azuremonitoragent/events before being uploaded.  
	
- The quality of service (QoS) file `/var/opt/microsoft/azuremonitoragent/log/mdsd.qos` provides CSV-format 15-minute aggregations of the processed events and contains the information on the amount of the processed syslog events in the given timeframe. **This file is useful in tracking Syslog event ingestion drops**.  

	For example, the below fragment shows that in the 15 minutes preceding 2022-02-28T19:55:23.5432920Z, the agent received 77 syslog events with facility daemon and level info and sent 77 of said events to the upload task. Additionally, the agent upload task received 77 and successfully uploaded all 77 of these daemon.info messages.
	
	```
	#Time: 2022-02-28T19:55:23.5432920Z
	#Fields: Operation,Object,TotalCount,SuccessCount,Retries,AverageDuration,AverageSize,AverageDelay,TotalSize,TotalRowsRead,TotalRowsSent
	...
	MaRunTaskLocal,daemon.debug,15,15,0,60000,0,0,0,0,0
	MaRunTaskLocal,daemon.info,15,15,0,60000,46.2,0,693,77,77
	MaRunTaskLocal,daemon.notice,15,15,0,60000,0,0,0,0,0
	MaRunTaskLocal,daemon.warning,15,15,0,60000,0,0,0,0,0
	MaRunTaskLocal,daemon.error,15,15,0,60000,0,0,0,0,0
	MaRunTaskLocal,daemon.critical,15,15,0,60000,0,0,0,0,0
	MaRunTaskLocal,daemon.alert,15,15,0,60000,0,0,0,0,0
	MaRunTaskLocal,daemon.emergency,15,15,0,60000,0,0,0,0,0
	...
	MaODSRequest,https://e73fd5e3-ea2b-4637-8da0-5c8144b670c8_LogManagement,15,15,0,455067,476.467,0,7147,77,77
	```  
	
#### Troubleshooting steps for syslog
1. Review the [generic Linux AMA troubleshooting steps](#basic-troubleshooting-steps) first. If agent is emitting heartbeats, proceed to step 2.
2. The parsed configuration is stored at `/etc/opt/microsoft/azuremonitoragent/config-cache/configchunks/`. Check that Syslog collection is defined and the log destinations are the same as constructed in DCR UI / DCR JSON.
	1. If yes, proceed to step 3. If not, the issue is in the configuration workflow. 
	2. Investigate `mdsd.err`,`mdsd.warn`, `mdsd.info` files under `/var/opt/microsoft/azuremonitoragent/log` for possible configuration errors. 
	3. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'Syslog DCR not available' and **Problem type** as 'I need help configuring data collection from a VM'.
3. Validate the layout of the Syslog collection workflow to ensure all necessary pieces are in place and accessible:
	1. For `rsyslog` users, ensure the `/etc/rsyslog.d/10-azuremonitoragent.conf` file is present, is not empty, and is accessible by the `rsyslog` daemon (syslog user).
	2. For `syslog-ng` users, ensure the `/etc/syslog-ng/conf.d/azuremonitoragent.conf` file is present, is not empty, and is accessible by the `syslog-ng` daemon (syslog user).
	3. Ensure `/run/azuremonitoragent/default_syslog.socket` exists and accessible by `rsyslog` or `syslog-ng` respectively.
	4. Check for a corresponding drop in count of processed syslog events in `/var/opt/microsoft/azuremonitoragent/log/mdsd.qos`. If such drop is not indicated in the file, [file a ticket](#file-a-ticket) with **Summary** as 'Syslog data dropped in pipeline' and **Problem type** as 'I need help with Azure Monitor Linux Agent'.
	5. Check that syslog daemon queue is not overflowing, causing the upload to fail, by referring the guidance here: [Rsyslog data not uploaded due to Full Disk space issue on AMA Linux Agent]()
4. To debug syslog events ingestion further, you can append trace flag **-T 0x2002** at the end of **MDSD_OPTIONS** in the file `/etc/default/azuremonitoragent`, and restart the agent:
	```
	export MDSD_OPTIONS="-A -c /etc/opt/microsoft/azuremonitoragent/mdsd.xml -d -r $MDSD_ROLE_PREFIX -S $MDSD_SPOOL_DIRECTORY/eh -L $MDSD_SPOOL_DIRECTORY/events -e $MDSD_LOG_DIR/mdsd.err -w $MDSD_LOG_DIR/mdsd.warn -o $MDSD_LOG_DIR/mdsd.info -T 0x2002"
	```
5. After the issue is reproduced with the trace flag on, you will find additional debug information in `/var/opt/microsoft/azuremonitoragent/log/mdsd.info`. Inspect the file for the possible cause of syslog collection issue, such as parsing / processing / configuration / upload errors.
	> [!WARNING]
	> Ensure to remove trace flag setting **-T 0x2002** after the debugging session, since it generates many trace statements that could fill up the disk more quickly or make visually parsing the log file difficult.
6. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA fails to collect syslog events' and **Problem type** as 'I need help with Azure Monitor Linux Agent'. 



# [Windows Arc-enabled server](#tab/WARC)
1. Carefully review the [prerequisites here](./azure-monitor-agent-manage.md#prerequisites).  
2. Verify that the extension was successfully **installed and provisioned**, which installs the agent binaries on your machine:  
	1. Open Azure Portal > select your Arc-enabled server > Open **Settings** : **Extensions** blade from left menu > 'AzureMonitorWindowsAgent'should show up with Status: 'Succeeded'  
	2. If you don't see the extension listed, check if machine can reach Azure and find the extension to install using the command below:  
		```azurecli
		az vm extension image list-versions --location <machine-region> --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor
		```  
	3. Wait for 10-15 minutes as extension maybe in transitioning status. If it still doesn't show up as above, [uninstall and install the extension](./azure-monitor-agent-manage.md) again.   
	4. Check if you see any errors in extension logs located at `C:\ProgramData\GuestConfig\extension_logs\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent` on your machine  
	4. If none of the above works, [file a ticket](#file-a-ticket) with **Summary** as 'AMA extension fails to install or provision' and **Problem type** as 'I need help with Azure Monitor Windows Agent'.  
3. Verify that the agent is **running**:  
	1. Check if you see any errors in core agent logs located at `C:\Resources\Directory\AMADataStore\Configuration`  
	2. Check if the agent is emitting heartbeat logs to Log Analytics workspace, but running the query below (not applicable if 'Custom Metrics' is the only destination in the DCR):
		```Kusto
		Heartbeat | where Category == "Azure Monior Agent" and 'Computer' == "<computer-name>" | take 10
		```	
	3. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA extension provisioned but not running' and **Problem type** as 'I need help with Azure Monitor Windows Agent'.   
4. Verify that the DCR exists and is **associated** with the Arc-enabled server:  
	1. If using Log Analytics workspace as destination, verify that DCR exists in the same physical region as the Log Analytics workspace.  
	2. Open Azure Portal > select your data collection rule > Open **Configuration** : **Resources** blade from left menu > You should see the Arc-enabled server listed here  
	3. If not listed, click 'Add' and select your Arc-enabled server from the resource picker. Repeat across all DCRs.
	4. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'DCR not found or associated' and **Problem type** as 'I need help configuring data collection from a VM'.
5. Verify that agent was able to **download** the associated DCR(s) from AMCS service:  
	1. Check if you see the latest DCR downloaded at this location `C:\Resources\Directory\AMADataStore\mcs\configchunks` 
	2. If not, [file a ticket](#file-a-ticket) with **Summary** as 'AMA unable to download DCR config' and **Problem type** as 'I need help with Azure Monitor Windows Agent'.   

### Issues collecting Performance counters

### Issues collecting Windows event logs

## File a ticket
1. Open a data collection rule and select **New Support Request** from left menu OR simply open the ['Help + support' blade](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) and select **Create a support request**
2. Select 
	- Issue Type: Technical
	- Subscription: Pick the subscription where your machines resides
	- Service type: Data Collection Rules (DCR) and Agent (AMA)
	- Is your issue related to a resource? Yes (Pick your machine using the resource picker pops up)
3. Enter 'Summary' and 'Problem type' as indicated from troubleshooting steps. Accurate details will lead to faster resolution of the issue.
4. Click 'Next' and review the recommended solutions to see if they help.
5. If not, click 'Next' and fill in the additional details.
6. Click 'Next', review final details and hit 'Create'.
