---
title: Troubleshoot the Azure Monitor agent on Linux virtual machines and scale sets
description: Guidance for troubleshooting issues on Linux virtual machines, scale sets with Azure Monitor agent and Data Collection Rules.
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 5/3/2022
ms.custom: references_region
ms.reviewer: shseth

---

# Troubleshooting guidance for the Azure Monitor agent on Linux virtual machines and scale sets

[!INCLUDE [azure-monitor-agent-architecture](../../../includes/azure-monitor-agent/azure-monitor-agent-architecture-include.md)]

## Basic troubleshooting steps 
Follow the steps below to troubleshoot the latest version of the Azure Monitor agent running on your Linux virtual machine:

1. **Carefully review the [prerequisites here](./azure-monitor-agent-manage.md#prerequisites).**  

2. **Verify that the extension was successfully installed and provisioned, which installs the agent binaries on your machine**:  
	1. Open Azure portal > select your virtual machine > Open **Settings** : **Extensions + applications** from the pane on the left > 'AzureMonitorLinuxAgent'should show up with Status: 'Provisioning succeeded'  
	2. If you don't see the extension listed, check if machine can reach Azure and find the extension to install using the command below:  
		```azurecli
		az vm extension image list-versions --location <machine-region> --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor
		```  
	3. Wait for 10-15 minutes as extension maybe in transitioning status. If it still doesn't show up as above, [uninstall and install the extension](./azure-monitor-agent-manage.md) again.   
	4. Check if you see any errors in extension logs located at `/var/log/azure/Microsoft.Azure.Monitor.AzureMonitorLinuxAgent/` on your machine  
	4. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA extension fails to install or provision' and **Problem type** as 'I need help with Azure Monitor Linux Agent'.  
	
3. **Verify that the agent is running**:  
	1. Check if the agent is emitting heartbeat logs to Log Analytics workspace using the query below. Skip if 'Custom Metrics' is the only destination in the DCR:
		```Kusto
		Heartbeat | where Category == "Azure Monitor Agent" and Computer == "<computer-name>" | take 10
		```	 
	2. Check if the agent service is running
		```
		systemctl status azuremonitoragent
		```
	3. Check if you see any errors in core agent logs located at `/var/opt/microsoft/azuremonitoragent/log/mdsd.*` on your machine  
	3. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA extension provisioned but not running' and **Problem type** as 'I need help with Azure Monitor Linux Agent'.  
	
4. **Verify that the DCR exists and is associated with the virtual machine:**  
	1. If using Log Analytics workspace as destination, verify that DCR exists in the same physical region as the Log Analytics workspace.  
	2. Open Azure portal > select your data collection rule > Open **Configuration** : **Resources** from the pane on the left > You should see the virtual machine listed here. 
	3. If not listed, click 'Add' and select your virtual machine from the resource picker. Repeat across all DCRs. 
	4. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'DCR not found or associated' and **Problem type** as 'I need help configuring data collection from a VM'.

5. **Verify that agent was able to download the associated DCR(s) from AMCS service:**  
	1. Check if you see the latest DCR downloaded at this location `/etc/opt/microsoft/azuremonitoragent/config-cache/configchunks/`  
	2. If not, [file a ticket](#file-a-ticket) with **Summary** as 'AMA unable to download DCR config' and **Problem type** as 'I need help with Azure Monitor Linux Agent'.  


## Issues collecting Performance counters

## Issues collecting Syslog
Here's how AMA collects syslog events:  

- AMA installs an output configuration for the system syslog daemon during the installation process. The configuration file specifies the way events flow between the syslog daemon and AMA.
- For `rsyslog` (most Linux distributions), the configuration file is `/etc/rsyslog.d/10-azuremonitoragent.conf`. For `syslog-ng`, the configuration file is `/etc/syslog-ng/conf.d/azuremonitoragent.conf`.
- AMA listens to a UNIX domain socket to receive events from `rsyslog` / `syslog-ng`. The socket path for this communication is `/run/azuremonitoragent/default_syslog.socket`
- The syslog daemon will use queues when AMA ingestion is delayed, or when AMA isn't reachable.
- AMA ingests syslog events via the aforementioned socket and filters them based on facility / severity combination from DCR configuration in `/etc/opt/microsoft/azuremonitoragent/config-cache/configchunks/`. Any `facility` / `severity` not present in the DCR will be dropped.
- AMA attempts to parse events in accordance with **RFC3164** and **RFC5424**. Additionally, it knows how to parse the message formats listed [here](./azure-monitor-agent-overview.md#data-sources-and-destinations).
- AMA identifies the destination endpoint for Syslog events from the DCR configuration and attempts to upload the events. 
	> [!NOTE]
	> AMA uses local persistency by default, all events received from `rsyslog` / `syslog-ng` are queued in `/var/opt/microsoft/azuremonitoragent/events` before being uploaded.  
	
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
	
**Troubleshooting steps**
1. Review the [generic Linux AMA troubleshooting steps](#basic-troubleshooting-steps) first. If agent is emitting heartbeats, proceed to step 2.
2. The parsed configuration is stored at `/etc/opt/microsoft/azuremonitoragent/config-cache/configchunks/`. Check that Syslog collection is defined and the log destinations are the same as constructed in DCR UI / DCR JSON.
	1. If yes, proceed to step 3. If not, the issue is in the configuration workflow. 
	2. Investigate `mdsd.err`,`mdsd.warn`, `mdsd.info` files under `/var/opt/microsoft/azuremonitoragent/log` for possible configuration errors. 
	3. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'Syslog DCR not available' and **Problem type** as 'I need help configuring data collection from a VM'.
3. Validate the layout of the Syslog collection workflow to ensure all necessary pieces are in place and accessible:
	1. For `rsyslog` users, ensure the `/etc/rsyslog.d/10-azuremonitoragent.conf` file is present, isn't empty, and is accessible by the `rsyslog` daemon (syslog user).
		1. Check your rsyslog configuration at `/etc/rsyslog.conf` and `/etc/rsyslog.d/*` to see if you have any inputs bound to a non-default ruleset, as messages from these inputs will not be forwarded to Azure Monitor Agent. For instance, messages from an input configured with a non-default ruleset like `input(type="imtcp" port="514" `**`ruleset="myruleset"`**`)` will not be forward.
	2. For `syslog-ng` users, ensure the `/etc/syslog-ng/conf.d/azuremonitoragent.conf` file is present, isn't empty, and is accessible by the `syslog-ng` daemon (syslog user).
	3. Ensure the file `/run/azuremonitoragent/default_syslog.socket` exists and is accessible by `rsyslog` or `syslog-ng` respectively.
	4. Check for a corresponding drop in count of processed syslog events in `/var/opt/microsoft/azuremonitoragent/log/mdsd.qos`. If such drop isn't indicated in the file, [file a ticket](#file-a-ticket) with **Summary** as 'Syslog data dropped in pipeline' and **Problem type** as 'I need help with Azure Monitor Linux Agent'.
	5. Check that syslog daemon queue isn't overflowing, causing the upload to fail, by referring the guidance here: [Rsyslog data not uploaded due to Full Disk space issue on AMA Linux Agent](./azure-monitor-agent-troubleshoot-linux-vm-rsyslog.md)
4. To debug syslog events ingestion further, you can append trace flag **-T 0x2002** at the end of **MDSD_OPTIONS** in the file `/etc/default/azuremonitoragent`, and restart the agent:
	```
	export MDSD_OPTIONS="-A -c /etc/opt/microsoft/azuremonitoragent/mdsd.xml -d -r $MDSD_ROLE_PREFIX -S $MDSD_SPOOL_DIRECTORY/eh -L $MDSD_SPOOL_DIRECTORY/events -e $MDSD_LOG_DIR/mdsd.err -w $MDSD_LOG_DIR/mdsd.warn -o $MDSD_LOG_DIR/mdsd.info -T 0x2002"
	```
5. After the issue is reproduced with the trace flag on, you'll find more debug information in `/var/opt/microsoft/azuremonitoragent/log/mdsd.info`. Inspect the file for the possible cause of syslog collection issue, such as parsing / processing / configuration / upload errors.
	> [!WARNING]
	> Ensure to remove trace flag setting **-T 0x2002** after the debugging session, since it generates many trace statements that could fill up the disk more quickly or make visually parsing the log file difficult.
6. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA fails to collect syslog events' and **Problem type** as 'I need help with Azure Monitor Linux Agent'. 


[!INCLUDE [azure-monitor-agent-file-a-ticket](../../../includes/azure-monitor-agent/azure-monitor-agent-file-a-ticket.md)]
