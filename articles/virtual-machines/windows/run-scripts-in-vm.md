---
title: Run scripts in a Windows VM
description: This topic describes how to run scripts within a virtual machine
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

The [Run Command](run-command.md) feature provides general machine and application management for VMs using scripts.

* Requires VM contributor or higher priviledges
* Available by default
* VM does not need to be network connected or have RDP access
* Can run any custom script (PowerShell for Windows, shell script for Linux)
* Available through [Azure portal](run-command.md), [REST API](/rest/api/compute/virtual%20machines%20run%20commands/runcommand), [Azure CLI](/cli/azure/vm/run-command?view=azure-cli-latest#az-vm-run-command-invoke), or [PowerShell](/powershell/module/azurerm.compute/invoke-azurermvmruncommand)

## Hybrid Runbook Worker

The [Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md) runs user's runbooks (scripts) from the Automation account in the VM.

* Requires manual onboarding (VM Contributor or higher), Automation account (Contributor), Log Analytics workspace (Contributor) with Automation solution
* Manual installation
* VM needs to be network connected
* Scripts are stored in Automation Account
* Runs PowerShell, PowerShell workflow, Python, or Graphical runbooks
* Runbooks are stored and managed in an Automation Account
* There is no time limit on script runtime
* Supports job concurrency (multiple jobs can run at same time)
* Full script output is returned and stored
* Job history is available (90 days)
* Run As capability - Hybrid Runbook Workers can run as Local System or with user-supplied credentials
* Run jobs via the Azure portal or API

## Serial console

The [Serial console](serial-console.md) provides direct access to a VM, similar to having a keyboard connected to the VM.

* Available in the portal
* Requires VM Contributor or higher privileges
* Requires boot diagnostics enabled on the VM and a storage account
* Not able to run scripts
* User must login with local user account
* Commands must be typed in character by character
* Session audit logs stored in boot diagnostics logs
