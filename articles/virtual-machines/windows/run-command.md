---
title: Run PowerShell scripts in a Windows VM in Azure
description: This topic describes how to run PowerShell scripts within an Azure Windows virtual machine by using the Run Command feature
services: automation
ms.service: virtual-machines
author: bobbytreed
ms.author: robreed
ms.date: 04/26/2019
ms.topic: how-to
manager: carmonm
---
# Run PowerShell scripts in your Windows VM by using Run Command

The Run Command feature uses the virtual machine (VM) agent to run PowerShell scripts within an Azure Windows VM. You can use these scripts for general machine or application management. They can help you to quickly diagnose and remediate VM access and network issues and get the VM back to a good state.



## Benefits

You can access your virtual machines in multiple ways. Run Command can run scripts on your virtual machines remotely by using the VM agent. You use Run Command through the Azure portal, [REST API](/rest/api/compute/virtual%20machines%20run%20commands/runcommand), or [PowerShell](https://docs.microsoft.com/powershell/module/az.compute/invoke-azvmruncommand) for Windows VMs.

This capability is useful in all scenarios where you want to run a script within a virtual machine. It's one of the only ways to troubleshoot and remediate a virtual machine that doesn't have the RDP or SSH port open because of improper network or administrative user configuration.

## Restrictions

The following restrictions apply when you're using Run Command:

* Output is limited to the last 4,096 bytes.
* The minimum time to run a script is about 20 seconds.
* Scripts run as System on Windows.
* One script at a time can run.
* Scripts that prompt for information (interactive mode) are not supported.
* You can't cancel a running script.
* The maximum time a script can run is 90 minutes. After that, it will time out.
* Outbound connectivity from the VM is required to return the results of the script.

> [!NOTE]
> To function correctly, Run Command requires connectivity (port 443) to Azure public IP addresses. If the extension doesn't have access to these endpoints, the scripts might run successfully but not return the results. If you're blocking traffic on the virtual machine, you can use [service tags](../../virtual-network/security-overview.md#service-tags) to allow traffic to Azure public IP addresses by using the `AzureCloud` tag.

## Available commands

This table shows the list of commands available for Windows VMs. You can use the **RunPowerShellScript** command to run any custom script that you want. When you're using the Azure CLI or PowerShell to run a command, the value that you provide for the `--command-id` or `-CommandId` parameter must be one of the following listed values. When you specify a value that is not an available command, you receive this error:

```error
The entity was not found in this Azure location
```

|**Name**|**Description**|
|---|---|
|**RunPowerShellScript**|Runs a PowerShell script.|
|**EnableRemotePS**|Configures the machine to enable remote PowerShell.|
|**EnableAdminAccount**|Checks if the local administrator account is disabled, and if so enables it.|
|**IPConfig**| Shows detailed information for the IP address, subnet mask, and default gateway for each adapter bound to TCP/IP.|
|**RDPSettings**|Checks registry settings and domain policy settings. Suggests policy actions if the machine is part of a domain or modifies the settings to default values.|
|**ResetRDPCert**|Removes the TLS/SSL certificate tied to the RDP listener and restores the RDP listener security to default. Use this script if you see any issues with the certificate.|
|**SetRDPPort**|Sets the default or user-specified port number for Remote Desktop connections. Enables firewall rules for inbound access to the port.|

## Azure CLI

The following example uses the [az vm run-command](/cli/azure/vm/run-command?view=azure-cli-latest#az-vm-run-command-invoke) command to run a shell script on an Azure Windows VM.

```azurecli-interactive
# script.ps1
#   param(
#       [string]$arg1,
#       [string]$arg2
#   )
#   Write-Host This is a sample script with parameters $arg1 and $arg2

az vm run-command invoke  --command-id RunPowerShellScript --name win-vm -g my-resource-group \
    --scripts @script.ps1 --parameters "arg1=somefoo" "arg2=somebar"
```

## Azure portal

Go to a VM in the [Azure portal](https://portal.azure.com) and select **Run command** under **OPERATIONS**. You see a list of the available commands to run on the VM.

![List of commands](./media/run-command/run-command-list.png)

Choose a command to run. Some of the commands might have optional or required input parameters. For those commands, the parameters are presented as text fields for you to provide the input values. For each command, you can view the script that's being run by expanding **View script**. **RunPowerShellScript** is different from the other commands, because it allows you to provide your own custom script.

> [!NOTE]
> The built-in commands are not editable.

After you choose the command, select **Run** to run the script. After the script finishes, it returns the output and any errors in the output window. The following screenshot shows an example output from running the **RDPSettings** command.

![Run command script output](./media/run-command/run-command-script-output.png)

## PowerShell

The following example uses the [Invoke-AzVMRunCommand](https://docs.microsoft.com/powershell/module/az.compute/invoke-azvmruncommand) cmdlet to run a PowerShell script on an Azure VM. The cmdlet expects the script referenced in the `-ScriptPath` parameter to be local to where the cmdlet is being run.

```azurepowershell-interactive
Invoke-AzVMRunCommand -ResourceGroupName '<myResourceGroup>' -Name '<myVMName>' -CommandId 'RunPowerShellScript' -ScriptPath '<pathToScript>' -Parameter @{"arg1" = "var1";"arg2" = "var2"}
```

## Limiting access to Run Command

Listing the run commands or showing the details of a command requires the `Microsoft.Compute/locations/runCommands/read` permission. The built-in [Reader](../../role-based-access-control/built-in-roles.md#reader) role and higher levels have this permission.

Running a command requires the `Microsoft.Compute/virtualMachines/runCommand/action` permission. The [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role and higher levels have this permission.

You can use one of the [built-in roles](../../role-based-access-control/built-in-roles.md) or create a [custom role](../../role-based-access-control/custom-roles.md) to use Run Command.

## Next steps

To learn about other ways to run scripts and commands remotely in your VM, see [Run scripts in your Windows VM](run-scripts-in-vm.md).
