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
1. Get the Managed Resource group name (cluster_MRG) that you created for `Cluster` resource

## Executing a run-read command

The run-read command lets you run a command on the BMM that does not change anything. Some commands have more
than one word, or need an argument to work. These commands are made like this to separate them from the ones
that can change things. For example, run-read-command can use `kubectl get` but not `kubectl apply`. When you
use these commands, you have to put all the words in the “command” field. For example,
`{"command":"kubectl get","arguments":["nodes"]}` is right; `{"command":"kubectl","arguments":["get","nodes"]}`
is wrong.

Also note that some commands begin with `nc-toolbox nc-toolbox-runread` and must be entered as shown.
`nc-toolbox-runread` is a special container image that includes more tools that aren't installed on the
baremetal host, such as `ipmitool` and `racadm`.

Some of the run-read commands require specific arguments be supplied to enforce read-only capabilities of the commands.
An example of run-read commands that require specific arguments is the allowed Mellanox command `mstconfig`,
which requires the `query` argument be provided to enforce read-only.

The list below shows the commands you can use. Commands in `*italics*` cannot have `arguments`; the rest can.

- `arp`
- `brctl show`
- `dmidecode`
- *`fdisk -l`*
- `host`
- *`hostname`*
- *`ifconfig -a`*
- *`ifconfig -s`*
- `ip address show`
- `ip link show`
- `ip maddress show`
- `ip route show`
- `journalctl`
- `kubectl api-resources`
- `kubectl api-versions`
- `kubectl describe`
- `kubectl get`
- `kubectl logs`
- *`mount`*
- `ping`
- *`ss`*
- `tcpdump`
- `traceroute`
- `uname`
- *`ulimit -a`*
- `uptime`
- `nc-toolbox nc-toolbox-runread ipmitool channel authcap`
- `nc-toolbox nc-toolbox-runread ipmitool channel info`
- `nc-toolbox nc-toolbox-runread ipmitool chassis status`
- `nc-toolbox nc-toolbox-runread ipmitool chassis power status`
- `nc-toolbox nc-toolbox-runread ipmitool chassis restart cause`
- `nc-toolbox nc-toolbox-runread ipmitool chassis poh`
- `nc-toolbox nc-toolbox-runread ipmitool dcmi power get_limit`
- `nc-toolbox nc-toolbox-runread ipmitool dcmi sensors`
- `nc-toolbox nc-toolbox-runread ipmitool dcmi asset_tag`
- `nc-toolbox nc-toolbox-runread ipmitool dcmi get_mc_id_string`
- `nc-toolbox nc-toolbox-runread ipmitool dcmi thermalpolicy get`
- `nc-toolbox nc-toolbox-runread ipmitool dcmi get_temp_reading`
- `nc-toolbox nc-toolbox-runread ipmitool dcmi get_conf_param`
- `nc-toolbox nc-toolbox-runread ipmitool delloem lcd info`
- `nc-toolbox nc-toolbox-runread ipmitool delloem lcd status`
- `nc-toolbox nc-toolbox-runread ipmitool delloem mac list`
- `nc-toolbox nc-toolbox-runread ipmitool delloem mac get`
- `nc-toolbox nc-toolbox-runread ipmitool delloem lan get`
- `nc-toolbox nc-toolbox-runread ipmitool delloem powermonitor powerconsumption`
- `nc-toolbox nc-toolbox-runread ipmitool delloem powermonitor powerconsumptionhistory`
- `nc-toolbox nc-toolbox-runread ipmitool delloem powermonitor getpowerbudget`
- `nc-toolbox nc-toolbox-runread ipmitool delloem vflash info card`
- `nc-toolbox nc-toolbox-runread ipmitool echo`
- `nc-toolbox nc-toolbox-runread ipmitool ekanalyzer print`
- `nc-toolbox nc-toolbox-runread ipmitool ekanalyzer summary`
- `nc-toolbox nc-toolbox-runread ipmitool fru print`
- `nc-toolbox nc-toolbox-runread ipmitool fwum info`
- `nc-toolbox nc-toolbox-runread ipmitool fwum status`
- `nc-toolbox nc-toolbox-runread ipmitool fwum tracelog`
- `nc-toolbox nc-toolbox-runread ipmitool gendev list`
- `nc-toolbox nc-toolbox-runread ipmitool hpm rollbackstatus`
- `nc-toolbox nc-toolbox-runread ipmitool hpm selftestresult`
- `nc-toolbox nc-toolbox-runread ipmitool ime help`
- `nc-toolbox nc-toolbox-runread ipmitool ime info`
- `nc-toolbox nc-toolbox-runread ipmitool isol info`
- `nc-toolbox nc-toolbox-runread ipmitool lan print`
- `nc-toolbox nc-toolbox-runread ipmitool lan alert print`
- `nc-toolbox nc-toolbox-runread ipmitool lan stats get`
- `nc-toolbox nc-toolbox-runread ipmitool mc bootparam get`
- `nc-toolbox nc-toolbox-runread ipmitool mc chassis poh`
- `nc-toolbox nc-toolbox-runread ipmitool mc chassis policy list`
- `nc-toolbox nc-toolbox-runread ipmitool mc chassis power status`
- `nc-toolbox nc-toolbox-runread ipmitool mc chassis status`
- `nc-toolbox nc-toolbox-runread ipmitool mc getenables`
- `nc-toolbox nc-toolbox-runread ipmitool mc getsysinfo`
- `nc-toolbox nc-toolbox-runread ipmitool mc guid`
- `nc-toolbox nc-toolbox-runread ipmitool mc info`
- `nc-toolbox nc-toolbox-runread ipmitool mc restart cause`
- `nc-toolbox nc-toolbox-runread ipmitool mc watchdog get`
- `nc-toolbox nc-toolbox-runread ipmitool bmc bootparam get`
- `nc-toolbox nc-toolbox-runread ipmitool bmc chassis poh`
- `nc-toolbox nc-toolbox-runread ipmitool bmc chassis policy list`
- `nc-toolbox nc-toolbox-runread ipmitool bmc chassis power status`
- `nc-toolbox nc-toolbox-runread ipmitool bmc chassis status`
- `nc-toolbox nc-toolbox-runread ipmitool bmc getenables`
- `nc-toolbox nc-toolbox-runread ipmitool bmc getsysinfo`
- `nc-toolbox nc-toolbox-runread ipmitool bmc guid`
- `nc-toolbox nc-toolbox-runread ipmitool bmc info`
- `nc-toolbox nc-toolbox-runread ipmitool bmc restart cause`
- `nc-toolbox nc-toolbox-runread ipmitool bmc watchdog get`
- `nc-toolbox nc-toolbox-runread ipmitool nm alert get`
- `nc-toolbox nc-toolbox-runread ipmitool nm capability`
- `nc-toolbox nc-toolbox-runread ipmitool nm discover`
- `nc-toolbox nc-toolbox-runread ipmitool nm policy get policy_id`
- `nc-toolbox nc-toolbox-runread ipmitool nm policy limiting`
- `nc-toolbox nc-toolbox-runread ipmitool nm statistics`
- `nc-toolbox nc-toolbox-runread ipmitool nm suspend get`
- `nc-toolbox nc-toolbox-runread ipmitool nm threshold get`
- `nc-toolbox nc-toolbox-runread ipmitool pef`
- `nc-toolbox nc-toolbox-runread ipmitool picmg addrinfo`
- `nc-toolbox nc-toolbox-runread ipmitool picmg policy get`
- `nc-toolbox nc-toolbox-runread ipmitool power status`
- `nc-toolbox nc-toolbox-runread ipmitool sdr elist`
- `nc-toolbox nc-toolbox-runread ipmitool sdr get`
- `nc-toolbox nc-toolbox-runread ipmitool sdr info`
- `nc-toolbox nc-toolbox-runread ipmitool sdr list`
- `nc-toolbox nc-toolbox-runread ipmitool sdr type`
- `nc-toolbox nc-toolbox-runread ipmitool sel elist`
- `nc-toolbox nc-toolbox-runread ipmitool sel get`
- `nc-toolbox nc-toolbox-runread ipmitool sel info`
- `nc-toolbox nc-toolbox-runread ipmitool sel list`
- `nc-toolbox nc-toolbox-runread ipmitool sel time get`
- `nc-toolbox nc-toolbox-runread ipmitool sensor get`
- `nc-toolbox nc-toolbox-runread ipmitool sensor list`
- `nc-toolbox nc-toolbox-runread ipmitool session info`
- `nc-toolbox nc-toolbox-runread ipmitool sol info`
- `nc-toolbox nc-toolbox-runread ipmitool sol payload status`
- `nc-toolbox nc-toolbox-runread ipmitool user list`
- `nc-toolbox nc-toolbox-runread ipmitool user summary`
- *`nc-toolbox nc-toolbox-runread racadm arp`*
- *`nc-toolbox nc-toolbox-runread racadm coredump`*
- `nc-toolbox nc-toolbox-runread racadm diagnostics`
- `nc-toolbox nc-toolbox-runread racadm eventfilters get`
- `nc-toolbox nc-toolbox-runread racadm fcstatistics`
- `nc-toolbox nc-toolbox-runread racadm get`
- `nc-toolbox nc-toolbox-runread racadm getconfig`
- `nc-toolbox nc-toolbox-runread racadm gethostnetworkinterfaces`
- *`nc-toolbox nc-toolbox-runread racadm getled`*
- `nc-toolbox nc-toolbox-runread racadm getniccfg`
- `nc-toolbox nc-toolbox-runread racadm getraclog`
- `nc-toolbox nc-toolbox-runread racadm getractime`
- `nc-toolbox nc-toolbox-runread racadm getsel`
- `nc-toolbox nc-toolbox-runread racadm getsensorinfo`
- `nc-toolbox nc-toolbox-runread racadm getssninfo`
- `nc-toolbox nc-toolbox-runread racadm getsvctag`
- `nc-toolbox nc-toolbox-runread racadm getsysinfo`
- `nc-toolbox nc-toolbox-runread racadm gettracelog`
- `nc-toolbox nc-toolbox-runread racadm getversion`
- `nc-toolbox nc-toolbox-runread racadm hwinventory`
- *`nc-toolbox nc-toolbox-runread racadm ifconfig`*
- *`nc-toolbox nc-toolbox-runread racadm inlettemphistory get`*
- `nc-toolbox nc-toolbox-runread racadm jobqueue view`
- `nc-toolbox nc-toolbox-runread racadm lclog view`
- `nc-toolbox nc-toolbox-runread racadm lclog viewconfigresult`
- `nc-toolbox nc-toolbox-runread racadm license view`
- *`nc-toolbox nc-toolbox-runread racadm netstat`*
- `nc-toolbox nc-toolbox-runread racadm nicstatistics`
- `nc-toolbox nc-toolbox-runread racadm ping`
- `nc-toolbox nc-toolbox-runread racadm ping6`
- *`nc-toolbox nc-toolbox-runread racadm racdump`*
- `nc-toolbox nc-toolbox-runread racadm sslcertview`
- *`nc-toolbox nc-toolbox-runread racadm swinventory`*
- *`nc-toolbox nc-toolbox-runread racadm systemconfig getbackupscheduler`*
- `nc-toolbox nc-toolbox-runread racadm systemperfstatistics` (PeakReset argument NOT allowed)
- *`nc-toolbox nc-toolbox-runread racadm techsupreport getupdatetime`*
- `nc-toolbox nc-toolbox-runread racadm traceroute`
- `nc-toolbox nc-toolbox-runread racadm traceroute6`
- `nc-toolbox nc-toolbox-runread racadm usercertview`
- *`nc-toolbox nc-toolbox-runread racadm vflashsd status`*
- *`nc-toolbox nc-toolbox-runread racadm vflashpartition list`*
- *`nc-toolbox nc-toolbox-runread racadm vflashpartition status -a`*
- `nc-toolbox nc-toolbox-runread mstregdump`
- `nc-toolbox nc-toolbox-runread mstconfig`   (requires `query` arg )
- `nc-toolbox nc-toolbox-runread mstflint`    (requires `query` arg )
- `nc-toolbox nc-toolbox-runread mstlink`     (requires `query` arg )
- `nc-toolbox nc-toolbox-runread mstfwmanager` (requires `query` arg )
- `nc-toolbox nc-toolbox-runread mlx_temp`

