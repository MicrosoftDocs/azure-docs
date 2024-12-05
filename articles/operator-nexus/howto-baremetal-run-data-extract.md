---
title: Troubleshoot bare metal machine issues using the `az networkcloud baremetalmachine run-data-extract` command for Azure Operator Nexus
description: Step by step guide on using the `az networkcloud baremetalmachine run-data-extract` to extract data from a bare metal machine for troubleshooting and diagnostic purposes.
author: eak13
ms.author: ekarandjeff
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 10/16/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Troubleshoot bare metal machine issues using the `az networkcloud baremetalmachine run-data-extract` command

There might be situations where a user needs to investigate and resolve issues with an on-premises bare metal machine. Azure Operator Nexus provides a prescribed set of data extract commands via `az networkcloud baremetalmachine run-data-extract`. These commands enable users to get diagnostic data from a bare metal machine.

The command produces an output file containing the results of the data extract. By default, the data is sent to the Cluster Manager storage account. There's also a preview method where users can configure the Cluster resource with a storage account and identity that has access to the storage account to receive the output.

## Prerequisites

- This article assumes that the Azure command line interface and the `networkcloud` command line interface extension are installed. For more information, see [How to Install CLI Extensions](./howto-install-cli-extensions.md).
- The target bare metal machine is on and ready.
- The syntax for these commands is based on the 0.3.0+ version of the `az networkcloud` CLI.
- Get the Cluster Managed Resource group name (cluster_MRG) that you created for Cluster resource.

## Verify access to the Cluster Manager storage account

> [!NOTE]
> The Cluster Manager storage account output method will be deprecated in the future once Cluster on-boarding to Trusted Services is complete and the user managed storage option is fully supported.

If using the Cluster Manager storage method, verify you have access to the Cluster Manager's storage account:

1. From Azure portal, navigate to Cluster Manager's Storage account.
1. In the Storage account details, select **Storage browser** from the navigation menu on the left side.
1. In the Storage browser details, select on **Blob containers**.
1. If you encounter a `403 This request is not authorized to perform this operation.` while accessing the storage account, storage account’s firewall settings need to be updated to include the public IP address.
1. Request access by creating a support ticket via Portal on the Cluster Manager resource. Provide the public IP address that requires access.

## **PREVIEW:** Send command output to a user specified storage account

> [!IMPORTANT]
> Please note that this method of specifying a user storage account for command output is in preview. **This method should only be used with user storage accounts that do not have firewall enabled.** If your environment requires the storage account firewall be enabled, use the existing Cluster Manager output method.

### Create and configure storage resources

1. Create a storage account, or identify an existing storage account that you want to use. See [Create an Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).
1. Create a blob storage container in the storage account. See [Create a container](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).
1. Assign the "Storage Blob Data Contributor" role to users and managed identities which need access to the run-data-extract output.
   1. See [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal). The role must also be assigned to either a user-assigned managed identity or the cluster's own system-assigned managed identity.
   1. For more information on managed identities, see [Managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).
   1. If using the Cluster's system assigned identity, the system assigned identity needs to be added to the cluster before it can be granted access.
   1. When assigning a role to the cluster's system-assigned identity, make sure you select the resource with the type "Cluster (Operator Nexus)."

### Configure the cluster to use a user-assigned managed identity for storage access

Use this command to create a cluster with a user managed storage account and user-assigned identity. Note this example is an abbreviated command that just highlights the fields pertinent for adding the user managed storage. It isn't the full cluster create command.

```azurecli-interactive
az networkcloud cluster create --name "<cluster-name>" \
  --resource-group "<cluster-resource-group>" \
  ...
  --mi-user-assigned "<user-assigned-identity-resource-id>" \
  --command-output-settings identity-type="UserAssignedIdentity" \
  identity-resource-id="<user-assigned-identity-resource-id>" \
  container-url="<container-url>" \
  ...
  --subscription "<subscription>"
```

Use this command to configure an existing cluster for a user provided storage account and user-assigned identity. The update command can also be used to change the storage account location and identity if needed.

```azurecli-interactive
az networkcloud cluster update --name "<cluster-name>" \
  --resource-group "<cluster-resource-group>" \
  --mi-user-assigned "<user-assigned-identity-resource-id>" \
  --command-output-settings identity-type="UserAssignedIdentity" \
  identity-resource-id="<user-assigned-identity-resource-id>" \
  container-url="<container-url>" \
  --subscription "<subscription>"
```

### Configure the cluster to use a system-assigned managed identity for storage access

