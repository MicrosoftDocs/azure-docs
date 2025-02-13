---
title: Troubleshoot bare metal machine issues using the `az networkcloud baremetalmachine run-read-command` for Operator Nexus
description: Step by step guide on using the `az networkcloud baremetalmachine run-read-command` to run diagnostic commands on a BMM.
author: eak13
ms.author: ekarandjeff
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 2/13/2025
ms.custom: template-how-to
---

# Troubleshoot BMM issues using the `az networkcloud baremetalmachine run-read-command`

There might be situations where a user needs to investigate and resolve issues with an on-premises bare metal machine (BMM). Operator Nexus provides the `az networkcloud baremetalmachine run-read-command` so users can run a curated list of read only commands to get information from a BMM.

The command produces an output file containing the results of the run-read command execution. By default, the data is sent to the Cluster Manager storage account. There's also a preview method where users can configure the Cluster resource with a storage account and identity that has access to the storage account to receive the output.

## Prerequisites

1. Install the latest version of the
   [appropriate CLI extensions](./howto-install-cli-extensions.md)
1. Ensure that the target BMM must have its `poweredState` set to `On` and have its `readyState` set to `True`
1. Get the Managed Resource group name (cluster_MRG) that you created for `Cluster` resource

## Send command output to a user specified storage account

See [Azure Operator Nexus Cluster support for managed identities and user provided resources](./howto-cluster-managed-identity-user-provided-resources.md)

### Clear the cluster's CommandOutputSettings

To change the cluster from a user-assigned identity to a system-assigned identity, the CommandOutputSettings must first be cleared using the command in the next section, then set using this command.

The CommandOutputSettings can be cleared, directing run-data-extract output back to the cluster manager's storage. However, it isn't recommended since it's less secure, and the option will be removed in a future release.

However, the CommandOutputSettings do need to be cleared if switching from a user-assigned identity to a system-assigned identity.

Use this command to clear the CommandOutputSettings:

```azurecli-interactive
az rest --method patch \
  --url  "https://management.azure.com/subscriptions/<subscription>/resourceGroups/<cluster-resource-group>/providers/Microsoft.NetworkCloud/clusters/<cluster-name>?api-version=2024-08-01-preview" \
  --body '{"properties": {"commandOutputSettings":null}}'
```

## DEPRECATED METHOD: Verify access to the Cluster Manager storage account

> [!IMPORTANT]
> The Cluster Manager storage account is targeted for removal in April 2025 at the latest. If you're using this method today for command output, consider converting to using a user provided storage account.

If using the Cluster Manager storage method, verify you have access to the Cluster Manager's storage account:

1. From Azure portal, navigate to Cluster Manager's Storage account.
1. In the Storage account details, select **Storage browser** from the navigation menu on the left side.
1. In the Storage browser details, select on **Blob containers**.
1. If you encounter a `403 This request is not authorized to perform this operation.` while accessing the storage account, storage account’s firewall settings need to be updated to include the public IP address.
1. Request access by creating a support ticket via Portal on the Cluster Manager resource. Provide the public IP address that requires access.

## Execute a run-read command

The run-read command lets you run a command on the BMM that doesn't change anything. Some commands have more
than one word, or need an argument to work. These commands are made like this to separate them from the ones
that can change things. For example, run-read-command can use `kubectl get` but not `kubectl apply`. When you
use these commands, you have to put all the words in the "command" field. For example,
`{command:'kubectl get',arguments:[nodes]}` is right; `{command:kubectl,arguments:[get,nodes]}`
is wrong.

Also note that some commands begin with `nc-toolbox nc-toolbox-runread` and must be entered as shown.
`nc-toolbox-runread` is a special container image that includes more tools that aren't installed on the
bare metal host, such as `ipmitool` and `racadm`.

Some of the run-read commands require specific arguments be supplied to enforce read-only capabilities of the commands.
An example of run-read commands that require specific arguments is the allowed Mellanox command `mstconfig`,
which requires the `query` argument be provided to enforce read-only.

