 W---
title: Run scripts in a Windows VM
description: This topic describes how to run scripts within a Windows virtual machine
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 05/02/2018
ms.topic: article
manager: carmonm
---
# Run scripts in your VM

To automate tasks or troubleshoot issues, you may need to run commands in a VM. The following article gives a brief overview of the features that are available to run scripts and commands within your VMs.

## Custom Script Extension

The [Custom Script Extension](extensions-customscript.md) is primarily used for post deployment configuration and software installation.

* Call from ARM template (to perform custom in-guest actions following VM creation)
* Script referenced by URL, so the script file must be in a storage location that is reachable by URL
* VM must be network connected
* Automatic installation

## Run command

The [Run Command](run-command.md) feature provides general VM and application management and troubleshooting using scripts.

* Available by default (no installation)
* VM does not need to be network connected
* Can run any custom script (PowerShell for Windows, shell script for Linux)
* Requires VM contributor or higher priviledges
* Available through [Azure portal](run-command.md), [REST API](/rest/api/compute/virtual%20machines%20run%20commands/runcommand), [Azure CLI](/cli/azure/vm/run-command?view=azure-cli-latest#az-vm-run-command-invoke), or [PowerShell](/powershell/module/azurerm.compute/invoke-azurermvmruncommand)

## Hybrid Runbook Worker

The [Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md) provides general machine and application management with user's custom scripts stored in an Automation account.

* Scripts stored and managed in an Automation Account
* Runs PowerShell, PowerShell workflow, Python, or Graphical runbooks
* No time limit on script run time
* Multiple scripts can run concurrently
* Full script output is returned and stored
* Job history available for 90 days
* Scripts can run as Local System or with user-supplied credentials
* Run scripts through the Azure portal or API
* Requires [manual installation](../../automation/automation-windows-hrw-install.md)
* Requires these previledges: VM Contributor (to install), Contributor on Automation account (to install and run), Contributor on Log Analytics workspace (to install)
* VM needs to be network connected

## Serial console

The [Serial console](serial-console.md) provides direct access to a VM, similar to having a keyboard connected to the VM.

* Available in the portal
* Requires VM Contributor privileges
* Requires boot diagnostics enabled on the VM and a storage account
* Must login to VM with a local user account
* Commands are typed in character by character
* Session audit logs stored in boot diagnostics logs