Use this command to create a cluster with a user managed storage account and system assigned identity. Note this example is an abbreviated command that just highlights the fields pertinent for adding the user managed storage. It isn't the full cluster create command.

```azurecli-interactive
az networkcloud cluster create --name "<cluster-name>" \
  --resource-group "<cluster-resource-group>" \
  ...
  --mi-system-assigned true \
  --command-output-settings identity-type="SystemAssignedIdentity" \
  container-url="<container-url>" \
  ...
  --subscription "<subscription>"
```

Use this command to configure an existing cluster for a user provided storage account and to use its own system-assigned identity. The update command can also be used to change the storage account location.

```azurecli-interactive
az networkcloud cluster update --name "<cluster-name>" \
  --resource-group "<cluster-resource-group>" \
  --mi-system-assigned true \
  --command-output-settings identity-type="SystemAssignedIdentity" \
  container-url="<container-url>" \
  --subscription "<subscription>"
```

To change the cluster from a user-assigned identity to a system-assigned identity, the CommandOutputSettings must first be cleared using the command in the next section, then set using this command.

### Clear the cluster's CommandOutputSettings

The CommandOutputSettings can be cleared, directing run-data-extract output back to the cluster manager's storage. However, it isn't recommended since it's less secure, and the option will be removed in a future release.

However, the CommandOutputSettings do need to be cleared if switching from a user-assigned identity to a system-assigned identity.

Use this command to clear the CommandOutputSettings:

```azurecli-interactive
az rest --method patch \
  --url  "https://management.azure.com/subscriptions/<subscription>/resourceGroups/<cluster-resource-group>/providers/Microsoft.NetworkCloud/clusters/<cluster-name>?api-version=2024-08-01-preview" \
  --body '{"properties": {"commandOutputSettings":null}}'
```

### View the principal ID for the managed identity

The identity resource ID can be found by selecting "JSON view" on the identity resource; the ID is at the top of the panel that appears. The container URL can be found on the Settings -> Properties tab of the container resource.

The CLI can also be used to view the identity and the associated principal ID data within the cluster.

Example:

```console
az networkcloud cluster show --ids /subscriptions/<Subscription ID>/resourceGroups/<Cluster Resource Group Name>/providers/Microsoft.NetworkCloud/clusters/<Cluster Name>
```

System-assigned identity example:

```
    "identity": {
        "principalId": "aaaaaaaa-bbbb-cccc-1111-222222222222",
        "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
        "type": "SystemAssigned"
    },
```

User-assigned identity example:

```
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "/subscriptions/<subscriptionID>/resourcegroups/<resourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<userAssignedIdentityName>": {
                "clientId": "00001111-aaaa-2222-bbbb-3333cccc4444",
                "principalId": "bbbbbbbb-cccc-dddd-2222-333333333333"
            }
        }
    },
```

## Execute a run-data-extract command

The run data extract command executes one or more predefined scripts to extract data from a bare metal machine.

> [!WARNING]
> Microsoft does not provide or support any Operator Nexus API calls that expect plaintext username and/or password to be supplied. Please note any values sent will be logged and are considered exposed secrets, which should be rotated and revoked. The Microsoft documented method for securely using secrets is to store them in an Azure Key Vault, if you have specific questions or concerns please submit a request via the Azure Portal.

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

