---
title: Troubleshoot bare metal machine issues using the `az networkcloud baremetalmachine run-data-extract` command for Azure Operator Nexus
description: Step by step guide on using the `az networkcloud baremetalmachine run-data-extract` to extract data from a bare metal machine for troubleshooting and diagnostic purposes.
author: eak13
ms.author: ekarandjeff
ms.service: azure
ms.topic: how-to
ms.date: 05/15/2023
ms.custom: template-how-to
---

# Troubleshoot bare metal machine issues using the `az networkcloud baremetalmachine run-data-extract` command

There may be situations where a user needs to investigate and resolve issues with an on-premises bare metal machine. Azure Operator Nexus provides a prescribed set of data extract commands via `az networkcloud baremetalmachine run-data-extract`. These commands enable users to get diagnostic data from a bare metal machine.

The command produces an output file containing the results of the data extract located in the Cluster Manager's Azure Storage Account.

## Before you begin

- This article assumes that you've installed the Azure command line interface and the `networkcloud` command line interface extension. For more information, see [How to Install CLI Extensions](./howto-install-cli-extensions.md).
- The target bare metal machine is on and has readyState set to True.
- The syntax for these commands is based on the 0.3.0+ version of the `az networkcloud` CLI.

## Executing a run command

The run data extract command executes one or more predefined scripts to extract data from a bare metal machine.

The current list of supported commands are

- SupportAssist/TSR collection for Dell troubleshooting\
  Command Name: `hardware-support-data-collection`\
  Arguments: Type of logs requested
  - `SysInfo` - System Information
  - `TTYLog` - Storage TTYLog data
  - `Debug` - debug logs

The command syntax is:

```azurecli-interactive
az networkcloud baremetalmachine run-data-extract --name "<machine-name>"  \
  --resource-group "<resource-group>" \
  --subscription "<subscription>" \
  --commands '[{"arguments":["<arg1>","<arg2>"],"command":"<command1>"}]'  \
  --limit-time-seconds <timeout>
```

Specify multiple commands using json format in `--commands` option. Each `command` specifies command and arguments. For a command with multiple arguments, provide as a list to the `arguments` parameter. See [Azure CLI Shorthand](https://github.com/Azure/azure-cli/blob/dev/doc/shorthand_syntax.md) for instructions on constructing the `--commands` structure.

These commands can be long running so the recommendation is to set `--limit-time-seconds` to at least 600 seconds (10 minutes). The `Debug` option or running multiple extracts might take longer than 10 minutes.

This example executes the `hardware-support-data-collection` command and get `SysInfo` and `TTYLog` logs from the Dell Server.

```azurecli
az networkcloud baremetalmachine run-data-extract --name "bareMetalMachineName" \
  --resource-group "resourceGroupName" \
  --subscription "subscription" \
  --commands '[{"arguments":["SysInfo", "TTYLog"],"command":"hardware-support-data-collection"}]' \
  --limit-time-seconds 600
```

In the response, the operation performs asynchronously and returns an HTTP status code of 202. See the **Viewing the output** section for details on how to track command completion and view the output file.

## Viewing the output

Sample output looks something like this. Note the provided link to the tar.gz zipped file from the command execution. The tar.gz file name identifies the file in the Storage Account of the Cluster Manager resource group. You can also use the link to directly access the output zip file. The tar.gz file also contains the zipped extract command file outputs in `hardware-support-data-<timestamp>.zip`. Download the output file from the storage blob to a local directory by specifying the directory path in the optional argument `--output-directory`.

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
