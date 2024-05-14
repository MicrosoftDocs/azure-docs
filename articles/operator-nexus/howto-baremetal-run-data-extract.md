---
title: Troubleshoot bare metal machine issues using the `az networkcloud baremetalmachine run-data-extract` command for Azure Operator Nexus
description: Step by step guide on using the `az networkcloud baremetalmachine run-data-extract` to extract data from a bare metal machine for troubleshooting and diagnostic purposes.
author: eak13
ms.author: ekarandjeff
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 05/15/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Troubleshoot bare metal machine issues using the `az networkcloud baremetalmachine run-data-extract` command

There may be situations where a user needs to investigate and resolve issues with an on-premises bare metal machine. Azure Operator Nexus provides a prescribed set of data extract commands via `az networkcloud baremetalmachine run-data-extract`. These commands enable users to get diagnostic data from a bare metal machine.

The command produces an output file containing the results of the data extract located in the Cluster Manager's Azure Storage Account.

## Before you begin

- This article assumes that you've installed the Azure command line interface and the `networkcloud` command line interface extension. For more information, see [How to Install CLI Extensions](./howto-install-cli-extensions.md).
- The target bare metal machine is on and has readyState set to True.
- The syntax for these commands is based on the 0.3.0+ version of the `az networkcloud` CLI.
- Get the Cluster Managed Resource group name (cluster_MRG) that you created for Cluster resource.

## Executing a run command

The run data extract command executes one or more predefined scripts to extract data from a bare metal machine.

The current list of supported commands are