- [Generate Cluster CVE Report](#generate-cluster-cve-report)\
  Command Name: `cluster-cve-report`\
  Arguments: None

- [Collect Helm Releases](#collect-helm-releases)\
  Command Name: `collect-helm-releases`\
  Arguments: None
  
- [Collect `systemctl status` Output](#collect-systemctl-status-output)\
  Command Name: `platform-services-status`\
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

This example executes the `hardware-support-data-collection` command and get `SysInfo` and `TTYLog` logs from the Dell Server. The script executes a `racadm supportassist collect` command on the designated bare metal machine. The resulting tar.gz file contains the zipped extract command file outputs in `hardware-support-data-<timestamp>.zip`.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "cluster_MRG" \
  --subscription "subscription" \
  --commands '[{"arguments":["SysInfo", "TTYLog"],"command":"hardware-support-data-collection"}]' \
  --limit-time-seconds 600
```

**`hardware-support-data-collection` Output**

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

**Example list of hardware support files collected**

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
sequence of `mdatp` commands on the designated bare metal machine.

This example executes the `mde-agent-information` command without arguments.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "cluster_MRG" \
  --subscription "subscription" \
  --commands '[{"command":"mde-agent-information"}]' \
  --limit-time-seconds 600
```

**`mde-agent-information` Output**

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

**Example JSON object collected**

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

Data collected from the `mde-support-diagnostics` command uses the MDE Client Analyzer tool to bundle information from `mdatp` commands and relevant log files. The storage account `tgz` file contains a `zip` file named `mde-support-diagnostics-<hostname>.zip`. The `zip` should be sent along with any support requests to ensure the supporting teams can use the logs for troubleshooting and root cause analysis, if needed.

This example executes the `mde-support-diagnostics` command without arguments.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "cluster_MRG" \
  --subscription "subscription" \
  --commands '[{"command":"mde-support-diagnostics"}]' \
  --limit-time-seconds 600
```

**`mde-support-diagnostics` Output**

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

After you download the execution result file, the support files can be unzipped for analysis.

**Example list of information collected by the MDE Client Analyzer**

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
in the data extract zip file located in the storage account. The data collected shows the health of the machine subsystems.

This example executes the `hardware-rollup-status` command without arguments.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "clusete_MRG" \
  --subscription "subscription" \
  --commands '[{"command":"hardware-rollup-status"}]' \
  --limit-time-seconds 600
```

**`hardware-rollup-status` Output**

```azurecli
====Action Command Output====
Executing hardware-rollup-status command
Getting rollup status logs for b37dev03a1c002
Writing to /hostfs/tmp/runcommand

================================
Script execution result can be found in storage account:
https://cmkfjft8twwpst.blob.core.windows.net/bmm-run-command-output/20b217b5-ea38-4394-9db1-21a0d392eff0-action-bmmdataextcmd.tar.gz?se=2023-09-19T18%3A47%3A17Z&sig=ZJcsNoBzvOkUNL0IQ3XGtbJSaZxYqmtd%3D&sp=r&spr=https&sr=b&st=2023-09-19T14%3A47%3A17Z&sv=2019-12-12
```

**Example JSON Collected**

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

### Generate Cluster CVE Report

Vulnerability data is collected with the `cluster-cve-report` command and formatted as JSON to `{year}-{month}-{day}-nexus-cluster-vulnerability-report.json`. The JSON file is found in the data extract zip file located in the storage account. The data collected includes vulnerability data per container image in the cluster.

This example executes the `cluster-cve-report` command without arguments.

> [!NOTE]
> The target machine must be a control-plane node or the action will not execute.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "cluster_MRG" \
  --subscription "subscription" \
  --commands '[{"command":"cluster-cve-report"}]' \
  --limit-time-seconds 600
```

**`cluster-cve-report` Output**

```azurecli
====Action Command Output====
Nexus cluster vulnerability report saved.


================================
Script execution result can be found in storage account:
https://cmkfjft8twwpst.blob.core.windows.net/bmm-run-command-output/20b217b5-ea38-4394-9db1-21a0d392eff0-action-bmmdataextcmd.tar.gz?se=2023-09-19T18%3A47%3A17Z&sig=ZJcsNoBzvOkUNL0IQ3XGtbJSaZxYqmtd%3D&sp=r&spr=https&sr=b&st=2023-09-19T14%3A47%3A17Z&sv=2019-12-12
```

**CVE Report Schema**

```JSON
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Vulnerability Report",
  "type": "object",
  "properties": {
    "metadata": {
      "type": "object",
      "properties": {
        "dateRetrieved": {
          "type": "string",
          "format": "date-time",
          "description": "The date and time when the data was retrieved."
        },
        "platform": {
          "type": "string",
          "description": "The name of the platform."
        },
        "resource": {
          "type": "string",
          "description": "The name of the resource."
        },
        "runtimeVersion": {
          "type": "string",
          "description": "The version of the runtime."
        },
        "managementVersion": {
          "type": "string",
          "description": "The version of the management software."
        },
        "vulnerabilitySummary": {
          "type": "object",
          "properties": {
            "criticalCount": {
              "type": "integer",
              "description": "Number of critical vulnerabilities."
            },
            "highCount": {
              "type": "integer",
              "description": "Number of high severity vulnerabilities."
            },
            "mediumCount": {
              "type": "integer",
              "description": "Number of medium severity vulnerabilities."
            },
            "lowCount": {
              "type": "integer",
              "description": "Number of low severity vulnerabilities."
            },
            "noneCount": {
              "type": "integer",
              "description": "Number of vulnerabilities with no severity."
            },
            "unknownCount": {
              "type": "integer",
              "description": "Number of vulnerabilities with unknown severity."
            }
          },
          "required": ["criticalCount", "highCount", "mediumCount", "lowCount", "noneCount", "unknownCount"]
        }
      },
      "required": ["dateRetrieved", "platform", "resource", "runtimeVersion", "managementVersion", "vulnerabilitySummary"]
    },
    "containers": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "namespace": {
              "type": "string",
              "description": "The namespace of the container."
            },
            "digest": {
              "type": "string",
              "description": "The digest of the container image."
            },
            "os": {
              "type": "object",
              "properties": {
                "family": {
                  "type": "string",
                  "description": "The family of the operating system."
                }
              },
              "required": ["family"]
            },
            "summary": {
              "type": "object",
              "properties": {
                "criticalCount": {
                  "type": "integer",
                  "description": "Number of critical vulnerabilities in this container."
                },
                "highCount": {
                  "type": "integer",
                  "description": "Number of high severity vulnerabilities in this container."
                },
                "lowCount": {
                  "type": "integer",
                  "description": "Number of low severity vulnerabilities in this container."
                },
                "mediumCount": {
                  "type": "integer",
                  "description": "Number of medium severity vulnerabilities in this container."
                },
                "noneCount": {
                  "type": "integer",
                  "description": "Number of vulnerabilities with no severity in this container."
                },
                "unknownCount": {
                  "type": "integer",
                  "description": "Number of vulnerabilities with unknown severity in this container."
                }
              },
              "required": ["criticalCount", "highCount", "lowCount", "mediumCount", "noneCount", "unknownCount"]
            },
            "vulnerabilities": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string",
                    "description": "Title of the vulnerability."
                  },
                  "vulnerabilityID": {
                    "type": "string",
                    "description": "Identifier of the vulnerability."
                  },
                  "fixedVersion": {
                    "type": "string",
                    "description": "The version in which the vulnerability is fixed."
                  },
                  "installedVersion": {
                    "type": "string",
                    "description": "The currently installed version."
                  },
                  "referenceLink": {
                    "type": "string",
                    "format": "uri",
                    "description": "Link to the vulnerability details."
                  },
                  "publishedDate": {
                    "type": "string",
                    "format": "date-time",
                    "description": "The date when the vulnerability was published."
                  },
                  "score": {
                    "type": "number",
                    "description": "The CVSS score of the vulnerability."
                  },
                  "severity": {
                    "type": "string",
                    "description": "The severity level of the vulnerability."
                  },
                  "resource": {
                    "type": "string",
                    "description": "The resource affected by the vulnerability."
                  },
                  "target": {
                    "type": "string",
                    "description": "The target of the vulnerability."
                  },
                  "packageType": {
                    "type": "string",
                    "description": "The type of the package."
                  },
                  "exploitAvailable": {
                    "type": "boolean",
                    "description": "Indicates if an exploit is available for the vulnerability."
                  }
                },
                "required": ["title", "vulnerabilityID", "fixedVersion", "installedVersion", "referenceLink", "publishedDate", "score", "severity", "resource", "target", "packageType", "exploitAvailable"]
              }
            }
          },
          "required": ["namespace", "digest", "os", "summary", "vulnerabilities"]
        }
      }
    }
  },
  "required": ["metadata", "containers"]
}
```

**CVE Data Details**

The CVE data is refreshed per container image every 24 hours or when there's a change to the Kubernetes resource referencing the image.

### Collect Helm Releases

Helm release data is collected with the `collect-helm-releases` command and formatted as json to `{year}-{month}-{day}-helm-releases.json`. The JSON file is found in the data extract zip file located in the storage account. The data collected includes all helm release information from the Cluster, which consists of the standard data returned when running the command `helm list`.

This example executes the `collect-helm-releases` command without arguments.

> [!NOTE]
> The target machine must be a control-plane node or the action will not execute.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "cluster_MRG" \
  --subscription "subscription" \
  --commands '[{"command":"collect-helm-releases"}]' \
  --limit-time-seconds 600
```

