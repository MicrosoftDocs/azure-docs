---
title: Script Sample - Install the latest MARS agent on on-premises Windows servers
description: Learn how to use a script to install the latest MARS agent on your on-premises Windows servers in a storage account.
ms.topic: sample
ms.date: 06/23/2021
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# PowerShell Script to install the latest MARS agent on an on-premises Windows server

This script helps you to install the latest MARS agent on your on-premises Windows server.

## Sample script

```azurepowershell
<#

.SYNOPSIS
Sets MARS agent

.DESCRIPTION
Sets MARS agent

.ROLE
Administrators

#>
Set-StrictMode -Version 5.0
$ErrorActionPreference = "Stop"
Try {
    $agentPath = $env:TEMP + '\MARSAgentInstaller.exe'
    Invoke-WebRequest -Uri 'https://aka.ms/azurebackup_agent' -OutFile $agentPath
    & $agentPath /q | out-null

    $env:PSModulePath = (Get-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Session Manager\Environment' -Name PSModulePath).PSModulePath
    $azureBackupModuleName = 'MSOnlineBackup'
    $azureBackupModule = Get-Module -ListAvailable -Name $azureBackupModuleName
    if ($azureBackupModule) {
        $true
    }
    else {
        $false
    }
}
Catch {
    if ($error[0].ErrorDetails) {
        throw $error[0].ErrorDetails
    }
    throw $error[0]
}

```

## Next steps

[Learn more](../backup-client-automation.md) about how to use PowerShell to deploy and manage on-premises backups using MARS agent.