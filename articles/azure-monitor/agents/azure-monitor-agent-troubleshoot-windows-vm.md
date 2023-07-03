---
title: Troubleshoot the Azure Monitor agent on Windows virtual machines and scale sets
description: Guidance for troubleshooting issues on Windows virtual machines, scale sets with Azure Monitor agent and Data Collection Rules.
ms.topic: conceptual
ms.date: 6/9/2022
ms.custom: references_region
ms.reviewer: shseth
---

# Troubleshooting guidance for the Azure Monitor agent on Windows virtual machines and scale sets

[!INCLUDE [azure-monitor-agent-architecture](../../../includes/azure-monitor-agent/azure-monitor-agent-architecture-include.md)]

## Basic troubleshooting steps (installation, agent not running, configuration issues)
Follow the steps below to troubleshoot the latest version of the Azure Monitor agent running on your Windows virtual machine:

1. **Carefully review the [prerequisites here](./azure-monitor-agent-manage.md#prerequisites).**  

2. **Verify that the extension was successfully installed and provisioned, which installs the agent binaries on your machine**:  
	1. Open Azure portal > select your virtual machine > Open **Settings** : **Extensions + applications** from the pane on the left > 'AzureMonitorWindowsAgent'should show up with Status: 'Provisioning succeeded'  
	2. If not, check if machine can reach Azure and find the extension to install using the command below:  
		```azurecli
		az vm extension image list-versions --location <machine-region> --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor
		```  
	3. Wait for 10-15 minutes as extension maybe in transitioning status. If it still doesn't show up, [uninstall and install the extension](./azure-monitor-agent-manage.md) again and repeat the verification to see the extension show up. 
	4. If not, check if you see any errors in extension logs located at `C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent` on your machine   
	5. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA extension fails to install or provision' and **Problem type** as 'I need help with Azure Monitor Windows Agent'.    
	
3. **Verify that the agent is running**:  
	1. Check if the agent is emitting heartbeat logs to Log Analytics workspace using the query below. Skip if 'Custom Metrics' is the only destination in the DCR:
		```Kusto
		Heartbeat | where Category == "Azure Monitor Agent" and 'Computer' == "<computer-name>" | take 10
		```
	2. If not, open Task Manager and check if 'MonAgentCore.exe' process is running. If it is, wait for 5 minutes for heartbeat to show up.  
	3. If not, check if you see any errors in core agent logs located at `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\Configuration` on your machine  
	4. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA extension provisioned but not running' and **Problem type** as 'I need help with Azure Monitor Windows Agent'.  
	
4. **Verify that the DCR exists and is associated with the virtual machine:**  
	1. If using Log Analytics workspace as destination, verify that DCR exists in the same physical region as the Log Analytics workspace.  
	2. On your virtual machine, verify the existence of the file `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\mcs\mcsconfig.latest.xml`. If this file doesn't exist:
		- The virtual machine may not be associated with a DCR. See step 3
		- The virtual machine may not have Managed Identity enabled. [See here](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#enable-system-assigned-managed-identity-during-creation-of-a-vm) on how to enable. 
		- IMDS service is not running/accessible from the virtual machine. [Check if you can access IMDS from the machine](../../virtual-machines/windows/instance-metadata-service.md?tabs=windows). If not, [file a ticket](#file-a-ticket) with **Summary** as 'IMDS service not running' and **Problem type** as 'I need help configuring data collection from a VM'.
		- AMA cannot access IMDS. Check if you see IMDS errors in `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\Tables\MAEventTable.tsf` file. If yes, [file a ticket](#file-a-ticket) with **Summary** as 'AMA cannot access IMDS' and **Problem type** as 'I need help configuring data collection from a VM'.
	3. Open Azure portal > select your data collection rule > Open **Configuration** : **Resources** from the pane on the left > You should see the virtual machine listed here  
	4. If not listed, click 'Add' and select your virtual machine from the resource picker. Repeat across all DCRs.
	5. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'DCR not found or associated' and **Problem type** as 'I need help configuring data collection from a VM'.

5. **Verify that agent was able to download the associated DCR(s) from AMCS service:**  
	1. Check if you see the latest DCR downloaded at this location `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\mcs\configchunks`  
	2. If not, [file a ticket](#file-a-ticket) with **Summary** as 'AMA unable to download DCR config' and **Problem type** as 'I need help with Azure Monitor Windows Agent'. 

	
## Issues collecting Performance counters
1. Check that your DCR JSON contains a section for 'performanceCounters'. If not, fix your DCR. See [how to create DCR](./data-collection-rule-azure-monitor-agent.md) or [sample DCR](./data-collection-rule-sample-agent.md).
2. Check that the file `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\mcs\mcsconfig.lkg.xml` exists. If it doesn't exist, [file a ticket](#file-a-ticket) with **Summary** as 'AMA didn't run long enough to mark and **Problem type** as 'I need help with Azure Monitor Windows Agent'.
3. Open the file and check if it contains `CounterSet` nodes as shown in the example below:
	```xml
	<CounterSet storeType="Local" duration="PT1M" 
        eventName="c9302257006473204344_16355538690556228697" 
        sampleRateInSeconds="15" format="Factored">
        <Counter>\Processor(_Total)\% Processor Time</Counter>
        <Counter>\Memory\Committed Bytes</Counter>
        <Counter>\LogicalDisk(_Total)\Free Megabytes</Counter>
        <Counter>\PhysicalDisk(_Total)\Avg. Disk Queue Length</Counter>
    </CounterSet>
	```
	If there are no `CounterSet` nodes, then the DCR wasn't parsed correctly. [File a ticket](#file-a-ticket) with **Summary** as 'AMA unable to parse DCR config' and **Problem type** as 'I need help with Azure Monitor Windows Agent'. 



### Issues using 'Custom Metrics' as destination
1. Carefully review the [prerequisites here](./azure-monitor-agent-manage.md#prerequisites).  
2. Ensure that the associated DCR is correctly authored to collect performance counters and send them to Azure Monitor metrics. You should see this section in your DCR:
	```json
	"destinations": {  
	"azureMonitorMetrics": {  
		"name":"myAmMetricsDest" 
		} 
	}
	```
3. Run PowerShell command:
	```powershell
	Get-WmiObject Win32_Process -Filter "name = 'MetricsExtension.Native.exe'" | select Name,ExecutablePath,CommandLine | Format-List
	```
	Verify that the *CommandLine* parameter in the output contains the argument "-TokenSource MSI"
4. Verify `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\mcs\AuthToken-MSI.json` file is present.
5. Verify `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\mcs\CUSTOMMETRIC_<subscription>_<region>_MonitoringAccount_Configuration.json` file is present.
6. Collect logs by running the command `C:\Packages\Plugins\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\<version-number>\Monitoring\Agent\table2csv.exe C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\Tables\MaMetricsExtensionEtw.tsf`
	1. The command will generate the file 'MaMetricsExtensionEtw.csv'
	2. Open it and look for any Level 2 errors and try to fix them.
7. If none of the above helps, [file a ticket](#file-a-ticket) with **Summary** as 'AMA unable to collect custom metrics' and **Problem type** as 'I need help with Azure Monitor Windows Agent'.

## Issues collecting Windows event logs
1. Check that your DCR JSON contains a section for 'windowsEventLogs'. If not, fix your DCR. See [how to create DCR](./data-collection-rule-azure-monitor-agent.md) or [sample DCR](./data-collection-rule-sample-agent.md).
2. Check that the file `C:\WindowsAzure\Resources\AMADataStore.<virtual-machine-name>\mcs\mcsconfig.lkg.xml` exists. If it doesn't exist, [file a ticket](#file-a-ticket) with **Summary** as 'AMA didn't run long enough to mark and **Problem type** as 'I need help with Azure Monitor Windows Agent'.
3. Open the file and check if it contains `Subscription` nodes as shown in the example below:
	```xml
	<Subscription eventName="c9302257006473204344_14882095577508259570" 
    query="System!*[System[(Level = 1 or Level = 2 or Level = 3)]]">
        <Column name="ProviderGuid" type="mt:wstr" defaultAssignment="00000000-0000-0000-0000-000000000000">
          <Value>/Event/System/Provider/@Guid</Value>
        </Column>
		...
		
        </Column>
    </Subscription>
	```
	If there are no `Subscription`, nodes then the DCR wasn't parsed correctly. [File a ticket](#file-a-ticket) with **Summary** as 'AMA unable to parse DCR config' and **Problem type** as 'I need help with Azure Monitor Windows Agent'. 
	
	
	
[!INCLUDE [azure-monitor-agent-file-a-ticket](../../../includes/azure-monitor-agent/azure-monitor-agent-file-a-ticket.md)]