**`collect-helm-releases` Output**

```azurecli
====Action Command Output====
Helm releases report saved.


================================
Script execution result can be found in storage account:
https://cmcr5xp3mbn7st.blob.core.windows.net/bmm-run-command-output/a29dcbdb-5524-4172-8b55-88e0e5ec93ff-action-bmmdataextcmd.tar.gz?se=2024-10-30T02%3A09%3A54Z&sig=v6cjiIDBP9viEijs%2B%2BwJDrHIAbLEmuiVmCEEDHEi%2FEc%3D&sp=r&spr=https&sr=b&st=2024-10-29T22%3A09%3A54Z&sv=2023-11-03
```

**Helm Release Schema**

```JSON
{
  "$schema": "http://json-schema.org/schema#",
  "type": "object",
  "properties": {
    "metadata": {
      "type": "object",
      "properties": {
        "dateRetrieved": {
          "type": "string"
        },
        "platform": {
          "type": "string"
        },
        "resource": {
          "type": "string"
        },
        "clusterId": {
          "type": "string"
        },
        "runtimeVersion": {
          "type": "string"
        },
        "managementVersion": {
          "type": "string"
        }
      },
      "required": [
        "clusterId",
        "dateRetrieved",
        "managementVersion",
        "platform",
        "resource",
        "runtimeVersion"
      ]
    },
    "helmReleases": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "namespace": {
            "type": "string"
          },
          "revision": {
            "type": "string"
          },
          "updated": {
            "type": "string"
          },
          "status": {
            "type": "string"
          },
          "chart": {
            "type": "string"
          },
          "app_version": {
            "type": "string"
          }
        },
        "required": [
          "app_version",
          "chart",
          "name",
          "namespace",
          "revision",
          "status",
          "updated"
        ]
      }
    }
  },
  "required": [
    "helmReleases",
    "metadata"
  ]
}
```