- [SupportAssist/TSR collection for Dell troubleshooting](#hardware-support-data-collection)\
  Command Name: `hardware-support-data-collection`\
  Arguments: Type of logs requested
  - `SysInfo` - System Information
  - `TTYLog` - Storage TTYLog data
  - `Debug` - debug logs

- [Collect Microsoft Defender for Endpoints (MDE) agent information](#collect-mde-agent-information)\
  Command Name: `mde-agent-information`\
  Arguments: None

- [Collect MDE diagnostic support logs](#collect-mde-support-diagnostics)\
  Command Name: `mde-support-diagnostics`\
  Arguments: None

- [Collect Dell Hardware Rollup Status](#hardware-rollup-status)\
  Command Name: `hardware-rollup-status`\
  Arguments: None

The command syntax is:

```azurecli-interactive
az networkcloud baremetalmachine run-data-extract --name "<machine-name>"  \
  --resource-group "<cluster_MRG>" \
  --subscription "<subscription>" \
  --commands '[{"arguments":["<arg1>","<arg2>"],"command":"<command1>"}]'  \
  --limit-time-seconds "<timeout>"
```

Specify multiple commands using json format in `--commands` option. Each `command` specifies command and arguments. For a command with multiple arguments, provide as a list to the `arguments` parameter. See [Azure CLI Shorthand](https://github.com/Azure/azure-cli/blob/dev/doc/shorthand_syntax.md) for instructions on constructing the `--commands` structure.

These commands can be long running so the recommendation is to set `--limit-time-seconds` to at least 600 seconds (10 minutes). The `Debug` option or running multiple extracts might take longer than 10 minutes.

In the response, the operation performs asynchronously and returns an HTTP status code of 202. See the [Viewing the Output](#viewing-the-output) section for details on how to track command completion and view the output file.

### Hardware Support Data Collection

This example executes the `hardware-support-data-collection` command and get `SysInfo` and `TTYLog` logs from the Dell Server. The script executes a `racadm supportassist collect` command on the designated baremetal machine. The resulting tar.gz file contains the zipped extract command file outputs in `hardware-support-data-<timestamp>.zip`.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "cluster_MRG" \
  --subscription "subscription" \
  --commands '[{"arguments":["SysInfo", "TTYLog"],"command":"hardware-support-data-collection"}]' \
  --limit-time-seconds 600
```

__`hardware-support-data-collection` Output__

```azurecli
====Action Command Output====
Executing hardware-support-data-collection command
Getting following hardware support logs: SysInfo,TTYLog
Job JID_814372800396 is running, waiting for it to complete ...
Job JID_814372800396 Completed.
---------------------------- JOB -------------------------
[Job ID=JID_814372800396]
Job Name=SupportAssist Collection
Status=Completed
Scheduled Start Time=[Not Applicable]
Expiration Time=[Not Applicable]
Actual Start Time=[Thu, 13 Apr 2023 20:54:40]
Actual Completion Time=[Thu, 13 Apr 2023 20:59:51]
Message=[SRV088: The SupportAssist Collection Operation is completed successfully.]
Percent Complete=[100]
----------------------------------------------------------
Deleting Job JID_814372800396
Collection successfully exported to /hostfs/tmp/runcommand/hardware-support-data-2023-04-13T21:00:01.zip

================================
Script execution result can be found in storage account:
https://cm2p9bctvhxnst.blob.core.windows.net/bmm-run-command-output/dd84df50-7b02-4d10-a2be-46782cbf4eef-action-bmmdataextcmd.tar.gz?se=2023-04-14T01%3A00%3A15Zandsig=ZJcsNoBzvOkUNL0IQ3XGtbJSaZxYqmtd%2BM6rmxDFqXE%3Dandsp=randspr=httpsandsr=bandst=2023-04-13T21%3A00%3A15Zandsv=2019-12-12
```

__Example list of hardware support files collected__

```
Archive:  TSR20240227164024_FM56PK3.pl.zip
   creating: tsr/hardware/
   creating: tsr/hardware/spd/
   creating: tsr/hardware/sysinfo/
   creating: tsr/hardware/sysinfo/inventory/
  inflating: tsr/hardware/sysinfo/inventory/sysinfo_CIM_BIOSAttribute.xml  
  inflating: tsr/hardware/sysinfo/inventory/sysinfo_CIM_Sensor.xml  
  inflating: tsr/hardware/sysinfo/inventory/sysinfo_DCIM_View.xml  
  inflating: tsr/hardware/sysinfo/inventory/sysinfo_DCIM_SoftwareIdentity.xml  
  inflating: tsr/hardware/sysinfo/inventory/sysinfo_CIM_Capabilities.xml  
  inflating: tsr/hardware/sysinfo/inventory/sysinfo_CIM_StatisticalData.xml  
   creating: tsr/hardware/sysinfo/lcfiles/
  inflating: tsr/hardware/sysinfo/lcfiles/lclog_0.xml.gz  
  inflating: tsr/hardware/sysinfo/lcfiles/curr_lclog.xml  
   creating: tsr/hardware/psu/
   creating: tsr/hardware/idracstateinfo/
  inflating: tsr/hardware/idracstateinfo/avc.log  
 extracting: tsr/hardware/idracstateinfo/avc.log.persistent.1  
[..snip..]
```

### Collect MDE Agent Information

Data is collected with the `mde-agent-information` command and formatted as JSON
to `/hostfs/tmp/runcommand/mde-agent-information.json`. The JSON file is found
in the data extract zip file located in the storage account. The script executes a
sequence of `mdatp` commands on the designated baremetal machine.

This example executes the `mde-agent-information` command without arguments.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "cluster_MRG" \
  --subscription "subscription" \
  --commands '[{"command":"mde-agent-information"}]' \
  --limit-time-seconds 600
```

__`mde-agent-information` Output__

```azurecli
====Action Command Output====
Executing mde-agent-information command
MDE agent is running, proceeding with data extract
Getting MDE agent information for bareMetalMachine
Writing to /hostfs/tmp/runcommand

================================
Script execution result can be found in storage account:
 https://cmzhnh6bdsfsdwpbst.blob.core.windows.net/bmm-run-command-output/f5962f18-2228-450b-8cf7-cb8344fdss63b0-action-bmmdataextcmd.tar.gz?se=2023-07-26T19%3A07%3A22Z&sig=X9K3VoNWRFP78OKqFjvYoxubp65BbNTq%2BGnlHclI9Og%3D&sp=r&spr=https&sr=b&st=2023-07-26T15%3A07%3A22Z&sv=2019-12-12
```

__Example JSON object collected__

```
{
  "diagnosticInformation": {
      "realTimeProtectionStats": $real_time_protection_stats,
      "eventProviderStats": $event_provider_stats
      },
  "mdeDefinitions": $mde_definitions,
  "generalHealth": $general_health,
  "mdeConfiguration": $mde_config,
  "scanList": $scan_list,
  "threatInformation": {
      "list": $threat_info_list,
      "quarantineList": $threat_info_quarantine_list
    }
}
```

### Collect MDE Support Diagnostics

Data collected from the `mde-support-diagnostics` command uses the MDE Client Analyzer tool to bundle information from `mdatp` commands and relevant log files.  The storage account `tgz` file will contain a `zip` file named `mde-support-diagnostics-<hostname>.zip`. The `zip` should be sent along with any support requests to ensure the supporting teams can use the logs for troubleshooting and root cause analysis, if needed.

This example executes the `mde-support-diagnostics` command without arguments.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "cluster_MRG" \
  --subscription "subscription" \
  --commands '[{"command":"mde-support-diagnostics"}]' \
  --limit-time-seconds 600
```

__`mde-support-diagnostics` Output__

```azurecli
====Action Command Output====
Executing mde-support-diagnostics command
[2024-01-23 16:07:37.588][INFO] XMDEClientAnalyzer Version: 1.3.2
[2024-01-23 16:07:38.367][INFO] Top Command output: [/tmp/top_output_2024_01_23_16_07_37mel0nue0.txt]
[2024-01-23 16:07:38.367][INFO] Top Command Summary: [/tmp/top_summary_2024_01_23_16_07_370zh7dkqn.txt]
[2024-01-23 16:07:38.367][INFO] Top Command Outliers: [/tmp/top_outlier_2024_01_23_16_07_37aypcfidh.txt]
[2024-01-23 16:07:38.368][INFO] [MDE Diagnostic]
[2024-01-23 16:07:38.368][INFO]   Collecting MDE Diagnostic
[2024-01-23 16:07:38.613][WARNING] mde is not running
[2024-01-23 16:07:41.343][INFO] [SLEEP] [3sec] waiting for agent to create diagnostic package
[2024-01-23 16:07:44.347][INFO] diagnostic package path: /var/opt/microsoft/mdatp/wdavdiag/5b1edef9-3b2a-45c1-a45d-9e7e4b6b869e.zip
[2024-01-23 16:07:44.347][INFO] Successfully created MDE diagnostic zip
[2024-01-23 16:07:44.348][INFO]   Adding mde_diagnostic.zip to report directory
[2024-01-23 16:07:44.348][INFO]   Collecting MDE Health
[...snip...]
================================
Script execution result can be found in storage account: 
 https://cmmj627vvrzkst.blob.core.windows.net/bmm-run-command-output/7c5557b9-b6b6-a4a4-97ea-752c38918ded-action-bmmdataextcmd.tar.gz?se=2024-01-23T20%3A11%3A32Z&sig=9h20XlZO87J7fCr0S1234xcyu%2Fl%2BVuaDh1BE0J6Yfl8%3D&sp=r&spr=https&sr=b&st=2024-01-23T16%3A11%3A32Z&sv=2019-12-12 
```

After downloading the execution result file, the support files can be unzipped for analysis.

__Example list of information collected by the MDE Client Analyzer__

```azurecli
Archive:  mde-support-diagnostics-rack1compute02.zip
  inflating: mde_diagnostic.zip      
  inflating: process_information.txt  
  inflating: auditd_info.txt         
  inflating: auditd_log_analysis.txt  
  inflating: auditd_logs.zip         
  inflating: ebpf_kernel_config.txt  
  inflating: ebpf_enabled_func.txt   
  inflating: ebpf_syscalls.zip       
  inflating: ebpf_raw_syscalls.zip   
  inflating: messagess.zip           
  inflating: conflicting_processes_information.txt  
[...snip...]
```

### Hardware Rollup Status

Data is collected with the `hardware-rollup-status` command and formatted as JSON to `/hostfs/tmp/runcommand/rollupStatus.json`. The JSON file is found
in the data extract zip file located in the storage account. The data collected will show the health of the machine subsystems.

This example executes the `hardware-rollup-status` command without arguments.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "clusete_MRG" \
  --subscription "subscription" \
  --commands '[{"command":"hardware-rollup-status"}]' \
  --limit-time-seconds 600
```

__`hardware-rollup-status` Output__

```azurecli
====Action Command Output====
Executing hardware-rollup-status command
Getting rollup status logs for b37dev03a1c002
Writing to /hostfs/tmp/runcommand

================================
Script execution result can be found in storage account:
https://cmkfjft8twwpst.blob.core.windows.net/bmm-run-command-output/20b217b5-ea38-4394-9db1-21a0d392eff0-action-bmmdataextcmd.tar.gz?se=2023-09-19T18%3A47%3A17Z&sig=ZJcsNoBzvOkUNL0IQ3XGtbJSaZxYqmtd%3D&sp=r&spr=https&sr=b&st=2023-09-19T14%3A47%3A17Z&sv=2019-12-12
```

__Example JSON Collected__

```
{
	"@odata.context" : "/redfish/v1/$metadata#DellRollupStatusCollection.DellRollupStatusCollection",
	"@odata.id" : "/redfish/v1/Systems/System.Embedded.1/Oem/Dell/DellRollupStatus",
	"@odata.type" : "#DellRollupStatusCollection.DellRollupStatusCollection",
	"Description" : "A collection of DellRollupStatus resource",
	"Members" : 
	[
		{
			"@odata.context" : "/redfish/v1/$metadata#DellRollupStatus.DellRollupStatus",
			"@odata.id" : "/redfish/v1/Systems/System.Embedded.1/Oem/Dell/DellRollupStatus/iDRAC.Embedded.1_0x23_SubSystem.1_0x23_Current",
			"@odata.type" : "#DellRollupStatus.v1_0_0.DellRollupStatus",
			"CollectionName" : "CurrentRollupStatus",
			"Description" : "Represents the subcomponent roll-up statuses.",
			"Id" : "iDRAC.Embedded.1_0x23_SubSystem.1_0x23_Current",
			"InstanceID" : "iDRAC.Embedded.1#SubSystem.1#Current",
			"Name" : "DellRollupStatus",
			"RollupStatus" : "Ok",
			"SubSystem" : "Current"
		},
		{
			"@odata.context" : "/redfish/v1/$metadata#DellRollupStatus.DellRollupStatus",
			"@odata.id" : "/redfish/v1/Systems/System.Embedded.1/Oem/Dell/DellRollupStatus/iDRAC.Embedded.1_0x23_SubSystem.1_0x23_Voltage",
			"@odata.type" : "#DellRollupStatus.v1_0_0.DellRollupStatus",
			"CollectionName" : "VoltageRollupStatus",
			"Description" : "Represents the subcomponent roll-up statuses.",
			"Id" : "iDRAC.Embedded.1_0x23_SubSystem.1_0x23_Voltage",
			"InstanceID" : "iDRAC.Embedded.1#SubSystem.1#Voltage",
			"Name" : "DellRollupStatus",
			"RollupStatus" : "Ok",
			"SubSystem" : "Voltage"
		},
[..snip..]
```

## Viewing the Output

Note the provided link to the tar.gz zipped file from the command execution. The tar.gz file name identifies the file in the Storage Account of the Cluster Manager resource group. You can also use the link to directly access the output zip file. The tar.gz file also contains the zipped extract command file outputs. Download the output file from the storage blob to a local directory by specifying the directory path in the optional argument `--output-directory`.
