---
title: Run PowerShell scripts in an Windows VM in Azure
description: This topic describes how to run PowerShell scripts within a virtual machine using Run command
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 05/02/2018
ms.topic: article
manager: carmonm
---
# Run PowerShell scripts in your Windows VM with Run command

Run command allows you to run PowerShell scripts within a VM regardless of network connectivity. These scripts can be used for general machine management, and can be used to quickly diagnose and remediate VM access and network issues and get the VM back to a good state.

## Prerequisites

The account using run command must have the [Contributor role](../../role-based-access-control/built-in-roles.md) for the VM.

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

Choose a command to run. Some of the default commands may contain parameters. For those commands the parameters are presented to you as text fields to provide the input. For each command you can view the script that is being ran by expanding **View script**. **RunPowerShellScript** is different from the others as it allows you to provide your own script.

> [!NOTE]
> Default commands are not editable.

Once the command is chosen, click **Run** to run the script. The script runs and when complete, returns the results in the output window. The following screenshot shows an example output from running the **RDPSettings** command.

![Run command script output](./media/run-command/run-command-script-output.png)

## Default commands

The follow table shows the list of default commands available for Windows VMs. The **RunPowerShellScript** command can be used to run any custom script you need.

|**Name**|**Description**|
|---|---|
|**EnableRemotePS**|Configures the machine to enable remote PowerShell.|
|**IPConfig**| Shows detailed information for the IP address, subnet mask and default gateway for each adapter bound to TCP/IP.|
|**RunPowerShellScript**|Executes a PowerShell script|
|**EnableAdminAccount**|Checks if the local Administrator account is disabled, and if so enables it.|
|**ResetAccountPassword**| Resets built-in Administrator account password.|
|**RDPSettings**|Checks registry settings and domain policy settings. Suggests policy actions if machine is part of a domain or modifies the settings to default values.|
|**SetRDPPort**|Sets the default or user specified port number for Remote Desktop connections. Enables firewall rule for inbound access to the port.|
|**ResetRDPCert**|Removes the SSL certificate tied to the RDP listener and restores the RDP listerner security to default. Use this script if you see any issues with the certificate.|

## PowerShell

The following is an example using the [Invoke-AzureRmVMRunCommand](/powershell/module/azurerm.compute/invoke-azurermvmruncommand) cmdlet to run a PowerShell script on an Azure VM.

```azurepowershell-interactive
Invoke-AzureRmVMRunCommand -ResourceGroupName '<myResourceGroup>' -Name '<myVMName>' -CommandId 'RunPowerShellScript' -ScriptPath '<pathToScript>' -Parameter @{"arg1" = "var1";"arg2" = "var2"}
```

## Limiting access to run command

Run command is available for users with the VM Contributor or higher permissions. In order to limit the access to this feature remove the VM Contributor or higher role from the user's roles.

## Next steps