### Collect Systemctl Status Output

Service status is collected with the `platform-services-status` command. The output is in plain text format and
returns an overview of the status of the services on the host as well as the `systemctl status` for each found service.

This example executes the `platform-services-status` command without arguments.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "clusete_MRG" \
  --subscription "subscription" \
  --commands '[{"command":"platform-services-status"}]' \
  --limit-time-seconds 600
  --output-directory "/path/to/local/directory"
```

**`platform-services-status` Output**

```azurecli
====Action Command Output====
UNIT                                                                                          LOAD      ACTIVE   SUB     DESCRIPTION
aods-infra-vf-config.service                                                                  not-found inactive dead    aods-infra-vf-config.service
aods-pnic-config-infra.service                                                                not-found inactive dead    aods-pnic-config-infra.service
aods-pnic-config-workload.service                                                             not-found inactive dead    aods-pnic-config-workload.service
arc-unenroll-file-semaphore.service                                                           loaded    active   exited  Arc-unenrollment upon shutdown service
atop-rotate.service                                                                           loaded    inactive dead    Restart atop daemon to rotate logs
atop.service                                                                                  loaded    active   running Atop advanced performance monitor
atopacct.service                                                                              loaded    active   running Atop process accounting daemon
audit.service                                                                                 loaded    inactive dead    Audit service
auditd.service                                                                                loaded    active   running Security Auditing Service
azurelinux-sysinfo.service                                                                    loaded    inactive dead    Azure Linux Sysinfo Service
blk-availability.service                                                                      loaded    inactive dead    Availability of block devices
[..snip..]


-------
● arc-unenroll-file-semaphore.service - Arc-unenrollment upon shutdown service
     Loaded: loaded (/etc/systemd/system/arc-unenroll-file-semaphore.service; enabled; vendor preset: enabled)
     Active: active (exited) since Tue 2024-11-12 06:33:40 UTC; 11h ago
   Main PID: 11663 (code=exited, status=0/SUCCESS)
        CPU: 5ms

Nov 12 06:33:39 rack1compute01 systemd[1]: Starting Arc-unenrollment upon shutdown service...
Nov 12 06:33:40 rack1compute01 systemd[1]: Finished Arc-unenrollment upon shutdown service.


-------
○ atop-rotate.service - Restart atop daemon to rotate logs
     Loaded: loaded (/usr/lib/systemd/system/atop-rotate.service; static)
     Active: inactive (dead)
TriggeredBy: ● atop-rotate.timer
[..snip..]

```

## Viewing the output

The command provides a link (if using cluster manager storage) or another command (if using user provided storage) to download the full output. The tar.gz file also contains the zipped extract command file outputs. Download the output file from the storage blob to a local directory by specifying the directory path in the optional argument `--output-directory`.

> [!WARNING]
> Using the `--output-directory` argument will overwrite any files in the local directory that have the same name as the new files being created.

> [!NOTE]
> Storage Account could be locked resulting in `403 This request is not authorized to perform this operation.` due to networking or firewall restrictions. Refer to the [cluster manager storage](#verify-access-to-the-cluster-manager-storage-account) or the [user managed storage](#create-and-configure-storage-resources) sections for procedures to verify access.
