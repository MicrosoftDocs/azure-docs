---
title: Run scripts in a Linux VM
description: This topic describes how to run scripts within a virtual machine
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 05/02/2018
ms.topic: article
manager: carmonm
---
# Run scripts in your Linux VM

To automate tasks or troubleshoot issues, you may need to run commands in a VM. The following article gives a brief overview of the technologies that are available to run scripts within your VMs.

|Technology  |Description  |Uses  |
|---------|---------|---------|
|[Custom Script Extension](extensions-customscript.md)     |Can use through ARM template</br>Reference script from a URL</br>VM must be reachable through network        | Post deployment configuration</br>Software installation        |
|[Run Command](run-command.md)     |Does not need to be network connected</br>Do not need RDP access</br>Can run any custom script (PowerShell for Windows, shell script for Linux)</br>Available through Azure portal or REST API or CLI API</br>Available by default|Provides general machine and application management         |
|[Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md)     |VM needs to be network connected</br>Scripts are stored in Automation Account</br>Runs PowerShell, PowerShell workflow, Python, or Graphical runbooks</br>Manual installation         |Run user's runbooks (scripts) from the Automation account in the VM         |
|[Serial Console](serial-console.md)|Available in the portal</br>Requires boot diagnostics enabled on the VM and a storage account</br>User must login with local user account</br>Not able to run scripts|Similar to having a keyboard connected to the VM|

## Next steps