> [!WARNING]
> Microsoft doesn't provide or support any Operator Nexus API calls that expect plaintext username and/or password to be supplied. Note any values sent are logged and are considered exposed secrets, which should be rotated and revoked. The Microsoft documented method for securely using secrets is to store them in an Azure Key Vault. If you have specific questions or concerns, submit a request via the Azure portal.

This list shows the commands you can use. Commands in `*italics*` can't have `arguments`; the rest can.

- `arp`
- `brctl show`
- `dmidecode`
- _`fdisk -l`_
- `host`
- _`hostname`_
- _`ifconfig -a`_
- _`ifconfig -s`_
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
- _`mount`_
- `ping`
- _`ss`_
- `tcpdump`
- `traceroute`
- `uname`
- _`ulimit -a`_
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
- _`nc-toolbox nc-toolbox-runread racadm arp`_
- _`nc-toolbox nc-toolbox-runread racadm coredump`_
- `nc-toolbox nc-toolbox-runread racadm diagnostics`
- `nc-toolbox nc-toolbox-runread racadm eventfilters get`
- `nc-toolbox nc-toolbox-runread racadm fcstatistics`
- `nc-toolbox nc-toolbox-runread racadm get`
- `nc-toolbox nc-toolbox-runread racadm getconfig`
- `nc-toolbox nc-toolbox-runread racadm gethostnetworkinterfaces`
- _`nc-toolbox nc-toolbox-runread racadm getled`_
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
- _`nc-toolbox nc-toolbox-runread racadm ifconfig`_
- _`nc-toolbox nc-toolbox-runread racadm inlettemphistory get`_
- `nc-toolbox nc-toolbox-runread racadm jobqueue view`
- `nc-toolbox nc-toolbox-runread racadm lclog view`
- `nc-toolbox nc-toolbox-runread racadm lclog viewconfigresult`
- `nc-toolbox nc-toolbox-runread racadm license view`
- _`nc-toolbox nc-toolbox-runread racadm netstat`_
- `nc-toolbox nc-toolbox-runread racadm nicstatistics`
- `nc-toolbox nc-toolbox-runread racadm ping`
- `nc-toolbox nc-toolbox-runread racadm ping6`
- _`nc-toolbox nc-toolbox-runread racadm racdump`_
- `nc-toolbox nc-toolbox-runread racadm sslcertview`
- _`nc-toolbox nc-toolbox-runread racadm swinventory`_
- _`nc-toolbox nc-toolbox-runread racadm systemconfig getbackupscheduler`_
- `nc-toolbox nc-toolbox-runread racadm systemperfstatistics` (PeakReset argument NOT allowed)
- _`nc-toolbox nc-toolbox-runread racadm techsupreport getupdatetime`_
- `nc-toolbox nc-toolbox-runread racadm traceroute`
- `nc-toolbox nc-toolbox-runread racadm traceroute6`
- `nc-toolbox nc-toolbox-runread racadm usercertview`
- _`nc-toolbox nc-toolbox-runread racadm vflashsd status`_
- _`nc-toolbox nc-toolbox-runread racadm vflashpartition list`_
- _`nc-toolbox nc-toolbox-runread racadm vflashpartition status -a`_
- `nc-toolbox nc-toolbox-runread mstregdump`
- `nc-toolbox nc-toolbox-runread mstconfig` (requires `query` arg)
- `nc-toolbox nc-toolbox-runread mstflint` (requires `query` arg)
- `nc-toolbox nc-toolbox-runread mstlink` (requires `query` arg)
- `nc-toolbox nc-toolbox-runread mstfwmanager` (requires `query` arg)
- `nc-toolbox nc-toolbox-runread mlx_temp`

The command syntax for a single command with no arguments is as follows, using `hostname` as an example:

```azurecli
az networkcloud baremetalmachine run-read-command --name "<machine-name>"
    --limit-time-seconds "<timeout>" \
    --commands "[{command:hostname}]" \
    --resource-group "<cluster_MRG>" \
    --subscription "<subscription>"
```

