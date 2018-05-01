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
# Run scripts in your VM with Run command

Run command provides general machine management. It can be used to quickly diagnose and remediate VM access and network issues and get the VM back to a good state. It runs PowerShell commands in a Windows VM allowing you to run management tasks within the OS - machine management, application management, troubleshooting, and remediation.

## Limitations

* Output limited to last 4096 bytes
* Minimum time to run a script about 20 seconds
* Scripts run as System  on Windows and as elevated user on Linux
* Can run one script at a time
* Cannot cancel running script (current default timeout is 90 minutes)

## Prerequisites

* VM does not need to be network connected.
* User does not need Remote Desktop access

	o Use to quickly run PowerShell commands in Windows VM or shell script commands in Linux VM
	o Can run any custom script (PowerShell for Windows, shell script for Linux)
	o Custom scripts
		o Windows
			○ RunPowerShellScript - Execute a custom PowerShell script
		o Linux
			○ RunShellScript - Execute a custom Linux shell script
	o Can run built-in commands for troubleshooting access/connectivity.
	o Script passed directly in POST call (so can't be called from ARM template)
	o Available by default.  No setup or configuration required
	o Available through Azure portal or REST API or CLI API or PowerShell cmdlets
	o Things to know
		o When a runcommand command is run an activity log is written on the VM

## Available commands

|**Name**|**Description**|
|---|---|
|EnableRemotePS|Configures the machine to enable remote PowerShell.|
|IPConfig| Shows detailed information for the IP address, subnet mask and default gateway for each adapter bound to TCP/IP.|
|RunPowerShellScript|Executes a PowerShell script|
|EnableAdminAccount|Checks if the local Administrator account is disabled, and if so enables it.|
|ResetAccountPassword| Resets built-in Administrator account password.|
|RDPSettings|Checks registry settings and domain policy settings. Suggests policy actions if machine is part of a domain or modifies the settings to default values.|
|SetRDPPort|Sets the default or user specified port number for Remote Desktop connections. Enables firewall rule for inbound access to the port.|
|ResetRDPCert|Removes the SSL certificate tied to the RDP listener and restores the RDP listerner security to default. Use this script if you see any issues with the certificate.|

## Disabling permissions to run command

Remove the VM Contributor or higher role from the user's roles.

## Next steps

