---
title: Troubleshoot BMM issues using the `az networkcloud baremetalmachine run-read-command` for Operator Nexus
description: Step by step guide on using the `az networkcloud baremetalmachine run-read-command` to run diagnostic commands on a BMM.
author: eak13
ms.author: ekarandjeff
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 03/23/2023
ms.custom: template-how-to
---

# Troubleshoot BMM issues using the `az networkcloud baremetalmachine run-read-command`

There may be situations where a user needs to investigate & resolve issues with an on-premises BMM. Operator Nexus provides the `az networkcloud baremetalmachine run-read-command` so users can run a curated list of read only commands to get information from a BMM.

The command execution produces an output file containing the results that can be found in the Cluster Manager's Storage account.

## Prerequisites

1. Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
1. Ensure that the target BMM must have its `poweredState` set to `On` and have its `readyState` set to `True`
1. Get the Resource group name that you created for `Cluster` resource

## Executing a run-read command

The run-read command executes a read-only command on the specified BMM.

The current list of supported commands are:

- `traceroute`
- `ping`
- `arp`
- `tcpdump`
- `brctl show`
- `dmidecode`
- `host`
- `ip link show`
- `ip address show`
- `ip maddress show`
- `ip route show`
- `journalctl`
- `kubectl logs`
- `kubectl describe`
- `kubectl get`
- `kubectl api-resources`
- `kubectl api-versions`
- `uname`
- `uptime`
- `fdisk -l`
- `hostname`
- `ifconfig -a`
- `ifconfig -s`
- `mount`
- `ss`
- `ulimit -a`

The command syntax is:

```azurecli
az networkcloud baremetalmachine run-read-command --name "<machine-name>"
    --limit-time-seconds <timeout> \
    --commands '[{"command":"<command1>"},{"command":"<command2>","arguments":["<arg1>","<arg2>"]}]' \
    --resource-group "<resourceGroupName>" \
    --subscription "<subscription>" 
```

These commands don't require `arguments`:

- `fdisk -l`
- `hostname`
- `ifconfig -a`
- `ifconfig -s`
- `mount`
- `ss`
- `ulimit -a`

All other inputs are required. 

Multiple commands can be provided in json format to `--commands` option.

For a command with multiple arguments, provide as a list to `arguments` parameter. See [Azure CLI Shorthand](https://github.com/Azure/azure-cli/blob/dev/doc/shorthand_syntax.md) for instructions on constructing the `--commands` structure.

These commands can be long running so the recommendation is to set `--limit-time-seconds` to at least 600 seconds (10 minutes). Running multiple extracts might take longer that 10 minutes.

This command runs synchronously. If you wish to skip waiting for the command to complete, specify the `--no-wait --debug` options. For more information, see [how to track asynchronous operations](howto-track-async-operations-cli.md).

When an optional argument `--output-directory` is provided, the output result is downloaded and extracted to the local directory.

### This example executes the `hostname` command and a `ping` command.

```azurecli
az networkcloud baremetalmachine run-read-command --name "bareMetalMachineName" \
    --limit-time-seconds 60 \
    --commands '[{"command":"hostname"],"arguments":["198.51.102.1","-c","3"]},{"command":"ping"}]' \
    --resource-group "resourceGroupName" \
    --subscription "<subscription>" 
```

In the response, an HTTP status code of 202 is returned as the operation is performed asynchronously. 

## Checking command status and viewing output


Sample output looks something as below. It prints the top 4K characters of the result to the screen for convenience and provides a short-lived link to the storage blob containing the command execution result. You can use the link to download the zipped output file (tar.gz).

```output
  ====Action Command Output====
  + hostname
  rack1compute01
  + ping 198.51.102.1 -c 3
  PING 198.51.102.1 (198.51.102.1) 56(84) bytes of data.

  --- 198.51.102.1 ping statistics ---
  3 packets transmitted, 0 received, 100% packet loss, time 2049ms



  ================================
  Script execution result can be found in storage account:
  https://<storage_account_name>.blob.core.windows.net/bmm-run-command-output/a8e0a5fe-3279-46a8-b995-51f2f98a18dd-action-bmmrunreadcmd.tar.gz?se=2023-04-14T06%3A37%3A00Z&sig=XXX&sp=r&spr=https&sr=b&st=2023-04-14T02%3A37%3A00Z&sv=2019-12-12
```

See [How To BareMetal Review Output Run-Read](howto-baremetal-review-read-output.md) for instructions on locating the output file in the Storage Account. You can also use the link to directly access the output zip file.
