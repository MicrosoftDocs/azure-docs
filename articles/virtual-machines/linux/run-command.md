---
title: Run scripts in a Windows VM
description: This topic describes how to run scripts within a virtual machine
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 04/30/2018
ms.topic: article
manager: carmonm
---
# Run scripts in your Linux VM with Run command

Run command allows you to run scripts within a VM regardless of network connectivity. For Linux it runs shell scripts, that allow general machine management, and can be used to quickly diagnose and remediate VM access and network issues and get the VM back to a good state.

## Benefits

There are multiple options that can be used to access your virtual machines. Run command can run scripts on your VMs regardless of network connectivity and is available by default on your virtual machines.

This capability is useful in scenarios when you are unable to access a VM due to improper network or administrative user configuration.

## Configuration constraints

The follow are a list of configuration constaints that are present when using run command.

* Output limited to last 4096 bytes
* Minimum time to run a script about 20 seconds
* Scripts run as System on Windows and as elevated user on Linux
* Can only run one script at a time
* Cannot cancel running script (current default timeout is 90 minutes)

## Run a command

Navigate to a VM in the [Azure portal](https://portal.azure.com) and select **Run command** under **OPERATIONS**. You are presented with a list of the available commands to run on the VM.

![Run command list](./media/run-command/run-command-list.png)

Choose a command to run. Some commands have parameters, and the **RunShellScript** allows you to provide your own script. When done, click **Run** to run the script. The script runs and when complete, returns the output in the output window. The following screenshot shows an example output from the **ifconfig** command.

![Run command script output](./media/run-command/run-command-script-output.png)

## Default commands

The follow table shows the list of default commands available. The **RunShellScript** command can be used to run any custom script you need.

|**Name**|**Description**|
|---|---|
|**RunShellScript**|Executes a Linux shell script.|
|**ifconfig**| Get the configuration of all network interfaces.|

## Limiting access to run command

Run command is available for users with the VM Contributor or higher permissions. In order to limit the access to this feature remove the VM Contributor or higher role from the user's roles.

## Next steps