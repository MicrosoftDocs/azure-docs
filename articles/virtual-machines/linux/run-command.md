---
title: Run shell scripts in an Linux VM on Azure
description: This topic describes how to run scripts within a virtual machine
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 05/02/2018
ms.topic: article
manager: carmonm
---
# Run shell scripts in your Linux VM with Run command

Run command allows you to run scripts within a VM regardless of network connectivity. For Linux it runs shell scripts, that allow general machine management, and can be used to quickly diagnose and remediate VM access and network issues and get the VM back to a good state.

## Prerequisites

The account using the serial console must have [Contributor role](../../role-based-access-control/built-in-roles.md) for the VM.

## Benefits

There are multiple options that can be used to access your virtual machines. Run command can run scripts on your VMs regardless of network connectivity and is available by default on your virtual machines. Run command can be used through the Azure portal, [REST API](/rest/api/compute/virtual%20machines%20run%20commands/runcommand), [Azure CLI](/cli/azure/vm/run-command?view=azure-cli-latest#az-vm-run-command-invoke), or [PowerShell](/powershell/module/azurerm.compute/invoke-azurermvmruncommand).

This capability is useful in scenarios when you are unable to access a VM due to improper network or administrative user configuration.

## Restrictions

The following are a list of restrictions that are present when using run command.

* Output limited to last 4096 bytes
* Minimum time to run a script about 20 seconds
* Scripts run as System on Windows and as elevated user on Linux
* Can only run one script at a time
* Cannot cancel running script (current default timeout is 90 minutes)

## Run a command

Navigate to a VM in the [Azure portal](https://portal.azure.com) and select **Run command** under **OPERATIONS**. You are presented with a list of the available commands to run on the VM.

![Run command list](./media/run-command/run-command-list.png)

Choose a command to run. Some of the default commands may contain parameters. For those commands the parameters are presented to you as text fields to provide the input. For each command you can view the script that is being ran by expanding **View script**. **RunShellScript** is different from the others as it allows you to provide your own script.

> [!NOTE]
> Default commands are not editable.

Once the command is chosen, click **Run** to run the script. The script runs and when complete, returns the results in the output window. The following screenshot shows an example output from running the **ifconfig** command.

![Run command script output](./media/run-command/run-command-script-output.png)

## Default commands

The follow table shows the list of default commands available. The **RunShellScript** command can be used to run any custom script you need.

|**Name**|**Description**|
|---|---|
|**RunShellScript**|Executes a Linux shell script.|
|**ifconfig**| Get the configuration of all network interfaces.|

## Azure CLI

The following is an example using the [az vm run-command](/cli/azure/vm/run-command?view=azure-cli-latest#az-vm-run-command-invoke) command to run a shell script on an Azure VM.

```azurecli-interactive
az vm run-command invoke -g MyResourceGroup -n MyVm --command-id RunShellScript --scripts "sudo apt-get update && sudo apt-get install -y nginx"
```

## Limiting access to run command

Run command is available for users with the VM Contributor or higher permissions. In order to limit the access to this feature remove the VM Contributor or higher role from the user's roles.

## Next steps