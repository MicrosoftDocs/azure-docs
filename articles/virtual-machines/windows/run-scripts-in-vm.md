---
title: Run scripts in an Azure Windows VM
description: This topic describes how to run scripts within a Windows virtual machine
services: automation
ms.service: virtual-machines
ms.collection: windows
author: bobbytreed
ms.author: robreed
ms.reviewer: erd
ms.date: 03/20/2023
ms.topic: how-to

---
# Run scripts in your Windows VM

**Applies to:** VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

To automate tasks or troubleshoot issues, you may need to run commands in a VM. The following article gives a brief overview of the features that are available to run scripts and commands within your VMs.

## Custom Script Extension

The [Custom Script Extension](../extensions/custom-script-windows.md) is primarily used for post deployment configuration and software installation.

* Download and run scripts in Azure virtual machines.
* Can be run using Azure Resource Manager templates, Azure CLI, REST API, PowerShell, or Azure portal.
* Script files can be downloaded from Azure storage or GitHub, or provided from your PC when run from the Azure portal.
* Run PowerShell script in Windows machines and Bash script in Linux machines.
* Useful for post deployment configuration, software installation, and other configuration or management tasks.

## Run command

The [Run Command](run-command.md) feature enables virtual machine and application management and troubleshooting using scripts, and is available even when the machine is not reachable, for example if the guest firewall doesn't have the RDP or SSH port open.

* Run scripts in Azure virtual machines.
* Can be run using [Azure portal](run-command.md), [REST API](./run-command.md), [Azure CLI](/cli/azure/vm/run-command#az-vm-run-command-invoke), or [PowerShell](/powershell/module/az.compute/invoke-azvmruncommand)
* Quickly run a script and view output and repeat as needed in the Azure portal.
* Script can be typed directly or you can run one of the built-in scripts.
* Run PowerShell script in Windows machines and Bash script in Linux machines.
* Useful for virtual machine and application management and for running scripts in virtual machines that are unreachable.

## Hybrid Runbook Worker

The [Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md) provides general machine, application, and environment management with user's custom scripts stored in an Automation account.

* Run scripts in Azure and non-Azure machines.
* Can be run using Azure portal, Azure CLI, REST API, PowerShell, webhook.
* Scripts stored and managed in an Automation Account.
* Run PowerShell, PowerShell Workflow, Python, or Graphical runbooks
* No time limit on script run time.
* Multiple scripts can run concurrently.
* Full script output is returned and stored.
* Job history available for 90 days.
* Scripts can run as Local System or with user-supplied credentials.
* Requires [manual installation](../../automation/extension-based-hybrid-runbook-worker-install.md).



## Serial console

The [Serial console](/troubleshoot/azure/virtual-machines/serial-console-windows) provides direct access to a VM, similar to having a keyboard connected to the VM.

* Run commands in Azure virtual machines.
* Can be run using a text-based console to the machine in the Azure portal.
* Login to the machine with a local user account.
* Useful when access to the virtual machine is needed regardless of the machine's network or operating system state.

## Next steps

Learn more about the different features that are available to run scripts and commands within your VMs.

* [Custom Script Extension](../extensions/custom-script-windows.md)
* [Run Command](run-command.md)
* [Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md)
* [Serial console](/troubleshoot/azure/virtual-machines/serial-console-windows)
