---
title: Troubleshoot BMM issues using the `az networkcloud baremetalmachine run-read-command` for Operator Nexus
description: Step by step guide on using the `az networkcloud baremetalmachine run-read-command` to run diagnostic commands on a BMM.
author: eak13
ms.author: ekarandjeff
ms.service: azure
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
    --commands arguments="<arg1>" arguments="<arg2>" command="<command>" --resource-group "<resourceGroupName>" \
    --subscription "<subscription>" \
    --debug
```

These commands to not require `arguments`:

- `fdisk -l`
- `hostname`
- `ifconfig -a`
- `ifconfig -s`
- `mount`
- `ss`
- `ulimit -a`

All other inputs are required. Multiple commands are each specified with their own `--commands` option. 

Each `--commands` option specifies `command` and `arguments`. For a command with multiple arguments, `arguments` is repeated for each one.

`--debug` is required to get the operation status that can be queried to get the URL for the output file.

### This example executes the `hostname` command and a `ping` command.

```azurecli
az networkcloud baremetalmachine run-read-command --name "bareMetalMachineName" \
    --limit-time-seconds 60 \
    --commands command="hostname" \
    --commands arguments="192.168.0.99" arguments="-c" arguments="3" command="ping" \
    --resource-group "resourceGroupName" \
    --subscription "<subscription>" \
    --debug
```

In the response, an HTTP status code of 202 is returned as the operation is performed asynchronously. 

## Checking command status and viewing output

The debug output of the command execution contains the 'Azure-AsyncOperation' response header. Note the URL provided.

```azurecli
cli.azure.cli.core.sdk.policies:     'Azure-AsyncOperation': 'https://management.azure.com/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/providers/Microsoft.NetworkCloud/locations/EASTUS/operationStatuses/0797fdd7-28eb-48ec-8c70-39a3f893421d*A0123456789F331FE47B40E2BFBCE2E133FD3ED2562348BFFD8388A4AAA1271?api-version=2022-09-30-preview'
```

Check the status of the operation with the `az rest` command:

```azurecli
az rest --method get --url <Azure-AsyncOperation-URL>
```

Repeat until the response to the URL displays the result of the run-read-command.

Sample output looks something like this. The `Succeeded` `status` indicates the command was executed on the BMM. The `resultUrl` provides a link to the zipped output file that contains the output from the command execution. The tar.gz file name can be used to identify the file in the Storage account of the Cluster Manager resource group. 

See [How To BareMetal Review Output Run-Read](howto-baremetal-review-read-output.md) for instructions on locating the output file in the Storage Account. You can also use the link to directly access the output zip file.

```azurecli
az rest --method get --url https://management.azure.com/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/providers/Microsoft.NetworkCloud/locations/EASTUS/operationStatuses/932a8fe6-12ef-419c-bdc2-5bb11a2a071d*C0123456789E735D5D572DECFF4EECE2DFDC121CC3FC56CD50069249183110F?api-version=2022-09-30-preview
{
  "endTime": "2023-03-01T12:38:10.8582635Z",
  "error": {},
  "id": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/providers/Microsoft.NetworkCloud/locations/EASTUS/operationStatuses/932a8fe6-12ef-419c-bdc2-5bb11a2a071d*C0123456789E735D5D572DECFF4EECE2DFDC121CC3FC56CD50069249183110F",
  "name": "932a8fe6-12ef-419c-bdc2-5bb11a2a071d*C0123456789E735D5D572DECFF4EECE2DFDC121CC3FC56CD50069249183110F",
  "properties": {
    "exitCode": "15",
    "outputHead": "====Action Command Output====",
    "resultUrl": "https://cmnvc94zkjhvst.blob.core.windows.net/bmm-run-command-output/af4fea82-294a-429e-9d1e-e93d54f4ea24-action-bmmruncmd.tar.gz?se=2023-03-01T16%3A38%3A07Z&sig=Lj9MS01234567898fn4qb2E1HORGh260EHdRrCJTJg%3D&sp=r&spr=https&sr=b&st=2023-03-01T12%3A38%3A07Z&sv=2019-12-12"
  },
  "resourceId": "/subscriptions/xxxxxx-xxxxxx-xxxx-xxxx-xxxxxx/resourceGroups/m01-xx-HostedResources-xx/providers/Microsoft.NetworkCloud/bareMetalMachines/m01r750wkr3",
  "startTime": "2023-03-01T12:37:48.2823434Z",
  "status": "Succeeded"
}
```