- The `--commands` parameter always takes a list of commands, even if there's only one command.
- Multiple commands can be provided in json format using [Azure CLI Shorthand](https://aka.ms/cli-shorthand) notation.
- Any whitespace must be enclosed in single quotes.
- Any arguments for each command must also be provided as a list, as shown in the following examples.

```
--commands "[{command:hostname},{command:'nc-toolbox nc-toolbox-runread racadm ifconfig'}]"
--commands "[{command:hostname},{command:'nc-toolbox nc-toolbox-runread racadm getsysinfo',arguments:[-c]}]"
--commands "[{command:ping,arguments:[198.51.102.1,-c,3]}]"
```

These commands can be long running so the recommendation is to set `--limit-time-seconds` to at least 600 seconds (10 minutes). Running multiple commands might take longer than 10 minutes.

This command runs synchronously. If you wish to skip waiting for the command to complete, specify the `--no-wait --debug` options. For more information, see [how to track asynchronous operations](howto-track-async-operations-cli.md).

When an optional argument `--output-directory` is provided, the output result is downloaded and extracted to the local directory.

> [!WARNING]
> Using the `--output-directory` argument overwrites any files in the local directory that have the same name as the new files being created.

### This example executes a 'kubectl get pods'

```azurecli
az networkcloud baremetalmachine run-read-command --name "<bareMetalMachineName>" \
   --limit-time-seconds 60 \
   --commands "[{command:'kubectl get',arguments:[pods,-n,nc-system]}]" \
   --resource-group "<cluster_MRG>" \
   --subscription "<subscription>"
```

### This example executes the `hostname` command and a `ping` command

```azurecli
az networkcloud baremetalmachine run-read-command --name "<bareMetalMachineName>" \
    --limit-time-seconds 60 \
    --commands "[{command:hostname},{command:ping,arguments:[198.51.102.1,-c,3]}]" \
    --resource-group "<cluster_MRG>" \
    --subscription "<subscription>"
```

### This example executes the `racadm getsysinfo -c` command

```azurecli
az networkcloud baremetalmachine run-read-command --name "<bareMetalMachineName>" \
    --limit-time-seconds 60 \
    --commands "[{command:'nc-toolbox nc-toolbox-runread racadm getsysinfo',arguments:[-c]}]" \
    --resource-group "<cluster_MRG>" \
    --subscription "<subscription>"
```

## Check the command status and view the output in a user specified storage account

Sample output is shown. It prints the top 4,000 characters of the result to the screen for convenience and provides a short-lived link to the storage blob containing the command execution result. You can use the link to download the zipped output file (tar.gz). To access the output, users need the appropriate access to the storage blob. For information on assigning roles to storage accounts, see [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal).

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

## DEPRECATED: How to view the output of an `az networkcloud baremetalmachine run-read-command` in the Cluster Manager Storage account

This guide walks you through accessing the output file that is created in the Cluster Manager Storage account when an `az networkcloud baremetalmachine run-read-command` is executed on a server. The name of the file is identified in the `az rest` status output.

1. Open the Cluster Manager Managed Resource Group for the Cluster where the server is housed and then select the **Storage account**.

1. In the Storage account details, select **Storage browser** from the navigation menu on the left side.

1. In the Storage browser details, select on **Blob containers**.

1. Select the baremetal-run-command-output blob container.

1. Storage Account could be locked resulting in `403 This request is not authorized to perform this operation.` due to networking or firewall restrictions. Refer to the [cluster manager storage](#deprecated-method-verify-access-to-the-cluster-manager-storage-account) or the [customer-managed storage](#send-command-output-to-a-user-specified-storage-account) sections for procedures to verify access.

1. Select the output file from the run-read command. The file name can be identified from the `az rest --method get` command. Additionally, the **Last modified** timestamp aligns with when the command was executed.

1. You can manage & download the output file from the **Overview** pop-out.