The command syntax is:
```azurecli
az networkcloud baremetalmachine run-read-command --name "<machine-name>"
    --limit-time-seconds "<timeout>" \
    --commands '[{"command":"<command1>"},{"command":"<command2>","arguments":["<arg1>","<arg2>"]}]' \
    --resource-group "<cluster_MRG>" \
    --subscription "<subscription>"
```

Multiple commands can be provided in json format to `--commands` option.

For a command with multiple arguments, provide as a list to `arguments` parameter. See [Azure CLI Shorthand](https://github.com/Azure/azure-cli/blob/dev/doc/shorthand_syntax.md) for instructions on constructing the `--commands` structure.

These commands can be long running so the recommendation is to set `--limit-time-seconds` to at least 600 seconds (10 minutes). Running multiple extracts might take longer that 10 minutes.

This command runs synchronously. If you wish to skip waiting for the command to complete, specify the `--no-wait --debug` options. For more information, see [how to track asynchronous operations](howto-track-async-operations-cli.md).

When an optional argument `--output-directory` is provided, the output result is downloaded and extracted to the local directory.

### This example executes the `hostname` command and a `ping` command

```azurecli
az networkcloud baremetalmachine run-read-command --name "<bareMetalMachineName>" \
    --limit-time-seconds 60 \
    --commands '[{"command":"hostname"},{"command":"ping","arguments":["198.51.102.1","-c","3"]}]' \
    --resource-group "<cluster_MRG>" \
    --subscription "<subscription>"
```

### This example executes the `racadm getsysinfo -c` command

```azurecli
az networkcloud baremetalmachine run-read-command --name "<bareMetalMachineName>" \
    --limit-time-seconds 60 \
    --commands '[{"command":"nc-toolbox nc-toolbox-runread racadm getsysinfo","arguments":["-c"]}]' \
    --resource-group "<cluster_MRG>" \
    --subscription "<subscription>"
```

## Checking command status and viewing output

Sample output is shown. It prints the top 4,000 characters of the result to the screen for convenience and provides a short-lived link to the storage blob containing the command execution result. You can use the link to download the zipped output file (tar.gz).

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

## How to view the output of an `az networkcloud baremetalmachine run-read-command` in the Cluster Manager Storage account

This guide walks you through accessing the output file that is created in the Cluster Manager Storage account when an `az networkcloud baremetalmachine run-read-command` is executed on a server. The name of the file is identified in the `az rest` status output.

1. Open the Cluster Manager Managed Resource Group for the Cluster where the server is housed and then select the **Storage account**.

1. In the Storage account details, select **Storage browser** from the navigation menu on the left side.

1. In the Storage browser details, select on **Blob containers**.

1. Select the baremetal-run-command-output blob container.

1. Select the output file from the run-read command. The file name can be identified from the `az rest --method get` command. Additionally, the **Last modified** timestamp aligns with when the command was executed.

1. You can manage & download the output file from the **Overview** pop-out.
